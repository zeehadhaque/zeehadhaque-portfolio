const onSetAreas = [
  { title: "Direction", description: "Shaping the idea, performance, visual language and rhythm behind each scene." },
  { title: "Cinematography", description: "Purposeful framing, camera movement, perspective and the use of available light." },
  { title: "Visual storytelling", description: "Building emotion through visual silence, composition, atmosphere and recurring motifs." },
  { title: "Post-production", description: "Editing, colour grading and sound design to bring the final cinematic experience together." },
] as const;

export function OnSetSection() {
  return (
    <section className="on-set section-dark" id="on-set" aria-labelledby="on-set-title">
      <div className="page-width">
        <div className="on-set__intro">
          <div>
            <p className="section-kicker">01 / The work in motion</p>
            <h2 id="on-set-title"><span>ON</span><em>SET.</em></h2>
          </div>
          <div className="on-set__description">
            <p>Behind every frame is a choice. Behind every scene, a reason.</p>
            <span>Writing / Direction / Camera / Edit</span>
          </div>
        </div>
        <div className="on-set__grid">
          {onSetAreas.map((area, index) => (
            <article className="practice-item" key={area.title}>
              <span className="practice-item__number">0{index + 1}</span>
              <h3>{area.title}</h3>
              <span className="practice-item__line" aria-hidden="true" />
              <p>{area.description}</p>
            </article>
          ))}
        </div>
        <a className="on-set__archive-link" href="#films">Explore the film archive <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}
