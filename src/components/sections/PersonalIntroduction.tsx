import { siteIdentity } from "../../data/site";

export function PersonalIntroduction() {
  return (
    <section className="personal-introduction section-light" id="introduction" aria-labelledby="introduction-title">
      <div className="page-width personal-introduction__grid">
        <div className="personal-introduction__label">
          <span className="section-kicker">The filmmaker / Identity</span>
          <span className="vertical-rule" aria-hidden="true" />
        </div>
        <div className="personal-introduction__content">
          <p className="section-kicker personal-introduction__eyebrow">Zeehad Haque Identity</p>
          <h2 id="introduction-title">The person<br />behind the <em>frame.</em></h2>
          <p className="personal-introduction__statement">{siteIdentity.statement}</p>
          <p className="personal-introduction__bio">{siteIdentity.biography}</p>
          <div className="personal-introduction__details">
            <p>{siteIdentity.roles}</p>
            <p>{siteIdentity.location}</p>
          </div>
          <div className="personal-introduction__focus">
            <span className="section-kicker">Creative focus</span>
            <ul>
              {siteIdentity.creativeFocus.map((focus) => <li key={focus}>{focus}</li>)}
            </ul>
          </div>
          <p className="personal-introduction__method">{siteIdentity.workingMethod}</p>
        </div>
        <div className="personal-introduction__mark" aria-hidden="true">ZH<span>IDENTITY / 01</span></div>
      </div>
    </section>
  );
}
