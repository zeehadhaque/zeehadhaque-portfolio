import { useEffect, useMemo, useState } from "react";
import { HeroPortrait } from "../components/hero/HeroPortrait";
import { LoadingCurtain } from "../components/motion/LoadingCurtain";
import { MainFooter } from "../components/layout/MainFooter";
import { SkipLink } from "../components/layout/SkipLink";
import { SiteNavigation } from "../components/navigation/SiteNavigation";
import { AcademySection } from "../components/sections/AcademySection";
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
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      const saved = window.localStorage.getItem("zee-theme");
      return saved === "dark" ? "dark" : "light";
    } catch { return "light"; }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { window.localStorage.setItem("zee-theme", theme); } catch { /* storage may be unavailable */ }
  }, [theme]);

  useEffect(() => {
    let finished = false;
    const finishLoading = () => {
      if (finished) return;
      finished = true;
      setIsLoading(false);
    };

    const portrait = new Image();
    portrait.onload = finishLoading;
    portrait.onerror = finishLoading;
    portrait.src = identityPortraitAsset;

    const maximumWait = window.setTimeout(finishLoading, reducedMotion ? 180 : 900);
    return () => {
      window.clearTimeout(maximumWait);
      portrait.onload = null;
      portrait.onerror = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    document.body.classList.toggle("navigation-is-open", isNavigationOpen);
    return () => document.body.classList.remove("navigation-is-open");
  }, [isNavigationOpen]);

  return (
    <div className="app-shell" data-reduced-motion={reducedMotion} data-theme={theme}>
      <SkipLink />
      <LoadingCurtain visible={isLoading} reducedMotion={reducedMotion} />
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
        <OnSetSection />
        <OffSetSection />
        <FilmArchive />
        <FrameArchive />
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
