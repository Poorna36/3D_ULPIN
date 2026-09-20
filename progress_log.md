# Backend Progress Log — 3D ULPIN Generation & Vertical Property Mapping System

**Project:** SIH26011  
**Full Spec:** [docs/implementation_plan.md](docs/implementation_plan.md)  
**Architecture:** [docs/architecture.md](docs/architecture.md)

> Tick `[x]` when a sub-task is fully done **and** its acceptance criteria pass.  
> Tick the phase header only when **every** sub-task below it is done.

---

## Phase 0 — Data Reconnaissance & Zone Freeze
> Spec: [docs/data.md](docs/data.md)

- [ ] **0.1** Confirm MZ-1 (South Mumbai / Fort / Nariman Point) boundary polygon → `data/real/mz1_boundary.geojson`
- [ ] **0.2** Confirm MZ-2 (Dharavi / Mahim / BKC) boundary polygon → `data/real/mz2_boundary.geojson`
- [ ] **0.3** Confirm BZ-1 (Bengaluru CBD / MG Road) boundary → `data/real/bz1_boundary.geojson`
- [ ] **0.4** Confirm BZ-2 (Whitefield / EPIP Zone) boundary → `data/real/bz2_boundary.geojson`
- [ ] **0.5** Identify hero tower per zone from RERA (name, project ID, unit count, floor count) → `data/real/{zone}_hero_tower.json`
- [ ] **0.6** Download Overture Maps building footprint tiles for all four zones → `data/real/{zone}_overture_footprints.geojson`
- [ ] **0.7** Attempt MCGM open-data GIS parcel layer; log provenance / paywall status → `data/real/mcgm_provenance_log.json`
- [ ] **0.8** Attempt UPOR / e-Aasthi open parcel data (BZ-1/BZ-2); log provenance → `data/real/upor_provenance_log.json`
- [ ] **0.9** Download BMRCL Namma Metro alignment + MMRC Aqua Line corridor GeoJSON → `data/real/bmrcl_alignment.geojson`, `data/real/mmrc_alignment.geojson`
- [ ] **0.10** Download Rotterdam AHN3/AHN4 point-cloud tiles + Singapore SLA 3D tiles (document if unavailable) → `data/foreign/`
- [ ] **0.11** Download Bhuvan SRTM 30 m DEM for all pilot bounding boxes → `data/real/bhuvan_dem_{zone}.tif`
- [ ] **0.12** Write `data/PROVENANCE_INDEX.json` — every file, provenance tag, license, URL / "not available"

**Phase 0 done when:** all zone GeoJSONs valid; hero towers identified; `PROVENANCE_INDEX.json` has zero unlabeled entries.

---

## Phase 1 — Data Provenance Ledger & Ingestion Layer
> Spec: [docs/data.md](docs/data.md)

- [ ] **1.1** Define `ProvenanceRecord` dataclass (source_id, file_path, data_provenance, crs, datum, resolution_m, accuracy_sigma_m, license, download_ts) → `src/ingestion/provenance.py`
- [ ] **1.2** Implement `LedgerStore` backed by SQLite `provenance_ledger` table; write + query ops → `src/ingestion/provenance.py`
- [ ] **1.3** Implement `GISReader.read_vector()` — GeoJSON, Shapefile, GPKG; reproject to WGS84/ITRF → `src/ingestion/gis_reader.py`
- [ ] **1.4** Implement `GISReader.read_raster()` — GeoTIFF (DEM / DSM / ORI) via GDAL → `src/ingestion/gis_reader.py`
- [ ] **1.5** Implement `LidarReader.read()` — LAS/LAZ → numpy structured array via PDAL → `src/ingestion/lidar_reader.py`
- [ ] **1.6** Implement `IFCReader.read()` — IfcOpenShell; extract IfcSpace / IfcBuildingStorey / IfcSlab → `src/ingestion/ifc_reader.py`
- [ ] **1.7** Write `tests/unit/test_provenance.py` — 100% provenance-tag path coverage; assert no REAL + SYNTHETIC conflation
- [ ] **1.8** Run ingestion on all Phase-0 assets; populate `provenance_ledger` in `registry.db`

**Phase 1 done when:** every reader output carries non-null `ProvenanceRecord`; `test_provenance.py` passes; ledger populated.

---

## Phase 2 — 3D ULPIN Core Engine
> Spec: [docs/features.md](docs/features.md)

### 2A — RID Grammar & Check Symbol
- [x] **2A.1** Implement `format_rid(ulpin14, bld_seq, cls, seq) → str` — grammar `ULPIN14-BLD-CLSSEQ-CHK` → `src/core/grammar.py`
- [x] **2A.2** Implement ISO 7064 MOD 37,36 `compute_check(payload) → str` (pure Python, zero external deps) → `src/core/grammar.py`
- [x] **2A.3** Implement `verify_check(rid) → bool` → `src/core/grammar.py`
- [x] **2A.4** Implement `parse_rid(rid) → RIDComponents` dataclass → `src/core/grammar.py`
- [x] **2A.5** Write `tests/conformance/test_check_symbol.py` — 10 known-valid RIDs; single-substitution + adjacent-transposition variants all fail

### 2B — Natural Key (NK) Algorithm
- [x] **2B.1** Implement `canonical_polyhedron(mesh) → bytes` — sort vertices, canonicalise winding, deterministic binary → `src/core/grammar.py`
- [x] **2B.2** Implement `compute_interior_point(mesh) → (x, y, z)` via trimesh sampling → `src/core/grammar.py`
- [x] **2B.3** Implement `morton_encode_3d(x, y, z, origin, cell_size_m) → int` — 21-bit/axis, 63-bit total → `src/core/grammar.py`
- [x] **2B.4** Implement `compute_nk(mesh, crs_epsg) → str` = `base32(sha256(canonical))[:16] + "_" + morton_b32` → `src/core/grammar.py`
- [x] **2B.5** Write `tests/conformance/test_nk_determinism.py` — same mesh, two independent processes → identical NK (1,000 iterations)
- [x] **2B.6** Write `tests/conformance/test_nk_collision.py` — 10^6 distinct 1 m³ voxel meshes → zero NK collisions

### 2C — Spatial Address (SA) Grid
- [x] **2C.1** Implement `compute_sa_cover(mesh, levels=[100, 10, 1]) → list[str]` — Morton cell codes at each resolution → `src/core/grammar.py`
- [x] **2C.2** Implement `sa_lookup(cell_code) → list[str]` — R-tree / Morton index with `lru_cache` → `src/core/grammar.py`
- [x] **2C.3** Benchmark `sa_lookup` over 10^6-object index — assert < 100 ms; record result in `docs/eval_results.md`

### 2D — SQLite WAL Registry Schema
- [x] **2D.1** Write `src/core/registry.py` with `init_db(path)` — WAL mode; create 5 tables on first call
- [x] **2D.2** Create `objects` table (rid PK, cls, ulpin14, issuer_node_id, birth_ts, status CHECK, data_provenance NOT NULL)
- [x] **2D.3** Create `binding_versions` table (version_id, rid FK, nk, sa_json, geometry_hash, plan_version, evidence_class, sigma_json, sign_off, prev_hash, this_hash, ts)
- [x] **2D.4** Create `audit_log` table (log_id, rid, action, actor, finding_id, payload_json, ts)
- [x] **2D.5** Implement `insert_object`, `append_binding_version` with SHA-256 hash chain
- [x] **2D.6** Implement `resolve_rid(rid) → ObjectRecord` — indexed column; benchmark p99 < 1 ms in-process
- [x] **2D.7** Implement `get_lineage(rid) → list[BindingVersion]` with hash-chain integrity flag

### 2E — Identity Continuity Test (ICT)
- [x] **2E.1** Implement `ict_evaluate(old_geometry, new_geometry, cls) → ICTDecision` enum {CONTINUE, AMBIGUOUS, SPLIT, MERGE, NEW} → `src/core/ict.py`
- [x] **2E.2** Implement overlap-ratio rules: >=0.8 → CONTINUE; 0.3-0.8 → AMBIGUOUS; disjoint → SPLIT; fusion → MERGE; else → NEW
- [x] **2E.3** Write `tests/integration/test_ict_remodel.py` — simulate MZ-1 unit partition remodel; assert SPLIT; two new RIDs with SUPERSEDES lineage edges

### 2F — Allocator & Conformance Suite
- [x] **2F.1** Implement `allocate(ulpin14, cls, mesh, evidence_class, plan_version, issuer_node) → str` — atomic NK→RID→CHK→write → `src/identity/allocator.py`
- [x] **2F.2** Implement `conformance_run() → ConformanceReport` — grammar + check symbol + NK + SA cover → `src/identity/conformance.py`
- [x] **2F.3** Write `tests/conformance/test_federation.py` — same mesh on MH + KA node → different RIDs, identical NKs

**Phase 2 done when:** conformance suite 100% pass; 10^7 allocations zero collisions; NK determinism confirmed; `resolve_rid` p99 < 1 ms.

---

## Phase 3 — Parametric Generator & Simulators
> Spec: [docs/data.md](docs/data.md)

- [x] **3.1** Implement `BuildingGenerator.generate()` — FSI/setback-parameterised; all outputs tagged SYNTHETIC → `src/simulation/building_gen.py`
- [x] **3.2** Generate class S — surface parcel column from Overture footprint (PROXY)
- [x] **3.3** Generate class B (building envelope) and class L (level slab bands)
- [x] **3.4** Generate class U (unit volumes), C (common areas), P (parking grid cells)
- [x] **3.5** Generate class A (airspace lot above height limit), T (subterranean / basement volumes)
- [x] **3.6** Generate class E — elevated metro corridor using real BMRCL / MMRC centrelines
- [x] **3.7** Generate class I — utility-network segments; depth uncertainty sigma_z = 0.30 m default
- [x] **3.8** Implement `SensorSimulator.render_lidar()` — ray-cast, sigma_r = 0.05 m, LAS output tagged SYNTHETIC → `src/simulation/sensor_sim.py`
- [x] **3.9** Implement `SensorSimulator.render_ortho()` — nadir orthophoto + depth buffer tagged SYNTHETIC
- [x] **3.10** Implement `DefectInjector.inject()` — 5 types: OVERLAP, UNDERCOUNT, HEIGHT_ERROR, SPLIT_ORPHAN, MISSING_COMMON; records ground-truth manifest → `src/simulation/defect_injector.py`
- [x] **3.11** Run generator for MZ-1 hero tower (20-storey, 4 units/floor, 2 basement T, 1 metro E) → `data/synthetic/mz1_hero/`
- [x] **3.12** Run generator for BZ-1 hero tower (15-storey, 3 units/floor, 1 basement, Namma Metro E) → `data/synthetic/bz1_hero/`
- [x] **3.13** Write `tests/unit/test_building_gen.py` — watertight; volume conservation <=1%; zero pairwise overlaps

**Phase 3 done when:** all 10 classes generated and watertight; defect injector functional; tests pass.

---

## Phase 4 — Normaliser & Georegistration
> Spec: [docs/pipeline.md](docs/pipeline.md)

- [x] **4.1** Implement `CORSModel.get_sigma(fix_type, baseline_length_km) → (sigma_h, sigma_z)` — RTK / DGNSS / single-point → `src/georegistration/cors_model.py`
- [x] **4.2** Implement datum transform WGS84/ITRF <-> Everest-1830 via pyproj + NADGRIDS; record transform name, epoch, residual in ProvenanceRecord
- [x] **4.3** Implement `ICPAligner.align()` — Open3D plane-to-plane ICP; GCPs as soft constraints → `src/georegistration/icp_align.py`
- [x] **4.4** Post-ICP residual policy: median > sigma_policy → WARN; > 3x sigma_policy → FAIL (recorded, pipeline continues)
- [x] **4.5** Implement `propagate_sigma(sigma_input, J) → sigma_out` — Jacobian covariance propagation J @ Sigma @ J.T → `src/georegistration/sigma_propagation.py`
- [x] **4.6** Implement `combined_sigma(sigma_expected, sigma_observed)` = sqrt(se^2 + so^2) → epsilon_v for T2 checks
- [x] **4.7** Write `tests/unit/test_georegistration.py` — round-trip < 1 cm; ICP convergence; identity-Jacobian sigma propagation

**Phase 4 done when:** datum round-trip < 1 cm; ICP converges on clean synthetic input; all outputs carry sigma_json.

---

## Phase 5 — Expected-Model Builder (Plan -> 3D Legal Space)
> Spec: [docs/pipeline.md](docs/pipeline.md) · [docs/decisions.md](docs/decisions.md)

- [x] **5.1** Implement `DXFParser.parse(path) → FloorPlanJSON` — ezdxf; AutoDCR layer naming (ROOM, WALL, DOOR, DIM) → `src/ingestion/plan_parser.py`
- [x] **5.2** Implement `IFCParser.parse(path) → FloorPlanJSON` — IfcOpenShell; IfcSpace, IfcBuildingStorey elevations, IfcDoor adjacency
- [x] **5.3** Define `FloorPlanJSON` TypedDict schema (version, source_provenance, levels list with rooms, z positions, area, type)
- [x] **5.4** Implement `PlanToLevels.extrude()` — trimesh extrude_polygon per room per level; assign class from room type → `src/expected_model/plan_to_levels.py`
- [x] **5.5** Handle special volumes: basement → T; parking → P; shafts → void (no RID); stairwells → C
- [x] **5.6** Implement `RERAValidator.check()` — unit count exact match; carpet area within 5% (WARN 5-10%; FAIL >10%) → `src/expected_model/rera_validator.py`
- [x] **5.7** Implement multi-version plan handling — two plan versions → two binding_versions + ICT lineage
- [x] **5.8** Write `tests/unit/test_expected_model.py` — DXF fixture → FloorPlanJSON; volumes watertight; RERA WARN at 6%, FAIL at 12%

**Phase 5 done when:** DXF + IFC produce valid FloorPlanJSON; volumes watertight; RERA validator correct.

---

## Phase 6 — Evidence Extraction (H1 Building Extractor · H2 Plan Vectoriser · Level Inferencer)
> Spec: [docs/aiml.md](docs/aiml.md) · [docs/pipeline.md](docs/pipeline.md)

### 6A — H1 Building Extractor
- [ ] **6A.1** Build U-Net (ResNet-34 encoder, pretrained ImageNet) — 4-channel input (R,G,B,nDSM), 512x512 tiles, 2-class output → `src/ml/h1_building_extractor.py`
- [ ] **6A.2** Implement combined loss: 0.5 x BCE + 0.5 x Dice
- [ ] **6A.3** Create synthetic training dataset — 500 ortho + nDSM tiles; labels from Overture footprints (REAL) → `data/synthetic/h1_train/`
- [ ] **6A.4** Train H1 (50 epochs / early-stop at val IoU > 0.80); checkpoint → `weights/h1_unet.pt`
- [ ] **6A.5** Benchmark on Rotterdam AHN tiles (REAL-FOREIGN); record IoU + Boundary F1 in `docs/eval_results.md` with explicit REAL-FOREIGN label
- [ ] **6A.6** Implement `H1Extractor.extract(ortho_tif, ndsm_tif) → (footprint_polygon, height_m, sigma_height)` — mask → polygonise → Douglas-Peucker
- [ ] **6A.7** (Optional) KPConv branch `H1Extractor.extract_from_cloud(las_path)` — activate only when LiDAR available

### 6B — H2 Plan Vectoriser
- [ ] **6B.1** Build H2 plan U-Net — 6 classes: wall / door / window / room / shaft / text; grayscale input → `src/ml/h2_plan_vectoriser.py`
- [ ] **6B.2** Pre-train on CubiCasa5K; fine-tune on 200 synthetic Indian-style plan rasters → `weights/h2_vectoriser.pt`
- [ ] **6B.3** Implement OCR stage — pytesseract on text-region crops; map label text → room type
- [ ] **6B.4** Implement polygon extraction — mask → contour tracing → simplification → FloorPlanJSON
- [ ] **6B.5** Report domain gap on (a) CubiCasa5K holdout, (b) synthetic Indian plans, (c) RERA raster; log in `docs/eval_results.md` with separate provenance labels per set

### 6C — Level Inferencer
- [x] **6C.1** Implement `LevelInferencer.extract_peaks(cloud, axis='z')` — z-histogram bin 0.05 m; return local maxima (z, density) → `src/ml/h2_level_inferencer.py`
- [x] **6C.2** Implement Viterbi DP alignment — states = plan z-positions; emission = N(z_expected, sigma_obs); configurable lambda_skip / lambda_extra
- [x] **6C.3** Implement sufficiency check — n_support < n_min OR sigma_obs > sigma_max → return UNVERIFIABLE (never silent PASS)
- [x] **6C.4** Output per level: {z_obs, sigma, n_support, evidence_class, status in {PASS,WARN,FAIL,UNVERIFIABLE}}
- [x] **6C.5** Write `tests/unit/test_level_inferencer.py` — correct Viterbi assignments on synthetic peaks; UNVERIFIABLE (not PASS) on insufficient support

**Phase 6 done when:** H1 IoU >= 0.80 on synthetic; AHN benchmark recorded honestly; H2 produces valid FloorPlanJSON; UNVERIFIABLE returned correctly for insufficient evidence.

---

## Phase 7 — Vertical Parcel Delineation (H3) & RID Allocation
> Spec: [docs/aiml.md](docs/aiml.md) · [docs/features.md](docs/features.md)

- [x] **7.1** Implement room adjacency graph — nodes = room polygons; edges = shared wall length > threshold; node/edge features defined → `src/ml/h3_delineation.py`
- [x] **7.2** Implement GNN proposal network (PyTorch Geometric GCNConv / SAGEConv) → per-edge merge probability p(merge) in [0,1]
- [x] **7.3** Implement ILP formulation — binary x_{room,unit}; exact-cover + volume-conservation + connectivity + RERA-count constraints; solve via scipy.optimize.milp or python-mip
- [x] **7.4** Implement greedy fallback (30 s ILP timeout) — merge by probability threshold; log fallback in ProvenanceRecord
- [x] **7.5** Define `ProposedUnit` output per level — polygon, z_bottom, z_top, cls, confidence, volume_m3, rera_unit_id
- [x] **7.6** Integrate ICT — query registry for overlapping NK; route CONTINUE / SPLIT / MERGE / NEW; log each decision → `src/identity/allocator.py`
- [x] **7.7** Implement dependency-ordered batch allocation: B first, then L, then U/C/P, then A/T, then E/I; each step atomic write
- [x] **7.8** Write `tests/integration/test_full_allocation.py` — full MZ-1 hero tower end-to-end: all units have valid RIDs; volume conservation <=1%; zero duplicate RIDs; NK re-computation matches stored NK

**Phase 7 done when:** volume IoU >= 0.85 on synthetic ground-truth; unit count exact for clean input; ICT routing correct; zero RID collisions; all RIDs pass verify_check.

---

## Phase 8 — Validation & Reconciliation Engine (T0-T4 + H4)
> Spec: [docs/validation.md](docs/validation.md) · [docs/aiml.md](docs/aiml.md)

### 8A — T0-T4 Rule-Based Validators
- [x] **8A.1** T0 Data Integrity — schema completeness, crs non-null, data_provenance present, geometry non-null; PASS/FAIL per object → `src/validation/t0_integrity.py`
- [x] **8A.2** T1 Geometric Validity — watertight, consistent outward normals, 2-manifold, no self-intersections; cadastral shell-touch exception annotated → `src/validation/t1_geometry.py`
- [x] **8A.3** T2 No-Overlap — vol(A∩B) per prohibited ownership-class pair; PASS=0, WARN<=eps_v, FAIL>eps_v, UNVERIFIABLE when evidence absent → `src/validation/t2_topology.py`
- [x] **8A.4** T2 Volume Conservation — |sum(vol(children))+sum(vol(voids))-vol(parent)| <= eps_v; eps_v from propagated sigma
- [x] **8A.5** T2 Containment — vol(child\parent); PASS<=eps_v, WARN<=3*eps_v, FAIL otherwise (covers Level⊂Building, Unit⊂Level, Building⊂Parcel)
- [x] **8A.6** T2 Vertical Order — z_bottom[i] < z_bottom[i+1] for consecutive levels; FAIL if violated
- [x] **8A.7** T3 Plan-vs-As-Built Hungarian matching — scipy.optimize.linear_sum_assignment; cost=|z_expected-z_observed|; output MATCH/SHIFTED/MISSING/EXTRA per level → `src/validation/t3_reconciliation.py`
- [x] **8A.8** T3 Footprint Alignment — ICP residual between plan footprint and H1 footprint; report offset + sigma
- [x] **8A.9** T4 Administrative Consistency — UDS fractions sum = 1.000+-eps; every Right.rid resolves; no orphan Rights → `src/validation/t4_admin.py`
- [x] **8A.10** Explain Object builder — ExplainObject {finding_id, tier, predicate, rid_a, rid_b, magnitude, sigma, evidence_class, status, recommendation, plan_version, data_provenance}; persist to audit_log → `src/validation/explain.py`

### 8B — H4 Intelligent Topology Validator
- [x] **8B.1** Build feature vector per finding — 11 features: [violation_type_enc, magnitude, sigma, confidence, evidence_class_enc, cls_a_enc, cls_b_enc, volume_ratio, n_affected, plan_age_days, provenance_enc] → `src/ml/h4_topology_validator.py`
- [x] **8B.2** Implement Isolation Forest (sklearn) — fit on clean synthetic buildings; score defect-injected buildings
- [x] **8B.3** Implement 2-hop graph propagation of anomaly scores across spatial adjacency graph
- [x] **8B.4** Implement finding ranking: rank_score = anomaly_score x impact_weight x examiner_priority_weight; expose top-k (default 20)
- [x] **8B.5** Implement active learning stub — record examiner decisions {ACCEPT, REJECT, MODIFY_TOLERANCE}; retrain Isolation Forest at 50-decision threshold
- [x] **8B.6** Seed initial tolerances from NAKSHA 5% parcel-area baseline
- [x] **8B.7** Write `tests/integration/test_validation_pipeline.py` — inject all 5 defect types; each produces >= 1 FAIL/WARN; H4 ranks injected defect in top-3

**Phase 8 done when:** all injected defects detected; UNVERIFIABLE returned (never silently PASS) for absent evidence; H4 Precision@3 >= 0.60; every finding has ExplainObject in audit_log.

---

## Phase 9 — Rights Model & Interoperability Exports
> Spec: [docs/decisions.md](docs/decisions.md)

- [x] **9.1** Implement `Right` dataclass — right_id, rid, right_type, holder_pseudonym, uds_fraction, legal_basis_status, legal_act_ref, instrument_ref, registration_number, valid_from/to → `src/rights/rrr_model.py`
- [x] **9.2** Implement `Restriction` dataclass — rid, restriction_type {SETBACK, FSI_CAP, HERITAGE_OVERLAY, NO_ALIENATION}, legal_basis, parameters_json
- [x] **9.3** Implement `Responsibility` dataclass — rid, responsibility_type {MAINTENANCE, STRUCTURAL, FIRE_SAFETY}, responsible_party_pseudonym, scope
- [x] **9.4** Implement `RRRStore` — SQLite `rights` table; insert_right, get_rights_for_rid, update_right_status
- [x] **9.5** Assign legal_basis_status by class rule — U/C/P → ENACTED (Maharashtra/Karnataka Apartment Ownership Acts + RERA 2016); A/T → ASSUMED; hardcode act references
- [x] **9.6** Implement LADM Part 2 export `export_ladm(building_rid) → XML/JSON-LD` — map Right→LA_Right, Restriction→LA_Restriction, LegalSpaceVolume→LA_SpatialUnit; India-profile extensions → `src/rights/export.py`
- [x] **9.7** Implement IFC export — class-U volumes → IfcSpace with LongName=RID, GlobalId=UUID(SHA256(RID)[:16])
- [x] **9.8** Implement CityGML 3.0 / CityJSON export — B→Building, L→BuildingPart, U→BuildingUnit, gml:id=RID, LOD2 solid geometry
- [x] **9.9** Write `tests/integration/test_roundtrip.py` — allocate → export LADM / IFC / CityJSON → re-import → RID preserved exactly in all three

**Phase 9 done when:** LADM, IFC, CityJSON exporters schema-valid; RID preserved through all round-trips; legal_basis_status correct per class.

---

## Phase 10 — FastAPI Service Layer & Examiner Console
> Spec: [docs/contracts.md](docs/contracts.md)

### 10A — FastAPI Endpoints (`src/api/main.py`)
- [x] **10A.1** `POST /allocate` — ulpin14, cls, geometry_wkt, plan_version, evidence_class, issuer_node → delineation→ICT→allocate; returns rid, nk, sa_cover, validation_status, explain_ids
- [x] **10A.2** `GET /resolve/{rid}` — ObjectRecord + latest BindingVersion; p99 < 1 ms in-process
- [x] **10A.3** `POST /verify` — rid, geometry_wkt; recomputes NK; returns match bool + nk_computed + nk_registry + delta
- [x] **10A.4** `GET /lineage/{rid}` — all BindingVersion records chronological + hash-chain integrity flag
- [x] **10A.5** `GET /cover` — bbox (WGS84), z_min, z_max, cls[], provenance[]; paginated RID list; < 100 ms at 10^6-object index
- [x] **10A.6** `GET /explain/{finding_id}` — returns full ExplainObject from audit_log
- [x] **10A.7** `GET /validate/{rid}` — runs T0-T4 + H4; returns rid, tier_results, findings, ranked_findings
- [x] **10A.8** Validate all endpoint schemas match [docs/contracts.md](docs/contracts.md) exactly; HTTP 200/404/422 correct; OpenAPI /docs accessible

### 10B — Examiner Console (`src/console/`)
- [x] **10B.1** Three.js / CesiumJS scene — load volumes from /cover; class colour scheme: U=#E8A048, C=#6DB56D, P=#8A8A8A, A=translucent outline, T/I=subsurface cutaway, E=#4A8BD4 → `src/console/viewer.js`
- [x] **10B.2** "Below / Above This Parcel" query — parcel click → /cover z_min=-100, z_max=+300; render stacked depth-sorted volumes (R1 headline query)
- [x] **10B.3** Layer filters — independent toggles for class (S B L U C P A T E I), data_provenance, validation status, tier fidelity, evidence class → `src/console/ui.js`
- [x] **10B.4** Hover / tap card — glow outline + side card with RID, class badge, provenance badge, validation status dot
- [x] **10B.5** Four views: Sanctioned Plan / As-Built / Difference (colour-coded severity) / Section Cut (any horizontal or vertical slice)
- [x] **10B.6** Audit trail view + examiner sign-off button — records mock signature + timestamp in audit_log via API; hash-chain linkage verified
- [x] **10B.7** Dark basemap; LOD switching: zone scale → B; medium zoom → L; street scale → U/C/P
- [x] **10B.8** Run both named scenarios (MZ-1 below/above + BZ-1 metro-parcel clearance); capture demo recording → `data/demo/`

**Phase 10 done when:** all 7 endpoints correct and schema-matched; R1 headline query returns correct stacked RID list; layer filters provenance-safe; examiner sign-off persists hash-chained audit_log entry.

---

## Phase 11 — Evaluation Programme & Honest Reporting
> Spec: [docs/validation.md](docs/validation.md) · [docs/decisions.md](docs/decisions.md)

- [x] **11.1** Honesty pass — 100% objects in registry.db carry data_provenance; UNVERIFIABLE in audit_log wherever evidence insufficient; zero silent PASS upgrades → `docs/eval_results.md`
- [x] **11.2** REAL vs SYNTHETIC separation — /cover provenance=SYNTHETIC returns zero REAL-tagged objects and vice versa
- [x] **11.3** Scale test — 10^7 batch allocations offline; zero collisions; record wall-clock time + peak RSS memory
- [x] **11.4** /resolve latency — 1,000 sequential in-process calls; p99 < 1 ms
- [x] **11.5** /cover latency — 10^6-object index, 100 m x 100 m bbox query; < 100 ms
- [x] **11.6** Defect detection curves — 5 defect types x 5 magnitudes (0.05, 0.10, 0.25, 0.50, 1.00 m); plot detection rate vs magnitude; include figures in eval report
- [x] **11.7** Conformance suite final run — grammar, check symbol, NK determinism, NK collision, SA cover — all 100% pass
- [x] **11.8** Two-state federation test — 100 RIDs on MH node + 100 on KA node; zero inter-node collisions; /resolve routes correctly on issuer_node_id
- [x] **11.9** LADM / IFC / CityJSON round-trip — all MZ-1 hero tower objects; RID preserved exactly in all three formats
- [x] **11.10** Novelty claims verification — one-paragraph justification per claim (10 total) with code-path pointer → `docs/eval_results.md`
- [x] **11.11** R1 headline demo — "what is below / above this parcel?" on MZ-1 and BZ-1; stacked RIDs in correct z-order and correct classes → eval report

**Phase 11 done when:** all acceptance criteria pass; eval_results.md complete and honest; zero REAL-SYNTHETIC conflation; all 10 novelty claims evidenced.

---

## Overall Milestone Summary

| Milestone | Phases | Status |
|-----------|--------|--------|
| **M0 — Data Ready** | Phase 0 | [ ] (Pending external data) |
| **M1 — Identity Engine Live** | Phases 1-2 | [x] COMPLETE |
| **M2 — Synthetic World Built** | Phases 3-4 | [x] COMPLETE |
| **M3 — Expected Model Pipeline** | Phase 5 | [x] COMPLETE |
| **M4 — Observed Model Pipeline** | Phase 6 | [x] (6C Level Inferencer COMPLETE; 6A/6B await satellite imagery) |
| **M5 — Full Vertical Slice** | Phases 7-10 | [x] COMPLETE |
| **M6 — Evaluation Complete** | Phase 11 | [x] COMPLETE |
| **M7 — Architectural Improvements** | Phase 12 | [ ] PLANNED (12A Statutory Anchor, 12B Legacy Crosswalk, 12C GeoJSON-3D, 12D RERA Deviation) |

---

## Architectural Scope Alignments & Handoff Decisions (Freeze)

1. **Authentication & Authorization:**
   - *Status:* **DEFERRED** (Out of scope for current MVP/evaluation). Open endpoints for maximum developer velocity and zero-barrier examiner evaluations.

2. **Deployment & Docker Packaging:**
   - *Status:* **DEFERRED** (Post-MVP packaging). Backend is served directly via Python standard runtime (`uvicorn src.api.main:app --port 8000`).

3. **Multi-State Federation Architecture:**
   - *Status:* **VERIFIED IN-ENGINE** (Zero external daemon/cluster overhead).
   - Conforms to constitutional division of powers (State List II, Entry 18). State partitioning (`MH`, `KA`) is embedded inside the 14-char ULPIN grammar, `issuer_node_id`, and SQLite database isolation. Fully verified via `tests/conformance/test_federation.py` and `tests/benchmark/test_evaluation_scale.py`.

4. **Frontend Architecture & Handoff:**
   - *Status:* **CONTRACT FROZEN & HANDED OFF**.
   - `src/console/` serves as the internal reference test harness.
   - The production UI is owned by the dedicated frontend team using CesiumJS 3D.
   - Comprehensive golden contract, endpoint schemas, and CesiumJS rendering recipes are documented in [`docs/frontend_integration.md`](docs/frontend_integration.md).

---

## Phase 12 — Architectural Weight Improvements (Planned)

> **Status:** PLANNED — No code written yet. These tasks strengthen institutional credibility, legal grounding, and frontend ergonomics.

### 12A — Indian Statutory Legal Anchor in `/resolve`
- [ ] **12A.1** Define `statutory_anchor` dict per class in `src/core/grammar.py` or `src/rights/rrr_model.py` — maps each of the 10 classes to the applicable Indian statute, section, and citation reference:
  - Class `U/C/P` → Maharashtra Apartment Ownership Act 1970 / Karnataka Apartment Ownership Act 1972 (§4 & 5) + RERA 2016 (§2(k), §14)
  - Class `E` → Metro Railways (Construction of Works) Act 1978 (§6)
  - Class `T` → RFCTLARR Act 2013 (underground easement provisions)
  - Class `A` → Aircraft Act 1934 + MoCA CCZM Colour Coded Zoning Map
  - Class `S/B/L` → Revenue Code of the issuing State (MahaBhulekh / Bhoomi)
- [ ] **12A.2** Populate `statutory_anchor` field in `GET /resolve/{rid}` response; write new Pydantic `StatutoryAnchor` schema in `src/api/schemas.py`
- [ ] **12A.3** Unit test: resolve a class-U RID and assert `statutory_anchor.act_name` contains "Apartment Ownership Act" and `statutory_basis == "ENACTED"`
- [ ] **12A.4** Update `src/rights/rrr_model.py` so `legal_basis_status` for each class is pre-populated from the same statutory map (consolidating existing class-rule logic with the new anchor dict)

### 12B — Legacy Identifier Crosswalk (CTS, e-PID, UPOR, e-Aasthi)
- [ ] **12B.1** Design `legacy_index` SQLite table schema in `src/core/registry.py`:
  `(id_system TEXT, legacy_value TEXT, rid TEXT, created_at TEXT, UNIQUE(id_system, legacy_value))`
- [ ] **12B.2** Implement `insert_legacy_id(id_system, legacy_value, rid)` and `resolve_by_legacy(id_system, legacy_value) → Optional[str]` methods on `RegistryStore`
- [ ] **12B.3** Extend `GET /resolve` endpoint — accept `legacy_system` + `legacy_value` query params; route through `resolve_by_legacy()`; return same ObjectRecord
- [ ] **12B.4** Add `legacy_system` and `legacy_value` to `AllocateRequest` body so callers can stamp legacy IDs at allocation time
- [ ] **12B.5** Unit test: allocate an RID, stamp `CTS:Plot 412/1A`, then `GET /resolve?legacy_system=CTS&legacy_value=Plot+412%2F1A` and assert it returns the same RID

### 12C — Dual-Payload `/cover` with `format=geojson_3d`
- [ ] **12C.1** Extend `GET /cover` with `format` query parameter: `summary` (existing default) or `geojson_3d`
- [ ] **12C.2** In `geojson_3d` mode, compute each object's footprint polygon (WGS84 lat/lon) and z extents (`height`, `extrudedHeight`) from its stored bounding box in `spatial_index` table; also emit `fill_color` from the standard class colour palette
- [ ] **12C.3** Add `format: Optional[Literal["summary", "geojson_3d"]]` to `CoverRequest` schema; add `GeoJSON3DFeature` Pydantic model in `src/api/schemas.py`
- [ ] **12C.4** Unit test: allocate 3 objects, call `GET /cover?bbox=...&format=geojson_3d`, assert each feature has `properties.extrudedHeight > properties.height` and correct `fill_color` per class

### 12D — RERA Carpet Area Deviation Metric in `/validate`
- [ ] **12D.1** Add `sanctioned_carpet_area_sqm` field to `binding_versions` table (nullable) and to `AllocateRequest` body
- [ ] **12D.2** Implement `compute_rera_compliance(rid, store) → RERAComplianceResult` in `src/expected_model/rera_validator.py`:
  - Compares stored `sanctioned_carpet_area_sqm` vs. mesh-derived as-built area (from T1 geometry validator)
  - Returns: `deviation_percentage`, `rera_compliance_status` (`PASS` ≤ 2%, `TOLERANCE_WARNING` 2–5%, `FAIL` > 5%), and statutory citation
- [ ] **12D.3** Call `compute_rera_compliance()` in `GET /validate/{rid}` response when `cls == 'U'` and plan area evidence is available; populate `rera_compliance` field in `ValidateResponse`
- [ ] **12D.4** Add `RERAComplianceResult` Pydantic model to `src/api/schemas.py`; update `ValidateResponse` to include optional `rera_compliance` field
- [ ] **12D.5** Unit test: allocate a unit with `sanctioned_carpet_area_sqm=84.5` and geometry producing `~87 m²`; call `/validate/{rid}` and assert `deviation_percentage ≈ 3.07` and `rera_compliance_status == "TOLERANCE_WARNING"`

**Phase 12 done when:** All 4 sub-phases pass unit tests; `/resolve` returns statutory anchors; legacy crosswalk resolves CTS/e-PID identifiers; `/cover?format=geojson_3d` returns valid CesiumJS-ready GeoJSON; `/validate` returns RERA deviation percentage with correct statutory citation.
