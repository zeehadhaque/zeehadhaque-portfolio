import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export const NightTerrace3D: React.FC = () => {
  // Generate distant stars for the open night terrace
  const stars = useMemo(() => {
    const coords: number[] = [];
    for (let i = 0; i < 400; i++) {
      coords.push(
        (Math.random() - 0.5) * 80,
        Math.random() * 30 + 10,
        -Math.random() * 40 - 105
      );
    }
    return new Float32Array(coords);
  }, []);

  return (
    <group position={[0, 0, -104]}>
      {/* Rooftop Balustrade / Railing */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[32, 0.12, 0.2]} />
        <meshStandardMaterial
          color="#08101C"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>
      {[-14, -10, -6, -2, 2, 6, 10, 14].map((x) => (
        <mesh key={x} position={[x, 0.5, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.0, 8]} />
          <meshStandardMaterial
            color="#06090E"
            roughness={0.5}
            metalness={0.8}
          />
        </mesh>
      ))}

      {/* Luminous Distant Moon */}
      <group position={[12, 22, -35]}>
        <mesh>
          <sphereGeometry args={[4.2, 32, 32]} />
          <meshBasicMaterial color="#E8F2FF" />
        </mesh>
        {/* Soft Moon Halo */}
        <mesh>
          <sphereGeometry args={[5.2, 32, 32]} />
          <meshBasicMaterial
            color="#7DBBFF"
            transparent
            opacity={0.14}
            side={THREE.BackSide}
          />
        </mesh>
        <pointLight
          color="#A9D4FF"
          intensity={1.8}
          distance={60}
          decay={1.5}
        />
      </group>

      {/* Distant Starfield */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[stars, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color="#E0EEFF"
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>

      {/* Distant City Silhouette Blocks */}
      {[-24, -18, -12, -6, 0, 6, 12, 18, 24].map((x, i) => {
        const height = 4 + (i % 4) * 2.8;
        return (
          <mesh key={i} position={[x * 1.5, height / 2 - 2, -30]}>
            <boxGeometry args={[4.5, height, 4]} />
            <meshBasicMaterial color="#020306" />
          </mesh>
        );
      })}

      {/* Directorial Closing Typography in 3D Space */}
      <group position={[0, 6.5, -4]}>
        <Text
          position={[0, 1.4, 0]}
          fontSize={0.75}
          color="#F2F0EB"
          anchorX="center"
          letterSpacing={0.18}
        >
          ZEEHAD HAQUE
        </Text>
        <Text
          position={[0, 0.45, 0]}
          fontSize={0.24}
          color="#7DBBFF"
          anchorX="center"
          letterSpacing={0.25}
        >
          WRITER · DIRECTOR · CINEMATOGRAPHER · EDITOR
        </Text>
        <Text
          position={[0, -0.25, 0]}
          fontSize={0.15}
          color="#8A96A3"
          anchorX="center"
          letterSpacing={0.2}
        >
          INDEPENDENT FILMMAKER // GAZIPUR, DHAKA, BANGLADESH
        </Text>
      </group>
    </group>
  );
};
