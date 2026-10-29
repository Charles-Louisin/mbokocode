"use client";

import { ArrowUp, MessageCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandIcon } from "@/src/components/ui/BrandIcon";
import { primaryCta } from "@/src/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;

// Actions flottantes, visibles une fois le premier écran dépassé :
// - sur mobile, une barre en bas d'écran : logo WhatsApp (message prérempli), « Parlons de ton projet », retour en haut ;
// - sur ordinateur, seulement le bouton de retour en haut.
// Elles s'effacent au-dessus du pied de page, qui propose déjà les mêmes canaux.
export function FloatingActions({ whatsappHref }: { whatsappHref: string | null }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    const footer = document.querySelector("footer");
    const observer = footer ? new IntersectionObserver(([entry]) => setFooterVisible(Boolean(entry?.isIntersecting))) : null;
    if (footer) observer?.observe(footer);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  const visible = scrolled && !footerVisible;
  // La page de contact a déjà ses propres boutons d'envoi : pas de barre en double.
  const showBar = pathname !== "/contact";
  const toTop = () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  const enter = reduce ? { opacity: 0 } : { opacity: 0, y: 24 };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {showBar && (
            <motion.nav
              key="bar"
              aria-label="Actions rapides"
              initial={enter}
              animate={{ opacity: 1, y: 0 }}
              exit={enter}
              transition={{ duration: 0.45, ease: EASE }}
              className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex items-center gap-2 rounded-full border border-ivory/10 bg-ink/85 p-1.5 text-ivory shadow-[0_20px_50px_-15px_rgb(0_0_0/0.7)] backdrop-blur-xl md:hidden"
            >
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discuter sur WhatsApp (nouvel onglet, message prérempli)"
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-[#0b1326]"
                >
                  <BrandIcon brand="whatsapp" className="size-6" />
                </a>
              )}
              <Link href={primaryCta.href} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ivory px-4 text-sm font-semibold text-ink">
                <MessageCircle aria-hidden className="size-4 shrink-0" />
                {primaryCta.label}
              </Link>
              <button type="button" onClick={toTop} aria-label="Revenir en haut de la page" className="flex size-12 shrink-0 items-center justify-center rounded-full border border-ivory/20">
                <ArrowUp aria-hidden className="size-5" />
              </button>
            </motion.nav>
          )}
          <motion.button
            key="top"
            type="button"
            onClick={toTop}
            aria-label="Revenir en haut de la page"
            initial={enter}
            animate={{ opacity: 1, y: 0 }}
            exit={enter}
            transition={{ duration: 0.45, ease: EASE }}
            className={`fixed bottom-6 right-6 z-40 size-14 items-center justify-center rounded-full border border-ivory/15 bg-ink/85 text-ivory shadow-[0_20px_50px_-15px_rgb(0_0_0/0.7)] backdrop-blur-xl transition-colors hover:border-cobalt hover:bg-cobalt ${
              showBar ? "hidden md:flex" : "flex"
            }`}
          >
            <ArrowUp aria-hidden className="size-5" />
          </motion.button>
        </>
      )}
    </AnimatePresence>
  );
}
