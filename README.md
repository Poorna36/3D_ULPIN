# 3D ULPIN Generation & Vertical Property Mapping System

## Project purpose

This repository is a hackathon-grade blueprint and implementation contract for SIH26011:
**3D ULPIN Generation and Vertical Property Mapping System**.

The goal is to build a **city-agnostic 3D cadastral/vertical-property engine** that can ingest heterogeneous geospatial inputs, construct validated 3D property volumes, associate them with parent parcels/buildings, and generate a proposed 3D spatial identifier layer.

### Initial pilot cities

- Bengaluru, India — primary development pilot
- Mumbai, India — primary Indian validation pilot
- Singapore — international 3D-cadastre benchmark
- Rotterdam/Amsterdam, Netherlands — international geospatial/LiDAR benchmark

The four-city design is intentional: the core engine must not be hard-coded to one city's data model.

## Critical scope distinction

This project is a **technical prototype and spatial identity layer**. It must never claim that a generated identifier is an official government ULPIN, title, ownership certificate, or legal property right unless an authorized authority explicitly confirms that status.

Likewise, geometry derived from imagery/LiDAR must not be presented as proof of legal unit boundaries unless authoritative cadastral/building-plan data establishes those boundaries.

## Core pipeline

Data adapters -> normalization/CRS -> building/parcel ingestion -> 3D reconstruction -> vertical segmentation -> volumetric parcel generation -> topology validation -> identifier generation -> PostGIS/3D Tiles -> CesiumJS visualization -> audit trail.

## Non-negotiable engineering principles

1. Preserve source data and provenance.
2. Never silently alter authoritative input.
3. Never silently overwrite the PS or approved solution.
4. Every material project change must be appended to `progress.md`.
5. Errors and their fixes must be logged concisely.
6. Prefer deterministic geometry and identifiers.
7. Separate inferred geometry from authoritative geometry.
8. Treat city-specific ingestion as an adapter, not a rewrite of the core engine.
9. Validate before publishing a 3D property volume.
10. Build for scale, but demonstrate a controlled pilot first.

## Repository map

- `ps.md` — locked source problem statement transcription available from the supplied image(s)
- `solution.md` — locked baseline proposed solution
- `ai-rules.md` — rules every AI/developer agent must follow
- `architecture.md` — system architecture
- `validation-pipeline.md` — geometry/data validation contract
- `data-and-provenance.md` — source-data policy and provenance model
- `city-pilots.md` — Bengaluru/Mumbai/Singapore/Netherlands pilot strategy
- `cesium.md` — Cesium visualization and 3D Tiles design
- `data-model.md` — canonical 3D property data model
- `identifier-spec.md` — prototype identifier rules; explicitly NOT an official ULPIN specification
- `security-privacy.md` — security, privacy and legal-status safeguards
- `demo-plan.md` — SIH demonstration flow
- `testing.md` — test strategy
- `development.md` — development workflow
- `progress.md` — append-only engineering log
- `ps-source-status.md` — source completeness/verification notes

## Build philosophy

The hackathon implementation should prove the hardest part:

> authoritative/traceable geospatial inputs can be transformed into valid, queryable 3D property volumes and inspected from Earth level down to an individual vertical unit.

The 3D globe is the interface. PostGIS is the spatial database. The 3D ULPIN engine is the domain logic.
