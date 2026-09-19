"""
Conformance Test Suite for Layer 2 Natural Key (NK) and Layer 3 Spatial Address (SA)
Conforms to docs/features.md § 3.6, § 3.7, and § 3.10.
"""
import pytest
import numpy as np
import trimesh
from src.core.grammar import (
    compute_nk,
    canonical_polyhedron,
    morton_encode_3d,
    morton_decode_3d,
    compute_sa_cover
)


def test_nk_determinism_under_vertex_and_face_permutation():
    """Canonicalization must produce identical digests regardless of vertex/face order."""
    box = trimesh.creation.box(extents=[12.0, 8.0, 3.2])
    nk1 = compute_nk(box, cls="U")

    # Permute vertices and remap faces
    n_v = len(box.vertices)
    perm = np.random.permutation(n_v)
    inv_perm = np.zeros(n_v, dtype=int)
    inv_perm[perm] = np.arange(n_v)

    shuffled_v = box.vertices[perm]
    shuffled_f = inv_perm[box.faces]
    np.random.shuffle(shuffled_f)

    shuffled_mesh = trimesh.Trimesh(vertices=shuffled_v, faces=shuffled_f, process=False)
    nk2 = compute_nk(shuffled_mesh, cls="U")

    assert nk1.digest == nk2.digest, f"NK digest changed under vertex permutation! {nk1.digest} != {nk2.digest}"
    assert nk1.locator == nk2.locator, f"NK locator changed! {nk1.locator} != {nk2.locator}"


def test_morton_3d_encoding_roundtrip():
    """Morton 3D codes must encode and decode coordinates back to correct spatial cell."""
    coords = [
        (10.0, 20.0, 30.0),
        (0.0, 0.0, 0.0),
        (500.25, 800.75, 45.10),
        (12971.6, 77594.6, 920.5)
    ]
    for x, y, z in coords:
        code = morton_encode_3d(x, y, z, cell_size_m=1.0)
        dec_x, dec_y, dec_z = morton_decode_3d(code, cell_size_m=1.0)
        assert abs(dec_x - np.floor(x)) < 1e-3
        assert abs(dec_y - np.floor(y)) < 1e-3
        assert abs(dec_z - np.floor(z)) < 1e-3


def test_spatial_address_cover():
    """compute_sa_cover generates multi-resolution hierarchical cells."""
    prism = trimesh.creation.box(extents=[25.0, 30.0, 15.0])
    cover = compute_sa_cover(prism, levels=[100.0, 10.0, 1.0])
    assert len(cover) > 0
    assert any("SA-100M-" in code for code in cover)
    assert any("SA-10M-" in code for code in cover)
    assert any("SA-1M-" in code for code in cover)
