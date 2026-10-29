import { Bug, Check } from "lucide-react";
import { ToolLogo } from "@/src/components/ui/ToolLogo";
import { tool } from "@/src/lib/tools";

// Vignette de chaque jeu dans la galerie : un aperçu du plateau, animé au survol de la carte.
export function GamePreview({ slug }: { slug: string }) {
  switch (slug) {
    case "trajet":
      return (
        <div className="flex h-full flex-col justify-center gap-2 px-8">
          {["Clic", "API", "Session", "Validation", "Base"].map((label, index) => (
            <span
              key={label}
              className="flex items-center gap-3 rounded-lg border hairline bg-bg/70 px-3 py-1.5 text-xs text-fg-muted transition-transform duration-700 ease-(--ease-expo) group-hover:translate-x-(--shift)"
              style={{ "--shift": `${(index % 2 ? -1 : 1) * 10}px`, transitionDelay: `${index * 40}ms` } as React.CSSProperties}
            >
              <span className="label text-fg-subtle">0{index + 1}</span>
              {label}
            </span>
          ))}
        </div>
      );
    case "chasse-aux-bugs":
      return (
        <div className="grid h-full grid-cols-4 gap-1.5 p-6">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} className="relative flex items-center justify-center rounded-md border hairline bg-bg/70">
              {[2, 7, 9].includes(index) && (
                <span className="flex size-7 items-center justify-center rounded-full bg-danger text-ivory transition-transform duration-500 group-hover:scale-110">
                  <Bug aria-hidden className="size-4" />
                </span>
              )}
              {index === 5 && (
                <span className="flex size-7 items-center justify-center rounded-full bg-success text-ivory">
                  <Check aria-hidden className="size-4" />
                </span>
              )}
            </span>
          ))}
        </div>
      );
    case "oeil-de-pixel":
      return (
        <div
          className="relative h-full"
          style={{
            backgroundImage: "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          <span className="absolute left-[22%] top-[24%] h-[52%] w-[46%] rounded-md border-2 border-fg/70" />
          <span className="absolute left-[45%] top-[50%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-success" />
          <span className="absolute left-[49%] top-[46%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cobalt-soft transition-[left,top] duration-700 ease-(--ease-expo) group-hover:left-[45%] group-hover:top-[50%]" />
        </div>
      );
    case "paires-de-stack":
      return (
        <div className="grid h-full grid-cols-4 gap-2 p-6 [perspective:600px]">
          {["React", null, "MongoDB", null, null, "React", null, "Next.js"].map((name, index) => (
            <span
              key={index}
              className={`flex items-center justify-center rounded-lg border bg-bg/70 transition-transform duration-700 ease-(--ease-expo) ${
                name ? "border-cobalt-soft/50" : "hairline group-hover:[transform:rotateY(18deg)]"
              }`}
            >
              {name ? <ToolLogo tool={tool(name)} className="size-8" iconClassName="size-4" /> : <span className="size-2 rotate-45 rounded-[2px] border border-cobalt-soft/50" />}
            </span>
          ))}
        </div>
      );
    case "temps-de-reponse":
      return (
        <div className="flex h-full items-center justify-center p-6">
          <span className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-bg/70 transition-colors duration-300 group-hover:bg-cobalt group-hover:text-ivory">
            <span className="text-3xl font-semibold tracking-tight [font-stretch:115%]">200 OK</span>
            <span className="mt-1 text-xs opacity-70">238 ms</span>
          </span>
        </div>
      );
    default:
      return null;
  }
}
