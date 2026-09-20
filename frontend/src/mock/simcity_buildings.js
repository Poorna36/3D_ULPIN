// Mock data — Riverview Metropolis (SimCity 3D Digital Twin Sandbox)
// Demonstrates 3D ULPIN application in municipal planning, R-C-I zoning cadastre,
// tax yield evaluation, and real-time smart infrastructure management.

export const simCityParcels = [
  {
    parcel_id: "SC-PRC-CIVIC-001",
    city: "simcity",
    zoning: "CIVIC_GOVERNMENT",
    land_value_sqm: 4800,
    coordinates: [[-20, -20], [20, -20], [20, 20], [-20, 20]]
  },
  {
    parcel_id: "SC-PRC-COM-DOWNTOWN-01",
    city: "simcity",
    zoning: "COMMERCIAL_HIGH_DENSITY",
    land_value_sqm: 8500,
    coordinates: [[-90, -80], [-30, -80], [-30, -20], [-90, -20]]
  },
  {
    parcel_id: "SC-PRC-COM-MALL-02",
    city: "simcity",
    zoning: "COMMERCIAL_RETAIL",
    land_value_sqm: 6200,
    coordinates: [[-90, 20], [-30, 20], [-30, 80], [-90, 80]]
  },
  {
    parcel_id: "SC-PRC-RES-APEX-01",
    city: "simcity",
    zoning: "RESIDENTIAL_HIGH_DENSITY",
    land_value_sqm: 7800,
    coordinates: [[30, -90], [90, -90], [90, -30], [30, -30]]
  },
  {
    parcel_id: "SC-PRC-RES-SUBURB-02",
    city: "simcity",
    zoning: "RESIDENTIAL_LOW_DENSITY",
    land_value_sqm: 3400,
    coordinates: [[110, -80], [180, -80], [180, 20], [110, 20]]
  },
  {
    parcel_id: "SC-PRC-IND-CLEANTECH-01",
    city: "simcity",
    zoning: "INDUSTRIAL_LIGHT",
    land_value_sqm: 2900,
    coordinates: [[-180, -90], [-110, -90], [-110, -20], [-180, -20]]
  },
  {
    parcel_id: "SC-PRC-IND-ENERGY-02",
    city: "simcity",
    zoning: "INFRASTRUCTURE_UTILITIES",
    land_value_sqm: 1800,
    coordinates: [[-190, 20], [-110, 20], [-110, 90], [-190, 90]]
  }
];

export const simCityBuildings = [
  {
    building_id: "SC-BLD-00001",
    name: "Riverview City Hall & Municipal Court",
    city: "simcity",
    zone: "Civic & Governance (Zone C-1)",
    zone_code: "CIVIC",
    lat: 37.7749,
    lon: -122.4194,
    ground_elevation: 10.0,
    roof_elevation: 68.0,
    height: 58.0,
    floor_count: 8,
    source: "Municipal Cadastral BIM Registry",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      occupancy_live: 680,
      energy_kwh_realtime: 145.2,
      hvac_efficiency_cop: 5.1,
      structural_drift_mm: 0.2,
      smart_contract_status: "ACTIVE_MUNICIPAL_CHARTER",
      tax_yield_annual: "§0 (Public Exempt)",
      approval_contribution: "+8.4% Public Trust"
    },
    canonical_rid: "SC0001-BLD-CIV01-7",
    natural_key: {
      digest: "NK-SHA256-SC-CITYHALL-LOD4-B32",
      locator: "0x3A1B2C3D4E5F6071",
      version: 1
    },
    spatial_address: {
      morton_63: "0x3A1B2C3D4E5F6071",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "Central Plaza Heritage Parcel", rid: "SC0001-PRC-S001-3", status: "VALID" },
      { cls: "B", name: "City Hall Classical Envelope", rid: "SC0001-BLD-B001-7", status: "VALID" },
      { cls: "C", name: "Rotunda Public Forum & Council Chambers", rid: "SC0001-COM-C001-1", status: "VALID" },
      { cls: "I", name: "Municipal Fiber Optic Core", rid: "SC0001-INF-I001-9", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "SC01-F01",
        level_index: 0,
        label: "Ground Floor — Public Service Forum & Atrium",
        z_min: 10.0,
        z_max: 16.5,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "SC01-U01-FORUM",
            name: "Mayor's Public Citizen Forum",
            ifc_space: "IfcSpace:Civic:PublicForum",
            gross_area_sqm: 1250.0,
            share_value: "500/1000",
            rooms: [
              { name: "Public Registry Desks", area_sqm: 750.0 },
              { name: "Ceremonial Rotunda & Fountain", area_sqm: 500.0 }
            ]
          }
        ]
      },
      {
        floor_id: "SC01-F04",
        level_index: 3,
        label: "Floor 4 — City Council Chamber & Mayor's Office",
        z_min: 28.0,
        z_max: 36.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "SC01-U04-COUNCIL",
            name: "Metropolitan Council Chamber",
            ifc_space: "IfcSpace:Governance:Council",
            gross_area_sqm: 980.0,
            share_value: "500/1000",
            rooms: [
              { name: "Council Assembly Hall", area_sqm: 620.0 },
              { name: "Executive Mayor Suite", area_sqm: 360.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "SC-BLD-00002",
    name: "SimBank Financial Tower",
    city: "simcity",
    zone: "Commercial High-Density (Zone C-3)",
    zone_code: "COMMERCIAL",
    lat: 37.7760,
    lon: -122.4210,
    ground_elevation: 10.0,
    roof_elevation: 148.0,
    height: 138.0,
    floor_count: 42,
    source: "Commercial CAD Strata Filing",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      occupancy_live: 3840,
      energy_kwh_realtime: 540.8,
      hvac_efficiency_cop: 5.4,
      structural_drift_mm: 0.8,
      smart_contract_status: "ACTIVE_DEED_REGISTERED",
      tax_yield_annual: "§184,200/yr",
      approval_contribution: "+4.2% Commercial Growth"
    },
    canonical_rid: "SC0002-BLD-COM02-4",
    natural_key: {
      digest: "NK-SHA256-SC-SIMBANK-LOD4-B32",
      locator: "0x3B2C3D4E5F607182",
      version: 1
    },
    spatial_address: {
      morton_63: "0x3B2C3D4E5F607182",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "Downtown Financial Lot 02", rid: "SC0002-PRC-S002-8", status: "VALID" },
      { cls: "B", name: "SimBank Glass Tower Envelope", rid: "SC0002-BLD-B002-4", status: "VALID" },
      { cls: "U", name: "Investment Banking Trading Suites", rid: "SC0002-UNT-U024-1", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "SC02-F00",
        level_index: 0,
        label: "Ground Banking Concourse & Vault",
        z_min: 10.0,
        z_max: 18.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "SC02-U00-BANK",
            name: "Flagship Retail Banking & Vault",
            ifc_space: "IfcSpace:Commercial:Bank",
            gross_area_sqm: 1400.0,
            share_value: "100/1000",
            rooms: [
              { name: "Public Banking Hall", area_sqm: 900.0 },
              { name: "Class-A Reinforced Bullion Vault", area_sqm: 500.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "SC-BLD-00003",
    name: "Skyline Grand Galleria & Cinema Mall",
    city: "simcity",
    zone: "Commercial Retail (Zone C-2)",
    zone_code: "COMMERCIAL",
    lat: 37.7735,
    lon: -122.4225,
    ground_elevation: 10.0,
    roof_elevation: 42.0,
    height: 32.0,
    floor_count: 5,
    source: "Retail Architectural BIM",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      occupancy_live: 5200,
      energy_kwh_realtime: 410.5,
      hvac_efficiency_cop: 4.8,
      structural_drift_mm: 0.3,
      smart_contract_status: "ACTIVE_DEED_REGISTERED",
      tax_yield_annual: "§142,800/yr",
      approval_contribution: "+6.1% Entertainment Satisfaction"
    },
    canonical_rid: "SC0003-BLD-COM03-1",
    natural_key: {
      digest: "NK-SHA256-SC-GALLERIA-LOD4-B32",
      locator: "0x3C3D4E5F60718293",
      version: 1
    },
    spatial_address: {
      morton_63: "0x3C3D4E5F60718293",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "Midtown Retail District Parcel", rid: "SC0003-PRC-S003-5", status: "VALID" },
      { cls: "B", name: "Galleria Atrium Envelope", rid: "SC0003-BLD-B003-1", status: "VALID" },
      { cls: "P", name: "Multi-Level Customer Parking Structure", rid: "SC0003-PKG-P001-9", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "SC03-F01",
        level_index: 0,
        label: "Ground Floor — Glass Skylight Fashion Promenade",
        z_min: 10.0,
        z_max: 18.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "SC03-U01-PROMENADE",
            name: "Central Atrium Fashion Promenade",
            ifc_space: "IfcSpace:Retail:Promenade",
            gross_area_sqm: 4200.0,
            share_value: "300/1000",
            rooms: [
              { name: "Anchor Department Stores", area_sqm: 2600.0 },
              { name: "Center Court Atrium Cafe", area_sqm: 1600.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "SC-BLD-00004",
    name: "Apex Luxury Condominiums & Sky-Pool",
    city: "simcity",
    zone: "Residential High-Density (Zone R-3)",
    zone_code: "RESIDENTIAL",
    lat: 37.7770,
    lon: -122.4170,
    ground_elevation: 10.0,
    roof_elevation: 115.0,
    height: 105.0,
    floor_count: 32,
    source: "Residential Strata Plan Survey",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      occupancy_live: 1240,
      energy_kwh_realtime: 215.4,
      hvac_efficiency_cop: 5.2,
      structural_drift_mm: 0.6,
      smart_contract_status: "ACTIVE_DEED_REGISTERED",
      tax_yield_annual: "§96,400/yr",
      approval_contribution: "+5.8% Housing Supply"
    },
    canonical_rid: "SC0004-BLD-RES04-8",
    natural_key: {
      digest: "NK-SHA256-SC-APEXCONDOS-B32",
      locator: "0x3D4E5F60718293A4",
      version: 1
    },
    spatial_address: {
      morton_63: "0x3D4E5F60718293A4",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "Highline Residential Lot 04", rid: "SC0004-PRC-S004-2", status: "VALID" },
      { cls: "B", name: "Apex Tower Envelope", rid: "SC0004-BLD-B004-8", status: "VALID" },
      { cls: "U", name: "Residential Strata Apartments (Units 1-180)", rid: "SC0004-UNT-U012-6", status: "VALID" },
      { cls: "C", name: "Rooftop Sky-Pool & Resident Lounge", rid: "SC0004-COM-C032-4", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "SC04-F32",
        level_index: 31,
        label: "Floor 32 — Infinity Sky-Pool & Resident Solarium",
        z_min: 105.0,
        z_max: 115.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "SC04-U32-POOL",
            name: "Infinity Sky-Pool & Solarium",
            ifc_space: "IfcSpace:Recreation:SkyPool",
            gross_area_sqm: 850.0,
            share_value: "100/1000",
            rooms: [
              { name: "Heated Infinity Edge Pool", area_sqm: 450.0 },
              { name: "Panoramic Sunset Lounge", area_sqm: 400.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "SC-BLD-00005",
    name: "Maplewood Terrace Residential Community",
    city: "simcity",
    zone: "Residential Low-Density (Zone R-1)",
    zone_code: "RESIDENTIAL",
    lat: 37.7785,
    lon: -122.4140,
    ground_elevation: 10.0,
    roof_elevation: 21.0,
    height: 11.0,
    floor_count: 2,
    source: "Suburban Neighborhood Plat Map",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      occupancy_live: 360,
      energy_kwh_realtime: 48.6,
      hvac_efficiency_cop: 4.9,
      structural_drift_mm: 0.1,
      smart_contract_status: "ACTIVE_FREEHOLD_DEED",
      tax_yield_annual: "§52,100/yr",
      approval_contribution: "+7.9% Suburban Happiness"
    },
    canonical_rid: "SC0005-BLD-RES05-5",
    natural_key: {
      digest: "NK-SHA256-SC-MAPLEWOOD-B32",
      locator: "0x3E5F60718293A4B5",
      version: 1
    },
    spatial_address: {
      morton_63: "0x3E5F60718293A4B5",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "Maplewood Cul-de-sac Parcel", rid: "SC0005-PRC-S005-9", status: "VALID" },
      { cls: "B", name: "Craftsman Suburban Villas", rid: "SC0005-BLD-B005-5", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "SC05-F01",
        level_index: 0,
        label: "Ground Living & Garden Terrace",
        z_min: 10.0,
        z_max: 15.5,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "SC05-U01-VILLA",
            name: "Craftsman Family Villa 101",
            ifc_space: "IfcSpace:Residential:SingleFamily",
            gross_area_sqm: 260.0,
            share_value: "1000/1000",
            rooms: [
              { name: "Living & Open Kitchen", area_sqm: 140.0 },
              { name: "Rear Landscaped Patio", area_sqm: 120.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "SC-BLD-00006",
    name: "St. Jude General Hospital & Trauma Center",
    city: "simcity",
    zone: "Civic Health & Safety (Zone C-H)",
    zone_code: "CIVIC",
    lat: 37.7720,
    lon: -122.4185,
    ground_elevation: 10.0,
    roof_elevation: 52.0,
    height: 42.0,
    floor_count: 8,
    source: "Healthcare Infrastructure Cadastre",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      occupancy_live: 1180,
      energy_kwh_realtime: 380.2,
      hvac_efficiency_cop: 5.6,
      structural_drift_mm: 0.2,
      smart_contract_status: "ACTIVE_STATUTORY_HOSPITAL",
      tax_yield_annual: "§0 (Non-Profit Public)",
      approval_contribution: "+9.8% Life Expectancy & Health"
    },
    canonical_rid: "SC0006-BLD-HLT06-2",
    natural_key: {
      digest: "NK-SHA256-SC-HOSPITAL-B32",
      locator: "0x3F60718293A4B5C6",
      version: 1
    },
    spatial_address: {
      morton_63: "0x3F60718293A4B5C6",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "Medical Center Campus Parcel", rid: "SC0006-PRC-S006-6", status: "VALID" },
      { cls: "B", name: "Hospital Primary Treatment Wing", rid: "SC0006-BLD-B006-2", status: "VALID" },
      { cls: "A", name: "Rooftop Air Ambulance Helipad", rid: "SC0006-AIR-A001-8", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "SC06-F00",
        level_index: 0,
        label: "Ground Floor — Emergency Department & Triage",
        z_min: 10.0,
        z_max: 16.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "SC06-U00-ER",
            name: "Level 1 Trauma Triage & Resuscitation",
            ifc_space: "IfcSpace:Medical:Emergency",
            gross_area_sqm: 1800.0,
            share_value: "300/1000",
            rooms: [
              { name: "Emergency Triage Bays", area_sqm: 1100.0 },
              { name: "Surgical Resuscitation Suites", area_sqm: 700.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "SC-BLD-00007",
    name: "Central High School & Athletic Stadium",
    city: "simcity",
    zone: "Civic Education (Zone C-E)",
    zone_code: "CIVIC",
    lat: 37.7710,
    lon: -122.4145,
    ground_elevation: 10.0,
    roof_elevation: 26.0,
    height: 16.0,
    floor_count: 3,
    source: "Department of Education Cadastre",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      occupancy_live: 1850,
      energy_kwh_realtime: 120.4,
      hvac_efficiency_cop: 5.0,
      structural_drift_mm: 0.1,
      smart_contract_status: "ACTIVE_EDUCATIONAL_CHARTER",
      tax_yield_annual: "§0 (Public School)",
      approval_contribution: "+8.9% Education Index (EQ: 135)"
    },
    canonical_rid: "SC0007-BLD-EDU07-9",
    natural_key: {
      digest: "NK-SHA256-SC-HIGHSCHOOL-B32",
      locator: "0x40718293A4B5C6D7",
      version: 1
    },
    spatial_address: {
      morton_63: "0x40718293A4B5C6D7",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "High School Campus & Track Grounds", rid: "SC0007-PRC-S007-3", status: "VALID" },
      { cls: "B", name: "Brick Academic Building", rid: "SC0007-BLD-B007-9", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "SC07-F01",
        level_index: 0,
        label: "Ground Floor — Science Labs & Library",
        z_min: 10.0,
        z_max: 15.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "SC07-U01-LABS",
            name: "STEM Innovation Labs & Library",
            ifc_space: "IfcSpace:Educational:Classrooms",
            gross_area_sqm: 2400.0,
            share_value: "500/1000",
            rooms: [
              { name: "Robotics & Physics Labs", area_sqm: 1400.0 },
              { name: "Central Digital Library", area_sqm: 1000.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "SC-BLD-00008",
    name: "CleanTech Advanced Robotics Factory",
    city: "simcity",
    zone: "Industrial High-Tech (Zone I-1)",
    zone_code: "INDUSTRIAL",
    lat: 37.7775,
    lon: -122.4260,
    ground_elevation: 10.0,
    roof_elevation: 32.0,
    height: 22.0,
    floor_count: 2,
    source: "Industrial BIM Facility Ledger",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      occupancy_live: 920,
      energy_kwh_realtime: 890.5,
      hvac_efficiency_cop: 5.3,
      structural_drift_mm: 0.4,
      smart_contract_status: "ACTIVE_INDUSTRIAL_PATENT",
      tax_yield_annual: "§210,500/yr",
      approval_contribution: "+6.8% Industrial Employment (Jobs: 1,400)"
    },
    canonical_rid: "SC0008-BLD-IND08-6",
    natural_key: {
      digest: "NK-SHA256-SC-CLEANTECH-B32",
      locator: "0x418293A4B5C6D7E8",
      version: 1
    },
    spatial_address: {
      morton_63: "0x418293A4B5C6D7E8",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "CleanTech Manufacturing Yard", rid: "SC0008-PRC-S008-0", status: "VALID" },
      { cls: "B", name: "Sawtooth Solar Factory Envelope", rid: "SC0008-BLD-B008-6", status: "VALID" },
      { cls: "I", name: "Clean Solar Rooftop Array (4.2 MW)", rid: "SC0008-INF-I008-4", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "SC08-F00",
        level_index: 0,
        label: "Ground Manufacturing & Cleanroom Hall",
        z_min: 10.0,
        z_max: 22.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "SC08-U00-FACTORY",
            name: "Automated Robotic Assembly Line",
            ifc_space: "IfcSpace:Industrial:Cleanroom",
            gross_area_sqm: 5400.0,
            share_value: "800/1000",
            rooms: [
              { name: "Semiconductor Assembly Floor", area_sqm: 3800.0 },
              { name: "Automated Logistics Bay", area_sqm: 1600.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "SC-BLD-00009",
    name: "Clean Energy Nuclear & Wind Station",
    city: "simcity",
    zone: "Public Infrastructure & Power (Zone I-3)",
    zone_code: "INDUSTRIAL",
    lat: 37.7730,
    lon: -122.4280,
    ground_elevation: 10.0,
    roof_elevation: 95.0,
    height: 85.0,
    floor_count: 4,
    source: "Nuclear Regulatory & Energy Grid Cadastre",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      occupancy_live: 140,
      energy_generation_mw: 500.0,
      grid_load_percent: 78.4,
      water_cooling_gpm: 12000,
      structural_drift_mm: 0.1,
      smart_contract_status: "ACTIVE_NRC_LICENSE",
      tax_yield_annual: "§320,000/yr (Clean Power Revenue)",
      approval_contribution: "+10.0% 0-Carbon Power Grid"
    },
    canonical_rid: "SC0009-BLD-PWR09-3",
    natural_key: {
      digest: "NK-SHA256-SC-POWERPLANT-B32",
      locator: "0x4293A4B5C6D7E8F9",
      version: 1
    },
    spatial_address: {
      morton_63: "0x4293A4B5C6D7E8F9",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "Regional Power Generation Reservation", rid: "SC0009-PRC-S009-7", status: "VALID" },
      { cls: "B", name: "Containment Dome & Turbine Hall", rid: "SC0009-BLD-B009-3", status: "VALID" },
      { cls: "I", name: "Hyperbolic Cooling Tower & Steam Vent", rid: "SC0009-INF-I009-1", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "SC09-F00",
        level_index: 0,
        label: "Turbine Hall & Control Room",
        z_min: 10.0,
        z_max: 28.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "SC09-U00-TURBINE",
            name: "Twin Superheated Steam Turbine Hall",
            ifc_space: "IfcSpace:Utility:Generation",
            gross_area_sqm: 4800.0,
            share_value: "600/1000",
            rooms: [
              { name: "500MW High-Pressure Turbine Deck", area_sqm: 3200.0 },
              { name: "Redundant Main Control Room", area_sqm: 1600.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "SC-BLD-00010",
    name: "Riverview Marina & Yacht Promenade",
    city: "simcity",
    zone: "Waterfront Commercial & Tourism (Zone C-W)",
    zone_code: "COMMERCIAL",
    lat: 37.7705,
    lon: -122.4215,
    ground_elevation: 2.0,
    roof_elevation: 18.0,
    height: 16.0,
    floor_count: 2,
    source: "Port Authority Water Rights Cadastre",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      occupancy_live: 420,
      active_vessels_docked: 48,
      water_quality_index: "PRISTINE_CLASS_A",
      structural_drift_mm: 0.3,
      smart_contract_status: "ACTIVE_PORT_CONCESSION",
      tax_yield_annual: "§64,500/yr",
      approval_contribution: "+4.9% Waterfront Recreation"
    },
    canonical_rid: "SC0010-BLD-MAR10-0",
    natural_key: {
      digest: "NK-SHA256-SC-MARINA-B32",
      locator: "0x43A4B5C6D7E8F90A",
      version: 1
    },
    spatial_address: {
      morton_63: "0x43A4B5C6D7E8F90A",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "Riverview Waterfront Riparian Lot", rid: "SC0010-PRC-S010-4", status: "VALID" },
      { cls: "B", name: "Clubhouse & Harbor Master Watchtower", rid: "SC0010-BLD-B010-0", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "SC10-F01",
        level_index: 0,
        label: "Ground Pier Deck & Yacht Slips",
        z_min: 2.0,
        z_max: 8.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "SC10-U01-PIER",
            name: "Harbor Boardwalk & Yacht Slips",
            ifc_space: "IfcSpace:Maritime:Boardwalk",
            gross_area_sqm: 3200.0,
            share_value: "1000/1000",
            rooms: [
              { name: "Harbor Master Watchhouse", area_sqm: 600.0 },
              { name: "Mooring Slips & Fuel Dock", area_sqm: 2600.0 }
            ]
          }
        ]
      }
    ]
  }
];
