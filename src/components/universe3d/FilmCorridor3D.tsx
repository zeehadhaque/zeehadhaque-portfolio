import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { YOUTUBE_FILMS, YouTubeFilm } from '../../data/youtubeFilms';
import { useUniverseStore } from '../../store/universeStore';
import { soundEngine } from '../../utils/audio';

interface FilmScreenProps {
  film: YouTubeFilm;
  position: [number, number, number];
  rotationY: number;
}

const FilmScreenItem: React.FC<FilmScreenProps> = ({ film, position, rotationY }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const setSelectedFilm = useUniverseStore((s) => s.setSelectedFilm);
  const setCursorLabel = useUniverseStore((s) => s.setCursorLabel);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      film.thumbnail,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      () => {
        // Fallback to hqdefault if maxresdefault is 404
        loader.load(film.thumbnailFallback, (fallbackTex) => {
          fallbackTex.colorSpace = THREE.SRGBColorSpace;
          setTexture(fallbackTex);
        });
      }
    );
  }, [film.thumbnail, film.thumbnailFallback]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetScale = hovered ? 1.05 : 1.0;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 5
    );

    // Subtle breathing float
    if (hovered) {
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        position[1] + 0.15,
        delta * 3
      );
    } else {
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        position[1],
        delta * 3
      );
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    setCursorLabel('WATCH FILM');
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
    setSelectedFilm(film);
  };

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={[0, rotationY, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Floating Beveled Screen Backing */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4.8, 2.8, 0.22]} />
        <meshStandardMaterial
          color="#060A12"
          roughness={0.25}
          metalness={0.85}
        />
      </mesh>

      {/* Cinematic Glowing Cyan / Moonlight Outer Rim */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[4.88, 2.88, 0.2]} />
        <meshBasicMaterial
          color={hovered ? '#7DBBFF' : '#102B45'}
          wireframe
        />
      </mesh>

      {/* Authentic 16:9 YouTube Thumbnail Canvas */}
      <mesh position={[0, 0, 0.12]}>
        <planeGeometry args={[4.6, 2.6]} />
        {texture ? (
          <meshBasicMaterial map={texture} />
        ) : (
          <meshStandardMaterial color="#0A1422" roughness={0.3} metalness={0.6} />
        )}
      </mesh>

      {/* Glass Reflection Plane */}
      <mesh position={[0, 0, 0.13]}>
        <planeGeometry args={[4.6, 2.6]} />
        <meshPhysicalMaterial
          color="#7DBBFF"
          transparent
          opacity={hovered ? 0.12 : 0.04}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Metadata Plaque Below Screen */}
      <group position={[0, -1.8, 0.1]}>
        <Text
          position={[0, 0.2, 0]}
          fontSize={0.13}
          color="#7DBBFF"
          anchorX="center"
          letterSpacing={0.12}
        >
          {`${film.docketNumber} // ${film.year} · ${film.duration} · ${film.aspectRatio}`}
        </Text>
        <Text
          position={[0, -0.05, 0]}
          fontSize={0.18}
          color="#F2F0EB"
          anchorX="center"
          maxWidth={4.4}
          textAlign="center"
        >
          {film.title}
        </Text>
        <Text
          position={[0, -0.28, 0]}
          fontSize={0.11}
          color="#8A96A3"
          anchorX="center"
        >
          {film.role}
        </Text>
      </group>
    </group>
  );
};

export const FilmCorridor3D: React.FC = () => {
  // Screen positions alternating along the corridor
  const screenConfigs = [
    { pos: [-4.5, 3.8, -28] as [number, number, number], rotY: 0.18 },
    { pos: [4.5, 3.8, -31] as [number, number, number], rotY: -0.18 },
    { pos: [-4.5, 3.8, -34] as [number, number, number], rotY: 0.18 },
    { pos: [4.5, 3.8, -37] as [number, number, number], rotY: -0.18 },
    { pos: [-4.5, 3.8, -40] as [number, number, number], rotY: 0.18 },
    { pos: [4.5, 3.8, -43] as [number, number, number], rotY: -0.18 },
  ];

  return (
    <group>
      {/* Film Corridor Entrance Telemetry Banner */}
      <group position={[0, 8.2, -26]}>
        <Text
          position={[0, 0.4, 0]}
          fontSize={0.38}
          color="#F2F0EB"
          anchorX="center"
          letterSpacing={0.15}
        >
          THE FILM ARCHIVE
        </Text>
        <Text
          position={[0, -0.15, 0]}
          fontSize={0.14}
          color="#7DBBFF"
          anchorX="center"
          letterSpacing={0.2}
        >
          AUTEUR SHORT FILMS & CINEMATIC EXPERIMENTS // Z-30
        </Text>
      </group>

      {/* Floating Cinema Screens */}
      {YOUTUBE_FILMS.map((film, idx) => {
        const config = screenConfigs[idx % screenConfigs.length];
        return (
          <FilmScreenItem
            key={film.id}
            film={film}
            position={config.pos}
            rotationY={config.rotY}
          />
        );
      })}
    </group>
  );
};
