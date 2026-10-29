import type { ReactNode } from "react";
import { SplitLines } from "@/src/components/motion/SplitLines";

export function LegalPage({ eyebrow, title, updated, children }: { eyebrow: string; title: string; updated: string; children: ReactNode }) {
  return (
    <div className="shell pb-24 pt-[calc(var(--header-h)+3rem)] md:pb-36">
      <p className="label intro-fade text-accent">{eyebrow}</p>
      <SplitLines as="h1" mode="intro" className="mt-6 text-display font-semibold" lines={[title]} />
      <p className="label intro-fade mt-6 text-fg-subtle">Dernière mise à jour : {updated}</p>
      <div className="mt-16 max-w-3xl space-y-10 border-t hairline pt-12 text-lg text-fg-muted [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-fg [&_a]:text-fg [&_a]:underline [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
        {children}
      </div>
    </div>
  );
}
