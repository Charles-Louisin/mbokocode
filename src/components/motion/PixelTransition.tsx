"use client";

import { useRef } from "react";
import { cn } from "@/src/lib/cn";
import { useScrollScene } from "./useScrollScene";

// Transition en pixels entre une surface sombre et une surface claire, adaptée du tutoriel
// Codrops « Building a Minimal Architecture Studio Landing Page with Astro & GSAP » (2026) :
// une bande de cellules apparaît dans un ordre aléatoire au rythme du scroll.
// Sans animation, la bande est simplement pleine.

const COLS = 24;
const ROWS = 5;

export function PixelTransition({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollScene(ref, (root, { gsap }) => {
    gsap.fromTo(
      root.children,
      { scale: 0 },
      {
        scale: 1,
        ease: "none",
        stagger: { each: 0.02, from: "random", grid: [ROWS, COLS] },
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom 60%", scrub: 0.6 },
      },
    );
  });

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pixel-band pointer-events-none h-[clamp(4rem,10vw,9rem)] w-full", className)}
      style={{ "--pixel-cols": COLS, "--pixel-rows": ROWS } as React.CSSProperties}
    >
      {Array.from({ length: COLS * ROWS }, (_, index) => (
        <span key={index} className="-m-px bg-ivory" />
      ))}
    </div>
  );
}
