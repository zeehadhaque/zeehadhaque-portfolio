interface LoadingCurtainProps {
  visible: boolean;
  reducedMotion: boolean;
}

export function LoadingCurtain({ visible, reducedMotion }: LoadingCurtainProps) {
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
      <p>Preparing the frame</p>
      <div className="site-loader__line" aria-hidden="true"><span /></div>
    </div>
  );
}
