import { useEffect, useMemo, useState } from "react";
import { IglooExperience } from "../components/igloo/IglooExperience";
import { SkipLink } from "../components/layout/SkipLink";
import { LoadingCurtain } from "../components/motion/LoadingCurtain";
import { CastleUniverse } from "../components/three/CastleUniverse";
import { ZeeAIAssistant } from "../components/zee-ai/ZeeAIAssistant";
import { useCinematicMotion } from "../hooks/useCinematicMotion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import {
  type DestinationId,
  resolveInitialLiteMode,
} from "../utils/castleConfig";

const LITE_STORAGE_KEY = "zee-castle-lite-mode-v1";

function getPalaceScrollProgress(): number {
  const maxScroll = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  return Math.min(1, Math.max(0, window.scrollY / maxScroll));
}

export function App() {
  const reducedMotion = useReducedMotion();

  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("autostart") !== "1";
  });
  const [openingProgress, setOpeningProgress] = useState(0);
  const [introRunKey, setIntroRunKey] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [intelligenceSignal, setIntelligenceSignal] = useState(0);

  const activeChamber: DestinationId = useMemo(() => {
    if (scrollProgress < 0.15) return "foyer";
    if (scrollProgress < 0.28) return "screening-hall";
    if (scrollProgress < 0.42) return "projection-room";
    if (scrollProgress < 0.6) return "directors-suite";
    if (scrollProgress < 0.8) return "institute";
    if (scrollProgress < 0.94) return "intelligence";
    return "grand-exit";
  }, [scrollProgress]);

  useEffect(() => {
    const onSummonZee = () => setIntelligenceSignal((s) => s + 1);
    window.addEventListener("palace:summon-zee", onSummonZee);
    return () => window.removeEventListener("palace:summon-zee", onSummonZee);
  }, []);

  const isGlitchActive = scrollProgress >= 0.15 && scrollProgress <= 0.25;

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
      onScroll();
    };

    updateScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleScrollToStage = (p: number) => {
    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    window.scrollTo({
      top: p * maxScroll,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <div
      className="castle-app"
      data-opening={isLoading}
      data-reduced-motion={reducedMotion}
      data-lite-mode={liteMode}
      data-chamber={activeChamber}
    >
      {/* 01. Fullscreen Persistent 3D WebGL Canvas */}
      <CastleUniverse
        activeChamber={activeChamber}
        scrollProgress={scrollProgress}
        liteMode={liteMode}
        reducedMotion={reducedMotion}
        isOpening={isLoading}
        openingProgress={openingProgress}
      />

      {/* 02. Chromatic Glitch Shift Overlay */}
      <div
        className={`palace-chromatic-glitch ${isGlitchActive ? "is-active" : ""}`}
        aria-hidden="true"
      />

      <SkipLink />

      {/* 03. Cinematic Loading Curtain */}
      <LoadingCurtain
        key={introRunKey}
        visible={isLoading}
        reducedMotion={reducedMotion}
        liteMode={liteMode}
        progress={openingProgress}
        onProgress={setOpeningProgress}
        onComplete={() => setIsLoading(false)}
      />

      {/* 04. 1:1 Igloo Cyber-Brutalist HUD & Scroll Orchestrator */}
      <IglooExperience
        scrollProgress={scrollProgress}
        onScrollToStage={handleScrollToStage}
        onSummonZee={() => setIntelligenceSignal((s) => s + 1)}
      />

      {/* 05. ZEE AI Interactive Assistant */}
      <ZeeAIAssistant externalOpenSignal={intelligenceSignal} />
    </div>
  );
}
