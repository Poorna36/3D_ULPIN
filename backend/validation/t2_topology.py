"""
Tier-2 (T2) Cadastral Topology Validator
Mathematical predicates: No-Overlap, Volume Conservation, Containment, Vertical Order.
Conforms to docs/validation.md § 7.2 and Phase 8A.3-8A.6.
"""
from typing import List, Tuple, Dict, Any, Optional
import numpy as np
import trimesh

from backend.core.ict import compute_mesh_intersection_volume
from backend.validation.explain import ExplainObject, create_finding


class T2TopologyValidator:
    """Evaluates 3D multi-object cadastral topology rules."""

    @staticmethod
    def check_no_overlap(
        mesh_a: trimesh.Trimesh,
        mesh_b: trimesh.Trimesh,
        rid_a: str,
        rid_b: str,
        epsilon_v: float = 0.05,
        data_provenance: str = "SYNTHETIC"
    ) -> ExplainObject:
        """
        No-Overlap Predicate:
        PASS: vol(A ∩ B) == 0
        WARN: 0 < vol(A ∩ B) <= epsilon_v
        FAIL: vol(A ∩ B) > epsilon_v
        """
        inter_vol = compute_mesh_intersection_volume(mesh_a, mesh_b)

        if inter_vol <= 1e-6:
            status = "PASS"
            recommendation = "No physical overlap."
        elif inter_vol <= epsilon_v:
            status = "WARN"
            recommendation = f"Minor boundary tolerance intersection ({inter_vol:.3f} m³ <= {epsilon_v} m³)."
        else:
            status = "FAIL"
            recommendation = f"Illegal cadastral overlap ({inter_vol:.3f} m³). Modify boundaries to resolve collision."

        return create_finding(
            tier="T2",
            predicate="T2_NO_OVERLAP",
            status=status,
            rid_a=rid_a,
            rid_b=rid_b,
            magnitude=inter_vol,
            tolerance_sigma=epsilon_v,
            recommendation=recommendation,
            data_provenance=data_provenance
        )

    @staticmethod
    def check_volume_conservation(
        parent_mesh: trimesh.Trimesh,
        child_meshes: List[trimesh.Trimesh],
        parent_rid: str,
        epsilon_v: float = 0.50,
        data_provenance: str = "SYNTHETIC"
    ) -> ExplainObject:
        """
        Volume Conservation Predicate:
        | sum(vol(children)) - vol(parent) | <= epsilon_v
        """
        vol_parent = abs(float(parent_mesh.volume))
        sum_children = sum(abs(float(c.volume)) for c in child_meshes)
        delta_v = abs(sum_children - vol_parent)

        if delta_v <= epsilon_v:
            status = "PASS"
            rec = "Volume conserved within uncertainty tolerance."
        elif delta_v <= (3.0 * epsilon_v):
            status = "WARN"
            rec = f"Volume discrepancy of {delta_v:.2f} m³ near allowable margin."
        else:
            status = "FAIL"
            rec = f"Significant volume mismatch: children sum {sum_children:.2f} m³ vs parent {vol_parent:.2f} m³."

        return create_finding(
            tier="T2",
            predicate="T2_VOLUME_CONSERVATION",
            status=status,
            rid_a=parent_rid,
            magnitude=delta_v,
            tolerance_sigma=epsilon_v,
            recommendation=rec,
            data_provenance=data_provenance
        )

    @staticmethod
    def check_containment(
        child_mesh: trimesh.Trimesh,
        parent_mesh: trimesh.Trimesh,
        child_rid: str,
        parent_rid: str,
        epsilon_v: float = 0.05,
        data_provenance: str = "SYNTHETIC"
    ) -> ExplainObject:
        r"""
        Containment Predicate:
        Child volume C must be geometrically contained inside parent P:
        vol(C \ P) <= epsilon_v
        """
        vol_child = abs(float(child_mesh.volume))
        inter_vol = compute_mesh_intersection_volume(child_mesh, parent_mesh)
        protrusion_vol = max(0.0, vol_child - inter_vol)

        if protrusion_vol <= epsilon_v:
            status = "PASS"
            rec = "Child volume strictly contained inside parent."
        elif protrusion_vol <= (3.0 * epsilon_v):
            status = "WARN"
            rec = f"Slight boundary encroachment ({protrusion_vol:.3f} m³)."
        else:
            status = "FAIL"
            rec = f"Child volume protrudes by {protrusion_vol:.3f} m³ outside parent envelope."

        return create_finding(
            tier="T2",
            predicate="T2_CONTAINMENT",
            status=status,
            rid_a=child_rid,
            rid_b=parent_rid,
            magnitude=protrusion_vol,
            tolerance_sigma=epsilon_v,
            recommendation=rec,
            data_provenance=data_provenance
        )

    @staticmethod
    def check_vertical_order(
        levels: List[Tuple[str, float, float]],
        epsilon_z: float = 0.05,
        data_provenance: str = "SYNTHETIC"
    ) -> List[ExplainObject]:
        """
        Vertical Order Predicate:
        For consecutive storeys: z_floor[i] < z_floor[i+1] and z_ceil[i] <= z_floor[i+1] + epsilon_z
        """
        findings = []
        for i in range(len(levels) - 1):
            rid_i, z_floor_i, z_ceil_i = levels[i]
            rid_next, z_floor_next, z_ceil_next = levels[i + 1]

            if z_floor_i >= z_floor_next:
                findings.append(create_finding(
                    tier="T2",
                    predicate="T2_VERTICAL_ORDER",
                    status="FAIL",
                    rid_a=rid_i,
                    rid_b=rid_next,
                    magnitude=z_floor_i - z_floor_next,
                    recommendation="Inverted storey elevations detected.",
                    data_provenance=data_provenance
                ))
            elif z_ceil_i > (z_floor_next + epsilon_z):
                findings.append(create_finding(
                    tier="T2",
                    predicate="T2_VERTICAL_ORDER",
                    status="FAIL",
                    rid_a=rid_i,
                    rid_b=rid_next,
                    magnitude=z_ceil_i - z_floor_next,
                    tolerance_sigma=epsilon_z,
                    recommendation=f"Slab collision between floor {rid_i} and floor {rid_next}.",
                    data_provenance=data_provenance
                ))
            else:
                findings.append(create_finding(
                    tier="T2",
                    predicate="T2_VERTICAL_ORDER",
                    status="PASS",
                    rid_a=rid_i,
                    rid_b=rid_next,
                    data_provenance=data_provenance
                ))

        return findings
