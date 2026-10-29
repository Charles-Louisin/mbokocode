"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import type { ProjectSummary } from "@/src/lib/api/types";
import { statusLabels } from "@/src/lib/format";
import { ProjectVisual } from "./ProjectVisual";

// Index éditorial des projets : une ligne par projet. Sur ordinateur, un aperçu du visuel
// suit le pointeur au survol ; sur écran tactile, la vignette est intégrée à la ligne.
export function ProjectIndex({ projects }: { projects: ProjectSummary[] }) {
  const [active, setActive] = useState<ProjectSummary | null>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

  return (
    <div
      className="relative"
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        x.set(event.clientX);
        y.set(event.clientY);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="group/list border-t hairline">
        {projects.map((project) => (
          <li key={project.id}>
            <Link
              href={`/projets/${project.slug}`}
              onPointerEnter={(event) => event.pointerType === "mouse" && setActive(project)}
              onFocus={() => setActive(null)}
              className="group grid items-baseline gap-x-6 gap-y-3 border-b hairline py-6 md:grid-cols-12 md:py-8"
            >
              <span className="text-[clamp(1.9rem,5.4vw,5rem)] font-semibold leading-none tracking-[-0.03em] [font-stretch:125%] transition-[transform,color] duration-500 ease-(--ease-expo) group-hover:translate-x-3 group-hover/list:text-fg-subtle group-hover:text-fg! md:col-span-7">
                {project.title}
              </span>
              <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-fg-muted md:col-span-5 md:justify-end md:text-right">
                <span>{project.kicker}</span>
                <span className="label text-accent">{statusLabels[project.status]}</span>
              </span>
              {project.coverImage && (
                <span className="relative block aspect-video overflow-hidden rounded-lg bg-bg-raised lg:hidden">
                  <ProjectVisual image={project.coverImage} sizes="100vw" />
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-30 hidden lg:block"
          style={{ x: springX, y: springY }}
        >
          {/* Centrage séparé : Motion écrit son propre transform sur l'aperçu animé. */}
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            <AnimatePresence>
              {active?.coverImage && (
                <motion.div
                  key={active.id}
                  className="absolute inset-0 overflow-hidden rounded-2xl bg-ink-3 shadow-2xl"
                  initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProjectVisual image={active.coverImage} sizes="26rem" />
                </motion.div>
              )}
            </AnimatePresence>
            <div style={{ width: "26rem", aspectRatio: "4 / 3" }} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
