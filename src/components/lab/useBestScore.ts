"use client";

import { useCallback, useSyncExternalStore } from "react";

// Meilleurs scores gardés dans ce navigateur uniquement (rien n'est envoyé au serveur).
// Le stockage peut être indisponible (navigation privée) : le jeu fonctionne quand même.

const key = (slug: string) => `mboko-lab:${slug}`;
const listeners = new Set<() => void>();

function read(slug: string): number | null {
  try {
    const value = window.localStorage.getItem(key(slug));
    return value === null ? null : Number(value);
  } catch {
    return null;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** Meilleur score d'un jeu, et `submit` qui l'enregistre s'il bat le précédent. Renvoie vrai si record. */
export function useBestScore(slug: string, better: "lower" | "higher") {
  const best = useSyncExternalStore(subscribe, () => read(slug), () => null);

  const submit = useCallback(
    (score: number) => {
      const previous = read(slug);
      const isRecord = previous === null || (better === "lower" ? score < previous : score > previous);
      if (!isRecord) return false;
      try {
        window.localStorage.setItem(key(slug), String(score));
      } catch {
        // Stockage refusé : le record n'est simplement pas gardé.
      }
      listeners.forEach((listener) => listener());
      return true;
    },
    [slug, better],
  );

  return { best, submit };
}
