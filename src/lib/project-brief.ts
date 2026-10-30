import type { PricingPackage, Rates } from "./api/types";
import { convertedPrice, formatPrice } from "./format";
import { whatsappLink } from "./whatsapp";

// Parcours du brief : le visiteur décrit son projet en quelques choix, puis l'envoie lui-même
// par WhatsApp ou par e-mail, avec un message prérempli.
// Rien n'est enregistré par le site : le message part depuis la messagerie du visiteur.

export type ProjectTypeKey = "landing" | "vitrine" | "ecommerce" | "refonte" | "redaction" | "surmesure" | "licence";
export type DeadlineKey = "urgent" | "1m" | "2-3m" | "flexible";
export type FeatureKey = keyof typeof FEATURES;

/**
 * Types de projet du brief, un par offre publiée (MongoDB) : `offer` est le slug de l'offre dont
 * le prix et le délai indicatif s'affichent. `placeholder` guide la description selon le type.
 */
export const PROJECT_TYPES: Record<ProjectTypeKey, { label: string; hint: string; offer: string; placeholder: string }> = {
  landing: { label: "Landing page", hint: "Une page pour convertir", offer: "landing-page", placeholder: "Ce que tu vends, à qui, et l'action que le visiteur doit faire (appeler, réserver, commander…)." },
  vitrine: { label: "Site vitrine", hint: "Présenter ton activité", offer: "site-vitrine", placeholder: "Ton activité, ta clientèle, les pages dont tu as besoin, ce qui existe déjà (logo, textes, photos)…" },
  ecommerce: { label: "E-commerce", hint: "Vendre en ligne", offer: "e-commerce", placeholder: "Ce que tu vends, combien de produits, comment tes clients paient et sont livrés…" },
  refonte: { label: "Refonte", hint: "Moderniser l'existant", offer: "refonte", placeholder: "L'adresse de ton site actuel, ce qui ne va pas, ce que tu veux qu'il fasse mieux…" },
  redaction: { label: "Rédaction web", hint: "Des textes qui donnent envie", offer: "redaction-web", placeholder: "Le site ou les pages concernées, ton activité, le ton que tu veux donner…" },
  surmesure: {
    label: "Développement sur mesure",
    hint: "Application, plateforme, SaaS",
    offer: "sur-mesure",
    placeholder: "Ton application ou ta plateforme : qui l'utilise, les rôles (clients, vendeurs, admin…), les fonctionnalités clés, les outils à connecter, web ou mobile…",
  },
  licence: { label: "Licence logicielle", hint: "Exploiter une solution existante", offer: "licences", placeholder: "Ton marché (pays, ville), ton activité, ce que tu veux adapter (nom, couleurs, moyens de paiement, langues)…" },
};

/** Anciens liens (?type=application ou ?type=saas) : même parcours que le sur mesure. */
const ALIASES: Record<string, ProjectTypeKey> = { application: "surmesure", saas: "surmesure" };

/** Type de projet correspondant à une offre des tarifs (pour présélectionner le brief). */
export function typeForOffer(offerSlug: string): ProjectTypeKey | undefined {
  return (Object.keys(PROJECT_TYPES) as ProjectTypeKey[]).find((key) => PROJECT_TYPES[key].offer === offerSlug);
}

/** Prix et délai indicatif de chaque type, lus dans les offres publiées. */
export type OfferInfo = { price: string; converted: string | null; delay: string };
export type OfferInfos = Record<ProjectTypeKey, OfferInfo>;

export function offerInfosFrom(offers: PricingPackage[], rates: Rates | null): OfferInfos {
  const bySlug = new Map(offers.map((offer) => [offer.slug, offer]));
  return Object.fromEntries(
    (Object.keys(PROJECT_TYPES) as ProjectTypeKey[]).map((key) => {
      const offer = bySlug.get(PROJECT_TYPES[key].offer);
      if (!offer) return [key, { price: "Sur devis", converted: null, delay: "sur devis, selon le périmètre" }];
      const price = formatPrice(offer);
      return [
        key,
        {
          price: price.prefix ? `${price.prefix} ${price.amount}` : price.amount,
          converted: convertedPrice(offer, rates),
          delay: offer.deliveryEstimate || "sur devis, selon le périmètre",
        },
      ];
    }),
  ) as OfferInfos;
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

/** Type de projet lu dans l'URL, anciens noms compris. */
export function parseProjectType(value: string | null): ProjectTypeKey | undefined {
  if (isProjectType(value)) return value;
  return value && Object.hasOwn(ALIASES, value) ? ALIASES[value] : undefined;
}

/** Solution proposée en licence (projet publié avec `licenseAvailable`). */
export type LicenceOption = { slug: string; title: string; kicker?: string; liveUrl?: string };

export type Brief = {
  type?: ProjectTypeKey;
  features: FeatureKey[];
  /** Pour une licence : la solution choisie. */
  licence?: LicenceOption;
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
  const licence = brief.type === "licence" ? brief.licence : undefined;
  const lines = [
    `Bonjour Charles, c'est ${firstName}${brief.company?.trim() ? ` (${brief.company.trim()})` : ""}.`,
    "",
    brief.type && `Projet : ${PROJECT_TYPES[brief.type].label}`,
    licence && `Solution souhaitée en licence : ${licence.title}${licence.kicker ? ` (${licence.kicker})` : ""}${licence.liveUrl ? ` — ${licence.liveUrl}` : ""}`,
    brief.type !== "licence" && brief.features.length > 0 && `Modules : ${brief.features.map((f) => FEATURES[f]).join(", ")}`,
    brief.deadline && `Délai souhaité : ${DEADLINES[brief.deadline].label} (${DEADLINES[brief.deadline].hint.toLowerCase()})`,
    "",
    brief.description.trim(),
    siteUrl && "",
    siteUrl && `Envoyé depuis ${siteUrl}`,
  ];
  return lines.filter((line) => line !== false && line !== undefined).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function briefSubject(brief: Pick<Brief, "type" | "name" | "licence">): string {
  const project = brief.type ? PROJECT_TYPES[brief.type].label : "Nouveau projet";
  const detail = brief.type === "licence" && brief.licence ? ` ${brief.licence.title}` : "";
  return `${project}${detail} — ${brief.name.trim() || "demande"} (via le portfolio)`;
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

/** Lien vers le parcours complet, avec les choix déjà faits (accueil, tarifs). */
export function contactHref(type?: ProjectTypeKey, deadline?: DeadlineKey): string {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (deadline) params.set("delai", deadline);
  const query = params.toString();
  return query ? `/contact?${query}` : "/contact";
}
