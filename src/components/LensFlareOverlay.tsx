import { useEffect, useRef, useState } from 'react';
import { SectionAccent } from '../utils/cinematicTheme';

interface LensFlareOverlayProps {
  activeAccent?: SectionAccent;
  directorsCut?: boolean;
}

export function LensFlareOverlay({ activeAccent, directorsCut = false }: LensFlareOverlayProps) {
  const [intensity, setIntensity] = useState(1);

  const streakHRef = useRef<HTMLDivElement>(null);
  const streakCenterRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const spikesRef = useRef<HTMLDivElement>(null);
  const ghost1Ref = useRef<HTMLDivElement>(null);
  const ghost2Ref = useRef<HTMLDivElement>(null);
  const ghost3Ref = useRef<HTMLDivElement>(null);
  const ghost4Ref = useRef<HTMLDivElement>(null);
  const ghost5Ref = useRef<HTMLDivElement>(null);

  const targetPosRef = useRef({ x: -1000, y: -1000 });
  const currentPosRef = useRef({ x: -1000, y: -1000 });
  const viewportRef = useRef({ w: 1920, h: 1080 });
  const lastActiveRef = useRef<number>(Date.now());
  const animRef = useRef<number | null>(null);

  // Track viewport size
  useEffect(() => {
    const handleResize = () => {
      viewportRef.current = { w: window.innerWidth, h: window.innerHeight };
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track cursor movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPosRef.current.x = e.clientX;
      targetPosRef.current.y = e.clientY;
      lastActiveRef.current = Date.now();
    };

    const handleMouseLeave = () => {
      targetPosRef.current.x = -1000;
      targetPosRef.current.y = -1000;
    };

    const handleMouseDown = () => {
      setIntensity(1.5);
      setTimeout(() => setIntensity(1), 260);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // 120fps hardware-accelerated direct DOM animation loop without React state re-renders
  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const idleTime = now - lastActiveRef.current;
      const vp = viewportRef.current;

      let destX = targetPosRef.current.x;
      let destY = targetPosRef.current.y;

      // Autonomous cinematic anamorphic sweeping drift when idle or offscreen
      if (idleTime > 3500 || destX < 0) {
        const t = now * 0.0006;
        destX = vp.w * 0.5 + Math.sin(t) * (vp.w * 0.35);
        destY = vp.h * 0.35 + Math.cos(t * 0.8) * (vp.h * 0.2);
      }

      // Smooth fluid lerp
      const ease = 0.12;
      currentPosRef.current.x += (destX - currentPosRef.current.x) * ease;
      currentPosRef.current.y += (destY - currentPosRef.current.y) * ease;

      const px = currentPosRef.current.x;
      const py = currentPosRef.current.y;
      const cx = vp.w / 2;
      const cy = vp.h / 2;
      const dx = px - cx;
      const dy = py - cy;

      // Update elements directly on GPU layers
      if (streakHRef.current) {
        streakHRef.current.style.transform = `translate3d(0, ${py}px, 0)`;
      }
      if (streakCenterRef.current) {
        streakCenterRef.current.style.transform = `translate3d(${px - 250}px, ${py - 3}px, 0)`;
      }
      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${px - 35}px, ${py - 35}px, 0)`;
      }
      if (spikesRef.current) {
        spikesRef.current.style.transform = `translate3d(${px - 60}px, ${py - 60}px, 0)`;
      }

      // Ghost reflections along optical axis
      if (ghost1Ref.current) {
        ghost1Ref.current.style.transform = `translate3d(${cx - dx * 0.45 - 30}px, ${cy - dy * 0.45 - 30}px, 0)`;
      }
      if (ghost2Ref.current) {
        ghost2Ref.current.style.transform = `translate3d(${cx - dx * 0.85 - 55}px, ${cy - dy * 0.85 - 55}px, 0)`;
      }
      if (ghost3Ref.current) {
        ghost3Ref.current.style.transform = `translate3d(${cx - dx * 1.35 - 95}px, ${cy - dy * 1.35 - 95}px, 0)`;
      }
      if (ghost4Ref.current) {
        ghost4Ref.current.style.transform = `translate3d(${cx + dx * 0.3 - 20}px, ${cy + dy * 0.3 - 20}px, 0)`;
      }
      if (ghost5Ref.current) {
        ghost5Ref.current.style.transform = `translate3d(${cx - dx * 1.75 - 42}px, ${cy - dy * 1.75 - 42}px, 0)`;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Palette adaptation for Director's Cut (Warm Tungsten/Gold) vs Standard (Anamorphic Cyan/Teal)
  const mainColor = directorsCut ? 'rgba(251, 191, 36, 0.45)' : 'rgba(56, 189, 248, 0.45)';

  const streakColor = directorsCut
    ? 'linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.05) 25%, rgba(245, 158, 11, 0.7) 50%, rgba(251, 191, 36, 0.05) 75%, transparent 100%)'
    : 'linear-gradient(90deg, transparent 0%, rgba(34, 211, 238, 0.05) 25%, rgba(56, 189, 248, 0.75) 50%, rgba(34, 211, 238, 0.05) 75%, transparent 100%)';

  const ghost1Color = directorsCut
    ? 'radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(217, 119, 6, 0.1) 60%, transparent 80%)'
    : 'radial-gradient(circle, rgba(34, 211, 238, 0.25) 0%, rgba(14, 165, 233, 0.08) 60%, transparent 80%)';

  const ghost2Color = directorsCut
    ? 'radial-gradient(circle, transparent 40%, rgba(245, 158, 11, 0.2) 60%, rgba(251, 191, 36, 0.05) 80%, transparent 100%)'
    : 'radial-gradient(circle, transparent 40%, rgba(56, 189, 248, 0.25) 60%, rgba(168, 85, 247, 0.08) 80%, transparent 100%)';

  const ghost3Color = directorsCut
    ? 'radial-gradient(circle, rgba(254, 240, 138, 0.15) 0%, rgba(245, 158, 11, 0.05) 50%, transparent 75%)'
    : 'radial-gradient(circle, rgba(165, 243, 252, 0.15) 0%, rgba(56, 189, 248, 0.04) 50%, transparent 75%)';

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden mix-blend-screen select-none contain-strict"
      aria-hidden="true"
    >
      {/* 1. Primary Anamorphic Horizontal Streak (Blade of Light) */}
      <div
        ref={streakHRef}
        className="fixed top-0 left-0 h-[2px] w-screen pointer-events-none transition-opacity duration-300 will-change-transform"
        style={{
          background: streakColor,
          opacity: 0.65 * intensity,
          filter: 'blur(0.5px)',
        }}
      />
      <div
        ref={streakCenterRef}
        className="fixed top-0 left-0 h-[6px] w-[500px] pointer-events-none will-change-transform"
        style={{
          background: streakColor,
          opacity: 0.8 * intensity,
          filter: 'blur(2px)',
        }}
      />

      {/* 2. Primary Specular Light Core */}
      <div
        ref={coreRef}
        className="fixed top-0 left-0 pointer-events-none rounded-full will-change-transform"
        style={{
          width: `${70 * intensity}px`,
          height: `${70 * intensity}px`,
          background: `radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, ${mainColor} 45%, transparent 70%)`,
          filter: 'blur(3px)',
        }}
      />

      {/* 3. Starburst Diffraction Spikes */}
      <div
        ref={spikesRef}
        className="fixed top-0 left-0 pointer-events-none opacity-60 will-change-transform"
        style={{
          width: '120px',
          height: '120px',
        }}
      >
        <div
          className="absolute inset-0 m-auto w-full h-[1px]"
          style={{ background: streakColor }}
        />
        <div
          className="absolute inset-0 m-auto h-full w-[1px]"
          style={{
            background: directorsCut
              ? 'linear-gradient(180deg, transparent, rgba(251,191,36,0.4), transparent)'
              : 'linear-gradient(180deg, transparent, rgba(56,189,248,0.4), transparent)',
          }}
        />
      </div>

      {/* 4. Ghost Element 1 (Disc Reflection) */}
      <div
        ref={ghost1Ref}
        className="fixed top-0 left-0 pointer-events-none rounded-full will-change-transform"
        style={{
          width: `${60 * intensity}px`,
          height: `${60 * intensity}px`,
          background: ghost1Color,
          filter: 'blur(4px)',
        }}
      />

      {/* 5. Ghost Element 2 (Chromatic Aperture Ring) */}
      <div
        ref={ghost2Ref}
        className="fixed top-0 left-0 pointer-events-none rounded-full border border-cyan-400/20 will-change-transform"
        style={{
          width: `${110 * intensity}px`,
          height: `${110 * intensity}px`,
          background: ghost2Color,
          filter: 'blur(2px)',
        }}
      />

      {/* 6. Ghost Element 3 (Wide Diffuse Halo) */}
      <div
        ref={ghost3Ref}
        className="fixed top-0 left-0 pointer-events-none rounded-full will-change-transform"
        style={{
          width: `${190 * intensity}px`,
          height: `${190 * intensity}px`,
          background: ghost3Color,
          filter: 'blur(8px)',
        }}
      />

      {/* 7. Ghost Element 4 (Pin-Dot Specular Sparkle) */}
      <div
        ref={ghost4Ref}
        className="fixed top-0 left-0 pointer-events-none rounded-full bg-white/70 will-change-transform"
        style={{
          width: `${8 * intensity}px`,
          height: `${8 * intensity}px`,
          filter: 'blur(1px)',
          boxShadow: `0 0 12px ${mainColor}`,
        }}
      />

      {/* 8. Ghost Element 5 (Far Aperture Glint) */}
      <div
        ref={ghost5Ref}
        className="fixed top-0 left-0 pointer-events-none rounded-full will-change-transform"
        style={{
          width: `${85 * intensity}px`,
          height: `${85 * intensity}px`,
          background: ghost1Color,
          filter: 'blur(5px)',
        }}
      />
    </div>
  );
}
