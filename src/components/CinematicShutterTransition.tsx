import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../utils/audio';
import { smoothScrollTo } from '../utils/smoothScroll';

interface FilmTransitionEventDetail {
  targetSelector?: string;
  callback?: () => void;
  label?: string;
}

// Global dispatcher to trigger film shutter transition
export function triggerFilmTransition(targetSelector?: string, callback?: () => void, label?: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<FilmTransitionEventDetail>('cine-film-transition', {
        detail: { targetSelector, callback, label },
      })
    );
  }
}

export function CinematicShutterTransition() {
  const [isActive, setIsActive] = useState(false);
  const [transitionLabel, setTransitionLabel] = useState<string>('GATE 24.000 FPS');
  const [frameNumber, setFrameNumber] = useState<number>(104);

  useEffect(() => {
    const handleTransition = (e: Event) => {
      const customEvent = e as CustomEvent<FilmTransitionEventDetail>;
      const { targetSelector, callback, label } = customEvent.detail || {};

      setTransitionLabel(label || (targetSelector ? `ROLL TO ${targetSelector.replace('#', '').toUpperCase()}` : 'SHUTTER CYCLE 1/48s'));
      setFrameNumber((prev) => (prev % 999) + 1);
      setIsActive(true);

      // Play authentic 35mm film slide / shutter ratchet
      soundEngine.playFilmSlide();

      // Midway: Execute target scroll or callback when shutter is fully closed
      const midTimer = setTimeout(() => {
        if (targetSelector) {
          if (targetSelector === '#top' || targetSelector === 'top') {
            smoothScrollTo(0, { duration: 1.1, offset: 0 });
          } else {
            smoothScrollTo(targetSelector, { offset: -40, duration: 1.1 });
          }
        }
        if (callback) {
          callback();
        }
      }, 240);

      // End: Open shutter back up
      const endTimer = setTimeout(() => {
        setIsActive(false);
      }, 550);

      return () => {
        clearTimeout(midTimer);
        clearTimeout(endTimer);
      };
    };

    window.addEventListener('cine-film-transition', handleTransition);
    return () => window.removeEventListener('cine-film-transition', handleTransition);
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden select-none">
          {/* Top Curtain / Film Gate Blade */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{
              duration: 0.22,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute top-0 inset-x-0 h-1/2 bg-[#02050c] border-b-2 border-cyan-400 shadow-[0_15px_50px_rgba(0,0,0,0.9)] flex flex-col justify-between p-4"
          >
            {/* 35mm Sprocket Holes Header */}
            <div className="flex items-center justify-between opacity-70 overflow-hidden font-mono-film text-[9px] text-neutral-500 tracking-[0.3em]">
              <span>KODAK VISION3 500T // 35MM CINEMA EMULSION</span>
              <span className="text-cyan-400 font-bold">EXPOSURE: 1/48s @ 180°</span>
            </div>

            <div className="flex items-center justify-between gap-1 overflow-hidden py-1 border-y border-neutral-800">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="w-3.5 h-2 rounded-[2px] bg-neutral-900 border border-neutral-700/80 flex-shrink-0"
                />
              ))}
            </div>

            {/* Film Edge Latent Code */}
            <div className="flex items-center justify-between font-mono-film text-[10px] text-neutral-400">
              <span className="tracking-widest">EASTMAN • SAFETY FILM • 2026</span>
              <span className="text-amber-400 font-bold">FR-{String(frameNumber).padStart(4, '0')}</span>
            </div>
          </motion.div>

          {/* Bottom Curtain / Film Gate Blade */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{
              duration: 0.22,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute bottom-0 inset-x-0 h-1/2 bg-[#02050c] border-t-2 border-cyan-400 shadow-[0_-15px_50px_rgba(0,0,0,0.9)] flex flex-col justify-between p-4"
          >
            {/* Latent Edge Numbers */}
            <div className="flex items-center justify-between font-mono-film text-[10px] text-neutral-400">
              <span className="text-cyan-400 tracking-widest">AUTEUR REEL // ZEEHAD HAQUE</span>
              <span className="tracking-widest text-neutral-400">LATENT IMAGE 5219</span>
            </div>

            <div className="flex items-center justify-between gap-1 overflow-hidden py-1 border-y border-neutral-800">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="w-3.5 h-2 rounded-[2px] bg-neutral-900 border border-neutral-700/80 flex-shrink-0"
                />
              ))}
            </div>

            {/* Film Gate Bottom Bar */}
            <div className="flex items-center justify-between opacity-70 overflow-hidden font-mono-film text-[9px] text-neutral-500 tracking-[0.3em]">
              <span>SOUND TRACK: 24-BIT / 96kHz PCM</span>
              <span className="text-amber-400">SPEED: 24.000 FPS LOCKED</span>
            </div>
          </motion.div>

          {/* Central Horizontal Optical Anamorphic Slit Flash */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.2 }}
            animate={{ opacity: [0, 1, 0.8, 0], scaleX: [0.2, 1.2, 1, 0] }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[3px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_35px_#00f0ff] z-20"
          />

          {/* Center Telemetry Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 px-6 py-2 rounded-full bg-black/90 border border-cyan-400/80 shadow-[0_0_40px_rgba(0,240,255,0.4)] backdrop-blur-md flex items-center gap-3 font-mono-film text-xs text-cyan-300"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="tracking-[0.25em] font-bold uppercase">{transitionLabel}</span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
