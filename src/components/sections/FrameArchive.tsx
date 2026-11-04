import { filmProjects } from "../../data/site";

export function FrameArchive() {
  return (
    <section className="frame-archive section-dark" id="frame-archive" aria-labelledby="frame-archive-title">
      <div className="page-width">
        <div className="frame-archive__heading">
          <div>
            <p className="section-kicker">04 / A study of images</p>
            <h2 id="frame-archive-title">FRAME<br /><em>ARCHIVE.</em></h2>
          </div>
          <p>Fragments from the work. A visual record of atmosphere, composition and the moments between action and stillness.</p>
        </div>

        <div className="frame-archive__gallery">
          {filmProjects.map((film, index) => (
            <a className={`frame-archive__tile frame-archive__tile--${(index % 4) + 1}`} href={film.sourceUrl} target="_blank" rel="noreferrer" key={film.id}>
              <img
                src={`https://i.ytimg.com/vi/${film.videoId}/hqdefault.jpg`}
                alt={film.title ? `${film.title} — film still` : `Film archive still ${index + 1}`}
                loading="lazy"
                width="480"
                height="360"
              />
              <span className="frame-archive__tile-meta"><span>Frame / 0{index + 1}</span><span>Open source ↗</span></span>
            </a>
          ))}
        </div>
        <div className="section-tail section-tail--light"><span>FRAME ARCHIVE</span><span>Selected film sources</span></div>
      </div>
    </section>
  );
}
