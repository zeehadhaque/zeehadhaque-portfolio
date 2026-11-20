import React, { useEffect, useRef, useState } from "react";

interface CrystalRevealProps {
  children: React.ReactNode;
  variant?: "rise" | "drop" | "prism" | "ray";
  delayMs?: number;
  className?: string;
}

export const CrystalReveal: React.FC<CrystalRevealProps> = ({
  children,
  variant = "rise",
  delayMs = 0,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`cr-reveal cr-reveal--${variant} ${className}`}
      data-visible={visible}
      style={{ ["--cr-delay" as string]: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
};

interface CrystalTextProps {
  text: string;
  staggerMs?: number;
  className?: string;
}

export const CrystalText: React.FC<CrystalTextProps> = ({
  text,
  staggerMs = 26,
  className = "",
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className={`cr-text-wrap ${className}`} data-visible={visible}>
      {words.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          className="cr-text-unit"
          style={{ ["--cr-delay" as string]: `${Math.min(idx * staggerMs, 480)}ms` }}
        >
          {word}
          {idx < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
};
