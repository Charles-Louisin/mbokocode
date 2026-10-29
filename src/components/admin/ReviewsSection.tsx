"use client";

import { BadgeCheck, BadgeX, Ban, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Stars } from "@/src/components/reviews/ReviewCard";
import type { ReviewStatus } from "@/src/lib/api/types";
import { type AdminReview, formatDateTime, useAdminData } from "./data";
import { Badge, Panel, TextField } from "./fields";
import { useSave } from "./useSave";

const FILTERS: { value: ReviewStatus | "all"; label: string }[] = [
  { value: "pending", label: "À relire" },
  { value: "approved", label: "Publiés" },
  { value: "hidden", label: "Masqués" },
  { value: "rejected", label: "Rejetés" },
  { value: "all", label: "Tous" },
];

const STATUS_BADGE: Record<ReviewStatus, { tone: "warning" | "success" | "neutral" | "danger"; label: string }> = {
  pending: { tone: "warning", label: "À relire" },
  approved: { tone: "success", label: "Publié" },
  hidden: { tone: "neutral", label: "Masqué" },
  rejected: { tone: "danger", label: "Rejeté" },
};

function ReviewItem({ review, onChanged }: { review: AdminReview; onChanged: () => void }) {
  const [note, setNote] = useState(review.moderationNote ?? "");
  const [proof, setProof] = useState(review.verification?.note ?? "");
  const moderation = useSave<AdminReview>();
  const verification = useSave<AdminReview>();

  const moderate = async (status: "approved" | "rejected" | "hidden") => {
    if (await moderation.save(`/admin/reviews/${review.id}/status`, { status, ...(note.trim() ? { note: note.trim() } : {}) }, ["reviews"])) onChanged();
  };
  const verify = async (isVerifiedClient: boolean) => {
    const body = isVerifiedClient ? { isVerifiedClient, note: proof.trim() } : { isVerifiedClient };
    if (await verification.save(`/admin/reviews/${review.id}/verification`, body, ["reviews"])) onChanged();
  };

  const badge = STATUS_BADGE[review.status];
  return (
    <li className="rounded-(--radius) border hairline p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={badge.tone}>{badge.label}</Badge>
          <Stars rating={review.rating} />
          {review.isVerifiedClient && (
            <span className="inline-flex items-center gap-1 text-sm text-cobalt-soft">
              <BadgeCheck aria-hidden className="size-4" /> Client vérifié
            </span>
          )}
        </div>
        <span className="text-sm text-fg-subtle">Reçu le {formatDateTime(review.createdAt)}</span>
      </div>

      <p className="mt-4 font-medium">
        {review.authorNameSnapshot}
        {review.authorRole && <span className="font-normal text-fg-muted"> · {review.authorRole}</span>}
      </p>
      <p className="text-sm text-fg-subtle">{review.authorEmail ?? "Compte supprimé"}</p>
      {review.title && <p className="mt-4 text-lg font-medium">{review.title}</p>}
      <p className="mt-2 whitespace-pre-line text-fg-muted">{review.content}</p>

      <div className="mt-6 grid gap-6 border-t hairline pt-5 lg:grid-cols-2">
        <div className="space-y-3">
          <TextField label="Note de modération (interne, facultative)" value={note} onChange={setNote} />
          <div className="flex flex-wrap gap-2">
            {review.status !== "approved" && (
              <button type="button" disabled={moderation.saving} onClick={() => moderate("approved")} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-success px-4 text-sm font-semibold text-ink">
                <Eye aria-hidden className="size-4" />
                Publier
              </button>
            )}
            {review.status === "approved" && (
              <button type="button" disabled={moderation.saving} onClick={() => moderate("hidden")} className="inline-flex min-h-10 items-center gap-2 rounded-full border hairline px-4 text-sm font-medium hover:border-fg">
                <EyeOff aria-hidden className="size-4" />
                Masquer
              </button>
            )}
            {review.status !== "rejected" && (
              <button type="button" disabled={moderation.saving} onClick={() => moderate("rejected")} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-danger/50 px-4 text-sm font-medium text-danger">
                <Ban aria-hidden className="size-4" />
                Rejeter
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <TextField
            label="Preuve de la collaboration (pour le badge)"
            hint="Ex. : projet livré en mars 2026, facture n° 14. Visible de toi seul."
            value={proof}
            onChange={setProof}
            error={verification.errors.note}
          />
          <div className="flex flex-wrap gap-2">
            {review.isVerifiedClient ? (
              <button type="button" disabled={verification.saving} onClick={() => verify(false)} className="inline-flex min-h-10 items-center gap-2 rounded-full border hairline px-4 text-sm font-medium hover:border-fg">
                <BadgeX aria-hidden className="size-4" />
                Retirer le badge
              </button>
            ) : (
              <button type="button" disabled={verification.saving} onClick={() => verify(true)} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-cobalt px-4 text-sm font-semibold text-ivory">
                <BadgeCheck aria-hidden className="size-4" />
                Marquer client vérifié
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

// Modération : relire, publier, masquer, rejeter ; badge « Client vérifié » avec justification.
export function ReviewsSection() {
  const [filter, setFilter] = useState<ReviewStatus | "all">("pending");
  const { data, error, reload } = useAdminData<AdminReview[]>(`/reviews${filter === "all" ? "" : `?status=${filter}`}`);

  return (
    <Panel
      title="Avis"
      actions={
        <div role="group" aria-label="Filtrer les avis" className="flex flex-wrap gap-1.5">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
              className="min-h-9 rounded-full border hairline px-3.5 text-sm aria-pressed:border-cobalt-soft aria-pressed:bg-cobalt/15"
            >
              {item.label}
            </button>
          ))}
        </div>
      }
    >
      {error && <p className="text-danger">{error}</p>}
      {!data && !error && <div className="h-40 animate-pulse rounded-xl bg-bg-raised" />}
      {data && data.length === 0 && <p className="text-fg-muted">Aucun avis dans cette catégorie.</p>}
      {data && data.length > 0 && (
        <ul className="space-y-4">
          {data.map((review) => (
            <ReviewItem key={`${review.id}-${review.updatedAt}`} review={review} onChanged={reload} />
          ))}
        </ul>
      )}
    </Panel>
  );
}
