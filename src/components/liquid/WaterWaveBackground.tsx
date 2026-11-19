import React, { useEffect, useRef } from "react";

export type LiquidThemeId = "abyss" | "glacial" | "noir";

interface WaterWaveBackgroundProps {
  theme: LiquidThemeId;
  liteMode?: boolean;
}

const VERT_SRC = `
  attribute vec2 aPos;
  varying vec2 vUv;
  void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;

// Real-time animated liquid water surface + caustics + 12 interactive spreading ripple rings
const FRAG_SRC = `
  precision highp float;
  varying vec2 vUv;

  uniform vec2 uRes;
  uniform float uTime;
  uniform float uScroll;
  uniform float uScrollVel;
  uniform vec2 uMouse;
  uniform vec3 uDeepColor;
  uniform vec3 uMidColor;
  uniform vec3 uGlowColor;
  uniform vec4 uRipples[12]; // xy = uv, z = birthTime, w = strength

  // Smooth multi-directional ocean wave height field ("dheu")
  float waterHeight(vec2 p, float t) {
    float h = 0.0;
    vec2 sp = p + vec2(0.0, uScroll * 1.15);

    // Primary slow rolling swells
    h += sin(sp.x * 3.2 + t * 0.85 + cos(sp.y * 2.1 - t * 0.45)) * 0.24;
    h += cos(sp.y * 4.1 - t * 0.72 + sin(sp.x * 2.6 + t * 0.35)) * 0.20;
    h += sin((sp.x + sp.y) * 5.6 + t * 1.15) * 0.11;
    h += cos((sp.x * 1.3 - sp.y) * 8.4 - t * 1.35) * 0.06;

    // Fine liquid micro-ripples intensified by scroll speed
    float boost = 1.0 + clamp(abs(uScrollVel) * 0.14, 0.0, 1.8);
    h += sin(sp.x * 13.0 - sp.y * 9.0 + t * 2.1) * 0.026 * boost;

    // Interactive cursor / touch / click expanding water rings
    float aspect = uRes.x / max(uRes.y, 1.0);
    for (int i = 0; i < 12; i++) {
      vec4 r = uRipples[i];
      float age = t - r.z;
      if (age > 0.0 && age < 4.2 && r.w > 0.001) {
        vec2 d = p - r.xy;
        d.x *= aspect;
        float dist = length(d);
        float radius = age * 0.42;
        float envelope = exp(-pow((dist - radius) * 14.0, 2.0)) * exp(-age * 0.95);
        float ring = sin((dist - radius) * 58.0) * envelope * r.w;
        h += ring * 0.32;
      }
    }
    return h;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime;
    float eps = 0.0045;

    float hC = waterHeight(uv, t);
    float hX = waterHeight(uv + vec2(eps, 0.0), t);
    float hY = waterHeight(uv + vec2(0.0, eps), t);

    // Surface normal from wave slope
    vec3 normal = normalize(vec3((hC - hX) * 2.8, (hC - hY) * 2.8, 0.22));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);

    // Dynamic moon/studio light tracking cursor subtly
    vec3 lightPos = normalize(vec3((uMouse.x - 0.5) * 1.25, (uMouse.y - 0.5) * 1.25, 0.85));
    vec3 halfVec = normalize(lightPos + viewDir);

    float diff = max(dot(normal, lightPos), 0.0);
    float spec = pow(max(dot(normal, halfVec), 0.0), 42.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

    // Shimmering underwater caustic veins
    float caustic = pow(clamp(0.5 + 0.5 * sin(hC * 14.0 + t * 0.9), 0.0, 1.0), 4.0);

    vec3 col = mix(uDeepColor, uMidColor, smoothstep(-0.35, 0.55, hC) * 0.72 + diff * 0.28);
    col += uGlowColor * (spec * 0.72 + fresnel * 0.28 + caustic * 0.13);

    // Cinema depth vignette
    float vig = smoothstep(1.08, 0.2, length((uv - 0.5) * vec2(1.15, 1.0)));
    col *= mix(0.45, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const THEME_RGB: Record<LiquidThemeId, { deep: number[]; mid: number[]; glow: number[] }> = {
  abyss: {
    deep: [0.008, 0.012, 0.022],
    mid: [0.035, 0.078, 0.149],
    glow: [0.49, 0.733, 1.0],
  },
  glacial: {
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

export const WaterWaveBackground: React.FC<WaterWaveBackgroundProps> = ({
  theme,
  liteMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef<LiquidThemeId>(theme);
  themeRef.current = theme;

  useEffect(() => {
    if (liteMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "high-performance" });
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

    const rippleData = new Float32Array(12 * 4);
    let rippleIdx = 0;
    let lastSpawn = 0;
    let startTime = performance.now();
    let mouseX = 0.5;
    let mouseY = 0.5;
    let smoothMX = 0.5;
    let smoothMY = 0.5;
    let lastScrollY = window.scrollY;
    let scrollVel = 0;

    // Smoothly interpolated RGB colors for theme transitions
    const curDeep = [...THEME_RGB[themeRef.current].deep];
    const curMid = [...THEME_RGB[themeRef.current].mid];
    const curGlow = [...THEME_RGB[themeRef.current].glow];

    const spawnRipple = (nx: number, ny: number, strength: number) => {
      const nowSec = (performance.now() - startTime) * 0.001;
      const base = rippleIdx * 4;
      rippleData[base] = nx;
      rippleData[base + 1] = ny;
      rippleData[base + 2] = nowSec;
      rippleData[base + 3] = strength;
      rippleIdx = (rippleIdx + 1) % 12;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.75);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1.0 - e.clientY / window.innerHeight;
      const now = performance.now();
      if (now - lastSpawn > 95) {
        spawnRipple(mouseX, mouseY, 0.72);
        lastSpawn = now;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = 1.0 - e.clientY / window.innerHeight;
      spawnRipple(nx, ny, 1.55);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    let rafId = 0;
    const render = () => {
      rafId = requestAnimationFrame(render);
      const t = (performance.now() - startTime) * 0.001;

      smoothMX += (mouseX - smoothMX) * 0.08;
      smoothMY += (mouseY - smoothMY) * 0.08;

      const curScrollY = window.scrollY;
      const rawVel = (curScrollY - lastScrollY) * 0.15;
      lastScrollY = curScrollY;
      scrollVel += (rawVel - scrollVel) * 0.12;

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const normScroll = curScrollY / maxScroll;

      // Smoothly lerp theme colors inside WebGL water shader
      const target = THEME_RGB[themeRef.current];
      for (let i = 0; i < 3; i++) {
        curDeep[i] += (target.deep[i] - curDeep[i]) * 0.05;
        curMid[i] += (target.mid[i] - curMid[i]) * 0.05;
        curGlow[i] += (target.glow[i] - curGlow[i]) * 0.05;
      }

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uScroll, normScroll);
      gl.uniform1f(uScrollVel, scrollVel);
      gl.uniform2f(uMouse, smoothMX, smoothMY);
      gl.uniform3f(uDeep, curDeep[0], curDeep[1], curDeep[2]);
      gl.uniform3f(uMid, curMid[0], curMid[1], curMid[2]);
      gl.uniform3f(uGlow, curGlow[0], curGlow[1], curGlow[2]);
      gl.uniform4fv(uRipples, rippleData);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    render();

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
