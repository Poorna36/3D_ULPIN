"""
SQLite WAL 3D ULPIN Registry with Cryptographic SHA-256 Hash Chaining
Conforms to docs/features.md § 3.2, docs/contracts.md, and docs/implementation_plan.md Phase 2D.
"""
import sqlite3
import hashlib
import json
from datetime import datetime, timezone
from dataclasses import dataclass, asdict
from typing import Optional, List, Dict, Any, Tuple
import os
from contextlib import contextmanager
import numpy as np

GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"


@dataclass
class ObjectRecord:
    rid: str
    cls: str
    ulpin14: str
    bld_seq: str
    seq: str
    parent_rid: Optional[str]
    issuer_node_id: str
    birth_ts: str
    status: str
    data_provenance: str
    legal_basis_status: str
    jurisdiction: str = "IN_MH"


@dataclass
class BindingVersion:
    version_id: int
    rid: str
    version_num: int
    nk_digest: str
    nk_locator: str
    sa_json: str
    geometry_json: str
    plan_version: str
    evidence_class: str
    sigma_json: str
    sign_off: Optional[str]
    prev_hash: str
    this_hash: str
    created_at: str
    sanctioned_carpet_area_sqm: Optional[float] = None


class RegistryStore:
    def __init__(self, db_path: str = "registry.db"):
        self.db_path = db_path
        self._init_db()

    @contextmanager
    def _get_connection(self):
        conn = sqlite3.connect(self.db_path, timeout=30.0)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode = WAL;")
        conn.execute("PRAGMA synchronous = NORMAL;")
        conn.execute("PRAGMA foreign_keys = ON;")
        try:
            yield conn
        finally:
            conn.close()

    def _init_db(self) -> None:
        with self._get_connection() as conn:
            cursor = conn.cursor()

            # 1. Objects table (Persistent identity)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS objects (
                    rid TEXT PRIMARY KEY,
                    cls TEXT NOT NULL,
                    ulpin14 TEXT NOT NULL,
                    bld_seq TEXT NOT NULL,
                    seq TEXT NOT NULL,
                    parent_rid TEXT,
                    issuer_node_id TEXT NOT NULL,
                    birth_ts TEXT NOT NULL,
                    status TEXT NOT NULL CHECK(status IN (
                        'ALLOCATED', 'ACTIVE', 'REVISED', 'SUPERSEDED',
                        'MERGED', 'SPLIT', 'DEMOLISHED', 'DISPUTED'
                    )),
                    data_provenance TEXT NOT NULL CHECK(data_provenance IN (
                        'REAL', 'PROXY', 'SYNTHETIC', 'REAL-FOREIGN', 'REAL-OWN'
                    )),
                    legal_basis_status TEXT DEFAULT 'ASSUMED',
                    jurisdiction TEXT DEFAULT 'IN_MH'
                );
            """)

            try:
                cursor.execute("ALTER TABLE objects ADD COLUMN jurisdiction TEXT DEFAULT 'IN_MH';")
            except Exception:
                pass

            # 2. Binding versions table (Immutable hash-chained versions)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS binding_versions (
                    version_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    rid TEXT NOT NULL REFERENCES objects(rid),
                    version_num INTEGER NOT NULL,
                    nk_digest TEXT NOT NULL,
                    nk_locator TEXT NOT NULL,
                    sa_json TEXT NOT NULL,
                    geometry_json TEXT NOT NULL,
                    plan_version TEXT NOT NULL,
                    evidence_class TEXT NOT NULL,
                    sigma_json TEXT DEFAULT '{}',
                    sign_off TEXT,
                    prev_hash TEXT NOT NULL,
                    this_hash TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    min_x REAL,
                    min_y REAL,
                    min_z REAL,
                    max_x REAL,
                    max_y REAL,
                    max_z REAL,
                    sanctioned_carpet_area_sqm REAL,
                    UNIQUE(rid, version_num)
                );
            """)

            # Migrate existing tables if columns missing
            for col in ["min_x", "min_y", "min_z", "max_x", "max_y", "max_z", "sanctioned_carpet_area_sqm"]:
                try:
                    cursor.execute(f"ALTER TABLE binding_versions ADD COLUMN {col} REAL;")
                except Exception:
                    pass

            # 3. Audit log (Append-only hash-chained action ledger)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS audit_log (
                    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    rid TEXT NOT NULL,
                    action TEXT NOT NULL,
                    actor TEXT NOT NULL,
                    finding_id TEXT,
                    payload_json TEXT NOT NULL,
                    prev_hash TEXT NOT NULL,
                    this_hash TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );
            """)

            # 4. Spans (Multi-parcel relationships for corridors/tunnels)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS spans (
                    span_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    rid TEXT NOT NULL REFERENCES objects(rid),
                    spanned_ulpin TEXT NOT NULL
                );
            """)

            # 5. Lineage edges (Split/Merge/Supersede tracking)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS lineage_edges (
                    edge_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    source_rid TEXT NOT NULL,
                    target_rid TEXT NOT NULL,
                    edge_type TEXT NOT NULL CHECK(edge_type IN ('SUPERSEDES', 'SPLIT_FROM', 'MERGED_INTO', 'CHILD_OF')),
                    created_at TEXT NOT NULL
                );
            """)

            # 6. Legacy Identifier Crosswalk (Phase 12B)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS legacy_index (
                    id_system TEXT NOT NULL,
                    legacy_value TEXT NOT NULL,
                    rid TEXT NOT NULL REFERENCES objects(rid),
                    created_at TEXT NOT NULL,
                    PRIMARY KEY (id_system, legacy_value)
                );
            """)

            # Indices for sub-millisecond lookups
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_objects_ulpin14 ON objects(ulpin14);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_binding_rid ON binding_versions(rid);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_audit_rid ON audit_log(rid);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_lineage_src ON lineage_edges(source_rid);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_lineage_tgt ON lineage_edges(target_rid);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_legacy_rid ON legacy_index(rid);")

            # 7. SQLite Native R*Tree Spatial Virtual Table (O(log N) 3D bounding box queries)
            cursor.execute("""
                CREATE VIRTUAL TABLE IF NOT EXISTS spatial_index USING rtree(
                    version_id,
                    min_x, max_x,
                    min_y, max_y,
                    min_z, max_z
                );
            """)

            # Backfill any existing records
            cursor.execute("""
                INSERT OR IGNORE INTO spatial_index (version_id, min_x, max_x, min_y, max_y, min_z, max_z)
                SELECT version_id, min_x, max_x, min_y, max_y, min_z, max_z
                FROM binding_versions
                WHERE min_x IS NOT NULL AND max_x IS NOT NULL;
            """)
            conn.commit()

    # --------------------------------------------------------------------------
    # Insert & Versioning
    # --------------------------------------------------------------------------

    def insert_object(
        self,
        rid: str,
        cls: str,
        ulpin14: str,
        bld_seq: str,
        seq: str,
        issuer_node_id: str,
        data_provenance: str,
        parent_rid: Optional[str] = None,
        status: str = "ALLOCATED",
        legal_basis_status: str = "ASSUMED",
        spans: Optional[List[str]] = None,
        jurisdiction: str = "IN_MH",
    ) -> None:
        birth_ts = datetime.now(timezone.utc).isoformat()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO objects (
                    rid, cls, ulpin14, bld_seq, seq, parent_rid,
                    issuer_node_id, birth_ts, status, data_provenance, legal_basis_status, jurisdiction
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                rid, cls, ulpin14, bld_seq, seq, parent_rid,
                issuer_node_id, birth_ts, status, data_provenance, legal_basis_status, jurisdiction
            ))

            if spans:
                for sp in spans:
                    cursor.execute("INSERT INTO spans (rid, spanned_ulpin) VALUES (?, ?);", (rid, sp))

            conn.commit()

    def append_binding_version(
        self,
        rid: str,
        nk_digest: str,
        nk_locator: str,
        sa_cover: List[str],
        geometry_json: str,
        plan_version: str,
        evidence_class: str,
        sigma_dict: Optional[Dict[str, Any]] = None,
        sign_off: Optional[str] = None,
        sanctioned_carpet_area_sqm: Optional[float] = None,
    ) -> BindingVersion:
        created_at = datetime.now(timezone.utc).isoformat()
        sa_str = json.dumps(sa_cover)
        sigma_str = json.dumps(sigma_dict or {})

        with self._get_connection() as conn:
            cursor = conn.cursor()

            # Find previous version and previous hash
            cursor.execute("""
                SELECT version_num, this_hash FROM binding_versions
                WHERE rid = ? ORDER BY version_num DESC LIMIT 1;
            """, (rid,))
            last = cursor.fetchone()

            if last:
                next_version = last["version_num"] + 1
                prev_hash = last["this_hash"]
            else:
                next_version = 1
                prev_hash = GENESIS_HASH

            # Compute tamper-evident hash
            geom_hash = hashlib.sha256(geometry_json.encode("utf-8")).hexdigest()
            hash_payload = (
                f"{prev_hash}|{rid}|{next_version}|{nk_digest}|{nk_locator}|"
                f"{geom_hash}|{plan_version}|{evidence_class}|{created_at}"
            )
            this_hash = hashlib.sha256(hash_payload.encode("utf-8")).hexdigest()

            # Extract bounding extents; convert to WGS84 lon/lat if 'origin' present
            min_x = min_y = min_z = max_x = max_y = max_z = None
            try:
                geom_data = json.loads(geometry_json) if isinstance(geometry_json, str) else geometry_json
                if isinstance(geom_data, dict) and "vertices" in geom_data and geom_data["vertices"]:
                    v_arr = np.array(geom_data["vertices"], dtype=np.float64)
                    if v_arr.ndim == 2 and v_arr.shape[1] >= 3:
                        b_min = v_arr.min(axis=0)
                        b_max = v_arr.max(axis=0)
                        origin = geom_data.get("origin")  # [lon, lat, elev_msl_m]
                        if origin and len(origin) == 3:
                            import math
                            o_lon, o_lat, _o_elev = float(origin[0]), float(origin[1]), float(origin[2])
                            # Approximate metric→degree conversion at anchor latitude
                            m_per_deg_lon = 111320.0 * math.cos(math.radians(o_lat))
                            m_per_deg_lat = 110540.0
                            # x-axis (local east-west metres) → longitude degrees
                            min_x = round(o_lon + float(b_min[0]) / m_per_deg_lon, 8)
                            max_x = round(o_lon + float(b_max[0]) / m_per_deg_lon, 8)
                            # y-axis (local north-south metres) → latitude degrees
                            min_y = round(o_lat + float(b_min[1]) / m_per_deg_lat, 8)
                            max_y = round(o_lat + float(b_max[1]) / m_per_deg_lat, 8)
                            # z-axis stays in metres MSL (already absolute)
                            min_z = float(b_min[2])
                            max_z = float(b_max[2])
                        else:
                            # Legacy: store local metric coords as-is
                            min_x, min_y, min_z = float(b_min[0]), float(b_min[1]), float(b_min[2])
                            max_x, max_y, max_z = float(b_max[0]), float(b_max[1]), float(b_max[2])
            except Exception:
                pass

            cursor.execute("""
                INSERT INTO binding_versions (
                    rid, version_num, nk_digest, nk_locator, sa_json,
                    geometry_json, plan_version, evidence_class, sigma_json,
                    sign_off, prev_hash, this_hash, created_at,
                    min_x, min_y, min_z, max_x, max_y, max_z,
                    sanctioned_carpet_area_sqm
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                rid, next_version, nk_digest, nk_locator, sa_str,
                geometry_json, plan_version, evidence_class, sigma_str,
                sign_off, prev_hash, this_hash, created_at,
                min_x, min_y, min_z, max_x, max_y, max_z,
                sanctioned_carpet_area_sqm
            ))

            # Update object status to ACTIVE if it was ALLOCATED
            cursor.execute("""
                UPDATE objects SET status = 'ACTIVE' WHERE rid = ? AND status = 'ALLOCATED';
            """, (rid,))

            version_id = cursor.lastrowid

            # Index into SQLite Native R*Tree
            if min_x is not None and max_x is not None:
                cursor.execute("""
                    INSERT OR REPLACE INTO spatial_index (version_id, min_x, max_x, min_y, max_y, min_z, max_z)
                    VALUES (?, ?, ?, ?, ?, ?, ?);
                """, (version_id, min_x, max_x, min_y, max_y, min_z, max_z))

            conn.commit()

            return BindingVersion(
                version_id=version_id,
                rid=rid,
                version_num=next_version,
                nk_digest=nk_digest,
                nk_locator=nk_locator,
                sa_json=sa_str,
                geometry_json=geometry_json,
                plan_version=plan_version,
                evidence_class=evidence_class,
                sigma_json=sigma_str,
                sign_off=sign_off,
                prev_hash=prev_hash,
                this_hash=this_hash,
                created_at=created_at,
                sanctioned_carpet_area_sqm=sanctioned_carpet_area_sqm,
            )

    def insert_legacy_id(self, id_system: str, legacy_value: str, rid: str) -> None:
        """Stamp a legacy parcel identifier (CTS, e-PID, UPOR) linked to an RID (Phase 12B)."""
        created_at = datetime.now(timezone.utc).isoformat()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO legacy_index (id_system, legacy_value, rid, created_at)
                VALUES (?, ?, ?, ?);
            """, (id_system, legacy_value, rid, created_at))
            conn.commit()

    def resolve_by_legacy(self, id_system: str, legacy_value: str) -> Optional[str]:
        """Crosswalk from legacy identifier to canonical 3D ULPIN RID (Phase 12B)."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT rid FROM legacy_index
                WHERE id_system = ? AND legacy_value = ?;
            """, (id_system, legacy_value))
            row = cursor.fetchone()
            return row["rid"] if row else None

    def get_legacy_ids_for_rid(self, rid: str) -> List[Dict[str, str]]:
        """Return all stamped legacy identifiers for a given RID."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id_system, legacy_value FROM legacy_index
                WHERE rid = ?;
            """, (rid,))
            rows = cursor.fetchall()
            return [{"id_system": r["id_system"], "legacy_value": r["legacy_value"]} for r in rows]

    def append_audit_log(
        self,
        rid: str,
        action: str,
        actor: str,
        payload: Dict[str, Any],
        finding_id: Optional[str] = None
    ) -> str:
        created_at = datetime.now(timezone.utc).isoformat()
        payload_json = json.dumps(payload, sort_keys=True)

        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT this_hash FROM audit_log ORDER BY log_id DESC LIMIT 1;")
            last = cursor.fetchone()
            prev_hash = last["this_hash"] if last else GENESIS_HASH

            hash_payload = f"{prev_hash}|{rid}|{action}|{actor}|{payload_json}|{created_at}"
            this_hash = hashlib.sha256(hash_payload.encode("utf-8")).hexdigest()

            cursor.execute("""
                INSERT INTO audit_log (
                    rid, action, actor, finding_id, payload_json,
                    prev_hash, this_hash, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                rid, action, actor, finding_id, payload_json,
                prev_hash, this_hash, created_at
            ))
            conn.commit()
            return this_hash

    # --------------------------------------------------------------------------
    # Resolution & Lineage
    # --------------------------------------------------------------------------

    def resolve_rid(self, rid: str, include_geometry: bool = False) -> Optional[Dict[str, Any]]:
        """Resolves RID state (sub-millisecond indexed read)."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM objects WHERE rid = ?;", (rid,))
            obj = cursor.fetchone()
            if not obj:
                return None

            cursor.execute("""
                SELECT * FROM binding_versions WHERE rid = ? ORDER BY version_num DESC LIMIT 1;
            """, (rid,))
            b_ver = cursor.fetchone()

            cursor.execute("SELECT spanned_ulpin FROM spans WHERE rid = ?;", (rid,))
            spans = [r["spanned_ulpin"] for r in cursor.fetchall()]

            cursor.execute("SELECT id_system, legacy_value FROM legacy_index WHERE rid = ?;", (rid,))
            legacy_ids = [{"id_system": r["id_system"], "legacy_value": r["legacy_value"]} for r in cursor.fetchall()]

            res = {
                "rid": obj["rid"],
                "cls": obj["cls"],
                "status": obj["status"],
                "parent_rid": obj["parent_rid"],
                "parent_ulpin": obj["ulpin14"],
                "current_parcel_ulpin": obj["ulpin14"],
                "issuer_node_id": obj["issuer_node_id"],
                "birth_ts": obj["birth_ts"],
                "data_provenance": obj["data_provenance"],
                "legal_basis_status": obj["legal_basis_status"],
                "jurisdiction": obj["jurisdiction"] if "jurisdiction" in obj.keys() and obj["jurisdiction"] else "IN_MH",
                "legacy_ids": legacy_ids,
                "spans": spans,
                "current_nk": {
                    "digest": b_ver["nk_digest"] if b_ver else None,
                    "locator": b_ver["nk_locator"] if b_ver else None,
                    "version": b_ver["version_num"] if b_ver else 0
                }
            }

            if b_ver and "sanctioned_carpet_area_sqm" in b_ver.keys() and b_ver["sanctioned_carpet_area_sqm"] is not None:
                res["sanctioned_carpet_area_sqm"] = float(b_ver["sanctioned_carpet_area_sqm"])

            if include_geometry and b_ver:
                res["geometry"] = json.loads(b_ver["geometry_json"])
                res["sa_cover"] = json.loads(b_ver["sa_json"])

            return res

    def get_lineage(self, rid: str) -> Dict[str, Any]:
        """Returns all versions for an RID and verifies hash-chain integrity."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM binding_versions WHERE rid = ? ORDER BY version_num ASC;
            """, (rid,))
            rows = cursor.fetchall()

            versions = []
            chain_valid = True
            expected_prev = GENESIS_HASH

            for r in rows:
                geom_hash = hashlib.sha256(r["geometry_json"].encode("utf-8")).hexdigest()
                payload = (
                    f"{r['prev_hash']}|{r['rid']}|{r['version_num']}|{r['nk_digest']}|{r['nk_locator']}|"
                    f"{geom_hash}|{r['plan_version']}|{r['evidence_class']}|{r['created_at']}"
                )
                computed_hash = hashlib.sha256(payload.encode("utf-8")).hexdigest()

                if r["prev_hash"] != expected_prev or r["this_hash"] != computed_hash:
                    chain_valid = False

                expected_prev = r["this_hash"]
                versions.append({
                    "version_num": r["version_num"],
                    "nk_digest": r["nk_digest"],
                    "nk_locator": r["nk_locator"],
                    "plan_version": r["plan_version"],
                    "evidence_class": r["evidence_class"],
                    "this_hash": r["this_hash"],
                    "created_at": r["created_at"],
                })

            cursor.execute("""
                SELECT source_rid, target_rid, edge_type, created_at
                FROM lineage_edges
                WHERE source_rid = ? OR target_rid = ?
                ORDER BY edge_id ASC;
            """, (rid, rid))
            edge_rows = cursor.fetchall()
            lineage_edges = [{
                "source_rid": er["source_rid"],
                "target_rid": er["target_rid"],
                "edge_type": er["edge_type"],
                "created_at": er["created_at"]
            } for er in edge_rows]

            return {
                "rid": rid,
                "chain_integrity_valid": chain_valid,
                "version_count": len(versions),
                "versions": versions,
                "lineage_edges": lineage_edges
            }

    def insert_lineage_edge(self, source_rid: str, target_rid: str, edge_type: str) -> None:
        """Inserts an immutable lineage transition edge."""
        created_at = datetime.now(timezone.utc).isoformat()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO lineage_edges (source_rid, target_rid, edge_type, created_at)
                VALUES (?, ?, ?, ?);
            """, (source_rid, target_rid, edge_type, created_at))
            conn.commit()

    def append_audit_log(
        self,
        rid: str,
        action: str,
        actor: str,
        payload: Dict[str, Any],
        finding_id: Optional[str] = None
    ) -> str:
        """Appends an entry to the tamper-evident hash-chained audit log."""
        created_at = datetime.now(timezone.utc).isoformat()
        payload_json = json.dumps(payload, sort_keys=True)
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT this_hash FROM audit_log ORDER BY log_id DESC LIMIT 1;")
            last = cursor.fetchone()
            prev_hash = last["this_hash"] if last else GENESIS_HASH

            # Hash = SHA256(prev_hash | rid | action | actor | finding_id | payload_json | created_at)
            hash_payload = f"{prev_hash}|{rid}|{action}|{actor}|{finding_id or ''}|{payload_json}|{created_at}"
            this_hash = hashlib.sha256(hash_payload.encode("utf-8")).hexdigest()

            cursor.execute("""
                INSERT INTO audit_log (rid, action, actor, finding_id, payload_json, prev_hash, this_hash, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            """, (rid, action, actor, finding_id, payload_json, prev_hash, this_hash, created_at))
            conn.commit()
            return this_hash

    def get_audit_log_finding(self, finding_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves an ExplainObject audit log finding by finding_id."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM audit_log WHERE finding_id = ? LIMIT 1;", (finding_id,))
            row = cursor.fetchone()
            if not row:
                return None
            return {
                "log_id": row["log_id"],
                "rid": row["rid"],
                "action": row["action"],
                "actor": row["actor"],
                "finding_id": row["finding_id"],
                "payload": json.loads(row["payload_json"]),
                "this_hash": row["this_hash"],
                "created_at": row["created_at"]
            }

    def search_cover(
        self,
        min_lon: float, min_lat: float, min_h: float,
        max_lon: float, max_lat: float, max_h: float,
        cls_filter: Optional[List[str]] = None,
        provenance_filter: Optional[List[str]] = None,
        limit: int = 1000
    ) -> List[Dict[str, Any]]:
        """
        Spatial cover query returning objects matching 3D bounding box and attribute filters.
        """
        with self._get_connection() as conn:
            cursor = conn.cursor()
            query = """
                SELECT o.rid, o.cls, o.data_provenance, o.status, o.parent_rid, o.issuer_node_id,
                       o.jurisdiction, b.min_x, b.max_x, b.min_y, b.max_y, b.min_z, b.max_z
                FROM objects o
                JOIN binding_versions b ON o.rid = b.rid
                LEFT JOIN spatial_index s ON b.version_id = s.version_id
                WHERE (b.version_num = (
                    SELECT MAX(v.version_num) FROM binding_versions v WHERE v.rid = o.rid
                ))
            """
            params: List[Any] = []

            # 3D spatial intersection bounding box predicate using native R*Tree
            query += """
                AND (
                    s.version_id IS NULL OR (
                        s.max_x >= ? AND s.min_x <= ? AND
                        s.max_y >= ? AND s.min_y <= ? AND
                        s.max_z >= ? AND s.min_z <= ?
                    )
                )
            """
            params.extend([min_lon, max_lon, min_lat, max_lat, min_h, max_h])

            if cls_filter:
                placeholders = ",".join("?" for _ in cls_filter)
                query += f" AND o.cls IN ({placeholders})"
                params.extend(cls_filter)

            if provenance_filter:
                placeholders = ",".join("?" for _ in provenance_filter)
                query += f" AND o.data_provenance IN ({placeholders})"
                params.extend(provenance_filter)

            query += " LIMIT ?"
            params.append(limit)

            cursor.execute(query, tuple(params))
            rows = cursor.fetchall()
            results = []
            for r in rows:
                results.append({
                    "rid": r["rid"],
                    "cls": r["cls"],
                    "data_provenance": r["data_provenance"],
                    "status": r["status"],
                    "parent_rid": r["parent_rid"],
                    "issuer_node_id": r["issuer_node_id"],
                    "jurisdiction": r["jurisdiction"] if "jurisdiction" in r.keys() and r["jurisdiction"] else "IN_MH",
                    "min_x": r["min_x"] if "min_x" in r.keys() else None,
                    "max_x": r["max_x"] if "max_x" in r.keys() else None,
                    "min_y": r["min_y"] if "min_y" in r.keys() else None,
                    "max_y": r["max_y"] if "max_y" in r.keys() else None,
                    "min_z": r["min_z"] if "min_z" in r.keys() else None,
                    "max_z": r["max_z"] if "max_z" in r.keys() else None,
                })
            return results

    def get_max_sequence(self, ulpin14: str, bld_seq: str, cls: str) -> int:
        """Returns the total object count matching the scope for sequence persistence."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT COUNT(*) as cnt FROM objects WHERE ulpin14 = ? AND bld_seq = ? AND cls = ?;
            """, (ulpin14, bld_seq, cls))
            row = cursor.fetchone()
            return int(row["cnt"]) if row else 0
