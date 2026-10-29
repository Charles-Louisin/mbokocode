import Link from "next/link";
import { SplitLines } from "@/src/components/motion/SplitLines";
import { ReviewCard } from "@/src/components/reviews/ReviewCard";
import { ActionLink } from "@/src/components/ui/ActionLink";
import { Carousel } from "@/src/components/ui/Carousel";
import { getReviews } from "@/src/lib/api/content";

// Avis sur l'accueil : uniquement des avis approuvés. Sans avis publié, une seule ligne discrète
// invite à laisser le premier, plutôt qu'une section vide ou un témoignage inventé.
export async function ReviewsSection() {
  const result = await getReviews(9);
  if (!result.ok) return null;
  const { data: reviews, meta } = result.data;

  if (reviews.length === 0) {
    return (
      <section aria-label="Avis" className="shell pb-24 md:pb-36">
        <p className="flex flex-wrap items-baseline justify-between gap-4 border-t hairline pt-6 text-fg-muted">
          <span>Aucun avis publié pour l&apos;instant. Tu as travaillé avec moi ?</span>
          <Link href="/avis" className="link-draw font-medium text-fg">
            Laisser le premier avis
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="reviews-title" className="shell pb-24 md:pb-36">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <SplitLines id="reviews-title" className="text-title font-semibold" lines={["Ce qu'en disent", "ceux qui ont bossé avec moi."]} />
        {meta.averageRating !== null && (
          <p className="text-fg-muted">
            <span className="text-title font-semibold text-fg">{meta.averageRating.toLocaleString("fr-FR")}</span>
            <span className="ml-2">/ 5 · {meta.total} avis</span>
          </p>
        )}
      </div>
      <div className="mt-14">
        <Carousel
          label="Avis publiés"
          slideClassName="md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
          slides={reviews.map((review) => ({ key: review.id, node: <ReviewCard review={review} /> }))}
        />
      </div>
      <div className="mt-12 flex justify-end">
        <ActionLink href="/avis" variant="secondary">
          Tous les avis
        </ActionLink>
      </div>
    </section>
  );
}
