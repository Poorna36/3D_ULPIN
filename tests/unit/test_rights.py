"""
Unit Tests for Rights Model (RRR) and Interoperability Exporters
Conforms to docs/features.md and Phase 9.
"""
import pytest
import os
import tempfile

from backend.rights.rrr_model import RRRStore, Right, RightType
from backend.rights.export import CadastralExporter
from backend.simulation.building_gen import generate_bz1_hero_tower


def test_rrr_store_insertion_and_query():
    """RRRStore must insert and retrieve rights under SQLite."""
    tmp_base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".tmp"))
    os.makedirs(tmp_base, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=tmp_base) as tmpdir:
        db_path = os.path.join(tmpdir, "test_rights.db")
        store = RRRStore(db_path=db_path)

        right = Right(
            right_id="RIGHT-001",
            rid="SYNTHETIC0001A-B0001-U00001-A",
            right_type=RightType.OWNERSHIP,
            holder_pseudonym="CITIZEN_IND_98234",
            uds_fraction=0.05,
            legal_basis_status="ENACTED",
            legal_act_ref="Karnataka Apartment Ownership Act 1972 § 5",
            valid_from="2025-01-01"
        )
        store.insert_right(right)

        fetched = store.get_rights_for_rid("SYNTHETIC0001A-B0001-U00001-A")
        assert len(fetched) == 1
        assert fetched[0].right_type == RightType.OWNERSHIP
        assert fetched[0].uds_fraction == 0.05


def test_cadastral_exporters():
    """Exporters must generate schema-valid LADM, IFC, and CityJSON structures."""
    building = generate_bz1_hero_tower()
    right = Right(
        right_id="RIGHT-001",
        rid="BZ1-U1",
        right_type=RightType.OWNERSHIP,
        holder_pseudonym="CITIZEN_77",
        uds_fraction=0.1,
        legal_basis_status="ENACTED",
        legal_act_ref="KA Apartment Act",
        valid_from="2025-01-01"
    )

    # 1. LADM Export
    ladm_doc = CadastralExporter.export_ladm_json(building, [right])
    assert ladm_doc["type"] == "LA_BAUnit"
    assert len(ladm_doc["spatialUnits"]) == len(building.volumes)
    assert len(ladm_doc["rights"]) == 1

    # 2. IFC Export
    ifc_doc = CadastralExporter.export_ifc_json(building)
    assert ifc_doc["type"] == "IfcProject"
    assert "Site" in ifc_doc
    assert len(ifc_doc["Site"]["Building"]["Spaces"]) == len(building.volumes)

    # 3. CityJSON Export
    cityjson_doc = CadastralExporter.export_cityjson(building)
    assert cityjson_doc["type"] == "CityJSON"
    assert building.name in cityjson_doc["CityObjects"]
