import { useEffect, useState, useRef } from 'react';

export function CustomCursor() {
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const targetPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHoveredRef = useRef(false);
  const cursorTextRef = useRef('');

  useEffect(() => {
    // Detect touch device
    if (typeof window !== 'undefined') {
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        setIsTouchDevice(true);
        return;
      }
    }

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;

      // Instant inner dot placement for sub-millisecond tactile response
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
      }

      // Check hovered element data-cursor attribute only when moving
      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest('[data-cursor]') as HTMLElement | null;

      if (interactiveEl) {
        const text = interactiveEl.getAttribute('data-cursor') || '';
        if (text !== cursorTextRef.current) {
          cursorTextRef.current = text;
          setCursorText(text);
        }
        if (!isHoveredRef.current) {
          isHoveredRef.current = true;
          setIsHovered(true);
        }
      } else {
        if (cursorTextRef.current !== '') {
          cursorTextRef.current = '';
          setCursorText('');
        }
        if (isHoveredRef.current) {
          isHoveredRef.current = false;
          setIsHovered(false);
        }
      }
    };

    // 120fps hardware-accelerated fluid lerp loop for the trailing lens ring
    const render = () => {
      const ring = ringRef.current;
      if (ring) {
        const hovered = isHoveredRef.current;
        const targetOffset = hovered ? 40 : 16;

        // Fluid spring-like ease towards mouse position
        const ease = hovered ? 0.28 : 0.22;
        ringPos.current.x += (targetPos.current.x - ringPos.current.x) * ease;
        ringPos.current.y += (targetPos.current.y - ringPos.current.y) * ease;

        const rx = ringPos.current.x - targetOffset;
        const ry = ringPos.current.y - targetOffset;

        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {/* Outer Ring with GPU-accelerated translate3d */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 flex items-center justify-center rounded-full border will-change-transform transition-all duration-200"
        style={{
          width: isHovered ? 80 : 32,
          height: isHovered ? 80 : 32,
          boxShadow: isHovered ? '0 0 25px var(--cine-accent-glow)' : 'none',
          backgroundColor: isHovered ? 'rgba(3, 7, 18, 0.7)' : 'transparent',
          borderColor: isHovered ? 'var(--cine-accent)' : 'rgba(var(--cine-accent-rgb), 0.35)',
        }}
      >
        {cursorText && (
          <span
            className="font-mono-film text-[10px] tracking-widest font-bold uppercase select-none transition-colors duration-300 pointer-events-none px-1 text-center"
            style={{ color: 'var(--cine-accent)' }}
          >
            {cursorText}
          </span>
        )}
      </div>

      {/* Inner Dot with direct sub-millisecond translation */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full transition-opacity duration-200 will-change-transform"
        style={{
          backgroundColor: 'var(--cine-accent)',
          boxShadow: '0 0 8px var(--cine-accent)',
          opacity: isHovered ? 0.2 : 1,
        }}
      />
    </div>
  );
}
