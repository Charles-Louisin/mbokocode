"use client";

import { Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useId, useState } from "react";
import { BrandIcon } from "@/src/components/ui/BrandIcon";
import { useFeedback } from "@/src/components/ui/Feedback";
import { ApiError } from "@/src/lib/api/client";
import type { AuthProviders } from "@/src/lib/api/types";
import { getMe, getProviders, safeNext, sendMagicLink, signInWithGoogle } from "@/src/lib/auth";

const ERRORS: Record<string, string> = {
  lien: "Ce lien de connexion a expiré ou a déjà servi. Demande-en un nouveau.",
  google: "La connexion avec Google n'a pas abouti. Réessaie ou utilise ton e-mail.",
};

const button =
  "inline-flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 font-medium transition-[background-color,border-color,opacity] duration-300 disabled:cursor-not-allowed disabled:opacity-50";

// Connexion sans mot de passe : Google, ou un lien à usage unique envoyé par e-mail.
export function SignInPanel() {
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const uid = useId();
  const { toast } = useFeedback();
  const [providers, setProviders] = useState<AuthProviders | null>(null);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "redirecting">("idle");
  const [error, setError] = useState<string | null>(ERRORS[params.get("erreur") ?? ""] ?? null);

  useEffect(() => {
    let active = true;
    // Déjà connecté : direction l'espace demandé.
    void getMe()
      .then((user) => {
        if (active && user) window.location.replace(next);
      })
      .catch(() => {});
    void getProviders().then((value) => active && setProviders(value));
    return () => {
      active = false;
    };
  }, [next]);

  const onEmail = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Adresse e-mail invalide.");
      return;
    }
    setError(null);
    setState("sending");
    try {
      await sendMagicLink(email.trim(), next);
      setState("sent");
      toast("success", "Lien de connexion envoyé. Vérifie ta boîte mail.");
    } catch (err) {
      const text = err instanceof ApiError ? err.message : "L'envoi a échoué. Réessaie dans un instant.";
      setError(text);
      toast("error", text);
      setState("idle");
    }
  };

  const onGoogle = async () => {
    setError(null);
    setState("redirecting");
    try {
      await signInWithGoogle(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "La connexion avec Google n'a pas abouti.");
      setState("idle");
    }
  };

  if (state === "sent") {
    return (
      <div role="status" className="rounded-(--radius) border hairline bg-bg-raised/50 p-8">
        <Mail aria-hidden className="size-6 text-cobalt-soft" />
        <p className="mt-5 text-lead font-medium">Vérifie ta boîte mail.</p>
        <p className="mt-3 text-fg-muted">
          Un lien de connexion vient de partir vers <strong className="font-medium text-fg">{email.trim()}</strong>. Il est valable 10 minutes et ne sert
          qu&apos;une fois. Pense à regarder dans les indésirables.
        </p>
        <button type="button" onClick={() => setState("idle")} className="link-draw mt-6 font-medium">
          Utiliser une autre adresse
        </button>
      </div>
    );
  }

  if (!providers) return <div className="h-64 animate-pulse rounded-(--radius) bg-bg-raised" />;

  if (!providers.google && !providers.magicLink) {
    return (
      <p role="status" className="rounded-(--radius) border hairline p-6 text-fg-muted">
        La connexion n&apos;est pas encore disponible. Reviens un peu plus tard.
      </p>
    );
  }

  const busy = state !== "idle";
  return (
    <div className="space-y-8">
      {error && (
        <p role="alert" className="rounded-2xl border border-red-400/40 bg-red-500/10 px-5 py-4 text-sm">
          {error}
        </p>
      )}
      {providers.google && (
        <button type="button" onClick={onGoogle} disabled={busy} className={`${button} bg-fg text-bg hover:bg-ivory/90`}>
          <BrandIcon brand="google" className="size-5" />
          {state === "redirecting" ? "Redirection vers Google…" : "Continuer avec Google"}
        </button>
      )}
      {providers.google && providers.magicLink && (
        <p className="label flex items-center gap-4 text-fg-subtle before:h-px before:flex-1 before:bg-current/30 after:h-px after:flex-1 after:bg-current/30">ou</p>
      )}
      {providers.magicLink && (
        <form onSubmit={onEmail} noValidate className="space-y-4">
          <label htmlFor={`${uid}-email`} className="label block text-fg-subtle">
            Ton adresse e-mail
          </label>
          <input
            id={`${uid}-email`}
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="prenom@exemple.com"
            className="w-full rounded-2xl border hairline bg-transparent px-5 py-4 text-lg outline-none transition-colors placeholder:text-fg-subtle focus:border-cobalt-soft"
          />
          <button type="submit" disabled={busy} className={`${button} border hairline hover:border-cobalt-soft`}>
            <Mail aria-hidden className="size-5" />
            {state === "sending" ? "Envoi du lien…" : "Recevoir un lien de connexion"}
          </button>
        </form>
      )}
    </div>
  );
}
