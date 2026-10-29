"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import GlassFolder, { type FolderFile, hashString } from "@/src/components/ui/glass-folder-cards";
import type { ProjectSummary } from "@/src/lib/api/types";
import { statusLabels } from "@/src/lib/format";

// Un projet = un dossier en verre (Glass Folder Cards, 21st.dev). Le capot laisse voir la capture
// du projet ; un clic ouvre en éventail l'étude de cas, l'aperçu et la démo en ligne quand elle existe. Sous le dossier,
// le résumé et un lien direct restent lisibles sans JavaScript et pour les lecteurs d'écran.

const MAX_WIDTH = 380;
// À l'ouverture, l'éventail de cartes déborde du dossier : on lui garde de la place sur les côtés.
const FAN_ROOM = 0.86;

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ProjectFolder({ project, appearDelay = 0 }: { project: ProjectSummary; appearDelay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);

  // La scène du dossier est dessinée en px : on suit la largeur réelle de la colonne.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(Math.min(MAX_WIDTH, Math.floor(entry.contentRect.width * FAN_ROOM)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const caseUrl = `/projets/${project.slug}`;
  const files: FolderFile[] = [
    { name: "Étude de cas", meta: "Lire", href: caseUrl },
    ...(project.coverImage ? [{ name: "Aperçu", meta: project.kicker, image: project.coverImage.url, href: caseUrl }] : []),
    // La démo en dernier : c'est la carte du dessus, la plus visible quand le dossier s'ouvre.
    ...(project.liveUrl ? [{ name: "Voir la démo ↗", meta: hostOf(project.liveUrl), href: project.liveUrl, art: "mboko" as const }] : []),
  ];

  return (
    <article className="flex flex-col items-center">
      <div ref={ref} className="flex w-full justify-center">
        <GlassFolder
          label={project.title}
          meta={statusLabels[project.status]}
          tone="dark"
          image={project.coverImage?.url}
          art="mboko"
          seed={hashString(project.slug) % 97}
          files={files}
          action="none"
          width={width}
          appearDelay={appearDelay}
        />
      </div>
      <div className="mt-6 w-full max-w-[380px] text-center">
        {/* Le titre est déjà écrit sur le dossier : on le garde ici pour la structure et les lecteurs d'écran. */}
        <h3 className="sr-only">{project.title}</h3>
        <p className="text-sm font-medium text-fg">{project.kicker}</p>
        <p className="mt-2 text-fg-muted">{project.shortDescription}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6">
          <Link href={caseUrl} className="link-draw inline-flex min-h-11 items-center text-sm font-medium">
            Voir l&apos;étude de cas<span className="sr-only"> {project.title}</span>
          </Link>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="link-draw inline-flex min-h-11 items-center text-sm font-medium text-accent">
              Voir la démo ↗<span className="sr-only"> de {project.title} (nouvel onglet)</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
