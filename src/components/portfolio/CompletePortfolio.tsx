import palaceFoyerImg from "../../assets/images/palace_grand_foyer_1794660878711.jpg";
import { DeferredAcademy } from "../academy/DeferredAcademy";
import { BehindTheFrameSection } from "../chambers/BehindTheFrameSection";
import { ContactSanctuarySection } from "../chambers/ContactSanctuarySection";
import { FilmVaultSection } from "../chambers/FilmVaultSection";
import { GrandHallSection } from "../chambers/GrandHallSection";
import { VisualChamberSection } from "../chambers/VisualChamberSection";

interface CompletePortfolioProps {
  onSummonIntelligence?: () => void;
}

export function CompletePortfolio({
  onSummonIntelligence,
}: CompletePortfolioProps) {
  return (
    <main id="main-content" className="identity-main">
      {/* 01. THE GRAND FOYER */}
      <GrandHallSection />

      {/* 02. THE SCREENING HALL */}
      <FilmVaultSection />

      {/* 03. THE PROJECTION ROOM */}
      <VisualChamberSection />

      {/* 04. THE DIRECTOR'S SUITE */}
      <BehindTheFrameSection />

      {/* 05. THE FILMMAKING INSTITUTE */}
      <section
        className="dest dest-academy"
        id="institute"
        aria-label="The Filmmaking Institute — 30-Day Conservatory"
      >
        <span id="academy" className="anchor-alias" aria-hidden="true" />
        <DeferredAcademy />
      </section>

      {/* 06. THE CINEMATIC INTELLIGENCE CHAMBER */}
      <section
        className="dest dest-intelligence"
        id="intelligence"
        aria-labelledby="intelligence-title"
      >
        <div className="castle-shell intelligence-stage">
          <div className="intelligence-stage__backdrop" aria-hidden="true">
            <img
              src={palaceFoyerImg}
              alt=""
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
            <div className="intelligence-stage__scrim" />
          </div>

          <div className="intelligence-stage__content">
            <div className="intelligence-core-emblem" aria-hidden="true">
              <svg viewBox="0 0 120 120" width="96" height="96" fill="none">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  stroke="currentColor"
                  strokeOpacity="0.28"
                  strokeDasharray="8 6"
                  className="zee-core-ring-outer"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="36"
                  stroke="currentColor"
                  strokeOpacity="0.55"
                  className="zee-core-ring-mid"
                />
                <polygon
                  points="60,30 84,60 60,90 36,60"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  fill="rgba(198,168,117,0.12)"
                />
                <circle cx="60" cy="60" r="5" fill="currentColor" />
              </svg>
            </div>

            <div className="intelligence-stage__copy">
              <p className="identity-kicker">
                06 · Intelligence Chamber · Embedded Cinema Core
              </p>
              <h2 id="intelligence-title">
                Converse with <em>ZEE AI</em> inside the palace.
              </h2>
              <p>
                A futuristic optical control chamber connected to the verified
                studio archive and the 30-day Filmmaking Institute. Ask about
                films, camera craft, or screenwriting in English or Banglish.
              </p>
              <button
                type="button"
                className="identity-btn identity-btn--primary"
                onClick={onSummonIntelligence}
              >
                <span>Open ZEE Intelligence</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 07. THE GRAND EXIT */}
      <ContactSanctuarySection />
    </main>
  );
}
