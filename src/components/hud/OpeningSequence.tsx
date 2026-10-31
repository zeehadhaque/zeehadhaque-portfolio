import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUniverseStore } from '../../store/universeStore';
import { soundEngine } from '../../utils/audio';

export const OpeningSequence: React.FC = () => {
  const isIntroComplete = useUniverseStore((s) => s.isIntroComplete);
  const completeIntro = useUniverseStore((s) => s.completeIntro);
  const toggleAudio = useUniverseStore((s) => s.toggleAudio);
  const [hasStarted, setHasStarted] = useState(false);

  if (isIntroComplete) return null;

  const handleEnter = () => {
    // Start procedural soundscape
    toggleAudio();
    soundEngine.start();
    soundEngine.playShutter();
    completeIntro();
  };

  const handleSkip = () => {
    soundEngine.playClick();
    completeIntro();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 sm:p-12 bg-[#020305] text-[#F2F0EB]"
      >
        {/* Top Minimal Telemetry */}
        <div className="w-full flex items-center justify-between font-mono text-[10px] text-[#7DBBFF] tracking-[0.25em]">
          <span>UNIVERSE // INITIALIZE</span>
          <button
            onClick={handleSkip}
            className="text-[#8A96A3] hover:text-[#F2F0EB] transition-colors border border-[#102B45] px-3 py-1 rounded bg-[#06090E]/60"
          >
            SKIP INTRO [ESC]
          </button>
        </div>

        {/* Center Title Sequence */}
        <div className="flex flex-col items-center text-center max-w-2xl my-auto">
          {/* Subtle Glowing Center Point */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1], opacity: [0, 0.8, 1] }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="w-3 h-3 rounded-full bg-[#7DBBFF] shadow-[0_0_25px_#7DBBFF] mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="font-mono text-xs sm:text-sm text-[#7DBBFF] tracking-[0.3em] uppercase mb-4"
          >
            A 3D DIRECTORIAL UNIVERSE
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 1.2 }}
            className="font-headline font-black text-4xl sm:text-6xl md:text-7xl tracking-[0.15em] text-[#F2F0EB] mb-4"
          >
            ZEEHAD HAQUE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="font-mono text-xs sm:text-sm text-[#8A96A3] tracking-[0.2em] uppercase mb-8"
          >
            WRITER · DIRECTOR · CINEMATOGRAPHER · EDITOR
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 1 }}
            className="font-quote italic text-lg sm:text-xl text-[#A9D4FF]/90 max-w-md mb-10"
          >
            "Stories told through light, silence, and movement."
          </motion.p>

          {/* Enter Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.1, duration: 0.8 }}
            onClick={handleEnter}
            className="group relative px-8 py-3.5 rounded-full font-mono text-xs font-bold tracking-[0.25em] text-[#020305] bg-[#7DBBFF] hover:bg-[#A9D4FF] transition-all shadow-[0_0_30px_rgba(125,187,255,0.4)] flex items-center gap-3"
          >
            <span>ENTER THE UNIVERSE</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </motion.button>
        </div>

        {/* Bottom Minimal Location */}
        <div className="w-full flex items-center justify-between font-mono text-[10px] text-[#8A96A3] tracking-widest">
          <span>INDEPENDENT FILMMAKER</span>
          <span>GAZIPUR, DHAKA // BANGLADESH</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
