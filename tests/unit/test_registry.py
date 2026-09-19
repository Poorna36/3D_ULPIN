"""
Unit Tests for SQLite WAL Registry and SHA-256 Hash Chaining
Conforms to docs/features.md § 3.2 and docs/implementation_plan.md Phase 2D.
"""
import pytest
import os
import tempfile
import json
from src.core.registry import RegistryStore, GENESIS_HASH


@pytest.fixture
def temp_store():
    tmp_base = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".tmp"))
    os.makedirs(tmp_base, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=tmp_base) as tmpdir:
        db_path = os.path.join(tmpdir, "test_registry.db")
        store = RegistryStore(db_path=db_path)
        yield store


def test_insert_and_resolve_object(temp_store):
    rid = "SYNTHETIC0001A-B0004-U0A3F1-2"
    temp_store.insert_object(
        rid=rid,
        cls="U",
        ulpin14="SYNTHETIC0001A",
        bld_seq="B0004",
        seq="0A3F1",
        issuer_node_id="MH",
        data_provenance="SYNTHETIC",
        parent_rid="SYNTHETIC0001A-B0004-B00000-5",
        status="ALLOCATED"
    )

    res = temp_store.resolve_rid(rid)
    assert res is not None
    assert res["rid"] == rid
    assert res["cls"] == "U"
    assert res["status"] == "ALLOCATED"
    assert res["issuer_node_id"] == "MH"


def test_append_binding_versions_and_hash_chain(temp_store):
    rid = "SYNTHETIC0001A-B0004-U0A3F1-2"
    temp_store.insert_object(
        rid=rid,
        cls="U",
        ulpin14="SYNTHETIC0001A",
        bld_seq="B0004",
        seq="0A3F1",
        issuer_node_id="MH",
        data_provenance="SYNTHETIC"
    )

    # Append Version 1
    v1 = temp_store.append_binding_version(
        rid=rid,
        nk_digest="DIGEST1234567890",
        nk_locator="M3D0000000000001",
        sa_cover=["SA-10M-001"],
        geometry_json=json.dumps({"type": "box", "volume": 100.0}),
        plan_version="V1.0",
        evidence_class="E3"
    )
    assert v1.version_num == 1
    assert v1.prev_hash == GENESIS_HASH

    # Append Version 2
    v2 = temp_store.append_binding_version(
        rid=rid,
        nk_digest="DIGEST9876543210",
        nk_locator="M3D0000000000002",
        sa_cover=["SA-10M-002"],
        geometry_json=json.dumps({"type": "box", "volume": 105.0}),
        plan_version="V2.0",
        evidence_class="E4"
    )
    assert v2.version_num == 2
    assert v2.prev_hash == v1.this_hash

    # Verify Lineage and Chain Integrity
    lineage = temp_store.get_lineage(rid)
    assert lineage["version_count"] == 2
    assert lineage["chain_integrity_valid"] is True
