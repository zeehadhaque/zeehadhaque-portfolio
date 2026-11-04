import { siteIdentity } from "../../data/site";

export function PersonalIntroduction() {
  return (
    <section className="personal-introduction section-light" id="introduction" aria-labelledby="introduction-title">
      <div className="page-width personal-introduction__grid">
        <div className="personal-introduction__label"><span className="section-kicker">A note from Zeehad</span><span className="vertical-rule" aria-hidden="true" /></div>
        <div className="personal-introduction__content">
          <h2 id="introduction-title">A note from <em>Zeehad.</em></h2>
          <p className="personal-introduction__statement">{siteIdentity.statement}</p>
          <div className="personal-introduction__details">
            <p>{siteIdentity.roles}</p>
            <p>{siteIdentity.location}</p>
          </div>
          <p className="content-status">A full director's statement and verified biography will be added when supplied.</p>
        </div>
        <div className="personal-introduction__mark" aria-hidden="true">ZH<span>01</span></div>
      </div>
    </section>
  );
}
