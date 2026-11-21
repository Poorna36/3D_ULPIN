# 3D ULPIN: Used Technologies, Standards & Evidence Framework

This document details the comprehensive geospatial, statutory, algorithmic, and architectural technologies used in the **Unified 3D Land Parcel Identification System (3D ULPIN)**, cross-referenced to the 11 system specification documents in `docs/` and the frontend/backend codebase.

---

## 1. India-First Design Doctrine & Statutory Foundations

The system is anchored directly to Indian property statutes, cadastral institutions, and data governance frameworks. International patterns (such as Singapore SLA, Netherlands Kadaster, and Victoria ePlan) are evaluated as comparative case studies with explicit *adopt / adapt / reject* decisions ([docs/decisions.md](file:///d:/second%20chance/docs/decisions.md#L5-L15)).

| International Pattern | Source System | Decision | Indian Adaptation / Statutory Anchor |
| :--- | :--- | :--- | :--- |
| **Lot-series class typing (S, B, L, U, etc.)** | Singapore SLA | **ADAPT** | Mapped directly to Indian statutory concepts (RERA 2016, State Apartment Ownership Acts). |
| **Fixed geometry-derived identifier** | Indian ULPIN (DoLR) | **ADAPT** | Retained as the 14-char parent prefix (`ULPIN14`), adding sequential RID to preserve lifecycle persistence through remodelling. |
| **Single centralized registry node** | Netherlands / Singapore | **REJECT** | Land is a State subject under the Constitution of India (Seventh Schedule, List II, Entry 18). A federated model with state nodes (**MH Node**, **KA Node**) is mandatory. |
| **Automatic 3D title for subsurface/airspace** | Foreign Systems | **REJECT** | Requires explicit statutory basis or easement grants; unrecognised volumes are flagged as `ASSUMED` or `UNVERIFIABLE`. |

---

## 2. NAKSHA (Department of Land Resources - DoLR)

* **5% Area Tolerance Precedent:**
  Under the Indian Land Records Modernisation Programme (DILRMP/NAKSHA), the published **5% parcel-area tolerance rule** serves as the mathematical ancestor for our uncertainty-aware 3D probabilistic tolerance checks ([docs/validation.md](file:///d:/second%20chance/docs/validation.md#L115-L117)).
  $$\tau_{\text{NAKSHA}} = 5\% \quad \Longrightarrow \quad 2\sigma_c = 0.34\,\text{m} \text{ (linear equivalent)}$$
* **Parent Cadastral Anchors (Class S):**
  Every 3D spatial object is bound to a 14-character birth parcel column (Class $S$, Surface Parcel Column) derived directly from NAKSHA/DoLR 2D cadastre (e.g., `IN-KA-BLR-000101` and `IN-MH-MUM-002014`).
* **Bridging the Megacity Gap:**
  NAKSHA's pilot focused on small urban local bodies (< 3,500 hectares, < 200,000 population) and publicly deferred the high-rise megacity problem ([docs/architecture.md](file:///d:/second%20chance/docs/architecture.md#L49-L55)). 3D ULPIN implements that exact deferred vertical layer.

---

## 3. LiDAR (Light Detection and Ranging & Point Clouds)

The system incorporates three tiers of LiDAR evidence ([docs/pipeline.md](file:///d:/second%20chance/docs/pipeline.md#L50-L60)):

* **Airborne Nadir LiDAR ($E_1$):**
  - High-altitude airborne point clouds and Normalised Digital Surface Models (nDSM).
  - Used by Subsystem **H1 (Building Extraction)** to extract rooflines, maximum structural heights, building footprints, and mandatory setback buffers.
  - Sensor-noise modeling based on ray-cast simulation with configurable Gaussian noise ($\sigma_r = 0.05\,\text{m}$) ([docs/implementation_plan.md](file:///d:/second%20chance/docs/implementation_plan.md#L292)).
* **Terrestrial & Mobile LiDAR ($E_2$ & $E_3$):**
  - $E_2$: Mobile mapping/UAV oblique scans capturing building envelopes and facade geometries.
  - $E_3$: Terrestrial interior laser scans capturing unit internal partitions, common corridors, and stairwells.
* **Point-Cloud Deep Learning (KPConv / RandLA-Net):**
  - Integrated into the H1 neural architecture ([docs/aiml.md](file:///d:/second%20chance/docs/aiml.md#L37-L42)) for semantic segmentation of point clouds into ground, building envelope, vegetation, and infrastructure.
* **Zero Silent PASS Upgrades Doctrine:**
  - Where evidence is insufficient (e.g., verifying interior unit partitions using only airborne LiDAR $E_1$ without terrestrial scan $E_3$), the validation engine strictly outputs **`UNVERIFIABLE (needs E3)`** ([docs/eval_results.md](file:///d:/second%20chance/docs/eval_results.md#L11-L15)).
* **Rotterdam AHN4 Open LiDAR Benchmark:**
  - Employs open Dutch national LiDAR (Actueel Hoogtebestand Nederland 4) as a physical real-world benchmark for sensor-noise characterisation.

---

## 4. BIM (Building Information Modeling & IFC 4.3)

* **As-Built BIM Evidence ($E_4$):**
  - Ingests as-built BIM models, floor plan drawings, and architectural CAD exports.
  - Feeds into **Subsystem H2.1 (Plan Vectoriser)** and **H3 (Vertical Parcel Delineation)** to delineate closed, 2-manifold unit solids (Class $U$), common areas (Class $C$), and parking spaces (Class $P$).
* **Interactive 3D Interior Walkthrough:**
  - [InteriorWalkthrough.jsx](file:///d:/second%20chance/frontend/src/components/InteriorWalkthrough.jsx) provides real-time level-by-level navigation through structural floor slabs, internal room suites, entrance atriums, and vertical service shafts.
* **Lossless IFC 4.3 Export:**
  - [CadastreExportModal.jsx](file:///d:/second%20chance/frontend/src/components/CadastreExportModal.jsx) generates valid **IFC 4.3 JSON** where:
    - Each apartment unit is modelled as `IfcSpace` with canonical `LongName=RID`.
    - Levels are decomposed into `IfcBuildingStorey`.
    - Project context is structured under `IfcProject` and `IfcBuilding`.

---

## 5. Survey of India (SoI) CORS Covariance & Error Propagation

* **Continuous Operating Reference Stations (CORS):**
  - Leverages Survey of India CORS GNSS network baseline uncertainties ([docs/eval_results.md](file:///d:/second%20chance/docs/eval_results.md#L72)).
  - Propagates horizontal and vertical covariance through coordinate transformation Jacobian matrices:
    $$\Sigma_{\text{obs}} = \begin{bmatrix} \sigma_{x}^2 & \sigma_{xy} & 0 \\ \sigma_{yx} & \sigma_{y}^2 & 0 \\ 0 & 0 & \sigma_{z}^2 \end{bmatrix}, \quad \sigma_{xy} \approx 0.024\,\text{m}, \quad \sigma_z \approx 0.045\,\text{m}$$
* **Mathematical Validation Thresholds:**
  - Validation predicates evaluate combined uncertainty $\sigma_c = \sqrt{\sigma_{\text{exp}}^2 + \sigma_{\text{obs}}^2}$.
  - Overlap and containment tests utilize **Monte-Carlo tolerance testing** ($N=200$ samples perturbed by covariance $\Sigma_v$) rather than naive rigid boolean checks.

---

## 6. Municipal Sanction & AutoDCR Framework

* **Sanctioned CAD Drawings:**
  - Ingestion of municipal building sanction plans (MCGM AutoDCR in Mumbai, BBMP in Bengaluru).
  - Supplies the *expected legal model* containing approved floor plates, sanctioned floor space index (FSI), and unit layouts.
* **Hungarian Linear Assignment Algorithm (Tier T3):**
  - Compares sanctioned plan units against sensor-observed units using the Hungarian algorithm ([docs/validation.md](file:///d:/second%20chance/docs/validation.md#L121-L134)):
    $$\text{Cost}(E_i, O_j) = \lambda_1 (1 - \text{IoU}_{3D}(E_i, O_j)) + \lambda_2 [\text{class}(E_i) \neq \text{class}(O_j)] + \lambda_3 [\text{parent}(E_i) \neq \text{parent}(O_j)]$$
  - Detects unapproved extra floors, demolished levels, footprint deviations, and setback breaches.

---

## 7. RERA Statutory Compliance & Undivided Share (UDS %)

* **Real Estate (Regulation and Development) Act 2016 (RERA):**
  - RERA carpet-area statutory definition is enforced as the boundary convention (`INNER_FACE`).
  - Unit counts per floor are verified against official RERA project disclosures.
* **Undivided Share (UDS %) Invariant (Tier T4):**
  - In high-rise apartment complexes, the sum of undivided land ownership shares across all unit titles must strictly balance to 100%:
    $$\sum_{i=1}^{N} \text{UDS}_i = 100.00\% \quad (\pm \epsilon_{\text{statutory}})$$
  - Any orphan right or UDS imbalance triggers a Tier T4 cadastral violation.
* **State Apartment Ownership Acts:**
  - Maharashtra Apartment Ownership Act 1970 (Section 4/5).
  - Karnataka Apartment Ownership Act 1972 (Section 5).

---

## 8. Subsurface GPR & Geotechnical Infrastructure ($E_5$)

* **Evidence Class $E_5$:**
  - Subsurface Ground Penetrating Radar (GPR) and geotechnical alignment surveys.
* **Volumetric Subterranean Corridors:**
  - Class $T$ (Subterranean Transit Tunnels / Metro Rail): e.g., MMRC Metro Aqua Line 3 tunnel at $z = -16\,\text{m}$.
  - Class $I$ (Municipal Utility Networks): e.g., subsurface storm water drains (*Raja Kaluve*) and utility conduits at $z = -2.5\,\text{m}$.
* **Real-World Dispute Simulation:**
  - Interactive testing of regulatory clearance zones (e.g., 50m statutory safety buffer under the *Metro Railways Act 1978*) and unrecorded storm drain encroachments ([docs/decisions.md](file:///d:/second%20chance/docs/decisions.md#L137-L186)).

---

## 9. Advanced AI/ML Subsystems (H1–H4)

The platform incorporates four dedicated machine learning subsystems ([docs/aiml.md](file:///d:/second%20chance/docs/aiml.md)):

```
   Airborne Imagery / LiDAR
             │
             ▼
    ┌──────────────────┐
    │   H1 Extractor   │ (ResNet-34 U-Net + KPConv)
    └────────┬─────────┘
             │
             ├──────────────────────────┐
             ▼                          ▼
    ┌──────────────────┐       ┌──────────────────┐
    │  H2.1 Vectoriser │       │  H2.2 DP Viterbi │
    │   (U-Net + OCR)  │       │ (Peak Alignment) │
    └────────┬─────────┘       └────────┬─────────┘
             │                          │
             └─────────────┬────────────┘
                           ▼
                  ┌──────────────────┐
                  │   H3 GNN + ILP   │ (Watertight 3D Units)
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │   H4 Anomaly ML  │ (Isolation Forest + Graph Scorer)
                  └────────┬─────────┘
                           │
                           ▼
                  Examiner Console (T5)
```

1. **H1 (Automated Building Extraction):**
   - ResNet-34 U-Net encoder-decoder fusing 4-channel tensors (RGB + nDSM) with transposed convolutions.
   - Evaluated using IoU, Boundary F1 (2px tolerance), and Height Mean Absolute Error (MAE).
2. **H2.1 (Plan-Side Vectoriser):**
   - Deep learning wall/door/window segmentation over scanned floor plan rasters combined with OCR room label recognition.
3. **H2.2 (Sensor-Side Level Inference):**
   - Viterbi dynamic programming peak alignment reconstructing vertical floor heights from facade point clouds.
4. **H3 (Vertical Parcel Delineation):**
   - Room Adjacency Graph Neural Network (GNN) combined with Integer Linear Programming (ILP) optimizer to enforce closed, watertight, non-overlapping 3D unit volumes.
5. **H4 (Intelligent Topology Validation):**
   - Scikit-learn `IsolationForest` anomaly scorer with 2-hop spatial adjacency graph risk propagation and active learning triage for the T5 Examiner Console.

---

## 10. Open Geospatial Standards & Lossless Interoperability

The platform supports 100% lossless cadastral roundtripping across three international open standards ([docs/eval_results.md](file:///d:/second%20chance/docs/eval_results.md#L53-L62)):

1. **ISO 19152:2024 (LADM Part 2 - Land Administration Domain Model):**
   - Land administration packages mapping spatial units (`LA_SpatialUnit`), administrative legal titles (`LA_BAUnit`), and rights, restrictions, responsibilities (`LA_Right`).
2. **IFC 4.3 JSON (Industry Foundation Classes):**
   - OpenBIM standard mapping physical spaces into `IfcSpace` with canonical `LongName=RID`.
3. **CityJSON 1.1:**
   - JSON-based international standard for 3D city models supporting LOD2.2 solid geometries.

---

## 11. Multi-Tier Cadastral Validation Engine (T0–T5)

The validation pipeline enforces a strict 6-tier validation stack with mathematical predicates operating via `trimesh`, `shapely`, and `scipy.spatial` ([docs/validation.md](file:///d:/second%20chance/docs/validation.md#L1-L14)):

* **T0 (Data Integrity):** Schema compliance, CRS consistency (EPSG:4979 / WGS84 3D), mandatory `data_provenance` tag, and hash-chain ledger integrity.
* **T1 (Geometric Validity):** ISO 19107 solid validity via **val3dity** (watertight, orientable 2-manifold closed surface, consistent outward normal vectors, non-self-intersecting).
* **T2 (Cadastral Topology):** Pairwise no-overlap predicate, volume conservation invariant ($\le 0.01\%$ slack), containment within parent envelope, and vertical floor order.
* **T3 (Plan-vs-As-Built Reconciliation):** Hungarian matching between sanctioned drawings and observed geometry (detects extra/missing floors, height deviations, and setback encroachments).
* **T4 (Administrative & Rights Consistency):** Undivided share balance ($\sum UDS = 100\%$), right scopes matching the RID tree, no orphan rights, and utility easement cross-checks.
* **T5 (Human Examiner Review Console):** Triage of findings ranked by the H4 anomaly scorer with interactive examiner actions: **ACCEPT**, **REJECT**, or **STATUTORY OVERRIDE** (requiring justification notes and audit logging).

---

## 12. Complete 31-Defect Cadastral Taxonomy

The engine classifies topological defects across 6 statutory categories ([docs/validation.md](file:///d:/second%20chance/docs/validation.md#L196-L260)):

| Category | Defect Classes Included |
| :--- | :--- |
| **A.1 Geometry** | `OVERLAP`, `GAP`, `DISCONNECTED_SOLID`, `NON_MANIFOLD`, `INVERTED_NORMALS` |
| **A.2 Containment** | `CHILD_OUTSIDE_PARENT`, `LEVEL_OUTSIDE_ENVELOPE`, `BUILDING_OUTSIDE_PARCEL` |
| **A.3 Vertical** | `EXTRA_LEVEL`, `MISSING_LEVEL`, `WRONG_FLOOR_HEIGHT`, `VERTICAL_DRIFT`, `DATUM_OFFSET_ERROR` |
| **A.4 Plan-vs-As-Built** | `SETBACK_BREACH`, `FOOTPRINT_DEVIATION`, `UNIT_COUNT_MISMATCH`, `UNIT_VOLUME_MISMATCH`, `BASEMENT_MISMATCH`, `PARKING_COUNT_MISMATCH`, `UNAUTHORISED_STRUCTURE`, `DEMOLISHED_NOT_UPDATED` |
| **A.5 Rights & RRR** | `OWNERSHIP_VOLUME_OVERLAP`, `UTILITY_WITHOUT_EASEMENT`, `AIR_LOT_INTRUSION`, `CORRIDOR_CLEARANCE_BREACH`, `ORPHAN_RIGHT`, `UDS_MISMATCH` |
| **A.6 Identity & Lineage** | `DUPLICATE_RID`, `ICT_MISCONTINUATION`, `STALE_PARCEL_LINEAGE`, `BROKEN_LINEAGE_CHAIN` |

---

## 13. Dual-State Federation & Legacy Crosswalk

The registry enforces constitutional state land jurisdiction via a federated multi-node model ([docs/decisions.md](file:///d:/second%20chance/docs/decisions.md#L107-L134)):

```
                     3D ULPIN Federation
                              │
             ┌────────────────┴────────────────┐
             ▼                                 ▼
         Node MH                           Node KA
      (Maharashtra)                      (Karnataka)
             │                                 │
     • MCGM GIS                        • BBMP GIS
     • MahaRERA                        • K-RERA
     • CTS City Survey Cards           • e-Aasthi (e-PID)
     • MH Apartment Act 1970           • UPOR Cards
                                       • KA Apartment Act 1972
```

* **Legacy Identifier Crosswalk:**
  Maintains verified relational links to historical identifiers (`CTS`, `PID`, `UPOR`, `SURVEY`, `RERA`, `ULPIN`) as immutable attributes with lineage, without breaking the canonical 3D-ULPIN RID string.

---

## 14. 3D Web Visualization & Client Engine

* **CesiumJS & 3D Tiles:**
  - Photorealistic global 3D globe rendering using CesiumJS.
  - High-performance streaming of Google Photorealistic 3D Tiles and OSM 3D Buildings.
  - Custom shader styling, atmospheric lighting, and hardware-accelerated rendering.
* **Volumetric 10-Class Representation:**
  - Real-time 3D extrusion of all 10 property classes:
    - **Class A (Airspace):** Translucent golden boundary ceilings.
    - **Class B (Envelope):** Sanctioned physical glass envelopes.
    - **Class L (Levels):** High-rise floor plates.
    - **Class U & C (Units & Common):** Color-coded individual strata suites and fire exit corridors.
    - **Class P (Parking):** Subsurface multi-tier automated parking vaults.
    - **Class T (Tunnels):** Deep subterranean rail transit cylinders ($z = -16\,\text{m}$ to $-28\,\text{m}$).
    - **Class E (Viaducts):** Elevated metro viaduct corridors ($z = +14\,\text{m}$).
    - **Class I (Utilities):** Subsurface drainage corridors (*Raja Kaluve*).
* **Vite + React:**
  - High-performance reactive state management with client-side mathematical evaluation, zero-latency caching, and full responsive layout.

