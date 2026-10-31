import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { YouTubeFilm, YOUTUBE_FILMS } from '../data/youtubeFilms';

export type UniverseSection =
  | 'gate'
  | 'profile'
  | 'archive'
  | 'story'
  | 'camera'
  | 'light'
  | 'color'
  | 'edit'
  | 'sound'
  | 'toolbox'
  | 'zee'
  | 'terrace';

export type QualityTier = 'auto' | 'high' | 'medium' | 'low';

export interface LearningXP {
  story: number;
  directing: number;
  camera: number;
  light: number;
  editing: number;
  color: number;
  sound: number;
}

export type DirectorRank =
  | 'NOVICE'
  | 'APPRENTICE'
  | 'FILMMAKER'
  | 'DIRECTOR'
  | 'CINEMATOGRAPHER'
  | 'EDITOR'
  | 'VISUAL STORYTELLER'
  | "DIRECTOR'S MIND";

export interface CameraSettings {
  lens: '24mm' | '35mm' | '50mm' | '85mm';
  movement: 'STATIC' | 'GLIDE' | 'HANDHELD' | 'TRACK' | 'ORBIT' | 'PUSH-IN' | 'PULL-OUT';
  iso: number;
  shutter: string;
  aperture: string;
}

export interface ColorGradingSettings {
  preset: 'COLD NOCTURNE' | 'GOLDEN HOUR' | 'JUNGLE DAWN' | 'HIGH CONTRAST NOIR' | 'CUSTOM';
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  blacks: number;
  saturation: number;
  temperature: number;
  tint: number;
  blueShadows: number;
  grain: number;
  vignette: number;
}

interface UniverseState {
  // Navigation & Depth
  depthZ: number; // 10 down to -100
  targetDepthZ: number;
  currentSection: UniverseSection;
  isIntroComplete: boolean;

  // System & Settings
  audioEnabled: boolean;
  qualityLevel: QualityTier;
  directorMode: boolean; // Telemetry HUD
  webglSupported: boolean;

  // Active Modals & Labs
  selectedFilm: YouTubeFilm | null;
  activeLab: 'camera' | 'light' | 'color' | 'edit' | 'sound' | 'story' | null;
  zeeOpen: boolean;
  profileDossierOpen: boolean;
  toolboxOpen: boolean;

  // Cursor
  cursorLabel: string;

  // Learning & Progression
  xp: LearningXP;
  completedChallenges: string[];
  cameraSettings: CameraSettings;
  colorSettings: ColorGradingSettings;

  // Academy State
  courseProgress: Record<string, string[]>; // moduleID -> lessonIDs
  role: 'student' | 'admin';
  courseEntitlements: Record<string, 'FREE' | 'PAID' | 'LIFETIME'>;

  // Actions
  setDepthZ: (z: number) => void;
  setTargetDepthZ: (z: number) => void;
  navigateToSection: (section: UniverseSection) => void;
  completeIntro: () => void;
  toggleAudio: () => boolean;
  setQualityLevel: (tier: QualityTier) => void;
  toggleDirectorMode: () => void;
  setWebglSupported: (supported: boolean) => void;

  setSelectedFilm: (film: YouTubeFilm | null) => void;
  setActiveLab: (lab: 'camera' | 'light' | 'color' | 'edit' | 'sound' | 'story' | null) => void;
  setZeeOpen: (open: boolean) => void;
  setProfileDossierOpen: (open: boolean) => void;
  setToolboxOpen: (open: boolean) => void;

  setCursorLabel: (label: string) => void;

  addXP: (category: keyof LearningXP, amount: number) => void;
  completeChallenge: (challengeId: string) => void;
  updateCameraSettings: (settings: Partial<CameraSettings>) => void;
  updateColorSettings: (settings: Partial<ColorGradingSettings>) => void;
  applyColorPreset: (preset: ColorGradingSettings['preset']) => void;

  // Academy Actions
  completeLesson: (moduleId: string, lessonId: string) => void;
  grantCourseAccess: (studentId: string, courseId: string, access: 'FREE' | 'PAID' | 'LIFETIME', adminRole: 'student' | 'admin') => void;

  getDirectorRank: () => DirectorRank;
  getTotalXP: () => number;
}

export const SECTION_DEPTH_MAP: Record<UniverseSection, number> = {
  gate: 0,
  profile: -15,
  archive: -35,
  story: -50,
  camera: -65,
  light: -75,
  color: -80,
  edit: -88,
  sound: -92,
  toolbox: -94,
  zee: -96,
  terrace: -100,
};

const COLOR_PRESETS: Record<ColorGradingSettings['preset'], Partial<ColorGradingSettings>> = {
  'COLD NOCTURNE': {
    preset: 'COLD NOCTURNE',
    exposure: -0.15,
    contrast: 1.25,
    highlights: -0.2,
    shadows: 0.1,
    blacks: -0.15,
    saturation: 0.75,
    temperature: -24,
    tint: 4,
    blueShadows: 0.35,
    grain: 0.28,
    vignette: 0.45,
  },
  'GOLDEN HOUR': {
    preset: 'GOLDEN HOUR',
    exposure: 0.1,
    contrast: 1.15,
    highlights: 0.15,
    shadows: 0.05,
    blacks: -0.05,
    saturation: 1.2,
    temperature: 28,
    tint: -8,
    blueShadows: -0.15,
    grain: 0.15,
    vignette: 0.25,
  },
  'JUNGLE DAWN': {
    preset: 'JUNGLE DAWN',
    exposure: -0.05,
    contrast: 1.1,
    highlights: -0.1,
    shadows: 0.2,
    blacks: -0.1,
    saturation: 0.95,
    temperature: -8,
    tint: -18,
    blueShadows: 0.1,
    grain: 0.2,
    vignette: 0.35,
  },
  'HIGH CONTRAST NOIR': {
    preset: 'HIGH CONTRAST NOIR',
    exposure: 0.05,
    contrast: 1.6,
    highlights: 0.2,
    shadows: -0.35,
    blacks: -0.4,
    saturation: 0.0,
    temperature: -5,
    tint: 0,
    blueShadows: 0.1,
    grain: 0.45,
    vignette: 0.65,
  },
  CUSTOM: {
    preset: 'CUSTOM',
  },
};

export const useUniverseStore = create<UniverseState>()(
  persist(
    (set, get) => ({
      depthZ: 5,
      targetDepthZ: 5,
      currentSection: 'gate',
      isIntroComplete: false,

      audioEnabled: false,
      qualityLevel: 'auto',
      directorMode: false,
      webglSupported: true,

      selectedFilm: null,
      activeLab: null,
      zeeOpen: false,
      profileDossierOpen: false,
      toolboxOpen: false,

      cursorLabel: 'EXPLORE',

      xp: {
        story: 0,
        directing: 0,
        camera: 0,
        light: 0,
        editing: 0,
        color: 0,
        sound: 0,
      },
      completedChallenges: [],

      cameraSettings: {
        lens: '35mm',
        movement: 'STATIC',
        iso: 200,
        shutter: '1/48s',
        aperture: 'f/2.0',
      },

      colorSettings: {
        preset: 'COLD NOCTURNE',
        exposure: -0.15,
        contrast: 1.25,
        highlights: -0.2,
        shadows: 0.1,
        blacks: -0.15,
        saturation: 0.75,
        temperature: -24,
        tint: 4,
        blueShadows: 0.35,
        grain: 0.28,
        vignette: 0.45,
      },

      courseProgress: {},
      role: 'student',
      courseEntitlements: {},

      setDepthZ: (z) => set({ depthZ: z }),
      setTargetDepthZ: (z) => set({ targetDepthZ: z }),

      navigateToSection: (section) => {
        const targetZ = SECTION_DEPTH_MAP[section];
        set({
          targetDepthZ: targetZ,
          currentSection: section,
          isIntroComplete: true,
        });
      },

      completeIntro: () =>
        set({
          isIntroComplete: true,
          targetDepthZ: SECTION_DEPTH_MAP.gate,
        }),

      toggleAudio: () => {
        const current = get().audioEnabled;
        set({ audioEnabled: !current });
        return !current;
      },

      setQualityLevel: (tier) => set({ qualityLevel: tier }),

      toggleDirectorMode: () =>
        set((state) => ({ directorMode: !state.directorMode })),

      setWebglSupported: (supported) => set({ webglSupported: supported }),

      setSelectedFilm: (film) => set({ selectedFilm: film }),
      setActiveLab: (lab) => set({ activeLab: lab }),
      setZeeOpen: (open) => set({ zeeOpen: open }),
      setProfileDossierOpen: (open) => set({ profileDossierOpen: open }),
      setToolboxOpen: (open) => set({ toolboxOpen: open }),

      setCursorLabel: (label) => set({ cursorLabel: label }),

      addXP: (category, amount) =>
        set((state) => ({
          xp: {
            ...state.xp,
            [category]: Math.max(0, state.xp[category] + amount),
          },
        })),

      completeChallenge: (challengeId) =>
        set((state) => {
          if (state.completedChallenges.includes(challengeId)) return state;
          return {
            completedChallenges: [...state.completedChallenges, challengeId],
          };
        }),

      updateCameraSettings: (settings) =>
        set((state) => ({
          cameraSettings: { ...state.cameraSettings, ...settings },
        })),

      updateColorSettings: (settings) =>
        set((state) => ({
          colorSettings: {
            ...state.colorSettings,
            ...settings,
            preset: settings.preset || 'CUSTOM',
          },
        })),

      applyColorPreset: (presetName) => {
        const values = COLOR_PRESETS[presetName];
        if (values) {
          set((state) => ({
            colorSettings: { ...state.colorSettings, ...values },
          }));
        }
      },

      completeLesson: (moduleId, lessonId) =>
        set((state) => {
          const currentProgress = state.courseProgress[moduleId] || [];
          if (currentProgress.includes(lessonId)) return state;
          return {
            courseProgress: {
              ...state.courseProgress,
              [moduleId]: [...currentProgress, lessonId],
            },
          };
        }),

      grantCourseAccess: (studentId, courseId, access, adminKey) =>
        set((state) => {
            // AUTHORITATIVE CHECK MUST BE SERVER-SIDE.
            // Client-side only updates LOCAL state for UX.
            // Real entitlements must be fetched from API and persisted there.
            return {
                courseEntitlements: {
                    ...state.courseEntitlements,
                    [courseId]: access,
                },
            };
        }),

      getTotalXP: () => {
        const xp = get().xp;
        return (
          xp.story +
          xp.directing +
          xp.camera +
          xp.light +
          xp.editing +
          xp.color +
          xp.sound
        );
      },

      getDirectorRank: () => {
        const total = get().getTotalXP();
        if (total >= 1400) return "DIRECTOR'S MIND";
        if (total >= 1000) return 'VISUAL STORYTELLER';
        if (total >= 750) return 'EDITOR';
        if (total >= 500) return 'CINEMATOGRAPHER';
        if (total >= 300) return 'DIRECTOR';
        if (total >= 150) return 'FILMMAKER';
        if (total >= 50) return 'APPRENTICE';
        return 'NOVICE';
      },
    }),
    {
      name: 'zeehad-cinematic-universe-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        xp: state.xp,
        completedChallenges: state.completedChallenges,
        cameraSettings: state.cameraSettings,
        colorSettings: state.colorSettings,
        qualityLevel: state.qualityLevel,
        audioEnabled: state.audioEnabled,
        courseProgress: state.courseProgress,
        courseEntitlements: state.courseEntitlements,
      }),
    }
  )
);
