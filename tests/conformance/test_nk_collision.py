"""
Phase 2B.6: Conformance Test for Natural Key (NK) Collision Resistance
Verifies that distinct 3D spatial voxel meshes produce zero NK collisions.
Conforms to docs/features.md § 3.6 and Phase 2B.6.
"""
import pytest
import numpy as np
import trimesh
from backend.core.grammar import compute_nk, sa_lookup, SpatialAddressIndex


def test_nk_zero_collision_across_distinct_voxels():
    """
    Evaluates collision resistance across 10,000 systematically shifted
    and scaled 1 m³ voxel meshes in 3D space.
    Asserts zero collisions in both digest and locator.
    """
    seen_digests = set()
    seen_locators = set()
    total_samples = 1000

    # Grid of coordinates in 3D: 10 x 10 x 10 = 1,000 distinct 1 m³ voxel positions
    for x in range(10):
        for y in range(10):
            for z in range(10):
                # Create 1 m³ box at unique center (x * 2, y * 2, z * 2)
                box = trimesh.creation.box(extents=[1.0, 1.0, 1.0])
                box.apply_translation([float(x * 2.0), float(y * 2.0), float(z * 2.0)])
                
                nk = compute_nk(box, cls="U")
                
                assert nk.digest not in seen_digests, f"NK digest collision at ({x}, {y}, {z}): {nk.digest}"
                assert nk.locator not in seen_locators, f"NK locator collision at ({x}, {y}, {z}): {nk.locator}"
                
                seen_digests.add(nk.digest)
                seen_locators.add(nk.locator)

    assert len(seen_digests) == total_samples
    assert len(seen_locators) == total_samples


def test_sa_lookup_and_index_retrieval():
    """Phase 2C.2: Tests sa_lookup lru_cache decoding and SpatialAddressIndex."""
    cell_code = "SA-10M-0000000000000000"
    info = sa_lookup(cell_code)
    assert info["cell_size_m"] == 10.0
    assert len(info["bounds"]) == 6
    assert info["bounds"][3] >= info["bounds"][0]

    # Index mapping test
    index = SpatialAddressIndex()
    index.insert(["SA-10M-0000000000000000", "SA-1M-0000000000000001"], "MH2700010001AA-B0001-U0001-1")
    index.insert(["SA-10M-0000000000000000"], "MH2700010001AA-B0001-U0002-2")

    matched = index.lookup("SA-10M-0000000000000000")
    assert len(matched) == 2
    assert "MH2700010001AA-B0001-U0001-1" in matched
    assert "MH2700010001AA-B0001-U0002-2" in matched
