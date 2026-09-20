"""
Data Provenance Ledger — ProvenanceRecord & LedgerStore
Conforms to docs/data.md § 2.1, docs/implementation_plan.md Phase 1.1-1.2.

Every data asset entering the pipeline must carry a ProvenanceRecord.
REAL + SYNTHETIC conflation is a hard violation caught in tests.
"""
from __future__ import annotations

import sqlite3
import json
from dataclasses import dataclass, asdict, field
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from contextlib import contextmanager

# -------------------------------------------------------------------
# Allowed provenance tags (must match objects table CHECK constraint)
# -------------------------------------------------------------------
VALID_PROVENANCE_TAGS = frozenset({
    "REAL",          # Sourced from an official Indian government dataset
    "PROXY",         # Derived / interpolated from a real anchor
    "SYNTHETIC",     # Entirely procedurally generated
    "REAL-FOREIGN",  # Real data from a foreign jurisdiction (e.g. AHN, SLA)
    "REAL-OWN",      # Real data we acquired or produced ourselves
})


@dataclass
class ProvenanceRecord:
    """
    Immutable data-lineage record attached to every ingested asset.
    Carries enough information to fully reconstruct provenance at audit time.
    """
    source_id: str                      # Unique ID for this asset (UUID or slug)
    file_path: str                      # Absolute or relative path on disk
    data_provenance: str                # VALID_PROVENANCE_TAGS member
    crs: str                            # CRS EPSG string, e.g. "EPSG:4326"
    datum: str                          # Geodetic datum, e.g. "WGS84", "Everest1830"
    resolution_m: Optional[float]       # Ground sampling distance in metres (None = N/A)
    accuracy_sigma_m: Optional[float]   # 1-sigma positional accuracy in metres
    license: str                        # SPDX licence identifier or "PROPRIETARY"
    download_ts: str                    # ISO-8601 timestamp of acquisition
    notes: str = ""                     # Free-text provenance note

    def __post_init__(self) -> None:
        if self.data_provenance not in VALID_PROVENANCE_TAGS:
            raise ValueError(
                f"Invalid provenance tag '{self.data_provenance}'. "
                f"Must be one of {sorted(VALID_PROVENANCE_TAGS)}."
            )

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class LedgerStore:
    """
    Append-only SQLite-backed provenance ledger.
    Every asset read through GISReader / LidarReader / IFCReader must
    call ledger.log() before the data is passed downstream.

    The ledger enforces:
      - No REAL + SYNTHETIC conflation (enforced at query time via tag validation)
      - Immutability (no UPDATE / DELETE SQL is ever issued)
    """

    def __init__(self, db_path: str = "provenance_ledger.db") -> None:
        self.db_path = db_path
        self._init_db()

    @contextmanager
    def _conn(self):
        conn = sqlite3.connect(self.db_path, timeout=30.0)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode = WAL;")
        conn.execute("PRAGMA synchronous = NORMAL;")
        try:
            yield conn
        finally:
            conn.close()

    def _init_db(self) -> None:
        with self._conn() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS provenance_ledger (
                    ledger_id    INTEGER PRIMARY KEY AUTOINCREMENT,
                    source_id    TEXT NOT NULL UNIQUE,
                    file_path    TEXT NOT NULL,
                    data_provenance TEXT NOT NULL CHECK(data_provenance IN (
                        'REAL','PROXY','SYNTHETIC','REAL-FOREIGN','REAL-OWN'
                    )),
                    crs          TEXT NOT NULL,
                    datum        TEXT NOT NULL,
                    resolution_m REAL,
                    accuracy_sigma_m REAL,
                    license      TEXT NOT NULL,
                    download_ts  TEXT NOT NULL,
                    notes        TEXT DEFAULT '',
                    logged_at    TEXT NOT NULL
                );
            """)
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_prov_tag ON provenance_ledger(data_provenance);"
            )
            conn.commit()

    def log(self, record: ProvenanceRecord) -> int:
        """Insert a ProvenanceRecord. Returns the assigned ledger_id."""
        logged_at = datetime.now(timezone.utc).isoformat()
        with self._conn() as conn:
            cur = conn.execute("""
                INSERT OR IGNORE INTO provenance_ledger (
                    source_id, file_path, data_provenance, crs, datum,
                    resolution_m, accuracy_sigma_m, license, download_ts,
                    notes, logged_at
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?);
            """, (
                record.source_id, record.file_path, record.data_provenance,
                record.crs, record.datum, record.resolution_m,
                record.accuracy_sigma_m, record.license, record.download_ts,
                record.notes, logged_at
            ))
            conn.commit()
            # Return the ledger_id for the inserted (or pre-existing) row
            cur2 = conn.execute(
                "SELECT ledger_id FROM provenance_ledger WHERE source_id = ?;",
                (record.source_id,)
            )
            row = cur2.fetchone()
            return int(row["ledger_id"]) if row else -1

    def get(self, source_id: str) -> Optional[ProvenanceRecord]:
        """Retrieve a ProvenanceRecord by source_id."""
        with self._conn() as conn:
            row = conn.execute(
                "SELECT * FROM provenance_ledger WHERE source_id = ?;",
                (source_id,)
            ).fetchone()
        if not row:
            return None
        return ProvenanceRecord(
            source_id=row["source_id"],
            file_path=row["file_path"],
            data_provenance=row["data_provenance"],
            crs=row["crs"],
            datum=row["datum"],
            resolution_m=row["resolution_m"],
            accuracy_sigma_m=row["accuracy_sigma_m"],
            license=row["license"],
            download_ts=row["download_ts"],
            notes=row["notes"] or "",
        )

    def query_by_provenance(self, tag: str) -> List[ProvenanceRecord]:
        """
        Return all records matching a provenance tag.
        Primary use: verify REAL vs SYNTHETIC separation in tests.
        """
        if tag not in VALID_PROVENANCE_TAGS:
            raise ValueError(f"Unknown provenance tag '{tag}'.")
        with self._conn() as conn:
            rows = conn.execute(
                "SELECT * FROM provenance_ledger WHERE data_provenance = ?;",
                (tag,)
            ).fetchall()
        return [
            ProvenanceRecord(
                source_id=r["source_id"],
                file_path=r["file_path"],
                data_provenance=r["data_provenance"],
                crs=r["crs"],
                datum=r["datum"],
                resolution_m=r["resolution_m"],
                accuracy_sigma_m=r["accuracy_sigma_m"],
                license=r["license"],
                download_ts=r["download_ts"],
                notes=r["notes"] or "",
            )
            for r in rows
        ]

    def all_tagged(self) -> Dict[str, int]:
        """Returns count per provenance tag — used by the honesty pass audit."""
        with self._conn() as conn:
            rows = conn.execute(
                "SELECT data_provenance, COUNT(*) as cnt "
                "FROM provenance_ledger GROUP BY data_provenance;"
            ).fetchall()
        return {r["data_provenance"]: r["cnt"] for r in rows}

    def assert_no_conflation(self) -> None:
        """
        Hard assertion: no asset can be tagged both REAL and SYNTHETIC.
        The ledger is keyed on source_id (UNIQUE), so a source_id cannot
        appear twice with different tags — this assertion checks the tag
        distribution makes sense (non-zero REAL implies no SYNTHETIC
        sharing the same source_id, which the DB schema already enforces).

        We additionally assert that no file_path appears under both REAL
        and SYNTHETIC tags (real-world data accidentally relabeled).
        """
        with self._conn() as conn:
            rows = conn.execute("""
                SELECT file_path, COUNT(DISTINCT data_provenance) as tag_count
                FROM provenance_ledger
                WHERE data_provenance IN ('REAL', 'SYNTHETIC')
                GROUP BY file_path
                HAVING tag_count > 1;
            """).fetchall()
        if rows:
            conflicts = [r["file_path"] for r in rows]
            raise AssertionError(
                f"REAL + SYNTHETIC conflation detected on {len(conflicts)} "
                f"file path(s): {conflicts}"
            )
