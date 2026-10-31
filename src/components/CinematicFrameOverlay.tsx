import { useEffect, useState } from 'react';
import { SectionAccent } from '../utils/cinematicTheme';

interface CinematicFrameOverlayProps {
  activeAccent?: SectionAccent;
  directorsCut?: boolean;
}

export function CinematicFrameOverlay({
  activeAccent,
  directorsCut = false,
}: CinematicFrameOverlayProps) {
  const [timecode, setTimecode] = useState('00:14:28:12');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const frames = String(Math.floor((now.getMilliseconds() / 1000) * 24)).padStart(2, '0');
      setTimecode(`${hrs}:${mins}:${secs}:${frames}`);
    }, 41); // 24 fps update rate

    return () => clearInterval(interval);
  }, []);

  const tempTag = directorsCut
    ? '2800K TUNGSTEN (DIR CUT)'
    : activeAccent?.temp || '5600K DAYLIGHT COOL';

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none">
      {/* Top 2.35:1 Anamorphic Guide Line */}
      <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between font-mono-film text-[10px] text-neutral-400 tracking-[0.25em]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500/90 animate-ping" />
          <span className="text-red-400 font-bold">REC ● [RAW]</span>
          <span className="text-neutral-500 hidden sm:inline">24.000 FPS</span>
        </div>
        <div
          className="font-mono tracking-widest font-semibold transition-colors duration-500"
          style={{ color: 'var(--cine-accent)' }}
        >
          {timecode}
        </div>
        <div className="hidden sm:flex items-center gap-4 text-neutral-400">
          <span>SHUTTER 180°</span>
          <span
            className="font-bold transition-colors duration-500"
            style={{ color: 'var(--cine-accent)' }}
          >
            {tempTag}
          </span>
          <span className="font-bold text-neutral-300">2.35:1 CINELOG</span>
        </div>
      </div>

      {/* Viewfinder Corner Reticles with dynamic accent corner gleam */}
      <div
        className="absolute top-7 left-6 w-4 h-4 border-t border-l transition-colors duration-500"
        style={{ borderColor: 'rgba(var(--cine-accent-rgb), 0.35)' }}
      />
      <div
        className="absolute top-7 right-6 w-4 h-4 border-t border-r transition-colors duration-500"
        style={{ borderColor: 'rgba(var(--cine-accent-rgb), 0.35)' }}
      />
      <div
        className="absolute bottom-6 left-6 w-4 h-4 border-b border-l transition-colors duration-500"
        style={{ borderColor: 'rgba(var(--cine-accent-rgb), 0.35)' }}
      />
      <div
        className="absolute bottom-6 right-6 w-4 h-4 border-b border-r transition-colors duration-500"
        style={{ borderColor: 'rgba(var(--cine-accent-rgb), 0.35)' }}
      />

      {/* Bottom Metadata */}
      <div className="absolute bottom-2 inset-x-4 sm:inset-x-8 flex items-center justify-between font-mono-film text-[10px] text-neutral-400 tracking-[0.25em]">
        <div>GAZIPUR, DHAKA, BD</div>
        <div className="hidden md:block text-neutral-400">
          {activeAccent ? `${activeAccent.chapterNumber} • ${activeAccent.name}` : 'ATMOSPHERIC CINEMATOGRAPHY'}
        </div>
        <div
          className="transition-colors duration-500 font-semibold"
          style={{ color: 'var(--cine-accent)' }}
        >
          ZH • AUTEUR FRAME
        </div>
      </div>
    </div>
  );
}
