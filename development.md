# Development Workflow

## Before every change

1. Read `README.md`.
2. Read `ai-rules.md`.
3. Read `solution.md` and any newer solution version.
4. Read relevant architecture documents.
5. Read `progress.md`.
6. Inspect current code and tests.
7. Append an intent entry to `progress.md`.

## During change

- keep changes small;
- preserve source files;
- do not overwrite historical solution/PS documents;
- use migrations for database changes;
- add tests with new functionality;
- retain provenance.

## After change

1. Run formatter/linter if configured.
2. Run unit tests.
3. Run relevant integration tests.
4. Run geometry validation fixtures.
5. Record results in `progress.md`.
6. Record errors and fixes.
7. Record remaining risks.

## Git

Use commits that describe one logical change.

Recommended prefixes:
- `feat:`
- `fix:`
- `test:`
- `docs:`
- `refactor:`
- `data:`
- `chore:`

Never use git history as a substitute for `progress.md`.
