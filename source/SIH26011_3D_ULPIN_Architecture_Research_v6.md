# SIH26011 — 3D ULPIN Generation & Vertical Property Mapping
## v6 — Primary-Focus Edition: 3D ULPIN Generation & Vertical Mapping First, PS-Coverage Second (adds C0 quick-answers, C13 government roll-out roadmap, MZ-3/BZ-3 zones, Rotterdam + Singapore third case areas)

> **Contract (unchanged since v4):** The problem statement (PS) and its description are the specification, and solving it is the entire objective of this project. Every noun in the PS is a numbered requirement (R-ID) with a component, a data source, and a test. Research — Indian and international — is *backing evidence for design decisions*; it never substitutes for or dilutes a PS item.
> **Priority order, made explicit in v6:**
> **① PRIMARY — the 3D ULPIN itself.** How a 3D ULPIN is generated, how it is made unique, what law it sits on, how it extends the existing 2D ULPIN, and how India should actually roll it out state by state, is the project's centre of gravity. Read **Part C in full**; start with the new **§C0 quick-answer index** if you only have five minutes.
> **② SECONDARY — the rest of the problem statement** (multi-city fusion pipeline, AI/ML extraction, topology validation, examiner console, evaluation programme). This is still built in full (Parts A, D–R) because the PS requires it, but it exists to *produce, populate and validate* 3D ULPINs — it is not a second focus of equal weight.
> **Status tags:** ✅ verified in a source · 🟡 verified with caveat · ⚠️ unverified/needs check · 💡 our design judgement (not a sourced fact) · 🎯 design target (not a measured result) · 🇮🇳 Indian primary source/policy · 🌍 foreign case study (inspiration only — see A3)

---

## CHANGELOG — v5.1 → v6 (this revision)

**Verdict in one line 💡:** v5.1 was already architecture-complete; v6 does not change the architecture. It (a) makes the 3D ULPIN itself the explicit, stated priority over the rest of the PS, (b) adds one dense, self-contained answer section (§C0) covering generation, uniqueness, law, 2D→3D extension and the "why this design" question in plain language, (c) adds a state-by-state government adoption roadmap (§C13) grounded in how DoLR/NIC/state Revenue Departments actually rolled out ULPIN, and (d) widens the pilot and case-study footprint: a third zone in Mumbai and a third zone in Bengaluru, and a third focus-area in both Rotterdam and Singapore.

**New in v6:** §C0 (plain-language answer index for the 3D ULPIN) · §C13 (government adoption roadmap, India + state governments, inspired by other countries) · MZ-3 and **MZ-4 (South Mumbai/Marine Drive)** pilot zones · BZ-3 pilot zone plus **full Purple/Green/Yellow/Pink/Blue Namma Metro line and underground-station coverage across the BZ zones (§B3.2a)** · a third Rotterdam angle in §B-CS.6 (national rollout/governance model) · a third Singapore angle in §B-CS.7 (statutory/legal-instrument model) · §B-CS.8 role matrix updated for four Mumbai/three Bengaluru zones.

**Nothing removed.** All v5.1 content, corrections and the changelog below are retained; PS coverage (A1) is unchanged and re-checked.

---

## CHANGELOG — v5 → v5.1 (previous revision)

**Verdict in one line 💡:** the v5 architecture is sound and build-ready. What was *not* ready was (a) the pilot scope, (b) the real-data story, and (c) several factual/design errors found while re-verifying against Indian sources. All are fixed below. Full verdict, limitations, MVP cut and judge Q&A: **Part R**.

**New parts:** B3 (pilot micro-zones) · B-CS.6 Rotterdam · B-CS.7 Singapore (deepened) · B-CS.8 four-city role matrix · D0.5–D0.8 (real-vs-simulated ledger v2, access/legal status, sim-to-real protocol, real-capture micro-pilot) · C11 legacy-ID crosswalk · C12 federated registry · Part R.

**Corrections to v5 found on re-verification:**

| # | v5 said | Problem | v5.1 fix |
|---|---|---|---|
| 1 | India has "no equivalent" strata statute (B-CS.1, B-CS.5) | **Wrong.** Maharashtra Apartment Ownership Act 1970 and Karnataka Apartment Ownership Act 1972 exist: individual, heritable, transferable apartment ownership + undivided share of common areas, via a registered Declaration; the Karnataka Act also requires floor-plan copies to be registered | B1.4, B-CS.1, B-CS.5 rewritten. Indian apartment law is the *legal anchor* for classes U/C/P. What India lacks is a statute for volumetric **air-right / subsurface title**, not apartment ownership |
| 2 | Bengaluru underground = "MG Road–Baiyappanahalli/city-centre tunnel"; ORR tower vs "Namma Metro tunnel" | Not supported. Bengaluru's big underground build is the **Pink Line** (Dairy Circle–Nagawara via MG Road/Shivajinagar/Cantonment, under construction). The ORR corridor is **elevated** (Blue Line Phase 2A, planned) | B2.2, G2, L corrected; Bengaluru split into two zones (B3) |
| 3 | "BBMP AutoDCR / Pre-DCR" | Name unverified | Plan approval referred to as OBPS; property record as e-Aasthi/e-khata with e-PID (🟡 verify names before any demo) |
| 4 | No mapping from existing Indian property identifiers to ULPIN | State land-department judges will ask "what about CTS no. / PID / khata / UPOR?" | New C11 crosswalk |
| 5 | Pilot = "Mumbai and Bengaluru" (whole cities) | Unbuildable, unfocused | B3: four micro-zones, three-tier fidelity |
| 6 | No real LiDAR anywhere in the data plan | H1/D4 results would be 100% synthetic | Rotterdam real-sensor benchmark + optional own-capture (D0.5–D0.8) |
| 7 | "Restricted CAD files not obtainable" treated as a blanket (D0.3) | RERA project pages publicly show structured counts (floors, units, parking) and sanctioned plans | Real counts parametrise the simulator; a few real plan rasters used as H2 *test* inputs |
| 8 | ULPIN14 "real where it exists" | Real ULPINs for Mumbai/Bengaluru *urban* parcels may not exist yet (⚠️ verify) | Default is an explicit PROXY-ULPIN (same format, flagged); C11 |

**Unchanged:** PS decomposition A1, the three-layer 3D ULPIN (Part C), ICT, evidence ladder, validation tiers, rights model, evaluation programme. The contract at the top still holds: the PS is the specification; research only backs design decisions.

---


## CHANGELOG — v4 → v5 (what this revision fixes)

v4 was architecturally sound but left three things the judges will ask on Day 1 unanswered or buried. v5 answers them head-on, as new load-bearing parts, not footnotes:

1. **"Where does your data actually come from?"** — v4 mentioned "synthetic" and "PROXY" in passing (§M6, one line). v5 adds **PART D0**, a full real-vs-simulated data ledger, input by input, with what is genuinely obtainable in India today, what is legally/practically not, and why the gap is filled by calibrated simulation rather than hidden.
2. **"Why Mumbai and Bengaluru?"** — v4 had zero pilot-city content. v5 adds **PART B2**, justifying two named pilot geographies with real, checkable institutional data sources in each city, and is explicit that this is a scoping decision the team is making, not something the PS mandates.
3. **"Is this an Indian solution or a copy of Singapore/Australia?"** — v4's research (Part B) read like a survey of foreign systems with India as one bullet among many. v5 restructures research so the **Indian legal/institutional backbone comes first and is the thing being extended**; foreign systems move to a clearly labelled case-study section with an explicit *adopt / adapt / reject* table so no design element can be mistaken for a copy-paste.
4. **"Show me the architecture, not just the pitch."** — Part J is expanded into a layered, service-level architecture with a concrete tech stack, deployment shape, and non-functional targets, so the frontend (built separately, out of scope here) has a real backend contract to sit on.

Nothing from v4 is deleted; PS coverage (A1) is preserved in full and re-checked against the new parts.

---

## PART A — THE PROBLEM STATEMENT AS THE SPECIFICATION

### A1. Decomposition (nothing skipped, nothing added that PS didn't ask for)

The PS has three layers: **Background** (why), **Description** (what to build), **Expected Solution** (what outcome). The Background lists *more object classes* than the Description — all must be covered. This table is also the final acceptance checklist (see Part P).

| R-ID | PS text (paraphrased) | Layer | Requirement we commit to |
|---|---|---|---|
| R1 | 2D record systems inadequate for vertical cities | Background | Quantified failure case of 2D ("what is below/above this parcel?") and its 3D resolution, demonstrated on real Mumbai/Bengaluru parcels (§B2, §D0) |
| R2 | Existing systems identify surface parcels only | Background | Extend, do not replace, existing ULPIN (§C) |
| R3 | Uniquely define ownership rights for **multi-storey apartments** | Background | Level/Unit/Common/Accessory identities + rights records (§C, §E) |
| R4 | …**underground infrastructure** | Background | Subterranean lots + utility-network segments (§C, §G, §G2) |
| R5 | …**elevated transport corridors** | Background | Elevated-corridor volumes crossing multiple parcels (§C5, §G2) |
| R6 | …**parking spaces** | Background | Accessory/limited-common spaces linked to units (§E) |
| R7 | …**air-rights** | Background | Airspace volumes above parcels/buildings (§C, §E) |
| R8 | …**subsurface utility networks** | Background | Utility segments with depth uncertainty (§G, §D0) |
| R9 | Build a **3D ULPIN generation** system | Description | Standard grammar, generator, verifier, registry, lifecycle (§C) — **primary deliverable** |
| R10 | …and **vertical property mapping** | Description | Vertical parcel delineation pipeline (§F) |
| R11 | Unique spatial identities for **surface parcels** | Description | Class S (surface column) IDs |
| R12 | …for **multi-storey apartments** | Description | Classes B/L/U/C/P |
| R13 | …for **underground infrastructure** | Description | Classes T/I |
| R14 | Integrate **drone imagery** | Description | Ingestion → ortho/mesh → evidence (§D, §D0) |
| R15 | Integrate **LiDAR / 3D point cloud** | Description | Ingestion → classification → planes/levels (§D, §D0) |
| R16 | Integrate **GIS parcel layers** | Description | Parcel/ULPIN layer as parent anchor (§C, §D, §B2) |
| R17 | Integrate **building floor plans** | Description | Plan ingestion (CAD/IFC/raster) → expected 3D model (§D, §F, §B2) |
| R18 | Integrate **GNSS/CORS coordinates** | Description | Georegistration + uncertainty model (§D3) |
| R19 | Integrate **DEM/DSM** | Description | nDSM heights, ground reference, level priors (§D, §D0) |
| R20 | AI/ML **automated building extraction** | Description | Trained extractor + metrics (§H1) |
| R21 | AI/ML **floor segmentation** | Description | Plan-side and sensor-side (§H2) |
| R22 | AI/ML **vertical parcel delineation** | Description | Constraint-guided delineation (§F, §H3) |
| R23 | AI/ML **intelligent topology validation** | Description | Rule engine + uncertainty-aware + learned ranking (§I, §H4) |
| R24 | Scalable, interoperable 3D cadastral framework | Expected | Tiling/index, standards mapping, layered service architecture (§J, §K) |
| R25 | Generate **standardized** 3D ULPINs | Expected | Published grammar + test vectors + conformance suite (§C6) |
| R26 | Map **vertical and underground ownership rights** | Expected | Rights model linked to 3D IDs, India-profiled (§E) |
| R27 | Support **volumetric cadastre** systems | Expected | LADM Part 2 / IFC / CityGML mapping (§K) |
| R28 | Enable accurate **urban property governance** | Expected | Examiner workflow, audit trail (§L) |
| R29 | **Reduce ownership conflicts and ambiguities** | Expected | Discrepancy classes with measured detection (§I, §M) |
| R30 | Improve **infrastructure planning and utility management** | Expected | Utility-vs-parcel/basement conflict queries (§G, §G2, §L) |

### A2. Research questions the project answers

- **RQ1 (identifier):** What identifier grammar and generation algorithm give a *standardised, verifiable, persistent* identity to volumes that change over time, while staying backward-compatible with ULPIN?
- **RQ2 (vertical):** How should vertical position and its uncertainty be represented so identities and topology checks remain valid when absolute Z is uncertain?
- **RQ3 (evidence):** Which 3D identities can be *verified* from which sensor evidence, and which cannot? (evidence sufficiency)
- **RQ4 (validation):** How do we validate 3D topology under uncertainty rather than assuming exact geometry?
- **RQ5 (measurement):** How do we measure all of the above rigorously when complete real ground truth is legally and practically unavailable? (real data for realism + independent simulation for ground truth — §D0)
- **RQ6 (India-fit, new in v5):** Which parts of the world's most advanced 3D-cadastre systems are *transferable* into India's existing DILRMP/ULPIN/NAKSHA/RERA legal-institutional stack without contradicting it, and which are not? (§A3, §B1)

### A3. India-first design doctrine (new — governs every later decision)

This is a rule, not a preference, and every section below is checked against it:

1. **The baseline is Indian law and Indian institutions.** The system is defined as an *extension* of ULPIN/DILRMP/NAKSHA/Land Stack and must interoperate with them by default (P3, §C1). It is not defined as "a LADM implementation" or "a Singapore-style cadastre for India."
2. **Foreign systems are read only to extract a transferable *pattern*, never a literal design.** Singapore's SLA lot-number series, Victoria's ePlan mandate, Overture's GERS IDs, and LADM Part 2 appear in this dossier strictly as **case studies** (🌍), each followed by an explicit statement of what we take, what we change, and what we discard, because it does not fit Indian land law, Indian survey practice, or Indian data availability (§B1 table).
3. **No design element is adopted just because a richer country did it.** Air-rights trading, strata-title registries, and BIM-mandated permitting exist in some case-study countries but have no equivalent legal instrument in India yet; we model the *spatial object* (so the system is future-proof) but never assert a *legal effect* that Indian law does not currently grant (`legal_basis_status` field, §C10).
4. **Where an Indian programme already made a policy choice (e.g. NAKSHA's 5% area tolerance, ULPIN's geometry-derived ID, RERA's carpet-area definition), that choice is the default**, and a foreign alternative is used only as a documented fallback when no Indian precedent exists (e.g. GeoSOT-3D as fallback grid, §C7).

---

## PART B1 — INDIA'S OWN LAND-DATA STACK (THE BASELINE WE EXTEND, READ FIRST)

This section used to be buried inside a longer "what existing systems teach us" part in v4. In v5 it comes **before** any foreign case study, because it is the thing the project is actually built on top of.

### B1.1 ULPIN — the identifier we extend, not replace 🇮🇳
- ✅ 14-digit alphanumeric parcel ID, part of DILRMP, based on parcel coordinates, ECCMA + OGC compliant (DoLR ULPIN page; Springer, Sengupta et al. 2024).
- ✅ DoLR describes a formula generating an ECCMA "PNIU" from parcel vertices; the ID "spatially points to the surface of the parcel"; a new ID is generated on mutation because the parcel's coordinates change (DoLR text as quoted by secondary press).
- 🟡 A Maharashtra presentation states generation uses the parcel's **interior point** (secondary; verify in ECCMA doc).
- ⚠️ Whether ULPIN "applies to vertical features" appears only on a secondary site — **do not cite**.
- ⚠️ Exact bit/char layout is not on DoLR's public page; **obtain ECCMA "property identifier standards, document 1, Feb 2015" and the NIC technical note** before implementation.

**Consequence for design 💡:** ULPIN is *geometry-derived* and *changes on parcel mutation*. Correct for a surface parcel; wrong as the sole identity of a unit that must persist through remodelling. Hence the three-layer identity in §C2 — an *extension* of ULPIN's own logic, not a foreign import.

### B1.2 NAKSHA — India's own urban 3D/GIS survey programme, and exactly where it stops 🇮🇳
- ✅ NAKSHA (DoLR) pilot covers **157 ULBs across 27 states + 3 UTs, 4,484 km²**, using aerial survey + drones + field verification to build GIS-integrated urban land records (DoLR "About NAKSHA").
- ✅ The pilot **deliberately targets small, "administratively manageable" towns** — municipalities under roughly **3,500 hectares and 200,000 population** — explicitly as a proving ground **"before its deployment in India's high-complexity megacities"** (Frontiers 2026, peer-reviewed). Karnataka and Maharashtra each have 10 NAKSHA ULBs at the time of the booklet (DoLR NAKSHA booklet, Feb 2025) — none of them Bengaluru or Mumbai.
- ✅ 5% parcel-area tolerance, overlap/gap → anomaly → GNSS field survey; within tolerance & matching possession → UAV boundary adopted (Frontiers 2026). This is the Indian precedent our tolerance design generalises from (§I3), not a foreign borrowing.
- ✅ Land Stack launched 31 Dec 2025 (Chandigarh, Tamil Nadu), integrates land, ownership, registration, **building** data (PIB) — the national platform our registry is built to plug into.

**This is the single most important research finding for scoping the project 💡:** NAKSHA itself has *not yet* attempted the megacity, high-rise, multi-basement, metro-corridor problem that this PS describes — it has explicitly deferred that to a later phase. Our project is therefore not duplicating NAKSHA; it is prototyping the **next phase NAKSHA has publicly said it will eventually need**, using the two Indian metros where the vertical-property problem is most acute today (§B2).

### B1.3 State-level programmes that already did metro-scale survey work — our actual pilot inputs 🇮🇳
- ✅ **Karnataka — Urban Property Ownership Records (UPOR):** a drone-based, Survey-of-India-assisted urban property survey run under the Karnataka Land Revenue Act, 1964 (Sec. 152), piloted in Jayanagar (Bengaluru) and Mysuru, producing Property Register (PR) cards with GPS-referenced spatial boundaries, ownership, and rights history (Deccan Herald, multi-year coverage; ISEC working paper). As of 2026 the Greater Bengaluru Authority (GBA) is actively **integrating UPOR drone imagery into e-khata property records** (Deccan Herald, 2026). This is a real, current, city-specific source of surface-parcel geometry for Bengaluru — not a proxy.
- ✅ **Maharashtra / MCGM (Mumbai) — OneMCGM GIS + AutoDCR:** MCGM digitised its Development Plan (100+ GIS layers: parcel boundaries, land-use zones, roads, coastal-regulation zones) into the OneMCGM GIS portal (Esri India case study; community.data.gov.in), and separately runs **AutoDCR**, a CAD-based Building Plan Approval scrutiny system used by 2,000+ architects across all MCGM wards to submit and check building drawings (SoftTech/MCGM case study). AutoDCR is a real, checkable Indian source of digitised **building floor plans** (R17) — this is exactly the PS input, from the pilot city itself, not a generic international dataset.
- 🟡 **Bengaluru — plan approval and property records:** building-plan approval runs through an online system (OBPS) that asks for an e-khata/e-PID (secondary source); the property record is e-Aasthi/e-khata, mandatory for registration since Sept 2024, with an electronic property ID (e-PID) (Deccan Herald; Landeed explainer). ⚠️ Verify current portal names and the Greater Bengaluru Authority transition before any live-demo reference.
- ✅ Survey of India CORS network: >1,100 stations nationally, RTK ≈ ±3 cm class claims (SoI statements), with stations in both Maharashtra and Karnataka usable for georegistration in both pilot cities (§D3).

### B1.4 India's own vertical-property law fragments — what we can and cannot claim
- RERA (2016) defines **carpet area** and mandates disclosure of sanctioned floor plans to buyers — the closest thing India has to a statutory "unit boundary convention" (⚠️ verify exact carpet-area geometry convention per state RERA rules before any legal claim, §C5.6).
- ✅ **Apartments are already a statutory, state-level property form in both pilot states.** Maharashtra Apartment Ownership Act, 1970 (preamble: ownership of an individual apartment, heritable and transferable) and Karnataka Apartment Ownership Act, 1972 (sections on status and ownership of apartments, common areas, contents of Declaration and Deeds, and registration of Declarations, Deeds **and copies of floor plans**). The Declaration states each apartment's percentage of undivided interest in common areas (Maharashtra Act summary); Karnataka High Court reporting (2025) treats land under a declared building as common area. 💡 **Design consequence:** classes U/C/P are not speculative — they map onto existing Indian instruments (Declaration → common / limited-common; Deed of Apartment → U; undivided interest → UDS field). India does *not* have a statute for volumetric **air-right or subsurface title**; those stay `ASSUMED` / `STATE-SPECIFIC`. ⚠️ Section-level reading of both Acts (and MOFA for co-operative/company-type societies in Maharashtra) is still needed before any legal-mapping claim.
- 🟡 **A real Bengaluru gap our system addresses:** Deccan Herald (Oct 2024) quotes a homebuyer forum saying Bengaluru has 30,000+ apartment buildings and most builders have not split the land khata into individual flat khatas — flat-level records are a "grey area". Treat the figure as a claim (advocacy source), the gap as real.
- 🟡 **Metro proximity as a 3D-aware regulation already in force:** a public notice reported to be issued by MMRC on 30 Nov 2025 requires approval for redevelopment/excavation within 50 m either side of the Aqua Line (secondary real-estate reporting; verify against the MMRC notice). Whatever the exact number, it shows Indian authorities already regulate *volumes around subsurface infrastructure* with 2D buffers — the gap 3D ULPIN closes.
- 🟡 **Land is a State subject in India (records); registration/transfer is a concurrent subject** (constitutional entries; confirm citation). → the registry must be **federated** (§C12), not a single national database overriding state law.
- ✅ **RERA project pages are public structured data.** MahaRERA's detailed certificate lists buildings/wings, approved and habitable floors, residential/non-residential unit counts and parking counts; project pages also show CC/OC status and sanctioned plans (MahaRERA/press reporting). K-RERA equivalent ⚠️ not verified. This is real Indian per-building vertical data (§D0.2).
- 🟡 Delhi 3D-cadastre paper (2019): digitised records remain 2D only; a widely repeated claim that "DoLR co-authored a paper saying legal frameworks don't recognise 3D property" could not be relocated in this pass — **do not cite until found**.
- No Indian statute currently defines "air-right" or "volumetric title" as a transferable legal interest the way Singapore's Planning Act does. **Design consequence:** the system models the *spatial object* for every PS class (including air-rights, R7) but tags every right with `legal_basis_status ∈ {VERIFIED, ASSUMED, STATE-SPECIFIC}` (§C10) so the demo never overstates what Indian law currently grants — this is honesty the judges (many from government) will specifically check for.

---

## PART B2 — PILOT GEOGRAPHY: WHY MUMBAI + BENGALURU (NEW IN v5)

The PS names no city. This is our scoping decision, stated explicitly so it can be defended in front of judges — and, per the finding in §B1.2, it is a decision that goes *beyond* NAKSHA's current scope on purpose, into the megacity case NAKSHA has said it will eventually need.

### B2.1 Selection criteria
A defensible pilot city needs: (a) acute vertical/underground complexity so the PS problem is real, not hypothetical; (b) an existing digitised GIS/parcel layer we can genuinely anchor to (so class S is not synthetic); (c) an existing digitised building-plan pipeline (so class B/L/U has a real "expected model" source, §F); (d) CORS/GNSS coverage for georegistration; (e) at least one real elevated-corridor and one real underground example (R4, R5, R8) so those object classes are not paper-only.

### B2.2 Bengaluru — why it fits
| Criterion | Real Bengaluru evidence |
|---|---|
| Surface parcels (S) | Karnataka UPOR / e-khata drone survey, GPS-referenced PR cards (§B1.3) 🇮🇳 |
| Building plans (B/L/U) | Bengaluru online plan approval (OBPS, 🟡 verify name/authority); K-RERA project disclosures ⚠️; registered KAOA Declarations carry floor plans (§B1.4) |
| Vertical complexity | Dense IT-corridor high-rises (Outer Ring Road, Whitefield) with basements, podium parking, mixed-use towers |
| Elevated corridor (E) | Namma Metro elevated viaducts — Purple Line (operational) and Blue Line Phase 2A along the ORR (planned, opening targeted ~Dec 2026 per secondary reporting 🟡) — spanning multiple private parcels. MG Road is the Pink (underground) / Purple interchange, giving a real *stacked* E-over-T case ⚠️ verify station structure types with BMRCL |
| Underground (T/I) | Namma Metro **Pink Line** underground section (Dairy Circle–Nagawara via MG Road, Shivajinagar, Cantonment; under construction, opening targeted ~Dec 2026 per secondary reporting 🟡) + dense buried utilities on a lake-and-drain-heavy terrain, where "which property sits on a former storm-water drain (*raja kaluve*)" is a documented recurring dispute (Deccan Herald / The News Minute) — a genuine R8/R30 use case unique to Bengaluru |
| CORS/GNSS | KSRSAC + SoI CORS coverage in Karnataka |

### B2.3 Mumbai — why it fits
| Criterion | Real Mumbai evidence |
|---|---|
| Surface parcels (S) | MCGM OneMCGM GIS — digitised parcel boundaries, land-use zones, Development Plan 2014–34 layers (§B1.3) 🇮🇳 |
| Building plans (B/L/U) | MCGM AutoDCR — CAD-based sanctioned building plans, live system used by 2,000+ architects across all wards |
| Vertical complexity | Extreme land scarcity (Mumbai is reclaimed-island geography) driving very tall residential towers, deep multi-level basements, and TDR/FSI-linked redevelopment — the sharpest possible "why 2D fails" story for R1 |
| Elevated corridor (E) | Mumbai Metro elevated viaduct sections (e.g. Metro Line 2A/7) spanning multiple parcels |
| Underground (T/I) | Mumbai Metro Line 3 (Colaba–Bandra–SEEPZ) underground tunnel and station boxes; Mumbai Coastal Road twin tunnels under Malabar Hill — real, large, publicly reported underground infrastructure directly under private and public surface parcels ⚠️ (verify exact alignment/chainage from MMRC/MCRP public disclosures before using specific coordinates in a demo) |
| CORS/GNSS | SoI CORS stations in Maharashtra; MCGM's own Permanent Reference System + RTK rover network (Esri/MCGM case study) |

### B2.4 What the two cities give the project *together*
- Two different state administrative stacks (Maharashtra vs Karnataka) exercising the same 3D ULPIN grammar → demonstrates **interoperability across states**, which is exactly what R24 ("scalable and interoperable") asks for, and is a stronger SIH story than one city alone.
- Two different failure geographies: Mumbai stresses *vertical density + reclaimed-land basements + TDR*; Bengaluru stresses *underground utility/drain conflicts + IT-corridor high-rises + metro tunnelling*. Between them they exercise nearly every PS object class (R3–R8) with a real, nameable, checkable example.
- Both cities already run **NAKSHA's own precedent tolerance (5% parcel-area)** and Survey-of-India CORS infrastructure, so the pilot is policy-consistent with the national programme even though it is scoped beyond NAKSHA's current town-size limit (§B1.2).

### B2.5 Honesty about scope (say this to judges before they ask)
We do **not** claim to have obtained restricted municipal CAD files, live NAKSHA ORI tiles, or metro-tunnel as-built drawings for the hackathon. §D0 states exactly which Mumbai/Bengaluru layers are used as **real anchors** (open footprints, published GIS layer descriptions, public metro alignments, published CORS station lists) versus which are **necessarily simulated** (interior partitions, exact basement depth, ownership records) because they are either not public, not digitised yet, or restricted under privacy law (§D0.4). This is stated up front as a strength (methodological honesty), matching the "UNVERIFIABLE is a legitimate result" design principle already in v4 (§D2).

---

## PART B3 — PILOT MICRO-ZONES: WHICH PARTS OF MUMBAI & BENGALURU, AND HOW MUCH OF EACH (NEW IN v5.1)

We do **not** model two cities. We model **four micro-zones**, each roughly 1–3 km² around a high-rise cluster that also contains subsurface or elevated infrastructure — the exact PS problem — and we spend fidelity only where it produces evidence.

### B3.1 Interpretation
"High-rise / booming areas" is read as: dense vertical redevelopment or IT-office clusters with basements, transit corridors and buried utilities. ⚠️ Team must draw and freeze the zone boundaries on a map before data collection.

### B3.2 Zones

| Zone | Why here (PS classes exercised) | Real anchors | Honest caveats |
|---|---|---|---|
| **MZ-1 Mumbai — Worli / Lower Parel / Mahalaxmi belt** (primary) | Tall towers on former mill land and redevelopment plots → B, L, U, C, P, and A (TDR/FSI story). Aqua Line underground stations in/near the belt (e.g., Mahalaxmi, Science Museum, Acharya Atre Chowk, Worli ⚠️ confirm list) → T. MMRC 50 m approval zone → `restriction` volume 🟡. Viaduct sections near Mahalaxmi/Jacob Circle → E ⚠️ | Aqua Line: 33.5 km, 26 of 27 stations underground (Wikipedia/MMRC-derived; Egis project page on tunnelling through basalt, tuff, shale); MCGM DP layers; MahaRERA project pages; Overture footprints | Exact tunnel chainage/depth and viaduct geometry not verified → depth simulated, route-level only |
| **MZ-2 Mumbai — BKC** (optional stretch) | Business district with deep-basement offices; Aqua Line BKC station (✅ exists; BKC–Worli section opened May 2025 per HT citation on the station page) | Same | Attempt only after the MZ-1 vertical slice works |
| **BZ-1 Bengaluru — MG Road / Shivajinagar / Cantonment CBD** (primary) | **Stacked infrastructure:** Pink Line underground (T/I) meeting the Purple Line at MG Road (E) ⚠️; old dense parcels with weak flat-level records (the khata gap, §B1.4); heritage and mixed-use blocks | BMRCL public alignment/station list; e-Aasthi/e-khata reporting | Pink underground section is under construction → present as **as-planned**, never as-built. UPOR/e-khata drone coverage of this exact zone not established ⚠️ |
| **BZ-2 Bengaluru — ORR Bellandur / Marathahalli** (secondary) | IT-corridor high-rises with podium parking/basements → B, L, U, P; Blue Line Phase 2A elevated over ORR (E, planned); lake-and-*raja kaluve* drain terrain → I/T conflict story | K-RERA project pages ⚠️; Overture footprints; public drain/lake reporting | Drain alignments illustrative unless a public source is found |
| **MZ-3 Mumbai — Bandra-Kurla Complex east / Kurla, on the Aqua Line's older, above-ground half** (NEW IN v6, third zone) | A deliberately *different* failure mode from MZ-1/MZ-2: mixed slum-redevelopment and commercial high-rise on reclaimed/low-lying ground, where the Aqua Line runs **elevated, not underground** (E-class, not T-class) — gives the project an above-ground Mumbai counterpart to MZ-1's tunnel story, plus SRA (Slum Rehabilitation Authority) redevelopment towers, a distinctive Indian vertical-property class (mixed free-sale + rehab-tenement units in one tower) not exercised by MZ-1/MZ-2 | MCGM OneMCGM GIS layers; MahaRERA project pages for SRA/free-sale mixed schemes; publicly reported elevated Aqua Line viaduct sections | SRA rehab-unit legal status (transfer restrictions) is state-policy-specific and largely unverified in this pass ⚠️ — treat unit-class mapping as illustrative until an SRA circular is sourced |
| **BZ-3 Bengaluru — Electronics City / Hosur Road corridor** (NEW IN v6, third zone) | A third, distinct Bengaluru failure mode from BZ-1/BZ-2: a purpose-built IT-park special-economic-zone belt with large single-owner commercial towers (fewer, larger U/C objects than a residential cluster) plus the under-construction **Yellow Line** (Bengaluru's first fully elevated metro corridor to open, RV Road–Bommasandra, largely elevated with some at-grade sections ⚠️ verify exact grade profile) crossing multiple industrial/IT parcels — exercises the E-class "elevated corridor over commercial, not residential, parcels" case that BZ-1/BZ-2 do not | BMRCL public Yellow Line alignment/station list; K-RERA/commercial-lease disclosures ⚠️ where available; Overture footprints | Yellow Line opening date and exact elevated/at-grade split reported inconsistently across secondary sources as of this pass — present as **as-planned** only, never as-built |
| **MZ-4 Mumbai — Marine Drive / Nariman Point / Fort / Churchgate belt** (NEW, this revision, fourth zone) | The **opposite failure mode to MZ-1**, deliberately: a **heritage-protected, height-restricted** Backbay-reclamation precinct (Art Deco Marine Drive frontage, Fort commercial core) where *surface* rules say low-rise/no-redevelopment, while the deepest, densest underground infrastructure in the pilot sits directly beneath it — the sharpest possible demonstration of R1 ("what is below this parcel that a 2D record cannot show"). Real anchors: Metro Line 3 (Aqua Line) underground stations **Cuffe Parade, Colaba, Churchgate, Hutatma Chowk, CST** (✅ fully underground, publicly listed station names) running directly under this belt → dense T-class tunnel/station-box objects under heritage-listed S/B parcels; the Mumbai Coastal Road's twin road tunnels between **Priyadarshini Park and Marine Drive/Girgaon Chowpatty**, under Malabar Hill and the sea (✅ ~2.07 km twin tunnels, 12.19 m diameter, publicly reported milestones) → a second, independent T-class corridor at a different depth and alignment than the metro, giving a genuine **T-over-T** (tunnel-under-tunnel) clearance case that no other zone has; the *proposed* Orange Gate–Marine Drive road tunnel (🟡 planned, not yet built — a 6.51 km twin-tube link surfacing near Marine Drive) as a **future-lineage** case: an RID area that will need a `SPANS`/clearance check against already-registered T objects before construction | MMRC public Metro Line 3 station list; BMC/Coastal Road public project milestones and tunnel-dimension figures; heritage-precinct listings (Mumbai's Art Deco/Victorian Gothic UNESCO precinct covers this belt ⚠️ confirm exact boundary) | Exact tunnel depths/chainage at each cross-point are not public at survey-grade → simulated, route-level real anchors only, same honesty rule as MZ-1 (§D0); heritage-listing boundary needs a primary (MCGM/UNESCO) source before any zone-boundary claim |

Each India zone carries **one hero scenario** from §G2. MZ-3, BZ-3 and MZ-4 are **stretch zones**, attempted only after the MZ-1/BZ-1 vertical slice (§R3) works end to end — they exist to demonstrate the grammar and pipeline generalise to different building-ownership patterns (SRA mixed-tenure, IT-park single-owner commercial), different infrastructure geometries (elevated-only, no underground) and, for MZ-4 specifically, a genuinely different *surface-vs-subsurface rights conflict* (heritage low-rise over stacked deep infrastructure, rather than TDR-driven towers over a single tunnel). Whitefield and other areas remain *scale-out candidates only*.

### B3.2a Bengaluru — full Namma Metro line coverage across the BZ zones (NEW, this revision)

The user-facing ask is "cover Purple, Green and Yellow, and underground facilities where possible." Rather than adding a fifth Bengaluru zone, the existing BZ-1/BZ-2/BZ-3 footprint is widened to explicitly carry **all three operational lines plus the two lines under construction/planned**, because Namma Metro's own geography already concentrates every line through those three zones:

| Line | Status | Character | Real underground stations/segments (✅ public BMRCL/press data) | Which BZ zone carries it |
|---|---|---|---|---|
| **Purple Line** (Line 1, Whitefield–Challaghatta) | ✅ Operational, 43.49 km, 37 stations | Elevated + at-grade + a ~4.8 km underground core | Underground core: **Cubbon Park, Dr B.R. Ambedkar Station/Vidhana Soudha, Sir M. Visvesvaraya Station–Central College, Nadaprabhu Kempegowda/Majestic, KSR Bengaluru City Railway Station** | BZ-1 (underground core + MG Road elevated approach) |
| **Green Line** (Line 2, Madavara–Silk Institute) | ✅ Operational, 33.46 km, 32 stations | Mostly elevated | **3 underground stations** in the southern city-centre stretch: **Majestic (interchange), Chickpet, Krishna Rajendra (KR) Market** (✅ per BMRCL/press) | BZ-1 (interchange at Majestic sits at the edge of the BZ-1 boundary; treated as an extension of the zone's underground cluster) |
| **Yellow Line** (Line 3, RV Road–Bommasandra) | ✅ Operational since 11 Aug 2025, 19.15 km, 16 stations | Reported as predominantly elevated ⚠️ confirm exact elevated/at-grade split per station before any underground claim on this line | No confirmed underground stations found in this pass — treat as **E-class only** unless a BMRCL source states otherwise | BZ-3 (Electronics City/Hosur Road corridor) |
| **Pink Line** (under construction) | 🟡 Under construction | Underground core (Dairy Circle–Nagawara via MG Road/Shivajinagar/Cantonment) | As-planned only (§B3.2 BZ-1 row; correction #2 in the v5→v5.1 changelog already fixed the earlier MG Road–Baiyappanahalli mis-attribution) | BZ-1 |
| **Blue Line Phase 2A** (planned) | 🟡 Planned | Elevated over the ORR | — | BZ-2 |

**Consequence for the demo 💡:** BZ-1 becomes the single richest underground cluster in the whole pilot — it now carries the Purple Line's underground core, its Majestic interchange with the Green Line's own 3 underground stations, and (as-planned) the Pink Line tunnel — giving a genuine multi-line, multi-depth underground stack (Purple tunnel, Green tunnel, Pink tunnel, all crossing near Majestic/MG Road at different depths and dates) for the ICT and topology-validation layers (§C6, §I) to exercise a **T-over-T-over-T** case, the Bengaluru counterpart to MZ-4's Mumbai metro-over-coastal-road case above. Every line/segment here still carries `data_provenance` and, where under construction, is presented as `as-planned` only (§B3.4, §D2).

---

### B3.3 Three-tier fidelity (what makes "we don't render a whole city" defensible)

| Tier | Contents | Geometry | Source | Purpose |
|---|---|---|---|---|
| **A — Hero blocks** | 3–5 towers per zone (≤ ~20 in total) | Full 3D: levels, units, commons, parking, basements, shafts; plan versions; injected defects | Real *counts* (floors, units, parking, wings) from public RERA pages where available ⚠️ + synthetic plans + simulated sensors | All H1–H4 evaluation, ICT scenarios, headline demo |
| **B — Context** | 30–100 surrounding buildings | LoD1 extrusions | Real footprints (Overture/OSM) + height priors (Open Buildings 2.5D ⚠️ confirm India coverage/licence) | Occlusion, adjacency, setback/overlap checks, realistic look |
| **C — Backdrop** | Rest of the zone | Footprints/parcels only | Real footprints | Map context |

Scalability (R24) is shown separately with **geometry-free synthetic registry load** (10⁶–10⁷ RIDs, §C9/M5), not by rendering — so modelling effort stays in Tier A.

### B3.4 Demo hygiene 💡
Real towers appear by locality with anonymised labels ("Tower MZ1-A") and only public counts. We never show a developer's real drawings and never imply that any real building is non-compliant; every defect is injected and labelled SYNTHETIC.

---

## PART D0 — DATA ACQUISITION STRATEGY: REAL vs SIMULATED (NEW IN v5)

This section answers the data question directly and is the one to open with in any judge Q&A on data.

### D0.1 The honest constraint
A student team building a hackathon prototype cannot fly a drone over Mumbai, cannot get raw NAKSHA ORI/LiDAR tiles (restricted, PPP-licensed, ⚠️), cannot obtain restricted as-built basement drawings, and — even if it could — the **DPDP Act, 2023** restricts using real personal ownership data without consent. Pretending otherwise would be dishonest and would collapse under a judge's first question. So the strategy is explicit, two-layered, and labelled everywhere in the running system (`data_provenance ∈ {REAL, PROXY, SYNTHETIC}` on every object) — this is the same honesty principle v4 already applies to `UNVERIFIABLE` (§D2), extended to the data layer itself.

### D0.2 Layer 1 — REAL data (used for realism, calibration, and demo grounding)

| PS input | Real Indian source used | City | License/access | Role in the system |
|---|---|---|---|---|
| GIS parcel layer | MCGM OneMCGM GIS layer descriptions/open portals; Karnataka UPOR/e-khata published extents; Overture Maps building footprints (derived in part from Google Open Buildings) as an open global fallback footprint layer | Mumbai, Bengaluru | Public disclosures / ODbL / CC-BY-4.0 | Real building **footprints and approximate counts** — anchors class-S/B geometry to real city shape, not a fictional grid |
| Building floor plans | MCGM AutoDCR system description (real workflow, real CAD scrutiny pipeline) used as the **template** for our plan-parser's expected input format (DXF/IFC-style layered CAD); RERA carpet-area disclosure format used as the template for unit-area fields | Mumbai | Public case study; format only, no restricted files obtained | Defines the **schema and validation rules** our synthetic plan generator must match, so synthetic plans are structurally realistic, not arbitrary |
| DEM/DSM | Open, low-resolution global/national elevation sources (e.g. published SRTM/Cartosat-derived DEM tiles, Bhuvan/NRSC where openly downloadable) as a **coarse real ground-reference layer** for the two pilot cities | Mumbai, Bengaluru | Public/open | Real coarse terrain to seed the local vertical datum (§D3); fine building-level DSM is simulated (see D0.3) because open LiDAR at that resolution is not publicly available |
| GNSS/CORS reference | Published SoI CORS station list and stated RTK accuracy class (~±3 cm) | National, incl. Maharashtra & Karnataka stations | Public statements | Real error-budget numbers feed the GNSS noise simulator (D0.3), instead of an invented accuracy figure |
| Elevated/underground corridor geometry | Publicly reported Namma Metro (Bengaluru) and Mumbai Metro Line 3 / Coastal Road alignments (general route, station locations) | Bengaluru, Mumbai | Public news/government disclosure, route-level only | Real **anchor geometry** for at least one E-class and one T-class object per city, so those classes are demonstrated on a real place name, with precise chainage/depth simulated (not claimed as survey-grade) |
| Parcel area tolerance policy | NAKSHA's published 5% parcel-area tolerance rule | National | Public | Directly reused as the seed value for §I3's parameterised tolerance, not invented |
| Zoning/plot reservation layer | MCGM Development Plan 2014–34 reservation categories (land-use zones) | Mumbai | Public (One MCGM GIS) | Real backdrop layer for demo maps, context for setback/height-cap checks |
| Building plans + structured counts (v5.1) | MahaRERA project pages (public): buildings/wings, approved floors, unit counts, parking counts, CC/OC status, sanctioned plans; K-RERA equivalent ⚠️ verify what is viewable/downloadable | Mumbai, Bengaluru | Public disclosure; check portal terms ⚠️ | Real *counts* parametrise Tier-A towers; a handful of real plan rasters/PDFs used only as H2 **test** inputs, never redistributed |
| Apartment legal-document schema (v5.1) | Declaration / Deed of Apartment fields under the Maharashtra and Karnataka Apartment Ownership Acts (description, apartment number, use, undivided percentage) | Both states | Statute text | Real schema for U/C/P + UDS fields (§E2) |
| Regulatory 3D buffer (v5.1) | MMRC 50 m approval zone around the Aqua Line 🟡 | Mumbai | Public notice (verify) | A real instance of a 2D buffer around subsurface infrastructure → modelled as a `restriction` volume |
| Legality of own geospatial capture (v5.1) | DST Geospatial Guidelines (15 Feb 2021): no prior approval/licence for Indian entities to collect, produce, publish geospatial data within thresholds; National Geospatial Policy (Dec 2022) | National | Public policy | Makes the optional own-capture micro-pilot (§D0.8) legally plausible — still subject to drone rules, airspace and thresholds ⚠️ |

### D0.3 Layer 2 — SIMULATED data (used where real ground truth is legally/practically unobtainable, and *only* there)

| Gap | Why it must be simulated | What is simulated | Ground truth it provides |
|---|---|---|---|
| Interior unit partitions, floor plans at fine detail | Restricted CAD (DXF) files are not obtainable in the hackathon timeframe; RERA-disclosed sanctioned plans exist publicly but only as a small, non-representative sample of raster/PDF plans | Parametric Indian-style apartment/commercial floor-plan generator (rooms, balconies, shafts, lift cores, staircases), calibrated to RERA carpet-area conventions, MCGM AutoDCR's schema and the *real counts* of §B3.3 | Exact known unit boundaries/volumes → H2/H3 training and evaluation labels (real RERA plans used only as a small real-world test set) |
| High-resolution point cloud / LiDAR | No open Indian LiDAR at building-detail resolution for these areas; flying our own drone is out of scope/legal for a hackathon | Ray-cast LiDAR simulator (flight-line geometry, range noise, scan-angle density falloff, occlusion by adjacent towers, glazing dropouts) over synthetic buildings placed on the **real footprints** from D0.2 | Exact known building envelope/roof height → H1 evaluation |
| Underground utility exact position/depth | No open national underground-utility dataset exists (confirmed absence, not an oversight) | Synthetic utility network (type, material, diameter, depth) with GPR-style noise, laid out under the real corridor anchor geometry from D0.2 | Exact known utility position/depth → R8/R30 conflict-detection evaluation |
| Ownership/rights records | DPDP Act, 2023 — real personal ownership data cannot be used without consent, and none is available to a student team regardless | Synthetic `Right` records with pseudonymised holders, structurally matching LADM RRR + India-profile fields | Known rights graph → overlap-semantics and rights-mapping evaluation without touching real personal data |
| Defect / dispute cases | Real disputed-property case files are not public in a form usable for training/evaluation | Injected defect taxonomy (§M3: overlap, gap, unauthorised structure, basement mismatch, etc.) on top of the otherwise-realistic synthetic buildings | Known defect ground truth → detection-vs-magnitude curves (§M4), which is impossible to get from real disputed cases (no independent truth exists for them) |
| Exact georegistration ground truth | Sub-cm real ground truth requires field survey equipment we do not have | GNSS/CORS error-model simulator, seeded with SoI's *published* accuracy class (D0.2), not an invented number | Known true position vs simulated observed position → D3/D4 evaluation |

### D0.4 The rule that ties D0.2 and D0.3 together
**Real data answers "does this look like Mumbai/Bengaluru and does the schema match what Indian systems actually produce?" Simulated data answers "does the algorithm work, measurably, against a known-correct answer?"** No claim in this project is made using simulated data as if it were survey-grade real data, and no realism claim is made without a named real source. Every object in the system carries `data_provenance` so a judge (or an examiner in the real system) can filter to "real-anchored only" at any time (§L). This directly extends v4's `UNVERIFIABLE` honesty principle (§D2) to the data-sourcing layer, and is, together with §B1.2's NAKSHA-scope finding, the strongest evidence that this is a serious, self-aware engineering project rather than a demo built on invented numbers.

---

### D0.5 Real-vs-simulated ledger v2 — per PS input, with the foreign real-data benchmark (NEW IN v5.1)

| PS input | Indian real | Foreign real benchmark (algorithms only) | Synthetic | What we may claim |
|---|---|---|---|---|
| Drone imagery | None open at building scale; own capture optional (§D0.8) | Rotterdam open aerial imagery ⚠️ verify | Renders over real Indian footprints | "Works on real imagery (Rotterdam / own capture) and on Indian-style synthetic" — never "on official Indian survey imagery" |
| LiDAR / point cloud | None open at building scale | Rotterdam AHN (✅ open national LiDAR used for national 3D models) | Ray-cast simulator | Same |
| GIS parcels | Overture/OSM footprints; OneMCGM layer descriptions; UPOR/e-khata published extents | SLA airspace parcels (✅ published, Singapore); Dutch cadastral parcels ⚠️ | Generated parcels + shift/overlap noise | Real footprints anchor geometry; real 3D-cadastre objects test the identifier layer (B-CS.7) |
| Floor plans | A few RERA-disclosed sanctioned plans (raster/PDF) | None open (Kadaster's pilot data is not public) | Parametric Indian plans | H2 tested on synthetic + a small real Indian sample; domain gap reported |
| GNSS / CORS | SoI CORS published accuracy class | — | Error-model simulator | Error budget from a real class, not invented |
| DEM / DSM | Coarse open DEM (Bhuvan/CartoDEM-class ⚠️) | Rotterdam AHN DSM/DTM | nDSM from simulated LiDAR | Fine-scale heights only from real-foreign or simulated data, labelled so |
| Utilities | None open (absence confirmed) | Not needed | Synthetic under real corridor anchors | Simulation only |
| Rights | None usable (DPDP Act) | Not needed | Synthetic, pseudonymised | Simulation only |

### D0.6 Access, legality and licence status (check before any real-data step)

| Item | Status | Note |
|---|---|---|
| DST Geospatial Guidelines, 15 Feb 2021 | ✅ | Self-certification; no prior approval/licence for Indian entities within thresholds; foreign-owned entities restricted (law-firm and Rajya Sabha reply summaries) |
| National Geospatial Policy, Dec 2022 | 🟡 | Framework document; includes a goal of a high-accuracy national DEM by 2030 (secondary summary) |
| Drone flights (any real capture) | ⚠️ | Verify DGCA Drone Rules, Digital Sky airspace zoning and any institutional permission; Mumbai has heavy airport-related restrictions — do not fly without clearance |
| DPDP Act 2023 | ✅ (as in v5) | Pseudonymise all rights holders; no personal data in IDs |
| Overture / OSM ODbL | ✅ | Share-alike on derived databases |
| AHN / BAG / 3D BAG licences | ⚠️ | Believed open; confirm exact licence text and attribution before use |
| RERA portal terms | ⚠️ | Use public counts; treat downloaded plans as test inputs, do not redistribute |

### D0.7 Sim-to-real protocol (so "synthetic" never becomes a weakness)
1. **H1 (building extraction):** train on synthetic Indian scenes (optionally plus Rotterdam real tiles); evaluate on three sets side by side — held-out synthetic-Indian, Rotterdam-real, own-capture-real (if done). The *gap* between them is a reported finding.
2. **H2 (floor segmentation):** pre-train on a public floor-plan dataset (e.g., CubiCasa5K, Finnish plans, ⚠️ licence) → fine-tune on synthetic Indian plans → test on the few real RERA plans. Expect a domain gap; report it.
3. **Identity, validation, reconciliation layers are geometry-agnostic:** their metrics (collisions, NK determinism, ICT accuracy, detection-vs-magnitude curves) do not need real sensor data (RQ5).
4. **Never blend provenance classes into one headline number.** Every table shows REAL-IN / REAL-FOREIGN / REAL-OWN / SYNTHETIC columns.

### D0.8 Optional real-capture micro-pilot (stretch; legal check first)
One accessible building (e.g., team's campus): phone-LiDAR/photogrammetry for façade and interior slab levels (E2/E3), laser distance meter for measured ground truth, and — only if permitted — a small drone for roof/footprint imagery (E1). Output: one **REAL-OWN** dataset with independently measured levels and areas, proving the pipeline runs on a real Indian building. Not required for the MVP (§R3); if skipped, say so plainly.

### D0.9 One-page answer: does this actually satisfy the PS's six named data inputs? (NEW, this revision)

The PS names six inputs verbatim (drone imagery, LiDAR/point cloud, GIS parcel layers, floor plans, GNSS/CORS, DEM/DSM, R14–R19). Judges will ask "you said 'integrate' — with what, exactly?" This table is the direct answer, one row per PS input, collapsing §D0.2/§D0.3/§D0.5 into a single readable claim:

| PS input | Is it "integrated" for real, or only in principle? | What actually runs in the prototype |
|---|---|---|
| **Drone imagery** (R14) | 🟡 Principle proven, not on Indian imagery | Ingestion pipeline built and tested on Rotterdam open aerial tiles (real) + rendered synthetic Indian-style imagery over real Mumbai/Bengaluru footprints; **UPOR's own drone-survey workflow** (Bengaluru) is used as the schema our ingestion adapter targets, so swapping in real UPOR drone tiles later is a config change, not a rewrite (§J4) |
| **LiDAR / 3D point cloud** (R15) | 🟡 Principle proven on real sensor noise, not on Indian point clouds | Same pipeline run on Rotterdam AHN (real, open, national LiDAR) for true sensor-noise behaviour, and on a ray-cast simulator over real Indian footprints for India-shaped buildings; the classifier/extractor code path is identical for both (§D0.7) |
| **GIS parcel layers** (R16) | ✅ Real, for footprints and counts | MCGM OneMCGM GIS layer descriptions, Karnataka UPOR/e-khata published extents, and Overture/OSM footprints anchor every S/B-class object to a real city shape, not a fabricated grid (§D0.2) |
| **Building floor plans** (R17) | 🟡 Real schema, synthetic content | MCGM AutoDCR's CAD schema and RERA's carpet-area disclosure format define the *structure* our plan generator must match; a small number of real RERA-disclosed plan rasters are used as held-out **test** inputs (never redistributed); interior partitions are otherwise generated because restricted CAD files are not obtainable in the timeframe (§D0.3) |
| **GNSS/CORS coordinates** (R18) | ✅ Real accuracy class, simulated points | Survey of India's published CORS station list and stated RTK accuracy class (~±3 cm) seed the georegistration error model — the *error budget* is real, individual GCP fixes are simulated because no field survey equipment is available (§D0.2, §D3) |
| **DEM/DSM** (R19) | 🟡 Real coarse, simulated fine | Open coarse elevation (Bhuvan/NRSC/SRTM-class) gives a real ground reference for both pilot cities; fine building-level nDSM is derived from the simulated LiDAR because open building-scale LiDAR does not exist publicly for India (§D0.2, §D0.3) |

**The one sentence that answers the whole question:** *every PS input has at least one real, named, Indian or foreign source behind it, and every gap that is filled by simulation is filled because the real version is either not public, not digitised, or restricted under the DPDP Act — never because it was easier* (§D0.1, §D0.4). The `data_provenance` tag on every object (§D0.1) is what lets an examiner or a judge check this claim live rather than take it on trust.

---

## PART B — INTERNATIONAL CASE STUDIES (INSPIRATION ONLY — READ AFTER B1/B2, NEVER BEFORE)

**Rule (restated from A3):** everything below is read for *pattern*, never copied as *design*. Each subsection ends with an explicit adopt/adapt/reject line.

### B-CS.1 Type-encoded registry numbers — Singapore lots 🌍
- ✅ SLA allocates lot numbers; **airspace lots start in the 70,000 series, subterranean lots in the 80,000 series; strata lots carry prefix "U"; accessory lots prefix "A"** (SLA lot-number page). Lot numbers identify the survey district.
- 🟡 (2011, dated) Khoo (FIG 2011): volumetric parcels' heights were recorded in raster survey plans, not in the GIS; ~200 volumetric parcels then — shows even mature systems keep Z outside the queryable cadastre.
- ✅ SLA publishes a cadastral **airspace** parcel layer (data.gov.sg), polygons to the nearest cm.
- **Adopt:** the *pattern* of class-typed, registry-allocated, opaque sequence numbers (not geometry-derived) for persistence.
- **Adapt:** we do not reuse Singapore's numeric series or prefixes; our CLS letters are chosen to map onto the PS's own object list (§C3), and the RID is anchored to the *existing Indian ULPIN14* of the birth parcel, which Singapore's system has no equivalent of.
- **Reject:** Singapore's Act-backed strata/volumetric title regime as a *legal* model. India's apartment ownership runs through state Apartment Ownership Acts and RERA (§B1.4) and has no statute for air-right or subsurface title, so we map U/C/P onto those Indian instruments and model A/T volumes as spatial objects only (§C10).

### B-CS.2 Persistent opaque IDs — Overture GERS 🌍
- ✅ Overture assigns GERS IDs to buildings so external data can attach unambiguously (Overture blog).
- **Adopt:** persistent opaque IDs surviving geometry change (P2).
- **Reject:** Overture is a global open-data consortium ID with no legal registry behind it; our RID is a **government-registry-issued** identifier bound to ULPIN, which is a different trust model entirely.

### B-CS.3 Digital plan pipelines — Victoria (Australia) and Singapore CORENET X 🌍
- 🟡 Victoria: mandatory ePlan phased 2024–2032, starting with plans without cross-sections; SCFF validation (24 checks per CSDILA page); 3D cadastral survey data model on a later horizon. **3D digital submission is not yet mandated even there** — this tells us India is not "behind," it is at the same frontier.
- ✅ Singapore CORENET X soft-launched 18 Dec 2023, IFC-SG BIM ≥ 5,000 m² GFA; survey plans/lot numbers remain on SLA RS-Portal separately (strata survey excluded from CSMS's initial implementation per OICRF).
- **Adopt (the real lesson, and our actual research contribution):** even in the most advanced systems, the *building* pipeline (BIM/plan) and the *cadastre* pipeline (survey) stay separate. §F's plan-vs-observed reconciliation layer, joining MCGM AutoDCR-style plans with survey/sensor evidence, is *our* contribution, applied to Indian institutions (MCGM/BBMP), not copied from Victoria or Singapore's own separate pipelines.
- **Reject:** Victoria's specific SCFF check list and Singapore's specific IFC-SG floor-area threshold — cited only as evidence that a mandate/threshold approach is workable, not imported as our numbers. Our thresholds come from NAKSHA's 5% precedent and are tuned on our own simulation (§I3).

### B-CS.4 LADM Edition II — the one international *standard* we do formally adopt, deliberately 🌍
- ✅ ISO 19152-2:2025 (Land registration) covers parties, administrative units/RRR, spatial units incl. **legal space of buildings and utility networks, above and below surface**, with a survey/representation sub-package. Part 1 (2024), Part 3 (2024) published. ⚠️ Parts 4–5 status not confirmed.
- ✅ LADM is **descriptive, not prescriptive** (ISO DIS text) — it is explicitly designed to be profiled per country.
- **Adopt, formally, as a data-model target for interoperability (R27):** LADM is an ISO standard, not a national system — profiling it for India is exactly what the standard invites, and doing so (an **India profile**, §K) is a legitimate research contribution, distinct from copying any single country's cadastre.
- **Adapt:** rights types, boundary conventions and legal_basis_status are populated from Indian sources (RERA, state Land Revenue Acts) — never from another country's RRR examples.

### B-CS.5 One-line reference table (for a judge slide)

| Foreign pattern | India already has an equivalent, or doesn't | Our decision |
|---|---|---|
| Class-typed registry IDs (Singapore) | No direct equivalent; ULPIN is geometry-derived | Adapt the *pattern* into RID, anchor to real ULPIN14 |
| Persistent opaque IDs (Overture GERS) | No direct equivalent | Adapt the *pattern*, issued by our registry not a global consortium |
| Mandatory 3D ePlan (Victoria) | Not mandated in India (or Victoria) yet | Not adopted as a mandate; used only as evidence the gap is real and current everywhere |
| BIM-linked permitting (Singapore CORENET X) | MCGM AutoDCR is CAD-based, not BIM-mandated | Reject BIM mandate; design plan-ingestion to accept CAD/DXF first (matches MCGM AutoDCR today), IFC/BIM as optional richer input |
| Strata regime (Singapore) | India: state Apartment Ownership Acts + RERA cover apartments; no volumetric air/subsurface title | Map U/C/P to the Indian instruments; reject Singapore's legal regime; A/T volumes stay `legal_basis_status`-tagged |
| LADM Part 2 (ISO) | India has no volumetric cadastre standard of its own yet | Adopt formally as the international standard to profile *for* India (not instead of Indian law) |

---

### B-CS.6 Rotterdam / the Netherlands — multi-level rights, plan-to-3D automation, open national LiDAR 🌍
- ✅ The Netherlands registered its first 3D multi-level property rights in March 2016 (Delft railway zone): the registration generated a *3D complex ID* and gave each right its own index (Stoter et al., ISPRS IJGI 2017). Rotterdam's *De Brug* building, sitting above other buildings and roads, is a textbook case of why 2D parcels fail (Stoter et al., 2013).
- ✅ Dutch practice expressed 3D rights by **subdividing 2D parcels into slivers** projected from the 3D objects, creating complex parcel patterns; the same research recommends keeping one parcel and pointing to 3D volumes instead. Comparing BIM with the 2D cadastral map also exposed errors in the 2D boundaries (IJGI 2017).
- ✅ Kadaster's 2022 "3D Apartments" pilot automatically converts apartment split drawings into 3D building models: vectorise lines/text, reconstruct and orient storeys, take storey heights from national 3D height statistics (Kadaster Labs). Kadaster also used a BIM model of Rotterdam's *De Rotterdam* to test 3D deed drawings for leasehold and surface rights on different units (NCG 3D Pilot report).
- ✅ Open national data underneath: national 3D building models are built from the BAG building register (positional accuracy ≈ 30 cm) plus AHN LiDAR (TU Delft arXiv 2022; Kadaster 3D Basisvoorziening).
- **Adopt (pattern):** (a) deed/plan drawings → 3D model automation validates our §F pipeline; (b) **do not sliver parcels** — our class-S column with carved-out A/T/E volumes keeps the parcel intact; (c) BIM-vs-2D comparison as a discrepancy detector = our reconciliation engine (§I4).
- **Adapt:** the Dutch "split drawing" corresponds in India to the Declaration + floor plans under the Apartment Ownership Acts and the sanctioned plans on RERA pages (§B1.4); our parser targets those, not Dutch drawing conventions.
- **Third area, NEW IN v6 — the *rollout and governance model*, not just the technical model:** the Netherlands' 3D registration is run by **one national cadastral agency (Kadaster)** issuing a single national 3D building layer, funded and updated as core government infrastructure rather than project-by-project (§B-CS.6 sources above). We read this as evidence for *why a national grammar + national conformance suite* (our RID grammar, §C3; our conformance suite, §C9) is the right centrally-owned artefact — but **reject** the single-agency-holds-everything structure itself for India, because Indian land records are constitutionally a State subject (§B1.4). The transferable lesson is narrower and more specific than "copy Kadaster": *centralise the standard, federate the registry* — which is exactly the split formalised in our own §C12/§C13, not a Dutch import.

### B-CS.6a Rotterdam — reading a second reference in one pass (context for the above)
Wilhelminapier/Kop van Zuid (the benchmark zone used for real LiDAR/footprint testing, §B-CS.6 main text) and *De Rotterdam*/Erasmus Bridge (the BIM-vs-deed-drawing pilot case, NCG 3D Pilot report) are two different Rotterdam sites serving two different roles in this dossier: the former is a **data benchmark** (real sensor noise for H1/D4, §D0.5), the latter is a **methodology precedent** (BIM-to-deed reconciliation, §I4). Keeping them distinct avoids overstating either as "the Rotterdam pilot" — they are two separate, narrower pieces of evidence.
- **Reject:** Dutch legal structures (Civil-Code apartment right, deed formalities) and the assumption of complete national BAG/AHN coverage — India has neither.
- **Use in the project (data):** a **Rotterdam benchmark zone** around the Wilhelminapier/Kop van Zuid high-rise cluster (⚠️ confirm tile availability and licence) supplies *real airborne LiDAR and real footprints* to test H1 and D4 on real sensor noise — something no open Indian dataset offers (§D0.5). It validates **algorithms**, never Indian identities, law or thresholds.

### B-CS.7 Singapore — class-typed lots, published airspace parcels, and the two-pipeline lesson (deepens B-CS.1/B-CS.3) 🌍
- Already established (✅ B-CS.1/B-CS.3): SLA airspace (70,000-series) and subterranean (80,000-series) lots, strata "U" and accessory "A" prefixes; a published cadastral-airspace parcel layer on data.gov.sg; CORENET X (BIM) and SLA survey pipelines kept separate.
- **New use in the project:** the SLA airspace dataset is a *real, machine-readable set of 3D-cadastre objects*. We use it as a **conformance stress-test of the identifier layer**: can the 3D-ULPIN grammar, NK canonicalisation and ICT ingest every real airspace parcel with zero RID collisions, deterministic digests and correct parent/SPANS relations? ⚠️ Inspect the dataset's fields (height information? licence?) before promising any vertical test.
- **Transferability limits (state them):** Singapore is a small, centrally administered city-state with an Act-backed strata/volumetric regime; India's land records are state-level (§B1.4). Its numbers, prefixes and thresholds are not imported.
- **Third area, NEW IN v6 — the *statutory instrument*, read as a legal-design reference only, never a legal import:** Singapore's Planning Act and Land Titles (Strata) Act give airspace and subterranean lots (classes 70,000/80,000-series) an actual transferable legal title, not just a spatial record (§B-CS.1). We read this only to sharpen the honesty boundary already built into §C10/§C13.3: it shows precisely *what a jurisdiction needs to add* (a dedicated air-right/subsurface-title statute, or an extension of a state Apartment Ownership Act) before our classes A and T could move from `legal_basis_status = ASSUMED` to `VERIFIED` in India. **We do not adopt or paraphrase Singapore's statutory text**; it is cited here purely as a worked example of "this is what the missing Indian law would need to specify" — the same adopt/adapt/reject discipline as every other Singapore pattern in this dossier (§B-CS.5).

### B-CS.8 Four-city role matrix (one slide for the judges)

| City | Role | What it gives | Must NOT be used for |
|---|---|---|---|
| **Mumbai** (MZ-1 primary; MZ-2, MZ-3, MZ-4 stretch) | India hero | Vertical density, deep subsurface transit, TDR/FSI air-right story, MahaRERA counts, MCGM layers, plus (MZ-3) an elevated-corridor + SRA mixed-tenure counterpart and (MZ-4) a heritage-low-rise-over-stacked-tunnels counterpart (Metro Line 3 + Coastal Road twin tunnels under Marine Drive/Malabar Hill) | — |
| **Bengaluru** (BZ-1 primary, now carrying Purple + Green + Pink underground segments; BZ-2, BZ-3 stretch) | India hero | Stacked metro (multi-line underground stack at Majestic/MG Road, §B3.2a), drain/utility conflicts, flat-khata gap, KAOA, e-khata/e-PID, plus (BZ-3) a commercial/IT-park elevated-corridor (Yellow Line) counterpart | — |
| **Rotterdam** | Foreign real-sensor benchmark + multi-level-rights precedent | Real LiDAR/footprints for H1/D4; plan→3D automation and "don't sliver parcels" precedents | Identity grammar, legal model, thresholds |
| **Singapore** | Foreign real-3D-cadastre-object benchmark + class-typed lot precedent | Real airspace parcels for identifier conformance | Prefix scheme, strata legal regime |

India is the product. The two foreign cities are **evidence and test data**, and the adopt/adapt/reject discipline of §B-CS.5 applies to both.

---

## PART C — THE 3D ULPIN (PRIMARY DELIVERABLE AND PRIMARY FOCUS OF THE PROJECT)

### C0. Quick-answer index — everything asked about the 3D ULPIN, in one place (NEW IN v6)

This section exists because the project's own priority is the 3D ULPIN, not the fusion pipeline around it. Each answer below is a compressed pointer into the fuller technical treatment later in Part C (and, for law and rollout, into new §C13); nothing here is a new claim that isn't already sourced or flagged elsewhere in the dossier.

**Q1. How is a 3D ULPIN actually generated, end to end?**
Six steps, all detailed in §C2–§C4 and §F:
1. Start from the object's **birth parcel** — its existing 14-char ULPIN (or a flagged `PROXY-ULPIN` if the parcel has none yet, §C11).
2. Fix the object's **class** (surface/building/level/unit/common/accessory/airspace/subterranean/elevated/utility — the exact PS object list, §C3 `CLS`).
3. Build its **canonical 3D geometry** from the evidence pipeline (plan → expected model, sensors → observed model, reconciled in §F) and snap it to a declared precision.
4. Compute a **content digest (NK)** of that canonical geometry plus a **locator** (its interior point) — this is the ULPIN-style, geometry-derived, independently re-computable part (§C4).
5. **Allocate a Registry ID (RID)**: `ULPIN14-B{building-seq}-{CLASS}{sequence}-{check symbol}` (§C3) — an opaque, registry-issued, never-reused string, the actual "3D ULPIN".
6. Write a **binding record** linking RID ⇄ NK(version) ⇄ evidence ⇄ plan version ⇄ sign-off, so the ID, the geometry that earned it, and the proof are permanently tied together (§C2).
The RID is what gets printed, searched and quoted; the NK and the binding record are what make that RID *verifiable* rather than just a label.

**Q2. How is uniqueness actually guaranteed — what stops two objects from colliding, or one object from getting two IDs?**
Four independent mechanisms, each already specified in Part C, working together (not one silver bullet):
- **Structural uniqueness:** the RID is built from an already-unique ULPIN14 plus a registry-allocated sequence per building/class, so no two allocations under the same parent+class can collide by construction (§C3), and this is load-tested to 10⁶–10⁷ allocations with zero duplicates (§C9).
- **Content uniqueness:** the NK digest is a SHA-256 hash of the *canonicalised* geometry (fixed vertex order, fixed precision, fixed serialisation) — two people computing it from the same geometry on different machines get an identical digest, so tampering or duplication is detectable (§C4).
- **Error-detecting uniqueness:** a single ISO 7064 MOD 37,36 check symbol catches every single-character typo and every adjacent-character swap when the ID is copied or typed (§C3, §C9).
- **Temporal/lifecycle uniqueness:** an RID is *never reused* even after demolition (it is tombstoned, not deleted); when geometry changes, the **Identity Continuity Test** decides whether it's the *same* object with a new version (same RID, new NK) or a genuinely new/split/merged object (new RID) — so "unique" also means "unique across time", not just at one instant (§C6).
Uniqueness is therefore a property of the *system* (grammar + registry + hash + lifecycle rule), not of any single clever numbering trick.

**Q3. What existing Indian law does this sit on — is any of it actually legal today?**
Layered honestly, because this is the question judges from government will ask first (§B1.4, §C10, §C13):
- **Surface parcel identity:** ULPIN/DILRMP already has statutory-programme backing (Ministry of Rural Development / DoLR), ECCMA + OGC compliant (§B1.1). We extend it; we do not touch it.
- **Apartment/unit ownership (classes U/C/P):** already a real, registrable legal form via **state Apartment Ownership Acts** — Maharashtra Apartment Ownership Act, 1970 and Karnataka Apartment Ownership Act, 1972 — each requiring a registered Declaration (Karnataka's also requires floor-plan copies) that states each unit's undivided share of common areas (§B1.4). This is the real legal anchor for the U/C/P classes, not a foreign import.
- **Disclosure/geometry convention:** RERA (2016) mandates disclosure of sanctioned floor plans and defines carpet area — the closest thing India has to a statutory unit-boundary convention (§B1.4, ⚠️ state-rule variation still to verify).
- **Data legality:** the DST Geospatial Guidelines (2021) and National Geospatial Policy (2022) make Indian-entity geospatial capture and publishing self-certified rather than pre-approval-gated (§D0.6); the DPDP Act, 2023 governs how ownership/personal data inside rights records must be handled (pseudonymisation, §E2).
- **What is *not* yet law:** India has **no statute defining "air-right" or "subsurface/volumetric title" as a transferable legal interest** the way Singapore's Planning Act does (§B1.4, §C10). This is why every `Right` record carries a `legal_basis_status ∈ {VERIFIED, ASSUMED, STATE-SPECIFIC}` field (§C10) — the system models the *spatial object* for every PS class, including air-rights, but never claims a legal effect Indian law does not currently grant. That field is also the honest answer to "can this be enforced in court today": for classes A and T, not yet, without a state or central statute; for classes U/C/P, yes, through the existing apartment-ownership Acts.

**Q4. Can we just add a dimension (a "Z") to the existing 2D ULPIN, instead of a whole new scheme?**
Not by itself, and §C1 explains exactly why, but the RID grammar is designed as an **additive extension** of ULPIN14, not a replacement — this is requirement P3, "backward-compatible with ULPIN; parent ULPIN unchanged" (§C1, §C3):
- The existing 14-digit ULPIN is **geometry-derived from a 2D surface footprint** and is designed to **change when the parcel's coordinates change** (subdivision, remerger) — appropriate for a surface plot, but wrong as the *sole* identity of a flat or basement lot that must persist through internal remodelling with the surface parcel untouched (§B1.1 "Consequence for design").
- So a bare "ULPIN + height" tag would either (a) force a new ULPIN every time an internal wall moves, breaking persistence (P2), or (b) leave the vertical object with no independently verifiable geometry key at all.
- The actual answer: **keep ULPIN14 exactly as-is as the anchor**, and append a structured suffix — `-B{building}-{CLASS}{sequence}-{check}` — that carries the class, the building context and an opaque, persistent sequence, while a *separate* NK layer (§C4) carries the actual 3D geometry digest that can change without touching either the ULPIN or the RID. In other words: the "third dimension" is not one extra digit bolted onto the 2D number, it is a second identity layer (NK) plus a class-typed registry suffix (RID), deliberately kept apart from the digest so the ID stays stable while the geometry underneath can legitimately move (§C2's "key tension" discussion).

**Q5. What is the most optimal way for the government to actually roll this out in India, and who do you talk to in a state?**
Full state-by-state roadmap, phasing and named contact points are in the new **§C13**. The one-line summary: **grammar and conformance suite are issued centrally (DoLR-style), allocation and storage are federated to state Revenue Department / Directorate of Land Records nodes** (mirroring exactly how DoLR + state NIC units + state Revenue Secretaries jointly launched ULPIN state-by-state, §C13.1), because land records are a State subject constitutionally (§C12) — the same federated pattern that let ULPIN itself reach 29 states/UTs without one national database overriding state law. Other countries' rollout patterns (Netherlands' single national Kadaster; Singapore's single-agency SLA) are read only for the pattern of *phasing and mandate-setting*, never copied as a structure, because neither of those countries has India's state-subject constitutional split (§C13.2).

**Q6. Why this specific architecture (three-layer RID/NK/SA + federated registry), and not something simpler?**
Because every simpler alternative fails one of the two things a cadastral ID must do at once (§C1 "key tension"): an ID derived purely from geometry (ULPIN's own current logic) is verifiable but dies on every re-survey, which is fatal for a unit that gets remodelled without changing ownership; an ID that is purely a registry sequence (a database primary key) is stable but nobody outside the registry can check it against the real world. The three-layer model (RID persistent and opaque, NK geometry-derived and re-computable, SA derived for search) is the minimum structure that gives **both** properties at once, and it is why the design borrows the *pattern* of class-typed opaque IDs from Singapore's lot-number series and Overture's GERS (persistence) while keeping ULPIN's own geometry-derived philosophy for verifiability (§B-CS.1, §B-CS.2) — an explicit adopt/adapt decision, not an accidental resemblance to either.

---

### C1. Identifier requirements (formal)

| ID | Property | Why (source of the need) |
|---|---|---|
| P1 | Global uniqueness, never reused | ULPIN goal; tombstones |
| P2 | Persistence across remodel/re-survey | Units outlive geometry versions |
| P3 | **Backward-compatible with ULPIN**; parent ULPIN unchanged | R2, A3 |
| P4 | Class-awareness (surface, building, level, unit, accessory, common, airspace, subterranean, elevated, utility) | R3–R8; Singapore lot series (adapted, §B-CS.1) |
| P5 | **Independent verifiability**: anyone with the geometry can re-derive a digest and check it against the registry | ULPIN's geometry-derived philosophy |
| P6 | Lineage: split/merge/supersede/demolish recorded | ULPIN changes ID on mutation |
| P7 | Spatial addressability (volume → cell cover) | R24 scalability |
| P8 | Fixed length, error-detecting, transcribable | ULPIN is fixed 14-char |
| P9 | Privacy-tiered (no owner data inside ID) | DPDP Act, 2023; governance |
| P10 | Interoperable with LADM, IFC GlobalId, CityGML gml:id, OGC APIs | R27 |
| P11 | Deterministic, testable, conformance-suite-able | R25 "standardized" |

**Key tension 💡:** P5 (geometry-derived) vs P2/P6 (persistent through change). Geometry-only IDs die on every re-survey; registry-only IDs can't be independently verified. **Resolution: a three-layer identity with a binding record.**

### C2. Three-layer identity model

```text
┌───────────────────────────────────────────────────────────────────────┐
│ LAYER 1  REGISTRY ID (RID)   persistent, opaque, class-typed, checked  │  ← the "3D ULPIN" string
├───────────────────────────────────────────────────────────────────────┤
│ LAYER 2  NATURAL KEY (NK)    deterministic function of canonical       │
│          geometry @ version: locator (interior point) + digest         │  ← verifiability (ULPIN-style)
├───────────────────────────────────────────────────────────────────────┤
│ LAYER 3  SPATIAL ADDRESS (SA) multi-resolution 3D grid cell cover      │  ← search / tiling / joins
└───────────────────────────────────────────────────────────────────────┘
            bound by  ►  BINDING RECORD (hash-chained version log)
      RID ⇄ NK(v) ⇄ SA(v) ⇄ evidence set ⇄ plan version ⇄ sign-off ⇄ parent lineage
```

- **RID** never changes for the object's life.
- **NK** changes whenever canonical geometry changes; stored per version. Two parties can recompute NK from the geometry and compare with the registry (tamper evidence, replication check).
- **SA** is derived and can be recomputed; not an identity.
- **Binding record** is append-only and hash-chained (each version stores the hash of the previous) 💡.

### C3. RID grammar (illustrative — not an official format)

```text
3D-ULPIN  :=  ULPIN14 "-" BLD "-" CLS SEQ "-" CHK

ULPIN14   :=  the existing 14-char ULPIN of the *birth parcel* (unchanged) — real for pilot parcels where an ULPIN exists, PROXY otherwise (§D0)
BLD       :=  "B" B32{4}            building sequence within ULPIN scope; "B0000" = no building (surface / airspace / subterranean / corridor volumes)
CLS       :=  one of:
                S  surface parcel column            L  level / storey volume
                B* building envelope (uses SEQ, CLS="B")
                U  unit (apartment / commercial)    C  common area (general / limited)
                P  accessory (parking, storage)     A  airspace lot (air-right volume)
                T  subterranean lot / tunnel        E  elevated corridor (viaduct, metro, skywalk)
                I  utility-network segment
SEQ       :=  B32{5}                registry-allocated sequence (Crockford base-32; no I L O U)
CHK       :=  1 check symbol, ISO 7064 MOD 37,36 over the concatenated payload
```
Fixed length. Compact form (no hyphens) is canonical for storage; hyphenated for display. Example (synthetic placeholder): `SYNTHETIC0001A-B0004-U0A3F1-7`.

Rationale, each traced to research:
- Class letters mirror the PS's own object list, and echo (not copy) Singapore's type-separated series (§B-CS.1).
- Sequences are opaque (P2) and sequentially allocated by the registry — like SLA lot numbers and GERS IDs, adapted.
- Human labels ("Flat 1703", "Level 17", "B2") are *attributes*, not part of the ID, because remodelling or renumbering would break persistence. A lookup provides them.
- Check symbol catches all single-character and adjacent-transposition errors (property of ISO 7064 MOD 37,36 — ⚠️ confirm with reference test vectors in implementation).

### C4. Natural Key (NK) generation algorithm

```text
canonicalise(V, profile):
  1  V := closed, orientable 2-manifold polyhedron (planar faces; MVP)
  2  Transform to profile CRS: geographic (lat, lon) per ULPIN convention + ellipsoidal height h;
     also store local-level coordinate z_local and datum_id
  3  Snap vertices to declared precision p_xy, p_z (defaults 🎯 1 cm / 1 cm); record p in metadata
  4  Merge coplanar adjacent faces; drop collinear vertices; outward normals (right-hand rule)
  5  Total order: start each ring at lexicographically smallest (lat, lon, h); order faces by (unit normal, plane offset, first vertex)
  6  Serialise to canonical bytes  ◄ same input ⇒ same bytes on any machine

NK.digest  = base32( H( bytes ‖ CLS ‖ datum_id ‖ p_xy ‖ p_z ) )  , H = SHA-256 (truncate to 128 bits for display)
NK.locator = quantise( interior_point(V) )  → (lat 1e-7°, lon 1e-7°, h 0.01 m) → 3D Morton interleave
interior_point(V) = deterministic centre of largest inscribed sphere (voxel distance-transform, fixed tie-break)
```
- **NK.locator** is the ULPIN-style geometry-derived part (interior point).
- **NK.digest** is a content hash, deliberately brittle: any canonical change ⇒ new digest. Used for **integrity/verification**, not for deciding sameness.
- Sameness under noise is decided by the **Identity Continuity Test** (C6), never by digest equality.

### C5. Scope rules for hard cases 💡
1. **Volume spanning several parcels** (elevated corridor, tunnel, amalgamated building — real examples: Namma Metro viaduct, Mumbai Metro Line 3 tunnel, §B2): RID is anchored to the parcel containing the interior point (*anchor ULPIN*); a `SPANS` relation lists every intersected parcel/ULPIN.
2. **Surface parcel column (class S):** the ULPIN parcel extruded between a policy-defined subterranean limit and airspace ceiling relative to a local ground reference; A/T lots are carved out of it (echoes, not copies, SLA's airspace/subterranean carve-out pattern).
3. **Parcel mutation:** since ULPIN changes when a parcel is subdivided, the RID keeps the *birth ULPIN* and the registry stores `parcel_lineage(birth_ULPIN → current_ULPIN)`; resolution returns current parcel. ⚠️ Confirm exact ULPIN mutation semantics in official docs.
4. **Unit across levels (duplex/mezzanine):** one U-RID with N level-parts.
5. **Voids / shafts / atria:** first-class `VOID` sub-objects inside the parent volume (needed for the volume-conservation rule, §I).
6. **Boundary convention:** unit volume boundary configurable — inner wall face / wall centre / outer face — recorded per object; ⚠️ legal convention (carpet-area definitions under state RERA rules, §B1.4) must be checked per state before any legal claim.

### C6. Lifecycle & the Identity Continuity Test (ICT)

State machine per RID: `ALLOCATED → ACTIVE ⇄ REVISED (new NK, same RID) → SUPERSEDED | MERGED | SPLIT | DEMOLISHED (tombstone) | DISPUTED (flag)`.
Rules: an RID is **never reused**; supersede/split/merge create lineage edges; demolition leaves a tombstone.

When a new geometry `G'` arrives for RID `R` (re-survey, remodel, as-built):
```text
score = w1·IoU3D(G, G') + w2·(1 − shift/σ_c-normalised) + w3·[same class] + w4·[same parent RID] + w5·plan-link agreement
IoU3D ≥ τ_hi and same class/parent    → CONTINUE   (same RID, new NK, new version)
IoU3D in [τ_lo, τ_hi)                 → AMBIGUOUS  → examiner (evidence attached)
G' covers ≥2 old objects / 1 covers ≥2 → MERGE / SPLIT (new RIDs, lineage edges)
no old object overlaps                → NEW
```
All thresholds are parameters (🎯 τ_hi=0.90, τ_lo=0.60 initial; tuned on simulation; not sourced). This is a research contribution — literature check pending (search "3D cadastre object identity/persistent identifier lifecycle" before claiming novelty).

### C7. Spatial Address (SA)
- Multi-resolution 3D grid over a local metric frame: cell edge at level ℓ = S₀ / 2^ℓ; key = Morton (Z-order) interleave of (x, y, z) cell indices.
- Volume → **cell cover** stored in a GiST/BRIN-friendly table for range queries ("what lies at this point/box", "what is directly below this parcel").
- ⚠️ GeoSOT-3D is a candidate global grid; not re-verified this pass. Fallback (per A3.4, Indian precedent takes priority, foreign standard only as fallback): our own octree/Morton grid.
- SA is derived → can be re-generated when the grid is revised.

### C8. Registry & services (verify / resolve / explain)

| Endpoint (illustrative) | Function |
|---|---|
| `POST /allocate` | Allocate RID under an authorised session; runs ICT; writes binding record |
| `GET /resolve/{rid}` | Class, parent chain, current NK, current parcel, status |
| `POST /verify` | Body: RID + candidate geometry → recompute NK, compare digest, run ICT similarity; returns MATCH / DRIFT / NOT-SAME with uncertainty |
| `GET /lineage/{rid}` | Full hash-chained history |
| `GET /cover?bbox=…` | SA-based spatial query returning RIDs |
| `GET /explain/{finding}` | Evidence, tolerance, confidence, rule, override history |
| `GET /validate/{rid}` | Runs tier stack (§I), returns PASS/WARN/FAIL/UNVERIFIABLE |

Implementation: FastAPI + Embedded SQLite with Python in-memory 3D computational geometry engine (`trimesh` / `shapely` / `rtree`); OGC API – Features/3D GeoVolumes-style read endpoints.

### C9. Conformance & tests ("standardized", R25)
- **Grammar spec** + **test vectors** (valid/invalid RIDs, check-symbol errors).
- **NK determinism tests**: shuffled vertex order, rotated ring start, different machines ⇒ same digest.
- **Collision tests**: 10⁶–10⁷ synthetic allocations ⇒ zero RID duplicates; digest collision check.
- **Error-detection tests**: inject all single-char substitutions and adjacent transpositions ⇒ 🎯 100% detected.
- **ICT tests**: scripted remodel/split/merge scenarios with known expected outcomes.
- **Round-trip tests**: RID ↔ LADM ↔ IFC ↔ CityGML export/import with id preservation.

### C10. What the 3D ULPIN is *not* 💡
It is a **standardised spatial identity and evidence-binding for vertical and subsurface property objects**, resolvable and verifiable, linked to existing ULPIN/UDS/registration data. Whether a given volume carries a *legal title* depends on state law (⚠️ unresearched, and per §B1.4, largely not yet defined for 3D in India); the system records rights as *linked records* with a `legal_basis_status` field (VERIFIED / ASSUMED / STATE-SPECIFIC). This satisfies "map ownership rights" (R26) without asserting unsupported legal effect — the single clearest expression of the A3 doctrine.

---

### C11. Legacy identifier crosswalk — how 3D ULPIN meets what Indian records actually use 🇮🇳 (NEW IN v5.1)
Indian urban property is identified today by several local identifiers; a 3D ULPIN that ignores them will not be adoptable. The registry keeps a `legacy_ids` table linked to the S-class RID (inherited by B/L/U/C/P):

| Legacy identifier | Where used | Handling |
|---|---|---|
| CTS / City Survey No. + Property Card (Mumbai) | Mumbai city-survey records ⚠️ verify current record system | `legacy_ids[CTS]`; many-to-one / one-to-many with parcels |
| PID / e-PID, khata (Bengaluru e-Aasthi) ✅ | e-khata; plan approval asks for it 🟡 | `legacy_ids[PID]`; many flats have no flat-level khata (§B1.4), so a **U-class RID can carry the flat-level identity the khata lacks** |
| UPOR Property Register (PR) card (Karnataka) ✅ | UPOR towns/pilots | `legacy_ids[UPOR]` |
| Survey / hissa no., village, ward | Older and rural-edge records | `legacy_ids[SURVEY]` |
| RERA project / wing registration no. ✅ | MahaRERA / K-RERA | `legacy_ids[RERA]` on B/U classes |
| ULPIN (14-char) ✅ | DoLR / NAKSHA / Land Stack | Parent anchor. If none exists for an urban parcel, allocate a **PROXY-ULPIN** (same format, `data_provenance = PROXY`) |

Rule: legacy identifiers are *attributes with lineage*, never part of the RID string (P2).

### C12. Federated registry model — because land is a State subject 🇮🇳 (NEW IN v5.1)
- The **grammar and conformance suite are national artefacts** (issued centrally, DoLR-style). **Allocation and registry storage are state-level nodes** (Maharashtra node, Karnataka node), each with an `issuer_node_id` in the binding record.
- **Resolution is federated:** `/resolve` routes to the issuing node; `/verify` needs only the RID plus geometry, so any agency can verify without holding another state's data.
- Hash-chained logs are per node; chain heads can be periodically cross-anchored 💡. Cross-state objects (a corridor, a national utility) use the same grammar.
- Demo: two nodes (MH, KA) running the same code and grammar with different legal-profile configuration (`legal_basis_status` rules per state, §G2) — this is the concrete evidence for R24 "interoperable".
- ⚠️ Confirm whether ULPIN14 already encodes state/district; if so the node id is derivable, otherwise it is stored explicitly.

---

### C13. Government adoption roadmap — how India should actually roll this out, state by state (NEW IN v6)

This section answers Q5 from §C0 in full. It is written the same way the rest of this dossier treats law and policy: what is a sourced fact about how ULPIN itself was actually rolled out (✅/🟡), versus what is our own phasing recommendation (💡).

**C13.1 The precedent we build on, not invent 🇮🇳**
ULPIN was never launched as one national switch-flip. It was rolled out **state by state**, each launch a joint act of (a) the central nodal agency, (b) the state's own revenue administration, and (c) NIC as the technical delivery arm — for example Chhattisgarh's ULPIN launch (23 June 2021) was announced jointly by the **Secretary, DoLR (Government of India)**, the **state Secretary, Revenue & Disaster Management**, and **NIC's state unit**, with the state's own **Director, Land Records** present (✅ DoLR/NIC event record). By the time of the most recent public status listing, ULPIN had reached **29 states/UTs**, with a further set (Puducherry, Telangana, Manipur, Andaman & Nicobar) at pilot stage (✅ DoLR "Bhu-Aadhaar" page). **This is the exact pattern §C12's federated registry model is built to continue** for the 3D extension: central grammar, state-level launch and allocation.

**C13.2 Who to actually approach, per level of government 💡 (mapped onto the real DILRMP chain, §C13.1)**

| Level | Body | Role for a 3D ULPIN rollout |
|---|---|---|
| National / nodal | **Department of Land Resources (DoLR), Ministry of Rural Development**, with **NIC** as technical delivery partner | Owns and publishes the grammar extension (the RID suffix, §C3) as a national technical standard, exactly as it owns the current ULPIN formula; runs the conformance suite (§C9) as a certification gate before any state node goes live |
| State — land records | **State Revenue Department** + **Directorate/Commissioner of Land Records** (the same office that already runs DILRMP/NAKSHA in-state, §B1.2) | The actual **issuing authority and registry-node operator** for that state (§C12) — this is the office a pilot team or a state government partner should contact first, not a municipal body, because land records are a State List subject |
| State — urban/building side | **Urban Development Department**, working through the city body that already runs plan approval — **MCGM** (AutoDCR) in Maharashtra, **BBMP/GBA** (OBPS/e-Aasthi) in Karnataka (§B1.3) | Supplies the building-plan pipeline (classes B/L/U/C/P) that the state land-records office does not itself hold; needs a data-sharing MoU with the Revenue Department node, mirroring the Land Stack's own stated integration of land + building data (§B1.2) |
| National platform | **Land Stack** (launched 31 Dec 2025, Chandigarh + Tamil Nadu) | The natural home for the 3D-extended registry to plug into once piloted, since it already integrates land, ownership, registration and building data (§B1.2) — the 3D ULPIN's `/resolve`/`/verify` endpoints (§C8) are designed to sit behind exactly this kind of platform, not replace it |
| Survey/geodesy | **Survey of India (SoI)**, for CORS/GNSS control (§D3); **state survey departments** (e.g. Karnataka's KSRSAC) for local survey capacity | Supplies the georegistration backbone the 3D ULPIN's NK layer depends on (§C4, §D3) |

**C13.3 Recommended phasing 💡 (a scoping recommendation, not a claim about any government decision)**
1. **Standard-setting phase (central):** DoLR publishes the RID grammar as an *additive* extension (§C3, §Q4 in C0) alongside the existing ULPIN technical note, exactly as it already publishes the ULPIN formula — no state action needed yet, because P3 guarantees the base ULPIN is untouched.
2. **Two-state pilot (state-level, this project's own scope):** two Revenue Department/Land Records nodes (Maharashtra, Karnataka) run the same grammar and conformance suite on named micro-zones (§B2, §B3) — this is precisely the "two nodes, same code, different legal-profile config" demonstration already specified in §C12, and mirrors how DILRMP itself was first piloted in a handful of states (Madhya Pradesh, Andhra Pradesh, Odisha, Assam, Bihar, Maharashtra, Rajasthan, Gujarat, 1988–89) before national extension (✅ Maharashtra DILRMP appraisal report, LBSNAA).
3. **Conformance certification gate:** before a third state node is allowed to allocate RIDs, it must pass the same collision/determinism/error-detection test suite (§C9) — this is the mechanism that keeps "federated" from becoming "fragmented".
4. **Land Stack integration:** once two or three state nodes are stable, expose `/resolve` and `/verify` (§C8) behind the national Land Stack the way state DILRMP data already feeds national reporting (§B1.2), rather than building a parallel national database.
5. **Legal catch-up, run in parallel, not sequentially:** classes U/C/P can be issued from day one because the Apartment Ownership Acts already back them (§C0 Q3); classes A (airspace) and T (subterranean) are issued as `legal_basis_status = ASSUMED` spatial objects from day one too, but a state (or DoLR) would still need to extend a state Apartment Ownership Act or pass a dedicated instrument before those carry full transferable legal title — the system is built so this catch-up can happen *later* without any RID or grammar change (§C10).

**C13.4 What we take from other countries' rollout models, and what we deliberately don't (extends §A3/§B-CS.5) 🌍**
- **Netherlands (Kadaster):** a *single* national cadastral agency ran the multi-level-rights extension centrally, with one national 3D building-model layer (BAG+AHN) underneath (§B-CS.6). We take the pattern "one national body owns the technical model and a national base layer", but **reject** the single-agency structure itself, because Indian land records are constitutionally a State subject (§B1.4, §C12) the way Dutch cadastre is not.
- **Singapore (SLA):** a single, centrally administered land authority issues class-typed lots by statute (§B-CS.1, §B-CS.7). We take the pattern "publish a machine-readable, class-typed lot layer as open government data", but **reject** importing a single-authority statutory model, for the same constitutional reason.
- **Net design rule (unchanged from A3.4):** where India already has a working federated precedent (DILRMP/ULPIN's own state-by-state rollout, §C13.1), that precedent is the default; a foreign country's centralised rollout is read only for *which phase comes before which*, never for *who holds the database*.

---

## PART D — DATA INTEGRATION (EVERY PS INPUT, WITH A ROLE)

### D1. Input roles

| Input | Produces | Uncertainty carried | Real anchor (§D0.2) | Simulation (§D0.3) |
|---|---|---|---|---|
| Drone imagery | Ortho (ORI), SfM/MVS mesh, façade cues (oblique) | GSD, reprojection error, mesh holes (glass, water) | UPOR drone-survey workflow description (Bengaluru) | Synthetic renders + mesh corruption |
| LiDAR / point cloud | Ground/building/vegetation classes, planes, envelope, roof heights | Range noise, density, occlusion, georeg residual | — (no open Indian building-scale LiDAR found) | Ray-cast simulator over real footprints |
| GIS parcel layer | Parent ULPIN parcel geometry, setbacks | Legacy survey error; NAKSHA 5% area precedent | MCGM OneMCGM GIS, Karnataka UPOR/e-khata, Overture footprints | Generated parcels + shift/overlap noise where real layer unavailable |
| Floor plans | Expected levels/units/common areas | Drafting error, outdated plans | MCGM AutoDCR schema/workflow (format only) | Synthetic Indian-style plan generator, RERA-carpet-area-conformant |
| GNSS/CORS | Control points, georegistration, base frame | RTK fix/float, multipath, vertical ≈ worse than horizontal 💡 | SoI CORS published station list/accuracy class | Error-model simulator seeded from real accuracy class |
| DEM/DSM | Ground reference, nDSM = DSM − DTM, heights | Vertical error, canopy/structure mix | Open coarse DEM (Bhuvan/NRSC/SRTM-class) | Fine-resolution nDSM derived from simulated LiDAR |

### D2. Evidence sufficiency ladder (deliberate)

Airborne nadir sensors cannot see interior partitions or reliably see slab edges behind glazing. So each 3D-ULPIN check is tagged with the **minimum evidence class** it needs:

| Class | Evidence | Can verify |
|---|---|---|
| E1 | Airborne nadir (ORI, DSM, LiDAR) | Footprint, roof height, total height, setbacks, envelope, basement *presence* only via plan |
| E2 | Oblique / façade imagery | Storey count/window rows, balcony projections |
| E3 | Terrestrial / mobile / handheld scan | Slab levels, unit partitions, common areas |
| E4 | As-built BIM / survey drawing | Unit volumes, shafts |
| E5 | Underground detection (GPR / utility survey) | Utility position/depth, basement extent |

**Output states:** `PASS / WARN / FAIL / UNVERIFIABLE`. "UNVERIFIABLE (needs E3)" is a *legitimate, honest result* — a distinctive property versus "detects anomalies" claims. 💡 This is the same honesty stance §D0 applies at the data-source level.

### D3. GNSS/CORS and datums
- Use SoI CORS (>1,100 stations, ~±3 cm RTK claims) for GCPs and to tie the local frame to the national frame, including stations serving Mumbai and Bengaluru specifically (§B2). Record per point: fix type, σ_h, σ_z, baseline length, timestamp, datum.
- 💡 Vertical σ_z modelled as `σ_z = c·σ_h` with `c` configurable; ⚠️ measure/verify for SoI CORS.
- Datum handling: legacy Everest-1830 records vs WGS84/ITRF; every geometry stores `datum_id` and `transform_id`.
- Vertical: ellipsoidal h stored always; orthometric only with named geoid model + version (inter-model geoid differences over India can exceed 5 m — relative/local vertical datum is mandatory for identity and topology, per B7 in v4 research, retained).

### D4. Level inference from evidence (vertical parcel delineation input)
Given plan levels with priors (spacing h ~ N(h_plan, σ_h), monotonic) and E1/E2/E3 height cues:
1. Extract candidate z-peaks (façade points / window-row rows / slab edges).
2. Align peaks to plan levels by dynamic programming (Viterbi-style, monotonic, skipped/extra allowed at a penalty).
3. Output per level: `z_obs, σ, n_support, evidence_class`; flag **extra / missing / shifted** levels.
4. If support is insufficient ⇒ `UNVERIFIABLE`, not PASS.

### D5. Georegistration
ICP/plane-based alignment of sensor data to plan-derived model constrained by CORS GCPs; propagate the covariance (state per object `Σ`) into every downstream tolerance and probabilistic test.

---

## PART E — OBJECT MODEL, RIGHTS, LADM/INDIA PROFILE

### E1. Object taxonomy (covers every PS class)

| RID class | Object | Geometry | Parent | LADM concept | Indian concept ⚠️ (verify) | Evidence |
|---|---|---|---|---|---|---|
| S | Surface parcel column | Prism | — (ULPIN) | LA_Parcel | Survey/plot | E1 |
| B | Building envelope | Solid | S | LA_LegalSpaceBuildingUnit (envelope) | Sanctioned building | E1–E2 |
| L | Level | Slab volume | B | Spatial unit (level) | Floor | E2–E3 |
| U | Unit | Solid (multi-level allowed) | L(s) | Spatial unit / BAUnit link | Apartment/shop; carpet area, UDS | E3–E4 |
| C | Common area (general/limited) | Solid | B/L | Spatial unit + RRR | Common areas (RERA framework) | E3–E4 |
| P | Accessory — parking/storage | Solid/Prism | B/L/S | Accessory spatial unit | Parking / allotted space | E3 |
| A | Airspace lot | Solid above S/B | S | Spatial unit (legal space) | Air-right / development rights ⚠️ | Plan + E1 |
| T | Subterranean lot / tunnel | Solid | S | Spatial unit (legal space) | Basement / underground space | Plan + E5 |
| E | Elevated corridor | Solid (multi-parcel) | anchor S | LA_LegalSpaceUtilityNetwork-like / spatial unit | Metro/viaduct right-of-way | Plan + E1 |
| I | Utility segment | Line → corridor volume | T or S | LA_LegalSpaceUtilityNetwork | Right-of-way / easement | E5 |

### E2. Rights model (LADM RRR, India profile)
`Right{ right_id, type, holder (pseudonymised, DPDP-compliant), source_document, valid_from/to, scope → [RID…], legal_basis_status }`
Types: ownership-UDS-linked, lease, easement (access/utility), air-right, subsurface right, limited-common allotment (parking), restriction (setback/height cap; metro-proximity approval zone 🟡), responsibility (maintenance).

### E3. Overlap semantics (from LADM discussion of legal space vs RRR)

| Pair | Volume overlap allowed? |
|---|---|
| U–U, U–C (ownership vs common), P–P | **No** |
| Ownership volume – easement/utility right | Yes, if a Right record exists; otherwise **FAIL** |
| A (airspace) – B/L/U below | **No** (A must be outside the building envelope) |
| T (subterranean) – basement L/U | **No** unless T *contains* the declared basement |
| I (utility) – U/P/C | Only with easement Right |
| E (elevated) – S/A | Allowed with right-of-way; must not intersect B |

Physical space ≠ legal space: an IFC room is not automatically a U; a legal layer decides.

---

## PART F — VERTICAL PROPERTY MAPPING PIPELINE (R10, R22)

```text
Sanctioned plan(s) [MCGM AutoDCR-style CAD, or synthetic Indian-style plan] ─► plan parser ─► expected levels/units/commons ─► extrusion between level planes ─► EXPECTED legal-space model
                                                                                              │
Evidence E1–E5 [real footprint/DEM anchor + simulated sensor layers, §D0] ─► georegister ─► level inference (D4) ─► observed level planes ─► OBSERVED physical model
                                                                                              │
                                     constraint-guided delineation (H3) ◄──────────────────────┘
                                                   │
                                                   ▼
                     3D legal spaces (U, C, P, L, B, A, T, E, I) → ICT → RID allocation → validation → examiner
```
- **Plan-first, evidence-verified** stays the *default workflow* but must also handle: plans outdated, no plan (unauthorised), and modification history (multiple plan versions).
- **Extrusion rule:** unit volume = unit polygon extruded between the lower and upper slab planes of its level(s), minus declared voids, using the configured boundary convention (C5.6, RERA carpet-area aware).
- **Underground & elevated:** from plan/utility survey → corridor volumes with buffers reflecting position/depth σ, anchored to real Mumbai/Bengaluru corridor geometry where available (§G2).

---

## PART F2 — VISUALIZATION & RENDERING: A CONCEPT, NOT A BUILD SPEC (NEW, this revision)

**Scope note:** the frontend itself is out of scope for this dossier (it is built separately, §J's intro). This part exists only to answer "what will it look like, how do you keep it fast, and how do we not hardcode it to two cities" — a visual concept and a rendering strategy, not a UI spec or component list.

### F2.1 The one design rule that drives everything below
**The frontend renders `data_provenance`-tagged, class-typed geometry served from the registry's spatial endpoints (`/cover`, `/resolve`, §C8) — it never renders a hardcoded city.** A "place" is a row in the registry (a zone, a parcel, a building), not a line of frontend code. Adding Chennai or a fifth Mumbai zone later means adding data through the same ingestion pipeline (§D, §F) and the same conformance suite (§C9) that MZ-1…MZ-4 and BZ-1…BZ-3 already went through — the map does not need a new build. This is the direct answer to "make sure we're building a system, not a demo."

### F2.2 What it should look like — visual concept
- **Base layer:** a dark, low-saturation basemap (muted terrain/roads) so vertical, colour-coded 3D volumes read clearly against it — the same convention 3D-cadastre viewers (Kadaster's own 3D Basisvoorziening viewer, §B-CS.6) and BIM viewers use, for the same reason.
- **Class-coloured volumes, not class-coloured pins:** each RID class (§C3 `CLS`) gets one fixed colour used everywhere in the UI — e.g. surface columns in a neutral grey-blue, units (U) in warm amber, common areas (C) in soft green, accessory/parking (P) in grey, airspace (A) as a translucent outline-only volume, subterranean (T) and utility (I) rendered *below* a ground-plane cutaway, elevated corridors (E) as a distinct saturated colour that reads clearly against both sky and ground. Colour is a legend, not decoration — it is how an examiner tells classes apart at a glance in a scene with hundreds of objects.
- **IDs are never permanent on-screen labels.** At city/zone scale, no RID text is drawn at all (§F2.3 clustering). On hover/tap, a single object highlights (outline + slight elevation/glow) and a compact side card shows: RID (with the ULPIN14 anchor visually distinguished from the class/sequence suffix, echoing the §C0 Q4 "extension, not replacement" story), class, current `data_provenance` badge (REAL / REAL-FOREIGN / PROXY / SYNTHETIC, colour-independent icon so colour-blind-safe), and validation status (PASS/WARN/FAIL/UNVERIFIABLE, §D2) as a small status dot. This keeps the 3D scene visually clean while making every fact one click away.
- **A "what is below/above this parcel" mode** (the R1 headline query) is a dedicated view, not a permanent overlay: selecting a surface parcel triggers a vertical cutaway/X-ray showing every RID anchored to it, stacked in depth order, each still class-coloured — this is the single visual that should appear in every demo and judge screenshot, because it is the literal answer to why 2D fails.

### F2.3 Rendering technique — how to keep it smooth without overloading
The three-tier fidelity model already defined for the data plan (§B3.3: Tier A hero blocks, Tier B context, Tier C backdrop) is reused directly as the **level-of-detail (LOD) strategy** for rendering, so the data plan and the render plan are the same plan, not two separate efforts:
- **Tiled, LOD-switched geometry**, structured the way OGC 3D Tiles / CityGML LoD levels already work: Tier C (backdrop) renders as flat footprints only; Tier B (context) renders as simple LoD1 extrusions (box buildings, no interior detail); Tier A (hero blocks) renders full detail — levels, units, commons, shafts — and *only* Tier A objects are ever individually pickable/labelled. This means a zone with hundreds of surrounding buildings never taxes the renderer with detail nobody asked to see.
- **Spatial-index-driven loading, not "load everything":** the frontend requests geometry through `/cover?bbox=…` (§C8), which resolves through the same Morton/octree Spatial Address grid already defined for the registry (§C7) — so panning/zooming the map only ever fetches and renders the cells currently in view, at the LOD their tier dictates. The registry's own spatial index *is* the map's tiling scheme; there is no separate "frontend tiling layer" to build and keep in sync.
- **Clustering and progressive disclosure, not permanent clutter:** at city/zone zoom, individual RIDs are never drawn — only zone/building-count markers; at building zoom, Tier A objects appear with class colours but no text; only on selection does a label/side-card render. This mirrors the same "spend fidelity only where it produces evidence" discipline already applied to the data plan (§B3.3), applied now to rendering budget instead of survey/simulation budget.
- **Standard smooth-render techniques**, all off-the-shelf and none novel: frustum + occlusion culling so off-screen or hidden volumes aren't rendered; GPU instancing for repeated elements (parking bays, generic Tier-B box extrusions); simplified collision/pick geometry decoupled from the higher-poly display mesh; a WebGL/WebGPU-class renderer (e.g. CesiumJS or deck.gl/MapLibre-GL for the geospatial base + tiled 3D content, or a Three.js scene fed the same tiled data) chosen at build time — the dossier does not lock in one library, since the point is that any renderer consuming the same tiled `/cover` output works.

### F2.4 Why this is a system, not a two-city demo 💡
- **Nothing about a place is hardcoded into rendering logic.** A zone is a bounding polygon plus a `data_provenance` policy in the registry (exactly how MZ-1…MZ-4/BZ-1…BZ-3 are already defined, §B3.2/§B3.2a) — the renderer just asks "what's in this bbox" and draws whatever comes back, at whatever tier each object is tagged. Adding a new city is a data-and-conformance exercise (§C9, §C13.3 phase 2), never a frontend rewrite.
- **The class-colour legend, the LOD tiers, and the provenance/validation badges are all defined once, centrally**, the same way the RID grammar (§C3) is defined once and reused by every state node (§C12) — so a new zone or a new state node automatically renders correctly the day it starts allocating RIDs, with zero new frontend code.
- **This is also why §C8's registry endpoints exist in the first place:** `/cover`, `/resolve`, `/verify`, `/explain` are not just backend conveniences, they are the *entire contract* the visualization needs — a frontend built against that contract today keeps working unchanged as more zones, more states, or eventually more countries' pilots are added behind it.

---

## PART G — UNDERGROUND, PARKING, AIR, ELEVATED: SPECIFIC MODELS (R4–R8, R13, R30)

- **Basement/parking:** multi-level T-lots and P accessories; check basement mismatch (plan vs E5/E3), parking-unit linkage (each P linked to a U or C with a Right).
- **Utility network:** segments as polylines with attributes (type, material, diameter, depth) → volume = buffer(σ_h, σ_z, diameter). Conflict queries: utility ∩ ownership volume without easement; utility ∩ basement; utility clash with planned excavation.
- **Air rights:** A-lots defined by plane/surface above a reference (ground or roof) with height cap; validated against building envelope and height restrictions; legal semantics ⚠️ pluggable, `legal_basis_status = ASSUMED` by default in India per §B1.4.
- **Elevated corridor:** E-lot volume with multi-parcel `SPANS`; clearance queries (headroom above surface parcels).
- **No open national underground dataset** is confirmed to exist ⇒ simulated network in synthetic profile with known ground truth, laid out under real corridor anchors; GPR-style noise modelled; labelled SYNTHETIC everywhere (§D0.3).

## PART G2 — MUMBAI/BENGALURU CONCRETE SCENARIOS FOR PART G (NEW IN v5)

Naming a real place per object class turns Part G from an abstract model into a demoable story:

| Object class | Bengaluru scenario | Mumbai scenario |
|---|---|---|
| T (subterranean) | (BZ-1) Basement of a CBD tower near MG Road/Shivajinagar vs the **Pink Line** tunnel/station box — a `T ∩ T` clearance query, framed as *as-planned* since the section is under construction | (MZ-1) Multi-level basement of a Worli/Lower Parel tower vs the Aqua Line tunnel and the MMRC 50 m approval zone (modelled as a `restriction` volume 🟡) — a `T ∩ restriction` query. Coastal Road tunnels lie under Malabar Hill, outside MZ-1 ⚠️ |
| I (utility) | A property built over a former storm-water drain (*raja kaluve*) — a documented, recurring real Bengaluru dispute pattern; utility/drain easement vs ownership volume conflict | Old municipal water/sewage line under a redeveloped plot (TDR-driven densification) — utility-without-easement conflict |
| E (elevated) | (BZ-2) Blue Line Phase 2A viaduct over ORR-zone parcels — `SPANS` relation + headroom/clearance query; (BZ-1) MG Road: elevated line over/near underground line — stacked E-over-T ⚠️ | (MZ-1) Monorail/Metro viaduct sections near Mahalaxmi/Lower Parel crossing a mixed residential-commercial block ⚠️ verify — same query pattern, different state authority |
| A (air-right) | TDR-receiving plot near ORR using purchased FSI to build extra floors — airspace volume above the "as-of-right" envelope, `legal_basis_status = STATE-SPECIFIC` (Karnataka TDR rules) | Classic Mumbai TDR/FSI redevelopment case — same object class, Maharashtra DCPR-specific rules |

This table is the single best "show, don't tell" artifact for a judge panel: identical object classes, two different real state legal contexts, same 3D ULPIN grammar underneath — direct evidence for R24's "interoperable" claim.

---

## PART H — AI/ML (EACH PS ITEM, WITH WHAT IS LEARNED)

| PS item | What is learned | Candidate models 💡 | Data (per §D0) | Metrics | Failure modes |
|---|---|---|---|---|---|
| **H1 Automated building extraction** (R20) | Footprint/roof segmentation; building class in point clouds | U-Net-type segmentation on ORI+nDSM; point-cloud semantic segmentation (KPConv/RandLA-Net-class) | Synthetic renders over REAL Mumbai/Bengaluru footprints (Overture/OSM/UPOR-published extents) | IoU, boundary F1, height MAE | Shadows, dense slums, glass, occlusion |
| **H2 Floor segmentation** (R21) | (a) plan-side: walls/rooms/doors/levels from plan raster; (b) sensor-side: level detection (D4) | Plan-segmentation model fine-tuned on synthetic Indian-style plans matching MCGM AutoDCR's CAD schema; 1-D level-peak model | Synthetic Indian-style plans (parametric, RERA-carpet-area-conformant) | Room/wall IoU; level count accuracy; z-error | Indian drafting conventions, balconies/shafts |
| **H3 Vertical parcel delineation** (R22) | Proposal of unit partition/vertical extent; snapping to plan topology | Learned proposal + constrained optimisation (exact cover / graph partition under plan adjacency, conservation rule) | Simulated buildings with known unit volumes | Volume IoU per unit; unit-count accuracy | Partition ambiguity, merged/split units |
| **H4 Intelligent topology validation** (R23) | Anomaly ranking on the adjacency graph; **tolerance calibration from examiner decisions**, seeded from NAKSHA's real 5% precedent | Isolation-forest / graph-based anomaly scorer over rule-violation features; active learning loop | Simulated defects + examiner-simulated labels | Precision/recall/F1 per defect; examiner workload reduction | Label bias, distribution shift |

"Intelligent" is defined explicitly: (i) **uncertainty-aware** predicates, (ii) **explanations**, (iii) **learned ranking**, (iv) **adaptive tolerances** — not just DE-9IM checks. ML is triage; humans decide. Foreign-city-trained storey-count models (e.g. Munich-trained CNNs, 81.2% exact/97.9% ±1 — Survey Review 2025) are explicitly **not** used as evidence for Indian towers without local fine-tuning — a direct application of the A3 doctrine at the ML layer.

---

## PART I — TOPOLOGY & VALIDATION (R23, R29)

### I1. Tiers
T0 data integrity → T1 geometric validity (val3dity) → T2 cadastral topology → T3 plan-vs-as-built → T4 administrative consistency (UDS, registry) → T5 human review. Outcomes: PASS / WARN / FAIL / UNVERIFIABLE.
val3dity checks ISO-19107-style solid validity; generic ISO strictness can be stricter than cadastral needs ⇒ **custom cadastral rule layer** (shell self-touch policy etc.). ⚠️ verify val3dity's current error codes for citation.

### I2. Core predicates (3D intersection/volume/difference via Trimesh & Shapely)
- **No-overlap:** `vol(A ∩ B) ≤ ε_v` for ownership pairs.
- **Volume conservation:** `| Σ vol(children) + Σ vol(voids) − vol(parent) | ≤ ε_v` (gaps/overlaps both appear here) — with `ε_v` from propagated σ.
- **Containment:** child ⊆ parent (± σ); level ⊆ building envelope; building ⊆ parcel column (setbacks).
- **Connectivity:** each U is one connected interior (multi-level allowed via declared connectors).
- **Vertical order:** levels ordered, contiguous, floor-to-ceiling consistent with plan ± tolerance.

### I3. Uncertainty-aware verdicts
Deterministic form: `|Δz| ≤ 2σ_c → PASS; ≤ max(3σ_c, τ_policy) → WARN; else FAIL`, with `σ_c = √(σ_exp² + σ_obs²)`.
Probabilistic form (for overlaps/containment): Monte-Carlo perturb vertices by their covariance (N = 🎯 200); `P(violation)` → PASS < 0.05 ≤ WARN < 0.5 ≤ FAIL (thresholds 🎯, parameterised by class).
Precedent for parameterised tolerances: **NAKSHA's real 5% parcel-area rule** (§B1.2) — not applied blindly to 3D, but the direct Indian precedent for the *concept* of a tolerance-then-anomaly workflow.

### I4. Reconciliation engine (plan vs observed)
- Match expected ↔ observed objects by assignment (Hungarian) on a cost of (1−IoU3D, class, parent).
- Discrepancy classes: extra/missing floor; wrong floor height; vertical drift; footprint deviation; setback breach; unit-count mismatch; unit area/volume mismatch; basement mismatch; unauthorised structure (observed, no plan); demolished (plan, no observation); parking count mismatch; airspace intrusion; utility–ownership conflict; datum-offset error; parcel-boundary encroachment; corridor clearance breach.
- Every finding is an **explain object**: rule, evidence IDs, evidence class, σ, confidence, geometry overlay, plan version, examiner action.

---

## PART J — SYSTEM ARCHITECTURE (EXPANDED, DEEP DESIGN)

### J1. System architecture

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ L0  DATA PROFILE / PROVENANCE LAYER                                                     │
│     Every object tagged: data_provenance ∈ {REAL, PROXY, SYNTHETIC}; source, CRS, datum,│
│     resolution, accuracy (§D0). Real anchors: MCGM GIS/AutoDCR, Karnataka UPOR/e-khata, │
│     Overture/OSM footprints, SoI CORS, open DEM. Simulated: plans, LiDAR, utilities.    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ L1  INGESTION LAYER                                                                    │
│     GDAL/PDAL/IfcOpenShell/ezdxf readers; format adapters per source (DXF from AutoDCR- │
│     style plans, LAS/LAZ point clouds, GeoTIFF DEM, GeoJSON/Shapefile parcel layers).   │
│     Each adapter emits a normalised internal geometry record + provenance tag.          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ L2  NORMALISATION & GEOREGISTRATION LAYER                                               │
│     CRS + datum unification; canonical geometry (C4); CORS/GCP + ICP alignment (D3, D5);│
│     covariance Σ propagation attached to every geometry version.                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ L3  EVIDENCE & EXPECTED-MODEL LAYER                                                     │
│     EVIDENCE STORE (local files, W3C PROV provenance) ‖ EXPECTED MODEL BUILDER          │
│     (plan → 3D legal-space model, §F) — run in-process, reconciled downstream.          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ L4  ML/CV EXTRACTION LAYER (H1–H4)                                                      │
│     Building extraction → floor/level segmentation → vertical delineation → anomaly     │
│     ranking. In-process Python modules with pre-trained weights.                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ L5  IDENTITY & VALIDATION LAYER                                                         │
│     3D-ULPIN ENGINE (RID·NK·SA·ICT·lineage, §C) ‖ VALIDATION/RECONCILIATION (tiers T0–T5,│
│     probabilistic predicates via Trimesh/Shapely, explain objects, §I).                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ L6  REGISTRY & PERSISTENCE LAYER                                                        │
│     Embedded SQLite (WAL mode) + local asset storage; immutable hash-chained audit log. │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ L7  API / SERVICE LAYER                                                                 │
│     FastAPI: /allocate /resolve /verify /lineage /cover /explain /validate endpoints.   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ L8  CONSUMPTION LAYER                                                                   │
│     Examiner console (§L); Three.js / Cesium 3D viewer.                                 │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### J2. Concrete Tech Stack (Zero-Live-Service / Single-Process)

The entire system runs locally inside a single Python process with zero external database daemons or live background services:

| Concern | Component | Implementation Detail & Rationale |
|---|---|---|
| **API & Server** | **FastAPI + Uvicorn** | Single-process ASGI server (`uvicorn main:app --reload`), typed routes, auto-generated OpenAPI docs. |
| **Relational Registry** | **SQLite (WAL Mode)** | Embedded single file (`registry.db`), zero daemon setup, sub-millisecond local queries, ACID-compliant. |
| **3D Computational Geometry** | **`trimesh` + `shapely` + `scipy.spatial`** | In-memory 3D mesh booleans, prism extrusions, exact volume `vol(A ∩ B)` intersection tests. |
| **Point-Cloud / GIS Processing** | **PDAL, GDAL, IfcOpenShell, ezdxf** | Direct Python libraries handling LAS/LAZ, GeoTIFF, DXF, and IFC without external services. |
| **ML Inference** | **PyTorch / ONNX Runtime + scikit-learn** | Pre-trained model weights executed in-process without microservice network overhead. |
| **Evidence & File Storage** | **Local File System (`./data/`)** | Point clouds, meshes, and floor plans served directly via FastAPI static mounting. |
| **Spatial Indexing & Caching** | **In-Memory Morton Grid / R-Tree + `lru_cache`** | Nanosecond-level lookup speeds for `/resolve` and `/cover` spatial queries. |
| **Lineage & Audit** | **W3C PROV Records** | Stored directly in SQLite as JSON with cryptographic SHA-256 hash chaining. |

### J3. Non-functional targets (🎯 design goals, tie back to R24 and M5)

| Property | Target | Source of the requirement |
|---|---|---|
| Latency | Sub-millisecond `/resolve` and `/cover` responses (in-memory execution) | R24; M5 |
| Interoperability | Round-trip RID ↔ LADM ↔ IFC ↔ CityGML with id preservation | R27; C9 |
| Privacy | No personal ownership data inside any identifier; `Right.holder` pseudonymised by default | DPDP Act, 2023 (§B1.4) |
| Auditability | Every finding is an explain object; every version hash-chained | R28, R29 |
| Honesty of uncertainty | UNVERIFIABLE is a first-class output, never silently upgraded to PASS | §D2 |
| Data transparency | Every object carries `data_provenance`; REAL vs SYNTHETIC never conflated in any report or demo screen | §D0.4 |

---

## PART K — STANDARDS STACK (MAPPED, NOT NAME-DROPPED)

| Standard | Used for | Scope | India-first note |
|---|---|---|---|
| ISO 19152-2:2025 (LADM Part 2) | Legal spaces, RRR, spatial units; India profile | Core | Adopted formally per §B-CS.4 — a standard to profile, not a foreign system to copy |
| ISO 19107 / val3dity | Geometry validity | Core | Generic geometry math, not jurisdiction-specific |
| IFC (⚠️ verify version incl. infrastructure extensions) | Physical model of building; IfcSpace ↔ legal space link; GlobalId ↔ RID cross-ref | Core (import/export) | Accepted as optional richer input; MCGM AutoDCR's CAD/DXF remains the default (§B-CS.5) |
| CityGML 3.0 / CityJSON | Semantic 3D city exchange | Export | — |
| OGC API – Features / 3D GeoVolumes (⚠️ verify) | Access | Core | — |
| 3D Tiles / glTF | Visualisation | Core | — |
| LandXML / OGC LandInfra | Survey exchange | Optional | — |
| ISO 7064 | Check symbol | Core | — |
| ECCMA property-identifier standard | ULPIN compatibility | Core (⚠️ obtain doc) | The one standard we are *contractually* bound to, since P3 requires ULPIN backward-compatibility |
| W3C PROV | Provenance | Core | Carries the REAL/SYNTHETIC label required by §D0.4 |

---

## PART L — EXAMINER CONSOLE & GOVERNANCE (R28, R29, R30)

- Views: Sanctioned / As-built / Difference; layers per class (S,B,L,U,C,P,A,T,E,I); section-cut and "look below/above this parcel".
- **Query demos impossible for 2D, with a named real place each:** what is below/above a Bengaluru MG Road-zone parcel (Pink Line tunnel below, Purple Line viaduct nearby, §G2) and what clearance a Blue Line viaduct leaves over an ORR-zone parcel; which parking bay belongs to which flat in a Mumbai redevelopment tower; which utility (or storm drain) crosses which Bengaluru ownership volume; which Mumbai Metro corridor overhangs which parcels; does an observed Mumbai basement match the MCGM-approved plan.
- Every AI finding shows confidence, evidence class, σ, tolerance, rule, override; **UNVERIFIABLE** shown explicitly; `data_provenance` shown explicitly (§D0.4).
- Audit: hash-chained log, examiner sign-off (mock signature), versioned plans.

---

## PART M — SIMULATION & EVALUATION PROGRAMME (R5-critical, ties directly to §D0)

### M1. Generator scope
Urban blocks with: high-rise towers (10–60 levels), podiums, basements (1–4), parking, mixed-use, duplex units, shafts/atria, amalgamated parcels, elevated metro corridor spanning parcels, tunnels, utility networks, air-right volumes over podiums, plan versions (original, modified), unauthorised additions — placed on **real footprints inside the four micro-zones** (§B3) where available (§D0.2), at the three fidelity tiers of §B3.3, so the synthetic layer is geographically grounded, not an arbitrary city.
Parametric Indian-style plans (rooms, balconies, shafts, staircases, lifts), schema-matched to MCGM AutoDCR's CAD conventions, to address the domain gap in H2.

### M2. Sensor simulators (parameters are configurable assumptions 🎯, seeded from real accuracy classes where published — §D0.2)
- **GNSS:** fix/float mixture, correlated multipath near towers (Gauss-Markov), σ_z = c·σ_h, seeded from SoI's published RTK class.
- **LiDAR:** ray-casting from flight lines, range noise, scan-angle-dependent density, occlusion by adjacent towers, dropouts on glazing, facade under-sampling from nadir.
- **Photogrammetry:** mesh holes, smoothing, façade distortion.
- **Utilities:** position/depth noise, missing segments.
- **Plans:** drafting error, outdated versions.

### M3. Defect taxonomy (≥ 28 classes)
Geometry: overlap, gap, disconnected solid, non-manifold, inverted normals. Containment: child outside parent, level outside envelope, building outside parcel. Vertical: extra/missing level, wrong height, vertical drift, datum-offset. Plan: setback breach, footprint deviation, unit-count mismatch, unit-volume mismatch, basement mismatch, parking mismatch, unauthorised structure, demolished-not-updated. Rights: ownership-volume overlap, utility-without-easement, air-lot intrusion, corridor clearance breach, orphan right, UDS mismatch. Identity: duplicate RID, ICT mis-continuation, stale parcel lineage, broken lineage chain.

### M4. Evaluation protocol (fixes circularity)
- Defect generator, validator, and ICT developed by **separate code paths/seeds**; hold-out defect types and magnitude ranges reserved for final evaluation.
- Report **detection vs magnitude curves** (e.g. height offset 0.05–1.0 m; setback breach 0.1–2 m), not single recall numbers; ≥100 injections per class with confidence intervals 🎯; compound defects.
- Report **false-positive rate on clean-but-noisy models** across noise levels.
- Report **UNVERIFIABLE rate** per evidence class (honesty metric).
- **Identity system metrics:** uniqueness/collision, NK determinism, check-symbol detection, ICT accuracy (CONTINUE/NEW/SPLIT/MERGE/AMBIGUOUS confusion matrix), resolution latency at 10⁶ objects.
- **ML metrics:** IoU/boundary-F1 (H1), plan-segmentation IoU + level accuracy (H2), unit-volume IoU (H3), anomaly ranking precision@k and examiner-time saved (H4).

### M5. Targets 🎯 (design goals, not results)
NK determinism 100%; check-symbol single-error detection 100%; zero RID collisions in 10⁷ allocations; ICT correct on scripted scenarios ≥ 95%; per-class defect recall reported as curves.

### M6. Real/proxy data summary (cross-reference to §D0)
Open footprints (Overture/OSM, ODbL), Open Buildings 2.5D heights as priors (CC-BY/ODbL), MCGM OneMCGM GIS layer descriptions and AutoDCR schema (format-level, public), Karnataka UPOR/e-khata published extents, SoI CORS published accuracy class, real ULPINs only where legitimately available. PROXY/SYNTHETIC data is always labelled via `data_provenance` and never presented as official NAKSHA, MCGM, or BBMP/GBA output.

---

## PART N — NOVELTY (WHAT MAKES THIS DIFFERENT)

1. **Three-layer 3D ULPIN** (registry ID + verifiable natural key + spatial address) with a **hash-chained binding record** — reconciles ULPIN's own geometry-derived heritage with lifecycle persistence, extending an Indian standard rather than importing a foreign one.
2. **Identity Continuity Test**: tolerance- and evidence-aware, examiner-in-the-loop decision procedure for continue/new/split/merge, generalising NAKSHA's own real 5% area-tolerance philosophy into 3D.
3. **Evidence sufficiency ladder** with a fourth outcome, **UNVERIFIABLE**.
4. **Uncertainty-propagated topology**: Monte-Carlo/covariance-aware 3D predicates and volume-conservation invariants.
5. **Class-typed volumes for every PS object type**, each demonstrated against a **named real Mumbai or Bengaluru scenario** (§G2) — not a generic international example.
6. **Plan-to-observed reconciliation with explain objects**, joining the MCGM AutoDCR-style building pipeline and the survey/cadastre pipeline — a gap that exists even in the most advanced foreign systems (§B-CS.3), solved here for Indian institutions specifically.
7. **Adaptive tolerances** learned from examiner decisions, seeded by NAKSHA's 5% precedent.
8. **Explicit REAL/SYNTHETIC data provenance on every object** (§D0) — a transparency layer most cadastre-tech demos omit, and a direct extension of the project's own UNVERIFIABLE-honesty principle to the data layer.
9. **Rigorous measurement** via independent simulation + defect taxonomy + magnitude curves + identity-system conformance suite.
10. **Documented adopt/adapt/reject discipline against foreign case studies** (§B-CS.5) — makes the "is this just copied from Singapore/Australia?" question unaskable, because the answer is already tabulated.

---

## PART O — RISKS, ASSUMPTIONS, UNVERIFIED

| Item | Status | Handling |
|---|---|---|
| ECCMA layout, ULPIN mutation/version semantics | ⚠️ | Obtain ECCMA Feb 2015 + NIC technical note; RID design is *additive* so it survives either answer |
| BBMP/GBA current AutoDCR/Pre-DCR portal status (institutional rename to Greater Bengaluru Authority, 2024–25) | ⚠️ | Verify current portal/authority name before any live demo reference |
| Exact Mumbai Metro Line 3 / Coastal Road tunnel chainage and depth used in any demo visual | ⚠️ | Use illustrative/simulated depth; cite only public route-level facts, never claim survey-grade alignment |
| Sanctioned-plan and NAKSHA data access | ⚠️ | Synthetic primary, schema-matched to MCGM AutoDCR/RERA; PROXY labelled (§D0) |
| Legal effect of 3D records, air-rights law, state TDR/FSI rules (Maharashtra DCPR vs Karnataka TDR rules differ) | ⚠️ | `legal_basis_status` field; no legal claim; verify per state before any specific TDR/FSI numeric claim |
| GeoSOT-3D details; IFC/OGC API versions | ⚠️ | Own Morton grid as fallback |
| ISO 7064 test vectors; val3dity codes | ⚠️ | Verify during implementation |
| Literature novelty of ICT / 3D identifier lifecycle | ⚠️ | Targeted literature search before claiming novelty |
| CORS access terms, vertical accuracy, exact Maharashtra/Karnataka station list | ⚠️ | Confirm via SoI CORS portal |
| Drone rules, geospatial policy, privacy (DPDP Act) | ⚠️ | Not fully researched; review before any real-data flight/claim; default to pseudonymisation regardless |
| Legal boundary convention (inner face/centre/outer) & RERA carpet-area definition, per-state variation | ⚠️ | Check per state before area/volume claims |
| Overture/Open Buildings ODbL share-alike | ✅ risk | Keep derived data ODbL-compliant |
| NAKSHA's exact current ULB list/count (157 vs 152 vs 150 across sources) | 🟡 | Cite the DoLR "About NAKSHA" figure (157/27+3/4,484 km²) as primary; note earlier PIB/Frontiers figures as historical snapshots, not contradictions |
| Zone boundaries, Aqua Line station list, Monorail/viaduct geometry, Pink/Purple station structure types | ⚠️ | Freeze zones on a map; use route-level facts only; depth/chainage simulated (§B3) |
| MMRC 50 m proximity notice | 🟡 | Secondary source only; verify the notice text before showing the number |
| Apartment Ownership Acts (MH 1970, KA 1972) — section-level reading; MOFA relevance | ⚠️ | Read the Acts; state only what the text supports (§B1.4) |
| RERA public data (what MahaRERA/K-RERA actually let a user view/download; terms) | ⚠️ | Use public counts only; plans as test inputs, no redistribution |
| Rotterdam AHN/BAG/3D BAG tiles and licences; SLA airspace dataset fields | ⚠️ | Confirm before building the benchmark; drop benchmark rather than assume |
| Real ULPINs for urban Mumbai/Bengaluru parcels | ⚠️ | PROXY-ULPIN by default, flagged (§C11) |
| Drone/own-capture legality | ⚠️ | Optional; skip if any permission is unclear (§D0.6, §D0.8) |

---

## PART P — BUILD ORDER (NOTHING DROPPED; ORDER = DEPENDENCY)

0. **B3 — Freeze the four micro-zones on a map; pick 3–5 hero towers per zone from public RERA counts; confirm Rotterdam/SLA dataset access and licences** (drop the benchmark, not the honesty, if access fails).
1. **D0 — Data provenance ledger:** stand up the `data_provenance` tagging convention (REAL-IN / REAL-FOREIGN / REAL-OWN / PROXY / SYNTHETIC) and the real-anchor ingestion (MCGM GIS layer descriptions, Karnataka UPOR/e-khata extents, Overture footprints, RERA counts, SoI CORS list, open DEM, Rotterdam AHN tile) before anything else touches geometry.
2. **C — 3D ULPIN core:** grammar, check symbol, NK canonicalisation, SA grid, registry, ICT, lineage, API, conformance suite.
3. **Generator + simulators (M):** objects for all classes S,B,L,U,C,P,A,T,E,I, placed on real Mumbai/Bengaluru footprints; plan versions; defects.
4. **Normaliser + georegistration (D):** CORS/GCP model, datum handling, Σ propagation.
5. **Expected-model builder (F):** plan → levels/units/commons; extrusion; boundary conventions (RERA-aware).
6. **Evidence extraction:** H1 building extraction, H2 floor/level segmentation, D4 level inference.
7. **Delineation (H3)** + ICT + RID allocation.
8. **Validation & reconciliation (I)** with probabilistic predicates; H4 ranking.
9. **Rights model & overlap semantics (E)**; LADM/IFC/CityGML export.
10. **Examiner console (L)** with all views, queries, and the two-city scenario demos (§G2).
11. **Evaluation (M4–M5)**; final honesty pass confirming REAL vs SYNTHETIC labelling is consistent everywhere (§D0.4) before any public presentation.

Every PS R-ID maps to at least one build step above; the traceability table (A1) doubles as the final acceptance checklist.

---

## PART Q — SOURCE LIST (USED IN THIS DOSSIER)

Primary/official (Indian):
- DoLR ULPIN: https://dolr.gov.in/en/ulpin/
- DoLR About NAKSHA: https://dolr.gov.in/en/about-naksha/
- NAKSHA UAT portal: https://nakshauat.dolr.gov.in/
- NAKSHA booklet (Feb 2025, state-wise ULB/area table): https://cdnbbsr.s3waas.gov.in/s3d69116f8b0140cdeb1f99a4d5096ffe4/uploads/2025/03/20250311644815872.pdf
- PIB NAKSHA launch: https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2104028
- PIB Land Stack: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2210204&reg=3&lang=1 ; https://www.pib.gov.in/PressReleasePage.aspx?PRID=2210412&reg=3&lang=2
- SoI CORS: https://cors.surveyofindia.gov.in/
- MCGM OneMCGM GIS description (community.data.gov.in): https://community.data.gov.in/?p=105088
- MCGM/OneMCGM Esri case study (PDF): https://esri.in/content/dam/distributor-share/esri-in/pdf/industries/government/case-study/municipal-corporation-of-greater-mumbai-mcgm.pdf
- MCGM AutoDCR case study (SoftTech): https://softtechglobal.com/?p=18701
- MCGM ArcGIS enterprise adoption (Esri ArcNews, 2010): https://www.esri.com/news/arcnews/spring10articles/mumbai-selects.html

Primary/official (international case studies — read as case studies only, §B-CS):
- SLA lot-number allocation: https://www.sla.gov.sg/regulatory/property-boundaries/allocation-of-lot-numbers/
- SLA survey maps and plans: https://www.sla.gov.sg/regulatory/property-boundaries/survey-maps-and-plans/
- SLA cadastral airspace dataset: https://data.gov.sg/dataset/sla-cadastral-airspace-parcel
- URA CORENET X: https://www.ura.gov.sg/Corporate/Guidelines/Circulars/dc23-07
- CORENET X FAQ: https://support.corenet.gov.sg/hc/en-us/articles/13750777246479-Will-CORENET-X-eventually-accept-land-subdivision-plans
- Victoria ePlan mandate: https://www.land.vic.gov.au/surveying/digital-cadastre/eplan-mandate
- Victoria 10-year strategy: https://www.land.vic.gov.au/surveying/digital-cadastre/10-year-strategy
- ISO 19152-2:2025: https://www.iso.org/standard/81264.html ; ISO 19152-1:2024: https://www.iso.org/standard/81263.html
- Overture buildings guide: https://docs.overturemaps.org/guides/buildings/
- Open Buildings 2.5D: https://sites.research.google/gr/open-buildings/temporal/

Research/secondary:
- Sengupta et al. 2024, ULPIN (Springer): https://link.springer.com/chapter/10.1007/978-981-97-8537-7_3
- Frontiers 2026 NAKSHA (peer-reviewed, source of the "megacity deferred to later phase" finding): https://www.frontiersin.org/journals/sustainable-cities/articles/10.3389/frsc.2026.1874630/full
- OICRF Singapore 3D cadastre: https://www.oicrf.org/-/piloting-3d-cadastre-in-singapore
- Khoo, 3D Cadastre in Singapore (FIG 2011): https://www.fig.net/resources/proceedings/2011/2011_3dcadastre/3Dcad_2011_40.pdf
- CSDILA Singapore/ePlan: https://cadastraltemplate.org/singapore.php ; https://eng.unimelb.edu.au/csdila/projects/eplan
- Storey estimation (Munich): https://arxiv.org/abs/2505.18021
- KTH geoid India: https://www.tandfonline.com/doi/abs/10.1080/00396265.2025.2504317 ; congruence: https://ascelibrary.org/doi/10.1061/JSUED2.SUENG-1382
- 3D Cadastres in India (Delhi): https://www.sciencedirect.com/science/article/abs/pii/S0264837719306994
- LADM 3D LA special issue: https://www.tandfonline.com/doi/full/10.1080/00396265.2025.2561263
- Overture 2.3 B: https://overturemaps.org/blog/2023/overture-buildings-theme-hits-2-3b-buildings-with-addition-of-google-open-buildings-data/
- MediaNama (CORS 1,105; NAKSHA ORI/DEM via PPP): https://www.medianama.com/2025/12/223-indias-geospatial-network-14677-users/
- Karnataka UPOR/drone survey/e-khata coverage (Deccan Herald, multi-year): https://www.deccanherald.com/tag/upor ; https://www.deccanherald.com/india/karnataka/drone-survey-to-update-land-records-in-state-1085140.html ; https://www.deccanherald.com/india/karnataka/bengaluru/greater-bengaluru-authority-to-integrate-e-khata-with-drone-overview-of-property-3819103
- UPOR academic overview (ISEC): https://www.isec.ac.in/urban-property-ownership-records-upor-in-karnataka-computerized-land-registration-system-for-urban-properties/
- Bengaluru storm-drain/land-record dispute reporting (The News Minute): https://www.thenewsminute.com/article/how-do-you-know-if-your-house-sitting-bengaluru-lake-or-drain-48019
- Secondary on ULPIN mutation/interior point: https://indianmasterminds.com/features/beyond-headlines/what-changes-for-land-buyers-when-ulpin-the-aadhar-of-land-is-rolled-out-pan-india-in-2022/ ; https://www.scribd.com/document/604779789/Ulpin-Presentation

Added in v5.1 (Indian primary/secondary):
- Maharashtra Apartment Ownership Act 1970: https://legitquest.com/act/maharashtra-apartment-ownership-act-1970/643D ; summary of Declaration/Deed contents: https://bcajonline.org/journal/maharashtra-apartment-ownership-act/
- Karnataka Apartment Ownership Act 1972 (section list): https://www.casemine.com/act/in/5ed4fb01894ef23297d8b99b
- Karnataka HC on declared land as common area: https://www.livelaw.in/amp/high-court/karnataka-high-court/karnataka-high-court-rules-land-owners-cannot-retail-land-after-sale-deed-execution-apartment-construction-292313
- Bengaluru e-khata / flat-khata gap (Deccan Herald, Oct 2024): https://deccanherald.com/india/karnataka/bengaluru/how-to-get-your-e-khata-3228056 ; e-PID explainer: https://landeed.com/post/an-essential-guide-to-getting-e-aasthi
- Mumbai Aqua Line: https://en.wikipedia.org/wiki/Aqua_Line_(Mumbai_Metro) ; Egis project page: https://www.egis-group.com/projects/mumbai-metro-line-3 ; MMRC 50 m notice (secondary): https://www.rustomjee.com/blog/mumbai-metro-line-3/
- Namma Metro Pink Line: https://en.wikipedia.org/wiki/Pink_Line_(Namma_Metro) ; Blue Line: https://en.wikipedia.org/wiki/Blue_Line_(Namma_Metro) ; status (secondary): https://bengalurumetro.in/bangalore-metro-lines.html
- MahaRERA detailed certificate: https://therealtytoday.com/news/maharera-introduces-detailed-project-certificates-to-enhance-transparency-for-homebuyers ; how to read a project page: https://www.chandakgroup.com/blog/how-to-read-a-maharera-project-page-8-things-to-check-before-booking-a-home
- DST Geospatial Guidelines 2021: https://nishithdesai.com/research-and-articles/hotline/technology-law-analysis/maps-and-geospatial-data-in-india-regime-liberalized-4678 ; Rajya Sabha reply: https://rsdebate.nic.in/bitstream/123456789/734987/1/PQ_258_22122022_U1894_p460_p460.pdf

Added in v5.1 (international case studies — Rotterdam / Netherlands):
- Registration of multi-level property rights in 3D (Stoter et al. 2017): https://www.mdpi.com/2220-9964/6/6/158
- 3D cadastre in the Netherlands (Stoter et al. 2013): https://gdmc.nl/publications/2013/CEUS_3D_Cadastre_Netherlands.pdf
- Kadaster Labs, 3D Apartments pilot: https://labs.kadaster.nl/innovatie/3d-appartementen/3d-appartementen/
- Kadaster 3D Basisvoorziening: https://www.kadaster.nl/zakelijk/producten/geo-informatie/3d-producten/3d-basisvoorziening
- LoD2/LoD1 models for all Dutch buildings (BAG + AHN): https://arxiv.org/pdf/2201.01191
- NCG 3D Pilot final report (De Rotterdam BIM, Erasmus Bridge): https://www.gdmc.nl/publications/reports/NCG_52.pdf

⚠️ Not yet sourced in this pass, needed before public claims: exact Mumbai Metro Line 3 / Coastal Road tunnel alignment and depth figures; current BBMP/GBA plan-approval portal name and status; state-specific TDR/FSI rule text for Maharashtra (DCPR) and Karnataka.



---

## PART R — READINESS VERDICT, LIMITATIONS, MVP CUT, JUDGE Q&A (NEW IN v5.1)

### R1. Verdict 💡
- **Is the plan correct?** Structurally yes: every PS noun maps to an R-ID; the 3D ULPIN stays the centre; the Indian legal/institutional stack is the baseline; data honesty is explicit. Eight defects were found and fixed (changelog).
- **Is it ready to build the architecture?** **Yes — architecture-ready.** It is not yet *data-ready* or *legal-mapping-ready*. Close these before writing code (each is a ⚠️ elsewhere):
  1. Obtain ECCMA property-identifier document + NIC ULPIN technical note (grammar stays additive whatever they say).
  2. Freeze the four micro-zones on a map; pick 3–5 hero towers per zone from public RERA counts.
  3. Confirm Rotterdam AHN/BAG tile access + licence and the SLA airspace dataset's fields (drop the benchmark, not the honesty, if either fails).
  4. Read the Apartment Ownership Acts at section level; fix the U/C/P legal mapping.
  5. Reference test vectors for ISO 7064 MOD 37,36; pick a val3dity version.
  6. Decide yes/no on the real-capture micro-pilot (permissions first).

### R2. Limitations to own out loud

| Limitation | Why it exists | What we do |
|---|---|---|
| No real Indian LiDAR/as-built data | Not open; restricted; DPDP | Labelled real anchors + Rotterdam real-sensor benchmark + optional own capture; report the sim-to-real gap (§D0.7) |
| Synthetic-data circularity | Same author writes generator and detector | Separate code paths/seeds, hold-out defects (§M4); at least one real case if capture succeeds |
| No legal effect of 3D records | India has no air-right/subsurface title statute | `legal_basis_status` everywhere (§C10); U/C/P anchored to apartment-ownership law |
| ULPIN internals not public | Layout not on DoLR page | RID is additive; PROXY-ULPIN flagged (§C11) |
| Land is a State subject | Constitutional structure | Federated registry (§C12) |
| Under-construction infrastructure | Pink Line underground, Blue Line | "As-planned" framing only (§B3.2) |
| Breadth risk | 30 requirements, four data classes | MVP cut below; depth on identity + reconciliation |
| Time-boxed finals | Hackathon format ⚠️ verify SIH 2026 timing | Pre-compute heavy steps; demo a vertical slice |

### R3. MVP cut — what must work end to end

**Must (the vertical slice):** one hero tower per India zone → plan-derived expected model → simulated sensors → building/level extraction → 3D-ULPIN allocation (RID·NK·SA·check symbol) → ICT on a scripted remodel → validation with PASS/WARN/FAIL/UNVERIFIABLE → examiner view answering "what is below/above this parcel?" with a `data_provenance` badge on every object. Two state nodes (MH, KA) running the same grammar.

**Should:** conformance suite + collision test at scale; LADM/IFC/CityGML round-trip; stacked-infrastructure clearance query (BZ-1); reconciliation with explain objects; Rotterdam benchmark result; SLA airspace ingestion test.

**Could:** learned H3 delineation; adaptive tolerances from examiner decisions; real-capture micro-pilot; MZ-2/BZ-2.

**Won't (say so):** real Land Stack integration, legal title issuance, production-scale deployment, survey-grade claims.

### R4. Judge Q&A cheat-sheet

| Question | Answer in one breath |
|---|---|
| Where does your data come from? | §D0.5: real Indian anchors (footprints, RERA counts, SoI CORS class, statute schemas), real foreign LiDAR/3D-cadastre data for *algorithm* benchmarks, and labelled simulation for everything Indian that is restricted. Every object carries a provenance tag. |
| Why not just use Singapore's or the Dutch system? | They are case studies with an adopt/adapt/reject table (§B-CS.5, B-CS.8). India's apartment law, ULPIN, RERA and state land records are the baseline. |
| Why these areas? | Four micro-zones where high-rise density meets metro/utility infrastructure — the PS problem — chosen for real, nameable infrastructure and public data (§B3). |
| Doesn't NAKSHA already do this? | NAKSHA's pilot targets small towns and defers megacities (Frontiers 2026); we prototype the vertical/subsurface layer that follow-on phase needs (§B1.2). |
| Does Indian law recognise 3D title? | Apartment ownership yes (state Acts); air-right/subsurface title no — so we tag every right with `legal_basis_status` (§B1.4, §C10, §C0 Q3). |
| How does it work with existing IDs? | Crosswalk to CTS/PID/UPOR/RERA/ULPIN; RID anchored to the parent ULPIN (§C11, §C0 Q4). |
| How is it interoperable across states? | Central grammar, state-level registry nodes, verification by RID + geometry (§C12). |
| Who in government would actually issue and hold this? | DoLR/NIC set the national grammar and conformance suite; each state's Revenue Department / Directorate of Land Records is the issuing registry node — the same chain that rolled ULPIN out to 29 states (§C13.1–C13.2). |
| What's your rollout plan, and is it copied from Singapore/Netherlands? | Phased: standard-setting → two-state pilot → conformance gate → Land Stack integration → parallel legal catch-up (§C13.3). We take Singapore's/Netherlands' *phasing and single-standard* pattern, reject their single-agency structure, because land is a State subject here (§C13.4). |
| How do you know your AI works without real ground truth? | Known-answer simulation with hold-out defects + real-sensor benchmark + reported sim-to-real gap (§D0.7, §M4). |
| What if evidence is insufficient? | UNVERIFIABLE is a first-class result (§D2). |
| What would you do with real data access? | Swap the ingestion adapters; identity/validation layers are geometry-agnostic (§J4). |

### R5. Worthwhile additions that do not dilute the PS 💡
- Ship the grammar + test vectors + conformance suite as an open, versioned spec (strengthens R25).
- Keep a NAKSHA-style workflow in the console: tolerance → anomaly → field-verification task (mirrors the national programme's own process).
- Export utility/corridor layers in an open format so they could feed national infrastructure-planning platforms (e.g., PM Gati Shakti-style GIS) — a judgement about fit, not a sourced integration claim.
- Do not oversell: the claim is "a standard-shaped, verifiable 3D identity layer and validation pipeline, prototyped on named Indian zones", not "3D cadastre solved for India".
