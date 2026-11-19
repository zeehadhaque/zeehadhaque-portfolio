import { useEffect, useState, useCallback } from "react";
import { InfiniteCastleScene } from "../components/three/InfiniteCastleScene";
import { TelemetryHUD } from "../components/hud/TelemetryHUD";
import { AudioController } from "../components/hud/AudioController";
import { NavigationBar } from "../components/hud/NavigationBar";
import { CustomCursor } from "../components/common/CustomCursor";
import { VideoModal } from "../components/common/VideoModal";

import { HeroFoyer } from "../components/castle/HeroFoyer";
import { CrystallineMonoliths } from "../components/castle/CrystallineMonoliths";
import { ScreeningHall } from "../components/castle/ScreeningHall";
import { DirectorsSuite } from "../components/castle/DirectorsSuite";
import { FilmmakingInstitute } from "../components/castle/FilmmakingInstitute";
import { ZeeAICore } from "../components/castle/ZeeAICore";
import { GrandExit } from "../components/castle/GrandExit";

import { videoArchive, type VideoRecord } from "../data/videoArchive";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [stageName, setStageName] = useState("FOYER & PORTAL");
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [liteMode, setLiteMode] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null);

  const reducedMotion = useReducedMotion();

  // Scroll Progress Listener
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
          setScrollProgress(progress);

          // Map progress to active chamber stages
          if (progress < 0.16) {
            setActiveStage(0);
            setStageName("FOYER & PORTAL");
          } else if (progress < 0.36) {
            setActiveStage(1);
            setStageName("CRYSTALLINE MONOLITHS");
          } else if (progress < 0.58) {
            setActiveStage(2);
            setStageName("IMPERIAL SCREENING HALL");
          } else if (progress < 0.76) {
            setActiveStage(3);
            setStageName("SUITE & WRITER'S ROOM");
          } else if (progress < 0.88) {
            setActiveStage(4);
            setStageName("FILMMAKING INSTITUTE");
          } else if (progress < 0.94) {
            setActiveStage(5);
            setStageName("ZEE AI INTELLIGENCE");
          } else {
            setActiveStage(6);
            setStageName("THE GRAND EXIT");
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavigate = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleReturnToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleOpenVideoById = useCallback((id: string) => {
    const found = videoArchive.find((v) => v.videoId === id || v.id === id);
    if (found) setSelectedVideo(found);
  }, []);

  return (
    <div className={`infinite-cinematic-castle-app ${liteMode ? "mode-lite" : ""}`}>
      {/* 1. Custom Smooth Cursor */}
      <CustomCursor reducedMotion={reducedMotion} />

      {/* 2. Persistent 3D WebGL Canvas */}
      <InfiniteCastleScene
        scrollProgress={scrollProgress}
        activeStage={activeStage}
        reducedMotion={reducedMotion}
        liteMode={liteMode}
      />

      {/* 3. Procedural Ambient Audio Generator */}
      <AudioController isActive={isAudioActive} scrollProgress={scrollProgress} />

      {/* 4. Top Glass Navigation Bar */}
      <NavigationBar activeStage={activeStage} onNavigate={handleNavigate} />

      {/* 5. Minimalist Optical Telemetry HUD */}
      <TelemetryHUD
        scrollProgress={scrollProgress}
        activeStage={activeStage}
        stageName={stageName}
        isAudioActive={isAudioActive}
        onToggleAudio={() => setIsAudioActive((prev) => !prev)}
        liteMode={liteMode}
        onToggleLiteMode={() => setLiteMode((prev) => !prev)}
      />

      {/* 6. Foreground Chambers Content Layer */}
      <main className="castle-scroll-journey">
        <HeroFoyer
          onEnter={() => handleNavigate("monoliths")}
          onOpenVideo={handleOpenVideoById}
        />

        <CrystallineMonoliths />

        <ScreeningHall onSelectVideo={(video) => setSelectedVideo(video)} />

        <DirectorsSuite />

        <FilmmakingInstitute />

        <ZeeAICore />

        <GrandExit onReturnToTop={handleReturnToTop} />
      </main>

      {/* 7. Native High-Fidelity Video Screening Modal */}
      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}
