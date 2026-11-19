import React, { useEffect, useRef, useState } from "react";
import {
  CastleEngine,
  CastleInteractiveTarget,
  CastleTelemetry,
  CastleThemeId,
} from "./engine/CastleEngine";
import { CASTLE_STAGES } from "./engine/ScrollTimeline";
import { CinematicCursor } from "../hud/CinematicCursor";
import { ThemeAnimator } from "../hud/ThemeAnimator";
import "../styles/tokens.css";
import "../styles/castle-hud.css";

interface CastleExperienceProps {
  renderFilmModal: (filmKey: "shadow" | "chakra", onClose: () => void) => React.ReactNode;
  renderAcademy: (onClose: () => void) => React.ReactNode;
  renderZeeAI: (onClose: () => void) => React.ReactNode;
  renderContact: (onClose: () => void) => React.ReactNode;
  renderLiteFallback: (onExitLite: () => void) => React.ReactNode;
  onToggleAudio?: (enabled: boolean) => void;
}

const TARGET_LABELS: Record<CastleInteractiveTarget, string> = {
  "monolith-shadow": "OPEN FILM // SHADOW / III",
  "monolith-chakra": "OPEN FILM // CHAKRA",
  "portal-academy": "ENTER // FILMMAKING INSTITUTE",
  "portal-zeeai": "CONNECT // ZEE AI CORE",
  "portal-contact": "OPEN // DIRECT CONTACT",
};

export const CastleExperience: React.FC<CastleExperienceProps> = ({
  renderFilmModal,
  renderAcademy,
  renderZeeAI,
  renderContact,
  renderLiteFallback,
  onToggleAudio,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CastleEngine | null>(null);

  const [theme, setTheme] = useState<CastleThemeId>("obsidian");
  const [audioOn, setAudioOn] = useState(false);
  const [liteMode, setLiteMode] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<CastleInteractiveTarget | null>(null);
  const [telemetry, setTelemetry] = useState<CastleTelemetry>({
    progress: 0,
    velocity: 0,
    stage: CASTLE_STAGES[0],
    hoveredTarget: null,
    cameraZ: 26,
  });

  useEffect(() => {
    if (liteMode || !hostRef.current) return;

    // Auto-detect WebGL availability
    const probe = document.createElement("canvas");
    const hasWebGL = Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
    if (!hasWebGL) {
      setLiteMode(true);
      return;
    }

    const engine = new CastleEngine(
      hostRef.current,
      (t) => setTelemetry(t),
      (target) => setActiveOverlay(target)
    );
    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, [liteMode]);

  // Pause 3D wheel capture while an overlay (Film / Academy / ZEE AI / Contact) is open
  useEffect(() => {
    engineRef.current?.setScrollEnabled(!activeOverlay);
  }, [activeOverlay]);

  useEffect(() => {
    engineRef.current?.setTheme(theme);
  }, [theme]);

  if (liteMode) {
    return <>{renderLiteFallback(() => setLiteMode(false))}</>;
  }

  const toggleAudio = () => {
    const next = !audioOn;
    setAudioOn(next);
    onToggleAudio?.(next);
  };

  return (
    <div className="castle-viewport">
      <div ref={hostRef} className="castle-canvas" />

      <CinematicCursor
        activeLabel={telemetry.hoveredTarget ? TARGET_LABELS[telemetry.hoveredTarget] : null}
        isMonolithHover={Boolean(telemetry.hoveredTarget)}
      />

      {/* Minimal Fixed Glassy Telemetry HUD */}
      <header className="hud-layer">
        <div className="hud-top">
          <div className="brand-lockup hud-interactive">
            <span className="brand-name">ZEEHAD HAQUE</span>
            <span className="brand-role">Director · Writer · Cinematographer · Editor</span>
          </div>

          <nav className="hud-controls hud-interactive" aria-label="Castle Controls">
            <ThemeAnimator theme={theme} onChange={setTheme} />
            <button
              type="button"
              className="glass-btn"
              data-active={audioOn}
              onClick={toggleAudio}
            >
              Sound: {audioOn ? "ON" : "OFF"}
            </button>
            <button
              type="button"
              className="glass-btn"
              onClick={() => setActiveOverlay("portal-academy")}
            >
              Academy
            </button>
            <button
              type="button"
              className="glass-btn"
              onClick={() => setActiveOverlay("portal-zeeai")}
            >
              ZEE AI
            </button>
            <button
              type="button"
              className="glass-btn"
              onClick={() => setActiveOverlay("portal-contact")}
            >
              Contact
            </button>
            <button type="button" className="glass-btn" onClick={() => setLiteMode(true)}>
              Lite Mode
            </button>
          </nav>
        </div>

        <div className="hud-bottom">
          <div className="glass-panel telemetry-bar hud-interactive">
            <span>
              PROGRESS{" "}
              <strong className="telemetry-value">
                {Math.round(telemetry.progress * 100).toString().padStart(2, "0")}%
              </strong>
            </span>
            <span>
              Z-DEPTH{" "}
              <strong className="telemetry-value">{telemetry.cameraZ.toFixed(1)}M</strong>
            </span>
            <span>
              STAGE <strong className="telemetry-value">0{telemetry.stage.id} / 07</strong>
            </span>
          </div>
        </div>
      </header>

      {/* Scroll-Synced Floating Stage Typography */}
      <section key={telemetry.stage.id} className="stage-caption" aria-live="polite">
        <div className="stage-code">{telemetry.stage.code}</div>
        <h1 className="stage-title">{telemetry.stage.title}</h1>
        <p className="stage-subtitle">{telemetry.stage.subtitle}</p>
      </section>

      {/* Deterministic Vertical Scroll Rail */}
      <aside className="scroll-rail" aria-label="Stage Navigation">
        {CASTLE_STAGES.map((stage) => (
          <button
            key={stage.id}
            type="button"
            className="stage-dot"
            title={stage.title}
            data-active={telemetry.stage.id === stage.id}
            onClick={() => engineRef.current?.jumpToStage(stage.id)}
          />
        ))}
        <div className="scroll-rail-track">
          <div
            className="scroll-rail-fill"
            style={{ height: `${Math.max(4, telemetry.progress * 100)}%` }}
          />
        </div>
      </aside>

      {/* Frosted Glass Overlays preserving existing Films, Academy, ZEE AI, Contact */}
      {activeOverlay && (
        <div
          className="castle-overlay-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveOverlay(null);
          }}
        >
          <div className="glass-panel castle-overlay-card">
            {activeOverlay === "monolith-shadow" &&
              renderFilmModal("shadow", () => setActiveOverlay(null))}
            {activeOverlay === "monolith-chakra" &&
              renderFilmModal("chakra", () => setActiveOverlay(null))}
            {activeOverlay === "portal-academy" && renderAcademy(() => setActiveOverlay(null))}
            {activeOverlay === "portal-zeeai" && renderZeeAI(() => setActiveOverlay(null))}
            {activeOverlay === "portal-contact" && renderContact(() => setActiveOverlay(null))}
          </div>
        </div>
      )}
    </div>
  );
};
