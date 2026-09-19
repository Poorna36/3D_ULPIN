"""
Integration Test for Vertical Parcel Delineation (H3) & End-to-End Batch Allocation
Conforms to docs/features.md, docs/aiml.md § 6.3, and Phase 7.8.
"""
import os
import tempfile
import pytest
from src.core.grammar import verify_check_symbol, compute_nk
from src.core.registry import RegistryStore
from src.identity.allocator import ULPIN3DAllocator
from src.simulation.building_gen import generate_mz1_hero_tower
from src.ml.h3_delineation import H3Delineator, RoomAdjacencyGraph


def test_room_adjacency_and_delineation():
    # Simulate a level with 4 rooms: 2 belonging to Apartment 1, 1 to Apartment 2, 1 Corridor
    rooms = [
        # Apt 1 Living
        {"room_id": "R1_LIVING", "room_type": "UNIT", "polygon": [(0, 0), (6, 0), (6, 5), (0, 5)], "area_sqm": 30.0, "assigned_unit": "APT-101"},
        # Apt 1 Bedroom (adjacent to Living)
        {"room_id": "R1_BED", "room_type": "UNIT", "polygon": [(6, 0), (12, 0), (12, 5), (6, 5)], "area_sqm": 30.0, "assigned_unit": "APT-101"},
        # Apt 2 Studio
        {"room_id": "R2_STUDIO", "room_type": "UNIT", "polygon": [(0, 7), (12, 7), (12, 12), (0, 12)], "area_sqm": 60.0, "assigned_unit": "APT-102"},
        # Common Corridor separating Apt 1 and Apt 2
        {"room_id": "CORRIDOR", "room_type": "COMMON", "polygon": [(0, 5), (12, 5), (12, 7), (0, 7)], "area_sqm": 24.0, "assigned_unit": None}
    ]

    graph = RoomAdjacencyGraph(rooms)
    assert len(graph.nodes) == 4
    # Check shared wall detected between Living and Bed
    assert ("R1_LIVING", "R1_BED") in graph.adj_edges

    level_data = {
        "level_no": 1,
        "level_name": "Level_01",
        "z_bottom": 0.0,
        "height": 3.0,
        "rooms": rooms
    }

    proposed = H3Delineator.delineate_level(level_data, level_height=3.0, ground_elevation=10.0)
    # Living and Bed must be merged into 1 Unit, Studio is 1 Unit, Corridor is 1 Common
    assert len(proposed) == 3

    classes = [p.cls for p in proposed]
    assert classes.count("U") == 2
    assert classes.count("C") == 1

    # Verify each proposed unit mesh is watertight
    for p in proposed:
        assert p.mesh.is_watertight
        assert p.volume_m3 > 0.0


def test_full_building_dependency_ordered_allocation():
    tmp_base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".tmp"))
    os.makedirs(tmp_base, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=tmp_base) as tmpdir:
        db_path = os.path.join(tmpdir, "test_full_alloc.db")
        store = RegistryStore(db_path=db_path)
        allocator = ULPIN3DAllocator(store=store)

        # Generate MZ-1 Hero Tower
        tower = generate_mz1_hero_tower()

        # Batch allocate entire tower in dependency order (B -> L -> U/C/P -> A/T)
        results = H3Delineator.batch_allocate_building(
            allocator=allocator,
            parent_ulpin="MH2700010001AA",
            building_structure=tower,
            issuer_node_id="MH"
        )

        assert len(results) > 0

        allocated_rids = set()
        for label, res in results.items():
            rid = res.rid
            # 1. Zero duplicate RIDs
            assert rid not in allocated_rids, f"Duplicate RID generated: {rid}"
            allocated_rids.add(rid)

            # 2. Check symbol verification passes 100%
            assert verify_check_symbol(rid), f"Check symbol validation failed on {rid}"

            # 3. NK re-computation matches stored NK
            rec = store.resolve_rid(rid, include_geometry=True)
            assert rec is not None
            assert rec["current_nk"]["digest"] == res.nk_digest
            assert rec["current_nk"]["locator"] == res.nk_locator

            # 4. Hash-chain integrity
            lin = store.get_lineage(rid)
            assert lin["chain_integrity_valid"] is True
