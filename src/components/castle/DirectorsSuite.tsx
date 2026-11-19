import { Video, Scroll, Cpu, Layers } from "lucide-react";
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
