import type { Metadata } from "next";
import { Suspense } from "react";
import { SplitLines } from "@/src/components/motion/SplitLines";
import { ProjectsExplorer } from "@/src/components/projects/ProjectsExplorer";
import { Unavailable } from "@/src/components/ui/Unavailable";
import { getProjects } from "@/src/lib/api/content";

export const metadata: Metadata = {
  title: "Projets",
  description: "Marketplaces, SaaS, applications et sites livrés par Charles / MBOKO CODE : le problème, la solution et la stack.",
  alternates: { canonical: "/projets" },
};

async function Explorer() {
  const result = await getProjects();
  if (!result.ok) return <Unavailable what="Les projets" />;
  return (
    // useSearchParams (filtre dans l'URL) se lit au moment de la requête.
    <Suspense fallback={null}>
      <ProjectsExplorer projects={result.data} />
    </Suspense>
  );
}

// Projets — « l'index » : un catalogue filtrable en grille éditoriale ou en liste.
export default function ProjectsPage() {
  return (
    <div className="shell pb-24 pt-[calc(var(--header-h)+3rem)] md:pb-36">
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <SplitLines
          as="h1"
          mode="intro"
          className="text-mega font-semibold md:col-span-8"
          lines={["Ce que j'ai", <>construit.</>]}
        />
        <p className="intro-fade text-lg text-fg-muted md:col-span-4" style={{ "--intro-delay": "500ms" } as React.CSSProperties}>
          Chaque projet a son contexte, ses contraintes et ses choix. Ouvre une étude de cas pour voir le problème posé
          et la façon dont je l&apos;ai résolu.
        </p>
      </div>
      <div className="mt-16">
        <Suspense fallback={<div className="h-[60vh] animate-pulse rounded-(--radius) bg-bg-raised" />}>
          <Explorer />
        </Suspense>
      </div>
    </div>
  );
}
