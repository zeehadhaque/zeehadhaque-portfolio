import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, FilmProject } from './types';
import { projects } from './data/projects';
import { LoadingScreen } from './components/LoadingScreen';
import { CinematicShutterTransition, triggerFilmTransition } from './components/CinematicShutterTransition';
import { ConsoleShortcutsModal } from './components/ConsoleShortcutsModal';
import { CinematicAmbientAudio } from './components/CinematicAmbientAudio';
import { useActiveSectionAccent } from './utils/cinematicTheme';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProfileSection } from './components/ProfileSection';
import { VisualLanguageSection } from './components/VisualLanguageSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ProjectModal } from './components/ProjectModal';
import { FilmMakerArcade } from './components/FilmMakerArcade';
import { FilmmakingMasterCodex } from './components/academy/FilmmakingMasterCodex';
import { UpcomingSection } from './components/UpcomingSection';
import { CreativeInterestsSection } from './components/CreativeInterestsSection';
import { ContactSection } from './components/ContactSection';
import { ZeeAssistant } from './components/ZeeAssistant';
import { SearchDrawer } from './components/SearchDrawer';
import { AudioPlayerControl } from './components/AudioPlayerControl';
import { Footer } from './components/Footer';
import { lazy, Suspense } from 'react';
import { soundEngine } from './utils/audio';
import { initSmoothScroll, pauseScroll, resumeScroll } from './utils/smoothScroll';

const UniverseCanvas = lazy(() => import('./components/universe3d/UniverseCanvas').then(m => ({ default: m.UniverseCanvas })));

import { FilmDossierModal } from './components/modals/FilmDossierModal';
import { ProfileDossierModal } from './components/modals/ProfileDossierModal';
import { ZeeAssistantModal } from './components/modals/ZeeAssistantModal';
import { InteractiveLabModal } from './components/modals/InteractiveLabModal';
import { DirectorToolboxModal } from './components/modals/DirectorToolboxModal';

export function App() {
  const [currentLang, setCurrentLang] = useState<Language>('bn');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<FilmProject | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [consoleFeedback, setConsoleFeedback] = useState<string | null>(null);
  const [audioActive, setAudioActive] = useState(soundEngine.getStatus());
  const [directorsCut, setDirectorsCut] = useState(false);
  const feedbackTimeoutRef = useRef<number | null>(null);

  const { activeSection } = useActiveSectionAccent(directorsCut);

  useEffect(() => {
    const cleanup = initSmoothScroll();
    return cleanup;
  }, []);

  useEffect(() => {
    if (selectedProject || isAssistantOpen || isSearchOpen || isShortcutsOpen) {
      pauseScroll();
    } else {
      resumeScroll();
    }
  }, [selectedProject, isAssistantOpen, isSearchOpen, isShortcutsOpen]);

  useEffect(() => {
    return soundEngine.subscribe((playing) => {
      setAudioActive(playing);
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ur' ? 'rtl' : 'ltr';
  }, [currentLang]);

  const flashConsoleFeedback = (msg: string) => {
    setConsoleFeedback(msg);
    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setConsoleFeedback(null);
    }, 1800);
  };

  const handleToggleAudio = () => {
    soundEngine.playClick();
    soundEngine.toggle();
  };

  const handleToggleDirectorsCut = () => {
    soundEngine.playClick();
    setDirectorsCut((prev) => !prev);
  };

  const handleLanguageChange = (lang: Language) => {
    soundEngine.playClick();
    setCurrentLang(lang);
  };

  const scrollToWork = () => {
    triggerFilmTransition('#work', undefined, 'SELECTED WORK');
  };

  const dispatchConsoleAction = (rawKey: string) => {
    const key = rawKey.toUpperCase();

    if (key === 'S' || key === '/') {
      soundEngine.playClick();
      setIsSearchOpen((prev) => {
        const next = !prev;
        flashConsoleFeedback(next ? '[S] REEL ARCHIVES OPENED' : '[S] ARCHIVES CLOSED');
        return next;
      });
    } else if (key === 'A') {
      handleToggleAudio();
      flashConsoleFeedback(!audioActive ? '[A] AUDIO CONSOLE ENGAGED' : '[A] AUDIO CONSOLE MUTED');
    } else if (key === 'M') {
      soundEngine.playShutter();
      setSelectedProject((prev) => {
        if (prev) {
          flashConsoleFeedback('[M] MOVIE PLAYER CLOSED');
          return null;
        }
        flashConsoleFeedback(`[M] PROJECTION: ${projects[0].originalTitle}`);
        return projects[0];
      });
    } else if (key === 'D') {
      handleToggleDirectorsCut();
      flashConsoleFeedback(!directorsCut ? "[D] DIRECTOR'S CUT ON" : "[D] DIRECTOR'S CUT OFF");
    } else if (key === 'G') {
      triggerFilmTransition('#arcade', undefined, 'CINE-ARCADE');
      flashConsoleFeedback('[G] JUMP TO CINE-GAMES');
    } else if (key === 'E') {
      triggerFilmTransition('#academy', undefined, 'FILMMAKING CODEX');
      flashConsoleFeedback('[E] JUMP TO FILM ACADEMY');
    } else if (key === 'W') {
      triggerFilmTransition('#work', undefined, 'FILMOGRAPHY');
      flashConsoleFeedback('[W] JUMP TO WORK');
    } else if (key === 'P') {
      triggerFilmTransition('#about', undefined, 'CINEMATOGRAPHER');
      flashConsoleFeedback('[P] JUMP TO PROFILE');
    } else if (key === 'Z') {
      soundEngine.playClick();
      setIsAssistantOpen((prev) => {
        const next = !prev;
        flashConsoleFeedback(next ? '[Z] ZEE AI SUMMONED' : '[Z] ZEE AI STANDBY');
        return next;
      });
    } else if (key === 'C') {
      triggerFilmTransition('#contact', undefined, 'INQUIRIES');
      flashConsoleFeedback('[C] COLLABORATION DESK');
    } else if (key === 'T') {
      triggerFilmTransition('#top', undefined, 'REWIND TO FRAME 01');
      flashConsoleFeedback('[T] REWOUND TO FRAME 01');
    } else if (key === '?' || key === 'K') {
      soundEngine.playClick();
      setIsShortcutsOpen((prev) => !prev);
      flashConsoleFeedback('[?] CONSOLE COMMANDS');
    } else if (key === 'ESCAPE' || key === 'ESC') {
      soundEngine.playClick();
      setSelectedProject(null);
      setIsSearchOpen(false);
      setIsAssistantOpen(false);
      setIsShortcutsOpen(false);
      flashConsoleFeedback('[ESC] CONSOLES STANDBY');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatchConsoleAction('ESCAPE');
        return;
      }
      const activeEl = document.activeElement;
      const isTyping =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl?.getAttribute('contenteditable') === 'true';

      if (isTyping) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toUpperCase();
      const consoleKeys = ['S', '/', 'A', 'M', 'D', 'G', 'W', 'P', 'Z', 'C', 'T', '?', 'K'];

      if (consoleKeys.includes(key)) {
        e.preventDefault();
        dispatchConsoleAction(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioActive, directorsCut]);

  return (
    <div id="top" className="relative min-h-screen bg-[#020305] text-[#F2F0EB] selection:bg-[#2C6EA6]/30 selection:text-[#A9D4FF]">

      <Suspense fallback={null}>
        <UniverseCanvas />
      </Suspense>

      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <CinematicShutterTransition />

      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onOpenAssistant={() => {
          soundEngine.playClick();
          setIsAssistantOpen(true);
        }}
        onOpenSearch={() => {
          soundEngine.playClick();
          setIsSearchOpen(true);
        }}
        audioActive={audioActive}
        onToggleAudio={handleToggleAudio}
        directorsCut={directorsCut}
        onToggleDirectorsCut={handleToggleDirectorsCut}
      />

      {/* Spatial UI Console Feedback Glass Pill */}
      <AnimatePresence>
        {consoleFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#050810]/70 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] backdrop-blur-3xl flex items-center gap-2.5 font-mono-film text-xs pointer-events-none transition-colors duration-500 text-cyan-400"
          >
            <span className="w-2 h-2 rounded-full animate-ping bg-cyan-400" />
            <span className="tracking-[0.2em] font-bold">{consoleFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        <HeroSection currentLang={currentLang} onExploreWork={scrollToWork} />
        <ProfileSection currentLang={currentLang} />
        <VisualLanguageSection currentLang={currentLang} />
        <ProjectsSection
          currentLang={currentLang}
          onSelectProject={(project) => setSelectedProject(project)}
          directorsCut={directorsCut}
        />
        <FilmMakerArcade currentLang={currentLang} directorsCut={directorsCut} />
        <FilmmakingMasterCodex currentLang={currentLang} directorsCut={directorsCut} />
        <UpcomingSection currentLang={currentLang} />
        <CreativeInterestsSection currentLang={currentLang} />
        <ContactSection currentLang={currentLang} />
      </main>

      <AudioPlayerControl currentLang={currentLang} />
      <CinematicAmbientAudio currentLang={currentLang} activeSection={activeSection} />
      <Footer currentLang={currentLang} />

      <ProjectModal
        project={selectedProject}
        currentLang={currentLang}
        onClose={() => setSelectedProject(null)}
        directorsCut={directorsCut}
      />

      <ZeeAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        currentLang={currentLang}
      />

      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        currentLang={currentLang}
        onSelectProject={(project) => setSelectedProject(project)}
      />

      <ConsoleShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        onAction={dispatchConsoleAction}
      />

      <FilmDossierModal />
      <ProfileDossierModal />
      <ZeeAssistantModal />
      <InteractiveLabModal />
      <DirectorToolboxModal />
    </div>
  );
}

export default App;
