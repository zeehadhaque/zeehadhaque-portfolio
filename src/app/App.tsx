import { useEffect, useMemo, useState } from "react";
import { MainFooter } from "../components/layout/MainFooter";
import { SkipLink } from "../components/layout/SkipLink";
import { LoadingCurtain } from "../components/motion/LoadingCurtain";
import { SiteNavigation } from "../components/navigation/SiteNavigation";
import { CompletePortfolio } from "../components/portfolio/CompletePortfolio";
import { CastleUniverse } from "../components/three/CastleUniverse";
import { ZeeAIAssistant } from "../components/zee-ai/ZeeAIAssistant";
import { useActiveSection } from "../hooks/useActiveSection";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useCinematicMotion } from "../hooks/useCinematicMotion";
import {
  normalizeActiveChamber,
  resolveInitialLiteMode,
} from "../utils/castleConfig";

const LITE_STORAGE_KEY = "zee-castle-lite-mode-v1";

const SECTION_IDS = [
  "foyer",
  "screening-hall",
  "projection-room",
  "directors-suite",
  "institute",
  "intelligence",
  "grand-exit",
];

let cachedAnchors: number[] | null = null;

function recalculateAnchors() {
  if (typeof document === "undefined") return;
  const starts = SECTION_IDS.map((id) => {
    const section = document.getElementById(id);
    return section ? section.getBoundingClientRect().top + window.scrollY : null;
  });
  if (starts.some((value) => value === null)) {
    cachedAnchors = null;
  } else {
    cachedAnchors = starts as number[];
  }
}

function getPalaceScrollProgress(): number {
  const fallbackMax = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const fallback = Math.min(1, Math.max(0, window.scrollY / fallbackMax));

  if (!cachedAnchors) {
    recalculateAnchors();
  }
  const anchors = cachedAnchors;
  if (!anchors || anchors.length < 2) return fallback;

  const y = Math.max(0, window.scrollY);
  if (y <= anchors[0]) return 0;

  for (let index = 0; index < anchors.length - 1; index += 1) {
    const start = anchors[index];
    const end = anchors[index + 1];
    if (y <= end) {
      const local = Math.min(1, Math.max(0, (y - start) / Math.max(1, end - start)));
      return (index + local) / (anchors.length - 1);
    }
  }

  return 1;
}

export function App() {
  const reducedMotion = useReducedMotion();
  const activeSection = useActiveSection(SECTION_IDS);
  const activeChamber = useMemo(
    () => normalizeActiveChamber(activeSection),
    [activeSection],
  );

  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("autostart") !== "1";
  });
  const [openingProgress, setOpeningProgress] = useState(0);
  const [introRunKey, setIntroRunKey] = useState(0);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [intelligenceSignal, setIntelligenceSignal] = useState(0);

  useCinematicMotion(!isLoading);

  const [liteMode, setLiteMode] = useState<boolean>(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(LITE_STORAGE_KEY);
    } catch {
      stored = null;
    }
    const nav =
      typeof navigator !== "undefined"
        ? (navigator as Navigator & { deviceMemory?: number })
        : undefined;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return resolveInitialLiteMode({
      prefersReducedMotion: prefersReduced,
      storedPreference: stored,
      hardwareConcurrency: nav?.hardwareConcurrency,
      deviceMemory: nav?.deviceMemory,
    });
  });

  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.dataset.liteMode = String(liteMode);
    try {
      window.localStorage.setItem(LITE_STORAGE_KEY, String(liteMode));
    } catch {
      /* ignore */
    }
  }, [liteMode]);

  useEffect(() => {
    document.body.classList.toggle("navigation-is-open", isNavigationOpen);
    return () => document.body.classList.remove("navigation-is-open");
  }, [isNavigationOpen]);

  useEffect(() => {
    let raf = 0;
    const updateScroll = () => {
      raf = 0;
      setScrollProgress(getPalaceScrollProgress());
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(updateScroll);
    };
    const onResize = () => {
      recalculateAnchors();
      onScroll();
    };

    recalculateAnchors();
    updateScroll();

    // Re-check anchors after fonts and deferred chunks load
    const timer = setTimeout(recalculateAnchors, 800);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      clearTimeout(timer);
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const replayIntro = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    setOpeningProgress(0);
    setIntroRunKey((key) => key + 1);
    setIsLoading(true);
  };

  return (
    <div
      className="castle-app"
      data-opening={isLoading}
      data-reduced-motion={reducedMotion}
      data-lite-mode={liteMode}
      data-chamber={activeChamber}
    >
      <div className="cinematic-scroll-progress" aria-hidden="true">
        <span />
      </div>
      <CastleUniverse
        activeChamber={activeChamber}
        scrollProgress={scrollProgress}
        liteMode={liteMode}
        reducedMotion={reducedMotion}
        isOpening={isLoading}
        openingProgress={openingProgress}
      />
      <SkipLink />
      <LoadingCurtain
        key={introRunKey}
        visible={isLoading}
        reducedMotion={reducedMotion}
        liteMode={liteMode}
        progress={openingProgress}
        onProgress={setOpeningProgress}
        onComplete={() => setIsLoading(false)}
      />
      <SiteNavigation
        activeChamber={activeChamber}
        scrollProgress={scrollProgress}
        isOpen={isNavigationOpen}
        liteMode={liteMode}
        onToggleLiteMode={() => setLiteMode((prev) => !prev)}
        onReplayIntro={replayIntro}
        onToggle={() => setIsNavigationOpen((open) => !open)}
        onClose={() => setIsNavigationOpen(false)}
      />
      <CompletePortfolio
        onSummonIntelligence={() => setIntelligenceSignal((s) => s + 1)}
      />
      <MainFooter />
      <ZeeAIAssistant externalOpenSignal={intelligenceSignal} />
    </div>
  );
}
