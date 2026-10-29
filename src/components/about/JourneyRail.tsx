"use client";

import { BriefcaseBusiness, GraduationCap, Rocket } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/src/components/motion/useScrollScene";
import type { JourneyStep } from "@/src/lib/api/types";

const KIND_ICONS = { venture: Rocket, work: BriefcaseBusiness, school: GraduationCap } as const;
const KIND_LABELS = { venture: "Entreprise", work: "Expérience", school: "Formation" } as const;

// Parcours sur un rail : la ligne se remplit au fil du scroll et chaque étape s'allume à son passage.
// Le texte est toujours lisible ; seuls le rail et les pastilles bougent.
export function JourneyRail({ steps }: { steps: JourneyStep[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useScrollScene(ref, (root, { gsap }) => {
    gsap.fromTo(
      root.querySelector("[data-rail]"),
      { scaleY: 0 },
      { scaleY: 1, ease: "none", scrollTrigger: { trigger: root, start: "top 70%", end: "bottom 70%", scrub: 0.4 } },
    );
    root.querySelectorAll<HTMLElement>("[data-step]").forEach((step) => {
      gsap.fromTo(
        step.querySelector("[data-badge]"),
        { backgroundColor: "rgba(47,84,255,0)", color: "#1f3fd6" },
        { backgroundColor: "rgba(47,84,255,1)", color: "#e8ebf2", ease: "none", scrollTrigger: { trigger: step, start: "top 72%", end: "top 60%", scrub: true } },
      );
    });
  });

  return (
    <ol ref={ref} className="relative mt-16">
      <span aria-hidden className="absolute left-6 top-0 h-full w-px bg-line md:left-7" />
      <span aria-hidden data-rail className="absolute left-6 top-0 h-full w-px origin-top bg-cobalt md:left-7" />
      {steps.map((step) => {
        const Icon = KIND_ICONS[step.kind];
        return (
          <li key={step.period} data-step className="relative grid gap-4 pb-16 pl-20 last:pb-0 md:grid-cols-12 md:gap-8 md:pl-24">
            <span
              aria-hidden
              data-badge
              className="absolute left-0 top-0 flex size-12 items-center justify-center rounded-full border-2 border-cobalt bg-cobalt text-ivory md:size-14"
            >
              <Icon className="size-5 md:size-6" />
            </span>
            <div className="md:col-span-4">
              <p className="label text-cobalt-deep">{KIND_LABELS[step.kind]}</p>
              <p className="mt-2 text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold leading-tight [font-stretch:125%]">{step.period}</p>
            </div>
            <div className="md:col-span-8">
              <h3 className="text-2xl font-semibold tracking-[-0.01em]">{step.title}</h3>
              <p className="mt-1 font-medium text-fg-muted">{step.place}</p>
              <p className="mt-4 max-w-[62ch] text-lg">{step.text}</p>
              {step.points && (
                <ul className="mt-6 max-w-[62ch] space-y-3">
                  {step.points.map((point) => (
                    <li key={point} className="flex gap-3 text-fg-muted">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-cobalt" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
