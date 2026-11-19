import { Video, Scroll, Cpu, Layers, MapPin, Compass, Sparkles } from "lucide-react";
import { SITE_CONFIG } from "../../data/siteConfig";

export function DirectorsSuite() {
  return (
    <section id="directors-suite" className="castle-section directors-suite-section">
      {/* Chamber Part A: Director's Suite */}
      <div className="section-header-block">
        <div className="section-pill">
          <Video size={13} />
          <span>CHAMBER 04 // THE DIRECTOR&apos;S SUITE &amp; WRITER&apos;S ROOM</span>
        </div>
        <h2 className="section-title">Cinematic Laboratory &amp; Production Suite</h2>
        <p className="section-subtitle">
          Where constraints convert into distinct visual signatures. Mobile-first 4K capture,
          meticulous color science, and psychoacoustic audio design.
        </p>
      </div>

      {/* Filmmaker Identity Showcase Card */}
      <div className="filmmaker-identity-banner">
        <div className="identity-banner-grid">
          <div className="identity-banner-image-box">
            <img
              src={SITE_CONFIG.filmmakerLocationImage}
              alt="Zeehad Haque — Filmmaker Identity On Location"
              className="identity-banner-img"
              loading="lazy"
            />
            <div className="identity-badge-tag font-mono">
              <MapPin size={12} />
              <span>ON-LOCATION SCOUTING // NATURAL GEOGRAPHY</span>
            </div>
          </div>

          <div className="identity-banner-text-box">
            <div className="section-pill gold-pill">
              <Compass size={12} />
              <span>AUTEUR FILMMAKER IDENTITY</span>
            </div>
            <h3 className="identity-banner-title">
              Zeehad Haque — The Filmmaker&apos;s Gaze
            </h3>
            <p className="identity-banner-subtitle font-mono">
              {SITE_CONFIG.birthIdentity} · {SITE_CONFIG.location}
            </p>

            <blockquote className="identity-banner-quote">
              &ldquo;Cinema is not born in pristine air-conditioned studios; it is discovered
              in the silence of riverbeds, the weight of stone, and the unpredictable angles
              of raw sunlight.&rdquo;
            </blockquote>

            <p className="identity-banner-body">
              Operating independently across Bangladesh, Zeehad treats terrain and natural elements
              as integral dramatic characters. Whether framing psychological suspense in
              claustrophobic corridors or expansive mountain horizons, his mobile-first methodology
              demands complete intentionality in every frame.
            </p>

            <div className="identity-disciplines-row font-mono">
              <span className="discipline-tag">
                <Sparkles size={11} /> DIRECTOR
              </span>
              <span className="discipline-tag">WRITER</span>
              <span className="discipline-tag">CINEMATOGRAPHER</span>
              <span className="discipline-tag">EDITOR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Craft Pillars */}
      <div className="craft-pillars-grid">
        {SITE_CONFIG.craftPillars.map((pillar) => (
          <div key={pillar.title} className="craft-pillar-card">
            <div className="pillar-header">
              <Cpu size={18} className="pillar-icon" />
              <h3 className="pillar-title">{pillar.title}</h3>
            </div>
            <div className="pillar-specs font-mono">{pillar.specs}</div>
            <p className="pillar-detail">{pillar.detail}</p>
          </div>
        ))}
      </div>

      {/* 4-Step Production Workflow */}
      <div className="workflow-container">
        <h3 className="workflow-title font-mono">
          <Layers size={16} />
          <span>AUTEUR PRODUCTION LIFECYCLE</span>
        </h3>
        <div className="workflow-steps-grid">
          <div className="workflow-step-card">
            <span className="step-num font-mono">01</span>
            <h4 className="step-name">Concept &amp; Writing</h4>
            <p className="step-desc">
              Transforming psychological core into visual screenplay, scene pacing, and shot plans.
            </p>
          </div>
          <div className="workflow-step-card">
            <span className="step-num font-mono">02</span>
            <h4 className="step-name">Direction &amp; Camera</h4>
            <p className="step-desc">
              Precision blocking, natural light sculpting, and continuous mobile camera tracking.
            </p>
          </div>
          <div className="workflow-step-card">
            <span className="step-num font-mono">03</span>
            <h4 className="step-name">Editing &amp; Rhythm</h4>
            <p className="step-desc">
              Narrative construction via shot juxtaposition, match-cutting, and deliberate silence.
            </p>
          </div>
          <div className="workflow-step-card">
            <span className="step-num font-mono">04</span>
            <h4 className="step-name">Colour &amp; Finishing</h4>
            <p className="step-desc">
              DaVinci Resolve 3D LUT grading, dynamic range refinement, and spatial master export.
            </p>
          </div>
        </div>
      </div>

      {/* Chamber Part B: Writer's Room */}
      <div id="writers-room" className="writers-room-block">
        <div className="writers-room-header">
          <div className="section-pill gold-pill">
            <Scroll size={13} />
            <span>NARRATIVE INCUBATOR // IN-DEVELOPMENT ARCHIVE</span>
          </div>
          <h3 className="writers-room-title">The Writer&apos;s Room</h3>
          <p className="writers-room-subtitle">
            Eight verified original screenplays and narrative treatments currently in development
            under Zeehad Haque&apos;s creative directorship.
          </p>
        </div>

        <div className="screenplays-grid">
          {SITE_CONFIG.writerRoomProjects.map((proj) => (
            <article key={proj.title} className="screenplay-card">
              <div className="screenplay-header">
                <span className="screenplay-status-pill font-mono">{proj.status}</span>
                <span className="screenplay-genre font-mono">{proj.genre}</span>
              </div>

              <h4 className="screenplay-title">{proj.title}</h4>

              <p className="screenplay-logline">{proj.logline}</p>

              <div className="screenplay-tags">
                {proj.tags.map((tag) => (
                  <span key={tag} className="tag-pill font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
