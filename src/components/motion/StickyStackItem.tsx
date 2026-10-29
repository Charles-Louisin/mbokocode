"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type Props = { index: number; className?: string; children: ReactNode };

// Carte d'une pile au scroll : elle s'épingle sous l'en-tête (décalée selon son rang), mais jamais
// avant d'être entièrement visible. Une carte plus haute que l'écran s'épingle donc par son bas :
// on la lit jusqu'au bout avant que la suivante ne vienne la recouvrir.
export function StickyStackItem({ index, className = "", children }: Props) {
  const ref = useRef<HTMLLIElement>(null);
  const [top, setTop] = useState<string>(`calc(var(--header-h) + ${index * 1.25}rem)`);

  useEffect(() => {
    const item = ref.current;
    const card = item?.firstElementChild as HTMLElement | null;
    if (!item || !card) return;
    const update = () => {
      const root = getComputedStyle(document.documentElement);
      const rem = parseFloat(root.fontSize) || 16;
      // --header-h est exprimé en rem (4.5rem).
      const header = (parseFloat(root.getPropertyValue("--header-h")) || 4.5) * rem;
      const preferred = header + index * 1.25 * rem;
      // Place minimale pour voir la carte entière, au-dessus de la barre d'actions mobile.
      const bottomSpace = window.innerWidth < 768 ? 88 : 16;
      const fitting = window.innerHeight - card.offsetHeight - bottomSpace;
      setTop(`${Math.min(preferred, fitting)}px`);
    };
    const frame = requestAnimationFrame(update);
    const observer = new ResizeObserver(update);
    observer.observe(card);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [index]);

  return (
    // La marge basse laisse un temps de lecture avant que la carte suivante n'arrive.
    <li ref={ref} className={`sticky mb-[22vh] last:mb-0 ${className}`} style={{ top }}>
      {children}
    </li>
  );
}
