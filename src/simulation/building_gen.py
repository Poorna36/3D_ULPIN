"""
Parametric 3D Building & Cadastral World Generator
Generates watertight 3D property volumes for all 10 canonical classes:
S, B, L, U, C, P, A, T, E, I.
Conforms to docs/features.md § 3.5, docs/data.md, and docs/implementation_plan.md Phase 3.
"""
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional, Tuple
import numpy as np
import trimesh


@dataclass
class GeneratedVolume:
    cls: str
    label: str
    mesh: trimesh.Trimesh
    z_min: float
    z_max: float
    volume: float
    parent_label: Optional[str] = None
    data_provenance: str = "SYNTHETIC"


@dataclass
class BuildingStructure:
    name: str
    zone: str
    ground_elevation: float
    height: float
    floor_count: int
    volumes: List[GeneratedVolume] = field(default_factory=list)

    @property
    def total_volume(self) -> float:
        return sum(v.volume for v in self.volumes)

    def get_by_class(self, cls: str) -> List[GeneratedVolume]:
        return [v for v in self.volumes if v.cls == cls]


class BuildingGenerator:
    """
    Parametric 3D generator for building envelopes, floors, units,
    common areas, underground infrastructure, and elevated corridors.
    """

    def __init__(self, ground_elevation: float = 0.0):
        self.ground_elevation = ground_elevation

    def create_box_volume(
        self,
        cls: str,
        label: str,
        extents: Tuple[float, float, float],
        center: Tuple[float, float, float],
        parent_label: Optional[str] = None
    ) -> GeneratedVolume:
        """Helper creating a watertight rectangular cuboid volume."""
        mesh = trimesh.creation.box(extents=extents)
        mesh.apply_translation(center)
        z_min = float(center[2] - extents[2] / 2.0)
        z_max = float(center[2] + extents[2] / 2.0)
        vol = abs(float(mesh.volume))

        return GeneratedVolume(
            cls=cls,
            label=label,
            mesh=mesh,
            z_min=round(z_min, 3),
            z_max=round(z_max, 3),
            volume=round(vol, 3),
            parent_label=parent_label,
            data_provenance="SYNTHETIC"
        )

    def generate(
        self,
        name: str = "Synthetic Tower",
        zone: str = "MZ-1",
        width_m: float = 24.0,
        depth_m: float = 20.0,
        floor_count: int = 10,
        floor_height_m: float = 3.2,
        units_per_floor: int = 4,
        basement_count: int = 2,
        has_metro_tunnel: bool = True,
        has_elevated_metro: bool = False
    ) -> BuildingStructure:
        """
        Generates complete 3D structure exercising all 10 property classes:
        S, B, L, U, C, P, A, T, E, I.
        """
        volumes: List[GeneratedVolume] = []
        g_elev = self.ground_elevation
        tower_height = floor_count * floor_height_m
        bld_center_z = g_elev + (tower_height / 2.0)

        # ----------------------------------------------------------------------
        # 1. Class S: Surface Parcel Column (Prism encompassing parcel bounds)
        # ----------------------------------------------------------------------
        parcel_w = width_m + 16.0  # Setback buffer
        parcel_d = depth_m + 16.0
        parcel_h = tower_height + 80.0  # From -40m underground to +40m above roof
        parcel_z = g_elev + (tower_height / 2.0)
        vol_s = self.create_box_volume(
            cls="S",
            label=f"{name}_Parcel_Column",
            extents=(parcel_w, parcel_d, parcel_h),
            center=(0.0, 0.0, parcel_z)
        )
        volumes.append(vol_s)

        # ----------------------------------------------------------------------
        # 2. Class B: Building Envelope Solid
        # ----------------------------------------------------------------------
        vol_b = self.create_box_volume(
            cls="B",
            label=f"{name}_Envelope",
            extents=(width_m, depth_m, tower_height),
            center=(0.0, 0.0, bld_center_z),
            parent_label=vol_s.label
        )
        volumes.append(vol_b)

        # ----------------------------------------------------------------------
        # 3. Class L, U, C: Levels, Units, and Commons
        # ----------------------------------------------------------------------
        corridor_w = 2.4  # Central hallway width

        for fl in range(floor_count):
            fl_z_center = g_elev + (fl * floor_height_m) + (floor_height_m / 2.0)
            level_label = f"{name}_Level_{fl:02d}"

            # Class L: Level Slab Band
            vol_l = self.create_box_volume(
                cls="L",
                label=level_label,
                extents=(width_m, depth_m, floor_height_m),
                center=(0.0, 0.0, fl_z_center),
                parent_label=vol_b.label
            )
            volumes.append(vol_l)

            # Class C: Central Common Corridor & Core
            vol_c = self.create_box_volume(
                cls="C",
                label=f"{level_label}_CommonCorridor",
                extents=(corridor_w, depth_m, floor_height_m),
                center=(0.0, 0.0, fl_z_center),
                parent_label=level_label
            )
            volumes.append(vol_c)

            # Class U: Private Apartment / Commercial Units
            # Subdivided into wings on either side of central corridor
            wing_w = (width_m - corridor_w) / 2.0
            unit_d = depth_m / max(1, (units_per_floor // 2))

            for wing_idx, x_sign in enumerate([-1, 1]):
                wing_center_x = x_sign * (corridor_w / 2.0 + wing_w / 2.0)
                units_in_wing = units_per_floor // 2

                for u_idx in range(units_in_wing):
                    u_center_y = - (depth_m / 2.0) + (u_idx * unit_d) + (unit_d / 2.0)
                    u_label = f"{level_label}_Unit_{wing_idx * units_in_wing + u_idx + 1:02d}"

                    vol_u = self.create_box_volume(
                        cls="U",
                        label=u_label,
                        extents=(wing_w, unit_d, floor_height_m),
                        center=(wing_center_x, u_center_y, fl_z_center),
                        parent_label=level_label
                    )
                    volumes.append(vol_u)

        # ----------------------------------------------------------------------
        # 4. Class T & P: Subterranean Basements & Parking Bays
        # ----------------------------------------------------------------------
        basement_h = 3.5
        for b_idx in range(1, basement_count + 1):
            b_center_z = g_elev - ((b_idx - 0.5) * basement_h)
            b_label = f"{name}_Basement_B{b_idx}"

            # Class T: Subterranean lot volume
            vol_t = self.create_box_volume(
                cls="T",
                label=b_label,
                extents=(width_m + 4.0, depth_m + 4.0, basement_h),
                center=(0.0, 0.0, b_center_z),
                parent_label=vol_s.label
            )
            volumes.append(vol_t)

            # Class P: Parking Grid Slots inside Basement
            parking_w = 2.8
            parking_d = 5.2
            for p_slot in range(4):
                p_center_x = -6.0 + (p_slot * 3.5)
                vol_p = self.create_box_volume(
                    cls="P",
                    label=f"{b_label}_Parking_Slot_{p_slot + 1:02d}",
                    extents=(parking_w, parking_d, basement_h * 0.8),
                    center=(p_center_x, 0.0, b_center_z),
                    parent_label=b_label
                )
                volumes.append(vol_p)

        # ----------------------------------------------------------------------
        # 5. Class A: Airspace Lot (Air-right volume above roof)
        # ----------------------------------------------------------------------
        air_height = 25.0
        air_center_z = g_elev + tower_height + (air_height / 2.0)
        vol_a = self.create_box_volume(
            cls="A",
            label=f"{name}_Airspace_Lot",
            extents=(width_m, depth_m, air_height),
            center=(0.0, 0.0, air_center_z),
            parent_label=vol_s.label
        )
        volumes.append(vol_a)

        # ----------------------------------------------------------------------
        # 6. Class T: Deep Underground Metro Tunnel (if applicable)
        # ----------------------------------------------------------------------
        if has_metro_tunnel:
            tunnel_diameter = 6.0
            tunnel_depth = g_elev - (basement_count * basement_h) - 12.0
            vol_tunnel = self.create_box_volume(
                cls="T",
                label=f"{name}_Metro_Tunnel_Alignment",
                extents=(parcel_w + 30.0, tunnel_diameter, tunnel_diameter),
                center=(0.0, depth_m / 2.0 + 4.0, tunnel_depth),
                parent_label=vol_s.label
            )
            volumes.append(vol_tunnel)

        # ----------------------------------------------------------------------
        # 7. Class E: Elevated Metro Corridor / Viaduct (if applicable)
        # ----------------------------------------------------------------------
        if has_elevated_metro:
            viaduct_w = 8.0
            viaduct_h = 3.0
            viaduct_elev = g_elev + 14.0  # Elevated above street level
            vol_e = self.create_box_volume(
                cls="E",
                label=f"{name}_Elevated_Metro_Viaduct",
                extents=(parcel_w + 30.0, viaduct_w, viaduct_h),
                center=(0.0, - (depth_m / 2.0 + 8.0), viaduct_elev),
                parent_label=vol_s.label
            )
            volumes.append(vol_e)

        # ----------------------------------------------------------------------
        # 8. Class I: Utility Corridor (Subsurface water / power corridor)
        # ----------------------------------------------------------------------
        util_depth = g_elev - 2.5
        vol_i = self.create_box_volume(
            cls="I",
            label=f"{name}_Subsurface_Utility_Corridor",
            extents=(parcel_w, 2.0, 1.8),
            center=(0.0, - (depth_m / 2.0 + 2.0), util_depth),
            parent_label=vol_s.label
        )
        volumes.append(vol_i)

        return BuildingStructure(
            name=name,
            zone=zone,
            ground_elevation=g_elev,
            height=tower_height,
            floor_count=floor_count,
            volumes=volumes
        )


def generate_mz1_hero_tower() -> BuildingStructure:
    """
    Mumbai Worli MZ-1 Hero Tower:
    20-storey tower, 4 units/floor, 2 basements, Aqua Line underground tunnel.
    """
    generator = BuildingGenerator(ground_elevation=8.5)
    return generator.generate(
        name="MZ1_Worli_Hero_Tower",
        zone="MZ-1",
        width_m=28.0,
        depth_m=24.0,
        floor_count=20,
        floor_height_m=3.4,
        units_per_floor=4,
        basement_count=2,
        has_metro_tunnel=True,
        has_elevated_metro=False
    )


def generate_bz1_hero_tower() -> BuildingStructure:
    """
    Bengaluru MG Road BZ-1 Hero Tower:
    15-storey tower, 3 units/floor, 1 basement, Namma Metro elevated viaduct.
    """
    generator = BuildingGenerator(ground_elevation=920.5)
    return generator.generate(
        name="BZ1_MGRoad_Hero_Tower",
        zone="BZ-1",
        width_m=26.0,
        depth_m=22.0,
        floor_count=15,
        floor_height_m=3.3,
        units_per_floor=4,
        basement_count=1,
        has_metro_tunnel=False,
        has_elevated_metro=True
    )
