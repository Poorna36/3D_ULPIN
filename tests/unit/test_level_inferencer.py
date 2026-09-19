"""
Unit Tests for Sensor-Side Level Inferencer & Viterbi DP Alignment (Phase 6C)
Conforms to docs/pipeline.md § 4.4 and Phase 6C.5.
"""
import pytest
import numpy as np
from src.ml.h2_level_inferencer import LevelInferencer, CandidatePeak


def test_peak_extraction_from_point_cloud():
    rng = np.random.default_rng(42)
    # Generate 3 distinct floor slab point clusters at z = 3.0m, 6.2m, 9.4m
    n_per_floor = 100
    pts_f1 = np.column_stack([rng.uniform(0, 10, n_per_floor), rng.uniform(0, 10, n_per_floor), rng.normal(3.0, 0.02, n_per_floor)])
    pts_f2 = np.column_stack([rng.uniform(0, 10, n_per_floor), rng.uniform(0, 10, n_per_floor), rng.normal(6.2, 0.02, n_per_floor)])
    pts_f3 = np.column_stack([rng.uniform(0, 10, n_per_floor), rng.uniform(0, 10, n_per_floor), rng.normal(9.4, 0.02, n_per_floor)])
    cloud = np.vstack([pts_f1, pts_f2, pts_f3])

    peaks = LevelInferencer.extract_peaks(cloud, bin_size=0.05, min_density=15)
    assert len(peaks) == 3
    peak_z_vals = [p.z for p in peaks]
    assert any(abs(z - 3.0) < 0.10 for z in peak_z_vals)
    assert any(abs(z - 6.2) < 0.10 for z in peak_z_vals)
    assert any(abs(z - 9.4) < 0.10 for z in peak_z_vals)


def test_viterbi_alignment_and_sufficiency_check():
    expected_z = [3.0, 6.0, 9.0, 12.0]

    # Observations:
    # Level 1 (z=3.01): High support -> PASS
    # Level 2 (z=6.22): Shifted (+22cm) -> WARN / SHIFTED
    # Level 3 (z=9.0): Low support (only 5 points, < n_min=15) -> MUST return UNVERIFIABLE, not PASS!
    # Level 4: Missing entirely -> MISSING / FAIL
    peaks = [
        CandidatePeak(z=3.01, density=80.0, n_points=80, sigma=0.03),
        CandidatePeak(z=6.22, density=65.0, n_points=65, sigma=0.04),
        CandidatePeak(z=9.00, density=5.0, n_points=5, sigma=0.03),  # Insufficient support!
    ]

    results = LevelInferencer.viterbi_align(
        expected_z=expected_z,
        candidate_peaks=peaks,
        n_min=15,
        tau_policy=0.25
    )
    assert len(results) == 4

    # Level 1: PASS
    assert results[0].level_no == 1
    assert results[0].status == "PASS"
    assert results[0].flag == "MATCH"

    # Level 2: Shifted
    assert results[1].level_no == 2
    assert results[1].status in {"WARN", "FAIL"}
    assert results[1].flag == "SHIFTED"

    # Level 3: INSUFFICIENT SUPPORT -> UNVERIFIABLE (Never silently PASS!)
    assert results[2].level_no == 3
    assert results[2].status == "UNVERIFIABLE"
    assert results[2].flag == "UNVERIFIABLE"
    assert "Insufficient sensor evidence" in results[2].explanation

    # Level 4: Missing
    assert results[3].level_no == 4
    assert results[3].status == "FAIL"
    assert results[3].flag == "MISSING"
