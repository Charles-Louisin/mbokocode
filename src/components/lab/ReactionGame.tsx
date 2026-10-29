"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GameButton, GameFrame, GameResult } from "./GameFrame";
import { useBestScore } from "./useBestScore";

// Temps de réponse : une requête part, le serveur répond après un délai imprévisible ;
// il faut cliquer dès le « 200 OK ». Cinq mesures, on garde la moyenne.

const ROUNDS = 5;
type Phase = "idle" | "waiting" | "go" | "result" | "early" | "over";

export function ReactionGame() {
  const { best, submit } = useBestScore("temps-de-reponse", "lower");
  const [phase, setPhase] = useState<Phase>("idle");
  const [times, setTimes] = useState<number[]>([]);
  const [record, setRecord] = useState(false);
  const goAt = useRef(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const average = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;
  const last = times.at(-1);

  const send = () => {
    setPhase("waiting");
    timer.current = window.setTimeout(
      () => {
        goAt.current = performance.now();
        setPhase("go");
      },
      1200 + Math.random() * 2600,
    );
  };

  const press = () => {
    if (phase === "idle" || phase === "result" || phase === "early") {
      if (phase === "idle") setTimes([]);
      send();
    } else if (phase === "waiting") {
      window.clearTimeout(timer.current);
      setPhase("early");
    } else if (phase === "go") {
      const time = Math.round(performance.now() - goAt.current);
      const next = [...times, time];
      setTimes(next);
      if (next.length === ROUNDS) {
        setRecord(submit(Math.round(next.reduce((a, b) => a + b, 0) / ROUNDS)));
        setPhase("over");
      } else {
        setPhase("result");
      }
    }
  };

  const restart = () => {
    setTimes([]);
    setRecord(false);
    send();
  };

  const screens: Record<Exclude<Phase, "over">, { title: string; text: string; tone: string }> = {
    idle: { title: "Prêt ?", text: "Appuie pour envoyer la première requête.", tone: "bg-bg-raised/60" },
    waiting: { title: "Requête en cours…", text: "Attends la réponse du serveur.", tone: "bg-bg-raised" },
    go: { title: "200 OK", text: "Maintenant !", tone: "bg-cobalt text-ivory" },
    result: { title: `${last ?? 0} ms`, text: "Appuie pour la requête suivante.", tone: "bg-bg-raised/60" },
    early: { title: "Trop tôt", text: "Requête annulée : la réponse n'était pas arrivée. Appuie pour réessayer.", tone: "bg-danger/20" },
  };
  const screen = phase === "over" ? null : screens[phase];

  return (
    <GameFrame
      rules={
        <>
          <p>Envoie une requête, puis clique ou touche dès que le serveur répond « 200 OK ». Trop tôt, et la requête est annulée.</p>
          <p>Au clavier : Espace ou Entrée sur le bouton. Cinq mesures, la moyenne compte.</p>
        </>
      }
      stats={[
        { label: "Mesure", value: `${Math.min(times.length + (phase === "waiting" || phase === "go" ? 1 : 0), ROUNDS)}/${ROUNDS}` },
        { label: "Moyenne", value: average === null ? "—" : `${average} ms` },
        { label: "Dernière", value: last === undefined ? "—" : `${last} ms` },
        { label: "Record", value: best === null ? "—" : `${best} ms` },
      ]}
      announce={phase === "go" ? "200 OK, maintenant !" : phase === "result" ? `${last} millisecondes.` : phase === "early" ? "Trop tôt." : undefined}
    >
      {screen ? (
        <button
          type="button"
          onPointerDown={(event) => {
            // Mesure dès l'appui : c'est le vrai temps de réaction.
            if (event.button === 0) press();
          }}
          onKeyDown={(event) => {
            if ((event.key === " " || event.key === "Enter") && !event.repeat) {
              event.preventDefault();
              press();
            }
          }}
          className={`flex aspect-[4/3] w-full touch-manipulation select-none flex-col items-center justify-center gap-4 rounded-(--radius) border hairline p-8 text-center transition-colors duration-150 md:aspect-[16/9] ${screen.tone}`}
        >
          <span className="text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-none tracking-[-0.03em] [font-stretch:115%]">{screen.title}</span>
          <span className="max-w-md text-lg opacity-80">{screen.text}</span>
          {phase === "waiting" && (
            <span aria-hidden className="flex gap-2">
              {[0, 1, 2].map((dot) => (
                <span key={dot} className="size-2 animate-pulse rounded-full bg-fg/60" style={{ animationDelay: `${dot * 200}ms` }} />
              ))}
            </span>
          )}
        </button>
      ) : (
        average !== null && (
          <GameResult record={record} title={`${average} ms de moyenne`}>
            <ul className="mt-2 flex h-32 items-end gap-3" aria-label="Tes cinq mesures">
              {times.map((time, index) => (
                <li key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-sm tabular-nums text-fg">{time}</span>
                  <span className="w-full rounded-t-md bg-cobalt-soft/70" style={{ height: `${Math.round((time / Math.max(...times)) * 75)}%` }} />
                </li>
              ))}
            </ul>
            <p className="mt-6">
              Un humain met quelques centaines de millisecondes à réagir. Une interface qui répond plus vite que ça paraît
              instantanée : c&apos;est le budget que je vise pour les pages et les API que je livre.{" "}
              <Link href="/contact" className="link-draw text-fg">
                Parlons de ton projet
              </Link>
              .
            </p>
            <div className="mt-6">
              <GameButton onClick={restart} secondary icon={RotateCcw}>
                Rejouer
              </GameButton>
            </div>
          </GameResult>
        )
      )}
    </GameFrame>
  );
}
