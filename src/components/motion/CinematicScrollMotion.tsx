import { useEffect, useRef } from "react";

interface CinematicScrollMotionProps {
  reducedMotion: boolean;
}

const targets = [
  "main section h1", "main section h2", "main section h3", "main section h4",
  "main section p", "main section span", "main section strong", "main section small",
  "main section em", "main section b", "main section blockquote",
  "main section figcaption", "main section label", "main section li",
  "main section button", "main section a", "main section input",
  "main section textarea", "main section select", "main section img",
  "main section video", "main section iframe", "main section figure",
  "main section article", "main section form",
  ".main-navigation__brand", ".main-navigation__desktop a",
  ".main-navigation__theme", ".main-navigation__motion",
  ".main-navigation__toggle", ".mobile-navigation__drawer",
  ".main-footer__signature", ".main-footer__bottom > *",
  ".zee-assistant__toggle", ".zee-assistant__panel",
  ".academy-experience .academy-masthead",
  ".academy-experience .academy-hero__copy",
  ".academy-experience .academy-hero__art",
  ".academy-experience .academy-nav", ".academy-experience .academy-stat",
  ".academy-experience .academy-roadmap", ".academy-experience .academy-lesson",
  ".academy-experience .academy-exam-question",
  ".academy-experience .academy-game-card",
  ".academy-experience .academy-admin__student",
  ".academy-experience .academy-auth__card",
  ".academy-experience .academy-question",
  ".academy-experience .academy-answer",
].join(",");

const textTargets = "h1,h2,h3,h4,p,span,strong,small,em,b,blockquote,figcaption,label,li,.section-kicker,.section-tail";
const mediaTargets = "img,video,iframe,.hero-portrait__visual,.message-from-zee__collage,.off-set__visual,.frame-archive__tile,.film-card__image-wrap";
const tiltTargets = [
  ".hero-portrait__visual", ".film-card", ".frame-archive__tile",
  ".practice-item", ".filmmaking-practice__step",
  ".filmmaking-practice__project", ".future-projects__list > li",
  ".academy-stat", ".academy-game-card", ".academy-question",
  ".academy-exercise", ".message-from-zee__image", ".off-set__portrait-wrap",
].join(",");

function hasNativeScrollTimelines(): boolean {
  return typeof CSS !== "undefined"
    && CSS.supports("animation-timeline", "view()")
    && CSS.supports("animation-range", "entry 0% cover 36%");
}

export function CinematicScrollMotion({ reducedMotion }: CinematicScrollMotionProps) {
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nativeTimeline = hasNativeScrollTimelines();
    if (reducedMotion || preference.matches) {
      root.classList.remove("has-cinematic-motion", "has-native-scroll-motion");
      return;
    }

    const registered = new Set<HTMLElement>();
    let sequence = 0;
    let observer: IntersectionObserver | null = null;

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-motion-visible");
          observer?.unobserve(entry.target);
        });
      }, { threshold: .06, rootMargin: "0px 0px -4% 0px" });
    }

    const register = (scope: ParentNode) => {
      const candidates = scope instanceof HTMLElement && scope.matches(targets)
        ? [scope, ...Array.from(scope.querySelectorAll<HTMLElement>(targets))]
        : Array.from(scope.querySelectorAll<HTMLElement>(targets));

      candidates.forEach((element) => {
        if (registered.has(element)) return;
        if (element.closest("[hidden],[inert],[aria-hidden='true'],[data-motion-ignore]")) return;
        if (element.closest(".mobile-navigation[aria-hidden='true']")) return;
        if (element.closest(".film-modal,.academy-auth")
          && !element.closest(".film-modal__dialog,.academy-auth__card")) return;

        registered.add(element);
        element.classList.add("motion-target");
        element.style.setProperty("--motion-delay", String((sequence % 6) * 54) + "ms");
        element.style.setProperty("--motion-order", String(sequence % 6));
        sequence += 1;

        if (element.matches(textTargets)) element.classList.add("motion-text-target");
        if (element.matches(mediaTargets)) element.classList.add("motion-media-target");
        if (element.matches(tiltTargets)) element.classList.add("motion-tilt");

        if (nativeTimeline && element.matches(textTargets)) {
          element.classList.add("motion-scroll-text");
        } else if (nativeTimeline && element.matches(mediaTargets)) {
          element.classList.add("motion-scroll-media");
        } else if (observer) {
          element.classList.add("motion-reveal");
          observer.observe(element);
        }
      });
    };

    const clearMotionClasses = () => {
      root.classList.remove("has-cinematic-motion", "has-native-scroll-motion");
      observer?.disconnect();
      mutations.disconnect();
      registered.forEach((element) => {
        element.classList.remove(
          "motion-target", "motion-reveal", "is-motion-visible",
          "motion-text-target", "motion-media-target", "motion-tilt",
          "motion-scroll-text", "motion-scroll-media", "is-pointer-active",
        );
        [
          "--motion-delay", "--motion-order", "--motion-axis-x",
          "--motion-axis-y", "--motion-angle",
          "--motion-pointer-x", "--motion-pointer-y",
        ].forEach((property) => element.style.removeProperty(property));
      });
      registered.clear();
    };

    root.classList.add("has-cinematic-motion");
    if (nativeTimeline) root.classList.add("has-native-scroll-motion");
    register(document);

    const mutationRoot = document.getElementById("main-content") ?? document.body;
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        if (record.type === "attributes" && record.target instanceof HTMLElement) {
          if (record.target.getAttribute("aria-hidden") !== "true") register(record.target);
        }
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) register(node);
        });
      });
    });
    mutations.observe(mutationRoot, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-hidden", "hidden", "inert"],
    });

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let activeTilt: HTMLElement | null = null;
    let pointerFrame = 0;
    let pendingPointer: { target: HTMLElement | null; x: number; y: number } | null = null;

    const resetTilt = (element: HTMLElement | null) => {
      if (!element) return;
      ["--motion-axis-x", "--motion-axis-y", "--motion-angle", "--motion-pointer-x", "--motion-pointer-y"]
        .forEach((property) => element.style.removeProperty(property));
      element.classList.remove("is-pointer-active");
    };

    const applyPointer = () => {
      pointerFrame = 0;
      if (!pendingPointer) return;
      const value = pendingPointer;
      pendingPointer = null;
      if (activeTilt !== value.target) {
        resetTilt(activeTilt);
        activeTilt = value.target;
      }
      if (!value.target) return;
      value.target.style.setProperty("--motion-axis-x", String(-value.y));
      value.target.style.setProperty("--motion-axis-y", String(value.x));
      value.target.style.setProperty("--motion-angle", String(Math.min(6, Math.hypot(value.x, value.y) * 4.2)) + "deg");
      value.target.style.setProperty("--motion-pointer-x", String((value.x + 1) * 50) + "%");
      value.target.style.setProperty("--motion-pointer-y", String((value.y + 1) * 50) + "%");
      value.target.classList.add("is-pointer-active");
    };

    const schedulePointer = (value: { target: HTMLElement | null; x: number; y: number }) => {
      pendingPointer = value;
      if (!pointerFrame) pointerFrame = window.requestAnimationFrame(applyPointer);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (preference.matches || !finePointer.matches || event.pointerType === "touch") return;
      const node = event.target instanceof Element ? event.target : null;
      const element = node?.closest<HTMLElement>(tiltTargets) ?? null;
      if (!element) {
        if (activeTilt) schedulePointer({ target: null, x: 0, y: 0 });
        return;
      }
      if (!registered.has(element)) {
        element.classList.add("motion-tilt");
        registered.add(element);
      }
      const bounds = element.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / Math.max(1, bounds.width) - .5) * 2));
      const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / Math.max(1, bounds.height) - .5) * 2));
      schedulePointer({ target: element, x, y });
    };

    const handlePointerLeave = () => schedulePointer({ target: null, x: 0, y: 0 });
    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) handlePointerLeave();
    };
    const handleMotionChange = () => {
      if (preference.matches) clearMotionClasses();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerout", handlePointerOut, { passive: true });
    window.addEventListener("blur", handlePointerLeave);
    preference.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("blur", handlePointerLeave);
      preference.removeEventListener("change", handleMotionChange);
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      resetTilt(activeTilt);
      clearMotionClasses();
    };
  }, [reducedMotion]);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / range));
      progressRef.current?.style.setProperty("--scroll-progress", String(progress));
      document.documentElement.style.setProperty("--page-scroll-progress", String(progress));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
      document.documentElement.style.removeProperty("--page-scroll-progress");
    };
  }, []);

  return (
    <div className="cinematic-scroll-progress" aria-hidden="true">
      <span ref={progressRef} />
    </div>
  );
}
