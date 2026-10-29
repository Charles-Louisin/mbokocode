import { BriefcaseBusiness, LayoutDashboard, Store } from "lucide-react";
import { Fraunces } from "next/font/google";
import Image from "next/image";
import { Highlight } from "@/src/components/motion/Highlight";
import { ActionLink } from "@/src/components/ui/ActionLink";
import portrait from "@/public/images/photo_profil.jpeg";

// Serif éditoriale réservée à cette citation : elle tranche avec l'Archivo du reste du site
// et signale qu'on lit une prise de parole, pas une fiche technique.
const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz", "SOFT"], display: "swap" });

const KINDS = [
  { label: "Marketplaces", icon: Store },
  { label: "Applications métiers", icon: BriefcaseBusiness },
  { label: "Systèmes de gestion", icon: LayoutDashboard },
];

// Qui construit : une citation signée. Les mots qui comptent sont surlignés ou barrés,
// les types de projets deviennent des étiquettes, la promesse finale passe en italique.
export function Manifesto() {
  return (
    <section aria-labelledby="manifesto-title" className="shell py-24 md:py-36">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <aside className="flex items-center gap-4 lg:col-span-3 lg:flex-col lg:items-start">
          <span aria-hidden className={`${fraunces.className} text-[7rem] leading-[0.6] text-cobalt lg:text-[11rem]`}>
            «
          </span>
          <figure className="flex items-center gap-4 lg:mt-6 lg:flex-col lg:items-start">
            <span className="relative block size-16 overflow-hidden rounded-full ring-2 ring-cobalt/60 lg:size-24">
              <Image src={portrait} alt="" fill sizes="6rem" className="object-cover object-[50%_25%]" />
            </span>
            <figcaption className="text-sm">
              <span className="block font-semibold">Charles Louisin Yimbne</span>
              <span className="text-fg-muted">Fondateur de MBOKO CODE</span>
            </figcaption>
          </figure>
        </aside>

        <div className="lg:col-span-9">
          <h2 id="manifesto-title" className="sr-only">
            Qui construit
          </h2>
          <blockquote>
            <p
              className={`${fraunces.className} text-[clamp(2rem,4.4vw,4.2rem)] font-normal leading-[1.12] tracking-[-0.02em] [font-variation-settings:'opsz'_144,'SOFT'_50]`}
            >
              Je conçois des plateformes pour celles et ceux qui ont besoin d&apos;un outil{" "}
              <Highlight>qui tient la charge</Highlight>,{" "}
              <span className="text-fg-muted line-through decoration-cobalt-soft decoration-2">pas d&apos;une vitrine de plus</span>.
            </p>

            <ul className="mt-10 flex flex-wrap gap-3" aria-label="Ce que je construis le plus souvent">
              {KINDS.map(({ label, icon: Icon }) => (
                <li key={label} className="flex items-center gap-2.5 rounded-full border border-cobalt-soft/30 bg-cobalt/10 px-4 py-2 text-base font-medium">
                  <Icon aria-hidden className="size-4 text-cobalt-soft" />
                  {label}
                </li>
              ))}
            </ul>

            <p className="mt-10 max-w-[38ch] text-[clamp(1.25rem,2vw,1.75rem)] leading-snug text-fg-muted">
              Je prends chaque projet{" "}
              <em className={`${fraunces.className} text-[1.15em] italic text-fg`}>de l&apos;architecture</em> jusqu&apos;à{" "}
              <strong className="font-semibold text-fg underline decoration-cobalt decoration-[3px] underline-offset-[6px]">
                la mise en production
              </strong>
              .
            </p>
          </blockquote>

          <div className="mt-12">
            <ActionLink href="/a-propos" variant="text">
              Mon parcours et ma façon de travailler
            </ActionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
