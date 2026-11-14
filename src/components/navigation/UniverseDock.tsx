import { useState } from "react";
import {
  ArrowUp,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";
import { UNIVERSE_DESTINATIONS, type DestinationId } from "../../utils/castleConfig";

interface UniverseDockProps {
  activeChamber: DestinationId;
  scrollProgress: number;
  liteMode: boolean;
  onToggleLiteMode: () => void;
  onReplayIntro?: () => void;
}

export function UniverseDock({
  activeChamber,
  scrollProgress,
  liteMode,
  onToggleLiteMode,
  onReplayIntro,
}: UniverseDockProps) {
  const [collapsed, setCollapsed] = useState(true);
  const current =
    UNIVERSE_DESTINATIONS.find((c) => c.id === activeChamber) ??
    UNIVERSE_DESTINATIONS[0];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <aside
      className={`universe-dock ${collapsed ? "is-collapsed" : ""}`}
      aria-label="Palace environment controls"
    >
      <button
        type="button"
        className="universe-dock__collapse"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand palace controls" : "Collapse palace controls"}
      >
        {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        <span>{collapsed ? "Controls" : `${current.number} · ${current.label}`}</span>
      </button>

      {!collapsed && (
        <div className="universe-dock__bar">
          <span className="universe-dock__chamber tabular-nums">
            {current.number} / 07
          </span>
          <span className="universe-dock__sep" aria-hidden="true">
            ·
          </span>
          <button
            type="button"
            className={`universe-dock__btn ${liteMode ? "is-lite" : ""}`}
            onClick={onToggleLiteMode}
            aria-pressed={liteMode}
          >
            {liteMode ? <Zap size={13} /> : <Sparkles size={13} />}
            <span>{liteMode ? "Lite Mode: On" : "3D Palace: Active"}</span>
          </button>

          {onReplayIntro && (
            <button
              type="button"
              className="universe-dock__btn"
              onClick={onReplayIntro}
              aria-label="Replay Grand Cinema Opening sequence"
            >
              <RotateCcw size={13} />
              <span>Replay Opening</span>
            </button>
          )}

          {scrollProgress > 0.08 && (
            <button
              type="button"
              className="universe-dock__btn"
              onClick={scrollToTop}
              aria-label="Return to Grand Foyer"
            >
              <ArrowUp size={13} />
              <span>Top</span>
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
