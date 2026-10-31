/**
 * Web Audio API Dark Intense Cinematic Sound Engine
 * 100% Copyright-Free, Zero-Asset Procedural Audio Synthesis.
 * Designed for psychological thrillers, dark atmospheric tension, and auteur cinema.
 */

export type SoundscapeMode = 'dark-tension' | 'intense-thriller' | 'abyssal-noir';

class CinematicAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentMode: SoundscapeMode = 'dark-tension';
  private masterVolume = 0.22;

  // Audio nodes
  private masterGain: GainNode | null = null;
  private lowpassFilter: BiquadFilterNode | null = null;
  private subOsc1: OscillatorNode | null = null;
  private subOsc2: OscillatorNode | null = null;
  private subOsc3: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private pulseTimer: number | null = null;
  private filterLfo: OscillatorNode | null = null;
  private filterLfoGain: GainNode | null = null;

  private listeners: Set<(playing: boolean, mode: SoundscapeMode, volume: number) => void> = new Set();

  public subscribe(cb: (playing: boolean, mode: SoundscapeMode, volume: number) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying, this.currentMode, this.masterVolume));
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public getMode(): SoundscapeMode {
    return this.currentMode;
  }

  public getVolume(): number {
    return this.masterVolume;
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public setMode(mode: SoundscapeMode) {
    this.currentMode = mode;
    if (this.isPlaying) {
      this.stop();
      setTimeout(() => this.start(mode), 150);
    } else {
      this.notify();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(this.currentMode);
      return true;
    }
  }

  public startDrone() {
    this.start(this.currentMode);
  }

  public stopDrone() {
    this.stop();
  }

  /**
   * Generates a subtle dark noise buffer for textured room tone / atmospheric hiss
   */
  private createBrownianNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }
    return buffer;
  }

  /**
   * Starts dark procedural soundscape based on selected mode
   */
  public start(mode: SoundscapeMode = this.currentMode) {
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.isPlaying) return;

      this.currentMode = mode;
      const now = this.ctx.currentTime;

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(this.masterVolume, now + 2.5);
      this.masterGain.connect(this.ctx.destination);

      // Lowpass resonant filter (emulates dark cinematic underwater / acoustic gloom)
      this.lowpassFilter = this.ctx.createBiquadFilter();
      this.lowpassFilter.type = 'lowpass';
      this.lowpassFilter.Q.setValueAtTime(4.5, now);

      if (mode === 'dark-tension') {
        // Deep G#0/G#1 Hans Zimmer style tension braam / drone
        this.lowpassFilter.frequency.setValueAtTime(110, now);

        // Sub oscillator 1: 41.2 Hz (E1 deep sub)
        this.subOsc1 = this.ctx.createOscillator();
        this.subOsc1.type = 'sawtooth';
        this.subOsc1.frequency.setValueAtTime(41.2, now);

        // Sub oscillator 2: 41.7 Hz (Dissonant beat frequency)
        this.subOsc2 = this.ctx.createOscillator();
        this.subOsc2.type = 'triangle';
        this.subOsc2.frequency.setValueAtTime(41.7, now);

        // Third harmonic: 82.4 Hz (E2 octave drone)
        this.subOsc3 = this.ctx.createOscillator();
        this.subOsc3.type = 'sine';
        this.subOsc3.frequency.setValueAtTime(82.4, now);

        // LFO modulating filter cutoff for ominous breathing tension
        this.filterLfo = this.ctx.createOscillator();
        this.filterLfo.type = 'sine';
        this.filterLfo.frequency.setValueAtTime(0.18, now); // Slow 5.5s breath cycle

        this.filterLfoGain = this.ctx.createGain();
        this.filterLfoGain.gain.setValueAtTime(45, now);

        this.filterLfo.connect(this.filterLfoGain);
        this.filterLfoGain.connect(this.lowpassFilter.frequency);
        this.filterLfo.start();

        const oscGain1 = this.ctx.createGain();
        oscGain1.gain.value = 0.28;
        this.subOsc1.connect(oscGain1);
        oscGain1.connect(this.lowpassFilter);

        const oscGain2 = this.ctx.createGain();
        oscGain2.gain.value = 0.45;
        this.subOsc2.connect(oscGain2);
        oscGain2.connect(this.lowpassFilter);

        const oscGain3 = this.ctx.createGain();
        oscGain3.gain.value = 0.2;
        this.subOsc3.connect(oscGain3);
        oscGain3.connect(this.lowpassFilter);

        this.subOsc1.start();
        this.subOsc2.start();
        this.subOsc3.start();

        // Start Periodic Dark Heartbeat / Tension Pulse every 3.8s
        this.startPulseLoop(3800, 38);
      } else if (mode === 'intense-thriller') {
        // Fast-paced suspense pulse & sharp dissonant tension
        this.lowpassFilter.frequency.setValueAtTime(160, now);

        // Sub drone: 48 Hz
        this.subOsc1 = this.ctx.createOscillator();
        this.subOsc1.type = 'sawtooth';
        this.subOsc1.frequency.setValueAtTime(48, now);

        // Dissonant tritone: 67.8 Hz
        this.subOsc2 = this.ctx.createOscillator();
        this.subOsc2.type = 'sine';
        this.subOsc2.frequency.setValueAtTime(67.8, now);

        const oscGain1 = this.ctx.createGain();
        oscGain1.gain.value = 0.35;
        this.subOsc1.connect(oscGain1);
        oscGain1.connect(this.lowpassFilter);

        const oscGain2 = this.ctx.createGain();
        oscGain2.gain.value = 0.22;
        this.subOsc2.connect(oscGain2);
        oscGain2.connect(this.lowpassFilter);

        this.subOsc1.start();
        this.subOsc2.start();

        // Faster tension pulse (Every 1.25s - intense cinematic countdown pulse)
        this.startPulseLoop(1250, 46);
      } else {
        // 'abyssal-noir' - Deep, vast atmospheric silence, wind, and low sub-drone
        this.lowpassFilter.frequency.setValueAtTime(85, now);

        this.subOsc1 = this.ctx.createOscillator();
        this.subOsc1.type = 'sine';
        this.subOsc1.frequency.setValueAtTime(36.7, now); // Low D1

        this.subOsc2 = this.ctx.createOscillator();
        this.subOsc2.type = 'sine';
        this.subOsc2.frequency.setValueAtTime(55, now); // A1 fifth

        this.subOsc1.connect(this.lowpassFilter);
        this.subOsc2.connect(this.lowpassFilter);

        this.subOsc1.start();
        this.subOsc2.start();

        // Atmospheric brownian noise room tone
        const noiseBuf = this.createBrownianNoiseBuffer();
        if (noiseBuf) {
          this.noiseNode = this.ctx.createBufferSource();
          this.noiseNode.buffer = noiseBuf;
          this.noiseNode.loop = true;

          const noiseFilter = this.ctx.createBiquadFilter();
          noiseFilter.type = 'lowpass';
          noiseFilter.frequency.value = 220;

          this.noiseGain = this.ctx.createGain();
          this.noiseGain.gain.value = 0.08;

          this.noiseNode.connect(noiseFilter);
          noiseFilter.connect(this.noiseGain);
          this.noiseGain.connect(this.masterGain);
          this.noiseNode.start();
        }

        // Slow distant rumble pulse
        this.startPulseLoop(6500, 32);
      }

      this.lowpassFilter.connect(this.masterGain);
      this.isPlaying = true;
      this.notify();
    } catch {
      this.isPlaying = false;
      this.notify();
    }
  }

  /**
   * Synthesizes a deep cinematic acoustic sub-thud / heartbeat braam
   */
  private triggerDarkPulse(frequency = 42) {
    if (!this.ctx || !this.isPlaying || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency * 1.8, now);
      osc.frequency.exponentialRampToValueAtTime(frequency, now + 0.12);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, now);
      filter.frequency.exponentialRampToValueAtTime(60, now + 0.4);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.95);
    } catch {}
  }

  private startPulseLoop(intervalMs: number, freq: number) {
    if (this.pulseTimer) clearInterval(this.pulseTimer);
    // Trigger first pulse after short delay
    setTimeout(() => {
      if (this.isPlaying) this.triggerDarkPulse(freq);
    }, 400);

    this.pulseTimer = window.setInterval(() => {
      if (this.isPlaying) {
        this.triggerDarkPulse(freq);
      }
    }, intervalMs);
  }

  public stop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    try {
      if (this.pulseTimer) {
        clearInterval(this.pulseTimer);
        this.pulseTimer = null;
      }

      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      setTimeout(() => {
        try {
          this.subOsc1?.stop();
          this.subOsc2?.stop();
          this.subOsc3?.stop();
          this.filterLfo?.stop();
          this.noiseNode?.stop();

          this.subOsc1?.disconnect();
          this.subOsc2?.disconnect();
          this.subOsc3?.disconnect();
          this.filterLfo?.disconnect();
          this.filterLfoGain?.disconnect();
          this.lowpassFilter?.disconnect();
          this.noiseNode?.disconnect();
          this.noiseGain?.disconnect();
          this.masterGain?.disconnect();
        } catch {}
        this.isPlaying = false;
        this.notify();
      }, 850);
    } catch {
      this.isPlaying = false;
      this.notify();
    }
  }

  /**
   * UI Click feedback sound
   */
  public playClick() {
    if (!this.ctx) {
      this.initContext();
    }
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();

      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(650, now);
      clickOsc.frequency.exponentialRampToValueAtTime(90, now + 0.035);

      clickGain.gain.setValueAtTime(0.04, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.04);
    } catch {}
  }

  /**
   * UI Subtle Hover / Swoosh feedback
   */
  public playSwoosh() {
    if (!this.ctx) {
      this.initContext();
    }
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.08);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  public playHover() {
    this.playSwoosh();
  }

  /**
   * Film Clapperboard Snap Sound (percussive wood slap)
   */
  public playClapper() {
    if (!this.ctx) {
      this.initContext();
    }
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High snap click
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = 'square';
      snapOsc.frequency.setValueAtTime(800, now);
      snapOsc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
      snapGain.gain.setValueAtTime(0.12, now);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      // Low wood body thud
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      bodyOsc.type = 'triangle';
      bodyOsc.frequency.setValueAtTime(220, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
      bodyGain.gain.setValueAtTime(0.15, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      snapOsc.connect(snapGain);
      snapGain.connect(this.ctx.destination);
      bodyOsc.connect(bodyGain);
      bodyGain.connect(this.ctx.destination);

      snapOsc.start(now);
      snapOsc.stop(now + 0.05);
      bodyOsc.start(now);
      bodyOsc.stop(now + 0.09);
    } catch {}
  }

  /**
   * Camera Shutter Click-Clack Sound
   */
  public playShutter() {
    if (!this.ctx) {
      this.initContext();
    }
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // First click (mirror up)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1400, now);
      osc1.frequency.exponentialRampToValueAtTime(200, now + 0.03);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      // Second click (curtain shut)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(900, now + 0.045);
      osc2.frequency.exponentialRampToValueAtTime(150, now + 0.08);
      gain2.gain.setValueAtTime(0.09, now + 0.045);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.04);
      osc2.start(now + 0.045);
      osc2.stop(now + 0.09);
    } catch {}
  }

  /**
   * Cinematic Game Success Harmonic Chime
   */
  public playSuccess() {
    if (!this.ctx) {
      this.initContext();
    }
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5 - E5 - G5 - C6
      freqs.forEach((f, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.06);

        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.45);
      });
    } catch {}
  }

  /**
   * Countdown Tension Tick
   */
  public playTensionTick() {
    if (!this.ctx) {
      this.initContext();
    }
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.025);
    } catch {}
  }

  /**
   * 35mm Film Gate Advance / Sprocket Slide Sound
   */
  public playFilmSlide() {
    if (!this.ctx) {
      this.initContext();
    }
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Mechanical flutter / sprocket ratchet
      for (let i = 0; i < 5; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const t = now + i * 0.025;
        osc.frequency.setValueAtTime(600 - i * 50, t);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.02);
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.022);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.025);
      }
      this.playShutter();
    } catch {}
  }
}

export const soundEngine = new CinematicAudioEngine();
