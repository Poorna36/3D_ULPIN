"""
3D ULPIN Conformance Suite Runner
Verifies Grammar, Check Symbol, NK Determinism, and Morton 3D SA Encoding.
Conforms to docs/features.md § 3.10 and docs/implementation_plan.md Phase 2F.
"""
from dataclasses import dataclass
from typing import Dict, Any, List
import random
import math
import numpy as np
import trimesh

from src.core.grammar import (
    compute_check_symbol,
    verify_check_symbol,
    format_rid,
    parse_rid,
    canonical_polyhedron,
    compute_nk,
    morton_encode_3d,
    morton_decode_3d,
    ISO7064_CHARSET,
    CROCKFORD_BASE32
)


@dataclass
class ConformanceReport:
    overall_passed: bool
    grammar_tests: int
    check_symbol_tests: int
    substitutions_detected_pct: float
    transpositions_detected_pct: float
    nk_determinism_passed: bool
    morton_roundtrip_passed: bool
    details: Dict[str, Any]


def run_conformance_suite(trials: int = 500) -> ConformanceReport:
    """Executes full mathematical and identity conformance tests."""
    details = {}

    # 1. Grammar and Known Valid RID Test
    sample_rid = format_rid(
        ulpin14="SYNTHETIC0001A",
        bld_seq="B0004",
        cls="U",
        seq="0A3F1"
    )
    parsed = parse_rid(sample_rid)
    assert parsed.ulpin14 == "SYNTHETIC0001A"
    assert parsed.cls == "U"
    details["sample_rid"] = sample_rid
    details["grammar_valid"] = True

    # 2. ISO 7064 Check Symbol Error Detection Tests
    sub_detected = 0
    clean_payload = parsed.payload  # 25 characters

    for _ in range(trials):
        # Pick random position and substitute character
        pos = random.randint(0, len(clean_payload) - 1)
        orig_char = clean_payload[pos]
        cand_chars = [c for c in ISO7064_CHARSET if c != orig_char]
        sub_char = random.choice(cand_chars)
        corrupted = clean_payload[:pos] + sub_char + clean_payload[pos + 1:] + parsed.chk

        if not verify_check_symbol(corrupted):
            sub_detected += 1

    sub_rate = (sub_detected / trials) * 100.0
    details["substitution_detection_rate"] = sub_rate

    # Adjacent transposition test
    trans_trials = 0
    trans_detected = 0
    for pos in range(len(clean_payload) - 1):
        c1, c2 = clean_payload[pos], clean_payload[pos + 1]
        if c1 != c2:
            trans_trials += 1
            transposed = clean_payload[:pos] + c2 + c1 + clean_payload[pos + 2:] + parsed.chk
            if not verify_check_symbol(transposed):
                trans_detected += 1

    trans_rate = (trans_detected / trans_trials * 100.0) if trans_trials > 0 else 100.0
    details["transposition_detection_rate"] = trans_rate

    # 3. Natural Key Determinism Under Vertex/Face Permutations
    base_box = trimesh.creation.box(extents=[10.0, 15.0, 3.5])
    nk1 = compute_nk(base_box, cls="U")

    # Permute vertex and face order
    v_perm = np.random.permutation(len(base_box.vertices))
    inv_map = np.zeros(len(v_perm), dtype=int)
    inv_map[v_perm] = np.arange(len(v_perm))

    shuffled_vertices = base_box.vertices[v_perm]
    shuffled_faces = inv_map[base_box.faces]
    np.random.shuffle(shuffled_faces)

    shuffled_box = trimesh.Trimesh(vertices=shuffled_vertices, faces=shuffled_faces, process=False)
    nk2 = compute_nk(shuffled_box, cls="U")

    nk_deterministic = (nk1.digest == nk2.digest)
    details["nk_determinism"] = nk_deterministic

    # 4. Morton 3D Round-Trip
    test_pts = [
        (12.9716, 77.5946, 920.5),
        (0.0, 0.0, 0.0),
        (100.25, 200.75, 50.0)
    ]
    morton_ok = True
    for pt in test_pts:
        code = morton_encode_3d(pt[0], pt[1], pt[2], cell_size_m=1.0)
        dec = morton_decode_3d(code, cell_size_m=1.0)
        # Coordinate inside cell
        if abs(dec[0] - math.floor(pt[0])) > 1e-3:
            morton_ok = False

    details["morton_ok"] = morton_ok

    overall = (
        sub_rate == 100.0 and
        trans_rate == 100.0 and
        nk_deterministic and
        morton_ok
    )

    return ConformanceReport(
        overall_passed=overall,
        grammar_tests=1,
        check_symbol_tests=trials + trans_trials,
        substitutions_detected_pct=sub_rate,
        transpositions_detected_pct=trans_rate,
        nk_determinism_passed=nk_deterministic,
        morton_roundtrip_passed=morton_ok,
        details=details
    )
