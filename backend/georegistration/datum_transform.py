"""
Geodetic Coordinate Reference System (CRS) & Datum Transformations
Conforms to docs/features.md, docs/config.md, and Phase 4.2.
"""
from dataclasses import dataclass
from typing import Tuple, List, Union
import pyproj
import numpy as np


@dataclass
class TransformResult:
    target_coords: Union[Tuple[float, float, float], np.ndarray]
    source_crs: str
    target_crs: str
    roundtrip_residual_m: float


class DatumTransformer:
    """
    Transforms coordinates between international global datum (WGS84 / ITRF)
    and Indian cadastral / projected coordinate systems:
    - UTM Zone 43N (EPSG:32643) — Mumbai / Western India
    - UTM Zone 44N (EPSG:32644) — Bengaluru / Southern India
    - Everest 1830 Indian Datum (EPSG:24378 / EPSG:24379)
    """

    @staticmethod
    def transform_point(
        x: float,
        y: float,
        z: float,
        source_epsg: str = "EPSG:4326",
        target_epsg: str = "EPSG:32643"
    ) -> TransformResult:
        """Transforms a 3D coordinate point between EPSG coordinate systems."""
        # Setup forward and reverse transformers (always_xy=True ensures x=lon/easting, y=lat/northing)
        fwd_trans = pyproj.Transformer.from_crs(source_epsg, target_epsg, always_xy=True)
        rev_trans = pyproj.Transformer.from_crs(target_epsg, source_epsg, always_xy=True)

        # Forward transformation
        tx, ty, tz = fwd_trans.transform(x, y, z)

        # Reverse transformation for round-trip residual check
        rx, ry, rz = rev_trans.transform(tx, ty, tz)
        residual = float(np.sqrt((rx - x) ** 2 + (ry - y) ** 2 + (rz - z) ** 2))

        return TransformResult(
            target_coords=(round(tx, 4), round(ty, 4), round(tz, 4)),
            source_crs=source_epsg,
            target_crs=target_epsg,
            roundtrip_residual_m=round(residual, 6)
        )
