# 7. 3D Spatial Topology & Reconciliation Engine

### 7.1 Multi-Tier Validation Pipeline

| Tier | Name | Checks | Output |
|------|------|--------|--------|
| **T0** | Data Integrity | Schema validation, CRS consistency, `data_provenance` tag present, geometry non-null | PASS / FAIL |
| **T1** | Geometric Validity | ISO 19107 solid validity via val3dity: watertight, no self-intersection, consistent normals, manifold. Custom cadastral relaxations (shell self-touch policy) | PASS / FAIL per solid |
| **T2** | Cadastral Topology | No-overlap, volume conservation, containment, connectivity, vertical order | PASS / WARN / FAIL / UNVERIFIABLE |
| **T3** | Plan-vs-As-Built | Plan to observed reconciliation: level heights, footprint alignment, unit counts, setbacks | Discrepancy list with explain objects |
| **T4** | Administrative Consistency | UDS sum = 100%; right scopes match RID tree; no orphan rights; registration cross-check | PASS / WARN / FAIL |
| **T5** | Human Review | Examiner console presentation of T2-T4 findings ranked by H4 anomaly scorer | ACCEPT / REJECT / OVERRIDE |

---

### 7.2 Core 3D Spatial Predicates — Mathematical Formulation

All predicates operate on 3D solid geometries using `trimesh` and `shapely` with `scipy.spatial`.

#### 7.2.1 No-Overlap Predicate

For any pair of ownership volumes (A, B) where overlap is prohibited:

```
vol(A intersection B) <= epsilon_v
```

where `epsilon_v` is the volumetric tolerance derived from propagated Sigma.

```
result =
  PASS   if vol(A intersection B) = 0
  WARN   if 0 < vol(A intersection B) <= epsilon_v
  FAIL   if vol(A intersection B) > epsilon_v
```

#### 7.2.2 Volume Conservation Predicate

For a parent volume V_parent with children {V_1, ..., V_n} and voids {V_void_1, ..., V_void_m}:

```
| sum(vol(V_i)) + sum(vol(V_void_j)) - vol(V_parent) | <= epsilon_v
```

where `epsilon_v` is derived from propagated sigma of all constituent volumes.

#### 7.2.3 Containment Predicate

Child C must be contained within parent P, within tolerance:

```
vol(C \ P) <= epsilon_v
```

Specific instances:
- Level is contained within Building envelope
- Building is contained within Parcel column (setbacks)
- Unit is contained within Level

#### 7.2.4 Connectivity Predicate

Each unit U must form one connected interior:

```
connected_components(U) = 1
```

Multi-level units (duplex/mezzanine) are allowed when declared connectors (stairs, internal void) exist.

#### 7.2.5 Vertical Order Predicate

For levels L_1, L_2, ..., L_k within a building:

```
z_floor(L_i) < z_floor(L_{i+1})       for all i in [1, k-1]
z_ceil(L_i)  <= z_floor(L_{i+1}) + epsilon_z   for all i in [1, k-1]
|h_obs(L_i) - h_plan(L_i)| <= tau_height
```

---

### 7.3 Probabilistic / Monte-Carlo Tolerance Testing

**Deterministic Form:**

```
result =
  PASS   if |delta_z| <= 2 * sigma_c
  WARN   if 2*sigma_c < |delta_z| <= max(3*sigma_c, tau_policy)
  FAIL   if |delta_z| > max(3*sigma_c, tau_policy)

where sigma_c = sqrt(sigma_exp^2 + sigma_obs^2)
```

**Probabilistic Form (for overlaps/containment):**

```
Monte-Carlo Tolerance Test:
  N = 200 (configurable)

  for i in 1..N:
    perturb each vertex of A and B by sampling from its covariance:
      v' = v + sample(Normal(0, Sigma_v))
    compute vol(A' intersection B')
    record violation = (vol(A' intersection B') > 0)

  P(violation) = count(violation) / N

  result:
    P(violation) < 0.05     =>  PASS
    0.05 <= P < 0.50         =>  WARN
    P(violation) >= 0.50     =>  FAIL
```

**Tolerance thresholds are parameterised by class** and seeded from NAKSHA's real 5% parcel-area rule — the direct Indian precedent, not applied blindly to 3D but as the conceptual ancestor.

---

### 7.4 Reconciliation Engine — Plan vs Observed

**Matching Algorithm:**

1. Build assignment cost matrix between expected and observed objects using:

```
cost(E_i, O_j) = lambda_1 * (1 - IoU_3D(E_i, O_j))
               + lambda_2 * [class(E_i) != class(O_j)]
               + lambda_3 * [parent(E_i) != parent(O_j)]
```

2. Solve assignment using the **Hungarian algorithm** (optimal linear assignment).
3. Unmatched expected objects => potential demolitions / not-built.
4. Unmatched observed objects => potential unauthorised structures.

**Discrepancy Classification:**

| Discrepancy Class | Description | Detection Source |
|-------------------|------------|-----------------|
| Extra floor | Observed level not in plan | D4 level inference |
| Missing floor | Plan level not observed | D4 level inference |
| Wrong floor height | Level height differs by > tolerance | D4 vs plan comparison |
| Vertical drift | Systematic z-offset across levels | Regression on level residuals |
| Footprint deviation | Building outline differs | H1 vs plan footprint comparison |
| Setback breach | Building within setback zone | Containment check vs parcel column |
| Unit-count mismatch | Different number of units per level | H3 vs RERA count |
| Unit area/volume mismatch | Unit dimensions differ | H3 volume vs plan area |
| Basement mismatch | Basement depth/extent differs | E5 vs plan |
| Unauthorised structure | Observed, no plan | Unmatched observed objects |
| Demolished | Plan exists, no observation | Unmatched expected objects |
| Parking count mismatch | Parking spaces differ | P-class count vs RERA |
| Airspace intrusion | A-lot violated | Containment check |
| Utility-ownership conflict | I intersection U/P without easement | Overlap predicate |
| Datum-offset error | Systematic coordinate shift | Georegistration residuals |
| Parcel-boundary encroachment | Building extends beyond parcel | Containment vs S column |
| Corridor clearance breach | E/T too close to other objects | Distance/clearance query |

---

### 7.5 Explain Object Schema

Every finding is an explain object:

```json
{
  "finding_id": "uuid",
  "finding_type": "SETBACK_BREACH",
  "severity": "FAIL",
  "confidence": 0.92,
  "rule": {
    "rule_id": "T2.CONTAIN.SETBACK",
    "description": "Building must be within parcel column minus setback buffers",
    "tolerance": "2*sigma_c = 0.34 m",
    "policy_reference": "NAKSHA 5% area precedent, adapted to linear"
  },
  "evidence": {
    "evidence_ids": ["ev-001", "ev-002"],
    "evidence_class": "E1",
    "sigma_measurement": 0.12,
    "data_provenance": ["REAL", "SYNTHETIC"]
  },
  "geometry_overlay": {
    "expected": "WKT of expected boundary",
    "observed": "WKT of observed boundary",
    "intersection": "WKT of violation zone",
    "magnitude": "0.47 m encroachment"
  },
  "plan_version": "MCGM-AUTODCR-2024-001-v2",
  "affected_rids": ["SYNTHETIC0001A-B0004-U0A3F1-7"],
  "examiner_action": null,
  "override_history": []
}
```

---

## Appendix A: Defect Taxonomy (28+ Classes)

The defect taxonomy drives the simulation evaluation programme. Every defect class has a generator (produces known-defective geometry), a detector (the validation pipeline), and a magnitude range over which detection-vs-magnitude curves are plotted.

### A.1 Geometry Defects

| # | Defect Class | Description | Magnitude Range | Detection Tier |
|---|-------------|------------|-----------------|----------------|
| 1 | **Overlap** | Two ownership volumes share non-zero intersection | 0.01–5.0 m³ | T2 |
| 2 | **Gap** | Missing volume between adjacent children that parent should cover | 0.01–5.0 m³ | T2 |
| 3 | **Disconnected solid** | A unit volume is not a single connected component | — (binary) | T1 |
| 4 | **Non-manifold** | Geometry has edges shared by more than two faces | — (binary) | T1 |
| 5 | **Inverted normals** | Face normals point inward instead of outward | — (binary) | T1 |

### A.2 Containment Defects

| # | Defect Class | Description | Magnitude Range | Detection Tier |
|---|-------------|------------|-----------------|----------------|
| 6 | **Child outside parent** | Unit/common protrudes beyond level boundary | 0.05–2.0 m | T2 |
| 7 | **Level outside envelope** | Level slab extends beyond building envelope | 0.05–2.0 m | T2 |
| 8 | **Building outside parcel** | Building footprint exceeds parcel column | 0.1–2.0 m | T2 |

### A.3 Vertical Defects

| # | Defect Class | Description | Magnitude Range | Detection Tier |
|---|-------------|------------|-----------------|----------------|
| 9 | **Extra level** | Observed level not in sanctioned plan | — (count) | T3 |
| 10 | **Missing level** | Plan level not observed in sensor data | — (count) | T3 |
| 11 | **Wrong floor height** | Level height differs from plan by > tolerance | 0.05–1.0 m | T3 |
| 12 | **Vertical drift** | Systematic z-offset accumulating across levels | 0.05–0.5 m cumulative | T3 |
| 13 | **Datum-offset error** | Entire building shifted vertically due to datum mismatch | 0.1–5.0 m | T3 |

### A.4 Plan-vs-As-Built Defects

| # | Defect Class | Description | Magnitude Range | Detection Tier |
|---|-------------|------------|-----------------|----------------|
| 14 | **Setback breach** | Building within setback zone of parcel | 0.1–2.0 m | T3 |
| 15 | **Footprint deviation** | Building outline differs from plan | 0.1–3.0 m | T3 |
| 16 | **Unit-count mismatch** | Different number of units per level than plan/RERA | — (count) | T3 |
| 17 | **Unit-volume mismatch** | Unit dimensions differ from plan | 5–50% volume | T3 |
| 18 | **Basement mismatch** | Basement depth/extent differs from plan | 0.5–3.0 m depth | T3 |
| 19 | **Parking count mismatch** | Parking spaces differ from RERA disclosure | — (count) | T3 |
| 20 | **Unauthorised structure** | Observed structure with no corresponding plan | — (binary) | T3 |
| 21 | **Demolished-not-updated** | Plan record exists but structure no longer observed | — (binary) | T3 |

### A.5 Rights Defects

| # | Defect Class | Description | Magnitude Range | Detection Tier |
|---|-------------|------------|-----------------|----------------|
| 22 | **Ownership-volume overlap** | Two ownership rights cover the same physical volume | — (binary) | T4 |
| 23 | **Utility-without-easement** | Utility corridor intersects ownership volume with no easement Right | — (binary) | T4 |
| 24 | **Air-lot intrusion** | A-class volume intersects building envelope | 0.1–2.0 m | T2/T4 |
| 25 | **Corridor clearance breach** | E/T corridor closer than regulatory threshold to other objects | 0.5–50 m | T2/T4 |
| 26 | **Orphan right** | Right record references a non-existent or demolished RID | — (binary) | T4 |
| 27 | **UDS mismatch** | Sum of undivided shares does not equal 100% for a building | 0.01–5.0% | T4 |

### A.6 Identity Defects

| # | Defect Class | Description | Magnitude Range | Detection Tier |
|---|-------------|------------|-----------------|----------------|
| 28 | **Duplicate RID** | Two distinct objects allocated the same RID | — (binary) | T0 |
| 29 | **ICT mis-continuation** | ICT classifies a genuinely new object as CONTINUE (or vice versa) | IoU range | T2 |
| 30 | **Stale parcel lineage** | RID's birth ULPIN has been subdivided but `parcel_lineage` not updated | — (binary) | T4 |
| 31 | **Broken lineage chain** | Hash-chain integrity check fails in the binding record | — (binary) | T0 |

---

## Appendix B: Simulation & Evaluation Programme

### B.1 Generator Scope

Urban blocks with the following features, placed on **real footprints inside the micro-zones** (Section 2) at three fidelity tiers:

- High-rise towers (10–60 levels)
- Podiums and podium-level commercial
- Basements (1–4 levels)
- Parking (mechanical / stilt / basement)
- Mixed-use (residential + commercial in one building)
- Duplex units and mezzanines
- Shafts, atria, and lift cores
- Amalgamated parcels (building spanning two former plots)
- Elevated metro corridor spanning multiple parcels
- Underground tunnels and station boxes
- Utility networks (water, sewage, gas, fibre, storm drain)
- Air-right volumes above podiums
- Plan versions (original sanctioned, modified, as-built)
- Unauthorised additions (encroachments, extra floors)

Parametric Indian-style plans (rooms, balconies, shafts, staircases, lifts), schema-matched to MCGM AutoDCR's CAD conventions and RERA carpet-area definitions.

### B.2 Sensor Simulator Parameters

All parameters are configurable assumptions, seeded from real accuracy classes where published.

| Simulator | Parameters | Seed Source |
|-----------|-----------|-------------|
| **GNSS** | Fix/float mixture; correlated multipath near towers (Gauss-Markov); sigma_z = c * sigma_h | SoI CORS published RTK class (~+/-3 cm) |
| **LiDAR** | Ray-casting from flight lines; range noise; scan-angle-dependent density; occlusion by adjacent towers; dropouts on glazing; facade under-sampling from nadir | Sensor spec sheets; Rotterdam AHN noise characterisation |
| **Photogrammetry** | Mesh holes; smoothing artefacts; facade distortion; texture blur | Standard SfM/MVS literature |
| **Utilities** | Position noise; depth noise; missing segments; material-dependent GPR response | GPR noise literature |
| **Plans** | Drafting error (wall offset 0–5 cm); outdated versions (missing modifications); scale error | AutoDCR format analysis |

### B.3 Evaluation Protocol (Fixing Circularity)

1. **Separation:** Defect generator, validator, and ICT developed by **separate code paths and seeds**. Hold-out defect types and magnitude ranges reserved for final evaluation.
2. **Detection-vs-magnitude curves:** For each defect class, inject defects at graduated magnitudes and measure detection rate. Report curves, not single recall numbers.
3. **Statistical rigour:** Minimum 100 injections per defect class with 95% confidence intervals.
4. **Compound defects:** Test combinations of defects (e.g., extra floor + setback breach simultaneously).
5. **False-positive rate:** Report on clean-but-noisy models across noise levels.
6. **UNVERIFIABLE rate:** Report per evidence class — this is the honesty metric.
7. **Provenance separation:** Never blend REAL-IN / REAL-FOREIGN / REAL-OWN / SYNTHETIC into one headline number.

### B.4 Metric Targets (Design Goals, Not Results)

| Metric | Target | Category |
|--------|--------|----------|
| NK determinism | 100% (same geometry, different machines, same digest) | Identity |
| Check-symbol single-error detection | 100% | Identity |
| Zero RID collisions in 10^7 allocations | 0 collisions | Identity |
| ICT correct on scripted scenarios | >= 95% | Identity |
| Per-class defect recall | Reported as curves, not single numbers | Validation |
| H1 building extraction IoU | Reported per provenance class | ML |
| H2 level count accuracy | Reported per provenance class | ML |
| H3 unit-volume IoU | Reported per provenance class | ML |
| H4 anomaly ranking Precision@k | Reported vs k | ML |
| Resolution latency at 10^6 objects | Sub-millisecond `/resolve` | Performance |
| Spatial query at 10^6 objects | < 100 ms `/cover` | Performance |

---

## Appendix C: Execution Pipeline & Confidence Classification

### C.1 Validation Flowchart

```text
RAW INPUT
   |
Schema validation
   |
CRS/unit validation
   |
Geometry repair (only when safe + logged)
   |
3D reconstruction
   |
Vertical extent validation
   |
Parent-child relationship validation
   |
Overlap/intersection tests
   |
Topology checks
   |
Semantic checks
   |
Provenance check
   |
Identifier uniqueness check
   |
VALID / INVALID / REVIEW
```

### C.2 Validation Classes Summary
- **Class A (Source Validation)**: Required fields, source IDs, data version, CRS, units, missing geometry.
- **Class B (2D Geometry)**: Valid polygon, no self-intersection, expected ring orientation, reasonable area.
- **Class C (3D Solid)**: Watertight/closed solid, non-zero volume, no self-intersection, valid faces, consistent Z range.
- **Class D (Vertical Logic)**: $Z_{\text{min}} < Z_{\text{max}}$, non-overlapping floors, monotonic ordering, basement below ground datum.
- **Class E (Parcel/Building Relation)**: Boundary containment, parent parcel relationship, flag crossings for examiner triage.
- **Class F (Overlap Detection)**: Duplicate volumes, unintended unit collisions, infrastructure conflict analysis.
- **Class G (Identifier Uniqueness)**: Deterministic natural key generation, collision resistance, hash chain integrity.

### C.3 Explicit Confidence Classification
- `AUTHORITATIVE` — Directly supplied by an authorized cadastral agency (e.g. Survey of India, MCGM).
- `DERIVED_HIGH` — Deterministic derivation from authoritative geometry.
- `DERIVED` — Computed/estimated from multi-source spatial data.
- `INFERRED` — Machine learning / heuristic inference.
- `SYNTHETIC` — Controlled simulation / evaluation datasets.
