import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/src/components/brand/LogoMark";
import { BrowserFrame, PhoneFrame } from "@/src/components/magic/DeviceFrame";
import { DottedMap } from "@/src/components/magic/DottedMap";
import { SplitLines } from "@/src/components/motion/SplitLines";
import { StickyStackItem } from "@/src/components/motion/StickyStackItem";
import { getContent, getProjects, getServices } from "@/src/lib/api/content";
import type { ProjectSummary, Service } from "@/src/lib/api/types";
import { pad2 } from "@/src/lib/format";
import { ArchitectureBeam } from "./ArchitectureBeam";

// Ce que je construis : une pile de cartes. En défilant, chaque savoir-faire vient se poser sur le
// précédent (comme sur /services). Chaque carte montre le savoir-faire au lieu de le décrire :
// schéma d'API animé, vraies captures dans leurs appareils, carte des projets en ligne.
// Savoir-faire, projets et lieux viennent tous de la base.

function cover(projects: ProjectSummary[], slug: string) {
  return projects.find((project) => project.slug === slug)?.coverImage;
}

function StackCard({ index, visual, children }: { index: number; visual: ReactNode; children: ReactNode }) {
  return (
    <StickyStackItem index={index}>
      <article
        className={`relative grid overflow-hidden rounded-(--radius) border hairline shadow-[0_-20px_60px_rgb(0_0_0/0.35)] md:min-h-[26rem] md:grid-cols-2 ${
          index % 2 === 1 ? "surface-ivory" : "bg-ink-2"
        }`}
      >
        <LogoMark className="pointer-events-none absolute -right-10 -top-6 w-72 opacity-[0.05]" />
        <div className="relative flex min-h-56 items-center justify-center overflow-hidden px-6 pt-6 md:order-2 md:pt-0">{visual}</div>
        <div className="relative flex flex-col justify-end p-7 md:p-12">{children}</div>
      </article>
    </StickyStackItem>
  );
}

function ServiceText({ service, index, titles }: { service: Service; index: number; titles: Map<string, string> }) {
  const proofs = service.proofs.filter((slug) => titles.has(slug));
  return (
    <>
      <p className="label text-accent">{pad2(index + 1)}</p>
      <h3 className="mt-4 text-[clamp(1.8rem,3.4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.03em]">{service.name}</h3>
      <p className="mt-4 max-w-[48ch] text-lg text-fg-muted">{service.summary}</p>
      {proofs.length > 0 && (
        <p className="mt-5 text-sm text-fg-subtle">
          Par exemple{" "}
          {proofs.map((slug, i) => (
            <span key={slug}>
              {i > 0 && " et "}
              <Link href={`/projets/${slug}`} className="link-draw text-fg">
                {titles.get(slug)}
              </Link>
            </span>
          ))}
        </p>
      )}
    </>
  );
}

export async function Capabilities() {
  const [servicesResult, projectsResult, contentResult] = await Promise.all([getServices(), getProjects(), getContent()]);
  if (!servicesResult.ok || servicesResult.data.length === 0) return null;
  const services = servicesResult.data;
  const projects = projectsResult.ok ? projectsResult.data : [];
  const places = contentResult.ok ? contentResult.data.places : [];
  const titles = new Map(projects.map((project) => [project.slug, project.title]));
  const phone = cover(projects, "mes-poches");
  const site = cover(projects, "monde-delice");

  // Visuel propre à chaque savoir-faire connu ; un nouveau savoir-faire ajouté en base garde le logo.
  const visuals: Record<string, ReactNode> = {
    plateformes: <ArchitectureBeam />,
    applications: phone ? <PhoneFrame image={phone} sizes="12rem" className="-mb-24 w-36 translate-y-4 md:w-44" /> : null,
    sites: site ? <BrowserFrame image={site} url="monde-delice.vercel.app" sizes="(min-width: 768px) 40vw, 90vw" className="-mb-10 w-[92%]" /> : null,
    evolution: <EvolutionVisual />,
  };

  return (
    <section aria-labelledby="capabilities-title" className="shell py-24 md:py-36">
      <div className="mb-14 grid gap-8 md:grid-cols-12 md:items-end">
        <SplitLines id="capabilities-title" className="text-title font-semibold md:col-span-7" lines={["Du premier écran", "au produit en ligne."]} />
        <p className="text-fg-muted md:col-span-5">
          Je travaille seul, en direct avec toi : la personne qui cadre ton projet est celle qui l&apos;écrit et le met en
          ligne.
        </p>
      </div>

      <ol>
        {services.map((service, index) => (
          <StackCard key={service.slug} index={index} visual={visuals[service.slug] ?? null}>
            <ServiceText service={service} index={index} titles={titles} />
          </StackCard>
        ))}
        {places.length > 0 && (
          <StackCard
            index={services.length}
            visual={<DottedMap markers={places} width={100} height={90} region={{ lat: { min: -12, max: 58 }, lng: { min: -26, max: 42 } }} />}
          >
            <h3 className="text-[clamp(1.8rem,3.4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.03em]">Là où tournent mes projets</h3>
            <p className="mt-4 max-w-[48ch] text-lg text-fg-muted">Basé à Douala, je livre à distance.</p>
            <ul className="mt-5 space-y-1.5 text-sm">
              {places.map((place) => (
                <li key={place.label} className="flex items-center gap-2">
                  <span aria-hidden className="size-2 rounded-full bg-cobalt-soft" />
                  {place.label}
                </li>
              ))}
            </ul>
          </StackCard>
        )}
      </ol>
    </section>
  );
}

// Refonte & suivi : avant / après schématique d'un écran, l'ancien grisé, le nouveau net.
function EvolutionVisual() {
  return (
    <div aria-hidden className="flex w-full max-w-sm items-end gap-3 pb-6">
      <div className="flex-1 space-y-2 rounded-xl border border-dashed border-line p-3 opacity-50">
        <div className="h-2 w-2/3 rounded bg-fg-subtle/40" />
        <div className="h-10 rounded bg-fg-subtle/20" />
        <div className="h-2 w-1/2 rounded bg-fg-subtle/40" />
        <div className="h-2 w-3/4 rounded bg-fg-subtle/30" />
      </div>
      <div className="flex-1 space-y-2 rounded-xl border border-cobalt/60 bg-ink p-3 shadow-[0_20px_60px_-20px_var(--color-cobalt)]">
        <div className="h-2 w-1/2 rounded bg-cobalt-soft" />
        <div className="h-14 rounded bg-linear-to-br from-cobalt to-cobalt-soft/60" />
        <div className="flex gap-1.5">
          <div className="h-5 flex-1 rounded-full bg-ivory" />
          <div className="h-5 flex-1 rounded-full border border-line" />
        </div>
      </div>
    </div>
  );
}
