"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProjectCategory, ProjectSummary } from "@/src/lib/api/types";
import { categoryLabels } from "@/src/lib/format";
import { ProjectIndex } from "./ProjectIndex";
import { ProjectFolder } from "./ProjectFolder";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProjectsExplorer({ projects }: { projects: ProjectSummary[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();

  const categories = [...new Set(projects.map((project) => project.category))];
  const raw = searchParams.get("categorie");
  const active = categories.includes(raw as ProjectCategory) ? (raw as ProjectCategory) : null;
  const view = searchParams.get("vue") === "liste" ? "liste" : "grille";
  const visible = active ? projects.filter((project) => project.category === active) : projects;

  // Le filtre et la vue vivent dans l'URL : un lien partagé montre exactement la même sélection.
  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div>
      <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-y hairline py-4">
        <LayoutGroup id="filters">
          <div role="group" aria-label="Filtrer par catégorie" className="flex flex-wrap gap-2">
            {[null, ...categories].map((category) => {
              const selected = category === active;
              const count = category ? projects.filter((project) => project.category === category).length : projects.length;
              return (
                <button
                  key={category ?? "all"}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setParam("categorie", category)}
                  className={`relative min-h-11 rounded-full px-4 py-2.5 text-sm transition-colors duration-300 ${selected ? "text-bg" : "text-fg-muted hover:text-fg"}`}
                >
                  {selected && (
                    <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-fg" transition={{ duration: 0.5, ease: EASE }} />
                  )}
                  <span className="relative">
                    {category ? categoryLabels[category] : "Tous"} <span className="opacity-60">{count}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
        <div role="group" aria-label="Affichage" className="flex gap-1 text-sm">
          {(["grille", "liste"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={view === mode}
              onClick={() => setParam("vue", mode === "grille" ? null : mode)}
              className="label min-h-11 rounded-full px-4 py-2.5 capitalize text-fg-subtle aria-pressed:text-fg aria-pressed:underline"
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <h2 className="sr-only">Liste des projets</h2>
      <p aria-live="polite" className="sr-only">
        {visible.length} projet{visible.length > 1 ? "s" : ""} affiché{visible.length > 1 ? "s" : ""}
      </p>

      {visible.length === 0 ? (
        <p className="py-24 text-center text-fg-muted">
          Aucun projet dans cette catégorie pour l&apos;instant.{" "}
          <button type="button" onClick={() => setParam("categorie", null)} className="link-draw text-fg">
            Voir tous les projets
          </button>
        </p>
      ) : view === "liste" ? (
        <ProjectIndex projects={visible} />
      ) : (
        <ul className="grid items-start gap-x-10 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, index) => (
              <motion.li
                key={project.id}
                layout={!reduce}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: EASE }}
                
              >
                <ProjectFolder project={project} appearDelay={(index % 3) * 140} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
