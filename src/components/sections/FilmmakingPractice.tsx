import { siteIdentity } from "../../data/site";

export function FilmmakingPractice() {
  return (
    <section className="filmmaking-practice section-dark" id="filmmaking-practice" aria-labelledby="filmmaking-practice-title">
      <div className="page-width">
        <div className="section-heading section-heading--light">
          <p className="section-kicker">02 / The craft behind the frame</p>
          <h2 id="filmmaking-practice-title">Made with intent.<br /><em>Not limitation.</em></h2>
          <p>{siteIdentity.filmmakingApproach}</p>
        </div>

        <div className="filmmaking-practice__workflow">
          <p className="section-kicker">A film takes shape</p>
          <div className="filmmaking-practice__steps">
            {siteIdentity.productionWorkflow.map((step) => (
              <article className="filmmaking-practice__step" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="filmmaking-practice__tools">
          <div>
            <p className="section-kicker">Independent filmmaker / Toolkit</p>
            <h3>Small setup.<br /><em>Big intention.</em></h3>
            <p className="filmmaking-practice__note">A practical, mobile-first production workflow built around available equipment and story-led decisions.</p>
          </div>
          <ul>
            {siteIdentity.toolsAndCraft.map((tool) => <li key={tool}>{tool}</li>)}
          </ul>
        </div>

        <div className="filmmaking-practice__projects">
          <div className="section-heading section-heading--light">
            <p className="section-kicker">Selected work / Screenplays / Development</p>
            <h3>Stories in <em>different stages.</em></h3>
          </div>
          <div className="filmmaking-practice__project-grid">
            {siteIdentity.creativeProjects.map((project, index) => (
              <article className="filmmaking-practice__project" key={project.title}>
                <span className="filmmaking-practice__project-number">0{index + 1}</span>
                <div>
                  <p className="section-kicker">{project.category}</p>
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                  <span className="filmmaking-practice__status">{project.status}</span>
                  {project.href && <a href={project.href} target="_blank" rel="noreferrer">Watch teaser ↗</a>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
