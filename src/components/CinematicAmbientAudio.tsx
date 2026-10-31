import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Radio, Disc3, Sparkles } from 'lucide-react';
import {
  cinematicAmbientAudio,
  FoleyTheme,
  FOLEY_DESCRIPTORS,
  SECTION_FOLEY_MAP,
} from '../utils/cinematicAmbientAudio';
import { soundEngine } from '../utils/audio';
import { Language } from '../types';
import { SectionAccent } from '../utils/cinematicTheme';

interface CinematicAmbientAudioProps {
  activeSectionId?: string;
  activeSection?: SectionAccent;
  currentLang?: Language;
  directorsCut?: boolean;
}

export function CinematicAmbientAudio({
  activeSectionId = 'hero',
  activeSection,
  currentLang = 'bn',
  directorsCut = false,
}: CinematicAmbientAudioProps) {
  const effectiveSectionId = activeSection?.id || activeSectionId;
  const isBn = currentLang === 'bn';

  const [currentTheme, setCurrentTheme] = useState<FoleyTheme>(
    cinematicAmbientAudio.getTheme()
  );
  const [isEnabled, setIsEnabled] = useState<boolean>(
    cinematicAmbientAudio.getIsEnabled()
  );
  const [volume, setVolume] = useState<number>(cinematicAmbientAudio.getVolume());
  const [isExpanded, setIsExpanded] = useState(false);

  // Sync with audio engine state
  useEffect(() => {
    const unsubscribe = cinematicAmbientAudio.subscribe((theme, enabled, vol) => {
      setCurrentTheme(theme);
      setIsEnabled(enabled);
      setVolume(vol);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Update theme whenever activeSectionId changes
  useEffect(() => {
    if (effectiveSectionId) {
      cinematicAmbientAudio.setSection(effectiveSectionId);
    }
  }, [effectiveSectionId]);

  const descriptor = FOLEY_DESCRIPTORS[currentTheme] || FOLEY_DESCRIPTORS.clinical;

  const handleToggle = () => {
    soundEngine.playClick();
    cinematicAmbientAudio.toggleEnabled();
  };

  const handleThemeSelect = (theme: FoleyTheme) => {
    soundEngine.playClick();
    cinematicAmbientAudio.setTheme(theme);
  };

  return (
    <div className="fixed bottom-16 sm:bottom-20 right-4 sm:right-6 z-40 select-none">
      <div className="flex flex-col items-end gap-2">
        {/* Expanded Foley Console Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-80 p-4 rounded-xl bg-neutral-950/95 border border-neutral-800/90 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl space-y-3 font-mono-film text-xs text-neutral-300 pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span className="font-bold tracking-widest uppercase text-[11px]">
                    CINEMATIC FOLEY ENGINE
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500">24FPS CONTEXT</span>
              </div>

              {/* Current Active Foley Specs */}
              <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
                    {descriptor.name}
                  </span>
                  <span className="text-[9px] text-amber-400 px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
                    {descriptor.decibels}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-snug font-sans">
                  {descriptor.desc}
                </p>
                <div className="text-[9px] text-neutral-500 pt-1">
                  FREQ: {descriptor.frequency}
                </div>
              </div>

              {/* Theme Quick Select */}
              <div className="space-y-1">
                <div className="text-[9px] text-neutral-500 uppercase tracking-widest">
                  AVAILABLE ATMOSPHERES
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {(Object.keys(FOLEY_DESCRIPTORS) as FoleyTheme[]).map((theme) => {
                    const desc = FOLEY_DESCRIPTORS[theme];
                    const active = currentTheme === theme;
                    return (
                      <button
                        key={theme}
                        onClick={() => handleThemeSelect(theme)}
                        className={`flex items-center justify-between px-2 py-1.5 rounded text-[10px] text-left transition-all ${
                          active
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                            : 'hover:bg-neutral-800/80 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{desc.name}</span>
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Master Volume Slider */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-neutral-500">FOLEY VOLUME</span>
                  <span className="text-cyan-300 font-bold">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => cinematicAmbientAudio.setVolume(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact Floating Foley Trigger Pill */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-neutral-950/90 border border-neutral-800/90 shadow-[0_8px_30px_rgba(0,0,0,0.7)] backdrop-blur-md pointer-events-auto">
          {/* Equalizer Wave / Audio Status Icon */}
          <button
            type="button"
            onClick={handleToggle}
            data-cursor="FOLEY"
            title={isEnabled ? 'Mute Foley Ambience' : 'Enable Contextual Foley Ambience'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-neutral-900 transition-colors"
          >
            {isEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
            )}

            {/* Micro Audio Equalizer Animation Bars */}
            <div className="flex items-end gap-0.5 h-3 w-4">
              <span
                className={`w-0.5 bg-cyan-400 rounded-full transition-all duration-150 ${
                  isEnabled ? 'h-3 animate-pulse' : 'h-1 bg-neutral-600'
                }`}
              />
              <span
                className={`w-0.5 bg-cyan-400 rounded-full transition-all duration-200 ${
                  isEnabled ? 'h-2 animate-pulse' : 'h-1 bg-neutral-600'
                }`}
              />
              <span
                className={`w-0.5 bg-cyan-400 rounded-full transition-all duration-300 ${
                  isEnabled ? 'h-3.5 animate-pulse' : 'h-1 bg-neutral-600'
                }`}
              />
            </div>

            <div className="flex flex-col text-left">
              <span className="text-[9px] font-mono-film text-neutral-400 font-bold uppercase tracking-wider hidden sm:inline">
                FOLEY: {descriptor.name.split('&')[0].trim()}
              </span>
              <span className="text-[8px] font-mono-film text-cyan-400 hidden md:inline">
                {isEnabled ? '● LIVE CONTEXT' : '○ MUTED'}
              </span>
            </div>
          </button>

          {/* Expand Settings Drawer Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIsExpanded((prev) => !prev);
            }}
            data-cursor="EXPAND"
            title="Adjust Ambient Foley Atmospheres & Volume"
            className="p-1.5 rounded-full hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
          >
            <Disc3
              className={`w-3.5 h-3.5 text-cyan-400 transition-transform duration-500 ${
                isExpanded ? 'rotate-180 text-amber-400' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
