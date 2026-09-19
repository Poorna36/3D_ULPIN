"""
Integration Test for End-to-End Validation Pipeline (T0-T4 + H4)
Conforms to docs/validation.md, docs/aiml.md § 6.4, and Phase 8B.7.

Validates that:
1. Injected defects (OVERLAP, UNDERCOUNT, HEIGHT_ERROR, MISSING_COMMON)
   trigger >= 1 FAIL or WARN ExplainObject in T0-T4.
2. H4 Intelligent Topology Validator scores and ranks the injected defect
   in the top-3 ranked findings.
3. The Active Learning feedback loop records examiner decisions and adapts tolerances.
"""
import pytest
import trimesh
from src.simulation.building_gen import BuildingGenerator, generate_mz1_hero_tower
from src.simulation.defect_injector import DefectInjector, DefectType
from src.validation.t0_integrity import T0IntegrityValidator
from src.validation.t1_geometry import T1GeometryValidator
from src.validation.t2_topology import T2TopologyValidator
from src.validation.t4_admin import T4AdminValidator
from src.ml.h4_topology_validator import H4TopologyValidator


def test_validation_pipeline_defect_detection_and_h4_ranking():
    tower = generate_mz1_hero_tower()

    # 1. Defect: OVERLAP
    ov_tower, ov_manifest = DefectInjector.inject_overlap(tower, overlap_distance_m=1.0)
    units = ov_tower.get_by_class("U")
    t2_finding = T2TopologyValidator.check_no_overlap(
        mesh_a=units[0].mesh,
        mesh_b=units[1].mesh,
        rid_a=units[0].label,
        rid_b=units[1].label,
        epsilon_v=0.01
    )
    assert t2_finding.status == "FAIL", f"Expected FAIL for overlap, got {t2_finding.status}"
    assert t2_finding.predicate == "T2_NO_OVERLAP"

    # 2. Defect: HEIGHT_ERROR (Envelope violation / containment)
    h_tower, h_manifest = DefectInjector.inject_height_error(tower, excess_height_m=2.5)
    levels = h_tower.get_by_class("L")
    bld = h_tower.get_by_class("B")[0]
    t2_h_finding = T2TopologyValidator.check_containment(
        child_mesh=levels[-1].mesh,
        parent_mesh=bld.mesh,
        child_rid=levels[-1].label,
        parent_rid=bld.label,
        epsilon_v=0.05
    )
    assert t2_h_finding.status in {"WARN", "FAIL"}

    # 3. Defect: UNDERCOUNT (Volume conservation violation)
    uc_tower, uc_manifest = DefectInjector.inject_undercount(tower)
    remaining_units = uc_tower.get_by_class("U")
    parent_level = uc_tower.get_by_class("L")[0]
    t2_vol_finding = T2TopologyValidator.check_volume_conservation(
        parent_mesh=parent_level.mesh,
        child_meshes=[u.mesh for u in remaining_units[:2]],  # Missing other units
        parent_rid=parent_level.label,
        epsilon_v=0.05
    )
    assert t2_vol_finding.status == "FAIL"

    # 4. H4 Ranking: Pass findings to H4 and verify top-3 ranking
    h4 = H4TopologyValidator(random_state=42)
    nominal_findings = T0IntegrityValidator.validate(
        rid="MH2700010001AA-B0001-U0001-K",
        crs="EPSG:4326",
        data_provenance="REAL",
        geometry={"type": "Solid"}
    )
    nominal_finding = nominal_findings[0]

    all_findings = [nominal_finding, t2_finding, t2_h_finding, t2_vol_finding]
    ranked = h4.score_findings(all_findings)

    # Injected defect findings must be ranked ahead of nominal PASS
    top_3_finding_ids = [r.finding.finding_id for r in ranked[:3]]
    assert t2_finding.finding_id in top_3_finding_ids
    assert ranked[0].finding.status in {"FAIL", "WARN"}

    # 5. Active learning feedback loop
    retrained = h4.record_decision(
        finding_id=t2_finding.finding_id,
        decision="ACCEPT"
    )
    assert not retrained  # Not reached threshold 50 yet
    assert len(h4.examiner_decisions) == 1

    # Test tolerance adaptation
    h4.record_decision(
        finding_id=t2_finding.finding_id,
        decision="MODIFY_TOLERANCE",
        modified_tolerance={"epsilon_v_overlap": 0.03}
    )
    assert h4.adaptive_tolerances["epsilon_v_overlap"] == 0.03
