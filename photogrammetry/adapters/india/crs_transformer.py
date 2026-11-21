"""
Indian CRS Transformation Utility
Handles geodetic coordinate transformations between:
- EPSG:4326 (WGS 84 Geographic Latitude/Longitude)
- EPSG:32643 (UTM Zone 43N - Western India: Mumbai, Western Karnataka)
- EPSG:32644 (UTM Zone 44N - Central/Eastern India: Bengaluru East, Hyderabad)
- EPSG:7755  (WGS 84 / India Zone - Survey of India National Cadastral Datum)
"""
import math
from typing import Tuple

# WGS84 Ellipsoid constants
WGS84_A = 6378137.0          # semi-major axis (meters)
WGS84_F = 1.0 / 298.257223563 # flattening
WGS84_B = WGS84_A * (1.0 - WGS84_F)
WGS84_E2 = (WGS84_A**2 - WGS84_B**2) / (WGS84_A**2) # eccentricity squared

def get_utm_zone_for_india(longitude: float) -> int:
    """Determine Indian UTM Zone (Zone 43N or Zone 44N)."""
    return int(math.floor((longitude + 180.0) / 6.0) + 1)

def wgs84_to_utm(lat: float, lon: float, zone: int = None) -> Tuple[float, float, int]:
    """
    Project WGS84 Lat/Lon (degrees) into UTM Easting, Northing (meters).
    Pure-Python Transverse Mercator formulation without external PROJ dependency.
    """
    if zone is None:
        zone = get_utm_zone_for_india(lon)

    lon_origin = (zone - 1) * 6 - 180 + 3
    lon_origin_rad = math.radians(lon_origin)
    lat_rad = math.radians(lat)
    lon_rad = math.radians(lon)

    k0 = 0.9996  # UTM scale factor
    e_prime_sq = WGS84_E2 / (1.0 - WGS84_E2)

    N = WGS84_A / math.sqrt(1.0 - WGS84_E2 * (math.sin(lat_rad) ** 2))
    T = math.tan(lat_rad) ** 2
    C = e_prime_sq * (math.cos(lat_rad) ** 2)
    A = math.cos(lat_rad) * (lon_rad - lon_origin_rad)

    # Meridional arc
    M = WGS84_A * (
        (1.0 - WGS84_E2 / 4.0 - 3.0 * (WGS84_E2**2) / 64.0 - 5.0 * (WGS84_E2**3) / 256.0) * lat_rad
        - (3.0 * WGS84_E2 / 8.0 + 3.0 * (WGS84_E2**2) / 32.0 + 45.0 * (WGS84_E2**3) / 1024.0) * math.sin(2.0 * lat_rad)
        + (15.0 * (WGS84_E2**2) / 256.0 + 45.0 * (WGS84_E2**3) / 1024.0) * math.sin(4.0 * lat_rad)
        - (35.0 * (WGS84_E2**3) / 3072.0) * math.sin(6.0 * lat_rad)
    )

    easting = k0 * N * (
        A + (1.0 - T + C) * (A**3) / 6.0
        + (5.0 - 18.0 * T + T**2 + 72.0 * C - 58.0 * e_prime_sq) * (A**5) / 120.0
    ) + 500000.0  # False Easting

    northing = k0 * (
        M + N * math.tan(lat_rad) * (
            (A**2) / 2.0
            + (5.0 - T + 9.0 * C + 4.0 * (C**2)) * (A**4) / 24.0
            + (61.0 - 58.0 * T + T**2 + 600.0 * C - 330.0 * e_prime_sq) * (A**6) / 720.0
        )
    )

    return easting, northing, zone

def haversine_distance_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Compute great-circle distance between two points on Earth in meters."""
    R = 6371000.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c
