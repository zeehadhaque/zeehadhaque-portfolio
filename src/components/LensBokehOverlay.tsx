import { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { Aperture, Sparkles, Wind, Layers, Disc3 } from 'lucide-react';
import { SectionAccent } from '../utils/cinematicTheme';
import { soundEngine } from '../utils/audio';
import { cinematicAmbientAudio } from '../utils/cinematicAmbientAudio';

export interface LensBokehOverlayProps {
  activeAccent?: SectionAccent;
  directorsCut?: boolean;
  moodTint?: string;
  'mood-tint'?: string;
}

type BokehIntensity = 'subtle' | 'cinematic' | 'minimal';
type DepthPlane = 'foreground' | 'midground' | 'background';

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

interface BokehSpotDef {
  id: string;
  name: string;
  depth: DepthPlane;
  baseX: number; // 0.0 to 1.0 (relative screen width)
  baseY: number; // 0.0 to 1.0 (relative screen height)
  width: number;
  height: number;
  baseBlur: number;
  repelRadius: number; // Interaction radius in pixels
  maxRepel: number; // Maximum repulsion displacement in pixels
  animName: string;
  baseOpacity: number;
  isDirectorOnly?: boolean;
  paletteKey: 'spot1' | 'spot2' | 'spot3' | 'spot4' | 'spot5';
}

/**
 * Parses hex (#00f0ff), rgb(r,g,b), rgba(r,g,b,a) or comma-separated numbers into {r, g, b}
 */
function parseColorToRgb(color?: string): RgbColor {
  if (!color) return { r: 0, g: 240, b: 255 };

  const trimmed = color.trim();
  if (trimmed.startsWith('#')) {
    let hex = trimmed.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    const num = parseInt(hex, 16);
    if (!isNaN(num)) {
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
      };
    }
  }

  const rgbMatch = trimmed.match(/rgba?\(?(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }

  const commaMatch = trimmed.match(/^(\d+)[,\s]+(\d+)[,\s]+(\d+)$/);
  if (commaMatch) {
    return {
      r: parseInt(commaMatch[1], 10),
      g: parseInt(commaMatch[2], 10),
      b: parseInt(commaMatch[3], 10),
    };
  }

  return { r: 0, g: 240, b: 255 };
}

/**
 * Adjusts RGB values to produce optical harmonic tints for individual bokeh spots
 */
function shiftRgb(base: RgbColor, rDelta: number, gDelta: number, bDelta: number): string {
  const r = Math.max(0, Math.min(255, Math.round(base.r + rDelta)));
  const g = Math.max(0, Math.min(255, Math.round(base.g + gDelta)));
  const b = Math.max(0, Math.min(255, Math.round(base.b + bDelta)));
  return `${r}, ${g}, ${b}`;
}

// Full optical bokeh constellation definitions
const ALL_BOKEH_SPOTS: BokehSpotDef[] = [
  // 1. Foreground: Large out-of-focus disc close to front lens element
  {
    id: 'spot-1',
    name: 'Upper-Right Front Element Disc',
    depth: 'foreground',
    baseX: 0.86,
    baseY: 0.06,
    width: 280,
    height: 110,
    baseBlur: 48,
    repelRadius: 360,
    maxRepel: 85, // Front elements move strongly with glass interaction
    animName: 'anamorphic-bokeh-1 22s ease-in-out infinite alternate',
    baseOpacity: 0.28,
    paletteKey: 'spot1',
  },
  // 2. Background: Deep ambient anamorphic wash
  {
    id: 'spot-2',
    name: 'Middle-Left Background Glare',
    depth: 'background',
    baseX: 0.06,
    baseY: 0.38,
    width: 330,
    height: 115,
    baseBlur: 32,
    repelRadius: 260,
    maxRepel: 30, // Deep background experiences subtle glass displacement
    animName: 'anamorphic-bokeh-2 26s ease-in-out infinite alternate',
    baseOpacity: 0.22,
    paletteKey: 'spot2',
  },
  // 3. Midground: Sharp circle of confusion focal oval with luminous specular core
  {
    id: 'spot-3',
    name: 'Center-Right Specular Core',
    depth: 'midground',
    baseX: 0.78,
    baseY: 0.54,
    width: 200,
    height: 75,
    baseBlur: 19,
    repelRadius: 300,
    maxRepel: 55,
    animName: 'anamorphic-bokeh-3 19s ease-in-out infinite alternate',
    baseOpacity: 0.35,
    paletteKey: 'spot3',
  },
  // 4. Midground: Lower-left multi-coated lens reflection
  {
    id: 'spot-4',
    name: 'Lower-Left Lens Coating Highlight',
    depth: 'midground',
    baseX: 0.16,
    baseY: 0.82,
    width: 240,
    height: 90,
    baseBlur: 22,
    repelRadius: 290,
    maxRepel: 50,
    animName: 'anamorphic-bokeh-1 25s ease-in-out infinite alternate',
    baseOpacity: 0.24,
    paletteKey: 'spot4',
  },
  // 5. Foreground: Lower-right large warm wash
  {
    id: 'spot-5',
    name: 'Lower-Right Front Element Wash',
    depth: 'foreground',
    baseX: 0.72,
    baseY: 0.92,
    width: 320,
    height: 110,
    baseBlur: 52,
    repelRadius: 380,
    maxRepel: 90,
    animName: 'anamorphic-bokeh-2 30s ease-in-out infinite alternate',
    baseOpacity: 0.26,
    paletteKey: 'spot5',
  },

  // =========================================================================
  // DIRECTOR'S CUT EXCLUSIVE PARTICLES (High Density Dreamlike Constellation)
  // =========================================================================
  {
    id: 'spot-dc-1',
    name: 'Upper-Center Specular Glint',
    depth: 'midground',
    baseX: 0.48,
    baseY: 0.15,
    width: 160,
    height: 55,
    baseBlur: 16,
    repelRadius: 260,
    maxRepel: 45,
    animName: 'anamorphic-bokeh-3 16s ease-in-out infinite alternate',
    baseOpacity: 0.32,
    isDirectorOnly: true,
    paletteKey: 'spot3',
  },
  {
    id: 'spot-dc-2',
    name: 'Mid-Left Amber Floating Mote',
    depth: 'background',
    baseX: 0.34,
    baseY: 0.62,
    width: 140,
    height: 50,
    baseBlur: 26,
    repelRadius: 240,
    maxRepel: 25,
    animName: 'anamorphic-bokeh-1 20s ease-in-out infinite alternate',
    baseOpacity: 0.28,
    isDirectorOnly: true,
    paletteKey: 'spot1',
  },
  {
    id: 'spot-dc-3',
    name: 'Far-Right Golden Ellipse',
    depth: 'foreground',
    baseX: 0.92,
    baseY: 0.74,
    width: 220,
    height: 80,
    baseBlur: 46,
    repelRadius: 340,
    maxRepel: 75,
    animName: 'anamorphic-bokeh-2 24s ease-in-out infinite alternate',
    baseOpacity: 0.25,
    isDirectorOnly: true,
    paletteKey: 'spot2',
  },
  {
    id: 'spot-dc-4',
    name: 'Top-Left Luminous Crystal',
    depth: 'midground',
    baseX: 0.24,
    baseY: 0.18,
    width: 120,
    height: 42,
    baseBlur: 15,
    repelRadius: 250,
    maxRepel: 40,
    animName: 'anamorphic-bokeh-3 18s ease-in-out infinite alternate',
    baseOpacity: 0.34,
    isDirectorOnly: true,
    paletteKey: 'spot4',
  },
  {
    id: 'spot-dc-5',
    name: 'Bottom-Center Golden Flare Mote',
    depth: 'background',
    baseX: 0.52,
    baseY: 0.85,
    width: 250,
    height: 90,
    baseBlur: 34,
    repelRadius: 280,
    maxRepel: 28,
    animName: 'anamorphic-bokeh-1 28s ease-in-out infinite alternate',
    baseOpacity: 0.22,
    isDirectorOnly: true,
    paletteKey: 'spot5',
  },
];

export function LensBokehOverlay({
  activeAccent,
  directorsCut = false,
  moodTint,
  ...rest
}: LensBokehOverlayProps) {
  // Support both camelCase moodTint and kebab-case 'mood-tint'
  const explicitMoodTint = moodTint || (rest as Record<string, string>)['mood-tint'];

  // Window viewport tracking
  const [winSize, setWinSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });

  // Cursor position in pixels for tactile glass surface repulsion
  const [cursorPx, setCursorPx] = useState({ x: -1000, y: -1000 });
  const [mouseNorm, setMouseNorm] = useState({ x: 0.5, y: 0.5 });
  const [intensity, setIntensity] = useState<BokehIntensity>('subtle');
  const [densityOverride, setDensityOverride] = useState<'auto' | 'high' | 'standard'>('auto');

  // Smooth 800ms transition state for Director's Cut toggling
  const [isDcTransitioning, setIsDcTransitioning] = useState(false);
  const prevDcRef = useRef(directorsCut);

  useEffect(() => {
    if (prevDcRef.current !== directorsCut) {
      prevDcRef.current = directorsCut;
      setIsDcTransitioning(true);
      const timer = setTimeout(() => {
        setIsDcTransitioning(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [directorsCut]);

  // Scroll tracking for lens breathing animation & synchronized audio foley
  const [scrollY, setScrollY] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWinSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track cursor position for interactive glass surface repulsion & anamorphic parallax with RAF throttling
  useEffect(() => {
    let mouseRaf: number | null = null;
    let pendingMouse: { x: number; y: number } | null = null;

    const flushMouse = () => {
      if (pendingMouse) {
        setCursorPx({ x: pendingMouse.x, y: pendingMouse.y });
        setMouseNorm({
          x: pendingMouse.x / window.innerWidth,
          y: pendingMouse.y / window.innerHeight,
        });
        pendingMouse = null;
      }
      mouseRaf = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      pendingMouse = { x: e.clientX, y: e.clientY };
      if (!mouseRaf) {
        mouseRaf = requestAnimationFrame(flushMouse);
      }
    };

    const handleMouseLeave = () => {
      if (mouseRaf) cancelAnimationFrame(mouseRaf);
      mouseRaf = null;
      pendingMouse = null;
      setCursorPx({ x: -1000, y: -1000 });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        pendingMouse = { x: touch.clientX, y: touch.clientY };
        if (!mouseRaf) {
          mouseRaf = requestAnimationFrame(flushMouse);
        }
      }
    };

    const handleTouchEnd = () => {
      if (mouseRaf) cancelAnimationFrame(mouseRaf);
      mouseRaf = null;
      pendingMouse = null;
      setCursorPx({ x: -1000, y: -1000 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (mouseRaf) cancelAnimationFrame(mouseRaf);
    };
  }, []);

  // Track scroll position and calculate velocity for lens breathing effect with RAF synchronization
  useEffect(() => {
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let lastTime = performance.now();
    let scrollTimeout: ReturnType<typeof setTimeout> | undefined;
    let animFrame: number | undefined;
    let currentVelocity = 0;
    let scrollTicking = false;

    const handleScroll = () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
          const now = performance.now();
          const currentScrollY = window.scrollY;
          const dt = Math.max(1, now - lastTime);
          const dy = currentScrollY - lastScrollY;
          const instantVelocity = (dy / dt) * 16.6;

          currentVelocity = instantVelocity;
          setScrollY(currentScrollY);
          setScrollVelocity(instantVelocity);
          setIsScrolling(true);

          lastScrollY = currentScrollY;
          lastTime = now;
          scrollTicking = false;
        });
      }

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 190);
    };

    // Inertial velocity decay for smooth breathing recovery
    const decayLoop = () => {
      if (Math.abs(currentVelocity) > 0.15) {
        currentVelocity *= 0.88;
        setScrollVelocity(currentVelocity);
        animFrame = requestAnimationFrame(decayLoop);
      } else if (currentVelocity !== 0) {
        currentVelocity = 0;
        setScrollVelocity(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, []);

  // Opacity factor based on user intensity toggle
  const opacityMultiplier = intensity === 'cinematic' ? 1.4 : intensity === 'subtle' ? 0.9 : 0.4;

  const cycleIntensity = () => {
    soundEngine.playClick();
    setIntensity((prev) => {
      if (prev === 'subtle') return 'cinematic';
      if (prev === 'cinematic') return 'minimal';
      return 'subtle';
    });
  };

  // Determine active mood tint palette
  const effectiveTint = useMemo(() => {
    if (directorsCut) return '#f59e0b';
    if (explicitMoodTint) return explicitMoodTint;
    return activeAccent?.accent || '#00f0ff';
  }, [directorsCut, explicitMoodTint, activeAccent]);

  const baseRgb = useMemo(() => parseColorToRgb(effectiveTint), [effectiveTint]);
  const primaryRgb = `${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}`;
  const primaryGlow = `rgba(${primaryRgb}, 0.45)`;

  // Generate harmonized color variants for individual bokeh spots based on active section's color palette
  const spotPalette = useMemo(() => {
    if (directorsCut) {
      return {
        spot1: '245, 158, 11', // Vintage Tungsten Amber
        spot2: '251, 191, 36', // Warm Goldenrod
        spot3: '252, 211, 77', // High Noon Highlight
        spot4: '217, 119, 6', // Deep Burnt Orange
        spot5: '180, 83, 9', // Sepia Shadow Falloff
      };
    }

    return {
      // Spot 1: Direct dominant mood tint
      spot1: primaryRgb,
      // Spot 2: Chromatic edge tint (cool/warm optical shift)
      spot2: shiftRgb(baseRgb, baseRgb.b > baseRgb.r ? 30 : -20, 20, baseRgb.b > baseRgb.r ? -20 : 40),
      // Spot 3: High-luminance specular core
      spot3: shiftRgb(baseRgb, 35, 35, 35),
      // Spot 4: Lens multi-coating tint (slight cyan-emerald or amber-copper reflection)
      spot4: shiftRgb(baseRgb, -25, 15, 25),
      // Spot 5: Deep ambient base wash
      spot5: shiftRgb(baseRgb, -35, -25, -20),
    };
  }, [directorsCut, baseRgb, primaryRgb]);

  // =========================================================================
  // DENSITY CONTROL: High density in Director's Cut mode for stylized dreamlike aesthetic
  // =========================================================================
  const isHighDensity =
    densityOverride === 'high' || (densityOverride === 'auto' && directorsCut);

  const toggleDensity = () => {
    soundEngine.playClick();
    setDensityOverride((prev) => {
      if (prev === 'auto') return directorsCut ? 'standard' : 'high';
      if (prev === 'high') return 'standard';
      return 'auto';
    });
  };

  // =========================================================================
  // SCROLL-TRIGGERED LENS BREATHING CALCULATIONS
  // Simulates focal length expansion and circle-of-confusion expansion as camera scrolls
  // =========================================================================
  const scrollBreathPhase1 = Math.sin(scrollY * 0.0035);
  const scrollBreathPhase2 = Math.cos(scrollY * 0.0028);
  const velocityExpansion = Math.min(0.22, (Math.abs(scrollVelocity) / 32) * 0.15);

  // Overall container breathing scale
  const containerBreathScale = 1 + scrollBreathPhase1 * 0.045 + velocityExpansion * 0.85;
  const containerBreathOpacity = Math.min(
    1.4,
    1 + scrollBreathPhase2 * 0.08 + (isScrolling ? 0.12 : 0)
  );

  // Synchronize subtle variable-rate foley sound effect with lens breathing animation
  useEffect(() => {
    if (isScrolling && Math.abs(scrollVelocity) > 0.6) {
      cinematicAmbientAudio.playLensBreath(containerBreathScale, scrollVelocity);
    }
  }, [isScrolling, scrollVelocity, containerBreathScale]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[16] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Dynamic Parallax Container with Global Lens Breathing Transform */}
      <motion.div
        className="relative w-full h-full"
        animate={{
          x: (mouseNorm.x - 0.5) * -28,
          y: (mouseNorm.y - 0.5) * -18,
          scale: containerBreathScale,
        }}
        transition={{
          x: { type: 'spring', damping: 45, stiffness: 60 },
          y: { type: 'spring', damping: 45, stiffness: 60 },
          scale: { type: 'spring', damping: 30, stiffness: 80 },
        }}
      >
        {/* Render Each Interactive Bokeh Spot with Tactile Glass Repulsion & 800ms Director's Cut Fade */}
        {ALL_BOKEH_SPOTS.map((spot) => {
          const isSpotVisible = !spot.isDirectorOnly || isHighDensity;

          // Calculate individual spot screen center in pixels
          const spotScreenX = spot.baseX * winSize.width;
          const spotScreenY = spot.baseY * winSize.height;

          // Compute distance vector from cursor to spot
          const dx = spotScreenX - cursorPx.x;
          const dy = spotScreenY - cursorPx.y;
          const dist = Math.hypot(dx, dy);

          // Interaction Layer: Bokeh spots gently move away from cursor (glass surface deflection)
          let repelX = 0;
          let repelY = 0;
          let glassProximityFactor = 0;

          if (!isScrolling && dist < spot.repelRadius && dist > 0) {
            const proximityRatio = 1 - dist / spot.repelRadius;
            // Smooth non-linear tactile repulsion curve (1.4 power for natural glass feel)
            const force = Math.pow(proximityRatio, 1.4) * spot.maxRepel;
            repelX = (dx / dist) * force;
            repelY = (dy / dist) * force;
            glassProximityFactor = proximityRatio;
          }

          // Depth of Field (DoF) Optical Simulation:
          // Foreground: Closest to lens glass -> Large blur, expanded scale, and slightly DESATURATED
          // Midground: Focal plane sweetspot -> Crisp, rich saturation, punchy contrast & specular core
          // Background: Distant lights -> Soft ambient blur, subtle saturation, gentle presence
          // Note: Keep baseBlur constant so GPU caches blurred texture for 120fps smooth scrolling
          let dofFilter = '';
          let dofScale = 1;
          const tintColor = spotPalette[spot.paletteKey];

          if (spot.depth === 'foreground') {
            dofFilter = `blur(${spot.baseBlur}px) saturate(0.72) contrast(0.92)`;
            dofScale = (1 + scrollBreathPhase1 * 0.08 + velocityExpansion * 1.15) * (1 + glassProximityFactor * 0.1);
          } else if (spot.depth === 'midground') {
            dofFilter = `blur(${spot.baseBlur}px) saturate(1.18) contrast(1.06)`;
            dofScale = (1 + scrollBreathPhase2 * 0.11 + velocityExpansion * 1.35) * (1 + glassProximityFactor * 0.08);
          } else {
            dofFilter = `blur(${spot.baseBlur}px) saturate(0.96) contrast(0.98)`;
            dofScale = (1 - scrollBreathPhase1 * 0.06 + velocityExpansion * 0.85) * (1 + glassProximityFactor * 0.05);
          }

          return (
            <motion.div
              key={spot.id}
              className="absolute pointer-events-none"
              style={{
                left: `${spot.baseX * 100}%`,
                top: `${spot.baseY * 100}%`,
                width: `${spot.width}px`,
                height: `${spot.height}px`,
                marginLeft: `-${spot.width / 2}px`,
                marginTop: `-${spot.height / 2}px`,
              }}
              initial={{
                opacity: isSpotVisible ? 1 : 0,
                scale: isSpotVisible ? 1 : 0.65,
              }}
              animate={{
                x: repelX,
                y: repelY,
                opacity: isSpotVisible ? 1 : 0,
                scale: isSpotVisible ? 1 : 0.65,
              }}
              transition={{
                x: {
                  type: 'spring',
                  damping: spot.depth === 'foreground' ? 22 : spot.depth === 'midground' ? 28 : 34,
                  stiffness: spot.depth === 'foreground' ? 65 : spot.depth === 'midground' ? 80 : 90,
                  mass: spot.depth === 'foreground' ? 1.1 : 0.9,
                },
                y: {
                  type: 'spring',
                  damping: spot.depth === 'foreground' ? 22 : spot.depth === 'midground' ? 28 : 34,
                  stiffness: spot.depth === 'foreground' ? 65 : spot.depth === 'midground' ? 80 : 90,
                  mass: spot.depth === 'foreground' ? 1.1 : 0.9,
                },
                // 800ms natural cubic-bezier ease for seamless density fade in/out
                opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              }}
            >
              <div
                className="w-full h-full rounded-[50%] mix-blend-screen pointer-events-none"
                style={{
                  background:
                    spot.depth === 'midground'
                      ? `radial-gradient(ellipse at center, rgba(${tintColor}, ${
                          spot.baseOpacity * opacityMultiplier * containerBreathOpacity * 1.25
                        }) 0%, rgba(${tintColor}, ${
                          spot.baseOpacity * opacityMultiplier * 0.6
                        }) 45%, transparent 75%)`
                      : `radial-gradient(ellipse at center, rgba(${tintColor}, ${
                          spot.baseOpacity * opacityMultiplier * containerBreathOpacity
                        }) 0%, rgba(${tintColor}, ${
                          spot.baseOpacity * opacityMultiplier * 0.4
                        }) 55%, transparent 80%)`,
                  filter: dofFilter,
                  boxShadow:
                    spot.depth === 'midground'
                      ? `0 0 ${45 + glassProximityFactor * 25}px ${primaryGlow}`
                      : undefined,
                  transform: `scale(${dofScale})`,
                  animation: spot.animName,
                  // 800ms natural transitions for color shifts and DoF adjustments
                  transition:
                    'background 800ms cubic-bezier(0.16, 1, 0.3, 1), filter 800ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 800ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </motion.div>
          );
        })}

        {/* Subtle Horizontal Anamorphic Streak Sweep */}
        <div
          className="absolute top-[28%] -left-full w-[70vw] h-[1.8px] blur-[1.5px] mix-blend-screen pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(${primaryRgb}, ${
              (0.4 + Math.min(0.2, Math.abs(scrollVelocity) * 0.003)) * opacityMultiplier
            }) 50%, rgba(255, 255, 255, ${0.65 * opacityMultiplier}) 75%, transparent 100%)`,
            transform: `scaleX(${1 + velocityExpansion * 1.5})`,
            animation: 'anamorphic-streak-sweep 18s ease-in-out infinite',
            animationDelay: '4s',
            transition: 'background 800ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Additional Director's Cut Warm Horizontal Anamorphic Flare Streak with 800ms fade */}
        <motion.div
          className="absolute top-[68%] -right-full w-[60vw] h-[1.4px] blur-[1.2px] mix-blend-screen pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHighDensity ? 1 : 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(${spotPalette.spot2}, ${
              0.35 * opacityMultiplier
            }) 40%, rgba(254, 240, 138, ${0.5 * opacityMultiplier}) 70%, transparent 100%)`,
            transform: `scaleX(${1 + velocityExpansion * 1.2})`,
            animation: 'anamorphic-streak-sweep 22s ease-in-out infinite alternate',
            animationDelay: '7s',
            transition: 'background 800ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </motion.div>

      {/* Viewfinder Lens Bokeh, Density & Depth-of-Field Telemetry HUD control */}
      <div className="fixed bottom-14 left-6 z-40 hidden xl:block pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-neutral-950/85 border border-neutral-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.7)] backdrop-blur-md">
          {/* Intensity Toggle */}
          <button
            type="button"
            onClick={cycleIntensity}
            data-cursor="BOKEH"
            title="Toggle Anamorphic Lens Bokeh Atmosphere (Subtle / Vivid / Minimal)"
            className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-neutral-900/80 transition-all text-[9px] font-mono-film text-neutral-400 hover:text-white"
          >
            <Aperture className="w-2.5 h-2.5 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
            <span className="tracking-wider">BOKEH:</span>
            <span
              className={`font-bold uppercase transition-colors duration-700 ${
                directorsCut ? 'text-amber-400' : 'text-cyan-300'
              }`}
            >
              {intensity}
            </span>
          </button>

          {/* Density Control Toggle (Smooth 800ms transition in Director's Cut mode) */}
          <button
            type="button"
            onClick={toggleDensity}
            data-cursor="DENSITY"
            title="Toggle Bokeh Particle Density (Smooth 800ms dreamlike transition in Director's Cut)"
            className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-neutral-900/80 transition-all text-[9px] font-mono-film border-l border-neutral-800 text-neutral-400 hover:text-white"
          >
            <Layers
              className={`w-2.5 h-2.5 transition-colors duration-700 ${
                isHighDensity ? 'text-amber-400' : 'text-neutral-500'
              }`}
            />
            <span className="text-[8px] tracking-tight uppercase">
              {isHighDensity ? 'DENSE [DIR]' : 'STANDARD'}
            </span>
            {isDcTransitioning ? (
              <span className="text-[7.5px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 font-bold animate-pulse font-mono-film">
                800MS SHIFT
              </span>
            ) : (
              <span className="text-[7.5px] px-1 rounded bg-neutral-800/80 text-neutral-300">
                {isHighDensity ? '10P' : '5P'}
              </span>
            )}
          </button>

          {/* Depth of Field Telemetry Pill */}
          <div
            className="flex items-center gap-1 px-1.5 py-1 border-l border-neutral-800 text-[8px] font-mono-film text-neutral-400"
            title="Depth of Field Simulation: Foreground spots desaturated & blurred, midground crisp & saturated"
          >
            <Disc3 className="w-2.5 h-2.5 text-cyan-400/80" />
            <span className="text-neutral-500 hidden 2xl:inline">DoF:</span>
            <span className="text-cyan-300 uppercase">3D PLANE</span>
          </div>

          {/* Real-time Lens Breathing Indicator & Foley Sound Synced Status */}
          <div
            className={`flex items-center gap-1 px-2 py-1 border-l border-neutral-800 transition-colors text-[8px] font-mono-film ${
              isScrolling ? 'text-cyan-300' : 'text-neutral-500'
            }`}
            title="Optical Lens Breathing Simulation & Foley Sound (Expands & pitch-shifts dynamically on scroll)"
          >
            <Wind
              className={`w-2.5 h-2.5 transition-transform ${
                isScrolling ? 'animate-pulse text-cyan-400 scale-110' : 'opacity-60'
              }`}
            />
            <span className="uppercase tracking-tighter">
              {isScrolling ? 'BREATHING // FOLEY' : 'CALIBRATED'}
            </span>
          </div>

          <Sparkles className="w-2 h-2 text-amber-400/80 mr-1" />
        </div>
      </div>
    </div>
  );
}
