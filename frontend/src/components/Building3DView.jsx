import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { floorMeta, getFloorRooms, typeColor } from '../utils/floorLayouts.js';
import { getFloorULPIN } from '../utils/ulpinGenerator.js';

export default function Building3DView({
  building,
  floors = [],
  totalFloors = 1,
  clampedIdx = 0,
  floorH = 3.5,
  doFloorChange,
  setViewMode,
  accentClr = '#10b981',
}) {
  const mountRef = useRef(null);

  // ── UI States ──────────────────────────────────────────────────────────────
  const [dissection, setDissection] = useState(30); // 0% (compact) to 100% (exploded)
  const [facadeMode, setFacadeMode] = useState('cutaway'); // 'cutaway' | 'glass' | 'wireframe' | 'open'
  const [autoRotate, setAutoRotate] = useState(false);
  const [interactionMode, setInteractionMode] = useState('rotate'); // 'rotate' | 'pan'
  const [viewFocus, setViewFocus] = useState('floor'); // 'floor' (zoomed to floor) | 'tower' (full building)
  const [hoveredFloor, setHoveredFloor] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [ulpinCopied, setUlpinCopied] = useState(false);

  // Building geometry metrics in Three.js units (1 unit = 1 metre)
  const BLDG_W = 38;
  const BLDG_D = 26;
  const SLAB_THICKNESS = 0.4;
  const ROOM_H = 2.2;
  const BASE_FLOOR_H = 3.6;

  // Render all floors so moving between any floor is seamless
  const allFloors = useMemo(() => {
    return floors.map((f, fi) => ({ f, fi }));
  }, [floors]);

  // Keep references for animation loop and Three.js objects
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);
  const floorGroupsRef = useRef([]);
  const facadeMeshesRef = useRef({ cutaway: [], glass: [], wireframe: [] });
  const elevatorCabsRef = useRef([]);
  const dissectionRef = useRef(dissection);
  dissectionRef.current = dissection;
  const clampedIdxRef = useRef(clampedIdx);
  clampedIdxRef.current = clampedIdx;

  // Smooth camera glide animation state
  const cameraAnimRef = useRef({
    active: false,
    targetLookAt: new THREE.Vector3(),
    targetCamPos: new THREE.Vector3(),
  });

  const rulerRef = useRef(null);

  // Helper to compute floor Y at current dissection
  const getFloorY = useCallback((fi, dissVal = dissectionRef.current) => {
    const dissPct = dissVal / 100;
    const extraGap = dissPct * (BASE_FLOOR_H * 2.2);
    return fi * (BASE_FLOOR_H + extraGap);
  }, []);

  // ── Smooth Camera Fly Function ─────────────────────────────────────────────
  const flyToFloor = useCallback((fi, smooth = true) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const floorY = getFloorY(fi);
    const targetLookAt = new THREE.Vector3(0, floorY + 1.2, 0);

    // Keep the current horizontal angle around the building
    const currentOffset = new THREE.Vector3().subVectors(camera.position, controls.target);
    const horizontalAngle = Math.atan2(currentOffset.x, currentOffset.z);

    // Close-up distance to clearly inspect the floor rooms and slabs
    const focusDist = 48;
    const targetCamX = Math.sin(horizontalAngle) * focusDist;
    const targetCamZ = Math.cos(horizontalAngle) * focusDist;
    const targetCamY = floorY + 12;
    const targetCamPos = new THREE.Vector3(targetCamX, targetCamY, targetCamZ);

    if (smooth) {
      cameraAnimRef.current = {
        active: true,
        targetLookAt,
        targetCamPos,
      };
    } else {
      controls.target.copy(targetLookAt);
      camera.position.copy(targetCamPos);
      controls.update();
    }
  }, [getFloorY]);

  // Zoom back out to view the entire building model
  const zoomToFullTower = useCallback((smooth = true) => {
    setViewFocus('tower');
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const bldgH = totalFloors * BASE_FLOOR_H;
    const targetLookAt = new THREE.Vector3(0, bldgH * 0.45, 0);
    const dist = Math.max(75, totalFloors * 2.5);

    const currentOffset = new THREE.Vector3().subVectors(camera.position, controls.target);
    const horizontalAngle = Math.atan2(currentOffset.x, currentOffset.z);
    const targetCamPos = new THREE.Vector3(
      Math.sin(horizontalAngle) * dist,
      bldgH * 0.75,
      Math.cos(horizontalAngle) * dist
    );

    if (smooth) {
      cameraAnimRef.current = {
        active: true,
        targetLookAt,
        targetCamPos,
      };
    } else {
      controls.target.copy(targetLookAt);
      camera.position.copy(targetCamPos);
      controls.update();
    }
  }, [totalFloors]);

  // Automatically fly to floor whenever clampedIdx changes
  useEffect(() => {
    setViewFocus('floor');
    flyToFloor(clampedIdx, true);
  }, [clampedIdx, flyToFloor]);

  // Keyboard navigation for floor jumping (ArrowUp / ArrowDown / PageUp / PageDown)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input box
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (clampedIdx < totalFloors - 1) {
          doFloorChange(clampedIdx + 1);
        }
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (clampedIdx > 0) {
          doFloorChange(clampedIdx - 1);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        doFloorChange(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        doFloorChange(totalFloors - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clampedIdx, totalFloors, doFloorChange]);

  // Auto-scroll left ruler to center active floor
  useEffect(() => {
    if (rulerRef.current) {
      const activeEl = rulerRef.current.querySelector(`[data-floor="${clampedIdx}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [clampedIdx]);

  // ── Three.js Scene Setup ───────────────────────────────────────────────────
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene with obsidian/green atmosphere
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x020502);
    scene.fog = new THREE.FogExp2(0x020502, 0.0028);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.5, 1400);
    cameraRef.current = camera;
    const initialFloorY = clampedIdxRef.current * BASE_FLOOR_H;
    camera.position.set(40, initialFloorY + 12, 40);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls with smooth damping and full screen-space grab/pan
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.screenSpacePanning = true; // Enables moving model down and up by grabbing
    controls.enablePan = true;
    controls.panSpeed = 1.6;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.2;
    controls.enableRotate = true;
    controls.rotateSpeed = 0.9;
    controls.maxPolarAngle = Math.PI / 2 + 0.12;
    controls.minDistance = 8;
    controls.maxDistance = 800;
    controls.target.set(0, initialFloorY + 1.2, 0);
    controls.update();

    // 5. Lighting (Green & obsidian themed)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x10b981, 2.0);
    dirLight1.position.set(60, 120, 80);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00ff88, 1.2);
    dirLight2.position.set(-80, 80, -60);
    scene.add(dirLight2);

    const groundGlowLight = new THREE.PointLight(0x10b981, 2.2, 220);
    groundGlowLight.position.set(0, -2, 0);
    scene.add(groundGlowLight);

    // 6. Ground Grid & Foundation Platform
    const gridHelper = new THREE.GridHelper(280, 56, 0x10b981, 0x132a1a);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // Foundation slab
    const foundGeo = new THREE.BoxGeometry(BLDG_W + 10, 1.2, BLDG_D + 10);
    const foundMat = new THREE.MeshStandardMaterial({
      color: 0x050a06,
      roughness: 0.8,
      metalness: 0.2,
    });
    const foundMesh = new THREE.Mesh(foundGeo, foundMat);
    foundMesh.position.y = -0.6;
    scene.add(foundMesh);

    // Foundation perimeter edge line
    const foundEdges = new THREE.EdgesGeometry(foundGeo);
    const foundLine = new THREE.LineSegments(
      foundEdges,
      new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.5 })
    );
    foundLine.position.y = -0.6;
    scene.add(foundLine);

    // 7. Elevator Core Shaft
    const CORE_W = 8;
    const CORE_D = 8;
    const bldgTotalH = totalFloors * BASE_FLOOR_H;
    const coreGeo = new THREE.BoxGeometry(CORE_W, bldgTotalH * 2.5, CORE_D);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0d1710,
      roughness: 0.7,
      metalness: 0.3,
      transparent: true,
      opacity: 0.45,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, bldgTotalH * 0.9, 0);
    scene.add(coreMesh);

    // Core shaft frame edges
    const coreEdges = new THREE.EdgesGeometry(coreGeo);
    const coreLines = new THREE.LineSegments(
      coreEdges,
      new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.4 })
    );
    coreLines.position.copy(coreMesh.position);
    scene.add(coreLines);

    // Animated elevator cabs inside core
    const cabGeo = new THREE.BoxGeometry(2.4, 2.8, 2.4);
    const cabMat1 = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
    const cab1 = new THREE.Mesh(cabGeo, cabMat1);
    cab1.position.set(-1.8, 4, 0);
    scene.add(cab1);

    const cabMat2 = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const cab2 = new THREE.Mesh(cabGeo, cabMat2);
    cab2.position.set(1.8, bldgTotalH * 0.7, 0);
    scene.add(cab2);

    elevatorCabsRef.current = [cab1, cab2];

    // 8. Outer Glass Cuboid Shells (modes: cutaway, glass, wireframe)
    const shellH = bldgTotalH * 1.8;
    const shellY = shellH / 2;

    // A. Glass Shell (4 sides)
    const glassGeo = new THREE.BoxGeometry(BLDG_W + 0.8, shellH, BLDG_D + 0.8);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x064e3b,
      roughness: 0.1,
      transmission: 0.85,
      thickness: 1.2,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(0, shellY, 0);
    scene.add(glassMesh);

    // Glass shell mullions / wireframe
    const shellEdges = new THREE.EdgesGeometry(glassGeo);
    const shellWireframe = new THREE.LineSegments(
      shellEdges,
      new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.35 })
    );
    shellWireframe.position.copy(glassMesh.position);
    scene.add(shellWireframe);

    // B. Cutaway Shell (back and left/right glass, front open)
    const cutawayGroup = new THREE.Group();
    const cutMat = new THREE.MeshPhysicalMaterial({
      color: 0x064e3b,
      roughness: 0.1,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    // Back wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(BLDG_W + 0.8, shellH), cutMat);
    backWall.position.set(0, shellY, -(BLDG_D + 0.8) / 2);
    cutawayGroup.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(BLDG_D + 0.8, shellH), cutMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-(BLDG_W + 0.8) / 2, shellY, 0);
    cutawayGroup.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(BLDG_D + 0.8, shellH), cutMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set((BLDG_W + 0.8) / 2, shellY, 0);
    cutawayGroup.add(rightWall);

    scene.add(cutawayGroup);

    facadeMeshesRef.current = {
      glass: [glassMesh, shellWireframe],
      cutaway: [cutawayGroup],
      wireframe: [shellWireframe],
    };

    // 9. Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 10. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Animate elevator cabs
      if (elevatorCabsRef.current[0]) {
        elevatorCabsRef.current[0].position.y = 2 + (Math.sin(elapsed * 0.9) * 0.5 + 0.5) * (bldgTotalH * 0.9);
      }
      if (elevatorCabsRef.current[1]) {
        elevatorCabsRef.current[1].position.y = 2 + (Math.cos(elapsed * 0.7) * 0.5 + 0.5) * (bldgTotalH * 0.9);
      }

      // Smoothly update floor slab positions based on dissection
      const dissPct = dissectionRef.current / 100;
      const extraGap = dissPct * (BASE_FLOOR_H * 2.2);

      floorGroupsRef.current.forEach(({ group, fi }) => {
        const targetY = fi * (BASE_FLOOR_H + extraGap);
        group.position.y += (targetY - group.position.y) * 0.14;
      });

      // Smooth camera glide animation to target floor or full tower
      if (cameraAnimRef.current.active) {
        const { targetLookAt, targetCamPos } = cameraAnimRef.current;
        controls.target.lerp(targetLookAt, 0.09);
        camera.position.lerp(targetCamPos, 0.09);

        if (
          controls.target.distanceTo(targetLookAt) < 0.15 &&
          camera.position.distanceTo(targetCamPos) < 0.3
        ) {
          controls.target.copy(targetLookAt);
          camera.position.copy(targetCamPos);
          cameraAnimRef.current.active = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [totalFloors]);

  // ── Update Interaction Mode (Rotate vs Pan / Move Down) ─────────────────────
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (interactionMode === 'pan') {
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
      };
      if (mountRef.current) mountRef.current.style.cursor = 'grab';
    } else {
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      };
      if (mountRef.current) mountRef.current.style.cursor = 'default';
    }
  }, [interactionMode]);

  // ── Update Auto-Rotate ─────────────────────────────────────────────────────
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = 1.2;
    }
  }, [autoRotate]);

  // ── Update Facade Visibility ───────────────────────────────────────────────
  useEffect(() => {
    const { glass, cutaway, wireframe } = facadeMeshesRef.current;
    if (glass) glass.forEach(m => (m.visible = facadeMode === 'glass'));
    if (cutaway) cutaway.forEach(m => (m.visible = facadeMode === 'cutaway'));
    if (wireframe && facadeMode === 'wireframe') wireframe.forEach(m => (m.visible = true));
  }, [facadeMode]);

  // ── Build Continuous Floor Slabs & 3D Interior Rooms ───────────────────────
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clean up previous floor groups
    floorGroupsRef.current.forEach(({ group }) => {
      scene.remove(group);
      group.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
          else child.material.dispose();
        }
      });
    });
    floorGroupsRef.current = [];

    // Shared geometries
    const slabGeo = new THREE.BoxGeometry(BLDG_W, SLAB_THICKNESS, BLDG_D);
    const slabEdgesGeo = new THREE.EdgesGeometry(slabGeo);
    const colGeo = new THREE.BoxGeometry(0.7, ROOM_H, 0.7);
    const colMat = new THREE.MeshStandardMaterial({ color: 0x162c1c, metalness: 0.4, roughness: 0.6 });

    // Build all floors continuously
    allFloors.forEach(({ f, fi }) => {
      const meta = floorMeta(f.label, fi, totalFloors);
      const isSelected = fi === clampedIdx;
      const isNearSelected = Math.abs(fi - clampedIdx) <= 2;
      const floorColor = new THREE.Color(meta.color || 0x10b981);

      const floorGroup = new THREE.Group();
      floorGroup.userData = { fi, f, meta };

      // 1. Floor Slab Mesh
      const slabMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x092b15 : (isNearSelected ? 0x0c1a10 : 0x050a07),
        roughness: 0.5,
        metalness: isSelected ? 0.3 : 0.1,
      });
      const slabMesh = new THREE.Mesh(slabGeo, slabMat);
      slabMesh.position.set(0, 0, 0);
      slabMesh.userData = { type: 'slab', fi, f, meta };
      floorGroup.add(slabMesh);

      // Slab glowing edge line
      const lineMat = new THREE.LineBasicMaterial({
        color: isSelected ? 0x00ff88 : (isNearSelected ? 0x10b981 : 0x1c3a25),
        transparent: true,
        opacity: isSelected ? 1.0 : (isNearSelected ? 0.75 : 0.4),
        linewidth: isSelected ? 2.5 : 1,
      });
      const slabEdges = new THREE.LineSegments(slabEdgesGeo, lineMat);
      slabEdges.position.copy(slabMesh.position);
      floorGroup.add(slabEdges);

      // Selected floor highlight halo & glow
      if (isSelected) {
        const haloGeo = new THREE.BoxGeometry(BLDG_W + 1.6, SLAB_THICKNESS + 0.4, BLDG_D + 1.6);
        const haloEdges = new THREE.EdgesGeometry(haloGeo);
        const haloLine = new THREE.LineSegments(
          haloEdges,
          new THREE.LineBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.95 })
        );
        floorGroup.add(haloLine);

        const floorLight = new THREE.PointLight(0x00ff88, 2.5, 30);
        floorLight.position.set(0, ROOM_H / 2, 0);
        floorGroup.add(floorLight);
      }

      // Floor beacon on corner
      const beaconGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const beaconMat = new THREE.MeshBasicMaterial({ color: isSelected ? 0x00ff88 : floorColor });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(-BLDG_W / 2 + 0.6, SLAB_THICKNESS / 2 + 0.4, -BLDG_D / 2 + 0.6);
      floorGroup.add(beacon);

      // 2. Interior Rooms (Render rooms on selected floor and adjacent floors)
      if (isSelected || isNearSelected || fi % 4 === 0) {
        const rooms = getFloorRooms(building, f, fi, totalFloors);
        rooms.forEach((room) => {
          const rX = room.x + room.w / 2 - BLDG_W / 2;
          const rZ = room.z + room.d / 2 - BLDG_D / 2;
          const rW = room.w * 0.94;
          const rD = room.d * 0.94;
          const rColor = new THREE.Color(room.color || typeColor(room.type));

          // 3D Room Box
          const roomGeo = new THREE.BoxGeometry(rW, ROOM_H, rD);
          const roomMat = new THREE.MeshStandardMaterial({
            color: isSelected ? rColor : 0x0f2918,
            roughness: 0.4,
            metalness: 0.1,
            transparent: true,
            opacity: isSelected ? 0.48 : 0.22,
            depthWrite: false,
          });
          const roomMesh = new THREE.Mesh(roomGeo, roomMat);
          roomMesh.position.set(rX, SLAB_THICKNESS / 2 + ROOM_H / 2, rZ);
          roomMesh.userData = { type: 'room', room, fi, f };
          floorGroup.add(roomMesh);

          // Room edge line
          const roomEdges = new THREE.EdgesGeometry(roomGeo);
          const roomEdgeLine = new THREE.LineSegments(
            roomEdges,
            new THREE.LineBasicMaterial({
              color: isSelected ? 0x00ff88 : 0x10b981,
              transparent: true,
              opacity: isSelected ? 0.9 : 0.4,
            })
          );
          roomEdgeLine.position.copy(roomMesh.position);
          floorGroup.add(roomEdgeLine);

          // Pad
          const padGeo = new THREE.BoxGeometry(rW, 0.04, rD);
          const padMat = new THREE.MeshBasicMaterial({
            color: rColor,
            transparent: true,
            opacity: isSelected ? 0.45 : 0.2,
          });
          const padMesh = new THREE.Mesh(padGeo, padMat);
          padMesh.position.set(rX, SLAB_THICKNESS / 2 + 0.03, rZ);
          floorGroup.add(padMesh);
        });

        // 3. Columns
        [
          [-BLDG_W / 2 + 1.2, -BLDG_D / 2 + 1.2],
          [BLDG_W / 2 - 1.2, -BLDG_D / 2 + 1.2],
          [-BLDG_W / 2 + 1.2, BLDG_D / 2 - 1.2],
          [BLDG_W / 2 - 1.2, BLDG_D / 2 - 1.2],
        ].forEach(([cx, cz]) => {
          const col = new THREE.Mesh(colGeo, colMat);
          col.position.set(cx, SLAB_THICKNESS / 2 + ROOM_H / 2, cz);
          floorGroup.add(col);
        });
      }

      // Initial position
      const initialY = fi * BASE_FLOOR_H;
      floorGroup.position.set(0, initialY, 0);

      scene.add(floorGroup);
      floorGroupsRef.current.push({ group: floorGroup, fi, f });
    });
  }, [allFloors, clampedIdx, building, totalFloors]);

  // ── Raycasting (Hover & Selection) ─────────────────────────────────────────
  const onPointerMove = (e) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    setTooltipPos({ x: e.clientX + 14, y: e.clientY + 14 });

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const interactables = [];
    floorGroupsRef.current.forEach(({ group }) => {
      group.children.forEach(child => {
        if (child.userData && (child.userData.type === 'slab' || child.userData.type === 'room')) {
          interactables.push(child);
        }
      });
    });

    const intersects = raycaster.intersectObjects(interactables, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const uData = hit.userData;
      setHoveredFloor({
        fi: uData.fi,
        label: uData.f?.label || `Level ${uData.fi}`,
        meta: floorMeta(uData.f?.label, uData.fi, totalFloors),
        elev: (floorH * Math.max(0, uData.fi)).toFixed(0),
        room: uData.type === 'room' ? uData.room : null,
        ulpin: uData.f?.ulpin || uData.f?.canonical_rid || getFloorULPIN(building, uData.fi),
      });
      container.style.cursor = 'pointer';
    } else {
      setHoveredFloor(null);
      container.style.cursor = interactionMode === 'pan' ? 'grab' : 'default';
    }
  };

  const onPointerDown = () => {
    if (mountRef.current && interactionMode === 'pan') {
      mountRef.current.style.cursor = 'grabbing';
    }
  };

  const onPointerUp = () => {
    if (mountRef.current && interactionMode === 'pan') {
      mountRef.current.style.cursor = 'grab';
    }
  };

  const onClick = (e) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const interactables = [];
    floorGroupsRef.current.forEach(({ group }) => {
      group.children.forEach(child => {
        if (child.userData && (child.userData.type === 'slab' || child.userData.type === 'room')) {
          interactables.push(child);
        }
      });
    });

    const intersects = raycaster.intersectObjects(interactables, false);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const uData = hit.userData;
      if (uData.fi !== undefined) {
        doFloorChange(uData.fi);
        setViewFocus('floor');
        flyToFloor(uData.fi, true);
        if (uData.type === 'room') {
          setSelectedRoom(uData.room);
        }
      }
    }
  };

  // ── Camera Preset Handlers ─────────────────────────────────────────────────
  const setCameraPreset = (preset) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const floorY = getFloorY(clampedIdx);
    const targetY = viewFocus === 'floor' ? floorY : (totalFloors * BASE_FLOOR_H) / 2;
    controls.target.set(0, targetY, 0);

    const dist = viewFocus === 'floor' ? 48 : Math.max(70, totalFloors * 2.5);

    if (preset === 'iso') {
      camera.position.set(dist * 0.85, targetY + dist * 0.5, dist * 1.05);
    } else if (preset === 'front') {
      camera.position.set(0, targetY, dist * 1.3);
    } else if (preset === 'top') {
      camera.position.set(0.1, targetY + dist * 1.4, 0.1);
    } else if (preset === 'side') {
      camera.position.set(dist * 1.3, targetY, 0);
    }
    controls.update();
  };

  const currentFloorObj = floors[clampedIdx] || { label: `Floor ${clampedIdx + 1}` };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 140,
      background: 'radial-gradient(ellipse 90% 90% at 50% 35%, #050d08 0%, #010402 100%)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none',
      fontFamily: "'Outfit', 'Chakra Petch', sans-serif",
    }}>

      {/* ── 3D Canvas Mount ── */}
      <div
        ref={mountRef}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClick={onClick}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
        }}
      />

      {/* ── Top Header Bar ── */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 24,
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        {/* Glowing 3D Cuboid Badge */}
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.40)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: '2px',
              color: '#10b981',
              textTransform: 'uppercase',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              3D Cuboid Building Dissection
            </span>
            <span style={{
              fontSize: 9,
              padding: '1px 6px',
              borderRadius: 4,
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              fontWeight: 700,
            }}>
              WHOLE BUILDING INTERIOR
            </span>
          </div>

          <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginTop: 3 }}>
            {building.name}
            <span style={{ fontSize: 11, fontWeight: 500, color: '#a7f3d0', marginLeft: 10 }}>
              {totalFloors} Floors · {building.height}m Height
            </span>
          </div>
        </div>
      </div>

      {/* ── Top-Right View Switcher & Camera Controls Toolbar ── */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 24,
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        {/* Mode Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(5, 12, 7, 0.90)',
          backdropFilter: 'blur(20px)',
          padding: 3,
          borderRadius: 10,
          border: '1px solid rgba(16, 185, 129, 0.30)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
        }}>
          <button
            onClick={() => setViewMode('floor')}
            style={{
              padding: '6px 14px',
              borderRadius: 7,
              border: 'none',
              background: 'transparent',
              color: '#94a3b8',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="1" />
              <path d="M3 9h18M9 21V9M15 21V9" />
            </svg>
            Single Floor Plan
          </button>

          <button
            style={{
              padding: '6px 14px',
              borderRadius: 7,
              border: 'none',
              background: 'rgba(16, 185, 129, 0.22)',
              color: '#10b981',
              outline: '1px solid rgba(16, 185, 129, 0.45)',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'default',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            Whole Building 3D
          </button>
        </div>

        {/* ── Floor Zoom vs Whole Tower Zoom Toggle ── */}
        <div style={{
          display: 'flex',
          gap: 2,
          background: 'rgba(5, 12, 7, 0.90)',
          backdropFilter: 'blur(20px)',
          padding: 3,
          borderRadius: 10,
          border: '1px solid rgba(16, 185, 129, 0.25)',
        }}>
          <button
            onClick={() => {
              setViewFocus('floor');
              flyToFloor(clampedIdx, true);
            }}
            title="Zoom directly to current selected floor"
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: 'none',
              background: viewFocus === 'floor' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              color: viewFocus === 'floor' ? '#00ff88' : '#cbd5e1',
              fontSize: 10.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            Floor Zoom
          </button>

          <button
            onClick={() => zoomToFullTower(true)}
            title="Zoom out to overview entire building model"
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: 'none',
              background: viewFocus === 'tower' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              color: viewFocus === 'tower' ? '#00ff88' : '#cbd5e1',
              fontSize: 10.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18" />
              <path d="M6 12H4a1 1 0 0 0-1 1v8M18 12h2a1 1 0 0 1 1 1v8" />
            </svg>
            Full Tower
          </button>
        </div>

        {/* ── Grab / Pan vs Rotate Mode Switcher ── */}
        <div style={{
          display: 'flex',
          gap: 2,
          background: 'rgba(5, 12, 7, 0.90)',
          backdropFilter: 'blur(20px)',
          padding: 3,
          borderRadius: 10,
          border: '1px solid rgba(16, 185, 129, 0.25)',
        }}>
          <button
            onClick={() => setInteractionMode('rotate')}
            title="Rotate Model (Left-Click Drag to Orbit 360°)"
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: 'none',
              background: interactionMode === 'rotate' ? '#10b981' : 'transparent',
              color: interactionMode === 'rotate' ? '#000000' : '#cbd5e1',
              fontSize: 10.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'all 0.12s',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
            <span>Rotate</span>
          </button>

          <button
            onClick={() => setInteractionMode('pan')}
            title="Grab & Move (Left-Click Drag to Move Model Down & Up)"
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: 'none',
              background: interactionMode === 'pan' ? '#10b981' : 'transparent',
              color: interactionMode === 'pan' ? '#000000' : '#cbd5e1',
              fontSize: 10.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'all 0.12s',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="5 9 2 12 5 15"/>
              <polyline points="9 5 12 2 15 5"/>
              <polyline points="15 19 12 22 9 19"/>
              <polyline points="19 9 22 12 19 15"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <line x1="12" y1="2" x2="12" y2="22"/>
            </svg>
            <span>Grab & Move</span>
          </button>
        </div>

        {/* Camera Angles Toolbar */}
        <div style={{
          display: 'flex',
          gap: 4,
          background: 'rgba(5, 12, 7, 0.90)',
          backdropFilter: 'blur(20px)',
          padding: 3,
          borderRadius: 10,
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}>
          <button
            onClick={() => setCameraPreset('iso')}
            title="Isometric 3D Perspective"
            style={{
              padding: '6px 9px',
              borderRadius: 6,
              border: 'none',
              background: 'transparent',
              color: '#cbd5e1',
              fontSize: 10,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ISO
          </button>
          <button
            onClick={() => setCameraPreset('front')}
            title="Front Cutaway Elevation"
            style={{
              padding: '6px 9px',
              borderRadius: 6,
              border: 'none',
              background: 'transparent',
              color: '#cbd5e1',
              fontSize: 10,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            FRONT
          </button>
          <button
            onClick={() => setCameraPreset('top')}
            title="Top Down Plan View"
            style={{
              padding: '6px 9px',
              borderRadius: 6,
              border: 'none',
              background: 'transparent',
              color: '#cbd5e1',
              fontSize: 10,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            TOP
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle Continuous Auto-Rotate"
            style={{
              padding: '6px 9px',
              borderRadius: 6,
              border: 'none',
              background: autoRotate ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              color: autoRotate ? '#00ff88' : '#94a3b8',
              fontSize: 10,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ⟳ ROTATE
          </button>
        </div>
      </div>

      {/* ── Hover Tooltip (Follows Cursor) ── */}
      {hoveredFloor && (
        <div style={{
          position: 'fixed',
          left: tooltipPos.x,
          top: tooltipPos.y,
          zIndex: 200,
          pointerEvents: 'none',
          background: 'rgba(2, 8, 4, 0.95)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${hoveredFloor.meta.color || '#10b981'}`,
          borderRadius: 8,
          padding: '8px 12px',
          color: '#f8fafc',
          boxShadow: `0 8px 32px rgba(0,0,0,0.8), 0 0 20px rgba(16, 185, 129, 0.25)`,
          minWidth: 170,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{
              fontSize: 11,
              fontWeight: 800,
              color: hoveredFloor.meta.color || '#10b981',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              L{hoveredFloor.fi} · {hoveredFloor.label}
            </span>
            <span style={{ fontSize: 9.5, color: '#a7f3d0', fontFamily: 'monospace' }}>
              {hoveredFloor.elev}m AGL
            </span>
          </div>
          <div style={{
            marginTop: 4,
            padding: '3px 6px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.40)',
            borderRadius: 4,
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            color: '#10b981',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
              <path d="M21 2l-2 2m-1.5 1.5L14 9l-1.5-1.5-2 2 1.5 1.5L9 14l-3-3L2 15l4 4 1-1 3 3 4-4-3-3 3-3 2 2 4-4z"/>
              <circle cx="7.5" cy="16.5" r="1.5"/>
            </svg>
            <span>{hoveredFloor.ulpin || getFloorULPIN(building, hoveredFloor.fi)}</span>
          </div>
          <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 4 }}>
            {hoveredFloor.meta.category}
          </div>
          {hoveredFloor.room && (
            <div style={{
              fontSize: 9.5,
              color: '#00ff88',
              marginTop: 4,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: 3,
            }}>
              Room: {hoveredFloor.room.label} ({hoveredFloor.room.area}m²)
            </div>
          )}
          <div style={{ fontSize: 8.5, color: '#6ee7b7', marginTop: 4, fontStyle: 'italic' }}>
            Click slab to zoom directly into this floor
          </div>
        </div>
      )}

      {/* ── Architectural Bottom Navigation Bar ── */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'rgba(5, 12, 7, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        borderRadius: 12,
        padding: '6px 12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7), 0 0 16px rgba(16, 185, 129, 0.15)',
        maxWidth: 'calc(100vw - 32px)',
        whiteSpace: 'nowrap',
      }}>

        {/* 1. Floor Stepper & Level Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => {
              if (clampedIdx > 0) {
                const nextIdx = clampedIdx - 1;
                doFloorChange(nextIdx);
                setViewFocus('floor');
                flyToFloor(nextIdx, true);
              }
            }}
            disabled={clampedIdx <= 0}
            title="Previous Floor (Down)"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: 'none',
              background: 'rgba(255, 255, 255, 0.08)',
              color: clampedIdx <= 0 ? '#52525b' : '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: clampedIdx <= 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={(e) => {
              if (clampedIdx > 0) e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 140 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                {currentFloorObj.label}
              </span>
              <span style={{ fontSize: 11, color: '#a7f3d0', fontVariantNumeric: 'tabular-nums' }}>
                {(floorH * Math.max(0, clampedIdx)).toFixed(0)}m AGL
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
              <span style={{
                fontSize: 10,
                color: '#10b981',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                letterSpacing: '0.1px',
              }}>
                {currentFloorObj.ulpin || currentFloorObj.canonical_rid || getFloorULPIN(building, clampedIdx)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const code = currentFloorObj.ulpin || currentFloorObj.canonical_rid || getFloorULPIN(building, clampedIdx);
                  navigator.clipboard?.writeText(code);
                  setUlpinCopied(true);
                  setTimeout(() => setUlpinCopied(false), 1400);
                }}
                title="Copy Floor 3D-ULPIN"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: ulpinCopied ? '#00ff88' : '#6ee7b7',
                  fontSize: 9.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0 2px',
                }}
              >
                {ulpinCopied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              if (clampedIdx < totalFloors - 1) {
                const nextIdx = clampedIdx + 1;
                doFloorChange(nextIdx);
                setViewFocus('floor');
                flyToFloor(nextIdx, true);
              }
            }}
            disabled={clampedIdx >= totalFloors - 1}
            title="Next Floor (Up)"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: 'none',
              background: 'rgba(255, 255, 255, 0.08)',
              color: clampedIdx >= totalFloors - 1 ? '#52525b' : '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: clampedIdx >= totalFloors - 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={(e) => {
              if (clampedIdx < totalFloors - 1) e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div style={{ width: 1, height: 22, background: 'rgba(16, 185, 129, 0.3)' }} />

        {/* 2. Facade Modes Segmented Control */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: '#040805',
          borderRadius: 8,
          padding: 2,
          border: '1px solid rgba(16, 185, 129, 0.2)',
        }}>
          {[
            {
              id: 'cutaway',
              label: 'Cutaway',
              icon: (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                </svg>
              ),
            },
            {
              id: 'glass',
              label: 'Glass',
              icon: (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              ),
            },
            {
              id: 'wireframe',
              label: 'Wireframe',
              icon: (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="4" y1="9" x2="20" y2="9" />
                  <line x1="4" y1="15" x2="20" y2="15" />
                  <line x1="10" y1="3" x2="8" y2="21" />
                  <line x1="16" y1="3" x2="14" y2="21" />
                </svg>
              ),
            },
            {
              id: 'open',
              label: 'Solid',
              icon: (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <line x1="9" y1="22" x2="9" y2="18" />
                  <line x1="15" y1="22" x2="15" y2="18" />
                </svg>
              ),
            },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setFacadeMode(mode.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 8px',
                borderRadius: 6,
                border: 'none',
                background: facadeMode === mode.id ? '#10b981' : 'transparent',
                color: facadeMode === mode.id ? '#000000' : '#a1a1aa',
                boxShadow: facadeMode === mode.id ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
                fontSize: 11,
                fontWeight: facadeMode === mode.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.12s ease',
              }}
            >
              {mode.icon}
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 22, background: 'rgba(16, 185, 129, 0.3)' }} />

        {/* 3. Slab Spacing / Dissection Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#a7f3d0' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600 }}>Spacing</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={dissection}
            onChange={(e) => setDissection(Number(e.target.value))}
            style={{
              width: 80,
              height: 4,
              accentColor: '#10b981',
              cursor: 'pointer',
            }}
          />
          <span style={{
            fontSize: 11,
            color: '#10b981',
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            minWidth: 26,
          }}>
            {dissection}%
          </span>
        </div>

        <div style={{ width: 1, height: 22, background: 'rgba(16, 185, 129, 0.3)' }} />

        {/* 4. Primary View Action */}
        <button
          onClick={() => setViewMode('floor')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 8,
            border: 'none',
            background: '#10b981',
            color: '#000000',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.12s ease',
            boxShadow: '0 0 14px rgba(16, 185, 129, 0.5)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#00ff88';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#10b981';
            e.currentTarget.style.boxShadow = '0 0 14px rgba(16, 185, 129, 0.5)';
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
          <span>Floor Plan</span>
        </button>

      </div>

      {/* ── Floor Level Elevation Guide (Left Edge Full Tower Elevator Ruler) ── */}
      <div
        ref={rulerRef}
        style={{
          position: 'absolute',
          left: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 145,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
          background: 'rgba(4, 10, 6, 0.94)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: 8,
          padding: '8px 6px',
          maxHeight: '55vh',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.7), 0 0 14px rgba(16, 185, 129, 0.15)',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: 4,
          paddingLeft: 2,
        }}>
          <span style={{
            fontSize: 8.5,
            fontWeight: 800,
            color: '#10b981',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <span>Floors</span>
            <span style={{ fontSize: 8, color: '#6ee7b7' }}>({totalFloors})</span>
          </span>
          <div style={{ display: 'flex', gap: 2 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (clampedIdx < totalFloors - 1) {
                  doFloorChange(clampedIdx + 1);
                }
              }}
              disabled={clampedIdx >= totalFloors - 1}
              title="Fly Up 1 Floor (↑ or PageUp)"
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: 3,
                color: '#10b981',
                cursor: clampedIdx >= totalFloors - 1 ? 'not-allowed' : 'pointer',
                fontSize: 8,
                padding: '1px 4px',
              }}
            >
              ▲
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (clampedIdx > 0) {
                  doFloorChange(clampedIdx - 1);
                }
              }}
              disabled={clampedIdx <= 0}
              title="Fly Down 1 Floor (↓ or PageDown)"
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: 3,
                color: '#10b981',
                cursor: clampedIdx <= 0 ? 'not-allowed' : 'pointer',
                fontSize: 8,
                padding: '1px 4px',
              }}
            >
              ▼
            </button>
          </div>
        </div>
        {[...allFloors].reverse().map(({ f, fi }) => {
          const isAct = fi === clampedIdx;
          return (
            <div
              key={fi}
              data-floor={fi}
              onClick={() => {
                doFloorChange(fi);
                setViewFocus('floor');
                flyToFloor(fi, true);
              }}
              title={`${f.label} (${(floorH * fi).toFixed(0)}m AGL) — Click to fly to floor`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                padding: '3px 6px',
                borderRadius: 4,
                background: isAct ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                border: isAct ? '1px solid #10b981' : '1px solid transparent',
                transition: 'all 0.12s ease',
              }}
            >
              <div style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: isAct ? '#00ff88' : 'rgba(16, 185, 129, 0.35)',
                boxShadow: isAct ? '0 0 8px #00ff88' : 'none',
              }} />
              <span style={{
                fontSize: 9.5,
                fontWeight: isAct ? 700 : 500,
                color: isAct ? '#ffffff' : '#a1a1aa',
                fontFamily: "'JetBrains Mono', monospace",
                minWidth: 26,
              }}>
                L{fi}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
