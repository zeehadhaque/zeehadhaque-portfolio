import * as THREE from "three";
import { ScrollTimeline, StageDefinition } from "./ScrollTimeline";

export type CastleThemeId = "obsidian" | "glacial" | "noir";

export type CastleInteractiveTarget =
  | "monolith-shadow"
  | "monolith-chakra"
  | "portal-academy"
  | "portal-zeeai"
  | "portal-contact";

export interface CastleTelemetry {
  progress: number;
  velocity: number;
  stage: StageDefinition;
  hoveredTarget: CastleInteractiveTarget | null;
  cameraZ: number;
}

interface BlockSeed {
  assembled: THREE.Vector3;
  scattered: THREE.Vector3;
  rotOffset: THREE.Euler;
  scale: THREE.Vector3;
}

const THEME_PALETTES: Record<
  CastleThemeId,
  { bg: number; fog: number; key: number; rim: number; fogDensity: number }
> = {
  obsidian: { bg: 0x020305, fog: 0x050810, key: 0x7dbbff, rim: 0xdcebff, fogDensity: 0.024 },
  glacial: { bg: 0x040a16, fog: 0x091830, key: 0xa9d4ff, rim: 0xffffff, fogDensity: 0.019 },
  noir: { bg: 0x010203, fog: 0x040508, key: 0x5f9be0, rim: 0xa9d4ff, fogDensity: 0.03 },
};

// Custom GLSL Post-Processing: Chromatic Aberration + Digital Glitch Transit + Film Grain
const POST_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const POST_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D tDiffuse;
  uniform float uTime;
  uniform float uAberration;
  uniform float uGlitch;
  uniform float uExitFade;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;

    // Horizontal glitch slices during Stage 02 transit
    if (uGlitch > 0.001) {
      float band = floor(uv.y * 42.0 + uTime * 14.0);
      float n = hash(vec2(band, floor(uTime * 24.0)));
      float shift = (n - 0.5) * 0.045 * uGlitch * step(0.68, n);
      uv.x = clamp(uv.x + shift, 0.0, 1.0);
    }

    vec2 dir = uv - 0.5;
    float dist = length(dir);
    vec2 offset = dir * uAberration * (0.35 + dist * 1.6);

    float r = texture2D(tDiffuse, clamp(uv + offset, 0.0, 1.0)).r;
    float g = texture2D(tDiffuse, uv).g;
    float b = texture2D(tDiffuse, clamp(uv - offset, 0.0, 1.0)).b;

    vec3 col = vec3(r, g, b);

    // Subtle scanline & cinema grain
    float grain = (hash(uv * 900.0 + fract(uTime)) - 0.5) * 0.025;
    col += grain;

    // Atmospheric vignette
    float vig = smoothstep(0.95, 0.25, dist);
    col *= mix(0.62, 1.0, vig);

    // Stage 07 -> Stage 01 luminous ice veil for seamless infinite return
    vec3 veilColor = vec3(0.49, 0.73, 1.0) * 0.14 + vec3(0.015, 0.025, 0.05);
    col = mix(col, veilColor, uExitFade);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export class CastleEngine {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private timeline: ScrollTimeline;

  // Post-processing target & fullscreen quad
  private renderTarget: THREE.WebGLRenderTarget;
  private postScene: THREE.Scene;
  private postCamera: THREE.OrthographicCamera;
  private postMaterial: THREE.ShaderMaterial;

  // Dynamic lights for animated theme transitions
  private keyLight!: THREE.DirectionalLight;
  private rimLight!: THREE.PointLight;
  private fog!: THREE.FogExp2;
  private targetTheme: CastleThemeId = "obsidian";
  private bgColor = new THREE.Color(THEME_PALETTES.obsidian.bg);
  private fogColor = new THREE.Color(THEME_PALETTES.obsidian.fog);
  private keyColor = new THREE.Color(THEME_PALETTES.obsidian.key);
  private rimColor = new THREE.Color(THEME_PALETTES.obsidian.rim);

  // Stage assemblies
  private awakeningMesh!: THREE.InstancedMesh;
  private seamMesh!: THREE.InstancedMesh;
  private blockSeeds: BlockSeed[] = [];
  private ringGroups: THREE.Group[] = [];
  private monolithShadow!: THREE.Group;
  private monolithChakra!: THREE.Group;
  private terminalPortals: THREE.Mesh[] = [];
  private particles!: THREE.Points;

  // Camera splines
  private cameraCurve: THREE.CatmullRomCurve3;
  private lookCurve: THREE.CatmullRomCurve3;

  // Pointer & Raycasting
  private pointer = new THREE.Vector2(0, 0);
  private smoothPointer = new THREE.Vector2(0, 0);
  private raycaster = new THREE.Raycaster();
  private interactiveMeshes: THREE.Object3D[] = [];
  private hoveredTarget: CastleInteractiveTarget | null = null;

  // Loop state
  private rafId = 0;
  private clock = new THREE.Clock();
  private dummy = new THREE.Object3D();
  private onTelemetry: (t: CastleTelemetry) => void;
  private onSelectTarget: (target: CastleInteractiveTarget) => void;

  constructor(
    container: HTMLElement,
    onTelemetry: (t: CastleTelemetry) => void,
    onSelectTarget: (target: CastleInteractiveTarget) => void
  ) {
    this.container = container;
    this.onTelemetry = onTelemetry;
    this.onSelectTarget = onSelectTarget;
    this.timeline = new ScrollTimeline();

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    const dpr = Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.domElement.className = "castle-canvas";
    container.appendChild(this.renderer.domElement);

    // Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.background = this.bgColor;
    this.fog = new THREE.FogExp2(THEME_PALETTES.obsidian.fog, THEME_PALETTES.obsidian.fogDensity);
    this.scene.fog = this.fog;

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      260
    );

    // Post-processing pipeline
    const w = Math.max(1, Math.floor(container.clientWidth * dpr));
    const h = Math.max(1, Math.floor(container.clientHeight * dpr));
    this.renderTarget = new THREE.WebGLRenderTarget(w, h, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });
    this.postScene = new THREE.Scene();
    this.postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.postMaterial = new THREE.ShaderMaterial({
      vertexShader: POST_VERT,
      fragmentShader: POST_FRAG,
      uniforms: {
        tDiffuse: { value: this.renderTarget.texture },
        uTime: { value: 0 },
        uAberration: { value: 0.002 },
        uGlitch: { value: 0 },
        uExitFade: { value: 0 },
      },
    });
    this.postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.postMaterial));

    // Deterministic 7-stage camera & lookAt splines along -Z corridor
    this.cameraCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.2, 26),    // Stage 01 Awakening
      new THREE.Vector3(0, 1.9, 10),    // Stage 01->02 Archway
      new THREE.Vector3(0, 1.6, -12),   // Stage 02 Entrance Transit
      new THREE.Vector3(0, 1.5, -38),   // Stage 03 Segmented Ring Gate
      new THREE.Vector3(-2.6, 1.7, -64),// Stage 04 Monolith CO_01 (SHADOW / III)
      new THREE.Vector3(2.8, 1.7, -92), // Stage 05 Monolith CO_02 (CHAKRA)
      new THREE.Vector3(0, 2.0, -122),  // Stage 06 Circular Terminal Chamber
      new THREE.Vector3(0, 2.2, -152),  // Stage 07 Grand Exit
    ]);

    this.lookCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.0, 0),
      new THREE.Vector3(0, 1.6, -18),
      new THREE.Vector3(0, 1.5, -42),
      new THREE.Vector3(0, 1.5, -62),
      new THREE.Vector3(1.2, 1.6, -74),
      new THREE.Vector3(-1.2, 1.6, -102),
      new THREE.Vector3(0, 1.8, -138),
      new THREE.Vector3(0, 2.0, -172),
    ]);

    this.buildLights();
    this.buildStage01Awakening();
    this.buildStage03RingGate();
    this.buildStage04And05Monoliths();
    this.buildStage06TerminalChamber();
    this.buildStage07ExitPortal();
    this.buildAtmosphericParticles();

    this.timeline.attach(window);
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("pointermove", this.handlePointerMove);
    this.renderer.domElement.addEventListener("click", this.handleClick);

    this.animate();
  }

  public setTheme(theme: CastleThemeId) {
    this.targetTheme = theme;
  }

  public setScrollEnabled(enabled: boolean) {
    this.timeline.setEnabled(enabled);
  }

  public jumpToStage(stageId: number) {
    this.timeline.jumpToStage(stageId);
  }

  private buildLights() {
    const ambient = new THREE.AmbientLight(0x1b2e4d, 0.9);
    this.scene.add(ambient);

    this.keyLight = new THREE.DirectionalLight(THEME_PALETTES.obsidian.key, 2.1);
    this.keyLight.position.set(12, 24, 18);
    this.scene.add(this.keyLight);

    this.rimLight = new THREE.PointLight(THEME_PALETTES.obsidian.rim, 40, 140, 1.4);
    this.rimLight.position.set(0, 8, -70);
    this.scene.add(this.rimLight);

    // Reflective dark marble floor running along the castle axis
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050810,
      metalness: 0.78,
      roughness: 0.22,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(54, 240), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -2.4, -70);
    this.scene.add(floor);
  }

  private buildStage01Awakening() {
    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x091426,
      metalness: 0.65,
      roughness: 0.28,
    });
    const seamMat = new THREE.MeshBasicMaterial({
      color: 0xa9d4ff,
      transparent: true,
      opacity: 0.82,
    });

    const seeds: BlockSeed[] = [];
    // Gothic twin towers + pointed archway columns
    for (let i = 0; i < 64; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const tier = Math.floor(i / 2);
      const col = tier % 4;
      const row = Math.floor(tier / 4);

      const x = side * (3.8 + col * 1.75);
      const y = -1.2 + row * 1.45;
      const z = 4 - col * 1.4;

      const assembled = new THREE.Vector3(x, y, z);
      const scattered = new THREE.Vector3(
        x + side * (5 + (i % 5) * 1.4),
        y + ((i % 7) - 3) * 2.1,
        z + ((i % 4) - 1.5) * 4.2
      );

      seeds.push({
        assembled,
        scattered,
        rotOffset: new THREE.Euler((i % 3) * 0.4, (i % 5) * 0.3, (i % 2) * 0.5),
        scale: new THREE.Vector3(1.35, 1.25, 1.35),
      });
    }

    this.blockSeeds = seeds;
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const seamGeo = new THREE.BoxGeometry(1.03, 0.05, 1.03);

    this.awakeningMesh = new THREE.InstancedMesh(boxGeo, obsidianMat, seeds.length);
    this.seamMesh = new THREE.InstancedMesh(seamGeo, seamMat, seeds.length);
    this.scene.add(this.awakeningMesh, this.seamMesh);
  }

  private buildStage03RingGate() {
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x091426,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x102848,
      emissiveIntensity: 0.55,
    });
    const causticMat = new THREE.MeshBasicMaterial({
      color: 0x7dbbff,
      transparent: true,
      opacity: 0.72,
    });

    const radii = [8.2, 6.4, 4.7];
    radii.forEach((radius, idx) => {
      const group = new THREE.Group();
      group.position.set(0, 1.6, -42 - idx * 3.8);

      const segments = 8;
      for (let s = 0; s < segments; s++) {
        const arc = (Math.PI * 2) / segments;
        const segGeo = new THREE.TorusGeometry(radius, 0.36, 12, 18, arc * 0.72);
        const seg = new THREE.Mesh(segGeo, ringMat);
        seg.rotation.z = s * arc;
        group.add(seg);

        // Luminous caustic rim arc
        const glowGeo = new THREE.TorusGeometry(radius - 0.38, 0.045, 8, 16, arc * 0.68);
        const glow = new THREE.Mesh(glowGeo, causticMat);
        glow.rotation.z = s * arc;
        group.add(glow);
      }

      this.ringGroups.push(group);
      this.scene.add(group);
    });
  }

  private createCrystallineMonolith(
    pos: THREE.Vector3,
    targetId: CastleInteractiveTarget,
    accentHex: number
  ): THREE.Group {
    const group = new THREE.Group();
    group.position.copy(pos);

    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x091426,
      emissive: accentHex,
      emissiveIntensity: 0.22,
      metalness: 0.15,
      roughness: 0.08,
      transmission: 0.76,
      thickness: 1.8,
      ior: 1.55,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
    });

    const coreGeo = new THREE.OctahedronGeometry(2.6, 1);
    coreGeo.scale(0.85, 1.55, 0.85);
    const core = new THREE.Mesh(coreGeo, crystalMat);
    core.userData.target = targetId;
    group.add(core);
    this.interactiveMeshes.push(core);

    // Wireframe crystalline telemetry cage
    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(coreGeo),
      new THREE.LineBasicMaterial({ color: 0xa9d4ff, transparent: true, opacity: 0.68 })
    );
    wire.scale.setScalar(1.06);
    group.add(wire);

    const light = new THREE.PointLight(accentHex, 18, 22, 1.5);
    light.position.set(0, 0, 2.5);
    group.add(light);

    this.scene.add(group);
    return group;
  }

  private buildStage04And05Monoliths() {
    this.monolithShadow = this.createCrystallineMonolith(
      new THREE.Vector3(1.6, 1.8, -74),
      "monolith-shadow",
      0x7dbbff
    );
    this.monolithChakra = this.createCrystallineMonolith(
      new THREE.Vector3(-1.6, 1.8, -102),
      "monolith-chakra",
      0xa9d4ff
    );
  }

  private buildStage06TerminalChamber() {
    const chamberZ = -136;
    const rotundaMat = new THREE.MeshStandardMaterial({
      color: 0x050810,
      metalness: 0.75,
      roughness: 0.3,
    });

    // Monumental circular colonnade
    const colGeo = new THREE.CylinderGeometry(0.45, 0.55, 14, 12);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const col = new THREE.Mesh(colGeo, rotundaMat);
      col.position.set(Math.cos(a) * 12, 4.5, chamberZ + Math.sin(a) * 12);
      this.scene.add(col);
    }

    // Three Interactive Spatial Portals: Filmmaking Institute, ZEE AI Core, Direct Contact
    const portalDefs: Array<{ x: number; z: number; id: CastleInteractiveTarget; color: number }> = [
      { x: -5.2, z: chamberZ - 2.5, id: "portal-academy", color: 0x7dbbff },
      { x: 0, z: chamberZ - 5.2, id: "portal-zeeai", color: 0xdcebff },
      { x: 5.2, z: chamberZ - 2.5, id: "portal-contact", color: 0xa9d4ff },
    ];

    portalDefs.forEach((p) => {
      const geo = new THREE.TorusKnotGeometry(1.15, 0.24, 96, 16);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x091426,
        emissive: p.color,
        emissiveIntensity: 0.45,
        metalness: 0.4,
        roughness: 0.12,
        clearcoat: 1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(p.x, 1.9, p.z);
      mesh.userData.target = p.id;
      this.scene.add(mesh);
      this.terminalPortals.push(mesh);
      this.interactiveMeshes.push(mesh);
    });
  }

  private buildStage07ExitPortal() {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(6.8, 0.22, 16, 80),
      new THREE.MeshBasicMaterial({ color: 0xdcebff, transparent: true, opacity: 0.85 })
    );
    ring.position.set(0, 2.2, -162);
    this.scene.add(ring);
  }

  private buildAtmosphericParticles() {
    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 38;
      positions[i * 3 + 1] = Math.random() * 18 - 2;
      positions[i * 3 + 2] = 28 - Math.random() * 200;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xa9d4ff,
      size: 0.085,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  private updateStage01(progress: number, elapsed: number) {
    // 0..0.14 drives assembly from scattered -> locked Gothic facade
    const t = THREE.MathUtils.clamp(progress / 0.14, 0, 1);
    const eased = 1 - Math.pow(1 - t, 3);

    for (let i = 0; i < this.blockSeeds.length; i++) {
      const seed = this.blockSeeds[i];
      this.dummy.position.lerpVectors(seed.scattered, seed.assembled, eased);
      this.dummy.position.y += Math.sin(elapsed * 0.9 + i) * 0.08 * (1 - eased);
      this.dummy.rotation.set(
        seed.rotOffset.x * (1 - eased),
        seed.rotOffset.y * (1 - eased),
        seed.rotOffset.z * (1 - eased)
      );
      this.dummy.scale.copy(seed.scale);
      this.dummy.updateMatrix();
      this.awakeningMesh.setMatrixAt(i, this.dummy.matrix);
      this.seamMesh.setMatrixAt(i, this.dummy.matrix);
    }
    this.awakeningMesh.instanceMatrix.needsUpdate = true;
    this.seamMesh.instanceMatrix.needsUpdate = true;
  }

  private animate = () => {
    this.rafId = requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const elapsed = this.clock.getElapsedTime();

    const { progress, velocity, stage } = this.timeline.update(dt);

    // Smooth Theme Interpolation inside Three.js
    const pal = THEME_PALETTES[this.targetTheme];
    this.bgColor.lerp(new THREE.Color(pal.bg), dt * 3.2);
    this.fogColor.lerp(new THREE.Color(pal.fog), dt * 3.2);
    this.keyColor.lerp(new THREE.Color(pal.key), dt * 3.2);
    this.rimColor.lerp(new THREE.Color(pal.rim), dt * 3.2);
    this.fog.color.copy(this.fogColor);
    this.keyLight.color.copy(this.keyColor);
    this.rimLight.color.copy(this.rimColor);

    // Pointer damping for 3D camera parallax & monolith crystal tilt
    this.smoothPointer.lerp(this.pointer, 0.08);

    // Camera dolly along deterministic spline + cursor perspective offset
    const camPos = this.cameraCurve.getPointAt(progress);
    const lookPos = this.lookCurve.getPointAt(progress);
    this.camera.position.set(
      camPos.x + this.smoothPointer.x * 1.15,
      camPos.y + this.smoothPointer.y * 0.65,
      camPos.z
    );
    this.camera.lookAt(
      lookPos.x + this.smoothPointer.x * 0.45,
      lookPos.y + this.smoothPointer.y * 0.3,
      lookPos.z
    );

    // Move rim light along with camera for continuous specular architecture
    this.rimLight.position.set(this.camera.position.x, this.camera.position.y + 4, this.camera.position.z - 12);

    // Stage 01 blocks
    this.updateStage01(progress, elapsed);

    // Stage 02 transit chromatic aberration & glitch spike around p = 0.22
    const transitDist = Math.abs(progress - 0.22);
    const transitPulse = Math.max(0, 1 - transitDist / 0.065);
    const speedAberration = Math.min(Math.abs(velocity) * 0.06, 0.012);
    this.postMaterial.uniforms.uTime.value = elapsed;
    this.postMaterial.uniforms.uAberration.value = 0.002 + speedAberration + transitPulse * 0.018;
    this.postMaterial.uniforms.uGlitch.value = transitPulse;

    // Stage 07 -> Stage 01 seamless return veil
    const exitFade = progress > 0.94 ? (progress - 0.94) / 0.06 : progress < 0.03 ? (0.03 - progress) / 0.03 : 0;
    this.postMaterial.uniforms.uExitFade.value = THREE.MathUtils.clamp(exitFade, 0, 1);

    // Dynamic fog thickening in Stage 02
    this.fog.density = pal.fogDensity + transitPulse * 0.018;

    // Stage 03 counter-rotating mechanical rings
    this.ringGroups.forEach((g, idx) => {
      const dir = idx % 2 === 0 ? 1 : -1;
      g.rotation.z = elapsed * 0.22 * dir + progress * Math.PI * 4 * dir;
    });

    // Stage 04 & 05 cursor-responsive crystalline monoliths
    [this.monolithShadow, this.monolithChakra].forEach((m, idx) => {
      m.rotation.y = elapsed * 0.28 + this.smoothPointer.x * 0.85 + idx;
      m.rotation.x = this.smoothPointer.y * 0.42;
      m.position.y = 1.8 + Math.sin(elapsed * 1.1 + idx * 2) * 0.16;
    });

    // Stage 06 rotating terminal portals
    this.terminalPortals.forEach((p, idx) => {
      p.rotation.y = elapsed * 0.45 + idx * 0.7;
      p.rotation.x = Math.sin(elapsed * 0.6 + idx) * 0.25;
    });

    // Slow atmospheric drift
    this.particles.rotation.z = elapsed * 0.012;

    // Raycast interactive monoliths & portals
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.interactiveMeshes, false);
    this.hoveredTarget = (hits[0]?.object.userData.target as CastleInteractiveTarget) ?? null;

    // Render scene -> offscreen target -> chromatic/glitch post shader
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.postScene, this.postCamera);

    this.onTelemetry({
      progress,
      velocity,
      stage,
      hoveredTarget: this.hoveredTarget,
      cameraZ: this.camera.position.z,
    });
  };

  private handleResize = () => {
    const w = this.container.clientWidth;
    const h = Math.max(this.container.clientHeight, 1);
    const dpr = Math.min(window.devicePixelRatio, w < 768 ? 1.5 : 2);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h);
    this.renderTarget.setSize(Math.floor(w * dpr), Math.floor(h * dpr));
  };

  private handlePointerMove = (e: PointerEvent) => {
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  private handleClick = () => {
    if (this.hoveredTarget) {
      this.onSelectTarget(this.hoveredTarget);
    }
  };

  public dispose() {
    cancelAnimationFrame(this.rafId);
    this.timeline.detach(window);
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("pointermove", this.handlePointerMove);
    this.renderer.domElement.removeEventListener("click", this.handleClick);
    this.renderTarget.dispose();
    this.postMaterial.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
