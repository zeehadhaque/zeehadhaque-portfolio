import { siteIdentity } from "../../data/site";

export function MainFooter() {
  return (
    <footer className="main-footer auteur-footer">
      <div className="auteur-footer__main auteur-shell">
        <div><p className="auteur-eyebrow">END CREDITS / A PERSONAL CINEMA</p><a href="#home" className="auteur-footer__name">Zeehad<br /><em>Haque.</em></a></div>
        <div className="auteur-footer__links"><a href="#films">FILMOGRAPHY ↗</a><a href="#projects">PROJECTS ↗</a><a href="#contact">CONTACT ↗</a></div>
      </div>
      <div className="auteur-footer__bottom auteur-shell"><span>© {new Date().getFullYear()} {siteIdentity.name}</span><span>{siteIdentity.roles}</span><span>{siteIdentity.location}</span><a href={`mailto:${siteIdentity.email}`}>{siteIdentity.email}</a></div>
    </footer>
  );
}
