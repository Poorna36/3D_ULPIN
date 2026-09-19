# Canonical 3D Property Data Model

## Parcel

```text
parcel_id
source_parcel_id
country
city
geometry_2d
elevation_reference
source
provenance
```

## Building

```text
building_id
source_building_id
parcel_id[]
footprint
geometry_3d
ground_elevation
roof_elevation
height
source
confidence
```

## Floor

```text
floor_id
building_id
level_index
z_min
z_max
geometry_3d
source
confidence
```

## PropertyVolume

```text
property_volume_id
building_id
parent_parcel_id
floor_id
unit_id
geometry_3d
z_min
z_max
volume
confidence
status
prototype_3d_identifier
source_property_record_ref   # OPTIONAL — populate only when an authorized source
                             # explicitly supplies a property/ownership record reference.
                             # Never infer or fabricate from geometry alone.
```

## InfrastructureVolume

```text
infrastructure_id
type
geometry_3d
z_min
z_max
source
confidence
```

## Provenance

```text
source_dataset
source_object_id
source_version
acquired_at
processing_version
transformations[]
operator/agent
```

## ValidationReport

```text
validation_id
object_id
run_at
engine_version
checks[]
overall_status
warnings[]
errors[]
```

## Status values

- `DRAFT`
- `REVIEW`
- `VALID`
- `INVALID`
- `SUPERSEDED`

Never delete historical validation results merely because a newer run exists.
