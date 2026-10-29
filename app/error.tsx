"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="shell flex min-h-[80svh] flex-col justify-center pt-(--header-h)">
      <p className="label text-accent">Indisponible</p>
      <h1 className="mt-6 text-display font-semibold">
        Un contenu n&apos;a pas pu charger.
      </h1>
      <p className="mt-8 max-w-lg text-lead text-fg-muted">Le service est peut-être momentanément indisponible. Réessaie dans un instant.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="rounded-full bg-fg px-6 py-3.5 font-medium text-bg hover:bg-cobalt hover:text-ivory">
          Réessayer
        </button>
        <Link href="/" className="rounded-full border hairline px-6 py-3.5 font-medium hover:border-fg">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
