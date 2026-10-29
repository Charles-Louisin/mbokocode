import { BarChart3, Braces, GitBranch, type LucideIcon, Search, ShieldCheck } from "lucide-react";
import {
  type SimpleIcon,
  siExpress,
  siFigma,
  siFramer,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siReact,
  siTailwindcss,
  siTypescript,
  siVercel,
} from "simple-icons";

// Mes outils et leur logo : officiel (Simple Icons, CC0) quand c'est une marque, pictogramme sinon.
// Partagé par le bandeau de l'accueil, la page À propos et le jeu de paires du Lab.

export type Tool = { name: string; brand?: SimpleIcon; icon?: LucideIcon };

export const TOOLS: Record<string, Tool> = Object.fromEntries(
  (
    [
      { name: "Next.js", brand: siNextdotjs },
      { name: "React", brand: siReact },
      { name: "TypeScript", brand: siTypescript },
      { name: "Tailwind CSS", brand: siTailwindcss },
      { name: "Framer Motion", brand: siFramer },
      { name: "Figma", brand: siFigma },
      { name: "Vercel", brand: siVercel },
      { name: "SEO technique", icon: Search },
      { name: "Node.js", brand: siNodedotjs },
      { name: "Express", brand: siExpress },
      { name: "MongoDB", brand: siMongodb },
      { name: "PostgreSQL", brand: siPostgresql },
      { name: "API REST", icon: Braces },
      { name: "Auth & rôles", icon: ShieldCheck },
      { name: "CI/CD", icon: GitBranch },
      { name: "Analytics", icon: BarChart3 },
    ] satisfies Tool[]
  ).map((tool) => [tool.name, tool]),
);

export const tool = (name: string): Tool => TOOLS[name] ?? { name };

/** Couleur de marque, lisible sur une pastille claire (les logos noirs restent noirs). */
export const brandColor = (icon: SimpleIcon) => `#${icon.hex}`;
