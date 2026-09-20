# 3D ULPIN Backend: Frontend Integration Guide & API Contract
**Version:** 1.0.0  
**Target Consumer:** Dedicated Frontend Engineering Team (CesiumJS / 3D Geospatial Web)  
**Backend Runtime:** FastAPI / Python 3.14 (Local endpoint: `http://localhost:8000`)  
**Interactive API Docs (Swagger UI):** `http://localhost:8000/docs`

---

## 1. Executive Summary & Architecture

The 3D ULPIN backend is a high-performance, specification-compliant 3D Cadastral Registry engine built for the Indian Land Administration system (conforming to DoLR / NIC guidelines and the Digital India Land Records Modernization Programme).

The frontend created in `backend/console/` serves as an **internal reference test harness**. The production frontend (developed by your team) will be the primary visual interface for government land examiners, surveyors, and the public.

```
┌────────────────────────────────────────────────────────┐
│             Production Frontend (CesiumJS)             │
│   - 3D Globe / Terrain / Photogrammetry Mesh           │
│   - Volumetric Parcel Rendering (10 Property Classes)  │
│   - "Below / Above Parcel" Vertical Column Inspector   │
│   - Validation Defect Heatmap (T0-T4 Explain Objects)  │
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON (CORS Enabled)
┌───────────────────────────▼────────────────────────────┐
│              FastAPI Backend (:8000)                   │
│   - /cover (3D Bounding Box Spatial Query)             │
│   - /resolve/{rid} (Full 3D Polyhedral Geometry)       │
│   - /validate/{rid} & /explain/{finding_id}            │
│   - /lineage/{rid} & /verify                           │
└────────────────────────────────────────────────────────┘
```

---

## 2. Quick Start for Frontend Developers

### 2.1 Starting the Backend
```bash
# From the repository root (with Python 3.10+):
python -m uvicorn backend.api.main:app --host 0.0.0.0 --port 8000 --reload
```
Once started:
- Health check / Root: `http://localhost:8000/`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`
- Reference Test Console: `http://localhost:8000/console/index.html`

### 2.2 CORS Support
CORS is pre-configured with open wildcard origins (`*`). Your local frontend dev server running on Vite (`http://localhost:5173`), React/Next.js (`http://localhost:3000`), or plain HTTP servers can make cross-origin requests without header errors.

---

## 3. Core Cadastral Mental Model

To build the UI intuitively, your team should understand three foundational concepts:

### A. The 3D ULPIN (RID)
Every 3D spatial unit has a unique 28-character alphanumeric identifier conforming to:
$$\text{ULPIN14} - \text{BLD} - \text{CLS}\text{SEQ} - \text{CHK}$$
Example: `MH2700010001AA-B0001-U0001-K`
- `MH2700010001AA`: 14-char parent ground parcel (State code `MH`, District, Survey number)
- `B0001`: Building sequence number on that parcel
- `U0001`: Property class `U` (Unit/Apartment) + sequential index `0001`
- `K`: ISO 7064 MOD 37,36 single-character check symbol for error protection

### B. The 10 Property Classes
Every 3D volume belongs to one of 10 standard legal classes:

| Class Code | Name | Legal Description | Suggested Cesium Style |
|:---:|---|---|---|
| **`S`** | Surface Parcel | Ground parcel 2D footprint column | Dark Slate `#334155`, semi-translucent |
| **`B`** | Building Envelope | External bounding shell of the structure | Ghost Gray `#94A3B8`, wireframe / subtle tint |
| **`L`** | Level Slab | Floor slab band dividing building levels | Warm Gray `#CBD5E1` |
| **`U`** | Private Unit | Flats, apartments, commercial suites | **Vibrant Amber `#E8A048`** (Primary focus) |
| **`C`** | Common Area | Lobbies, corridors, stairwells, clubhouses | **Emerald Green `#6DB56D`** |
| **`P`** | Parking Cell | Volumetric parking spaces | Neutral Slate `#8A8A8A` |
| **`A`** | Airspace Parcel | Regulated airspace column above height limits | Translucent Sky Blue `#38BDF8`, wireframe |
| **`T`** | Subterranean | Basements, foundation volumes, deep caverns | **Earthy Ochre `#B45309`** (Subsurface) |
| **`E`** | Elevated Corridor | Metro rail viaducts, flyovers, skywalks | **Cobalt Blue `#4A8BD4`** |
| **`I`** | Infrastructure | Underground utilities, pipes, drainage conduits | **Purple `#A855F7`** |

### C. The Data Provenance Rule (Absolute Honesty)
The backend tags **every single geometry and record** with its origin:
- `REAL`: Measured from actual surveyor instrumentation / official registry.
- `SYNTHETIC`: Generated via procedural physics / architecture simulation.
- `PROXY`: Legal proxy representation.

> **CRITICAL REQUIREMENT:** The UI must **never** hide or conflate `REAL` and `SYNTHETIC` data. Display a badge on every info card:
> - `REAL` $\rightarrow$ Green badge (`#10B981`)
> - `SYNTHETIC` $\rightarrow$ Amber badge (`#F59E0B`)
> - `PROXY` $\rightarrow$ Violet badge (`#8B5CF6`)

---

## 4. Complete REST API Contract

### 4.1 `GET /cover` (Primary 3D Viewport Query)
Retrieves all 3D objects intersecting a bounding box. Use this to dynamically load objects as the user pans/zooms the Cesium camera.

- **URL:** `GET /cover`
- **Query Parameters:**
  - `bbox` (*string*, required): Format `min_lon,min_lat,min_h,max_lon,max_lat,max_h` (WGS84 degrees, elevation in meters).
    - Example: `72.82,18.92,-50,72.84,18.94,200`
  - `cls` (*string*, optional): Comma-separated classes to include (e.g. `U,C,P,E,T`).
  - `data_provenance` (*string*, optional): Filter `REAL`, `SYNTHETIC`, or `PROXY`.
  - `lod` (*string*, optional): Level of Detail (`LOD1`, `LOD2`, `LOD3`).

- **Response (200 OK):**
```json
{
  "type": "FeatureCollection",
  "total_count": 2,
  "features": [
    {
      "rid": "MH2700010001AA-B0001-U0001-K",
      "cls": "U",
      "data_provenance": "SYNTHETIC",
      "validation_status": "PASS",
      "tier": "T1",
      "geometry": {
        "type": "Solid"
      }
    },
    {
      "rid": "MH2700010001AA-B0001-C0001-G",
      "cls": "C",
      "data_provenance": "SYNTHETIC",
      "validation_status": "WARN",
      "tier": "T1",
      "geometry": {
        "type": "Solid"
      }
    }
  ]
}
```

---

### 4.2 `GET /resolve/{rid}` (Object Detail & Full 3D Mesh)
Resolves a 3D ULPIN to its complete metadata, legal rights, and full 3D polyhedral mesh.

- **URL:** `GET /resolve/{rid}?include_geometry=true`
- **Path Parameters:**
  - `rid` (*string*, required): The 3D ULPIN.
- **Query Parameters:**
  - `include_geometry` (*boolean*, optional, default `false`): Set `true` to receive 3D mesh vertices and faces.

- **Response (200 OK):**
```json
{
  "rid": "MH2700010001AA-B0001-U0001-K",
  "cls": "U",
  "status": "ALLOCATED",
  "parent_rid": "MH2700010001AA-B0001-L0001-X",
  "parent_ulpin": "MH2700010001AA",
  "current_parcel_ulpin": "MH2700010001AA",
  "issuer_node_id": "MH",
  "birth_ts": "2026-09-20T08:30:00Z",
  "data_provenance": "SYNTHETIC",
  "legal_basis_status": "ENACTED",
  "legacy_ids": [
    {
      "id_system": "CTS",
      "legacy_value": "Plot 412/1A, Nariman Point"
    }
  ],
  "spans": [],
  "current_nk": {
    "digest": "M4F7Q8Z9A2B1C3D4",
    "locator": "00018F42A1",
    "version": 1
  },
  "geometry": {
    "type": "Solid",
    "origin": [72.8270, 18.9990, 14.5],
    "vertices": [
      [0.0, 0.0, 0.0],
      [12.0, 0.0, 0.0],
      [12.0, 10.0, 0.0],
      [0.0, 10.0, 0.0],
      [0.0, 0.0, 3.2],
      [12.0, 0.0, 3.2],
      [12.0, 10.0, 3.2],
      [0.0, 10.0, 3.2]
    ],
    "faces": [
      [0, 1, 2], [0, 2, 3],
      [4, 6, 5], [4, 7, 6],
      [0, 4, 5], [0, 5, 1],
      [1, 5, 6], [1, 6, 2],
      [2, 6, 7], [2, 7, 3],
      [3, 7, 4], [3, 4, 0]
    ],
    "crs": "EPSG:4326"
  }
}
```

---

### 4.3 `GET /validate/{rid}` (Examiner Validation Tiers T0–T4)
Runs the full five-tier validation stack against an RID and returns defect findings.

- **URL:** `GET /validate/{rid}?tiers=T0,T1,T2,T3,T4`
- **Response:**
```json
{
  "rid": "MH2700010001AA-B0001-U0001-K",
  "overall_status": "WARN",
  "tier_results": [
    {
      "tier": "T0",
      "status": "PASS",
      "findings": []
    },
    {
      "tier": "T1",
      "status": "PASS",
      "findings": []
    },
    {
      "tier": "T2",
      "status": "WARN",
      "findings": [
        {
          "finding_id": "T2-OVERLAP-8f1b2c",
          "tier": "T2",
          "predicate": "no_overlap",
          "status": "WARN",
          "magnitude": 0.042,
          "sigma": 0.015,
          "recommendation": "Minor boundary tolerance touch with U0002. Examiner inspection recommended."
        }
      ]
    },
    {
      "tier": "T4",
      "status": "PASS",
      "findings": []
    }
  ],
  "evidence_sufficiency": {
    "available": ["E1", "E2"],
    "required_for_full_pass": ["E1", "E2", "E3"],
    "unverifiable_checks": ["as_built_laser_scan_alignment"]
  }
}
```

---

### 4.4 `GET /explain/{finding_id}` (Deep Finding Inspector)
Retrieves forensic mathematical details about an individual validation finding.

- **URL:** `GET /explain/{finding_id}`
- **Response:**
```json
{
  "finding_id": "T2-OVERLAP-8f1b2c",
  "tier": "T2",
  "predicate": "no_overlap",
  "rid_a": "MH2700010001AA-B0001-U0001-K",
  "rid_b": "MH2700010001AA-B0001-U0002-L",
  "magnitude": 0.042,
  "sigma": 0.015,
  "evidence_class": "E1",
  "status": "WARN",
  "recommendation": "Review shared wall partition in flat boundary declaration.",
  "plan_version": "1.0",
  "data_provenance": "SYNTHETIC"
}
```

---

### 4.5 `GET /lineage/{rid}` (Time-Travel History & Audit Trail)
Returns the cryptographic version history and split/merge lineage tree for an RID.

- **URL:** `GET /lineage/{rid}`
- **Response:**
```json
{
  "rid": "MH2700010001AA-B0001-U0001-K",
  "chain_integrity_valid": true,
  "version_count": 2,
  "versions": [
    {
      "version_num": 1,
      "nk_digest": "A1B2C3D4...",
      "nk_locator": "00018F42...",
      "plan_version": "1.0",
      "evidence_class": "E1",
      "this_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "created_at": "2026-09-18T10:00:00Z"
    },
    {
      "version_num": 2,
      "nk_digest": "F5G6H7J8...",
      "nk_locator": "00018F45...",
      "plan_version": "1.1",
      "evidence_class": "E2",
      "this_hash": "5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9",
      "created_at": "2026-09-20T11:15:00Z"
    }
  ],
  "lineage_edges": [
    {
      "source_rid": "MH2700010001AA-B0001-U0000-A",
      "target_rid": "MH2700010001AA-B0001-U0001-K",
      "edge_type": "SPLIT_FROM",
      "created_at": "2026-09-18T10:00:00Z"
    }
  ]
}
```

---

### 4.6 `POST /verify` (As-Built Geometry Verification)
Allows a surveyor or examiner to upload a candidate 3D mesh (e.g. from LiDAR) and check if it matches the registered legal boundary.

- **URL:** `POST /verify`
- **Request Body:**
```json
{
  "rid": "MH2700010001AA-B0001-U0001-K",
  "geometry": {
    "type": "Solid",
    "extents": [12.0, 10.0, 3.2]
  }
}
```
- **Response:**
```json
{
  "result": "MATCH",
  "computed_digest": "M4F7Q8Z9A2B1C3D4",
  "registered_digest": "M4F7Q8Z9A2B1C3D4",
  "delta": 0.0,
  "iou3d": 1.0,
  "confidence": 0.99
}
```

---

### 4.7 `POST /allocate` (Registering New 3D Volumes)
Allocates a new 3D ULPIN for a unit, floor, or infrastructure corridor.

- **URL:** `POST /allocate`
- **Request Body:**
```json
{
  "parent_ulpin": "MH2700010001AA",
  "building_seq": "B0001",
  "cls": "U",
  "geometry": {
    "type": "Solid",
    "extents": [12.0, 10.0, 3.2]
  },
  "evidence_refs": ["E1_SANCTIONED_PLAN"],
  "plan_version": "1.0",
  "data_provenance": "SYNTHETIC",
  "boundary_convention": "INNER_FACE",
  "issuer_node_id": "MH"
}
```
- **Response (201 Created):**
```json
{
  "rid": "MH2700010001AA-B0001-U0001-K",
  "nk_digest": "M4F7Q8Z9A2B1C3D4",
  "nk_locator": "00018F42A1",
  "ict_result": "NEW",
  "version": 1
}
```

---

## 5. CesiumJS Implementation Recipes

### 5.1 Rendering Polyhedral Solids in CesiumJS
When receiving a mesh from `GET /resolve/{rid}?include_geometry=true`:
```javascript
// vertices: [[x,y,z], ...] relative to origin [lon, lat, height]
function renderSolidInCesium(viewer, featureData) {
  const origin = featureData.geometry.origin || [72.827, 18.999, 10.0];
  const originCartesian = Cesium.Cartesian3.fromDegrees(origin[0], origin[1], origin[2]);
  
  // Transform local mesh vertices to world Cartesians
  const localVertices = featureData.geometry.vertices;
  const faces = featureData.geometry.faces; // Triangles: [[0,1,2], [0,2,3], ...]
  
  const positions = [];
  for (const face of faces) {
    for (const vIdx of face) {
      const v = localVertices[vIdx];
      // Offset in meters from the ENU (East-North-Up) local origin:
      const enuOffset = new Cesium.Cartesian3(v[0], v[1], v[2]);
      const worldPos = Cesium.Matrix4.multiplyByPoint(
        Cesium.Transforms.eastNorthUpToFixedFrame(originCartesian),
        enuOffset,
        new Cesium.Cartesian3()
      );
      positions.push(worldPos);
    }
  }

  // Get color based on Property Class
  const classColors = {
    U: Cesium.Color.fromCssColorString('#E8A048').withAlpha(0.85), // Unit
    C: Cesium.Color.fromCssColorString('#6DB56D').withAlpha(0.75), // Common
    P: Cesium.Color.fromCssColorString('#8A8A8A').withAlpha(0.80), // Parking
    A: Cesium.Color.fromCssColorString('#38BDF8').withAlpha(0.30), // Airspace
    T: Cesium.Color.fromCssColorString('#B45309').withAlpha(0.90), // Subterranean
    E: Cesium.Color.fromCssColorString('#4A8BD4').withAlpha(0.85), // Metro Corridor
    I: Cesium.Color.fromCssColorString('#A855F7').withAlpha(0.85)  // Utility
  };

  const color = classColors[featureData.cls] || Cesium.Color.SLATEGRAY;

  const primitive = new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.Geometry({
        attributes: {
          position: new Cesium.GeometryAttribute({
            componentDatatype: Cesium.ComponentDatatype.DOUBLE,
            componentsPerAttribute: 3,
            values: Cesium.Cartesian3.packArray(positions)
          })
        },
        primitiveType: Cesium.PrimitiveType.TRIANGLES
      }),
      id: featureData.rid
    }),
    appearance: new Cesium.PerInstanceColorAppearance({
      flat: false,
      translucent: color.alpha < 1.0
    })
  });

  viewer.scene.primitives.add(primitive);
}
```

### 5.2 Enabling Subterranean View (Classes `T` and `I`)
By default, CesiumJS renders an opaque terrain surface. To view underground basements and metro tunnels:
```javascript
// Enable subterranean transparency in Cesium
viewer.scene.globe.translucency.enabled = true;
viewer.scene.globe.translucency.frontFaceAlphaByDistance = new Cesium.NearFarScalar(400.0, 0.0, 2000.0, 0.5);
viewer.scene.globe.translucency.backFaceAlphaByDistance = new Cesium.NearFarScalar(400.0, 0.0, 2000.0, 0.5);
viewer.scene.screenSpaceCameraController.enableCollisionDetection = false; // Allow camera below ground
```

### 5.3 Implementing the R1 Headline Feature ("Below / Above This Parcel")
When a user clicks any surface parcel or enters a ULPIN14:
1. Fetch all stacked 3D units intersecting the parcel column:
   ```javascript
   async function inspectParcelColumn(lon, lat) {
     const delta = 0.0005; // ~50m bounding box
     const zMin = -100;    // Deep basement / tunnel depth
     const zMax = 300;     // Airspace height
     
     const url = `http://localhost:8000/cover?bbox=${lon-delta},${lat-delta},${zMin},${lon+delta},${lat+delta},${zMax}`;
     const res = await fetch(url);
     const data = await res.json();
     
     // Sort results from subterranean (bottom) to sky (top)
     return data.features;
   }
   ```
2. Render a depth-sorted vertical tree sidebar in your UI showing:
   - $[+150\text{ m} \text{ to } +300\text{ m}]$: Class `A` (Airspace Lot)
   - $[+45\text{ m} \text{ to } +60\text{ m}]$: Class `E` (Elevated Metro Corridor)
   - $[+0\text{ m} \text{ to } +45\text{ m}]$: Classes `U`, `C`, `P` (Building Floors 1 to 15)
   - $[-15\text{ m} \text{ to } 0\text{ m}]$: Class `T` (Basement Car Parking & Foundations)
   - $[-35\text{ m} \text{ to } -25\text{ m}]$: Class `T` (Underground Metro Tunnel)

---

## 6. Examiner UI Mode & Defect Highlighting

When an examiner switches the viewer into **"Defect Mode"**:
1. Query `GET /validate/{rid}` for each active building.
2. Color code volumes by validation status instead of class color:
   - **`PASS`**: Muted Gray or Subtle Green (`#10B981`)
   - **`WARN`**: Vivid Amber (`#F59E0B`) with subtle pulsing border
   - **`FAIL`**: Bright Crimson (`#EF4444`) with glowing outline
   - **`UNVERIFIABLE`**: Deep Purple (`#8B5CF6`)
3. When the user clicks a `WARN` or `FAIL` unit, call `GET /explain/{finding_id}` and display the structured forensic drawer:
   - **Severity & Magnitude:** e.g. "Overlap volume $0.042\text{ m}^3$ exceeds tolerance $\sigma = 0.015\text{ m}$"
   - **Recommendation:** Plain-language guidance for the examiner
   - **Legal Basis:** Applicable Indian statute reference

---

## 7. Recommended Questions & Feedback Channel
If your frontend team needs additional custom projections, streaming 3D tiles, or custom query filters, reach out to the backend team. The backend is designed to be easily extensible!
