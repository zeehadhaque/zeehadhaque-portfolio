import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useUniverseStore } from '../../store/universeStore';
import { ZEEHAD_IMAGE_PATH, ZEEHAD_SVG_PLACEHOLDER } from '../../utils/imageFallback';
import { soundEngine } from '../../utils/audio';

export const ProfileMonolith3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const setProfileDossierOpen = useUniverseStore((s) => s.setProfileDossierOpen);
  const setCursorLabel = useUniverseStore((s) => s.setCursorLabel);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    // Try to load ZEEHAD.png first, fall back to inline SVG placeholder
    loader.load(
      ZEEHAD_IMAGE_PATH,
      (loadedTex) => {
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        setTexture(loadedTex);
      },
      undefined,
      () => {
        loader.load(ZEEHAD_SVG_PLACEHOLDER, (fallbackTex) => {
          fallbackTex.colorSpace = THREE.SRGBColorSpace;
          setTexture(fallbackTex);
        });
      }
    );
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.025 : 1.0;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 4
    );
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    setCursorLabel('VIEW PROFILE');
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
    setProfileDossierOpen(true);
  };

  return (
    <group
      ref={groupRef}
      position={[0, 4.2, -15]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Stone Monolith Outer Slab */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[4.8, 7.8, 0.7]} />
        <meshStandardMaterial
          color="#060A12"
          roughness={0.35}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Cyan Rim Glow Frame */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[4.88, 7.96, 0.65]} />
        <meshBasicMaterial
          color={hovered ? '#7DBBFF' : '#102B45'}
          wireframe
        />
      </mesh>

      {/* Picture Frame / Screen Inset */}
      <mesh position={[0, 1.3, 0.36]}>
        <planeGeometry args={[3.8, 4.4]} />
        {texture ? (
          <meshBasicMaterial map={texture} />
        ) : (
          <meshStandardMaterial color="#081522" roughness={0.3} metalness={0.7} />
        )}
      </mesh>

      {/* Monolith Telemetry Typography */}
      <group position={[0, -1.8, 0.38]}>
        <Text
          position={[0, 0.35, 0]}
          fontSize={0.34}
          color="#F2F0EB"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
        >
          ZEEHAD HAQUE
        </Text>
        <Text
          position={[0, -0.1, 0]}
          fontSize={0.14}
          color="#7DBBFF"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.16}
        >
          WRITER · DIRECTOR · CINEMATOGRAPHER · EDITOR
        </Text>
        <Text
          position={[0, -0.45, 0]}
          fontSize={0.11}
          color="#8A96A3"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
        >
          [ CLICK TO OPEN DIRECTORIAL DOSSIER ]
        </Text>
      </group>

      {/* Pedestal Base */}
      <mesh position={[0, -4.0, 0]}>
        <boxGeometry args={[5.6, 0.6, 1.8]} />
        <meshStandardMaterial
          color="#03060B"
          roughness={0.85}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
};
