"use client";

import { Bug, Check, Play, RotateCcw } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GameButton, GameFrame, GameResult } from "./GameFrame";
import { useBestScore } from "./useBestScore";

// Chasse aux bugs : des bugs surgissent dans les lignes de code, il faut les écraser avant qu'ils
// filent. Les coches vertes sont des fonctionnalités qui marchent : y toucher coûte des points.

const CELLS = 12;
const DURATION = 30_000;
const TICK = 100;
const EASE = [0.16, 1, 0.3, 1] as const;

type Target = { id: number; kind: "bug" | "feature"; expiresAt: number };
type Phase = "idle" | "playing" | "over";

// Faux code affiché dans chaque case, pour l'ambiance.
const SNIPPETS = ["await save()", "if (!user)", "res.json(d)", "return null", "items.map()", "try { … }", "z.parse(b)", "next(err)", "fetch(url)", "set(state)", "sort(by)", "emit(evt)"];

export function BugHuntGame() {
  const reduce = useReducedMotion();
  const { best, submit } = useBestScore("chasse-aux-bugs", "higher");
  const [phase, setPhase] = useState<Phase>("idle");
  const [cells, setCells] = useState<(Target | null)[]>(() => Array(CELLS).fill(null));
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [squashed, setSquashed] = useState(0);
  const [escaped, setEscaped] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [record, setRecord] = useState(false);
  const [flash, setFlash] = useState<{ cell: number; text: string; good: boolean; id: number } | null>(null);
  const nextId = useRef(0);
  const endAt = useRef(0);
  const nextSpawn = useRef(0);
  const scoreRef = useRef(0);
  const cellsRef = useRef<(Target | null)[]>(Array(CELLS).fill(null));

  // Boucle de jeu : décompte, apparitions de plus en plus rapides, disparitions.
  useEffect(() => {
    if (phase !== "playing") return;
    const timer = window.setInterval(() => {
      const now = performance.now();
      const left = Math.max(0, endAt.current - now);
      const progress = 1 - left / DURATION;
      setTimeLeft(left);

      // Calcul sur la référence, puis une seule mise à jour d'état (pas d'effet dans un updater).
      let missed = 0;
      const next = cellsRef.current.map((target) => {
        if (target && target.expiresAt <= now) {
          if (target.kind === "bug") missed += 1;
          return null;
        }
        return target;
      });
      if (left > 0 && now >= nextSpawn.current) {
        const free = next.flatMap((target, index) => (target ? [] : [index]));
        if (free.length) {
          const index = free[Math.floor(Math.random() * free.length)]!;
          const kind = Math.random() < 0.18 ? "feature" : "bug";
          next[index] = { id: nextId.current++, kind, expiresAt: now + 1500 - progress * 700 };
        }
        nextSpawn.current = now + 850 - progress * 450;
      }
      if (missed) setEscaped((value) => value + missed);
      cellsRef.current = next;
      setCells(next);

      if (left === 0) {
        setPhase("over");
        cellsRef.current = Array(CELLS).fill(null);
        setCells(cellsRef.current);
        setRecord(submit(scoreRef.current));
      }
    }, TICK);
    return () => window.clearInterval(timer);
  }, [phase, submit]);

  const start = () => {
    endAt.current = performance.now() + DURATION;
    nextSpawn.current = performance.now() + 400;
    scoreRef.current = 0;
    setScore(0);
    setStreak(0);
    setSquashed(0);
    setEscaped(0);
    setRecord(false);
    setTimeLeft(DURATION);
    cellsRef.current = Array(CELLS).fill(null);
    setCells(cellsRef.current);
    setPhase("playing");
  };

  const hit = (index: number) => {
    if (phase !== "playing") return;
    const target = cellsRef.current[index];
    if (!target) return;
    let gain: number;
    if (target.kind === "bug") {
      // Série : un point bonus tous les cinq bugs écrasés d'affilée.
      const nextStreak = streak + 1;
      gain = nextStreak % 5 === 0 ? 2 : 1;
      setStreak(nextStreak);
      setSquashed((value) => value + 1);
    } else {
      gain = -2;
      setStreak(0);
    }
    scoreRef.current = Math.max(0, scoreRef.current + gain);
    setScore(scoreRef.current);
    setFlash({ cell: index, text: gain > 0 ? `+${gain}` : `${gain}`, good: gain > 0, id: target.id });
    cellsRef.current = cellsRef.current.map((value, i) => (i === index ? null : value));
    setCells(cellsRef.current);
  };

  const seconds = Math.ceil(timeLeft / 1000);

  return (
    <GameFrame
      rules={
        <>
          <p>Des bugs apparaissent dans le code : clique ou touche-les avant qu&apos;ils s&apos;échappent.</p>
          <p>
            Les coches vertes sont des fonctionnalités qui marchent : n&apos;y touche pas (−2). Cinq bugs d&apos;affilée rapportent un
            point bonus. Au clavier : Tab pour parcourir, Entrée pour écraser.
          </p>
        </>
      }
      stats={[
        { label: "Score", value: score },
        { label: "Temps", value: phase === "playing" ? `${seconds} s` : "30 s" },
        { label: "Record", value: best ?? "—" },
        { label: "Série", value: streak },
      ]}
      announce={phase === "over" ? `Partie terminée : ${score} points.` : undefined}
    >
      <div className="relative overflow-hidden rounded-(--radius) border hairline bg-bg-raised/40 p-3 md:p-4">
        {/* Barre de temps */}
        <div aria-hidden className="mb-3 h-1 overflow-hidden rounded-full bg-fg/10">
          <div className="h-full origin-left bg-cobalt-soft" style={{ transform: `scaleX(${timeLeft / DURATION})` }} />
        </div>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-4 md:gap-3">
          {cells.map((target, index) => (
            <button
              key={index}
              type="button"
              disabled={phase !== "playing"}
              onPointerDown={(event) => {
                // Réagit dès l'appui (plus réactif au doigt) ; le clic clavier passe par onClick.
                if (event.pointerType !== "mouse" || event.button === 0) {
                  event.preventDefault();
                  hit(index);
                }
              }}
              onClick={(event) => {
                if (event.detail === 0) hit(index);
              }}
              aria-label={target ? (target.kind === "bug" ? `Bug ligne ${index + 1}` : `Fonctionnalité ligne ${index + 1}`) : `Ligne ${index + 1}`}
              className="relative flex aspect-[4/3] touch-manipulation flex-col justify-between overflow-hidden rounded-xl border hairline bg-bg p-2.5 text-left font-mono text-[11px] text-fg-subtle md:text-xs"
            >
              <span>
                <span className="mr-2 opacity-60">{String(index + 1).padStart(2, "0")}</span>
                {SNIPPETS[index]}
              </span>
              <AnimatePresence>
                {target && (
                  <motion.span
                    key={target.id}
                    initial={reduce ? { opacity: 0 } : { scale: 0, rotate: -20 }}
                    animate={reduce ? { opacity: 1 } : { scale: 1, rotate: 0 }}
                    exit={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className={`absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full md:size-14 ${
                      target.kind === "bug" ? "bg-danger text-ivory" : "bg-success text-ivory"
                    }`}
                  >
                    {target.kind === "bug" ? <Bug aria-hidden className="size-6 md:size-7" /> : <Check aria-hidden className="size-6 md:size-7" />}
                  </motion.span>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {flash?.cell === index && (
                  <motion.span
                    key={flash.id}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: reduce ? 0 : -24 }}
                    transition={{ duration: 0.7 }}
                    onAnimationComplete={() => setFlash(null)}
                    aria-hidden
                    className={`absolute right-2 top-2 font-sans text-lg font-semibold ${flash.good ? "text-success" : "text-danger"}`}
                  >
                    {flash.text}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>

        {phase !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-bg/80 p-6 text-center backdrop-blur-sm">
            <p className="max-w-sm text-lg text-fg-muted">{phase === "idle" ? "30 secondes. Combien de bugs vas-tu écraser ?" : `${score} points.`}</p>
            <GameButton onClick={start} icon={phase === "idle" ? Play : RotateCcw}>
              {phase === "idle" ? "Lancer la chasse" : "Rejouer"}
            </GameButton>
          </div>
        )}
      </div>

      {phase === "over" && (
        <GameResult record={record} title={`${score} points — ${squashed} bugs écrasés, ${escaped} échappés`}>
          <p>
            Dans un vrai projet, je n&apos;attends pas qu&apos;un bug se montre : tests automatisés, validation des données et logs
            lisibles l&apos;attrapent avant tes utilisateurs.{" "}
            <Link href="/contact" className="link-draw text-fg">
              Parlons de ton projet
            </Link>
            .
          </p>
        </GameResult>
      )}
    </GameFrame>
  );
}
