import { useState } from 'react';
import { Clapperboard, Plus, Trash2, Copy, Check, FileDown, Layers, Video } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface ShotItem {
  id: string;
  shotNum: string;
  size: 'ELS' | 'LS' | 'MLS' | 'MS' | 'MCU' | 'CU' | 'ECU';
  angle: 'Eye Level' | 'Low Angle (Dominance)' | 'High Angle (Vulnerability)' | 'Dutch Tilt (Unease)' | 'Overhead (God’s Eye)';
  movement: 'Static' | 'Pan / Tilt' | 'Dolly Push In' | 'Tracking / Steadicam' | 'Handheld Tremor' | 'Jib / Crane';
  lens: string;
  subjectNotes: string;
}

const DEFAULT_SHOTS: ShotItem[] = [
  {
    id: 's1',
    shotNum: '1.1',
    size: 'ELS',
    angle: 'High Angle (Vulnerability)',
    movement: 'Static',
    lens: '24mm Prime',
    subjectNotes: 'Establishing shot. Protagonist stands isolated in empty courtyard at dawn.',
  },
  {
    id: 's2',
    shotNum: '1.2',
    size: 'MS',
    angle: 'Eye Level',
    movement: 'Dolly Push In',
    lens: '35mm Prime',
    subjectNotes: 'Slow 3ft push into Jahid as he pulls the telegram from his pocket. Tension build.',
  },
  {
    id: 's3',
    shotNum: '1.3',
    size: 'MCU',
    angle: 'Eye Level',
    movement: 'Handheld Tremor',
    lens: '50mm Prime',
    subjectNotes: 'Jahid reads the telegram. Subtle organic handheld breathing to convey racing pulse.',
  },
  {
    id: 's4',
    shotNum: '1.4',
    size: 'ECU',
    angle: 'Eye Level',
    movement: 'Static',
    lens: '100mm Macro',
    subjectNotes: 'Extreme close up of eyes tracking the printed Bengali telegram lines. Pupil dilates.',
  },
];

export function ShotListGenerator() {
  const [shots, setShots] = useState<ShotItem[]>(DEFAULT_SHOTS);
  const [copied, setCopied] = useState(false);

  // New Shot Form
  const [newSize, setNewSize] = useState<ShotItem['size']>('CU');
  const [newAngle, setNewAngle] = useState<ShotItem['angle']>('Eye Level');
  const [newMovement, setNewMovement] = useState<ShotItem['movement']>('Static');
  const [newLens, setNewLens] = useState('50mm Prime');
  const [newNotes, setNewNotes] = useState('');

  const handleAddShot = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    const nextNum = `1.${shots.length + 1}`;
    const newShot: ShotItem = {
      id: `shot-${Date.now()}`,
      shotNum: nextNum,
      size: newSize,
      angle: newAngle,
      movement: newMovement,
      lens: newLens,
      subjectNotes: newNotes.trim() || 'Protagonist visual coverage setup.',
    };
    setShots([...shots, newShot]);
    setNewNotes('');
  };

  const handleDeleteShot = (id: string) => {
    soundEngine.playClick();
    setShots(shots.filter((s) => s.id !== id));
  };

  const handleCopyText = () => {
    soundEngine.playClick();
    const formatted = shots
      .map(
        (s) =>
          `[SHOT ${s.shotNum}] SIZE: ${s.size} | ANGLE: ${s.angle} | MOVE: ${s.movement} | LENS: ${s.lens}\n  NOTES: ${s.subjectNotes}`
      )
      .join('\n\n');

    navigator.clipboard.writeText(`=== CINEMATIC PRODUCTION SHOT LIST ===\n\n${formatted}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#050a17]/90 border border-neutral-800/90 rounded-2xl p-4 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono-film tracking-[0.25em] text-cyan-400 uppercase">
              PRODUCTION SHOT PLANNER & COVERAGE ARCHITECT
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white font-cinematic">
            Scene Coverage & Shot List Generator
          </h3>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Build and export standard production shot lists with focal lengths, camera angles, and movement grammar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyText}
          data-cursor="COPY"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/80 text-xs font-mono-film text-cyan-300 hover:bg-cyan-500/30 transition-all self-start sm:self-auto shadow-[0_0_15px_rgba(0,240,255,0.2)]"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY SHOT LIST'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Shot Builder Form */}
        <div className="lg:col-span-4 bg-neutral-900/60 border border-neutral-800 p-4 sm:p-5 rounded-xl space-y-4">
          <div className="text-xs font-bold font-mono-film text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Camera Setup</span>
          </div>

          <form onSubmit={handleAddShot} className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] font-mono-film text-neutral-400 uppercase mb-1">Shot Size</label>
              <select
                value={newSize}
                onChange={(e) => setNewSize(e.target.value as ShotItem['size'])}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-neutral-200 font-mono-film focus:border-cyan-400 focus:outline-none"
              >
                <option value="ELS">ELS - Extreme Long Shot (Environment)</option>
                <option value="LS">LS - Long Shot (Full Figure)</option>
                <option value="MLS">MLS - Medium Long Shot (Cowboy)</option>
                <option value="MS">MS - Medium Shot (Waist Up)</option>
                <option value="MCU">MCU - Medium Close-Up (Chest Up)</option>
                <option value="CU">CU - Close-Up (Face & Eyes)</option>
                <option value="ECU">ECU - Extreme Close-Up (Micro Detail)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono-film text-neutral-400 uppercase mb-1">Camera Angle</label>
              <select
                value={newAngle}
                onChange={(e) => setNewAngle(e.target.value as ShotItem['angle'])}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-neutral-200 font-mono-film focus:border-cyan-400 focus:outline-none"
              >
                <option value="Eye Level">Eye Level (Neutral Empathy)</option>
                <option value="Low Angle (Dominance)">Low Angle (Dominance & Power)</option>
                <option value="High Angle (Vulnerability)">High Angle (Vulnerability & Smallness)</option>
                <option value="Dutch Tilt (Unease)">Dutch Tilt (Unease & Paranoia)</option>
                <option value="Overhead (God’s Eye)">Overhead (God’s Eye / Geometric)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono-film text-neutral-400 uppercase mb-1">Camera Movement</label>
              <select
                value={newMovement}
                onChange={(e) => setNewMovement(e.target.value as ShotItem['movement'])}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-neutral-200 font-mono-film focus:border-cyan-400 focus:outline-none"
              >
                <option value="Static">Static / Locked Sticks (Observation)</option>
                <option value="Dolly Push In">Dolly Push In (Intensifying Emotion)</option>
                <option value="Tracking / Steadicam">Tracking / Steadicam (Dynamic Journey)</option>
                <option value="Handheld Tremor">Handheld Tremor (Verité Realism)</option>
                <option value="Pan / Tilt">Pan / Tilt (Revealing Information)</option>
                <option value="Jib / Crane">Jib / Crane (Spatial Grandeur)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono-film text-neutral-400 uppercase mb-1">Lens Choice</label>
              <select
                value={newLens}
                onChange={(e) => setNewLens(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-neutral-200 font-mono-film focus:border-cyan-400 focus:outline-none"
              >
                <option value="18mm Ultra-Wide">18mm Ultra-Wide Prime (Spatial Exaggeration)</option>
                <option value="24mm Wide">24mm Wide Prime (Architectural Context)</option>
                <option value="35mm Classic">35mm Classic (Human Narrative Naturalism)</option>
                <option value="50mm Standard">50mm Standard (Human Eye Neutrality)</option>
                <option value="85mm Portrait">85mm Portrait (Subject Isolation)</option>
                <option value="100mm Macro">100mm Macro (Micro-Insert Detail)</option>
                <option value="135mm Telephoto">135mm Telephoto (Spatial Compression)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono-film text-neutral-400 uppercase mb-1">Action & Emotional Subtext</label>
              <textarea
                rows={2}
                value={newNotes}
                placeholder="e.g. Actor turns towards window as rain starts..."
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-neutral-200 font-mono-film focus:border-cyan-400 focus:outline-none text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono-film rounded-lg transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] text-xs"
            >
              + APPEND TO SHOT LIST
            </button>
          </form>
        </div>

        {/* Shot Table Column */}
        <div className="lg:col-span-8 space-y-2.5 overflow-y-auto max-h-[480px] pr-1">
          {shots.map((shot) => (
            <div
              key={shot.id}
              className="p-3.5 rounded-xl border border-neutral-800/90 bg-neutral-900/40 hover:bg-neutral-900/80 transition-all flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                <div className="px-2 py-1 rounded bg-neutral-800 text-cyan-300 font-mono-film font-bold text-xs shrink-0">
                  {shot.shotNum}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono-film text-[10px] font-bold">
                      {shot.size}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60 font-mono-film text-[10px]">
                      {shot.angle.split(' ')[0]}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono-film text-[10px]">
                      {shot.movement}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono-film text-[10px]">
                      {shot.lens}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                    {shot.subjectNotes}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteShot(shot.id)}
                className="opacity-40 group-hover:opacity-100 hover:text-red-400 p-1 text-neutral-500 transition-all shrink-0"
                title="Remove Shot"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {shots.length === 0 && (
            <div className="text-center py-12 text-neutral-500 text-xs font-mono-film">
              No camera setups planned. Use the form to append shots.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
