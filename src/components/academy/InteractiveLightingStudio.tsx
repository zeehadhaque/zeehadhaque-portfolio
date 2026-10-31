import { useState, useMemo } from 'react';
import { Sun, Moon, Flame, Palette, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface LightSource {
  id: string;
  name: string;
  enabled: boolean;
  intensity: number; // 0 to 100%
  angleDeg: number; // 0 to 360 relative to subject (0 = front, 45 = camera left, 180 = back, etc.)
  kelvin: number; // 2700 to 7500
  softness: 'hard' | 'softbox' | 'silk-diffused';
}

const PRESETS = [
  {
    name: 'Rembrandt Classic',
    description: '45° High Key, Soft 4:1 Fill, Subtle Rim. Iconic triangle of light on shadow cheek.',
    key: { enabled: true, intensity: 90, angleDeg: 45, kelvin: 3200, softness: 'softbox' as const },
    fill: { enabled: true, intensity: 22, angleDeg: 315, kelvin: 3200, softness: 'silk-diffused' as const },
    back: { enabled: true, intensity: 45, angleDeg: 210, kelvin: 4500, softness: 'hard' as const },
  },
  {
    name: 'Film Noir Chiaroscuro',
    description: '90° Hard Key, Zero Fill (Negative Fill), Blazing Rim. Extreme 16:1 contrast ratio.',
    key: { enabled: true, intensity: 100, angleDeg: 80, kelvin: 3200, softness: 'hard' as const },
    fill: { enabled: false, intensity: 0, angleDeg: 300, kelvin: 3200, softness: 'silk-diffused' as const },
    back: { enabled: true, intensity: 80, angleDeg: 190, kelvin: 5600, softness: 'hard' as const },
  },
  {
    name: 'Cyberpunk Mixed Color',
    description: 'Warm Tungsten 3200K Key with contrasting 7000K Cyan Rim backlight.',
    key: { enabled: true, intensity: 85, angleDeg: 55, kelvin: 3000, softness: 'softbox' as const },
    fill: { enabled: true, intensity: 18, angleDeg: 320, kelvin: 3800, softness: 'silk-diffused' as const },
    back: { enabled: true, intensity: 95, angleDeg: 225, kelvin: 7200, softness: 'hard' as const },
  },
  {
    name: 'Flat Sitcom High-Key',
    description: 'Equal Key and Fill (1:1 Ratio). Zero shadows on face, commercial style.',
    key: { enabled: true, intensity: 80, angleDeg: 30, kelvin: 5600, softness: 'silk-diffused' as const },
    fill: { enabled: true, intensity: 75, angleDeg: 330, kelvin: 5600, softness: 'silk-diffused' as const },
    back: { enabled: true, intensity: 40, angleDeg: 180, kelvin: 5600, softness: 'softbox' as const },
  },
];

function kelvinToRgb(kelvin: number): string {
  const temp = kelvin / 100;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (temp <= 66) {
    red = 255;
    green = 99.4708025861 * Math.log(temp) - 161.1195681661;
    if (temp <= 19) {
      blue = 0;
    } else {
      blue = 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
    }
  } else {
    red = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
    green = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
    blue = 255;
  }

  const r = Math.min(255, Math.max(0, Math.round(red)));
  const g = Math.min(255, Math.max(0, Math.round(green)));
  const b = Math.min(255, Math.max(0, Math.round(blue)));

  return `${r}, ${g}, ${b}`;
}

export function InteractiveLightingStudio() {
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  const [keyLight, setKeyLight] = useState<LightSource>({
    id: 'key',
    name: 'Key Light (Primary)',
    enabled: true,
    intensity: 90,
    angleDeg: 45,
    kelvin: 3200,
    softness: 'softbox',
  });

  const [fillLight, setFillLight] = useState<LightSource>({
    id: 'fill',
    name: 'Fill Light (Shadow Control)',
    enabled: true,
    intensity: 22,
    angleDeg: 315,
    kelvin: 3200,
    softness: 'silk-diffused',
  });

  const [backLight, setBackLight] = useState<LightSource>({
    id: 'back',
    name: 'Hair / Rim Light (Edge Separation)',
    enabled: true,
    intensity: 45,
    angleDeg: 210,
    kelvin: 4500,
    softness: 'hard',
  });

  // Calculate Key-to-Fill Contrast Ratio
  const contrastRatio = useMemo(() => {
    if (!keyLight.enabled) return '0:1 (Darkness)';
    if (!fillLight.enabled || fillLight.intensity <= 2) return '16:1+ (Pure Noir / Negative Fill)';
    const ratio = Math.max(1, keyLight.intensity / fillLight.intensity);
    if (ratio < 1.3) return '1:1 (Flat High-Key)';
    if (ratio < 2.5) return '2:1 (Gentle Drama)';
    if (ratio < 5.0) return '4:1 (Standard Cinematic)';
    if (ratio < 9.0) return '8:1 (High Drama)';
    return '16:1 (Extreme Chiaroscuro)';
  }, [keyLight, fillLight]);

  const applyPreset = (idx: number) => {
    soundEngine.playClick();
    setActivePresetIndex(idx);
    const p = PRESETS[idx];
    setKeyLight((prev) => ({ ...prev, ...p.key }));
    setFillLight((prev) => ({ ...prev, ...p.fill }));
    setBackLight((prev) => ({ ...prev, ...p.back }));
  };

  const keyRgb = kelvinToRgb(keyLight.kelvin);
  const fillRgb = kelvinToRgb(fillLight.kelvin);
  const backRgb = kelvinToRgb(backLight.kelvin);

  return (
    <div className="bg-[#050a17]/90 border border-neutral-800/90 rounded-2xl p-4 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono-film tracking-[0.25em] text-amber-400 uppercase">
              VIRTUAL LIGHTING STAGE // 3-POINT & REMBRANDT ENGINE
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white font-cinematic">
            Key, Fill, Rim & Chiaroscuro Studio
          </h3>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Explore lighting ratios, Kelvin temperature shifts, and sculpt facial features in real time.
          </p>
        </div>

        {/* Contrast Ratio Badge */}
        <div className="px-3.5 py-1.5 rounded-full bg-neutral-900 border border-amber-500/40 text-xs font-mono-film text-amber-300 self-start sm:self-auto flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>RATIO: <strong>{contrastRatio}</strong></span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PRESETS.map((p, idx) => (
          <button
            key={p.name}
            type="button"
            onClick={() => applyPreset(idx)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono-film transition-all ${
              activePresetIndex === idx
                ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)] font-bold'
                : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-4">
          {/* Key Light Box */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                <span className="text-xs font-bold font-mono-film text-white uppercase">{keyLight.name}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setKeyLight({ ...keyLight, enabled: !keyLight.enabled });
                }}
                className={`text-[10px] px-2 py-0.5 rounded font-mono-film ${
                  keyLight.enabled ? 'bg-amber-500 text-black font-bold' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {keyLight.enabled ? 'ACTIVE' : 'OFF'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-[10px] font-mono-film text-neutral-400 mb-1">
                  <span>Intensity</span>
                  <span className="text-amber-300">{keyLight.intensity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={keyLight.intensity}
                  disabled={!keyLight.enabled}
                  onChange={(e) => setKeyLight({ ...keyLight, intensity: Number(e.target.value) })}
                  className="w-full accent-amber-400 h-1.5 bg-neutral-800 rounded appearance-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-mono-film text-neutral-400 mb-1">
                  <span>Angle: {keyLight.angleDeg}°</span>
                  <span className="text-amber-300">{keyLight.angleDeg <= 60 ? 'Rembrandt 45°' : keyLight.angleDeg <= 100 ? 'Split 90°' : 'Broad'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="180"
                  value={keyLight.angleDeg}
                  disabled={!keyLight.enabled}
                  onChange={(e) => setKeyLight({ ...keyLight, angleDeg: Number(e.target.value) })}
                  className="w-full accent-amber-400 h-1.5 bg-neutral-800 rounded appearance-none"
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono-film">
              <span className="text-neutral-400">Color Temp: {keyLight.kelvin}K</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setKeyLight({ ...keyLight, kelvin: 3200 })}
                  className="px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300"
                >
                  3200K Tungsten
                </button>
                <button
                  type="button"
                  onClick={() => setKeyLight({ ...keyLight, kelvin: 5600 })}
                  className="px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-cyan-300"
                >
                  5600K Daylight
                </button>
              </div>
            </div>
          </div>

          {/* Fill Light Box */}
          <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-950/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                <span className="text-xs font-bold font-mono-film text-white uppercase">{fillLight.name}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setFillLight({ ...fillLight, enabled: !fillLight.enabled });
                }}
                className={`text-[10px] px-2 py-0.5 rounded font-mono-film ${
                  fillLight.enabled ? 'bg-sky-500 text-black font-bold' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {fillLight.enabled ? 'ACTIVE' : 'OFF (NEGATIVE FILL)'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-[10px] font-mono-film text-neutral-400 mb-1">
                  <span>Fill Intensity</span>
                  <span className="text-sky-300">{fillLight.intensity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fillLight.intensity}
                  disabled={!fillLight.enabled}
                  onChange={(e) => setFillLight({ ...fillLight, intensity: Number(e.target.value) })}
                  className="w-full accent-sky-400 h-1.5 bg-neutral-800 rounded appearance-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-mono-film text-neutral-400 mb-1">
                  <span>Kelvin</span>
                  <span className="text-sky-300">{fillLight.kelvin}K</span>
                </div>
                <input
                  type="range"
                  min="2800"
                  max="6500"
                  step="100"
                  value={fillLight.kelvin}
                  disabled={!fillLight.enabled}
                  onChange={(e) => setFillLight({ ...fillLight, kelvin: Number(e.target.value) })}
                  className="w-full accent-sky-400 h-1.5 bg-neutral-800 rounded appearance-none"
                />
              </div>
            </div>
          </div>

          {/* Back / Rim Light Box */}
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                <span className="text-xs font-bold font-mono-film text-white uppercase">{backLight.name}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setBackLight({ ...backLight, enabled: !backLight.enabled });
                }}
                className={`text-[10px] px-2 py-0.5 rounded font-mono-film ${
                  backLight.enabled ? 'bg-cyan-500 text-black font-bold' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {backLight.enabled ? 'ACTIVE' : 'OFF'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-[10px] font-mono-film text-neutral-400 mb-1">
                  <span>Rim Intensity</span>
                  <span className="text-cyan-300">{backLight.intensity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={backLight.intensity}
                  disabled={!backLight.enabled}
                  onChange={(e) => setBackLight({ ...backLight, intensity: Number(e.target.value) })}
                  className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded appearance-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-mono-film text-neutral-400 mb-1">
                  <span>Backlight Kelvin</span>
                  <span className="text-cyan-300">{backLight.kelvin}K</span>
                </div>
                <input
                  type="range"
                  min="3200"
                  max="8000"
                  step="100"
                  value={backLight.kelvin}
                  disabled={!backLight.enabled}
                  onChange={(e) => setBackLight({ ...backLight, kelvin: Number(e.target.value) })}
                  className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded appearance-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Portrait Shader & Face Preview */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="relative w-full h-72 sm:h-80 rounded-2xl border border-neutral-700/80 bg-neutral-950 overflow-hidden flex items-center justify-center shadow-2xl">
            {/* Background Studio Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Backlight / Rim Glow on shoulders & hair */}
            {backLight.enabled && backLight.intensity > 0 && (
              <div
                className="absolute inset-0 transition-all duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 20%, rgba(${backRgb}, ${
                    (backLight.intensity / 100) * 0.7
                  }) 0%, transparent 65%)`,
                  filter: 'blur(20px)',
                }}
              />
            )}

            {/* Simulated 3D Sculpted Face Container */}
            <div className="relative z-10 flex flex-col items-center">
              {/* The Head Silhouette */}
              <div
                className="relative w-36 h-48 rounded-[48%_48%_45%_45%] border border-neutral-800 transition-all duration-300 shadow-2xl overflow-hidden"
                style={{
                  backgroundColor: '#171717',
                }}
              >
                {/* Base Shadow Fill Layer */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    backgroundColor: fillLight.enabled
                      ? `rgba(${fillRgb}, ${(fillLight.intensity / 100) * 0.25})`
                      : '#000000',
                  }}
                />

                {/* Key Light Gradient Shading based on Angle & Intensity */}
                {keyLight.enabled && (
                  <div
                    className="absolute inset-0 transition-all duration-300"
                    style={{
                      background: `linear-gradient(${
                        180 - keyLight.angleDeg
                      }deg, rgba(${keyRgb}, ${(keyLight.intensity / 100) * 0.85}) 0%, rgba(${keyRgb}, ${
                        (keyLight.intensity / 100) * 0.35
                      }) 40%, transparent 65%)`,
                    }}
                  />
                )}

                {/* Rembrandt Light Triangle on Shadow Cheek */}
                {keyLight.enabled && keyLight.angleDeg >= 35 && keyLight.angleDeg <= 65 && (
                  <div
                    className="absolute top-[52%] left-[24%] w-6 h-5 transition-all duration-300 rounded-[20%] shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    style={{
                      clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)',
                      backgroundColor: `rgba(${keyRgb}, ${(keyLight.intensity / 100) * 0.75})`,
                      filter: 'blur(1.5px)',
                    }}
                  />
                )}

                {/* Specular Catchlight in the Eyes */}
                {keyLight.enabled && (
                  <div className="absolute top-[38%] left-[32%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] transition-all" />
                )}
                {fillLight.enabled && fillLight.intensity > 15 && (
                  <div className="absolute top-[39%] right-[32%] w-1 h-1 rounded-full bg-white/70 shadow-[0_0_4px_#ffffff] transition-all" />
                )}

                {/* Rim Highlight on Hair & Jaw */}
                {backLight.enabled && backLight.intensity > 0 && (
                  <div
                    className="absolute inset-0 border-t-2 border-r border-l transition-all duration-300"
                    style={{
                      borderColor: `rgba(${backRgb}, ${(backLight.intensity / 100) * 0.9})`,
                      filter: 'drop-shadow(0 0 6px rgba(0,240,255,0.6))',
                    }}
                  />
                )}

                {/* Eyeline Nose Bridge Shadow Representation */}
                <div className="absolute top-[35%] left-[48%] w-1 h-12 bg-black/40 blur-[1px]" />
              </div>

              <div className="mt-3 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-[10px] font-mono-film text-neutral-300">
                CINEMATIC PORTRAIT SCULPTURE // {contrastRatio}
              </div>
            </div>

            {/* Stage Camera Icon Indicator at Bottom */}
            <div className="absolute bottom-3 left-4 text-[9px] font-mono-film text-neutral-500">
              [CAM] AXIS: 0° LOOKING DIRECTLY AT SUBJECT
            </div>

            <div className="absolute top-3 right-4 text-[9px] font-mono-film text-amber-300/80">
              KEY: {keyLight.angleDeg}° | KELVIN: {keyLight.kelvin}K
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-3.5 rounded-xl border border-amber-900/40 bg-amber-950/20 text-xs text-neutral-300 leading-relaxed">
            <strong className="text-amber-300 font-mono-film">LIGHTING LESSON: </strong>
            {contrastRatio.includes('Noir') ? (
              <span>With the Fill light disabled, you achieve Negative Fill. The shadow side of the face disappears into blackness, creating mystery and danger.</span>
            ) : contrastRatio.includes('Rembrandt') || keyLight.angleDeg === 45 ? (
              <span>Notice the inverted triangle under the shadow eye. Rembrandt lighting has been the gold standard of dramatic visual art since 1640.</span>
            ) : contrastRatio.includes('Flat') ? (
              <span>At a 1:1 ratio, all facial imperfections are ironed out, but the face loses three-dimensional weight and depth.</span>
            ) : (
              <span>A 4:1 ratio gives healthy 2-stop contrast between cheekbones, producing modern cinematic naturalism.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
