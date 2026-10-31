import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, FilmProject } from '../types';
import { translations } from '../data/translations';
import { projects } from '../data/projects';
import { soundEngine } from '../utils/audio';

interface ProjectsSectionProps {
  currentLang: Language;
  onSelectProject: (project: FilmProject) => void;
  directorsCut: boolean;
}

export function ProjectsSection({ currentLang, onSelectProject }: ProjectsSectionProps) {
  const t = translations[currentLang];

  if (projects.length === 0) return null;

  const featuredProject = projects[0];
  const secondaryProjects = projects.slice(1);

  return (
    <section id="work" className="relative py-32 px-6 lg:px-12 z-10 border-t border-white/5 bg-[#020305]">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col mb-16 pb-8 border-b border-white/10"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="w-12 h-[1px] bg-cyan-400/50" />
            <span className="font-mono-film text-[10px] uppercase tracking-[0.3em] text-[#F2F0EB]/50">
              02 // FILM ARCHIVE
            </span>
          </div>
          <h2 className="font-cinematic text-4xl sm:text-5xl font-medium text-white tracking-[0.05em]">
             {t.work.title}
          </h2>
        </motion.div>

        {/* Featured Project (Spatial Glass Treatment) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          className="mb-24 group cursor-pointer"
          onClick={() => {
            soundEngine.playClick();
            onSelectProject(featuredProject);
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 relative aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)] bg-[#050810]/40 backdrop-blur-3xl group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_60px_rgba(0,0,0,0.7)] group-hover:-translate-y-2 transition-all duration-700 ease-out">
              {featuredProject.thumbnail ? (
                <img
                  src={featuredProject.thumbnail}
                  alt={featuredProject.title[currentLang]}
                  className="w-full h-full object-cover filter grayscale contrast-125 brightness-75 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000 ease-out"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#010203] p-12 text-center">
                  <h3 className="font-cinematic text-4xl text-white/80 uppercase tracking-widest">{featuredProject.title[currentLang]}</h3>
                </div>
              )}

              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none" />
              <div className="absolute top-0 inset-x-0 h-[100px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="absolute top-6 left-6 font-mono-film text-[9px] text-white tracking-[0.3em] uppercase bg-white/10 px-4 py-2 border border-white/10 rounded-full backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                FEATURED WORK
              </div>
            </div>

            <div className="lg:col-span-4 lg:pb-4 space-y-6">
              <h3 className="font-cinematic text-3xl sm:text-4xl font-medium text-white tracking-wider uppercase group-hover:text-cyan-400 transition-colors">
                {featuredProject.title[currentLang]}
              </h3>

              <div className="flex items-center gap-4 text-[10px] font-mono-film text-[#F2F0EB]/40 tracking-widest uppercase">
                <span className="px-2 py-1 rounded bg-white/5 border border-white/5">{featuredProject.genre[currentLang]}</span>
                {featuredProject.runtime && <span className="px-2 py-1 rounded bg-white/5 border border-white/5">{featuredProject.runtime}</span>}
              </div>

              <p className="text-sm text-[#F2F0EB]/60 font-cinematic leading-relaxed line-clamp-3">
                {featuredProject.synopsis[currentLang]}
              </p>

              <div className="pt-4 font-mono-film text-[10px] text-cyan-400 tracking-[0.2em] uppercase flex items-center gap-2 group-hover:gap-4 transition-all">
                <span className="border-b border-cyan-400/30 group-hover:border-cyan-400 pb-1">{t.work.readMore}</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Secondary Projects Grid (Spatial Hover) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 gap-y-16">
          {secondaryProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group cursor-pointer flex flex-col gap-6"
              onClick={() => {
                soundEngine.playClick();
                onSelectProject(project);
              }}
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 bg-[#050810]/30 backdrop-blur-lg shadow-lg group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:border-white/20 group-hover:-translate-y-2 transition-all duration-500 ease-[0.16,1,0.3,1]">
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt={project.title[currentLang]}
                    className="w-full h-full object-cover filter grayscale contrast-125 brightness-[0.6] group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-1000 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8 text-center bg-gradient-to-b from-white/5 to-transparent">
                    <h3 className="font-cinematic text-2xl text-white/50 uppercase tracking-widest">{project.title[currentLang]}</h3>
                  </div>
                )}

                {/* Spatial glass reflection */}
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] pointer-events-none transition-opacity group-hover:opacity-50" />
              </div>

              <div className="space-y-3 px-2">
                <h4 className="font-cinematic text-lg sm:text-xl font-medium text-white tracking-widest uppercase group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {project.title[currentLang]}
                </h4>

                <div className="flex items-center justify-between text-[9px] font-mono-film text-[#F2F0EB]/40 tracking-widest uppercase">
                  <span className="bg-white/5 px-2 py-1 rounded-sm border border-white/5">{project.genre[currentLang]}</span>
                  {project.year && <span className="text-amber-400">{project.year}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
