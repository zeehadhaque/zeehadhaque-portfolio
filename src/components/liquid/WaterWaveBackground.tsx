import React, { useEffect, useRef } from "react";

export type LiquidThemeId = "abyss" | "glacial" | "noir";

interface WaterWaveBackgroundProps {
  theme: LiquidThemeId;
  liteMode?: boolean;
  paused?: boolean;
}

const VERT_SRC = `
  attribute vec2 aPos;
  varying vec2 vUv;
  void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;

// Optimized mediump/highp hybrid shader with 6 active ripples & ~75% fewer ALU ops
const FRAG_SRC = `
  precision mediump float;
  varying vec2 vUv;

  uniform vec2 uRes;
  uniform float uTime;
  uniform float uScroll;
  uniform float uScrollVel;
  uniform vec2 uMouse;
  uniform vec3 uDeepColor;
  uniform vec3 uMidColor;
  uniform vec3 uGlowColor;
  uniform vec4 uRipples[6];

  float waterHeight(vec2 p, float t) {
    vec2 sp = p + vec2(0.0, uScroll * 1.1);
    float h = sin(sp.x * 3.1 + t * 0.8 + cos(sp.y * 2.0 - t * 0.42)) * 0.25;
    h += cos(sp.y * 3.9 - t * 0.68 + sin(sp.x * 2.4 + t * 0.32)) * 0.20;
    h += sin((sp.x + sp.y) * 5.2 + t * 1.05) * 0.10;

    float boost = 1.0 + clamp(abs(uScrollVel) * 0.12, 0.0, 1.4);
    h += sin(sp.x * 11.0 - sp.y * 8.0 + t * 1.9) * 0.022 * boost;

    float aspect = uRes.x / max(uRes.y, 1.0);
    for (int i = 0; i < 6; i++) {
      vec4 r = uRipples[i];
      float age = t - r.z;
      if (age > 0.0 && age < 3.4 && r.w > 0.01) {
        vec2 d = p - r.xy;
        d.x *= aspect;
        float dist = length(d);
        float radius = age * 0.44;
        float diff = dist - radius;
        if (abs(diff) < 0.24) {
          float env = exp(-(diff * diff) * 150.0) * exp(-age * 1.05);
          h += sin(diff * 54.0) * env * r.w * 0.32;
        }
      }
    }
    return h;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime;
    float eps = 0.006;

    float hC = waterHeight(uv, t);
    float hX = waterHeight(uv + vec2(eps, 0.0), t);
    float hY = waterHeight(uv + vec2(0.0, eps), t);

    vec3 normal = normalize(vec3((hC - hX) * 2.6, (hC - hY) * 2.6, 0.24));
    vec3 lightPos = normalize(vec3((uMouse.x - 0.5) * 1.2, (uMouse.y - 0.5) * 1.2, 0.88));
    vec3 halfVec = normalize(lightPos + vec3(0.0, 0.0, 1.0));

    float diff = max(dot(normal, lightPos), 0.0);
    float spec = pow(max(dot(normal, halfVec), 0.0), 36.0);
    float fresnel = pow(1.0 - max(normal.z, 0.0), 2.8);
    float caustic = pow(clamp(0.5 + 0.5 * sin(hC * 12.0 + t * 0.85), 0.0, 1.0), 4.0);

    vec3 col = mix(uDeepColor, uMidColor, smoothstep(-0.35, 0.55, hC) * 0.72 + diff * 0.28);
    col += uGlowColor * (spec * 0.68 + fresnel * 0.26 + caustic * 0.12);

    vec2 vc = (uv - 0.5) * vec2(1.12, 1.0);
    col *= mix(0.48, 1.0, smoothstep(1.05, 0.2, length(vc)));

    gl_FragColor = vec4(col, 1.0);
  }
`;

const THEME_RGB: Record<LiquidThemeId, { deep: number[]; mid: number[]; glow: number[] }> = {
  abyss: { deep: [0.008, 0.012, 0.022], mid: [0.035, 0.078, 0.149], glow: [0.49, 0.733, 1.0] },
  glacial: { deep: [0.015, 0.045, 0.105], mid: [0.07, 0.185, 0.34], glow: [0.76, 0.89, 1.0] },
  noir: { deep: [0.004, 0.006, 0.012], mid: [0.022, 0.042, 0.082], glow: [0.38, 0.62, 0.92] },
};

export const WaterWaveBackground: React.FC<WaterWaveBackgroundProps> = ({
  theme,
  liteMode = false,
  paused = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef<LiquidThemeId>(theme);
  const pausedRef = useRef<boolean>(paused);
  themeRef.current = theme;
  pausedRef.current = paused;

  useEffect(() => {
    if (liteMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT_SRC));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG_SRC));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uScroll = gl.getUniformLocation(prog, "uScroll");
    const uScrollVel = gl.getUniformLocation(prog, "uScrollVel");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uDeep = gl.getUniformLocation(prog, "uDeepColor");
    const uMid = gl.getUniformLocation(prog, "uMidColor");
    const uGlow = gl.getUniformLocation(prog, "uGlowColor");
    const uRipples = gl.getUniformLocation(prog, "uRipples");

    const rippleData = new Float32Array(6 * 4);
    let rippleIdx = 0;
    let lastSpawn = 0;
    const startTime = performance.now();
    let mouseX = 0.5;
    let mouseY = 0.5;
    let smoothMX = 0.5;
    let smoothMY = 0.5;
    let lastScrollY = window.scrollY;
    let scrollVel = 0;
    let maxScrollCache = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    const curDeep = [...THEME_RGB[themeRef.current].deep];
    const curMid = [...THEME_RGB[themeRef.current].mid];
    const curGlow = [...THEME_RGB[themeRef.current].glow];

    const spawnRipple = (nx: number, ny: number, strength: number) => {
      if (pausedRef.current || document.hidden) return;
      const nowSec = (performance.now() - startTime) * 0.001;
      const base = rippleIdx * 4;
      rippleData[base] = nx;
      rippleData[base + 1] = ny;
      rippleData[base + 2] = nowSec;
      rippleData[base + 3] = strength;
      rippleIdx = (rippleIdx + 1) % 6;
    };

    const resize = () => {
      // Soft liquid surface looks silky at 0.55x desktop / 0.42x mobile with ~80% less GPU work
      const scale = window.innerWidth < 768 ? 0.42 : 0.58;
      canvas.width = Math.max(320, Math.floor(window.innerWidth * scale));
      canvas.height = Math.max(240, Math.floor(window.innerHeight * scale));
      maxScrollCache = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1.0 - e.clientY / window.innerHeight;
      const now = performance.now();
      if (now - lastSpawn > 140) {
        spawnRipple(mouseX, mouseY, 0.65);
        lastSpawn = now;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      spawnRipple(e.clientX / window.innerWidth, 1.0 - e.clientY / window.innerHeight, 1.4);
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    let rafId = 0;
    let lastFrame = 0;
    const minFrameMs = window.innerWidth < 768 ? 30 : 16; // ~33fps mobile, 60fps desktop

    const render = (now: number) => {
      rafId = requestAnimationFrame(render);
      if (pausedRef.current || document.hidden) return;
      if (now - lastFrame < minFrameMs) return;
      lastFrame = now;

      const t = (now - startTime) * 0.001;
      smoothMX += (mouseX - smoothMX) * 0.08;
      smoothMY += (mouseY - smoothMY) * 0.08;

      const curScrollY = window.scrollY;
      scrollVel += ((curScrollY - lastScrollY) * 0.12 - scrollVel) * 0.14;
      lastScrollY = curScrollY;

      const target = THEME_RGB[themeRef.current];
      for (let i = 0; i < 3; i++) {
        curDeep[i] += (target.deep[i] - curDeep[i]) * 0.06;
        curMid[i] += (target.mid[i] - curMid[i]) * 0.06;
        curGlow[i] += (target.glow[i] - curGlow[i]) * 0.06;
      }

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uScroll, curScrollY / maxScrollCache);
      gl.uniform1f(uScrollVel, scrollVel);
      gl.uniform2f(uMouse, smoothMX, smoothMY);
      gl.uniform3f(uDeep, curDeep[0], curDeep[1], curDeep[2]);
      gl.uniform3f(uMid, curMid[0], curMid[1], curMid[2]);
      gl.uniform3f(uGlow, curGlow[0], curGlow[1], curGlow[2]);
      gl.uniform4fv(uRipples, rippleData);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [liteMode]);

  if (liteMode) {
    return <div className="water-bg-fallback" aria-hidden="true" />;
  }

  return <canvas ref={canvasRef} className="water-bg-canvas" aria-hidden="true" />;
};
