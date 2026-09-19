# AI / AGENT RULES — Mandatory

## 1. Immutable files

The following files are immutable:

- `ps.md`
- `solution.md`
- every historical `solution-*.md`
- every historical `ps-*.md`

### Meaning of “cannot change”

“Change” means **edit, rewrite, replace, overwrite, truncate, or silently correct existing content**.

If a PS interpretation changes:
- create `ps-2.md` / `ps-updated-YYYY-MM-DD.md`.

If the solution changes:
- create `solution-2.md` / `solution-3.md` / `solution-updated-YYYY-MM-DD.md`.

Historical files are never rewritten.

## 2. Progress log is append-only

Before making any project change:

1. Read `progress.md`.
2. Determine the next log entry number.
3. Append a new entry with the current date/time.
4. State what is about to change and why.
5. Make the change.
6. Append the result, tests and any error/fix.

Never edit an old progress entry.

If an earlier entry is wrong, append a correction entry. Do not rewrite history.

## 3. Errors are institutional memory

Every material error must record:

- error/problem;
- affected component;
- root cause if known;
- fix/workaround;
- prevention rule/test.

Never repeatedly rediscover the same failure without checking `progress.md` first.

## 4. No invented external facts

When information concerns a government dataset, API, licence, current programme, legal status, current statistic, or official standard:
- verify it from an authoritative source when web access is available;
- record the source and access date;
- if verification is unavailable, label it `UNVERIFIED`;
- never fabricate an API, dataset, licence or official standard.

## 5. No invented ULPIN standard

The team may create a prototype identifier, but it must never be called the official Indian ULPIN format unless an authoritative specification confirms it.

## 6. Data provenance

Every derived geometry must retain:
- source dataset;
- source object ID;
- acquisition/version date when available;
- transformation;
- CRS;
- confidence/quality;
- processing version.

## 7. Geometry safety

Never publish a volume as “valid” merely because it renders.

Rendering success != geometric validity.

At minimum check:
- valid solids;
- no self-intersection;
- expected orientation;
- non-zero volume;
- valid vertical extent;
- parent containment/relationship;
- unintended overlap;
- duplicate IDs;
- CRS consistency.

## 8. Legal/ownership safety

Never infer or expose a person's ownership from geometry alone.

Use terms such as:
- `source property record`;
- `candidate unit`;
- `derived geometry`;
- `prototype spatial identifier`.

Only use `owner` where an authorized source explicitly supplies that attribute.

## 9. Architecture discipline

City-specific code belongs in adapters/configuration.

Core engine code must not contain Mumbai/Singapore/Netherlands-specific assumptions.

## 10. Reproducibility

Every processing job should have:
- input manifest;
- processing version;
- configuration;
- timestamp;
- output manifest;
- validation report.

## 11. AI coding workflow

Before coding:
- read README;
- read current solution;
- read relevant architecture/design documents;
- read `progress.md`;
- inspect existing code;
- identify constraints.

After coding:
- run relevant tests;
- run validation;
- update `progress.md`;
- document errors and fixes.

## 12. Never hide uncertainty

If a boundary is estimated from LiDAR/image data, label it as estimated.

If a floor boundary comes from a floor plan, cite that source.

If a unit boundary is unavailable, do not manufacture one merely to make the demo look complete.

## 13. Demo integrity

Demo data may be synthetic, but it must be labelled synthetic.

Real datasets must remain traceable.

Never present synthetic ownership/property records as real people or real legal records.
