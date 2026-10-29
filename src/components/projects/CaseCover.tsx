"use client";

import Image from "next/image";
import { useRef } from "react";
import { PhoneFrame } from "@/src/components/magic/DeviceFrame";
import { useScrollScene } from "@/src/components/motion/useScrollScene";
import type { Media } from "@/src/lib/api/types";

// Visuel d'ouverture de l'étude de cas : il part encadré puis s'ouvre en pleine largeur au scroll.
export function CaseCover({ image }: { image: Media }) {
  const ref = useRef<HTMLDivElement>(null);
  const tall = (image.height ?? 1) > (image.width ?? 1);

  useScrollScene(ref, (root, { gsap }) => {
    const trigger = { trigger: root, start: "top 85%", end: "top 15%", scrub: 0.5 };
    gsap.fromTo(root.querySelector("[data-frame]"), { clipPath: "inset(0% 7% 0% 7% round 1.25rem)" }, { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "none", scrollTrigger: trigger });
    gsap.fromTo(root.querySelector("[data-media]"), { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: trigger });
  });

  return (
    <div ref={ref} className="mt-16 md:mt-24">
      <div data-frame className="relative overflow-hidden bg-bg-raised" style={{ clipPath: "inset(0 round 0)" }}>
        <div data-media className={`relative ${tall ? "aspect-[4/3] md:aspect-[21/9]" : "aspect-[16/10] md:aspect-[21/9]"}`}>
          {tall ? (
            // Capture d'écran mobile : présentée au centre d'un fond, sans être déformée.
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-b from-ink-3 to-ink">
              <PhoneFrame image={image} sizes="30vw" priority className="h-[92%] w-auto drop-shadow-2xl" />
            </div>
          ) : (
            <Image src={image.url} alt={image.alt} fill priority sizes="100vw" className="object-cover object-top" />
          )}
        </div>
      </div>
    </div>
  );
}
