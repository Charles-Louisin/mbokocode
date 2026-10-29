import Link from "next/link";
import { SplitLines } from "@/src/components/motion/SplitLines";
import { ActionLink } from "@/src/components/ui/ActionLink";
import { getPricing } from "@/src/lib/api/content";
import { formatPrice } from "@/src/lib/format";

// Budgets de départ : les montants viennent de l'admin, jamais du code.
export async function PricingTeaser() {
  const result = await getPricing();
  if (!result.ok || result.data.length === 0) return null;
  const offers = result.data.filter((offer) => offer.priceType !== "quote").slice(0, 3);

  return (
    <section aria-labelledby="pricing-teaser-title" className="shell py-24 md:py-36">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SplitLines
            id="pricing-teaser-title"
            className="mt-6 text-title font-semibold"
            lines={["Des prix", <>posés d&apos;emblée.</>]}
          />
          <p className="mt-6 max-w-md text-fg-muted">
            Des points de départ clairs, affinés ensuite par un devis après notre premier échange.
          </p>
        </div>
        <ul className="lg:col-span-7">
          {offers.map((offer) => {
            const price = formatPrice(offer);
            return (
              <li key={offer.id}>
                <Link
                  href="/tarifs"
                  className="group flex flex-wrap items-baseline justify-between gap-4 border-t hairline py-8 last:border-b"
                >
                  <span>
                    <span className="label block text-fg-subtle">{offer.kicker}</span>
                    <span className="mt-2 block text-[clamp(1.5rem,2.6vw,2.2rem)] font-medium tracking-[-0.03em] transition-transform duration-500 ease-(--ease-expo) group-hover:translate-x-2">
                      {offer.name}
                    </span>
                  </span>
                  <span className="text-right">
                    {price.prefix && <span className="label block text-fg-subtle">{price.prefix}</span>}
                    <span className="text-[clamp(1.5rem,2.6vw,2.2rem)] font-medium tracking-[-0.03em] text-accent">{price.amount}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-12 flex justify-end">
        <ActionLink href="/tarifs" variant="secondary">
          Toutes les offres
        </ActionLink>
      </div>
    </section>
  );
}
