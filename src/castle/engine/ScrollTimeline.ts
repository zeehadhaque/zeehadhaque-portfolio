export interface StageDefinition {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  start: number;
  end: number;
}

export const CASTLE_STAGES: StageDefinition[] = [
  {
    id: 1,
    code: "STAGE 01 // AWAKENING",
    title: "THE OBSIDIAN FACADE",
    subtitle: "Monumental Gothic stone blocks converge along luminous construction seams.",
    start: 0.0,
    end: 0.16,
  },
  {
    id: 2,
    code: "STAGE 02 // ENTRANCE TRANSIT",
    title: "THRESHOLD BREACH",
    subtitle: "Chromatic distortion and volumetric mist across the central portal.",
    start: 0.16,
    end: 0.28,
  },
  {
    id: 3,
    code: "STAGE 03 // SEGMENTED RING GATE",
    title: "ORBITAL ALIGNMENT",
    subtitle: "Counter-rotating mechanical monolith rings casting geometric caustics.",
    start: 0.28,
    end: 0.42,
  },
  {
    id: 4,
    code: "STAGE 04 // MONOLITH CO_01",
    title: "SHADOW / III",
    subtitle: "Move cursor to refract the crystal. Click to enter the screening.",
    start: 0.42,
    end: 0.58,
  },
  {
    id: 5,
    code: "STAGE 05 // MONOLITH CO_02",
    title: "COMPLETE FILM ARCHIVE",
    subtitle: "Second crystalline monolith housing the complete filmography archive.",
    start: 0.58,
    end: 0.74,
  },
  {
    id: 6,
    code: "STAGE 06 // CIRCULAR TERMINAL",
    title: "SANCTUARY CORE",
    subtitle: "Select a portal: Filmmaking Institute, ZEE AI Core, or Direct Contact.",
    start: 0.74,
    end: 0.9,
  },
  {
    id: 7,
    code: "STAGE 07 // GRAND EXIT",
    title: "INFINITE RETURN",
    subtitle: "Pass beyond the final gate to seamlessly re-enter the Awakening.",
    start: 0.9,
    end: 1.0,
  },
];

export class ScrollTimeline {
  private target = 0;
  private current = 0;
  private velocity = 0;
  private touchStartY = 0;
  private enabled = true;

  private readonly wheelSensitivity = 0.00028;
  private readonly touchSensitivity = 0.00095;
  private readonly damping = 0.075;

  private onWheelBound: (e: WheelEvent) => void;
  private onTouchStartBound: (e: TouchEvent) => void;
  private onTouchMoveBound: (e: TouchEvent) => void;
  private onKeyDownBound: (e: KeyboardEvent) => void;

  constructor() {
    this.onWheelBound = this.handleWheel.bind(this);
    this.onTouchStartBound = this.handleTouchStart.bind(this);
    this.onTouchMoveBound = this.handleTouchMove.bind(this);
    this.onKeyDownBound = this.handleKeyDown.bind(this);
  }

  public attach(el: HTMLElement | Window = window) {
    el.addEventListener("wheel", this.onWheelBound as EventListener, { passive: false });
    el.addEventListener("touchstart", this.onTouchStartBound as EventListener, { passive: true });
    el.addEventListener("touchmove", this.onTouchMoveBound as EventListener, { passive: false });
    window.addEventListener("keydown", this.onKeyDownBound);
  }

  public detach(el: HTMLElement | Window = window) {
    el.removeEventListener("wheel", this.onWheelBound as EventListener);
    el.removeEventListener("touchstart", this.onTouchStartBound as EventListener);
    el.removeEventListener("touchmove", this.onTouchMoveBound as EventListener);
    window.removeEventListener("keydown", this.onKeyDownBound);
  }

  public setEnabled(state: boolean) {
    this.enabled = state;
  }

  public jumpToProgress(normalized: number) {
    // Shortest directional wrap on infinite ring [0, 1)
    const currentMod = ((this.target % 1) + 1) % 1;
    let delta = normalized - currentMod;
    if (delta > 0.5) delta -= 1;
    if (delta < -0.5) delta += 1;
    this.target += delta;
  }

  public jumpToStage(stageId: number) {
    const found = CASTLE_STAGES.find((s) => s.id === stageId);
    if (!found) return;
    const midpoint = found.start + (found.end - found.start) * 0.45;
    this.jumpToProgress(midpoint);
  }

  public update(dt: number): { progress: number; velocity: number; stage: StageDefinition } {
    const step = 1 - Math.pow(1 - this.damping, dt * 60);
    const prev = this.current;
    this.current += (this.target - this.current) * step;
    this.velocity = (this.current - prev) / Math.max(dt, 0.001);

    // Seamless infinite modulo wrap without reloading or snapping
    const progress = ((this.current % 1) + 1) % 1;
    const stage =
      CASTLE_STAGES.find((s) => progress >= s.start && progress < s.end) ?? CASTLE_STAGES[0];

    return { progress, velocity: this.velocity, stage };
  }

  private handleWheel(e: WheelEvent) {
    if (!this.enabled) return;
    e.preventDefault();
    this.target += e.deltaY * this.wheelSensitivity;
  }

  private handleTouchStart(e: TouchEvent) {
    if (!this.enabled || !e.touches[0]) return;
    this.touchStartY = e.touches[0].clientY;
  }

  private handleTouchMove(e: TouchEvent) {
    if (!this.enabled || !e.touches[0]) return;
    e.preventDefault();
    const y = e.touches[0].clientY;
    const deltaY = this.touchStartY - y;
    this.touchStartY = y;
    this.target += deltaY * this.touchSensitivity;
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (!this.enabled) return;
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      this.target += 0.045;
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      this.target -= 0.045;
    }
  }
}
