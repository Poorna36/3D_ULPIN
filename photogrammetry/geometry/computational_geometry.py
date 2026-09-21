"""
3D Computational Geometry Utilities
Pure-Python / NumPy implementations for 2D polygon topology,
Shoelace area calculation, ray-casting containment, and 3D prism volumetric analysis.
"""
from typing import List, Tuple, Dict, Any, Optional
import math
from photogrammetry.adapters.india.crs_transformer import wgs84_to_utm

def polygon_area_2d_meters(coords_lon_lat: List[List[float]]) -> float:
    """
    Calculate 2D horizontal surface area in square meters (m^2)
    using UTM projected coordinates and the Shoelace formula.
    """
    if len(coords_lon_lat) < 3:
        return 0.0

    # Project to local UTM metric coordinates
    utm_pts = []
    zone = None
    for lon, lat in coords_lon_lat:
        e, n, z = wgs84_to_utm(lat, lon, zone=zone)
        zone = z
        utm_pts.append((e, n))

    # Shoelace formula
    n_pts = len(utm_pts)
    area = 0.0
    for i in range(n_pts):
        j = (i + 1) % n_pts
        area += utm_pts[i][0] * utm_pts[j][1]
        area -= utm_pts[j][0] * utm_pts[i][1]
    return abs(area) / 2.0


def polygon_centroid(coords_lon_lat: List[List[float]]) -> Tuple[float, float]:
    """Calculate centroid (longitude, latitude) of a polygon."""
    n = len(coords_lon_lat)
    if n == 0:
        return (0.0, 0.0)
    avg_lon = sum(p[0] for p in coords_lon_lat) / n
    avg_lat = sum(p[1] for p in coords_lon_lat) / n
    return (avg_lon, avg_lat)


def point_in_polygon(point: List[float], polygon: List[List[float]]) -> bool:
    """
    Ray-casting algorithm to test if 2D point [lon, lat] is inside polygon.
    """
    x, y = point[0], point[1]
    inside = False
    n = len(polygon)
    p1x, p1y = polygon[0][0], polygon[0][1]
    for i in range(1, n + 1):
        p2x, p2y = polygon[i % n][0], polygon[i % n][1]
        if y > min(p1y, p2y):
            if y <= max(p1y, p2y):
                if x <= max(p1x, p2x):
                    if p1y != p2y:
                        xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or x <= xinters:
                        inside = not inside
        p1x, p1y = p2x, p2y
    return inside


def is_polygon_contained(inner_poly: List[List[float]], outer_poly: List[List[float]]) -> bool:
    """
    Check if all vertices of inner polygon are contained within outer polygon.
    """
    if not inner_poly or not outer_poly:
        return False
    for pt in inner_poly:
        if not point_in_polygon(pt, outer_poly):
            return False
    return True


def segments_intersect(p1, p2, p3, p4) -> bool:
    """Return True if line segments p1-p2 and p3-p4 intersect."""
    def ccw(a, b, c):
        return (c[1] - a[1]) * (b[0] - a[0]) > (b[1] - a[1]) * (c[0] - a[0])
    return (ccw(p1, p3, p4) != ccw(p2, p3, p4)) and (ccw(p1, p2, p3) != ccw(p1, p2, p4))


def has_self_intersection(polygon: List[List[float]]) -> bool:
    """Check if a polygon self-intersects."""
    n = len(polygon)
    if n < 4:
        return False
    for i in range(n):
        for j in range(i + 2, n):
            if (i == 0 and j == n - 1):
                continue
            p1, p2 = polygon[i], polygon[(i + 1) % n]
            p3, p4 = polygon[j], polygon[(j + 1) % n]
            if segments_intersect(p1, p2, p3, p4):
                return True
    return False


def calculate_3d_volume_m3(footprint_lon_lat: List[List[float]], z_min: float, z_max: float) -> float:
    """
    Calculate 3D prism volume in cubic meters (m^3):
    Volume = Horizontal_Area_m2 * (z_max - z_min)
    """
    height_m = max(0.0, z_max - z_min)
    area_m2 = polygon_area_2d_meters(footprint_lon_lat)
    return round(area_m2 * height_m, 2)


def check_3d_volume_overlap(
    vol1: Dict[str, Any],
    vol2: Dict[str, Any]
) -> bool:
    """
    Check if two 3D property volumes collide:
    Must overlap vertically (Z range) and horizontally (footprint bounding/centroid).
    """
    # Vertical check
    z_overlap = max(vol1['z_min'], vol2['z_min']) < min(vol1['z_max'], vol2['z_max'])
    if not z_overlap:
        return False

    # Horizontal centroid distance check
    c1 = polygon_centroid(vol1.get('footprint', []))
    c2 = polygon_centroid(vol2.get('footprint', []))
    d = math.sqrt((c1[0] - c2[0])**2 + (c1[1] - c2[1])**2)
    return d < 0.00005  # roughly under 5 meters horizontally
