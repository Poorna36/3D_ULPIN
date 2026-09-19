# System Architecture

## High-level architecture

```text
                 DATA SOURCES
                     |
      +--------------+----------------+
      |              |                |
   Parcels        Buildings       Elevation
      |              |             / LiDAR
      |              |                |
   Imagery       BIM/Floor plans   GNSS/CORS
      |              |                |
      +--------------+----------------+
                     |
              DATA ADAPTER LAYER
                     |
              CANONICAL DATA MODEL
                     |
          +----------+-----------+
          |                      |
    2D/3D geometry          Metadata/provenance
          |                      |
          +----------+-----------+
                     |
             3D PROPERTY ENGINE
                     |
       +-------------+-------------+
       |             |             |
  Reconstruction  Segmentation  Volume model
       |             |             |
       +-------------+-------------+
                     |
              VALIDATION ENGINE
                     |
              3D IDENTIFIER ENGINE
                     |
            +--------+--------+
            |                 |
         PostGIS          Object storage
            |                 |
            +--------+--------+
                     |
                   API
                     |
               CesiumJS client
                     |
                 3D Tiles
```

## Components

### 1. Data adapters

One adapter per source/city ecosystem.

Examples:
- India adapter
- Singapore adapter
- Netherlands adapter

### 2. Canonical model

All source-specific schemas map into common objects:
- Parcel
- Building
- Floor
- Unit/PropertyVolume
- UndergroundVolume
- AirspaceVolume
- InfrastructureVolume
- SourceRecord
- ValidationReport

### 3. 3D engine

Responsible for:
- extrusion;
- surface reconstruction;
- vertical subdivision;
- volume generation;
- geometry conversion.

### 4. Validation engine

Responsible for:
- geometry validity;
- topology;
- containment;
- overlaps;
- elevation consistency;
- provenance completeness.

### 5. Identifier engine

Creates deterministic prototype IDs from canonical spatial/property references.

### 6. PostGIS

Stores:
- 2D/3D geometry;
- spatial indexes;
- relationships;
- validation state;
- provenance.

### 7. CesiumJS

Provides:
- globe;
- terrain;
- camera;
- building visualization;
- 3D Tiles;
- selection;
- inspection;
- layer controls.

## Scaling architecture

> **Hackathon demo scope:** The demo uses a **single-process pipeline** with
> precomputed 3D Tiles loaded from local disk. No queue/worker infrastructure
> is required to demo ~100–500 buildings.
>
> The items below describe the **target production architecture** for post-hackathon
> scale-out. They are the design goal, not a demo prerequisite.

Use:
- spatial tiling;
- asynchronous processing jobs;
- queue/workers;
- PostGIS GiST/SP-GiST indexes where appropriate;
- level-of-detail geometry;
- 3D Tiles;
- caching;
- incremental updates.

Never load an entire national 3D city model into one browser scene.
