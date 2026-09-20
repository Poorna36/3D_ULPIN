"""
Unit Tests for FastAPI 3D ULPIN REST Service Layer
Conforms to docs/contracts.md § 8.4 and Phase 10A.
"""
import os
import tempfile
import pytest
from fastapi.testclient import TestClient

from src.api.main import app, get_registry_store, get_rrr_store
import src.api.main as api_main
from src.core.registry import RegistryStore
from src.rights.rrr_model import RRRStore, Right, RightType


@pytest.fixture
def client_with_isolated_db():
    tmp_base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".tmp"))
    os.makedirs(tmp_base, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=tmp_base) as tmpdir:
        reg_db = os.path.join(tmpdir, "test_api_reg.db")
        rrr_db = os.path.join(tmpdir, "test_api_rrr.db")

        # Point singletons to temporary DBs
        api_main._REGISTRY_STORE = RegistryStore(db_path=reg_db)
        api_main._RRR_STORE = RRRStore(db_path=rrr_db)
        api_main._ALLOCATOR = None  # Reset allocator to re-bind

        client = TestClient(app)
        yield client

        # Cleanup singletons
        api_main._REGISTRY_STORE = None
        api_main._RRR_STORE = None
        api_main._ALLOCATOR = None


def test_api_allocate_and_resolve_flow(client_with_isolated_db):
    client = client_with_isolated_db

    # 1. POST /allocate
    payload = {
        "parent_ulpin": "MH2700010001AA",
        "building_seq": "B0001",
        "cls": "U",
        "geometry": {
            "type": "Solid",
            "extents": [12.0, 10.0, 3.2]
        },
        "evidence_refs": ["E1"],
        "plan_version": "1.0",
        "data_provenance": "SYNTHETIC",
        "boundary_convention": "INNER_FACE",
        "issuer_node_id": "MH"
    }
    resp = client.post("/allocate", json=payload)
    assert resp.status_code == 201, resp.text
    data = resp.json()
    assert "rid" in data
    assert data["ict_result"] == "NEW"
    assert data["version"] == 1
    rid = data["rid"]

    # 2. GET /resolve/{rid}
    resp_resolve = client.get(f"/resolve/{rid}?include_geometry=true")
    assert resp_resolve.status_code == 200, resp_resolve.text
    res_data = resp_resolve.json()
    assert res_data["rid"] == rid
    assert res_data["cls"] == "U"
    assert res_data["status"] in {"ALLOCATED", "ACTIVE"}
    assert res_data["parent_ulpin"] == "MH2700010001AA"
    assert "geometry" in res_data

    # 3. GET /resolve/non-existent-rid -> 404
    resp_404 = client.get("/resolve/MH2700010001AA-B9999-U9999-X")
    assert resp_404.status_code == 404


def test_api_verify_endpoint(client_with_isolated_db):
    client = client_with_isolated_db

    # Allocate unit
    payload = {
        "parent_ulpin": "MH2700010001AA",
        "building_seq": "B0001",
        "cls": "U",
        "geometry": {
            "type": "Solid",
            "extents": [10.0, 10.0, 3.0]
        },
        "data_provenance": "SYNTHETIC"
    }
    alloc_resp = client.post("/allocate", json=payload).json()
    rid = alloc_resp["rid"]

    # POST /verify with identical geometry -> MATCH
    verify_resp = client.post("/verify", json={
        "rid": rid,
        "geometry": {
            "type": "Solid",
            "extents": [10.0, 10.0, 3.0]
        }
    })
    assert verify_resp.status_code == 200
    v_data = verify_resp.json()
    assert v_data["result"] == "MATCH"
    assert v_data["ict_score"] == 1.0


def test_api_lineage_and_cover_and_validate(client_with_isolated_db):
    client = client_with_isolated_db

    # Allocate unit
    payload = {
        "parent_ulpin": "MH2700010001AA",
        "building_seq": "B0001",
        "cls": "U",
        "geometry": {
            "type": "Solid",
            "extents": [10.0, 10.0, 3.0]
        },
        "data_provenance": "SYNTHETIC"
    }
    alloc_resp = client.post("/allocate", json=payload).json()
    rid = alloc_resp["rid"]

    # 1. GET /lineage/{rid}
    lin_resp = client.get(f"/lineage/{rid}")
    assert lin_resp.status_code == 200
    lin_data = lin_resp.json()
    assert lin_data["rid"] == rid
    assert len(lin_data["versions"]) >= 1

    # 2. GET /cover
    cover_resp = client.get("/cover?bbox=-10,-10,-5,10,10,10&cls=U")
    assert cover_resp.status_code == 200
    cov_data = cover_resp.json()
    assert cov_data["type"] == "FeatureCollection"
    assert any(f["rid"] == rid for f in cov_data["features"])

    # 3. GET /validate/{rid}
    val_resp = client.get(f"/validate/{rid}?tiers=T0,T1,T4")
    assert val_resp.status_code == 200
    val_data = val_resp.json()
    assert val_data["rid"] == rid
    assert len(val_data["tier_results"]) >= 2
    assert "evidence_sufficiency" in val_data

    # 4. GET /explain/{finding_id} for a produced finding
    finding_id = val_data["tier_results"][0]["findings"][0]["finding_id"]
    exp_resp = client.get(f"/explain/{finding_id}")
    assert exp_resp.status_code == 200
    exp_data = exp_resp.json()
    assert exp_data["finding_id"] == finding_id

    # 5. Clear in-memory cache and verify fallback to SQLite audit_log
    api_main._FINDINGS_CACHE.clear()
    assert finding_id not in api_main._FINDINGS_CACHE
    exp_resp_evicted = client.get(f"/explain/{finding_id}")
    assert exp_resp_evicted.status_code == 200
    assert exp_resp_evicted.json()["finding_id"] == finding_id


def test_api_console_static_mount(client_with_isolated_db):
    client = client_with_isolated_db
    resp = client.get("/console/index.html")
    assert resp.status_code == 200
    assert "3D ULPIN Examiner Console" in resp.text


def test_api_validate_with_registered_rights(client_with_isolated_db):
    """Verifies that GET /validate/{rid} correctly executes T4 checks when rights exist."""
    client = client_with_isolated_db
    rrr_store = api_main.get_rrr_store()

    # Allocate unit
    payload = {
        "parent_ulpin": "MH2700010001AA",
        "building_seq": "B0001",
        "cls": "U",
        "geometry": {
            "type": "Solid",
            "extents": [10.0, 10.0, 3.0]
        },
        "data_provenance": "SYNTHETIC"
    }
    alloc_resp = client.post("/allocate", json=payload).json()
    rid = alloc_resp["rid"]

    # Register an ownership right with 100% UDS (1.0)
    rrr_store.insert_right(Right(
        right_id="RIGHT-TEST-01",
        rid=rid,
        right_type=RightType.OWNERSHIP,
        holder_pseudonym="CITIZEN-001",
        uds_fraction=1.0,
        legal_basis_status="ENACTED",
        legal_act_ref="Maharashtra Apartment Ownership Act 1970 § 5",
        valid_from="2026-09-20T00:00:00Z"
    ))

    val_resp = client.get(f"/validate/{rid}?tiers=T4")
    assert val_resp.status_code == 200
    data = val_resp.json()
    assert data["overall_status"] == "PASS"
    t4_result = [t for t in data["tier_results"] if t["tier"] == "T4"][0]
    assert t4_result["status"] == "PASS"
    assert len(t4_result["findings"]) == 1
    assert t4_result["findings"][0]["predicate"] == "T4_UDS_SUM"


def test_api_cover_spatial_bounding_box_filtering(client_with_isolated_db):
    """Verifies that GET /cover accurately filters based on 3D spatial extents."""
    client = client_with_isolated_db

    # Allocate Unit A at (10, 10, 5)
    payload_a = {
        "parent_ulpin": "MH2700010001AA",
        "building_seq": "B0001",
        "cls": "U",
        "geometry": {
            "type": "Solid",
            "vertices": [
                [10, 10, 0], [20, 10, 0], [20, 20, 0], [10, 20, 0],
                [10, 10, 5], [20, 10, 5], [20, 20, 5], [10, 20, 5]
            ],
            "faces": [[0, 1, 2], [0, 2, 3], [4, 5, 6], [4, 6, 7]]
        },
        "data_provenance": "SYNTHETIC"
    }
    resp_a = client.post("/allocate", json=payload_a).json()
    rid_a = resp_a["rid"]

    # Query bounding box that covers Unit A
    in_box = client.get("/cover?bbox=5,5,-1,25,25,10").json()
    rids_in = [f["rid"] for f in in_box["features"]]
    assert rid_a in rids_in

    # Query bounding box that is completely disjoint from Unit A
    out_box = client.get("/cover?bbox=100,100,0,150,150,20").json()
    rids_out = [f["rid"] for f in out_box["features"]]
    assert rid_a not in rids_out

