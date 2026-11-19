import React, { useEffect, useState } from "react";
import { WaterWaveBackground, LiquidThemeId } from "./WaterWaveBackground";
import { KineticText } from "./KineticText";
import { LiquidImage } from "./LiquidImage";
import { LiquidCursor } from "./LiquidCursor";
import "../../styles/liquid-glass.css";

export interface LiquidFilmItem {
  id: string;
  title: string;
  genre: string;
  year?: string;
  description: string;
  youtubeId: string;
  thumbnail: string;
}

interface LiquidPortfolioShellProps {
  portraitSrc: string;
  heroBio: string;
  manifesto: string;
  films: LiquidFilmItem[];
  renderAcademy: (onClose: () => void) => React.ReactNode;
  renderZeeAI: (onClose: () => void) => React.ReactNode;
  renderContact: (onClose: () => void) => React.ReactNode;
  onToggleAudio?: (enabled: boolean) => void;
}

const THEMES: LiquidThemeId[] = ["abyss", "glacial", "noir"];

const WaveDivider: React.FC = () => (
  <div className="wave-divider" aria-hidden="true">
    <svg viewBox="0 0 1200 80" preserveAspectRatio="none">
      <path
        d="M0,42 C150,78 350,8 600,42 C850,76 1050,8 1200,42 L1200,80 L0,80 Z"
        fill="rgba(125,187,255,0.09)"
      />
    </svg>
    <svg viewBox="0 0 1200 80" preserveAspectRatio="none">
      <path
        d="M0,48 C200,12 400,76 600,44 C800,12 1000,76 1200,48 L1200,80 L0,80 Z"
        fill="rgba(169,212,255,0.06)"
      />
    </svg>
  </div>
);

export const LiquidPortfolioShell: React.FC<LiquidPortfolioShellProps> = ({
  portraitSrc,
  heroBio,
  manifesto,
  films,
  renderAcademy,
  renderZeeAI,
  renderContact,
  onToggleAudio,
}) => {
  const [theme, setTheme] = useState<LiquidThemeId>("abyss");
  const [audioOn, setAudioOn] = useState(false);
  const [liteMode, setLiteMode] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [activeFilm, setActiveFilm] = useState<LiquidFilmItem | null>(null);
  const [activePanel, setActivePanel] = useState<"academy" | "zeeai" | "contact" | null>(null);

  // Track scroll progress bar + scroll-velocity CSS skew variable
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;

    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const y = window.scrollY;
      setScrollPct((y / max) * 100);

      const vel = Math.max(-5, Math.min(5, (y - lastY) * 0.14));
      lastY = y;
      document.documentElement.style.setProperty("--scroll-vel", vel.toFixed(2));

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--scroll-vel", "0");
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const cycleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    document.documentElement.style.setProperty("--theme-x", `${(e.clientX / window.innerWidth) * 100}%`);
    document.documentElement.style.setProperty("--theme-y", `${(e.clientY / window.innerHeight) * 100}%`);

    const apply = () => {
      document.documentElement.setAttribute("data-liquid-theme", next);
      setTheme(next);
    };

    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      doc.startViewTransition(apply);
    } else {
      apply();
    }
  };

  const handleAudioToggle = () => {
    const next = !audioOn;
    setAudioOn(next);
    onToggleAudio?.(next);
  };

  return (
    <>
      <WaterWaveBackground theme={theme} liteMode={liteMode} />
      {!liteMode && <LiquidCursor />}

      <div className="liquid-scroll-bar" style={{ width: `${scrollPct}%` }} aria-hidden="true" />

      {/* Floating Frosted Glass Navigation */}
      <header className="liquid-nav-wrap">
        <nav className="liquid-glass liquid-nav" aria-label="Primary Navigation">
          <a href="#top" className="liquid-brand" data-cursor-label="HOME">
            <span className="liquid-brand-title">ZEEHAD HAQUE</span>
            <span className="liquid-brand-sub">Director · Writer · Cinematographer · Editor</span>
          </a>

          <div className="liquid-nav-actions">
            <a href="#films" className="liquid-btn" data-cursor-label="FILMS">
              Films
            </a>
            <button
              type="button"
              className="liquid-btn"
              data-cursor-label="INSTITUTE"
              onClick={() => setActivePanel("academy")}
            >
              Academy
            </button>
            <button
              type="button"
              className="liquid-btn"
              data-cursor-label="AI CORE"
              onClick={() => setActivePanel("zeeai")}
            >
              ZEE AI
            </button>
            <button
              type="button"
              className="liquid-btn"
              data-cursor-label="THEME"
              onClick={cycleTheme}
            >
              Wave: {theme}
            </button>
            <button
              type="button"
              className="liquid-btn"
              data-cursor-label="AUDIO"
              onClick={handleAudioToggle}
            >
              Sound {audioOn ? "ON" : "OFF"}
            </button>
            <button
              type="button"
              className="liquid-btn"
              data-cursor-label="MODE"
              onClick={() => setLiteMode((v) => !v)}
            >
              {liteMode ? "Full FX" : "Lite"}
            </button>
          </div>
        </nav>
      </header>

      <main id="top" className="liquid-shell">
        {/* HERO SECTION */}
        <section className="liquid-section liquid-hero">
          <div>
            <div className="liquid-eyebrow">
              <span className="liquid-eyebrow-dot" />
              <span>Interactive Liquid Cinema Experience</span>
            </div>

            <h1 className="liquid-hero-title">
              <KineticText text="ZEEHAD HAQUE" mode="char" staggerMs={28} />
            </h1>

            <p className="liquid-lead">
              <KineticText text={heroBio} mode="word" staggerMs={22} />
            </p>

            <div className="liquid-cta-row">
              <a
                href="#films"
                className="liquid-btn liquid-btn--primary"
                data-cursor-label="SCREENING"
              >
                Explore Film Vault ({films.length})
              </a>
              <button
                type="button"
                className="liquid-btn"
                data-cursor-label="LEARN"
                onClick={() => setActivePanel("academy")}
              >
                Filmmaking Institute
              </button>
              <button
                type="button"
                className="liquid-btn"
                data-cursor-label="CONNECT"
                onClick={() => setActivePanel("contact")}
              >
                Direct Contact
              </button>
            </div>
          </div>

          <div className="liquid-glass" style={{ padding: 14 }}>
            <LiquidImage
              src={portraitSrc}
              alt="Zeehad Haque — Filmmaker"
              aspectRatio="4 / 5"
              cursorLabel="DIRECTOR"
            />
          </div>
        </section>

        <WaveDivider />

        {/* FILM VAULT (ALL PRESERVED YOUTUBE FILMS WITH LIQUID RIPPLE POSTERS) */}
        <section id="films" className="liquid-section">
          <div className="liquid-eyebrow">
            <span className="liquid-eyebrow-dot" />
            <span>Complete Filmography</span>
          </div>
          <h2 className="liquid-hero-title" style={{ fontSize: "clamp(30px, 4.4vw, 56px)" }}>
            <KineticText text="THE SCREENING VAULT" mode="char" staggerMs={24} />
          </h2>

          <div className="liquid-grid">
            {films.map((film) => (
              <article
                key={film.id}
                className="liquid-glass film-card"
                data-cursor-label="PLAY FILM"
                onClick={() => setActiveFilm(film)}
              >
                <LiquidImage
                  src={film.thumbnail}
                  alt={film.title}
                  aspectRatio="16 / 9"
                  cursorLabel="WATCH"
                />
                <div className="film-card-meta">
                  <span>{film.genre}</span>
                  <span>{film.year ?? "FILM"}</span>
                </div>
                <h3 className="film-card-title">{film.title}</h3>
                <p className="film-card-desc">{film.description}</p>
              </article>
            ))}
          </div>
        </section>

        <WaveDivider />

        {/* MANIFESTO & SANCTUARY PORTALS */}
        <section className="liquid-section">
          <div className="liquid-glass" style={{ padding: "clamp(26px, 4vw, 52px)" }}>
            <div className="liquid-eyebrow">
              <span className="liquid-eyebrow-dot" />
              <span>Auteur Manifesto</span>
            </div>
            <p className="liquid-lead" style={{ maxWidth: "none", fontSize: "clamp(17px, 2vw, 24px)" }}>
              <KineticText text={manifesto} mode="word" staggerMs={20} />
            </p>
            <div className="liquid-cta-row">
              <button
                type="button"
                className="liquid-btn liquid-btn--primary"
                data-cursor-label="INSTITUTE"
                onClick={() => setActivePanel("academy")}
              >
                Open 30-Day Academy
              </button>
              <button
                type="button"
                className="liquid-btn"
                data-cursor-label="AI"
                onClick={() => setActivePanel("zeeai")}
              >
                Talk to ZEE AI
              </button>
              <button
                type="button"
                className="liquid-btn"
                data-cursor-label="MESSAGE"
                onClick={() => setActivePanel("contact")}
              >
                Send Direct Message
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* YOUTUBE SCREENING MODAL */}
      {activeFilm && (
        <div
          className="liquid-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setActiveFilm(null)}
        >
          <div className="liquid-glass liquid-modal-sheet">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <div className="film-card-meta">{activeFilm.genre}</div>
                <h2 className="film-card-title" style={{ fontSize: 28 }}>{activeFilm.title}</h2>
              </div>
              <button type="button" className="liquid-btn" onClick={() => setActiveFilm(null)}>
                Close ✕
              </button>
            </div>
            <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", marginBottom: 18 }}>
              <iframe
                src={`https://www.youtube.com/embed/${activeFilm.youtubeId}?autoplay=1&rel=0`}
                title={activeFilm.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              />
            </div>
            <p className="liquid-lead" style={{ marginBottom: 0 }}>{activeFilm.description}</p>
          </div>
        </div>
      )}

      {/* ACADEMY / ZEE AI / CONTACT GLASS MODAL */}
      {activePanel && (
        <div
          className="liquid-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setActivePanel(null)}
        >
          <div className="liquid-glass liquid-modal-sheet">
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
              <button type="button" className="liquid-btn" onClick={() => setActivePanel(null)}>
                Close ✕
              </button>
            </div>
            {activePanel === "academy" && renderAcademy(() => setActivePanel(null))}
            {activePanel === "zeeai" && renderZeeAI(() => setActivePanel(null))}
            {activePanel === "contact" && renderContact(() => setActivePanel(null))}
          </div>
        </div>
      )}
    </>
  );
};
