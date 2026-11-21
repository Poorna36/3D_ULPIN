"""
Full Conformance Suite Execution Test
"""
from backend.identity.conformance import run_conformance_suite


def test_full_conformance_suite():
    report = run_conformance_suite(trials=100)
    assert report.overall_passed is True
    assert report.substitutions_detected_pct == 100.0
    assert report.transpositions_detected_pct == 100.0
    assert report.nk_determinism_passed is True
    assert report.morton_roundtrip_passed is True
