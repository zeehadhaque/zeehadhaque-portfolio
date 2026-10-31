import React from 'react';
import { useUniverseStore } from '../../store/universeStore';
import { motion } from 'motion/react';
import { Target, BookOpen, Clock, Award, BarChart } from 'lucide-react';

export const AcademyDashboard: React.FC = () => {
  const { xp, courseProgress, getDirectorRank } = useUniverseStore();
  const rank = getDirectorRank();
  const totalXP = useUniverseStore((s) => s.getTotalXP)();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rank Card */}
        <div className="bg-[#081522] p-4 rounded-xl border border-[#2C6EA6]">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Award className="w-5 h-5" />
            <h3 className="font-bold">CURRENT RATING</h3>
          </div>
          <p className="text-2xl font-cinematic text-white">{rank}</p>
          <p className="text-sm text-neutral-400">{totalXP} XP Total</p>
        </div>

        {/* Progress Card */}
        <div className="bg-[#081522] p-4 rounded-xl border border-[#2C6EA6]">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Target className="w-5 h-5" />
            <h3 className="font-bold">PROGRESS</h3>
          </div>
          <p className="text-sm text-neutral-400">
            {Object.keys(courseProgress).length} Modules Started
          </p>
        </div>
      </div>

      {/* Roadmap Visualization */}
      <div className="bg-[#04070D] p-6 rounded-xl border border-[#102B45]">
        <h2 className="text-white font-cinematic text-lg mb-4">FILMMAKER ROADMAP</h2>
        <div className="flex flex-col gap-2">
          {['LEVEL 01: BEGINNER ▼', 'LEVEL 02: VISUAL THINKER ▼', 'LEVEL 03: CAMERA OPERATOR ▼', '...'].map((lvl) => (
            <div key={lvl} className="p-2 border-b border-[#102B45] text-xs font-mono text-neutral-500">
              {lvl}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
