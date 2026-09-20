"""
Ingest Phase 0 assets into the provenance ledger in registry.db.
Conforms to docs/implementation_plan.md Phase 1.8.
"""
import os
import json
from backend.ingestion.provenance import ProvenanceRecord, LedgerStore
from backend.ingestion.gis_reader import GISReader


def ingest_phase0_assets(db_path: str = "registry.db", index_path: str = "data/PROVENANCE_INDEX.json"):
    ledger = LedgerStore(db_path)
    reader = GISReader(ledger=ledger)

    if not os.path.exists(index_path):
        raise FileNotFoundError(f"Provenance index not found: {index_path}")

    with open(index_path, "r", encoding="utf-8") as f:
        entries = json.load(f)

    print(f"Ingesting {len(entries)} assets from {index_path} into {db_path}...")

    ingested = 0
    for item in entries:
        file_path = item["file_path"]
        source_id = item["source_id"]
        data_provenance = item["data_provenance"]
        license_type = item.get("license", "UNKNOWN")
        notes = item.get("notes", "")

        if not os.path.exists(file_path):
            print(f"Warning: File {file_path} not found on disk, skipping read but logging provenance record.")
            record = ProvenanceRecord(
                source_id=source_id,
                file_path=os.path.abspath(file_path),
                data_provenance=data_provenance,
                crs=item.get("crs", "EPSG:4326"),
                datum=item.get("datum", "WGS84"),
                resolution_m=item.get("resolution_m"),
                accuracy_sigma_m=item.get("accuracy_sigma_m"),
                license=license_type,
                download_ts="2026-09-20T10:00:00Z",
                notes=notes,
            )
            ledger.log(record)
            ingested += 1
            continue

        ext = os.path.splitext(file_path)[1].lower()
        if ext in [".geojson", ".shp", ".gpkg"]:
            _, prov = reader.read_vector(
                path=file_path,
                source_id=source_id,
                data_provenance=data_provenance,
                license=license_type,
                notes=notes,
            )
            ingested += 1
        else:
            record = ProvenanceRecord(
                source_id=source_id,
                file_path=os.path.abspath(file_path),
                data_provenance=data_provenance,
                crs=item.get("crs", "EPSG:4326"),
                datum=item.get("datum", "WGS84"),
                resolution_m=item.get("resolution_m"),
                accuracy_sigma_m=item.get("accuracy_sigma_m"),
                license=license_type,
                download_ts="2026-09-20T10:00:00Z",
                notes=notes,
            )
            ledger.log(record)
            ingested += 1

    ledger.assert_no_conflation()
    counts = ledger.all_tagged()
    print(f"Successfully populated provenance_ledger in {db_path} with {ingested} entries.")
    print(f"Ledger distribution: {counts}")
    return counts


if __name__ == "__main__":
    ingest_phase0_assets()
