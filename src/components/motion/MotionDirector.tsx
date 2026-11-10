import { useEffect } from "react";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function MotionDirector() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".auteur-site > section"));
    const magneticTargets = ".auteur-button,.auteur-text-link,.main-navigation__desktop a,.main-navigation__brand,.auteur-film-card button,.auteur-inline-link,.auteur-contact-form__submit button,.main-navigation__theme,.main-navigation__toggle";
    let raf = 0;
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let velocity = 0;
    let targetVelocity = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let cursorX = pointerX;
    let cursorY = pointerY;
    let activeMagnet: HTMLElement | null = null;
    let transitionTimer = 0;
    const cursor = document.querySelector<HTMLElement>(".motion-cursor");
    const cursorRing = cursor?.querySelector<HTMLElement>(".motion-cursor__ring");
    const cursorDot = cursor?.querySelector<HTMLElement>(".motion-cursor__dot");

    if (finePointer && !reduced) body.classList.add("motion-cursor-active");

    const update = (time: number) => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = clamp(window.scrollY / maxScroll, 0, 1);
      const delta = window.scrollY - lastY;
      const elapsed = Math.max(12, time - lastTime);
      targetVelocity = clamp(delta / elapsed, -2.4, 2.4);
      velocity += (targetVelocity - velocity) * .16;
      if (Math.abs(velocity) < .008) velocity = 0;

      root.style.setProperty("--scroll-progress", progress.toFixed(4));
      root.style.setProperty("--scroll-velocity", velocity.toFixed(3));
      root.style.setProperty("--camera-yaw", ((progress - .5) * -9).toFixed(2) + "deg");
      root.style.setProperty("--camera-pitch", ((progress - .5) * 4).toFixed(2) + "deg");
      root.style.setProperty("--camera-travel", (progress * 150).toFixed(1) + "px");
      root.style.setProperty("--scroll-energy", Math.abs(velocity).toFixed(3));

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = (center - window.innerHeight / 2) / Math.max(window.innerHeight, rect.height * .45);
        const focus = clamp(1 - Math.abs(distance), 0, 1);
        section.style.setProperty("--scene-distance", clamp(distance, -1.4, 1.4).toFixed(3));
        section.style.setProperty("--scene-focus", focus.toFixed(3));
      });

      if (cursor && cursorRing && cursorDot && finePointer && !reduced) {
        cursorX += (pointerX - cursorX) * .2;
        cursorY += (pointerY - cursorY) * .2;
        cursor.style.transform = `translate3d(${cursorX}px,${cursorY}px,0)`;
        cursorDot.style.transform = `translate3d(${pointerX - cursorX}px,${pointerY - cursorY}px,0)`;
      }
      lastY = window.scrollY;
      lastTime = time;
      raf = window.requestAnimationFrame(update);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!finePointer || reduced) return;

      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(magneticTargets);
      if (activeMagnet && activeMagnet !== target) {
        activeMagnet.style.setProperty("--mag-x", "0px");
        activeMagnet.style.setProperty("--mag-y", "0px");
        activeMagnet.classList.remove("is-magnetic");
      }
      activeMagnet = target;
      if (target) {
        const rect = target.getBoundingClientRect();
        const strength = target.matches(".auteur-film-card button") ? 5 : 9;
        const x = clamp((event.clientX - (rect.left + rect.width / 2)) / Math.max(rect.width, 1) * strength, -strength, strength);
        const y = clamp((event.clientY - (rect.top + rect.height / 2)) / Math.max(rect.height, 1) * strength, -strength, strength);
        target.style.setProperty("--mag-x", x.toFixed(1) + "px");
        target.style.setProperty("--mag-y", y.toFixed(1) + "px");
        target.classList.add("is-magnetic");
        cursor?.classList.add("is-hovering");
      } else {
        cursor?.classList.remove("is-hovering");
      }

      const depthTarget = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-parallax]");
      if (depthTarget) {
        const rect = depthTarget.getBoundingClientRect();
        const depth = Number(depthTarget.dataset.parallax || 6);
        const x = (event.clientX - (rect.left + rect.width / 2)) / Math.max(rect.width, 1);
        const y = (event.clientY - (rect.top + rect.height / 2)) / Math.max(rect.height, 1);
        depthTarget.style.setProperty("--parallax-x", (x * depth).toFixed(2) + "px");
        depthTarget.style.setProperty("--parallax-y", (y * depth).toFixed(2) + "px");
      }
      if (cursor) cursor.style.opacity = "1";
    };

    const onPointerLeave = () => {
      if (activeMagnet) {
        activeMagnet.style.setProperty("--mag-x", "0px");
        activeMagnet.style.setProperty("--mag-y", "0px");
        activeMagnet.classList.remove("is-magnetic");
      }
      activeMagnet = null;
      cursor?.classList.remove("is-hovering");
      if (cursor) cursor.style.opacity = "0";
    };

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor || reduced || anchor.getAttribute("href") === "#") return;
      body.classList.remove("is-navigating");
      void body.offsetWidth;
      body.classList.add("is-navigating");
      window.clearTimeout(transitionTimer);
      transitionTimer = window.setTimeout(() => body.classList.remove("is-navigating"), 760);
    };

    const onPointerDown = () => cursor?.classList.add("is-pressed");
    const onPointerUp = () => cursor?.classList.remove("is-pressed");

    raf = window.requestAnimationFrame(update);
    window.addEventListener("pointermove", onPointerMove, {passive:true});
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("click", onClick);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(transitionTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("click", onClick);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      body.classList.remove("motion-cursor-active", "is-navigating");
    };
  }, []);

  return (
    <>
      <div className="immersive-rig" aria-hidden="true">
        <div className="immersive-rig__portal"><span /><i /><b /></div>
        <div className="immersive-rig__axis immersive-rig__axis--one" />
        <div className="immersive-rig__axis immersive-rig__axis--two" />
      </div>
      <div className="motion-cursor" aria-hidden="true">
        <span className="motion-cursor__ring" />
        <span className="motion-cursor__dot" />
      </div>
      <div className="page-transition" aria-hidden="true"><span>ENTERING THE NEXT SCENE</span></div>
    </>
  );
}
