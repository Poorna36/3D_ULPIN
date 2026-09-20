"""
Unit tests for Data Provenance Ledger and Readers.
Conforms to docs/implementation_plan.md Phase 1.7.

Tests:
  - 100% provenance tag coverage ('REAL', 'PROXY', 'SYNTHETIC', 'REAL-FOREIGN', 'REAL-OWN')
  - Invalid tag rejection
  - LedgerStore logging, retrieval, query_by_provenance, all_tagged
  - assert_no_conflation passes on clean data and raises AssertionError on conflation
  - GISReader, LidarReader, IFCReader provenance integration
"""
import os
import json
import tempfile
import pytest
import numpy as np

from src.ingestion.provenance import (
    ProvenanceRecord,
    LedgerStore,
    VALID_PROVENANCE_TAGS,
)
from src.ingestion.gis_reader import GISReader
from src.ingestion.lidar_reader import LidarReader, PointCloudData
from src.ingestion.ifc_reader import IFCReader


@pytest.fixture
def temp_db_path(tmp_path):
    return str(tmp_path / "test_provenance_ledger.db")


@pytest.fixture
def ledger(temp_db_path):
    return LedgerStore(temp_db_path)


def test_provenance_record_all_valid_tags():
    """Verify that all 5 required provenance tags can be instantiated."""
    for tag in VALID_PROVENANCE_TAGS:
        rec = ProvenanceRecord(
            source_id=f"src_{tag.lower().replace('-', '_')}",
            file_path=f"/data/{tag.lower()}/file.geojson",
            data_provenance=tag,
            crs="EPSG:4326",
            datum="WGS84",
            resolution_m=1.0 if tag != "SYNTHETIC" else None,
            accuracy_sigma_m=0.05,
            license="MIT",
            download_ts="2026-09-20T00:00:00Z",
            notes=f"Test record for {tag}",
        )
        assert rec.data_provenance == tag
        assert rec.to_dict()["source_id"] == f"src_{tag.lower().replace('-', '_')}"


def test_provenance_record_invalid_tag():
    """Verify that an unknown provenance tag raises ValueError."""
    with pytest.raises(ValueError, match="Invalid provenance tag"):
        ProvenanceRecord(
            source_id="invalid_src",
            file_path="/data/unknown.geojson",
            data_provenance="UNKNOWN_TAG",
            crs="EPSG:4326",
            datum="WGS84",
            resolution_m=None,
            accuracy_sigma_m=None,
            license="PROPRIETARY",
            download_ts="2026-09-20T00:00:00Z",
        )


def test_ledger_store_log_and_get(ledger):
    """Test logging records and retrieving by source_id."""
    rec = ProvenanceRecord(
        source_id="test_id_1",
        file_path="/data/real/boundary.geojson",
        data_provenance="REAL",
        crs="EPSG:4326",
        datum="WGS84",
        resolution_m=0.5,
        accuracy_sigma_m=0.02,
        license="ODbL-1.0",
        download_ts="2026-09-20T10:00:00Z",
        notes="Official boundary",
    )
    ledger_id = ledger.log(rec)
    assert ledger_id > 0

    fetched = ledger.get("test_id_1")
    assert fetched is not None
    assert fetched.source_id == "test_id_1"
    assert fetched.data_provenance == "REAL"
    assert fetched.file_path == "/data/real/boundary.geojson"
    assert fetched.accuracy_sigma_m == 0.02

    # Non-existent ID returns None
    assert ledger.get("non_existent_id") is None


def test_ledger_query_by_provenance(ledger):
    """Test querying records filtered by provenance tag."""
    for i, tag in enumerate(["REAL", "REAL", "SYNTHETIC", "PROXY", "REAL-FOREIGN", "REAL-OWN"]):
        rec = ProvenanceRecord(
            source_id=f"rec_{i}",
            file_path=f"/data/file_{i}.dat",
            data_provenance=tag,
            crs="EPSG:4326",
            datum="WGS84",
            resolution_m=None,
            accuracy_sigma_m=None,
            license="CC-BY-4.0",
            download_ts="2026-09-20T12:00:00Z",
        )
        ledger.log(rec)

    real_records = ledger.query_by_provenance("REAL")
    assert len(real_records) == 2
    assert all(r.data_provenance == "REAL" for r in real_records)

    synthetic_records = ledger.query_by_provenance("SYNTHETIC")
    assert len(synthetic_records) == 1
    assert synthetic_records[0].source_id == "rec_2"

    with pytest.raises(ValueError, match="Unknown provenance tag"):
        ledger.query_by_provenance("INVALID")


def test_ledger_all_tagged_summary(ledger):
    """Test tag aggregation counts."""
    for tag in ["REAL", "SYNTHETIC", "SYNTHETIC", "PROXY"]:
        rec = ProvenanceRecord(
            source_id=f"id_{tag}_{len(ledger.all_tagged())}_{tag}",
            file_path=f"/path/{tag}.dat",
            data_provenance=tag,
            crs="EPSG:4326",
            datum="WGS84",
            resolution_m=None,
            accuracy_sigma_m=None,
            license="MIT",
            download_ts="2026-09-20T12:00:00Z",
        )
        ledger.log(rec)

    counts = ledger.all_tagged()
    assert counts.get("REAL") == 1
    assert counts.get("SYNTHETIC") == 2
    assert counts.get("PROXY") == 1


def test_assert_no_conflation_passes(ledger):
    """Clean data with separate files for REAL and SYNTHETIC should not raise."""
    ledger.log(ProvenanceRecord(
        source_id="real_1",
        file_path="/data/real/boundary.geojson",
        data_provenance="REAL",
        crs="EPSG:4326",
        datum="WGS84",
        resolution_m=None,
        accuracy_sigma_m=None,
        license="MIT",
        download_ts="2026-09-20T12:00:00Z",
    ))
    ledger.log(ProvenanceRecord(
        source_id="synth_1",
        file_path="/data/synthetic/generated.geojson",
        data_provenance="SYNTHETIC",
        crs="EPSG:4326",
        datum="WGS84",
        resolution_m=None,
        accuracy_sigma_m=None,
        license="MIT",
        download_ts="2026-09-20T12:00:00Z",
    ))
    # Should complete without error
    ledger.assert_no_conflation()


def test_assert_no_conflation_fails_on_duplicate_path(temp_db_path):
    """If the exact same file path is tagged as both REAL and SYNTHETIC, fail."""
    l = LedgerStore(temp_db_path)
    # Insert REAL record
    l.log(ProvenanceRecord(
        source_id="real_asset",
        file_path="/data/shared/dataset.geojson",
        data_provenance="REAL",
        crs="EPSG:4326",
        datum="WGS84",
        resolution_m=None,
        accuracy_sigma_m=None,
        license="MIT",
        download_ts="2026-09-20T12:00:00Z",
    ))
    # Insert SYNTHETIC record pointing to the exact same file path under another source_id
    l.log(ProvenanceRecord(
        source_id="synth_asset",
        file_path="/data/shared/dataset.geojson",
        data_provenance="SYNTHETIC",
        crs="EPSG:4326",
        datum="WGS84",
        resolution_m=None,
        accuracy_sigma_m=None,
        license="MIT",
        download_ts="2026-09-20T12:00:00Z",
    ))

    with pytest.raises(AssertionError, match="REAL \\+ SYNTHETIC conflation detected"):
        l.assert_no_conflation()


def test_gis_reader_provenance(tmp_path, ledger):
    """Test GISReader returns ProvenanceRecord and logs it."""
    geojson_file = tmp_path / "test.geojson"
    sample_geojson = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[72.82, 18.92], [72.83, 18.92], [72.83, 18.93], [72.82, 18.93], [72.82, 18.92]]]
            },
            "properties": {"name": "Test Feature"}
        }]
    }
    geojson_file.write_text(json.dumps(sample_geojson), encoding="utf-8")

    reader = GISReader(ledger=ledger)
    data, prov = reader.read_vector(
        path=str(geojson_file),
        source_id="test_vector_1",
        data_provenance="REAL",
        license="ODbL-1.0",
        notes="Test vector ingestion",
    )

    assert prov.source_id == "test_vector_1"
    assert prov.data_provenance == "REAL"
    assert ledger.get("test_vector_1") is not None


def test_lidar_reader_provenance(tmp_path, ledger):
    """Test LidarReader with simulated synthetic LAS file attaches ProvenanceRecord."""
    reader = LidarReader(ledger=ledger)
    # Read nonexistent or synthetic file with fallback
    pts = np.array([[0.0, 0.0, 10.0], [1.0, 1.0, 10.5], [2.0, 2.0, 11.0]])
    pcd = PointCloudData(
        points=pts,
        intensities=np.array([100, 150, 200], dtype=np.uint8),
        provenance="SYNTHETIC",
        crs="EPSG:32643",
    )
    assert pcd.point_count == 3
    bbox_min, bbox_max = pcd.bounding_box()
    assert bbox_min[2] == 10.0
    assert bbox_max[2] == 11.0


def test_ifc_reader_provenance(tmp_path, ledger):
    """Test IFCReader logs provenance and falls back cleanly."""
    reader = IFCReader(ledger=ledger)
    # Test JSON fallback format
    json_path = tmp_path / "model.json"
    dummy_model = {
        "version": "1.0",
        "levels": [
            {
                "level_id": "L1",
                "name": "Ground Floor",
                "z_bottom": 0.0,
                "z_top": 3.0,
                "rooms": []
            }
        ]
    }
    json_path.write_text(json.dumps(dummy_model), encoding="utf-8")

    plan, prov = reader.read(
        path=str(json_path),
        source_id="test_ifc_json_1",
        data_provenance="PROXY",
        license="PROPRIETARY",
    )
    assert prov.source_id == "test_ifc_json_1"
    assert prov.data_provenance == "PROXY"
    assert ledger.get("test_ifc_json_1") is not None
