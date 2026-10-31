import { useState } from 'react';
import { motion } from 'motion/react';
import { Film, Play, Clock, Sparkles, Clapperboard, Aperture, ArrowUpRight, ChevronRight, Zap } from 'lucide-react';
import { FilmProject, Language } from '../types';
import { soundEngine } from '../utils/audio';

interface CreativeTimelineViewProps {
  projects: FilmProject[];
  currentLang: Language;
  onSelectProject: (project: FilmProject) => void;
  directorsCut: boolean;
}

export function CreativeTimelineView({
  projects,
  currentLang,
  onSelectProject,
  directorsCut,
}: CreativeTimelineViewProps) {
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);

  // Chronological sort: projects starting from 2026 Phase 01 onwards
  const sortedProjects = [...projects].sort((a, b) => {
    const phaseA = a.evolutionMilestone?.phase || a.filmNumber || '01';
    const phaseB = b.evolutionMilestone?.phase || b.filmNumber || '01';
    return phaseA.localeCompare(phaseB);
  });

  return (
    <div className="relative py-8">
      {/* Timeline Meta Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono-film text-xs uppercase tracking-[0.25em] mb-4 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <Aperture className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span>ZEEHAD'S CREATIVE EVOLUTION // 2026 ONWARDS</span>
        </div>
        <h3 className="font-cinematic text-2xl sm:text-4xl font-bold uppercase text-white tracking-[0.12em] max-w-2xl mx-auto">
          {currentLang === 'bn' && '২০২৬ থেকে চলচ্চিত্র ভাষার রূপান্তর ও শৈল্পিক পরিক্রমা'}
          {currentLang === 'en' && 'The Stylistic Evolution & Milestones from 2026 Onward'}
          {currentLang === 'hi' && '२०२६ से ज़ीहाद की सिनेमाई भाषा का क्रमिक विकास'}
          {currentLang === 'ur' && '۲۰۲۶ سے جہاد کے سنیما کا ارتقائی سفر'}
        </h3>
        <p className="mt-3 font-mono-film text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
          {currentLang === 'bn' && 'ক্লিনিক্যাল নোয়ার থেকে বিশুদ্ধ সাইলেন্ট সিনেমা ও মোবাইল-ফার্স্ট আর্ট-হাউস ফ্রেমের রূপরেখা।'}
          {currentLang === 'en' && 'Tracing the trajectory from clinical forensic noir to pure silent cinema and high-art vertical storytelling.'}
          {currentLang === 'hi' && 'फॉरेंसिक क्लिनिकल नोयर से शुद्ध मूक सिनेमा और वर्टिकल कलात्मकता की यात्रा।'}
          {currentLang === 'ur' && 'کلینیکل نوئر سے لے کر خاموش سنیما اور موبائل فلم سازی تک کا سفر۔'}
        </p>
      </div>

      {/* Central Film Sprocket Rail Spine */}
      <div className="relative">
        {/* Glowing Center Line for Desktop / Left Line for Mobile */}
        <div className="absolute top-0 bottom-0 left-6 md:left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-cyan-500/60 via-amber-500/50 to-cyan-500/60 shadow-[0_0_15px_rgba(0,240,255,0.4)]" />

        {/* Filmstrip Sprocket Perforations */}
        <div className="absolute top-0 bottom-0 left-6 md:left-1/2 -translate-x-1/2 -ml-2.5 flex flex-col justify-between pointer-events-none opacity-25">
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} className="w-5 h-2 my-2 rounded-[1px] border border-cyan-400 bg-neutral-950/80" />
          ))}
        </div>

        {/* Chronological Milestone Nodes */}
        <div className="space-y-16 sm:space-y-24">
          {sortedProjects.map((project, index) => {
            const isEven = index % 2 === 0;
            const milestone = project.evolutionMilestone;
            const isHovered = activeMilestoneId === project.id;
            const isAnyHovered = activeMilestoneId !== null;
            const isDefocused = isAnyHovered && !isHovered;
            const hoveredIndex = sortedProjects.findIndex(p => p.id === activeMilestoneId);
            const opticalDistance = isDefocused && hoveredIndex !== -1 ? Math.abs(index - hoveredIndex) : 0;

            const blurPx = isDefocused ? Math.min(5 + opticalDistance * 2.2, 10) : 0;
            const brightnessVal = isDefocused ? Math.max(0.4, 0.55 - opticalDistance * 0.05) : isHovered ? 1.04 : 1;
            const opacityVal = isDefocused ? Math.max(0.3, 0.45 - opticalDistance * 0.05) : 1;
            const scaleVal = isHovered ? 1.015 : isDefocused ? 0.985 : 1;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                animate={{
                  filter: `blur(${blurPx}px) brightness(${brightnessVal})`,
                  opacity: opacityVal,
                  scale: scaleVal,
                }}
                transition={{
                  duration: 0.45,
                  delay: isAnyHovered ? 0 : index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`relative flex flex-col md:flex-row items-start ${
                  isEven ? 'md:flex-row-reverse' : ''
                } gap-8 md:gap-12 pl-14 md:pl-0 transition-all duration-300`}
                onMouseEnter={() => {
                  setActiveMilestoneId(project.id);
                  soundEngine.playHover();
                }}
                onMouseLeave={() => setActiveMilestoneId(null)}
              >
                {/* Center Node Indicator (Aperture / Clapper Badge) */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 -top-1 md:top-6 z-20 flex items-center justify-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isHovered
                        ? 'bg-amber-400 text-black shadow-[0_0_25px_rgba(245,158,11,0.8)] scale-110'
                        : 'bg-neutral-900 border border-cyan-400/80 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    }`}
                  >
                    <Film className="w-4 h-4" />
                  </div>
                  {/* Epoch Quarter Tag Badge */}
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-neutral-950/90 border border-neutral-700 font-mono-film text-[9px] text-cyan-300 tracking-wider">
                    {milestone?.quarter || project.year}
                  </span>
                </div>

                {/* Milestone Evolution Narrative Dossier (Side 1) */}
                <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-10 text-left' : 'md:pr-10 md:text-right'}`}>
                  <div className="inline-flex items-center gap-2 mb-2 font-mono-film text-[11px] text-amber-400 uppercase tracking-widest">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                      {milestone?.phase || `PHASE 0${index + 1}`}
                    </span>
                    <span>• {milestone?.quarter || '2026'}</span>
                  </div>

                  <h4 className="font-cinematic text-xl sm:text-2xl font-bold uppercase text-white tracking-wide mb-2">
                    {milestone?.headline[currentLang] || project.title[currentLang]}
                  </h4>

                  {/* Creative Paradigm Shift */}
                  <p className="font-mono-film text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                    {milestone?.shift[currentLang] || project.concept[currentLang]}
                  </p>

                  {/* Technical Breakthrough Chip */}
                  {milestone?.breakthrough && (
                    <div
                      className={`inline-flex items-start gap-2 p-2.5 rounded-lg bg-[#070d1a]/80 border border-cyan-900/60 font-mono-film text-[11px] text-cyan-200/90 ${
                        isEven ? '' : 'md:flex-row-reverse md:text-right'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">
                          Aesthetic Breakthrough
                        </div>
                        <div>{milestone.breakthrough[currentLang]}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Film Showcase Card with Director's Cut Badge (Side 2) */}
                <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-10' : 'md:pl-10'}`}>
                  <div
                    onClick={() => {
                      soundEngine.playClick();
                      onSelectProject(project);
                    }}
                    className="group relative cursor-pointer rounded-xl overflow-hidden border border-neutral-800 hover:border-cyan-500/70 bg-[#060a14] transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_0_35px_rgba(0,240,255,0.25)]"
                  >
                    {/* Thumbnail with Anamorphic 2.35:1 or Vertical 9:16 Aspect */}
                    <div className="relative aspect-[2.35/1] overflow-hidden bg-black">
                      <img
                        src={project.thumbnail}
                        alt={project.title[currentLang]}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                      {/* Prominent Director's Cut Badge */}
                      {(project.directorsCut || project.hasDirectorCommentary) && (
                        <div className="absolute top-3 right-3 z-10">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-950/95 via-amber-900/90 to-amber-950/95 border border-amber-400 text-amber-200 font-mono-film text-[10px] tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.5)] backdrop-blur-md">
                            <Clapperboard className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            <span className="font-semibold uppercase">Director's Cut</span>
                            <span className="hidden sm:inline text-[9px] text-amber-300">• BTS & Commentary</span>
                          </div>
                        </div>
                      )}

                      {/* Film Number Badge */}
                      <div className="absolute top-3 left-3 z-10 font-mono-film text-[10px] px-2 py-0.5 rounded bg-black/80 border border-neutral-700 text-neutral-300">
                        FILM {project.filmNumber || '01'}
                      </div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/70 flex items-center justify-center text-white backdrop-blur-sm group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>

                      {/* Bottom Info Strip inside card */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between font-mono-film text-[10px] text-neutral-300">
                        <span className="flex items-center gap-1 text-cyan-300">
                          <Clock className="w-3 h-3" />
                          {project.runtime}
                        </span>
                        <span className="text-neutral-400">{project.technical.aspectRatio}</span>
                      </div>
                    </div>

                    {/* Card Footer Details */}
                    <div className="p-4 border-t border-neutral-800/80 flex items-center justify-between">
                      <div>
                        <h5 className="font-cinematic text-sm font-bold text-white uppercase group-hover:text-cyan-300 transition-colors">
                          {project.title[currentLang]}
                        </h5>
                        <p className="font-mono-film text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                          {project.format[currentLang]}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 font-mono-film text-xs group-hover:border-cyan-400 group-hover:text-cyan-300 transition-all shrink-0 ml-3"
                      >
                        <span>Dossier</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
