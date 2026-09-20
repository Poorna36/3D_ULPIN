// Mock data — Singapore buildings
// API contract: GET /api/buildings?city=singapore
// Focus: 3D Strata Titles Act, subsidiary lots, common property, subterranean utility networks, and SLA OneMap3D benchmark
// Coordinates: WGS84 EPSG:4326 (transformed from Singapore SVY21 EPSG:3414)
// Data label: DERIVED (buildings) & SYNTHETIC (subterranean infrastructure demo fixtures)
// Disclaimers: Prototype spatial identifiers only — not official Indian ULPIN or Singapore land title numbers.

const singaporeBuildings = [
  // ──────────────────────────────────────────────────────────────────────────
  // MARINA BAY FINANCIAL CENTRE & BAYFRONT CLUSTER
  // ──────────────────────────────────────────────────────────────────────────
  {
    building_id: "SGP-BLD-00001",
    name: "Marina Bay Financial Centre — Tower 3",
    city: "singapore",
    lat: 1.2790, lon: 103.8549,
    ground_elevation: 3.2, roof_elevation: 248.2, height: 245.0,
    floor_count: 50,
    source: "OneMap SLA 2024", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-MBF-b2c9d4e1f803", data_label: "DERIVED",
    bim_enabled: true,
    bim_standard: "IFC4 (CORENET X / SLA 3D Strata Cadastre)",
    sla_survey_plan: "CP/SLA/2024-MBFC3",
    provenance: {
      source_dataset: "OneMap SLA 2024 + URA Master Plan + CORENET X BIM",
      crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0",
      operator: "PROTOTYPE-PIPELINE", transformations: ["SVY21→WGS84", "DEM-elevation-merge", "IFC4→B-Rep"],
    },
    floors: [
      {
        floor_id: "SGP-BLD-00001-F00", level_index: 0, label: "Podium Grand Lobby & Retail Concourse", z_min: 3.2, z_max: 8.5, confidence: "DERIVED_HIGH", status: "VALID",
        strata_units: [
          {
            unit_id: "MK01-U0001R", name: "Ground Banking Atrium & Retail Wing", ifc_space: "IfcSpace:RetailBanking:00",
            gross_area_sqm: 480.0, net_internal_area_sqm: 442.0, share_value: "32/1000", ceiling_height: 5.3, tenure: "99-year Leasehold",
            boundary_type: "Physical Structural Curtain & Common Property",
            rooms: [{ name: "Main Banking Hall", area_sqm: 240.0 }, { name: "Client Lounge & Concierge", area_sqm: 110.0 }, { name: "Safe Deposit Vault", area_sqm: 92.0 }],
          },
        ],
      },
      {
        floor_id: "SGP-BLD-00001-F01", level_index: 1, label: "Floor 1 — Financial & Advisory Suites", z_min: 8.5, z_max: 13.0, confidence: "DERIVED_HIGH", status: "VALID",
        strata_units: [
          {
            unit_id: "MK01-U0101A", name: "Strata Suite 01-A (Corner Wealth Advisory)", ifc_space: "IfcSpace:CommercialUnit:01-A",
            gross_area_sqm: 168.4, net_internal_area_sqm: 154.2, share_value: "14/1000", ceiling_height: 3.8, tenure: "99-year Leasehold",
            boundary_type: "Physical 200mm RC Wall + Glass Curtain",
            rooms: [{ name: "Private Advisory Suite", area_sqm: 42.0 }, { name: "Executive Boardroom", area_sqm: 38.5 }, { name: "Trading Workstations", area_sqm: 54.7 }, { name: "Server Vault", area_sqm: 19.0 }],
          },
          {
            unit_id: "MK01-U0102B", name: "Strata Suite 01-B (Trading & Tech Hub)", ifc_space: "IfcSpace:CommercialUnit:01-B",
            gross_area_sqm: 215.0, net_internal_area_sqm: 198.6, share_value: "18/1000", ceiling_height: 3.8, tenure: "99-year Leasehold",
            boundary_type: "Physical Drywall + Structural Column Core",
            rooms: [{ name: "Open Collaborative Floor", area_sqm: 112.0 }, { name: "Conference Alpha", area_sqm: 44.6 }, { name: "Pantry & Breakout", area_sqm: 26.0 }, { name: "Data Center (UPS Redundant)", area_sqm: 16.0 }],
          },
        ],
      },
      {
        floor_id: "SGP-BLD-00001-F25", level_index: 25, label: "Floor 25 — Sky Terrace & Wellness Garden", z_min: 118.0, z_max: 122.5, confidence: "DERIVED_HIGH", status: "VALID",
        strata_units: [
          {
            unit_id: "MK01-U2501S", name: "Common Property Sky Terrace", ifc_space: "IfcSpace:Amenity:SkyTerrace",
            gross_area_sqm: 320.0, net_internal_area_sqm: 298.0, share_value: "Common Property (MCST 3812)", ceiling_height: 4.5, tenure: "Common Property",
            boundary_type: "Open Air Parcel with LADM Volumetric Boundary",
            rooms: [{ name: "Landscaped Sky Lounge", area_sqm: 180.0 }, { name: "Observation Walkway", area_sqm: 85.0 }, { name: "Service Plant Buffer", area_sqm: 33.0 }],
          },
        ],
      },
      {
        floor_id: "SGP-BLD-00001-F50", level_index: 50, label: "Floor 50 — Executive Penthouse Boardroom", z_min: 243.0, z_max: 248.2, confidence: "DERIVED_HIGH", status: "VALID",
        strata_units: [
          {
            unit_id: "MK01-U5001P", name: "Apex Executive Penthouse Suite", ifc_space: "IfcSpace:ExecutivePenthouse:50",
            gross_area_sqm: 385.0, net_internal_area_sqm: 362.0, share_value: "35/1000", ceiling_height: 4.8, tenure: "99-year Leasehold",
            boundary_type: "Physical 250mm Reinforced Structural Wall",
            rooms: [{ name: "Global Boardroom (360° Marina Panorama)", area_sqm: 160.0 }, { name: "Private Dining Salon", area_sqm: 78.0 }, { name: "Executive Chairman Office", area_sqm: 82.0 }, { name: "Helipad Access Lobby", area_sqm: 42.0 }],
          },
        ],
      },
      {
        floor_id: "SGP-BLD-00001-B1", level_index: -1, label: "Basement 1 — Subterranean MRT Concourse Link", z_min: -1.5, z_max: 3.2, confidence: "DERIVED_HIGH", status: "VALID",
        strata_units: [
          {
            unit_id: "MK01-SUB-B101", name: "Downtown MRT Subterranean Transit Link", ifc_space: "IfcSpace:SubterraneanInfrastructure:TransitLink",
            gross_area_sqm: 420.0, net_internal_area_sqm: 395.0, share_value: "Statutory SLA Subterranean Easement", ceiling_height: 4.2, tenure: "State Land Subterranean Lot",
            boundary_type: "Underground Cast-in-place Diaphragm Wall",
            rooms: [{ name: "Subterranean Pedestrian Concourse", area_sqm: 280.0 }, { name: "Faregate & Ticketing Hub", area_sqm: 75.0 }, { name: "District Cooling Distribution Vault", area_sqm: 40.0 }],
          },
        ],
      },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range", label: "Vertical Range", status: "VALID" },
      { id: "parent-rel", label: "Strata Lot Relationship", status: "VALID" },
      { id: "overlap", label: "No Strata Overlaps", status: "VALID" },
      { id: "watertight", label: "Watertight Solid", status: "VALID" },
      { id: "id-unique", label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-BLD-00002",
    name: "Marina Bay Financial Centre — Tower 1",
    city: "singapore",
    lat: 1.2801, lon: 103.8533,
    ground_elevation: 3.2, roof_elevation: 189.2, height: 186.0,
    floor_count: 33,
    source: "OneMap SLA", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-MBF-a1c8e3f2b405", data_label: "DERIVED",
    provenance: { source_dataset: "OneMap SLA 2024", crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["SVY21→WGS84"] },
    floors: [
      { floor_id: "SGP-BLD-00002-F00", level_index: 0,  label: "Ground Banking Atrium", z_min: 3.2,   z_max: 8.5,   confidence: "DERIVED_HIGH", status: "VALID" },
      { floor_id: "SGP-BLD-00002-F33", level_index: 33, label: "Floor 33 — Roof Plant",  z_min: 181.0, z_max: 186.0, confidence: "DERIVED",      status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "parent-rel", label: "Strata Lot Relationship", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-BLD-00003",
    name: "Marina Bay Financial Centre — Tower 2",
    city: "singapore",
    lat: 1.2806, lon: 103.8541,
    ground_elevation: 3.2, roof_elevation: 242.2, height: 239.0,
    floor_count: 50,
    source: "OneMap SLA", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-MBF-c3e0f5a4d617", data_label: "DERIVED",
    provenance: { source_dataset: "OneMap SLA 2024", crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["SVY21→WGS84"] },
    floors: [
      { floor_id: "SGP-BLD-00003-F00", level_index: 0, label: "Ground Lobby", z_min: 3.2, z_max: 8.0, confidence: "DERIVED_HIGH", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-BLD-00004",
    name: "Marina Bay Sands — Towers & SkyPark",
    city: "singapore",
    lat: 1.2834, lon: 103.8607,
    ground_elevation: 3.0, roof_elevation: 203.0, height: 200.0,
    floor_count: 57,
    source: "OneMap SLA 2024", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-MBS-e4f1a2b3c4d5", data_label: "DERIVED",
    provenance: {
      source_dataset: "OneMap SLA 2024 + URA Master Plan", crs: "EPSG:3414",
      acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE",
      transformations: ["SVY21→WGS84", "DEM-elevation-merge"]
    },
    floors: [
      { floor_id: "SGP-BLD-00004-F00", level_index: 0,  label: "Hotel Grand Atrium (Tower 1-3)", z_min: 3.0,   z_max: 12.0,  confidence: "DERIVED_HIGH", status: "VALID" },
      { floor_id: "SGP-BLD-00004-F22", level_index: 22, label: "Floor 22 Guest Suites",          z_min: 78.0,  z_max: 81.5,  confidence: "DERIVED",      status: "VALID" },
      { floor_id: "SGP-BLD-00004-F57", level_index: 57, label: "Cantilevered Sands SkyPark Deck",z_min: 195.0, z_max: 203.0, confidence: "DERIVED_HIGH", status: "VALID" },
      { floor_id: "SGP-BLD-00004-B1",  level_index: -1, label: "Shoppes at Marina Bay Sands B1",  z_min: -3.0,  z_max: 3.0,   confidence: "DERIVED",      status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid",  label: "Geometry Valid",             status: "VALID" },
      { id: "z-range",     label: "Vertical Range",             status: "VALID" },
      { id: "parent-rel",  label: "Strata Lot Relationship",    status: "VALID" },
      { id: "overlap",     label: "No Strata Overlaps",         status: "VALID" },
      { id: "watertight",  label: "Watertight Cantilever Solid", status: "VALID" },
      { id: "id-unique",   label: "Identifier Uniqueness",      status: "VALID" },
      { id: "provenance",  label: "Provenance Complete",        status: "VALID" },
    ],
  },
  {
    building_id: "SGP-BLD-00005",
    name: "Marina One — West Tower (Commercial)",
    city: "singapore",
    lat: 1.2770, lon: 103.8528,
    ground_elevation: 3.0, roof_elevation: 143.0, height: 140.0,
    floor_count: 30,
    source: "OneMap SLA", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-MRO-f5a2b3c4d5e6", data_label: "DERIVED",
    provenance: { source_dataset: "OneMap SLA 2024", crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["SVY21→WGS84"] },
    floors: [
      { floor_id: "SGP-BLD-00005-F00", level_index: 0, label: "Green Heart Central Plaza", z_min: 3.0, z_max: 8.5, confidence: "DERIVED_HIGH", status: "VALID" },
      { floor_id: "SGP-BLD-00005-F30", level_index: 30,label: "Floor 30 Commercial Office", z_min: 135.0, z_max: 140.0, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-BLD-00006",
    name: "Marina One — East Tower (Residences)",
    city: "singapore",
    lat: 1.2776, lon: 103.8538,
    ground_elevation: 3.0, roof_elevation: 143.0, height: 140.0,
    floor_count: 34,
    source: "OneMap SLA", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-MRO-a6b3c4d5e6f7", data_label: "DERIVED",
    provenance: { source_dataset: "OneMap SLA 2024", crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["SVY21→WGS84"] },
    floors: [
      { floor_id: "SGP-BLD-00006-F00", level_index: 0, label: "Residential Foyer", z_min: 3.0, z_max: 7.5, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-BLD-00007",
    name: "Ocean Financial Centre",
    city: "singapore",
    lat: 1.2830, lon: 103.8525,
    ground_elevation: 2.8, roof_elevation: 247.8, height: 245.0,
    floor_count: 43,
    source: "OneMap SLA", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-OFC-b7c4d5e6f7a8", data_label: "DERIVED",
    provenance: { source_dataset: "OneMap SLA 2024", crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["SVY21→WGS84"] },
    floors: [
      { floor_id: "SGP-BLD-00007-F00", level_index: 0, label: "Solar Wall Main Lobby", z_min: 2.8, z_max: 8.0, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // RAFFLES PLACE & TANJONG PAGAR CBD
  // ──────────────────────────────────────────────────────────────────────────
  {
    building_id: "SGP-BLD-00008",
    name: "Guoco Tower (Tanjong Pagar Centre)",
    city: "singapore",
    lat: 1.2764, lon: 103.8457,
    ground_elevation: 4.0, roof_elevation: 287.7, height: 283.7,
    floor_count: 68,
    source: "OneMap SLA 2024", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-GCT-c8d5e6f7a8b9", data_label: "DERIVED",
    provenance: {
      source_dataset: "OneMap SLA 2024 + URA Master Plan", crs: "EPSG:3414",
      acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE",
      transformations: ["SVY21→WGS84", "DEM-elevation-merge"]
    },
    floors: [
      { floor_id: "SGP-BLD-00008-F00", level_index: 0,  label: "Ground Urban Park & Atrium", z_min: 4.0,   z_max: 9.5,   confidence: "DERIVED_HIGH", status: "VALID" },
      { floor_id: "SGP-BLD-00008-F01", level_index: 1,  label: "Offices Level 1",           z_min: 9.5,   z_max: 14.0,  confidence: "DERIVED_HIGH", status: "VALID" },
      { floor_id: "SGP-BLD-00008-F39", level_index: 39, label: "Floor 39 Wallich Residence",z_min: 165.0, z_max: 169.0, confidence: "DERIVED",      status: "VALID" },
      { floor_id: "SGP-BLD-00008-F68", level_index: 68, label: "Super Penthouse (Summit)",  z_min: 279.0, z_max: 283.7, confidence: "DERIVED_HIGH", status: "VALID" },
      { floor_id: "SGP-BLD-00008-B1",  level_index: -1, label: "Direct MRT Concourse B1",   z_min: -2.0,  z_max: 4.0,   confidence: "DERIVED_HIGH", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid",  label: "Geometry Valid",              status: "VALID" },
      { id: "z-range",     label: "Vertical Range (Tallest SG)", status: "VALID" },
      { id: "parent-rel",  label: "Strata Lot Relationship",     status: "VALID" },
      { id: "overlap",     label: "No Strata Overlaps",          status: "VALID" },
      { id: "watertight",  label: "Watertight Solid",            status: "VALID" },
      { id: "id-unique",   label: "Identifier Uniqueness",       status: "VALID" },
      { id: "provenance",  label: "Provenance Complete",         status: "VALID" },
    ],
  },
  {
    building_id: "SGP-BLD-00009",
    name: "One Raffles Place — Tower 1",
    city: "singapore",
    lat: 1.2842, lon: 103.8512,
    ground_elevation: 2.8, roof_elevation: 283.8, height: 281.0,
    floor_count: 63,
    source: "OneMap SLA", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-ORP-d4f0a8c2b119", data_label: "DERIVED",
    provenance: {
      source_dataset: "OneMap SLA 2024", crs: "EPSG:3414",
      acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE",
      transformations: ["SVY21→WGS84"]
    },
    floors: [
      { floor_id: "SGP-BLD-00009-F00", level_index: 0,  label: "Ground Floor Atrium", z_min: 2.8,   z_max: 7.5,   confidence: "DERIVED_HIGH", status: "VALID" },
      { floor_id: "SGP-BLD-00009-F63", level_index: 63, label: "Floor 63 Rooftop Bar", z_min: 275.0, z_max: 281.0, confidence: "DERIVED_HIGH", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-BLD-00010",
    name: "One Raffles Place — Tower 2",
    city: "singapore",
    lat: 1.2847, lon: 103.8518,
    ground_elevation: 2.8, roof_elevation: 211.8, height: 209.0,
    floor_count: 38,
    source: "OneMap SLA", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-ORP-e9f6a7b8c9d0", data_label: "DERIVED",
    provenance: { source_dataset: "OneMap SLA 2024", crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["SVY21→WGS84"] },
    floors: [
      { floor_id: "SGP-BLD-00010-F00", level_index: 0, label: "Ground Lobby", z_min: 2.8, z_max: 7.5, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-BLD-00011",
    name: "Republic Plaza",
    city: "singapore",
    lat: 1.2832, lon: 103.8506,
    ground_elevation: 2.8, roof_elevation: 282.8, height: 280.0,
    floor_count: 66,
    source: "OneMap SLA", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-RPZ-f0a7b8c9d0e1", data_label: "DERIVED",
    provenance: { source_dataset: "OneMap SLA 2024", crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["SVY21→WGS84"] },
    floors: [
      { floor_id: "SGP-BLD-00011-F00", level_index: 0,  label: "Ground 4-Storey Atrium", z_min: 2.8,   z_max: 14.5,  confidence: "DERIVED", status: "VALID" },
      { floor_id: "SGP-BLD-00011-F66", level_index: 66, label: "Floor 66 Sky Club",     z_min: 274.0, z_max: 280.0, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-BLD-00012",
    name: "UOB Plaza One",
    city: "singapore",
    lat: 1.2855, lon: 103.8510,
    ground_elevation: 2.8, roof_elevation: 282.8, height: 280.0,
    floor_count: 67,
    source: "OneMap SLA", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-UOB-a1b8c9d0e1f2", data_label: "DERIVED",
    provenance: { source_dataset: "OneMap SLA 2024", crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["SVY21→WGS84"] },
    floors: [
      { floor_id: "SGP-BLD-00012-F00", level_index: 0, label: "Singapore River Promenade Lobby", z_min: 2.8, z_max: 8.5, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-BLD-00013",
    name: "CapitaSpring (88 Market St)",
    city: "singapore",
    lat: 1.2843, lon: 103.8500,
    ground_elevation: 3.0, roof_elevation: 283.0, height: 280.0,
    floor_count: 51,
    source: "OneMap SLA 2024", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-CPS-b2c9d0e1f2a3", data_label: "DERIVED",
    provenance: {
      source_dataset: "OneMap SLA 2024 + URA Master Plan", crs: "EPSG:3414",
      acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE",
      transformations: ["SVY21→WGS84"]
    },
    floors: [
      { floor_id: "SGP-BLD-00013-F00", level_index: 0,  label: "Ground Public Atrium",       z_min: 3.0,   z_max: 9.0,   confidence: "DERIVED_HIGH", status: "VALID" },
      { floor_id: "SGP-BLD-00013-F17", level_index: 17, label: "Green Oasis Sky Garden L17",z_min: 98.0,  z_max: 104.0, confidence: "DERIVED_HIGH", status: "VALID" },
      { floor_id: "SGP-BLD-00013-F20", level_index: 20, label: "Green Oasis Sky Garden L20",z_min: 114.0, z_max: 120.0, confidence: "DERIVED_HIGH", status: "VALID" },
      { floor_id: "SGP-BLD-00013-F51", level_index: 51, label: "1-Arden Rooftop Urban Farm", z_min: 274.0, z_max: 280.0, confidence: "DERIVED_HIGH", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "parent-rel", label: "Strata Lot Relationship", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-BLD-00014",
    name: "CapitaGreen",
    city: "singapore",
    lat: 1.2820, lon: 103.8508,
    ground_elevation: 3.0, roof_elevation: 245.0, height: 242.0,
    floor_count: 40,
    source: "OneMap SLA", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-CPG-c3d0e1f2a3b4", data_label: "DERIVED",
    provenance: { source_dataset: "OneMap SLA 2024", crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["SVY21→WGS84"] },
    floors: [
      { floor_id: "SGP-BLD-00014-F00", level_index: 0, label: "Botanical Double-Skin Lobby", z_min: 3.0, z_max: 8.5, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-BLD-00015",
    name: "Asia Square — Tower 1",
    city: "singapore",
    lat: 1.2785, lon: 103.8511,
    ground_elevation: 3.2, roof_elevation: 232.2, height: 229.0,
    floor_count: 43,
    source: "OneMap SLA", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-ASQ-d4e1f2a3b4c5", data_label: "DERIVED",
    provenance: { source_dataset: "OneMap SLA 2024", crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["SVY21→WGS84"] },
    floors: [
      { floor_id: "SGP-BLD-00015-F00", level_index: 0, label: "The Cube Covered Square", z_min: 3.2, z_max: 9.0, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-BLD-00016",
    name: "Asia Square — Tower 2 (The Westin)",
    city: "singapore",
    lat: 1.2790, lon: 103.8520,
    ground_elevation: 3.2, roof_elevation: 224.2, height: 221.0,
    floor_count: 46,
    source: "OneMap SLA", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-ASQ-e5f2a3b4c5d6", data_label: "DERIVED",
    provenance: { source_dataset: "OneMap SLA 2024", crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["SVY21→WGS84"] },
    floors: [
      { floor_id: "SGP-BLD-00016-F00", level_index: 0, label: "Hotel & Office Grand Lobby", z_min: 3.2, z_max: 9.0, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // DUXTON & CIVIC DISTRICT (Strata Housing & Government)
  // ──────────────────────────────────────────────────────────────────────────
  {
    building_id: "SGP-BLD-00017",
    name: "The Pinnacle@Duxton (Towers 1A-1G)",
    city: "singapore",
    lat: 1.2772, lon: 103.8415,
    ground_elevation: 6.0, roof_elevation: 162.0, height: 156.0,
    floor_count: 50,
    source: "OneMap SLA 2024", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-PIN-f6a3b4c5d6e7", data_label: "DERIVED",
    provenance: {
      source_dataset: "OneMap SLA 2024 + HDB Cadastre", crs: "EPSG:3414",
      acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE",
      transformations: ["SVY21→WGS84"]
    },
    floors: [
      { floor_id: "SGP-BLD-00017-F00", level_index: 0,  label: "Ground Plaza & Food Court", z_min: 6.0,   z_max: 10.5,  confidence: "DERIVED_HIGH", status: "VALID" },
      { floor_id: "SGP-BLD-00017-F26", level_index: 26, label: "Skybridge 1 (500m Loop)",  z_min: 86.0,  z_max: 90.5,  confidence: "DERIVED_HIGH", status: "VALID" },
      { floor_id: "SGP-BLD-00017-F50", level_index: 50, label: "Skybridge 2 (Viewing Deck)",z_min: 156.0, z_max: 162.0, confidence: "DERIVED_HIGH", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "parent-rel", label: "HDB Strata Lot Relationship", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-BLD-00018",
    name: "Singapore Land Authority (SLA) — Revenue House",
    city: "singapore",
    lat: 1.3182, lon: 103.8446,
    ground_elevation: 12.0, roof_elevation: 110.0, height: 98.0,
    floor_count: 24,
    source: "OneMap SLA", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-SLA-a7b4c5d6e7f8", data_label: "DERIVED",
    provenance: { source_dataset: "OneMap SLA 2024", crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["SVY21→WGS84"] },
    floors: [
      { floor_id: "SGP-BLD-00018-F00", level_index: 0,  label: "SLA Land Titles Customer Service", z_min: 12.0,  z_max: 17.5,  confidence: "DERIVED_HIGH", status: "VALID" },
      { floor_id: "SGP-BLD-00018-F24", level_index: 24, label: "Chief Executive Cadastral Suite",  z_min: 104.0, z_max: 110.0, confidence: "DERIVED_HIGH", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-BLD-00019",
    name: "Victoria Concert Hall (Heritage Air-Rights)",
    city: "singapore",
    lat: 1.2882, lon: 103.8520,
    ground_elevation: 3.5, roof_elevation: 57.5, height: 54.0,
    floor_count: 4,
    source: "OneMap SLA", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-VCH-b8c5d6e7f8a9", data_label: "DERIVED",
    provenance: { source_dataset: "OneMap SLA 2024", crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["SVY21→WGS84"] },
    floors: [
      { floor_id: "SGP-BLD-00019-F00", level_index: 0, label: "Heritage Concert Foyer", z_min: 3.5, z_max: 12.0, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SUBTERRANEAN 3D STRATA INFRASTRUCTURE (Subsurface Cadastre)
  // ──────────────────────────────────────────────────────────────────────────
  {
    building_id: "SGP-INF-00001",
    name: "Bayfront MRT Underground Interchange (Circle & Downtown Lines)",
    city: "singapore",
    lat: 1.2818, lon: 103.8590,
    ground_elevation: 3.0, roof_elevation: 3.0, height: -22.5,
    floor_count: 4,
    source: "SYNTHETIC", confidence: "SYNTHETIC", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-UG-MRT-c5a1e7f02d88", data_label: "SYNTHETIC",
    is_underground: true,
    provenance: {
      source_dataset: "SLA Subterranean 3D Cadastre Fixture v0.1",
      crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0",
      operator: "PROTOTYPE-PIPELINE", transformations: [],
    },
    floors: [
      { floor_id: "SGP-INF-00001-U1", level_index: -1, label: "Underground Mezzanine & Concourse", z_min: -2.5,  z_max: 3.0,  confidence: "SYNTHETIC", status: "VALID" },
      { floor_id: "SGP-INF-00001-U2", level_index: -2, label: "Circle Line Upper Platform",       z_min: -9.5,  z_max: -2.5, confidence: "SYNTHETIC", status: "VALID" },
      { floor_id: "SGP-INF-00001-U3", level_index: -3, label: "Downtown Line Lower Platform",     z_min: -19.5, z_max: -9.5, confidence: "SYNTHETIC", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid",   status: "VALID" },
      { id: "z-range",    label: "Vertical Range",   status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-INF-00002",
    name: "Raffles Place MRT Subterranean 4-Tier Complex",
    city: "singapore",
    lat: 1.2838, lon: 103.8515,
    ground_elevation: 2.8, roof_elevation: 2.8, height: -28.0,
    floor_count: 4,
    source: "SYNTHETIC", confidence: "SYNTHETIC", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-UG-MRT-d6b2f8a13e99", data_label: "SYNTHETIC",
    is_underground: true,
    provenance: { source_dataset: "LTA / SLA Subsurface Cadastre Fixture", crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: [] },
    floors: [
      { floor_id: "SGP-INF-00002-U1", level_index: -1, label: "Underground Shopping Concourse", z_min: -3.0,  z_max: 2.8,  confidence: "SYNTHETIC", status: "VALID" },
      { floor_id: "SGP-INF-00002-U2", level_index: -2, label: "Upper Cross-Platform Deck",      z_min: -14.0, z_max: -3.0, confidence: "SYNTHETIC", status: "VALID" },
      { floor_id: "SGP-INF-00002-U3", level_index: -3, label: "Lower Cross-Platform Deck",      z_min: -25.2, z_max: -14.0,confidence: "SYNTHETIC", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-INF-00003",
    name: "Marina Bay Underground Pedestrian Network (UPN)",
    city: "singapore",
    lat: 1.2782, lon: 103.8533,
    ground_elevation: 3.2, roof_elevation: 3.2, height: -7.5,
    floor_count: 1,
    source: "SYNTHETIC", confidence: "SYNTHETIC", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-UG-UPN-e7c3a9b24f00", data_label: "SYNTHETIC",
    is_underground: true,
    provenance: { source_dataset: "URA Subsurface Pedestrian Network", crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: [] },
    floors: [
      { floor_id: "SGP-INF-00003-U1", level_index: -1, label: "Air-Conditioned Pedestrian Spine", z_min: -4.3, z_max: 3.2, confidence: "SYNTHETIC", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-INF-00004",
    name: "Marina Bay Common Services Tunnel (CST)",
    city: "singapore",
    lat: 1.2795, lon: 103.8540,
    ground_elevation: 3.0, roof_elevation: 3.0, height: -16.0,
    floor_count: 2,
    source: "SYNTHETIC", confidence: "SYNTHETIC", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-UG-CST-f8d4b0c35a11", data_label: "SYNTHETIC",
    is_underground: true,
    provenance: { source_dataset: "PUB / SP Group Multi-Utility Tunnel Cadastre", crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: [] },
    floors: [
      { floor_id: "SGP-INF-00004-U1", level_index: -1, label: "Electrical 66kV & Telecom Chute", z_min: -6.0,  z_max: 3.0,  confidence: "SYNTHETIC", status: "VALID" },
      { floor_id: "SGP-INF-00004-U2", level_index: -2, label: "District Cooling & Potable Mains",z_min: -13.0, z_max: -6.0, confidence: "SYNTHETIC", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
    ],
  },
  {
    building_id: "SGP-INF-00005",
    name: "Jurong Rock Caverns (Subterranean Liquid Storage)",
    city: "singapore",
    lat: 1.2580, lon: 103.7120,
    ground_elevation: 2.5, roof_elevation: 2.5, height: -130.0,
    floor_count: 3,
    source: "SYNTHETIC", confidence: "SYNTHETIC", validation_status: "VALID",
    prototype_3d_id: "3D-SGP-UG-JRC-a9e5c1d46b22", data_label: "SYNTHETIC",
    is_underground: true,
    provenance: { source_dataset: "JTC Deep Rock Cavern Subsurface Profile", crs: "EPSG:3414", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: [] },
    floors: [
      { floor_id: "SGP-INF-00005-U1", level_index: -1, label: "Vertical Access Shaft (-60m)",    z_min: -60.0,  z_max: 2.5,   confidence: "SYNTHETIC", status: "VALID" },
      { floor_id: "SGP-INF-00005-U2", level_index: -2, label: "Operation Gallery & Pump Room",   z_min: -100.0, z_max: -60.0, confidence: "SYNTHETIC", status: "VALID" },
      { floor_id: "SGP-INF-00005-U3", level_index: -3, label: "Deep Hydrocarbon Storage Cavern", z_min: -127.5, z_max: -100.0,confidence: "SYNTHETIC", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range (Deep Subsurface)", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
    ],
  },
];

export default singaporeBuildings;
