import React, { useEffect, useRef } from "react";

export type ScenicMoodId = "frost" | "ember" | "moonlight";

interface ScenicValleyCanvasProps {
  mood: ScenicMoodId;
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

// Procedural Scroll-Exploration Scenic World Shader (Zero external textures, pure 60 FPS optical math)
const FRAG = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  varying vec2 vUv;

  uniform vec2 uRes;
  uniform float uTime;
  uniform float uScroll;       // 0.0 (Peaks) -> 0.4 (Valley) -> 0.72 (Mirror Lake) -> 1.0 (Starlit Horizon)
  uniform float uScrollVel;
  uniform vec2 uMouse;
  uniform float uHoverFlare;
  uniform vec3 uSkyTop;
  uniform vec3 uSkyHorizon;
  uniform vec3 uAccentLight;
  uniform vec3 uWaterDeep;
  uniform vec3 uLanternGlow;
  uniform vec4 uDrops[10];     // xy = uv, z = birthTime, w = strength

  float hash11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
  }

  float hash21(vec2 p) {
    p = fract(p * vec2(127.34, 453.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise1D(float x) {
    float i = floor(x);
    float f = fract(x);
    float u = f * f * (3.0 - 2.0 * f);
    return mix(hash11(i), hash11(i + 1.0), u);
  }

  // Sharp ridged alpine-style mountain profile
  float ridgeProfile(float x, float freq, float amp, float seed) {
    float n = 0.0;
    float a = amp;
    float f = freq;
    for (int i = 0; i < 4; i++) {
      float v = 1.0 - abs(noise1D(x * f + seed) * 2.0 - 1.0);
      n += v * v * a;
      f *= 2.08;
      a *= 0.48;
      seed += 19.7;
    }
    return n;
  }

  // Soft bokeh falling snow layer
  float snowLayer(vec2 uv, float t, float scale, float speed, float radius, vec2 drift) {
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 st = uv;
    st.x *= aspect;
    st.x += sin(t * 0.45 + uv.y * 2.6) * 0.08 - t * 0.045 * speed;
    st.y += t * speed + uScroll * 0.35;
    st += drift;

    vec2 cell = floor(st * scale);
    vec2 gv = fract(st * scale) - 0.5;
    float n = hash21(cell);
    vec2 jitter = vec2(sin(n * 62.8 + t * 1.1), cos(n * 31.4 + t * 0.9)) * 0.32;
    float d = length(gv - jitter);
    float flake = smoothstep(radius, radius * 0.12, d);
    float twinkle = 0.55 + 0.45 * sin(t * 2.5 + n * 44.0);
    return flake * twinkle * step(0.42, n);
  }

  // Interactive water surface waves (dheu) + concentric cursor/click ripples
  float waterWaves(vec2 p, float t) {
    float h = sin(p.x * 16.0 + t * 1.35 + cos(p.y * 12.0 - t * 0.9)) * 0.24;
    h += cos(p.y * 24.0 - t * 1.65 + sin(p.x * 9.0 + t * 0.7)) * 0.18;
    h += sin((p.x * 2.2 + p.y * 3.0) * 14.0 + t * 2.1) * 0.08;

    float velBoost = 1.0 + clamp(abs(uScrollVel) * 0.18, 0.0, 1.6);
    h += sin(p.x * 34.0 - p.y * 28.0 + t * 2.8) * 0.04 * velBoost;

    float aspect = uRes.x / max(uRes.y, 1.0);
    for (int i = 0; i < 10; i++) {
      vec4 d = uDrops[i];
      float age = t - d.z;
      if (age > 0.0 && age < 3.8 && d.w > 0.01) {
        vec2 delta = p - d.xy;
        delta.x *= aspect;
        float dist = length(delta);
        float radius = age * 0.44;
        float diff = dist - radius;
        if (abs(diff) < 0.24) {
          float env = exp(-(diff * diff) * 135.0) * exp(-age * 0.85);
          h += sin(diff * 56.0) * env * d.w * 0.65;
        }
      }
    }
    return h;
  }

  // Renders sky + sun/moon + stars + 3 snow-capped mountain ranges for both direct view & lake reflection
  vec3 renderSkyAndMountains(vec2 uv, float t, float scroll, float waterLine, vec2 mousePos, float flare) {
    float aspect = uRes.x / max(uRes.y, 1.0);

    // Scroll shifts the atmospheric time-of-day subtly from crisp dawn -> misty autumn -> golden dusk -> starlit night
    float duskFactor = smoothstep(0.22, 0.68, scroll) * (1.0 - smoothstep(0.72, 1.0, scroll));
    float nightFactor = smoothstep(0.62, 0.98, scroll);

    vec3 topCol = mix(uSkyTop, uSkyTop * 0.48 + vec3(0.01, 0.02, 0.06), nightFactor);
    vec3 horCol = mix(uSkyHorizon, mix(uSkyHorizon, uLanternGlow * 0.72, 0.48), duskFactor);
    horCol = mix(horCol, uSkyTop * 1.15 + uAccentLight * 0.14, nightFactor);

    float skyGrad = clamp((uv.y - waterLine) / max(1.0 - waterLine, 0.25), 0.0, 1.0);
    vec3 col = mix(horCol, topCol, pow(skyGrad, 0.68));

    // Crisp alpine stars fading in during twilight/horizon exploration
    vec2 starGrid = floor(vec2(uv.x * aspect, uv.y) * 95.0);
    float starRand = hash21(starGrid);
    if (starRand > 0.988 && skyGrad > 0.22) {
      float twinkle = 0.5 + 0.5 * sin(t * 2.8 + starRand * 120.0);
      col += vec3(0.88, 0.94, 1.0) * twinkle * (0.28 + nightFactor * 0.85) * smoothstep(0.22, 0.65, skyGrad);
    }

    // Celestial Orb (Pale winter sun / rising moon shifting gently with scroll & cursor)
    vec2 orbPos = vec2(0.72 - scroll * 0.22 + (mousePos.x - 0.5) * 0.06, mix(0.76, 0.82, scroll));
    vec2 orbDelta = uv - orbPos;
    orbDelta.x *= aspect;
    float orbDist = length(orbDelta);
    float orbCore = smoothstep(0.055, 0.022, orbDist);
    float orbHalo = exp(-orbDist * 5.2) * (0.48 + flare * 0.35);
    col += mix(uAccentLight, vec3(1.0, 0.96, 0.9), 0.6) * (orbCore * 1.15 + orbHalo);

    // Volumetric Diagonal Mountain God-Rays
    float rayX = uv.x * 1.45 + (1.0 - uv.y) * 0.48 - (mousePos.x - 0.5) * 0.24;
    float r1 = pow(max(0.0, sin(rayX * 6.8 + t * 0.26)), 5.0);
    float r2 = pow(max(0.0, sin(rayX * 11.4 - t * 0.2 + 1.5)), 7.0);
    float rayMask = smoothstep(waterLine, 0.96, uv.y);
    col += mix(uAccentLight, uLanternGlow, duskFactor * 0.5) * (r1 * 0.65 + r2 * 0.42) * rayMask * (0.20 + flare * 0.32);

    // Camera horizontal glide & vertical elevation shift as user explores via scroll
    float camPan = scroll * 1.15 + (mousePos.x - 0.5) * 0.14;

    // FAR RANGE: Towering Jagged Snow-Capped Peaks
    float farBase = waterLine + mix(0.20, 0.11, scroll);
    float farH = farBase + ridgeProfile(uv.x * 1.35 + camPan * 0.35, 2.2, 0.26, 3.1);
    if (uv.y < farH) {
      float peakDepth = clamp((farH - uv.y) / 0.24, 0.0, 1.0);
      float snowCap = smoothstep(0.38, 0.04, peakDepth) * (0.65 + 0.35 * sin(uv.x * 28.0 + camPan * 8.0));
      vec3 rockCol = mix(horCol * 0.52, uSkyTop * 0.72, 0.55);
      vec3 snowCol = mix(uAccentLight, vec3(0.95, 0.98, 1.0), 0.72);
      vec3 mCol = mix(rockCol, snowCol, snowCap * 0.82);
      // Soft icy mist near mountain base
      mCol = mix(mCol, horCol * 0.85, smoothstep(0.35, 1.0, peakDepth) * 0.52);
      col = mCol;
    }

    // MID RANGE: Misty Alpine Ridge with Frost Rim
    float midBase = waterLine + mix(0.11, 0.05, scroll);
    float midH = midBase + ridgeProfile(uv.x * 1.75 + camPan * 0.72, 2.8, 0.19, 11.4);
    if (uv.y < midH) {
      float depth = clamp((midH - uv.y) / 0.19, 0.0, 1.0);
      float frostEdge = smoothstep(0.12, 0.0, depth);
      vec3 midRock = mix(uWaterDeep * 1.45, uSkyTop * 0.58, 0.45);
      midRock = mix(midRock, mix(uAccentLight, vec3(0.92, 0.97, 1.0), 0.5), frostEdge * 0.65);
      // Valley fog band clinging to the mid slope
      float valleyFog = smoothstep(0.25, 0.95, depth) * (0.48 + 0.14 * sin(uv.x * 5.0 + t * 0.35));
      col = mix(midRock, mix(horCol, uAccentLight, 0.25) * 0.72, valleyFog);
    }

    // NEAR SHORELINE: Dark Pine-Clad Foothills & Warm Distant Village/Houseboat Lanterns
    float nearBase = waterLine + 0.015;
    float nearH = nearBase + ridgeProfile(uv.x * 2.2 + camPan * 1.15, 3.4, 0.085, 27.8);
    // Subtle pine-needle jagged treeline top
    float pineTeeth = (sin(uv.x * 190.0 + camPan * 110.0) * 0.5 + 0.5) * 0.008;
    if (uv.y < nearH + pineTeeth) {
      vec3 pineCol = uWaterDeep * 0.48;
      col = mix(pineCol, horCol * 0.28, 0.22);
    }

    // Distant warm glowing amber lanterns nestled along the shoreline (visible as lake opens)
    float lanternVis = smoothstep(0.28, 0.62, scroll);
    if (lanternVis > 0.01) {
      for (int i = 0; i < 4; i++) {
        float fi = float(i);
        float lx = fract(0.16 + fi * 0.23 - camPan * 0.18);
        float ly = waterLine + 0.022 + mod(fi, 2.0) * 0.01;
        vec2 ld = uv - vec2(lx, ly);
        ld.x *= aspect;
        float glow = exp(-length(ld) * 34.0) * (0.75 + 0.25 * sin(t * 3.0 + fi * 2.7));
        col += uLanternGlow * glow * lanternVis * 1.15;
      }
    }

    return col;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime;
    float aspect = uRes.x / max(uRes.y, 1.0);

    // Mirror alpine lake waterline rises smoothly as the user scrolls into the valley
    float waterLine = mix(0.18, 0.45, smoothstep(0.15, 0.76, uScroll));
    waterLine = mix(waterLine, 0.39, smoothstep(0.76, 1.0, uScroll));

    vec3 col;

    if (uv.y >= waterLine) {
      // SKY, SNOW PEAKS & MISTY VALLEY
      col = renderSkyAndMountains(uv, t, uScroll, waterLine, uMouse, uHoverFlare);

      // Subtle atmospheric wave ripple shimmer across mist when cursor moves over sky
      float mistWave = waterWaves(uv, t) * 0.08;
      col += uAccentLight * max(0.0, mistWave) * 0.25;
    } else {
      // GLACIAL MIRROR LAKE WITH REAL-TIME WATER WAVES (DHEU) & REFLECTIONS
      float eps = 0.0045;
      float wC = waterWaves(uv, t);
      float wX = waterWaves(uv + vec2(eps, 0.0), t);
      float wY = waterWaves(uv + vec2(0.0, eps), t);

      vec3 normal = normalize(vec3((wC - wX) * 3.8, (wC - wY) * 3.8, 0.24));

      // Mirror-reflect the mountain & lantern scene vertically with wave refraction
      float depthBelow = waterLine - uv.y;
      vec2 reflUv = vec2(
        uv.x + normal.x * (0.045 + depthBelow * 0.12),
        waterLine + depthBelow * 1.08 + normal.y * 0.028
      );
      vec3 reflCol = renderSkyAndMountains(reflUv, t, uScroll, waterLine, uMouse, uHoverFlare);

      // Deep glacial water tint + Fresnel reflection balance
      float fresnel = pow(1.0 - clamp(depthBelow / max(waterLine, 0.1), 0.0, 1.0), 1.6);
      col = mix(uWaterDeep, reflCol, 0.56 + fresnel * 0.36);

      // Shimmering moon & lantern streak reflections dancing on water wave crests
      vec3 viewLight = normalize(vec3((uMouse.x - 0.5) * 1.4, 0.55, 0.78));
      vec3 halfV = normalize(viewLight + vec3(0.0, 0.0, 1.0));
      float spec = pow(max(dot(normal, halfV), 0.0), 34.0);
      float caustic = pow(clamp(0.5 + 0.5 * sin(wC * 13.0 + t * 1.2), 0.0, 1.0), 4.0);
      col += uAccentLight * (spec * 0.85 + caustic * 0.15);

      // Warm golden lantern reflection ribbons shimmering down the water
      float lanternVis = smoothstep(0.24, 0.6, uScroll);
      if (lanternVis > 0.01) {
        float camPan = uScroll * 1.15 + (uMouse.x - 0.5) * 0.14;
        for (int i = 0; i < 4; i++) {
          float fi = float(i);
          float lx = fract(0.16 + fi * 0.23 - camPan * 0.18);
          float dx = abs(uv.x - lx + normal.x * 0.035);
          float ribbon = exp(-dx * 48.0) * exp(-depthBelow * 4.5);
          float sparkle = 0.6 + 0.4 * sin(uv.y * 120.0 - t * 4.5 + fi * 3.0);
          col += uLanternGlow * ribbon * sparkle * lanternVis * 0.95;
        }
      }

      // Soft misty horizon blend right along the water's edge
      float edgeMist = smoothstep(0.045, 0.0, depthBelow);
      col = mix(col, mix(uSkyHorizon, uAccentLight, 0.3) * 0.65, edgeMist * 0.55);
    }

    // LIVE INTERACTIVE CURSOR MOONLIGHT SPOTLIGHT (illuminates snow, mist, peaks & water!)
    vec2 toCursor = uv - uMouse;
    toCursor.x *= aspect;
    float cDist = length(toCursor);
    float cursorBloom = exp(-cDist * 3.6) * (0.28 + uHoverFlare * 0.34);
    col += mix(uAccentLight, vec3(0.95, 0.98, 1.0), 0.4) * cursorBloom;

    // 3 PARALLAX LAYERS OF FALLING SNOW (twinkling brighter under cursor light)
    vec2 snowWind = -toCursor * exp(-cDist * 4.2) * 0.08;
    float s1 = snowLayer(uv, t, 14.0, 0.055, 0.13, snowWind * 0.3) * 0.35;
    float s2 = snowLayer(uv + 0.37, t, 9.0, 0.095, 0.15, snowWind * 0.7) * 0.58;
    float s3 = snowLayer(uv + 0.71, t, 5.5, 0.14, 0.17, snowWind * 1.1) * 0.80;
    float snow = clamp(s1 + s2 + s3, 0.0, 1.15);
    col += vec3(0.92, 0.97, 1.0) * snow * (0.58 + exp(-cDist * 3.0) * 0.75);

    // Cinema depth vignette (preserves legibility for glass cards)
    vec2 vc = (uv - 0.5) * vec2(1.08, 1.0);
    col *= mix(0.56, 1.0, smoothstep(1.12, 0.22, length(vc)));

    gl_FragColor = vec4(col, 1.0);
  }
`;

const MOOD_PALETTES: Record<
  ScenicMoodId,
  {
    skyTop: number[];
    skyHorizon: number[];
    accent: number[];
    waterDeep: number[];
    lantern: number[];
  }
> = {
  frost: {
    skyTop: [0.025, 0.062, 0.135],
    skyHorizon: [0.16, 0.29, 0.44],
    accent: [0.68, 0.88, 1.0],
    waterDeep: [0.015, 0.042, 0.092],
    lantern: [1.0, 0.74, 0.42],
  },
  ember: {
    skyTop: [0.06, 0.045, 0.095],
    skyHorizon: [0.36, 0.21, 0.22],
    accent: [0.98, 0.76, 0.56],
    waterDeep: [0.032, 0.028, 0.065],
    lantern: [1.0, 0.62, 0.26],
  },
  moonlight: {
    skyTop: [0.01, 0.02, 0.052],
    skyHorizon: [0.07, 0.14, 0.25],
    accent: [0.58, 0.80, 1.0],
    waterDeep: [0.008, 0.022, 0.052],
    lantern: [0.98, 0.80, 0.48],
  },
};

export const ScenicValleyCanvas: React.FC<ScenicValleyCanvasProps> = ({
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
    const uSkyTop = gl.getUniformLocation(prog, "uSkyTop");
    const uSkyHorizon = gl.getUniformLocation(prog, "uSkyHorizon");
    const uAccentLight = gl.getUniformLocation(prog, "uAccentLight");
    const uWaterDeep = gl.getUniformLocation(prog, "uWaterDeep");
    const uLanternGlow = gl.getUniformLocation(prog, "uLanternGlow");
    const uDrops = gl.getUniformLocation(prog, "uDrops");

    const dropBuf = new Float32Array(10 * 4);
    let dropIdx = 0;
    let lastMoveDrop = 0;
    let lastAmbientDrop = 0;
    const startMs = performance.now();

    let mouseX = 0.5;
    let mouseY = 0.55;
    let smoothMX = 0.5;
    let smoothMY = 0.55;
    let smoothScroll = 0;
    let hoverFlare = 0;
    let lastScrollY = window.scrollY;
    let scrollVel = 0;
    let maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    const init = MOOD_PALETTES[moodRef.current] ?? MOOD_PALETTES.frost;
    const cSkyTop = [...init.skyTop];
    const cSkyHor = [...init.skyHorizon];
    const cAccent = [...init.accent];
    const cWater = [...init.waterDeep];
    const cLantern = [...init.lantern];

    const spawnDrop = (nx: number, ny: number, strength: number) => {
      if (pausedRef.current || document.hidden) return;
      const tSec = (performance.now() - startMs) * 0.001;
      const base = dropIdx * 4;
      dropBuf[base] = nx;
      dropBuf[base + 1] = ny;
      dropBuf[base + 2] = tSec;
      dropBuf[base + 3] = strength;
      dropIdx = (dropIdx + 1) % 10;
    };

    const resize = () => {
      const scale = window.innerWidth < 768 ? 0.44 : 0.60;
      canvas.width = Math.max(320, Math.floor(window.innerWidth * scale));
      canvas.height = Math.max(240, Math.floor(window.innerHeight * scale));
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1.0 - e.clientY / window.innerHeight;
      const now = performance.now();
      if (now - lastMoveDrop > 95) {
        spawnDrop(mouseX, mouseY, 1.1);
        lastMoveDrop = now;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = 1.0 - e.clientY / window.innerHeight;
      spawnDrop(nx, ny, 1.95);
      hoverFlare = Math.min(1.0, hoverFlare + 0.6);
    };

    const onThemeHover = (e: Event) => {
      const detail = (e as CustomEvent<{ x?: number; y?: number }>).detail;
      hoverFlare = 1.0;
      spawnDrop(detail?.x ?? mouseX, detail?.y ?? mouseY, 1.85);
    };

    const onContextLost = (e: Event) => e.preventDefault();

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("scenic-theme-hover", onThemeHover);
    canvas.addEventListener("webglcontextlost", onContextLost);

    let rafId = 0;
    let lastFrame = 0;
    const minFrameMs = window.innerWidth < 768 ? 28 : 16;

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (pausedRef.current || document.hidden) return;
      if (now - lastFrame < minFrameMs) return;
      lastFrame = now;

      // Refresh maxScroll safely on lazy content expansion
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

      if (now - lastAmbientDrop > 1450) {
        spawnDrop(0.15 + Math.random() * 0.7, 0.08 + Math.random() * 0.34, 1.05);
        lastAmbientDrop = now;
      }

      const t = (now - startMs) * 0.001;
      smoothMX += (mouseX - smoothMX) * 0.11;
      smoothMY += (mouseY - smoothMY) * 0.11;
      hoverFlare *= 0.94;

      const curY = window.scrollY;
      const targetScroll = Math.min(1, Math.max(0, curY / maxScroll));
      smoothScroll += (targetScroll - smoothScroll) * 0.1;
      scrollVel += ((curY - lastScrollY) * 0.14 - scrollVel) * 0.14;
      lastScrollY = curY;

      const pal = MOOD_PALETTES[moodRef.current] ?? MOOD_PALETTES.frost;
      for (let i = 0; i < 3; i++) {
        cSkyTop[i] += (pal.skyTop[i] - cSkyTop[i]) * 0.05;
        cSkyHor[i] += (pal.skyHorizon[i] - cSkyHor[i]) * 0.05;
        cAccent[i] += (pal.accent[i] - cAccent[i]) * 0.05;
        cWater[i] += (pal.waterDeep[i] - cWater[i]) * 0.05;
        cLantern[i] += (pal.lantern[i] - cLantern[i]) * 0.05;
      }

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uScroll, smoothScroll);
      gl.uniform1f(uScrollVel, scrollVel);
      gl.uniform2f(uMouse, smoothMX, smoothMY);
      gl.uniform1f(uHoverFlare, hoverFlare);
      gl.uniform3f(uSkyTop, cSkyTop[0], cSkyTop[1], cSkyTop[2]);
      gl.uniform3f(uSkyHorizon, cSkyHor[0], cSkyHor[1], cSkyHor[2]);
      gl.uniform3f(uAccentLight, cAccent[0], cAccent[1], cAccent[2]);
      gl.uniform3f(uWaterDeep, cWater[0], cWater[1], cWater[2]);
      gl.uniform3f(uLanternGlow, cLantern[0], cLantern[1], cLantern[2]);
      gl.uniform4fv(uDrops, dropBuf);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scenic-theme-hover", onThemeHover);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [liteMode]);

  if (liteMode) {
    return <div className="scenic-fallback-bg" aria-hidden="true" />;
  }

  return <canvas ref={canvasRef} className="scenic-webgl-canvas" aria-hidden="true" />;
};
