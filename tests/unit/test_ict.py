"""
Unit Tests for Identity Continuity Test (ICT) and Allocator
Conforms to docs/features.md § 3.8 and docs/implementation_plan.md Phase 2E & 2F.
"""
import pytest
import tempfile
import os
import trimesh
from backend.core.ict import ict_evaluate, ICTDecision
from backend.core.registry import RegistryStore
from backend.identity.allocator import ULPIN3DAllocator


def test_ict_evaluation_continue():
    """Identical or slightly shifted mesh should result in CONTINUE."""
    box_old = trimesh.creation.box(extents=[10.0, 10.0, 3.0])
    # Very slight 5 cm shift
    box_new = trimesh.creation.box(extents=[10.05, 10.05, 3.0])
    box_new.apply_translation([0.02, 0.02, 0.0])

    res = ict_evaluate(
        old_mesh=box_old,
        new_mesh=box_new,
        old_cls="U",
        new_cls="U"
    )
    assert res.decision == ICTDecision.CONTINUE
    assert res.iou_3d >= 0.90


def test_ict_evaluation_ambiguous():
    """Moderate geometric variance should trigger AMBIGUOUS examiner review."""
    box_old = trimesh.creation.box(extents=[10.0, 10.0, 3.0])
    # Shifted by 2.5 meters
    box_new = trimesh.creation.box(extents=[10.0, 10.0, 3.0])
    box_new.apply_translation([2.5, 0.0, 0.0])

    res = ict_evaluate(
        old_mesh=box_old,
        new_mesh=box_new,
        old_cls="U",
        new_cls="U"
    )
    assert res.decision == ICTDecision.AMBIGUOUS
    assert 0.50 <= res.iou_3d < 0.90


def test_ict_evaluation_new():
    """Disjoint geometry should evaluate to NEW."""
    box_old = trimesh.creation.box(extents=[10.0, 10.0, 3.0])
    box_new = trimesh.creation.box(extents=[10.0, 10.0, 3.0])
    box_new.apply_translation([100.0, 100.0, 0.0])

    res = ict_evaluate(
        old_mesh=box_old,
        new_mesh=box_new,
        old_cls="U",
        new_cls="U"
    )
    assert res.decision == ICTDecision.NEW
    assert res.iou_3d < 0.05


def test_allocator_full_pipeline():
    """Tests the full end-to-end allocation pipeline."""
    tmp_base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".tmp"))
    os.makedirs(tmp_base, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=tmp_base) as tmpdir:
        db_path = os.path.join(tmpdir, "alloc_test.db")
        store = RegistryStore(db_path=db_path)
        allocator = ULPIN3DAllocator(store=store)

        box = trimesh.creation.box(extents=[15.0, 20.0, 3.2])
        alloc_res = allocator.allocate(
            ulpin14="SYNTHETIC0001A",
            cls="U",
            mesh=box,
            evidence_class="E3",
            issuer_node_id="MH"
        )

        assert alloc_res.rid.startswith("SYNTHETIC0001A-B0000-U")
        assert alloc_res.ict_result == "NEW"
        assert alloc_res.version == 1
        assert len(alloc_res.nk_digest) == 16
        assert alloc_res.nk_locator.startswith("M3D")

        # Resolve RID from store
        resolved = store.resolve_rid(alloc_res.rid)
        assert resolved["status"] == "ACTIVE"
        assert resolved["current_nk"]["digest"] == alloc_res.nk_digest
