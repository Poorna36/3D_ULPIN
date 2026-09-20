"""
Unit Tests for 3D Geometry and Vertical Property Slicer
"""
import unittest
from services.geometry.computational_geometry import (
    polygon_area_2d_meters,
    point_in_polygon,
    calculate_3d_volume_m3
)
from services.geometry.vertical_slicer import VerticalPropertySlicer

class TestGeometryAndSlicer(unittest.TestCase):

    def setUp(self):
        # A ~40m x 40m rectangular building footprint in Bengaluru
        self.footprint = [
            [77.5940, 12.9710],
            [77.5944, 12.9710],
            [77.5944, 12.9714],
            [77.5940, 12.9714]
        ]

    def test_shoelace_area_and_volume(self):
        area_m2 = polygon_area_2d_meters(self.footprint)
        # ~0.0004 deg is approx 44 meters -> area approx 1900 m^2
        self.assertGreater(area_m2, 1000.0)
        self.assertLess(area_m2, 3000.0)

        volume_m3 = calculate_3d_volume_m3(self.footprint, z_min=920.0, z_max=950.0)
        self.assertAlmostEqual(volume_m3, area_m2 * 30.0, places=1)

    def test_point_in_polygon(self):
        inside_pt = [77.5942, 12.9712]
        outside_pt = [77.5950, 12.9720]
        self.assertTrue(point_in_polygon(inside_pt, self.footprint))
        self.assertFalse(point_in_polygon(outside_pt, self.footprint))

    def test_vertical_property_slicer(self):
        slicer = VerticalPropertySlicer()
        res = slicer.slice_building(
            building_id="BLR-TEST-01",
            country="India",
            city="bengaluru",
            footprint=self.footprint,
            ground_elevation=920.0,
            roof_elevation=950.0,  # 30m height -> ~10 floors + basement
            parent_parcel_id="BLR-PRC-101",
            has_underground=True,
            units_per_floor=2
        )

        self.assertGreaterEqual(res["total_floors"], 10)
        self.assertGreater(res["total_volumes"], 20)
        self.assertGreater(res["total_volume_m3"], 10000.0)

        # Verify basement existence
        basement = next((f for f in res["floors"] if f.get("is_underground")), None)
        self.assertIsNotNone(basement)
        self.assertLess(basement["z_min"], 920.0)

        # Verify prototype 3D ULPIN format
        first_unit = res["property_volumes"][0]
        self.assertTrue(first_unit["prototype_3d_id"].startswith("3D-IN-BEN"))

if __name__ == "__main__":
    unittest.main()
