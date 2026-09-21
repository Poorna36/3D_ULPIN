"""
Unit Tests for 3D Topology and Cadastral Validation Engine
"""
import unittest
from photogrammetry.validation.engine import TopologyValidationEngine

class TestTopologyValidation(unittest.TestCase):

    def setUp(self):
        self.engine = TopologyValidationEngine()
        self.valid_footprint = [
            [77.5940, 12.9710],
            [77.5950, 12.9710],
            [77.5950, 12.9720],
            [77.5940, 12.9720]
        ]
        self.parent_parcel = {
            "parcel_id": "BLR-PRC-TEST",
            "coordinates": [
                [77.5930, 12.9700],
                [77.5960, 12.9700],
                [77.5960, 12.9730],
                [77.5930, 12.9730]
            ]
        }

    def test_valid_building_passes(self):
        building = {
            "building_id": "BLR-VAL-001",
            "footprint": self.valid_footprint,
            "ground_elevation": 920.0,
            "roof_elevation": 960.0,
            "floors": [
                {"floor_id": "FL-00", "level_index": 0, "z_min": 920.0, "z_max": 924.0},
                {"floor_id": "FL-01", "level_index": 1, "z_min": 924.0, "z_max": 927.0},
            ]
        }
        report = self.engine.validate_building_volume(building, self.parent_parcel)
        self.assertEqual(report["overall_status"], "VALID")
        self.assertEqual(len(report["errors"]), 0)

    def test_inverted_vertical_bounds_fails(self):
        building = {
            "building_id": "BLR-VAL-002",
            "footprint": self.valid_footprint,
            "ground_elevation": 960.0,
            "roof_elevation": 920.0,  # Inverted!
            "floors": []
        }
        report = self.engine.validate_building_volume(building, self.parent_parcel)
        self.assertEqual(report["overall_status"], "INVALID")
        self.assertTrue(any("Z_min < Z_max" in c["name"] and c["status"] == "FAIL" for c in report["checks"]))

    def test_degenerate_footprint_fails(self):
        building = {
            "building_id": "BLR-VAL-003",
            "footprint": [[77.5940, 12.9710], [77.5950, 12.9710]],  # Only 2 vertices!
            "ground_elevation": 920.0,
            "roof_elevation": 950.0,
            "floors": []
        }
        report = self.engine.validate_building_volume(building, self.parent_parcel)
        self.assertEqual(report["overall_status"], "INVALID")
        self.assertTrue(any("2D Ring Topology" in c["name"] and c["status"] == "FAIL" for c in report["checks"]))

    def test_floor_overlap_detected(self):
        building = {
            "building_id": "BLR-VAL-004",
            "footprint": self.valid_footprint,
            "ground_elevation": 920.0,
            "roof_elevation": 950.0,
            "floors": [
                {"floor_id": "FL-00", "level_index": 0, "z_min": 920.0, "z_max": 925.0},
                {"floor_id": "FL-01", "level_index": 1, "z_min": 923.0, "z_max": 927.0},  # Overlaps with FL-00!
            ]
        }
        report = self.engine.validate_building_volume(building, self.parent_parcel)
        self.assertEqual(report["overall_status"], "INVALID")
        self.assertTrue(any("Floor Ordering" in c["name"] and c["status"] == "FAIL" for c in report["checks"]))

if __name__ == "__main__":
    unittest.main()
