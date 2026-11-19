import * as THREE from "three";
import { createPalaceMaterials } from "./palaceMaterials";
import type { OpeningShotState } from "../../utils/castleConfig";

export interface CastleProceduralAssets {
  disposables: Array<{ dispose: () => void }>;
  dustPoints: THREE.Points;
  beamMeshes: THREE.Mesh[];
  heroMonoliths: THREE.Group[];
  filmMonoliths: THREE.Group[];
  wireframeGroup: THREE.Group;
  portalRingGroup: THREE.Group;
  zeeCoreGroup: THREE.Group;
  astrolabeGroup: THREE.Group;
  chandelierGroup: THREE.Group;
  clickableObjects: THREE.Object3D[];
  stage01Group: THREE.Group;
  stage03RingGroup: THREE.Group;
  stage04Monolith: THREE.Group;
  stage05Monolith: THREE.Group;
  stage06DaisGroup: THREE.Group;
  updateBeams: (intensity: number, elapsed: number) => void;
  updateOpening: (shot: OpeningShotState | null, elapsed: number) => void;
  updateScrollScene: (
    scrollProgress: number,
    elapsed: number,
    pointerX?: number,
    pointerY?: number,
  ) => void;
}

interface FloatingBlock {
  mesh: THREE.Mesh;
  restingPos: THREE.Vector3;
  restingRot: THREE.Euler;
  offsetPos: THREE.Vector3;
  offsetRot: THREE.Euler;
}

function createTextSprite(
  lines: string[],
  options: {
    fontSize?: number;
    color?: string;
    underlineLastLine?: boolean;
    align?: "left" | "center" | "right";
    border?: boolean;
    scale?: number;
  } = {},
): { sprite: THREE.Sprite; dispose: () => void } {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const fontSize = options.fontSize ?? 26;
    ctx.font = `bold ${fontSize}px "Space Mono", monospace`;
    ctx.fillStyle = options.color ?? "#dcebff";
    ctx.textAlign = options.align ?? "left";
    ctx.textBaseline = "top";

    if (options.border) {
      ctx.strokeStyle = "rgba(125, 187, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);
    }

    const startX =
      options.align === "center"
        ? 256
        : options.align === "right"
          ? 480
          : 32;
    let currentY = 32;
    lines.forEach((line, idx) => {
      ctx.fillText(line, startX, currentY);
      if (options.underlineLastLine && idx === lines.length - 1) {
        const metrics = ctx.measureText(line);
        ctx.strokeStyle = options.color ?? "#dcebff";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const lx =
          options.align === "center"
            ? startX - metrics.width / 2
            : options.align === "right"
              ? startX - metrics.width
              : startX;
        ctx.moveTo(lx, currentY + fontSize + 6);
        ctx.lineTo(lx + metrics.width, currentY + fontSize + 6);
        ctx.stroke();
      }
      currentY += fontSize * 1.4;
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const sprite = new THREE.Sprite(mat);
  const s = options.scale ?? 4.2;
  sprite.scale.set(s, s * 0.5, 1);

  return {
    sprite,
    dispose: () => {
      texture.dispose();
      mat.dispose();
    },
  };
}

export function buildCastleScene(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean,
): CastleProceduralAssets {
  const disposables: Array<{ dispose: () => void }> = [];
  const clickableObjects: THREE.Object3D[] = [];
  const mats = createPalaceMaterials(
    renderer.capabilities.getMaxAnisotropy(),
    isSoftwareGl,
  );
  disposables.push(...mats.disposables);

  // =========================================================================
  // 01. PALACE ARCHITECTURAL ENVELOPE & MARBLE RUNWAYS
  // =========================================================================
  const floorGeo = new THREE.PlaneGeometry(36, 320);
  const floorMesh = new THREE.Mesh(floorGeo, mats.floorMarble);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0, -48);
  floorMesh.receiveShadow = !isSoftwareGl;
  scene.add(floorMesh);
  disposables.push(floorGeo);

  const carpetGeo = new THREE.PlaneGeometry(8.4, 318);
  const carpetMesh = new THREE.Mesh(carpetGeo, mats.carpetRunner);
  carpetMesh.rotation.x = -Math.PI / 2;
  carpetMesh.position.set(0, 0.015, -48);
  scene.add(carpetMesh);
  disposables.push(carpetGeo);

  // Ceiling Vaults
  const ceilingGeo = new THREE.PlaneGeometry(36, 320);
  const ceilingMesh = new THREE.Mesh(ceilingGeo, mats.midnightMarble);
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.set(0, 16.8, -48);
  scene.add(ceilingMesh);
  disposables.push(ceilingGeo);

  // Lateral Walls
  const wallGeo = new THREE.PlaneGeometry(320, 17.5);
  const leftWall = new THREE.Mesh(wallGeo, mats.obsidianStone);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-18, 8.75, -48);
  const rightWall = new THREE.Mesh(wallGeo, mats.obsidianStone);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.set(18, 8.75, -48);
  scene.add(leftWall, rightWall);
  disposables.push(wallGeo);

  // =========================================================================
  // 02. STAGE 01: AWAKENING & DISASSEMBLED ARCHITECTURAL BLOCKS (z = 0)
  // =========================================================================
  const stage01Group = new THREE.Group();
  stage01Group.position.set(0, 0, 0);
  scene.add(stage01Group);

  const floatingBlocks: FloatingBlock[] = [];
  const blockGeo = new THREE.BoxGeometry(2.4, 1.4, 2.0);
  disposables.push(blockGeo);

  // Define 24 discrete masonry blocks forming the grand portico arch
  const blockSpecs = [
    // Left column (4 tiers)
    { rx: -5.4, ry: 0.8, rz: 0, ox: -14.2, oy: -2.4, oz: 16.5, orx: 0.45, ory: -0.65, orz: 0.3 },
    { rx: -5.4, ry: 2.4, rz: 0, ox: -12.8, oy: 1.2, oz: 14.0, orx: -0.35, ory: 0.55, orz: -0.25 },
    { rx: -5.4, ry: 4.0, rz: 0, ox: -15.5, oy: 5.6, oz: 18.2, orx: 0.55, ory: -0.4, orz: 0.5 },
    { rx: -5.4, ry: 5.6, rz: 0, ox: -11.6, oy: 9.2, oz: 12.8, orx: -0.4, ory: 0.6, orz: -0.4 },
    { rx: -5.4, ry: 7.2, rz: 0, ox: -16.0, oy: 12.0, oz: 15.0, orx: 0.6, ory: -0.5, orz: 0.35 },
    { rx: -5.4, ry: 8.8, rz: 0, ox: -13.4, oy: 14.5, oz: 11.2, orx: -0.5, ory: 0.35, orz: -0.6 },
    // Right column (4 tiers)
    { rx: 5.4, ry: 0.8, rz: 0, ox: 14.2, oy: -2.0, oz: 15.8, orx: -0.45, ory: 0.65, orz: -0.3 },
    { rx: 5.4, ry: 2.4, rz: 0, ox: 12.5, oy: 1.8, oz: 13.5, orx: 0.4, ory: -0.5, orz: 0.3 },
    { rx: 5.4, ry: 4.0, rz: 0, ox: 16.2, oy: 5.0, oz: 17.5, orx: -0.6, ory: 0.45, orz: -0.45 },
    { rx: 5.4, ry: 5.6, rz: 0, ox: 11.8, oy: 8.8, oz: 12.2, orx: 0.35, ory: -0.6, orz: 0.4 },
    { rx: 5.4, ry: 7.2, rz: 0, ox: 15.6, oy: 11.5, oz: 14.6, orx: -0.55, ory: 0.5, orz: -0.3 },
    { rx: 5.4, ry: 8.8, rz: 0, ox: 13.0, oy: 15.0, oz: 10.8, orx: 0.5, ory: -0.4, orz: 0.55 },
    // Archway Curvature (8 blocks)
    { rx: -4.5, ry: 10.4, rz: 0, ox: -11.2, oy: 16.8, oz: 13.0, orx: 0.4, ory: -0.5, orz: 0.6 },
    { rx: -3.2, ry: 11.8, rz: 0, ox: -8.5, oy: 18.2, oz: 16.4, orx: 0.3, ory: -0.7, orz: 0.45 },
    { rx: -1.6, ry: 12.8, rz: 0, ox: -4.2, oy: 19.5, oz: 18.0, orx: 0.2, ory: -0.6, orz: 0.3 },
    { rx: 0.0, ry: 13.2, rz: 0, ox: 0.0, oy: 21.0, oz: 19.5, orx: 0.7, ory: 0.0, orz: 0.0 }, // Keystone
    { rx: 1.6, ry: 12.8, rz: 0, ox: 4.2, oy: 19.5, oz: 18.0, orx: -0.2, ory: 0.6, orz: -0.3 },
    { rx: 3.2, ry: 11.8, rz: 0, ox: 8.5, oy: 18.2, oz: 16.4, orx: -0.3, ory: 0.7, orz: -0.45 },
    { rx: 4.5, ry: 10.4, rz: 0, ox: 11.2, oy: 16.8, oz: 13.0, orx: -0.4, ory: 0.5, orz: -0.6 },
    // Outer Entablature & Lintel (5 blocks)
    { rx: -6.8, ry: 12.2, rz: 0, ox: -16.5, oy: 18.0, oz: 12.5, orx: 0.5, ory: -0.3, orz: 0.4 },
    { rx: -3.8, ry: 14.0, rz: 0, ox: -9.8, oy: 22.0, oz: 15.0, orx: 0.6, ory: -0.5, orz: 0.3 },
    { rx: 0.0, ry: 14.8, rz: 0, ox: 0.0, oy: 23.5, oz: 16.8, orx: 0.8, ory: 0.0, orz: 0.0 },
    { rx: 3.8, ry: 14.0, rz: 0, ox: 9.8, oy: 22.0, oz: 15.0, orx: -0.6, ory: 0.5, orz: -0.3 },
    { rx: 6.8, ry: 12.2, rz: 0, ox: 16.5, oy: 18.0, oz: 12.5, orx: -0.5, ory: 0.3, orz: -0.4 },
  ];

  blockSpecs.forEach((spec) => {
    const mesh = new THREE.Mesh(blockGeo, mats.obsidianStone);
    mesh.castShadow = !isSoftwareGl;
    mesh.receiveShadow = !isSoftwareGl;
    stage01Group.add(mesh);
    floatingBlocks.push({
      mesh,
      restingPos: new THREE.Vector3(spec.rx, spec.ry, spec.rz),
      restingRot: new THREE.Euler(0, 0, 0),
      offsetPos: new THREE.Vector3(spec.ox, spec.oy, spec.oz),
      offsetRot: new THREE.Euler(spec.orx, spec.ory, spec.orz),
    });
  });

  // Stage 01 Luminous Seams Backlight
  const stage01Backlight = new THREE.PointLight(0xdcebff, 4.5, 45, 1.2);
  stage01Backlight.position.set(0, 8.5, -2);
  stage01Group.add(stage01Backlight);

  // Stage 01 The 5 Verified Coordinate Node Crosshairs & Lines (38, 21, 36, 32, 30)
  const nodeCoords = [
    { id: "38", x: -6.5, y: 9.2, z: 2.5 },
    { id: "21", x: -4.2, y: 4.4, z: 2.5 },
    { id: "36", x: 2.2, y: 9.8, z: 2.5 },
    { id: "32", x: 4.6, y: 14.0, z: 2.5 },
    { id: "30", x: 5.8, y: 4.6, z: 2.5 },
  ];

  const nodeGroup = new THREE.Group();
  stage01Group.add(nodeGroup);

  // Node line connections: 38-21, 38-36, 36-32, 21-30, 36-30
  const linePoints = [
    new THREE.Vector3(-6.5, 9.2, 2.5), new THREE.Vector3(-4.2, 4.4, 2.5),
    new THREE.Vector3(-6.5, 9.2, 2.5), new THREE.Vector3(2.2, 9.8, 2.5),
    new THREE.Vector3(2.2, 9.8, 2.5), new THREE.Vector3(4.6, 14.0, 2.5),
    new THREE.Vector3(-4.2, 4.4, 2.5), new THREE.Vector3(5.8, 4.6, 2.5),
    new THREE.Vector3(2.2, 9.8, 2.5), new THREE.Vector3(5.8, 4.6, 2.5),
  ];
  const nodeLineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
  const nodeLineMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });
  const nodeLines = new THREE.LineSegments(nodeLineGeo, nodeLineMat);
  nodeGroup.add(nodeLines);
  disposables.push(nodeLineGeo, nodeLineMat);

  // Add 3D text sprites for the 5 nodes
  const nodeSprites: THREE.Sprite[] = [];
  nodeCoords.forEach((node) => {
    const label = createTextSprite([node.id], {
      fontSize: 34,
      color: "#ffffff",
      align: "center",
      scale: 1.8,
    });
    label.sprite.position.set(node.x, node.y + 0.45, node.z);
    nodeGroup.add(label.sprite);
    nodeSprites.push(label.sprite);
    disposables.push({ dispose: label.dispose });

    // Tiny Crosshair indicator
    const crossGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.15, 0, 0), new THREE.Vector3(0.15, 0, 0),
      new THREE.Vector3(0, -0.15, 0), new THREE.Vector3(0, 0.15, 0),
    ]);
    const crossMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    const cross = new THREE.LineSegments(crossGeo, crossMat);
    cross.position.set(node.x, node.y, node.z);
    nodeGroup.add(cross);
    disposables.push(crossGeo, crossMat);
  });

  // =========================================================================
  // 03. STAGE 02: INNER GLOWING WIREFRAME SPHERE CORE (z = 0)
  // =========================================================================
  const innerCoreSphereGeo = new THREE.IcosahedronGeometry(3.6, 2);
  const innerCoreSphereWire = new THREE.WireframeGeometry(innerCoreSphereGeo);
  const innerCoreSphereMat = new THREE.LineBasicMaterial({
    color: 0xdcebff,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });
  const innerCoreSphere = new THREE.LineSegments(innerCoreSphereWire, innerCoreSphereMat);
  innerCoreSphere.position.set(0, 7.8, 0);
  stage01Group.add(innerCoreSphere);
  disposables.push(innerCoreSphereGeo, innerCoreSphereWire, innerCoreSphereMat);

  // =========================================================================
  // 04. STAGE 03: THE SEGMENTED RING GATE (shattered_ring) (z = -20)
  // =========================================================================
  const stage03RingGroup = new THREE.Group();
  stage03RingGroup.position.set(0, 8.4, -20);
  scene.add(stage03RingGroup);

  // Outer Segmented Stone Ring (8 arched segments)
  const outerRingSegments: THREE.Mesh[] = [];
  const outerArcGeo = new THREE.TorusGeometry(6.8, 0.38, 12, 16, Math.PI / 4.4);
  disposables.push(outerArcGeo);

  for (let s = 0; s < 8; s++) {
    const arcMesh = new THREE.Mesh(outerArcGeo, mats.obsidianStone);
    arcMesh.rotation.z = (s * Math.PI) / 4 + 0.05;
    stage03RingGroup.add(arcMesh);
    outerRingSegments.push(arcMesh);
  }

  // Inner Concentric Rotating Ring Segments
  const innerRingGroup1 = new THREE.Group();
  const innerRingGroup2 = new THREE.Group();
  stage03RingGroup.add(innerRingGroup1, innerRingGroup2);

  const innerArc1Geo = new THREE.TorusGeometry(5.2, 0.28, 10, 16, Math.PI / 3.4);
  const innerArc2Geo = new THREE.TorusGeometry(3.8, 0.22, 10, 16, Math.PI / 2.6);
  disposables.push(innerArc1Geo, innerArc2Geo);

  for (let s = 0; s < 6; s++) {
    const mesh = new THREE.Mesh(innerArc1Geo, mats.goldTrim);
    mesh.rotation.z = (s * Math.PI) / 3 + 0.08;
    innerRingGroup1.add(mesh);
  }
  for (let s = 0; s < 4; s++) {
    const mesh = new THREE.Mesh(innerArc2Geo, mats.silverMetal);
    mesh.rotation.z = (s * Math.PI) / 2 + 0.12;
    innerRingGroup2.add(mesh);
  }

  // Neon Caustic Aperture Web (ignites when aligned)
  const causticWebGeo = new THREE.IcosahedronGeometry(4.8, 1);
  const causticWebWire = new THREE.WireframeGeometry(causticWebGeo);
  const causticWebMat = new THREE.LineBasicMaterial({
    color: 0x7dbbff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const causticWebMesh = new THREE.LineSegments(causticWebWire, causticWebMat);
  stage03RingGroup.add(causticWebMesh);
  disposables.push(causticWebGeo, causticWebWire, causticWebMat);

  // Intense Perimeter Caustic Ring Light
  const causticRingGeo = new THREE.TorusGeometry(6.4, 0.08, 8, 48);
  const causticRingMat = new THREE.MeshBasicMaterial({
    color: 0xdcebff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const causticRingMesh = new THREE.Mesh(causticRingGeo, causticRingMat);
  stage03RingGroup.add(causticRingMesh);
  disposables.push(causticRingGeo, causticRingMat);

  // =========================================================================
  // 05. STAGE 04: PORTFOLIO MONOLITH CO_01 — SHADOW / III (z = -48)
  // =========================================================================
  const stage04Monolith = new THREE.Group();
  stage04Monolith.position.set(0, 6.2, -48);
  scene.add(stage04Monolith);

  // Faceted Crystalline Cube
  const mono1Geo = new THREE.DodecahedronGeometry(4.4, 0);
  const mono1Mesh = new THREE.Mesh(mono1Geo, mats.crystalGlass);
  mono1Mesh.userData = { action: "screen-shadow" };
  stage04Monolith.add(mono1Mesh);
  clickableObjects.push(mono1Mesh);
  disposables.push(mono1Geo);

  // Wireframe bounding accents
  const mono1WireGeo = new THREE.WireframeGeometry(new THREE.BoxGeometry(6.2, 7.8, 4.6));
  const mono1WireMat = new THREE.LineBasicMaterial({
    color: 0xdcebff,
    transparent: true,
    opacity: 0.45,
  });
  const mono1Wire = new THREE.LineSegments(mono1WireGeo, mono1WireMat);
  stage04Monolith.add(mono1Wire);
  disposables.push(mono1WireGeo, mono1WireMat);

  // Embedded SHADOW / III Film Plate
  const film1PlateGeo = new THREE.PlaneGeometry(4.8, 3.0);
  const film1PlateMat = new THREE.MeshStandardMaterial({
    color: 0x050810,
    emissive: 0x243b55,
    emissiveIntensity: 0.85,
    roughness: 0.2,
    metalness: 0.8,
  });
  const film1Plate = new THREE.Mesh(film1PlateGeo, film1PlateMat);
  film1Plate.userData = { action: "screen-shadow" };
  stage04Monolith.add(film1Plate);
  clickableObjects.push(film1Plate);
  disposables.push(film1PlateGeo, film1PlateMat);

  // Stage 04 Verified 3D Telemetry Sprites:
  // Top-left: PORTFOLIO | CO_01 // SHADOW / III
  const mono1TelemetryTL = createTextSprite(["PORTFOLIO | CO_01", "SHADOW / III"], {
    fontSize: 28,
    color: "#dcebff",
    scale: 4.8,
  });
  mono1TelemetryTL.sprite.position.set(-4.2, 4.4, 0.5);
  stage04Monolith.add(mono1TelemetryTL.sprite);
  disposables.push({ dispose: mono1TelemetryTL.dispose });

  // Right: TEMP 28.40 // -13.22
  const mono1TelemetryR = createTextSprite(["TEMP   28.40", "      -13.22"], {
    fontSize: 26,
    color: "#a9d4ff",
    scale: 4.2,
  });
  mono1TelemetryR.sprite.position.set(4.5, 1.2, 0.5);
  stage04Monolith.add(mono1TelemetryR.sprite);
  disposables.push({ dispose: mono1TelemetryR.dispose });

  // Bottom-right: PSYCHOLOGICAL SUSPENSE // CLICK TO SCREEN
  const mono1TelemetryBR = createTextSprite(
    ["PSYCHOLOGICAL SUSPENSE · SHORT FILM", "CLICK TO SCREEN"],
    {
      fontSize: 24,
      color: "#c6a875",
      underlineLastLine: true,
      scale: 5.4,
    },
  );
  mono1TelemetryBR.sprite.position.set(2.4, -4.2, 0.5);
  stage04Monolith.add(mono1TelemetryBR.sprite);
  disposables.push({ dispose: mono1TelemetryBR.dispose });

  // Leader hairline line connecting top-left text to crystal vertex
  const leader1Geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-2.8, 3.8, 0.5),
    new THREE.Vector3(-1.8, 3.2, 0.2),
  ]);
  const leader1Mat = new THREE.LineBasicMaterial({ color: 0xdcebff, transparent: true, opacity: 0.65 });
  const leader1Line = new THREE.Line(leader1Geo, leader1Mat);
  stage04Monolith.add(leader1Line);
  disposables.push(leader1Geo, leader1Mat);

  // =========================================================================
  // 06. STAGE 05: PORTFOLIO MONOLITH CO_02 — CHAKRA (z = -74)
  // =========================================================================
  const stage05Monolith = new THREE.Group();
  stage05Monolith.position.set(0, 6.2, -74);
  scene.add(stage05Monolith);

  // Second Rough-Hewn Crystalline Monolith
  const mono2Geo = new THREE.CylinderGeometry(3.6, 4.0, 7.8, 8);
  const mono2Mesh = new THREE.Mesh(mono2Geo, mats.obsidianStone);
  mono2Mesh.userData = { action: "screen-chakra" };
  stage05Monolith.add(mono2Mesh);
  clickableObjects.push(mono2Mesh);
  disposables.push(mono2Geo);

  const mono2WireGeo = new THREE.WireframeGeometry(mono2Geo);
  const mono2Wire = new THREE.LineSegments(mono2WireGeo, mono1WireMat);
  stage05Monolith.add(mono2Wire);
  disposables.push(mono2WireGeo);

  // Embedded CHAKRA Film Plate
  const film2PlateGeo = new THREE.PlaneGeometry(4.8, 2.7);
  const film2PlateMat = new THREE.MeshStandardMaterial({
    color: 0x080a12,
    emissive: 0x4a3b1a,
    emissiveIntensity: 0.85,
    roughness: 0.25,
    metalness: 0.8,
  });
  const film2Plate = new THREE.Mesh(film2PlateGeo, film2PlateMat);
  film2Plate.userData = { action: "screen-chakra" };
  stage05Monolith.add(film2Plate);
  clickableObjects.push(film2Plate);
  disposables.push(film2PlateGeo, film2PlateMat);

  // Stage 05 Verified 3D Telemetry Sprites:
  // Top-left: PORTFOLIO_CO_02 // CHAKRA
  const mono2TelemetryTL = createTextSprite(["PORTFOLIO_CO_02", "CHAKRA"], {
    fontSize: 28,
    color: "#dcebff",
    scale: 4.8,
  });
  mono2TelemetryTL.sprite.position.set(-4.2, 4.4, 0.5);
  stage05Monolith.add(mono2TelemetryTL.sprite);
  disposables.push({ dispose: mono2TelemetryTL.dispose });

  // Right: TEMP 30.08 // -01.07
  const mono2TelemetryR = createTextSprite(["TEMP   30.08", "      -01.07"], {
    fontSize: 26,
    color: "#a9d4ff",
    scale: 4.2,
  });
  mono2TelemetryR.sprite.position.set(4.5, 1.2, 0.5);
  stage05Monolith.add(mono2TelemetryR.sprite);
  disposables.push({ dispose: mono2TelemetryR.dispose });

  // Bottom-right: SILENT THRILLER // CLICK TO SCREEN
  const mono2TelemetryBR = createTextSprite(
    ["SILENT THRILLER · SHORT FILM", "CLICK TO SCREEN"],
    {
      fontSize: 24,
      color: "#c6a875",
      underlineLastLine: true,
      scale: 5.4,
    },
  );
  mono2TelemetryBR.sprite.position.set(2.4, -4.2, 0.5);
  stage05Monolith.add(mono2TelemetryBR.sprite);
  disposables.push({ dispose: mono2TelemetryBR.dispose });

  // =========================================================================
  // 07. STAGE 06: SUBTERRANEAN CIRCULAR STEPPED DAIS & TERMINAL LINKS (z = -108)
  // =========================================================================
  const stage06DaisGroup = new THREE.Group();
  stage06DaisGroup.position.set(0, 0, -108);
  scene.add(stage06DaisGroup);

  // 3 Concentric Stepped Circular Tiers
  const tierRadii = [8.8, 6.4, 4.2];
  tierRadii.forEach((radius, idx) => {
    const tierGeo = new THREE.CylinderGeometry(radius, radius + 0.2, 0.35, 48);
    const tierMesh = new THREE.Mesh(tierGeo, idx === 1 ? mats.silverMetal : mats.obsidianStone);
    tierMesh.position.y = 0.18 + idx * 0.35;
    stage06DaisGroup.add(tierMesh);
    disposables.push(tierGeo);

    // Glowing Floor Ring in the step groove
    const ringLightGeo = new THREE.TorusGeometry(radius - 0.05, 0.045, 8, 48);
    const ringLightMat = new THREE.MeshBasicMaterial({
      color: 0x7dbbff,
      transparent: true,
      opacity: 0.85,
    });
    const ringLight = new THREE.Mesh(ringLightGeo, ringLightMat);
    ringLight.rotation.x = Math.PI / 2;
    ringLight.position.y = 0.38 + idx * 0.35;
    stage06DaisGroup.add(ringLight);
    disposables.push(ringLightGeo, ringLightMat);
  });

  // Overhead Circular Luminaire Halo
  const haloGeo = new THREE.TorusGeometry(5.2, 0.16, 10, 48);
  const haloMesh = new THREE.Mesh(haloGeo, mats.goldTrim);
  haloMesh.rotation.x = Math.PI / 2;
  haloMesh.position.y = 13.5;
  stage06DaisGroup.add(haloMesh);
  disposables.push(haloGeo);

  // Downward Conical Light Beam
  const daisBeamGeo = new THREE.CylinderGeometry(5.1, 8.6, 13.2, 32, 1, true);
  const daisBeamMat = new THREE.MeshBasicMaterial({
    color: 0xdcebff,
    transparent: true,
    opacity: 0.065,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const daisBeam = new THREE.Mesh(daisBeamGeo, daisBeamMat);
  daisBeam.position.y = 6.8;
  stage06DaisGroup.add(daisBeam);
  disposables.push(daisBeamGeo, daisBeamMat);

  // Center Stippled 3D Particle Hologram (Cinema Emblem)
  const holoPointCount = 220;
  const holoPositions = new Float32Array(holoPointCount * 3);
  for (let i = 0; i < holoPointCount; i++) {
    const angle = (i / holoPointCount) * Math.PI * 4;
    const r = 1.2 + Math.sin(i * 0.5) * 0.4;
    holoPositions[i * 3] = Math.cos(angle) * r;
    holoPositions[i * 3 + 1] = 2.8 + (i / holoPointCount) * 2.2;
    holoPositions[i * 3 + 2] = Math.sin(angle) * r;
  }
  const holoGeo = new THREE.BufferGeometry();
  holoGeo.setAttribute("position", new THREE.BufferAttribute(holoPositions, 3));
  const holoMat = new THREE.PointsMaterial({
    size: 0.18,
    color: 0x7dbbff,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const holoPoints = new THREE.Points(holoGeo, holoMat);
  stage06DaisGroup.add(holoPoints);
  disposables.push(holoGeo, holoMat);

  // Stage 06 Terminal Links on Front Step
  // Left: [ Filmmaking Institute ]
  const linkInstitute = createTextSprite(["[ Filmmaking Institute ]"], {
    fontSize: 26,
    color: "#a9d4ff",
    scale: 3.8,
    align: "center",
  });
  linkInstitute.sprite.position.set(-4.6, 1.8, 7.2);
  linkInstitute.sprite.userData = { action: "goto-institute" };
  stage06DaisGroup.add(linkInstitute.sprite);
  clickableObjects.push(linkInstitute.sprite);
  disposables.push({ dispose: linkInstitute.dispose });

  // Center: [ ZEE AI Core ] (active bracket frame)
  const linkZee = createTextSprite(["[ ZEE AI Core ]"], {
    fontSize: 30,
    color: "#ffffff",
    border: true,
    scale: 4.4,
    align: "center",
  });
  linkZee.sprite.position.set(0, 1.9, 7.6);
  linkZee.sprite.userData = { action: "summon-zee" };
  stage06DaisGroup.add(linkZee.sprite);
  clickableObjects.push(linkZee.sprite);
  disposables.push({ dispose: linkZee.dispose });

  // Right: [ Contact Sanctuary ]
  const linkContact = createTextSprite(["[ Contact Sanctuary ]"], {
    fontSize: 26,
    color: "#a9d4ff",
    scale: 3.8,
    align: "center",
  });
  linkContact.sprite.position.set(4.6, 1.8, 7.2);
  linkContact.sprite.userData = { action: "goto-contact" };
  stage06DaisGroup.add(linkContact.sprite);
  clickableObjects.push(linkContact.sprite);
  disposables.push({ dispose: linkContact.dispose });

  // =========================================================================
  // 08. STAGE 07: CELESTIAL STARS & SUMMIT EXIT
  // =========================================================================
  const starCount = 350;
  const starPositions = new Float32Array(starCount * 3);
  for (let s = 0; s < starCount; s++) {
    starPositions[s * 3] = (Math.random() - 0.5) * 54;
    starPositions[s * 3 + 1] = 0.5 + Math.random() * 32;
    starPositions[s * 3 + 2] = -140 - Math.random() * 80;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({
    size: 0.32,
    color: 0xdcebff,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const starPoints = new THREE.Points(starGeo, starMat);
  scene.add(starPoints);
  disposables.push(starGeo, starMat);

  // Atmospheric Dust
  const dustCount = 320;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 32;
    dustPositions[i * 3 + 1] = 0.5 + Math.random() * 16;
    dustPositions[i * 3 + 2] = 50 - Math.random() * 220;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 0.22,
    map: mats.dustTexture,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    color: 0xa9d4ff,
  });
  const dustPoints = new THREE.Points(dustGeo, dustMat);
  scene.add(dustPoints);
  disposables.push(dustGeo, dustMat);

  // Volumetric Moonlight Shafts
  const beamGeo = new THREE.ConeGeometry(2.8, 20, 16, 1, true);
  const beamMeshes: THREE.Mesh[] = [];
  const beamZOffsets = [36, 18, -16, -42, -72, -98, -126];
  beamZOffsets.forEach((z, idx) => {
    const beamMat = new THREE.MeshBasicMaterial({
      color: idx % 2 === 0 ? 0x7dbbff : 0xc6a875,
      transparent: true,
      opacity: 0.055,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(idx % 2 === 0 ? -3.2 : 3.2, 8.5, z);
    beam.rotation.z = idx % 2 === 0 ? -0.35 : 0.35;
    scene.add(beam);
    beamMeshes.push(beam);
    disposables.push(beamMat);
  });
  disposables.push(beamGeo);

  // Legacy compatibility groups
  const heroMonoliths: THREE.Group[] = [];
  const filmMonoliths: THREE.Group[] = [stage04Monolith, stage05Monolith];
  const wireframeGroup = nodeGroup;
  const portalRingGroup = stage03RingGroup;
  const zeeCoreGroup = stage06DaisGroup;
  const astrolabeGroup = new THREE.Group();
  const chandelierGroup = new THREE.Group();

  const updateBeams = (intensity: number, elapsed: number) => {
    beamMeshes.forEach((beam, idx) => {
      const mat = beam.material as THREE.MeshBasicMaterial;
      const sway = Math.sin(elapsed * 0.42 + idx * 1.1) * 0.015;
      mat.opacity = Math.max(0.025, Math.min(0.12, (0.052 + sway) * intensity));
    });
  };

  const updateOpening = (shot: OpeningShotState | null, elapsed: number) => {
    // Stage 01 lighting pulsation
    stage01Backlight.intensity = 3.8 + Math.sin(elapsed * 1.8) * 0.6;
  };

  const updateScrollScene = (
    scrollProgress: number,
    elapsed: number,
    pointerX = 0,
    pointerY = 0,
  ) => {
    const p = THREE.MathUtils.clamp(scrollProgress, 0, 1);

    // =======================================================================
    // STAGE 01 (0.00 – 0.15): MECHANICAL ASSEMBLY OF PORTICO BLOCKS
    // =======================================================================
    if (p <= 0.15) {
      const assembleRatio = p / 0.15;
      const smoothT = assembleRatio * assembleRatio * (3 - 2 * assembleRatio);

      floatingBlocks.forEach((fb) => {
        fb.mesh.position.lerpVectors(fb.offsetPos, fb.restingPos, smoothT);
        fb.mesh.rotation.x = fb.offsetRot.x * (1 - smoothT);
        fb.mesh.rotation.y = fb.offsetRot.y * (1 - smoothT);
        fb.mesh.rotation.z = fb.offsetRot.z * (1 - smoothT);
      });

      // Node lines & numbers fade out as blocks assemble
      const nodeFade = 1 - smoothT;
      nodeLineMat.opacity = 0.9 * nodeFade;
      nodeSprites.forEach((sp) => {
        (sp.material as THREE.SpriteMaterial).opacity = nodeFade;
      });
      innerCoreSphereMat.opacity = 0;
    } else if (p <= 0.28) {
      // =======================================================================
      // STAGE 02 (0.15 – 0.28): RADIAL DISPERSAL REVEALING INNER SPHERE CORE
      // =======================================================================
      const disperseRatio = (p - 0.15) / (0.28 - 0.15);
      const smoothD = disperseRatio * disperseRatio * (3 - 2 * disperseRatio);

      floatingBlocks.forEach((fb) => {
        const dirX = Math.sign(fb.restingPos.x) || 1;
        fb.mesh.position.x = fb.restingPos.x + dirX * smoothD * 12.0;
        fb.mesh.position.y = fb.restingPos.y + smoothD * 6.5;
        fb.mesh.position.z = fb.restingPos.z - smoothD * 8.0;
        fb.mesh.rotation.z = smoothD * dirX * 0.45;
      });

      nodeLineMat.opacity = 0;
      nodeSprites.forEach((sp) => {
        (sp.material as THREE.SpriteMaterial).opacity = 0;
      });

      // Reveal inner wireframe sphere core (matching step_30.png)
      innerCoreSphereMat.opacity = smoothD * 0.85;
      innerCoreSphere.rotation.y += 0.015;
      innerCoreSphere.rotation.x = Math.sin(elapsed * 0.8) * 0.12;
    } else {
      // Hidden once past portal
      nodeLineMat.opacity = 0;
      innerCoreSphereMat.opacity = 0;
    }

    // =======================================================================
    // STAGE 03 (0.28 – 0.42): SEGMENTED RING ROTATIONAL ALIGNMENT & CAUSTICS
    // =======================================================================
    const alignP = THREE.MathUtils.clamp((p - 0.28) / (0.38 - 0.28), 0, 1);
    const smoothAlign = alignP * alignP * (3 - 2 * alignP);
    const unalignedAngle1 = (1 - smoothAlign) * 1.35;
    const unalignedAngle2 = (1 - smoothAlign) * -1.6;

    innerRingGroup1.rotation.x = unalignedAngle1;
    innerRingGroup1.rotation.y = -unalignedAngle1 * 0.65;
    innerRingGroup2.rotation.x = unalignedAngle2;
    innerRingGroup2.rotation.y = -unalignedAngle2 * 0.72;

    // Outer ring idle breath
    outerRingSegments.forEach((seg, idx) => {
      seg.position.z = Math.sin(elapsed * 0.8 + idx) * 0.08;
    });

    // Caustic web & perimeter flare burst on alignment
    if (smoothAlign > 0.75) {
      const flareBurst = (smoothAlign - 0.75) / 0.25;
      causticWebMat.opacity = flareBurst * 0.75;
      causticRingMat.opacity = flareBurst * 0.88;
      causticWebMesh.rotation.z = elapsed * 0.15;
    } else {
      causticWebMat.opacity = 0;
      causticRingMat.opacity = 0;
    }

    // =======================================================================
    // STAGE 04 (0.42 – 0.60): PORTFOLIO MONOLITH CO_01 (SHADOW / III)
    // =======================================================================
    mono1Mesh.rotation.y = 0.22 + Math.sin(elapsed * 0.6) * 0.08 + pointerX * 0.35;
    mono1Mesh.rotation.x = -pointerY * 0.22;
    mono1Wire.rotation.y = mono1Mesh.rotation.y;
    mono1Wire.rotation.x = mono1Mesh.rotation.x;

    // =======================================================================
    // STAGE 05 (0.60 – 0.80): PORTFOLIO MONOLITH CO_02 (CHAKRA)
    // =======================================================================
    mono2Mesh.rotation.y = -0.22 + Math.cos(elapsed * 0.6) * 0.08 + pointerX * 0.35;
    mono2Mesh.rotation.x = -pointerY * 0.22;
    mono2Wire.rotation.y = mono2Mesh.rotation.y;
    mono2Wire.rotation.x = mono2Mesh.rotation.x;

    // =======================================================================
    // STAGE 06 (0.80 – 0.92): CIRCULAR DAIS HOLOGRAM & TERMINAL LINKS
    // =======================================================================
    holoPoints.rotation.y = elapsed * 0.45;
    holoMat.opacity = 0.75 + Math.sin(elapsed * 2.2) * 0.15;

    // =======================================================================
    // STAGE 07 (0.92 – 1.00): SEAMLESS RETURN
    // =======================================================================
    if (p > 0.94) {
      // Seamlessly bring back Stage 01 blocks as camera ascends back
      const returnRatio = (p - 0.94) / 0.06;
      floatingBlocks.forEach((fb) => {
        fb.mesh.position.lerpVectors(fb.restingPos, fb.offsetPos, returnRatio * 0.3);
      });
    }
  };

  return {
    disposables,
    dustPoints,
    beamMeshes,
    heroMonoliths,
    filmMonoliths,
    wireframeGroup,
    portalRingGroup,
    zeeCoreGroup,
    astrolabeGroup,
    chandelierGroup,
    clickableObjects,
    stage01Group,
    stage03RingGroup,
    stage04Monolith,
    stage05Monolith,
    stage06DaisGroup,
    updateBeams,
    updateOpening,
    updateScrollScene,
  };
}
