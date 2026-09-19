"""
RERA Statutory Compliance & Multi-Version Plan Validator
Conforms to docs/pipeline.md § 4.2, docs/decisions.md, and Phase 5.6-5.7.
"""
from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from src.validation.explain import ExplainObject, create_finding


@dataclass
class RERAResult:
    status: str  # PASS, WARN, FAIL
    unit_count_match: bool
    expected_units: int
    observed_units: int
    expected_carpet_sqm: float
    observed_carpet_sqm: float
    area_deviation_pct: float
    findings: List[ExplainObject]


class RERAValidator:
    """
    Validates architectural plans against Real Estate Regulatory Authority (RERA) disclosures.
    Predicates:
    1. Unit Count: Must match sanctioned unit count exactly (FAIL if mismatch).
    2. Carpet Area:
       - <= 5.0% deviation: PASS
       - 5.0% - 10.0% deviation: WARN (RERA minor adjustment notice)
       - > 10.0% deviation: FAIL (Statutory violation)
    """

    @staticmethod
    def validate_plan(
        expected_units: int,
        observed_units: int,
        expected_carpet_sqm: float,
        observed_carpet_sqm: float,
        building_rid: str = "BLD-01"
    ) -> RERAResult:
        findings: List[ExplainObject] = []
        overall_status = "PASS"

        # 1. Unit Count Validation
        unit_match = (expected_units == observed_units)
        if not unit_match:
            overall_status = "FAIL"
            findings.append(create_finding(
                tier="T4",
                predicate="RERA_UNIT_COUNT_MATCH",
                status="FAIL",
                rid_a=building_rid,
                magnitude=abs(observed_units - expected_units),
                recommendation=f"Unit count mismatch: Expected {expected_units}, observed {observed_units}. Sanctioned plan must be amended."
            ))
        else:
            findings.append(create_finding(
                tier="T4",
                predicate="RERA_UNIT_COUNT_MATCH",
                status="PASS",
                rid_a=building_rid,
                magnitude=0.0,
                recommendation="Unit count exactly matches RERA registration."
            ))

        # 2. Carpet Area Validation
        if expected_carpet_sqm <= 0:
            dev_pct = 0.0
        else:
            dev_pct = round(abs(observed_carpet_sqm - expected_carpet_sqm) / expected_carpet_sqm * 100.0, 2)

        if dev_pct <= 5.0:
            status = "PASS"
            rec = f"Carpet area deviation {dev_pct}% within strict statutory tolerance (<= 5%)."
        elif dev_pct <= 10.0:
            status = "WARN"
            if overall_status != "FAIL":
                overall_status = "WARN"
            rec = f"Carpet area deviation {dev_pct}% exceeds 5% baseline but within 10% review threshold."
        else:
            status = "FAIL"
            overall_status = "FAIL"
            rec = f"Carpet area deviation {dev_pct}% exceeds 10% statutory limit. RERA compliance violation."

        findings.append(create_finding(
            tier="T4",
            predicate="RERA_CARPET_AREA_TOLERANCE",
            status=status,
            rid_a=building_rid,
            magnitude=dev_pct,
            tolerance_sigma=5.0,
            recommendation=rec
        ))

        return RERAResult(
            status=overall_status,
            unit_count_match=unit_match,
            expected_units=expected_units,
            observed_units=observed_units,
            expected_carpet_sqm=expected_carpet_sqm,
            observed_carpet_sqm=observed_carpet_sqm,
            area_deviation_pct=dev_pct,
            findings=findings
        )
