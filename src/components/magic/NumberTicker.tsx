"use client";

import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

// Adapté de Magic UI « Number Ticker » (https://magicui.design/docs/components/number-ticker, MIT).
// Le texte serveur affiche déjà la valeur finale : sans JS ou en mouvement réduit, rien ne bouge,
// et le compteur ne part de zéro qu'une fois visible.
export function NumberTicker({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  useEffect(() => {
    if (reduce || !inView || !ref.current) return;
    ref.current.textContent = "0";
    motionValue.set(value);
  }, [inView, reduce, value, motionValue]);

  useEffect(
    () =>
      spring.on("change", (latest) => {
        if (ref.current) ref.current.textContent = new Intl.NumberFormat("fr-FR").format(Math.round(latest));
      }),
    [spring],
  );

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {new Intl.NumberFormat("fr-FR").format(value)}
    </span>
  );
}
