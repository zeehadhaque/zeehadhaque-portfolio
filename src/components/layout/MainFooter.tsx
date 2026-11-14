import { siteIdentity } from "../../data/site";

export function MainFooter() {
  return (
    <footer className="identity-footer">
      <div className="castle-shell identity-footer__main">
        <div>
          <p className="identity-kicker">End Credits · Grand Cinema Palace</p>
          <a href="#foyer" className="identity-footer__name">
            ZEEHAD <em>HAQUE.</em>
          </a>
        </div>
        <div className="identity-footer__links">
          <a href="#foyer">Foyer</a>
          <a href="#screening-hall">Screenings</a>
          <a href="#projection-room">Projection</a>
          <a href="#directors-suite">Suite</a>
          <a href="#institute">Institute</a>
          <a href="#intelligence">Intelligence</a>
          <a href="#grand-exit">Grand Exit</a>
        </div>
      </div>
      <div className="castle-shell identity-footer__bottom">
        <span>© {new Date().getFullYear()} {siteIdentity.name}</span>
        <span>{siteIdentity.roles}</span>
        <span>{siteIdentity.location}</span>
        <a href={`mailto:${siteIdentity.email}`}>{siteIdentity.email}</a>
      </div>
    </footer>
  );
}
