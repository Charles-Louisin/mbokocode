import { Mail } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { type ReactNode, Suspense } from "react";
import { BrandIcon, brandForSocial } from "@/src/components/ui/BrandIcon";
import { getChannels } from "@/src/lib/channels";
import { whatsappLink } from "@/src/lib/whatsapp";
import { FooterMotion } from "./FooterMotion";

const WORDMARK = "MBOKO CODE";

// L'année est mise en cache une journée : elle reste dans la page prérendue.
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

function RoundLink({ href, label, external = true, children }: { href: string; label: string; external?: boolean; children: ReactNode }) {
  return (
    <li>
      <a
        href={href}
        aria-label={label}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        // Au survol, un disque cobalt remplit le bouton depuis le centre.
        className="group relative isolate grid size-14 place-items-center overflow-hidden rounded-full border border-ivory/15 text-ivory transition-colors duration-500 before:absolute before:inset-0 before:-z-10 before:scale-0 before:rounded-full before:bg-cobalt before:transition-transform before:duration-500 before:ease-(--ease-expo) hover:border-cobalt hover:before:scale-100 md:size-16"
      >
        <span className="transition-transform duration-500 ease-(--ease-expo) group-hover:-translate-y-0.5">{children}</span>
      </a>
    </li>
  );
}

async function ContactLinks() {
  const channels = await getChannels();
  const wa = whatsappLink(channels.whatsappNumber, "Bonjour Charles, je voudrais parler d'un projet.");
  return (
    <ul className="flex flex-wrap gap-3">
      {wa && (
        <RoundLink href={wa} label="Écrire sur WhatsApp (nouvel onglet)">
          <BrandIcon brand="whatsapp" className="size-5" />
        </RoundLink>
      )}
      {channels.email && (
        <RoundLink href={`mailto:${channels.email}?subject=${encodeURIComponent("Projet — via le portfolio")}`} label={`Écrire à ${channels.email}`} external={false}>
          <Mail aria-hidden className="size-5" />
        </RoundLink>
      )}
      {channels.socials.map((social) => {
        const brand = brandForSocial(social.label);
        return brand ? (
          <RoundLink key={social.url} href={social.url} label={`${social.label} (nouvel onglet)`}>
            <BrandIcon brand={brand} className="size-5" />
          </RoundLink>
        ) : null;
      })}
    </ul>
  );
}

// Pied de page : les canaux directs en boutons ronds, et le nom en très grand.
export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink text-ivory">
      <FooterMotion>
        <div className="shell pt-24 md:pt-32">
          <h2 className="sr-only">Contact</h2>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p data-footer-item className="label text-fg-subtle">
              Me retrouver
            </p>
            {/* Animé en bloc : les liens arrivent en streaming (Suspense), GSAP ne doit pas les toucher avant leur hydratation. */}
            <div data-footer-item>
              <Suspense fallback={null}>
                <ContactLinks />
              </Suspense>
            </div>
          </div>

          {/* Lettres étirées en hauteur (×1,9) depuis leur base ; le padding réserve la place gagnée. */}
          <p data-wordmark aria-label={WORDMARK} className="mt-16 flex select-none justify-between overflow-hidden border-t hairline pt-[calc(1.5rem+6.7vw)] md:mt-24 min-[1600px]:pt-[8.2rem]">
            {WORDMARK.split("").map((char, index) => (
              <span key={index} aria-hidden data-letter className="inline-block">
                <span
                  data-letter-inner
                  className="inline-block origin-bottom text-[7.6vw] font-semibold leading-[0.8] tracking-[-0.04em] [font-stretch:125%] transition-transform duration-500 ease-(--ease-expo) [transform:scaleY(calc(1.9*var(--lift,1)))] min-[1600px]:text-[7.6rem]"
                >
                  {/* Espace insécable : un espace seul s'effondrerait dans un inline-block. */}
                  {char === " " ? " " : char}
                </span>
              </span>
            ))}
          </p>

          <div className="flex flex-col gap-3 border-t hairline py-6 text-sm text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
            <p>
              © <CurrentYear /> MBOKO CODE — Charles Louisin Yimbne
            </p>
            <p className="flex gap-5">
              <Link href="/confidentialite" className="link-draw hover:text-fg">
                Confidentialité
              </Link>
              <Link href="/mentions-legales" className="link-draw hover:text-fg">
                Mentions légales
              </Link>
            </p>
          </div>
        </div>
      </FooterMotion>
    </footer>
  );
}
