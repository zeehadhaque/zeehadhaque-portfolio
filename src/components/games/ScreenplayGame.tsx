import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, CheckCircle2, XCircle, Award, Sparkles, ChevronRight, Eye } from 'lucide-react';
import { Language } from '../../types';
import { soundEngine } from '../../utils/audio';
import { directorsQuest } from '../../utils/directorsQuest';

interface ScreenplayGameProps {
  currentLang: Language;
  directorsCut?: boolean;
}

interface ScriptScene {
  id: string;
  slugline: string;
  contextBn: string;
  contextEn: string;
  character: string;
  options: {
    id: string;
    type: 'amateur' | 'melodrama' | 'auteur';
    textEn: string;
    textBn: string;
    critiqueEn: string;
    critiqueBn: string;
    score: number;
  }[];
}

const SCENES: ScriptScene[] = [
  {
    id: 'scene-01',
    slugline: 'INT. DILAPIDATED GAZIPUR APARTMENT - 3:00 AM',
    contextEn: 'Siam sits across from Sihab. A bloodied 35mm film canister sits between them. Tension is suffocating.',
    contextBn: 'সিয়াম ও সিহাব একটি টেবিলের দুই প্রান্তে বসা। মাঝে রক্তমাখা ৩৫ মিমি ফিল্মের ক্যানিস্টার। নিস্তব্ধতা যেন নিশ্বাস বন্ধ করে দেয়।',
    character: 'SIAM',
    options: [
      {
        id: 'opt-a',
        type: 'amateur',
        textEn: '"Sihab, why did you bring this cursed film here? You know it has caused three deaths already and now the police might come!"',
        textBn: '"সিহাব, তুমি এই অভিশপ্ত ফিল্ম কেন আনলে? তুমি জানো এটা দিয়ে তিনজন মারা গেছে আর এখন পুলিশ আসবে!"',
        critiqueEn: 'AMATEUR EXPOSITION: Characters are saying things they both already know purely to feed exposition to the audience. Dead cinema.',
        critiqueBn: 'অনভিজ্ঞ এক্সপোজিশন: দুজন চরিত্র যা ইতিমধ্যে জানে তা-ই সংলাপে বলে দর্শকদের বোঝাচ্ছে। সিনেমার ভাষা নষ্ট হয়েছে।',
        score: 30,
      },
      {
        id: 'opt-b',
        type: 'melodrama',
        textEn: '"I can never forgive you for this betrayal! My heart is breaking into a million pieces tonight!"',
        textBn: '"আমি তোমাকে কখনো ক্ষমা করব না! আজ রাতে আমার ভেতরটা ভেঙে টুকরো টুকরো হয়ে যাচ্ছে!"',
        critiqueEn: 'MELODRAMA: Overstated emotional dialogue robs the scene of tension. Words replace psychology.',
        critiqueBn: 'অতিনাটকীয়তা: আবেগকে সস্তায় মুখে প্রকাশ করার ফলে দৃশ্যের অন্তর্গত ভয় ও টানাপোড়েন নষ্ট হয়ে গেছে।',
        score: 55,
      },
      {
        id: 'opt-c',
        type: 'auteur',
        textEn: '(reaches for the glass of water; his fingers tremble against the rim)\n"The projector is already warm."',
        textBn: '(পানির গ্লাসে হাত বাড়ায়; আঙুলের ডগা কাঁচে মৃদু কাঁপুনি তোলে)\n"প্রজেক্টর কিন্তু চালু করা আছে।"',
        critiqueEn: 'AUTEUR SUBTEXT: Masterful! Six words and a physical tremor convey guilt, dread, and unavoidable momentum. The silence carries the terror.',
        critiqueBn: 'মাস্টারপিস সাবটেক্সট! মাত্র ছয়টি শব্দ ও হাতের কম্পন অপরাধবোধ, ভয় এবং নিশ্চিত পরিণতি বুঝিয়ে দেয়। বাকিটা আলোর কাজ।',
        score: 100,
      },
    ],
  },
  {
    id: 'scene-02',
    slugline: 'INT. HOSPITAL AUTOPSY SUITE - NIGHT',
    contextEn: 'Under flickering 4300K cyan fluorescent tube light, the mortician examines an empty operating table.',
    contextBn: '৪৩০০K শীতল নীলাভ আলোয় মর্গ সহকারী একটি শূন্য টেবিলের দিকে তাকিয়ে আছেন।',
    character: 'MORTICIAN',
    options: [
      {
        id: 'opt-a',
        type: 'amateur',
        textEn: '"Oh no! Where did the body go? I locked the cold room door with my iron key just twenty minutes ago!"',
        textBn: '"হায় খোদা! লাশ কোথায় গেল? আমি তো বিশ মিনিট আগে নিজ হাতে দরজায় তালা মেরেছিলাম!"',
        critiqueEn: 'ON-THE-NOSE: Explains actions the camera could show visually. Never describe what can be shot.',
        critiqueBn: 'ক্যামেরায় যা দেখানো যায় তা সংলাপে বলা মারাত্মক ভুল। দর্শক চোখে দেখতে চায়, কানে শুনতে নয়।',
        score: 35,
      },
      {
        id: 'opt-b',
        type: 'auteur',
        textEn: '(Stops cold in the doorway. The zinc table glistens wet. He gently lowers the iron key into his lab coat pocket and switches off the light. In darkness, his breathing slows.)',
        textBn: '(দরজায় দাঁড়িয়ে স্তব্ধ হয়ে যান। ভেজা স্টিলের টেবিলটা চকচক করছে। নিঃশব্দে চাবিটা পকেটে রেখে তিনি ঘরের আলো নিভিয়ে দেন। অন্ধকারে তার নিশ্বাসের শব্দ নামে।)',
        critiqueEn: 'PURE VISUAL CINEMA: Zero spoken words. The physical act of turning off the light reveals that he already knows WHO took the body. Unbeatable tension.',
        critiqueBn: 'বিশুদ্ধ ভিজ্যুয়াল সিনেমা: কোনো সংলাপ নেই। কিন্তু আলো নিভিয়ে দেওয়া প্রমাণ করে তিনি জানেন লাশটি কে নিয়েছে। অপূর্ব আবহ!',
        score: 100,
      },
      {
        id: 'opt-c',
        type: 'melodrama',
        textEn: '"Ghosts! It must be the evil spirit haunting this Gazipur hospital ward again!"',
        textBn: '"ভূত! নিশ্চয়ই এই হাসপাতালের সেই অপশক্তি আবার ফিরে এসেছে!"',
        critiqueEn: 'GENERIC B-GRADE: Names the monster too early and ruins the psychological ambiguity.',
        critiqueBn: 'সস্তা ভয়: রহস্য উন্মোচন না করে সরাসরি অপশক্তি ঘোষণা করলে দর্শকের কৌতূহল শূন্য হয়ে যায়।',
        score: 40,
      },
    ],
  },
];

export function ScreenplayGame({ currentLang, directorsCut }: ScreenplayGameProps) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState<number>(0);

  const isBn = currentLang === 'bn';
  const scene = SCENES[sceneIdx];
  const activeOption = scene.options.find((o) => o.id === selectedOpt);

  const handleSelect = (optId: string) => {
    soundEngine.playClick();
    setSelectedOpt(optId);
    const chosen = scene.options.find((o) => o.id === optId);
    if (chosen?.type === 'auteur') {
      soundEngine.playSuccess();
      directorsQuest.unlockBadge('badge-screenplay');
    } else {
      soundEngine.playShutter();
    }
  };

  const nextScene = () => {
    soundEngine.playClick();
    setSelectedOpt(null);
    setSceneIdx((prev) => (prev + 1) % SCENES.length);
  };

  return (
    <div className="space-y-6 font-mono-film">
      {/* Briefing */}
      <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold tracking-widest uppercase">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>{isBn ? 'গেম ০৩ : চিত্রনাট্য সংলাপ ও সাবটেক্সট ওয়ার্কশপ' : 'GAME 03 : SCREENPLAY SUBTEXT & ACTION WORKSHOP'}</span>
        </div>
        <p className="text-xs text-neutral-300">
          {isBn
            ? 'সিনেমা নির্মাণের মূল দর্শন: যা আলো, নীরবতা ও ক্যামেরার চলনে বোঝানো যায়, তা সংলাপে বলা অপরাধ। সেরা সিনেমাটিক সংলাপ ও অ্যাকশন নির্বাচন করুন।'
            : 'The Golden Rule of Screenwriting: "Never say with dialogue what you can convey with light, silence, and camera movement." Choose the auteur option.'}
        </p>
      </div>

      {/* Screenplay Teleprompter Viewport */}
      <div className="p-6 rounded-xl bg-[#0c101d] border border-neutral-800 shadow-[0_15px_45px_rgba(0,0,0,0.85)] space-y-4">
        {/* Slugline in Standard Screenplay Courier */}
        <div className="flex items-center justify-between border-b border-neutral-800/90 pb-3">
          <span className="text-amber-400 font-bold tracking-wider text-xs">
            {scene.slugline}
          </span>
          <span className="text-[10px] text-neutral-500">
            SCENE {sceneIdx + 1} OF {SCENES.length}
          </span>
        </div>

        {/* Action Description */}
        <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed italic border-l-2 border-cyan-400 pl-3 py-0.5">
          {isBn ? scene.contextBn : scene.contextEn}
        </p>

        {/* Character Cue */}
        <div className="text-center pt-2">
          <span className="font-bold text-xs text-cyan-300 tracking-[0.2em]">
            {scene.character}
          </span>
        </div>

        {/* Screenplay Choices */}
        <div className="space-y-2.5 pt-1">
          {scene.options.map((opt) => {
            const isSelected = selectedOpt === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`w-full text-left p-3.5 rounded-lg border text-xs transition-all whitespace-pre-line ${
                  isSelected
                    ? opt.type === 'auteur'
                      ? 'bg-emerald-950/40 border-emerald-400/80 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-amber-950/30 border-amber-400/60 text-neutral-200'
                    : 'bg-neutral-900/50 border-neutral-800/80 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900'
                }`}
              >
                {isBn ? opt.textBn : opt.textEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Director's Critique Feedback */}
      <AnimatePresence>
        {activeOption && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              activeOption.type === 'auteur'
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                : 'bg-amber-950/30 border-amber-500/50 text-amber-300'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                {activeOption.type === 'auteur' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-amber-400" />
                )}
                <span>
                  {activeOption.type === 'auteur'
                    ? isBn
                      ? '১০/১০ নিখুঁত সিনেমাটিক ভাষা!'
                      : '10/10 PERFECT AUTEUR SUBTEXT'
                    : isBn
                    ? 'চিত্রনাট্যের দুর্বলতা শনাক্ত!'
                    : 'SCREENWRITING DEFECT DETECTED'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 border border-current">
                  SCORE: {activeOption.score}/100
                </span>
              </div>
              <p className="text-xs text-neutral-300">
                {isBn ? activeOption.critiqueBn : activeOption.critiqueEn}
              </p>
            </div>

            <button
              onClick={nextScene}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 text-xs font-bold shrink-0 transition-colors"
            >
              <span>{isBn ? 'পরবর্তী দৃশ্য' : 'NEXT SCENE'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
