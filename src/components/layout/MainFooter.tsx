import { siteIdentity } from "../../data/site";

export function MainFooter() {
  return (
    <footer className="main-footer">
      <div className="page-width main-footer__top">
        <p className="section-kicker">Zeehad Haque Identity / Independent filmmaker</p>
        <a className="main-footer__signature" href="#home" aria-label="Back to home">ZH<span>↗</span></a>
      </div>
      <div className="page-width main-footer__bottom">
        <span>© {new Date().getFullYear()} {siteIdentity.name}</span>
        <span>{siteIdentity.roles}</span>
        <span>{siteIdentity.location}</span>
        <a href={"mailto:" + siteIdentity.email}>{siteIdentity.email}</a>
        <a href="https://wa.me/8801629851155" target="_blank" rel="noreferrer">{siteIdentity.whatsapp}</a>
      </div>
    </footer>
  );
}
