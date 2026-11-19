import { useState, type FormEvent } from "react";
import {
  Mail,
  Send,
  Film,
  ArrowUp,
  CheckCircle,
  ExternalLink,
  MapPin,
  Lock,
} from "lucide-react";
import { SITE_CONFIG } from "../../data/siteConfig";

interface GrandExitProps {
  onReturnToTop: () => void;
}

export function GrandExit({ onReturnToTop }: GrandExitProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSent(true);
  };

  return (
    <footer id="contact" className="castle-section grand-exit-section">
      <div className="section-header-block">
        <div className="section-pill gold-pill">
          <Mail size={13} />
          <span>CHAMBER 06 // THE GRAND EXIT &amp; TRANSMISSION PORTAL</span>
        </div>
        <h2 className="section-title">Open Communications &amp; Collaborations</h2>
        <p className="section-subtitle">
          Direct lines to Zeehad Haque for directing, screenwriting commissions, cinematography,
          and institutional partnerships.
        </p>
      </div>

      <div className="exit-layout-grid">
        {/* Direct Channels Column */}
        <div className="direct-channels-column">
          <h3 className="column-title font-mono">DIRECT TRANSMISSION CHANNELS</h3>

          <div className="channels-list">
            {/* Email Card */}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="channel-card"
              title="Send Professional Email"
            >
              <div className="channel-icon-disc">
                <Mail size={18} />
              </div>
              <div className="channel-details">
                <span className="channel-label font-mono">PROFESSIONAL EMAIL</span>
                <span className="channel-value">{SITE_CONFIG.email}</span>
              </div>
              <ExternalLink size={14} className="channel-arrow" />
            </a>

            {/* WhatsApp Card */}
            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="channel-card"
              title="Open WhatsApp Conversation"
            >
              <div className="channel-icon-disc whatsapp-disc">
                <Send size={18} />
              </div>
              <div className="channel-details">
                <span className="channel-label font-mono">WHATSAPP INQUIRY</span>
                <span className="channel-value">{SITE_CONFIG.whatsappNumber}</span>
              </div>
              <ExternalLink size={14} className="channel-arrow" />
            </a>

            {/* IMDb Profile Card */}
            <a
              href={SITE_CONFIG.imdbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="channel-card"
              title="Verified IMDb Profile"
            >
              <div className="channel-icon-disc imdb-disc">
                <Film size={18} />
              </div>
              <div className="channel-details">
                <span className="channel-label font-mono">IMDb ACCREDITATION</span>
                <span className="channel-value">SHADOW / III (2026)</span>
              </div>
              <ExternalLink size={14} className="channel-arrow" />
            </a>

            {/* Current GitHub Repository */}
            <a
              href={SITE_CONFIG.githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="channel-card"
              title="Current GitHub Repository"
            >
              <div className="channel-icon-disc github-disc">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </div>
              <div className="channel-details">
                <span className="channel-label font-mono">CURRENT GITHUB REPO</span>
                <span className="channel-value">zeehadhaque/zeehaque-portfolio</span>
              </div>
              <ExternalLink size={14} className="channel-arrow" />
            </a>
          </div>

          <div className="location-pill font-mono">
            <MapPin size={13} />
            <span>STUDIO BASE: {SITE_CONFIG.location.toUpperCase()}</span>
          </div>
        </div>

        {/* Transmission Form Column */}
        <div className="transmission-form-column">
          <div className="form-card">
            <h3 className="form-card-title font-mono">DISPATCH DIRECT INQUIRY</h3>

            {isSent ? (
              <div className="form-success-box">
                <CheckCircle size={32} className="success-icon" />
                <h4>TRANSMISSION SENT</h4>
                <p>
                  Your message has been dispatched to Zeehad Haque&apos;s direct priority desk.
                  Expect a response within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSent(false);
                    setName("");
                    setEmail("");
                    setMessage("");
                  }}
                  className="reset-form-btn font-mono"
                >
                  Dispatch Another Transmission
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="exit-form">
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label font-mono">
                    YOUR FULL NAME / ENTITY
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Christopher Nolan, A24, Studio Executive"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label font-mono">
                    OFFICIAL EMAIL ADDRESS
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@production.com"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-msg" className="form-label font-mono">
                    NARRATIVE / PRODUCTION BRIEF
                  </label>
                  <textarea
                    id="contact-msg"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Outline your script inquiry, directing assignment, or festival screening request..."
                    className="form-textarea"
                  />
                </div>

                <button type="submit" className="form-submit-btn font-mono">
                  <span>DISPATCH TRANSMISSION</span>
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Return to Foyer Portal */}
      <div className="return-portal-row">
        <button
          type="button"
          onClick={onReturnToTop}
          className="return-top-btn"
          aria-label="Return to Foyer"
        >
          <ArrowUp size={16} />
          <span className="font-mono">SEAMLESS RETURN TO FOYER</span>
        </button>
      </div>

      {/* Colophon & Legal Line */}
      <div className="exit-footer-bar">
        <div className="footer-colophon font-mono">
          © {new Date().getFullYear()} {SITE_CONFIG.name}. ALL RIGHTS RESERVED.
        </div>
        <div className="footer-links">
          <a
            href="https://github.com/zeehad-haque/zeehad-portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link font-mono"
          >
            Older Repo Archive
          </a>
          <span className="sep">·</span>
          <a
            href={SITE_CONFIG.legacySiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link font-mono"
          >
            Legacy Site (Workers)
          </a>
          <span className="sep">·</span>
          <a href="/inbox" className="footer-link font-mono">
            <Lock size={11} />
            <span>Private Production Inbox</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
