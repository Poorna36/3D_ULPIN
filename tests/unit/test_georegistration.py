"""
Unit Tests for Survey of India CORS Model, Datum Transforms, and Covariance Propagation
Conforms to docs/features.md, docs/pipeline.md, and Phase 4.
"""
import pytest
import numpy as np

from src.georegistration.cors_model import CORSModel, GNSSFixType
from src.georegistration.sigma_propagation import propagate_sigma, combined_sigma
from src.georegistration.datum_transform import DatumTransformer


def test_cors_model_uncertainty_scaling():
    """RTK and DGNSS error budgets must increase with distance from CORS base station."""
    close_rtk = CORSModel.get_sigma(GNSSFixType.RTK, baseline_length_km=5.0)
    far_rtk = CORSModel.get_sigma(GNSSFixType.RTK, baseline_length_km=50.0)

    assert far_rtk.sigma_horizontal_m > close_rtk.sigma_horizontal_m
    assert far_rtk.sigma_vertical_m > close_rtk.sigma_vertical_m
    assert close_rtk.covariance_matrix.shape == (3, 3)


def test_sigma_propagation_identity_jacobian():
    """An identity transformation matrix must preserve the input covariance matrix exactly."""
    sigma_in = np.diag([0.04, 0.04, 0.09])  # 20cm horizontal, 30cm vertical variance
    identity_j = np.eye(3)

    sigma_out = propagate_sigma(sigma_in, identity_j)
    np.testing.assert_allclose(sigma_out, sigma_in, rtol=1e-6)


def test_combined_sigma_quadrature():
    """Uncertainties in quadrature must satisfy sqrt(a^2 + b^2)."""
    comb = combined_sigma(0.03, 0.04)
    assert abs(comb - 0.05) < 1e-6


def test_datum_transform_roundtrip_accuracy():
    """WGS84 to UTM coordinate transform round-trip error must be < 1 cm."""
    # Nariman Point / Marine Drive, Mumbai
    mumbai_lon, mumbai_lat, elev = 72.8270, 18.9990, 8.5
    res = DatumTransformer.transform_point(
        x=mumbai_lon,
        y=mumbai_lat,
        z=elev,
        source_epsg="EPSG:4326",
        target_epsg="EPSG:32643"  # UTM 43N
    )

    assert res.target_coords[0] > 100000.0  # Reasonable Easting
    assert res.target_coords[1] > 2000000.0  # Reasonable Northing
    assert res.roundtrip_residual_m < 0.01, f"Roundtrip residual {res.roundtrip_residual_m}m exceeded 1cm!"


def test_icp_alignment_and_residual_policy():
    """ICP must align shifted point clouds and apply residual policy."""
    from src.georegistration.icp_align import ICPAligner, ICPStatus

    # Create target point cloud (random cube surface points)
    np.random.seed(42)
    target = np.random.uniform(low=0.0, high=10.0, size=(100, 3))

    # Source is slightly shifted and rotated
    R_small = np.array([
        [0.9998, -0.0175, 0.0],
        [0.0175, 0.9998, 0.0],
        [0.0, 0.0, 1.0]
    ])
    t_small = np.array([0.05, -0.03, 0.02])
    source = np.dot(target, R_small.T) + t_small

    res = ICPAligner.align(
        source_points=source,
        target_points=target,
        max_iterations=30,
        sigma_policy_m=0.05
    )

    assert res.converged is True
    assert res.median_residual_m < 0.05
    assert res.status == ICPStatus.PASS
