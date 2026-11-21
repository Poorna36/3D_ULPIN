"""
Explain Object Diagnostic Builder
Produces structured, machine-readable validation findings for examiner review.
Conforms to docs/validation.md § 7.1 and Phase 8A.10.
"""
from dataclasses import dataclass, asdict
from typing import Optional, Dict, Any
from datetime import datetime, timezone
import uuid


@dataclass
class ExplainObject:
    finding_id: str
    tier: str  # T0, T1, T2, T3, T4
    predicate: str  # e.g. T2_NO_OVERLAP, T1_WATERTIGHT, T4_UDS_SUM
    status: str  # PASS, WARN, FAIL, UNVERIFIABLE
    rid_a: str
    rid_b: Optional[str] = None
    magnitude: float = 0.0
    tolerance_sigma: float = 0.0
    recommendation: str = ""
    data_provenance: str = "SYNTHETIC"
    evidence_class: str = "E1"
    plan_version: str = "1.0"
    created_at: str = ""

    def __post_init__(self):
        if not self.finding_id:
            self.finding_id = f"FINDING-{uuid.uuid4().hex[:12].upper()}"
        if not self.created_at:
            self.created_at = datetime.now(timezone.utc).isoformat()

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def create_finding(
    tier: str,
    predicate: str,
    status: str,
    rid_a: str,
    rid_b: Optional[str] = None,
    magnitude: float = 0.0,
    tolerance_sigma: float = 0.0,
    recommendation: str = "",
    data_provenance: str = "SYNTHETIC",
    evidence_class: str = "E1",
    plan_version: str = "1.0"
) -> ExplainObject:
    return ExplainObject(
        finding_id="",
        tier=tier,
        predicate=predicate,
        status=status,
        rid_a=rid_a,
        rid_b=rid_b,
        magnitude=round(float(magnitude), 4),
        tolerance_sigma=round(float(tolerance_sigma), 4),
        recommendation=recommendation,
        data_provenance=data_provenance,
        evidence_class=evidence_class,
        plan_version=plan_version
    )
