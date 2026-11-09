import { futureProjects } from "../../data/site";

export function FutureProjects() {
  return (
    <section className="future-projects section-light" id="projects" aria-labelledby="projects-title">
      <div className="page-width">
        <div className="section-heading section-heading--split">
          <div><p className="section-kicker">08 / The upcoming slate</p><h2 id="projects-title">Stories still<br /><em>becoming.</em></h2></div>
          <p>A living slate of ideas moving through different stages of writing and development. The stories come first; details will follow when they are ready to be shared.</p>
        </div>
        <ol className="future-projects__list">
          {futureProjects.map((project, index) => (
            <li key={project.title}>
              <span>0{index + 1}</span>
              <h3>{project.title}</h3>
              <p>{project.genre}</p>
              <span className="future-projects__arrow" aria-hidden="true">↗</span>
            </li>
          ))}
        </ol>
        <div className="section-tail"><span>IN DEVELOPMENT</span><span>Eight projects / Details pending</span></div>
      </div>
    </section>
  );
}
