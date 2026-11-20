import React, { Suspense, lazy } from "react";
import {
  LiquidPortfolioShell,
  type LiquidFilmItem,
} from "../components/liquid/LiquidPortfolioShell";
import { InboxApp } from "./InboxApp";
import { videoArchive } from "../data/videoArchive";
import { siteIdentity } from "../data/site";
import { toggleSpatialAudio } from "../utils/spatialAudio";

import "../styles/liquid-glass.css";
import "../styles/castle-overlays.css";

// Lazy-load heavy overlay panels to ensure initial bundle loads in milliseconds
const AcademyModal = lazy(() =>
  import("../overlays/AcademyModal").then((m) => ({ default: m.AcademyModal }))
);
const ZeeAIChatModal = lazy(() =>
  import("../overlays/ZeeAIChatModal").then((m) => ({ default: m.ZeeAIChatModal }))
);
const ContactModal = lazy(() =>
  import("../overlays/ContactModal").then((m) => ({ default: m.ContactModal }))
);

export function App() {
  // 1. Strict Zero-Touch Inbox Route Protection
  const isInboxRoute =
    typeof window !== "undefined" &&
    window.location.pathname.replace(/\/+$/, "") === "/inbox";

  if (isInboxRoute) {
    return <InboxApp />;
  }

  // Map all 8 verified films into LiquidFilmItems
  const liquidFilms: LiquidFilmItem[] = videoArchive.map((film) => ({
    id: film.id,
    title: film.displayTitle,
    genre: film.genre,
    year: film.year,
    description: film.description,
    youtubeId: film.videoId,
    thumbnail: film.thumbnail,
  }));

  const manifestoText = `${siteIdentity.statement} ${siteIdentity.filmmakingApproach}`;

  // 2. Mount LiquidPortfolioShell on /
  return (
    <LiquidPortfolioShell
      portraitSrc="/assets/images/profile/zeehad-obsidian-portrait.jpg"
      heroBio={siteIdentity.biography}
      manifesto={manifestoText}
      films={liquidFilms}
      renderAcademy={(onClose) => (
        <Suspense fallback={<div className="liquid-modal-backdrop" aria-busy="true" />}>
          <AcademyModal onClose={onClose} />
        </Suspense>
      )}
      renderZeeAI={(onClose) => (
        <Suspense fallback={<div className="liquid-modal-backdrop" aria-busy="true" />}>
          <ZeeAIChatModal onClose={onClose} />
        </Suspense>
      )}
      renderContact={(onClose) => (
        <Suspense fallback={<div className="liquid-modal-backdrop" aria-busy="true" />}>
          <ContactModal onClose={onClose} />
        </Suspense>
      )}
      onToggleAudio={(_enabled) => {
        toggleSpatialAudio();
      }}
    />
  );
}
