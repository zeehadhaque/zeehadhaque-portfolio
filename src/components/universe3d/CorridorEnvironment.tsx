import React, { useMemo } from 'react';
import * as THREE from 'three';

export const CorridorEnvironment: React.FC = () => {
  // Column positions along the corridor (from entrance to terrace)
  const columnPositions = useMemo(() => {
    const list: Array<{ x: number; z: number }> = [];
    for (let z = 14; z >= -105; z -= 14) {
      list.push({ x: -9, z });
      list.push({ x: 9, z });
    }
    return list;
  }, []);

  // Archway positions
  const archPositions = useMemo(() => {
    const list: number[] = [];
    for (let z = 14; z >= -95; z -= 14) {
      list.push(z);
    }
    return list;
  }, []);

  return (
    <group>
      {/* 36-unit Wide Wet Reflective Stone Floor (Roughness ~0.2, Metalness ~0.8) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -45]}
        receiveShadow
      >
        <planeGeometry args={[36, 150, 32, 64]} />
        <meshStandardMaterial
          color="#04070D"
          roughness={0.22}
          metalness={0.78}
          envMapIntensity={0.6}
        />
      </mesh>

      {/* Subtle floor grid lines / wet tiles */}
      <gridHelper
        args={[36, 18, 0x102b45, 0x060f18]}
        position={[0, 0.02, -45]}
        rotation={[0, 0, 0]}
      />

      {/* Colossal Stone Columns (Left X = -9, Right X = +9) */}
      {columnPositions.map((pos, idx) => (
        <group key={`col-${idx}`} position={[pos.x, 0, pos.z]}>
          {/* Main Column Pillar */}
          <mesh position={[0, 5.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.75, 0.9, 11, 16]} />
            <meshStandardMaterial
              color="#090E17"
              roughness={0.65}
              metalness={0.25}
            />
          </mesh>

          {/* Column Pedestal Base */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[2.2, 1, 2.2]} />
            <meshStandardMaterial
              color="#06090E"
              roughness={0.8}
              metalness={0.3}
            />
          </mesh>

          {/* Column Capital Top */}
          <mesh position={[0, 10.8, 0]}>
            <boxGeometry args={[2.0, 0.8, 2.0]} />
            <meshStandardMaterial
              color="#08101C"
              roughness={0.7}
              metalness={0.25}
            />
          </mesh>

          {/* Subtle hanging cyan rim light accent */}
          {idx % 4 === 0 && (
            <pointLight
              color="#7DBBFF"
              intensity={0.4}
              distance={8}
              decay={2}
              position={[pos.x > 0 ? -0.8 : 0.8, 4.5, 0]}
            />
          )}
        </group>
      ))}

      {/* Gothic Arches spanning the corridor */}
      {archPositions.map((z, idx) => (
        <group key={`arch-${idx}`} position={[0, 10.8, z]}>
          {/* Cross Beam / Arch Architrave */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[18.5, 0.8, 1.2]} />
            <meshStandardMaterial
              color="#070C14"
              roughness={0.75}
              metalness={0.2}
            />
          </mesh>
          {/* Arch Keystone Detail */}
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[2.5, 1.2, 1.4]} />
            <meshStandardMaterial
              color="#0a1422"
              roughness={0.6}
              metalness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Left Outer Shadow Wall */}
      <mesh position={[-18, 7, -45]} receiveShadow>
        <boxGeometry args={[1, 14, 150]} />
        <meshStandardMaterial
          color="#020408"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Right Outer Shadow Wall */}
      <mesh position={[18, 7, -45]} receiveShadow>
        <boxGeometry args={[1, 14, 150]} />
        <meshStandardMaterial
          color="#020408"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Atmospheric Volumetric Light Shaft Beams */}
      <group position={[0, 9, -20]} rotation={[0.4, 0, 0.1]}>
        <mesh>
          <cylinderGeometry args={[0.8, 4.5, 18, 16, 1, true]} />
          <meshBasicMaterial
            color="#7DBBFF"
            transparent
            opacity={0.035}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
      <group position={[0, 9, -60]} rotation={[0.3, 0, -0.1]}>
        <mesh>
          <cylinderGeometry args={[0.8, 4.5, 18, 16, 1, true]} />
          <meshBasicMaterial
            color="#2C6EA6"
            transparent
            opacity={0.025}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
};
