import { useEffect, useRef } from "react";

export function ImmersiveWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0, height = 0, frame = 0, raf = 0;
    let pointer = { x: -1000, y: -1000 };
    let scrollProgress = 0;
    const trail: {x:number;y:number;life:number}[] = [];
    const nodes = Array.from({length: reduced ? 24 : 58}, (_,i) => ({
      x: Math.random(), y: Math.random(), z: Math.random(), phase: i * 0.73
    }));
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.7);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.floor(width*dpr); canvas.height = Math.floor(height*dpr);
      canvas.style.width = width+"px"; canvas.style.height = height+"px";
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    const move = (e: PointerEvent) => {
      pointer = {x:e.clientX,y:e.clientY};
      if (!reduced) trail.push({x:pointer.x,y:pointer.y,life:1});
      if (trail.length > 22) trail.shift();
    };
    const draw = () => {
      frame += 1;
      ctx.clearRect(0,0,width,height);
      const g = ctx.createRadialGradient(width*.52,height*.48,0,width*.52,height*.48,Math.max(width,height)*.78);
      g.addColorStop(0,"rgba(28,43,70,.32)"); g.addColorStop(.55,"rgba(8,13,24,.18)"); g.addColorStop(1,"rgba(2,4,9,.86)");
      ctx.fillStyle=g; ctx.fillRect(0,0,width,height);
      const cameraTravel = reduced ? 0 : scrollProgress * height * .18;
      const projected = nodes.map(n => {
        const drift = reduced ? 0 : Math.sin(frame*.003+n.phase)*.018;
        const x=(n.x+drift)*width, y=(n.y+Math.cos(frame*.002+n.phase)*.014)*height-cameraTravel*(.22+n.z*.78);
        return {x,y,r: .6+n.z*1.5};
      });
      ctx.lineWidth=.6;
      for(let i=0;i<projected.length;i++){
        for(let j=i+1;j<projected.length;j++){
          const a=projected[i],b=projected[j],d=Math.hypot(a.x-b.x,a.y-b.y);
          if(d<145){
            ctx.strokeStyle="rgba(135,174,225,"+((1-d/145)*.16)+")";
            ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
          }
        }
      }
      projected.forEach(p=>{
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle="rgba(178,205,239,.46)";ctx.fill();
      });
      if(!reduced){
        trail.forEach((p,i)=>{
          p.life-=.035;
          if(i>0){const prev=trail[i-1];ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(p.x,p.y);ctx.strokeStyle="rgba(155,190,236,"+Math.max(0,p.life*.22)+")";ctx.lineWidth=1.2;ctx.stroke();}
        });
        while(trail.length && trail[0].life<=0) trail.shift();
        const glow=ctx.createRadialGradient(pointer.x,pointer.y,0,pointer.x,pointer.y,180);
        glow.addColorStop(0,"rgba(86,139,209,.11)");glow.addColorStop(1,"rgba(86,139,209,0)");
        ctx.fillStyle=glow;ctx.fillRect(pointer.x-180,pointer.y-180,360,360);
      }
      raf=requestAnimationFrame(draw);
    };
    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };
    resize(); onScroll(); draw();
    window.addEventListener("scroll", onScroll, {passive:true});
    window.addEventListener("resize",resize,{passive:true});
    window.addEventListener("pointermove",move,{passive:true});
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);window.removeEventListener("pointermove",move);window.removeEventListener("scroll",onScroll);};
  },[]);
  return <div className="immersive-world" aria-hidden="true"><canvas ref={canvasRef}/><div className="immersive-world__vignette"/><div className="immersive-world__scanline"/></div>;
}
