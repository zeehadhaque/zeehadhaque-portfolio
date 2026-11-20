import React, { Suspense, lazy } from "react";
import {
  ScenicCinemaWebsite,
  type ScenicFilm,
  type ScenicUpcoming,
  type ScenicLink,
} from "../components/scenic/ScenicCinemaWebsite";
import { InboxApp } from "./InboxApp";
import { videoArchive } from "../data/videoArchive";
import { siteIdentity } from "../data/site";
import { toggleSpatialAudio } from "../utils/spatialAudio";

import "../styles/scenic-cinema.css";
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

const UPCOMING_PROJECTS: ScenicUpcoming[] = [
  {
    number: "01",
    title: "GHURPAK (ঘুরপাক)",
    genre: "Psychological Thriller · Comedy",
  },
  {
    number: "02",
    title: "ONUSONDHAN (অনুসন্ধান)",
    genre: "Thriller · Mystery · Comedy",
  },
  {
    number: "03",
    title: "শেষ বিকেল: The Last Meetup",
    genre: "Coming-of-Age · Friendship · Comedy Drama",
  },
  {
    number: "04",
    title: "শ্যামল দীপ (Shyamol Deep)",
    genre: "Slice-of-Life · Friendship · Adventure Drama",
  },
  {
    number: "05",
    title: "প্রতিধ্বনি (Protiddhoni / Echo)",
    genre: "Literary · Psychological Drama",
  },
  {
    number: "06",
    title: "নক্ষত্রের ওপারে (Nakshatrer Opare)",
    genre: "Psychological Mystery · Supernatural",
  },
  {
    number: "07",
    title: "ওই বাড়িটার সামনে যেও না (Don't Go There)",
    genre: "Mystery · Survival · Action · Psychological Suspense",
  },
  {
    number: "08",
    title: "AUTOPSY",
    genre: "Thriller",
  },
  {
    number: "09",
    title: "ELSEWHERE",
    genre: "Adda Noir · Mystery",
  },
  {
    number: "10",
    title: "ILLUSION",
    genre: "Psychological Mystery · Action · Crime · Thriller",
  },
  {
    number: "11",
    title: "PUSHPA: THE DARK SIDE OF THE KNIGHT",
    genre: "Psychological Mystery · Romance · Thriller",
  },
];

const SANCTUARY_LINKS: ScenicLink[] = [
  {
    id: "website",
    label: "Official Website",
    handle: "zeehadhaque.zeehadhaque.workers.dev",
    url: "https://zeehadhaque.zeehadhaque.workers.dev",
  },
  {
    id: "imdb",
    label: "IMDb Profile",
    handle: "Zeehad Haque (Filmmaker)",
    url: "https://www.imdb.com/user/p.gtnf5csbffkwzrbmsvkfa2pssm",
  },
  {
    id: "filmfreeway",
    label: "FilmFreeway",
    handle: "Zeehad Haque (Q142020060)",
    url: "https://www.wikidata.org/wiki/Q142020060",
  },
  {
    id: "wikidata",
    label: "Wikidata",
    handle: "Q142020060 (Filmmaker)",
    url: "https://www.wikidata.org/wiki/Q142020060",
  },
  {
    id: "letterboxd",
    label: "Letterboxd",
    handle: "@onh0F",
    url: "https://boxd.it/onh0F",
  },
  {
    id: "tmdb",
    label: "TMDB",
    handle: "Shadow III (Director/Writer)",
    url: "https://www.themoviedb.org/movie/1819480-shadow-iii",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@heyyfalgun",
    url: "https://www.instagram.com/heyyfalgun/",
  },
  {
    id: "gmail",
    label: "Gmail",
    handle: "zeehadhaque@gmail.com",
    url: "mailto:zeehadhaque@gmail.com",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    handle: "+880 1629-851155",
    url: "https://wa.me/8801629851155",
  },
];

export function App() {
  // 1. Strict Zero-Touch Inbox Route Protection
  const isInboxRoute =
    typeof window !== "undefined" &&
    window.location.pathname.replace(/\/+$/, "") === "/inbox";

  if (isInboxRoute) {
    return <InboxApp />;
  }

  // Map all 8 verified films into ScenicFilm items
  const scenicFilms: ScenicFilm[] = videoArchive.map((film) => ({
    id: film.id,
    title: film.displayTitle,
    genre: film.genre,
    year: film.year,
    description: film.description,
    youtubeId: film.videoId,
    youtubeUrl: film.videoUrl,
    thumbnail: film.thumbnail,
    thumbnailFallback: film.officialThumbUrl,
  }));

  const manifestoText = `${siteIdentity.statement} ${siteIdentity.filmmakingApproach}`;

  // 2. Mount ScenicCinemaWebsite on /
  return (
    <ScenicCinemaWebsite
      portraitSrc="/assets/images/profile/zeehad-obsidian-portrait.jpg"
      bio={siteIdentity.biography}
      manifesto={manifestoText}
      films={scenicFilms}
      upcoming={UPCOMING_PROJECTS}
      links={SANCTUARY_LINKS}
      renderAcademy={(onClose) => (
        <Suspense fallback={<div className="scenic-modal-backdrop" aria-busy="true" />}>
          <AcademyModal onClose={onClose} />
        </Suspense>
      )}
      renderZeeAI={(onClose) => (
        <Suspense fallback={<div className="scenic-modal-backdrop" aria-busy="true" />}>
          <ZeeAIChatModal onClose={onClose} />
        </Suspense>
      )}
      renderContact={(onClose) => (
        <Suspense fallback={<div className="scenic-modal-backdrop" aria-busy="true" />}>
          <ContactModal onClose={onClose} />
        </Suspense>
      )}
      onToggleAudio={(_enabled) => {
        toggleSpatialAudio();
      }}
    />
  );
}
