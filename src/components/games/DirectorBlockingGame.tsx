import { useState } from 'react';
import { motion } from 'motion/react';
import { Clapperboard, Play, Camera, User, Eye, Sun, Sparkles, Award } from 'lucide-react';
import { Language } from '../../types';
import { soundEngine } from '../../utils/audio';
import { directorsQuest } from '../../utils/directorsQuest';

interface DirectorBlockingGameProps {
  currentLang: Language;
  directorsCut?: boolean;
}

type ActorState = 'paranoia' | 'frozen-dread' | 'cold-focus' | 'repressed-grief';
type BlockingPosition = 'close-downstage' | 'mid-silhouette' | 'far-shadow' | 'turned-back';
type CameraMovement = 'slow-dolly' | 'handheld-float' | 'locked-low-angle' | 'subtle-orbit';
type LightingMood = 'cyan-fluorescent' | 'tungsten-noir' | 'deep-shadow-fill';

export function DirectorBlockingGame({ currentLang, directorsCut }: DirectorBlockingGameProps) {
  const [actorState, setActorState] = useState<ActorState>('paranoia');
  const [blocking, setBlocking] = useState<BlockingPosition>('close-downstage');
  const [cameraMove, setCameraMove] = useState<CameraMovement>('slow-dolly');
  const [lighting, setLighting] = useState<LightingMood>('cyan-fluorescent');
  const [isPlayingTake, setIsPlayingTake] = useState(false);
  const [takeNumber, setTakeNumber] = useState(1);
  const [directorScore, setDirectorScore] = useState<number | null>(null);

  const isBn = currentLang === 'bn';

  const rollCamera = () => {
    soundEngine.playClapper();
    setIsPlayingTake(true);

    // Compute director evaluation score based on coherence
    let score = 80;
    if (actorState === 'paranoia' && cameraMove === 'handheld-float') score += 15;
    if (actorState === 'frozen-dread' && blocking === 'turned-back') score += 12;
    if (lighting === 'cyan-fluorescent' && actorState === 'paranoia') score += 5;
    if (blocking === 'close-downstage' && cameraMove === 'slow-dolly') score += 8;
    score = Math.min(100, score);

    setTimeout(() => {
      soundEngine.playShutter();
      setIsPlayingTake(false);
      setTakeNumber((prev) => prev + 1);
      setDirectorScore(score);
      if (score >= 85) {
        soundEngine.playSuccess();
        directorsQuest.unlockBadge('badge-direction');
      }
    }, 2800);
  };

  return (
    <div className="space-y-6 font-mono-film">
      {/* Briefing */}
      <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
          <Clapperboard className="w-4 h-4 text-amber-400" />
          <span>{isBn ? 'গেম ০৪ : পরিচালনা ও অভিনেতার ব্লকিং সিমুলেটর' : 'GAME 04 : DIRECTOR BLOCKING & SCENE ORCHESTRATION'}</span>
        </div>
        <p className="text-xs text-neutral-300">
          {isBn
            ? 'পরিচালকের মূল দায়িত্ব: অভিনেতার মানসিক অবস্থান, ফ্রেমে তার সঠিক অবস্থান (ব্লকিং), ক্যামেরার গতি ও আলোর মেজাজ নির্ধারণ করে "ACTION" কল করুন।'
            : 'As Director, orchestrate actor psychology, spatial stage blocking, camera movement, and lighting mood. Hit ROLL TAKE to evaluate your scene.'}
        </p>
      </div>

      {/* Main Director's Viewfinder Studio */}
      <div className="relative aspect-[2.35/1] w-full rounded-xl overflow-hidden border border-cyan-500/40 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex items-center justify-center">
        {/* Aspect Ratio Mattes & Viewfinder HUD */}
        <div className="absolute top-3 left-4 text-[10px] text-cyan-400 tracking-widest bg-black/60 px-2 py-0.5 rounded border border-neutral-800">
          REC ● [TAKE 0{takeNumber}] 24FPS
        </div>
        <div className="absolute top-3 right-4 text-[10px] text-amber-400 tracking-widest bg-black/60 px-2 py-0.5 rounded border border-neutral-800">
          SHUTTER 180° • ISO 200
        </div>

        {/* Viewfinder Crosshairs & Rule-of-Thirds Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="w-full h-full grid grid-cols-3 grid-rows-3">
            <div className="border-r border-b border-cyan-400/40" />
            <div className="border-r border-b border-cyan-400/40" />
            <div className="border-b border-cyan-400/40" />
            <div className="border-r border-b border-cyan-400/40" />
            <div className="border-r border-b border-cyan-400/40" />
            <div className="border-b border-cyan-400/40" />
            <div className="border-r border-cyan-400/40" />
            <div className="border-r border-cyan-400/40" />
            <div />
          </div>
        </div>

        {/* Simulated Stage Lighting */}
        <div
          className={`absolute inset-0 transition-colors duration-700 pointer-events-none ${
            lighting === 'cyan-fluorescent'
              ? 'bg-gradient-to-t from-cyan-950/40 via-transparent to-cyan-900/20'
              : lighting === 'tungsten-noir'
              ? 'bg-gradient-to-tr from-amber-950/50 via-neutral-950 to-neutral-900'
              : 'bg-gradient-to-b from-neutral-950 via-neutral-900/40 to-black'
          }`}
        />

        {/* Directed Actor Silhouette & Dynamic Motion */}
        <motion.div
          animate={
            isPlayingTake
              ? cameraMove === 'handheld-float'
                ? { x: [-4, 4, -3, 2, 0], y: [-2, 3, -1, 2, 0], scale: [1, 1.04, 1] }
                : cameraMove === 'slow-dolly'
                ? { scale: [0.95, 1.15] }
                : { y: [0, -3, 0] }
              : {}
          }
          transition={{ duration: 2.8, ease: 'easeInOut' }}
          className={`relative z-10 flex flex-col items-center transition-all duration-700 ${
            blocking === 'close-downstage'
              ? 'scale-125 translate-y-4'
              : blocking === 'mid-silhouette'
              ? 'scale-90 -translate-x-8'
              : blocking === 'far-shadow'
              ? 'scale-60 translate-x-12 opacity-60'
              : 'scale-100 rotate-180 opacity-80'
          }`}
        >
          {/* Stylized Actor Silhouette Motif */}
          <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-t-full bg-gradient-to-b from-neutral-800 to-neutral-950 border border-neutral-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center justify-center relative">
            <User className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-400" />
            {blocking === 'turned-back' && (
              <span className="absolute text-[8px] font-bold text-neutral-400 bottom-1">
                REVERSE
              </span>
            )}
          </div>

          {/* Actor Mood Tag */}
          <span className="mt-2 px-2 py-0.5 rounded bg-black/80 border border-neutral-800 text-[10px] text-cyan-300 font-bold uppercase tracking-widest">
            {actorState.replace('-', ' ')}
          </span>
        </motion.div>

        {/* Live Rolling Overlay indicator */}
        {isPlayingTake && (
          <div className="absolute inset-0 bg-red-500/10 pointer-events-none flex items-center justify-center">
            <span className="text-red-500 font-bold text-sm tracking-[0.3em] uppercase animate-pulse">
              ● SCENE ROLLING
            </span>
          </div>
        )}
      </div>

      {/* Director Control Consoles (4 Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Actor State */}
        <div className="p-3 rounded-xl bg-[#090e1c] border border-neutral-800 space-y-1.5">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
            {isBn ? '১. চরিত্রের মনস্তত্ত্ব' : '1. ACTOR PSYCHOLOGY'}
          </span>
          <div className="space-y-1">
            {(['paranoia', 'frozen-dread', 'cold-focus', 'repressed-grief'] as ActorState[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  soundEngine.playClick();
                  setActorState(s);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] transition-all ${
                  actorState === s
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-white'
                }`}
              >
                {s.toUpperCase().replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Spatial Blocking */}
        <div className="p-3 rounded-xl bg-[#090e1c] border border-neutral-800 space-y-1.5">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
            {isBn ? '২. ফ্রেমে অবস্থান (ব্লকিং)' : '2. SPATIAL BLOCKING'}
          </span>
          <div className="space-y-1">
            {(['close-downstage', 'mid-silhouette', 'far-shadow', 'turned-back'] as BlockingPosition[]).map((b) => (
              <button
                key={b}
                onClick={() => {
                  soundEngine.playClick();
                  setBlocking(b);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] transition-all ${
                  blocking === b
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-white'
                }`}
              >
                {b.toUpperCase().replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Camera Choreography */}
        <div className="p-3 rounded-xl bg-[#090e1c] border border-neutral-800 space-y-1.5">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
            {isBn ? '৩. ক্যামেরা মুভমেন্ট' : '3. CAMERA MOVEMENT'}
          </span>
          <div className="space-y-1">
            {(['slow-dolly', 'handheld-float', 'locked-low-angle', 'subtle-orbit'] as CameraMovement[]).map((c) => (
              <button
                key={c}
                onClick={() => {
                  soundEngine.playClick();
                  setCameraMove(c);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] transition-all ${
                  cameraMove === c
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-white'
                }`}
              >
                {c.toUpperCase().replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Lighting Mood */}
        <div className="p-3 rounded-xl bg-[#090e1c] border border-neutral-800 space-y-1.5">
          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">
            {isBn ? '৪. লাইটিং ও শেড' : '4. LIGHTING MOOD'}
          </span>
          <div className="space-y-1">
            {(['cyan-fluorescent', 'tungsten-noir', 'deep-shadow-fill'] as LightingMood[]).map((l) => (
              <button
                key={l}
                onClick={() => {
                  soundEngine.playClick();
                  setLighting(l);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] transition-all ${
                  lighting === l
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 font-bold'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-white'
                }`}
              >
                {l.toUpperCase().replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Trigger & Telemetry */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
        <button
          onClick={rollCamera}
          disabled={isPlayingTake}
          data-cursor="ACTION"
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:opacity-50 transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isBn ? 'অ্যাকশন! (ROLL TAKE)' : 'ACTION! (ROLL TAKE)'}</span>
        </button>

        {directorScore !== null && (
          <div className="flex items-center gap-3 font-mono-film text-xs">
            <span className="text-neutral-400">{isBn ? 'পরিচালনা মূল্যায়ন:' : 'DIRECTOR EVALUATION:'}</span>
            <span className="text-emerald-400 font-bold text-sm">{directorScore}/100</span>
            <span className="text-neutral-500 text-[10px]">
              {directorScore >= 95
                ? isBn
                  ? 'মাস্টারপিস টেক! ফ্রেমিং ও আবেগের নিখুঁত মিল।'
                  : 'MASTERPIECE TAKE! Blocking and lighting in complete unity.'
                : isBn
                ? 'কার্যকর দৃশ্য। ক্যামেরা মুভমেন্টের সাথে চরিত্রের টেনশন মেলান।'
                : 'Good take. Consider matching camera movement to character urgency.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
