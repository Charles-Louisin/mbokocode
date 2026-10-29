import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectBrief } from "@/src/components/contact/ProjectBrief";
import { SplitLines } from "@/src/components/motion/SplitLines";
import { BrandIcon } from "@/src/components/ui/BrandIcon";
import { getPricing } from "@/src/lib/api/content";
import { getChannels } from "@/src/lib/channels";
import { estimatesFrom, teaserMessage } from "@/src/lib/project-brief";
import { whatsappLink } from "@/src/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: "Décris ton projet en quatre étapes et envoie-le sur WhatsApp ou par e-mail, ",
  alternates: { canonical: "/contact" },
};

async function Contact() {
  const [channels, pricing] = await Promise.all([getChannels(), getPricing()]);
  const wa = whatsappLink(channels.whatsappNumber, teaserMessage());

  return (
    <>
      <aside className="lg:col-span-4">
        <p className="max-w-sm text-lg text-fg-muted">
          Quatre étapes pour cadrer ton besoin, puis tu m&apos;envoies le brief sur le canal de ton choix. Pressé ? Écris-moi directement.
        </p>
        <ul className="mt-10 space-y-6">
          {wa && (
            <li>
              <p className="label text-fg-subtle">WhatsApp</p>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="link-draw mt-1 inline-flex items-center gap-2 text-lead">
                <BrandIcon brand="whatsapp" className="size-5 text-cobalt-soft" />
                Écrire sur WhatsApp
                <span className="sr-only"> (nouvel onglet)</span>
              </a>
            </li>
          )}
          {channels.email && (
            <li>
              <p className="label text-fg-subtle">E-mail</p>
              <a href={`mailto:${channels.email}`} className="link-draw mt-1 inline-block text-lead">
                {channels.email}
              </a>
            </li>
          )}
          {channels.location && (
            <li>
              <p className="label text-fg-subtle">Basé à</p>
              <p className="mt-1 text-lead">{channels.location}</p>
            </li>
          )}
        </ul>
      </aside>
      <div className="lg:col-span-8">
        {/* useSearchParams (choix venus de l'accueil) se lit à la requête. */}
        <Suspense fallback={<div className="h-96 animate-pulse rounded-(--radius) bg-bg-raised" />}>
          <ProjectBrief whatsappNumber={channels.whatsappNumber} email={channels.email} estimates={pricing.ok ? estimatesFrom(pricing.data) : null} />
        </Suspense>
      </div>
    </>
  );
}

// Contact — « le brief » : quatre étapes guidées, puis l'envoi sur WhatsApp, par e-mail ou un appel.
export default function ContactPage() {
  return (
    <div className="shell pb-24 pt-[calc(var(--header-h)+3rem)] md:pb-36">
      <SplitLines as="h1" mode="intro" className="text-mega font-semibold" lines={["Donne vie", "à ton projet."]} />
      <div className="intro-fade mt-16 grid gap-16 border-t hairline pt-12 lg:grid-cols-12" style={{ "--intro-delay": "500ms" } as React.CSSProperties}>
        <Suspense fallback={<div className="h-96 animate-pulse rounded-(--radius) bg-bg-raised lg:col-span-12" />}>
          <Contact />
        </Suspense>
      </div>
    </div>
  );
}
