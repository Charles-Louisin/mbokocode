/** Garde uniquement les chiffres : format attendu par wa.me (indicatif pays inclus, sans « + »). */
export function normalizeWhatsappNumber(raw: string | undefined | null): string | null {
  const digits = (raw ?? "").replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

/** Lien officiel wa.me ; le message est toujours encodé. */
export function whatsappLink(rawNumber: string | undefined | null, message?: string): string | null {
  const number = normalizeWhatsappNumber(rawNumber);
  if (!number) return null;
  const text = message?.trim();
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

type LeadSummary = {
  name: string;
  reference?: string;
  project?: string;
  goal?: string;
  budget?: string;
  deadline?: string;
  siteUrl?: string;
};

/** Message prérempli après une demande : prénom, référence et l'essentiel du besoin, en texte brut. */
export function leadWhatsappMessage({ name, reference, project, goal, budget, deadline, siteUrl }: LeadSummary): string {
  const firstName = name.trim().split(/\s+/)[0] || name.trim();
  const shortGoal = goal && goal.trim().length > 160 ? `${goal.trim().slice(0, 157).trimEnd()}…` : goal?.trim();
  return [
    `Bonjour Charles, c'est ${firstName}.`,
    reference ? `Je viens d'envoyer une demande depuis ton portfolio (réf. ${reference}).` : "Je viens de ton portfolio.",
    project && `Projet : ${project}`,
    shortGoal && `Objectif : ${shortGoal}`,
    budget && `Budget indicatif : ${budget}`,
    deadline && `Échéance : ${deadline}`,
    siteUrl,
  ]
    .filter(Boolean)
    .join("\n");
}
