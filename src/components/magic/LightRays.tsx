"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import { cn } from "@/src/lib/cn";

// Adapté de Magic UI « Light Rays » (https://magicui.design/docs/components/light-rays, MIT).
// Rayons générés par une suite pseudo-aléatoire fixe (rendu serveur = rendu client) ; immobiles
// si l'utilisateur réduit les animations, et moins nombreux sur petit écran (voir l'appelant).

type Ray = { left: number; rotate: number; width: number; swing: number; delay: number; duration: number; intensity: number };

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function createRays(count: number, cycle: number): Ray[] {
  const random = seeded(7);
  return Array.from({ length: count }, () => ({
    left: 8 + random() * 84,
    rotate: -28 + random() * 56,
    width: 160 + random() * 160,
    swing: 0.8 + random() * 1.8,
    delay: random() * cycle,
    duration: cycle * (0.75 + random() * 0.5),
    intensity: 0.6 + random() * 0.5,
  }));
}

type LightRaysProps = { className?: string; count?: number; color?: string; blur?: number; speed?: number; length?: string };

export function LightRays({ className, count = 6, color = "rgba(47, 84, 255, 0.35)", blur = 36, speed = 14, length = "70vh" }: LightRaysProps) {
  const reduce = useReducedMotion();
  const rays = createRays(count, Math.max(speed, 0.1));

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 isolate overflow-hidden", className)}
      style={{ "--light-rays-color": color, "--light-rays-blur": `${blur}px`, "--light-rays-length": length } as CSSProperties}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(circle at 20% 15%, color-mix(in srgb, var(--light-rays-color) 45%, transparent), transparent 70%)" }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--light-rays-color) 35%, transparent), transparent 75%)" }}
      />
      {rays.map((ray, index) => (
        <motion.div
          key={index}
          // Les rayons au-delà du troisième ne s'affichent qu'à partir de la tablette (coût du flou).
          className={cn(
            "absolute -top-[12%] h-(--light-rays-length) origin-top -translate-x-1/2 rounded-full bg-linear-to-b from-[color-mix(in_srgb,var(--light-rays-color)_70%,transparent)] to-transparent mix-blend-screen blur-(--light-rays-blur)",
            index >= 3 && "hidden md:block",
          )}
          style={{ left: `${ray.left}%`, width: ray.width }}
          initial={{ rotate: ray.rotate, opacity: reduce ? ray.intensity * 0.6 : 0 }}
          animate={
            reduce
              ? undefined
              : { opacity: [0, ray.intensity, 0], rotate: [ray.rotate - ray.swing, ray.rotate + ray.swing, ray.rotate - ray.swing] }
          }
          transition={{ duration: ray.duration, repeat: Infinity, ease: "easeInOut", delay: ray.delay, repeatDelay: ray.duration * 0.1 }}
        />
      ))}
    </div>
  );
}
