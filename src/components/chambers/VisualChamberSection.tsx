import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import palaceAuditoriumImg from "../../assets/images/palace_imax_auditorium_1794660878336.jpg";
import palaceExteriorImg from "../../assets/images/palace_exterior_night_1794660878890.jpg";
import palaceFoyerImg from "../../assets/images/palace_grand_foyer_1794660878711.jpg";
import lensStillImg from "../../assets/images/visual_chamber_lens_1794658897186.jpg";
import { siteIdentity } from "../../data/site";

interface VisualPlate {
  id: string;
  title: string;
  discipline: string;
  aspect: string;
  caption: string;
  image: string;
}

const visualPlates: readonly VisualPlate[] = [
  {
    id: "imax-auditorium",
    title: "The Main Auditorium Projection Beam",
    discipline: "Anamorphic Projection & Atmosphere",
    aspect: "2.39 : 1",
    caption:
      "A 60-foot volumetric light shaft descending from the palace booth toward the widescreen proscenium — celebrating monumental cinema scale, velvet shadow, and deliberate negative space.",
    image: palaceAuditoriumImg,
  },
  {
    id: "palace-exterior",
    title: "The Palace Facade at Midnight",
    discipline: "Architectural Establishing Shot",
    aspect: "2.39 : 1",
    caption:
      "Towering obsidian colonnades, twin sweeping exterior searchlights, and wet black marble steps built to establish epic proportion before a single line is spoken.",
    image: palaceExteriorImg,
  },
  {
    id: "grand-foyer",
    title: "The Triple-Height Grand Foyer",
    discipline: "Warm Gold & Cold Moonlight Balance",
    aspect: "2.00 : 1",
    caption:
      "High clerestory moonlight intersecting brushed brass balustrades and bifurcated stone stairs — testing color temperature contrast across monumental depth.",
    image: palaceFoyerImg,
  },
  {
    id: "optical-lens",
    title: "Optical Glass & Clerestory Shadow",
    discipline: "Camera & Perspective",
    aspect: "1.85 : 1",
    caption:
      "Treating optical glass, camera placement, and available window contrast as deliberate storytelling instruments.",
    image: lensStillImg,
  },
  {
    id: "shadow-iii",
    title: "SHADOW / III — Archive Study",
    discipline: "Psychological Suspense",
    aspect: "16 : 9",
    caption:
      "Stillness, repetition, and spatial unease captured from Zeehad Haque's short film archive.",
    image: "https://i.ytimg.com/vi/ZSttExMBavg/hqdefault.jpg",
  },
  {
    id: "dont-go-there",
    title: "Don't Go There — Teaser Frame",
    discipline: "Mystery & Survival",
    aspect: "16 : 9",
    caption:
      "Visual tone frame shaped by nocturnal suspense and environmental isolation.",
    image: "https://i.ytimg.com/vi/Zoqn6CyBIzU/hqdefault.jpg",
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

export function VisualChamberSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % visualPlates.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + visualPlates.length) % visualPlates.length,
        );
      }
    };
    document.body.classList.add("modal-is-open");
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-is-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIndex]);

  const activePlate = visualPlates[selectedIndex] ?? visualPlates[0];
  const lightboxPlate =
    lightboxIndex !== null ? visualPlates[lightboxIndex] : null;

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
            Inspect framing geometry, projector beams, and chiaroscuro
            composition from the palace optical booth. Select any contact-sheet
            plate or expand fullscreen.
          </p>
        </div>

        <div className="frame-exhibition">
          <div className="frame-stage">
            <button
              type="button"
              className="frame-stage__viewport"
              onClick={() => setLightboxIndex(selectedIndex)}
              aria-label={`Inspect ${activePlate.title} fullscreen`}
            >
              {!failedImages[activePlate.id] ? (
                <img
                  src={activePlate.image}
                  alt={`${activePlate.title} — ${activePlate.discipline}`}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setFailedImages((prev) => ({
                      ...prev,
                      [activePlate.id]: true,
                    }))
                  }
                />
              ) : (
                <div className="frame-stage__fallback">
                  <span>{activePlate.discipline}</span>
                  <strong>{activePlate.title}</strong>
                </div>
              )}
              <div className="frame-stage__reticle" aria-hidden="true">
                <i />
                <i />
              </div>
              <span className="frame-stage__expand" aria-hidden="true">
                <Maximize2 size={15} />
                <span>Inspect Fullscreen</span>
              </span>
            </button>

            <div className="frame-stage__ledger">
              <div className="frame-stage__meta">
                <span className="tabular-nums">
                  Plate {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                  {String(visualPlates.length).padStart(2, "0")}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{activePlate.aspect}</span>
                <span aria-hidden="true">·</span>
                <span>{activePlate.discipline}</span>
              </div>
              <h3>{activePlate.title}</h3>
              <p>{activePlate.caption}</p>
            </div>
          </div>

          <div
            className="frame-contact-sheet"
            role="listbox"
            aria-label="Projection room cinematography plates"
          >
            {visualPlates.map((plate, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={plate.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`frame-plate-btn ${isSelected ? "is-selected" : ""}`}
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`Select plate ${index + 1}: ${plate.title}`}
                >
                  <div className="frame-plate-btn__thumb">
                    {!failedImages[plate.id] ? (
                      <img
                        src={plate.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({
                            ...prev,
                            [plate.id]: true,
                          }))
                        }
                      />
                    ) : (
                      <div className="frame-plate-btn__fallback" />
                    )}
                    <span className="tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <strong>{plate.title}</strong>
                </button>
              );
            })}
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

      {lightboxPlate && lightboxIndex !== null && (
        <div
          className="identity-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${lightboxPlate.title} fullscreen view`}
        >
          <button
            type="button"
            className="identity-modal__backdrop"
            aria-label="Close visual lightbox"
            onClick={() => setLightboxIndex(null)}
          />
          <div className="identity-modal__dialog identity-modal__dialog--lightbox">
            <div className="identity-modal__top">
              <span className="identity-kicker tabular-nums">
                Plate {String(lightboxIndex + 1).padStart(2, "0")} /{" "}
                {String(visualPlates.length).padStart(2, "0")} ·{" "}
                {lightboxPlate.discipline}
              </span>
              <button
                type="button"
                className="identity-modal__close"
                aria-label="Close lightbox"
                onClick={() => setLightboxIndex(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="identity-lightbox__stage">
              <img
                src={lightboxPlate.image}
                alt={lightboxPlate.title}
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="identity-lightbox__footer">
              <div>
                <h3>{lightboxPlate.title}</h3>
                <p>{lightboxPlate.caption}</p>
              </div>
              <div className="identity-lightbox__controls">
                <button
                  type="button"
                  aria-label="Previous plate"
                  onClick={() =>
                    setLightboxIndex(
                      (lightboxIndex - 1 + visualPlates.length) %
                        visualPlates.length,
                    )
                  }
                >
                  <ChevronLeft size={16} />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  aria-label="Next plate"
                  onClick={() =>
                    setLightboxIndex((lightboxIndex + 1) % visualPlates.length)
                  }
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
