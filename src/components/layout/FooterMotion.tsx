"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { gsap } from "@/src/lib/gsap";

// Animations du pied de page, dans l'esprit de celui d'aquidev.com :
// - le contenu remonte « de dessous » pendant qu'on arrive en bas (parallaxe -18 % → 0) ;
// - les boutons de contact apparaissent l'un après l'autre ;
// - les lettres de « MBOKO CODE » montent en vague, puis s'étirent encore près du pointeur.
// Rien ne bouge si l'utilisateur réduit les animations.

export function FooterMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const footer = root.closest("footer");
      gsap.fromTo(root, { yPercent: -18 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: footer, start: "top bottom", end: "bottom bottom", scrub: true } });
      gsap.from(root.querySelectorAll("[data-footer-item]"), {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: { trigger: footer, start: "top bottom-=80", once: true },
      });
      gsap.from(root.querySelectorAll("[data-letter]"), {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.04,
        ease: "expo.out",
        scrollTrigger: { trigger: root.querySelector("[data-wordmark]"), start: "top bottom", once: true },
      });
    });

    // Étirement des lettres proches du pointeur (souris uniquement).
    const wordmark = root.querySelector<HTMLElement>("[data-wordmark]");
    const letters = [...root.querySelectorAll<HTMLElement>("[data-letter-inner]")];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!wordmark || reduce) return () => mm.revert();

    let raf = 0;
    let pointerX: number | null = null;
    const render = () => {
      raf = 0;
      for (const letter of letters) {
        const box = letter.getBoundingClientRect();
        const distance = pointerX === null ? Infinity : Math.abs(pointerX - (box.left + box.width / 2));
        const influence = Math.max(0, 1 - distance / (box.width * 2.2));
        letter.style.setProperty("--lift", String(1 + influence * 0.1));
      }
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX = event.clientX;
      if (!raf) raf = requestAnimationFrame(render);
    };
    const leave = () => {
      pointerX = null;
      if (!raf) raf = requestAnimationFrame(render);
    };
    wordmark.addEventListener("pointermove", move);
    wordmark.addEventListener("pointerleave", leave);
    return () => {
      mm.revert();
      cancelAnimationFrame(raf);
      wordmark.removeEventListener("pointermove", move);
      wordmark.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
