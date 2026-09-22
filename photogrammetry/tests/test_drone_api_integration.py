"""
Integration Tests for Photogrammetry API Router
"""
import unittest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from photogrammetry.api.routes import router

app = FastAPI()
app.include_router(router)

class TestDroneApiIntegration(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

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

        # Verify the reconstructed building is produced
        bld = data["reconstructed_building"]
        self.assertEqual(bld["city"], "bengaluru")
        self.assertGreater(len(bld["floors"]), 1)
        self.assertGreater(len(bld["validation_checks"]), 0)

if __name__ == "__main__":
    unittest.main()
