# Prototype 3D Identifier Specification

## Important legal/status disclaimer

This is a **prototype identifier design** for the hackathon.

It is NOT the official Indian ULPIN specification and must not be represented as such.

## Design goals

The prototype identifier should be:
- deterministic;
- unique within its namespace;
- stable for unchanged canonical inputs;
- opaque enough to avoid exposing personal information;
- versionable;
- independent of display order.

## Recommended approach

Use a namespace + canonical object UUID or cryptographic digest.

Example concept:

```text
3D-IN-BLR-<canonical-object-hash>
```

This is only a prototype example.

Do NOT claim that this is an official ULPIN format.

## Inputs to canonicalization

Potential fields:
- country/city namespace;
- source parcel reference;
- source building reference;
- vertical object type;
- unit/property reference when authoritative;
- normalized geometry hash;
- schema/version.

## Versioning

A material geometry or semantic change must produce a new version/reference according to project rules.

Never silently reuse an identifier for materially different geometry.
