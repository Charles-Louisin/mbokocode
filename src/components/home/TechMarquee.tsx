import { ToolLogo } from "@/src/components/ui/ToolLogo";
import { type Tool, tool } from "@/src/lib/tools";

// Ma boîte à outils : deux rangées qui défilent en sens inverse, avec les logos officiels
// (Simple Icons, CC0) dans leur couleur de marque. Pause au survol ; en mouvement réduit,
// les outils s'affichent simplement en liste.

const ROW_A: Tool[] = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Figma", "Vercel", "SEO technique"].map(tool);
const ROW_B: Tool[] = ["Node.js", "Express", "MongoDB", "PostgreSQL", "API REST", "Auth & rôles", "CI/CD", "Analytics"].map(tool);

function ToolChip({ tool }: { tool: Tool }) {
  return (
    <li className="flex shrink-0 items-center gap-3 rounded-full border hairline bg-bg-raised/60 py-2.5 pl-3 pr-5 transition-colors duration-300 hover:border-cobalt-soft/50">
      <ToolLogo tool={tool} />
      <span className="whitespace-nowrap text-lg font-medium">{tool.name}</span>
    </li>
  );
}

function Row({ tools, reverse = false }: { tools: Tool[]; reverse?: boolean }) {
  return (
    <div className="marquee group/row flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      {/* Deux copies identiques : la piste défile de 50 % puis reboucle sans à-coup. */}
      {[false, true].map((copy) => (
        <ul
          key={String(copy)}
          aria-hidden={copy || undefined}
          className={`marquee-track flex shrink-0 gap-3 pr-3 ${reverse ? "marquee-reverse" : ""}`}
        >
          {tools.map((tool) => (
            <ToolChip key={tool.name} tool={tool} />
          ))}
        </ul>
      ))}
    </div>
  );
}

export function TechMarquee() {
  return (
    <section aria-labelledby="stack-title" className="border-y hairline py-12 md:py-16">
      <div className="shell mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <h2 id="stack-title" className="text-2xl font-semibold">
          Ma boîte à outils
        </h2>
        <p className="text-fg-muted">Les technologies que j&apos;utilise dans les projets livrés.</p>
      </div>
      <div className="space-y-3">
        <Row tools={ROW_A} />
        <Row tools={ROW_B} reverse />
      </div>
    </section>
  );
}
