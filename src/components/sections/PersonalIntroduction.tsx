import { filmProjects, siteIdentity } from "../../data/site";

export function PersonalIntroduction() {
  const collage = filmProjects.slice(0, 5);

  return (
    <section className="message-from-zee section-light" id="introduction" aria-labelledby="introduction-title">
      <div className="page-width message-from-zee__grid">
        <div className="message-from-zee__collage" aria-label="Selected stills from the film archive">
          {collage.map((film, index) => (
            <a
              className={`message-from-zee__image message-from-zee__image--${index + 1}`}
              href={film.sourceUrl}
              target="_blank"
              rel="noreferrer"
              key={film.id}
              aria-label={`Open film archive source ${index + 1}`}
            >
              <img
                src={`https://i.ytimg.com/vi/${film.videoId}/hqdefault.jpg`}
                alt={`Still from Zeehad Haque film archive item ${index + 1}`}
                loading="lazy"
                width="480"
                height="360"
              />
              <span>Archive / 0{index + 1}</span>
            </a>
          ))}
          <span className="message-from-zee__collage-mark" aria-hidden="true">ZH</span>
        </div>

        <div className="message-from-zee__copy">
          <p className="section-kicker">02 / The filmmaker behind the frame</p>
          <h2 id="introduction-title">I make films<br />that <em>stay with you.</em></h2>
          <p className="message-from-zee__statement">{siteIdentity.statement}</p>
          <p className="message-from-zee__bio">{siteIdentity.biography}</p>
          <div className="message-from-zee__credits">
            <span>{siteIdentity.roles}</span>
            <span>{siteIdentity.location}</span>
          </div>
          <div className="message-from-zee__actions"><a className="message-from-zee__link" href="#on-set">Explore the process <span aria-hidden="true">↗</span></a><a className="message-from-zee__link" href="/about/">Read the official filmmaker profile <span aria-hidden="true">↗</span></a></div>
        </div>
      </div>
    </section>
  );
}
