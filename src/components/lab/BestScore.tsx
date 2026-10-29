"use client";

import { Trophy } from "lucide-react";
import type { LabGame } from "@/src/lib/lab";
import { useBestScore } from "./useBestScore";

// Record du visiteur sur la carte d'un jeu (gardé dans son navigateur). Rien tant qu'il n'a pas joué.
export function BestScore({ game }: { game: LabGame }) {
  const { best } = useBestScore(game.slug, game.score.better);
  if (best === null) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-cobalt/15 px-3 py-1 text-sm text-cobalt-soft">
      <Trophy aria-hidden className="size-3.5" />
      <span className="sr-only">Ton record : </span>
      {best} {game.score.unit}
    </span>
  );
}
