import { useEffect, useRef, useState } from "react";
import { filmProjects } from "../../data/site";
import type { FilmProject } from "../../types/content";

type FilmFilter = "all" | "shorts" | "titled" | "untitled";

const filmFilters: ReadonlyArray<{ id: FilmFilter; label: string }> = [
  { id: "all", label: "All films" },
  { id: "shorts", label: "Shorts" },
  { id: "titled", label: "Titled" },
  { id: "untitled", label: "Archive" },
];

function matchesFilter(film: FilmProject, filter: FilmFilter): boolean {
  if (filter === "all") return true;
  if (filter === "shorts") return Boolean(film.isShort);
  if (filter === "titled") return Boolean(film.title);
  return !film.title && !film.isShort;
}

function FilmCard({
  film,
  index,
  onOpen,
}: {
  film: FilmProject;
  index: number;
  onOpen: (film: FilmProject) => void;
}) {
  return (
    <article className={`film-card film-card--${(index % 3) + 1}`}>
      <button
        type="button"
        className="film-card__button"
        onClick={() => onOpen(film)}
        aria-label={`${film.label}: ${film.title ?? `film ${index + 1}`}`}
      >
        <span className="film-card__image-wrap">
          <img
            src={`https://i.ytimg.com/vi/${film.videoId}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            width="480"
            height="360"
          />
          <span className="film-card__veil" />
          <span className="film-card__play" aria-hidden="true">↗</span>
          <span className="film-card__index">{String(index + 1).padStart(2, "0")}</span>
        </span>
        <span className="film-card__meta">
          <strong>{film.title ?? "Watch Film"}</strong>
          <span>{film.isShort ? "Shorts / Source link" : film.title ? "Teaser / Source link" : "Title pending verification"}</span>
        </span>
      </button>
    </article>
  );
}

export function FilmArchive() {
  const [selectedFilm, setSelectedFilm] = useState<FilmProject | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilmFilter>("all");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const selectedIndex = selectedFilm
    ? filmProjects.findIndex((film) => film.id === selectedFilm.id)
    : -1;

  const visibleFilms = filmProjects
    .map((film, index) => ({ film, index }))
    .filter(({ film }) => matchesFilter(film, activeFilter));

  const filterCounts = {
    all: filmProjects.length,
    shorts: filmProjects.filter((film) => Boolean(film.isShort)).length,
    titled: filmProjects.filter((film) => Boolean(film.title)).length,
    untitled: filmProjects.filter((film) => !film.title && !film.isShort).length,
  };

  const openFilm = (film: FilmProject) => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    setSelectedFilm(film);
  };

  const closeFilm = () => setSelectedFilm(null);

  useEffect(() => {
    if (!selectedFilm) {
      returnFocusRef.current?.focus();
      returnFocusRef.current = null;
      return;
    }

    closeButtonRef.current?.focus();
    document.body.classList.add("modal-is-open");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeFilm();
        return;
      }

      if (event.key === "ArrowRight" && selectedIndex < filmProjects.length - 1) {
        event.preventDefault();
        setSelectedFilm(filmProjects[selectedIndex + 1]);
      }

      if (event.key === "ArrowLeft" && selectedIndex > 0) {
        event.preventDefault();
        setSelectedFilm(filmProjects[selectedIndex - 1]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-is-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedFilm, selectedIndex]);

  const navigateFilm = (direction: -1 | 1) => {
    const nextIndex = selectedIndex + direction;
    if (nextIndex < 0 || nextIndex >= filmProjects.length) return;
    setSelectedFilm(filmProjects[nextIndex]);
  };

  return (
    <>
      <section className="film-archive section-light" id="films" aria-labelledby="films-title">
        <div className="page-width">
          <div className="section-heading section-heading--split">
            <div>
              <p className="section-kicker">03 / Selected films</p>
              <h2 id="films-title">Stories built in<br /><em>light and silence.</em></h2>
            </div>
            <p>
              An evolving collection of films, visual experiments and teasers.
              Each frame opens its original source; titles remain neutral wherever
              a name has not been confirmed.
            </p>
          </div>

          <div className="film-archive__tools">
            <div className="film-archive__filters" role="group" aria-label="Filter film archive">
              {filmFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={activeFilter === filter.id ? "is-active" : ""}
                  aria-pressed={activeFilter === filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  <span>{filter.label}</span>
                  <small>{String(filterCounts[filter.id]).padStart(2, "0")}</small>
                </button>
              ))}
            </div>
            <p className="film-archive__result-count" aria-live="polite">
              Showing {String(visibleFilms.length).padStart(2, "0")} / {String(filmProjects.length).padStart(2, "0")}
            </p>
          </div>

          <div className="film-archive__grid" aria-live="polite">
            {visibleFilms.map(({ film, index }) => (
              <FilmCard
                key={film.id}
                film={film}
                index={index}
                onOpen={openFilm}
              />
            ))}
          </div>

          <div className="section-tail">
            <span>SELECTED FILMS</span>
            <span>{visibleFilms.length} visible / {filmProjects.length} original sources</span>
          </div>
        </div>
      </section>

      {selectedFilm && (
        <div className="film-modal" role="dialog" aria-modal="true" aria-labelledby="film-modal-title">
          <button
            className="film-modal__backdrop"
            type="button"
            aria-label="Close film viewer"
            onClick={closeFilm}
          />
          <div className="film-modal__dialog">
            <div className="film-modal__header">
              <div>
                <span className="section-kicker">Film archive / source {String(selectedIndex + 1).padStart(2, "0")}</span>
                <h2 id="film-modal-title">{selectedFilm.title ?? "Watch Film"}</h2>
              </div>
              <button
                ref={closeButtonRef}
                className="close-button"
                type="button"
                onClick={closeFilm}
                aria-label="Close film viewer"
              >
                ×
              </button>
            </div>

            <div className="film-modal__video">
              <iframe
                title={selectedFilm.title ?? "Watch Film"}
                src={`https://www.youtube-nocookie.com/embed/${selectedFilm.videoId}?rel=0&modestbranding=1`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="film-modal__bottom">
              <a className="line-link film-modal__source" href={selectedFilm.sourceUrl} target="_blank" rel="noreferrer">
                Open original YouTube source <span aria-hidden="true">↗</span>
              </a>
              <div className="film-modal__navigation" aria-label="Film navigation">
                <button type="button" onClick={() => navigateFilm(-1)} disabled={selectedIndex <= 0} aria-label="Previous film">
                  <span aria-hidden="true">←</span> Previous
                </button>
                <span>{String(selectedIndex + 1).padStart(2, "0")} <i>/</i> {String(filmProjects.length).padStart(2, "0")}</span>
                <button type="button" onClick={() => navigateFilm(1)} disabled={selectedIndex >= filmProjects.length - 1} aria-label="Next film">
                  Next <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
