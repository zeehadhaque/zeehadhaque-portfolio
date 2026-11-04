import { academyFeatures } from "../../data/site";

export function AcademySection() {
  return (
    <section className="academy section-cobalt" id="academy" aria-labelledby="academy-title">
      <div className="page-width academy__grid">
        <div className="academy__intro">
          <p className="section-kicker section-kicker--dark">06 / Learning environment</p>
          <h2 id="academy-title">Zee Filmmaking <em>Academy.</em></h2>
          <p>A dedicated filmmaking learning environment, preserved as a distinct part of Zeehad's world.</p>
          <span className="academy__status">Academy experience / Content integration phase</span>
        </div>
        <div className="academy__features">
          <div className="academy__features-head"><span>What is being built</span><span>01—08</span></div>
          <ul>
            {academyFeatures.map((feature, index) => <li key={feature}><span>0{index + 1}</span><strong>{feature}</strong><i aria-hidden="true">↗</i></li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
