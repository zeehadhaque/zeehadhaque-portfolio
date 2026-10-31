import React, { useState } from 'react';
import { Camera, Play, Award, CheckCircle, RefreshCw, Eye, Sparkles, Sliders } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { soundEngine } from '../../utils/audio';

export const CameraSimulatorLab: React.FC = () => {
  const cameraSettings = useUniverseStore((s) => s.cameraSettings);
  const updateCameraSettings = useUniverseStore((s) => s.updateCameraSettings);
  const addXP = useUniverseStore((s) => s.addXP);
  const completeChallenge = useUniverseStore((s) => s.completeChallenge);

  const [distance, setDistance] = useState(2.8);
  const [subjectX, setSubjectX] = useState(33); // Rule of thirds line
  const [shotScore, setShotScore] = useState<null | {
    composition: number;
    language: number;
    tension: number;
    overall: number;
    rating: 'BEGINNER' | 'GOOD' | 'STRONG' | 'DIRECTOR' | 'MASTER';
    critique: string;
  }>(null);

  const lenses = ['24mm', '35mm', '50mm', '85mm'] as const;
  const movements = ['STATIC', 'GLIDE', 'HANDHELD', 'TRACK', 'ORBIT', 'PUSH-IN', 'PULL-OUT'] as const;
  const apertures = ['f/1.4', 'f/1.8', 'f/2.0', 'f/2.8', 'f/4.0'] as const;
  const isos = [100, 200, 400, 800, 1600] as const;

  const calculateDirectorScore = () => {
    soundEngine.playShutter();

    // Scoring heuristics based on lens + rule of thirds + aperture + rig
    let comp = 80;
    let lang = 85;
    let tens = 75;

    // Rule of thirds placement (33% or 66%)
    if (Math.abs(subjectX - 33) < 8 || Math.abs(subjectX - 66) < 8) {
      comp += 15;
    } else if (Math.abs(subjectX - 50) < 5) {
      comp += 10; // Symmetrical Stanley Kubrick framing
    }

    // Lens choice synergy with movement
    if (cameraSettings.lens === '24mm' && (cameraSettings.movement === 'PUSH-IN' || cameraSettings.movement === 'TRACK')) {
      lang += 12;
      tens += 15;
    } else if (cameraSettings.lens === '85mm' && cameraSettings.aperture === 'f/1.4') {
      tens += 18;
    }

    const overall = Math.min(99, Math.round((comp + lang + tens) / 3));
    let rating: 'BEGINNER' | 'GOOD' | 'STRONG' | 'DIRECTOR' | 'MASTER' = 'BEGINNER';

    if (overall >= 92) rating = 'MASTER';
    else if (overall >= 85) rating = 'DIRECTOR';
    else if (overall >= 78) rating = 'STRONG';
    else if (overall >= 68) rating = 'GOOD';

    let critique = 'Good framing. Clean rule of thirds balance with disciplined focal depth.';
    if (rating === 'MASTER' || rating === 'DIRECTOR') {
      critique = 'Outstanding directorial composition! The combination of focal length, subject distance, and movement conveys genuine psychological suspense.';
    }

    setShotScore({
      composition: comp,
      language: lang,
      tension: tens,
      overall,
      rating,
      critique,
    });

    addXP('camera', 30);
    completeChallenge('camera-simulator-mastery');
  };

  return (
    <div className="space-y-6">
      {/* 2.39:1 Anamorphic Viewfinder */}
      <div className="relative w-full aspect-[2.39/1] rounded-xl overflow-hidden bg-[#020305] border-2 border-[#102B45] shadow-2xl select-none group">
        {/* Environment & Subject Visualizer */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1400&auto=format&fit=crop"
            alt="Anamorphic Simulation Subject"
            className="w-full h-full object-cover"
            style={{
              transform: `scale(${cameraSettings.lens === '85mm' ? 1.4 : cameraSettings.lens === '50mm' ? 1.2 : cameraSettings.lens === '35mm' ? 1.05 : 0.95})`,
              filter: `brightness(${cameraSettings.iso > 400 ? 1.15 : 0.95}) blur(${cameraSettings.aperture === 'f/1.4' ? '1px' : '0px'})`,
              transition: 'transform 0.4s ease, filter 0.4s ease',
            }}
          />
          <div className="absolute inset-0 bg-[#020305]/30 pointer-events-none" />
        </div>

        {/* 2.39:1 Anamorphic Mattes (Top & Bottom Letterbox Bars) */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-black/90 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-black/90 pointer-events-none" />

        {/* Rule of Thirds Grid Lines */}
        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30">
          <div className="border-r border-b border-[#7DBBFF]" />
          <div className="border-r border-b border-[#7DBBFF]" />
          <div className="border-b border-[#7DBBFF]" />
          <div className="border-r border-b border-[#7DBBFF]" />
          <div className="border-r border-b border-[#7DBBFF]" />
          <div className="border-b border-[#7DBBFF]" />
          <div className="border-r border-[#7DBBFF]" />
          <div className="border-r border-[#7DBBFF]" />
          <div />
        </div>

        {/* Center Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-6 h-6 border border-[#7DBBFF]/60 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
          </div>
        </div>

        {/* Interactive Subject Marker */}
        <div
          className="absolute bottom-8 w-12 h-24 border border-dashed border-[#A9D4FF] rounded flex flex-col items-center justify-center text-[9px] font-mono text-[#A9D4FF] bg-[#102B45]/40 backdrop-blur-sm shadow-md cursor-ew-resize -translate-x-1/2"
          style={{ left: `${subjectX}%` }}
        >
          <span>ACTOR</span>
          <span className="text-[8px] opacity-70">POS</span>
        </div>
        <input
          type="range"
          min="15"
          max="85"
          value={subjectX}
          onChange={(e) => setSubjectX(Number(e.target.value))}
          className="absolute bottom-2 left-10 right-10 opacity-0 cursor-ew-resize z-20"
        />

        {/* Camera HUD Telemetry Overlay */}
        <div className="absolute top-4 left-6 right-6 flex items-center justify-between font-mono text-[10px] text-[#F2F0EB] pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]" />
            <span className="font-bold text-rose-400">REC ●</span>
            <span className="text-[#8A96A3]">|</span>
            <span>24.000 FPS</span>
            <span className="text-[#8A96A3]">|</span>
            <span className="text-[#7DBBFF]">2.39:1 ANAMORPHIC</span>
          </div>

          <div className="flex items-center gap-3">
            <span>ISO {cameraSettings.iso}</span>
            <span>180° ({cameraSettings.shutter})</span>
            <span className="font-bold text-[#A9D4FF]">{cameraSettings.aperture}</span>
            <span className="text-[#7DBBFF]">{cameraSettings.lens}</span>
          </div>
        </div>

        {/* Bottom Left Camera Rig Telemetry */}
        <div className="absolute bottom-6 left-6 font-mono text-[10px] text-[#A9D4FF] pointer-events-none flex items-center gap-3">
          <span>RIG: {cameraSettings.movement}</span>
          <span>DIST: {distance.toFixed(1)}m</span>
        </div>
      </div>

      {/* Camera Controls Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl bg-[#06090E] border border-[#102B45] font-mono text-xs">
        {/* Lens Selection */}
        <div>
          <label className="text-[10px] text-[#8A96A3] block mb-1">LENS FOCAL LENGTH</label>
          <div className="grid grid-cols-2 gap-1.5">
            {lenses.map((l) => (
              <button
                key={l}
                onClick={() => {
                  updateCameraSettings({ lens: l });
                  soundEngine.playClick();
                }}
                className={`py-1.5 rounded text-[11px] border transition-all ${
                  cameraSettings.lens === l
                    ? 'bg-[#2C6EA6] border-[#7DBBFF] text-[#F2F0EB]'
                    : 'bg-[#04070D] border-[#102B45] text-[#8A96A3] hover:text-[#F2F0EB]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Movement / Rig */}
        <div>
          <label className="text-[10px] text-[#8A96A3] block mb-1">CAMERA RIG / MOVEMENT</label>
          <select
            value={cameraSettings.movement}
            onChange={(e) =>
              updateCameraSettings({ movement: e.target.value as any })
            }
            className="w-full bg-[#04070D] border border-[#102B45] text-[#7DBBFF] rounded p-2 text-xs outline-none"
          >
            {movements.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Aperture */}
        <div>
          <label className="text-[10px] text-[#8A96A3] block mb-1">APERTURE (F-STOP)</label>
          <select
            value={cameraSettings.aperture}
            onChange={(e) => updateCameraSettings({ aperture: e.target.value })}
            className="w-full bg-[#04070D] border border-[#102B45] text-[#7DBBFF] rounded p-2 text-xs outline-none"
          >
            {apertures.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* ISO Sensitivity */}
        <div>
          <label className="text-[10px] text-[#8A96A3] block mb-1">SENSOR ISO</label>
          <select
            value={cameraSettings.iso}
            onChange={(e) => updateCameraSettings({ iso: Number(e.target.value) })}
            className="w-full bg-[#04070D] border border-[#102B45] text-[#7DBBFF] rounded p-2 text-xs outline-none"
          >
            {isos.map((i) => (
              <option key={i} value={i}>
                ISO {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Score Trigger Button & Evaluation Results */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#020305] border border-[#102B45]">
        <div className="text-xs font-mono text-[#8A96A3]">
          Adjust Actor position on the viewfinder slider, pick lens & rig, then evaluate shot.
        </div>
        <button
          onClick={calculateDirectorScore}
          className="px-6 py-2.5 rounded-lg font-mono text-xs font-bold text-[#020305] bg-[#7DBBFF] hover:bg-[#A9D4FF] shadow-[0_0_20px_rgba(125,187,255,0.4)] transition-all flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          <span>EVALUATE COMPOSITION</span>
        </button>
      </div>

      {shotScore && (
        <div className="p-5 rounded-xl bg-[#06090E] border border-[#7DBBFF]/40 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#102B45] pb-2">
            <div>
              <span className="font-mono text-[10px] text-[#8A96A3]">DIRECTORIAL EVALUATION:</span>
              <div className="font-headline font-black text-xl text-[#7DBBFF]">
                {shotScore.rating} ({shotScore.overall}/100)
              </div>
            </div>
            <div className="flex items-center gap-4 font-mono text-xs text-[#8A96A3]">
              <div>COMPOSITION: <span className="text-[#F2F0EB] font-bold">{shotScore.composition}</span></div>
              <div>LANGUAGE: <span className="text-[#F2F0EB] font-bold">{shotScore.language}</span></div>
              <div>TENSION: <span className="text-[#F2F0EB] font-bold">{shotScore.tension}</span></div>
            </div>
          </div>
          <p className="text-xs text-[#F2F0EB]/90 leading-relaxed font-normal">
            {shotScore.critique}
          </p>
        </div>
      )}
    </div>
  );
};
