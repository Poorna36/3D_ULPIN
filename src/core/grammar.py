"""
3D ULPIN Core Grammar, Check Symbol, Natural Key (NK) and Spatial Address (SA)
Conforms strictly to docs/features.md and docs/implementation_plan.md Phase 2.
"""
from dataclasses import dataclass
import hashlib
import base64
import math
from typing import List, Tuple, Optional, Set
import numpy as np
import trimesh

# Crockford's Base32 alphabet (excludes I, L, O, U to prevent transcription error)
CROCKFORD_BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"

# Alphanumeric charset for ISO 7064 MOD 37,36
ISO7064_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

# Valid 3D ULPIN object classes (docs/features.md § 3.5)
VALID_CLASSES: Set[str] = {
    "S",  # Surface parcel column
    "B",  # Building envelope
    "L",  # Level / storey volume
    "U",  # Unit (apartment / commercial)
    "C",  # Common area (general / limited)
    "P",  # Accessory (parking, storage)
    "A",  # Airspace lot (air-right volume)
    "T",  # Subterranean lot / tunnel
    "E",  # Elevated corridor
    "I",  # Utility-network segment
}


@dataclass(frozen=True)
class RIDComponents:
    """Deconstructed components of a 3D ULPIN Registry Identifier."""
    ulpin14: str
    bld_seq: str
    cls: str
    seq: str
    chk: str
    raw: str

    @property
    def payload(self) -> str:
        return f"{self.ulpin14}{self.bld_seq}{self.cls}{self.seq}"

    @property
    def formatted(self) -> str:
        return f"{self.ulpin14}-{self.bld_seq}-{self.cls}{self.seq}-{self.chk}"

    @property
    def compact(self) -> str:
        return f"{self.payload}{self.chk}"


@dataclass(frozen=True)
class NaturalKey:
    """Layer 2 deterministic Natural Key derived from canonical geometry."""
    digest: str
    locator: str
    interior_point: Tuple[float, float, float]

    @property
    def string_key(self) -> str:
        return f"{self.digest}_{self.locator}"


# ==============================================================================
# 2A. ISO 7064 MOD 37,36 Check Symbol & RID Grammar
# ==============================================================================

def compute_check_symbol(payload: str) -> str:
    """
    Computes ISO 7064 MOD 37,36 error-detecting check symbol over alphanumeric payload.
    Detects 100% of single-character substitutions and 100% of adjacent transpositions.
    """
    clean_payload = "".join(c.upper() for c in payload if c.isalnum())
    if not clean_payload:
        raise ValueError("Payload must contain at least one alphanumeric character.")

    M = 36
    P = 37
    product = M

    for ch in clean_payload:
        idx = ISO7064_CHARSET.find(ch)
        if idx == -1:
            raise ValueError(f"Character '{ch}' not in ISO 7064 charset.")
        sum_ = (product + idx) % M
        if sum_ == 0:
            sum_ = M
        product = (sum_ * 2) % P

    check_value = (M + 1 - (product % M)) % M
    return ISO7064_CHARSET[check_value]


def verify_check_symbol(full_rid_or_payload_with_check: str) -> bool:
    """
    Verifies that the trailing check symbol matches the computed check symbol
    over the preceding payload.
    """
    cleaned = "".join(c.upper() for c in full_rid_or_payload_with_check if c.isalnum())
    if len(cleaned) < 2:
        return False
    payload = cleaned[:-1]
    expected_chk = cleaned[-1]
    try:
        return compute_check_symbol(payload) == expected_chk
    except ValueError:
        return False


def format_rid(ulpin14: str, bld_seq: str, cls: str, seq: str) -> str:
    """
    Formats and validates a canonical 3D ULPIN (RID) string:
    Grammar: ULPIN14-BLD-CLSSEQ-CHK
    """
    clean_ulpin14 = ulpin14.strip().upper()
    if len(clean_ulpin14) != 14 or not clean_ulpin14.isalnum():
        raise ValueError(f"ULPIN14 must be exactly 14 alphanumeric chars, got '{ulpin14}' (len {len(clean_ulpin14)})")

    clean_bld = bld_seq.strip().upper()
    if len(clean_bld) != 5 or not clean_bld.startswith("B"):
        raise ValueError(f"Building sequence must be 'B' + 4 Crockford Base-32 chars, got '{bld_seq}'")
    for ch in clean_bld[1:]:
        if ch not in CROCKFORD_BASE32:
            raise ValueError(f"Character '{ch}' in building sequence '{bld_seq}' not in Crockford Base-32")

    clean_cls = cls.strip().upper()
    if clean_cls not in VALID_CLASSES:
        raise ValueError(f"Invalid 3D property class '{cls}'. Must be one of {sorted(VALID_CLASSES)}")

    clean_seq = seq.strip().upper()
    if len(clean_seq) != 5:
        raise ValueError(f"Unit sequence must be 5 Crockford Base-32 chars, got '{seq}' (len {len(clean_seq)})")
    for ch in clean_seq:
        if ch not in CROCKFORD_BASE32:
            raise ValueError(f"Character '{ch}' in unit sequence '{seq}' not in Crockford Base-32")

    payload = f"{clean_ulpin14}{clean_bld}{clean_cls}{clean_seq}"
    chk = compute_check_symbol(payload)
    return f"{clean_ulpin14}-{clean_bld}-{clean_cls}{clean_seq}-{chk}"


def parse_rid(rid: str) -> RIDComponents:
    """
    Parses and validates a 3D ULPIN (hyphenated or compact), checking integrity.
    """
    cleaned = "".join(c.upper() for c in rid if c.isalnum())
    if len(cleaned) != 26:
        raise ValueError(f"Invalid 3D ULPIN length ({len(cleaned)} chars). Expected 26 alphanumeric chars.")

    ulpin14 = cleaned[0:14]
    bld_seq = cleaned[14:19]
    cls_char = cleaned[19]
    seq = cleaned[20:25]
    chk = cleaned[25]

    if not bld_seq.startswith("B"):
        raise ValueError(f"Building sequence must start with 'B', got '{bld_seq}'")
    if cls_char not in VALID_CLASSES:
        raise ValueError(f"Invalid class character '{cls_char}' in RID.")

    payload = cleaned[:25]
    expected_chk = compute_check_symbol(payload)
    if chk != expected_chk:
        raise ValueError(f"Check symbol mismatch for RID '{rid}'. Expected '{expected_chk}', got '{chk}'.")

    return RIDComponents(
        ulpin14=ulpin14,
        bld_seq=bld_seq,
        cls=cls_char,
        seq=seq,
        chk=chk,
        raw=rid
    )


# ==============================================================================
# 2B. Natural Key (NK) Algorithm & Canonical Polyhedron Hashing
# ==============================================================================

def canonical_polyhedron(
    mesh: trimesh.Trimesh,
    p_xy: float = 0.01,
    p_z: float = 0.01
) -> bytes:
    """
    Canonicalizes a 3D polyhedron mesh into a deterministic byte stream:
    1. Snap vertices to declared precision grid (default: 1 cm horizontal, 1 cm vertical)
    2. Re-index and eliminate degenerate / zero-area faces
    3. Deterministically order vertices in each face (start with lexicographically smallest vertex)
    4. Deterministically order faces (by outward normal, plane offset, then vertex indices)
    5. Encode into rigid byte structure.
    """
    if not isinstance(mesh, trimesh.Trimesh) or len(mesh.vertices) == 0 or len(mesh.faces) == 0:
        raise ValueError("Valid non-empty Trimesh required for canonicalization.")

    # 1. Coordinate quantization
    snapped_v = np.zeros_like(mesh.vertices, dtype=np.float64)
    snapped_v[:, 0] = np.round(mesh.vertices[:, 0] / p_xy) * p_xy
    snapped_v[:, 1] = np.round(mesh.vertices[:, 1] / p_xy) * p_xy
    snapped_v[:, 2] = np.round(mesh.vertices[:, 2] / p_z) * p_z

    # Create cleaned quantized mesh
    q_mesh = trimesh.Trimesh(vertices=snapped_v, faces=mesh.faces, process=False)
    if hasattr(q_mesh, "nondegenerate_faces"):
        valid_face_mask = q_mesh.nondegenerate_faces()
        clean_faces = q_mesh.faces[valid_face_mask]
    else:
        clean_faces = q_mesh.faces

    # Re-extract unique vertices and re-indexed faces
    unique_v, inverse = np.unique(snapped_v, axis=0, return_inverse=True)
    reindexed_faces = inverse[clean_faces]

    # 2. Total order per face: rotate ring so that the minimum vertex index is at position 0
    canonical_faces = []
    face_normals = []
    face_offsets = []

    for f in reindexed_faces:
        # Check for collapsed face
        if len(set(f)) < 3:
            continue
        # Rotate to place min index at f[0] while preserving winding order
        min_pos = int(np.argmin(f))
        rotated = np.roll(f, -min_pos)

        # Compute normal & plane distance
        v0, v1, v2 = unique_v[rotated[0]], unique_v[rotated[1]], unique_v[rotated[2]]
        normal = np.cross(v1 - v0, v2 - v0)
        norm_len = np.linalg.norm(normal)
        if norm_len < 1e-9:
            continue
        unit_normal = np.round(normal / norm_len, 4)
        offset = np.round(np.dot(unit_normal, v0), 4)

        canonical_faces.append(rotated)
        face_normals.append(unit_normal)
        face_offsets.append(offset)

    if not canonical_faces:
        raise ValueError("Mesh faces collapsed completely during canonical snapping.")

    canonical_faces = np.array(canonical_faces, dtype=np.int64)
    face_normals = np.array(face_normals, dtype=np.float64)
    face_offsets = np.array(face_offsets, dtype=np.float64)

    # 3. Total order across all faces:
    # Sort key: (normal.x, normal.y, normal.z, offset, v0, v1, v2)
    sort_keys = []
    for i in range(len(canonical_faces)):
        f = canonical_faces[i]
        n = face_normals[i]
        d = face_offsets[i]
        sort_keys.append((n[0], n[1], n[2], d, f[0], f[1], f[2], i))

    sort_keys.sort()
    sorted_indices = [k[7] for k in sort_keys]
    final_faces = canonical_faces[sorted_indices]

    # Canonical bytes format: quantized vertex coordinates + canonical face index list
    v_int = np.round(unique_v / np.array([p_xy, p_xy, p_z])).astype(np.int64)
    buffer = v_int.tobytes() + b"||" + final_faces.tobytes()
    return buffer


def compute_interior_point(mesh: trimesh.Trimesh) -> Tuple[float, float, float]:
    """
    Computes a deterministic interior point for the mesh volume.
    For closed watertight meshes, uses the center of mass.
    For complex concave meshes, ensures point lies strictly inside bounding volume.
    """
    if mesh.is_watertight and mesh.volume > 1e-6:
        pt = mesh.center_mass
    else:
        # Fallback to centroid of bounding box or vertex centroid
        pt = mesh.bounds.mean(axis=0)

    return (
        round(float(pt[0]), 7),
        round(float(pt[1]), 7),
        round(float(pt[2]), 2),
    )


# ==============================================================================
# 2C. 63-bit Morton 3D Encoding & Spatial Address (SA)
# ==============================================================================

def _part1by2_64(n: int) -> int:
    """Spreads 21 bits of integer n so that there are 2 zeros between each bit."""
    n &= 0x1FFFFF  # 21 bits
    n = (n | (n << 32)) & 0x1F00000000FFFF
    n = (n | (n << 16)) & 0x1F0000FF0000FF
    n = (n | (n << 8))  & 0x100F00F00F00F00F
    n = (n | (n << 4))  & 0x10C30C30C30C30C3
    n = (n | (n << 2))  & 0x1249249249249249
    return n


def _compact1by2_64(n: int) -> int:
    """Inverts _part1by2_64: extracts bits at positions 0, 3, 6, ..."""
    n &= 0x1249249249249249
    n = (n ^ (n >> 2))  & 0x10C30C30C30C30C3
    n = (n ^ (n >> 4))  & 0x100F00F00F00F00F
    n = (n ^ (n >> 8))  & 0x1F0000FF0000FF
    n = (n ^ (n >> 16)) & 0x1F00000000FFFF
    n = (n ^ (n >> 32)) & 0x1FFFFF
    return n


def morton_encode_3d(
    x: float,
    y: float,
    z: float,
    origin: Tuple[float, float, float] = (0.0, 0.0, 0.0),
    cell_size_m: float = 1.0
) -> int:
    """
    Computes 63-bit 3D Morton code (Z-order curve) for a 3D coordinate point.
    21 bits per axis gives > 2,000,000 cells per axis (~2,000 km at 1m resolution).
    """
    ix = max(0, min(0x1FFFFF, int(math.floor((x - origin[0]) / cell_size_m))))
    iy = max(0, min(0x1FFFFF, int(math.floor((y - origin[1]) / cell_size_m))))
    iz = max(0, min(0x1FFFFF, int(math.floor((z - origin[2]) / cell_size_m))))

    morton = (_part1by2_64(iz) << 2) | (_part1by2_64(iy) << 1) | _part1by2_64(ix)
    return morton


def morton_decode_3d(
    morton: int,
    origin: Tuple[float, float, float] = (0.0, 0.0, 0.0),
    cell_size_m: float = 1.0
) -> Tuple[float, float, float]:
    """Inverts morton_encode_3d, returning lower corner of voxel cell."""
    ix = _compact1by2_64(morton)
    iy = _compact1by2_64(morton >> 1)
    iz = _compact1by2_64(morton >> 2)

    return (
        round(origin[0] + ix * cell_size_m, 3),
        round(origin[1] + iy * cell_size_m, 3),
        round(origin[2] + iz * cell_size_m, 3),
    )


def compute_nk(
    mesh: trimesh.Trimesh,
    cls: str = "U",
    datum_id: str = "WGS84",
    p_xy: float = 0.01,
    p_z: float = 0.01
) -> NaturalKey:
    """
    Computes Layer 2 Natural Key (NK) per docs/features.md § 3.6:
    - digest: base32(SHA-256(canonical_bytes || CLS || datum_id || p_xy || p_z))[:16]
    - locator: 3D Morton interleave of interior point
    """
    canon_bytes = canonical_polyhedron(mesh, p_xy=p_xy, p_z=p_z)
    meta_str = f"|{cls}|{datum_id}|{p_xy:.4f}|{p_z:.4f}".encode("utf-8")
    full_payload = canon_bytes + meta_str

    sha256_hash = hashlib.sha256(full_payload).digest()
    digest_b32 = base64.b32encode(sha256_hash)[:16].decode("ascii")

    interior_pt = compute_interior_point(mesh)
    morton_code = morton_encode_3d(interior_pt[0], interior_pt[1], interior_pt[2])
    locator = f"M3D{morton_code:016X}"

    return NaturalKey(
        digest=digest_b32,
        locator=locator,
        interior_point=interior_pt
    )


def compute_sa_cover(
    mesh: trimesh.Trimesh,
    levels: List[float] = [100.0, 10.0, 1.0]
) -> List[str]:
    """
    Generates multi-resolution Spatial Address (SA) 3D grid cell codes covering
    the bounding extent of the mesh at each specified scale.
    """
    bounds = mesh.bounds  # [[minx, miny, minz], [maxx, maxy, maxz]]
    sa_codes = []

    for cell_size in levels:
        x_min, y_min, z_min = bounds[0]
        x_max, y_max, z_max = bounds[1]

        # Calculate bounding voxel indices
        ix_min = int(math.floor(x_min / cell_size))
        ix_max = int(math.floor(x_max / cell_size))
        iy_min = int(math.floor(y_min / cell_size))
        iy_max = int(math.floor(y_max / cell_size))
        iz_min = int(math.floor(z_min / cell_size))
        iz_max = int(math.floor(z_max / cell_size))

        # Sample grid points inside bounding volume
        for ix in range(ix_min, min(ix_max + 1, ix_min + 5)):
            for iy in range(iy_min, min(iy_max + 1, iy_min + 5)):
                for iz in range(iz_min, min(iz_max + 1, iz_min + 5)):
                    m = morton_encode_3d(ix * cell_size, iy * cell_size, iz * cell_size, cell_size_m=cell_size)
                    sa_codes.append(f"SA-{int(cell_size)}M-{m:016X}")

    return sorted(list(set(sa_codes)))
