# Recommended Source Tree

```text
3d-ulpin/
├── docs/
│   ├── README.md
│   ├── ps.md
│   ├── ps-2.md                    # only when a fuller source is supplied
│   ├── solution.md
│   ├── solution-2.md               # future revisions
│   ├── ai-rules.md
│   ├── architecture.md
│   ├── validation-pipeline.md
│   ├── data-and-provenance.md
│   ├── city-pilots.md
│   ├── cesium.md
│   ├── data-model.md
│   ├── identifier-spec.md
│   ├── security-privacy.md
│   ├── demo-plan.md
│   ├── testing.md
│   ├── development.md
│   └── requirements-traceability.md
├── progress.md
├── apps/
│   └── web/
├── services/
│   ├── api/
│   ├── ingestion/
│   ├── geometry/
│   ├── validation/
│   └── identifiers/
├── adapters/
│   ├── india/
│   ├── singapore/
│   └── netherlands/
├── db/
│   ├── migrations/
│   └── seeds/
├── pipelines/
├── tests/
│   ├── unit/
│   ├── geometry/
│   ├── integration/
│   └── fixtures/
└── data/
    ├── raw/        # gitignored
    ├── processed/  # gitignored
    └── manifests/
```

Never commit restricted/private datasets or secrets.
