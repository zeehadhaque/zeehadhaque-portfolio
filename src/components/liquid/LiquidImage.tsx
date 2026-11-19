import React, { useId, useRef } from "react";

interface LiquidImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  cursorLabel?: string;
}

export const LiquidImage: React.FC<LiquidImageProps> = ({
  src,
  alt,
  aspectRatio = "16 / 10",
  className = "",
  cursorLabel = "VIEW",
}) => {
  const uid = useId().replace(/:/g, "");
  const filterId = `liquid-warp-${uid}`;
  const frameRef = useRef<HTMLDivElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const rafRef = useRef<number>(0);
  const stateRef = useRef({ scale: 0, target: 0, freq: 0.015 });

  const animateRipple = () => {
    const st = stateRef.current;
    st.scale += (st.target - st.scale) * 0.12;
    st.freq += 0.0005;

    if (dispRef.current) {
      dispRef.current.setAttribute("scale", st.scale.toFixed(2));
    }
    if (turbRef.current && st.scale > 0.25) {
      const f = 0.014 + Math.sin(st.freq * 8) * 0.004;
      turbRef.current.setAttribute("baseFrequency", `${f.toFixed(4)} ${(f * 1.4).toFixed(4)}`);
    }

    if (Math.abs(st.target - st.scale) > 0.08 || st.target > 0) {
      rafRef.current = requestAnimationFrame(animateRipple);
    } else {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  };

  const handleEnter = () => {
    stateRef.current.target = 22;
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animateRipple);
  };

  const handleLeave = () => {
    stateRef.current.target = 0;
    if (frameRef.current) {
      frameRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    }
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animateRipple);
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 9).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg)`;
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
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.015 0.022"
              numOctaves={2}
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

      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="liquid-img-el"
        style={{ filter: `url(#${filterId})` }}
      />
      <div className="liquid-img-sheen" aria-hidden="true" />
    </div>
  );
};
