"""
GIS Vector & Raster Reader — GeoJSON, Shapefile, GPKG, GeoTIFF
Conforms to docs/implementation_plan.md Phase 1.3-1.4.

Every output carries a ProvenanceRecord. Reprojection is always to WGS84
(EPSG:4326) for vectors and the caller-specified CRS for rasters.
"""
from __future__ import annotations

import os
from typing import Optional, Dict, Any, List, Tuple

from src.ingestion.provenance import ProvenanceRecord, LedgerStore, VALID_PROVENANCE_TAGS


# ---------------------------------------------------------------------------
# Optional heavy imports — degrade gracefully if not installed
# ---------------------------------------------------------------------------
try:
    import geopandas as gpd
    from pyproj import CRS, Transformer
    _GEO_AVAILABLE = True
except ImportError:
    _GEO_AVAILABLE = False

try:
    import rasterio
    from rasterio.warp import reproject, Resampling, calculate_default_transform
    import numpy as np
    _RASTER_AVAILABLE = True
except ImportError:
    _RASTER_AVAILABLE = False


class GISReader:
    """
    Reads geospatial vector and raster files with automatic CRS normalisation
    and provenance tagging.

    Usage
    -----
    ledger = LedgerStore("provenance_ledger.db")
    reader = GISReader(ledger=ledger)
    gdf, prov = reader.read_vector(
        path="data/real/mz1_boundary.geojson",
        source_id="mz1_boundary",
        data_provenance="REAL",
        license="ODbL-1.0",
        notes="MCGM open GIS portal download"
    )
    """

    def __init__(self, ledger: Optional[LedgerStore] = None) -> None:
        self.ledger = ledger

    # ------------------------------------------------------------------
    # Phase 1.3 — Vector Reader
    # ------------------------------------------------------------------
    def read_vector(
        self,
        path: str,
        source_id: str,
        data_provenance: str,
        license: str = "UNKNOWN",
        notes: str = "",
        target_crs: str = "EPSG:4326",
    ) -> Tuple[Any, ProvenanceRecord]:
        """
        Read a vector file (GeoJSON / Shapefile / GPKG) and reproject to
        target_crs (default WGS84 / EPSG:4326).

        Returns
        -------
        (GeoDataFrame, ProvenanceRecord)

        Raises
        ------
        ImportError  if geopandas is not installed
        FileNotFoundError  if path does not exist
        """
        if not _GEO_AVAILABLE:
            if path.lower().endswith((".geojson", ".json")):
                import json
                with open(path, "r", encoding="utf-8") as f:
                    gdf = json.load(f)
                record = ProvenanceRecord(
                    source_id=source_id,
                    file_path=os.path.abspath(path),
                    data_provenance=data_provenance,
                    crs=target_crs,
                    datum="WGS84",
                    resolution_m=None,
                    accuracy_sigma_m=None,
                    license=license,
                    download_ts=_now_iso(),
                    notes=notes,
                )
                if self.ledger:
                    self.ledger.log(record)
                return gdf, record
            raise ImportError(
                "geopandas is required for GISReader.read_vector() on non-GeoJSON files. "
                "Install with: pip install geopandas"
            )
        if not os.path.exists(path):
            raise FileNotFoundError(f"Vector file not found: {path}")

        gdf = gpd.read_file(path)

        # Determine input CRS
        src_crs = gdf.crs.to_string() if gdf.crs else "UNKNOWN"

        # Reproject to target CRS if needed
        if gdf.crs is not None and gdf.crs.to_string() != CRS(target_crs).to_string():
            gdf = gdf.to_crs(target_crs)
        elif gdf.crs is None:
            # Assume WGS84 if not specified (common for plain GeoJSON)
            gdf = gdf.set_crs(target_crs, allow_override=True)

        record = ProvenanceRecord(
            source_id=source_id,
            file_path=os.path.abspath(path),
            data_provenance=data_provenance,
            crs=target_crs,
            datum="WGS84",
            resolution_m=None,
            accuracy_sigma_m=None,
            license=license,
            download_ts=_now_iso(),
            notes=notes,
        )

        if self.ledger:
            self.ledger.log(record)

        return gdf, record

    # ------------------------------------------------------------------
    # Phase 1.4 — Raster Reader (DEM / DSM / Orthophoto)
    # ------------------------------------------------------------------
    def read_raster(
        self,
        path: str,
        source_id: str,
        data_provenance: str,
        license: str = "UNKNOWN",
        notes: str = "",
        target_crs: str = "EPSG:4326",
        resolution_m: Optional[float] = None,
        accuracy_sigma_m: Optional[float] = None,
    ) -> Tuple[Any, Dict[str, Any], ProvenanceRecord]:
        """
        Read a GeoTIFF raster (DEM, DSM, orthophoto) via rasterio.
        Reprojects to target_crs in-memory.

        Returns
        -------
        (numpy.ndarray, rasterio_profile_dict, ProvenanceRecord)
        The numpy array has shape (bands, height, width).

        Raises
        ------
        ImportError  if rasterio is not installed
        FileNotFoundError  if path does not exist
        """
        if not _RASTER_AVAILABLE:
            raise ImportError(
                "rasterio and numpy are required for GISReader.read_raster(). "
                "Install with: pip install rasterio numpy"
            )
        if not os.path.exists(path):
            raise FileNotFoundError(f"Raster file not found: {path}")

        dst_crs = rasterio.crs.CRS.from_string(target_crs)

        with rasterio.open(path) as src:
            transform, width, height = calculate_default_transform(
                src.crs, dst_crs, src.width, src.height, *src.bounds
            )
            profile = src.profile.copy()
            profile.update(
                crs=dst_crs,
                transform=transform,
                width=width,
                height=height,
            )

            data = np.zeros(
                (src.count, height, width),
                dtype=profile.get("dtype", "float32")
            )
            for band_idx in range(1, src.count + 1):
                reproject(
                    source=rasterio.band(src, band_idx),
                    destination=data[band_idx - 1],
                    src_transform=src.transform,
                    src_crs=src.crs,
                    dst_transform=transform,
                    dst_crs=dst_crs,
                    resampling=Resampling.bilinear,
                )

            # Estimate ground resolution if not supplied
            if resolution_m is None:
                pixel_size_deg = abs(float(transform.a))  # x cell size in degrees
                resolution_m = round(pixel_size_deg * 111_320, 2)  # approx metres at equator

        record = ProvenanceRecord(
            source_id=source_id,
            file_path=os.path.abspath(path),
            data_provenance=data_provenance,
            crs=target_crs,
            datum="WGS84",
            resolution_m=resolution_m,
            accuracy_sigma_m=accuracy_sigma_m,
            license=license,
            download_ts=_now_iso(),
            notes=notes,
        )

        if self.ledger:
            self.ledger.log(record)

        return data, profile, record


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------
def _now_iso() -> str:
    from datetime import datetime, timezone
    return datetime.now(timezone.utc).isoformat()

