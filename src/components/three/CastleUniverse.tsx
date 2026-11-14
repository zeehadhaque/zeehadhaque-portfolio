import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import palaceAuditoriumImg from "../../assets/images/palace_imax_auditorium_1794660878336.jpg";
import {
  computeOpeningShotState,
  interpolateCameraPose,
  type ChamberId,
} from "../../utils/castleConfig";
import { buildCastleScene } from "./castleGeometry";

interface CastleUniverseProps {
  activeChamber: ChamberId;
  scrollProgress: number;
  liteMode: boolean;
  reducedMotion: boolean;
  isOpening?: boolean;
  openingProgress?: number;
}

const _desiredPos = new THREE.Vector3();
const _desiredLook = new THREE.Vector3();
const _currentLook = new THREE.Vector3(0, 4.8, 10);

function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return true;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? "");
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function CastleUniverse({
  activeChamber,
  scrollProgress,
  liteMode,
  reducedMotion,
  isOpening = false,
  openingProgress = 0,
}: CastleUniverseProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [contextLost, setContextLost] = useState(false);
  const [webglReady, setWebglReady] = useState(false);

  const stateRef = useRef({
    activeChamber,
    scrollProgress,
    liteMode,
    reducedMotion,
    isOpening,
    openingProgress,
    pointerX: 0,
    pointerY: 0,
  });

  stateRef.current.activeChamber = activeChamber;
  stateRef.current.scrollProgress = scrollProgress;
  stateRef.current.liteMode = liteMode;
  stateRef.current.reducedMotion = reducedMotion;
  stateRef.current.isOpening = isOpening;
  stateRef.current.openingProgress = openingProgress;

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;
    if (liteMode) {
      setWebglReady(false);
      return;
    }

    const isSoftwareGl = detectSoftwareGl();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: "high-performance",
        alpha: false,
      });
    } catch {
      setContextLost(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2),
    );
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);

    const canvas = renderer.domElement;
    canvas.setAttribute("data-testid", "castle-webgl-canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020305);
    scene.fog = new THREE.FogExp2(0x03060d, 0.0175);

    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / Math.max(1, window.innerHeight),
      0.1,
      210,
    );
    const initialOpening = stateRef.current.isOpening
      ? computeOpeningShotState(stateRef.current.openingProgress)
      : null;
    const initialPose =
      initialOpening ?? interpolateCameraPose(stateRef.current.scrollProgress);
    camera.position.set(initialPose.posX, initialPose.posY, initialPose.posZ);
    _currentLook.set(initialPose.lookX, initialPose.lookY, initialPose.lookZ);
    camera.lookAt(_currentLook);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    // Cool moonlight sky + warm obsidian marble bounce + architectural chandelier key
    const hemiLight = new THREE.HemisphereLight(0x9bcaff, 0x1a151c, 1.05);
    scene.add(hemiLight);

    const exteriorKey = new THREE.DirectionalLight(0xc6a875, 1.7);
    exteriorKey.position.set(16, 28, 80);
    if (!isSoftwareGl) {
      exteriorKey.castShadow = true;
      exteriorKey.shadow.mapSize.set(1024, 1024);
      exteriorKey.shadow.bias = -0.0005;
      exteriorKey.shadow.normalBias = 0.02;
    }
    scene.add(exteriorKey);

    const foyerPointLight = new THREE.PointLight(0xe5c58e, 4.4, 72, 1.35);
    foyerPointLight.position.set(0, 13.2, 32);
    scene.add(foyerPointLight);

    const auditoriumLight = new THREE.DirectionalLight(0xa9d4ff, 1.9);
    auditoriumLight.position.set(-10, 18, -10);
    scene.add(auditoriumLight);

    const castle = buildCastleScene(scene, renderer, isSoftwareGl);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    setWebglReady(true);
    setContextLost(false);

    let frameId = 0;
    let disposed = false;
    let lost = false;
    let lastTime = performance.now();
    let elapsed = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== "function") {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const renderFrame = (dt: number) => {
      const current = stateRef.current;
      const openingShot = current.isOpening
        ? computeOpeningShotState(current.openingProgress)
        : null;
      const pose = openingShot ?? interpolateCameraPose(current.scrollProgress);

      const parallaxScale = current.reducedMotion || current.isOpening ? 0 : 1;
      const targetX = pose.posX + current.pointerX * 0.65 * parallaxScale;
      const targetY = pose.posY - current.pointerY * 0.35 * parallaxScale;

      _desiredPos.set(targetX, targetY, pose.posZ);
      _desiredLook.set(
        pose.lookX + current.pointerX * 0.45 * parallaxScale,
        pose.lookY - current.pointerY * 0.25 * parallaxScale,
        pose.lookZ,
      );

      const lambda = current.reducedMotion
        ? 18
        : current.isOpening
          ? 6.2
          : 4.2;
      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        _desiredPos.x,
        lambda,
        dt,
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        _desiredPos.y,
        lambda,
        dt,
      );
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        _desiredPos.z,
        lambda,
        dt,
      );
      _currentLook.x = THREE.MathUtils.damp(
        _currentLook.x,
        _desiredLook.x,
        lambda,
        dt,
      );
      _currentLook.y = THREE.MathUtils.damp(
        _currentLook.y,
        _desiredLook.y,
        lambda,
        dt,
      );
      _currentLook.z = THREE.MathUtils.damp(
        _currentLook.z,
        _desiredLook.z,
        lambda,
        dt,
      );

      if (Math.abs(camera.fov - pose.fov) > 0.04) {
        camera.fov = THREE.MathUtils.damp(camera.fov, pose.fov, 3.8, dt);
        camera.updateProjectionMatrix();
      }
      camera.lookAt(_currentLook);

      if (!current.reducedMotion) {
        castle.chandelierGroup.rotation.y += dt * 0.08;
        castle.astrolabeGroup.rotation.y += dt * 0.16;
        castle.astrolabeGroup.rotation.z = Math.sin(elapsed * 0.25) * 0.08;
        castle.heroMonoliths.forEach((group, idx) => {
          group.rotation.y += dt * (idx % 2 === 0 ? 0.22 : -0.18);
          group.position.y += Math.sin(elapsed * 0.9 + idx * 1.4) * dt * 0.14;
        });
        castle.dustPoints.rotation.z = Math.sin(elapsed * 0.06) * 0.03;
      }

      castle.updateOpening(openingShot, elapsed);
      castle.updateBeams(pose.beamIntensity, elapsed);
      renderer.render(scene, camera);
    };

    const tick = () => {
      if (disposed || lost || document.hidden || stateRef.current.liteMode) {
        return;
      }
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      elapsed += dt;

      renderFrame(dt);

      if (stateRef.current.reducedMotion) {
        return;
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    const onScrollWake = () => {
      if (stateRef.current.reducedMotion && !disposed && !lost) {
        renderFrame(0.016);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      stateRef.current.pointerX =
        (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      stateRef.current.pointerY =
        (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };

    const onResize = () => {
      if (disposed) return;
      const width = window.innerWidth;
      const height = Math.max(1, window.innerHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (stateRef.current.reducedMotion) {
        renderFrame(0.016);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frameId);
        window.clearTimeout(frameId);
        return;
      }
      lastTime = performance.now();
      tick();
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      setContextLost(true);
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
    };

    const onContextRestored = () => {
      lost = false;
      setContextLost(false);
      lastTime = performance.now();
      tick();
    };

    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScrollWake, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibilityChange);

    tick();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScrollWake);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      envTarget.dispose();
      castle.disposables.forEach((item) => item.dispose());
      renderer.dispose();
      if (canvas.parentElement === host) {
        host.removeChild(canvas);
      }
    };
  }, [liteMode]);

  return (
    <div
      className={`castle-universe ${liteMode || contextLost ? "is-lite" : ""}`}
      data-testid="castle-universe"
      data-webgl-ready={webglReady}
      data-lite-mode={liteMode}
      data-chamber={activeChamber}
    >
      {!liteMode && !contextLost && (
        <div ref={mountRef} className="castle-universe__canvas-mount" />
      )}

      <div
        className="castle-universe__backdrop"
        aria-hidden="true"
        style={{
          opacity: liteMode || contextLost || !webglReady ? 0.56 : 0.14,
        }}
      >
        <img
          src={palaceAuditoriumImg}
          alt=""
          referrerPolicy="no-referrer"
          decoding="async"
        />
        <div className="castle-universe__backdrop-scrim" />
      </div>
    </div>
  );
}
