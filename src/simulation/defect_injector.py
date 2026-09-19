"""
Controlled Topological & Cadastral Defect Injector
Injects 5 standard defect types with explicit ground-truth manifests:
OVERLAP, UNDERCOUNT, HEIGHT_ERROR, SPLIT_ORPHAN, MISSING_COMMON.
Conforms to docs/implementation_plan.md Phase 3.10.
"""
from enum import Enum
from dataclasses import dataclass
from typing import List, Dict, Any, Tuple
import copy
import numpy as np
import trimesh

from src.simulation.building_gen import BuildingStructure, GeneratedVolume


class DefectType(str, Enum):
    OVERLAP = "OVERLAP"                    # Adjacent unit volumes physically collide
    UNDERCOUNT = "UNDERCOUNT"              # Sanctioned floor or unit missing from model
    HEIGHT_ERROR = "HEIGHT_ERROR"          # Unit/level exceeds building height or envelope
    SPLIT_ORPHAN = "SPLIT_ORPHAN"          # Subdivided unit leaves unassigned orphan space
    MISSING_COMMON = "MISSING_COMMON"      # Private unit boundary illegally absorbs common corridor


@dataclass
class DefectManifest:
    defect_type: DefectType
    target_label: str
    target_class: str
    magnitude: float
    description: str
    expected_rule_failure: str


class DefectInjector:
    """Injects controlled geometric and topological defects into clean structures."""

    @staticmethod
    def inject_overlap(
        building: BuildingStructure,
        overlap_distance_m: float = 0.50
    ) -> Tuple[BuildingStructure, DefectManifest]:
        """Shifts Unit 1 into Unit 2 to create an illegal boundary collision."""
        mutated = copy.deepcopy(building)
        units = mutated.get_by_class("U")
        if len(units) < 2:
            raise ValueError("At least 2 units required to inject OVERLAP.")

        target = units[0]
        # Shift target mesh along x-axis into neighbor
        target.mesh.apply_translation([overlap_distance_m, 0.0, 0.0])
        target.label = f"{target.label}_DEFECT_OVERLAP"

        manifest = DefectManifest(
            defect_type=DefectType.OVERLAP,
            target_label=target.label,
            target_class="U",
            magnitude=overlap_distance_m,
            description=f"Unit shifted by {overlap_distance_m}m colliding with adjacent unit.",
            expected_rule_failure="T2_NO_OVERLAP"
        )
        return mutated, manifest

    @staticmethod
    def inject_undercount(
        building: BuildingStructure
    ) -> Tuple[BuildingStructure, DefectManifest]:
        """Omits an approved unit from the structure."""
        mutated = copy.deepcopy(building)
        units = mutated.get_by_class("U")
        if not units:
            raise ValueError("No units found to inject UNDERCOUNT.")

        omitted = units[-1]
        mutated.volumes = [v for v in mutated.volumes if v.label != omitted.label]

        manifest = DefectManifest(
            defect_type=DefectType.UNDERCOUNT,
            target_label=omitted.label,
            target_class="U",
            magnitude=1.0,
            description=f"Unit {omitted.label} removed from building model.",
            expected_rule_failure="T2_VOLUME_CONSERVATION"
        )
        return mutated, manifest

    @staticmethod
    def inject_height_error(
        building: BuildingStructure,
        excess_height_m: float = 1.20
    ) -> Tuple[BuildingStructure, DefectManifest]:
        """Expands rooftop floor beyond sanctioned building height."""
        mutated = copy.deepcopy(building)
        levels = mutated.get_by_class("L")
        if not levels:
            raise ValueError("No levels found for HEIGHT_ERROR.")

        top_level = levels[-1]
        # Scale z-dimension upwards
        scale_matrix = np.eye(4)
        scale_matrix[2, 2] = 1.0 + (excess_height_m / (top_level.z_max - top_level.z_min))
        top_level.mesh.apply_transform(scale_matrix)
        top_level.z_max += excess_height_m
        top_level.label = f"{top_level.label}_DEFECT_HEIGHT"

        manifest = DefectManifest(
            defect_type=DefectType.HEIGHT_ERROR,
            target_label=top_level.label,
            target_class="L",
            magnitude=excess_height_m,
            description=f"Top level height expanded by {excess_height_m}m exceeding building envelope.",
            expected_rule_failure="T2_CONTAINMENT"
        )
        return mutated, manifest

    @staticmethod
    def inject_missing_common(
        building: BuildingStructure
    ) -> Tuple[BuildingStructure, DefectManifest]:
        """Enlarges a unit to illegally absorb the common corridor."""
        mutated = copy.deepcopy(building)
        commons = mutated.get_by_class("C")
        units = mutated.get_by_class("U")
        if not commons or not units:
            raise ValueError("Both common and unit volumes required for MISSING_COMMON.")

        target_u = units[0]
        corridor = commons[0]
        # Expand unit width to cover corridor
        target_u.mesh = trimesh.boolean.union([target_u.mesh, corridor.mesh])
        mutated.volumes = [v for v in mutated.volumes if v.label != corridor.label]

        manifest = DefectManifest(
            defect_type=DefectType.MISSING_COMMON,
            target_label=target_u.label,
            target_class="U",
            magnitude=abs(float(corridor.volume)),
            description="Private unit boundary expanded, subsuming common corridor.",
            expected_rule_failure="T4_ADMINISTRATIVE_COMMON_AREA"
        )
        return mutated, manifest
