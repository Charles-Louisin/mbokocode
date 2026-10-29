"use client";

import { type RefObject, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/src/lib/gsap";

let watchingLayout = false;

// Les sections diffusées en streaming (Suspense) changent la hauteur de la page après le montage :
// on recalcule alors les positions de déclenchement, une seule fois par rafale de changements.
function watchLayout() {
  if (watchingLayout) return;
  watchingLayout = true;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastHeight = document.body.scrollHeight;
  new ResizeObserver(() => {
    const height = document.body.scrollHeight;
    if (height === lastHeight) return;
    lastHeight = height;
    clearTimeout(timer);
    timer = setTimeout(() => ScrollTrigger.refresh(), 150);
  }).observe(document.body);
}

/**
 * Monte une scène GSAP liée au scroll sur un élément, uniquement si l'utilisateur
 * accepte les animations. Tout est annulé proprement au démontage.
 */
export function useScrollScene<T extends HTMLElement>(
  ref: RefObject<T | null>,
  setup: (root: T, tools: { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger }) => void,
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    watchLayout();
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      setup(root, { gsap, ScrollTrigger });
    });
    return () => mm.revert();
    // La scène est montée une fois ; `setup` est défini en ligne par l'appelant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
