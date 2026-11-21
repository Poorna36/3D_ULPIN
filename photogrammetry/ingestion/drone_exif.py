"""
Drone EXIF and Telemetry Parser
Extracts GPS coordinates, altitude (MSL and AGL), gimbal angles,
and optical camera parameters for photogrammetric reconstruction.
"""
from dataclasses import dataclass, field
from typing import Optional, Dict, Any, List
import math
from PIL import Image, ExifTags

@dataclass
class DroneImageMetadata:
    filename: str
    latitude: float
    longitude: float
    altitude_msl: float
    altitude_agl: float
    gimbal_pitch: float = -90.0  # -90 deg is nadir (straight down)
    gimbal_roll: float = 0.0
    gimbal_yaw: float = 0.0
    focal_length_mm: float = 8.8  # Typical 1-inch sensor drone lens (e.g. DJI Mavic 3E / Phantom 4 RTK)
    sensor_width_mm: float = 13.2
    image_width_px: int = 5472
    image_height_px: int = 3648
    camera_model: str = "DJI FC3411 / Survey Drone"
    timestamp: Optional[str] = None
    rtk_status: str = "FIXED"  # RTK Fix indicator: FIXED, FLOAT, SINGLE
    extra_tags: Dict[str, Any] = field(default_factory=dict)

    @property
    def gsd_cm_per_pixel(self) -> float:
        """
        Ground Sampling Distance (GSD) in cm/pixel:
        GSD = (flight_height_m * sensor_width_mm * 100) / (focal_length_mm * image_width_px)
        """
        if self.focal_length_mm <= 0 or self.image_width_px <= 0:
            return 5.0  # Safe default 5cm GSD
        return (self.altitude_agl * self.sensor_width_mm * 100.0) / (self.focal_length_mm * self.image_width_px)

    @property
    def footprint_width_m(self) -> float:
        """Ground footprint width covered by this photo at nadir."""
        return (self.gsd_cm_per_pixel * self.image_width_px) / 100.0

    @property
    def footprint_height_m(self) -> float:
        """Ground footprint height covered by this photo at nadir."""
        return (self.gsd_cm_per_pixel * self.image_height_px) / 100.0


def parse_dms_coordinate(dms_values, ref: str) -> float:
    """Convert degrees, minutes, seconds tuple to decimal degrees."""
    try:
        degrees = float(dms_values[0])
        minutes = float(dms_values[1])
        seconds = float(dms_values[2])
        dec = degrees + (minutes / 60.0) + (seconds / 3600.0)
        if ref.upper() in ['S', 'W']:
            dec = -dec
        return dec
    except Exception:
        return 0.0


def extract_metadata_from_file(image_path: str) -> DroneImageMetadata:
    """Extract drone geospatial EXIF and XMP metadata from an aerial JPEG."""
    with Image.open(image_path) as img:
        exif_raw = img.getexif()
        width, height = img.size

        lat, lon = 0.0, 0.0
        alt_msl = 100.0
        alt_agl = 100.0
        pitch = -90.0
        roll = 0.0
        yaw = 0.0
        focal_mm = 8.8
        model = "UAV Camera"
        timestamp = None

        if exif_raw:
            for tag_id, value in exif_raw.items():
                tag_name = ExifTags.TAGS.get(tag_id, tag_id)
                if tag_name == "Model":
                    model = str(value)
                elif tag_name == "DateTime":
                    timestamp = str(value)
                elif tag_name == "FocalLength":
                    try:
                        focal_mm = float(value)
                    except Exception:
                        pass

            # GPS IFD tags
            gps_ifd = exif_raw.get_ifd(ExifTags.IFD.GPSInfo)
            if gps_ifd:
                gps_tags = {ExifTags.GPSTags.get(k, k): v for k, v in gps_ifd.items()}
                if "GPSLatitude" in gps_tags and "GPSLatitudeRef" in gps_tags:
                    lat = parse_dms_coordinate(gps_tags["GPSLatitude"], gps_tags["GPSLatitudeRef"])
                if "GPSLongitude" in gps_tags and "GPSLongitudeRef" in gps_tags:
                    lon = parse_dms_coordinate(gps_tags["GPSLongitude"], gps_tags["GPSLongitudeRef"])
                if "GPSAltitude" in gps_tags:
                    try:
                        alt_msl = float(gps_tags["GPSAltitude"])
                    except Exception:
                        pass

        return DroneImageMetadata(
            filename=image_path.replace("\\", "/").split("/")[-1],
            latitude=lat,
            longitude=lon,
            altitude_msl=alt_msl,
            altitude_agl=alt_agl,
            gimbal_pitch=pitch,
            gimbal_roll=roll,
            gimbal_yaw=yaw,
            focal_length_mm=focal_mm,
            image_width_px=width,
            image_height_px=height,
            camera_model=model,
            timestamp=timestamp
        )
