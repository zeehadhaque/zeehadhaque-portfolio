import { InfiniteCastleScene } from "./InfiniteCastleScene";
import type { ChamberId } from "../../utils/castleConfig";

interface CastleUniverseProps {
  activeChamber?: ChamberId;
  scrollProgress?: number;
  liteMode?: boolean;
  reducedMotion?: boolean;
  onExplore?: () => void;
}

export function CastleUniverse({
  activeChamber = "foyer",
  scrollProgress = 0,
  liteMode = false,
  reducedMotion = false,
}: CastleUniverseProps) {
  // Map chamber to relative scroll if needed
  let progress = scrollProgress;
  if (scrollProgress === 0 && activeChamber) {
    const chamberMap: Record<ChamberId, number> = {
      foyer: 0.05,
      "screening-hall": 0.5,
      "projection-room": 0.6,
      "directors-suite": 0.72,
      institute: 0.84,
      intelligence: 0.88,
      "grand-exit": 0.96,
    };
    progress = chamberMap[activeChamber] ?? 0.05;
  }

  return (
    <InfiniteCastleScene
      scrollProgress={progress}
      liteMode={liteMode}
      reducedMotion={reducedMotion}
    />
  );
}
