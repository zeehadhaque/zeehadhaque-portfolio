import { useState } from 'react';
import { motion } from 'motion/react';
import { Sliders, Aperture, Focus, CheckCircle2, RotateCcw, Sparkles, Award, Eye, ShieldAlert } from 'lucide-react';
import { Language } from '../../types';
import { soundEngine } from '../../utils/audio';
import { directorsQuest } from '../../utils/directorsQuest';

interface LensCalibrationGameProps {
  currentLang: Language;
  directorsCut?: boolean;
}

interface LensChallenge {
  id: string;
  filmTitle: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  targetDistance: number; // in meters (e.g. 1.2)
  targetAperture: number; // f-stop (e.g. 1.8)
  subjectDistanceLabel: string;
  sampleImg: string;
  lessonEn: string;
  lessonBn: string;
}

const LENS_CHALLENGES: LensChallenge[] = [
  {
    id: 'challenge-1',
    filmTitle: 'AUTOPSY (2024)',
    titleEn: 'Intimate Psychological Monologue',
    titleBn: 'মনস্তাত্ত্বিক নিঃসঙ্গ ক্লোজ-আপ',
    descriptionEn: 'The forensic surgeon speaks in whispers. Align the focus to 1.2m and open the iris to f/1.8 for shallow cinematic bokeh.',
    descriptionBn: 'ফরেনসিক চিকিৎসকের চোখের আবেগ ফুটিয়ে তুলতে ফোকাস ১.২ মিটারে এবং অ্যাপারচার f/1.8-এ এনে ব্যাকগ্রাউন্ড ব্লার করুন।',
    targetDistance: 1.2,
    targetAperture: 1.8,
    subjectDistanceLabel: '1.2 METERS',
    sampleImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
    lessonEn: 'Shallow Depth of Field (f/1.4 - f/2.0) isolates human vulnerability by obliterating surrounding background distractions.',
    lessonBn: 'শ্যালোর ডেপথ-অব-ফিল্ড (f/১.৪ - f/২.০) ব্যাকগ্রাউন্ডকে নরম করে দর্শকের সমস্ত মনোযোগ চরিত্রের চোখের অভিব্যক্তিতে ধরে রাখে।',
  },
  {
    id: 'challenge-2',
    filmTitle: 'FLOW : THE MYST (FILM 02)',
    titleEn: 'Hyperfocal Deep Focus Forest',
    titleBn: 'গভীর অরণ্যের হাইপারফোকাল শার্পনেস',
    descriptionEn: 'Mist rolls between distant trees and foreground roots. Set focus to 5.0m and stop down the aperture to f/8.0 for edge-to-edge sharpness.',
    descriptionBn: 'সামনের গাছের গুঁড়ি থেকে পেছনের কুয়াশাচ্ছন্ন অরণ্য সবটাই স্পষ্ট দেখতে ফোকাস ৫.০ মিটারে এবং অ্যাপারচার f/8.0-এ ক্যালিব্রেট করুন।',
    targetDistance: 5.0,
    targetAperture: 8.0,
    subjectDistanceLabel: '5.0 METERS',
    sampleImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    lessonEn: 'Deep Focus (f/8 - f/11) expands depth of field, keeping both foreground characters and environment simultaneously in focus.',
    lessonBn: 'ডিপ ফোকাস (f/৮ - f/১১) ফ্রেমের সামনের ও পেছনের সব উপাদানকে সমান স্পষ্ট রেখে পরিবেশের বিশালতা ফুটিয়ে তোলে।',
  },
  {
    id: 'challenge-3',
    filmTitle: 'LOST (FILM 07)',
    titleEn: 'Analog Cassette Macro Insert',
    titleBn: 'অ্যানালগ ক্যাসেট ফোরেন্সিক ম্যাক্রো ইনসার্ট',
    descriptionEn: 'A crucial audio confession tape. Calibrate extreme close-up focus to 0.5m with wide-open f/1.4 for razor-thin sharpness on the magnetic ribbon.',
    descriptionBn: 'ক্যাসেটের ঘূর্ণায়মান ফিতার ওপর ফোকাস করতে লেন্স ০.৫ মিটারে এবং চরম খোলা অ্যাপারচার f/1.4-এ সেট করুন।',
    targetDistance: 0.5,
    targetAperture: 1.4,
    subjectDistanceLabel: '0.5 METERS (MACRO)',
    sampleImg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    lessonEn: 'Macro focus requires sub-millimeter precision; at f/1.4 the depth of field is paper-thin (mere millimeters).',
    lessonBn: 'ম্যাক্রো শটে f/১.৪ অ্যাপারচারে ফোকাসের গভীরতা কাগজের মতো পাতলা হয়; সামান্য নড়লেই ফ্রেম ব্লার হয়ে যায়।',
  },
];

const APERTURE_STOPS = [1.4, 1.8, 2.8, 4.0, 5.6, 8.0, 11.0, 16.0];
const FOCUS_STOPS = [0.5, 0.8, 1.2, 2.0, 3.5, 5.0, 10.0, 20.0];

export function LensCalibrationGame({ currentLang, directorsCut }: LensCalibrationGameProps) {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const currentChallenge = LENS_CHALLENGES[challengeIdx];
  const isBn = currentLang === 'bn';

  // User lens settings
  const [focusDist, setFocusDist] = useState(2.0); // meters
  const [aperture, setAperture] = useState(4.0); // f-stop
  const [focusPeaking, setFocusPeaking] = useState(true);
  const [calibrated, setCalibrated] = useState<boolean | null>(null);

  // Depth of field calculation simulation
  const distDiff = Math.abs(focusDist - currentChallenge.targetDistance);
  const apDiff = Math.abs(aperture - currentChallenge.targetAperture);

  // Acceptable tolerance
  const isFocusSharp = distDiff <= 0.35;
  const isApertureAccurate = apDiff <= 0.8;
  const isPerfect = isFocusSharp && isApertureAccurate;

  // Visual Blur Calculation
  const opticalBlur = Math.max(0, Math.min(24, distDiff * 8 * (2.8 / aperture)));
  const bokehStrength = (1.4 / aperture) * 15;

  const testCalibration = () => {
    soundEngine.playShutter();
    if (isPerfect) {
      soundEngine.playSuccess();
      setCalibrated(true);
      directorsQuest.unlockBadge('badge-lens');
    } else {
      setCalibrated(false);
    }
  };

  const nextChallenge = () => {
    soundEngine.playClick();
    setChallengeIdx((prev) => (prev + 1) % LENS_CHALLENGES.length);
    setCalibrated(null);
  };

  return (
    <div className="space-y-6 font-mono-film">
      {/* Briefing Header */}
      <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>{isBn ? 'সিনেমা লেন্স ক্যালিব্রেশন ও ডেপথ-অব-ফিল্ড মিনি-গেম' : 'CINEMA LENS CALIBRATION & DoF SIMULATOR'}</span>
          </div>
          <span className="text-[10px] text-amber-400 px-2.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">
            {currentChallenge.filmTitle}
          </span>
        </div>
        <p className="text-xs text-neutral-300">
          {isBn ? currentChallenge.descriptionBn : currentChallenge.descriptionEn}
        </p>
      </div>

      {/* Main Optical Viewfinder Display */}
      <div className="relative aspect-[2.35/1] w-full max-h-[380px] rounded-2xl overflow-hidden bg-black border border-cyan-500/40 shadow-2xl flex items-center justify-center">
        {/* Sample Scene Image with Dynamic Blur & Bokeh */}
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={currentChallenge.sampleImg}
            alt="Optical Calibration Target"
            style={{
              filter: `blur(${opticalBlur}px) contrast(${100 + (aperture > 5.6 ? 20 : 5)}%)`,
            }}
            className="w-full h-full object-cover transition-all duration-300"
          />

          {/* Simulated Focus Peaking Overlay (Cyan/Green edges when in sharp focus) */}
          {focusPeaking && isFocusSharp && (
            <div className="absolute inset-0 pointer-events-none border-2 border-emerald-400/40 shadow-[inset_0_0_20px_rgba(52,211,153,0.3)] flex items-center justify-center">
              <span className="text-emerald-400 text-[10px] font-bold tracking-widest uppercase bg-black/80 px-2 py-0.5 rounded border border-emerald-500/50">
                PEAKING: IN-FOCUS
              </span>
            </div>
          )}

          {/* Bokeh discs simulator in background */}
          {aperture <= 2.8 && (
            <div
              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
              style={{
                background: `radial-gradient(circle at 75% 30%, rgba(56,189,248,0.4) 0%, transparent ${bokehStrength}%), radial-gradient(circle at 25% 70%, rgba(251,191,36,0.3) 0%, transparent ${bokehStrength}%)`,
              }}
            />
          )}
        </div>

        {/* Viewfinder Telemetry HUD */}
        <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 rounded border border-neutral-800 text-[9px] text-cyan-400 font-bold tracking-widest backdrop-blur-sm">
          TARGET SUBJECT DISTANCE: {currentChallenge.subjectDistanceLabel}
        </div>

        <div className="absolute top-3 right-3 bg-black/80 px-2.5 py-1 rounded border border-neutral-800 text-[9px] text-amber-400 font-bold tracking-widest backdrop-blur-sm">
          CURRENT: {focusDist}m • f/{aperture}
        </div>

        {/* Optical Sharpness Evaluation Banner */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <div className="bg-black/85 px-3 py-1.5 rounded-lg border border-neutral-800 text-[10px] font-mono text-neutral-300">
            <span>{isBn ? 'অপটিক্যাল ব্লার:' : 'BLUR INDEX:'} </span>
            <span className={opticalBlur < 2 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {opticalBlur < 1 ? '0.0px (RAZOR SHARP)' : `${opticalBlur.toFixed(1)}px`}
            </span>
          </div>

          {calibrated === true && (
            <div className="bg-emerald-950/90 border border-emerald-500/80 px-4 py-1.5 rounded-lg text-emerald-300 text-xs font-bold tracking-wider flex items-center gap-2 animate-pulse shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isBn ? 'লেন্স ক্যালিব্রেশন সফল!' : 'CALIBRATION LOCKED // 100% SHARP'}</span>
            </div>
          )}

          {calibrated === false && (
            <div className="bg-rose-950/90 border border-rose-500/80 px-4 py-1.5 rounded-lg text-rose-300 text-xs font-bold tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>{isBn ? 'ফ্রেম ব্লার! ফোকাস বা অ্যাপারচার সমন্বয় করুন।' : 'OUT OF FOCUS // ADJUST RINGS'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Virtual Cinema Prime Lens Barrel Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ring 1: Focus Distance Ring */}
        <div className="p-4 rounded-xl bg-[#070b14] border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Focus className="w-3.5 h-3.5" />
              <span>{isBn ? '১. ফোকাস রিং (মিটার)' : '1. FOCUS RING (METERS)'}</span>
            </span>
            <span className="text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded border border-neutral-800">
              {focusDist}m
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {FOCUS_STOPS.map((dist) => (
              <button
                key={dist}
                onClick={() => {
                  soundEngine.playClick();
                  setFocusDist(dist);
                  setCalibrated(null);
                }}
                className={`py-2 rounded text-center text-xs font-bold transition-all ${
                  focusDist === dist
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {dist}m
              </button>
            ))}
          </div>

          <p className="text-[10px] text-neutral-400">
            {isBn
              ? 'চরিত্র বা বস্তুটি ক্যামেরা থেকে যে দূরত্বে আছে ঠিক সেই দূরত্বে ফোকাস রিং সেট করুন।'
              : 'Match the focus ring precisely to the physical distance between lens and subject.'}
          </p>
        </div>

        {/* Ring 2: Aperture / Iris Ring */}
        <div className="p-4 rounded-xl bg-[#070b14] border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Aperture className="w-3.5 h-3.5" />
              <span>{isBn ? '২. অ্যাপারচার / আইরিস রিং (f-স্টপ)' : '2. APERTURE IRIS (f-STOP)'}</span>
            </span>
            <span className="text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded border border-neutral-800">
              f/{aperture}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {APERTURE_STOPS.map((fStop) => (
              <button
                key={fStop}
                onClick={() => {
                  soundEngine.playClick();
                  setAperture(fStop);
                  setCalibrated(null);
                }}
                className={`py-2 rounded text-center text-xs font-bold transition-all ${
                  aperture === fStop
                    ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                f/{fStop}
              </button>
            ))}
          </div>

          <p className="text-[10px] text-neutral-400">
            {isBn
              ? 'ছোট সংখ্যা (f/1.4 - f/2.0) = ব্যাকগ্রাউন্ড ব্লার (Shallow DoF); বড় সংখ্যা (f/8 - f/11) = সব স্পষ্ট (Deep Focus)।'
              : 'Low f-number (f/1.4) yields creamy background blur; High f-number (f/8) yields sharp deep focus.'}
          </p>
        </div>
      </div>

      {/* Optical Theory Lesson Box */}
      <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200">
        <span className="font-bold text-cyan-400 block mb-1">
          {isBn ? 'সিনেমাটোগ্রাফি পাঠ // অপটিক্যাল তত্ত্ব:' : 'CINEMATOGRAPHY LESSON // OPTICAL THEORY:'}
        </span>
        <p className="text-neutral-300 text-[11px] leading-relaxed">
          {isBn ? currentChallenge.lessonBn : currentChallenge.lessonEn}
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            onClick={testCalibration}
            data-cursor="CALIBRATE"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <Sliders className="w-4 h-4" />
            <span>{isBn ? 'ক্যালিব্রেশন পরীক্ষা করুন' : 'VERIFY OPTICAL CALIBRATION'}</span>
          </button>

          <button
            onClick={() => setFocusPeaking(!focusPeaking)}
            className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
              focusPeaking
                ? 'bg-cyan-950 border-cyan-500/60 text-cyan-300'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400'
            }`}
          >
            {focusPeaking ? 'PEAKING: ON' : 'PEAKING: OFF'}
          </button>
        </div>

        <button
          onClick={nextChallenge}
          className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors"
        >
          {isBn ? 'পরবর্তী লেন্স অ্যাসাইনমেন্ট →' : 'NEXT LENS SCENARIO →'}
        </button>
      </div>
    </div>
  );
}
