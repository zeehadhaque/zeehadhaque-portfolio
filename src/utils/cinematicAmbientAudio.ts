/**
 * Cinematic Ambient Foley Sound Engine
 * Procedural, zero-dependency Web Audio API synthesis for context-aware cinematic atmospheres:
 * - 35mm Projector Motor & Shutter Hum
 * - Distant Nocturnal City & Soft Rain
 * - Clinical Fluorescent Hum & Sub-Dread
 * - Deep Forest Mist Wind Sweep
 * - Studio Reel & Analog Tape Flutter
 */

export type FoleyTheme =
  | 'projector'
  | 'city-night'
  | 'clinical'
  | 'forest-mist'
  | 'studio-reel';

export interface FoleyDescriptor {
  id: FoleyTheme;
  name: string;
  nameBn: string;
  desc: string;
  frequency: string;
  decibels: string;
}

export const FOLEY_DESCRIPTORS: Record<FoleyTheme, FoleyDescriptor> = {
  projector: {
    id: 'projector',
    name: '35MM PROJECTOR MOTOR & GATE HUM',
    nameBn: '৩৫ মিমি প্রজেক্টর মোটর ও গেট হাম',
    desc: '24fps mechanical film shutter flicker and warm analog capacitor hum',
    frequency: '24Hz / 72Hz Harmonic',
    decibels: '-24 dB',
  },
  'city-night': {
    id: 'city-night',
    name: 'DISTANT NOCTURNAL CITY & SOFT RAIN',
    nameBn: 'দূরের রাত্রিকালীন শহর ও বৃষ্টির শব্দ',
    desc: 'Gazipur night traffic resonance, filtered humidity, and distant droplets',
    frequency: '180Hz - 850Hz Bandpass',
    decibels: '-28 dB',
  },
  clinical: {
    id: 'clinical',
    name: 'CLINICAL FLUORESCENT BUZZ & SUB-DREAD',
    nameBn: 'ক্লিনিক্যাল ফ্লুরোসেন্ট গুঞ্জন ও নিস্তব্ধতা',
    desc: '50Hz cold ballast vibration, sterile room resonance, and deep tension',
    frequency: '50Hz / 100Hz Sine Pair',
    decibels: '-26 dB',
  },
  'forest-mist': {
    id: 'forest-mist',
    name: 'DEEP FOREST MIST & WIND HOWL',
    nameBn: 'গহীন অরণ্যের কুয়াশা ও বাতাসের সুর',
    desc: 'Resonant tree canopy draft and organic nocturnal foliage whisper',
    frequency: '320Hz Swept Notch',
    decibels: '-27 dB',
  },
  'studio-reel': {
    id: 'studio-reel',
    name: 'ANALOG TAPE REEL & EDIT SUITE AMBIENCE',
    nameBn: 'অ্যানালগ টেপ রিল ও স্টুডিও অ্যাম্বিয়েন্স',
    desc: 'Gentle magnetic tape hiss, capstan flutter, and acoustic studio presence',
    frequency: '4.2kHz Latent Bias',
    decibels: '-30 dB',
  },
};

// Map each DOM section to its tailored Foley theme
export const SECTION_FOLEY_MAP: Record<string, FoleyTheme> = {
  hero: 'clinical',
  profile: 'city-night',
  about: 'city-night',
  approach: 'clinical',
  work: 'projector',
  filmstrip: 'projector',
  arcade: 'studio-reel',
  stories: 'forest-mist',
  interests: 'studio-reel',
  contact: 'city-night',
};

class CinematicAmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isEnabled = true;
  private volume = 0.35;
  private currentTheme: FoleyTheme = 'clinical';

  // Active Sound Generation Nodes
  private masterGain: GainNode | null = null;
  private currentTrackGain: GainNode | null = null;
  private activeGenerators: { stop: () => void }[] = [];

  private listeners: Set<(theme: FoleyTheme, isEnabled: boolean, volume: number) => void> = new Set();

  public subscribe(cb: (theme: FoleyTheme, isEnabled: boolean, volume: number) => void): () => void {
    this.listeners.add(cb);
    cb(this.currentTheme, this.isEnabled, this.volume);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.currentTheme, this.isEnabled, this.volume));
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isEnabled ? this.volume : 0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getTheme(): FoleyTheme {
    return this.currentTheme;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.ctx && this.masterGain && this.isEnabled) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
    this.notify();
  }

  public toggleEnabled(): boolean {
    this.isEnabled = !this.isEnabled;
    this.initCtx();
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        this.isEnabled ? this.volume : 0,
        this.ctx.currentTime,
        0.15
      );
    }
    if (this.isEnabled && this.activeGenerators.length === 0) {
      this.playTheme(this.currentTheme);
    }
    this.notify();
    return this.isEnabled;
  }

  public setSection(sectionId: string) {
    const targetTheme = SECTION_FOLEY_MAP[sectionId] || 'clinical';
    if (targetTheme !== this.currentTheme) {
      this.setTheme(targetTheme);
    }
  }

  public setTheme(theme: FoleyTheme) {
    if (this.currentTheme === theme && this.activeGenerators.length > 0) return;
    this.currentTheme = theme;
    this.notify();

    if (!this.isEnabled) return;
    this.playTheme(theme);
  }

  private lastLensBreathTime = 0;

  /**
   * Synthesizes a subtle, variable-rate lens breathing foley sound effect.
   * Pitch-shifts and filters in real-time according to optical expansion factor and scroll velocity.
   */
  public playLensBreath(breathScale: number, scrollVelocity: number) {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    // Throttle to avoid audio clipping / overlapping spam
    if (now - this.lastLensBreathTime < 0.26) return;
    this.lastLensBreathTime = now;

    try {
      const ctx = this.ctx;
      const absVel = Math.abs(scrollVelocity);
      const isExpanding = scrollVelocity >= 0;

      // Variable duration based on velocity: 0.22s (rapid scroll) to 0.52s (slow breath)
      const duration = Math.max(0.2, Math.min(0.52, 0.48 - Math.min(25, absVel) * 0.01));

      // Calculate pitch shift ratio:
      // Base frequency sits around 160Hz - 240Hz.
      // Expanding focal barrel glides pitch upwards
      // Contracting focal barrel glides pitch downwards
      const startFreq = isExpanding ? 160 + (breathScale - 1) * 300 : 250 + (breathScale - 1) * 180;
      const endFreq = isExpanding
        ? Math.max(80, startFreq * (1.22 + Math.min(0.35, absVel * 0.018)))
        : Math.max(70, startFreq * 0.74);

      // 1. Helical mechanical tone (smooth triangle wave with lowpass)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const oscFilter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(Math.max(50, startFreq), now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + duration);

      oscFilter.type = 'lowpass';
      oscFilter.frequency.setValueAtTime(320, now);
      oscFilter.frequency.linearRampToValueAtTime(450, now + duration * 0.5);
      oscFilter.frequency.exponentialRampToValueAtTime(180, now + duration);
      oscFilter.Q.setValueAtTime(2.2, now);

      // Delicate envelope
      const maxOscGain = Math.min(0.045, 0.015 + (absVel / 40) * 0.022);
      oscGain.gain.setValueAtTime(0.0001, now);
      oscGain.gain.linearRampToValueAtTime(maxOscGain, now + duration * 0.3);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(oscFilter);
      oscFilter.connect(oscGain);
      oscGain.connect(this.masterGain);

      // 2. Air displacement whisper / lens barrel breath (filtered noise puff)
      const bufferSize = Math.max(512, Math.floor(ctx.sampleRate * duration));
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.04 * white) / 1.04;
        lastOut = data[i];
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      const noiseStartFreq = isExpanding ? 420 : 660;
      const noiseEndFreq = isExpanding ? 740 : 360;
      noiseFilter.frequency.setValueAtTime(noiseStartFreq, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(noiseEndFreq, now + duration);
      noiseFilter.Q.setValueAtTime(2.8, now);

      const noiseGain = ctx.createGain();
      const maxNoiseGain = Math.min(0.032, 0.01 + (absVel / 45) * 0.018);
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.linearRampToValueAtTime(maxNoiseGain, now + duration * 0.25);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.02);
      noiseSource.start(now);
      noiseSource.stop(now + duration + 0.02);
    } catch {
      // Graceful fallback
    }
  }

  private playTheme(theme: FoleyTheme) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    // Crossfade: fade out previous generators over 1.2 seconds
    const oldGenerators = [...this.activeGenerators];
    const oldTrackGain = this.currentTrackGain;
    if (oldTrackGain) {
      oldTrackGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
      setTimeout(() => {
        oldGenerators.forEach((g) => {
          try {
            g.stop();
          } catch {}
        });
      }, 1400);
    }

    // Create new track gain with smooth fade in
    const newTrackGain = this.ctx.createGain();
    newTrackGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    newTrackGain.gain.setTargetAtTime(1, this.ctx.currentTime, 0.6);
    newTrackGain.connect(this.masterGain);
    this.currentTrackGain = newTrackGain;
    this.activeGenerators = [];

    switch (theme) {
      case 'projector':
        this.buildProjectorFoley(newTrackGain);
        break;
      case 'city-night':
        this.buildCityNightFoley(newTrackGain);
        break;
      case 'clinical':
        this.buildClinicalFoley(newTrackGain);
        break;
      case 'forest-mist':
        this.buildForestMistFoley(newTrackGain);
        break;
      case 'studio-reel':
        this.buildStudioReelFoley(newTrackGain);
        break;
    }
  }

  // 1. 35mm Projector Motor & Mechanical Shutter Hum
  private buildProjectorFoley(dest: GainNode) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // 24Hz base projector frame motor
    const motorOsc = ctx.createOscillator();
    const motorGain = ctx.createGain();
    motorOsc.type = 'triangle';
    motorOsc.frequency.setValueAtTime(24, now); // 24 FPS pulse
    motorGain.gain.setValueAtTime(0.18, now);

    // 72Hz harmonic shutter buzz
    const harmonicOsc = ctx.createOscillator();
    const harmonicGain = ctx.createGain();
    harmonicOsc.type = 'sawtooth';
    harmonicOsc.frequency.setValueAtTime(72, now);
    harmonicGain.gain.setValueAtTime(0.06, now);

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(280, now);
    lowpass.Q.setValueAtTime(2, now);

    // Shutter LFO amplitude modulation (4Hz)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(4, now);
    lfoGain.gain.setValueAtTime(0.08, now);
    lfo.connect(lfoGain);
    lfoGain.connect(motorGain.gain);

    motorOsc.connect(lowpass);
    harmonicOsc.connect(lowpass);
    lowpass.connect(dest);

    motorOsc.start();
    harmonicOsc.start();
    lfo.start();

    this.activeGenerators.push({
      stop: () => {
        try {
          motorOsc.stop();
          harmonicOsc.stop();
          lfo.stop();
          motorOsc.disconnect();
          harmonicOsc.disconnect();
        } catch {}
      },
    });
  }

  // 2. Distant Nocturnal City & Soft Rain (Gazipur Nocturne)
  private buildCityNightFoley(dest: GainNode) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Procedural Pink Noise Buffer for rain and distant urban roll
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.08;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Rain bandpass filter
    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.setValueAtTime(650, now);
    rainFilter.Q.setValueAtTime(0.8, now);

    // Distant Sub Rumble (Traffic / nocturnal city distance)
    const rumbleOsc = ctx.createOscillator();
    const rumbleGain = ctx.createGain();
    rumbleOsc.type = 'sine';
    rumbleOsc.frequency.setValueAtTime(48, now);
    rumbleGain.gain.setValueAtTime(0.14, now);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.12, now);

    noiseSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(dest);
    rumbleOsc.connect(rumbleGain);
    rumbleGain.connect(dest);

    noiseSource.start();
    rumbleOsc.start();

    this.activeGenerators.push({
      stop: () => {
        try {
          noiseSource.stop();
          rumbleOsc.stop();
          noiseSource.disconnect();
          rumbleOsc.disconnect();
        } catch {}
      },
    });
  }

  // 3. Clinical Fluorescent Hum & Sub-Dread
  private buildClinicalFoley(dest: GainNode) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc50 = ctx.createOscillator();
    const gain50 = ctx.createGain();
    osc50.type = 'sine';
    osc50.frequency.setValueAtTime(50, now);
    gain50.gain.setValueAtTime(0.16, now);

    const osc100 = ctx.createOscillator();
    const gain100 = ctx.createGain();
    osc100.type = 'triangle';
    osc100.frequency.setValueAtTime(100, now);
    gain100.gain.setValueAtTime(0.05, now);

    const subDrone = ctx.createOscillator();
    const subGain = ctx.createGain();
    subDrone.type = 'sine';
    subDrone.frequency.setValueAtTime(32, now);
    subGain.gain.setValueAtTime(0.2, now);

    osc50.connect(gain50);
    gain50.connect(dest);
    osc100.connect(gain100);
    gain100.connect(dest);
    subDrone.connect(subGain);
    subGain.connect(dest);

    osc50.start();
    osc100.start();
    subDrone.start();

    this.activeGenerators.push({
      stop: () => {
        try {
          osc50.stop();
          osc100.stop();
          subDrone.stop();
          osc50.disconnect();
          osc100.disconnect();
          subDrone.disconnect();
        } catch {}
      },
    });
  }

  // 4. Deep Forest Mist & Wind Howl
  private buildForestMistFoley(dest: GainNode) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Soft organic noise buffer
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(340, now);
    windFilter.Q.setValueAtTime(4.0, now); // resonant wind howl

    // Wind modulation LFO
    const windLfo = ctx.createOscillator();
    const windLfoGain = ctx.createGain();
    windLfo.type = 'sine';
    windLfo.frequency.setValueAtTime(0.18, now); // slow drift
    windLfoGain.gain.setValueAtTime(140, now);
    windLfo.connect(windLfoGain);
    windLfoGain.connect(windFilter.frequency);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.22, now);

    noise.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(dest);

    noise.start();
    windLfo.start();

    this.activeGenerators.push({
      stop: () => {
        try {
          noise.stop();
          windLfo.stop();
          noise.disconnect();
        } catch {}
      },
    });
  }

  // 5. Studio Reel & Analog Tape Flutter
  private buildStudioReelFoley(dest: GainNode) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Gentle magnetic hiss
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.05;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const highFilter = ctx.createBiquadFilter();
    highFilter.type = 'highpass';
    highFilter.frequency.setValueAtTime(3500, now);

    const hissGain = ctx.createGain();
    hissGain.gain.setValueAtTime(0.08, now);

    // Capstan rotation flutter (12Hz)
    const capstanOsc = ctx.createOscillator();
    const capstanGain = ctx.createGain();
    capstanOsc.type = 'triangle';
    capstanOsc.frequency.setValueAtTime(12, now);
    capstanGain.gain.setValueAtTime(0.03, now);

    noise.connect(highFilter);
    highFilter.connect(hissGain);
    hissGain.connect(dest);
    capstanOsc.connect(capstanGain);
    capstanGain.connect(dest);

    noise.start();
    capstanOsc.start();

    this.activeGenerators.push({
      stop: () => {
        try {
          noise.stop();
          capstanOsc.stop();
          noise.disconnect();
          capstanOsc.disconnect();
        } catch {}
      },
    });
  }
}

export const cinematicAmbientAudio = new CinematicAmbientAudioEngine();
