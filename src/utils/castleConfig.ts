import type { FilmProject } from "../types/content";

export type DestinationId =
  | "foyer"
  | "screening-hall"
  | "projection-room"
  | "directors-suite"
  | "institute"
  | "intelligence"
  | "grand-exit";

export type ChamberId = DestinationId;

export interface DestinationDefinition {
  id: DestinationId;
  number: string;
  label: string;
  shortLabel: string;
  href: string;
  subtitle: string;
}

export interface CameraWaypoint {
  chamber: DestinationId;
  posX: number;
  posY: number;
  posZ: number;
  lookX: number;
  lookY: number;
  lookZ: number;
  fov: number;
  beamIntensity: number;
}

export interface OpeningShotState {
  shot: 1 | 2 | 3 | 4;
  shotLabel: string;
  posX: number;
  posY: number;
  posZ: number;
  lookX: number;
  lookY: number;
  lookZ: number;
  fov: number;
  doorOpenRatio: number;
  curtainOpenRatio: number;
  screenGlow: number;
  beamIntensity: number;
}

export interface FilmDisplayMeta {
  indexLabel: string;
  title: string;
  isTitleVerified: boolean;
  category: string;
  formatLabel: string;
  description: string;
  creditsLabel: string;
  thumbnailUrl: string;
  embedUrl: string;
}

export const UNIVERSE_DESTINATIONS: readonly DestinationDefinition[] = [
  {
    id: "foyer",
    number: "01",
    label: "Grand Foyer",
    shortLabel: "Foyer",
    href: "#foyer",
    subtitle: "Palace Threshold & Identity",
  },
  {
    id: "screening-hall",
    number: "02",
    label: "The Screening Hall",
    shortLabel: "Screenings",
    href: "#screening-hall",
    subtitle: "IMAX Premiere Auditorium",
  },
  {
    id: "projection-room",
    number: "03",
    label: "The Projection Room",
    shortLabel: "Projection",
    href: "#projection-room",
    subtitle: "Optical Booth & Cinematography",
  },
  {
    id: "directors-suite",
    number: "04",
    label: "The Director's Suite",
    shortLabel: "Suite",
    href: "#directors-suite",
    subtitle: "Auteur Study & Screenplay Slate",
  },
  {
    id: "institute",
    number: "05",
    label: "Filmmaking Institute",
    shortLabel: "Institute",
    href: "#institute",
    subtitle: "30-Day Conservatory",
  },
  {
    id: "intelligence",
    number: "06",
    label: "Intelligence Chamber",
    shortLabel: "ZEE AI",
    href: "#intelligence",
    subtitle: "Cinematic Intelligence Core",
  },
  {
    id: "grand-exit",
    number: "07",
    label: "The Grand Exit",
    shortLabel: "Grand Exit",
    href: "#grand-exit",
    subtitle: "Correspondence & Portal",
  },
] as const;

export const UNIVERSE_CHAMBERS = UNIVERSE_DESTINATIONS;

export const CHAMBER_CAMERA_WAYPOINTS: readonly CameraWaypoint[] = [
  {
    chamber: "foyer",
    posX: 0,
    posY: 4.2,
    posZ: 42,
    lookX: 0,
    lookY: 4.8,
    lookZ: 10,
    fov: 52,
    beamIntensity: 1.0,
  },
  {
    chamber: "screening-hall",
    posX: 0,
    posY: 5.4,
    posZ: 4,
    lookX: 0,
    lookY: 5.0,
    lookZ: -48,
    fov: 58,
    beamIntensity: 1.35,
  },
  {
    chamber: "projection-room",
    posX: 1.4,
    posY: 6.2,
    posZ: -26,
    lookX: -0.4,
    lookY: 4.6,
    lookZ: -64,
    fov: 46,
    beamIntensity: 1.4,
  },
  {
    chamber: "directors-suite",
    posX: -1.6,
    posY: 4.4,
    posZ: -54,
    lookX: 0.3,
    lookY: 4.0,
    lookZ: -86,
    fov: 46,
    beamIntensity: 1.08,
  },
  {
    chamber: "institute",
    posX: 0,
    posY: 4.8,
    posZ: -78,
    lookX: 0,
    lookY: 5.1,
    lookZ: -108,
    fov: 52,
    beamIntensity: 1.25,
  },
  {
    chamber: "intelligence",
    posX: -0.8,
    posY: 3.9,
    posZ: -98,
    lookX: 0.1,
    lookY: 4.2,
    lookZ: -124,
    fov: 48,
    beamIntensity: 1.45,
  },
  {
    chamber: "grand-exit",
    posX: 0,
    posY: 3.6,
    posZ: -116,
    lookX: 0,
    lookY: 4.4,
    lookZ: -146,
    fov: 44,
    beamIntensity: 0.95,
  },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function smoothstep01(t: number): number {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}

/**
 * 4-Shot Continuous Grand Cinema Opening Choreography:
 * - Shot 01 (0.00–0.24): Exterior establishing vista of the monumental palace facade & searchlights
 * - Shot 02 (0.24–0.48): Dolly toward the grand steps as oversized bronze/gold doors swing open
 * - Shot 03 (0.48–0.72): Crane glide across the triple-height Grand Foyer chandelier & bifurcated stairs
 * - Shot 04 (0.72–1.00): Grand center-aisle push into the IMAX Auditorium as burgundy drapes part before the silver screen
 */
export function computeOpeningShotState(progress01: number): OpeningShotState {
  const t = clamp01(progress01);

  if (t < 0.24) {
    const local = smoothstep01(t / 0.24);
    return {
      shot: 1,
      shotLabel: "SHOT 01 · THE EXTERIOR",
      posX: lerp(2.2, 0.4, local),
      posY: lerp(5.8, 4.6, local),
      posZ: lerp(104, 80, local),
      lookX: 0,
      lookY: lerp(7.2, 5.8, local),
      lookZ: 52,
      fov: lerp(54, 50, local),
      doorOpenRatio: smoothstep01((local - 0.65) / 0.35) * 0.22,
      curtainOpenRatio: 0,
      screenGlow: 0.15,
      beamIntensity: lerp(0.9, 1.15, local),
    };
  }

  if (t < 0.48) {
    const local = smoothstep01((t - 0.24) / 0.24);
    return {
      shot: 2,
      shotLabel: "SHOT 02 · THE GRAND ENTRANCE",
      posX: lerp(0.4, 0, local),
      posY: lerp(4.6, 4.8, local),
      posZ: lerp(80, 50, local),
      lookX: 0,
      lookY: lerp(5.8, 5.6, local),
      lookZ: lerp(52, 22, local),
      fov: lerp(50, 52, local),
      doorOpenRatio: lerp(0.22, 1, Math.min(1, local * 1.25)),
      curtainOpenRatio: 0.08,
      screenGlow: 0.28,
      beamIntensity: lerp(1.15, 1.32, local),
    };
  }

  if (t < 0.72) {
    const local = smoothstep01((t - 0.48) / 0.24);
    return {
      shot: 3,
      shotLabel: "SHOT 03 · THE GRAND FOYER",
      posX: Math.sin(local * Math.PI) * 1.35,
      posY: lerp(4.8, 7.2, local),
      posZ: lerp(50, 14, local),
      lookX: 0,
      lookY: lerp(5.6, 5.2, local),
      lookZ: lerp(22, -24, local),
      fov: lerp(52, 56, local),
      doorOpenRatio: 1,
      curtainOpenRatio: lerp(0.08, 0.45, local),
      screenGlow: lerp(0.28, 0.62, local),
      beamIntensity: lerp(1.32, 1.48, local),
    };
  }

  const local = smoothstep01((t - 0.72) / 0.28);
  return {
    shot: 4,
    shotLabel: "SHOT 04 · THE MAIN AUDITORIUM",
    posX: 0,
    posY: lerp(7.2, 5.0, local),
    posZ: lerp(14, -14, local),
    lookX: 0,
    lookY: lerp(5.2, 5.4, local),
    lookZ: lerp(-24, -58, local),
    fov: lerp(56, 58, local),
    doorOpenRatio: 1,
    curtainOpenRatio: lerp(0.45, 1, local),
    screenGlow: lerp(0.62, 1, local),
    beamIntensity: lerp(1.48, 1.65, local),
  };
}

export function interpolateCameraPose(scrollProgress: number): CameraWaypoint {
  const t = clamp01(scrollProgress);
  const segments = CHAMBER_CAMERA_WAYPOINTS.length - 1;
  const scaled = t * segments;
  const index = Math.min(segments - 1, Math.floor(scaled));
  const localT = scaled - index;
  const smoothT = localT * localT * (3 - 2 * localT);
  const start = CHAMBER_CAMERA_WAYPOINTS[index];
  const end = CHAMBER_CAMERA_WAYPOINTS[index + 1];

  return {
    chamber: end.chamber,
    posX: lerp(start.posX, end.posX, smoothT),
    posY: lerp(start.posY, end.posY, smoothT),
    posZ: lerp(start.posZ, end.posZ, smoothT),
    lookX: lerp(start.lookX, end.lookX, smoothT),
    lookY: lerp(start.lookY, end.lookY, smoothT),
    lookZ: lerp(start.lookZ, end.lookZ, smoothT),
    fov: lerp(start.fov, end.fov, smoothT),
    beamIntensity: lerp(start.beamIntensity, end.beamIntensity, smoothT),
  };
}

export function getCameraTargetForChamber(chamberId: string): CameraWaypoint {
  const normalized = normalizeActiveChamber(chamberId);
  return (
    CHAMBER_CAMERA_WAYPOINTS.find((wp) => wp.chamber === normalized) ??
    CHAMBER_CAMERA_WAYPOINTS[0]
  );
}

export function normalizeActiveChamber(sectionId: string): DestinationId {
  if (
    sectionId === "screening-hall" ||
    sectionId === "filmography" ||
    sectionId === "films"
  ) {
    return "screening-hall";
  }
  if (
    sectionId === "projection-room" ||
    sectionId === "frame" ||
    sectionId === "visual-chamber" ||
    sectionId === "frame-archive" ||
    sectionId === "on-set"
  ) {
    return "projection-room";
  }
  if (
    sectionId === "directors-suite" ||
    sectionId === "auteur" ||
    sectionId === "about" ||
    sectionId === "off-set" ||
    sectionId === "process" ||
    sectionId === "projects"
  ) {
    return "directors-suite";
  }
  if (sectionId === "institute" || sectionId === "academy") {
    return "institute";
  }
  if (sectionId === "intelligence") return "intelligence";
  if (sectionId === "grand-exit" || sectionId === "contact") {
    return "grand-exit";
  }
  return "foyer";
}

interface VerifiedFilmDetail {
  title: string;
  category: string;
  formatLabel: string;
  description: string;
}

const VERIFIED_FILM_DETAILS: Record<string, VerifiedFilmDetail> = {
  ZSttExMBavg: {
    title: "SHADOW / III",
    category: "Psychological thriller · Short film",
    formatLabel: "Short Film",
    description:
      "A psychological and supernatural suspense experiment built around visual silence, repetition, loops and uncertainty.",
  },
  Zoqn6CyBIzU: {
    title: "Don't Go There — Teaser",
    category: "Mystery · Survival · Action · Psychological suspense",
    formatLabel: "Official Teaser",
    description:
      "A suspense-driven project introduced through its teaser.",
  },
};

export function getFilmDisplayMetadata(
  film: FilmProject,
  index: number,
): FilmDisplayMeta {
  const indexLabel = String(index + 1).padStart(2, "0");
  const verified = VERIFIED_FILM_DETAILS[film.videoId];
  const fallbackTitle = film.title ?? `Selected Film · Vault ${indexLabel}`;

  return {
    indexLabel,
    title: verified ? verified.title : fallbackTitle,
    isTitleVerified: Boolean(verified || film.title),
    category: verified
      ? verified.category
      : film.isShort
        ? "Short-form visual piece"
        : "Short film / Visual study",
    formatLabel: verified
      ? verified.formatLabel
      : film.isShort
        ? "Short Form"
        : "Archive Reel",
    description: verified
      ? verified.description
      : "Original YouTube screening preserved in the filmography archive. Additional title and production notes remain unconfirmed in the source manifest.",
    creditsLabel: "Zeehad Haque — Independent Practice",
    thumbnailUrl: `https://i.ytimg.com/vi/${film.videoId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${film.videoId}?rel=0&modestbranding=1`,
  };
}

export function resolveInitialLiteMode(options: {
  prefersReducedMotion: boolean;
  storedPreference: string | null;
  hardwareConcurrency?: number;
  deviceMemory?: number;
}): boolean {
  if (options.storedPreference === "true") return true;
  if (options.storedPreference === "false") return false;
  if (options.prefersReducedMotion) return true;
  if (
    typeof options.deviceMemory === "number" &&
    options.deviceMemory > 0 &&
    options.deviceMemory <= 2
  ) {
    return true;
  }
  if (
    typeof options.hardwareConcurrency === "number" &&
    options.hardwareConcurrency > 0 &&
    options.hardwareConcurrency <= 2
  ) {
    return true;
  }
  return false;
}
