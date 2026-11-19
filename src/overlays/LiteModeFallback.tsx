import React from "react";
import { siteIdentity } from "../data/site";
import { SITE_CONFIG } from "../data/siteConfig";
import { videoArchive } from "../data/videoArchive";
import { linkRegistry } from "../data/linkRegistry";

interface LiteModeFallbackProps {
  onExitLite: () => void;
  onOpenFilm: (filmKey: "shadow" | "archive") => void;
  onOpenAcademy: () => void;
  onOpenZeeAI: () => void;
  onOpenContact: () => void;
}

export const LiteModeFallback: React.FC<LiteModeFallbackProps> = ({
  onExitLite,
  onOpenFilm,
  onOpenAcademy,
  onOpenZeeAI,
  onOpenContact,
}) => {
  return (
    <div className="lite-mode-wrapper">
      {/* Top Floating Glass Bar */}
      <header className="lite-header glass-panel">
        <div className="brand-lockup">
          <span className="brand-name">ZEEHAD HAQUE</span>
          <span className="brand-role font-mono">
            DIRECTOR · WRITER · CINEMATOGRAPHER · EDITOR
          </span>
        </div>
        <div className="lite-actions">
          <button type="button" className="glass-btn" onClick={onExitLite}>
            <span>ENTER 3D CASTLE ↗</span>
          </button>
        </div>
      </header>

      {/* Main Editorial Content */}
      <main className="lite-main-container">
        {/* Hero Section */}
        <section className="lite-hero glass-panel">
          <div className="lite-hero-grid">
            <div className="lite-hero-info">
              <span className="modal-kicker font-mono">
                AUTEUR IDENTITY // GAZIPUR, BANGLADESH
              </span>
              <h1 className="lite-hero-title font-display">{siteIdentity.name}</h1>
              <p className="lite-hero-statement font-display">
                &ldquo;{siteIdentity.statement}&rdquo;
              </p>
              <p className="lite-hero-bio">{siteIdentity.biography}</p>
              <div className="lite-hero-buttons">
                <button
                  type="button"
                  className="glass-btn"
                  onClick={() => onOpenFilm("shadow")}
                >
                  <span>SCREEN SHADOW / III (2026) ↗</span>
                </button>
                <button type="button" className="glass-btn" onClick={onOpenAcademy}>
                  <span>ACADEMY CURRICULUM ↗</span>
                </button>
                <button type="button" className="glass-btn" onClick={onOpenContact}>
                  <span>DIRECT CONTACT ↗</span>
                </button>
              </div>
            </div>

            <div className="lite-hero-media">
              <img
                src={SITE_CONFIG.cleanPortraitImage}
                alt="Zeehad Haque Portrait"
                className="lite-portrait-img glass-panel"
                loading="eager"
              />
            </div>
          </div>
        </section>

        {/* Filmography Section */}
        <section className="lite-films-section">
          <div className="section-title-wrap">
            <span className="modal-kicker font-mono">
              VERIFIED ARCHIVE // 8 WORKS
            </span>
            <h2 className="lite-section-title font-display">Screening Vault</h2>
          </div>

          <div className="lite-film-grid">
            {videoArchive.map((film) => (
              <article key={film.id} className="lite-film-card glass-panel">
                <div className="lite-film-thumb-box">
                  <img
                    src={film.thumbnail}
                    alt={film.displayTitle}
                    className="lite-film-thumb"
                    loading="lazy"
                  />
                  <span className="lite-film-badge font-mono">{film.runtime}</span>
                </div>
                <div className="lite-film-content">
                  <span className="lite-film-year font-mono">{film.year} · {film.genre}</span>
                  <h3 className="lite-film-name font-display">{film.displayTitle}</h3>
                  <p className="lite-film-desc">{film.description}</p>
                  <div className="lite-film-card-actions">
                    <button
                      type="button"
                      className="glass-btn"
                      onClick={() => onOpenFilm("archive")}
                    >
                      <span>Screen Film ↗</span>
                    </button>
                    <a
                      href={`https://www.youtube.com/watch?v=${film.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-btn"
                    >
                      <span>YouTube ↗</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Portals Showcase: Academy & ZEE AI */}
        <section className="lite-portals-section">
          <div className="lite-portal-card glass-panel">
            <span className="modal-kicker font-mono">PEDAGOGICAL INSTITUTE</span>
            <h2 className="lite-portal-title font-display">Zee Filmmaking Institute</h2>
            <p className="lite-portal-desc">
              Comprehensive 30-day curriculum covering Visual Grammar, Mobile Cinematography,
              Dramatic Story &amp; Blocking, and Post-Production Rhythm. Bilingual EN/BN with
              Cine-Arcade interactive challenges.
            </p>
            <button type="button" className="glass-btn" onClick={onOpenAcademy}>
              <span>OPEN ACADEMY CURRICULUM ↗</span>
            </button>
          </div>

          <div className="lite-portal-card glass-panel">
            <span className="modal-kicker font-mono">CONVERSATIONAL INTELLIGENCE</span>
            <h2 className="lite-portal-title font-display">ZEE AI Core Terminal</h2>
            <p className="lite-portal-desc">
              An interactive conversational assistant trained strictly on Zeehad Haque&apos;s
              filmography, directing philosophy, camera workflow, and screenplay archive.
            </p>
            <button type="button" className="glass-btn" onClick={onOpenZeeAI}>
              <span>CONNECT TO ZEE AI ↗</span>
            </button>
          </div>
        </section>

        {/* Location Scouting & Direct Suite */}
        <section className="lite-suite-section glass-panel">
          <div className="lite-suite-grid">
            <div className="lite-suite-img-wrap">
              <img
                src={SITE_CONFIG.filmmakerLocationImage}
                alt="Zeehad Haque On Location"
                className="lite-suite-img"
                loading="lazy"
              />
              <div className="lite-suite-tag font-mono">
                ON LOCATION SCOUTING // NATURAL GEOGRAPHY
              </div>
            </div>

            <div className="lite-suite-info">
              <span className="modal-kicker font-mono">DIRECTORS SUITE</span>
              <h2 className="lite-suite-title font-display">Direct Inquiries &amp; Collaboration</h2>
              <p className="lite-suite-desc">
                Based in Gazipur, Dhaka, Bangladesh. Available for independent films, commercial
                visual directing, and screenwriting commissions.
              </p>
              <div className="lite-suite-contacts">
                <a
                  href={`https://wa.me/${siteIdentity.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-btn"
                >
                  <span>WhatsApp: {siteIdentity.whatsapp} ↗</span>
                </a>
                <a href={`mailto:${siteIdentity.email}`} className="glass-btn">
                  <span>Email: {siteIdentity.email} ↗</span>
                </a>
                <button type="button" className="glass-btn" onClick={onOpenContact}>
                  <span>OPEN MESSAGE FORM ↗</span>
                </button>
              </div>

              {/* Social Links */}
              <div className="lite-social-row font-mono">
                {linkRegistry
                  .filter((l) => l.category === "social" || l.category === "code")
                  .map((link) => (
                    <a
                      key={link.id}
                      href={link.exactUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lite-social-link"
                    >
                      {link.displayName} ↗
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="lite-footer font-mono">
        <span>ZEEHAD HAQUE // THE INFINITE CINEMATIC CASTLE</span>
        <span>GAZIPUR · DHAKA · BANGLADESH</span>
      </footer>
    </div>
  );
};
