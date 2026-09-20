import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { simulationBuildings } from '../mock/simulation_buildings.js';

// Coordinates and visual anchors for all 12 iconic Night City landmarks
const NC_LOCATIONS = {
  'NC-BLD-00001': { x: 0,    z: -50,  name: 'Arasaka Tower', role: 'corpo_hq' },
  'NC-BLD-00002': { x: 120,  z: -120, name: 'Megabuilding H10', role: 'megabuilding' },
  'NC-BLD-00003': { x: -72,  z: -30,  name: 'Corpo West Tower', role: 'militech' },
  'NC-BLD-00004': { x: -110, z:  90,  name: 'The Afterlife', role: 'afterlife' },
  'NC-BLD-00005': { x:  80,  z:  60,  name: 'Kang Tao Spire', role: 'kang_tao' },
  'NC-BLD-00006': { x:  75,  z: 110,  name: 'No-Tell Motel', role: 'no_tell' },
  'NC-BLD-00007': { x: -35,  z: -40,  name: 'Corpo Skyway & Airway', role: 'skyway' },
  'NC-BLD-00008': { x: -190, z:  80,  name: 'Konpeki Plaza', role: 'konpeki' },
  'NC-BLD-00009': { x: 160,  z: -15,  name: 'Megabuilding H08', role: 'megabuilding_h08' },
  'NC-BLD-00010': { x: 130,  z:  75,  name: 'Delamain AI Hub', role: 'delamain' },
  'NC-BLD-00011': { x:  20,  z: 125,  name: 'Tyger Claws Pagoda', role: 'pagoda' },
  'NC-BLD-00012': { x:  72,  z: -30,  name: 'Petrochem Tower', role: 'petrochem' },
};

// Creates rigid meshes with glowing, high-contrast structural edges for CAD/twin clarity
function createRigidMesh(geo, mat, edgeColor = '#38bdf8', edgeOpacity = 0.85, threshold = 20) {
  const mesh = new THREE.Mesh(geo, mat);
  const edges = new THREE.EdgesGeometry(geo, threshold);
  const lineMat = new THREE.LineBasicMaterial({
    color: edgeColor,
    transparent: true,
    opacity: edgeOpacity,
    linewidth: 1.5,
  });
  const line = new THREE.LineSegments(edges, lineMat);
  mesh.add(line);
  return mesh;
}

// Generates an emissive canvas texture for cyberpunk advertising billboards
function createBillboardTexture(title, sub, brand, primaryColor = '#ef4444', secondaryColor = '#ffffff') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#080d1e';
  ctx.fillRect(0, 0, 512, 160);

  // Border neon frame
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 500, 148);

  // Scanlines
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  for (let y = 0; y < 160; y += 4) ctx.fillRect(6, y, 500, 2);

  // Header Brand
  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 18px "Space Grotesk", monospace';
  ctx.fillText(brand, 24, 36);

  // Main Title
  ctx.fillStyle = secondaryColor;
  ctx.font = '900 42px "Syne", "Space Grotesk", sans-serif';
  ctx.fillText(title, 24, 92);

  // Subtitle
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 15px monospace';
  ctx.fillText(sub, 24, 130);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Vertical neon sign texture
function createVerticalSignTexture(text, neonColor = '#f43f5e', bg = '#0a0f24') {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 128, 512);

  ctx.strokeStyle = neonColor;
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, 120, 504);

  ctx.fillStyle = neonColor;
  ctx.font = '900 38px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';

  const chars = text.split('');
  const startY = 48;
  const spacing = 38;
  chars.forEach((c, idx) => {
    ctx.fillText(c, 64, startY + idx * spacing);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Generates authentic Arasaka 荒坂 vertical kanji banner and corporate crest
function createArasakaKanjiTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#060911';
  ctx.fillRect(0, 0, 256, 1024);

  // Red neon border frame
  ctx.strokeStyle = '#ff003c';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 240, 1008);

  // Arasaka 3-triangle logo
  const drawTriangle = (cx, cy, size) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx + size * 0.866, cy + size * 0.5);
    ctx.lineTo(cx - size * 0.866, cy + size * 0.5);
    ctx.closePath();
    ctx.fill();
  };
  ctx.fillStyle = '#ff003c';
  drawTriangle(128, 90, 40);
  drawTriangle(92, 150, 40);
  drawTriangle(164, 150, 40);

  // "ARASAKA" English
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ARASAKA', 128, 225);

  // Giant 荒坂 Kanji
  ctx.fillStyle = '#ff003c';
  ctx.font = '900 135px "Yu Gothic", "MS Gothic", "Noto Sans JP", sans-serif';
  ctx.fillText('荒', 128, 410);
  ctx.fillText('坂', 128, 570);

  // Subtitle & division
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('CORPO PLAZA HQ', 128, 650);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '15px monospace';
  ctx.fillText('SECURE YOUR SOUL', 128, 685);
  ctx.fillText('荒坂セキュリティ 2077', 128, 720);

  // Barcode and telemetry blocks
  ctx.fillStyle = '#ff003c';
  ctx.fillRect(40, 770, 176, 4);
  for (let x = 40; x < 216; x += 8) {
    if ((x * 13) % 7 > 2) {
      ctx.fillRect(x, 785, ((x % 3) + 1) * 2, 35);
    }
  }

  ctx.fillStyle = 'rgba(255,0,60,0.85)';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('AUTH: CLASSIFIED // LEVEL 5', 128, 860);
  ctx.fillText('RESTRICTED AIRSPACE', 128, 890);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Generates Cyberpunk 2077 in-game corporate holographic advertisements
function createCyberpunkAdTexture(brand, title, tagline, themeColor = '#00f0ff', accentColor = '#facc15') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#070b16';
  ctx.fillRect(0, 0, 512, 256);

  // Frame
  ctx.strokeStyle = themeColor;
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 244);

  // Scanlines
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  for (let y = 0; y < 256; y += 4) ctx.fillRect(6, y, 500, 2);

  // Brand header
  ctx.fillStyle = themeColor;
  ctx.font = 'bold 20px monospace';
  ctx.fillText(brand, 28, 45);

  // Main Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 52px "Syne", "Space Grotesk", sans-serif';
  ctx.fillText(title, 28, 120);

  // Tagline
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 22px "Space Grotesk", sans-serif';
  ctx.fillText(tagline, 28, 175);

  // Footer bar
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '14px monospace';
  ctx.fillText('NIGHT CITY COMMERCIAL BROADCAST • CH-74', 28, 225);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Generates the exact glowing white circular Arasaka crest from the Cyberpunk 2077 screenshot
function createArasakaCircularLogoTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 512, 512);

  // Outer glowing halo
  const grad = ctx.createRadialGradient(256, 256, 150, 256, 256, 250);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.45)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(256, 256, 250, 0, Math.PI * 2);
  ctx.fill();

  // Solid bright white circular ring
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 26;
  ctx.beginPath();
  ctx.arc(256, 256, 205, 0, Math.PI * 2);
  ctx.stroke();

  // Three-node stylized Arasaka emblem inside
  ctx.fillStyle = '#ffffff';

  // Central vertical stem
  ctx.fillRect(244, 210, 24, 150);

  // Bottom base bar
  ctx.fillRect(205, 345, 102, 20);

  // Top node
  ctx.beginPath();
  ctx.arc(256, 160, 42, 0, Math.PI * 2);
  ctx.fill();

  // Left node
  ctx.beginPath();
  ctx.arc(165, 235, 42, 0, Math.PI * 2);
  ctx.fill();

  // Right node
  ctx.beginPath();
  ctx.arc(347, 235, 42, 0, Math.PI * 2);
  ctx.fill();

  // Angled branches connecting to left and right nodes
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.moveTo(256, 245);
  ctx.lineTo(165, 235);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(256, 245);
  ctx.lineTo(347, 235);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Generates the exact glowing neon orange PETROCHEM folded envelope logo and text from the screenshot
function createPetrochemLogoTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 360;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0a0e18';
  ctx.fillRect(0, 0, 512, 360);

  const orange = '#ff6b22';

  // Folded envelope icon
  ctx.strokeStyle = orange;
  ctx.lineWidth = 16;
  ctx.strokeRect(120, 36, 272, 160);

  // Flap diagonal lines
  ctx.beginPath();
  ctx.moveTo(120, 36);
  ctx.lineTo(256, 130);
  ctx.lineTo(392, 36);
  ctx.stroke();

  // Bottom creases
  ctx.beginPath();
  ctx.moveTo(120, 196);
  ctx.lineTo(200, 120);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(392, 196);
  ctx.lineTo(312, 120);
  ctx.stroke();

  // Wordmark "PETROCHEM"
  ctx.fillStyle = orange;
  ctx.font = '900 54px "Syne", "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PETROCHEM', 256, 280);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Stacked vertical Cyberpunk 2077 advertisement posters
function createCyberpunkPosterStackTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, 0, 256, 512);

  // Poster 1 (Top: Cyan/Blue)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(12, 16, 232, 140);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px sans-serif';
  ctx.fillText('BRAINDANCE', 24, 60);
  ctx.font = 'bold 14px monospace';
  ctx.fillStyle = '#bae6fd';
  ctx.fillText('FEEL EVERYTHING • LIVE', 24, 90);

  // Poster 2 (Middle: Magenta/Red)
  ctx.fillStyle = '#be185d';
  ctx.fillRect(12, 176, 232, 140);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px sans-serif';
  ctx.fillText('ALL FOODS', 24, 220);
  ctx.font = 'bold 14px monospace';
  ctx.fillStyle = '#fbcfe8';
  ctx.fillText('SCOP SLURRY • 99¢', 24, 250);

  // Poster 3 (Bottom: Yellow/Green)
  ctx.fillStyle = '#15803d';
  ctx.fillRect(12, 336, 232, 150);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px sans-serif';
  ctx.fillText('TRAUMA TEAM', 24, 380);
  ctx.font = 'bold 14px monospace';
  ctx.fillStyle = '#bbf7d0';
  ctx.fillText('PLATINUM 7-MIN EVAC', 24, 410);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Generates bright, vibrant glowing window matrix texture
function createWindowTexture(cols = 16, rows = 64, litRatio = 0.65, primaryColor = '#38bdf8') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0e1424';
  ctx.fillRect(0, 0, 256, 512);

  const cellW = 256 / cols;
  const cellH = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() < litRatio) {
        const rand = Math.random();
        if (rand < 0.35) {
          ctx.fillStyle = primaryColor;
        } else if (rand < 0.65) {
          ctx.fillStyle = '#fbbf24'; // Warm amber
        } else if (rand < 0.85) {
          ctx.fillStyle = '#f43f5e'; // Hot rose
        } else {
          ctx.fillStyle = '#ffffff'; // Crisp white
        }
        ctx.fillRect(c * cellW + 1.5, r * cellH + 1.5, cellW - 3, cellH - 2.5);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Constructs an articulated organic holographic fish (Veiltail Koi / Spectral Fish) matching Cyberpunk 2077 Corpo Plaza
function buildHolographicFish({
  bodyColor = '#ff6b00',
  secondaryColor = '#ff3300',
  glowColor = '#ffdd00',
  eyeColor = '#ffffff',
  scale = 1.0,
  lightColor = '#ff7700',
  lightIntensity = 5.0
}) {
  const root = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: bodyColor,
    emissive: bodyColor,
    emissiveIntensity: 0.85,
    roughness: 0.2,
    metalness: 0.6,
    transparent: true,
    opacity: 0.92,
  });

  const bodyWireMat = new THREE.MeshBasicMaterial({
    color: glowColor,
    wireframe: true,
    transparent: true,
    opacity: 0.75,
  });

  const finMat = new THREE.MeshStandardMaterial({
    color: glowColor,
    emissive: bodyColor,
    emissiveIntensity: 0.9,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.82,
    roughness: 0.1,
  });

  const finWireMat = new THREE.MeshBasicMaterial({
    color: '#ffffff',
    wireframe: true,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.65,
  });

  // Segments chain for lifelike undulation
  const segments = [];

  // Head segment (Snout)
  const headGeo = new THREE.ConeGeometry(3.6 * scale, 8 * scale, 16);
  const headMesh = new THREE.Mesh(headGeo, bodyMat);
  headMesh.rotation.x = Math.PI / 2;
  root.add(headMesh);

  // Wire overlay on head
  const headWire = new THREE.Mesh(headGeo, bodyWireMat);
  headMesh.add(headWire);

  // Luminous Cyber Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: eyeColor });
  const eyeGeo = new THREE.SphereGeometry(0.75 * scale, 12, 12);
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-2.2 * scale, 1.4 * scale, 1.2 * scale);
  headMesh.add(eyeL);

  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(2.2 * scale, 1.4 * scale, 1.2 * scale);
  headMesh.add(eyeR);

  // Glowing Barbels (whiskers)
  for (let s = -1; s <= 1; s += 2) {
    const barbel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18 * scale, 0.04 * scale, 7.5 * scale, 6),
      new THREE.MeshBasicMaterial({ color: glowColor, transparent: true, opacity: 0.9 })
    );
    barbel.position.set(s * 2.4 * scale, -0.4 * scale, 3.2 * scale);
    barbel.rotation.x = 0.55;
    barbel.rotation.z = s * 0.45;
    headMesh.add(barbel);
  }

  // Pectoral Fins (Left & Right)
  const pFinGeo = new THREE.PlaneGeometry(6.5 * scale, 13 * scale, 4, 6);
  const pFinMeshL = new THREE.Mesh(pFinGeo, finMat);
  pFinMeshL.position.set(-3.6 * scale, 0, -1.0 * scale);
  pFinMeshL.rotation.z = 0.7;
  pFinMeshL.rotation.x = -0.3;
  headMesh.add(pFinMeshL);
  pFinMeshL.add(new THREE.Mesh(pFinGeo, finWireMat));

  const pFinMeshR = new THREE.Mesh(pFinGeo, finMat);
  pFinMeshR.position.set(3.6 * scale, 0, -1.0 * scale);
  pFinMeshR.rotation.z = -0.7;
  pFinMeshR.rotation.x = -0.3;
  headMesh.add(pFinMeshR);
  pFinMeshR.add(new THREE.Mesh(pFinGeo, finWireMat));

  // Dorsal Spiny Fan Fin on Head/Arch
  const dorsalGeo = new THREE.PlaneGeometry(3.5 * scale, 12 * scale, 2, 4);
  const dorsalFin = new THREE.Mesh(dorsalGeo, finMat);
  dorsalFin.position.set(0, 3.8 * scale, -2.5 * scale);
  dorsalFin.rotation.x = 1.1;
  dorsalFin.rotation.y = Math.PI / 2;
  headMesh.add(dorsalFin);
  dorsalFin.add(new THREE.Mesh(dorsalGeo, finWireMat));

  // Articulated Torso and Tail Segments
  const segRadii = [3.8, 3.4, 2.6, 1.8, 1.0];
  const segLengths = [5.5, 5.0, 4.5, 4.0, 3.5];

  let prevNode = headMesh;
  for (let i = 0; i < segRadii.length; i++) {
    const r = segRadii[i] * scale;
    const len = segLengths[i] * scale;
    const segContainer = new THREE.Group();
    segContainer.position.set(0, 0, -len);
    prevNode.add(segContainer);
    segments.push(segContainer);

    const sGeo = new THREE.CylinderGeometry(r * 0.8, r, len, 14);
    const sMesh = new THREE.Mesh(sGeo, i % 2 === 0 ? bodyMat : new THREE.MeshStandardMaterial({
      color: secondaryColor,
      emissive: secondaryColor,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.5,
      transparent: true,
      opacity: 0.9,
    }));
    sMesh.position.set(0, 0, len * 0.5);
    sMesh.rotation.x = Math.PI / 2;
    segContainer.add(sMesh);
    sMesh.add(new THREE.Mesh(sGeo, bodyWireMat));

    // Secondary dorsal crest on segment 1
    if (i === 0) {
      const midDorsal = new THREE.Mesh(new THREE.PlaneGeometry(3.0 * scale, 8 * scale), finMat);
      midDorsal.position.set(0, 3.0 * scale, 0);
      midDorsal.rotation.y = Math.PI / 2;
      midDorsal.rotation.x = 0.8;
      segContainer.add(midDorsal);
    }

    // Ventral pelvic fins on segment 1
    if (i === 1) {
      for (let s = -1; s <= 1; s += 2) {
        const vFin = new THREE.Mesh(new THREE.PlaneGeometry(2.5 * scale, 6 * scale), finMat);
        vFin.position.set(s * 2.2 * scale, -2.5 * scale, 0);
        vFin.rotation.z = s * 0.8;
        segContainer.add(vFin);
      }
    }

    prevNode = segContainer;
  }

  // Spectacular Flowing Veiltail Caudal Fins (3 tiered overlapping fan lobes)
  const tailGroup = new THREE.Group();
  prevNode.add(tailGroup);

  // Upper veil lobe
  const veilUpperGeo = new THREE.PlaneGeometry(9 * scale, 22 * scale, 4, 8);
  const veilUpper = new THREE.Mesh(veilUpperGeo, finMat);
  veilUpper.position.set(0, 2.5 * scale, -11 * scale);
  veilUpper.rotation.y = Math.PI / 2;
  veilUpper.rotation.x = 0.35;
  tailGroup.add(veilUpper);
  veilUpper.add(new THREE.Mesh(veilUpperGeo, finWireMat));

  // Lower veil lobe
  const veilLowerGeo = new THREE.PlaneGeometry(8 * scale, 18 * scale, 4, 6);
  const veilLower = new THREE.Mesh(veilLowerGeo, finMat);
  veilLower.position.set(0, -2.5 * scale, -9 * scale);
  veilLower.rotation.y = Math.PI / 2;
  veilLower.rotation.x = -0.3;
  tailGroup.add(veilLower);
  veilLower.add(new THREE.Mesh(veilLowerGeo, finWireMat));

  // Center flowing veil ribbon
  const veilMidGeo = new THREE.PlaneGeometry(10 * scale, 24 * scale, 4, 8);
  const veilMid = new THREE.Mesh(veilMidGeo, finMat);
  veilMid.position.set(0, 0, -12 * scale);
  veilMid.rotation.y = Math.PI / 2;
  tailGroup.add(veilMid);

  // Point Light for dramatic plaza illumination
  const light = new THREE.PointLight(lightColor, lightIntensity, 160, 1.1);
  root.add(light);

  return {
    group: root,
    head: headMesh,
    segments,
    pFinL: pFinMeshL,
    pFinR: pFinMeshR,
    tailGroup,
    light
  };
}

export default function NightCityViewer({
  selectedBuilding,
  onSelectBuilding,
  onReturnToEarth,
}) {
  const mountRef = useRef(null);
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [subsurfaceMode, setSubsurfaceMode] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);

  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const groundMeshRef = useRef(null);
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Atmosphere (Cinematic Cyberpunk 2077 Twilight Sky)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#081228');
    scene.fog = new THREE.Fog('#081329', 550, 2800);

    // 2. Camera (Framed from Corpo Plaza looking up at Arasaka Tower as in reference screenshot)
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 4000);
    cameraRef.current = camera;
    camera.position.set(0, 16, 85);

    // 3. Renderer (High exposure for rich, bright visuals)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.85;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 145, -50);
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 15;
    controls.maxDistance = 1000;

    // 5. Bright Multi-Angle Lighting Rig
    const ambientLight = new THREE.AmbientLight('#263554', 2.8);
    scene.add(ambientLight);

    // Top-down Key Light
    const keyLight = new THREE.DirectionalLight('#ffffff', 3.2);
    keyLight.position.set(200, 480, 180);
    scene.add(keyLight);

    // Cyan City Fill Light
    const fillLight = new THREE.DirectionalLight('#38bdf8', 2.4);
    fillLight.position.set(-220, 320, -180);
    scene.add(fillLight);

    // Warm Amber Rim Light
    const rimLight = new THREE.DirectionalLight('#f59e0b', 2.0);
    rimLight.position.set(0, 180, 280);
    scene.add(rimLight);

    // Intense District Point Lights
    const arasakaLight = new THREE.PointLight('#ef4444', 5.5, 300, 1.2);
    arasakaLight.position.set(-60, 80, -40);
    scene.add(arasakaLight);

    const watsonLight = new THREE.PointLight('#06b6d4', 5.0, 320, 1.2);
    watsonLight.position.set(100, 90, -85);
    scene.add(watsonLight);

    const japantownLight = new THREE.PointLight('#ec4899', 5.0, 320, 1.2);
    japantownLight.position.set(150, 80, 0);
    scene.add(japantownLight);

    const konpekiGold = new THREE.PointLight('#fbbf24', 5.5, 300, 1.2);
    konpekiGold.position.set(-190, 90, 80);
    scene.add(konpekiGold);

    // 6. Ground, Road Network & Cyberpunk Grid
    const groundGroup = new THREE.Group();
    scene.add(groundGroup);

    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(1600, 1600);
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#070b18',
      roughness: 0.6,
      metalness: 0.4,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.1;
    groundGroup.add(groundMesh);
    groundMeshRef.current = groundMat;

    // Glowing Cyan Grid
    const cyanGrid = new THREE.GridHelper(1400, 70, '#00f0ff', '#101e38');
    cyanGrid.position.y = 0.04;
    groundGroup.add(cyanGrid);

    // Corpo Plaza Elevated Glass Skybridge Ring & Memorial Park Basin
    // Centered around (0, 0, 0) facing Arasaka Tower at (0, -50)
    const skywalkRingGroup = new THREE.Group();
    skywalkRingGroup.position.set(0, 0, 0);
    groundGroup.add(skywalkRingGroup);

    // Ground Memorial Water Pool (Radius 42m)
    const memorialPool = new THREE.Mesh(
      new THREE.CircleGeometry(42, 48),
      new THREE.MeshStandardMaterial({ color: '#0369a1', roughness: 0.1, metalness: 0.85, emissive: '#0284c7', emissiveIntensity: 0.4 })
    );
    memorialPool.rotation.x = -Math.PI / 2;
    memorialPool.position.y = 0.08;
    skywalkRingGroup.add(memorialPool);

    // Glowing Memorial Perimeter Kerb
    const poolKerb = new THREE.Mesh(
      new THREE.RingGeometry(42, 45, 48),
      new THREE.MeshBasicMaterial({ color: '#38bdf8', side: THREE.DoubleSide })
    );
    poolKerb.rotation.x = -Math.PI / 2;
    poolKerb.position.y = 0.12;
    skywalkRingGroup.add(poolKerb);

    // Memorial park trees inside the circle (matching screenshot foliage)
    for (let i = 0; i < 16; i++) {
      const tAngle = (i / 16) * Math.PI * 2;
      const tDist = 22 + (i % 3) * 8;
      const tx = Math.cos(tAngle) * tDist;
      const tz = Math.sin(tAngle) * tDist;
      const tree = createRigidMesh(
        new THREE.ConeGeometry(3.5, 9, 6),
        new THREE.MeshStandardMaterial({ color: '#14532d', roughness: 0.8 }),
        '#22c55e', 0.65
      );
      tree.position.set(tx, 4.5, tz);
      skywalkRingGroup.add(tree);
    }

    // Elevated Circular Pedestrian Skybridge Deck (Radius 68m to 78m at y = 16m)
    const deckGeo = new THREE.RingGeometry(68, 78, 64);
    const deckMat = new THREE.MeshStandardMaterial({ color: '#161e2e', roughness: 0.35, metalness: 0.75, side: THREE.DoubleSide });
    const skywalkDeck = new THREE.Mesh(deckGeo, deckMat);
    skywalkDeck.rotation.x = -Math.PI / 2;
    skywalkDeck.position.y = 16;
    skywalkRingGroup.add(skywalkDeck);

    // Outer & Inner Glowing Glass Balustrades
    const outerRail = new THREE.Mesh(
      new THREE.RingGeometry(77.6, 78.2, 64),
      new THREE.MeshBasicMaterial({ color: '#00f0ff', side: THREE.DoubleSide })
    );
    outerRail.rotation.x = -Math.PI / 2;
    outerRail.position.y = 17.5;
    skywalkRingGroup.add(outerRail);

    // Exact Horizontal Cyan Neon Light Bars along the bridge rim (as seen in screenshot)
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 18) {
      const bx = Math.cos(angle) * 78.5;
      const bz = Math.sin(angle) * 78.5;
      const lightBar = new THREE.Mesh(
        new THREE.BoxGeometry(8, 0.8, 0.5),
        new THREE.MeshBasicMaterial({ color: '#00f0ff' })
      );
      lightBar.position.set(bx, 15.5, bz);
      lightBar.rotation.y = -angle + Math.PI / 2;
      skywalkRingGroup.add(lightBar);
    }

    // Cantilevered Street Light Poles on Skywalk
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
      const lx = Math.cos(angle) * 76;
      const lz = Math.sin(angle) * 76;
      const pole = createRigidMesh(
        new THREE.CylinderGeometry(0.3, 0.4, 7, 8),
        new THREE.MeshStandardMaterial({ color: '#334155' }),
        '#64748b', 0.8
      );
      pole.position.set(lx, 19.5, lz);
      skywalkRingGroup.add(pole);

      const lampHead = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.4, 0.8),
        new THREE.MeshBasicMaterial({ color: '#ffffff' })
      );
      lampHead.position.set(lx, 23.2, lz);
      lampHead.rotation.y = -angle;
      skywalkRingGroup.add(lampHead);
    }

    // Radial Structural Support Columns
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
      const px = Math.cos(angle) * 73;
      const pz = Math.sin(angle) * 73;
      const pylon = createRigidMesh(
        new THREE.CylinderGeometry(2.0, 2.6, 16, 8),
        new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.5 }),
        '#64748b', 0.8
      );
      pylon.position.set(px, 8, pz);
      skywalkRingGroup.add(pylon);
    }

    // Primary Illuminated Road Avenues (North-South & East-West)
    const roadMat = new THREE.MeshBasicMaterial({ color: '#111827' });
    const stripeMat = new THREE.MeshBasicMaterial({ color: '#facc15' });
    const cyanCrossMat = new THREE.MeshBasicMaterial({ color: '#06b6d4' });

    // Main Avenue E-W (z = 0)
    const roadEW = new THREE.Mesh(new THREE.PlaneGeometry(800, 24), roadMat);
    roadEW.rotation.x = -Math.PI / 2;
    roadEW.position.set(0, 0.06, 0);
    groundGroup.add(roadEW);

    const stripeEW = new THREE.Mesh(new THREE.PlaneGeometry(800, 1.2), stripeMat);
    stripeEW.rotation.x = -Math.PI / 2;
    stripeEW.position.set(0, 0.09, 0);
    groundGroup.add(stripeEW);

    // Main Avenue N-S (x = 0)
    const roadNS = new THREE.Mesh(new THREE.PlaneGeometry(24, 800), roadMat);
    roadNS.rotation.x = -Math.PI / 2;
    roadNS.position.set(0, 0.06, 0);
    groundGroup.add(roadNS);

    const stripeNS = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 800), stripeMat);
    stripeNS.rotation.x = -Math.PI / 2;
    stripeNS.position.set(0, 0.09, 0);
    groundGroup.add(stripeNS);

    // Watson Avenue (z = -60)
    const roadWatson = new THREE.Mesh(new THREE.PlaneGeometry(600, 18), roadMat);
    roadWatson.rotation.x = -Math.PI / 2;
    roadWatson.position.set(80, 0.06, -60);
    groundGroup.add(roadWatson);

    // 7. Distant Wireframe Holographic Earth in Sky
    const earthGroup = new THREE.Group();
    earthGroup.position.set(-450, 420, -600);
    scene.add(earthGroup);

    const earthGeo = new THREE.SphereGeometry(90, 36, 36);
    const earthMat = new THREE.MeshBasicMaterial({ color: '#00f0ff', wireframe: true, transparent: true, opacity: 0.45 });
    earthGroup.add(new THREE.Mesh(earthGeo, earthMat));

    // Starfield in celestial void
    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i]   = (Math.random() - 0.5) * 2500;
      starPos[i+1] = Math.random() * 900 + 40;
      starPos[i+2] = (Math.random() - 0.5) * 2500;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: '#e2e8f0', size: 1.8, transparent: true, opacity: 0.75 })));

    // 8. Building Assembly & Clickable List
    const buildingsGroup = new THREE.Group();
    scene.add(buildingsGroup);

    const subsurfaceGroup = new THREE.Group();
    scene.add(subsurfaceGroup);

    const clickableList = [];
    const bMap = {};
    simulationBuildings.forEach(b => { bMap[b.building_id] = b; });

    let flameLight1 = null;
    let flameLight2 = null;
    let elCar1 = null;
    let avArasakaPatrol = null;
    let avDelamainPatrol = null;
    let fishOrange = null;
    let fishCyan = null;
    let arasakaLightStrobe = null;

    // Shared window textures
    const texRed = createWindowTexture(20, 50, 0.65, '#ef4444');
    const texCyan = createWindowTexture(20, 50, 0.65, '#00f0ff');
    const texGold = createWindowTexture(20, 50, 0.65, '#fbbf24');
    const texEmerald = createWindowTexture(20, 50, 0.65, '#10b981');
    const texBlue = createWindowTexture(20, 50, 0.65, '#3b82f6');
    const texPink = createWindowTexture(20, 50, 0.65, '#f43f5e');

    // ══════════════════════════════════════════════════════════════════════════
    // STRUCTURE 1: ARASAKA TOWER (Exact Cyberpunk 2077 Screenshot Monolith)
    // Matches the user's provided in-game screenshot:
    // 1. Dark matte charcoal/slate faceted octagonal prism (340m tall)
    // 2. White glowing circular Arasaka crest near the top
    // 3. Razor-sharp glowing white/cyan vertical laser line running down the lower center
    // 4. Massive diagonal inverted triangular chamfer facets on lower flanks
    // 5. Stepped vertical fluting parapet fins along top rim
    // ══════════════════════════════════════════════════════════════════════════
    const b1 = bMap['NC-BLD-00001'];
    if (b1) {
      const arasakaGroup = new THREE.Group();
      arasakaGroup.position.set(0, 0, -50);

      // Authentic matte charcoal & obsidian composite materials matching screenshot
      const towerCharcoalMat = new THREE.MeshStandardMaterial({
        color: '#0e131e',
        roughness: 0.35,
        metalness: 0.85,
      });

      const towerDarkAccentMat = new THREE.MeshStandardMaterial({
        color: '#090d16',
        roughness: 0.25,
        metalness: 0.9,
      });

      // ─── A. MAIN OCTAGONAL FACETED MONOLITH (y: 0 to 330m) ──────────────────
      // Central body core
      const coreTower = createRigidMesh(
        new THREE.BoxGeometry(46, 330, 46),
        towerCharcoalMat,
        '#38bdf8', 0.4, 15
      );
      coreTower.position.y = 165;
      arasakaGroup.add(coreTower);

      // Stepped front facade panel (creates the central recessed canyon)
      const frontLeftPylon = createRigidMesh(
        new THREE.BoxGeometry(16, 325, 4),
        towerDarkAccentMat,
        '#38bdf8', 0.45
      );
      frontLeftPylon.position.set(-15, 162.5, 23.5);
      arasakaGroup.add(frontLeftPylon);

      const frontRightPylon = createRigidMesh(
        new THREE.BoxGeometry(16, 325, 4),
        towerDarkAccentMat,
        '#38bdf8', 0.45
      );
      frontRightPylon.position.set(15, 162.5, 23.5);
      arasakaGroup.add(frontRightPylon);

      // 45-Degree Beveled Corner Chamfers (Octagonal profile)
      const chamferAngles = [
        { x: -23, z: 23, rot: Math.PI / 4 },
        { x: 23,  z: 23, rot: -Math.PI / 4 },
        { x: -23, z: -23, rot: -Math.PI / 4 },
        { x: 23,  z: -23, rot: Math.PI / 4 },
      ];
      chamferAngles.forEach(c => {
        const chamfer = createRigidMesh(
          new THREE.BoxGeometry(14, 330, 2),
          towerDarkAccentMat,
          '#38bdf8', 0.35
        );
        chamfer.position.set(c.x, 165, c.z);
        chamfer.rotation.y = c.rot;
        arasakaGroup.add(chamfer);
      });

      // ─── B. LOWER ANGULAR INVERTED TRIANGULAR CHAMFERS (As in screenshot) ──
      // In the screenshot, the lower half features massive diagonal triangular facets cut into both sides
      const leftChamferWedge = createRigidMesh(
        new THREE.BoxGeometry(12, 145, 14),
        towerDarkAccentMat,
        '#38bdf8', 0.55
      );
      leftChamferWedge.position.set(-27, 85, 17);
      leftChamferWedge.rotation.z = -0.12;
      arasakaGroup.add(leftChamferWedge);

      const rightChamferWedge = createRigidMesh(
        new THREE.BoxGeometry(12, 145, 14),
        towerDarkAccentMat,
        '#38bdf8', 0.55
      );
      rightChamferWedge.position.set(27, 85, 17);
      rightChamferWedge.rotation.z = 0.12;
      arasakaGroup.add(rightChamferWedge);

      // ─── C. CENTER RAZOR-SHARP VERTICAL WHITE/CYAN LASER SEAM ──────────────
      // In the screenshot: a thin, pure white vertical line glowing down the lower center
      const centerLaser = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 125, 1.2),
        new THREE.MeshBasicMaterial({ color: '#ffffff' })
      );
      centerLaser.position.set(0, 80, 24.5);
      arasakaGroup.add(centerLaser);

      // Outer cyan luminous aura strip
      const centerLaserAura = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 125, 0.4),
        new THREE.MeshBasicMaterial({ color: '#00f0ff', transparent: true, opacity: 0.65 })
      );
      centerLaserAura.position.set(0, 80, 24.6);
      arasakaGroup.add(centerLaserAura);

      // Seam illumination glow
      const laserGlowLight = new THREE.PointLight('#e0f2fe', 3.5, 45, 1.5);
      laserGlowLight.position.set(0, 75, 26.5);
      arasakaGroup.add(laserGlowLight);

      // ─── D. TOP CIRCULAR WHITE GLOWING ARASAKA CREST (As in screenshot) ────
      // In the screenshot: prominent circular white glowing Arasaka emblem high near the apex
      const circularLogoTex = createArasakaCircularLogoTexture();
      const circularLogoMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(28, 28),
        new THREE.MeshBasicMaterial({ map: circularLogoTex, side: THREE.DoubleSide, transparent: true })
      );
      circularLogoMesh.position.set(0, 290, 24.5);
      arasakaGroup.add(circularLogoMesh);

      // Brilliant white logo spotlight glow
      const logoSpotLight = new THREE.PointLight('#ffffff', 6.0, 75, 1.2);
      logoSpotLight.position.set(0, 290, 28);
      arasakaGroup.add(logoSpotLight);

      // ─── E. STEPPED VERTICAL CROWN PARAPET FINS (FLUTING) ──────────────────
      // Top parapet crenellations matching screenshot skyline silhouette
      for (let fx = -20; fx <= 20; fx += 5) {
        const finH = fx === 0 ? 22 : (Math.abs(fx) < 12 ? 18 : 14);
        const fluteFin = createRigidMesh(
          new THREE.BoxGeometry(3.5, finH, 3),
          towerDarkAccentMat,
          '#ffffff', 0.65
        );
        fluteFin.position.set(fx, 330 + finH / 2, 23.5);
        arasakaGroup.add(fluteFin);
      }

      // High-altitude apex aviation warning light
      const apexStrobe = new THREE.PointLight('#ffffff', 4.0, 90);
      apexStrobe.position.set(0, 355, 0);
      arasakaGroup.add(apexStrobe);

      // Clickable CAD telemetry binding
      [coreTower, frontLeftPylon, frontRightPylon, leftChamferWedge, rightChamferWedge].forEach(part => {
        part.userData = { building: b1 };
        clickableList.push(part);
      });

      buildingsGroup.add(arasakaGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STRUCTURE 2: MEGABUILDING H10 (Watson Arcology - Open Central Atrium - 190m)
    // ══════════════════════════════════════════════════════════════════════════
    const b2 = bMap['NC-BLD-00002'];
    if (b2) {
      const megaGroup = new THREE.Group();
      megaGroup.position.set(100, 0, -85);

      const megaMat = new THREE.MeshStandardMaterial({
        color: '#1c2438',
        roughness: 0.35,
        metalness: 0.6,
        map: texCyan,
        emissive: '#06b6d4',
        emissiveMap: texCyan,
        emissiveIntensity: 0.45,
      });

      // 4 perimeter wings forming hollow inner courtyard (34m open center)
      const wN = createRigidMesh(new THREE.BoxGeometry(68, 190, 16), megaMat, '#eab308', 0.9, 15);
      wN.position.set(0, 95, -26);
      megaGroup.add(wN);

      const wS = createRigidMesh(new THREE.BoxGeometry(68, 190, 16), megaMat, '#eab308', 0.9, 15);
      wS.position.set(0, 95, 26);
      megaGroup.add(wS);

      const wE = createRigidMesh(new THREE.BoxGeometry(16, 190, 36), megaMat, '#06b6d4', 0.9, 15);
      wE.position.set(26, 95, 0);
      megaGroup.add(wE);

      const wW = createRigidMesh(new THREE.BoxGeometry(16, 190, 36), megaMat, '#06b6d4', 0.9, 15);
      wW.position.set(-26, 95, 0);
      megaGroup.add(wW);

      // Industrial Yellow Exterior Elevator Tracks
      const elGeo = new THREE.BoxGeometry(4, 190, 4);
      const elMat = new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.3 });
      const elTrack1 = createRigidMesh(elGeo, elMat, '#facc15', 0.95);
      elTrack1.position.set(-35, 95, 12);
      megaGroup.add(elTrack1);

      const elTrack2 = createRigidMesh(elGeo, elMat, '#facc15', 0.95);
      elTrack2.position.set(35, 95, 12);
      megaGroup.add(elTrack2);

      // Active Animated Yellow Exterior Elevator Car
      const elCarGeo = new THREE.BoxGeometry(6, 8, 6);
      const elCarMat = new THREE.MeshStandardMaterial({
        color: '#facc15',
        roughness: 0.25,
        metalness: 0.6,
        emissive: '#facc15',
        emissiveIntensity: 0.35,
      });
      elCar1 = createRigidMesh(elCarGeo, elCarMat, '#ffffff', 1.0);
      elCar1.position.set(-35, 30, 12);
      megaGroup.add(elCar1);

      // Interior illuminated passenger glow
      const elLight = new THREE.PointLight('#00f0ff', 2.0, 18);
      elLight.position.set(0, 0, 0);
      elCar1.add(elLight);

      // Massive Watson Megabuilding H10 Billboard
      const h10Tex = createBillboardTexture('MEGABUILDING H10', 'WATSON SECTOR 01 • RESIDENTIAL ARCOLOGY', 'NIGHT CITY HOUSING', '#00f0ff', '#facc15');
      const h10Sign = new THREE.Mesh(new THREE.PlaneGeometry(54, 16), new THREE.MeshBasicMaterial({ map: h10Tex, side: THREE.DoubleSide }));
      h10Sign.position.set(0, 165, 34.5);
      megaGroup.add(h10Sign);

      // Iconic "NICOLA: TASTE THE LOVE!" Billboard on North side
      const nicolaTex = createBillboardTexture('NICOLA !', 'TASTE THE LOVE • 100% SYNTHETIC FRESH', 'NICOLA BEVERAGE CORP', '#ec4899', '#ffffff');
      const nicolaSign = new THREE.Mesh(new THREE.PlaneGeometry(54, 16), new THREE.MeshBasicMaterial({ map: nicolaTex, side: THREE.DoubleSide }));
      nicolaSign.position.set(0, 120, -34.5);
      nicolaSign.rotation.y = Math.PI;
      megaGroup.add(nicolaSign);

      // "KIROSHI OPTICS" Cyberware Billboard on East side
      const kiroshiTex = createCyberpunkAdTexture('KIROSHI OPTICS', 'SCAN THE CITY', 'OCULAR IMPLANTS // MK.IV THREAT DETECT', '#00f0ff', '#38bdf8');
      const kiroshiSign = new THREE.Mesh(new THREE.PlaneGeometry(36, 18), new THREE.MeshBasicMaterial({ map: kiroshiTex, side: THREE.DoubleSide }));
      kiroshiSign.position.set(34.5, 90, 0);
      kiroshiSign.rotation.y = Math.PI / 2;
      megaGroup.add(kiroshiSign);

      // "NO FUTURE" Neon Graffiti Banner on West side
      const noFutureTex = createVerticalSignTexture('NO FUTURE', '#ff003c', '#080812');
      const noFutureSign = new THREE.Mesh(new THREE.PlaneGeometry(6, 32), new THREE.MeshBasicMaterial({ map: noFutureTex, side: THREE.DoubleSide }));
      noFutureSign.position.set(-34.5, 75, 0);
      noFutureSign.rotation.y = -Math.PI / 2;
      megaGroup.add(noFutureSign);

      wN.userData = { building: b2 };
      wS.userData = { building: b2 };
      wE.userData = { building: b2 };
      wW.userData = { building: b2 };
      clickableList.push(wN, wS, wE, wW);
      buildingsGroup.add(megaGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STRUCTURE 3: MILITECH HEADQUARTERS (Corpo Plaza West - 165m Stepped Wedge)
    // ══════════════════════════════════════════════════════════════════════════
    const b3 = bMap['NC-BLD-00003'];
    if (b3) {
      const militechGroup = new THREE.Group();
      militechGroup.position.set(-72, 0, -30);

      const goldMat = new THREE.MeshStandardMaterial({
        color: '#2d220a',
        roughness: 0.25,
        metalness: 0.85,
        map: texGold,
        emissive: '#eab308',
        emissiveMap: texGold,
        emissiveIntensity: 0.45,
      });

      // Main Tower (Height 280m)
      const m1 = createRigidMesh(new THREE.BoxGeometry(44, 280, 46), goldMat, '#facc15', 0.85, 15);
      m1.position.y = 140;
      militechGroup.add(m1);

      // Vertical Yellow Lighting Ribs on Corners (as seen in screenshot)
      for (let side = -1; side <= 1; side += 2) {
        const rib = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 280, 2.2),
          new THREE.MeshBasicMaterial({ color: '#facc15' })
        );
        rib.position.set(side * 22, 140, 23.2);
        militechGroup.add(rib);
      }

      // Stacked Vertical Bright Cyberpunk Billboards (as in screenshot)
      const allFoodsTex = createBillboardTexture('ALL FOODS', 'ORGANIC SYNTHETIC FOOD PASTE • MEAT ZERO', 'ALL FOODS CORP', '#facc15', '#ffffff');
      const allFoodsSign = new THREE.Mesh(
        new THREE.PlaneGeometry(36, 18),
        new THREE.MeshBasicMaterial({ map: allFoodsTex, side: THREE.DoubleSide })
      );
      allFoodsSign.position.set(0, 195, 23.4);
      militechGroup.add(allFoodsSign);

      const yellowSignTex = createVerticalSignTexture('ALL-FOODS', '#facc15', '#0c0a04');
      const vertYellowSign = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 32),
        new THREE.MeshBasicMaterial({ map: yellowSignTex, side: THREE.DoubleSide })
      );
      vertYellowSign.position.set(16, 120, 23.3);
      militechGroup.add(vertYellowSign);

      const leftGlow = new THREE.PointLight('#facc15', 5.0, 80, 1.2);
      leftGlow.position.set(0, 195, 28);
      militechGroup.add(leftGlow);

      m1.userData = { building: b3 };
      clickableList.push(m1);
      buildingsGroup.add(militechGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STRUCTURE 4: THE AFTERLIFE MERCENARY CLUB (Watson Bunker)
    // ══════════════════════════════════════════════════════════════════════════
    const b4 = bMap['NC-BLD-00004'];
    if (b4) {
      const afterlifeGroup = new THREE.Group();
      afterlifeGroup.position.set(-110, 0, 90);

      // Low-slung reinforced concrete brutalist bunker
      const bunker = createRigidMesh(
        new THREE.BoxGeometry(44, 18, 34),
        new THREE.MeshStandardMaterial({ color: '#1f2937', roughness: 0.8, metalness: 0.3 }),
        '#22c55e', 0.9, 15
      );
      bunker.position.y = 9;
      afterlifeGroup.add(bunker);

      // Upper mechanical plant room
      const plant = createRigidMesh(
        new THREE.BoxGeometry(26, 10, 20),
        new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.7 }),
        '#ec4899', 0.9, 15
      );
      plant.position.set(0, 23, 0);
      afterlifeGroup.add(plant);

      // Rooftop Industrial HVAC Cooling Turbines
      const fan1 = createRigidMesh(new THREE.CylinderGeometry(4, 4, 3, 16), new THREE.MeshStandardMaterial({ color: '#374151' }), '#22c55e', 0.8);
      fan1.position.set(-6, 29, 0);
      afterlifeGroup.add(fan1);

      const fan2 = createRigidMesh(new THREE.CylinderGeometry(4, 4, 3, 16), new THREE.MeshStandardMaterial({ color: '#374151' }), '#22c55e', 0.8);
      fan2.position.set(6, 29, 0);
      afterlifeGroup.add(fan2);

      // Iconic Neon Skull & "AFTERLIFE" Sign
      const afterTex = createBillboardTexture('THE AFTERLIFE', 'LEGENDS ARE MADE HERE • MERC CLUB', 'AFTERLIFE WATSON', '#22c55e', '#ec4899');
      const afterSign = new THREE.Mesh(new THREE.PlaneGeometry(32, 10), new THREE.MeshBasicMaterial({ map: afterTex, side: THREE.DoubleSide }));
      afterSign.position.set(0, 20, 17.2);
      afterlifeGroup.add(afterSign);

      // Toxic green recessed club entrance arch
      const arch = createRigidMesh(new THREE.BoxGeometry(10, 8, 4), new THREE.MeshBasicMaterial({ color: '#22c55e', wireframe: true }), '#4ade80', 1.0);
      arch.position.set(0, 4, 17.5);
      afterlifeGroup.add(arch);

      bunker.userData = { building: b4 };
      clickableList.push(bunker);
      buildingsGroup.add(afterlifeGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STRUCTURE 5: KANG TAO SPIRE (Corpo Plaza East - 185m Eco-Tower)
    // ══════════════════════════════════════════════════════════════════════════
    const b5 = bMap['NC-BLD-00005'];
    if (b5) {
      const ktGroup = new THREE.Group();
      ktGroup.position.set(40, 0, 30);

      const ktMat = new THREE.MeshStandardMaterial({
        color: '#0f291e',
        roughness: 0.2,
        metalness: 0.8,
        map: texEmerald,
        emissive: '#059669',
        emissiveMap: texEmerald,
        emissiveIntensity: 0.45,
      });

      // Hexagonal Crystalline Tower 1
      const kt1 = createRigidMesh(new THREE.CylinderGeometry(22, 26, 90, 6), ktMat, '#10b981', 0.9);
      kt1.position.y = 45;
      ktGroup.add(kt1);

      // Hexagonal Crystalline Tower 2
      const kt2 = createRigidMesh(new THREE.CylinderGeometry(16, 20, 70, 6), ktMat, '#34d399', 0.9);
      kt2.position.y = 90 + 35;
      ktGroup.add(kt2);

      // Hexagonal Apex
      const kt3 = createRigidMesh(new THREE.CylinderGeometry(4, 14, 25, 6), new THREE.MeshStandardMaterial({ color: '#064e3b', roughness: 0.15, metalness: 0.9 }), '#a7f3d0', 0.9);
      kt3.position.y = 160 + 12.5;
      ktGroup.add(kt3);

      // Cantilevered Green Sky-Gardens on Tier 1
      const garden = createRigidMesh(new THREE.TorusGeometry(23, 2, 8, 24), new THREE.MeshStandardMaterial({ color: '#059669' }), '#10b981', 0.85);
      garden.rotation.x = Math.PI / 2;
      garden.position.y = 90;
      ktGroup.add(garden);

      // Kang Tao Sign
      const ktTex = createBillboardTexture('KANG TAO', 'SMART ARMS & ADVANCED ENERGY SPIRE', 'KANG TAO CORP', '#10b981', '#ffffff');
      const ktSign = new THREE.Mesh(new THREE.PlaneGeometry(32, 10), new THREE.MeshBasicMaterial({ map: ktTex, side: THREE.DoubleSide }));
      ktSign.position.set(0, 145, 17);
      ktGroup.add(ktSign);

      kt1.userData = { building: b5 };
      kt2.userData = { building: b5 };
      clickableList.push(kt1, kt2);
      buildingsGroup.add(ktGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STRUCTURE 6: NO-TELL MOTEL & KABUKI ARCADE (Watson)
    // ══════════════════════════════════════════════════════════════════════════
    const b6 = bMap['NC-BLD-00006'];
    if (b6) {
      const motelGroup = new THREE.Group();
      motelGroup.position.set(75, 0, 110);

      // 4-story U-shaped motel building
      const motelBody = createRigidMesh(
        new THREE.BoxGeometry(38, 20, 24),
        new THREE.MeshStandardMaterial({ color: '#27272a', roughness: 0.7 }),
        '#fbbf24', 0.9, 15
      );
      motelBody.position.y = 10;
      motelGroup.add(motelBody);

      // Open exterior yellow balcony walkways
      for (let floor = 1; floor <= 3; floor++) {
        const balcony = createRigidMesh(
          new THREE.BoxGeometry(36, 0.8, 4),
          new THREE.MeshStandardMaterial({ color: '#facc15' }),
          '#facc15', 1.0
        );
        balcony.position.set(0, floor * 5, 12.5);
        motelGroup.add(balcony);
      }

      // Vertical "NO-TELL MOTEL" Neon Sign
      const noTellTex = createVerticalSignTexture('NO-TELL', '#f43f5e', '#0c0a14');
      const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(5, 20), new THREE.MeshBasicMaterial({ map: noTellTex, side: THREE.DoubleSide }));
      signMesh.position.set(-21, 16, 12);
      motelGroup.add(signMesh);

      motelBody.userData = { building: b6 };
      clickableList.push(motelBody);
      buildingsGroup.add(motelGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STRUCTURE 7: CORPO PLAZA SKYWAY & TRAUMA TEAM AIRWAY
    // ══════════════════════════════════════════════════════════════════════════
    const b7 = bMap['NC-BLD-00007'];
    if (b7) {
      const skyGroup = new THREE.Group();
      skyGroup.position.set(-100, 0, -32);

      // Physical Floor 42 Skybridge connecting Arasaka (-60,-40) and Militech (-140,-25)
      const bridgeGeo = new THREE.BoxGeometry(80, 8, 8);
      const bridgeMat = new THREE.MeshStandardMaterial({
        color: '#0284c7',
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.85,
      });
      const bridge = createRigidMesh(bridgeGeo, bridgeMat, '#38bdf8', 0.95);
      bridge.position.set(0, 168, 0);
      bridge.rotation.y = 0.18;
      skyGroup.add(bridge);

      // Volumetric Magenta Air Mobility Lane
      const laneGeo = new THREE.BoxGeometry(160, 40, 40);
      const laneMat = new THREE.MeshBasicMaterial({ color: '#d946ef', wireframe: true, transparent: true, opacity: 0.35 });
      const airLane = new THREE.Mesh(laneGeo, laneMat);
      airLane.position.set(0, 200, 0);
      skyGroup.add(airLane);

      bridge.userData = { building: b7 };
      clickableList.push(bridge);
      buildingsGroup.add(skyGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STRUCTURE 8: KONPEKI PLAZA (Waterfront Luxury Mega-Resort - 210m)
    // ══════════════════════════════════════════════════════════════════════════
    const b8 = bMap['NC-BLD-00008'];
    if (b8) {
      const konpekiGroup = new THREE.Group();
      konpekiGroup.position.set(-190, 0, 80);

      const goldMat = new THREE.MeshStandardMaterial({
        color: '#2e2308',
        roughness: 0.2,
        metalness: 0.85,
        map: texGold,
        emissive: '#b45309',
        emissiveMap: texGold,
        emissiveIntensity: 0.5,
      });

      // Curved luxury twin tower block - Base (110m)
      const kp1 = createRigidMesh(new THREE.BoxGeometry(60, 110, 42), goldMat, '#fbbf24', 0.9, 15);
      kp1.position.y = 55;
      konpekiGroup.add(kp1);

      // Mid Tower (70m)
      const kp2 = createRigidMesh(new THREE.BoxGeometry(48, 70, 36), goldMat, '#f59e0b', 0.9, 15);
      kp2.position.y = 110 + 35;
      konpekiGroup.add(kp2);

      // Cantilevered Yorinobu Penthouse Suite (Floor 58)
      const kpPent = createRigidMesh(
        new THREE.BoxGeometry(56, 30, 42),
        new THREE.MeshStandardMaterial({ color: '#181204', roughness: 0.15, metalness: 0.9 }),
        '#fef08a', 0.95, 10
      );
      kpPent.position.set(6, 180 + 15, 0);
      konpekiGroup.add(kpPent);

      // Private Yorinobu AV Landing Pad
      const kpPad = createRigidMesh(new THREE.CylinderGeometry(10, 10, 1.2, 24), new THREE.MeshStandardMaterial({ color: '#1f2937' }), '#fbbf24', 0.9);
      kpPad.position.set(16, 210.8, 0);
      konpekiGroup.add(kpPad);

      // Waterfront Marina Pier & Promenade
      const pier = createRigidMesh(new THREE.BoxGeometry(110, 3, 24), new THREE.MeshStandardMaterial({ color: '#0f172a' }), '#38bdf8', 0.85);
      pier.position.set(0, 1.5, 40);
      konpekiGroup.add(pier);

      // Glowing "KONPEKI PLAZA" Billboard
      const kpTex = createBillboardTexture('KONPEKI PLAZA', 'ARASAKA WATERFRONT LUXURY RESORT & MARINA', 'KONPEKI GROUP', '#fbbf24', '#ffffff');
      const kpSign = new THREE.Mesh(new THREE.PlaneGeometry(42, 12), new THREE.MeshBasicMaterial({ map: kpTex, side: THREE.DoubleSide }));
      kpSign.position.set(0, 168, 19);
      konpekiGroup.add(kpSign);

      kp1.userData = { building: b8 };
      kp2.userData = { building: b8 };
      kpPent.userData = { building: b8 };
      clickableList.push(kp1, kp2, kpPent);
      buildingsGroup.add(konpekiGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STRUCTURE 9: MEGABUILDING H08 (Japantown Arcology - 195m)
    // ══════════════════════════════════════════════════════════════════════════
    const b9 = bMap['NC-BLD-00009'];
    if (b9) {
      const h08Group = new THREE.Group();
      h08Group.position.set(160, 0, -15);

      const h08Mat = new THREE.MeshStandardMaterial({
        color: '#281328',
        roughness: 0.3,
        metalness: 0.65,
        map: texPink,
        emissive: '#be185d',
        emissiveMap: texPink,
        emissiveIntensity: 0.45,
      });

      // Brutalist perimeter arcology
      const bArch = createRigidMesh(new THREE.BoxGeometry(64, 195, 64), h08Mat, '#ec4899', 0.9, 15);
      bArch.position.y = 97.5;
      h08Group.add(bArch);

      // Stepped crown terrace
      const bCrown = createRigidMesh(new THREE.BoxGeometry(46, 20, 46), new THREE.MeshStandardMaterial({ color: '#160816' }), '#f472b6', 0.9, 10);
      bCrown.position.y = 195 + 10;
      h08Group.add(bCrown);

      // Japantown H08 Billboard
      const h08Tex = createBillboardTexture('MEGABUILDING H08', 'JAPANTOWN METROPOLITAN ARCOLOGY', 'WESTBROOK SECTOR', '#ec4899', '#ffffff');
      const h08Sign = new THREE.Mesh(new THREE.PlaneGeometry(50, 14), new THREE.MeshBasicMaterial({ map: h08Tex, side: THREE.DoubleSide }));
      h08Sign.position.set(0, 160, 32.5);
      h08Group.add(h08Sign);

      bArch.userData = { building: b9 };
      clickableList.push(bArch);
      buildingsGroup.add(h08Group);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STRUCTURE 10: DELAMAIN AI OPERATIONS HUB (Japantown/Watson)
    // ══════════════════════════════════════════════════════════════════════════
    const b10 = bMap['NC-BLD-00010'];
    if (b10) {
      const delaGroup = new THREE.Group();
      delaGroup.position.set(130, 0, 75);

      // Hexagonal Futuristic AI Pavilion
      const delaBody = createRigidMesh(
        new THREE.CylinderGeometry(24, 28, 45, 6),
        new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.2, metalness: 0.8 }),
        '#00f0ff', 0.95
      );
      delaBody.position.y = 22.5;
      delaGroup.add(delaBody);

      // Central glowing blue AI core dome
      const coreDome = createRigidMesh(
        new THREE.SphereGeometry(12, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: '#00f0ff', wireframe: true }),
        '#00f0ff', 1.0
      );
      coreDome.position.y = 45;
      delaGroup.add(coreDome);

      // Autonomous Yellow Delamain Cabs Queued at Bays
      for (let i = 0; i < 3; i++) {
        const cab = createRigidMesh(
          new THREE.BoxGeometry(6, 2.8, 12),
          new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.3, metalness: 0.5 }),
          '#111827', 0.9
        );
        cab.position.set(22 + i * 9, 1.4, 10);
        delaGroup.add(cab);
      }

      // Delamain Corp Sign
      const delaTex = createBillboardTexture('DELAMAIN AI', 'AUTOMATED FLEET & EXCELSIOR SERVICE', 'DELAMAIN CORP', '#00f0ff', '#ffffff');
      const delaSign = new THREE.Mesh(new THREE.PlaneGeometry(28, 9), new THREE.MeshBasicMaterial({ map: delaTex, side: THREE.DoubleSide }));
      delaSign.position.set(0, 36, 24.5);
      delaGroup.add(delaSign);

      delaBody.userData = { building: b10 };
      clickableList.push(delaBody);
      buildingsGroup.add(delaGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STRUCTURE 11: TYGER CLAWS NEON PAGODA & JIG-JIG STREET (Japantown)
    // ══════════════════════════════════════════════════════════════════════════
    const b11 = bMap['NC-BLD-00011'];
    if (b11) {
      const pagodaGroup = new THREE.Group();
      pagodaGroup.position.set(20, 0, 125);

      // 5-Tier Cyberpunk Pagoda
      for (let tier = 0; tier < 5; tier++) {
        const tierW = 28 - tier * 4.2;
        const tierH = 11;
        const tierY = tier * 12 + 5.5;

        // Tier Body
        const tBody = createRigidMesh(
          new THREE.BoxGeometry(tierW, tierH, tierW),
          new THREE.MeshStandardMaterial({ color: '#2b0909', roughness: 0.35, metalness: 0.65 }),
          '#dc2626', 0.95, 10
        );
        tBody.position.y = tierY;
        pagodaGroup.add(tBody);

        // Flaring curved eave roof
        const eave = createRigidMesh(
          new THREE.ConeGeometry(tierW * 0.9, 3.5, 4),
          new THREE.MeshStandardMaterial({ color: '#18181b', roughness: 0.3, metalness: 0.8 }),
          '#06b6d4', 0.9
        );
        eave.rotation.y = Math.PI / 4;
        eave.position.y = tierY + tierH / 2 + 1.2;
        pagodaGroup.add(eave);
      }

      // Vertical "JIG-JIG" Kanji Neon Sign
      const jjTex = createVerticalSignTexture('JIG-JIG', '#dc2626', '#140505');
      const jjSign = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 18), new THREE.MeshBasicMaterial({ map: jjTex, side: THREE.DoubleSide }));
      jjSign.position.set(16, 20, 16);
      pagodaGroup.add(jjSign);

      const pBase = pagodaGroup.children[0];
      if (pBase) {
        pBase.userData = { building: b11 };
        clickableList.push(pBase);
      }
      buildingsGroup.add(pagodaGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // STRUCTURE 12: PETROCHEM REFINERY & ENERGY SPIRE (Industrial District)
    // ══════════════════════════════════════════════════════════════════════════
    const b12 = bMap['NC-BLD-00012'];
    if (b12) {
      const petroGroup = new THREE.Group();
      petroGroup.position.set(72, 0, -30);

      const petroGlassMat = new THREE.MeshStandardMaterial({
        color: '#0a0f1c',
        roughness: 0.2,
        metalness: 0.9,
      });

      // Main Corporate Tower (Height 270m)
      const pTower = createRigidMesh(
        new THREE.BoxGeometry(44, 270, 46),
        petroGlassMat,
        '#ff6b22', 0.5, 15
      );
      pTower.position.y = 135;
      petroGroup.add(pTower);

      // Angled crown setback
      const pCrown = createRigidMesh(
        new THREE.BoxGeometry(36, 25, 38),
        new THREE.MeshStandardMaterial({ color: '#050810', roughness: 0.3, metalness: 0.85 }),
        '#ff6b22', 0.7
      );
      pCrown.position.y = 270 + 12.5;
      petroGroup.add(pCrown);

      // Exact Glowing Neon Orange PETROCHEM Billboard (From Screenshot)
      const petroTex = createPetrochemLogoTexture();
      const petroSign = new THREE.Mesh(
        new THREE.PlaneGeometry(36, 25),
        new THREE.MeshBasicMaterial({ map: petroTex, side: THREE.DoubleSide })
      );
      petroSign.position.set(0, 205, 23.4);
      petroGroup.add(petroSign);

      // Neon orange sign illumination
      const petroGlow = new THREE.PointLight('#ff6b22', 5.5, 80, 1.2);
      petroGlow.position.set(0, 205, 28);
      petroGroup.add(petroGlow);

      // Stacked Vertical Cyberpunk 2077 Posters below the sign (as seen in screenshot)
      const posterTex = createCyberpunkPosterStackTexture();
      const posterMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 32),
        new THREE.MeshBasicMaterial({ map: posterTex, side: THREE.DoubleSide })
      );
      posterMesh.position.set(-8, 125, 23.3);
      petroGroup.add(posterMesh);

      // Small secondary glowing ad panel
      const adTexSmall = createCyberpunkAdTexture('KANG TAO', 'SMART ARMS', 'LOCK-ON TARGETING', '#00f0ff', '#facc15');
      const adMeshSmall = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 16),
        new THREE.MeshBasicMaterial({ map: adTexSmall, side: THREE.DoubleSide })
      );
      adMeshSmall.position.set(10, 125, 23.3);
      petroGroup.add(adMeshSmall);

      pTower.userData = { building: b12 };
      clickableList.push(pTower);
      buildingsGroup.add(petroGroup);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // DENSE METROPOLIS SKYLINE INFILL (35+ Surrounding Skyscraper Towers)
    // ══════════════════════════════════════════════════════════════════════════
    const infillCoords = [
      // Watson & Little China
      { x: 50, z: -140, w: 28, d: 28, h: 140, c: '#00f0ff', tex: texCyan },
      { x: 120, z: -150, w: 32, d: 30, h: 165, c: '#fbbf24', tex: texGold },
      { x: 170, z: -110, w: 26, d: 26, h: 130, c: '#00f0ff', tex: texCyan },
      { x: 40, z: -90, w: 24, d: 24, h: 110, c: '#38bdf8', tex: texBlue },
      { x: 80, z: -35, w: 30, d: 30, h: 155, c: '#f43f5e', tex: texPink },
      { x: 130, z: -45, w: 34, d: 28, h: 175, c: '#fbbf24', tex: texGold },

      // Corpo Plaza Satellite Towers
      { x: -10, z: -110, w: 36, d: 36, h: 190, c: '#ef4444', tex: texRed },
      { x: -80, z: -120, w: 30, d: 30, h: 160, c: '#38bdf8', tex: texBlue },
      { x: -120, z: -90, w: 34, d: 34, h: 180, c: '#ffffff', tex: texCyan },
      { x: -180, z: -60, w: 28, d: 28, h: 145, c: '#00f0ff', tex: texCyan },
      { x: -20, z: 40, w: 32, d: 32, h: 170, c: '#10b981', tex: texEmerald },
      { x: -70, z: 45, w: 38, d: 30, h: 185, c: '#3b82f6', tex: texBlue },

      // Japantown & Westbrook
      { x: 190, z: 30, w: 30, d: 30, h: 160, c: '#ec4899', tex: texPink },
      { x: 170, z: 80, w: 26, d: 26, h: 135, c: '#fbbf24', tex: texGold },
      { x: 80, z: 50, w: 28, d: 32, h: 150, c: '#ec4899', tex: texPink },
      { x: 55, z: 80, w: 24, d: 24, h: 120, c: '#06b6d4', tex: texCyan },

      // Heywood & Waterfront
      { x: -160, z: 25, w: 32, d: 32, h: 165, c: '#fbbf24', tex: texGold },
      { x: -150, z: 120, w: 30, d: 30, h: 140, c: '#38bdf8', tex: texBlue },
      { x: -60, z: 120, w: 26, d: 26, h: 125, c: '#ef4444', tex: texRed },
      { x: -10, z: 100, w: 28, d: 28, h: 135, c: '#10b981', tex: texEmerald },
      { x: -210, z: -20, w: 30, d: 30, h: 150, c: '#3b82f6', tex: texBlue },
    ];

    infillCoords.forEach(c => {
      const infillMat = new THREE.MeshStandardMaterial({
        color: '#181f33',
        roughness: 0.3,
        metalness: 0.7,
        map: c.tex,
        emissive: c.c,
        emissiveMap: c.tex,
        emissiveIntensity: 0.35,
      });

      const tower = createRigidMesh(new THREE.BoxGeometry(c.w, c.h, c.d), infillMat, c.c, 0.8, 15);
      tower.position.set(c.x, c.h / 2, c.z);
      buildingsGroup.add(tower);

      // Rooftop rooftop antenna with blinking aviation light
      if (c.h > 140) {
        const ant = createRigidMesh(new THREE.CylinderGeometry(0.3, 0.6, 24, 6), new THREE.MeshStandardMaterial({ color: '#94a3b8' }), '#ffffff', 0.85);
        ant.position.set(c.x, c.h + 12, c.z);
        buildingsGroup.add(ant);
      }
    });

    // ══════════════════════════════════════════════════════════════════════════
    // ELEVATED SKY-FREEWAYS & STREAMING AUTONOMOUS TRAFFIC
    // ══════════════════════════════════════════════════════════════════════════
    // Skyway Freeway 1 (E-W at y = 24m)
    const hwyMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.4 });
    const hwy1 = createRigidMesh(new THREE.BoxGeometry(600, 2.5, 14), hwyMat, '#00f0ff', 0.9);
    hwy1.position.set(0, 24, -15);
    buildingsGroup.add(hwy1);

    // Freeway support pillars
    for (let px = -250; px <= 250; px += 75) {
      const col = createRigidMesh(new THREE.CylinderGeometry(2, 2.5, 24, 12), new THREE.MeshStandardMaterial({ color: '#334155' }), '#64748b', 0.8);
      col.position.set(px, 12, -15);
      buildingsGroup.add(col);
    }

    // Streaming Cyber-Traffic Beads on Freeway 1
    const trafficCount = 36;
    const trafficGeo = new THREE.BufferGeometry();
    const trafficPos = new Float32Array(trafficCount * 3);
    const trafficColors = new Float32Array(trafficCount * 3);

    for (let i = 0; i < trafficCount; i++) {
      trafficPos[i * 3]     = (Math.random() - 0.5) * 580;
      trafficPos[i * 3 + 1] = 26;
      trafficPos[i * 3 + 2] = -15 + (i % 2 === 0 ? 3.5 : -3.5);

      // Eastbound yellow/white, Westbound red taillights
      if (i % 2 === 0) {
        trafficColors[i * 3] = 0.98; trafficColors[i * 3 + 1] = 0.8; trafficColors[i * 3 + 2] = 0.2;
      } else {
        trafficColors[i * 3] = 0.95; trafficColors[i * 3 + 1] = 0.1; trafficColors[i * 3 + 2] = 0.2;
      }
    }
    trafficGeo.setAttribute('position', new THREE.BufferAttribute(trafficPos, 3));
    trafficGeo.setAttribute('color', new THREE.BufferAttribute(trafficColors, 3));

    const trafficParticles = new THREE.Points(
      trafficGeo,
      new THREE.PointsMaterial({ size: 3.2, vertexColors: true, transparent: true, opacity: 0.95 })
    );
    buildingsGroup.add(trafficParticles);

    // ══════════════════════════════════════════════════════════════════════════
    // HOLOGRAPHIC CORPO PLAZA GIANT SWIMMING FISH (Exact Screenshot Pair)
    // In front of Arasaka Tower:
    // Left: Fiery orange/gold veiltail goldfish with glowing ribs & fan fins
    // Right: Ethereal electric cyan / ice-blue holographic fish
    // ══════════════════════════════════════════════════════════════════════════
    fishOrange = buildHolographicFish({
      bodyColor: '#ff6b00',
      secondaryColor: '#dc2626',
      glowColor: '#fef08a',
      eyeColor: '#ffffff',
      scale: 1.08,
      lightColor: '#ff7700',
      lightIntensity: 6.0
    });
    fishOrange.group.position.set(-24, 38, 20);
    fishOrange.group.rotation.y = -0.55;
    scene.add(fishOrange.group);

    fishCyan = buildHolographicFish({
      bodyColor: '#0284c7',
      secondaryColor: '#0f766e',
      glowColor: '#38bdf8',
      eyeColor: '#ffffff',
      scale: 1.0,
      lightColor: '#00f0ff',
      lightIntensity: 5.5
    });
    fishCyan.group.position.set(28, 44, 12);
    fishCyan.group.rotation.y = 0.65;
    scene.add(fishCyan.group);

    // ══════════════════════════════════════════════════════════════════════════
    // FLYING AERODYNE (AV) TRAFFIC: TRAUMA TEAM, ARASAKA GUNSHIP & DELAMAIN
    // ══════════════════════════════════════════════════════════════════════════
    // 1. Trauma Team Aerodyne (Medical Emergency Responder)
    const avGroup = new THREE.Group();
    scene.add(avGroup);

    const avBody = createRigidMesh(new THREE.BoxGeometry(8, 3.2, 16), new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.2 }), '#22c55e', 0.95);
    avGroup.add(avBody);

    const avWingL = createRigidMesh(new THREE.BoxGeometry(7, 0.6, 4), new THREE.MeshStandardMaterial({ color: '#15803d' }), '#4ade80', 0.9);
    avWingL.position.set(-7, 0.5, -1);
    avGroup.add(avWingL);

    const avWingR = createRigidMesh(new THREE.BoxGeometry(7, 0.6, 4), new THREE.MeshStandardMaterial({ color: '#15803d' }), '#4ade80', 0.9);
    avWingR.position.set(7, 0.5, -1);
    avGroup.add(avWingR);

    // Flashing Medical Strobes (Red & Blue)
    const ttBeaconRed = new THREE.PointLight('#ef4444', 3.5, 55);
    ttBeaconRed.position.set(-4.5, 2.2, 0);
    avGroup.add(ttBeaconRed);

    const ttBeaconBlue = new THREE.PointLight('#3b82f6', 3.5, 55);
    ttBeaconBlue.position.set(4.5, 2.2, 0);
    avGroup.add(ttBeaconBlue);

    // 2. Arasaka Security Gunship AV (Patrolling Corpo Plaza Sky)
    avArasakaPatrol = new THREE.Group();
    scene.add(avArasakaPatrol);

    const secBody = createRigidMesh(
      new THREE.BoxGeometry(9, 3.5, 17),
      new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.15, metalness: 0.9 }),
      '#ff003c', 0.95
    );
    avArasakaPatrol.add(secBody);

    const secCanopy = new THREE.Mesh(
      new THREE.ConeGeometry(3, 5, 4),
      new THREE.MeshBasicMaterial({ color: '#ff003c' })
    );
    secCanopy.rotation.x = Math.PI / 2;
    secCanopy.rotation.y = Math.PI / 4;
    secCanopy.position.set(0, 3.2, 5);
    avArasakaPatrol.add(secCanopy);

    // Twin Vector Thruster Nacelles on Arasaka Patrol AV
    for (let sSide = -1; sSide <= 1; sSide += 2) {
      const sNac = createRigidMesh(new THREE.CylinderGeometry(1.8, 2.2, 10, 8), new THREE.MeshStandardMaterial({ color: '#1e293b' }), '#ff003c', 0.9);
      sNac.rotation.x = Math.PI / 2;
      sNac.position.set(sSide * 5.8, 1.8, -2);
      avArasakaPatrol.add(sNac);

      const sExhaust = new THREE.Mesh(new THREE.CircleGeometry(1.5, 12), new THREE.MeshBasicMaterial({ color: '#00f0ff', side: THREE.DoubleSide }));
      sExhaust.position.set(sSide * 5.8, 1.8, -7.1);
      avArasakaPatrol.add(sExhaust);
    }

    const arasakaPatrolLight = new THREE.PointLight('#ff003c', 4.0, 75);
    arasakaPatrolLight.position.set(0, -3, 6);
    avArasakaPatrol.add(arasakaPatrolLight);

    // 3. Delamain Autonomous VIP Flying Cab
    avDelamainPatrol = new THREE.Group();
    scene.add(avDelamainPatrol);

    const delaAvBody = createRigidMesh(
      new THREE.BoxGeometry(7.5, 2.8, 15),
      new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.2, metalness: 0.8 }),
      '#facc15', 0.95
    );
    avDelamainPatrol.add(delaAvBody);

    const delaAvTop = createRigidMesh(
      new THREE.BoxGeometry(5.5, 2.2, 9),
      new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.3 }),
      '#00f0ff', 0.9
    );
    delaAvTop.position.set(0, 2.2, 0);
    avDelamainPatrol.add(delaAvTop);

    const delaLight = new THREE.PointLight('#00f0ff', 3.0, 50);
    delaLight.position.set(0, 3.5, 0);
    avDelamainPatrol.add(delaLight);

    // ══════════════════════════════════════════════════════════════════════════
    // SUBSURFACE STRATA (B1–B4 Hyperloop Tube & Maglev Bullet Pod)
    // ══════════════════════════════════════════════════════════════════════════
    const hyperTube = createRigidMesh(
      new THREE.CylinderGeometry(4.5, 4.5, 400, 16),
      new THREE.MeshBasicMaterial({ color: '#00f0ff', wireframe: true, transparent: true, opacity: 0.6 }),
      '#00f0ff', 0.8
    );
    hyperTube.rotation.z = Math.PI / 2;
    hyperTube.position.set(0, -20, 0);
    subsurfaceGroup.add(hyperTube);

    // Maglev Pod
    const maglevPod = createRigidMesh(
      new THREE.CylinderGeometry(3.5, 3.5, 24, 16),
      new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.2, metalness: 0.9 }),
      '#f43f5e', 0.95
    );
    maglevPod.rotation.z = Math.PI / 2;
    maglevPod.position.set(0, -20, 0);
    subsurfaceGroup.add(maglevPod);

    const maglevLight = new THREE.PointLight('#f43f5e', 4.0, 50);
    maglevPod.add(maglevLight);

    // ══════════════════════════════════════════════════════════════════════════
    // RAYCASTING & INTERACTIVE SELECTION
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

          // Smoothly glide camera toward selected landmark
          const anchor = NC_LOCATIONS[b.building_id];
          if (anchor && controlsRef.current) {
            controlsRef.current.target.set(anchor.x, Math.min(b.height * 0.4, 60), anchor.z);
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onPointerClick);

    // ══════════════════════════════════════════════════════════════════════════
    // ANIMATION LOOP
    // ══════════════════════════════════════════════════════════════════════════
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // 1. Orbit controls update
      if (controlsRef.current) controlsRef.current.update();

      // 2. Holographic Swimming Fish Lifelike Undulation and Floating Motion
      if (fishOrange) {
        // Floating drift in front of Arasaka Tower (left plaza)
        const f1Y = 38 + Math.sin(t * 1.5) * 3.2;
        const f1X = -24 + Math.cos(t * 0.45) * 4.5;
        const f1Z = 20 + Math.sin(t * 0.45) * 3.5;
        fishOrange.group.position.set(f1X, f1Y, f1Z);
        fishOrange.group.rotation.y = -0.55 + Math.sin(t * 0.5) * 0.15;
        fishOrange.group.rotation.x = 0.10 + Math.cos(t * 0.8) * 0.08;
        fishOrange.group.rotation.z = Math.sin(t * 1.8) * 0.12;

        // Spine undulation
        fishOrange.segments.forEach((seg, idx) => {
          seg.rotation.y = Math.sin(t * 3.4 - (idx + 1) * 0.65) * 0.22;
        });
        // Tail veil flutter
        fishOrange.tailGroup.rotation.y = Math.sin(t * 3.4 - 3.8) * 0.32;
        // Pectoral fin flap
        fishOrange.pFinL.rotation.z = 0.7 + Math.sin(t * 2.8) * 0.25;
        fishOrange.pFinR.rotation.z = -0.7 - Math.sin(t * 2.8) * 0.25;
      }

      if (fishCyan) {
        // Floating drift in front of Petrochem Tower (right plaza)
        const f2Y = 44 + Math.sin(t * 1.4 + 1.6) * 3.5;
        const f2X = 28 + Math.cos(t * 0.4 + 1.2) * 4.8;
        const f2Z = 12 + Math.sin(t * 0.4 + 1.2) * 4.0;
        fishCyan.group.position.set(f2X, f2Y, f2Z);
        fishCyan.group.rotation.y = 0.65 + Math.cos(t * 0.45 + 0.8) * 0.15;
        fishCyan.group.rotation.x = 0.08 + Math.sin(t * 0.75) * 0.07;
        fishCyan.group.rotation.z = Math.sin(t * 1.6 + 1.0) * 0.12;

        // Spine undulation
        fishCyan.segments.forEach((seg, idx) => {
          seg.rotation.y = Math.sin(t * 3.2 - (idx + 1) * 0.65 + 1.0) * 0.22;
        });
        // Tail veil flutter
        fishCyan.tailGroup.rotation.y = Math.sin(t * 3.2 - 3.8 + 1.0) * 0.32;
        // Pectoral fin flap
        fishCyan.pFinL.rotation.z = 0.7 + Math.sin(t * 2.6 + 1.2) * 0.25;
        fishCyan.pFinR.rotation.z = -0.7 - Math.sin(t * 2.6 + 1.2) * 0.25;
      }

      // 3. Trauma Team AV Flight Path (Medical Corridor Patrol)
      const avSpeed = 0.26;
      const avX = Math.sin(t * avSpeed) * 170 - 40;
      const avZ = Math.cos(t * avSpeed) * 130 - 20;
      avGroup.position.set(avX, 210 + Math.sin(t * 2.0) * 4, avZ);
      avGroup.rotation.y = t * avSpeed + Math.PI / 2;

      // Trauma Team medical emergency strobe flashers
      const strobeOn = Math.sin(t * 14) > 0;
      ttBeaconRed.intensity = strobeOn ? 4.5 : 0.2;
      ttBeaconBlue.intensity = !strobeOn ? 4.5 : 0.2;

      // 4. Arasaka Security Gunship AV Orbital Patrol (Around Arasaka Tower)
      if (avArasakaPatrol) {
        const aSpeed = 0.20;
        const aAngle = t * aSpeed + Math.PI;
        avArasakaPatrol.position.set(-60 + Math.cos(aAngle) * 98, 240 + Math.sin(t * 1.8) * 4, -40 + Math.sin(aAngle) * 80);
        avArasakaPatrol.rotation.y = -aAngle + Math.PI / 2;
      }

      // 5. Delamain VIP Autonomous Flying Cab (Watson to Westbrook Transit)
      if (avDelamainPatrol) {
        const dSpeed = 0.17;
        const dAngle = t * dSpeed + 1.4;
        avDelamainPatrol.position.set(100 + Math.sin(dAngle) * 85, 165 + Math.sin(t * 2.2) * 5, -20 + Math.cos(dAngle) * 115);
        avDelamainPatrol.rotation.y = dAngle + Math.PI / 2;
      }

      // 6. Megabuilding H10 Active Exterior Elevator Car Movement
      if (elCar1) {
        // Smoothly ascends and descends between floor 4 (y=20m) and floor 50 (y=175m)
        elCar1.position.y = 20 + (Math.sin(t * 0.35) * 0.5 + 0.5) * 155;
      }

      // 7. Maglev Bullet Pod back-and-forth shuttle
      const podX = Math.sin(t * 0.8) * 180;
      maglevPod.position.x = podX;

      // 8. Petrochem flare stack flicker
      try {
        if (typeof flameLight1 !== 'undefined' && flameLight1 && typeof flameLight2 !== 'undefined' && flameLight2) {
          flameLight1.intensity = 3.5 + Math.sin(t * 18) * 1.2;
          flameLight2.intensity = 3.5 + Math.cos(t * 16) * 1.2;
        }
      } catch (err) {
        // Safe fallback
      }

      // 6. Streaming freeway traffic movement
      const posAttr = trafficGeo.attributes.position;
      const arr = posAttr.array;
      for (let i = 0; i < trafficCount; i++) {
        if (i % 2 === 0) {
          arr[i * 3] += 1.8; // Eastbound
          if (arr[i * 3] > 290) arr[i * 3] = -290;
        } else {
          arr[i * 3] -= 1.8; // Westbound
          if (arr[i * 3] < -290) arr[i * 3] = 290;
        }
      }
      posAttr.needsUpdate = true;

      // 7. Slow rotation of distant holographic Earth
      earthGroup.rotation.y = t * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // ══════════════════════════════════════════════════════════════════════════
    // RESIZE & CLEANUP
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

  // Subsurface Mode: fade ground into wireframe
  useEffect(() => {
    if (groundMeshRef.current) {
      groundMeshRef.current.transparent = subsurfaceMode;
      groundMeshRef.current.opacity = subsurfaceMode ? 0.25 : 1.0;
      groundMeshRef.current.wireframe = subsurfaceMode;
      groundMeshRef.current.needsUpdate = true;
    }
    if (cameraRef.current && controlsRef.current && subsurfaceMode) {
      cameraRef.current.position.set(0, -10, 200);
      controlsRef.current.target.set(0, -20, 0);
    }
  }, [subsurfaceMode]);

  useEffect(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  const handleHeroCamera = useCallback(() => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 16, 85);
      controlsRef.current.target.set(0, 145, -50);
      setSubsurfaceMode(false);
    }
  }, []);

  const handleResetCamera = useCallback(() => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 16, 85);
      controlsRef.current.target.set(0, 145, -50);
      setSubsurfaceMode(false);
    }
  }, []);

  return (
    <div className="night-city-container" style={{ position: 'fixed', inset: 0, zIndex: 10, overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating HUD Header */}
      <div className="nc-hud-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="nc-btn-back" onClick={onReturnToEarth} title="Return to Earth Globe">
            ‹ Return to Earth Globe
          </button>
          <div className="nc-title-block">
            <span className="nc-badge">12 ICONIC NIGHT CITY LANDMARKS // 100% LOD4 BIM TWIN</span>
            <h1 className="nc-title">Night City Metropolis (Corpo Plaza • Watson • Westbrook)</h1>
          </div>
        </div>

        <div className="nc-hud-controls">
          <button
            className="nc-control-btn"
            onClick={handleHeroCamera}
            title="Snap to Corpo Plaza Hero Angle (Screenshot Reference)"
            style={{
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.45), rgba(0, 240, 255, 0.35))',
              border: '1px solid #00f0ff',
              color: '#ffffff',
              boxShadow: '0 0 14px rgba(0, 240, 255, 0.45)',
              fontWeight: 700
            }}
          >
            📸 Corpo Plaza Hero Cam
          </button>

          <button
            className={`nc-control-btn ${subsurfaceMode ? 'active' : ''}`}
            onClick={() => setSubsurfaceMode(v => !v)}
            title="Toggle Subsurface Strata (B1-B4 Hyperloop)"
          >
            ⚡ {subsurfaceMode ? 'Exit Subsurface X-Ray' : 'Subsurface Strata (B1–B4)'}
          </button>

          <button
            className={`nc-control-btn ${autoRotate ? 'active' : ''}`}
            onClick={() => setAutoRotate(v => !v)}
            title="Toggle Cinematic Orbit"
          >
            🎥 {autoRotate ? 'Stop Orbit' : 'Orbit'}
          </button>

          <button className="nc-control-btn" onClick={handleResetCamera} title="Reset View">
            🎯 Reset View
          </button>
        </div>
      </div>

      {/* Earth Orbit Reference */}
      <div className="nc-earth-callout">
        <span className="nc-pulse-dot" />
        <span>EARTH ORBIT DISTANT // 12 BESPOKE HERO LANDMARKS // 40+ SKYLINE TOWERS</span>
      </div>

      {/* Hover Tooltip HUD */}
      {hoveredBuilding && (
        <div className="nc-tooltip-hud" style={{ left: tooltipPos.x, top: tooltipPos.y }}>
          <div className="nc-tooltip-head">
            <span className="nc-tooltip-badge">100% LOD4 BIM</span>
            <span className="nc-tooltip-code mono">{hoveredBuilding.building_id}</span>
          </div>
          <div className="nc-tooltip-name">{hoveredBuilding.name}</div>
          <div className="nc-tooltip-stats">
            <span>{hoveredBuilding.floor_count} Floors</span>
            <span>•</span>
            <span>{hoveredBuilding.height}m Height</span>
            <span>•</span>
            <span style={{ color: '#34d399' }}>AUTHORITATIVE</span>
          </div>
          <div className="nc-tooltip-hint">Click to inspect 3D ULPIN cadastre & telemetry ›</div>
        </div>
      )}

      {/* Footer */}
      <div className="nc-hud-footer">
        <div className="nc-footer-tag">
          <span style={{ color: '#ec4899', fontWeight: 700 }}>3D ULPIN LAB</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}> | </span>
          <span>Arasaka • Megabuilding H10 & H08 • Militech • Konpeki Plaza • Afterlife • Delamain • Tyger Pagoda • Petrochem</span>
        </div>
        <div className="nc-footer-telemetry mono">
          STATUS: ONLINE • RIGID CAD EDGES • HIGH LUMINANCE • 60 FPS
        </div>
      </div>

      <style>{`
        .nc-hud-header {
          position: absolute;
          top: calc(var(--topbar-h) + 12px);
          left: 20px; right: 20px;
          display: flex; align-items: center; justify-content: space-between;
          pointer-events: none; z-index: 20;
        }
        .nc-btn-back {
          pointer-events: auto;
          background: rgba(15, 10, 26, 0.85);
          border: 1px solid rgba(236, 72, 153, 0.5);
          color: #f472b6;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px; font-weight: 700;
          padding: 8px 16px; border-radius: 999px;
          cursor: pointer; backdrop-filter: blur(12px);
          box-shadow: 0 0 16px rgba(236, 72, 153, 0.25);
          transition: all 0.15s;
        }
        .nc-btn-back:hover {
          background: #ec4899; color: #ffffff;
          box-shadow: 0 0 24px rgba(236, 72, 153, 0.6);
        }
        .nc-title-block { display: flex; flex-direction: column; }
        .nc-badge { font-size: 9px; font-weight: 800; color: #ec4899; letter-spacing: 0.8px; }
        .nc-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; margin: 0; color: #ffffff; letter-spacing: -0.2px; }
        .nc-hud-controls { display: flex; gap: 8px; pointer-events: auto; }
        .nc-control-btn {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff; font-family: 'Space Grotesk', sans-serif;
          font-size: 11px; font-weight: 600; padding: 7px 13px;
          border-radius: 8px; cursor: pointer; backdrop-filter: blur(12px);
          transition: all 0.15s;
        }
        .nc-control-btn:hover { background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.3); }
        .nc-control-btn.active {
          background: rgba(236, 72, 153, 0.25); border-color: #ec4899;
          color: #f472b6; box-shadow: 0 0 14px rgba(236, 72, 153, 0.4);
        }
        .nc-earth-callout {
          position: absolute;
          top: calc(var(--topbar-h) + 18px);
          left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 8px;
          font-family: monospace; font-size: 10px; color: #38bdf8;
          background: rgba(14, 25, 45, 0.7);
          border: 1px solid rgba(56, 189, 248, 0.3);
          padding: 4px 12px; border-radius: 999px;
          backdrop-filter: blur(8px); pointer-events: none; letter-spacing: 0.5px;
        }
        .nc-pulse-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #38bdf8; box-shadow: 0 0 8px #38bdf8;
          animation: nc-pulse 1.8s infinite;
        }
        @keyframes nc-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
        .nc-tooltip-hud {
          position: fixed; z-index: 100; pointer-events: none;
          background: rgba(10, 13, 24, 0.94);
          border: 1px solid #ec4899;
          box-shadow: 0 0 20px rgba(236, 72, 153, 0.4);
          border-radius: 8px; padding: 10px 14px; min-width: 220px;
          backdrop-filter: blur(14px);
          animation: nc-hud-in 0.15s ease-out;
        }
        @keyframes nc-hud-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .nc-tooltip-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
        .nc-tooltip-badge {
          font-size: 9px; font-weight: 800; color: #f472b6;
          background: rgba(236, 72, 153, 0.2); border: 1px solid rgba(236, 72, 153, 0.5);
          padding: 1px 5px; border-radius: 4px;
        }
        .nc-tooltip-code { font-size: 9px; color: #38bdf8; }
        .nc-tooltip-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; color: #ffffff; margin-bottom: 4px; }
        .nc-tooltip-stats { display: flex; gap: 6px; font-size: 10px; color: rgba(255, 255, 255, 0.6); margin-bottom: 6px; }
        .nc-tooltip-hint { font-size: 9px; color: #ec4899; font-weight: 600; }
        .nc-hud-footer {
          position: absolute; bottom: 12px; left: 20px; right: 20px;
          display: flex; justify-content: space-between; align-items: center;
          pointer-events: none; z-index: 20; font-size: 11px;
        }
        .nc-footer-tag {
          background: rgba(10, 13, 24, 0.75); border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 5px 12px; border-radius: 6px; backdrop-filter: blur(8px);
        }
        .nc-footer-telemetry {
          background: rgba(10, 13, 24, 0.75); border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 5px 12px; border-radius: 6px; color: #34d399; font-size: 10px; backdrop-filter: blur(8px);
        }
      `}</style>
    </div>
  );
}
