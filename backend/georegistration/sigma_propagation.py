"""
Jacobian Covariance Propagation & Uncertainty Combination
Conforms to docs/features.md, docs/pipeline.md, and Phase 4.5 & 4.6.
"""
from typing import Union, Tuple
import numpy as np


def propagate_sigma(
    cov_in: np.ndarray,
    jacobian: np.ndarray
) -> np.ndarray:
    """
    Propagates input covariance matrix Sigma_in through a linear/linearized transformation
    defined by Jacobian J:
    Sigma_out = J @ Sigma_in @ J.T
    """
    J = np.atleast_2d(jacobian)
    Sigma = np.atleast_2d(cov_in)

    if J.shape[1] != Sigma.shape[0]:
        raise ValueError(
            f"Jacobian column count ({J.shape[1]}) must match covariance dimensions ({Sigma.shape[0]})."
        )

    cov_out = J @ Sigma @ J.T
    return cov_out


def combined_sigma(
    sigma_expected: Union[float, np.ndarray],
    sigma_observed: Union[float, np.ndarray]
) -> float:
    """
    Combines expected plan uncertainty with observed sensor uncertainty in quadrature:
    sigma_combined = sqrt(sigma_expected^2 + sigma_observed^2)
    Used as epsilon_v tolerance in Tier-2 topological checks.
    """
    se = float(np.linalg.norm(sigma_expected)) if isinstance(sigma_expected, np.ndarray) else float(sigma_expected)
    so = float(np.linalg.norm(sigma_observed)) if isinstance(sigma_observed, np.ndarray) else float(sigma_observed)

    return float(np.sqrt(se ** 2 + so ** 2))
