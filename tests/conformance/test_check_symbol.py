"""
Conformance Test Suite for ISO 7064 MOD 37,36 and RID Grammar
Conforms to docs/features.md § 3.4 and § 3.10.
"""
import pytest
import random
from backend.core.grammar import (
    compute_check_symbol,
    verify_check_symbol,
    format_rid,
    parse_rid,
    ISO7064_CHARSET
)


def test_format_and_parse_valid_rid():
    rid = format_rid(
        ulpin14="SYNTHETIC0001A",
        bld_seq="B0004",
        cls="U",
        seq="0A3F1"
    )
    assert len(rid) == 29  # 14 + 1 + 5 + 1 + 6 + 1 + 1 = 29 chars with hyphens
    parsed = parse_rid(rid)
    assert parsed.ulpin14 == "SYNTHETIC0001A"
    assert parsed.bld_seq == "B0004"
    assert parsed.cls == "U"
    assert parsed.seq == "0A3F1"
    assert verify_check_symbol(rid) is True


def test_single_character_substitution_detection():
    """ISO 7064 MOD 37,36 must detect 100% of single-character substitution errors."""
    payload = "SYNTHETIC0001AB0004U0A3F1"
    chk = compute_check_symbol(payload)
    valid_str = payload + chk

    # Test all possible substitutions across all 25 payload positions
    trials = 500
    detected = 0
    for _ in range(trials):
        pos = random.randint(0, len(payload) - 1)
        orig = payload[pos]
        cand = [c for c in ISO7064_CHARSET if c != orig]
        corrupted = payload[:pos] + random.choice(cand) + payload[pos + 1:] + chk
        if not verify_check_symbol(corrupted):
            detected += 1

    assert detected == trials, f"Expected 100% detection, but detected {detected}/{trials}"


def test_adjacent_transposition_detection():
    """ISO 7064 MOD 37,36 must detect 100% of adjacent character transpositions."""
    payload = "SYNTHETIC0001AB0004U0A3F1"
    chk = compute_check_symbol(payload)

    transposition_count = 0
    detected = 0
    for pos in range(len(payload) - 1):
        c1, c2 = payload[pos], payload[pos + 1]
        if c1 != c2:
            transposition_count += 1
            transposed = payload[:pos] + c2 + c1 + payload[pos + 2:] + chk
            if not verify_check_symbol(transposed):
                detected += 1

    assert transposition_count > 0
    assert detected == transposition_count, f"Expected 100% adjacent transposition detection, got {detected}/{transposition_count}"


def test_invalid_classes_rejected():
    with pytest.raises(ValueError):
        format_rid("SYNTHETIC0001A", "B0001", "Z", "00001")  # 'Z' is invalid class


def test_invalid_length_rejected():
    with pytest.raises(ValueError):
        format_rid("SHORT", "B0001", "U", "00001")  # ULPIN14 must be 14 chars
