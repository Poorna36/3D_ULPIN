"""
Tier-4 (T4) Administrative Consistency Validator
Verifies legal & statutory consistency under Indian apartment ownership laws:
- Undivided Share of Land (UDS) fractions sum = 1.000 ± 0.001
- All registered rights reference valid RIDs (no orphan rights)
Conforms to docs/validation.md § 7.1 and Phase 8A.9.
"""
from typing import List, Dict, Any, Optional
from src.validation.explain import ExplainObject, create_finding


class T4AdminValidator:
    """Evaluates legal and administrative property share consistency."""

    @staticmethod
    def check_uds_sum(
        building_rid: str,
        uds_fractions: List[float],
        tolerance: float = 0.001,
        data_provenance: str = "SYNTHETIC"
    ) -> ExplainObject:
        """
        Under Maharashtra Apartment Ownership Act 1970 and Karnataka Apartment Ownership Act 1972,
        the undivided share of common areas/land must sum exactly to 100% (1.000).
        """
        total_uds = sum(uds_fractions)
        diff = abs(total_uds - 1.0)

        if diff <= tolerance:
            status = "PASS"
            rec = "Undivided Share of Land (UDS) fractions sum exactly to 100%."
        elif diff <= 0.02:
            status = "WARN"
            rec = f"UDS fraction sum is {total_uds:.4f} (rounding discrepancy of {diff:.4f})."
        else:
            status = "FAIL"
            rec = f"Illegal UDS allocation: total fractions sum to {total_uds:.4f} (expected 1.0000)."

        return create_finding(
            tier="T4",
            predicate="T4_UDS_SUM",
            status=status,
            rid_a=building_rid,
            magnitude=diff,
            tolerance_sigma=tolerance,
            recommendation=rec,
            data_provenance=data_provenance
        )

    @staticmethod
    def check_orphan_rights(
        rights: List[Dict[str, Any]],
        registered_rids: set,
        data_provenance: str = "SYNTHETIC"
    ) -> List[ExplainObject]:
        """Ensures every property right attaches to an existing, valid 3D ULPIN."""
        findings = []
        for r in rights:
            right_id = r.get("right_id", "UNKNOWN")
            target_rid = r.get("rid", "")

            if target_rid not in registered_rids:
                findings.append(create_finding(
                    tier="T4",
                    predicate="T4_NO_ORPHAN_RIGHT",
                    status="FAIL",
                    rid_a=target_rid,
                    recommendation=f"Right {right_id} references non-existent or superseded RID '{target_rid}'.",
                    data_provenance=data_provenance
                ))
            else:
                findings.append(create_finding(
                    tier="T4",
                    predicate="T4_NO_ORPHAN_RIGHT",
                    status="PASS",
                    rid_a=target_rid,
                    data_provenance=data_provenance
                ))

        return findings
