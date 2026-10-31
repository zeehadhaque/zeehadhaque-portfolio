import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Info, Layers, Film } from 'lucide-react';
import { Language, FilmProject } from '../types';
import { translations } from '../data/translations';
import { soundEngine } from '../utils/audio';
import { VideoPlaybackTracker } from './VideoPlaybackTracker';
import { useEffect } from 'react';

interface ProjectModalProps {
  project: FilmProject | null;
  currentLang: Language;
  onClose: () => void;
  directorsCut?: boolean;
}

export function ProjectModal({ project, currentLang, onClose, directorsCut = false }: ProjectModalProps) {
  const t = translations[currentLang];

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center pt-10 sm:pt-16 pb-4 px-4 p-0 md:p-6 lg:p-12 overflow-y-auto">
        {/* Spatial UI Backdrop with intense blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="fixed inset-0 bg-[#020305]/60 backdrop-blur-[40px] pointer-events-auto"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl mx-auto z-10 pointer-events-auto flex flex-col my-auto border border-white/10 rounded-3xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_40px_100px_rgba(0,0,0,0.8)] bg-[#050810]/70"
        >
          {/* Internal ambient lighting inside the glass modal */}
          <div className="absolute top-0 inset-x-0 h-[200px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 relative z-10 backdrop-blur-md bg-white/5">
            <div className="flex items-center gap-4">
              <Film className="w-5 h-5 text-cyan-400" />
              <span className="font-mono-film text-[10px] text-white tracking-[0.3em] uppercase hidden sm:block">
                PROJECT DOSSIER // {project.originalTitle}
              </span>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="text-[#F2F0EB]/50 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors group"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row h-full">
            {/* Cinematic Player Window */}
            <div className="lg:w-[65%] relative bg-black aspect-video lg:aspect-auto">
              {project.videoEmbedUrl ? (
                <iframe
                  src={project.videoEmbedUrl}
                  title="Project Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#010101]">
                   {project.thumbnail && (
                     <img
                        src={project.thumbnail}
                        alt="Poster"
                        className="absolute inset-0 w-full h-full object-cover opacity-30 filter grayscale"
                     />
                   )}
                   <Info className="w-8 h-8 text-[#F2F0EB]/30 mb-4 z-10" />
                   <p className="font-mono-film text-xs text-[#F2F0EB]/50 tracking-widest z-10">VIDEO UNAVAILABLE</p>
                </div>
              )}
            </div>

            {/* Editorial Glass Dossier Sidebar */}
            <div className="lg:w-[35%] flex flex-col bg-transparent relative z-10 p-8 lg:p-10 lg:border-l border-white/5 overflow-y-auto max-h-[50vh] lg:max-h-[80vh] custom-scrollbar">
              <div className="mb-4">
                <span className="font-mono-film text-[9px] px-2 py-1 bg-white/10 text-white rounded border border-white/10 uppercase tracking-widest inline-block mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                  {project.genre[currentLang]}
                </span>
                <h2 className="font-cinematic text-3xl sm:text-4xl text-white font-medium uppercase tracking-wider mb-2">
                  {project.title[currentLang] || project.originalTitle}
                </h2>
                <div className="font-mono-film text-xs text-cyan-400 tracking-[0.2em] flex items-center gap-2">
                   DIRECTOR · CINEMATOGRAPHER
                </div>
              </div>

              <div className="space-y-6 mt-8 border-t border-white/10 pt-8">
                  <div className="space-y-2">
                      <span className="font-mono-film text-[9px] text-[#F2F0EB]/40 tracking-widest uppercase">SYNOPSIS</span>
                      <p className="font-cinematic text-[#F2F0EB]/80 leading-relaxed text-sm">
                         {project.synopsis[currentLang]}
                      </p>
                  </div>
              </div>

              {project.technical && (
                <div className="mt-8 space-y-4">
                  <div className="font-mono-film text-[9px] text-[#F2F0EB]/40 tracking-widest uppercase flex items-center gap-2">
                    <Layers className="w-3 h-3" />
                    <span>TECHNICAL SPECS</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 font-mono-film text-[10px]">
                     {project.technical.camera && (
                       <div>
                         <span className="block text-[#F2F0EB]/30 uppercase">CAMERA</span>
                         <span className="text-white tracking-wider">{project.technical.camera}</span>
                       </div>
                     )}
                     {project.technical.aspectRatio && (
                       <div>
                         <span className="block text-[#F2F0EB]/30 uppercase">ASPECT RATIO</span>
                         <span className="text-white tracking-wider">{project.technical.aspectRatio}</span>
                       </div>
                     )}
                     {project.technical.color && (
                       <div>
                         <span className="block text-[#F2F0EB]/30 uppercase">COLOR</span>
                         <span className="text-white tracking-wider">{project.technical.color}</span>
                       </div>
                     )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
