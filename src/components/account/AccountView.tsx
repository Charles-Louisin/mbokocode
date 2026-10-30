"use client";

import { Check, Clock, EyeOff, LayoutDashboard, LogOut, Pencil, Trash2, UserX, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ReviewCard } from "@/src/components/reviews/ReviewCard";
import { useFeedback } from "@/src/components/ui/Feedback";
import { ApiError, apiFetch } from "@/src/lib/api/client";
import type { ApiItem, OwnReview, ReviewStatus, SessionUser } from "@/src/lib/api/types";
import { deleteAccount, getMe, signOut } from "@/src/lib/auth";
import { ReviewForm } from "./ReviewForm";

const STATUS: Record<ReviewStatus, { label: string; text: string; icon: typeof Clock }> = {
  pending: { label: "En relecture", text: "Je relis chaque avis avant de le publier. Tu peux encore le modifier.", icon: Clock },
  approved: { label: "Publié", text: "Ton avis est visible sur le site. Tu peux le modifier ou le supprimer à tout moment.", icon: Check },
  rejected: { label: "Non publié", text: "Cet avis n'a pas été retenu. Tu peux le modifier ou m'écrire pour en parler.", icon: X },
  hidden: { label: "Masqué", text: "Cet avis n'est plus affiché sur le site. Tu peux le modifier ou le supprimer.", icon: EyeOff },
};

type Load = { state: "loading" } | { state: "error"; message: string } | { state: "ready"; user: SessionUser; review: OwnReview | null };

// Espace connecté minimal : profil, son avis et son état de modération, modification et suppression.
export function AccountView() {
  const router = useRouter();
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const { toast, confirm } = useFeedback();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const user = await getMe();
        if (!user) {
          window.location.replace("/connexion?next=/compte");
          return;
        }
        const review = (await apiFetch<ApiItem<OwnReview | null>>("/reviews/me")).data;
        if (active) setLoad({ state: "ready", user, review });
      } catch (err) {
        if (active) setLoad({ state: "error", message: err instanceof ApiError ? err.message : "Ton espace ne peut pas être chargé." });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (load.state === "loading") return <div aria-busy className="h-96 animate-pulse rounded-(--radius) bg-bg-raised" />;
  if (load.state === "error") {
    return (
      <p role="alert" className="rounded-(--radius) border hairline p-6 text-fg-muted">
        {load.message} Recharge la page dans un instant.
      </p>
    );
  }

  const { user, review } = load;
  const setReview = (next: OwnReview | null) => setLoad({ state: "ready", user, review: next });

  const run = async (action: () => Promise<unknown>, success: string, after: () => void) => {
    setBusy(true);
    try {
      await action();
      toast("success", success);
      after();
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "L'action n'a pas abouti. Réessaie dans un instant.");
    } finally {
      setBusy(false);
    }
  };

  const removeAccount = async () => {
    const ok = await confirm({
      title: "Supprimer ton compte ?",
      message: "Ton compte et ton avis seront supprimés définitivement.",
      confirmLabel: "Supprimer mon compte",
      danger: true,
    });
    if (ok) await run(deleteAccount, "Ton compte a été supprimé.", () => router.replace("/"));
  };

  const removeReview = async (id: string) => {
    const ok = await confirm({ title: "Supprimer ton avis ?", message: "Il sera retiré définitivement.", confirmLabel: "Supprimer", danger: true });
    if (ok) await run(() => apiFetch(`/reviews/${id}`, { method: "DELETE" }), "Ton avis a été supprimé.", () => setReview(null));
  };

  const status = review ? STATUS[review.status] : null;

  return (
    <div className="grid gap-16 lg:grid-cols-12">
      <aside className="lg:col-span-4">
        <p className="label text-fg-subtle">Connecté en tant que</p>
        {/* Un compte créé par lien e-mail n'a pas encore de nom : l'adresse suffit. */}
        {user.name && <p className="mt-2 text-lead font-medium">{user.name}</p>}
        <p className={user.name ? "mt-1 break-all text-fg-muted" : "mt-2 break-all text-lead font-medium"}>{user.email}</p>
        {user.isAdmin && (
          <Link href="/admin" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-cobalt px-5 font-medium text-ivory">
            <LayoutDashboard aria-hidden className="size-4" />
            Tableau de bord
          </Link>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => run(signOut, "Tu es déconnecté.", () => router.replace("/"))}
          className="link-draw mt-6 flex items-center gap-2 py-2 font-medium"
        >
          <LogOut aria-hidden className="size-4" />
          Me déconnecter
        </button>

        <div className="mt-12 border-t hairline pt-6 text-sm text-fg-subtle">
          <button type="button" disabled={busy} onClick={removeAccount} className="link-draw inline-flex items-center gap-2 py-2 hover:text-fg">
            <UserX aria-hidden className="size-4" />
            Supprimer mon compte
          </button>
        </div>
      </aside>

      <section id="avis" aria-labelledby="my-review-title" className="scroll-mt-32 lg:col-span-8">
        <h2 id="my-review-title" className="text-title font-semibold">
          {review ? "Ton avis" : "Laisser un avis"}
        </h2>

        {review && status && !editing ? (
          <div className="mt-8 space-y-6">
            <p role="status" className="flex items-start gap-3 rounded-2xl border hairline bg-bg-raised/50 px-5 py-4">
              <status.icon aria-hidden className="mt-0.5 size-5 shrink-0 text-cobalt-soft" />
              <span>
                <span className="font-medium">{status.label}.</span> <span className="text-fg-muted">{status.text}</span>
              </span>
            </p>
            <ReviewCard review={review} />
            <div className="flex flex-wrap gap-4">
              <button type="button" onClick={() => setEditing(true)} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-fg px-6 font-medium text-bg hover:bg-cobalt hover:text-ivory">
                <Pencil aria-hidden className="size-4" />
                Modifier
              </button>
              <button type="button" disabled={busy} onClick={() => removeReview(review.id)} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-danger/50 px-6 font-medium text-danger">
                <Trash2 aria-hidden className="size-4" />
                Supprimer
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            {!review && <p className="mb-10 max-w-xl text-fg-muted">Un avis par compte. Je le relis avant de le publier, et tu peux le modifier ou le supprimer quand tu veux.</p>}
            <ReviewForm
              review={review ?? undefined}
              defaultName={user.name}
              onCancel={review ? () => setEditing(false) : undefined}
              onSaved={(saved) => {
                setReview(saved);
                setEditing(false);
              }}
            />
          </div>
        )}
      </section>
    </div>
  );
}
