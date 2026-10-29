// Catalogue du Lab : chaque mini-jeu a sa page (/lab/<slug>) et montre une compétence concrète.

export type LabControl = "souris" | "doigt" | "clavier";

export type LabGame = {
  slug: string;
  title: string;
  tagline: string;
  /** Ce que le jeu fait ressentir de mon travail. */
  skill: string;
  duration: string;
  controls: LabControl[];
  /** Meilleur score : comment le lire et dans quel sens il s'améliore. */
  score: { label: string; unit?: string; better: "lower" | "higher" };
};

export const LAB_GAMES: LabGame[] = [
  {
    slug: "trajet",
    title: "Le trajet d'un clic",
    tagline: "Remets dans l'ordre les étapes invisibles d'une commande en ligne.",
    skill: "Architecture d'API",
    duration: "≈ 2 min",
    controls: ["souris", "doigt", "clavier"],
    score: { label: "Moins d'essais", unit: "essais", better: "lower" },
  },
  {
    slug: "chasse-aux-bugs",
    title: "Chasse aux bugs",
    tagline: "30 secondes pour écraser les bugs sans toucher aux fonctionnalités.",
    skill: "Débogage",
    duration: "30 s",
    controls: ["souris", "doigt", "clavier"],
    score: { label: "Record", unit: "pts", better: "higher" },
  },
  {
    slug: "oeil-de-pixel",
    title: "Œil de pixel",
    tagline: "Vise le centre exact de chaque cadre. Au pixel près.",
    skill: "Intégration précise",
    duration: "≈ 1 min",
    controls: ["souris", "doigt", "clavier"],
    score: { label: "Écart moyen", unit: "px", better: "lower" },
  },
  {
    slug: "paires-de-stack",
    title: "Paires de stack",
    tagline: "Retrouve les paires d'outils que j'utilise au quotidien.",
    skill: "Ma stack",
    duration: "≈ 2 min",
    controls: ["souris", "doigt", "clavier"],
    score: { label: "Moins de coups", unit: "coups", better: "lower" },
  },
  {
    slug: "temps-de-reponse",
    title: "Temps de réponse",
    tagline: "Le serveur répond : clique aussitôt. Ton réflexe contre la latence.",
    skill: "Performance",
    duration: "≈ 1 min",
    controls: ["souris", "doigt", "clavier"],
    score: { label: "Meilleure moyenne", unit: "ms", better: "lower" },
  },
];

export const findGame = (slug: string) => LAB_GAMES.find((game) => game.slug === slug);
