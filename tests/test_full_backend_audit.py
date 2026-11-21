"""
Comprehensive Backend Audit Tests
Tests every REST endpoint exposed by backend.api.main against the live
FastAPI TestClient. Validates:
  1. /health — service status
  2. /api/buildings — legacy pilot buildings (4 cities)
  3. /api/buildings/{id} — single building lookup + 404
  4. /api/search — free-text search
  5. /api/parcels — parcel geometry
  6. /api/validation/{id} — per-building validation checks
  7. POST /allocate — 3D ULPIN allocation
  8. GET /resolve/{rid} — resolve an allocated RID
  9. POST /verify — candidate geometry verification
 10. GET /lineage/{rid} — hash-chained lineage
 11. GET /cover?bbox=... — spatial cover query (summary + geojson_3d)
 12. GET /validate/{rid} — multi-tier validation pipeline
 13. GET /explain/{finding_id} — explain object for findings
 14. OpenAPI /docs — Swagger docs served
 15. /console — GIS inspection console served
 16. Frontend contract alignment — response shapes match what frontend expects
"""

import pytest
from fastapi.testclient import TestClient
from backend.api.main import app

client = TestClient(app)


# =============================================================================
# 1. HEALTH CHECK
# =============================================================================
class TestHealthEndpoint:
    def test_health_returns_200(self):
        r = client.get("/health")
        assert r.status_code == 200

    def test_health_status_ok(self):
        data = client.get("/health").json()
        assert data["status"] == "ok"

    def test_health_has_version(self):
        data = client.get("/health").json()
        assert "version" in data
        assert data["version"] == "1.0.0"

    def test_health_lists_endpoints(self):
        data = client.get("/health").json()
        assert "endpoints" in data
        assert isinstance(data["endpoints"], list)
        assert len(data["endpoints"]) >= 7


# =============================================================================
# 2. LEGACY /api/buildings
# =============================================================================
class TestLegacyBuildings:
    @pytest.mark.parametrize("city,min_count", [
        ("bengaluru", 20),
        ("mumbai", 20),
        ("netherlands", 20),
        ("singapore", 20),
    ])
    def test_buildings_per_city(self, city, min_count):
        r = client.get(f"/api/buildings?city={city}")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= min_count, f"{city} has {len(data)} buildings, expected >= {min_count}"

    def test_buildings_unknown_city_returns_empty(self):
        r = client.get("/api/buildings?city=atlantis")
        assert r.status_code == 200
        assert r.json() == []

    def test_buildings_default_city_is_bengaluru(self):
        r = client.get("/api/buildings")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 20

    def test_building_has_required_fields(self):
        r = client.get("/api/buildings?city=bengaluru")
        building = r.json()[0]
        for field in ["building_id", "name", "lat", "lon", "height"]:
            assert field in building, f"Missing field '{field}' in building"


# =============================================================================
# 3. LEGACY /api/buildings/{building_id}
# =============================================================================
class TestBuildingById:
    def test_get_known_bengaluru_building(self):
        r = client.get("/api/buildings/BLR-BLD-00001")
        assert r.status_code == 200
        assert r.json()["building_id"] == "BLR-BLD-00001"

    def test_get_known_mumbai_building(self):
        r = client.get("/api/buildings/MUM-BLD-00001")
        assert r.status_code == 200
        assert "name" in r.json()

    def test_get_known_singapore_building(self):
        r = client.get("/api/buildings/SGP-BLD-00001")
        assert r.status_code == 200

    def test_get_nonexistent_building_returns_404(self):
        r = client.get("/api/buildings/DOES-NOT-EXIST")
        assert r.status_code == 404


# =============================================================================
# 4. LEGACY /api/search
# =============================================================================
class TestSearch:
    def test_search_by_name(self):
        r = client.get("/api/search?city=mumbai&q=world")
        assert r.status_code == 200
        results = r.json()
        assert any("World" in b["name"] for b in results)

    def test_search_empty_query_returns_all(self):
        r = client.get("/api/search?city=bengaluru&q=")
        assert r.status_code == 200
        assert len(r.json()) >= 20

    def test_search_no_match(self):
        r = client.get("/api/search?city=bengaluru&q=zzzznonexistent")
        assert r.status_code == 200
        assert r.json() == []


# =============================================================================
# 5. LEGACY /api/parcels
# =============================================================================
class TestParcels:
    @pytest.mark.parametrize("city", ["bengaluru", "mumbai", "netherlands", "singapore"])
    def test_parcels_per_city(self, city):
        r = client.get(f"/api/parcels?city={city}")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 4

    def test_parcel_has_coordinates(self):
        r = client.get("/api/parcels?city=bengaluru")
        parcel = r.json()[0]
        assert "coordinates" in parcel
        assert "parcel_id" in parcel


# =============================================================================
# 6. LEGACY /api/validation/{building_id}
# =============================================================================
class TestLegacyValidation:
    def test_validation_for_known_building(self):
        r = client.get("/api/validation/BLR-BLD-00001")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)

    def test_validation_404_for_unknown_building(self):
        r = client.get("/api/validation/DOES-NOT-EXIST")
        assert r.status_code == 404


# =============================================================================
# 7. POST /allocate
# =============================================================================
class TestAllocate:
    def test_allocate_basic_unit(self):
        payload = {
            "parent_ulpin": "MH2700010001AA",
            "building_seq": "B0099",
            "cls": "U",
            "geometry": {"type": "Solid", "extents": [10.0, 8.0, 3.2]},
            "evidence_refs": ["E1"],
            "plan_version": "1.0",
            "data_provenance": "SYNTHETIC",
            "issuer_node_id": "MH",
            "geo_anchor": [72.825, 18.9925, 8.5]
        }
        r = client.post("/allocate", json=payload)
        assert r.status_code == 201
        data = r.json()
        assert "rid" in data
        assert "nk_digest" in data
        assert "nk_locator" in data
        assert data["ict_result"] in ("NEW", "CONTINUE", "SPLIT", "MERGE")
        assert data["version"] >= 1
        # Store RID for later tests
        TestAllocate.allocated_rid = data["rid"]

    def test_allocate_missing_cls_returns_422(self):
        payload = {
            "parent_ulpin": "MH2700010001AA",
            "geometry": {"type": "Solid", "extents": [5.0, 5.0, 3.0]},
        }
        r = client.post("/allocate", json=payload)
        assert r.status_code == 422

    def test_allocate_parking_class(self):
        payload = {
            "parent_ulpin": "MH2700010001AA",
            "building_seq": "B0099",
            "cls": "P",
            "geometry": {"type": "Solid", "extents": [20.0, 15.0, 3.0]},
            "data_provenance": "SYNTHETIC",
            "issuer_node_id": "MH",
            "geo_anchor": [72.826, 18.993, 5.0]
        }
        r = client.post("/allocate", json=payload)
        assert r.status_code == 201
        assert r.json()["rid"]

    def test_allocate_subterranean(self):
        payload = {
            "parent_ulpin": "MH2700010001AA",
            "building_seq": "B0099",
            "cls": "T",
            "geometry": {"type": "Solid", "extents": [30.0, 10.0, 5.0]},
            "data_provenance": "SYNTHETIC",
            "issuer_node_id": "MH",
            "geo_anchor": [72.825, 18.993, -10.0]
        }
        r = client.post("/allocate", json=payload)
        assert r.status_code == 201


# =============================================================================
# 8. GET /resolve/{rid}
# =============================================================================
class TestResolve:
    def test_resolve_seeded_rid(self):
        """Resolve an RID that was seeded by seed_hero_towers.py"""
        r = client.get("/resolve/MH2700010001AA-B0001-B00001-Y")
        assert r.status_code == 200
        data = r.json()
        assert data["rid"] == "MH2700010001AA-B0001-B00001-Y"
        assert data["cls"] in ("S", "B", "L", "U", "C", "P", "A", "T", "E", "I")
        assert "current_nk" in data
        assert "digest" in data["current_nk"]
        assert "locator" in data["current_nk"]
        assert data["data_provenance"] in ("REAL", "PROXY", "SYNTHETIC", "REAL-FOREIGN", "REAL-OWN")
        assert data["status"] == "ACTIVE"

    def test_resolve_nonexistent_rid_returns_404(self):
        r = client.get("/resolve/ZZZZZZ-NONEXISTENT-RID")
        assert r.status_code == 404

    def test_resolve_includes_statutory_anchor(self):
        r = client.get("/resolve/MH2700010001AA-B0001-B00001-Y")
        data = r.json()
        assert "statutory_anchor" in data
        anchor = data["statutory_anchor"]
        assert "act_name" in anchor
        assert "section" in anchor

    def test_resolve_with_geometry(self):
        r = client.get("/resolve/MH2700010001AA-B0001-B00001-Y?include_geometry=true")
        assert r.status_code == 200
        data = r.json()
        # geometry might be None if not stored, but field must exist
        assert "geometry" in data

    def test_resolve_response_matches_frontend_contract(self):
        """Frontend resolveRID() expects: rid, cls, status, parent_rid,
        parent_ulpin, current_nk{digest,locator,version}, data_provenance,
        legal_basis_status, legacy_ids, spans, issuer_node_id"""
        r = client.get("/resolve/MH2700010001AA-B0001-B00001-Y")
        data = r.json()
        required_keys = [
            "rid", "cls", "status", "parent_ulpin",
            "current_nk", "data_provenance", "legal_basis_status",
            "legacy_ids", "spans", "issuer_node_id"
        ]
        for key in required_keys:
            assert key in data, f"Missing key '{key}' needed by frontend"
        # current_nk sub-fields
        assert "digest" in data["current_nk"]
        assert "version" in data["current_nk"]


# =============================================================================
# 9. POST /verify
# =============================================================================
class TestVerify:
    def test_verify_known_rid(self):
        payload = {
            "rid": "MH2700010001AA-B0001-B00001-Y",
            "geometry": {"type": "Solid", "extents": [10.0, 10.0, 3.0]}
        }
        r = client.post("/verify", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert data["result"] in ("MATCH", "DRIFT", "NOT_SAME")
        assert "computed_digest" in data
        assert "registered_digest" in data
        assert "iou3d" in data
        assert "confidence" in data

    def test_verify_nonexistent_rid_returns_404(self):
        payload = {
            "rid": "NONEXISTENT-RID-ZZZZZ",
            "geometry": {"type": "Solid", "extents": [5.0, 5.0, 3.0]}
        }
        r = client.post("/verify", json=payload)
        assert r.status_code == 404


# =============================================================================
# 10. GET /lineage/{rid}
# =============================================================================
class TestLineage:
    def test_lineage_known_rid(self):
        r = client.get("/lineage/MH2700010001AA-B0001-B00001-Y")
        assert r.status_code == 200
        data = r.json()
        assert data["rid"] == "MH2700010001AA-B0001-B00001-Y"
        assert "versions" in data
        assert isinstance(data["versions"], list)
        assert len(data["versions"]) >= 1
        v = data["versions"][0]
        assert "version" in v
        assert "nk_digest" in v
        assert "record_hash" in v

    def test_lineage_nonexistent_rid_404(self):
        r = client.get("/lineage/NONEXISTENT-RID-ZZZZZ")
        assert r.status_code == 404

    def test_lineage_response_matches_frontend_contract(self):
        """Frontend getLineage() expects: rid, versions[], lineage_edges[]
        Each version: version, nk_digest, timestamp, evidence_refs,
        plan_version, prev_hash, record_hash, sign_off"""
        r = client.get("/lineage/MH2700010001AA-B0001-B00001-Y")
        data = r.json()
        assert "versions" in data
        assert "lineage_edges" in data
        v = data["versions"][0]
        for field in ["version", "nk_digest", "timestamp", "plan_version",
                       "prev_hash", "record_hash"]:
            assert field in v, f"Missing '{field}' in lineage version"


# =============================================================================
# 11. GET /cover
# =============================================================================
class TestCover:
    def test_cover_mumbai_summary(self):
        r = client.get("/cover?bbox=72.81,18.98,-50,72.84,19.01,200")
        assert r.status_code == 200
        data = r.json()
        assert data["type"] == "FeatureCollection"
        assert data["total_count"] >= 1
        assert isinstance(data["features"], list)

    def test_cover_mumbai_geojson_3d(self):
        r = client.get("/cover?bbox=72.81,18.98,-50,72.84,19.01,200&format=geojson_3d")
        assert r.status_code == 200
        data = r.json()
        assert data["total_count"] >= 100
        feat = data["features"][0]
        assert feat["type"] == "Feature"
        assert "properties" in feat
        props = feat["properties"]
        assert "rid" in props
        assert "cls" in props
        assert "height" in props
        assert "extrudedHeight" in props
        assert "fill_color" in props
        assert "geometry" in feat
        assert feat["geometry"]["type"] == "Polygon"

    def test_cover_bengaluru_geojson_3d(self):
        r = client.get("/cover?bbox=77.58,12.96,870,77.61,12.99,1000&format=geojson_3d")
        assert r.status_code == 200
        data = r.json()
        assert data["total_count"] >= 50

    def test_cover_invalid_bbox_returns_422(self):
        r = client.get("/cover?bbox=bad,data")
        assert r.status_code == 422

    def test_cover_empty_area_returns_zero(self):
        r = client.get("/cover?bbox=0,0,-999,0.001,0.001,999")
        assert r.status_code == 200
        assert r.json()["total_count"] == 0

    def test_cover_cls_filter(self):
        r = client.get("/cover?bbox=72.81,18.98,-50,72.84,19.01,200&cls=U&format=geojson_3d")
        assert r.status_code == 200
        data = r.json()
        for f in data["features"]:
            assert f["properties"]["cls"] == "U"

    def test_cover_limit_parameter(self):
        r = client.get("/cover?bbox=72.81,18.98,-50,72.84,19.01,200&limit=5&format=geojson_3d")
        assert r.status_code == 200
        assert r.json()["total_count"] <= 5


# =============================================================================
# 12. GET /validate/{rid}
# =============================================================================
class TestValidate:
    def test_validate_known_rid(self):
        r = client.get("/validate/MH2700010001AA-B0001-B00001-Y")
        assert r.status_code == 200
        data = r.json()
        assert data["rid"] == "MH2700010001AA-B0001-B00001-Y"
        assert data["overall_status"] in ("PASS", "WARN", "FAIL", "UNVERIFIABLE")
        assert "tier_results" in data
        assert "evidence_sufficiency" in data

    def test_validate_tier_results_structure(self):
        r = client.get("/validate/MH2700010001AA-B0001-B00001-Y?tiers=T0,T1")
        data = r.json()
        for tr in data["tier_results"]:
            assert "tier" in tr
            assert "status" in tr
            assert "findings" in tr
            assert tr["status"] in ("PASS", "WARN", "FAIL", "UNVERIFIABLE")

    def test_validate_nonexistent_rid_404(self):
        r = client.get("/validate/NONEXISTENT-RID-ZZZZ")
        assert r.status_code == 404

    def test_validate_evidence_sufficiency_fields(self):
        r = client.get("/validate/MH2700010001AA-B0001-B00001-Y")
        data = r.json()
        ev = data["evidence_sufficiency"]
        assert "available" in ev
        assert "required_for_full_pass" in ev

    def test_validate_response_matches_frontend_contract(self):
        """Frontend runValidation() expects: rid, overall_status,
        tier_results[{tier, status, findings}], evidence_sufficiency"""
        r = client.get("/validate/MH2700010001AA-B0001-B00001-Y")
        data = r.json()
        assert "rid" in data
        assert "overall_status" in data
        assert "tier_results" in data
        assert "evidence_sufficiency" in data


# =============================================================================
# 13. GET /explain/{finding_id}
# =============================================================================
class TestExplain:
    def test_explain_after_validation(self):
        """Run validation first to populate findings cache, then query explain"""
        val_r = client.get("/validate/MH2700010001AA-B0001-B00001-Y?tiers=T0")
        val_data = val_r.json()
        findings = val_data["tier_results"][0]["findings"]
        if findings:
            fid = findings[0]["finding_id"]
            r = client.get(f"/explain/{fid}")
            assert r.status_code == 200
            data = r.json()
            assert "finding_id" in data
            assert data["finding_id"] == fid

    def test_explain_nonexistent_404(self):
        r = client.get("/explain/NONEXISTENT-FINDING-ID")
        assert r.status_code == 404


# =============================================================================
# 14. OpenAPI /docs
# =============================================================================
class TestDocs:
    def test_openapi_json(self):
        r = client.get("/openapi.json")
        assert r.status_code == 200
        data = r.json()
        assert "openapi" in data
        assert "paths" in data
        # Check that our core endpoints are documented
        assert "/allocate" in data["paths"]
        assert "/health" in data["paths"]

    def test_docs_page(self):
        r = client.get("/docs")
        assert r.status_code == 200


# =============================================================================
# 15. /console — Static GIS console
# =============================================================================
class TestConsole:
    def test_console_serves_html(self):
        r = client.get("/console/")
        assert r.status_code == 200
        assert "text/html" in r.headers.get("content-type", "")


# =============================================================================
# 16. END-TO-END WORKFLOWS
# =============================================================================
class TestEndToEndWorkflows:
    def test_allocate_then_resolve_then_validate(self):
        """Full lifecycle: allocate → resolve → validate"""
        # Step 1: Allocate
        alloc_r = client.post("/allocate", json={
            "parent_ulpin": "KA2900020001BB",
            "building_seq": "B0055",
            "cls": "U",
            "geometry": {"type": "Solid", "extents": [12.0, 10.0, 3.2]},
            "data_provenance": "SYNTHETIC",
            "issuer_node_id": "KA",
            "geo_anchor": [77.5946, 12.9716, 920.5]
        })
        assert alloc_r.status_code == 201
        rid = alloc_r.json()["rid"]

        # Step 2: Resolve
        resolve_r = client.get(f"/resolve/{rid}")
        assert resolve_r.status_code == 200
        assert resolve_r.json()["rid"] == rid
        assert resolve_r.json()["cls"] == "U"
        assert resolve_r.json()["status"] == "ACTIVE"

        # Step 3: Validate
        val_r = client.get(f"/validate/{rid}?tiers=T0,T1,T4")
        assert val_r.status_code == 200
        assert val_r.json()["overall_status"] in ("PASS", "WARN", "FAIL", "UNVERIFIABLE")

    def test_allocate_then_verify(self):
        """Allocate, then verify with same geometry → should MATCH or DRIFT"""
        alloc_r = client.post("/allocate", json={
            "parent_ulpin": "KA2900020001BB",
            "building_seq": "B0056",
            "cls": "C",
            "geometry": {"type": "Solid", "extents": [8.0, 8.0, 3.0]},
            "data_provenance": "SYNTHETIC",
            "issuer_node_id": "KA",
            "geo_anchor": [77.595, 12.972, 921.0]
        })
        rid = alloc_r.json()["rid"]

        verify_r = client.post("/verify", json={
            "rid": rid,
            "geometry": {"type": "Solid", "extents": [8.0, 8.0, 3.0]}
        })
        assert verify_r.status_code == 200
        result = verify_r.json()["result"]
        assert result in ("MATCH", "DRIFT", "NOT_SAME")

    def test_allocate_then_lineage(self):
        """Newly allocated RID should have at least 1 version in lineage"""
        alloc_r = client.post("/allocate", json={
            "parent_ulpin": "MH2700010001AA",
            "building_seq": "B0077",
            "cls": "A",
            "geometry": {"type": "Solid", "extents": [50.0, 50.0, 100.0]},
            "data_provenance": "SYNTHETIC",
            "issuer_node_id": "MH",
            "geo_anchor": [72.83, 18.995, 200.0]
        })
        rid = alloc_r.json()["rid"]

        lineage_r = client.get(f"/lineage/{rid}")
        assert lineage_r.status_code == 200
        data = lineage_r.json()
        assert len(data["versions"]) >= 1

    def test_cover_then_resolve_first_result(self):
        """Spatial query, then resolve first RID from results"""
        cover_r = client.get("/cover?bbox=72.81,18.98,-50,72.84,19.01,200")
        data = cover_r.json()
        assert data["total_count"] > 0
        first_rid = data["features"][0]["rid"]

        resolve_r = client.get(f"/resolve/{first_rid}")
        assert resolve_r.status_code == 200
        assert resolve_r.json()["rid"] == first_rid


# =============================================================================
# 17. DATA INTEGRITY CHECKS
# =============================================================================
class TestDataIntegrity:
    def test_seeded_mumbai_hero_tower_exists(self):
        r = client.get("/cover?bbox=72.81,18.98,-50,72.84,19.01,200")
        assert r.json()["total_count"] >= 100, "Mumbai hero tower RIDs missing"

    def test_seeded_bengaluru_hero_tower_exists(self):
        r = client.get("/cover?bbox=77.58,12.96,870,77.61,12.99,1000")
        assert r.json()["total_count"] >= 50, "Bengaluru hero tower RIDs missing"

    def test_all_property_classes_represented(self):
        """Hero towers should have multiple property classes: B, L, U, C, P, T"""
        r = client.get("/cover?bbox=72.81,18.98,-50,72.84,19.01,200")
        classes = set()
        for feat in r.json()["features"]:
            classes.add(feat["cls"])
        # At minimum B (building), U (unit), and some others
        assert len(classes) >= 3, f"Only {classes} classes found; expected diverse set"
