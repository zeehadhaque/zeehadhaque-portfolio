import { useEffect, useState, useMemo } from 'react';
import { SectionAccent } from '../utils/cinematicTheme';

interface FilmStripProgressBarProps {
  directorsCut?: boolean;
  activeAccent?: SectionAccent;
}

const CHAPTER_NOTCHES = [
  { percent: 0, label: '01 HERO', frame: '0001' },
  { percent: 14, label: '02 PROFILE', frame: '0240' },
  { percent: 28, label: '03 LANGUAGE', frame: '0480' },
  { percent: 45, label: '04 WORK', frame: '0720' },
  { percent: 62, label: '05 REEL', frame: '0960' },
  { percent: 76, label: '06 ARCADE', frame: '1180' },
  { percent: 88, label: '07 STORIES', frame: '1340' },
  { percent: 100, label: '08 CONTACT', frame: '1440' },
];

export function FilmStripProgressBar({
  directorsCut = false,
  activeAccent,
}: FilmStripProgressBarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout: number;
    let ticking = false;

    const updateScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      const progress = totalScroll > 0 ? (current / totalScroll) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      ticking = false;
    };

    const handleScroll = () => {
      setIsScrolling(true);
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }

      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        setIsScrolling(false);
      }, 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(scrollTimeout);
    };
  }, []);

  // Calculate live 24fps 35mm frame count (1440 total frames for a complete reel)
  const currentFrame = Math.floor((scrollProgress / 100) * 1440);

  // Dynamic colors
  const accentColor = directorsCut
    ? '#f59e0b'
    : activeAccent?.accent || '#00f0ff';
  const accentLight = directorsCut
    ? '#fbbf24'
    : activeAccent?.accentLight || '#67e8f9';
  const accentGlow = directorsCut
    ? 'rgba(245, 158, 11, 0.5)'
    : activeAccent?.glow || 'rgba(0, 240, 255, 0.45)';

  // Determine current chapter name for the HUD
  const currentChapter = useMemo(() => {
    for (let i = CHAPTER_NOTCHES.length - 1; i >= 0; i--) {
      if (scrollProgress >= CHAPTER_NOTCHES[i].percent - 2) {
        return CHAPTER_NOTCHES[i].label;
      }
    }
    return CHAPTER_NOTCHES[0].label;
  }, [scrollProgress]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* 35mm Film Strip Assembly: Total Height ~11px */}
      <div className="relative w-full bg-[#03060f] border-b border-neutral-900/90 shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
        {/* Top Sprocket Perforation Track (Animated 35mm holes) */}
        <div className="w-full h-[3px] bg-black/90 flex items-center overflow-hidden">
          <div
            className="w-[200%] h-full opacity-80"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, #000 0px, #000 6px, #374151 6px, #374151 9px, #000 9px, #000 15px)`,
              animation: isScrolling
                ? 'sprocket-roll 0.3s linear infinite'
                : 'sprocket-roll 6s linear infinite',
            }}
          />
        </div>

        {/* Core Emulsion Progress Track */}
        <div className="relative w-full h-[5px] bg-neutral-950 flex items-center">
          {/* Chapter Keyframe Tick Marks */}
          {CHAPTER_NOTCHES.map((notch) => (
            <div
              key={notch.frame}
              className="absolute top-0 bottom-0 w-[1px] bg-neutral-800 z-10 opacity-70"
              style={{ left: `${notch.percent}%` }}
              title={`${notch.label} (FRM ${notch.frame})`}
            />
          ))}

          {/* Active Exposure Fill Bar */}
          <div
            className="h-full transition-all duration-75 ease-out relative"
            style={{
              width: `${scrollProgress}%`,
              background: `linear-gradient(90deg, ${
                directorsCut ? '#b45309' : '#0369a1'
              } 0%, ${accentColor} 70%, ${accentLight} 100%)`,
              boxShadow: `0 0 16px ${accentGlow}`,
            }}
          >
            {/* Illuminated Lens Optical Sensor Bead at leading edge */}
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 rounded-full z-20 transition-colors duration-500"
              style={{
                backgroundColor: accentLight,
                boxShadow: `0 0 10px #fff, 0 0 18px ${accentGlow}`,
              }}
            >
              <div
                className={`w-full h-full rounded-full animate-ping opacity-75 ${
                  directorsCut ? 'bg-amber-300' : 'bg-cyan-300'
                }`}
              />
            </div>

            {/* Vertical Frame Hairline Divider */}
            <div
              className="absolute right-0 top-[-3px] bottom-[-3px] w-[1.5px] z-20 pointer-events-none"
              style={{ backgroundColor: '#ffffff', boxShadow: `0 0 6px ${accentGlow}` }}
            />
          </div>
        </div>

        {/* Bottom Sprocket Perforation Track with Latent Keycode Style */}
        <div className="w-full h-[3px] bg-black/90 flex items-center overflow-hidden">
          <div
            className="w-[200%] h-full opacity-60"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, #000 0px, #000 6px, #1f2937 6px, #1f2937 9px, #000 9px, #000 15px)`,
              animation: isScrolling
                ? 'sprocket-roll 0.3s linear infinite'
                : 'sprocket-roll 6s linear infinite',
            }}
          />
        </div>
      </div>

      {/* Micro HUD Telemetry Badge (Float right below strip) */}
      <div className="flex items-center justify-end px-3 sm:px-6 pt-1.5">
        <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-neutral-950/85 border border-neutral-800/80 backdrop-blur-md text-[9px] font-mono-film tracking-widest text-neutral-400 shadow-[0_4px_12px_rgba(0,0,0,0.7)] transition-all">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-neutral-500 hidden md:inline">35MM REEL</span>
          <span
            className="font-bold transition-colors duration-500"
            style={{ color: accentColor }}
          >
            FRM {String(currentFrame).padStart(4, '0')}
          </span>
          <span className="text-neutral-700">•</span>
          <span className="text-neutral-300 hidden sm:inline">{currentChapter}</span>
          <span className="text-neutral-700 hidden sm:inline">•</span>
          <span className="text-neutral-300 font-bold">{Math.round(scrollProgress)}%</span>
          <span
            className="hidden lg:inline text-[8px] px-1.5 py-0.2 rounded border transition-colors duration-500"
            style={{
              borderColor: `${accentColor}40`,
              color: accentLight,
              backgroundColor: `${accentColor}15`,
            }}
          >
            {directorsCut ? 'DIR CUT 2800K' : activeAccent?.temp || '5600K COOL'}
          </span>
        </div>
      </div>
    </div>
  );
}
