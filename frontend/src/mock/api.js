// api.js — API client with live FastAPI backend connectivity & automatic fallback
// Endpoints:
//   GET /api/buildings?city=bengaluru
//   GET /api/buildings/:id
//   GET /api/search?city=bengaluru&q=prestige
//   GET /api/validation/:buildingId
//   GET /api/parcels?city=bengaluru

import bengaluruBuildings    from './bengaluru_buildings.js';
import mumbaiBuildings       from './mumbai_buildings.js';
import netherlandsBuildings  from './netherlands_buildings.js';
import singaporeBuildings    from './singapore_buildings.js';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const FALLBACK_BUILDINGS = {
  bengaluru:   bengaluruBuildings,
  mumbai:      mumbaiBuildings,
  netherlands: netherlandsBuildings,
  singapore:   singaporeBuildings,
};

const FALLBACK_PARCELS = {
  bengaluru: [
    {
      parcel_id: 'BLR-PRC-101',
      source_parcel_id: 'BBMP-SURV-2024-881',
      country: 'India',
      city: 'bengaluru',
      coordinates: [
        [77.5936, 12.9706],
        [77.5956, 12.9706],
        [77.5956, 12.9726],
        [77.5936, 12.9726]
      ],
      elevation_reference: 920.5,
      source: 'Bhu-Bharti Survey Cadastre',
      status: 'VALID'
    },
    {
      parcel_id: 'BLR-PRC-102',
      source_parcel_id: 'BBMP-SURV-2024-912',
      country: 'India',
      city: 'bengaluru',
      coordinates: [
        [77.5974, 12.9688],
        [77.5996, 12.9688],
        [77.5996, 12.9708],
        [77.5974, 12.9708]
      ],
      elevation_reference: 918.2,
      source: 'Bhu-Bharti Survey Cadastre',
      status: 'VALID'
    },
    {
      parcel_id: 'BLR-PRC-103',
      source_parcel_id: 'BBMP-WFD-2024-401',
      country: 'India',
      city: 'bengaluru',
      coordinates: [
        [77.7460, 12.9830],
        [77.7500, 12.9830],
        [77.7500, 12.9870],
        [77.7460, 12.9870]
      ],
      elevation_reference: 865.0,
      source: 'Bhu-Bharti Survey Cadastre',
      status: 'VALID'
    },
    {
      parcel_id: 'BLR-PRC-104',
      source_parcel_id: 'BBMP-ELC-2024-118',
      country: 'India',
      city: 'bengaluru',
      coordinates: [
        [77.6780, 12.8460],
        [77.6830, 12.8460],
        [77.6830, 12.8510],
        [77.6780, 12.8510]
      ],
      elevation_reference: 890.0,
      source: 'Bhu-Bharti Survey Cadastre',
      status: 'VALID'
    }
  ],
  mumbai: [
    {
      parcel_id: 'MUM-PRC-201',
      source_parcel_id: 'MCGM-CAD-4001',
      country: 'India',
      city: 'mumbai',
      coordinates: [
        [72.8285, 18.9968],
        [72.8335, 18.9968],
        [72.8335, 19.0010],
        [72.8285, 19.0010]
      ],
      elevation_reference: 8.5,
      source: 'MCGM Cadastral Sheet — Worli Mill Lands',
      status: 'VALID'
    },
    {
      parcel_id: 'MUM-PRC-202',
      source_parcel_id: 'MMRDA-BKC-G-BLOCK-12',
      country: 'India',
      city: 'mumbai',
      coordinates: [
        [72.8610, 19.0615],
        [72.8695, 19.0615],
        [72.8695, 19.0675],
        [72.8610, 19.0675]
      ],
      elevation_reference: 9.0,
      source: 'MMRDA Cadastral Survey — BKC G-Block',
      status: 'VALID'
    },
    {
      parcel_id: 'MUM-PRC-203',
      source_parcel_id: 'MCGM-D-WARD-ALTM-88',
      country: 'India',
      city: 'mumbai',
      coordinates: [
        [72.8065, 18.9635],
        [72.8105, 18.9635],
        [72.8105, 18.9665],
        [72.8065, 18.9665]
      ],
      elevation_reference: 12.0,
      source: 'MCGM D-Ward Altamount Cadastral Map',
      status: 'VALID'
    },
    {
      parcel_id: 'MUM-PRC-204',
      source_parcel_id: 'MCGM-A-WARD-NP-104',
      country: 'India',
      city: 'mumbai',
      coordinates: [
        [72.8210, 18.9255],
        [72.8255, 18.9255],
        [72.8255, 18.9305],
        [72.8210, 18.9305]
      ],
      elevation_reference: 4.5,
      source: 'MCGM A-Ward Nariman Point Cadastre',
      status: 'VALID'
    }
  ],
  netherlands: [
    {
      parcel_id: 'NLD-PRC-301',
      source_parcel_id: 'KAD-RTD-5100',
      country: 'Netherlands',
      city: 'netherlands',
      coordinates: [
        [4.4852, 51.9022],
        [4.4888, 51.9022],
        [4.4888, 51.9052],
        [4.4852, 51.9052]
      ],
      elevation_reference: -0.5,
      source: 'Kadaster BRK',
      status: 'VALID'
    },
    {
      parcel_id: 'NLD-PRC-302',
      source_parcel_id: 'KAD-RTD-5102',
      country: 'Netherlands',
      city: 'netherlands',
      coordinates: [
        [4.4815, 51.9005],
        [4.4845, 51.9005],
        [4.4845, 51.9030],
        [4.4815, 51.9030]
      ],
      elevation_reference: -0.2,
      source: 'Kadaster BRK',
      status: 'VALID'
    },
    {
      parcel_id: 'NLD-PRC-303',
      source_parcel_id: 'KAD-RTD-5201',
      country: 'Netherlands',
      city: 'netherlands',
      coordinates: [
        [4.4700, 51.9215],
        [4.4745, 51.9215],
        [4.4745, 51.9245],
        [4.4700, 51.9245]
      ],
      elevation_reference: 0.4,
      source: 'Kadaster BRK',
      status: 'VALID'
    },
    {
      parcel_id: 'NLD-PRC-304',
      source_parcel_id: 'KAD-RTD-5205',
      country: 'Netherlands',
      city: 'netherlands',
      coordinates: [
        [4.4840, 51.9185],
        [4.4880, 51.9185],
        [4.4880, 51.9215],
        [4.4840, 51.9215]
      ],
      elevation_reference: 0.2,
      source: 'Kadaster BRK',
      status: 'VALID'
    }
  ],
  singapore: [
    {
      parcel_id: 'SGP-PRC-401',
      source_parcel_id: 'SLA-LOT-TS30-01452X',
      country: 'Singapore',
      city: 'singapore',
      coordinates: [
        [103.8520, 1.2785],
        [103.8565, 1.2785],
        [103.8565, 1.2820],
        [103.8520, 1.2820]
      ],
      elevation_reference: 3.2,
      source: 'SLA Cadastral Lot — Marina Bay Financial Centre',
      status: 'VALID'
    },
    {
      parcel_id: 'SGP-PRC-402',
      source_parcel_id: 'SLA-LOT-TS23-00981M',
      country: 'Singapore',
      city: 'singapore',
      coordinates: [
        [103.8440, 1.2750],
        [103.8475, 1.2750],
        [103.8475, 1.2785],
        [103.8440, 1.2785]
      ],
      elevation_reference: 4.0,
      source: 'SLA Cadastral Lot — Tanjong Pagar / Guoco Tower',
      status: 'VALID'
    },
    {
      parcel_id: 'SGP-PRC-403',
      source_parcel_id: 'SLA-LOT-TS1-00342A',
      country: 'Singapore',
      city: 'singapore',
      coordinates: [
        [103.8495, 1.2825],
        [103.8530, 1.2825],
        [103.8530, 1.2860],
        [103.8495, 1.2860]
      ],
      elevation_reference: 2.8,
      source: 'SLA Cadastral Lot — Raffles Place Commercial Core',
      status: 'VALID'
    },
    {
      parcel_id: 'SGP-PRC-404',
      source_parcel_id: 'SLA-LOT-TS22-00511P',
      country: 'Singapore',
      city: 'singapore',
      coordinates: [
        [103.8395, 1.2755],
        [103.8435, 1.2755],
        [103.8435, 1.2790],
        [103.8395, 1.2790]
      ],
      elevation_reference: 6.0,
      source: 'SLA Cadastral Lot — The Pinnacle@Duxton Strata Housing',
      status: 'VALID'
    }
  ]
};

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));

async function fetchWithTimeout(url, options = {}, timeoutMs = 800) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * GET /api/buildings?city=bengaluru
 */
export async function getBuildings(city) {
  try {
    const res = await fetchWithTimeout(`${BACKEND_BASE_URL}/api/buildings?city=${city}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Graceful fallback to client dataset
  }
  await delay(250);
  return FALLBACK_BUILDINGS[city] ?? [];
}

/**
 * GET /api/buildings/:id
 */
export async function getBuilding(buildingId) {
  try {
    const res = await fetchWithTimeout(`${BACKEND_BASE_URL}/api/buildings/${buildingId}`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  await delay(100);
  for (const buildings of Object.values(FALLBACK_BUILDINGS)) {
    const found = buildings.find(b => b.building_id === buildingId);
    if (found) return found;
  }
  return null;
}

/**
 * GET /api/search?city=bengaluru&q=prestige
 */
export async function searchBuildings(city, query) {
  try {
    const res = await fetchWithTimeout(`${BACKEND_BASE_URL}/api/search?city=${city}&q=${encodeURIComponent(query)}`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  await delay(100);
  const buildings = FALLBACK_BUILDINGS[city] ?? [];
  const q = query.toLowerCase();
  return buildings.filter(b =>
    b.name.toLowerCase().includes(q) ||
    b.building_id.toLowerCase().includes(q) ||
    b.prototype_3d_id.toLowerCase().includes(q)
  );
}

/**
 * GET /api/validation/:buildingId
 */
export async function getValidationReport(buildingId) {
  try {
    const res = await fetchWithTimeout(`${BACKEND_BASE_URL}/api/validation/${buildingId}`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  await delay(150);
  const building = await getBuilding(buildingId);
  return building?.validation_checks ?? [];
}

/**
 * GET /api/parcels?city=bengaluru
 */
export async function getParcels(city) {
  try {
    const res = await fetchWithTimeout(`${BACKEND_BASE_URL}/api/parcels?city=${city}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // Fallback
  }
  await delay(100);
  return FALLBACK_PARCELS[city] ?? [];
}

/** City camera positions */
export const CITY_CAMERAS = {
  bengaluru: {
    lon: 77.5946, lat: 12.9716, height: 3800,
    label: 'Bengaluru', country: 'India', timezone: 'Asia/Kolkata',
  },
  mumbai: {
    lon: 72.8777, lat: 19.0760, height: 4500,
    label: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata',
  },
  netherlands: {
    lon: 4.4900, lat: 51.9155, height: 3200,
    label: 'Rotterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam',
  },
  singapore: {
    lon: 103.8198, lat: 1.3521, height: 4000,
    label: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore',
  },
};

/**
 * Preload and return all 4 pilot cities' datasets beforehand for silky-smooth camera flights.
 */
export function getAllPilotData() {
  const allBuildings = [
    ...bengaluruBuildings,
    ...mumbaiBuildings,
    ...netherlandsBuildings,
    ...singaporeBuildings,
  ];
  const allParcels = [
    ...(FALLBACK_PARCELS.bengaluru || []),
    ...(FALLBACK_PARCELS.mumbai || []),
    ...(FALLBACK_PARCELS.netherlands || []),
    ...(FALLBACK_PARCELS.singapore || []),
  ];
  return { allBuildings, allParcels };
}

/**
 * GET /api/drone/surveys
 */
export async function getDroneSurveys() {
  try {
    const res = await fetchWithTimeout(`${BACKEND_BASE_URL}/api/drone/surveys`, {}, 2000);
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  return [
    {
      survey_id: "SURV-IN-BLR-UAV-01",
      name: "Bengaluru Tech Corridor UAV Photogrammetry",
      city: "bengaluru",
      total_images: 84,
      mean_gsd_cm: 2.4,
      flight_altitude_m: 120.0,
      crs: "EPSG:4326 / UTM 43N",
      status: "READY_FOR_PROCESSING",
      rtk_fix: "FIXED (Survey of India CORS Network)"
    },
    {
      survey_id: "SURV-IN-BOM-UAV-02",
      name: "Mumbai Lower Parel Vertical Density Survey",
      city: "mumbai",
      total_images: 126,
      mean_gsd_cm: 2.1,
      flight_altitude_m: 150.0,
      crs: "EPSG:4326 / UTM 43N",
      status: "READY_FOR_PROCESSING",
      rtk_fix: "FIXED (Survey of India CORS Network)"
    },
    {
      survey_id: "SURV-IN-RUR-UAV-03",
      name: "SVAMITVA Rural Abadi Drone Cadastral Mapping",
      city: "bengaluru",
      total_images: 65,
      mean_gsd_cm: 3.0,
      flight_altitude_m: 100.0,
      crs: "EPSG:4326 / India Zone EPSG:7755",
      status: "READY_FOR_PROCESSING",
      rtk_fix: "FIXED (SoI Reference Station)"
    }
  ];
}

/**
 * POST /api/drone/process
 */
export async function processDroneSurvey(surveyParams) {
  try {
    const res = await fetchWithTimeout(`${BACKEND_BASE_URL}/api/drone/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(surveyParams)
    }, 6000);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Backend /api/drone/process offline or timed out, returning client fallback", err);
  }
  await delay(500);
  return {
    success: true,
    survey_id: surveyParams.survey_id || "SURV-IN-BLR-UAV-01",
    prototype_3d_id: `3D-IN-${(surveyParams.city || 'BLR').slice(0, 3).toUpperCase()}-F08-A9F3C1`,
    message: "Reconstructed 3D building and vertical volumes from drone photogrammetry",
    processing_time_s: 0.32
  };
}
