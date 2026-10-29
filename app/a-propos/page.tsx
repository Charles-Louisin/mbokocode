import { Languages } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { JourneyRail } from "@/src/components/about/JourneyRail";
import { PortraitParallax } from "@/src/components/about/PortraitParallax";
import { FinalCta } from "@/src/components/home/FinalCta";
import { Highlight } from "@/src/components/motion/Highlight";
import { SplitLines } from "@/src/components/motion/SplitLines";
import { ContentIcon } from "@/src/components/ui/ContentIcon";
import { ToolLogo } from "@/src/components/ui/ToolLogo";
import { getContent, getProjects, getSettings } from "@/src/lib/api/content";
import { pad2 } from "@/src/lib/format";
import { tool } from "@/src/lib/tools";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Charles Louisin Yimbne, développeur full-stack basé à Douala et fondateur de MBOKO CODE : parcours, compétences et façon de travailler.",
  alternates: { canonical: "/a-propos" },
};

// Valeurs, principes, parcours et langues : contenu enregistré en base, rien n'est écrit ici.
async function Values() {
  const content = await getContent();
  if (!content.ok || content.data.values.length === 0) return null;
  const values = content.data.values;
  return (
        <div className="mt-10 border-l-2 border-cobalt pl-6">
          <p className="text-lg text-fg-muted">Ce à quoi je tiens dans chaque projet :</p>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {values.map(({ icon, label }) => (
              <li key={label} className="flex items-center gap-2 rounded-full border border-cobalt-soft/30 bg-cobalt/10 px-4 py-2 font-medium">
                <ContentIcon name={icon} className="size-4 text-cobalt-soft" />
                {label}
              </li>
            ))}
          </ul>
        </div>
  );
}

async function Principles() {
  const content = await getContent();
  if (!content.ok || content.data.principles.length === 0) return null;
  const principles = content.data.principles;
  return (
        <div className="mt-16 border-t hairline pt-10">
          <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.02em]">Ma façon de travailler</h2>
          <ul className="mt-8 grid gap-4">
            {principles.map(({ icon, ...principle }, index) => (
              <li key={principle.title} className="group grid grid-cols-[auto_1fr] gap-5 rounded-2xl border hairline p-6 transition-colors duration-500 hover:border-cobalt-soft/40">
                <span className="flex size-12 items-center justify-center rounded-full bg-cobalt/15 text-cobalt-soft transition-colors duration-500 group-hover:bg-cobalt group-hover:text-ivory">
                  <ContentIcon name={icon} className="size-5" />
                </span>
                <div>
                  <p className="label text-fg-subtle">{pad2(index + 1)}</p>
                  <h3 className="mt-1 text-xl font-semibold">{principle.title}</h3>
                  <p className="mt-2 text-lg text-fg-muted">{principle.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
  );
}

async function Journey() {
  const content = await getContent();
  if (!content.ok || content.data.journey.length === 0) return null;
  return <JourneyRail steps={content.data.journey} />;
}

async function LanguageList() {
  const content = await getContent();
  if (!content.ok || content.data.languages.length === 0) return null;
  const languages = content.data.languages;
  return (
      <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 border-t hairline pt-8">
        <h3 className="flex items-center gap-2.5 text-lg font-semibold">
          <Languages aria-hidden className="size-5 text-accent" />
          Langues
        </h3>
        <ul className="flex flex-wrap gap-2.5">
          {languages.map((language) => (
            <li key={language.name} className="flex items-baseline gap-2 rounded-full border hairline px-4 py-2">
              <span className="font-medium">{language.name}</span>
              <span className="text-sm text-fg-subtle">{language.level}</span>
            </li>
          ))}
        </ul>
      </div>
  );
}

// Compétences reliées aux projets publiés qui les utilisent réellement.
async function Skills() {
  const [result, content] = await Promise.all([getProjects(), getContent()]);
  if (!content.ok) return null;
  const projects = result.ok ? result.data : [];
  const { skillGroups } = content.data;

  return (
    <div className="grid gap-12 md:grid-cols-3">
      {skillGroups.map((group) => (
        <div key={group.title}>
          <h3 className="flex items-baseline gap-3 text-xl font-semibold">
            <span className="label text-accent">{group.skills.length} outils</span>
            {group.title}
          </h3>
          <ul className="mt-6 border-t hairline">
            {group.skills.map((skill) => {
              const usedIn = projects.filter((project) => project.technologies.includes(skill));
              return (
                <li key={skill} className="flex gap-4 border-b hairline py-4">
                  <ToolLogo tool={tool(skill)} className="mt-0.5 size-10" />
                  <div className="min-w-0">
                  <p className="text-lg font-medium">{skill}</p>
                  {usedIn.length > 0 && (
                    <p className="mt-1 text-sm text-fg-subtle">
                      Utilisé pour{" "}
                      {usedIn.map((project, i) => (
                        <span key={project.slug}>
                          {i > 0 && (i === usedIn.length - 1 ? " et " : ", ")}
                          <Link href={`/projets/${project.slug}`} className="link-draw hover:text-fg">
                            {project.title}
                          </Link>
                        </span>
                      ))}
                    </p>
                  )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

async function Elsewhere() {
  const settings = await getSettings();
  if (!settings.ok || settings.data.socials.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-3">
      {settings.data.socials.map((social) => (
        <li key={social.url}>
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full border hairline px-5 py-2.5 transition-colors hover:border-fg"
          >
            {social.label}
            <span className="sr-only"> (nouvel onglet)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

// À propos — « le portrait » : la photo reste épinglée pendant que l'histoire se lit à côté,
// puis le parcours se déroule comme un registre daté.
export default function AboutPage() {
  return (
    <>
      <div className="shell pt-[calc(var(--header-h)+3rem)]">
        <SplitLines as="h1" mode="intro" className="text-mega font-semibold" lines={["Charles,", "derrière MBOKO CODE."]} />
      </div>

      <section aria-label="Présentation" className="shell mt-16 grid gap-12 md:mt-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <PortraitParallax />
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          {/* Lecture en trois temps : l'accroche en grand, le périmètre en clair, puis ce qui compte pour moi. */}
          <p className="label text-accent">Qui je suis</p>
          <p className="mt-5 text-[clamp(1.6rem,2.6vw,2.3rem)] font-medium leading-[1.22] tracking-[-0.02em]">
            Je m&apos;appelle Charles Louisin Yimbne.{" "}
            <span className="font-semibold [font-stretch:125%]">MBOKO CODE</span>, c&apos;est mon activité de développement :
            je conçois et développe des plateformes pour des entreprises et des particuliers qui ont besoin d&apos;<Highlight>un outil qui tient la charge</Highlight>,{" "}
            <span className="text-fg-muted line-through decoration-cobalt-soft decoration-2">pas d&apos;une vitrine de plus</span>.
          </p>

          <p className="mt-10 text-lg leading-relaxed text-fg-muted md:text-xl">
            <span className="font-medium text-fg">Marketplaces, applications métiers, systèmes de gestion</span> : je prends le
            projet{" "}
            <span className="text-fg underline decoration-cobalt-soft decoration-2 underline-offset-[6px]">
              de l&apos;architecture jusqu&apos;à la mise en production
            </span>
            . Je travaille seul et en direct avec toi : un seul interlocuteur, du premier échange à la livraison.
          </p>

          <Suspense fallback={null}>
            <Values />
          </Suspense>

          <Suspense fallback={null}>
            <Principles />
          </Suspense>

          <div className="mt-12">

          <Suspense fallback={null}>
            <Elsewhere />
          </Suspense>
          </div>
        </div>
      </section>

      <section aria-labelledby="journey-title" className="surface-ivory mt-24 py-24 md:mt-36 md:py-36">
        <div className="shell">
          <SplitLines id="journey-title" className="max-w-4xl text-title font-semibold" lines={["Le parcours,", "du plus récent au premier pas."]} />
          <Suspense fallback={null}>
            <Journey />
          </Suspense>
        </div>
      </section>

      <section aria-labelledby="skills-title" className="shell py-24 md:py-36">
        <SplitLines id="skills-title" className="max-w-4xl text-title font-semibold" lines={["Des outils,", "et les projets qui les prouvent."]} />
        <div className="mt-16">
          <Suspense fallback={null}>
            <Skills />
          </Suspense>
        </div>
        <Suspense fallback={null}>
          <LanguageList />
        </Suspense>
      </section>

      <FinalCta />
    </>
  );
}
