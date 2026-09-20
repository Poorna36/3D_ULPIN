"""
Vertical Property Slicer
Delineates 3D volumetric parcels (PropertyVolume) across building levels,
generating vertical boundaries, elevation bounds (z_min, z_max), and 3D ULPIN identifiers.
"""
from typing import List, Dict, Any, Optional
from services.geometry.computational_geometry import calculate_3d_volume_m3
from services.identifiers.generator import generate_prototype_3d_id

class VerticalPropertySlicer:
    """
    Subdivides an extracted 3D building solid into discrete vertical property volumes
    (floors, apartments, and basements) conforming to data-model.md.
    """

    def slice_building(
        self,
        building_id: str,
        country: str,
        city: str,
        footprint: List[List[float]],
        ground_elevation: float,
        roof_elevation: float,
        parent_parcel_id: str,
        has_underground: bool = True,
        units_per_floor: int = 2
    ) -> Dict[str, Any]:
        """
        Produce structured floors and 3D volumetric units for a building solid.
        """
        height = max(3.0, roof_elevation - ground_elevation)
        typical_floor_height = 3.0
        floor_count = max(1, int(round(height / typical_floor_height)))

        floors: List[Dict[str, Any]] = []
        property_volumes: List[Dict[str, Any]] = []

        # 1. Underground / Basement Volume
        if has_underground:
            b_height = 3.5
            b_zmin = round(ground_elevation - b_height, 2)
            b_zmax = round(ground_elevation, 2)
            b_vol_id = f"{building_id}-VOL-B1"
            b_ulpin = generate_prototype_3d_id(
                country_code=country[:2].upper(),
                city_code=city[:3].upper(),
                building_ref=building_id,
                height=b_height,
                floor_count=1,
                is_underground=True
            )

            floors.append({
                "floor_id": f"{building_id}-FL-B1",
                "building_id": building_id,
                "level_index": -1,
                "level_name": "Basement B1 (Underground Parking & Utilities)",
                "z_min": b_zmin,
                "z_max": b_zmax,
                "is_underground": True
            })

            property_volumes.append({
                "property_volume_id": b_vol_id,
                "building_id": building_id,
                "parent_parcel_id": parent_parcel_id,
                "floor_id": f"{building_id}-FL-B1",
                "unit_id": "UG-B1-PARK",
                "unit_name": "Basement Parking & Subsurface Utility Network",
                "footprint": footprint,
                "z_min": b_zmin,
                "z_max": b_zmax,
                "volume_m3": calculate_3d_volume_m3(footprint, b_zmin, b_zmax),
                "is_underground": True,
                "prototype_3d_id": b_ulpin,
                "confidence": "AUTHORITATIVE_SURVEY",
                "status": "VALID"
            })

        # 2. Above-Ground Floors
        current_z = ground_elevation
        for floor_idx in range(floor_count):
            f_height = 4.0 if floor_idx == 0 else typical_floor_height
            f_zmin = round(current_z, 2)
            f_zmax = round(current_z + f_height, 2)
            current_z += f_height

            floor_label = "Ground Level" if floor_idx == 0 else f"Level {floor_idx}"
            floor_id = f"{building_id}-FL-{floor_idx:02d}"

            floors.append({
                "floor_id": floor_id,
                "building_id": building_id,
                "level_index": floor_idx,
                "level_name": floor_label,
                "z_min": f_zmin,
                "z_max": f_zmax,
                "is_underground": False
            })

            # Subdivide floor into units
            for u in range(1, units_per_floor + 1):
                unit_code = f"U-{floor_idx:02d}0{u}"
                vol_id = f"{building_id}-VOL-{floor_idx:02d}0{u}"
                unit_ulpin = generate_prototype_3d_id(
                    country_code=country[:2].upper(),
                    city_code=city[:3].upper(),
                    building_ref=f"{building_id}-{unit_code}",
                    height=f_height,
                    floor_count=floor_idx + 1,
                    is_underground=False
                )

                property_volumes.append({
                    "property_volume_id": vol_id,
                    "building_id": building_id,
                    "parent_parcel_id": parent_parcel_id,
                    "floor_id": floor_id,
                    "unit_id": unit_code,
                    "unit_name": f"Unit {unit_code} ({floor_label})",
                    "footprint": footprint,
                    "z_min": f_zmin,
                    "z_max": f_zmax,
                    "volume_m3": round(calculate_3d_volume_m3(footprint, f_zmin, f_zmax) / units_per_floor, 2),
                    "is_underground": False,
                    "prototype_3d_id": unit_ulpin,
                    "confidence": "DERIVED_HIGH",
                    "status": "VALID"
                })

        return {
            "building_id": building_id,
            "floors": floors,
            "property_volumes": property_volumes,
            "total_floors": len(floors),
            "total_volumes": len(property_volumes),
            "total_volume_m3": sum(v["volume_m3"] for v in property_volumes)
        }
