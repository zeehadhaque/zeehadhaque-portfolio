import React, { useState } from "react";
import { CastleExperience } from "../castle/CastleExperience";
import { InboxApp } from "./InboxApp";
import { FilmModal } from "../overlays/FilmModal";
import { AcademyModal } from "../overlays/AcademyModal";
import { ZeeAIChatModal } from "../overlays/ZeeAIChatModal";
import { ContactModal } from "../overlays/ContactModal";
import { LiteModeFallback } from "../overlays/LiteModeFallback";
import { toggleSpatialAudio } from "../utils/spatialAudio";

import "../styles/tokens.css";
import "../styles/castle-hud.css";
import "../styles/castle-overlays.css";

export function App() {
  // 1. Strict Zero-Touch Inbox Route Protection
  const isInboxRoute =
    typeof window !== "undefined" &&
    window.location.pathname.replace(/\/+$/, "") === "/inbox";

  if (isInboxRoute) {
    return <InboxApp />;
  }

  // Active overlay state for Lite Mode fallback
  const [liteActiveModal, setLiteActiveModal] = useState<
    "shadow" | "chakra" | "academy" | "zeeai" | "contact" | null
  >(null);

  // 2. Mount CastleExperience on /
  return (
    <>
      <CastleExperience
        renderFilmModal={(filmKey, onClose) => (
          <FilmModal filmKey={filmKey} onClose={onClose} />
        )}
        renderAcademy={(onClose) => <AcademyModal onClose={onClose} />}
        renderZeeAI={(onClose) => <ZeeAIChatModal onClose={onClose} />}
        renderContact={(onClose) => <ContactModal onClose={onClose} />}
        renderLiteFallback={(onExitLite) => (
          <>
            <LiteModeFallback
              onExitLite={onExitLite}
              onOpenFilm={(key) => setLiteActiveModal(key)}
              onOpenAcademy={() => setLiteActiveModal("academy")}
              onOpenZeeAI={() => setLiteActiveModal("zeeai")}
              onOpenContact={() => setLiteActiveModal("contact")}
            />

            {/* Overlays mounted when in Lite Mode */}
            {liteActiveModal && (
              <div
                className="castle-overlay-backdrop"
                role="dialog"
                aria-modal="true"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setLiteActiveModal(null);
                }}
              >
                <div className="glass-panel castle-overlay-card">
                  {(liteActiveModal === "shadow" || liteActiveModal === "chakra") && (
                    <FilmModal
                      filmKey={liteActiveModal}
                      onClose={() => setLiteActiveModal(null)}
                    />
                  )}
                  {liteActiveModal === "academy" && (
                    <AcademyModal onClose={() => setLiteActiveModal(null)} />
                  )}
                  {liteActiveModal === "zeeai" && (
                    <ZeeAIChatModal onClose={() => setLiteActiveModal(null)} />
                  )}
                  {liteActiveModal === "contact" && (
                    <ContactModal onClose={() => setLiteActiveModal(null)} />
                  )}
                </div>
              </div>
            )}
          </>
        )}
        onToggleAudio={(_enabled) => {
          toggleSpatialAudio();
        }}
      />
    </>
  );
}

