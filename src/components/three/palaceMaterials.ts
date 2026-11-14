import * as THREE from "three";

export interface PalaceMaterialPalette {
  obsidianStone: THREE.MeshStandardMaterial;
  midnightMarble: THREE.MeshStandardMaterial;
  floorMarble: THREE.MeshStandardMaterial;
  carpetRunner: THREE.MeshStandardMaterial;
  goldTrim: THREE.MeshStandardMaterial;
  silverMetal: THREE.MeshStandardMaterial;
  velvetBurgundy: THREE.MeshStandardMaterial;
  moonlightInlay: THREE.MeshStandardMaterial;
  screenSurface: THREE.MeshStandardMaterial;
  crystalGlass: THREE.MeshPhysicalMaterial;
  shadowDisc: THREE.MeshBasicMaterial;
  dustTexture: THREE.CanvasTexture;
  disposables: Array<{ dispose: () => void }>;
}

function createMarbleFloorMaps(maxAnisotropy: number): {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 512;
  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = size;
  colorCanvas.height = size;
  const cCtx = colorCanvas.getContext("2d");

  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext("2d");

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext("2d");

  if (cCtx && rCtx && bCtx) {
    cCtx.fillStyle = "#080c14";
    cCtx.fillRect(0, 0, size, size);
    rCtx.fillStyle = "#2b2b2b";
    rCtx.fillRect(0, 0, size, size);
    bCtx.fillStyle = "#848484";
    bCtx.fillRect(0, 0, size, size);

    const tile = size / 4;
    for (let y = 0; y < 4; y += 1) {
      for (let x = 0; x < 4; x += 1) {
        const tone = 8 + ((x * 7 + y * 11) % 10);
        cCtx.fillStyle = `rgb(${tone}, ${tone + 4}, ${tone + 12})`;
        cCtx.fillRect(x * tile + 2, y * tile + 2, tile - 4, tile - 4);

        const rShade = 32 + ((x * 5 + y * 9) % 20);
        rCtx.fillStyle = `rgb(${rShade}, ${rShade}, ${rShade})`;
        rCtx.fillRect(x * tile + 2, y * tile + 2, tile - 4, tile - 4);

        const bShade = 128 + ((x * 5 + y * 13) % 14);
        bCtx.fillStyle = `rgb(${bShade}, ${bShade}, ${bShade})`;
        bCtx.fillRect(x * tile + 2, y * tile + 2, tile - 4, tile - 4);
      }
    }

    // Delicate stone veins & subtle brass/moonlight tile seams
    cCtx.strokeStyle = "rgba(198, 168, 117, 0.22)";
    cCtx.lineWidth = 2;
    rCtx.strokeStyle = "#626262";
    rCtx.lineWidth = 3;
    bCtx.strokeStyle = "#303030";
    bCtx.lineWidth = 3;
    for (let i = 0; i <= 4; i += 1) {
      const pos = i * tile;
      [cCtx, rCtx, bCtx].forEach((ctx) => {
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, size);
        ctx.moveTo(0, pos);
        ctx.lineTo(size, pos);
        ctx.stroke();
      });
    }
  }

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(10, 36);
  map.anisotropy = maxAnisotropy;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(10, 36);
  roughnessMap.anisotropy = maxAnisotropy;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(10, 36);
  bumpMap.anisotropy = maxAnisotropy;

  return { map, roughnessMap, bumpMap };
}

function createDustSpriteTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      1,
      size / 2,
      size / 2,
      size / 2,
    );
    grad.addColorStop(0, "rgba(233, 240, 255, 1)");
    grad.addColorStop(0.35, "rgba(125, 187, 255, 0.7)");
    grad.addColorStop(1, "rgba(125, 187, 255, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createPalaceMaterials(
  maxAnisotropy: number,
  isSoftwareGl: boolean,
): PalaceMaterialPalette {
  const { map, roughnessMap, bumpMap } = createMarbleFloorMaps(maxAnisotropy);
  const dustTexture = createDustSpriteTexture();

  const obsidianStone = new THREE.MeshStandardMaterial({
    color: 0x090e18,
    roughness: 0.72,
    metalness: 0.16,
  });

  const midnightMarble = new THREE.MeshStandardMaterial({
    color: 0x101c30,
    roughness: 0.42,
    metalness: 0.28,
  });

  const floorMarble = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map,
    roughnessMap,
    bumpMap,
    bumpScale: 0.025,
    roughness: 0.22,
    metalness: 0.55,
  });

  const carpetRunner = new THREE.MeshStandardMaterial({
    color: 0x351421,
    roughness: 0.9,
    metalness: 0.04,
  });

  const goldTrim = new THREE.MeshStandardMaterial({
    color: 0xc6a875,
    emissive: 0x382810,
    emissiveIntensity: 0.35,
    roughness: 0.24,
    metalness: 0.88,
  });

  const silverMetal = new THREE.MeshStandardMaterial({
    color: 0xdcebff,
    roughness: 0.2,
    metalness: 0.92,
  });

  const velvetBurgundy = new THREE.MeshStandardMaterial({
    color: 0x4b1d2f,
    roughness: 0.88,
    metalness: 0.06,
  });

  const moonlightInlay = new THREE.MeshStandardMaterial({
    color: 0x7dbbff,
    emissive: 0x3675c4,
    emissiveIntensity: 1.15,
    roughness: 0.2,
    metalness: 0.6,
  });

  const screenSurface = new THREE.MeshStandardMaterial({
    color: 0xdcebff,
    emissive: 0x4f7eb8,
    emissiveIntensity: 0.82,
    roughness: 0.35,
    metalness: 0.1,
  });

  const crystalGlass = new THREE.MeshPhysicalMaterial({
    color: 0xdcebff,
    roughness: 0.08,
    metalness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transmission: isSoftwareGl ? 0 : 0.65,
    transparent: true,
    opacity: isSoftwareGl ? 0.58 : 0.9,
    ior: 1.54,
  });

  const shadowDisc = new THREE.MeshBasicMaterial({
    color: 0x010204,
    transparent: true,
    opacity: 0.44,
    depthWrite: false,
  });

  const disposables = [
    map,
    roughnessMap,
    bumpMap,
    dustTexture,
    obsidianStone,
    midnightMarble,
    floorMarble,
    carpetRunner,
    goldTrim,
    silverMetal,
    velvetBurgundy,
    moonlightInlay,
    screenSurface,
    crystalGlass,
    shadowDisc,
  ];

  return {
    obsidianStone,
    midnightMarble,
    floorMarble,
    carpetRunner,
    goldTrim,
    silverMetal,
    velvetBurgundy,
    moonlightInlay,
    screenSurface,
    crystalGlass,
    shadowDisc,
    dustTexture,
    disposables,
  };
}
