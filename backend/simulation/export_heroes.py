"""
Export Hero Towers for MZ-1 (Mumbai) and BZ-1 (Bengaluru)
Conforms to Phase 3.11 and 3.12.
"""
import os
import json
from backend.simulation.building_gen import generate_mz1_hero_tower, generate_bz1_hero_tower


def export_hero_towers(base_dir: str = "data/synthetic"):
    for name, gen_fn in [("mz1_hero", generate_mz1_hero_tower), ("bz1_hero", generate_bz1_hero_tower)]:
        target_dir = os.path.join(base_dir, name)
        os.makedirs(target_dir, exist_ok=True)
        structure = gen_fn()

        manifest = {
            "name": structure.name,
            "zone": structure.zone,
            "ground_elevation": structure.ground_elevation,
            "height": structure.height,
            "floor_count": structure.floor_count,
            "typology": structure.typology,
            "jurisdiction": structure.jurisdiction,
            "total_volume": structure.total_volume,
            "volume_count": len(structure.volumes),
            "classes_exercised": sorted(list({v.cls for v in structure.volumes})),
            "volumes": [
                {
                    "label": v.label,
                    "cls": v.cls,
                    "z_min": v.z_min,
                    "z_max": v.z_max,
                    "volume": v.volume,
                    "parent_label": v.parent_label,
                    "data_provenance": v.data_provenance,
                    "description": v.description
                }
                for v in structure.volumes
            ]
        }

        with open(os.path.join(target_dir, "manifest.json"), "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=2)

    print("Hero towers successfully exported to data/synthetic/")


if __name__ == "__main__":
    export_hero_towers()
