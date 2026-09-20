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

class DroneSurveyRequest(BaseModel):
    survey_id: Optional[str] = "SURV-IN-BLR-UAV-01"
    city: str = "bengaluru"
    survey_name: str = "Bengaluru Electronic City Tech Corridor UAV Photogrammetry"
    flight_altitude_m: float = 120.0
    gsd_cm: float = 2.5
    has_underground: bool = True
    units_per_floor: int = 2

class DroneSurveySummary(BaseModel):
    survey_id: str
    name: str
    city: str
    total_images: int
    mean_gsd_cm: float
    flight_altitude_m: float
    crs: str
    status: str
    rtk_fix: str

class DroneProcessResponse(BaseModel):
    success: bool
    message: str
    survey_id: str
    prototype_3d_id: str
    reconstructed_building: Building
    validation_report: Dict[str, Any]
    processing_time_s: float
