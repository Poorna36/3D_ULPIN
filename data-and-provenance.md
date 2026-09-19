# Data Sources, Provenance & Licensing

## Rule

Never assume that because a dataset is viewable online it is freely redistributable.

For every external dataset record:
- provider;
- dataset name;
- official URL;
- licence;
- access method;
- attribution requirement;
- API/download limits;
- date accessed;
- version/date;
- permitted use;
- whether local caching/redistribution is allowed.

## India research baseline

The project has discussed these Indian initiatives as relevant context:

- ULPIN / Bhu-Aadhaar
- Digital India Land Records Modernization Programme (DILRMP)
- NAKSHA
- Bharat Land Stack / Land Stack direction

These are **context and integration targets**, not automatically available project datasets.

Current claims about their status, coverage or APIs must be verified against official DoLR/government sources before submission.

## Netherlands research baseline

Potential sources to investigate:
- BAG — buildings/addresses
- BGT — large-scale topography
- AHN — national elevation/LiDAR
- Dutch Cadastre/Kadaster cadastral services
- Dutch 3D city/CityGML/CityJSON-related resources

Do not assume ownership records are open merely because building geometry is open.

## Singapore research baseline

Investigate:
- Singapore Land Authority (SLA)
- national 3D mapping resources
- cadastral/strata/subterranean/airspace concepts
- relevant open geospatial services

## City data adapter contract

Every adapter must output the same canonical fields:

```text
source_country
source_city
source_dataset
source_object_id
geometry_2d
geometry_3d
crs
z_reference
vertical_accuracy
horizontal_accuracy
source_version
provenance
confidence
```

## Synthetic fallback

If an authoritative dataset is inaccessible:
- create clearly labelled synthetic fixtures;
- preserve the real-world schema shape;
- do not fabricate real ownership;
- document the substitution in `progress.md`.
