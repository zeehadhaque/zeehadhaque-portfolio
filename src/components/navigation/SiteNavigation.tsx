import { useEffect, useRef } from "react";
import { navigationItems } from "../../data/site";

interface SiteNavigationProps {
  activeSection: string;
  theme: "dark" | "light";
  onThemeToggle: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function SiteNavigation({ activeSection, theme, onThemeToggle, isOpen, onToggle, onClose }: SiteNavigationProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    firstLinkRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleNavigate = () => onClose();

  return (
    <header className="main-navigation">
      <a className="main-navigation__brand" href="#home" onClick={handleNavigate} aria-label="Zeehad Haque home">
        <span className="main-navigation__monogram" aria-hidden="true">ZH</span>
        <span className="main-navigation__brand-name">Zeehad Haque</span>
      </a>

      <nav className="main-navigation__desktop" aria-label="Primary navigation">
        {navigationItems.map((item) => (
          <a
            key={item.href}
            className={activeSection === item.href.slice(1) ? "is-active" : ""}
            href={item.href}
            aria-current={activeSection === item.href.slice(1) ? "location" : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="main-navigation__actions">
      <button className="main-navigation__theme" type="button" onClick={onThemeToggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
        <span className="main-navigation__theme-icon" aria-hidden="true">{theme === "dark" ? "☼" : "☾"}</span>
        <span>{theme === "dark" ? "Light" : "Dark"}</span>
      </button>
      <button
        className="main-navigation__toggle"
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-controls="mobile-navigation"
        onClick={onToggle}
      >
        <span>{isOpen ? "Close" : "Menu"}</span>
        <span className={`main-navigation__toggle-icon ${isOpen ? "is-open" : ""}`} aria-hidden="true">
          <i />
          <i />
        </span>
      </button>

      </div>

      <div className={`mobile-navigation ${isOpen ? "is-open" : ""}`} id="mobile-navigation" aria-hidden={!isOpen}>
        <button className="mobile-navigation__backdrop" type="button" aria-label="Close menu" onClick={onClose} />
        <div className="mobile-navigation__drawer">
          <div className="mobile-navigation__heading">
            <span className="section-kicker">Navigate</span>
            <p>Enter Zeehad's visual world.</p>
          </div>
          <nav aria-label="Mobile navigation">
            <ol>
              {navigationItems.map((item, index) => (
                <li key={item.href}>
                  <a ref={index === 0 ? firstLinkRef : undefined} href={item.href} onClick={handleNavigate} aria-current={activeSection === item.href.slice(1) ? "location" : undefined}>
                    <span>0{index + 1}</span>
                    <strong>{item.label}</strong>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="mobile-navigation__footer">
            <span>Director · Writer · Cinematographer · Editor</span>
            <span>Gazipur, Dhaka, Bangladesh</span>
          </div>
        </div>
      </div>
    </header>
  );
}
