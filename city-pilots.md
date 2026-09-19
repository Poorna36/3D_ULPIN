# City Pilot Strategy

## Goal

Validate the same core engine against multiple urban/cadastral environments.

## 1. Bengaluru — primary engineering pilot

Use for:
- rapid development;
- Indian urban context;
- high-rise/mixed-use examples;
- testing Indian parcel/building workflows.

Potential data sources must be verified before use.

## 2. Mumbai — primary Indian validation

Focus:
- vertical density;
- high-rise buildings;
- complex parcel/building relationships;
- basement/parking scenarios;
- dense urban geometry.

Do not claim Mumbai has a particular ranking/number of high-rises without a dated, defined source.

## 3. Singapore — international benchmark

Focus:
- 3D city mapping;
- strata-like vertical property;
- subterranean/airspace concepts;
- dense urban infrastructure;
- mature 3D geospatial workflows.

## 4. Netherlands — geospatial benchmark

Candidate cities:
- Rotterdam
- Amsterdam
- The Hague
- Utrecht

Prefer a city/zone with a representative mixture of:
- low-rise;
- high-rise;
- mixed-use;
- complex parcel relationships.

Use BAG/BGT/AHN and cadastral data only according to current access/licensing rules.

## Pilot scope

### Hackathon
Target:
- tens to hundreds of buildings for a robust live demo;
- optionally thousands in preprocessed/streamed form.

The exact number is a capacity target, not a promise. It depends on data access, geometry complexity and preprocessing.

### Scale-out
Use:
- tiled processing;
- distributed workers;
- incremental ingestion;
- 3D Tiles;
- spatial indexes.

## Cross-city success criterion

A new city should require:
- a new adapter;
- mapping/configuration;
- validation profile;
- data licence review;

but **not a rewrite of the 3D property engine**.
