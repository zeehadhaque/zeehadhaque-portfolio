import React, { useEffect, useState } from "react";

interface DirectorsViewfinderLabProps {
  dayNumber: number;
  language?: "en" | "bn";
}

type AspectMode = "2.39:1" | "16:9" | "9:16";
type GridMode = "thirds" | "center" | "golden" | "off";

const getActMeta = (day: number, isBn: boolean) => {
  if (day <= 7) {
    return {
      act: isBn ? "অ্যাক্ট ১ · ভিজ্যুয়াল ল্যাঙ্গুয়েজ" : "ACT I · VISUAL LANGUAGE",
      tip: isBn
        ? "সাবজেক্ট ডানে/বামে সরিয়ে নেগেটিভ স্পেস ও রুল অফ থার্ডস পরীক্ষা করুন।"
        : "Slide the subject off-centre to feel how negative space builds psychological tension.",
      defaultX: 34,
      defaultLens: 35,
      defaultContrast: 62,
      defaultKelvin: 4600,
    };
  }
  if (day <= 14) {
    return {
      act: isBn ? "অ্যাক্ট ২ · ক্যামেরা ও লাইটিং" : "ACT II · CAMERA & LIGHT",
      tip: isBn
        ? "ফোকাল লেন্থ, কন্ট্রাস্ট (নেগেটিভ ফিল) ও কালার টেম্পারেচার (K) বদলে মুড দেখুন।"
        : "Adjust focal length, shadow contrast (negative fill), and Kelvin temperature to shape mood.",
      defaultX: 50,
      defaultLens: 50,
      defaultContrast: 78,
      defaultKelvin: 3600,
    };
  }
  if (day <= 21) {
    return {
      act: isBn ? "অ্যাক্ট ৩ · স্টোরি ও ডিরেকশন" : "ACT III · STORY & DIRECTION",
      tip: isBn
        ? "ফোরগ্রাউন্ড, মিডলগ্রাউন্ড ও ব্যাকগ্রাউন্ডের গভীরতা ও সাবজেক্ট ব্লকিং দেখুন।"
        : "Explore foreground/background depth staging and spatial distance between viewer and subject.",
      defaultX: 66,
      defaultLens: 85,
      defaultContrast: 72,
      defaultKelvin: 5400,
    };
  }
  return {
    act: isBn ? "অ্যাক্ট ৪ · এডিটিং, সাউন্ড ও গ্রেডিং" : "ACT IV · EDITING, SOUND & GRADE",
    tip: isBn
      ? "অ্যাসপেক্ট রেশিও (2.39:1 সিনেমা বনাম 9:16 মোবাইল) ও কালার গ্রেড তুলনা করুন।"
      : "Compare CinemaScope 2.39:1 vs Mobile 9:16 framing and test cinematic colour grading.",
    defaultX: 50,
    defaultLens: 35,
    defaultContrast: 82,
    defaultKelvin: 4200,
  };
};

export const DirectorsViewfinderLab: React.FC<DirectorsViewfinderLabProps> = ({
  dayNumber,
  language = "en",
}) => {
  const isBn = language === "bn";
  const preset = getActMeta(dayNumber, isBn);

  const [aspect, setAspect] = useState<AspectMode>("2.39:1");
  const [grid, setGrid] = useState<GridMode>("thirds");
  const [subjectX, setSubjectX] = useState<number>(preset.defaultX);
  const [lensMm, setLensMm] = useState<number>(preset.defaultLens);
  const [contrast, setContrast] = useState<number>(preset.defaultContrast);
  const [kelvin, setKelvin] = useState<number>(preset.defaultKelvin);

  useEffect(() => {
    const next = getActMeta(dayNumber, isBn);
    setSubjectX(next.defaultX);
    setLensMm(next.defaultLens);
    setContrast(next.defaultContrast);
    setKelvin(next.defaultKelvin);
  }, [dayNumber, isBn]);

  // Convert Kelvin (2800K warm tungsten -> 7500K cold moonlight) into atmospheric tint
  const warmRatio = Math.max(0, Math.min(1, (5600 - kelvin) / 2800));
  const coolRatio = Math.max(0, Math.min(1, (kelvin - 4800) / 2700));
  const lightHue =
    warmRatio > coolRatio
      ? `rgba(242, 184, 110, ${(0.22 + warmRatio * 0.28).toFixed(2)})`
      : `rgba(125, 187, 255, ${(0.22 + coolRatio * 0.34).toFixed(2)})`;

  // Simulate focal length compression (24mm wide -> 85mm telephoto close-up)
  const subjectScale = 0.72 + ((lensMm - 24) / 61) * 0.68;
  const bgBlur = ((lensMm - 24) / 61) * 4.5;
  const shadowOpacity = 0.25 + (contrast / 100) * 0.65;

  const framingLabel =
    subjectX < 40
      ? isBn
        ? "বাম থার্ড · ডানে নেগেটিভ স্পেস"
        : "LEFT THIRD · NEGATIVE SPACE RIGHT"
      : subjectX > 60
      ? isBn
        ? "ডান থার্ড · বামে নেগেটিভ স্পেস"
        : "RIGHT THIRD · NEGATIVE SPACE LEFT"
      : isBn
      ? "সেন্টার সিমেট্রি"
      : "CENTER SYMMETRY";

  return (
    <div className="vf-lab-card">
      <div className="vf-lab-header">
        <div>
          <span className="vf-lab-badge">
            <span className="vf-rec-dot" />
            {isBn ? "লাইভ ডিরেক্টরস ভিউফাইন্ডার" : "INTERACTIVE DIRECTOR'S VIEWFINDER"}
          </span>
          <span className="vf-lab-act">{preset.act}</span>
        </div>

        <div className="vf-pill-group" role="group" aria-label="Aspect Ratio">
          {(["2.39:1", "16:9", "9:16"] as AspectMode[]).map((ratio) => (
            <button
              key={ratio}
              type="button"
              className="vf-pill-btn"
              data-active={aspect === ratio}
              onClick={() => setAspect(ratio)}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      {/* Live Cinema Monitor Screen */}
      <div className="vf-stage-wrap">
        <div className={`vf-monitor vf-monitor--${aspect.replace(":", "-").replace(".", "")}`}>
          {/* Atmospheric Background Layer (Depth & Lighting) */}
          <div
            className="vf-bg-layer"
            style={{
              filter: `blur(${bgBlur.toFixed(1)}px)`,
              background: `
                radial-gradient(circle at ${subjectX}% 38%, ${lightHue}, transparent 58%),
                linear-gradient(180deg, #091426 0%, #03060c 68%, #020305 100%)
              `,
            }}
          >
            {/* Architectural Corridor Depth Lines */}
            <div className="vf-corridor-lines" />
          </div>

          {/* Negative Fill / Contrast Shadow Side */}
          <div
            className="vf-contrast-mask"
            style={{
              background: `linear-gradient(90deg, rgba(2,3,5,${shadowOpacity.toFixed(2)}) 0%, transparent 55%, rgba(2,3,5,${(
                shadowOpacity * 0.85
              ).toFixed(2)}) 100%)`,
            }}
          />

          {/* Framed Subject Silhouette */}
          <div
            className="vf-subject"
            style={{
              left: `${subjectX}%`,
              transform: `translate(-50%, 0) scale(${subjectScale.toFixed(2)})`,
            }}
          >
            <div
              className="vf-subject-rim"
              style={{ boxShadow: `0 0 28px ${lightHue}, inset 2px 0 8px ${lightHue}` }}
            />
            <div className="vf-subject-head" />
            <div className="vf-subject-shoulders" />
          </div>

          {/* Composition Overlay Grids */}
          {grid === "thirds" && (
            <div className="vf-grid-thirds" aria-hidden="true">
              <span className="vf-line-v" style={{ left: "33.33%" }} />
              <span className="vf-line-v" style={{ left: "66.66%" }} />
              <span className="vf-line-h" style={{ top: "33.33%" }} />
              <span className="vf-line-h" style={{ top: "66.66%" }} />
            </div>
          )}
          {grid === "center" && (
            <div className="vf-grid-center" aria-hidden="true">
              <span className="vf-line-v" style={{ left: "50%" }} />
              <span className="vf-line-h" style={{ top: "50%" }} />
            </div>
          )}
          {grid === "golden" && (
            <div className="vf-grid-thirds" aria-hidden="true">
              <span className="vf-line-v" style={{ left: "38.2%" }} />
              <span className="vf-line-v" style={{ left: "61.8%" }} />
              <span className="vf-line-h" style={{ top: "38.2%" }} />
              <span className="vf-line-h" style={{ top: "61.8%" }} />
            </div>
          )}

          {/* Cinema Camera HUD Telemetry */}
          <div className="vf-hud-top">
            <span>24 FPS · 180°</span>
            <span>{lensMm}MM ANAMORPHIC</span>
            <span>{kelvin}K</span>
          </div>
          <div className="vf-hud-bottom">
            <span>{framingLabel}</span>
            <span>CONTRAST {contrast}%</span>
          </div>
          <span className="vf-corner vf-corner--tl" />
          <span className="vf-corner vf-corner--tr" />
          <span className="vf-corner vf-corner--bl" />
          <span className="vf-corner vf-corner--br" />
        </div>
      </div>

      {/* Interactive Zero-to-Pro Camera Sliders */}
      <div className="vf-controls-grid">
        <label className="vf-slider-item">
          <span className="vf-slider-label">
            {isBn ? "সাবজেক্ট পজিশন (ফ্রেমিং)" : "Subject Placement"} <strong>{subjectX}%</strong>
          </span>
          <input
            type="range"
            min={18}
            max={82}
            value={subjectX}
            onChange={(e) => setSubjectX(Number(e.target.value))}
          />
        </label>

        <label className="vf-slider-item">
          <span className="vf-slider-label">
            {isBn ? "লেন্স ফোকাল লেন্থ" : "Focal Length"} <strong>{lensMm}mm</strong>
          </span>
          <input
            type="range"
            min={24}
            max={85}
            step={1}
            value={lensMm}
            onChange={(e) => setLensMm(Number(e.target.value))}
          />
        </label>

        <label className="vf-slider-item">
          <span className="vf-slider-label">
            {isBn ? "নেগেটিভ ফিল / কন্ট্রাস্ট" : "Negative Fill / Contrast"}{" "}
            <strong>{contrast}%</strong>
          </span>
          <input
            type="range"
            min={20}
            max={95}
            value={contrast}
            onChange={(e) => setContrast(Number(e.target.value))}
          />
        </label>

        <label className="vf-slider-item">
          <span className="vf-slider-label">
            {isBn ? "কালার টেম্পারেচার" : "Color Temp"} <strong>{kelvin}K</strong>
          </span>
          <input
            type="range"
            min={2800}
            max={7500}
            step={100}
            value={kelvin}
            onChange={(e) => setKelvin(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="vf-lab-footer">
        <p className="vf-tip">{preset.tip}</p>
        <div className="vf-pill-group">
          {(["thirds", "golden", "center", "off"] as GridMode[]).map((g) => (
            <button
              key={g}
              type="button"
              className="vf-pill-btn"
              data-active={grid === g}
              onClick={() => setGrid(g)}
            >
              {g === "thirds" ? "3x3" : g === "golden" ? "Phi" : g === "center" ? "Cross" : "Clean"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
