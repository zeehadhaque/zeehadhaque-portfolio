import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; z: number; phase: number };
type TrailPoint = { x: number; y: number; life: number };

export function ImmersiveWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true, desynchronized: true });
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const lowPower = navigator.hardwareConcurrency <= 4 || memory <= 4;
    const frameInterval = lowPower ? 1000 / 24 : 1000 / 30;
    const particles: Particle[] = Array.from(
      { length: reduced ? 20 : lowPower ? 28 : 46 },
      (_, index) => ({ x: Math.random(), y: Math.random(), z: Math.random(), phase: index * .73 }),
    );
    const trail: TrailPoint[] = [];
    let width = 0, height = 0, tick = 0, raf = 0, lastPaint = 0;
    let scrollProgress = 0, running = false;
    let pointer = { x: -1000, y: -1000 };

    const paint = (time: number, force = false) => {
      if (!force && time - lastPaint < frameInterval) return;
      lastPaint = time;
      tick += 1;
      ctx.clearRect(0, 0, width, height);
      const atmosphere = ctx.createRadialGradient(width*.52,height*.48,0,width*.52,height*.48,Math.max(width,height)*.78);
      atmosphere.addColorStop(0,"rgba(28,43,70,.32)");
      atmosphere.addColorStop(.55,"rgba(8,13,24,.18)");
      atmosphere.addColorStop(1,"rgba(2,4,9,.86)");
      ctx.fillStyle=atmosphere;
      ctx.fillRect(0,0,width,height);
      const travel = reduced ? 0 : scrollProgress * height * .18;
      const projected = particles.map(p => {
        const drift = reduced ? 0 : Math.sin(tick*.003+p.phase)*.018;
        return {
          x:(p.x+drift)*width,
          y:(p.y+Math.cos(tick*.002+p.phase)*.014)*height-travel*(.22+p.z*.78),
          r:.6+p.z*1.5
        };
      });
      ctx.lineWidth=.6;
      for(let i=0;i<projected.length;i++){
        for(let j=i+1;j<projected.length;j++){
          const a=projected[i], b=projected[j], d=Math.hypot(a.x-b.x,a.y-b.y);
          if(d>=145) continue;
          ctx.strokeStyle="rgba(135,174,225,"+((1-d/145)*.16)+")";
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
        }
      }
      projected.forEach(p=>{
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle="rgba(178,205,239,.46)";ctx.fill();
      });
      if(!reduced){
        trail.forEach((p,i)=>{
          p.life-=.045;
          if(i===0)return;
          const prev=trail[i-1];
          ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(p.x,p.y);
          ctx.strokeStyle="rgba(155,190,236,"+Math.max(0,p.life*.2)+")";
          ctx.lineWidth=1.1;ctx.stroke();
        });
        while(trail.length && trail[0].life<=0) trail.shift();
        const glow=ctx.createRadialGradient(pointer.x,pointer.y,0,pointer.x,pointer.y,170);
        glow.addColorStop(0,"rgba(86,139,209,.11)");
        glow.addColorStop(1,"rgba(86,139,209,0)");
        ctx.fillStyle=glow;ctx.fillRect(pointer.x-170,pointer.y-170,340,340);
      }
    };

    const loop=(time:number)=>{
      if(!running||document.hidden)return;
      paint(time);
      raf=window.requestAnimationFrame(loop);
    };
    const start=()=>{
      if(reduced||running||document.hidden)return;
      running=true;lastPaint=0;raf=window.requestAnimationFrame(loop);
    };
    const stop=()=>{running=false;window.cancelAnimationFrame(raf);};
    const resize=()=>{
      const dpr=Math.min(window.devicePixelRatio||1,lowPower?1.2:1.5);
      width=window.innerWidth;height=window.innerHeight;
      canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
      canvas.style.width=width+"px";canvas.style.height=height+"px";
      ctx.setTransform(dpr,0,0,dpr,0,0);paint(performance.now(),true);
    };
    const onScroll=()=>{
      const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
      scrollProgress=Math.min(1,Math.max(0,window.scrollY/max));
      if(!running)paint(performance.now(),true);
    };
    const onPointer=(event:PointerEvent)=>{
      pointer={x:event.clientX,y:event.clientY};
      if(!reduced){trail.push({x:pointer.x,y:pointer.y,life:1});if(trail.length>18)trail.shift();}
    };
    const onVisibility=()=>document.hidden?stop():start();

    resize();onScroll();start();
    window.addEventListener("resize",resize,{passive:true});
    window.addEventListener("scroll",onScroll,{passive:true});
    window.addEventListener("pointermove",onPointer,{passive:true});
    document.addEventListener("visibilitychange",onVisibility);
    return ()=>{
      stop();
      window.removeEventListener("resize",resize);
      window.removeEventListener("scroll",onScroll);
      window.removeEventListener("pointermove",onPointer);
      document.removeEventListener("visibilitychange",onVisibility);
    };
  },[]);

  return <div className="immersive-world" aria-hidden="true"><canvas ref={canvasRef}/><div className="immersive-world__vignette"/><div className="immersive-world__scanline"/></div>;
}
