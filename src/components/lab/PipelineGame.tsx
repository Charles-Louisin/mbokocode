"use client";

import { ListChecks, RotateCcw, Shuffle } from "lucide-react";
import { AnimatePresence, motion, Reorder, useDragControls, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { useBestScore } from "./useBestScore";

type Step = { id: string; label: string; why: string };

// Ordre correct du trajet d'une commande, de l'écran à la base de données et retour.
const STEPS: Step[] = [
  { id: "click", label: "Le client valide sa commande", why: "Tout part d'une action dans l'interface." },
  { id: "request", label: "Le navigateur envoie la requête à l'API", why: "Les données voyagent en HTTPS vers le serveur, jamais directement vers la base." },
  { id: "session", label: "L'API vérifie la session du client", why: "Un visiteur non autorisé est refusé avant tout traitement." },
  { id: "validate", label: "L'API valide les données reçues", why: "Rien n'est enregistré sans contrôle : types, longueurs, valeurs attendues." },
  { id: "save", label: "La base enregistre la commande", why: "L'écriture n'a lieu qu'une fois toutes les vérifications passées." },
  { id: "respond", label: "L'API renvoie une réponse", why: "Succès ou erreur, toujours dans un format prévisible pour l'interface." },
  { id: "confirm", label: "L'interface affiche la confirmation", why: "Le client voit le résultat réel, pas une confirmation simulée." },
];

const EASE = [0.16, 1, 0.3, 1] as const;

type StepItemProps = {
  step: Step;
  index: number;
  total: number;
  checked: boolean;
  right: boolean;
  solved: boolean;
  reduce: boolean;
  onMove: (index: number, delta: -1 | 1) => void;
};

// Une étape : on la déplace en tirant sa poignée (le reste de la carte laisse défiler la page
// au doigt), ou avec les boutons ↑ ↓ au clavier.
function StepItem({ step, index, total, checked, right, solved, reduce, onMove }: StepItemProps) {
  const controls = useDragControls();
  const wrong = checked && !right;
  return (
    <Reorder.Item
      value={step}
      dragListener={false}
      dragControls={controls}
      layout={reduce ? undefined : true}
      whileDrag={{ scale: 1.02, boxShadow: "0 24px 48px -24px rgb(0 0 0 / 0.6)" }}
      transition={{ duration: 0.4, ease: EASE }}
      className={`flex select-none items-center gap-3 rounded-2xl border p-3 transition-colors duration-300 md:gap-4 md:p-4 ${
        right ? "border-success/60 bg-success/10" : wrong ? "border-danger/50" : "hairline bg-bg-raised"
      }`}
    >
      {!solved && (
        <span
          aria-hidden
          onPointerDown={(event) => controls.start(event)}
          className="flex size-11 shrink-0 cursor-grab touch-none items-center justify-center rounded-full text-fg-subtle active:cursor-grabbing"
        >
          <svg viewBox="0 0 12 18" className="h-4 w-3" fill="currentColor">
            {[3, 9, 15].flatMap((y) => [<circle key={`l${y}`} cx="3" cy={y} r="1.5" />, <circle key={`r${y}`} cx="9" cy={y} r="1.5" />])}
          </svg>
        </span>
      )}
      <span className="label w-7 shrink-0 text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
      <span className="flex-1 text-base md:text-lg">{step.label}</span>
      {checked && (
        <span className="label shrink-0" aria-label={right ? "bien placée" : "mal placée"}>
          {right ? "✓" : "✕"}
        </span>
      )}
      {!solved && (
        <span className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            className="flex size-11 items-center justify-center rounded-full border hairline disabled:opacity-30"
            aria-label={`Monter « ${step.label} »`}
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 1)}
            disabled={index === total - 1}
            className="flex size-11 items-center justify-center rounded-full border hairline disabled:opacity-30"
            aria-label={`Descendre « ${step.label} »`}
          >
            ↓
          </button>
        </span>
      )}
    </Reorder.Item>
  );
}

function shuffled(steps: Step[]): Step[] {
  const copy = [...steps];
  do {
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j]!, copy[i]!];
    }
  } while (copy.every((step, index) => step.id === steps[index]!.id));
  return copy;
}

export function PipelineGame() {
  const reduce = useReducedMotion();
  // La partie démarre sur une action du joueur : le mélange aléatoire n'a lieu que côté navigateur.
  const [items, setItems] = useState<Step[]>(STEPS);
  const [ready, setReady] = useState(false);
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [announce, setAnnounce] = useState("");
  const { submit } = useBestScore("trajet", "lower");

  const correctCount = items.filter((step, index) => step.id === STEPS[index]!.id).length;
  const solved = checked && correctCount === STEPS.length;

  const reorder = (next: Step[]) => {
    setItems(next);
    setChecked(false);
  };

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target]!, next[index]!];
    reorder(next);
    setAnnounce(`« ${items[index]!.label} » déplacé en position ${target + 1}.`);
  };

  const check = () => {
    setChecked(true);
    setAttempts((value) => value + 1);
    if (correctCount === STEPS.length) submit(attempts + 1);
    setAnnounce(
      correctCount === STEPS.length
        ? "Bravo, le trajet est dans le bon ordre."
        : `${correctCount} étape${correctCount > 1 ? "s" : ""} sur ${STEPS.length} à la bonne place. Continue.`,
    );
  };

  const reset = () => {
    setReady(true);
    setItems(shuffled(STEPS));
    setChecked(false);
    setAttempts(0);
    setAnnounce("Nouvelle partie : les étapes ont été mélangées.");
  };

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <h2 className="label text-accent">Consignes</h2>
        <p className="mt-4 text-lg text-fg-muted">
          Remets dans l&apos;ordre le trajet d&apos;une commande en ligne, du clic jusqu&apos;à la confirmation.
          Fais glisser une étape par sa poignée, ou utilise les flèches ↑ ↓, puis vérifie.
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-6 border-t hairline pt-6">
          <div>
            <dt className="label text-fg-subtle">Essais</dt>
            <dd className="mt-1 text-3xl font-medium">{attempts}</dd>
          </div>
          <div>
            <dt className="label text-fg-subtle">Bien placées</dt>
            <dd className="mt-1 text-3xl font-medium">{checked ? `${correctCount}/${STEPS.length}` : "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="lg:col-span-8">
        <p aria-live="polite" className="sr-only">
          {announce}
        </p>

        {!ready ? (
          <div className="flex min-h-80 flex-col items-center justify-center gap-6 rounded-(--radius) border border-dashed hairline p-8 text-center">
            <p className="text-lg text-fg-muted">{STEPS.length} étapes, un seul bon ordre.</p>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full bg-fg px-7 py-3.5 font-medium text-bg transition-colors duration-300 hover:bg-cobalt hover:text-ivory"
            >
              <Shuffle aria-hidden className="size-4" />
              Mélanger et commencer
            </button>
          </div>
        ) : (
        <Reorder.Group axis="y" values={items} onReorder={reorder} className="space-y-3" aria-label="Étapes à ordonner">
          {items.map((step, index) => (
            <StepItem
              key={step.id}
              step={step}
              index={index}
              total={items.length}
              checked={checked}
              right={checked && step.id === STEPS[index]!.id}
              solved={solved}
              reduce={!!reduce}
              onMove={move}
            />
          ))}
        </Reorder.Group>
        )}

        {ready && (
        <div className="mt-8 flex flex-wrap gap-3">
          {!solved && (
            <button
              type="button"
              onClick={check}
              className="inline-flex items-center gap-2 rounded-full bg-fg px-7 py-3.5 font-medium text-bg transition-colors duration-300 hover:bg-cobalt hover:text-ivory disabled:opacity-50"
            >
              <ListChecks aria-hidden className="size-4" />
              Vérifier l&apos;ordre
            </button>
          )}
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full border hairline px-7 py-3.5 font-medium hover:border-fg">
            {solved ? <RotateCcw aria-hidden className="size-4" /> : <Shuffle aria-hidden className="size-4" />}
            {solved ? "Rejouer" : "Mélanger à nouveau"}
          </button>
        </div>
        )}

        <AnimatePresence>
          {solved && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mt-12 rounded-(--radius) border border-success/40 p-8"
            >
              <p className="label text-success">
                Réussi en {attempts} essai{attempts > 1 ? "s" : ""}
              </p>
              <h3 className="mt-4 text-3xl font-medium tracking-tight">Pourquoi cet ordre</h3>
              <ol className="mt-6 space-y-4">
                {STEPS.map((step, index) => (
                  <li key={step.id} className="grid gap-1 md:grid-cols-[3rem_1fr]">
                    <span className="label pt-1 text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
                    <p>
                      <span className="font-medium">{step.label}.</span> <span className="text-fg-muted">{step.why}</span>
                    </p>
                  </li>
                ))}
              </ol>
              <p className="mt-8 text-fg-muted">
                C&apos;est exactement le chemin que suivent les formulaires des projets que je livre : validation et
                contrôle d&apos;accès côté serveur, jamais seulement dans l&apos;interface.{" "}
                <Link href="/contact" className="link-draw text-fg">
                  Parlons du tien
                </Link>
                .
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
