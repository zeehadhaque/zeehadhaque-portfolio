import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import {
  academyArcadeGames,
  academyDays,
  academyEntitlements,
  academyFinalExam,
  academyModules,
  academyRanks,
  type AcademyLanguage,
  type AcademyQuestion,
} from "../../data/academy";
import "../../styles/academy.css";
import { AdvancedLab } from "./AdvancedLab";

type Session = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  expires_at?: number;
};

type AcademyUser = { id: string; email: string; displayName: string };
type ProgressRow = { day: number; xp_earned: number; reflection: string; completed_at: string };
type EntitlementRow = { entitlement_key: string; expires_at: string | null; granted_at: string };
type Student = { user_id: string; display_name: string; email: string; created_at: string };
type Snapshot = {
  configured: boolean;
  signedIn?: boolean;
  user?: AcademyUser;
  isAdmin?: boolean;
  progress?: ProgressRow[];
  attempts?: Array<{ id: number; day: number; is_correct: boolean; xp_awarded: number; attempted_at: string }>;
  entitlements?: EntitlementRow[];
  students?: Student[];
  studentEntitlements?: Array<{ user_id: string; entitlement_key: string; expires_at: string | null; granted_at: string }>;
};

type ApiPayload = Record<string, unknown>;

const STORAGE_KEY = "zee-academy-session-v1";
const text = (language: AcademyLanguage, value: { en: string; bn: string }) =>
  language === "bn" ? value.bn : value.en;

async function academyApi(body?: ApiPayload, token?: string): Promise<Record<string, unknown>> {
  const response = await fetch("/api/academy", {
    method: body ? "POST" : "GET",
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  let result: Record<string, unknown> = {};
  try { result = await response.json() as Record<string, unknown>; } catch { /* handled below */ }
  if (!response.ok) throw new Error(typeof result.message === "string" ? result.message : "Academy request failed.");
  return result;
}

function storeSession(value: Session | null) {
  try {
    if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    else localStorage.removeItem(STORAGE_KEY);
  } catch { /* storage may be disabled */ }
}

function rankFor(xp: number) {
  return [...academyRanks].reverse().find((rank) => xp >= rank.min) ?? academyRanks[0];
}

function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="academy-ring" style={{ "--ring-progress": `${percent * 3.6}deg` } as CSSProperties}>
      <div><strong>{percent}%</strong><span>COMPLETE</span></div>
    </div>
  );
}

function AuthPanel({
  language, onClose, onSession,
}: {
  language: AcademyLanguage;
  onClose: () => void;
  onSession: (session: Session, user: AcademyUser) => Promise<void>;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    try {
      const result = await academyApi({
        action: mode === "signup" ? "signup" : "login",
        ...(mode === "signup" ? { displayName: name } : {}),
        email, password,
      });
      const session = result as unknown as Session;
      const user = result.user as { id?: string; email?: string; email_confirmed_at?: string | null; user_metadata?: { display_name?: string } } | undefined;
      if (!session.access_token || !session.refresh_token || !user?.id || !user.email) {
        setMessage(language === "bn"
          ? "Account request সম্পন্ন। Email inbox-এ verification link দেখো, verify করার পর Sign in করো।"
          : "Account request received. Check your email for a verification link, then sign in.");
        setMode("login");
        return;
      }
      const snapshotUser: AcademyUser = {
        id: user.id,
        email: user.email,
        displayName: user.user_metadata?.display_name || name || "Filmmaker",
      };
      await onSession(session, snapshotUser);
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Authentication failed.");
    } finally { setBusy(false); }
  };

  return (
    <div className="academy-auth" role="dialog" aria-modal="true" aria-labelledby="academy-auth-title">
      <button className="academy-auth__scrim" type="button" onClick={onClose} aria-label="Close sign in" />
      <div className="academy-auth__card">
        <button className="academy-icon-button academy-auth__close" type="button" onClick={onClose} aria-label="Close">×</button>
        <span className="academy-eyebrow">ZEE FILMMAKING ACADEMY / ACCOUNT</span>
        <h3 id="academy-auth-title">{mode === "signup" ? (language === "bn" ? "তোমার learning profile তৈরি করো" : "Create your learning profile") : (language === "bn" ? "আবার ফিরে এসো" : "Welcome back")}</h3>
        <p>{language === "bn" ? "Progress ও earned XP account-এ save হবে।" : "Your lesson progress and earned XP are saved to your account."}</p>
        <form onSubmit={submit}>
          {mode === "signup" && <label><span>{language === "bn" ? "নাম" : "Display name"}</span><input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} maxLength={80} autoComplete="name" /></label>}
          <label><span>Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
          <label><span>{language === "bn" ? "Password (কমপক্ষে ৮ অক্ষর)" : "Password (minimum 8 characters)"}</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} /></label>
          {error && <p className="academy-form-error" role="alert">{error}</p>}
          {message && <p className="academy-form-success" role="status">{message}</p>}
          <button className="academy-primary-button" type="submit" disabled={busy}>{busy ? "…" : mode === "signup" ? (language === "bn" ? "Account তৈরি করো" : "Create account") : (language === "bn" ? "Sign in" : "Sign in")} <span>↗</span></button>
        </form>
        <button className="academy-text-button" type="button" onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setMessage(""); setError(""); }}>
          {mode === "signup" ? (language === "bn" ? "আগে থেকে account আছে? Sign in" : "Already have an account? Sign in") : (language === "bn" ? "নতুন? Create account" : "New here? Create an account")}
        </button>
      </div>
    </div>
  );
}

function QuestionCard({
  question, language, selected, onSelect, checked, onCheck, disabled,
}: {
  question: AcademyQuestion;
  language: AcademyLanguage;
  selected: number | null;
  onSelect: (index: number) => void;
  checked: boolean;
  onCheck: () => void;
  disabled?: boolean;
}) {
  const answeredCorrectly = checked && selected === question.answerIndex;
  return (
    <div className="academy-question">
      <div className="academy-question__head"><span className="academy-eyebrow">{language === "bn" ? "নিজেকে যাচাই করো" : "CHECK YOUR UNDERSTANDING"}</span><span>01 / 01</span></div>
      <h3>{text(language, question.prompt)}</h3>
      <div className="academy-question__options" role="group" aria-label="Answer choices">
        {question.options.map((option, index) => (
          <button
            key={index}
            type="button"
            className={`academy-answer ${selected === index ? "is-selected" : ""} ${checked && index === question.answerIndex ? "is-correct" : ""} ${checked && selected === index && selected !== question.answerIndex ? "is-wrong" : ""}`}
            onClick={() => onSelect(index)}
            disabled={disabled || (checked && answeredCorrectly)}
          >
            <span>{String.fromCharCode(65 + index)}</span><strong>{text(language, option)}</strong>
            {checked && index === question.answerIndex && <i>✓</i>}
          </button>
        ))}
      </div>
      {checked && <div className={`academy-feedback ${answeredCorrectly ? "is-correct" : "is-wrong"}`} role="status">
        <strong>{answeredCorrectly ? (language === "bn" ? "ঠিক উত্তর!" : "Correct!") : (language === "bn" ? "আবার চেষ্টা করো" : "Not quite — try again")}</strong>
        <p>{text(language, question.explanation)}</p>
      </div>}
      {!answeredCorrectly && <button className="academy-primary-button academy-primary-button--compact" type="button" disabled={selected === null || disabled} onClick={onCheck}>{language === "bn" ? "উত্তর যাচাই" : "Check answer"} <span>↗</span></button>}
    </div>
  );
}

export function AcademySection() {
  const [language, setLanguage] = useState<AcademyLanguage>(() => {
    try { return localStorage.getItem("zee-academy-language") === "bn" ? "bn" : "en"; } catch { return "en"; }
  });
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AcademyUser | null>(null);
  const [snapshot, setSnapshot] = useState<Snapshot>({ configured: false, signedIn: false });
  const [authOpen, setAuthOpen] = useState(false);
  const [booting, setBooting] = useState(true);
  const [authNotice, setAuthNotice] = useState("");
  const [apiError, setApiError] = useState("");
  const [view, setView] = useState<"roadmap" | "exam" | "arcade" | "advanced" | "admin">("roadmap");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [reflection, setReflection] = useState("");
  const [saving, setSaving] = useState(false);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [arcadeGame, setArcadeGame] = useState<string | null>(null);
  const [arcadeIndex, setArcadeIndex] = useState(0);
  const [arcadeAnswer, setArcadeAnswer] = useState<number | null>(null);
  const [arcadeChecked, setArcadeChecked] = useState(false);
  const [arcadeScore, setArcadeScore] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [grantKey, setGrantKey] = useState("program.30day");
  const [grantDays, setGrantDays] = useState("30");
  const [grantNote, setGrantNote] = useState("");
  const [adminBusy, setAdminBusy] = useState(false);

  const progress = snapshot.progress ?? [];
  const entitlements = snapshot.entitlements ?? [];
  const completedDays = useMemo(() => new Set(progress.map((row) => Number(row.day))), [progress]);
  const xp = progress.reduce((sum, row) => sum + Number(row.xp_earned || 0), 0);
  const rank = rankFor(xp);
  const nextRank = academyRanks.find((entry) => entry.min > xp);
  const hasProgram = entitlements.some((entry) => entry.entitlement_key === "program.30day");
  const hasAdvancedArcade = entitlements.some((entry) => entry.entitlement_key === "arcade.pro");
  const hasAdvancedLab = entitlements.some((entry) => entry.entitlement_key === "track.advanced");
  const selectedLesson = academyDays.find((day) => day.day === selectedDay) ?? academyDays[0];
  const paidLocked = selectedLesson.day > 7 && !hasProgram;
  const prerequisiteLocked = Boolean(session && selectedLesson.day > 1 && !completedDays.has(selectedLesson.day - 1));
  const selectedLocked = paidLocked || prerequisiteLocked;
  const selectedCompleted = completedDays.has(selectedLesson.day);
  const completedInModule = (key: string) => progress.filter((row) => academyDays.find((day) => day.day === row.day)?.module === key).length;
  const filteredDays = academyDays.filter((day) => moduleFilter === "all" || day.module === moduleFilter);
  const copy = (en: string, bn: string) => language === "bn" ? bn : en;

  const loadSnapshot = async (token: string) => {
    const result = await academyApi(undefined, token) as unknown as Snapshot;
    setSnapshot(result);
    setUser(result.user ?? null);
    return result;
  };

  const activateSession = async (value: Session, authUser?: AcademyUser) => {
    const stored = { ...value, expires_at: value.expires_at ?? Math.floor(Date.now() / 1000) + (value.expires_in ?? 3600) };
    setSession(stored);
    storeSession(stored);
    if (authUser) setUser(authUser);
    const result = await loadSnapshot(stored.access_token);
    setAuthNotice(result.user ? copy("Progress sync is on.", "Progress account-এ sync হচ্ছে।") : "");
  };

  useEffect(() => {
    try { localStorage.setItem("zee-academy-language", language); } catch { /* ignored */ }
  }, [language]);

  useEffect(() => {
    let active = true;
    const boot = async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          let stored = JSON.parse(raw) as Session;
          if (stored.refresh_token && (stored.expires_at ?? 0) < Math.floor(Date.now() / 1000) + 60) {
            const refreshed = await academyApi({ action: "refresh", refreshToken: stored.refresh_token }) as unknown as Session;
            stored = { ...refreshed, expires_at: Math.floor(Date.now() / 1000) + (refreshed.expires_in ?? 3600) };
            storeSession(stored);
          }
          if (stored.access_token) {
            const result = await academyApi(undefined, stored.access_token) as unknown as Snapshot;
            if (active) { setSession(stored); setSnapshot(result); setUser(result.user ?? null); }
          } else if (active) storeSession(null);
        } else {
          const result = await academyApi() as unknown as Snapshot;
          if (active) setSnapshot(result);
        }
      } catch (cause) {
        if (active) {
          storeSession(null); setSession(null); setUser(null);
          const message = cause instanceof Error ? cause.message : "Academy service unavailable.";
          setApiError(message);
          try { const result = await academyApi(); if (active) setSnapshot(result as unknown as Snapshot); } catch { /* setup note below */ }
        }
      } finally { if (active) setBooting(false); }
    };
    void boot();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setReflection(progress.find((row) => row.day === selectedDay)?.reflection ?? "");
  }, [selectedDay, snapshot.progress]);

  const signOut = () => {
    storeSession(null); setSession(null); setUser(null);
    setSnapshot({ configured: snapshot.configured, signedIn: false });
    setAuthNotice(copy("Signed out. Guest practice remains available.", "Sign out হয়েছে। Guest practice চালু থাকবে।"));
    setView("roadmap");
  };

  const completeAnswer = async () => {
    if (selectedAnswer === null) return;
    setAnswerChecked(true);
    if (selectedAnswer !== selectedLesson.question.answerIndex) return;
    if (!session) {
      setAuthNotice(copy("Correct. Create a free account to save your lesson completion and earn XP.", "সঠিক! Lesson completion save ও XP earn করতে free account তৈরি করো।"));
      return;
    }
    if (selectedCompleted) {
      setAuthNotice(copy("This lesson is already completed. XP is awarded only once.", "এই lesson আগে complete হয়েছে। XP একবারই পাওয়া যায়।"));
      return;
    }
    setSaving(true); setApiError("");
    try {
      const result = await academyApi({ action: "complete_day", day: selectedLesson.day, answerIndex: selectedAnswer, reflection }, session.access_token);
      const awarded = Number(result.xp_awarded ?? 0);
      await loadSnapshot(session.access_token);
      setAuthNotice(awarded > 0
        ? copy(`Lesson saved. +${awarded} XP earned.`, `Lesson save হয়েছে। +${awarded} XP পেয়েছ।`)
        : copy("Answer recorded. This lesson has already awarded its XP.", "উত্তর record হয়েছে। এই lesson-এর XP আগেই দেওয়া হয়েছে।"));
    } catch (cause) {
      setApiError(cause instanceof Error ? cause.message : "Could not save progress.");
    } finally { setSaving(false); }
  };

  const submitExam = () => setExamSubmitted(true);
  const examScore = academyFinalExam.reduce((total, question, index) => total + (examAnswers[index] === question.answerIndex ? 1 : 0), 0);
  const currentGame = academyArcadeGames.find((game) => game.key === arcadeGame) ?? null;
  const currentArcadeQuestion = currentGame?.questions[arcadeIndex] ?? null;

  const grantEntitlement = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session || !selectedStudent) return;
    setAdminBusy(true); setApiError("");
    try {
      await academyApi({
        action: "grant",
        userId: selectedStudent,
        entitlementKey: grantKey,
        days: grantDays === "permanent" ? null : Number(grantDays),
        note: grantNote,
      }, session.access_token);
      await loadSnapshot(session.access_token);
      setAuthNotice(copy("Access updated successfully.", "Access সফলভাবে update হয়েছে।"));
    } catch (cause) { setApiError(cause instanceof Error ? cause.message : "Could not grant access."); }
    finally { setAdminBusy(false); }
  };

  const revokeEntitlement = async (studentId: string, key: string) => {
    if (!session) return;
    setAdminBusy(true); setApiError("");
    try {
      await academyApi({ action: "revoke", userId: studentId, entitlementKey: key }, session.access_token);
      await loadSnapshot(session.access_token);
      setAuthNotice(copy("Access revoked.", "Access revoke করা হয়েছে।"));
    } catch (cause) { setApiError(cause instanceof Error ? cause.message : "Could not revoke access."); }
    finally { setAdminBusy(false); }
  };

  const showDay = (day: number) => {
    setSelectedDay(day);
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setView("roadmap");
  };

  return (
    <section className="academy-experience" id="academy" aria-labelledby="academy-title">
      <div className="academy-shell">
        <header className="academy-masthead">
          <div className="academy-brand">
            <span className="academy-brand__mark">ZH<span>·</span></span>
            <div><span className="academy-eyebrow">INDEPENDENT FILMMAKER'S LEARNING LAB</span><strong>ZEE FILMMAKING ACADEMY</strong></div>
          </div>
          <div className="academy-masthead__actions">
            <div className="academy-language" role="group" aria-label="Language">
              <button type="button" className={language === "en" ? "is-active" : ""} onClick={() => setLanguage("en")}>EN</button>
              <button type="button" className={language === "bn" ? "is-active" : ""} onClick={() => setLanguage("bn")}>বাংলা</button>
            </div>
            {user ? (
              <div className="academy-user-menu"><span className="academy-user-avatar">{user.displayName.slice(0,1).toUpperCase()}</span><span>{user.displayName}</span><button type="button" className="academy-text-button" onClick={signOut}>{copy("Sign out", "Sign out")}</button></div>
            ) : (
              <button className="academy-outline-button" type="button" onClick={() => setAuthOpen(true)}>{copy("Sign in / Join free", "Sign in / বিনামূল্যে যোগ দাও")} ↗</button>
            )}
          </div>
        </header>

        <div className="academy-hero">
          <div className="academy-hero__copy">
            <span className="academy-eyebrow">{copy("THE CRAFT IS LEARNED BY MAKING.", "তৈরি করতে করতেই শিল্প শেখা হয়।")}</span>
            <h2 id="academy-title">{copy("Learn the frame.\nShape the story.", "ফ্রেম শেখো।\nগল্প তৈরি করো।")}</h2>
            <p>{copy("A practical filmmaking path from visual language to a finished short scene. Learn a principle, test it with your camera, then reflect on what the frame communicates.", "Visual language থেকে finished short scene পর্যন্ত filmmaking-এর practical পথ। একটি principle শেখো, camera দিয়ে পরীক্ষা করো, তারপর frame কী communicate করছে তা ভেবে দেখো।")}</p>
            <div className="academy-hero__meta"><span>01—30 / CURRICULUM</span><span>LESSON · PRACTICE · RECALL</span></div>
          </div>
          <div className="academy-hero__art" aria-hidden="true">
            <div className="academy-lens academy-lens--outer" /><div className="academy-lens academy-lens--inner" /><div className="academy-lens academy-lens--core" />
            <span className="academy-hero__cross">＋</span><span className="academy-hero__coordinates">23° 59' N<br/>90° 25' E</span><span className="academy-hero__art-label">FRAME / FOCUS / FEELING</span>
          </div>
        </div>

        <nav className="academy-nav" aria-label={copy("Academy tools", "Academy tools")}>
          <button className={view === "roadmap" ? "is-active" : ""} type="button" onClick={() => setView("roadmap")}><span>01</span>{copy("Roadmap & lessons", "Roadmap ও lesson")}</button>
          <button className={view === "exam" ? "is-active" : ""} type="button" onClick={() => { setView("exam"); setExamSubmitted(false); }}><span>02</span>{copy("Examinations", "পরীক্ষা")}</button>
          <button className={view === "arcade" ? "is-active" : ""} type="button" onClick={() => setView("arcade")}><span>03</span>Cine-Arcade</button>
          <button className={view === "advanced" ? "is-active" : ""} type="button" onClick={() => { if (hasAdvancedLab) setView("advanced"); else setAuthNotice(copy("Advanced Cinematography Lab access is assigned by Academy admin.", "Advanced Cinematography Lab access Academy admin assign করেন।")); }}><span>04</span>{copy("Advanced lab", "Advanced lab")}{!hasAdvancedLab && <i>ACCESS</i>}</button>
          {snapshot.isAdmin && <button className={view === "admin" ? "is-active" : ""} type="button" onClick={() => setView("admin")}><span>05</span>{copy("Admin studio", "Admin studio")} <i>ADMIN</i></button>}
        </nav>

        {!snapshot.configured && <div className="academy-notice academy-notice--warning" role="status"><strong>{copy("Account services need configuration", "Account service configure করা বাকি")}</strong><p>{copy("Add SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY to your Cloudflare Worker secrets, then apply the Academy SQL migration. Guest lessons still work after the new Worker build is deployed.", "Cloudflare Worker secrets-এ SUPABASE_URL ও SUPABASE_PUBLISHABLE_KEY যোগ করো এবং Academy SQL migration apply করো। নতুন Worker deploy হওয়ার পর guest lesson ব্যবহার করা যাবে।")}</p></div>}
        {apiError && <div className="academy-notice academy-notice--error" role="alert">{apiError}</div>}
        {authNotice && <div className="academy-notice" role="status">{authNotice}<button type="button" onClick={() => setAuthNotice("")} aria-label="Dismiss">×</button></div>}

        <div className="academy-dashboard">
          <div className="academy-stat">
            <span className="academy-eyebrow">{copy("YOUR EXPERIENCE", "তোমার অভিজ্ঞতা")}</span>
            <strong>{xp.toLocaleString()}</strong><small>XP / {rankFor(xp).title[language]}</small>
            <div className="academy-stat__track"><i style={{ width: `${nextRank ? Math.min(100, ((xp - rank.min) / (nextRank.min - rank.min)) * 100) : 100}%` }} /></div>
            <span className="academy-stat__foot">{nextRank ? `${Math.max(0, nextRank.min - xp)} XP ${copy("to next rank", "পরের rank-এর জন্য")}` : copy("Top rank reached", "সর্বোচ্চ rank অর্জিত")}</span>
          </div>
          <div className="academy-stat academy-stat--progress">
            <span className="academy-eyebrow">{copy("LEARNING PROGRESS", "শেখার অগ্রগতি")}</span>
            <div className="academy-stat__progress-row"><ProgressRing completed={progress.length} total={30} /><div><strong>{progress.length}<small> / 30</small></strong><span>{copy("days completed", "দিন সম্পন্ন")}</span><em>{hasProgram ? copy("30-day access active", "৩০ দিনের access চালু") : copy("Days 01–07 open", "দিন ০১–০৭ উন্মুক্ত")}</em></div></div>
          </div>
          <div className="academy-stat academy-stat--rank">
            <span className="academy-eyebrow">{copy("CURRENT RANK", "বর্তমান rank")}</span>
            <strong className="academy-stat__rank-name">{text(language, rank.title)}</strong>
            <small>{copy("Every correct lesson earns XP once.", "প্রতিটি সঠিক lesson-এ একবার XP পাওয়া যায়।")}</small>
            <span className="academy-rank-steps">{academyRanks.map((entry, index) => <i key={entry.min} className={xp >= entry.min ? "is-reached" : ""} title={text(language, entry.title)} />)}</span>
          </div>
        </div>

        {view === "roadmap" && (
          <div className="academy-learning-layout">
            <aside className="academy-roadmap">
              <div className="academy-panel-heading"><div><span className="academy-eyebrow">THE 30-DAY PATH</span><h3>{copy("Learning roadmap", "শেখার roadmap")}</h3></div><span>04 MODULES</span></div>
              <div className="academy-module-list">
                {academyModules.map((module) => (
                  <button type="button" key={module.key} className={moduleFilter === module.key ? "is-active" : ""} onClick={() => setModuleFilter(moduleFilter === module.key ? "all" : module.key)}>
                    <span className="academy-module-list__number">{module.number}</span>
                    <span className="academy-module-list__copy"><strong>{text(language, module.title)}</strong><small>{module.days} · {completedInModule(module.key)}/${module.key === "visual" ? 7 : module.key === "post" ? 9 : 7}</small></span>
                    <i>↗</i>
                  </button>
                ))}
              </div>
              <div className="academy-day-map">
                <div className="academy-panel-heading"><h3>{copy("Daily sessions", "প্রতিদিনের lesson")}</h3><span>{filteredDays.length} DAYS</span></div>
                <div className="academy-day-grid">
                  {filteredDays.map((day) => {
                    const locked = day.day > 7 && !hasProgram;
                    return <button key={day.day} type="button" onClick={() => showDay(day.day)} className={`academy-day-chip ${selectedDay === day.day ? "is-current" : ""} ${completedDays.has(day.day) ? "is-done" : ""} ${locked ? "is-locked" : ""}`} aria-label={`Day ${day.day}${locked ? ", locked" : ""}`}>
                      {String(day.day).padStart(2,"0")}{completedDays.has(day.day) ? <i>✓</i> : locked ? <i>⌑</i> : null}
                    </button>;
                  })}
                </div>
              </div>
              <div className="academy-roadmap__foot"><span>01 / 30</span><span>{copy("A lesson a day. A film at the end.", "প্রতিদিন একটি lesson। শেষে একটি film।")}</span></div>
            </aside>

            <div className="academy-lesson">
              {selectedLocked ? (
                <div className="academy-lock-screen">
                  <div className="academy-lock-screen__symbol">⌑</div>
                  <span className="academy-eyebrow">DAY {String(selectedLesson.day).padStart(2,"0")} / FULL PROGRAMME</span>
                  <h3>{copy("The next chapter is waiting.", "পরের অধ্যায় তোমার অপেক্ষায়।")}</h3>
                  <p>{copy("Days 01–07 are open for everyone. Days 08–30, advanced practice and the complete capstone are released by Academy admin through a learner entitlement.", "দিন ০১–০৭ সবার জন্য উন্মুক্ত। দিন ০৮–৩০, advanced practice এবং সম্পূর্ণ capstone Academy admin learner entitlement-এর মাধ্যমে চালু করেন।")}</p>
                  <div className="academy-lock-screen__list"><span>✓ {copy("Seven open foundation lessons", "সাতটি উন্মুক্ত foundation lesson")}</span><span>⌑ {copy("23 guided programme days", "২৩টি guided programme day")}</span><span>⌑ {copy("Final filmmaking capstone", "Final filmmaking capstone")}</span></div>
                  <button className="academy-outline-button" type="button" onClick={() => setAuthOpen(true)}>{copy("Sign in to check your access", "Access দেখতে sign in করো")} ↗</button>
                  <span className="academy-lock-screen__note">{copy("Programme access is assigned by the verified Academy administrator.", "Programme access verified Academy administrator প্রদান করেন।")}</span>
                </div>
              ) : (
                <>
                  <div className="academy-lesson__topline"><span className="academy-eyebrow">WEEK {String(selectedLesson.week).padStart(2,"0")} / MODULE {academyModules.find((item) => item.key === selectedLesson.module)?.number}</span><span>{selectedCompleted ? "✓ COMPLETED" : `DAY ${String(selectedLesson.day).padStart(2,"0")} / 30`}</span></div>
                  <h3 className="academy-lesson__title">{text(language, selectedLesson.title)}</h3>
                  <p className="academy-lesson__objective"><span>{copy("TODAY'S OBJECTIVE", "আজকের লক্ষ্য")}</span>{text(language, selectedLesson.objective)}</p>
                  <article className="academy-lesson__reading"><span className="academy-eyebrow">{copy("THE PRINCIPLE", "মূল ধারণা")}</span><p>{text(language, selectedLesson.lesson)}</p></article>
                  <article className="academy-exercise"><div className="academy-exercise__icon">↗</div><div><span className="academy-eyebrow">{copy("PRACTICAL CAMERA EXERCISE", "বাস্তব camera exercise")}</span><h4>{copy("Take it out of theory.", "Theory থেকে বাস্তবে যাও।")}</h4><p>{text(language, selectedLesson.exercise)}</p></div></article>
                  <label className="academy-reflection"><span>{copy("YOUR FIELD NOTES / REFLECTION", "তোমার field notes / reflection")}</span><textarea rows={3} maxLength={2000} value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder={copy("What did you notice while testing this idea?", "এই idea পরীক্ষা করার সময় কী লক্ষ্য করেছ?")} disabled={selectedCompleted} /></label>
                  <div className="academy-lesson__recall"><span className="academy-eyebrow">{copy("SPACED RECALL", "মনে রাখার অনুশীলন")}</span><p>{text(language, selectedLesson.reflection)}</p></div>
                  <QuestionCard
                    question={selectedLesson.question}
                    language={language}
                    selected={selectedAnswer}
                    onSelect={(value) => { setSelectedAnswer(value); setAnswerChecked(false); }}
                    checked={answerChecked}
                    onCheck={() => void completeAnswer()}
                    disabled={saving || selectedCompleted}
                  />
                  {selectedCompleted && <div className="academy-feedback is-correct"><strong>{copy("Lesson completed", "Lesson সম্পন্ন")}</strong><p>{copy("Your XP and reflection are saved to your account.", "তোমার XP ও reflection account-এ save হয়েছে।")}</p></div>}
                  {!session && <div className="academy-guest-note">{copy("Guest practice: you can study and check answers. Sign in to save completed days and earn account XP.", "Guest practice: পড়তে ও উত্তর যাচাই করতে পারবে। Completed day save ও account XP earn করতে sign in করো।")} <button type="button" onClick={() => setAuthOpen(true)}>{copy("Join free", "Free account")}</button></div>}
                  {saving && <p className="academy-inline-status" role="status">{copy("Saving your progress…", "Progress save হচ্ছে…")}</p>}
                </>
              )}
            </div>
          </div>
        )}

        {view === "exam" && (
          <section className="academy-exam">
            <div className="academy-section-intro"><span className="academy-eyebrow">ASSESSMENT / 01</span><h3>{copy("The filmmaker's checkpoint.", "Filmmaker-এর checkpoint।")}</h3><p>{copy("Ten mixed questions across visual language, camera, directing and post-production. Try from memory first, then use the explanations to identify what to revisit.", "Visual language, camera, directing ও post-production থেকে দশটি mixed question। আগে স্মৃতি থেকে চেষ্টা করো, তারপর explanation দেখে কোন বিষয় আবার পড়বে ঠিক করো।")}</p></div>
            <div className="academy-exam__meta"><span>10 QUESTIONS</span><span>PASS TARGET / 80%</span><span>{copy("Practice assessment · no XP", "Practice assessment · XP নেই")}</span></div>
            {academyFinalExam.map((question, index) => (
              <div className="academy-exam-question" key={index}>
                <span className="academy-eyebrow">QUESTION {String(index + 1).padStart(2,"0")}</span><h4>{text(language, question.prompt)}</h4>
                <div className="academy-question__options">
                  {question.options.map((option, choice) => <button type="button" key={choice} className={`academy-answer ${examAnswers[index] === choice ? "is-selected" : ""} ${examSubmitted && choice === question.answerIndex ? "is-correct" : ""} ${examSubmitted && examAnswers[index] === choice && choice !== question.answerIndex ? "is-wrong" : ""}`} disabled={examSubmitted} onClick={() => setExamAnswers((current) => ({ ...current, [index]: choice }))}><span>{String.fromCharCode(65 + choice)}</span><strong>{text(language, option)}</strong></button>)}
                </div>
                {examSubmitted && <p className="academy-exam-question__explanation">{text(language, question.explanation)}</p>}
              </div>
            ))}
            {!examSubmitted ? <button className="academy-primary-button" type="button" onClick={submitExam} disabled={Object.keys(examAnswers).length !== academyFinalExam.length}>{copy("Submit examination", "পরীক্ষা জমা দাও")} ↗</button> : <div className="academy-exam-result"><span className="academy-eyebrow">ASSESSMENT RESULT</span><strong>{examScore} / 10</strong><h4>{examScore >= 8 ? copy("Strong understanding.", "ভালো বোঝাপড়া।") : copy("Review and try again.", "আবার revise করে চেষ্টা করো।")}</h4><p>{copy("This is a practice checkpoint. Your score is not represented as a formal qualification or certificate.", "এটি practice checkpoint; score কোনো formal qualification বা certificate হিসেবে গণ্য নয়।")}</p><button type="button" className="academy-outline-button" onClick={() => { setExamAnswers({}); setExamSubmitted(false); }}>{copy("Retake examination", "আবার পরীক্ষা দাও")} ↻</button></div>}
          </section>
        )}

        {view === "arcade" && (
          <section className="academy-arcade">
            <div className="academy-section-intro"><span className="academy-eyebrow">CINE-ARCADE / SKILL PLAY</span><h3>{copy("Train your cinematic instinct.", "তোমার cinematic instinct শাণিত করো।")}</h3><p>{copy("Short decision-making challenges. Play, get immediate feedback, and try to improve your visual judgement.", "ছোট decision-making challenge। খেলো, সঙ্গে সঙ্গে feedback নাও, visual judgement উন্নত করো।")}</p></div>
            {!currentGame ? <div className="academy-game-grid">{academyArcadeGames.map((game) => {
              const locked = Boolean(game.requiredEntitlement === "arcade.pro" && !hasAdvancedArcade);
              return <button key={game.key} type="button" className={`academy-game-card ${locked ? "is-locked" : ""}`} onClick={() => { if (locked) { setAuthNotice(copy("This challenge pack is assigned by Academy admin.", "এই challenge pack Academy admin assign করেন।")); return; } setArcadeGame(game.key); setArcadeIndex(0); setArcadeScore(0); setArcadeAnswer(null); setArcadeChecked(false); }}>
                <span className="academy-game-card__number">{locked ? "⌑" : "0" + (academyArcadeGames.indexOf(game) + 1)}</span><h4>{text(language, game.title)}</h4><p>{text(language, game.description)}</p><span className="academy-game-card__start">{locked ? copy("ADMIN ACCESS", "ADMIN ACCESS") : copy("START CHALLENGE", "চ্যালেঞ্জ শুরু")} ↗</span>
              </button>;
            })}</div> : currentGame && currentArcadeQuestion ? (
              <div className="academy-arcade-play">
                <button type="button" className="academy-text-button" onClick={() => setArcadeGame(null)}>← {copy("All challenges", "সব challenge")}</button>
                <div className="academy-exam__meta"><span>{text(language, currentGame.title)}</span><span>ROUND {arcadeIndex + 1} / {currentGame.questions.length}</span><span>SCORE {arcadeScore}</span></div>
                <QuestionCard question={currentArcadeQuestion} language={language} selected={arcadeAnswer} checked={arcadeChecked} onSelect={(value) => { setArcadeAnswer(value); setArcadeChecked(false); }} onCheck={() => { if (arcadeAnswer === null) return; setArcadeChecked(true); if (arcadeAnswer === currentArcadeQuestion.answerIndex) setArcadeScore((score) => score + 1); }} />
                {arcadeChecked && <button type="button" className="academy-primary-button" onClick={() => {
                  if (arcadeIndex + 1 >= currentGame.questions.length) { setArcadeGame(null); setAuthNotice(copy(`Challenge complete · score ${arcadeScore}. Replay to improve.`, "Challenge সম্পন্ন। উন্নতি করতে আবার খেলো।")); }
                  else { setArcadeIndex((index) => index + 1); setArcadeAnswer(null); setArcadeChecked(false); }
                }}>{arcadeIndex + 1 >= currentGame.questions.length ? copy("Finish challenge", "Challenge শেষ") : copy("Next round", "পরের round")} ↗</button>}
              </div>
            ) : <p>{copy("Challenge complete. Choose another challenge to continue.", "Challenge শেষ। চালিয়ে যেতে অন্য challenge বেছে নাও।")} <button type="button" onClick={() => setArcadeGame(null)}>{copy("Back to games", "Games-এ ফেরত")}</button></p>}
          </section>
        )}

        {view === "advanced" && hasAdvancedLab && <AdvancedLab language={language} />}

        {view === "admin" && snapshot.isAdmin && (
          <section className="academy-admin">
            <div className="academy-section-intro"><span className="academy-eyebrow">ADMIN ONLY / VERIFIED OWNER</span><h3>{copy("Learner access studio.", "Learner access studio।")}</h3><p>{copy("Grant or revoke Academy entitlements for verified learner accounts. Changes are checked again by a protected database function.", "Verified learner account-এ Academy entitlement grant বা revoke করো। পরিবর্তন protected database function-এ আবার যাচাই করা হয়।")}</p></div>
            <form className="academy-admin__grant" onSubmit={grantEntitlement}>
              <label><span>{copy("Learner account", "Learner account")}</span><select value={selectedStudent} onChange={(event) => setSelectedStudent(event.target.value)} required><option value="">{copy("Choose a learner", "Learner বেছে নাও")}</option>{(snapshot.students ?? []).map((student) => <option value={student.user_id} key={student.user_id}>{student.display_name} — {student.email}</option>)}</select></label>
              <label><span>{copy("Entitlement", "Entitlement")}</span><select value={grantKey} onChange={(event) => setGrantKey(event.target.value)}>{academyEntitlements.map((entry) => <option key={entry.key} value={entry.key}>{text(language, entry.title)}</option>)}</select></label>
              <label><span>{copy("Duration", "সময়কাল")}</span><select value={grantDays} onChange={(event) => setGrantDays(event.target.value)}><option value="7">7 days</option><option value="30">30 days</option><option value="90">90 days</option><option value="365">365 days</option><option value="permanent">{copy("Permanent", "স্থায়ী")}</option></select></label>
              <label className="academy-admin__note"><span>{copy("Admin note (optional)", "Admin note (ঐচ্ছিক)")}</span><input value={grantNote} maxLength={300} onChange={(event) => setGrantNote(event.target.value)} placeholder="e.g. Cohort / scholarship / invitation" /></label>
              <button className="academy-primary-button" type="submit" disabled={!selectedStudent || adminBusy}>{adminBusy ? "…" : copy("Grant access", "Access grant করো")} ↗</button>
            </form>
            <div className="academy-admin__directory"><div className="academy-panel-heading"><h3>{copy("Learner directory", "Learner directory")}</h3><span>{snapshot.students?.length ?? 0} ACCOUNTS</span></div>
              {(snapshot.students ?? []).map((student) => {
                const keys = (snapshot.studentEntitlements ?? []).filter((entry) => entry.user_id === student.user_id && (!entry.expires_at || Date.parse(entry.expires_at) > Date.now()));
                return <article className="academy-admin__student" key={student.user_id}><div><strong>{student.display_name}</strong><span>{student.email}</span></div><div className="academy-admin__badges">{keys.map((entry) => <span key={entry.entitlement_key}>{entry.entitlement_key}<button type="button" disabled={adminBusy} onClick={() => void revokeEntitlement(student.user_id, entry.entitlement_key)} aria-label={`Revoke ${entry.entitlement_key} from ${student.email}`}>×</button></span>)}{!keys.length && <small>{copy("No active access", "কোনো active access নেই")}</small>}</div></article>;
              })}
            </div>
            <p className="academy-admin__security">{copy("Security: only the verified owner identity can grant/revoke. Learner-side client code cannot write XP, completion rows or entitlements directly.", "Security: শুধু verified owner grant/revoke করতে পারেন। Learner-side client code সরাসরি XP, completion row বা entitlement লিখতে পারে না।")}</p>
          </section>
        )}

        <footer className="academy-footer"><span>ZH / ZEE FILMMAKING ACADEMY</span><span>{copy("Learn by observing. Improve by making.", "দেখে শেখো। তৈরি করে উন্নতি করো।")}</span><span>GAZIPUR · BANGLADESH</span></footer>
        {booting && <div className="academy-booting" role="status">{copy("Preparing your learning space…", "Learning space প্রস্তুত হচ্ছে…")}</div>}
      </div>
      {authOpen && <AuthPanel language={language} onClose={() => setAuthOpen(false)} onSession={activateSession} />}
    </section>
  );
}
