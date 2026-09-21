import { useState, useEffect, useRef, useMemo } from 'react';
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
  accentClr = '#38bdf8',
}) {
  const mountRef = useRef(null);

  // ── UI States ──────────────────────────────────────────────────────────────
  const [dissection, setDissection] = useState(35); // 0% (compact) to 100% (exploded)
  const [facadeMode, setFacadeMode] = useState('cutaway'); // 'cutaway' | 'glass' | 'wireframe' | 'open'
  const [autoRotate, setAutoRotate] = useState(false);
  const [hoveredFloor, setHoveredFloor] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Building geometry metrics in Three.js units (1 unit = 1 metre)
  const BLDG_W = 38;
  const BLDG_D = 26;
  const SLAB_THICKNESS = 0.4;
  const ROOM_H = 2.2;
  const BASE_FLOOR_H = 3.6;

  // Floor sampling for performance on skyscrapers with 50+ floors
  // Always include ground, rooftop, selected, and evenly distributed levels
  const MAX_RENDER_SLABS = 32;
  const step = Math.max(1, Math.floor(totalFloors / MAX_RENDER_SLABS));
  const renderedFloors = useMemo(() => {
    return floors
      .map((f, fi) => ({ f, fi }))
      .filter(({ fi }) => fi % step === 0 || fi === 0 || fi === totalFloors - 1 || fi === clampedIdx);
  }, [floors, step, totalFloors, clampedIdx]);

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

  // ── Three.js Scene Setup ───────────────────────────────────────────────────
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x030712);
    scene.fog = new THREE.FogExp2(0x030712, 0.0035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.5, 1200);
    cameraRef.current = camera;
    const initialDist = Math.max(70, totalFloors * 2.8);
    camera.position.set(initialDist * 0.9, initialDist * 0.75, initialDist * 1.15);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 + 0.08; // slightly below horizon allowed
    controls.minDistance = 15;
    controls.maxDistance = 600;
    controls.target.set(0, (totalFloors * BASE_FLOOR_H) / 2, 0);
    controls.update();

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.2);
    dirLight1.position.set(60, 120, 80);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 1.4);
    dirLight2.position.set(-80, 80, -60);
    scene.add(dirLight2);

    const groundGlowLight = new THREE.PointLight(0x06b6d4, 2.0, 180);
    groundGlowLight.position.set(0, -2, 0);
    scene.add(groundGlowLight);

    // 6. Ground Grid & Foundation Platform
    const gridHelper = new THREE.GridHelper(260, 52, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // Foundation slab
    const foundGeo = new THREE.BoxGeometry(BLDG_W + 10, 1.2, BLDG_D + 10);
    const foundMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
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
      new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.4 })
    );
    foundLine.position.y = -0.6;
    scene.add(foundLine);

    // 7. Elevator Core Shaft (Continuous vertical core)
    const CORE_W = 8;
    const CORE_D = 8;
    const bldgTotalH = totalFloors * BASE_FLOOR_H;
    const coreGeo = new THREE.BoxGeometry(CORE_W, bldgTotalH * 2.2, CORE_D);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.3,
      transparent: true,
      opacity: 0.4,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, bldgTotalH * 0.8, 0);
    scene.add(coreMesh);

    // Core shaft frame edges
    const coreEdges = new THREE.EdgesGeometry(coreGeo);
    const coreLines = new THREE.LineSegments(
      coreEdges,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 })
    );
    coreLines.position.copy(coreMesh.position);
    scene.add(coreLines);

    // Animated elevator cabs inside core
    const cabGeo = new THREE.BoxGeometry(2.4, 2.8, 2.4);
    const cabMat1 = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
    const cab1 = new THREE.Mesh(cabGeo, cabMat1);
    cab1.position.set(-1.8, 4, 0);
    scene.add(cab1);

    const cabMat2 = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
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
      color: 0x0284c7,
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
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 })
    );
    shellWireframe.position.copy(glassMesh.position);
    scene.add(shellWireframe);

    // B. Cutaway Shell (back and left/right glass, front open)
    // We create separate planes for back, left, right so front is cut away
    const cutawayGroup = new THREE.Group();
    const cutMat = new THREE.MeshPhysicalMaterial({
      color: 0x0369a1,
      roughness: 0.1,
      transparent: true,
      opacity: 0.12,
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

    // Store facade meshes for toggling
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
      const dissPct = dissectionRef.current / 100; // 0 to 1
      const extraGap = dissPct * (BASE_FLOOR_H * 2.2);

      floorGroupsRef.current.forEach(({ group, vIdx, totalV }) => {
        const targetY = vIdx * (BASE_FLOOR_H + extraGap);
        // Smooth lerp for buttery motion
        group.position.y += (targetY - group.position.y) * 0.12;
      });

      // Auto-rotate if enabled
      if (controls.autoRotate) {
        controls.update();
      } else {
        controls.update();
      }

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

  // ── Build Floor Slabs & 3D Interior Rooms ──────────────────────────────────
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

    // Columns geometry
    const colGeo = new THREE.BoxGeometry(0.7, ROOM_H, 0.7);
    const colMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.4, roughness: 0.6 });

    // Build each visible floor
    renderedFloors.forEach(({ f, fi }, vIdx) => {
      const meta = floorMeta(f.label, fi, totalFloors);
      const isSelected = fi === clampedIdx;
      const floorColor = new THREE.Color(meta.color);

      const floorGroup = new THREE.Group();
      floorGroup.userData = { fi, f, meta };

      // 1. Floor Slab Mesh
      const slabMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x0f2744 : 0x0f172a,
        roughness: 0.6,
        metalness: 0.2,
      });
      const slabMesh = new THREE.Mesh(slabGeo, slabMat);
      slabMesh.position.set(0, 0, 0);
      slabMesh.userData = { type: 'slab', fi, f, meta };
      floorGroup.add(slabMesh);

      // Slab glowing edge line
      const lineMat = new THREE.LineBasicMaterial({
        color: isSelected ? 0x38bdf8 : floorColor,
        transparent: true,
        opacity: isSelected ? 1.0 : 0.65,
        linewidth: isSelected ? 2 : 1,
      });
      const slabEdges = new THREE.LineSegments(slabEdgesGeo, lineMat);
      slabEdges.position.copy(slabMesh.position);
      floorGroup.add(slabEdges);

      // Floor level text indicator / corner beacon
      const beaconGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const beaconMat = new THREE.MeshBasicMaterial({ color: isSelected ? 0x00f5ff : floorColor });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(-BLDG_W / 2 + 0.6, SLAB_THICKNESS / 2 + 0.4, -BLDG_D / 2 + 0.6);
      floorGroup.add(beacon);

      // 2. Interior Rooms Extrusion
      const rooms = getFloorRooms(building, f, fi, totalFloors);
      rooms.forEach((room, ri) => {
        // Map 2D floor plate (38m x 26m) coordinates to Three.js centered space
        const rX = room.x + room.w / 2 - BLDG_W / 2;
        const rZ = room.z + room.d / 2 - BLDG_D / 2;
        const rW = room.w * 0.94;
        const rD = room.d * 0.94;
        const rColor = new THREE.Color(room.color || typeColor(room.type));

        // 3D Room Box
        const roomGeo = new THREE.BoxGeometry(rW, ROOM_H, rD);
        const roomMat = new THREE.MeshStandardMaterial({
          color: rColor,
          roughness: 0.4,
          metalness: 0.1,
          transparent: true,
          opacity: isSelected ? 0.42 : 0.25,
          depthWrite: false,
        });
        const roomMesh = new THREE.Mesh(roomGeo, roomMat);
        roomMesh.position.set(rX, SLAB_THICKNESS / 2 + ROOM_H / 2, rZ);
        roomMesh.userData = { type: 'room', room, fi, f };
        floorGroup.add(roomMesh);

        // Room glowing CAD edge outline
        const roomEdges = new THREE.EdgesGeometry(roomGeo);
        const roomEdgeLine = new THREE.LineSegments(
          roomEdges,
          new THREE.LineBasicMaterial({
            color: rColor,
            transparent: true,
            opacity: isSelected ? 0.9 : 0.55,
          })
        );
        roomEdgeLine.position.copy(roomMesh.position);
        floorGroup.add(roomEdgeLine);

        // Floor zone color pad (thin plate on slab)
        const padGeo = new THREE.BoxGeometry(rW, 0.04, rD);
        const padMat = new THREE.MeshBasicMaterial({
          color: rColor,
          transparent: true,
          opacity: 0.35,
        });
        const padMesh = new THREE.Mesh(padGeo, padMat);
        padMesh.position.set(rX, SLAB_THICKNESS / 2 + 0.03, rZ);
        floorGroup.add(padMesh);
      });

      // 3. Structural Columns (Corners & grid)
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

      // Set initial Y position
      const initialY = vIdx * BASE_FLOOR_H;
      floorGroup.position.set(0, initialY, 0);

      scene.add(floorGroup);
      floorGroupsRef.current.push({ group: floorGroup, vIdx, totalV: renderedFloors.length, fi, f });
    });
  }, [renderedFloors, clampedIdx, building, totalFloors]);

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

    // Raycast against all objects in floor groups
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
      container.style.cursor = 'grab';
    }
  };

  const onPointerDown = () => {
    if (mountRef.current) mountRef.current.style.cursor = 'grabbing';
  };

  const onPointerUp = () => {
    if (mountRef.current) mountRef.current.style.cursor = 'grab';
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

    const bldgTotalH = totalFloors * BASE_FLOOR_H;
    const targetY = bldgTotalH / 2;
    controls.target.set(0, targetY, 0);

    const dist = Math.max(65, totalFloors * 2.5);

    if (preset === 'iso') {
      camera.position.set(dist * 0.85, dist * 0.75, dist * 1.05);
    } else if (preset === 'front') {
      camera.position.set(0, targetY, dist * 1.35);
    } else if (preset === 'top') {
      camera.position.set(0.1, dist * 1.4, 0.1);
    } else if (preset === 'side') {
      camera.position.set(dist * 1.35, targetY, 0);
    }
    controls.update();
  };

  const currentFloorObj = floors[clampedIdx] || { label: `Floor ${clampedIdx + 1}` };
  const currentMeta = floorMeta(currentFloorObj.label, clampedIdx, totalFloors);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 140,
      background: 'radial-gradient(ellipse 90% 90% at 50% 35%, #040916 0%, #010308 100%)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none',
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
          background: 'rgba(6, 182, 212, 0.12)',
          border: '1px solid rgba(6, 182, 212, 0.40)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.25)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '2px',
              color: '#38bdf8',
              textTransform: 'uppercase',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              3D Cuboid Building Dissection
            </span>
            <span style={{
              fontSize: 9,
              padding: '1px 6px',
              borderRadius: 4,
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              fontWeight: 700,
            }}>
              WHOLE BUILDING INTERIOR
            </span>
          </div>

          <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginTop: 3 }}>
            {building.name}
            <span style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', marginLeft: 10 }}>
              {totalFloors} Floors · {building.height}m Height
            </span>
          </div>
        </div>
      </div>

      {/* ── Top-Right View Switcher & Camera Toolbar ── */}
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
          background: 'rgba(2, 6, 18, 0.85)',
          backdropFilter: 'blur(20px)',
          padding: 3,
          borderRadius: 10,
          border: '1px solid rgba(56, 189, 248, 0.30)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
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
              background: 'rgba(56, 189, 248, 0.22)',
              color: '#38bdf8',
              outline: '1px solid rgba(56, 189, 248, 0.45)',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'default',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            Whole Building 3D
          </button>
        </div>

        {/* Camera Preset Buttons */}
        <div style={{
          display: 'flex',
          gap: 4,
          background: 'rgba(2, 6, 18, 0.85)',
          backdropFilter: 'blur(20px)',
          padding: 3,
          borderRadius: 10,
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}>
          <button
            onClick={() => setCameraPreset('iso')}
            title="Isometric 3D Perspective"
            style={{
              padding: '6px 10px',
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
              padding: '6px 10px',
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
              padding: '6px 10px',
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
            title="Toggle Auto-Rotate"
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: 'none',
              background: autoRotate ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
              color: autoRotate ? '#38bdf8' : '#94a3b8',
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
          background: 'rgba(2, 6, 23, 0.94)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${hoveredFloor.meta.color}80`,
          borderRadius: 8,
          padding: '8px 12px',
          color: '#f8fafc',
          boxShadow: `0 8px 32px rgba(0,0,0,0.7), 0 0 20px ${hoveredFloor.meta.color}30`,
          minWidth: 170,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{
              fontSize: 11,
              fontWeight: 800,
              color: hoveredFloor.meta.color,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              L{hoveredFloor.fi} · {hoveredFloor.label}
            </span>
            <span style={{ fontSize: 9.5, color: '#94a3b8', fontFamily: 'monospace' }}>
              {hoveredFloor.elev}m AGL
            </span>
          </div>
          <div style={{
            marginTop: 4,
            padding: '3px 6px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.40)',
            borderRadius: 4,
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            color: '#38bdf8',
            whiteSpace: 'nowrap',
          }}>
            🔑 {hoveredFloor.ulpin || getFloorULPIN(building, hoveredFloor.fi)}
          </div>
          <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 4 }}>
            {hoveredFloor.meta.category}
          </div>
          {hoveredFloor.room && (
            <div style={{
              fontSize: 9.5,
              color: '#38bdf8',
              marginTop: 4,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: 3,
            }}>
              Room: {hoveredFloor.room.label} ({hoveredFloor.room.area}m²)
            </div>
          )}
          <div style={{ fontSize: 8.5, color: '#64748b', marginTop: 4, fontStyle: 'italic' }}>
            Click slab to inspect floor plan
          </div>
        </div>
      )}

      {/* ── Bottom Control Deck (Dissection Slider + Facade Modes + Quick Inspect) ── */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'rgba(2, 6, 20, 0.90)',
        backdropFilter: 'blur(28px)',
        border: '1px solid rgba(56, 189, 248, 0.32)',
        borderRadius: 16,
        padding: '10px 22px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.75), 0 0 25px rgba(56, 189, 248, 0.15)',
      }}>

        {/* 1. Floor Dissection Spacing Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{
              fontSize: 9.5,
              fontWeight: 800,
              letterSpacing: '0.8px',
              color: '#38bdf8',
              textTransform: 'uppercase',
              fontFamily: "'JetBrains Mono', monospace",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span>Floor Dissection</span>
              <span style={{ color: '#94a3b8' }}>{dissection}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => setDissection(0)}
                title="Compact Cuboid (0%)"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: dissection === 0 ? '#38bdf8' : '#64748b',
                  fontSize: 9,
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                COMPACT
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={dissection}
                onChange={(e) => setDissection(Number(e.target.value))}
                style={{
                  width: 140,
                  height: 4,
                  accentColor: '#38bdf8',
                  cursor: 'pointer',
                }}
              />
              <button
                onClick={() => setDissection(100)}
                title="Full Exploded Dissection (100%)"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: dissection === 100 ? '#38bdf8' : '#64748b',
                  fontSize: 9,
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                EXPLODE
              </button>
            </div>
          </div>
        </div>

        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.12)' }} />

        {/* 2. Facade Modes Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 9.5, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            Facade:
          </span>
          {[
            { id: 'cutaway', label: 'Cutaway' },
            { id: 'glass', label: 'Glass Cuboid' },
            { id: 'wireframe', label: 'Wireframe' },
            { id: 'open', label: 'Open' },
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => setFacadeMode(mode.id)}
              style={{
                padding: '4px 9px',
                borderRadius: 6,
                border: 'none',
                background: facadeMode === mode.id ? 'rgba(56, 189, 248, 0.22)' : 'rgba(255,255,255,0.05)',
                color: facadeMode === mode.id ? '#38bdf8' : '#94a3b8',
                outline: facadeMode === mode.id ? '1px solid rgba(56, 189, 248, 0.45)' : 'none',
                fontSize: 10,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.12)' }} />

        {/* 3. Selected Floor Inspector & Jump Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: currentMeta.color,
            boxShadow: `0 0 10px ${currentMeta.color}`,
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 230 }}>
            <span style={{
              fontSize: 11.5,
              fontWeight: 800,
              color: '#f8fafc',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              L{clampedIdx} · {currentFloorObj.label}
            </span>
            <span style={{
              fontSize: 10,
              color: '#38bdf8',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              letterSpacing: '0.2px',
              marginTop: 2,
              whiteSpace: 'nowrap',
            }}>
              🔑 {currentFloorObj.ulpin || currentFloorObj.canonical_rid || getFloorULPIN(building, clampedIdx)}
            </span>
            <span style={{ fontSize: 9, color: '#94a3b8', marginTop: 1 }}>
              {(floorH * Math.max(0, clampedIdx)).toFixed(0)}m AGL · {currentMeta.category}
            </span>
          </div>

          <button
            onClick={() => setViewMode('floor')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              fontSize: 10.5,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 10px rgba(2, 132, 199, 0.40)',
              marginLeft: 4,
            }}
          >
            <span>Inspect Floor</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

      </div>

      {/* ── Floor Level Elevation Guide (Left Edge Ruler) ── */}
      <div style={{
        position: 'absolute',
        left: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 145,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6,
        background: 'rgba(2, 6, 20, 0.70)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        padding: '10px 10px',
        maxHeight: '45vh',
        overflowY: 'auto',
        scrollbarWidth: 'none',
      }}>
        <span style={{
          fontSize: 8.5,
          fontWeight: 800,
          color: '#64748b',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          Floors
        </span>
        {[...renderedFloors].reverse().map(({ f, fi }) => {
          const fm = floorMeta(f.label, fi, totalFloors);
          const isAct = fi === clampedIdx;
          return (
            <div
              key={fi}
              onClick={() => doFloorChange(fi)}
              title={`${f.label} (${(floorH * fi).toFixed(0)}m)`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                padding: '2px 4px',
                borderRadius: 4,
                background: isAct ? 'rgba(56, 189, 248, 0.20)' : 'transparent',
                transition: 'all 0.12s',
              }}
            >
              <div style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: isAct ? fm.color : 'rgba(255,255,255,0.25)',
                boxShadow: isAct ? `0 0 6px ${fm.color}` : 'none',
              }} />
              <span style={{
                fontSize: 9,
                fontWeight: isAct ? 800 : 500,
                color: isAct ? '#38bdf8' : 'rgba(255,255,255,0.40)',
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
