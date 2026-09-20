"""
Survey of India (SoI) CORS Uncertainty & Error Budget Model
Conforms to docs/features.md, docs/pipeline.md, and Phase 4.1.
"""
from enum import Enum
from dataclasses import dataclass
from typing import Tuple
import numpy as np


class GNSSFixType(str, Enum):
    RTK = "RTK"                    # Real-Time Kinematic via SoI CORS network
    DGNSS = "DGNSS"                # Differential GNSS
    SINGLE_POINT = "SINGLE_POINT"  # Autonomous uncorrected GNSS


@dataclass
class CORSErrorBudget:
    fix_type: GNSSFixType
    baseline_length_km: float
    sigma_horizontal_m: float
    sigma_vertical_m: float
    covariance_matrix: np.ndarray


class CORSModel:
    """
    Evaluates positioning uncertainty based on Survey of India CORS network
    standards (>1,100 active stations nationwide).
    """

    @staticmethod
    def get_sigma(
        fix_type: GNSSFixType = GNSSFixType.RTK,
        baseline_length_km: float = 10.0
    ) -> CORSErrorBudget:
        """
        Computes 1-sigma horizontal and vertical positioning error (in meters):
        - RTK: sigma_h = 0.02m + 1 ppm * baseline, sigma_z = 0.03m + 1 ppm * baseline
        - DGNSS: sigma_h = 0.15m + 2 ppm * baseline, sigma_z = 0.25m + 2 ppm * baseline
        - SINGLE_POINT: nominal autonomous consumer GNSS
        """
        d_m = baseline_length_km * 1000.0

        if fix_type == GNSSFixType.RTK:
            sigma_h = 0.020 + (1e-6 * d_m)
            sigma_z = 0.030 + (1e-6 * d_m)
        elif fix_type == GNSSFixType.DGNSS:
            sigma_h = 0.150 + (2e-6 * d_m)
            sigma_z = 0.250 + (2e-6 * d_m)
        else:  # SINGLE_POINT
            sigma_h = 2.500
            sigma_z = 4.000

        # Construct 3x3 diagonal covariance matrix [sigma_x^2, sigma_y^2, sigma_z^2]
        # Horizontal error is split equally along X and Y
        sigma_xy = sigma_h / np.sqrt(2.0)
        cov = np.diag([sigma_xy ** 2, sigma_xy ** 2, sigma_z ** 2])

        return CORSErrorBudget(
            fix_type=fix_type,
            baseline_length_km=baseline_length_km,
            sigma_horizontal_m=round(float(sigma_h), 4),
            sigma_vertical_m=round(float(sigma_z), 4),
            covariance_matrix=cov
        )
