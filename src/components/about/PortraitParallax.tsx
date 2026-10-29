"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useScrollScene } from "@/src/components/motion/useScrollScene";
import portrait from "@/public/images/photo_profil.jpeg";

// Portrait épinglé : l'image glisse lentement dans son cadre pendant la lecture, avec une carte
// d'identité posée en bas (nom, métier, ville). Le visage reste toujours dans le cadre.
export function PortraitParallax() {
  const ref = useRef<HTMLDivElement>(null);

  useScrollScene(ref, (root, { gsap }) => {
    gsap.fromTo(
      root.querySelector("img"),
      { yPercent: -4 },
      { yPercent: 4, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } },
    );
  });

  return (
    <figure>
      <div
        ref={ref}
        className="intro-unmask relative aspect-4/5 overflow-hidden rounded-(--radius) bg-bg-raised ring-1 ring-line"
        style={{ "--intro-delay": "300ms" } as React.CSSProperties}
      >
        <Image
          src={portrait}
          alt="Charles Louisin Yimbne, fondateur de MBOKO CODE"
          fill
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 40vw, 100vw"
          // Marge de 10 % au-dessus et au-dessous pour le glissement, sans jamais montrer le fond.
          className="scale-110 object-cover object-[50%_22%]"
        />
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-ink/85 to-transparent" />
        <figcaption className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-ivory md:inset-x-6 md:bottom-6">
          <span>
            <span className="block text-xl font-semibold tracking-tight [font-stretch:115%]">Charles Louisin Yimbne</span>
            <span className="mt-0.5 block text-ivory/80">Développeur full-stack</span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-ivory/15 px-3 py-1.5 text-sm backdrop-blur-md">
            <MapPin aria-hidden className="size-3.5" />
            Douala
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
