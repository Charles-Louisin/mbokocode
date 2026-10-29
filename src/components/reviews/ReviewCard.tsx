import { BadgeCheck } from "lucide-react";
import type { RelationshipType, Review } from "@/src/lib/api/types";

export const relationshipLabels: Record<RelationshipType, string> = {
  client: "Client",
  collaboration: "Collaboration",
  other: "Autre",
};

export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span role="img" aria-label={`Note : ${rating} sur 5`} className={`inline-flex gap-0.5 text-cobalt-soft ${className}`}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} aria-hidden viewBox="0 0 20 20" className="size-4">
          <path
            d="M10 1.6l2.47 5.36 5.86.68-4.34 4 1.18 5.78L10 14.5l-5.17 2.92 1.18-5.78-4.34-4 5.86-.68z"
            fill={index < rating ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
            opacity={index < rating ? 1 : 0.35}
          />
        </svg>
      ))}
    </span>
  );
}

const dateFormat = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });

// Un avis publié : la note, le texte tel qu'écrit par son auteur, puis qui parle et quand.
export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-(--radius) border hairline bg-bg-raised/40 p-7 md:p-8">
      <Stars rating={review.rating} />
      {review.title && <p className="mt-6 text-lg font-medium tracking-[-0.01em]">{review.title}</p>}
      <blockquote className={`${review.title ? "mt-3" : "mt-6"} flex-1 text-fg-muted`}>
        <p className="whitespace-pre-line">{review.content}</p>
      </blockquote>
      <figcaption className="mt-8 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-t hairline pt-5 text-sm">
        <span>
          <span className="block font-medium text-fg">{review.authorName}</span>
          {review.authorRole && <span className="block text-fg-subtle">{review.authorRole}</span>}
        </span>
        <span className="flex flex-col items-end gap-1 text-fg-subtle">
          {review.isVerifiedClient && (
            <span className="inline-flex items-center gap-1.5 text-cobalt-soft">
              <BadgeCheck aria-hidden className="size-4" />
              Client vérifié
            </span>
          )}
          {review.publishedAt && <time dateTime={review.publishedAt}>{dateFormat.format(new Date(review.publishedAt))}</time>}
        </span>
      </figcaption>
    </figure>
  );
}
