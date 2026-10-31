import { useState, useEffect } from 'react';
import { Language } from '../types';
import { soundEngine } from '../utils/audio';

interface AudioPlayerControlProps {
  currentLang: Language;
}

export function AudioPlayerControl({ currentLang }: AudioPlayerControlProps) {
  const [isPlaying, setIsPlaying] = useState(soundEngine.getStatus());

  useEffect(() => {
    return soundEngine.subscribe((playing) => {
      setIsPlaying(playing);
    });
  }, []);

  const togglePlay = () => {
    soundEngine.toggle();
  };

  return (
    <aside className="fixed bottom-8 right-8 z-40">
      <button
        type="button"
        onClick={togglePlay}
        className="flex items-center gap-3 text-[10px] uppercase font-mono-film text-[#F2F0EB]/30 hover:text-cyan-400 transition-colors tracking-widest"
        aria-label="Toggle Audio"
      >
        <span>AUDIO {isPlaying ? 'ON' : 'OFF'}</span>
        <div className="flex items-end gap-[2px] h-3 w-4">
            {[0.4, 0.9, 0.6, 1].map((scale, i) => (
              <span
                key={i}
                className={`w-[2px] rounded-full transition-all duration-300 ${isPlaying ? 'bg-cyan-400' : 'bg-white/20'}`}
                style={{ height: isPlaying ? `${scale * 100}%` : '20%' }}
              />
            ))}
        </div>
      </button>
    </aside>
  );
}
