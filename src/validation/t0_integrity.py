"""
Tier-0 (T0) Data Integrity Validator
Verifies schema completeness, non-null CRS, explicit provenance tags, and non-empty geometry.
Conforms to docs/validation.md § 7.1 and Phase 8A.1.
"""
from typing import Dict, Any, List, Optional
from src.validation.explain import ExplainObject, create_finding

VALID_PROVENANCE_TAGS = {"REAL", "PROXY", "SYNTHETIC", "REAL-FOREIGN", "REAL-OWN"}


class T0IntegrityValidator:
    """Evaluates foundational data integrity and provenance completeness."""

    @staticmethod
    def validate(
        rid: str,
        data_provenance: Optional[str],
        crs: Optional[str],
        geometry: Optional[Any]
    ) -> List[ExplainObject]:
        findings = []

        # 1. Provenance Tag Completeness
        if not data_provenance or data_provenance.upper() not in VALID_PROVENANCE_TAGS:
            findings.append(create_finding(
                tier="T0",
                predicate="T0_PROVENANCE_PRESENT",
                status="FAIL",
                rid_a=rid,
                recommendation=f"Attach valid provenance tag ({sorted(VALID_PROVENANCE_TAGS)}) before publishing.",
                data_provenance=data_provenance or "UNKNOWN"
            ))
        else:
            findings.append(create_finding(
                tier="T0",
                predicate="T0_PROVENANCE_PRESENT",
                status="PASS",
                rid_a=rid,
                data_provenance=data_provenance
            ))

        # 2. CRS Non-Null
        if not crs or not crs.strip():
            findings.append(create_finding(
                tier="T0",
                predicate="T0_CRS_VALID",
                status="FAIL",
                rid_a=rid,
                recommendation="Assign valid Coordinate Reference System (e.g. EPSG:4326 or EPSG:32643).",
                data_provenance=data_provenance or "UNKNOWN"
            ))
        else:
            findings.append(create_finding(
                tier="T0",
                predicate="T0_CRS_VALID",
                status="PASS",
                rid_a=rid,
                data_provenance=data_provenance or "UNKNOWN"
            ))

        # 3. Geometry Presence
        if geometry is None:
            findings.append(create_finding(
                tier="T0",
                predicate="T0_GEOMETRY_NON_NULL",
                status="FAIL",
                rid_a=rid,
                recommendation="Provide non-empty 3D boundary geometry for object.",
                data_provenance=data_provenance or "UNKNOWN"
            ))
        else:
            findings.append(create_finding(
                tier="T0",
                predicate="T0_GEOMETRY_NON_NULL",
                status="PASS",
                rid_a=rid,
                data_provenance=data_provenance or "UNKNOWN"
            ))

        return findings
