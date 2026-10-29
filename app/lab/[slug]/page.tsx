import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { BugHuntGame } from "@/src/components/lab/BugHuntGame";
import { PipelineGame } from "@/src/components/lab/PipelineGame";
import { PixelEyeGame } from "@/src/components/lab/PixelEyeGame";
import { ReactionGame } from "@/src/components/lab/ReactionGame";
import { StackPairsGame } from "@/src/components/lab/StackPairsGame";
import { SplitLines } from "@/src/components/motion/SplitLines";
import { pad2 } from "@/src/lib/format";
import { findGame, LAB_GAMES } from "@/src/lib/lab";

const GAMES: Record<string, ComponentType> = {
  trajet: PipelineGame,
  "chasse-aux-bugs": BugHuntGame,
  "oeil-de-pixel": PixelEyeGame,
  "paires-de-stack": StackPairsGame,
  "temps-de-reponse": ReactionGame,
};

export function generateStaticParams() {
  return LAB_GAMES.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: PageProps<"/lab/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const game = findGame(slug);
  if (!game) return { title: "Jeu introuvable", robots: { index: false } };
  return { title: `${game.title} — Lab`, description: game.tagline, alternates: { canonical: `/lab/${game.slug}` } };
}

// Une partie : titre, plateau, puis les autres jeux de la salle pour enchaîner.
export default async function LabGamePage({ params }: PageProps<"/lab/[slug]">) {
  const { slug } = await params;
  const game = findGame(slug);
  const Game = GAMES[slug];
  if (!game || !Game) notFound();

  const index = LAB_GAMES.indexOf(game);
  const next = LAB_GAMES[(index + 1) % LAB_GAMES.length]!;
  const others = LAB_GAMES.filter((other) => other.slug !== game.slug);

  return (
    <div className="shell pb-24 pt-[calc(var(--header-h)+3rem)] md:pb-36">
      <nav aria-label="Fil d'Ariane" className="intro-fade label text-fg-subtle">
        <Link href="/lab" className="link-draw hover:text-fg">
          Lab
        </Link>
        <span aria-hidden className="mx-2">
          /
        </span>
        <span className="text-accent">
          N° {pad2(index + 1)} · {game.skill}
        </span>
      </nav>
      <SplitLines as="h1" mode="intro" className="mt-6 text-title font-semibold" lines={[game.title]} />
      <p className="intro-fade mt-6 max-w-2xl text-lead text-fg-muted" style={{ "--intro-delay": "300ms" } as React.CSSProperties}>
        {game.tagline}
      </p>

      <div className="intro-fade mt-14 border-t hairline pt-12" style={{ "--intro-delay": "450ms" } as React.CSSProperties}>
        <Game />
      </div>

      <section aria-labelledby="more-games-title" className="mt-24 border-t hairline pt-12 md:mt-32">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="more-games-title" className="text-2xl font-semibold">
            Encore une partie ?
          </h2>
          <Link href={`/lab/${next.slug}`} className="link-draw inline-flex items-center gap-2 font-medium">
            Jeu suivant : {next.title}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((other) => (
            <li key={other.slug}>
              <Link
                href={`/lab/${other.slug}`}
                className="group flex h-full flex-col rounded-2xl border hairline p-5 transition-colors duration-300 hover:border-cobalt-soft/50"
              >
                <span className="label text-fg-subtle">
                  N° {pad2(LAB_GAMES.indexOf(other) + 1)} · {other.duration}
                </span>
                <span className="mt-2 text-lg font-medium transition-transform duration-500 ease-(--ease-expo) group-hover:translate-x-1">{other.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
