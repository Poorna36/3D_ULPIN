"""
3D ULPIN Core Grammar, Check Symbol, Natural Key (NK) and Spatial Address (SA)
Conforms strictly to docs/features.md and docs/implementation_plan.md Phase 2.
"""
from enum import Enum
from dataclasses import dataclass
from functools import lru_cache
import hashlib
import base64
import math
from typing import List, Tuple, Optional, Set, Dict, Any
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
    origin_z = -1000.0 if interior_pt[2] < 0 else 0.0
    morton_code = morton_encode_3d(interior_pt[0], interior_pt[1], interior_pt[2], origin=(0.0, 0.0, origin_z))
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
        origin_z = -1000.0 if z_min < 0 else 0.0

        # Calculate bounding voxel indices
        ix_min = int(math.floor(x_min / cell_size))
        ix_max = int(math.floor(x_max / cell_size))
        iy_min = int(math.floor(y_min / cell_size))
        iy_max = int(math.floor(y_max / cell_size))
        iz_min = int(math.floor((z_min - origin_z) / cell_size))
        iz_max = int(math.floor((z_max - origin_z) / cell_size))

        # Sample grid points inside bounding volume
        for ix in range(ix_min, min(ix_max + 1, ix_min + 5)):
            for iy in range(iy_min, min(iy_max + 1, iy_min + 5)):
                for iz in range(iz_min, min(iz_max + 1, iz_min + 5)):
                    m = morton_encode_3d(
                        ix * cell_size,
                        iy * cell_size,
                        origin_z + iz * cell_size,
                        origin=(0.0, 0.0, origin_z),
                        cell_size_m=cell_size
                    )
                    sa_codes.append(f"SA-{int(cell_size)}M-{m:016X}")

    return sorted(list(set(sa_codes)))


@lru_cache(maxsize=4096)
def sa_lookup(cell_code: str) -> Dict[str, Any]:
    """
    Decodes a multi-resolution Spatial Address (SA) cell code into its 3D bounding extent.
    Conforms to Phase 2C.2 with lru_cache for sub-millisecond retrieval.
    Format: SA-{level}M-{morton_hex} (e.g. 'SA-10M-0000000000001A3F')
    """
    parts = cell_code.split("-")
    if len(parts) != 3 or parts[0] != "SA":
        raise ValueError(f"Invalid SA cell code format '{cell_code}'. Expected 'SA-{{level}}M-{{hex}}'")

    level_str = parts[1]
    if not level_str.endswith("M"):
        raise ValueError(f"Invalid resolution level in cell code '{cell_code}'")
    cell_size = float(level_str[:-1])
    morton_code = int(parts[2], 16)
    min_corner = morton_decode_3d(morton_code, cell_size_m=cell_size)
    max_corner = (
        round(min_corner[0] + cell_size, 3),
        round(min_corner[1] + cell_size, 3),
        round(min_corner[2] + cell_size, 3)
    )
    return {
        "cell_code": cell_code,
        "cell_size_m": cell_size,
        "bounds": [min_corner[0], min_corner[1], min_corner[2], max_corner[0], max_corner[1], max_corner[2]],
        "min_corner": min_corner,
        "max_corner": max_corner
    }


class SpatialAddressIndex:
    """In-memory Spatial Address Index mapping 3D Morton cell codes to registered RIDs."""

    def __init__(self):
        self._cell_to_rids: Dict[str, List[str]] = {}

    def insert(self, sa_codes: List[str], rid: str) -> None:
        for code in sa_codes:
            if code not in self._cell_to_rids:
                self._cell_to_rids[code] = []
            if rid not in self._cell_to_rids[code]:
                self._cell_to_rids[code].append(rid)

    def lookup(self, cell_code: str) -> List[str]:
        return self._cell_to_rids.get(cell_code, [])


class Jurisdiction(str, Enum):
    IN_MH = "IN_MH"
    IN_KA = "IN_KA"
    SG = "SG"
    SANDBOX = "SANDBOX"


@dataclass(frozen=True)
class StatutoryAnchor:
    act_name: str
    section: str
    statutory_basis: str
    citation: str
    notes: str = ""

    def to_dict(self) -> Dict[str, str]:
        return {
            "act_name": self.act_name,
            "section": self.section,
            "statutory_basis": self.statutory_basis,
            "citation": self.citation,
            "notes": self.notes,
        }


JURISDICTION_STATUTORY_MAP: Dict[str, Dict[str, StatutoryAnchor]] = {
    "IN_MH": {
        "U": StatutoryAnchor(
            act_name="Maharashtra Apartment Ownership Act 1970",
            section="Section 4 & 5",
            statutory_basis="ENACTED",
            citation="MAOA 1970 § 4, 5 r/w Real Estate (Regulation and Development) Act 2016 § 2(k), § 14",
            notes="Exclusive ownership of apartment unit with undivided interest in common areas",
        ),
        "C": StatutoryAnchor(
            act_name="Maharashtra Apartment Ownership Act 1970",
            section="Section 6",
            statutory_basis="ENACTED",
            citation="MAOA 1970 § 6 r/w MOFA 1963",
            notes="Common areas and facilities held in undivided interest by apartment owners",
        ),
        "P": StatutoryAnchor(
            act_name="Maharashtra Apartment Ownership Act 1970",
            section="Section 3(a) & 4",
            statutory_basis="ENACTED",
            citation="MAOA 1970 § 3(a), 4 (Limited Common Area / Appurtenant Parking Bay)",
            notes="Appurtenant or reserved parking space attached to residential / commercial unit",
        ),
        "E": StatutoryAnchor(
            act_name="Metro Railways (Construction of Works) Act 1978",
            section="Section 6",
            statutory_basis="ENACTED",
            citation="Metro Railways Act 1978 § 6 (Elevated Alignment Easement)",
            notes="Elevated transit corridor right of user / statutory easement over surface parcels",
        ),
        "T": StatutoryAnchor(
            act_name="Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act 2013",
            section="Subterranean Easement Provisions",
            statutory_basis="ENACTED",
            citation="RFCTLARR Act 2013 (Subterranean Transit / Infrastructure Easement)",
            notes="Underground transit tunnel easement (e.g. MMRC Aqua Line 3 tunnel layer)",
        ),
        "A": StatutoryAnchor(
            act_name="Aircraft Act 1934 & MoCA CCZM Rules",
            section="Colour Coded Zoning Map Rules",
            statutory_basis="STATUTORY_RESTRICTION",
            citation="Aircraft Act 1934 r/w MoCA CCZM Height Limitations & TDR Regulations",
            notes="Airspace lot subject to statutory airport obstacle limitation surfaces & transferable development rights",
        ),
        "S": StatutoryAnchor(
            act_name="Maharashtra Land Revenue Code 1966",
            section="Section 20 & 44",
            statutory_basis="ENACTED",
            citation="MLRC 1966 § 20, 44 (Cadastral Parcel Surface Unit)",
            notes="Ground surface parcel column registered in City Survey / MahaBhulekh",
        ),
        "B": StatutoryAnchor(
            act_name="Maharashtra Land Revenue Code 1966 & MCGM Development Control Regulations",
            section="Building Envelope Provisions",
            statutory_basis="ENACTED",
            citation="MLRC 1966 r/w DCPR 2034 (Approved Building Envelope)",
            notes="Overall sanctioned building envelope shell",
        ),
        "L": StatutoryAnchor(
            act_name="Maharashtra Regional and Town Planning Act 1966",
            section="Sanctioned Development Plan Provisions",
            statutory_basis="ENACTED",
            citation="MRTP Act 1966 / DCPR 2034 Floor Slab Allocation",
            notes="Horizontal storey slab band dividing vertical cadastral space",
        ),
        "I": StatutoryAnchor(
            act_name="Indian Telegraph Act 1885 & Electricity Act 2003",
            section="Wayleave & Subsurface Conduits",
            statutory_basis="ENACTED",
            citation="Indian Telegraph Act 1885 § 10 / Electricity Act 2003 (Utility Wayleave)",
            notes="Underground or surface utility-network corridor servitude",
        ),
    },
    "IN_KA": {
        "U": StatutoryAnchor(
            act_name="Karnataka Apartment Ownership Act 1972",
            section="Section 4 & 5",
            statutory_basis="ENACTED",
            citation="KAOA 1972 § 4, 5 r/w Real Estate (Regulation and Development) Act 2016 § 2(k), § 14",
            notes="Exclusive ownership of apartment unit with undivided share of land (UDS)",
        ),
        "C": StatutoryAnchor(
            act_name="Karnataka Apartment Ownership Act 1972",
            section="Section 6",
            statutory_basis="ENACTED",
            citation="KAOA 1972 § 6 (Common Areas and Facilities)",
            notes="Common areas held in common by apartment owners association",
        ),
        "P": StatutoryAnchor(
            act_name="Karnataka Apartment Ownership Act 1972",
            section="Section 3(f) & 4",
            statutory_basis="ENACTED",
            citation="KAOA 1972 § 3(f), 4 (Appurtenant Parking Bay)",
            notes="Designated parking cell tied to apartment title",
        ),
        "E": StatutoryAnchor(
            act_name="Metro Railways (Construction of Works) Act 1978",
            section="Section 6",
            statutory_basis="ENACTED",
            citation="Metro Railways Act 1978 § 6 (BMRCL Elevated Alignment)",
            notes="Namma Metro viaduct easement over Bangalore surface parcels",
        ),
        "T": StatutoryAnchor(
            act_name="Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act 2013",
            section="Subterranean Easement Provisions",
            statutory_basis="ENACTED",
            citation="RFCTLARR Act 2013 (BMRCL Underground Tunnel Easement)",
            notes="Subterranean metro corridor (Purple/Pink Line underground sections)",
        ),
        "A": StatutoryAnchor(
            act_name="Aircraft Act 1934 & MoCA CCZM Rules",
            section="Colour Coded Zoning Map Rules",
            statutory_basis="STATUTORY_RESTRICTION",
            citation="Aircraft Act 1934 r/w HAL & BIAL Airport Height Envelopes",
            notes="Airspace restriction envelope over Bengaluru parcels",
        ),
        "S": StatutoryAnchor(
            act_name="Karnataka Land Revenue Act 1964",
            section="Section 67 & 95",
            statutory_basis="ENACTED",
            citation="KLRA 1964 § 67, 95 (Bhoomi / UPOR Cadastral Surface Unit)",
            notes="Ground parcel registered under Karnataka UPOR / e-Aasthi",
        ),
        "B": StatutoryAnchor(
            act_name="Karnataka Municipal Corporations Act 1976 & BBMP Building Bye-Laws",
            section="Sanctioned Building Plan Envelope",
            statutory_basis="ENACTED",
            citation="KMCA 1976 r/w BBMP Building Bye-laws 2003",
            notes="Sanctioned structural envelope for Bengaluru property",
        ),
        "L": StatutoryAnchor(
            act_name="Karnataka Town and Country Planning Act 1961",
            section="Zoning Regulations",
            statutory_basis="ENACTED",
            citation="KTCPA 1961 Floor Storey Allocation",
            notes="Floor slab storey level",
        ),
        "I": StatutoryAnchor(
            act_name="Indian Telegraph Act 1885 & Karnataka Municipal Authorities Utility Regulations",
            section="Utility Wayleave",
            statutory_basis="ENACTED",
            citation="Indian Telegraph Act 1885 § 10 / BWSSB / BESCOM Easement",
            notes="Public water / electricity utility conduit servitude",
        ),
    },
    "SG": {
        "U": StatutoryAnchor(
            act_name="Land Titles (Strata) Act (Cap. 158)",
            section="Part II (Strata Lots)",
            statutory_basis="ENACTED",
            citation="Singapore Land Titles (Strata) Act (Cap. 158) / SLA 3D Cadastre",
            notes="Subdivided strata lot in airspace",
        ),
        "C": StatutoryAnchor(
            act_name="Building Maintenance and Strata Management Act (BMSMA)",
            section="Part III (Common Property)",
            statutory_basis="ENACTED",
            citation="BMSMA Part III / SLA 3D Common Property",
            notes="Strata common property managed by MCST",
        ),
        "P": StatutoryAnchor(
            act_name="Land Titles (Strata) Act (Cap. 158)",
            section="Accessory Lot Provisions",
            statutory_basis="ENACTED",
            citation="Singapore LTSA Accessory Lot",
            notes="Accessory strata lot for vehicle parking",
        ),
        "E": StatutoryAnchor(
            act_name="Rapid Transit Systems Act (Cap. 263A)",
            section="Section 8 (Railway Safety Zone)",
            statutory_basis="ENACTED",
            citation="RTSA (Cap. 263A) § 8 (LTA Elevated Railway Reserve)",
            notes="LTA elevated MRT railway safety corridor",
        ),
        "T": StatutoryAnchor(
            act_name="State Lands Act (Cap. 314)",
            section="Underground Land Severance (30m Stratum)",
            statutory_basis="ENACTED",
            citation="State Lands Act (Cap. 314) § 3(4) (Subterranean Land Severance)",
            notes="Underground stratum below subterranean boundary limit",
        ),
        "A": StatutoryAnchor(
            act_name="Air Navigation Act (Cap. 6)",
            section="Aviation Height Limit",
            statutory_basis="STATUTORY_RESTRICTION",
            citation="Air Navigation Act (Cap. 6) / CAAS Height Limitation",
            notes="Restricted airspace ceiling above Singapore parcel",
        ),
        "S": StatutoryAnchor(
            act_name="Land Titles Act (Cap. 157)",
            section="Surface Land Parcel",
            statutory_basis="ENACTED",
            citation="LTA (Cap. 157) Land Lot Boundary",
            notes="SLA State Land Lot",
        ),
        "B": StatutoryAnchor(
            act_name="Building Control Act (Cap. 29)",
            section="Approved Building Works",
            statutory_basis="ENACTED",
            citation="BCA Approved Envelope",
            notes="Building envelope permitted under URA Master Plan",
        ),
        "L": StatutoryAnchor(
            act_name="Planning Act (Cap. 232)",
            section="Gross Floor Area Guidelines",
            statutory_basis="ENACTED",
            citation="Planning Act (Cap. 232) Storey Level",
            notes="Storey level within building",
        ),
        "I": StatutoryAnchor(
            act_name="Public Utilities Act (Cap. 261)",
            section="Utility Corridors",
            statutory_basis="ENACTED",
            citation="PUA (Cap. 261) Utility Subterranean Reserve",
            notes="PUB water/power utility reserve",
        ),
    },
    "SANDBOX": {
        cls_code: StatutoryAnchor(
            act_name="None (Synthetic Sandbox / Fictional Model)",
            section="N/A",
            statutory_basis="SANDBOX_BYPASS",
            citation="Synthetic Geometry Sandbox (State statutes and local RERA rules bypassed)",
            notes="Non-territorial simulation model (e.g. Arasaka Tower); topological and geometric validity only",
        )
        for cls_code in VALID_CLASSES
    }
}


def get_statutory_anchor(cls: str, jurisdiction: str = "IN_MH") -> StatutoryAnchor:
    """
    Returns the StatutoryAnchor object for a given property class and jurisdiction.
    Falls back gracefully to IN_MH defaults if jurisdiction is unrecognized.
    """
    jur = jurisdiction.upper() if jurisdiction else "IN_MH"
    if jur not in JURISDICTION_STATUTORY_MAP:
        jur = "IN_MH"
    jur_map = JURISDICTION_STATUTORY_MAP[jur]
    if cls in jur_map:
        return jur_map[cls]
    # Default fallback
    return StatutoryAnchor(
        act_name="General Cadastral Regulations",
        section="Section 1",
        statutory_basis="ASSUMED",
        citation="Cadastral General Law",
        notes="Unclassified 3D parcel volume",
    )

