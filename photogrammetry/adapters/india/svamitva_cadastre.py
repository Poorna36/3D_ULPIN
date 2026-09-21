"""
SVAMITVA and Indian Cadastral Data Adapter
Maps drone-extracted spatial structures to Indian Cadastral standards
(LGD codes, Khasra/Survey numbers, 2D Bhu-Aadhaar references).
"""
from dataclasses import dataclass, field
from typing import Dict, Any, List, Optional

@dataclass
class IndianCadastralParcel:
    parcel_id: str
    lgd_state_code: str
    lgd_district_code: str
    village_or_ward_name: str
    survey_khasra_number: str
    coordinates: List[List[float]]  # [ [lon, lat], ... ]
    elevation_reference_m: float
    land_use_type: str = "RESIDENTIAL_COMMERCIAL"
    status: str = "VALID"

    def to_canonical_dict(self) -> Dict[str, Any]:
        """Convert into canonical Parcel dictionary conforming to data-model.md."""
        return {
            "parcel_id": self.parcel_id,
            "source_parcel_id": f"IND-LGD-{self.lgd_district_code}-{self.survey_khasra_number}",
            "country": "India",
            "city": self.village_or_ward_name.lower(),
            "coordinates": self.coordinates,
            "elevation_reference": self.elevation_reference_m,
            "source": "SVAMITVA / Survey of India Drone Cadastre",
            "status": self.status,
            "metadata": {
                "lgd_state_code": self.lgd_state_code,
                "lgd_district_code": self.lgd_district_code,
                "survey_khasra_number": self.survey_khasra_number,
                "land_use": self.land_use_type
            }
        }


# Standard sample Indian Drone Cadastre Parcels (Bengaluru & Mumbai)
SAMPLE_INDIAN_PARCELS: List[IndianCadastralParcel] = [
    IndianCadastralParcel(
        parcel_id="BLR-PRC-DRONE-801",
        lgd_state_code="29",         # Karnataka
        lgd_district_code="572",     # Bengaluru Urban
        village_or_ward_name="Bengaluru",
        survey_khasra_number="SY-142/3",
        coordinates=[
            [77.5920, 12.9710],
            [77.5960, 12.9710],
            [77.5960, 12.9750],
            [77.5920, 12.9750]
        ],
        elevation_reference_m=920.0,
        land_use_type="HIGH_DENSITY_URBAN"
    ),
    IndianCadastralParcel(
        parcel_id="BOM-PRC-DRONE-901",
        lgd_state_code="27",         # Maharashtra
        lgd_district_code="519",     # Mumbai City
        village_or_ward_name="Mumbai",
        survey_khasra_number="CS-892/1",
        coordinates=[
            [72.8250, 18.9950],
            [72.8300, 18.9950],
            [72.8300, 19.0000],
            [72.8250, 19.0000]
        ],
        elevation_reference_m=14.5,
        land_use_type="COMMERCIAL_RESIDENTIAL_COMPLEX"
    )
]
