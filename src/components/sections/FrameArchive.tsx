import { portraitAsset } from "../../data/site";

export function FrameArchive() {
  return (
    <section className="frame-archive section-dark" id="frame-archive" aria-labelledby="frame-archive-title">
      <div className="page-width">
        <div className="section-heading section-heading--light section-heading--split">
          <div><p className="section-kicker">04 / Visual archive</p><h2 id="frame-archive-title">Frame <em>archive.</em></h2></div>
          <p>Images are not decoration. They are evidence of a way of seeing.</p>
        </div>
        <div className="frame-archive__layout">
          <figure className="frame-archive__portrait">
            <img src={portraitAsset} alt="Portrait of Zeehad Haque" loading="lazy" width="1565" height="2400" />
            <figcaption><span>Portrait study</span><span>Supplied original</span></figcaption>
          </figure>
          <div className="frame-archive__empty">
            <span className="frame-archive__cross" aria-hidden="true">+</span>
            <p className="section-kicker">Archive awaiting material</p>
            <h3>Frames, light, movement, composition.</h3>
            <p>Approved cinematography stills, personal visual studies and behind-the-lens material will be added here when supplied.</p>
            <div className="frame-archive__categories" aria-label="Planned visual archive categories">
              <span>Frames</span><span>Light</span><span>Movement</span><span>Composition</span><span>Behind the lens</span>
            </div>
          </div>
        </div>
        <div className="section-tail section-tail--light"><span>FRAME ARCHIVE</span><span>Only approved original material</span></div>
      </div>
    </section>
  );
}
