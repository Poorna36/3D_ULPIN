"""
Comprehensive Unit & Integration Tests for Phase 12 Architectural Weight Improvements
Conforms to docs/implementation_plan.md Phase 12 (12A, 12B, 12C, 12D, 12E).
"""
import pytest
from fastapi.testclient import TestClient
import trimesh
import numpy as np

from backend.api.main import app, get_registry_store
from backend.core.grammar import (
    get_statutory_anchor,
    Jurisdiction,
    StatutoryAnchor,
    JURISDICTION_STATUTORY_MAP
)
from backend.core.registry import RegistryStore
from backend.expected_model.rera_validator import compute_rera_compliance


import os
import tempfile
import backend.api.main as api_main
from backend.rights.rrr_model import RRRStore


@pytest.fixture
def client():
    tmp_base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".tmp"))
    os.makedirs(tmp_base, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=tmp_base) as tmpdir:
        reg_db = os.path.join(tmpdir, "test_phase12_reg.db")
        rrr_db = os.path.join(tmpdir, "test_phase12_rrr.db")

        # Point singletons to temporary DBs
        api_main._REGISTRY_STORE = RegistryStore(db_path=reg_db)
        api_main._RRR_STORE = RRRStore(db_path=rrr_db)
        api_main._ALLOCATOR = None  # Reset allocator to re-bind

        c = TestClient(app)
        yield c

        # Cleanup singletons
        api_main._REGISTRY_STORE = None
        api_main._RRR_STORE = None
        api_main._ALLOCATOR = None


def test_12a_statutory_anchor_mapping():
    """Verify statutory anchors for all classes across jurisdictions."""
    # MH Class U
    anchor_mh_u = get_statutory_anchor(cls="U", jurisdiction="IN_MH")
    assert "Maharashtra Apartment Ownership Act" in anchor_mh_u.act_name
    assert anchor_mh_u.statutory_basis == "ENACTED"

    # KA Class U
    anchor_ka_u = get_statutory_anchor(cls="U", jurisdiction="IN_KA")
    assert "Karnataka Apartment Ownership Act" in anchor_ka_u.act_name
    assert anchor_ka_u.statutory_basis == "ENACTED"

    # Metro E
    anchor_e = get_statutory_anchor(cls="E", jurisdiction="IN_MH")
    assert "Metro Railways" in anchor_e.act_name
    assert anchor_e.statutory_basis == "ENACTED"

    # Subterranean T
    anchor_t = get_statutory_anchor(cls="T", jurisdiction="IN_MH")
    assert "RFCTLARR" in anchor_t.citation
    assert anchor_t.statutory_basis == "ENACTED"

    # Airspace A
    anchor_a = get_statutory_anchor(cls="A", jurisdiction="IN_MH")
    assert "Aircraft Act 1934" in anchor_a.citation
    assert anchor_a.statutory_basis == "STATUTORY_RESTRICTION"

    # Sandbox
    anchor_sandbox = get_statutory_anchor(cls="U", jurisdiction="SANDBOX")
    assert anchor_sandbox.statutory_basis == "SANDBOX_BYPASS"


def test_12a_resolve_endpoint_statutory_anchor(client):
    """12A.3: Resolve a class-U RID and assert statutory anchor response."""
    box = trimesh.creation.box(extents=(10.0, 8.0, 3.0))
    alloc_payload = {
        "parent_ulpin": "27123456789012",
        "building_seq": "B0001",
        "cls": "U",
        "geometry": {
            "type": "Solid",
            "vertices": box.vertices.tolist(),
            "faces": box.faces.tolist()
        },
        "jurisdiction": "IN_MH",
        "data_provenance": "REAL"
    }
    alloc_resp = client.post("/allocate", json=alloc_payload)
    assert alloc_resp.status_code == 201
    rid = alloc_resp.json()["rid"]

    resolve_resp = client.get(f"/resolve/{rid}")
    assert resolve_resp.status_code == 200
    data = resolve_resp.json()
    assert data["rid"] == rid
    assert data["jurisdiction"] == "IN_MH"
    assert data["statutory_anchor"] is not None
    assert "Apartment Ownership Act" in data["statutory_anchor"]["act_name"]
    assert data["statutory_anchor"]["statutory_basis"] == "ENACTED"


def test_12b_legacy_identifier_crosswalk(client):
    """12B.5: Allocate RID with legacy CTS, then resolve via legacy parameters."""
    box = trimesh.creation.box(extents=(12.0, 10.0, 3.0))
    alloc_payload = {
        "parent_ulpin": "27987654321098",
        "building_seq": "B0002",
        "cls": "U",
        "geometry": {
            "type": "Solid",
            "vertices": box.vertices.tolist(),
            "faces": box.faces.tolist()
        },
        "jurisdiction": "IN_MH",
        "legacy_system": "CTS",
        "legacy_value": "Plot 412/1A",
        "data_provenance": "REAL"
    }
    alloc_resp = client.post("/allocate", json=alloc_payload)
    assert alloc_resp.status_code == 201
    assigned_rid = alloc_resp.json()["rid"]

    # Resolve using standard RID
    res_direct = client.get(f"/resolve/{assigned_rid}")
    assert res_direct.status_code == 200
    legacy_ids = res_direct.json()["legacy_ids"]
    assert len(legacy_ids) == 1
    assert legacy_ids[0]["id_system"] == "CTS"
    assert legacy_ids[0]["legacy_value"] == "Plot 412/1A"

    # Resolve crosswalk via query params
    res_crosswalk = client.get(f"/resolve/ANY_PLACEHOLDER?legacy_system=CTS&legacy_value=Plot+412%2F1A")
    assert res_crosswalk.status_code == 200
    assert res_crosswalk.json()["rid"] == assigned_rid


def test_12c_cover_geojson_3d(client):
    """12C.4: Test GET /cover with format=geojson_3d returns valid 3D properties."""
    # Allocate two volumes: Unit (U) and Elevated Corridor (E)
    box_u = trimesh.creation.box(extents=(5.0, 5.0, 3.0))
    # Translate to known lat/lon region (e.g. around 72.82, 18.92)
    box_u.apply_translation([72.825, 18.925, 10.0])

    client.post("/allocate", json={
        "parent_ulpin": "27000000000001",
        "building_seq": "B0003",
        "cls": "U",
        "geometry": {
            "type": "Solid",
            "vertices": box_u.vertices.tolist(),
            "faces": box_u.faces.tolist()
        },
        "jurisdiction": "IN_MH"
    })

    box_e = trimesh.creation.box(extents=(4.0, 4.0, 4.0))
    box_e.apply_translation([72.826, 18.926, 25.0])
    client.post("/allocate", json={
        "parent_ulpin": "27000000000001",
        "building_seq": "B0003",
        "cls": "E",
        "geometry": {
            "type": "Solid",
            "vertices": box_e.vertices.tolist(),
            "faces": box_e.faces.tolist()
        },
        "jurisdiction": "IN_MH"
    })

    # Query cover in geojson_3d format
    cover_resp = client.get("/cover?bbox=72.80,18.90,0,72.85,18.95,100&format=geojson_3d")
    assert cover_resp.status_code == 200
    fc = cover_resp.json()
    assert fc["type"] == "FeatureCollection"
    assert len(fc["features"]) >= 2

    # Check properties of 3D features
    classes_found = set()
    for feat in fc["features"]:
        assert feat["type"] == "Feature"
        props = feat["properties"]
        classes_found.add(props["cls"])
        assert props["extrudedHeight"] > props["height"]
        assert props["fill_color"].startswith("#")
        assert "coordinates" in feat["geometry"]
        assert feat["geometry"]["type"] == "Polygon"

    assert "U" in classes_found
    assert "E" in classes_found


def test_12d_rera_carpet_area_deviation(client):
    """12D.5: Allocate a unit with sanctioned area and test deviation metric in /validate."""
    # Create box with width 10m, depth 8.7m, height 3m -> footprint is 87 m²
    # Sanctioned is 84.5 m² -> deviation is 2.5 m² (2.96%), which triggers TOLERANCE_WARNING (2% to 5%)
    box = trimesh.creation.box(extents=(10.0, 8.7, 3.0))
    alloc_resp = client.post("/allocate", json={
        "parent_ulpin": "27555555555555",
        "building_seq": "B0004",
        "cls": "U",
        "geometry": {
            "type": "Solid",
            "vertices": box.vertices.tolist(),
            "faces": box.faces.tolist()
        },
        "jurisdiction": "IN_MH",
        "sanctioned_carpet_area_sqm": 84.5
    })
    assert alloc_resp.status_code == 201
    rid = alloc_resp.json()["rid"]

    val_resp = client.get(f"/validate/{rid}")
    assert val_resp.status_code == 200
    val_data = val_resp.json()

    assert val_data["rera_compliance"] is not None
    rera = val_data["rera_compliance"]
    assert rera["sanctioned_carpet_area_sqm"] == 84.5
    assert rera["as_built_carpet_area_sqm"] == pytest.approx(87.0, abs=0.5)
    assert 2.0 < rera["deviation_percentage"] <= 5.0
    assert rera["rera_compliance_status"] == "TOLERANCE_WARNING"
    assert "MahaRERA" in rera["statutory_citation"]


def test_12e_sandbox_arasaka_fictional_model(client):
    """12E.5: Allocate Arasaka Tower in SANDBOX jurisdiction, asserting state law bypass."""
    # Cyberpunk mega-structure box
    box = trimesh.creation.box(extents=(50.0, 50.0, 200.0))
    alloc_resp = client.post("/allocate", json={
        "parent_ulpin": "00000000000000",
        "building_seq": "B9999",
        "cls": "U",
        "geometry": {
            "type": "Solid",
            "vertices": box.vertices.tolist(),
            "faces": box.faces.tolist()
        },
        "jurisdiction": "SANDBOX",
        "data_provenance": "SYNTHETIC",
        "sanctioned_carpet_area_sqm": 1500.0
    })
    assert alloc_resp.status_code == 201
    rid = alloc_resp.json()["rid"]

    # 1. Resolve check
    resolve_resp = client.get(f"/resolve/{rid}")
    assert resolve_resp.status_code == 200
    res_data = resolve_resp.json()
    assert res_data["jurisdiction"] == "SANDBOX"
    assert res_data["statutory_anchor"]["statutory_basis"] == "SANDBOX_BYPASS"

    # 2. Validate check (T0/T1 pass, RERA exempt)
    val_resp = client.get(f"/validate/{rid}")
    assert val_resp.status_code == 200
    val_data = val_resp.json()
    assert val_data["overall_status"] == "PASS"
    assert val_data["rera_compliance"] is not None
    assert val_data["rera_compliance"]["rera_compliance_status"] == "EXEMPT_SANDBOX"
    assert "Synthetic Sandbox Exemption" in val_data["rera_compliance"]["statutory_citation"]
