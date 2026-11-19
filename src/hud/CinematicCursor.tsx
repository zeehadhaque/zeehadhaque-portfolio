import React, { useEffect, useRef } from "react";

interface CinematicCursorProps {
  activeLabel: string | null;
  isMonolithHover: boolean;
}

export const CinematicCursor: React.FC<CinematicCursorProps> = ({
  activeLabel,
  isMonolithHover,
}) => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.body.classList.add("castle-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest("button, a, [data-cursor]");
      if (ringRef.current && !isMonolithHover) {
        ringRef.current.dataset.state = interactive ? "pointer" : "default";
      }
    };

    const tick = () => {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      ringX += dx * 0.16;
      ringY += dy * 0.16;

      const speed = Math.min(Math.hypot(dx, dy) * 0.012, 0.35);
      const angle = Math.atan2(dy, dx);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) rotate(${angle}rad) scale(${1 + speed}, ${1 - speed * 0.45})`;
      }
      if (tagRef.current) {
        tagRef.current.style.transform = `translate3d(${ringX + 26}px, ${ringY - 12}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove("castle-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [isMonolithHover]);

  useEffect(() => {
    if (ringRef.current && isMonolithHover) {
      ringRef.current.dataset.state = "monolith";
    } else if (ringRef.current) {
      ringRef.current.dataset.state = "default";
    }
  }, [isMonolithHover]);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" data-state="default" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div
        ref={tagRef}
        className="cursor-tag"
        data-visible={Boolean(activeLabel)}
        aria-hidden="true"
      >
        {activeLabel ?? ""}
      </div>
    </>
  );
};
