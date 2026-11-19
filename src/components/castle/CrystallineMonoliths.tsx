import { Sparkles, Clapperboard, PenTool, Camera, Sliders } from "lucide-react";
import { SITE_CONFIG } from "../../data/siteConfig";

export function CrystallineMonoliths() {
  const icons = [Clapperboard, PenTool, Camera, Sliders];

  return (
    <section id="monoliths" className="castle-section monoliths-section">
      <div className="section-header-block">
        <div className="section-pill">
          <Sparkles size={13} />
          <span>CHAMBER 02 // CRYSTALLINE MONOLITHS</span>
        </div>
        <h2 className="section-title">The Four Pillars of Auteur Craft</h2>
        <p className="section-subtitle">
          Obsidian crystalline structures suspended in volumetric shadow, representing
          uncompromising discipline from screenplay genesis to final grading.
        </p>
      </div>

      <div className="monoliths-grid">
        {SITE_CONFIG.monoliths.map((mono, index) => {
          const IconComponent = icons[index % icons.length];
          return (
            <article key={mono.id} className="monolith-card">
              <div className="monolith-card-inner">
                {/* Numeral and Header */}
                <div className="monolith-top-row">
                  <span className="monolith-numeral font-mono">{mono.numeral}</span>
                  <div className="monolith-icon-glow">
                    <IconComponent size={20} />
                  </div>
                </div>

                <h3 className="monolith-title">{mono.title}</h3>

                <blockquote className="monolith-quote">
                  &ldquo;{mono.quote}&rdquo;
                </blockquote>

                <p className="monolith-description">{mono.description}</p>

                {/* Techniques Tags */}
                <div className="monolith-tags-group">
                  {mono.techniques.map((tech) => (
                    <span key={tech} className="tech-badge font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="monolith-hover-glow" />
            </article>
          );
        })}
      </div>
    </section>
  );
}
