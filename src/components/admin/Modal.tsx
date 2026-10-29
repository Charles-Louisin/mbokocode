"use client";

import { X } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";

type Props = { title: string; open: boolean; onClose: () => void; children: ReactNode; footer?: ReactNode };

// Fenêtre d'édition du tableau de bord : <dialog> natif (focus piégé, Échap pour fermer).
// Plein écran sur mobile, panneau centré sur grand écran ; le contenu défile, l'en-tête et le pied restent visibles.
export function Modal({ title, open, onClose, children, footer }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // Clic sur le fond (hors du panneau) : on ferme.
        if (event.target === ref.current) onClose();
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-fg backdrop:bg-ink/70 backdrop:backdrop-blur-sm md:m-auto md:h-auto md:max-h-[90dvh] md:w-[min(56rem,calc(100%_-_3rem))] md:rounded-(--radius)"
    >
      {open && (
        <div className="flex h-full max-h-[inherit] flex-col bg-bg md:rounded-(--radius) md:border md:hairline">
          <header className="flex items-center justify-between gap-4 border-b hairline px-5 py-4 md:px-7">
            <h2 className="text-lg font-semibold md:text-xl">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Fermer" className="flex size-11 shrink-0 items-center justify-center rounded-full border hairline hover:border-fg">
              <X aria-hidden className="size-5" />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 md:px-7">{children}</div>
          {footer && <footer className="border-t hairline px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-7">{footer}</footer>}
        </div>
      )}
    </dialog>
  );
}
