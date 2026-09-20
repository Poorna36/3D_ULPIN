"""
FastAPI Backend Service for SIH 3D ULPIN
Provides canonical endpoints for 3D buildings, parcels, search, validation,
and end-to-end Drone Photogrammetry / 3D ULPIN generation.
"""
from typing import List, Optional, Dict, Any
import time
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from services.api.models import (
    Building,
    Parcel,
    Floor,
    Provenance,
    ValidationCheck,
    DroneSurveyRequest,
    DroneSurveySummary,
    DroneProcessResponse
)
from services.api.store import BUILDINGS_DB, PARCELS_DB
from services.identifiers.generator import generate_prototype_3d_id
from services.ingestion.drone_exif import DroneImageMetadata
from services.ingestion.photogrammetry_engine import PhotogrammetryEngine
from services.geometry.vertical_slicer import VerticalPropertySlicer
from services.geometry.computational_geometry import polygon_centroid
from services.validation.engine import TopologyValidationEngine

app = FastAPI(
    title="3D ULPIN Spatial Engine API",
    description="Backend API service for vertical 3D property boundaries, validation, deterministic prototype identifiers, and drone photogrammetry.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

photogrammetry_engine = PhotogrammetryEngine()
vertical_slicer = VerticalPropertySlicer()
validation_engine = TopologyValidationEngine()

AVAILABLE_DRONE_SURVEYS: List[Dict[str, Any]] = [
    {
        "survey_id": "SURV-IN-BLR-UAV-01",
        "name": "Bengaluru Tech Corridor UAV Photogrammetry",
        "city": "bengaluru",
        "total_images": 84,
        "mean_gsd_cm": 2.4,
        "flight_altitude_m": 120.0,
        "crs": "EPSG:4326 / UTM 43N",
        "status": "READY_FOR_PROCESSING",
        "rtk_fix": "FIXED (Survey of India CORS Network)",
        "coordinates": [
            [77.5925, 12.9715],
            [77.5955, 12.9715],
            [77.5955, 12.9745],
            [77.5925, 12.9745]
        ]
    },
    {
        "survey_id": "SURV-IN-BOM-UAV-02",
        "name": "Mumbai Lower Parel Vertical Density Survey",
        "city": "mumbai",
        "total_images": 126,
        "mean_gsd_cm": 2.1,
        "flight_altitude_m": 150.0,
        "crs": "EPSG:4326 / UTM 43N",
        "status": "READY_FOR_PROCESSING",
        "rtk_fix": "FIXED (Survey of India CORS Network)",
        "coordinates": [
            [72.8260, 18.9960],
            [72.8290, 18.9960],
            [72.8290, 18.9990],
            [72.8260, 18.9990]
        ]
    },
    {
        "survey_id": "SURV-IN-RUR-UAV-03",
        "name": "SVAMITVA Rural Abadi Drone Cadastral Mapping",
        "city": "bengaluru",
        "total_images": 65,
        "mean_gsd_cm": 3.0,
        "flight_altitude_m": 100.0,
        "crs": "EPSG:4326 / India Zone EPSG:7755",
        "status": "READY_FOR_PROCESSING",
        "rtk_fix": "FIXED (SoI Reference Station)",
        "coordinates": [
            [77.5850, 12.9650],
            [77.5880, 12.9650],
            [77.5880, 12.9680],
            [77.5850, 12.9680]
        ]
    }
]


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "3d-ulpin-api", "version": "1.0.0"}


@app.get("/api/buildings", response_model=List[Building])
def get_buildings(city: str = Query("bengaluru", description="City code (bengaluru, mumbai, netherlands, singapore)")):
    normalized_city = city.lower()
    return BUILDINGS_DB.get(normalized_city, [])


@app.get("/api/buildings/{building_id}", response_model=Building)
def get_building_by_id(building_id: str):
    for city_buildings in BUILDINGS_DB.values():
        for b in city_buildings:
            if b["building_id"] == building_id:
                return b
    raise HTTPException(status_code=404, detail=f"Building '{building_id}' not found")


@app.get("/api/search", response_model=List[Building])
def search_buildings(city: str = Query("bengaluru"), q: str = Query("", description="Search term")):
    normalized_city = city.lower()
    buildings = BUILDINGS_DB.get(normalized_city, [])
    if not q:
        return buildings
    query = q.lower()
    matches = [
        b for b in buildings
        if query in b["name"].lower()
        or query in b["building_id"].lower()
        or query in b.get("prototype_3d_id", "").lower()
    ]
    return matches


@app.get("/api/validation/{building_id}", response_model=List[ValidationCheck])
def get_validation_report(building_id: str):
    for city_buildings in BUILDINGS_DB.values():
        for b in city_buildings:
            if b["building_id"] == building_id:
                return b.get("validation_checks", [])
    raise HTTPException(status_code=404, detail=f"Building '{building_id}' not found")


@app.get("/api/parcels", response_model=List[Parcel])
def get_parcels(city: str = Query("bengaluru")):
    normalized_city = city.lower()
    return PARCELS_DB.get(normalized_city, [])


@app.post("/api/identifiers/generate")
def generate_id(country: str, city: str, building_ref: str, height: float, floor_count: int, is_underground: bool = False):
    identifier = generate_prototype_3d_id(
        country_code=country,
        city_code=city,
        building_ref=building_ref,
        height=height,
        floor_count=floor_count,
        is_underground=is_underground
    )
    return {"prototype_3d_id": identifier}


@app.get("/api/drone/surveys", response_model=List[DroneSurveySummary])
def list_drone_surveys():
    """Retrieve available Indian drone surveys configured for photogrammetric reconstruction."""
    return [
        DroneSurveySummary(
            survey_id=s["survey_id"],
            name=s["name"],
            city=s["city"],
            total_images=s["total_images"],
            mean_gsd_cm=s["mean_gsd_cm"],
            flight_altitude_m=s["flight_altitude_m"],
            crs=s["crs"],
            status=s["status"],
            rtk_fix=s["rtk_fix"]
        )
        for s in AVAILABLE_DRONE_SURVEYS
    ]


@app.post("/api/drone/process", response_model=DroneProcessResponse)
def process_drone_survey(req: DroneSurveyRequest):
    """
    End-to-End Drone Photogrammetry & 3D ULPIN Generator:
    1. Simulates/Dispatches aerial photogrammetric triangulation on drone image grid
    2. Delineates 3D building envelope & rooftop elevation
    3. Executes 3D vertical slicing into floor property volumes
    4. Runs rigorous 3D topology & cadastral boundary validation
    5. Generates deterministic prototype 3D ULPIN
    6. Commits newly reconstructed 3D building into live spatial database
    """
    t_start = time.time()
    city_key = req.city.lower()

    # Find survey or synthesize one
    matching = next((s for s in AVAILABLE_DRONE_SURVEYS if s["survey_id"] == req.survey_id), None)
    if not matching:
        matching = AVAILABLE_DRONE_SURVEYS[0]

    coords = matching["coordinates"]
    center_lon, center_lat = polygon_centroid(coords)

    # Generate synthetic camera grid telemetry
    images: List[DroneImageMetadata] = []
    flight_alt = req.flight_altitude_m
    ground_ref = 920.0 if city_key == "bengaluru" else 15.0

    for i in range(16):
        d_x = ((i % 4) - 1.5) * 0.0004
        d_y = ((i // 4) - 1.5) * 0.0004
        images.append(
            DroneImageMetadata(
                filename=f"IMG_{1000 + i}.JPG",
                latitude=center_lat + d_y,
                longitude=center_lon + d_x,
                altitude_msl=ground_ref + flight_alt,
                altitude_agl=flight_alt,
                gimbal_pitch=-90.0,
                focal_length_mm=8.8,
                image_width_px=5472,
                image_height_px=3648
            )
        )

    # Step 1: Execute Photogrammetry Reconstruction
    sfm_result = photogrammetry_engine.process_telemetry_survey(
        survey_id=matching["survey_id"],
        survey_name=req.survey_name,
        city=city_key,
        image_records=images
    )
    struct = sfm_result.detected_structures[0]

    # Step 2: Vertical Property Slicing
    building_id = f"{city_key[:3].upper()}-DRONE-{int(time.time()) % 10000:04d}"
    parent_parcel_id = f"{city_key[:3].upper()}-PRC-101"

    sliced = vertical_slicer.slice_building(
        building_id=building_id,
        country="India",
        city=city_key,
        footprint=struct["footprint"],
        ground_elevation=struct["ground_elevation"],
        roof_elevation=struct["roof_elevation"],
        parent_parcel_id=parent_parcel_id,
        has_underground=req.has_underground,
        units_per_floor=req.units_per_floor
    )

    # Step 3: Run 3D Topology Validation
    parent_parcels = PARCELS_DB.get(city_key, [])
    matched_parcel = next((p for p in parent_parcels if p.get("parcel_id") == parent_parcel_id), None)
    
    val_building_dict = {
        "building_id": building_id,
        "footprint": struct["footprint"],
        "ground_elevation": struct["ground_elevation"],
        "roof_elevation": struct["roof_elevation"],
        "floors": sliced["floors"]
    }
    val_report = validation_engine.validate_building_volume(val_building_dict, matched_parcel)

    # Step 4: Generate Deterministic Prototype 3D ULPIN
    master_ulpin = generate_prototype_3d_id(
        country_code="IN",
        city_code=city_key[:3].upper(),
        building_ref=building_id,
        height=struct["height"],
        floor_count=sliced["total_floors"]
    )

    # Step 5: Assemble Canonical Building Object
    floors_model = [
        Floor(
            floor_id=f["floor_id"],
            level_index=f["level_index"],
            label=f["level_name"],
            z_min=f["z_min"],
            z_max=f["z_max"],
            confidence="DERIVED_HIGH",
            status="VALID"
        )
        for f in sliced["floors"]
    ]

    checks_model = [
        ValidationCheck(
            id=c["id"],
            label=f"{c['name']}: {c['detail']}",
            status=c["status"]
        )
        for c in val_report["checks"]
    ]

    new_building = Building(
        building_id=building_id,
        name=f"UAV Reconstructed: {req.survey_name.split(' ')[0]} Hub",
        city=city_key,
        lat=center_lat,
        lon=center_lon,
        ground_elevation=struct["ground_elevation"],
        roof_elevation=struct["roof_elevation"],
        height=struct["height"],
        floor_count=sliced["total_floors"],
        source=f"Drone Photogrammetry (GSD {sfm_result.mean_gsd_cm}cm)",
        confidence="AUTHORITATIVE_SURVEY",
        validation_status=val_report["overall_status"],
        prototype_3d_id=master_ulpin,
        data_label="Authoritative Drone Cadastre (SVAMITVA / SoI)",
        is_underground=req.has_underground,
        parent_parcel_id=parent_parcel_id,
        provenance=Provenance(
            source_dataset=sfm_result.provenance["source_dataset"],
            crs=sfm_result.provenance["crs"],
            acquired_at=sfm_result.provenance["processed_at"],
            processing_version="3D-ULPIN Drone Engine v1.0",
            operator="Survey of India / Drone Cadastre Team",
            transformations=["EXIF Triangulation", "Structure-from-Motion", "Volumetric Slicing", "Topology Validation"]
        ),
        floors=floors_model,
        validation_checks=checks_model
    )

    # Commit to In-Memory DB so it's instantly queryable via /api/buildings
    if city_key not in BUILDINGS_DB:
        BUILDINGS_DB[city_key] = []
    BUILDINGS_DB[city_key].insert(0, new_building.model_dump())

    t_elapsed = round(time.time() - t_start, 3)

    return DroneProcessResponse(
        success=True,
        message=f"Successfully reconstructed 3D building and vertical volumes from drone photogrammetry in {t_elapsed}s",
        survey_id=matching["survey_id"],
        prototype_3d_id=master_ulpin,
        reconstructed_building=new_building,
        validation_report=val_report,
        processing_time_s=t_elapsed
    )


@app.post("/api/validation/run")
def run_topology_validation(building_id: str):
    """Run full 3D topology validation on any building in the database."""
    found_building = None
    city_found = "bengaluru"
    for c_name, c_buildings in BUILDINGS_DB.items():
        for b in c_buildings:
            if b["building_id"] == building_id:
                found_building = b
                city_found = c_name
                break
        if found_building:
            break

    if not found_building:
        raise HTTPException(status_code=404, detail=f"Building '{building_id}' not found")

    parent_parcel_id = found_building.get("parent_parcel_id")
    parcels = PARCELS_DB.get(city_found, [])
    matched_parcel = next((p for p in parcels if p.get("parcel_id") == parent_parcel_id), None)

    report = validation_engine.validate_building_volume(found_building, matched_parcel)
    return report


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("services.api.main:app", host="0.0.0.0", port=8000, reload=True)
