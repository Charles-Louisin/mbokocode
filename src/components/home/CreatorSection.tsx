import { ArrowUpRight } from "lucide-react";
import { BrandIcon } from "@/src/components/ui/BrandIcon";
import { getContent } from "@/src/lib/api/content";
import type { Creator } from "@/src/lib/api/types";
import { type CreatorAccount, CreatorVideos } from "./CreatorVideos";

// Création de contenu : l'autre facette de Charles. Univers volontairement différent du reste de la page
// (fond nuit traversé de lueurs cyan et rose, cartes verticales inclinées en pellicule), mêmes données que la base.
// Deux comptes : l'entreprise (@mbokocode) et le compte personnel ; les vidéos se filtrent par compte.
export async function CreatorSection() {
  const result = await getContent();
  const content = result.ok ? result.data : undefined;
  const accounts: CreatorAccount[] = [
    content?.businessCreator && { kind: "business" as const, label: "Entreprise", creator: content.businessCreator },
    content?.creator && { kind: "personal" as const, label: "Personnel", creator: content.creator },
  ].filter((account): account is CreatorAccount => Boolean(account));
  if (accounts.every((account) => account.creator.videos.length === 0)) return null;

  const business = accounts.find((account) => account.kind === "business")?.creator;
  const personal = accounts.find((account) => account.kind === "personal")?.creator;

  return (
    <section aria-labelledby="creator-title" className="relative isolate overflow-hidden bg-ink py-24 text-ivory md:py-32">
      <span aria-hidden className="absolute -left-40 top-10 -z-10 size-[32rem] rounded-full bg-[#25F4EE]/10 blur-[120px]" />
      <span aria-hidden className="absolute -right-40 bottom-0 -z-10 size-[34rem] rounded-full bg-[#FE2C55]/10 blur-[120px]" />

      <div className="shell grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#25F4EE]">
            <BrandIcon brand="tiktok" className="size-4" />
            Créateur de contenu dev
          </p>
          <h2 id="creator-title" className="mt-6 text-title font-semibold">
            <span className="block">Je code.</span>
            {/* Décalage rose / cyan façon TikTok, réservé à ce titre. */}
            <span className="block [text-shadow:-3px_0_0_rgb(37_244_238/0.75),3px_0_0_rgb(254_44_85/0.75)]">Et je le raconte.</span>
          </h2>
          <div className="mt-6 max-w-lg space-y-3 text-lg text-ivory/75">
            {business && (
              <p>
                <strong className="font-semibold text-ivory">@{business.handle}</strong>, c&apos;est le compte entreprise : les sites, les applications et les
                coulisses de MBOKO CODE.
              </p>
            )}
            {personal && (
              <p>
                <strong className="font-semibold text-ivory">@{personal.handle}</strong>, c&apos;est mon compte personnel : de l&apos;humour et l&apos;apprentissage
                du dev.
              </p>
            )}
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
          {accounts.map(({ kind, label, creator }) => (
            <li key={kind}>
              <AccountCard label={label} creator={creator} highlight={kind === "business"} />
            </li>
          ))}
        </ul>
      </div>

      <CreatorVideos accounts={accounts} />
    </section>
  );
}

function AccountCard({ label, creator, highlight }: { label: string; creator: Creator; highlight: boolean }) {
  return (
    <article className={`flex h-full flex-col rounded-(--radius) border p-5 backdrop-blur ${highlight ? "border-[#25F4EE]/30 bg-[#25F4EE]/[0.05]" : "border-ivory/10 bg-ivory/[0.03]"}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ivory/60">{label}</p>
      <p className="mt-1 text-xl font-semibold">@{creator.handle}</p>
      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
        {creator.stats.map((stat) => (
          <div key={stat.label}>
            <dt className="text-[0.68rem] uppercase tracking-[0.1em] text-ivory/55">{stat.label}</dt>
            <dd className="mt-1 whitespace-nowrap text-[clamp(1.1rem,1.8vw,1.5rem)] font-semibold leading-none tabular-nums [font-stretch:110%]">{stat.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-ivory/50">Chiffres relevés le {creator.recordedAt}.</p>
      {/* Le bouton reste en bas de la carte, même si l'autre carte est plus haute. */}
      <div className="mt-auto pt-4">
        <a
          href={creator.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-ivory px-4 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.03]"
        >
          <BrandIcon brand="tiktok" className="size-4" />
          Suivre @{creator.handle}
          <ArrowUpRight aria-hidden className="size-4" />
          <span className="sr-only"> (TikTok, nouvel onglet)</span>
        </a>
      </div>
    </article>
  );
}
