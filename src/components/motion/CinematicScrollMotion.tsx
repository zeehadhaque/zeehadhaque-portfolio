import { useEffect, useRef } from "react";

interface CinematicScrollMotionProps {
  reducedMotion: boolean;
}

const targetSelector = [
  "main section h1",
  "main section h2",
  "main section h3",
  "main section h4",
  "main section p",
  "main section span",
  "main section strong",
  "main section small",
  "main section em",
  "main section b",
  "main section blockquote",
  "main section figcaption",
  "main section label",
  "main section li",
  "main section button",
  "main section a",
  "main section input",
  "main section textarea",
  "main section select",
  "main section img",
  "main section video",
  "main section iframe",
  "main section figure",
  "main section article",
  "main section form",
  "main section .section-kicker",
  "main section .section-tail",
  ".main-navigation__brand",
  ".main-navigation__desktop a",
  ".main-navigation__theme",
  ".main-navigation__motion",
  ".main-navigation__toggle",
  ".mobile-navigation__drawer",
  ".main-footer__signature",
  ".main-footer__bottom > *",
  ".zee-assistant__toggle",
  ".zee-assistant__panel",
  ".academy-experience .academy-masthead",
  ".academy-experience .academy-hero__copy",
  ".academy-experience .academy-hero__art",
  ".academy-experience .academy-nav",
  ".academy-experience .academy-stat",
  ".academy-experience .academy-roadmap",
  ".academy-experience .academy-lesson",
  ".academy-experience .academy-exam-question",
  ".academy-experience .academy-game-card",
  ".academy-experience .academy-admin__student",
  ".academy-experience .academy-auth__card",
  ".academy-experience .academy-question",
  ".academy-experience .academy-answer",
].join(",");

const textSelector = [
  "h1", "h2", "h3", "h4", "p", "span", "strong", "small", "em", "b", "blockquote", "figcaption", "label", "li",
  ".section-kicker", ".section-tail", ".hero-portrait__roles",
  ".hero-portrait__statement", ".film-card__meta", ".frame-archive__tile-meta",
  ".academy-eyebrow", ".academy-lesson__objective", ".academy-feedback",
  ".academy-guest-note", ".contact__label",
].join(",");

const mediaSelector = "img, video, iframe, .hero-portrait__visual, .message-from-zee__collage, .off-set__visual, .frame-archive__tile, .film-card__image-wrap";

const tiltSelector = [
  ".hero-portrait__visual",
  ".film-card",
  ".frame-archive__tile",
  ".practice-item",
  ".filmmaking-practice__step",
  ".filmmaking-practice__project",
  ".future-projects__list > li",
  ".academy-stat",
  ".academy-game-card",
  ".academy-question",
  ".academy-exercise",
  ".message-from-zee__image",
  ".off-set__portrait-wrap",
].join(",");

function supportsNativeViewTimeline(): boolean {
  return typeof CSS !== "undefined"
    && CSS.supports("animation-timeline", "view()")
    && CSS.supports("animation-range", "entry 0% cover 36%");
}

export function CinematicScrollMotion({ reducedMotion }: CinematicScrollMotionProps) {
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion || motionPreference.matches) {
      root.classList.remove("has-cinematic-motion", "has-native-scroll-motion");
      return;
    }

    const nativeTimeline = supportsNativeViewTimeline();
    const registered = new Set<HTMLElement>();
    let sequence = 0;

    const hasIntersectionObserver = "IntersectionObserver" in window;
    const observer = hasIntersectionObserver
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-motion-visible");
            observer.unobserve(entry.target);
          });
        }, { threshold: 0.06, rootMargin: "0px 0px -4% 0px" })
      : null;

    const register = (scope: ParentNode) => {
      const candidates = scope instanceof HTMLElement && scope.matches(targetSelector)
        ? [scope, ...Array.from(scope.querySelectorAll<HTMLElement>(targetSelector))]
        : Array.from(scope.querySelectorAll<HTMLElement>(targetSelector));

      candidates.forEach((target) => {
        if (registered.has(target)) return;
        if (target.closest("[hidden], [inert], [aria-hidden='true'], [data-motion-ignore]")) return;
        if (target.closest(".mobile-navigation[aria-hidden='true']")) return;
        if (target.closest(".film-modal, .academy-auth") && !target.closest(".film-modal__dialog, .academy-auth__card")) return;

        registered.add(target);
        const isText = target.matches(textSelector);
        const isMedia = target.matches(mediaSelector);
        const isTilt = target.matches(tiltSelector);

        target.classList.add("motion-target");
        target.style.setProperty("--motion-delay", `${(sequence % 6) * 54}ms`);
        target.style.setProperty("--motion-order", String(sequence % 6));
        sequence += 1;

        if (isText) target.classList.add("motion-text-target");
        if (isMedia) target.classList.add("motion-media-target");
        if (isTilt) target.classList.add("motion-tilt");

        if (nativeTimeline && isText) {
          target.classList.add("motion-scroll-text");
        } else if (nativeTimeline && isMedia) {
          target.classList.add("motion-scroll-media");
        } else if (observer) {
          target.classList.add("motion-reveal");
          observer.observe(target);
        }
      });
    };

    root.classList.add("has-cinematic-motion");
    if (nativeTimeline) root.classList.add("has-native-scroll-motion");
    register(document);

    const mutationRoot = document.getElementById("main-content") ?? document.body;
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        if (record.type === "attributes" && record.target instanceof HTMLElement) {
          if (record.target.getAttribute("aria-hidden") !== "true") register(record.target);
          return;
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

    const onMotionChange = () => {
      if (!motionPreference.matches) return;
      observer?.disconnect();
      mutations.disconnect();
      root.classList.remove("has-cinematic-motion", "has-native-scroll-motion");
      registered.forEach((target) => {
        target.classList.remove(
          "motion-target", "motion-reveal", "is-motion-visible",
          "motion-text-target", "motion-media-target", "motion-tilt",
          "motion-scroll-text", "motion-scroll-media",
        );
        target.style.removeProperty("--motion-delay");
        target.style.removeProperty("--motion-order");
        target.style.removeProperty("--motion-axis-x");
      target.style.removeProperty("--motion-angle");
        target.style.removeProperty("--motion-axis-y");
        target.style.removeProperty("--motion-pointer-x");
        target.style.removeProperty("--motion-pointer-y");
      });
      registered.clear();
    };
    motionPreference.addEventListener("change", onMotionChange);

    // Pointer parallax is delegated, throttled to one style update per frame,
    // and active only on fine-pointer devices.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let activeTilt: HTMLElement | null = null;
    let pointerFrame = 0;
    let pendingPointer: { target: HTMLElement | null; x: number; y: number } | null = null;

    const resetTilt = (target: HTMLElement | null) => {
      if (!target) return;
      target.style.removeProperty("--motion-axis-x");
      target.style.removeProperty("--motion-angle");
      target.style.removeProperty("--motion-axis-y");
      target.style.removeProperty("--motion-pointer-x");
      target.style.removeProperty("--motion-pointer-y");
      target.classList.remove("is-pointer-active");
    };

    const applyPendingPointer = () => {
      pointerFrame = 0;
      if (!pendingPointer) return;
      const { target, x, y } = pendingPointer;
      pendingPointer = null;
      if (activeTilt !== target) {
        resetTilt(activeTilt);
        activeTilt = target;
      }
      if (!target) return;
      target.style.setProperty("--motion-axis-y", String(x));
      target.style.setProperty("--motion-axis-x", String(-y));
      target.style.setProperty("--motion-angle", `${Math.min(6, Math.hypot(x, y) * 4.2)}deg`);
      target.style.setProperty("--motion-pointer-x", `${(x + 1) * 50}%`);
      target.style.setProperty("--motion-pointer-y", `${(y + 1) * 50}%`);
      target.classList.add("is-pointer-active");
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === "touch") return;
      const element = event.target instanceof Element ? event.target : null;
      const target = element?.closest<HTMLElement>(tiltSelector) ?? null;
      if (target && !registered.has(target)) {
        target.classList.add("motion-tilt");
        registered.add(target);
      }