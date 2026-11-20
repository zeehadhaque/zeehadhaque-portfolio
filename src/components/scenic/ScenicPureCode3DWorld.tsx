import React, { useEffect, useRef } from "react";

export type ScenicMoodId = "frost" | "ember" | "moonlight";

interface ScenicPureCode3DWorldProps {
  mood: ScenicMoodId;
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

// 100% Pure-Code 3D Raymarched Alpine Valley & Mirror Lake Engine (WebGL 1.0 / GLSL ES 1.00 Compliant)
const FRAG_SRC = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  varying vec2 vUv;

  uniform vec2 uRes;
  uniform float uTime;
  uniform float uScroll;       // 0.0 (High Snowy Peaks) -> 0.45 (Misty Autumn Valley) -> 0.78 (Mirror Lake) -> 1.0 (Starlit Horizon)
  uniform float uScrollVel;
  uniform vec2 uMouse;         // 0..1 cursor
  uniform vec2 uParallax;      // smoothed -1..1 3D camera look
  uniform float uHoverFlare;
  uniform float uMoodIdx;      // 0.0 = frost, 1.0 = ember, 2.0 = moonlight
  uniform vec3 uSkyTop;
  uniform vec3 uSkyHor;
  uniform vec3 uSunCol;
  uniform vec3 uWaterCol;
  uniform vec3 uLanternCol;
  uniform vec4 uDrops[8];      // xy = screen uv, z = birthTime, w = strength

  float hash21(vec2 p) {
    p = fract(p * vec2(127.34, 453.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  // Sharp ridged alpine mountain multifractal (4 fast octaves)
  float ridgedFbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.54;
    mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
    for (int i = 0; i < 4; i++) {
      float n = 1.0 - abs(valueNoise(p) * 2.0 - 1.0);
      sum += (n * n) * amp;
      p = rot * p * 2.08 + vec2(13.7, 9.2);
      amp *= 0.48;
    }
    return sum;
  }

  // Winding valley spine so the 3D camera glides naturally through overlapping peaks & over the mirror lake
  float valleyCenter(float z) {
    return sin(z * 0.12) * 2.5 + cos(z * 0.055) * 1.4;
  }

  // 3D Terrain Heightfield y = f(x, z)
  float terrainHeight(vec2 p) {
    float vc = valleyCenter(p.y);
    float dx = abs(p.x - vc);

    // Wide calm mirror lake basin widens further down the valley
    float lakeWidth = 1.35 + smoothstep(6.0, 26.0, p.y) * 1.35;
    float slopeMask = smoothstep(lakeWidth, lakeWidth + 5.8, dx);
    float shoreRise = smoothstep(lakeWidth - 0.25, lakeWidth + 0.9, dx);

    float ridge = ridgedFbm(p * 0.22);
    float detail = valueNoise(p * 1.15) * 0.14;

    // Below water (y < 0.0) in the center -> mirror lake; steep snow peaks on both sides
    return -0.35 + shoreRise * 0.42 + slopeMask * (0.55 + ridge * 4.9 + detail);
  }

  // 3D Surface Normal for realistic sunlit ridges & deep alpine blue shadows
  vec3 calcTerrainNormal(vec2 p, float dist) {
    float e = max(0.035, dist * 0.0045);
    float hL = terrainHeight(p - vec2(e, 0.0));
    float hR = terrainHeight(p + vec2(e, 0.0));
    float hD = terrainHeight(p - vec2(0.0, e));
    float hU = terrainHeight(p + vec2(0.0, e));
    return normalize(vec3(hL - hR, 2.0 * e, hD - hU));
  }

  // Animated 3D Water Wave Height (Dheu) + Screen-Space Interactive Cursor/Click Ripples
  float waterWaveHeight(vec2 wp, vec2 screenUv, float t) {
    float h = sin(wp.x * 2.4 + t * 1.35 + cos(wp.y * 1.8 - t * 0.85)) * 0.055;
    h += cos(wp.y * 3.6 - t * 1.65 + sin(wp.x * 1.5 + t * 0.7)) * 0.042;
    h += sin((wp.x * 1.6 + wp.y * 2.1) * 3.2 + t * 2.2) * 0.022;

    float velBoost = 1.0 + clamp(abs(uScrollVel) * 0.15, 0.0, 1.4);
    h += sin(wp.x * 7.5 - wp.y * 6.2 + t * 2.9) * 0.012 * velBoost;

    // Interactive concentric water drops (cursor trail, click splash, theme hover burst)
    float aspect = uRes.x / max(uRes.y, 1.0);
    for (int i = 0; i < 8; i++) {
      vec4 d = uDrops[i];
      float age = t - d.z;
      if (age > 0.0 && age < 3.5 && d.w > 0.01) {
        vec2 delta = screenUv - d.xy;
        delta.x *= aspect;
        float dist = length(delta);
        float radius = age * 0.44;
        float diff = dist - radius;
        if (abs(diff) < 0.24) {
          float env = exp(-(diff * diff) * 140.0) * exp(-age * 0.86);
          h += sin(diff * 56.0) * env * d.w * 0.11;
        }
      }
    }
    return h;
  }

  // Soft 3-layer bokeh snowfall with cursor wind drift
  float snowLayer(vec2 uv, float t, float scale, float speed, float radius, vec2 drift) {
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 st = uv;
    st.x *= aspect;
    st.x += sin(t * 0.44 + uv.y * 2.4) * 0.085 - t * 0.04 * speed;
    st.y += t * speed + uScroll * 0.34;
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

  // Sky, Celestial Orb, Cloud Wisps, Twinkling Stars & Volumetric God-Rays
  vec3 renderSky(vec3 rd, vec3 sunDir, float t, float nightMix, float duskMix, float flare) {
    float elev = clamp(rd.y, 0.0, 1.0);

    vec3 topC = mix(uSkyTop, uSkyTop * 0.44 + vec3(0.01, 0.018, 0.05), nightMix);
    vec3 horC = mix(uSkyHor, mix(uSkyHor, uLanternCol * 0.68, 0.45), duskMix);
    horC = mix(horC, uSkyTop * 1.15 + uSunCol * 0.12, nightMix);

    vec3 sky = mix(horC, topC, pow(elev, 0.62));

    // Soft drifting alpine high-altitude cloud wisps
    if (rd.y > 0.02) {
      vec2 cloudUv = rd.xz / (rd.y + 0.24) * 0.55 + vec2(t * 0.018, -t * 0.012);
      float c1 = valueNoise(cloudUv * 2.2);
      float c2 = valueNoise(cloudUv * 4.8 + vec2(4.2, 1.7));
      float cloud = smoothstep(0.42, 0.84, c1 * 0.65 + c2 * 0.35) * smoothstep(0.02, 0.28, rd.y);
      vec3 cloudTint = mix(horC * 1.25, uSunCol, 0.35);
      sky = mix(sky, cloudTint, cloud * 0.36);
    }

    // Sun / Pale Winter Moon glow + crisp orb
    float sunDot = max(dot(rd, sunDir), 0.0);
    sky += uSunCol * pow(sunDot, 12.0) * (0.42 + flare * 0.35);
    sky += mix(uSunCol, vec3(1.0, 0.98, 0.94), 0.72) * pow(sunDot, 220.0) * 1.5;

    // Crisp alpine stars emerging cleanly in upper twilight/night sky
    vec2 starUv = floor(vec2(atan(rd.x, rd.z) * 48.0, rd.y * 120.0));
    float sRand = hash21(starUv);
    if (sRand > 0.986 && rd.y > 0.14) {
      float tw = 0.5 + 0.5 * sin(t * 2.8 + sRand * 95.0);
      sky += vec3(0.9, 0.95, 1.0) * tw * (0.22 + nightMix * 0.92) * smoothstep(0.14, 0.52, rd.y);
    }

    return sky;
  }

  // Shade a 3D Terrain Hit (Snow Caps + Dark Slate Cliffs + Pine & Crimson/Gold Autumn Slopes + Shoreline Lanterns + Aerial Mist)
  vec3 shadeTerrain(vec3 pos, float dist, vec3 rd, vec3 sunDir, vec3 fogCol, float duskMix, float nightMix) {
    vec3 n = calcTerrainNormal(pos.xz, dist);
    float diff = max(dot(n, sunDir), 0.0);
    float skyFill = 0.5 + 0.5 * n.y;

    // Base dark wet alpine granite rock
    vec3 rockCol = vec3(0.055, 0.075, 0.115);

    // Pine forest evergreen belt on lower/mid slopes
    float treeBand = smoothstep(0.08, 0.45, pos.y) * smoothstep(1.95, 0.85, pos.y) * smoothstep(0.42, 0.75, n.y);
    vec3 pineCol = vec3(0.032, 0.072, 0.068);

    // Glowing Crimson & Gold Autumn Foliage patches (peaks in Chapter II scroll & Ember mood!)
    float autumnPatch = smoothstep(0.46, 0.78, valueNoise(pos.xz * 1.45 + vec2(3.1, 7.4)));
    float autumnStrength = clamp(duskMix * 1.15 + (uMoodIdx > 0.5 && uMoodIdx < 1.5 ? 0.65 : 0.15), 0.0, 1.0);
    vec3 autumnCol = mix(vec3(0.46, 0.12, 0.06), vec3(0.72, 0.36, 0.10), valueNoise(pos.xz * 2.8));
    vec3 foliageCol = mix(pineCol, autumnCol, autumnPatch * autumnStrength);

    vec3 matCol = mix(rockCol, foliageCol, treeBand * 0.85);

    // Crisp gleaming white snow on high peaks & flatter ridges (less snow on sheer vertical rock walls)
    float snowLine = mix(0.65, 1.05, duskMix);
    float snowMask = smoothstep(snowLine, snowLine + 1.05, pos.y + n.y * 0.55) * smoothstep(0.36, 0.68, n.y);
    // Also frost dusting right along the shoreline in Frost mood
    float shoreFrost = smoothstep(0.28, 0.02, pos.y) * smoothstep(0.65, 0.9, n.y) * (1.0 - duskMix * 0.7);
    vec3 snowCol = vec3(0.86, 0.93, 1.0);
    matCol = mix(matCol, snowCol, clamp(snowMask + shoreFrost * 0.45, 0.0, 0.95));

    // Physically inspired directional sun/moon + cool blue sky ambient + subtle back-rim
    vec3 sunLight = uSunCol * diff * mix(1.45, 0.75, nightMix);
    vec3 ambLight = mix(uSkyHor, uSkyTop, 0.45) * skyFill * 0.62;
    vec3 col = matCol * (sunLight + ambLight);

    // Warm golden shoreline lanterns nestled near the water's edge (appear along the lake chapters)
    float lanternBand = smoothstep(0.45, 0.06, abs(pos.y - 0.16));
    if (lanternBand > 0.05) {
      vec2 lCell = floor(pos.xz * 0.65);
      float lSeed = hash21(lCell);
      if (lSeed > 0.74) {
        vec2 lCenter = (lCell + 0.5) / 0.65;
        float dL = length(pos.xz - lCenter);
        float flicker = 0.75 + 0.25 * sin(uTime * 3.4 + lSeed * 40.0);
        float lGlow = exp(-dL * 3.4) * lanternBand * flicker * (0.45 + uScroll * 0.85);
        col += uLanternCol * lGlow * 1.45;
      }
    }

    // Exponential 3D aerial perspective fog + low cold valley mist clinging to water level
    float distFog = 1.0 - exp(-dist * 0.044);
    float lowMist = exp(-max(pos.y, 0.0) * 1.65) * smoothstep(3.0, 22.0, dist) * 0.48;
    col = mix(col, fogCol, clamp(distFog + lowMist, 0.0, 0.96));
    return col;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime;
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    // Atmospheric progression driven purely by scroll depth (0.0 -> 1.0)
    float duskMix = smoothstep(0.18, 0.58, uScroll) * (1.0 - smoothstep(0.68, 1.0, uScroll));
    float nightMix = smoothstep(0.60, 0.98, uScroll);

    // 3D CAMERA FLY-THROUGH PATH:
    // Advances forward 26 world units down the winding valley while descending from snowy peaks to the mirror lake
    float camZ = 1.5 + uScroll * 25.0 + sin(t * 0.22) * 0.25;
    float camX = valleyCenter(camZ) + uParallax.x * 0.85 + sin(t * 0.35) * 0.14;
    float camY = mix(2.35, 0.56, smoothstep(0.0, 0.72, uScroll)) + uParallax.y * 0.22 + cos(t * 0.28) * 0.04;
    vec3 ro = vec3(camX, camY, camZ);

    // Look ahead along the winding valley curve + smooth 3D mouse steering
    float lookZ = camZ + 7.0;
    float lookX = valleyCenter(lookZ) + uParallax.x * 1.65;
    float lookY = mix(1.45, 0.42, smoothstep(0.0, 0.68, uScroll)) + smoothstep(0.75, 1.0, uScroll) * 0.45 + uParallax.y * 0.85;
    vec3 ta = vec3(lookX, lookY, lookZ);

    vec3 cw = normalize(ta - ro);
    vec3 cu = normalize(cross(cw, vec3(0.0, 1.0, 0.0)));
    vec3 cv = cross(cu, cw);
    vec3 rd = normalize(p.x * cu + p.y * cv + 1.48 * cw);

    // Sun / Moon direction gliding gently across the valley peaks
    vec3 sunDir = normalize(vec3(
      0.38 - uScroll * 0.42 + uParallax.x * 0.14,
      mix(0.32, 0.24, duskMix) + nightMix * 0.12,
      0.86
    ));

    vec3 fogCol = mix(uSkyHor, mix(uSkyHor, uLanternCol * 0.58, 0.38), duskMix);
    fogCol = mix(fogCol, uSkyTop * 0.95 + uSunCol * 0.10, nightMix);

    // Water plane intersection at y = 0.0
    float maxDist = 42.0;
    float tWater = (ro.y > 0.0 && rd.y < -0.001) ? (-ro.y / rd.y) : 999.0;
    float marchLimit = min(maxDist, tWater);

    // PRIMARY 3D RAYMARCHING (46 adaptive steps with binary refinement -> razor-sharp 3D ridges at 60 FPS)
    float tHit = -1.0;
    float prevDiff = 1.0;
    float prevT = 0.35;
    float curT = 0.35;

    for (int i = 0; i < 46; i++) {
      if (curT > marchLimit) break;
      vec3 pos = ro + rd * curT;
      float h = terrainHeight(pos.xz);
      float diff = pos.y - h;
      if (diff < 0.0) {
        // 3-step binary refinement removes all stepping artifacts
        float lo = prevT;
        float hi = curT;
        for (int b = 0; b < 3; b++) {
          float mid = 0.5 * (lo + hi);
          vec3 mp = ro + rd * mid;
          if (mp.y < terrainHeight(mp.xz)) hi = mid;
          else lo = mid;
        }
        tHit = 0.5 * (lo + hi);
        break;
      }
      prevT = curT;
      prevDiff = diff;
      curT += max(0.085, diff * 0.46 + curT * 0.022);
    }

    vec3 col;

    if (tHit > 0.0) {
      // Hit 3D Alpine Mountain / Valley Slope
      vec3 hitPos = ro + rd * tHit;
      col = shadeTerrain(hitPos, tHit, rd, sunDir, fogCol, duskMix, nightMix);
    } else if (tWater < maxDist) {
      // Hit 3D Mirror Lake Water Plane (y = 0.0) -> Compute Live Water Waves (Dheu) & True Reflection!
      vec3 wPos = ro + rd * tWater;
      float wEps = 0.055;
      float wC = waterWaveHeight(wPos.xz, uv, t);
      float wX = waterWaveHeight(wPos.xz + vec2(wEps, 0.0), uv, t);
      float wZ = waterWaveHeight(wPos.xz + vec2(0.0, wEps), uv, t);
      vec3 wNormal = normalize(vec3((wC - wX) * 2.2, 1.0, (wC - wZ) * 2.2));

      // True reflected 3D ray for mirror mountain & sky reflection
      vec3 reflRd = reflect(rd, wNormal);
      reflRd.y = abs(reflRd.y) + 0.02;
      vec3 reflCol = renderSky(reflRd, sunDir, t, nightMix, duskMix, uHoverFlare);

      // Fast 14-step reflected mountain march so snow peaks genuinely mirror in the lake!
      float rT = 0.6;
      for (int j = 0; j < 14; j++) {
        vec3 rp = wPos + reflRd * rT;
        float rh = terrainHeight(rp.xz);
        if (rp.y < rh) {
          float reflMist = 1.0 - exp(-rT * 0.065);
          vec3 darkPeak = mix(uWaterCol * 1.45, vec3(0.75, 0.86, 0.98), smoothstep(0.95, 2.2, rp.y) * 0.62);
          reflCol = mix(darkPeak, fogCol, reflMist);
          break;
        }
        rT += 0.55 + rT * 0.16;
      }

      // Fresnel glass-mirror balance
      float fresnel = pow(1.0 - max(dot(-rd, wNormal), 0.0), 3.4);
      col = mix(uWaterCol, reflCol, 0.36 + fresnel * 0.58);

      // Shimmering sun/moon specular glints & caustic ripples across wave crests
      vec3 halfSun = normalize(sunDir - rd);
      float sunSpec = pow(max(dot(wNormal, halfSun), 0.0), 46.0);
      float waveCrest = pow(clamp(0.5 + 0.5 * sin(wC * 38.0 + t * 1.4), 0.0, 1.0), 4.0);
      col += uSunCol * (sunSpec * 1.15 + waveCrest * 0.16);

      // Warm golden shoreline lantern reflection ribbons shimmering vertically on the lake
      float distFromShore = abs(abs(wPos.x - valleyCenter(wPos.z)) - (1.35 + smoothstep(6.0, 26.0, wPos.z) * 1.35));
      float ribbon = exp(-distFromShore * 2.4) * (0.55 + 0.45 * sin(wPos.z * 2.2 + wNormal.x * 12.0));
      float sparkle = 0.6 + 0.4 * sin(wPos.z * 16.0 - t * 4.2);
      col += uLanternCol * ribbon * sparkle * (0.28 + uScroll * 0.72) * 0.75;

      // Distance fog blending lake seamlessly into misty horizon
      float waterFog = 1.0 - exp(-tWater * 0.042);
      col = mix(col, fogCol, clamp(waterFog, 0.0, 0.94));
    } else {
      // Open Alpine Sky
      col = renderSky(rd, sunDir, t, nightMix, duskMix, uHoverFlare);
    }

    // Sweeping Volumetric Diagonal Mountain God-Rays
    float rayX = uv.x * 1.42 + (1.0 - uv.y) * 0.48 - (uMouse.x - 0.5) * 0.26;
    float r1 = pow(max(0.0, sin(rayX * 6.4 + t * 0.26)), 5.0);
    float r2 = pow(max(0.0, sin(rayX * 11.2 - t * 0.22 + 1.4)), 7.0);
    float rayMask = smoothstep(0.06, 0.95, uv.y);
    col += mix(uSunCol, uLanternCol, duskMix * 0.42) * (r1 * 0.62 + r2 * 0.42) * rayMask * (0.17 + uHoverFlare * 0.34);

    // Live Interactive Cursor Moonlight Spotlight + Expanding Ripple Ring Sheen
    vec2 toCursor = uv - uMouse;
    toCursor.x *= aspect;
    float cDist = length(toCursor);
    float cursorHalo = exp(-cDist * 3.6) * (0.22 + uHoverFlare * 0.30);
    col += mix(uSunCol, vec3(0.95, 0.98, 1.0), 0.45) * cursorHalo;

    // 3 Parallax Layers of Crisp Twinkling Snowfall (brightening inside cursor moonlight)
    vec2 snowWind = -toCursor * exp(-cDist * 4.2) * 0.075;
    float s1 = snowLayer(uv, t, 14.0, 0.055, 0.13, snowWind * 0.3) * 0.34;
    float s2 = snowLayer(uv + 0.37, t, 9.0, 0.095, 0.15, snowWind * 0.7) * 0.56;
    float s3 = snowLayer(uv + 0.71, t, 5.5, 0.14, 0.17, snowWind * 1.1) * 0.78;
    float snow = clamp(s1 + s2 + s3, 0.0, 1.15);
    col += vec3(0.92, 0.97, 1.0) * snow * (0.56 + exp(-cDist * 3.0) * 0.75);

    // Filmic Tone Mapping + Cinema Vignette (keeps frosted glass text super crisp)
    col = col / (1.0 + col * 0.38);
    vec2 vc = (uv - 0.5) * vec2(1.08, 1.0);
    col *= mix(0.48, 1.0, smoothstep(1.14, 0.24, length(vc)));

    gl_FragColor = vec4(col, 1.0);
  }
`;

const MOOD_PRESETS: Record<
  ScenicMoodId,
  {
    idx: number;
    skyTop: number[];
    skyHor: number[];
    sun: number[];
    water: number[];
    lantern: number[];
  }
> = {
  frost: {
    idx: 0,
    skyTop: [0.028, 0.068, 0.155],
    skyHor: [0.22, 0.36, 0.54],
    sun: [0.76, 0.92, 1.0],
    water: [0.014, 0.042, 0.092],
    lantern: [1.0, 0.74, 0.40],
  },
  ember: {
    idx: 1,
    skyTop: [0.065, 0.045, 0.105],
    skyHor: [0.42, 0.24, 0.24],
    sun: [1.0, 0.78, 0.54],
    water: [0.032, 0.026, 0.062],
    lantern: [1.0, 0.62, 0.24],
  },
  moonlight: {
    idx: 2,
    skyTop: [0.012, 0.024, 0.062],
    skyHor: [0.085, 0.165, 0.29],
    sun: [0.64, 0.84, 1.0],
    water: [0.008, 0.022, 0.055],
    lantern: [0.98, 0.80, 0.48],
  },
};

export const ScenicPureCode3DWorld: React.FC<ScenicPureCode3DWorldProps> = ({
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
    const uParallax = gl.getUniformLocation(prog, "uParallax");
    const uHoverFlare = gl.getUniformLocation(prog, "uHoverFlare");
    const uMoodIdx = gl.getUniformLocation(prog, "uMoodIdx");
    const uSkyTop = gl.getUniformLocation(prog, "uSkyTop");
    const uSkyHor = gl.getUniformLocation(prog, "uSkyHor");
    const uSunCol = gl.getUniformLocation(prog, "uSunCol");
    const uWaterCol = gl.getUniformLocation(prog, "uWaterCol");
    const uLanternCol = gl.getUniformLocation(prog, "uLanternCol");
    const uDrops = gl.getUniformLocation(prog, "uDrops");

    const dropBuf = new Float32Array(8 * 4);
    let dropIdx = 0;
    let lastMoveDrop = 0;
    let lastAmbientDrop = 0;
    const startMs = performance.now();

    let mouseX = 0.5;
    let mouseY = 0.5;
    let smoothMX = 0.5;
    let smoothMY = 0.5;
    let smoothParX = 0;
    let smoothParY = 0;
    let smoothScroll = 0;
    let hoverFlare = 0;
    let lastScrollY = window.scrollY;
    let scrollVel = 0;

    const init = MOOD_PRESETS[moodRef.current] ?? MOOD_PRESETS.frost;
    const cSkyTop = [...init.skyTop];
    const cSkyHor = [...init.skyHor];
    const cSun = [...init.sun];
    const cWater = [...init.water];
    const cLantern = [...init.lantern];

    const spawnDrop = (nx: number, ny: number, strength: number) => {
      if (pausedRef.current || document.hidden) return;
      const tSec = (performance.now() - startMs) * 0.001;
      const base = dropIdx * 4;
      dropBuf[base] = nx;
      dropBuf[base + 1] = ny;
      dropBuf[base + 2] = tSec;
      dropBuf[base + 3] = strength;
      dropIdx = (dropIdx + 1) % 8;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.0 : 1.35);
      canvas.width = Math.max(360, Math.floor(window.innerWidth * dpr));
      canvas.height = Math.max(240, Math.floor(window.innerHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1.0 - e.clientY / window.innerHeight;
      const now = performance.now();
      if (now - lastMoveDrop > 110) {
        spawnDrop(mouseX, mouseY, 1.0);
        lastMoveDrop = now;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      spawnDrop(e.clientX / window.innerWidth, 1.0 - e.clientY / window.innerHeight, 2.0);
      hoverFlare = Math.min(1.0, hoverFlare + 0.6);
    };

    const onThemeHover = (e: Event) => {
      const detail = (e as CustomEvent<{ x?: number; y?: number }>).detail;
      hoverFlare = 1.0;
      spawnDrop(detail?.x ?? mouseX, detail?.y ?? mouseY, 1.9);
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

      if (now - lastAmbientDrop > 1650) {
        spawnDrop(0.18 + Math.random() * 0.64, 0.08 + Math.random() * 0.32, 0.95);
        lastAmbientDrop = now;
      }

      const t = (now - startMs) * 0.001;
      smoothMX += (mouseX - smoothMX) * 0.1;
      smoothMY += (mouseY - smoothMY) * 0.1;
      smoothParX += ((mouseX - 0.5) * 2.0 - smoothParX) * 0.075;
      smoothParY += ((mouseY - 0.5) * 2.0 - smoothParY) * 0.075;
      hoverFlare *= 0.94;

      const curY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetScroll = Math.min(1, Math.max(0, curY / maxScroll));
      smoothScroll += (targetScroll - smoothScroll) * 0.09;
      scrollVel += ((curY - lastScrollY) * 0.14 - scrollVel) * 0.14;
      lastScrollY = curY;

      const pal = MOOD_PRESETS[moodRef.current] ?? MOOD_PRESETS.frost;
      for (let i = 0; i < 3; i++) {
        cSkyTop[i] += (pal.skyTop[i] - cSkyTop[i]) * 0.06;
        cSkyHor[i] += (pal.skyHor[i] - cSkyHor[i]) * 0.06;
        cSun[i] += (pal.sun[i] - cSun[i]) * 0.06;
        cWater[i] += (pal.water[i] - cWater[i]) * 0.06;
        cLantern[i] += (pal.lantern[i] - cLantern[i]) * 0.06;
      }

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uScroll, smoothScroll);
      gl.uniform1f(uScrollVel, scrollVel);
      gl.uniform2f(uMouse, smoothMX, smoothMY);
      gl.uniform2f(uParallax, smoothParX, smoothParY);
      gl.uniform1f(uHoverFlare, hoverFlare);
      gl.uniform1f(uMoodIdx, pal.idx);
      gl.uniform3f(uSkyTop, cSkyTop[0], cSkyTop[1], cSkyTop[2]);
      gl.uniform3f(uSkyHor, cSkyHor[0], cSkyHor[1], cSkyHor[2]);
      gl.uniform3f(uSunCol, cSun[0], cSun[1], cSun[2]);
      gl.uniform3f(uWaterCol, cWater[0], cWater[1], cWater[2]);
      gl.uniform3f(uLanternCol, cLantern[0], cLantern[1], cLantern[2]);
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
    return (
      <div className="scenic-3d-stage scenic-3d-fallback" aria-hidden="true" />
    );
  }

  return (
    <div className="scenic-3d-stage" aria-hidden="true">
      <canvas ref={canvasRef} className="scenic-3d-canvas" />
    </div>
  );
};
