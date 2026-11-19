import React from "react";
import {
  LiquidPortfolioShell,
  type LiquidFilmItem,
} from "../components/liquid/LiquidPortfolioShell";
import { InboxApp } from "./InboxApp";
import { videoArchive } from "../data/videoArchive";
import { siteIdentity } from "../data/site";
import { SITE_CONFIG } from "../data/siteConfig";
import { AcademyModal } from "../overlays/AcademyModal";
import { ZeeAIChatModal } from "../overlays/ZeeAIChatModal";
import { ContactModal } from "../overlays/ContactModal";
import { toggleSpatialAudio } from "../utils/spatialAudio";

import "../styles/liquid-glass.css";
import "../styles/castle-overlays.css";

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
      portraitSrc={SITE_CONFIG.cleanPortraitImage}
      heroBio={siteIdentity.biography}
      manifesto={manifestoText}
      films={liquidFilms}
      renderAcademy={(onClose) => <AcademyModal onClose={onClose} />}
      renderZeeAI={(onClose) => <ZeeAIChatModal onClose={onClose} />}
      renderContact={(onClose) => <ContactModal onClose={onClose} />}
      onToggleAudio={(_enabled) => {
        toggleSpatialAudio();
      }}
    />
  );
}
