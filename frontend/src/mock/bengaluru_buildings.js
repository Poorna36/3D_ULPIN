// Mock data — Bengaluru buildings
// Fully conforming to 3D ULPIN 11 backend specification docs
// 10 classes, canonical RIDs with ISO 7064 check symbol, Natural Key, 63-bit Morton, and T0-T5 validation.

const bengaluruBuildings = [
  {
    "building_id": "BLR-BLD-00001",
    "name": "Prestige Skyline Tower",
    "city": "bengaluru",
    "lat": 12.9716,
    "lon": 77.5946,
    "ground_elevation": 920.5,
    "roof_elevation": 1052.3,
    "height": 131.8,
    "floor_count": 38,
    "source": "Cadastral GIS + BBMP GIS",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-a3f9c2d1e4b7",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-11 + BBMP GIS",
      "crs": "EPSG:4326",
      "acquired_at": "2024-11-15",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643",
        "DEM-elevation-merge"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00001-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 920.5,
        "z_max": 924,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "BLR-BLD-00001-F01",
        "level_index": 1,
        "label": "Floor 1",
        "z_min": 924,
        "z_max": 927.5,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "BLR-BLD-00001-F02",
        "level_index": 2,
        "label": "Floor 2",
        "z_min": 927.5,
        "z_max": 931,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "BLR-BLD-00001-B1",
        "level_index": -1,
        "label": "Basement (Parking)",
        "z_min": 917,
        "z_max": 920.5,
        "confidence": "INFERRED",
        "status": "REVIEW"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range (z_min<z_max)",
        "status": "VALID"
      },
      {
        "id": "parent-rel",
        "label": "Parent Parcel Relationship",
        "status": "VALID"
      },
      {
        "id": "overlap",
        "label": "No Unit Overlaps",
        "status": "VALID"
      },
      {
        "id": "watertight",
        "label": "Watertight Solid",
        "status": "REVIEW"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      },
      {
        "id": "provenance",
        "label": "Provenance Complete",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000001",
    "canonical_rid": "IN-KA-BLR-0000-B0001-B00001-8",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A2DBE-B32-BV1",
      "locator": "0x70583C8DD138F546",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x70583C8DD138F546",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A2DBEA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0001-B00001-8",
        "z_range": [
          0,
          131.8
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0001-L00001-Y",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "38 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0001-U00101-5",
        "z_range": [
          4,
          121.80000000000001
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0001-C00001-I",
        "z_range": [
          0,
          131.8
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0001-P00001-Z",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0001-A00001-P",
        "z_range": [
          131.8,
          156.8
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "WARN",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "FAIL",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-01-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1000",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00010",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000001",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.66%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_DISPUTED",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "STATE_SPECIFIC",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": false
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "FAIL",
        "findings": [
          {
            "finding_id": "FINDING-BLR-001",
            "finding_type": "UTILITY_WITHOUT_EASEMENT",
            "severity": "FAIL",
            "rule_id": "T2.OVERLAP.UTILITY",
            "message": "Municipal storm drain (raja kaluve, Class I) intersects basement without a registered easement Right."
          }
        ]
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "FAIL",
        "findings": []
      }
    ],
    "explain_objects": [
      {
        "finding_id": "EXPLAIN-BLR-001",
        "finding_type": "UTILITY_WITHOUT_EASEMENT",
        "severity": "FAIL",
        "confidence": 0.98,
        "rule": {
          "rule_id": "T2.OVERLAP.UTILITY",
          "description": "Utility corridor (Class I) intersecting ownership volume (Class U/P) requires registered easement Right",
          "tolerance": "epsilon_v = 0.00 m³",
          "policy_reference": "Indian Easements Act 1882 + K-RERA Title Verification"
        },
        "evidence": {
          "evidence_ids": [
            "EV-BBMP-DRAIN-CADASTRE",
            "EV-TERRESTRIAL-BIM-E3"
          ],
          "evidence_class": "E5 (GPR Subsurface) + E3 (BIM)",
          "sigma_measurement": 0.08,
          "data_provenance": [
            "REAL",
            "PROXY"
          ]
        },
        "geometry_overlay": {
          "expected": "Parcel boundary with buffer clearance",
          "observed": "Encroachment into 12m natural drain buffer",
          "intersection": "Basement P1 northwest corner intersects drain channel",
          "magnitude": "14.2 m³ volumetric overlap"
        },
        "plan_version": "BBMP-SANCTION-2018-REV4",
        "affected_rids": [
          "IN-KA-BLR-0000-B0001-B00001-8",
          "IN-KA-BLR-0000-B0000-I00001-L"
        ],
        "examiner_action": null,
        "override_history": []
      }
    ],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00002",
    "name": "UB City Tower B",
    "city": "bengaluru",
    "lat": 12.9698,
    "lon": 77.5985,
    "ground_elevation": 918.2,
    "roof_elevation": 1008.2,
    "height": 90,
    "floor_count": 26,
    "source": "Cadastral GIS + BBMP GIS",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-c8e2a5f0d391",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-11",
      "crs": "EPSG:4326",
      "acquired_at": "2024-11-15",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00002-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 918.2,
        "z_max": 921.7,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "BLR-BLD-00002-F01",
        "level_index": 1,
        "label": "Floor 1",
        "z_min": 921.7,
        "z_max": 925.2,
        "confidence": "DERIVED",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "parent-rel",
        "label": "Parent Parcel Relationship",
        "status": "VALID"
      },
      {
        "id": "overlap",
        "label": "No Unit Overlaps",
        "status": "VALID"
      },
      {
        "id": "watertight",
        "label": "Watertight Solid",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      },
      {
        "id": "provenance",
        "label": "Provenance Complete",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000002",
    "canonical_rid": "IN-KA-BLR-0000-B0002-B00001-S",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A2D92-B32-BV1",
      "locator": "0x70583C84F5BC0389",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x70583C84F5BC0389",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A2D92A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0002-B00001-S",
        "z_range": [
          0,
          90
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0002-L00001-H",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "26 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0002-U00101-P",
        "z_range": [
          4,
          80
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0002-C00001-1",
        "z_range": [
          0,
          90
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0002-P00001-K",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0002-A00001-I",
        "z_range": [
          90,
          115
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-02-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1001",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00011",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000002",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.96%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00003",
    "name": "World Trade Center Bengaluru",
    "city": "bengaluru",
    "lat": 12.967,
    "lon": 77.599,
    "ground_elevation": 916,
    "roof_elevation": 1096,
    "height": 180,
    "floor_count": 48,
    "source": "Cadastral GIS + BBMP GIS",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-d2f4e6a8c012",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-11 + BBMP GIS",
      "crs": "EPSG:4326",
      "acquired_at": "2024-11-01",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643",
        "DEM-elevation-merge"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00003-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 916,
        "z_max": 919.8,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "BLR-BLD-00003-B1",
        "level_index": -1,
        "label": "Basement P1",
        "z_min": 912.5,
        "z_max": 916,
        "confidence": "INFERRED",
        "status": "REVIEW"
      },
      {
        "floor_id": "BLR-BLD-00003-B2",
        "level_index": -2,
        "label": "Basement P2",
        "z_min": 909,
        "z_max": 912.5,
        "confidence": "SYNTHETIC",
        "status": "REVIEW"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "overlap",
        "label": "No Unit Overlaps",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      },
      {
        "id": "provenance",
        "label": "Provenance Complete",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000003",
    "canonical_rid": "IN-KA-BLR-0000-B0003-B00001-B",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A2DB2-B32-BV1",
      "locator": "0x70582ECCF5A5427E",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x70582ECCF5A5427E",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A2DB2A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0003-B00001-B",
        "z_range": [
          0,
          180
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0003-L00001-Z",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "48 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0003-U00101-8",
        "z_range": [
          4,
          170
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0003-C00001-L",
        "z_range": [
          0,
          180
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0003-P00001-3",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0003-A00001-1",
        "z_range": [
          180,
          205
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-03-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1002",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00012",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000003",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.52%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00004",
    "name": "Mantri Pinnacle",
    "city": "bengaluru",
    "lat": 12.9245,
    "lon": 77.6234,
    "ground_elevation": 892,
    "roof_elevation": 1012,
    "height": 120,
    "floor_count": 34,
    "source": "Cadastral GIS",
    "confidence": "DERIVED",
    "validation_status": "REVIEW",
    "prototype_3d_id": "3D-IN-BLR-f1b7e3a90c44",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-09",
      "crs": "EPSG:4326",
      "acquired_at": "2024-09-01",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00004-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 892,
        "z_max": 895.5,
        "confidence": "DERIVED",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "REVIEW"
      },
      {
        "id": "parent-rel",
        "label": "Parent Parcel Relationship",
        "status": "REVIEW"
      },
      {
        "id": "overlap",
        "label": "No Unit Overlaps",
        "status": "VALID"
      },
      {
        "id": "watertight",
        "label": "Watertight Solid",
        "status": "REVIEW"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      },
      {
        "id": "provenance",
        "label": "Provenance Complete",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000004",
    "canonical_rid": "IN-KA-BLR-0000-B0004-B00001-V",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A20F4-B32-BV1",
      "locator": "0x397CBE84E80773C4",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x397CBE84E80773C4",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A20F4A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0004-B00001-V",
        "z_range": [
          0,
          120
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0004-L00001-K",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "34 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0004-U00101-S",
        "z_range": [
          4,
          110
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0004-C00001-4",
        "z_range": [
          0,
          120
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0004-P00001-N",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0004-A00001-L",
        "z_range": [
          120,
          145
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-04-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1003",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00013",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000004",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.74%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00005",
    "name": "RMZ Eco World Tower A",
    "city": "bengaluru",
    "lat": 12.9362,
    "lon": 77.6328,
    "ground_elevation": 888,
    "roof_elevation": 1008,
    "height": 120,
    "floor_count": 32,
    "source": "Cadastral GIS + BBMP GIS",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-e5a1c3f7b209",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-11",
      "crs": "EPSG:4326",
      "acquired_at": "2024-11-15",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00005-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 888,
        "z_max": 891.8,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "BLR-BLD-00005-F01",
        "level_index": 1,
        "label": "Floor 1",
        "z_min": 891.8,
        "z_max": 895.6,
        "confidence": "DERIVED",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "overlap",
        "label": "No Unit Overlaps",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      },
      {
        "id": "provenance",
        "label": "Provenance Complete",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000005",
    "canonical_rid": "IN-KA-BLR-0000-B0005-B00001-E",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A21DE-B32-BV1",
      "locator": "0x397CBCC4EC71748B",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x397CBCC4EC71748B",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A21DEA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0005-B00001-E",
        "z_range": [
          0,
          120
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0005-L00001-3",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "32 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0005-U00101-B",
        "z_range": [
          4,
          110
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0005-C00001-O",
        "z_range": [
          0,
          120
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0005-P00001-6",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0005-A00001-4",
        "z_range": [
          120,
          145
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-05-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1004",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00014",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000005",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.78%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00006",
    "name": "Salarpuria Sattva Knowledge Court",
    "city": "bengaluru",
    "lat": 12.9446,
    "lon": 77.632,
    "ground_elevation": 891,
    "roof_elevation": 986,
    "height": 95,
    "floor_count": 28,
    "source": "Cadastral GIS",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-b3d1e9f2a056",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-08",
      "crs": "EPSG:4326",
      "acquired_at": "2024-08-01",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00006-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 891,
        "z_max": 894.4,
        "confidence": "DERIVED",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      },
      {
        "id": "provenance",
        "label": "Provenance Complete",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000006",
    "canonical_rid": "IN-KA-BLR-0000-B0006-B00001-Y",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A2123-B32-BV1",
      "locator": "0x397CBCCDEA326FD8",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x397CBCCDEA326FD8",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A2123A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0006-B00001-Y",
        "z_range": [
          0,
          95
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0006-L00001-N",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "28 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0006-U00101-V",
        "z_range": [
          4,
          85
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0006-C00001-7",
        "z_range": [
          0,
          95
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0006-P00001-Q",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0006-A00001-O",
        "z_range": [
          95,
          120
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-06-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1005",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00015",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000006",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.89%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00007",
    "name": "Sobha City Tower 1",
    "city": "bengaluru",
    "lat": 12.9718,
    "lon": 77.55,
    "ground_elevation": 930,
    "roof_elevation": 1060,
    "height": 130,
    "floor_count": 36,
    "source": "Cadastral GIS + BBMP GIS",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-a7c2d4e8f130",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-10 + BBMP GIS",
      "crs": "EPSG:4326",
      "acquired_at": "2024-10-15",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00007-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 930,
        "z_max": 933.6,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "BLR-BLD-00007-B1",
        "level_index": -1,
        "label": "Car Park B1",
        "z_min": 926.4,
        "z_max": 930,
        "confidence": "INFERRED",
        "status": "REVIEW"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "overlap",
        "label": "No Unit Overlaps",
        "status": "VALID"
      },
      {
        "id": "watertight",
        "label": "Watertight Solid",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      },
      {
        "id": "provenance",
        "label": "Provenance Complete",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000007",
    "canonical_rid": "IN-KA-BLR-0000-B0007-B00001-7",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A2FFC-B32-BV1",
      "locator": "0x70583E8DF4AAF516",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x70583E8DF4AAF516",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A2FFCA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0007-B00001-7",
        "z_range": [
          0,
          130
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0007-L00001-X",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "36 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0007-U00101-4",
        "z_range": [
          4,
          120
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0007-C00001-H",
        "z_range": [
          0,
          130
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0007-P00001-0",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0007-A00001-Y",
        "z_range": [
          130,
          155
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-07-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1006",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00016",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000007",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.69%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00008",
    "name": "Embassy Manyata Tech Park Block E",
    "city": "bengaluru",
    "lat": 13.0452,
    "lon": 77.6188,
    "ground_elevation": 900,
    "roof_elevation": 985,
    "height": 85,
    "floor_count": 22,
    "source": "Cadastral GIS",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-c4f6a8b0d222",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-11",
      "crs": "EPSG:4326",
      "acquired_at": "2024-11-01",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00008-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 900,
        "z_max": 903.9,
        "confidence": "DERIVED",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      },
      {
        "id": "provenance",
        "label": "Provenance Complete",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000008",
    "canonical_rid": "IN-KA-BLR-0000-B0008-B00001-R",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A2A68-B32-BV1",
      "locator": "0x397CBEE96ED76937",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x397CBEE96ED76937",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A2A68A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0008-B00001-R",
        "z_range": [
          0,
          85
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0008-L00001-G",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "22 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0008-U00101-O",
        "z_range": [
          4,
          75
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0008-C00001-Z",
        "z_range": [
          0,
          85
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0008-P00001-J",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0008-A00001-H",
        "z_range": [
          85,
          110
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-08-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1007",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00017",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000008",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "1.14%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00009",
    "name": "RGA Tech Park Tower 1",
    "city": "bengaluru",
    "lat": 12.9567,
    "lon": 77.641,
    "ground_elevation": 885,
    "roof_elevation": 955,
    "height": 70,
    "floor_count": 18,
    "source": "Cadastral GIS",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-e0c2b4f6a334",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-09",
      "crs": "EPSG:4326",
      "acquired_at": "2024-09-15",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00009-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 885,
        "z_max": 888.9,
        "confidence": "DERIVED",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      },
      {
        "id": "provenance",
        "label": "Provenance Complete",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000009",
    "canonical_rid": "IN-KA-BLR-0000-B0009-B00001-A",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A22CD-B32-BV1",
      "locator": "0x397CBC8CCA67051A",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x397CBC8CCA67051A",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A22CDA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0009-B00001-A",
        "z_range": [
          0,
          70
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0009-L00001-0",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "18 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0009-U00101-7",
        "z_range": [
          4,
          60
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0009-C00001-K",
        "z_range": [
          0,
          70
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0009-P00001-2",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0009-A00001-Z",
        "z_range": [
          70,
          95
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-09-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1008",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00018",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000009",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "1.39%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00010",
    "name": "Prestige Tech Titan — Tower 1",
    "city": "bengaluru",
    "lat": 12.9698,
    "lon": 77.7499,
    "ground_elevation": 870,
    "roof_elevation": 1000,
    "height": 130,
    "floor_count": 36,
    "source": "Cadastral GIS + BBMP GIS",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-f2a0b6c8d446",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-11 + BBMP GIS",
      "crs": "EPSG:4326",
      "acquired_at": "2024-11-01",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643",
        "DEM-elevation-merge"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00010-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 870,
        "z_max": 873.6,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "BLR-BLD-00010-B1",
        "level_index": -1,
        "label": "Basement",
        "z_min": 866.4,
        "z_max": 870,
        "confidence": "INFERRED",
        "status": "REVIEW"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "overlap",
        "label": "No Unit Overlaps",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      },
      {
        "id": "provenance",
        "label": "Provenance Complete",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000010",
    "canonical_rid": "IN-KA-BLR-0000-B0010-B00001-S",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A27B0-B32-BV1",
      "locator": "0x397CACC691189AC5",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x397CACC691189AC5",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A27B0A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0010-B00001-S",
        "z_range": [
          0,
          130
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0010-L00001-H",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "36 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0010-U00101-P",
        "z_range": [
          4,
          120
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0010-C00001-1",
        "z_range": [
          0,
          130
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0010-P00001-K",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0010-A00001-I",
        "z_range": [
          130,
          155
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-010-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1009",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00019",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000010",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.69%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00011",
    "name": "ITPB - Block N",
    "city": "bengaluru",
    "lat": 12.981,
    "lon": 77.7295,
    "ground_elevation": 868,
    "roof_elevation": 938,
    "height": 70,
    "floor_count": 18,
    "source": "Cadastral GIS",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-b8d0a2c4e558",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-09",
      "crs": "EPSG:4326",
      "acquired_at": "2024-09-01",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00011-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 868,
        "z_max": 871.9,
        "confidence": "DERIVED",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      },
      {
        "id": "provenance",
        "label": "Provenance Complete",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000011",
    "canonical_rid": "IN-KA-BLR-0000-B0011-B00001-B",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A2757-B32-BV1",
      "locator": "0x397CAC8E90FC41FE",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x397CAC8E90FC41FE",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A2757A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0011-B00001-B",
        "z_range": [
          0,
          70
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0011-L00001-Z",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "18 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0011-U00101-8",
        "z_range": [
          4,
          60
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0011-C00001-L",
        "z_range": [
          0,
          70
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0011-P00001-3",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0011-A00001-1",
        "z_range": [
          70,
          95
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-011-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1010",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00020",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000011",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "1.39%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00012",
    "name": "Cessna Business Park Tower 2",
    "city": "bengaluru",
    "lat": 12.9632,
    "lon": 77.715,
    "ground_elevation": 872,
    "roof_elevation": 952,
    "height": 80,
    "floor_count": 20,
    "source": "Cadastral GIS",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-c6e0a2f4b660",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-10",
      "crs": "EPSG:4326",
      "acquired_at": "2024-10-01",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00012-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 872,
        "z_max": 876,
        "confidence": "DERIVED",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000012",
    "canonical_rid": "IN-KA-BLR-0000-B0012-B00001-V",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A21D5-B32-BV1",
      "locator": "0x397CACC7A6CFF993",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x397CACC7A6CFF993",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A21D5A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0012-B00001-V",
        "z_range": [
          0,
          80
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0012-L00001-K",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "20 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0012-U00101-S",
        "z_range": [
          4,
          70
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0012-C00001-4",
        "z_range": [
          0,
          80
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0012-P00001-N",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0012-A00001-L",
        "z_range": [
          80,
          105
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-012-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1011",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00021",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000012",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "1.25%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00013",
    "name": "Infosys Electronic City Phase 2",
    "city": "bengaluru",
    "lat": 12.8458,
    "lon": 77.6644,
    "ground_elevation": 860,
    "roof_elevation": 912,
    "height": 52,
    "floor_count": 14,
    "source": "Cadastral GIS",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-d4b2e0f6a772",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-09",
      "crs": "EPSG:4326",
      "acquired_at": "2024-09-15",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00013-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 860,
        "z_max": 863.7,
        "confidence": "DERIVED",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      },
      {
        "id": "provenance",
        "label": "Provenance Complete",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000013",
    "canonical_rid": "IN-KA-BLR-0000-B0013-B00001-E",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A2C02-B32-BV1",
      "locator": "0x397C3E8C6D442F9F",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x397C3E8C6D442F9F",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A2C02A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0013-B00001-E",
        "z_range": [
          0,
          52
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0013-L00001-3",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "14 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0013-U00101-B",
        "z_range": [
          4,
          42
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0013-C00001-O",
        "z_range": [
          0,
          52
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0013-P00001-6",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0013-A00001-4",
        "z_range": [
          52,
          77
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-013-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1012",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00022",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000013",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "1.79%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00014",
    "name": "Wipro EC Phase 1 Block A",
    "city": "bengaluru",
    "lat": 12.8398,
    "lon": 77.678,
    "ground_elevation": 855,
    "roof_elevation": 900,
    "height": 45,
    "floor_count": 12,
    "source": "Cadastral GIS",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-e2c4a6f8b884",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-09",
      "crs": "EPSG:4326",
      "acquired_at": "2024-09-15",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00014-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 855,
        "z_max": 858.8,
        "confidence": "DERIVED",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000014",
    "canonical_rid": "IN-KA-BLR-0000-B0014-B00001-Y",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A2FCF-B32-BV1",
      "locator": "0x397C3CCC493A3F2E",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x397C3CCC493A3F2E",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A2FCFA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0014-B00001-Y",
        "z_range": [
          0,
          45
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0014-L00001-N",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "12 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0014-U00101-V",
        "z_range": [
          4,
          35
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0014-C00001-7",
        "z_range": [
          0,
          45
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0014-P00001-Q",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0014-A00001-O",
        "z_range": [
          45,
          70
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-014-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1013",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00023",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000014",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "2.08%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00015",
    "name": "Embassy Springs Tower B",
    "city": "bengaluru",
    "lat": 13.048,
    "lon": 77.59,
    "ground_elevation": 905,
    "roof_elevation": 1035,
    "height": 130,
    "floor_count": 36,
    "source": "Cadastral GIS + BBMP GIS",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-f0e2c4a6b996",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-11 + BBMP GIS",
      "crs": "EPSG:4326",
      "acquired_at": "2024-11-15",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643",
        "DEM-elevation-merge"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00015-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 905,
        "z_max": 908.6,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "BLR-BLD-00015-B1",
        "level_index": -1,
        "label": "Basement",
        "z_min": 901.4,
        "z_max": 905,
        "confidence": "INFERRED",
        "status": "REVIEW"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "overlap",
        "label": "No Unit Overlaps",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      },
      {
        "id": "provenance",
        "label": "Provenance Complete",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000015",
    "canonical_rid": "IN-KA-BLR-0000-B0015-B00001-7",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A2B62-B32-BV1",
      "locator": "0x70582CE063E87B17",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x70582CE063E87B17",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A2B62A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0015-B00001-7",
        "z_range": [
          0,
          130
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0015-L00001-X",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "36 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0015-U00101-4",
        "z_range": [
          4,
          120
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0015-C00001-H",
        "z_range": [
          0,
          130
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0015-P00001-0",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0015-A00001-Y",
        "z_range": [
          130,
          155
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-015-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1014",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00024",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000015",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.69%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00016",
    "name": "Karle Town Centre Tower 1",
    "city": "bengaluru",
    "lat": 13.032,
    "lon": 77.5808,
    "ground_elevation": 908,
    "roof_elevation": 1058,
    "height": 150,
    "floor_count": 42,
    "source": "Cadastral GIS",
    "confidence": "DERIVED",
    "validation_status": "REVIEW",
    "prototype_3d_id": "3D-IN-BLR-a2d4c6b8e0aa",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-10",
      "crs": "EPSG:4326",
      "acquired_at": "2024-10-01",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00016-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 908,
        "z_max": 911.6,
        "confidence": "DERIVED",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "REVIEW"
      },
      {
        "id": "parent-rel",
        "label": "Parent Parcel Relationship",
        "status": "REVIEW"
      },
      {
        "id": "watertight",
        "label": "Watertight Solid",
        "status": "REVIEW"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      },
      {
        "id": "provenance",
        "label": "Provenance Complete",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000016",
    "canonical_rid": "IN-KA-BLR-0000-B0016-B00001-R",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A2B9F-B32-BV1",
      "locator": "0x70582CE94794AC46",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x70582CE94794AC46",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A2B9FA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0016-B00001-R",
        "z_range": [
          0,
          150
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0016-L00001-G",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "42 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0016-U00101-O",
        "z_range": [
          4,
          140
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0016-C00001-Z",
        "z_range": [
          0,
          150
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0016-P00001-J",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0016-A00001-H",
        "z_range": [
          150,
          175
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-016-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1015",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00025",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000016",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.60%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00017",
    "name": "Prestige Falcon City Tower A",
    "city": "bengaluru",
    "lat": 12.8812,
    "lon": 77.5746,
    "ground_elevation": 895,
    "roof_elevation": 1015,
    "height": 120,
    "floor_count": 32,
    "source": "Cadastral GIS + BBMP GIS",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-b4f6d8a0c2bb",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-11",
      "crs": "EPSG:4326",
      "acquired_at": "2024-11-15",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00017-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 895,
        "z_max": 898.8,
        "confidence": "DERIVED",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      },
      {
        "id": "provenance",
        "label": "Provenance Complete",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000017",
    "canonical_rid": "IN-KA-BLR-0000-B0017-B00001-A",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A217E-B32-BV1",
      "locator": "0x397CBE8D55172484",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x397CBE8D55172484",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A217EA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0017-B00001-A",
        "z_range": [
          0,
          120
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0017-L00001-0",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "32 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0017-U00101-7",
        "z_range": [
          4,
          110
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0017-C00001-K",
        "z_range": [
          0,
          120
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0017-P00001-2",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0017-A00001-Z",
        "z_range": [
          120,
          145
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-017-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1016",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00026",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000017",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.78%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00018",
    "name": "Meenakshi Towers Jayanagar",
    "city": "bengaluru",
    "lat": 12.9258,
    "lon": 77.5855,
    "ground_elevation": 910,
    "roof_elevation": 980,
    "height": 70,
    "floor_count": 18,
    "source": "Cadastral GIS",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-c0e2a4b6d8cc",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-08",
      "crs": "EPSG:4326",
      "acquired_at": "2024-08-15",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00018-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 910,
        "z_max": 913.9,
        "confidence": "DERIVED",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000018",
    "canonical_rid": "IN-KA-BLR-0000-B0018-B00001-U",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A2E54-B32-BV1",
      "locator": "0x70582E85C50EDB5B",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x70582E85C50EDB5B",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A2E54A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0018-B00001-U",
        "z_range": [
          0,
          70
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0018-L00001-J",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "18 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0018-U00101-Z",
        "z_range": [
          4,
          60
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0018-C00001-3",
        "z_range": [
          0,
          70
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0018-P00001-M",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0018-A00001-K",
        "z_range": [
          70,
          95
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-018-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1017",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00027",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000018",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "1.39%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-INF-00001",
    "name": "Namma Metro — MG Road Underground",
    "city": "bengaluru",
    "lat": 12.9752,
    "lon": 77.607,
    "ground_elevation": 920,
    "roof_elevation": 920,
    "height": -8,
    "floor_count": 1,
    "source": "SYNTHETIC",
    "confidence": "SYNTHETIC",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-UG-e8d2c1a04f55",
    "data_label": "SYNTHETIC",
    "is_underground": true,
    "provenance": {
      "source_dataset": "Synthetic Demo Fixture v0.1",
      "crs": "EPSG:4326",
      "acquired_at": "2024-11-15",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": []
    },
    "floors": [
      {
        "floor_id": "BLR-INF-00001-U1",
        "level_index": -1,
        "label": "Underground Volume",
        "z_min": 912,
        "z_max": 920,
        "confidence": "SYNTHETIC",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000019",
    "canonical_rid": "IN-KA-BLR-0000-B0019-B00001-D",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A2D43-B32-BV1",
      "locator": "0x70583C8CF176DA52",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x70583C8CF176DA52",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A2D43A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0019-B00001-D",
        "z_range": [
          0,
          -8
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0019-L00001-2",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "1 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0019-U00101-K",
        "z_range": [
          4,
          -18
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0019-C00001-N",
        "z_range": [
          0,
          -8
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0019-P00001-5",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0019-A00001-3",
        "z_range": [
          -8,
          17
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-019-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1018",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00028",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000019",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "25.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-INF-00002",
    "name": "Namma Metro — Indiranagar Underground Station",
    "city": "bengaluru",
    "lat": 12.9784,
    "lon": 77.6408,
    "ground_elevation": 914,
    "roof_elevation": 914,
    "height": -6.5,
    "floor_count": 1,
    "source": "SYNTHETIC",
    "confidence": "SYNTHETIC",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-UG-f9c1d0b3a066",
    "data_label": "SYNTHETIC",
    "is_underground": true,
    "provenance": {
      "source_dataset": "Synthetic Demo Fixture v0.1",
      "crs": "EPSG:4326",
      "acquired_at": "2024-11-15",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": []
    },
    "floors": [
      {
        "floor_id": "BLR-INF-00002-U1",
        "level_index": -1,
        "label": "Underground Platform",
        "z_min": 907.5,
        "z_max": 914,
        "confidence": "SYNTHETIC",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000020",
    "canonical_rid": "IN-KA-BLR-0000-B0020-B00001-V",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A2233-B32-BV1",
      "locator": "0x70582EC5D8670405",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x70582EC5D8670405",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A2233A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0020-B00001-V",
        "z_range": [
          0,
          -6.5
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0020-L00001-K",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "1 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0020-U00101-S",
        "z_range": [
          4,
          -16.5
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0020-C00001-4",
        "z_range": [
          0,
          -6.5
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0020-P00001-N",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0020-A00001-L",
        "z_range": [
          -6.5,
          18.5
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-020-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1019",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00029",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000020",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "25.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00019",
    "name": "The Leela Palace Hotel",
    "city": "bengaluru",
    "lat": 12.9622,
    "lon": 77.6472,
    "ground_elevation": 895,
    "roof_elevation": 965,
    "height": 70,
    "floor_count": 19,
    "source": "Cadastral GIS",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-a6b8c0d2e4dd",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-08",
      "crs": "EPSG:4326",
      "acquired_at": "2024-08-01",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00019-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 895,
        "z_max": 898.7,
        "confidence": "DERIVED",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000021",
    "canonical_rid": "IN-KA-BLR-0000-B0021-B00001-E",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A235A-B32-BV1",
      "locator": "0x397CBE8DCE7F84CD",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x397CBE8DCE7F84CD",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A235AA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0021-B00001-E",
        "z_range": [
          0,
          70
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0021-L00001-3",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "19 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0021-U00101-B",
        "z_range": [
          4,
          60
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0021-C00001-O",
        "z_range": [
          0,
          70
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0021-P00001-6",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0021-A00001-4",
        "z_range": [
          70,
          95
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-021-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1020",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00030",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000021",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "1.32%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00020",
    "name": "ITC Windsor Hotel",
    "city": "bengaluru",
    "lat": 12.9608,
    "lon": 77.586,
    "ground_elevation": 921,
    "roof_elevation": 981,
    "height": 60,
    "floor_count": 16,
    "source": "Cadastral GIS",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-b2d4e6c8a0ee",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-07",
      "crs": "EPSG:4326",
      "acquired_at": "2024-07-01",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00020-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 921,
        "z_max": 924.8,
        "confidence": "DERIVED",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000022",
    "canonical_rid": "IN-KA-BLR-0000-B0022-B00001-Y",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A2CE9-B32-BV1",
      "locator": "0x70583C8DE36A641E",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x70583C8DE36A641E",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A2CE9A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0022-B00001-Y",
        "z_range": [
          0,
          60
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0022-L00001-N",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "16 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0022-U00101-V",
        "z_range": [
          4,
          50
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0022-C00001-7",
        "z_range": [
          0,
          60
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0022-P00001-Q",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0022-A00001-O",
        "z_range": [
          60,
          85
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-022-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1021",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00031",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000022",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "1.56%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  },
  {
    "building_id": "BLR-BLD-00021",
    "name": "Bagmane Tech Park Tower 3",
    "city": "bengaluru",
    "lat": 12.9907,
    "lon": 77.6428,
    "ground_elevation": 898,
    "roof_elevation": 968,
    "height": 70,
    "floor_count": 18,
    "source": "Cadastral GIS",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-BLR-c4e6f8a2b0ff",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-09",
      "crs": "EPSG:4326",
      "acquired_at": "2024-09-15",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": [
        "WGS84→EPSG:32643"
      ]
    },
    "floors": [
      {
        "floor_id": "BLR-BLD-00021-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 898,
        "z_max": 901.9,
        "confidence": "DERIVED",
        "status": "VALID"
      }
    ],
    "validation_checks": [
      {
        "id": "geom-valid",
        "label": "Geometry Valid",
        "status": "VALID"
      },
      {
        "id": "z-range",
        "label": "Vertical Range",
        "status": "VALID"
      },
      {
        "id": "id-unique",
        "label": "Identifier Uniqueness",
        "status": "VALID"
      }
    ],
    "parent_ulpin": "IN-KA-BLR-000023",
    "canonical_rid": "IN-KA-BLR-0000-B0023-B00001-7",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-000A238E-B32-BV1",
      "locator": "0x397CBECCDAA52F41",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x397CBECCDAA52F41",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x000A238EA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-KA-BBMP-102",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-KA-BLR-0000-B0000-S00001-A",
        "z_range": [
          -15,
          0
        ],
        "status": "PASS",
        "desc": "Cadastral surface column between statutory subterranean limit and ground"
      },
      {
        "cls": "B",
        "name": "Sanctioned Building Envelope",
        "rid": "IN-KA-BLR-0000-B0023-B00001-7",
        "z_range": [
          0,
          70
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-KA-BLR-0000-B0023-L00001-X",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "18 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-KA-BLR-0000-B0023-U00101-4",
        "z_range": [
          4,
          60
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-KA-BLR-0000-B0023-C00001-H",
        "z_range": [
          0,
          70
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-KA-BLR-0000-B0023-P00001-0",
        "z_range": [
          -10,
          0
        ],
        "status": "PASS",
        "desc": "Multi-level basement parking and mechanical rooms"
      },
      {
        "cls": "A",
        "name": "Airspace Development Lot",
        "rid": "IN-KA-BLR-0000-B0023-A00001-Y",
        "z_range": [
          70,
          95
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-KA-BLR-0000-B0000-T00001-K",
        "z_range": [
          -30,
          -15
        ],
        "status": "PASS",
        "desc": "Deep underground rail corridor / utility tunnel"
      },
      {
        "cls": "E",
        "name": "Elevated Corridor / Viaduct",
        "rid": "IN-KA-BLR-0000-B0000-E00001-I",
        "z_range": [
          12,
          18
        ],
        "status": "PASS",
        "desc": "Elevated transit right-of-way"
      },
      {
        "cls": "I",
        "name": "Municipal Utility Network Segment",
        "rid": "IN-KA-BLR-0000-B0000-I00001-L",
        "z_range": [
          -3,
          0
        ],
        "status": "PASS",
        "desc": "Storm drain (raja kaluve) and municipal conduit"
      }
    ],
    "legacy_ids": [
      {
        "id_system": "PID",
        "legacy_value": "BBMP-EAASTHI-023-992",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "UPOR",
        "legacy_value": "PR-KA-BLR-1022",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "PRM/KA/RERA/1251/310/PR/170915/00032",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-KA-BLR-000023",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "1.39%",
        "legal_basis_status": "VERIFIED",
        "statute": "Karnataka Apartment Ownership Act 1972 Sec 5",
        "verified": true
      },
      {
        "type": "FREEHOLD_OWNERSHIP",
        "holder": "Land Owning Entity / Cadastral Parent",
        "undivided_share": "100.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Transfer of Property Act 1882",
        "verified": true
      },
      {
        "type": "EASEMENT_UTILITY",
        "holder": "BBMP Storm Water Drain Authority",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      }
    ],
    "tier_results": [
      {
        "tier": "T0",
        "name": "Data Integrity",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T1",
        "name": "Geometric Validity (val3dity 2-manifold)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T2",
        "name": "Cadastral Topology (No-Overlap & Containment)",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T3",
        "name": "Plan-vs-As-Built Hungarian Reconciliation",
        "status": "PASS",
        "findings": []
      },
      {
        "tier": "T4",
        "name": "Administrative & RRR Consistency",
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [],
    "evidence_sufficiency": {
      "available": [
        "E1 (Airborne LiDAR)",
        "E2 (Exterior UAV)",
        "E4 (Sanctioned Plans)"
      ],
      "required_for_full_pass": [
        "E1",
        "E2",
        "E3 (Interior Terrestrial Scan)",
        "E4"
      ],
      "unverifiable_checks": [
        "Unit Partition Alignment (requires E3 terrestrial scan — Zero Silent PASS Upgrades)"
      ]
    }
  }
];

export default bengaluruBuildings;
