import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Aperture, Sparkles } from 'lucide-react';
import lightLeaksImg from '../assets/images/film_light_leaks_1789769526188.jpg';
import anamorphicBokehImg from '../assets/images/dark_anamorphic_bokeh_1789769540618.jpg';
import { soundEngine } from '../utils/audio';

type TextureMode = 'dual' | 'lightleaks' | 'bokeh';

export function MotionBackground() {
  const [videoAvailable, setVideoAvailable] = useState(false);
  const [textureMode, setTextureMode] = useState<TextureMode>('dual');
  const videoRef = useRef<HTMLVideoElement>(null);

  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const targetOffset = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if background video zeehad.mp4 is available
    const videoUrl = '/assets/media/zeehad.mp4';
    fetch(videoUrl, { method: 'HEAD' })
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('video')) {
          setVideoAvailable(true);
        } else {
          setVideoAvailable(false);
        }
      })
      .catch(() => setVideoAvailable(false));

    // High performance mouse tracking without React state updates
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetOffset.current.x = nx;
      targetOffset.current.y = ny;
    };

    // 120fps hardware-accelerated parallax transform loop
    const updateParallax = () => {
      const ease = 0.06;
      currentOffset.current.x += (targetOffset.current.x - currentOffset.current.x) * ease;
      currentOffset.current.y += (targetOffset.current.y - currentOffset.current.y) * ease;

      const ox = currentOffset.current.x;
      const oy = currentOffset.current.y;

      if (layer1Ref.current) {
        layer1Ref.current.style.transform = `translate3d(${ox * -22}px, ${oy * -16}px, 0)`;
      }
      if (layer2Ref.current) {
        layer2Ref.current.style.transform = `translate3d(${ox * 28}px, ${oy * 20}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const cycleTexture = () => {
    soundEngine.playClick();
    setTextureMode((prev) => {
      if (prev === 'dual') return 'lightleaks';
      if (prev === 'lightleaks') return 'bokeh';
      return 'dual';
    });
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#02050c]">
      {/* Background Video Layer if zeehad.mp4 is present */}
      {videoAvailable && (
        <video
          ref={videoRef}
          src="/assets/media/zeehad.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale contrast-125 z-[1]"
        />
      )}

      {/* Primary Abstract Cinematic Background Texture 1: Dark Anamorphic Bokeh */}
      <AnimatePresence>
        {(textureMode === 'dual' || textureMode === 'bokeh') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: textureMode === 'dual' ? 0.35 : 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-[-5%] w-[110%] h-[110%] pointer-events-none select-none z-[2]"
          >
            <div ref={layer1Ref} className="w-full h-full will-change-transform">
              <img
                src={anamorphicBokehImg}
                alt="Dark Anamorphic Bokeh Texture"
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover filter contrast-125 brightness-90 mix-blend-screen"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secondary Abstract Cinematic Background Texture 2: 35mm Film Light Leaks */}
      <AnimatePresence>
        {(textureMode === 'dual' || textureMode === 'lightleaks') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: textureMode === 'dual' ? 0.28 : 0.48 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-[-5%] w-[110%] h-[110%] pointer-events-none select-none z-[3]"
          >
            <div ref={layer2Ref} className="w-full h-full will-change-transform">
              <img
                src={lightLeaksImg}
                alt="Film Light Leaks Texture"
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover filter contrast-135 brightness-95 mix-blend-screen"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deep Obsidian Center Vignette to maintain immaculate typography contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#02050c]/80 via-[#02050c]/55 to-[#02050c]/90 z-[5]" />

      {/* Heavy Cinematic Vignette */}
      <div className="absolute inset-0 cinematic-vignette z-[6]" />

      {/* Fine Film Grain Layer */}
      <div className="absolute inset-0 film-grain opacity-55 mix-blend-overlay z-[7]" />

      {/* Subtle Scanlines for monitor / viewfinder texture */}
      <div className="absolute inset-0 cinematic-scanlines opacity-35 z-[8]" />

      {/* Interactive HUD Texture Selector in lower left */}
      <div className="fixed bottom-6 left-6 z-40 hidden lg:block pointer-events-auto">
        <button
          type="button"
          onClick={cycleTexture}
          data-cursor="TEXTURE"
          title="Toggle between Film Light Leaks, Anamorphic Bokeh, or Dual Emulsion"
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-950/80 border border-neutral-800 hover:border-cyan-500/60 shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all text-[10px] font-mono-film text-neutral-400 hover:text-cyan-300"
        >
          <Aperture className="w-3 h-3 text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
          <span className="tracking-wider">TEXTURE:</span>
          <span className="text-cyan-300 font-bold uppercase">
            {textureMode === 'dual' ? 'DUAL EMULSION' : textureMode === 'lightleaks' ? '35MM LIGHT LEAKS' : 'ANAMORPHIC BOKEH'}
          </span>
          <Sparkles className="w-2.5 h-2.5 text-amber-400 opacity-60 group-hover:opacity-100" />
        </button>
      </div>
    </div>
  );
}
