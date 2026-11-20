import React, { useEffect, useRef } from "react";

export type CrystalThemeId = "abyss" | "glacier" | "noir";

interface LiquidCrystalRayCanvasProps {
  theme: CrystalThemeId;
  liteMode?: boolean;
  paused?: boolean;
}

const VERT = `
  attribute vec2 aPos;
  varying vec2 vUv;
  void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;

// Unified optical shader: ocean wave + liquid crystal iridescence + volumetric god-rays + ambient & interactive water drops
const FRAG = `
  precision mediump float;
  varying vec2 vUv;

  uniform vec2 uRes;
  uniform float uTime;
  uniform float uScroll;
  uniform float uScrollVel;
  uniform vec2 uMouse;
  uniform vec3 uDeep;
  uniform vec3 uMid;
  uniform vec3 uGlow;
  uniform vec4 uDrops[8]; // xy = uv, z = birthTime, w = strength

  float waveField(vec2 p, float t) {
    vec2 sp = p + vec2(0.0, uScroll * 1.15);
    float h = sin(sp.x * 3.0 + t * 0.78 + cos(sp.y * 2.1 - t * 0.4)) * 0.24;
    h += cos(sp.y * 3.8 - t * 0.66 + sin(sp.x * 2.5 + t * 0.34)) * 0.19;
    h += sin((sp.x + sp.y) * 5.4 + t * 1.05) * 0.09;

    float velBoost = 1.0 + clamp(abs(uScrollVel) * 0.14, 0.0, 1.4);
    h += sin(sp.x * 11.5 - sp.y * 8.5 + t * 1.85) * 0.02 * velBoost;

    // 8 spreading water-drop concentric rings (both ambient rain drops + cursor/click splashes)
    float aspect = uRes.x / max(uRes.y, 1.0);
    for (int i = 0; i < 8; i++) {
      vec4 d = uDrops[i];
      float age = t - d.z;
      if (age > 0.0 && age < 3.6 && d.w > 0.01) {
        vec2 delta = p - d.xy;
        delta.x *= aspect;
        float dist = length(delta);
        float radius = age * 0.42;
        float diff = dist - radius;
        if (abs(diff) < 0.22) {
          float env = exp(-(diff * diff) * 165.0) * exp(-age * 1.0);
          h += sin(diff * 58.0) * env * d.w * 0.34;
        }
      }
    }
    return h;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime;
    float eps = 0.0055;

    float hC = waveField(uv, t);
    float hX = waveField(uv + vec2(eps, 0.0), t);
    float hY = waveField(uv + vec2(0.0, eps), t);

    vec3 normal = normalize(vec3((hC - hX) * 2.8, (hC - hY) * 2.8, 0.22));
    vec3 lightPos = normalize(vec3((uMouse.x - 0.5) * 1.3, (uMouse.y - 0.5) * 1.3, 0.85));
    vec3 halfVec = normalize(lightPos + vec3(0.0, 0.0, 1.0));

    float diff = max(dot(normal, lightPos), 0.0);
    float spec = pow(max(dot(normal, halfVec), 0.0), 38.0);
    float fresnel = pow(1.0 - max(normal.z, 0.0), 2.9);
    float caustic = pow(clamp(0.5 + 0.5 * sin(hC * 12.5 + t * 0.9), 0.0, 1.0), 4.0);

    // Liquid crystal iridescence (thin-film chromatic dispersion)
    vec3 prism = 0.5 + 0.5 * cos(vec3(0.0, 2.0, 4.0) + (hC * 8.0 + fresnel * 4.0 + t * 0.4));

    // Volumetric god-ray projector beam approximation
    vec2 rayP = (uv - vec2(0.5, 0.1)) * vec2(uRes.x / max(uRes.y, 1.0), 1.0);
    float rayAngle = atan(rayP.x, rayP.y);
    float godRay = pow(clamp(sin(rayAngle * 7.0 + t * 0.25) * 0.5 + 0.5, 0.0, 1.0), 3.0);
    godRay *= clamp(1.0 - length(rayP) * 0.75, 0.0, 1.0);

    vec3 col = mix(uDeep, uMid, smoothstep(-0.35, 0.55, hC) * 0.72 + diff * 0.28);
    col += uGlow * (spec * 0.65 + fresnel * 0.28 + caustic * 0.12);
    col += prism * (fresnel * 0.18 + spec * 0.12);
    col += uGlow * godRay * 0.22;

    vec2 vc = (uv - 0.5) * vec2(1.12, 1.0);
    col *= mix(0.48, 1.0, smoothstep(1.05, 0.2, length(vc)));

    gl_FragColor = vec4(col, 1.0);
  }
`;

const THEME_RGB: Record<CrystalThemeId, { deep: number[]; mid: number[]; glow: number[] }> = {
  abyss: {
    deep: [0.008, 0.012, 0.022],
    mid: [0.035, 0.078, 0.149],
    glow: [0.49, 0.733, 1.0],
  },
  glacier: {
    deep: [0.015, 0.045, 0.105],
    mid: [0.07, 0.185, 0.34],
    glow: [0.76, 0.89, 1.0],
  },
  noir: {
    deep: [0.004, 0.006, 0.012],
    mid: [0.022, 0.042, 0.082],
    glow: [0.38, 0.62, 0.92],
  },
};

export const LiquidCrystalRayCanvas: React.FC<LiquidCrystalRayCanvasProps> = ({
  theme,
  liteMode = false,
  paused = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef<CrystalThemeId>(theme);
  const liteRef = useRef<boolean>(liteMode);
  const pausedRef = useRef<boolean>(paused);

  themeRef.current = theme;
  liteRef.current = liteMode;
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      powerPreference: "high-performance",
    });

    if (!gl) return;

    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vert = createShader(gl.VERTEX_SHADER, VERT);
    const frag = createShader(gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.deleteProgram(prog);
      return;
    }

    gl.useProgram(prog);

    // Fullscreen quad
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

    // Uniforms
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uScroll = gl.getUniformLocation(prog, "uScroll");
    const uScrollVel = gl.getUniformLocation(prog, "uScrollVel");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uDeep = gl.getUniformLocation(prog, "uDeep");
    const uMid = gl.getUniformLocation(prog, "uMid");
    const uGlow = gl.getUniformLocation(prog, "uGlow");
    const uDrops = gl.getUniformLocation(prog, "uDrops");

    // Drops array: 8 items * 4 floats
    const dropData = new Float32Array(32);
    let nextDropIndex = 0;

    const spawnDrop = (x: number, y: number, strength = 1.0) => {
      const idx = (nextDropIndex % 8) * 4;
      dropData[idx] = x;
      dropData[idx + 1] = 1.0 - y; // flip Y for WebGL UV
      dropData[idx + 2] = performance.now() * 0.001;
      dropData[idx + 3] = strength;
      nextDropIndex++;
    };

    let width = 0;
    let height = 0;
    const resize = () => {
      const isMobile = window.innerWidth < 768;
      const scale = liteRef.current ? 0.35 : isMobile ? 0.45 : 0.6;
      width = Math.max(1, Math.floor(window.innerWidth * scale));
      height = Math.max(1, Math.floor(window.innerHeight * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    let mx = 0.5;
    let my = 0.5;
    let targetMx = 0.5;
    let targetMy = 0.5;
    let lastDropTime = 0;

    const onPointerMove = (e: MouseEvent) => {
      targetMx = e.clientX / window.innerWidth;
      targetMy = e.clientY / window.innerHeight;

      // Throttle interactive movement drops
      const now = performance.now();
      if (now - lastDropTime > 260) {
        spawnDrop(targetMx, targetMy, 0.45);
        lastDropTime = now;
      }
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const x = clientX / window.innerWidth;
      const y = clientY / window.innerHeight;
      spawnDrop(x, y, 1.0);
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("mousedown", onPointerDown, { passive: true });
    window.addEventListener("touchstart", onPointerDown, { passive: true });

    let scrollPos = 0;
    let scrollVel = 0;
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const sy = window.scrollY;
      const diff = sy - lastScrollY;
      lastScrollY = sy;
      scrollVel = Math.min(Math.max(diff * 0.04, -2.5), 2.5);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let rafId = 0;
    let lastAmbientDrop = 0;
    const startTime = performance.now();

    const loop = (timestamp: number) => {
      if (!pausedRef.current && !document.hidden) {
        const t = (timestamp - startTime) * 0.001;

        // Smooth mouse coords
        mx += (targetMx - mx) * 0.08;
        my += (targetMy - my) * 0.08;

        // Dampen scroll velocity
        scrollVel *= 0.94;
        scrollPos = (window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));

        // Ambient water drops every ~2.2s
        if (t - lastAmbientDrop > 2.2) {
          spawnDrop(Math.random(), Math.random(), 0.35);
          lastAmbientDrop = t;
        }

        gl.useProgram(prog);
        gl.uniform2f(uRes, width, height);
        gl.uniform1f(uTime, t);
        gl.uniform1f(uScroll, scrollPos);
        gl.uniform1f(uScrollVel, scrollVel);
        gl.uniform2f(uMouse, mx, my);

        const curTheme = THEME_RGB[themeRef.current] || THEME_RGB.abyss;
        gl.uniform3fv(uDeep, curTheme.deep);
        gl.uniform3fv(uMid, curTheme.mid);
        gl.uniform3fv(uGlow, curTheme.glow);
        gl.uniform4fv(uDrops, dropData);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("scroll", onScroll);
      if (buf) gl.deleteBuffer(buf);
      if (prog) gl.deleteProgram(prog);
      if (vert) gl.deleteShader(vert);
      if (frag) gl.deleteShader(frag);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="crystal-webgl-canvas" aria-hidden="true" />
      <div className="crystal-ray-stage" aria-hidden="true">
        <div className="crystal-ray-beam crystal-ray-beam--1" />
        <div className="crystal-ray-beam crystal-ray-beam--2" />
      </div>
      <div className="crystal-webgl-fallback" aria-hidden="true" />
    </>
  );
};
