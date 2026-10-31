import { useState } from 'react';
import { FileText, Camera, Headphones, Sun, Sparkles, UserCheck, Eye } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface ScriptAnnotation {
  id: string;
  type: 'camera' | 'actor' | 'lighting' | 'sound';
  label: string;
  heading: string;
  detail: string;
  technicalRule: string;
}

const ANNOTATIONS: Record<string, ScriptAnnotation> = {
  'slug-1': {
    id: 'slug-1',
    type: 'lighting',
    label: 'LIGHTING SETUP #01',
    heading: 'Nocturnal Atmospheric Color Palette',
    detail: 'Motivated by passing train headlamps and sodium-vapor platform lamps. Key Light is an Aputure 600d gelled with 1/2 CTO (3200K) through a 4x4 silk bounce. Background filled with deep cyan 7500K for color separation.',
    technicalRule: 'Kelvin Contrast: 3200K warm foreground vs 7500K cold industrial background.',
  },
  'shot-wide': {
    id: 'shot-wide',
    type: 'camera',
    label: 'CAMERA SETUP: 24MM WIDE',
    heading: 'Spatial Isolation & Geometry',
    detail: 'Cooke 25mm Anamorphic lens at T/2.8. Positioned 4 feet off ground level to emphasize the immense, hollow platform roof. Jahid occupies only 15% of the frame right, illustrating his complete social vulnerability.',
    technicalRule: 'Rule of Thirds + Negative Space: Giving negative space to the empty side makes the character appear awaiting an execution or verdict.',
  },
  'sound-train': {
    id: 'sound-train',
    type: 'sound',
    label: 'FOLEY & PSYCHOACOUSTICS',
    heading: 'Sub-bass Rail Resonance',
    detail: 'Layered sound design: 1) True location room tone recorded at Sreepur junction. 2) Pitched-down steel flange screeches at 45Hz to induce visceral anxiety in the theater subwoofer channel. 3) Distant crow calls signaling mortality.',
    technicalRule: 'Infrasound (< 50 Hz): Low rumble triggers primal evolutionary fear before the brain consciously recognizes the sound.',
  },
  'actor-rafia': {
    id: 'actor-rafia',
    type: 'actor',
    label: 'ACTOR SUBTEXT & TRANSITIVE VERB',
    heading: 'Physicalizing Rejection Without Hostility',
    detail: 'Actionable Verb for Actor: "Dissect him with clinical neutrality." Rafia does not scream; she folds the ticket with surgical precision. Her refusal to make direct eye contact is more devastating than any shouted argument.',
    technicalRule: 'Underplaying Crisis: When the situation is melodramatic, actors must underplay emotional intensity to prevent bathos.',
  },
  'shot-macro': {
    id: 'shot-macro',
    type: 'camera',
    label: 'CAMERA SETUP: 100MM MACRO',
    heading: 'Extreme Close-Up (ECU) of Torn Ticket',
    detail: '100mm Macro prime at T/4.0. The depth of field is only 8mm thick. As the paper fibers rip, the camera catches the tearing sound live with an MKH 50 hypercardioid placed 6 inches away.',
    technicalRule: 'Macro inserts function as narrative exclamation marks. Reserve them for moments where physical objects hold sacred or fatal weight.',
  },
};

export function InteractiveScriptBreakdown() {
  const [activeAnnotationKey, setActiveAnnotationKey] = useState<string>('slug-1');
  const activeAnno = ANNOTATIONS[activeAnnotationKey];

  const handleSelectCue = (key: string) => {
    soundEngine.playClick();
    setActiveAnnotationKey(key);
  };

  return (
    <div className="bg-[#050a17]/90 border border-neutral-800/90 rounded-2xl p-4 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
            <span className="text-[10px] font-mono-film tracking-[0.25em] text-pink-400 uppercase">
              INTERACTIVE SHOOTING SCRIPT BREAKDOWN // AUTEUR ANNOTATIONS
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white font-cinematic">
            Scene 14: Sreepur Junction (From "Chakra")
          </h3>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Click the glowing director cues in the script below to inspect camera lenses, lighting diagrams, sound layers, and actor subtext.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono-film text-neutral-400">
          <FileText className="w-3.5 h-3.5 text-pink-400" />
          <span>COURIER 12PT // INDUSTRY MASTER SPEC</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Screenplay Page Column */}
        <div className="lg:col-span-7 bg-[#0a0f1d] border border-neutral-800 rounded-xl p-5 sm:p-7 font-mono-film text-xs leading-relaxed text-neutral-300 shadow-inner overflow-x-auto select-none">
          {/* Page Top Margins */}
          <div className="flex justify-between text-[10px] text-neutral-600 border-b border-neutral-800/60 pb-2 mb-4">
            <span>SCENE 14 - SHOOTING SCRIPT</span>
            <span>PAGE 28</span>
          </div>

          {/* Slugline / Scene Heading */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => handleSelectCue('slug-1')}
              className={`text-left font-bold transition-all px-1.5 py-0.5 rounded ${
                activeAnnotationKey === 'slug-1'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : 'text-amber-400/90 hover:bg-neutral-800'
              }`}
            >
              EXT. SREEPUR RAILWAY PLATFORM - NIGHT [CUE: LIGHTING]
            </button>
          </div>

          {/* Action Paragraph */}
          <p className="mb-4 text-neutral-300">
            A relentless monsoon drizzle coats the corrugated iron roof. Sodium-vapor
            amber street lamps bleed through rising engine steam, slicing the damp dark.
          </p>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => handleSelectCue('shot-wide')}
              className={`text-left transition-all px-1.5 py-0.5 rounded ${
                activeAnnotationKey === 'shot-wide'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'text-cyan-400 hover:bg-neutral-800'
              }`}
            >
              JAHID (28) stands on the edge of Track 2, collar pulled high. He is soaked to
              the marrow, clutching an unmailed Western Union telegram in his right fist. [CUE: 25MM WIDE]
            </button>
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => handleSelectCue('sound-train')}
              className={`text-left transition-all px-1.5 py-0.5 rounded ${
                activeAnnotationKey === 'sound-train'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'text-emerald-400 hover:bg-neutral-800'
              }`}
            >
              Distant metal screeches. A 40-wagon freight locomotive grinds past on the
              adjacent track, drowning the station in rhythmic, chest-thumping thunder. [CUE: SOUND FOLEY]
            </button>
          </div>

          <p className="mb-4">
            Footsteps splash on the gravel behind him. RAFIA (26) approaches, umbrella tilted
            low. She stops three paces behind him. Neither turns.
          </p>

          {/* Dialogue Block */}
          <div className="my-5 max-w-sm mx-auto text-center">
            <div className="font-bold text-white tracking-widest uppercase mb-1">JAHID</div>
            <p className="text-left italic text-neutral-200">
              You booked the 04:15 express. You didn't tell my brother.
            </p>
          </div>

          <div className="my-5 max-w-sm mx-auto text-center">
            <div className="font-bold text-white tracking-widest uppercase mb-1">RAFIA</div>
            <div className="text-[10px] text-neutral-500 italic mb-1">(calm, voice like ice water)</div>
            <button
              type="button"
              onClick={() => handleSelectCue('actor-rafia')}
              className={`text-left italic block transition-all px-1.5 py-0.5 rounded ${
                activeAnnotationKey === 'actor-rafia'
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                  : 'text-pink-300 hover:bg-neutral-800'
              }`}
            >
              "Your brother still thinks a photograph can save an empty room. I have to live in the morning." [CUE: SUBTEXT]
            </button>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => handleSelectCue('shot-macro')}
              className={`text-left transition-all px-1.5 py-0.5 rounded ${
                activeAnnotationKey === 'shot-macro'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'text-cyan-400 hover:bg-neutral-800'
              }`}
            >
              She pulls the second-class ticket from her coat pocket, creases it slowly,
              and rips the green paper into two clean halves. [CUE: 100MM MACRO]
            </button>
          </div>
        </div>

        {/* Director Inspector Telemetry Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="p-5 sm:p-6 rounded-xl border border-neutral-700 bg-neutral-900/90 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-[10px] font-mono-film font-bold tracking-widest text-pink-400 uppercase">
                {activeAnno.label}
              </span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono-film uppercase font-bold ${
                activeAnno.type === 'camera'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : activeAnno.type === 'lighting'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : activeAnno.type === 'sound'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-pink-950 text-pink-300 border border-pink-800'
              }`}>
                {activeAnno.type}
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-white font-cinematic uppercase tracking-wide">
              {activeAnno.heading}
            </h4>

            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              {activeAnno.detail}
            </p>

            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
              <div className="text-[9px] font-mono-film text-neutral-400 uppercase tracking-wider">
                Theoretical Rule & Metric:
              </div>
              <div className="text-xs font-mono-film text-pink-300 font-semibold">
                {activeAnno.technicalRule}
              </div>
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono-film text-neutral-400 uppercase tracking-wider">
              Browse Scene Annotations:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(ANNOTATIONS).map((key) => {
                const a = ANNOTATIONS[key];
                const isSelected = activeAnnotationKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectCue(key)}
                    className={`p-2 rounded-lg border text-left text-xs font-mono-film transition-all ${
                      isSelected
                        ? 'bg-pink-500/20 border-pink-400 text-pink-200 font-bold'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="text-[9px] opacity-70 uppercase">{a.type}</div>
                    <div className="truncate">{a.label.split(':')[1] || a.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
