import { useEffect } from "react";

const REVEAL_SELECTOR = [
  ".dest-head",
  ".origin-header",
  ".origin-monument",
  ".origin-stage__editorial > *",
  ".origin-stage__monolith",
  ".foyer-portals > *",
  ".origin-horizon__item",
  ".filmography-filters",
  ".spotlight-plate",
  ".ledger-reel",
  ".frame-stage",
  ".frame-plate-btn",
  ".frame-pillar",
  ".frame-toolkit",
  ".suite-atmosphere-banner",
  ".auteur-monograph__left",
  ".auteur-method",
  ".auteur-slates__col",
  ".intelligence-stage__content > *",
  ".contact-sanctuary > *",
].join(",");

const TILT_SELECTOR = [
  ".origin-portrait-frame",
  ".spotlight-plate__poster",
  ".ledger-reel__poster",
  ".frame-stage__viewport",
  ".frame-plate-btn__thumb",
  ".suite-atmosphere-banner",
  ".auteur-portrait",
  ".intelligence-stage",
].join(",");

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Adds cinematic depth to the existing palace experience without changing
 * the opening sequence or requiring another rendering engine.
 */
export function useCinematicMotion(enabled: boolean): void {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const root = document.documentElement;
    root.dataset.cinematicMotion = "true";

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
    );

    let revealObserver: IntersectionObserver | null = null;

    if ("IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const element = entry.target as HTMLElement;
            element.classList.add("is-in-view");
            revealObserver?.unobserve(element);
          }
        },
        {
          root: null,
          rootMargin: "0px 0px -9% 0px",
          threshold: 0.12,
        },
      );

      revealElements.forEach((element, index) => {
        element.classList.add("cinema-reveal");
        element.style.setProperty(
          "--cinema-stagger",
          `${(index % 6) * 72}ms`,
        );
        revealObserver?.observe(element);
      });
    }

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".identity-main .dest"),
    );

    let scrollFrame = 0;

    const updateDepth = () => {
      scrollFrame = 0;
      const viewportHeight = Math.max(1, window.innerHeight);
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - viewportHeight,
      );
      const pageProgress = clamp(window.scrollY / maxScroll, 0, 1);

      root.style.setProperty("--page-scroll-progress", pageProgress.toFixed(4));

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const progress = clamp(
          (viewportHeight - rect.top) / (viewportHeight + rect.height),
          0,
          1,
        );
        const shift = (0.5 - progress) * 38;
        const lightX = 50 + (progress - 0.5) * 30;

        section.style.setProperty("--section-progress", progress.toFixed(3));
        section.style.setProperty("--section-shift", `${shift.toFixed(1)}px`);
        section.style.setProperty("--section-light-x", `${lightX.toFixed(1)}%`);
      }
    };

    const requestDepthUpdate = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateDepth);
    };

    updateDepth();
    window.addEventListener("scroll", requestDepthUpdate, { passive: true });
    window.addEventListener("resize", requestDepthUpdate, { passive: true });

    let activeMedia: HTMLElement | null = null;

    const clearMedia = () => {
      if (!activeMedia) return;
      activeMedia.classList.remove("is-pointer-active");
      activeMedia.style.removeProperty("--tilt-x");
      activeMedia.style.removeProperty("--tilt-y");
      activeMedia.style.removeProperty("--image-shift-x");
      activeMedia.style.removeProperty("--image-shift-y");
      activeMedia.style.removeProperty("--pointer-glow-x");
      activeMedia.style.removeProperty("--pointer-glow-y");
      activeMedia = null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const element =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(TILT_SELECTOR)
          : null;

      if (!element) {
        clearMedia();
        return;
      }

      if (activeMedia !== element) {
        clearMedia();
        activeMedia = element;
        activeMedia.classList.add("is-pointer-active");
      }

      const bounds = element.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const x = clamp(((event.clientX - bounds.left) / bounds.width - 0.5) * 2, -1, 1);
      const y = clamp(((event.clientY - bounds.top) / bounds.height - 0.5) * 2, -1, 1);

      element.style.setProperty("--tilt-x", `${(x * 4.4).toFixed(2)}deg`);
      element.style.setProperty("--tilt-y", `${(y * -4.4).toFixed(2)}deg`);
      element.style.setProperty("--image-shift-x", `${(x * -9).toFixed(1)}px`);
      element.style.setProperty("--image-shift-y", `${(y * -7).toFixed(1)}px`);
      element.style.setProperty("--pointer-glow-x", `${((x + 1) / 2) * 100}%`);
      element.style.setProperty("--pointer-glow-y", `${((y + 1) / 2) * 100}%`);
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (!activeMedia || !(event.target instanceof Element)) return;
      const leaving = event.target.closest<HTMLElement>(TILT_SELECTOR);
      if (leaving !== activeMedia) return;

      const entering =
        event.relatedTarget instanceof Element
          ? event.relatedTarget.closest<HTMLElement>(TILT_SELECTOR)
          : null;

      if (entering !== activeMedia) clearMedia();
    };

    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerout", handlePointerOut, { passive: true });

    return () => {
      revealObserver?.disconnect();
      window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", requestDepthUpdate);
      window.removeEventListener("resize", requestDepthUpdate);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerout", handlePointerOut);
      clearMedia();

      revealElements.forEach((element) => {
        element.classList.remove("cinema-reveal", "is-in-view");
        element.style.removeProperty("--cinema-stagger");
      });
      sections.forEach((section) => {
        section.style.removeProperty("--section-progress");
        section.style.removeProperty("--section-shift");
        section.style.removeProperty("--section-light-x");
      });
      root.style.removeProperty("--page-scroll-progress");
      delete root.dataset.cinematicMotion;
    };
  }, [enabled]);
}
