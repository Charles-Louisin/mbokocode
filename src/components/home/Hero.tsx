import { LightRays } from "@/src/components/magic/LightRays";
import { SplitLines } from "@/src/components/motion/SplitLines";
import { ActionLink } from "@/src/components/ui/ActionLink";
import { primaryCta } from "@/src/lib/site";
import { GhostMark } from "./GhostMark";

// Accueil — « la signature » : un titre monumental qui se lève ligne par ligne, la lumière cobalt
// du portrait (Light Rays, Magic UI) et le monogramme qui laisse une traînée (d'après « A Drift »,
// Codrops). L'ouverture est en CSS : rien n'attend le JS.
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="grain relative isolate overflow-hidden pb-16 pt-[calc(var(--header-h)+2rem)] md:pb-24">
      <LightRays className="-z-20" />
      <div
        aria-hidden
        className="intro-fade pointer-events-none absolute -right-[6vw] top-[16%] -z-10 w-[64vw] max-w-none text-cobalt-soft/25 lg:-right-[2vw] lg:w-[46vw]"
        style={{ "--intro-delay": "900ms" } as React.CSSProperties}
      >
        <GhostMark className="w-full [&_.ghost-solid]:text-cobalt/20" />
      </div>

      <div className="shell">

        <SplitLines
          as="h1"
          id="hero-title"
          mode="intro"
          className="mt-6 text-[clamp(2.4rem,7.4vw,8.8rem)] font-semibold leading-[0.92] tracking-[-0.035em]"
          lines={["Les idées ambitieuses", "méritent des produits", "qui tiennent."]}
        />

        <div
          className="intro-fade mt-10 grid gap-8 border-t hairline pt-8 md:grid-cols-12"
          style={{ "--intro-delay": "750ms" } as React.CSSProperties}
        >
          <p className="text-lead text-fg-muted md:col-span-6">
            Je conçois et développe des applications web, mobiles et des plateformes sur mesure,{" "}
            <span className="text-fg">de la réflexion initiale à la mise en production.</span>
          </p>
          <div className="flex flex-wrap items-center gap-3 md:col-span-6 md:justify-end">
            <ActionLink href={primaryCta.href}>{primaryCta.label}</ActionLink>
            <ActionLink href="/projets" variant="secondary">
              Voir les réalisations
            </ActionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
