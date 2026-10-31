import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;
let rafId: number | null = null;

export function initSmoothScroll(): () => void {
  if (typeof window === 'undefined') return () => {};

  // If already initialized, return cleanup
  if (lenisInstance) {
    return () => destroySmoothScroll();
  }

  // Configure Lenis for silky-smooth 120fps display refresh rates
  lenisInstance = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Cine-exponential smooth deceleration
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.2,
    infinite: false,
    autoRaf: false, // We drive via custom high-precision RAF
  });

  (window as any).__lenis = lenisInstance;

  // Custom RAF loop synced with native display refresh rate (60Hz, 120Hz, 144Hz, etc.)
  function raf(time: number) {
    if (lenisInstance) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
  }
  rafId = requestAnimationFrame(raf);

  // Global smooth anchor scroll interceptor
  const handleAnchorClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
    if (anchor && anchor.hash) {
      const hash = anchor.hash;
      const targetElement = document.querySelector(hash);
      if (targetElement && lenisInstance) {
        e.preventDefault();
        lenisInstance.scrollTo(targetElement as HTMLElement, {
          offset: -40,
          duration: 1.2,
        });
      }
    }
  };

  document.addEventListener('click', handleAnchorClick, { passive: false });

  return () => {
    document.removeEventListener('click', handleAnchorClick);
    destroySmoothScroll();
  };
}

export function destroySmoothScroll() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
    (window as any).__lenis = null;
  }
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function smoothScrollTo(
  target: string | HTMLElement | number,
  options?: { offset?: number; duration?: number; immediate?: boolean }
) {
  if (!lenisInstance) {
    if (typeof target === 'string') {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }

  lenisInstance.scrollTo(target, {
    offset: options?.offset ?? -40,
    duration: options?.duration ?? 1.2,
    immediate: options?.immediate ?? false,
  });
}

export function pauseScroll() {
  lenisInstance?.stop();
}

export function resumeScroll() {
  lenisInstance?.start();
}
