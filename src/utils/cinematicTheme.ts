import { useEffect, useState, useMemo } from 'react';

export interface SectionAccent {
  id: string;
  name: string;
  chapterNumber: string;
  temp: string;
  accent: string;
  accentLight: string;
  accentRgb: string;
  glow: string;
  tone: 'cool' | 'warm' | 'neutral' | 'cyber';
  description: string;
}

export const DIRECTOR_CUT_ACCENT: SectionAccent = {
  id: 'directors-cut',
  name: "DIRECTOR'S CUT",
  chapterNumber: 'REC • DIR CUT',
  temp: '2800K VINTAGE TUNGSTEN',
  accent: '#f59e0b',
  accentLight: '#fde047',
  accentRgb: '245, 158, 11',
  glow: 'rgba(245, 158, 11, 0.45)',
  tone: 'warm',
  description: "Director's Cut 2800K Master Amber Gold",
};

export const SECTION_ACCENTS: Record<string, SectionAccent> = {
  hero: {
    id: 'hero',
    name: 'PROLOGUE',
    chapterNumber: 'FRAME 0001',
    temp: '5600K DAYLIGHT COOL',
    accent: '#00f0ff',
    accentLight: '#67e8f9',
    accentRgb: '0, 240, 255',
    glow: 'rgba(0, 240, 255, 0.4)',
    tone: 'cool',
    description: 'Electric Anamorphic Cyan',
  },
  profile: {
    id: 'profile',
    name: 'THE CINEMATOGRAPHER',
    chapterNumber: 'FRAME 0240',
    temp: '3200K TUNGSTEN WARM',
    accent: '#f59e0b',
    accentLight: '#fbbf24',
    accentRgb: '245, 158, 11',
    glow: 'rgba(245, 158, 11, 0.4)',
    tone: 'warm',
    description: 'Golden Hour 3200K Warm Tungsten',
  },
  approach: {
    id: 'approach',
    name: 'VISUAL LANGUAGE',
    chapterNumber: 'FRAME 0480',
    temp: '4500K NATURAL LOG',
    accent: '#14b8a6',
    accentLight: '#2dd4bf',
    accentRgb: '20, 184, 166',
    glow: 'rgba(20, 184, 166, 0.35)',
    tone: 'neutral',
    description: 'Celadon & Emerald Cine-Log',
  },
  work: {
    id: 'work',
    name: 'SELECTED WORK',
    chapterNumber: 'FRAME 0720',
    temp: '6500K ANAMORPHIC BLUE',
    accent: '#38bdf8',
    accentLight: '#7dd3fc',
    accentRgb: '56, 189, 248',
    glow: 'rgba(56, 189, 248, 0.45)',
    tone: 'cool',
    description: 'Cool Anamorphic Ice Blue',
  },
  filmstrip: {
    id: 'filmstrip',
    name: '35MM FRAME REEL',
    chapterNumber: 'FRAME 0960',
    temp: '5000K FILM EMULSION',
    accent: '#06b6d4',
    accentLight: '#67e8f9',
    accentRgb: '6, 182, 212',
    glow: 'rgba(6, 182, 212, 0.4)',
    tone: 'cool',
    description: 'Kodak 500T Latent Cyan',
  },
  arcade: {
    id: 'arcade',
    name: 'CINE-ARCADE',
    chapterNumber: 'FRAME 1180',
    temp: 'NEON INTERLACE',
    accent: '#818cf8',
    accentLight: '#a5b4fc',
    accentRgb: '129, 140, 248',
    glow: 'rgba(129, 140, 248, 0.4)',
    tone: 'cyber',
    description: 'Cyberpunk Neon Iris',
  },
  academy: {
    id: 'academy',
    name: 'FILM ACADEMY CODEX',
    chapterNumber: 'FRAME 1260',
    temp: '4800K PRISM SPECTRUM',
    accent: '#00f0ff',
    accentLight: '#67e8f9',
    accentRgb: '0, 240, 255',
    glow: 'rgba(0, 240, 255, 0.45)',
    tone: 'cool',
    description: 'Auteur Optics & Academy Cyan',
  },
  stories: {
    id: 'stories',
    name: 'IN DEVELOPMENT',
    chapterNumber: 'FRAME 1340',
    temp: '3800K MAGIC HOUR',
    accent: '#a78bfa',
    accentLight: '#c4b5fd',
    accentRgb: '167, 139, 250',
    glow: 'rgba(167, 139, 250, 0.35)',
    tone: 'neutral',
    description: 'Twilight Lavender Magic Hour',
  },
  interests: {
    id: 'interests',
    name: 'DISCIPLINES',
    chapterNumber: 'FRAME 1400',
    temp: '4200K STUDIO LOG',
    accent: '#2dd4bf',
    accentLight: '#5eead4',
    accentRgb: '45, 212, 191',
    glow: 'rgba(45, 212, 191, 0.35)',
    tone: 'neutral',
    description: 'Fine Grain Emulsion',
  },
  contact: {
    id: 'contact',
    name: 'COLLABORATION',
    chapterNumber: 'FRAME 1440',
    temp: '3000K WARM COPPER',
    accent: '#fb923c',
    accentLight: '#fdba74',
    accentRgb: '251, 146, 60',
    glow: 'rgba(251, 146, 60, 0.4)',
    tone: 'warm',
    description: 'Warm Studio Copper Sunset',
  },
};

export function applyCinematicAccent(accent: SectionAccent) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--cine-accent', accent.accent);
  root.style.setProperty('--cine-accent-light', accent.accentLight);
  root.style.setProperty('--cine-accent-rgb', accent.accentRgb);
  root.style.setProperty('--cine-accent-glow', accent.glow);
  root.style.setProperty('--cine-temp-name', `"${accent.temp}"`);
}

export function useActiveSectionAccent(directorsCut: boolean) {
  const [activeId, setActiveId] = useState<string>('hero');

  useEffect(() => {
    const sectionIds = [
      'hero',
      'profile',
      'about',
      'approach',
      'work',
      'filmstrip',
      'arcade',
      'academy',
      'stories',
      'interests',
      'contact',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the intersecting entry with the highest intersection ratio
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          let targetId = visible[0].target.id;
          if (targetId === 'about') targetId = 'profile';
          if (SECTION_ACCENTS[targetId]) {
            setActiveId(targetId);
          }
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -40% 0px',
        threshold: [0.1, 0.3, 0.6],
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const effectiveAccent = useMemo(() => {
    if (directorsCut) {
      return DIRECTOR_CUT_ACCENT;
    }
    return SECTION_ACCENTS[activeId] || SECTION_ACCENTS.hero;
  }, [directorsCut, activeId]);

  useEffect(() => {
    applyCinematicAccent(effectiveAccent);
  }, [effectiveAccent]);

  return {
    activeId,
    activeSection: SECTION_ACCENTS[activeId] || SECTION_ACCENTS.hero,
    effectiveAccent,
    isDirectorsCut: directorsCut,
  };
}
