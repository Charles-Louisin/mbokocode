import { whatsappLink } from "./whatsapp";

// Parcours du brief : le visiteur décrit son projet en quelques choix, puis l'envoie lui-même
// par WhatsApp ou par e-mail, avec un message prérempli.
// Rien n'est enregistré par le site : le message part depuis la messagerie du visiteur.

export type ProjectTypeKey = "landing" | "vitrine" | "ecommerce" | "application" | "saas" | "refonte";
export type DeadlineKey = "urgent" | "1m" | "2-3m" | "flexible";
export type FeatureKey = keyof typeof FEATURES;

/** Types de projet du brief. `offer` : l'offre publiée (MongoDB) dont le délai indicatif est repris. */
export const PROJECT_TYPES: Record<ProjectTypeKey, { label: string; hint: string; offer: string }> = {
  landing: { label: "Landing page", hint: "Une page pour convertir", offer: "landing-page" },
  vitrine: { label: "Site vitrine", hint: "Présenter ton activité", offer: "site-vitrine" },
  ecommerce: { label: "E-commerce", hint: "Vendre en ligne", offer: "e-commerce" },
  application: { label: "Application", hint: "Web ou mobile, sur mesure", offer: "sur-mesure" },
  saas: { label: "Plateforme / SaaS", hint: "Outil métier, multi-utilisateurs", offer: "sur-mesure" },
  refonte: { label: "Refonte", hint: "Moderniser l'existant", offer: "refonte" },
};

/** Délai indicatif par type de projet, lu dans les offres ; « sur devis » quand l'offre n'en donne pas. */
export type Estimates = Record<ProjectTypeKey, string>;

export function estimatesFrom(offers: { slug: string; deliveryEstimate?: string }[]): Estimates {
  const bySlug = new Map(offers.map((offer) => [offer.slug, offer.deliveryEstimate]));
  return Object.fromEntries(
    (Object.keys(PROJECT_TYPES) as ProjectTypeKey[]).map((key) => [key, bySlug.get(PROJECT_TYPES[key].offer) || "sur devis, selon le périmètre"]),
  ) as Estimates;
}

export const FEATURES = {
  comptes: "Espace client / connexion",
  paiement: "Paiement en ligne (mobile money, carte)",
  admin: "Tableau de bord d'administration",
  whatsapp: "Commandes ou notifications WhatsApp",
  reservation: "Prise de rendez-vous",
  multilingue: "Plusieurs langues",
  contenus: "Blog / contenus modifiables",
  integrations: "Intégrations (API, outils existants)",
} as const;

export const DEADLINES: Record<DeadlineKey, { label: string; hint: string }> = {
  urgent: { label: "Urgent", hint: "Moins de 2 semaines" },
  "1m": { label: "1 mois", hint: "Délai standard" },
  "2-3m": { label: "2 à 3 mois", hint: "Projet complet" },
  flexible: { label: "Flexible", hint: "Pas de date imposée" },
};

// Object.hasOwn et non `in` : un paramètre comme « toString » ne doit pas passer pour un type valide.
export const isProjectType = (value: string | null): value is ProjectTypeKey => !!value && Object.hasOwn(PROJECT_TYPES, value);
export const isDeadline = (value: string | null): value is DeadlineKey => !!value && Object.hasOwn(DEADLINES, value);

export type Brief = {
  type?: ProjectTypeKey;
  features: FeatureKey[];
  deadline?: DeadlineKey;
  name: string;
  company?: string;
  description: string;
};

/** Phrase courte du teaser d'accueil : « …j'ai un projet de site vitrine, délai 1 mois. » */
export function teaserMessage(type?: ProjectTypeKey, deadline?: DeadlineKey): string {
  if (!type) return "Bonjour Charles, j'ai un projet.";
  const project = PROJECT_TYPES[type].label.toLowerCase();
  return `Bonjour Charles, j'ai un projet : ${project}${deadline ? `, délai ${DEADLINES[deadline].label.toLowerCase()}` : ""}.`;
}

/** Brief complet en texte brut, identique pour WhatsApp et l'e-mail. */
export function briefText(brief: Brief, siteUrl?: string): string {
  const firstName = brief.name.trim().split(/\s+/)[0] || brief.name.trim();
  const lines = [
    `Bonjour Charles, c'est ${firstName}${brief.company?.trim() ? ` (${brief.company.trim()})` : ""}.`,
    "",
    brief.type && `Projet : ${PROJECT_TYPES[brief.type].label}`,
    brief.features.length > 0 && `Modules : ${brief.features.map((f) => FEATURES[f]).join(", ")}`,
    brief.deadline && `Délai souhaité : ${DEADLINES[brief.deadline].label} (${DEADLINES[brief.deadline].hint.toLowerCase()})`,
    "",
    brief.description.trim(),
    siteUrl && "",
    siteUrl && `Envoyé depuis ${siteUrl}`,
  ];
  return lines.filter((line) => line !== false && line !== undefined).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function briefSubject(brief: Pick<Brief, "type" | "name">): string {
  const project = brief.type ? PROJECT_TYPES[brief.type].label : "Nouveau projet";
  return `${project} — ${brief.name.trim() || "demande"} (via le portfolio)`;
}

export function briefWhatsappLink(number: string | null | undefined, brief: Brief, siteUrl?: string): string | null {
  return whatsappLink(number, briefText(brief, siteUrl));
}

/** Lien mailto : sujet et corps toujours encodés, retours à la ligne en CRLF comme le veut la norme. */
export function briefMailto(email: string | null | undefined, brief: Brief, siteUrl?: string): string | null {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  const body = briefText(brief, siteUrl).replace(/\n/g, "\r\n");
  return `mailto:${email}?subject=${encodeURIComponent(briefSubject(brief))}&body=${encodeURIComponent(body)}`;
}

/** Lien vers le parcours complet, avec les choix déjà faits sur l'accueil. */
export function contactHref(type?: ProjectTypeKey, deadline?: DeadlineKey): string {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (deadline) params.set("delai", deadline);
  const query = params.toString();
  return query ? `/contact?${query}` : "/contact";
}
