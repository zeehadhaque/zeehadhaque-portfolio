import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Film,
  Plus,
  Trash2,
  Play,
  Pause,
  Download,
  CheckCircle2,
  Layers,
  Sparkles,
  Award,
  Video,
  Eye,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { Language } from '../../types';
import { soundEngine } from '../../utils/audio';
import { directorsQuest } from '../../utils/directorsQuest';

interface StoryboardBuilderGameProps {
  currentLang: Language;
  directorsCut?: boolean;
}

export type ShotSize = 'EWS' | 'WS' | 'MS' | 'MCU' | 'CU' | 'ECU';
export type FramingRule = 'rule-of-thirds' | 'headroom' | 'lead-room' | 'dutch-angle' | 'center-symmetry';
export type CameraMovement = 'static-tripod' | 'dolly-push' | 'steadicam-track' | 'handheld-shake' | 'crane-rise';
export type SceneElement = 'protagonist' | 'shadow-figure' | 'mist-shroud' | 'industrial-neon' | 'audio-cassette';

export interface StoryboardShot {
  id: string;
  shotNumber: number;
  description: string;
  size: ShotSize;
  rule: FramingRule;
  movement: CameraMovement;
  element: SceneElement;
  notesBn: string;
  notesEn: string;
}

const DEFAULT_SHOTS: StoryboardShot[] = [
  {
    id: 'shot-1',
    shotNumber: 1,
    description: 'Establishing Gazipur industrial mist at 3:15 AM',
    size: 'EWS',
    rule: 'rule-of-thirds',
    movement: 'static-tripod',
    element: 'mist-shroud',
    notesBn: 'কুয়াশার ভেতর নিস্তব্ধ নগরীর বিশালতা',
    notesEn: 'Expansive solitude within dense nocturne mist',
  },
  {
    id: 'shot-2',
    shotNumber: 2,
    description: 'Protagonist pacing near the rusted lamppost',
    size: 'MS',
    rule: 'lead-room',
    movement: 'dolly-push',
    element: 'protagonist',
    notesBn: 'দৃষ্টির সামনে পর্যাপ্ত স্পেস (লিড-রুম) রেখে ক্যামেরার ধীর পুশ',
    notesEn: 'Ample leading space anticipating movement',
  },
  {
    id: 'shot-3',
    shotNumber: 3,
    description: 'A blurred shadow detaching from the wall',
    size: 'WS',
    rule: 'dutch-angle',
    movement: 'handheld-shake',
    element: 'shadow-figure',
    notesBn: '৬ ডিগ্রি ডাচ টিল্ট ফ্রেম দিয়ে মানসিক ভারসাম্যহীনতার প্রকাশ',
    notesEn: 'Dutch tilt angle signaling psychological collapse',
  },
];

const AVAILABLE_SIZES: { id: ShotSize; label: string; desc: string }[] = [
  { id: 'EWS', label: 'EWS', desc: 'Extreme Wide Shot' },
  { id: 'WS', label: 'WS', desc: 'Wide Establishing Shot' },
  { id: 'MS', label: 'MS', desc: 'Medium Waist-Level Shot' },
  { id: 'MCU', label: 'MCU', desc: 'Medium Close-Up (Chest)' },
  { id: 'CU', label: 'CU', desc: 'Close-Up (Face/Emotion)' },
  { id: 'ECU', label: 'ECU', desc: 'Extreme Close-Up (Eyes/Detail)' },
];

const AVAILABLE_RULES: { id: FramingRule; labelEn: string; labelBn: string; hint: string }[] = [
  {
    id: 'rule-of-thirds',
    labelEn: 'Rule of Thirds',
    labelBn: 'রুল অফ থার্ডস',
    hint: 'Subject sits at the golden 3x3 intersection nodes for natural visual equilibrium.',
  },
  {
    id: 'headroom',
    labelEn: 'Balanced Headroom',
    labelBn: 'হেডরুম কন্ট্রোল',
    hint: 'Precise vertical space above subject’s browline preventing cramped or drowning frames.',
  },
  {
    id: 'lead-room',
    labelEn: 'Lead / Looking Room',
    labelBn: 'লিড / লুকিং রুম',
    hint: 'Negative space allocated in the direction of the gaze to create cinematic anticipation.',
  },
  {
    id: 'dutch-angle',
    labelEn: 'Dutch Tilt Angle',
    labelBn: 'ডাচ টিল্ট ফ্রেম',
    hint: 'Horizon tilted 5°-10° off-axis to evoke paranoia, madness, or impending danger.',
  },
  {
    id: 'center-symmetry',
    labelEn: 'Center Symmetry',
    labelBn: 'সেন্টার সিমেট্রি',
    hint: 'Exact geometric focal convergence for divine, clinical, or claustrophobic grandeur.',
  },
];

const AVAILABLE_MOVEMENTS: { id: CameraMovement; labelEn: string; labelBn: string }[] = [
  { id: 'static-tripod', labelEn: 'Locked Tripod (Ozu-style)', labelBn: 'স্থির ট্রাইপড (ওজু স্টাইল)' },
  { id: 'dolly-push', labelEn: 'Slow Dolly Push-In', labelBn: 'ধীর ডলি পুশ-ইন' },
  { id: 'steadicam-track', labelEn: 'Steadicam Lateral Track', labelBn: 'স্টেডিক্যাম ট্র্যাকিং' },
  { id: 'handheld-shake', labelEn: 'Handheld Tremor (Visceral)', labelBn: 'হ্যান্ডহেল্ড ঝাঁকুনি' },
  { id: 'crane-rise', labelEn: 'Jib / Crane Elevate', labelBn: 'ক্রেন উর্ধ্বগতি' },
];

const AVAILABLE_ELEMENTS: { id: SceneElement; labelEn: string; labelBn: string; color: string }[] = [
  { id: 'protagonist', labelEn: 'Protagonist Silhouette', labelBn: 'প্রটাগনিস্ট সিলুয়েট', color: '#38bdf8' },
  { id: 'shadow-figure', labelEn: 'Ominous Shadow Doppelgänger', labelBn: 'ছায়া ডপেলগ্যাঙ্গার', color: '#e11d48' },
  { id: 'mist-shroud', labelEn: 'Bhawal Volumetric Mist', labelBn: 'ভাওয়ালের কুয়াশা', color: '#94a3b8' },
  { id: 'industrial-neon', labelEn: '4300K Street Neon Flare', labelBn: 'শিল্প এলাকার নিয়ন আলো', color: '#f59e0b' },
  { id: 'audio-cassette', labelEn: 'Vintage Cassette Tape Prop', labelBn: 'অ্যানালগ ক্যাসেট প্রপ', color: '#a855f7' },
];

export function StoryboardBuilderGame({ currentLang, directorsCut }: StoryboardBuilderGameProps) {
  const [shots, setShots] = useState<StoryboardShot[]>(DEFAULT_SHOTS);
  const [selectedShotId, setSelectedShotId] = useState<string>(DEFAULT_SHOTS[0].id);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [activePlaybackIndex, setActivePlaybackIndex] = useState(0);
  const [showGridOverlay, setShowGridOverlay] = useState(true);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const isBn = currentLang === 'bn';
  const selectedShot = shots.find((s) => s.id === selectedShotId) || shots[0];

  // Modify currently selected shot
  const updateSelectedShot = (updates: Partial<StoryboardShot>) => {
    soundEngine.playClick();
    setShots((prev) =>
      prev.map((s) => (s.id === selectedShotId ? { ...s, ...updates } : s))
    );
  };

  const addShot = () => {
    if (shots.length >= 6) return;
    soundEngine.playClapper();
    const newNum = shots.length + 1;
    const newShot: StoryboardShot = {
      id: `shot-${Date.now()}`,
      shotNumber: newNum,
      description: `Dramatic Sequence Beat ${newNum}`,
      size: 'CU',
      rule: 'center-symmetry',
      movement: 'dolly-push',
      element: 'audio-cassette',
      notesBn: 'দৃশ্যের চরম সংঘাত মুহূর্ত',
      notesEn: 'Climactic emotional confrontation beat',
    };
    setShots([...shots, newShot]);
    setSelectedShotId(newShot.id);
  };

  const deleteShot = (id: string) => {
    if (shots.length <= 2) return;
    soundEngine.playClick();
    const filtered = shots.filter((s) => s.id !== id).map((s, idx) => ({ ...s, shotNumber: idx + 1 }));
    setShots(filtered);
    if (selectedShotId === id) {
      setSelectedShotId(filtered[0].id);
    }
  };

  // Sequence Playback Engine
  const playSequence = () => {
    soundEngine.playClapper();
    setIsPlayingSequence(true);
    setActivePlaybackIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      soundEngine.playShutter();
      current++;
      if (current >= shots.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsPlayingSequence(false);
          setActivePlaybackIndex(0);
          soundEngine.playSuccess();
          // Unlock Storyboard Cinema Badge in Director's Quest
          directorsQuest.unlockBadge('badge-storyboard');
        }, 800);
      } else {
        setActivePlaybackIndex(current);
      }
    }, 1800);
  };

  const exportShotList = () => {
    soundEngine.playSuccess();
    const markdown = shots
      .map(
        (s) =>
          `[SHOT 0${s.shotNumber}] ${s.size} • ${s.rule.toUpperCase()} • ${s.movement.toUpperCase()}\n- Element: ${s.element}\n- Notes: ${isBn ? s.notesBn : s.notesEn}`
      )
      .join('\n\n');

    navigator.clipboard.writeText(`=== ZEEHAD HAQUE INDIE CALL SHEET // SHOT LIST ===\n\n${markdown}`);
    setExportNotice(isBn ? 'শট লিস্ট ক্লিপবোর্ডে কপি হয়েছে!' : 'Call sheet copied to clipboard!');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const activeDisplayShot = isPlayingSequence ? shots[activePlaybackIndex] : selectedShot;

  return (
    <div className="space-y-6 font-mono-film">
      {/* Briefing Header */}
      <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
            <Film className="w-4 h-4 text-amber-400" />
            <span>{isBn ? 'ইন্টারেক্টিভ শট লিস্ট ও স্টোরিবোর্ড বিল্ডার' : 'INTERACTIVE SHOT LIST & STORYBOARD BUILDER'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-400">
              {isBn ? `${shots.length}/৬ শট সাজানো` : `${shots.length}/6 SHOTS ASSEMBLED`}
            </span>
          </div>
        </div>
        <p className="text-xs text-neutral-300">
          {isBn
            ? 'প্রতিটি শটের আকার (CU, WS, ECU), ফ্রেমিং নিয়ম (Rule of Thirds, Lead Room), এবং ক্যামেরার গতি নির্ধারণ করে ড্রামাটিক ৫-শট সিকোয়েন্স তৈরি করুন। "PLAY SEQUENCE" চালিয়ে পরীক্ষা করুন।'
            : 'Assemble an authentic 5-shot cinematic sequence. Configure shot sizes, framing composition rules, camera motion, and visual elements. Run PLAY SEQUENCE to evaluate narrative rhythm.'}
        </p>
      </div>

      {/* Main Visual Storyboard Viewfinder Frame (2.35:1 Anamorphic) */}
      <div className="relative w-full aspect-[2.35/1] max-h-[400px] rounded-2xl overflow-hidden bg-black border border-cyan-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex items-center justify-center">
        {/* Playback Cut Effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDisplayShot.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Ambient Lighting Gradient based on Shot Size & Element */}
            <div
              className={`absolute inset-0 transition-colors duration-700 ${
                activeDisplayShot.element === 'industrial-neon'
                  ? 'bg-gradient-to-tr from-amber-950/40 via-neutral-950 to-cyan-950/30'
                  : activeDisplayShot.element === 'shadow-figure'
                  ? 'bg-gradient-to-b from-rose-950/30 via-neutral-950 to-black'
                  : activeDisplayShot.element === 'mist-shroud'
                  ? 'bg-gradient-to-t from-slate-900/50 via-neutral-950 to-neutral-900'
                  : 'bg-gradient-to-tr from-cyan-950/40 via-neutral-950 to-black'
              }`}
            />

            {/* Simulated Composition Backdrop Graphic */}
            <div
              className={`relative z-10 w-full h-full flex items-center justify-center p-8 transition-transform duration-700 ${
                activeDisplayShot.rule === 'dutch-angle' ? 'rotate-6 scale-105' : ''
              }`}
            >
              {/* Dynamic Actor/Element Positioning based on Framing Rule */}
              <motion.div
                animate={
                  activeDisplayShot.movement === 'handheld-shake'
                    ? { x: [-3, 3, -2, 2, 0], y: [-2, 2, -1, 1, 0] }
                    : activeDisplayShot.movement === 'dolly-push'
                    ? { scale: [0.96, 1.06] }
                    : {}
                }
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className={`relative flex flex-col items-center transition-all duration-500 ${
                  activeDisplayShot.rule === 'rule-of-thirds'
                    ? 'translate-x-20 sm:translate-x-32'
                    : activeDisplayShot.rule === 'lead-room'
                    ? '-translate-x-24 sm:-translate-x-36'
                    : activeDisplayShot.rule === 'headroom'
                    ? 'translate-y-8'
                    : 'translate-x-0'
                }`}
              >
                {/* Visual Scale representing Shot Size */}
                <div
                  className={`rounded-2xl border flex flex-col items-center justify-center transition-all duration-500 shadow-2xl relative ${
                    activeDisplayShot.size === 'EWS'
                      ? 'w-12 h-16 sm:w-16 sm:h-20 scale-75 border-neutral-700 bg-neutral-900/80'
                      : activeDisplayShot.size === 'WS'
                      ? 'w-20 h-28 sm:w-24 sm:h-32 scale-90 border-neutral-600 bg-neutral-900'
                      : activeDisplayShot.size === 'MS'
                      ? 'w-28 h-36 sm:w-36 sm:h-44 scale-100 border-cyan-500/40 bg-neutral-900/90'
                      : activeDisplayShot.size === 'MCU'
                      ? 'w-36 h-44 sm:w-44 sm:h-52 scale-110 border-cyan-400/60 bg-neutral-900'
                      : activeDisplayShot.size === 'CU'
                      ? 'w-48 h-56 sm:w-56 sm:h-64 scale-125 border-amber-400/60 bg-neutral-900'
                      : 'w-60 h-68 sm:w-72 sm:h-80 scale-140 border-rose-500/70 bg-neutral-900' // ECU
                  }`}
                >
                  <Eye className="w-8 h-8 text-neutral-400 opacity-60 mb-2" />
                  <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest">
                    {activeDisplayShot.size}
                  </span>
                  <span className="text-[8px] text-neutral-400 uppercase">
                    {activeDisplayShot.element.replace('-', ' ')}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Rule of Thirds / Framing Grid Overlay */}
        {showGridOverlay && (
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="w-full h-full grid grid-cols-3 grid-rows-3">
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
          </div>
        )}

        {/* Framing Rule Watermark HUD */}
        <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 rounded border border-neutral-800 text-[9px] text-cyan-400 font-bold tracking-widest flex items-center gap-2 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>
            [SHOT 0{activeDisplayShot.shotNumber}] {activeDisplayShot.size} •{' '}
            {activeDisplayShot.rule.toUpperCase().replace('-', ' ')}
          </span>
        </div>

        <div className="absolute top-3 right-3 bg-black/80 px-2.5 py-1 rounded border border-neutral-800 text-[9px] text-amber-400 font-bold tracking-widest backdrop-blur-sm">
          {activeDisplayShot.movement.toUpperCase().replace('-', ' ')}
        </div>

        {isPlayingSequence && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center">
            <span className="px-4 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-bold tracking-widest uppercase animate-pulse shadow-lg">
              ● PLAYING STORY SEQUENCE ({activePlaybackIndex + 1}/{shots.length})
            </span>
          </div>
        )}
      </div>

      {/* Shot Strip Timeline Selector */}
      <div className="p-3 rounded-xl bg-[#070b14] border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isBn ? 'শট সিকোয়েন্স টাইমলাইন (ক্লিক করে এডিট করুন):' : 'SHOT SEQUENCE TIMELINE (CLICK TO EDIT):'}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGridOverlay(!showGridOverlay)}
              className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                showGridOverlay ? 'bg-cyan-950 border-cyan-500/50 text-cyan-300' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
              }`}
            >
              {showGridOverlay ? 'GRID ON' : 'GRID OFF'}
            </button>
            <button
              onClick={addShot}
              disabled={shots.length >= 6}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10px] font-bold disabled:opacity-40 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>{isBn ? 'নতুন শট +' : 'ADD SHOT +'}</span>
            </button>
          </div>
        </div>

        {/* Timeline Horizontal Shot Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {shots.map((shot, idx) => (
            <div
              key={shot.id}
              onClick={() => {
                soundEngine.playClick();
                setSelectedShotId(shot.id);
              }}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between min-h-[90px] relative group ${
                selectedShotId === shot.id && !isPlayingSequence
                  ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : isPlayingSequence && activePlaybackIndex === idx
                  ? 'border-red-500 bg-red-950/50 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold">0{shot.shotNumber}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/60 font-mono text-cyan-400 border border-neutral-800">
                  {shot.size}
                </span>
              </div>
              <div className="text-[9px] truncate font-medium mt-1">
                {shot.rule.replace('-', ' ').toUpperCase()}
              </div>
              <div className="text-[8px] text-neutral-500 truncate">
                {shot.movement.replace('-', ' ')}
              </div>

              {shots.length > 2 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteShot(shot.id);
                  }}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-rose-400 transition-opacity"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Editor Controls for Selected Shot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Shot Size Selector */}
        <div className="p-3 rounded-xl bg-[#090e1c] border border-neutral-800 space-y-1.5">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
            {isBn ? '১. শট স্কেল / আকার' : '1. SHOT SIZE'}
          </span>
          <div className="grid grid-cols-3 gap-1">
            {AVAILABLE_SIZES.map((size) => (
              <button
                key={size.id}
                onClick={() => updateSelectedShot({ size: size.id })}
                className={`px-2 py-1.5 rounded text-[10px] font-bold text-center transition-all ${
                  selectedShot.size === size.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-white'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Composition / Framing Rule */}
        <div className="p-3 rounded-xl bg-[#090e1c] border border-neutral-800 space-y-1.5">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
            {isBn ? '২. ফ্রেমিং নিয়ম' : '2. FRAMING RULE'}
          </span>
          <div className="space-y-1">
            {AVAILABLE_RULES.slice(0, 4).map((rule) => (
              <button
                key={rule.id}
                onClick={() => updateSelectedShot({ rule: rule.id })}
                className={`w-full text-left px-2 py-1 rounded text-[10px] transition-all truncate ${
                  selectedShot.rule === rule.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-white'
                }`}
              >
                {isBn ? rule.labelBn : rule.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Camera Movement */}
        <div className="p-3 rounded-xl bg-[#090e1c] border border-neutral-800 space-y-1.5">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
            {isBn ? '৩. ক্যামেরার গতি' : '3. CAMERA MOVEMENT'}
          </span>
          <div className="space-y-1">
            {AVAILABLE_MOVEMENTS.slice(0, 4).map((m) => (
              <button
                key={m.id}
                onClick={() => updateSelectedShot({ movement: m.id })}
                className={`w-full text-left px-2 py-1 rounded text-[10px] transition-all truncate ${
                  selectedShot.movement === m.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-white'
                }`}
              >
                {isBn ? m.labelBn : m.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Scene Element */}
        <div className="p-3 rounded-xl bg-[#090e1c] border border-neutral-800 space-y-1.5">
          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">
            {isBn ? '৪. দৃশ্যপট উপাদান' : '4. SCENE ELEMENT'}
          </span>
          <div className="space-y-1">
            {AVAILABLE_ELEMENTS.slice(0, 4).map((el) => (
              <button
                key={el.id}
                onClick={() => updateSelectedShot({ element: el.id })}
                className={`w-full text-left px-2 py-1 rounded text-[10px] transition-all truncate ${
                  selectedShot.element === el.id
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 font-bold'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-white'
                }`}
              >
                {isBn ? el.labelBn : el.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sequence Actions: Play & Export */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            onClick={playSequence}
            disabled={isPlayingSequence}
            data-cursor="PLAY"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:opacity-50 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isBn ? 'সিকোয়েন্স প্লে করুন' : 'PLAY SEQUENCE'}</span>
          </button>

          <button
            onClick={exportShotList}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isBn ? 'কল শিট কপি' : 'COPY CALL SHEET'}</span>
          </button>
        </div>

        {exportNotice && (
          <span className="text-xs text-emerald-400 font-bold animate-pulse">{exportNotice}</span>
        )}
      </div>
    </div>
  );
}
