# 8.4 OpenAPI REST Endpoint Contracts

The 3D ULPIN registry service exposes a clean, typed REST interface implementing seven primary operations. The entire API is served via FastAPI with auto-generated OpenAPI documentation.

---

### 8.4.1 `POST /allocate`

Allocate a new 3D ULPIN (RID) under an authorised session.

**Request Body:**

```json
{
  "parent_ulpin": "string (14-char ULPIN, real or PROXY)",
  "building_seq": "string (B + 4 Crockford base-32 chars, default B0000)",
  "cls": "string enum: S|B|L|U|C|P|A|T|E|I",
  "geometry": {
    "type": "Solid",
    "coordinates": "array (3D polyhedral surface coordinates)",
    "crs": "string (e.g. EPSG:4326)",
    "datum_id": "string"
  },
  "evidence_refs": ["string (evidence IDs)"],
  "plan_version": "string",
  "data_provenance": "string enum: REAL|PROXY|SYNTHETIC",
  "boundary_convention": "string enum: INNER_FACE|WALL_CENTRE|OUTER_FACE (default INNER_FACE)",
  "parent_rid": "string (RID of parent object, e.g. building RID for a level)",
  "spans": ["string (ULPINs this object spans, for E/T/I classes)"]
}
```

**Response 201 Created:**

```json
{
  "rid": "string (the allocated 3D ULPIN RID)",
  "nk_digest": "string (base32 SHA-256 truncated to 128 bits)",
  "nk_locator": "string (3D Morton key)",
  "ict_result": "string enum: NEW|CONTINUE|SPLIT|MERGE|AMBIGUOUS",
  "binding_record_hash": "string",
  "version": 1
}
```

**Error Responses:**
- `409 Conflict`: ICT returned AMBIGUOUS — examiner review required
- `422 Unprocessable Entity`: Validation error (invalid geometry, missing fields)

---

### 8.4.2 `GET /resolve/{rid}`

Resolve a 3D ULPIN to its current state, or perform reverse lookup via legacy land revenue identifier.

**Parameters:**
- `rid` (path, required/optional): The 3D ULPIN (RID) to resolve
- `include_geometry` (query, optional, default `false`): Include canonical 3D mesh geometry
- `legacy_system` (query, optional): Legacy registry authority (e.g. `CTS`, `CS`, `EPID`, `EAASTHI`, `UPOR`)
- `legacy_value` (query, optional): Legacy deed identifier (e.g. `Plot 412/1A`, `BBMP-104-W22-P04`)

**Response 200:**

```json
{
  "rid": "string",
  "cls": "string enum: S|B|L|U|C|P|A|T|E|I",
  "status": "string enum: ALLOCATED|ACTIVE|REVISED|SUPERSEDED|MERGED|SPLIT|DEMOLISHED|DISPUTED",
  "parent_rid": "string",
  "parent_ulpin": "string",
  "current_nk": {
    "digest": "string",
    "locator": "string",
    "version": 1
  },
  "current_parcel_ulpin": "string",
  "data_provenance": "string",
  "legal_basis_status": "string",
  "statutory_anchor": {
    "act_name": "Maharashtra Apartment Ownership Act, 1970 (or Karnataka Apartment Ownership Act, 1972)",
    "section": "Section 4 & 5 (Deed of Apartment & Floor Plan Registration)",
    "statutory_basis": "ENACTED",
    "carpet_area_standard": "RERA 2016 Section 2(k)",
    "citation_ref": "MAH-ACT-XV-1971 / RERA-2016-SEC-14"
  },
  "legacy_ids": [{"id_system": "CTS", "legacy_value": "123/456"}],
  "spans": ["string"],
  "geometry": "object (only if include_geometry=true)",
  "issuer_node_id": "string (e.g. MH, KA)"
}
```

**Error:** `404 Not Found`: RID not found

---

### 8.4.3 `POST /verify`

Verify a candidate geometry against a registered RID.

**Request Body:**

```json
{
  "rid": "string",
  "geometry": "object (candidate 3D geometry)"
}
```

**Response 200:**

```json
{
  "result": "string enum: MATCH|DRIFT|NOT_SAME",
  "computed_digest": "string",
  "registered_digest": "string",
  "ict_score": 0.95,
  "iou3d": 0.92,
  "confidence": 0.88,
  "uncertainty": {
    "sigma_xy": 0.03,
    "sigma_z": 0.05
  }
}
```

---

### 8.4.4 `GET /lineage/{rid}`

Full hash-chained history of an RID.

**Response 200:**

```json
{
  "rid": "string",
  "versions": [
    {
      "version": 1,
      "nk_digest": "string",
      "timestamp": "2026-09-20T12:00:00Z",
      "evidence_refs": ["string"],
      "plan_version": "string",
      "prev_hash": "string",
      "record_hash": "string",
      "sign_off": {"examiner_id": "string", "timestamp": "string"}
    }
  ],
  "lineage_edges": [
    {
      "type": "string enum: SUPERSEDES|SPLIT_FROM|MERGED_FROM|DEMOLISHED",
      "from_rid": "string",
      "to_rid": "string",
      "timestamp": "string"
    }
  ]
}
```

---

### 8.4.5 `GET /cover`

Spatial query returning RIDs within a bounding box.

**Parameters:**
- `bbox` (query, required): `min_lon,min_lat,min_h,max_lon,max_lat,max_h`
- `cls` (query, optional): Filter by class(es)
- `data_provenance` (query, optional): Filter by provenance
- `lod` (query, optional): Tier fidelity filter (A, B, C)
- `format` (query, optional, default `summary`): `summary` or `geojson_3d` (GeoJSON polygon footprint with `height` and `extrudedHeight` properties for instant CesiumJS ingestion)

**Response 200:**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "rid": "string",
      "cls": "string",
      "data_provenance": "string",
      "validation_status": "string enum: PASS|WARN|FAIL|UNVERIFIABLE",
      "tier": "string",
      "geometry": "object (LOD-appropriate geometry)"
    }
  ],
  "total_count": 42
}
```

**Response 200 (`format=geojson_3d` Format for CesiumJS):**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "MH2700010001AA-B0001-U0001-K",
      "properties": {
        "rid": "MH2700010001AA-B0001-U0001-K",
        "cls": "U",
        "height": 14.5,
        "extrudedHeight": 17.7,
        "data_provenance": "SYNTHETIC",
        "validation_status": "PASS",
        "fill_color": "#E8A048"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[72.8270, 18.9990], [72.8272, 18.9990], [72.8272, 18.9992], [72.8270, 18.9992], [72.8270, 18.9990]]]
      }
    }
  ],
  "total_count": 42
}
```

---

### 8.4.6 `GET /explain/{finding_id}`

Full explain object for a validation finding. See [validation.md](validation.md#75-explain-object-schema) for the complete JSON schema.

---

### 8.4.7 `GET /validate/{rid}`

Run the full validation tier stack on an RID.

**Parameters:**
- `rid` (path, required): The RID to validate
- `tiers` (query, optional, default "T0,T1,T2,T3,T4"): Comma-separated tier list

**Response 200:**

```json
{
  "rid": "string",
  "overall_status": "string enum: PASS|WARN|FAIL|UNVERIFIABLE",
  "tier_results": [
    {
      "tier": "T0",
      "status": "PASS",
      "findings": []
    },
    {
      "tier": "T2",
      "status": "WARN",
      "findings": [{"finding_id": "...", "finding_type": "...", "severity": "WARN"}]
    }
  ],
  "evidence_sufficiency": {
    "available": ["E1", "E2"],
    "required_for_full_pass": ["E1", "E2", "E3"],
    "unverifiable_checks": ["unit_partition_alignment (needs E3)"]
  },
  "rera_compliance": {
    "sanctioned_carpet_area_sqm": 84.50,
    "as_built_carpet_area_sqm": 87.10,
    "carpet_area_delta_sqm": 2.60,
    "deviation_percentage": 3.07,
    "rera_compliance_status": "TOLERANCE_WARNING",
    "statutory_citation": "RERA 2016 Section 14(2) — Adherence to Sanctioned Plans"
  }
}
```

> **Note on `rera_compliance`:** Populated only when `class=U` (Private Unit) and sanctioned plan area evidence is available. `rera_compliance_status` values: `PASS` (≤ 2%), `TOLERANCE_WARNING` (2–5%), `FAIL` (> 5%). Absent when `evidence_class < E2`.
