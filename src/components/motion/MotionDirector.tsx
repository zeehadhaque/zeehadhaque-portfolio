import { useEffect } from "react";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function MotionDirector() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4 || memory <= 4 || !finePointer;
    const frameInterval = lowPower ? 1000 / 30 : 1000 / 60;
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".auteur-site > section"));
    const magneticTargets = ".auteur-button,.auteur-text-link,.main-navigation__desktop a,.main-navigation__brand,.auteur-film-card button,.auteur-inline-link,.auteur-contact-form__submit button,.main-navigation__theme,.main-navigation__toggle";

    // Respect OS accessibility preferences and avoid an unnecessary animation loop.
    if (reduced) return;

    let raf = 0;
    let lastFrameTime = 0;
    let lastScrollTime = performance.now();
    let lastScrollY = window.scrollY;
    let velocity = 0;
    let targetVelocity = 0;
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
      // Read every section position first, then write styles in a separate pass.
      // This avoids repeated layout recalculation while the visitor scrolls.
      const measurements = sections.map((section) => {
        const rect = section.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = (center - viewportCenter) / Math.max(window.innerHeight, rect.height * .45);
        return { section, distance: clamp(distance, -1.4, 1.4) };
      });

      for (const { section, distance } of measurements) {
        section.style.setProperty("--scene-distance", distance.toFixed(3));
        section.style.setProperty("--scene-focus", clamp(1 - Math.abs(distance), 0, 1).toFixed(3));
      }
      needsSectionUpdate = false;
    };

    const update = (time: number) => {
      raf = 0;
      if (document.hidden) return;
      if (time - lastFrameTime < frameInterval) {
        schedule();
        return;
      }
      lastFrameTime = time;

      const maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
      const progress = clamp(window.scrollY / maxScroll, 0, 1);
      // Decay the last measured scroll velocity. Without this, targetVelocity
      // stayed non-zero and kept the animation loop alive indefinitely.
      targetVelocity *= 0.78;
      velocity += (targetVelocity - velocity) * .22;
      if (Math.abs(targetVelocity) < .006 && Math.abs(velocity) < .008) {
        targetVelocity = 0;
        velocity = 0;
      }

      root.style.setProperty("--scroll-progress", progress.toFixed(4));
      root.style.setProperty("--scroll-velocity", velocity.toFixed(3));
      root.style.setProperty("--camera-yaw", ((progress - .5) * -9).toFixed(2) + "deg");
      root.style.setProperty("--camera-pitch", ((progress - .5) * 4).toFixed(2) + "deg");
      root.style.setProperty("--camera-travel", (progress * 150).toFixed(1) + "px");
      root.style.setProperty("--scroll-energy", Math.abs(velocity).toFixed(3));

      if (needsSectionUpdate) updateSections();

      if (pendingPointer) {
        const nextPointer = pendingPointer;
        pendingPointer = null;
        applyPointerMove(nextPointer.target, nextPointer.x, nextPointer.y);
      }

      let cursorMoving = false;
      if (cursor && cursorRing && cursorDot && finePointer) {
        cursorX += (pointerX - cursorX) * .22;
        cursorY += (pointerY - cursorY) * .22;
        cursor.style.transform = `translate3d(${cursorX}px,${cursorY}px,0)`;
        cursorDot.style.transform = `translate3d(${pointerX - cursorX}px,${pointerY - cursorY}px,0)`;
        cursorMoving = Math.abs(pointerX - cursorX) > .2 || Math.abs(pointerY - cursorY) > .2;
      }

      if (Math.abs(velocity) > .008 || cursorMoving) schedule();
    };

    const onScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const elapsed = Math.max(12, now - lastScrollTime);
      targetVelocity = clamp((currentY - lastScrollY) / elapsed, -2.4, 2.4);
      lastScrollY = currentY;
      lastScrollTime = now;
      needsSectionUpdate = true;
      schedule();
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

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      pendingPointer = {
        x: pointerX,
        y: pointerY,
        target: event.target instanceof Element ? event.target : null,
      };
      // Coalesce high-frequency pointer events into the next animation frame.
      schedule();
    };

    const onPointerLeave = () => {
      pendingPointer = null;
      if (activeMagnet) resetTarget(activeMagnet, "--mag");
      activeMagnet = null;
      if (activeParallax) resetTarget(activeParallax, "--parallax");
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
      needsSectionUpdate = true;
      schedule();
    };

    updateSections();
    schedule();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("click", onClick);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(transitionTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("click", onClick);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      body.classList.remove("motion-cursor-active", "is-navigating");
      if (activeMagnet) resetTarget(activeMagnet, "--mag");
      if (activeParallax) resetTarget(activeParallax, "--parallax");
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
