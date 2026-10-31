import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Film, Aperture, Sliders, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { soundEngine } from '../utils/audio';

interface InteractiveFilmStripProps {
  currentLang: Language;
}

const STILL_FRAMES = [
  { id: 1, film: 'SHADOW / III', time: '00:02:14', frame: 'FRAME 0214', desc: 'The 1st loop: Enclosed chamber' },
  { id: 2, film: 'REFLECT (PART 1)', time: '00:00:54', frame: 'FRAME 0054', desc: 'Mirror hesitation in blue light' },
  { id: 3, film: 'CHAKRA', time: '00:03:41', frame: 'FRAME 0341', desc: 'Jungle stillness canopy' },
  { id: 4, film: 'ILLUSION', time: '00:05:12', frame: 'FRAME 0512', desc: 'Riverside awakening reveal' },
  { id: 5, film: 'SHADOW / III', time: '00:06:48', frame: 'FRAME 0648', desc: 'The 3rd loop: Sensory paranoia' },
  { id: 6, film: 'REFLECT (PART 2)', time: '00:01:42', frame: 'FRAME 0142', desc: 'Slow camera retreat into shadow' },
  { id: 7, film: 'CHAKRA', time: '00:04:19', frame: 'FRAME 0419', desc: 'Natural light piercing canopy' },
];

export function InteractiveFilmStrip({ currentLang }: InteractiveFilmStripProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFrame, setActiveFrame] = useState(STILL_FRAMES[0]);
  const t = translations[currentLang];

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
    soundEngine.playClick();
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
    soundEngine.playClick();
  };

  return (
    <section id="filmstrip" className="relative py-28 px-4 sm:px-6 lg:px-12 z-10 border-t border-neutral-900 bg-gradient-to-b from-[#030712] via-[#050813] to-[#030712] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header with Anamorphic Aspect Ratio Tag and Scroll Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-neutral-800"
        >
          <div>
            <div className="flex items-center gap-2 font-mono-film text-xs text-cyan-400 tracking-[0.3em] uppercase mb-1">
              <Film className="w-3.5 h-3.5" />
              <span>{t.strip.chapter}</span>
            </div>
            <h2 className="font-cinematic text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-[0.15em]">
              {t.strip.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono-film text-[10px] text-neutral-400 tracking-widest hidden sm:inline">
              2.35:1 ANAMORPHIC SEQUENCE
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={scrollLeft}
                className="p-2 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-cyan-400 transition-colors"
                aria-label="Scroll Strip Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={scrollRight}
                className="p-2 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-cyan-400 transition-colors"
                aria-label="Scroll Strip Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Film Strip Reel Wrapper with Smooth Reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Sprocket Holes Film Strip Visual Motifs (Top) */}
          <div className="flex justify-between items-center gap-2 py-2 px-1 border-y border-neutral-800 bg-black select-none pointer-events-none mb-4">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className="w-3 h-2 rounded-[2px] bg-neutral-900 border border-neutral-800/80" />
            ))}
          </div>

          {/* Horizontally Draggable / Scrollable Film Frames */}
          <div
            ref={containerRef}
            data-cursor="DRAG"
            className="flex items-center gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {STILL_FRAMES.map((f, fIdx) => {
              const isSelected = activeFrame.id === f.id;
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: fIdx * 0.07 }}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveFrame(f);
                  }}
                  className={`flex-shrink-0 w-72 sm:w-96 rounded-xl border transition-all duration-300 snap-center p-3 relative bg-[#070b16] ${
                    isSelected
                      ? 'border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.25)]'
                      : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {/* 2.35:1 Frame */}
                  <div className="relative aspect-anamorphic rounded-lg overflow-hidden bg-[#0a0f1c] border border-neutral-900 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/40 via-transparent to-transparent" />

                    {/* Atmospheric Scene Motif */}
                    <div className="text-center px-4">
                      <span className="font-mono-film text-[10px] text-cyan-400 tracking-[0.25em] uppercase">
                        {f.time}
                      </span>
                      <div className="font-cinematic text-sm sm:text-base font-bold text-white tracking-wider uppercase mt-1">
                        {f.film}
                      </div>
                    </div>

                    {/* Corner Reticles */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan-400/40" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyan-400/40" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-cyan-400/40" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyan-400/40" />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono-film text-neutral-400">
                    <span className="text-white font-medium">{f.frame}</span>
                    <span className="text-cyan-400/80">{f.desc}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Sprocket Holes Film Strip Visual Motifs (Bottom) */}
          <div className="flex justify-between items-center gap-2 py-2 px-1 border-y border-neutral-800 bg-black select-none pointer-events-none mt-4">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className="w-3 h-2 rounded-[2px] bg-neutral-900 border border-neutral-800/80" />
            ))}
          </div>
        </motion.div>

        <div className="mt-4 text-center font-mono-film text-[10px] text-neutral-400 tracking-[0.2em] uppercase">
          {t.strip.hint}
        </div>
      </div>
    </section>
  );
}
