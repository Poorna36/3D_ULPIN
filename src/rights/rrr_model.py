"""
India-Profiled LADM Part 2 Rights, Restrictions, and Responsibilities (RRR) Model
Conforms to docs/features.md § 3.5, docs/decisions.md, and Phase 9.1-9.5.
"""
from dataclasses import dataclass, field, asdict
from typing import List, Optional, Dict, Any
from enum import Enum
from contextlib import contextmanager
import sqlite3
import json

from src.core.grammar import get_statutory_anchor, StatutoryAnchor


def get_legal_basis_for_class(cls: str, jurisdiction: str = "IN_MH") -> tuple[str, str]:
    """
    Returns (legal_basis_status, legal_act_ref) from the unified statutory source of truth.
    Conforms to Phase 12A.4.
    """
    anchor = get_statutory_anchor(cls, jurisdiction)
    return anchor.statutory_basis, anchor.citation


class RightType(str, Enum):
    OWNERSHIP = "OWNERSHIP"          # Full statutory ownership (apartment title)
    LEASE = "LEASE"                  # 99-year / long-term commercial lease
    MORTGAGE = "MORTGAGE"            # Financial encumbrance
    EASEMENT = "EASEMENT"            # Right of way / utility corridor


class RestrictionType(str, Enum):
    SETBACK = "SETBACK"              # Compulsory open margin
    HEIGHT_CAP = "HEIGHT_CAP"        # Airport authority / heritage height limit
    HERITAGE = "HERITAGE"            # Archeological / architectural conservation
    NO_ALIENATION = "NO_ALIENATION"  # SRA / subsidized tenement transfer lock-in


class ResponsibilityType(str, Enum):
    MAINTENANCE = "MAINTENANCE"      # Society maintenance charge contribution
    STRUCTURAL = "STRUCTURAL"        # Prohibition of knocking down load-bearing walls
    FIRE_SAFETY = "FIRE_SAFETY"      # Keeping common corridors clear


@dataclass
class Right:
    right_id: str
    rid: str
    right_type: RightType
    holder_pseudonym: str
    uds_fraction: float              # Undivided share of land (0.0 to 1.0)
    legal_basis_status: str          # ENACTED (Apartment Acts), ASSUMED
    legal_act_ref: str               # e.g. "Maharashtra Apartment Ownership Act 1970 § 5"
    valid_from: str
    valid_to: Optional[str] = None


@dataclass
class Restriction:
    restriction_id: str
    rid: str
    restriction_type: RestrictionType
    legal_basis: str
    parameters: Dict[str, Any] = field(default_factory=dict)


@dataclass
class Responsibility:
    responsibility_id: str
    rid: str
    responsibility_type: ResponsibilityType
    responsible_party: str
    scope_description: str


class RRRStore:
    """Manages legal property rights, encumbrances, and responsibilities in SQLite."""

    def __init__(self, db_path: str = "registry.db"):
        self.db_path = db_path
        self._init_db()

    @contextmanager
    def _get_connection(self):
        conn = sqlite3.connect(self.db_path, timeout=30.0)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode = WAL;")
        conn.execute("PRAGMA synchronous = NORMAL;")
        try:
            yield conn
        finally:
            conn.close()

    def _init_db(self) -> None:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS rights (
                    right_id TEXT PRIMARY KEY,
                    rid TEXT NOT NULL,
                    right_type TEXT NOT NULL,
                    holder_pseudonym TEXT NOT NULL,
                    uds_fraction REAL NOT NULL,
                    legal_basis_status TEXT NOT NULL,
                    legal_act_ref TEXT NOT NULL,
                    valid_from TEXT NOT NULL,
                    valid_to TEXT
                );
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS restrictions (
                    restriction_id TEXT PRIMARY KEY,
                    rid TEXT NOT NULL,
                    restriction_type TEXT NOT NULL,
                    legal_basis TEXT NOT NULL,
                    parameters_json TEXT NOT NULL
                );
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS responsibilities (
                    responsibility_id TEXT PRIMARY KEY,
                    rid TEXT NOT NULL,
                    responsibility_type TEXT NOT NULL,
                    responsible_party TEXT NOT NULL,
                    scope_description TEXT NOT NULL
                );
            """)
            conn.commit()

    def insert_right(self, right: Right) -> None:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO rights (
                    right_id, rid, right_type, holder_pseudonym, uds_fraction,
                    legal_basis_status, legal_act_ref, valid_from, valid_to
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                right.right_id, right.rid, right.right_type.value,
                right.holder_pseudonym, right.uds_fraction,
                right.legal_basis_status, right.legal_act_ref,
                right.valid_from, right.valid_to
            ))
            conn.commit()

    def get_rights_for_rid(self, rid: str) -> List[Right]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM rights WHERE rid = ?;", (rid,))
            rows = cursor.fetchall()
            return [
                Right(
                    right_id=r["right_id"],
                    rid=r["rid"],
                    right_type=RightType(r["right_type"]),
                    holder_pseudonym=r["holder_pseudonym"],
                    uds_fraction=r["uds_fraction"],
                    legal_basis_status=r["legal_basis_status"],
                    legal_act_ref=r["legal_act_ref"],
                    valid_from=r["valid_from"],
                    valid_to=r["valid_to"]
                )
                for r in rows
            ]

    def insert_restriction(self, restriction: Restriction) -> None:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO restrictions (
                    restriction_id, rid, restriction_type, legal_basis, parameters_json
                ) VALUES (?, ?, ?, ?, ?);
            """, (
                restriction.restriction_id,
                restriction.rid,
                restriction.restriction_type.value,
                restriction.legal_basis,
                json.dumps(restriction.parameters)
            ))
            conn.commit()

    def get_restrictions_for_rid(self, rid: str) -> List[Restriction]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM restrictions WHERE rid = ?;", (rid,))
            rows = cursor.fetchall()
            return [
                Restriction(
                    restriction_id=r["restriction_id"],
                    rid=r["rid"],
                    restriction_type=RestrictionType(r["restriction_type"]),
                    legal_basis=r["legal_basis"],
                    parameters=json.loads(r["parameters_json"])
                )
                for r in rows
            ]

    def insert_responsibility(self, resp: Responsibility) -> None:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO responsibilities (
                    responsibility_id, rid, responsibility_type, responsible_party, scope_description
                ) VALUES (?, ?, ?, ?, ?);
            """, (
                resp.responsibility_id,
                resp.rid,
                resp.responsibility_type.value,
                resp.responsible_party,
                resp.scope_description
            ))
            conn.commit()

    def get_responsibilities_for_rid(self, rid: str) -> List[Responsibility]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM responsibilities WHERE rid = ?;", (rid,))
            rows = cursor.fetchall()
            return [
                Responsibility(
                    responsibility_id=r["responsibility_id"],
                    rid=r["rid"],
                    responsibility_type=ResponsibilityType(r["responsibility_type"]),
                    responsible_party=r["responsible_party"],
                    scope_description=r["scope_description"]
                )
                for r in rows
            ]
