# Photogrammetry & Indian Drone Data Blueprint
## SIH26011: 3D ULPIN Generation & Vertical Property Mapping System

---

## 1. Executive Summary & Objective

In **SIH26011 (3D ULPIN Generation & Vertical Property Mapping)**, the biggest challenge is bridging the gap between raw physical reality and structured 3D spatial cadastre.

Conventional land administration in India records only 2D land parcels via **Bhu-Aadhaar (2D ULPIN)**. However, modern Indian cities are developing vertically and underground. To map multi-storey apartments, basements, and elevated transit corridors, 2D boundaries are insufficient. 

**Drone Photogrammetry** provides the foundational spatial raw material:
1. **True Orthomosaic (GeoTIFF)**: A distortion-free, georeferenced orthophoto providing the exact 2D building footprint.
2. **Digital Surface Model (DSM) & Digital Terrain Model (DTM)**: Continuous elevation surfaces providing ground reference ($Z_{\text{ground}}$) and rooftop height ($Z_{\text{roof}}$).
3. **Dense 3D Point Cloud (.las / .laz)**: Spatial coordinates $(X, Y, Z)$ capturing balconies, floor setbacks, and facade geometry.
4. **Textured 3D Meshes & 3D Tiles**: OGC-compliant 3D models streamed natively into CesiumJS for volumetric inspection.

---

## 2. Open-Source Photogrammetry Model Comparison

| Engine | Best For | Core Algorithm | Output Formats | Suitability for 3D ULPIN |
|---|---|---|---|---|
| **OpenDroneMap (ODM) / WebODM / PyODM** | **Aerial Drone Surveys & GIS Cadastre** | Structure-from-Motion (OpenSfM) + Multi-View Stereo (OpenMVS) | • Orthophoto GeoTIFF<br>• DSM / DTM GeoTIFF<br>• Point Cloud (.las/.laz)<br>• 3D Tiles (`tileset.json`)<br>• 3D Mesh (.obj/.ply) | **#1 Primary Recommendation.** Native GIS georeferencing, GCP support, direct 3D Tiles export for Cesium. |
| **COLMAP + OpenMVS** | **Research-grade SfM & High-Rise Facades** | Incremental SfM + PatchMatch Stereo | • Camera poses<br>• Dense point cloud<br>• Textured mesh (.ply/.obj) | Exceptional for tall vertical apartment towers with oblique facade angles (Mumbai/Bengaluru high-rises). Requires post-processing for GIS georeferencing. |
| **AliceVision / Meshroom** | **Object / Facade Close-Up Inspection** | Node-based SfM + DepthMap + Texturing | • 3D Mesh (.obj)<br>• Textures (.png) | Good for small architectural assets, but lacks native geospatial tile pyramids for large drone flights. |
| **3D Gaussian Splatting (3DGS / Nerfstudio)** | **Photorealistic Real-Time Visualization** | Differentiable Gaussian Splatting | • Splat PLY / SOG | Incredible visual fidelity for live demos. However, Gaussians are volumetric radiance representations, not CAD solids; must be meshed via **SuGaR** or **2DGS** for cadastral boundaries. |

---

## 3. Indian Drone Ecosystem & Cadastral Standards

### A. The SVAMITVA Scheme Benchmark
The **SVAMITVA Scheme** (Survey of Villages and Mapping with Improvised Technology in Village Areas) run by the **Ministry of Panchayati Raj (MoPR)** and the **Survey of India (SoI)** is India's largest active drone mapping initiative:
- **Flight Height**: 100m – 120m Above Ground Level (AGL).
- **Ground Sampling Distance (GSD)**: $\le 5\text{ cm/pixel}$ (sufficient to resolve individual parcel boundary stones and walls).
- **Image Overlap**: Minimum 80% longitudinal (forward) overlap, 70% lateral (side) overlap to avoid blind spots around tall structures.
- **Accuracy Benchmark**: Horizontal accuracy $\le 10\text{ cm}$, vertical accuracy $\le 20\text{ cm}$ using Ground Control Points (GCPs).

### B. Survey of India (SoI) CORS Network
- India has established a nationwide network of **Continuous Operating Reference Stations (CORS)**.
- Drones equipped with RTK (Real-Time Kinematic) or PPK (Post-Processed Kinematic) GNSS receivers connect to the SoI CORS network to achieve **sub-centimeter phase positioning**, eliminating the need for dozens of manual physical survey markers.

### C. Coordinate Reference Systems (CRS) in India
- **WGS 84 Geographic (EPSG:4326)**: Standard for GPS/GNSS and CesiumJS globe coordinates.
- **WGS 84 / UTM Zone 43N (EPSG:32643)**: Western India ($66^\circ\text{E}$ to $72^\circ\text{E}$ & $72^\circ\text{E}$ to $78^\circ\text{E}$), covering Mumbai, Pune, Gujarat, and Western Karnataka/Bengaluru.
- **WGS 84 / UTM Zone 44N (EPSG:32644)**: Central/Eastern Peninsula ($78^\circ\text{E}$ to $84^\circ\text{E}$), covering Eastern Bengaluru, Hyderabad, and Chennai.
- **WGS 84 / India Zone (EPSG:7755)**: Survey of India's national unified LCC projection for cadastral data.

### D. DGCA & Digital Sky Airspace Rules
- **Green Zones**: Up to 400 ft (120m) AGL requires no prior flight permission for compliant micro/small drones.
- **Yellow / Red Zones**: Near airports or defense corridors; requires digital flight plan clearance via the Digital Sky platform.

---

## 4. End-to-End Implementation Architecture

```text
               +------------------------------------------+
               |        Drone Aerial Survey Grid          |
               |  (Overlapping JPGs + RTK GPS/EXIF tags)  |
               +------------------------------------------+
                                    |
                                    v
               +------------------------------------------+
               |       OpenDroneMap (NodeODM Engine)      |
               |   --orthophoto-resolution 2.5 --dsm      |
               |   --pc-las --3d-tiles                    |
               +------------------------------------------+
                                    |
          +-------------------------+-------------------------+
          |                         |                         |
          v                         v                         v
+-------------------+     +-------------------+     +-------------------+
|  Orthomosaic.tif  |     |      DSM.tif      |     |  3D Tiles Folder  |
| (2D GeoTIFF 2.5cm)|     | (Elevation Model) |     |  (tileset.json)   |
+-------------------+     +-------------------+     +-------------------+
          |                         |                         |
          |  [Footprint Polygon]    |  [Ground/Roof Z]        |
          +------------+------------+                         |
                       |                                      |
                       v                                      |
     +------------------------------------+                   |
     |   Vertical Property Slicer         |                   |
     |   • Computes Height = Roof - Ground|                   |
     |   • Slices levels (B1, G, L1..N)   |                   |
     |   • Computes 3D Volume (m³)        |                   |
     +------------------------------------+                   |
                       |                                      |
                       v                                      |
     +------------------------------------+                   |
     |   3D Topology Validation Engine    |                   |
     |   • 2D non-self-intersecting check |                   |
     |   • Watertight solid verification  |                   |
     |   • Parcel containment check       |                   |
     +------------------------------------+                   |
                       |                                      |
                       v                                      |
     +------------------------------------+                   |
     |   Deterministic 3D ULPIN Engine    |                   |
     |   3D-IN-BLR-F04-A8F29C             |                   |
     +------------------------------------+                   |
                       |                                      |
                       v                                      v
     +------------------------------------------------------------------+
     |                 CesiumJS 3D Interactive Viewer                   |
     |  • Google Photorealistic 3D Tiles + Cesium Ion Terrain           |
     |  • Cadastral Parcel Boundaries draped on terrain                 |
     |  • Dynamic Floor Slicing & Exploded Vertical Inspection          |
     |  • Real-time 3D ULPIN & Provenance Audit Inspection              |
     +------------------------------------------------------------------+
```

---

## 5. Quick-Start Deployment Guide

### A. Run OpenDroneMap (NodeODM) via Docker
```bash
# Pull and start NodeODM worker
docker run -d --name nodeodm -p 3000:3000 opendronemap/nodeodm
```

### B. Ingest Drone Survey via Python Client (`pyodm`)
```python
from pyodm import Node

node = Node("localhost", 3000)

task = node.create_task(
    files=["flight_01.jpg", "flight_02.jpg", "flight_03.jpg"],
    options={
        "orthophoto-resolution": 2.5,
        "dsm": True,
        "dtm": True,
        "3d-tiles": True,
        "pc-las": True,
        "feature-quality": "high"
    }
)
print(f"Task created: {task.uuid}. Processing photogrammetry...")
task.wait_for_completion()
task.download_assets("./output_odm")
```

### C. Trigger 3D ULPIN Ingestion via Backend API
```bash
curl -X POST http://localhost:8000/api/drone/process \
  -H "Content-Type: application/json" \
  -d '{
    "survey_id": "SURV-IN-BLR-UAV-01",
    "city": "bengaluru",
    "survey_name": "Bengaluru Electronic City Tech Corridor UAV Photogrammetry",
    "flight_altitude_m": 120.0,
    "gsd_cm": 2.4,
    "has_underground": true,
    "units_per_floor": 2
  }'
```

---

## 6. SIH Demo & Defense Strategy

When presenting to SIH judges, emphasize the following key technical points:
1. **Separation of Inferred vs. Authoritative Geometry**:
   - Drone photogrammetry infers external building envelopes. It does not replace registered legal deeds.
   - We clearly label all derived spatial objects with their exact confidence class (`AUTHORITATIVE_SURVEY`, `DERIVED_HIGH`, or `INFERRED`).
2. **Determinism in 3D ULPINs**:
   - Our 3D ULPIN generator produces deterministic spatial hashes based on physical location, vertical level, and height bounds. If the geometry is unchanged, the identifier is mathematically identical.
3. **Rigorous 3D Topology Validation**:
   - We do not simply render pretty 3D boxes; every property volume must pass 6 automated topological checks (watertightness, floor ordering, non-overlap, parcel containment, non-self-intersection).
4. **Interoperability**:
   - Built on open standards: OGC 3D Tiles, CityGML concepts, GeoJSON, and WGS84 coordinates.
