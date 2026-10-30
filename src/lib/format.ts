import type { PricingPackage, ProjectCategory, ProjectStatus, Rates } from "./api/types";

export const categoryLabels: Record<ProjectCategory, string> = {
  web: "Web",
  mobile: "Mobile",
  platform: "Plateformes & SaaS",
  experience: "Expériences",
};

export const statusLabels: Record<ProjectStatus, string> = {
  prototype: "Prototype",
  in_progress: "En développement",
  deployed: "En ligne",
  maintained: "En ligne et maintenu",
  archived: "Archivé",
};

export function formatAmount(minorUnits: number, currency: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: minorUnits % 100 === 0 ? 0 : 2,
  }).format(minorUnits / 100);
}

const approx = (value: number, currency: "EUR" | "USD") =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency, currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 }).format(value);

/** Équivalent discret d'un prix en FCFA : « ≈ 503 € · 553 $ ». Rien pour une autre devise ou sur devis. */
export function convertedPrice(
  offer: Pick<PricingPackage, "priceType" | "priceMin" | "priceMax" | "currency">,
  rates: Rates | null,
): string | null {
  const { priceType, priceMin, priceMax, currency } = offer;
  if (!rates || currency !== "XAF" || priceType === "quote" || priceMin == null) return null;
  const convert = (rate: number, code: "EUR" | "USD") => {
    const min = approx((priceMin / 100) * rate, code);
    return priceType === "range" && priceMax != null ? `${min} – ${approx((priceMax / 100) * rate, code)}` : min;
  };
  return ["≈ " + convert(rates.eur, "EUR"), rates.usd != null ? convert(rates.usd, "USD") : null].filter(Boolean).join(" · ");
}

/** Libellé de prix lisible ; null si l'offre n'affiche pas de montant. */
export function formatPrice(offer: Pick<PricingPackage, "priceType" | "priceMin" | "priceMax" | "currency">): {
  prefix?: string;
  amount: string;
} {
  const { priceType, priceMin, priceMax, currency } = offer;
  if (priceType === "quote" || priceMin == null) return { amount: "Sur devis" };
  if (priceType === "range" && priceMax != null) {
    return { amount: `${formatAmount(priceMin, currency)} – ${formatAmount(priceMax, currency)}` };
  }
  if (priceType === "from") return { prefix: "À partir de", amount: formatAmount(priceMin, currency) };
  return { amount: formatAmount(priceMin, currency) };
}

export const pad2 = (value: number) => String(value).padStart(2, "0");
