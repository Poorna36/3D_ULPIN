"""
Canonical 3D Property Models conforming to data-model.md and identifier-spec.md
"""
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class Provenance(BaseModel):
    source_dataset: str
    crs: str
    acquired_at: str
    processing_version: str
    operator: str
    transformations: List[str] = Field(default_factory=list)

class ValidationCheck(BaseModel):
    id: str
    label: str
    status: str  # VALID, REVIEW, INVALID

class Floor(BaseModel):
    floor_id: str
    level_index: int
    label: str
    z_min: float
    z_max: float
    confidence: str
    status: str

class Building(BaseModel):
    building_id: str
    name: str
    city: str
    lat: float
    lon: float
    ground_elevation: float
    roof_elevation: float
    height: float
    floor_count: int
    source: str
    confidence: str
    validation_status: str
    prototype_3d_id: str
    data_label: str
    is_underground: Optional[bool] = False
    parent_parcel_id: Optional[str] = None
    provenance: Provenance
    floors: List[Floor] = Field(default_factory=list)
    validation_checks: List[ValidationCheck] = Field(default_factory=list)

class Parcel(BaseModel):
    parcel_id: str
    source_parcel_id: str
    country: str
    city: str
    coordinates: List[List[float]]  # [[lon, lat], ...]
    elevation_reference: float
    source: str
    status: str = "VALID"
