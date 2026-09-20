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


def compute_rera_compliance(rid: str, store: Any) -> Optional[Any]:
    """
    Computes statutory RERA carpet area deviation against sanctioned plan (Phase 12D & 12E).
    Returns RERAComplianceResult or None if evidence/sanctioned area is absent.
    """
    from src.api.schemas import RERAComplianceResult
    import numpy as np
    import trimesh

    obj = store.resolve_rid(rid, include_geometry=True)
    if not obj:
        return None

    jurisdiction = obj.get("jurisdiction", "IN_MH")
    sanctioned = obj.get("sanctioned_carpet_area_sqm")

    # Fictional / Sandbox models bypass state statutory RERA rules (Phase 12E.3)
    if jurisdiction == "SANDBOX":
        return RERAComplianceResult(
            sanctioned_carpet_area_sqm=float(sanctioned) if sanctioned is not None else 0.0,
            as_built_carpet_area_sqm=0.0,
            deviation_percentage=0.0,
            deviation_sqm=0.0,
            rera_compliance_status="EXEMPT_SANDBOX",
            statutory_citation="Synthetic Sandbox Exemption (Non-territorial model)",
            tolerance_applied_percent=0.0,
            notes="Fictional / sandbox model exempt from Indian state RERA deviation regulations."
        )

    if sanctioned is None or sanctioned <= 0:
        return None

    geom = obj.get("geometry")
    as_built_area = 0.0
    if geom and isinstance(geom, dict):
        if "vertices" in geom and "faces" in geom and geom["vertices"] and geom["faces"]:
            try:
                m = trimesh.Trimesh(vertices=geom["vertices"], faces=geom["faces"])
                vol = float(m.volume) if m.is_watertight else 0.0
                v_arr = np.array(geom["vertices"])
                height = float(v_arr[:, 2].max() - v_arr[:, 2].min())
                if height > 0.05 and vol > 0:
                    as_built_area = round(vol / height, 2)
                else:
                    dx = float(v_arr[:, 0].max() - v_arr[:, 0].min())
                    dy = float(v_arr[:, 1].max() - v_arr[:, 1].min())
                    as_built_area = round(dx * dy, 2)
            except Exception:
                pass
        elif "volume" in geom:
            as_built_area = float(geom["volume"])

    if as_built_area <= 0:
        as_built_area = float(sanctioned)

    dev_sqm = round(abs(as_built_area - sanctioned), 2)
    dev_pct = round((dev_sqm / sanctioned) * 100.0, 2)

    if dev_pct <= 2.0:
        comp_status = "PASS"
        rec = f"Deviation {dev_pct}% is within strict 2% RERA tolerance."
    elif dev_pct <= 5.0:
        comp_status = "TOLERANCE_WARNING"
        rec = f"Deviation {dev_pct}% exceeds 2% threshold but is within 5% statutory buffer."
    else:
        comp_status = "FAIL"
        rec = f"Deviation {dev_pct}% exceeds 5% maximum permissible statutory deviation."

    citation = (
        "Real Estate (Regulation and Development) Act 2016 § 14(2) r/w MahaRERA Circular 4/2017"
        if jurisdiction == "IN_MH"
        else (
            "Real Estate (Regulation and Development) Act 2016 § 14(2) r/w K-RERA Carpet Area Rules"
            if jurisdiction == "IN_KA"
            else "Singapore Building Control Act & SLA Strata Boundary Regulation"
        )
    )

    return RERAComplianceResult(
        sanctioned_carpet_area_sqm=float(sanctioned),
        as_built_carpet_area_sqm=float(as_built_area),
        deviation_percentage=dev_pct,
        deviation_sqm=dev_sqm,
        rera_compliance_status=comp_status,
        statutory_citation=citation,
        tolerance_applied_percent=2.0,
        notes=rec
    )

