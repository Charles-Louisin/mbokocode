"use client";

import { useState } from "react";
import type { Creator } from "@/src/lib/api/types";
import { CreatorReel, type ReelVideo } from "./CreatorReel";

export type CreatorAccount = { kind: "business" | "personal"; label: string; creator: Creator };
type Filter = "all" | CreatorAccount["kind"];

/** Vidéos des comptes, en alternance : l'entreprise et le perso se mélangent dans la pellicule. */
function interleave(accounts: CreatorAccount[]): ReelVideo[] {
  const lists = accounts.map(({ creator }) => creator.videos.map((video) => ({ ...video, handle: creator.handle })));
  const longest = Math.max(0, ...lists.map((list) => list.length));
  return Array.from({ length: longest }, (_, i) => lists.flatMap((list) => (list[i] ? [list[i]] : []))).flat();
}

// Filtre par compte au-dessus de la pellicule. Un seul compte : pas de filtre.
export function CreatorVideos({ accounts }: { accounts: CreatorAccount[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = filter === "all" ? accounts : accounts.filter((account) => account.kind === filter);
  const videos = interleave(shown);
  const options: { value: Filter; label: string }[] = [
    { value: "all", label: "Tout" },
    ...accounts.map((account) => ({ value: account.kind, label: `${account.label} · @${account.creator.handle}` })),
  ];

  return (
    <div className="mt-14">
      {accounts.length > 1 && (
        <div role="group" aria-label="Filtrer les vidéos par compte" className="shell flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
              className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors duration-300 ${
                filter === option.value ? "border-ivory bg-ivory text-ink" : "border-ivory/25 text-ivory hover:border-ivory/60"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      {/* Nouvelle pellicule à chaque filtre : elle repart du début. */}
      <CreatorReel key={filter} videos={videos} />
    </div>
  );
}
