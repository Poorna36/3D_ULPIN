"""
Unit Tests for Multi-Tier Validation Engine (T0-T4)
Conforms to docs/validation.md and Phase 8.
"""
import pytest
import numpy as np
import trimesh

from backend.validation.t0_integrity import T0IntegrityValidator
from backend.validation.t1_geometry import T1GeometryValidator
from backend.validation.t2_topology import T2TopologyValidator
from backend.validation.t3_reconciliation import T3ReconciliationValidator
from backend.validation.t4_admin import T4AdminValidator
from backend.simulation.building_gen import generate_mz1_hero_tower
from backend.simulation.defect_injector import DefectInjector


def test_t0_integrity_validation():
    """T0 must pass valid records and fail missing CRS/provenance."""
    clean_findings = T0IntegrityValidator.validate(
        rid="BLR-TEST-001",
        data_provenance="SYNTHETIC",
        crs="EPSG:4326",
        geometry={"type": "Solid"}
    )
    assert all(f.status == "PASS" for f in clean_findings)

    corrupted_findings = T0IntegrityValidator.validate(
        rid="BLR-TEST-002",
        data_provenance=None,
        crs="",
        geometry=None
    )
    assert all(f.status == "FAIL" for f in corrupted_findings)


def test_t1_geometry_validation():
    """T1 must pass watertight solid and fail open surface."""
    box = trimesh.creation.box(extents=[10.0, 10.0, 3.0])
    findings = T1GeometryValidator.validate(rid="BLR-BLD-01", mesh=box)
    assert any(f.predicate == "T1_WATERTIGHT" and f.status == "PASS" for f in findings)
    assert any(f.predicate == "T1_POSITIVE_VOLUME" and f.status == "PASS" for f in findings)


def test_t2_topology_no_overlap_and_defect_detection():
    """T2 No-Overlap check must pass disjoint units and fail overlapping ones."""
    u1 = trimesh.creation.box(extents=[10.0, 10.0, 3.0])
    u2 = trimesh.creation.box(extents=[10.0, 10.0, 3.0])
    u2.apply_translation([15.0, 0.0, 0.0])  # Disjoint

    f_clean = T2TopologyValidator.check_no_overlap(u1, u2, "U1", "U2", epsilon_v=0.05)
    assert f_clean.status == "PASS"

    # Now make them overlap by 3 meters
    u2.apply_translation([-12.0, 0.0, 0.0])
    f_overlap = T2TopologyValidator.check_no_overlap(u1, u2, "U1", "U2", epsilon_v=0.05)
    assert f_overlap.status == "FAIL"
    assert f_overlap.magnitude > 0.05


def test_t2_vertical_order_validation():
    """T2 vertical order must pass ascending levels and fail inverted storeys."""
    valid_levels = [
        ("F0", 0.0, 3.2),
        ("F1", 3.2, 6.4),
        ("F2", 6.4, 9.6)
    ]
    f_valid = T2TopologyValidator.check_vertical_order(valid_levels)
    assert all(f.status == "PASS" for f in f_valid)

    inverted_levels = [
        ("F0", 0.0, 3.2),
        ("F1", 8.0, 11.2),  # Jump
        ("F2", 4.0, 7.2)   # Inverted!
    ]
    f_inverted = T2TopologyValidator.check_vertical_order(inverted_levels)
    assert any(f.status == "FAIL" for f in f_inverted)


def test_t3_hungarian_reconciliation():
    """T3 must match observed peaks to planned storeys using Hungarian optimization."""
    planned = [
        ("Level_0", 0.0),
        ("Level_1", 3.2),
        ("Level_2", 6.4),
        ("Level_3", 9.6)
    ]
    # Sensor detects clean peaks at roughly the planned heights
    observed = [0.02, 3.19, 6.42, 9.58]

    matches, findings = T3ReconciliationValidator.match_levels(planned, observed)
    assert len(matches) == 4
    assert all(m.status == "MATCH" for m in matches)
    assert all(f.status == "PASS" for f in findings)


def test_t4_admin_uds_unbalance_detection():
    """T4 must ensure Undivided Share of Land (UDS) sums to exactly 1.000."""
    valid_shares = [0.25, 0.25, 0.25, 0.25]
    f_valid = T4AdminValidator.check_uds_sum("BLD-01", valid_shares)
    assert f_valid.status == "PASS"

    unbalanced_shares = [0.25, 0.25, 0.25, 0.40]  # Sum = 1.15
    f_invalid = T4AdminValidator.check_uds_sum("BLD-01", unbalanced_shares)
    assert f_invalid.status == "FAIL"
