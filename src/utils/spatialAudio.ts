/**
 * Spatial Audio Engine for Zeehad Haque — The Infinite Cinematic Castle
 * Inspired by igloo.inc procedural sound design & ambient stems.
 * Zero external audio files required — synthesizes ambient wind rumble,
 * sub-bass harmonic drone, mechanical portal lock clicks, and interface ticks
 * via the native Web Audio API.
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let windGain: GainNode | null = null;
let subGain: GainNode | null = null;
let isAudioInitialized = false;
let isMutedState = true;

const STORAGE_KEY = "zeehad-sound-muted";

function getStoredMutePreference(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const val = window.localStorage.getItem(STORAGE_KEY);
    return val !== "false"; // default muted
  } catch {
    return true;
  }
}

export function isSoundMuted(): boolean {
  return isMutedState;
}

export function initSpatialAudio(): boolean {
  if (typeof window === "undefined") return false;
  if (audioCtx && audioCtx.state !== "closed") {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return true;
  }

  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) return false;

  try {
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // 1. Procedural Wind / Reverb Ambience (Filtered Pink/White Noise)
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const windFilter = audioCtx.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.setValueAtTime(140, audioCtx.currentTime);
    windFilter.Q.setValueAtTime(3.2, audioCtx.currentTime);

    windGain = audioCtx.createGain();
    windGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

    noiseSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterGain);
    noiseSource.start();

    // 2. Sub-bass Harmonic Drone (48Hz fundamental + 96Hz overtone)
    const subOsc1 = audioCtx.createOscillator();
    subOsc1.type = "sine";
    subOsc1.frequency.setValueAtTime(48, audioCtx.currentTime);

    const subOsc2 = audioCtx.createOscillator();
    subOsc2.type = "sine";
    subOsc2.frequency.setValueAtTime(96.2, audioCtx.currentTime);

    subGain = audioCtx.createGain();
    subGain.gain.setValueAtTime(0.06, audioCtx.currentTime);

    const subFilter = audioCtx.createBiquadFilter();
    subFilter.type = "lowpass";
    subFilter.frequency.setValueAtTime(120, audioCtx.currentTime);

    subOsc1.connect(subFilter);
    subOsc2.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(masterGain);

    subOsc1.start();
    subOsc2.start();

    isAudioInitialized = true;
    return true;
  } catch {
    return false;
  }
}

export function toggleSpatialAudio(): boolean {
  if (!isAudioInitialized) {
    const ok = initSpatialAudio();
    if (!ok) return false;
  }

  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  isMutedState = !isMutedState;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(isMutedState));
  } catch {
    /* ignore */
  }

  if (masterGain && audioCtx) {
    const target = isMutedState ? 0 : 0.85;
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(target, audioCtx.currentTime + 0.4);
  }

  if (!isMutedState) {
    triggerMechanicalTick();
  }

  return !isMutedState;
}

let lastLockTriggerTime = 0;
export function triggerPortalLock(): void {
  if (isMutedState || !audioCtx || !masterGain) return;
  const now = performance.now();
  if (now - lastLockTriggerTime < 2400) return; // Debounce
  lastLockTriggerTime = now;

  try {
    const ctx = audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.4);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(640, ctx.currentTime);
    filter.Q.setValueAtTime(4.0, ctx.currentTime);

    gain.gain.setValueAtTime(0.24, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    /* ignore */
  }
}

export function triggerMechanicalTick(): void {
  if (isMutedState || !audioCtx || !masterGain) return;
  try {
    const ctx = audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    /* ignore */
  }
}

export function updateSpatialAudioScroll(progress: number): void {
  if (isMutedState || !audioCtx || !subGain || !windGain) return;
  try {
    const p = Math.min(1, Math.max(0, progress));
    // Modulate wind intensity and sub-bass resonance with depth
    const subTarget = 0.04 + Math.sin(p * Math.PI) * 0.05;
    const windTarget = 0.06 + Math.cos(p * Math.PI * 0.5) * 0.04;
    subGain.gain.setValueAtTime(subTarget, audioCtx.currentTime);
    windGain.gain.setValueAtTime(windTarget, audioCtx.currentTime);

    // Trigger ring portal lock click when passing z = -20 (progress around 0.25)
    if (Math.abs(p - 0.25) < 0.015) {
      triggerPortalLock();
    }
  } catch {
    /* ignore */
  }
}

// Check initial stored mute
if (typeof window !== "undefined") {
  isMutedState = getStoredMutePreference();
}
