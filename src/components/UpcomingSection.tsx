import { motion } from 'motion/react';
import { Clapperboard, Layers3, Monitor } from 'lucide-react';
import { Language } from '../types';
import { projects } from '../data/projects';

interface UpcomingSectionProps {
  currentLang: Language;
}

export function UpcomingSection({ currentLang }: UpcomingSectionProps) {
  return (
    <section id="upcoming" className="relative py-32 px-6 lg:px-12 z-10 border-t border-white/5 bg-[#020305]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
        <div className="lg:col-span-5 flex flex-col pt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-12">
              <span className="w-12 h-[1px] bg-cyan-400/50" />
              <span className="font-mono-film text-[10px] uppercase tracking-[0.3em] text-[#F2F0EB]/50">
                03 // UPCOMING STORIES
              </span>
            </div>

            <h2 className="font-cinematic text-4xl sm:text-5xl lg:text-6xl font-medium text-white tracking-[0.05em] leading-[1.2]">
              FILMS IN DEVELOPMENT
            </h2>
          </motion.div>
        </div>

        <div className="lg:col-span-7 space-y-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-12 font-cinematic"
          >
              <div className="space-y-4">
                  <div className="flex items-center gap-3">
                      <Layers3 className="w-5 h-5 text-cyan-400" />
                      <h4 className="text-xl text-white font-medium tracking-wide">POST-VIS PATHWAYS</h4>
                  </div>
                  <p className="text-[#F2F0EB]/60 leading-relaxed text-sm">
                      Pioneering a visual development pipeline bridging traditional storyboarding and volumetric pre-visualization.
                  </p>
              </div>
              <div className="space-y-4">
                  <div className="flex items-center gap-3">
                      <Monitor className="w-5 h-5 text-cyan-400" />
                      <h4 className="text-xl text-white font-medium tracking-wide">UNIVERSE MONITOR</h4>
                  </div>
                  <p className="text-[#F2F0EB]/60 leading-relaxed text-sm">
                      Tracking narrative architecture across interconnected screenplays currently traversing the pre-production void.
                  </p>
              </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-16"
          >
              {[1, 2].map((i) => (
                   <div key={i} className="relative p-8 lg:p-12 border border-white/5 bg-[#010203] flex gap-10 items-start">
                      <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-white/20" />
                      <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-white/20" />
                      <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-white/20" />
                      <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-white/20" />

                      <Clapperboard className="w-12 h-12 text-[#F2F0EB]/10 flex-shrink-0 mt-3" />

                      <div className="flex-grow space-y-6">
                           <div className="flex flex-col sm:flex-row sm:items-end justify-between font-mono-film gap-3">
                               <span className="text-[10px] text-[#F2F0EB]/30 uppercase tracking-[0.3em]">
                                 PROJECT ID // {i === 1 ? 'URSA_NIGHTS' : 'ABYSS_FLICKER'}
                               </span>
                               <span className="px-3 py-1 text-[9px] text-amber-300 uppercase tracking-widest border border-amber-400/20 bg-amber-400/5">
                                 IN PRODUCTION
                               </span>
                           </div>

                           <h3 className="font-cinematic text-3xl font-medium text-white tracking-wide">
                              {i === 1 ? projects[0].title[currentLang] : (projects[2] ? projects[2].title[currentLang] : 'UNDEFINED CINEMA')}
                           </h3>

                           <p className="text-[#F2F0EB]/70 font-cinematic max-w-xl leading-relaxed">
                            {i === 1 ? projects[0].synopsis[currentLang] : (projects[2] ? projects[2].synopsis[currentLang] : 'SYNOPSIS CLASSIFIED')}
                           </p>
                      </div>
                  </div>
              ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
