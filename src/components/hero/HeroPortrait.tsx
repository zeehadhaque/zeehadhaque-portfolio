import { useState, type PointerEvent } from "react";
import { identityPortraitAsset, siteIdentity } from "../../data/site";
import { CinematicUniverse } from "./CinematicUniverse";

export function HeroPortrait() {
  const [entered, setEntered] = useState(false);
  const [portraitFailed, setPortraitFailed] = useState(false);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    event.currentTarget.style.setProperty("--pointer-x", `${x * 1.2}deg`);
    event.currentTarget.style.setProperty("--pointer-y", `${y * -1.2}deg`);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.removeProperty("--pointer-x");
    event.currentTarget.style.removeProperty("--pointer-y");
  };

  const enterFrame = () => {
    setEntered(true);
    window.setTimeout(() => document.getElementById("introduction")?.scrollIntoView({ behavior: "smooth" }), 380);
  };

  return (
    <section className={`hero-portrait ${entered ? "is-entered" : ""}`} id="home" aria-labelledby="hero-title">
      <CinematicUniverse />
      <div className="hero-portrait__contours" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="hero-portrait__side-label hero-portrait__side-label--left" aria-hidden="true">Independent filmmaker / 01</div>
      <div className="hero-portrait__side-label hero-portrait__side-label--right" aria-hidden="true">Gazipur · Bangladesh</div>

      <div className="hero-portrait__inner page-width">
        <div className="hero-portrait__copy">
          <p className="section-kicker hero-portrait__kicker"><span /> Zeehad Haque Identity</p>
          <h1 id="hero-title" className="hero-portrait__title">
            <span>Zeehad</span>
            <span>Haque</span>
          </h1>
          <p className="hero-portrait__roles">{siteIdentity.roles}</p>
          <div className="hero-portrait__statement">
            <span className="hero-portrait__quote-mark" aria-hidden="true">“</span>
            <p>I DON'T JUST CAPTURE FRAMES.<br className="hero-portrait__desktop-break" /> <em>I CREATE WORLDS.</em></p>
          </div>
          <button className="enter-frame-button" type="button" onClick={enterFrame}>
            <span>Enter the frame</span>
            <span className="enter-frame-button__arrow" aria-hidden="true">↘</span>
          </button>
          <a className="hero-portrait__work-link" href="#films">
            <span>Explore selected films</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="hero-portrait__visual" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
          <div className="hero-portrait__visual-meta" aria-hidden="true"><span>Portrait study / 01</span><span>Original image</span></div>
          <div className="hero-portrait__depth-scene" aria-hidden="true">
            <span className="hero-portrait__depth-orbit hero-portrait__depth-orbit--wide" />
            <span className="hero-portrait__depth-orbit hero-portrait__depth-orbit--tilt" />
            <span className="hero-portrait__depth-orbit hero-portrait__depth-orbit--vertical" />
            <span className="hero-portrait__depth-crosshair" />
            <span className="hero-portrait__depth-core" />
          </div>
          <figure className={`hero-portrait__frame ${portraitFailed ? "is-unavailable" : ""}`}>
            {!portraitFailed ? (
              <img src={identityPortraitAsset} alt="Portrait of Zeehad Haque" width="1565" height="2400" fetchPriority="high" decoding="async" onError={() => setPortraitFailed(true)} />
            ) : (
              <div className="hero-portrait__fallback" role="img" aria-label="Portrait unavailable">
                <strong>Portrait asset unavailable</strong>
                <span>Upload the original image to continue.</span>
              </div>
            )}
            <figcaption><span>Zeehad Haque</span><span>Director / Writer / Cinematographer / Editor</span></figcaption>
          </figure>
          <div className="hero-portrait__focus-line" aria-hidden="true" />
          <div className="hero-portrait__identity-tag" aria-hidden={!entered}>ZEEHAD / FRAME 01</div>
        </div>
      </div>

      <div className="hero-portrait__footer page-width">
        <span>A filmmaker's world, experienced as a cinematic journey.</span>
        <a href="#introduction"><i aria-hidden="true" /> Scroll to explore</a>
        <span className="hero-portrait__counter">01 <b /> 08</span>
      </div>
    </section>
  );
}
