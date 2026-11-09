import { useEffect, useRef } from "react";

type Geometry = {
  buffer: WebGLBuffer;
  count: number;
  mode: number;
  phase: number;
  kind: number;
};

type Uniforms = {
  time: WebGLUniformLocation;
  pointer: WebGLUniformLocation;
  aspect: WebGLUniformLocation;
  scroll: WebGLUniformLocation;
  phase: WebGLUniformLocation;
  kind: WebGLUniformLocation;
};

const vertexSource = `#version 300 es
precision highp float;
in vec3 aPosition;
in vec3 aColor;
in float aSize;
uniform float uTime;
uniform vec2 uPointer;
uniform float uAspect;
uniform float uScroll;
uniform float uPhase;
out vec3 vColor;
out float vAlpha;

void main() {
  vec3 p = aPosition;
  float turn = uTime * (0.055 + uPhase * 0.018) + uPhase * 0.7 + uScroll * 0.13;
  float cx = cos(turn);
  float sx = sin(turn);
  p.xz = mat2(cx, -sx, sx, cx) * p.xz;

  float tilt = sin(uTime * 0.095 + uPhase) * 0.08;
  float cy = cos(tilt);
  float sy = sin(tilt);
  p.yz = mat2(cy, -sy, sy, cy) * p.yz;

  p.x += uPointer.x * (0.22 + uPhase * 0.02);
  p.y += uPointer.y * (0.15 + uPhase * 0.018) + uScroll * 0.08;
  p.z -= 4.75;

  float depth = max(1.15, -p.z);
  float perspective = 2.05 / depth;
  float portraitCompensation = min(1.0, max(0.42, uAspect / 1.55));
  float projectionAspect = max(uAspect, 1.0);
  gl_Position = vec4(p.x * portraitCompensation * perspective / projectionAspect, p.y * perspective, 0.0, 1.0);
  gl_PointSize = clamp(aSize * (2.55 / depth), 1.0, 10.0);

  vColor = aColor;
  vAlpha = clamp((7.1 - depth) / 3.7, 0.12, 0.92);
}`;

const fragmentSource = `#version 300 es
precision highp float;
in vec3 vColor;
in float vAlpha;
uniform float uKind;
out vec4 outColor;

void main() {
  float alpha = vAlpha;
  if (uKind < 0.5) {
    float d = length(gl_PointCoord - vec2(0.5));
    alpha *= 1.0 - smoothstep(0.12, 0.5, d);
  }
  outColor = vec4(vColor, alpha);
}`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create WebGL shader.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? "Shader compilation failed.";
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext): WebGLProgram {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create WebGL programme.");
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? "WebGL programme link failed.";
    gl.deleteProgram(program);
    throw new Error(message);
  }
  return program;
}

function packedGeometry(
  gl: WebGL2RenderingContext,
  positions: number[],
  color: readonly [number, number, number],
  size: number,
  mode: number,
  phase: number,
  kind: number,
): Geometry {
  const data = new Float32Array((positions.length / 3) * 7);
  for (let i = 0, v = 0; i < positions.length; i += 3, v += 7) {
    data[v] = positions[i];
    data[v + 1] = positions[i + 1];
    data[v + 2] = positions[i + 2];
    data[v + 3] = color[0];
    data[v + 4] = color[1];
    data[v + 5] = color[2];
    data[v + 6] = size;
  }
  const buffer = gl.createBuffer();
  if (!buffer) throw new Error("Unable to allocate WebGL geometry.");
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return { buffer, count: positions.length / 3, mode, phase, kind };
}

function ring(radius: number, segments: number, z: number, yScale = 1): number[] {
  const points: number[] = [];
  for (let i = 0; i <= segments; i += 1) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(Math.cos(angle) * radius, Math.sin(angle) * radius * yScale, z);
  }
  return points;
}

function wireSphere(radius: number, latitudeCount: number, longitudeCount: number): number[] {
  const points: number[] = [];
  const steps = 64;
  for (let lat = 1; lat < latitudeCount; lat += 1) {
    const phi = (lat / latitudeCount) * Math.PI;
    for (let i = 0; i <= steps; i += 1) {
      const theta = (i / steps) * Math.PI * 2;
      points.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      );
    }
  }
  for (let lon = 0; lon < longitudeCount; lon += 1) {
    const theta = (lon / longitudeCount) * Math.PI * 2;
    for (let i = 0; i <= steps; i += 1) {
      const phi = (i / steps) * Math.PI;
      points.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      );
    }
  }
  return points;
}

function filmFrame(width: number, height: number, z: number): number[] {
  const x = width / 2;
  const y = height / 2;
  const points = [
    -x, -y, z, x, -y, z, x, -y, z, x, y, z,
    x, y, z, -x, y, z, -x, y, z, -x, -y, z,
  ];
  const holeWidth = width * 0.11;
  const holeHeight = height * 0.09;
  const count = 5;
  for (let i = 0; i < count; i += 1) {
    const hx = -x + (width / (count + 0.5)) * (i + 0.5);
    for (const edgeY of [-y + holeHeight, y - holeHeight]) {
      points.push(
        hx - holeWidth, edgeY - holeHeight, z,
        hx + holeWidth, edgeY - holeHeight, z,
        hx + holeWidth, edgeY - holeHeight, z,
        hx + holeWidth, edgeY + holeHeight, z,
        hx + holeWidth, edgeY + holeHeight, z,
        hx - holeWidth, edgeY + holeHeight, z,
        hx - holeWidth, edgeY + holeHeight, z,
        hx - holeWidth, edgeY - holeHeight, z,
      );
    }
  }
  return points;
}


function addBox(points: number[], cx: number, cy: number, cz: number, w: number, h: number, d: number): void {
  const x0 = cx - w / 2, x1 = cx + w / 2;
  const y0 = cy - h / 2, y1 = cy + h / 2;
  const z0 = cz - d / 2, z1 = cz + d / 2;
  const vertices = [
    [x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],
    [x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],
  ];
  const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  for (const [a,b] of edges) points.push(...vertices[a], ...vertices[b]);
}

function addSpire(points: number[], cx: number, baseY: number, cz: number, w: number, d: number, h: number): void {
  const corners = [
    [cx-w/2,baseY,cz-d/2],[cx+w/2,baseY,cz-d/2],
    [cx+w/2,baseY,cz+d/2],[cx-w/2,baseY,cz+d/2],
  ];
  const apex = [cx,baseY+h,cz];
  for (let i=0;i<4;i+=1) {
    const a=corners[i], b=corners[(i+1)%4];
    points.push(...a,...b,...a,...apex);
  }
}

function addGothicArch(points: number[], cx: number, baseY: number, z: number, width: number, height: number): void {
  const half = width / 2;
  const shoulderY = baseY + height * .66;
  const left = cx - half;
  const right = cx + half;
  points.push(left,baseY,z,left,shoulderY,z);
  points.push(right,baseY,z,right,shoulderY,z);
  const segments=18;
  for(let i=0;i<segments;i+=1) {
    const t0=i/segments, t1=(i+1)/segments;
    const x0=left+width*t0, x1=left+width*t1;
    const y0=shoulderY+(height-shoulderY+baseY)*Math.sin(Math.PI*t0);
    const y1=shoulderY+(height-shoulderY+baseY)*Math.sin(Math.PI*t1);
    points.push(x0,y0,z,x1,y1,z);
  }
  points.push(left,baseY,z,right,baseY,z);
  const inner=width*.62;
  const innerHeight=height*.72;
  const inLeft=cx-inner/2, inRight=cx+inner/2;
  points.push(inLeft,baseY+.08,z-.008,inLeft,baseY+innerHeight*.66,z-.008);
  points.push(inRight,baseY+.08,z-.008,inRight,baseY+innerHeight*.66,z-.008);
  for(let i=0;i<segments;i+=1) {
    const t0=i/segments, t1=(i+1)/segments;
    const y0=baseY+.08+(innerHeight*.34)*Math.sin(Math.PI*t0);
    const y1=baseY+.08+(innerHeight*.34)*Math.sin(Math.PI*t1);
    points.push(inLeft+inner*t0,y0,z-.008,inLeft+inner*t1,y1,z-.008);
  }
}

function castleGeometry(): { structure: number[]; detail: number[]; arches: number[] } {
  const structure: number[]=[];
  const detail: number[]=[];
  const arches: number[]=[];
  const shift=.52;
  const floor=-.92;
  const front=.44;

  // Grand foundation and stepped plinth.
  addBox(structure,shift,floor-.11,0,4.85,.22,1.48);
  addBox(structure,shift,floor+.015,0,4.35,.13,1.26);
  addBox(structure,shift,floor+.13,-.02,3.82,.12,1.08);

  // Central keep and the two great tower blocks.
  addBox(structure,shift,floor+.87,0,1.75,1.58,.98);
  for(const side of [-1,1]) {
    const x=shift+side*1.48;
    addBox(structure,x,floor+1.03,0,.91,2.02,.98);
    addSpire(structure,x,floor+2.04,0,1.13,1.18,1.12);
    addBox(detail,x,floor+1.95,0,1.02,.12,1.08);
    addSpire(detail,x,floor+2.16,0,.33,.34,.3);
    addBox(detail,x,floor+.82,front,.96,.09,.08);
    addBox(detail,x,floor+1.52,front,.96,.08,.08);
  }

  // Smaller outer turrets create a layered, fortified skyline.
  for(const side of [-1,1]) {
    const x=shift+side*2.02;
    addBox(structure,x,floor+.62,.04,.48,1.18,.63);
    addSpire(structure,x,floor+1.21,.04,.64,.76,.7);
    addBox(detail,x,floor+1.15,.04,.55,.09,.69);
  }

  // Central roofline, battlements and connecting curtain walls.
  addSpire(structure,shift,floor+1.66,-.03,1.94,1.14,1.18);
  addBox(detail,shift-.55,floor+1.68,front,.48,.12,.12);
  addBox(detail,shift+.55,floor+1.68,front,.48,.12,.12);
  for(let i=0;i<9;i+=1) {
    const x=shift-1.06+i*.265;
    if(Math.abs(x-shift)<.48) continue;
    addBox(detail,x,floor+1.27,front,.14,.2,.12);
  }
  for(const side of [-1,1]) {
    const x=shift+side*.99;
    addBox(structure,x,floor+.68,.02,.74,1.2,.78);
    addBox(detail,x,floor+1.3,.02,.82,.1,.84);
    for(let i=0;i<3;i+=1) addBox(detail,x+side*(i-1)*.22,floor+1.42,.02,.12,.2,.13);
  }

  // Pointed gate, tall lancet windows and tower slits.
  addGothicArch(arches,shift,floor+.04,front+.08,.75,1.05);
  addGothicArch(arches,shift-.0,floor+.57,front+.09,.31,.64);
  for(const side of [-1,1]) {
    addGothicArch(arches,shift+side*1.48,floor+.48,front+.52,.23,.58);
    addGothicArch(arches,shift+side*2.02,floor+.38,front+.36,.17,.42);
    addGothicArch(arches,shift+side*.88,floor+.45,front+.43,.2,.5);
  }

  // Fine vertical tracery and the central keystone.
  detail.push(shift,floor+.2,front+.1,shift,floor+1.2,front+.1);
  detail.push(shift-.18,floor+.04,front+.1,shift-.18,floor+.52,front+.1);
  detail.push(shift+.18,floor+.04,front+.1,shift+.18,floor+.52,front+.1);
  addSpire(detail,shift,floor+2.7,-.05,.28,.3,.42);
  return {structure,detail,arches};
}

function createScene(gl: WebGL2RenderingContext): { program: WebGLProgram; uniforms: Uniforms; geometry: Geometry[] } {
  const program = createProgram(gl);
  const location = (name: string) => {
    const result = gl.getUniformLocation(program, name);
    if (!result) throw new Error("Missing WebGL uniform: " + name);
    return result;
  };

  gl.useProgram(program);
  const geometry: Geometry[] = [];
  let seed = 7213;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const stars: number[] = [];
  for (let i = 0; i < 560; i += 1) {
    stars.push((random() - 0.5) * 8.4, (random() - 0.5) * 5.2, random() * 3.8);
  }
  geometry.push(packedGeometry(gl, stars, [0.36, 0.72, 0.96], 1.8, gl.POINTS, 0.2, 0));

  const closeParticles: number[] = [];
  for (let i = 0; i < 110; i += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 1.1 + random() * 2.7;
    closeParticles.push(Math.cos(angle) * radius, (random() - 0.5) * 3.7, random() * 2.1);
  }
  geometry.push(packedGeometry(gl, closeParticles, [0.58, 0.86, 1.0], 4.1, gl.POINTS, 1.4, 0));

  const castle = castleGeometry();
  geometry.push(packedGeometry(gl, castle.structure, [0.23, 0.58, 0.79], 1, gl.LINES, 0.35, 1));
  geometry.push(packedGeometry(gl, castle.detail, [0.52, 0.83, 1.0], 1, gl.LINES, 1.15, 1));
  geometry.push(packedGeometry(gl, castle.arches, [0.65, 0.88, 1.0], 1, gl.LINES, 1.8, 1));

  geometry.push(packedGeometry(gl, ring(1.55, 180, 0, 0.93), [0.35, 0.76, 1.0], 1, gl.LINE_STRIP, 0.3, 1));
  geometry.push(packedGeometry(gl, ring(1.23, 180, 0.11, 1.06), [0.56, 0.87, 1.0], 1, gl.LINE_STRIP, 1.2, 1));
  geometry.push(packedGeometry(gl, ring(0.91, 180, -0.12, 1), [0.24, 0.59, 0.82], 1, gl.LINE_STRIP, 2.1, 1));
  geometry.push(packedGeometry(gl, ring(1.76, 180, -0.25, 0.64), [0.22, 0.56, 0.78], 1, gl.LINE_STRIP, 2.8, 1));
  geometry.push(packedGeometry(gl, wireSphere(0.76, 11, 18), [0.4, 0.78, 0.98], 1, gl.LINE_STRIP, 0.8, 1));
  geometry.push(packedGeometry(gl, filmFrame(1.9, 2.45, -0.2), [0.53, 0.84, 1.0], 1, gl.LINES, 1.8, 1));
  geometry.push(packedGeometry(gl, filmFrame(1.38, 1.8, 0.12), [0.22, 0.57, 0.81], 1, gl.LINES, 2.7, 1));

  const uniforms: Uniforms = {
    time: location("uTime"),
    pointer: location("uPointer"),
    aspect: location("uAspect"),
    scroll: location("uScroll"),
    phase: location("uPhase"),
    kind: location("uKind"),
  };
  return { program, uniforms, geometry };
}

export function CinematicUniverse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      premultipliedAlpha: true,
    });
    if (!gl) {
      canvas.dataset.fallback = "true";
      return;
    }

    let scene: ReturnType<typeof createScene>;
    try {
      scene = createScene(gl);
    } catch {
      canvas.dataset.fallback = "true";
      return;
    }

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let frame = 0;
    let width = 1;
    let height = 1;
    let isInView = false;

    const position = gl.getAttribLocation(scene.program, "aPosition");
    const color = gl.getAttribLocation(scene.program, "aColor");
    const size = gl.getAttribLocation(scene.program, "aSize");

    const draw = () => {
      frame = 0;
      if (document.hidden || !isInView) return;
      pointer.x = pointer.targetX;
      pointer.y = pointer.targetY;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.useProgram(scene.program);

      gl.uniform1f(scene.uniforms.time, 0);
      gl.uniform2f(scene.uniforms.pointer, pointer.x, pointer.y);
      gl.uniform1f(scene.uniforms.aspect, width / Math.max(1, height));
      gl.uniform1f(scene.uniforms.scroll, Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight))));

      for (const item of scene.geometry) {
        gl.bindBuffer(gl.ARRAY_BUFFER, item.buffer);
        const stride = 7 * Float32Array.BYTES_PER_ELEMENT;
        gl.enableVertexAttribArray(position);
        gl.enableVertexAttribArray(color);
        gl.enableVertexAttribArray(size);
        gl.vertexAttribPointer(position, 3, gl.FLOAT, false, stride, 0);
        gl.vertexAttribPointer(color, 3, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.vertexAttribPointer(size, 1, gl.FLOAT, false, stride, 6 * Float32Array.BYTES_PER_ELEMENT);
        gl.uniform1f(scene.uniforms.phase, item.phase);
        gl.uniform1f(scene.uniforms.kind, item.kind);
        gl.drawArrays(item.mode, 0, item.count);
      }
    };

    const scheduleDraw = () => {
      if (frame || document.hidden || !isInView) return;
      frame = window.requestAnimationFrame(draw);
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.0);
      width = Math.max(1, Math.round(bounds.width * dpr));
      height = Math.max(1, Math.round(bounds.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      scheduleDraw();
    };

    const handlePointer = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !isInView) return;
      const bounds = canvas.getBoundingClientRect();
      const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (!inside) {
        if (pointer.targetX === 0 && pointer.targetY === 0) return;
        pointer.targetX = 0;
        pointer.targetY = 0;
      } else {
        pointer.targetX = ((event.clientX - bounds.left) / Math.max(1, bounds.width) - 0.5) * 2;
        pointer.targetY = (0.5 - (event.clientY - bounds.top) / Math.max(1, bounds.height)) * 2;
      }
      scheduleDraw();
    };

    const handleLeave = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
      scheduleDraw();
    };

    const handleScroll = () => scheduleDraw();

    const observer = new IntersectionObserver(([entry]) => {
      isInView = Boolean(entry?.isIntersecting);
      if (isInView) scheduleDraw();
      else if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { threshold: 0.01 });
    observer.observe(canvas);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
      } else {
        scheduleDraw();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("blur", handleLeave);

    // Draw once on entry; redraw only after pointer, scroll, or resize input.
    isInView = canvas.getBoundingClientRect().bottom > 0 && canvas.getBoundingClientRect().top < window.innerHeight;
    if (isInView) draw();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("blur", handleLeave);
      scene.geometry.forEach((item) => gl.deleteBuffer(item.buffer));
      gl.deleteProgram(scene.program);
    };
  }, []);

  return (
    <div className="cinematic-universe" aria-hidden="true">
      <canvas ref={canvasRef} className="cinematic-universe__canvas" />
      <span className="cinematic-universe__vignette" />
      <span className="cinematic-universe__ring cinematic-universe__ring--one" />
      <span className="cinematic-universe__ring cinematic-universe__ring--two" />
    </div>
  );
}
