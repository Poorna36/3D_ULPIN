# Testing Strategy

## Unit tests

Test:
- coordinate conversion;
- Z-range calculations;
- extrusion;
- floor subdivision;
- identifier determinism;
- canonicalization;
- schema validation.

## Geometry tests

Fixtures must include:
- valid building;
- self-intersecting polygon;
- zero-area polygon;
- invalid solid;
- overlapping units;
- touching-but-valid units;
- basement;
- elevated volume;
- parcel/building boundary crossing.

## Integration tests

Test:
- adapter -> canonical model;
- canonical model -> PostGIS;
- PostGIS -> API;
- API -> Cesium;
- validation -> identifier.

## Cross-city contract tests

Every adapter must satisfy the same canonical schema.

A city adapter that requires core-engine modifications should fail architecture review.

## Regression tests

Every bug that reaches `progress.md` should, where practical, become a regression test.

## Performance tests

Measure:
- ingestion throughput;
- validation throughput;
- database query latency;
- tile generation;
- browser FPS/scene load;
- memory consumption.

Record hardware and dataset size for meaningful comparisons.
