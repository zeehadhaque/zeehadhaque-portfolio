import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useUniverseStore } from '../../store/universeStore';
import { soundEngine } from '../../utils/audio';

interface StationProps {
  id: 'story' | 'camera' | 'light' | 'color' | 'edit' | 'sound';
  title: string;
  subtitle: string;
  zDepth: string;
  position: [number, number, number];
  renderSculpture: (hovered: boolean) => React.ReactNode;
}

const LabStation: React.FC<StationProps> = ({
  id,
  title,
  subtitle,
  zDepth,
  position,
  renderSculpture,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const setActiveLab = useUniverseStore((s) => s.setActiveLab);
  const setCursorLabel = useUniverseStore((s) => s.setCursorLabel);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.08 : 1.0;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 5
    );
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    setCursorLabel(`${title.toUpperCase()}`);
    soundEngine.playHover();
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(false);
    setCursorLabel('EXPLORE');
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    soundEngine.playShutter();
    setActiveLab(id);
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* 3D Kinetic Sculpture */}
      {renderSculpture(hovered)}

      {/* Base Pedestal */}
      <mesh position={[0, -2.5, 0]}>
        <cylinderGeometry args={[2.2, 2.6, 0.6, 24]} />
        <meshStandardMaterial
          color="#060A12"
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* Outer Cyan Ring */}
      <mesh position={[0, -2.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.4, 32]} />
        <meshBasicMaterial
          color={hovered ? '#7DBBFF' : '#102B45'}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Typography Plaque */}
      <group position={[0, -3.2, 0]}>
        <Text
          position={[0, 0.28, 0]}
          fontSize={0.28}
          color="#F2F0EB"
          anchorX="center"
          letterSpacing={0.12}
        >
          {title}
        </Text>
        <Text
          position={[0, 0.0, 0]}
          fontSize={0.12}
          color="#7DBBFF"
          anchorX="center"
          letterSpacing={0.16}
        >
          {`${subtitle} // ${zDepth}`}
        </Text>
        <Text
          position={[0, -0.25, 0]}
          fontSize={0.1}
          color="#8A96A3"
          anchorX="center"
          letterSpacing={0.15}
        >
          [ CLICK TO ENTER SIMULATION ]
        </Text>
      </group>
    </group>
  );
};

export const InteractiveStations3D: React.FC = () => {
  // Kinetic animators
  const storyRingRef = useRef<THREE.Group>(null);
  const cameraApertureRef = useRef<THREE.Group>(null);
  const lightLampRef = useRef<THREE.Group>(null);
  const colorPrismRef = useRef<THREE.Mesh>(null);
  const editReelRef = useRef<THREE.Group>(null);
  const soundWaveRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (storyRingRef.current) storyRingRef.current.rotation.y += delta * 0.4;
    if (cameraApertureRef.current) cameraApertureRef.current.rotation.z += delta * 0.6;
    if (lightLampRef.current) lightLampRef.current.rotation.y += delta * 0.3;
    if (colorPrismRef.current) {
      colorPrismRef.current.rotation.y += delta * 0.5;
      colorPrismRef.current.rotation.x += delta * 0.2;
    }
    if (editReelRef.current) editReelRef.current.rotation.z -= delta * 0.5;
    if (soundWaveRef.current) soundWaveRef.current.rotation.y += delta * 0.35;
  });

  return (
    <group>
      {/* 1. STORY LAB (Z = -50) */}
      <LabStation
        id="story"
        title="STORY ARCHITECT"
        subtitle="DRAMATIC TENSION & BEAT LAB"
        zDepth="Z-50"
        position={[0, 3.8, -50]}
        renderSculpture={(hovered) => (
          <group ref={storyRingRef}>
            <mesh>
              <torusGeometry args={[1.5, 0.08, 16, 48]} />
              <meshStandardMaterial
                color={hovered ? '#7DBBFF' : '#2C6EA6'}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.2, 0.04, 16, 48]} />
              <meshBasicMaterial color="#102B45" wireframe />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <octahedronGeometry args={[0.55]} />
              <meshStandardMaterial
                color="#7DBBFF"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        )}
      />

      {/* 2. CAMERA LAB (Z = -65) */}
      <LabStation
        id="camera"
        title="CAMERA SIMULATOR"
        subtitle="2.39:1 ANAMORPHIC LAB & LENSES"
        zDepth="Z-65"
        position={[0, 3.8, -65]}
        renderSculpture={(hovered) => (
          <group ref={cameraApertureRef}>
            {/* Outer Lens Barrel */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[1.4, 1.4, 0.6, 32, 1, true]} />
              <meshStandardMaterial
                color="#0A1220"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            {/* Glowing Focus Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.42, 0.05, 16, 32]} />
              <meshBasicMaterial color={hovered ? '#7DBBFF' : '#2C6EA6'} />
            </mesh>
            {/* Aperture Iris Center */}
            <mesh>
              <circleGeometry args={[0.7, 8]} />
              <meshBasicMaterial
                color={hovered ? '#7DBBFF' : '#020305'}
                wireframe
              />
            </mesh>
          </group>
        )}
      />

      {/* 3. LIGHT LAB (Z = -75) */}
      <LabStation
        id="light"
        title="LIGHTING STUDIO"
        subtitle="3-POINT RIG & CONTRAST RATIO"
        zDepth="Z-75"
        position={[0, 3.8, -75]}
        renderSculpture={(hovered) => (
          <group ref={lightLampRef}>
            {/* Center Fresnel Spotlight Housing */}
            <mesh>
              <sphereGeometry args={[0.9, 24, 24]} />
              <meshStandardMaterial
                color="#06090E"
                metalness={0.85}
                roughness={0.3}
              />
            </mesh>
            {/* Glowing Barn Doors */}
            <mesh position={[0, 0, 0.95]}>
              <circleGeometry args={[0.6, 24]} />
              <meshBasicMaterial
                color={hovered ? '#A9D4FF' : '#7DBBFF'}
                transparent
                opacity={0.85}
              />
            </mesh>
            {/* 3 Orbiting Mini Key Lights */}
            {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * 1.6,
                  Math.sin(angle) * 0.5,
                  Math.sin(angle) * 1.6,
                ]}
              >
                <sphereGeometry args={[0.16, 12, 12]} />
                <meshBasicMaterial color="#7DBBFF" />
              </mesh>
            ))}
          </group>
        )}
      />

      {/* 4. COLOR LAB (Z = -80) */}
      <LabStation
        id="color"
        title="COLOR GRADING LAB"
        subtitle="NOCTURNE & FILM LUT SHADERS"
        zDepth="Z-80"
        position={[0, 3.8, -80]}
        renderSculpture={(hovered) => (
          <mesh ref={colorPrismRef}>
            <octahedronGeometry args={[1.2]} />
            <meshPhysicalMaterial
              color={hovered ? '#7DBBFF' : '#2C6EA6'}
              transmission={0.85}
              opacity={1}
              transparent
              roughness={0.05}
              metalness={0.2}
              ior={1.6}
            />
          </mesh>
        )}
      />

      {/* 5. EDIT LAB (Z = -88) */}
      <LabStation
        id="edit"
        title="EDIT SUITE"
        subtitle="PACING, J-CUT & MONTAGE LAB"
        zDepth="Z-88"
        position={[0, 3.8, -88]}
        renderSculpture={(hovered) => (
          <group ref={editReelRef}>
            <mesh>
              <cylinderGeometry args={[1.3, 1.3, 0.15, 32]} />
              <meshStandardMaterial
                color="#0A101C"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            {/* Film Reel Sprocket Holes */}
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const ang = (i * Math.PI) / 3;
              return (
                <mesh
                  key={i}
                  position={[Math.cos(ang) * 0.75, Math.sin(ang) * 0.75, 0.1]}
                >
                  <circleGeometry args={[0.2, 16]} />
                  <meshBasicMaterial
                    color={hovered ? '#7DBBFF' : '#020305'}
                  />
                </mesh>
              );
            })}
          </group>
        )}
      />

      {/* 6. SOUND LAB (Z = -92) */}
      <LabStation
        id="sound"
        title="SOUND DESIGN LAB"
        subtitle="SUB-BASS 42HZ & FOLEY MIXER"
        zDepth="Z-92"
        position={[0, 3.8, -92]}
        renderSculpture={(hovered) => (
          <group ref={soundWaveRef}>
            {[0.8, 1.2, 1.6].map((radius, i) => (
              <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / 4]}>
                <torusGeometry args={[radius, 0.04, 12, 32]} />
                <meshStandardMaterial
                  color={hovered ? '#A9D4FF' : '#2C6EA6'}
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
            ))}
            <mesh>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshBasicMaterial color="#7DBBFF" wireframe />
            </mesh>
          </group>
        )}
      />
    </group>
  );
};
