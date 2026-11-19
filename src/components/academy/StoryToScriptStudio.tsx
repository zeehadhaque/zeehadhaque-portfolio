import React, { useMemo, useState } from "react";

interface StoryToScriptStudioProps {
  language?: "en" | "bn";
  onEarnXP?: (xp: number, reason: string) => void;
}

type PipelineStage = 1 | 2 | 3 | 4 | 5;

interface ScriptBlock {
  id: string;
  type: "slugline" | "action" | "character" | "parenthetical" | "dialogue" | "transition";
  text: string;
}

const STAGES = [
  {
    id: 1 as PipelineStage,
    code: "01",
    en: "Idea Spark",
    bn: "আইডিয়া",
    ruleEn: "An Idea is a raw 'What if?' question. Don't worry about plot yet — find one haunting image, contradiction, or fear.",
    ruleBn: "আইডিয়া হলো একটি কাঁচা 'যদি এমন হতো?' প্রশ্ন। শুরুতেই পুরো গল্প না ভেবে একটি তীব্র দৃশ্য বা দ্বন্দ্ব খুঁজুন।",
    formulaEn: "Formula: What if [ordinary person] discovers [disturbing truth] in [confined space]?",
    formulaBn: "সূত্র: যদি [সাধারণ মানুষ] একটি [আবদ্ধ জায়গায়] হঠাৎ [অদ্ভুত সত্য] আবিষ্কার করে?",
  },
  {
    id: 2 as PipelineStage,
    code: "02",
    en: "Concept & Logline",
    bn: "কনসেপ্ট ও লগলাইন",
    ruleEn: "Concept turns an idea into dramatic stakes. A Logline summarizes your entire film in ONE killer sentence (25–35 words).",
    ruleBn: "কনসেপ্ট আইডিয়াকে নাটকীয় সংকটে রূপ দেয়। লগলাইন হলো মাত্র ১ বাক্যে (২৫–৩৫ শব্দে) পুরো সিনেমার সারমর্ম।",
    formulaEn: "Formula: When [INCITING INCIDENT], a [FLAWED PROTAGONIST] must [URGENT GOAL] before [DEADLY STAKES].",
    formulaBn: "সূত্র: যখন [মূল ঘটনা ঘটে], তখন [ত্রুটিপূর্ণ নায়ক]-কে [লক্ষ্য] অর্জন করতে হয়, নাহলে [বড় ক্ষতি] ঘটবে।",
  },
  {
    id: 3 as PipelineStage,
    code: "03",
    en: "3-Act Story",
    bn: "৩-অ্যাক্ট স্টোরি",
    ruleEn: "Story is emotional change. Act I sets up the normal world & breaks it; Act II escalates obstacles until all seems lost; Act III delivers the climax & transformation.",
    ruleBn: "গল্প মানেই চরিত্রের পরিবর্তন। অ্যাক্ট ১: স্বাভাবিক জগৎ ও সংকটের শুরু; অ্যাক্ট ২: বাধার পর বাধা ও চরম পতন; অ্যাক্ট ৩: ক্লাইম্যাক্স ও সমাধান।",
    formulaEn: "Ratio: Act I (25%) · Act II (50% — Midpoint Twist) · Act III (25% — Climax & Resolution)",
    formulaBn: "অনুপাত: অ্যাক্ট ১ (২৫%) · অ্যাক্ট ২ (৫০% — মিডপয়েন্ট টুইস্ট) · অ্যাক্ট ৩ (২৫% — ক্লাইম্যাক্স)",
  },
  {
    id: 4 as PipelineStage,
    code: "04",
    en: "Screenplay Grammar",
    bn: "স্ক্রিনপ্লে গ্রামার",
    ruleEn: "Screenplays are blueprints for the camera — NEVER write thoughts ('He feels sad'). Write only what the camera can SEE and the mic can HEAR, in present tense.",
    ruleBn: "স্ক্রিনপ্লে হলো ক্যামেরার ব্লুপ্রিন্ট — কখনো মনের ভাব ('সে দুঃখ পেল') লিখবেন না। ক্যামেরা যা দেখবে আর মাইক যা শুনবে, শুধু তাই বর্তমান কালে লিখুন।",
    formulaEn: "Golden Rule: 1 Script Page (Courier 12pt) ≈ 1 Minute of Screen Time. Show, Don't Tell.",
    formulaBn: "গোল্ডেন রুল: প্রোপার স্ক্রিপ্টের ১ পৃষ্ঠা ≈ ১ মিনিট সিনেমা। বলবেন না, দৃশ্য দিয়ে দেখান।",
  },
  {
    id: 5 as PipelineStage,
    code: "05",
    en: "Proper Script Lab",
    bn: "প্রোপার স্ক্রিপ্ট ল্যাব",
    ruleEn: "Build an industry-standard scene below. Every scene starts with a Slugline (INT./EXT. LOCATION - TIME), followed by visual Action, ALL-CAPS Character, and crisp Dialogue.",
    ruleBn: "নিচে ইন্ডাস্ট্রি-স্ট্যান্ডার্ড স্ক্রিপ্ট লিখুন। প্রতিটি দৃশ্য শুরু হয় স্লাগলাইন (INT./EXT. স্থান - সময়) দিয়ে, তারপর অ্যাকশন, চরিত্রের নাম ও সংলাপ।",
    formulaEn: "Format: SLUGLINE -> VISUAL ACTION -> CHARACTER -> (parenthetical) -> DIALOGUE -> TRANSITION",
    formulaBn: "ফরম্যাট: স্লাগলাইন -> ভিজ্যুয়াল অ্যাকশন -> চরিত্র -> (নির্দেশনা) -> সংলাপ -> ট্রানজিশন",
  },
];

const INITIAL_BLOCKS: ScriptBlock[] = [
  { id: "b1", type: "slugline", text: "INT. ABANDONED CORRIDOR - NIGHT" },
  {
    id: "b2",
    type: "action",
    text: "Rain taps against a cracked glass ventilator. A single sodium bulb flickers over wet concrete. ARIF (22), drenched, freezes as a shadow stretches from an empty doorway.",
  },
  { id: "b3", type: "character", text: "ARIF" },
  { id: "b4", type: "parenthetical", text: "(barely a whisper)" },
  { id: "b5", type: "dialogue", text: "We locked this floor ten minutes ago." },
  {
    id: "b6",
    type: "action",
    text: "Silence. Then a slow metallic scrape echoes from behind him. Arif's phone screen lights up: 03:03 AM — same minute as five minutes ago.",
  },
  { id: "b7", type: "transition", text: "CUT TO BLACK." },
];

export const StoryToScriptStudio: React.FC<StoryToScriptStudioProps> = ({
  language = "en",
  onEarnXP,
}) => {
  const isBn = language === "bn";
  const [stage, setStage] = useState<PipelineStage>(1);
  const [rewardedStages, setRewardedStages] = useState<number[]>([]);

  // Stages 1–4 Workbook State
  const [ideaText, setIdeaText] = useState(
    "What if a late-night editor notices his own reflection moving 2 seconds late inside the footage he is cutting?"
  );
  const [logline, setLogline] = useState({
    incident: "a nocturnal film editor spots his future self inside raw footage",
    protagonist: "an insomniac student filmmaker",
    goal: "trace the missing reel before dawn",
    stakes: "he gets trapped permanently inside the time loop",
  });
  const [acts, setActs] = useState({
    act1: "Arif edits alone in a silent room at 2 AM. The monitor replays a hallway shot he never filmed.",
    act2: "He walks into the real corridor to disprove it. Every door loops back to the editing bay; the footage starts predicting his next breath.",
    act3: "Instead of cutting away, Arif turns off the monitor and confronts the shadow in the dark — breaking the loop at 03:04 AM.",
  });

  // Stage 5 Live Script Builder State
  const [scriptTitle, setScriptTitle] = useState("THE MISSING FRAME");
  const [blocks, setBlocks] = useState<ScriptBlock[]>(INITIAL_BLOCKS);
  const [newType, setNewType] = useState<ScriptBlock["type"]>("action");
  const [newText, setNewText] = useState("");
  const [copied, setCopied] = useState(false);

  const currentStage = STAGES.find((s) => s.id === stage) ?? STAGES[0];

  const generatedLogline = useMemo(
    () =>
      `When ${logline.incident}, ${logline.protagonist} must ${logline.goal} before ${logline.stakes}.`,
    [logline]
  );

  const claimStageXP = (s: PipelineStage) => {
    if (!rewardedStages.includes(s)) {
      setRewardedStages((prev) => [...prev, s]);
      onEarnXP?.(25, `Completed Script Pipeline Stage 0${s}`);
    }
  };

  const handleAddBlock = () => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    const formatted =
      newType === "slugline" || newType === "character" || newType === "transition"
        ? trimmed.toUpperCase()
        : trimmed;
    setBlocks((prev) => [...prev, { id: `b-${Date.now()}`, type: newType, text: formatted }]);
    setNewText("");
    claimStageXP(5);
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const exportPlainScript = () => {
    const lines: string[] = [
      `TITLE: ${scriptTitle.toUpperCase()}`,
      `LOGLINE: ${generatedLogline}`,
      `==================================================`,
      "",
    ];
    blocks.forEach((b) => {
      if (b.type === "slugline") lines.push(`\n${b.text.toUpperCase()}\n`);
      else if (b.type === "action") lines.push(`${b.text}\n`);
      else if (b.type === "character") lines.push(`                    ${b.text.toUpperCase()}`);
      else if (b.type === "parenthetical") lines.push(`               ${b.text}`);
      else if (b.type === "dialogue") lines.push(`          ${b.text}\n`);
      else if (b.type === "transition") lines.push(`                                        ${b.text.toUpperCase()}\n`);
    });
    return lines.join("\n");
  };

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(exportPlainScript());
      setCopied(true);
      claimStageXP(5);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback silent
    }
  };

  const handleDownloadFountain = () => {
    const blob = new Blob([exportPlainScript()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${scriptTitle.toLowerCase().replace(/\s+/g, "-") || "script"}.fountain.txt`;
    a.click();
    URL.revokeObjectURL(url);
    claimStageXP(5);
  };

  return (
    <div className="script-studio">
      {/* 5-Stage Pipeline Stepper */}
      <div className="script-stepper" role="tablist" aria-label="Story to Script Pipeline">
        {STAGES.map((s) => (
          <button
            key={s.id}
            type="button"
            className="script-step-btn"
            data-active={stage === s.id}
            data-done={rewardedStages.includes(s.id)}
            onClick={() => setStage(s.id)}
          >
            <span className="script-step-num">{s.code}</span>
            <span className="script-step-label">{isBn ? s.bn : s.en}</span>
          </button>
        ))}
      </div>

      {/* Director's Golden Rule Banner */}
      <div className="script-rule-card">
        <div className="script-rule-kicker">
          {isBn ? `ধাপ ${currentStage.code} // ডিরেক্টরস ফর্মুলা` : `STAGE ${currentStage.code} // DIRECTOR'S FORMULA`}
        </div>
        <p className="script-rule-text">{isBn ? currentStage.ruleBn : currentStage.ruleEn}</p>
        <div className="script-formula-pill">
          {isBn ? currentStage.formulaBn : currentStage.formulaEn}
        </div>
      </div>

      {/* STAGE 01: IDEA SPARK */}
      {stage === 1 && (
        <div className="script-work-panel">
          <label className="script-field-label">
            {isBn ? "তোমার 'What If' আইডিয়া লেখো:" : "Write your raw 'What If?' film idea:"}
          </label>
          <textarea
            className="script-textarea"
            rows={4}
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
          />
          <div className="script-action-row">
            <button
              type="button"
              className="studio-cta-btn"
              onClick={() => {
                claimStageXP(1);
                setStage(2);
              }}
            >
              {isBn ? "আইডিয়া লক করো ও কনসেপ্টে যাও (+25 XP) →" : "Lock Idea & Build Logline (+25 XP) →"}
            </button>
          </div>
        </div>
      )}

      {/* STAGE 02: CONCEPT & LOGLINE */}
      {stage === 2 && (
        <div className="script-work-panel">
          <div className="script-two-col">
            <label className="script-field">
              <span className="script-field-label">1. Inciting Incident (মূল ঘটনা)</span>
              <input
                className="script-input"
                value={logline.incident}
                onChange={(e) => setLogline({ ...logline, incident: e.target.value })}
              />
            </label>
            <label className="script-field">
              <span className="script-field-label">2. Flawed Protagonist (নায়ক)</span>
              <input
                className="script-input"
                value={logline.protagonist}
                onChange={(e) => setLogline({ ...logline, protagonist: e.target.value })}
              />
            </label>
            <label className="script-field">
              <span className="script-field-label">3. Urgent Goal (লক্ষ্য)</span>
              <input
                className="script-input"
                value={logline.goal}
                onChange={(e) => setLogline({ ...logline, goal: e.target.value })}
              />
            </label>
            <label className="script-field">
              <span className="script-field-label">4. Deadly Stakes (না পারলে ক্ষতি)</span>
              <input
                className="script-input"
                value={logline.stakes}
                onChange={(e) => setLogline({ ...logline, stakes: e.target.value })}
              />
            </label>
          </div>

          <div className="script-logline-preview">
            <span className="script-rule-kicker">LIVE INDUSTRY LOGLINE</span>
            <p>“{generatedLogline}”</p>
          </div>

          <div className="script-action-row">
            <button
              type="button"
              className="studio-cta-btn"
              onClick={() => {
                claimStageXP(2);
                setStage(3);
              }}
            >
              {isBn ? "লগলাইন সেভ করে ৩-অ্যাক্ট স্টোরিতে যাও (+25 XP) →" : "Build 3-Act Story (+25 XP) →"}
            </button>
          </div>
        </div>
      )}

      {/* STAGE 03: 3-ACT STORY ARCHITECTURE */}
      {stage === 3 && (
        <div className="script-work-panel">
          <div className="script-acts-grid">
            <div className="script-act-card" data-act="1">
              <span className="script-act-tag">ACT I · SETUP (25%)</span>
              <textarea
                className="script-textarea"
                rows={4}
                value={acts.act1}
                onChange={(e) => setActs({ ...acts, act1: e.target.value })}
              />
            </div>
            <div className="script-act-card" data-act="2">
              <span className="script-act-tag">ACT II · CONFRONTATION (50%)</span>
              <textarea
                className="script-textarea"
                rows={4}
                value={acts.act2}
                onChange={(e) => setActs({ ...acts, act2: e.target.value })}
              />
            </div>
            <div className="script-act-card" data-act="3">
              <span className="script-act-tag">ACT III · CLIMAX & RESOLUTION (25%)</span>
              <textarea
                className="script-textarea"
                rows={4}
                value={acts.act3}
                onChange={(e) => setActs({ ...acts, act3: e.target.value })}
              />
            </div>
          </div>

          <div className="script-action-row">
            <button
              type="button"
              className="studio-cta-btn"
              onClick={() => {
                claimStageXP(3);
                setStage(4);
              }}
            >
              {isBn ? "স্টোরি লক করে স্ক্রিনপ্লে গ্রামারে যাও (+25 XP) →" : "Master Screenplay Grammar (+25 XP) →"}
            </button>
          </div>
        </div>
      )}

      {/* STAGE 04: SCREENPLAY GRAMMAR (AMATEUR VS PRO) */}
      {stage === 4 && (
        <div className="script-work-panel">
          <div className="script-compare-grid">
            <div className="script-compare-card script-compare--bad">
              <span className="script-compare-badge">✕ AMATEUR (UNFILMABLE)</span>
              <p>
                “Arif walks into the room and feels deeply terrified because he remembers his
                brother disappeared three years ago.”
              </p>
              <small>
                {isBn
                  ? "সমস্যা: ক্যামেরা কারো 'ভয়' বা '৩ বছর আগের স্মৃতি' দেখতে পায় না।"
                  : "Why it fails: A camera cannot photograph memories or invisible feelings."}
              </small>
            </div>

            <div className="script-compare-card script-compare--good">
              <span className="script-compare-badge">✓ PRO SCREENPLAY (VISUAL)</span>
              <p>
                “ARIF stops at the threshold. His fingers tighten on a rusted keychain — a child's
                name scratched into the brass. His breath fogs the cold air.”
              </p>
              <small>
                {isBn
                  ? "কেন প্রো: প্রতিটি শব্দ ক্যামেরার শট ও সাউন্ড ডিজাইন বলে দিচ্ছে।"
                  : "Why it works: Every single word translates directly into a camera shot and sound cue."}
              </small>
            </div>
          </div>

          <div className="script-anatomy-pills">
            <span><strong>SLUGLINE:</strong> INT. / EXT. + LOCATION + DAY/NIGHT</span>
            <span><strong>ACTION:</strong> Present tense, max 3–4 lines per block</span>
            <span><strong>CHARACTER:</strong> ALL CAPS above dialogue</span>
            <span><strong>1 PAGE:</strong> ≈ 1 minute of cinema runtime</span>
          </div>

          <div className="script-action-row">
            <button
              type="button"
              className="studio-cta-btn"
              onClick={() => {
                claimStageXP(4);
                setStage(5);
              }}
            >
              {isBn ? "এবার প্রোপার স্ক্রিপ্ট ল্যাবে লেখো (+25 XP) →" : "Open Live Proper Script Lab (+25 XP) →"}
            </button>
          </div>
        </div>
      )}

      {/* STAGE 05: LIVE PROPER SCRIPT FORMATTER & EXPORTER */}
      {stage === 5 && (
        <div className="script-builder-layout">
          {/* Left: Scene Element Controls */}
          <div className="script-controls-col">
            <label className="script-field">
              <span className="script-field-label">SCRIPT TITLE</span>
              <input
                className="script-input"
                value={scriptTitle}
                onChange={(e) => setScriptTitle(e.target.value)}
              />
            </label>

            <div className="script-type-selector">
              {(
                [
                  ["slugline", "Slugline"],
                  ["action", "Action"],
                  ["character", "Character"],
                  ["parenthetical", "(Note)"],
                  ["dialogue", "Dialogue"],
                  ["transition", "Transition"],
                ] as Array<[ScriptBlock["type"], string]>
              ).map(([t, label]) => (
                <button
                  key={t}
                  type="button"
                  className="vf-pill-btn"
                  data-active={newType === t}
                  onClick={() => setNewType(t)}
                >
                  {label}
                </button>
              ))}
            </div>

            <textarea
              className="script-textarea"
              rows={3}
              placeholder={
                newType === "slugline"
                  ? "INT. ROOFTOP STAIRWELL - NIGHT"
                  : newType === "character"
                  ? "ARIF"
                  : newType === "parenthetical"
                  ? "(turning slowly)"
                  : newType === "transition"
                  ? "SMASH CUT TO:"
                  : "Write crisp visual action or spoken dialogue..."
              }
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />

            <button type="button" className="studio-cta-btn" onClick={handleAddBlock}>
              + {isBn ? "স্ক্রিপ্টে যোগ করো" : "Add Line to Script"}
            </button>

            <div className="script-export-row">
              <button type="button" className="vf-pill-btn" onClick={handleCopyScript}>
                {copied ? "Copied ✓" : "Copy Script"}
              </button>
              <button type="button" className="vf-pill-btn" onClick={handleDownloadFountain}>
                Export .fountain.txt ↓
              </button>
            </div>
          </div>

          {/* Right: Industry-Standard Formatted Screenplay Page */}
          <div className="script-page-sheet" aria-label="Formatted Screenplay Preview">
            <div className="script-page-header">
              <span>{scriptTitle.toUpperCase()}</span>
              <span>PAGE 1 · ~{(blocks.length * 0.14).toFixed(1)} MIN</span>
            </div>

            <div className="script-page-body">
              {blocks.map((b) => (
                <div key={b.id} className={`sp-line sp-line--${b.type}`}>
                  <span>{b.text}</span>
                  <button
                    type="button"
                    className="sp-remove-btn"
                    title="Remove line"
                    onClick={() => removeBlock(b.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
