"use client";

import { PenLine } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { BrandIcon } from "@/src/components/ui/BrandIcon";
import { contactHref, DEADLINES, type DeadlineKey, type Estimates, PROJECT_TYPES, type ProjectTypeKey, teaserMessage } from "@/src/lib/project-brief";
import { whatsappLink } from "@/src/lib/whatsapp";

const EASE = [0.16, 1, 0.3, 1] as const;

// « Ton idée, mon prochain build » : deux choix (le type de projet, puis l'échéance), une estimation qui s'affiche
// aussitôt, et deux sorties : le parcours complet, ou WhatsApp avec les choix déjà écrits.
export function ProjectStarter({ whatsappNumber, estimates }: { whatsappNumber: string | null; estimates: Estimates | null }) {
  const reduce = useReducedMotion();
  const [type, setType] = useState<ProjectTypeKey>();
  const [deadline, setDeadline] = useState<DeadlineKey>();
  const wa = whatsappLink(whatsappNumber, teaserMessage(type, deadline));

  const chip = (selected: boolean) =>
    `relative min-h-12 rounded-full border-2 px-5 py-2.5 text-lg font-semibold transition-colors duration-300 ${
      selected ? "border-ivory bg-ivory text-cobalt" : "border-ivory/40 text-ivory hover:border-ivory"
    }`;

  return (
    <section aria-labelledby="starter-title" className="grain relative isolate overflow-hidden bg-cobalt py-24 text-ivory md:py-32">
      <div className="shell">
        <p className="text-lg font-medium text-ivory">Prochain chantier</p>
        <h2 id="starter-title" className="mt-2 text-mega font-semibold">
          <span className="block">Ton idée,</span>
          <span className="block">mon prochain build.</span>
        </h2>

        <div role="group" aria-label="Type de projet" className="mt-12 flex flex-wrap gap-3">
          {(Object.keys(PROJECT_TYPES) as ProjectTypeKey[]).map((key) => (
            <button key={key} type="button" aria-pressed={type === key} onClick={() => setType(type === key ? undefined : key)} className={chip(type === key)}>
              {PROJECT_TYPES[key].label}
            </button>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ivory">Livraison souhaitée</p>
          <AnimatePresence>
            {type && estimates && (
              <motion.span
                key={type}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="rounded-full bg-ink/25 px-3 py-1 text-sm font-semibold"
              >
                {estimates[type]}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div role="group" aria-label="Échéance" className="mt-4 flex flex-wrap gap-3">
          {(Object.keys(DEADLINES) as DeadlineKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={deadline === key}
              onClick={() => setDeadline(deadline === key ? undefined : key)}
              className={chip(deadline === key)}
            >
              {DEADLINES[key].label}
            </button>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href={contactHref(type, deadline)}
            className="inline-flex min-h-14 items-center gap-2.5 rounded-full bg-ink px-8 text-lg font-semibold text-ivory transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            <PenLine aria-hidden className="size-5" />
            Écrire mon brief
          </Link>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-lg font-semibold underline decoration-2 underline-offset-[6px]">
              <BrandIcon brand="whatsapp" className="size-5" />
              ou en parler sur WhatsApp
              <span className="sr-only"> (nouvel onglet, message prérempli)</span>
            </a>
          )}
        </div>
        <p aria-live="polite" className="mt-6 min-h-6 text-ivory">
          {type && estimates ? `Délai indicatif : ${estimates[type]}.` : estimates ? "Choisis un type de projet pour voir le délai indicatif." : null}
        </p>
      </div>
    </section>
  );
}
