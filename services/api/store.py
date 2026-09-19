"""
In-memory mock store loading canonical datasets for Bengaluru, Mumbai, Netherlands, and Singapore.
Auto-synchronized with frontend datasets.
"""
from typing import Dict, List
import json

BUILDINGS_DB: Dict[str, List[dict]] = json.loads('''{
  "bengaluru": [
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
      "source": "OSM + BBMP GIS",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-a3f9c2d1e4b7",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11 + BBMP GIS",
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
      ]
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
      "source": "OSM + BBMP GIS",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-c8e2a5f0d391",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM + BBMP GIS",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-d2f4e6a8c012",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11 + BBMP GIS",
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
      ]
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
      "source": "OSM",
      "confidence": "DERIVED",
      "validation_status": "REVIEW",
      "prototype_3d_id": "3D-IN-BLR-f1b7e3a90c44",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-09",
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
      ]
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
      "source": "OSM + BBMP GIS",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-e5a1c3f7b209",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-b3d1e9f2a056",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-08",
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
      ]
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
      "source": "OSM + BBMP GIS",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-a7c2d4e8f130",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-10 + BBMP GIS",
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
      ]
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
      "source": "OSM",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-c4f6a8b0d222",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-e0c2b4f6a334",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-09",
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
      ]
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
      "source": "OSM + BBMP GIS",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-f2a0b6c8d446",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11 + BBMP GIS",
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
      ]
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
      "source": "OSM",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-b8d0a2c4e558",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-09",
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
      ]
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
      "source": "OSM",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-c6e0a2f4b660",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-10",
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
      ]
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
      "source": "OSM",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-d4b2e0f6a772",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-09",
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
      ]
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
      "source": "OSM",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-e2c4a6f8b884",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-09",
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
      ]
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
      "source": "OSM + BBMP GIS",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-f0e2c4a6b996",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11 + BBMP GIS",
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
      ]
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
      "source": "OSM",
      "confidence": "DERIVED",
      "validation_status": "REVIEW",
      "prototype_3d_id": "3D-IN-BLR-a2d4c6b8e0aa",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-10",
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
      ]
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
      "source": "OSM + BBMP GIS",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-b4f6d8a0c2bb",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-c0e2a4b6d8cc",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-08",
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
      ]
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
      ]
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
      ]
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
      "source": "OSM",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-a6b8c0d2e4dd",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-08",
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
      ]
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
      "source": "OSM",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-b2d4e6c8a0ee",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-07",
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
      ]
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
      "source": "OSM",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-BLR-c4e6f8a2b0ff",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-09",
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
      ]
    }
  ],
  "mumbai": [
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
      "source": "OSM 2024 + MCGM GIS",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-a1b2c3d4e5f6",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11 + MCGM GIS Portal",
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
      ]
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
      "source": "OSM 2024 + MCGM GIS",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-c4d5e6f7a8b9",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11 + MCGM GIS",
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
      ]
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
      "source": "OSM 2024 + MCGM GIS",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-d5e6f7a8b9c1",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11 + MCGM GIS",
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
      ]
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
      "source": "OSM 2024 + MCGM GIS",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-e6f7a8b9c0d2",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11 + MCGM GIS",
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
      ]
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
      "source": "OSM 2024",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-f7a8b9c0d1e3",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM 2024 + MCGM GIS",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-a8b9c0d1e2f4",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM 2024",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-b9c0d1e2f3a5",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM 2024 + MCGM GIS",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-c0d1e2f3a4b6",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM 2024",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-d1e2f3a4b5c7",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM 2024",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-e2f3a4b5c6d8",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM 2024 + MCGM",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-b7c8d9e0f1a2",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM 2024",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-f3a4b5c6d7e9",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM 2024",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-a4b5c6d7e8f0",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM 2024",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-b5c6d7e8f9a1",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM 2024 + MMRDA",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-c3d4e5f6a7b8",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-09 + MMRDA Cadastre",
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
      ]
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
      "source": "OSM 2024",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-c6d7e8f9a0b2",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM 2024",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-d7e8f9a0b1c3",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM 2024",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-e8f9a0b1c2d4",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM 2024",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-f9a0b1c2d3e5",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      "source": "OSM 2024",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-IN-MUM-a0b1c2d3e4f6",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OpenStreetMap 2024-11",
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
    }
  ],
  "netherlands": [
    {
      "building_id": "NLD-BLD-00001",
      "name": "De Rotterdam",
      "city": "netherlands",
      "lat": 51.9038,
      "lon": 4.4871,
      "ground_elevation": -0.5,
      "roof_elevation": 148.6,
      "height": 149.1,
      "floor_count": 44,
      "source": "BAG 3D NL + AHN4 LiDAR",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-e1f2a3b4c5d6",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024 + AHN4 LiDAR Point Cloud",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84",
          "AHN4-elevation-merge"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00001-F00",
          "level_index": 0,
          "label": "Ground Lobby & Waterfront Plaza",
          "z_min": -0.5,
          "z_max": 4.2,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00001-F01",
          "level_index": 1,
          "label": "Floor 1 — Conference Centre",
          "z_min": 4.2,
          "z_max": 8,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00001-F02",
          "level_index": 2,
          "label": "Floor 2 — Commercial Office",
          "z_min": 8,
          "z_max": 11.8,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00001-F03",
          "level_index": 3,
          "label": "Floor 3 — West Tower Office",
          "z_min": 11.8,
          "z_max": 15.6,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00001-F25",
          "level_index": 25,
          "label": "Floor 25 — Skybridge Connection",
          "z_min": 92,
          "z_max": 95.8,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00001-F44",
          "level_index": 44,
          "label": "Floor 44 — Penthouse Suites",
          "z_min": 145,
          "z_max": 149.1,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00001-B1",
          "level_index": -1,
          "label": "Basement Parking P1",
          "z_min": -4.5,
          "z_max": -0.5,
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
          "label": "BAG Kadaster Relationship",
          "status": "VALID"
        },
        {
          "id": "overlap",
          "label": "No Unit Overlaps",
          "status": "VALID"
        },
        {
          "id": "watertight",
          "label": "Watertight Solid (LiDAR)",
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
      ]
    },
    {
      "building_id": "NLD-BLD-00002",
      "name": "Maastoren",
      "city": "netherlands",
      "lat": 51.9067,
      "lon": 4.493,
      "ground_elevation": 0,
      "roof_elevation": 164.7,
      "height": 164.7,
      "floor_count": 44,
      "source": "BAG 3D NL + AHN4 LiDAR",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-b8c9d0e1f2a3",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00002-F00",
          "level_index": 0,
          "label": "Ground Floor Atrium",
          "z_min": 0,
          "z_max": 4.5,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00002-F01",
          "level_index": 1,
          "label": "Floor 1 — Deloitte HQ",
          "z_min": 4.5,
          "z_max": 8.5,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00002-F44",
          "level_index": 44,
          "label": "Floor 44 — Roof Plant",
          "z_min": 160,
          "z_max": 164.7,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00002-B1",
          "level_index": -1,
          "label": "Basement Parking P1",
          "z_min": -4,
          "z_max": 0,
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
          "label": "BAG Relationship",
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
      ]
    },
    {
      "building_id": "NLD-BLD-00003",
      "name": "Montevideo Tower",
      "city": "netherlands",
      "lat": 51.9022,
      "lon": 4.4839,
      "ground_elevation": -0.2,
      "roof_elevation": 152.1,
      "height": 152.3,
      "floor_count": 43,
      "source": "BAG 3D NL + AHN4 LiDAR",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-c3d4e5f6a7b8",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00003-F00",
          "level_index": 0,
          "label": "Ground Floor — Health Club",
          "z_min": -0.2,
          "z_max": 3.8,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00003-F01",
          "level_index": 1,
          "label": "Floor 1 — Loft Residences",
          "z_min": 3.8,
          "z_max": 7.6,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00003-F43",
          "level_index": 43,
          "label": "Floor 43 — 'M' Spire Suites",
          "z_min": 147,
          "z_max": 152.1,
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
      ]
    },
    {
      "building_id": "NLD-BLD-00004",
      "name": "New Orleans Tower",
      "city": "netherlands",
      "lat": 51.9016,
      "lon": 4.4856,
      "ground_elevation": -0.3,
      "roof_elevation": 158,
      "height": 158.3,
      "floor_count": 45,
      "source": "BAG 3D NL + AHN4 LiDAR",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-d4e5f6a7b8c9",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00004-F00",
          "level_index": 0,
          "label": "Ground — LantarenVenster Cinema",
          "z_min": -0.3,
          "z_max": 4.5,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00004-F01",
          "level_index": 1,
          "label": "Floor 1 — Auditorium Foyer",
          "z_min": 4.5,
          "z_max": 8.5,
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
      ]
    },
    {
      "building_id": "NLD-BLD-00005",
      "name": "World Port Center",
      "city": "netherlands",
      "lat": 51.9017,
      "lon": 4.4827,
      "ground_elevation": -0.1,
      "roof_elevation": 123,
      "height": 123.1,
      "floor_count": 32,
      "source": "BAG 3D NL + AHN4 LiDAR",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-e5f6a7b8c9d0",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00005-F00",
          "level_index": 0,
          "label": "Ground — Port Control Lobby",
          "z_min": -0.1,
          "z_max": 4.2,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00005-F01",
          "level_index": 1,
          "label": "Floor 1 — Port Authority",
          "z_min": 4.2,
          "z_max": 8,
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
      ]
    },
    {
      "building_id": "NLD-BLD-00006",
      "name": "Hotel New York (HAL Monument)",
      "city": "netherlands",
      "lat": 51.9009,
      "lon": 4.483,
      "ground_elevation": 0.1,
      "roof_elevation": 22.1,
      "height": 22,
      "floor_count": 4,
      "source": "BAG 3D NL",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-f6a7b8c9d0e1",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00006-F00",
          "level_index": 0,
          "label": "Grand Oyster Bar & Lobby",
          "z_min": 0.1,
          "z_max": 5.2,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00006-F01",
          "level_index": 1,
          "label": "Floor 1 — Historical Rooms",
          "z_min": 5.2,
          "z_max": 10.5,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00006-F02",
          "level_index": 2,
          "label": "Floor 2 — Boardrooms",
          "z_min": 10.5,
          "z_max": 16,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00006-F03",
          "level_index": 3,
          "label": "Floor 3 — Turret Suites",
          "z_min": 16,
          "z_max": 22.1,
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
      ]
    },
    {
      "building_id": "NLD-BLD-00007",
      "name": "Boston & Seattle Towers",
      "city": "netherlands",
      "lat": 51.9027,
      "lon": 4.4892,
      "ground_elevation": -0.2,
      "roof_elevation": 69.8,
      "height": 70,
      "floor_count": 23,
      "source": "BAG 3D NL",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-a7b8c9d0e1f2",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00007-F00",
          "level_index": 0,
          "label": "Ground — Retail & Plinth",
          "z_min": -0.2,
          "z_max": 3.8,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00007-F01",
          "level_index": 1,
          "label": "Floor 1 — Waterfront Living",
          "z_min": 3.8,
          "z_max": 7.2,
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
      ]
    },
    {
      "building_id": "NLD-BLD-00008",
      "name": "Gebouw Delftse Poort (NN Tower)",
      "city": "netherlands",
      "lat": 51.9231,
      "lon": 4.4715,
      "ground_elevation": 0.5,
      "roof_elevation": 151.9,
      "height": 151.4,
      "floor_count": 41,
      "source": "BAG 3D NL + AHN4 LiDAR",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-b8c9d0e1f2a4",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00008-F00",
          "level_index": 0,
          "label": "Ground — Central Station Concourse",
          "z_min": 0.5,
          "z_max": 5,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00008-F01",
          "level_index": 1,
          "label": "Floor 1 — NN Corporate Center",
          "z_min": 5,
          "z_max": 9,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00008-F41",
          "level_index": 41,
          "label": "Floor 41 — Glass Apex Plant",
          "z_min": 147,
          "z_max": 151.9,
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
      ]
    },
    {
      "building_id": "NLD-BLD-00009",
      "name": "Millennium Tower (Rotterdam Marriott)",
      "city": "netherlands",
      "lat": 51.9224,
      "lon": 4.4735,
      "ground_elevation": 0.4,
      "roof_elevation": 131.4,
      "height": 131,
      "floor_count": 34,
      "source": "BAG 3D NL + AHN4 LiDAR",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-c9d0e1f2a3b5",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00009-F00",
          "level_index": 0,
          "label": "Ground — Hotel Lobby & Weena Entrance",
          "z_min": 0.4,
          "z_max": 4.5,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00009-F01",
          "level_index": 1,
          "label": "Floor 1 — Ballroom & Dining",
          "z_min": 4.5,
          "z_max": 8.8,
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
      ]
    },
    {
      "building_id": "NLD-BLD-00010",
      "name": "Markthal Rotterdam",
      "city": "netherlands",
      "lat": 51.92,
      "lon": 4.4858,
      "ground_elevation": 0.2,
      "roof_elevation": 40.2,
      "height": 40,
      "floor_count": 10,
      "source": "BAG 3D NL",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-f7a8b9c0d1e2",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00010-F00",
          "level_index": 0,
          "label": "Market Hall & Fresh Produce Ground",
          "z_min": 0.2,
          "z_max": 5.5,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00010-F01",
          "level_index": 1,
          "label": "Arch Row 1 — Apartments",
          "z_min": 5.5,
          "z_max": 9.5,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00010-F02",
          "level_index": 2,
          "label": "Arch Row 2 — Apartments",
          "z_min": 9.5,
          "z_max": 13.5,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00010-F09",
          "level_index": 9,
          "label": "Arch Apex Penthouse Units",
          "z_min": 35,
          "z_max": 40.2,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00010-B1",
          "level_index": -1,
          "label": "Supermarket & Parking B1",
          "z_min": -4.5,
          "z_max": 0.2,
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
          "label": "BAG Kadaster Relationship",
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
      ]
    },
    {
      "building_id": "NLD-BLD-00011",
      "name": "Cooltoren",
      "city": "netherlands",
      "lat": 51.9161,
      "lon": 4.4792,
      "ground_elevation": 0.1,
      "roof_elevation": 154.1,
      "height": 154,
      "floor_count": 50,
      "source": "BAG 3D NL + AHN4 LiDAR",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-d0e1f2a3b4c6",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00011-F00",
          "level_index": 0,
          "label": "Ground — Baankwartier Entrance",
          "z_min": 0.1,
          "z_max": 4,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00011-F01",
          "level_index": 1,
          "label": "Floor 1 — Lower Tier Residences",
          "z_min": 4,
          "z_max": 7.2,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00011-F25",
          "level_index": 25,
          "label": "Floor 25 — Mid-Tier Balconies",
          "z_min": 75,
          "z_max": 78.5,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00011-F50",
          "level_index": 50,
          "label": "Floor 50 — Crown Penthouses",
          "z_min": 150,
          "z_max": 154.1,
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
      ]
    },
    {
      "building_id": "NLD-BLD-00012",
      "name": "World Trade Center Rotterdam",
      "city": "netherlands",
      "lat": 51.9205,
      "lon": 4.4812,
      "ground_elevation": 0.3,
      "roof_elevation": 93.3,
      "height": 93,
      "floor_count": 23,
      "source": "BAG 3D NL",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-e1f2a3b4c5d7",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00012-F00",
          "level_index": 0,
          "label": "Beursplein Historic Exchange Hall",
          "z_min": 0.3,
          "z_max": 6,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00012-F01",
          "level_index": 1,
          "label": "Floor 1 — WTC International Trade",
          "z_min": 6,
          "z_max": 10,
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
      ]
    },
    {
      "building_id": "NLD-BLD-00013",
      "name": "Timmerhuis (OMA)",
      "city": "netherlands",
      "lat": 51.9221,
      "lon": 4.482,
      "ground_elevation": 0.3,
      "roof_elevation": 40.3,
      "height": 40,
      "floor_count": 9,
      "source": "BAG 3D NL",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-f2a3b4c5d6e8",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00013-F00",
          "level_index": 0,
          "label": "Ground — Museum Rotterdam & Public Atrium",
          "z_min": 0.3,
          "z_max": 5,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00013-F01",
          "level_index": 1,
          "label": "Floor 1 — Municipal Offices",
          "z_min": 5,
          "z_max": 9.2,
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
      ]
    },
    {
      "building_id": "NLD-BLD-00014",
      "name": "Stadhuis Rotterdam (City Hall)",
      "city": "netherlands",
      "lat": 51.923,
      "lon": 4.4795,
      "ground_elevation": 0.4,
      "roof_elevation": 35.4,
      "height": 35,
      "floor_count": 4,
      "source": "BAG 3D NL",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-a3b4c5d6e7f9",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00014-F00",
          "level_index": 0,
          "label": "Ground — Monumental Courtyard & Vestibule",
          "z_min": 0.4,
          "z_max": 7,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00014-F01",
          "level_index": 1,
          "label": "Floor 1 — Mayor & Council Chamber",
          "z_min": 7,
          "z_max": 15,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00014-F02",
          "level_index": 2,
          "label": "Floor 2 — Committee Rooms",
          "z_min": 15,
          "z_max": 23,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00014-F03",
          "level_index": 3,
          "label": "Floor 3 — Bell Tower Base",
          "z_min": 23,
          "z_max": 35.4,
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
      ]
    },
    {
      "building_id": "NLD-BLD-00015",
      "name": "Grote of Sint-Laurenskerk",
      "city": "netherlands",
      "lat": 51.9213,
      "lon": 4.4842,
      "ground_elevation": 0.2,
      "roof_elevation": 65.2,
      "height": 65,
      "floor_count": 6,
      "source": "BAG 3D NL",
      "confidence": "DERIVED",
      "validation_status": "REVIEW",
      "prototype_3d_id": "3D-NLD-RTD-b4c5d6e7f8a0",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00015-F00",
          "level_index": 0,
          "label": "Gothic Nave & Organ Hall",
          "z_min": 0.2,
          "z_max": 18,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00015-F01",
          "level_index": 1,
          "label": "Tower Bellfry & Carillon",
          "z_min": 18,
          "z_max": 42,
          "confidence": "INFERRED",
          "status": "REVIEW"
        },
        {
          "floor_id": "NLD-BLD-00015-F02",
          "level_index": 2,
          "label": "Tower Lookout Platform",
          "z_min": 42,
          "z_max": 65.2,
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
      ]
    },
    {
      "building_id": "NLD-BLD-00016",
      "name": "Erasmus MC Tower",
      "city": "netherlands",
      "lat": 51.9113,
      "lon": 4.469,
      "ground_elevation": 0.2,
      "roof_elevation": 120.2,
      "height": 120,
      "floor_count": 30,
      "source": "BAG 3D NL + AHN4 LiDAR",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-c5d6e7f8a9b1",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00016-F00",
          "level_index": 0,
          "label": "Ground — Central Passage & Emergency",
          "z_min": 0.2,
          "z_max": 5,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00016-F01",
          "level_index": 1,
          "label": "Floor 1 — Diagnostic Imaging",
          "z_min": 5,
          "z_max": 9.5,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00016-F30",
          "level_index": 30,
          "label": "Floor 30 — Rooftop Helipad & Plant",
          "z_min": 115,
          "z_max": 120.2,
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
      ]
    },
    {
      "building_id": "NLD-BLD-00017",
      "name": "Depot Boijmans Van Beuningen",
      "city": "netherlands",
      "lat": 51.9142,
      "lon": 4.4732,
      "ground_elevation": 0.3,
      "roof_elevation": 39.8,
      "height": 39.5,
      "floor_count": 6,
      "source": "BAG 3D NL + AHN4 LiDAR",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-d6e7f8a9b0c2",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00017-F00",
          "level_index": 0,
          "label": "Ground — Mirror Atrium & Restorer Labs",
          "z_min": 0.3,
          "z_max": 6.5,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00017-F01",
          "level_index": 1,
          "label": "Floor 1 — Classical Art Vaults",
          "z_min": 6.5,
          "z_max": 13,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00017-F05",
          "level_index": 5,
          "label": "Floor 5 — Rooftop Birch Forest Pavilion",
          "z_min": 32,
          "z_max": 39.8,
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
      ]
    },
    {
      "building_id": "NLD-BLD-00018",
      "name": "Het Nieuwe Instituut",
      "city": "netherlands",
      "lat": 51.9135,
      "lon": 4.472,
      "ground_elevation": 0.2,
      "roof_elevation": 18.2,
      "height": 18,
      "floor_count": 3,
      "source": "BAG 3D NL",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-e7f8a9b0c1d3",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00018-F00",
          "level_index": 0,
          "label": "Ground — Design Gallery & Pond Terrace",
          "z_min": 0.2,
          "z_max": 6,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00018-F01",
          "level_index": 1,
          "label": "Floor 1 — State National Architecture Archive",
          "z_min": 6,
          "z_max": 12,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00018-F02",
          "level_index": 2,
          "label": "Floor 2 — Research Labs & Library",
          "z_min": 12,
          "z_max": 18.2,
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
      ]
    },
    {
      "building_id": "NLD-BLD-00019",
      "name": "Euromast Spire",
      "city": "netherlands",
      "lat": 51.9054,
      "lon": 4.4666,
      "ground_elevation": 1,
      "roof_elevation": 186,
      "height": 185,
      "floor_count": 6,
      "source": "BAG 3D NL + AHN4 LiDAR",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-f8a9b0c1d2e4",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00019-F00",
          "level_index": 0,
          "label": "Ground — Parkhaven Pavilion",
          "z_min": 1,
          "z_max": 6,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00019-F01",
          "level_index": 1,
          "label": "Crow's Nest Restaurant (96m)",
          "z_min": 94,
          "z_max": 102,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00019-F02",
          "level_index": 2,
          "label": "Main Viewing Platform (112m)",
          "z_min": 110,
          "z_max": 115,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00019-F03",
          "level_index": 3,
          "label": "Euroscoop Rotating Glass Cabin (185m)",
          "z_min": 175,
          "z_max": 186,
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
      ]
    },
    {
      "building_id": "NLD-BLD-00020",
      "name": "De Hoge Heren (Twin Towers)",
      "city": "netherlands",
      "lat": 51.91,
      "lon": 4.4818,
      "ground_elevation": 0.2,
      "roof_elevation": 102.2,
      "height": 102,
      "floor_count": 34,
      "source": "BAG 3D NL",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-RTD-a9b0c1d2e3f5",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "BAG 3D Netherlands 2024",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "RD-New(EPSG:28992)→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "NLD-BLD-00020-F00",
          "level_index": 0,
          "label": "Ground — Scheepvaartkwartier Plinth",
          "z_min": 0.2,
          "z_max": 4,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-BLD-00020-F01",
          "level_index": 1,
          "label": "Floor 1 — Harbour View Apartments",
          "z_min": 4,
          "z_max": 7.2,
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
      ]
    },
    {
      "building_id": "NLD-INF-00001",
      "name": "Maastunnel — Car & Bicycle Tubes",
      "city": "netherlands",
      "lat": 51.906,
      "lon": 4.479,
      "ground_elevation": 0,
      "roof_elevation": 0,
      "height": -25,
      "floor_count": 1,
      "source": "SYNTHETIC",
      "confidence": "SYNTHETIC",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-UG-TUN-h9i0j1k2l3m4",
      "data_label": "SYNTHETIC",
      "is_underground": true,
      "provenance": {
        "source_dataset": "Synthetic Demo Fixture v0.1",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": []
      },
      "floors": [
        {
          "floor_id": "NLD-INF-00001-U1",
          "level_index": -1,
          "label": "Sub-river Immersed Tube",
          "z_min": -25,
          "z_max": 0,
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
      ]
    },
    {
      "building_id": "NLD-INF-00002",
      "name": "Rotterdam Metro — Wilhelminaplein Station",
      "city": "netherlands",
      "lat": 51.907,
      "lon": 4.489,
      "ground_elevation": 0,
      "roof_elevation": 0,
      "height": -16,
      "floor_count": 2,
      "source": "SYNTHETIC",
      "confidence": "SYNTHETIC",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-NLD-UG-MET-i0j1k2l3m4n5",
      "data_label": "SYNTHETIC",
      "is_underground": true,
      "provenance": {
        "source_dataset": "Synthetic Demo Fixture v0.1",
        "crs": "EPSG:28992",
        "acquired_at": "2024-08-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": []
      },
      "floors": [
        {
          "floor_id": "NLD-INF-00002-U1",
          "level_index": -1,
          "label": "Concourse & Ticket Hall",
          "z_min": -8,
          "z_max": 0,
          "confidence": "SYNTHETIC",
          "status": "VALID"
        },
        {
          "floor_id": "NLD-INF-00002-U2",
          "level_index": -2,
          "label": "Line D/E Track Platforms",
          "z_min": -16,
          "z_max": -8,
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
      ]
    }
  ],
  "singapore": [
    {
      "building_id": "SGP-BLD-00001",
      "name": "Marina Bay Financial Centre — Tower 3",
      "city": "singapore",
      "lat": 1.2796,
      "lon": 103.8546,
      "ground_elevation": 3.2,
      "roof_elevation": 248.2,
      "height": 245,
      "floor_count": 50,
      "source": "OneMap SLA 2024",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-MBF-b2c9d4e1f803",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024 + URA Master Plan",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84",
          "DEM-elevation-merge"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00001-F00",
          "level_index": 0,
          "label": "Podium Grand Lobby & Retail",
          "z_min": 3.2,
          "z_max": 8.5,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00001-F01",
          "level_index": 1,
          "label": "Floor 1 — Financial Suite",
          "z_min": 8.5,
          "z_max": 13,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00001-F25",
          "level_index": 25,
          "label": "Floor 25 — Sky Terrace",
          "z_min": 118,
          "z_max": 122.5,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00001-F50",
          "level_index": 50,
          "label": "Floor 50 — Executive Suite",
          "z_min": 243,
          "z_max": 248.2,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00001-B1",
          "level_index": -1,
          "label": "Basement Carpark & UPN Mall",
          "z_min": -1.5,
          "z_max": 3.2,
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
          "label": "Strata Lot Relationship",
          "status": "VALID"
        },
        {
          "id": "overlap",
          "label": "No Strata Overlaps",
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
      ]
    },
    {
      "building_id": "SGP-BLD-00002",
      "name": "Marina Bay Financial Centre — Tower 1",
      "city": "singapore",
      "lat": 1.2805,
      "lon": 103.853,
      "ground_elevation": 3.2,
      "roof_elevation": 189.2,
      "height": 186,
      "floor_count": 33,
      "source": "OneMap SLA",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-MBF-a1c8e3f2b405",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00002-F00",
          "level_index": 0,
          "label": "Ground Banking Atrium",
          "z_min": 3.2,
          "z_max": 8.5,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00002-F33",
          "level_index": 33,
          "label": "Floor 33 — Roof Plant",
          "z_min": 181,
          "z_max": 186,
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
          "label": "Strata Lot Relationship",
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
      ]
    },
    {
      "building_id": "SGP-BLD-00003",
      "name": "Marina Bay Financial Centre — Tower 2",
      "city": "singapore",
      "lat": 1.28,
      "lon": 103.8538,
      "ground_elevation": 3.2,
      "roof_elevation": 242.2,
      "height": 239,
      "floor_count": 50,
      "source": "OneMap SLA",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-MBF-c3e0f5a4d617",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00003-F00",
          "level_index": 0,
          "label": "Ground Lobby",
          "z_min": 3.2,
          "z_max": 8,
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
          "id": "id-unique",
          "label": "Identifier Uniqueness",
          "status": "VALID"
        },
        {
          "id": "provenance",
          "label": "Provenance Complete",
          "status": "VALID"
        }
      ]
    },
    {
      "building_id": "SGP-BLD-00004",
      "name": "Marina Bay Sands — Towers & SkyPark",
      "city": "singapore",
      "lat": 1.2838,
      "lon": 103.8591,
      "ground_elevation": 3,
      "roof_elevation": 203,
      "height": 200,
      "floor_count": 57,
      "source": "OneMap SLA 2024",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-MBS-e4f1a2b3c4d5",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024 + URA Master Plan",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84",
          "DEM-elevation-merge"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00004-F00",
          "level_index": 0,
          "label": "Hotel Grand Atrium (Tower 1-3)",
          "z_min": 3,
          "z_max": 12,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00004-F22",
          "level_index": 22,
          "label": "Floor 22 Guest Suites",
          "z_min": 78,
          "z_max": 81.5,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00004-F57",
          "level_index": 57,
          "label": "Cantilevered Sands SkyPark Deck",
          "z_min": 195,
          "z_max": 203,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00004-B1",
          "level_index": -1,
          "label": "Shoppes at Marina Bay Sands B1",
          "z_min": -3,
          "z_max": 3,
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
          "label": "Strata Lot Relationship",
          "status": "VALID"
        },
        {
          "id": "overlap",
          "label": "No Strata Overlaps",
          "status": "VALID"
        },
        {
          "id": "watertight",
          "label": "Watertight Cantilever Solid",
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
      ]
    },
    {
      "building_id": "SGP-BLD-00005",
      "name": "Marina One — West Tower (Commercial)",
      "city": "singapore",
      "lat": 1.2778,
      "lon": 103.853,
      "ground_elevation": 3,
      "roof_elevation": 143,
      "height": 140,
      "floor_count": 30,
      "source": "OneMap SLA",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-MRO-f5a2b3c4d5e6",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00005-F00",
          "level_index": 0,
          "label": "Green Heart Central Plaza",
          "z_min": 3,
          "z_max": 8.5,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00005-F30",
          "level_index": 30,
          "label": "Floor 30 Commercial Office",
          "z_min": 135,
          "z_max": 140,
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
      ]
    },
    {
      "building_id": "SGP-BLD-00006",
      "name": "Marina One — East Tower (Residences)",
      "city": "singapore",
      "lat": 1.2782,
      "lon": 103.8538,
      "ground_elevation": 3,
      "roof_elevation": 143,
      "height": 140,
      "floor_count": 34,
      "source": "OneMap SLA",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-MRO-a6b3c4d5e6f7",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00006-F00",
          "level_index": 0,
          "label": "Residential Foyer",
          "z_min": 3,
          "z_max": 7.5,
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
      ]
    },
    {
      "building_id": "SGP-BLD-00007",
      "name": "Ocean Financial Centre",
      "city": "singapore",
      "lat": 1.2828,
      "lon": 103.8522,
      "ground_elevation": 2.8,
      "roof_elevation": 247.8,
      "height": 245,
      "floor_count": 43,
      "source": "OneMap SLA",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-OFC-b7c4d5e6f7a8",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00007-F00",
          "level_index": 0,
          "label": "Solar Wall Main Lobby",
          "z_min": 2.8,
          "z_max": 8,
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
      ]
    },
    {
      "building_id": "SGP-BLD-00008",
      "name": "Guoco Tower (Tanjong Pagar Centre)",
      "city": "singapore",
      "lat": 1.2766,
      "lon": 103.8458,
      "ground_elevation": 4,
      "roof_elevation": 287.7,
      "height": 283.7,
      "floor_count": 68,
      "source": "OneMap SLA 2024",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-GCT-c8d5e6f7a8b9",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024 + URA Master Plan",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84",
          "DEM-elevation-merge"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00008-F00",
          "level_index": 0,
          "label": "Ground Urban Park & Atrium",
          "z_min": 4,
          "z_max": 9.5,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00008-F01",
          "level_index": 1,
          "label": "Offices Level 1",
          "z_min": 9.5,
          "z_max": 14,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00008-F39",
          "level_index": 39,
          "label": "Floor 39 Wallich Residence",
          "z_min": 165,
          "z_max": 169,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00008-F68",
          "level_index": 68,
          "label": "Super Penthouse (Summit)",
          "z_min": 279,
          "z_max": 283.7,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00008-B1",
          "level_index": -1,
          "label": "Direct MRT Concourse B1",
          "z_min": -2,
          "z_max": 4,
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
          "label": "Vertical Range (Tallest SG)",
          "status": "VALID"
        },
        {
          "id": "parent-rel",
          "label": "Strata Lot Relationship",
          "status": "VALID"
        },
        {
          "id": "overlap",
          "label": "No Strata Overlaps",
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
      ]
    },
    {
      "building_id": "SGP-BLD-00009",
      "name": "One Raffles Place — Tower 1",
      "city": "singapore",
      "lat": 1.284,
      "lon": 103.8512,
      "ground_elevation": 2.8,
      "roof_elevation": 283.8,
      "height": 281,
      "floor_count": 63,
      "source": "OneMap SLA",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-ORP-d4f0a8c2b119",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00009-F00",
          "level_index": 0,
          "label": "Ground Floor Atrium",
          "z_min": 2.8,
          "z_max": 7.5,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00009-F63",
          "level_index": 63,
          "label": "Floor 63 Rooftop Bar",
          "z_min": 275,
          "z_max": 281,
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
          "id": "id-unique",
          "label": "Identifier Uniqueness",
          "status": "VALID"
        },
        {
          "id": "provenance",
          "label": "Provenance Complete",
          "status": "VALID"
        }
      ]
    },
    {
      "building_id": "SGP-BLD-00010",
      "name": "One Raffles Place — Tower 2",
      "city": "singapore",
      "lat": 1.2843,
      "lon": 103.8518,
      "ground_elevation": 2.8,
      "roof_elevation": 211.8,
      "height": 209,
      "floor_count": 38,
      "source": "OneMap SLA",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-ORP-e9f6a7b8c9d0",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00010-F00",
          "level_index": 0,
          "label": "Ground Lobby",
          "z_min": 2.8,
          "z_max": 7.5,
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
      ]
    },
    {
      "building_id": "SGP-BLD-00011",
      "name": "Republic Plaza",
      "city": "singapore",
      "lat": 1.283,
      "lon": 103.8507,
      "ground_elevation": 2.8,
      "roof_elevation": 282.8,
      "height": 280,
      "floor_count": 66,
      "source": "OneMap SLA",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-RPZ-f0a7b8c9d0e1",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00011-F00",
          "level_index": 0,
          "label": "Ground 4-Storey Atrium",
          "z_min": 2.8,
          "z_max": 14.5,
          "confidence": "DERIVED",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00011-F66",
          "level_index": 66,
          "label": "Floor 66 Sky Club",
          "z_min": 274,
          "z_max": 280,
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
      ]
    },
    {
      "building_id": "SGP-BLD-00012",
      "name": "UOB Plaza One",
      "city": "singapore",
      "lat": 1.2855,
      "lon": 103.851,
      "ground_elevation": 2.8,
      "roof_elevation": 282.8,
      "height": 280,
      "floor_count": 67,
      "source": "OneMap SLA",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-UOB-a1b8c9d0e1f2",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00012-F00",
          "level_index": 0,
          "label": "Singapore River Promenade Lobby",
          "z_min": 2.8,
          "z_max": 8.5,
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
      ]
    },
    {
      "building_id": "SGP-BLD-00013",
      "name": "CapitaSpring (88 Market St)",
      "city": "singapore",
      "lat": 1.2845,
      "lon": 103.8501,
      "ground_elevation": 3,
      "roof_elevation": 283,
      "height": 280,
      "floor_count": 51,
      "source": "OneMap SLA 2024",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-CPS-b2c9d0e1f2a3",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024 + URA Master Plan",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00013-F00",
          "level_index": 0,
          "label": "Ground Public Atrium",
          "z_min": 3,
          "z_max": 9,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00013-F17",
          "level_index": 17,
          "label": "Green Oasis Sky Garden L17",
          "z_min": 98,
          "z_max": 104,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00013-F20",
          "level_index": 20,
          "label": "Green Oasis Sky Garden L20",
          "z_min": 114,
          "z_max": 120,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00013-F51",
          "level_index": 51,
          "label": "1-Arden Rooftop Urban Farm",
          "z_min": 274,
          "z_max": 280,
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
          "label": "Strata Lot Relationship",
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
      ]
    },
    {
      "building_id": "SGP-BLD-00014",
      "name": "CapitaGreen",
      "city": "singapore",
      "lat": 1.2818,
      "lon": 103.8508,
      "ground_elevation": 3,
      "roof_elevation": 245,
      "height": 242,
      "floor_count": 40,
      "source": "OneMap SLA",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-CPG-c3d0e1f2a3b4",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00014-F00",
          "level_index": 0,
          "label": "Botanical Double-Skin Lobby",
          "z_min": 3,
          "z_max": 8.5,
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
      ]
    },
    {
      "building_id": "SGP-BLD-00015",
      "name": "Asia Square — Tower 1",
      "city": "singapore",
      "lat": 1.2788,
      "lon": 103.8518,
      "ground_elevation": 3.2,
      "roof_elevation": 232.2,
      "height": 229,
      "floor_count": 43,
      "source": "OneMap SLA",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-ASQ-d4e1f2a3b4c5",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00015-F00",
          "level_index": 0,
          "label": "The Cube Covered Square",
          "z_min": 3.2,
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
      ]
    },
    {
      "building_id": "SGP-BLD-00016",
      "name": "Asia Square — Tower 2 (The Westin)",
      "city": "singapore",
      "lat": 1.2792,
      "lon": 103.8525,
      "ground_elevation": 3.2,
      "roof_elevation": 224.2,
      "height": 221,
      "floor_count": 46,
      "source": "OneMap SLA",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-ASQ-e5f2a3b4c5d6",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00016-F00",
          "level_index": 0,
          "label": "Hotel & Office Grand Lobby",
          "z_min": 3.2,
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
      ]
    },
    {
      "building_id": "SGP-BLD-00017",
      "name": "The Pinnacle@Duxton (Towers 1A-1G)",
      "city": "singapore",
      "lat": 1.2772,
      "lon": 103.8415,
      "ground_elevation": 6,
      "roof_elevation": 162,
      "height": 156,
      "floor_count": 50,
      "source": "OneMap SLA 2024",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-PIN-f6a3b4c5d6e7",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024 + HDB Cadastre",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00017-F00",
          "level_index": 0,
          "label": "Ground Plaza & Food Court",
          "z_min": 6,
          "z_max": 10.5,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00017-F26",
          "level_index": 26,
          "label": "Skybridge 1 (500m Loop)",
          "z_min": 86,
          "z_max": 90.5,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00017-F50",
          "level_index": 50,
          "label": "Skybridge 2 (Viewing Deck)",
          "z_min": 156,
          "z_max": 162,
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
          "label": "HDB Strata Lot Relationship",
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
      ]
    },
    {
      "building_id": "SGP-BLD-00018",
      "name": "Singapore Land Authority (SLA) — Revenue House",
      "city": "singapore",
      "lat": 1.3182,
      "lon": 103.8446,
      "ground_elevation": 12,
      "roof_elevation": 110,
      "height": 98,
      "floor_count": 24,
      "source": "OneMap SLA",
      "confidence": "DERIVED_HIGH",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-SLA-a7b4c5d6e7f8",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00018-F00",
          "level_index": 0,
          "label": "SLA Land Titles Customer Service",
          "z_min": 12,
          "z_max": 17.5,
          "confidence": "DERIVED_HIGH",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-BLD-00018-F24",
          "level_index": 24,
          "label": "Chief Executive Cadastral Suite",
          "z_min": 104,
          "z_max": 110,
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
          "id": "id-unique",
          "label": "Identifier Uniqueness",
          "status": "VALID"
        },
        {
          "id": "provenance",
          "label": "Provenance Complete",
          "status": "VALID"
        }
      ]
    },
    {
      "building_id": "SGP-BLD-00019",
      "name": "Victoria Concert Hall (Heritage Air-Rights)",
      "city": "singapore",
      "lat": 1.2882,
      "lon": 103.852,
      "ground_elevation": 3.5,
      "roof_elevation": 57.5,
      "height": 54,
      "floor_count": 4,
      "source": "OneMap SLA",
      "confidence": "DERIVED",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-VCH-b8c5d6e7f8a9",
      "data_label": "DERIVED",
      "provenance": {
        "source_dataset": "OneMap SLA 2024",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": [
          "SVY21→WGS84"
        ]
      },
      "floors": [
        {
          "floor_id": "SGP-BLD-00019-F00",
          "level_index": 0,
          "label": "Heritage Concert Foyer",
          "z_min": 3.5,
          "z_max": 12,
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
      ]
    },
    {
      "building_id": "SGP-INF-00001",
      "name": "Bayfront MRT Underground Interchange (Circle & Downtown Lines)",
      "city": "singapore",
      "lat": 1.2822,
      "lon": 103.8594,
      "ground_elevation": 3,
      "roof_elevation": 3,
      "height": -22.5,
      "floor_count": 4,
      "source": "SYNTHETIC",
      "confidence": "SYNTHETIC",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-UG-MRT-c5a1e7f02d88",
      "data_label": "SYNTHETIC",
      "is_underground": true,
      "provenance": {
        "source_dataset": "SLA Subterranean 3D Cadastre Fixture v0.1",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": []
      },
      "floors": [
        {
          "floor_id": "SGP-INF-00001-U1",
          "level_index": -1,
          "label": "Underground Mezzanine & Concourse",
          "z_min": -2.5,
          "z_max": 3,
          "confidence": "SYNTHETIC",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-INF-00001-U2",
          "level_index": -2,
          "label": "Circle Line Upper Platform",
          "z_min": -9.5,
          "z_max": -2.5,
          "confidence": "SYNTHETIC",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-INF-00001-U3",
          "level_index": -3,
          "label": "Downtown Line Lower Platform",
          "z_min": -19.5,
          "z_max": -9.5,
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
      ]
    },
    {
      "building_id": "SGP-INF-00002",
      "name": "Raffles Place MRT Subterranean 4-Tier Complex",
      "city": "singapore",
      "lat": 1.2835,
      "lon": 103.8515,
      "ground_elevation": 2.8,
      "roof_elevation": 2.8,
      "height": -28,
      "floor_count": 4,
      "source": "SYNTHETIC",
      "confidence": "SYNTHETIC",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-UG-MRT-d6b2f8a13e99",
      "data_label": "SYNTHETIC",
      "is_underground": true,
      "provenance": {
        "source_dataset": "LTA / SLA Subsurface Cadastre Fixture",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": []
      },
      "floors": [
        {
          "floor_id": "SGP-INF-00002-U1",
          "level_index": -1,
          "label": "Underground Shopping Concourse",
          "z_min": -3,
          "z_max": 2.8,
          "confidence": "SYNTHETIC",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-INF-00002-U2",
          "level_index": -2,
          "label": "Upper Cross-Platform Deck",
          "z_min": -14,
          "z_max": -3,
          "confidence": "SYNTHETIC",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-INF-00002-U3",
          "level_index": -3,
          "label": "Lower Cross-Platform Deck",
          "z_min": -25.2,
          "z_max": -14,
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
      ]
    },
    {
      "building_id": "SGP-INF-00003",
      "name": "Marina Bay Underground Pedestrian Network (UPN)",
      "city": "singapore",
      "lat": 1.2808,
      "lon": 103.8535,
      "ground_elevation": 3.2,
      "roof_elevation": 3.2,
      "height": -7.5,
      "floor_count": 1,
      "source": "SYNTHETIC",
      "confidence": "SYNTHETIC",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-UG-UPN-e7c3a9b24f00",
      "data_label": "SYNTHETIC",
      "is_underground": true,
      "provenance": {
        "source_dataset": "URA Subsurface Pedestrian Network",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": []
      },
      "floors": [
        {
          "floor_id": "SGP-INF-00003-U1",
          "level_index": -1,
          "label": "Air-Conditioned Pedestrian Spine",
          "z_min": -4.3,
          "z_max": 3.2,
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
      ]
    },
    {
      "building_id": "SGP-INF-00004",
      "name": "Marina Bay Common Services Tunnel (CST)",
      "city": "singapore",
      "lat": 1.2815,
      "lon": 103.856,
      "ground_elevation": 3,
      "roof_elevation": 3,
      "height": -16,
      "floor_count": 2,
      "source": "SYNTHETIC",
      "confidence": "SYNTHETIC",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-UG-CST-f8d4b0c35a11",
      "data_label": "SYNTHETIC",
      "is_underground": true,
      "provenance": {
        "source_dataset": "PUB / SP Group Multi-Utility Tunnel Cadastre",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": []
      },
      "floors": [
        {
          "floor_id": "SGP-INF-00004-U1",
          "level_index": -1,
          "label": "Electrical 66kV & Telecom Chute",
          "z_min": -6,
          "z_max": 3,
          "confidence": "SYNTHETIC",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-INF-00004-U2",
          "level_index": -2,
          "label": "District Cooling & Potable Mains",
          "z_min": -13,
          "z_max": -6,
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
      ]
    },
    {
      "building_id": "SGP-INF-00005",
      "name": "Jurong Rock Caverns (Subterranean Liquid Storage)",
      "city": "singapore",
      "lat": 1.258,
      "lon": 103.712,
      "ground_elevation": 2.5,
      "roof_elevation": 2.5,
      "height": -130,
      "floor_count": 3,
      "source": "SYNTHETIC",
      "confidence": "SYNTHETIC",
      "validation_status": "VALID",
      "prototype_3d_id": "3D-SGP-UG-JRC-a9e5c1d46b22",
      "data_label": "SYNTHETIC",
      "is_underground": true,
      "provenance": {
        "source_dataset": "JTC Deep Rock Cavern Subsurface Profile",
        "crs": "EPSG:3414",
        "acquired_at": "2024-10-01",
        "processing_version": "0.1.0",
        "operator": "PROTOTYPE-PIPELINE",
        "transformations": []
      },
      "floors": [
        {
          "floor_id": "SGP-INF-00005-U1",
          "level_index": -1,
          "label": "Vertical Access Shaft (-60m)",
          "z_min": -60,
          "z_max": 2.5,
          "confidence": "SYNTHETIC",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-INF-00005-U2",
          "level_index": -2,
          "label": "Operation Gallery & Pump Room",
          "z_min": -100,
          "z_max": -60,
          "confidence": "SYNTHETIC",
          "status": "VALID"
        },
        {
          "floor_id": "SGP-INF-00005-U3",
          "level_index": -3,
          "label": "Deep Hydrocarbon Storage Cavern",
          "z_min": -127.5,
          "z_max": -100,
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
          "label": "Vertical Range (Deep Subsurface)",
          "status": "VALID"
        },
        {
          "id": "id-unique",
          "label": "Identifier Uniqueness",
          "status": "VALID"
        }
      ]
    }
  ]
}''')

PARCELS_DB: Dict[str, List[dict]] = json.loads('''{
  "bengaluru": [
    {
      "parcel_id": "BLR-PRC-101",
      "source_parcel_id": "BBMP-SURV-2024-881",
      "country": "India",
      "city": "bengaluru",
      "coordinates": [
        [
          77.5936,
          12.9706
        ],
        [
          77.5956,
          12.9706
        ],
        [
          77.5956,
          12.9726
        ],
        [
          77.5936,
          12.9726
        ]
      ],
      "elevation_reference": 920.5,
      "source": "Bhu-Bharti Survey Cadastre",
      "status": "VALID"
    },
    {
      "parcel_id": "BLR-PRC-102",
      "source_parcel_id": "BBMP-SURV-2024-912",
      "country": "India",
      "city": "bengaluru",
      "coordinates": [
        [
          77.5974,
          12.9688
        ],
        [
          77.5996,
          12.9688
        ],
        [
          77.5996,
          12.9708
        ],
        [
          77.5974,
          12.9708
        ]
      ],
      "elevation_reference": 918.2,
      "source": "Bhu-Bharti Survey Cadastre",
      "status": "VALID"
    },
    {
      "parcel_id": "BLR-PRC-103",
      "source_parcel_id": "BBMP-WFD-2024-401",
      "country": "India",
      "city": "bengaluru",
      "coordinates": [
        [
          77.746,
          12.983
        ],
        [
          77.75,
          12.983
        ],
        [
          77.75,
          12.987
        ],
        [
          77.746,
          12.987
        ]
      ],
      "elevation_reference": 865,
      "source": "Bhu-Bharti Survey Cadastre",
      "status": "VALID"
    },
    {
      "parcel_id": "BLR-PRC-104",
      "source_parcel_id": "BBMP-ELC-2024-118",
      "country": "India",
      "city": "bengaluru",
      "coordinates": [
        [
          77.678,
          12.846
        ],
        [
          77.683,
          12.846
        ],
        [
          77.683,
          12.851
        ],
        [
          77.678,
          12.851
        ]
      ],
      "elevation_reference": 890,
      "source": "Bhu-Bharti Survey Cadastre",
      "status": "VALID"
    }
  ],
  "mumbai": [
    {
      "parcel_id": "MUM-PRC-201",
      "source_parcel_id": "MCGM-CAD-4001",
      "country": "India",
      "city": "mumbai",
      "coordinates": [
        [
          72.8285,
          18.9968
        ],
        [
          72.8335,
          18.9968
        ],
        [
          72.8335,
          19.001
        ],
        [
          72.8285,
          19.001
        ]
      ],
      "elevation_reference": 8.5,
      "source": "MCGM Cadastral Sheet — Worli Mill Lands",
      "status": "VALID"
    },
    {
      "parcel_id": "MUM-PRC-202",
      "source_parcel_id": "MMRDA-BKC-G-BLOCK-12",
      "country": "India",
      "city": "mumbai",
      "coordinates": [
        [
          72.861,
          19.0615
        ],
        [
          72.8695,
          19.0615
        ],
        [
          72.8695,
          19.0675
        ],
        [
          72.861,
          19.0675
        ]
      ],
      "elevation_reference": 9,
      "source": "MMRDA Cadastral Survey — BKC G-Block",
      "status": "VALID"
    },
    {
      "parcel_id": "MUM-PRC-203",
      "source_parcel_id": "MCGM-D-WARD-ALTM-88",
      "country": "India",
      "city": "mumbai",
      "coordinates": [
        [
          72.8065,
          18.9635
        ],
        [
          72.8105,
          18.9635
        ],
        [
          72.8105,
          18.9665
        ],
        [
          72.8065,
          18.9665
        ]
      ],
      "elevation_reference": 12,
      "source": "MCGM D-Ward Altamount Cadastral Map",
      "status": "VALID"
    },
    {
      "parcel_id": "MUM-PRC-204",
      "source_parcel_id": "MCGM-A-WARD-NP-104",
      "country": "India",
      "city": "mumbai",
      "coordinates": [
        [
          72.821,
          18.9255
        ],
        [
          72.8255,
          18.9255
        ],
        [
          72.8255,
          18.9305
        ],
        [
          72.821,
          18.9305
        ]
      ],
      "elevation_reference": 4.5,
      "source": "MCGM A-Ward Nariman Point Cadastre",
      "status": "VALID"
    }
  ],
  "netherlands": [
    {
      "parcel_id": "NLD-PRC-301",
      "source_parcel_id": "KAD-RTD-5100",
      "country": "Netherlands",
      "city": "netherlands",
      "coordinates": [
        [
          4.4852,
          51.9022
        ],
        [
          4.4888,
          51.9022
        ],
        [
          4.4888,
          51.9052
        ],
        [
          4.4852,
          51.9052
        ]
      ],
      "elevation_reference": -0.5,
      "source": "Kadaster BRK",
      "status": "VALID"
    },
    {
      "parcel_id": "NLD-PRC-302",
      "source_parcel_id": "KAD-RTD-5102",
      "country": "Netherlands",
      "city": "netherlands",
      "coordinates": [
        [
          4.4815,
          51.9005
        ],
        [
          4.4845,
          51.9005
        ],
        [
          4.4845,
          51.903
        ],
        [
          4.4815,
          51.903
        ]
      ],
      "elevation_reference": -0.2,
      "source": "Kadaster BRK",
      "status": "VALID"
    },
    {
      "parcel_id": "NLD-PRC-303",
      "source_parcel_id": "KAD-RTD-5201",
      "country": "Netherlands",
      "city": "netherlands",
      "coordinates": [
        [
          4.47,
          51.9215
        ],
        [
          4.4745,
          51.9215
        ],
        [
          4.4745,
          51.9245
        ],
        [
          4.47,
          51.9245
        ]
      ],
      "elevation_reference": 0.4,
      "source": "Kadaster BRK",
      "status": "VALID"
    },
    {
      "parcel_id": "NLD-PRC-304",
      "source_parcel_id": "KAD-RTD-5205",
      "country": "Netherlands",
      "city": "netherlands",
      "coordinates": [
        [
          4.484,
          51.9185
        ],
        [
          4.488,
          51.9185
        ],
        [
          4.488,
          51.9215
        ],
        [
          4.484,
          51.9215
        ]
      ],
      "elevation_reference": 0.2,
      "source": "Kadaster BRK",
      "status": "VALID"
    }
  ],
  "singapore": [
    {
      "parcel_id": "SGP-PRC-401",
      "source_parcel_id": "SLA-LOT-TS30-01452X",
      "country": "Singapore",
      "city": "singapore",
      "coordinates": [
        [
          103.852,
          1.2785
        ],
        [
          103.8565,
          1.2785
        ],
        [
          103.8565,
          1.282
        ],
        [
          103.852,
          1.282
        ]
      ],
      "elevation_reference": 3.2,
      "source": "SLA Cadastral Lot — Marina Bay Financial Centre",
      "status": "VALID"
    },
    {
      "parcel_id": "SGP-PRC-402",
      "source_parcel_id": "SLA-LOT-TS23-00981M",
      "country": "Singapore",
      "city": "singapore",
      "coordinates": [
        [
          103.844,
          1.275
        ],
        [
          103.8475,
          1.275
        ],
        [
          103.8475,
          1.2785
        ],
        [
          103.844,
          1.2785
        ]
      ],
      "elevation_reference": 4,
      "source": "SLA Cadastral Lot — Tanjong Pagar / Guoco Tower",
      "status": "VALID"
    },
    {
      "parcel_id": "SGP-PRC-403",
      "source_parcel_id": "SLA-LOT-TS1-00342A",
      "country": "Singapore",
      "city": "singapore",
      "coordinates": [
        [
          103.8495,
          1.2825
        ],
        [
          103.853,
          1.2825
        ],
        [
          103.853,
          1.286
        ],
        [
          103.8495,
          1.286
        ]
      ],
      "elevation_reference": 2.8,
      "source": "SLA Cadastral Lot — Raffles Place Commercial Core",
      "status": "VALID"
    },
    {
      "parcel_id": "SGP-PRC-404",
      "source_parcel_id": "SLA-LOT-TS22-00511P",
      "country": "Singapore",
      "city": "singapore",
      "coordinates": [
        [
          103.8395,
          1.2755
        ],
        [
          103.8435,
          1.2755
        ],
        [
          103.8435,
          1.279
        ],
        [
          103.8395,
          1.279
        ]
      ],
      "elevation_reference": 6,
      "source": "SLA Cadastral Lot — The Pinnacle@Duxton Strata Housing",
      "status": "VALID"
    }
  ]
}''')
