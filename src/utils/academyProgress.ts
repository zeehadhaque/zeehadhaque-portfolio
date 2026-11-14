import {
  academyDays,
  academyRanks,
  type AcademyModuleKey,
  type Bilingual,
} from "../data/academy";

export interface AcademyProgressRecord {
  day: number;
  xp_earned: number;
  reflection: string;
  completed_at: string;
}

export interface AcademyAttemptRecord {
  id: number;
  day: number;
  is_correct: boolean;
  xp_awarded: number;
  attempted_at: string;
}

export interface RoadmapTopic {
  id: string;
  number: string;
  module: AcademyModuleKey;
  title: Bilingual;
  summary: Bilingual;
  days: readonly number[];
}

export interface TopicProgress {
  topic: RoadmapTopic;
  completedCount: number;
  totalCount: number;
  percent: number;
  nextIncompleteDay: number | null;
  status: "completed" | "in-progress" | "upcoming";
}

export interface AchievementBadge {
  id: string;
  title: Bilingual;
  description: Bilingual;
  unlocked: boolean;
  current: number;
  target: number;
}

export interface StreakSummary {
  currentStreak: number;
  longestStreak: number;
  activeDaysCount: number;
}

export interface StudyRecommendation {
  kind: "continue" | "review" | "practice";
  targetDay: number;
  title: Bilingual;
  reason: Bilingual;
}

const b = (en: string, bn: string): Bilingual => ({ en, bn });

export const ACADEMY_TWELVE_TOPICS: readonly RoadmapTopic[] = [
  {
    id: "t01",
    number: "01",
    module: "visual",
    title: b("Frame Priority & Choice", "ফ্রেম প্রায়োরিটি ও পছন্দ"),
    summary: b("Decide what the frame includes, excludes and emphasises first.", "ফ্রেমের ভেতরে কী থাকবে, কী বাদ যাবে ও চোখ কোথায় যাবে নির্ধারণ করো।"),
    days: [1, 2],
  },
  {
    id: "t02",
    number: "02",
    module: "visual",
    title: b("Angles & Visual Space", "অ্যাঙ্গেল ও ভিজ্যুয়াল স্পেস"),
    summary: b("Use camera height, balance and negative space as emotional grammar.", "ক্যামেরার উচ্চতা, ব্যালেন্স ও নেগেটিভ স্পেসকে আবেগের ভাষা বানাও।"),
    days: [3, 4],
  },
  {
    id: "t03",
    number: "03",
    module: "visual",
    title: b("Axis, Eyelines & Sequences", "অ্যাক্সিস, আইলাইন ও সিকোয়েন্স"),
    summary: b("Protect spatial clarity across cuts and build visual sequences.", "কাটের মধ্যেও দিকনির্দেশনা বজায় রেখে সিকোয়েন্স তৈরি করো।"),
    days: [5, 6, 7],
  },
  {
    id: "t04",
    number: "04",
    module: "camera",
    title: b("Shutter, Motion & Lenses", "শাটার, মোশন ও লেন্স"),
    summary: b("Pair frame rate, shutter cadence and camera-to-subject perspective.", "ফ্রেম রেট, শাটার এবং ক্যামেরার দূরত্বের পারস্পরিক প্রভাব বোঝো।"),
    days: [8, 9],
  },
  {
    id: "t05",
    number: "05",
    module: "camera",
    title: b("Motivated Camera Movement", "মোটিভেটেড ক্যামেরা মুভমেন্ট"),
    summary: b("Move the camera only when the movement changes story information.", "গল্পের তথ্য বা আবেগ বদলালেই কেবল ক্যামেরা মুভ করাও।"),
    days: [10],
  },
  {
    id: "t06",
    number: "06",
    module: "camera",
    title: b("Light, Negative Fill & Colour", "আলো, নেগেটিভ ফিল ও কালার"),
    summary: b("Shape shadows with available light, contrast ratio and locked white balance.", "বিদ্যমান আলো, শ্যাডো ও লকড হোয়াইট ব্যালেন্স দিয়ে মুড তৈরি করো।"),
    days: [11, 12, 13, 14],
  },
  {
    id: "t07",
    number: "07",
    module: "story",
    title: b("Visual Premise & Playable Beats", "ভিজ্যুয়াল প্রেমিস ও বিট"),
    summary: b("Turn abstract themes into concrete image systems and character tactics.", "অ্যাবস্ট্র্যাক্ট ভাবনাকে শুটযোগ্য ইমেজ সিস্টেম ও বিটে রূপ দাও।"),
    days: [15, 16],
  },
  {
    id: "t08",
    number: "08",
    module: "story",
    title: b("Blocking & Layered Depth", "ব্লকিং ও লেয়ার্ড ডেপথ"),
    summary: b("Stage foreground, middle ground and background around dramatic shifts.", "ফরগ্রাউন্ড, মিডল ও ব্যাকগ্রাউন্ড জুড়ে অভিনয় ও সম্পর্ক সাজাও।"),
    days: [17, 18],
  },
  {
    id: "t09",
    number: "09",
    module: "story",
    title: b("Shot Lists, Suspense & Reveals", "শট লিস্ট, সাসপেন্স ও রিভিল"),
    summary: b("Plan lean coverage and control what the viewer knows and when.", "সহজ কাভারেজ প্ল্যান করে সাসপেন্স ও রিভিলের সময় নিয়ন্ত্রণ করো।"),
    days: [19, 20, 21],
  },
  {
    id: "t10",
    number: "10",
    module: "post",
    title: b("Continuity & Cutting on Action", "কন্টিনিউটি ও ম্যাচ-অন-অ্যাকশন"),
    summary: b("Make edits disappear inside movement, eyelines and rhythm.", "মুভমেন্ট, আইলাইন ও রিদমের ভেতরে কাটকে সাবলীল করো।"),
    days: [22, 23, 24],
  },
  {
    id: "t11",
    number: "11",
    module: "post",
    title: b("Sound Layers, Colour & Delivery", "সাউন্ড লেয়ার, কালার ও এক্সপোর্ট"),
    summary: b("Design room tone and silence, match shots, grade and verify exports.", "সাউন্ড লেয়ার, কালার কারেকশন ও এক্সপোর্ট কোয়ালিটি যাচাই করো।"),
    days: [25, 26, 27, 28],
  },
  {
    id: "t12",
    number: "12",
    module: "post",
    title: b("Silent Scene Capstone", "সাইলেন্ট সিন ক্যাপস্টোন"),
    summary: b("Plan, execute, screen and review a finished 45–90s silent film scene.", "৪৫–৯০ সেকেন্ডের একটি সম্পূর্ণ সাইলেন্ট সিন তৈরি ও রিভিউ করো।"),
    days: [29, 30],
  },
];

export function rankForXp(xp: number) {
  return [...academyRanks].reverse().find((rank) => xp >= rank.min) ?? academyRanks[0];
}

export function nextRankForXp(xp: number) {
  return academyRanks.find((rank) => rank.min > xp) ?? null;
}

export function rankProgressPercent(xp: number): number {
  const current = rankForXp(xp);
  const next = nextRankForXp(xp);
  if (!next) return 100;
  const span = Math.max(1, next.min - current.min);
  return Math.min(100, Math.max(0, Math.round(((xp - current.min) / span) * 100)));
}

function toUtcDayKey(isoString: string): string | null {
  const timestamp = Date.parse(isoString);
  if (!Number.isFinite(timestamp)) return null;
  return new Date(timestamp).toISOString().slice(0, 10);
}

function previousUtcDayKey(dayKey: string): string {
  const date = new Date(`${dayKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function computeLearningStreak(
  timestamps: readonly string[],
  referenceIso: string = new Date().toISOString(),
): StreakSummary {
  const uniqueDays = Array.from(
    new Set(
      timestamps
        .map((ts) => toUtcDayKey(ts))
        .filter((key): key is string => Boolean(key)),
    ),
  ).sort();

  if (uniqueDays.length === 0) {
    return { currentStreak: 0, longestStreak: 0, activeDaysCount: 0 };
  }

  let longestStreak = 1;
  let running = 1;
  for (let i = 1; i < uniqueDays.length; i += 1) {
    if (previousUtcDayKey(uniqueDays[i]) === uniqueDays[i - 1]) {
      running += 1;
      if (running > longestStreak) longestStreak = running;
    } else {
      running = 1;
    }
  }

  const daySet = new Set(uniqueDays);
  const todayKey = toUtcDayKey(referenceIso) ?? uniqueDays[uniqueDays.length - 1];
  const yesterdayKey = previousUtcDayKey(todayKey);

  let cursor: string | null = daySet.has(todayKey)
    ? todayKey
    : daySet.has(yesterdayKey)
      ? yesterdayKey
      : null;

  let currentStreak = 0;
  while (cursor && daySet.has(cursor)) {
    currentStreak += 1;
    cursor = previousUtcDayKey(cursor);
  }

  return {
    currentStreak,
    longestStreak,
    activeDaysCount: uniqueDays.length,
  };
}

export function getTopicProgress(
  topic: RoadmapTopic,
  completedDays: ReadonlySet<number>,
): TopicProgress {
  const completedCount = topic.days.filter((day) => completedDays.has(day)).length;
  const totalCount = topic.days.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const nextIncompleteDay = topic.days.find((day) => !completedDays.has(day)) ?? null;
  const status: TopicProgress["status"] =
    completedCount === totalCount
      ? "completed"
      : completedCount > 0
        ? "in-progress"
        : "upcoming";

  return {
    topic,
    completedCount,
    totalCount,
    percent,
    nextIncompleteDay,
    status,
  };
}

export function evaluateAchievements(params: {
  progress: readonly AcademyProgressRecord[];
  attempts: readonly AcademyAttemptRecord[];
  arcadeCompletedCount?: number;
}): readonly AchievementBadge[] {
  const completedCount = params.progress.length;
  const completedSet = new Set(params.progress.map((row) => row.day));
  const reflectionCount = params.progress.filter(
    (row) => row.reflection.trim().length >= 12,
  ).length;
  const memoryLabsCompleted = [7, 14, 21, 28].filter((day) =>
    completedSet.has(day),
  ).length;
  const correctAttempts = params.attempts.filter((a) => a.is_correct).length;
  const weekOneDone = [1, 2, 3, 4, 5, 6, 7].filter((d) =>
    completedSet.has(d),
  ).length;
  const arcadeCount = params.arcadeCompletedCount ?? 0;

  return [
    {
      id: "first-frame",
      title: b("First Frame", "প্রথম ফ্রেম"),
      description: b("Complete your very first daily lesson.", "প্রথম দিনের lesson সম্পন্ন করো।"),
      unlocked: completedCount >= 1,
      current: Math.min(1, completedCount),
      target: 1,
    },
    {
      id: "visual-foundation",
      title: b("Visual Foundation", "ভিজ্যুয়াল ফাউন্ডেশন"),
      description: b("Finish all 7 open days of Visual Language.", "Visual Language-এর ১–৭ দিন সম্পন্ন করো।"),
      unlocked: weekOneDone >= 7,
      current: weekOneDone,
      target: 7,
    },
    {
      id: "field-notes",
      title: b("Field Chronicler", "ফিল্ড নোট লেখক"),
      description: b("Write thoughtful reflections on 5 completed lessons.", "৫টি সম্পন্ন lesson-এ field notes লেখো।"),
      unlocked: reflectionCount >= 5,
      current: Math.min(5, reflectionCount),
      target: 5,
    },
    {
      id: "memory-keeper",
      title: b("Memory Lab Specialist", "মেমোরি ল্যাব স্পেশালিস্ট"),
      description: b("Clear at least 2 spaced-retrieval Memory Labs.", "কমপক্ষে ২টি Memory Lab সম্পন্ন করো।"),
      unlocked: memoryLabsCompleted >= 2,
      current: Math.min(2, memoryLabsCompleted),
      target: 2,
    },
    {
      id: "sharp-eye",
      title: b("Director's Eye", "পরিচালকের চোখ"),
      description: b("Score 5 correct verification checkpoints (quiz or arcade).", "মোট ৫টি সঠিক checkpoint বা arcade রাউন্ড পাস করো।"),
      unlocked: correctAttempts + arcadeCount >= 5,
      current: Math.min(5, correctAttempts + arcadeCount),
      target: 5,
    },
    {
      id: "auteur-graduate",
      title: b("30-Day Filmmaker", "৩০ দিনের চলচ্চিত্র নির্মাতা"),
      description: b("Complete the full 30-day curriculum & Silent Capstone.", "সম্পূর্ণ ৩০ দিনের প্রোগ্রাম ও Capstone সম্পন্ন করো।"),
      unlocked: completedCount >= 30,
      current: completedCount,
      target: 30,
    },
  ];
}

export function getRecommendedActions(params: {
  completedDays: ReadonlySet<number>;
  attempts: readonly AcademyAttemptRecord[];
  hasProgram: boolean;
}): readonly StudyRecommendation[] {
  const recommendations: StudyRecommendation[] = [];

  const maxAccessibleDay = params.hasProgram ? 30 : 7;
  const nextDay =
    academyDays.find(
      (day) => day.day <= maxAccessibleDay && !params.completedDays.has(day.day),
    )?.day ?? null;

  if (nextDay !== null) {
    const lesson = academyDays.find((d) => d.day === nextDay)!;
    recommendations.push({
      kind: "continue",
      targetDay: nextDay,
      title: b(`Continue Day ${String(nextDay).padStart(2, "0")}: ${lesson.title.en}`, `দিন ${String(nextDay).padStart(2, "0")} চালিয়ে যাও: ${lesson.title.bn}`),
      reason: b(lesson.objective.en, lesson.objective.bn),
    });
  }

  const latestWrongAttempt = [...params.attempts]
    .sort((a, bItem) => Date.parse(bItem.attempted_at) - Date.parse(a.attempted_at))
    .find((attempt) => !attempt.is_correct && attempt.day !== nextDay && attempt.day <= maxAccessibleDay);

  if (latestWrongAttempt) {
    const lesson = academyDays.find((d) => d.day === latestWrongAttempt.day);
    if (lesson) {
      recommendations.push({
        kind: "review",
        targetDay: lesson.day,
        title: b(`Revisit Day ${String(lesson.day).padStart(2, "0")}: ${lesson.title.en}`, `পুনরায় দেখো দিন ${String(lesson.day).padStart(2, "0")}: ${lesson.title.bn}`),
        reason: b("Strengthen recall on a concept where a recent checkpoint missed.", "সাম্প্রতিক checkpoint-এ ভুল হওয়া ধারণাটি আবার অনুশীলন করো।"),
      });
    }
  }

  const completedMemoryLab = [7, 14, 21, 28].find(
    (day) => day <= maxAccessibleDay && !params.completedDays.has(day) && day !== nextDay,
  );
  if (completedMemoryLab) {
    const lesson = academyDays.find((d) => d.day === completedMemoryLab)!;
    recommendations.push({
      kind: "practice",
      targetDay: lesson.day,
      title: b(`Upcoming Milestone: ${lesson.title.en}`, `আসন্ন মাইলফলক: ${lesson.title.bn}`),
      reason: b("Spaced retrieval consolidates the module before moving forward.", "পরের মডিউলে যাওয়ার আগে Spaced retrieval ধারণাগুলো পাকা করে।"),
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      kind: "review",
      targetDay: 1,
      title: b("Review Foundation Frame Study", "ফাউন্ডেশন ফ্রেম স্টাডি রিভিউ করো"),
      reason: b("Re-test Day 01 principles with a fresh location or lens.", "নতুন লোকেশন বা লেন্স দিয়ে Day 01 আবার পরীক্ষা করো।"),
    });
  }

  return recommendations.slice(0, 3);
}
