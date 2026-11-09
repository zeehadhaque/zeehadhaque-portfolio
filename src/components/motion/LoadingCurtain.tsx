import { useEffect, useRef, useState } from "react";

interface LoadingCurtainProps {
  visible: boolean;
  reducedMotion: boolean;
  ready: boolean;
  onComplete: () => void;
}

export function LoadingCurtain({ visible, reducedMotion, ready, onComplete }: LoadingCurtainProps) {
  const [progress, setProgress] = useState(1);
  const completeRef = useRef(onComplete);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!visible) return;
    if (reducedMotion) {
      setProgress(100);
      return;
    }

    const duration = 760;
    let startedAt = 0;
    let frame = 0;

    const tick = (timestamp: number) => {
      if (!startedAt) startedAt = timestamp;
      const elapsed = Math.min(1, (timestamp - startedAt) / duration);
      const next = Math.min(100, 1 + Math.floor(elapsed * 99));
      setProgress((current) => next > current ? next : current);

      if (elapsed < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        setProgress(100);
      }
    };

    setProgress(1);
    frame = window.requestAnimationFrame(tick);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [visible, reducedMotion]);

  useEffect(() => {
    if (!visible || !ready || progress < 100) return;
    const finish = window.setTimeout(() => completeRef.current(), 150);
    return () => window.clearTimeout(finish);
  }, [visible, ready, progress]);

  return (
    <div
      className={`site-loader ${visible ? "is-visible" : "is-complete"}`}
      data-reduced-motion={reducedMotion}
      aria-hidden={!visible}
      role={visible ? "status" : undefined}
    >
      <div className="site-loader__mark" aria-hidden="true">
        <span>ZH</span>
        <i />
      </div>
      <div className="site-loader__counter" aria-live="off" aria-label={`Loading ${progress} percent`}>
        <strong>{progress}</strong>
        <span>/ 100</span>
      </div>
      <p>Entering the universe</p>
      <div className="site-loader__line" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
    </div>
  );
}
