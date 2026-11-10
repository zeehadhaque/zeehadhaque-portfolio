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
const labels: Record<string, string> = {
  home: "Home", films: "Films", "frame-archive": "Frames", "on-set": "The craft",
  "off-set": "Beyond", projects: "Stories", academy: "Academy", contact: "Contact",
};

export function SiteNavigation({ activeSection, theme, onThemeToggle, isOpen, onToggle, onClose }: SiteNavigationProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    firstLinkRef.current?.focus();
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [isOpen, onClose]);
  const close = () => onClose();

  return (
    <header className="main-navigation auteur-navigation">
      <a className="main-navigation__brand" href="#home" onClick={close} aria-label="Zeehad Haque home">
        <span className="main-navigation__monogram" aria-hidden="true">ZH</span>
        <span className="main-navigation__brand-name">ZEEHAD HAQUE <small>FILMMAKER</small></span>
      </a>
      <nav className="main-navigation__desktop" aria-label="Primary navigation">
        {navigationItems.map((item) => {
          const id = item.href.slice(1);
          return <a key={item.href} className={activeSection === id ? "is-active" : ""} href={item.href} aria-current={activeSection === id ? "location" : undefined}>{labels[id] ?? item.label}</a>;
        })}
      </nav>
      <div className="main-navigation__actions">
        <button className="main-navigation__theme" type="button" onClick={onThemeToggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}><span className="main-navigation__theme-icon" aria-hidden="true">{theme === "dark" ? "☼" : "☾"}</span><span>{theme === "dark" ? "Light" : "Dark"}</span></button>
        <button className="main-navigation__toggle" type="button" aria-expanded={isOpen} aria-label={isOpen ? "Close navigation" : "Open navigation"} aria-controls="mobile-navigation" onClick={onToggle}><span>{isOpen ? "Close" : "Menu"}</span><span className={`main-navigation__toggle-icon ${isOpen ? "is-open" : ""}`} aria-hidden="true"><i /><i /></span></button>
      </div>
      <div className={`mobile-navigation ${isOpen ? "is-open" : ""}`} id="mobile-navigation" aria-hidden={!isOpen}>
        <button className="mobile-navigation__backdrop" type="button" aria-label="Close menu" onClick={close} />
        <div className="mobile-navigation__drawer">
          <div className="mobile-navigation__heading"><span className="section-kicker">NAVIGATE / THE WORLD OF ZEEHAD</span><p>Stories beyond the frame.</p></div>
          <nav aria-label="Mobile navigation"><ol>{navigationItems.map((item,index) => {const id=item.href.slice(1);return <li key={item.href}><a ref={index===0?firstLinkRef:undefined} href={item.href} onClick={close} aria-current={activeSection===id?"location":undefined}><span>0{index+1}</span><strong>{labels[id]??item.label}</strong></a></li>;})}</ol></nav>
          <div className="mobile-navigation__footer"><span>DIRECTOR · WRITER · CINEMATOGRAPHER · EDITOR</span><span>GAZIPUR, BANGLADESH</span></div>
        </div>
      </div>
    </header>
  );
}
