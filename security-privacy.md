# Security, Privacy & Legal-Status Rules

## Principles

The system is a spatial infrastructure prototype, not an ownership database by default.

## Personal data

Do not store:
- owner names;
- phone numbers;
- Aadhaar numbers;
- private contact information;

unless explicitly required, lawfully sourced, authorized and protected.

Prefer stable source/property IDs.

## Access control

Implement roles conceptually:
- public viewer;
- analyst;
- administrator;
- data steward.

Sensitive source layers should not automatically be exposed to the public viewer.

## API security

- authentication for protected endpoints;
- authorization by dataset/layer;
- rate limiting;
- request validation;
- audit logs;
- secrets only in environment/secret storage;
- never commit API keys.

## Provenance

Every externally sourced record must be traceable.

## Legal wording

Never say:
- “this person legally owns this volume”;
- “this is a legal title”;
- “this is an official ULPIN”

unless the relevant authority/source establishes it.

Use:
- “source record says…”;
- “derived 3D volume…”;
- “prototype spatial identifier…”
