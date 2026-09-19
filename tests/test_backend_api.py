import unittest
from fastapi.testclient import TestClient
from services.api.main import app
from services.identifiers.generator import generate_prototype_3d_id

class TestBackendAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_check(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")

    def test_get_bengaluru_buildings(self):
        response = self.client.get("/api/buildings?city=bengaluru")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(len(data), 20)
        self.assertTrue(any(b["building_id"] == "BLR-BLD-00001" for b in data))

    def test_get_netherlands_buildings(self):
        response = self.client.get("/api/buildings?city=netherlands")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(len(data), 20)
        self.assertTrue(any(b["building_id"] == "NLD-BLD-00001" for b in data))

    def test_get_mumbai_buildings(self):
        response = self.client.get("/api/buildings?city=mumbai")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(len(data), 24)
        self.assertTrue(any(b["building_id"] == "MUM-BLD-00001" for b in data))
        self.assertTrue(any(b["building_id"] == "MUM-BLD-00011" for b in data))
        self.assertTrue(any(b["building_id"] == "MUM-INF-00001" for b in data))

    def test_get_singapore_buildings(self):
        response = self.client.get("/api/buildings?city=singapore")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(len(data), 24)
        self.assertTrue(any(b["building_id"] == "SGP-BLD-00001" for b in data))
        self.assertTrue(any(b["building_id"] == "SGP-BLD-00008" for b in data))
        self.assertTrue(any(b["building_id"] == "SGP-INF-00001" for b in data))

    def test_get_building_by_id(self):
        # Bengaluru
        r1 = self.client.get("/api/buildings/BLR-BLD-00001")
        self.assertEqual(r1.status_code, 200)
        self.assertEqual(r1.json()["name"], "Prestige Skyline Tower")

        # Mumbai
        r2 = self.client.get("/api/buildings/MUM-BLD-00001")
        self.assertEqual(r2.status_code, 200)
        self.assertEqual(r2.json()["name"], "Lodha World One")
        self.assertTrue(r2.json()["prototype_3d_id"].startswith("3D-IN-MUM-"))

        # Singapore
        r3 = self.client.get("/api/buildings/SGP-BLD-00008")
        self.assertEqual(r3.status_code, 200)
        self.assertIn("Guoco Tower", r3.json()["name"])
        self.assertTrue(r3.json()["prototype_3d_id"].startswith("3D-SGP-"))

    def test_get_parcels(self):
        for city, expected_prefix in [
            ("bengaluru", "BLR-PRC-"),
            ("mumbai", "MUM-PRC-"),
            ("netherlands", "NLD-PRC-"),
            ("singapore", "SGP-PRC-")
        ]:
            response = self.client.get(f"/api/parcels?city={city}")
            self.assertEqual(response.status_code, 200)
            parcels = response.json()
            self.assertEqual(len(parcels), 4)
            self.assertTrue(parcels[0]["parcel_id"].startswith(expected_prefix))

    def test_search_buildings(self):
        # Mumbai search
        r_mum = self.client.get("/api/search?city=mumbai&q=world")
        self.assertEqual(r_mum.status_code, 200)
        self.assertTrue(any("World One" in b["name"] for b in r_mum.json()))

        # Singapore search
        r_sgp = self.client.get("/api/search?city=singapore&q=guoco")
        self.assertEqual(r_sgp.status_code, 200)
        self.assertTrue(any("Guoco" in b["name"] for b in r_sgp.json()))

    def test_prototype_3d_identifier_generator(self):
        id_blr = generate_prototype_3d_id("IN", "BLR", "BLR-BLD-00001", 131.8, 38)
        self.assertEqual(id_blr, generate_prototype_3d_id("IN", "BLR", "BLR-BLD-00001", 131.8, 38))
        self.assertTrue(id_blr.startswith("3D-IN-BLR-"))

        id_mum_ug = generate_prototype_3d_id("IN", "MUM", "MUM-INF-00001", -18.5, 3, is_underground=True)
        self.assertTrue(id_mum_ug.startswith("3D-IN-MUM-UG-"))

if __name__ == "__main__":
    unittest.main()
