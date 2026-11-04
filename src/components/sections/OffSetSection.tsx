import { portraitAsset } from "../../data/site";

export function OffSetSection() {
  return (
    <section className="off-set section-light" id="off-set" aria-labelledby="off-set-title">
      <div className="page-width off-set__grid">
        <div className="off-set__visual editorial-placeholder" aria-label="Portrait-led personal archive">
          <div className="off-set__portrait-wrap"><img src={portraitAsset} alt="Portrait of Zeehad Haque" loading="lazy" width="1565" height="2400" /></div>
          <span className="off-set__visual-label">Portrait / supplied original</span>
          <span className="off-set__visual-index">02—08</span>
        </div>
        <div className="off-set__content">
          <p className="section-kicker">02 / Personal visual language</p>
          <h2 id="off-set-title">Off <em>set.</em></h2>
          <p className="off-set__lead">The space around the work. The quiet details. The images that stay after the scene cuts.</p>
          <p className="content-status">Additional personal photography and visual studies will appear here when approved material is supplied.</p>
          <a className="line-link" href="#frame-archive">View the frame archive <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
