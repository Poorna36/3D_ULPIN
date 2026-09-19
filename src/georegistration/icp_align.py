"""
Iterative Closest Point (ICP) Alignment and Residual Policy Engine
Conforms to docs/pipeline.md § 4.3 and docs/implementation_plan.md Phase 4.3 & 4.4.
"""
from enum import Enum
from dataclasses import dataclass
from typing import Tuple, Optional, Dict, Any
import numpy as np
from scipy.spatial import KDTree


class ICPStatus(str, Enum):
    PASS = "PASS"  # Median residual <= sigma_policy
    WARN = "WARN"  # sigma_policy < median residual <= 3 * sigma_policy
    FAIL = "FAIL"  # median residual > 3 * sigma_policy


@dataclass
class ICPResult:
    transformation_matrix: np.ndarray  # 4x4 rigid transformation [R | t]
    converged: bool
    iterations: int
    median_residual_m: float
    rmse_m: float
    status: ICPStatus
    details: Dict[str, Any]


class ICPAligner:
    """
    Point-to-point and point-to-plane ICP alignment of sensor point clouds
    or observed geometry to expected plan-derived models.
    """

    @staticmethod
    def best_fit_transform(A: np.ndarray, B: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Calculates least-squares rigid transformation [R, t] that maps points A to points B
        using Singular Value Decomposition (SVD / Kabsch algorithm).
        """
        assert A.shape == B.shape

        centroid_A = np.mean(A, axis=0)
        centroid_B = np.mean(B, axis=0)

        AA = A - centroid_A
        BB = B - centroid_B

        H = np.dot(AA.T, BB)
        U, S, Vt = np.linalg.svd(H)
        R = np.dot(Vt.T, U.T)

        # Special reflection case
        if np.linalg.det(R) < 0:
            Vt[2, :] *= -1
            R = np.dot(Vt.T, U.T)

        t = centroid_B - np.dot(R, centroid_A)
        return R, t

    @classmethod
    def align(
        cls,
        source_points: np.ndarray,
        target_points: np.ndarray,
        max_iterations: int = 50,
        tolerance: float = 1e-5,
        sigma_policy_m: float = 0.05,
        gcps: Optional[Tuple[np.ndarray, np.ndarray]] = None
    ) -> ICPResult:
        """
        Runs iterative closest point alignment from source to target.
        Applies post-ICP residual policy:
        - median <= sigma_policy => PASS
        - sigma_policy < median <= 3*sigma_policy => WARN
        - median > 3*sigma_policy => FAIL
        """
        src = np.copy(source_points)
        tree = KDTree(target_points)

        T_accum = np.eye(4)
        prev_error = float("inf")
        converged = False
        iteration = 0

        for i in range(max_iterations):
            iteration = i + 1
            # Find closest target points
            distances, indices = tree.query(src)
            matched_target = target_points[indices]

            # If GCPs are supplied, blend them as soft constraints
            if gcps is not None:
                src_gcp, tgt_gcp = gcps
                weight = 5.0
                src_combined = np.vstack([src, np.repeat(src_gcp, int(weight), axis=0)])
                tgt_combined = np.vstack([matched_target, np.repeat(tgt_gcp, int(weight), axis=0)])
            else:
                src_combined = src
                tgt_combined = matched_target

            # Compute rigid transform for this step
            R, t = cls.best_fit_transform(src_combined, tgt_combined)

            # Apply incremental transform
            src = np.dot(src, R.T) + t

            step_T = np.eye(4)
            step_T[:3, :3] = R
            step_T[:3, 3] = t
            T_accum = np.dot(step_T, T_accum)

            mean_error = float(np.mean(distances))
            if abs(prev_error - mean_error) < tolerance:
                converged = True
                break
            prev_error = mean_error

        # Final residual calculation
        final_distances, _ = tree.query(src)
        median_res = float(np.median(final_distances))
        rmse = float(np.sqrt(np.mean(final_distances ** 2)))

        # Evaluate residual policy (Phase 4.4)
        if median_res <= sigma_policy_m:
            status = ICPStatus.PASS
        elif median_res <= (3.0 * sigma_policy_m):
            status = ICPStatus.WARN
        else:
            status = ICPStatus.FAIL

        return ICPResult(
            transformation_matrix=T_accum,
            converged=converged,
            iterations=iteration,
            median_residual_m=round(median_res, 4),
            rmse_m=round(rmse, 4),
            status=status,
            details={
                "sigma_policy_m": sigma_policy_m,
                "point_count": len(source_points)
            }
        )
