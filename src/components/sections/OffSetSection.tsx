import { portraitAsset, siteIdentity } from "../../data/site";

export function OffSetSection() {
  return (
    <section className="off-set section-light" id="off-set" aria-labelledby="off-set-title">
      <div className="page-width off-set__grid">
        <div className="off-set__visual editorial-placeholder" aria-label="Personal portrait archive">
          <div className="off-set__portrait-wrap">
            <img src={portraitAsset} alt="Portrait of Zeehad Haque" loading="lazy" width="1565" height="2400" />
          </div>
          <span className="off-set__visual-label">Beyond the set / Personal archive</span>
          <span className="off-set__visual-index">02—08</span>
        </div>
        <div className="off-set__content">
          <p className="section-kicker">02 / The person beyond the production</p>
          <h2 id="off-set-title"><span>OFF</span><em>SET.</em></h2>
          <p className="off-set__lead">The quieter side of a visual storyteller.</p>
          <p className="off-set__body">{siteIdentity.workingMethod}</p>
          <p className="content-status">Personal photographs, visual studies and behind-the-scenes moments belong here as the archive grows.</p>
          <a className="line-link" href="#frame-archive">Explore the visual archive <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
