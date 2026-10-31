import { motion, AnimatePresence } from 'motion/react';
import { X, Command, Sliders, Volume2, Search, Film, Gamepad2, User, Mail, Sparkles, ArrowUp, GraduationCap } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ConsoleShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (key: string) => void;
}

export const SHORTCUTS_DATA = [
  { key: 'S', alt: '/', label: 'Search Film Vault', icon: Search, desc: 'Open searchable film archives and scripts', category: 'NAVIGATION' },
  { key: 'A', label: 'Audio Engine', icon: Volume2, desc: 'Toggle ambient room tone and sound design', category: 'SYSTEM' },
  { key: 'M', label: 'Movie Model', icon: Film, desc: 'Launch featured film reel & 2.35:1 player', category: 'PROJECTION' },
  { key: 'D', label: "Director's Cut", icon: Sliders, desc: 'Toggle screenplay notes, lens metadata & anamorphic flares', category: 'SYSTEM' },
  { key: 'G', label: 'Cine-Arcade', icon: Gamepad2, desc: 'Engage rack focus, 24fps clapper & colorist games', category: 'INTERACTION' },
  { key: 'E', label: 'Filmmaking Academy', icon: GraduationCap, desc: 'Enter masterclass codex, DoF simulator & lighting lab', category: 'LEARNING' },
  { key: 'W', label: 'Selected Work', icon: Film, desc: 'Jump to filmography showcase with shutter slide', category: 'NAVIGATION' },
  { key: 'P', label: 'Cinematographer Dossier', icon: User, desc: 'Jump to Zeehad Haque profile and artistic statement', category: 'NAVIGATION' },
  { key: 'Z', label: 'Zee AI Assistant', icon: Sparkles, desc: 'Summon interactive filmmaker AI assistant', category: 'INTELLIGENCE' },
  { key: 'C', label: 'Contact Dossier', icon: Mail, desc: 'Jump to production inquiries and collaboration desk', category: 'COMMUNICATION' },
  { key: 'T', label: 'Back to Top', icon: ArrowUp, desc: 'Rewind film reel to Frame 01 (Hero)', category: 'REEL' },
  { key: '?', alt: 'K', label: 'Console Legend', icon: Command, desc: 'Display this keyboard console manual', category: 'HELP' },
  { key: 'Esc', label: 'Disengage / Close', icon: X, desc: 'Close open drawers, player, and active consoles', category: 'SYSTEM' },
];

export function ConsoleShortcutsModal({ isOpen, onClose, onAction }: ConsoleShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Console Panel Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[#030712] border border-cyan-500/40 rounded-2xl shadow-[0_0_60px_rgba(0,240,255,0.2)] overflow-hidden z-10 max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                <Command className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-cinematic text-base font-bold text-white tracking-wider uppercase">
                  MASTER CONSOLE // KEYBOARD COMMANDS
                </h3>
                <p className="font-mono-film text-[10px] text-neutral-400 tracking-widest">
                  PROFESSIONAL FILMMAKING DECK SHORTCUTS
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              data-cursor="CLOSE"
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Note */}
          <div className="px-6 py-2.5 bg-cyan-950/30 border-b border-cyan-900/40 flex items-center justify-between text-[11px] font-mono-film text-cyan-300">
            <span>PRESS KEY ANYWHERE TO DISPATCH COMMAND</span>
            <span className="text-neutral-400 text-[10px]">CLICK ANY ROW TO EXECUTE</span>
          </div>

          {/* Grid of Shortcuts */}
          <div className="p-6 overflow-y-auto space-y-2.5 custom-scrollbar">
            {SHORTCUTS_DATA.map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <button
                  key={shortcut.key}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    onAction(shortcut.key);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-900/40 border border-neutral-800 hover:border-cyan-500/50 hover:bg-neutral-900/90 transition-all group text-left"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Tactical Aluminum Keycap */}
                    <div className="flex items-center gap-1">
                      <kbd className="min-w-[32px] h-8 px-2 rounded-md bg-neutral-800 border-b-2 border-neutral-700 font-mono-film font-bold text-xs text-cyan-300 flex items-center justify-center shadow-inner group-hover:border-cyan-400 group-hover:text-white group-hover:bg-cyan-950/60 transition-all">
                        {shortcut.key}
                      </kbd>
                      {shortcut.alt && (
                        <>
                          <span className="text-neutral-500 text-xs">/</span>
                          <kbd className="min-w-[28px] h-8 px-1.5 rounded-md bg-neutral-800 border-b-2 border-neutral-700 font-mono-film font-bold text-xs text-neutral-400 flex items-center justify-center shadow-inner">
                            {shortcut.alt}
                          </kbd>
                        </>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-cyan-400 transition-colors" />
                        <span className="font-cinematic font-semibold text-sm text-neutral-200 group-hover:text-white transition-colors">
                          {shortcut.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 group-hover:text-neutral-300 mt-0.5">
                        {shortcut.desc}
                      </p>
                    </div>
                  </div>

                  <span className="hidden sm:inline-block font-mono-film text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-neutral-800/60 text-neutral-400 group-hover:text-cyan-300 group-hover:bg-cyan-950/50 transition-colors border border-neutral-700/50">
                    {shortcut.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer status */}
          <div className="p-4 border-t border-neutral-800/80 bg-neutral-950 flex items-center justify-between font-mono-film text-[10px] text-neutral-400">
            <span>CONSOLE REV 2026.04 // 24.000 FPS</span>
            <span>PRESS [ESC] TO CLOSE</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
