import { useEffect } from "react";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const BASE_FRAME_MS = 1000 / 60;

export function MotionDirector() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".auteur-site > section"));
    const navigation = document.querySelector<HTMLElement>(".main-navigation");
    const magneticTargets = ".auteur-button,.auteur-text-link,.main-navigation__desktop a,.main-navigation__brand,.auteur-film-card button,.auteur-inline-link,.auteur-contact-form__submit button,.main-navigation__theme,.main-navigation__toggle";

    if (reduced) {
      root.dataset.scrollMotion = "reduced";
      return;
    }

    let raf = 0;
    let lastFrameTime = 0;
    let lastScrollTime = performance.now();
    let lastScrollY = window.scrollY;
    let velocity = 0;
    let targetVelocity = 0;
    let scrollDirection: "up" | "down" = "down";
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let cursorX = pointerX;
    let cursorY = pointerY;
    let activeMagnet: HTMLElement | null = null;
    let activeParallax: HTMLElement | null = null;
    let pendingPointer: { x: number; y: number; target: Element | null } | null = null;
    let transitionTimer = 0;
    let needsSectionUpdate = true;

    const cursor = document.querySelector<HTMLElement>(".motion-cursor");
    const cursorRing = cursor?.querySelector<HTMLElement>(".motion-cursor__ring");
    const cursorDot = cursor?.querySelector<HTMLElement>(".motion-cursor__dot");

    if (finePointer) body.classList.add("motion-cursor-active");

    const schedule = () => {
      if (raf || document.hidden) return;
      raf = window.requestAnimationFrame(update);
    };

    const resetTarget = (target: HTMLElement, prefix: "--mag" | "--parallax") => {
      target.style.setProperty(prefix === "--mag" ? "--mag-x" : "--parallax-x", "0px");
      target.style.setProperty(prefix === "--mag" ? "--mag-y" : "--parallax-y", "0px");
      if (prefix === "--mag") target.classList.remove("is-magnetic");
    };

    const updateSections = () => {
      if (!finePointer) {
        needsSectionUpdate = false;
        return;
      }

      const viewportCenter = window.innerHeight / 2;
      // Batch every geometry read before writing any style to avoid layout thrashing.
      const measurements = sections.map((section) => {
        const rect = section.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = (center - viewportCenter) / Math.max(window.innerHeight, rect.height * 0.45);
        return { section, distance: clamp(distance, -1.4, 1.4) };
      });

      for (const { section, distance } of measurements) {
        section.style.setProperty("--scene-distance", distance.toFixed(3));
        section.style.setProperty("--scene-focus", clamp(1 - Math.abs(distance), 0, 1).toFixed(3));
      }
      needsSectionUpdate = false;
    };

    const applyPointerMove = (eventTarget: Element | null, x: number, y: number) => {
      const target = eventTarget?.closest<HTMLElement>(magneticTargets) ?? null;
      if (activeMagnet && activeMagnet !== target) resetTarget(activeMagnet, "--mag");
      activeMagnet = target;

      if (target) {
        const rect = target.getBoundingClientRect();
        const strength = target.matches(".auteur-film-card button") ? 5 : 9;
        const offsetX = clamp((x - (rect.left + rect.width / 2)) / Math.max(rect.width, 1) * strength, -strength, strength);
        const offsetY = clamp((y - (rect.top + rect.height / 2)) / Math.max(rect.height, 1) * strength, -strength, strength);
        target.style.setProperty("--mag-x", offsetX.toFixed(1) + "px");
        target.style.setProperty("--mag-y", offsetY.toFixed(1) + "px");
        target.classList.add("is-magnetic");
        cursor?.classList.add("is-hovering");
      } else {
        cursor?.classList.remove("is-hovering");
      }

      const depthTarget = eventTarget?.closest<HTMLElement>("[data-parallax]") ?? null;
      if (activeParallax && activeParallax !== depthTarget) resetTarget(activeParallax, "--parallax");
      activeParallax = depthTarget;

      if (depthTarget) {
        const rect = depthTarget.getBoundingClientRect();
        const depth = Number(depthTarget.dataset.parallax || 6);
        const offsetX = (x - (rect.left + rect.width / 2)) / Math.max(rect.width, 1);
        const offsetY = (y - (rect.top + rect.height / 2)) / Math.max(rect.height, 1);
        depthTarget.style.setProperty("--parallax-x", (offsetX * depth).toFixed(2) + "px");
        depthTarget.style.setProperty("--parallax-y", (offsetY * depth).toFixed(2) + "px");
      }

      if (cursor) cursor.style.opacity = "1";
    };

    const update = (time: number) => {
      raf = 0;
      if (document.hidden) return;

      // Time-normalized damping keeps the same motion feel at 60, 90, 120 or 144 Hz.
      const deltaMs = lastFrameTime ? clamp(time - lastFrameTime, 1, 48) : BASE_FRAME_MS;
      const frameScale = deltaMs / BASE_FRAME_MS;
      lastFrameTime = time;

      const maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
      const progress = clamp(window.scrollY / maxScroll, 0, 1);
      const velocityDecay = Math.pow(0.78, frameScale);
      const velocityEase = 1 - Math.pow(1 - 0.22, frameScale);
      targetVelocity *= velocityDecay;
      velocity += (targetVelocity - velocity) * velocityEase;

      if (Math.abs(targetVelocity) < 0.006 && Math.abs(velocity) < 0.008) {
        targetVelocity = 0;
        velocity = 0;
      }

      const energy = clamp(Math.abs(velocity) / 1.8, 0, 1);
      root.style.setProperty("--scroll-progress", progress.toFixed(4));
      root.style.setProperty("--scroll-velocity", velocity.toFixed(3));
      root.style.setProperty("--scroll-energy", energy.toFixed(3));
      root.style.setProperty("--camera-yaw", ((progress - 0.5) * -9).toFixed(2) + "deg");
      root.style.setProperty("--camera-pitch", ((progress - 0.5) * 4).toFixed(2) + "deg");
      root.style.setProperty("--camera-travel", (progress * 150).toFixed(1) + "px");
      root.dataset.scrollDirection = scrollDirection;

      const motionState = energy > 0.42 ? "fast" : energy > 0.05 ? "moving" : "idle";
      root.dataset.scrollMotion = motionState;
      if (navigation) {
        navigation.dataset.scrollMotion = motionState;
        navigation.dataset.scrollDirection = scrollDirection;
        navigation.style.setProperty("--scroll-intensity", energy.toFixed(3));
      }

      if (needsSectionUpdate) updateSections();

      if (pendingPointer) {
        const nextPointer = pendingPointer;
        pendingPointer = null;
        applyPointerMove(nextPointer.target, nextPointer.x, nextPointer.y);
      }

      let cursorMoving = false;
      if (cursor && cursorRing && cursorDot && finePointer) {
        const cursorEase = 1 - Math.pow(1 - 0.22, frameScale);
        cursorX += (pointerX - cursorX) * cursorEase;
        cursorY += (pointerY - cursorY) * cursorEase;
        cursor.style.transform = `translate3d(${cursorX}px,${cursorY}px,0)`;
        cursorDot.style.transform = `translate3d(${pointerX - cursorX}px,${pointerY - cursorY}px,0)`;
        cursorMoving = Math.abs(pointerX - cursorX) > 0.18 || Math.abs(pointerY - cursorY) > 0.18;
      }

      // Stop requesting frames when the scroll impulse and cursor have settled.
      if (Math.abs(velocity) > 0.008 || cursorMoving) schedule();
    };

    const onScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const elapsed = Math.max(8, now - lastScrollTime);
      const deltaY = currentY - lastScrollY;
      if (Math.abs(deltaY) > 0.5) scrollDirection = deltaY > 0 ? "down" : "up";
      targetVelocity = clamp(deltaY / elapsed, -3.5, 3.5);
      lastScrollY = currentY;
      lastScrollTime = now;
      needsSectionUpdate = true;
      schedule();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      pendingPointer = {
        x: pointerX,
        y: pointerY,
        target: event.target instanceof Element ? event.target : null,
      };
      // Coalesce high-frequency pointer input to the display's next frame.
      schedule();
    };

    const onPointerLeave = () => {
      pendingPointer = null;
      if (activeMagnet) resetTarget(activeMagnet, "--mag");
      if (activeParallax) resetTarget(activeParallax, "--parallax");
      activeMagnet = null;
      activeParallax = null;
      cursor?.classList.remove("is-hovering");
      if (cursor) cursor.style.opacity = "0";
    };

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor || anchor.getAttribute("href") === "#") return;
      body.classList.remove("is-navigating");
      void body.offsetWidth;
      body.classList.add("is-navigating");
      window.clearTimeout(transitionTimer);
      transitionTimer = window.setTimeout(() => body.classList.remove("is-navigating"), 760);
    };

    const onPointerDown = () => cursor?.classList.add("is-pressed");
    const onPointerUp = () => cursor?.classList.remove("is-pressed");
    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(raf);
        raf = 0;
        return;
      }
      lastFrameTime = 0;
      needsSectionUpdate = true;
      schedule();
    };

    updateSections();
    schedule();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (finePointer) window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("click", onClick);
    if (finePointer) {
      window.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointerup", onPointerUp);
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(transitionTimer);
      window.removeEventListener("scroll", onScroll);
      if (finePointer) window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("click", onClick);
      if (finePointer) {
        window.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerUp);
      }
      document.removeEventListener("visibilitychange", onVisibilityChange);
      body.classList.remove("motion-cursor-active", "is-navigating");
      if (activeMagnet) resetTarget(activeMagnet, "--mag");
      if (activeParallax) resetTarget(activeParallax, "--parallax");
      delete root.dataset.scrollMotion;
      delete root.dataset.scrollDirection;
      if (navigation) {
        delete navigation.dataset.scrollMotion;
        delete navigation.dataset.scrollDirection;
        navigation.style.removeProperty("--scroll-intensity");
      }
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
