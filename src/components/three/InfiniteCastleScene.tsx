import { useEffect, useRef } from "react";
import * as THREE from "three";

interface InfiniteCastleSceneProps {
  scrollProgress: number; // 0.0 to 1.0
  activeStage?: number;   // 0 to 6
  reducedMotion?: boolean;
  liteMode?: boolean;
}

export function InfiniteCastleScene({
  scrollProgress,
  reducedMotion = false,
  liteMode = false,
}: InfiniteCastleSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020305);
    scene.fog = new THREE.FogExp2(0x020305, 0.018);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / container.clientHeight,
      0.1,
      250
    );
    camera.position.set(0, 2.8, 16);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !liteMode,
      powerPreference: "high-performance",
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, liteMode ? 1 : 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1424, 1.4);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0x7dbbff, 2.2);
    moonLight.position.set(5, 25, 10);
    scene.add(moonLight);

    const portalLight = new THREE.PointLight(0x7dbbff, 3.5, 45, 1.8);
    portalLight.position.set(0, 4, 2);
    scene.add(portalLight);

    const naveLight = new THREE.PointLight(0x3a6ea5, 2.5, 80, 1.5);
    naveLight.position.set(0, 6, -50);
    scene.add(naveLight);

    // 5. Materials
    const obsidianMaterial = new THREE.MeshStandardMaterial({
      color: 0x050810,
      roughness: 0.25,
      metalness: 0.85,
    });

    const gothicRibMaterial = new THREE.MeshStandardMaterial({
      color: 0x091426,
      roughness: 0.4,
      metalness: 0.7,
      wireframe: false,
    });

    const glowCyanMaterial = new THREE.MeshBasicMaterial({
      color: 0x7dbbff,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });

    const crystalMaterial = new THREE.MeshStandardMaterial({
      color: 0x0e223d,
      roughness: 0.1,
      metalness: 0.95,
      emissive: 0x1d3d63,
      emissiveIntensity: 0.45,
    });

    // 6. Reflective Obsidian Floor Plane
    const floorGeo = new THREE.PlaneGeometry(36, 260, 24, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x020306,
      roughness: 0.15,
      metalness: 0.92,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.05, -70);
    scene.add(floor);

    // Floor Guide Lines (Tron/Auteur Cyber-Gothic Grid)
    const gridGeo = new THREE.BufferGeometry();
    const gridPoints: number[] = [];
    for (let x = -14; x <= 14; x += 3.5) {
      gridPoints.push(x, 0.01, 20);
      gridPoints.push(x, 0.01, -160);
    }
    gridGeo.setAttribute("position", new THREE.Float32BufferAttribute(gridPoints, 3));
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x7dbbff,
      transparent: true,
      opacity: 0.14,
    });
    const floorGrid = new THREE.LineSegments(gridGeo, gridMat);
    scene.add(floorGrid);

    // 7. Monumental Gothic Arches & Pillars
    const archesGroup = new THREE.Group();
    const archCount = 14;
    const archSpacing = 12;

    for (let i = 0; i < archCount; i++) {
      const z = 8 - i * archSpacing;

      // Left column
      const colGeo = new THREE.BoxGeometry(0.85, 12, 0.85);
      const colLeft = new THREE.Mesh(colGeo, obsidianMaterial);
      colLeft.position.set(-6.5, 6, z);
      archesGroup.add(colLeft);

      // Right column
      const colRight = new THREE.Mesh(colGeo, obsidianMaterial);
      colRight.position.set(6.5, 6, z);
      archesGroup.add(colRight);

      // Gothic pointed arch top
      const archTorusGeo = new THREE.TorusGeometry(6.5, 0.45, 8, 24, Math.PI);
      const archTop = new THREE.Mesh(archTorusGeo, gothicRibMaterial);
      archTop.rotation.z = 0;
      archTop.position.set(0, 11.5, z);
      archesGroup.add(archTop);

      // Outer rib spire
      const spireGeo = new THREE.ConeGeometry(0.35, 3.5, 6);
      const spireL = new THREE.Mesh(spireGeo, obsidianMaterial);
      spireL.position.set(-6.5, 13.5, z);
      archesGroup.add(spireL);

      const spireR = new THREE.Mesh(spireGeo, obsidianMaterial);
      spireR.position.set(6.5, 13.5, z);
      archesGroup.add(spireR);
    }
    scene.add(archesGroup);

    // 8. Segmented Mechanical Ring (Igloo-style mechanical iris)
    const ringGroup = new THREE.Group();
    ringGroup.position.set(0, 5, -8);

    const segmentCount = 16;
    for (let s = 0; s < segmentCount; s++) {
      const angle = (s / segmentCount) * Math.PI * 2;
      const segGeo = new THREE.BoxGeometry(1.2, 0.28, 0.5);
      const segMesh = new THREE.Mesh(segGeo, s % 2 === 0 ? obsidianMaterial : glowCyanMaterial);
      segMesh.position.set(Math.cos(angle) * 7.2, Math.sin(angle) * 7.2, 0);
      segMesh.rotation.z = angle + Math.PI / 2;
      ringGroup.add(segMesh);
    }
    scene.add(ringGroup);

    // Secondary inner ring
    const innerRingGeo = new THREE.TorusGeometry(5.2, 0.12, 12, 48);
    const innerRingMesh = new THREE.Mesh(innerRingGeo, glowCyanMaterial);
    innerRingMesh.position.set(0, 5, -8);
    scene.add(innerRingMesh);

    // 9. Floating Crystalline Monoliths (Stage 2: Monoliths Chamber)
    const monolithsGroup = new THREE.Group();
    monolithsGroup.position.set(0, 4.5, -45);

    const crystalGeometries = [
      new THREE.OctahedronGeometry(1.8, 0),
      new THREE.IcosahedronGeometry(1.5, 0),
      new THREE.DodecahedronGeometry(1.6, 0),
      new THREE.OctahedronGeometry(1.9, 0),
    ];

    const monolithMeshes: THREE.Mesh[] = [];
    const positions = [
      { x: -5, y: 1.5, z: 0 },
      { x: 5, y: -0.5, z: -5 },
      { x: -4.5, y: -1.2, z: -12 },
      { x: 4.8, y: 1.8, z: -16 },
    ];

    positions.forEach((pos, idx) => {
      const geo = crystalGeometries[idx % crystalGeometries.length];
      const mesh = new THREE.Mesh(geo, crystalMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);

      // Add wireframe outer shell
      const wire = new THREE.Mesh(geo, glowCyanMaterial);
      wire.scale.set(1.08, 1.08, 1.08);
      mesh.add(wire);

      monolithMeshes.push(mesh);
      monolithsGroup.add(mesh);
    });
    scene.add(monolithsGroup);

    // 10. Volumetric Light Shafts (Cones with transparent additive blend)
    const beamGeo = new THREE.ConeGeometry(3.5, 18, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x7dbbff,
      transparent: true,
      opacity: 0.045,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const beamPositions = [-10, -35, -70, -110];
    beamPositions.forEach((zPos) => {
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(0, 9, zPos);
      beam.rotation.x = Math.PI;
      scene.add(beam);
    });

    // 11. Atmospheric Floating Motes / Dust Particles
    const particleCount = liteMode ? 120 : 380;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 24;
      particlePositions[p * 3 + 1] = Math.random() * 14 + 0.2;
      particlePositions[p * 3 + 2] = 20 - Math.random() * 180;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x7dbbff,
      size: 0.12,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Window resize listener
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // 12. Render Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Mechanical Ring Rotation
      ringGroup.rotation.z += delta * 0.45;
      innerRingMesh.rotation.z -= delta * 0.25;

      // Monoliths slow tumble and floating hover
      monolithMeshes.forEach((mesh, idx) => {
        mesh.rotation.x += delta * (0.3 + idx * 0.08);
        mesh.rotation.y += delta * (0.4 - idx * 0.05);
        mesh.position.y += Math.sin(elapsedTime * 1.5 + idx) * 0.003;
      });

      // Camera Journey mapped smoothly to scrollProgress (Z from +16 to -155)
      const targetZ = 16 - scrollRef.current * 165;
      const targetY = 2.8 - Math.sin(scrollRef.current * Math.PI) * 0.6;
      const targetX = reducedMotion ? 0 : mouseRef.current.x * 0.8;

      camera.position.z += (targetZ - camera.position.z) * 0.08;
      camera.position.y += (targetY - camera.position.y) * 0.08;
      camera.position.x += (targetX - camera.position.x) * 0.08;

      // Subtle look-ahead target down the gothic nave
      const lookZ = camera.position.z - 30;
      const lookY = 2.2 + (reducedMotion ? 0 : mouseRef.current.y * 0.4);
      const lookX = reducedMotion ? 0 : mouseRef.current.x * 0.5;
      camera.lookAt(lookX, lookY, lookZ);

      // Light pulsing with subtle breathing cycle
      portalLight.intensity = 3.2 + Math.sin(elapsedTime * 2.5) * 0.5;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [liteMode, reducedMotion]);

  return (
    <div
      ref={mountRef}
      className="infinite-castle-webgl-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
