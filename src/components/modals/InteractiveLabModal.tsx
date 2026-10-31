import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Sparkles, Sliders, Scissors, Radio, Layers } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { soundEngine } from '../../utils/audio';

import { CameraSimulatorLab } from '../labs/CameraSimulatorLab';
import { ColorGradingLab } from '../labs/ColorGradingLab';
import { EditSuiteLab } from '../labs/EditSuiteLab';
import { SoundDesignLab } from '../labs/SoundDesignLab';
import { StoryLab } from '../labs/StoryLab';
import { InteractiveLightingStudio } from '../academy/InteractiveLightingStudio';

export const InteractiveLabModal: React.FC = () => {
  const activeLab = useUniverseStore((s) => s.activeLab);
  const setActiveLab = useUniverseStore((s) => s.setActiveLab);

  useEffect(() => {
    if (activeLab) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [activeLab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeLab) {
        setActiveLab(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLab, setActiveLab]);

  if (!activeLab) return null;

  const handleClose = () => {
    soundEngine.playClick();
    setActiveLab(null);
  };

  const labMeta: Record<
    string,
    { title: string; subtitle: string; icon: any; zDepth: string }
  > = {
    camera: {
      title: 'CAMERA SIMULATOR LAB',
      subtitle: '2.39:1 ANAMORPHIC COMPOSITION & SENSOR DYNAMICS',
      icon: Camera,
      zDepth: 'Z-65',
    },
    light: {
      title: 'LIGHTING STUDIO LAB',
      subtitle: '3-POINT LIGHT MOTIVATION & CHIAROSCURO CONTRAST',
      icon: Sparkles,
      zDepth: 'Z-75',
    },
    color: {
      title: 'COLOR GRADING & LUT SUITE',
      subtitle: 'NOCTURNAL CURVES & BLUE SHADOW REACTION',
      icon: Sliders,
      zDepth: 'Z-80',
    },
    edit: {
      title: 'DIRECTORIAL EDIT SUITE',
      subtitle: 'CADENCE, CONTINUITY & PACING CHALLENGES',
      icon: Scissors,
      zDepth: 'Z-88',
    },
    sound: {
      title: 'SOUND DESIGN & FOLEY LAB',
      subtitle: '42HZ SUB-BASS OSCILLATION & SPATIAL SILENCE',
      icon: Radio,
      zDepth: 'Z-92',
    },
    story: {
      title: 'STORY ARCHITECT & SCRIPT LAB',
      subtitle: 'PREMISE FORGE, DRAMATIC BEATS & VISUAL SUBTEXT',
      icon: Layers,
      zDepth: 'Z-50',
    },
  };

  const current = labMeta[activeLab] || labMeta.camera;
  const Icon = current.icon;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#020305]/85 backdrop-blur-xl animate-in fade-in duration-200"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[92vh] bg-[#06090E] border border-[#102B45] rounded-xl shadow-2xl flex flex-col text-[#F2F0EB] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#04070D] border-b border-[#102B45]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#102B45] border border-[#2C6EA6] flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#7DBBFF]" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-[#F2F0EB]">
                  {current.title}
                </h3>
                <p className="font-mono text-[10px] text-[#7DBBFF] tracking-wider">
                  {current.subtitle} // {current.zDepth}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg border border-[#102B45] text-[#8A96A3] hover:text-[#F2F0EB] hover:bg-[#102B45] transition-colors font-mono text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Sub-Lab Switcher */}
          <div className="flex items-center gap-2 px-6 py-2 border-b border-[#102B45] bg-[#020305] font-mono text-[11px] overflow-x-auto">
            {(
              [
                { id: 'story', label: 'STORY' },
                { id: 'camera', label: 'CAMERA' },
                { id: 'light', label: 'LIGHTING' },
                { id: 'color', label: 'COLOR' },
                { id: 'edit', label: 'EDITING' },
                { id: 'sound', label: 'SOUND' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveLab(tab.id);
                  soundEngine.playClick();
                }}
                className={`px-3 py-1 rounded transition-all whitespace-nowrap ${
                  activeLab === tab.id
                    ? 'bg-[#102B45] text-[#7DBBFF] border border-[#2C6EA6] font-bold'
                    : 'text-[#8A96A3] hover:text-[#F2F0EB]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Lab Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {activeLab === 'camera' && <CameraSimulatorLab />}
            {activeLab === 'light' && <InteractiveLightingStudio />}
            {activeLab === 'color' && <ColorGradingLab />}
            {activeLab === 'edit' && <EditSuiteLab />}
            {activeLab === 'sound' && <SoundDesignLab />}
            {activeLab === 'story' && <StoryLab />}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
