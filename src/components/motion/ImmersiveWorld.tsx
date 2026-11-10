import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; z: number; phase: number };
type TrailPoint = { x: number; y: number; life: number };
type ProjectedParticle = { x: number; y: number; r: number };

export function ImmersiveWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true, desynchronized: true });
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    const compactViewport = Math.min(window.innerWidth, window.innerHeight) < 700;
    const lowPower = cores <= 4 || memory <= 4 || !finePointer || compactViewport;
    const frameInterval = lowPower ? 1000 / 24 : 1000 / 30;
    const particleCount = reduced ? 18 : lowPower ? 22 : 36;

    const particles: Particle[] = Array.from({ length: particleCount }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      phase: index * 0.73,
    }));
    const trail: TrailPoint[] = [];
    const maxConnections = 145 * 145;

    let width = 0;
    let height = 0;
    let tick = 0;
    let raf = 0;
    let lastPaint = 0;
    let scrollProgress = 0;
    let running = false;
    let atmosphere: CanvasGradient | null = null;
    let pointer = { x: -1000, y: -1000 };

    const paint = (time: number, force = false) => {
      if (!force && time - lastPaint < frameInterval) return;
      lastPaint = time;
      tick += 1;

      ctx.clearRect(0, 0, width, height);
      if (atmosphere) {
        ctx.fillStyle = atmosphere;
        ctx.fillRect(0, 0, width, height);
      }

      const travel = reduced ? 0 : scrollProgress * height * 0.18;
      const projected: ProjectedParticle[] = [];
      for (const particle of particles) {
        const drift = reduced ? 0 : Math.sin(tick * 0.003 + particle.phase) * 0.018;
        projected.push({
          x: (particle.x + drift) * width,
          y: (particle.y + (reduced ? 0 : Math.cos(tick * 0.002 + particle.phase) * 0.014)) * height
            - travel * (0.22 + particle.z * 0.78),
          r: 0.6 + particle.z * 1.5,
        });
      }

      // Group nearby links by opacity so the canvas issues only a few strokes per frame.
      const links: Array<Array<[number, number, number, number]>> = [[], [], [], []];
      for (let i = 0; i < projected.length; i += 1) {
        for (let j = i + 1; j < projected.length; j += 1) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared >= maxConnections) continue;
          const distance = Math.sqrt(distanceSquared);
          const opacityGroup = Math.min(3, Math.floor((1 - distance / 145) * 4));
          links[opacityGroup].push([a.x, a.y, b.x, b.y]);
        }
      }

      links.forEach((group, index) => {
        if (!group.length) return;
        ctx.beginPath();
        for (const [x1, y1, x2, y2] of group) {
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.strokeStyle = `rgba(135,174,225,${0.025 + index * 0.038})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });

      for (const particle of projected) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(178,205,239,.46)";
        ctx.fill();
      }

      if (!reduced && finePointer) {
        for (let index = 0; index < trail.length; index += 1) {
          const point = trail[index];
          point.life -= 0.045;
          if (index === 0) continue;
          const previous = trail[index - 1];
          ctx.beginPath();
          ctx.moveTo(previous.x, previous.y);
          ctx.lineTo(point.x, point.y);
          ctx.strokeStyle = `rgba(155,190,236,${Math.max(0, point.life * 0.2)})`;
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
        while (trail.length && trail[0].life <= 0) trail.shift();

        if (pointer.x >= 0 && pointer.y >= 0) {
          const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 170);
          glow.addColorStop(0, "rgba(86,139,209,.11)");
          glow.addColorStop(1, "rgba(86,139,209,0)");
          ctx.fillStyle = glow;
          ctx.fillRect(pointer.x - 170, pointer.y - 170, 340, 340);
        }
      }
    };

    const loop = (time: number) => {
      if (!running || document.hidden) return;
      paint(time);
      raf = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduced || running || document.hidden) return;
      running = true;
      lastPaint = 0;
      raf = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(raf);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.35);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      atmosphere = ctx.createRadialGradient(
        width * 0.52, height * 0.48, 0,
        width * 0.52, height * 0.48, Math.max(width, height) * 0.78,
      );
      atmosphere.addColorStop(0, "rgba(28,43,70,.32)");
      atmosphere.addColorStop(0.55, "rgba(8,13,24,.18)");
      atmosphere.addColorStop(1, "rgba(2,4,9,.86)");
      paint(performance.now(), true);
    };

    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / max));
      if (!running && !reduced) paint(performance.now(), true);
    };

    const onPointer = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      trail.push({ x: pointer.x, y: pointer.y, life: 1 });
      if (trail.length > 16) trail.shift();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    resize();
    if (!reduced) {
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      if (finePointer) window.addEventListener("pointermove", onPointer, { passive: true });
    }
    start();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      if (finePointer) window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="immersive-world" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="immersive-world__vignette" />
      <div className="immersive-world__scanline" />
    </div>
  );
}
