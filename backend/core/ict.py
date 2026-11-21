"""
Identity Continuity Test (ICT) State Machine & Evaluator
Conforms to docs/features.md § 3.8 and docs/implementation_plan.md Phase 2E.
"""
from enum import Enum
from dataclasses import dataclass
from typing import Optional, Dict, Any, List
import numpy as np
import trimesh


class ICTDecision(str, Enum):
    CONTINUE = "CONTINUE"      # Same RID, new version & NK (re-survey / small remodel)
    AMBIGUOUS = "AMBIGUOUS"    # Moderate geometric shift (requires examiner sign-off)
    SPLIT = "SPLIT"            # Single unit divided into multiple new units
    MERGE = "MERGE"            # Multiple units consolidated into single unit
    NEW = "NEW"                # Disjoint new object (allocate fresh RID)


@dataclass
class ICTResult:
    decision: ICTDecision
    score: float
    iou_3d: float
    centroid_shift: float
    class_match: bool
    parent_match: bool
    details: Dict[str, Any]


def compute_mesh_intersection_volume(mesh_a: trimesh.Trimesh, mesh_b: trimesh.Trimesh) -> float:
    """
    Computes volumetric intersection vol(A ∩ B) between two 3D polyhedra.
    Uses trimesh boolean intersection with fallback to voxelization overlap.
    """
    # Fast disjoint AABB bounding box check
    bounds_a = mesh_a.bounds
    bounds_b = mesh_b.bounds
    if (bounds_a[1][0] < bounds_b[0][0] or bounds_b[1][0] < bounds_a[0][0] or
        bounds_a[1][1] < bounds_b[0][1] or bounds_b[1][1] < bounds_a[0][1] or
        bounds_a[1][2] < bounds_b[0][2] or bounds_b[1][2] < bounds_a[0][2]):
        return 0.0

    try:
        # Exact constructive solid geometry intersection
        inter = trimesh.boolean.intersection([mesh_a, mesh_b], engine="manifold")
        if inter.is_watertight and inter.volume > 0:
            return float(inter.volume)
    except Exception:
        pass

    # Robust voxel approximation fallback
    try:
        pitch = max(0.1, min(mesh_a.extents.min(), mesh_b.extents.min()) / 15.0)
        vox_a = mesh_a.voxelized(pitch=pitch).fill()
        vox_b = mesh_b.voxelized(pitch=pitch).fill()
        # Find intersecting voxel count in overlapping bounds
        shared_voxels = np.logical_and(
            vox_a.is_filled(vox_b.points),
            vox_b.is_filled(vox_b.points)
        )
        return float(np.sum(shared_voxels) * (pitch ** 3))
    except Exception:
        # Bounding box overlap fallback
        overlap_min = np.maximum(bounds_a[0], bounds_b[0])
        overlap_max = np.minimum(bounds_a[1], bounds_b[1])
        diff = np.maximum(0.0, overlap_max - overlap_min)
        return float(np.prod(diff))


def compute_iou_3d(mesh_a: trimesh.Trimesh, mesh_b: trimesh.Trimesh) -> float:
    """
    Computes 3D Intersection-over-Union:
    IoU_3D(A, B) = vol(A ∩ B) / (vol(A) + vol(B) - vol(A ∩ B))
    """
    vol_a = abs(float(mesh_a.volume))
    vol_b = abs(float(mesh_b.volume))
    if vol_a <= 1e-9 or vol_b <= 1e-9:
        return 0.0

    inter_vol = compute_mesh_intersection_volume(mesh_a, mesh_b)
    union_vol = vol_a + vol_b - inter_vol

    if union_vol <= 1e-9:
        return 0.0
    return float(np.clip(inter_vol / union_vol, 0.0, 1.0))


def ict_evaluate(
    old_mesh: Optional[trimesh.Trimesh],
    new_mesh: trimesh.Trimesh,
    old_cls: Optional[str] = None,
    new_cls: str = "U",
    old_parent_rid: Optional[str] = None,
    new_parent_rid: Optional[str] = None,
    plan_link_match: bool = True,
    overlapping_old_meshes: Optional[List[trimesh.Trimesh]] = None,
    tau_hi: float = 0.90,
    tau_lo: float = 0.60,
    sigma_c_norm: float = 2.0  # 2.0 meters normalized tolerance
) -> ICTResult:
    """
    Evaluates the Identity Continuity Test (ICT) when new geometry arrives.
    Determines whether the physical property retains its identity (CONTINUE),
    is ambiguous (AMBIGUOUS), is a partition (SPLIT), a fusion (MERGE), or NEW.
    """
    # 1. If there is no previous object at all, it's a NEW registration
    if old_mesh is None:
        return ICTResult(
            decision=ICTDecision.NEW,
            score=0.0,
            iou_3d=0.0,
            centroid_shift=0.0,
            class_match=True,
            parent_match=True,
            details={"reason": "No previous object registered at this space."}
        )

    # 2. Check for multi-object fusion (MERGE) or partition (SPLIT)
    if overlapping_old_meshes and len(overlapping_old_meshes) > 1:
        return ICTResult(
            decision=ICTDecision.MERGE,
            score=0.0,
            iou_3d=0.0,
            centroid_shift=0.0,
            class_match=False,
            parent_match=True,
            details={"overlapping_count": len(overlapping_old_meshes)}
        )

    # 3. Compute 3D IoU and Centroid Shift
    iou = compute_iou_3d(old_mesh, new_mesh)

    cent_old = old_mesh.center_mass if old_mesh.is_watertight else old_mesh.bounds.mean(axis=0)
    cent_new = new_mesh.center_mass if new_mesh.is_watertight else new_mesh.bounds.mean(axis=0)
    shift = float(np.linalg.norm(cent_old - cent_new))

    class_match = (old_cls == new_cls) if old_cls else True
    parent_match = (old_parent_rid == new_parent_rid) if (old_parent_rid and new_parent_rid) else True

    # 4. Multi-factor score (features.md § 3.8)
    # w1=0.40, w2=0.20, w3=0.15, w4=0.15, w5=0.10
    shift_term = max(0.0, 1.0 - (shift / sigma_c_norm))
    score = (
        0.40 * iou +
        0.20 * shift_term +
        0.15 * (1.0 if class_match else 0.0) +
        0.15 * (1.0 if parent_match else 0.0) +
        0.10 * (1.0 if plan_link_match else 0.0)
    )

    # 5. Routing decisions
    if iou < 0.05:
        decision = ICTDecision.NEW
    elif iou >= tau_hi and class_match and parent_match:
        decision = ICTDecision.CONTINUE
    elif iou >= tau_lo:
        decision = ICTDecision.AMBIGUOUS
    else:
        # Partial overlap below tau_lo
        decision = ICTDecision.SPLIT

    return ICTResult(
        decision=decision,
        score=round(score, 4),
        iou_3d=round(iou, 4),
        centroid_shift=round(shift, 4),
        class_match=class_match,
        parent_match=parent_match,
        details={
            "tau_hi": tau_hi,
            "tau_lo": tau_lo,
            "shift_meters": round(shift, 3)
        }
    )
