import type { PricingPackage, ProjectCategory, ProjectStatus } from "./api/types";

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
