import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { simCityBuildings, simCityParcels } from '../mock/simcity_buildings.js';

// Anchor positions for SimCity buildings
const SC_LOCATIONS = {
  'SC-BLD-00001': { x:   0, z: -10, name: 'City Hall & Plaza', zone: 'CIVIC' },
  'SC-BLD-00002': { x: -60, z: -50, name: 'SimBank Tower', zone: 'COMMERCIAL' },
  'SC-BLD-00003': { x: -60, z:  45, name: 'Grand Galleria Mall', zone: 'COMMERCIAL' },
  'SC-BLD-00004': { x:  60, z: -60, name: 'Apex Condominiums', zone: 'RESIDENTIAL' },
  'SC-BLD-00005': { x: 140, z: -30, name: 'Maplewood Suburbs', zone: 'RESIDENTIAL' },
  'SC-BLD-00006': { x:  20, z:  40, name: 'St. Jude Hospital', zone: 'CIVIC' },
  'SC-BLD-00007': { x:  70, z:  25, name: 'High School & Stadium', zone: 'CIVIC' },
  'SC-BLD-00008': { x:-145, z: -55, name: 'CleanTech Robotics', zone: 'INDUSTRIAL' },
  'SC-BLD-00009': { x:-150, z:  55, name: 'Clean Energy & Wind Plant', zone: 'INDUSTRIAL' },
  'SC-BLD-00010': { x: -10, z: 120, name: 'Riverview Marina & Pier', zone: 'COMMERCIAL' },
};

// Procedural texture for pitched terracotta clay roof tiles
function createRoofTileTexture(color = '#b91c1c') {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 128, 128);

  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 3;
  for (let y = 0; y < 128; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(128, y);
    ctx.stroke();
  }
  for (let x = 0; x < 128; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 128);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// Procedural glass facade texture for modern commercial office towers
function createGlassOfficeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(0, 0, 256, 512);

  const cols = 8;
  const rows = 32;
  const cellW = 256 / cols;
  const cellH = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillStyle = (c + r) % 3 === 0 ? '#60a5fa' : '#38bdf8';
      ctx.fillRect(c * cellW + 2, r * cellH + 2, cellW - 4, cellH - 4);
      // Window frame
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 1;
      ctx.strokeRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Procedural red brick texture for schools, townhomes, and civic buildings
function createBrickTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#991b1b';
  ctx.fillRect(0, 0, 128, 128);

  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 2;
  for (let y = 0; y < 128; y += 12) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(128, y);
    ctx.stroke();
  }
  for (let y = 0; y < 128; y += 12) {
    const shift = (y / 12) % 2 === 0 ? 0 : 12;
    for (let x = shift; x < 128; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 12);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

// Tree helper: brown wood trunk with leafy foliage canopy
function createSimTree(x, z, scale = 1.0) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  // Trunk
  const trunkGeo = new THREE.CylinderGeometry(0.3 * scale, 0.45 * scale, 2.8 * scale, 8);
  const trunkMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.9 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = (2.8 * scale) / 2;
  trunk.castShadow = true;
  group.add(trunk);

  // Foliage (double canopy)
  const fMat1 = new THREE.MeshStandardMaterial({ color: '#22c55e', roughness: 0.7 });
  const fMat2 = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.7 });

  const leaf1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8 * scale, 1), fMat1);
  leaf1.position.y = 3.2 * scale;
  leaf1.castShadow = true;
  group.add(leaf1);

  const leaf2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.3 * scale, 1), fMat2);
  leaf2.position.set(0.3 * scale, 4.4 * scale, 0.2 * scale);
  leaf2.castShadow = true;
  group.add(leaf2);

  return group;
}

// Little car helper
function createSimCar(color = '#facc15') {
  const car = new THREE.Group();

  // Chassis
  const bodyGeo = new THREE.BoxGeometry(2.4, 1.0, 4.4);
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.4 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.8;
  body.castShadow = true;
  car.add(body);

  // Cabin
  const cabGeo = new THREE.BoxGeometry(2.0, 0.9, 2.2);
  const cabMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.1 });
  const cab = new THREE.Mesh(cabGeo, cabMat);
  cab.position.set(0, 1.6, -0.2);
  car.add(cab);

  // Headlights
  const hlMat = new THREE.MeshBasicMaterial({ color: '#fef08a' });
  const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.1), hlMat);
  hlL.position.set(-0.7, 0.8, 2.22);
  const hlR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.1), hlMat);
  hlR.position.set(0.7, 0.8, 2.22);
  car.add(hlL, hlR);

  // Taillights
  const tlMat = new THREE.MeshBasicMaterial({ color: '#ef4444' });
  const tlL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.1), tlMat);
  tlL.position.set(-0.7, 0.8, -2.22);
  const tlR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.1), tlMat);
  tlR.position.set(0.7, 0.8, -2.22);
  car.add(tlL, tlR);

  // Wheels
  const wGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 12);
  const wMat = new THREE.MeshStandardMaterial({ color: '#18181b', roughness: 0.8 });
  wGeo.rotateZ(Math.PI / 2);

  const wFL = new THREE.Mesh(wGeo, wMat); wFL.position.set(-1.25, 0.45, 1.4);
  const wFR = new THREE.Mesh(wGeo, wMat); wFR.position.set(1.25, 0.45, 1.4);
  const wBL = new THREE.Mesh(wGeo, wMat); wBL.position.set(-1.25, 0.45, -1.4);
  const wBR = new THREE.Mesh(wGeo, wMat); wBR.position.set(1.25, 0.45, -1.4);
  car.add(wFL, wFR, wBL, wBR);

  return car;
}

export default function SimCityViewer({
  selectedBuilding,
  onSelectBuilding,
  onReturnToEarth,
}) {
  const mountRef = useRef(null);
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // SimCity Dashboard State
  const [timeOfDay, setTimeOfDay] = useState('day'); // 'day' | 'sunset' | 'night'
  const [activeOverlay, setActiveOverlay] = useState('none'); // 'none' | 'zoning' | 'power' | 'water' | 'traffic' | 'land_value'
  const [simSpeed, setSimSpeed] = useState(1); // 0 (pause), 1 (normal), 2 (fast), 3 (ultra)
  const [autoRotate, setAutoRotate] = useState(false);

  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const sunLightRef = useRef(null);
  const hemiLightRef = useRef(null);
  const skyMeshRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const turbineRotorsRef = useRef([]);
  const carsListRef = useRef([]);
  const steamParticlesRef = useRef([]);
  const waterMeshRef = useRef(null);
  const zoningMeshesRef = useRef([]);
  const powerLinesRef = useRef(null);
  const waterPipesRef = useRef(null);
  const trafficHeatmapRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#93c5fd'); // Cheerful sky blue

    // 2. Camera: Isometric SimCity vantage
    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 3500);
    cameraRef.current = camera;
    camera.position.set(220, 180, 260);

    // 3. Renderer with realistic soft shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 15, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 30;
    controls.maxDistance = 850;

    // 5. Natural Daylight Lighting Rig
    const hemiLight = new THREE.HemisphereLight('#dbeafe', '#347a3e', 1.2);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const sunLight = new THREE.DirectionalLight('#fffbeb', 2.6);
    sunLight.position.set(220, 320, 160);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 800;
    const shadowD = 250;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Ambient bounce
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
    scene.add(ambientLight);

    // 6. Natural Terrain & Riverway
    const terrainGroup = new THREE.Group();
    scene.add(terrainGroup);

    // Lush Green Ground Plane
    const groundGeo = new THREE.PlaneGeometry(800, 800);
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#468b4c',
      roughness: 0.85,
      metalness: 0.05,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    terrainGroup.add(groundMesh);

    // River Waterway (curving blue river cutting across the map)
    const riverGeo = new THREE.PlaneGeometry(110, 800);
    const riverMat = new THREE.MeshStandardMaterial({
      color: '#0284c7',
      roughness: 0.15,
      metalness: 0.6,
      transparent: true,
      opacity: 0.9,
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    riverMesh.rotation.x = -Math.PI / 2;
    riverMesh.rotation.z = 0.15;
    riverMesh.position.set(-10, 0.05, 0);
    terrainGroup.add(riverMesh);
    waterMeshRef.current = riverMesh;

    // Stone River Embankment Walls
    const wallGeo = new THREE.BoxGeometry(4, 3, 800);
    const wallMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.8 });
    const wallL = new THREE.Mesh(wallGeo, wallMat);
    wallL.position.set(-70, 1.5, 0);
    wallL.rotation.y = 0.15;
    terrainGroup.add(wallL);

    const wallR = new THREE.Mesh(wallGeo, wallMat);
    wallR.position.set(50, 1.5, 0);
    wallR.rotation.y = 0.15;
    terrainGroup.add(wallR);

    // Suspension Bridge over the river
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(-10, 3, 0);

    const bridgeDeck = new THREE.Mesh(
      new THREE.BoxGeometry(130, 2.5, 18),
      new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.5 })
    );
    bridgeDeck.castShadow = true;
    bridgeGroup.add(bridgeDeck);

    // Red Suspension Bridge Towers
    const archMat = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.4, metalness: 0.5 });
    for (let s of [-35, 35]) {
      const archPillar = new THREE.Mesh(new THREE.BoxGeometry(4, 40, 20), archMat);
      archPillar.position.set(s, 20, 0);
      archPillar.castShadow = true;
      bridgeGroup.add(archPillar);
    }
    terrainGroup.add(bridgeGroup);

    // 7. Asphalt Road Network with Sidewalks & Painted Lines
    const roadGroup = new THREE.Group();
    scene.add(roadGroup);

    const roadMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.85 });
    const stripeMat = new THREE.MeshBasicMaterial({ color: '#facc15' }); // Yellow centerlines
    const whiteStripeMat = new THREE.MeshBasicMaterial({ color: '#f8fafc' }); // White dashes & crosswalks

    // Main East-West Boulevard
    const mainAvenue = new THREE.Mesh(new THREE.PlaneGeometry(600, 18), roadMat);
    mainAvenue.rotation.x = -Math.PI / 2;
    mainAvenue.position.set(0, 0.08, 0);
    mainAvenue.receiveShadow = true;
    roadGroup.add(mainAvenue);

    const mainAvenueStripe = new THREE.Mesh(new THREE.PlaneGeometry(600, 1.0), stripeMat);
    mainAvenueStripe.rotation.x = -Math.PI / 2;
    mainAvenueStripe.position.set(0, 0.12, 0);
    roadGroup.add(mainAvenueStripe);

    // Downtown Commercial Boulevard (x = -90)
    const comAvenue = new THREE.Mesh(new THREE.PlaneGeometry(16, 400), roadMat);
    comAvenue.rotation.x = -Math.PI / 2;
    comAvenue.position.set(-90, 0.08, 0);
    roadGroup.add(comAvenue);

    // Civic Avenue (x = 30)
    const civicAvenue = new THREE.Mesh(new THREE.PlaneGeometry(16, 400), roadMat);
    civicAvenue.rotation.x = -Math.PI / 2;
    civicAvenue.position.set(30, 0.08, 0);
    roadGroup.add(civicAvenue);

    // Residential Maplewood Loop (x = 110)
    const resAvenue = new THREE.Mesh(new THREE.PlaneGeometry(14, 300), roadMat);
    resAvenue.rotation.x = -Math.PI / 2;
    resAvenue.position.set(110, 0.08, -30);
    roadGroup.add(resAvenue);

    // Crosswalks at intersections
    for (let ix of [-90, 30, 110]) {
      for (let zOffset of [-10, 10]) {
        const cw = new THREE.Mesh(new THREE.PlaneGeometry(14, 2.5), whiteStripeMat);
        cw.rotation.x = -Math.PI / 2;
        cw.position.set(ix, 0.14, zOffset);
        roadGroup.add(cw);
      }
    }

    // 8. Trees lining the avenues & parks
    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    // Boulevard trees
    for (let x = -260; x <= 260; x += 22) {
      if (Math.abs(x) > 65) { // don't place trees in the river
        treeGroup.add(createSimTree(x, -12, 1.0));
        treeGroup.add(createSimTree(x,  12, 1.0));
      }
    }

    // Downtown plaza trees
    for (let tz = -70; tz <= 70; tz += 18) {
      treeGroup.add(createSimTree(-102, tz, 0.9));
      treeGroup.add(createSimTree(-78,  tz, 0.9));
      treeGroup.add(createSimTree( 42,  tz, 0.9));
    }

    // Suburban trees in Maplewood
    const subTrees = [
      { x: 125, z: -50 }, { x: 145, z: -55 }, { x: 165, z: -48 },
      { x: 130, z: -15 }, { x: 155, z: -20 }, { x: 175, z: -10 },
      { x: 120, z:  10 }, { x: 150, z:  15 }, { x: 170, z:  25 },
    ];
    subTrees.forEach(t => treeGroup.add(createSimTree(t.x, t.z, 1.1)));

    // 9. Buildings Assembly & Clickable List
    const buildingsGroup = new THREE.Group();
    scene.add(buildingsGroup);

    const clickableList = [];
    const bMap = {};
    simCityBuildings.forEach(b => { bMap[b.building_id] = b; });

    // Shared textures
    const roofTexRed = createRoofTileTexture('#dc2626');
    const roofTexSlate = createRoofTileTexture('#475569');
    const glassTex = createGlassOfficeTexture();
    const brickTex = createBrickTexture();

    // ══════════════════════════════════════════════════════════════════════════
    // 1. CITY HALL & PLAZA (SC-BLD-00001 - Civic Center)
    // ══════════════════════════════════════════════════════════════════════════
    const b1 = bMap['SC-BLD-00001'];
    if (b1) {
      const chGroup = new THREE.Group();
      chGroup.position.set(0, 0, -10);

      // Sandstone Classical Body
      const chBody = new THREE.Mesh(
        new THREE.BoxGeometry(44, 22, 28),
        new THREE.MeshStandardMaterial({ color: '#fef3c7', roughness: 0.6 })
      );
      chBody.position.y = 11;
      chBody.castShadow = true;
      chBody.receiveShadow = true;
      chGroup.add(chBody);

      // Portico Columns (Classical Ionic Pillars)
      const colMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.4 });
      for (let cx = -14; cx <= 14; cx += 7) {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 14, 12), colMat);
        col.position.set(cx, 7, 16);
        col.castShadow = true;
        chGroup.add(col);
      }

      // Pediment Triangle
      const pedShape = new THREE.Shape();
      pedShape.moveTo(-16, 0);
      pedShape.lineTo(0, 8);
      pedShape.lineTo(16, 0);
      pedShape.closePath();
      const pedGeo = new THREE.ExtrudeGeometry(pedShape, { depth: 3, bevelEnabled: false });
      const ped = new THREE.Mesh(pedGeo, colMat);
      ped.position.set(0, 14, 14);
      chGroup.add(ped);

      // Central Clock Tower
      const tower = new THREE.Mesh(
        new THREE.BoxGeometry(12, 28, 12),
        new THREE.MeshStandardMaterial({ color: '#fde68a', roughness: 0.5 })
      );
      tower.position.set(0, 36, 0);
      tower.castShadow = true;
      chGroup.add(tower);

      // Golden Dome on Clock Tower
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(6.5, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.2, metalness: 0.85 })
      );
      dome.position.set(0, 50, 0);
      dome.castShadow = true;
      chGroup.add(dome);

      // Working Spire
      const spire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.6, 12, 8),
        new THREE.MeshStandardMaterial({ color: '#f59e0b', metalness: 0.9 })
      );
      spire.position.set(0, 62, 0);
      chGroup.add(spire);

      // Plaza with Fountain
      const plaza = new THREE.Mesh(
        new THREE.CylinderGeometry(18, 18, 0.8, 32),
        new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.7 })
      );
      plaza.position.set(0, 0.4, 30);
      chGroup.add(plaza);

      const fountain = new THREE.Mesh(
        new THREE.CylinderGeometry(6, 7, 1.8, 24),
        new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.4 })
      );
      fountain.position.set(0, 1.3, 30);
      chGroup.add(fountain);

      const fWater = new THREE.Mesh(
        new THREE.CylinderGeometry(5.4, 5.4, 0.6, 24),
        new THREE.MeshStandardMaterial({ color: '#0284c7', roughness: 0.1, transparent: true, opacity: 0.85 })
      );
      fWater.position.set(0, 2.0, 30);
      chGroup.add(fWater);

      chBody.userData = { building: b1 };
      tower.userData = { building: b1 };
      clickableList.push(chBody, tower);
      buildingsGroup.add(chGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 2. SIMBANK FINANCIAL TOWER (SC-BLD-00002 - Commercial Skyscraper - 138m)
    // ══════════════════════════════════════════════════════════════════════════
    const b2 = bMap['SC-BLD-00002'];
    if (b2) {
      const sbGroup = new THREE.Group();
      sbGroup.position.set(-60, 0, -50);

      // Tier 1 Base (60m)
      const sbMat = new THREE.MeshStandardMaterial({
        color: '#1d4ed8',
        roughness: 0.15,
        metalness: 0.8,
        map: glassTex,
      });

      const t1 = new THREE.Mesh(new THREE.BoxGeometry(32, 60, 32), sbMat);
      t1.position.y = 30;
      t1.castShadow = true;
      t1.receiveShadow = true;
      sbGroup.add(t1);

      // Tier 2 Mid (45m)
      const t2 = new THREE.Mesh(new THREE.BoxGeometry(26, 45, 26), sbMat);
      t2.position.y = 60 + 22.5;
      t2.castShadow = true;
      sbGroup.add(t2);

      // Tier 3 Apex (33m)
      const t3 = new THREE.Mesh(new THREE.BoxGeometry(20, 33, 20), sbMat);
      t3.position.y = 105 + 16.5;
      t3.castShadow = true;
      sbGroup.add(t3);

      // Helipad on Setback
      const pad = new THREE.Mesh(
        new THREE.CylinderGeometry(8, 8, 1.0, 24),
        new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.4 })
      );
      pad.position.set(0, 105.5, 0);
      sbGroup.add(pad);

      // Rooftop Spire & Aviation Beacon
      const spire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 1.0, 25, 8),
        new THREE.MeshStandardMaterial({ color: '#e2e8f0', metalness: 0.9 })
      );
      spire.position.y = 138 + 12.5;
      sbGroup.add(spire);

      t1.userData = { building: b2 };
      t2.userData = { building: b2 };
      t3.userData = { building: b2 };
      clickableList.push(t1, t2, t3);
      buildingsGroup.add(sbGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 3. SKYLINE GRAND GALLERIA MALL (SC-BLD-00003 - Retail Center)
    // ══════════════════════════════════════════════════════════════════════════
    const b3 = bMap['SC-BLD-00003'];
    if (b3) {
      const mallGroup = new THREE.Group();
      mallGroup.position.set(-60, 0, 45);

      // Main Multi-level Complex
      const mallBody = new THREE.Mesh(
        new THREE.BoxGeometry(54, 24, 42),
        new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.4 })
      );
      mallBody.position.y = 12;
      mallBody.castShadow = true;
      mallGroup.add(mallBody);

      // Glass Barrel Vault Skylight
      const skylight = new THREE.Mesh(
        new THREE.CylinderGeometry(8, 8, 48, 16, 1, false, 0, Math.PI),
        new THREE.MeshStandardMaterial({ color: '#38bdf8', roughness: 0.1, transparent: true, opacity: 0.75 })
      );
      skylight.rotation.z = Math.PI / 2;
      skylight.position.set(0, 24, 0);
      mallGroup.add(skylight);

      // Customer Parking Lot with miniature parked cars
      const lot = new THREE.Mesh(
        new THREE.PlaneGeometry(60, 30),
        new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.9 })
      );
      lot.rotation.x = -Math.PI / 2;
      lot.position.set(0, 0.1, 40);
      mallGroup.add(lot);

      const colors = ['#dc2626', '#2563eb', '#facc15', '#f8fafc', '#16a34a'];
      for (let px = -22; px <= 22; px += 11) {
        for (let pz of [-8, 8]) {
          const car = createSimCar(colors[Math.floor(Math.random() * colors.length)]);
          car.position.set(px, 0.1, 40 + pz);
          car.rotation.y = pz > 0 ? 0 : Math.PI;
          car.scale.set(0.65, 0.65, 0.65);
          mallGroup.add(car);
        }
      }

      mallBody.userData = { building: b3 };
      clickableList.push(mallBody);
      buildingsGroup.add(mallGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 4. APEX RESIDENTIAL CONDOMINIUMS (SC-BLD-00004 - Luxury High-Rise - 105m)
    // ══════════════════════════════════════════════════════════════════════════
    const b4 = bMap['SC-BLD-00004'];
    if (b4) {
      const apexGroup = new THREE.Group();
      apexGroup.position.set(60, 0, -60);

      // Clean White & Blue Tower
      const tower = new THREE.Mesh(
        new THREE.BoxGeometry(28, 105, 28),
        new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 })
      );
      tower.position.y = 52.5;
      tower.castShadow = true;
      apexGroup.add(tower);

      // Wraparound Balconies every 3 floors
      for (let by = 12; by <= 95; by += 10) {
        const balc = new THREE.Mesh(
          new THREE.BoxGeometry(32, 1.0, 32),
          new THREE.MeshStandardMaterial({ color: '#0284c7', roughness: 0.2 })
        );
        balc.position.y = by;
        apexGroup.add(balc);
      }

      // Rooftop Infinity Swimming Pool (Turquoise water)
      const pool = new THREE.Mesh(
        new THREE.BoxGeometry(18, 1.2, 12),
        new THREE.MeshStandardMaterial({ color: '#06b6d4', roughness: 0.1, transparent: true, opacity: 0.85 })
      );
      pool.position.set(0, 105.8, 0);
      apexGroup.add(pool);

      tower.userData = { building: b4 };
      clickableList.push(tower);
      buildingsGroup.add(apexGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 5. MAPLEWOOD TERRACE SUBURBAN COMMUNITY (SC-BLD-00005 - Residential Homes)
    // ══════════════════════════════════════════════════════════════════════════
    const b5 = bMap['SC-BLD-00005'];
    if (b5) {
      const subGroup = new THREE.Group();
      subGroup.position.set(140, 0, -30);

      // 6 Individual Craftsman Houses with terracotta and slate roofs
      const houseLayout = [
        { x: -18, z: -25, r: '#b91c1c', wall: '#fef3c7' },
        { x:  18, z: -25, r: '#475569', wall: '#f1f5f9' },
        { x: -18, z:   5, r: '#c2410c', wall: '#fef9c3' },
        { x:  18, z:   5, r: '#b91c1c', wall: '#fef3c7' },
        { x: -18, z:  35, r: '#334155', wall: '#e2e8f0' },
        { x:  18, z:  35, r: '#991b1b', wall: '#ffedd5' },
      ];

      houseLayout.forEach((h, idx) => {
        const house = new THREE.Group();
        house.position.set(h.x, 0, h.z);

        // Ground lawn
        const lawn = new THREE.Mesh(
          new THREE.PlaneGeometry(24, 24),
          new THREE.MeshStandardMaterial({ color: '#22c55e', roughness: 0.9 })
        );
        lawn.rotation.x = -Math.PI / 2;
        lawn.position.y = 0.09;
        lawn.receiveShadow = true;
        house.add(lawn);

        // Main House Body
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(12, 7, 10),
          new THREE.MeshStandardMaterial({ color: h.wall, roughness: 0.7 })
        );
        body.position.y = 3.5;
        body.castShadow = true;
        house.add(body);

        // Pitched Roof
        const roofGeo = new THREE.ConeGeometry(9.5, 4.5, 4);
        const roof = new THREE.Mesh(roofGeo, new THREE.MeshStandardMaterial({ color: h.r, roughness: 0.5 }));
        roof.rotation.y = Math.PI / 4;
        roof.position.y = 7 + 2.25;
        roof.castShadow = true;
        house.add(roof);

        // Brick Chimney
        const chim = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 3.5, 1.2),
          new THREE.MeshStandardMaterial({ color: '#7f1d1d' })
        );
        chim.position.set(3.5, 8, 2);
        house.add(chim);

        // Little car in driveway
        const drivewayCar = createSimCar(['#2563eb', '#dc2626', '#facc15', '#f8fafc'][idx % 4]);
        drivewayCar.position.set(6, 0.1, -6);
        drivewayCar.scale.set(0.55, 0.55, 0.55);
        house.add(drivewayCar);

        body.userData = { building: b5 };
        clickableList.push(body);
        subGroup.add(house);
      });

      buildingsGroup.add(subGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 6. ST. JUDE GENERAL HOSPITAL & TRAUMA CENTER (SC-BLD-00006 - Civic Health)
    // ══════════════════════════════════════════════════════════════════════════
    const b6 = bMap['SC-BLD-00006'];
    if (b6) {
      const hospGroup = new THREE.Group();
      hospGroup.position.set(20, 0, 40);

      // White Clinical Cross Wing
      const hMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.3 });
      const mainWing = new THREE.Mesh(new THREE.BoxGeometry(36, 32, 22), hMat);
      mainWing.position.y = 16;
      mainWing.castShadow = true;
      hospGroup.add(mainWing);

      const crossWing = new THREE.Mesh(new THREE.BoxGeometry(18, 32, 38), hMat);
      crossWing.position.y = 16;
      crossWing.castShadow = true;
      hospGroup.add(crossWing);

      // Red Emergency Cross on Facade
      const rcMat = new THREE.MeshBasicMaterial({ color: '#dc2626' });
      const rBar1 = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 0.2), rcMat);
      rBar1.position.set(0, 24, 19.2);
      const rBar2 = new THREE.Mesh(new THREE.BoxGeometry(8, 2, 0.2), rcMat);
      rBar2.position.set(0, 24, 19.2);
      hospGroup.add(rBar1, rBar2);

      // Rooftop Air Ambulance Helipad
      const hPad = new THREE.Mesh(
        new THREE.CylinderGeometry(8, 8, 1.0, 24),
        new THREE.MeshStandardMaterial({ color: '#334155' })
      );
      hPad.position.set(0, 32.5, 0);
      hospGroup.add(hPad);

      // Red Cross on Helipad
      const pCross1 = new THREE.Mesh(new THREE.PlaneGeometry(2, 8), rcMat);
      pCross1.rotation.x = -Math.PI / 2;
      pCross1.position.set(0, 33.1, 0);
      const pCross2 = new THREE.Mesh(new THREE.PlaneGeometry(8, 2), rcMat);
      pCross2.rotation.x = -Math.PI / 2;
      pCross2.position.set(0, 33.1, 0);
      hospGroup.add(pCross1, pCross2);

      mainWing.userData = { building: b6 };
      clickableList.push(mainWing);
      buildingsGroup.add(hospGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 7. CENTRAL HIGH SCHOOL & ATHLETIC STADIUM (SC-BLD-00007 - Education)
    // ══════════════════════════════════════════════════════════════════════════
    const b7 = bMap['SC-BLD-00007'];
    if (b7) {
      const schGroup = new THREE.Group();
      schGroup.position.set(70, 0, 25);

      // Red-brick school building
      const schBody = new THREE.Mesh(
        new THREE.BoxGeometry(34, 14, 18),
        new THREE.MeshStandardMaterial({ color: '#b91c1c', roughness: 0.75, map: brickTex })
      );
      schBody.position.y = 7;
      schBody.castShadow = true;
      schGroup.add(schBody);

      // Yellow School Bus in Bus Loop
      const bus = createSimCar('#ea580c');
      bus.scale.set(0.9, 0.9, 1.5);
      bus.position.set(0, 0.1, -16);
      schGroup.add(bus);

      // Football Field with Running Track
      const track = new THREE.Mesh(
        new THREE.CylinderGeometry(20, 20, 0.4, 32),
        new THREE.MeshStandardMaterial({ color: '#c2410c', roughness: 0.9 })
      );
      track.position.set(38, 0.2, 0);
      schGroup.add(track);

      const field = new THREE.Mesh(
        new THREE.PlaneGeometry(26, 16),
        new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.8 })
      );
      field.rotation.x = -Math.PI / 2;
      field.position.set(38, 0.42, 0);
      schGroup.add(field);

      schBody.userData = { building: b7 };
      clickableList.push(schBody);
      buildingsGroup.add(schGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 8. CLEANTECH ROBOTICS FACTORY (SC-BLD-00008 - Industrial Light)
    // ══════════════════════════════════════════════════════════════════════════
    const b8 = bMap['SC-BLD-00008'];
    if (b8) {
      const facGroup = new THREE.Group();
      facGroup.position.set(-145, 0, -55);

      // Main Industrial Manufacturing Plant
      const facBody = new THREE.Mesh(
        new THREE.BoxGeometry(50, 18, 36),
        new THREE.MeshStandardMaterial({ color: '#64748b', roughness: 0.5 })
      );
      facBody.position.y = 9;
      facBody.castShadow = true;
      facGroup.add(facBody);

      // Photovoltaic Solar Panels on Roof
      const solarMat = new THREE.MeshStandardMaterial({ color: '#1e3a8a', roughness: 0.2, metalness: 0.8 });
      for (let sx = -18; sx <= 18; sx += 9) {
        const panel = new THREE.Mesh(new THREE.PlaneGeometry(7, 30), solarMat);
        panel.rotation.x = -Math.PI / 2;
        panel.position.set(sx, 18.2, 0);
        facGroup.add(panel);
      }

      // Delivery Semi-Truck at Loading Bay
      const truck = new THREE.Group();
      truck.position.set(-30, 0.1, 0);
      const cab = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshStandardMaterial({ color: '#dc2626' }));
      cab.position.set(0, 2, 8);
      const trailer = new THREE.Mesh(new THREE.BoxGeometry(4.2, 4.8, 14), new THREE.MeshStandardMaterial({ color: '#e2e8f0' }));
      trailer.position.set(0, 2.4, -1);
      truck.add(cab, trailer);
      facGroup.add(truck);

      facBody.userData = { building: b8 };
      clickableList.push(facBody);
      buildingsGroup.add(facGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 9. CLEAN ENERGY POWER PLANT & WIND TURBINES (SC-BLD-00009 - Utilities)
    // ══════════════════════════════════════════════════════════════════════════
    const b9 = bMap['SC-BLD-00009'];
    if (b9) {
      const pwrGroup = new THREE.Group();
      pwrGroup.position.set(-150, 0, 55);

      // Hyperbolic Cooling Tower
      const towerGeo = new THREE.CylinderGeometry(14, 20, 55, 32);
      const towerMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.7 });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.y = 27.5;
      tower.castShadow = true;
      pwrGroup.add(tower);

      // Turbine Generator Hall
      const hall = new THREE.Mesh(
        new THREE.BoxGeometry(40, 16, 26),
        new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.6 })
      );
      hall.position.set(25, 8, 0);
      hall.castShadow = true;
      pwrGroup.add(hall);

      // 3 Spinning Hillside Wind Turbines
      const turbineRotors = [];
      const windOffsets = [
        { x: -35, z: -35, h: 48 },
        { x: -10, z: -45, h: 54 },
        { x:  20, z: -40, h: 46 },
      ];

      windOffsets.forEach(w => {
        const wtGroup = new THREE.Group();
        wtGroup.position.set(w.x, 0, w.z);

        // Mast
        const mast = new THREE.Mesh(
          new THREE.CylinderGeometry(0.8, 1.6, w.h, 12),
          new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.3 })
        );
        mast.position.y = w.h / 2;
        mast.castShadow = true;
        wtGroup.add(mast);

        // Nacelle
        const nacelle = new THREE.Mesh(
          new THREE.BoxGeometry(2.4, 2.0, 5.0),
          new THREE.MeshStandardMaterial({ color: '#f8fafc' })
        );
        nacelle.position.set(0, w.h, 0);
        wtGroup.add(nacelle);

        // 3-Blade Rotor Hub
        const rotor = new THREE.Group();
        rotor.position.set(0, w.h, 2.6);

        const bMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.2 });
        for (let b = 0; b < 3; b++) {
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.5, 18, 0.2), bMat);
          blade.position.y = 9;
          const bladeGroup = new THREE.Group();
          bladeGroup.rotation.z = (b * Math.PI * 2) / 3;
          bladeGroup.add(blade);
          rotor.add(bladeGroup);
        }
        wtGroup.add(rotor);
        turbineRotors.push(rotor);
        pwrGroup.add(wtGroup);
      });
      turbineRotorsRef.current = turbineRotors;

      tower.userData = { building: b9 };
      clickableList.push(tower);
      buildingsGroup.add(pwrGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 10. RIVERVIEW MARINA & YACHT PROMENADE (SC-BLD-00010 - Waterfront)
    // ══════════════════════════════════════════════════════════════════════════
    const b10 = bMap['SC-BLD-00010'];
    if (b10) {
      const marinaGroup = new THREE.Group();
      marinaGroup.position.set(-10, 0, 120);

      // Wooden Boardwalk
      const dock = new THREE.Mesh(
        new THREE.BoxGeometry(90, 1.8, 22),
        new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.85 })
      );
      dock.position.y = 1.2;
      dock.castShadow = true;
      marinaGroup.add(dock);

      // Harbor Master Clubhouse
      const club = new THREE.Mesh(
        new THREE.BoxGeometry(22, 12, 16),
        new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.4 })
      );
      club.position.set(-20, 7.5, 0);
      club.castShadow = true;
      marinaGroup.add(club);

      // Moored Sailboats
      for (let bx of [-5, 15, 30]) {
        const boat = new THREE.Group();
        boat.position.set(bx, 0.4, 20);

        // Hull
        const hull = new THREE.Mesh(
          new THREE.BoxGeometry(3.5, 1.8, 12),
          new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.2 })
        );
        hull.position.y = 0.9;
        boat.add(hull);

        // Mast & White Sail
        const mast = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.15, 14, 8),
          new THREE.MeshStandardMaterial({ color: '#78350f' })
        );
        mast.position.set(0, 7, 1);
        boat.add(mast);

        const sailShape = new THREE.Shape();
        sailShape.moveTo(0, 0);
        sailShape.lineTo(0, 12);
        sailShape.lineTo(4, 2);
        sailShape.closePath();
        const sail = new THREE.Mesh(
          new THREE.ShapeGeometry(sailShape),
          new THREE.MeshBasicMaterial({ color: '#f8fafc', side: THREE.DoubleSide })
        );
        sail.position.set(0, 1.5, 1);
        boat.add(sail);

        marinaGroup.add(boat);
      }

      club.userData = { building: b10 };
      clickableList.push(club);
      buildingsGroup.add(marinaGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 11. ANIMATED CARS DRIVING ALONG ROADWAYS
    // ══════════════════════════════════════════════════════════════════════════
    const carList = [];
    const carColors = ['#facc15', '#dc2626', '#2563eb', '#f8fafc', '#16a34a', '#ea580c', '#a855f7'];

    // 16 Cars circulating along East-West and North-South loops
    for (let i = 0; i < 16; i++) {
      const car = createSimCar(carColors[i % carColors.length]);
      const isEastWest = i < 8;

      carList.push({
        mesh: car,
        isEW: isEastWest,
        speed: 0.6 + (i % 3) * 0.2,
        pos: (i * 70) - 250,
        laneZ: isEastWest ? (i % 2 === 0 ? 4 : -4) : 0,
        laneX: !isEastWest ? (i % 2 === 0 ? -90 : 30) : 0,
      });
      scene.add(car);
    }
    carsListRef.current = carList;

    // ══════════════════════════════════════════════════════════════════════════
    // 12. SIMCITY DATA MAP OVERLAYS (Zoning, Power Grid, Water Pipes, Traffic)
    // ══════════════════════════════════════════════════════════════════════════
    const overlaysGroup = new THREE.Group();
    scene.add(overlaysGroup);

    // A. Zoning Footprints (R = Green, C = Blue, I = Yellow, Civic = Purple)
    const zoningMeshes = [];
    simCityParcels.forEach(p => {
      const zColor = p.zoning.startsWith('RES') ? '#22c55e'
                   : p.zoning.startsWith('COM') ? '#3b82f6'
                   : p.zoning.startsWith('IND') || p.zoning.startsWith('INFRA') ? '#eab308'
                   : '#a855f7';

      const minX = Math.min(...p.coordinates.map(c => c[0]));
      const maxX = Math.max(...p.coordinates.map(c => c[0]));
      const minZ = Math.min(...p.coordinates.map(c => c[1]));
      const maxZ = Math.max(...p.coordinates.map(c => c[1]));

      const w = maxX - minX;
      const d = maxZ - minZ;
      const cx = (minX + maxX) / 2;
      const cz = (minZ + maxZ) / 2;

      const zMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, d),
        new THREE.MeshBasicMaterial({ color: zColor, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
      );
      zMesh.rotation.x = -Math.PI / 2;
      zMesh.position.set(cx, 0.25, cz);
      zMesh.visible = false;
      overlaysGroup.add(zMesh);
      zoningMeshes.push(zMesh);
    });
    zoningMeshesRef.current = zoningMeshes;

    // B. Power Grid Overlay (Glowing blue high-voltage lines)
    const powerGroup = new THREE.Group();
    const pPoints = [
      new THREE.Vector3(-150, 15, 55),
      new THREE.Vector3(-145, 15, -55),
      new THREE.Vector3(-60, 20, -50),
      new THREE.Vector3(0, 20, -10),
      new THREE.Vector3(60, 20, -60),
      new THREE.Vector3(140, 12, -30),
      new THREE.Vector3(20, 18, 40),
    ];
    const powerGeo = new THREE.BufferGeometry().setFromPoints(pPoints);
    const powerLine = new THREE.Line(
      powerGeo,
      new THREE.LineBasicMaterial({ color: '#00f0ff', linewidth: 3 })
    );
    powerGroup.add(powerLine);
    powerGroup.visible = false;
    overlaysGroup.add(powerGroup);
    powerLinesRef.current = powerGroup;

    // C. Water Pipes Overlay (Glowing cyan subterranean pipes)
    const waterPipesGroup = new THREE.Group();
    const wPipeGeo = new THREE.CylinderGeometry(1.2, 1.2, 500, 8);
    const wPipeMat = new THREE.MeshBasicMaterial({ color: '#38bdf8', wireframe: true });
    const wPipe = new THREE.Mesh(wPipeGeo, wPipeMat);
    wPipe.rotation.z = Math.PI / 2;
    wPipe.position.set(0, 3.0, 0);
    waterPipesGroup.add(wPipe);
    waterPipesGroup.visible = false;
    overlaysGroup.add(waterPipesGroup);
    waterPipesRef.current = waterPipesGroup;

    // ══════════════════════════════════════════════════════════════════════════
    // 13. RAYCASTING & CLICK-TO-SELECT
    // ══════════════════════════════════════════════════════════════════════════
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableList, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.building) {
          setHoveredBuilding(hit.userData.building);
          setTooltipPos({ x: e.clientX + 16, y: e.clientY - 24 });
          renderer.domElement.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredBuilding(null);
      renderer.domElement.style.cursor = 'default';
    };

    const onPointerClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableList, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.building) {
          const b = hit.userData.building;
          onSelectBuilding(b);

          // Smoothly center camera target on clicked landmark
          const anchor = SC_LOCATIONS[b.building_id];
          if (anchor && controlsRef.current) {
            controlsRef.current.target.set(anchor.x, Math.min(b.height * 0.35, 35), anchor.z);
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onPointerClick);

    // ══════════════════════════════════════════════════════════════════════════
    // 14. ANIMATION LOOP
    // ══════════════════════════════════════════════════════════════════════════
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Controls damping
      if (controlsRef.current) controlsRef.current.update();

      // Spin wind turbine rotors
      if (typeof turbineRotors !== 'undefined' && Array.isArray(turbineRotors)) {
        turbineRotors.forEach(r => {
          r.rotation.z -= delta * 2.5;
        });
      }

      // Move little cars along roadways
      carList.forEach(c => {
        c.pos += c.speed * 40 * delta;
        if (c.pos > 280) c.pos = -280;

        if (c.isEW) {
          c.mesh.position.set(c.pos, 0.1, c.laneZ);
          c.mesh.rotation.y = c.laneZ > 0 ? Math.PI / 2 : -Math.PI / 2;
        } else {
          c.mesh.position.set(c.laneX, 0.1, c.pos);
          c.mesh.rotation.y = c.pos > 0 ? 0 : Math.PI;
        }
      });

      // Gentle water ripple
      if (riverMesh) {
        riverMesh.position.y = 0.05 + Math.sin(elapsed * 2.0) * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ══════════════════════════════════════════════════════════════════════════
    // 15. RESIZE & CLEANUP
    // ══════════════════════════════════════════════════════════════════════════
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onPointerClick);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onSelectBuilding]);

  // Lighting & Day/Sunset/Night Mode Handler
  useEffect(() => {
    if (!sunLightRef.current || !hemiLightRef.current) return;

    if (timeOfDay === 'day') {
      sunLightRef.current.color.set('#fffbeb');
      sunLightRef.current.intensity = 2.6;
      sunLightRef.current.position.set(220, 320, 160);
      hemiLightRef.current.color.set('#dbeafe');
      hemiLightRef.current.groundColor.set('#347a3e');
      hemiLightRef.current.intensity = 1.2;
    } else if (timeOfDay === 'sunset') {
      sunLightRef.current.color.set('#f97316');
      sunLightRef.current.intensity = 2.8;
      sunLightRef.current.position.set(300, 120, 80);
      hemiLightRef.current.color.set('#fdba74');
      hemiLightRef.current.groundColor.set('#78350f');
      hemiLightRef.current.intensity = 1.4;
    } else if (timeOfDay === 'night') {
      sunLightRef.current.color.set('#38bdf8');
      sunLightRef.current.intensity = 0.6;
      sunLightRef.current.position.set(100, 200, 100);
      hemiLightRef.current.color.set('#1e1b4b');
      hemiLightRef.current.groundColor.set('#064e3b');
      hemiLightRef.current.intensity = 0.5;
    }
  }, [timeOfDay]);

  // Overlays Handler (Zoning, Power, Water)
  useEffect(() => {
    if (zoningMeshesRef.current) {
      zoningMeshesRef.current.forEach(m => {
        m.visible = activeOverlay === 'zoning';
      });
    }
    if (powerLinesRef.current) {
      powerLinesRef.current.visible = activeOverlay === 'power';
    }
    if (waterPipesRef.current) {
      waterPipesRef.current.visible = activeOverlay === 'water';
    }
  }, [activeOverlay]);

  useEffect(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  const handleResetCamera = useCallback(() => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(220, 180, 260);
      controlsRef.current.target.set(0, 15, 0);
    }
  }, []);

  return (
    <div className="simcity-container" style={{ position: 'fixed', inset: 0, zIndex: 10, overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Top SimCity Mayor Cockpit HUD */}
      <div className="sc-hud-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button className="sc-btn-back" onClick={onReturnToEarth} title="Return to Real Earth Globe">
            ‹ Return to Earth Globe
          </button>
          <div className="sc-mayor-banner">
            <span className="sc-flag-icon">🏛️</span>
            <div>
              <div className="sc-city-name">Riverview Metropolis (SimCity 3D Twin)</div>
              <div className="sc-city-meta">MUNICIPAL DIGITAL TWIN // 100% 3D ULPIN CADASTRE & ZONING</div>
            </div>
          </div>
        </div>

        {/* Live Simulation Stats */}
        <div className="sc-stats-bar">
          <div className="sc-stat-pill" title="Metropolitan Population">
            <span className="sc-stat-label">👥 POPULATION</span>
            <span className="sc-stat-val">154,820 <span style={{ color: '#22c55e', fontSize: 10 }}>(+3.2%)</span></span>
          </div>

          <div className="sc-stat-pill" title="Municipal Treasury Balance">
            <span className="sc-stat-label">💰 TREASURY</span>
            <span className="sc-stat-val" style={{ color: '#fbbf24' }}>§2,840,600 <span style={{ color: '#22c55e', fontSize: 10 }}>(+§14.5k)</span></span>
          </div>

          <div className="sc-stat-pill" title="Mayor Approval Rating">
            <span className="sc-stat-label">😊 APPROVAL</span>
            <span className="sc-stat-val" style={{ color: '#34d399' }}>94%</span>
          </div>

          <div className="sc-stat-pill" title="Power Grid Coverage">
            <span className="sc-stat-label">⚡ POWER</span>
            <span className="sc-stat-val">100% <span style={{ fontSize: 10, color: '#38bdf8' }}>480MW</span></span>
          </div>

          <div className="sc-stat-pill" title="Clean Water Infrastructure">
            <span className="sc-stat-label">💧 WATER</span>
            <span className="sc-stat-val">100% <span style={{ fontSize: 10, color: '#38bdf8' }}>210 MGD</span></span>
          </div>
        </div>

        {/* HUD Actions */}
        <div className="sc-hud-controls">
          {/* Day / Sunset / Night Toggle */}
          <div className="sc-btn-group">
            <button
              className={`sc-hud-btn ${timeOfDay === 'day' ? 'active' : ''}`}
              onClick={() => setTimeOfDay('day')}
              title="Bright Sunny Day"
            >
              ☀️ Day
            </button>
            <button
              className={`sc-hud-btn ${timeOfDay === 'sunset' ? 'active' : ''}`}
              onClick={() => setTimeOfDay('sunset')}
              title="Golden Sunset"
            >
              🌅 Sunset
            </button>
            <button
              className={`sc-hud-btn ${timeOfDay === 'night' ? 'active' : ''}`}
              onClick={() => setTimeOfDay('night')}
              title="City at Night"
            >
              🌙 Night
            </button>
          </div>

          {/* Cinematic Orbit */}
          <button
            className={`sc-hud-btn ${autoRotate ? 'active' : ''}`}
            onClick={() => setAutoRotate(v => !v)}
            title="Cinematic Orbit View"
          >
            🎥 {autoRotate ? 'Stop Orbit' : 'Orbit'}
          </button>

          <button className="sc-hud-btn" onClick={handleResetCamera} title="Reset Camera Vantage">
            🎯 Reset
          </button>
        </div>
      </div>

      {/* SimCity Overlay Switcher Bar (Bottom Center) */}
      <div className="sc-overlay-bar">
        <span className="sc-overlay-title">SIMULATION OVERLAYS:</span>
        <button
          className={`sc-overlay-btn ${activeOverlay === 'none' ? 'active' : ''}`}
          onClick={() => setActiveOverlay('none')}
        >
          🏙️ Normal
        </button>
        <button
          className={`sc-overlay-btn ${activeOverlay === 'zoning' ? 'active' : ''}`}
          onClick={() => setActiveOverlay('zoning')}
          title="Zoning Cadastre (R: Green, C: Blue, I: Yellow, Civic: Purple)"
        >
          🗺️ Zoning (R-C-I)
        </button>
        <button
          className={`sc-overlay-btn ${activeOverlay === 'power' ? 'active' : ''}`}
          onClick={() => setActiveOverlay('power')}
          title="High Voltage Transmission Grid"
        >
          ⚡ Power Grid
        </button>
        <button
          className={`sc-overlay-btn ${activeOverlay === 'water' ? 'active' : ''}`}
          onClick={() => setActiveOverlay('water')}
          title="Municipal Water Aqueduct Network"
        >
          💧 Water Pipes
        </button>
      </div>

      {/* Hover Tooltip */}
      {hoveredBuilding && (
        <div className="sc-tooltip-card" style={{ left: tooltipPos.x, top: tooltipPos.y }}>
          <div className="sc-tooltip-badge">{hoveredBuilding.zone_code || 'SIMCITY UNIT'}</div>
          <div className="sc-tooltip-name">{hoveredBuilding.name}</div>
          <div className="sc-tooltip-zone">{hoveredBuilding.zone}</div>
          <div className="sc-tooltip-stats">
            <span>{hoveredBuilding.floor_count} Floors</span>
            <span>•</span>
            <span>{hoveredBuilding.height}m Height</span>
            <span>•</span>
            <span style={{ color: '#22c55e' }}>{hoveredBuilding.telemetry?.tax_yield_annual || 'Tax OK'}</span>
          </div>
          <div className="sc-tooltip-hint">Click to inspect 3D ULPIN deed & telemetry ›</div>
        </div>
      )}

      {/* Footer Info */}
      <div className="sc-hud-footer">
        <div className="sc-footer-pill">
          <span style={{ fontWeight: 700, color: '#2563eb' }}>SIMCITY DIGITAL TWIN</span>
          <span style={{ color: 'rgba(0,0,0,0.3)' }}> | </span>
          <span>City Hall • SimBank Tower • Grand Galleria • Apex Condos • St. Jude Hospital • Clean Energy Plant</span>
        </div>
        <div className="sc-footer-telemetry mono">
          AUTONOMOUS CITIZEN AGENTS: 154,820 • TRAFFIC: FLOWING • 60 FPS
        </div>
      </div>

      <style>{`
        .sc-hud-header {
          position: absolute;
          top: calc(var(--topbar-h) + 12px);
          left: 20px; right: 20px;
          display: flex; align-items: center; justify-content: space-between;
          pointer-events: none; z-index: 20;
        }
        .sc-btn-back {
          pointer-events: auto;
          background: rgba(15, 23, 42, 0.88);
          border: 1px solid rgba(59, 130, 246, 0.4);
          color: #60a5fa;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px; font-weight: 700;
          padding: 8px 16px; border-radius: 999px;
          cursor: pointer; backdrop-filter: blur(12px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          transition: all 0.15s;
        }
        .sc-btn-back:hover {
          background: #2563eb; color: #ffffff;
        }
        .sc-mayor-banner {
          display: flex; align-items: center; gap: 10px;
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 6px 14px; border-radius: 12px; backdrop-filter: blur(12px);
        }
        .sc-flag-icon { font-size: 22px; }
        .sc-city-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; color: #ffffff; }
        .sc-city-meta { font-size: 9px; font-weight: 700; color: #38bdf8; letter-spacing: 0.6px; }

        .sc-stats-bar {
          display: flex; gap: 8px; pointer-events: auto;
        }
        .sc-stat-pill {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 6px 12px; border-radius: 10px; backdrop-filter: blur(12px);
          display: flex; flex-direction: column; align-items: flex-start;
        }
        .sc-stat-label { font-size: 9px; font-weight: 800; color: #94a3b8; letter-spacing: 0.5px; }
        .sc-stat-val { font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 700; color: #ffffff; }

        .sc-hud-controls {
          display: flex; gap: 8px; pointer-events: auto;
        }
        .sc-btn-group {
          display: flex; background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px; padding: 2px;
        }
        .sc-hud-btn {
          background: transparent; border: none;
          color: #cbd5e1; font-family: 'Space Grotesk', sans-serif;
          font-size: 11px; font-weight: 600; padding: 6px 12px;
          border-radius: 8px; cursor: pointer; transition: all 0.15s;
        }
        .sc-hud-btn:hover { color: #ffffff; background: rgba(255, 255, 255, 0.1); }
        .sc-hud-btn.active {
          background: #2563eb; color: #ffffff; font-weight: 700;
        }

        .sc-overlay-bar {
          position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 8px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 6px 16px; border-radius: 999px;
          backdrop-filter: blur(14px); box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          z-index: 20;
        }
        .sc-overlay-title { font-size: 10px; font-weight: 800; color: #94a3b8; letter-spacing: 0.6px; margin-right: 4px; }
        .sc-overlay-btn {
          background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff; font-family: 'Space Grotesk', sans-serif;
          font-size: 11px; font-weight: 600; padding: 6px 14px;
          border-radius: 999px; cursor: pointer; transition: all 0.15s;
        }
        .sc-overlay-btn:hover { background: rgba(255, 255, 255, 0.2); }
        .sc-overlay-btn.active {
          background: #2563eb; border-color: #60a5fa; color: #ffffff;
          box-shadow: 0 0 12px rgba(37, 99, 235, 0.5);
        }

        .sc-tooltip-card {
          position: fixed; z-index: 100; pointer-events: none;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid #38bdf8;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          border-radius: 10px; padding: 10px 14px; min-width: 230px;
          backdrop-filter: blur(14px);
        }
        .sc-tooltip-badge {
          display: inline-block; font-size: 9px; font-weight: 800; color: #38bdf8;
          background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4);
          padding: 1px 6px; border-radius: 4px; margin-bottom: 4px;
        }
        .sc-tooltip-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; color: #ffffff; }
        .sc-tooltip-zone { font-size: 11px; color: #94a3b8; margin-bottom: 4px; }
        .sc-tooltip-stats { display: flex; gap: 6px; font-size: 10px; color: rgba(255, 255, 255, 0.7); margin-bottom: 6px; }
        .sc-tooltip-hint { font-size: 9px; color: #38bdf8; font-weight: 700; }

        .sc-hud-footer {
          position: absolute; bottom: 20px; left: 20px; right: 20px;
          display: flex; justify-content: space-between; align-items: center;
          pointer-events: none; z-index: 15;
        }
        .sc-footer-pill {
          background: rgba(255, 255, 255, 0.88); border: 1px solid rgba(0, 0, 0, 0.1);
          padding: 6px 14px; border-radius: 8px; color: #1e293b; font-size: 11px;
          backdrop-filter: blur(8px); box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .sc-footer-telemetry {
          background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 6px 14px; border-radius: 8px; color: #34d399; font-size: 10px;
          backdrop-filter: blur(8px);
        }
      `}</style>
    </div>
  );
}
