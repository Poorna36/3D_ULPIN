"""
Interoperability Exporters for LADM Part 2, IFC 4.3, and CityJSON
Conforms to docs/features.md § 3.10 and Phase 9.6-9.8.
"""
import json
import uuid
from typing import List, Dict, Any
from src.simulation.building_gen import BuildingStructure
from src.rights.rrr_model import Right


class CadastralExporter:
    """Exports 3D ULPIN cadastral volumes into international open GIS/BIM formats."""

    @staticmethod
    def export_ladm_json(
        building: BuildingStructure,
        rights: List[Right]
    ) -> Dict[str, Any]:
        """
        Exports to ISO 19152 (LADM Part 2) JSON-LD structure:
        - LA_BAUnit (Basic Administrative Unit)
        - LA_SpatialUnit (3D Solid Units)
        - LA_Right (Associated ownership shares)
        """
        spatial_units = []
        for v in building.volumes:
            spatial_units.append({
                "type": "LA_SpatialUnit",
                "suID": v.label,
                "label": v.label,
                "class": v.cls,
                "volume_m3": v.volume,
                "elevation_range": [v.z_min, v.z_max],
                "dimension": "3D"
            })

        la_rights = []
        for r in rights:
            la_rights.append({
                "type": "LA_Right",
                "rID": r.right_id,
                "target_rid": r.rid,
                "rightType": r.right_type.value,
                "share": r.uds_fraction,
                "party": r.holder_pseudonym,
                "legalBasis": r.legal_act_ref
            })

        return {
            "@context": "https://standards.iso.org/iso/19152/ed-2/en/",
            "type": "LA_BAUnit",
            "name": building.name,
            "zone": building.zone,
            "spatialUnits": spatial_units,
            "rights": la_rights
        }

    @staticmethod
    def export_ifc_json(
        building: BuildingStructure
    ) -> Dict[str, Any]:
        """
        Exports to IFC 4.3 spatial hierarchy:
        IfcSite -> IfcBuilding -> IfcBuildingStorey -> IfcSpace (each having LongName=RID).
        """
        spaces = []
        for v in building.volumes:
            spaces.append({
                "type": "IfcSpace",
                "GlobalId": uuid.uuid4().hex[:22],
                "Name": v.label,
                "LongName": v.label,  # Canonical RID binding
                "Tag": f"3D-ULPIN-{v.label}",
                "Description": f"3D Cadastral Unit Class {v.cls}",
                "Elevation": v.z_min,
                "Height": round(v.z_max - v.z_min, 3)
            })

        return {
            "type": "IfcProject",
            "GlobalId": uuid.uuid4().hex[:22],
            "Name": building.name,
            "Site": {
                "type": "IfcSite",
                "Building": {
                    "type": "IfcBuilding",
                    "Name": building.name,
                    "Elevation": building.ground_elevation,
                    "Spaces": spaces
                }
            }
        }

    @staticmethod
    def export_cityjson(
        building: BuildingStructure
    ) -> Dict[str, Any]:
        """
        Exports to CityJSON 1.1 CityObjects representation:
        Building -> BuildingUnit.
        """
        city_objects = {}
        # Parent Building
        city_objects[building.name] = {
            "type": "Building",
            "attributes": {
                "height": building.height,
                "storeysAboveGround": building.floor_count
            },
            "children": [v.label for v in building.volumes]
        }

        # Child 3D units
        for v in building.volumes:
            city_objects[v.label] = {
                "type": "BuildingUnit",
                "attributes": {
                    "class": v.cls,
                    "z_min": v.z_min,
                    "z_max": v.z_max,
                    "volume": v.volume
                },
                "parents": [building.name]
            }

        return {
            "type": "CityJSON",
            "version": "1.1",
            "CityObjects": city_objects,
            "vertices": []
        }

    @staticmethod
    def parse_ladm_rids(ladm_data: Dict[str, Any]) -> List[str]:
        """Extracts cadastral RIDs from an exported LADM Part 2 document."""
        return [su["suID"] for su in ladm_data.get("spatialUnits", []) if "suID" in su]

    @staticmethod
    def parse_ifc_rids(ifc_data: Dict[str, Any]) -> List[str]:
        """Extracts cadastral RIDs from an exported IFC JSON document."""
        spaces = ifc_data.get("Site", {}).get("Building", {}).get("Spaces", [])
        return [s.get("LongName") or s.get("Name") for s in spaces if (s.get("LongName") or s.get("Name"))]

    @staticmethod
    def parse_cityjson_rids(cityjson_data: Dict[str, Any]) -> List[str]:
        """Extracts cadastral RIDs from an exported CityJSON document."""
        return [
            k for k, v in cityjson_data.get("CityObjects", {}).items()
            if v.get("type") == "BuildingUnit"
        ]
