import React, { useEffect, useState, useRef } from 'react';
import { useUniverseStore } from '../../store/universeStore';

export const DirectorCursor: React.FC = () => {
  const cursorLabel = useUniverseStore((s) => s.cursorLabel);
  const [isTouch, setIsTouch] = useState(false);
  const [visible, setVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Detect touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth animation loop for secondary tracking ring
    let animId: number;
    const loop = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.22;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y + 24}px, 0)`;
      }

      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [visible]);

  if (isTouch || !visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Precision Reticle Dot */}
      <div
        ref={dotRef}
        className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#7DBBFF] shadow-[0_0_8px_#7DBBFF] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150"
      />

      {/* Lagging Anamorphic Tracking Ring with Crosshairs */}
      <div
        ref={ringRef}
        className="absolute -top-4 -left-4 w-8 h-8 rounded-full border border-[#7DBBFF]/60 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
      >
        <div className="w-1.5 h-[1px] bg-[#A9D4FF]/80 absolute -left-1" />
        <div className="w-1.5 h-[1px] bg-[#A9D4FF]/80 absolute -right-1" />
        <div className="h-1.5 w-[1px] bg-[#A9D4FF]/80 absolute -top-1" />
        <div className="h-1.5 w-[1px] bg-[#A9D4FF]/80 absolute -bottom-1" />
      </div>

      {/* Contextual Action Label */}
      {cursorLabel && cursorLabel !== 'EXPLORE' && (
        <div
          ref={labelRef}
          className="absolute -left-16 w-32 text-center font-mono text-[9px] font-bold text-[#A9D4FF] tracking-[0.2em] uppercase px-1.5 py-0.5 rounded bg-[#020305]/85 border border-[#102B45] shadow-lg backdrop-blur-sm -translate-x-1/2"
        >
          {cursorLabel}
        </div>
      )}
    </div>
  );
};
