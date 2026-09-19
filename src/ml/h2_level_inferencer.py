"""
H2.2: Sensor-Side Level Inferencer & Viterbi DP Peak Alignment
Conforms to docs/pipeline.md § 4.4, docs/aiml.md § 6.2.2, and Phase 6C.
"""
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional, Tuple
import numpy as np
from scipy.signal import find_peaks


@dataclass
class CandidatePeak:
    z: float
    density: float
    n_points: int
    sigma: float = 0.05


@dataclass
class LevelInferenceResult:
    level_no: int
    z_expected: float
    z_observed: Optional[float]
    delta_z: Optional[float]
    sigma: float
    n_support: int
    evidence_class: str
    status: str  # PASS, WARN, FAIL, UNVERIFIABLE
    flag: str    # MATCH, SHIFTED, MISSING, EXTRA
    explanation: str


class LevelInferencer:
    """
    Sensor-side level inferencing using point cloud density histograms
    and Viterbi dynamic programming alignment against sanctioned floor plan levels.
    """

    @staticmethod
    def extract_peaks(
        cloud: np.ndarray,
        axis: int = 2,
        bin_size: float = 0.05,
        min_density: int = 10,
        prominence: Optional[float] = None
    ) -> List[CandidatePeak]:
        """
        Extracts candidate slab/level z-peaks from point cloud density histograms.
        """
        if len(cloud) == 0:
            return []

        z_vals = cloud[:, axis]
        z_min = np.min(z_vals)
        z_max = np.max(z_vals)

        if z_max <= z_min:
            return []

        # Pad bins so lowest and highest floor peaks have troughs on either side
        bins = np.arange(z_min - (bin_size * 3), z_max + (bin_size * 4), bin_size)
        counts, edges = np.histogram(z_vals, bins=bins)
        bin_centers = (edges[:-1] + edges[1:]) / 2.0

        # Find local maxima in histogram
        prom = prominence or (min_density * 0.5)
        peak_indices, properties = find_peaks(counts, height=min_density, prominence=prom)

        peaks: List[CandidatePeak] = []
        for idx in peak_indices:
            peak_z = float(bin_centers[idx])
            density = float(counts[idx])
            # Estimate sigma based on local peak width/variance
            local_mask = np.abs(z_vals - peak_z) <= (bin_size * 2.0)
            local_pts = z_vals[local_mask]
            n_pts = len(local_pts)
            sigma = float(np.std(local_pts)) if n_pts > 2 else bin_size
            sigma = max(0.02, min(0.15, sigma))

            peaks.append(CandidatePeak(
                z=round(peak_z, 3),
                density=density,
                n_points=n_pts,
                sigma=round(sigma, 3)
            ))

        # Sort peaks by elevation
        peaks.sort(key=lambda p: p.z)
        return peaks

    @staticmethod
    def viterbi_align(
        expected_z: List[float],
        candidate_peaks: List[CandidatePeak],
        sigma_h: float = 0.08,
        lambda_skip: float = 12.0,
        n_min: int = 15,
        sigma_max: float = 0.20,
        tau_policy: float = 0.25,
        evidence_class: str = "E2"
    ) -> List[LevelInferenceResult]:
        """
        Aligns detected z-peaks to expected plan levels using dynamic programming.
        Enforces strict sufficiency check: returns UNVERIFIABLE if support or uncertainty fails.
        """
        n_exp = len(expected_z)
        n_obs = len(candidate_peaks)

        # Cost matrix: DP[i, j] aligning first i expected levels with first j peaks
        # Initialize with large values
        dp = np.full((n_exp + 1, n_obs + 1), float("inf"))
        parent = np.full((n_exp + 1, n_obs + 1, 2), -1, dtype=int)

        dp[0, 0] = 0.0

        # Base penalties for unmatched peaks/levels
        for i in range(1, n_exp + 1):
            dp[i, 0] = dp[i - 1, 0] + lambda_skip
            parent[i, 0] = [i - 1, 0]

        for j in range(1, n_obs + 1):
            dp[0, j] = dp[0, j - 1] + (lambda_skip * 0.8)
            parent[0, j] = [0, j - 1]

        # DP Recurrence
        for i in range(1, n_exp + 1):
            z_e = expected_z[i - 1]
            for j in range(1, n_obs + 1):
                peak = candidate_peaks[j - 1]
                z_o = peak.z
                dz = abs(z_o - z_e)

                # Matching cost: quadratic Gaussian log-loss
                cost_match = (dz ** 2) / (2.0 * (sigma_h ** 2))

                # Options:
                # 1. Match expected i with observation j
                c1 = dp[i - 1, j - 1] + cost_match
                # 2. Skip expected level i (Missing in observations)
                c2 = dp[i - 1, j] + lambda_skip
                # 3. Skip observation j (Extra observation)
                c3 = dp[i, j - 1] + (lambda_skip * 0.8)

                min_c = min(c1, c2, c3)
                dp[i, j] = min_c

                if min_c == c1:
                    parent[i, j] = [i - 1, j - 1]
                elif min_c == c2:
                    parent[i, j] = [i - 1, j]
                else:
                    parent[i, j] = [i, j - 1]

        # Backtrack optimal alignment
        cur_i = n_exp
        cur_j = n_obs
        alignment_map: Dict[int, Optional[CandidatePeak]] = {idx: None for idx in range(n_exp)}

        while cur_i > 0 or cur_j > 0:
            pi, pj = parent[cur_i, cur_j]
            if pi == cur_i - 1 and pj == cur_j - 1:
                alignment_map[cur_i - 1] = candidate_peaks[cur_j - 1]
            cur_i, cur_j = pi, pj

        # Construct LevelInferenceResult records with strict sufficiency evaluation
        results: List[LevelInferenceResult] = []
        for idx in range(n_exp):
            z_e = round(float(expected_z[idx]), 3)
            matched = alignment_map[idx]

            if matched is None:
                results.append(LevelInferenceResult(
                    level_no=idx + 1,
                    z_expected=z_e,
                    z_observed=None,
                    delta_z=None,
                    sigma=0.0,
                    n_support=0,
                    evidence_class=evidence_class,
                    status="FAIL",
                    flag="MISSING",
                    explanation=f"Level {idx+1} expected at {z_e}m completely missing from sensor cues."
                ))
                continue

            z_o = round(float(matched.z), 3)
            dz = round(float(z_o - z_e), 3)
            abs_dz = abs(dz)
            sig = float(matched.sigma)
            n_pts = int(matched.n_points)

            # ------------------------------------------------------------------
            # Sufficiency check:
            # If n_support < n_min OR sigma > sigma_max => UNVERIFIABLE, not PASS
            # ------------------------------------------------------------------
            if n_pts < n_min or sig > sigma_max:
                results.append(LevelInferenceResult(
                    level_no=idx + 1,
                    z_expected=z_e,
                    z_observed=z_o,
                    delta_z=dz,
                    sigma=sig,
                    n_support=n_pts,
                    evidence_class=evidence_class,
                    status="UNVERIFIABLE",
                    flag="UNVERIFIABLE",
                    explanation=f"Insufficient sensor evidence: n_support={n_pts} (< {n_min}) or sigma={sig} (> {sigma_max})."
                ))
                continue

            sigma_c = np.sqrt(sigma_h ** 2 + sig ** 2)

            if abs_dz <= (2.0 * sigma_c):
                st = "PASS"
                flag = "MATCH"
                exp = f"Observed height {z_o}m strictly agrees with expected {z_e}m (dz={dz}m <= 2*sigma)."
            elif abs_dz <= max(3.0 * sigma_c, tau_policy):
                st = "WARN"
                flag = "SHIFTED"
                exp = f"Observed height {z_o}m slightly shifted (dz={dz}m) near policy threshold."
            else:
                st = "FAIL"
                flag = "SHIFTED"
                exp = f"Observed height {z_o}m severely shifted (dz={dz}m) exceeding tolerance."

            results.append(LevelInferenceResult(
                level_no=idx + 1,
                z_expected=z_e,
                z_observed=z_o,
                delta_z=dz,
                sigma=sig,
                n_support=n_pts,
                evidence_class=evidence_class,
                status=st,
                flag=flag,
                explanation=exp
            ))

        return results
