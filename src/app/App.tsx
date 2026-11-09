import { useEffect, useMemo, useState } from "react";
import { HeroPortrait } from "../components/hero/HeroPortrait";
import { LoadingCurtain } from "../components/motion/LoadingCurtain";
import { CinematicScrollMotion } from "../components/motion/CinematicScrollMotion";
import { MainFooter } from "../components/layout/MainFooter";
import { SkipLink } from "../components/layout/SkipLink";
import { SiteNavigation } from "../components/navigation/SiteNavigation";
import { AcademySection } from "../components/academy/AcademySection";
import { ContactSection } from "../components/sections/ContactSection";
import { FilmArchive } from "../components/sections/FilmArchive";
import { FilmmakingPractice } from "../components/sections/FilmmakingPractice";
import { FrameArchive } from "../components/sections/FrameArchive";
import { FutureProjects } from "../components/sections/FutureProjects";
import { OffSetSection } from "../components/sections/OffSetSection";
import { OnSetSection } from "../components/sections/OnSetSection";
import { PersonalIntroduction } from "../components/sections/PersonalIntroduction";
import { ZeeAIAssistant } from "../components/zee-ai/ZeeAIAssistant";
import { identityPortraitAsset, navigationItems } from "../data/site";
import { useActiveSection } from "../hooks/useActiveSection";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function App() {
  const reducedMotion = useReducedMotion();
  const sectionIds = useMemo(() => navigationItems.map((item) => item.href.slice(1)), []);
  const activeSection = useActiveSection(sectionIds);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isPortraitReady, setIsPortraitReady] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      const saved = window.localStorage.getItem("zee-theme-v2");
      return saved === "light" ? "light" : "dark";
    } catch { return "dark"; }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { window.localStorage.setItem("zee-theme-v2", theme); } catch { /* storage may be unavailable */ }
  }, [theme]);

  useEffect(() => {
    let settled = false;
    const markPortraitReady = () => {
      if (settled) return;
      settled = true;
      setIsPortraitReady(true);
    };

    const portrait = new Image();
    portrait.onload = markPortraitReady;
    portrait.onerror = markPortraitReady;
    portrait.src = identityPortraitAsset;

    // A slow or unavailable portrait must never keep the entrance curtain stuck.
    const fallback = window.setTimeout(markPortraitReady, 1600);
    return () => {
      window.clearTimeout(fallback);
      portrait.onload = null;
      portrait.onerror = null;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("navigation-is-open", isNavigationOpen);
    return () => document.body.classList.remove("navigation-is-open");
  }, [isNavigationOpen]);

  return (
    <div className="app-shell" data-reduced-motion={reducedMotion} data-theme={theme}>
      <SkipLink />
      <LoadingCurtain visible={isLoading} reducedMotion={reducedMotion} ready={isPortraitReady} onComplete={() => setIsLoading(false)} />
      <CinematicScrollMotion reducedMotion={reducedMotion} />
      <SiteNavigation
        activeSection={activeSection}
        theme={theme}
        onThemeToggle={() => setTheme((current) => current === "dark" ? "light" : "dark")}
        isOpen={isNavigationOpen}
        onToggle={() => setIsNavigationOpen((open) => !open)}
        onClose={() => setIsNavigationOpen(false)}
      />
      <main id="main-content">
        <HeroPortrait />
        <PersonalIntroduction />
        <FilmArchive />
        <FrameArchive />
        <OnSetSection />
        <OffSetSection />
        <FilmmakingPractice />
        <FutureProjects />
        <AcademySection />
        <ContactSection />
      </main>
      <MainFooter />
      <ZeeAIAssistant />
    </div>
  );
}
