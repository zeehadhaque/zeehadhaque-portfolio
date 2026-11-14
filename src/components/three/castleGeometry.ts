import * as THREE from "three";
import { createPalaceMaterials } from "./palaceMaterials";
import type { OpeningShotState } from "../../utils/castleConfig";

export interface CastleProceduralAssets {
  disposables: Array<{ dispose: () => void }>;
  dustPoints: THREE.Points;
  beamMeshes: THREE.Mesh[];
  heroMonoliths: THREE.Group[];
  astrolabeGroup: THREE.Group;
  chandelierGroup: THREE.Group;
  updateBeams: (intensity: number, elapsed: number) => void;
  updateOpening: (shot: OpeningShotState | null, elapsed: number) => void;
}

function createVaultedRibGeometry(spanX: number, apexY: number): THREE.ExtrudeGeometry {
  const outerW = spanX * 0.54;
  const innerW = spanX * 0.45;
  const springY = apexY * 0.54;
  const innerApexY = apexY * 0.88;

  const shape = new THREE.Shape();
  shape.moveTo(-outerW, 0);
  shape.lineTo(-outerW, springY);
  shape.quadraticCurveTo(-outerW * 0.72, apexY * 0.9, 0, apexY);
  shape.quadraticCurveTo(outerW * 0.72, apexY * 0.9, outerW, springY);
  shape.lineTo(outerW, 0);
  shape.lineTo(innerW, 0);
  shape.lineTo(innerW, springY);
  shape.quadraticCurveTo(innerW * 0.68, innerApexY * 0.88, 0, innerApexY);
  shape.quadraticCurveTo(-innerW * 0.68, innerApexY * 0.88, -innerW, springY);
  shape.lineTo(-innerW, 0);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.82,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  });
  geo.center();
  return geo;
}

function buildCinemaRelicGroup(options: {
  obsidianMat: THREE.Material;
  metalMat: THREE.Material;
  goldMat: THREE.Material;
  glassMat: THREE.Material;
  glowMat: THREE.Material;
  scale?: number;
}): THREE.Group {
  const group = new THREE.Group();
  group.scale.setScalar(options.scale ?? 1);

  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 1.05, 0.85, 16),
    options.obsidianMat,
  );
  barrel.rotation.x = Math.PI / 2;
  group.add(barrel);

  const gearRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.06, 0.075, 10, 32),
    options.goldMat,
  );
  gearRing.position.z = 0.22;
  group.add(gearRing);

  const rearRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.98, 0.055, 10, 32),
    options.metalMat,
  );
  rearRing.position.z = -0.35;
  group.add(rearRing);

  const lensGlass = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.45),
    options.glassMat,
  );
  lensGlass.rotation.x = Math.PI / 2;
  lensGlass.position.z = 0.18;
  group.add(lensGlass);

  const innerCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.32, 0),
    options.glowMat,
  );
  group.add(innerCore);

  const outerHalo = new THREE.Mesh(
    new THREE.TorusGeometry(1.48, 0.025, 8, 44),
    options.glowMat,
  );
  outerHalo.rotation.x = Math.PI * 0.22;
  outerHalo.rotation.y = Math.PI * 0.18;
  group.add(outerHalo);

  return group;
}

function buildSculpturalChandelier(options: {
  goldMat: THREE.Material;
  silverMat: THREE.Material;
  glassMat: THREE.Material;
}): THREE.Group {
  const group = new THREE.Group();

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.09, 5.2, 10),
    options.goldMat,
  );
  stem.position.y = 2.6;
  group.add(stem);

  const rings = [
    { radius: 5.2, y: 0.4, tube: 0.085, mat: options.goldMat },
    { radius: 3.6, y: -0.65, tube: 0.07, mat: options.silverMat },
    { radius: 2.1, y: -1.55, tube: 0.06, mat: options.goldMat },
  ];
  rings.forEach((ring) => {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(ring.radius, ring.tube, 10, 48),
      ring.mat,
    );
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = ring.y;
    group.add(mesh);
  });

  // Ring of crystalline prism drops on outer tier
  const dropGeo = new THREE.OctahedronGeometry(0.24, 0);
  for (let i = 0; i < 16; i += 1) {
    const angle = (i / 16) * Math.PI * 2;
    const drop = new THREE.Mesh(dropGeo, options.glassMat);
    drop.position.set(Math.cos(angle) * 5.2, -0.05, Math.sin(angle) * 5.2);
    drop.scale.set(0.8, 1.8, 0.8);
    group.add(drop);
  }

  return group;
}

function buildGrandAstrolabe(options: {
  obsidianMat: THREE.Material;
  goldMat: THREE.Material;
  glowMat: THREE.Material;
}): THREE.Group {
  const group = new THREE.Group();

  const spireTop = new THREE.Mesh(
    new THREE.ConeGeometry(0.32, 1.6, 8),
    options.obsidianMat,
  );
  spireTop.position.y = 2.2;
  group.add(spireTop);

  const spireBottom = new THREE.Mesh(
    new THREE.ConeGeometry(0.28, 1.4, 8),
    options.obsidianMat,
  );
  spireBottom.rotation.x = Math.PI;
  spireBottom.position.y = -2.2;
  group.add(spireBottom);

  const ringA = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.045, 10, 52),
    options.goldMat,
  );
  ringA.rotation.x = Math.PI / 3;
  group.add(ringA);

  const ringB = new THREE.Mesh(
    new THREE.TorusGeometry(1.9, 0.038, 10, 44),
    options.glowMat,
  );
  ringB.rotation.y = Math.PI / 4;
  group.add(ringB);

  const prism = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.5, 0),
    options.glowMat,
  );
  group.add(prism);

  return group;
}

export function buildCastleScene(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean,
): CastleProceduralAssets {
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const mats = createPalaceMaterials(maxAniso, isSoftwareGl);
  const disposables: Array<{ dispose: () => void }> = [...mats.disposables];
  const dummy = new THREE.Object3D();

  // =========================================================================
  // 01. CONTINUOUS REFLECTIVE MARBLE FLOOR PLANE & BURGUNDY RUNNER
  // =========================================================================
  const floorGeo = new THREE.PlaneGeometry(72, 270, 1, 1);
  const floorMesh = new THREE.Mesh(floorGeo, mats.floorMarble);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0, -25);
  floorMesh.receiveShadow = !isSoftwareGl;
  scene.add(floorMesh);

  const runnerGeo = new THREE.BoxGeometry(5.2, 0.045, 224);
  const runnerMesh = new THREE.Mesh(runnerGeo, mats.carpetRunner);
  runnerMesh.position.set(0, 0.024, -36);
  scene.add(runnerMesh);

  const trimRailGeo = new THREE.BoxGeometry(0.08, 0.06, 224);
  const leftTrim = new THREE.Mesh(trimRailGeo, mats.goldTrim);
  leftTrim.position.set(-2.65, 0.032, -36);
  const rightTrim = new THREE.Mesh(trimRailGeo, mats.goldTrim);
  rightTrim.position.set(2.65, 0.032, -36);
  scene.add(leftTrim, rightTrim);
  disposables.push(floorGeo, runnerGeo, trimRailGeo);

  // =========================================================================
  // 02. ZONE A — MONUMENTAL PALACE EXTERIOR FACADE, STEPS & HINGED DOORS
  // =========================================================================
  const stepGeo = new THREE.BoxGeometry(36, 0.34, 1.8);
  const stepCount = 6;
  const stepInst = new THREE.InstancedMesh(stepGeo, mats.obsidianStone, stepCount);
  for (let i = 0; i < stepCount; i += 1) {
    dummy.position.set(0, 0.17 + i * 0.28, 70 - i * 1.9);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(1 - i * 0.03, 1, 1);
    dummy.updateMatrix();
    stepInst.setMatrixAt(i, dummy.matrix);
  }
  stepInst.instanceMatrix.needsUpdate = true;
  stepInst.computeBoundingSphere();
  scene.add(stepInst);
  disposables.push(stepGeo);

  // Exterior Portico Colonnade (10 towering fluted columns framing the facade at z = 56.5)
  const porticoColGeo = new THREE.CylinderGeometry(0.68, 0.85, 16.5, 14);
  const porticoCapGeo = new THREE.BoxGeometry(2.1, 0.65, 2.1);
  const porticoX = [-19.5, -14.5, -9.5, -4.8, 4.8, 9.5, 14.5, 19.5];
  const porticoCols = new THREE.InstancedMesh(
    porticoColGeo,
    mats.midnightMarble,
    porticoX.length,
  );
  const porticoCaps = new THREE.InstancedMesh(
    porticoCapGeo,
    mats.goldTrim,
    porticoX.length,
  );
  porticoX.forEach((x, i) => {
    dummy.position.set(x, 9.8, 56.8);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    porticoCols.setMatrixAt(i, dummy.matrix);
    dummy.position.set(x, 18.2, 56.8);
    dummy.updateMatrix();
    porticoCaps.setMatrixAt(i, dummy.matrix);
  });
  porticoCols.instanceMatrix.needsUpdate = true;
  porticoCaps.instanceMatrix.needsUpdate = true;
  porticoCols.computeBoundingSphere();
  porticoCaps.computeBoundingSphere();
  scene.add(porticoCols, porticoCaps);
  disposables.push(porticoColGeo, porticoCapGeo);

  // Monumental Pediment Entablature & Solid Facade Jambs flanking gateway
  const friezeGeo = new THREE.BoxGeometry(46, 3.8, 3.2);
  const friezeMesh = new THREE.Mesh(friezeGeo, mats.obsidianStone);
  friezeMesh.position.set(0, 20.4, 55.2);
  const friezeGoldGeo = new THREE.BoxGeometry(46.2, 0.25, 3.3);
  const friezeGold = new THREE.Mesh(friezeGoldGeo, mats.goldTrim);
  friezeGold.position.set(0, 18.55, 55.2);

  const wallJambGeo = new THREE.BoxGeometry(16, 17, 2.4);
  const leftFacadeWall = new THREE.Mesh(wallJambGeo, mats.obsidianStone);
  leftFacadeWall.position.set(-12.2, 10.0, 53.2);
  const rightFacadeWall = new THREE.Mesh(wallJambGeo, mats.obsidianStone);
  rightFacadeWall.position.set(12.2, 10.0, 53.2);

  const lintelGeo = new THREE.BoxGeometry(9.6, 5.2, 2.5);
  const portalLintel = new THREE.Mesh(lintelGeo, mats.obsidianStone);
  portalLintel.position.set(0, 15.8, 53.2);
  scene.add(friezeMesh, friezeGold, leftFacadeWall, rightFacadeWall, portalLintel);
  disposables.push(friezeGeo, friezeGoldGeo, wallJambGeo, lintelGeo);

  // Oversized Pivoting Double Exterior Cinema Palace Doors
  const doorGeo = new THREE.BoxGeometry(4.1, 12.2, 0.42);
  const doorTrimGeo = new THREE.BoxGeometry(3.6, 11.4, 0.5);
  const leftDoorPivot = new THREE.Group();
  leftDoorPivot.position.set(-4.15, 7.6, 53.2);
  const leftDoorPanel = new THREE.Mesh(doorGeo, mats.obsidianStone);
  leftDoorPanel.position.set(2.05, 0, 0);
  const leftDoorBrass = new THREE.Mesh(doorTrimGeo, mats.goldTrim);
  leftDoorBrass.position.set(2.05, 0, 0);
  leftDoorBrass.scale.set(0.14, 0.96, 1.05);
  leftDoorPivot.add(leftDoorPanel, leftDoorBrass);

  const rightDoorPivot = new THREE.Group();
  rightDoorPivot.position.set(4.15, 7.6, 53.2);
  const rightDoorPanel = new THREE.Mesh(doorGeo, mats.obsidianStone);
  rightDoorPanel.position.set(-2.05, 0, 0);
  const rightDoorBrass = new THREE.Mesh(doorTrimGeo, mats.goldTrim);
  rightDoorBrass.position.set(-2.05, 0, 0);
  rightDoorBrass.scale.set(0.14, 0.96, 1.05);
  rightDoorPivot.add(rightDoorPanel, rightDoorBrass);
  scene.add(leftDoorPivot, rightDoorPivot);
  disposables.push(doorGeo, doorTrimGeo);

  // Twin Moving Exterior Searchlights
  const searchlightGeo = new THREE.ConeGeometry(4.2, 34, 16, 1, true);
  const searchlightMat = new THREE.MeshBasicMaterial({
    color: 0xa9d4ff,
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const searchlightL = new THREE.Mesh(searchlightGeo, searchlightMat);
  searchlightL.position.set(-14, 15, 62);
  searchlightL.rotation.z = 0.28;
  const searchlightR = new THREE.Mesh(searchlightGeo, searchlightMat);
  searchlightR.position.set(14, 15, 62);
  searchlightR.rotation.z = -0.28;
  scene.add(searchlightL, searchlightR);
  disposables.push(searchlightGeo, searchlightMat);

  // =========================================================================
  // 03. ZONE B — TRIPLE-HEIGHT GRAND FOYER (z: +52 .. +10)
  // =========================================================================
  const stairGeo = new THREE.BoxGeometry(5.5, 0.42, 1.6);
  const stairFlights = 18;
  const stairInst = new THREE.InstancedMesh(
    stairGeo,
    mats.midnightMarble,
    stairFlights * 2,
  );
  for (let i = 0; i < stairFlights; i += 1) {
    const progress = i / stairFlights;
    const stepY = 0.4 + progress * 8.2;
    const stepZ = 44 - progress * 22;
    const stepX = 9.5 + Math.sin(progress * Math.PI * 0.6) * 4.5;

    dummy.position.set(-stepX, stepY, stepZ);
    dummy.rotation.set(0, -0.18, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    stairInst.setMatrixAt(i * 2, dummy.matrix);

    dummy.position.set(stepX, stepY, stepZ);
    dummy.rotation.set(0, 0.18, 0);
    dummy.updateMatrix();
    stairInst.setMatrixAt(i * 2 + 1, dummy.matrix);
  }
  stairInst.instanceMatrix.needsUpdate = true;
  stairInst.computeBoundingSphere();
  scene.add(stairInst);
  disposables.push(stairGeo);

  // Foyer Upper Mezzanine Balconies
  const balconyDeckGeo = new THREE.BoxGeometry(4.6, 0.6, 36);
  const balconyRailGeo = new THREE.BoxGeometry(0.14, 1.1, 36);
  [-1, 1].forEach((side) => {
    const deck = new THREE.Mesh(balconyDeckGeo, mats.obsidianStone);
    deck.position.set(side * 12.6, 8.6, 32);
    const rail = new THREE.Mesh(balconyRailGeo, mats.goldTrim);
    rail.position.set(side * 10.4, 9.45, 32);
    scene.add(deck, rail);
  });
  disposables.push(balconyDeckGeo, balconyRailGeo);

  // Sculptural Chandelier in Foyer Center
  const chandelierGroup = buildSculpturalChandelier({
    goldMat: mats.goldTrim,
    silverMat: mats.silverMetal,
    glassMat: mats.crystalGlass,
  });
  chandelierGroup.position.set(0, 14.6, 32);
  scene.add(chandelierGroup);

  // =========================================================================
  // 04. ZONE C — GIGANTIC IMAX AUDITORIUM (z: +10 .. -64)
  // =========================================================================
  // 192 Tiered Burgundy Velvet Cinema Seats in ONE InstancedMesh
  const seatRows = 12;
  const seatColsPerSide = 8;
  const totalSeats = seatRows * seatColsPerSide * 2;
  const seatGeo = new THREE.BoxGeometry(1.18, 1.05, 0.95);
  const seatInst = new THREE.InstancedMesh(seatGeo, mats.velvetBurgundy, totalSeats);
  let seatIdx = 0;
  for (let r = 0; r < seatRows; r += 1) {
    const rowZ = -2 - r * 3.4;
    const rowY = 3.2 - r * 0.24; // Tiered stadium rise toward rear
    for (const side of [-1, 1]) {
      for (let c = 0; c < seatColsPerSide; c += 1) {
        const seatX = side * (3.6 + c * 1.48);
        dummy.position.set(seatX, rowY, rowZ);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        seatInst.setMatrixAt(seatIdx, dummy.matrix);
        seatIdx += 1;
      }
    }
  }
  seatInst.instanceMatrix.needsUpdate = true;
  seatInst.computeBoundingSphere();
  scene.add(seatInst);
  disposables.push(seatGeo);

  // Curved / Stepped Auditorium Side Balcony Tiers
  const audBalconyGeo = new THREE.BoxGeometry(3.2, 0.65, 52);
  const audRailGeo = new THREE.BoxGeometry(0.14, 0.95, 52);
  [-1, 1].forEach((side) => {
    [7.4, 12.6].forEach((tierY) => {
      const bMesh = new THREE.Mesh(audBalconyGeo, mats.midnightMarble);
      bMesh.position.set(side * 16.2, tierY, -24);
      const rMesh = new THREE.Mesh(audRailGeo, mats.goldTrim);
      rMesh.position.set(side * 14.65, tierY + 0.8, -24);
      scene.add(bMesh, rMesh);
    });
  });
  disposables.push(audBalconyGeo, audRailGeo);

  // Coffered Auditorium Vaulted Ceiling Ribs
  const audRibGeo = createVaultedRibGeometry(34, 21);
  const audRibCount = 9;
  const audRibs = new THREE.InstancedMesh(
    audRibGeo,
    mats.obsidianStone,
    audRibCount,
  );
  for (let i = 0; i < audRibCount; i += 1) {
    dummy.position.set(0, 0, 6 - i * 7.2);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    audRibs.setMatrixAt(i, dummy.matrix);
  }
  audRibs.instanceMatrix.needsUpdate = true;
  audRibs.computeBoundingSphere();
  scene.add(audRibs);
  disposables.push(audRibGeo);

  // Monumental 2.39:1 IMAX Silver Screen at z = -58 + Gold Proscenium Frame
  const screenGeo = new THREE.PlaneGeometry(31, 13.0);
  const screenMesh = new THREE.Mesh(screenGeo, mats.screenSurface);
  screenMesh.position.set(0, 8.8, -58);

  const prosceniumFrameGeo = new THREE.BoxGeometry(33.2, 0.65, 1.2);
  const frameTop = new THREE.Mesh(prosceniumFrameGeo, mats.goldTrim);
  frameTop.position.set(0, 15.65, -57.7);
  const frameBottom = new THREE.Mesh(prosceniumFrameGeo, mats.goldTrim);
  frameBottom.position.set(0, 2.0, -57.7);
  scene.add(screenMesh, frameTop, frameBottom);
  disposables.push(screenGeo, prosceniumFrameGeo);

  // Animated Parting Deep Velvet Burgundy Curtains flanking the IMAX Screen
  const curtainGeo = new THREE.BoxGeometry(16, 14.2, 0.7);
  const leftCurtain = new THREE.Mesh(curtainGeo, mats.velvetBurgundy);
  leftCurtain.position.set(-15.5, 8.8, -57.1);
  const rightCurtain = new THREE.Mesh(curtainGeo, mats.velvetBurgundy);
  rightCurtain.position.set(15.5, 8.8, -57.1);
  scene.add(leftCurtain, rightCurtain);
  disposables.push(curtainGeo);

  // Projector Light Cone from Rear Projection Booth (z = 6, y = 14) toward the IMAX Screen
  const projConeGeo = new THREE.CylinderGeometry(0.45, 9.5, 62, 18, 1, true);
  const projConeMat = new THREE.MeshBasicMaterial({
    color: 0xa9d4ff,
    transparent: true,
    opacity: 0.065,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const projCone = new THREE.Mesh(projConeGeo, projConeMat);
  projCone.position.set(0, 11.4, -25);
  projCone.rotation.x = Math.PI / 2 - 0.085;
  scene.add(projCone);
  disposables.push(projConeGeo, projConeMat);

  // =========================================================================
  // 05. ZONE D — INNER PALACE CHAMBERS WING & GRAND EXIT PORTAL (z: -64 .. -146)
  // =========================================================================
  const innerArchGeo = createVaultedRibGeometry(16, 13.2);
  const innerArchCount = 10;
  const innerArches = new THREE.InstancedMesh(
    innerArchGeo,
    mats.obsidianStone,
    innerArchCount,
  );
  for (let i = 0; i < innerArchCount; i += 1) {
    dummy.position.set(0, 0, -68 - i * 8.4);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    innerArches.setMatrixAt(i, dummy.matrix);
  }
  innerArches.instanceMatrix.needsUpdate = true;
  innerArches.computeBoundingSphere();
  scene.add(innerArches);
  disposables.push(innerArchGeo);

  // Monumental Grand Exit Portal at z = -146
  const exitPillarGeo = new THREE.BoxGeometry(2.4, 13.5, 2.4);
  const exitLeft = new THREE.Mesh(exitPillarGeo, mats.midnightMarble);
  exitLeft.position.set(-4.8, 6.75, -146);
  const exitRight = new THREE.Mesh(exitPillarGeo, mats.midnightMarble);
  exitRight.position.set(4.8, 6.75, -146);
  const exitArchHeader = new THREE.Mesh(
    new THREE.BoxGeometry(12, 2.2, 2.4),
    mats.goldTrim,
  );
  exitArchHeader.position.set(0, 14.2, -146);
  scene.add(exitLeft, exitRight, exitArchHeader);
  disposables.push(exitPillarGeo, exitArchHeader.geometry);

  // Volumetric Moonlight Shafts across Palace Rooms
  const beamGeo = new THREE.ConeGeometry(2.8, 18, 16, 1, true);
  const beamMeshes: THREE.Mesh[] = [];
  const beamZOffsets = [38, 22, -18, -42, -74, -100, -124];
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
    beam.position.set(idx % 2 === 0 ? -3.0 : 3.0, 8.2, z);
    beam.rotation.z = idx % 2 === 0 ? -0.35 : 0.35;
    beam.rotation.x = 0.12;
    scene.add(beam);
    beamMeshes.push(beam);
    disposables.push(beamMat);
  });
  disposables.push(beamGeo);

  // Conservatory Astrolabe Dome & Floating Optical Cinema Relics
  const astrolabeGroup = buildGrandAstrolabe({
    obsidianMat: mats.obsidianStone,
    goldMat: mats.goldTrim,
    glowMat: mats.moonlightInlay,
  });
  astrolabeGroup.position.set(0, 7.2, -96);
  scene.add(astrolabeGroup);

  const heroMonoliths: THREE.Group[] = [];
  const relicCoords = [
    { x: -5.4, y: 3.6, z: -26, scale: 1.0 },
    { x: 5.0, y: 3.4, z: -64, scale: 0.98 },
    { x: -4.2, y: 3.5, z: -88, scale: 1.05 },
    { x: 3.8, y: 3.4, z: -112, scale: 1.02 },
    { x: 0, y: 4.1, z: -132, scale: 1.15 },
  ];
  const shadowDiscGeo = new THREE.CircleGeometry(1.25, 20);
  disposables.push(shadowDiscGeo);

  relicCoords.forEach((coord) => {
    const relic = buildCinemaRelicGroup({
      obsidianMat: mats.obsidianStone,
      metalMat: mats.silverMetal,
      goldMat: mats.goldTrim,
      glassMat: mats.crystalGlass,
      glowMat: mats.moonlightInlay,
      scale: coord.scale,
    });
    relic.position.set(coord.x, coord.y, coord.z);
    scene.add(relic);
    heroMonoliths.push(relic);

    const disc = new THREE.Mesh(shadowDiscGeo, mats.shadowDisc);
    disc.rotation.x = -Math.PI / 2;
    disc.position.set(coord.x, 0.03, coord.z);
    scene.add(disc);
  });

  // =========================================================================
  // 06. ATMOSPHERIC FLOATING DUST MOTES THROUGHOUT PALACE
  // =========================================================================
  const dustCount = 420;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i += 1) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 26;
    dustPositions[i * 3 + 1] = 0.6 + Math.random() * 14.5;
    dustPositions[i * 3 + 2] = 96 - Math.random() * 240;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 0.26,
    map: mats.dustTexture,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    color: 0xa9d4ff,
  });
  const dustPoints = new THREE.Points(dustGeo, dustMat);
  scene.add(dustPoints);
  disposables.push(dustGeo, dustMat);

  const updateBeams = (intensity: number, elapsed: number) => {
    beamMeshes.forEach((beam, idx) => {
      const mat = beam.material as THREE.MeshBasicMaterial;
      const sway = Math.sin(elapsed * 0.42 + idx * 1.1) * 0.015;
      mat.opacity = Math.max(0.025, Math.min(0.11, (0.052 + sway) * intensity));
    });
    // Sweeping exterior searchlights across sky
    searchlightL.rotation.z = 0.24 + Math.sin(elapsed * 0.35) * 0.16;
    searchlightR.rotation.z = -0.24 - Math.cos(elapsed * 0.31) * 0.16;
  };

  const updateOpening = (shot: OpeningShotState | null, elapsed: number) => {
    const doorOpen = shot ? shot.doorOpenRatio : 1;
    const curtainOpen = shot ? shot.curtainOpenRatio : 1;
    const glow = shot ? shot.screenGlow : 0.72 + Math.sin(elapsed * 0.8) * 0.06;

    // Exterior doors swing open inward
    leftDoorPivot.rotation.y = doorOpen * 1.38;
    rightDoorPivot.rotation.y = -doorOpen * 1.38;

    // Velvet auditorium curtains part from 0 (partially closed) to 1 (wide open framing 2.39:1 screen)
    const offset = THREE.MathUtils.lerp(8.2, 16.4, curtainOpen);
    leftCurtain.position.x = -offset;
    rightCurtain.position.x = offset;

    mats.screenSurface.emissiveIntensity = 0.25 + glow * 0.78;
    projConeMat.opacity = 0.03 + glow * 0.055;
  };

  return {
    disposables,
    dustPoints,
    beamMeshes,
    heroMonoliths,
    astrolabeGroup,
    chandelierGroup,
    updateBeams,
    updateOpening,
  };
}
