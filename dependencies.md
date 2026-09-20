# Dependencies & Setup Guide — 3D ULPIN Backend

**Project:** SIH26011 (3D ULPIN Generation and Vertical Property Mapping System)  
**Target Runtime:** Python 3.10 to 3.12 (Recommended: `3.11`)  
**Design Doctrine:** Single-process Python backend, zero external database daemons (embedded SQLite WAL mode).

---

## 1. Quick Start (Get Running in 3 Minutes)

### Step 1: Create and Activate Virtual Environment
```bash
# Windows (PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux / macOS (Bash)
python3 -m venv venv
source venv/bin/activate
```

### Step 2: Configure Environment Variables
Copy the template configuration file:
```bash
# Windows (PowerShell)
Copy-Item env.example .env

# Linux / macOS (Bash)
cp env.example .env
```
*(Review `.env` and adjust port or file paths if needed. Defaults work out of the box).*

### Step 3: Install Dependencies
```bash
# Install core & API stack
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 2. Dependency Breakdown by Subsystem

The backend dependencies are divided into 4 logical tiers according to the phased build order:

### Tier 1: Core 3D Geometry & Identity Engine (Phases 1, 2, 3)
*Required immediately for 3D ULPIN grammar, check symbols, natural keys, mesh synthesis, and SQLite WAL registry.*

| Package | Minimum Version | Purpose in 3D ULPIN |
|---------|-----------------|---------------------|
| `numpy` | `^1.24` | Matrix math, coordinate arrays, Morton 3D bit interleaving |
| `scipy` | `^1.10` | `scipy.spatial` (KDTree, ConvexHull, Voronoi) for fast 3D spatial queries |
| `shapely` | `^2.0` | 2D footprint topology, polygon intersection/union, buffering, AutoDCR floor slicing |
| `trimesh` | `^4.0` | 3D polyhedron meshes, watertight verification, volumetric boolean intersection (`vol(A ∩ B)`), ray-tracing |
| `manifold3d` | `^3.5` | Fast exact CSG 3D constructive solid boolean engine (`manifold` backend for trimesh) |
| `mapbox-earcut` | `^2.1` | High-performance 2D-to-3D polygon triangulation engine for AutoDCR floor extrusion |
| `pyproj` | `^3.5` | Geodetic transformations between WGS84 (EPSG:4326), UTM 43N/44N (EPSG:32643/32644), and Everest 1830 |
| `rtree` | `^1.0` | Spatial index for Spatial Address (SA) grid cover lookups |

### Tier 2: Web API & Application Framework (Phases 2, 10)
*Exposes REST endpoints, OpenAPI docs, and serves the Examiner Console.*

| Package | Minimum Version | Purpose in 3D ULPIN |
|---------|-----------------|---------------------|
| `fastapi` | `^0.110` | High-performance async REST framework for `/resolve`, `/verify`, `/allocate` |
| `uvicorn` | `^0.28` | Production-grade ASGI server (`uvicorn.workers.UvicornWorker`) |
| `pydantic` | `^2.6` | Strict schema validation for RID components, findings, and provenance metadata |
| `pydantic-settings` | `^2.2` | Loads `.env` file into typed configuration objects |
| `python-multipart` | `^0.0.9` | Handles multi-part file uploads (DXF, LAS, GeoJSON, IFC files) |

### Tier 3: Ingestion & Geospatial Data Formats (Phases 0, 1, 5)
*Reads real-world cadastral layers, CAD floor plans, and elevation data.*

| Package | Minimum Version | Purpose in 3D ULPIN |
|---------|-----------------|---------------------|
| `geopandas` | `^0.14` | Reads GeoJSON, ESRI Shapefiles, and GeoPackage vectors (parcels, metro alignments) |
| `ezdxf` | `^1.2` | Parses building sanction CAD / DXF floor plans (AutoDCR formats) |
| `laspy[lazrs]` | `^2.5` | High-speed read/write for LiDAR point clouds (`.las` and compressed `.laz`) |
| `requests` | `^2.31` | Automated downloads for open-data boundaries and Overture Maps tiles |

### Tier 4: AI/ML & Advanced Evidence Processing (Phase 6 — Optional at Start)
*Only needed once implementing automated evidence extraction (KPConv / PointNet / Floor plan segmentation).*

| Package | Purpose in 3D ULPIN | Note |
|---------|---------------------|------|
| `torch` / `torchvision` | Deep learning models (H1 building extraction, H2 floor segmentation) | Install via official PyTorch wheel matching your CUDA version |
| `onnxruntime` | Fast, lightweight CPU inference for pre-trained models | Low-overhead alternative to heavy PyTorch |
| `scikit-learn` | RANSAC floor plane fitting, DBSCAN point clustering | For D4 level inference without heavy neural nets |
| `open3d` | Point-cloud downsampling, normal estimation, and ICP registration | Used in georegistration (`icp_align.py`) |
| `ifcopenshell` | Direct BIM IFC extraction (`IfcSpace`, `IfcBuildingStorey`) | Optional richer input format |

---

## 3. Testing & Code Quality

Run tests and style checks using standard tooling:

```bash
# Run unit and conformance tests
pytest

# Run tests with coverage summary
pytest --cov=src tests/

# Format / Lint code
ruff check src/ tests/
```

---

## 4. Platform-Specific Setup Notes & Troubleshooting

### Windows Gotchas
1. **PowerShell Execution Policy Error:**
   If running `.\venv\Scripts\Activate.ps1` gives a script execution error, run:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
2. **Microsoft C++ Build Tools:**
   Some geospatial libraries (`trimesh[easy]`, `rtree`, `laspy`) may compile C-extensions. If an install fails, install the [Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/).
3. **GDAL on Windows:**
   Our architecture intentionally minimizes hard GDAL dependencies by using `laspy`, `shapely`, and `geopandas`. If you require system GDAL, install via OSGeo4W or pre-compiled wheels from Christoph Gohlke / Conda.

### Linux / Ubuntu
Install system libraries before pip installing:
```bash
sudo apt update
sudo apt install -y python3-dev build-essential libspatialindex-dev libgeos-dev
```

### macOS (Apple Silicon M1/M2/M3)
Install spatial index via Homebrew:
```bash
brew install spatialindex geos
```
