"use client";

import { Check, ChevronDown, Loader2, Save, X } from "lucide-react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";

// Champs du tableau de bord : sobres, lisibles, avec l'erreur renvoyée par l'API sous le champ.

const input =
  "w-full rounded-xl border hairline bg-transparent px-4 py-3 outline-none transition-colors placeholder:text-fg-subtle focus:border-cobalt-soft aria-[invalid=true]:border-danger";

type Base = { label: string; error?: string; hint?: string };

function Wrapper({ id, label, error, hint, children }: Base & { id: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label block text-fg-subtle">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint && !error && <p className="mt-1.5 text-sm text-fg-subtle">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({ value, onChange, type = "text", ...base }: Base & { value: string; onChange: (value: string) => void; type?: string }) {
  const id = useId();
  return (
    <Wrapper id={id} {...base}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(base.error)}
        aria-describedby={base.error ? `${id}-error` : undefined}
        className={input}
      />
    </Wrapper>
  );
}

export function TextArea({ value, onChange, rows = 4, mono = false, ...base }: Base & { value: string; onChange: (value: string) => void; rows?: number; mono?: boolean }) {
  const id = useId();
  return (
    <Wrapper id={id} {...base}>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(base.error)}
        aria-describedby={base.error ? `${id}-error` : undefined}
        className={`${input} resize-y ${mono ? "font-mono text-sm" : ""}`}
        spellCheck={!mono}
      />
    </Wrapper>
  );
}

/** Liste éditée à raison d'un élément par ligne. */
export function LinesField({ value, onChange, ...base }: Base & { value: string[]; onChange: (value: string[]) => void }) {
  return (
    <TextArea
      {...base}
      hint={base.hint ?? "Un élément par ligne."}
      rows={Math.min(8, Math.max(3, value.length + 1))}
      value={value.join("\n")}
      onChange={(text) => onChange(text.split("\n").map((line) => line.trim()).filter(Boolean))}
    />
  );
}

/**
 * Liste de choix en mini-fenêtre : un bouton affiche la valeur, un clic ouvre les options
 * (feuille en bas d'écran sur mobile, petite fenêtre centrée sur ordinateur). Clavier : flèches, Entrée, Échap.
 */
export function SelectField<T extends string>({
  value,
  onChange,
  options,
  ...base
}: Base & { value: T; onChange: (value: T) => void; options: { value: T; label: string }[] }) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const current = options.find((option) => option.value === value);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) {
      element.showModal();
      element.querySelector<HTMLButtonElement>("[aria-checked=true]")?.focus();
    }
    if (!open && element.open) element.close();
  }, [open]);

  const choose = (next: T) => {
    onChange(next);
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const buttons = [...(dialog.current?.querySelectorAll<HTMLButtonElement>("[role=radio]") ?? [])];
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    buttons[(index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length]?.focus();
  };

  return (
    <Wrapper id={id} {...base}>
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`${input} flex items-center justify-between gap-3 text-left`}
      >
        <span className="truncate">{current?.label ?? "Choisir…"}</span>
        <ChevronDown aria-hidden className="size-4 shrink-0 text-fg-subtle" />
      </button>
      <dialog
        ref={dialog}
        aria-label={base.label}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialog.current) setOpen(false);
        }}
        className="mb-0 mt-auto w-full max-w-none rounded-t-(--radius) border hairline bg-bg p-0 text-fg backdrop:bg-ink/60 backdrop:backdrop-blur-[2px] md:m-auto md:w-[min(22rem,calc(100%_-_2rem))] md:rounded-(--radius)"
      >
        <div className="flex items-center justify-between gap-3 border-b hairline px-4 py-3">
          <p className="font-semibold">{base.label}</p>
          <button type="button" onClick={() => setOpen(false)} aria-label="Fermer" className="flex size-10 items-center justify-center rounded-full hover:bg-bg-raised">
            <X aria-hidden className="size-4" />
          </button>
        </div>
        <div role="radiogroup" aria-label={base.label} onKeyDown={onKeyDown} className="max-h-[60dvh] overflow-y-auto p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => choose(option.value)}
                className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-3.5 text-left transition-colors ${selected ? "bg-cobalt/15 font-medium" : "hover:bg-bg-raised"}`}
              >
                {option.label}
                {selected && <Check aria-hidden className="size-4 text-cobalt-soft" />}
              </button>
            );
          })}
        </div>
      </dialog>
    </Wrapper>
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (value: boolean) => void; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 size-5 shrink-0 accent-cobalt" />
      <span>
        <span className="font-medium">{label}</span>
        {hint && <span className="block text-sm text-fg-subtle">{hint}</span>}
      </span>
    </label>
  );
}

export function SaveBar({ saving, dirty, onSave }: { saving: boolean; dirty: boolean; onSave: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-t hairline pt-5">
      <button
        type="button"
        onClick={onSave}
        disabled={saving || !dirty}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-6 font-medium text-bg transition-colors hover:bg-cobalt hover:text-ivory disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Save aria-hidden className="size-4" />}
        {saving ? "Enregistrement…" : "Enregistrer"}
      </button>
    </div>
  );
}

export function Panel({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="rounded-(--radius) border hairline bg-bg-raised/30 p-5 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        {actions}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function Badge({ tone, children }: { tone: "success" | "warning" | "danger" | "neutral" | "accent"; children: ReactNode }) {
  const tones = {
    success: "bg-success/15 text-success",
    warning: "bg-[#e2a84a]/15 text-[#e7b866]",
    danger: "bg-danger/15 text-danger",
    neutral: "bg-fg/10 text-fg-muted",
    accent: "bg-cobalt/15 text-cobalt-soft",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
