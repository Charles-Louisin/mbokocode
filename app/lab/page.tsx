import { Hand, Keyboard, MousePointer2, Play } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BestScore } from "@/src/components/lab/BestScore";
import { GamePreview } from "@/src/components/lab/GamePreview";
import { SplitLines } from "@/src/components/motion/SplitLines";
import { pad2 } from "@/src/lib/format";
import { LAB_GAMES, type LabControl } from "@/src/lib/lab";

export const metadata: Metadata = {
  title: "Lab",
  description: "Cinq mini-jeux jouables à la souris, au doigt ou au clavier : débogage, précision, réflexes, stack et architecture d'API.",
  alternates: { canonical: "/lab" },
};

const CONTROL_ICONS: Record<LabControl, { icon: typeof Hand; label: string }> = {
  souris: { icon: MousePointer2, label: "Souris" },
  doigt: { icon: Hand, label: "Tactile" },
  clavier: { icon: Keyboard, label: "Clavier" },
};

// Lab — la salle d'arcade : cinq mini-jeux courts, chacun lié à une facette de mon travail.
export default function LabPage() {
  return (
    <div className="shell pb-24 pt-[calc(var(--header-h)+3rem)] md:pb-36">
      <p className="label intro-fade text-accent">{LAB_GAMES.length} mini-jeux</p>
      <SplitLines as="h1" mode="intro" className="mt-6 text-mega font-semibold" lines={["La salle", "d'arcade."]} />
      <p className="intro-fade mt-10 max-w-2xl text-lead text-fg-muted" style={{ "--intro-delay": "500ms" } as React.CSSProperties}>
        Des parties d&apos;une ou deux minutes, chacune tirée d&apos;un vrai réflexe de développeur. Tes records restent dans ton
        navigateur.
      </p>

      <ul className="intro-fade mt-16 grid gap-4 md:grid-cols-6" style={{ "--intro-delay": "650ms" } as React.CSSProperties}>
        {LAB_GAMES.map((game, index) => (
          <li key={game.slug} className={index < 2 ? "md:col-span-3" : "md:col-span-2"}>
            <Link
              href={`/lab/${game.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-(--radius) border hairline bg-bg-raised/30 transition-[border-color,transform] duration-500 ease-(--ease-expo) hover:-translate-y-1 hover:border-cobalt-soft/50"
            >
              <div aria-hidden className={`relative overflow-hidden border-b hairline bg-bg-raised/60 ${index < 2 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                <GamePreview slug={game.slug} />
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-7">
                <p className="label text-fg-subtle">
                  N° {pad2(index + 1)} · {game.skill}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-[1.7rem]">{game.title}</h2>
                <p className="mt-2 flex-1 text-fg-muted">{game.tagline}</p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-fg-subtle">
                  <span className="flex items-center gap-3">
                    <span>{game.duration}</span>
                    <span className="flex gap-1.5" aria-label={`Jouable : ${game.controls.map((c) => CONTROL_ICONS[c].label).join(", ")}`}>
                      {game.controls.map((control) => {
                        const Icon = CONTROL_ICONS[control].icon;
                        return <Icon key={control} aria-hidden className="size-4" />;
                      })}
                    </span>
                  </span>
                  <BestScore game={game} />
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-fg px-3.5 py-1.5 font-medium text-bg transition-colors duration-300 group-hover:bg-cobalt group-hover:text-ivory">
                    <Play aria-hidden className="size-3.5" fill="currentColor" />
                    Jouer
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
