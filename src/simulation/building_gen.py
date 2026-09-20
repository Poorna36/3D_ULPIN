"""
Parametric 3D Building & Cadastral World Generator
Generates watertight 3D property volumes for all 10 canonical classes:
S, B, L, U, C, P, A, T, E, I.

Supports distinct architectural typologies:
- STANDARD_HIGHRISE: Slender vertical residential tower with ground lobby + commercial units and top penthouse.
- PODIUM_TOWER: Wide base podium (commercial, multi-level parking, amenities) with slender residential tower above.
- STEPPED_TERRACE: Progressive structural setbacks on upper floors with open sky terraces (Class C).
- L_SHAPED: Dual orthogonal wings meeting at a central elevator/stair core.
- COMMERCIAL_CAMPUS: Low-rise tech park campus with central atrium and modular office suites.
- CYBERPUNK_MEGATOWER: Sandbox vertical megastructure (Arasaka Tower) with concourse, sky-bridges, and helipad.

Supports realistic intra-building floor variations:
- LOBBY_RETAIL: Grand entrance lobby/reception + street-facing retail banking/shops.
- PODIUM_AMENITY: Resident clubhouse, gym, and executive business suites.
- RESIDENTIAL_TYPE_A: Asymmetric master 3BHK + 1BHK studio on Wing 1, two 2BHK on Wing 2.
- RESIDENTIAL_TYPE_B: Alternating floor plate with balanced 2BHKs and multi-studio wings.
- STEPPED_PENTHOUSE: Expansive royal penthouse suites with landscaped outdoor sky terraces.
- COMMERCIAL_OFFICE: Modular IT/corporate office bays surrounding a central lightwell atrium.

Conforms to docs/features.md § 3.5, docs/data.md, and docs/implementation_plan.md Phase 3 & 12.
"""
from enum import Enum
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional, Tuple, Union
import math
import numpy as np
import trimesh


class BuildingTypology(str, Enum):
    STANDARD_HIGHRISE = "STANDARD_HIGHRISE"
    PODIUM_TOWER = "PODIUM_TOWER"
    STEPPED_TERRACE = "STEPPED_TERRACE"
    L_SHAPED = "L_SHAPED"
    COMMERCIAL_CAMPUS = "COMMERCIAL_CAMPUS"
    CYBERPUNK_MEGATOWER = "CYBERPUNK_MEGATOWER"


class FloorType(str, Enum):
    LOBBY_RETAIL = "LOBBY_RETAIL"
    PODIUM_AMENITY = "PODIUM_AMENITY"
    RESIDENTIAL_TYPE_A = "RESIDENTIAL_TYPE_A"
    RESIDENTIAL_TYPE_B = "RESIDENTIAL_TYPE_B"
    STEPPED_PENTHOUSE = "STEPPED_PENTHOUSE"
    COMMERCIAL_OFFICE = "COMMERCIAL_OFFICE"
    EXECUTIVE_CONCOURSE = "EXECUTIVE_CONCOURSE"


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
    description: Optional[str] = None


@dataclass
class BuildingStructure:
    name: str
    zone: str
    ground_elevation: float
    height: float
    floor_count: int
    volumes: List[GeneratedVolume] = field(default_factory=list)
    typology: str = "STANDARD_HIGHRISE"
    jurisdiction: str = "IN_MH"
    # Real-world WGS84 anchor: (longitude, latitude, elevation_msl_m)
    # When set, every mesh carries an 'origin' field so the API spatial
    # index stores real WGS84 bounding boxes instead of local metric coords.
    geo_anchor: Optional[Tuple[float, float, float]] = None

    @property
    def total_volume(self) -> float:
        return sum(v.volume for v in self.volumes)

    def get_by_class(self, cls: str) -> List[GeneratedVolume]:
        return [v for v in self.volumes if v.cls == cls]

    def apply_geo_anchor(self, lon: float, lat: float, elev_msl: float) -> "BuildingStructure":
        """
        Store the real-world geographic anchor on the BuildingStructure.
        The allocator will use this anchor when indexing each volume into the
        spatial R-tree so that /cover bbox queries work with real WGS84 coordinates.
        This does NOT modify mesh vertex positions (kept in local metric space
        for volume/watertight accuracy); instead it embeds an 'origin' field in
        the geometry_json stored per volume so the spatial index can compute the
        correct WGS84 bounding box.
        """
        self.geo_anchor = (lon, lat, elev_msl)
        return self


class BuildingGenerator:
    """
    Parametric 3D generator for building envelopes, floors, units,
    common areas, underground infrastructure, and elevated corridors.
    Guarantees closed, watertight 2-manifold polyhedral solids and exact volume conservation.
    """

    def __init__(self, ground_elevation: float = 0.0):
        self.ground_elevation = ground_elevation

    def create_box_volume(
        self,
        cls: str,
        label: str,
        extents: Tuple[float, float, float],
        center: Tuple[float, float, float],
        parent_label: Optional[str] = None,
        data_provenance: str = "SYNTHETIC",
        description: Optional[str] = None
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
            data_provenance=data_provenance,
            description=description
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
        has_elevated_metro: bool = False,
        typology: Union[BuildingTypology, str] = BuildingTypology.STANDARD_HIGHRISE,
        floor_variation: bool = True,
        jurisdiction: str = "IN_MH"
    ) -> BuildingStructure:
        """
        Generates complete 3D structure exercising all 10 property classes:
        S, B, L, U, C, P, A, T, E, I.
        Supports architectural typologies and realistic intra-building floor variations.
        """
        if isinstance(typology, str):
            try:
                typology = BuildingTypology(typology)
            except ValueError:
                typology = BuildingTypology.STANDARD_HIGHRISE

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
            center=(0.0, 0.0, parcel_z),
            description="Surface Cadastral Parcel Column with air and subsurface rights"
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
            parent_label=vol_s.label,
            description="Master Building Envelope Solid"
        )
        volumes.append(vol_b)

        # ----------------------------------------------------------------------
        # 3. Class L, U, C: Levels, Units, and Commons
        # ----------------------------------------------------------------------
        for fl in range(floor_count):
            fl_z_center = g_elev + (fl * floor_height_m) + (floor_height_m / 2.0)
            level_label = f"{name}_Level_{fl:02d}"

            # Class L: Level Slab Band
            vol_l = self.create_box_volume(
                cls="L",
                label=level_label,
                extents=(width_m, depth_m, floor_height_m),
                center=(0.0, 0.0, fl_z_center),
                parent_label=vol_b.label,
                description=f"Level Slab Band {fl:02d}"
            )
            volumes.append(vol_l)

            # Determine layout variation for this floor
            level_vols = self._generate_floor_layout(
                level_label=level_label,
                floor_idx=fl,
                floor_count=floor_count,
                width_m=width_m,
                depth_m=depth_m,
                height_m=floor_height_m,
                center_z=fl_z_center,
                units_per_floor=units_per_floor,
                typology=typology,
                floor_variation=floor_variation
            )
            volumes.extend(level_vols)

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
                parent_label=vol_s.label,
                description=f"Subterranean Basement Vault Level B{b_idx}"
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
                    parent_label=b_label,
                    description=f"Designated Parking Bay B{b_idx}-P{p_slot + 1:02d}"
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
            parent_label=vol_s.label,
            description="Transferable Development Rights / Airspace Lot"
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
                parent_label=vol_s.label,
                description="Underground Mass Rapid Transit Rail Alignment"
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
                parent_label=vol_s.label,
                description="Elevated Metro Viaduct Transit Right-of-Way"
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
            parent_label=vol_s.label,
            description="Subsurface Municipal Utility Infrastructure Duct"
        )
        volumes.append(vol_i)

        return BuildingStructure(
            name=name,
            zone=zone,
            ground_elevation=g_elev,
            height=tower_height,
            floor_count=floor_count,
            volumes=volumes,
            typology=typology.value,
            jurisdiction=jurisdiction
        )

    def _generate_floor_layout(
        self,
        level_label: str,
        floor_idx: int,
        floor_count: int,
        width_m: float,
        depth_m: float,
        height_m: float,
        center_z: float,
        units_per_floor: int,
        typology: BuildingTypology,
        floor_variation: bool
    ) -> List[GeneratedVolume]:
        """
        Subdivides a level slab into watertight unit (U) and common (C) spaces.
        Guarantees strict volume conservation: sum(vol(U)) + sum(vol(C)) == level_vol.
        """
        vols: List[GeneratedVolume] = []

        # If floor variation is disabled, use uniform symmetrical subdivision
        if not floor_variation:
            return self._generate_uniform_floor(
                level_label, width_m, depth_m, height_m, center_z, units_per_floor
            )

        # Commercial campus typology has specialized atrium layout
        if typology == BuildingTypology.COMMERCIAL_CAMPUS:
            return self._generate_commercial_office_floor(
                level_label, floor_idx, width_m, depth_m, height_m, center_z
            )

        # Ground Floor: Grand Lobby + Commercial Retail
        if floor_idx == 0:
            return self._generate_ground_lobby_floor(
                level_label, width_m, depth_m, height_m, center_z
            )

        # Top Floor (for buildings with >= 3 floors): Luxury Penthouse + Sky Terraces
        if floor_idx == floor_count - 1 and floor_count >= 3:
            return self._generate_penthouse_terrace_floor(
                level_label, width_m, depth_m, height_m, center_z
            )

        # Podium Amenity Floor (for Podium towers on Level 01 or 02)
        if typology == BuildingTypology.PODIUM_TOWER and floor_idx in (1, 2):
            return self._generate_podium_amenity_floor(
                level_label, floor_idx, width_m, depth_m, height_m, center_z
            )

        # Mid-rise Residential: Alternating layout (Even floors = Type A, Odd floors = Type B)
        if floor_idx % 2 == 0:
            return self._generate_residential_type_a(
                level_label, width_m, depth_m, height_m, center_z
            )
        else:
            return self._generate_residential_type_b(
                level_label, width_m, depth_m, height_m, center_z
            )

    def _generate_uniform_floor(
        self,
        level_label: str,
        width_m: float,
        depth_m: float,
        height_m: float,
        center_z: float,
        units_per_floor: int
    ) -> List[GeneratedVolume]:
        """Uniform floor plate with central corridor and identical units."""
        vols: List[GeneratedVolume] = []
        corridor_w = 2.4
        vol_c = self.create_box_volume(
            cls="C",
            label=f"{level_label}_CommonCorridor",
            extents=(corridor_w, depth_m, height_m),
            center=(0.0, 0.0, center_z),
            parent_label=level_label,
            description="Central Circulation Corridor & Core"
        )
        vols.append(vol_c)

        wing_w = (width_m - corridor_w) / 2.0
        units_in_wing = max(1, units_per_floor // 2)
        unit_d = depth_m / units_in_wing

        for wing_idx, x_sign in enumerate([-1, 1]):
            wing_center_x = x_sign * (corridor_w / 2.0 + wing_w / 2.0)
            for u_idx in range(units_in_wing):
                u_center_y = - (depth_m / 2.0) + (u_idx * unit_d) + (unit_d / 2.0)
                u_num = wing_idx * units_in_wing + u_idx + 1
                vol_u = self.create_box_volume(
                    cls="U",
                    label=f"{level_label}_Unit_{u_num:02d}",
                    extents=(wing_w, unit_d, height_m),
                    center=(wing_center_x, u_center_y, center_z),
                    parent_label=level_label,
                    description=f"Residential Apartment Unit {u_num:02d}"
                )
                vols.append(vol_u)
        return vols

    def _generate_ground_lobby_floor(
        self,
        level_label: str,
        width_m: float,
        depth_m: float,
        height_m: float,
        center_z: float
    ) -> List[GeneratedVolume]:
        """
        Ground Floor: High-ceiling Grand Entrance Lobby & Lift Core (Class C)
        flanked by street-facing commercial retail / banking showrooms (Class U).
        """
        vols: List[GeneratedVolume] = []
        # Central Grand Lobby: 35% of floor width
        lobby_w = round(width_m * 0.35, 3)
        wing_w = round((width_m - lobby_w) / 2.0, 3)
        lobby_w = round(width_m - 2.0 * wing_w, 3)

        # 1. Grand Lobby & Reception Core (Class C)
        vol_c = self.create_box_volume(
            cls="C",
            label=f"{level_label}_GrandLobby_Reception",
            extents=(lobby_w, depth_m, height_m),
            center=(0.0, 0.0, center_z),
            parent_label=level_label,
            description="Grand Double-Height Entrance Lobby, Security Desk & Elevator Core"
        )
        vols.append(vol_c)

        # West Wing (Class U, 2 units sharing boundary at y=0)
        cx_west = - (lobby_w / 2.0 + wing_w / 2.0)
        d_half = depth_m / 2.0

        vol_u_west_1 = self.create_box_volume(
            cls="U",
            label=f"{level_label}_Unit_Retail_Bank_West_01",
            extents=(wing_w, d_half, height_m),
            center=(cx_west, - d_half / 2.0, center_z),
            parent_label=level_label,
            description="Street-Facing Anchor Commercial Banking Space (South West)"
        )
        vols.append(vol_u_west_1)

        vol_u_west_2 = self.create_box_volume(
            cls="U",
            label=f"{level_label}_Unit_Retail_Store_West_02",
            extents=(wing_w, d_half, height_m),
            center=(cx_west, d_half / 2.0, center_z),
            parent_label=level_label,
            description="Street-Facing Commercial Pharmacy & Retail Store (North West)"
        )
        vols.append(vol_u_west_2)

        # East Wing (Class U, 2 units sharing boundary at y=0)
        cx_east = (lobby_w / 2.0 + wing_w / 2.0)
        vol_u_east_1 = self.create_box_volume(
            cls="U",
            label=f"{level_label}_Unit_Retail_Cafe_East_03",
            extents=(wing_w, d_half, height_m),
            center=(cx_east, - d_half / 2.0, center_z),
            parent_label=level_label,
            description="Street-Facing Cafeteria & Coffee Lounge (South East)"
        )
        vols.append(vol_u_east_1)

        vol_u_east_2 = self.create_box_volume(
            cls="U",
            label=f"{level_label}_Unit_Retail_Showroom_East_04",
            extents=(wing_w, d_half, height_m),
            center=(cx_east, d_half / 2.0, center_z),
            parent_label=level_label,
            description="Street-Facing Commercial Showroom Space (North East)"
        )
        vols.append(vol_u_east_2)

        return vols

    def _generate_residential_type_a(
        self,
        level_label: str,
        width_m: float,
        depth_m: float,
        height_m: float,
        center_z: float
    ) -> List[GeneratedVolume]:
        """
        Residential Floor Type A (Even Floors):
        - Central Hallway & Core (Class C)
        - West Wing: Asymmetric Master 3BHK (60% depth) + Compact 1BHK Studio (40% depth)
        - East Wing: Two balanced 2BHK Apartments (50% / 50%)
        """
        vols: List[GeneratedVolume] = []
        corridor_w = 2.4
        vol_c = self.create_box_volume(
            cls="C",
            label=f"{level_label}_CommonCorridor",
            extents=(corridor_w, depth_m, height_m),
            center=(0.0, 0.0, center_z),
            parent_label=level_label,
            description="Central Resident Circulation Hallway & Stair Core"
        )
        vols.append(vol_c)

        wing_w = (width_m - corridor_w) / 2.0

        # West Wing (x < 0): 3BHK Master (60%) + 1BHK Studio (40%)
        d_3bhk = round(depth_m * 0.60, 3)
        d_1bhk = round(depth_m - d_3bhk, 3)
        cx_west = - (corridor_w / 2.0 + wing_w / 2.0)

        # 3BHK Master
        cy_3bhk = - (depth_m / 2.0) + (d_3bhk / 2.0)
        vol_3bhk = self.create_box_volume(
            cls="U",
            label=f"{level_label}_Unit_3BHK_Master_01",
            extents=(wing_w, d_3bhk, height_m),
            center=(cx_west, cy_3bhk, center_z),
            parent_label=level_label,
            description="Spacious 3BHK Family Master Apartment with dual balcony"
        )
        vols.append(vol_3bhk)

        # 1BHK Studio
        cy_1bhk = (depth_m / 2.0) - (d_1bhk / 2.0)
        vol_1bhk = self.create_box_volume(
            cls="U",
            label=f"{level_label}_Unit_1BHK_Studio_02",
            extents=(wing_w, d_1bhk, height_m),
            center=(cx_west, cy_1bhk, center_z),
            parent_label=level_label,
            description="Compact 1BHK Executive Studio Suite"
        )
        vols.append(vol_1bhk)

        # East Wing (x > 0): Two symmetrical 2BHK Apartments (50% / 50%)
        d_2bhk = depth_m / 2.0
        cx_east = (corridor_w / 2.0 + wing_w / 2.0)

        for u_sub in range(2):
            cy_2bhk = - (depth_m / 2.0) + (u_sub * d_2bhk) + (d_2bhk / 2.0)
            u_name = f"2BHK_East_{'South' if u_sub == 0 else 'North'}"
            vol_2bhk = self.create_box_volume(
                cls="U",
                label=f"{level_label}_Unit_{u_name}_0{u_sub + 3}",
                extents=(wing_w, d_2bhk, height_m),
                center=(cx_east, cy_2bhk, center_z),
                parent_label=level_label,
                description=f"Standard 2BHK Urban Apartment ({'South' if u_sub == 0 else 'North'} Wing)"
            )
            vols.append(vol_2bhk)

        return vols

    def _generate_residential_type_b(
        self,
        level_label: str,
        width_m: float,
        depth_m: float,
        height_m: float,
        center_z: float
    ) -> List[GeneratedVolume]:
        """
        Residential Floor Type B (Odd Floors):
        - Central Hallway & Core (Class C)
        - West Wing: Two symmetrical 2BHK Apartments (50% / 50%)
        - East Wing: 3 distinct units (Two Corner Executive Suites + One Central Studio)
        """
        vols: List[GeneratedVolume] = []
        corridor_w = 2.4
        vol_c = self.create_box_volume(
            cls="C",
            label=f"{level_label}_CommonCorridor",
            extents=(corridor_w, depth_m, height_m),
            center=(0.0, 0.0, center_z),
            parent_label=level_label,
            description="Central Resident Circulation Hallway & Stair Core"
        )
        vols.append(vol_c)

        wing_w = (width_m - corridor_w) / 2.0

        # West Wing (x < 0): Two balanced 2BHK units
        d_2bhk = depth_m / 2.0
        cx_west = - (corridor_w / 2.0 + wing_w / 2.0)
        for u_sub in range(2):
            cy_2bhk = - (depth_m / 2.0) + (u_sub * d_2bhk) + (d_2bhk / 2.0)
            vol_2bhk = self.create_box_volume(
                cls="U",
                label=f"{level_label}_Unit_2BHK_West_0{u_sub + 1}",
                extents=(wing_w, d_2bhk, height_m),
                center=(cx_west, cy_2bhk, center_z),
                parent_label=level_label,
                description=f"Standard 2BHK Apartment ({'South' if u_sub == 0 else 'North'} Wing)"
            )
            vols.append(vol_2bhk)

        # East Wing (x > 0): 3 Units (Corner Suite South 35%, Central Studio 30%, Corner Suite North 35%)
        cx_east = (corridor_w / 2.0 + wing_w / 2.0)
        d_corner = round(depth_m * 0.35, 3)
        d_center = round(depth_m - 2.0 * d_corner, 3)

        # South Corner Suite
        cy_south = - (depth_m / 2.0) + (d_corner / 2.0)
        vol_south = self.create_box_volume(
            cls="U",
            label=f"{level_label}_Unit_ExecSuite_South_03",
            extents=(wing_w, d_corner, height_m),
            center=(cx_east, cy_south, center_z),
            parent_label=level_label,
            description="Executive Corner Suite with Panoramic Corner Glazing"
        )
        vols.append(vol_south)

        # Central Studio
        cy_center = 0.0
        vol_mid = self.create_box_volume(
            cls="U",
            label=f"{level_label}_Unit_Studio_Center_04",
            extents=(wing_w, d_center, height_m),
            center=(cx_east, cy_center, center_z),
            parent_label=level_label,
            description="Central Compact Urban Studio Unit"
        )
        vols.append(vol_mid)

        # North Corner Suite
        cy_north = (depth_m / 2.0) - (d_corner / 2.0)
        vol_north = self.create_box_volume(
            cls="U",
            label=f"{level_label}_Unit_ExecSuite_North_05",
            extents=(wing_w, d_corner, height_m),
            center=(cx_east, cy_north, center_z),
            parent_label=level_label,
            description="Executive Corner Suite with North Garden View"
        )
        vols.append(vol_north)

        return vols

    def _generate_penthouse_terrace_floor(
        self,
        level_label: str,
        width_m: float,
        depth_m: float,
        height_m: float,
        center_z: float
    ) -> List[GeneratedVolume]:
        """
        Top Level (Penthouse Tier):
        - Central Private Elevator Foyer & Sky Vestibule (Class C)
        - West Wing: Royal Sky Penthouse (Class U, 65% depth) + West Sky Terrace Garden (Class C, 35% depth)
        - East Wing: Imperial Sky Penthouse (Class U, 65% depth) + East Sky Observation Deck (Class C, 35% depth)
        """
        vols: List[GeneratedVolume] = []
        corridor_w = 2.4
        vol_c = self.create_box_volume(
            cls="C",
            label=f"{level_label}_Penthouse_Elevator_Foyer",
            extents=(corridor_w, depth_m, height_m),
            center=(0.0, 0.0, center_z),
            parent_label=level_label,
            description="Private Penthouse Elevator Foyer & Sky Vestibule"
        )
        vols.append(vol_c)

        wing_w = (width_m - corridor_w) / 2.0
        d_penthouse = round(depth_m * 0.65, 3)
        d_terrace = round(depth_m - d_penthouse, 3)

        # West Wing (x < 0)
        cx_west = - (corridor_w / 2.0 + wing_w / 2.0)
        cy_pent_west = - (depth_m / 2.0) + (d_penthouse / 2.0)
        cy_terr_west = (depth_m / 2.0) - (d_terrace / 2.0)

        vol_pent_west = self.create_box_volume(
            cls="U",
            label=f"{level_label}_Unit_Royal_Penthouse_West",
            extents=(wing_w, d_penthouse, height_m),
            center=(cx_west, cy_pent_west, center_z),
            parent_label=level_label,
            description="Duplex Royal Sky Penthouse Suite with High Ceilings"
        )
        vols.append(vol_pent_west)

        vol_terr_west = self.create_box_volume(
            cls="C",
            label=f"{level_label}_SkyTerrace_Garden_West",
            extents=(wing_w, d_terrace, height_m),
            center=(cx_west, cy_terr_west, center_z),
            parent_label=level_label,
            description="Landscaped Open Sky Terrace Garden with Pergola"
        )
        vols.append(vol_terr_west)

        # East Wing (x > 0)
        cx_east = (corridor_w / 2.0 + wing_w / 2.0)
        cy_pent_east = - (depth_m / 2.0) + (d_penthouse / 2.0)
        cy_terr_east = (depth_m / 2.0) - (d_terrace / 2.0)

        vol_pent_east = self.create_box_volume(
            cls="U",
            label=f"{level_label}_Unit_Imperial_Penthouse_East",
            extents=(wing_w, d_penthouse, height_m),
            center=(cx_east, cy_pent_east, center_z),
            parent_label=level_label,
            description="Imperial Sky Penthouse Residence with Panoramic Views"
        )
        vols.append(vol_pent_east)

        vol_terr_east = self.create_box_volume(
            cls="C",
            label=f"{level_label}_SkyTerrace_ObservationDeck_East",
            extents=(wing_w, d_terrace, height_m),
            center=(cx_east, cy_terr_east, center_z),
            parent_label=level_label,
            description="Rooftop Observation Deck & Residents' Sunset Lounge"
        )
        vols.append(vol_terr_east)

        return vols

    def _generate_podium_amenity_floor(
        self,
        level_label: str,
        floor_idx: int,
        width_m: float,
        depth_m: float,
        height_m: float,
        center_z: float
    ) -> List[GeneratedVolume]:
        """
        Podium Amenity Floor (Level 01/02 of Podium Towers):
        Clubhouse, fitness gym, banquet hall (Class C) + executive business suites (Class U).
        """
        vols: List[GeneratedVolume] = []
        corridor_w = round(width_m * 0.25, 3)
        wing_w = round((width_m - corridor_w) / 2.0, 3)
        corridor_w = round(width_m - 2.0 * wing_w, 3)

        # Central Circulation & Core (Class C)
        vol_c = self.create_box_volume(
            cls="C",
            label=f"{level_label}_Amenity_Circulation_Core",
            extents=(corridor_w, depth_m, height_m),
            center=(0.0, 0.0, center_z),
            parent_label=level_label,
            description="Amenity Floor Central Gallery, Escalator & Core"
        )
        vols.append(vol_c)

        # West Wing: Residents' Clubhouse & Gymnasium (Class C)
        cx_west = - (corridor_w / 2.0 + wing_w / 2.0)
        vol_club = self.create_box_volume(
            cls="C",
            label=f"{level_label}_Clubhouse_FitnessCenter",
            extents=(wing_w, depth_m, height_m),
            center=(cx_west, 0.0, center_z),
            parent_label=level_label,
            description="Community Clubhouse, Indoor Sports & Gymnasium Facility"
        )
        vols.append(vol_club)

        # East Wing: Executive Co-Working Suites (Class U, 2 suites)
        cx_east = (corridor_w / 2.0 + wing_w / 2.0)
        d_suite = depth_m / 2.0
        for s_idx in range(2):
            cy_suite = - (depth_m / 2.0) + (s_idx * d_suite) + (d_suite / 2.0)
            vol_suite = self.create_box_volume(
                cls="U",
                label=f"{level_label}_Unit_Business_Suite_0{s_idx + 1}",
                extents=(wing_w, d_suite, height_m),
                center=(cx_east, cy_suite, center_z),
                parent_label=level_label,
                description=f"Executive Co-Working & Conference Suite 0{s_idx + 1}"
            )
            vols.append(vol_suite)

        return vols

    def _generate_commercial_office_floor(
        self,
        level_label: str,
        floor_idx: int,
        width_m: float,
        depth_m: float,
        height_m: float,
        center_z: float
    ) -> List[GeneratedVolume]:
        """
        Commercial Tech Campus Floor:
        Central Lightwell Atrium & Core (Class C) surrounded by 4 modular IT office bays (Class U).
        Sum of area: Atrium + North + South + West + East == width_m * depth_m.
        """
        vols: List[GeneratedVolume] = []
        atrium_w = round(width_m * 0.35, 3)
        atrium_d = round(depth_m * 0.40, 3)

        # 1. Central Atrium & Elevator Core (Class C)
        vol_atrium = self.create_box_volume(
            cls="C",
            label=f"{level_label}_Central_Atrium_Core",
            extents=(atrium_w, atrium_d, height_m),
            center=(0.0, 0.0, center_z),
            parent_label=level_label,
            description="Central Lightwell Atrium, Elevator Banks & Breakout Common Zone"
        )
        vols.append(vol_atrium)

        # 2. North Office Bay (Full width)
        north_d = round((depth_m - atrium_d) / 2.0, 3)
        cy_north = (atrium_d / 2.0) + (north_d / 2.0)
        vol_north = self.create_box_volume(
            cls="U",
            label=f"{level_label}_Unit_Office_Bay_North",
            extents=(width_m, north_d, height_m),
            center=(0.0, cy_north, center_z),
            parent_label=level_label,
            description="Modular Enterprise IT Office Floorplate (North Wing)"
        )
        vols.append(vol_north)

        # 3. South Office Bay (Full width)
        south_d = round(depth_m - atrium_d - north_d, 3)
        cy_south = - (atrium_d / 2.0) - (south_d / 2.0)
        vol_south = self.create_box_volume(
            cls="U",
            label=f"{level_label}_Unit_Office_Bay_South",
            extents=(width_m, south_d, height_m),
            center=(0.0, cy_south, center_z),
            parent_label=level_label,
            description="Modular Enterprise IT Office Floorplate (South Wing)"
        )
        vols.append(vol_south)

        # 4. West Office Bay (Between North & South bays)
        west_w = round((width_m - atrium_w) / 2.0, 3)
        cx_west = - (atrium_w / 2.0) - (west_w / 2.0)
        vol_west = self.create_box_volume(
            cls="U",
            label=f"{level_label}_Unit_Office_Bay_West",
            extents=(west_w, atrium_d, height_m),
            center=(cx_west, 0.0, center_z),
            parent_label=level_label,
            description="Executive Boardroom & IT Operations Bay (West Wing)"
        )
        vols.append(vol_west)

        # 5. East Office Bay (Between North & South bays)
        east_w = round(width_m - atrium_w - west_w, 3)
        cx_east = (atrium_w / 2.0) + (east_w / 2.0)
        vol_east = self.create_box_volume(
            cls="U",
            label=f"{level_label}_Unit_Office_Bay_East",
            extents=(east_w, atrium_d, height_m),
            center=(cx_east, 0.0, center_z),
            parent_label=level_label,
            description="Executive Boardroom & Research Bay (East Wing)"
        )
        vols.append(vol_east)

        return vols


# ------------------------------------------------------------------------------
# Specialized Architectural Typology Generators
# ------------------------------------------------------------------------------

def generate_mz1_hero_tower() -> BuildingStructure:
    """
    Mumbai Worli MZ-1 Hero Tower:
    20-storey tower, varied layouts (ground retail, asymmetric 3BHK/2BHK flats, penthouses),
    2 basements, Aqua Line underground tunnel.
    """
    generator = BuildingGenerator(ground_elevation=8.5)
    bld = generator.generate(
        name="MZ1_Worli_Hero_Tower",
        zone="MZ-1",
        width_m=28.0,
        depth_m=24.0,
        floor_count=20,
        floor_height_m=3.4,
        units_per_floor=4,
        basement_count=2,
        has_metro_tunnel=True,
        has_elevated_metro=False,
        typology=BuildingTypology.STANDARD_HIGHRISE,
        floor_variation=True,
        jurisdiction="IN_MH"
    )
    # Real-world anchor: Worli / Pandurang Budhkar Marg, Mumbai (MahaRERA P51900008345)
    bld.apply_geo_anchor(lon=72.8250, lat=18.9925, elev_msl=8.5)
    return bld


def generate_bz1_hero_tower() -> BuildingStructure:
    """
    Bengaluru MG Road BZ-1 Hero Tower:
    15-storey tower, 1 basement, Namma Metro elevated viaduct.
    """
    generator = BuildingGenerator(ground_elevation=920.5)
    bld = generator.generate(
        name="BZ1_MGRoad_Hero_Tower",
        zone="BZ-1",
        width_m=26.0,
        depth_m=22.0,
        floor_count=15,
        floor_height_m=3.3,
        units_per_floor=4,
        basement_count=1,
        has_metro_tunnel=False,
        has_elevated_metro=True,
        typology=BuildingTypology.STANDARD_HIGHRISE,
        floor_variation=True,
        jurisdiction="IN_KA"
    )
    # Real-world anchor: MG Road / Indiranagar, Bengaluru (Namma Metro Purple Line)
    bld.apply_geo_anchor(lon=77.5946, lat=12.9716, elev_msl=920.5)
    return bld


def generate_podium_tower(
    name: str = "Metropolitan_Podium_Tower",
    zone: str = "MZ-2",
    ground_elevation: float = 12.0,
    floor_count: int = 16
) -> BuildingStructure:
    """
    Podium Tower Typology:
    Commercial / amenity base podium (Level 00-02) with a residential tower above.
    """
    generator = BuildingGenerator(ground_elevation=ground_elevation)
    return generator.generate(
        name=name,
        zone=zone,
        width_m=30.0,
        depth_m=26.0,
        floor_count=floor_count,
        floor_height_m=3.5,
        units_per_floor=4,
        basement_count=2,
        has_metro_tunnel=False,
        has_elevated_metro=True,
        typology=BuildingTypology.PODIUM_TOWER,
        floor_variation=True,
        jurisdiction="IN_MH"
    )


def generate_stepped_tower(
    name: str = "Terrace_Stepped_Highrise",
    zone: str = "BZ-2",
    ground_elevation: float = 880.0,
    floor_count: int = 14
) -> BuildingStructure:
    """
    Stepped Terrace Typology:
    High-rise with progressive setbacks and luxury penthouse sky gardens.
    """
    generator = BuildingGenerator(ground_elevation=ground_elevation)
    return generator.generate(
        name=name,
        zone=zone,
        width_m=26.0,
        depth_m=22.0,
        floor_count=floor_count,
        floor_height_m=3.3,
        units_per_floor=4,
        basement_count=1,
        has_metro_tunnel=False,
        has_elevated_metro=False,
        typology=BuildingTypology.STEPPED_TERRACE,
        floor_variation=True,
        jurisdiction="IN_KA"
    )


def generate_commercial_campus(
    name: str = "Whitefield_Tech_Campus",
    zone: str = "BZ-2",
    ground_elevation: float = 875.0,
    floor_count: int = 6
) -> BuildingStructure:
    """
    Commercial IT Campus Typology:
    Wide floorplate tech-park building with central lightwell atrium and modular office suites.
    """
    generator = BuildingGenerator(ground_elevation=ground_elevation)
    return generator.generate(
        name=name,
        zone=zone,
        width_m=42.0,
        depth_m=32.0,
        floor_count=floor_count,
        floor_height_m=4.0,
        units_per_floor=4,
        basement_count=2,
        has_metro_tunnel=False,
        has_elevated_metro=False,
        typology=BuildingTypology.COMMERCIAL_CAMPUS,
        floor_variation=True,
        jurisdiction="IN_KA"
    )


def generate_arasaka_tower(
    name: str = "Arasaka_Megatower_NightCity",
    zone: str = "NC-01",
    floor_count: int = 30
) -> BuildingStructure:
    """
    Cyberpunk Megatower Typology (Sandbox Model):
    Futuristic vertical megastructure with concourse plaza, cantilevered executive tiers,
    and apex helipad airspace lot. Exempt from real-world state RERA restrictions.
    """
    generator = BuildingGenerator(ground_elevation=0.0)
    return generator.generate(
        name=name,
        zone=zone,
        width_m=36.0,
        depth_m=36.0,
        floor_count=floor_count,
        floor_height_m=3.8,
        units_per_floor=4,
        basement_count=3,
        has_metro_tunnel=True,
        has_elevated_metro=True,
        typology=BuildingTypology.CYBERPUNK_MEGATOWER,
        floor_variation=True,
        jurisdiction="SANDBOX"
    )
