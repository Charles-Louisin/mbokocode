"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { type KeyboardEvent, type PointerEvent, useRef, useState } from "react";
import { GameButton, GameFrame, GameResult } from "./GameFrame";
import { useBestScore } from "./useBestScore";

// Œil de pixel : un cadre (rectangle ou ellipse) apparaît, il faut viser son centre exact. L'écart est mesuré en pixels
// réels de l'écran. Cinq cadres, on garde la moyenne : plus elle est basse, meilleur est l'œil.

const ROUNDS = 5;
type Shape = { x: number; y: number; w: number; h: number; round: boolean }; // en % du plateau
type Shot = { x: number; y: number; error: number }; // en %, et l'écart en px

function randomShape(round: boolean): Shape {
  const w = 18 + Math.random() * 42;
  const h = 18 + Math.random() * 48;
  return { w, h, round, x: 4 + Math.random() * (92 - w), y: 4 + Math.random() * (92 - h) };
}

export function PixelEyeGame() {
  const { best, submit } = useBestScore("oeil-de-pixel", "lower");
  const stage = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "aim" | "reveal" | "over">("idle");
  const [shape, setShape] = useState<Shape | null>(null);
  const [shot, setShot] = useState<Shot | null>(null);
  const [errors, setErrors] = useState<number[]>([]);
  // Viseur clavier, en % du plateau.
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const [record, setRecord] = useState(false);

  const average = errors.length ? Math.round(errors.reduce((a, b) => a + b, 0) / errors.length) : null;

  const newShape = (index: number) => {
    setShape(randomShape(index % 2 === 1));
    setShot(null);
    setCursor({ x: 50, y: 50 });
    setPhase("aim");
  };

  const start = () => {
    setErrors([]);
    setRecord(false);
    newShape(0);
    requestAnimationFrame(() => stage.current?.focus());
  };

  const fire = (xPct: number, yPct: number) => {
    if (phase !== "aim" || !shape || !stage.current) return;
    const box = stage.current.getBoundingClientRect();
    const cx = shape.x + shape.w / 2;
    const cy = shape.y + shape.h / 2;
    const error = Math.round(Math.hypot(((xPct - cx) / 100) * box.width, ((yPct - cy) / 100) * box.height));
    setShot({ x: xPct, y: yPct, error });
    const next = [...errors, error];
    setErrors(next);
    if (next.length === ROUNDS) {
      const avg = Math.round(next.reduce((a, b) => a + b, 0) / ROUNDS);
      setRecord(submit(avg));
      setPhase("over");
    } else {
      setPhase("reveal");
    }
  };

  const onPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (!stage.current) return;
    const box = stage.current.getBoundingClientRect();
    fire(((event.clientX - box.left) / box.width) * 100, ((event.clientY - box.top) / box.height) * 100);
  };

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (phase === "reveal" && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      newShape(errors.length);
      return;
    }
    if (phase !== "aim" || !stage.current) return;
    const box = stage.current.getBoundingClientRect();
    // Une flèche = 1 px, avec Maj = 10 px.
    const step = event.shiftKey ? 10 : 1;
    const dx = (step / box.width) * 100;
    const dy = (step / box.height) * 100;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-dx, 0], ArrowRight: [dx, 0], ArrowUp: [0, -dy], ArrowDown: [0, dy] };
    if (moves[event.key]) {
      event.preventDefault();
      const [mx, my] = moves[event.key]!;
      setCursor((c) => ({ x: Math.min(100, Math.max(0, c.x + mx)), y: Math.min(100, Math.max(0, c.y + my)) }));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fire(cursor.x, cursor.y);
    }
  };

  const verdict = (error: number) => (error <= 3 ? "Au pixel près." : error <= 8 ? "Très précis." : error <= 18 ? "Pas mal." : "À reprendre.");

  return (
    <GameFrame
      rules={
        <>
          <p>Un cadre apparaît : vise son centre exact, d&apos;un clic ou d&apos;une touche. L&apos;écart est mesuré en vrais pixels.</p>
          <p>Au clavier : les flèches déplacent le viseur (Maj pour aller plus vite), Entrée pour viser.</p>
        </>
      }
      stats={[
        { label: "Cadre", value: phase === "idle" ? "—" : `${Math.min(errors.length + (phase === "aim" ? 1 : 0), ROUNDS)}/${ROUNDS}` },
        { label: "Écart moyen", value: average === null ? "—" : `${average} px` },
        { label: "Record", value: best === null ? "—" : `${best} px` },
        { label: "Dernier tir", value: shot ? `${shot.error} px` : "—" },
      ]}
      announce={shot ? `${shot.error} pixels d'écart. ${verdict(shot.error)}` : undefined}
    >
      <div
        ref={stage}
        role="application"
        aria-label="Plateau : vise le centre du cadre"
        tabIndex={phase === "idle" ? -1 : 0}
        onPointerDown={onPointer}
        onKeyDown={onKey}
        className="relative aspect-[4/3] cursor-crosshair touch-none select-none overflow-hidden rounded-(--radius) border hairline bg-bg-raised/40 outline-none focus-visible:ring-2 focus-visible:ring-cobalt-soft md:aspect-[16/10]"
        style={{
          backgroundImage: "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        {shape && (
          <div
            aria-hidden
            className={`absolute border-2 border-fg/80 ${shape.round ? "rounded-full" : "rounded-md"}`}
            style={{ left: `${shape.x}%`, top: `${shape.y}%`, width: `${shape.w}%`, height: `${shape.h}%` }}
          />
        )}
        {phase === "aim" && (
          <span aria-hidden className="pointer-events-none absolute size-6 -translate-x-1/2 -translate-y-1/2 opacity-60" style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}>
            <span className="absolute left-1/2 top-0 h-full w-px bg-cobalt-soft" />
            <span className="absolute left-0 top-1/2 h-px w-full bg-cobalt-soft" />
          </span>
        )}
        {shot && shape && (
          <svg aria-hidden className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line
              x1={shot.x}
              y1={shot.y}
              x2={shape.x + shape.w / 2}
              y2={shape.y + shape.h / 2}
              stroke="var(--color-cobalt-soft)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="4 3"
            />
          </svg>
        )}
        {shot && shape && (
          <>
            <span aria-hidden className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cobalt-soft" style={{ left: `${shot.x}%`, top: `${shot.y}%` }} />
            <span
              aria-hidden
              className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-success"
              style={{ left: `${shape.x + shape.w / 2}%`, top: `${shape.y + shape.h / 2}%` }}
            />
          </>
        )}

        {phase === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-bg/70 p-6 text-center backdrop-blur-sm">
            <p className="max-w-sm text-lg text-fg-muted">Cinq cadres, un seul centre à chaque fois.</p>
            <GameButton onClick={start}>Commencer</GameButton>
          </div>
        )}
        {phase === "reveal" && shot && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-4">
            <p className="rounded-full bg-bg/90 px-4 py-2 text-sm">
              <strong className="font-semibold">{shot.error} px</strong> — {verdict(shot.error)}
            </p>
          </div>
        )}
      </div>

      {phase === "reveal" && (
        <div className="mt-6">
          <GameButton onClick={() => newShape(errors.length)} icon={ArrowRight}>
            Cadre suivant
          </GameButton>
        </div>
      )}
      {phase === "over" && average !== null && (
        <GameResult record={record} title={`${average} px d'écart moyen — ${verdict(average)}`}>
          <p>
            C&apos;est ce soin du détail que je mets dans l&apos;intégration : une maquette respectée au pixel, sur tous les écrans.{" "}
            <Link href="/contact" className="link-draw text-fg">
              Parlons de ton projet
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
