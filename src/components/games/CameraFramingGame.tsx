import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Maximize2, Aperture, CheckCircle2, RotateCcw, Compass, Sliders, Trophy } from 'lucide-react';
import { Language } from '../../types';
import { soundEngine } from '../../utils/audio';
import { directorsQuest } from '../../utils/directorsQuest';

interface CameraFramingGameProps {
  currentLang: Language;
  directorsCut?: boolean;
}

interface ShotAssignment {
  id: string;
  filmTitle: string;
  promptBn: string;
  promptEn: string;
  targetRatio: '2.35:1' | '1.85:1' | '4:3' | '9:16';
  targetFocal: '16mm' | '24mm' | '50mm' | '85mm';
  targetRule: 'thirds' | 'center' | 'dutch' | 'headroom';
  targetAngle: 'low' | 'eye' | 'high';
  image: string;
}

const SHOT_ASSIGNMENTS: ShotAssignment[] = [
  {
    id: 'shot-01',
    filmTitle: 'FLOW : THE MYST (FILM 02)',
    promptBn: 'অরণ্যের কুয়াশার বিশালতা ধারণ করতে ২.৩৫:১ অ্যানামরফিক ফ্রেম, ২৪ মিমি সিনেমাটিক লেন্স, রুল অফ থার্ডস এবং লো-অ্যাঙ্গেল বেছে নিন।',
    promptEn: 'Frame the mystical mist: Select 2.35:1 Anamorphic ratio, 24mm wide focal length, Rule of Thirds golden composition, and Low-Angle perspective.',
    targetRatio: '2.35:1',
    targetFocal: '24mm',
    targetRule: 'thirds',
    targetAngle: 'low',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'shot-02',
    filmTitle: 'LOST (FILM 07)',
    promptBn: '"লস্ট" ভার্টিক্যাল শর্টের জন্য ৯:১৬ রেশিও, ১৬ মিমি আল্ট্রা-ওয়াইড মোবাইল লেন্স, উলম্ব হেডরুম ও আই-লেভেল সেট করুন।',
    promptEn: 'For "LOST": Select 9:16 Vertical Cinema, 16mm Ultra-Wide lens, Negative Headroom composition, and Eye-Level camera height.',
    targetRatio: '9:16',
    targetFocal: '16mm',
    targetRule: 'headroom',
    targetAngle: 'eye',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'shot-03',
    filmTitle: 'SHADOW / III (FILM 04)',
    promptBn: 'মনস্তাত্ত্বিক বিভ্রান্তির ৩টি লুপ ফুটিয়ে তুলতে ২.৩৫:১ অ্যানামরফিক, ৫০ মিমি পোর্ট্রেট লেন্স, ডাচ টিল্ট (Dutch Angle) এবং হাই-অ্যাঙ্গেল সিলেক্ট করুন।',
    promptEn: 'Psychological disorientation: Select 2.35:1 Anamorphic, 50mm portrait compression, Dutch Tilt angle, and High-Angle vulnerability.',
    targetRatio: '2.35:1',
    targetFocal: '50mm',
    targetRule: 'dutch',
    targetAngle: 'high',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
  },
];

export function CameraFramingGame({ currentLang, directorsCut }: CameraFramingGameProps) {
  const [shotIdx, setShotIdx] = useState(0);
  const currentShot = SHOT_ASSIGNMENTS[shotIdx];
  const isBn = currentLang === 'bn';

  // User selections
  const [ratio, setRatio] = useState<'2.35:1' | '1.85:1' | '4:3' | '9:16'>('2.35:1');
  const [focal, setFocal] = useState<'16mm' | '24mm' | '50mm' | '85mm'>('24mm');
  const [rule, setRule] = useState<'thirds' | 'center' | 'dutch' | 'headroom'>('thirds');
  const [angle, setAngle] = useState<'low' | 'eye' | 'high'>('eye');
  const [score, setScore] = useState<number | null>(null);

  const calculateFraming = () => {
    soundEngine.playShutter();
    let pts = 0;
    if (ratio === currentShot.targetRatio) pts += 25;
    if (focal === currentShot.targetFocal) pts += 25;
    if (rule === currentShot.targetRule) pts += 25;
    if (angle === currentShot.targetAngle) pts += 25;
    setScore(pts);

    if (pts === 100) {
      soundEngine.playSuccess();
      directorsQuest.unlockBadge('badge-framing');
    }
  };

  const nextShot = () => {
    soundEngine.playClick();
    setShotIdx((prev) => (prev + 1) % SHOT_ASSIGNMENTS.length);
    setScore(null);
  };

  return (
    <div className="space-y-6 font-mono-film">
      {/* Briefing */}
      <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>{isBn ? 'গেম ০৫ : সিনেমাটোগ্রাফি ফ্রেমিং ও আসপেক্ট রেশিও মাস্টার' : 'GAME 05 : CAMERA FRAMING & COMPOSITION MASTER'}</span>
          </div>
          <span className="text-[10px] text-amber-400 px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40">
            {currentShot.filmTitle}
          </span>
        </div>
        <p className="text-xs text-neutral-300">
          {isBn ? currentShot.promptBn : currentShot.promptEn}
        </p>
      </div>

      {/* Visual Camera Viewfinder Simulator */}
      <div className="relative w-full aspect-[2.35/1] max-h-[380px] rounded-xl overflow-hidden bg-black border border-neutral-800 flex items-center justify-center">
        {/* Dynamic Aspect Ratio Letterbox Matte Simulation */}
        <div
          className={`relative overflow-hidden transition-all duration-500 border border-cyan-400/40 shadow-2xl ${
            ratio === '2.35:1'
              ? 'w-full h-full'
              : ratio === '1.85:1'
              ? 'w-[78%] h-full'
              : ratio === '4:3'
              ? 'w-[56%] h-full'
              : 'w-[32%] h-full' // 9:16
          }`}
        >
          {/* Background Scene Image with Focal Zoom & Dutch Tilt transform */}
          <img
            src={currentShot.image}
            alt="Cinematic Composition Frame"
            className={`w-full h-full object-cover filter contrast-110 transition-transform duration-700 ${
              focal === '16mm'
                ? 'scale-100'
                : focal === '24mm'
                ? 'scale-110'
                : focal === '50mm'
                ? 'scale-135'
                : 'scale-165'
            } ${rule === 'dutch' ? 'rotate-6' : ''} ${
              angle === 'low' ? '-translate-y-4' : angle === 'high' ? 'translate-y-4' : ''
            }`}
          />

          {/* Viewfinder Composition Grids */}
          {rule === 'thirds' && (
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-40">
              <div className="border-r border-b border-cyan-400" />
              <div className="border-r border-b border-cyan-400" />
              <div className="border-b border-cyan-400" />
              <div className="border-r border-b border-cyan-400" />
              <div className="border-r border-b border-cyan-400" />
              <div className="border-b border-cyan-400" />
              <div className="border-r border-cyan-400" />
              <div className="border-r border-cyan-400" />
              <div />
            </div>
          )}

          {rule === 'center' && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-50">
              <div className="w-12 h-12 border border-cyan-400 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
              </div>
            </div>
          )}

          {rule === 'headroom' && (
            <div className="absolute inset-x-0 top-1/3 border-b-2 border-dashed border-amber-400/60 pointer-events-none" />
          )}

          {/* Viewfinder Telemetry */}
          <div className="absolute bottom-2 left-2 text-[9px] text-cyan-300 bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm">
            {ratio} • {focal} • {rule.toUpperCase()} • {angle.toUpperCase()} ANGLE
          </div>
        </div>
      </div>

      {/* 4 Cinematography Control Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Aspect Ratio */}
        <div className="p-3 rounded-xl bg-[#090e1c] border border-neutral-800 space-y-1.5">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
            {isBn ? '১. আসপেক্ট রেশিও' : '1. ASPECT RATIO'}
          </span>
          <div className="grid grid-cols-2 gap-1">
            {(['2.35:1', '1.85:1', '4:3', '9:16'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  soundEngine.playClick();
                  setRatio(r);
                }}
                className={`px-2 py-1.5 rounded text-[11px] font-bold text-center transition-all ${
                  ratio === r
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Focal Length */}
        <div className="p-3 rounded-xl bg-[#090e1c] border border-neutral-800 space-y-1.5">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
            {isBn ? '২. ফোকাল লেংথ' : '2. FOCAL LENGTH'}
          </span>
          <div className="grid grid-cols-2 gap-1">
            {(['16mm', '24mm', '50mm', '85mm'] as const).map((f) => (
              <button
                key={f}
                onClick={() => {
                  soundEngine.playClick();
                  setFocal(f);
                }}
                className={`px-2 py-1.5 rounded text-[11px] font-bold text-center transition-all ${
                  focal === f
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Composition Rule */}
        <div className="p-3 rounded-xl bg-[#090e1c] border border-neutral-800 space-y-1.5">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
            {isBn ? '৩. কম্পোজিশন ফ্রেম' : '3. COMPOSITION'}
          </span>
          <div className="grid grid-cols-2 gap-1">
            {(['thirds', 'center', 'dutch', 'headroom'] as const).map((ru) => (
              <button
                key={ru}
                onClick={() => {
                  soundEngine.playClick();
                  setRule(ru);
                }}
                className={`px-2 py-1.5 rounded text-[10px] font-bold text-center uppercase transition-all ${
                  rule === ru
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-white'
                }`}
              >
                {ru}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Angle Height */}
        <div className="p-3 rounded-xl bg-[#090e1c] border border-neutral-800 space-y-1.5">
          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">
            {isBn ? '৪. ক্যামেরার কোণ (অ্যাঙ্গেল)' : '4. CAMERA ANGLE'}
          </span>
          <div className="grid grid-cols-3 gap-1">
            {(['low', 'eye', 'high'] as const).map((a) => (
              <button
                key={a}
                onClick={() => {
                  soundEngine.playClick();
                  setAngle(a);
                }}
                className={`px-2 py-1.5 rounded text-[10px] font-bold text-center uppercase transition-all ${
                  angle === a
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-white'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Verification & Next Button */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            onClick={calculateFraming}
            data-cursor="FRAME"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 text-xs font-bold uppercase tracking-wider transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>{isBn ? 'ফ্রেম লক করুন' : 'LOCK FRAME & EVALUATE'}</span>
          </button>

          {score !== null && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400">{isBn ? 'সিনেমাটোগ্রাফি স্কোর:' : 'DoP SCORE:'}</span>
              <span
                className={`text-sm font-bold ${
                  score === 100 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {score}%
              </span>
            </div>
          )}
        </div>

        <button
          onClick={nextShot}
          className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors"
        >
          {isBn ? 'পরবর্তী শট অ্যাসাইনমেন্ট' : 'NEXT SHOT ASSIGNMENT →'}
        </button>
      </div>
    </div>
  );
}
