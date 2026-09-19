# Validation Pipeline

## Principle

A rendered object is not automatically a valid cadastral object.

Every generated property volume passes through validation before it receives `VALID` status.

## Pipeline

```text
RAW INPUT
   |
Schema validation
   |
CRS/unit validation
   |
Geometry repair (only when safe + logged)
   |
3D reconstruction
   |
Vertical extent validation
   |
Parent-child relationship validation
   |
Overlap/intersection tests
   |
Topology checks
   |
Semantic checks
   |
Provenance check
   |
Identifier uniqueness check
   |
VALID / INVALID / REVIEW
```

## Validation classes

### A. Source validation
- required fields;
- source IDs;
- data version;
- CRS;
- units;
- missing geometry.

### B. 2D geometry
- valid polygon;
- no self-intersection;
- expected ring orientation;
- reasonable area;
- no accidental duplicates.

### C. 3D solid
- watertight/closed where a solid is expected;
- non-zero volume;
- no self-intersection;
- valid faces;
- consistent Z range.

### D. Vertical logic
- `z_min < z_max`;
- floors do not unintentionally overlap;
- expected floor ordering;
- reasonable floor thickness;
- basement below reference ground where applicable.

### E. Parcel/building relation
- building footprint relationship to parent parcel;
- candidate property volume relationship to parent building;
- flag boundary crossings for review rather than silently accepting them.

### F. Overlap
Detect:
- duplicate volumes;
- unintended unit overlaps;
- floor overlap;
- infrastructure collision.

Some overlaps can be legitimate (e.g. shared/common spaces). These must be represented semantically, not simply deleted.

### G. Identifier
- deterministic;
- unique within configured namespace;
- stable for identical canonical input;
- versioned when source geometry/semantics materially change.

## Confidence

Use explicit confidence classes:

- `AUTHORITATIVE` — directly supplied by an authorized source.
- `DERIVED_HIGH` — deterministic derivation from authoritative geometry.
- `DERIVED` — computed/estimated from source data.
- `INFERRED` — AI/heuristic inference.
- `SYNTHETIC` — demo/test data.

## Output

Every validation produces a machine-readable report and human-readable summary.
