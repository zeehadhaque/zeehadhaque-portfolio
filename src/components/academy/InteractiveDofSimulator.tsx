import { useState, useMemo } from 'react';
import { Camera, Eye, Info, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

type SensorFormat = 'full-frame' | 'super-35' | 'micro-four-thirds';

interface SensorSpec {
  name: string;
  cropFactor: number;
  cocMm: number; // Circle of Confusion in millimeters
  aspectRatio: string;
}

const SENSOR_PRESETS: Record<SensorFormat, SensorSpec> = {
  'full-frame': { name: 'Full Frame 35mm (VistaVision)', cropFactor: 1.0, cocMm: 0.030, aspectRatio: '3:2' },
  'super-35': { name: 'Super 35mm (Hollywood Standard)', cropFactor: 1.5, cocMm: 0.020, aspectRatio: '16:9' },
  'micro-four-thirds': { name: 'Micro Four Thirds (M4/3)', cropFactor: 2.0, cocMm: 0.015, aspectRatio: '4:3' },
};

const APERTURES = [1.2, 1.4, 1.8, 2.0, 2.8, 4.0, 5.6, 8.0, 11.0, 16.0, 22.0];

export function InteractiveDofSimulator() {
  const [sensor, setSensor] = useState<SensorFormat>('full-frame');
  const [focalLength, setFocalLength] = useState<number>(50); // in mm
  const [aperture, setAperture] = useState<number>(2.0); // f-stop
  const [distanceM, setDistanceM] = useState<number>(2.5); // meters
  const [isAnamorphic, setIsAnamorphic] = useState<boolean>(false);

  const activeSensor = SENSOR_PRESETS[sensor];

  // Mathematical Optics Calculations
  const calculations = useMemo(() => {
    const fMm = focalLength;
    const N = aperture;
    const cMm = activeSensor.cocMm;
    const uMm = distanceM * 1000;

    // Hyperfocal Distance H (mm) = (f^2 / (N * c)) + f
    const H_mm = (fMm * fMm) / (N * cMm) + fMm;
    const H_m = H_mm / 1000;

    // Near Limit D_near (mm) = (H * u) / (H + (u - f))
    let near_m = (H_mm * uMm) / (H_mm + (uMm - fMm)) / 1000;
    near_m = Math.max(0.1, near_m);

    // Far Limit D_far (mm) = (H * u) / (H - (u - f))
    let far_m: number | 'Infinity' = 'Infinity';
    if (uMm < H_mm) {
      const denom = H_mm - (uMm - fMm);
      if (denom > 0) {
        far_m = (H_mm * uMm) / denom / 1000;
      }
    }

    // Total Depth of Field
    let totalDof_m: number | 'Infinity' = 'Infinity';
    if (far_m !== 'Infinity') {
      totalDof_m = far_m - near_m;
    }

    // Front / Rear DOF Distribution
    let frontPct = 33;
    let rearPct = 67;
    if (typeof far_m === 'number' && totalDof_m !== 'Infinity') {
      const frontDist = distanceM - near_m;
      const rearDist = far_m - distanceM;
      if (totalDof_m > 0) {
        frontPct = Math.round((frontDist / totalDof_m) * 100);
        rearPct = 100 - frontPct;
      }
    }

    // Relative blur factor for preview
    const blurIntensity = Math.min(28, Math.max(2, (fMm / 20) * (3.5 / aperture) * (3 / distanceM)));

    return {
      hyperfocalM: H_m.toFixed(2),
      nearLimitM: near_m.toFixed(2),
      farLimitM: far_m === 'Infinity' ? '∞ (Infinity)' : far_m.toFixed(2),
      totalDofM: totalDof_m === 'Infinity' ? 'Infinite' : totalDof_m > 1 ? `${totalDof_m.toFixed(2)} m` : `${(totalDof_m * 100).toFixed(1)} cm`,
      frontPct,
      rearPct,
      blurIntensity,
    };
  }, [sensor, focalLength, aperture, distanceM, activeSensor]);

  return (
    <div className="bg-[#050a17]/90 border border-neutral-800/90 rounded-2xl p-4 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono-film tracking-[0.25em] text-cyan-400 uppercase">
              OPTICAL DEPTH OF FIELD SIMULATOR // 35MM EQUIVALENCE
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white font-cinematic">
            Focal Plane & Circle of Confusion Engine
          </h3>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Real-time optical physics simulation evaluating hyperfocal boundaries, depth compression, and anamorphic oval blur discs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setIsAnamorphic(!isAnamorphic);
          }}
          data-cursor="OPTICS"
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono-film transition-all self-start sm:self-auto ${
            isAnamorphic
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
              : 'bg-neutral-900/80 border-neutral-700 text-neutral-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>ANAMORPHIC 2.0x SQUEEZE: {isAnamorphic ? 'ENGAGED' : 'OFF'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5">
          {/* Sensor Selector */}
          <div>
            <label className="block text-[11px] font-mono-film uppercase tracking-wider text-neutral-400 mb-2">
              1. Camera Sensor Architecture (Crop Factor & CoC)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(SENSOR_PRESETS) as SensorFormat[]).map((key) => {
                const s = SENSOR_PRESETS[key];
                const active = sensor === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setSensor(key);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      active
                        ? 'bg-cyan-950/40 border-cyan-400/80 text-white shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                        : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <div className="text-[10px] font-mono-film text-cyan-400/90">{s.cropFactor}x Crop</div>
                    <div className="text-xs font-semibold truncate">{s.name.split(' ')[0]}</div>
                    <div className="text-[9px] text-neutral-500 font-mono-film">{s.aspectRatio}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Focal Length Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] font-mono-film uppercase tracking-wider text-neutral-400">
                2. Focal Length (Focal Compression)
              </span>
              <span className="text-xs font-mono-film font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                {focalLength} mm
              </span>
            </div>
            <input
              type="range"
              min="14"
              max="135"
              step="1"
              value={focalLength}
              onChange={(e) => setFocalLength(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[9px] font-mono-film text-neutral-500 mt-1">
              <span>14mm (Ultra-Wide)</span>
              <span>35mm (Scorsese)</span>
              <span>50mm (Natural)</span>
              <span>85mm (Portrait)</span>
              <span>135mm (Tele)</span>
            </div>
          </div>

          {/* Aperture (f-stop) Selector */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] font-mono-film uppercase tracking-wider text-neutral-400">
                3. Physical Aperture Diameter (F-Stop)
              </span>
              <span className="text-xs font-mono-film font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                f / {aperture.toFixed(1)}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {APERTURES.map((ap) => {
                const active = aperture === ap;
                return (
                  <button
                    key={ap}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setAperture(ap);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-mono-film transition-all ${
                      active
                        ? 'bg-amber-500 text-neutral-950 font-bold shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    f/{ap}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject Distance Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] font-mono-film uppercase tracking-wider text-neutral-400">
                4. Camera-to-Subject Distance
              </span>
              <span className="text-xs font-mono-film font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                {distanceM.toFixed(1)} meters ({(distanceM * 3.28084).toFixed(1)} ft)
              </span>
            </div>
            <input
              type="range"
              min="0.6"
              max="12.0"
              step="0.1"
              value={distanceM}
              onChange={(e) => setDistanceM(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[9px] font-mono-film text-neutral-500 mt-1">
              <span>0.6m (Macro / ECU)</span>
              <span>2.5m (Medium Conversation)</span>
              <span>6.0m (Full Figure)</span>
              <span>12.0m (Wide Stage)</span>
            </div>
          </div>
        </div>

        {/* Visual Optical Canvas & Computed Telemetry */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          {/* Live Viewfinder Optical Simulation Box */}
          <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-neutral-700/80 bg-neutral-950 shadow-inner flex items-center justify-center">
            {/* Viewfinder Aspect Ratio Crop Lines */}
            <div className={`absolute inset-3 border border-neutral-700/60 pointer-events-none ${isAnamorphic ? 'border-cyan-500/40' : ''}`}>
              {/* Corner crosshairs */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
              {/* Center Crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
                <div className="w-full h-[1px] bg-red-500/60 absolute top-1/2" />
                <div className="h-full w-[1px] bg-red-500/60 absolute left-1/2" />
              </div>
            </div>

            {/* Background Distant Scene (Out of Focus Bokeh) */}
            <div
              className="absolute inset-0 transition-all duration-300 bg-cover bg-center flex items-center justify-around px-8 opacity-70 pointer-events-none"
              style={{
                filter: `blur(${calculations.blurIntensity}px)`,
                background: 'radial-gradient(circle at center, #1e293b 0%, #090d16 100%)',
              }}
            >
              {/* Simulated Bokeh Light Spheres or Anamorphic Ellipses */}
              <div
                className={`transition-all duration-300 bg-amber-400/70 shadow-[0_0_20px_#f59e0b] ${
                  isAnamorphic ? 'w-8 h-24 rounded-[50%]' : 'w-16 h-16 rounded-full'
                }`}
              />
              <div
                className={`transition-all duration-300 bg-cyan-400/60 shadow-[0_0_25px_#00f0ff] ${
                  isAnamorphic ? 'w-10 h-32 rounded-[50%]' : 'w-20 h-20 rounded-full'
                }`}
              />
              <div
                className={`transition-all duration-300 bg-rose-400/50 shadow-[0_0_20px_#f43f5e] ${
                  isAnamorphic ? 'w-7 h-20 rounded-[50%]' : 'w-14 h-14 rounded-full'
                }`}
              />
            </div>

            {/* In-Focus Protagonist Subject Graphic */}
            <div className="relative z-10 flex flex-col items-center select-none pointer-events-none">
              <div className="w-20 h-20 rounded-full border-2 border-cyan-300 bg-cyan-950/80 shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center">
                <Eye className="w-8 h-8 text-cyan-300" />
              </div>
              <div className="mt-2 px-3 py-0.5 rounded-full bg-neutral-900/90 border border-cyan-500/50 text-[10px] font-mono-film text-cyan-200 tracking-wider">
                SUBJECT FOCAL PLANE @ {distanceM.toFixed(1)}m (PIN-SHARP)
              </div>
            </div>

            {/* Viewfinder Telemetry HUD */}
            <div className="absolute top-4 left-5 text-[9px] font-mono-film text-neutral-400 space-y-0.5 pointer-events-none">
              <div className="text-cyan-300 font-bold">REC 24FPS [TC 01:24:18:09]</div>
              <div>ISO {sensor === 'full-frame' ? '800' : '500'} | 180.0° SHUTTER</div>
              <div>{activeSensor.name.split(' ')[0]} | {focalLength}mm</div>
            </div>

            <div className="absolute bottom-4 right-5 text-right text-[9px] font-mono-film text-neutral-400 space-y-0.5 pointer-events-none">
              <div className="text-amber-300 font-bold">T / {aperture.toFixed(1)}</div>
              <div>DOF: {calculations.totalDofM}</div>
              <div className="text-emerald-400">HYPERFOCAL: {calculations.hyperfocalM}m</div>
            </div>
          </div>

          {/* Computed Optical Telemetry Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
              <div className="text-[10px] font-mono-film text-neutral-500 uppercase tracking-wider">Near Limit</div>
              <div className="text-lg font-bold text-white font-mono-film mt-0.5">{calculations.nearLimitM} m</div>
              <div className="text-[9px] text-neutral-400 mt-0.5">Sharpness begins</div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
              <div className="text-[10px] font-mono-film text-neutral-500 uppercase tracking-wider">Far Limit</div>
              <div className="text-lg font-bold text-white font-mono-film mt-0.5">{calculations.farLimitM}</div>
              <div className="text-[9px] text-neutral-400 mt-0.5">Sharpness ends</div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900/80 border border-cyan-800/80 bg-cyan-950/20">
              <div className="text-[10px] font-mono-film text-cyan-400 uppercase tracking-wider">Total Depth</div>
              <div className="text-lg font-bold text-cyan-300 font-mono-film mt-0.5">{calculations.totalDofM}</div>
              <div className="text-[9px] text-cyan-400/70 mt-0.5">{calculations.frontPct}% Front / {calculations.rearPct}% Rear</div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900/80 border border-emerald-800/80 bg-emerald-950/20">
              <div className="text-[10px] font-mono-film text-emerald-400 uppercase tracking-wider">Hyperfocal</div>
              <div className="text-lg font-bold text-emerald-300 font-mono-film mt-0.5">{calculations.hyperfocalM} m</div>
              <div className="text-[9px] text-emerald-400/70 mt-0.5">Focus here for ∞ sharpness</div>
            </div>
          </div>

          {/* Director Pro Tip */}
          <div className="p-3.5 rounded-xl border border-cyan-900/60 bg-cyan-950/30 flex items-start gap-3">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-300 leading-relaxed">
              <strong className="text-cyan-300 font-mono-film">CINE TAKEAWAY: </strong>
              {aperture <= 1.8 ? (
                <span>At f/{aperture}, your depth of field is razor-thin ({calculations.totalDofM}). Ensure your 1st AC is pulling with an ultrasonic focus buggy or CineTape, or an actor leaning forward 2 inches will buzz out of focus.</span>
              ) : aperture >= 8.0 ? (
                <span>At f/{aperture}, you have deep focus ({calculations.totalDofM}), ideal for Citizen Kane style multi-plane staging where actions happen simultaneously in foreground and background.</span>
              ) : (
                <span>At f/{aperture}, you strike the classic cinematic sweet spot: flattering facial separation with recognizable environmental architecture.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
