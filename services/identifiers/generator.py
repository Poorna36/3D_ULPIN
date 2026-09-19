"""
Deterministic Prototype 3D Identifier Generator
Adheres strictly to identifier-spec.md:
- Deterministic
- Unique within configured namespace
- Non-authoritative prototype format: 3D-<COUNTRY>-<CITY>-<HASH>
"""
import hashlib
from typing import Optional

def generate_prototype_3d_id(
    country_code: str,
    city_code: str,
    building_ref: str,
    height: float,
    floor_count: int,
    is_underground: bool = False
) -> str:
    salt = f"{country_code}:{city_code}:{building_ref}:{height:.2f}:{floor_count}:{is_underground}"
    digest = hashlib.sha256(salt.encode("utf-8")).hexdigest()[:12]
    prefix = f"3D-{country_code.upper()}-{city_code.upper()}"
    if is_underground:
        return f"{prefix}-UG-{digest}"
    return f"{prefix}-{digest}"
