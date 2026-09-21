# Architecture Decisions, Legal Rights & Evaluation Scenarios

## 1. India-First Design Doctrine & Strategic Decisions

> **India-First Design Doctrine (A3):** Every design element is anchored to Indian law, Indian institutions, and Indian data availability. Foreign systems (Singapore SLA, Netherlands Kadaster, Victoria ePlan) are read as case studies with explicit adopt / adapt / reject decisions — never as templates. Where Indian precedent exists (NAKSHA's 5% tolerance, ULPIN's geometry-derived ID, RERA's carpet-area definition), it is the default.

### Adopt / Adapt / Reject Matrix

| International Pattern | Source System | Decision | Rationale for India |
|----------------------|---------------|----------|---------------------|
| Lot-series class typing (S, B, L, U, etc.) | Singapore SLA | **ADAPT** | Retained class awareness (R3–R8), but mapped directly to Indian statutory concepts (RERA, State Apartment Ownership Acts). |
| Fixed 14-char geometry-derived identifier | Indian ULPIN (DoLR) | **ADAPT** | Retained as the parent prefix (`ULPIN14`), while adding opaque sequential RID to preserve identity through structural remodeling (P2). |
| Single centralized land registry node | Netherlands Kadaster / Singapore SLA | **REJECT** | Land is a State subject under the Indian Constitution (Seventh Schedule, List II, Entry 18). A federated model with state nodes is mandatory. |
| Automatic 3D title creation for all subsurface/airspace | Foreign Volumetric Systems | **REJECT** | India lacks statutory recognition of independent subterranean or air-rights title. Modeled as spatial objects with `legal_basis_status = ASSUMED`. |
| 5% Area Tolerance Threshold | DoLR NAKSHA pilot | **ADAPT** | Adopted as the conceptual ancestor for uncertainty-aware 3D probabilistic tolerance checks rather than arbitrary thresholds. |

---

## 5. LADM India Profile & Legal Rights Framework

### 5.1 ISO 19152-2:2025 (LADM Part 2) India Profile Mapping

| LADM Concept | India Profile Mapping | Source |
|-------------|----------------------|--------|
| `LA_Party` | Right holder (pseudonymised per DPDP Act) | Indian registration records |
| `LA_BAUnit` | Administrative unit tied to registration/khata | State land-revenue records |
| `LA_RRR` | Right/Responsibility/Restriction with `legal_basis_status` | Apartment Ownership Acts, RERA, state revenue |
| `LA_SpatialUnit` | 3D volume with RID | This system's registry |
| `LA_LegalSpaceBuildingUnit` | Building envelope (class B) | Sanctioned plans |
| `LA_LegalSpaceUtilityNetwork` | Utility corridor (class I) / Elevated corridor (class E) | Plan/survey data |
| `LA_Parcel` | Surface parcel column (class S) linked to ULPIN | DILRMP/NAKSHA/UPOR |
| `LA_BoundaryFace` | 3D boundary between spatial units | Computed from canonical geometry |
| `LA_Source` | Evidence set with provenance | Data ledger |

LADM is adopted **formally** as a data-model target for interoperability (R27). It is **descriptive, not prescriptive** — designed to be profiled per country. Our India Profile populates rights types, boundary conventions, and `legal_basis_status` from Indian sources exclusively.

---

### 5.2 Rights, Responsibilities, and Restrictions (RRR) Schema

```
Right {
  right_id:            UUID
  type:                enum {
                         OWNERSHIP_UDS_LINKED,       // Unit + undivided share
                         LEASE,
                         EASEMENT_ACCESS,
                         EASEMENT_UTILITY,
                         AIR_RIGHT,
                         SUBSURFACE_RIGHT,
                         LIMITED_COMMON_ALLOTMENT,    // Parking
                         RESTRICTION_SETBACK,
                         RESTRICTION_HEIGHT_CAP,
                         RESTRICTION_METRO_PROXIMITY, // MMRC 50 m zone
                         RESPONSIBILITY_MAINTENANCE
                       }
  holder:              PseudonymisedPartyRef    // DPDP-compliant
  source_document:     DocumentRef {
                         doc_type: enum {
                           DECLARATION,
                           DEED_OF_APARTMENT,
                           RERA_CERTIFICATE,
                           SALE_DEED,
                           GOVERNMENT_ORDER,
                           UTILITY_PERMIT
                         }
                         registration_no: string
                         date: date
                       }
  valid_from:          timestamp
  valid_to:            timestamp | null
  scope:               RID[]    // One or more RIDs this right applies to
  legal_basis_status:  enum {VERIFIED, ASSUMED, STATE_SPECIFIC}
  legal_basis_note:    string   // e.g. "MH Apt. Act 1970 sec 4" or "No Indian statute"
  undivided_share:     decimal | null   // UDS percentage for apartment ownership
  data_provenance:     enum {REAL, PROXY, SYNTHETIC}
}
```

**`legal_basis_status` Values:**

| Value | Meaning | Example Classes |
|-------|---------|----------------|
| **VERIFIED** | Directly supported by an Indian statute that has been section-level verified | U, C, P (via Apartment Ownership Acts) |
| **ASSUMED** | Spatial object is modelled but no Indian statute currently creates this right as a transferable legal interest | A (air-right), T (subsurface title) |
| **STATE_SPECIFIC** | Legal basis exists but varies by state law; specific state statute must be verified | TDR/FSI rules (MH DCPR vs KA TDR) |

---

### 5.3 Legal Overlap Semantics

Physical space is not the same as legal space. An IFC room is not automatically a U; a legal layer decides.

| Pair | Volume Overlap Allowed? | Condition |
|------|------------------------|-----------|
| U–U | **No** | Hard constraint |
| U–C (ownership vs common) | **No** | Hard constraint |
| P–P | **No** | Hard constraint |
| Ownership volume – easement/utility right | Yes | Only if a `Right` record of type EASEMENT exists; otherwise **FAIL** |
| A (airspace) – B/L/U below | **No** | A must be outside the building envelope |
| T (subterranean) – basement L/U | **No** | Unless T *contains* the declared basement |
| I (utility) – U/P/C | Yes | Only with easement `Right`; otherwise **FAIL** |
| E (elevated) – S/A | Yes | With right-of-way `Right`; must not intersect B |

---

### 5.4 Legacy Identifier Crosswalk Schema

Indian urban property is identified by several local identifiers. The 3D ULPIN registry maintains a `legacy_ids` table linked to the S-class RID (inherited by B/L/U/C/P):

```sql
CREATE TABLE legacy_ids (
  id              INTEGER PRIMARY KEY,
  rid             TEXT NOT NULL REFERENCES registry(rid),
  id_system       TEXT NOT NULL,    -- enum below
  legacy_value    TEXT NOT NULL,
  relationship    TEXT NOT NULL,    -- 'ONE_TO_ONE', 'MANY_TO_ONE', 'ONE_TO_MANY'
  verified        BOOLEAN DEFAULT FALSE,
  notes           TEXT,
  UNIQUE(rid, id_system, legacy_value)
);
```

| `id_system` | Where Used | Handling |
|-------------|-----------|---------|
| `CTS` | Mumbai city-survey records (CTS No. + Property Card) | Many-to-one / one-to-many with parcels |
| `PID` | Bengaluru e-Aasthi (e-PID, khata) | Many flats have no flat-level khata — a U-class RID fills the gap |
| `UPOR` | Karnataka UPOR towns/pilots (PR card) | Direct link to drone-survey-derived records |
| `SURVEY` | Older records: survey/hissa no., village, ward | Historical linkage |
| `RERA` | MahaRERA / K-RERA project/wing registration no. | Linked on B/U classes |
| `ULPIN` | DoLR / NAKSHA / Land Stack (14-char) | Parent anchor. If none exists, allocate `PROXY-ULPIN` (same format, `data_provenance = PROXY`) |

**Rule:** Legacy identifiers are *attributes with lineage*, never part of the RID string (P2).

---

## 9.4 Real-World Conflict Query Workflows

### 9.4.1 Bengaluru: Storm Drain vs Property Lot

```
Scenario: A property built over a former storm-water drain (raja kaluve)
          — a documented, recurring real Bengaluru dispute pattern.

Query: "Does property RID BZ1-xxx have a utility (I-class) or drain
        easement intersecting its ownership volume without a registered
        easement Right?"

Pipeline:
  1. /resolve/{property_rid}         => get U-class geometry
  2. /cover?bbox=property_bbox&cls=I => find intersecting I-class objects
  3. For each I-class object:
     a. Compute vol(U intersection I)
     b. Check: exists Right(type=EASEMENT_UTILITY, scope=[U_rid, I_rid])?
     c. If vol > epsilon_v AND no easement => FAIL: "utility-without-easement"
  4. /explain/{finding_id} => evidence, rule, confidence, geometry overlay

Result: ExplainObject showing the drain corridor intersecting the property
        basement, with data_provenance tags on both objects and the
        evidence class (likely E5 for the drain, E3 for the basement).
```

### 9.4.2 Mumbai: Metro Tunnel vs Tower Basement

```
Scenario: Aqua Line tunnel beneath a Worli/Lower Parel redevelopment tower,
          within MMRC's 50 m approval zone.

Query: "Does the basement of tower MZ1-TowerA intersect with or approach
        within regulatory clearance of the Aqua Line tunnel T-class object?"

Pipeline:
  1. /resolve/{tower_rid}              => get B-class, then child L-class (basement levels)
  2. /cover?bbox=tower_bbox&cls=T      => find T-class objects (Aqua Line tunnel)
  3. For each T-class object:
     a. Compute vol(L_basement intersection T_tunnel)
     b. If vol > 0 => FAIL: "basement-tunnel intersection"
     c. Compute min_distance(L_basement, T_tunnel)
     d. If min_distance < 50 m => check: exists Right(type=RESTRICTION_METRO_PROXIMITY)?
     e. If no restriction Right => FAIL: "within metro proximity zone without approval"
  4. /validate/{tower_rid}             => full tier stack with corridor clearance checks

Result: ExplainObject showing the spatial relationship between basement and
        tunnel, with the 50 m restriction volume visualised, provenance
        tagged (tunnel geometry = REAL route-level + SYNTHETIC depth).
```

### 9.4.3 Mumbai MZ-4: Heritage Low-Rise over Stacked Tunnels (T-over-T)

```
Scenario: Marine Drive heritage precinct — Metro Line 3 tunnel directly above
          Coastal Road twin tunnels at different depths, both under heritage
          S/B parcels.

Query: "What is the vertical clearance between the two T-class corridors
        beneath this heritage-listed surface parcel?"

Pipeline:
  1. /resolve/{heritage_parcel_rid}      => S-class parcel
  2. /cover?bbox=parcel_bbox&cls=T       => find all T-class objects
  3. For each pair of T-class objects:
     a. Compute vertical separation at shared XY extent
     b. Check structural clearance against engineering thresholds
  4. Visualise: vertical cutaway showing
     S (heritage surface) => T1 (Metro) => T2 (Coastal Road)

Result: Demonstration of why 2D records cannot represent this situation —
        a single surface parcel with two independent infrastructure corridors
        at different depths, each with different operators and legal
        authorities.
```

### 9.4.4 Bengaluru BZ-1: Multi-Line Underground Stack at Majestic

```
Scenario: Three metro lines converging underground near Majestic station
          — Purple, Green, and (planned) Pink Line at different depths.

Query: "What are all T-class objects beneath this CBD parcel, and do any
        of their clearance envelopes intersect?"

Pipeline:
  1. /cover?bbox=majestic_area_bbox&cls=T => find all T-class tunnels/stations
  2. For each pair (T_i, T_j):
     a. Compute vol(T_i intersection T_j)
     b. If vol > 0 => FAIL: "T-over-T intersection"
     c. Compute min_distance(T_i, T_j)
     d. Report clearance with uncertainty (sigma from as-planned status)
  3. /validate for each T-class object

Result: Multi-depth underground profile showing Purple (operational),
        Green (operational), Pink (as-planned) tunnels with clearance
        measurements and data_provenance badges indicating which are
        REAL (operational lines) vs SYNTHETIC depth (Pink Line).
```

---

## Appendix C: Novelty Claims

Each claim is traced to its source of novelty and the design decisions that distinguish it from prior work.

| # | Novelty Claim | What Makes It Novel | Traced To |
|---|-------------|-------------------|-----------|
| 1 | **Three-layer 3D ULPIN** (RID + NK + SA with hash-chained binding record) | Reconciles ULPIN's geometry-derived heritage with lifecycle persistence; extends an Indian standard rather than importing a foreign one | Section 3.2, P2 vs P5 tension |
| 2 | **Identity Continuity Test (ICT)** | Tolerance- and evidence-aware, examiner-in-the-loop decision for continue/new/split/merge; generalises NAKSHA's 5% tolerance into 3D | Section 3.8, NAKSHA precedent |
| 3 | **Evidence sufficiency ladder with UNVERIFIABLE** | Fourth output state (`UNVERIFIABLE`) as a first-class result, not an error; distinctive vs "detects anomalies" claims | Section 4.2 |
| 4 | **Uncertainty-propagated 3D topology** | Monte-Carlo/covariance-aware predicates and volume-conservation invariants; not deterministic-only checks | Section 7.3 |
| 5 | **Class-typed volumes for every PS object type** demonstrated on named real Indian scenarios | Not a generic international example; each class exercised against a specific Mumbai or Bengaluru location | Sections 2.1, 9.4 |
| 6 | **Plan-to-observed reconciliation with explain objects** | Joins the MCGM AutoDCR building pipeline and the survey/cadastre pipeline — a gap that exists even in advanced foreign systems | Section 7.4, 7.5 |
| 7 | **Adaptive tolerances** learned from examiner decisions | Seeded by NAKSHA's 5% precedent; updated via active learning loop | Section 6.4 |
| 8 | **Explicit REAL/SYNTHETIC data provenance on every object** | Transparency layer most cadastre-tech demos omit; extends UNVERIFIABLE-honesty to the data layer | Section 2.3, `data_provenance` |
| 9 | **Rigorous measurement via independent simulation** | Defect taxonomy + magnitude curves + identity-system conformance suite, with circularity explicitly broken | Appendix B |
| 10 | **Documented adopt/adapt/reject discipline** | Makes the "is this just copied from Singapore/Australia?" question unaskable — the answer is already tabulated | Section 1.1 India-first doctrine |

---

## Appendix D: Risks, Assumptions & Unverified Items

| Item | Status | Handling |
|------|--------|---------|
| ECCMA layout, ULPIN mutation/version semantics | Unverified | Obtain ECCMA Feb 2015 + NIC technical note; RID design is additive so it survives either answer |
| BBMP/GBA current plan-approval portal name/status (institutional rename to Greater Bengaluru Authority, 2024–25) | Unverified | Verify current portal/authority name before any live demo reference |
| Exact Mumbai Metro Line 3 / Coastal Road tunnel chainage and depth | Unverified | Use illustrative/simulated depth; cite only public route-level facts, never claim survey-grade alignment |
| Sanctioned-plan and NAKSHA data access | Unverified | Synthetic primary, schema-matched to MCGM AutoDCR/RERA; PROXY labelled |
| Legal effect of 3D records, air-rights law, state TDR/FSI rules (MH DCPR vs KA TDR rules differ) | Unverified | `legal_basis_status` field; no legal claim; verify per state before any specific TDR/FSI numeric claim |
| GeoSOT-3D details; IFC/OGC API versions | Unverified | Own Morton grid as fallback |
| ISO 7064 test vectors; val3dity error codes | Unverified | Verify during implementation |
| Literature novelty of ICT / 3D identifier lifecycle | Unverified | Targeted literature search before claiming novelty |
| CORS access terms, vertical accuracy, exact MH/KA station list | Unverified | Confirm via SoI CORS portal |
| Drone rules, geospatial policy, privacy (DPDP Act) details | Unverified | Not fully researched; review before any real-data flight/claim; default to pseudonymisation |
| Legal boundary convention (inner face/centre/outer) and RERA carpet-area definition per state | Unverified | Check per state before area/volume claims |
| Overture/Open Buildings ODbL share-alike | Verified (risk) | Keep derived data ODbL-compliant |
| NAKSHA's exact current ULB list/count (157 vs 152 vs 150 across sources) | Partially verified | Cite DoLR "About NAKSHA" figure (157/27+3/4,484 km²) as primary |
| Zone boundaries, Aqua Line station list, viaduct geometry, Pink/Purple station structure types | Unverified | Freeze zones on a map; use route-level facts only; depth/chainage simulated |
| MMRC 50 m proximity notice text | Partially verified | Secondary source only; verify the notice text before showing the number |
| Apartment Ownership Acts (MH 1970, KA 1972) — section-level reading; MOFA relevance | Unverified | Read the Acts; state only what the text supports |
| RERA public data (what MahaRERA/K-RERA actually let a user view/download; terms) | Unverified | Use public counts only; plans as test inputs, no redistribution |
| Rotterdam AHN/BAG/3D BAG tiles and licences; SLA airspace dataset fields | Unverified | Confirm before building the benchmark; drop benchmark rather than assume |
| Real ULPINs for urban Mumbai/Bengaluru parcels | Unverified | PROXY-ULPIN by default, flagged |
| Drone/own-capture legality for micro-pilot | Unverified | Optional; skip if any permission is unclear |

**Key Limitations to Own Out Loud:**

| Limitation | Why It Exists | Mitigation |
|-----------|--------------|-----------|
| No real Indian LiDAR/as-built data | Not open; restricted; DPDP | Labelled real anchors + Rotterdam real-sensor benchmark + optional own capture; report sim-to-real gap |
| Synthetic-data circularity | Same author writes generator and detector | Separate code paths/seeds, hold-out defects; at least one real case if capture succeeds |
| No legal effect of 3D records | India has no air-right/subsurface title statute | `legal_basis_status` everywhere; U/C/P anchored to apartment-ownership law |
| ULPIN internals not public | Layout not on DoLR page | RID is additive; PROXY-ULPIN flagged |
| Land is a State subject | Constitutional structure | Federated registry |
| Under-construction infrastructure | Pink Line, Blue Line | "As-planned" framing only |
| Breadth risk | 30 requirements, four data classes | MVP cut; depth on identity + reconciliation |

---

## Appendix E: Judge Q&A Cheat-Sheet

| Question | Answer |
|----------|--------|
| **Where does your data come from?** | Real Indian anchors (footprints, RERA counts, SoI CORS class, statute schemas), real foreign LiDAR/3D-cadastre data for *algorithm* benchmarks, and labelled simulation for everything Indian that is restricted. Every object carries a provenance tag. (See [data.md](data.md)) |
| **Why not just use Singapore's or the Dutch system?** | They are case studies with an adopt/adapt/reject table. India's apartment law, ULPIN, RERA and state land records are the baseline. |
| **Why these areas?** | Four Mumbai + three Bengaluru micro-zones where high-rise density meets metro/utility infrastructure — the PS problem — chosen for real, nameable infrastructure and public data. (See [data.md](data.md)) |
| **Doesn't NAKSHA already do this?** | NAKSHA's pilot targets small towns and defers megacities (Frontiers 2026); we prototype the vertical/subsurface layer that follow-on phase needs. (See [architecture.md](architecture.md)) |
| **Does Indian law recognise 3D title?** | Apartment ownership yes (state Acts); air-right/subsurface title no — so we tag every right with `legal_basis_status`. |
| **How does it work with existing IDs?** | Crosswalk to CTS/PID/UPOR/RERA/ULPIN; RID anchored to the parent ULPIN. |
| **How is it interoperable across states?** | Central grammar, state-level registry nodes, verification by RID + geometry. (See [architecture.md](architecture.md#4-federated-multi-state-registry-architecture)) |
| **Who in government would actually issue and hold this?** | DoLR/NIC set the national grammar and conformance suite; each state's Revenue Department / Directorate of Land Records is the issuing registry node — the same chain that rolled ULPIN out to 29 states. (See [config.md](config.md)) |
| **What's your rollout plan, and is it copied from Singapore/Netherlands?** | Phased: standard-setting then two-state pilot then conformance gate then Land Stack integration then parallel legal catch-up. We take Singapore's/Netherlands' *phasing and single-standard* pattern, reject their single-agency structure, because land is a State subject here. (See [config.md](config.md)) |
| **How do you know your AI works without real ground truth?** | Known-answer simulation with hold-out defects + real-sensor benchmark + reported sim-to-real gap. (See [validation.md](validation.md)) |
| **What if evidence is insufficient?** | `UNVERIFIABLE` is a first-class result. (See [pipeline.md](pipeline.md)) |
| **What would you do with real data access?** | Swap the ingestion adapters; identity/validation layers are geometry-agnostic. |
| **Is this a demo or a system?** | A system. Nothing about a place is hardcoded into rendering or identity logic. A "place" is a row in the registry. Adding Chennai or a fifth Mumbai zone means adding data through the same ingestion pipeline and conformance suite — the map does not need a new build. |
| **What are the units of the 3D ULPIN — what does it physically look like?** | `ULPIN14-B{seq}-{CLS}{seq}-{check}`. Example: `SYNTHETIC0001A-B0004-U0A3F1-7`. Fixed length, error-detecting, compact for storage, hyphenated for display. (See [features.md](features.md)) |
| **How do you handle the fact that Indian apartment buildings have 30,000+ units without individual khatas in Bengaluru?** | The U-class RID fills the gap the flat-level khata currently leaves empty. Each unit gets its own RID even if no khata exists yet — the RID is the identity that can later be attached to a khata when the state catches up. |

---

## Appendix F: Research Questions Answered

| RQ | Question | Where Answered |
|----|---------|---------------|
| RQ1 (Identifier) | What identifier grammar and generation algorithm give a standardised, verifiable, persistent identity to volumes that change over time, while staying backward-compatible with ULPIN? | [features.md](features.md) (Three-Layer Identity) |
| RQ2 (Vertical) | How should vertical position and its uncertainty be represented so identities and topology checks remain valid when absolute Z is uncertain? | [pipeline.md](pipeline.md#43-georegistration--error-propagation-model) & [validation.md](validation.md#73-probabilistic--monte-carlo-tolerance-testing) |
| RQ3 (Evidence) | Which 3D identities can be verified from which sensor evidence, and which cannot? | [pipeline.md](pipeline.md#42-evidence-sufficiency-ladder) |
| RQ4 (Validation) | How do we validate 3D topology under uncertainty rather than assuming exact geometry? | [validation.md](validation.md#72-core-3d-spatial-predicates--mathematical-formulation) |
| RQ5 (Measurement) | How do we measure all of the above rigorously when complete real ground truth is legally and practically unavailable? | [validation.md](validation.md#appendix-b-simulation--evaluation-programme) & [data.md](data.md#24-sim-to-real-protocol) |
| RQ6 (India-fit) | Which parts of the world's most advanced 3D-cadastre systems are transferable into India's existing stack without contradicting it? | Section 1 (India-first doctrine) & [config.md](config.md#91-phased-deployment-strategy) |

---

## Appendix G: Concrete Scenarios per Object Class and City

This table is the single best "show, don't tell" artifact for a judge panel: identical object classes, two different real state legal contexts, same 3D ULPIN grammar underneath — direct evidence for R24's "interoperable" claim.

| Object Class | Bengaluru Scenario | Mumbai Scenario |
|-------------|-------------------|----------------|
| **T** (subterranean) | (BZ-1) Basement of a CBD tower near MG Road/Shivajinagar vs the **Pink Line** tunnel/station box — a T-intersects-T clearance query, framed as *as-planned* since the section is under construction | (MZ-1) Multi-level basement of a Worli/Lower Parel tower vs the Aqua Line tunnel and the MMRC 50 m approval zone (modelled as a `restriction` volume) — a T-intersects-restriction query |
| **I** (utility) | A property built over a former storm-water drain (*raja kaluve*) — a documented, recurring real Bengaluru dispute pattern; utility/drain easement vs ownership volume conflict | Old municipal water/sewage line under a redeveloped plot (TDR-driven densification) — utility-without-easement conflict |
| **E** (elevated) | (BZ-2) Blue Line Phase 2A viaduct over ORR-zone parcels — `SPANS` relation + headroom/clearance query; (BZ-1) MG Road: elevated line over/near underground line — stacked E-over-T | (MZ-1) Metro viaduct sections near Mahalaxmi/Lower Parel crossing a mixed residential-commercial block — same query pattern, different state authority |
| **A** (air-right) | TDR-receiving plot near ORR using purchased FSI to build extra floors — airspace volume above the "as-of-right" envelope, `legal_basis_status = STATE_SPECIFIC` (Karnataka TDR rules) | Classic Mumbai TDR/FSI redevelopment case — same object class, Maharashtra DCPR-specific rules |
| **T-over-T** (stacked tunnels) | (BZ-1) Purple + Green + Pink Line tunnels at different depths near Majestic — three independent T-class corridors under one surface area | (MZ-4) Metro Line 3 above Coastal Road twin tunnels under Marine Drive — two independent T-class corridors at different depths under heritage parcels |
| **SRA mixed-tenure** | — | (MZ-3) SRA redevelopment tower with mixed free-sale + rehabilitation-tenement units in one building — a distinctive Indian vertical-property class not exercised elsewhere |
| **Heritage-over-infrastructure** | — | (MZ-4) Heritage-protected, height-restricted Art Deco/Fort precinct above the deepest, densest underground infrastructure in the pilot — demonstrates why 2D records cannot show what is beneath a surface parcel |
| **IT-park commercial** | (BZ-3) Large single-owner commercial towers in Electronics City SEZ — fewer, larger U/C objects than residential; Yellow Line elevated corridor crossing IT parcels | — |

---

## Appendix H: Security, Privacy, Traceability & PS Source Status

### H.1 Security & Privacy Principles (DPDP Act 2023)
- **Zero PII in Identifiers**: Never encode owner names, Aadhaar numbers, phone numbers, or private contact details into spatial identifiers.
- **Role-Based Conceptual Access**: Distinct access policies for Public Viewer, Cadastral Analyst, Administrator, and Data Steward.
- **Forensic Traceability**: Every externally sourced layer binds immutable cryptographic provenance metadata.
- **Legal Wording Integrity**: Use honest terminology: *"derived 3D property volume"*, *"source record indicates"*, *"prototype 3D ULPIN"*; never assert official state land title issuance.

### H.2 Requirements Traceability Matrix
| ID | Requirement | Status | Evidence / Implementation |
|---|---|---|---|
| R-001 | 3D ULPIN Generation | CONFIRMED | Three-layer identity model (RID, Natural Key, Statutory Anchor) |
| R-002 | Vertical Property Mapping | CONFIRMED | Extruded polyhedral floor slabs & property unit solids |
| R-003 | Multi-Storey Apartments | CONFIRMED | Floor & unit volumetric subdivision with RERA carpet-area tolerance |
| R-004 | Underground Infrastructure | CONFIRMED | Subterranean Class `T` (tunnels, foundations, basements) |
| R-005 | Elevated Transport Corridors | CONFIRMED | Class `E` (Metro viaducts, flyovers with vertical clearance buffers) |
| R-006 | Parking Spaces | CONFIRMED | Class `P` (designated subterranean and podium parking bays) |
| R-007 | Air-Rights | CONFIRMED | Class `A` (airspace property volumes, TDR envelopes) |
| R-008 | Subsurface Utility Networks | CONFIRMED | Class `I` (pipes, drainage, power conduits with easement overlap queries) |

### H.3 Problem Statement Source Verification
- `ps.md` maintains the exact verbatim transcription of the confirmed problem statement.
- `ps-2.md` documents continuation provisions and verified requirements.
- Core rules: No silent modifications; design decisions and interpretations are documented in `solution.md` and `docs/decisions.md`.
