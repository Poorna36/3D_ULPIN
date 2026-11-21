"""
Photogrammetry Computational Geometry and Vertical Slicing
"""
from photogrammetry.geometry.computational_geometry import (
    polygon_area_2d_meters,
    polygon_centroid,
    point_in_polygon,
    is_polygon_contained,
    segments_intersect,
    has_self_intersection,
    calculate_3d_volume_m3,
    check_3d_volume_overlap
)
from photogrammetry.geometry.vertical_slicer import VerticalPropertySlicer

__all__ = [
    "polygon_area_2d_meters",
    "polygon_centroid",
    "point_in_polygon",
    "is_polygon_contained",
    "segments_intersect",
    "has_self_intersection",
    "calculate_3d_volume_m3",
    "check_3d_volume_overlap",
    "VerticalPropertySlicer"
]
