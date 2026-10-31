import React, { useState } from 'react';
import { Sliders, Sun, Moon, Sparkles, RefreshCw, Eye, Layers } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { soundEngine } from '../../utils/audio';

export const ColorGradingLab: React.FC = () => {
  const colorSettings = useUniverseStore((s) => s.colorSettings);
  const updateColorSettings = useUniverseStore((s) => s.updateColorSettings);
  const applyColorPreset = useUniverseStore((s) => s.applyColorPreset);
  const addXP = useUniverseStore((s) => s.addXP);

  const [splitPos, setSplitPos] = useState(50); // 0 to 100%

  const handlePreset = (preset: typeof colorSettings.preset) => {
    soundEngine.playClick();
    applyColorPreset(preset);
    addXP('color', 15);
  };

  // Compute CSS filter string matching color grading sliders
  const brightness = 1 + colorSettings.exposure;
  const contrast = colorSettings.contrast;
  const saturate = colorSettings.saturation;
  const sepia = Math.max(0, colorSettings.temperature / 100);
  const hueRotate = colorSettings.tint * 2;

  const gradedFilter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturate}) sepia(${sepia}) hue-rotate(${hueRotate}deg)`;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#020305] border border-[#102B45]">
        <div>
          <span className="font-mono text-xs text-[#7DBBFF] tracking-widest uppercase">
            DAVINCI RESOLVE COLOR SCIENCE // SIMULATOR
          </span>
          <h3 className="font-headline font-bold text-xl text-[#F2F0EB]">
            Color Grading & LUT Architecture Lab
          </h3>
          <p className="text-xs text-[#8A96A3] mt-0.5">
            Calibrate cold nocturne rolloff, blue shadow saturation, and contrast ratios.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {(['COLD NOCTURNE', 'GOLDEN HOUR', 'JUNGLE DAWN', 'HIGH CONTRAST NOIR'] as const).map(
            (p) => (
              <button
                key={p}
                onClick={() => handlePreset(p)}
                className={`px-3 py-1.5 rounded text-[10px] font-mono tracking-wider transition-all border ${
                  colorSettings.preset === p
                    ? 'bg-[#2C6EA6] border-[#7DBBFF] text-[#F2F0EB] shadow-[0_0_10px_rgba(125,187,255,0.3)]'
                    : 'bg-[#06090E] border-[#102B45] text-[#8A96A3] hover:text-[#F2F0EB]'
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>
      </div>

      {/* Before / After Split Viewport */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#020305] border border-[#102B45] select-none shadow-2xl">
        {/* Sample Frame Image: Graded Layer */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop"
            alt="Sample Frame Graded"
            style={{
              filter: gradedFilter,
            }}
            className="w-full h-full object-cover"
          />
          {/* Subtle Grain Overlay */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle, transparent 60%, rgba(2,3,5, ${colorSettings.vignette}))`,
            }}
          />
        </div>

        {/* Before Layer (Clipped to Split Position) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${splitPos}%` }}
        >
          <img
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop"
            alt="Sample Frame RAW Before"
            className="w-full h-full object-cover max-w-none"
            style={{ width: '100%', height: '100%', filter: 'contrast(0.9) brightness(0.95)' }}
          />
          {/* Before Label */}
          <div className="absolute top-4 left-4 px-2 py-1 rounded bg-[#020305]/80 border border-[#102B45] font-mono text-[9px] text-[#8A96A3]">
            RAW REC.709
          </div>
        </div>

        {/* After Label */}
        <div className="absolute top-4 right-4 px-2 py-1 rounded bg-[#020305]/80 border border-[#2C6EA6] font-mono text-[9px] text-[#7DBBFF]">
          GRADED // {colorSettings.preset}
        </div>

        {/* Interactive Split Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#7DBBFF] shadow-[0_0_10px_#7DBBFF] cursor-ew-resize flex items-center justify-center -translate-x-1/2"
          style={{ left: `${splitPos}%` }}
        >
          <div className="w-6 h-6 rounded-full bg-[#06090E] border-2 border-[#7DBBFF] flex items-center justify-center text-[8px] font-mono font-bold text-[#A9D4FF] shadow-lg">
            ⇄
          </div>
        </div>

        {/* Invisible Drag Area */}
        <input
          type="range"
          min="0"
          max="100"
          value={splitPos}
          onChange={(e) => setSplitPos(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
        />
      </div>

      {/* Grading Parameter Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5 rounded-xl bg-[#06090E] border border-[#102B45]">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1 text-[#8A96A3]">
            <span>EXPOSURE</span>
            <span className="text-[#7DBBFF]">{colorSettings.exposure.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="-0.5"
            max="0.5"
            step="0.02"
            value={colorSettings.exposure}
            onChange={(e) =>
              updateColorSettings({ exposure: Number(e.target.value) })
            }
            className="w-full accent-[#7DBBFF]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1 text-[#8A96A3]">
            <span>CONTRAST</span>
            <span className="text-[#7DBBFF]">{colorSettings.contrast.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.8"
            step="0.05"
            value={colorSettings.contrast}
            onChange={(e) =>
              updateColorSettings({ contrast: Number(e.target.value) })
            }
            className="w-full accent-[#7DBBFF]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1 text-[#8A96A3]">
            <span>SATURATION</span>
            <span className="text-[#7DBBFF]">{colorSettings.saturation.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1.8"
            step="0.05"
            value={colorSettings.saturation}
            onChange={(e) =>
              updateColorSettings({ saturation: Number(e.target.value) })
            }
            className="w-full accent-[#7DBBFF]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1 text-[#8A96A3]">
            <span>TEMPERATURE (KELVIN OFFSET)</span>
            <span className="text-[#7DBBFF]">{colorSettings.temperature > 0 ? `+${colorSettings.temperature}` : colorSettings.temperature}</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={colorSettings.temperature}
            onChange={(e) =>
              updateColorSettings({ temperature: Number(e.target.value) })
            }
            className="w-full accent-[#7DBBFF]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1 text-[#8A96A3]">
            <span>BLUE SHADOWS INTENSITY</span>
            <span className="text-[#7DBBFF]">{colorSettings.blueShadows.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={colorSettings.blueShadows}
            onChange={(e) =>
              updateColorSettings({ blueShadows: Number(e.target.value) })
            }
            className="w-full accent-[#7DBBFF]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1 text-[#8A96A3]">
            <span>VIGNETTE ROLLOFF</span>
            <span className="text-[#7DBBFF]">{colorSettings.vignette.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.9"
            step="0.05"
            value={colorSettings.vignette}
            onChange={(e) =>
              updateColorSettings({ vignette: Number(e.target.value) })
            }
            className="w-full accent-[#7DBBFF]"
          />
        </div>
      </div>
    </div>
  );
};
