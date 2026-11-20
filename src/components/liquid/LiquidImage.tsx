import React, { useEffect, useId, useRef, useState } from "react";

interface LiquidImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  cursorLabel?: string;
  priority?: boolean;
}

export const LiquidImage: React.FC<LiquidImageProps> = ({
  src,
  fallbackSrc,
  alt,
  aspectRatio = "16 / 10",
  className = "",
  cursorLabel = "VIEW",
  priority = false,
}) => {
  const uid = useId().replace(/:/g, "");
  const filterId = `liquid-warp-${uid}`;
  const frameRef = useRef<HTMLDivElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const rafRef = useRef<number>(0);
  const stateRef = useRef({ scale: 0, target: 0 });
  const [filterActive, setFilterActive] = useState(false);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const animateRipple = () => {
    const st = stateRef.current;
    st.scale += (st.target - st.scale) * 0.14;

    if (dispRef.current) {
      dispRef.current.setAttribute("scale", st.scale.toFixed(1));
    }

    if (Math.abs(st.target - st.scale) > 0.15) {
      rafRef.current = requestAnimationFrame(animateRipple);
    } else {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      if (st.target === 0) setFilterActive(false);
    }
  };

  const handleEnter = () => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setFilterActive(true);
    stateRef.current.target = 16;
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animateRipple);
  };

  const handleLeave = () => {
    stateRef.current.target = 0;
    if (frameRef.current) {
      frameRef.current.style.transform = "";
    }
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animateRipple);
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(1)}deg) rotateY(${(x * 7).toFixed(1)}deg)`;
  };

  return (
    <div
      ref={frameRef}
      className={`liquid-img-frame ${className}`}
      style={{ aspectRatio }}
      data-cursor-label={cursorLabel}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
    >
      {filterActive && (
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <filter id={filterId}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.016 0.022"
                numOctaves={1}
                result="noise"
              />
              <feDisplacementMap
                ref={dispRef}
                in="SourceGraphic"
                in2="noise"
                scale={0}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}

      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className="liquid-img-el"
        style={filterActive ? { filter: `url(#${filterId})` } : undefined}
        onError={(e) => {
          const img = e.currentTarget;
          if (fallbackSrc && img.src !== fallbackSrc) img.src = fallbackSrc;
        }}
      />
      <div className="liquid-img-sheen" aria-hidden="true" />
    </div>
  );
};
