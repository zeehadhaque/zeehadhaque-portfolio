import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wrench, Film, Layers, CheckSquare, ListPlus, Download, Sparkles } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { soundEngine } from '../../utils/audio';

export const DirectorToolboxModal: React.FC = () => {
  const toolboxOpen = useUniverseStore((s) => s.toolboxOpen);
  const setToolboxOpen = useUniverseStore((s) => s.setToolboxOpen);
  const [activeTool, setActiveTool] = useState<'shotlist' | 'storyboard' | 'production'>('shotlist');

  // Shot list generator state
  const [shotParams, setShotParams] = useState({
    sceneType: 'Nocturnal Corridor Confrontation',
    emotion: 'Claustrophobic Dread & Suspense',
    location: 'Decaying Colonial Estate',
    characters: 'Lone Investigator & Fleeting Shadow',
    genre: 'Psychological Thriller',
  });

  const [generatedShots, setGeneratedShots] = useState<
    Array<{
      shotNum: string;
      size: string;
      lens: string;
      angle: string;
      movement: string;
      composition: string;
      purpose: string;
    }>
  >([
    {
      shotNum: 'SHOT 01',
      size: 'EXTREME LONG SHOT (ELS)',
      lens: '24mm Prime',
      angle: 'Low Angle (Floor level)',
      movement: 'Slow Motorized Push-In',
      composition: 'Deep vanishing corridor with cold cyan rim',
      purpose: 'Establish suffocating spatial architecture and solitude',
    },
    {
      shotNum: 'SHOT 02',
      size: 'MEDIUM CLOSE UP (MCU)',
      lens: '50mm Prime',
      angle: 'Eye Level',
      movement: 'Static',
      composition: 'Negative headroom to heighten psychological unease',
      purpose: 'Capture hesitation and dilated pupils as footsteps cease',
    },
    {
      shotNum: 'SHOT 03',
      size: 'EXTREME CLOSE UP (ECU)',
      lens: '85mm Macro',
      angle: 'High Angle',
      movement: 'Whip Tilt',
      composition: 'Brass doorknob vibrating slightly in silence',
      purpose: 'Sensory trigger for impending narrative reversal',
    },
  ]);

  // Production room checklist
  const [productionTasks, setProductionTasks] = useState([
    { phase: 'DEVELOPMENT', task: 'Finalize Visual Storyboard & Beat Reversals', done: true },
    { phase: 'DEVELOPMENT', task: 'Lock Canonical 2.39:1 Anamorphic Aspect Ratio', done: true },
    { phase: 'PRE-PRODUCTION', task: 'Scout Old Dhaka / Gazipur Nocturnal Corridors', done: true },
    { phase: 'PRE-PRODUCTION', task: 'Calibrate Redmi Note 14 Pro+ Manual 24fps Profile', done: true },
    { phase: 'PRODUCTION', task: 'Capture 42Hz Room Tone & Diegetic Footstep Foley', done: false },
    { phase: 'POST-PRODUCTION', task: 'Conform DaVinci Resolve Bleach Bypass Color Curves', done: false },
    { phase: 'DELIVERY', task: 'Master 4K YouTube Archive Release with Zero Artifacts', done: false },
  ]);

  useEffect(() => {
    if (toolboxOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [toolboxOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && toolboxOpen) {
        setToolboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toolboxOpen, setToolboxOpen]);

  if (!toolboxOpen) return null;

  const handleClose = () => {
    soundEngine.playClick();
    setToolboxOpen(false);
  };

  const handleGenerateShotList = () => {
    soundEngine.playShutter();
    // Deterministic generation based on params
    setGeneratedShots([
      {
        shotNum: 'SHOT 01',
        size: 'LONG SHOT (LS)',
        lens: '24mm Prime',
        angle: 'Floor Level Low Angle',
        movement: 'Slow Lateral Track',
        composition: 'Corridor symmetry with single moonlight key',
        purpose: `Establish ${shotParams.location} and mood of ${shotParams.emotion}`,
      },
      {
        shotNum: 'SHOT 02',
        size: 'MEDIUM SHOT (MS)',
        lens: '35mm Prime',
        angle: 'Eye Level',
        movement: 'Damped Glide',
        composition: 'Over-the-shoulder framing facing locked threshold',
        purpose: `Introduce ${shotParams.characters}`,
      },
      {
        shotNum: 'SHOT 03',
        size: 'CLOSE UP (CU)',
        lens: '50mm Prime',
        angle: 'Dutch Angle (12°)',
        movement: 'Static Hold (5 seconds)',
        composition: 'Tight framing cutting off chin for claustrophobia',
        purpose: 'Directorial focus on breathing and psychological tension',
      },
      {
        shotNum: 'SHOT 04',
        size: 'EXTREME CLOSE UP (ECU)',
        lens: '85mm Prime',
        angle: 'High Angle',
        movement: 'Rapid Push-In',
        composition: 'Reflective surface revealing delayed movement',
        purpose: 'Climax beat & temporal unmasking',
      },
    ]);
  };

  const toggleTask = (index: number) => {
    soundEngine.playClick();
    setProductionTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, done: !t.done } : t))
    );
  };

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
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#06090E] border border-[#102B45] rounded-xl shadow-2xl flex flex-col text-[#F2F0EB] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#04070D] border-b border-[#102B45]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#102B45] border border-[#2C6EA6] flex items-center justify-center">
                <Wrench className="w-4 h-4 text-[#7DBBFF]" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-[#F2F0EB]">
                  DIRECTOR'S TOOLBOX
                </h3>
                <p className="font-mono text-[10px] text-[#7DBBFF] tracking-wider">
                  PRODUCTION PLANNING & SHOT ARCHITECTURE // Z-94
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg border border-[#102B45] text-[#8A96A3] hover:text-[#F2F0EB] hover:bg-[#102B45] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub Navigation Bar */}
          <div className="flex items-center gap-2 px-6 py-2.5 border-b border-[#102B45] bg-[#020305] font-mono text-xs overflow-x-auto">
            <button
              onClick={() => {
                setActiveTool('shotlist');
                soundEngine.playClick();
              }}
              className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
                activeTool === 'shotlist'
                  ? 'bg-[#102B45] text-[#7DBBFF] border border-[#2C6EA6] font-bold'
                  : 'text-[#8A96A3] hover:text-[#F2F0EB]'
              }`}
            >
              SHOT LIST GENERATOR
            </button>
            <button
              onClick={() => {
                setActiveTool('production');
                soundEngine.playClick();
              }}
              className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
                activeTool === 'production'
                  ? 'bg-[#102B45] text-[#7DBBFF] border border-[#2C6EA6] font-bold'
                  : 'text-[#8A96A3] hover:text-[#F2F0EB]'
              }`}
            >
              PRODUCTION ROOM CHECKLIST
            </button>
          </div>

          {/* Tool Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {activeTool === 'shotlist' && (
              <div className="space-y-6">
                {/* Inputs */}
                <div className="p-4 rounded-xl bg-[#020305] border border-[#102B45] space-y-3 font-mono text-xs">
                  <div className="font-bold text-[#7DBBFF]">SCENE DIRECTORIAL PARAMETERS</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-[#8A96A3] block mb-1">SCENE TYPE</label>
                      <input
                        type="text"
                        value={shotParams.sceneType}
                        onChange={(e) => setShotParams({ ...shotParams, sceneType: e.target.value })}
                        className="w-full bg-[#06090E] border border-[#102B45] rounded p-2 text-[#F2F0EB]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8A96A3] block mb-1">CORE EMOTION</label>
                      <input
                        type="text"
                        value={shotParams.emotion}
                        onChange={(e) => setShotParams({ ...shotParams, emotion: e.target.value })}
                        className="w-full bg-[#06090E] border border-[#102B45] rounded p-2 text-[#F2F0EB]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8A96A3] block mb-1">LOCATION</label>
                      <input
                        type="text"
                        value={shotParams.location}
                        onChange={(e) => setShotParams({ ...shotParams, location: e.target.value })}
                        className="w-full bg-[#06090E] border border-[#102B45] rounded p-2 text-[#F2F0EB]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateShotList}
                    className="mt-2 px-5 py-2.5 rounded-lg bg-[#7DBBFF] text-[#020305] font-bold hover:bg-[#A9D4FF] transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>GENERATE DIRECTORIAL SHOT LIST</span>
                  </button>
                </div>

                {/* Generated Shots List */}
                <div className="space-y-3">
                  <div className="font-mono text-xs text-[#7DBBFF] tracking-widest uppercase">
                    COMPILED SHOT LIST (CANONICAL 2.39:1 CONFORM)
                  </div>
                  <div className="space-y-2.5">
                    {generatedShots.map((shot, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-[#06090E] border border-[#102B45] space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#102B45]/50 pb-2 font-mono text-xs">
                          <span className="font-bold text-[#7DBBFF]">{shot.shotNum}</span>
                          <span className="text-[#F2F0EB] font-bold">{shot.size}</span>
                          <span className="text-[#8A96A3]">{shot.lens}</span>
                          <span className="text-[#A9D4FF]">{shot.movement}</span>
                          <span className="text-[#8A96A3]">{shot.angle}</span>
                        </div>
                        <div className="text-xs text-[#F2F0EB]">
                          <span className="font-mono text-[10px] text-[#8A96A3] uppercase mr-2">COMPOSITION:</span>
                          {shot.composition}
                        </div>
                        <div className="text-xs text-[#8A96A3]">
                          <span className="font-mono text-[10px] text-[#7DBBFF] uppercase mr-2">DIRECTOR NOTE:</span>
                          {shot.purpose}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTool === 'production' && (
              <div className="space-y-4">
                <div className="font-mono text-xs text-[#7DBBFF] tracking-widest uppercase">
                  DIRECTOR'S PRODUCTION ROOM PIPELINE
                </div>
                <div className="space-y-2 font-mono text-xs">
                  {productionTasks.map((t, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleTask(idx)}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                        t.done
                          ? 'bg-[#102B45]/30 border-[#2C6EA6] text-[#F2F0EB]'
                          : 'bg-[#06090E] border-[#102B45] text-[#8A96A3] hover:text-[#F2F0EB]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            t.done
                              ? 'bg-[#7DBBFF] border-[#7DBBFF] text-[#020305]'
                              : 'border-[#102B45]'
                          }`}
                        >
                          {t.done && '✓'}
                        </div>
                        <span className={t.done ? 'line-through text-[#8A96A3]' : 'font-semibold'}>
                          {t.task}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#7DBBFF] px-2 py-0.5 rounded bg-[#020305] border border-[#102B45]">
                        {t.phase}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
