"""
OpenDroneMap (ODM / NodeODM / WebODM) REST Client
Manages end-to-end aerial photogrammetry jobs for drone surveys.
Outputs include: Orthophoto (GeoTIFF), DSM/DTM (GeoTIFF), Point Cloud (.las),
Textured Mesh (.obj), and Cesium-compatible OGC 3D Tiles.
"""
from typing import Dict, Any, List, Optional
import json
import logging

try:
    import httpx
except ImportError:
    import urllib.request as httpx

logger = logging.getLogger("odm_client")

class ODMClient:
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url.rstrip("/")

    def check_health(self) -> Dict[str, Any]:
        """Verify if NodeODM service is reachable and retrieve engine capabilities."""
        import urllib.request
        import json
        url = f"{self.base_url}/info"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "3D-ULPIN-Engine/1.0"})
            with urllib.request.urlopen(req, timeout=3) as resp:
                data = json.loads(resp.read().decode())
                return {"online": True, "info": data}
        except Exception as e:
            return {"online": False, "error": str(e), "message": "NodeODM instance not running locally"}

    def build_task_options(
        self,
        orthophoto_resolution_cm: float = 2.5,
        generate_dsm: bool = True,
        generate_dtm: bool = True,
        generate_3d_tiles: bool = True,
        generate_point_cloud: bool = True,
        feature_quality: str = "high"
    ) -> List[Dict[str, Any]]:
        """Construct standard ODM photogrammetry parameter options."""
        return [
            {"name": "orthophoto-resolution", "value": orthophoto_resolution_cm},
            {"name": "dsm", "value": generate_dsm},
            {"name": "dtm", "value": generate_dtm},
            {"name": "3d-tiles", "value": generate_3d_tiles},
            {"name": "pc-las", "value": generate_point_cloud},
            {"name": "feature-quality", "value": feature_quality},
            {"name": "mesh-octree-depth", "value": 11},
            {"name": "auto-boundary", "value": True}
        ]

    def create_task_payload(
        self,
        survey_name: str,
        options: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """Create task configuration payload for NodeODM."""
        opts = options or self.build_task_options()
        return {
            "name": survey_name,
            "options": opts
        }
