import React from "react";
import { KineticText } from "./KineticText";

export interface UpcomingProjectItem {
  number: string;
  title: string;
  genre: string;
}

export const ZEEHAD_UPCOMING_PROJECTS: UpcomingProjectItem[] = [
  {
    number: "01",
    title: "GHURPAK (ঘুরপাক)",
    genre: "Psychological Thriller · Comedy",
  },
  {
    number: "02",
    title: "ONUSONDHAN (অনুসন্ধান)",
    genre: "Thriller · Mystery · Comedy",
  },
  {
    number: "03",
    title: "শেষ বিকেল: The Last Meetup",
    genre: "Coming-of-Age · Friendship · Comedy Drama",
  },
  {
    number: "04",
    title: "শ্যামল দীপ (Shyamol Deep)",
    genre: "Slice-of-Life · Friendship · Adventure Drama",
  },
  {
    number: "05",
    title: "প্রতিধ্বনি (Protiddhoni / Echo)",
    genre: "Literary · Psychological Drama",
  },
  {
    number: "06",
    title: "নক্ষত্রের ওপারে (Nakshatrer Opare)",
    genre: "Psychological Mystery · Supernatural",
  },
  {
    number: "07",
    title: "ওই বাড়িটার সামনে যেও না (Don't Go There)",
    genre: "Mystery · Survival · Action · Psychological Suspense",
  },
  {
    number: "08",
    title: "AUTOPSY",
    genre: "Thriller",
  },
  {
    number: "09",
    title: "ELSEWHERE",
    genre: "Adda Noir · Mystery",
  },
  {
    number: "10",
    title: "ILLUSION",
    genre: "Psychological Mystery · Action · Crime · Thriller",
  },
  {
    number: "11",
    title: "PUSHPA: THE DARK SIDE OF THE KNIGHT",
    genre: "Psychological Mystery · Romance · Thriller",
  },
];

export const UpcomingProjectsSection: React.FC = () => {
  return (
    <section id="upcoming" className="liquid-section">
      <div className="liquid-eyebrow">
        <span className="liquid-eyebrow-dot" />
        <span>Future Slate · 11 Projects in Development</span>
      </div>

      <h2
        className="liquid-hero-title"
        style={{ fontSize: "clamp(30px, 4.4vw, 56px)", marginBottom: 12 }}
      >
        <KineticText text="UPCOMING PROJECTS" mode="char" staggerMs={24} />
      </h2>

      <p className="liquid-lead" style={{ marginBottom: 34 }}>
        <KineticText
          text="Original stories in active development — spanning psychological thrillers, poetic drama, supernatural mysteries, and Bangla noir."
          mode="word"
          staggerMs={18}
        />
      </p>

      <div
        className="liquid-grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: 18,
        }}
      >
        {ZEEHAD_UPCOMING_PROJECTS.map((project, idx) => (
          <article
            key={project.number}
            className="liquid-glass"
            data-cursor-label={`SLATE ${project.number}`}
            style={{
              padding: "22px 22px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 14,
              minHeight: 156,
              animationDelay: `${idx * 45}ms`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.22em",
                color: "var(--accent-2)",
              }}
            >
              <span>PROJECT // {project.number}</span>
              <span
                style={{
                  padding: "3px 9px",
                  borderRadius: 999,
                  border: "1px solid var(--glass-border)",
                  background: "rgba(125, 187, 255, 0.08)",
                  fontSize: 9,
                  color: "var(--accent-3)",
                }}
              >
                UPCOMING
              </span>
            </div>

            <h3
              style={{
                margin: 0,
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(18px, 1.55vw, 21px)",
                fontWeight: 600,
                lineHeight: 1.35,
                letterSpacing: "0.02em",
                color: "var(--text-main)",
              }}
            >
              <KineticText text={project.title} mode="word" staggerMs={28} />
            </h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: "auto",
              }}
            >
              {project.genre.split("·").map((tag) => (
                <span
                  key={tag.trim()}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    padding: "4px 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(169, 212, 255, 0.2)",
                    background: "rgba(9, 20, 38, 0.5)",
                    color: "var(--text-soft)",
                  }}
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
