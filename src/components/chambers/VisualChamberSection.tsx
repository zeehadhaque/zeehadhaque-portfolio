import { siteIdentity } from "../../data/site";

const framingStudies = [
  {
    number: "01",
    code: "2.35 : 1",
    title: "Widescreen negative space",
    copy: "A wide cinematic frame, a deliberate subject position, and room for silence. The empty space carries as much tension as the subject.",
    className: "frame-study--wide",
    ariaLabel: "Widescreen frame with a subject placed left of centre and open negative space on the right",
  },
  {
    number: "02",
    code: "DEEP PERSPECTIVE",
    title: "Frames within frames",
    copy: "Doorways, corridors and converging lines pull the eye into the scene, creating depth before the camera even moves.",
    className: "frame-study--depth",
    ariaLabel: "Nested door frames and perspective lines converging toward a distant vanishing point",
  },
  {
    number: "03",
    code: "LIGHT / SHADOW",
    title: "Silhouette & chiaroscuro",
    copy: "Low-key light, selective highlights and obscured faces let atmosphere reveal what dialogue leaves unsaid.",
    className: "frame-study--shadow",
    ariaLabel: "A narrow beam of light cuts through a dark frame beside a human silhouette",
  },
  {
    number: "04",
    code: "CONTROLLED MOVE",
    title: "Movement with intention",
    copy: "Slow pushes, measured turns and layered foregrounds guide attention. The camera moves only when the emotion needs it.",
    className: "frame-study--movement",
    ariaLabel: "Layered perspective frames and a directional camera movement path",
  },
];

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

function FramingDiagram({ className, ariaLabel }: { className: string; ariaLabel: string }) {
  return (
    <svg
      className={`frame-study__diagram ${className}`}
      viewBox="0 0 400 180"
      role="img"
      aria-label={ariaLabel}
      focusable="false"
    >
      <defs>
        <linearGradient id="frame-light-beam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dceeff" stopOpacity=".42" />
          <stop offset="100%" stopColor="#7dbbff" stopOpacity=".015" />
        </linearGradient>
        <linearGradient id="frame-depth-glow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7dbbff" stopOpacity=".02" />
          <stop offset="50%" stopColor="#7dbbff" stopOpacity=".24" />
          <stop offset="100%" stopColor="#7dbbff" stopOpacity=".02" />
        </linearGradient>
      </defs>

      <rect className="frame-study__glass" x="8" y="9" width="384" height="162" rx="2" />
      <path className="frame-study__grid" d="M136 9V171 M264 9V171 M8 63H392 M8 117H392" />

      {className.includes("wide") && (
        <>
          <path className="frame-study__guide" d="M136 9V171 M264 9V171 M8 63H392 M8 117H392" />
          <circle className="frame-study__subject" cx="112" cy="69" r="11" />
          <path className="frame-study__subject" d="M91 143Q94 95 112 94Q130 95 134 143Z" />
          <path className="frame-study__focus" d="M112 69H145 M112 69V36" />
          <path className="frame-study__negative" d="M188 42H348 M188 52H306" />
          <path className="frame-study__corners" d="M20 27V19H29 M371 19H380V27 M20 153V161H29 M371 161H380V153" />
        </>
      )}

      {className.includes("depth") && (
        <>
          <path className="frame-study__perspective" d="M8 9L200 86L392 9 M8 171L200 86L392 171 M8 63L200 86L392 63 M8 117L200 86L392 117" />
          <path className="frame-study__depth-plane" d="M66 26H334V154H66Z M112 43H288V137H112Z M151 58H249V122H151Z" />
          <path className="frame-study__focus" d="M200 80V92 M194 86H206" />
          <path className="frame-study__vanish" d="M184 86L200 76L216 86L200 96Z" />
        </>
      )}

      {className.includes("shadow") && (
        <>
          <path className="frame-study__beam" d="M24 9H205L282 171H108Z" fill="url(#frame-light-beam)" />
          <path className="frame-study__shadow-block" d="M240 9H392V171H184Z" />
          <circle className="frame-study__silhouette" cx="260" cy="76" r="12" />
          <path className="frame-study__silhouette" d="M232 155Q236 97 260 97Q284 97 290 155Z" />
          <path className="frame-study__light-edge" d="M24 9L108 171 M205 9L282 171" />
          <path className="frame-study__focus" d="M260 76H294 M260 76V42" />
        </>
      )}

      {className.includes("movement") && (
        <>
          <path className="frame-study__depth-plane" d="M36 24H364V156H36Z M76 40H324V140H76Z M116 56H284V124H116Z" />
          <path className="frame-study__move-path" d="M44 130C118 116 141 83 202 88S294 67 354 43" />
          <path className="frame-study__move-arrow" d="M340 42L355 42L350 57" />
          <circle className="frame-study__focus" cx="202" cy="88" r="7" />
          <path className="frame-study__axis" d="M202 18V158 M20 88H380" />
        </>
      )}
    </svg>
  );
}

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
            A spatial study of the visual language behind the films — where
            framing, negative space, perspective, light and camera movement
            shape the emotion before a word is spoken.
          </p>
        </div>

        <div className="frame-language">
          <div className="frame-language__heading">
            <div>
              <p className="identity-kicker">The Zeehad Frame Language</p>
              <h3>Composition is <em>storytelling.</em></h3>
            </div>
            <p>
              A signature built around visual silence, deliberate geometry and
              atmosphere — not decoration.
            </p>
          </div>

          <div className="frame-language__scene">
            {framingStudies.map((study) => (
              <article
                className={`frame-study ${study.className}`}
                key={study.number}
              >
                <div className="frame-study__topline">
                  <span className="tabular-nums">{study.number} / 04</span>
                  <span>{study.code}</span>
                </div>
                <FramingDiagram
                  className={study.className}
                  ariaLabel={study.ariaLabel}
                />
                <div className="frame-study__copy">
                  <h4>{study.title}</h4>
                  <p>{study.copy}</p>
                </div>
                <span className="frame-study__depth-mark" aria-hidden="true" />
              </article>
            ))}
          </div>

          <div className="frame-language__signature">
            <span className="identity-kicker">Visual signature</span>
            <p>
              Wide frames. Quiet centres. Deep corridors. Light against
              darkness. A camera that moves with purpose.
            </p>
          </div>
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
