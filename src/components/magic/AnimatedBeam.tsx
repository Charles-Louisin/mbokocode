"use client";

import { motion, useReducedMotion } from "motion/react";
import { type RefObject, useEffect, useId, useState } from "react";

// Adapté de Magic UI « Animated Beam » (https://magicui.design/docs/components/animated-beam, MIT) :
// un trait relie deux éléments et une lueur le parcourt. Couleurs du site, lueur figée en
// mouvement réduit, calcul du tracé déclenché par ResizeObserver (jamais en direct dans l'effet).

type AnimatedBeamProps = {
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  duration?: number;
  delay?: number;
};

export function AnimatedBeam({ containerRef, fromRef, toRef, curvature = 0, reverse = false, duration = 4, delay = 0 }: AnimatedBeamProps) {
  const id = useId();
  const reduce = useReducedMotion();
  const [path, setPath] = useState({ d: "", width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () => {
      const from = fromRef.current;
      const to = toRef.current;
      if (!from || !to) return;
      const box = container.getBoundingClientRect();
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      const sx = a.left - box.left + a.width / 2;
      const sy = a.top - box.top + a.height / 2;
      const ex = b.left - box.left + b.width / 2;
      const ey = b.top - box.top + b.height / 2;
      setPath({ d: `M ${sx},${sy} Q ${(sx + ex) / 2},${sy - curvature} ${ex},${ey}`, width: box.width, height: box.height });
    };
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, fromRef, toRef, curvature]);

  const x1 = reverse ? ["90%", "-10%"] : ["10%", "110%"];
  const x2 = reverse ? ["100%", "0%"] : ["0%", "100%"];

  return (
    <svg
      aria-hidden
      fill="none"
      width={path.width}
      height={path.height}
      viewBox={`0 0 ${path.width} ${path.height}`}
      className="pointer-events-none absolute left-0 top-0"
    >
      {/* Les variables CSS ne sont lues que dans style, pas dans les attributs SVG. */}
      <path d={path.d} style={{ stroke: "var(--line)" }} strokeWidth={2} strokeLinecap="round" />
      <path d={path.d} stroke={`url(#${id})`} strokeWidth={2} strokeLinecap="round" />
      <defs>
        <motion.linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
          animate={reduce ? { x1: "40%", x2: "60%", y1: "0%", y2: "0%" } : { x1, x2, y1: ["0%", "0%"], y2: ["0%", "0%"] }}
          transition={{ delay, duration, ease: [0.16, 1, 0.3, 1], repeat: reduce ? 0 : Infinity }}
        >
          <stop style={{ stopColor: "var(--color-cobalt-soft)", stopOpacity: 0 }} />
          <stop style={{ stopColor: "var(--color-cobalt-soft)" }} />
          <stop offset="32.5%" style={{ stopColor: "var(--color-cobalt)" }} />
          <stop offset="100%" style={{ stopColor: "var(--color-cobalt)", stopOpacity: 0 }} />
        </motion.linearGradient>
      </defs>
    </svg>
  );
}
