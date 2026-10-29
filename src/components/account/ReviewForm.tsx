"use client";

import { type FormEvent, useId, useState } from "react";
import { Loader2, Send, X } from "lucide-react";
import { relationshipLabels } from "@/src/components/reviews/ReviewCard";
import { useFeedback } from "@/src/components/ui/Feedback";
import { ApiError, apiFetch } from "@/src/lib/api/client";
import type { ApiItem, OwnReview, RelationshipType } from "@/src/lib/api/types";

type Props = {
  /** Avis existant à modifier ; absent pour un premier avis. */
  review?: OwnReview;
  defaultName: string;
  onSaved: (review: OwnReview) => void;
  onCancel?: () => void;
};

const MIN = 30;
const MAX = 1200;
const RATING_WORDS = ["", "Décevant", "Moyen", "Bien", "Très bien", "Excellent"];

const field = "w-full rounded-2xl border hairline bg-transparent px-5 py-4 outline-none transition-colors placeholder:text-fg-subtle focus:border-cobalt-soft";
const chip = (selected: boolean) =>
  `rounded-full border px-4 py-2.5 text-sm transition-colors ${selected ? "border-cobalt-soft bg-cobalt/15" : "hairline hover:border-fg-subtle"}`;

// Écrire ou modifier son avis. Toute modification repasse en relecture avant publication.
export function ReviewForm({ review, defaultName, onSaved, onCancel }: Props) {
  const uid = useId();
  const [rating, setRating] = useState(review?.rating ?? 0);
  const [title, setTitle] = useState(review?.title ?? "");
  const [content, setContent] = useState(review?.content ?? "");
  const [authorName, setAuthorName] = useState(review?.authorName ?? defaultName);
  const [authorRole, setAuthorRole] = useState(review?.authorRole ?? "");
  const [relationship, setRelationship] = useState<RelationshipType | undefined>(review?.relationshipType ?? undefined);
  const [consent, setConsent] = useState(Boolean(review));
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const { toast } = useFeedback();
  const [saving, setSaving] = useState(false);

  const length = content.trim().length;

  const validate = () => {
    const next: Record<string, string | undefined> = {};
    if (rating < 1) next.rating = "Choisis une note.";
    if (length < MIN) next.content = `Écris au moins ${MIN} caractères.`;
    if (length > MAX) next.content = `${MAX} caractères au maximum.`;
    if (authorName.trim().length < 2) next.authorName = "Indique le nom à afficher.";
    if (!review && !consent) next.consent = "Ton accord est nécessaire pour publier ton avis.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const body = {
      rating,
      title: title.trim(),
      content: content.trim(),
      authorName: authorName.trim(),
      authorRole: authorRole.trim(),
      ...(relationship ? { relationshipType: relationship } : {}),
      ...(review ? {} : { consent: true }),
    };
    try {
      const result = await apiFetch<ApiItem<OwnReview>>(review ? `/reviews/${review.id}` : "/reviews", {
        method: review ? "PATCH" : "POST",
        body,
      });
      toast("success", review ? "Avis mis à jour : il repasse en relecture." : "Merci ! Ton avis est envoyé, je le relis avant de le publier.");
      onSaved(result.data);
    } catch (err) {
      if (err instanceof ApiError) {
        toast("error", err.message);
        if (err.fieldErrors) setErrors(Object.fromEntries(Object.entries(err.fieldErrors).map(([key, value]) => [key, value?.[0]])));
      } else {
        toast("error", "L'envoi a échoué. Réessaie dans un instant.");
      }
    } finally {
      setSaving(false);
    }
  };

  const errorText = (key: string) =>
    errors[key] ? (
      <p id={`${uid}-${key}-error`} className="mt-2 text-sm text-red-300">
        {errors[key]}
      </p>
    ) : null;
  const described = (key: string) => (errors[key] ? `${uid}-${key}-error` : undefined);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-9">
      <fieldset aria-describedby={described("rating")}>
        <legend className="label text-fg-subtle">Ta note</legend>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  name={`${uid}-rating`}
                  value={value}
                  checked={rating === value}
                  onChange={() => setRating(value)}
                  className="peer sr-only"
                />
                <span className="sr-only">
                  {value} sur 5 — {RATING_WORDS[value]}
                </span>
                <svg
                  aria-hidden
                  viewBox="0 0 20 20"
                  className={`size-10 rounded-lg p-1 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-cobalt-soft ${
                    value <= rating ? "text-cobalt-soft" : "text-fg-subtle hover:text-fg-muted"
                  }`}
                >
                  <path
                    d="M10 1.6l2.47 5.36 5.86.68-4.34 4 1.18 5.78L10 14.5l-5.17 2.92 1.18-5.78-4.34-4 5.86-.68z"
                    fill={value <= rating ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                </svg>
              </label>
            ))}
          </div>
          <span aria-hidden className="text-fg-muted">
            {RATING_WORDS[rating]}
          </span>
        </div>
        {errorText("rating")}
      </fieldset>

      <fieldset>
        <legend className="label text-fg-subtle">Nous avons travaillé ensemble en tant que</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(relationshipLabels) as RelationshipType[]).map((key) => (
            <button key={key} type="button" aria-pressed={relationship === key} onClick={() => setRelationship(relationship === key ? undefined : key)} className={chip(relationship === key)}>
              {relationshipLabels[key]}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`${uid}-title`} className="label block text-fg-subtle">
          Titre <span className="normal-case">(facultatif)</span>
        </label>
        <input id={`${uid}-title`} value={title} onChange={(event) => setTitle(event.target.value)} maxLength={80} className={`${field} mt-3`} />
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor={`${uid}-content`} className="label block text-fg-subtle">
            Ton avis
          </label>
          <span aria-live="polite" className={`text-sm tabular-nums ${length > MAX ? "text-red-300" : "text-fg-subtle"}`}>
            {length < MIN ? `encore ${MIN - length} caractères` : `${length} / ${MAX}`}
          </span>
        </div>
        <textarea
          id={`${uid}-content`}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={6}
          aria-invalid={Boolean(errors.content)}
          aria-describedby={described("content")}
          placeholder="Le projet, la collaboration, le résultat : ce qui t'a été utile."
          className={`${field} mt-3 resize-y`}
        />
        {errorText("content")}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className="label block text-fg-subtle">
            Nom affiché
          </label>
          <input
            id={`${uid}-name`}
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
            maxLength={60}
            autoComplete="name"
            aria-invalid={Boolean(errors.authorName)}
            aria-describedby={described("authorName")}
            className={`${field} mt-3`}
          />
          {errorText("authorName")}
        </div>
        <div>
          <label htmlFor={`${uid}-role`} className="label block text-fg-subtle">
            Fonction, entreprise <span className="normal-case">(facultatif)</span>
          </label>
          <input
            id={`${uid}-role`}
            value={authorRole}
            onChange={(event) => setAuthorRole(event.target.value)}
            maxLength={80}
            placeholder="Fondatrice, Ma Boutique"
            autoComplete="organization-title"
            className={`${field} mt-3`}
          />
        </div>
      </div>

      {!review && (
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-fg-muted">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              aria-describedby={described("consent")}
              className="mt-1 size-5 shrink-0 accent-cobalt"
            />
            <span>J&apos;accepte que cet avis, avec le nom affiché, soit publié sur ce site après relecture. Je peux le modifier ou le supprimer à tout moment.</span>
          </label>
          {errorText("consent")}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-fg px-7 py-4 font-medium text-bg transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Send aria-hidden className="size-4" />}
          {saving ? "Envoi…" : review ? "Enregistrer et renvoyer en relecture" : "Envoyer mon avis"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="link-draw inline-flex items-center gap-2 py-2 font-medium">
            <X aria-hidden className="size-4" />
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
