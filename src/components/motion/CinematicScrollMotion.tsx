import { useEffect, useRef } from "react";

interface CinematicScrollMotionProps {
  reducedMotion: boolean;
}

const revealSelector = [
  ".hero-portrait__copy > *",
  ".hero-portrait__visual",
  ".message-from-zee__collage > *",
  ".message-from-zee__copy > *",
  ".on-set__intro > *",
  ".practice-item",
  ".off-set__visual",
  ".off-set__content > *",
  ".section-heading > *",
  ".film-card",
  ".frame-archive__heading > *",
  ".frame-archive__tile",
  ".filmmaking-practice__step",
  ".filmmaking-practice__tools > *",
  ".filmmaking-practice__project",
  ".future-projects__list > li",
  ".academy__intro > *",
  ".academy__features",
  ".contact__intro > *",
  ".contact__details > div",
  ".contact-form > label",
  ".contact-form__submit",
].join(",");

export function CinematicScrollMotion({ reducedMotion }: CinematicScrollMotionProps) {
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion || motionPreference.matches || !("IntersectionObserver" in window)) {
      return;
    }

    const targets = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));
    if (!targets.length) return;

    document.documentElement.classList.add("has-cinematic-motion");
    targets.forEach((target, index) => {
      target.classList.add("motion-reveal");
      target.style.setProperty("--motion-delay", String((index % 5) * 70) + "ms");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-motion-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("has-cinematic-motion");
      targets.forEach((target) => {
        target.classList.remove("motion-reveal", "is-motion-visible");
        target.style.removeProperty("--motion-delay");
      });
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
