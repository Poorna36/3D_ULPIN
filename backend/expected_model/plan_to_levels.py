"""
Expected-Model Plan to 3D Legal Space Extruder
Conforms to docs/pipeline.md § 4.2, docs/decisions.md, and Phase 5.4-5.5.
"""
from typing import List, Dict, Any, Optional
import numpy as np
import trimesh
from shapely.geometry import Polygon

from backend.ingestion.plan_parser import FloorPlanJSON, LevelJSON, RoomJSON
from backend.simulation.building_gen import GeneratedVolume, BuildingStructure


ROOM_TYPE_TO_CLASS = {
    "UNIT": "U",
    "RESIDENTIAL": "U",
    "COMMERCIAL": "U",
    "COMMON": "C",
    "CORRIDOR": "C",
    "STAIRS": "C",
    "LOBBY": "C",
    "PARKING": "P",
    "BASEMENT": "T",
}


class PlanToLevels:
    """
    Extrudes 2D architectural floor plan polygons into watertight 3D polyhedral
    cadastral solids with proper classification and parent-child containment.
    """

    @staticmethod
    def extrude_floor_plan(
        plan: FloorPlanJSON,
        ground_elevation: float = 0.0
    ) -> BuildingStructure:
        volumes: List[GeneratedVolume] = []
        bld_name = plan.get("building_name", "Building")
        levels = plan.get("levels", [])

        total_z_min = float("inf")
        total_z_max = float("-inf")

        for lvl in levels:
            lvl_no = lvl["level_no"]
            lvl_name = lvl.get("level_name", f"Level_{lvl_no:02d}")
            z_bot = ground_elevation + float(lvl["z_bottom"])
            h = float(lvl["height"])
            z_top = z_bot + h

            total_z_min = min(total_z_min, z_bot)
            total_z_max = max(total_z_max, z_top)

            lvl_meshes: List[trimesh.Trimesh] = []

            for r in lvl.get("rooms", []):
                rtype = r["room_type"].upper()
                # Special handling: Shafts, voids, and ducts are voids (no solid, no RID)
                if rtype in {"SHAFT", "DUCT", "VOID"}:
                    continue

                cls = ROOM_TYPE_TO_CLASS.get(rtype, "U")
                poly_pts = r["polygon"]
                if len(poly_pts) < 3:
                    continue

                poly2d = Polygon(poly_pts)
                if not poly2d.is_valid:
                    poly2d = poly2d.buffer(0)

                # Extrude 2D polygon to watertight 3D solid
                mesh = trimesh.creation.extrude_polygon(poly2d, height=h)
                mesh.apply_translation([0.0, 0.0, z_bot])
                mesh.fix_normals()

                vol = abs(float(mesh.volume))
                gv = GeneratedVolume(
                    cls=cls,
                    label=f"{bld_name}_{r['room_id']}",
                    mesh=mesh,
                    z_min=round(z_bot, 3),
                    z_max=round(z_top, 3),
                    volume=round(vol, 3),
                    parent_label=lvl_name,
                    data_provenance=plan.get("source_provenance", "SYNTHETIC")
                )
                volumes.append(gv)
                lvl_meshes.append(mesh)

            # Create Level envelope volume (Class L)
            if lvl_meshes:
                combined_pts = np.vstack([m.vertices for m in lvl_meshes])
                lvl_hull = trimesh.convex.convex_hull(combined_pts)
                lvl_vol = GeneratedVolume(
                    cls="L",
                    label=f"{bld_name}_{lvl_name}",
                    mesh=lvl_hull,
                    z_min=round(z_bot, 3),
                    z_max=round(z_top, 3),
                    volume=round(abs(float(lvl_hull.volume)), 3),
                    parent_label=bld_name,
                    data_provenance=plan.get("source_provenance", "SYNTHETIC")
                )
                volumes.append(lvl_vol)

        # Create Building envelope volume (Class B)
        all_unit_meshes = [v.mesh for v in volumes if v.cls in {"U", "C", "P", "T"}]
        if all_unit_meshes:
            all_pts = np.vstack([m.vertices for m in all_unit_meshes])
            bld_hull = trimesh.convex.convex_hull(all_pts)
            bld_vol = GeneratedVolume(
                cls="B",
                label=f"{bld_name}_Envelope",
                mesh=bld_hull,
                z_min=round(total_z_min, 3),
                z_max=round(total_z_max, 3),
                volume=round(abs(float(bld_hull.volume)), 3),
                parent_label=None,
                data_provenance=plan.get("source_provenance", "SYNTHETIC")
            )
            volumes.append(bld_vol)

        return BuildingStructure(
            name=bld_name,
            zone="ZONE-1",
            ground_elevation=ground_elevation,
            height=round(total_z_max - total_z_min, 3) if total_z_max > total_z_min else 0.0,
            floor_count=len(levels),
            volumes=volumes
        )
