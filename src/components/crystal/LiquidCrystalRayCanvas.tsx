import React, { useEffect, useRef } from "react";

export type CrystalThemeId = "winter" | "aurora" | "blizzard";

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

// Winter Cinema Shader: Pronounced Water Waves (Dheu) + Cursor Moonlight Spotlight + Volumetric Rays + 3-Layer Falling Snow
const FRAG = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  varying vec2 vUv;

  uniform vec2 uRes;
  uniform float uTime;
  uniform float uScroll;
  uniform float uScrollVel;
  uniform vec2 uMouse;
  uniform float uHoverFlare;
  uniform vec3 uDeep;
  uniform vec3 uMid;
  uniform vec3 uGlow;
  uniform vec3 uRayTint;
  uniform vec4 uDrops[10]; // xy = uv, z = birthTime, w = strength

  float hash21(vec2 p) {
    p = fract(p * vec2(127.34, 453.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Soft bokeh falling winter snow with gentle breeze & cursor wind drift
  float snowLayer(vec2 uv, float t, float scale, float speed, float radius, vec2 cursorOffset) {
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 st = uv;
    st.x *= aspect;
    st.x += sin(t * 0.42 + uv.y * 2.4) * 0.09 - t * 0.055 * speed;
    st.y += t * speed + uScroll * 0.32;
    st += cursorOffset;

    vec2 cell = floor(st * scale);
    vec2 gv = fract(st * scale) - 0.5;
    float n = hash21(cell);

    vec2 jitter = vec2(sin(n * 62.83 + t * 1.15), cos(n * 31.41 + t * 0.85)) * 0.32;
    float d = length(gv - jitter);
    float flake = smoothstep(radius, radius * 0.12, d);
    float twinkle = 0.55 + 0.45 * sin(t * 2.6 + n * 48.0);

    return flake * twinkle * step(0.36, n);
  }

  // Deep rolling winter water swells + crisp interactive cursor/click ripples (dheu)
  float waveField(vec2 p, float t) {
    vec2 sp = p + vec2(0.0, uScroll * 1.25);

    float h = sin(sp.x * 3.4 + t * 0.95 + cos(sp.y * 2.3 - t * 0.52)) * 0.28;
    h += cos(sp.y * 4.2 - t * 0.82 + sin(sp.x * 2.8 + t * 0.44)) * 0.22;
    h += sin((sp.x * 1.15 + sp.y) * 6.2 + t * 1.35) * 0.12;
    h += cos((sp.x * 1.4 - sp.y * 1.1) * 9.5 - t * 1.55) * 0.06;

    float velBoost = 1.0 + clamp(abs(uScrollVel) * 0.18, 0.0, 1.8);
    h += sin(sp.x * 13.0 - sp.y * 9.5 + t * 2.2) * 0.028 * velBoost;

    // 10 strong concentric water-wave rings from cursor movement, clicks & theme hovers
    float aspect = uRes.x / max(uRes.y, 1.0);
    for (int i = 0; i < 10; i++) {
      vec4 d = uDrops[i];
      float age = t - d.z;
      if (age > 0.0 && age < 3.8 && d.w > 0.01) {
        vec2 delta = p - d.xy;
        delta.x *= aspect;
        float dist = length(delta);
        float radius = age * 0.46;
        float diff = dist - radius;
        if (abs(diff) < 0.26) {
          float env = exp(-(diff * diff) * 125.0) * exp(-age * 0.82);
          h += sin(diff * 54.0) * env * d.w * 0.55;
        }
      }
    }
    return h;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime;
    float aspect = uRes.x / max(uRes.y, 1.0);
    float eps = 0.0052;

    float hC = waveField(uv, t);
    float hX = waveField(uv + vec2(eps, 0.0), t);
    float hY = waveField(uv + vec2(0.0, eps), t);

    vec3 normal = normalize(vec3((hC - hX) * 3.4, (hC - hY) * 3.4, 0.22));

    // Distance from cursor in aspect-corrected screen space
    vec2 toCursor = uv - uMouse;
    toCursor.x *= aspect;
    float cursorDist = length(toCursor);

    // Direct interactive cursor moonlight source + overhead winter moon
    vec3 cursorLightDir = normalize(vec3(-toCursor.x * 2.4, -toCursor.y * 2.4, 0.42));
    vec3 halfCursor = normalize(cursorLightDir + vec3(0.0, 0.0, 1.0));
    float cursorDiff = max(dot(normal, cursorLightDir), 0.0);
    float cursorSpec = pow(max(dot(normal, halfCursor), 0.0), 28.0);
    float cursorFalloff = exp(-cursorDist * 2.8);

    // Overhead glacial moon light
    vec3 moonDir = normalize(vec3(0.25, 0.65, 0.8));
    vec3 halfMoon = normalize(moonDir + vec3(0.0, 0.0, 1.0));
    float moonDiff = max(dot(normal, moonDir), 0.0);
    float moonSpec = pow(max(dot(normal, halfMoon), 0.0), 38.0);
    float fresnel = pow(1.0 - max(normal.z, 0.0), 2.5);

    // Shimmering icy caustic ridges on wave crests
    float caustic = pow(clamp(0.5 + 0.5 * sin(hC * 14.0 + t * 1.15), 0.0, 1.0), 4.0);

    // Volumetric Winter God-Rays & Aurora Curtain sweeping down from top
    float rayCoord = uv.x * 1.45 + (1.0 - uv.y) * 0.52 - (uMouse.x - 0.5) * 0.28;
    float ray1 = pow(max(0.0, sin(rayCoord * 7.2 + t * 0.34)), 5.0);
    float ray2 = pow(max(0.0, sin(rayCoord * 12.8 - t * 0.26 + 1.2)), 7.0);
    float rayFade = smoothstep(0.04, 0.96, uv.y);
    float rays = (ray1 * 0.68 + ray2 * 0.48) * rayFade * (0.28 + uHoverFlare * 0.32);

    // Winter cold ground mist rising softly at bottom
    float mist = smoothstep(0.52, 0.0, uv.y) * (0.14 + 0.06 * sin(uv.x * 4.0 + t * 0.45));

    // Compose liquid winter water base
    vec3 col = mix(uDeep, uMid, smoothstep(-0.38, 0.54, hC) * 0.7 + moonDiff * 0.3);

    // Add moon specular + icy wave caustics + fresnel sheen
    col += uGlow * (moonSpec * 0.68 + caustic * 0.16 + fresnel * 0.30);

    // Add unmistakable live cursor flashlight + sparkling wave illumination
    float spotlightBloom = exp(-cursorDist * 3.8) * (0.34 + uHoverFlare * 0.28);
    col += mix(uGlow, vec3(0.92, 0.98, 1.0), 0.45) * (
      spotlightBloom +
      cursorSpec * cursorFalloff * 1.35 +
      cursorDiff * cursorFalloff * 0.28
    );

    // Add volumetric winter light rays & frosty mist
    col += uRayTint * rays;
    col += mix(uMid, uGlow, 0.35) * mist;

    // 3 parallax layers of falling winter snow (deflects subtly around cursor)
    vec2 snowWind = -toCursor * exp(-cursorDist * 4.5) * 0.08;
    float sFar  = snowLayer(uv, t, 14.0, 0.06, 0.14, snowWind * 0.3) * 0.38;
    float sMid  = snowLayer(uv + 0.37, t, 9.0, 0.10, 0.16, snowWind * 0.7) * 0.62;
    float sNear = snowLayer(uv + 0.71, t, 5.5, 0.15, 0.18, snowWind * 1.2) * 0.85;
    float totalSnow = clamp(sFar + sMid + sNear, 0.0, 1.2);
    // Snowflakes glow brighter when passing inside cursor light!
    col += vec3(0.90, 0.96, 1.0) * totalSnow * (0.62 + cursorFalloff * 0.75);

    // Subtle atmospheric cinema vignette
    vec2 vc = (uv - 0.5) * vec2(1.1, 1.0);
    col *= mix(0.54, 1.0, smoothstep(1.12, 0.22, length(vc)));

    gl_FragColor = vec4(col, 1.0);
  }
`;

const WINTER_PALETTES: Record<
  CrystalThemeId,
  { deep: number[]; mid: number[]; glow: number[]; ray: number[] }
> = {
  winter: {
    deep: [0.012, 0.028, 0.062],
    mid: [0.055, 0.145, 0.275],
    glow: [0.68, 0.88, 1.0],
    ray: [0.80, 0.94, 1.0],
  },
  aurora: {
    deep: [0.010, 0.032, 0.052],
    mid: [0.038, 0.175, 0.235],
    glow: [0.54, 0.95, 0.88],
    ray: [0.66, 0.98, 0.92],
  },
  blizzard: {
    deep: [0.008, 0.012, 0.026],
    mid: [0.035, 0.068, 0.135],
    glow: [0.58, 0.76, 0.98],
    ray: [0.74, 0.84, 1.0],
  },
};

export const LiquidCrystalRayCanvas: React.FC<LiquidCrystalRayCanvasProps> = ({
  theme,
  liteMode = false,
  paused = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef<CrystalThemeId>(theme);
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
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
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
    const uHoverFlare = gl.getUniformLocation(prog, "uHoverFlare");
    const uDeep = gl.getUniformLocation(prog, "uDeep");
    const uMid = gl.getUniformLocation(prog, "uMid");
    const uGlow = gl.getUniformLocation(prog, "uGlow");
    const uRayTint = gl.getUniformLocation(prog, "uRayTint");
    const uDrops = gl.getUniformLocation(prog, "uDrops");

    const dropBuffer = new Float32Array(10 * 4);
    let dropIdx = 0;
    let lastMoveDrop = 0;
    let lastAmbientDrop = 0;
    const startMs = performance.now();

    let mouseX = 0.5;
    let mouseY = 0.55;
    let smoothMX = 0.5;
    let smoothMY = 0.55;
    let hoverFlare = 0;
    let lastScrollY = window.scrollY;
    let scrollVel = 0;
    let maxScrollCache = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    const initPal = WINTER_PALETTES[themeRef.current] ?? WINTER_PALETTES.winter;
    const curDeep = [...initPal.deep];
    const curMid = [...initPal.mid];
    const curGlow = [...initPal.glow];
    const curRay = [...initPal.ray];

    const spawnDrop = (nx: number, ny: number, strength: number) => {
      if (pausedRef.current || document.hidden) return;
      const tSec = (performance.now() - startMs) * 0.001;
      const base = dropIdx * 4;
      dropBuffer[base] = nx;
      dropBuffer[base + 1] = ny;
      dropBuffer[base + 2] = tSec;
      dropBuffer[base + 3] = strength;
      dropIdx = (dropIdx + 1) % 10;
    };

    const resize = () => {
      const scale = window.innerWidth < 768 ? 0.45 : 0.62;
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
      // Crisp trailing wave ripples behind cursor
      if (now - lastMoveDrop > 90) {
        spawnDrop(mouseX, mouseY, 1.05);
        lastMoveDrop = now;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = 1.0 - e.clientY / window.innerHeight;
      spawnDrop(nx, ny, 1.9);
      hoverFlare = Math.min(1.0, hoverFlare + 0.55);
    };

    // React dramatically when hovering the Theme Switcher button!
    const onThemeHover = (e: Event) => {
      const detail = (e as CustomEvent<{ x?: number; y?: number }>).detail;
      const nx = detail?.x ?? mouseX;
      const ny = detail?.y ?? mouseY;
      hoverFlare = 1.0;
      spawnDrop(nx, ny, 1.85);
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("crystal-theme-hover", onThemeHover);
    canvas.addEventListener("webglcontextlost", onContextLost);

    let rafId = 0;
    let lastFrame = 0;
    const minFrameMs = window.innerWidth < 768 ? 28 : 16;

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (pausedRef.current || document.hidden) return;
      if (now - lastFrame < minFrameMs) return;
      lastFrame = now;

      // Ambient winter droplets landing on the water every ~1.4s
      if (now - lastAmbientDrop > 1400) {
        spawnDrop(0.12 + Math.random() * 0.76, 0.16 + Math.random() * 0.68, 1.0);
        lastAmbientDrop = now;
      }

      const t = (now - startMs) * 0.001;
      smoothMX += (mouseX - smoothMX) * 0.12;
      smoothMY += (mouseY - smoothMY) * 0.12;
      hoverFlare *= 0.94;

      const curScrollY = window.scrollY;
      scrollVel += ((curScrollY - lastScrollY) * 0.14 - scrollVel) * 0.14;
      lastScrollY = curScrollY;

      const target = WINTER_PALETTES[themeRef.current] ?? WINTER_PALETTES.winter;
      for (let i = 0; i < 3; i++) {
        curDeep[i] += (target.deep[i] - curDeep[i]) * 0.06;
        curMid[i] += (target.mid[i] - curMid[i]) * 0.06;
        curGlow[i] += (target.glow[i] - curGlow[i]) * 0.06;
        curRay[i] += (target.ray[i] - curRay[i]) * 0.06;
      }

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uScroll, curScrollY / maxScrollCache);
      gl.uniform1f(uScrollVel, scrollVel);
      gl.uniform2f(uMouse, smoothMX, smoothMY);
      gl.uniform1f(uHoverFlare, hoverFlare);
      gl.uniform3f(uDeep, curDeep[0], curDeep[1], curDeep[2]);
      gl.uniform3f(uMid, curMid[0], curMid[1], curMid[2]);
      gl.uniform3f(uGlow, curGlow[0], curGlow[1], curGlow[2]);
      gl.uniform3f(uRayTint, curRay[0], curRay[1], curRay[2]);
      gl.uniform4fv(uDrops, dropBuffer);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("crystal-theme-hover", onThemeHover);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [liteMode]);

  if (liteMode) {
    return <div className="crystal-webgl-fallback" aria-hidden="true" />;
  }

  return (
    <>
      <canvas ref={canvasRef} className="crystal-webgl-canvas" aria-hidden="true" />
      <div className="crystal-ray-stage" aria-hidden="true">
        <div className="crystal-ray-beam crystal-ray-beam--1" />
        <div className="crystal-ray-beam crystal-ray-beam--2" />
        <div className="winter-frost-mist" />
      </div>
    </>
  );
};
