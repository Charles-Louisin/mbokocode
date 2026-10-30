import { describe, expect, it } from "vitest";
import { briefMailto, briefText, briefWhatsappLink, contactHref, isDeadline, isProjectType, offerInfosFrom, parseProjectType, teaserMessage, typeForOffer } from "./project-brief";
import { normalizeWhatsappNumber, whatsappLink } from "./whatsapp";

describe("lien WhatsApp", () => {
  it("normalise le numéro : chiffres seuls, indicatif inclus", () => {
    expect(normalizeWhatsappNumber("+237 6 99-00 (11) 22")).toBe("237699001122");
    expect(normalizeWhatsappNumber("1234")).toBeNull();
    expect(normalizeWhatsappNumber(undefined)).toBeNull();
  });

  it("construit le lien officiel wa.me avec un message encodé", () => {
    const link = whatsappLink("+237 699 001 122", "Bonjour & merci ? #1 é");
    expect(link).toBe("https://wa.me/237699001122?text=Bonjour%20%26%20merci%20%3F%20%231%20%C3%A9");
    expect(new URL(link!).searchParams.get("text")).toBe("Bonjour & merci ? #1 é");
  });

  it("le contenu saisi ne peut pas sortir du paramètre text", () => {
    const url = new URL(whatsappLink("237699001122", "a&phone=000&text=pirate")!);
    expect([...url.searchParams.keys()]).toEqual(["text"]);
  });

  it("aucun lien sans numéro valide", () => {
    expect(whatsappLink(null, "x")).toBeNull();
    expect(whatsappLink("237699001122", "   ")).toBe("https://wa.me/237699001122");
  });
});

describe("brief de projet", () => {
  const brief = {
    type: "ecommerce" as const,
    features: ["paiement" as const, "admin" as const],
    deadline: "1m" as const,
    name: "Awa Ndiaye",
    company: "Awa Shop",
    description: "Vendre mes créations en ligne & livrer à Douala ?",
  };

  it("message d'accueil selon les choix", () => {
    expect(teaserMessage()).toBe("Bonjour Charles, j'ai un projet.");
    expect(teaserMessage("vitrine", "1m")).toBe("Bonjour Charles, j'ai un projet : site vitrine, délai 1 mois.");
  });

  it("le brief reprend chaque choix en clair", () => {
    const text = briefText(brief, "https://mboko.example");
    expect(text).toContain("c'est Awa (Awa Shop).");
    expect(text).toContain("Projet : E-commerce");
    expect(text).toContain("Modules : Paiement en ligne (mobile money, carte), Tableau de bord d'administration");
    expect(text).toContain("Délai souhaité : 1 mois (délai standard)");
    expect(text.endsWith("Envoyé depuis https://mboko.example")).toBe(true);
  });

  it("le brief sans options n'a pas de lignes vides en trop", () => {
    const text = briefText({ features: [], name: "Awa", description: "Un besoin précis et détaillé ici." });
    expect(text).not.toMatch(/\n{3,}/);
    expect(text).not.toContain("Projet :");
  });

  it("WhatsApp et e-mail transportent le même brief, correctement encodé", () => {
    const wa = new URL(briefWhatsappLink("237699001122", brief)!);
    expect(wa.searchParams.get("text")).toBe(briefText(brief));
    const mail = briefMailto("charles@example.com", brief)!;
    expect(mail.startsWith("mailto:charles@example.com?subject=")).toBe(true);
    const params = new URLSearchParams(mail.split("?")[1]);
    expect(params.get("subject")).toBe("E-commerce — Awa Ndiaye (via le portfolio)");
    expect(params.get("body")).toBe(briefText(brief).replace(/\n/g, "\r\n"));
    expect(mail).not.toMatch(/[ &?]{1}Vendre/);
  });

  it("refuse une adresse e-mail invalide", () => {
    expect(briefMailto("pas-un-email", brief)).toBeNull();
    expect(briefMailto(null, brief)).toBeNull();
  });

  it("lien vers le parcours complet et lecture des paramètres", () => {
    expect(contactHref()).toBe("/contact");
    expect(contactHref("surmesure", "2-3m")).toBe("/contact?type=surmesure&delai=2-3m");
    expect(isProjectType("licence")).toBe(true);
    expect(isProjectType("toString")).toBe(false);
    // Anciens liens de l'accueil : même parcours que le sur mesure.
    expect(parseProjectType("saas")).toBe("surmesure");
    expect(parseProjectType("toString")).toBeUndefined();
    expect(isDeadline("1m")).toBe(true);
    expect(isDeadline(null)).toBe(false);
  });

  it("chaque offre des tarifs ouvre le bon type de projet", () => {
    expect(typeForOffer("landing-page")).toBe("landing");
    expect(typeForOffer("sur-mesure")).toBe("surmesure");
    expect(typeForOffer("licences")).toBe("licence");
    expect(typeForOffer("inconnue")).toBeUndefined();
  });

  it("prix et conversion de chaque type, repris des offres", () => {
    const offers = [
      { id: "1", name: "Landing", slug: "landing-page", description: "", priceType: "from" as const, currency: "XAF", priceMin: 10_000_000, features: [], deliveryEstimate: "1 à 2 semaines", sortOrder: 1 },
      { id: "2", name: "Sur mesure", slug: "sur-mesure", description: "", priceType: "quote" as const, currency: "XAF", features: [], sortOrder: 2 },
    ];
    const infos = offerInfosFrom(offers, { base: "XAF", eur: 1 / 655.957, usd: null, usdDate: null });
    // Intl sépare les milliers et le symbole par des espaces insécables : on les normalise.
    expect(infos.landing.price.replace(/\s/g, " ")).toBe("À partir de 100 000 FCFA");
    expect(infos.landing.converted?.replace(/\s/g, " ")).toBe("≈ 152 €");
    expect(infos.landing.delay).toBe("1 à 2 semaines");
    expect(infos.surmesure.price).toBe("Sur devis");
    expect(infos.vitrine.price).toBe("Sur devis");
  });

  it("une licence précise la solution choisie", () => {
    const text = briefText({ type: "licence", features: ["paiement"], licence: { slug: "koumale", title: "KOUMALE", kicker: "Marketplace multi-vendeurs", liveUrl: "https://koumale.com/" }, name: "Awa", description: "Je veux lancer la marketplace à Abidjan." });
    expect(text).toContain("Projet : Licence logicielle");
    expect(text).toContain("Solution souhaitée en licence : KOUMALE (Marketplace multi-vendeurs) — https://koumale.com/");
    expect(text).not.toContain("Modules :");
  });
});
