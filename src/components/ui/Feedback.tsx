"use client";

import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// Retours d'interface gérés par le site, jamais par le navigateur :
// - toasts en haut à droite, 4 secondes, pour le succès ou l'échec de chaque opération ;
// - fenêtre de confirmation (à la place de window.confirm) pour les actions irréversibles.

type ToastKind = "success" | "error" | "info";
type Toast = { id: number; kind: ToastKind; text: string };
type ConfirmOptions = { title: string; message?: string; confirmLabel?: string; cancelLabel?: string; danger?: boolean };

type Feedback = {
  toast: (kind: ToastKind, text: string) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const FeedbackContext = createContext<Feedback | null>(null);
const DURATION = 4000;
const EASE = [0.16, 1, 0.3, 1] as const;

const ICONS = { success: CheckCircle2, error: XCircle, info: Info } as const;
const TONES = { success: "text-success", error: "text-danger", info: "text-cobalt-soft" } as const;

function ConfirmDialog({ options, onAnswer }: { options: ConfirmOptions; onAnswer: (value: boolean) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      onCancel={(event) => {
        event.preventDefault();
        onAnswer(false);
      }}
      onClick={(event) => {
        if (event.target === ref.current) onAnswer(false);
      }}
      className="m-auto w-[min(26rem,calc(100%_-_2rem))] rounded-(--radius) border hairline bg-bg p-0 text-fg backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <span className={`flex size-11 shrink-0 items-center justify-center rounded-full ${options.danger ? "bg-danger/15 text-danger" : "bg-cobalt/15 text-cobalt-soft"}`}>
            <AlertTriangle aria-hidden className="size-5" />
          </span>
          <div>
            <h2 id="confirm-title" className="text-lg font-semibold">
              {options.title}
            </h2>
            {options.message && <p className="mt-1.5 text-fg-muted">{options.message}</p>}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" autoFocus onClick={() => onAnswer(false)} className="inline-flex min-h-11 items-center gap-2 rounded-full border hairline px-5 font-medium hover:border-fg">
            <X aria-hidden className="size-4" />
            {options.cancelLabel ?? "Annuler"}
          </button>
          <button
            type="button"
            onClick={() => onAnswer(true)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-medium ${options.danger ? "bg-danger text-ivory" : "bg-fg text-bg hover:bg-cobalt hover:text-ivory"}`}
          >
            <CheckCircle2 aria-hidden className="size-4" />
            {options.confirmLabel ?? "Confirmer"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [pending, setPending] = useState<{ options: ConfirmOptions; resolve: (value: boolean) => void } | null>(null);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((item) => item.id !== id)), []);

  const toast = useCallback(
    (kind: ToastKind, text: string) => {
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-3), { id, kind, text }]);
      window.setTimeout(() => dismiss(id), DURATION);
    },
    [dismiss],
  );

  const confirm = useCallback((options: ConfirmOptions) => new Promise<boolean>((resolve) => setPending({ options, resolve })), []);

  const value = useMemo(() => ({ toast, confirm }), [toast, confirm]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-3 top-3 z-[70] flex w-[min(24rem,calc(100%_-_1.5rem))] flex-col gap-2 md:right-5 md:top-5">
        <AnimatePresence initial={false}>
          {toasts.map((item) => {
            const Icon = ICONS[item.kind];
            return (
              <motion.div
                key={item.id}
                role={item.kind === "error" ? "alert" : "status"}
                layout={!reduce}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-2xl border hairline bg-ink-2/95 p-4 pr-12 text-ivory shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl"
              >
                <Icon aria-hidden className={`mt-0.5 size-5 shrink-0 ${TONES[item.kind]}`} />
                <p className="text-sm leading-snug">{item.text}</p>
                <button type="button" onClick={() => dismiss(item.id)} aria-label="Fermer la notification" className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full text-ivory/60 hover:text-ivory">
                  <X aria-hidden className="size-4" />
                </button>
                {/* Temps restant avant la fermeture automatique. */}
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: DURATION / 1000, ease: "linear" }}
                  className={`absolute inset-x-0 bottom-0 h-0.5 origin-left ${item.kind === "error" ? "bg-danger" : item.kind === "success" ? "bg-success" : "bg-cobalt-soft"}`}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {pending && (
        <ConfirmDialog
          options={pending.options}
          onAnswer={(answer) => {
            pending.resolve(answer);
            setPending(null);
          }}
        />
      )}
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): Feedback {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error("useFeedback doit être utilisé sous <FeedbackProvider>.");
  return context;
}
