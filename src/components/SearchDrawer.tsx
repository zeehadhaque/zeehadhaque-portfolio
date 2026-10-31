import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Film, Sparkles, Clock, ArrowRight, Play, Clapperboard, BookOpen, Compass } from 'lucide-react';
import { Language, FilmProject } from '../types';
import { projects } from '../data/projects';
import { upcomingStories } from '../data/upcoming';
import { creativeInterests } from '../data/creativeInterests';
import { soundEngine } from '../utils/audio';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onSelectProject: (project: FilmProject) => void;
}

type FilterCategory = 'all' | 'films' | 'upcoming' | 'disciplines';

export function SearchDrawer({
  isOpen,
  onClose,
  currentLang,
  onSelectProject,
}: SearchDrawerProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [showKeyboardTip, setShowKeyboardTip] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically when opened and listen for Esc
  useEffect(() => {
    if (isOpen) {
      setShowKeyboardTip(true);
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Compute matched items
  const matchedProjects = useMemo(() => {
    if (!query.trim()) return projects;
    const q = query.toLowerCase().trim();
    return projects.filter((p) => {
      const matchTitle =
        p.title[currentLang]?.toLowerCase().includes(q) ||
        p.title.en?.toLowerCase().includes(q) ||
        p.title.bn?.toLowerCase().includes(q) ||
        p.originalTitle?.toLowerCase().includes(q);
      const matchGenre = p.genre[currentLang]?.toLowerCase().includes(q);
      const matchConcept = p.concept[currentLang]?.toLowerCase().includes(q);
      const matchFormat = p.format[currentLang]?.toLowerCase().includes(q);
      const matchCredits = p.credits?.some((c) => c.name.toLowerCase().includes(q));
      const matchTech =
        p.technical.camera.toLowerCase().includes(q) ||
        p.technical.color.toLowerCase().includes(q);
      return matchTitle || matchGenre || matchConcept || matchFormat || matchCredits || matchTech;
    });
  }, [query, currentLang]);

  const matchedUpcoming = useMemo(() => {
    if (!query.trim()) return upcomingStories;
    const q = query.toLowerCase().trim();
    return upcomingStories.filter((s) => {
      const matchTitle =
        s.title[currentLang]?.toLowerCase().includes(q) ||
        s.title.en?.toLowerCase().includes(q) ||
        s.title.bn?.toLowerCase().includes(q) ||
        s.originalTitle?.toLowerCase().includes(q);
      const matchGenre = s.genre[currentLang]?.toLowerCase().includes(q);
      const matchSynopsis = s.synopsis[currentLang]?.toLowerCase().includes(q);
      const matchChars = s.characters?.some((c) => c.toLowerCase().includes(q));
      return matchTitle || matchGenre || matchSynopsis || matchChars;
    });
  }, [query, currentLang]);

  const matchedDisciplines = useMemo(() => {
    if (!query.trim()) return creativeInterests;
    const q = query.toLowerCase().trim();
    return creativeInterests.filter((item) => {
      const matchTitle = item.label.toLowerCase().includes(q);
      const matchDesc = item.desc.toLowerCase().includes(q);
      return matchTitle || matchDesc;
    });
  }, [query]);

  const handleSelectFilm = (film: FilmProject) => {
    soundEngine.playClick();
    onSelectProject(film);
    onClose();
  };

  const handleSelectUpcoming = () => {
    soundEngine.playClick();
    onClose();
    const el = document.getElementById('stories');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectDiscipline = () => {
    soundEngine.playClick();
    onClose();
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 lg:p-10 bg-black/92 backdrop-blur-2xl overflow-y-auto">
        {/* Backdrop click to dismiss */}
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl my-6 rounded-2xl border border-neutral-800 bg-[#060a14] shadow-[0_30px_100px_rgba(0,0,0,0.95)] overflow-hidden z-10 flex flex-col max-h-[88vh]"
        >
          {/* Top Film Strip Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800/80 bg-[#040710]">
            <div className="flex items-center gap-2.5 font-mono-film text-xs text-cyan-400 tracking-[0.2em] uppercase">
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span>QUICK ARCHIVE SEARCH // ZEEHAD HAQUE</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-film text-cyan-400/80 bg-neutral-900/90 border border-neutral-800 px-2 py-0.5 rounded hidden sm:inline" title="Press Escape key to close">
                ESC TO CLOSE
              </span>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                }}
                className="p-1.5 rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                aria-label="Close Search Drawer"
                title="Press Escape key to close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="p-4 sm:p-5 border-b border-neutral-800 bg-[#080d1a]/90">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-cyan-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                placeholder="Search films, teasers, screenplays, lenses (e.g. Autopsy, Myst, Shadow, Reflect, Lost)..."
                className="w-full pl-12 pr-10 py-3 rounded-xl bg-neutral-900/90 border border-neutral-800 focus:border-cyan-400 focus:outline-none text-white text-sm sm:text-base placeholder-neutral-500 font-sans tracking-wide transition-all shadow-inner"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 p-1 text-neutral-500 hover:text-neutral-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-mono-film">
              {(
                [
                  { id: 'all', label: 'ALL RESULTS' },
                  { id: 'films', label: `FILMS (${matchedProjects.length})` },
                  { id: 'upcoming', label: `UPCOMING (${matchedUpcoming.length})` },
                  { id: 'disciplines', label: `DISCIPLINES (${matchedDisciplines.length})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveCategory(tab.id);
                  }}
                  className={`px-3 py-1 rounded-full border transition-all ${
                    activeCategory === tab.id
                      ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Keyboard Tip Toast */}
            <AnimatePresence>
              {showKeyboardTip && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -6 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -6 }}
                  className="mt-3 px-3 py-2 rounded-lg bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-between text-[11px] font-mono-film text-cyan-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-neutral-950 border border-cyan-400/60 text-cyan-300 font-bold text-[10px] shadow-sm tracking-wider">
                      ESC
                    </span>
                    <span>KEYBOARD TIP: Press the Escape key at any time to instantly close this search archive.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowKeyboardTip(false)}
                    className="text-neutral-400 hover:text-white text-[10px] uppercase font-mono-film tracking-wider px-1.5 py-0.5 rounded hover:bg-neutral-800 transition-colors ml-2 shrink-0"
                  >
                    DISMISS
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Section 1: Released Film Projects */}
            {(activeCategory === 'all' || activeCategory === 'films') && (
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono-film text-neutral-400 tracking-wider">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Clapperboard className="w-3.5 h-3.5" />
                    FILMOGRAPHY CATALOG ({matchedProjects.length})
                  </span>
                  <span className="text-[10px] text-neutral-500">CLICK TO VIEW DOSSIER & WATCH</span>
                </div>

                {matchedProjects.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-neutral-800 text-center text-xs font-mono-film text-neutral-500">
                    No matching released films found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {matchedProjects.map((film) => (
                      <div
                        key={film.id}
                        onClick={() => handleSelectFilm(film)}
                        className="group flex gap-3 p-2.5 rounded-xl border border-neutral-800/90 bg-neutral-900/40 hover:bg-neutral-900 hover:border-cyan-500/50 transition-all cursor-pointer relative overflow-hidden"
                      >
                        {/* Film Thumbnail */}
                        <div className="w-24 h-16 sm:w-28 sm:h-18 rounded-lg overflow-hidden relative flex-shrink-0 bg-neutral-950 border border-neutral-800">
                          <img
                            src={film.thumbnail}
                            alt={film.title[currentLang]}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-cyan-400/90 text-neutral-950 flex items-center justify-center shadow-md">
                              <Play className="w-3 h-3 fill-current ml-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex items-center gap-1.5 text-[10px] font-mono-film text-cyan-400 mb-0.5">
                              <span>FILM {film.filmNumber || '01'}</span>
                              <span>•</span>
                              <span className="text-neutral-400">{film.runtime}</span>
                            </div>
                            <h4 className="font-cinematic text-sm font-bold uppercase text-white truncate group-hover:text-cyan-200 transition-colors">
                              {film.title[currentLang]}
                            </h4>
                          </div>

                          <div className="text-[10px] font-mono-film text-neutral-400 truncate">
                            {film.format[currentLang]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Section 2: Upcoming Screenplay Dossiers */}
            {(activeCategory === 'all' || activeCategory === 'upcoming') && (
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono-film text-neutral-400 tracking-wider">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    UPCOMING SCREENPLAYS & TEASERS ({matchedUpcoming.length})
                  </span>
                  <span className="text-[10px] text-neutral-500">CLICK TO SCROLL TO DOSSIER</span>
                </div>

                {matchedUpcoming.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-neutral-800 text-center text-xs font-mono-film text-neutral-500">
                    No matching screenplay concepts found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {matchedUpcoming.map((story, i) => (
                      <div
                        key={story.id}
                        onClick={handleSelectUpcoming}
                        className={`group p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                          story.teaserVideoUrl
                            ? 'border-amber-500/40 bg-amber-950/20 hover:border-amber-400 hover:bg-amber-950/30'
                            : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono-film mb-1">
                          <span className="text-neutral-400">DOSSIER #{String(i + 1).padStart(2, '0')}</span>
                          {story.teaserVideoUrl ? (
                            <span className="text-amber-400 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                              TEASER
                            </span>
                          ) : (
                            <span className="text-cyan-400">IN DEVELOPMENT</span>
                          )}
                        </div>

                        <h4 className="font-cinematic text-sm font-bold uppercase text-white group-hover:text-amber-200 transition-colors">
                          {story.title[currentLang]}
                        </h4>

                        <p className="text-[11px] font-mono-film text-neutral-400 line-clamp-2 mt-1">
                          {story.synopsis[currentLang]}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Section 3: Creative Disciplines */}
            {(activeCategory === 'all' || activeCategory === 'disciplines') && (
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono-film text-neutral-400 tracking-wider">
                  <span className="flex items-center gap-1.5 text-teal-400">
                    <Compass className="w-3.5 h-3.5" />
                    DISCIPLINES & PHILOSOPHY ({matchedDisciplines.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {matchedDisciplines.map((item) => (
                    <div
                      key={item.id}
                      onClick={handleSelectDiscipline}
                      className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/30 hover:border-teal-500/50 hover:bg-neutral-900/70 transition-all cursor-pointer"
                    >
                      <h4 className="font-cinematic text-xs font-bold uppercase text-neutral-200">
                        {item.label}
                      </h4>
                      <p className="text-[11px] font-mono-film text-neutral-400 line-clamp-2 mt-1">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-5 py-3 border-t border-neutral-800 bg-[#040710] flex items-center justify-between font-mono-film text-[10px] text-neutral-400">
            <span>PRESS ESC TO DISMISS SEARCH</span>
            <span className="text-cyan-400">ZEEHAD HAQUE • ARCHIVE V2.6</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
