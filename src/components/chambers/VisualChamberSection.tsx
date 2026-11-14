import { siteIdentity } from "../../data/site";

const craftPillars = [
  {
    number: "01",
    title: "Direction",
    copy: "The emotional centre of a scene comes first. Performance, blocking and visual language follow.",
  },
  {
    number: "02",
    title: "Cinematography",
    copy: "Framing, movement, perspective and available light turn a real location into a point of view.",
  },
  {
    number: "03",
    title: "Visual Storytelling",
    copy: "Images, recurring motifs, silence and atmosphere carry the parts of a story that words cannot.",
  },
  {
    number: "04",
    title: "Post-Production",
    copy: "Editing, colour and sound design shape the rhythm, tension and final emotional impact.",
  },
];

export function VisualChamberSection() {
  return (
    <section
      className="dest dest-frame"
      id="projection-room"
      aria-labelledby="frame-title"
    >
      <span id="frame" className="anchor-alias" aria-hidden="true" />
      <span id="visual-chamber" className="anchor-alias" aria-hidden="true" />
      <span id="frame-archive" className="anchor-alias" aria-hidden="true" />
      <span id="on-set" className="anchor-alias" aria-hidden="true" />

      <div className="castle-shell">
        <div className="dest-head">
          <div>
            <p className="identity-kicker">
              03 · The Projection Room · Optical Booth &amp; Framing
            </p>
            <h2 id="frame-title">
              Frames sculpted through <em>lens &amp; shadow.</em>
            </h2>
          </div>
          <p className="dest-head__lead">
            A closer look at the craft behind each frame — from composition,
            camera movement and available light to the rhythm of the final edit.
          </p>
        </div>

        <div className="frame-craft-grid">
          <div className="frame-pillars">
            {craftPillars.map((item) => (
              <article className="frame-pillar" key={item.number}>
                <span className="tabular-nums">{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>

          <div className="frame-toolkit">
            <div className="frame-toolkit__intro">
              <p className="identity-kicker">Mobile-First Projection Workflow</p>
              <h3>
                Compact instrumentation. <em>Theatrical scale.</em>
              </h3>
              <p>{siteIdentity.filmmakingApproach}</p>
            </div>
            <ul className="frame-toolkit__list">
              {siteIdentity.toolsAndCraft.map((tool, idx) => (
                <li key={tool}>
                  <span className="tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span>{tool}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
