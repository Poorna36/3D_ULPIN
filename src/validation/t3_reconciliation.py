"""
Tier-3 (T3) Plan-vs-As-Built Hungarian Reconciliation
Aligns observed elevation peaks to planned levels using bipartite graph matching.
Conforms to docs/validation.md § 7.1, docs/pipeline.md § 4.4, and Phase 8A.7.
"""
from dataclasses import dataclass
from typing import List, Dict, Any, Tuple, Optional
import numpy as np
from scipy.optimize import linear_sum_assignment

from src.validation.explain import ExplainObject, create_finding


@dataclass
class LevelMatchResult:
    plan_level_id: str
    z_expected: float
    z_observed: Optional[float]
    delta_z: Optional[float]
    status: str  # MATCH, SHIFTED, MISSING, EXTRA


class T3ReconciliationValidator:
    """Matches expected plan floor levels against observed sensor elevations."""

    @staticmethod
    def match_levels(
        planned_levels: List[Tuple[str, float]],   # [(level_id, z_expected), ...]
        observed_peaks: List[float],               # [z_peak_1, z_peak_2, ...]
        tau_match_m: float = 0.15,
        tau_shifted_m: float = 0.50,
        building_rid: str = "BLD-0001",
        data_provenance: str = "SYNTHETIC"
    ) -> Tuple[List[LevelMatchResult], List[ExplainObject]]:
        findings: List[ExplainObject] = []
        results: List[LevelMatchResult] = []

        if not planned_levels:
            return results, findings

        if not observed_peaks:
            # All planned levels missing evidence
            for lvl_id, z_exp in planned_levels:
                results.append(LevelMatchResult(lvl_id, z_exp, None, None, "UNVERIFIABLE"))
                findings.append(create_finding(
                    tier="T3",
                    predicate="T3_LEVEL_OBSERVED",
                    status="UNVERIFIABLE",
                    rid_a=f"{building_rid}_{lvl_id}",
                    recommendation="No LiDAR/sensor height peaks detected for floor.",
                    data_provenance=data_provenance
                ))
            return results, findings

        # Formulate cost matrix: C[i, j] = |z_planned[i] - z_observed[j]|
        n_plan = len(planned_levels)
        n_obs = len(observed_peaks)
        cost_matrix = np.zeros((n_plan, n_obs), dtype=np.float64)

        for i, (_, z_exp) in enumerate(planned_levels):
            for j, z_obs in enumerate(observed_peaks):
                cost_matrix[i, j] = abs(z_exp - z_obs)

        # Hungarian algorithm optimal assignment
        row_ind, col_ind = linear_sum_assignment(cost_matrix)
        assigned_obs = set()

        for r, c in zip(row_ind, col_ind):
            lvl_id, z_exp = planned_levels[r]
            z_obs = observed_peaks[c]
            diff = abs(z_exp - z_obs)
            assigned_obs.add(c)

            if diff <= tau_match_m:
                status = "MATCH"
                f_status = "PASS"
                rec = "Observed level closely matches sanctioned plan."
            elif diff <= tau_shifted_m:
                status = "SHIFTED"
                f_status = "WARN"
                rec = f"Storey vertical shift of {diff:.2f} m detected."
            else:
                status = "MISSING"
                f_status = "FAIL"
                rec = f"Planned floor height {z_exp:.2f}m not found in observed data (nearest peak at {z_obs:.2f}m)."

            results.append(LevelMatchResult(lvl_id, z_exp, z_obs, round(diff, 3), status))
            findings.append(create_finding(
                tier="T3",
                predicate="T3_LEVEL_MATCH",
                status=f_status,
                rid_a=f"{building_rid}_{lvl_id}",
                magnitude=diff,
                tolerance_sigma=tau_match_m,
                recommendation=rec,
                data_provenance=data_provenance
            ))

        # Check for unassigned extra peaks
        for j, z_obs in enumerate(observed_peaks):
            if j not in assigned_obs:
                results.append(LevelMatchResult("EXTRA_OBSERVED", 0.0, z_obs, 0.0, "EXTRA"))
                findings.append(create_finding(
                    tier="T3",
                    predicate="T3_EXTRA_LEVEL",
                    status="WARN",
                    rid_a=building_rid,
                    magnitude=z_obs,
                    recommendation=f"Unsanctioned vertical height peak detected at Z={z_obs:.2f} m.",
                    data_provenance=data_provenance
                ))

        return results, findings
