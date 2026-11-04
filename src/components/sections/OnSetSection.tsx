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
        <div className="section-heading section-heading--light">
          <p className="section-kicker">01 / Professional practice</p>
          <h2 id="on-set-title">On <em>set.</em></h2>
          <p>The work begins with a frame, a decision and a reason to move the camera.</p>
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
        <div className="section-tail section-tail--light"><span>ON SET</span><span>Writing / Direction / Camera / Edit</span></div>
      </div>
    </section>
  );
}
