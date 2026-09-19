"""
FastAPI Backend Service for SIH 3D ULPIN
Provides canonical endpoints for 3D buildings, parcels, search, and validation.
"""
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from services.api.models import Building, Parcel, ValidationCheck
from services.api.store import BUILDINGS_DB, PARCELS_DB
from services.identifiers.generator import generate_prototype_3d_id

app = FastAPI(
    title="3D ULPIN Spatial Engine API",
    description="Backend API service for vertical 3D property boundaries, validation, and deterministic prototype identifiers.",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "3d-ulpin-api", "version": "0.1.0"}

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("services.api.main:app", host="0.0.0.0", port=8000, reload=True)
