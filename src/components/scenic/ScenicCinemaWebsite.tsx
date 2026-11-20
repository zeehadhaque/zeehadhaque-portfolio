import React, { useEffect, useRef, useState } from "react";
import { ScenicValleyCanvas, ScenicMoodId } from "./ScenicValleyCanvas";
import { AtmosphericDriftLayer } from "./AtmosphericDriftLayer";
import { ValleyParallaxLayers } from "./ValleyParallaxLayers";
import { WaterDropCursor } from "../crystal/WaterDropCursor";
import { CrystalReveal, CrystalText } from "../crystal/CrystalReveal";
import "../../styles/scenic-cinema.css";

export interface ScenicFilm {
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

export interface ScenicUpcoming {
  number: string;
  title: string;
  genre: string;
}

export interface ScenicLink {
  id: string;
  label: string;
  handle: string;
  url: string;
}

interface ScenicCinemaWebsiteProps {
  portraitSrc: string;
  bio: string;
  manifesto: string;
  films: ScenicFilm[];
  upcoming: ScenicUpcoming[];
  links: ScenicLink[];
  renderAcademy: (onClose: () => void) => React.ReactNode;
  renderZeeAI: (onClose: () => void) => React.ReactNode;
  renderContact: (onClose: () => void) => React.ReactNode;
  onToggleAudio?: (enabled: boolean) => void;
}

const MOODS: ScenicMoodId[] = ["frost", "ember", "moonlight"];
const MOOD_LABELS: Record<ScenicMoodId, string> = {
  frost: "❄ Frost",
  ember: "🍂 Ember",
  moonlight: "🌙 Moonlight",
};

const CHAPTERS = [
  { id: "top", label: "I · PEAKS" },
  { id: "films", label: "II · VALLEY" },
  { id: "upcoming", label: "III · MIRROR" },
  { id: "horizon", label: "IV · HORIZON" },
];

export const ScenicCinemaWebsite: React.FC<ScenicCinemaWebsiteProps> = ({
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
  const [mood, setMood] = useState<ScenicMoodId>("frost");
  const [activeChapter, setActiveChapter] = useState<string>("top");
  const [audioOn, setAudioOn] = useState(false);
  const [liteMode, setLiteMode] = useState(false);
  const [activeFilm, setActiveFilm] = useState<ScenicFilm | null>(null);
  const [activePortal, setActivePortal] = useState<"academy" | "zeeai" | "contact" | null>(null);

  const modalOpen = Boolean(activeFilm || activePortal);

  useEffect(() => {
    document.documentElement.setAttribute("data-scenic-mood", mood);
  }, [mood]);

  // Zero-re-render hardware-accelerated scroll ray + lightweight chapter tracking
  useEffect(() => {
    let ticking = false;
    const syncScroll = () => {
      ticking = false;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / max));
      if (scrollRayRef.current) {
        scrollRayRef.current.style.transform = `scaleX(${ratio.toFixed(4)})`;
      }
      const nextChapter =
        ratio < 0.22 ? "top" : ratio < 0.52 ? "films" : ratio < 0.78 ? "upcoming" : "horizon";
      setActiveChapter((prev) => (prev === nextChapter ? prev : nextChapter));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(syncScroll);
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
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen]);

  const handleMoodHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = 1.0 - (rect.top + rect.height / 2) / window.innerHeight;
    window.dispatchEvent(new CustomEvent("scenic-theme-hover", { detail: { x, y } }));
  };

  const cycleMood = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = MOODS[(MOODS.indexOf(mood) + 1) % MOODS.length];
    document.documentElement.style.setProperty("--ripple-x", `${(e.clientX / window.innerWidth) * 100}%`);
    document.documentElement.style.setProperty("--ripple-y", `${(e.clientY / window.innerHeight) * 100}%`);
    handleMoodHover(e);

    const apply = () => {
      document.documentElement.setAttribute("data-scenic-mood", next);
      setMood(next);
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
      <ScenicValleyCanvas mood={mood} liteMode={liteMode} paused={modalOpen} />
      <ValleyParallaxLayers liteMode={liteMode} />
      <AtmosphericDriftLayer mood={mood} liteMode={liteMode} paused={modalOpen} />
      {!liteMode && <WaterDropCursor />}
      <div ref={scrollRayRef} className="scenic-scroll-ray" aria-hidden="true" />

      {/* Silent Right-Edge Elevation Chapter Rail */}
      <aside className="scenic-chapter-rail" aria-label="Visual Chapters">
        {CHAPTERS.map((ch) => (
          <a
            key={ch.id}
            href={`#${ch.id}`}
            title={ch.label}
            aria-label={ch.label}
            className="scenic-chapter-dot"
            data-active={activeChapter === ch.id}
            data-cursor-label={ch.label}
          />
        ))}
      </aside>

      {/* FLOATING FROSTED NAVIGATION */}
      <header className="scenic-nav-dock">
        <nav className="crystal-card scenic-nav-inner" aria-label="Main Navigation">
          <a href="#top" className="scenic-brand" data-cursor-label="PEAKS">
            <span className="scenic-brand-name">ZEEHAD HAQUE</span>
            <span className="scenic-brand-role">Director · Writer · Cinematographer · Editor</span>
          </a>

          <div className="scenic-nav-links">
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
              data-cursor-label="AI"
              onClick={() => setActivePortal("zeeai")}
            >
              ZEE AI
            </button>
            <button
              type="button"
              className="crystal-btn scenic-mood-btn"
              data-cursor-label="SHIFT MOOD"
              onMouseEnter={handleMoodHover}
              onClick={cycleMood}
            >
              <span className="scenic-mood-orb" aria-hidden="true" />
              <span>{MOOD_LABELS[mood]}</span>
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

      <main id="top" className="scenic-main">
        {/* CHAPTER I // SNOW-CROWNED PEAKS & IDENTITY */}
        <section className="scenic-section scenic-hero">
          <div>
            <CrystalReveal variant="drop">
              <div className="scenic-chapter-pill">
                <span className="scenic-pulse-dot" />
                <span>Independent Filmmaker · Visual Cinema</span>
              </div>
            </CrystalReveal>

            <h1 className="scenic-headline">
              <CrystalText text="ZEEHAD HAQUE" staggerMs={45} />
            </h1>

            <p className="scenic-lead">
              <CrystalText text={bio} staggerMs={16} />
            </p>

            <CrystalReveal variant="rise" delayMs={150}>
              <div className="scenic-cta-row">
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
                  data-cursor-label="TALK"
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

          <CrystalReveal variant="prism" delayMs={110}>
            <div className="crystal-card scenic-portrait-vessel" data-cursor-label="DIRECTOR">
              <div className="scenic-portrait-frame">
                <img
                  src={portraitSrc}
                  alt="Zeehad Haque — Independent Filmmaker"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
              <div className="scenic-portrait-caption">
                <span>AUTEUR // ZEEHAD HAQUE</span>
                <span>24 FPS · SILENCE & LIGHT</span>
              </div>
            </div>
          </CrystalReveal>
        </section>

        {/* CHAPTER II // MISTY VALLEY & SCREENING VAULT */}
        <section id="films" className="scenic-section scenic-offscreen">
          <CrystalReveal variant="ray">
            <div className="scenic-chapter-pill">
              <span className="scenic-pulse-dot" />
              <span>Complete Filmography · Click to Screen</span>
            </div>
            <h2 className="scenic-section-title">
              <CrystalText text="THE SCREENING VAULT" staggerMs={35} />
            </h2>
          </CrystalReveal>

          <div className="scenic-film-grid">
            {films.map((film, idx) => (
              <CrystalReveal key={film.id} variant="prism" delayMs={(idx % 3) * 70}>
                <article
                  className="crystal-card scenic-film-card"
                  data-cursor-label="PLAY FILM"
                  onClick={() => setActiveFilm(film)}
                >
                  <div className="scenic-thumb">
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
                    <span className="scenic-play-orb" aria-hidden="true">
                      ▶
                    </span>
                  </div>
                  <div className="scenic-meta">
                    <span>{film.genre}</span>
                    <span>{film.year}</span>
                  </div>
                  <h3 className="scenic-card-title">{film.title}</h3>
                  <p className="scenic-card-desc">{film.description}</p>
                </article>
              </CrystalReveal>
            ))}
          </div>
        </section>

        {/* CHAPTER III // MIRROR LAKE & 11 UPCOMING PROJECTS */}
        <section id="upcoming" className="scenic-section scenic-offscreen">
          <CrystalReveal variant="ray">
            <div className="scenic-chapter-pill">
              <span className="scenic-pulse-dot" />
              <span>Future Slate · {upcoming.length} Projects in Development</span>
            </div>
            <h2 className="scenic-section-title">
              <CrystalText text="UPCOMING PROJECTS" staggerMs={35} />
            </h2>
          </CrystalReveal>

          <div className="scenic-slate-grid">
            {upcoming.map((item, idx) => (
              <CrystalReveal key={item.number} variant="rise" delayMs={(idx % 4) * 55}>
                <article
                  className="crystal-card scenic-slate-card"
                  data-cursor-label={`SLATE ${item.number}`}
                >
                  <div className="scenic-meta">
                    <span>PROJECT // {item.number}</span>
                    <span>UPCOMING</span>
                  </div>
                  <h3 className="scenic-slate-title">{item.title}</h3>
                  <div className="scenic-tags">
                    {item.genre.split("·").map((tag) => (
                      <span key={tag.trim()} className="scenic-chip">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </article>
              </CrystalReveal>
            ))}
          </div>
        </section>

        {/* CHAPTER IV // MOONLIT HORIZON — MANIFESTO, PORTALS & CHANNELS */}
        <section id="horizon" className="scenic-section scenic-offscreen">
          <CrystalReveal variant="prism">
            <div className="crystal-card" style={{ padding: "clamp(26px, 4vw, 52px)" }}>
              <div className="scenic-chapter-pill">
                <span className="scenic-pulse-dot" />
                <span>Auteur Manifesto</span>
              </div>
              <p
                className="scenic-lead"
                style={{ maxWidth: "none", fontSize: "clamp(17px, 2vw, 24px)", marginBottom: 0 }}
              >
                <CrystalText text={manifesto} staggerMs={16} />
              </p>

              <div className="scenic-portal-grid">
                <button
                  type="button"
                  className="crystal-card scenic-portal-card"
                  data-cursor-label="ENTER ACADEMY"
                  onClick={() => setActivePortal("academy")}
                >
                  <span className="scenic-meta">PORTAL 01 // ZERO TO PRO</span>
                  <h3 className="scenic-card-title">Zee Filmmaking Institute</h3>
                  <p className="scenic-card-desc">
                    30-Day Curriculum, Live Director's Viewfinder, Story-to-Script Studio & Playable
                    Cine-Arcade.
                  </p>
                </button>

                <button
                  type="button"
                  className="crystal-card scenic-portal-card"
                  data-cursor-label="CHAT ZEE AI"
                  onClick={() => setActivePortal("zeeai")}
                >
                  <span className="scenic-meta">PORTAL 02 // CREATIVE VOICE</span>
                  <h3 className="scenic-card-title">ZEE AI Companion</h3>
                  <p className="scenic-card-desc">
                    Natural human conversations, soulful poetry, shayari, story concepts & proper
                    screenplay mentorship.
                  </p>
                </button>

                <button
                  type="button"
                  className="crystal-card scenic-portal-card"
                  data-cursor-label="SEND MESSAGE"
                  onClick={() => setActivePortal("contact")}
                >
                  <span className="scenic-meta">PORTAL 03 // COLLABORATION</span>
                  <h3 className="scenic-card-title">Direct Contact Sanctuary</h3>
                  <p className="scenic-card-desc">
                    Commission a film, pitch a collaboration, or reach Zeehad Haque directly via
                    the private dispatch.
                  </p>
                </button>
              </div>
            </div>
          </CrystalReveal>

          {/* Official Channels Sanctuary */}
          <CrystalReveal variant="rise" delayMs={100}>
            <div className="crystal-card" style={{ padding: "clamp(22px, 3vw, 42px)", marginTop: 28 }}>
              <div className="scenic-chapter-pill">
                <span className="scenic-pulse-dot" />
                <span>Official Profiles & Direct Channels</span>
              </div>

              <div className="scenic-links-grid">
                {links.map((item) => {
                  const isHttp = item.url.startsWith("http");
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target={isHttp ? "_blank" : undefined}
                      rel={isHttp ? "noopener noreferrer" : undefined}
                      className="crystal-card scenic-link-tile"
                      data-cursor-label={`OPEN ${item.label.toUpperCase()}`}
                    >
                      <span className="scenic-meta">{item.label}</span>
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

      <footer className="scenic-footer">
        <span>© {new Date().getFullYear()} ZEEHAD HAQUE · ATMOSPHERIC CINEMA</span>
        <span>GAZIPUR, BANGLADESH</span>
      </footer>

      {/* YOUTUBE SCREENING THEATER MODAL */}
      {activeFilm && (
        <div
          className="scenic-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setActiveFilm(null)}
        >
          <div className="crystal-card scenic-modal-sheet">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div>
                <div className="scenic-meta">{activeFilm.genre}</div>
                <h2 className="scenic-card-title" style={{ fontSize: "clamp(20px, 2.5vw, 28px)", marginTop: 4 }}>
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
            <p className="scenic-lead" style={{ marginBottom: 0, maxWidth: "none" }}>
              {activeFilm.description}
            </p>
          </div>
        </div>
      )}

      {/* ACADEMY / ZEE AI / CONTACT GLASS MODAL (Single clean close button inside each modal) */}
      {activePortal && (
        <div
          className="scenic-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setActivePortal(null)}
        >
          <div className="crystal-card scenic-modal-sheet">
            {activePortal === "academy" && renderAcademy(() => setActivePortal(null))}
            {activePortal === "zeeai" && renderZeeAI(() => setActivePortal(null))}
            {activePortal === "contact" && renderContact(() => setActivePortal(null))}
          </div>
        </div>
      )}
    </>
  );
};
