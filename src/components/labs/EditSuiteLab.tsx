import React, { useState } from 'react';
import { Film, Play, Square, Scissors, Move, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { soundEngine } from '../../utils/audio';

interface TimelineClip {
  id: string;
  name: string;
  type: string;
  duration: number; // in seconds
  color: string;
  shotSize: 'ECU' | 'CU' | 'MCU' | 'MS' | 'LS';
}

const AVAILABLE_CLIPS: TimelineClip[] = [
  { id: 'c1', name: 'EYE DILATION (EXTREME CU)', type: 'Tension', duration: 1.5, color: '#2C6EA6', shotSize: 'ECU' },
  { id: 'c2', name: 'FOOTSTEPS IN CORRIDOR', type: 'Movement', duration: 3.0, color: '#102B45', shotSize: 'MS' },
  { id: 'c3', name: 'DOOR KNOB SLOWLY TURNING', type: 'Suspense', duration: 2.5, color: '#7DBBFF', shotSize: 'CU' },
  { id: 'c4', name: 'SHADOW CROSSING WALL', type: 'Atmosphere', duration: 4.0, color: '#0A1422', shotSize: 'LS' },
  { id: 'c5', name: 'PROTAGONIST BREATHING HEAVILY', type: 'Reaction', duration: 2.0, color: '#2C6EA6', shotSize: 'MCU' },
  { id: 'c6', name: 'WATER DRIPPING FAUCET', type: 'Room Tone', duration: 1.8, color: '#A9D4FF', shotSize: 'CU' },
];

export const EditSuiteLab: React.FC = () => {
  const [timeline, setTimeline] = useState<TimelineClip[]>([
    AVAILABLE_CLIPS[0],
    AVAILABLE_CLIPS[1],
    AVAILABLE_CLIPS[2],
  ]);

  const [activeChallenge, setActiveChallenge] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadPos, setPlayheadPos] = useState(0);
  const addXP = useUniverseStore((s) => s.addXP);
  const completeChallenge = useUniverseStore((s) => s.completeChallenge);

  const challenges = [
    {
      title: 'CHALLENGE 01: BUILD TENSION IN 5 SHOTS',
      desc: 'Assemble exactly 5 shots starting with an establishing LS, cutting into tighter CUs, ending on an ECU.',
      check: (clips: TimelineClip[]) => clips.length === 5,
    },
    {
      title: 'CHALLENGE 02: PACING RHYTHM UNDER 10 SECONDS',
      desc: 'Ensure total cut duration is under 10 seconds to create high-velocity suspense.',
      check: (clips: TimelineClip[]) => clips.reduce((acc, c) => acc + c.duration, 0) <= 10,
    },
  ];

  const totalDuration = timeline.reduce((acc, c) => acc + c.duration, 0);

  const handleAddClip = (clip: TimelineClip) => {
    soundEngine.playFilmSlide?.();
    setTimeline((prev) => [...prev, { ...clip, id: `${clip.id}-${Date.now()}` }]);
  };

  const handleRemoveClip = (idx: number) => {
    soundEngine.playClick();
    setTimeline((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleVerifyChallenge = () => {
    const passed = challenges[activeChallenge].check(timeline);
    if (passed) {
      soundEngine.playSuccess();
      addXP('editing', 25);
      completeChallenge(`edit-challenge-${activeChallenge}`);
      alert(`EXCELLENT EDIT! You completed ${challenges[activeChallenge].title}. +25 Editing XP awarded!`);
    } else {
      soundEngine.playTensionTick?.();
      alert(`Edit requirements not met yet. Check the challenge guidelines above.`);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setPlayheadPos(0);
    } else {
      setIsPlaying(true);
      soundEngine.playShutter();
      let pos = 0;
      const interval = setInterval(() => {
        pos += 0.1;
        if (pos > totalDuration) {
          clearInterval(interval);
          setIsPlaying(false);
          setPlayheadPos(0);
        } else {
          setPlayheadPos(pos);
        }
      }, 100);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#020305] border border-[#102B45]">
        <div>
          <span className="font-mono text-xs text-[#7DBBFF] tracking-widest uppercase">
            RHYTHM & CONTINUITY // TIMELINE LAB
          </span>
          <h3 className="font-headline font-bold text-xl text-[#F2F0EB]">
            Directorial Edit Suite
          </h3>
          <p className="text-xs text-[#8A96A3] mt-0.5">
            Assemble shot scales, calibrate temporal holds, and master J-cut sound transitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayback}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-bold tracking-wider flex items-center gap-2 transition-all ${
              isPlaying
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                : 'bg-[#7DBBFF] text-[#020305] hover:bg-[#A9D4FF]'
            }`}
          >
            {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'PAUSE PREVIEW' : 'PLAY SEQUENCE'}</span>
          </button>
          <button
            onClick={handleVerifyChallenge}
            className="px-4 py-2 rounded-lg font-mono text-xs font-bold text-[#A9D4FF] bg-[#102B45] hover:bg-[#2C6EA6]/40 border border-[#2C6EA6] flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7DBBFF]" />
            <span>VERIFY CUT</span>
          </button>
        </div>
      </div>

      {/* Active Challenge Box */}
      <div className="p-4 rounded-xl bg-[#06090E] border border-[#2C6EA6]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs font-bold text-[#7DBBFF]">
            {challenges[activeChallenge].title}
          </div>
          <p className="text-xs text-[#8A96A3] mt-1">{challenges[activeChallenge].desc}</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#8A96A3]">CLIPS: {timeline.length}</span>
          <span className="text-[#102B45]">|</span>
          <span className="text-[#7DBBFF]">TOTAL: {totalDuration.toFixed(1)}s</span>
        </div>
      </div>

      {/* Interactive Timeline Track */}
      <div className="p-4 rounded-xl bg-[#020305] border border-[#102B45] space-y-3">
        <div className="flex justify-between items-center font-mono text-xs text-[#8A96A3]">
          <span>VIDEO TRACK 01 (2.39:1 CONFORM)</span>
          <span>PLAYHEAD: {playheadPos.toFixed(1)}s</span>
        </div>

        {/* Timeline Bar */}
        <div className="relative min-h-[90px] p-2 rounded-lg bg-[#06090E] border border-[#102B45] flex items-center gap-2 overflow-x-auto">
          {timeline.map((clip, idx) => (
            <div
              key={clip.id}
              className="relative p-2.5 rounded border border-[#2C6EA6] bg-[#081522] min-w-[130px] flex-1 flex flex-col justify-between h-16 group"
            >
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-[#7DBBFF] font-bold">{clip.shotSize}</span>
                <span className="text-[#8A96A3]">{clip.duration}s</span>
              </div>
              <div className="text-[11px] font-bold text-[#F2F0EB] truncate">{clip.name}</div>
              <button
                onClick={() => handleRemoveClip(idx)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-900 border border-rose-600 text-rose-200 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
          {timeline.length === 0 && (
            <div className="text-xs font-mono text-[#8A96A3] w-full text-center py-4">
              [ TIMELINE EMPTY — CLICK CLIPS BELOW TO ADD ]
            </div>
          )}
        </div>
      </div>

      {/* Available Clip Bin */}
      <div className="space-y-2">
        <div className="font-mono text-xs text-[#7DBBFF] tracking-widest uppercase">
          FOOTAGE BIN (CLICK TO INSERT INTO TIMELINE)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {AVAILABLE_CLIPS.map((clip) => (
            <button
              key={clip.id}
              onClick={() => handleAddClip(clip)}
              className="p-3 rounded-lg bg-[#06090E] hover:bg-[#081522] border border-[#102B45] hover:border-[#7DBBFF] transition-all text-left flex flex-col justify-between"
            >
              <div className="flex justify-between text-[10px] font-mono text-[#8A96A3] mb-1">
                <span className="text-[#7DBBFF] font-bold">{clip.shotSize}</span>
                <span>{clip.duration}s</span>
              </div>
              <div className="text-xs font-semibold text-[#F2F0EB] mb-1">{clip.name}</div>
              <div className="text-[10px] font-mono text-[#8A96A3]">{clip.type}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
