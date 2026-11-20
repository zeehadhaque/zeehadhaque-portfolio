import React, { useEffect, useRef } from "react";

export const WaterDropCursor: React.FC = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.body.classList.add("has-crystal-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let activeCard: HTMLElement | null = null;
    let cardRect: DOMRect | null = null;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      const target = e.target as HTMLElement | null;
      const card = target?.closest(".crystal-card") as HTMLElement | null;
      if (card !== activeCard) {
        activeCard = card;
        cardRect = card ? card.getBoundingClientRect() : null;
      }

      const interactive = target?.closest(
        "button, a, [data-cursor-label]"
      ) as HTMLElement | null;

      if (ringRef.current) {
        ringRef.current.dataset.hover = interactive ? "true" : "false";
      }

      const label = interactive?.getAttribute("data-cursor-label") ?? "";
      if (tagRef.current && tagRef.current.textContent !== label) {
        tagRef.current.textContent = label;
        tagRef.current.dataset.visible = label ? "true" : "false";
      }
    };

    const onDown = (e: MouseEvent) => {
      const ring = document.createElement("div");
      ring.className = "drop-splash-ring";
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
      document.body.appendChild(ring);
      setTimeout(() => ring.remove(), 700);
    };

    const onScroll = () => {
      if (activeCard) cardRect = activeCard.getBoundingClientRect();
    };

    const tick = () => {
      rx += (mx - rx) * 0.17;
      ry += (my - ry) * 0.17;

      if (activeCard && cardRect) {
        activeCard.style.setProperty("--mx", `${mx - cardRect.left}px`);
        activeCard.style.setProperty("--my", `${my - cardRect.top}px`);
      }
      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      if (tagRef.current) {
        tagRef.current.style.transform = `translate3d(${rx + 26}px, ${ry - 14}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove("has-crystal-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="drop-cursor-ring" data-hover="false" aria-hidden="true" />
      <div ref={coreRef} className="drop-cursor-core" aria-hidden="true" />
      <div ref={tagRef} className="drop-cursor-tag" data-visible="false" aria-hidden="true" />
    </>
  );
};
