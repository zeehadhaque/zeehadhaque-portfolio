import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; z: number; phase: number };
type TrailPoint = { x: number; y: number; life: number };
type ProjectedParticle = { x: number; y: number; radius: number; depth: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const BASE_FRAME_MS = 1000 / 60;

export function ImmersiveWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true, desynchronized: true });
    if (!canvas || !context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    const compactViewport = Math.min(window.innerWidth, window.innerHeight) < 700;
    const lowPower = cores <= 4 || memory <= 4 || !finePointer || compactViewport;
    const particleCount = lowPower ? 26 : 54;
    const particles: Particle[] = Array.from({ length: particleCount }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      phase: index * 0.618,
    }));
    const trail: TrailPoint[] = [];
    const maxLinkDistance = lowPower ? 112 : 142;
    const maxLinkDistanceSquared = maxLinkDistance * maxLinkDistance;

    let width = 0;
    let height = 0;
    let raf = 0;
    let lastFrameTime = 0;
    let elapsed = 0;
    let scrollProgress = 0;
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let targetScrollVelocity = 0;
    let scrollVelocity = 0;
    let running = false;
    let touchIsDown = false;

    const pointer = { x: -1000, y: -1000 };

    const addTrailPoint = (x: number, y: number) => {
      trail.push({ x, y, life: 1 });
      if (trail.length > (lowPower ? 14 : 26)) trail.shift();
    };

    const drawScrollRibbons = (energy: number, time: number) => {
      if (energy < 0.025) return;

      const direction = scrollVelocity >= 0 ? 1 : -1;
      const intensity = clamp(energy, 0, 1);
      const phase = time * 0.00022;
      const centerY = height * 0.5;
      const spread = height * (0.13 + intensity * 0.12);
      const gradient = context.createLinearGradient(0, centerY - spread, width, centerY + spread);
      gradient.addColorStop(0, "rgba(95,158,232,0)");
      gradient.addColorStop(0.35, `rgba(105,177,249,${0.035 + intensity * 0.14})`);
      gradient.addColorStop(0.7, `rgba(174,211,255,${0.025 + intensity * 0.11})`);
      gradient.addColorStop(1, "rgba(95,158,232,0)");

      context.save();
      context.globalCompositeOperation = "screen";
      context.strokeStyle = gradient;
      context.lineCap = "round";
      context.shadowColor = "rgba(117,181,255,.36)";
      context.shadowBlur = lowPower ? 7 : 13;
      for (let strand = 0; strand < 3; strand += 1) {
        const offset = (strand - 1) * spread * 0.52;
        const wave = Math.sin(phase + strand * 1.7) * spread * 0.28;
        const startY = centerY + offset * direction + wave;
        context.lineWidth = 0.7 + intensity * (strand === 1 ? 1.8 : 1.15);
        context.beginPath();
        context.moveTo(-width * 0.08, startY);
        context.bezierCurveTo(
          width * 0.22, startY - direction * spread * (0.75 + intensity * 0.35),
          width * 0.42, centerY + offset * 0.12 + wave * 0.2,
          width * 0.58, centerY - offset * 0.25 - wave,
        );
        context.bezierCurveTo(
          width * 0.76, centerY + offset * 0.7 + wave * direction,
          width * 0.9, centerY - offset * 0.6 + wave,
          width * 1.08, centerY - offset * direction + wave * 0.25,
        );
        context.stroke();
      }
      context.restore();
    };

    const drawPointerTrail = (deltaMs: number) => {
      if (trail.length < 2) return;

      let averageLife = 0;
      for (const point of trail) {
        point.life = Math.max(0, point.life - deltaMs / 880);
        averageLife += point.life;
      }
      averageLife /= trail.length;

      context.beginPath();
      context.moveTo(trail[0].x, trail[0].y);
      for (let index = 1; index < trail.length; index += 1) {
        context.lineTo(trail[index].x, trail[index].y);
      }
      context.save();
      context.globalCompositeOperation = "screen";
      context.globalAlpha = averageLife * 0.66;
      context.strokeStyle = "rgba(166,207,255,.9)";
      context.lineWidth = lowPower ? 1.1 : 1.6;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.shadowColor = "rgba(110,174,249,.72)";
      context.shadowBlur = lowPower ? 5 : 10;
      context.stroke();
      context.restore();

      while (trail.length && trail[0].life <= 0) trail.shift();
    };

    const paint = (time: number, deltaMs: number) => {
      elapsed += deltaMs;
      context.clearRect(0, 0, width, height);

      const travel = scrollProgress * 0.22;
      const projected: ProjectedParticle[] = [];
      for (const particle of particles) {
        const breathe = reduced ? 0 : Math.sin(elapsed * 0.00048 + particle.phase) * 0.012;
        const depth = 0.44 + particle.z * 0.78;
        let yProgress = particle.y + travel * (0.45 + particle.z * 0.8);
        yProgress = ((yProgress % 1) + 1) % 1;
        projected.push({
          x: width * 0.5 + (particle.x - 0.5 + breathe) * width * depth,
          y: height * 0.5 + (yProgress - 0.5) * height * depth,
          radius: 0.45 + particle.z * (lowPower ? 1.15 : 1.45),
          depth: particle.z,
        });
      }

      // Batch fine particle filaments into four opacity passes for fewer canvas strokes.
      const links: Array<Array<[number, number, number, number]>> = [[], [], [], []];
      for (let i = 0; i < projected.length; i += 1) {
        for (let j = i + 1; j < projected.length; j += 1) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared >= maxLinkDistanceSquared) continue;
          const opacityGroup = Math.min(3, Math.floor((1 - Math.sqrt(distanceSquared) / maxLinkDistance) * 4));
          links[opacityGroup].push([a.x, a.y, b.x, b.y]);
        }
      }

      context.save();
      context.globalCompositeOperation = "screen";
      for (let groupIndex = 0; groupIndex < links.length; groupIndex += 1) {
        const group = links[groupIndex];
        if (!group.length) continue;
        context.beginPath();
        for (const [x1, y1, x2, y2] of group) {
          context.moveTo(x1, y1);
          context.lineTo(x2, y2);
        }
        context.strokeStyle = `rgba(135,174,225,${0.018 + groupIndex * 0.034})`;
        context.lineWidth = 0.55;
        context.stroke();
      }

      for (const particle of projected) {
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(190,216,248,${0.2 + particle.depth * 0.35})`;
        context.fill();
      }
      context.restore();

      const energy = Math.abs(scrollVelocity);
      drawScrollRibbons(energy, time);
      if (finePointer && !reduced) drawPointerTrail(deltaMs);
    };

    const loop = (time: number) => {
      if (!running || document.hidden) return;
      const deltaMs = lastFrameTime ? clamp(time - lastFrameTime, 1, 48) : BASE_FRAME_MS;
      const frameScale = deltaMs / BASE_FRAME_MS;
      lastFrameTime = time;

      targetScrollVelocity *= Math.pow(0.8, frameScale);
      scrollVelocity += (targetScrollVelocity - scrollVelocity) * (1 - Math.pow(1 - 0.18, frameScale));
      if (Math.abs(targetScrollVelocity) < 0.008 && Math.abs(scrollVelocity) < 0.01) {
        targetScrollVelocity = 0;
        scrollVelocity = 0;
      }

      paint(time, deltaMs);
      raf = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduced || running || document.hidden) return;
      running = true;
      lastFrameTime = 0;
      raf = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(raf);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!running) paint(performance.now(), BASE_FRAME_MS);
    };

    const onScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const elapsedMs = Math.max(8, now - lastScrollTime);
      const deltaY = currentY - lastScrollY;
      targetScrollVelocity = clamp(deltaY / elapsedMs, -2.8, 2.8);
      scrollProgress = clamp(currentY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight), 0, 1);
      lastScrollY = currentY;
      lastScrollTime = now;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" && !touchIsDown) return;
      if (event.pointerType !== "touch" && !finePointer) return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      addTrailPoint(pointer.x, pointer.y);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      touchIsDown = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      addTrailPoint(pointer.x, pointer.y);
    };

    const onPointerUp = () => { touchIsDown = false; };
    const onVisibility = () => document.hidden ? stop() : start();

    resize();
    onScroll();
    start();
    if (!reduced) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      window.addEventListener("pointerup", onPointerUp, { passive: true });
      window.addEventListener("pointercancel", onPointerUp, { passive: true });
    }
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", resize);
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
