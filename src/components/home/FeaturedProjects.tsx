import { SplitLines } from "@/src/components/motion/SplitLines";
import { ProjectFolder } from "@/src/components/projects/ProjectFolder";
import { ActionLink } from "@/src/components/ui/ActionLink";
import { Carousel } from "@/src/components/ui/Carousel";
import { Unavailable } from "@/src/components/ui/Unavailable";
import { getProjects } from "@/src/lib/api/content";

export async function FeaturedProjects() {
  const result = await getProjects();
  const featured = result.ok ? result.data.filter((project) => project.isFeatured).slice(0, 3) : [];
  const total = result.ok ? result.data.length : 0;

  return (
    <section aria-labelledby="selection-title" className="shell py-24 md:py-36">
      <div className="mb-14 grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <SplitLines
            id="selection-title"
            className="text-display font-semibold"
            lines={[
              "Des produits",
              <>
                livrés, pas des maquettes.
              </>,
            ]}
          />
        </div>
        <p className="text-fg-muted md:col-span-4">
          Marketplace, SaaS, applications et vitrines : pour chacun, le problème posé, ma contribution et ce qui
          tourne aujourd&apos;hui.
        </p>
      </div>

      {result.ok ? (
        // Dossiers en verre posés sur un bureau pointillé (Glass Folder Cards, 21st.dev).
        <div className="relative rounded-(--radius) border hairline px-4 py-16 md:px-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] text-fg opacity-[0.1]"
            style={{ backgroundImage: "radial-gradient(currentColor 1.1px, transparent 1.4px)", backgroundSize: "22px 22px" }}
          />
          {/* Sur mobile, un dossier par écran, à faire défiler de gauche à droite ; grille au-delà. */}
          <div className="relative">
            <Carousel
              label="Projets à la une"
              mobileOnly
              bleed={false}
              // Place au-dessus du dossier pour l'éventail de cartes, que la piste de défilement couperait sinon.
              slideClassName="pt-14 md:pt-0"
              desktopClassName="md:grid md:grid-cols-2 md:items-start md:gap-x-10 md:gap-y-16 xl:grid-cols-3"
              slides={featured.map((project, index) => ({
                key: project.id,
                node: <ProjectFolder project={project} appearDelay={index * 140} />,
              }))}
            />
          </div>
        </div>
      ) : (
        <Unavailable what="Les projets" />
      )}

      {total > featured.length && (
        <div className="mt-12 flex justify-end">
          <ActionLink href="/projets" variant="secondary">
            Les {total} projets
          </ActionLink>
        </div>
      )}
    </section>
  );
}

export function FeaturedProjectsSkeleton() {
  return (
    <div className="shell py-24 md:py-36" aria-hidden>
      <div className="h-40 max-w-2xl animate-pulse rounded-xl bg-bg-raised" />
      <div className="mt-14 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-bg-raised" />
        ))}
      </div>
    </div>
  );
}
