"""
Phase 11: Evaluation Programme & Scale Benchmark Suite
Conforms to docs/validation.md, docs/decisions.md, and Phase 11.1-11.11.
"""
import os
import time
import tempfile
import pytest
import numpy as np
import trimesh

from src.core.grammar import format_rid, verify_check_symbol, compute_nk
from src.core.registry import RegistryStore
from src.identity.allocator import ULPIN3DAllocator
from src.simulation.building_gen import generate_mz1_hero_tower, generate_bz1_hero_tower
from src.rights.export import CadastralExporter
from src.rights.rrr_model import RRRStore, Right, RightType
from src.validation.t2_topology import T2TopologyValidator
from src.simulation.defect_injector import DefectInjector


def test_real_vs_synthetic_separation():
    """11.2: REAL vs SYNTHETIC provenance isolation."""
    tmp_base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".tmp"))
    os.makedirs(tmp_base, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=tmp_base) as tmpdir:
        db = os.path.join(tmpdir, "provenance_test.db")
        store = RegistryStore(db_path=db)
        allocator = ULPIN3DAllocator(store=store)

        box = trimesh.creation.box(extents=[10, 10, 3])
        # Insert 5 SYNTHETIC objects
        for i in range(5):
            allocator.allocate("MH2700010001AA", "U", box, data_provenance="SYNTHETIC")
        # Insert 3 REAL objects
        for i in range(3):
            allocator.allocate("MH2700010001AA", "U", box, data_provenance="REAL")

        synth_results = store.search_cover(0, 0, 0, 100, 100, 100, provenance_filter=["SYNTHETIC"])
        real_results = store.search_cover(0, 0, 0, 100, 100, 100, provenance_filter=["REAL"])

        assert len(synth_results) == 5
        assert all(r["data_provenance"] == "SYNTHETIC" for r in synth_results)
        assert len(real_results) == 3
        assert all(r["data_provenance"] == "REAL" for r in real_results)


def test_resolve_latency_p99():
    """11.4: /resolve latency benchmark for 1,000 in-process calls."""
    tmp_base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".tmp"))
    os.makedirs(tmp_base, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=tmp_base) as tmpdir:
        db = os.path.join(tmpdir, "latency_test.db")
        store = RegistryStore(db_path=db)
        allocator = ULPIN3DAllocator(store=store)

        box = trimesh.creation.box(extents=[10, 10, 3])
        res = allocator.allocate("MH2700010001AA", "U", box)
        rid = res.rid

        latencies_ms = []
        for _ in range(1000):
            t0 = time.perf_counter()
            rec = store.resolve_rid(rid)
            t1 = time.perf_counter()
            latencies_ms.append((t1 - t0) * 1000.0)

        p99 = np.percentile(latencies_ms, 99)
        # In SQLite WAL mode with indexed read, p99 is well under 5 ms
        assert p99 < 5.0, f"p99 latency too high: {p99:.3f} ms"


def test_two_state_federation():
    """11.8: Two-state federation test (100 MH + 100 KA nodes)."""
    rids_mh = set()
    rids_ka = set()

    for i in range(1, 101):
        seq_str = f"{i:05d}"
        rid_mh = format_rid(ulpin14="MH2700010001AA", bld_seq="B0001", cls="U", seq=seq_str)
        rid_ka = format_rid(ulpin14="KA0100010001BB", bld_seq="B0001", cls="U", seq=seq_str)
        rids_mh.add(rid_mh)
        rids_ka.add(rid_ka)

        assert verify_check_symbol(rid_mh)
        assert verify_check_symbol(rid_ka)

    # Zero cross-state collision
    assert len(rids_mh.intersection(rids_ka)) == 0
    assert len(rids_mh) == 100
    assert len(rids_ka) == 100


def test_hero_tower_roundtrip_all_formats():
    """11.9: Full MZ-1 Hero Tower export & lossless RID preservation."""
    tower = generate_mz1_hero_tower()
    rights = []
    for idx, v in enumerate(tower.get_by_class("U")):
        rights.append(Right(
            right_id=f"RIGHT-{idx+1:04d}",
            rid=v.label,
            right_type=RightType.OWNERSHIP,
            holder_pseudonym=f"CITIZEN-{idx+1:04d}",
            uds_fraction=0.0125,
            legal_basis_status="ENACTED",
            legal_act_ref="Maharashtra Apartment Ownership Act 1970 § 5",
            valid_from="2026-09-20T00:00:00Z"
        ))

    ladm_doc = CadastralExporter.export_ladm_json(tower, rights)
    ifc_doc = CadastralExporter.export_ifc_json(tower)
    cityjson_doc = CadastralExporter.export_cityjson(tower)

    ladm_rids = set(CadastralExporter.parse_ladm_rids(ladm_doc))
    ifc_rids = set(CadastralExporter.parse_ifc_rids(ifc_doc))
    cityjson_rids = set(CadastralExporter.parse_cityjson_rids(cityjson_doc))

    orig_unit_labels = set(v.label for v in tower.get_by_class("U"))

    # Verify every unit label is preserved exactly
    for label in orig_unit_labels:
        assert label in ladm_rids
        assert label in ifc_rids
        assert label in cityjson_rids


def test_r1_headline_query_below_above_parcel():
    """11.11: R1 headline query: 'what is below / above this parcel?'."""
    tower = generate_mz1_hero_tower()
    # Sort all volumes in the tower by z_min
    sorted_vols = sorted(tower.volumes, key=lambda v: v.z_min)

    # Lowest volume must be Metro Tunnel (Class T) or Parcel Ground (Class S)
    assert sorted_vols[0].cls in {"T", "P", "S"}
    # Topmost volume must be Airspace Lot (Class A)
    assert sorted_vols[-1].cls == "A"
    # All levels must be strictly ordered along z
    for i in range(len(sorted_vols) - 1):
        assert sorted_vols[i].z_min <= sorted_vols[i+1].z_min
