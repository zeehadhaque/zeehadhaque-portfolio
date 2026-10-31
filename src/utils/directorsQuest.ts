// Director's Quest Progression System & Cinema Badges Manager
export interface CinemaBadge {
  id: string;
  moduleId: string;
  titleEn: string;
  titleBn: string;
  conceptEn: string;
  conceptBn: string;
  iconName: string;
  tier: 'bronze' | 'silver' | 'gold' | 'master';
  xp: number;
}

export interface DirectorRank {
  level: number;
  titleEn: string;
  titleBn: string;
  minBadges: number;
  color: string;
}

export const DIRECTOR_RANKS: DirectorRank[] = [
  {
    level: 1,
    titleEn: 'Indie Novice / Film Enthusiast',
    titleBn: 'অপেশাদার চলচ্চিত্র শিক্ষানবিস',
    minBadges: 0,
    color: '#94a3b8',
  },
  {
    level: 2,
    titleEn: 'Assistant Director / Clapper Loader',
    titleBn: 'সহকারী পরিচালক ও ক্ল্যাপার লোডার',
    minBadges: 2,
    color: '#38bdf8',
  },
  {
    level: 3,
    titleEn: 'Director of Photography (DoP)',
    titleBn: 'প্রধান চিত্রগ্রাহক (সিনেমাটোগ্রাফার)',
    minBadges: 5,
    color: '#34d399',
  },
  {
    level: 4,
    titleEn: 'Independent Filmmaker (Indie Auteur)',
    titleBn: 'স্বাধীন চলচ্চিত্র নির্মাতা (ইন্ডি ফিল্মমেকার)',
    minBadges: 8,
    color: '#fbbf24',
  },
  {
    level: 5,
    titleEn: 'Cine-Grandmaster Auteur',
    titleBn: 'মাস্টারমাইন্ড সিনেমাটিক অটর',
    minBadges: 11,
    color: '#f43f5e',
  },
];

export const CINEMA_BADGES: CinemaBadge[] = [
  {
    id: 'badge-concept',
    moduleId: 'concept',
    titleEn: 'Logline Alchemist',
    titleBn: 'লগলাইন রূপকার',
    conceptEn: 'Mastery over psychological protagonist motives, catalysts, and nocturnal plot twists.',
    conceptBn: 'মনস্তাত্ত্বিক দ্বন্দ্ব, রহস্যময় অনুঘটক ও গভীর ক্লাইম্যাক্স মিলিয়ে চিত্রনাট্য ভাবনা নির্মাণ।',
    iconName: 'Lightbulb',
    tier: 'bronze',
    xp: 150,
  },
  {
    id: 'badge-storybeat',
    moduleId: 'storyboard-beat',
    titleEn: 'Narrative Architect',
    titleBn: '৩-অ্যাক্ট স্ট্রাকচারিস্ট',
    conceptEn: 'Perfect temporal orchestration of 3-Act structural beats and dark nights of the soul.',
    conceptBn: 'ক্লাসিক থ্রি-অ্যাক্ট স্ট্রাকচারে নাট্যমোড় ও মনস্তাত্ত্বিক রূপান্তর সুশৃঙ্খলভাবে সাজানোর দক্ষতা।',
    iconName: 'BookOpen',
    tier: 'bronze',
    xp: 200,
  },
  {
    id: 'badge-screenplay',
    moduleId: 'screenplay',
    titleEn: 'Auteur Screenwriter',
    titleBn: 'সাবটেক্সট স্ক্রিপ্টস্মিথ',
    conceptEn: 'Harnessing the power of cinematic subtext, heavy silence, and visual storytelling over exposition.',
    conceptBn: 'অতিরিক্ত সংলাপ বর্জন করে ফ্রেমের নীরবতা ও আলো দিয়ে গল্প বলার নিখুঁত সাবটেক্সট নিয়ন্ত্রণ।',
    iconName: 'FileText',
    tier: 'silver',
    xp: 250,
  },
  {
    id: 'badge-direction',
    moduleId: 'direction',
    titleEn: 'Stage Maestro',
    titleBn: 'ব্লকিং ও ডিরেকশন মাস্টার',
    conceptEn: 'Harmonizing actor psychology, spatial blocking depth, and lens choreography.',
    conceptBn: 'অভিনেতার আবেগীয় অবস্থান, স্টেজের গভীরতা এবং ক্যামেরার চলনের ঐক্যবদ্ধ পরিচালনা।',
    iconName: 'Clapperboard',
    tier: 'silver',
    xp: 250,
  },
  {
    id: 'badge-framing',
    moduleId: 'framing',
    titleEn: 'Framing Virtuoso',
    titleBn: 'ফ্রেম কম্পোজার এলিট',
    conceptEn: 'Precision composition utilizing 2.35:1 Anamorphic framing, Dutch angles, and the Rule of Thirds.',
    conceptBn: '২.৩৫:১ অ্যানামরফিক রেশিও, রুল অফ থার্ডস এবং ড্রামাটিক লো/হাই অ্যাঙ্গেল ফ্রেম সমন্বয়।',
    iconName: 'Compass',
    tier: 'silver',
    xp: 250,
  },
  {
    id: 'badge-lens',
    moduleId: 'lens-calib',
    titleEn: 'Optical Specialist',
    titleBn: 'লেন্স অপটিক্স এক্সপার্ট',
    conceptEn: 'Manual focus ring calibration, hyperfocal calculation, and razor-sharp circle of confusion control.',
    conceptBn: 'সিনেমা লেন্সের ফোকাস ও অ্যাপারচার রিং মিলিয়ে নিখুঁত ডেপথ-অব-ফিল্ড এবং বোকেহ নিয়ন্ত্রণ।',
    iconName: 'Sliders',
    tier: 'gold',
    xp: 300,
  },
  {
    id: 'badge-lighting',
    moduleId: 'lighting',
    titleEn: 'Chiaroscuro Gaffer',
    titleBn: 'থ্রি-পয়েন্ট লাইটিং ম্যাজিশিয়ান',
    conceptEn: 'Sculpting mood via Key, Fill, and Rim lights, masterfully executing Rembrandt chiaroscuro.',
    conceptBn: 'কি-লাইট, ফিল-লাইট ও রিম-লাইটের সঠিক অনুপাত এবং রেমব্রান্ট কন্ট্রাস্টের মাধ্যমে মেজাজ সৃষ্টি।',
    iconName: 'Sun',
    tier: 'gold',
    xp: 350,
  },
  {
    id: 'badge-storyboard',
    moduleId: 'storyboard',
    titleEn: 'Storyboard Visionary',
    titleBn: 'স্টোরিবোর্ড সিকোয়েন্সার',
    conceptEn: 'Assembling dynamic shot lists with lead room, headroom, and kinetic cutting rhythm.',
    conceptBn: 'শটের আকার (CU, WS, ECU), ক্যামেরার গতি ও লিড-রুম নিয়ম মেনে ৫-শটের ড্রামাটিক সিকোয়েন্স নির্মাণ।',
    iconName: 'Film',
    tier: 'gold',
    xp: 350,
  },
  {
    id: 'badge-focus',
    moduleId: 'focus',
    titleEn: 'Focus Puller Elite',
    titleBn: 'র‍্যাক ফোকাস প্রো',
    conceptEn: 'Executing micro-millimeter focus pulls and exposure balance under low-light high ISO environments.',
    conceptBn: 'কম আলোয় দ্রুত লেন্সের ফোকাস দূরত্ব ও আইএসও এক্সপোজার ব্যালেন্সের নিখুঁত শট ক্যাপচার।',
    iconName: 'Aperture',
    tier: 'silver',
    xp: 250,
  },
  {
    id: 'badge-color',
    moduleId: 'color',
    titleEn: 'DaVinci Colorist',
    titleBn: 'দাভিঞ্চি গ্রেডিং স্পেশালিস্ট',
    conceptEn: 'Subtle shadow lift, highlight cyan grading, and bleach bypass saturation finishing.',
    conceptBn: 'গাঢ় কালচে নীল শ্যাডো, হাইলাইট গেইন ও স্যাচুরেশন ব্যালেন্স করে সিগনেচার সিনেমাটিক প্যালেট তৈরি।',
    iconName: 'Palette',
    tier: 'gold',
    xp: 300,
  },
  {
    id: 'badge-clapper',
    moduleId: 'clapper',
    titleEn: '24FPS Slate Ace',
    titleBn: '২৪ এফপিএস ক্ল্যাপার কিং',
    conceptEn: 'Sub-frame 24fps synchronization reflex and audio timecode discipline.',
    conceptBn: '২৪ ফ্রেম পার সেকেন্ডের নিখুঁত রিফ্লেক্স এবং টাইমকোড সিঙ্ক মাস্টার।',
    iconName: 'Zap',
    tier: 'bronze',
    xp: 150,
  },
];

const STORAGE_KEY = 'zeehad_directors_quest_v1';

export interface QuestState {
  unlockedBadgeIds: string[];
  totalXp: number;
  recentUnlockedBadge: CinemaBadge | null;
}

class DirectorsQuestManager {
  private state: QuestState = {
    unlockedBadgeIds: [],
    totalXp: 0,
    recentUnlockedBadge: null,
  };

  private listeners: Set<(state: QuestState) => void> = new Set();

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.state = {
          unlockedBadgeIds: parsed.unlockedBadgeIds || [],
          totalXp: parsed.totalXp || 0,
          recentUnlockedBadge: null,
        };
      }
    } catch {
      // ignore
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          unlockedBadgeIds: this.state.unlockedBadgeIds,
          totalXp: this.state.totalXp,
        })
      );
    } catch {
      // ignore
    }
    this.notify();
  }

  public subscribe(fn: (state: QuestState) => void): () => void {
    this.listeners.add(fn);
    fn(this.state);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.state));
  }

  public getState(): QuestState {
    return this.state;
  }

  public unlockBadge(badgeId: string): boolean {
    if (this.state.unlockedBadgeIds.includes(badgeId)) {
      return false; // already unlocked
    }

    const badge = CINEMA_BADGES.find((b) => b.id === badgeId);
    if (!badge) return false;

    this.state.unlockedBadgeIds.push(badgeId);
    this.state.totalXp += badge.xp;
    this.state.recentUnlockedBadge = badge;

    this.save();
    return true;
  }

  public isBadgeUnlocked(badgeId: string): boolean {
    return this.state.unlockedBadgeIds.includes(badgeId);
  }

  public getCurrentRank(): DirectorRank {
    const count = this.state.unlockedBadgeIds.length;
    let rank = DIRECTOR_RANKS[0];
    for (const r of DIRECTOR_RANKS) {
      if (count >= r.minBadges) {
        rank = r;
      }
    }
    return rank;
  }

  public clearRecentUnlocked() {
    this.state.recentUnlockedBadge = null;
    this.notify();
  }

  public resetProgress() {
    this.state = {
      unlockedBadgeIds: [],
      totalXp: 0,
      recentUnlockedBadge: null,
    };
    this.save();
  }
}

export const directorsQuest = new DirectorsQuestManager();
