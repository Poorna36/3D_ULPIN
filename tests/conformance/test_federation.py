"""
Two-State Federation Conformance Test
Conforms to docs/features.md § 3.10 and Phase 2F.3.
Asserts that identical 3D meshes submitted to different state issuer nodes (e.g. MH and KA)
receive distinct state-issued RIDs, but compute mathematically identical Natural Keys (NKs).
"""
import tempfile
import os
import trimesh
from backend.core.registry import RegistryStore
from backend.identity.allocator import ULPIN3DAllocator


def test_federation_same_mesh_different_nodes():
    tmp_base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".tmp"))
    os.makedirs(tmp_base, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=tmp_base) as tmpdir:
        db_path = os.path.join(tmpdir, "fed_test.db")
        store = RegistryStore(db_path=db_path)
        allocator = ULPIN3DAllocator(store=store)

        # Same identical physical room geometry
        mesh = trimesh.creation.box(extents=[10.0, 12.0, 3.0])

        # Maharashtra Node allocation
        res_mh = allocator.allocate(
            ulpin14="MH2700010001AA",
            cls="U",
            mesh=mesh,
            issuer_node_id="MH"
        )

        # Karnataka Node allocation
        res_ka = allocator.allocate(
            ulpin14="KA2900010001BB",
            cls="U",
            mesh=mesh,
            issuer_node_id="KA"
        )

        # 1. RIDs must be completely distinct because they belong to different state parcels
        assert res_mh.rid != res_ka.rid
        assert res_mh.rid.startswith("MH2700010001AA")
        assert res_ka.rid.startswith("KA2900010001BB")

        # 2. Layer 2 Natural Keys (NKs) MUST BE 100% IDENTICAL because the canonical geometry is identical
        assert res_mh.nk_digest == res_ka.nk_digest
        assert res_mh.nk_locator == res_ka.nk_locator
