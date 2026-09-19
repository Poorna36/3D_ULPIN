// Mock data — Bengaluru buildings
// API contract: GET /api/buildings?city=bengaluru
// Data coverage: CBD (MG Road/UB City), Whitefield, Electronic City, Koramangala, Indiranagar, Hebbal, HSR Layout
// Coordinates: WGS84 EPSG:4326 — accurate GPS positions from OSM + BBMP GIS

const bengaluruBuildings = [
  // ──────────────────────────────────────────────────────────────────────────
  // CBD / MG ROAD CLUSTER
  // ──────────────────────────────────────────────────────────────────────────
  {
    building_id: "BLR-BLD-00001",
    name: "Prestige Skyline Tower",
    city: "bengaluru",
    lat: 12.9716, lon: 77.5946,
    ground_elevation: 920.5, roof_elevation: 1052.3, height: 131.8,
    floor_count: 38,
    source: "OSM + BBMP GIS", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-a3f9c2d1e4b7", data_label: "DERIVED",
    provenance: {
      source_dataset: "OpenStreetMap 2024-11 + BBMP GIS", crs: "EPSG:4326",
      acquired_at: "2024-11-15", processing_version: "0.1.0",
      operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643", "DEM-elevation-merge"]
    },
    floors: [
      { floor_id: "BLR-BLD-00001-F00", level_index: 0,  label: "Ground Floor",       z_min: 920.5, z_max: 924.0, confidence: "DERIVED",   status: "VALID" },
      { floor_id: "BLR-BLD-00001-F01", level_index: 1,  label: "Floor 1",            z_min: 924.0, z_max: 927.5, confidence: "DERIVED",   status: "VALID" },
      { floor_id: "BLR-BLD-00001-F02", level_index: 2,  label: "Floor 2",            z_min: 927.5, z_max: 931.0, confidence: "DERIVED",   status: "VALID" },
      { floor_id: "BLR-BLD-00001-B1",  level_index: -1, label: "Basement (Parking)", z_min: 917.0, z_max: 920.5, confidence: "INFERRED", status: "REVIEW" },
    ],
    validation_checks: [
      { id: "geom-valid",  label: "Geometry Valid",             status: "VALID" },
      { id: "z-range",     label: "Vertical Range (z_min<z_max)", status: "VALID" },
      { id: "parent-rel",  label: "Parent Parcel Relationship", status: "VALID" },
      { id: "overlap",     label: "No Unit Overlaps",           status: "VALID" },
      { id: "watertight",  label: "Watertight Solid",           status: "REVIEW" },
      { id: "id-unique",   label: "Identifier Uniqueness",      status: "VALID" },
      { id: "provenance",  label: "Provenance Complete",        status: "VALID" },
    ],
  },
  {
    building_id: "BLR-BLD-00002",
    name: "UB City Tower B",
    city: "bengaluru",
    lat: 12.9698, lon: 77.5985,
    ground_elevation: 918.2, roof_elevation: 1008.2, height: 90.0,
    floor_count: 26,
    source: "OSM + BBMP GIS", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-c8e2a5f0d391", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-11", crs: "EPSG:4326", acquired_at: "2024-11-15", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643"] },
    floors: [
      { floor_id: "BLR-BLD-00002-F00", level_index: 0, label: "Ground Floor", z_min: 918.2, z_max: 921.7, confidence: "DERIVED", status: "VALID" },
      { floor_id: "BLR-BLD-00002-F01", level_index: 1, label: "Floor 1",      z_min: 921.7, z_max: 925.2, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid",  label: "Geometry Valid",             status: "VALID" },
      { id: "z-range",     label: "Vertical Range",             status: "VALID" },
      { id: "parent-rel",  label: "Parent Parcel Relationship", status: "VALID" },
      { id: "overlap",     label: "No Unit Overlaps",           status: "VALID" },
      { id: "watertight",  label: "Watertight Solid",           status: "VALID" },
      { id: "id-unique",   label: "Identifier Uniqueness",      status: "VALID" },
      { id: "provenance",  label: "Provenance Complete",        status: "VALID" },
    ],
  },
  {
    building_id: "BLR-BLD-00003",
    name: "World Trade Center Bengaluru",
    city: "bengaluru",
    lat: 12.9670, lon: 77.5990,
    ground_elevation: 916.0, roof_elevation: 1096.0, height: 180.0,
    floor_count: 48,
    source: "OSM + BBMP GIS", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-d2f4e6a8c012", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-11 + BBMP GIS", crs: "EPSG:4326", acquired_at: "2024-11-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643", "DEM-elevation-merge"] },
    floors: [
      { floor_id: "BLR-BLD-00003-F00", level_index: 0,  label: "Ground Floor",       z_min: 916.0, z_max: 919.8, confidence: "DERIVED",   status: "VALID" },
      { floor_id: "BLR-BLD-00003-B1",  level_index: -1, label: "Basement P1",        z_min: 912.5, z_max: 916.0, confidence: "INFERRED",  status: "REVIEW" },
      { floor_id: "BLR-BLD-00003-B2",  level_index: -2, label: "Basement P2",        z_min: 909.0, z_max: 912.5, confidence: "SYNTHETIC", status: "REVIEW" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid", status: "VALID" },
      { id: "z-range",    label: "Vertical Range", status: "VALID" },
      { id: "overlap",    label: "No Unit Overlaps", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "BLR-BLD-00004",
    name: "Mantri Pinnacle",
    city: "bengaluru",
    lat: 12.9245, lon: 77.6234,
    ground_elevation: 892.0, roof_elevation: 1012.0, height: 120.0,
    floor_count: 34,
    source: "OSM", confidence: "DERIVED", validation_status: "REVIEW",
    prototype_3d_id: "3D-IN-BLR-f1b7e3a90c44", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-09", crs: "EPSG:4326", acquired_at: "2024-09-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643"] },
    floors: [
      { floor_id: "BLR-BLD-00004-F00", level_index: 0, label: "Ground Floor", z_min: 892.0, z_max: 895.5, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid",  label: "Geometry Valid",             status: "VALID" },
      { id: "z-range",     label: "Vertical Range",             status: "REVIEW" },
      { id: "parent-rel",  label: "Parent Parcel Relationship", status: "REVIEW" },
      { id: "overlap",     label: "No Unit Overlaps",           status: "VALID" },
      { id: "watertight",  label: "Watertight Solid",           status: "REVIEW" },
      { id: "id-unique",   label: "Identifier Uniqueness",      status: "VALID" },
      { id: "provenance",  label: "Provenance Complete",        status: "VALID" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // KORAMANGALA / HSR CLUSTER
  // ──────────────────────────────────────────────────────────────────────────
  {
    building_id: "BLR-BLD-00005",
    name: "RMZ Eco World Tower A",
    city: "bengaluru",
    lat: 12.9362, lon: 77.6328,
    ground_elevation: 888.0, roof_elevation: 1008.0, height: 120.0,
    floor_count: 32,
    source: "OSM + BBMP GIS", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-e5a1c3f7b209", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-11", crs: "EPSG:4326", acquired_at: "2024-11-15", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643"] },
    floors: [
      { floor_id: "BLR-BLD-00005-F00", level_index: 0, label: "Ground Floor", z_min: 888.0, z_max: 891.8, confidence: "DERIVED", status: "VALID" },
      { floor_id: "BLR-BLD-00005-F01", level_index: 1, label: "Floor 1",      z_min: 891.8, z_max: 895.6, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid",  status: "VALID" },
      { id: "z-range",    label: "Vertical Range",  status: "VALID" },
      { id: "overlap",    label: "No Unit Overlaps", status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "BLR-BLD-00006",
    name: "Salarpuria Sattva Knowledge Court",
    city: "bengaluru",
    lat: 12.9446, lon: 77.6320,
    ground_elevation: 891.0, roof_elevation: 986.0, height: 95.0,
    floor_count: 28,
    source: "OSM", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-b3d1e9f2a056", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-08", crs: "EPSG:4326", acquired_at: "2024-08-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643"] },
    floors: [
      { floor_id: "BLR-BLD-00006-F00", level_index: 0, label: "Ground Floor", z_min: 891.0, z_max: 894.4, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid",  status: "VALID" },
      { id: "z-range",    label: "Vertical Range",  status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "BLR-BLD-00007",
    name: "Sobha City Tower 1",
    city: "bengaluru",
    lat: 12.9718, lon: 77.5500,
    ground_elevation: 930.0, roof_elevation: 1060.0, height: 130.0,
    floor_count: 36,
    source: "OSM + BBMP GIS", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-a7c2d4e8f130", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-10 + BBMP GIS", crs: "EPSG:4326", acquired_at: "2024-10-15", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643"] },
    floors: [
      { floor_id: "BLR-BLD-00007-F00", level_index: 0,  label: "Ground Floor", z_min: 930.0, z_max: 933.6, confidence: "DERIVED",   status: "VALID" },
      { floor_id: "BLR-BLD-00007-B1",  level_index: -1, label: "Car Park B1",  z_min: 926.4, z_max: 930.0, confidence: "INFERRED",  status: "REVIEW" },
    ],
    validation_checks: [
      { id: "geom-valid",  label: "Geometry Valid",             status: "VALID" },
      { id: "z-range",     label: "Vertical Range",             status: "VALID" },
      { id: "overlap",     label: "No Unit Overlaps",           status: "VALID" },
      { id: "watertight",  label: "Watertight Solid",           status: "VALID" },
      { id: "id-unique",   label: "Identifier Uniqueness",      status: "VALID" },
      { id: "provenance",  label: "Provenance Complete",        status: "VALID" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // INDIRANAGAR / OLD AIRPORT ROAD CLUSTER
  // ──────────────────────────────────────────────────────────────────────────
  {
    building_id: "BLR-BLD-00008",
    name: "Embassy Manyata Tech Park Block E",
    city: "bengaluru",
    lat: 13.0452, lon: 77.6188,
    ground_elevation: 900.0, roof_elevation: 985.0, height: 85.0,
    floor_count: 22,
    source: "OSM", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-c4f6a8b0d222", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-11", crs: "EPSG:4326", acquired_at: "2024-11-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643"] },
    floors: [
      { floor_id: "BLR-BLD-00008-F00", level_index: 0, label: "Ground Floor", z_min: 900.0, z_max: 903.9, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid",  status: "VALID" },
      { id: "z-range",    label: "Vertical Range",  status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "BLR-BLD-00009",
    name: "RGA Tech Park Tower 1",
    city: "bengaluru",
    lat: 12.9567, lon: 77.6410,
    ground_elevation: 885.0, roof_elevation: 955.0, height: 70.0,
    floor_count: 18,
    source: "OSM", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-e0c2b4f6a334", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-09", crs: "EPSG:4326", acquired_at: "2024-09-15", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643"] },
    floors: [
      { floor_id: "BLR-BLD-00009-F00", level_index: 0, label: "Ground Floor", z_min: 885.0, z_max: 888.9, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid",  status: "VALID" },
      { id: "z-range",    label: "Vertical Range",  status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // WHITEFIELD CLUSTER
  // ──────────────────────────────────────────────────────────────────────────
  {
    building_id: "BLR-BLD-00010",
    name: "Prestige Tech Titan — Tower 1",
    city: "bengaluru",
    lat: 12.9698, lon: 77.7499,
    ground_elevation: 870.0, roof_elevation: 1000.0, height: 130.0,
    floor_count: 36,
    source: "OSM + BBMP GIS", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-f2a0b6c8d446", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-11 + BBMP GIS", crs: "EPSG:4326", acquired_at: "2024-11-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643", "DEM-elevation-merge"] },
    floors: [
      { floor_id: "BLR-BLD-00010-F00", level_index: 0,  label: "Ground Floor", z_min: 870.0, z_max: 873.6, confidence: "DERIVED",  status: "VALID" },
      { floor_id: "BLR-BLD-00010-B1",  level_index: -1, label: "Basement",     z_min: 866.4, z_max: 870.0, confidence: "INFERRED", status: "REVIEW" },
    ],
    validation_checks: [
      { id: "geom-valid",  label: "Geometry Valid",             status: "VALID" },
      { id: "z-range",     label: "Vertical Range",             status: "VALID" },
      { id: "overlap",     label: "No Unit Overlaps",           status: "VALID" },
      { id: "id-unique",   label: "Identifier Uniqueness",      status: "VALID" },
      { id: "provenance",  label: "Provenance Complete",        status: "VALID" },
    ],
  },
  {
    building_id: "BLR-BLD-00011",
    name: "ITPB - Block N",
    city: "bengaluru",
    lat: 12.9810, lon: 77.7295,
    ground_elevation: 868.0, roof_elevation: 938.0, height: 70.0,
    floor_count: 18,
    source: "OSM", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-b8d0a2c4e558", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-09", crs: "EPSG:4326", acquired_at: "2024-09-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643"] },
    floors: [
      { floor_id: "BLR-BLD-00011-F00", level_index: 0, label: "Ground Floor", z_min: 868.0, z_max: 871.9, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid",  status: "VALID" },
      { id: "z-range",    label: "Vertical Range",  status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "BLR-BLD-00012",
    name: "Cessna Business Park Tower 2",
    city: "bengaluru",
    lat: 12.9632, lon: 77.7150,
    ground_elevation: 872.0, roof_elevation: 952.0, height: 80.0,
    floor_count: 20,
    source: "OSM", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-c6e0a2f4b660", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-10", crs: "EPSG:4326", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643"] },
    floors: [
      { floor_id: "BLR-BLD-00012-F00", level_index: 0, label: "Ground Floor", z_min: 872.0, z_max: 876.0, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid",  status: "VALID" },
      { id: "z-range",    label: "Vertical Range",  status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // ELECTRONIC CITY CLUSTER
  // ──────────────────────────────────────────────────────────────────────────
  {
    building_id: "BLR-BLD-00013",
    name: "Infosys Electronic City Phase 2",
    city: "bengaluru",
    lat: 12.8458, lon: 77.6644,
    ground_elevation: 860.0, roof_elevation: 912.0, height: 52.0,
    floor_count: 14,
    source: "OSM", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-d4b2e0f6a772", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-09", crs: "EPSG:4326", acquired_at: "2024-09-15", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643"] },
    floors: [
      { floor_id: "BLR-BLD-00013-F00", level_index: 0, label: "Ground Floor", z_min: 860.0, z_max: 863.7, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid",  status: "VALID" },
      { id: "z-range",    label: "Vertical Range",  status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "BLR-BLD-00014",
    name: "Wipro EC Phase 1 Block A",
    city: "bengaluru",
    lat: 12.8398, lon: 77.6780,
    ground_elevation: 855.0, roof_elevation: 900.0, height: 45.0,
    floor_count: 12,
    source: "OSM", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-e2c4a6f8b884", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-09", crs: "EPSG:4326", acquired_at: "2024-09-15", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643"] },
    floors: [
      { floor_id: "BLR-BLD-00014-F00", level_index: 0, label: "Ground Floor", z_min: 855.0, z_max: 858.8, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid",  status: "VALID" },
      { id: "z-range",    label: "Vertical Range",  status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // HEBBAL / NORTH BENGALURU CLUSTER
  // ──────────────────────────────────────────────────────────────────────────
  {
    building_id: "BLR-BLD-00015",
    name: "Embassy Springs Tower B",
    city: "bengaluru",
    lat: 13.0480, lon: 77.5900,
    ground_elevation: 905.0, roof_elevation: 1035.0, height: 130.0,
    floor_count: 36,
    source: "OSM + BBMP GIS", confidence: "DERIVED_HIGH", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-f0e2c4a6b996", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-11 + BBMP GIS", crs: "EPSG:4326", acquired_at: "2024-11-15", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643", "DEM-elevation-merge"] },
    floors: [
      { floor_id: "BLR-BLD-00015-F00", level_index: 0,  label: "Ground Floor", z_min: 905.0, z_max: 908.6, confidence: "DERIVED",  status: "VALID" },
      { floor_id: "BLR-BLD-00015-B1",  level_index: -1, label: "Basement",     z_min: 901.4, z_max: 905.0, confidence: "INFERRED", status: "REVIEW" },
    ],
    validation_checks: [
      { id: "geom-valid",  label: "Geometry Valid",    status: "VALID" },
      { id: "z-range",     label: "Vertical Range",    status: "VALID" },
      { id: "overlap",     label: "No Unit Overlaps",  status: "VALID" },
      { id: "id-unique",   label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance",  label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "BLR-BLD-00016",
    name: "Karle Town Centre Tower 1",
    city: "bengaluru",
    lat: 13.0320, lon: 77.5808,
    ground_elevation: 908.0, roof_elevation: 1058.0, height: 150.0,
    floor_count: 42,
    source: "OSM", confidence: "DERIVED", validation_status: "REVIEW",
    prototype_3d_id: "3D-IN-BLR-a2d4c6b8e0aa", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-10", crs: "EPSG:4326", acquired_at: "2024-10-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643"] },
    floors: [
      { floor_id: "BLR-BLD-00016-F00", level_index: 0, label: "Ground Floor", z_min: 908.0, z_max: 911.6, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid",  label: "Geometry Valid",             status: "VALID" },
      { id: "z-range",     label: "Vertical Range",             status: "REVIEW" },
      { id: "parent-rel",  label: "Parent Parcel Relationship", status: "REVIEW" },
      { id: "watertight",  label: "Watertight Solid",           status: "REVIEW" },
      { id: "id-unique",   label: "Identifier Uniqueness",      status: "VALID" },
      { id: "provenance",  label: "Provenance Complete",        status: "VALID" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // BANNERGHATTA / SOUTH CLUSTER
  // ──────────────────────────────────────────────────────────────────────────
  {
    building_id: "BLR-BLD-00017",
    name: "Prestige Falcon City Tower A",
    city: "bengaluru",
    lat: 12.8812, lon: 77.5746,
    ground_elevation: 895.0, roof_elevation: 1015.0, height: 120.0,
    floor_count: 32,
    source: "OSM + BBMP GIS", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-b4f6d8a0c2bb", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-11", crs: "EPSG:4326", acquired_at: "2024-11-15", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643"] },
    floors: [
      { floor_id: "BLR-BLD-00017-F00", level_index: 0, label: "Ground Floor", z_min: 895.0, z_max: 898.8, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid",  status: "VALID" },
      { id: "z-range",    label: "Vertical Range",  status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
      { id: "provenance", label: "Provenance Complete", status: "VALID" },
    ],
  },
  {
    building_id: "BLR-BLD-00018",
    name: "Meenakshi Towers Jayanagar",
    city: "bengaluru",
    lat: 12.9258, lon: 77.5855,
    ground_elevation: 910.0, roof_elevation: 980.0, height: 70.0,
    floor_count: 18,
    source: "OSM", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-c0e2a4b6d8cc", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-08", crs: "EPSG:4326", acquired_at: "2024-08-15", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643"] },
    floors: [
      { floor_id: "BLR-BLD-00018-F00", level_index: 0, label: "Ground Floor", z_min: 910.0, z_max: 913.9, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid",  status: "VALID" },
      { id: "z-range",    label: "Vertical Range",  status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // UNDERGROUND & INFRASTRUCTURE
  // ──────────────────────────────────────────────────────────────────────────
  {
    building_id: "BLR-INF-00001",
    name: "Namma Metro — MG Road Underground",
    city: "bengaluru",
    lat: 12.9752, lon: 77.6070,
    ground_elevation: 920.0, roof_elevation: 920.0, height: -8.0,
    floor_count: 1,
    source: "SYNTHETIC", confidence: "SYNTHETIC", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-UG-e8d2c1a04f55", data_label: "SYNTHETIC",
    is_underground: true,
    provenance: { source_dataset: "Synthetic Demo Fixture v0.1", crs: "EPSG:4326", acquired_at: "2024-11-15", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: [] },
    floors: [
      { floor_id: "BLR-INF-00001-U1", level_index: -1, label: "Underground Volume", z_min: 912.0, z_max: 920.0, confidence: "SYNTHETIC", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid",        status: "VALID" },
      { id: "z-range",    label: "Vertical Range",        status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
    ],
  },
  {
    building_id: "BLR-INF-00002",
    name: "Namma Metro — Indiranagar Underground Station",
    city: "bengaluru",
    lat: 12.9784, lon: 77.6408,
    ground_elevation: 914.0, roof_elevation: 914.0, height: -6.5,
    floor_count: 1,
    source: "SYNTHETIC", confidence: "SYNTHETIC", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-UG-f9c1d0b3a066", data_label: "SYNTHETIC",
    is_underground: true,
    provenance: { source_dataset: "Synthetic Demo Fixture v0.1", crs: "EPSG:4326", acquired_at: "2024-11-15", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: [] },
    floors: [
      { floor_id: "BLR-INF-00002-U1", level_index: -1, label: "Underground Platform", z_min: 907.5, z_max: 914.0, confidence: "SYNTHETIC", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid",        status: "VALID" },
      { id: "z-range",    label: "Vertical Range",        status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // ADDITIONAL RESIDENTIAL / MID-RISE LANDMARKS
  // ──────────────────────────────────────────────────────────────────────────
  {
    building_id: "BLR-BLD-00019",
    name: "The Leela Palace Hotel",
    city: "bengaluru",
    lat: 12.9622, lon: 77.6472,
    ground_elevation: 895.0, roof_elevation: 965.0, height: 70.0,
    floor_count: 19,
    source: "OSM", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-a6b8c0d2e4dd", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-08", crs: "EPSG:4326", acquired_at: "2024-08-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643"] },
    floors: [
      { floor_id: "BLR-BLD-00019-F00", level_index: 0, label: "Ground Floor", z_min: 895.0, z_max: 898.7, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid",  status: "VALID" },
      { id: "z-range",    label: "Vertical Range",  status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
    ],
  },
  {
    building_id: "BLR-BLD-00020",
    name: "ITC Windsor Hotel",
    city: "bengaluru",
    lat: 12.9608, lon: 77.5860,
    ground_elevation: 921.0, roof_elevation: 981.0, height: 60.0,
    floor_count: 16,
    source: "OSM", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-b2d4e6c8a0ee", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-07", crs: "EPSG:4326", acquired_at: "2024-07-01", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643"] },
    floors: [
      { floor_id: "BLR-BLD-00020-F00", level_index: 0, label: "Ground Floor", z_min: 921.0, z_max: 924.8, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid",  status: "VALID" },
      { id: "z-range",    label: "Vertical Range",  status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
    ],
  },
  {
    building_id: "BLR-BLD-00021",
    name: "Bagmane Tech Park Tower 3",
    city: "bengaluru",
    lat: 12.9907, lon: 77.6428,
    ground_elevation: 898.0, roof_elevation: 968.0, height: 70.0,
    floor_count: 18,
    source: "OSM", confidence: "DERIVED", validation_status: "VALID",
    prototype_3d_id: "3D-IN-BLR-c4e6f8a2b0ff", data_label: "DERIVED",
    provenance: { source_dataset: "OpenStreetMap 2024-09", crs: "EPSG:4326", acquired_at: "2024-09-15", processing_version: "0.1.0", operator: "PROTOTYPE-PIPELINE", transformations: ["WGS84→EPSG:32643"] },
    floors: [
      { floor_id: "BLR-BLD-00021-F00", level_index: 0, label: "Ground Floor", z_min: 898.0, z_max: 901.9, confidence: "DERIVED", status: "VALID" },
    ],
    validation_checks: [
      { id: "geom-valid", label: "Geometry Valid",  status: "VALID" },
      { id: "z-range",    label: "Vertical Range",  status: "VALID" },
      { id: "id-unique",  label: "Identifier Uniqueness", status: "VALID" },
    ],
  },
];

export default bengaluruBuildings;
