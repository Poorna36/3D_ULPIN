"""
Unit Tests for Parametric Building Generator, Defect Injector, and Sensor Simulator
Conforms to docs/features.md § 3.5, docs/implementation_plan.md Phase 3.
"""
import pytest
import numpy as np
import trimesh

from src.simulation.building_gen import (
    BuildingGenerator,
    generate_mz1_hero_tower,
    generate_bz1_hero_tower
)
from src.simulation.defect_injector import DefectInjector, DefectType
from src.simulation.sensor_sim import SensorSimulator


def test_building_generator_all_ten_classes():
    """Parametric generator must exercise all 10 canonical property classes."""
    gen = BuildingGenerator(ground_elevation=10.0)
    structure = gen.generate(
        name="AllClassTest",
        floor_count=4,
        basement_count=1,
        has_metro_tunnel=True,
        has_elevated_metro=True
    )

    found_classes = {v.cls for v in structure.volumes}
    expected_classes = {"S", "B", "L", "U", "C", "P", "A", "T", "E", "I"}
    assert expected_classes.issubset(found_classes), f"Missing classes: {expected_classes - found_classes}"


def test_mesh_watertightness_and_positive_volume():
    """All generated building volumes must be closed, 2-manifold watertight polyhedra."""
    mz1 = generate_mz1_hero_tower()
    for vol in mz1.volumes:
        assert vol.mesh.is_watertight is True, f"Volume {vol.label} ({vol.cls}) is not watertight!"
        assert vol.volume > 0.0, f"Volume {vol.label} has non-positive volume!"


def test_volume_conservation():
    """Unit and common volumes within a level must sum to approximately the level volume."""
    gen = BuildingGenerator(ground_elevation=0.0)
    structure = gen.generate(floor_count=2, units_per_floor=4)

    # Inspect Level 0
    level_vol = next(v for v in structure.volumes if v.label == "Synthetic Tower_Level_00")
    child_units = [v for v in structure.volumes if "Level_00" in v.label and v.cls in ("U", "C")]

    sum_children = sum(u.volume for u in child_units)
    # The sum of private units + central corridor should match level volume within 1%
    ratio = abs(sum_children - level_vol.volume) / level_vol.volume
    assert ratio <= 0.01, f"Volume conservation failed: sum children {sum_children} vs level {level_vol.volume}"


def test_defect_injector_manifests():
    """Defect injector must inject controlled flaws with explicit ground-truth manifests."""
    bz1 = generate_bz1_hero_tower()

    # 1. OVERLAP
    bld_overlap, man_overlap = DefectInjector.inject_overlap(bz1, overlap_distance_m=0.80)
    assert man_overlap.defect_type == DefectType.OVERLAP
    assert man_overlap.expected_rule_failure == "T2_NO_OVERLAP"

    # 2. UNDERCOUNT
    bld_under, man_under = DefectInjector.inject_undercount(bz1)
    assert man_under.defect_type == DefectType.UNDERCOUNT
    assert len(bld_under.get_by_class("U")) == len(bz1.get_by_class("U")) - 1

    # 3. HEIGHT_ERROR
    bld_h, man_h = DefectInjector.inject_height_error(bz1, excess_height_m=2.0)
    assert man_h.defect_type == DefectType.HEIGHT_ERROR

    # 4. MISSING_COMMON
    bld_com, man_com = DefectInjector.inject_missing_common(bz1)
    assert man_com.defect_type == DefectType.MISSING_COMMON


def test_sensor_simulator_lidar_raycasting():
    """Sensor simulator must produce realistic noisy point clouds over building surfaces."""
    mesh = trimesh.creation.box(extents=[15.0, 15.0, 10.0])
    sim = SensorSimulator(flight_altitude_m=100.0, scan_resolution_m=1.0, range_noise_sigma_m=0.05)

    pc = sim.render_lidar(mesh)
    assert pc.provenance == "SYNTHETIC"
    assert len(pc.points) > 50
    assert pc.points.shape[1] == 3
    assert len(pc.intensities) == len(pc.points)
