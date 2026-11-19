import React, { useEffect, useRef, useState } from "react";

interface KineticTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  staggerMs?: number;
  mode?: "word" | "char";
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  as: Tag = "span",
  className = "",
  staggerMs = 36,
  mode = "word",
}) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  // Auto-protect Bangla/Indic script from breaking ligatures by always using word mode
  const hasIndic = /[\u0980-\u09FF]/.test(text);
  const effectiveMode = hasIndic ? "word" : mode;
  const units = effectiveMode === "char" ? Array.from(text) : text.split(" ");

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
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      className={`kinetic-wrap ${className}`}
      data-visible={visible}
    >
      {units.map((unit, idx) => (
        <span
          key={`${unit}-${idx}`}
          className="kinetic-unit"
          style={{ ["--delay" as string]: `${idx * staggerMs}ms` }}
        >
          {unit === " " ? "\u00A0" : unit}
          {effectiveMode === "word" && idx < units.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
};
