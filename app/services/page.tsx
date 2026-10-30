import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LogoMark } from "@/src/components/brand/LogoMark";
import { FinalCta } from "@/src/components/home/FinalCta";
import { SplitLines } from "@/src/components/motion/SplitLines";
import { StickyStackItem } from "@/src/components/motion/StickyStackItem";
import { ActionLink } from "@/src/components/ui/ActionLink";
import { Unavailable } from "@/src/components/ui/Unavailable";
import { getContent, getPricing, getProjects, getRates, getServices } from "@/src/lib/api/content";
import type { PricingPackage, Rates } from "@/src/lib/api/types";
import { convertedPrice, formatPrice, pad2 } from "@/src/lib/format";

export const metadata: Metadata = {
  title: "Services",
  description: "Plateformes et SaaS, applications web et mobiles, sites et e-commerce, refonte et automatisation : ce que je construis et comment.",
  alternates: { canonical: "/services" },
};

async function ProofLinks({ slugs }: { slugs: string[] }) {
  const result = await getProjects();
  if (!result.ok) return null;
  const proofs = result.data.filter((project) => slugs.includes(project.slug));
  if (proofs.length === 0) return null;
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <span className="label text-fg-subtle">Réalisé pour</span>
      {proofs.map((project) => (
        <Link key={project.slug} href={`/projets/${project.slug}`} className="rounded-full border hairline px-4 py-2 text-sm transition-colors hover:border-fg">
          {project.title}
        </Link>
      ))}
    </div>
  );
}

// Offres (slugs MongoDB) qui chiffrent chaque savoir-faire : on affiche la moins chère.
const SERVICE_OFFERS: Record<string, string[]> = {
  sites: ["landing-page", "site-vitrine", "e-commerce"],
  evolution: ["refonte"],
  plateformes: ["sur-mesure"],
  applications: ["sur-mesure"],
};

function startingPrice(serviceSlug: string, offers: PricingPackage[], rates: Rates | null) {
  const candidates = offers.filter((offer) => SERVICE_OFFERS[serviceSlug]?.includes(offer.slug));
  if (candidates.length === 0) return null;
  const priced = candidates.filter((offer) => offer.priceType !== "quote" && offer.priceMin != null);
  if (priced.length === 0) return { label: "Sur devis", converted: null };
  const cheapest = priced.reduce((a, b) => ((b.priceMin ?? 0) < (a.priceMin ?? 0) ? b : a));
  const price = formatPrice({ ...cheapest, priceType: "from" });
  return { label: `${price.prefix} ${price.amount}`, converted: convertedPrice({ ...cheapest, priceType: "from" }, rates) };
}

// Savoir-faire, méthode et engagements : tout vient de la base.
async function ServicesBody() {
  const [servicesResult, contentResult, pricingResult, ratesResult] = await Promise.all([getServices(), getContent(), getPricing(), getRates()]);
  if (!servicesResult.ok || !contentResult.ok) {
    return (
      <div className="shell mt-20 md:mt-32">
        <Unavailable what="Les services" />
      </div>
    );
  }
  const services = servicesResult.data;
  const content = contentResult.data;
  const offers = pricingResult.ok ? pricingResult.data : [];
  const rates = ratesResult.ok ? ratesResult.data : null;
  return (
    <>
        <section aria-label="Savoir-faire" className="shell mt-20 md:mt-32">
          <ol>
            {services.map((capability, index) => {
              const price = startingPrice(capability.slug, offers, rates);
              return (
                <StickyStackItem key={capability.slug} index={index}>
                  <article
                    className={`relative overflow-hidden rounded-(--radius) border hairline p-8 shadow-[0_-20px_60px_rgb(0_0_0/0.35)] md:p-14 ${
                      index % 2 === 1 ? "surface-ivory" : "bg-ink-2"
                    }`}
                  >
                    <LogoMark className="pointer-events-none absolute -right-10 -top-6 w-72 opacity-[0.05]" />
                    <div className="grid gap-10 md:grid-cols-12">
                      <div className="md:col-span-5">
                        <h2 className="text-title font-semibold">{capability.name}</h2>
                        {price && (
                          <Link href="/tarifs" className="mt-6 inline-block">
                            <span className="block text-xl font-semibold text-accent">{price.label}</span>
                            {price.converted && <span className="block text-sm text-fg-subtle">{price.converted}</span>}
                          </Link>
                        )}
                      </div>
                      <div className="md:col-span-6 md:col-start-7">
                        <p className="text-lead">{capability.summary}</p>
                        <ul className="mt-8 border-t hairline">
                          {capability.deliverables.map((point) => (
                            <li key={point} className="border-b hairline py-4 text-fg-muted">
                              {point}
                            </li>
                          ))}
                        </ul>
                        <Suspense fallback={null}>
                          <ProofLinks slugs={capability.proofs} />
                        </Suspense>
                      </div>
                    </div>
                  </article>
                </StickyStackItem>
              );
            })}
          </ol>
        </section>

        <section aria-labelledby="process-title" className="shell py-24 md:py-36">
          <SplitLines id="process-title" className="mt-6 max-w-4xl text-title font-semibold" lines={["De la première question", <>à la mise en ligne.</>]} />
          <ol className="mt-16 grid gap-px overflow-hidden rounded-(--radius) border hairline bg-line sm:grid-cols-2 lg:grid-cols-3">
            {content.method.map((step, index) => (
              <li key={step.title} className="bg-bg p-8">
                <p className="label text-accent">{pad2(index + 1)}</p>
                <h3 className="mt-6 text-2xl font-medium tracking-tight">{step.title}</h3>
                <p className="mt-3 text-fg-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
  
        <section aria-labelledby="after-title" className="surface-ivory py-24 md:py-36">
          <div className="shell grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SplitLines id="after-title" className="mt-6 text-title font-semibold" lines={["Ce qui est inclus,", <>ce qui peut suivre.</>]} />
              <div className="mt-10">
                <ActionLink href="/tarifs" variant="secondary">
                  Voir les tarifs
                </ActionLink>
              </div>
            </div>
            <ul className="grid gap-8 sm:grid-cols-2 lg:col-span-7">
              {content.afterDelivery.map((item) => (
                <li key={item.title} className="border-t hairline pt-6">
                  <h3 className="text-xl font-medium">{item.title}</h3>
                  <p className="mt-2 text-fg-muted">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
    </>
  );
}

// Services — « la pile » : chaque savoir-faire est une carte épinglée qui vient recouvrir la précédente.
export default function ServicesPage() {
  return (
    <>
      <div className="shell pt-[calc(var(--header-h)+3rem)]">
        <SplitLines
          as="h1"
          mode="intro"
          className="mt-6 text-mega font-semibold"
          lines={["Un seul", <>interlocuteur,</>, <>tout le produit.</>]}
        />
        <p className="intro-fade mt-10 max-w-2xl text-lead text-fg-muted" style={{ "--intro-delay": "500ms" } as React.CSSProperties}>
          Je cadre, je conçois, je développe et je mets en ligne. Pas d&apos;intermédiaire : la personne qui comprend ton
          besoin est celle qui écrit le code.
        </p>
      </div>

      <Suspense fallback={<div className="shell mt-20 h-96 animate-pulse rounded-(--radius) bg-bg-raised md:mt-32" />}>
        <ServicesBody />
      </Suspense>

      <FinalCta />
    </>
  );
}
