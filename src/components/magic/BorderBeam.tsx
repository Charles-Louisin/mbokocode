"use client";

import { motion, useReducedMotion } from "motion/react";

// Adapté de Magic UI « Border Beam » (https://magicui.design/docs/components/border-beam, MIT) :
// un éclat lumineux parcourt la bordure. Masqué si l'utilisateur réduit les animations.
export function BorderBeam({
  size = 90,
  duration = 8,
  from = "var(--color-cobalt-soft)",
  to = "var(--color-cobalt)",
}: {
  size?: number;
  duration?: number;
  from?: string;
  to?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]"
    >
      <motion.div
        className="absolute aspect-square bg-linear-to-l from-(--beam-from) via-(--beam-to) to-transparent"
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            "--beam-from": from,
            "--beam-to": to,
          } as React.CSSProperties
        }
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration }}
      />
    </div>
  );
}
