import { useState } from "react";
import { Film, Play, Clock, ExternalLink, Sparkles } from "lucide-react";
import { videoArchive, type VideoRecord } from "../../data/videoArchive";

interface ScreeningHallProps {
  onSelectVideo: (video: VideoRecord) => void;
}

export function ScreeningHall({ onSelectVideo }: ScreeningHallProps) {
  const [filter, setFilter] = useState<"all" | "films" | "trailers" | "shorts">("all");

  const filteredVideos = videoArchive.filter((v) => {
    if (filter === "films") return v.contentType === "Full Film" || v.contentType === "Released Short Film" || v.contentType === "Part 1" || v.contentType === "Part 2";
    if (filter === "trailers") return v.contentType === "Trailer" || v.contentType === "Teaser" || v.contentType === "Announcement" || v.contentType === "Title Teaser";
    if (filter === "shorts") return v.contentType === "YouTube Shorts" || v.isShort;
    return true;
  });

  return (
    <section id="screenings" className="castle-section screening-hall-section">
      <div className="section-header-block">
        <div className="section-pill">
          <Film size={13} />
          <span>CHAMBER 03 // IMPERIAL SCREENING HALL & VAULT</span>
        </div>
        <h2 className="section-title">The Complete Video Archive</h2>
        <p className="section-subtitle">
          All eight verified cinematic works, trailers, and teasers. Streamed natively in
          high fidelity with original titles, verified genres, and official artwork.
        </p>

        {/* Filter Tabs */}
        <div className="screening-filter-tabs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`filter-tab ${filter === "all" ? "active" : ""}`}
          >
            All Works ({videoArchive.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("films")}
            className={`filter-tab ${filter === "films" ? "active" : ""}`}
          >
            Short Films (3)
          </button>
          <button
            type="button"
            onClick={() => setFilter("trailers")}
            className={`filter-tab ${filter === "trailers" ? "active" : ""}`}
          >
            Trailers & Teasers (4)
          </button>
          <button
            type="button"
            onClick={() => setFilter("shorts")}
            className={`filter-tab ${filter === "shorts" ? "active" : ""}`}
          >
            Short-Form (1)
          </button>
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="video-cards-grid">
        {filteredVideos.map((item, idx) => (
          <article
            key={item.id}
            className={`video-card ${item.isShort ? "short-card" : ""}`}
            onClick={() => onSelectVideo(item)}
          >
            <div className="video-card-thumb-frame">
              <img
                src={item.thumbnail}
                alt={item.originalTitle}
                className="video-thumb-img"
                loading="lazy"
                onError={(e) => {
                  // Fallback to official YouTube CDN thumbnail if local file not found
                  const img = e.currentTarget;
                  if (img.src !== item.officialThumbUrl) {
                    img.src = item.officialThumbUrl;
                  }
                }}
              />
              <div className="thumb-vignette" />

              {/* Play Overlay */}
              <div className="thumb-play-overlay">
                <div className="play-icon-disc">
                  <Play size={20} fill="currentColor" />
                </div>
                <span className="screen-now-text font-mono">SCREEN NOW</span>
              </div>

              {/* Corner Badges */}
              <div className="thumb-badge-top-left">
                <span className="format-badge">{item.contentType}</span>
              </div>
              <div className="thumb-badge-bottom-right">
                <span className="duration-badge font-mono">
                  <Clock size={11} />
                  <span>{item.runtime}</span>
                </span>
              </div>
            </div>

            {/* Video Metadata Card Body */}
            <div className="video-card-body">
              <div className="card-top-meta">
                <span className="card-genre font-mono">{item.genre}</span>
                <span className="card-year font-mono">{item.year}</span>
              </div>

              <h3 className="card-display-title">{item.displayTitle}</h3>

              <p className="card-original-title" title={item.originalTitle}>
                <span className="sub-tag">YouTube: </span>
                {item.originalTitle}
              </p>

              <p className="card-synopsis">{item.description}</p>

              <div className="card-actions-footer">
                <button
                  type="button"
                  className="card-screen-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectVideo(item);
                  }}
                >
                  <Sparkles size={13} />
                  <span>Watch in Castle</span>
                </button>

                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-ext-btn"
                  onClick={(e) => e.stopPropagation()}
                  title="Open on YouTube"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
