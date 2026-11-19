import { useEffect, useRef } from "react";

interface AudioControllerProps {
  isActive: boolean;
  scrollProgress: number;
}

export function AudioController({ isActive, scrollProgress }: AudioControllerProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.4);
      }
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGain.connect(ctx.destination);
        gainRef.current = masterGain;

        // Low-pass Filter for dark, deep gothic resonance
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(140, ctx.currentTime);
        filter.Q.setValueAtTime(3.5, ctx.currentTime);
        filter.connect(masterGain);
        filterRef.current = filter;

        // Sub-bass drone oscillator (55Hz, note A1)
        const osc1 = ctx.createOscillator();
        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(55, ctx.currentTime);
        osc1.connect(filter);
        osc1.start();
        osc1Ref.current = osc1;

        // Ethereal fifth overtone oscillator (82.4Hz, note E2)
        const osc2 = ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(82.4, ctx.currentTime);
        osc2.connect(filter);
        osc2.start();
        osc2Ref.current = osc2;
      }

      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      // Smooth fade-in
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.setTargetAtTime(0.12, audioCtxRef.current.currentTime, 1.2);
      }
    } catch {
      // Audio autoplay policy or device without audio hardware
    }
  }, [isActive]);

  // Modulate filter frequency based on scroll progress
  useEffect(() => {
    if (filterRef.current && audioCtxRef.current && isActive) {
      const targetFreq = 120 + scrollProgress * 320;
      filterRef.current.frequency.setTargetAtTime(targetFreq, audioCtxRef.current.currentTime, 0.2);
    }
  }, [scrollProgress, isActive]);

  return null;
}
