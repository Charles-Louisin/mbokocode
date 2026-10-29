"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/src/lib/cn";

// Adapté de Magic UI « Magic Card » (https://magicui.design/docs/components/magic-card, MIT),
// mode « gradient » : la bordure s'éclaire en cobalt sous le pointeur et un halo discret suit la souris.
// Version allégée : pas de dépendance à next-themes, couleurs prises dans les jetons du site.

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  size?: number;
  from?: string;
  to?: string;
  glow?: string;
};

export function SpotlightCard({
  children,
  className,
  size = 260,
  from = "var(--color-cobalt)",
  to = "var(--color-cobalt-soft)",
  glow = "color-mix(in srgb, var(--color-cobalt) 18%, transparent)",
}: SpotlightCardProps) {
  const x = useMotionValue(-size);
  const y = useMotionValue(-size);

  return (
    <motion.div
      className={cn("group relative isolate rounded-(--radius) border border-transparent", className)}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left);
        y.set(event.clientY - rect.top);
      }}
      onPointerLeave={() => {
        x.set(-size);
        y.set(-size);
      }}
      style={{
        background: useMotionTemplate`linear-gradient(var(--bg-raised) 0 0) padding-box, radial-gradient(${size}px circle at ${x}px ${y}px, ${from}, ${to}, var(--line) 100%) border-box`,
      }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-px -z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, ${glow}, transparent 100%)` }}
      />
      {children}
    </motion.div>
  );
}
