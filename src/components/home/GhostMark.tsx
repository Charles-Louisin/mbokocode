import type { CSSProperties } from "react";
import { LOGO_PATHS, LOGO_VIEWBOX } from "@/src/components/brand/LogoMark";
import { cn } from "@/src/lib/cn";

// Monogramme « fantôme », d'après la pile de copies en contour du tutoriel Codrops
// « Typography That Leaves a Trace » (A Drift, 2026), en SVG + CSS au lieu de canvas.
// Cinq copies en contour du « M » dérivent et s'effacent en boucle derrière le monogramme plein ;
// en mouvement réduit, la traînée reste figée.

const GHOSTS = 5;

export function GhostMark({ className }: { className?: string }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} aria-hidden className={cn("overflow-visible", className)}>
      {Array.from({ length: GHOSTS }, (_, index) => (
        <g
          key={index}
          className="ghost-copy"
          style={{ "--ghost-index": index, "--ghost-count": GHOSTS } as CSSProperties}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
        >
          {LOGO_PATHS.map((d) => (
            <path key={d} d={d} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      ))}
      <g className="ghost-solid" fill="currentColor">
        {LOGO_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
