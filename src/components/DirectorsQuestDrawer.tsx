import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  X,
  Sparkles,
  CheckCircle2,
  Lock,
  Share2,
  RotateCcw,
  Film,
  Trophy,
  ChevronRight,
  Download,
} from 'lucide-react';
import { Language } from '../types';
import { soundEngine } from '../utils/audio';
import {
  directorsQuest,
  CINEMA_BADGES,
  DIRECTOR_RANKS,
  CinemaBadge,
  DirectorRank,
  QuestState,
} from '../utils/directorsQuest';

interface DirectorsQuestDrawerProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
}

export function DirectorsQuestDrawer({ currentLang, isOpen, onClose }: DirectorsQuestDrawerProps) {
  const [questState, setQuestState] = useState<QuestState>(directorsQuest.getState());
  const [selectedBadge, setSelectedBadge] = useState<CinemaBadge | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const isBn = currentLang === 'bn';

  useEffect(() => {
    return directorsQuest.subscribe((state) => {
      setQuestState({ ...state });
    });
  }, []);

  if (!isOpen) return null;

  const currentRank = directorsQuest.getCurrentRank();
  const unlockedCount = questState.unlockedBadgeIds.length;
  const totalBadges = CINEMA_BADGES.length;
  const progressPercent = Math.round((unlockedCount / totalBadges) * 100);

  // Next rank calculation
  const nextRankIndex = DIRECTOR_RANKS.findIndex((r) => r.level === currentRank.level) + 1;
  const nextRank = nextRankIndex < DIRECTOR_RANKS.length ? DIRECTOR_RANKS[nextRankIndex] : null;

  const copyCertificate = () => {
    soundEngine.playSuccess();
    const certificateText = `
🎬 ======================================================== 🎬
       ZEEHAD HAQUE CINEMA ARCADIA // DIRECTOR'S QUEST
               AUTEUR MASTERY CERTIFICATE
🎬 ======================================================== 🎬

DIRECTOR RANK: ${currentRank.titleEn.toUpperCase()}
RANK LEVEL: LEVEL 0${currentRank.level} // ${currentRank.titleBn}
MASTERED MODULES: ${unlockedCount} / ${totalBadges} (${progressPercent}%)
TOTAL XP EARNED: ${questState.totalXp} XP

UNLOCKED CINEMA BADGES:
${CINEMA_BADGES.map(
  (b) =>
    `- [${questState.unlockedBadgeIds.includes(b.id) ? '✓ UNLOCKED' : '🔒 LOCKED'}] ${b.titleEn} (${b.titleBn}) • ${b.tier.toUpperCase()}`
).join('\n')}

FILMMAKER CODE: INDIE AUTEUR // GAZIPUR, DHAKA, BANGLADESH
AUTHENTICATED BY: ZEEHAD HAQUE CINEMATIC PORTFOLIO (2026 – CONT.)
============================================================
`;
    navigator.clipboard.writeText(certificateText);
    setCopyFeedback(isBn ? 'ডিরেক্টর সার্টিফিকেট কপি হয়েছে!' : 'Certificate copied to clipboard!');
    setTimeout(() => setCopyFeedback(null), 3500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-mono-film">
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#070b14] border border-cyan-500/40 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col z-10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">
                  {isBn ? 'ডিরেক্টরস কোয়েস্ট অগ্রগতি ব্যবস্থা' : "DIRECTOR'S QUEST MASTERY PROGRESSION"}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  {isBn ? 'সিনেমা ব্যাজ ও অটর পদমর্যাদা' : 'CINEMA BADGES & AUTEUR RANK'}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Rank Status Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-[#070b14] border border-neutral-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-full bg-cyan-500/5 blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1">
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest">
                    CURRENT AUTEUR RANK // বর্তমান পদমর্যাদা
                  </div>
                  <div className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: currentRank.color, boxShadow: `0 0 10px ${currentRank.color}` }}
                    />
                    <span>{isBn ? currentRank.titleBn : currentRank.titleEn}</span>
                  </div>
                  <div className="text-xs text-neutral-400">
                    LEVEL 0{currentRank.level} • {questState.totalXp} XP EARNED
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <span className="text-xs font-bold text-cyan-400 font-mono">
                    {unlockedCount} / {totalBadges} BADGES ({progressPercent}%)
                  </span>
                  {nextRank && (
                    <span className="text-[10px] text-neutral-400">
                      NEXT: {nextRank.minBadges - unlockedCount} MORE TO UNLOCK{' '}
                      <span className="text-white font-bold">{isBn ? nextRank.titleBn : nextRank.titleEn}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden mt-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 shadow-[0_0_10px_#00f0ff]"
                />
              </div>
            </div>

            {/* Badges Grid (11 Total) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300 font-bold uppercase tracking-wider">
                  {isBn ? '১১টি অনন্য সিনেমা ব্যাজ' : 'ALL 11 CINEMA BADGES'}
                </span>
                <span className="text-[10px] text-neutral-500">
                  {isBn ? 'ব্যাজে ক্লিক করে বিস্তারিত জানুন' : 'CLICK BADGE FOR DETAILS'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {CINEMA_BADGES.map((badge) => {
                  const isUnlocked = questState.unlockedBadgeIds.includes(badge.id);
                  const isSelected = selectedBadge?.id === badge.id;

                  return (
                    <div
                      key={badge.id}
                      onClick={() => {
                        soundEngine.playClick();
                        setSelectedBadge(badge);
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden group min-h-[120px] ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-400/40 shadow-lg'
                          : isUnlocked
                          ? 'border-amber-500/40 bg-neutral-900/90 hover:border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.1)]'
                          : 'border-neutral-800/80 bg-neutral-950/70 text-neutral-500 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isUnlocked
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                              : 'bg-neutral-900 text-neutral-600 border border-neutral-800'
                          }`}
                        >
                          {isUnlocked ? <Award className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                        </div>
                        <span
                          className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                            badge.tier === 'gold'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : badge.tier === 'silver'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : badge.tier === 'master'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-slate-500/20 text-slate-300 border border-slate-500/40'
                          }`}
                        >
                          {badge.tier}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div
                          className={`text-xs font-bold leading-tight uppercase truncate ${
                            isUnlocked ? 'text-white' : 'text-neutral-500'
                          }`}
                        >
                          {isBn ? badge.titleBn : badge.titleEn}
                        </div>
                        <div className="text-[9px] text-neutral-400 truncate">
                          +{badge.xp} XP • {isUnlocked ? '✓ UNLOCKED' : 'LOCKED'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Badge Inspection Card */}
            {selectedBadge && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-neutral-950 border border-cyan-500/50 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      {isBn ? selectedBadge.titleBn : selectedBadge.titleEn}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-bold">
                    +{selectedBadge.xp} XP • {selectedBadge.tier.toUpperCase()} TIER
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {isBn ? selectedBadge.conceptBn : selectedBadge.conceptEn}
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={copyCertificate}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)]"
              >
                <Download className="w-4 h-4" />
                <span>{isBn ? 'ডিরেক্টর সার্টিফিকেট কপি' : 'COPY AUTEUR CERTIFICATE'}</span>
              </button>

              {copyFeedback && (
                <span className="text-xs text-emerald-400 font-bold animate-pulse">{copyFeedback}</span>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors"
            >
              {isBn ? 'বন্ধ করুন' : 'CLOSE'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
