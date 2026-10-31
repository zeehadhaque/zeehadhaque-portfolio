import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Dices, Copy, Check, Lightbulb, Flame, Award, Film } from 'lucide-react';
import { Language } from '../../types';
import { soundEngine } from '../../utils/audio';
import { directorsQuest } from '../../utils/directorsQuest';

interface StoryConceptGameProps {
  currentLang: Language;
  directorsCut?: boolean;
}

interface ConceptOption {
  id: string;
  bn: string;
  en: string;
}

const PROTAGONISTS: ConceptOption[] = [
  { id: 'colorist', en: 'An obsessive DaVinci Resolve colorist', bn: 'একজন নিখুঁত কালার গ্রেডার যিনি ফ্রেমে লুকানো অসঙ্গতি খোঁজেন' },
  { id: 'sound-recordist', en: 'An insomniac nocturnal sound recordist', bn: 'একজন অনিদ্রাগ্রস্ত সাউন্ড রেকর্ডিস্ট যিনি রাতের নিস্তব্ধতা রেকর্ড করেন' },
  { id: 'mortician', en: 'A silent hospital morgue caretaker', bn: 'একজন নিঃশব্দ মর্গ কেয়ারটেকার যিনি অদ্ভুত প্রতিধ্বনি শোনেন' },
  { id: 'projectionist', en: 'The last 35mm film projectionist in Gazipur', bn: 'গাজীপুরের একটি প্রাচীন সিনেমা হলের শেষ ৩৫ মিমি প্রজেকশনিস্ট' },
  { id: 'cinematographer', en: 'A lone mobile filmmaker haunted by optical ghosts', bn: 'একজন একাকী মোবাইল সিনেমাটোগ্রাফার যার লেন্সে ছায়া ভাসে' },
];

const CATALYSTS: ConceptOption[] = [
  { id: 'mirror-delay', en: 'discovers their mirror reflection moves 2 seconds late', bn: 'আবিষ্কার করেন তার নিজের আয়নার প্রতিবিম্ব ২ সেকেন্ড দেরিতে নড়ছে' },
  { id: 'secret-frame', en: 'finds a subliminal 25th frame spliced into a silent film', bn: 'পুরোনো এক নির্বাক চলচ্চিত্রের ভেতর লুকানো ২৫তম ফ্রেম খুঁজে পান' },
  { id: 'frequency-forecast', en: 'captures an infrasound drone that broadcasts future deaths', bn: 'একটি সাব-সোনিক কম্পন রেকর্ড করেন যা আগামীর মৃত্যুর পূর্বাভাস দেয়' },
  { id: 'infinite-corridor', en: 'becomes trapped in a recurring 3-minute nocturnal loop', bn: 'রাতের একটি ৩ মিনিটের চিরন্তন সময় লুপের ভেতর আটকা পড়েন' },
  { id: 'shadow-detachment', en: 'notices their shadow taking independent footsteps in the fog', bn: 'লক্ষ্য করেন কুয়াশার ভেতর তার ছায়া তার আগেই একা হেঁটে যাচ্ছে' },
];

const SETTINGS: ConceptOption[] = [
  { id: 'gazipur-rain', en: 'under rain-drenched Gazipur industrial neon at 3:15 AM', bn: 'ভোর ৩:১৫ মিনিটে গাজীপুরের বৃষ্টিস্নাত নিয়ন লাইটের নির্জন গলিতে' },
  { id: 'clinical-morgue', en: 'inside a fluorescent hospital basement beneath 4300K cold light', bn: '৪৩০০K শীতল আলোয় ঘেরা নির্জন হাসপাতালের মর্গ করিডোরে' },
  { id: 'damp-forest', en: 'in the damp, mist-choked ancient forest of Bhawal', bn: 'ভাওয়ালের প্রাচীন কুয়াশাচ্ছন্ন ভেজা অরণ্যের গভীর পাতার আড়ালে' },
  { id: 'abandoned-theatre', en: 'inside an art-deco cinema hall whose projector turns on by itself', bn: 'এক পরিত্যক্ত সিনেমা হলে যার প্রজেক্টর প্রতি মধ্যরাতে নিজে থেকেই জ্বলে ওঠে' },
  { id: 'glass-studio', en: 'in a mirrored editing suite surrounded by 2.35:1 anamorphic monitors', bn: '২.৩৫:১ অ্যানামরফিক মনিটরে ঘেরা অন্ধকার এডিটিং স্টুডিওতে' },
];

const TWISTS: ConceptOption[] = [
  { id: 'antagonist-viewfinder', en: 'only to realize the audience has been watching through the stalker’s lens', bn: 'শেষ মুহূর্তে প্রকাশ পায় পুরো ছবিটি আসলে শিকারির ক্যামেরার লেন্স দিয়ে দেখা হচ্ছিল' },
  { id: 'future-self', en: 'uncovering that the ominous shadow was their future self warning them', bn: 'দেখা যায় অশুভ ছায়াটি আসলে তার ভবিষ্যৎ অস্তিত্ব যা তাকে সতর্ক করতে চেয়েছিল' },
  { id: 'loop-creator', en: 'realizing they voluntarily coded the time loop to avoid a tragic memory', bn: 'ধরা পড়ে এক মর্মান্তিক স্মৃতি ভুলতেই তিনি নিজেই এই মানসিক লুপটি বানিয়েছিলেন' },
  { id: 'sound-erasure', en: 'discovering that every sound they delete in the software erases real people', bn: 'বোঝা যায় সফটওয়্যারে যে অডিও তিনি মুছে দিচ্ছেন তা বাস্তবে মানুষকে নিশ্চিহ্ন করছে' },
  { id: 'living-film', en: 'finding that the 35mm negative is breathing and projecting their own thoughts', bn: 'দেখা যায় ফিল্মের নেগেটিভটি নিজে নিশ্বাস নিচ্ছে এবং তার মনের চিন্তা প্রজেক্ট করছে' },
];

export function StoryConceptGame({ currentLang, directorsCut }: StoryConceptGameProps) {
  const [selectedProtagonist, setSelectedProtagonist] = useState<number>(0);
  const [selectedCatalyst, setSelectedCatalyst] = useState<number>(0);
  const [selectedSetting, setSelectedSetting] = useState<number>(0);
  const [selectedTwist, setSelectedTwist] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [savedLoglines, setSavedLoglines] = useState<string[]>([]);

  const isBn = currentLang === 'bn';

  // Calculate Auteur Director Rating based on selection alchemy
  const originalityScore = 88 + ((selectedProtagonist * 3 + selectedCatalyst * 5 + selectedTwist * 2) % 12);
  const dreadScore = 85 + ((selectedSetting * 4 + selectedCatalyst * 3) % 15);
  const cinematicScore = Math.round((originalityScore + dreadScore) / 2);

  const randomizeAll = () => {
    soundEngine.playShutter();
    setSelectedProtagonist(Math.floor(Math.random() * PROTAGONISTS.length));
    setSelectedCatalyst(Math.floor(Math.random() * CATALYSTS.length));
    setSelectedSetting(Math.floor(Math.random() * SETTINGS.length));
    setSelectedTwist(Math.floor(Math.random() * TWISTS.length));
  };

  const getLoglineEn = () => {
    const p = PROTAGONISTS[selectedProtagonist].en;
    const c = CATALYSTS[selectedCatalyst].en;
    const s = SETTINGS[selectedSetting].en;
    const t = TWISTS[selectedTwist].en;
    return `${p} ${c} ${s}, ${t}.`;
  };

  const getLoglineBn = () => {
    const p = PROTAGONISTS[selectedProtagonist].bn;
    const c = CATALYSTS[selectedCatalyst].bn;
    const s = SETTINGS[selectedSetting].bn;
    const t = TWISTS[selectedTwist].bn;
    return `${s}, ${p}। হঠাৎ তিনি ${c}—${t}।`;
  };

  const currentLogline = isBn ? getLoglineBn() : getLoglineEn();

  const handleCopy = () => {
    soundEngine.playSuccess();
    navigator.clipboard.writeText(currentLogline);
    setCopied(true);
    directorsQuest.unlockBadge('badge-concept');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToDossier = () => {
    soundEngine.playClapper();
    directorsQuest.unlockBadge('badge-concept');
    if (!savedLoglines.includes(currentLogline)) {
      setSavedLoglines((prev) => [currentLogline, ...prev].slice(0, 4));
    }
  };

  return (
    <div className="space-y-8">
      {/* Game Briefing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 font-mono-film text-xs font-bold tracking-widest uppercase">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>{isBn ? 'গেম ০১ : স্টোরি আইডিয়া ও লগলাইন সিন্থেসাইজার' : 'GAME 01 : STORY CONCEPT & LOGLINE CRUCIBLE'}</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 font-mono-film">
            {isBn
              ? 'সিনেমা নির্মাণের প্রথম ধাপ: একটি আকর্ষণীয় চরিত্র, চমকপ্রদ অনুঘটক, গভীর পরিবেশ এবং দুর্দান্ত টুইস্ট মিলিয়ে অনন্য থ্রিলার গল্প তৈরি করুন।'
              : 'The origin of auteur cinema: Mix protagonist flaws, supernatural anomalies, moody locations, and psychological twists to synthesize award-worthy short film premises.'}
          </p>
        </div>

        <button
          onClick={randomizeAll}
          data-cursor="SPIN"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono-film text-xs font-bold tracking-wider hover:bg-cyan-500/30 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] shrink-0"
        >
          <Dices className="w-4 h-4 animate-spin-slow" />
          <span>{isBn ? 'রিল ঘুরিয়ে র‍্যান্ডম করুন' : 'SPIN CONCEPT REELS'}</span>
        </button>
      </div>

      {/* 4 Interactive Story Pillar Reels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reel 1: Protagonist */}
        <div className="p-4 rounded-xl bg-[#090e1c] border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono-film text-cyan-400 font-bold uppercase tracking-wider">
            <span>{isBn ? '১. চরিত্র ও মানসিক গভীরতা' : '1. PROTAGONIST & FLAW'}</span>
            <span className="text-neutral-500 text-[10px]">REEL 01</span>
          </div>
          <div className="space-y-1.5">
            {PROTAGONISTS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedProtagonist(idx);
                }}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-mono-film transition-all ${
                  selectedProtagonist === idx
                    ? 'bg-cyan-500/20 border border-cyan-400/60 text-white font-semibold shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'bg-neutral-900/50 border border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                {isBn ? p.bn : p.en}
              </button>
            ))}
          </div>
        </div>

        {/* Reel 2: Catalyst */}
        <div className="p-4 rounded-xl bg-[#090e1c] border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono-film text-amber-400 font-bold uppercase tracking-wider">
            <span>{isBn ? '২. ঘটনা ও অতিপ্রাকৃতিক অনুঘটক' : '2. INCITING ANOMALY'}</span>
            <span className="text-neutral-500 text-[10px]">REEL 02</span>
          </div>
          <div className="space-y-1.5">
            {CATALYSTS.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedCatalyst(idx);
                }}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-mono-film transition-all ${
                  selectedCatalyst === idx
                    ? 'bg-amber-500/20 border border-amber-400/60 text-white font-semibold shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                    : 'bg-neutral-900/50 border border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                {isBn ? c.bn : c.en}
              </button>
            ))}
          </div>
        </div>

        {/* Reel 3: Setting */}
        <div className="p-4 rounded-xl bg-[#090e1c] border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono-film text-emerald-400 font-bold uppercase tracking-wider">
            <span>{isBn ? '৩. সিনেমাটিক দৃশ্যপট ও আবহ' : '3. ATMOSPHERIC SETTING'}</span>
            <span className="text-neutral-500 text-[10px]">REEL 03</span>
          </div>
          <div className="space-y-1.5">
            {SETTINGS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedSetting(idx);
                }}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-mono-film transition-all ${
                  selectedSetting === idx
                    ? 'bg-emerald-500/20 border border-emerald-400/60 text-white font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'bg-neutral-900/50 border border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                {isBn ? s.bn : s.en}
              </button>
            ))}
          </div>
        </div>

        {/* Reel 4: Twist */}
        <div className="p-4 rounded-xl bg-[#090e1c] border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono-film text-purple-400 font-bold uppercase tracking-wider">
            <span>{isBn ? '৪. মানসিক মোচড় ও চূড়ান্ত সত্য' : '4. PSYCHOLOGICAL TWIST'}</span>
            <span className="text-neutral-500 text-[10px]">REEL 04</span>
          </div>
          <div className="space-y-1.5">
            {TWISTS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedTwist(idx);
                }}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-mono-film transition-all ${
                  selectedTwist === idx
                    ? 'bg-purple-500/20 border border-purple-400/60 text-white font-semibold shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                    : 'bg-neutral-900/50 border border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                {isBn ? t.bn : t.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Synthesized Master Logline Viewport */}
      <motion.div
        key={currentLogline}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl border border-cyan-500/30 bg-gradient-to-b from-[#0a1224] to-[#040813] shadow-[0_15px_40px_rgba(0,0,0,0.8)] space-y-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2 font-mono-film text-xs text-cyan-400 uppercase tracking-widest font-bold">
            <Film className="w-4 h-4" />
            <span>{isBn ? 'সিনেমাটিক লগলাইন ড্রাফট' : 'AUTEUR SHORT FILM LOGLINE'}</span>
          </div>

          {/* Telemetry Scores */}
          <div className="flex items-center gap-3 font-mono-film text-[10px]">
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              ORIGINALITY: {originalityScore}%
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300">
              DREAD: {dreadScore}%
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">
              AUTEUR RATING: {cinematicScore}/100
            </span>
          </div>
        </div>

        {/* Screenplay Courier Pitch Text */}
        <p className="font-mono-film text-sm sm:text-base text-neutral-200 leading-relaxed border-l-2 border-cyan-400 pl-4 py-1 italic">
          "{currentLogline}"
        </p>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
          <div className="text-[10px] font-mono-film text-neutral-400">
            {isBn ? 'ফরম্যাট: ২.৩৫:১ অ্যানামরফিক সাইকোলজিক্যাল থ্রিলার' : 'FORMAT: 2.35:1 ANAMORPHIC PSYCHOLOGICAL SHORT FILM'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToDossier}
              data-cursor="SAVE"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-mono-film text-neutral-200 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{isBn ? 'ডোজিয়ারে সেভ করুন' : 'SAVE TO DOSSIER'}</span>
            </button>

            <button
              onClick={handleCopy}
              data-cursor="COPY"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-cyan-500 text-black hover:bg-cyan-400 text-xs font-mono-film font-bold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isBn ? 'কপি হয়েছে!' : 'COPIED!') : (isBn ? 'লগলাইন কপি করুন' : 'COPY LOGLINE')}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Saved Concepts Drawer */}
      {savedLoglines.length > 0 && (
        <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-2 font-mono-film text-xs">
          <div className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">
            {isBn ? 'সংরক্ষিত ফিল্ম ধারণাসমূহ (SAVED CONCEPTS)' : 'SAVED FILM DOSSIER CONCEPTS'}
          </div>
          <ul className="space-y-1.5 text-neutral-400 text-[11px]">
            {savedLoglines.map((l, i) => (
              <li key={i} className="pl-3 border-l border-neutral-700 hover:text-neutral-200 transition-colors">
                • {l}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
