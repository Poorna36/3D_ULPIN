"""
Integration Test for 3D ULPIN Cadastral Interoperability Roundtrip
Conforms to docs/features.md § 3.10 and Phase 9.9.

Validates that:
1. Units are allocated in the 3D ULPIN registry with valid RIDs.
2. Legal RRR records (Rights, Restrictions, Responsibilities) are bound.
3. Cadastral packages are exported to:
   - ISO 19152 (LADM Part 2 JSON-LD)
   - IFC 4.3 (BuildingSpace JSON)
   - CityJSON 1.1 (CityObjects BuildingUnit)
4. Re-importing extracted identifiers matches the exact original RIDs across all formats.
"""
import os
import tempfile
import trimesh
from backend.core.registry import RegistryStore
from backend.identity.allocator import ULPIN3DAllocator
from backend.simulation.building_gen import BuildingGenerator, BuildingStructure, GeneratedVolume
from backend.rights.rrr_model import RRRStore, Right, RightType, Restriction, RestrictionType, Responsibility, ResponsibilityType
from backend.rights.export import CadastralExporter


def test_cadastral_export_roundtrip_preserves_rids():
    tmp_base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".tmp"))
    os.makedirs(tmp_base, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=tmp_base) as tmpdir:
        reg_db = os.path.join(tmpdir, "registry.db")
        rrr_db = os.path.join(tmpdir, "rrr.db")
        
        reg_store = RegistryStore(db_path=reg_db)
        rrr_store = RRRStore(db_path=rrr_db)
        allocator = ULPIN3DAllocator(store=reg_store)

        # 1. Allocate real units using ULPIN3DAllocator
        mesh_u1 = trimesh.creation.box(extents=[10.0, 10.0, 3.0])
        mesh_u2 = trimesh.creation.box(extents=[10.0, 10.0, 3.0])
        mesh_u2.apply_translation([10.0, 0.0, 0.0])

        alloc_u1 = allocator.allocate(
            ulpin14="MH2700010001AA",
            cls="U",
            mesh=mesh_u1,
            bld_seq="B0001",
            issuer_node_id="MH"
        )
        alloc_u2 = allocator.allocate(
            ulpin14="MH2700010001AA",
            cls="U",
            mesh=mesh_u2,
            bld_seq="B0001",
            issuer_node_id="MH"
        )

        rid1 = alloc_u1.rid
        rid2 = alloc_u2.rid
        assert rid1 != rid2

        # 2. Bind Rights
        r1 = Right(
            right_id="RIGHT-001",
            rid=rid1,
            right_type=RightType.OWNERSHIP,
            holder_pseudonym="CITIZEN-ALPHA-77",
            uds_fraction=0.500,
            legal_basis_status="ENACTED",
            legal_act_ref="Maharashtra Apartment Ownership Act 1970 § 5",
            valid_from="2026-09-20T00:00:00Z"
        )
        r2 = Right(
            right_id="RIGHT-002",
            rid=rid2,
            right_type=RightType.OWNERSHIP,
            holder_pseudonym="CITIZEN-BETA-88",
            uds_fraction=0.500,
            legal_basis_status="ENACTED",
            legal_act_ref="Maharashtra Apartment Ownership Act 1970 § 5",
            valid_from="2026-09-20T00:00:00Z"
        )
        rrr_store.insert_right(r1)
        rrr_store.insert_right(r2)

        # 3. Construct building structure holding these allocated volumes
        v1 = GeneratedVolume(
            label=rid1,
            cls="U",
            mesh=mesh_u1,
            z_min=0.0,
            z_max=3.0,
            volume=float(mesh_u1.volume)
        )
        v2 = GeneratedVolume(
            label=rid2,
            cls="U",
            mesh=mesh_u2,
            z_min=0.0,
            z_max=3.0,
            volume=float(mesh_u2.volume)
        )
        building = BuildingStructure(
            name="MZ1-Hero-Tower",
            zone="Worli, Mumbai",
            floor_count=1,
            height=3.0,
            ground_elevation=12.5,
            volumes=[v1, v2]
        )

        # 4. Export to LADM, IFC, CityJSON
        ladm_doc = CadastralExporter.export_ladm_json(building, [r1, r2])
        ifc_doc = CadastralExporter.export_ifc_json(building)
        cityjson_doc = CadastralExporter.export_cityjson(building)

        # 5. Re-import / parse RIDs and verify exact preservation
        reimported_ladm = CadastralExporter.parse_ladm_rids(ladm_doc)
        reimported_ifc = CadastralExporter.parse_ifc_rids(ifc_doc)
        reimported_cityjson = CadastralExporter.parse_cityjson_rids(cityjson_doc)

        expected_rids = {rid1, rid2}
        assert set(reimported_ladm) == expected_rids, f"LADM failed roundtrip: {reimported_ladm}"
        assert set(reimported_ifc) == expected_rids, f"IFC failed roundtrip: {reimported_ifc}"
        assert set(reimported_cityjson) == expected_rids, f"CityJSON failed roundtrip: {reimported_cityjson}"

        # Verify rights linkage in LADM
        assert len(ladm_doc["rights"]) == 2
        assert ladm_doc["rights"][0]["target_rid"] == rid1
        assert ladm_doc["rights"][1]["target_rid"] == rid2
