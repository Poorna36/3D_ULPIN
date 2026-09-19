# Cesium / 3D Earth Visualization

## Role

CesiumJS is the **visualization and spatial interaction layer**, not the legal cadastral authority and not the core validation engine.

## User journey

```text
Earth
  -> Country
  -> City
  -> District
  -> Building
  -> Floor
  -> Unit / Volume
```

## Required UI features

- city selector;
- layer selector;
- parcel layer;
- building layer;
- 3D property volume layer;
- underground toggle;
- floor explode/stack view;
- object selection;
- property/geometry information panel;
- validation status;
- provenance panel;
- prototype identifier display.

## 3D Tiles

Use 3D Tiles for large datasets.

Recommended approach:
- low LOD at city scale;
- higher LOD when zoomed;
- separate semantic layers;
- avoid sending unnecessary geometry to the browser.

**Demo / local development:** 3D Tiles can be served from a local static file server
(e.g. `python -m http.server 8080` or Nginx). No cloud hosting is required for the
hackathon demo. Enable CORS headers if CesiumJS and the tile server run on different ports.

## Interaction example

Click a building:

```text
Building ID
Parent parcel
Height
Number of candidate floors
Validation state
Source
```

Click a floor/unit:

```text
Prototype 3D identifier
Z min / Z max
Parent building
Parent parcel
Confidence
Validation report
Provenance
```

## Visual integrity

Never use colour alone to communicate legal validity.

Provide text/icons/status values.

Synthetic/demo objects must be visibly marked as synthetic.
