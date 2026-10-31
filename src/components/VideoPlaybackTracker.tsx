import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Film, ExternalLink, Activity } from 'lucide-react';
import { FilmProject, Language } from '../types';
import { soundEngine } from '../utils/audio';

interface VideoPlaybackTrackerProps {
  project: FilmProject;
  currentLang: Language;
  onCloseVideo?: () => void;
  directorsCut?: boolean;
}

// Utility to parse runtime string if durationInSeconds is not explicitly present
function parseRuntimeToSeconds(runtime: string): number {
  let seconds = 0;
  const minuteMatch = runtime.match(/(\d+)\s*m/i);
  const secondMatch = runtime.match(/(\d+)\s*s/i);
  if (minuteMatch) seconds += parseInt(minuteMatch[1], 10) * 60;
  if (secondMatch) seconds += parseInt(secondMatch[1], 10);
  return seconds > 0 ? seconds : 180; // fallback 3 minutes
}

function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatTimecode(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const f = Math.floor((sec % 1) * 24); // 24fps frames
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
}

export function VideoPlaybackTracker({
  project,
  currentLang,
  onCloseVideo,
  directorsCut = false,
}: VideoPlaybackTrackerProps) {
  const totalDuration = project.durationInSeconds || parseRuntimeToSeconds(project.runtime);
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Run the playback progress timer smoothly
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setElapsed((prev) => {
        if (prev >= totalDuration) {
          return totalDuration;
        }
        return prev + 0.5;
      });
    }, 500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, totalDuration]);

  const progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  const remainingSeconds = Math.max(0, totalDuration - elapsed);

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
    const newSeconds = newPercent * totalDuration;
    soundEngine.playClick();
    setElapsed(newSeconds);
  };

  const handleReset = () => {
    soundEngine.playClick();
    setElapsed(0);
    setIsPaused(false);
  };

  const handleTogglePause = () => {
    soundEngine.playClick();
    setIsPaused(!isPaused);
  };

  return (
    <div className="w-full bg-[#040711] border-t border-neutral-800 p-3 sm:p-4 font-mono-film text-xs select-none">
      {/* Top HUD Telemetry Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300">
            <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-red-500 animate-pulse'}`} />
            <span className="text-neutral-400 font-bold">
              {isPaused ? 'PAUSED' : 'STREAMING 24FPS'}
            </span>
          </span>

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-cyan-400 font-semibold">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>TC {formatTimecode(elapsed)}</span>
          </span>
        </div>

        {/* Time Remaining Indicator Highlight Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold transition-colors ${
              directorsCut
                ? 'bg-amber-950/70 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>REMAINING:</span>
            <span className="font-mono tracking-wider">
              -{formatSeconds(remainingSeconds)}
            </span>
          </div>

          <span className="text-neutral-500 text-[11px] hidden sm:inline">
            / {formatSeconds(totalDuration)} ({project.runtime})
          </span>
        </div>
      </div>

      {/* Visual Film Strip Scrubber Progress Bar */}
      <div className="relative group cursor-pointer py-1.5" onClick={handleScrub}>
        {/* Top 35mm micro perforations */}
        <div className="w-full h-[2px] bg-[repeating-linear-gradient(90deg,#000_0px,#000_5px,#374151_5px,#374151_8px)] opacity-60 mb-0.5" />

        <div className="relative w-full h-3 bg-neutral-900 rounded-sm border border-neutral-800 overflow-hidden">
          {/* Progress fill */}
          <div
            className={`h-full transition-all duration-200 relative ${
              directorsCut
                ? 'bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300'
                : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300'
            }`}
            style={{ width: `${progressPercent}%` }}
          >
            {/* Scrubber Playhead Light */}
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white shadow-[0_0_8px_#ffffff]" />
          </div>
        </div>

        {/* Bottom 35mm micro perforations */}
        <div className="w-full h-[2px] bg-[repeating-linear-gradient(90deg,#000_0px,#000_5px,#1f2937_5px,#1f2937_8px)] opacity-60 mt-0.5" />
      </div>

      {/* Playback Controls & Utility Actions */}
      <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-800/60 text-[11px] text-neutral-400">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePause}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-cyan-400 hover:text-white transition-colors"
            title={isPaused ? 'Resume Timer' : 'Pause Timer'}
          >
            {isPaused ? (
              <>
                <Play className="w-3 h-3 fill-current text-cyan-400" />
                <span>RESUME</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-cyan-400" />
                <span>PAUSE</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white transition-colors"
            title="Reset Playback Counter"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>

          <span className="hidden md:inline-block text-neutral-600">|</span>
          <span className="hidden md:inline-block text-neutral-400 text-[10px]">
            {Math.round(progressPercent)}% COMPLETED
          </span>
        </div>

        <div className="flex items-center gap-2">
          {project.youtubeUrl && (
            <a
              href={project.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEngine.playClick()}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-red-500/60 hover:text-red-300 transition-colors text-[10px]"
            >
              <ExternalLink className="w-3 h-3 text-red-400" />
              <span>WATCH ON YOUTUBE (4K)</span>
            </a>
          )}

          {onCloseVideo && (
            <button
              type="button"
              onClick={onCloseVideo}
              className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white transition-colors text-[10px]"
            >
              RETURN TO POSTER
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
