import React, { useEffect, useRef } from "react";

export const LiquidCursor: React.FC = () => {
  const haloRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.body.classList.add("has-liquid-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let hx = mx;
    let hy = my;
    let activeCard: HTMLElement | null = null;
    let cardRect: DOMRect | null = null;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      const target = e.target as HTMLElement | null;
      const card = target?.closest(".liquid-glass") as HTMLElement | null;
      if (card !== activeCard) {
        activeCard = card;
        cardRect = card ? card.getBoundingClientRect() : null;
      }

      const interactive = target?.closest(
        "button, a, [data-cursor-label], .film-card"
      ) as HTMLElement | null;

      if (haloRef.current) {
        haloRef.current.dataset.hover = interactive ? "true" : "false";
      }

      const label = interactive?.getAttribute("data-cursor-label") ?? "";
      if (pillRef.current && pillRef.current.textContent !== label) {
        pillRef.current.textContent = label;
        pillRef.current.dataset.visible = label ? "true" : "false";
      }
    };

    const onDown = (e: MouseEvent) => {
      const ring = document.createElement("div");
      ring.className = "liq-click-ripple";
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
      document.body.appendChild(ring);
      setTimeout(() => ring.remove(), 650);
    };

    const onScroll = () => {
      if (activeCard) cardRect = activeCard.getBoundingClientRect();
    };

    const tick = () => {
      const dx = mx - hx;
      const dy = my - hy;
      hx += dx * 0.18;
      hy += dy * 0.18;

      if (activeCard && cardRect) {
        activeCard.style.setProperty("--mx", `${mx - cardRect.left}px`);
        activeCard.style.setProperty("--my", `${my - cardRect.top}px`);
      }

      if (dropRef.current) {
        dropRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${hx}px, ${hy}px, 0)`;
      }
      if (pillRef.current) {
        pillRef.current.style.transform = `translate3d(${hx + 26}px, ${hy - 14}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove("has-liquid-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={haloRef} className="liq-cursor-halo" data-hover="false" aria-hidden="true" />
      <div ref={dropRef} className="liq-cursor-drop" aria-hidden="true" />
      <div ref={pillRef} className="liq-cursor-pill" data-visible="false" aria-hidden="true" />
    </>
  );
};
