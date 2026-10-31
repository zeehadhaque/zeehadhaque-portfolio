import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { soundEngine } from '../utils/audio';

interface HeroSectionProps {
  currentLang: Language;
  onExploreWork: () => void;
}

export function HeroSection({ currentLang, onExploreWork }: HeroSectionProps) {
  const t = translations[currentLang];

  return (
    <section id="hero" className="relative h-screen flex flex-col justify-end pt-32 pb-12 px-6 lg:px-12 overflow-hidden z-10">

      {/* Background Volumetric Shaft of Light */}
      <div className="absolute top-0 left-[20%] w-[1px] h-full bg-gradient-to-b from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 hidden lg:block" />

      {/* Main Cinematic Monumental Typography */}
      <div className="relative mb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col relative z-20"
          >
            {/* Soft backdrop glow to ensure Liquid Glass spatial depth behind the monumental typography */}
            <div className="absolute inset-0 bg-gradient-radial from-cyan-400/5 to-transparent blur-3xl pointer-events-none -z-10" />

            <h1 className="font-cinematic text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] font-medium uppercase text-white tracking-[0.05em] leading-[0.85] select-none mix-blend-plus-lighter drop-shadow-2xl">
              ZEEHAD
              <br />
              HAQUE
            </h1>
          </motion.div>
        </div>

        {/* Editorial Statement and Routes - Spatial UI Glass Tablet */}
        <div className="lg:col-span-4 lg:pb-6 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="relative flex flex-col space-y-8 bg-[#050810]/40 backdrop-blur-[60px] border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_40px_80px_rgba(0,0,0,0.6)]"
          >
             {/* Internal Glass Highlight */}
            <div className="absolute top-0 inset-x-0 h-[100px] bg-gradient-to-b from-white/10 to-transparent rounded-t-[2.5rem] pointer-events-none" />

            <div className="relative z-10 font-mono-film text-[10px] tracking-[0.25em] text-[#F2F0EB]/60 uppercase bg-black/20 p-4 rounded-2xl border border-white/5 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]">
              <span className="text-white font-bold tracking-widest text-[#F2F0EB]">INDEPENDENT FILMMAKER</span>
              <br />
              <span className="mt-2 block">WRITER · DIRECTOR · CINEMATOGRAPHER</span>
            </div>

            <p className="relative z-10 text-[#F2F0EB]/80 font-cinematic text-xl leading-relaxed max-w-sm font-light">
              "{t.hero.tagline}"
            </p>

            <div className="relative z-10 flex flex-col gap-4 font-mono-film text-[10px] tracking-[0.2em] uppercase pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onExploreWork();
                }}
                className="group flex flex-col items-start gap-1 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-white group-hover:text-cyan-400 font-bold tracking-widest transition-colors">{t.work.title}</span>
                  <span className="text-[#F2F0EB]/50 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all">→</span>
                </div>
                <span className="text-[#F2F0EB]/40 text-[9px]">Explore cinematic architecture</span>
              </button>

              <a
                href="#academy"
                onClick={() => soundEngine.playClick()}
                className="group flex flex-col items-start gap-1 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300"
              >
                 <div className="flex items-center justify-between w-full">
                  <span className="text-white group-hover:text-amber-400 font-bold tracking-widest transition-colors">{t.nav.academy}</span>
                  <span className="text-[#F2F0EB]/50 group-hover:text-amber-400 group-hover:translate-x-1 transition-all">→</span>
                </div>
                <span className="text-[#F2F0EB]/40 text-[9px]">Enter the filmmaker's codex</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Editorial Bar & Scroll Prompt */}
      <div className="flex items-center justify-between pt-8 border-t border-white/5 font-mono-film text-[10px] text-[#F2F0EB]/40 z-20 relative">
        <div className="tracking-[0.25em] uppercase bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
          GAZIPUR, DHAKA [BD]
        </div>

        <a
          href="#approach"
          onClick={() => soundEngine.playClick()}
          className="flex items-center gap-2 tracking-[0.25em] uppercase text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md transition-all group shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
        >
          <span>{t.hero.scrollHint}</span>
          <ArrowDown className="w-3 h-3 group-hover:translate-y-1 transition-transform" />
        </a>
      </div>
    </section>
  );
}
