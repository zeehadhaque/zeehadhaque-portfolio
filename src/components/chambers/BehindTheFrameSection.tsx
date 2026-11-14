import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import directorsSuiteImg from "../../assets/images/palace_directors_suite_1794660879053.jpg";
import {
  futureProjects,
  portraitAsset,
  siteIdentity,
} from "../../data/site";

export function BehindTheFrameSection() {
  const [portraitFailed, setPortraitFailed] = useState(false);
  const [expandedCreative, setExpandedCreative] = useState<string | null>(
    siteIdentity.creativeProjects[0]?.title ?? null,
  );

  return (
    <section
      className="dest dest-auteur"
      id="directors-suite"
      aria-labelledby="auteur-title"
    >
      <span id="auteur" className="anchor-alias" aria-hidden="true" />
      <span id="about" className="anchor-alias" aria-hidden="true" />
      <span id="off-set" className="anchor-alias" aria-hidden="true" />
      <span id="process" className="anchor-alias" aria-hidden="true" />
      <span id="projects" className="anchor-alias" aria-hidden="true" />

      <div className="castle-shell">
        <div className="dest-head">
          <div>
            <p className="identity-kicker">
              04 · The Director&apos;s Suite · Auteur Study &amp; Slate
            </p>
            <h2 id="auteur-title">
              The private study where <em>worlds are written.</em>
            </h2>
          </div>
          <p className="dest-head__lead">{siteIdentity.workingMethod}</p>
        </div>

        {/* Architectural Study Atmospheric Plate */}
        <figure className="suite-atmosphere-banner">
          <img
            src={directorsSuiteImg}
            alt="Architectural director study illuminated by high clerestory moonlight"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          <figcaption>
            <span>Director&apos;s Study Wing</span>
            <span>Quiet Preparation · Story Architecture · Screenplays</span>
          </figcaption>
        </figure>

        {/* Monograph Two-Plane Composition */}
        <div className="auteur-monograph">
          <div className="auteur-monograph__left">
            <div className="auteur-portrait">
              {!portraitFailed ? (
                <img
                  src={portraitAsset}
                  alt="Zeehad Haque — Independent Filmmaker in Gazipur, Bangladesh"
                  loading="lazy"
                  decoding="async"
                  width="960"
                  height="1078"
                  referrerPolicy="no-referrer"
                  onError={() => setPortraitFailed(true)}
                />
              ) : (
                <div className="auteur-portrait__fallback">
                  <strong>Zeehad Haque</strong>
                  <span>Gazipur, Bangladesh</span>
                </div>
              )}
              <p className="auteur-portrait__caption">
                Personal Practice · {siteIdentity.location}
              </p>
            </div>

            <div className="auteur-essay">
              <p className="auteur-essay__lead">{siteIdentity.biography}</p>

              <div className="auteur-focus">
                <h3>Creative Principles</h3>
                <ul>
                  {siteIdentity.creativeFocus.map((focus, idx) => (
                    <li key={focus}>
                      <span className="tabular-nums">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span>{focus}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="auteur-method">
            <p className="identity-kicker">Discipline From Concept to Finish</p>
            <ol className="auteur-method__list">
              {siteIdentity.productionWorkflow.map((step) => (
                <li key={step.number}>
                  <span className="auteur-method__num tabular-nums">
                    {step.number}
                  </span>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="auteur-slates">
          <div className="auteur-slates__col">
            <div className="slate-heading">
              <p className="identity-kicker">Works &amp; Concepts Dossier</p>
              <h3>Creative Projects</h3>
            </div>
            <div className="dossier-accordion">
              {siteIdentity.creativeProjects.map((project) => {
                const open = expandedCreative === project.title;
                return (
                  <article className="dossier-item" key={project.title}>
                    <button
                      type="button"
                      className="dossier-item__trigger"
                      aria-expanded={open}
                      onClick={() =>
                        setExpandedCreative(open ? null : project.title)
                      }
                    >
                      <div>
                        <strong>{project.title}</strong>
                        <span>
                          {project.category} · {project.status}
                        </span>
                      </div>
                      <span className="dossier-item__sign" aria-hidden="true">
                        {open ? "−" : "+"}
                      </span>
                    </button>
                    {open && (
                      <div className="dossier-item__body">
                        <p>{project.description}</p>
                        {project.href && (
                          <a
                            href={project.href}
                            target="_blank"
                            rel="noreferrer"
                            className="dossier-item__link"
                          >
                            <span>Watch source teaser</span>
                            <ArrowUpRight size={13} />
                          </a>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>

          <div className="auteur-slates__col">
            <div className="slate-heading">
              <p className="identity-kicker">Development Slate</p>
              <h3>Stories Still Becoming</h3>
            </div>
            <ol className="screenplay-slate">
              {futureProjects.map((project, index) => (
                <li key={project.title}>
                  <span className="screenplay-slate__num tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <strong>{project.title}</strong>
                    <span>{project.genre}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
