export type Language = 'bn' | 'en' | 'hi' | 'ur';

export interface LocalizedString {
  bn: string;
  en: string;
  hi: string;
  ur: string;
}

export interface DirectorsCutData {
  cameraRig: string;
  lens: string;
  exposure: string;
  lightingSetup: string;
  colorScience: string;
  shutterAngle?: string;
  iso?: string;
  fStop?: string;
  focalLength?: string;
}

export interface FilmProject {
  id: string;
  slug: string;
  filmNumber?: string;
  title: LocalizedString;
  originalTitle?: string;
  year: string;
  runtime: string;
  durationInSeconds?: number;
  genre: LocalizedString;
  format: LocalizedString;
  concept: LocalizedString;
  synopsis: LocalizedString;
  credits: {
    role: LocalizedString;
    name: string;
  }[];
  technical: {
    camera: string;
    color: string;
    aspectRatio: string;
    audio: LocalizedString;
  };
  directorsCut?: DirectorsCutData;
  thumbnail: string;
  videoEmbedUrl?: string;
  youtubeUrl?: string;
  stills: string[];
  soundtrackStructure?: LocalizedString;
  multiPart?: {
    part: string;
    duration: string;
    title: LocalizedString;
    description: LocalizedString;
  }[];
  creativeFocus: LocalizedString[];
  category?: 'narrative' | 'horror' | 'silent' | 'vertical' | 'experimental' | 'documentary' | 'music-video';
  hasDirectorCommentary?: boolean;
  evolutionMilestone?: {
    quarter: string;
    phase: string;
    headline: LocalizedString;
    breakthrough: LocalizedString;
    shift: LocalizedString;
  };
}

export interface UpcomingStory {
  id: string;
  title: LocalizedString;
  originalTitle?: string;
  genre: LocalizedString;
  draftLength?: string;
  runtime?: string;
  characters?: string[];
  locations?: LocalizedString[];
  elements: LocalizedString[];
  synopsis: LocalizedString;
  tone: LocalizedString;
  thumbnail?: string;
  teaserVideoUrl?: string;
  teaserDirectUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language?: Language;
}
