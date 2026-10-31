import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface VisualLanguageSectionProps {
  currentLang: Language;
}

export function VisualLanguageSection({ currentLang }: VisualLanguageSectionProps) {
  const t = translations[currentLang];

  return (
    <section id="approach" className="relative py-32 px-6 lg:px-12 z-10 border-t border-white/5 bg-[#020305]">

      {/* Structural Asymmetric Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start relative">

        {/* Left Column: Index & Heading */}
        <div className="lg:col-span-5 flex flex-col pt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-12">
              <span className="w-12 h-[1px] bg-cyan-400/50" />
              <span className="font-mono-film text-[10px] uppercase tracking-[0.3em] text-cyan-400 bg-cyan-900/20 px-3 py-1.5 rounded-full border border-cyan-500/20 backdrop-blur-sm">
                01 // {t.approach.chapter}
              </span>
            </div>

            <h2 className="font-cinematic text-4xl sm:text-5xl lg:text-6xl font-medium text-white tracking-[0.05em] leading-[1.2]">
              {t.approach.title}
            </h2>
          </motion.div>
        </div>

        {/* Right Column: Editorial Glass Statement & Film Motif */}
        <div className="lg:col-span-7 relative group">

          {/* Spatial Glass Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:p-14 p-10 rounded-[2.5rem] bg-[#050810]/40 backdrop-blur-3xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_40px_80px_rgba(0,0,0,0.6)] group-hover:border-white/20 transition-colors duration-700"
          >
             {/* Subtle liquid refraction wash */}
            <div className="absolute top-0 inset-x-0 h-[200px] bg-gradient-to-b from-white/5 to-transparent rounded-t-[2.5rem] pointer-events-none opacity-50" />

            <div className="relative z-10 prose prose-invert prose-lg max-w-none">
              <p className="text-xl sm:text-2xl text-[#F2F0EB]/90 font-cinematic leading-[1.8] font-light">
                "{t.approach.quote}"
              </p>
            </div>

            <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono-film text-[10px] tracking-[0.25em] uppercase">
              <span className="bg-white/10 px-3 py-1.5 rounded-full text-white/80 border border-white/5">ZEEHAD HAQUE</span>
              <span className="text-[#F2F0EB]/40">DIRECTOR STATEMENT</span>
            </div>

            {/* Thematic Pillars - Glass Cards */}
            <div className="relative z-10 mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: t.approach.pillars.frame.title, desc: t.approach.pillars.frame.desc },
                { label: t.approach.pillars.light.title, desc: t.approach.pillars.light.desc },
                { label: t.approach.pillars.silence.title, desc: t.approach.pillars.silence.desc }
              ].map((pillar, i) => (
                <div key={i} className="flex flex-col gap-4 bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:bg-white/5 hover:border-cyan-500/30 hover:shadow-[0_10px_30px_rgba(0,240,255,0.1)] transition-all duration-300">
                  <span className="font-mono-film text-[9px] text-cyan-400 capitalize tracking-widest">{pillar.label}</span>
                  <p className="text-xs text-[#F2F0EB]/60 leading-relaxed font-cinematic">{pillar.desc}</p>
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
