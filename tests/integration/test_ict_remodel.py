"""
Integration Test for ICT Unit Partition / Remodel (SPLIT)
Conforms to docs/features.md § 3.8 and Phase 2E.3.
"""
import tempfile
import os
import trimesh
from backend.core.ict import ict_evaluate, ICTDecision
from backend.core.registry import RegistryStore
from backend.identity.allocator import ULPIN3DAllocator


def test_ict_unit_partition_remodel():
    """Simulates a large commercial floor subdivided into two separate units."""
    tmp_base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".tmp"))
    os.makedirs(tmp_base, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=tmp_base) as tmpdir:
        db_path = os.path.join(tmpdir, "ict_remodel.db")
        store = RegistryStore(db_path=db_path)
        allocator = ULPIN3DAllocator(store=store)

        # 1. Original parent unit (20m x 10m x 3.2m)
        orig_unit = trimesh.creation.box(extents=[20.0, 10.0, 3.2])
        res_orig = allocator.allocate(
            ulpin14="MH2700010001AA",
            cls="U",
            mesh=orig_unit,
            bld_seq="B0001",
            issuer_node_id="MH"
        )

        # 2. Subdivided partition unit A (covers half the original space, e.g. 10m x 10m)
        part_a = trimesh.creation.box(extents=[10.0, 10.0, 3.2])
        part_a.apply_translation([-5.0, 0.0, 0.0])

        ict_res = ict_evaluate(
            old_mesh=orig_unit,
            new_mesh=part_a,
            old_cls="U",
            new_cls="U"
        )

        # Since IoU is approximately 0.50 (subdivision), ICT routes to SPLIT
        assert ict_res.decision == ICTDecision.SPLIT
