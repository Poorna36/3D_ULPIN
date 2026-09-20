"""
Unit Tests for Parametric Building Generator, Defect Injector, and Sensor Simulator
Conforms to docs/features.md § 3.5, docs/implementation_plan.md Phase 3.
"""
import pytest
import numpy as np
import trimesh

from backend.simulation.building_gen import (
    BuildingGenerator,
    BuildingTypology,
    generate_mz1_hero_tower,
    generate_bz1_hero_tower,
    generate_podium_tower,
    generate_stepped_tower,
    generate_commercial_campus,
    generate_arasaka_tower
)
from backend.simulation.defect_injector import DefectInjector, DefectType
from backend.simulation.sensor_sim import SensorSimulator


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


def test_building_typologies_diversity():
    """Verify distinct architectural typologies maintain watertightness and volume conservation."""
    typology_generators = [
        ("Podium_Tower", generate_podium_tower()),
        ("Stepped_Highrise", generate_stepped_tower()),
        ("Commercial_Campus", generate_commercial_campus()),
        ("Arasaka_Megatower", generate_arasaka_tower()),
    ]

    for name, bld in typology_generators:
        assert bld.floor_count > 0
        assert len(bld.volumes) > 0

        # Check all volumes are watertight 2-manifolds with positive volume
        for vol in bld.volumes:
            assert vol.mesh.is_watertight is True, f"Volume {vol.label} in {name} is not watertight!"
            assert vol.volume > 0.0, f"Volume {vol.label} in {name} has non-positive volume!"

        # Check volume conservation across levels
        levels = bld.get_by_class("L")
        for lvl in levels[:3]:  # Test first 3 levels
            child_units = [v for v in bld.volumes if lvl.label in v.label and v.cls in ("U", "C", "P") and v.label != lvl.label]
            if child_units:
                sum_children = sum(u.volume for u in child_units)
                ratio = abs(sum_children - lvl.volume) / lvl.volume
                assert ratio <= 0.01, f"Volume conservation failed in {name} for {lvl.label}: sum={sum_children}, level={lvl.volume}"

    # Verify sandbox model properties
    arasaka = generate_arasaka_tower()
    assert arasaka.jurisdiction == "SANDBOX"
    assert arasaka.typology == BuildingTypology.CYBERPUNK_MEGATOWER.value


def test_intra_building_floor_variations():
    """Verify realistic floor-to-floor variations within the same building."""
    gen = BuildingGenerator(ground_elevation=0.0)
    tower = gen.generate(
        name="VariedTower",
        floor_count=6,
        floor_variation=True
    )

    # 1. Ground floor (Level 00): Grand lobby + retail units
    lvl0_vols = [v for v in tower.volumes if "Level_00" in v.label]
    lvl0_labels = [v.label for v in lvl0_vols]
    assert any("GrandLobby" in l for l in lvl0_labels), "Ground floor missing Grand Lobby!"
    assert any("Retail" in l for l in lvl0_labels), "Ground floor missing Retail unit!"

    # 2. Even mid-floor (Level 02, Type A): 3BHK Master + 1BHK Studio + 2BHKs
    lvl2_vols = [v for v in tower.volumes if "Level_02" in v.label]
    lvl2_labels = [v.label for v in lvl2_vols]
    assert any("3BHK_Master" in l for l in lvl2_labels), "Level 02 missing 3BHK Master!"
    assert any("1BHK_Studio" in l for l in lvl2_labels), "Level 02 missing 1BHK Studio!"

    # 3. Odd mid-floor (Level 03, Type B): Executive Suites + Studio
    lvl3_vols = [v for v in tower.volumes if "Level_03" in v.label]
    lvl3_labels = [v.label for v in lvl3_vols]
    assert any("ExecSuite" in l for l in lvl3_labels), "Level 03 missing Executive Suite!"
    assert any("Studio_Center" in l for l in lvl3_labels), "Level 03 missing Central Studio!"

    # 4. Top floor (Level 05, Penthouse): Royal/Imperial Penthouse + Sky Terraces
    lvl5_vols = [v for v in tower.volumes if "Level_05" in v.label]
    lvl5_labels = [v.label for v in lvl5_vols]
    assert any("Penthouse" in l for l in lvl5_labels), "Top floor missing Penthouse!"
    assert any("SkyTerrace" in l for l in lvl5_labels), "Top floor missing Sky Terrace!"

