import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gamepad2,
  Aperture,
  Clapperboard,
  Palette,
  Trophy,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Camera,
  Play,
  Share2,
  Volume2,
  Sliders,
  Maximize2,
  Film,
  Zap,
  BookOpen,
  FileText,
  Lightbulb,
  Compass,
  Sun,
} from 'lucide-react';
import { Language } from '../types';
import { soundEngine } from '../utils/audio';
import { StoryConceptGame } from './games/StoryConceptGame';
import { StoryBeatGame } from './games/StoryBeatGame';
import { ScreenplayGame } from './games/ScreenplayGame';
import { DirectorBlockingGame } from './games/DirectorBlockingGame';
import { CameraFramingGame } from './games/CameraFramingGame';
import { StoryboardBuilderGame } from './games/StoryboardBuilderGame';
import { LensCalibrationGame } from './games/LensCalibrationGame';
import { LightingSetupGame } from './games/LightingSetupGame';
import { DirectorsQuestDrawer } from './DirectorsQuestDrawer';
import { directorsQuest, QuestState } from '../utils/directorsQuest';

interface FilmMakerArcadeProps {
  currentLang: Language;
  directorsCut?: boolean;
}

type ActiveGame =
  | 'concept'
  | 'storyboard-beat'
  | 'screenplay'
  | 'direction'
  | 'framing'
  | 'lens-calib'
  | 'lighting'
  | 'storyboard'
  | 'focus'
  | 'color'
  | 'clapper';

// Preset target scenes for Game 1: Focus & Exposure Challenge
interface FocusTargetScene {
  id: string;
  title: { en: string; bn: string };
  directorPrompt: { en: string; bn: string };
  targetFocus: number; // 0.5 to 10.0 meters
  targetAperture: number; // 1.2 to 16.0
  targetIso: number; // 100 to 3200
  targetKelvin: number; // 2800 to 7000
  image: string;
}

const FOCUS_SCENES: FocusTargetScene[] = [
  {
    id: 'rain-alley',
    title: {
      en: 'Rainy Alleyway Noir (From "Shadow")',
      bn: 'বৃষ্টিস্নাত গলির নোয়ার দৃশ্য ("ছায়া" থেকে)',
    },
    directorPrompt: {
      en: 'Pull focus to the drenched protagonist at 2.5m, open wide at f/1.4 for deep background blur, set 3200K Tungsten tone.',
      bn: '২.৫ মিটার দূরত্বে থাকা নায়কের ওপর ফোকাস নিন, f/১.৪ অ্যাপারচারে ব্যাকগ্রাউন্ড ব্লার করুন এবং ৩২০০K টাংস্টেন টোন দিন।',
    },
    targetFocus: 2.5,
    targetAperture: 1.4,
    targetIso: 800,
    targetKelvin: 3200,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'cyber-neon',
    title: {
      en: 'Underground Corridor (From "Autopsy")',
      bn: 'ভূগর্ভস্থ করিডোর ("অটোপসি" থেকে)',
    },
    directorPrompt: {
      en: 'Medium close-up at 1.8m, razor-sharp shallow f/1.8, ISO 1600 for moody sensor grain, cool 6000K cyan moonlight.',
      bn: '১.৮ মিটার দূরত্বে ক্লোজ-আপ, f/১.৮ অ্যাপারচার, ১৬০০ আইএসও এবং ৬০০০K শীতল সায়ান চাঁদের আলো ম্যাচ করুন।',
    },
    targetFocus: 1.8,
    targetAperture: 1.8,
    targetIso: 1600,
    targetKelvin: 6000,
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'myst-lake',
    title: {
      en: 'Ethereal Dawn Lake (From "Flow: The Myst")',
      bn: 'রহস্যময় ভোরের হ্রদ ("ফ্লো: দ্য মিস্ট" থেকে)',
    },
    directorPrompt: {
      en: 'Deep landscape focus at 8.0m, stop down to f/5.6 for crisp ripples, pristine ISO 200, warm golden 4500K dawn light.',
      bn: '৮.০ মিটার দূরবর্তী ল্যান্ডস্কেপ ফোকাস, নিখুঁত তরঙ্গের জন্য f/৫.৬, পরিষ্কার ২০০ আইএসও এবং ৪৫০০K ভোরের আলো দিন।',
    },
    targetFocus: 8.0,
    targetAperture: 5.6,
    targetIso: 200,
    targetKelvin: 4500,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
  },
];

// Preset target grades for Game 3: Color Grading Match
interface ColorGradeTarget {
  id: string;
  film: string;
  name: { en: string; bn: string };
  targetLift: number; // -50 to 50 (Shadows cold/warm)
  targetGain: number; // -50 to 50 (Highlights cyan/amber)
  targetContrast: number; // 80 to 180 (%)
  targetSat: number; // 40 to 160 (%)
  referenceImg: string;
}

const COLOR_TARGETS: ColorGradeTarget[] = [
  {
    id: 'autopsy-cyan',
    film: 'AUTOPSY (2024)',
    name: {
      en: 'Clinical Abyssal Teal',
      bn: 'ক্লিনিক্যাল অ্যাবিসাল সায়ান',
    },
    targetLift: -35,
    targetGain: 20,
    targetContrast: 140,
    targetSat: 70,
    referenceImg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'shadow-noir',
    film: 'SHADOW (2023)',
    name: {
      en: 'Bleach Bypass Noir',
      bn: 'ব্লিচ বাইপাস ডার্ক নোয়ার',
    },
    targetLift: -45,
    targetGain: -20,
    targetContrast: 165,
    targetSat: 45,
    referenceImg: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'reflect-gold',
    film: 'REFLECT (2023)',
    name: {
      en: 'Golden Hour Melancholia',
      bn: 'গোল্ডেন আওয়ার বিষাদময়তা',
    },
    targetLift: 25,
    targetGain: 35,
    targetContrast: 115,
    targetSat: 110,
    referenceImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
  },
];

export function FilmMakerArcade({ currentLang, directorsCut = false }: FilmMakerArcadeProps) {
  const [activeGame, setActiveGame] = useState<ActiveGame>('concept');
  const [totalArcadeScore, setTotalArcadeScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zeehad_cine_arcade_score');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  const [bestStreak, setBestStreak] = useState<number>(0);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [questDrawerOpen, setQuestDrawerOpen] = useState(false);
  const [questState, setQuestState] = useState<QuestState>(directorsQuest.getState());

  useEffect(() => {
    return directorsQuest.subscribe((state) => {
      setQuestState({ ...state });
    });
  }, []);

  // Save score to local storage
  const addScore = (points: number) => {
    setTotalArcadeScore((prev) => {
      const updated = prev + points;
      if (typeof window !== 'undefined') {
        localStorage.setItem('zeehad_cine_arcade_score', updated.toString());
      }
      return updated;
    });
  };

  /* =========================================================================
     GAME 1: RACK FOCUS & EXPOSURE CHALLENGE STATE
     ========================================================================= */
  const [sceneIndex, setSceneIndex] = useState(0);
  const currentScene = FOCUS_SCENES[sceneIndex % FOCUS_SCENES.length];

  // User camera controls
  const [focusVal, setFocusVal] = useState(4.0); // meters
  const [apertureVal, setApertureVal] = useState(4.0); // f-stop
  const [isoVal, setIsoVal] = useState(800);
  const [kelvinVal, setKelvinVal] = useState(5000);
  const [focusResult, setFocusResult] = useState<{
    score: number;
    accuracy: number;
    verdict: string;
    show: boolean;
  } | null>(null);

  // Calculate live optical blur & look for preview
  const focusDiff = Math.abs(focusVal - currentScene.targetFocus);
  const blurAmount = Math.max(0, Math.min(18, focusDiff * 3.5 * (2.8 / apertureVal)));
  const exposureBrightness = Math.max(0.4, Math.min(1.7, (isoVal / currentScene.targetIso) * (currentScene.targetAperture / apertureVal)));
  const kelvinHueShift = ((kelvinVal - 5000) / 3000) * 20; // warm or cool tint

  const handleCaptureFocus = () => {
    soundEngine.playShutter();

    // Accuracy calculation
    const focusAcc = Math.max(0, 100 - Math.abs(focusVal - currentScene.targetFocus) * 22);
    const apertureAcc = Math.max(0, 100 - Math.abs(apertureVal - currentScene.targetAperture) * 15);
    const isoAcc = Math.max(0, 100 - (Math.abs(isoVal - currentScene.targetIso) / currentScene.targetIso) * 60);
    const kelvinAcc = Math.max(0, 100 - (Math.abs(kelvinVal - currentScene.targetKelvin) / 3000) * 60);

    const totalAccuracy = Math.round((focusAcc * 0.4 + apertureAcc * 0.25 + isoAcc * 0.2 + kelvinAcc * 0.15));
    const awarded = Math.round(totalAccuracy * 6);

    let verdict = 'Director: "Take acceptable, but needs sharper pull."';
    if (totalAccuracy >= 92) {
      verdict = 'Director Zeehad Haque: "MASTERPIECE! Razor-sharp focus and sublime lighting ratio!"';
      soundEngine.playSuccess();
      directorsQuest.unlockBadge('badge-focus');
    } else if (totalAccuracy >= 75) {
      verdict = 'Director: "Solid rack focus! The shallow depth of field holds beautifully."';
      soundEngine.playSuccess();
      directorsQuest.unlockBadge('badge-focus');
    } else {
      verdict = 'Director: "Soft focus! The anamorphic falloff was missed. Reset for Take 2."';
    }

    setFocusResult({
      score: awarded,
      accuracy: totalAccuracy,
      verdict,
      show: true,
    });
    addScore(awarded);
    setBestStreak((s) => s + 1);
  };

  const handleNextFocusScene = () => {
    soundEngine.playClick();
    setFocusResult(null);
    setSceneIndex((i) => i + 1);
    // slight randomize initial user controls
    setFocusVal(3.5);
    setApertureVal(2.8);
    setIsoVal(640);
    setKelvinVal(4800);
  };

  /* =========================================================================
     GAME 2: 24 FPS CLAPPERBOARD TIMING RUSH STATE
     ========================================================================= */
  const [clapperState, setClapperState] = useState<'idle' | 'running' | 'snapped'>('idle');
  const [clapperTake, setClapperTake] = useState(1);
  const [clapperScore, setClapperScore] = useState(0);
  const [clapperDelta, setClapperDelta] = useState<number | null>(null);
  const [clapperFeedback, setClapperFeedback] = useState<string>('');
  const [clapperArmAngle, setClapperArmAngle] = useState(-28); // open
  const targetTimeRef = useRef<number>(0);
  const clapperStartTimeRef = useRef<number>(0);
  const clapperTimerRef = useRef<number | null>(null);
  const [clapperProgress, setClapperProgress] = useState(0);

  const startClapperRun = () => {
    soundEngine.playClick();
    setClapperState('running');
    setClapperArmAngle(-28);
    setClapperDelta(null);
    setClapperFeedback('STAND BY... ROLLING SOUND... SPEED!');
    setClapperProgress(0);

    const now = performance.now();
    // Clapper sync marker hits at random 1.8s to 2.4s
    const runDuration = 2000 + Math.random() * 400;
    clapperStartTimeRef.current = now;
    targetTimeRef.current = now + runDuration;

    if (clapperTimerRef.current) cancelAnimationFrame(clapperTimerRef.current);

    const updateFrame = () => {
      const current = performance.now();
      const elapsed = current - clapperStartTimeRef.current;
      const pct = Math.min(100, (elapsed / runDuration) * 100);
      setClapperProgress(pct);

      if (elapsed < runDuration + 400) {
        clapperTimerRef.current = requestAnimationFrame(updateFrame);
      } else {
        // Time out / missed
        setClapperState('snapped');
        setClapperFeedback('MISSED SYNC! Director: "Cut! Reset the slate!"');
      }
    };

    clapperTimerRef.current = requestAnimationFrame(updateFrame);
  };

  const handleSnapClapper = () => {
    if (clapperState !== 'running') return;
    if (clapperTimerRef.current) cancelAnimationFrame(clapperTimerRef.current);

    soundEngine.playClapper();
    setClapperArmAngle(0); // snapped shut
    setClapperState('snapped');

    const clickTime = performance.now();
    const diffMs = Math.round(clickTime - targetTimeRef.current);
    setClapperDelta(diffMs);

    // Evaluate accuracy: 1 frame at 24fps = ~41.6ms
    const absDiff = Math.abs(diffMs);
    let pts = 0;
    let text = '';

    if (absDiff <= 42) {
      pts = 650;
      text = 'FRAME ACCURATE! EXACT 24FPS SYNC! (0-1 frame delta)';
      soundEngine.playSuccess();
      directorsQuest.unlockBadge('badge-clapper');
    } else if (absDiff <= 95) {
      pts = 400;
      text = 'GREAT SLATE! Sync wave locked with audio recorder.';
      soundEngine.playSuccess();
      directorsQuest.unlockBadge('badge-clapper');
    } else if (absDiff <= 170) {
      pts = 200;
      text = 'ACCEPTABLE CUT! 2 frames off sync.';
    } else {
      pts = 50;
      text = 'OFF-BEAT! Clapper struck off the audio sync beep.';
    }

    setClapperFeedback(text);
    setClapperScore((s) => s + pts);
    addScore(pts);
    setClapperTake((t) => t + 1);
  };

  useEffect(() => {
    return () => {
      if (clapperTimerRef.current) cancelAnimationFrame(clapperTimerRef.current);
    };
  }, []);

  /* =========================================================================
     GAME 3: COLORIST LUT GRADING SUITE STATE
     ========================================================================= */
  const [colorIndex, setColorIndex] = useState(0);
  const currentColorTarget = COLOR_TARGETS[colorIndex % COLOR_TARGETS.length];

  const [userLift, setUserLift] = useState(0); // Shadows
  const [userGain, setUserGain] = useState(0); // Highlights
  const [userContrast, setUserContrast] = useState(100);
  const [userSat, setUserSat] = useState(100);
  const [colorResult, setColorResult] = useState<{
    score: number;
    match: number;
    badge: string;
  } | null>(null);

  const handleEvaluateGrade = () => {
    soundEngine.playClick();
    const liftDiff = Math.abs(userLift - currentColorTarget.targetLift);
    const gainDiff = Math.abs(userGain - currentColorTarget.targetGain);
    const contrastDiff = Math.abs(userContrast - currentColorTarget.targetContrast);
    const satDiff = Math.abs(userSat - currentColorTarget.targetSat);

    const liftScore = Math.max(0, 100 - liftDiff * 1.5);
    const gainScore = Math.max(0, 100 - gainDiff * 1.5);
    const contrastScore = Math.max(0, 100 - contrastDiff * 1.2);
    const satScore = Math.max(0, 100 - satDiff * 1.2);

    const finalMatch = Math.round(
      (liftScore * 0.3 + gainScore * 0.3 + contrastScore * 0.2 + satScore * 0.2)
    );
    const points = Math.round(finalMatch * 7);

    let badge = 'Colorist Intern';
    if (finalMatch >= 92) {
      badge = 'Senior Auteur Colorist (LUT Master)';
      soundEngine.playSuccess();
      directorsQuest.unlockBadge('badge-color');
    } else if (finalMatch >= 78) {
      badge = 'Feature Film Finishing Colorist';
      soundEngine.playSuccess();
      directorsQuest.unlockBadge('badge-color');
    } else if (finalMatch >= 60) {
      badge = 'Dailies Color Technician';
    }

    setColorResult({
      score: points,
      match: finalMatch,
      badge,
    });
    addScore(points);
  };

  const handleNextColorTarget = () => {
    soundEngine.playClick();
    setColorResult(null);
    setColorIndex((c) => c + 1);
    setUserLift(0);
    setUserGain(0);
    setUserContrast(100);
    setUserSat(100);
  };

  // Share score
  const handleShareScore = () => {
    soundEngine.playClick();
    const text = `🎬 My Filmmaker CineScore: ${totalArcadeScore} PTS on Zeehad Haque's Portfolio Arcade! Can you rack focus at f/1.4 and sync at 24fps?`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setShareFeedback(currentLang === 'bn' ? 'স্কোর কপি করা হয়েছে!' : 'Score copied to clipboard!');
      setTimeout(() => setShareFeedback(null), 3000);
    }
  };

  // Reset local score
  const handleResetScore = () => {
    soundEngine.playClick();
    setTotalArcadeScore(0);
    localStorage.removeItem('zeehad_cine_arcade_score');
  };

  return (
    <section
      id="arcade"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-12 z-10 border-t border-white/5 bg-[#020305] overflow-hidden"
    >
      {/* Background Volumetric Glow */}

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono-film text-xs text-cyan-400 tracking-[0.3em] uppercase">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span>CHAPTER 04 // INDIE FILMMAKER AUTEUR ARCADE</span>
            </div>

            <h2 className="font-cinematic text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-[0.12em]">
              {currentLang === 'bn' ? 'পরিচালকের আর্কেড ও কুয়েস্ট' : "THE DIRECTOR'S ARCADE"}
            </h2>

            <p className="mt-3 max-w-2xl font-mono-film text-xs sm:text-sm text-neutral-400 tracking-wider">
              {currentLang === 'bn'
                ? 'ইন্ডিপেন্ডেন্ট ফিল্মমেকার হিসেবে চলচ্চিত্র নির্মাণের সম্পূর্ণ পাইপলাইন আয়ত্ত করুন: গল্প ভাবনা, চিত্রনাট্য, ব্লকিং, ফ্রেমিং, লেন্স ক্যালিব্রেশন, থ্রি-পয়েন্ট লাইটিং ও স্টোরিবোর্ড তৈরি করে অনন্য সিনেমা ব্যাজ অর্জন করুন।'
                : 'Master the independent auteur pipeline from story seeds to color grading. Level up your Director Rank, solve framing & lighting puzzles, build shot sequences, and unlock all 11 Cinema Badges.'}
            </p>
          </div>

          {/* Right Top Status HUD: Director's Quest Rank & Score */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Quest Rank Pill */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setQuestDrawerOpen(true);
              }}
              className="flex items-center gap-2.5 bg-gradient-to-r from-neutral-950 via-neutral-900 to-[#0a1224] border border-cyan-500/40 hover:border-cyan-400 px-3.5 py-2.5 rounded-2xl shadow-xl transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-left font-mono-film">
                <div className="text-[9px] text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                  <span>{currentLang === 'bn' ? 'ডিরেক্টরস কোয়েস্ট' : "DIRECTOR'S QUEST"}</span>
                  <span className="text-amber-400">• {questState.unlockedBadgeIds.length}/11 BADGES</span>
                </div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  {currentLang === 'bn'
                    ? directorsQuest.getCurrentRank().titleBn
                    : directorsQuest.getCurrentRank().titleEn}
                </div>
              </div>
            </button>

            {/* Arcade CineScore Bar */}
            <div className="flex items-center gap-3 bg-neutral-950/80 border border-neutral-800/90 p-2.5 sm:p-3 rounded-2xl shadow-xl font-mono-film">
              <div className="pl-1">
                <div className="text-[9px] text-neutral-400 uppercase tracking-wider">
                  {currentLang === 'bn' ? 'স্কোর' : 'SCORE'}
                </div>
                <div className="font-cinematic text-lg sm:text-xl font-bold text-amber-300">
                  {totalArcadeScore.toLocaleString()} <span className="text-[10px] text-neutral-400">PTS</span>
                </div>
              </div>

              <div className="h-7 w-[1px] bg-neutral-800" />

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleShareScore}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-cyan-500/50 text-cyan-300 text-xs transition-colors"
                  title="Share Score"
                >
                  <Share2 className="w-3 h-3" />
                  <span>{shareFeedback || (currentLang === 'bn' ? 'শেয়ার' : 'SHARE')}</span>
                </button>

                {totalArcadeScore > 0 && (
                  <button
                    type="button"
                    onClick={handleResetScore}
                    className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-500 hover:text-white transition-colors"
                    title="Reset Score"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Game Mode Selector Tabs (All 11 Modules) */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-between text-[10px] font-mono-film text-cyan-400 font-bold uppercase tracking-widest flex-wrap gap-2">
            <span>AUTEUR FILMMAKING PIPELINE // SELECT MODULE:</span>
            <button
              onClick={() => {
                soundEngine.playClick();
                setQuestDrawerOpen(true);
              }}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 underline decoration-amber-400/40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentLang === 'bn' ? 'সকল সিনেমা ব্যাজ ও সার্টিফিকেট দেখুন →' : 'VIEW CINEMA BADGES & DOSSIER →'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* 1. Concept */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveGame('concept');
              }}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl border font-mono-film text-xs tracking-wider transition-all ${
                activeGame === 'concept'
                  ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300  font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
              <span>1. {currentLang === 'bn' ? 'স্টোরি আইডিয়া' : 'STORY SEEDS'}</span>
            </button>

            {/* 2. Beat Board */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveGame('storyboard-beat');
              }}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl border font-mono-film text-xs tracking-wider transition-all ${
                activeGame === 'storyboard-beat'
                  ? 'border-amber-400 bg-amber-950/60 text-amber-300  font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>2. {currentLang === 'bn' ? '৩-অ্যাক্ট বিটস' : '3-ACT BEATS'}</span>
            </button>

            {/* 3. Screenplay */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveGame('screenplay');
              }}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl border font-mono-film text-xs tracking-wider transition-all ${
                activeGame === 'screenplay'
                  ? 'border-purple-400 bg-purple-950/60 text-purple-300  font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>3. {currentLang === 'bn' ? 'চিত্রনাট্য' : 'SCREENPLAY'}</span>
            </button>

            {/* 4. Direction */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveGame('direction');
              }}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl border font-mono-film text-xs tracking-wider transition-all ${
                activeGame === 'direction'
                  ? 'border-red-400 bg-red-950/60 text-red-300  font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Clapperboard className="w-3.5 h-3.5 text-red-400" />
              <span>4. {currentLang === 'bn' ? 'পরিচালনা ও ব্লকিং' : 'DIRECTION & BLOCKING'}</span>
            </button>

            {/* 5. Camera Framing */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveGame('framing');
              }}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl border font-mono-film text-xs tracking-wider transition-all ${
                activeGame === 'framing'
                  ? 'border-emerald-400 bg-emerald-950/60 text-emerald-300  font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>5. {currentLang === 'bn' ? 'ক্যামেরা ফ্রেমিং' : 'CAMERA FRAMING'}</span>
            </button>

            {/* 6. Lens Calibration (NEW) */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveGame('lens-calib');
              }}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl border font-mono-film text-xs tracking-wider transition-all ${
                activeGame === 'lens-calib'
                  ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300  font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>6. {currentLang === 'bn' ? 'লেন্স ক্যালিব্রেশন' : 'LENS CALIBRATION'}</span>
            </button>

            {/* 7. Lighting Setup (NEW) */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveGame('lighting');
              }}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl border font-mono-film text-xs tracking-wider transition-all ${
                activeGame === 'lighting'
                  ? 'border-amber-400 bg-amber-950/60 text-amber-300  font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>7. {currentLang === 'bn' ? 'থ্রি-পয়েন্ট লাইটিং' : '3-POINT LIGHTING'}</span>
            </button>

            {/* 8. Storyboard Builder (NEW) */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveGame('storyboard');
              }}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl border font-mono-film text-xs tracking-wider transition-all ${
                activeGame === 'storyboard'
                  ? 'border-rose-400 bg-rose-950/60 text-rose-300  font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-rose-400" />
              <span>8. {currentLang === 'bn' ? 'শট লিস্ট ও স্টোরিবোর্ড' : 'STORYBOARD BUILDER'}</span>
            </button>

            {/* 9. Rack Focus */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveGame('focus');
              }}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl border font-mono-film text-xs tracking-wider transition-all ${
                activeGame === 'focus'
                  ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300  font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Aperture className="w-3.5 h-3.5 text-cyan-400" />
              <span>9. {currentLang === 'bn' ? 'র‍্যাক ফোকাস' : 'RACK FOCUS'}</span>
            </button>

            {/* 10. Colorist Suite */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveGame('color');
              }}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl border font-mono-film text-xs tracking-wider transition-all ${
                activeGame === 'color'
                  ? 'border-teal-400 bg-teal-950/60 text-teal-300  font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-teal-400" />
              <span>10. {currentLang === 'bn' ? 'কালার গ্রেডিং' : 'COLORIST LUT'}</span>
            </button>

            {/* 11. Clapper */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveGame('clapper');
              }}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl border font-mono-film text-xs tracking-wider transition-all ${
                activeGame === 'clapper'
                  ? 'border-amber-400 bg-amber-950/60 text-amber-300  font-bold'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>11. {currentLang === 'bn' ? '২৪ এফপিএস ক্লাপার' : '24FPS SLATE'}</span>
            </button>
          </div>
        </div>

        {/* ====================================================================
            FILMMAKING PIPELINE GAMES
            ==================================================================== */}
        {activeGame === 'concept' && (
          <StoryConceptGame currentLang={currentLang} directorsCut={directorsCut} />
        )}

        {activeGame === 'storyboard-beat' && (
          <StoryBeatGame currentLang={currentLang} directorsCut={directorsCut} />
        )}

        {activeGame === 'screenplay' && (
          <ScreenplayGame currentLang={currentLang} directorsCut={directorsCut} />
        )}

        {activeGame === 'direction' && (
          <DirectorBlockingGame currentLang={currentLang} directorsCut={directorsCut} />
        )}

        {activeGame === 'framing' && (
          <CameraFramingGame currentLang={currentLang} directorsCut={directorsCut} />
        )}

        {activeGame === 'lens-calib' && (
          <LensCalibrationGame currentLang={currentLang} directorsCut={directorsCut} />
        )}

        {activeGame === 'lighting' && (
          <LightingSetupGame currentLang={currentLang} directorsCut={directorsCut} />
        )}

        {activeGame === 'storyboard' && (
          <StoryboardBuilderGame currentLang={currentLang} directorsCut={directorsCut} />
        )}

        {/* ====================================================================
            GAME 6: RACK FOCUS & EXPOSURE CHALLENGE
            ==================================================================== */}
        {activeGame === 'focus' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#050917] border border-neutral-800 rounded-3xl p-4 sm:p-7 shadow-2xl">
            {/* Viewfinder Monitor (Left 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-3">
              {/* Top Viewfinder Metadata Telemetry */}
              <div className="flex items-center justify-between font-mono-film text-[11px] text-neutral-400 bg-black/60 px-3 py-1.5 rounded-lg border border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-white font-bold">REC 24FPS</span>
                  <span className="text-neutral-600">|</span>
                  <span className="text-cyan-400">ANAMORPHIC 2.35:1</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span>FOCAL DIST: {focusVal.toFixed(1)}m</span>
                  <span>•</span>
                  <span>f/{apertureVal.toFixed(1)}</span>
                  <span>•</span>
                  <span>ISO {isoVal}</span>
                </div>
              </div>

              {/* Live Simulated Viewfinder Box */}
              <div className="relative aspect-anamorphic w-full bg-black rounded-2xl overflow-hidden border border-neutral-800 shadow-inner group">
                {/* Visual Scene Image with dynamic optical filter */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-150"
                  style={{
                    backgroundImage: `url(${currentScene.image})`,
                    filter: `blur(${blurAmount}px) brightness(${exposureBrightness}) hue-rotate(${kelvinHueShift}deg)`,
                  }}
                />

                {/* Viewfinder Crosshair & Framelines */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Grid Lines */}
                  <div className="w-full h-full border border-white/10 grid grid-cols-3 grid-rows-3">
                    <div className="border-r border-b border-white/5" />
                    <div className="border-r border-b border-white/5" />
                    <div className="border-b border-white/5" />
                    <div className="border-r border-b border-white/5" />
                    <div className="border-r border-b border-white/5" />
                    <div className="border-b border-white/5" />
                    <div className="border-r border-white/5" />
                    <div className="border-r border-white/5" />
                    <div />
                  </div>

                  {/* Center Target Box */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-cyan-400/60 rounded-sm flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>

                  {/* Corner Guides */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/40" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/40" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/40" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/40" />
                </div>

                {/* Focus Peaking simulation indicator */}
                {Math.abs(focusVal - currentScene.targetFocus) < 0.4 && (
                  <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded bg-green-500/90 text-neutral-950 font-mono-film text-[10px] font-bold shadow-lg animate-pulse">
                    FOCUS PEAKING LOCKED [GREEN]
                  </div>
                )}
              </div>

              {/* Director's Scene Briefing Card */}
              <div className="p-3.5 rounded-xl border border-neutral-800 bg-black/40 font-mono-film text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5" />
                    {currentLang === 'bn' ? currentScene.title.bn : currentScene.title.en}
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    SCENE #{sceneIndex + 1}
                  </span>
                </div>
                <p className="text-neutral-300 leading-relaxed italic text-[11px] sm:text-xs">
                  "{currentLang === 'bn' ? currentScene.directorPrompt.bn : currentScene.directorPrompt.en}"
                </p>
              </div>
            </div>

            {/* Camera Operator Rig Sliders (Right 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs font-mono-film">
                  <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    OPTICAL RIG CONTROLS
                  </span>
                  <span className="text-neutral-400 text-[10px]">TWEAK TO MATCH BRIEF</span>
                </div>

                {/* 1. Focal Distance (Focus Puller) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono-film">
                    <span className="text-neutral-300">1. FOCUS PULLER DISTANCE</span>
                    <span className="text-cyan-400 font-bold">{focusVal.toFixed(1)} METERS</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10.0"
                    step="0.1"
                    value={focusVal}
                    onChange={(e) => {
                      setFocusVal(parseFloat(e.target.value));
                      soundEngine.playClick();
                    }}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono-film text-neutral-500">
                    <span>Macro (0.5m)</span>
                    <span>Portrait (2.5m)</span>
                    <span>Infinity (10m)</span>
                  </div>
                </div>

                {/* 2. Aperture f-stop */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono-film">
                    <span className="text-neutral-300">2. APERTURE IRIS (DEPTH OF FIELD)</span>
                    <span className="text-amber-400 font-bold">f/{apertureVal.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.2"
                    max="16.0"
                    step="0.2"
                    value={apertureVal}
                    onChange={(e) => {
                      setApertureVal(parseFloat(e.target.value));
                      soundEngine.playClick();
                    }}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono-film text-neutral-500">
                    <span>f/1.2 (Creamy Bokeh)</span>
                    <span>f/4.0</span>
                    <span>f/16 (Deep Focus)</span>
                  </div>
                </div>

                {/* 3. ISO Sensitivity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono-film">
                    <span className="text-neutral-300">3. SENSOR SENSITIVITY (ISO)</span>
                    <span className="text-teal-400 font-bold">ISO {isoVal}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="3200"
                    step="100"
                    value={isoVal}
                    onChange={(e) => {
                      setIsoVal(parseInt(e.target.value, 10));
                      soundEngine.playClick();
                    }}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono-film text-neutral-500">
                    <span>ISO 100 (Clean)</span>
                    <span>ISO 800</span>
                    <span>ISO 3200 (Gritty)</span>
                  </div>
                </div>

                {/* 4. White Balance Kelvin */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono-film">
                    <span className="text-neutral-300">4. WHITE BALANCE (KELVIN)</span>
                    <span className="text-blue-300 font-bold">{kelvinVal}K</span>
                  </div>
                  <input
                    type="range"
                    min="2800"
                    max="7500"
                    step="100"
                    value={kelvinVal}
                    onChange={(e) => {
                      setKelvinVal(parseInt(e.target.value, 10));
                      soundEngine.playClick();
                    }}
                    className="w-full accent-blue-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono-film text-neutral-500">
                    <span>2800K (Tungsten Warm)</span>
                    <span>5000K (Daylight)</span>
                    <span>7500K (Icy Cyan)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Results */}
              <div className="space-y-3 pt-4 border-t border-neutral-800">
                {!focusResult ? (
                  <button
                    type="button"
                    onClick={handleCaptureFocus}
                    className="w-full py-3.5 px-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-cinematic font-bold text-sm tracking-[0.2em] uppercase transition-all  flex items-center justify-center gap-2 group"
                  >
                    <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{currentLang === 'bn' ? 'শট ক্যাপচার ও লক করুন' : 'CAPTURE FRAME // LOCK SHOT'}</span>
                  </button>
                ) : (
                  <div className="space-y-3 p-4 rounded-2xl bg-neutral-950 border border-cyan-500/40 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                        <span className="font-cinematic text-lg font-bold text-white">
                          ACCURACY: {focusResult.accuracy}%
                        </span>
                      </div>
                      <span className="font-cinematic text-amber-300 font-bold text-base">
                        +{focusResult.score} PTS
                      </span>
                    </div>

                    <p className="text-xs font-mono-film text-neutral-300 leading-relaxed italic border-l-2 border-cyan-400 pl-2">
                      {focusResult.verdict}
                    </p>

                    <button
                      type="button"
                      onClick={handleNextFocusScene}
                      className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-cyan-300 font-mono-film text-xs font-bold tracking-wider transition-colors"
                    >
                      {currentLang === 'bn' ? 'পরবর্তী দৃশ্য শুরু করুন →' : 'NEXT SCENE TAKE →'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            GAME 2: 24 FPS CLAPPERBOARD TIMING RUSH
            ==================================================================== */}
        {activeGame === 'clapper' && (
          <div className="bg-[#050917] border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto text-center space-y-8">
            {/* Clapperboard Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono-film mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SOUND ROLL: 24 FRAMES / SEC TIMING GATE</span>
              </div>
              <h3 className="font-cinematic text-2xl sm:text-4xl font-bold uppercase text-white tracking-wider">
                {currentLang === 'bn' ? '২৪ এফপিএস ক্লাপারবোর্ড রিফ্লেক্স' : 'THE 24FPS CLAPPERBOARD SLATE RUSH'}
              </h3>
              <p className="max-w-lg mx-auto font-mono-film text-xs text-neutral-400 mt-2">
                {currentLang === 'bn'
                  ? 'কাউন্টডাউন শুরু হলে ঠিক লাল সিঙ্ক বারে পৌঁছানোর মুহূর্তে ক্লাপারবোর্ডে ক্লিক করে স্ল্যাপ দিন!'
                  : 'Hit the wooden clapper precisely when the rolling film marker strikes the central red audio-sync gate!'}
              </p>
            </div>

            {/* Interactive Clapper Graphic (SVG / DOM representation) */}
            <div className="flex flex-col items-center justify-center my-4 select-none">
              <div
                onClick={handleSnapClapper}
                className={`relative w-64 sm:w-80 cursor-pointer transition-transform ${
                  clapperState === 'running' ? 'hover:scale-105 active:scale-95' : ''
                }`}
                title="Click to Snap Clapper!"
              >
                {/* Clapper Upper Hinged Arm with Chevron Stripes */}
                <div
                  className="w-full h-10 bg-neutral-900 border-2 border-neutral-700 rounded-t-md origin-bottom-left transition-transform duration-75 shadow-lg overflow-hidden flex"
                  style={{ transform: `rotate(${clapperArmAngle}deg)` }}
                >
                  {/* Diagonal Black & White Stripes */}
                  <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#000_0px,#000_18px,#fff_18px,#fff_36px)]" />
                </div>

                {/* Clapper Body Slate */}
                <div className="w-full bg-[#080d19] border-2 border-neutral-700 rounded-b-md p-3 font-mono-film text-left shadow-2xl relative">
                  {/* Top matching stripes */}
                  <div className="w-full h-3 mb-2 bg-[repeating-linear-gradient(45deg,#000_0px,#000_18px,#fff_18px,#fff_36px)] rounded-sm" />

                  <div className="grid grid-cols-3 gap-2 text-[10px] text-neutral-400 border-b border-neutral-800 pb-2">
                    <div>
                      <span className="block text-[8px] text-neutral-600">PROD</span>
                      <span className="text-white font-bold">ZEEHAD</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-neutral-600">SCENE</span>
                      <span className="text-amber-400 font-bold">14B</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-neutral-600">TAKE</span>
                      <span className="text-cyan-400 font-bold">#{clapperTake}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-[9px] text-neutral-500">
                    <span>ROLL: A01</span>
                    <span>FPS: 24</span>
                    <span className="text-red-400 animate-pulse">● SOUND REC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time 24fps Rolling Film Strip Sync Meter */}
            <div className="max-w-lg mx-auto space-y-2">
              <div className="flex justify-between text-xs font-mono-film text-neutral-400">
                <span>0 FPS (ROLLING)</span>
                <span className="text-red-400 font-bold">GATE SYNC (FRAME 24)</span>
                <span>TAKE END</span>
              </div>

              <div className="relative w-full h-6 bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden flex items-center">
                {/* Red Target Sync Center Gate */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-full bg-red-600/40 border-x-2 border-red-500 z-10 flex items-center justify-center">
                  <div className="w-1 h-3 bg-red-300" />
                </div>

                {/* Progress Cursor Needle */}
                <div
                  className="absolute top-0 bottom-0 w-2 bg-cyan-400 shadow-[0_0_12px_#00f0ff] transition-all duration-75 z-20"
                  style={{ left: `${clapperProgress}%` }}
                />
              </div>
            </div>

            {/* Results & Actions */}
            <div className="max-w-md mx-auto space-y-4">
              {clapperFeedback && (
                <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950/80 font-mono-film text-xs">
                  <div className="text-white font-bold">{clapperFeedback}</div>
                  {clapperDelta !== null && (
                    <div className="text-[11px] text-cyan-400 mt-1">
                      TIME DELTA: {clapperDelta > 0 ? `+${clapperDelta}ms` : `${clapperDelta}ms`}
                    </div>
                  )}
                </div>
              )}

              {clapperState !== 'running' ? (
                <button
                  type="button"
                  onClick={startClapperRun}
                  className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-cinematic font-black text-base tracking-[0.2em] uppercase transition-all  flex items-center justify-center gap-2 group"
                >
                  <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                  <span>{currentLang === 'bn' ? 'রোল ক্যামেরা // স্টার্ট টেক' : 'ROLL CAMERA // CALL SLATE'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSnapClapper}
                  className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-cinematic font-black text-base tracking-[0.2em] uppercase transition-all shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse"
                >
                  SNAP CLAPPER NOW! (MARK IT!)
                </button>
              )}
            </div>
          </div>
        )}

        {/* ====================================================================
            GAME 3: COLORIST LUT GRADING MATCH
            ==================================================================== */}
        {activeGame === 'color' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#050917] border border-neutral-800 rounded-3xl p-4 sm:p-7 shadow-2xl">
            {/* Split Screen Comparator (Left 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              <div className="flex items-center justify-between font-mono-film text-xs text-neutral-400 pb-2 border-b border-neutral-800">
                <span className="text-teal-400 font-bold flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  DAVINCI RESOLVE SUITE // {currentColorTarget.film}
                </span>
                <span className="text-neutral-400 text-[10px]">
                  TARGET: {currentLang === 'bn' ? currentColorTarget.name.bn : currentColorTarget.name.en}
                </span>
              </div>

              {/* Dual Visual Frames: Left Reference vs Right Live Grade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Reference Target Frame */}
                <div className="relative aspect-video rounded-xl overflow-hidden border border-neutral-700 bg-black group">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${currentColorTarget.referenceImg})`,
                      filter: `contrast(${currentColorTarget.targetContrast}%) saturate(${currentColorTarget.targetSat}%) hue-rotate(${currentColorTarget.targetLift}deg)`,
                    }}
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 font-mono-film text-[10px] text-amber-400 border border-amber-500/40">
                    TARGET MASTER GRADE
                  </div>
                </div>

                {/* User's Live Adjusted Grade */}
                <div className="relative aspect-video rounded-xl overflow-hidden border border-teal-500/50 bg-black group">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-100"
                    style={{
                      backgroundImage: `url(${currentColorTarget.referenceImg})`,
                      filter: `contrast(${userContrast}%) saturate(${userSat}%) hue-rotate(${userLift}deg) brightness(${1 + userGain / 100})`,
                    }}
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-cyan-950/80 font-mono-film text-[10px] text-cyan-300 border border-cyan-500/50">
                    YOUR LIVE LUT GRADE
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 font-mono-film text-[11px] text-neutral-400">
                <span className="text-white font-bold block mb-1">COLOR SCIENCE OBJECTIVE:</span>
                Balance the shadows (Lift) and highlights (Gain) to match the atmospheric palette of{' '}
                <span className="text-cyan-400">{currentColorTarget.film}</span>.
              </div>
            </div>

            {/* Color Console Controls (Right 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs font-mono-film text-neutral-400">
                  <span className="text-teal-300 font-bold">GRADING WHEELS & CONTRAST</span>
                  <span className="text-[10px]">LIFT / GAIN / CONTRAST</span>
                </div>

                {/* 1. Lift / Shadow Hue */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono-film">
                    <span className="text-neutral-300">SHADOWS TINT (LIFT)</span>
                    <span className="text-cyan-400 font-bold">{userLift}°</span>
                  </div>
                  <input
                    type="range"
                    min="-60"
                    max="60"
                    value={userLift}
                    onChange={(e) => {
                      setUserLift(parseInt(e.target.value, 10));
                      soundEngine.playClick();
                    }}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono-film text-neutral-500">
                    <span>-60° (Cold Teal)</span>
                    <span>0°</span>
                    <span>+60° (Warm Gold)</span>
                  </div>
                </div>

                {/* 2. Highlights Tint (Gain) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono-film">
                    <span className="text-neutral-300">HIGHLIGHTS GAIN</span>
                    <span className="text-amber-400 font-bold">{userGain}</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={userGain}
                    onChange={(e) => {
                      setUserGain(parseInt(e.target.value, 10));
                      soundEngine.playClick();
                    }}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono-film text-neutral-500">
                    <span>-40 (Deep Muted)</span>
                    <span>0</span>
                    <span>+40 (Punchy Highs)</span>
                  </div>
                </div>

                {/* 3. Contrast */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono-film">
                    <span className="text-neutral-300">CONTRAST S-CURVE</span>
                    <span className="text-teal-400 font-bold">{userContrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="180"
                    value={userContrast}
                    onChange={(e) => {
                      setUserContrast(parseInt(e.target.value, 10));
                      soundEngine.playClick();
                    }}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono-film text-neutral-500">
                    <span>80% (Flat Log)</span>
                    <span>130%</span>
                    <span>180% (High Contrast)</span>
                  </div>
                </div>

                {/* 4. Saturation */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono-film">
                    <span className="text-neutral-300">COLOR DENSITY (SATURATION)</span>
                    <span className="text-blue-300 font-bold">{userSat}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="160"
                    value={userSat}
                    onChange={(e) => {
                      setUserSat(parseInt(e.target.value, 10));
                      soundEngine.playClick();
                    }}
                    className="w-full accent-blue-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono-film text-neutral-500">
                    <span>30% (Desaturated Noir)</span>
                    <span>100%</span>
                    <span>160% (Vibrant)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-3 border-t border-neutral-800">
                {!colorResult ? (
                  <button
                    type="button"
                    onClick={handleEvaluateGrade}
                    className="w-full py-3.5 px-5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-neutral-950 font-cinematic font-bold text-sm tracking-[0.2em] uppercase transition-all  flex items-center justify-center gap-2 group"
                  >
                    <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{currentLang === 'bn' ? 'গ্রেড পরীক্ষা ও মেলাও' : 'ANALYZE & MATCH GRADE'}</span>
                  </button>
                ) : (
                  <div className="space-y-3 p-4 rounded-2xl bg-neutral-950 border border-teal-500/40 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-mono-film text-teal-300 font-bold">
                        MATCH ACCURACY: {colorResult.match}%
                      </div>
                      <div className="font-cinematic text-amber-300 font-bold">
                        +{colorResult.score} PTS
                      </div>
                    </div>

                    <div className="px-3 py-1.5 rounded bg-teal-950/60 border border-teal-500/30 text-teal-200 font-mono-film text-xs">
                      TITLE: {colorResult.badge}
                    </div>

                    <button
                      type="button"
                      onClick={handleNextColorTarget}
                      className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-teal-300 font-mono-film text-xs font-bold tracking-wider transition-colors"
                    >
                      {currentLang === 'bn' ? 'পরবর্তী ফিল্ম প্যালেট →' : 'NEXT FILM PALETTE →'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Director's Quest Progression Drawer */}
      <DirectorsQuestDrawer
        currentLang={currentLang}
        isOpen={questDrawerOpen}
        onClose={() => setQuestDrawerOpen(false)}
      />
    </section>
  );
}
