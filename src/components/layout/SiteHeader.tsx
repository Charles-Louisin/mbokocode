"use client";

import { MessageCircle, UserRound } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/src/components/brand/LogoMark";
import { nav, primaryCta } from "@/src/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduce = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Se masque en descendant, réapparaît dès qu'on remonte ; se densifie dès qu'on a quitté le haut.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 160 && y > last);
      setScrolled(y > 24);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ferme le menu à chaque navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      // Garde le focus dans le menu ouvert.
      if (event.key === "Tab" && menuRef.current) {
        const focusables = [toggleRef.current, ...menuRef.current.querySelectorAll<HTMLElement>("a")].filter(
          (el): el is HTMLElement => Boolean(el),
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        // En haut de page : fond transparent, texte en « différence » pour rester lisible sur fond clair
        // comme sombre. Dès qu'on défile : fond nuit flouté, plus lisible au-dessus du contenu.
        className={`fixed inset-x-0 top-0 z-50 border-b text-ivory transition-[transform,background-color,border-color] duration-500 ease-(--ease-expo) ${
          scrolled ? "border-ivory/10 bg-ink/85 backdrop-blur-xl" : "border-transparent bg-transparent mix-blend-difference"
        } ${
          hidden && !open ? "-translate-y-full" : ""
        }`}
      >
        <div className="shell flex h-(--header-h) items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3" aria-label="MBOKO CODE — accueil">
            <LogoMark className="h-4 w-auto" />
            <span className="text-[0.95rem] font-semibold tracking-tight">MBOKO CODE</span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden xl:block">
            <ul className="flex items-center gap-8 text-[0.95rem]">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="link-draw py-1 aria-[current=page]:bg-size-[100%_1px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Espace personnel : connexion, puis gestion de son avis (redirige vers /connexion sans session). */}
            <Link
              href="/compte"
              aria-label="Mon espace : connexion et avis"
              aria-current={isActive("/compte") || isActive("/connexion") ? "page" : undefined}
              className="flex size-11 items-center justify-center rounded-full border border-current/25 transition-colors hover:border-current aria-[current=page]:border-current"
            >
              <UserRound aria-hidden className="size-[1.1rem]" />
            </Link>
            <Link
              href={primaryCta.href}
              className="hidden items-center gap-2 rounded-full bg-ivory px-5 py-2.5 text-[0.9rem] font-medium text-ink transition-transform duration-300 hover:scale-[1.04] sm:inline-flex"
            >
              <MessageCircle aria-hidden className="size-4" />
              {primaryCta.label}
            </Link>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              className="relative z-10 flex size-11 items-center justify-center xl:hidden"
            >
              <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
              <span aria-hidden className="relative block h-3 w-6">
                <span
                  className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ease-(--ease-expo) ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ease-(--ease-expo) ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink px-(--gutter) pb-8 pt-[calc(var(--header-h)+2rem)] text-ivory xl:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduce ? 0.2 : 0.7, ease: EASE }}
          >
            <nav aria-label="Navigation mobile" className="flex-1">
              <ul className="space-y-1">
                {[{ href: "/", label: "Accueil" }, ...nav, { href: "/avis", label: "Avis" }, { href: "/contact", label: "Contact" }].map((item, index) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.div
                      initial={reduce ? false : { y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.15 + index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        aria-current={pathname === item.href ? "page" : undefined}
                        className="flex items-baseline gap-4 py-1 text-[clamp(2.4rem,11vw,4rem)] font-medium leading-[1.05] tracking-[-0.04em] aria-[current=page]:text-cobalt-soft"
                      >
                        <span className="label text-ivory/40">0{index + 1}</span>
                        {item.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
            <Link
              href={primaryCta.href}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-ivory px-6 py-4 font-medium text-ink"
            >
              <MessageCircle aria-hidden className="size-4" />
              {primaryCta.label}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
