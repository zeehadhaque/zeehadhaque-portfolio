import { useEffect, useRef } from "react";
import { RotateCcw, Sparkles, Zap } from "lucide-react";
import { UNIVERSE_DESTINATIONS, type DestinationId } from "../../utils/castleConfig";

interface SiteNavigationProps {
  activeChamber: DestinationId;
  scrollProgress: number;
  isOpen: boolean;
  liteMode: boolean;
  onToggleLiteMode: () => void;
  onReplayIntro: () => void;
  onToggle: () => void;
  onClose: () => void;
}

const primaryLinks = UNIVERSE_DESTINATIONS.slice(0, 5);

export function SiteNavigation({
  activeChamber,
  scrollProgress,
  isOpen,
  liteMode,
  onToggleLiteMode,
  onReplayIntro,
  onToggle,
  onClose,
}: SiteNavigationProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    firstLinkRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const progressWidth = `${Math.round(Math.min(1, Math.max(0, scrollProgress)) * 100)}%`;

  return (
    <>
      <header className="identity-topbar">
        <div
          className="identity-topbar__progress"
          aria-hidden="true"
          style={{ width: progressWidth }}
        />
        <div className="identity-topbar__inner">
          <a
            className="identity-topbar__brand"
            href="#foyer"
            onClick={onClose}
          >
            ZEEHAD HAQUE
          </a>

          <nav className="identity-topbar__nav" aria-label="Primary palace navigation">
            {primaryLinks.map((dest) => {
              const active = activeChamber === dest.id;
              return (
                <a
                  key={dest.id}
                  href={dest.href}
                  className={active ? "is-active" : undefined}
                  aria-current={active ? "location" : undefined}
                >
                  {dest.shortLabel}
                </a>
              );
            })}
          </nav>

          <div className="identity-topbar__actions">
            <button
              type="button"
              className={`identity-topbar__control ${liteMode ? "is-lite" : ""}`}
              onClick={onToggleLiteMode}
              aria-pressed={liteMode}
              title={liteMode ? "Switch to 3D Palace mode" : "Switch to Lite 2D mode"}
            >
              {liteMode ? <Zap size={13} /> : <Sparkles size={13} />}
              <span>{liteMode ? "Lite" : "3D"}</span>
            </button>
            <button
              type="button"
              className="identity-topbar__control"
              onClick={onReplayIntro}
              aria-label="Replay Grand Cinema Opening sequence"
              title="Replay Grand Cinema Opening"
            >
              <RotateCcw size={13} />
              <span>Opening</span>
            </button>
            <a className="identity-topbar__cta" href="#grand-exit">
              Grand Exit
            </a>
            <button
              className="identity-topbar__menu-btn"
              type="button"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close palace directory" : "Open palace directory"}
              aria-controls="mobile-navigation"
              onClick={onToggle}
            >
              <span>{isOpen ? "Close" : "Menu"}</span>
              <span
                className={`identity-topbar__menu-icon ${isOpen ? "is-open" : ""}`}
                aria-hidden="true"
              >
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      <nav
        className="elevation-rail"
        aria-label="Palace architectural floor index"
      >
        {UNIVERSE_DESTINATIONS.map((dest) => {
          const active = activeChamber === dest.id;
          return (
            <a
              key={dest.id}
              href={dest.href}
              className={active ? "is-active" : undefined}
              title={`${dest.number} · ${dest.label}`}
              aria-label={`${dest.number} ${dest.label}`}
            >
              <span className="elevation-rail__num tabular-nums">{dest.number}</span>
              <span className="elevation-rail__line" aria-hidden="true" />
            </a>
          );
        })}
      </nav>

      <div
        className={`identity-drawer ${isOpen ? "is-open" : ""}`}
        id="mobile-navigation"
        aria-hidden={!isOpen}
      >
        <button
          className="identity-drawer__backdrop"
          type="button"
          aria-label="Close palace directory"
          onClick={onClose}
        />
        <div className="identity-drawer__panel">
          <div className="identity-drawer__head">
            <p className="identity-kicker">Palace Directory</p>
            <p className="identity-drawer__tagline">Seven Grand Halls of Cinema</p>
          </div>
          <nav aria-label="Mobile palace navigation">
            <ol>
              {UNIVERSE_DESTINATIONS.map((dest, index) => (
                <li key={dest.id}>
                  <a
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={dest.href}
                    onClick={onClose}
                    className={activeChamber === dest.id ? "is-active" : undefined}
                    aria-current={activeChamber === dest.id ? "location" : undefined}
                  >
                    <span className="tabular-nums">{dest.number}</span>
                    <div>
                      <strong>{dest.label}</strong>
                      <small>{dest.subtitle}</small>
                    </div>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="identity-drawer__controls">
            <button
              type="button"
              className="identity-topbar__control"
              onClick={() => {
                onToggleLiteMode();
              }}
              aria-pressed={liteMode}
            >
              {liteMode ? <Zap size={13} /> : <Sparkles size={13} />}
              <span>{liteMode ? "Lite Mode: On" : "3D Palace: Active"}</span>
            </button>
            <button
              type="button"
              className="identity-topbar__control"
              onClick={() => {
                onClose();
                onReplayIntro();
              }}
            >
              <RotateCcw size={13} />
              <span>Replay Opening</span>
            </button>
          </div>
          <div className="identity-drawer__footer">
            <span>DIRECTOR · WRITER · CINEMATOGRAPHER · EDITOR</span>
            <span>Gazipur, Dhaka, Bangladesh</span>
          </div>
        </div>
      </div>
    </>
  );
}
