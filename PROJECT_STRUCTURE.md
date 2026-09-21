# Recommended Source Tree

```text
3d-ulpin/
├── backend/                        # 3D ULPIN Cadastral REST API (ISO 19152, ICT, Allocator)
│   ├── api/                        # FastAPI endpoints (schemas, routes)
│   ├── core/                       # Registry, Grammar, ICT evaluation engine
│   ├── identity/                   # ULPIN3D Allocator
│   ├── rights/                     # RRR rights model
│   └── validation/                 # T0–T4 geometric & administrative validators
├── photogrammetry/                 # ISOLATED Drone & UAV Reconstruction Sub-App
│   ├── README.md                   # Indian Drone & SVAMITVA guide
│   ├── ingestion/                  # Drone EXIF parser, NodeODM client, SfM telemetry
│   ├── geometry/                   # Vertical property slicer, 3D volume computational geometry
│   ├── validation/                 # 3D topology & watertight boundary validation engine
│   ├── adapters/                   # Indian geodetic transforms (EPSG:4326 to UTM/EPSG:7755)
│   ├── api/                        # Dedicated FastAPI router (/api/drone/*) & Pydantic models
│   └── tests/                      # Dedicated photogrammetry unit & integration test suite
├── frontend/                       # CesiumJS 3D Digital Twin & Cadastral UI (React + Vite)
│   ├── src/
│   │   ├── components/             # Cesium viewer, strata explorer, conflict workflow, H1–H4 ML panel
│   │   ├── photogrammetry/         # Dedicated Photogrammetry UI panel & drone API client
│   │   ├── mock/                   # Preloaded cadastral pilot datasets
│   │   └── utils/                  # Coordinate transforms & grammar helpers
├── services/                       # Supplementary microservices & identifier generators
│   ├── api/                        # Prototype spatial API & memory DB
│   └── identifiers/                # Deterministic prototype identifier generator
├── ml/                             # H1–H4 Deep Learning models & topology anomaly detectors
├── docs/                           # Authoritative system documentation & architecture
├── tests/                          # Core backend unit, conformance, and audit test suites
├── data/                           # Cadastral boundaries, alignments, and test fixtures
├── run.ps1                         # PowerShell launch script (Backend + Frontend)
├── run.bat                         # Batch launch script
└── progress.md                     # Consolidated append-only development progress log
```

Never commit restricted/private datasets or secrets.
