import type { Metadata } from "next";
import { Suspense } from "react";
import { SplitLines } from "@/src/components/motion/SplitLines";
import { ReviewCard } from "@/src/components/reviews/ReviewCard";
import { ActionLink } from "@/src/components/ui/ActionLink";
import { Carousel } from "@/src/components/ui/Carousel";
import { Unavailable } from "@/src/components/ui/Unavailable";
import { getReviews } from "@/src/lib/api/content";

export const metadata: Metadata = {
  title: "Avis",
  description: "Les avis publiés par les personnes qui ont travaillé avec MBOKO CODE, relus avant publication.",
  alternates: { canonical: "/avis" },
};

const process = [
  { title: "Tu te connectes", text: "Avec Google ou un lien reçu par e-mail. Pas de mot de passe à retenir." },
  { title: "Tu écris ton avis", text: "Une note, quelques phrases, le nom que tu veux afficher. Un avis par compte, modifiable." },
  { title: "Je le relis", text: "Rien n'est publié sans relecture. Le badge « Client vérifié » n'apparaît que si j'ai confirmé notre collaboration." },
];

async function ReviewList() {
  const result = await getReviews(24);
  if (!result.ok) return <Unavailable what="Les avis" />;
  const { data: reviews, meta } = result.data;

  if (reviews.length === 0) {
    return <p className="max-w-xl text-lead text-fg-muted">Aucun avis n&apos;est encore publié. Le premier pourrait être le tien.</p>;
  }

  return (
    <>
      {meta.averageRating !== null && (
        <p className="mb-10 text-fg-muted">
          <span className="text-title font-semibold text-fg">{meta.averageRating.toLocaleString("fr-FR")}</span>
          <span className="ml-2">/ 5 · {meta.total} avis publié{meta.total > 1 ? "s" : ""}</span>
        </p>
      )}
      <Carousel
        label="Avis publiés"
        slideClassName="md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
        slides={reviews.map((review) => ({ key: review.id, node: <ReviewCard review={review} /> }))}
      />
    </>
  );
}

// Avis — d'abord les avis publiés, puis comment en laisser un : la modération est dite, pas cachée.
export default function ReviewsPage() {
  return (
    <div className="shell pb-24 pt-[calc(var(--header-h)+3rem)] md:pb-36">
      <SplitLines as="h1" mode="intro" className="text-mega font-semibold" lines={["Leurs mots,", "pas les miens."]} />
      <div className="intro-fade mt-16 border-t hairline pt-12" style={{ "--intro-delay": "500ms" } as React.CSSProperties}>
        <Suspense fallback={<div className="h-72 animate-pulse rounded-(--radius) bg-bg-raised" />}>
          <ReviewList />
        </Suspense>
      </div>

      <section aria-labelledby="leave-review-title" className="mt-24 grid gap-12 border-t hairline pt-12 md:mt-36 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="leave-review-title" className="text-title font-semibold">
            Laisser un avis
          </h2>
          <p className="mt-6 max-w-md text-fg-muted">Tu as travaillé avec moi, comme client ou en collaboration ? Ton retour aide les prochains à se décider.</p>
          <ActionLink href="/compte#avis" className="mt-10">
            Écrire mon avis
          </ActionLink>
        </div>
        <ol className="lg:col-span-7">
          {process.map((step, index) => (
            <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-4 border-t hairline py-7 last:border-b">
              <span className="label pt-1 text-fg-subtle">0{index + 1}</span>
              <span>
                <span className="block text-lead font-medium">{step.title}</span>
                <span className="mt-2 block text-fg-muted">{step.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
