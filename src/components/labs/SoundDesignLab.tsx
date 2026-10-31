import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Square, Radio, Sparkles, Layers, Sliders } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface AudioChannel {
  id: string;
  name: string;
  type: string;
  color: string;
  volume: number;
  muted: boolean;
  solo: boolean;
  desc: string;
}

export const SoundDesignLab: React.FC = () => {
  const [channels, setChannels] = useState<AudioChannel[]>([
    {
      id: 'ambience',
      name: 'ROOM TONE & 42HZ SUB-DRONE',
      type: 'Atmospheric Noise',
      color: '#7DBBFF',
      volume: 75,
      muted: false,
      solo: false,
      desc: 'Nocturnal 42Hz fundamental room tone providing deep psychological weight.',
    },
    {
      id: 'foley',
      name: 'FOLEY (FOOTSTEPS & TEXTURES)',
      type: 'Diegetic Acoustic',
      color: '#A9D4FF',
      volume: 60,
      muted: false,
      solo: false,
      desc: 'Wet stone footsteps and tactile mechanical props.',
    },
    {
      id: 'music',
      name: 'DISSONANT CELLO & PAD',
      type: 'Score & Drones',
      color: '#2C6EA6',
      volume: 50,
      muted: false,
      solo: false,
      desc: 'Minimalist minor intervals heightening suspense.',
    },
    {
      id: 'impact',
      name: 'SUB-BASS BRAAM IMPACT',
      type: 'Tension Hits',
      color: '#8A96A3',
      volume: 85,
      muted: false,
      solo: false,
      desc: 'Sudden resonant acoustic thud marking psychological shifts.',
    },
  ]);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscMapRef = useRef<Map<string, { osc?: OscillatorNode; gain?: GainNode }>>(new Map());

  // Web Audio Context initialization
  const initLabAudio = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const startMixer = () => {
    initLabAudio();
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    stopMixer();

    // 1. Ambience (42Hz Drone)
    const ambOsc = ctx.createOscillator();
    const ambGain = ctx.createGain();
    ambOsc.type = 'sawtooth';
    ambOsc.frequency.setValueAtTime(42, now);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(95, now);

    ambGain.gain.setValueAtTime(0.001, now);
    ambGain.gain.exponentialRampToValueAtTime(0.18, now + 1.2);

    ambOsc.connect(filter);
    filter.connect(ambGain);
    ambGain.connect(ctx.destination);
    ambOsc.start(now);
    oscMapRef.current.set('ambience', { osc: ambOsc, gain: ambGain });

    // 2. Music (Pad drone at 84Hz & 126Hz)
    const musOsc = ctx.createOscillator();
    const musGain = ctx.createGain();
    musOsc.type = 'sine';
    musOsc.frequency.setValueAtTime(84, now);
    musGain.gain.setValueAtTime(0.001, now);
    musGain.gain.exponentialRampToValueAtTime(0.1, now + 2);
    musOsc.connect(musGain);
    musGain.connect(ctx.destination);
    musOsc.start(now);
    oscMapRef.current.set('music', { osc: musOsc, gain: musGain });

    setIsPlaying(true);
    soundEngine.playClick();
  };

  const stopMixer = () => {
    oscMapRef.current.forEach(({ osc, gain }) => {
      try {
        osc?.stop();
        osc?.disconnect();
        gain?.disconnect();
      } catch {}
    });
    oscMapRef.current.clear();
    setIsPlaying(false);
  };

  const triggerImpact = () => {
    initLabAudio();
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.4);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.95);
  };

  useEffect(() => {
    return () => stopMixer();
  }, []);

  const handleVolumeChange = (id: string, vol: number) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, volume: vol } : ch))
    );
  };

  const toggleMute = (id: string) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, muted: !ch.muted } : ch))
    );
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#020305] border border-[#102B45]">
        <div>
          <span className="font-mono text-xs text-[#7DBBFF] tracking-widest uppercase">
            AURAL ARCHITECTURE // NATIVE WEB AUDIO
          </span>
          <h3 className="font-headline font-bold text-xl text-[#F2F0EB]">
            Directorial Sound Design Suite
          </h3>
          <p className="text-xs text-[#8A96A3] mt-0.5">
            Crafting psychological tension through calibrated sub-bass, room tone, and silence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={isPlaying ? stopMixer : startMixer}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-bold tracking-wider flex items-center gap-2 transition-all ${
              isPlaying
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                : 'bg-[#7DBBFF] text-[#020305] hover:bg-[#A9D4FF]'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>STOP MIXER</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>ENGAGE SOUNDSCAPE</span>
              </>
            )}
          </button>

          <button
            onClick={triggerImpact}
            className="px-3.5 py-2 rounded-lg font-mono text-xs text-[#A9D4FF] bg-[#102B45] hover:bg-[#2C6EA6]/40 border border-[#2C6EA6] transition-colors"
          >
            TEST BRAAM HIT
          </button>
        </div>
      </div>

      {/* Interactive Channel Strips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className={`p-4 rounded-xl border transition-all ${
              ch.muted
                ? 'bg-[#020305]/60 border-[#102B45]/40 opacity-60'
                : 'bg-[#06090E] border-[#102B45]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-mono text-xs font-bold text-[#F2F0EB] tracking-wide">
                  {ch.name}
                </div>
                <div className="font-mono text-[10px] text-[#7DBBFF]">{ch.type}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleMute(ch.id)}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all border ${
                    ch.muted
                      ? 'bg-rose-900/40 text-rose-300 border-rose-700/60'
                      : 'bg-[#081522] text-[#8A96A3] border-[#102B45] hover:text-[#F2F0EB]'
                  }`}
                >
                  {ch.muted ? 'MUTED' : 'MUTE'}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-[#8A96A3] mb-3 leading-relaxed">{ch.desc}</p>

            {/* Volume Fader */}
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-[10px] text-[#8A96A3] min-w-[28px]">FADER:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={ch.volume}
                disabled={ch.muted}
                onChange={(e) => handleVolumeChange(ch.id, Number(e.target.value))}
                className="flex-1 accent-[#7DBBFF] cursor-pointer"
              />
              <span className="text-[#7DBBFF] text-[11px] font-bold min-w-[32px] text-right">
                {ch.volume}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Directorial Sound Rules */}
      <div className="p-4 rounded-lg bg-[#020305] border border-[#102B45] font-mono text-xs space-y-2">
        <div className="text-[#7DBBFF] font-bold">ZEEHAD'S AURAL GRAMMAR:</div>
        <ul className="space-y-1 text-[#8A96A3] text-[11px] list-disc list-inside">
          <li>Never use silence as a blank void; use 42Hz room tone to make silence physical.</li>
          <li>Lead visual cuts with an audio J-cut 0.5s prior to subconsciously ease audience transition.</li>
          <li>Contrast sharp footsteps against wide spatial reverbs to evoke architectural claustrophobia.</li>
        </ul>
      </div>
    </div>
  );
};
