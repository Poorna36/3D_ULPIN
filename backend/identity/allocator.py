"""
3D ULPIN Allocator Service
Orchestrates: Canonicalization -> NK -> SA -> ICT Evaluation -> RID Format -> Registry Store
Conforms to docs/features.md § 3.2, docs/contracts.md § 8.4.1, and Phase 2F.
"""
from dataclasses import dataclass
from typing import Optional, List, Dict, Any, Tuple
import json
import math
import trimesh

from backend.core.grammar import (
    format_rid,
    compute_nk,
    compute_sa_cover,
    CROCKFORD_BASE32,
    NaturalKey,
    get_statutory_anchor
)
from backend.core.registry import RegistryStore, ObjectRecord, BindingVersion
from backend.core.ict import ict_evaluate, ICTDecision, ICTResult


@dataclass
class AllocationResult:
    rid: str
    nk_digest: str
    nk_locator: str
    sa_cover: List[str]
    ict_result: str
    binding_record_hash: str
    version: int
    interior_point: tuple


class ULPIN3DAllocator:
    def __init__(self, store: RegistryStore):
        self.store = store
        self._seq_counter = 1

    def _next_b32_seq(self, ulpin14: str = "", bld_seq: str = "", cls: str = "") -> str:
        """Generates sequential 5-character Crockford Base-32 sequence with persistent sync."""
        if ulpin14 and bld_seq and cls and hasattr(self.store, "get_max_sequence"):
            existing_count = self.store.get_max_sequence(ulpin14, bld_seq, cls)
            self._seq_counter = max(self._seq_counter, existing_count + 1)

        n = self._seq_counter
        self._seq_counter += 1
        chars = []
        for _ in range(5):
            chars.append(CROCKFORD_BASE32[n % 32])
            n //= 32
        return "".join(reversed(chars))

    def allocate(
        self,
        ulpin14: str,
        cls: str,
        mesh: trimesh.Trimesh,
        evidence_class: str = "E3",
        plan_version: str = "V1.0",
        issuer_node_id: str = "MH",
        data_provenance: str = "SYNTHETIC",
        bld_seq: str = "B0000",
        parent_rid: Optional[str] = None,
        legal_basis_status: Optional[str] = None,
        spans: Optional[List[str]] = None,
        existing_rid: Optional[str] = None,
        old_mesh: Optional[trimesh.Trimesh] = None,
        jurisdiction: str = "IN_MH",
        legacy_system: Optional[str] = None,
        legacy_value: Optional[str] = None,
        sanctioned_carpet_area_sqm: Optional[float] = None,
        geo_anchor: Optional[Tuple[float, float, float]] = None,
    ) -> AllocationResult:
        """
        Executes atomic 3D ULPIN allocation with Layer 1 RID, Layer 2 NK,
        Layer 3 SA, and cryptographic binding version.

        geo_anchor: Optional (lon, lat, elev_msl) WGS84 anchor for the building.
        When provided, an 'origin' field is embedded in geometry_json so the
        spatial index stores real-world WGS84 bounding boxes, enabling
        GET /cover?bbox=<WGS84> to return the correct volumes for Mumbai/Bengaluru.
        Mesh vertices remain in local metric coordinates for accurate volume computation.
        """
        if legal_basis_status is None:
            legal_basis_status = get_statutory_anchor(cls, jurisdiction).statutory_basis

        # 1. Compute Layer 2 Natural Key (NK) and Layer 3 Spatial Address (SA)
        nk: NaturalKey = compute_nk(mesh, cls=cls)
        sa_cover: List[str] = compute_sa_cover(mesh)

        # 2. Run Identity Continuity Test (ICT) if replacing/updating existing geometry
        ict_res: ICTResult = ict_evaluate(
            old_mesh=old_mesh,
            new_mesh=mesh,
            old_cls=cls,
            new_cls=cls,
            old_parent_rid=parent_rid,
            new_parent_rid=parent_rid
        )

        # Serialized geometry for binding version.
        # 'origin' stores the real-world WGS84 anchor so the registry spatial
        # index can compute correct lon/lat bounding boxes from local metric vertices.
        geometry_dict: Dict[str, Any] = {
            "vertices": mesh.vertices.tolist(),
            "faces": mesh.faces.tolist(),
            "volume": float(mesh.volume) if mesh.is_watertight else 0.0,
            "crs": "EPSG:4326"
        }
        if geo_anchor is not None:
            geometry_dict["origin"] = list(geo_anchor)  # [lon, lat, elev_msl_m]
        geom_json = json.dumps(geometry_dict)

        # 3. Handle RID generation or reuse based on ICT decision
        if ict_res.decision == ICTDecision.CONTINUE and existing_rid:
            # Same physical identity -> update binding version on existing RID
            target_rid = existing_rid
            status = "REVISED"
        else:
            # New physical entity or Split/Merge -> allocate new RID
            seq = self._next_b32_seq(ulpin14=ulpin14, bld_seq=bld_seq, cls=cls)
            target_rid = format_rid(ulpin14=ulpin14, bld_seq=bld_seq, cls=cls, seq=seq)
            status = "ALLOCATED"

            self.store.insert_object(
                rid=target_rid,
                cls=cls,
                ulpin14=ulpin14,
                bld_seq=bld_seq,
                seq=seq,
                issuer_node_id=issuer_node_id,
                data_provenance=data_provenance,
                parent_rid=parent_rid,
                status=status,
                legal_basis_status=legal_basis_status,
                spans=spans,
                jurisdiction=jurisdiction,
            )

            # Record lineage edge if this object evolved from an existing object
            if existing_rid and hasattr(self.store, "insert_lineage_edge"):
                edge_type = "SPLIT_FROM" if ict_res.decision == ICTDecision.SPLIT else (
                    "MERGED_INTO" if ict_res.decision == ICTDecision.MERGE else "SUPERSEDES"
                )
                self.store.insert_lineage_edge(
                    source_rid=existing_rid,
                    target_rid=target_rid,
                    edge_type=edge_type
                )

        # Stamp legacy identifier if provided (Phase 12B)
        if legacy_system and legacy_value and hasattr(self.store, "insert_legacy_id"):
            self.store.insert_legacy_id(
                id_system=legacy_system,
                legacy_value=legacy_value,
                rid=target_rid
            )

        # 4. Append immutable, hash-chained Binding Version
        b_ver: BindingVersion = self.store.append_binding_version(
            rid=target_rid,
            nk_digest=nk.digest,
            nk_locator=nk.locator,
            sa_cover=sa_cover,
            geometry_json=geom_json,
            plan_version=plan_version,
            evidence_class=evidence_class,
            sanctioned_carpet_area_sqm=sanctioned_carpet_area_sqm,
        )

        # 5. Log audit trail entry
        self.store.append_audit_log(
            rid=target_rid,
            action="ALLOCATE" if status == "ALLOCATED" else "REVISE_ICT_CONTINUE",
            actor=f"NODE_{issuer_node_id}",
            payload={
                "ict_decision": ict_res.decision.value,
                "ict_score": ict_res.score,
                "nk_digest": nk.digest,
                "version_num": b_ver.version_num
            }
        )

        return AllocationResult(
            rid=target_rid,
            nk_digest=nk.digest,
            nk_locator=nk.locator,
            sa_cover=sa_cover,
            ict_result=ict_res.decision.value,
            binding_record_hash=b_ver.this_hash,
            version=b_ver.version_num,
            interior_point=nk.interior_point
        )
