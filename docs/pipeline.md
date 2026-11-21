# 4. End-to-End Vertical Property Mapping Pipeline

### 4.1 Plan-First, Evidence-Verified Workflow

```
Sanctioned plan(s)                                    Evidence E1-E5
[AutoDCR-style CAD / synthetic Indian plan]           [real footprint/DEM + simulated sensors]
         |                                                      |
         v                                                      v
    Plan Parser                                          Georegister
         |                                                      |
         v                                                      v
  Expected levels/units/commons                        Level inference (D4)
         |                                                      |
         v                                                      v
  Extrusion between level planes                     Observed level planes
         |                                                      |
         v                                                      v
  EXPECTED Legal-Space Model ----------+    +------ OBSERVED Physical Model
                                       |    |
                                       v    v
                          Constraint-Guided Delineation (H3)
                                       |
                                       v
                    3D Legal Spaces (U, C, P, L, B, A, T, E, I)
                                       |
                                       v
                               ICT => RID Allocation
                                       |
                                       v
                                  Validation (T0-T5)
                                       |
                                       v
                                Examiner Console
```

**Workflow Modes:**

| Mode | Trigger | Behaviour |
|------|---------|----------|
| **Plan-first** (default) | Sanctioned plan available | Plan defines expected model; sensors verify |
| **Plan-outdated** | Plan version < current build state | Run reconciliation; flag discrepancies |
| **No-plan (unauthorised)** | No plan on record | Sensor-only extraction; all results tagged WARN |
| **Multi-version** | Multiple plan versions on record | Track modification history; lineage edges |

---

### 4.2 Evidence Sufficiency Ladder

| Class | Evidence | Can Verify |
|-------|---------|-----------|
| **E1** | Airborne nadir (ORI, DSM, LiDAR) | Footprint, roof height, total height, setbacks, envelope, basement *presence* only via plan |
| **E2** | Oblique / facade imagery | Storey count/window rows, balcony projections |
| **E3** | Terrestrial / mobile / handheld scan | Slab levels, unit partitions, common areas |
| **E4** | As-built BIM / survey drawing | Unit volumes, shafts |
| **E5** | Underground detection (GPR / utility survey) | Utility position/depth, basement extent |

**Output State Mapping:**

| Output State | Meaning | Trigger |
|-------------|---------|---------|
| **PASS** | Evidence sufficient; measurement within tolerance | abs(delta_z) <= 2 * sigma_c |
| **WARN** | Evidence present but measurement near tolerance boundary | 2*sigma_c < abs(delta_z) <= max(3*sigma_c, tau_policy) |
| **FAIL** | Evidence sufficient; measurement exceeds tolerance | abs(delta_z) > max(3*sigma_c, tau_policy) |
| **UNVERIFIABLE** | Evidence class insufficient for this check | Required evidence class not available |

`UNVERIFIABLE (needs E3)` is a **legitimate, honest result**, not an error. It is the system's distinctive property.

---

### 4.3 Georegistration & Error Propagation Model

**GNSS/CORS Integration:**

- Source: SoI CORS network (>1,100 stations, ~+/-3 cm RTK class)
- Per-point record: `{fix_type, sigma_h, sigma_z, baseline_length, timestamp, datum}`
- Vertical uncertainty model: `sigma_z = c * sigma_h` with `c` configurable (typical: 1.5–2.0)

**Datum Handling:**

| Datum | Usage |
|-------|-------|
| WGS84/ITRF | Primary storage; ellipsoidal height h always stored |
| Everest-1830 | Legacy Indian records; transform recorded per geometry |
| Orthometric | Only with named geoid model + version; inter-model differences over India can exceed 5 m |

**Covariance Propagation (Sigma):**

Every geometry carries a covariance matrix Sigma propagated through the pipeline:

```
Sigma_output = J * Sigma_input * J^T
```

where J is the Jacobian of the transformation at each pipeline stage. The combined uncertainty for comparison:

```
sigma_c = sqrt(sigma_expected^2 + sigma_observed^2)
```

**Georegistration Pipeline:**

1. ICP/plane-based alignment of sensor data to plan-derived model
2. Constrained by CORS GCPs
3. Residual analysis: per-point and per-plane residuals recorded
4. Sigma attached to every geometry version

---

### 4.4 Height Inference Algorithm (Viterbi/DP Peak Alignment)

**Given:**
- Plan levels with priors: spacing h ~ N(h_plan, sigma_h), monotonically increasing
- E1/E2/E3 height cues from sensors

**Algorithm:**

```
Step 1: Extract candidate z-peaks
  - From facade points: density peaks in z-histogram
  - From window-row detection: periodic horizontal features
  - From slab edges: planar segment intersections

Step 2: Align peaks to plan levels by Dynamic Programming (Viterbi-style)
  - States: plan levels (expected z positions)
  - Observations: detected z-peaks
  - Transition: monotonic, contiguous (skipped/extra levels at penalty)
  - Emission: P(observed_z | expected_z, sigma) = N(expected_z, sigma_obs)
  - Penalty: lambda_skip per skipped level; lambda_extra per extra detected peak

Step 3: Output per level
  {z_obs, sigma, n_support, evidence_class}
  Flag: EXTRA / MISSING / SHIFTED levels

Step 4: Sufficiency check
  If n_support < n_min OR sigma > sigma_max => UNVERIFIABLE, not PASS
```

---

## Associated AI/ML Subsystems

The end-to-end pipeline integrates four dedicated AI/ML models:
- **H1 (Automated Building Extraction):** ResNet-34 U-Net + KPConv point cloud segmentation.
- **H2 (Floor & Plan Segmentation):** Vectoriser (U-Net + OCR) & sensor-side Viterbi level inferencing.
- **H3 (Vertical Parcel Delineation):** Room adjacency GNN + Constrained Integer Linear Programming (ILP).
- **H4 (Intelligent Topology Validation):** Isolation Forest + Graph Anomaly Scorer + Active Learning loop.

*For complete model architectures, training datasets, loss functions, and failure mode analysis, see [aiml.md](aiml.md).*

---

## 8-Stage Live Demonstration Script

1. **Earth Space Orbit View**: Open Cesium globe showcasing international benchmark and Indian pilot zones.
2. **Bengaluru Flight**: Fly to Bengaluru Electronic City Tech Corridor; load terrain, cadastral parcel boundaries, and 3D buildings.
3. **Exploded Vertical Strata**: Select tower; trigger vertical floor explosion to inspect individual levels, parking basements, and units.
4. **Automated Cadastral Validation**: Display T0–T4 geometric/topological checks, watertightness tests, and provenance badges.
5. **Subsurface / Underground Inspection**: Toggle subterranean layer revealing basements, metro alignment, and utility conduits.
6. **Mumbai High-Density Validation**: Switch to Mumbai Lower Parel to demonstrate extreme vertical density and complex parcel relations.
7. **International Multi-Schema Benchmark**: Switch to Rotterdam/Singapore, demonstrating canonical data model stability without engine alteration.
8. **Core SIH Takeaway**: *"The platform identifies and validates true 3D volumes of urban property space, not merely 2D plots or visual building boxes."*
