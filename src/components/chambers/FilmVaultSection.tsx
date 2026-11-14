import { useEffect, useState } from "react";
import { ExternalLink, Play, X } from "lucide-react";
import { filmProjects } from "../../data/site";
import type { FilmProject } from "../../types/content";
import { getFilmDisplayMetadata } from "../../utils/castleConfig";

type ArchiveFilter = "all" | "verified" | "short";

export function FilmVaultSection() {
  const [filter, setFilter] = useState<ArchiveFilter>("all");
  const [selected, setSelected] = useState<{
    film: FilmProject;
    index: number;
  } | null>(null);
  const [failedThumbIds, setFailedThumbIds] = useState<Record<string, boolean>>(
    {},
  );

  const allEntries = filmProjects.map((film, index) => ({
    film,
    index,
    meta: getFilmDisplayMetadata(film, index),
  }));

  const entries = allEntries.filter((entry) => {
    if (filter === "verified") return entry.meta.isTitleVerified;
    if (filter === "short") return Boolean(entry.film.isShort);
    return true;
  });

  const spotlightEntries =
    filter === "all"
      ? entries.filter((e) => e.meta.isTitleVerified)
      : [];

  const indexEntries =
    filter === "all"
      ? entries.filter((e) => !e.meta.isTitleVerified)
      : entries;

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.body.classList.add("modal-is-open");
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-is-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  const activeMeta = selected
    ? getFilmDisplayMetadata(selected.film, selected.index)
    : null;

  return (
    <section
      className="dest dest-filmography"
      id="screening-hall"
      aria-labelledby="filmography-title"
    >
      <span id="filmography" className="anchor-alias" aria-hidden="true" />
      <span id="films" className="anchor-alias" aria-hidden="true" />

      <div className="castle-shell">
        <div className="dest-head">
          <div>
            <p className="identity-kicker">
              02 · The Screening Hall · IMAX Premiere Auditorium
            </p>
            <h2 id="filmography-title">
              Premiere reels on the <em>grand screen.</em>
            </h2>
          </div>
          <p className="dest-head__lead">
            Eight original YouTube moving-image works presented inside the
            palace auditorium. Select any premiere or archive reel to launch an
            isolated Screening Room projection.
          </p>
        </div>

        <div
          className="filmography-filters"
          role="group"
          aria-label="Filter screening hall archive"
        >
          <button
            type="button"
            className={filter === "all" ? "is-active" : undefined}
            onClick={() => setFilter("all")}
          >
            All Works (08)
          </button>
          <button
            type="button"
            className={filter === "verified" ? "is-active" : undefined}
            onClick={() => setFilter("verified")}
          >
            Titled Premieres (02)
          </button>
          <button
            type="button"
            className={filter === "short" ? "is-active" : undefined}
            onClick={() => setFilter("short")}
          >
            Short Form (01)
          </button>
        </div>

        {spotlightEntries.length > 0 && (
          <div className="filmography-spotlight">
            {spotlightEntries.map(({ film, index, meta }) => (
              <article className="spotlight-plate" key={film.id}>
                <button
                  type="button"
                  className="spotlight-plate__trigger"
                  onClick={() => setSelected({ film, index })}
                  aria-label={`Screen ${meta.title}`}
                >
                  <div className="spotlight-plate__poster">
                    {!failedThumbIds[film.id] ? (
                      <img
                        src={meta.thumbnailUrl}
                        alt={`${meta.title} poster still`}
                        loading="lazy"
                        decoding="async"
                        width="480"
                        height="360"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedThumbIds((prev) => ({
                            ...prev,
                            [film.id]: true,
                          }))
                        }
                      />
                    ) : (
                      <div className="spotlight-plate__fallback">
                        <strong>{meta.title}</strong>
                      </div>
                    )}
                    <div
                      className="spotlight-plate__scrim"
                      aria-hidden="true"
                    />
                    <span className="spotlight-plate__badge tabular-nums">
                      Premiere · {meta.indexLabel}
                    </span>
                    <span className="spotlight-plate__play" aria-hidden="true">
                      <Play size={18} />
                    </span>
                  </div>

                  <div className="spotlight-plate__body">
                    <p className="spotlight-plate__meta">
                      <span>{meta.formatLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{meta.category}</span>
                    </p>
                    <h3>{meta.title}</h3>
                    <p className="spotlight-plate__desc">{meta.description}</p>
                    <span className="spotlight-plate__cta">
                      {film.label} · Enter Screening Room
                    </span>
                  </div>
                </button>
              </article>
            ))}
          </div>
        )}

        <div className="filmography-ledger">
          {indexEntries.map(({ film, index, meta }) => (
            <article className="ledger-reel" key={film.id}>
              <button
                type="button"
                className="ledger-reel__trigger"
                onClick={() => setSelected({ film, index })}
                aria-label={`Screen ${meta.title}`}
              >
                <div className="ledger-reel__poster">
                  {!failedThumbIds[film.id] ? (
                    <img
                      src={meta.thumbnailUrl}
                      alt={`${meta.title} archive thumbnail`}
                      loading="lazy"
                      decoding="async"
                      width="480"
                      height="360"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedThumbIds((prev) => ({
                          ...prev,
                          [film.id]: true,
                        }))
                      }
                    />
                  ) : (
                    <div className="ledger-reel__fallback">
                      <span>{meta.indexLabel}</span>
                    </div>
                  )}
                  <span className="ledger-reel__play" aria-hidden="true">
                    <Play size={14} />
                  </span>
                </div>

                <div className="ledger-reel__copy">
                  <div className="ledger-reel__meta">
                    <span className="ledger-reel__num tabular-nums">
                      {meta.indexLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{meta.formatLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{meta.category}</span>
                  </div>
                  <h3>{meta.title}</h3>
                  <p>{meta.description}</p>
                  <span className="ledger-reel__action">
                    {film.label} · Open Screening Room
                  </span>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>

      {selected && activeMeta && (
        <div
          className="identity-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`Screening ${activeMeta.title}`}
        >
          <button
            type="button"
            className="identity-modal__backdrop"
            aria-label="Close screening room"
            onClick={() => setSelected(null)}
          />
          <div className="identity-modal__dialog identity-modal__dialog--screening">
            <div className="identity-modal__top">
              <div>
                <span className="identity-kicker tabular-nums">
                  Reel {activeMeta.indexLabel} · {activeMeta.formatLabel} ·{" "}
                  {activeMeta.category}
                </span>
                <h2>{activeMeta.title}</h2>
              </div>
              <button
                type="button"
                className="identity-modal__close"
                aria-label="Close screening room"
                onClick={() => setSelected(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="screening-frame">
              <iframe
                title={activeMeta.title}
                src={activeMeta.embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="screening-details">
              <div className="screening-details__text">
                <p>{activeMeta.description}</p>
                <span className="screening-details__credits">
                  Credits: {activeMeta.creditsLabel}
                </span>
              </div>
              <a
                className="identity-btn identity-btn--ghost"
                href={selected.film.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span>Open on YouTube</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
