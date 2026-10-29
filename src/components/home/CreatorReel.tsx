"use client";

import { Eye, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { BrandIcon } from "@/src/components/ui/BrandIcon";
import type { Creator } from "@/src/lib/api/types";

const SPEED = 0.35; // px par image (≈ 20 px/s) : un défilement de vitrine, pas un carrousel pressé.

// Les vidéos qui ont percé, en pellicule : la rangée défile seule et lentement, s'arrête au survol,
// au focus ou au toucher, et se fait glisser au doigt. Sans animation demandée, elle reste immobile.
export function CreatorReel({ videos, handle }: { videos: Creator["videos"]; handle: string }) {
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const element = track.current;
    if (!element || reduce) return;
    let frame = 0;
    let paused = false;
    let resumeTimer: number | undefined;
    let position = element.scrollLeft;

    const tick = () => {
      if (!paused) {
        // La liste est rendue deux fois : à mi-course, on revient au début sans saut visible.
        const half = element.scrollWidth / 2;
        position += SPEED;
        if (position >= half) position -= half;
        element.scrollLeft = position;
      } else {
        position = element.scrollLeft;
      }
      frame = requestAnimationFrame(tick);
    };

    const pause = () => {
      window.clearTimeout(resumeTimer);
      paused = true;
    };
    const resumeSoon = (delay = 0) => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        paused = false;
      }, delay);
    };
    const onPointerLeave = () => resumeSoon(0);
    const onTouchEnd = () => resumeSoon(1800);
    const onFocusOut = (event: FocusEvent) => {
      if (!element.contains(event.relatedTarget as Node)) resumeSoon(0);
    };

    element.addEventListener("pointerenter", pause);
    element.addEventListener("pointerleave", onPointerLeave);
    element.addEventListener("touchstart", pause, { passive: true });
    element.addEventListener("touchend", onTouchEnd);
    element.addEventListener("focusin", pause);
    element.addEventListener("focusout", onFocusOut);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resumeTimer);
      element.removeEventListener("pointerenter", pause);
      element.removeEventListener("pointerleave", onPointerLeave);
      element.removeEventListener("touchstart", pause);
      element.removeEventListener("touchend", onTouchEnd);
      element.removeEventListener("focusin", pause);
      element.removeEventListener("focusout", onFocusOut);
    };
  }, [reduce]);

  // Deux copies pour la boucle ; la seconde est masquée aux lecteurs d'écran et au clavier.
  const loop = reduce ? [false] : [false, true];

  return (
    <div
      ref={track}
      role="region"
      aria-label={`Vidéos de @${handle} sur TikTok`}
      className="flex gap-5 overflow-x-auto py-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {loop.map((copy) => (
        <ul key={String(copy)} aria-hidden={copy || undefined} className="flex shrink-0 gap-5 pl-5 first:pl-(--gutter)">
          {videos.map((video, index) => (
            <li key={video.url} className="shrink-0">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={copy ? -1 : undefined}
                className={`group relative block aspect-[9/16] w-52 overflow-hidden rounded-[1.4rem] border border-ivory/10 bg-ink-2 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)] transition-transform duration-500 ease-(--ease-expo) hover:z-10 hover:-translate-y-2 hover:rotate-0 hover:scale-[1.03] md:w-60 ${
                  index % 2 === 0 ? "-rotate-2" : "rotate-2"
                }`}
              >
                {video.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={video.cover} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
                ) : (
                  // Aperçu dessiné aux couleurs TikTok tant qu'aucune miniature n'est enregistrée.
                  <span aria-hidden className="absolute inset-0">
                    <span className="absolute -left-10 top-6 size-40 rounded-full bg-[#25F4EE]/30 blur-3xl" />
                    <span className="absolute -right-10 bottom-16 size-44 rounded-full bg-[#FE2C55]/30 blur-3xl" />
                    <span className="absolute inset-x-5 top-1/2 -translate-y-1/2 text-[1.35rem] font-semibold leading-tight tracking-[-0.02em] text-ivory [font-stretch:115%]">
                      {video.caption}
                    </span>
                  </span>
                )}
                <span aria-hidden className="absolute inset-0 bg-linear-to-t from-ink via-ink/10 to-ink/40" />
                <span className="absolute left-4 top-4 flex items-center gap-1.5 text-xs font-medium text-ivory/85">
                  <BrandIcon brand="tiktok" className="size-4" />@{handle}
                </span>
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/15 text-ivory opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100"
                >
                  <Play className="size-6 translate-x-0.5" fill="currentColor" />
                </span>
                <span className="absolute inset-x-4 bottom-4">
                  {video.cover && <span className="line-clamp-2 block text-sm font-medium text-ivory">{video.caption}</span>}
                  {video.views && (
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-semibold text-ivory backdrop-blur">
                      <Eye aria-hidden className="size-3.5" />
                      {video.views} vues
                    </span>
                  )}
                </span>
                <span className="sr-only">
                  {video.caption}
                  {video.views ? `, ${video.views} vues` : ""} (TikTok, nouvel onglet)
                </span>
              </a>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
