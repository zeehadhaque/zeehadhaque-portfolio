import { useState } from "react";
import { ChevronDown, Film, Play, Compass, ExternalLink, Camera, User } from "lucide-react";
import { SITE_CONFIG } from "../../data/siteConfig";

interface HeroFoyerProps {
  onEnter: () => void;
  onOpenVideo: (videoId: string) => void;
}

export function HeroFoyer({ onEnter, onOpenVideo }: HeroFoyerProps) {
  const [portraitMode, setPortraitMode] = useState<"location" | "clean">("location");

  return (
    <section id="foyer" className="castle-section hero-foyer-section">
      <div className="foyer-container">
        {/* Floating Telemetry Coordinates */}
        <div className="foyer-badge-row">
          <span className="spatial-badge">
            <Compass size={12} className="spin-slow" />
            <span>PORTAL 01 // MECHANICAL ARCHITECTURE</span>
          </span>
          <span className="spatial-badge glow-cyan">
            <span>VOLUMETRIC MOONLIGHT · 2.39:1</span>
          </span>
        </div>

        {/* Main Monolith Layout */}
        <div className="foyer-monolith-grid">
          {/* Left Column: Monumental Typography */}
          <div className="foyer-text-block">
            <h2 className="foyer-eyebrow font-mono">AUTEUR · FILMMAKER · VISIONARY</h2>
            <h1 className="foyer-main-title">
              <span className="title-glitch" data-text={SITE_CONFIG.name}>
                {SITE_CONFIG.name}
              </span>
            </h1>

            <p className="foyer-brand-statement">
              {SITE_CONFIG.brandStatement}
            </p>

            <blockquote className="foyer-quote">
              &ldquo;{SITE_CONFIG.tagline}&rdquo;
            </blockquote>

            <p className="foyer-bio-synopsis">
              {SITE_CONFIG.biography}
            </p>

            {/* Quick Actions */}
            <div className="foyer-actions-row">
              <button
                type="button"
                onClick={onEnter}
                className="foyer-btn primary-glow-btn"
              >
                <span>Enter The Castle</span>
                <ChevronDown size={16} />
              </button>

              <button
                type="button"
                onClick={() => onOpenVideo("ZSttExMBavg")}
                className="foyer-btn secondary-glass-btn"
                title="Watch Full Film — SHADOW / III"
              >
                <Play size={14} />
                <span>Watch SHADOW / III</span>
              </button>

              <a
                href={SITE_CONFIG.imdbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="foyer-btn tertiary-btn"
                title="View Verified IMDb Credits"
              >
                <Film size={14} />
                <span>IMDb Profile</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Right Column: Original Filmmaker Identity Portrait */}
          <div className="foyer-portrait-frame">
            <div className="portrait-glass-backdrop" />

            {/* Portrait Mode Switcher */}
            <div className="portrait-mode-switcher font-mono">
              <button
                type="button"
                onClick={() => setPortraitMode("location")}
                className={`switcher-pill ${portraitMode === "location" ? "active" : ""}`}
              >
                <Camera size={12} />
                <span>Filmmaker Identity</span>
              </button>
              <button
                type="button"
                onClick={() => setPortraitMode("clean")}
                className={`switcher-pill ${portraitMode === "clean" ? "active" : ""}`}
              >
                <User size={12} />
                <span>Studio Portrait</span>
              </button>
            </div>

            <div className="portrait-image-wrapper">
              <img
                src={
                  portraitMode === "location"
                    ? SITE_CONFIG.filmmakerLocationImage
                    : SITE_CONFIG.cleanPortraitImage
                }
                alt={`Zeehad Haque — ${
                  portraitMode === "location"
                    ? "Filmmaker Identity On Location"
                    : "Studio Portrait"
                }`}
                className="portrait-image"
                loading="eager"
              />
              <div className="portrait-shimmer" />
            </div>

            <div className="portrait-telemetry-tag font-mono">
              <span>
                {portraitMode === "location"
                  ? "FIG. 01 — FILMMAKER IDENTITY (LOCATION SCOUT)"
                  : "FIG. 02 — STUDIO STUDY (SHA-256)"}
              </span>
              <span>VERIFIED AUTEUR</span>
            </div>
          </div>
        </div>

        {/* Scroll Journey Indicator */}
        <div className="scroll-indicator-container">
          <button type="button" onClick={onEnter} className="scroll-indicator-btn">
            <span className="scroll-pill-text font-mono">CONTINUOUS CAMERA TRANSIT</span>
            <div className="scroll-arrow-pulse">
              <ChevronDown size={18} />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
