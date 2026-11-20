import React, { useEffect, useRef } from "react";

interface ValleyParallaxLayersProps {
  liteMode?: boolean;
}

export const ValleyParallaxLayers: React.FC<ValleyParallaxLayersProps> = ({ liteMode = false }) => {
  const mistRef = useRef<HTMLDivElement>(null);
  const pinesLeftRef = useRef<SVGSVGElement>(null);
  const pinesRightRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (liteMode) return;
    let ticking = false;

    const update = () => {
      ticking = false;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const r = Math.min(1, Math.max(0, window.scrollY / max));

      if (mistRef.current) {
        mistRef.current.style.transform = `translate3d(${((r - 0.5) * -40).toFixed(1)}px, ${(r * -30).toFixed(1)}px, 0)`;
      }
      if (pinesLeftRef.current) {
        pinesLeftRef.current.style.transform = `translate3d(${(-r * 28).toFixed(1)}px, ${(r * 36).toFixed(1)}px, 0)`;
      }
      if (pinesRightRef.current) {
        pinesRightRef.current.style.transform = `translate3d(${(r * 28).toFixed(1)}px, ${(r * 28).toFixed(1)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [liteMode]);

  if (liteMode) return null;

  return (
    <div className="scenic-parallax-stage" aria-hidden="true">
      {/* Drifting Cold Valley Fog Band */}
      <div ref={mistRef} className="scenic-valley-mist" />

      {/* Left Foreground Evergreen Pine Silhouettes */}
      <svg
        ref={pinesLeftRef}
        className="scenic-pine-cluster scenic-pine-cluster--left"
        viewBox="0 0 320 420"
        fill="none"
      >
        <path
          d="M42 420 L42 150 L12 220 L34 215 L4 290 L30 285 L-8 360 L26 355 L-10 420 Z M42 150 L72 220 L50 215 L80 290 L54 285 L92 360 L58 355 L94 420 L42 420 Z"
          fill="rgba(4, 10, 20, 0.72)"
        />
        <path
          d="M128 420 L128 210 L96 275 L118 272 L86 340 L114 336 L78 420 Z M128 210 L160 275 L138 272 L170 340 L142 336 L178 420 L128 420 Z"
          fill="rgba(5, 13, 26, 0.52)"
        />
      </svg>

      {/* Right Foreground Evergreen Pine Silhouettes */}
      <svg
        ref={pinesRightRef}
        className="scenic-pine-cluster scenic-pine-cluster--right"
        viewBox="0 0 320 420"
        fill="none"
      >
        <path
          d="M270 420 L270 130 L234 205 L258 200 L224 282 L254 278 L214 358 L248 354 L212 420 Z M270 130 L306 205 L282 200 L316 282 L286 278 L326 358 L292 354 L328 420 L270 420 Z"
          fill="rgba(4, 10, 20, 0.72)"
        />
        <path
          d="M186 420 L186 225 L156 288 L178 285 L146 352 L172 348 L140 420 Z M186 225 L216 288 L194 285 L226 352 L200 348 L232 420 L186 420 Z"
          fill="rgba(5, 13, 26, 0.48)"
        />
      </svg>
    </div>
  );
};
