import { useEffect, useRef } from "react";

interface CinematicScrollMotionProps {
  reducedMotion: boolean;
}

/**
 * Progressive enhancement for the full interface.
 * The page is visible by default; reveal classes are only added after the
 * IntersectionObserver is available. A MutationObserver catches Academy
 * panels and modal content that are mounted after the initial page render.
 */
const revealSelector = [
  "main section h1",
  "main section h2",
  "main section h3",
  "main section h4",
  "main section p",
  "main section figure",
  "main section img",
  "main section article",
  "main section li",
  "main section a",
  "main section button",
  "main section input",
  "main section textarea",
  "main section select",
  "main section iframe",
  "main section form",
  "main section .section-kicker",
  "main section .section-tail",
  ".hero-portrait__visual",
  ".message-from-zee__collage",
  ".on-set__grid",
  ".off-set__visual",
  ".film-archive__grid",
  ".frame-archive__gallery",
  ".filmmaking-practice__steps",
  ".filmmaking-practice__tools",
  ".filmmaking-practice__project-grid",
  ".future-projects__list",
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
  ".contact__details",
  ".contact-form",
  ".main-footer__top",
  ".main-footer__bottom > *",
  ".zee-assistant__toggle",
].join(",");

export function CinematicScrollMotion({ reducedMotion }: CinematicScrollMotionProps) {
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion || motionPreference.matches || !("IntersectionObserver" in window)) {
      document.documentElement.classList.remove("has-cinematic-motion");
      return;
    }

    const root = document.documentElement;
    const registered = new Set<HTMLElement>();
    let sequence = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-motion-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
    );

    const register = (scope: ParentNode) => {
      const candidates = scope instanceof HTMLElement && scope.matches(revealSelector)
        ? [scope, ...Array.from(scope.querySelectorAll<HTMLElement>(revealSelector))]
        : Array.from(scope.querySelectorAll<HTMLElement>(revealSelector));

      candidates.forEach((target) => {
        if (registered.has(target) || target.closest("[hidden], [aria-hidden='true']")) return;
        if (target.closest(".film-modal, .academy-auth") && !target.closest(".film-modal__dialog, .academy-auth__card")) return;

        registered.add(target);
        target.classList.add("motion-reveal");
        target.style.setProperty("--motion-delay", `${(sequence % 6) * 58}ms`);
        target.style.setProperty("--motion-index", String(sequence % 6));
        sequence += 1;
        observer.observe(target);
      });
    };

    root.classList.add("has-cinematic-motion");
    register(document);

    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) register(node);
        });
      });
    });
    mutations.observe(document.getElementById("main-content") ?? document.body, {
      childList: true,
      subtree: true,
    });

    const onMotionChange = () => {
      if (motionPreference.matches) {
        observer.disconnect();
        mutations.disconnect();
        root.classList.remove("has-cinematic-motion");
        registered.forEach((target) => {
          target.classList.remove("motion-reveal", "is-motion-visible");
          target.style.removeProperty("--motion-delay");
          target.style.removeProperty("--motion-index");
        });
        registered.clear();
      }
    };
    motionPreference.addEventListener("change", onMotionChange);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      motionPreference.removeEventListener("change", onMotionChange);
      root.classList.remove("has-cinematic-motion");
      registered.forEach((target) => {
        target.classList.remove("motion-reveal", "is-motion-visible");
        target.style.removeProperty("--motion-delay");
        target.style.removeProperty("--motion-index");
      });
      registered.clear();
    };
  }, [reducedMotion]);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      frame = 0;
      const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollRange));
      progressRef.current?.style.setProperty("--scroll-progress", String(progress));
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="cinematic-scroll-progress" aria-hidden="true">
      <span ref={progressRef} />
    </div>
  );
}
