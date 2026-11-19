import React, { useState } from "react";
import { siteIdentity } from "../data/site";
import { SITE_CONFIG } from "../data/siteConfig";
import { linkRegistry } from "../data/linkRegistry";

interface ContactModalProps {
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("submitting");
    setStatusMsg("Transmitting dispatch to Director...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setStatusMsg("Transmission received. Zeehad will review your dispatch promptly.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        setStatus("error");
        setStatusMsg(data.message || "Transmission interrupted. Please reach out directly via WhatsApp or Email.");
      }
    } catch {
      setStatus("error");
      setStatusMsg("Direct transmission offline. Please use WhatsApp or Email below.");
    }
  };

  const exactCredentialLinks = [
    { name: "IMDb Profile", url: "https://www.imdb.com/user/p.gtnf5csbffkwzrbmsvkfa2pssm" },
    { name: "FilmFreeway", url: "https://www.wikidata.org/wiki/Q142020060" },
    { name: "Wikidata", url: "https://www.wikidata.org/wiki/Q142020060" },
    { name: "Letterboxd", url: "https://boxd.it/onh0F" },
    { name: "TMDB", url: "https://www.themoviedb.org/movie/1819480-shadow-iii" },
    { name: "Instagram", url: "https://www.instagram.com/heyyfalgun/" },
    { name: "Live Website", url: "https://zeehadhaque.zeehadhaque.workers.dev" },
  ];

  return (
    <div className="contact-modal-content">
      {/* Header */}
      <div className="contact-modal-header">
        <div className="contact-modal-header-meta">
          <span className="modal-kicker font-mono">
            COMMUNICATIONS TERMINAL // DIRECTORS SUITE
          </span>
          <h2 className="contact-modal-title">Direct Inquiries &amp; Collaboration</h2>
        </div>
        <button
          type="button"
          className="glass-btn contact-close-btn"
          onClick={onClose}
          aria-label="Close Contact"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span>CLOSE</span>
        </button>
      </div>

      <div className="contact-modal-grid">
        {/* Left Column: Filmmaker Identity Card & Direct Channels */}
        <div className="contact-identity-col">
          <div className="contact-photo-card glass-panel">
            <img
              src={SITE_CONFIG.filmmakerLocationImage}
              alt="Zeehad Haque — Filmmaker Identity On Location"
              className="contact-director-img"
              loading="lazy"
            />
            <div className="contact-photo-caption font-mono">
              <span>ZEEHAD HAQUE // LOCATION SCOUTING</span>
              <span className="photo-loc">GAZIPUR · DHAKA</span>
            </div>
          </div>

          <div className="contact-channels glass-panel">
            <h3 className="channels-title font-mono">DIRECT TRANSMISSION CHANNELS</h3>
            <div className="channel-actions">
              <a
                href={`https://wa.me/${siteIdentity.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-btn channel-btn channel-wa"
              >
                <span>WhatsApp: {siteIdentity.whatsapp} ↗</span>
              </a>
              <a
                href={`mailto:${siteIdentity.email}`}
                className="glass-btn channel-btn channel-mail"
              >
                <span>Email: {siteIdentity.email} ↗</span>
              </a>
            </div>
            <div className="channel-location font-mono">
              <span>STUDIO BASE:</span>
              <p>{siteIdentity.location}</p>
            </div>
          </div>

          {/* Verified Industry Credentialing & Profiles */}
          <div className="contact-social-pills">
            {exactCredentialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-link font-mono"
              >
                {link.name} ↗
              </a>
            ))}
          </div>
        </div>

        {/* Right Column: Direct Transmission Form */}
        <div className="contact-form-col glass-panel">
          <h3 className="form-heading font-mono">TRANSMIT A DIRECT MESSAGE</h3>
          <p className="form-subtext">
            For film productions, co-productions, script readings, commercial directing, or
            curriculum inquiries.
          </p>

          <form className="contact-dispatch-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="font-mono">
                NAME / STUDIO <span className="req">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                className="contact-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name or production house"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="font-mono">
                EMAIL ADDRESS <span className="req">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                className="contact-field"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@production.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject" className="font-mono">
                SUBJECT / NATURE OF INQUIRY
              </label>
              <input
                id="subject"
                type="text"
                className="contact-field"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Short Film Collaboration / Academy Inquiry"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="font-mono">
                MESSAGE / DISPATCH <span className="req">*</span>
              </label>
              <textarea
                id="message"
                required
                rows={5}
                className="contact-field contact-textarea"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Detail your project timeline, visual goals, or question..."
              />
            </div>

            {statusMsg && (
              <div
                className={`contact-status-banner font-mono ${
                  status === "success" ? "is-success" : status === "error" ? "is-error" : ""
                }`}
              >
                {statusMsg}
              </div>
            )}

            <button
              type="submit"
              className="glass-btn contact-submit-btn"
              disabled={status === "submitting"}
            >
              <span>{status === "submitting" ? "TRANSMITTING..." : "SEND DISPATCH ↗"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
