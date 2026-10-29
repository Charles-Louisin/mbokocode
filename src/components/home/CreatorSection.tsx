import { ArrowUpRight } from "lucide-react";
import { BrandIcon } from "@/src/components/ui/BrandIcon";
import { getContent } from "@/src/lib/api/content";
import { CreatorReel } from "./CreatorReel";

// Création de contenu : l'autre facette de Charles. Univers volontairement différent du reste de la page
// (fond nuit traversé de lueurs cyan et rose, cartes verticales inclinées en pellicule), mêmes données que la base.
export async function CreatorSection() {
  const result = await getContent();
  const creator = result.ok ? result.data.creator : undefined;
  if (!creator || creator.videos.length === 0) return null;

  return (
    <section aria-labelledby="creator-title" className="relative isolate overflow-hidden bg-ink py-24 text-ivory md:py-32">
      <span aria-hidden className="absolute -left-40 top-10 -z-10 size-[32rem] rounded-full bg-[#25F4EE]/10 blur-[120px]" />
      <span aria-hidden className="absolute -right-40 bottom-0 -z-10 size-[34rem] rounded-full bg-[#FE2C55]/10 blur-[120px]" />

      <div className="shell grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#25F4EE]">
            <BrandIcon brand="tiktok" className="size-4" />
            Créateur de contenu dev
          </p>
          <h2 id="creator-title" className="mt-6 text-title font-semibold">
            <span className="block">Je code.</span>
            {/* Décalage rose / cyan façon TikTok, réservé à ce titre. */}
            <span className="block [text-shadow:-3px_0_0_rgb(37_244_238/0.75),3px_0_0_rgb(254_44_85/0.75)]">Et je le raconte.</span>
          </h2>
          {creator.bio && <p className="mt-6 max-w-lg text-lg text-ivory/75">{creator.bio}</p>}
        </div>

        <div className="lg:col-span-5">
          <dl className="grid grid-cols-3 divide-x divide-ivory/10 rounded-(--radius) border border-ivory/10 bg-ivory/[0.03] backdrop-blur">
            {creator.stats.map((stat) => (
              <div key={stat.label} className="px-4 py-5 text-center md:px-6">
                <dt className="text-xs uppercase tracking-[0.15em] text-ivory/60">{stat.label}</dt>
                <dd className="mt-2 text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-none tabular-nums [font-stretch:115%]">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-ivory/55">Chiffres relevés le {creator.recordedAt}.</p>
            <a
              href={creator.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ivory px-5 font-semibold text-ink transition-transform duration-300 hover:scale-[1.03]"
            >
              <BrandIcon brand="tiktok" className="size-4" />
              Suivre @{creator.handle}
              <ArrowUpRight aria-hidden className="size-4" />
              <span className="sr-only"> (TikTok, nouvel onglet)</span>
            </a>
          </div>
        </div>
      </div>

      <CreatorReel videos={creator.videos} handle={creator.handle} />
    </section>
  );
}
