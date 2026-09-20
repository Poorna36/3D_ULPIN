# System Configuration, Technology Stack & Governance Roadmap

## 8.2 Technology Stack

The entire system runs locally inside a **single Python process** with zero external database daemons or live background services.

| Concern | Component | Implementation Detail |
|---------|-----------|----------------------|
| **API and Server** | FastAPI + Uvicorn | Single-process ASGI server (`uvicorn main:app --reload`); typed routes; auto-generated OpenAPI docs |
| **Relational Registry** | SQLite (WAL mode) | Embedded single file (`registry.db`); zero daemon setup; sub-millisecond local queries; ACID-compliant |
| **3D Computational Geometry** | `trimesh` + `shapely` + `scipy.spatial` | In-memory 3D mesh booleans, prism extrusions, exact `vol(A intersection B)` intersection tests |
| **Point-Cloud / GIS Processing** | PDAL, GDAL, IfcOpenShell, ezdxf | Direct Python libraries for LAS/LAZ, GeoTIFF, DXF, IFC — no external services |
| **ML Inference** | PyTorch / ONNX Runtime + scikit-learn | Pre-trained model weights executed in-process |
| **Evidence and File Storage** | Local filesystem (`./data/`) | Point clouds, meshes, floor plans served via FastAPI static mount |
| **Spatial Indexing and Caching** | In-memory Morton grid / R-tree + `lru_cache` | Nanosecond-level lookups for `/resolve` and `/cover` |
| **Lineage and Audit** | W3C PROV records | Stored in SQLite as JSON with SHA-256 hash chaining |
| **Hashing** | `hashlib` (stdlib) | SHA-256 for NK digest and audit chain |
| **Check Symbol** | Custom ISO 7064 MOD 37,36 implementation | Pure Python, tested with conformance vectors |

---

## 8.3 Non-Functional Targets

| Property | Target | Requirement Source |
|----------|--------|-------------------|
| Latency | Sub-millisecond `/resolve` and `/cover` (in-memory execution) | R24; M5 |
| Interoperability | Round-trip RID to LADM to IFC to CityGML with ID preservation | R27; C9 |
| Privacy | No personal data in identifiers; `Right.holder` pseudonymised | DPDP Act 2023 |
| Auditability | Every finding is an explain object; every version hash-chained | R28, R29 |
| Honesty of uncertainty | `UNVERIFIABLE` is first-class; never silently upgraded to PASS | D2 |
| Data transparency | Every object carries `data_provenance`; REAL vs SYNTHETIC never conflated | D0.4 |
| Scale (registry) | 10^6 to 10^7 RID allocations with zero collisions | R24; M5 |
| Scale (spatial query) | `/cover` over 10^6 objects returns in < 100 ms | R24 |

---

## 9. Government Adoption Roadmap & Governance

### 9.1 Phased Deployment Strategy

#### Phase 1: Central Standard Setting

- **DoLR publishes the RID grammar** as an additive extension alongside the existing ULPIN technical note.
- No state action needed because P3 guarantees the base ULPIN is untouched.
- Conformance suite developed and published as a certification gate.

#### Phase 2: Two-State Pilot (This Project's Scope)

- Two Revenue Department / Land Records nodes (Maharashtra, Karnataka) run the same grammar and conformance suite on named micro-zones.
- Mirrors how DILRMP itself was first piloted in a handful of states (MP, AP, Odisha, Assam, Bihar, MH, RJ, GJ, 1988–89) before national extension.
- **Demo:** two nodes, same code, different legal-profile configuration (`legal_basis_status` rules per state).

#### Phase 3: Conformance Certification Gate

- Before a third state node allocates RIDs, it must pass the collision/determinism/error-detection test suite.
- This mechanism keeps "federated" from becoming "fragmented."

#### Phase 4: Land Stack Integration

- Once two or three state nodes are stable, expose `/resolve` and `/verify` behind the national Land Stack.
- Same pattern as state DILRMP data already feeding national reporting.

#### Phase 5: Legal Extension (Parallel Track)

- Classes U/C/P can be issued from day one (Apartment Ownership Acts back them).
- Classes A (airspace) and T (subterranean) issued as `legal_basis_status = ASSUMED` spatial objects from day one.
- A state or DoLR would need to extend a state Apartment Ownership Act or pass a dedicated instrument before those carry full transferable legal title.
- The system is built so this catch-up happens *later* without any RID or grammar change.

---

### 9.2 Government Contact Points

| Level | Body | Role for 3D ULPIN Rollout |
|-------|------|--------------------------|
| **National / Nodal** | Department of Land Resources (DoLR), Ministry of Rural Development, with NIC as technical delivery partner | Owns and publishes the grammar extension as a national standard; runs conformance suite as certification gate |
| **State — Land Records** | State Revenue Department + Directorate/Commissioner of Land Records | Issuing authority and registry-node operator; **first point of contact** for pilot (land records = State List subject) |
| **State — Urban/Building** | Urban Development Department via city body: MCGM (AutoDCR) in MH, BBMP/GBA (OBPS/e-Aasthi) in KA | Supplies building-plan pipeline (B/L/U/C/P); needs data-sharing MoU with Revenue Department |
| **National Platform** | Land Stack (launched 31 Dec 2025, Chandigarh + Tamil Nadu) | Integration target for `/resolve` and `/verify` endpoints |
| **Survey / Geodesy** | Survey of India (SoI) for CORS/GNSS control; state survey departments (KSRSAC for Karnataka) | Georegistration backbone for NK layer |

---

### 9.3 Examiner Console Specifications

#### 9.3.1 Views

| View | Description |
|------|------------|
| **Sanctioned Plan** | Expected 3D model derived from approved plans |
| **As-Built / Observed** | Observed 3D model from sensor evidence |
| **Difference** | Overlay showing discrepancies with colour-coded severity |
| **Section Cut** | Horizontal or vertical section through the building at any height/position |
| **Below/Above This Parcel** | Vertical X-ray cutaway showing all RIDs stacked in depth order (the R1 headline query) |

#### 9.3.2 Layer Filtering

Each object class (S, B, L, U, C, P, A, T, E, I) is independently togglable. Additional filters:

| Filter | Options |
|--------|---------|
| Class | Any subset of {S, B, L, U, C, P, A, T, E, I} |
| Data Provenance | REAL / REAL-FOREIGN / PROXY / SYNTHETIC |
| Validation Status | PASS / WARN / FAIL / UNVERIFIABLE |
| Tier Fidelity | A (Hero) / B (Context) / C (Backdrop) |
| Evidence Class | E1 through E5 |

#### 9.3.3 Visual Hierarchy

- **Class-coloured volumes:** each CLS gets a fixed colour used everywhere. Units (U) in warm amber, common (C) in soft green, parking (P) in grey, airspace (A) translucent outline, subterranean (T) and utility (I) below ground-plane cutaway, elevated (E) in a distinct saturated colour.
- **IDs never permanent on-screen.** At zone scale, no text. On hover/tap: outline + glow + side card showing RID, class, provenance badge, validation status dot.
- **Dark basemap** so 3D volumes read clearly (same convention as Kadaster 3D Basisvoorziening viewer and BIM viewers).

#### 9.3.4 Audit Trail

- Hash-chained log viewable per RID
- Examiner sign-off (mock signature) recorded with timestamp
- Override history: every tolerance override or manual status change recorded
- Plan version history with diff visualisation

---

### 9.5 Standards Stack Reference

| Standard | Used For | Scope | India-First Note |
|----------|---------|-------|-----------------|
| ISO 19152-2:2025 (LADM Part 2) | Legal spaces, RRR, spatial units; India profile | Core | Adopted formally; a standard to profile, not a system to copy |
| ISO 19107 / val3dity | Geometry validity | Core | Generic geometry math, not jurisdiction-specific |
| IFC | Physical building model; IfcSpace to legal space; GlobalId to RID | Import/Export | Optional richer input; AutoDCR CAD/DXF is the default |
| CityGML 3.0 / CityJSON | Semantic 3D city exchange | Export | — |
| OGC API – Features / 3D GeoVolumes | Access | Core | — |
| 3D Tiles / glTF | Visualisation | Core | — |
| LandXML / OGC LandInfra | Survey exchange | Optional | — |
| ISO 7064 | Check symbol | Core | — |
| ECCMA Property Identifier Standard | ULPIN compatibility | Core | Contractually bound (P3) |
| W3C PROV | Provenance | Core | Carries the REAL/SYNTHETIC label |

---

### 9.6 Build Order (Dependency-Ordered)

| Step | Component | Dependencies | R-IDs Covered |
|------|-----------|-------------|---------------|
| 0 | **Freeze micro-zones** — map boundaries, hero towers from RERA counts, confirm Rotterdam/SLA access | None | B3 |
| 1 | **Data provenance ledger** — `data_provenance` convention + real-anchor ingestion | Step 0 | D0 |
| 2 | **3D ULPIN core** — grammar, check symbol, NK, SA, registry, ICT, lineage, API, conformance | Step 1 | R9, R25, R2 |
| 3 | **Generator + simulators** — objects for all classes, placed on real footprints; defects | Step 1, 2 | M, R3–R8 |
| 4 | **Normaliser + georegistration** — CORS/GCP model, datum, Sigma propagation | Step 1 | R18, D3 |
| 5 | **Expected-model builder** — plan to levels/units/commons; extrusion; RERA-aware | Step 1, 4 | R17, F |
| 6 | **Evidence extraction** — H1 building extraction, H2 floor segmentation, D4 level inference | Step 3, 4 | R14–R16, R19–R21 |
| 7 | **Delineation + ICT + RID allocation** | Step 2, 5, 6 | R10, R22 |
| 8 | **Validation and reconciliation** — probabilistic predicates; H4 ranking | Step 7 | R23, R29 |
| 9 | **Rights model and overlap semantics** — LADM/IFC/CityGML export | Step 7 | R26, R27 |
| 10 | **Examiner console** — all views, queries, two-city scenarios | Step 8, 9 | R28, R30 |
| 11 | **Evaluation** — final honesty pass, REAL vs SYNTHETIC consistency | All | M4–M5 |
