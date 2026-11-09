import { useEffect, useState } from "react";
import { filmProjects } from "../../data/site";
import type { FilmProject } from "../../types/content";

function FilmCard({ film, index, onOpen }: { film: FilmProject; index: number; onOpen: (film: FilmProject) => void }) {
  return (
    <article className={`film-card film-card--${(index % 3) + 1}`}>
      <button type="button" className="film-card__button" onClick={() => onOpen(film)} aria-label={`${film.label}: ${film.title ?? `film ${index + 1}`}`}>
        <span className="film-card__image-wrap">
          <img src={`https://i.ytimg.com/vi/${film.videoId}/hqdefault.jpg`} alt="" loading="lazy" width="480" height="360" />
          <span className="film-card__veil" />
          <span className="film-card__play" aria-hidden="true">↗</span>
          <span className="film-card__index">0{index + 1}</span>
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

  useEffect(() => {
    if (!selectedFilm) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedFilm(null);
    };
    document.body.classList.add("modal-is-open");
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-is-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedFilm]);

  return (
    <>
      <section className="film-archive section-light" id="films" aria-labelledby="films-title">
        <div className="page-width">
          <div className="section-heading section-heading--split">
            <div>
              <p className="section-kicker">03 / Selected films</p>
              <h2 id="films-title">Stories built in<br /><em>light and silence.</em></h2>
            </div>
            <p>An evolving collection of films, visual experiments and teasers. Each frame opens its original source; titles remain neutral wherever a name has not been confirmed.</p>
          </div>
          <div className="film-archive__grid">
            {filmProjects.map((film, index) => <FilmCard key={film.id} film={film} index={index} onOpen={setSelectedFilm} />)}
          </div>
          <div className="section-tail"><span>SELECTED FILMS</span><span>Eight source links / No autoplay</span></div>
        </div>
      </section>

      {selectedFilm && (
        <div className="film-modal" role="dialog" aria-modal="true" aria-labelledby="film-modal-title">
          <button className="film-modal__backdrop" type="button" aria-label="Close film viewer" onClick={() => setSelectedFilm(null)} />
          <div className="film-modal__dialog">
            <div className="film-modal__header">
              <div><span className="section-kicker">Film archive / source</span><h2 id="film-modal-title">{selectedFilm.title ?? "Watch Film"}</h2></div>
              <button className="close-button" type="button" onClick={() => setSelectedFilm(null)} aria-label="Close film viewer">×</button>
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
            <a className="line-link film-modal__source" href={selectedFilm.sourceUrl} target="_blank" rel="noreferrer">Open original YouTube source <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      )}
    </>
  );
}
