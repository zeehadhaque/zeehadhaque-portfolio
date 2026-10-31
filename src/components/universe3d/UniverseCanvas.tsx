import React, { useRef, useEffect, useState, Component, ErrorInfo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useUniverseStore, SECTION_DEPTH_MAP, UniverseSection } from '../../store/universeStore';
import { CorridorEnvironment } from './CorridorEnvironment';
import { DustParticles } from './DustParticles';
import { ProfileMonolith3D } from './ProfileMonolith3D';
import { FilmCorridor3D } from './FilmCorridor3D';
import { InteractiveStations3D } from './InteractiveStations3D';
import { ZeeCore3D } from './ZeeCore3D';
import { NightTerrace3D } from './NightTerrace3D';

// Camera Controller inside Canvas
const CameraRig: React.FC = () => {
  const { camera } = useThree();
  const targetDepthZ = useUniverseStore((s) => s.targetDepthZ);
  const setDepthZ = useUniverseStore((s) => s.setDepthZ);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.1);

    // Smoothly damp camera Z towards target depth
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      targetDepthZ + 6.5, // Keep camera slightly back from current marker
      4.2,
      clampedDelta
    );

    // Subtle mouse parallax
    const targetX = mouseRef.current.x * 0.9;
    const targetY = 3.6 - mouseRef.current.y * 0.45;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3.5, clampedDelta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3.5, clampedDelta);

    // Camera look ahead along the corridor
    camera.lookAt(targetX * 0.3, 3.4, camera.position.z - 12);

    // Sync current depth to store (debounced/throttled via frame)
    setDepthZ(Math.round((camera.position.z - 6.5) * 10) / 10);
  });

  return null;
};

// WebGL Error Boundary Fallback
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}
class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('WebGL Rendering Encountered Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const UniverseCanvas: React.FC = () => {
  const qualityLevel = useUniverseStore((s) => s.qualityLevel);
  const targetDepthZ = useUniverseStore((s) => s.targetDepthZ);
  const setTargetDepthZ = useUniverseStore((s) => s.setTargetDepthZ);
  const currentSection = useUniverseStore((s) => s.currentSection);
  const navigateToSection = useUniverseStore((s) => s.navigateToSection);
  const isIntroComplete = useUniverseStore((s) => s.isIntroComplete);

  // Wheel and touch navigation listeners
  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      // Don't intercept scroll if inside an open modal
      if (document.body.classList.contains('modal-open')) return;

      const delta = e.deltaY * 0.04;
      const newTarget = Math.max(-103, Math.min(5, targetDepthZ - delta));
      setTargetDepthZ(newTarget);

      // Determine active section based on Z
      updateCurrentSectionFromZ(newTarget);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (document.body.classList.contains('modal-open')) return;
      const currentY = e.touches[0].clientY;
      const deltaY = (touchStartY - currentY) * 0.08;
      touchStartY = currentY;

      const newTarget = Math.max(-103, Math.min(5, targetDepthZ - deltaY));
      setTargetDepthZ(newTarget);
      updateCurrentSectionFromZ(newTarget);
    };

    const updateCurrentSectionFromZ = (z: number) => {
      if (z > -7) navigateToSection('gate');
      else if (z > -22) navigateToSection('profile');
      else if (z > -42) navigateToSection('archive');
      else if (z > -57) navigateToSection('story');
      else if (z > -70) navigateToSection('camera');
      else if (z > -77) navigateToSection('light');
      else if (z > -84) navigateToSection('color');
      else if (z > -90) navigateToSection('edit');
      else if (z > -94) navigateToSection('sound');
      else if (z > -98) navigateToSection('zee');
      else navigateToSection('terrace');
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [targetDepthZ, setTargetDepthZ, navigateToSection]);

  const dpr = qualityLevel === 'low' ? 1 : qualityLevel === 'medium' ? [1, 1.25] : [1, 2];

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto bg-[#020305] z-0 overflow-hidden">
      <WebGLErrorBoundary
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-[#020305] text-[#F2F0EB]">
            <div className="font-mono text-xs text-[#7DBBFF] tracking-widest mb-2">
              UNIVERSE // 2D CINEMATIC ARCHIVE MODE
            </div>
            <h2 className="font-headline text-3xl font-black mb-4">ZEEHAD HAQUE</h2>
            <p className="text-sm text-[#8A96A3] max-w-md">
              Writer · Director · Cinematographer · Editor. Exploring psychological stories through light, silence, and movement.
            </p>
          </div>
        }
      >
        <Canvas
          dpr={dpr as any}
          gl={{
            antialias: qualityLevel !== 'low',
            powerPreference: 'high-performance',
            alpha: false,
          }}
          camera={{
            position: [0, 3.6, 12],
            fov: 52,
            near: 0.1,
            far: 180,
          }}
        >
          {/* Atmospheric Nocturnal Fog */}
          <fogExp2 attach="fog" args={['#020305', 0.011]} />

          {/* Lighting Scheme: Cold Moonlight, Cyan Rim, Low Ambient */}
          <ambientLight color="#081522" intensity={0.5} />
          <directionalLight
            color="#7DBBFF"
            intensity={2.2}
            position={[8, 18, 6]}
            castShadow
          />
          <directionalLight
            color="#102B45"
            intensity={1.1}
            position={[-8, 12, -20]}
          />
          <pointLight
            color="#A9D4FF"
            intensity={0.6}
            distance={25}
            position={[0, 8, targetDepthZ]}
          />

          {/* Camera Controller with Inertia and Damping */}
          <CameraRig />

          {/* 3D World Landmarks & Corridor */}
          <CorridorEnvironment />
          <DustParticles />
          <ProfileMonolith3D />
          <FilmCorridor3D />
          <InteractiveStations3D />
          <ZeeCore3D />
          <NightTerrace3D />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
};
