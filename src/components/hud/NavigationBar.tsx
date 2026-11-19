import { useState } from "react";
import { Film, BookOpen, Sparkles, Send, Lock, Menu, X } from "lucide-react";
import { SITE_CONFIG } from "../../data/siteConfig";

interface NavigationBarProps {
  activeStage: number;
  onNavigate: (sectionId: string) => void;
}

export function NavigationBar({ activeStage, onNavigate }: NavigationBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "foyer", label: "Foyer", stage: 0 },
    { id: "monoliths", label: "Monoliths", stage: 1 },
    { id: "screenings", label: "Screenings", stage: 2 },
    { id: "directors-suite", label: "Suite & Room", stage: 3 },
    { id: "institute", label: "Institute", stage: 4 },
    { id: "zee-core", label: "ZEE AI", stage: 5 },
    { id: "contact", label: "Contact", stage: 6 },
  ];

  const handleLinkClick = (id: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Brand Monogram */}
        <button
          type="button"
          onClick={() => handleLinkClick("foyer")}
          className="brand-monogram"
          aria-label="Return to Foyer"
        >
          <span className="brand-initials">ZH</span>
          <div className="brand-text">
            <span className="brand-name">{SITE_CONFIG.name}</span>
            <span className="brand-discipline">AUTEUR · DIRECTOR</span>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <nav className="desktop-navigation" aria-label="Main Navigation">
          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive = activeStage === item.stage;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleLinkClick(item.id)}
                    className={`nav-link ${isActive ? "active" : ""}`}
                  >
                    <span className="nav-dot" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Action Pills */}
        <div className="header-actions">
          <a
            href={SITE_CONFIG.imdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="action-pill imdb-pill"
            title="IMDb Profile — SHADOW / III"
          >
            <Film size={13} />
            <span>IMDb</span>
          </a>

          <button
            type="button"
            onClick={() => handleLinkClick("institute")}
            className="action-pill academy-pill"
            title="Filmmaking Institute Curriculum"
          >
            <BookOpen size={13} />
            <span>Institute</span>
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick("zee-core")}
            className="action-pill ai-pill"
            title="Summon ZEE AI Core"
          >
            <Sparkles size={13} />
            <span>ZEE AI</span>
          </button>

          <a
            href="/inbox"
            className="action-pill inbox-pill"
            title="Private Production Inbox"
          >
            <Lock size={12} />
            <span>Inbox</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer">
          <ul className="mobile-nav-list">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleLinkClick(item.id)}
                  className={`mobile-nav-link ${activeStage === item.stage ? "active" : ""}`}
                >
                  <span className="mono-num">0{item.stage + 1}</span>
                  {item.label}
                </button>
              </li>
            ))}
            <li className="mobile-nav-divider" />
            <li>
              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-nav-link external"
              >
                <Send size={15} />
                WhatsApp Inquiry
              </a>
            </li>
            <li>
              <a href="/inbox" className="mobile-nav-link external">
                <Lock size={15} />
                Private Inbox
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
