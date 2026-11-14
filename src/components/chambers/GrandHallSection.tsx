import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Film } from "lucide-react";
import { identityPortraitAsset, siteIdentity } from "../../data/site";
import { UNIVERSE_DESTINATIONS } from "../../utils/castleConfig";

const palacePortals = UNIVERSE_DESTINATIONS.slice(1, 5);

export function GrandHallSection() {
  const [portraitFailed, setPortraitFailed] = useState(false);

  return (
    <section
      className="dest dest-origin"
      id="foyer"
      aria-labelledby="origin-monument-title"
    >
      <span id="origin" className="anchor-alias" aria-hidden="true" />
      <span id="home" className="anchor-alias" aria-hidden="true" />

      <div className="origin-canvas castle-shell">
        <header className="origin-header">
          <p className="identity-kicker">
            01 · The Grand Foyer · Gazipur, Dhaka, Bangladesh
          </p>
          <span className="origin-coordinates tabular-nums" aria-hidden="true">
            23°59′N · 90°25′E
          </span>
        </header>

        <div className="origin-monument">
          <h1 id="origin-monument-title" className="origin-monument__name">
            <span className="origin-monument__line">ZEEHAD</span>
            <span className="origin-monument__line origin-monument__line--italic">
              HAQUE
            </span>
          </h1>
          <p className="origin-monument__roles">{siteIdentity.roles}</p>
        </div>

        <div className="origin-stage">
          <div className="origin-stage__editorial">
            <blockquote className="origin-quote">
              <p>
                Cinema begins where <em>words fall silent.</em>
              </p>
              <footer>{siteIdentity.statement}</footer>
            </blockquote>

            <p className="origin-intro">
              Welcome inside the Grand Cinema Palace — a monumental digital
              auditorium shaped by psychological tension, chiaroscuro light, and
              independent filmmaking from Gazipur, Bangladesh.
            </p>

            <div className="origin-actions">
              <a className="identity-btn identity-btn--primary" href="#screening-hall">
                <Film size={15} />
                <span>Enter Screening Hall</span>
              </a>
              <a className="identity-btn identity-btn--ghost" href="#projection-room">
                <span>Projection Room</span>
                <ArrowDownRight size={15} />
              </a>
            </div>
          </div>

          <div className="origin-stage__monolith">
            <div className="origin-portrait-meta">
              <span>Director Plate</span>
              <span>Auteur · Founder</span>
            </div>
            <figure className="origin-portrait-frame">
              {!portraitFailed ? (
                <img
                  src={identityPortraitAsset}
                  alt="Zeehad Haque — independent filmmaker, director, writer, cinematographer and editor from Bangladesh"
                  width="960"
                  height="1078"
                  fetchPriority="high"
                  referrerPolicy="no-referrer"
                  onError={() => setPortraitFailed(true)}
                />
              ) : (
                <div className="origin-portrait-fallback">
                  <strong>Zeehad Haque</strong>
                  <span>Independent Filmmaker · Bangladesh</span>
                </div>
              )}
              <figcaption>
                <strong>Zeehad Haque</strong>
                <span>Gazipur · Bangladesh</span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Direct Architectural Palace Wings Portals */}
        <div
          className="foyer-portals"
          role="navigation"
          aria-label="Palace architectural wings"
        >
          {palacePortals.map((wing) => (
            <a key={wing.id} href={wing.href} className="foyer-portal-card">
              <div className="foyer-portal-card__top">
                <span className="tabular-nums">{wing.number}</span>
                <ArrowUpRight size={15} />
              </div>
              <strong>{wing.label}</strong>
              <small>{wing.subtitle}</small>
            </a>
          ))}
        </div>

        {/* Hairline Horizon Metrics */}
        <div className="origin-horizon">
          <div className="origin-horizon__item">
            <strong className="tabular-nums">08</strong>
            <span>Screenings in the Hall</span>
          </div>
          <div className="origin-horizon__item">
            <strong className="tabular-nums">08</strong>
            <span>Original Development Stories</span>
          </div>
          <div className="origin-horizon__item">
            <strong className="tabular-nums">30</strong>
            <span>Days in The Institute</span>
          </div>
          <div className="origin-horizon__item">
            <strong className="tabular-nums">07</strong>
            <span>Monumental Palace Halls</span>
          </div>
        </div>
      </div>
    </section>
  );
}
