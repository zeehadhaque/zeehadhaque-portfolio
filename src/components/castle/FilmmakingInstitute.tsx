import { useState } from "react";
import {
  GraduationCap,
  Award,
  BookOpen,
  Gamepad2,
  Globe,
  ChevronRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  PenTool,
} from "lucide-react";
import {
  academyDays,
  academyModules,
  academyRanks,
  type AcademyLanguage,
  type AcademyDay,
} from "../../data/academy";
import { DirectorsViewfinderLab } from "../academy/DirectorsViewfinderLab";
import { StoryToScriptStudio } from "../academy/StoryToScriptStudio";
import { CineArcadePro } from "../academy/CineArcadePro";
import "../../styles/academy-pro.css";
import "../../styles/cinema-studio-addons.css";

const getActBadge = (day: number, isBn: boolean) => {
  if (day <= 7) return { label: isBn ? "অ্যাক্ট ১ · ভিজ্যুয়াল ল্যাঙ্গুয়েজ" : "ACT I · VISUAL LANGUAGE", color: "#7dbbff", act: 1 };
  if (day <= 14) return { label: isBn ? "অ্যাক্ট ২ · ক্যামেরা ও লাইট" : "ACT II · CAMERA & LIGHT", color: "#f2c97d", act: 2 };
  if (day <= 21) return { label: isBn ? "অ্যাক্ট ৩ · স্টোরি ও ডিরেকশন" : "ACT III · STORY & DIRECTION", color: "#c09bff", act: 3 };
  return { label: isBn ? "অ্যাক্ট ৪ · এডিটিং ও সাউন্ড" : "ACT IV · EDITING & SOUND", color: "#6ee7b7", act: 4 };
};

export function FilmmakingInstitute() {
  const [lang, setLang] = useState<AcademyLanguage>("en");
  const [selectedDay, setSelectedDay] = useState<AcademyDay>(academyDays[0]);
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"curriculum" | "script" | "arcade" | "ranks">("curriculum");

  // Quiz & Mastery state
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [xp, setXp] = useState<number>(350);
  const [completedDays, setCompletedDays] = useState<Set<number>>(() => new Set([1]));
  const [practicalDone, setPracticalDone] = useState<boolean>(false);

  const isBn = lang === "bn";

  const filteredDays = academyDays.filter((day) => {
    if (selectedModule === "all") return true;
    return day.module === selectedModule;
  });

  const handleDaySelect = (day: AcademyDay) => {
    setSelectedDay(day);
    setUserAnswer(null);
    setIsSubmitted(false);
    setPracticalDone(false);
  };

  const handleAnswerSubmit = () => {
    if (userAnswer === null) return;
    setIsSubmitted(true);
    if (userAnswer === selectedDay.question.answerIndex) {
      setXp((prev) => prev + (selectedDay.xp || 50));
      setCompletedDays((prev) => new Set([...prev, selectedDay.day]));
    }
  };

  const currentRank =
    [...academyRanks].reverse().find((r) => xp >= r.min) || academyRanks[0];

  const currentAct = getActBadge(selectedDay.day, isBn);
  const progressPercent = Math.min(100, Math.round((completedDays.size / 30) * 100));

  return (
    <section id="institute" className="academy-studio castle-section institute-section">
      {/* Studio Command Header */}
      <div className="academy-studio-header">
        <div style={{ flex: 1, minWidth: "260px" }}>
          <div className="academy-kicker">
            <GraduationCap size={14} />
            <span>ZEE FILMMAKING INSTITUTE // ZERO TO PRO MASTERCLASS</span>
          </div>
          <h2 className="academy-title">
            {isBn ? "ডিরেক্টরস কনজারভেটরি ও স্ক্রিপ্ট স্টুডিও" : "The 30-Day Auteur Conservatory"}
          </h2>
          <p className="academy-subtitle">
            {isBn
              ? "আইডিয়া থেকে কনসেপ্ট, ৩-অ্যাক্ট স্টোরি, স্ক্রিনপ্লে ফরম্যাট ও ক্যামেরা ক্রাফট—সবকিছু এক প্ল্যাটফর্মে মাস্টার করো।"
              : "Master visual grammar, camera psychology, story architecture, and industry-standard screenwriting from zero to pro."}
          </p>
        </div>

        {/* Language Switch & Live Telemetry */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
          <div className="academy-segmented" role="group" aria-label="Language">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`academy-seg-btn ${lang === "en" ? "active" : ""}`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang("bn")}
              className={`academy-seg-btn ${lang === "bn" ? "active" : ""}`}
            >
              বাংলা
            </button>
          </div>

          <div className="academy-rank-badge font-mono">
            <Award size={14} style={{ color: "#f2c97d" }} />
            <span>RANK: {currentRank.title[lang]} · {xp} XP</span>
          </div>
        </div>
      </div>

      {/* Mastery Progress Bar */}
      <div className="academy-mastery-bar">
        <span style={{ fontSize: "12px", fontFamily: "var(--ac-mono)", color: "var(--ac-gold)" }}>
          {isBn ? "জিরো-টু-প্রো অগ্রগতি" : "ZERO-TO-PRO MASTERY"}: {completedDays.size} / 30 {isBn ? "দিন সম্পন্ন" : "Days Completed"} ({progressPercent}%)
        </span>
        <div className="academy-progress-track">
          <div className="academy-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* 4 Studio Tabs */}
      <div className="academy-tabs-row">
        <div className="academy-segmented" role="tablist">
          <button
            type="button"
            onClick={() => setActiveTab("curriculum")}
            className={`academy-seg-btn ${activeTab === "curriculum" ? "active" : ""}`}
          >
            <BookOpen size={13} style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }} />
            <span>{isBn ? "৩০ দিনের সিলেবাস" : "30-Day Curriculum"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("script")}
            className={`academy-seg-btn ${activeTab === "script" ? "active" : ""}`}
          >
            <PenTool size={13} style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }} />
            <span>{isBn ? "স্ক্রিপ্ট স্টুডিও" : "Script Studio"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("arcade")}
            className={`academy-seg-btn ${activeTab === "arcade" ? "active" : ""}`}
          >
            <Gamepad2 size={13} style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }} />
            <span>{isBn ? "সিনে-আর্কেড প্রো" : "Cine-Arcade Pro"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ranks")}
            className={`academy-seg-btn ${activeTab === "ranks" ? "active" : ""}`}
          >
            <Award size={13} style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }} />
            <span>{isBn ? "অট্যুর হায়ারার্কি" : "Auteur Hierarchy"}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 30-DAY CURRICULUM */}
      {activeTab === "curriculum" && (
        <div className="academy-workspace">
          {/* Left: 30-Day Syllabus Rail */}
          <div className="academy-day-rail" aria-label="Curriculum Days">
            {/* Module Filter Pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
              <button
                type="button"
                onClick={() => setSelectedModule("all")}
                className={`vf-pill-btn ${selectedModule === "all" ? "active" : ""}`}
                data-active={selectedModule === "all"}
              >
                All (30)
              </button>
              {academyModules.map((m) => (
                <button
                  type="button"
                  key={m.key}
                  onClick={() => setSelectedModule(m.key)}
                  className={`vf-pill-btn ${selectedModule === m.key ? "active" : ""}`}
                  data-active={selectedModule === m.key}
                >
                  {m.title[lang]}
                </button>
              ))}
            </div>

            {filteredDays.map((d) => {
              const isCurrent = d.day === selectedDay.day;
              const isDone = completedDays.has(d.day);
              const actInfo = getActBadge(d.day, isBn);
              const isMemory = [7, 14, 21, 28].includes(d.day);
              const isCapstone = [29, 30].includes(d.day);

              return (
                <button
                  type="button"
                  key={d.day}
                  onClick={() => handleDaySelect(d)}
                  className={`academy-day-card ${isCurrent ? "active" : ""}`}
                  data-active={isCurrent}
                  data-act={actInfo.act}
                >
                  <div className="academy-day-meta">
                    <span>
                      DAY {String(d.day).padStart(2, "0")} {isDone ? "✓" : ""}
                    </span>
                    {isMemory ? (
                      <span style={{ color: "var(--ac-gold)", fontWeight: 700 }}>★ MEMORY LAB</span>
                    ) : isCapstone ? (
                      <span style={{ color: "#6ee7b7", fontWeight: 700 }}>◆ CAPSTONE</span>
                    ) : (
                      <span>ACT 0{actInfo.act}</span>
                    )}
                  </div>
                  <div className="academy-day-name">{d.title[lang]}</div>
                  <div className="academy-day-goal">{d.objective[lang]}</div>
                </button>
              );
            })}
          </div>

          {/* Right: Main Cinema Lesson Stage */}
          <div className="academy-lesson-stage">
            <div className="academy-lesson-head">
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <span className="academy-lesson-day-pill">
                  DAY {String(selectedDay.day).padStart(2, "0")} OF 30
                </span>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "10px",
                    fontFamily: "var(--ac-mono)",
                    background: "rgba(242, 201, 125, 0.14)",
                    border: "1px solid rgba(242, 201, 125, 0.35)",
                    color: currentAct.color,
                  }}
                >
                  {currentAct.label}
                </span>
                {completedDays.has(selectedDay.day) && (
                  <span style={{ color: "#6ee7b7", fontSize: "11px", fontFamily: "var(--ac-mono)" }}>
                    ✓ COMPLETED
                  </span>
                )}
              </div>
              <h3 className="academy-lesson-title">{selectedDay.title[lang]}</h3>
              <p className="academy-lesson-objective">{selectedDay.objective[lang]}</p>
            </div>

            {/* Interactive Director's Viewfinder Lab */}
            <DirectorsViewfinderLab dayNumber={selectedDay.day} language={lang} />

            {/* 1. LESSON DIRECTIVE */}
            <div className="academy-block academy-block--directive">
              <span className="academy-block-label">
                <BookOpen size={13} style={{ display: "inline-block", marginRight: "6px", verticalAlign: "middle" }} />
                {isBn ? "পাঠ নির্দেশনা // LESSON DIRECTIVE" : "LESSON DIRECTIVE // PRINCIPLE"}
              </span>
              <p style={{ lineHeight: 1.8 }}>{selectedDay.lesson[lang]}</p>
            </div>

            {/* 2. PRACTICAL EXERCISE */}
            <div className="academy-block academy-block--exercise">
              <span className="academy-block-label">
                {isBn ? "ব্যবহারিক অন-সেট মিশন // PRACTICAL EXERCISE" : "ON-SET MISSION // PRACTICAL EXERCISE"}
              </span>
              <p style={{ lineHeight: 1.8, marginBottom: "14px" }}>{selectedDay.exercise[lang]}</p>

              <label style={{ display: "inline-flex", alignItems: "center", gap: "10px", cursor: "pointer", fontFamily: "var(--ac-mono)", fontSize: "12px", color: practicalDone ? "#6ee7b7" : "var(--ac-muted)" }}>
                <input
                  type="checkbox"
                  checked={practicalDone}
                  onChange={(e) => setPracticalDone(e.target.checked)}
                  style={{ accentColor: "#6ee7b7", width: "16px", height: "16px" }}
                />
                <span>{practicalDone ? (isBn ? "মিশন শট সম্পন্ন হয়েছে ✓" : "Shot Completed on Camera ✓") : (isBn ? "ক্যামেরা শট সম্পন্ন হলে টিক দাও" : "Mark Shot Completed")}</span>
              </label>
            </div>

            {/* 3. DIRECTOR'S REFLECTION */}
            <div className="academy-block academy-block--reflection">
              <span className="academy-block-label">
                {isBn ? "পরিচালকের ভাবনা // DIRECTOR'S REFLECTION" : "DIRECTOR'S REFLECTION"}
              </span>
              <p className="academy-reflection-quote">
                &ldquo;{selectedDay.reflection[lang]}&rdquo;
              </p>
            </div>

            {/* 4. COMPREHENSION CHECK (+XP) */}
            <div className="academy-quiz-box">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="script-rule-kicker">
                  <HelpCircle size={13} style={{ display: "inline-block", marginRight: "6px", verticalAlign: "middle" }} />
                  {isBn ? `মূল্যায়ন প্রশ্ন (+${selectedDay.xp} XP)` : `COMPREHENSION CHECK (+${selectedDay.xp} XP)`}
                </span>
                <span className="font-mono" style={{ fontSize: "11px", color: "var(--ac-gold)" }}>01 / 01</span>
              </div>

              <h4 className="academy-quiz-question">{selectedDay.question.prompt[lang]}</h4>

              <div className="academy-quiz-options">
                {selectedDay.question.options.map((opt, oIndex) => {
                  const isSelected = userAnswer === oIndex;
                  const isCorrect = isSubmitted && oIndex === selectedDay.question.answerIndex;
                  const isWrong = isSubmitted && isSelected && !isCorrect;

                  return (
                    <button
                      type="button"
                      key={opt[lang]}
                      onClick={() => !isSubmitted && setUserAnswer(oIndex)}
                      className={`academy-quiz-option ${isSelected ? "selected" : ""}`}
                      data-selected={isSelected}
                      data-correct={isSubmitted ? isCorrect : undefined}
                    >
                      <span className="academy-quiz-letter font-mono">
                        {String.fromCharCode(65 + oIndex)}
                      </span>
                      <span style={{ flex: 1 }}>{opt[lang]}</span>
                      {isCorrect && <span style={{ color: "#6ee7b7", fontWeight: 700 }}>✓</span>}
                      {isWrong && <span style={{ color: "#ff4d6d", fontWeight: 700 }}>✕</span>}
                    </button>
                  );
                })}
              </div>

              {!isSubmitted ? (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={handleAnswerSubmit}
                    disabled={userAnswer === null}
                    className="studio-cta-btn"
                  >
                    {isBn ? "উত্তর যাচাই করো (+XP) ↗" : "Verify Answer (+XP) ↗"}
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "14px",
                    background:
                      userAnswer === selectedDay.question.answerIndex
                        ? "rgba(110, 231, 183, 0.12)"
                        : "rgba(255, 77, 109, 0.12)",
                    border: `1px solid ${
                      userAnswer === selectedDay.question.answerIndex
                        ? "rgba(110, 231, 183, 0.4)"
                        : "rgba(255, 77, 109, 0.4)"
                    }`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    {userAnswer === selectedDay.question.answerIndex ? (
                      <>
                        <CheckCircle2 size={16} style={{ color: "#6ee7b7" }} />
                        <strong style={{ color: "#6ee7b7" }}>
                          {isBn ? `সঠিক উত্তর! +${selectedDay.xp} XP অর্জিত!` : `Correct! +${selectedDay.xp} XP Awarded!`}
                        </strong>
                      </>
                    ) : (
                      <>
                        <XCircle size={16} style={{ color: "#ff4d6d" }} />
                        <strong style={{ color: "#ff4d6d" }}>
                          {isBn ? "উত্তরটি সঠিক হয়নি।" : "Incorrect formulation."}
                        </strong>
                      </>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.6, color: "var(--ac-muted)" }}>
                    {selectedDay.question.explanation[lang]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCRIPT STUDIO */}
      {activeTab === "script" && (
        <StoryToScriptStudio
          language={lang}
          onEarnXP={(earned) => setXp((prev) => prev + earned)}
        />
      )}

      {/* TAB 3: CINE-ARCADE */}
      {activeTab === "arcade" && (
        <CineArcadePro
          language={lang}
          onEarnXP={(earned) => setXp((prev) => prev + earned)}
        />
      )}

      {/* TAB 4: AUTEUR HIERARCHY */}
      {activeTab === "ranks" && (
        <div className="ranks-container">
          <div className="ranks-grid">
            {academyRanks.map((r, rIdx) => {
              const unlocked = xp >= r.min;
              return (
                <div key={r.title.en} className={`rank-card ${unlocked ? "unlocked" : "locked"}`}>
                  <div className="rank-level-tag font-mono">LEVEL 0{rIdx + 1}</div>
                  <h4 className="rank-name">{r.title[lang]}</h4>
                  <div className="rank-xp-req font-mono">{r.min} XP REQUIRED</div>
                  <div className="rank-status font-mono">
                    {unlocked ? "✓ UNLOCKED" : "LOCKED"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
