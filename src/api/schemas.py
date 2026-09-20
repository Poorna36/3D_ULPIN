"""
Pydantic Schemas for 3D ULPIN REST Endpoints
Conforms strictly to docs/contracts.md § 8.4 and Phase 10A.
"""
from typing import List, Optional, Dict, Any, Literal, Union
from pydantic import BaseModel, Field


PropertyClass = Literal["S", "B", "L", "U", "C", "P", "A", "T", "E", "I"]
DataProvenance = Literal["REAL", "PROXY", "SYNTHETIC", "REAL-FOREIGN", "REAL-OWN"]
BoundaryConvention = Literal["INNER_FACE", "WALL_CENTRE", "OUTER_FACE"]
ICTResultType = Literal["NEW", "CONTINUE", "SPLIT", "MERGE", "AMBIGUOUS"]
ValidationStatus = Literal["PASS", "WARN", "FAIL", "UNVERIFIABLE"]
VerifyResultType = Literal["MATCH", "DRIFT", "NOT_SAME"]


class StatutoryAnchorModel(BaseModel):
    act_name: str
    section: str
    statutory_basis: str
    citation: str
    notes: Optional[str] = ""


class RERAComplianceResult(BaseModel):
    sanctioned_carpet_area_sqm: float
    as_built_carpet_area_sqm: float
    deviation_percentage: float
    deviation_sqm: float
    rera_compliance_status: Literal["PASS", "TOLERANCE_WARNING", "FAIL", "EXEMPT_SANDBOX"]
    statutory_citation: str
    tolerance_applied_percent: float = 5.0
    notes: Optional[str] = ""


class GeometryModel(BaseModel):
    type: str = "Solid"
    coordinates: Optional[Any] = None
    vertices: Optional[List[List[float]]] = None
    faces: Optional[List[List[int]]] = None
    extents: Optional[List[float]] = None
    crs: Optional[str] = "EPSG:4326"
    datum_id: Optional[str] = "WGS84"
    # Real-world WGS84 anchor [lon, lat, elev_msl_m].
    # Vertices are in local metric space relative to this origin.
    # Frontend: worldPos = [origin[0] + x/m_per_deg_lon, origin[1] + y/m_per_deg_lat, z]
    origin: Optional[List[float]] = None


class AllocateRequest(BaseModel):
    parent_ulpin: str = Field(..., description="14-char ULPIN, real or PROXY")
    building_seq: str = Field("B0000", description="B + 4 Crockford base-32 chars")
    cls: PropertyClass = Field(..., description="Property class enum: S|B|L|U|C|P|A|T|E|I")
    geometry: GeometryModel = Field(..., description="3D polyhedral surface or solid geometry")
    evidence_refs: List[str] = Field(default_factory=list)
    plan_version: str = Field("1.0")
    data_provenance: DataProvenance = Field("SYNTHETIC")
    boundary_convention: BoundaryConvention = Field("INNER_FACE")
    parent_rid: Optional[str] = None
    spans: Optional[List[str]] = None
    issuer_node_id: str = Field("MH")
    jurisdiction: Optional[str] = Field("IN_MH", description="IN_MH, IN_KA, SG, or SANDBOX")
    legacy_system: Optional[str] = Field(None, description="Legacy identifier system (CTS, e-PID, UPOR, e-Aasthi)")
    legacy_value: Optional[str] = Field(None, description="Legacy parcel or property card identifier value")
    sanctioned_carpet_area_sqm: Optional[float] = Field(None, description="Sanctioned RERA carpet area in square metres")
    geo_anchor: Optional[List[float]] = Field(
        None,
        description="Real-world WGS84 geo-anchor [lon, lat, elev_msl_m]. "
                    "When provided, spatial index stores WGS84 bounding boxes so "
                    "GET /cover?bbox=<WGS84> returns correctly positioned volumes."
    )


class AllocateResponse(BaseModel):
    rid: str
    nk_digest: str
    nk_locator: str
    ict_result: ICTResultType
    binding_record_hash: str
    version: int = 1


class CurrentNK(BaseModel):
    digest: Optional[str] = None
    locator: Optional[str] = None
    version: int = 1


class LegacyId(BaseModel):
    id_system: str
    legacy_value: str


class ResolveResponse(BaseModel):
    rid: str
    cls: str
    status: str
    parent_rid: Optional[str] = None
    parent_ulpin: Optional[str] = None
    current_nk: CurrentNK
    current_parcel_ulpin: Optional[str] = None
    data_provenance: str
    legal_basis_status: str
    jurisdiction: str = "IN_MH"
    statutory_anchor: Optional[StatutoryAnchorModel] = None
    sanctioned_carpet_area_sqm: Optional[float] = None
    legacy_ids: List[LegacyId] = Field(default_factory=list)
    spans: List[str] = Field(default_factory=list)
    geometry: Optional[Dict[str, Any]] = None
    issuer_node_id: str


class VerifyRequest(BaseModel):
    rid: str
    geometry: GeometryModel


class VerifyResponse(BaseModel):
    result: VerifyResultType
    computed_digest: str
    registered_digest: str
    ict_score: float
    iou3d: float
    confidence: float
    uncertainty: Dict[str, float]


class VersionRecord(BaseModel):
    version: int
    nk_digest: str
    timestamp: str
    evidence_refs: List[str] = Field(default_factory=list)
    plan_version: str
    prev_hash: str
    record_hash: str
    sign_off: Optional[Dict[str, str]] = None


class LineageEdge(BaseModel):
    type: str  # SUPERSEDES|SPLIT_FROM|MERGED_FROM|DEMOLISHED
    from_rid: str
    to_rid: str
    timestamp: str


class LineageResponse(BaseModel):
    rid: str
    versions: List[VersionRecord]
    lineage_edges: List[LineageEdge] = Field(default_factory=list)


class CoverFeature(BaseModel):
    rid: str
    cls: str
    data_provenance: str
    validation_status: ValidationStatus = "PASS"
    tier: str = "T1"
    geometry: Optional[Dict[str, Any]] = None


class GeoJSON3DProperties(BaseModel):
    rid: str
    cls: str
    data_provenance: str
    validation_status: ValidationStatus = "PASS"
    tier: str = "T1"
    height: float = Field(0.0, description="Bottom elevation / ellipsoid z_min")
    extrudedHeight: float = Field(3.0, description="Top elevation / ellipsoid z_max")
    fill_color: str = Field("#E8A048", description="Hex color according to class scheme")
    outline_color: str = Field("#FFFFFF", description="Hex outline color")
    fill_opacity: float = 0.85
    jurisdiction: str = "IN_MH"
    legal_basis_status: str = "ENACTED"


class GeoJSON3DFeature(BaseModel):
    type: Literal["Feature"] = "Feature"
    properties: GeoJSON3DProperties
    geometry: Dict[str, Any]


class CoverResponse(BaseModel):
    type: str = "FeatureCollection"
    features: List[Union[CoverFeature, GeoJSON3DFeature]]
    total_count: int


class TierResult(BaseModel):
    tier: str
    status: ValidationStatus
    findings: List[Dict[str, Any]] = Field(default_factory=list)


class EvidenceSufficiency(BaseModel):
    available: List[str] = Field(default_factory=list)
    required_for_full_pass: List[str] = Field(default_factory=list)
    unverifiable_checks: List[str] = Field(default_factory=list)


class ValidateResponse(BaseModel):
    rid: str
    overall_status: ValidationStatus
    tier_results: List[TierResult]
    evidence_sufficiency: EvidenceSufficiency
    rera_compliance: Optional[RERAComplianceResult] = None
