"""
Pydantic Models for Photogrammetry API & Reconstructed 3D Assets
"""
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class DroneProvenance(BaseModel):
    source_dataset: str
    crs: str
    acquired_at: str
    processing_version: str
    operator: str
    transformations: List[str] = Field(default_factory=list)

class DroneValidationCheck(BaseModel):
    id: str
    label: str
    status: str  # VALID, REVIEW, INVALID

class DroneFloor(BaseModel):
    floor_id: str
    level_index: int
    label: str
    z_min: float
    z_max: float
    confidence: str
    status: str

class ReconstructedBuilding(BaseModel):
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
    provenance: DroneProvenance
    floors: List[DroneFloor] = Field(default_factory=list)
    validation_checks: List[DroneValidationCheck] = Field(default_factory=list)

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
    reconstructed_building: ReconstructedBuilding
    validation_report: Dict[str, Any]
    processing_time_s: float
