// Mock data — Night City (100% LOD4 Digital Twin Simulation Lab)
// Demonstrates what 3D ULPIN achieves when complete native IFC 4.3 BIM,
// multi-layer subsurface utilities, and live IoT telemetry are supplied from day one.

export const simulationParcels = [
  {
    parcel_id: "NC-PRC-SEC01-001",
    city: "simulation",
    coordinates: [
      [72.7780, 18.8780],
      [72.7825, 18.8780],
      [72.7825, 18.8825],
      [72.7780, 18.8825]
    ]
  },
  {
    parcel_id: "NC-PRC-SEC01-002",
    city: "simulation",
    coordinates: [
      [72.7828, 18.8780],
      [72.7865, 18.8780],
      [72.7865, 18.8825],
      [72.7828, 18.8825]
    ]
  },
  {
    parcel_id: "NC-PRC-SEC02-TRANSIT",
    city: "simulation",
    coordinates: [
      [72.7770, 18.8830],
      [72.7850, 18.8830],
      [72.7850, 18.8870],
      [72.7770, 18.8870]
    ]
  },
  {
    parcel_id: "NC-PRC-SEC03-RESIDENTIAL",
    city: "simulation",
    coordinates: [
      [72.7780, 18.8730],
      [72.7830, 18.8730],
      [72.7830, 18.8775],
      [72.7780, 18.8775]
    ]
  }
];

export const simulationBuildings = [
  {
    building_id: "NC-BLD-00001",
    name: "Arasaka Tower (Corpo Plaza HQ)",
    city: "simulation",
    lat: 18.8805,
    lon: 72.7802,
    ground_elevation: 4.0,
    roof_elevation: 314.0,
    height: 310.0,
    floor_count: 82,
    source: "Native IFC 4.3 BIM + Laser Scan",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      occupancy_live: 14280,
      energy_kwh_realtime: 842.6,
      hvac_efficiency_cop: 4.8,
      structural_drift_mm: 1.2,
      smart_contract_status: "ACTIVE_DEED_REGISTERED"
    },
    canonical_rid: "NC0001SEC01B0001U0A101-4",
    natural_key: {
      digest: "NK-SHA256-NC-MEGATOWER01-LOD4-B32",
      locator: "0x7F1A2B3C4D5E6F80",
      version: 1
    },
    spatial_address: {
      morton_63: "0x7F1A2B3C4D5E6F80",
      lod: "LOD4"
    },
    binding_record: {
      version: 1,
      record_hash: "0x9E4B1C7D2A5F8E30",
      sign_off: { examiner_id: "NC-GOV-SURVEYOR-01" }
    },
    classes_10: [
      { cls: "S", name: "Coronado Smart Basin Parcel", rid: "NC0001SEC01S0001-9", status: "VALID" },
      { cls: "B", name: "Megatower 01 Primary Envelope", rid: "NC0001SEC01B0001-4", status: "VALID" },
      { cls: "U", name: "Executive Commercial Suites (82F)", rid: "NC0001SEC01U0042-8", status: "VALID" },
      { cls: "C", name: "Central Pressurized Core & Elevators", rid: "NC0001SEC01C0001-1", status: "VALID" },
      { cls: "P", name: "Subterranean Maglev Vault", rid: "NC0001SEC01P0001-6", status: "VALID" },
      { cls: "A", name: "Rooftop Drone Port & Airspace", rid: "NC0001SEC01A0001-3", status: "VALID" },
      { cls: "T", name: "Sub-Basement Hyperloop Tube", rid: "NC0001SEC01T0001-7", status: "VALID" },
      { cls: "E", name: "Floor 42 Sky-Bridge Connection", rid: "NC0001SEC01E0042-2", status: "VALID" },
      { cls: "I", name: "Geothermal Superconductor Spine", rid: "NC0001SEC01I0001-5", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "NC-BLD-00001-F00",
        level_index: 0,
        label: "Grand Atrium & Security Concourse",
        z_min: 4.0,
        z_max: 12.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC01-U00-ATRIUM",
            name: "Grand Reception & Security Atrium",
            ifc_space: "IfcSpace:PublicConcourse:GrandAtrium",
            gross_area_sqm: 1450.0,
            share_value: "100/1000",
            rooms: [
              { name: "Public Welcome Concourse", area_sqm: 920.0 },
              { name: "Biometric Security Checkpoint", area_sqm: 320.0 },
              { name: "VIP Concierge Lounge", area_sqm: 210.0 }
            ]
          }
        ]
      },
      {
        floor_id: "NC-BLD-00001-F42",
        level_index: 42,
        label: "Floor 42 — Sky-Bridge Interconnect & Oasis",
        z_min: 160.0,
        z_max: 165.5,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC01-U42-SKYBRIDGE",
            name: "Inter-Tower Sky-Bridge Promenade",
            ifc_space: "IfcSpace:BridgeConcourse:F42",
            gross_area_sqm: 820.0,
            share_value: "50/1000",
            rooms: [
              { name: "Glass Deck Sky-Bridge to Tower 02", area_sqm: 480.0 },
              { name: "Aeroponic Sky-Garden Cafe", area_sqm: 340.0 }
            ]
          }
        ]
      },
      {
        floor_id: "NC-BLD-00001-F80",
        level_index: 80,
        label: "Floor 80 — Executive Boardroom & Penthouses",
        z_min: 300.0,
        z_max: 306.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC01-U80-BOARDROOM",
            name: "Arasaka High Command Boardroom",
            ifc_space: "IfcSpace:ExecutiveSuite:F80",
            gross_area_sqm: 650.0,
            share_value: "80/1000",
            rooms: [
              { name: "Holographic Global War-Room", area_sqm: 380.0 },
              { name: "Private Executive Suite & Vault", area_sqm: 270.0 }
            ]
          }
        ]
      },
      {
        floor_id: "NC-BLD-00001-F81",
        level_index: 81,
        label: "Floor 81 — Sky-Lounge & Helipad Access",
        z_min: 306.0,
        z_max: 314.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC01-U81-HELIPORT",
            name: "Sky-Port & VIP Drone Launchpad",
            ifc_space: "IfcSpace:TransportHeliport:F81",
            gross_area_sqm: 720.0,
            share_value: "70/1000",
            rooms: [
              { name: "Flight Operations Dispatch", area_sqm: 220.0 },
              { name: "Reinforced Helipad Platform", area_sqm: 500.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "NC-BLD-00002",
    name: "Megabuilding H10 (Watson Arcology - V's Home)",
    city: "simulation",
    lat: 18.8805,
    lon: 72.7845,
    ground_elevation: 4.0,
    roof_elevation: 249.0,
    height: 245.0,
    floor_count: 65,
    source: "Native IFC 4.3 BIM",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      occupancy_live: 8920,
      energy_kwh_realtime: 512.3,
      hvac_efficiency_cop: 5.1,
      structural_drift_mm: 0.9,
      smart_contract_status: "ACTIVE_DEED_REGISTERED"
    },
    canonical_rid: "NC0002SEC01B0002U0A102-1",
    natural_key: {
      digest: "NK-SHA256-NC-KIROSHI-LOD4-B32",
      locator: "0x7F2B3C4D5E6F7A91",
      version: 1
    },
    spatial_address: {
      morton_63: "0x7F2B3C4D5E6F7A91",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "Eastern Smart Wharf", rid: "NC0002SEC01S0002-6", status: "VALID" },
      { cls: "B", name: "Cyber-Spire Building Envelope", rid: "NC0002SEC01B0002-1", status: "VALID" },
      { cls: "E", name: "Sky-Bridge Docking Node (F42)", rid: "NC0002SEC01E0042-9", status: "VALID" },
      { cls: "U", name: "Neural Optics Labs", rid: "NC0002SEC01U0024-5", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "NC-BLD-00002-F00",
        level_index: 0,
        label: "Ground Lobby & Cyberware Showroom",
        z_min: 4.0,
        z_max: 10.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC02-U00-SHOWROOM",
            name: "Flagship Optics Experience Center",
            ifc_space: "IfcSpace:RetailExhibition:F00",
            gross_area_sqm: 1100.0,
            share_value: "100/1000",
            rooms: [
              { name: "Public Tech Pavilion", area_sqm: 780.0 },
              { name: "VIP Fitting Suite", area_sqm: 320.0 }
            ]
          }
        ]
      },
      {
        floor_id: "NC-BLD-00002-F42",
        level_index: 42,
        label: "Floor 42 — Sky-Bridge Eastern Terminal",
        z_min: 160.0,
        z_max: 165.5,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC02-U42-BRIDGE-EAST",
            name: "Inter-Tower Transit Portal",
            ifc_space: "IfcSpace:TransitPortal:F42",
            gross_area_sqm: 640.0,
            share_value: "50/1000",
            rooms: [
              { name: "Customs & Biometric Gate", area_sqm: 240.0 },
              { name: "Sky-Corridor Airlock", area_sqm: 400.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "NC-BLD-00003",
    name: "Militech Corporate Headquarters (Corpo Plaza)",
    city: "simulation",
    lat: 18.8845,
    lon: 72.7810,
    ground_elevation: 3.5,
    roof_elevation: 48.5,
    height: 45.0,
    floor_count: 12,
    source: "Municipal Smart Transit Authority BIM",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      passenger_throughput_hr: 42800,
      maglev_trains_docked: 6,
      subsurface_air_quality_aqi: 18,
      smart_contract_status: "PUBLIC_TRANSIT_EASEMENT_ACTIVE"
    },
    canonical_rid: "NC0003SEC02B0003T0A103-8",
    natural_key: {
      digest: "NK-SHA256-NC-TRANSIT-LOD4-B32",
      locator: "0x7F3C4D5E6F7A8B92",
      version: 1
    },
    spatial_address: {
      morton_63: "0x7F3C4D5E6F7A8B92",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "Central Plaza Surface Parcel", rid: "NC0003SEC02S0003-4", status: "VALID" },
      { cls: "T", name: "Hyperloop Sub-B3 (-35m)", rid: "NC0003SEC02T0001-9", status: "VALID" },
      { cls: "P", name: "Automated Transit Silo (-18m)", rid: "NC0003SEC02P0002-2", status: "VALID" },
      { cls: "B", name: "Terminal Departure Hall", rid: "NC0003SEC02B0003-8", status: "VALID" },
      { cls: "E", name: "Elevated Monorail Viaduct (+15m)", rid: "NC0003SEC02E0001-5", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "NC-BLD-00003-B03",
        level_index: -3,
        label: "Sub-Level -3: Vacuum Hyperloop Tube (-35m)",
        z_min: -35.0,
        z_max: -26.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC03-UB3-HYPERLOOP",
            name: "High-Speed Maglev Vacuum Platform",
            ifc_space: "IfcSpace:SubterraneanPlatform:B3",
            gross_area_sqm: 3200.0,
            share_value: "300/1000",
            rooms: [
              { name: "Maglev Tube Platform 1 & 2", area_sqm: 2200.0 },
              { name: "Atmospheric Vacuum Airlock", area_sqm: 1000.0 }
            ]
          }
        ]
      },
      {
        floor_id: "NC-BLD-00003-F00",
        level_index: 0,
        label: "Level 0: Multimodal Concourse & Retail Hub",
        z_min: 3.5,
        z_max: 12.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC03-U00-CONCOURSE",
            name: "Central Ticketing & Shopping Mall",
            ifc_space: "IfcSpace:CommercialMall:F00",
            gross_area_sqm: 4500.0,
            share_value: "400/1000",
            rooms: [
              { name: "Departure Plaza", area_sqm: 2800.0 },
              { name: "High-Street Retail Stores", area_sqm: 1700.0 }
            ]
          }
        ]
      },
      {
        floor_id: "NC-BLD-00003-F02",
        level_index: 2,
        label: "Level 2: Elevated Monorail Corridor (+15m)",
        z_min: 15.0,
        z_max: 22.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC03-U02-MONORAIL",
            name: "Sky-Rail Viaduct Station",
            ifc_space: "IfcSpace:ElevatedTransit:F02",
            gross_area_sqm: 2100.0,
            share_value: "300/1000",
            rooms: [
              { name: "Monorail Northbound Platform", area_sqm: 1050.0 },
              { name: "Monorail Southbound Platform", area_sqm: 1050.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "NC-BLD-00004",
    name: "The Afterlife (Watson Mercenary Club & Bunkers)",
    city: "simulation",
    lat: 18.8845,
    lon: 72.7770,
    ground_elevation: 3.5,
    roof_elevation: 3.5,
    height: -32.0,
    floor_count: 8,
    is_underground: true,
    source: "Automated Mobility Silo CAD",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      robotic_car_slots: 1200,
      active_fast_chargers: 450,
      avg_retrieval_sec: 42,
      fire_suppression_co2: "ARMED_AND_READY"
    },
    canonical_rid: "NC0004SEC02P0004P0A104-5",
    natural_key: {
      digest: "NK-SHA256-NC-DELAMAIN-LOD4-B32",
      locator: "0x7F4D5E6F7A8B9C93",
      version: 1
    },
    spatial_address: {
      morton_63: "0x7F4D5E6F7A8B9C93",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "P", name: "Subterranean Robotic Stacking Silo", rid: "NC0004SEC02P0004-5", status: "VALID" },
      { cls: "I", name: "Ultra-High Voltage DC Charger Bus", rid: "NC0004SEC02I0001-8", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "NC-BLD-00004-B01",
        level_index: -1,
        label: "Sub-Level -1: EV Fast-Swap Robotic Bay",
        z_min: -8.0,
        z_max: -3.5,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC04-UB1-ROBOTIC",
            name: "Robotic Battery Replacement Carousel",
            ifc_space: "IfcSpace:RoboticFacility:B1",
            gross_area_sqm: 1800.0,
            share_value: "500/1000",
            rooms: [
              { name: "Automated EV Ingress Bay", area_sqm: 900.0 },
              { name: "Battery Storage & Cooling Vault", area_sqm: 900.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "NC-BLD-00005",
    name: "Kang Tao Spire (Autonomous Systems Arcology)",
    city: "simulation",
    lat: 18.8770,
    lon: 72.7845,
    ground_elevation: 3.8,
    roof_elevation: 18.8,
    height: 15.0,
    floor_count: 4,
    source: "Critical Infrastructure Digital Twin",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      datacenter_compute_pflops: 8500,
      pue_cooling_ratio: 1.08,
      optical_backbone_gbps: 40000,
      physical_security_tier: "TIER_4_MAXIMUM"
    },
    canonical_rid: "NC0005SEC01I0005I0A105-2",
    natural_key: {
      digest: "NK-SHA256-NC-NETWATCH-LOD4-B32",
      locator: "0x7F5E6F7A8B9C0D94",
      version: 1
    },
    spatial_address: {
      morton_63: "0x7F5E6F7A8B9C0D94",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "I", name: "Sub-Sea Fiber Landfall Vault", rid: "NC0005SEC01I0005-2", status: "VALID" },
      { cls: "B", name: "Blast-Hardened Superstructure", rid: "NC0005SEC01B0005-7", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "NC-BLD-00005-F00",
        level_index: 0,
        label: "Cryogenic Quantum Processing Hall",
        z_min: 3.8,
        z_max: 10.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC05-U00-QUANTUM",
            name: "Core Quantum Cryo-Server Chamber",
            ifc_space: "IfcSpace:DataCenterServerRoom:F00",
            gross_area_sqm: 1400.0,
            share_value: "1000/1000",
            rooms: [
              { name: "Liquid Helium Qubit Chiller Array", area_sqm: 800.0 },
              { name: "Air-Gapped Optical Switch Core", area_sqm: 600.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "NC-BLD-00006",
    name: "No-Tell Motel & Kabuki Market Arcade",
    city: "simulation",
    lat: 18.8755,
    lon: 72.7805,
    ground_elevation: 3.8,
    roof_elevation: 161.8,
    height: 158.0,
    floor_count: 45,
    source: "Prefabricated Modular BIM System",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      resident_units_total: 360,
      occupancy_pct: 98.4,
      greywater_recycled_pct: 94.2,
      smart_fire_sprinkler_status: "ONLINE_100_PERCENT"
    },
    canonical_rid: "NC0006SEC03B0006U0A106-9",
    natural_key: {
      digest: "NK-SHA256-NC-VISTADELREY-LOD4-B32",
      locator: "0x7F6F7A8B9C0D1E95",
      version: 1
    },
    spatial_address: {
      morton_63: "0x7F6F7A8B9C0D1E95",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "High-Density Residential Parcel", rid: "NC0006SEC03S0006-3", status: "VALID" },
      { cls: "B", name: "Modular Arcology Envelope", rid: "NC0006SEC03B0006-9", status: "VALID" },
      { cls: "U", name: "Strata Units (360 Apartments)", rid: "NC0006SEC03U0045-6", status: "VALID" },
      { cls: "C", name: "Sky-Courtyards & Communal Refuges", rid: "NC0006SEC03C0015-1", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "NC-BLD-00006-F00",
        level_index: 0,
        label: "Ground Floor: Community Marketplace & Nursery",
        z_min: 3.8,
        z_max: 8.5,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC06-U00-MARKET",
            name: "Cooperative Grocer & Medical Clinic",
            ifc_space: "IfcSpace:CommunityService:F00",
            gross_area_sqm: 1650.0,
            share_value: "50/1000",
            rooms: [
              { name: "Neighborhood Clinic", area_sqm: 650.0 },
              { name: "Fresh Produce Cooperative", area_sqm: 1000.0 }
            ]
          }
        ]
      },
      {
        floor_id: "NC-BLD-00006-F15",
        level_index: 15,
        label: "Floor 15 — Communal Sky-Garden & Playpark",
        z_min: 54.0,
        z_max: 59.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC06-U15-SKYGARDEN",
            name: "Communal Terrace & Fire Refuge Deck",
            ifc_space: "IfcSpace:CommunalPark:F15",
            gross_area_sqm: 1200.0,
            share_value: "30/1000",
            rooms: [
              { name: "Open-Air Children's Play Deck", area_sqm: 600.0 },
              { name: "Community Hydroponics Greenhouse", area_sqm: 600.0 }
            ]
          }
        ]
      },
      {
        floor_id: "NC-BLD-00006-F24",
        level_index: 24,
        label: "Floor 24 — Strata Apartment Cluster (Units 2401-2408)",
        z_min: 85.0,
        z_max: 88.5,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC06-U24-APT2401",
            name: "Strata Pent-Suite 2401 (Bay View)",
            ifc_space: "IfcSpace:ResidentialFlat:2401",
            gross_area_sqm: 142.0,
            share_value: "3.2/1000",
            rooms: [
              { name: "Primary Master Bedroom", area_sqm: 32.0 },
              { name: "Living & Panoramic Balcony", area_sqm: 68.0 },
              { name: "Kitchen & Dining Studio", area_sqm: 42.0 }
            ]
          },
          {
            unit_id: "NC06-U24-APT2402",
            name: "Strata Modular Suite 2402 (Skyline View)",
            ifc_space: "IfcSpace:ResidentialFlat:2402",
            gross_area_sqm: 118.0,
            share_value: "2.8/1000",
            rooms: [
              { name: "Smart Bedroom Pod", area_sqm: 26.0 },
              { name: "Integrated Living Loft", area_sqm: 64.0 },
              { name: "Compact Smart Kitchen", area_sqm: 28.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "NC-BLD-00007",
    name: "Corpo Plaza Skyway & Trauma Team Airway",
    city: "simulation",
    lat: 18.8825,
    lon: 72.7825,
    ground_elevation: 3.5,
    roof_elevation: 220.0,
    height: 40.0,
    floor_count: 1,
    source: "Directorate General of Civil Aviation (DGCA) 3D Airspace Registry",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: false,
    is_simulation: true,
    telemetry: {
      active_autonomous_drones: 28,
      airspace_congestion_level: "LOW",
      geofence_enforcement: "HARD_REALTIME_KILOMETRIC",
      noise_decibel_ground: 44.2
    },
    canonical_rid: "NC0007SEC01A0007A0A107-6",
    natural_key: {
      digest: "NK-SHA256-NC-AIRSPACE-ALPHA-B32",
      locator: "0x7F7A8B9C0D1E2F96",
      version: 1
    },
    spatial_address: {
      morton_63: "0x7F7A8B9C0D1E2F96",
      lod: "LOD2"
    },
    classes_10: [
      { cls: "A", name: "3D Airspace Delivery Corridor (+180m to +220m)", rid: "NC0007SEC01A0007-6", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "NC-BLD-00007-F01",
        level_index: 0,
        label: "Air Mobility Volume: Elevation +180m to +220m",
        z_min: 180.0,
        z_max: 220.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC07-U01-AIRWAY",
            name: "Priority Drone Flight Lane 01",
            ifc_space: "IfcSpace:AirCorridor:Lane1",
            gross_area_sqm: 12000.0,
            share_value: "1000/1000",
            rooms: [
              { name: "Northbound Drone Transit Path", area_sqm: 6000.0 },
              { name: "Southbound Drone Transit Path", area_sqm: 6000.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "NC-BLD-00008",
    name: "Konpeki Plaza (Waterfront Luxury Resort & Yorinobu Penthouse)",
    city: "simulation",
    lat: 18.8850,
    lon: 72.7750,
    ground_elevation: 2.0,
    roof_elevation: 212.0,
    height: 210.0,
    floor_count: 58,
    source: "Native IFC 4.3 BIM + 3D Laser Scan",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      occupancy_live: 3420,
      energy_kwh_realtime: 680.4,
      hvac_efficiency_cop: 4.9,
      structural_drift_mm: 0.8,
      smart_contract_status: "ACTIVE_DEED_REGISTERED"
    },
    canonical_rid: "NC0008SEC01B0008U0A108-9",
    natural_key: {
      digest: "NK-SHA256-NC-KONPEKI-LOD4-B32",
      locator: "0x7F8A9B0C1D2E3F97",
      version: 1
    },
    spatial_address: {
      morton_63: "0x7F8A9B0C1D2E3F97",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "Coronado Bay Waterfront Pier Parcel", rid: "NC0008SEC01S0008-2", status: "VALID" },
      { cls: "B", name: "Konpeki Primary Luxury Hotel Envelope", rid: "NC0008SEC01B0008-7", status: "VALID" },
      { cls: "U", name: "Yorinobu Arasaka VIP Penthouse Suite (Floor 58)", rid: "NC0008SEC01U0058-4", status: "VALID" },
      { cls: "C", name: "Private High-Speed Shinkansen Elevators", rid: "NC0008SEC01C0008-1", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "NC-BLD-00008-F00",
        level_index: 0,
        label: "Ground Floor — Imperial Water Lounge & Reception",
        z_min: 2.0,
        z_max: 10.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC08-U00-LOUNGE",
            name: "Grand Imperial Water Lounge",
            ifc_space: "IfcSpace:Hospitality:Lounge",
            gross_area_sqm: 1800.0,
            share_value: "150/1000",
            rooms: [
              { name: "Gold-Leaf Waterfall Reception", area_sqm: 950.0 },
              { name: "Private Security Sentry Vault", area_sqm: 450.0 }
            ]
          }
        ]
      },
      {
        floor_id: "NC-BLD-00008-F58",
        level_index: 58,
        label: "Floor 58 — Yorinobu Penthouse & The Relic Safe",
        z_min: 200.0,
        z_max: 212.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC08-U58-PENTHOUSE",
            name: "Presidential Sky-Penthouse Suite",
            ifc_space: "IfcSpace:ResidentialPenthouse:F58",
            gross_area_sqm: 950.0,
            share_value: "200/1000",
            rooms: [
              { name: "Cryo-Storage Secret Vault (The Relic)", area_sqm: 120.0 },
              { name: "Panoramic Tatami Chamber", area_sqm: 380.0 },
              { name: "Private Rooftop AV Landing Deck", area_sqm: 450.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "NC-BLD-00009",
    name: "Megabuilding H08 (Japantown High-Density Arcology)",
    city: "simulation",
    lat: 18.8830,
    lon: 72.7870,
    ground_elevation: 4.0,
    roof_elevation: 199.0,
    height: 195.0,
    floor_count: 54,
    source: "Native IFC 4.3 BIM",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      occupancy_live: 11450,
      energy_kwh_realtime: 720.1,
      hvac_efficiency_cop: 4.7,
      structural_drift_mm: 1.1,
      smart_contract_status: "ACTIVE_DEED_REGISTERED"
    },
    canonical_rid: "NC0009SEC01B0009U0A109-2",
    natural_key: {
      digest: "NK-SHA256-NC-MEGABUILDINGH08-B32",
      locator: "0x7F9A0B1C2D3E4F98",
      version: 1
    },
    spatial_address: {
      morton_63: "0x7F9A0B1C2D3E4F98",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "Japantown Urban Core Parcel", rid: "NC0009SEC01S0009-5", status: "VALID" },
      { cls: "B", name: "Megabuilding H08 Arcology Shell", rid: "NC0009SEC01B0009-0", status: "VALID" },
      { cls: "U", name: "Residential Modular Pods (Floors 1-50)", rid: "NC0009SEC01U0020-3", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "NC-BLD-00009-F00",
        level_index: 0,
        label: "Ground Level — Multi-Tier Street Bazaar & Food Court",
        z_min: 4.0,
        z_max: 12.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC09-U00-BAZAAR",
            name: "Neon Ramen Alley & Cyber-Tech Bazaar",
            ifc_space: "IfcSpace:RetailBazaar:F00",
            gross_area_sqm: 2400.0,
            share_value: "80/1000",
            rooms: [
              { name: "24-Hour Noodle & Dumpling Row", area_sqm: 1400.0 },
              { name: "Black Market Ripperdoc Annex", area_sqm: 600.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "NC-BLD-00010",
    name: "Delamain AI Operations Hub & Autonomous Depot",
    city: "simulation",
    lat: 18.8810,
    lon: 72.7860,
    ground_elevation: 3.5,
    roof_elevation: 63.5,
    height: 60.0,
    floor_count: 8,
    source: "Delamain Corp Autonomous Fleet Registry",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      occupancy_live: 12,
      energy_kwh_realtime: 390.5,
      hvac_efficiency_cop: 5.6,
      structural_drift_mm: 0.3,
      smart_contract_status: "ACTIVE_DEED_REGISTERED"
    },
    canonical_rid: "NC0010SEC01B0010U0A110-5",
    natural_key: {
      digest: "NK-SHA256-NC-DELAMAIN-HUB-B32",
      locator: "0x7F0B1C2D3E4F5A99",
      version: 1
    },
    spatial_address: {
      morton_63: "0x7F0B1C2D3E4F5A99",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "Autonomous Mobility Parcel", rid: "NC0010SEC01S0010-8", status: "VALID" },
      { cls: "B", name: "Hexagonal Central AI Server Core", rid: "NC0010SEC01B0010-3", status: "VALID" },
      { cls: "P", name: "Subterranean Combat Cab Staging Bays", rid: "NC0010SEC01P0010-7", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "NC-BLD-00010-F00",
        level_index: 0,
        label: "Ground Level — Automated Dispatch Pavilion",
        z_min: 3.5,
        z_max: 12.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC10-U00-DISPATCH",
            name: "Delamain Autonomous Taxi Bay & Concierge",
            ifc_space: "IfcSpace:AutomatedTransitHub:F00",
            gross_area_sqm: 1600.0,
            share_value: "500/1000",
            rooms: [
              { name: "Excelsior Service VIP Boarding Dock", area_sqm: 800.0 },
              { name: "Central AI Core Quantum Chamber", area_sqm: 400.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "NC-BLD-00011",
    name: "Tyger Claws Pagoda & Jig-Jig Street Arcade",
    city: "simulation",
    lat: 18.8815,
    lon: 72.7835,
    ground_elevation: 3.8,
    roof_elevation: 68.8,
    height: 65.0,
    floor_count: 6,
    source: "Municipal Cultural Landmark Cadastre",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      occupancy_live: 2180,
      energy_kwh_realtime: 295.2,
      hvac_efficiency_cop: 4.2,
      structural_drift_mm: 0.5,
      smart_contract_status: "ACTIVE_DEED_REGISTERED"
    },
    canonical_rid: "NC0011SEC01B0011U0A111-8",
    natural_key: {
      digest: "NK-SHA256-NC-TYGERPAGODA-B32",
      locator: "0x7F1C2D3E4F5A6B01",
      version: 1
    },
    spatial_address: {
      morton_63: "0x7F1C2D3E4F5A6B01",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "Jig-Jig Entertainment Precinct Parcel", rid: "NC0011SEC01S0011-1", status: "VALID" },
      { cls: "B", name: "Multi-Tier Neo-Kitsch Pagoda", rid: "NC0011SEC01B0011-6", status: "VALID" },
      { cls: "U", name: "Pachinko Parlors & Braindance Arcades", rid: "NC0011SEC01U0002-9", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "NC-BLD-00011-F00",
        level_index: 0,
        label: "Ground Arcade — Neon Torii Gate & Casino",
        z_min: 3.8,
        z_max: 11.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC11-U00-ARCADE",
            name: "Jig-Jig Neon Arcade & Casino",
            ifc_space: "IfcSpace:EntertainmentCasino:F00",
            gross_area_sqm: 1200.0,
            share_value: "300/1000",
            rooms: [
              { name: "Pachinko & Slot Hall", area_sqm: 750.0 },
              { name: "Torii Gate Welcome Promenade", area_sqm: 450.0 }
            ]
          }
        ]
      }
    ]
  },
  {
    building_id: "NC-BLD-00012",
    name: "Petrochem Energy Spire & Regional Refinery",
    city: "simulation",
    lat: 18.8785,
    lon: 72.7760,
    ground_elevation: 3.0,
    roof_elevation: 173.0,
    height: 170.0,
    floor_count: 42,
    source: "Industrial Energy Infrastructure Cadastre",
    confidence: "AUTHORITATIVE",
    validation_status: "VALID",
    data_provenance: "100%_LOD4_DIGITAL_TWIN",
    bim_enabled: true,
    is_simulation: true,
    telemetry: {
      occupancy_live: 1890,
      energy_kwh_realtime: 1420.8,
      hvac_efficiency_cop: 5.2,
      structural_drift_mm: 1.4,
      smart_contract_status: "ACTIVE_DEED_REGISTERED"
    },
    canonical_rid: "NC0012SEC01B0012U0A112-1",
    natural_key: {
      digest: "NK-SHA256-NC-PETROCHEM-B32",
      locator: "0x7F2D3E4F5A6B7C02",
      version: 1
    },
    spatial_address: {
      morton_63: "0x7F2D3E4F5A6B7C02",
      lod: "LOD4"
    },
    classes_10: [
      { cls: "S", name: "Industrial Refining District Ground Parcel", rid: "NC0012SEC01S0012-4", status: "VALID" },
      { cls: "B", name: "Petrochem Tower Envelope & Storage Silos", rid: "NC0012SEC01B0012-9", status: "VALID" },
      { cls: "I", name: "CHOOH2 High-Pressure Pipeline Infrastructure", rid: "NC0012SEC01I0012-3", status: "VALID" }
    ],
    floors: [
      {
        floor_id: "NC-BLD-00012-F00",
        level_index: 0,
        label: "Ground Level — Automated CHOOH2 Refining Terminal",
        z_min: 3.0,
        z_max: 14.0,
        confidence: "AUTHORITATIVE",
        status: "VALID",
        strata_units: [
          {
            unit_id: "NC12-U00-REFINERY",
            name: "Fuel Cracking & Pipeline Manifold Hall",
            ifc_space: "IfcSpace:IndustrialUtility:F00",
            gross_area_sqm: 3200.0,
            share_value: "400/1000",
            rooms: [
              { name: "Superconducting Compressor Room", area_sqm: 1600.0 },
              { name: "Hazard Safety Command Center", area_sqm: 800.0 }
            ]
          }
        ]
      }
    ]
  }
];

