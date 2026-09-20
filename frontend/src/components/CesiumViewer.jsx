import { useEffect, useRef, useCallback } from 'react';
import { buildFullFloorList } from './InteriorWalkthrough.jsx';
import {
  Viewer, Ion, Cartesian3, Cartographic, Color, HeightReference,
  VerticalOrigin, HorizontalOrigin, LabelStyle, Cartesian2,
  ScreenSpaceEventHandler, ScreenSpaceEventType,
  createOsmBuildingsAsync, createGooglePhotorealistic3DTileset,
  Cesium3DTileset, IonResource,
  ClassificationType,
  Math as CesiumMath, NearFarScalar,
  PolygonHierarchy, ConstantProperty, ColorMaterialProperty,
  ShadowMode, EasingFunction, ImageryLayer,
  Terrain, IonWorldImageryStyle,
  BoundingSphere, HeadingPitchRange, JulianDate,
  sampleTerrainMostDetailed, RequestScheduler,
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN ?? '';

// Maximize parallel HTTP/2 tile streaming to eliminate blank tile delays
try {
  RequestScheduler.requestsByServer['tile.googleapis.com:443'] = 18;
  RequestScheduler.requestsByServer['assets.cesium.com:443'] = 18;
  RequestScheduler.requestsByServer['api.cesium.com:443'] = 18;
} catch {}

// ── Cinematic city viewpoints ────────────────────────────────────────────────
// Low-altitude street & mid-tower perspective (380-480m) giving majestic architectural scale
const CITY_POSITIONS = {
  bengaluru: {
    // Oblique architectural viewpoint over CBD / UB City & MG Road (Ground elevation is 920m AMSL)
    lon: 77.5946, lat: 12.9716, height: 1370,
    pitchDeg: -24, headingDeg: 22,
  },
  mumbai: {
    // Oblique architectural viewpoint over Worli / Lower Parel supertall cluster & Arabian Sea
    lon: 72.8270, lat: 18.9990, height: 490,
    pitchDeg: -22, headingDeg: 28,
  },
  netherlands: {
    // Oblique architectural viewpoint on Kop van Zuid across Erasmusbrug & Nieuwe Maas
    lon: 4.4871, lat: 51.9038, height: 440,
    pitchDeg: -22, headingDeg: 14,
  },
  singapore: {
    // Oblique architectural viewpoint across Marina Bay waterfront towards MBFC & Raffles Place
    lon: 103.8560, lat: 1.2810, height: 460,
    pitchDeg: -22, headingDeg: -32,
  },
};

// ── Interactive Pilot City Pins on Earth Space Orbit View ────────────────────
const PILOT_PINS = [
  { id: 'bengaluru',   name: 'Bengaluru',      country: 'India',       flag: '🇮🇳', lon: 77.5946,  lat: 12.9716, color: '#00d4ff' },
  { id: 'mumbai',      name: 'Mumbai',         country: 'India',       flag: '🇮🇳', lon: 72.8270,  lat: 18.9990, color: '#10d97e' },
  { id: 'netherlands', name: 'Rotterdam (NL)', country: 'Netherlands', flag: '🇳🇱', lon: 4.4871,   lat: 51.9038, color: '#f59e0b' },
  { id: 'singapore',   name: 'Singapore',      country: 'Singapore',   flag: '🇸🇬', lon: 103.8540, lat: 1.2800,  color: '#a855f7' },
];

// ── Preemptive Preloader: Pilot Cities (Bengaluru, Mumbai, Rotterdam, Singapore) ──
// Pre-warms high-res terrain elevation & satellite imagery tiles for the 4 focal zones,
// while letting the rest of the planet render with coarse/lightweight SSE (3.5).
function preloadPilotCities(viewer, baseLayer) {
  if (!viewer || viewer.isDestroyed()) return;

  const pilotPositions = PILOT_PINS.map(p => Cartographic.fromDegrees(p.lon, p.lat));

  // 1. Preemptively fetch terrain elevation LODs for the 4 cities
  try {
    const tp = viewer.terrainProvider;
    if (tp && typeof sampleTerrainMostDetailed === 'function') {
      sampleTerrainMostDetailed(tp, pilotPositions).catch(() => {});
    }
  } catch {}

  // 2. Preemptively fetch satellite imagery tiles across zoom levels 8, 11, 13, 15
  try {
    const ip = baseLayer?.imageryProvider;
    const scheme = ip?.tilingScheme;
    if (scheme && typeof ip.requestImage === 'function') {
      pilotPositions.forEach(carto => {
        [8, 11, 13, 15].forEach(level => {
          try {
            const tileXY = scheme.positionToTileXY(carto, level);
            if (tileXY) {
              ip.requestImage(tileXY.x, tileXY.y, level);
            }
          } catch {}
        });
      });
    }
  } catch {}
}

// Pre-generate building textures for pilot city buildings during idle time
function warmBuildingTextureCache(buildingsList) {
  if (!buildingsList || !buildingsList.length) return;
  const doWarm = () => {
    buildingsList.forEach(b => {
      try {
        generateFacadeTexture(b, false, b.is_underground);
      } catch {}
    });
  };
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(doWarm);
  } else {
    setTimeout(doWarm, 100);
  }
}

// ── Solid cadastral envelope fill colors (dark building-material base + status tint) ──
const STATUS_COLORS = {
  VALID:        Color.fromCssColorString('#0d2b1a').withAlpha(0.82), // dark forest green solid
  REVIEW:       Color.fromCssColorString('#2b1e05').withAlpha(0.80), // dark amber solid
  INVALID:      Color.fromCssColorString('#2b0808').withAlpha(0.82), // dark red solid
  DERIVED_HIGH: Color.fromCssColorString('#052030').withAlpha(0.82), // dark cyan-steel solid
};
// ── Neon glow outlines that distinguish ULPIN from plain OSM buildings ─────────
const STATUS_OUTLINE_COLORS = {
  VALID:        Color.fromCssColorString('#34d399').withAlpha(1.0),  // bright emerald neon
  REVIEW:       Color.fromCssColorString('#fbbf24').withAlpha(1.0),  // bright amber neon
  INVALID:      Color.fromCssColorString('#f87171').withAlpha(1.0),  // bright red neon
  DERIVED_HIGH: Color.fromCssColorString('#38bdf8').withAlpha(1.0),  // bright sky-blue neon
};
const SELECTED_COLOR    = Color.fromCssColorString('#042840').withAlpha(0.88); // deep selected blue
const SELECTED_OUTLINE  = Color.fromCssColorString('#00e5ff').withAlpha(1.0);  // bright electric cyan
const UNDERGROUND_COLOR = Color.fromCssColorString('#1a0a35').withAlpha(0.85); // dark purple solid
const SELECTED_UG_COLOR = Color.fromCssColorString('#2a1050').withAlpha(0.90); // deeper purple selected

// ── Deterministic hash from string ───────────────────────────────────────────
function strHash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// ── Proportional architectural building footprints ───────────────────────────
function buildingFootprint(b) {
  const id    = b.building_id || 'BLD000';
  const hash  = strHash(id);
  const shape = hash % 8;
  const { lon, lat } = b;
  const latRad = ((lat || 13) * Math.PI) / 180;
  const lonScale = 1 / Math.max(0.2, Math.cos(latRad));
  const baseScale = 0.00007 + (Math.min(b.floor_count || 10, 45) / 45) * 0.00004;
  const w = baseScale * lonScale;
  const h = baseScale;

  let pts;
  switch (shape) {
    case 0:
      pts = [[-w,-h],[w,-h],[w,h],[-w,h]];
      break;
    case 1:
      pts = [[-w*1.2,-h*0.8],[w*1.2,-h*0.8],[w*1.2,h*0.8],[-w*1.2,h*0.8]];
      break;
    case 2:
      pts = [[-w,-h],[w,-h],[w,0],[0,0],[0,h],[-w,h]];
      break;
    case 3:
      pts = [[-w*0.4,-h],[w*0.4,-h],[w*0.4,-h*0.25],[w,-h*0.25],[w,h*0.25],[w*0.4,h*0.25],[w*0.4,h],[-w*0.4,h],[-w*0.4,h*0.25],[-w,h*0.25],[-w,-h*0.25],[-w*0.4,-h*0.25]];
      break;
    case 4:
      pts = [[-w*0.35,-h],[w*0.35,-h],[w*0.35,-h*0.35],[w,-h*0.35],[w,h*0.35],[w*0.35,h*0.35],[w*0.35,h],[-w*0.35,h],[-w*0.35,h*0.35],[-w,h*0.35],[-w,-h*0.35],[-w*0.35,-h*0.35]];
      break;
    case 5:
      pts = [[-w*0.7,-h],[w*0.7,-h],[w,-h*0.7],[w,h*0.7],[w*0.7,h],[-w*0.7,h],[-w,h*0.7],[-w,-h*0.7]];
      break;
    case 6:
      pts = [[-w,-h*0.6],[w*0.4,-h],[w,-h*0.4],[w,h*0.6],[-w*0.4,h],[-w,h*0.4]];
      break;
    case 7:
      pts = [[-w*0.75,-h],[w*0.75,-h],[w*0.95,h],[-w*0.95,h]];
      break;
    default:
      pts = [[-w,-h],[w,-h],[w,h],[-w,h]];
  }

  const angleDeg = ((hash >> 4) % 24) - 12;
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad), sin = Math.sin(rad);

  return pts.map(([dx, dy]) => {
    const rx = dx * cos - dy * sin;
    const ry = dx * sin + dy * cos;
    return Cartesian3.fromDegrees(lon + rx, lat + ry, 0);
  });
}

// ── Synthetic floors generator if building has no floor list ──────────────────
function buildSyntheticFloors(b) {
  const count  = b.floor_count || Math.max(1, Math.round(Math.abs(b.height) / 3.4));
  const floorH = Math.abs(b.height) / count;
  return Array.from({ length: count }, (_, i) => ({
    floor_id: `${b.building_id}_F${i + 1}`,
    label: i === 0 ? 'Ground' : i === count - 1 ? `Roof (F${i + 1})` : `Floor ${i + 1}`,
    z_min: (b.ground_elevation || 0) + i * floorH,
    z_max: (b.ground_elevation || 0) + (i + 1) * floorH,
  }));
}

// ── Realistic Architectural Skyscraper Facade Canvas Texture Generator ───────
const FACADE_TEXTURE_CACHE = {};

function getSkyscraperTexture(b, isSelected) {
  const isUg = !!b.is_underground;
  const status = b.validation_status || 'VALID';
  const cacheKey = `${b.building_id || 'bld'}_${isSelected ? 'sel' : 'norm'}_${isUg ? 'ug' : 'above'}`;
  if (FACADE_TEXTURE_CACHE[cacheKey]) return FACADE_TEXTURE_CACHE[cacheKey];

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (isUg) {
    // Subterranean infrastructure: concrete tunnel & steel lining
    ctx.fillStyle = isSelected ? 'rgba(88, 28, 135, 0.75)' : 'rgba(30, 27, 75, 0.70)';
    ctx.fillRect(0, 0, 512, 1024);
    ctx.strokeStyle = isSelected ? '#c084fc' : '#a855f7';
    ctx.lineWidth = 3;
    for (let y = 0; y < 1024; y += 48) {
      ctx.strokeRect(6, y, 500, 36);
    }
  } else {
    // Modern architectural glass skyscraper curtain wall
    const bgGrad = ctx.createLinearGradient(0, 0, 512, 1024);
    if (isSelected) {
      bgGrad.addColorStop(0, 'rgba(14, 55, 95, 0.52)');
      bgGrad.addColorStop(0.5, 'rgba(8, 40, 72, 0.48)');
      bgGrad.addColorStop(1, 'rgba(3, 25, 50, 0.62)');
    } else {
      bgGrad.addColorStop(0, 'rgba(16, 38, 64, 0.45)');
      bgGrad.addColorStop(0.5, 'rgba(12, 30, 52, 0.42)');
      bgGrad.addColorStop(1, 'rgba(8, 20, 38, 0.55)');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 1024);

    const floorsCount = Math.min(Math.max(b.floor_count || 12, 8), 40);
    const floorH = 1024 / floorsCount;
    const colsCount = 16;
    const colW = 512 / colsCount;

    for (let fi = 0; fi < floorsCount; fi++) {
      const y = fi * floorH;
      const isLobby = fi >= floorsCount - 2; // Bottom 2 levels = Grand Entrance Lobby
      const isRoof  = fi === 0;

      // Horizontal floor spandrel beam (structural slab separation)
      ctx.fillStyle = isSelected ? 'rgba(56, 189, 248, 0.65)' : 'rgba(30, 41, 59, 0.85)';
      ctx.fillRect(0, y, 512, Math.max(3, floorH * 0.14));

      if (isLobby) {
        // Grand Entrance Atrium & Double Glass Doors
        ctx.fillStyle = 'rgba(254, 240, 138, 0.38)'; // Warm lobby interior glow
        ctx.fillRect(4, y + floorH * 0.14, 504, floorH * 0.84);

        if (fi === floorsCount - 1) {
          // Double Entrance Doors in Center
          ctx.fillStyle = 'rgba(245, 158, 11, 0.85)'; // Golden entrance lighting
          ctx.fillRect(176, y + floorH * 0.18, 160, floorH * 0.80);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(176, y + floorH * 0.18, 160, floorH * 0.80);

          // Center door split line & push bars
          ctx.beginPath();
          ctx.moveTo(256, y + floorH * 0.18);
          ctx.lineTo(256, y + floorH);
          ctx.strokeStyle = '#f8fafc';
          ctx.lineWidth = 2.0;
          ctx.stroke();

          // Door handles
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(250, y + floorH * 0.50, 4, 12);
          ctx.fillRect(258, y + floorH * 0.50, 4, 12);

          // Entrance Canopy Marquee overhead
          ctx.fillStyle = isSelected ? '#00e5ff' : '#0284c7';
          ctx.fillRect(150, y + 2, 212, 6);
        }
      } else if (!isRoof) {
        // High-rise window grid with realistic reflection and illuminated office/residential units
        for (let ci = 0; ci < colsCount; ci++) {
          const x = ci * colW;
          const seed = (fi * 19 + ci * 29) % 100;
          let winColor;
          if (isSelected) {
            winColor = seed > 60
              ? 'rgba(56, 189, 248, 0.45)' // Cyan sky reflection
              : seed > 28
                ? 'rgba(254, 240, 138, 0.50)' // Warm illuminated office
                : 'rgba(14, 116, 144, 0.28)'; // Deep tinted glass
          } else {
            winColor = seed > 55
              ? 'rgba(125, 211, 252, 0.38)' // Daylight sky tint
              : seed > 22
                ? 'rgba(253, 230, 138, 0.32)' // Warm office light
                : 'rgba(15, 23, 42, 0.30)';   // Reflective glass
          }

          ctx.fillStyle = winColor;
          ctx.fillRect(x + 2, y + floorH * 0.14 + 1, colW - 4, floorH * 0.84 - 2);

          // Aluminum vertical mullion divider
          ctx.fillStyle = isSelected ? 'rgba(56, 189, 248, 0.50)' : 'rgba(71, 85, 105, 0.60)';
          ctx.fillRect(x, y, 2, floorH);
        }
      } else {
        // Penthouse / Roof crown
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(0, y, 512, floorH);
        ctx.strokeStyle = isSelected ? '#38bdf8' : '#64748b';
        ctx.lineWidth = 3;
        ctx.strokeRect(4, y + 4, 504, floorH - 8);
      }
    }

    // Outer architectural frame
    ctx.strokeStyle = isSelected ? '#38bdf8' : (status === 'VALID' ? '#34d399' : '#fbbf24');
    ctx.lineWidth = isSelected ? 3.5 : 2.0;
    ctx.strokeRect(1, 1, 510, 1022);
  }

  const dataUrl = canvas.toDataURL('image/png');
  FACADE_TEXTURE_CACHE[cacheKey] = dataUrl;
  return dataUrl;
}

// ── Realistic Multi-Floor Interior Architecture & Corridors ───────────────────
function buildInteriorGeometry(b, viewer) {
  const entities = [];
  const floors   = (b.floors && b.floors.length > 0) ? b.floors : buildSyntheticFloors(b);
  const floorH   = 3.4;
  const { lon, lat } = b;
  const latRad   = (lat * Math.PI) / 180;
  const lonScale = 1 / Math.max(0.2, Math.cos(latRad));
  const baseScale = 0.00010 + (Math.min(b.floor_count || 10, 45) / 45) * 0.00007;
  const bW = baseScale * lonScale;
  const bD = baseScale;
  const absH = Math.abs(b.height);

  // 1. Central Elevator & Stairwell Structural Core
  const coreW = bW * 0.22;
  const coreD = bD * 0.22;
  const corePts = [
    Cartesian3.fromDegrees(lon - coreW, lat - coreD, 0),
    Cartesian3.fromDegrees(lon + coreW, lat - coreD, 0),
    Cartesian3.fromDegrees(lon + coreW, lat + coreD, 0),
    Cartesian3.fromDegrees(lon - coreW, lat + coreD, 0),
  ];
  entities.push(viewer.entities.add({
    name: `${b.name} · Structural Elevator Core`,
    polygon: {
      hierarchy: new ConstantProperty(new PolygonHierarchy(corePts)),
      height: 0,
      extrudedHeight: absH,
      heightReference: HeightReference.RELATIVE_TO_GROUND,
      extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
      material: new ColorMaterialProperty(Color.fromCssColorString('#1e293b').withAlpha(0.85)),
      outline: true,
      outlineColor: Color.fromCssColorString('#06b6d4').withAlpha(0.95),
      outlineWidth: 2.0,
      shadows: ShadowMode.DISABLED,
    },
    properties: { building_id: b.building_id },
  }));

  // 2. Ground Entrance Portal & Exterior Canopy Marquee
  const canopyW = bW * 0.40;
  const canopyD = bD * 0.25;
  const canopyPts = [
    Cartesian3.fromDegrees(lon - canopyW, lat - bD - canopyD, 0),
    Cartesian3.fromDegrees(lon + canopyW, lat - bD - canopyD, 0),
    Cartesian3.fromDegrees(lon + canopyW, lat - bD, 0),
    Cartesian3.fromDegrees(lon - canopyW, lat - bD, 0),
  ];
  entities.push(viewer.entities.add({
    name: `${b.name} · Entrance Canopy`,
    polygon: {
      hierarchy: new ConstantProperty(new PolygonHierarchy(canopyPts)),
      height: 3.5,
      extrudedHeight: 3.8,
      heightReference: HeightReference.RELATIVE_TO_GROUND,
      extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
      material: new ColorMaterialProperty(Color.fromCssColorString('#0284c7').withAlpha(0.90)),
      outline: true,
      outlineColor: Color.fromCssColorString('#38bdf8').withAlpha(1.0),
      outlineWidth: 2.0,
      shadows: ShadowMode.DISABLED,
    },
    properties: { building_id: b.building_id },
  }));

  // Ground Lobby Double Doors
  const doorW = bW * 0.20;
  const doorPts = [
    Cartesian3.fromDegrees(lon - doorW, lat - bD, 0),
    Cartesian3.fromDegrees(lon + doorW, lat - bD, 0),
    Cartesian3.fromDegrees(lon + doorW, lat - bD + 0.00001, 0),
    Cartesian3.fromDegrees(lon - doorW, lat - bD + 0.00001, 0),
  ];
  entities.push(viewer.entities.add({
    name: `${b.name} · Ground Lobby Entrance Doors`,
    polygon: {
      hierarchy: new ConstantProperty(new PolygonHierarchy(doorPts)),
      height: 0,
      extrudedHeight: 3.2,
      heightReference: HeightReference.RELATIVE_TO_GROUND,
      extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
      material: new ColorMaterialProperty(Color.fromCssColorString('#f59e0b').withAlpha(0.75)),
      outline: true,
      outlineColor: Color.fromCssColorString('#fef08a').withAlpha(1.0),
      outlineWidth: 2.5,
      shadows: ShadowMode.DISABLED,
    },
    properties: { building_id: b.building_id },
  }));

  // 3. Per-floor slabs, illuminated circulation corridors, and strata suites
  floors.forEach((f, fi) => {
    const zBase = isFinite(f.z_min) ? Math.max(0, f.z_min - (b.ground_elevation || 0)) : fi * floorH;
    const progress = fi / Math.max(floors.length - 1, 1);
    const hue = 0.50 + progress * 0.16;
    const roomFill = Color.fromHsl(hue, 0.85, 0.50).withAlpha(0.22);
    const slabFill = Color.fromCssColorString('#f8fafc').withAlpha(0.85);

    // Solid concrete floor slab (0.35m thick)
    const slabPts = [
      Cartesian3.fromDegrees(lon - bW, lat - bD, 0),
      Cartesian3.fromDegrees(lon + bW, lat - bD, 0),
      Cartesian3.fromDegrees(lon + bW, lat + bD, 0),
      Cartesian3.fromDegrees(lon - bW, lat + bD, 0),
    ];
    entities.push(viewer.entities.add({
      name: `${b.name} · Slab F${fi + 1}`,
      polygon: {
        hierarchy: new ConstantProperty(new PolygonHierarchy(slabPts)),
        height: zBase,
        extrudedHeight: zBase + 0.35,
        heightReference: HeightReference.RELATIVE_TO_GROUND,
        extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
        material: new ColorMaterialProperty(slabFill),
        outline: true,
        outlineColor: Color.fromCssColorString('#0284c7').withAlpha(0.75),
        outlineWidth: 1.2,
        shadows: ShadowMode.DISABLED,
      },
      properties: { building_id: b.building_id, floor_id: f.floor_id },
    }));

    // Central illuminated circulation corridor spine
    const corrW = bW * 0.16;
    const corrPts = [
      Cartesian3.fromDegrees(lon - corrW, lat - bD * 0.92, 0),
      Cartesian3.fromDegrees(lon + corrW, lat - bD * 0.92, 0),
      Cartesian3.fromDegrees(lon + corrW, lat + bD * 0.92, 0),
      Cartesian3.fromDegrees(lon - corrW, lat + bD * 0.92, 0),
    ];
    entities.push(viewer.entities.add({
      name: `${b.name} · Central Corridor F${fi + 1}`,
      polygon: {
        hierarchy: new ConstantProperty(new PolygonHierarchy(corrPts)),
        height: zBase + 0.35,
        extrudedHeight: zBase + floorH - 0.20,
        heightReference: HeightReference.RELATIVE_TO_GROUND,
        extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
        material: new ColorMaterialProperty(Color.fromCssColorString('#fef08a').withAlpha(0.55)),
        outline: true,
        outlineColor: Color.fromCssColorString('#f59e0b').withAlpha(0.95),
        outlineWidth: 2.0,
        shadows: ShadowMode.DISABLED,
      },
      properties: { building_id: b.building_id },
    }));

    // Cross connecting corridor
    const cCorrPts = [
      Cartesian3.fromDegrees(lon - bW * 0.92, lat - corrW * 0.85, 0),
      Cartesian3.fromDegrees(lon + bW * 0.92, lat - corrW * 0.85, 0),
      Cartesian3.fromDegrees(lon + bW * 0.92, lat + corrW * 0.85, 0),
      Cartesian3.fromDegrees(lon - bW * 0.92, lat + corrW * 0.85, 0),
    ];
    entities.push(viewer.entities.add({
      name: `${b.name} · Cross Corridor F${fi + 1}`,
      polygon: {
        hierarchy: new ConstantProperty(new PolygonHierarchy(cCorrPts)),
        height: zBase + 0.35,
        extrudedHeight: zBase + floorH - 0.20,
        heightReference: HeightReference.RELATIVE_TO_GROUND,
        extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
        material: new ColorMaterialProperty(Color.fromCssColorString('#fed7aa').withAlpha(0.45)),
        outline: true,
        outlineColor: Color.fromCssColorString('#fb923c').withAlpha(0.90),
        outlineWidth: 1.5,
        shadows: ShadowMode.DISABLED,
      },
      properties: { building_id: b.building_id },
    }));

    // ── Singapore BIM Architectural Subdivisions (CORENET X / SLA 3D Strata Cadastre) ──
    const isSgBim = b.city === 'singapore' || !!b.bim_enabled;

    if (isSgBim) {
      // 1. Structural Concrete Columns (IfcColumn) — 4 perimeter load-bearing columns
      [-0.65, 0.65].forEach(cx => {
        [-0.65, 0.65].forEach(cy => {
          const colSize = bW * 0.08;
          const colPts = [
            Cartesian3.fromDegrees(lon + cx * bW - colSize, lat + cy * bD - colSize, 0),
            Cartesian3.fromDegrees(lon + cx * bW + colSize, lat + cy * bD - colSize, 0),
            Cartesian3.fromDegrees(lon + cx * bW + colSize, lat + cy * bD + colSize, 0),
            Cartesian3.fromDegrees(lon + cx * bW - colSize, lat + cy * bD + colSize, 0),
          ];
          entities.push(viewer.entities.add({
            name: `${b.name} · Column (IfcColumn) F${fi + 1}`,
            polygon: {
              hierarchy: new ConstantProperty(new PolygonHierarchy(colPts)),
              height: zBase + 0.35,
              extrudedHeight: zBase + floorH - 0.20,
              heightReference: HeightReference.RELATIVE_TO_GROUND,
              extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
              material: new ColorMaterialProperty(Color.fromCssColorString('#334155').withAlpha(0.95)),
              outline: true,
              outlineColor: Color.fromCssColorString('#64748b').withAlpha(0.80),
              outlineWidth: 1.0,
              shadows: ShadowMode.DISABLED,
            },
            properties: { building_id: b.building_id },
          }));
        });
      });

      // 2. BIM Strata Units (IfcSpace) — 4 Quadrants per floor
      const quadrants = [
        { name: 'NW Suite · Wealth Advisory', dx: -0.55, dy:  0.48, color: '#0284c7', lot: `MK01-U${String(fi + 1).padStart(2, '0')}01A` },
        { name: 'NE Suite · Trading Floor',   dx:  0.55, dy:  0.48, color: '#10b981', lot: `MK01-U${String(fi + 1).padStart(2, '0')}02B` },
        { name: 'SW Suite · Executive Office',dx: -0.55, dy: -0.48, color: '#8b5cf6', lot: `MK01-U${String(fi + 1).padStart(2, '0')}03C` },
        { name: 'SE Suite · Client Concourse',dx:  0.55, dy: -0.48, color: '#f59e0b', lot: `MK01-U${String(fi + 1).padStart(2, '0')}04D` },
      ];

      quadrants.forEach((q) => {
        const qX = lon + q.dx * bW;
        const qY = lat + q.dy * bD;
        const qW = bW * 0.35;
        const qD = bD * 0.38;
        const qPts = [
          Cartesian3.fromDegrees(qX - qW, qY - qD, 0),
          Cartesian3.fromDegrees(qX + qW, qY - qD, 0),
          Cartesian3.fromDegrees(qX + qW, qY + qD, 0),
          Cartesian3.fromDegrees(qX - qW, qY + qD, 0),
        ];
        entities.push(viewer.entities.add({
          name: `${b.name} · ${q.name} (${q.lot})`,
          polygon: {
            hierarchy: new ConstantProperty(new PolygonHierarchy(qPts)),
            height: zBase + 0.35,
            extrudedHeight: zBase + floorH - 0.20,
            heightReference: HeightReference.RELATIVE_TO_GROUND,
            extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
            material: new ColorMaterialProperty(Color.fromCssColorString(q.color).withAlpha(0.26)),
            outline: true,
            outlineColor: Color.fromCssColorString(q.color).withAlpha(0.90),
            outlineWidth: 1.5,
            shadows: ShadowMode.DISABLED,
          },
          properties: { building_id: b.building_id, unit_id: q.lot, ifc_type: 'IfcSpace' },
        }));

        // Interior drywall partition (IfcWallStandardCase)
        const wallPts = [
          Cartesian3.fromDegrees(qX - qW * 0.95, qY, 0),
          Cartesian3.fromDegrees(qX + qW * 0.40, qY, 0), // leaves doorway opening
          Cartesian3.fromDegrees(qX + qW * 0.40, qY + 0.00001, 0),
          Cartesian3.fromDegrees(qX - qW * 0.95, qY + 0.00001, 0),
        ];
        entities.push(viewer.entities.add({
          name: `${b.name} · Internal Partition (IfcWall) ${q.lot}`,
          polygon: {
            hierarchy: new ConstantProperty(new PolygonHierarchy(wallPts)),
            height: zBase + 0.35,
            extrudedHeight: zBase + floorH - 0.20,
            heightReference: HeightReference.RELATIVE_TO_GROUND,
            extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
            material: new ColorMaterialProperty(Color.fromCssColorString('#cbd5e1').withAlpha(0.75)),
            outline: true,
            outlineColor: Color.fromCssColorString('#94a3b8').withAlpha(0.90),
            outlineWidth: 1.0,
            shadows: ShadowMode.DISABLED,
          },
          properties: { building_id: b.building_id },
        }));
      });

      // Subterranean MRT concourse connection if basement
      if (f.level_index < 0 || fi === 0) {
        const mrtPts = [
          Cartesian3.fromDegrees(lon - bW * 1.8, lat - bD * 0.4, 0),
          Cartesian3.fromDegrees(lon - bW,        lat - bD * 0.4, 0),
          Cartesian3.fromDegrees(lon - bW,        lat + bD * 0.4, 0),
          Cartesian3.fromDegrees(lon - bW * 1.8, lat + bD * 0.4, 0),
        ];
        entities.push(viewer.entities.add({
          name: `${b.name} · Downtown MRT Subterranean Pedestrian Link`,
          polygon: {
            hierarchy: new ConstantProperty(new PolygonHierarchy(mrtPts)),
            height: zBase + 0.2,
            extrudedHeight: zBase + floorH - 0.1,
            heightReference: HeightReference.RELATIVE_TO_GROUND,
            extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
            material: new ColorMaterialProperty(Color.fromCssColorString('#7c3aed').withAlpha(0.35)),
            outline: true,
            outlineColor: Color.fromCssColorString('#c084fc').withAlpha(0.95),
            outlineWidth: 2.0,
            shadows: ShadowMode.DISABLED,
          },
          properties: { building_id: b.building_id, easement: 'SLA Subterranean Transit Easement' },
        }));
      }

    } else {
      // Standard Strata partitioned office / apartment suites (General cities)
      [-1, 1].forEach((side, si) => {
        const rX = lon + side * (bW * 0.55);
        const roomPts = [
          Cartesian3.fromDegrees(rX - bW * 0.33, lat - bD * 0.90, 0),
          Cartesian3.fromDegrees(rX + bW * 0.33, lat - bD * 0.90, 0),
          Cartesian3.fromDegrees(rX + bW * 0.33, lat + bD * 0.90, 0),
          Cartesian3.fromDegrees(rX - bW * 0.33, lat + bD * 0.90, 0),
        ];
        entities.push(viewer.entities.add({
          name: `${b.name} · Strata Suite ${si === 0 ? 'West' : 'East'} F${fi + 1}`,
          polygon: {
            hierarchy: new ConstantProperty(new PolygonHierarchy(roomPts)),
            height: zBase + 0.35,
            extrudedHeight: zBase + floorH - 0.20,
            heightReference: HeightReference.RELATIVE_TO_GROUND,
            extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
            material: new ColorMaterialProperty(roomFill),
            outline: true,
            outlineColor: Color.fromCssColorString('#0284c7').withAlpha(0.70),
            outlineWidth: 1.0,
            shadows: ShadowMode.DISABLED,
          },
          properties: { building_id: b.building_id },
        }));
      });
    }

    // Floor label badge
    if (fi === 0 || fi === floors.length - 1 || fi % 4 === 0) {
      entities.push(viewer.entities.add({
        position: Cartesian3.fromDegrees(lon + bW * 1.05, lat - bD * 0.95, zBase + floorH * 0.5),
        label: {
          text: f.label || `F${fi + 1}`,
          font: '600 11px Inter, -apple-system, sans-serif',
          fillColor: Color.fromCssColorString('#38bdf8'),
          outlineColor: Color.fromCssColorString('#020617'),
          outlineWidth: 3.0,
          style: LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: VerticalOrigin.CENTER,
          horizontalOrigin: HorizontalOrigin.LEFT,
          heightReference: HeightReference.RELATIVE_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          showBackground: true,
          backgroundColor: Color.fromCssColorString('#030712').withAlpha(0.85),
          backgroundPadding: new Cartesian2(6, 3),
          translucencyByDistance: new NearFarScalar(50, 1.0, 1500, 0.0),
        },
        properties: { building_id: b.building_id },
      }));
    }
  });

  // 4. Rooftop Helipad / Mechanical Penthouse
  if (absH >= 25) {
    const padW = bW * 0.45;
    const padD = bD * 0.45;
    const padPts = [
      Cartesian3.fromDegrees(lon - padW, lat - padD, 0),
      Cartesian3.fromDegrees(lon + padW, lat - padD, 0),
      Cartesian3.fromDegrees(lon + padW, lat + padD, 0),
      Cartesian3.fromDegrees(lon - padW, lat + padD, 0),
    ];
    entities.push(viewer.entities.add({
      name: `${b.name} · Rooftop Helipad & Penthouse`,
      polygon: {
        hierarchy: new ConstantProperty(new PolygonHierarchy(padPts)),
        height: absH,
        extrudedHeight: absH + 2.5,
        heightReference: HeightReference.RELATIVE_TO_GROUND,
        extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
        material: new ColorMaterialProperty(Color.fromCssColorString('#0f172a').withAlpha(0.90)),
        outline: true,
        outlineColor: Color.fromCssColorString('#fbbf24').withAlpha(1.0),
        outlineWidth: 2.0,
        shadows: ShadowMode.DISABLED,
      },
      properties: { building_id: b.building_id },
    }));
  }

  return entities;
}

// ── Ambient Visible Floor Slabs & Corridors for All Unselected Towers ─────────
function buildAmbientFloorsAndCorridors(b, viewer) {
  const ents = [];
  const floors = (b.floors && b.floors.length > 0) ? b.floors : buildSyntheticFloors(b);
  const floorH = 3.4;
  const { lon, lat } = b;
  const latRad = (lat * Math.PI) / 180;
  const lonScale = 1 / Math.max(0.2, Math.cos(latRad));
  const baseScale = 0.00010 + (Math.min(b.floor_count || 10, 45) / 45) * 0.00007;
  const bW = baseScale * lonScale;
  const bD = baseScale;
  const absH = Math.abs(b.height);

  // Structural Core
  const coreW = bW * 0.20;
  const coreD = bD * 0.20;
  ents.push(viewer.entities.add({
    name: `${b.name} · Core`,
    polygon: {
      hierarchy: new ConstantProperty(new PolygonHierarchy([
        Cartesian3.fromDegrees(lon - coreW, lat - coreD, 0),
        Cartesian3.fromDegrees(lon + coreW, lat - coreD, 0),
        Cartesian3.fromDegrees(lon + coreW, lat + coreD, 0),
        Cartesian3.fromDegrees(lon - coreW, lat + coreD, 0),
      ])),
      height: 0,
      extrudedHeight: absH,
      heightReference: HeightReference.RELATIVE_TO_GROUND,
      extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
      material: new ColorMaterialProperty(Color.fromCssColorString('#1e293b').withAlpha(0.70)),
      outline: false,
      shadows: ShadowMode.DISABLED,
    },
    properties: { building_id: b.building_id },
  }));

  // Render floor slabs and central glowing hallways
  const step = floors.length > 25 ? 2 : 1;
  for (let fi = 0; fi < floors.length; fi += step) {
    const f = floors[fi];
    const zBase = isFinite(f.z_min) ? Math.max(0, f.z_min - (b.ground_elevation || 0)) : fi * floorH;
    ents.push(viewer.entities.add({
      name: `${b.name} · Slab F${fi + 1}`,
      polygon: {
        hierarchy: new ConstantProperty(new PolygonHierarchy([
          Cartesian3.fromDegrees(lon - bW, lat - bD, 0),
          Cartesian3.fromDegrees(lon + bW, lat - bD, 0),
          Cartesian3.fromDegrees(lon + bW, lat + bD, 0),
          Cartesian3.fromDegrees(lon - bW, lat + bD, 0),
        ])),
        height: zBase,
        extrudedHeight: zBase + 0.30,
        heightReference: HeightReference.RELATIVE_TO_GROUND,
        extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
        material: new ColorMaterialProperty(Color.fromCssColorString('#f8fafc').withAlpha(0.65)),
        outline: false,
        shadows: ShadowMode.DISABLED,
      },
      properties: { building_id: b.building_id },
    }));

    const corrW = bW * 0.14;
    ents.push(viewer.entities.add({
      name: `${b.name} · Hallway F${fi + 1}`,
      polygon: {
        hierarchy: new ConstantProperty(new PolygonHierarchy([
          Cartesian3.fromDegrees(lon - corrW, lat - bD * 0.88, 0),
          Cartesian3.fromDegrees(lon + corrW, lat - bD * 0.88, 0),
          Cartesian3.fromDegrees(lon + corrW, lat + bD * 0.88, 0),
          Cartesian3.fromDegrees(lon - corrW, lat + bD * 0.88, 0),
        ])),
        height: zBase + 0.30,
        extrudedHeight: zBase + floorH - 0.25,
        heightReference: HeightReference.RELATIVE_TO_GROUND,
        extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
        material: new ColorMaterialProperty(Color.fromCssColorString('#fef08a').withAlpha(0.35)),
        outline: false,
        shadows: ShadowMode.DISABLED,
      },
      properties: { building_id: b.building_id },
    }));
  }
  return ents;
}

// ── Per-floor BIM geometry (one floor at a time) ────────────────────────────
// Generates 3D architectural entities for a single floor: concrete slab, BIM
// strata unit partitions (IfcSpace), structural columns, corridors, and walls.
function buildSingleFloorBIM(b, f, fi, viewer) {
  const ents = [];
  const floorH = 3.4;
  const { lon, lat } = b;
  const latRad   = (lat * Math.PI) / 180;
  const lonScale = 1 / Math.max(0.2, Math.cos(latRad));
  const baseScale = 0.00010 + (Math.min(b.floor_count || 10, 45) / 45) * 0.00007;
  const bW = baseScale * lonScale;
  const bD = baseScale;

  const zBase = isFinite(f.z_min)
    ? Math.max(0, f.z_min - (b.ground_elevation || 0))
    : fi * floorH;
  const progress = fi / Math.max((b.floor_count || 10) - 1, 1);
  const hue = 0.50 + progress * 0.16;
  const slabFill = Color.fromCssColorString('#f8fafc').withAlpha(0.85);

  // Concrete floor slab (0.35m thick)
  const slabPts = [
    Cartesian3.fromDegrees(lon - bW, lat - bD, 0),
    Cartesian3.fromDegrees(lon + bW, lat - bD, 0),
    Cartesian3.fromDegrees(lon + bW, lat + bD, 0),
    Cartesian3.fromDegrees(lon - bW, lat + bD, 0),
  ];
  ents.push(viewer.entities.add({
    name: `${b.name} · Slab F${fi + 1}`,
    polygon: {
      hierarchy: new ConstantProperty(new PolygonHierarchy(slabPts)),
      height: zBase,
      extrudedHeight: zBase + 0.35,
      heightReference: HeightReference.RELATIVE_TO_GROUND,
      extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
      material: new ColorMaterialProperty(slabFill),
      outline: true,
      outlineColor: Color.fromCssColorString('#0284c7').withAlpha(0.75),
      outlineWidth: 1.2,
      shadows: ShadowMode.DISABLED,
    },
    properties: { building_id: b.building_id, bim_floor: true },
  }));

  // Central illuminated corridor
  const corrW = bW * 0.15;
  const corrPts = [
    Cartesian3.fromDegrees(lon - corrW, lat - bD * 0.92, 0),
    Cartesian3.fromDegrees(lon + corrW, lat - bD * 0.92, 0),
    Cartesian3.fromDegrees(lon + corrW, lat + bD * 0.92, 0),
    Cartesian3.fromDegrees(lon - corrW, lat + bD * 0.92, 0),
  ];
  ents.push(viewer.entities.add({
    name: `${b.name} · Corridor F${fi + 1}`,
    polygon: {
      hierarchy: new ConstantProperty(new PolygonHierarchy(corrPts)),
      height: zBase + 0.35,
      extrudedHeight: zBase + floorH - 0.20,
      heightReference: HeightReference.RELATIVE_TO_GROUND,
      extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
      material: new ColorMaterialProperty(Color.fromCssColorString('#fef08a').withAlpha(0.50)),
      outline: true,
      outlineColor: Color.fromCssColorString('#f59e0b').withAlpha(0.90),
      outlineWidth: 1.8,
      shadows: ShadowMode.DISABLED,
    },
    properties: { building_id: b.building_id, bim_floor: true },
  }));

  const isBim = b.bim_enabled || b.city === 'singapore';

  if (isBim) {
    // Structural concrete columns (IfcColumn) — 4 perimeter load-bearing columns
    [-0.65, 0.65].forEach(cx => {
      [-0.65, 0.65].forEach(cy => {
        const colSize = bW * 0.08;
        const colPts = [
          Cartesian3.fromDegrees(lon + cx * bW - colSize, lat + cy * bD - colSize, 0),
          Cartesian3.fromDegrees(lon + cx * bW + colSize, lat + cy * bD - colSize, 0),
          Cartesian3.fromDegrees(lon + cx * bW + colSize, lat + cy * bD + colSize, 0),
          Cartesian3.fromDegrees(lon + cx * bW - colSize, lat + cy * bD + colSize, 0),
        ];
        ents.push(viewer.entities.add({
          name: `${b.name} · Column (IfcColumn) F${fi + 1}`,
          polygon: {
            hierarchy: new ConstantProperty(new PolygonHierarchy(colPts)),
            height: zBase + 0.35,
            extrudedHeight: zBase + floorH - 0.20,
            heightReference: HeightReference.RELATIVE_TO_GROUND,
            extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
            material: new ColorMaterialProperty(Color.fromCssColorString('#334155').withAlpha(0.95)),
            outline: true,
            outlineColor: Color.fromCssColorString('#64748b').withAlpha(0.80),
            outlineWidth: 1.0,
            shadows: ShadowMode.DISABLED,
          },
          properties: { building_id: b.building_id, bim_floor: true },
        }));
      });
    });

    // Strata units — use units from floor data, else synthesise 4 quadrant defaults
    const units = f.strata_units && f.strata_units.length > 0
      ? f.strata_units.slice(0, 4).map((u, i) => {
          const qs = [[-0.55, 0.48], [0.55, 0.48], [-0.55, -0.48], [0.55, -0.48]];
          const cols = ['#0284c7', '#10b981', '#f59e0b', '#a855f7'];
          return { ...qs[i] ? { dx: qs[i][0], dy: qs[i][1] } : { dx: 0, dy: 0 }, color: cols[i % 4], lot: u.unit_id, name: u.name };
        })
      : [
          { dx: -0.55, dy:  0.48, color: '#0284c7', lot: `MK01-U${String(fi + 1).padStart(2, '0')}01A`, name: 'Suite A (NW)' },
          { dx:  0.55, dy:  0.48, color: '#10b981', lot: `MK01-U${String(fi + 1).padStart(2, '0')}02B`, name: 'Suite B (NE)' },
          { dx: -0.55, dy: -0.48, color: '#f59e0b', lot: `MK01-U${String(fi + 1).padStart(2, '0')}03C`, name: 'Suite C (SW)' },
          { dx:  0.55, dy: -0.48, color: '#a855f7', lot: `MK01-U${String(fi + 1).padStart(2, '0')}04D`, name: 'Suite D (SE)' },
        ];

    units.forEach(q => {
      const qW = bW * 0.42;
      const qD = bD * 0.42;
      const qX = lon + q.dx * bW * 0.52;
      const qY = lat + q.dy * bD * 0.52;
      const qPts = [
        Cartesian3.fromDegrees(qX - qW, qY - qD, 0),
        Cartesian3.fromDegrees(qX + qW, qY - qD, 0),
        Cartesian3.fromDegrees(qX + qW, qY + qD, 0),
        Cartesian3.fromDegrees(qX - qW, qY + qD, 0),
      ];
      ents.push(viewer.entities.add({
        name: `${b.name} · ${q.name} (${q.lot})`,
        polygon: {
          hierarchy: new ConstantProperty(new PolygonHierarchy(qPts)),
          height: zBase + 0.35,
          extrudedHeight: zBase + floorH - 0.20,
          heightReference: HeightReference.RELATIVE_TO_GROUND,
          extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
          material: new ColorMaterialProperty(Color.fromCssColorString(q.color).withAlpha(0.26)),
          outline: true,
          outlineColor: Color.fromCssColorString(q.color).withAlpha(0.90),
          outlineWidth: 1.5,
          shadows: ShadowMode.DISABLED,
        },
        properties: { building_id: b.building_id, unit_id: q.lot, ifc_type: 'IfcSpace', bim_floor: true },
      }));

      // Interior drywall partition (IfcWallStandardCase)
      const wallPts = [
        Cartesian3.fromDegrees(qX - qW * 0.95, qY, 0),
        Cartesian3.fromDegrees(qX + qW * 0.40, qY, 0),
        Cartesian3.fromDegrees(qX + qW * 0.40, qY + 0.00001, 0),
        Cartesian3.fromDegrees(qX - qW * 0.95, qY + 0.00001, 0),
      ];
      ents.push(viewer.entities.add({
        name: `${b.name} · Partition Wall (IfcWall) ${q.lot}`,
        polygon: {
          hierarchy: new ConstantProperty(new PolygonHierarchy(wallPts)),
          height: zBase + 0.35,
          extrudedHeight: zBase + floorH - 0.20,
          heightReference: HeightReference.RELATIVE_TO_GROUND,
          extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
          material: new ColorMaterialProperty(Color.fromCssColorString('#cbd5e1').withAlpha(0.75)),
          outline: true,
          outlineColor: Color.fromCssColorString('#94a3b8').withAlpha(0.90),
          outlineWidth: 1.0,
          shadows: ShadowMode.DISABLED,
        },
        properties: { building_id: b.building_id, bim_floor: true },
      }));
    });

    // Subterranean MRT link (basement / ground floors only)
    if (f.level_index < 0 || fi === 0) {
      const mrtPts = [
        Cartesian3.fromDegrees(lon - bW * 1.8, lat - bD * 0.4, 0),
        Cartesian3.fromDegrees(lon - bW,        lat - bD * 0.4, 0),
        Cartesian3.fromDegrees(lon - bW,        lat + bD * 0.4, 0),
        Cartesian3.fromDegrees(lon - bW * 1.8,  lat + bD * 0.4, 0),
      ];
      ents.push(viewer.entities.add({
        name: `${b.name} · Subterranean MRT Concourse Link`,
        polygon: {
          hierarchy: new ConstantProperty(new PolygonHierarchy(mrtPts)),
          height: zBase + 0.2,
          extrudedHeight: zBase + floorH - 0.1,
          heightReference: HeightReference.RELATIVE_TO_GROUND,
          extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
          material: new ColorMaterialProperty(Color.fromCssColorString('#7c3aed').withAlpha(0.35)),
          outline: true,
          outlineColor: Color.fromCssColorString('#c084fc').withAlpha(0.95),
          outlineWidth: 2.0,
          shadows: ShadowMode.DISABLED,
        },
        properties: { building_id: b.building_id, easement: 'SLA Subterranean Transit Easement', bim_floor: true },
      }));
    }
  } else {
    // Non-BIM buildings: two room suites per floor
    const roomFill = Color.fromHsl(hue, 0.85, 0.50).withAlpha(0.22);
    [-1, 1].forEach((side, si) => {
      const rX = lon + side * (bW * 0.55);
      const roomPts = [
        Cartesian3.fromDegrees(rX - bW * 0.33, lat - bD * 0.90, 0),
        Cartesian3.fromDegrees(rX + bW * 0.33, lat - bD * 0.90, 0),
        Cartesian3.fromDegrees(rX + bW * 0.33, lat + bD * 0.90, 0),
        Cartesian3.fromDegrees(rX - bW * 0.33, lat + bD * 0.90, 0),
      ];
      ents.push(viewer.entities.add({
        name: `${b.name} · Suite ${si === 0 ? 'West' : 'East'} F${fi + 1}`,
        polygon: {
          hierarchy: new ConstantProperty(new PolygonHierarchy(roomPts)),
          height: zBase + 0.35,
          extrudedHeight: zBase + floorH - 0.20,
          heightReference: HeightReference.RELATIVE_TO_GROUND,
          extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
          material: new ColorMaterialProperty(roomFill),
          outline: true,
          outlineColor: Color.fromCssColorString('#0284c7').withAlpha(0.70),
          outlineWidth: 1.0,
          shadows: ShadowMode.DISABLED,
        },
        properties: { building_id: b.building_id, bim_floor: true },
      }));
    });
  }

  // Floor label
  ents.push(viewer.entities.add({
    position: Cartesian3.fromDegrees(lon + bW * 1.05, lat - bD * 0.95, zBase + floorH * 0.5),
    label: {
      text: f.label || `F${fi + 1}`,
      font: '600 11px Inter, -apple-system, sans-serif',
      fillColor: Color.fromCssColorString('#38bdf8'),
      outlineColor: Color.fromCssColorString('#020617'),
      outlineWidth: 3.0,
      style: LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: VerticalOrigin.CENTER,
      horizontalOrigin: HorizontalOrigin.LEFT,
      heightReference: HeightReference.RELATIVE_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      showBackground: true,
      backgroundColor: Color.fromCssColorString('#030712').withAlpha(0.85),
      backgroundPadding: new Cartesian2(6, 3),
      translucencyByDistance: new NearFarScalar(50, 1.0, 1500, 0.0),
    },
    properties: { building_id: b.building_id, bim_floor: true },
  }));

  return ents;
}

export default function CesiumViewer({
  city, flyTimestamp, buildings, parcels = [], allBuildings, allParcels = [], layers, selectedBuilding, onBuildingClick, onCitySelect, explodedFloor,
  onFlyToFloorReady, interiorMode, currentFloorIdx = 0, onCameraControlsReady,
}) {
  const containerRef         = useRef(null);
  const viewerRef            = useRef(null);
  const entityMapRef         = useRef({});
  const pendingCityRef       = useRef(city);
  const targetBuildings      = (allBuildings && allBuildings.length) ? allBuildings : buildings;
  const targetParcels        = (allParcels && allParcels.length)     ? allParcels   : parcels;
  const buildingsRef         = useRef(targetBuildings);
  const tilesetRef           = useRef(null);
  const googleTilesetRef     = useRef(null);
  const interiorEntRef       = useRef([]);
  const singleFloorEntRef    = useRef([]);  // on-demand floor BIM entities (current floor only)
  const cityEntitiesRef      = useRef([]);  // all ULPIN entities for the active city view
  const tileReadyRef         = useRef(false); // true once Google 3D tiles have initially loaded
  const flyToFloorRef        = useRef(null);
  const isFlyingRef          = useRef(false);
  // ── Stable callback refs — prevent stale-closure in the one-time setup effect ──
  const onBuildingClickRef   = useRef(onBuildingClick);
  const onCitySelectRef      = useRef(onCitySelect);
  const cityRef              = useRef(city);

  useEffect(() => { buildingsRef.current      = targetBuildings; }, [targetBuildings]);
  useEffect(() => { warmBuildingTextureCache(targetBuildings);   }, [targetBuildings]);
  useEffect(() => { onBuildingClickRef.current = onBuildingClick; }, [onBuildingClick]);
  useEffect(() => { onCitySelectRef.current    = onCitySelect;    }, [onCitySelect]);
  useEffect(() => { cityRef.current            = city;            }, [city]);

  // ── Smooth Cinematic Camera Flight ─────────────────────────────────────────
  // Two-phase approach fixes "zoom out to see map" tile loading issue:
  //   Phase 1: Descend to ~2500m (medium tiles stream in fast, ~1-2s)
  //   Phase 2: Globe fires tileLoadProgressEvent → 0 tiles remaining → swoop to final viewpoint
  const flyToTarget = useCallback((targetCity) => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) {
      pendingCityRef.current = targetCity;
      return;
    }

    viewer.camera.cancelFlight();
    isFlyingRef.current = false;

    if (!targetCity) {
      isFlyingRef.current = true;
      // Space orbit view — centered over India & Asia from 12,500 km in full daylight
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(75.0, 19.0, 12500000),
        orientation: {
          heading: 0,
          pitch: CesiumMath.toRadians(-89.9),
          roll: 0,
        },
        duration: 3.8, // Smooth, silky ascent back into Earth orbit
        pitchAdjustHeight: 25000,
        easingFunction: EasingFunction.SINUSOIDAL_IN_OUT,
        complete: () => { isFlyingRef.current = false; },
        cancel:   () => { isFlyingRef.current = false; },
      });
      return;
    }

    const pos = CITY_POSITIONS[targetCity];
    if (!pos) return;

    // ── Continuous Direct Flight to City Viewpoint ────────────────────────────
    // With skipLevelOfDetail=true and cullWithChildrenBounds=false, tiles stream
    // progressively along the parabolic trajectory without needing any staging pauses.
    isFlyingRef.current = true;
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(pos.lon, pos.lat, pos.height),
      orientation: {
        heading: CesiumMath.toRadians(pos.headingDeg ?? 0),
        pitch:   CesiumMath.toRadians(pos.pitchDeg ?? -24),
        roll:    0.0,
      },
      duration: 5.5, // Brisk, cinematic, and continuous
      pitchAdjustHeight: 35000, // Smooth stratospheric arc
      easingFunction: EasingFunction.SINUSOIDAL_IN_OUT,
      complete: () => { isFlyingRef.current = false; },
      cancel:   () => { isFlyingRef.current = false; },
    });
  }, []);

  // ── First-person interior camera: fly inside building at exact floor level ──
  const flyToFloor = useCallback((building, floorIdx, floorsList) => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed() || !building) return;

    const { lon, lat } = building;
    const absH = Math.abs(building.height || 40);
    const totalFloors = floorsList?.length || building.floor_count || 10;
    const floorH = absH / Math.max(totalFloors, 1);
    const floorBase = floorsList?.[floorIdx]?.z_min
      ? Math.max(0, floorsList[floorIdx].z_min - (building.ground_elevation || 0))
      : floorIdx * floorH;

    // ── True terrain elevation at building coordinate (ellipsoid height) ────
    const carto = Cartographic.fromDegrees(lon, lat);
    let terrainElev = viewer.scene.globe.getHeight(carto);
    if (terrainElev === undefined || terrainElev === null || isNaN(terrainElev) || terrainElev < -50) {
      if (typeof building.ground_elevation === 'number' && building.ground_elevation > 0) {
        terrainElev = building.ground_elevation;
      } else if (lat > 12.5 && lat < 13.5) {
        terrainElev = 920; // Bengaluru Deccan plateau elevation
      } else if (lat > 18.5 && lat < 19.5) {
        terrainElev = 12;  // Mumbai coastal elevation
      } else if (lat > 1.1 && lat < 1.5) {
        terrainElev = 15;  // Singapore
      } else {
        terrainElev = 2;
      }
    }

    // Stand in the corridor: 1.7m above the floor slab (human eye height)
    // Terrain elevation must be added to floor elevation so camera stays above ground surface!
    const camZ = terrainElev + (building.is_underground ? -Math.abs(floorBase) : floorBase) + 1.7;

    const baseScale = 0.00010 + (Math.min(building.floor_count || 10, 45) / 45) * 0.00007;
    const bD = baseScale;

    // Position: stand at the south end of the central corridor looking north along the hallway
    const camLat = lat - bD * 0.45;

    viewer.camera.cancelFlight();
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(lon, camLat, camZ),
      orientation: {
        // Look straight along the corridor axis (+lat direction = north)
        heading: CesiumMath.toRadians(0),
        pitch:   CesiumMath.toRadians(-2),  // Human eye level looking straight forward down the hallway
        roll:    0,
      },
      duration: 1.8,
      easingFunction: EasingFunction.SINUSOIDAL_IN_OUT,
    });
  }, []);

  // Expose flyToFloor via callback so App.jsx can trigger it
  useEffect(() => {
    flyToFloorRef.current = flyToFloor;
    if (onFlyToFloorReady) onFlyToFloorReady(flyToFloor);
  }, [flyToFloor, onFlyToFloorReady]);

  // ── Camera Zoom and Reset controls for Workbench Cockpit ────────────────────
  const handleZoomIn = useCallback(() => {
    const v = viewerRef.current;
    if (!v || v.isDestroyed()) return;
    const h = v.camera.positionCartographic?.height || 10000;
    v.camera.zoomIn(Math.max(50, h * 0.35));
  }, []);

  const handleZoomOut = useCallback(() => {
    const v = viewerRef.current;
    if (!v || v.isDestroyed()) return;
    const h = v.camera.positionCartographic?.height || 10000;
    v.camera.zoomOut(Math.max(50, h * 0.45));
  }, []);

  const handleResetCamera = useCallback(() => {
    const v = viewerRef.current;
    if (!v || v.isDestroyed()) return;
    flyToTarget(cityRef.current);
  }, [flyToTarget]);

  const handleFlyToCoords = useCallback(({ lon, lat, height = 500, pitch = -35, heading = 0 }) => {
    const v = viewerRef.current;
    if (!v || v.isDestroyed()) return;
    v.camera.flyTo({
      destination: Cartesian3.fromDegrees(lon, lat, height),
      orientation: {
        heading: CesiumMath.toRadians(heading),
        pitch: CesiumMath.toRadians(pitch),
        roll: 0.0,
      },
      duration: 4.8,
      easingFunction: EasingFunction.SINUSOIDAL_IN_OUT,
    });
  }, []);

  useEffect(() => {
    if (onCameraControlsReady) {
      onCameraControlsReady({
        zoomIn: handleZoomIn,
        zoomOut: handleZoomOut,
        resetCamera: handleResetCamera,
        flyToCoords: handleFlyToCoords,
      });
    }
  }, [handleZoomIn, handleZoomOut, handleResetCamera, handleFlyToCoords, onCameraControlsReady]);

  // ── Initialize Cesium Viewer once on mount ──────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    // High-resolution photorealistic satellite imagery directly from Cesium Ion
    const baseLayer = ImageryLayer.fromWorldImagery({
      style: IonWorldImageryStyle.AERIAL,
    });

    // 3D elevation terrain with realistic water masking & normals
    const terrain = Terrain.fromWorldTerrain({
      requestWaterMask: true,
      requestVertexNormals: true,
    });

    const viewer = new Viewer(containerRef.current, {
      animation:            false,
      baseLayerPicker:      false,
      fullscreenButton:     false,
      geocoder:             false,
      homeButton:           false,
      infoBox:              false,
      navigationHelpButton: false,
      sceneModePicker:      false,
      selectionIndicator:   false,
      timeline:             false,
      shadows:              false,
      creditContainer:      document.createElement('div'),
      baseLayer,
      terrain,
      contextOptions: {
        webgl: {
          antialias:                 true,
          powerPreference:           'high-performance',
          preserveDrawingBuffer:     true,
        },
      },
    });

    viewerRef.current = viewer;

    // Preemptively pre-warm elevation and satellite tiles for Bengaluru, Mumbai, Rotterdam, Singapore
    preloadPilotCities(viewer, baseLayer);

    // ── Native 1:1 Hardware Pixel Resolution & Razor-Sharp Imagery ───────────
    viewer.useBrowserRecommendedResolution = false;
    viewer.resolutionScale = 1.0; // 1.0 guarantees locked 60fps without high-DPI GPU frame drops
    viewer.scene.highDynamicRange = false;

    // Enable maximum hardware anisotropic filtering for razor-sharp curvature
    try {
      if (viewer.scene?.context?.maximumTextureFilterAnisotropy) {
        baseLayer.maximumAnisotropy = Math.min(16, viewer.scene.context.maximumTextureFilterAnisotropy);
      }
    } catch {}

    if (viewer.scene.postProcessStages?.fxaa) {
      viewer.scene.postProcessStages.fxaa.enabled = true;
    }
    if (viewer.scene.postProcessStages?.bloom) {
      viewer.scene.postProcessStages.bloom.enabled = false;
    }
    if (viewer.scene.postProcessStages?.ambientOcclusion) {
      viewer.scene.postProcessStages.ambientOcclusion.enabled = false;
    }

    // ── Camera controller: Silky-Smooth Navigation & Zooming ────────────────
    const ctrl = viewer.scene.screenSpaceCameraController;
    if (ctrl) {
      ctrl.enableCollisionDetection = false; // Turn off expensive terrain collision raycasts during camera movement
      ctrl.maximumMovementRatio = 0.0;  // 0.0 = no limit (Cesium standard: unclamped 1:1 fluid tracking)
      ctrl.inertiaSpin          = 0.92; // Natural, responsive momentum glide
      ctrl.inertiaTranslate     = 0.90;
      ctrl.inertiaZoom          = 0.86; // Natural wheel damping
      ctrl.zoomFactor           = 3.0;  // Controlled, silky-smooth zoom speed
      ctrl.minimumZoomDistance  = 0.5;  // Allow camera inside buildings (eye level)
      ctrl.maximumZoomDistance  = 35000000;
      ctrl.bounceAnimationTime  = 1.0;
    }

    // ── Globe Settings: Maximum Sharpness, Vibrant True Color & Instant LODs ──
    const globe = viewer.scene.globe;
    globe.baseColor                 = Color.fromCssColorString('#071326'); // Deep navy ocean base
    globe.preloadAncestors          = true;
    globe.preloadSiblings           = true;
    globe.tileCacheSize             = 5000; // Optimal cache for instant high-detail tile paging
    globe.loadingDescendantLimit    = 20;   // Prevents tile queue congestion during rapid rotation
    globe.maximumScreenSpaceError   = 2.0;  // Standard optimal SSE for fluid 60fps globe rotation and instant imagery
    globe.depthTestAgainstTerrain   = false;
    // Keep Earth 100% brightly illuminated with authentic satellite daylight everywhere
    globe.enableLighting            = false;
    globe.showGroundAtmosphere      = true;  // Natural atmospheric limb haze

    if (viewer.scene.skyAtmosphere) {
      viewer.scene.skyAtmosphere.show = true; // Luminous atmospheric rim
      viewer.scene.skyAtmosphere.brightnessShift = 0.10;
      viewer.scene.skyAtmosphere.saturationShift = 0.20;
    }

    // ── Ambient Globe Auto-Rotation in Space Orbit ────────────────────────────
    // In Earth space orbit (!city), smoothly rotate the globe when idle.
    // Seamlessly pauses the instant user interacts (drag/wheel/touch) or enters a city.
    let lastSpinTime = performance.now();
    let isUserInteracting = false;
    let isDragging = false;
    let resumeTimer = null;

    const startInteraction = () => {
      isDragging = true;
      isUserInteracting = true;
      if (resumeTimer) clearTimeout(resumeTimer);
    };

    const stopInteraction = () => {
      isDragging = false;
      isUserInteracting = false;
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        isUserInteracting = false;
        lastSpinTime = performance.now();
      }, 1800);
    };

    const onWheel = () => {
      isUserInteracting = true;
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        isUserInteracting = false;
        lastSpinTime = performance.now();
      }, 1800);
    };

    const canvas = viewer.canvas;
    canvas.addEventListener('pointerdown', startInteraction, { passive: true });
    canvas.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('pointerup', stopInteraction, { passive: true });

    const removePreRender = viewer.scene.preRender.addEventListener(() => {
      const now = performance.now();
      const dt = Math.min((now - lastSpinTime) / 1000, 0.1);
      lastSpinTime = now;

      // Only auto-spin when:
      // 1. No city is active (space orbit mode)
      // 2. User is not currently dragging/zooming (idle)
      // 3. Camera is high in space (> 2,500,000 meters)
      // 4. No camera flight is in progress
      if (
        !cityRef.current &&
        !isDragging &&
        !isUserInteracting &&
        !isFlyingRef.current &&
        viewer.camera.positionCartographic?.height > 2500000
      ) {
        // Serene, silky-smooth orbital rotation (approx 0.045 deg/sec)
        const spinAngle = 0.0008 * dt;
        viewer.scene.camera.rotate(Cartesian3.UNIT_Z, -spinAngle);
      }
    });

    let isCancelled = false;

    // ── Google Photorealistic 3D Tiles (Supreme Fidelity, Zero-Hole Streaming) ───
    async function initGoogle3DTiles() {
      try {
        let googleTileset;
        try {
          googleTileset = await createGooglePhotorealistic3DTileset({
            onlyUsingWithGoogleGeocoder: true,
          });
        } catch (initialErr) {
          // If Cesium module cache hit "The Resource is already being fetched", create from cloned IonResource
          const ionRes = await IonResource.fromAssetId(2275207);
          googleTileset = await Cesium3DTileset.fromUrl(ionRes.clone());
        }
        if (isCancelled || viewer.isDestroyed() || !googleTileset) return;

        // Optimal 3D Tiles configuration eliminating "zoom out to load" starvation
        googleTileset.maximumScreenSpaceError   = 16;   // Cesium standard: parent tiles render immediately, no holes
        googleTileset.skipLevelOfDetail         = true; // Skip intermediate levels directly to target detail
        googleTileset.baseScreenSpaceError      = 1024;
        googleTileset.skipScreenSpaceErrorFactor= 16;
        googleTileset.skipLevels                = 1;
        googleTileset.loadSiblings              = true;
        googleTileset.cullWithChildrenBounds    = false; // NEVER cull parent tile before high-res child arrives!
        googleTileset.preloadWhenHidden         = true;
        googleTileset.preloadFlightCamera       = true;
        googleTileset.dynamicScreenSpaceError   = true;
        googleTileset.dynamicScreenSpaceErrorDensity = 0.00278;
        googleTileset.dynamicScreenSpaceErrorFactor = 4.0;
        googleTileset.cacheBytes                = 536870912;  // 512 MB
        googleTileset.maximumCacheOverflowBytes = 1610612736; // 1.5 GB overflow

        viewer.scene.primitives.add(googleTileset);
        googleTilesetRef.current = googleTileset;
        googleTileset.show = layers.google3d ?? true;
        tileReadyRef.current = true;

        // ── Reveal ULPIN entities once the first batch of map tiles are visible ──
        // initialTilesLoaded fires when the visible-area tiles reach their
        // intended LOD for the first time — the map looks "real" at that point.
        googleTileset.initialTilesLoaded.addEventListener(() => {
          if (tileReadyRef.current) return; // already revealed
          tileReadyRef.current = true;

          // Smooth fade-in over ~600ms using postRender
          const startTime = Date.now();
          const fadeDuration = 600;
          const removeListener = viewer.scene.postRender.addEventListener(() => {
            if (viewer.isDestroyed()) { removeListener(); return; }
            const t = Math.min((Date.now() - startTime) / fadeDuration, 1.0);
            // Drive entity collection alpha via scene transparency override
            // The simplest approach: just show entities (they were already created)
            cityEntitiesRef.current.forEach(e => {
              if (e && !e.isDestroyed?.()) e.show = true;
            });
            if (t >= 1.0) removeListener();
          });
        });
      } catch (err) {
        console.warn('Google 3D Tiles init:', err?.message);
        // Fallback: show entities immediately if Google tiles fail to load
        tileReadyRef.current = true;
        cityEntitiesRef.current.forEach(e => {
          if (e && !e.isDestroyed?.()) e.show = true;
        });
      }
    }
    initGoogle3DTiles();

    // ── 3D Architectural Buildings Layer (OSM) ──────────────────────────────
    async function init3DBuildings() {
      try {
        const osmTileset = await createOsmBuildingsAsync({
          defaultColor: Color.fromCssColorString('#ded8c4'),
        });
        if (isCancelled || viewer.isDestroyed() || !osmTileset) return;

        osmTileset.maximumScreenSpaceError = 16; // Standard optimal SSE: renders instantly without holes
        osmTileset.skipLevelOfDetail = true;
        osmTileset.maximumMemoryUsage = 2048;
        viewer.scene.primitives.add(osmTileset);
        tilesetRef.current = osmTileset;
        osmTileset.show = layers.tileset3d ?? true;
      } catch (err) {
        console.warn('OSM Buildings init:', err?.message);
      }
    }
    init3DBuildings();

    // ── Click & Hover handlers for buildings & city pins ───────────────────
    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((movement) => {
      const picked = viewer.scene.pick(movement.position);

      // 1. City globe pin
      const cityPin = picked?.id?.properties?.city_pin?.getValue?.();
      if (cityPin && onCitySelectRef.current) { onCitySelectRef.current(cityPin); return; }

      // 2. Our ULPIN entity — always read from ref so we always have the latest callback
      const bid = picked?.id?.properties?.building_id?.getValue?.();
      if (bid) { onBuildingClickRef.current(bid); return; }

      // 3. OSM or Google 3D Tileset building feature — match to nearest ULPIN building
      const isTilesetFeature = picked?.primitive === tilesetRef.current ||
        picked?.primitive === googleTilesetRef.current ||
        (picked?.content && (picked?.tileset === tilesetRef.current || picked?.tileset === googleTilesetRef.current));
      if (isTilesetFeature || picked?.tileset) {
        try {
          const cartesian = viewer.scene.pickPosition(movement.position);
          if (cartesian) {
            const carto = Cartographic.fromCartesian(cartesian);
            const clickLon = CesiumMath.toDegrees(carto.longitude);
            const clickLat = CesiumMath.toDegrees(carto.latitude);

            // Find nearest ULPIN building within 120m of click
            if (buildingsRef.current?.length) {
              let nearest = null, nearestDist = Infinity;
              buildingsRef.current.forEach(b => {
                const dLon = (b.lon - clickLon) * 111000 * Math.cos((b.lat * Math.PI) / 180);
                const dLat = (b.lat - clickLat) * 111000;
                const dist = Math.sqrt(dLon * dLon + dLat * dLat);
                if (dist < nearestDist) { nearestDist = dist; nearest = b; }
              });
              if (nearest && nearestDist < 120) { onBuildingClickRef.current(nearest.building_id); return; }
            }

            // No ULPIN match — synthesize a virtual building from the OSM feature
            const estH = picked?.getProperty?.('cesium#estimatedHeight');
            const levels = picked?.getProperty?.('building:levels');
            const osmH = estH ? Number(estH) : (levels ? Number(levels) * 3.5 : 24);
            const virtualBuilding = {
              building_id: `osm_${clickLon.toFixed(5)}_${clickLat.toFixed(5)}`,
              name: picked?.getProperty?.('name') ?? 'OSM Building',
              city: cityRef.current ?? 'unknown',
              lon: clickLon, lat: clickLat,
              height: osmH,
              floor_count: Math.max(1, Math.round(osmH / 3.4)),
              ground_elevation: 0,
              roof_elevation: osmH,
              source: 'OpenStreetMap 3D Tileset (Cesium Ion)',
              data_label: 'DERIVED',
              validation_status: 'VALID',
              floors: [],
              validation_checks: [
                { id: 'geom-valid', label: 'Geometry Valid (OSM)',    status: 'VALID' },
                { id: 'z-range',    label: 'Vertical Range Estimate', status: 'REVIEW' },
              ],
            };
            // Pass virtual building directly so App.jsx can display it without a state lookup
            onBuildingClickRef.current(virtualBuilding.building_id, virtualBuilding);
            return;
          }
        } catch {}
      }

      // 4. Fallback: position-based proximity search (wider 80m radius)
      try {
        const cartesian = viewer.scene.pickPosition(movement.position);
        if (cartesian && buildingsRef.current?.length) {
          const carto = Cartographic.fromCartesian(cartesian);
          const clickLon = CesiumMath.toDegrees(carto.longitude);
          const clickLat = CesiumMath.toDegrees(carto.latitude);
          let nearest = null, nearestDist = Infinity;
          buildingsRef.current.forEach(b => {
            const dLon = (b.lon - clickLon) * 111000 * Math.cos((b.lat * Math.PI) / 180);
            const dLat = (b.lat - clickLat) * 111000;
            const dist = Math.sqrt(dLon * dLon + dLat * dLat);
            if (dist < nearestDist) { nearestDist = dist; nearest = b; }
          });
          if (nearest && nearestDist < 80) { onBuildingClickRef.current(nearest.building_id); return; }
        }
      } catch {}

      onBuildingClickRef.current(null);
    }, ScreenSpaceEventType.LEFT_CLICK);

    // Sync Cesium screen space event handler directly to start/stop interaction
    handler.setInputAction(startInteraction, ScreenSpaceEventType.LEFT_DOWN);
    handler.setInputAction(stopInteraction, ScreenSpaceEventType.LEFT_UP);
    handler.setInputAction(startInteraction, ScreenSpaceEventType.RIGHT_DOWN);
    handler.setInputAction(stopInteraction, ScreenSpaceEventType.RIGHT_UP);
    handler.setInputAction(startInteraction, ScreenSpaceEventType.MIDDLE_DOWN);
    handler.setInputAction(stopInteraction, ScreenSpaceEventType.MIDDLE_UP);

    // ── Ultra-Smooth MOUSE_MOVE: NEVER run scene.pick while dragging! ────────
    let hoverRaf = null;
    handler.setInputAction((movement) => {
      // While dragging the camera/globe, NEVER run scene.pick!
      // This completely eliminates the synchronous WebGL readPixels GPU pipeline stall during movement.
      if (isDragging) return;

      if (hoverRaf) return;
      hoverRaf = requestAnimationFrame(() => {
        hoverRaf = null;
        if (viewer.isDestroyed() || isDragging) return;

        // In global orbit mode: only check pilot pins (fast entity pick, no heavy tileset pass)
        if (!cityRef.current) {
          try {
            const picked = viewer.scene.pick(movement.endPosition, 5, 5);
            const cityPin = picked?.id?.properties?.city_pin?.getValue?.();
            viewer.scene.canvas.style.cursor = cityPin ? 'pointer' : 'default';
          } catch {}
          return;
        }

        // Inside city view: check for building / tileset hover
        try {
          const picked = viewer.scene.pick(movement.endPosition);
          const bid = picked?.id?.properties?.building_id?.getValue?.();
          const cityPin = picked?.id?.properties?.city_pin?.getValue?.();
          const isTilesetHit = !!picked?.tileset || picked?.primitive === tilesetRef.current || picked?.primitive === googleTilesetRef.current;
          viewer.scene.canvas.style.cursor = (bid || cityPin || isTilesetHit) ? 'pointer' : 'default';
        } catch {}
      });
    }, ScreenSpaceEventType.MOUSE_MOVE);

    if (pendingCityRef.current) {
      flyToTarget(pendingCityRef.current);
    } else {
      // Immediately initialize camera at full Earth space orbit view centered over India
      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(75.0, 19.0, 12500000),
        orientation: {
          heading: 0,
          pitch: CesiumMath.toRadians(-89.9),
          roll: 0,
        },
      });
    }

    return () => {
      isCancelled = true;
      if (resumeTimer) clearTimeout(resumeTimer);
      if (hoverRaf) cancelAnimationFrame(hoverRaf);
      canvas.removeEventListener('pointerdown', startInteraction);
      canvas.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointerup', stopInteraction);
      try { removePreRender(); } catch {}
      handler.destroy();
      viewerRef.current?.destroy();
      viewerRef.current = null;
      tilesetRef.current = null;
      googleTilesetRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Trigger flight when city or flyTimestamp changes ──────────────────────
  useEffect(() => {
    flyToTarget(city);
  }, [city, flyTimestamp, flyToTarget]);

  // ── Reactive toggle for 3D tileset layers ──────────────────────────────────
  useEffect(() => {
    if (tilesetRef.current) {
      tilesetRef.current.show = layers.tileset3d ?? true;
    }
  }, [layers.tileset3d]);

  useEffect(() => {
    if (googleTilesetRef.current) {
      googleTilesetRef.current.show = layers.google3d ?? true;
    }
  }, [layers.google3d]);

  // ── Interior mode: hide exterior building meshes so interior geometry is visible ──
  // When walking inside, exterior solid meshes block the camera. We hide them and
  // rely on our procedural floor slabs + corridor geometry instead.
  useEffect(() => {
    if (interiorMode) {
      if (tilesetRef.current) tilesetRef.current.show = false;
      if (googleTilesetRef.current) googleTilesetRef.current.show = false;
    } else {
      if (tilesetRef.current) tilesetRef.current.show = layers.tileset3d ?? true;
      if (googleTilesetRef.current) googleTilesetRef.current.show = layers.google3d ?? true;
    }
  }, [interiorMode, layers.tileset3d, layers.google3d]);

  // ── Render / update parcel boundaries & building entities ─────────────────
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    viewer.entities.removeAll();
    interiorEntRef.current = [];
    entityMapRef.current = {};

    // 1. Render interactive 3D pilot pins on Earth for all 4 pilot cities
    PILOT_PINS.forEach(pin => {
      const isCurrentCity = city === pin.id;
      viewer.entities.add({
        position: Cartesian3.fromDegrees(pin.lon, pin.lat, 25000),
        point: {
          pixelSize: 8,
          color: Color.fromCssColorString(pin.color),
          outlineColor: Color.WHITE,
          outlineWidth: 2.0,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          show: !isCurrentCity,
        },
        label: {
          text: `${pin.flag} ${pin.name}`,
          font: '600 11px Inter, system-ui, sans-serif',
          fillColor: Color.WHITE,
          outlineColor: Color.fromCssColorString('#020617'),
          outlineWidth: 3.0,
          style: LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: VerticalOrigin.BOTTOM,
          horizontalOrigin: HorizontalOrigin.CENTER,
          pixelOffset: new Cartesian2(0, -10),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          showBackground: false,
          show: !isCurrentCity,
        },
        properties: { city_pin: pin.id },
      });
    });

    // 2. Render Cadastral Parcels (Crisp amber cadastral plots across all real Earth pilot cities)
    if (layers.parcels && targetParcels?.length) {
      targetParcels
        .filter(p => p.city !== 'simulation' && p.city !== 'simcity')
        .forEach(p => {
          if (!p.coordinates || p.coordinates.length < 3) return;
          const validCoords = p.coordinates.every(([lon, lat]) => (
            typeof lon === 'number' && typeof lat === 'number' &&
            lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90
          ));
          if (!validCoords) return;

          const coords = p.coordinates.map(([lon, lat]) => Cartesian3.fromDegrees(lon, lat, 0));
          viewer.entities.add({
            name: `Parcel: ${p.parcel_id}`,
            polygon: {
              hierarchy: new ConstantProperty(new PolygonHierarchy(coords)),
              classificationType: ClassificationType.BOTH,
              material: new ColorMaterialProperty(Color.fromCssColorString('#f59e0b').withAlpha(0.16)),
              outline: false,
              shadows: ShadowMode.DISABLED,
            },
            properties: { parcel_id: p.parcel_id }
          });
        });
    }

    // 3. Render Buildings & 3D Cadastral Envelopes across all real Earth pilot cities
    if (targetBuildings?.length) {
      targetBuildings
        .filter(b => b.city !== 'simulation' && b.city !== 'simcity')
        .forEach(b => {
          const isUnderground = !!b.is_underground;
          const isSelected    = selectedBuilding?.building_id === b.building_id;

        if (!layers.buildings   && !isUnderground) return;
        if (!layers.underground && isUnderground)  return;

        const absH = Math.abs(b.height);

        // Color selection
        let fillColor, outlineCol;
        if (isSelected) {
          fillColor  = isUnderground ? SELECTED_UG_COLOR : SELECTED_COLOR;
          outlineCol = isUnderground
            ? Color.fromCssColorString('#c084fc').withAlpha(1.0)
            : SELECTED_OUTLINE;
        } else {
          fillColor  = isUnderground
            ? UNDERGROUND_COLOR
            : (STATUS_COLORS[b.validation_status] ?? STATUS_COLORS.REVIEW);
          outlineCol = isUnderground
            ? Color.fromCssColorString('#a855f7').withAlpha(0.70)
            : (STATUS_OUTLINE_COLORS[b.validation_status] ?? STATUS_OUTLINE_COLORS.REVIEW);
        }

        const footprint = buildingFootprint(b);

        // Ground Footprint Anchor Ring (anchored onto the cadastral parcel)
        viewer.entities.add({
          name: `Footprint: ${b.name}`,
          polygon: {
            hierarchy:       new ConstantProperty(new PolygonHierarchy(footprint)),
            classificationType: ClassificationType.BOTH,
            material:        new ColorMaterialProperty(
              isSelected
                ? Color.fromCssColorString('#00d4ff').withAlpha(0.25)
                : fillColor.withAlpha(0.10)
            ),
            outline:         false,
            shadows:         ShadowMode.DISABLED,
          },
          properties: { building_id: b.building_id },
        });

        // ── Envelope & Floor Strata for SELECTED building ───────────────────
        if (isSelected) {
          // Solid glowing exterior shell — visible from outside even in interior mode
          // This ensures the building always looks like a real rigid structure with neon outline
          const facadeAlpha = interiorMode ? 0.15 : 0.88;
          viewer.entities.add({
            name: `${b.name} · Selected Envelope`,
            polygon: {
              hierarchy:               new ConstantProperty(new PolygonHierarchy(footprint)),
              extrudedHeight:          isUnderground ? 0 : absH,
              height:                  isUnderground ? -absH : 0,
              heightReference:         isUnderground ? HeightReference.RELATIVE_TO_GROUND : HeightReference.CLAMP_TO_GROUND,
              extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
              material:                new ColorMaterialProperty(
                isUnderground
                  ? SELECTED_UG_COLOR
                  : Color.fromCssColorString('#042840').withAlpha(facadeAlpha)
              ),
              outline:                 true,
              outlineColor:            SELECTED_OUTLINE,
              outlineWidth:            interiorMode ? 1.5 : 3.5,
              shadows:                 ShadowMode.DISABLED,
              closeTop:                true,
              closeBottom:             true,
            },
            position: Cartesian3.fromDegrees(b.lon, b.lat, isUnderground ? -absH / 2 : absH / 2),
            properties: { building_id: b.building_id },
          });

          // Floor slab bands on selected building (bright cyan lines every N floors)
          if (!interiorMode && layers.volumes) {
            const totalFloors = b.floor_count || Math.round(absH / 3.4);
            const slabStep = Math.max(1, Math.ceil(totalFloors / 12));
            for (let fi = 0; fi <= totalFloors; fi += slabStep) {
              const zBase = (fi / totalFloors) * absH;
              viewer.entities.add({
                polygon: {
                  hierarchy:               new ConstantProperty(new PolygonHierarchy(footprint)),
                  height:                  zBase,
                  extrudedHeight:          zBase + 0.45,
                  heightReference:         HeightReference.CLAMP_TO_GROUND,
                  extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
                  material:                new ColorMaterialProperty(SELECTED_OUTLINE.withAlpha(0.85)),
                  outline:                 false,
                  shadows:                 ShadowMode.DISABLED,
                },
                properties: { building_id: b.building_id },
              });
            }
          }

        } else if (layers.volumes && b.floors && b.floors.length > 1 && explodedFloor) {
          // Exploded floor view for specific exploded floor
          b.floors.forEach((f, fi) => {
            const isExploded = explodedFloor === f.floor_id;
            const fH         = Math.max(3.2, f.z_max - f.z_min);
            const gap        = isExploded ? 18 : 0;
            const baseRel    = isUnderground ? f.z_min : Math.max(0, f.z_min - b.ground_elevation);
            const fBase      = baseRel + gap;
            const ratio      = fi / Math.max(b.floors.length - 1, 1);
            const floorFill  = isExploded
              ? Color.fromCssColorString('#00e5ff').withAlpha(0.90)
              : Color.fromHsl(0.50 + ratio * 0.15, 0.90, 0.35).withAlpha(0.75);

            viewer.entities.add({
              name: `${b.name} — ${f.label}`,
              polygon: {
                hierarchy:               new ConstantProperty(new PolygonHierarchy(footprint)),
                extrudedHeight:          fBase + fH,
                height:                  fBase,
                heightReference:         HeightReference.RELATIVE_TO_GROUND,
                extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
                material:                new ColorMaterialProperty(floorFill),
                outline:                 true,
                outlineColor:            isExploded ? Color.WHITE : outlineCol,
                outlineWidth:            isExploded ? 3.0 : 1.5,
                shadows:                 ShadowMode.DISABLED,
              },
              properties: { building_id: b.building_id, floor_id: f.floor_id },
            });
          });
        } else {
          // ── Normal cadastral sheath: solid rigid structure + neon glow + floor bands ──
          viewer.entities.add({
            name: b.name,
            polygon: {
              hierarchy:               new ConstantProperty(new PolygonHierarchy(footprint)),
              extrudedHeight:          isUnderground ? 0 : absH,
              height:                  isUnderground ? -absH : 0,
              heightReference:         isUnderground ? HeightReference.RELATIVE_TO_GROUND : HeightReference.CLAMP_TO_GROUND,
              extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
              material:                new ColorMaterialProperty(fillColor),
              outline:                 false,
              shadows:                 ShadowMode.DISABLED,
              closeTop:                true,
              closeBottom:             true,
            },
            position: Cartesian3.fromDegrees(b.lon, b.lat, isUnderground ? -absH / 2 : absH / 2),
            properties: { building_id: b.building_id },
          });

          // Floor slab bands — horizontal glowing lines showing cadastral floor layers from outside
          if (layers.volumes && !isUnderground) {
            const totalFloors = b.floor_count || Math.round(absH / 3.4);
            // Show up to 10 bands for distant view, more for taller buildings
            const maxBands = Math.min(totalFloors, absH > 150 ? 14 : 8);
            const slabStep = Math.max(1, Math.ceil(totalFloors / maxBands));
            for (let fi = slabStep; fi < totalFloors; fi += slabStep) {
              const zBase = (fi / totalFloors) * absH;
              viewer.entities.add({
                polygon: {
                  hierarchy:               new ConstantProperty(new PolygonHierarchy(footprint)),
                  height:                  zBase,
                  extrudedHeight:          zBase + 0.40,
                  heightReference:         HeightReference.CLAMP_TO_GROUND,
                  extrudedHeightReference: HeightReference.RELATIVE_TO_GROUND,
                  material:                new ColorMaterialProperty(outlineCol.withAlpha(0.70)),
                  outline:                 false,
                  shadows:                 ShadowMode.DISABLED,
                },
                properties: { building_id: b.building_id },
              });
            }
          }
        }

        // ── Floating Datum Hologram Label ────────────────────────────────────
        const isKeyBuilding   = b.floor_count >= 24 || absH >= 85;
        const shouldShowLabel = (isSelected || isKeyBuilding) && !interiorMode;
        if (shouldShowLabel && layers.buildings) {
          const labelHeight = isUnderground ? 6 : absH + 10;
          const statusBadge = b.validation_status === 'VALID' ? '✓' : '⚠';
          const labelText = isSelected
            ? `${b.name}\n${isUnderground ? `Subsurface · -${absH.toFixed(0)}m` : `↑ ${absH.toFixed(0)}m · ${b.floor_count}F · ${statusBadge} ${b.validation_status}`}`
            : `${b.name} (${absH.toFixed(0)}m)`;

          viewer.entities.add({
            position: Cartesian3.fromDegrees(b.lon, b.lat, labelHeight),
            label: {
              text:          labelText,
              font:          isSelected ? '600 13px Inter, -apple-system, sans-serif' : '500 11px Inter, -apple-system, sans-serif',
              fillColor:     isSelected
                ? Color.fromCssColorString('#00e5ff')
                : Color.fromCssColorString('#f8fafc'),
              outlineColor:  Color.fromCssColorString('#020617'),
              outlineWidth:  isSelected ? 3.5 : 2.5,
              style:         LabelStyle.FILL_AND_OUTLINE,
              verticalOrigin:   VerticalOrigin.BOTTOM,
              horizontalOrigin: HorizontalOrigin.CENTER,
              pixelOffset:      new Cartesian2(0, -8),
              heightReference:  HeightReference.RELATIVE_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              showBackground:  true,
              backgroundColor: isSelected
                ? Color.fromCssColorString('#020617').withAlpha(0.85)
                : Color.fromCssColorString('#020617').withAlpha(0.65),
              backgroundPadding: new Cartesian2(isSelected ? 10 : 7, isSelected ? 6 : 4),
              translucencyByDistance: new NearFarScalar(300, 1.0, 7500, isSelected ? 0.8 : 0.0),
            },
            properties: { building_id: b.building_id },
          });
        }

        entityMapRef.current[b.building_id] = b.building_id;
      });
    }
  }, [city, targetBuildings, targetParcels, layers, selectedBuilding, explodedFloor, interiorMode]);

  // ── Show entities: if tiles already cached/ready → immediately, else wait for initialTilesLoaded
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;

    // Collect all non-singleFloor entities added in this render cycle
    // We track by snapshot: anything in entities that isn't a singleFloor entity
    const all = [];
    viewer.entities.values.forEach(e => {
      const isBimFloor = e.properties?.bim_floor?.getValue?.();
      if (!isBimFloor) all.push(e);
    });
    cityEntitiesRef.current = all;

    // All entities (cadastral parcels, 3D extruded building envelopes, neon outlines, and floating datum tags)
    // are displayed immediately with 100% visibility — never hidden waiting for external network events!
    all.forEach(e => { if (e && !e.isDestroyed?.()) e.show = true; });
    tileReadyRef.current = true;
  }, [city, targetBuildings, targetParcels, layers, selectedBuilding, explodedFloor, interiorMode]);

  // ── On-demand single-floor BIM geometry ──────────────────────────────────
  // When in interior mode, renders only the current floor's full 3D BIM
  // architecture — slabs, IfcSpace partitions, columns, corridors — and
  // swaps it out whenever the user navigates to a different floor.
  // This keeps GPU entity count constant regardless of total floor count.
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;

    // Remove previous single-floor entities
    singleFloorEntRef.current.forEach(e => {
      try { viewer.entities.remove(e); } catch (_) {}
    });
    singleFloorEntRef.current = [];

    if (!interiorMode || !selectedBuilding) return;

    // Build the full synthesised floor list (same as InteriorWalkthrough)
    const allFloors = buildFullFloorList(selectedBuilding);
    const clampedIdx = Math.min(Math.max(currentFloorIdx ?? 0, 0), allFloors.length - 1);
    const floorData  = allFloors[clampedIdx];
    if (!floorData) return;

    const newEnts = buildSingleFloorBIM(selectedBuilding, floorData, clampedIdx, viewer);
    singleFloorEntRef.current = newEnts;
  }, [selectedBuilding, currentFloorIdx, interiorMode]);

  // ── Cinematic hero fly-to: always keeps building fully in frame ──────────────────
  // flyToBoundingSphere orbits around the building's center, guaranteeing
  // the building never scrolls out of view regardless of height or position.
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !selectedBuilding || interiorMode) return;
    const b   = selectedBuilding;
    const absH = Math.max(Math.abs(b.height || 40), 20);

    const carto = Cartographic.fromDegrees(b.lon, b.lat);
    let groundElev = viewer.scene.globe.getHeight(carto);
    if (groundElev === undefined || groundElev === null || isNaN(groundElev) || groundElev < -50) {
      groundElev = (typeof b.ground_elevation === 'number' && b.ground_elevation > 0)
        ? b.ground_elevation
        : (b.lat > 12.5 && b.lat < 13.5 ? 920 : (b.lat > 18.5 && b.lat < 19.5 ? 12 : 10));
    }

    // Sphere center = horizontal building position at 45% of its height
    // This frames both lower podiums AND upper tower in the viewport
    const center = Cartesian3.fromDegrees(
      b.lon,
      b.lat,
      groundElev + absH * 0.45,
    );

    // Sphere radius frames the full building with comfortable margins
    const sphereRadius = Math.max(absH * 0.65, 50);
    const sphere = new BoundingSphere(center, sphereRadius);

    // Orbit offset: oblique side view at heading 32° (northeast-facing),
    // pitch -28° (slight downward angle to show the top)
    // range scales with building size — taller = pulled back further
    const rangeMultiplier = b.is_underground ? 1.2 : 1.6;
    const range = Math.max(absH * rangeMultiplier, 80);
    const offset = new HeadingPitchRange(
      CesiumMath.toRadians(32),   // heading: camera is SSW of building, looking NNE
      CesiumMath.toRadians(-28),  // pitch: slight downward gaze to show the roof
      range,
    );

    viewer.camera.flyToBoundingSphere(sphere, {
      duration: 2.8,
      offset,
      easingFunction: EasingFunction.SINUSOIDAL_IN_OUT,
    });
  }, [selectedBuilding, interiorMode]);

  return (
    <div
      ref={containerRef}
      id="cesium-viewer"
      style={{
        position: 'fixed',
        top:    0,
        left:   0,
        right:  0,
        bottom: 0,
        background: '#020611',
      }}
    />
  );
}
