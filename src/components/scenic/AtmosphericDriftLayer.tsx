import React, { useEffect, useRef } from "react";
import { ScenicMoodId } from "./ScenicPureCode3DWorld";

interface AtmosphericDriftLayerProps {
  mood: ScenicMoodId;
  liteMode?: boolean;
  paused?: boolean;
}

interface DriftParticle {
  kind: "leaf" | "snow" | "ember";
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vRot: number;
  flip: number;
  vFlip: number;
  alpha: number;
  hue: string;
}

const LEAF_COLORS = ["#d64933", "#e87a3e", "#f2b04d", "#b52d26", "#f4c974"];

const drawAutumnLeaf = (ctx: CanvasRenderingContext2D, r: number, color: string) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.9);
  ctx.quadraticCurveTo(r * 0.15, r * 0.35, r * 0.85, r * 0.35);
  ctx.quadraticCurveTo(r * 0.45, 0, r * 0.95, -r * 0.25);
  ctx.quadraticCurveTo(r * 0.32, -r * 0.28, 0, -r * 1.05);
  ctx.quadraticCurveTo(-r * 0.32, -r * 0.28, -r * 0.95, -r * 0.25);
  ctx.quadraticCurveTo(-r * 0.45, 0, -r * 0.85, r * 0.35);
  ctx.quadraticCurveTo(-r * 0.15, r * 0.35, 0, r * 0.9);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 232, 185, 0.35)";
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(0, r * 1.15);
  ctx.lineTo(0, -r * 0.75);
  ctx.stroke();
};

export const AtmosphericDriftLayer: React.FC<AtmosphericDriftLayerProps> = ({
  mood,
  liteMode = false,
  paused = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moodRef = useRef<ScenicMoodId>(mood);
  const pausedRef = useRef<boolean>(paused);
  moodRef.current = mood;
  pausedRef.current = paused;

  useEffect(() => {
    if (liteMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    const isMobile = w < 768;
    const count = isMobile ? 16 : 34;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const particles: DriftParticle[] = Array.from({ length: count }, (_, i) => {
      const kind: DriftParticle["kind"] =
        i < count * 0.38 ? "leaf" : i < count * 0.82 ? "snow" : "ember";
      return {
        kind,
        x: Math.random() * w,
        y: Math.random() * h,
        vx: kind === "leaf" ? -0.45 - Math.random() * 0.55 : (Math.random() - 0.5) * 0.4,
        vy: kind === "ember" ? -0.25 - Math.random() * 0.35 : 0.45 + Math.random() * 0.85,
        size:
          kind === "leaf"
            ? 7 + Math.random() * 6
            : kind === "snow"
            ? 1.6 + Math.random() * 2.4
            : 2 + Math.random() * 2.2,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.025,
        flip: Math.random() * Math.PI * 2,
        vFlip: 0.02 + Math.random() * 0.03,
        alpha: 0.36 + Math.random() * 0.52,
        hue: LEAF_COLORS[i % LEAF_COLORS.length],
      };
    });

    let mx = -999;
    let my = -999;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let last = 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (pausedRef.current || document.hidden) return;
      if (now - last < (isMobile ? 32 : 16)) return;
      last = now;

      ctx.clearRect(0, 0, w, h);

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollRatio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      const curMood = moodRef.current;

      const leafWeight =
        curMood === "ember"
          ? 1.0
          : 0.30 + Math.sin(Math.min(1, scrollRatio * 1.4) * Math.PI) * 0.72;
      const emberWeight = curMood === "ember" ? 0.95 : 0.25 + scrollRatio * 0.85;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = p.x - mx;
        const dy = p.y - my;
        const dSq = dx * dx + dy * dy;
        if (dSq < 26000 && dSq > 1) {
          const dist = Math.sqrt(dSq);
          const force = (1 - dist / 162) * 0.55;
          p.x += (dx / dist) * force * 2.2;
          p.y += (dy / dist) * force * 1.4;
        }

        p.x += p.vx + Math.sin(now * 0.0008 + i) * 0.35;
        p.y += p.vy;
        p.rot += p.vRot;
        p.flip += p.vFlip;

        if (p.y > h + 24) { p.y = -20; p.x = Math.random() * w; }
        if (p.y < -24) { p.y = h + 20; p.x = Math.random() * w; }
        if (p.x < -24) p.x = w + 20;
        if (p.x > w + 24) p.x = -20;

        if (p.kind === "leaf") {
          const op = p.alpha * leafWeight;
          if (op < 0.05) continue;
          ctx.save();
          ctx.globalAlpha = op;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.scale(Math.cos(p.flip), 0.78 + 0.22 * Math.sin(p.flip));
          drawAutumnLeaf(ctx, p.size, p.hue);
          ctx.restore();
        } else if (p.kind === "snow") {
          ctx.save();
          ctx.globalAlpha = p.alpha * (curMood === "ember" ? 0.45 : 0.88);
          ctx.fillStyle = "#eef7ff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          const op = p.alpha * emberWeight * (0.55 + 0.45 * Math.sin(now * 0.003 + i * 2.1));
          if (op < 0.06) continue;
          ctx.save();
          ctx.globalAlpha = op;
          ctx.fillStyle = "#ffd38a";
          ctx.shadowColor = "#ff9d3b";
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [liteMode]);

  if (liteMode) return null;
  return <canvas ref={canvasRef} className="scenic-drift-canvas" aria-hidden="true" />;
};
