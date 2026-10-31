import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useUniverseStore } from '../../store/universeStore';

export const DustParticles: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const qualityLevel = useUniverseStore((s) => s.qualityLevel);

  // Determine particle count based on quality tier
  const count = useMemo(() => {
    if (qualityLevel === 'low') return 800;
    if (qualityLevel === 'medium') return 1600;
    return 3000;
  }, [qualityLevel]);

  // Generate initial particle offsets and velocities
  const particles = useMemo(() => {
    const temp: Array<{
      x: number;
      y: number;
      z: number;
      scale: number;
      speedX: number;
      speedY: number;
      speedZ: number;
      rotSpeed: number;
    }> = [];

    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 32, // Width of corridor
        y: Math.random() * 14 + 0.2, // From near floor to ceiling
        z: -Math.random() * 115 + 10, // Along virtual corridor from Z = 10 to -105
        scale: Math.random() * 0.05 + 0.015,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.1,
        speedZ: (Math.random() - 0.5) * 0.2,
        rotSpeed: (Math.random() - 0.5) * 0.5,
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const clampedDelta = Math.min(delta, 0.1);

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      p.x += p.speedX * clampedDelta;
      p.y += p.speedY * clampedDelta;
      p.z += p.speedZ * clampedDelta;

      // Wrap around corridor boundaries
      if (p.x > 16) p.x = -16;
      if (p.x < -16) p.x = 16;
      if (p.y > 14) p.y = 0.5;
      if (p.y < 0.2) p.y = 13.8;
      if (p.z < -110) p.z = 8;
      if (p.z > 10) p.z = -108;

      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.scale);
      dummy.rotation.x += p.rotSpeed * clampedDelta;
      dummy.rotation.y += p.rotSpeed * clampedDelta;
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <dodecahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        color="#A9D4FF"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
};
