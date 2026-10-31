import React, { useState } from 'react';
import { Layers, Sparkles, CheckCircle2, RotateCcw, BookOpen, Film, Edit3 } from 'lucide-react';
import { useUniverseStore } from '../../store/universeStore';
import { soundEngine } from '../../utils/audio';

export const StoryLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'forge' | 'architect' | 'script'>('forge');
  const addXP = useUniverseStore((s) => s.addXP);
  const completeChallenge = useUniverseStore((s) => s.completeChallenge);

  // Idea Forge State
  const [forgeState, setForgeState] = useState({
    location: 'A decaying colonial estate in Old Dhaka',
    character: 'A solitary nocturnal courier with insomnia',
    object: 'An unlabelled cassette tape in a locked drawer',
    conflict: 'The corridors seem to alter direction after midnight',
    emotion: 'Existential dread & paranoid curiosity',
  });
  const [forgeEvaluation, setForgeEvaluation] = useState<string | null>(null);

  // Story Architect Beats State
  const [beats, setBeats] = useState<Array<{ id: string; act: string; label: string; desc: string }>>([
    { id: 'b1', act: 'HOOK', label: 'Ordinary Silence Shattered', desc: 'A strange sound arrives through the floorboards.' },
    { id: 'b2', act: 'SETUP', label: 'The Locked Boundary', desc: 'Protagonist discovers the exit is sealed from outside.' },
    { id: 'b3', act: 'CONFLICT', label: 'First Escalation', desc: 'Shadows in the mirror do not replicate actual movement.' },
    { id: 'b4', act: 'REVERSAL', label: 'Unmasking Paradox', desc: 'The tape recording recounts what is happening now.' },
    { id: 'b5', act: 'CLIMAX', label: 'Temporal Fracture', desc: 'Confrontation with their own reflection.' },
    { id: 'b6', act: 'RESOLUTION', label: 'Linger on Silence', desc: 'The light fades, leaving only the sound of water dripping.' },
  ]);

  // Script Lab Analysis State
  const [scriptInput, setScriptInput] = useState(
    `INT. HOSPITAL CORRIDOR - NIGHT\n\nFluorescent tubes buzz at 4300K cold cyan. MOFIZ (30s) walks slowly, his rubber soles sticking to wet linoleum.\n\nHe stops before Room 04. The door is slightly ajar. Inside, a stainless steel tray vibrates softly with nobody near it.\n\nMOFIZ\n(whispering to himself)\nI know I locked it.`
  );
  const [scriptAnalysis, setScriptAnalysis] = useState<string | null>(null);

  const handleEvaluateForge = () => {
    soundEngine.playSuccess();
    setForgeEvaluation(
      'ZEE DIRECTORIAL EVALUATION: High narrative velocity! The juxtaposition of Old Dhaka architecture with temporal tape phenomena mirrors the psychological dread of "Reflect" and "Ghurpak". Visual subtext score: 94/100.'
    );
    addXP('story', 25);
    completeChallenge('idea-forge-completion');
  };

  const handleAnalyzeScript = () => {
    soundEngine.playShutter();
    setScriptAnalysis(
      'ZEE SCRIPT ANALYSIS: Excellent sensory writing. You motivated the lighting (4300K cyan), prioritized diegetic audio (vibrating stainless tray), and kept spoken dialogue to a single minimalist whisper. Visual storytelling rating: MASTER.'
    );
    addXP('story', 30);
    completeChallenge('script-lab-analysis');
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#020305] border border-[#102B45] font-mono text-xs">
        <button
          onClick={() => {
            setActiveTab('forge');
            soundEngine.playClick();
          }}
          className={`flex-1 py-2 rounded text-center transition-all ${
            activeTab === 'forge'
              ? 'bg-[#102B45] text-[#7DBBFF] border border-[#2C6EA6] font-bold'
              : 'text-[#8A96A3] hover:text-[#F2F0EB]'
          }`}
        >
          01 // IDEA FORGE
        </button>
        <button
          onClick={() => {
            setActiveTab('architect');
            soundEngine.playClick();
          }}
          className={`flex-1 py-2 rounded text-center transition-all ${
            activeTab === 'architect'
              ? 'bg-[#102B45] text-[#7DBBFF] border border-[#2C6EA6] font-bold'
              : 'text-[#8A96A3] hover:text-[#F2F0EB]'
          }`}
        >
          02 // STORY ARCHITECT
        </button>
        <button
          onClick={() => {
            setActiveTab('script');
            soundEngine.playClick();
          }}
          className={`flex-1 py-2 rounded text-center transition-all ${
            activeTab === 'script'
              ? 'bg-[#102B45] text-[#7DBBFF] border border-[#2C6EA6] font-bold'
              : 'text-[#8A96A3] hover:text-[#F2F0EB]'
          }`}
        >
          03 // SCRIPT LAB
        </button>
      </div>

      {/* 1. Idea Forge Tab */}
      {activeTab === 'forge' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#06090E] border border-[#102B45] space-y-4">
            <div className="font-mono text-xs text-[#7DBBFF] font-bold">
              PREMISE ELEMENTS GENERATOR
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="text-[#8A96A3] block mb-1">LOCATION</label>
                <input
                  type="text"
                  value={forgeState.location}
                  onChange={(e) => setForgeState({ ...forgeState, location: e.target.value })}
                  className="w-full bg-[#020305] border border-[#102B45] rounded p-2 text-[#F2F0EB]"
                />
              </div>
              <div>
                <label className="text-[#8A96A3] block mb-1">PROTAGONIST</label>
                <input
                  type="text"
                  value={forgeState.character}
                  onChange={(e) => setForgeState({ ...forgeState, character: e.target.value })}
                  className="w-full bg-[#020305] border border-[#102B45] rounded p-2 text-[#F2F0EB]"
                />
              </div>
              <div>
                <label className="text-[#8A96A3] block mb-1">CENTRAL OBJECT</label>
                <input
                  type="text"
                  value={forgeState.object}
                  onChange={(e) => setForgeState({ ...forgeState, object: e.target.value })}
                  className="w-full bg-[#020305] border border-[#102B45] rounded p-2 text-[#F2F0EB]"
                />
              </div>
              <div>
                <label className="text-[#8A96A3] block mb-1">CONFLICT / ANOMALY</label>
                <input
                  type="text"
                  value={forgeState.conflict}
                  onChange={(e) => setForgeState({ ...forgeState, conflict: e.target.value })}
                  className="w-full bg-[#020305] border border-[#102B45] rounded p-2 text-[#F2F0EB]"
                />
              </div>
            </div>

            <button
              onClick={handleEvaluateForge}
              className="px-5 py-2.5 rounded-lg bg-[#7DBBFF] text-[#020305] font-mono text-xs font-bold hover:bg-[#A9D4FF] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>EVALUATE PREMISE WITH ZEE</span>
            </button>
          </div>

          {forgeEvaluation && (
            <div className="p-4 rounded-xl bg-[#020305] border border-[#7DBBFF]/40 text-xs font-mono text-[#A9D4FF] leading-relaxed animate-in fade-in duration-200">
              {forgeEvaluation}
            </div>
          )}
        </div>
      )}

      {/* 2. Story Architect Tab */}
      {activeTab === 'architect' && (
        <div className="space-y-4">
          <div className="font-mono text-xs text-[#7DBBFF] tracking-widest uppercase">
            3-ACT SUSPENSE BEAT TIMELINE
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {beats.map((b, i) => (
              <div key={b.id} className="p-3.5 rounded-xl bg-[#06090E] border border-[#102B45] space-y-1.5">
                <div className="flex justify-between items-center font-mono text-[10px]">
                  <span className="text-[#7DBBFF] font-bold">BEAT 0{i + 1}</span>
                  <span className="text-[#8A96A3]">{b.act}</span>
                </div>
                <div className="font-bold text-xs text-[#F2F0EB]">{b.label}</div>
                <p className="text-[11px] text-[#8A96A3] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Script Lab Tab */}
      {activeTab === 'script' && (
        <div className="space-y-4">
          <div className="font-mono text-xs text-[#7DBBFF] tracking-widest uppercase">
            VISUAL SCREENPLAY EDITOR & SUBTEXT ANALYZER
          </div>
          <textarea
            rows={8}
            value={scriptInput}
            onChange={(e) => setScriptInput(e.target.value)}
            className="w-full bg-[#020305] border border-[#102B45] focus:border-[#7DBBFF] rounded-xl p-4 font-mono text-xs text-[#F2F0EB] leading-relaxed outline-none"
          />
          <button
            onClick={handleAnalyzeScript}
            className="px-5 py-2.5 rounded-lg bg-[#7DBBFF] text-[#020305] font-mono text-xs font-bold hover:bg-[#A9D4FF] transition-all flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>ANALYZE SCREENPLAY FOR VISUAL SUBTEXT</span>
          </button>

          {scriptAnalysis && (
            <div className="p-4 rounded-xl bg-[#020305] border border-[#7DBBFF]/40 text-xs font-mono text-[#A9D4FF] leading-relaxed animate-in fade-in duration-200">
              {scriptAnalysis}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
