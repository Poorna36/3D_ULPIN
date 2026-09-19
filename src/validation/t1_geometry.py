"""
Tier-1 (T1) Geometric Validity Validator
Enforces ISO 19107 solid validity: watertight, 2-manifold, consistent outward normals, non-zero volume.
Conforms to docs/validation.md § 7.1 and Phase 8A.2.
"""
from typing import List, Optional
import trimesh
from src.validation.explain import ExplainObject, create_finding


class T1GeometryValidator:
    """Evaluates 3D solid geometry validity."""

    @staticmethod
    def validate(
        rid: str,
        mesh: trimesh.Trimesh,
        data_provenance: str = "SYNTHETIC"
    ) -> List[ExplainObject]:
        findings = []

        if not isinstance(mesh, trimesh.Trimesh) or len(mesh.vertices) == 0:
            findings.append(create_finding(
                tier="T1",
                predicate="T1_VALID_MESH",
                status="FAIL",
                rid_a=rid,
                recommendation="Supply valid trimesh.Trimesh object.",
                data_provenance=data_provenance
            ))
            return findings

        # 1. Watertightness Check
        if not mesh.is_watertight:
            findings.append(create_finding(
                tier="T1",
                predicate="T1_WATERTIGHT",
                status="FAIL",
                rid_a=rid,
                recommendation="Mesh contains open boundary edges or holes. Seal solid geometry.",
                data_provenance=data_provenance
            ))
        else:
            findings.append(create_finding(
                tier="T1",
                predicate="T1_WATERTIGHT",
                status="PASS",
                rid_a=rid,
                data_provenance=data_provenance
            ))

        # 2. Non-Zero Positive Volume Check
        vol = float(mesh.volume) if mesh.is_watertight else 0.0
        if vol <= 1e-6:
            findings.append(create_finding(
                tier="T1",
                predicate="T1_POSITIVE_VOLUME",
                status="FAIL",
                rid_a=rid,
                magnitude=vol,
                recommendation="Solid has degenerate, collapsed, or negative volume.",
                data_provenance=data_provenance
            ))
        else:
            findings.append(create_finding(
                tier="T1",
                predicate="T1_POSITIVE_VOLUME",
                status="PASS",
                rid_a=rid,
                magnitude=vol,
                data_provenance=data_provenance
            ))

        # 3. 2-Manifold Edge Topology
        edges_unique = len(mesh.edges_unique)
        if hasattr(mesh, "is_volume") and not mesh.is_volume:
            findings.append(create_finding(
                tier="T1",
                predicate="T1_MANIFOLD_TOPOLOGY",
                status="WARN",
                rid_a=rid,
                recommendation="Self-touching shells or non-manifold vertices detected.",
                data_provenance=data_provenance
            ))
        else:
            findings.append(create_finding(
                tier="T1",
                predicate="T1_MANIFOLD_TOPOLOGY",
                status="PASS",
                rid_a=rid,
                data_provenance=data_provenance
            ))

        return findings
