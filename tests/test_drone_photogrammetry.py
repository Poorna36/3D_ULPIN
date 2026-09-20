"""
Unit Tests for Drone EXIF, Photogrammetry Engine, and Indian CRS Transformation
"""
import unittest
from services.ingestion.drone_exif import DroneImageMetadata
from services.ingestion.photogrammetry_engine import PhotogrammetryEngine
from adapters.india.crs_transformer import wgs84_to_utm, get_utm_zone_for_india, haversine_distance_m

class TestDronePhotogrammetry(unittest.TestCase):

    def test_drone_metadata_gsd(self):
        meta = DroneImageMetadata(
            filename="TEST_001.JPG",
            latitude=12.9716,
            longitude=77.5946,
            altitude_msl=1040.0,
            altitude_agl=120.0,
            focal_length_mm=8.8,
            sensor_width_mm=13.2,
            image_width_px=5472,
            image_height_px=3648
        )
        # GSD = (120 * 13.2 * 100) / (8.8 * 5472) = 158400 / 48153.6 ~= 3.289 cm/pixel
        self.assertAlmostEqual(meta.gsd_cm_per_pixel, 3.289, places=2)
        self.assertGreater(meta.footprint_width_m, 100.0)
        self.assertGreater(meta.footprint_height_m, 50.0)

    def test_indian_utm_projection(self):
        # Bengaluru: ~77.59°E -> UTM Zone 43N
        zone_blr = get_utm_zone_for_india(77.5946)
        self.assertEqual(zone_blr, 43)

        easting, northing, zone = wgs84_to_utm(12.9716, 77.5946)
        self.assertEqual(zone, 43)
        self.assertGreater(easting, 500000.0)
        self.assertGreater(northing, 1400000.0)

        # Mumbai: ~72.82°E -> UTM Zone 43N
        zone_bom = get_utm_zone_for_india(72.8258)
        self.assertEqual(zone_bom, 43)

    def test_haversine_distance(self):
        # Distance between Vidhana Soudha and MG Road Bengaluru (~2 km)
        d = haversine_distance_m(12.9797, 77.5907, 12.9756, 77.6066)
        self.assertGreater(d, 1500.0)
        self.assertLess(d, 2500.0)

    def test_photogrammetry_engine_telemetry(self):
        engine = PhotogrammetryEngine()
        images = [
            DroneImageMetadata(
                filename=f"IMG_{i}.JPG",
                latitude=12.9710 + (i * 0.0001),
                longitude=77.5940 + (i * 0.0001),
                altitude_msl=1020.0,
                altitude_agl=100.0
            )
            for i in range(5)
        ]
        result = engine.process_telemetry_survey(
            survey_id="TEST-SURV-01",
            survey_name="Test Pilot Survey",
            city="bengaluru",
            image_records=images
        )
        self.assertEqual(result.total_images, 5)
        self.assertEqual(len(result.detected_structures), 1)
        struct = result.detected_structures[0]
        self.assertGreater(struct["height"], 0.0)
        self.assertGreater(struct["roof_elevation"], struct["ground_elevation"])
        self.assertEqual(len(struct["footprint"]), 4)

if __name__ == "__main__":
    unittest.main()
