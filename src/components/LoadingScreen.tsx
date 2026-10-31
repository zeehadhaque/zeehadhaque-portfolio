import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 600);
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030712] text-neutral-100 select-none overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => {
            setIsVisible(false);
            setTimeout(onComplete, 300);
          }}
        >
          {/* Subtle 2.35:1 Cinematic Letterbox Bars during load */}
          <div className="absolute top-0 inset-x-0 h-10 md:h-16 bg-black/90 border-b border-neutral-900" />
          <div className="absolute bottom-0 inset-x-0 h-10 md:h-16 bg-black/90 border-t border-neutral-900" />

          {/* Background Radial Glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

          {/* Central Monogram & Metadata */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="font-mono-film text-xs tracking-[0.4em] text-cyan-400/80 uppercase">
                SCENE 01 • TAKE 01
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            </motion.div>

            <motion.h1
              initial={{ letterSpacing: '0.6em', opacity: 0, filter: 'blur(8px)' }}
              animate={{ letterSpacing: '0.25em', opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="font-cinematic text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase text-white tracking-[0.25em]"
            >
              ZEEHAD HAQUE
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-4 flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs md:text-sm text-neutral-400 font-mono-film tracking-[0.3em] uppercase"
            >
              <span>FILMMAKER</span>
              <span className="text-cyan-500/60">•</span>
              <span>WRITER</span>
              <span className="text-cyan-500/60">•</span>
              <span>CINEMATOGRAPHER</span>
              <span className="text-cyan-500/60">•</span>
              <span>DIRECTOR</span>
            </motion.div>
          </div>

          {/* Electric Blue Light Line Traveling Across Screen */}
          <div className="absolute inset-x-0 bottom-28 md:bottom-32 flex justify-center px-8">
            <div className="relative w-full max-w-xl h-[1.5px] bg-neutral-800/80 overflow-hidden">
              <motion.div
                className="absolute top-0 bottom-0 w-36 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff]"
                initial={{ left: '-20%' }}
                animate={{ left: '120%' }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>

          <div className="absolute bottom-12 text-[10px] font-mono-film tracking-[0.25em] text-neutral-600 uppercase">
            GAZIPUR • DHAKA • BANGLADESH
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
