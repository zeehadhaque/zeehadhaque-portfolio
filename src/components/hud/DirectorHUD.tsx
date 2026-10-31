import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Compass,
  Film,
  Camera,
  Layers,
  Sparkles,
  Sliders,
  Terminal,
  User,
  Wrench,
  Radio,
} from 'lucide-react';
import {
  useUniverseStore,
  UniverseSection,
  SECTION_DEPTH_MAP,
} from '../../store/universeStore';
import { soundEngine } from '../../utils/audio';

export const DirectorHUD: React.FC = () => {
  const depthZ = useUniverseStore((s) => s.depthZ);
  const currentSection = useUniverseStore((s) => s.currentSection);
  const navigateToSection = useUniverseStore((s) => s.navigateToSection);
  const audioEnabled = useUniverseStore((s) => s.audioEnabled);
  const toggleAudio = useUniverseStore((s) => s.toggleAudio);
  const qualityLevel = useUniverseStore((s) => s.qualityLevel);
  const setQualityLevel = useUniverseStore((s) => s.setQualityLevel);
  const directorMode = useUniverseStore((s) => s.directorMode);
  const toggleDirectorMode = useUniverseStore((s) => s.toggleDirectorMode);

  const setZeeOpen = useUniverseStore((s) => s.setZeeOpen);
  const setProfileDossierOpen = useUniverseStore((s) => s.setProfileDossierOpen);
  const setToolboxOpen = useUniverseStore((s) => s.setToolboxOpen);
  const setActiveLab = useUniverseStore((s) => s.setActiveLab);
  const setSelectedFilm = useUniverseStore((s) => s.setSelectedFilm);

  const rank = useUniverseStore((s) => s.getDirectorRank)();
  const totalXP = useUniverseStore((s) => s.getTotalXP)();

  const [fps, setFps] = useState(60);
  const [navMenuOpen, setNavMenuOpen] = useState(false);

  // Keyboard shortcut listener ('D' for Director Mode, 'M' for Audio)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === 'd' || e.key === 'D') {
        toggleDirectorMode();
        soundEngine.playClick();
      } else if (e.key === 'm' || e.key === 'M') {
        const next = toggleAudio();
        if (next) soundEngine.start();
        else soundEngine.stop();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDirectorMode, toggleAudio]);

  // Real FPS Counter
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const calcFps = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(calcFps);
    };
    animId = requestAnimationFrame(calcFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleAudioToggle = () => {
    const next = toggleAudio();
    if (next) {
      soundEngine.start();
      soundEngine.playShutter();
    } else {
      soundEngine.stop();
    }
  };

  const navItems: Array<{ id: UniverseSection; label: string; zCode: string; icon: any }> = [
    { id: 'gate', label: 'ARRIVAL GATE', zCode: 'Z-00', icon: Compass },
    { id: 'profile', label: 'PROFILE MONOLITH', zCode: 'Z-15', icon: User },
    { id: 'archive', label: 'FILM ARCHIVE', zCode: 'Z-30', icon: Film },
    { id: 'story', label: 'STORY LAB', zCode: 'Z-50', icon: Layers },
    { id: 'camera', label: 'CAMERA LAB', zCode: 'Z-65', icon: Camera },
    { id: 'light', label: 'LIGHT LAB', zCode: 'Z-75', icon: Sparkles },
    { id: 'color', label: 'COLOR LAB', zCode: 'Z-80', icon: Sliders },
    { id: 'edit', label: 'EDIT SUITE', zCode: 'Z-88', icon: Film },
    { id: 'sound', label: 'SOUND LAB', zCode: 'Z-92', icon: Radio },
    { id: 'toolbox', label: 'DIRECTOR TOOLBOX', zCode: 'Z-94', icon: Wrench },
    { id: 'zee', label: 'ZEE AI ASSISTANT', zCode: 'Z-96', icon: Terminal },
    { id: 'terrace', label: 'NIGHT TERRACE', zCode: 'Z-100', icon: Compass },
  ];

  return (
    <>
      {/* Top HUD Bar */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-8 py-4 pointer-events-none">
        {/* Left: Identity & Position Telemetry */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <button
            onClick={() => {
              navigateToSection('gate');
              soundEngine.playClick();
            }}
            className="flex flex-col text-left group"
          >
            <span className="font-headline font-black text-sm sm:text-base tracking-[0.2em] text-[#F2F0EB] group-hover:text-[#7DBBFF] transition-colors">
              ZEEHAD HAQUE
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] text-[#7DBBFF] tracking-[0.15em] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7DBBFF] animate-pulse" />
              DIRECTORIAL UNIVERSE // BANGLADESH
            </span>
          </button>
        </div>

        {/* Center: Live Depth Coordinates */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#06090E]/80 border border-[#102B45] backdrop-blur-md pointer-events-auto shadow-lg">
          <span className="font-mono text-[10px] text-[#8A96A3] tracking-widest">DEPTH:</span>
          <span className="font-mono text-xs font-bold text-[#A9D4FF] tracking-widest min-w-[70px]">
            Z {depthZ >= 0 ? `+${depthZ.toFixed(1)}` : depthZ.toFixed(1)}
          </span>
          <div className="h-3 w-[1px] bg-[#102B45]" />
          <span className="font-mono text-[10px] text-[#7DBBFF] tracking-wider uppercase font-semibold">
            {currentSection}
          </span>
        </div>

        {/* Right: Controls & Direct Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          {/* XP & Rank Badge */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-[#06090E]/80 border border-[#102B45] text-xs">
            <span className="font-mono text-[9px] text-[#8A96A3] uppercase">RANK:</span>
            <span className="font-mono text-[10px] font-bold text-[#7DBBFF] tracking-wider">
              {rank}
            </span>
            <span className="font-mono text-[9px] text-[#A9D4FF]/70">({totalXP} XP)</span>
          </div>

          {/* Director Mode Telemetry Toggle Button */}
          <button
            onClick={() => {
              toggleDirectorMode();
              soundEngine.playClick();
            }}
            title="Toggle Technical Director Telemetry (Hotkey: D)"
            className={`p-2 rounded border transition-all text-xs font-mono flex items-center gap-1 ${
              directorMode
                ? 'bg-[#2C6EA6]/30 border-[#7DBBFF] text-[#A9D4FF] shadow-[0_0_10px_rgba(125,187,255,0.3)]'
                : 'bg-[#06090E]/80 border-[#102B45] text-[#8A96A3] hover:text-[#F2F0EB]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[10px]">DIR MODE</span>
          </button>

          {/* Audio Engine Button */}
          <button
            onClick={handleAudioToggle}
            title={audioEnabled ? 'Mute 42Hz Cinematic Soundscape (Hotkey: M)' : 'Activate 42Hz Cinematic Soundscape (Hotkey: M)'}
            className={`p-2 rounded border transition-all ${
              audioEnabled
                ? 'bg-[#2C6EA6]/25 border-[#7DBBFF] text-[#A9D4FF] shadow-[0_0_10px_rgba(125,187,255,0.3)]'
                : 'bg-[#06090E]/80 border-[#102B45] text-[#8A96A3] hover:text-[#F2F0EB]'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Navigation Dropdown / Drawer Button */}
          <button
            onClick={() => {
              setNavMenuOpen(!navMenuOpen);
              soundEngine.playClick();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#081522] border border-[#2C6EA6] hover:bg-[#102B45] text-[#F2F0EB] text-xs font-mono tracking-wider transition-all shadow-md"
          >
            <Compass className="w-3.5 h-3.5 text-[#7DBBFF]" />
            <span>WAYPOINTS</span>
          </button>
        </div>
      </header>

      {/* Waypoints Quick Navigation Drawer */}
      {navMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#020305]/70 backdrop-blur-md flex justify-end animate-in fade-in duration-200"
          onClick={() => setNavMenuOpen(false)}
        >
          <div
            className="w-full max-w-sm h-full bg-[#06090E] border-l border-[#102B45] p-6 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#102B45] mb-6">
                <div>
                  <h3 className="font-headline font-bold text-lg text-[#F2F0EB] tracking-wider">
                    DIRECTORIAL CORRIDOR
                  </h3>
                  <p className="font-mono text-[10px] text-[#7DBBFF] tracking-widest">
                    Z-00 → Z-100 WAYPOINTS
                  </p>
                </div>
                <button
                  onClick={() => setNavMenuOpen(false)}
                  className="font-mono text-xs text-[#8A96A3] hover:text-[#F2F0EB] px-2 py-1 rounded border border-[#102B45]"
                >
                  ESC ✕
                </button>
              </div>

              {/* Waypoints List */}
              <div className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigateToSection(item.id);
                        setNavMenuOpen(false);
                        soundEngine.playShutter();
                        if (item.id === 'profile') setProfileDossierOpen(true);
                        if (item.id === 'toolbox') setToolboxOpen(true);
                        if (item.id === 'zee') setZeeOpen(true);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded transition-all text-left font-mono ${
                        isActive
                          ? 'bg-[#102B45] border border-[#7DBBFF] text-[#F2F0EB]'
                          : 'hover:bg-[#081522] border border-transparent text-[#8A96A3] hover:text-[#F2F0EB]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#7DBBFF]' : 'text-[#8A96A3]'}`} />
                        <span className="text-xs font-semibold tracking-wide">{item.label}</span>
                      </div>
                      <span className="text-[10px] text-[#7DBBFF]">{item.zCode}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Quality Tier Selector */}
            <div className="pt-6 border-t border-[#102B45]">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8A96A3] mb-2">
                <span>GRAPHICS FIDELITY:</span>
                <span className="text-[#7DBBFF] uppercase">{qualityLevel}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['auto', 'high', 'medium', 'low'] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => {
                      setQualityLevel(tier);
                      soundEngine.playClick();
                    }}
                    className={`py-1 text-[10px] font-mono rounded uppercase border transition-all ${
                      qualityLevel === tier
                        ? 'bg-[#2C6EA6] border-[#7DBBFF] text-[#F2F0EB]'
                        : 'bg-[#04070D] border-[#102B45] text-[#8A96A3] hover:text-[#F2F0EB]'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Quick Actions Toolbar */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-[#06090E]/90 border border-[#102B45] backdrop-blur-md shadow-2xl pointer-events-auto">
        <button
          onClick={() => {
            setProfileDossierOpen(true);
            soundEngine.playShutter();
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-[#8A96A3] hover:text-[#F2F0EB] hover:bg-[#081522] transition-colors"
        >
          <User className="w-3.5 h-3.5 text-[#7DBBFF]" />
          <span className="hidden sm:inline">DOSSIER</span>
        </button>

        <button
          onClick={() => {
            navigateToSection('archive');
            soundEngine.playShutter();
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-[#8A96A3] hover:text-[#F2F0EB] hover:bg-[#081522] transition-colors"
        >
          <Film className="w-3.5 h-3.5 text-[#7DBBFF]" />
          <span className="hidden sm:inline">FILMS (6)</span>
        </button>

        <button
          onClick={() => {
            setActiveLab('camera');
            soundEngine.playShutter();
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-[#8A96A3] hover:text-[#F2F0EB] hover:bg-[#081522] transition-colors"
        >
          <Camera className="w-3.5 h-3.5 text-[#7DBBFF]" />
          <span className="hidden sm:inline">CAMERA LAB</span>
        </button>

        <button
          onClick={() => {
            setToolboxOpen(true);
            soundEngine.playShutter();
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-[#8A96A3] hover:text-[#F2F0EB] hover:bg-[#081522] transition-colors"
        >
          <Wrench className="w-3.5 h-3.5 text-[#7DBBFF]" />
          <span className="hidden sm:inline">TOOLBOX</span>
        </button>

        <button
          onClick={() => {
            setZeeOpen(true);
            soundEngine.playShutter();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#102B45] text-[#A9D4FF] border border-[#2C6EA6] hover:bg-[#2C6EA6]/40 transition-colors shadow-[0_0_10px_rgba(125,187,255,0.25)]"
        >
          <Terminal className="w-3.5 h-3.5 text-[#7DBBFF]" />
          <span>ASK ZEE</span>
        </button>
      </footer>

      {/* Hidden Technical Director Mode Telemetry Panel */}
      {directorMode && (
        <aside className="fixed bottom-16 left-4 z-30 p-3.5 rounded-lg bg-[#020305]/90 border border-[#7DBBFF]/40 font-mono text-[10px] text-[#A9D4FF] backdrop-blur-md shadow-2xl pointer-events-auto space-y-1 w-64 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-[#102B45] pb-1.5 mb-1.5 text-[#F2F0EB]">
            <span className="font-bold flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-[#7DBBFF]" /> DIRECTOR TELEMETRY
            </span>
            <span className="text-[#8A96A3]">HOTKEY [D]</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8A96A3]">FPS:</span>
            <span className={fps < 50 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
              {fps}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8A96A3]">DPR:</span>
            <span>{typeof window !== 'undefined' ? window.devicePixelRatio : 1}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8A96A3]">CAMERA Z:</span>
            <span>{depthZ.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8A96A3]">SECTION:</span>
            <span className="uppercase text-[#7DBBFF]">{currentSection}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8A96A3]">FOG DENSITY:</span>
            <span>0.011 (EXP2)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8A96A3]">PARTICLES:</span>
            <span>{qualityLevel === 'low' ? 800 : qualityLevel === 'medium' ? 1600 : 3000}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8A96A3]">QUALITY:</span>
            <span className="uppercase text-[#7DBBFF]">{qualityLevel}</span>
          </div>
        </aside>
      )}
    </>
  );
};
