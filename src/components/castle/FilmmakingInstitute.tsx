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
} from "lucide-react";
import {
  academyDays,
  academyModules,
  academyRanks,
  academyArcadeGames,
  type AcademyLanguage,
  type AcademyDay,
} from "../../data/academy";

export function FilmmakingInstitute() {
  const [lang, setLang] = useState<AcademyLanguage>("en");
  const [selectedDay, setSelectedDay] = useState<AcademyDay>(academyDays[0]);
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"curriculum" | "arcade" | "ranks">("curriculum");

  // Quiz state
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [xp, setXp] = useState<number>(350);

  // Arcade state
  const [arcadeScore, setArcadeScore] = useState<number>(0);
  const [arcadeAnswered, setArcadeAnswered] = useState<boolean>(false);

  const filteredDays = academyDays.filter((day) => {
    if (selectedModule === "all") return true;
    return day.module === selectedModule;
  });

  const handleDaySelect = (day: AcademyDay) => {
    setSelectedDay(day);
    setUserAnswer(null);
    setIsSubmitted(false);
  };

  const handleAnswerSubmit = () => {
    if (userAnswer === null) return;
    setIsSubmitted(true);
    if (userAnswer === selectedDay.question.answerIndex) {
      setXp((prev) => prev + (selectedDay.xp || 50));
    }
  };

  const currentRank =
    [...academyRanks].reverse().find((r) => xp >= r.min) || academyRanks[0];

  const firstArcadeGame = academyArcadeGames[0];
  const firstArcadeQuestion = firstArcadeGame.questions[0];

  return (
    <section id="institute" className="castle-section institute-section">
      <div className="section-header-block">
        <div className="section-pill cyan-pill">
          <GraduationCap size={13} />
          <span>CHAMBER 05 // ZEE FILMMAKING INSTITUTE</span>
        </div>
        <h2 className="section-title">The 30-Day Auteur Curriculum</h2>
        <p className="section-subtitle">
          An intensive, practical filmmaking syllabus authored by Zeehad Haque. Master visual
          grammar, mobile cinematography, dramatic blocking, and psychoacoustic editing.
        </p>

        {/* Top Control Bar: Language Switch & Status */}
        <div className="institute-control-bar">
          <div className="language-toggle-group">
            <Globe size={14} className="globe-icon" />
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`lang-btn ${lang === "en" ? "active" : ""}`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang("bn")}
              className={`lang-btn ${lang === "bn" ? "active" : ""}`}
            >
              বাংলা
            </button>
          </div>

          {/* XP & Rank Telemetry */}
          <div className="xp-telemetry-badge">
            <Award size={14} className="gold-icon" />
            <span className="font-mono">
              RANK: {currentRank.title[lang]} · {xp} XP
            </span>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="institute-view-tabs">
          <button
            type="button"
            onClick={() => setActiveTab("curriculum")}
            className={`tab-btn ${activeTab === "curriculum" ? "active" : ""}`}
          >
            <BookOpen size={14} />
            <span>30-Day Curriculum</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("arcade")}
            className={`tab-btn ${activeTab === "arcade" ? "active" : ""}`}
          >
            <Gamepad2 size={14} />
            <span>Cine-Arcade</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ranks")}
            className={`tab-btn ${activeTab === "ranks" ? "active" : ""}`}
          >
            <Award size={14} />
            <span>Auteur Hierarchy</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 30-DAY CURRICULUM */}
      {activeTab === "curriculum" && (
        <div className="curriculum-container">
          {/* Module Filter Pills */}
          <div className="module-filter-bar">
            <button
              type="button"
              onClick={() => setSelectedModule("all")}
              className={`mod-pill ${selectedModule === "all" ? "active" : ""}`}
            >
              All Days (30)
            </button>
            {academyModules.map((m) => (
              <button
                type="button"
                key={m.key}
                onClick={() => setSelectedModule(m.key)}
                className={`mod-pill ${selectedModule === m.key ? "active" : ""}`}
              >
                {m.title[lang]}
              </button>
            ))}
          </div>

          <div className="curriculum-dual-layout">
            {/* Left: Scrollable Days Roster */}
            <div className="days-roster-column">
              <div className="days-roster-scroll">
                {filteredDays.map((d) => {
                  const isCurrent = d.day === selectedDay.day;
                  return (
                    <button
                      type="button"
                      key={d.day}
                      onClick={() => handleDaySelect(d)}
                      className={`day-row-card ${isCurrent ? "selected" : ""}`}
                    >
                      <span className="day-number font-mono">
                        DAY {String(d.day).padStart(2, "0")}
                      </span>
                      <div className="day-info-text">
                        <h4 className="day-card-title">{d.title[lang]}</h4>
                        <span className="day-focus-pill">{d.objective[lang]}</span>
                      </div>
                      <ChevronRight size={16} className="day-chevron" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Active Day Study Console */}
            <div className="active-day-console">
              <div className="console-card">
                <div className="console-header">
                  <div className="console-badges">
                    <span className="badge-day font-mono">
                      DAY {String(selectedDay.day).padStart(2, "0")} OF 30
                    </span>
                    <span className="badge-focus">{selectedDay.objective[lang]}</span>
                  </div>
                  <h3 className="console-day-title">{selectedDay.title[lang]}</h3>
                </div>

                {/* Lesson Core Text */}
                <div className="console-section">
                  <h4 className="section-label font-mono">
                    <BookOpen size={13} />
                    <span>{lang === "en" ? "LESSON DIRECTIVE" : "পাঠ নির্দেশনা"}</span>
                  </h4>
                  <p className="lesson-body-text">{selectedDay.lesson[lang]}</p>
                </div>

                {/* Practical Exercise */}
                <div className="console-section exercise-box">
                  <h4 className="section-label font-mono">
                    <span>{lang === "en" ? "PRACTICAL EXERCISE" : "ব্যবহারিক অনুশীলন"}</span>
                  </h4>
                  <p className="exercise-text">{selectedDay.exercise[lang]}</p>
                </div>

                {/* Director's Reflection */}
                <div className="console-section reflection-box">
                  <h4 className="section-label font-mono">
                    <span>{lang === "en" ? "DIRECTOR'S REFLECTION" : "পরিচালকের ভাবনা"}</span>
                  </h4>
                  <p className="reflection-text">&ldquo;{selectedDay.reflection[lang]}&rdquo;</p>
                </div>

                {/* Interactive Question & Evaluation */}
                <div className="console-section quiz-box">
                  <h4 className="section-label font-mono">
                    <HelpCircle size={13} />
                    <span>{lang === "en" ? `COMPREHENSION CHECK (+${selectedDay.xp} XP)` : `মূল্যায়ন প্রশ্ন (+${selectedDay.xp} XP)`}</span>
                  </h4>
                  <p className="quiz-prompt">{selectedDay.question.prompt[lang]}</p>

                  <div className="quiz-options-grid">
                    {selectedDay.question.options.map((opt, oIndex) => {
                      let btnClass = "quiz-option-btn";
                      if (isSubmitted) {
                        if (oIndex === selectedDay.question.answerIndex) {
                          btnClass += " correct";
                        } else if (userAnswer === oIndex) {
                          btnClass += " incorrect";
                        }
                      } else if (userAnswer === oIndex) {
                        btnClass += " selected";
                      }

                      return (
                        <button
                          type="button"
                          key={opt[lang]}
                          onClick={() => !isSubmitted && setUserAnswer(oIndex)}
                          className={btnClass}
                        >
                          <span className="opt-letter font-mono">
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                          <span className="opt-text">{opt[lang]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {!isSubmitted ? (
                    <button
                      type="button"
                      onClick={handleAnswerSubmit}
                      disabled={userAnswer === null}
                      className="quiz-submit-btn"
                    >
                      {lang === "en" ? "Verify Answer" : "উত্তর নিশ্চিত করুন"}
                    </button>
                  ) : (
                    <div className="quiz-feedback-box">
                      {userAnswer === selectedDay.question.answerIndex ? (
                        <div className="feedback-result success">
                          <CheckCircle2 size={16} />
                          <span>{lang === "en" ? `Correct! +${selectedDay.xp} XP Awarded.` : `সঠিক উত্তর! +${selectedDay.xp} XP যোগ হয়েছে।`}</span>
                        </div>
                      ) : (
                        <div className="feedback-result error">
                          <XCircle size={16} />
                          <span>{lang === "en" ? "Incorrect formulation." : "উত্তরটি সঠিক নয়।"}</span>
                        </div>
                      )}
                      <p className="explanation-text font-mono">
                        {selectedDay.question.explanation[lang]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CINE-ARCADE */}
      {activeTab === "arcade" && (
        <div className="arcade-container">
          <div className="arcade-card">
            <div className="arcade-header">
              <Gamepad2 size={24} className="arcade-icon" />
              <div>
                <h3 className="arcade-title">
                  {firstArcadeGame.title[lang]}
                </h3>
                <p className="arcade-desc font-mono">
                  {firstArcadeGame.description[lang]}
                </p>
              </div>
              <div className="arcade-score-badge font-mono">
                SCORE: {arcadeScore} PTS
              </div>
            </div>

            <div className="arcade-challenge-box">
              <p className="challenge-prompt">
                {firstArcadeQuestion.prompt[lang]}
              </p>

              <div className="arcade-options">
                {firstArcadeQuestion.options.map((opt, i) => (
                  <button
                    type="button"
                    key={opt[lang]}
                    onClick={() => {
                      setArcadeAnswered(true);
                      if (i === firstArcadeQuestion.answerIndex) {
                        setArcadeScore((prev) => prev + 100);
                      }
                    }}
                    className={`arcade-btn ${
                      arcadeAnswered
                        ? i === firstArcadeQuestion.answerIndex
                          ? "correct"
                          : "incorrect"
                        : ""
                    }`}
                  >
                    <span>{opt[lang]}</span>
                  </button>
                ))}
              </div>

              {arcadeAnswered && (
                <p className="arcade-explanation font-mono">
                  {firstArcadeQuestion.explanation[lang]}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUTEUR HIERARCHY */}
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
