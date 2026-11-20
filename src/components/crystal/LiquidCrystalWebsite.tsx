import React, { useEffect, useRef, useState } from "react";
import { LiquidCrystalRayCanvas, CrystalThemeId } from "./LiquidCrystalRayCanvas";
import { WaterDropCursor } from "./WaterDropCursor";
import { CrystalReveal, CrystalText } from "./CrystalReveal";
import "../../styles/crystal-cinema.css";

export interface CrystalFilm {
  id: string;
  title: string;
  genre: string;
  year: string;
  description: string;
  youtubeId: string;
  youtubeUrl?: string;
  thumbnail: string;
  thumbnailFallback?: string;
}

export interface CrystalUpcoming {
  number: string;
  title: string;
  genre: string;
}

export interface CrystalLink {
  id: string;
  label: string;
  handle: string;
  url: string;
}

interface LiquidCrystalWebsiteProps {
  portraitSrc: string;
  bio: string;
  manifesto: string;
  films: CrystalFilm[];
  upcoming: CrystalUpcoming[];
  links: CrystalLink[];
  renderAcademy: (onClose: () => void) => React.ReactNode;
  renderZeeAI: (onClose: () => void) => React.ReactNode;
  renderContact: (onClose: () => void) => React.ReactNode;
  onToggleAudio?: (enabled: boolean) => void;
}

const THEMES: CrystalThemeId[] = ["abyss", "glacier", "noir"];

const CrystalWaveDivider: React.FC = () => (
  <div className="crystal-wave-divider" aria-hidden="true">
    <svg viewBox="0 0 1200 70" preserveAspectRatio="none">
      <path
        d="M0,36 C180,68 380,6 600,36 C820,66 1020,6 1200,36 L1200,70 L0,70 Z"
        fill="rgba(125,187,255,0.09)"
      />
    </svg>
    <svg viewBox="0 0 1200 70" preserveAspectRatio="none">
      <path
        d="M0,42 C210,8 410,66 600,38 C790,10 990,66 1200,42 L1200,70 L0,70 Z"
        fill="rgba(184,220,255,0.06)"
      />
    </svg>
  </div>
);

export const LiquidCrystalWebsite: React.FC<LiquidCrystalWebsiteProps> = ({
  portraitSrc,
  bio,
  manifesto,
  films,
  upcoming,
  links,
  renderAcademy,
  renderZeeAI,
  renderContact,
  onToggleAudio,
}) => {
  const scrollRayRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<CrystalThemeId>("abyss");
  const [audioOn, setAudioOn] = useState(false);
  const [liteMode, setLiteMode] = useState(false);
  const [activeFilm, setActiveFilm] = useState<CrystalFilm | null>(null);
  const [activePortal, setActivePortal] = useState<"academy" | "zeeai" | "contact" | null>(null);

  const modalOpen = Boolean(activeFilm || activePortal);

  // Zero-re-render hardware-accelerated scroll progress ray
  useEffect(() => {
    let ticking = false;
    const syncRay = () => {
      ticking = false;
      if (!scrollRayRef.current) return;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / max));
      scrollRayRef.current.style.transform = `scaleX(${ratio.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(syncRay);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll & close modal on Escape
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveFilm(null);
        setActivePortal(null);
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen]);

  const cycleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    document.documentElement.style.setProperty("--ripple-x", `${(e.clientX / window.innerWidth) * 100}%`);
    document.documentElement.style.setProperty("--ripple-y", `${(e.clientY / window.innerHeight) * 100}%`);

    const apply = () => {
      document.documentElement.setAttribute("data-crystal-theme", next);
      setTheme(next);
    };

    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      doc.startViewTransition(apply);
    } else {
      apply();
    }
  };

  const toggleSound = () => {
    const next = !audioOn;
    setAudioOn(next);
    onToggleAudio?.(next);
  };

  return (
    <>
      <LiquidCrystalRayCanvas theme={theme} liteMode={liteMode} paused={modalOpen} />
      {!liteMode && <WaterDropCursor />}
      <div ref={scrollRayRef} className="crystal-scroll-ray" aria-hidden="true" />

      {/* FLOATING LIQUID-CRYSTAL NAVIGATION */}
      <header className="crystal-nav-dock">
        <nav className="crystal-card crystal-nav-inner" aria-label="Main Navigation">
          <a href="#top" className="crystal-brand" data-cursor-label="HOME">
            <span className="crystal-brand-name">ZEEHAD HAQUE</span>
            <span className="crystal-brand-role">Director · Writer · Cinematographer · Editor</span>
          </a>

          <div className="crystal-nav-links">
            <a href="#films" className="crystal-btn" data-cursor-label="VAULT">
              Films
            </a>
            <a href="#upcoming" className="crystal-btn" data-cursor-label="SLATE">
              Upcoming
            </a>
            <button
              type="button"
              className="crystal-btn"
              data-cursor-label="INSTITUTE"
              onClick={() => setActivePortal("academy")}
            >
              Academy
            </button>
            <button
              type="button"
              className="crystal-btn"
              data-cursor-label="TALK"
              onClick={() => setActivePortal("zeeai")}
            >
              ZEE AI
            </button>
            <button
              type="button"
              className="crystal-btn"
              data-cursor-label="PRISM"
              onClick={cycleTheme}
            >
              Ray: {theme}
            </button>
            <button
              type="button"
              className="crystal-btn"
              data-cursor-label="AUDIO"
              onClick={toggleSound}
            >
              {audioOn ? "Sound ON" : "Sound OFF"}
            </button>
            <button
              type="button"
              className="crystal-btn"
              data-cursor-label="FPS"
              onClick={() => setLiteMode((v) => !v)}
            >
              {liteMode ? "Full FX" : "Lite"}
            </button>
          </div>
        </nav>
      </header>

      <main id="top" className="crystal-main">
        {/* 01 // VOLUMETRIC LIQUID CRYSTAL HERO */}
        <section className="crystal-section crystal-hero">
          <div>
            <CrystalReveal variant="drop">
              <div className="crystal-pill-tag">
                <span className="crystal-drop-dot" />
                <span>Liquid Crystal Cinema · Gazipur, Bangladesh</span>
              </div>
            </CrystalReveal>

            <h1 className="crystal-headline">
              <CrystalText text="ZEEHAD HAQUE" staggerMs={45} />
            </h1>

            <p className="crystal-lead">
              <CrystalText text={bio} staggerMs={16} />
            </p>

            <CrystalReveal variant="rise" delayMs={160}>
              <div className="crystal-cta-group">
                <a
                  href="#films"
                  className="crystal-btn crystal-btn--prism"
                  data-cursor-label="SCREENING"
                >
                  Explore Film Vault ({films.length})
                </a>
                <button
                  type="button"
                  className="crystal-btn"
                  data-cursor-label="LEARN"
                  onClick={() => setActivePortal("academy")}
                >
                  Filmmaking Institute
                </button>
                <button
                  type="button"
                  className="crystal-btn"
                  data-cursor-label="AI"
                  onClick={() => setActivePortal("zeeai")}
                >
                  Talk to ZEE AI
                </button>
                <button
                  type="button"
                  className="crystal-btn"
                  data-cursor-label="CONNECT"
                  onClick={() => setActivePortal("contact")}
                >
                  Direct Contact
                </button>
              </div>
            </CrystalReveal>
          </div>

          <CrystalReveal variant="prism" delayMs={120}>
            <div className="crystal-card crystal-portrait-vessel" data-cursor-label="DIRECTOR">
              <div className="crystal-portrait-media">
                <img
                  src={portraitSrc}
                  alt="Zeehad Haque — Independent Filmmaker"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
              <div className="crystal-portrait-caption">
                <span>AUTEUR // ZEEHAD HAQUE</span>
                <span>24 FPS · ATMOSPHERE</span>
              </div>
            </div>
          </CrystalReveal>
        </section>

        <CrystalWaveDivider />

        {/* 02 // COMPLETE FILMOGRAPHY — SCREENING VAULT */}
        <section id="films" className="crystal-section crystal-offscreen">
          <CrystalReveal variant="ray">
            <div className="crystal-pill-tag">
              <span className="crystal-drop-dot" />
              <span>Complete Filmography · Click to Screen</span>
            </div>
            <h2 className="crystal-section-title">
              <CrystalText text="THE SCREENING VAULT" staggerMs={35} />
            </h2>
          </CrystalReveal>

          <div className="crystal-film-grid">
            {films.map((film, idx) => (
              <CrystalReveal key={film.id} variant="prism" delayMs={(idx % 3) * 70}>
                <article
                  className="crystal-card crystal-film-card"
                  data-cursor-label="PLAY FILM"
                  onClick={() => setActiveFilm(film)}
                >
                  <div className="crystal-thumb-wrap">
                    <img
                      src={film.thumbnail}
                      alt={film.title}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (film.thumbnailFallback && img.src !== film.thumbnailFallback) {
                          img.src = film.thumbnailFallback;
                        }
                      }}
                    />
                    <span className="crystal-play-orb" aria-hidden="true">
                      ▶
                    </span>
                  </div>
                  <div className="crystal-meta-row">
                    <span>{film.genre}</span>
                    <span>{film.year}</span>
                  </div>
                  <h3 className="crystal-card-title">{film.title}</h3>
                  <p className="crystal-card-desc">{film.description}</p>
                </article>
              </CrystalReveal>
            ))}
          </div>
        </section>

        <CrystalWaveDivider />

        {/* 03 // FUTURE SLATE — 11 UPCOMING PROJECTS */}
        <section id="upcoming" className="crystal-section crystal-offscreen">
          <CrystalReveal variant="ray">
            <div className="crystal-pill-tag">
              <span className="crystal-drop-dot" />
              <span>Future Slate · {upcoming.length} Projects in Development</span>
            </div>
            <h2 className="crystal-section-title">
              <CrystalText text="UPCOMING PROJECTS" staggerMs={35} />
            </h2>
          </CrystalReveal>

          <div className="crystal-slate-grid">
            {upcoming.map((item, idx) => (
              <CrystalReveal key={item.number} variant="rise" delayMs={(idx % 4) * 55}>
                <article
                  className="crystal-card crystal-slate-card"
                  data-cursor-label={`SLATE ${item.number}`}
                >
                  <div className="crystal-meta-row">
                    <span>PROJECT // {item.number}</span>
                    <span>UPCOMING</span>
                  </div>
                  <h3 className="crystal-slate-title">{item.title}</h3>
                  <div className="crystal-tag-list">
                    {item.genre.split("·").map((tag) => (
                      <span key={tag.trim()} className="crystal-genre-chip">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </article>
              </CrystalReveal>
            ))}
          </div>
        </section>

        <CrystalWaveDivider />

        {/* 04 // MANIFESTO & INTERACTIVE STUDIO PORTALS */}
        <section className="crystal-section crystal-offscreen">
          <CrystalReveal variant="prism">
            <div className="crystal-card" style={{ padding: "clamp(26px, 4vw, 52px)" }}>
              <div className="crystal-pill-tag">
                <span className="crystal-drop-dot" />
                <span>Auteur Manifesto</span>
              </div>
              <p
                className="crystal-lead"
                style={{ maxWidth: "none", fontSize: "clamp(17px, 2vw, 24px)", marginBottom: 0 }}
              >
                <CrystalText text={manifesto} staggerMs={16} />
              </p>

              <div className="crystal-portal-grid">
                <button
                  type="button"
                  className="crystal-card crystal-portal-card"
                  data-cursor-label="ENTER ACADEMY"
                  onClick={() => setActivePortal("academy")}
                >
                  <span className="crystal-meta-row">PORTAL 01 // ZERO TO PRO</span>
                  <h3 className="crystal-card-title">Zee Filmmaking Institute</h3>
                  <p className="crystal-card-desc">
                    30-Day Curriculum, Live Director's Viewfinder, Story-to-Script Studio & Playable
                    Cine-Arcade.
                  </p>
                </button>

                <button
                  type="button"
                  className="crystal-card crystal-portal-card"
                  data-cursor-label="CHAT ZEE AI"
                  onClick={() => setActivePortal("zeeai")}
                >
                  <span className="crystal-meta-row">PORTAL 02 // CREATIVE VOICE</span>
                  <h3 className="crystal-card-title">ZEE AI Companion</h3>
                  <p className="crystal-card-desc">
                    Human-like conversations, soulful poetry, shayari, story concepts & proper
                    screenplay mentorship.
                  </p>
                </button>

                <button
                  type="button"
                  className="crystal-card crystal-portal-card"
                  data-cursor-label="SEND MESSAGE"
                  onClick={() => setActivePortal("contact")}
                >
                  <span className="crystal-meta-row">PORTAL 03 // COLLABORATION</span>
                  <h3 className="crystal-card-title">Direct Contact Sanctuary</h3>
                  <p className="crystal-card-desc">
                    Commission a film, pitch a collaboration, or reach Zeehad Haque directly via
                    the private dispatch.
                  </p>
                </button>
              </div>
            </div>
          </CrystalReveal>
        </section>

        {/* 05 // OFFICIAL CHANNELS & VERIFIED LINKS */}
        <section id="channels" className="crystal-section crystal-offscreen" style={{ paddingTop: 24 }}>
          <CrystalReveal variant="rise">
            <div className="crystal-card" style={{ padding: "clamp(22px, 3vw, 42px)" }}>
              <div className="crystal-pill-tag">
                <span className="crystal-drop-dot" />
                <span>Official Profiles & Direct Channels</span>
              </div>

              <div className="crystal-links-grid">
                {links.map((item) => {
                  const isHttp = item.url.startsWith("http");
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target={isHttp ? "_blank" : undefined}
                      rel={isHttp ? "noopener noreferrer" : undefined}
                      className="crystal-card crystal-link-tile"
                      data-cursor-label={`OPEN ${item.label.toUpperCase()}`}
                    >
                      <span className="crystal-meta-row">{item.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 500, wordBreak: "break-word" }}>
                        {item.handle}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </CrystalReveal>
        </section>
      </main>

      <footer className="crystal-footer">
        <span>© {new Date().getFullYear()} ZEEHAD HAQUE · LIQUID CRYSTAL CINEMA</span>
        <span>GAZIPUR, BANGLADESH</span>
      </footer>

      {/* YOUTUBE SCREENING THEATER MODAL */}
      {activeFilm && (
        <div
          className="crystal-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setActiveFilm(null)}
        >
          <div className="crystal-card crystal-modal-sheet">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div>
                <div className="crystal-meta-row">{activeFilm.genre}</div>
                <h2 className="crystal-card-title" style={{ fontSize: "clamp(20px, 2.5vw, 28px)", marginTop: 4 }}>
                  {activeFilm.title}
                </h2>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {activeFilm.youtubeUrl && (
                  <a
                    href={activeFilm.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="crystal-btn"
                  >
                    YouTube ↗
                  </a>
                )}
                <button type="button" className="crystal-btn" onClick={() => setActiveFilm(null)}>
                  Close ✕
                </button>
              </div>
            </div>

            <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", marginBottom: 18, background: "#000" }}>
              <iframe
                src={`https://www.youtube.com/embed/${activeFilm.youtubeId}?autoplay=1&rel=0`}
                title={activeFilm.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              />
            </div>
            <p className="crystal-lead" style={{ marginBottom: 0, maxWidth: "none" }}>
              {activeFilm.description}
            </p>
          </div>
        </div>
      )}

      {/* ACADEMY / ZEE AI / CONTACT GLASS MODAL */}
      {activePortal && (
        <div
          className="crystal-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setActivePortal(null)}
        >
          <div className="crystal-card crystal-modal-sheet">
            {activePortal === "academy" && renderAcademy(() => setActivePortal(null))}
            {activePortal === "zeeai" && renderZeeAI(() => setActivePortal(null))}
            {activePortal === "contact" && renderContact(() => setActivePortal(null))}
          </div>
        </div>
      )}
    </>
  );
};
