// Mock data — Mumbai buildings
// Fully conforming to 3D ULPIN 11 backend specification docs
// 10 classes, canonical RIDs with ISO 7064 check symbol, Natural Key, 63-bit Morton, and T0-T5 validation.

const mumbaiBuildings = [
  {
    "building_id": "MUM-BLD-00001",
    "name": "Lodha World One",
    "city": "mumbai",
    "lat": 18.9986,
    "lon": 72.8306,
    "ground_elevation": 8.5,
    "roof_elevation": 450,
    "height": 441.5,
    "floor_count": 117,
    "source": "Cadastral GIS 2024 + MCGM GIS",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-a1b2c3d4e5f6",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-11 + MCGM GIS Portal",
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
        "floor_id": "MUM-BLD-00001-F00",
        "level_index": 0,
        "label": "Ground Grand Lobby",
        "z_min": 8.5,
        "z_max": 13.5,
        "confidence": "DERIVED_HIGH",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00001-F01",
        "level_index": 1,
        "label": "Floor 1 — Banquet Atrium",
        "z_min": 13.5,
        "z_max": 18,
        "confidence": "DERIVED_HIGH",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00001-F06",
        "level_index": 6,
        "label": "Podium Clubhouse & Pool",
        "z_min": 36,
        "z_max": 41.5,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00001-F40",
        "level_index": 40,
        "label": "Floor 40 — Sky Residences",
        "z_min": 160,
        "z_max": 163.8,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00001-F75",
        "level_index": 75,
        "label": "Floor 75 — Sky Lounge",
        "z_min": 290,
        "z_max": 294.5,
        "confidence": "INFERRED",
        "status": "REVIEW"
      },
      {
        "floor_id": "MUM-BLD-00001-F117",
        "level_index": 117,
        "label": "Floor 117 — Observatory",
        "z_min": 445,
        "z_max": 450,
        "confidence": "DERIVED_HIGH",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00001-B1",
        "level_index": -1,
        "label": "Basement P1 (Valet)",
        "z_min": 4.5,
        "z_max": 8.5,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00001-B2",
        "level_index": -2,
        "label": "Basement P2 (Resident)",
        "z_min": 0.5,
        "z_max": 4.5,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00001-B3",
        "level_index": -3,
        "label": "Basement P3 (Services)",
        "z_min": -3.5,
        "z_max": 0.5,
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
        "label": "Vertical Range (z_min < z_max)",
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
    "parent_ulpin": "IN-MH-MUM-000001",
    "canonical_rid": "IN-MH-MUM-0000-B0001-B00001-3",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009FAD0-B32-BV1",
      "locator": "0x307E0D9A015702C2",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0D9A015702C2",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009FAD0A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0001-B00001-3",
        "z_range": [
          0,
          441.5
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0001-L00001-T",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "117 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0001-U00101-A",
        "z_range": [
          4,
          431.5
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0001-C00001-D",
        "z_range": [
          0,
          441.5
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0001-P00001-W",
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
        "rid": "IN-MH-MUM-0000-B0001-A00001-U",
        "z_range": [
          441.5,
          466.5
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4000/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008340",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-1-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000001",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.21%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Indian Easements Act 1882 Sec 15",
        "verified": true
      },
      {
        "type": "RESTRICTION_METRO_PROXIMITY",
        "holder": "Mumbai Metro Rail Corporation (MMRC Line 3)",
        "undivided_share": null,
        "legal_basis_status": "VERIFIED",
        "statute": "Metro Railways (Construction of Works) Act 1978 — 50m Statutory Protection Zone",
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
        "status": "WARN",
        "findings": [
          {
            "finding_id": "FINDING-MUM-001",
            "finding_type": "CORRIDOR_CLEARANCE_BREACH",
            "severity": "WARN",
            "rule_id": "T2.CLEARANCE.METRO",
            "message": "Tower foundation approaches within 48.2m of Aqua Line tunnel (statutory 50m MMRC clearance zone)."
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
        "status": "PASS",
        "findings": []
      }
    ],
    "explain_objects": [
      {
        "finding_id": "EXPLAIN-MUM-001",
        "finding_type": "CORRIDOR_CLEARANCE_BREACH",
        "severity": "WARN",
        "confidence": 0.95,
        "rule": {
          "rule_id": "T2.CLEARANCE.METRO",
          "description": "Structure within 50m of Metro tunnel requires MMRC structural safety approval Right",
          "tolerance": "tau_clearance = 50.0 m",
          "policy_reference": "Metro Railways (Construction of Works) Act 1978"
        },
        "evidence": {
          "evidence_ids": [
            "EV-MMRC-AQUA-ALIGNMENT-E5",
            "EV-WORLI-FOUNDATION-E3"
          ],
          "evidence_class": "E5 (Geotechnical Tunnel Survey) + E2 (Tower Foundation)",
          "sigma_measurement": 0.15,
          "data_provenance": [
            "REAL",
            "SYNTHETIC"
          ]
        },
        "geometry_overlay": {
          "expected": "Minimum 50.0m radial clearance from tunnel extrusion",
          "observed": "Measured clearance 48.2m at elevation z = -12.4m",
          "intersection": "1.8m intrusion into statutory review envelope",
          "magnitude": "1.8 m review zone proximity"
        },
        "plan_version": "MCGM-AUTODCR-WORLI-2021-v3",
        "affected_rids": [
          "IN-MH-MUM-0000-B0001-B00001-3",
          "IN-MH-MUM-0000-B0000-T00001-F"
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
    "building_id": "MUM-BLD-00002",
    "name": "Lodha World View",
    "city": "mumbai",
    "lat": 18.9992,
    "lon": 72.8315,
    "ground_elevation": 8.5,
    "roof_elevation": 286.1,
    "height": 277.6,
    "floor_count": 73,
    "source": "Cadastral GIS 2024 + MCGM GIS",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-c4d5e6f7a8b9",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-11 + MCGM GIS",
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
        "floor_id": "MUM-BLD-00002-F00",
        "level_index": 0,
        "label": "Ground Podium Access",
        "z_min": 8.5,
        "z_max": 13,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00002-F01",
        "level_index": 1,
        "label": "Floor 1 Residences",
        "z_min": 13,
        "z_max": 16.8,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00002-F73",
        "level_index": 73,
        "label": "Floor 73 — Penthouse",
        "z_min": 281.5,
        "z_max": 286.1,
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
        "label": "Shared Podium Parcel Rel",
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
    "parent_ulpin": "IN-MH-MUM-000002",
    "canonical_rid": "IN-MH-MUM-0000-B0002-B00001-N",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009FADD-B32-BV1",
      "locator": "0x307E0D9A01571481",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0D9A01571481",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009FADDA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0002-B00001-N",
        "z_range": [
          0,
          277.6
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0002-L00001-C",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "73 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0002-U00101-U",
        "z_range": [
          4,
          267.6
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0002-C00001-X",
        "z_range": [
          0,
          277.6
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0002-P00001-F",
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
        "rid": "IN-MH-MUM-0000-B0002-A00001-D",
        "z_range": [
          277.6,
          302.6
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4001/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008341",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-2-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000002",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.34%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00003",
    "name": "Lodha World Crest",
    "city": "mumbai",
    "lat": 18.998,
    "lon": 72.8298,
    "ground_elevation": 8.5,
    "roof_elevation": 231.5,
    "height": 223,
    "floor_count": 57,
    "source": "Cadastral GIS 2024 + MCGM GIS",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-d5e6f7a8b9c1",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-11 + MCGM GIS",
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
        "floor_id": "MUM-BLD-00003-F00",
        "level_index": 0,
        "label": "Ground Floor Atrium",
        "z_min": 8.5,
        "z_max": 12.8,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00003-F57",
        "level_index": 57,
        "label": "Floor 57 Penthouse",
        "z_min": 227,
        "z_max": 231.5,
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
    "parent_ulpin": "IN-MH-MUM-000003",
    "canonical_rid": "IN-MH-MUM-0000-B0003-B00001-6",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009FAF4-B32-BV1",
      "locator": "0x307E0D9A015624D9",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0D9A015624D9",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009FAF4A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0003-B00001-6",
        "z_range": [
          0,
          223
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0003-L00001-W",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "57 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0003-U00101-D",
        "z_range": [
          4,
          213
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0003-C00001-G",
        "z_range": [
          0,
          223
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0003-P00001-8",
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
        "rid": "IN-MH-MUM-0000-B0003-A00001-X",
        "z_range": [
          223,
          248
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4002/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008342",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-3-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000003",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.44%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00004",
    "name": "Palais Royale (Worli Naka)",
    "city": "mumbai",
    "lat": 18.9942,
    "lon": 72.8265,
    "ground_elevation": 9,
    "roof_elevation": 329,
    "height": 320,
    "floor_count": 88,
    "source": "Cadastral GIS 2024 + MCGM GIS",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-e6f7a8b9c0d2",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-11 + MCGM GIS",
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
        "floor_id": "MUM-BLD-00004-F00",
        "level_index": 0,
        "label": "Ground Entrance Foyer",
        "z_min": 9,
        "z_max": 14.5,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00004-P14",
        "level_index": 14,
        "label": "Podium 14 (Transfer)",
        "z_min": 65,
        "z_max": 71,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00004-F50",
        "level_index": 50,
        "label": "Sky Gym & Amenity",
        "z_min": 195,
        "z_max": 200,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00004-F88",
        "level_index": 88,
        "label": "Rooftop Crown",
        "z_min": 324,
        "z_max": 329,
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
    "parent_ulpin": "IN-MH-MUM-000004",
    "canonical_rid": "IN-MH-MUM-0000-B0004-B00001-Q",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009F93C-B32-BV1",
      "locator": "0x307E0D9A210BF946",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0D9A210BF946",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009F93CA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0004-B00001-Q",
        "z_range": [
          0,
          320
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0004-L00001-F",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "88 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0004-U00101-X",
        "z_range": [
          4,
          310
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0004-C00001-0",
        "z_range": [
          0,
          320
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0004-P00001-S",
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
        "rid": "IN-MH-MUM-0000-B0004-A00001-G",
        "z_range": [
          320,
          345
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4003/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008343",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-4-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000004",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.28%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00005",
    "name": "Lokhandwala Minerva",
    "city": "mumbai",
    "lat": 18.9868,
    "lon": 72.8214,
    "ground_elevation": 8,
    "roof_elevation": 309,
    "height": 301,
    "floor_count": 78,
    "source": "Cadastral GIS 2024",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-f7a8b9c0d1e3",
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
        "floor_id": "MUM-BLD-00005-F00",
        "level_index": 0,
        "label": "Ground Lobby",
        "z_min": 8,
        "z_max": 13,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00005-P10",
        "level_index": 10,
        "label": "Podium Level 10",
        "z_min": 48,
        "z_max": 53,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00005-F78",
        "level_index": 78,
        "label": "Sky Villa Penthouse",
        "z_min": 304,
        "z_max": 309,
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
    "parent_ulpin": "IN-MH-MUM-000005",
    "canonical_rid": "IN-MH-MUM-0000-B0005-B00001-9",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009F93E-B32-BV1",
      "locator": "0x307E0D932180355A",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0D932180355A",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009F93EA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0005-B00001-9",
        "z_range": [
          0,
          301
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0005-L00001-8",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "78 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0005-U00101-G",
        "z_range": [
          4,
          291
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0005-C00001-J",
        "z_range": [
          0,
          301
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0005-P00001-B",
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
        "rid": "IN-MH-MUM-0000-B0005-A00001-0",
        "z_range": [
          301,
          326
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4004/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008344",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-5-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000005",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.32%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00006",
    "name": "The Park — Lodha Kiara",
    "city": "mumbai",
    "lat": 19.0068,
    "lon": 72.8228,
    "ground_elevation": 9,
    "roof_elevation": 277,
    "height": 268,
    "floor_count": 78,
    "source": "Cadastral GIS 2024 + MCGM GIS",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-a8b9c0d1e2f4",
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
        "floor_id": "MUM-BLD-00006-F00",
        "level_index": 0,
        "label": "Ground Entrance Foyer",
        "z_min": 9,
        "z_max": 13.5,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00006-F05",
        "level_index": 5,
        "label": "Elevated Urban Park",
        "z_min": 27,
        "z_max": 32.5,
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
    "parent_ulpin": "IN-MH-MUM-000006",
    "canonical_rid": "IN-MH-MUM-0000-B0006-B00001-T",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009FAD2-B32-BV1",
      "locator": "0x307E0D9A23025BCC",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0D9A23025BCC",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009FAD2A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0006-B00001-T",
        "z_range": [
          0,
          268
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0006-L00001-S",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "78 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0006-U00101-0",
        "z_range": [
          4,
          258
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0006-C00001-2",
        "z_range": [
          0,
          268
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0006-P00001-V",
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
        "rid": "IN-MH-MUM-0000-B0006-A00001-J",
        "z_range": [
          268,
          293
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4005/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008345",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-6-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000006",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.32%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00007",
    "name": "Indiabulls Sky Forest",
    "city": "mumbai",
    "lat": 18.9965,
    "lon": 72.829,
    "ground_elevation": 8.5,
    "roof_elevation": 289.5,
    "height": 281,
    "floor_count": 60,
    "source": "Cadastral GIS 2024",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-b9c0d1e2f3a5",
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
        "floor_id": "MUM-BLD-00007-F00",
        "level_index": 0,
        "label": "Ground Floor Atrium",
        "z_min": 8.5,
        "z_max": 13.5,
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
    "parent_ulpin": "IN-MH-MUM-000007",
    "canonical_rid": "IN-MH-MUM-0000-B0007-B00001-C",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009FAEA-B32-BV1",
      "locator": "0x307E0D9A01560488",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0D9A01560488",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009FAEAA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0007-B00001-C",
        "z_range": [
          0,
          281
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0007-L00001-B",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "60 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0007-U00101-J",
        "z_range": [
          4,
          271
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0007-C00001-M",
        "z_range": [
          0,
          281
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0007-P00001-E",
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
        "rid": "IN-MH-MUM-0000-B0007-A00001-2",
        "z_range": [
          281,
          306
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4006/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008346",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-7-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000007",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.42%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00008",
    "name": "One Avighna Park",
    "city": "mumbai",
    "lat": 19.0018,
    "lon": 72.8395,
    "ground_elevation": 10,
    "roof_elevation": 256,
    "height": 246,
    "floor_count": 64,
    "source": "Cadastral GIS 2024 + MCGM GIS",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-c0d1e2f3a4b6",
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
        "floor_id": "MUM-BLD-00008-F00",
        "level_index": 0,
        "label": "Ground Lobby",
        "z_min": 10,
        "z_max": 14.5,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00008-F09",
        "level_index": 9,
        "label": "Podium Sports Club",
        "z_min": 46,
        "z_max": 51,
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
    "parent_ulpin": "IN-MH-MUM-000008",
    "canonical_rid": "IN-MH-MUM-0000-B0008-B00001-W",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009FB0E-B32-BV1",
      "locator": "0x307E0D9B05FA4530",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0D9B05FA4530",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009FB0EA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0008-B00001-W",
        "z_range": [
          0,
          246
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0008-L00001-V",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "64 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0008-U00101-2",
        "z_range": [
          4,
          236
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0008-C00001-5",
        "z_range": [
          0,
          246
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0008-P00001-Y",
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
        "rid": "IN-MH-MUM-0000-B0008-A00001-M",
        "z_range": [
          246,
          271
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4007/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008347",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-8-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000008",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.39%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00009",
    "name": "Three Sixty West — Tower B (Residences)",
    "city": "mumbai",
    "lat": 19.0058,
    "lon": 72.819,
    "ground_elevation": 8,
    "roof_elevation": 380,
    "height": 372,
    "floor_count": 85,
    "source": "Cadastral GIS 2024",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-d1e2f3a4b5c7",
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
        "floor_id": "MUM-BLD-00009-F00",
        "level_index": 0,
        "label": "Ground Lobby & Driveway",
        "z_min": 8,
        "z_max": 13.5,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00009-F85",
        "level_index": 85,
        "label": "Sky Penthouse",
        "z_min": 374,
        "z_max": 380,
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
    "parent_ulpin": "IN-MH-MUM-000009",
    "canonical_rid": "IN-MH-MUM-0000-B0009-B00001-F",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009FA1C-B32-BV1",
      "locator": "0x307E0D9321C92702",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0D9321C92702",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009FA1CA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0009-B00001-F",
        "z_range": [
          0,
          372
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0009-L00001-E",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "85 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0009-U00101-M",
        "z_range": [
          4,
          362
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0009-C00001-P",
        "z_range": [
          0,
          372
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0009-P00001-H",
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
        "rid": "IN-MH-MUM-0000-B0009-A00001-5",
        "z_range": [
          372,
          397
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4008/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008348",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-9-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000009",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.29%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00010",
    "name": "Three Sixty West — Tower A (The Ritz-Carlton)",
    "city": "mumbai",
    "lat": 19.005,
    "lon": 72.8182,
    "ground_elevation": 8,
    "roof_elevation": 268,
    "height": 260,
    "floor_count": 52,
    "source": "Cadastral GIS 2024",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-e2f3a4b5c6d8",
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
        "floor_id": "MUM-BLD-00010-F00",
        "level_index": 0,
        "label": "Hotel Grand Lobby",
        "z_min": 8,
        "z_max": 14,
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
    "parent_ulpin": "IN-MH-MUM-000010",
    "canonical_rid": "IN-MH-MUM-0000-B0010-B00001-N",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009FA1D-B32-BV1",
      "locator": "0x307E0D9321C905D2",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0D9321C905D2",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009FA1DA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0010-B00001-N",
        "z_range": [
          0,
          260
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0010-L00001-C",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "52 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0010-U00101-U",
        "z_range": [
          4,
          250
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0010-C00001-X",
        "z_range": [
          0,
          260
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0010-P00001-F",
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
        "rid": "IN-MH-MUM-0000-B0010-A00001-D",
        "z_range": [
          260,
          285
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4009/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008349",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-10-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000010",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.48%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00011",
    "name": "Antilia (Altamount Road)",
    "city": "mumbai",
    "lat": 18.9648,
    "lon": 72.8081,
    "ground_elevation": 12,
    "roof_elevation": 185,
    "height": 173,
    "floor_count": 27,
    "source": "Cadastral GIS 2024 + MCGM",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-b7c8d9e0f1a2",
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
        "floor_id": "MUM-BLD-00011-F00",
        "level_index": 0,
        "label": "Ground Grand Foyer",
        "z_min": 12,
        "z_max": 18,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00011-P01",
        "level_index": 1,
        "label": "Podium Car Storage P1-P6",
        "z_min": 18,
        "z_max": 52,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00011-F07",
        "level_index": 7,
        "label": "Hanging Gardens Level",
        "z_min": 52,
        "z_max": 60,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00011-F12",
        "level_index": 12,
        "label": "Ballroom & Guest Suites",
        "z_min": 88,
        "z_max": 98,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00011-F27",
        "level_index": 27,
        "label": "Triple Helipad Deck",
        "z_min": 178,
        "z_max": 185,
        "confidence": "INFERRED",
        "status": "REVIEW"
      },
      {
        "floor_id": "MUM-BLD-00011-B1",
        "level_index": -1,
        "label": "Subterranean Vault & B1",
        "z_min": 6,
        "z_max": 12,
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
    "parent_ulpin": "IN-MH-MUM-000011",
    "canonical_rid": "IN-MH-MUM-0000-B0011-B00001-6",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009F8CB-B32-BV1",
      "locator": "0x307E0CF796362E17",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0CF796362E17",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009F8CBA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0011-B00001-6",
        "z_range": [
          0,
          173
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0011-L00001-W",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "27 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0011-U00101-D",
        "z_range": [
          4,
          163
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0011-C00001-G",
        "z_range": [
          0,
          173
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0011-P00001-8",
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
        "rid": "IN-MH-MUM-0000-B0011-A00001-X",
        "z_range": [
          173,
          198
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4010/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008350",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-11-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000011",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.93%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00012",
    "name": "The Imperial — Tower 1",
    "city": "mumbai",
    "lat": 18.9686,
    "lon": 72.8136,
    "ground_elevation": 10,
    "roof_elevation": 266,
    "height": 256,
    "floor_count": 60,
    "source": "Cadastral GIS 2024",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-f3a4b5c6d7e9",
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
        "floor_id": "MUM-BLD-00012-F00",
        "level_index": 0,
        "label": "Ground Lobby",
        "z_min": 10,
        "z_max": 14.5,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00012-F60",
        "level_index": 60,
        "label": "Floor 60 Penthouse",
        "z_min": 260,
        "z_max": 266,
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
    "parent_ulpin": "IN-MH-MUM-000012",
    "canonical_rid": "IN-MH-MUM-0000-B0012-B00001-Q",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009F8BA-B32-BV1",
      "locator": "0x307E0CBF96BEC3B3",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0CBF96BEC3B3",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009F8BAA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0012-B00001-Q",
        "z_range": [
          0,
          256
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0012-L00001-F",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "60 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0012-U00101-X",
        "z_range": [
          4,
          246
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0012-C00001-0",
        "z_range": [
          0,
          256
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0012-P00001-S",
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
        "rid": "IN-MH-MUM-0000-B0012-A00001-G",
        "z_range": [
          256,
          281
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4011/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008351",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-12-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000012",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.42%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00013",
    "name": "The Imperial — Tower 2",
    "city": "mumbai",
    "lat": 18.9692,
    "lon": 72.8142,
    "ground_elevation": 10,
    "roof_elevation": 266,
    "height": 256,
    "floor_count": 60,
    "source": "Cadastral GIS 2024",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-a4b5c6d7e8f0",
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
        "floor_id": "MUM-BLD-00013-F00",
        "level_index": 0,
        "label": "Ground Lobby",
        "z_min": 10,
        "z_max": 14.5,
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
    "parent_ulpin": "IN-MH-MUM-000013",
    "canonical_rid": "IN-MH-MUM-0000-B0013-B00001-9",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009F8BE-B32-BV1",
      "locator": "0x307E0CBF96BEC7F0",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0CBF96BEC7F0",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009F8BEA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0013-B00001-9",
        "z_range": [
          0,
          256
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0013-L00001-8",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "60 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0013-U00101-G",
        "z_range": [
          4,
          246
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0013-C00001-J",
        "z_range": [
          0,
          256
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0013-P00001-B",
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
        "rid": "IN-MH-MUM-0000-B0013-A00001-0",
        "z_range": [
          256,
          281
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4012/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008352",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-13-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000013",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.42%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00014",
    "name": "Nathani Heights (Mumbai Central)",
    "city": "mumbai",
    "lat": 18.9715,
    "lon": 72.8202,
    "ground_elevation": 9,
    "roof_elevation": 271,
    "height": 262,
    "floor_count": 72,
    "source": "Cadastral GIS 2024",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-b5c6d7e8f9a1",
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
        "floor_id": "MUM-BLD-00014-F00",
        "level_index": 0,
        "label": "Ground Floor",
        "z_min": 9,
        "z_max": 13,
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
    "parent_ulpin": "IN-MH-MUM-000014",
    "canonical_rid": "IN-MH-MUM-0000-B0014-B00001-T",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009F994-B32-BV1",
      "locator": "0x307E0CBEB30B4F4F",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0CBEB30B4F4F",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009F994A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0014-B00001-T",
        "z_range": [
          0,
          262
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0014-L00001-S",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "72 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0014-U00101-0",
        "z_range": [
          4,
          252
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0014-C00001-2",
        "z_range": [
          0,
          262
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0014-P00001-V",
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
        "rid": "IN-MH-MUM-0000-B0014-A00001-J",
        "z_range": [
          262,
          287
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4013/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008353",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-14-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000014",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "0.35%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00015",
    "name": "MMRDA Headquarters",
    "city": "mumbai",
    "lat": 19.0655,
    "lon": 72.8677,
    "ground_elevation": 9.5,
    "roof_elevation": 82.5,
    "height": 73,
    "floor_count": 20,
    "source": "Cadastral GIS 2024 + MMRDA",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-c3d4e5f6a7b8",
    "data_label": "DERIVED",
    "provenance": {
      "source_dataset": "Cadastral Survey 2024-09 + MMRDA Cadastre",
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
        "floor_id": "MUM-BLD-00015-F00",
        "level_index": 0,
        "label": "Civic Reception & Atrium",
        "z_min": 9.5,
        "z_max": 14,
        "confidence": "DERIVED_HIGH",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00015-F01",
        "level_index": 1,
        "label": "Metropolitan Planning Wing",
        "z_min": 14,
        "z_max": 18,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00015-F20",
        "level_index": 20,
        "label": "Commissioner Executive Board",
        "z_min": 78,
        "z_max": 82.5,
        "confidence": "DERIVED_HIGH",
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
    "parent_ulpin": "IN-MH-MUM-000015",
    "canonical_rid": "IN-MH-MUM-0000-B0015-B00001-C",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009F6D4-B32-BV1",
      "locator": "0x307E0D9B1A41E844",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0D9B1A41E844",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009F6D4A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0015-B00001-C",
        "z_range": [
          0,
          73
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0015-L00001-B",
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
        "rid": "IN-MH-MUM-0000-B0015-U00101-J",
        "z_range": [
          4,
          63
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0015-C00001-M",
        "z_range": [
          0,
          73
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0015-P00001-E",
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
        "rid": "IN-MH-MUM-0000-B0015-A00001-2",
        "z_range": [
          73,
          98
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4014/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008354",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-15-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000015",
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
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00016",
    "name": "Jio World Centre & NMACC",
    "city": "mumbai",
    "lat": 19.0628,
    "lon": 72.8654,
    "ground_elevation": 9,
    "roof_elevation": 94,
    "height": 85,
    "floor_count": 18,
    "source": "Cadastral GIS 2024",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-c6d7e8f9a0b2",
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
        "floor_id": "MUM-BLD-00016-F00",
        "level_index": 0,
        "label": "Grand Exhibition Concourse",
        "z_min": 9,
        "z_max": 16,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00016-F04",
        "level_index": 4,
        "label": "The Grand Theatre (NMACC)",
        "z_min": 30,
        "z_max": 42,
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
    "parent_ulpin": "IN-MH-MUM-000016",
    "canonical_rid": "IN-MH-MUM-0000-B0016-B00001-W",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009F6E6-B32-BV1",
      "locator": "0x307E0D9A3A42794F",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0D9A3A42794F",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009F6E6A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0016-B00001-W",
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
        "rid": "IN-MH-MUM-0000-B0016-L00001-V",
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
        "rid": "IN-MH-MUM-0000-B0016-U00101-2",
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
        "rid": "IN-MH-MUM-0000-B0016-C00001-5",
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
        "rid": "IN-MH-MUM-0000-B0016-P00001-Y",
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
        "rid": "IN-MH-MUM-0000-B0016-A00001-M",
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
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4015/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008355",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-16-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000016",
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
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00017",
    "name": "ICICI Bank Regional Headquarters (BKC)",
    "city": "mumbai",
    "lat": 19.0664,
    "lon": 72.8682,
    "ground_elevation": 9.5,
    "roof_elevation": 91.5,
    "height": 82,
    "floor_count": 21,
    "source": "Cadastral GIS 2024",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-d7e8f9a0b1c3",
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
        "floor_id": "MUM-BLD-00017-F00",
        "level_index": 0,
        "label": "Banking Atrium",
        "z_min": 9.5,
        "z_max": 14.5,
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
    "parent_ulpin": "IN-MH-MUM-000017",
    "canonical_rid": "IN-MH-MUM-0000-B0017-B00001-F",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009F6B2-B32-BV1",
      "locator": "0x307E0D9B1A41EC5F",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0D9B1A41EC5F",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009F6B2A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0017-B00001-F",
        "z_range": [
          0,
          82
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0017-L00001-E",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "21 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0017-U00101-M",
        "z_range": [
          4,
          72
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0017-C00001-P",
        "z_range": [
          0,
          82
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0017-P00001-H",
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
        "rid": "IN-MH-MUM-0000-B0017-A00001-5",
        "z_range": [
          82,
          107
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4016/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008356",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-17-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000017",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "1.19%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00018",
    "name": "One BKC Commercial Complex",
    "city": "mumbai",
    "lat": 19.0635,
    "lon": 72.8628,
    "ground_elevation": 9,
    "roof_elevation": 87,
    "height": 78,
    "floor_count": 19,
    "source": "Cadastral GIS 2024",
    "confidence": "DERIVED",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-e8f9a0b1c2d4",
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
        "floor_id": "MUM-BLD-00018-F00",
        "level_index": 0,
        "label": "Ground Commercial Lobby",
        "z_min": 9,
        "z_max": 13.8,
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
    "parent_ulpin": "IN-MH-MUM-000018",
    "canonical_rid": "IN-MH-MUM-0000-B0018-B00001-8",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009F689-B32-BV1",
      "locator": "0x307E0D9A3A426D4F",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0D9A3A426D4F",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009F689A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0018-B00001-8",
        "z_range": [
          0,
          78
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0018-L00001-Y",
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
        "rid": "IN-MH-MUM-0000-B0018-U00101-5",
        "z_range": [
          4,
          68
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0018-C00001-I",
        "z_range": [
          0,
          78
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0018-P00001-Z",
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
        "rid": "IN-MH-MUM-0000-B0018-A00001-P",
        "z_range": [
          78,
          103
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4017/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008357",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-18-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000018",
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
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00019",
    "name": "Air India Building (Nariman Point)",
    "city": "mumbai",
    "lat": 18.9288,
    "lon": 72.8236,
    "ground_elevation": 4.5,
    "roof_elevation": 112.5,
    "height": 108,
    "floor_count": 23,
    "source": "Cadastral GIS 2024",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-f9a0b1c2d3e5",
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
        "floor_id": "MUM-BLD-00019-F00",
        "level_index": 0,
        "label": "Ground Marine Drive Foyer",
        "z_min": 4.5,
        "z_max": 9.5,
        "confidence": "DERIVED",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-BLD-00019-F23",
        "level_index": 23,
        "label": "Floor 23 — Centaur Crown",
        "z_min": 107,
        "z_max": 112.5,
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
    "parent_ulpin": "IN-MH-MUM-000019",
    "canonical_rid": "IN-MH-MUM-0000-B0019-B00001-S",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009FFD6-B32-BV1",
      "locator": "0x307A9EFE871BE8BF",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307A9EFE871BE8BF",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009FFD6A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0019-B00001-S",
        "z_range": [
          0,
          108
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0019-L00001-H",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "23 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0019-U00101-P",
        "z_range": [
          4,
          98
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0019-C00001-1",
        "z_range": [
          0,
          108
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0019-P00001-K",
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
        "rid": "IN-MH-MUM-0000-B0019-A00001-I",
        "z_range": [
          108,
          133
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4018/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008358",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-19-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000019",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "1.09%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-BLD-00020",
    "name": "Express Towers (Nariman Point)",
    "city": "mumbai",
    "lat": 18.9272,
    "lon": 72.8228,
    "ground_elevation": 4.5,
    "roof_elevation": 109.5,
    "height": 105,
    "floor_count": 25,
    "source": "Cadastral GIS 2024",
    "confidence": "DERIVED_HIGH",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-a0b1c2d3e4f6",
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
        "floor_id": "MUM-BLD-00020-F00",
        "level_index": 0,
        "label": "Ground Entrance Gallery",
        "z_min": 4.5,
        "z_max": 9,
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
    "parent_ulpin": "IN-MH-MUM-000020",
    "canonical_rid": "IN-MH-MUM-0000-B0020-B00001-Q",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009FFEF-B32-BV1",
      "locator": "0x307A9EFE871B5AEE",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307A9EFE871B5AEE",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009FFEFA1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0020-B00001-Q",
        "z_range": [
          0,
          105
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0020-L00001-F",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "25 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0020-U00101-X",
        "z_range": [
          4,
          95
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0020-C00001-0",
        "z_range": [
          0,
          105
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0020-P00001-S",
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
        "rid": "IN-MH-MUM-0000-B0020-A00001-G",
        "z_range": [
          105,
          130
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4019/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008359",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-20-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000020",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "1.00%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-INF-00001",
    "name": "Mumbai Metro Line 3 — BKC Underground Station",
    "city": "mumbai",
    "lat": 19.0645,
    "lon": 72.866,
    "ground_elevation": 9,
    "roof_elevation": 9,
    "height": -18.5,
    "floor_count": 3,
    "source": "SYNTHETIC",
    "confidence": "SYNTHETIC",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-UG-d5e6f7a8b9c0",
    "data_label": "SYNTHETIC",
    "is_underground": true,
    "provenance": {
      "source_dataset": "MMRC Aqua Line Subsurface Cadastre Fixture v0.1",
      "crs": "EPSG:4326",
      "acquired_at": "2024-11-01",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": []
    },
    "floors": [
      {
        "floor_id": "MUM-INF-00001-U1",
        "level_index": -1,
        "label": "Concourse & Ticketing Mezzanine",
        "z_min": 2,
        "z_max": 9,
        "confidence": "SYNTHETIC",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-INF-00001-U2",
        "level_index": -2,
        "label": "Plant & Auxiliary Substation",
        "z_min": -4,
        "z_max": 2,
        "confidence": "SYNTHETIC",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-INF-00001-U3",
        "level_index": -3,
        "label": "Island Platform & Track Tunnel",
        "z_min": -9.5,
        "z_max": -4,
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
        "label": "Vertical Range (z<0)",
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
    "parent_ulpin": "IN-MH-MUM-000021",
    "canonical_rid": "IN-MH-MUM-0000-B0021-B00001-9",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009F6F5-B32-BV1",
      "locator": "0x307E0D9A3A435B8C",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0D9A3A435B8C",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009F6F5A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0021-B00001-9",
        "z_range": [
          0,
          -18.5
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0021-L00001-8",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "3 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0021-U00101-G",
        "z_range": [
          4,
          -28.5
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0021-C00001-J",
        "z_range": [
          0,
          -18.5
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0021-P00001-B",
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
        "rid": "IN-MH-MUM-0000-B0021-A00001-0",
        "z_range": [
          -18.5,
          6.5
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4020/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008360",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-21-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000021",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "8.33%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-INF-00002",
    "name": "Mumbai Metro Line 3 — Worli / Acharya Atre Chowk Station",
    "city": "mumbai",
    "lat": 19.0062,
    "lon": 72.828,
    "ground_elevation": 8.5,
    "roof_elevation": 8.5,
    "height": -20.2,
    "floor_count": 3,
    "source": "SYNTHETIC",
    "confidence": "SYNTHETIC",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-UG-b1c2d3e4f5a6",
    "data_label": "SYNTHETIC",
    "is_underground": true,
    "provenance": {
      "source_dataset": "MMRC Subsurface Fixture",
      "crs": "EPSG:4326",
      "acquired_at": "2024-11-01",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": []
    },
    "floors": [
      {
        "floor_id": "MUM-INF-00002-U1",
        "level_index": -1,
        "label": "Subterranean Concourse",
        "z_min": 1.5,
        "z_max": 8.5,
        "confidence": "SYNTHETIC",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-INF-00002-U2",
        "level_index": -2,
        "label": "Platform Deep Tunnel",
        "z_min": -11.7,
        "z_max": 1.5,
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
    "parent_ulpin": "IN-MH-MUM-000022",
    "canonical_rid": "IN-MH-MUM-0000-B0022-B00001-T",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009FAA3-B32-BV1",
      "locator": "0x307E0D9A015BB6C3",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307E0D9A015BB6C3",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009FAA3A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0022-B00001-T",
        "z_range": [
          0,
          -20.2
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0022-L00001-S",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "3 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0022-U00101-0",
        "z_range": [
          4,
          -30.2
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0022-C00001-2",
        "z_range": [
          0,
          -20.2
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0022-P00001-V",
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
        "rid": "IN-MH-MUM-0000-B0022-A00001-J",
        "z_range": [
          -20.2,
          4.800000000000001
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4021/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008361",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-22-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000022",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "8.33%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-INF-00003",
    "name": "Mumbai Coastal Road — Subsea Twin Tunnels",
    "city": "mumbai",
    "lat": 18.955,
    "lon": 72.806,
    "ground_elevation": 2,
    "roof_elevation": 2,
    "height": -25,
    "floor_count": 2,
    "source": "SYNTHETIC",
    "confidence": "SYNTHETIC",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-UG-c2d3e4f5a6b7",
    "data_label": "SYNTHETIC",
    "is_underground": true,
    "provenance": {
      "source_dataset": "MCGM Coastal Road Subsea Profile",
      "crs": "EPSG:4326",
      "acquired_at": "2024-11-01",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": []
    },
    "floors": [
      {
        "floor_id": "MUM-INF-00003-U1",
        "level_index": -1,
        "label": "Northbound Undersea Bore",
        "z_min": -23,
        "z_max": -10,
        "confidence": "SYNTHETIC",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-INF-00003-U2",
        "level_index": -2,
        "label": "Southbound Undersea Bore",
        "z_min": -23,
        "z_max": -10,
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
    "parent_ulpin": "IN-MH-MUM-000023",
    "canonical_rid": "IN-MH-MUM-0000-B0023-B00001-C",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009FF87-B32-BV1",
      "locator": "0x307A9EF690639F42",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307A9EF690639F42",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009FF87A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0023-B00001-C",
        "z_range": [
          0,
          -25
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0023-L00001-B",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "2 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0023-U00101-J",
        "z_range": [
          4,
          -35
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0023-C00001-M",
        "z_range": [
          0,
          -25
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0023-P00001-E",
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
        "rid": "IN-MH-MUM-0000-B0023-A00001-2",
        "z_range": [
          -25,
          0
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4022/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008362",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-23-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000023",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "12.50%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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
    "building_id": "MUM-INF-00004",
    "name": "Mumbai Metro Line 3 — CSMT Underground Terminal",
    "city": "mumbai",
    "lat": 18.94,
    "lon": 72.835,
    "ground_elevation": 5,
    "roof_elevation": 5,
    "height": -24,
    "floor_count": 3,
    "source": "SYNTHETIC",
    "confidence": "SYNTHETIC",
    "validation_status": "VALID",
    "prototype_3d_id": "3D-IN-MUM-UG-e3f4a5b6c7d8",
    "data_label": "SYNTHETIC",
    "is_underground": true,
    "provenance": {
      "source_dataset": "MMRC Subsurface Fixture",
      "crs": "EPSG:4326",
      "acquired_at": "2024-11-01",
      "processing_version": "0.1.0",
      "operator": "PROTOTYPE-PIPELINE",
      "transformations": []
    },
    "floors": [
      {
        "floor_id": "MUM-INF-00004-U1",
        "level_index": -1,
        "label": "Heritage Subway Concourse",
        "z_min": -2,
        "z_max": 5,
        "confidence": "SYNTHETIC",
        "status": "VALID"
      },
      {
        "floor_id": "MUM-INF-00004-U2",
        "level_index": -2,
        "label": "Cross-Over Island Platform",
        "z_min": -19,
        "z_max": -2,
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
    "parent_ulpin": "IN-MH-MUM-000024",
    "canonical_rid": "IN-MH-MUM-0000-B0024-B00001-W",
    "cls": "B",
    "natural_key": {
      "digest": "NK-SHA256-0009FED2-B32-BV1",
      "locator": "0x307A9EFEA75DEC51",
      "version": 1,
      "precision": {
        "xy": "1 cm",
        "z": "1 cm"
      },
      "datum": "EPSG:4979 (WGS84 3D)"
    },
    "spatial_address": {
      "morton_63": "0x307A9EFEA75DEC51",
      "lod": "LOD2",
      "cell_level": 16
    },
    "binding_record": {
      "version": 1,
      "record_hash": "0x0009FED2A1B2C3D4E5F6",
      "prev_hash": "0x0000000000000000",
      "timestamp": "2024-01-15T10:00:00Z",
      "sign_off": {
        "examiner_id": "EXAMINER-MH-MCGM-401",
        "timestamp": "2024-01-15T12:00:00Z"
      }
    },
    "classes_10": [
      {
        "cls": "S",
        "name": "Surface Parcel Column",
        "rid": "IN-MH-MUM-0000-B0000-S00001-5",
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
        "rid": "IN-MH-MUM-0000-B0024-B00001-W",
        "z_range": [
          0,
          -24
        ],
        "status": "PASS",
        "desc": "Sanctioned physical building envelope"
      },
      {
        "cls": "L",
        "name": "Level / Storey Slabs",
        "rid": "IN-MH-MUM-0000-B0024-L00001-V",
        "z_range": [
          0,
          4
        ],
        "status": "PASS",
        "desc": "3 vertical storey slabs"
      },
      {
        "cls": "U",
        "name": "Apartment / Commercial Units",
        "rid": "IN-MH-MUM-0000-B0024-U00101-2",
        "z_range": [
          4,
          -34
        ],
        "status": "PASS",
        "desc": "Residential & commercial spatial units"
      },
      {
        "cls": "C",
        "name": "Common Areas (Lobbies/Stairs)",
        "rid": "IN-MH-MUM-0000-B0024-C00001-5",
        "z_range": [
          0,
          -24
        ],
        "status": "PASS",
        "desc": "Fire exits, service shafts, and entrance lobbies"
      },
      {
        "cls": "P",
        "name": "Accessory Parking Vaults",
        "rid": "IN-MH-MUM-0000-B0024-P00001-Y",
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
        "rid": "IN-MH-MUM-0000-B0024-A00001-M",
        "z_range": [
          -24,
          1
        ],
        "status": "PASS",
        "desc": "Transferable development air-right volume above roof"
      },
      {
        "cls": "T",
        "name": "Subterranean Infrastructure Lot",
        "rid": "IN-MH-MUM-0000-B0000-T00001-F",
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
        "rid": "IN-MH-MUM-0000-B0000-E00001-D",
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
        "rid": "IN-MH-MUM-0000-B0000-I00001-G",
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
        "id_system": "CTS",
        "legacy_value": "MCGM-CTS-WORLI-4023/A",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "RERA",
        "legacy_value": "P51900008363",
        "relationship": "MANY_TO_ONE",
        "verified": true
      },
      {
        "id_system": "SURVEY",
        "legacy_value": "SURV-MILL-24-WORLI",
        "relationship": "ONE_TO_ONE",
        "verified": true
      },
      {
        "id_system": "ULPIN",
        "legacy_value": "IN-MH-MUM-000024",
        "relationship": "ONE_TO_ONE",
        "verified": true
      }
    ],
    "rrr_rights": [
      {
        "type": "STRATA_UNIT_TITLE",
        "holder": "Residential Association / Proprietary Units",
        "undivided_share": "8.33%",
        "legal_basis_status": "VERIFIED",
        "statute": "Maharashtra Apartment Ownership Act 1970 Sec 4",
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
        "holder": "BMC Municipal Utility",
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

export default mumbaiBuildings;
