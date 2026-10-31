import { useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Lightbulb, Compass, CheckCircle2, RotateCcw, Sparkles, Award, Eye, Zap, Sliders } from 'lucide-react';
import { Language } from '../../types';
import { soundEngine } from '../../utils/audio';
import { directorsQuest } from '../../utils/directorsQuest';

interface LightingSetupGameProps {
  currentLang: Language;
  directorsCut?: boolean;
}

export type LightType = 'key' | 'fill' | 'rim' | 'practical';

export interface StageLight {
  type: LightType;
  enabled: boolean;
  angleDeg: number; // 0 = directly behind camera (front), 90 = right, 180 = directly behind subject, 270 = left
  intensity: number; // 0 to 100
  colorTemp: 'tungsten' | 'daylight' | 'cyan' | 'amber' | 'crimson';
}

interface LightingChallenge {
  id: string;
  filmTitle: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  targetSetup: {
    keyAngleMin: number;
    keyAngleMax: number;
    fillMaxRatio: number; // max intensity for high contrast
    rimRequired: boolean;
  };
  styleLabel: string;
  contrastRatio: string;
}

const LIGHTING_CHALLENGES: LightingChallenge[] = [
  {
    id: 'challenge-rembrandt',
    filmTitle: 'REFLECT (FILM 01)',
    titleEn: 'Classic Rembrandt Lighting',
    titleBn: 'ক্ল্যাসিক রেমব্রান্ট লাইটিং প্যাটার্ন',
    descriptionEn: 'Place the Key Light at ~45° camera-left. Keep Fill Light soft (25%-40% intensity) to carve the iconic inverted light triangle on the shadow cheek.',
    descriptionBn: 'কি-লাইটকে ৪৫° কোণে রাখুন। ফিল-লাইট ২৫%-৪০% মৃদু রেখে ছায়াযুক্ত গালে রেমব্রান্টের বিখ্যাত ত্রিভুজ আলোর ফাঁদ তৈরি করুন।',
    targetSetup: {
      keyAngleMin: 30,
      keyAngleMax: 65,
      fillMaxRatio: 45,
      rimRequired: true,
    },
    styleLabel: 'REMBRANDT (4:1 RATIO)',
    contrastRatio: '4:1',
  },
  {
    id: 'challenge-noir',
    filmTitle: 'SHADOW / III (FILM 04)',
    titleEn: 'Film Noir Chiaroscuro (High Contrast)',
    titleBn: 'ফিল্ম নোয়ার কিয়ারোস্কুরো (উচ্চ বৈসাদৃশ্য)',
    descriptionEn: 'Hard single-source light. Position Key Light at a steep 90° side profile, completely shut off the Fill Light (0%), and turn on the Rim Light for separation.',
    descriptionBn: 'তীব্র একমুখী আলো। কি-লাইটকে ঠিক ৯০° পাশে রাখুন, ফিল-লাইট পুরোপুরি বন্ধ (০%) রাখুন এবং পেছন থেকে রিম-লাইট দিয়ে অবয়ব আলাদা করুন।',
    targetSetup: {
      keyAngleMin: 75,
      keyAngleMax: 105,
      fillMaxRatio: 10,
      rimRequired: true,
    },
    styleLabel: 'CHIAROSCURO NOIR (8:1 RATIO)',
    contrastRatio: '8:1',
  },
  {
    id: 'challenge-silhouette',
    filmTitle: 'LOST (FILM 07)',
    titleEn: 'Cyberpunk Nocturnal Silhouette',
    titleBn: 'সাইবারপাঙ্ক নিশাচর সিলুয়েট',
    descriptionEn: 'Total face darkness. Turn off both Key and Fill lights (0%), and illuminate exclusively with Rim Light (180° behind) and Cyan Practical Light.',
    descriptionBn: 'মুখের ওপর সম্পূর্ণ অন্ধকার। কি এবং ফিল দুটিই বন্ধ রাখুন, শুধু ১৮০° পেছন থেকে রিম-লাইট এবং সায়ান প্র্যাকটিক্যাল আলো জ্বালান।',
    targetSetup: {
      keyAngleMin: 0,
      keyAngleMax: 360,
      fillMaxRatio: 5,
      rimRequired: true,
    },
    styleLabel: 'HAIR RIM SILHOUETTE',
    contrastRatio: '∞:1',
  },
];

const GEL_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  tungsten: { bg: '#f59e0b', text: '#78350f', label: '3200K Tungsten' },
  daylight: { bg: '#e0f2fe', text: '#0369a1', label: '5600K Daylight' },
  cyan: { bg: '#00f0ff', text: '#083344', label: '4300K Cyan Neon' },
  amber: { bg: '#fbbf24', text: '#451a03', label: 'Warm Amber' },
  crimson: { bg: '#f43f5e', text: '#4c0519', label: 'Noir Crimson' },
};

export function LightingSetupGame({ currentLang, directorsCut }: LightingSetupGameProps) {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const currentChallenge = LIGHTING_CHALLENGES[challengeIdx];
  const isBn = currentLang === 'bn';

  // 4 Virtual Stage Lights
  const [lights, setLights] = useState<Record<LightType, StageLight>>({
    key: { type: 'key', enabled: true, angleDeg: 45, intensity: 85, colorTemp: 'tungsten' },
    fill: { type: 'fill', enabled: true, angleDeg: 315, intensity: 30, colorTemp: 'daylight' },
    rim: { type: 'rim', enabled: true, angleDeg: 180, intensity: 70, colorTemp: 'cyan' },
    practical: { type: 'practical', enabled: false, angleDeg: 120, intensity: 40, colorTemp: 'amber' },
  });

  const [activeSelectedLight, setActiveSelectedLight] = useState<LightType>('key');
  const [evaluation, setEvaluation] = useState<{ score: number; passed: boolean; message: string } | null>(null);

  const selectedLightObj = lights[activeSelectedLight];

  const updateLight = (type: LightType, updates: Partial<StageLight>) => {
    soundEngine.playClick();
    setLights((prev) => ({
      ...prev,
      [type]: { ...prev[type], ...updates },
    }));
    setEvaluation(null);
  };

  const evaluateSetup = () => {
    soundEngine.playShutter();
    const key = lights.key;
    const fill = lights.fill;
    const rim = lights.rim;

    let score = 50;
    let passed = false;
    let message = '';

    if (currentChallenge.id === 'challenge-rembrandt') {
      const isAngleGood = key.enabled && key.angleDeg >= 30 && key.angleDeg <= 65;
      const isFillGood = fill.enabled && fill.intensity <= 45;
      const isRimGood = rim.enabled && rim.intensity >= 40;

      if (isAngleGood) score += 25;
      if (isFillGood) score += 15;
      if (isRimGood) score += 10;

      passed = score >= 90;
      message = passed
        ? isBn
          ? 'নিখুঁত রেমব্রান্ট ট্রায়াঙ্গেল! গভীর শ্যাডো ও ক্লাসিক কিয়ারোস্কুরো।'
          : 'Iconic Rembrandt Triangle achieved! Perfect 4:1 dramatic ratio.'
        : isBn
        ? 'কি-লাইটকে ৪৫° কোণে এবং ফিল-লাইটকে ৩০% এর নিচে রাখুন।'
        : 'Adjust Key light to ~45° and keep Fill intensity below 40%.';
    } else if (currentChallenge.id === 'challenge-noir') {
      const isKeySide = key.enabled && key.angleDeg >= 75 && key.angleDeg <= 110;
      const isFillOff = !fill.enabled || fill.intensity <= 10;
      const isRimOn = rim.enabled && rim.intensity >= 50;

      if (isKeySide) score += 25;
      if (isFillOff) score += 15;
      if (isRimOn) score += 10;

      passed = score >= 90;
      message = passed
        ? isBn
          ? 'মাস্টারপিস ফিল্ম নোয়ার! চরম বৈসাদৃশ্য ও গভীর রহস্য।'
          : 'Pure Film Noir Chiaroscuro! 8:1 Stark separation achieved.'
        : isBn
        ? 'ফিল-লাইট পুরোপুরি বন্ধ করুন এবং কি-লাইট ৯০° পাশে রাখুন।'
        : 'Turn Fill light to 0% and align Key strictly to 90° profile.';
    } else {
      // Silhouette
      const isKeyOff = !key.enabled || key.intensity <= 10;
      const isFillOff = !fill.enabled || fill.intensity <= 10;
      const isRimStrong = rim.enabled && rim.intensity >= 65;

      if (isKeyOff) score += 25;
      if (isFillOff) score += 15;
      if (isRimStrong) score += 10;

      passed = score >= 90;
      message = passed
        ? isBn
          ? 'চমৎকার সাইবারপাঙ্ক সিলুয়েট! ব্যাকগ্রাউন্ড থেকে অবয়ব নিখুঁত আলাদা।'
          : 'Ethereal Silhouette! Pristine cyan rim cutting through total darkness.'
        : isBn
        ? 'কি এবং ফিল দুটিই শূন্য করুন, শুধু পেছন থেকে রিম-লাইট জ্বালান।'
        : 'Shut off both Key and Fill, relying strictly on Backlight.';
    }

    setEvaluation({ score, passed, message });

    if (passed) {
      soundEngine.playSuccess();
      directorsQuest.unlockBadge('badge-lighting');
    }
  };

  const nextChallenge = () => {
    soundEngine.playClick();
    setChallengeIdx((prev) => (prev + 1) % LIGHTING_CHALLENGES.length);
    setEvaluation(null);
  };

  // Convert angle (deg) to 2D top-down stage coordinates
  const getStageCoord = (deg: number, radius = 90) => {
    // 0 deg is bottom (camera at 6 o'clock)
    // convert to rad:
    const rad = ((deg + 90) * Math.PI) / 180;
    return {
      x: 120 + radius * Math.cos(rad),
      y: 120 + radius * Math.sin(rad),
    };
  };

  return (
    <div className="space-y-6 font-mono-film">
      {/* Briefing Header */}
      <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>{isBn ? 'থ্রি-পয়েন্ট লাইটিং ও স্টেজ গ্রিড সিমুলেটর' : 'THREE-POINT LIGHTING & STAGE SIMULATOR'}</span>
          </div>
          <span className="text-[10px] text-amber-400 px-2.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">
            {currentChallenge.styleLabel}
          </span>
        </div>
        <p className="text-xs text-neutral-300">
          {isBn ? currentChallenge.descriptionBn : currentChallenge.descriptionEn}
        </p>
      </div>

      {/* Main Split Interface: 2D Stage Grid (Left) + Viewport Rendered Subject (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 2D Top-Down Stage Grid (6 Cols) */}
        <div className="lg:col-span-6 p-4 rounded-2xl bg-[#060a14] border border-neutral-800 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between text-[10px] text-neutral-400 uppercase tracking-widest mb-2">
            <span>2D TOP-DOWN STAGE PLAN</span>
            <span className="text-cyan-400">CAMERA AT 6 O'CLOCK</span>
          </div>

          {/* 2D Stage SVG Radar / Floorplan */}
          <div className="relative w-[260px] h-[260px] sm:w-[280px] sm:h-[280px] rounded-full border border-neutral-800/80 bg-neutral-950/90 flex items-center justify-center shadow-inner">
            {/* Stage Range Rings & Crosshairs */}
            <div className="absolute inset-4 rounded-full border border-neutral-800/50 pointer-events-none" />
            <div className="absolute inset-16 rounded-full border border-neutral-800/40 pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-full h-[1px] bg-cyan-400" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="h-full w-[1px] bg-cyan-400" />
            </div>

            {/* Center Actor / Subject Marker */}
            <div className="relative z-10 w-10 h-10 rounded-full bg-neutral-800 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <span className="text-[8px] font-bold text-cyan-300">ACTOR</span>
            </div>

            {/* Camera at Bottom (6 o'clock) */}
            <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
              <span className="px-2 py-0.5 rounded bg-black border border-neutral-700 text-[8px] text-amber-400 font-bold tracking-widest">
                ▼ CAMERA
              </span>
            </div>

            {/* 4 Placed Light Nodes */}
            {(['key', 'fill', 'rim', 'practical'] as LightType[]).map((type) => {
              const light = lights[type];
              if (!light.enabled) return null;
              const pos = getStageCoord(light.angleDeg, 95);
              const colorInfo = GEL_COLORS[light.colorTemp];
              const isSelected = activeSelectedLight === type;

              return (
                <button
                  key={type}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveSelectedLight(type);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border flex items-center justify-center transition-all z-20 ${
                    isSelected
                      ? 'ring-2 ring-white scale-125 border-white'
                      : 'border-neutral-700 hover:scale-110'
                  }`}
                  style={{
                    backgroundColor: colorInfo.bg,
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    boxShadow: `0 0 15px ${colorInfo.bg}80`,
                  }}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-black" />
                  <span className="absolute -bottom-4 text-[7px] font-bold uppercase text-white bg-black/80 px-1 rounded">
                    {type}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Angle Presets for Active Light */}
          <div className="w-full mt-4 space-y-1.5">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
              {activeSelectedLight.toUpperCase()} ANGLE (DEG):
            </span>
            <div className="grid grid-cols-5 gap-1 text-[9px] font-bold">
              {[0, 45, 90, 180, 315].map((deg) => (
                <button
                  key={deg}
                  onClick={() => updateLight(activeSelectedLight, { angleDeg: deg })}
                  className={`py-1 rounded text-center transition-colors ${
                    selectedLightObj.angleDeg === deg
                      ? 'bg-cyan-500 text-black font-bold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Real-time Rendered Viewport Preview (6 Cols) */}
        <div className="lg:col-span-6 p-4 rounded-2xl bg-[#060a14] border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase tracking-widest mb-2">
            <span>CINEMATIC VIEWPORT ILLUMINATION</span>
            <span className="text-amber-400">{currentChallenge.contrastRatio} CONTRAST</span>
          </div>

          {/* Simulated Actor Face in Frame */}
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-black border border-cyan-500/30 flex items-center justify-center shadow-2xl">
            {/* Background Light Spill */}
            {lights.practical.enabled && (
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 80% 20%, ${GEL_COLORS[lights.practical.colorTemp].bg}40 0%, transparent 60%)`,
                }}
              />
            )}

            {/* Rim Light Shroud Edge */}
            {lights.rim.enabled && (
              <div
                className="absolute inset-0 pointer-events-none opacity-80"
                style={{
                  boxShadow: `inset 0 0 35px ${GEL_COLORS[lights.rim.colorTemp].bg}`,
                }}
              />
            )}

            {/* Dynamic Subject Silhouette with Key & Fill Shader Simulation */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className="w-24 h-32 sm:w-28 sm:h-36 rounded-t-full border border-neutral-800 shadow-2xl relative overflow-hidden transition-all duration-500"
                style={{
                  background: `linear-gradient(${
                    lights.key.enabled ? `${lights.key.angleDeg + 90}deg` : '0deg'
                  }, ${
                    lights.key.enabled
                      ? GEL_COLORS[lights.key.colorTemp].bg
                      : '#000000'
                  } 0%, ${
                    lights.fill.enabled && lights.fill.intensity > 15
                      ? GEL_COLORS[lights.fill.colorTemp].bg + '40'
                      : '#050505'
                  } 60%, #000000 100%)`,
                }}
              >
                {/* Subtle Facial Depth Silhouette */}
                <div className="absolute inset-x-2 top-4 bottom-0 bg-neutral-900/60 rounded-t-full flex items-center justify-center">
                  <span className="text-[9px] text-white/50 tracking-widest uppercase">
                    {lights.key.enabled ? 'HIGHLIGHT' : 'DARK'}
                  </span>
                </div>
              </div>

              {/* Contrast Tag */}
              <span className="mt-2 text-[9px] text-cyan-300 font-bold uppercase tracking-widest bg-black/80 px-2 py-0.5 rounded border border-neutral-800">
                KEY: {lights.key.enabled ? `${lights.key.intensity}%` : 'OFF'} • FILL:{' '}
                {lights.fill.enabled ? `${lights.fill.intensity}%` : 'OFF'}
              </span>
            </div>
          </div>

          {/* Active Light Controller Strip */}
          <div className="mt-4 p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                EDIT: {activeSelectedLight.toUpperCase()} LIGHT
              </span>
              <button
                onClick={() => updateLight(activeSelectedLight, { enabled: !selectedLightObj.enabled })}
                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                  selectedLightObj.enabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                }`}
              >
                {selectedLightObj.enabled ? 'POWER ON' : 'POWER OFF'}
              </button>
            </div>

            {/* Intensity Slider */}
            <div className="flex items-center gap-3">
              <span className="text-[9px] text-neutral-400 w-14">INTENSITY:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedLightObj.intensity}
                onChange={(e) => updateLight(activeSelectedLight, { intensity: parseInt(e.target.value, 10) })}
                className="flex-1 accent-cyan-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-white font-mono w-8">{selectedLightObj.intensity}%</span>
            </div>

            {/* Color Gel selector */}
            <div className="flex items-center gap-1 pt-1">
              <span className="text-[9px] text-neutral-400 w-14">GEL:</span>
              <div className="flex gap-1 flex-wrap">
                {(['tungsten', 'daylight', 'cyan', 'amber', 'crimson'] as const).map((gel) => (
                  <button
                    key={gel}
                    onClick={() => updateLight(activeSelectedLight, { colorTemp: gel })}
                    style={{ backgroundColor: GEL_COLORS[gel].bg }}
                    className={`w-5 h-5 rounded-full border transition-transform ${
                      selectedLightObj.colorTemp === gel ? 'ring-2 ring-white scale-110' : 'opacity-70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Verification & Results */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            onClick={evaluateSetup}
            data-cursor="GAFFER"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{isBn ? 'লাইটিং মেজাজ টেস্ট করুন' : 'EVALUATE LIGHTING SETUP'}</span>
          </button>

          {evaluation && (
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`font-bold ${
                  evaluation.passed ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {evaluation.passed ? '✓ GO FOR TAKE' : 'RE-ADJUST'}
              </span>
              <span className="text-neutral-300 text-[11px]">{evaluation.message}</span>
            </div>
          )}
        </div>

        <button
          onClick={nextChallenge}
          className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors"
        >
          {isBn ? 'পরবর্তী লাইটিং চ্যালেঞ্জ →' : 'NEXT LIGHTING CHALLENGE →'}
        </button>
      </div>
    </div>
  );
}
