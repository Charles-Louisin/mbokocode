"use client";

import { useRef } from "react";
import { SplitLines } from "@/src/components/motion/SplitLines";
import { useScrollScene } from "@/src/components/motion/useScrollScene";
import { pad2 } from "@/src/lib/format";
import type { SiteContent } from "@/src/lib/api/types";

const COUNT_WORDS: Record<number, string> = { 3: "Trois", 4: "Quatre", 5: "Cinq", 6: "Six", 7: "Sept", 8: "Huit" };

// Méthode : une ligne de progression se remplit au rythme du scroll et marque chaque étape franchie.
export function MethodTimeline({ method }: { method: SiteContent["method"] }) {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (root, { gsap }) => {
    const list = root.querySelector("[data-steps]");
    gsap.fromTo(
      root.querySelector("[data-progress]"),
      { scaleY: 0 },
      { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 65%", end: "bottom 65%", scrub: 0.4 } },
    );
    // Le texte reste toujours lisible : seule la pastille de l'étape se remplit à son passage.
    root.querySelectorAll<HTMLElement>("[data-step]").forEach((step) => {
      gsap.fromTo(
        step.querySelector("[data-dot]"),
        { scale: 0 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: step, start: "top 70%", end: "top 55%", scrub: true } },
      );
    });
  });

  return (
    <section ref={ref} aria-labelledby="method-title" className="surface-ivory py-24 md:py-36">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <SplitLines
              id="method-title"
              className="mt-6 text-title font-semibold"
              lines={[`${COUNT_WORDS[method.length] ?? method.length} temps,`, <>aucune surprise.</>]}
            />
            <p className="mt-6 max-w-md text-fg-muted">
              Tu sais à tout moment où en est le projet, ce qui est livré et pourquoi. Chaque décision technique sert un
              objectif concret.
            </p>
          </div>
        </div>

        <div className="relative lg:col-span-7" data-steps>
          <span aria-hidden className="absolute left-[0.6rem] top-0 h-full w-px bg-line" />
          <span aria-hidden data-progress className="absolute left-[0.6rem] top-0 h-full w-px origin-top bg-cobalt" />
          <ol className="space-y-14">
            {method.map((step, index) => (
              <li key={step.title} data-step className="relative grid gap-3 pl-12">
                <span aria-hidden className="absolute left-0 top-1.5 flex size-[1.2rem] items-center justify-center rounded-full border-2 border-cobalt bg-bg">
                  <span data-dot className="size-2 rounded-full bg-cobalt" />
                </span>
                <span className="label text-accent">Étape {pad2(index + 1)}</span>
                <h3 className="text-[clamp(1.6rem,2.8vw,2.4rem)] font-medium leading-tight tracking-[-0.03em]">{step.title}</h3>
                <p className="max-w-lg text-lg text-fg-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
