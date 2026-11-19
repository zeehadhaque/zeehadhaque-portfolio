import React from "react";
import { CastleThemeId } from "../castle/engine/CastleEngine";

interface ThemeAnimatorProps {
  theme: CastleThemeId;
  onChange: (next: CastleThemeId) => void;
}

const THEMES: Array<{ id: CastleThemeId; label: string }> = [
  { id: "obsidian", label: "Obsidian" },
  { id: "glacial", label: "Glacial" },
  { id: "noir", label: "Noir" },
];

export const ThemeAnimator: React.FC<ThemeAnimatorProps> = ({ theme, onChange }) => {
  const cycleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const idx = THEMES.findIndex((t) => t.id === theme);
    const next = THEMES[(idx + 1) % THEMES.length].id;

    // Set circular ripple origin to exact button click coordinates
    const xPct = `${(e.clientX / window.innerWidth) * 100}%`;
    const yPct = `${(e.clientY / window.innerHeight) * 100}%`;
    document.documentElement.style.setProperty("--ripple-x", xPct);
    document.documentElement.style.setProperty("--ripple-y", yPct);

    const apply = () => {
      document.documentElement.setAttribute("data-castle-theme", next);
      onChange(next);
    };

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };

    if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      doc.startViewTransition(apply);
    } else {
      apply();
    }
  };

  const currentLabel = THEMES.find((t) => t.id === theme)?.label ?? "Obsidian";

  return (
    <button
      type="button"
      className="glass-btn"
      data-cursor="theme"
      onClick={cycleTheme}
      aria-label="Switch Castle Atmosphere Theme"
    >
      <span>Atmosphere: {currentLabel}</span>
    </button>
  );
};
