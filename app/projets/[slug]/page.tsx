import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FinalCta } from "@/src/components/home/FinalCta";
import { SplitLines } from "@/src/components/motion/SplitLines";
import { CaseCover } from "@/src/components/projects/CaseCover";
import { NumberTicker } from "@/src/components/magic/NumberTicker";
import { ChapterNav } from "@/src/components/projects/ChapterNav";
import { ProjectVisual } from "@/src/components/projects/ProjectVisual";
import { ActionLink } from "@/src/components/ui/ActionLink";
import { apiFetch } from "@/src/lib/api/client";
import { getProject, getProjects } from "@/src/lib/api/content";
import type { ApiList, Project, ProjectSummary } from "@/src/lib/api/types";
import { pad2, statusLabels } from "@/src/lib/format";

export async function generateStaticParams() {
  try {
    const { data } = await apiFetch<ApiList<ProjectSummary>>("/projects?limit=50", { timeoutMs: 5000 });
    if (data.length > 0) return data.map((project) => ({ slug: project.slug }));
  } catch {
    // API indisponible pendant le build : les pages seront rendues à la première visite.
  }
  return [{ slug: "koumale" }];
}

export async function generateMetadata({ params }: PageProps<"/projets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProject(slug);
  if (!result.ok) return { title: "Projet introuvable", robots: { index: false } };
  const project = result.data;
  const image = project.ogImage ?? project.coverImage?.url;
  return {
    title: project.seoTitle ?? `${project.title} — étude de cas`,
    description: project.seoDescription ?? project.shortDescription,
    alternates: { canonical: `/projets/${project.slug}` },
    openGraph: { images: image ? [{ url: image, alt: project.coverImage?.alt }] : undefined },
  };
}

// Un indicateur purement numérique (« 50+ ») défile jusqu'à sa valeur (Number Ticker, Magic UI) ;
// les autres (« 2–4 jours ») s'affichent tels quels.
function MetricValue({ value }: { value: string }) {
  const match = /^(\d+)(\D*)$/.exec(value.trim());
  if (!match) return <>{value}</>;
  return (
    <>
      <NumberTicker value={Number(match[1])} />
      {match[2]}
    </>
  );
}

type Chapter = { id: string; title: string; body?: string; list?: string[] };

function chaptersOf(project: Project): Chapter[] {
  const chapters: Chapter[] = [
    { id: "contexte", title: "Contexte", body: project.context },
    { id: "defi", title: "Le défi", body: project.challenge },
    { id: "contribution", title: "Ma contribution", body: project.roleAndContribution },
    { id: "solution", title: "La solution", body: project.solution, list: project.features },
    { id: "decisions", title: "Choix techniques", list: project.decisions },
    { id: "resultat", title: "Résultat", body: project.results },
    { id: "suite", title: "Et ensuite", body: project.futureImprovements },
  ];
  return chapters.filter((chapter) => chapter.body || (chapter.list && chapter.list.length > 0));
}

async function CaseStudy({ params }: { params: PageProps<"/projets/[slug]">["params"] }) {
  const { slug } = await params;
  const [result, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!result.ok) {
    if (result.notFound) notFound();
    throw new Error("Étude de cas indisponible");
  }
  const project = result.data;
  const chapters = chaptersOf(project);
  const siblings = all.ok ? all.data : [];
  const position = siblings.findIndex((item) => item.slug === project.slug);
  const next = siblings.length > 1 ? siblings[(position + 1) % siblings.length] : undefined;

  return (
    <article>
      <header className="shell pt-[calc(var(--header-h)+3rem)]">
        <nav aria-label="Fil d'Ariane" className="label intro-fade text-fg-subtle">
          <Link href="/projets" className="link-draw hover:text-fg">
            Projets
          </Link>{" "}
          / <span className="text-accent">{project.kicker}</span>
        </nav>
        <SplitLines as="h1" mode="intro" className="mt-6 text-mega font-semibold" lines={[project.title]} />
        <div className="intro-fade mt-10 grid gap-10 border-t hairline pt-8 md:grid-cols-12" style={{ "--intro-delay": "450ms" } as React.CSSProperties}>
          <p className="text-lead md:col-span-6">{project.shortDescription}</p>
          <dl className="grid grid-cols-2 gap-6 text-sm md:col-span-5 md:col-start-8">
            <div>
              <dt className="label text-fg-subtle">Statut</dt>
              <dd className="mt-2 text-accent">{statusLabels[project.status]}</dd>
            </div>
            {project.technologies.length > 0 && (
              <div>
                <dt className="label text-fg-subtle">Stack</dt>
                <dd className="mt-2 text-fg-muted">{project.technologies.join(", ")}</dd>
              </div>
            )}
            {(project.liveUrl || project.repositoryUrl) && (
              <div className="col-span-2 flex flex-wrap gap-3">
                {project.liveUrl && (
                  <ActionLink href={project.liveUrl} external>
                    Voir le projet en ligne
                  </ActionLink>
                )}
                {project.repositoryUrl && (
                  <ActionLink href={project.repositoryUrl} external variant="secondary">
                    Code source
                  </ActionLink>
                )}
              </div>
            )}
          </dl>
        </div>
      </header>

      {project.coverImage && <CaseCover image={project.coverImage} />}

      {project.metrics.length > 0 && (
        <div className="shell mt-20">
          <section
            aria-label="Indicateurs"
            className={`grid gap-px overflow-hidden rounded-(--radius) border hairline bg-line sm:grid-cols-2 ${project.metrics.length >= 3 ? "lg:grid-cols-3" : ""}`}
          >
            {project.metrics.map((metric) => (
              <div key={metric.label} className="bg-bg p-8 md:p-10">
                <p className="text-title font-semibold text-accent">
                  <MetricValue value={metric.value} />
                </p>
                <p className="mt-3 text-fg-muted">{metric.label}</p>
              </div>
            ))}
          </section>
        </div>
      )}

      {chapters.length > 0 ? (
        <div className="shell mt-24 grid gap-12 md:mt-36 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <ChapterNav chapters={chapters.map(({ id, title }) => ({ id, title }))} />
            </div>
          </aside>
          <div className="space-y-24 lg:col-span-8 lg:col-start-5">
            {chapters.map((chapter, index) => (
              <section key={chapter.id} id={chapter.id} aria-labelledby={`${chapter.id}-title`} className="scroll-mt-32">
                <p className="label text-accent">
                  {pad2(index + 1)}
                </p>
                <SplitLines id={`${chapter.id}-title`} className="mt-3 text-title font-semibold" lines={[chapter.title]} />
                {chapter.body && (
                  <p className="mt-8 max-w-[60ch] text-lead text-fg-muted">
                    {chapter.body}
                  </p>
                )}
                {chapter.list && chapter.list.length > 0 && (
                  <ul className="mt-8 border-t hairline">
                    {chapter.list.map((item, i) => (
                      <li key={item} className="flex gap-6 border-b hairline py-5 text-lg">
                        <span className="label pt-1.5 text-fg-subtle">{pad2(i + 1)}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      ) : (
        <p className="shell mt-24 max-w-2xl text-lead text-fg-muted">
          L&apos;étude de cas complète sera publiée à la livraison du projet.
        </p>
      )}

      {project.gallery.length > 1 && (
        <section aria-label="Galerie" className="shell mt-24 md:mt-36">
          <ul className="flex snap-x gap-6 overflow-x-auto pb-6 [scrollbar-width:thin]">
            {project.gallery.map((image) => {
              const tall = (image.height ?? 1) > (image.width ?? 1);
              return (
                <li key={image.url} className="shrink-0 snap-start">
                  <figure>
                    <div
                      className={`relative overflow-hidden rounded-(--radius) border hairline bg-bg-raised ${tall ? "h-[70vh] max-h-[44rem]" : "h-[50vh] max-h-[34rem]"}`}
                      style={{ aspectRatio: `${image.width ?? 4} / ${image.height ?? 3}` }}
                    >
                      <Image src={image.url} alt={image.alt} fill sizes="80vw" className="object-cover object-top" />
                    </div>
                    <figcaption className="mt-3 text-sm text-fg-subtle">{image.alt}</figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {next && (
        <nav aria-label="Projet suivant" className="shell mt-24 md:mt-36">
          <Link href={`/projets/${next.slug}`} className="group grid gap-8 border-t hairline py-12 md:grid-cols-12 md:items-center">
            <div className="md:col-span-8">
              <p className="label text-fg-subtle">Projet suivant</p>
              <p className="mt-4 text-display font-semibold transition-transform duration-700 ease-(--ease-expo) group-hover:translate-x-4">
                {next.title}
              </p>
              <p className="mt-3 text-fg-muted">{next.kicker}</p>
            </div>
            {next.coverImage && (
              <div className="relative hidden aspect-4/3 overflow-hidden rounded-(--radius) md:col-span-4 md:block">
                <ProjectVisual image={next.coverImage} sizes="30vw" className="transition-transform duration-1000 ease-(--ease-expo) group-hover:scale-105" />
              </div>
            )}
          </Link>
        </nav>
      )}

      <div className="mt-12">
        <FinalCta title="Un projet similaire ?" />
      </div>
    </article>
  );
}

// Étude de cas — « le récit » : couverture qui s'ouvre, chapitres numérotés et sommaire épinglé.
export default function ProjectPage({ params }: PageProps<"/projets/[slug]">) {
  return (
    <Suspense fallback={<div className="shell h-screen pt-40" aria-hidden><div className="h-40 animate-pulse rounded-xl bg-bg-raised" /></div>}>
      <CaseStudy params={params} />
    </Suspense>
  );
}
