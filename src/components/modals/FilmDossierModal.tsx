import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, ExternalLink, Film, Clock, Monitor, Tag, UserCheck } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { soundEngine } from '../../utils/audio';
import { handleYouTubeThumbnailError } from '../../utils/imageFallback';

export const FilmDossierModal: React.FC = () => {
  const selectedFilm = useUniverseStore((s) => s.selectedFilm);
  const setSelectedFilm = useUniverseStore((s) => s.setSelectedFilm);
  const [isPlayingEmbed, setIsPlayingEmbed] = useState(false);

  useEffect(() => {
    setIsPlayingEmbed(false);
    if (selectedFilm) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [selectedFilm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedFilm) {
        setSelectedFilm(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFilm, setSelectedFilm]);

  if (!selectedFilm) return null;

  const handleClose = () => {
    soundEngine.playClick();
    setSelectedFilm(null);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#020305]/85 backdrop-blur-xl animate-in fade-in duration-200"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#06090E] border border-[#102B45] rounded-xl shadow-2xl overflow-y-auto text-[#F2F0EB]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#06090E]/95 border-b border-[#102B45] backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#7DBBFF] tracking-widest px-2 py-0.5 rounded bg-[#102B45]/50 border border-[#2C6EA6]/30">
                {selectedFilm.docketNumber}
              </span>
              <span className="font-mono text-xs text-[#8A96A3] tracking-wider">
                CANONICAL FILM DOSSIER
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg border border-[#102B45] text-[#8A96A3] hover:text-[#F2F0EB] hover:bg-[#102B45] transition-colors font-mono text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Video Viewport: Thumbnail or Embedded Player */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#020305] border border-[#102B45] group">
              {isPlayingEmbed ? (
                <iframe
                  src={`${selectedFilm.embedUrl}?autoplay=1&rel=0`}
                  title={selectedFilm.title}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    src={selectedFilm.thumbnail}
                    alt={selectedFilm.title}
                    onError={(e) => handleYouTubeThumbnailError(e, selectedFilm.id)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020305] via-transparent to-transparent opacity-80" />

                  {/* Play Action Buttons Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        soundEngine.playShutter();
                        setIsPlayingEmbed(true);
                      }}
                      className="px-6 py-3 rounded-full font-mono text-xs font-bold tracking-widest text-[#020305] bg-[#7DBBFF] hover:bg-[#A9D4FF] shadow-[0_0_30px_rgba(125,187,255,0.5)] transition-all flex items-center gap-2.5 scale-100 hover:scale-105"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>PLAY INSIDE ARCHIVE</span>
                    </button>

                    <a
                      href={selectedFilm.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-[#A9D4FF] hover:text-[#F2F0EB] tracking-wider flex items-center gap-1.5 underline decoration-[#2C6EA6] hover:decoration-[#7DBBFF]"
                    >
                      <span>WATCH ON YOUTUBE</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* Title & Metadata Grid */}
            <div>
              <div className="font-mono text-xs text-[#7DBBFF] tracking-widest uppercase mb-1">
                {selectedFilm.docketTitle}
              </div>
              <h2 className="font-headline font-black text-2xl sm:text-3xl text-[#F2F0EB] tracking-wide mb-4">
                {selectedFilm.title}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-[#102B45] font-mono text-xs">
                <div className="flex items-center gap-2 text-[#8A96A3]">
                  <Clock className="w-4 h-4 text-[#7DBBFF]" />
                  <div>
                    <div className="text-[10px] text-[#8A96A3]">DURATION</div>
                    <div className="text-[#F2F0EB] font-bold">{selectedFilm.duration}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#8A96A3]">
                  <Film className="w-4 h-4 text-[#7DBBFF]" />
                  <div>
                    <div className="text-[10px] text-[#8A96A3]">YEAR</div>
                    <div className="text-[#F2F0EB] font-bold">{selectedFilm.year}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#8A96A3]">
                  <Monitor className="w-4 h-4 text-[#7DBBFF]" />
                  <div>
                    <div className="text-[10px] text-[#8A96A3]">ASPECT RATIO</div>
                    <div className="text-[#F2F0EB] font-bold">{selectedFilm.aspectRatio}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#8A96A3]">
                  <Tag className="w-4 h-4 text-[#7DBBFF]" />
                  <div>
                    <div className="text-[10px] text-[#8A96A3]">GENRE</div>
                    <div className="text-[#F2F0EB] font-bold truncate max-w-[120px]" title={selectedFilm.genre}>
                      {selectedFilm.genre}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <h3 className="font-mono text-xs text-[#7DBBFF] tracking-widest uppercase mb-2">
                SYNOPSIS
              </h3>
              <p className="text-sm sm:text-base text-[#F2F0EB]/90 leading-relaxed font-normal">
                {selectedFilm.synopsis}
              </p>
            </div>

            {/* Directorial Credit */}
            <div className="p-4 rounded-lg bg-[#020305]/70 border border-[#102B45] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-[#7DBBFF]" />
                <div>
                  <div className="font-mono text-[10px] text-[#8A96A3] uppercase tracking-wider">
                    DIRECTORIAL CREDITS
                  </div>
                  <div className="font-mono text-xs font-bold text-[#F2F0EB]">
                    {selectedFilm.role}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[10px] text-[#8A96A3] uppercase tracking-wider">
                  AUTHOR
                </div>
                <div className="font-mono text-xs font-bold text-[#7DBBFF]">
                  {selectedFilm.authorName}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
