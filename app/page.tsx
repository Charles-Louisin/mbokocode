import { Suspense } from "react";
import { Capabilities } from "@/src/components/home/Capabilities";
import { CreatorSection } from "@/src/components/home/CreatorSection";
import { FeaturedProjects, FeaturedProjectsSkeleton } from "@/src/components/home/FeaturedProjects";
import { ProjectStarter } from "@/src/components/contact/ProjectStarter";
import { Hero } from "@/src/components/home/Hero";
import { Manifesto } from "@/src/components/home/Manifesto";
import { MethodTimeline } from "@/src/components/home/MethodTimeline";
import { PricingTeaser } from "@/src/components/home/PricingTeaser";
import { ReviewsSection } from "@/src/components/home/ReviewsSection";
import { TechMarquee } from "@/src/components/home/TechMarquee";
import { PixelTransition } from "@/src/components/motion/PixelTransition";
import { ActionLink } from "@/src/components/ui/ActionLink";
import { getContent, getPricing } from "@/src/lib/api/content";
import { getChannels } from "@/src/lib/channels";
import { estimatesFrom } from "@/src/lib/project-brief";

// « Ton idée, mon prochain build » a besoin du numéro WhatsApp (réglages du site) pour son lien prérempli.
async function Starter() {
  const [{ whatsappNumber }, pricing] = await Promise.all([getChannels(), getPricing()]);
  return <ProjectStarter whatsappNumber={whatsappNumber} estimates={pricing.ok ? estimatesFrom(pricing.data) : null} />;
}

// La méthode vient du contenu enregistré en base ; sans contenu, la section n'est pas affichée.
async function Method() {
  const content = await getContent();
  if (!content.ok || content.data.method.length === 0) return null;
  return <MethodTimeline method={content.data.method} />;
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <Suspense fallback={<FeaturedProjectsSkeleton />}>
        <FeaturedProjects />
      </Suspense>
      <Suspense fallback={null}>
        <Capabilities />
      </Suspense>
      <PixelTransition />
      <Suspense fallback={null}>
        <Method />
      </Suspense>
      <Manifesto />
      <Suspense fallback={null}>
        <CreatorSection />
      </Suspense>
      <Suspense fallback={null}>
        <PricingTeaser />
      </Suspense>
      <Suspense fallback={null}>
        <ReviewsSection />
      </Suspense>
      <section aria-labelledby="lab-teaser-title" className="shell pb-24 md:pb-36">
        <div className="grid gap-8 rounded-(--radius) border hairline p-8 md:grid-cols-12 md:items-center md:p-12">
          <div className="md:col-span-8">
            <h2 id="lab-teaser-title" className="text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-tight tracking-[-0.03em]">
              Cinq mini-jeux d&apos;une minute : écrase des bugs, vise au pixel, bats la latence.
            </h2>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <ActionLink href="/lab" variant="secondary">
              Entrer dans la salle
            </ActionLink>
          </div>
        </div>
      </section>
      <Suspense fallback={<ProjectStarter whatsappNumber={null} estimates={null} />}>
        <Starter />
      </Suspense>
    </>
  );
}
