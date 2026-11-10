import { useEffect, useState, type FormEvent } from "react";
import { AcademySection } from "../academy/AcademySection";
import {
  filmProjects,
  futureProjects,
  identityPortraitAsset,
  portraitAsset,
  siteIdentity,
} from "../../data/site";
import type { FilmProject } from "../../types/content";

const craft = [
  { number: "01", title: "Direction", copy: "The emotional centre of a scene comes first. Performance, blocking and visual language follow." },
  { number: "02", title: "Cinematography", copy: "Framing, movement, perspective and available light turn a location into a point of view." },
  { number: "03", title: "Visual storytelling", copy: "Images, recurring motifs, silence and atmosphere carry the parts of a story that words cannot." },
  { number: "04", title: "Post-production", copy: "Editing, colour and sound design shape the rhythm, tension and final emotional impact." },
];

const workflow = [
  { number: "01", title: "Find the feeling", copy: "Define what the audience should feel before deciding what the camera should show." },
  { number: "02", title: "Write the image", copy: "Build the screenplay, visual motifs, blocking and a practical shot plan around that feeling." },
  { number: "03", title: "Shape the scene", copy: "Direct performance and compose with movement, available light, perspective and continuity." },
  { number: "04", title: "Finish with intent", copy: "Edit for rhythm, shape the colour, design the sound and finish the film for its screen." },
];

const knownFilmTitles: Record<string, string> = {
  ZSttExMBavg: "SHADOW / III",
  Zoqn6CyBIzU: "DON'T GO THERE — TEASER",
};

type FormState = "idle" | "sending" | "success" | "error";

export function CompletePortfolio() {
  const [selectedFilm, setSelectedFilm] = useState<FilmProject | null>(null);
  const [formState, setFormState] = useState<FormState>("idle");
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedFilm) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedFilm(null);
    };
    document.body.classList.add("modal-is-open");
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-is-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedFilm]);

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState("sending");
    setFormMessage("");
    const form = event.currentTarget;
    const values = new FormData(form);
    const payload = {
      name: String(values.get("name") ?? ""),
      email: String(values.get("email") ?? ""),
      subject: String(values.get("subject") ?? ""),
      message: String(values.get("message") ?? ""),
      website: String(values.get("website") ?? ""),
    };
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error("The contact service is not configured yet. Please email Zeehad directly.");
      }
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "The message could not be sent.");
      setFormState("success");
      setFormMessage("Your message has been received. Thank you.");
      form.reset();
    } catch (error) {
      setFormState("error");
      setFormMessage(error instanceof Error ? error.message : "The message could not be sent.");
    }
  };

  return (
    <main id="main-content" className="auteur-site">
      <section className="auteur-hero" id="home" aria-labelledby="auteur-title">
        <div className="auteur-hero__grain" aria-hidden="true" />
        <div className="auteur-hero__index" aria-hidden="true">INDEPENDENT CINEMA / 001</div>
        <div className="auteur-shell auteur-hero__layout">
          <div className="auteur-hero__copy">
            <p className="auteur-eyebrow"><span /> INDEPENDENT FILMMAKER · BANGLADESH</p>
            <h1 id="auteur-title" className="auteur-hero__title">
              <span>Zeehad</span>
              <em>Haque.</em>
            </h1>
            <p className="auteur-hero__roles">Director <i /> Writer <i /> Cinematographer <i /> Editor</p>
            <p className="auteur-hero__statement">Cinema begins where <em>words fall silent.</em></p>
            <div className="auteur-hero__actions">
              <a className="auteur-button auteur-button--solid" href="#films">Explore the films <span>↗</span></a>
              <a className="auteur-text-link" href="#about">Meet the filmmaker <span>↓</span></a>
            </div>
            <div className="auteur-hero__signature">
              <span>GAZIPUR</span><span className="auteur-hero__signature-line" /><span>DHAKA, BANGLADESH</span>
            </div>
          </div>
          <div className="auteur-hero__portrait" data-reveal>
            <div className="auteur-hero__portrait-top"><span>PORTRAIT / 01</span><span>THE PERSON BEHIND THE FRAME</span></div>
            <figure>
              <img src={identityPortraitAsset} alt="Zeehad Haque — independent filmmaker, director, writer and cinematographer from Bangladesh" width="1565" height="2400" fetchPriority="high" />
              <figcaption><strong>Zeehad Haque</strong><span>Independent filmmaker</span></figcaption>
            </figure>
            <span className="auteur-hero__portrait-caption">A PERSONAL CINEMATIC PRACTICE / MMXXVI</span>
          </div>
        </div>
        <a className="auteur-hero__scroll" href="#about"><span>SCROLL TO ENTER</span><i /></a>
      </section>

      <section className="auteur-about auteur-paper" id="about" aria-labelledby="about-title">
        <div className="auteur-shell">
          <div className="auteur-section-top" data-reveal><span>01 / THE FILMMAKER</span><span>AN INTRODUCTION</span></div>
          <div className="auteur-about__grid">
            <div className="auteur-about__heading" data-reveal>
              <p className="auteur-eyebrow auteur-eyebrow--dark">A POINT OF VIEW</p>
              <h2 id="about-title">I make films<br />that <em>stay with you.</em></h2>
              <span className="auteur-red-rule" />
            </div>
            <div className="auteur-about__copy" data-reveal>
              <p className="auteur-about__lead">I’m Zeehad Haque, an independent filmmaker from Gazipur, Bangladesh.</p>
              <p>{siteIdentity.biography}</p>
              <p>My practice moves between psychological suspense, mystery and intimate human stories. I’m interested in the tension inside a quiet frame, in the way a location can become a character, and in how sound can transform an image.</p>
              <a className="auteur-inline-link" href="#process">Read my creative approach <span>↗</span></a>
            </div>
          </div>
          <div className="auteur-about__credits" data-reveal>
            <div><strong>01</strong><span>WRITING & DIRECTION</span></div>
            <div><strong>02</strong><span>CINEMATOGRAPHY</span></div>
            <div><strong>03</strong><span>EDITING & COLOUR</span></div>
            <div><strong>04</strong><span>SOUND & ATMOSPHERE</span></div>
          </div>
        </div>
      </section>

      <section className="auteur-films auteur-night" id="films" aria-labelledby="films-title">
        <div className="auteur-shell">
          <div className="auteur-section-top" data-reveal><span>02 / FILMOGRAPHY</span><span>SELECTED WORK · 01—08</span></div>
          <div className="auteur-section-heading auteur-section-heading--light" data-reveal>
            <div><p className="auteur-eyebrow">THE MOVING IMAGE</p><h2 id="films-title">Stories told<br />in <em>light & silence.</em></h2></div>
            <p>Short films, visual experiments and teasers. Each project is an exploration of mood, perspective and the images that remain after the story ends.</p>
          </div>
          <div className="auteur-film-grid">
            {filmProjects.map((film, index) => (
              <article className="auteur-film-card" data-reveal key={film.id}>
                <button type="button" onClick={() => setSelectedFilm(film)} aria-label={`Watch ${knownFilmTitles[film.videoId] ?? `selected film ${index + 1}`}`}>
                  <span className="auteur-film-card__image">
                    <img src={`https://i.ytimg.com/vi/${film.videoId}/hqdefault.jpg`} alt={knownFilmTitles[film.videoId] ? `${knownFilmTitles[film.videoId]} film still` : `Film still ${index + 1} from Zeehad Haque's filmography`} loading="lazy" width="480" height="360" />
                    <span className="auteur-film-card__number">0{index + 1}</span><span className="auteur-film-card__play">↗</span>
                  </span>
                  <span className="auteur-film-card__meta"><strong>{knownFilmTitles[film.videoId] ?? `SELECTED FILM / 0${index + 1}`}</strong><small>{film.isShort ? "SHORT FORM" : film.title ? "TEASER" : "SHORT FILM / VISUAL STUDY"}</small></span>
                </button>
              </article>
            ))}
          </div>
          <div className="auteur-section-bottom"><span>FILMOGRAPHY / ORIGINAL SOURCES</span><span>SELECT A FRAME TO WATCH</span></div>
        </div>
      </section>

      <section className="auteur-frames auteur-paper" id="frame-archive" aria-labelledby="frames-title">
        <div className="auteur-shell">
          <div className="auteur-section-top" data-reveal><span>03 / FRAME STUDIES</span><span>A VISUAL NOTEBOOK</span></div>
          <div className="auteur-frames__heading" data-reveal><h2 id="frames-title">The world<br /><em>in frames.</em></h2><p>Light, texture, distance and stillness. A collection of visual fragments from the films and the worlds around them.</p></div>
          <div className="auteur-frame-wall">
            {filmProjects.map((film, index) => (
              <a className={`auteur-frame auteur-frame--${(index % 4) + 1}`} data-reveal href={film.sourceUrl} target="_blank" rel="noreferrer" key={film.id}>
                <img src={`https://i.ytimg.com/vi/${film.videoId}/hqdefault.jpg`} alt={`Cinematic frame ${index + 1} from Zeehad Haque's selected film work`} loading="lazy" width="480" height="360" />
                <span><b>FRAME / 0{index + 1}</b><i>OPEN SOURCE ↗</i></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="auteur-craft auteur-night" id="on-set" aria-labelledby="craft-title">
        <div className="auteur-shell">
          <div className="auteur-section-top" data-reveal><span>04 / THE CRAFT</span><span>IDEA → IMAGE → EMOTION</span></div>
          <div className="auteur-section-heading auteur-section-heading--light" data-reveal><div><p className="auteur-eyebrow">BEHIND EVERY FRAME</p><h2 id="craft-title">A deliberate<br /><em>visual language.</em></h2></div><p>Every creative decision begins with the story. Technique is not decoration; it is how an idea becomes an experience.</p></div>
          <div className="auteur-craft-grid">
            {craft.map((item) => <article className="auteur-craft-card" data-reveal key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.copy}</p><i aria-hidden="true" /></article>)}
          </div>
        </div>
      </section>

      <section className="auteur-beyond auteur-paper" id="off-set" aria-labelledby="beyond-title">
        <div className="auteur-shell auteur-beyond__grid">
          <div className="auteur-beyond__image" data-reveal><img src={portraitAsset} alt="Zeehad Haque outside the film set" loading="lazy" width="1565" height="2400" /><span>BEYOND THE SET / PERSONAL ARCHIVE</span></div>
          <div className="auteur-beyond__copy" data-reveal><div className="auteur-section-top"><span>05 / BEYOND THE CAMERA</span><span>OBSERVATION & MEMORY</span></div><p className="auteur-eyebrow auteur-eyebrow--dark">THE PERSON, NOT JUST THE ROLE</p><h2 id="beyond-title">Always looking.<br /><em>Always learning.</em></h2><p className="auteur-beyond__lead">The camera can rest. Observation doesn't.</p><p>{siteIdentity.workingMethod}</p><p>Places, gestures, sounds and the changing quality of light become notes for the next scene. The work begins long before a camera starts recording.</p><a className="auteur-inline-link" href="#projects">Explore the stories in development <span>↗</span></a></div>
        </div>
      </section>

      <section className="auteur-process auteur-night" id="process" aria-labelledby="process-title">
        <div className="auteur-shell">
          <div className="auteur-section-top" data-reveal><span>06 / FROM SCRIPT TO SCREEN</span><span>THE CREATIVE METHOD</span></div>
          <div className="auteur-section-heading auteur-section-heading--light" data-reveal><div><p className="auteur-eyebrow">MY APPROACH</p><h2 id="process-title">Every choice<br /><em>serves the story.</em></h2></div><p>{siteIdentity.filmmakingApproach}</p></div>
          <div className="auteur-workflow">
            {workflow.map((step) => <article data-reveal key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.copy}</p></div></article>)}
          </div>
          <div className="auteur-toolkit" data-reveal><div><p className="auteur-eyebrow">THE INDEPENDENT TOOLKIT</p><h3>Small setup.<br /><em>Clear intention.</em></h3><p>An independent, mobile-first filmmaking practice. Available tools and real locations become part of the visual language.</p></div><ul>{siteIdentity.toolsAndCraft.map((tool) => <li key={tool}>{tool}</li>)}</ul></div>
        </div>
      </section>

      <section className="auteur-slate auteur-paper" id="projects" aria-labelledby="slate-title">
        <div className="auteur-shell">
          <div className="auteur-section-top" data-reveal><span>07 / THE CREATIVE SLATE</span><span>ORIGINAL STORIES & SCREENPLAYS</span></div>
          <div className="auteur-frames__heading" data-reveal><h2 id="slate-title">Stories still<br /><em>becoming.</em></h2><p>Original concepts and screenplays moving through different stages of writing and development. Each story has its own emotional centre and visual world.</p></div>
          <ol className="auteur-project-list">
            {futureProjects.map((project, index) => <li data-reveal key={project.title}><span>0{index + 1}</span><h3>{project.title}</h3><p>{project.genre}</p><i>↗</i></li>)}
          </ol>
        </div>
      </section>

      <section className="auteur-academy" id="academy" aria-label="Zee Filmmaking Academy"><AcademySection /></section>

      <section className="auteur-contact auteur-night" id="contact" aria-labelledby="contact-title">
        <div className="auteur-shell">
          <div className="auteur-section-top" data-reveal><span>08 / THE NEXT FRAME</span><span>CONTACT & COLLABORATION</span></div>
          <div className="auteur-contact__intro" data-reveal><p className="auteur-eyebrow">HAVE A STORY WORTH TELLING?</p><h2 id="contact-title">Let's make<br /><em>something matter.</em></h2><p>For independent productions, film collaborations, creative projects or a thoughtful conversation about cinema.</p></div>
          <div className="auteur-contact__grid">
            <div className="auteur-contact__details" data-reveal><span>GET IN TOUCH</span><a href={`mailto:${siteIdentity.email}`}>{siteIdentity.email}</a><a href="https://wa.me/8801629851155" target="_blank" rel="noreferrer">{siteIdentity.whatsapp}</a><p>{siteIdentity.location}</p><div className="auteur-contact__availability"><i /> OPEN TO SELECT COLLABORATIONS</div></div>
            <form className="auteur-contact-form" data-reveal onSubmit={submitContact}>
              <label><span>YOUR NAME</span><input name="name" type="text" autoComplete="name" required maxLength={100} placeholder="How should I address you?" /></label>
              <label><span>EMAIL ADDRESS</span><input name="email" type="email" autoComplete="email" required maxLength={200} placeholder="you@example.com" /></label>
              <label><span>SUBJECT</span><input name="subject" type="text" maxLength={160} placeholder="Project / Collaboration / Other" /></label>
              <label><span>YOUR MESSAGE</span><textarea name="message" rows={4} required maxLength={4000} placeholder="Tell me a little about the idea…" /></label>
              <label className="auteur-contact-form__trap" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
              <div className="auteur-contact-form__submit"><button type="submit" disabled={formState === "sending"}>{formState === "sending" ? "SENDING…" : "SEND INQUIRY"} <span>↗</span></button><p role="status" aria-live="polite" data-state={formState}>{formMessage}</p></div>
            </form>
          </div>
        </div>
      </section>

      {selectedFilm && <div className="auteur-film-modal" role="dialog" aria-modal="true" aria-label={knownFilmTitles[selectedFilm.videoId] ?? "Selected film"}><button className="auteur-film-modal__backdrop" type="button" onClick={() => setSelectedFilm(null)} aria-label="Close film viewer" /><div className="auteur-film-modal__window"><div><span>{knownFilmTitles[selectedFilm.videoId] ?? "SELECTED FILM"}</span><button type="button" onClick={() => setSelectedFilm(null)} aria-label="Close">×</button></div><iframe title={knownFilmTitles[selectedFilm.videoId] ?? "Selected film"} src={`https://www.youtube-nocookie.com/embed/${selectedFilm.videoId}?rel=0&modestbranding=1`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /><a href={selectedFilm.sourceUrl} target="_blank" rel="noreferrer">OPEN ORIGINAL SOURCE ↗</a></div></div>}
    </main>
  );
}
