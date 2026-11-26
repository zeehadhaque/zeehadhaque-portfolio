import React, { useEffect, useRef } from "react";
import { ScenicPureCode3DWorld, ScenicMoodId } from "./ScenicPureCode3DWorld";
import { AtmosphericDriftLayer } from "./AtmosphericDriftLayer";
import "../../styles/scenic-animations.css";

interface ScenicAnimationRigProps {
  mood: ScenicMoodId;
  liteMode?: boolean;
  paused?: boolean;
  onChapterChange?: (chapterId: "top" | "films" | "upcoming" | "horizon") => void;
}

export const triggerMoodHoverBurst = (e: React.MouseEvent<HTMLElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = 1.0 - (rect.top + rect.height / 2) / window.innerHeight;
  window.dispatchEvent(new CustomEvent("scenic-theme-hover", { detail: { x, y } }));
};

export const transitionScenicMood = (
  nextMood: ScenicMoodId,
  clientX: number,
  clientY: number,
  onApply: (m: ScenicMoodId) => void
) => {
  document.documentElement.style.setProperty("--ripple-x", `${(clientX / window.innerWidth) * 100}%`);
  document.documentElement.style.setProperty("--ripple-y", `${(clientY / window.innerHeight) * 100}%`);

  const apply = () => {
    document.documentElement.setAttribute("data-scenic-mood", nextMood);
    onApply(nextMood);
  };

  const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
  if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    doc.startViewTransition(apply);
  } else {
    apply();
  }
};

export const ScenicAnimationRig: React.FC<ScenicAnimationRigProps> = ({
  mood,
  liteMode = false,
  paused = false,
  onChapterChange,
}) => {
  const scrollRayRef = useRef<HTMLDivElement>(null);
  const lastChapterRef = useRef<"top" | "films" | "upcoming" | "horizon">("top");

  useEffect(() => {
    document.documentElement.setAttribute("data-scenic-mood", mood);
  }, [mood]);

  useEffect(() => {
    let ticking = false;
    const sync = () => {
      ticking = false;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / max));
      if (scrollRayRef.current) {
        scrollRayRef.current.style.transform = `scaleX(${ratio.toFixed(4)})`;
      }
      if (onChapterChange) {
        const ch: "top" | "films" | "upcoming" | "horizon" =
          ratio < 0.22 ? "top" : ratio < 0.52 ? "films" : ratio < 0.78 ? "upcoming" : "horizon";
        if (ch !== lastChapterRef.current) {
          lastChapterRef.current = ch;
          onChapterChange(ch);
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(sync);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    sync();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onChapterChange]);

  return (
    <>
      <ScenicPureCode3DWorld mood={mood} liteMode={liteMode} paused={paused} />
      <AtmosphericDriftLayer mood={mood} liteMode={liteMode} paused={paused} />
      <div ref={scrollRayRef} className="scenic-scroll-ray" aria-hidden="true" />
    </>
  );
};
