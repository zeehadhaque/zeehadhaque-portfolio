import React, { useEffect, useRef, useState } from "react";

interface CineArcadeProProps {
  language?: "en" | "bn";
  onEarnXP?: (xp: number, reason: string) => void;
}

type ArcadeGameId = "frame" | "script" | "cut" | "light";

const FRAME_CHALLENGES = [
  {
    prompt: "You want the audience to feel a character is trapped, lonely, and watched by an unseen threat in a dark hallway.",
    promptBn: "অন্ধকার করিডোরে একজন চরিত্র একা ও অদৃশ্য বিপদের নজরদারিতে আছে—এই অনুভূতি দিতে কোন শট নেবেন?",
    options: [
      { label: "Extreme Wide Shot + Heavy Negative Space", correct: true, why: "Vast empty space around a small figure triggers instant vulnerability and paranoia." },
      { label: "Bright Eye-Level Medium Shot (Centered)", correct: false, why: "Centered eye-level feels neutral and safe — not ominous." },
      { label: "Fast Whip-Pan Selfie Close-Up", correct: false, why: "Whip-pans feel energetic/chaotic rather than eerie stillness." },
    ],
  },
  {
    prompt: "A villain enters the room. You need the audience to instantly feel their dominance without a single line of dialogue.",
    promptBn: "একটি সংলাপ ছাড়াই ভিলেনের আধিপত্য ও ভয় দেখাতে ক্যামেরার অ্যাঙ্গেল কেমন হবে?",
    options: [
      { label: "High Angle looking down from the ceiling", correct: false, why: "High angles make a subject look smaller and weaker." },
      { label: "Low Angle (24mm) looking up + Hard Side Key Light", correct: true, why: "Low-angle wide lenses loom over the viewer, amplifying authority and threat." },
      { label: "Soft Flat Over-the-Shoulder Shot", correct: false, why: "Flat lighting removes dramatic shadow and menace." },
    ],
  },
  {
    prompt: "Two estranged friends sit at a table. One hides a secret in their hand below the frame.",
    promptBn: "দুজন বন্ধুর মধ্যে একজন টেবিলের নিচে গোপন কিছু লুকিয়ে রেখেছে—সাসপেন্স তৈরি করবেন কীভাবে?",
    options: [
      { label: "Insert Close-Up on the hidden object -> Slow Push-In on the other's clueless face", correct: true, why: "Hitchcockian dramatic irony: showing the audience what the other character doesn't know builds unbearable tension." },
      { label: "Wide Static Master Shot for 2 minutes", correct: false, why: "The audience never sees the secret, so there is no suspense." },
      { label: "Random Drone Aerial Shot outside the building", correct: false, why: "Breaks intimacy and emotional focus." },
    ],
  },
];

const SCRIPT_CHALLENGES = [
  {
    prompt: "Which Slugline (Scene Heading) follows proper Hollywood screenplay formatting?",
    options: [
      { label: "Scene 4: Inside the dark hospital hallway at night.", correct: false, why: "Too conversational; standard scripts never write 'Inside' or full sentences in headings." },
      { label: "INT. HOSPITAL CORRIDOR - NIGHT", correct: true, why: "Exact industry format: INT./EXT. + SPECIFIC LOCATION + TIME OF DAY in ALL CAPS." },
      { label: "int. hospital corridor (night time)", correct: false, why: "Sluglines must be uppercase with a hyphen separating location and time." },
    ],
  },
  {
    prompt: "Pick the genuinely FILMABLE action line (Show, Don't Tell):",
    options: [
      { label: "Rafi feels betrayed because he trusted Nadia since college.", correct: false, why: "Unfilmable backstory — the camera cannot see college memories." },
      { label: "RAFI stares at the torn photograph. His jaw tightens. He drops his wedding ring onto the wet asphalt.", correct: true, why: "100% visual, present-tense, and immediately shootable by any cinematographer." },
      { label: "Rafi was walking slowly and had been thinking about leaving.", correct: false, why: "Never use past tense ('was walking') in a screenplay." },
    ],
  },
  {
    prompt: "A character speaks on the phone from another room (we DO NOT see them on screen). Which tag goes next to their name?",
    options: [
      { label: "ARIF (V.O.)", correct: true, why: "(V.O.) = Voice Over (phone call, narration, recording not physically present in the scene)." },
      { label: "ARIF (O.S.)", correct: false, why: "(O.S.) = Off-Screen — physically inside the same room/location, just outside the camera frame." },
      { label: "ARIF (CUT)", correct: false, why: "CUT is an editing transition, not a dialogue extension." },
    ],
  },
];

const LIGHT_CHALLENGES = [
  {
    brief: "SCENE BRIEF: 'AUTOPSY' — Sterile cold morgue at 3 AM. Unsettling clinical dread.",
    targetKelvin: [5800, 7200],
    targetContrast: [65, 92],
    hint: "Cold bluish daylight/fluorescent (6000K+) with heavy shadow contrast (70%+).",
  },
  {
    brief: "SCENE BRIEF: 'শেষ বিকেল' — Warm sunset nostalgia between old friends on a rooftop.",
    targetKelvin: [2900, 4000],
    targetContrast: [25, 55],
    hint: "Warm golden tungsten light (3000K–3800K) with soft, gentle contrast (30%–50%).",
  },
];

export const CineArcadePro: React.FC<CineArcadeProProps> = ({ language = "en", onEarnXP }) => {
  const isBn = language === "bn";
  const [activeGame, setActiveGame] = useState<ArcadeGameId>("frame");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Frame & Script Quiz State
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  // Game 3: Real-Time Cut on Action State
  const [cursorPos, setCursorPos] = useState(0);
  const [cutPlaying, setCutPlaying] = useState(true);
  const [cutResult, setCutResult] = useState<string | null>(null);
  const dirRef = useRef(1);
  const posRef = useRef(10);

  // Game 4: Mood & Light Matcher State
  const [lightIdx, setLightIdx] = useState(0);
  const [kelvin, setKelvin] = useState(5000);
  const [contrast, setContrast] = useState(50);
  const [lightMsg, setLightMsg] = useState<string | null>(null);

  // Real-time timeline loop for "Cut on Action" game
  useEffect(() => {
    if (activeGame !== "cut" || !cutPlaying) return;
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      posRef.current += dirRef.current * dt * 88;
      if (posRef.current >= 98) {
        posRef.current = 98;
        dirRef.current = -1;
      } else if (posRef.current <= 2) {
        posRef.current = 2;
        dirRef.current = 1;
      }
      setCursorPos(posRef.current);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [activeGame, cutPlaying]);

  const switchGame = (id: ArcadeGameId) => {
    setActiveGame(id);
    setQIndex(0);
    setFeedback(null);
    setCutResult(null);
    setCutPlaying(true);
    setLightMsg(null);
  };

  const handleChoice = (correct: boolean, why: string, total: number) => {
    if (feedback) return;
    if (correct) {
      const bonus = 25 + streak * 5;
      setScore((s) => s + bonus);
      setStreak((st) => st + 1);
      onEarnXP?.(bonus, `Cine-Arcade (${activeGame})`);
      setFeedback({ ok: true, text: `✓ SPOT ON (+${bonus} XP) — ${why}` });
    } else {
      setStreak(0);
      setFeedback({ ok: false, text: `✕ MISSED — ${why}` });
    }
    setTimeout(() => {
      setFeedback(null);
      setQIndex((i) => (i + 1) % total);
    }, 2400);
  };

  const handleCutStrike = () => {
    if (!cutPlaying) {
      setCutResult(null);
      setCutPlaying(true);
      return;
    }
    setCutPlaying(false);
    // Sweet spot: 45% to 59% (exact impact moment of door slam / hand grab)
    const p = posRef.current;
    if (p >= 45 && p <= 59) {
      const xp = 35;
      setScore((s) => s + xp);
      setStreak((st) => st + 1);
      onEarnXP?.(xp, "Perfect Match-on-Action Cut");
      setCutResult(`✓ INVISIBLE MATCH CUT! (+${xp} XP) — You cut right on the kinetic apex (${p.toFixed(0)}%).`);
    } else if (p >= 36 && p <= 68) {
      setScore((s) => s + 10);
      onEarnXP?.(10, "Close Match Cut");
      setCutResult(`~ SLIGHTLY EARLY/LATE (+10 XP) — Cut inside the glowing gold impact zone (45%–59%).`);
    } else {
      setStreak(0);
      setCutResult(`✕ JARRING JUMP CUT — Wait until the motion hits the gold impact apex!`);
    }
  };

  const handleVerifyLight = () => {
    const ch = LIGHT_CHALLENGES[lightIdx];
    const okK = kelvin >= ch.targetKelvin[0] && kelvin <= ch.targetKelvin[1];
    const okC = contrast >= ch.targetContrast[0] && contrast <= ch.targetContrast[1];
    if (okK && okC) {
      setScore((s) => s + 30);
      setStreak((st) => st + 1);
      onEarnXP?.(30, "Cinema Lighting Match");
      setLightMsg("✓ CINEMA-GRADE LIGHTING LOCKED (+30 XP)! Moving to next scene...");
      setTimeout(() => {
        setLightMsg(null);
        setLightIdx((i) => (i + 1) % LIGHT_CHALLENGES.length);
      }, 2000);
    } else {
      setStreak(0);
      setLightMsg(`Not quite — Hint: ${ch.hint}`);
    }
  };

  const activeList = activeGame === "frame" ? FRAME_CHALLENGES : SCRIPT_CHALLENGES;
  const activeQ = activeList[qIndex % activeList.length];
  const currentLight = LIGHT_CHALLENGES[lightIdx];

  // Warm/Cool lighting tint computation for Game 4
  const warmRatio = Math.max(0, Math.min(1, (5600 - kelvin) / 2800));
  const coolRatio = Math.max(0, Math.min(1, (kelvin - 4800) / 2700));
  const lightColor =
    warmRatio > coolRatio
      ? `rgba(242, 184, 110, ${(0.3 + warmRatio * 0.4).toFixed(2)})`
      : `rgba(125, 187, 255, ${(0.3 + coolRatio * 0.4).toFixed(2)})`;
  const shadowOpacity = 0.2 + (contrast / 100) * 0.75;

  return (
    <div className="arcade-pro">
      {/* Arcade Scoreboard HUD */}
      <div className="arcade-hud-bar">
        <div className="arcade-game-tabs">
          {(
            [
              ["frame", isBn ? "১. ফ্রেম ও শট" : "01. Frame Decoder"],
              ["script", isBn ? "২. স্ক্রিপ্ট ডক্টর" : "02. Script Doctor"],
              ["cut", isBn ? "৩. কাট অন অ্যাকশন" : "03. Cut on Action"],
              ["light", isBn ? "৪. লাইট ও মুড" : "04. Mood & Light"],
            ] as Array<[ArcadeGameId, string]>
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className="academy-seg-btn"
              data-active={activeGame === id}
              onClick={() => switchGame(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="arcade-stats">
          <span className="arcade-stat-pill">SCORE: {score}</span>
          <span className="arcade-stat-pill arcade-stat-pill--gold">STREAK: {streak}🔥</span>
        </div>
      </div>

      {/* GAMES 1 & 2: FRAME DECODER & SCRIPT DOCTOR */}
      {(activeGame === "frame" || activeGame === "script") && (
        <div className="arcade-stage-card">
          <span className="script-rule-kicker">
            {activeGame === "frame" ? "DIRECTOR'S EYE CHALLENGE" : "PROPER SCREENPLAY CHALLENGE"} · Q
            {qIndex + 1}/{activeList.length}
          </span>
          <h3 className="arcade-question">
            {activeGame === "frame" && isBn && "promptBn" in activeQ
              ? (activeQ as (typeof FRAME_CHALLENGES)[number]).promptBn
              : activeQ.prompt}
          </h3>

          <div className="arcade-options-stack">
            {activeQ.options.map((opt, idx) => (
              <button
                key={opt.label}
                type="button"
                className="academy-quiz-option"
                data-correct={feedback ? opt.correct : undefined}
                onClick={() => handleChoice(opt.correct, opt.why, activeList.length)}
              >
                <span className="academy-quiz-letter">{String.fromCharCode(65 + idx)}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`arcade-feedback ${feedback.ok ? "arcade-feedback--ok" : "arcade-feedback--bad"}`}>
              {feedback.text}
            </div>
          )}
        </div>
      )}

      {/* GAME 3: REAL-TIME CUT ON ACTION TIMELINE */}
      {activeGame === "cut" && (
        <div className="arcade-stage-card">
          <span className="script-rule-kicker">EDITING RHYTHM LAB · MATCH ON ACTION</span>
          <h3 className="arcade-question">
            {isBn
              ? "চরিত্রটি দরজা ধাক্কা দেওয়ার ঠিক চরম গতিতে (গোল্ড ইমপ্যাক্ট জোন) CUT বাটনে ক্লিক করুন!"
              : "Hit CUT at the exact kinetic apex (Gold Impact Zone) to execute an invisible Match-on-Action cut!"}
          </h3>

          <div className="cut-timeline-wrap">
            <div className="cut-timeline-track">
              {/* Gold Apex Zone */}
              <div
                className="cut-gold-zone"
                style={{ left: "45%", width: "14%" }}
                title="Kinetic Impact Apex Zone (45%–59%)"
              >
                <span>APEX</span>
              </div>
              {/* Moving Playhead */}
              <div
                className="cut-playhead"
                style={{ left: `${cursorPos.toFixed(1)}%` }}
              />
            </div>
          </div>

          <div className="cut-action-row">
            <button
              type="button"
              className="cut-strike-btn"
              onClick={handleCutStrike}
            >
              {cutPlaying ? "✂ CUT!" : "↺ TRY AGAIN"}
            </button>
          </div>

          {cutResult && (
            <div
              className={`arcade-feedback ${
                cutResult.startsWith("✓")
                  ? "arcade-feedback--ok"
                  : cutResult.startsWith("~")
                  ? "arcade-feedback--warn"
                  : "arcade-feedback--bad"
              }`}
            >
              {cutResult}
            </div>
          )}
        </div>
      )}

      {/* GAME 4: MOOD & LIGHT DIRECTOR */}
      {activeGame === "light" && (
        <div className="arcade-stage-card">
          <span className="script-rule-kicker">CINEMATOGRAPHY CHALLENGE · SCENE {lightIdx + 1}/{LIGHT_CHALLENGES.length}</span>
          <h3 className="arcade-question">{currentLight.brief}</h3>

          {/* Real-time scene preview */}
          <div className="light-preview-monitor">
            <div
              className="light-preview-canvas"
              style={{
                background: `radial-gradient(circle at 60% 40%, ${lightColor}, transparent 65%), linear-gradient(180deg, #0d1b2e 0%, #03060c 100%)`,
              }}
            >
              <div
                className="light-preview-shadow"
                style={{
                  background: `linear-gradient(90deg, rgba(2,3,5,${shadowOpacity.toFixed(2)}) 0%, transparent 60%)`,
                }}
              />
              <div className="light-preview-hud">
                <span>{kelvin}K</span>
                <span>CONTRAST {contrast}%</span>
              </div>
            </div>
          </div>

          <div className="light-sliders-grid">
            <label className="vf-slider-item">
              <span className="vf-slider-label">
                Color Temperature <strong>{kelvin}K</strong>
              </span>
              <input
                type="range"
                min={2800}
                max={7500}
                step={50}
                value={kelvin}
                onChange={(e) => setKelvin(Number(e.target.value))}
              />
            </label>

            <label className="vf-slider-item">
              <span className="vf-slider-label">
                Negative Fill / Contrast <strong>{contrast}%</strong>
              </span>
              <input
                type="range"
                min={10}
                max={95}
                step={1}
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
              />
            </label>
          </div>

          <div className="cut-action-row">
            <button
              type="button"
              className="studio-cta-btn"
              onClick={handleVerifyLight}
            >
              {isBn ? "লাইটিং চেক করো (+30 XP)" : "Verify Lighting Setup (+30 XP)"}
            </button>
          </div>

          {lightMsg && (
            <div
              className={`arcade-feedback ${
                lightMsg.startsWith("✓") ? "arcade-feedback--ok" : "arcade-feedback--bad"
              }`}
            >
              {lightMsg}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
