// Navigation et adresse du site. Tout le contenu (projets, savoir-faire, parcours, offres,
// coordonnées…) vient de l'API, donc de MongoDB.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const nav = [
  { href: "/projets", label: "Projets" },
  { href: "/services", label: "Services" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/a-propos", label: "À propos" },
  { href: "/lab", label: "Lab" },
] as const;

export const primaryCta = { href: "/contact", label: "Parlons de ton projet" } as const;
