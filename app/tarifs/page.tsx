import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FinalCta } from "@/src/components/home/FinalCta";
import { BorderBeam } from "@/src/components/magic/BorderBeam";
import { SpotlightCard } from "@/src/components/magic/SpotlightCard";
import { SplitLines } from "@/src/components/motion/SplitLines";
import { ActionLink } from "@/src/components/ui/ActionLink";
import { Unavailable } from "@/src/components/ui/Unavailable";
import { getContent, getPricing, getRates } from "@/src/lib/api/content";
import type { PricingPackage, Rates } from "@/src/lib/api/types";
import { convertedPrice, formatPrice } from "@/src/lib/format";
import { contactHref, typeForOffer } from "@/src/lib/project-brief";

export const metadata: Metadata = {
  title: "Tarifs",
  description: "Landing page, site vitrine, e-commerce, refonte, développement sur mesure et licences : les budgets de départ.",
  alternates: { canonical: "/tarifs" },
};

// Comparaison licence / sur mesure et engagements après livraison : contenu enregistré en base.
async function LicenceTable() {
  const content = await getContent();
  if (!content.ok || content.data.licenceVsCustom.length === 0) return null;
  const licenceVsCustom = content.data.licenceVsCustom;
  return (
      <div className="mt-14 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <caption className="sr-only">Comparaison entre une licence et un développement sur mesure</caption>
          <thead>
            <tr className="border-b hairline">
              <th scope="col" className="label py-4 pr-6 font-normal text-fg-subtle">Critère</th>
              <th scope="col" className="py-4 pr-6 text-xl font-medium">Licence</th>
              <th scope="col" className="py-4 text-xl font-medium">Sur mesure</th>
            </tr>
          </thead>
          <tbody>
            {licenceVsCustom.map((row) => (
              <tr key={row.criterion} className="border-b hairline">
                <th scope="row" className="label py-6 pr-6 align-top font-normal text-fg-subtle">{row.criterion}</th>
                <td className="py-6 pr-6 align-top text-lg">{row.licence}</td>
                <td className="py-6 align-top text-lg">{row.custom}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
}

async function AfterDelivery() {
  const content = await getContent();
  if (!content.ok) return null;
  const afterDelivery = content.data.afterDelivery;
  return (
      <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {afterDelivery.map((item) => (
          <li key={item.title} className="border-t hairline pt-6">
            <h3 className="text-xl font-medium">{item.title}</h3>
            <p className="mt-2 text-fg-muted">{item.text}</p>
          </li>
        ))}
      </ul>
  );
}

function OfferBody({ offer, rates }: { offer: PricingPackage; rates: Rates | null }) {
  const price = formatPrice(offer);
  const converted = convertedPrice(offer, rates);
  const quote = offer.priceType === "quote";
  const subtle = quote ? "text-ivory/55" : "text-fg-subtle";
  return (
    <>
      <p className={`label ${quote ? "text-cobalt-soft" : "text-accent"}`}>{offer.kicker}</p>
      <h2 className="mt-4 text-[1.9rem] font-semibold leading-tight">{offer.name}</h2>
      <p className={`mt-3 ${quote ? "text-ivory/70" : "text-fg-muted"}`}>{offer.description}</p>

      <p className="mt-8">
        {price.prefix && <span className={`label block ${subtle}`}>{price.prefix}</span>}
        <span className="text-[clamp(2.4rem,4vw,3.4rem)] font-semibold leading-none [font-stretch:125%]">{price.amount}</span>
        {converted && <span className={`mt-2 block text-sm ${subtle}`}>{converted}</span>}
      </p>

      {offer.features.length > 0 && (
        <ul className={`mt-8 flex-1 space-y-3 border-t pt-6 ${quote ? "border-ivory/15" : "hairline"}`}>
          {offer.features.map((feature) => (
            <li key={feature} className="flex gap-3">
              <span aria-hidden className={quote ? "text-cobalt-soft" : "text-accent"}>
                —
              </span>
              {feature}
            </li>
          ))}
        </ul>
      )}
      {offer.deliveryEstimate && <p className={`label mt-6 ${subtle}`}>Délai indicatif : {offer.deliveryEstimate}</p>}
      <Link
        href={contactHref(typeForOffer(offer.slug))}
        className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3.5 font-medium transition-colors duration-300 ${
          quote ? "bg-ivory text-ink hover:bg-cobalt hover:text-ivory" : "bg-ink text-ivory hover:bg-cobalt"
        }`}
      >
        {quote ? "Demander un devis" : "Démarrer avec cette offre"}
      </Link>
    </>
  );
}

async function Offers() {
  const [result, ratesResult] = await Promise.all([getPricing(), getRates()]);
  if (!result.ok) return <Unavailable what="Les offres" />;
  const rates = ratesResult.ok ? ratesResult.data : null;

  const priced = result.data.filter((offer) => offer.priceType !== "quote");
  const quoted = result.data.filter((offer) => offer.priceType === "quote");

  return (
    <div className="space-y-4">
      {/* Grille sur 6 colonnes : trois cartes puis deux plus larges, pour des rangées toujours pleines. */}
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {priced.map((offer, index) => (
          <li key={offer.id} className={index < 3 || priced.length % 3 !== 2 ? "xl:col-span-2" : "xl:col-span-3"}>
            {/* Offres chiffrées : la bordure s'éclaire sous le pointeur (Magic Card, Magic UI). */}
            <SpotlightCard className="h-full">
              <article className="flex h-full flex-col p-8">
                <OfferBody offer={offer} rates={rates} />
              </article>
            </SpotlightCard>
          </li>
        ))}
      </ul>
      <ul className="grid gap-4 md:grid-cols-2">
        {quoted.map((offer) => (
          <li key={offer.id}>
            {/* Offres sur devis : surface sombre et éclat qui parcourt la bordure (Border Beam, Magic UI). */}
            <article className="relative flex h-full flex-col rounded-(--radius) bg-ink p-8 text-ivory">
              <BorderBeam />
              <OfferBody offer={offer} rates={rates} />
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Tarifs — « la vitrine » : des cartes nettes sur fond ivoire, chaque prix lisible d'un coup d'œil.
export default function PricingPage() {
  return (
    <>
      <div className="surface-ivory pb-24 pt-[calc(var(--header-h)+3rem)] md:pb-36">
        <div className="shell">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <SplitLines as="h1" mode="intro" className="text-mega font-semibold md:col-span-8" lines={["Des prix", <>clairs, dès</>, "le départ."]} />
            <p className="intro-fade text-lg text-fg-muted md:col-span-4" style={{ "--intro-delay": "500ms" } as React.CSSProperties}>
              Ces montants sont des points de départ. Après un premier échange, tu reçois un devis précis : périmètre,
              délai et prix. Aucune estimation affichée ici ne vaut devis.
            </p>
          </div>
          <div className="mt-16">
            <Suspense fallback={<div className="h-[60vh] animate-pulse rounded-(--radius) bg-bg-raised" />}>
              <Offers />
            </Suspense>
          </div>
        </div>
      </div>

      <section aria-labelledby="licence-title" className="shell py-24 md:py-36">
        <SplitLines id="licence-title" className="mt-6 max-w-4xl text-title font-semibold" lines={["Deux chemins valides.", <>Voici la différence.</>]} />
        <Suspense fallback={null}>
          <LicenceTable />
        </Suspense>
        <p className="mt-8 text-fg-muted">
          Exemple de licence disponible : la marketplace{" "}
          <Link href="/projets/koumale" className="link-draw text-fg">
            KOUMALE
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="included-title" className="shell pb-24 md:pb-36">
        <h2 id="included-title" className="sr-only">Ce qui est inclus après la livraison</h2>
        <Suspense fallback={null}>
          <AfterDelivery />
        </Suspense>
        <div className="mt-12">
          <ActionLink href="/services" variant="text">
            Le détail de chaque service
          </ActionLink>
        </div>
      </section>

      <FinalCta title="Un devis précis ?" />
    </>
  );
}
