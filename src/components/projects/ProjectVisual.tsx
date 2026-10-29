import Image from "next/image";
import type { Media } from "@/src/lib/api/types";

type ProjectVisualProps = {
  image?: Media;
  sizes: string;
  priority?: boolean;
  /** Alternative textuelle ; vide quand le visuel est décoratif (titre déjà lisible à côté). */
  alt?: string;
  className?: string;
};

/**
 * Visuel de projet qui remplit son conteneur. Une capture verticale (mobile) est présentée
 * entière dans un cadre de téléphone plutôt que recadrée et agrandie.
 */
export function ProjectVisual({ image, sizes, priority, alt = "", className = "" }: ProjectVisualProps) {
  if (!image) {
    return (
      <div className={`flex size-full items-center justify-center bg-bg-raised ${className}`}>
        <span className="label text-fg-subtle">Visuels à venir</span>
      </div>
    );
  }

  const tall = (image.height ?? 1) > (image.width ?? 1);
  if (!tall) {
    return <Image src={image.url} alt={alt} fill priority={priority} sizes={sizes} className={`object-cover object-top ${className}`} />;
  }

  return (
    <div className={`absolute inset-0 flex items-center justify-center bg-linear-to-b from-ink-3 to-ink ${className}`}>
      <div
        className="relative h-[86%] overflow-hidden rounded-[7%/3.5%] border border-ivory/15 shadow-2xl"
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
      >
        <Image src={image.url} alt={alt} fill priority={priority} sizes="(min-width: 768px) 20vw, 40vw" className="object-cover object-top" />
      </div>
    </div>
  );
}
