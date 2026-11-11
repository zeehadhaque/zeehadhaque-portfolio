import { useEffect, useMemo, useState } from "react";
import { LoadingCurtain } from "../components/motion/LoadingCurtain";
import { ImmersiveWorld } from "../components/motion/ImmersiveWorld";
import { MotionDirector } from "../components/motion/MotionDirector";
import { MainFooter } from "../components/layout/MainFooter";
import { SkipLink } from "../components/layout/SkipLink";
import { SiteNavigation } from "../components/navigation/SiteNavigation";
import { CompletePortfolio } from "../components/portfolio/CompletePortfolio";
import { ZeeAIAssistant } from "../components/zee-ai/ZeeAIAssistant";
import { navigationItems } from "../data/site";
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
      return window.localStorage.getItem("zee-theme-v2") === "light" ? "light" : "dark";
    } catch { return "dark"; }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { window.localStorage.setItem("zee-theme-v2", theme); } catch { /* storage unavailable */ }
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle("navigation-is-open", isNavigationOpen);
    return () => document.body.classList.remove("navigation-is-open");
  }, [isNavigationOpen]);

  return (
    <div className="app-shell immersive-app" data-reduced-motion={reducedMotion} data-theme={theme}>
      <ImmersiveWorld />
      <MotionDirector />
      <SkipLink />
      <LoadingCurtain visible={isLoading} reducedMotion={reducedMotion} ready={true} onComplete={() => setIsLoading(false)} />
      <SiteNavigation
        activeSection={activeSection}
        theme={theme}
        onThemeToggle={() => setTheme((current) => current === "dark" ? "light" : "dark")}
        isOpen={isNavigationOpen}
        onToggle={() => setIsNavigationOpen((open) => !open)}
        onClose={() => setIsNavigationOpen(false)}
      />
      <CompletePortfolio />
      <MainFooter />
      <ZeeAIAssistant />
    </div>
  );
}
