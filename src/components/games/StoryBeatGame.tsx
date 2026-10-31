import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle, AlertCircle, RotateCcw, Trophy, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { Language } from '../../types';
import { soundEngine } from '../../utils/audio';
import { directorsQuest } from '../../utils/directorsQuest';

interface StoryBeatGameProps {
  currentLang: Language;
  directorsCut?: boolean;
}

interface BeatScenario {
  id: string;
  title: { en: string; bn: string };
  genre: { en: string; bn: string };
  premise: { en: string; bn: string };
  correctBeats: {
    act: string;
    labelEn: string;
    labelBn: string;
    descEn: string;
    descBn: string;
  }[];
}

const SCENARIOS: BeatScenario[] = [
  {
    id: 'mirror-paradox',
    title: {
      en: 'The Doppelgänger Delay (Like "Reflect")',
      bn: 'আয়নার দ্বিধা ("রিফ্লেক্ট" এর অনুসরণে)',
    },
    genre: {
      en: 'Psychological Horror • Silent Cinema',
      bn: 'সাইকোলজিক্যাল হরর • নির্বাক চলচ্চিত্র',
    },
    premise: {
      en: 'A young man standing before an antique bathroom mirror notices his reflection hesitates before copying him.',
      bn: 'বাথরুমের প্রাচীন আয়নার সামনে দাঁড়িয়ে এক যুবক লক্ষ্য করে তার প্রতিবিম্ব তার আগে বা পরে দ্বিধাগ্রস্ত ভঙ্গিতে নড়ছে।',
    },
    correctBeats: [
      {
        act: 'ACT I: HOOK',
        labelEn: 'Routine in Silence',
        labelBn: 'নিঃশব্দ নিত্যকর্ম',
        descEn: 'Close-up of tap water dripping. Protagonist washes face under cold fluorescent light, feeling an invisible weight.',
        descBn: 'পানির ফোঁটার ক্লোজ-আপ। ৪৩০০K শীতল আলোয় নায়ক মুখ ধোয়, চারপাশে তীব্র মানসিক চাপ।',
      },
      {
        act: 'ACT I: CATALYST',
        labelEn: 'The Desync Glitch',
        labelBn: 'প্রতিবিম্বের অমিল',
        descEn: 'He lifts his head to check the mirror; his reflection blinks two full seconds after his physical eyelids open.',
        descBn: 'মাথা তুলতেই দেখা যায় আয়নার প্রতিবিম্ব চোখের পাতা ফেলছে দুই সেকেন্ড দেরিতে।',
      },
      {
        act: 'ACT II: ESCALATION',
        labelEn: 'Testing the Glass',
        labelBn: 'কাঁচের পরীক্ষা',
        descEn: 'He taps three fingers against the mirror. The reflection places its palm flat against the glass, refusing to mimic.',
        descBn: 'তিনি কাঁচে তিন আঙুল ছোঁয়ান। কিন্তু প্রতিবিম্ব অনুকরণ না করে পুরো হাতের তালু কাঁচে চেপে ধরে।',
      },
      {
        act: 'ACT II: ABYSS',
        labelEn: 'The Reverse Breach',
        labelBn: 'বিপরীত রূপান্তর',
        descEn: 'The bathroom light bulb pops out. In the darkness, the reflection breathes warm steam onto the glass from the inside.',
        descBn: 'হঠাৎ বাল্বটি বিস্ফোরিত হয়। অন্ধকারে দেখা যায় আয়নার ভেতর থেকে গরম নিঃশ্বাসের বাষ্প জমছে।',
      },
      {
        act: 'ACT III: CLIMAX',
        labelEn: 'The Final Swap',
        labelBn: 'চূড়ান্ত প্রতিস্থাপন',
        descEn: 'The protagonist backs away into the hallway, but realizes he is now trapped inside the glass watching his reflection walk free.',
        descBn: 'নায়ক পিছিয়ে করিডোরে পালাতে গিয়ে বুঝতে পারেন তিনি নিজেই এখন আয়নার ভেতরে বন্দি, আর প্রতিবিম্ব স্বাধীন হয়ে বাইরে হাঁটছে।',
      },
    ],
  },
  {
    id: 'forest-whisper',
    title: {
      en: 'The Cursed Negative (Like "Flow: The Myst")',
      bn: 'কুয়াশার অভিশাপ ("ফ্লো: দ্য মিস্ট" এর অনুসরণে)',
    },
    genre: {
      en: 'Supernatural Mystery • Atmospheric Thriller',
      bn: 'অতিপ্রাকৃতিক রহস্য • আবহনির্ভর থ্রিলার',
    },
    premise: {
      en: 'A mobile filmmaker in Bhawal jungle discovers an unrecorded figure standing in every frame of his 4K footage.',
      bn: 'ভাওয়ালের জঙ্গলে ভিডিও শুট করতে গিয়ে এক মোবাইল সিনেমাটোগ্রাফার আবিষ্কার করেন প্রতিটা ফ্রেমে এক অজানা মূর্তি দাঁড়িয়ে আছে।',
    },
    correctBeats: [
      {
        act: 'ACT I: HOOK',
        labelEn: 'Dawn in the Mist',
        labelBn: 'কুয়াশার ভোর',
        descEn: 'Lush 2.35:1 slow camera track through dew-covered foliage, seeking serene nature footage.',
        descBn: 'শিশিরভেজা পাতার ভেতর দিয়ে ২.৩৫:১ ফ্রেমের ধীর ক্যামেরা মুভমেন্ট, প্রকৃতির সৌন্দর্য ধারণের উদ্দেশ্যে।',
      },
      {
        act: 'ACT I: CATALYST',
        labelEn: 'The Phantom Silhouette',
        labelBn: 'ছায়ামূর্তি আবিষ্কার',
        descEn: 'Reviewing clips on the phone monitor, an elongated silhouette stands motionless behind the mist in every take.',
        descBn: 'ফোনের মনিটরে ফুটেজ প্লে করতেই দেখা যায় কুয়াশার গভীরে এক অচেনা লম্বা ছায়ামূর্তি দাঁড়িয়ে আছে।',
      },
      {
        act: 'ACT II: ESCALATION',
        labelEn: 'The Moving Proximity',
        labelBn: 'নিকটবর্তী হওয়া',
        descEn: 'With each successive video file, the figure is 5 meters closer to the camera lens, despite nobody having been in the woods.',
        descBn: 'পরপর প্রতিটি ভিডিও ফাইলে দেখা যায় ছায়ামূর্তিটি ৫ মিটার করে ক্যামেরার লেন্সের দিকে এগিয়ে আসছে।',
      },
      {
        act: 'ACT II: ABYSS',
        labelEn: 'Battery Drain & Silence',
        labelBn: 'ব্যাটারি শূন্য ও নৈশব্দ',
        descEn: 'Natural jungle sounds abruptly terminate. The phone screen glitches with vertical scanlines at 1% battery.',
        descBn: 'জঙ্গলের পাখির ডাক সম্পূর্ণ থেমে যায়। ফোনের ব্যাটারি ১%-এ নেমে আসে এবং মনিটরে গ্লিচ শুরু হয়।',
      },
      {
        act: 'ACT III: CLIMAX',
        labelEn: 'The Viewfinder Trap',
        labelBn: 'লেন্সের ভেতর মুক্তি',
        descEn: 'He lowers the mobile camera—the woods are empty. He looks through the screen—the hand is reaching out to grasp his throat.',
        descBn: 'ক্যামেরা নামালে জঙ্গল ফাঁকা, কিন্তু স্ক্রিনের ভেতর তাকাতেই দেখা যায় হাতটি স্ক্রিন ভেদ করে এগিয়ে আসছে।',
      },
    ],
  },
];

export function StoryBeatGame({ currentLang, directorsCut }: StoryBeatGameProps) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const scenario = SCENARIOS[scenarioIdx];
  const isBn = currentLang === 'bn';

  // Current beat sequence order (initially scrambled)
  const [userOrder, setUserOrder] = useState<number[]>([2, 0, 4, 1, 3]);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const swapBeats = (fromIdx: number, toIdx: number) => {
    soundEngine.playClick();
    const newOrder = [...userOrder];
    const temp = newOrder[fromIdx];
    newOrder[fromIdx] = newOrder[toIdx];
    newOrder[toIdx] = temp;
    setUserOrder(newOrder);
    setScore(null);
    setCompleted(false);
  };

  const evaluateStructure = () => {
    soundEngine.playClapper();
    let correctCount = 0;
    userOrder.forEach((val, idx) => {
      if (val === idx) correctCount++;
    });

    const calculatedScore = Math.round((correctCount / 5) * 100);
    setScore(calculatedScore);

    if (calculatedScore === 100) {
      soundEngine.playSuccess();
      setCompleted(true);
      directorsQuest.unlockBadge('badge-storybeat');
    }
  };

  const resetOrder = () => {
    soundEngine.playClick();
    setUserOrder([3, 1, 0, 4, 2]);
    setScore(null);
    setCompleted(false);
  };

  const switchScenario = (idx: number) => {
    soundEngine.playShutter();
    setScenarioIdx(idx);
    setUserOrder([2, 4, 1, 0, 3]);
    setScore(null);
    setCompleted(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Scenario Switcher */}
      <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-amber-400 font-mono-film text-xs font-bold tracking-widest uppercase">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>{isBn ? 'গেম ০২ : স্টোরি ন্যারেটিভ বিট বোর্ড' : 'GAME 02 : 3-ACT NARRATIVE BEAT BOARD'}</span>
          </div>

          <div className="flex items-center gap-2">
            {SCENARIOS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => switchScenario(i)}
                className={`px-3 py-1 rounded text-xs font-mono-film tracking-wider transition-colors ${
                  scenarioIdx === i
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                }`}
              >
                {isBn ? `দৃশ্যপট ${i + 1}` : `SCENARIO ${i + 1}`}
              </button>
            ))}
          </div>
        </div>

        <div className="border-l-2 border-amber-400 pl-3 py-1">
          <h4 className="font-mono-film text-sm font-bold text-white uppercase tracking-wider">
            {isBn ? scenario.title.bn : scenario.title.en}
          </h4>
          <p className="text-xs text-neutral-400 font-mono-film mt-0.5">
            {isBn ? scenario.premise.bn : scenario.premise.en}
          </p>
        </div>
      </div>

      {/* Narrative Board Instructions */}
      <div className="flex items-center justify-between text-xs font-mono-film text-neutral-400">
        <span>
          {isBn
            ? 'চিত্রনাট্যের সঠিক ৩-অ্যাক্ট গতি নিশ্চিত করতে কার্ডগুলোকে ক্লিক করে সঠিক ক্রমানুসারে সাজান:'
            : 'Arrange the 5 narrative beats in dramatic order from Opening Hook to Auteur Climax:'}
        </span>
        <button
          onClick={resetOrder}
          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors text-[11px]"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{isBn ? 'রিসেট' : 'SHUFFLE'}</span>
        </button>
      </div>

      {/* 5 Interactive Beat Cards */}
      <div className="space-y-3">
        {userOrder.map((beatIdx, slotIdx) => {
          const beat = scenario.correctBeats[beatIdx];
          const isSlotCorrect = score !== null && beatIdx === slotIdx;
          const isSlotWrong = score !== null && beatIdx !== slotIdx;

          return (
            <motion.div
              key={`${beatIdx}-${slotIdx}`}
              layout
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isSlotCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : isSlotWrong
                  ? 'bg-rose-950/30 border-rose-500/40'
                  : 'bg-[#090e1c] border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono-film text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-bold">
                    SLOT 0{slotIdx + 1}
                  </span>
                  <span className="font-mono-film text-xs text-amber-400 font-bold uppercase tracking-wider">
                    {isBn ? beat.labelBn : beat.labelEn}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono-film">
                    [{beat.act}]
                  </span>
                </div>
                <p className="text-xs text-neutral-300 font-mono-film">
                  {isBn ? beat.descBn : beat.descEn}
                </p>
              </div>

              {/* Reordering Up/Down Triggers */}
              <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                {slotIdx > 0 && (
                  <button
                    onClick={() => swapBeats(slotIdx, slotIdx - 1)}
                    className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono-film font-bold transition-colors"
                    title="Move Beat Earlier"
                  >
                    ▲ UP
                  </button>
                )}
                {slotIdx < userOrder.length - 1 && (
                  <button
                    onClick={() => swapBeats(slotIdx, slotIdx + 1)}
                    className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono-film font-bold transition-colors"
                    title="Move Beat Later"
                  >
                    ▼ DOWN
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Evaluation Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            onClick={evaluateStructure}
            data-cursor="TEST"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 text-xs font-mono-film font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)]"
          >
            <Layers className="w-4 h-4" />
            <span>{isBn ? 'প্লট স্ট্রাকচার পরীক্ষা করুন' : 'EVALUATE 3-ACT STRUCTURE'}</span>
          </button>

          {score !== null && (
            <div className="font-mono-film text-xs flex items-center gap-2">
              <span className="text-neutral-400">{isBn ? 'স্কোর:' : 'ACCURACY:'}</span>
              <span
                className={`text-sm font-bold ${
                  score === 100 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {score}%
              </span>
            </div>
          )}
        </div>

        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-emerald-400 font-mono-film text-xs font-bold"
          >
            <Trophy className="w-4 h-4" />
            <span>
              {isBn
                ? 'অনবদ্য চিত্রনাট্য আর্কিটেকচার! ৩-অ্যাক্ট স্ট্রাকচার নিখুঁতভাবে সাজানো হয়েছে।'
                : 'MASTERFUL PACING! The 3-act tension curve builds to perfection.'}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
