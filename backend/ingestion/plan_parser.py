"""
Floor Plan Ingestion & Parser Subsystem
Conforms to docs/pipeline.md § 4.2 and Phase 5.1-5.3.
"""
from typing import List, Dict, Any, Optional, TypedDict
import os
import json
import ezdxf
from shapely.geometry import Polygon


class RoomJSON(TypedDict):
    room_id: str
    room_type: str  # UNIT, COMMON, CORRIDOR, STAIRS, SHAFT, PARKING, BASEMENT
    polygon: List[List[float]]  # [[x1, y1], [x2, y2], ...]
    area_sqm: float
    assigned_unit: Optional[str]


class LevelJSON(TypedDict):
    level_no: int
    level_name: str
    z_bottom: float
    height: float
    rooms: List[RoomJSON]


class FloorPlanJSON(TypedDict):
    plan_id: str
    version: str
    source_provenance: str  # REAL, PROXY, SYNTHETIC
    building_name: str
    levels: List[LevelJSON]


class DXFParser:
    """
    Parses CAD/DXF architectural floor plans using AutoDCR standard layer conventions:
    - ROOM, RESIDENTIAL_UNIT, UNIT_* -> Class U
    - CORRIDOR, LOBBY, STAIRS, COMMON -> Class C
    - PARKING, SLOT_* -> Class P
    - SHAFT, DUCT, VOID -> Omitted / Void
    - BASEMENT -> Class T
    """

    @staticmethod
    def parse(path: str, z_bottom: float = 0.0, floor_height: float = 3.0) -> FloorPlanJSON:
        doc = ezdxf.readfile(path)
        msp = doc.modelspace()

        rooms: List[RoomJSON] = []
        room_idx = 1

        for entity in msp:
            layer = entity.dxf.layer.upper()
            poly_points: List[List[float]] = []

            if entity.dxftype() == "LWPOLYLINE":
                poly_points = [[float(p[0]), float(p[1])] for p in entity.get_points()]
            elif entity.dxftype() == "POLYLINE":
                poly_points = [[float(v.dxf.location.x), float(v.dxf.location.y)] for v in entity.vertices]

            if len(poly_points) >= 3:
                # Ensure closed polygon
                if poly_points[0] != poly_points[-1]:
                    poly_points.append(poly_points[0])

                sh_poly = Polygon(poly_points)
                if not sh_poly.is_valid:
                    sh_poly = sh_poly.buffer(0)
                area = float(sh_poly.area)

                # Determine room type from AutoDCR layer naming
                if "SHAFT" in layer or "DUCT" in layer or "VOID" in layer:
                    rtype = "SHAFT"
                elif "CORRIDOR" in layer or "STAIR" in layer or "COMMON" in layer or "LOBBY" in layer:
                    rtype = "COMMON"
                elif "PARKING" in layer or "SLOT" in layer:
                    rtype = "PARKING"
                elif "BASEMENT" in layer:
                    rtype = "BASEMENT"
                else:
                    rtype = "UNIT"

                unit_id = f"U-{room_idx:02d}" if rtype == "UNIT" else None
                rooms.append({
                    "room_id": f"RM-{room_idx:03d}",
                    "room_type": rtype,
                    "polygon": poly_points,
                    "area_sqm": round(area, 2),
                    "assigned_unit": unit_id
                })
                room_idx += 1

        plan_id = os.path.splitext(os.path.basename(path))[0]
        return {
            "plan_id": plan_id,
            "version": "1.0",
            "source_provenance": "SYNTHETIC",
            "building_name": plan_id,
            "levels": [
                {
                    "level_no": 1,
                    "level_name": "Typical_Floor_01",
                    "z_bottom": z_bottom,
                    "height": floor_height,
                    "rooms": rooms
                }
            ]
        }

    @staticmethod
    def create_synthetic_dxf(
        path: str,
        units: List[Dict[str, Any]],
        commons: Optional[List[Dict[str, Any]]] = None,
        shafts: Optional[List[Dict[str, Any]]] = None
    ) -> None:
        """Helper generating a well-formed AutoDCR DXF file for testing."""
        doc = ezdxf.new(dxfversion="R2010")
        msp = doc.modelspace()

        doc.layers.add("UNIT", color=1)
        doc.layers.add("COMMON", color=3)
        doc.layers.add("SHAFT", color=7)

        for u in units:
            msp.add_lwpolyline(u["points"], close=True, dxfattribs={"layer": "UNIT"})

        if commons:
            for c in commons:
                msp.add_lwpolyline(c["points"], close=True, dxfattribs={"layer": "COMMON"})

        if shafts:
            for s in shafts:
                msp.add_lwpolyline(s["points"], close=True, dxfattribs={"layer": "SHAFT"})

        os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
        doc.saveas(path)


class IFCParser:
    """Parses IFC structural JSON or BIM models to FloorPlanJSON."""

    @staticmethod
    def parse_from_dict(data: Dict[str, Any]) -> FloorPlanJSON:
        building_name = data.get("Name", "IFC_Building")
        spaces = data.get("Site", {}).get("Building", {}).get("Spaces", [])

        rooms: List[RoomJSON] = []
        for idx, sp in enumerate(spaces):
            desc = sp.get("Description", "")
            rtype = "UNIT"
            if "Common" in desc:
                rtype = "COMMON"
            elif "Parking" in desc:
                rtype = "PARKING"

            elev = float(sp.get("Elevation", 0.0))
            h = float(sp.get("Height", 3.0))

            # Default unit polygon 10m x 10m offset by index
            x_off = idx * 12.0
            polygon = [
                [x_off, 0.0],
                [x_off + 10.0, 0.0],
                [x_off + 10.0, 10.0],
                [x_off, 10.0],
                [x_off, 0.0]
            ]
            rooms.append({
                "room_id": sp.get("Name", f"SPACE-{idx+1:02d}"),
                "room_type": rtype,
                "polygon": polygon,
                "area_sqm": 100.0,
                "assigned_unit": sp.get("Name") if rtype == "UNIT" else None
            })

        return {
            "plan_id": building_name,
            "version": "1.0",
            "source_provenance": "SYNTHETIC",
            "building_name": building_name,
            "levels": [
                {
                    "level_no": 1,
                    "level_name": "Level_01",
                    "z_bottom": 0.0,
                    "height": 3.0,
                    "rooms": rooms
                }
            ]
        }
