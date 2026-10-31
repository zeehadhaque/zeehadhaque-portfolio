import { motion } from 'motion/react';
import { Aperture, Sliders, Sun, Video, Layers } from 'lucide-react';
import { DirectorsCutData } from '../types';

interface DirectorsCutOverlayProps {
  data?: DirectorsCutData;
  show: boolean;
  compact?: boolean;
}

export function DirectorsCutOverlay({ data, show, compact = false }: DirectorsCutOverlayProps) {
  if (!show || !data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(2px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="absolute inset-0 z-30 pointer-events-none p-3 sm:p-4 flex flex-col justify-between font-mono-film text-[10px] sm:text-[11px] select-none"
    >
      {/* Viewfinder Rule-of-Thirds Grid Reticle */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="w-full h-full border border-amber-400/40 relative">
          {/* Thirds Lines */}
          <div className="absolute left-1/3 inset-y-0 w-[1px] bg-amber-400/30 border-dashed" />
          <div className="absolute right-1/3 inset-y-0 w-[1px] bg-amber-400/30 border-dashed" />
          <div className="absolute top-1/3 inset-x-0 h-[1px] bg-amber-400/30 border-dashed" />
          <div className="absolute bottom-1/3 inset-x-0 h-[1px] bg-amber-400/30 border-dashed" />
          {/* Center Crosshair */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
            <div className="absolute top-1/2 inset-x-0 h-[1px] bg-amber-300" />
            <div className="absolute left-1/2 inset-y-0 w-[1px] bg-amber-300" />
          </div>
        </div>
      </div>

      {/* Top HUD Line: Viewfinder Diagnostics */}
      <div className="relative z-10 flex items-center justify-between text-amber-300">
        <div className="flex items-center gap-2 bg-black/80 px-2 py-0.5 rounded border border-amber-500/40 shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-bold tracking-widest text-[9px] sm:text-[10px] text-amber-300">
            [REC 24FPS]
          </span>
          <span className="text-neutral-400 hidden sm:inline">|</span>
          <span className="text-neutral-300 hidden sm:inline">{data.exposure.split('•')[0] || '4K 24fps'}</span>
        </div>

        <div className="flex items-center gap-1.5 bg-black/80 px-2 py-0.5 rounded border border-amber-500/40 shadow-lg backdrop-blur-md text-[9px] sm:text-[10px]">
          <span className="text-amber-400 font-bold tracking-wider">DIR CUT</span>
          <span className="text-neutral-400">•</span>
          <span className="text-cyan-300">ACEScc</span>
        </div>
      </div>

      {/* Bottom HUD Technical Slate Notes */}
      <div className="relative z-10 space-y-1.5 mt-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {/* Lens & Exposure Slate */}
          <div className="bg-black/85 backdrop-blur-md p-2 rounded-lg border border-amber-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.8)] text-neutral-200">
            <div className="flex items-center gap-1 text-amber-400 font-bold tracking-wider text-[9px] mb-0.5 uppercase">
              <Aperture className="w-3 h-3 text-amber-400" />
              <span>OPTICS & EXPOSURE</span>
            </div>
            <div className="text-[10px] text-white font-medium truncate">
              {data.lens}
            </div>
            <div className="text-[9px] text-amber-200/80 truncate">
              {data.exposure}
            </div>
          </div>

          {/* Lighting & Rig Slate (hide on compact cards if needed) */}
          {!compact && (
            <div className="bg-black/85 backdrop-blur-md p-2 rounded-lg border border-amber-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.8)] text-neutral-200">
              <div className="flex items-center gap-1 text-amber-400 font-bold tracking-wider text-[9px] mb-0.5 uppercase">
                <Sun className="w-3 h-3 text-amber-400" />
                <span>LIGHTING SETUP</span>
              </div>
              <div className="text-[9px] text-neutral-200 leading-tight line-clamp-2">
                {data.lightingSetup}
              </div>
              <div className="text-[8px] text-cyan-300/90 truncate mt-0.5">
                GRADE: {data.colorScience.split('•')[0]}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Viewfinder Outer Corner Brackets */}
      <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-400/80" />
      <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-400/80" />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-400/80" />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-400/80" />
    </motion.div>
  );
}
