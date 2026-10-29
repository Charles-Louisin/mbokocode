"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/src/lib/cn";

type Props = {
  /** Nom du carrousel pour les lecteurs d'écran. */
  label: string;
  slides: { key: string; node: ReactNode }[];
  /** Carrousel sur mobile seulement ; à partir de `md`, la liste reprend `desktopClassName` (une grille). */
  mobileOnly?: boolean;
  desktopClassName?: string;
  /** Largeur d'une diapositive par palier, ex. « md:w-[calc(50%-0.5rem)] ». Pleine largeur sur mobile. */
  slideClassName?: string;
  /** Déborde jusqu'aux bords de l'écran (par défaut). Faux : reste dans son conteneur. */
  bleed?: boolean;
};

// Diapositives qui défilent de gauche à droite : au doigt (scroll-snap natif), aux flèches,
// aux points ou au clavier (← →). Le défilement reste celui du navigateur : fluide et accessible.
export function Carousel({ label, slides, mobileOnly = false, desktopClassName = "", slideClassName = "", bleed = true }: Props) {
  const track = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => {
      const first = element.children[0] as HTMLElement | undefined;
      if (!first) return;
      const step = first.offsetWidth + parseFloat(getComputedStyle(element).columnGap || "0");
      setActive(Math.round(element.scrollLeft / step));
      setPerView(Math.max(1, Math.round(element.clientWidth / step)));
    };
    update();
    element.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      element.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const pages = Math.max(1, slides.length - perView + 1);
  const goTo = (index: number) => {
    const element = track.current;
    const target = element?.children[Math.min(Math.max(index, 0), slides.length - 1)] as HTMLElement | undefined;
    if (!element || !target) return;
    // La piste est positionnée : offsetLeft se mesure depuis son bord, padding compris.
    element.scrollTo({ left: target.offsetLeft - parseFloat(getComputedStyle(element).paddingLeft), behavior: reduce ? "auto" : "smooth" });
  };

  if (slides.length === 0) return null;
  const controlsHidden = mobileOnly ? "md:hidden" : "";

  return (
    <div role="region" aria-roledescription="carrousel" aria-label={label}>
      <ul
        ref={track}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(active + 1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(active - 1);
          }
        }}
        className={cn(
          "relative flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-cobalt-soft [&::-webkit-scrollbar]:hidden",
          bleed && "-mx-(--gutter) scroll-px-(--gutter) px-(--gutter)",
          mobileOnly && cn("md:mx-0 md:overflow-visible md:px-0 md:pb-0", desktopClassName),
        )}
      >
        {slides.map((slide, index) => (
          <li
            key={slide.key}
            aria-roledescription="diapositive"
            aria-label={`${index + 1} sur ${slides.length}`}
            className={cn("w-full shrink-0 snap-start", mobileOnly && "md:w-auto", slideClassName)}
          >
            {slide.node}
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <div className={cn("mt-6 flex items-center justify-between gap-4", controlsHidden)}>
          <div className="flex gap-1.5" role="group" aria-label="Choisir une diapositive">
            {Array.from({ length: pages }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Aller à la diapositive ${index + 1}`}
                aria-current={index === Math.min(active, pages - 1) || undefined}
                className="flex h-11 items-center px-1"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-[width,background-color] duration-500 ease-(--ease-expo)",
                    index === Math.min(active, pages - 1) ? "w-8 bg-cobalt-soft" : "w-3 bg-fg/25",
                  )}
                />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span aria-live="polite" className="label mr-2 tabular-nums text-fg-subtle">
              {Math.min(active, pages - 1) + 1} / {pages}
            </span>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={active <= 0}
              aria-label="Précédent"
              className="flex size-11 items-center justify-center rounded-full border hairline transition-colors hover:border-fg disabled:opacity-30"
            >
              <ChevronLeft aria-hidden className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active >= pages - 1}
              aria-label="Suivant"
              className="flex size-11 items-center justify-center rounded-full border hairline transition-colors hover:border-fg disabled:opacity-30"
            >
              <ChevronRight aria-hidden className="size-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
