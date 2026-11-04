import { siteIdentity } from "../../data/site";

export function MainFooter() {
  return (
    <footer className="main-footer">
      <div className="page-width main-footer__top">
        <p className="section-kicker">Zeehad Haque / Independent filmmaker</p>
        <a className="main-footer__signature" href="#home" aria-label="Back to home">ZH<span>↗</span></a>
      </div>
      <div className="page-width main-footer__bottom">
        <span>© {new Date().getFullYear()} {siteIdentity.name}</span>
        <span>{siteIdentity.roles}</span>
        <a href="mailto:zeehadhaque@gmail.com">{siteIdentity.email}</a>
      </div>
    </footer>
  );
}
