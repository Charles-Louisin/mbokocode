import { brandColor, type Tool } from "@/src/lib/tools";

// Logo d'un outil sur une pastille claire, comme un badge officiel, dans sa couleur de marque.
export function ToolLogo({ tool, className = "size-9", iconClassName = "size-5" }: { tool: Tool; className?: string; iconClassName?: string }) {
  const Icon = tool.icon;
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-ivory ${className}`}>
      {tool.brand ? (
        <svg viewBox="0 0 24 24" aria-hidden className={iconClassName} style={{ fill: brandColor(tool.brand) }}>
          <path d={tool.brand.path} />
        </svg>
      ) : Icon ? (
        <Icon aria-hidden className={`${iconClassName} text-cobalt-deep`} />
      ) : (
        <span aria-hidden className="text-xs font-semibold text-ink">
          {tool.name.slice(0, 2)}
        </span>
      )}
    </span>
  );
}
