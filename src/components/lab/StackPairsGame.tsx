"use client";

import { RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ToolLogo } from "@/src/components/ui/ToolLogo";
import { tool } from "@/src/lib/tools";
import { GameButton, GameFrame, GameResult } from "./GameFrame";
import { useBestScore } from "./useBestScore";

// Paires de stack : seize cartes, huit outils que j'utilise vraiment. Retourne-les deux par deux.

const STACK = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Figma"];
const EASE = [0.16, 1, 0.3, 1] as const;

type Card = { id: number; name: string };

function deal(): Card[] {
  const cards = [...STACK, ...STACK].map((name, id) => ({ id, name }));
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j]!, cards[i]!];
  }
  return cards;
}

export function StackPairsGame() {
  const reduce = useReducedMotion();
  const { best, submit } = useBestScore("paires-de-stack", "lower");
  const [cards, setCards] = useState<Card[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [record, setRecord] = useState(false);
  const [announce, setAnnounce] = useState("");
  const closeTimer = useRef<number | undefined>(undefined);

  const playing = cards.length > 0 && found.size < STACK.length;
  const won = cards.length > 0 && found.size === STACK.length;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setElapsed(Date.now() - startedAt), 250);
    return () => window.clearInterval(timer);
  }, [playing, startedAt]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const start = () => {
    window.clearTimeout(closeTimer.current);
    setCards(deal());
    setOpen([]);
    setFound(new Set());
    setMoves(0);
    setElapsed(0);
    setRecord(false);
    setStartedAt(Date.now());
    setAnnounce("Nouvelle partie : seize cartes face cachée.");
  };

  const flip = (index: number) => {
    const card = cards[index]!;
    if (open.includes(index) || found.has(card.name)) return;
    // Deux cartes déjà ouvertes et différentes : on les referme tout de suite.
    const current = open.length === 2 ? [] : open;
    window.clearTimeout(closeTimer.current);
    const next = [...current, index];
    setOpen(next);
    if (next.length < 2) {
      setAnnounce(`${card.name}.`);
      return;
    }
    const moveCount = moves + 1;
    setMoves(moveCount);
    const [a, b] = next.map((i) => cards[i]!);
    if (a!.name === b!.name) {
      const nextFound = new Set(found).add(a!.name);
      setFound(nextFound);
      setOpen([]);
      if (nextFound.size === STACK.length) {
        setRecord(submit(moveCount));
        setAnnounce(`Toutes les paires trouvées en ${moveCount} coups.`);
      } else {
        setAnnounce(`Paire trouvée : ${a!.name}.`);
      }
    } else {
      setAnnounce(`${b!.name}. Pas une paire.`);
      closeTimer.current = window.setTimeout(() => setOpen([]), 900);
    }
  };

  const seconds = Math.floor(elapsed / 1000);

  return (
    <GameFrame
      rules={
        <>
          <p>Retourne deux cartes à la fois et retrouve les huit paires d&apos;outils de ma stack, en un minimum de coups.</p>
          <p>Au clavier : Tab pour choisir une carte, Entrée pour la retourner.</p>
        </>
      }
      stats={[
        { label: "Coups", value: moves },
        { label: "Paires", value: `${found.size}/${STACK.length}` },
        { label: "Temps", value: `${seconds} s` },
        { label: "Record", value: best === null ? "—" : `${best} coups` },
      ]}
      announce={announce}
    >
      {cards.length === 0 ? (
        <div className="flex aspect-square max-h-[36rem] w-full flex-col items-center justify-center gap-5 rounded-(--radius) border border-dashed hairline p-8 text-center sm:aspect-[4/3]">
          <p className="max-w-sm text-lg text-fg-muted">Seize cartes, huit outils. Combien de coups te faudra-t-il ?</p>
          <GameButton onClick={start}>Distribuer les cartes</GameButton>
        </div>
      ) : (
        <ul className="mx-auto grid max-w-[36rem] grid-cols-4 gap-2 [perspective:900px] sm:gap-3">
          {cards.map((card, index) => {
            const visible = open.includes(index) || found.has(card.name);
            const matched = found.has(card.name);
            return (
              <li key={card.id}>
                <button
                  type="button"
                  onClick={() => flip(index)}
                  disabled={matched}
                  aria-label={visible ? `Carte ${index + 1} : ${card.name}${matched ? ", trouvée" : ""}` : `Carte ${index + 1}, face cachée`}
                  className="relative block aspect-square w-full touch-manipulation rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt-soft"
                >
                  <motion.span
                    className="absolute inset-0 block [transform-style:preserve-3d]"
                    animate={reduce ? undefined : { rotateY: visible ? 180 : 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    {/* Dos de carte */}
                    <span
                      aria-hidden
                      className={`absolute inset-0 flex items-center justify-center rounded-xl border hairline bg-bg-raised [backface-visibility:hidden] ${
                        reduce && visible ? "opacity-0" : ""
                      }`}
                    >
                      <span className="size-3 rotate-45 rounded-[3px] border border-cobalt-soft/60" />
                    </span>
                    {/* Face : logo officiel de l'outil */}
                    <span
                      aria-hidden
                      className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-xl border p-1 [backface-visibility:hidden] ${
                        reduce ? (visible ? "" : "opacity-0") : "[transform:rotateY(180deg)]"
                      } ${matched ? "border-success/60 bg-success/10" : "border-cobalt-soft/60 bg-bg-raised"}`}
                    >
                      <ToolLogo tool={tool(card.name)} className="size-10 sm:size-12" iconClassName="size-5 sm:size-6" />
                      <span className="hidden text-center text-[11px] leading-tight text-fg-muted sm:block">{card.name}</span>
                    </span>
                  </motion.span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {won && (
        <GameResult record={record} title={`${moves} coups, ${seconds} secondes`}>
          <p>
            Ces huit outils, je les fais travailler ensemble dans chaque projet : interface en Next.js et React, API Node.js et
            Express, données MongoDB, maquettes Figma.{" "}
            <Link href="/a-propos" className="link-draw text-fg">
              Voir mon parcours
            </Link>
            .
          </p>
          <div className="mt-6">
            <GameButton onClick={start} secondary icon={RotateCcw}>
              Rejouer
            </GameButton>
          </div>
        </GameResult>
      )}
    </GameFrame>
  );
}
