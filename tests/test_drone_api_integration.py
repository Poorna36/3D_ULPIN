"""
Integration Tests for Drone Photogrammetry API Endpoints
"""
import unittest
from fastapi.testclient import TestClient
from services.api.main import app

class TestDroneApiIntegration(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_health_check(self):
        resp = self.client.get("/health")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["status"], "ok")

    def test_list_drone_surveys(self):
        resp = self.client.get("/api/drone/surveys")
        self.assertEqual(resp.status_code, 200)
        surveys = resp.json()
        self.assertGreaterEqual(len(surveys), 3)
        self.assertTrue(any("Bengaluru" in s["name"] for s in surveys))
        self.assertTrue(any("SVAMITVA" in s["name"] for s in surveys))

    def test_process_drone_survey(self):
        payload = {
            "survey_id": "SURV-IN-BLR-UAV-01",
            "city": "bengaluru",
            "survey_name": "Bengaluru Electronic City Tech Corridor UAV Photogrammetry",
            "flight_altitude_m": 120.0,
            "gsd_cm": 2.5,
            "has_underground": True,
            "units_per_floor": 2
        }
        resp = self.client.post("/api/drone/process", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["success"])
        self.assertIn("prototype_3d_id", data)
        self.assertTrue(data["prototype_3d_id"].startswith("3D-IN-BEN"))

        # Verify the reconstructed building is now present in the buildings database
        bld = data["reconstructed_building"]
        self.assertEqual(bld["city"], "bengaluru")
        self.assertGreater(len(bld["floors"]), 1)

        # Check it can be queried via /api/buildings
        buildings_resp = self.client.get("/api/buildings?city=bengaluru")
        self.assertEqual(buildings_resp.status_code, 200)
        bld_ids = [b["building_id"] for b in buildings_resp.json()]
        self.assertIn(bld["building_id"], bld_ids)

    def test_validation_endpoint(self):
        # Validate an existing building
        buildings_resp = self.client.get("/api/buildings?city=bengaluru")
        bld_id = buildings_resp.json()[0]["building_id"]

        val_resp = self.client.post(f"/api/validation/run?building_id={bld_id}")
        self.assertEqual(val_resp.status_code, 200)
        report = val_resp.json()
        self.assertIn(report["overall_status"], ["VALID", "REVIEW"])
        self.assertGreater(len(report["checks"]), 0)

if __name__ == "__main__":
    unittest.main()
