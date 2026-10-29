import { type LucideIcon, Play } from "lucide-react";
import type { ReactNode } from "react";

export type GameStat = { label: string; value: ReactNode };

type Props = {
  /** Consignes courtes : quoi faire, comment jouer (souris, doigt, clavier). */
  rules: ReactNode;
  stats: GameStat[];
  /** Annonces pour les lecteurs d'écran (score, fin de partie). */
  announce?: string;
  children: ReactNode;
};

// Mise en page commune aux jeux du Lab : consignes et compteurs à gauche, plateau à droite.
export function GameFrame({ rules, stats, announce, children }: Props) {
  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <h2 className="label text-accent">Consignes</h2>
        <div className="mt-4 space-y-3 text-lg text-fg-muted">{rules}</div>
        <dl className="mt-8 grid grid-cols-2 gap-6 border-t hairline pt-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="label text-fg-subtle">{stat.label}</dt>
              <dd className="mt-1 text-3xl font-medium tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="min-w-0 lg:col-span-8">
        <p aria-live="polite" className="sr-only">
          {announce}
        </p>
        {children}
      </div>
    </div>
  );
}

/** Bouton principal des jeux, pour démarrer ou rejouer. */
export function GameButton({ onClick, children, secondary = false, icon: Icon = Play }: { onClick: () => void; children: ReactNode; secondary?: boolean; icon?: LucideIcon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        secondary
          ? "inline-flex min-h-12 items-center gap-2 rounded-full border hairline px-7 py-3.5 font-medium hover:border-fg"
          : "inline-flex min-h-12 items-center gap-2 rounded-full bg-fg px-7 py-3.5 font-medium text-bg transition-colors duration-300 hover:bg-cobalt hover:text-ivory"
      }
    >
      <Icon aria-hidden className="size-4" />
      {children}
    </button>
  );
}

/** Bilan de fin de partie : le résultat, puis ce que le jeu dit de mon travail. */
export function GameResult({ title, children, record }: { title: string; children: ReactNode; record?: boolean }) {
  return (
    <div className="mt-10 rounded-(--radius) border border-success/40 p-7 md:p-8">
      <p className="label text-success">{record ? "Nouveau record" : "Partie terminée"}</p>
      <p className="mt-3 text-3xl font-medium tracking-tight">{title}</p>
      <div className="mt-4 text-fg-muted">{children}</div>
    </div>
  );
}
