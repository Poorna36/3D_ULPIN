# SOLUTION — Baseline Proposed Solution

> **LOCKED BASELINE SOLUTION**
>
> This document is immutable. Do not edit it after creation.
> If the solution changes, create `solution-2.md`, `solution-3.md`, or `solution-updated-YYYY-MM-DD.md`.
> Never rewrite history by editing this file.

## Proposed solution

Build a **city-agnostic 3D cadastral and vertical-property engine** that sits between authoritative/traceable geospatial sources and a Cesium-based 3D interface.

The system will:

1. Ingest parcel, building, elevation, imagery, BIM/floor-plan and positioning data through source-specific adapters.
2. Normalize coordinates, units, metadata and provenance into a canonical spatial model.
3. Build or ingest 3D building geometry.
4. Determine/ingest vertical levels and create candidate floor/unit volumes.
5. Construct 3D parcel/property volumes with explicit minimum/maximum elevation.
6. Link every volume to parent parcel/building records.
7. Run topology and consistency validation.
8. Assign a deterministic **prototype 3D spatial identifier**.
9. Store searchable geometry and metadata in PostGIS.
10. Stream large 3D content to Cesium using 3D Tiles/glTF-compatible representations.
11. Expose an audit trail showing the source and confidence of every derived property.
12. Support city-specific adapters without changing the core 3D property engine.

## Four-city strategy

### Bengaluru
Primary development and Indian proof-of-concept environment.

### Mumbai
Second Indian validation environment emphasizing vertical density and complex urban property.

### Singapore
International benchmark for mature 3D mapping, strata/subterranean/airspace concepts and dense urban conditions.

### Netherlands
Use Rotterdam/Amsterdam as a geospatial/LiDAR benchmark, subject to current dataset licences and access terms.

## Key innovation

The project does **not** claim to invent ULPIN itself. India already has ULPIN/Bhu-Aadhaar initiatives. The proposed innovation is the **vertical/3D spatial layer** that can represent property volumes and their relationships to surface parcels, buildings, floors, underground spaces and other volumetric objects.

## Prototype identity

The identifier produced by this prototype must be clearly labelled as a **3D ULPIN prototype/spatial identifier** unless an official authority supplies the exact production ULPIN extension standard.

Do not invent a format and present it as an official Indian ULPIN format.

## Architecture

Data adapters -> canonical model -> 3D engine -> validation -> identifier -> PostGIS -> API -> Cesium.

## What the SIH demo must prove

A judge should be able to:

- select a city;
- select a building;
- inspect the building in 3D;
- explode/inspect floors or vertical units;
- inspect the parent parcel;
- inspect vertical bounds;
- run topology validation;
- view provenance;
- view the generated prototype identifier;
- switch to another city without changing the core engine.

## Scaling strategy

The hackathon should demonstrate a controlled pilot (for example, hundreds of buildings) while keeping the architecture capable of batch processing thousands/millions of records through tiling, asynchronous jobs, PostGIS spatial indexing, simplified 3D representations and 3D Tiles streaming.

## Explicit non-goals

- Do not claim legal ownership from inferred geometry.
- Do not expose personal ownership information without lawful/authorized data.
- Do not replace official cadastral registration.
- Do not claim that Cesium itself performs cadastral validation.
- Do not hard-code one city's coordinate system or schema into the core engine.
