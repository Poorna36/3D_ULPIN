import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ModelEarth() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 540;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    // Dynamic distance calculation: guarantees the sphere is ALWAYS 100% unclipped
    // with smooth breathing room whether the viewport is wide, square, or tall
    const updateCameraDistance = (w, h) => {
      const aspect = w / h;
      camera.aspect = aspect;
      const fovRad = (camera.fov * Math.PI) / 180;
      const halfTan = Math.tan(fovRad / 2);
      // 75% fill factor guarantees 12.5% safety margin on all sides:
      // completely circular, zero clipping on canvas edges in any viewport ratio
      const minFactor = Math.min(1.0, aspect);
      const targetZ = 2.0 / (0.75 * halfTan * minFactor);
      camera.position.set(0, 0, targetZ);
      camera.updateProjectionMatrix();
    };
    updateCameraDistance(width, height);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 3. Earth Group (Real 23.4 deg axial tilt)
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = (23.4 * Math.PI) / 180;
    scene.add(earthGroup);

    // 4. Geometry & Texture (Bold 2.0 radius)
    const geometry = new THREE.SphereGeometry(2, 96, 96);
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(
      '/earth-blue-marble.jpg',
      () => { renderer.render(scene, camera); }
    );
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Standard PBR Material - clean, natural look
    const material = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.7,
      metalness: 0.05,
    });

    const earthMesh = new THREE.Mesh(geometry, material);
    // Centered initially on India / Asia
    earthMesh.rotation.y = 4.2;
    earthGroup.add(earthMesh);

    // 5. Clean, Natural Lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(5, 3, 4);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x0e1726, 0.75);
    scene.add(ambientLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // 6. Interactive Drag & Spin
    let isDragging = false;
    let previousMouse = { x: 0, y: 0 };
    let userVelocity = { x: 0, y: 0 };
    const autoSpeed = 0.0016;

    const onMouseDown = (e) => {
      isDragging = true;
      previousMouse = { x: e.clientX, y: e.clientY };
      userVelocity = { x: 0, y: 0 };
      if (container) container.style.cursor = 'grabbing';
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouse.x;
      const deltaY = e.clientY - previousMouse.y;
      earthMesh.rotation.y += deltaX * 0.005;
      earthMesh.rotation.x += deltaY * 0.0035;
      userVelocity = { x: deltaY * 0.0035, y: deltaX * 0.005 };
      previousMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      isDragging = false;
      if (container) container.style.cursor = 'grab';
    };
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMouse.x;
      const deltaY = e.touches[0].clientY - previousMouse.y;
      earthMesh.rotation.y += deltaX * 0.005;
      earthMesh.rotation.x += deltaY * 0.0035;
      previousMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging = false; };

    const domEl = renderer.domElement;
    domEl.style.cursor = 'grab';
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 7. Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        earthMesh.rotation.y += autoSpeed;
        if (Math.abs(userVelocity.y) > 0.0001) {
          earthMesh.rotation.y += userVelocity.y;
          userVelocity.y *= 0.94;
        }
        if (Math.abs(userVelocity.x) > 0.0001) {
          earthMesh.rotation.x += userVelocity.x;
          userVelocity.x *= 0.94;
        }
      }
      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      updateCameraDistance(w, h);
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (container.contains(domEl)) container.removeChild(domEl);
      geometry.dispose();
      material.dispose();
      earthTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    />
  );
}
