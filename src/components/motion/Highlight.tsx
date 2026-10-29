"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/src/lib/cn";

// Surligneur : un trait de marqueur cobalt passe sous les mots quand ils entrent à l'écran
// (dans l'esprit du « Text Highlighter » de Magic UI). Le texte reste lisible avant et sans animation.
export function Highlight({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={cn(
        "box-decoration-clone rounded-[0.18em] bg-linear-to-r from-cobalt to-cobalt bg-no-repeat px-[0.12em] text-ivory [background-position:0_88%]",
        className,
      )}
      initial={{ backgroundSize: reduce ? "100% 100%" : "0% 100%" }}
      whileInView={{ backgroundSize: "100% 100%" }}
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.span>
  );
}
