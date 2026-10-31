import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useUniverseStore } from '../../store/universeStore';
import { soundEngine } from '../../utils/audio';

export const ZeeCore3D: React.FC = () => {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const setZeeOpen = useUniverseStore((s) => s.setZeeOpen);
  const setCursorLabel = useUniverseStore((s) => s.setCursorLabel);

  useFrame((_, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.x += delta * 0.45;
      outerRef.current.rotation.y += delta * 0.6;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.7;
      innerRef.current.rotation.y -= delta * 0.85;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.3;
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    setCursorLabel('ASK ZEE AI');
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
    setZeeOpen(true);
  };

  return (
    <group
      position={[0, 4.2, -96]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Outer Rotating Wireframe Icosahedron */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color={hovered ? '#A9D4FF' : '#7DBBFF'}
          wireframe
          emissive="#2C6EA6"
          emissiveIntensity={hovered ? 0.9 : 0.4}
        />
      </mesh>

      {/* Inner Glowing Core Crystal */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.75, 0]} />
        <meshPhysicalMaterial
          color="#A9D4FF"
          transmission={0.6}
          roughness={0.1}
          metalness={0.9}
          emissive="#7DBBFF"
          emissiveIntensity={hovered ? 0.8 : 0.3}
        />
      </mesh>

      {/* Orbiting Orbital Ring */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.2, 0.03, 16, 64]} />
          <meshBasicMaterial
            color="#2C6EA6"
            transparent
            opacity={hovered ? 0.8 : 0.4}
          />
        </mesh>
      </group>

      {/* Point Light Emitting from ZEE Core */}
      <pointLight
        color="#7DBBFF"
        intensity={hovered ? 2.5 : 1.2}
        distance={12}
        decay={2}
      />

      {/* Base Monolith Pedestal */}
      <mesh position={[0, -3.2, 0]}>
        <cylinderGeometry args={[2.0, 2.4, 0.8, 32]} />
        <meshStandardMaterial
          color="#06090E"
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* Typography Badge */}
      <group position={[0, -4.2, 0]}>
        <Text
          position={[0, 0.35, 0]}
          fontSize={0.34}
          color="#F2F0EB"
          anchorX="center"
          letterSpacing={0.15}
        >
          ZEE // AI CORE
        </Text>
        <Text
          position={[0, 0.02, 0]}
          fontSize={0.13}
          color="#7DBBFF"
          anchorX="center"
          letterSpacing={0.16}
        >
          DIRECTORIAL ASSISTANT // Z-96
        </Text>
        <Text
          position={[0, -0.28, 0]}
          fontSize={0.1}
          color="#8A96A3"
          anchorX="center"
          letterSpacing={0.18}
        >
          [ CLICK TO COMMENCE CONVERSATION ]
        </Text>
      </group>
    </group>
  );
};
