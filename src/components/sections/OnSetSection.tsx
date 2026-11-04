const onSetAreas = ["Directing", "Cinematography", "Visual storytelling", "Editing & colour"] as const;

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
            <article className="practice-item" key={area}>
              <span className="practice-item__number">0{index + 1}</span>
              <h3>{area}</h3>
              <span className="practice-item__line" aria-hidden="true" />
              <p>Original work and production material will appear here when supplied.</p>
            </article>
          ))}
        </div>
        <div className="section-tail section-tail--light"><span>ON SET</span><span>Authentic work only / Archive in progress</span></div>
      </div>
    </section>
  );
}
