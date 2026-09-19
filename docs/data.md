# 2. Pilot Micro-Zones & Data Sourcing Strategy

### 2.1 Micro-Zone Breakdown

#### 2.1.1 Mumbai Micro-Zones

| Zone | Description | PS Classes Exercised | Real Anchors | Caveats |
|------|------------|---------------------|-------------|---------|
| **MZ-1** Worli / Lower Parel / Mahalaxmi belt | Tall towers on former mill land; Aqua Line underground stations; MMRC 50 m approval zone; viaduct sections near Mahalaxmi/Jacob Circle | B, L, U, C, P, A (TDR/FSI), T (Aqua Line tunnel), E (viaduct), `restriction` volume | Aqua Line: 33.5 km, 26/27 stations underground; MCGM DP layers; MahaRERA project pages; Overture footprints | Exact tunnel chainage/depth simulated; route-level only |
| **MZ-2** BKC (stretch) | Business district with deep-basement offices; Aqua Line BKC station (opened May 2025) | B, L, U, T | Same as MZ-1 | Attempted only after MZ-1 vertical slice works |
| **MZ-3** Bandra-Kurla east / Kurla | Aqua Line **elevated** (not underground); SRA redevelopment towers (mixed free-sale + rehab-tenement); low-lying reclaimed ground | E (elevated corridor), B, L, U (SRA mixed-tenure) | MCGM GIS; MahaRERA for SRA/free-sale schemes; publicly reported elevated viaduct sections | SRA rehab-unit legal status unverified — treat as illustrative |
| **MZ-4** Marine Drive / Nariman Point / Fort / Churchgate | Heritage-protected, height-restricted precinct; deepest underground infrastructure in pilot; **T-over-T** case (Metro Line 3 + Coastal Road twin tunnels at different depths) | T (dense underground), S/B (heritage low-rise), restriction (heritage zone) | Metro Line 3 stations: Cuffe Parade, Colaba, Churchgate, Hutatma Chowk, CST; Coastal Road twin tunnels: ~2.07 km, 12.19 m diameter | Exact tunnel depths simulated; heritage boundary needs primary source |

#### 2.1.2 Bengaluru Micro-Zones

| Zone | Description | PS Classes Exercised | Real Anchors | Caveats |
|------|------------|---------------------|-------------|---------|
| **BZ-1** MG Road / Shivajinagar / Cantonment CBD | **Richest underground cluster:** Purple Line underground core + Green Line 3 underground stations + Pink Line tunnel (under construction); stacked multi-line, multi-depth underground | T (multi-line underground stack), E (Purple Line elevated), I (utilities), S (old dense parcels) | BMRCL alignment/station lists; e-Aasthi/e-khata; Purple underground: Cubbon Park, Vidhana Soudha, Central College, Majestic, KSR City; Green underground: Majestic (interchange), Chickpet, KR Market | Pink Line = as-planned only, never as-built; UPOR drone coverage of this exact zone not established |
| **BZ-2** ORR Bellandur / Marathahalli (secondary) | IT-corridor high-rises with podium parking/basements; Blue Line Phase 2A elevated (planned); lake/raja kaluve drain terrain | B, L, U, P, E (planned), I/T (drain conflict) | K-RERA project pages; Overture footprints; public drain/lake reporting | Drain alignments illustrative; Blue Line planned, not built |
| **BZ-3** Electronics City / Hosur Road corridor (stretch) | IT-park SEZ belt; large single-owner commercial towers; Yellow Line (elevated, operational 11 Aug 2025, 19.15 km, 16 stations) | E (elevated over commercial parcels), B, L, U | BMRCL Yellow Line alignment/station list; K-RERA/commercial disclosures; Overture footprints | Yellow Line elevated/at-grade split reported inconsistently — as-planned only |

#### 2.1.3 Full Namma Metro Coverage Across BZ Zones

| Line | Status | Character | Underground Stations | Carrying Zone |
|------|--------|-----------|---------------------|---------------|
| **Purple Line** (Line 1) | Operational, 43.49 km, 37 stations | Elevated + at-grade + ~4.8 km underground core | Cubbon Park, Vidhana Soudha, Central College, Majestic, KSR City | BZ-1 |
| **Green Line** (Line 2) | Operational, 33.46 km, 32 stations | Mostly elevated | Majestic (interchange), Chickpet, KR Market | BZ-1 |
| **Yellow Line** (Line 3) | Operational, 19.15 km, 16 stations | Predominantly elevated | None confirmed — E-class only | BZ-3 |
| **Pink Line** | Under construction | Underground core: Dairy Circle–Nagawara via MG Road/Shivajinagar/Cantonment | As-planned only | BZ-1 |
| **Blue Line Phase 2A** | Planned | Elevated over ORR | — | BZ-2 |

BZ-1 carries a genuine **T-over-T-over-T** case (Purple tunnel, Green tunnel, Pink tunnel crossing near Majestic/MG Road at different depths and dates).

---

### 2.2 Three-Tier Spatial Fidelity Model

| Tier | Contents | Geometry | Source | Purpose |
|------|----------|----------|--------|---------|
| **A — Hero Blocks** | 3–5 towers per zone (≤ ~20 total) | Full 3D: levels, units, commons, parking, basements, shafts; plan versions; injected defects | Real counts (floors, units, parking, wings) from public RERA pages + synthetic plans + simulated sensors | All H1–H4 evaluation, ICT scenarios, headline demo |
| **B — Context** | 30–100 surrounding buildings | LoD1 extrusions (box buildings) | Real footprints (Overture/OSM) + height priors (Open Buildings 2.5D) | Occlusion, adjacency, setback/overlap checks, realistic look |
| **C — Backdrop** | Rest of the zone | Footprints/parcels only | Real footprints | Map context |

Scalability (R24) is demonstrated separately with **geometry-free synthetic registry load** (10^6–10^7 RIDs), not by rendering.

---

### 2.3 Data Ledger Matrix

#### 2.3.1 REAL Sources (Indian)

| PS Input | Real Indian Source | City | Licence/Access | Role |
|----------|-------------------|------|---------------|------|
| GIS parcel layer | MCGM OneMCGM GIS; Karnataka UPOR/e-khata extents; Overture Maps footprints | Mumbai, Bengaluru | Public / ODbL / CC-BY-4.0 | Real footprints and approximate counts |
| Building floor plans | MCGM AutoDCR system description (format template); RERA carpet-area disclosure format | Mumbai | Public case study; format only | Schema and validation rules |
| DEM/DSM | Open SRTM/Cartosat-derived DEM; Bhuvan/NRSC openly downloadable tiles | Both | Public/open | Coarse ground reference |
| GNSS/CORS | SoI CORS station list (>1,100 stations, ~plus/minus 3 cm RTK) | National | Public statements | Real error-budget numbers |
| Corridor geometry | Public Namma Metro and Mumbai Metro Line 3 / Coastal Road alignments | Both | Public news/government disclosure | Real anchor geometry for E/T classes |
| Area tolerance | NAKSHA's 5% parcel-area tolerance | National | Public | Seed value for parameterised tolerance |
| Zoning layer | MCGM DP 2014–34 reservation categories | Mumbai | Public (OneMCGM GIS) | Backdrop layer for setback/height-cap checks |
| RERA structured counts | MahaRERA: buildings/wings, floors, unit counts, parking, CC/OC, sanctioned plans | Mumbai, Bengaluru | Public disclosure | Real counts parametrise Tier-A towers |
| Apartment law schema | Declaration / Deed fields (MH Apt. Act 1970, KA Apt. Act 1972) | Both states | Statute text | U/C/P + UDS field schema |
| Regulatory 3D buffer | MMRC 50 m approval zone around Aqua Line | Mumbai | Public notice (verify) | Real instance of `restriction` volume |
| Geospatial capture legality | DST Guidelines (15 Feb 2021); National Geospatial Policy (Dec 2022) | National | Public policy | Own-capture micro-pilot legally plausible |

#### 2.3.2 REAL-FOREIGN Benchmarks (Algorithms Only)

| Source | Country | What It Gives | Must NOT Be Used For |
|--------|---------|---------------|---------------------|
| Rotterdam AHN (open national LiDAR) | Netherlands | Real airborne LiDAR + real footprints for H1/D4 sensor-noise testing | Indian identities, law, or thresholds |
| Rotterdam BAG / 3D BAG | Netherlands | Building register, positional accuracy approx 30 cm | Legal model |
| Singapore SLA airspace parcels | Singapore | Real machine-readable 3D-cadastre objects for identifier conformance stress-test | Prefix scheme, strata legal regime |

#### 2.3.3 SIMULATED Elements

| Gap | Why Simulated | What Is Simulated | Ground Truth It Provides |
|-----|--------------|-------------------|------------------------|
| Interior unit partitions | Restricted CAD not obtainable | Parametric Indian-style apartment/commercial plan generator (RERA-conformant, AutoDCR-matched) | Exact known unit boundaries/volumes for H2/H3 labels |
| High-resolution point cloud | No open Indian building-scale LiDAR | Ray-cast simulator (flight-line geometry, range noise, scan-angle density, occlusion, glazing dropouts) over real footprints | Exact known building envelope/roof for H1 evaluation |
| Underground utilities | No open national dataset (confirmed absence) | Synthetic network (type, material, diameter, depth) with GPR-style noise under real corridor anchors | Exact known utility position for R8/R30 evaluation |
| Ownership/rights records | DPDP Act 2023 | Synthetic `Right` records with pseudonymised holders, LADM RRR + India-profile fields | Known rights graph for overlap-semantics evaluation |
| Defect/dispute cases | Not public in usable form | Injected defect taxonomy (28+ classes) on otherwise-realistic synthetic buildings | Known defect ground truth for detection curves |
| Georegistration ground truth | No field survey equipment | GNSS/CORS error-model simulator seeded with SoI's published accuracy class | Known true vs observed position |

---

### 2.4 Sim-to-Real Protocol

1. **H1 (building extraction):** Train on synthetic Indian scenes (optionally plus Rotterdam real tiles); evaluate on three sets side by side — held-out synthetic-Indian, Rotterdam-real, own-capture-real (if done). The *gap* between them is a reported finding.
2. **H2 (floor segmentation):** Pre-train on a public floor-plan dataset (e.g., CubiCasa5K) → fine-tune on synthetic Indian plans → test on a few real RERA plans. Expect a domain gap; report it.
3. **Identity, validation, reconciliation layers are geometry-agnostic:** their metrics (collisions, NK determinism, ICT accuracy, detection curves) do not need real sensor data (RQ5).
4. **Never blend provenance classes into one headline number.** Every table shows REAL-IN / REAL-FOREIGN / REAL-OWN / SYNTHETIC columns.

---

### 2.5 DPDP Act 2023 Compliance Strategy

| Requirement | Handling |
|------------|---------|
| No personal ownership data in identifiers | RID contains no owner data (P9); Right.holder pseudonymised by default |
| Consent for personal data processing | Synthetic rights records with pseudonymised holders; no real personal data used |
| Data minimisation | Only public counts and schema formats used from RERA; no restricted personal files |
| Pseudonymisation | Every `Right.holder` field is a pseudonym (synthetic UUID); no link to real persons |
