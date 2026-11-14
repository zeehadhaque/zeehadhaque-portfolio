import { useEffect, useRef } from "react";
import exteriorImg from "../../assets/images/palace_exterior_night_1794660878890.jpg";
import foyerImg from "../../assets/images/palace_grand_foyer_1794660878711.jpg";
import auditoriumImg from "../../assets/images/palace_imax_auditorium_1794660878336.jpg";
import { computeOpeningShotState } from "../../utils/castleConfig";

interface LoadingCurtainProps {
  visible: boolean;
  reducedMotion: boolean;
  liteMode: boolean;
  progress: number;
  onProgress: (nextProgress: number) => void;
  onComplete: () => void;
}

const OPENING_DURATION_MS = 4000;
const FIRST_NAME_CHARS = ["Z", "E", "E", "H", "A", "D"];
const LAST_NAME_CHARS = ["H", "A", "Q", "U", "E"];

export function LoadingCurtain({
  visible,
  reducedMotion,
  liteMode,
  progress,
  onProgress,
  onComplete,
}: LoadingCurtainProps) {
  const completeRef = useRef(onComplete);
  const progressRef = useRef(onProgress);

  useEffect(() => {
    completeRef.current = onComplete;
    progressRef.current = onProgress;
  }, [onComplete, onProgress]);

  useEffect(() => {
    if (!visible) return;

    if (reducedMotion) {
      progressRef.current(1);
      completeRef.current();
      return;
    }

    let rafId = 0;
    const start = performance.now();
    progressRef.current(0);

    const step = (now: number) => {
      const next = Math.min(1, (now - start) / OPENING_DURATION_MS);
      progressRef.current(next);
      if (next < 1) {
        rafId = window.requestAnimationFrame(step);
      } else {
        rafId = window.setTimeout(() => completeRef.current(), 950);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(rafId);
    };
  }, [visible, reducedMotion]);

  if (!visible) return null;

  const shotState = computeOpeningShotState(progress);
  const showIdentityTitle = progress >= 0.54;
  const showRoles = progress >= 0.78;
  const backdropOpacity = liteMode ? 0.56 : 0.08;

  const activeFallbackImg =
    shotState.shot <= 2
      ? exteriorImg
      : shotState.shot === 3
        ? foyerImg
        : auditoriumImg;

  return (
    <div
      className={`palace-opening is-shot-${shotState.shot} ${showIdentityTitle ? "is-title-visible" : ""} ${showRoles ? "is-roles-visible" : ""}`}
      data-reduced-motion={reducedMotion}
      role="status"
      aria-label="Opening sequence: Entering the Grand Cinema Palace of Zeehad Haque"
    >
      {/* Lite/Fallback Architectural Shot Plate (Subtle when live 3D WebGL fly-through runs behind) */}
      <div
        className="palace-opening__plates"
        aria-hidden="true"
        style={{ opacity: backdropOpacity }}
      >
        <img src={activeFallbackImg} alt="" referrerPolicy="no-referrer" />
      </div>

      {/* Widescreen 2.39:1 Theatrical Letterbox Framing & Light Beam */}
      <div className="palace-opening__scrim" aria-hidden="true" />
      <div className="palace-opening__beam" aria-hidden="true" />

      {/* Top Architectural Shot Ledger */}
      <div className="palace-opening__hud" aria-hidden="true">
        <span className="palace-opening__shot tabular-nums">
          {shotState.shotLabel}
        </span>
        <span className="palace-opening__meter">
          <i style={{ width: `${Math.round(progress * 100)}%` }} />
        </span>
      </div>

      {/* Monumental Letter-by-Letter Architectural Reveal */}
      <div className="palace-opening__center">
        <span className="palace-opening__eyebrow">
          THE GRAND CINEMA PALACE · PRESENTS
        </span>

        <div className="palace-opening__title" aria-label="Zeehad Haque">
          <span className="palace-opening__word">
            {FIRST_NAME_CHARS.map((char, idx) => (
              <span
                key={`fn-${idx}`}
                className="palace-opening__char"
                style={{ transitionDelay: `${idx * 34}ms` }}
              >
                {char}
              </span>
            ))}
          </span>
          <span className="palace-opening__word palace-opening__word--accent">
            {LAST_NAME_CHARS.map((char, idx) => (
              <span
                key={`ln-${idx}`}
                className="palace-opening__char"
                style={{ transitionDelay: `${(idx + 6) * 34}ms` }}
              >
                {char}
              </span>
            ))}
          </span>
        </div>

        <p className="palace-opening__roles">
          DIRECTOR · WRITER · CINEMATOGRAPHER · EDITOR
        </p>
      </div>

      <button
        type="button"
        className="palace-opening__skip"
        onClick={() => completeRef.current()}
      >
        Enter Grand Foyer
      </button>
    </div>
  );
}
