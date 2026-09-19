"""
Unit Tests for Expected-Model Pipeline (Phase 5)
Conforms to docs/pipeline.md § 4.2 and Phase 5.8.
"""
import os
import tempfile
import pytest
from src.ingestion.plan_parser import DXFParser, IFCParser
from src.expected_model.plan_to_levels import PlanToLevels
from src.expected_model.rera_validator import RERAValidator


def test_dxf_parsing_and_3d_extrusion():
    tmp_base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".tmp"))
    os.makedirs(tmp_base, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=tmp_base) as tmpdir:
        dxf_path = os.path.join(tmpdir, "test_floor_plan.dxf")

        # 1. Create a synthetic AutoDCR DXF with 2 units, 1 corridor, and 1 shaft
        units = [
            {"points": [(0, 0), (10, 0), (10, 8), (0, 8)]},
            {"points": [(12, 0), (22, 0), (22, 8), (12, 8)]}
        ]
        commons = [
            {"points": [(10, 0), (12, 0), (12, 8), (10, 8)]}  # Corridor between units
        ]
        shafts = [
            {"points": [(0, 8), (2, 8), (2, 10), (0, 10)]}     # Ventilation shaft
        ]
        DXFParser.create_synthetic_dxf(dxf_path, units, commons, shafts)

        # 2. Parse DXF to FloorPlanJSON
        floor_plan = DXFParser.parse(dxf_path, z_bottom=0.0, floor_height=3.2)
        assert floor_plan["version"] == "1.0"
        assert len(floor_plan["levels"]) == 1

        rooms = floor_plan["levels"][0]["rooms"]
        assert len(rooms) == 4
        room_types = [r["room_type"] for r in rooms]
        assert "UNIT" in room_types
        assert "COMMON" in room_types
        assert "SHAFT" in room_types

        # 3. Extrude to 3D Legal Space
        bld = PlanToLevels.extrude_floor_plan(floor_plan, ground_elevation=5.0)
        assert bld.floor_count == 1
        assert bld.height == 3.2

        # Verify classes generated: U (units), C (corridor), L (level hull), B (building hull)
        # Shafts MUST be omitted from volumetric legal space
        vol_classes = {v.cls for v in bld.volumes}
        assert "U" in vol_classes
        assert "C" in vol_classes
        assert "L" in vol_classes
        assert "B" in vol_classes

        # Verify all meshes are watertight and have positive volume
        for v in bld.volumes:
            assert v.mesh.is_watertight, f"Volume {v.label} class {v.cls} is not watertight!"
            assert v.volume > 0.0, f"Volume {v.label} volume <= 0"


def test_rera_validator_tolerances():
    # 1. Strict Pass (<= 5% deviation)
    res_pass = RERAValidator.validate_plan(
        expected_units=10,
        observed_units=10,
        expected_carpet_sqm=1000.0,
        observed_carpet_sqm=1030.0  # +3%
    )
    assert res_pass.status == "PASS"
    assert res_pass.unit_count_match is True
    assert res_pass.area_deviation_pct == 3.0

    # 2. Warning Threshold (5% to 10% deviation, e.g. 6%)
    res_warn = RERAValidator.validate_plan(
        expected_units=10,
        observed_units=10,
        expected_carpet_sqm=1000.0,
        observed_carpet_sqm=1060.0  # +6%
    )
    assert res_warn.status == "WARN"
    assert res_warn.unit_count_match is True
    assert res_warn.area_deviation_pct == 6.0
    assert any(f.status == "WARN" for f in res_warn.findings)

    # 3. Statutory Failure (> 10% deviation, e.g. 12%)
    res_fail = RERAValidator.validate_plan(
        expected_units=10,
        observed_units=10,
        expected_carpet_sqm=1000.0,
        observed_carpet_sqm=1120.0  # +12%
    )
    assert res_fail.status == "FAIL"
    assert res_fail.area_deviation_pct == 12.0
    assert any(f.status == "FAIL" and f.predicate == "RERA_CARPET_AREA_TOLERANCE" for f in res_fail.findings)

    # 4. Unit Count Mismatch Failure
    res_count_fail = RERAValidator.validate_plan(
        expected_units=10,
        observed_units=9,
        expected_carpet_sqm=1000.0,
        observed_carpet_sqm=1000.0
    )
    assert res_count_fail.status == "FAIL"
    assert res_count_fail.unit_count_match is False
    assert any(f.status == "FAIL" and f.predicate == "RERA_UNIT_COUNT_MATCH" for f in res_count_fail.findings)
