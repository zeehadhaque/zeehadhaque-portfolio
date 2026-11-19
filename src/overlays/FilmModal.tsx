import React, { useState } from "react";
import { videoArchive, type VideoRecord } from "../data/videoArchive";
import { linkRegistry } from "../data/linkRegistry";

interface FilmModalProps {
  filmKey?: "shadow" | "archive";
  onClose: () => void;
}

export const FilmModal: React.FC<FilmModalProps> = ({ filmKey = "shadow", onClose }) => {
  // Default to SHADOW / III (2026)
  const initialVideoId = "ZSttExMBavg";
  const [activeVideo, setActiveVideo] = useState<VideoRecord>(() => {
    return (
      videoArchive.find((v) => v.videoId === initialVideoId) ??
      videoArchive[0]
    );
  });

  const imdbLink = linkRegistry.find((l) => l.id === "film-shadow-iii-imdb");
  const letterboxdLink = linkRegistry.find((l) => l.id === "social-letterboxd");
  const filmfreewayLink = linkRegistry.find((l) => l.id === "social-filmfreeway");

  return (
    <div className="film-modal-content">
      {/* Modal Top Bar */}
      <div className="film-modal-header">
        <div className="film-modal-header-meta">
          <span className="modal-kicker font-mono">
            CINEMATIC SCREENING VAULT // {activeVideo.year}
          </span>
          <h2 className="film-modal-title">{activeVideo.displayTitle}</h2>
        </div>
        <button
          type="button"
          className="glass-btn film-close-btn"
          onClick={onClose}
          aria-label="Close Screening"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span>CLOSE</span>
        </button>
      </div>

      {/* 16:9 Cinema Player Embed */}
      <div className="film-player-wrapper">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={activeVideo.displayTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="film-iframe"
        />
      </div>

      {/* Film Dossier & Specs */}
      <div className="film-details-grid">
        <div className="film-info-main">
          <p className="film-tagline font-display">&ldquo;{activeVideo.genre}&rdquo;</p>
          <p className="film-synopsis">{activeVideo.description}</p>

          {/* External Verification Links */}
          <div className="film-external-links">
            <a
              href={`https://www.youtube.com/watch?v=${activeVideo.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-btn film-link-btn"
            >
              <span>Watch on YouTube ↗</span>
            </a>
            {activeVideo.videoId === "ZSttExMBavg" && imdbLink && (
              <a
                href={imdbLink.exactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-btn film-link-btn"
              >
                <span>IMDb Verification ↗</span>
              </a>
            )}
            {letterboxdLink && (
              <a
                href={letterboxdLink.exactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-btn film-link-btn"
              >
                <span>Letterboxd ↗</span>
              </a>
            )}
            {filmfreewayLink && (
              <a
                href={filmfreewayLink.exactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-btn film-link-btn"
              >
                <span>FilmFreeway ↗</span>
              </a>
            )}
          </div>
        </div>

        {/* Technical Production Matrix */}
        <div className="film-specs-panel glass-panel">
          <h3 className="specs-title font-mono">TECHNICAL SPECS</h3>
          <dl className="specs-list font-mono">
            <div className="spec-row">
              <dt>RUNTIME</dt>
              <dd>{activeVideo.runtime}</dd>
            </div>
            <div className="spec-row">
              <dt>YEAR</dt>
              <dd>{activeVideo.year}</dd>
            </div>
            <div className="spec-row">
              <dt>STATUS</dt>
              <dd>{activeVideo.projectStatus}</dd>
            </div>
            <div className="spec-row">
              <dt>TYPE</dt>
              <dd>{activeVideo.contentType}</dd>
            </div>
            <div className="spec-row">
              <dt>CAMERA</dt>
              <dd>Blackmagic Camera · 4K</dd>
            </div>
            <div className="spec-row">
              <dt>COLOR GRADE</dt>
              <dd>DaVinci Resolve Studio</dd>
            </div>
            <div className="spec-row">
              <dt>SOUND DESIGN</dt>
              <dd>Spatial Binaural · 48kHz</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Complete 8-Film Archive Switcher */}
      <div className="film-archive-browser">
        <h3 className="archive-browser-title font-mono">
          COMPLETE VERIFIED FILMOGRAPHY ARCHIVE (8 TITLES)
        </h3>
        <div className="archive-thumb-grid">
          {videoArchive.map((film) => {
            const isCurrent = film.id === activeVideo.id;
            return (
              <button
                key={film.id}
                type="button"
                className={`archive-thumb-card ${isCurrent ? "is-active" : ""}`}
                onClick={() => setActiveVideo(film)}
              >
                <div className="archive-thumb-img-wrapper">
                  <img
                    src={film.thumbnail}
                    alt={film.displayTitle}
                    className="archive-thumb-img"
                    loading="lazy"
                  />
                  <span className="archive-thumb-duration font-mono">{film.runtime}</span>
                </div>
                <div className="archive-thumb-info">
                  <span className="archive-thumb-title">{film.displayTitle}</span>
                  <span className="archive-thumb-meta font-mono">
                    {film.year} · {film.contentType}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
