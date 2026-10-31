import { motion } from 'motion/react';
import { Zap, Mic, Palette } from 'lucide-react';
import { Language } from '../types';

interface CreativeInterestsSectionProps {
  currentLang: Language;
}

export function CreativeInterestsSection({ currentLang }: CreativeInterestsSectionProps) {
  return (
    <section id="interests" className="relative py-32 px-6 lg:px-12 z-10 border-t border-white/5 bg-[#020305]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start relative">
        <div className="lg:col-span-12 flex flex-col items-center mb-24 pb-8 border-b border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono-film text-[10px] uppercase tracking-[0.3em] text-[#F2F0EB]/50">
                DISCIPLINES // CREATIVE LABS
              </span>
            </div>
            <h2 className="font-cinematic text-4xl sm:text-5xl lg:text-6xl font-medium text-white tracking-[0.05em] leading-[1.2]">
              VERSE CHRONICLES
            </h2>
            <p className="text-[#F2F0EB]/60 font-cinematic text-lg tracking-wide uppercase mt-3">
                EXPLORATORY DISCIPLINES IN CINEMATIC ARCHITECTURE
            </p>
          </motion.div>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-12"
        >
              {[
                { label: 'CINE ARCADE', desc: 'Interactive filmmaking simulations and practical puzzles.', icon: Zap },
                { label: 'SOUND SCAPE', desc: 'Audio environments and localized Foley experiences.', icon: Mic },
                { label: 'COLOR LAB', desc: 'Grade matching and aesthetic analysis workflow.', icon: Palette }
              ].map((interest, i) => (
                <div key={interest.label} className="relative p-10 border border-white/5 bg-[#010203] group hover:border-cyan-500/30 transition-colors">
                      <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-white/20 group-hover:border-cyan-400 group-hover:border-l-0 transition-colors" />
                      <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-white/20 group-hover:border-cyan-400 group-hover:border-r-0 transition-colors" />
                      <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-white/20 group-hover:border-cyan-400 group-hover:border-l-0 transition-colors" />
                      <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-white/20 group-hover:border-cyan-400 group-hover:border-r-0 transition-colors" />

                      <div className="flex items-center gap-5 font-mono-film uppercase tracking-[0.2em] text-[#F2F0EB]/30 mb-8 pb-5 border-b border-white/5">
                        <interest.icon className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" />
                        <span className="text-[10px] text-cyan-400">{i === 1 ? 'SOUNDscape' : 'visual lab'}</span>
                      </div>

                      <h3 className="font-cinematic text-2xl font-semibold text-white tracking-wide mb-6 group-hover:text-cyan-300 transition-colors">
                        {interest.label}
                      </h3>

                      <p className="text-sm text-[#F2F0EB]/50 font-cinematic leading-relaxed">
                        {interest.desc}
                      </p>
                  </div>
              ))}
          </motion.div>
      </div>
    </section>
  );
}
