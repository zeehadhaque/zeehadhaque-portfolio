import { lazy, Suspense, useEffect, useRef, useState } from "react";

const AcademyContent = lazy(async () => {
  const module = await import("./AcademySection");
  return { default: module.AcademySection };
});

export function DeferredAcademy() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const timer = window.setTimeout(() => setShouldLoad(true), 600);

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "1400px 0px" },
    );

    observer.observe(host);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={hostRef} className="academy-deferred" aria-busy={!shouldLoad}>
      {shouldLoad ? (
        <Suspense
          fallback={
            <div className="academy-deferred__loading" role="status">
              Preparing Zee Filmmaking Academy…
            </div>
          }
        >
          <AcademyContent />
        </Suspense>
      ) : (
        <div className="academy-deferred__placeholder" aria-hidden="true" />
      )}
    </div>
  );
}
