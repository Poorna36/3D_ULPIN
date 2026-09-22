/**
 * 3D ULPIN Examiner Console - Three.js Cadastral Viewer
 * Conforms to docs/features.md, docs/contracts.md, and Phase 10B.1-10B.7.
 */

const CLASS_COLORS = {
  U: 0xE8A048,  // Unit: Amber Gold
  C: 0x6DB56D,  // Common: Emerald Green
  P: 0x8A8A8A,  // Parking: Slate Grey
  A: 0x00F2FF,  // Airspace: Cyan translucent
  T: 0x9D4EDD,  // Tunnel: Deep Violet Subsurface
  E: 0x4A8BD4,  // Elevated Metro: Cobalt Blue
  I: 0xFFB703,  // Utility Corridor: Tangerine
  B: 0x38BDF8,  // Building Envelope: Blueprint Wireframe
  S: 0x334155   // Surface Parcel
};

class CadastralViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.volumes = [];
    this.meshMap = new Map();
    this.currentViewMode = 'PLAN';
    this.selectedMesh = null;
    this.hoveredMesh = null;

    this.initThree();
    this.initLights();
    this.initGround();
    this.initEvents();
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0d14);
    this.scene.fog = new THREE.FogExp2(0x0a0d14, 0.005);

    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.5, 1000);
    this.camera.position.set(60, -70, 50);
    this.camera.up.set(0, 0, 1); // Cadastral Z-up convention

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.localClippingEnabled = true;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0, 15);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Section cut plane
    this.clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 25);
  }

  initLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(50, -50, 100);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.4);
    dirLight2.position.set(-50, 50, -20);
    this.scene.add(dirLight2);
  }

  initGround() {
    const grid = new THREE.GridHelper(150, 30, 0x00f2ff, 0x1e293b);
    grid.rotation.x = Math.PI / 2; // Z-up
    this.scene.add(grid);

    // Parcel footprint base (Class S)
    const parcelGeom = new THREE.PlaneGeometry(60, 60);
    const parcelMat = new THREE.MeshBasicMaterial({
      color: 0x111827,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const parcel = new THREE.Mesh(parcelGeom, parcelMat);
    parcel.position.set(0, 0, -0.1);
    this.scene.add(parcel);
  }

  initEvents() {
    window.addEventListener('resize', () => this.onResize());

    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.handleHover();
    });

    this.container.addEventListener('click', () => {
      this.handleClick();
    });
  }

  onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  clearVolumes() {
    for (const [id, mesh] of this.meshMap) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
    this.meshMap.clear();
    this.volumes = [];
  }

  loadVolumes(volumesData) {
    this.clearVolumes();
    this.volumes = volumesData;

    volumesData.forEach(v => {
      const color = CLASS_COLORS[v.cls] || 0x38bdf8;
      const isWire = v.cls === 'B';
      const isAir = v.cls === 'A';

      // Build bounding box geometry from extents or dimensions
      const dx = v.dx || 10;
      const dy = v.dy || 10;
      const dz = v.dz || (v.z_max - v.z_min) || 3;
      const geom = new THREE.BoxGeometry(dx, dy, dz);

      const mat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.2,
        wireframe: isWire,
        transparent: isAir || isWire,
        opacity: isAir ? 0.3 : (isWire ? 0.6 : 0.92),
        clippingPlanes: this.currentViewMode === 'SECTION_CUT' ? [this.clipPlane] : []
      });

      const mesh = new THREE.Mesh(geom, mat);
      const cx = v.cx || 0;
      const cy = v.cy || 0;
      const cz = v.cz !== undefined ? v.cz : (v.z_min + dz / 2);
      mesh.position.set(cx, cy, cz);

      // Store cadastral metadata
      mesh.userData = v;
      mesh.userData.baseColor = color;
      mesh.userData.baseOpacity = mat.opacity;

      // Add edge outline
      const edges = new THREE.EdgesGeometry(geom);
      const lineMat = new THREE.LineBasicMaterial({
        color: isAir ? 0x00f2ff : 0x000000,
        linewidth: 1,
        transparent: true,
        opacity: 0.5
      });
      const edgeLines = new THREE.LineSegments(edges, lineMat);
      mesh.add(edgeLines);

      this.scene.add(mesh);
      this.meshMap.set(v.label || v.rid, mesh);
    });
  }

  handleHover() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(Array.from(this.meshMap.values()));

    if (intersects.length > 0) {
      const target = intersects[0].object;
      if (this.hoveredMesh !== target) {
        this.resetHover();
        this.hoveredMesh = target;
        if (target !== this.selectedMesh) {
          target.material.emissive = new THREE.Color(0x00f2ff);
          target.material.emissiveIntensity = 0.3;
        }
        document.body.style.cursor = 'pointer';
      }
    } else {
      this.resetHover();
      document.body.style.cursor = 'default';
    }
  }

  resetHover() {
    if (this.hoveredMesh && this.hoveredMesh !== this.selectedMesh) {
      this.hoveredMesh.material.emissive = new THREE.Color(0x000000);
      this.hoveredMesh.material.emissiveIntensity = 0.0;
    }
    this.hoveredMesh = null;
  }

  handleClick() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(Array.from(this.meshMap.values()));

    if (intersects.length > 0) {
      const target = intersects[0].object;
      this.selectMesh(target);
      if (window.onSelectCadastralVolume) {
        window.onSelectCadastralVolume(target.userData);
      }
    }
  }

  selectMesh(mesh) {
    if (this.selectedMesh) {
      this.selectedMesh.material.emissive = new THREE.Color(0x000000);
      this.selectedMesh.material.emissiveIntensity = 0.0;
    }
    this.selectedMesh = mesh;
    if (mesh) {
      mesh.material.emissive = new THREE.Color(0xffffff);
      mesh.material.emissiveIntensity = 0.5;
    }
  }

  filterLayers(activeClasses) {
    for (const [id, mesh] of this.meshMap) {
      const cls = mesh.userData.cls;
      mesh.visible = activeClasses.has(cls);
    }
  }

  setViewMode(mode) {
    this.currentViewMode = mode;
    for (const [id, mesh] of this.meshMap) {
      if (mode === 'SECTION_CUT') {
        mesh.material.clippingPlanes = [this.clipPlane];
      } else {
        mesh.material.clippingPlanes = [];
      }

      if (mode === 'DIFFERENCE') {
        // Highlight defective or warning volumes in neon red/amber
        if (mesh.userData.status === 'FAIL') {
          mesh.material.color = new THREE.Color(0xef4444);
          mesh.material.emissive = new THREE.Color(0xef4444);
          mesh.material.emissiveIntensity = 0.4;
        } else if (mesh.userData.status === 'WARN') {
          mesh.material.color = new THREE.Color(0xe8a048);
          mesh.material.emissive = new THREE.Color(0xe8a048);
          mesh.material.emissiveIntensity = 0.3;
        } else {
          mesh.material.color = new THREE.Color(0x334155);
          mesh.material.opacity = 0.25;
        }
      } else {
        mesh.material.color = new THREE.Color(mesh.userData.baseColor);
        mesh.material.opacity = mesh.userData.baseOpacity;
        mesh.material.emissive = new THREE.Color(0x000000);
        mesh.material.emissiveIntensity = 0.0;
      }
    }
  }

  focusOnParcel() {
    this.controls.reset();
    this.camera.position.set(60, -70, 50);
    this.controls.target.set(0, 0, 15);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

window.CadastralViewer = CadastralViewer;
