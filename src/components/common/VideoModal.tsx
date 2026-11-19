import { useEffect } from "react";
import { X, ExternalLink, Film, Clock, Tag } from "lucide-react";
import type { VideoRecord } from "../../data/videoArchive";

interface VideoModalProps {
  video: VideoRecord | null;
  onClose: () => void;
}

export function VideoModal({ video, onClose }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (video) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [video, onClose]);

  if (!video) return null;

  return (
    <div className="video-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="video-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="video-modal-header">
          <div className="modal-title-group">
            <span className="modal-pill">{video.contentType}</span>
            <span className="modal-genre font-mono">{video.genre}</span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close screening modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Native Responsive Video Embed */}
        <div className="video-embed-wrapper">
          <iframe
            src={`${video.embedUrl}&autoplay=1`}
            title={video.originalTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="video-iframe"
          />
        </div>

        {/* Video Info Panel */}
        <div className="video-modal-info">
          <div className="modal-meta-row">
            <h3 className="modal-film-title">{video.displayTitle}</h3>
            <div className="modal-timing">
              <span className="timing-item">
                <Clock size={14} />
                <span>{video.runtime}</span>
              </span>
              <span className="timing-item">
                <Film size={14} />
                <span>{video.year}</span>
              </span>
              <span className="timing-item">
                <Tag size={14} />
                <span>{video.projectStatus}</span>
              </span>
            </div>
          </div>

          <p className="modal-original-title">
            <span className="label">Original YouTube Title: </span>
            <span className="val">{video.originalTitle}</span>
          </p>

          <p className="modal-description">{video.description}</p>

          <div className="modal-actions-row">
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn youtube-direct-btn"
            >
              <span>Watch on YouTube</span>
              <ExternalLink size={14} />
            </a>
            <button
              type="button"
              className="action-btn dismiss-btn"
              onClick={onClose}
            >
              Return to Screening Hall
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
