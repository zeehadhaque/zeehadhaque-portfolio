import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ExternalLink,
  Film,
  MessageSquare,
  Play,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import {
  filmProjects,
  futureProjects,
  identityPortraitAsset,
  portraitAsset,
  siteIdentity,
} from "../../data/site";
import { isSoundMuted, toggleSpatialAudio } from "../../utils/spatialAudio";
import { DeferredAcademy } from "../academy/DeferredAcademy";

interface IglooExperienceProps {
  scrollProgress: number;
  onScrollToStage: (progress: number) => void;
  onSummonZee: () => void;
}

const STAGES = [
  { id: "stage-01", number: "01", label: "AWAKENING", p: 0.0 },
  { id: "stage-02", number: "02", label: "TRANSIT", p: 0.2 },
  { id: "stage-03", number: "03", label: "RING GATE", p: 0.35 },
  { id: "stage-04", number: "04", label: "MONOLITH I", p: 0.5 },
  { id: "stage-05", number: "05", label: "MONOLITH II", p: 0.7 },
  { id: "stage-06", number: "06", label: "TERMINAL", p: 0.86 },
  { id: "stage-07", number: "07", label: "EXIT", p: 0.98 },
];

export function IglooExperience({
  scrollProgress,
  onScrollToStage,
  onSummonZee,
}: IglooExperienceProps) {
  const [soundActive, setSoundActive] = useState(() => !isSoundMuted());
  const [activeModal, setActiveModal] = useState<
    "screening" | "institute" | "contact" | "archive" | null
  >(null);
  const [selectedFilmId, setSelectedFilmId] = useState<string>("film-03"); // Default: SHADOW / III

  // Listen to 3D raycasting interactions from CastleUniverse
  useEffect(() => {
    const onScreenFilm = (e: Event) => {
      const custom = e as CustomEvent<{ filmId?: string }>;
      if (custom.detail?.filmId) {
        setSelectedFilmId(custom.detail.filmId);
      }
      setActiveModal("screening");
    };

    const onOpenInstitute = () => setActiveModal("institute");
    const onOpenContact = () => setActiveModal("contact");
    const onOpenArchive = () => setActiveModal("archive");

    window.addEventListener("palace:screen-film", onScreenFilm);
    window.addEventListener("palace:open-institute", onOpenInstitute);
    window.addEventListener("palace:open-contact", onOpenContact);
    window.addEventListener("palace:open-archive", onOpenArchive);

    return () => {
      window.removeEventListener("palace:screen-film", onScreenFilm);
      window.removeEventListener("palace:open-institute", onOpenInstitute);
      window.removeEventListener("palace:open-contact", onOpenContact);
      window.removeEventListener("palace:open-archive", onOpenArchive);
    };
  }, []);

  // Keyboard shortcut to close modals
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleToggleSound = () => {
    const muted = toggleSpatialAudio();
    setSoundActive(!muted);
  };

  // Determine active stage index
  const activeStageIndex = useMemo(() => {
    if (scrollProgress < 0.15) return 0;
    if (scrollProgress < 0.28) return 1;
    if (scrollProgress < 0.42) return 2;
    if (scrollProgress < 0.6) return 3;
    if (scrollProgress < 0.8) return 4;
    if (scrollProgress < 0.94) return 5;
    return 6;
  }, [scrollProgress]);

  const activeStage = STAGES[activeStageIndex];

  // Currently selected film meta
  const currentFilm = useMemo(() => {
    const found = filmProjects.find((f) => f.id === selectedFilmId);
    return found ?? filmProjects[2]; // fallback to SHADOW / III
  }, [selectedFilmId]);

  const currentFilmMeta = useMemo(() => {
    if (currentFilm.id === "film-03") {
      return {
        title: "SHADOW / III",
        category: "Psychological Thriller · Short Film",
        description:
          "A psychological and supernatural suspense experiment built around visual silence, repetition, loops and uncertainty.",
        aspectRatio: "2.39:1 Anamorphic",
        camera: "Redmi Note 14 Pro+ 5G · Blackmagic Camera",
        finishing: "DaVinci Resolve · CapCut",
      };
    }
    if (currentFilm.id === "film-02") {
      return {
        title: "CHAKRA",
        category: "Silent Thriller · Short Film",
        description:
          "A no-dialogue visual narrative using stillness, location transitions and match-cut thinking to carry the story.",
        aspectRatio: "2.39:1 Anamorphic",
        camera: "Redmi Note 14 Pro+ 5G · Blackmagic Camera",
        finishing: "DaVinci Resolve · CapCut",
      };
    }
    if (currentFilm.id === "film-08") {
      return {
        title: "DON'T GO THERE",
        category: "Mystery · Survival · Psychological Suspense",
        description: "A suspense-driven project introduced through its official cinematic teaser.",
        aspectRatio: "2.39:1 Anamorphic",
        camera: "Redmi Note 14 Pro+ 5G · Blackmagic Camera",
        finishing: "DaVinci Resolve",
      };
    }
    return {
      title: currentFilm.title || `Vault Film // ${currentFilm.id.toUpperCase()}`,
      category: "Cinematic Short · Visual Narrative",
      description:
        "An independent auteur practice piece shaped by visual silence, available light and atmospheric tension.",
      aspectRatio: "2.39:1 Anamorphic",
      camera: "Redmi Note 14 Pro+ 5G",
      finishing: "DaVinci Resolve",
    };
  }, [currentFilm]);

  const progressPercentage = Math.round(scrollProgress * 100);

  return (
    <div className="igloo-universe-root">
      {/* 01. Virtual Scroll Track for 7-Stage Camera Travel */}
      <div className="igloo-scroll-track" aria-hidden="true">
        {STAGES.map((st) => (
          <div
            key={st.id}
            id={st.id}
            className="igloo-scroll-anchor"
            style={{ top: `${st.p * 100}%` }}
          />
        ))}
      </div>

      {/* 02. Persistent Cyber-Brutalist HUD Overlay */}
      <div className="igloo-hud-overlay">
        {/* Top Navigation Bar */}
        <header className="igloo-hud-top">
          <div className="igloo-hud-brand">
            <h1 className="igloo-hud-brand__title">ZEEHAD HAQUE</h1>
            <div className="igloo-hud-brand__meta">
              // Copyright © 2026 Independent Practice · Gazipur, Bangladesh
            </div>
          </div>

          {/* 7-Stage Segment Navigator */}
          <nav className="igloo-hud-stages" aria-label="Stages">
            {STAGES.map((stage, idx) => (
              <button
                key={stage.id}
                type="button"
                className={`igloo-hud-stage-btn ${
                  activeStageIndex === idx ? "is-active" : ""
                }`}
                onClick={() => onScrollToStage(stage.p)}
              >
                {stage.number} {stage.label}
              </button>
            ))}
          </nav>

          {/* Top-Right Control Buttons */}
          <div className="igloo-hud-actions">
            <button
              type="button"
              className="igloo-hud-action-btn"
              onClick={handleToggleSound}
              aria-label="Toggle spatial sound"
            >
              {soundActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span>{soundActive ? "Sound: On" : "Sound: Off"}</span>
            </button>

            <button
              type="button"
              className="igloo-hud-action-btn"
              onClick={() => setActiveModal("archive")}
            >
              <Film size={13} />
              <span>Archive</span>
            </button>

            <button
              type="button"
              className="igloo-hud-action-btn"
              onClick={onSummonZee}
            >
              <Sparkles size={13} />
              <span>ZEE AI</span>
            </button>
          </div>
        </header>

        {/* Fixed Editorial Manifesto Block (Top-Right) */}
        <div className="igloo-manifesto-block" aria-label="Manifesto">
          <span className="igloo-manifesto-tag">////// Manifesto</span>
          <p className="igloo-manifesto-text">
            Cinema begins where words fall silent. An independent auteur practice
            in psychological suspense, visual silence, and atmospheric composition.
          </p>
        </div>

        {/* Bottom HUD: Coordinates & Dynamic Stage Telemetry */}
        <footer className="igloo-hud-bottom">
          <div className="igloo-hud-bottom-left">
            {scrollProgress < 0.08 && (
              <div className="igloo-scroll-directive">
                Scroll down to discover.
              </div>
            )}
            <div className="igloo-coordinates">
              23°59'N · 90°25'E // AUTEUR CODEX · REDMI 14 PRO+ 5G
            </div>
          </div>

          <div className="igloo-hud-bottom-right">
            <div className="igloo-telemetry-stage">
              {activeStage.number}/07 // {activeStage.label}
            </div>
            <div className="igloo-telemetry-metrics">
              TEMP 28.40 // -13.22 · PROGRESS [ {progressPercentage}% ]
            </div>
          </div>
        </footer>
      </div>

      {/* 03. Interactive Stage Callouts (Click Monolith / Dais Prompts) */}
      {activeStageIndex === 3 && !activeModal && (
        <div className="igloo-stage-callout">
          <button
            type="button"
            className="igloo-callout-btn"
            onClick={() => {
              setSelectedFilmId("film-03");
              setActiveModal("screening");
            }}
          >
            <Play size={14} fill="#ffffff" />
            <span>Screen Monolith I: SHADOW / III</span>
          </button>
        </div>
      )}

      {activeStageIndex === 4 && !activeModal && (
        <div className="igloo-stage-callout">
          <button
            type="button"
            className="igloo-callout-btn"
            onClick={() => {
              setSelectedFilmId("film-02");
              setActiveModal("screening");
            }}
          >
            <Play size={14} fill="#ffffff" />
            <span>Screen Monolith II: CHAKRA</span>
          </button>
        </div>
      )}

      {activeStageIndex === 5 && !activeModal && (
        <div className="igloo-stage-callout">
          <button
            type="button"
            className="igloo-callout-btn"
            onClick={() => setActiveModal("institute")}
          >
            <BookOpen size={14} />
            <span>Open 30-Day Filmmaking Institute</span>
          </button>
        </div>
      )}

      {/* 04. Modal 01: IMAX Screening Room Modal */}
      {activeModal === "screening" && (
        <div
          className="igloo-modal-backdrop"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="igloo-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="igloo-modal-header">
              <h2 className="igloo-modal-title">
                IMAX PREMIERE // {currentFilmMeta.title}
              </h2>
              <button
                type="button"
                className="igloo-modal-close-btn"
                onClick={() => setActiveModal(null)}
                aria-label="Close screening room"
              >
                <X size={18} />
              </button>
            </div>

            <div className="igloo-modal-body">
              <div className="igloo-video-player-frame">
                <iframe
                  title={currentFilmMeta.title}
                  src={`https://www.youtube.com/embed/${currentFilm.videoId}?autoplay=1&rel=0&modestbranding=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="igloo-screening-details">
                <div>
                  <p className="igloo-screening-desc">
                    {currentFilmMeta.description}
                  </p>
                  <div className="igloo-screening-credits">
                    SPEC: {currentFilmMeta.aspectRatio} · CAMERA: {currentFilmMeta.camera} · FINISHING: {currentFilmMeta.finishing}
                  </div>
                  <div style={{ marginTop: "1rem" }}>
                    <a
                      href={currentFilm.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="igloo-contact-action"
                    >
                      <span>Open on YouTube</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                <div className="igloo-screening-playlist">
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.68rem",
                      color: "#c6a875",
                      letterSpacing: "0.14em",
                      marginBottom: "0.3rem",
                    }}
                  >
                    SELECT REEL (08)
                  </div>
                  {filmProjects.map((f, i) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`igloo-playlist-btn ${
                        selectedFilmId === f.id ? "is-active" : ""
                      }`}
                      onClick={() => setSelectedFilmId(f.id)}
                    >
                      <span>
                        0{i + 1} // {f.title || (i === 1 ? "CHAKRA" : i === 2 ? "SHADOW / III" : `REEL 0${i + 1}`)}
                      </span>
                      <Play size={10} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 05. Modal 02: Filmmaking Institute Modal */}
      {activeModal === "institute" && (
        <div
          className="igloo-modal-backdrop"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="igloo-modal-card"
            style={{ maxWidth: "1200px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="igloo-modal-header">
              <h2 className="igloo-modal-title">
                THE FILMMAKING INSTITUTE // 30-DAY CONSERVATORY
              </h2>
              <button
                type="button"
                className="igloo-modal-close-btn"
                onClick={() => setActiveModal(null)}
                aria-label="Close institute"
              >
                <X size={18} />
              </button>
            </div>
            <div className="igloo-modal-body">
              <DeferredAcademy />
            </div>
          </div>
        </div>
      )}

      {/* 06. Modal 03: Contact Sanctuary / Grand Exit Modal */}
      {activeModal === "contact" && (
        <div
          className="igloo-modal-backdrop"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="igloo-modal-card"
            style={{ maxWidth: "780px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="igloo-modal-header">
              <h2 className="igloo-modal-title">
                GRAND EXIT // CORRESPONDENCE SANCTUARY
              </h2>
              <button
                type="button"
                className="igloo-modal-close-btn"
                onClick={() => setActiveModal(null)}
                aria-label="Close contact"
              >
                <X size={18} />
              </button>
            </div>
            <div className="igloo-modal-body">
              <div className="igloo-contact-grid">
                <div className="igloo-contact-direct">
                  <div className="igloo-contact-item">
                    <span className="igloo-contact-label">WhatsApp Studio Line</span>
                    <span className="igloo-contact-value">{siteIdentity.whatsapp}</span>
                    <a
                      href={`https://wa.me/8801629851155`}
                      target="_blank"
                      rel="noreferrer"
                      className="igloo-contact-action"
                    >
                      <span>Direct Message</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  <div className="igloo-contact-item">
                    <span className="igloo-contact-label">Direct Studio Email</span>
                    <span className="igloo-contact-value">{siteIdentity.email}</span>
                    <a
                      href={`mailto:${siteIdentity.email}`}
                      className="igloo-contact-action"
                    >
                      <span>Compose Transmission</span>
                      <Send size={12} />
                    </a>
                  </div>

                  <div className="igloo-contact-item">
                    <span className="igloo-contact-label">Production Base</span>
                    <span className="igloo-contact-value">{siteIdentity.location}</span>
                  </div>
                </div>

                <form
                  className="igloo-contact-direct"
                  onSubmit={(e) => {
                    e.preventDefault();
                    window.location.href = `mailto:${siteIdentity.email}?subject=Production Inquiry&body=Hello Zeehad,`;
                  }}
                >
                  <div className="igloo-contact-item">
                    <span className="igloo-contact-label">Quick Inquiries</span>
                    <p style={{ fontSize: "0.82rem", lineHeight: "1.5", color: "rgba(220, 235, 255, 0.8)", margin: "0 0 1rem" }}>
                      Open for directing assignments, narrative cinematography, psychological thriller screenplays, and international collaborations.
                    </p>
                    <button
                      type="submit"
                      className="igloo-callout-btn"
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      <Send size={14} />
                      <span>Transmit Message</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 07. Modal 04: Full Archive & Director Codex Drawer */}
      {activeModal === "archive" && (
        <div
          className="igloo-modal-backdrop"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="igloo-drawer-root"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="igloo-modal-header">
              <h2 className="igloo-modal-title">AUTEUR ARCHIVE & CODEX</h2>
              <button
                type="button"
                className="igloo-modal-close-btn"
                onClick={() => setActiveModal(null)}
                aria-label="Close archive"
              >
                <X size={18} />
              </button>
            </div>

            <div className="igloo-drawer-body">
              {/* Bio & Portrait */}
              <div className="igloo-auteur-bio-card">
                <img
                  src={portraitAsset}
                  alt={siteIdentity.name}
                  className="igloo-auteur-photo"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = identityPortraitAsset;
                  }}
                />
                <div className="igloo-auteur-bio-text">
                  <h3 className="igloo-auteur-name">{siteIdentity.name}</h3>
                  <span className="igloo-auteur-roles">{siteIdentity.roles}</span>
                  <p style={{ fontSize: "0.8rem", lineHeight: "1.55", color: "rgba(220, 235, 255, 0.85)", margin: 0 }}>
                    {siteIdentity.biography}
                  </p>
                </div>
              </div>

              {/* Working Method & Stack */}
              <div>
                <span className="igloo-manifesto-tag">// Working Method</span>
                <p style={{ fontSize: "0.82rem", lineHeight: "1.6", color: "rgba(220, 235, 255, 0.85)" }}>
                  {siteIdentity.workingMethod}
                </p>
                <div style={{ marginTop: "0.8rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {siteIdentity.toolsAndCraft.map((tool) => (
                    <span
                      key={tool}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.65rem",
                        padding: "0.25rem 0.6rem",
                        background: "rgba(125, 187, 255, 0.12)",
                        border: "1px solid rgba(125, 187, 255, 0.2)",
                        borderRadius: "3px",
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Future Slate */}
              <div>
                <span className="igloo-manifesto-tag">// Upcoming Slate & Screenplays</span>
                <div className="igloo-slate-list">
                  {futureProjects.map((fp) => (
                    <div key={fp.title} className="igloo-slate-item">
                      <span className="igloo-slate-title">{fp.title}</span>
                      <span className="igloo-slate-genre">{fp.genre}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
