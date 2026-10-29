import type { ElementType, ReactNode } from "react";

type SplitLinesProps = {
  as?: ElementType;
  lines: ReactNode[];
  className?: string;
  /** « intro » : ouverture animée au chargement, réservée au titre principal d'une page. */
  mode?: "intro" | "static";
  id?: string;
};

/**
 * Titre composé ligne par ligne. En mode « intro », chaque ligne monte de sous sa ligne de base au
 * chargement (CSS pur) ; le texte reste lisible sans JavaScript ou avec les animations réduites.
 */
export function SplitLines({ as: Tag = "h2", lines, className, mode = "static", id }: SplitLinesProps) {
  return (
    <Tag id={id} className={className}>
      {lines.map((line, index) => (
        <span
          key={index}
          className={mode === "intro" ? "mask-line intro-line" : "block"}
          style={mode === "intro" ? ({ "--line-index": index } as React.CSSProperties) : undefined}
        >
          {mode === "intro" ? <span>{line}</span> : line}
          {/* Espace entre les lignes pour que le titre se lise correctement (lecteurs d'écran, copie). */}
          {index < lines.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
