import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SignInPanel } from "@/src/components/account/SignInPanel";
import { SplitLines } from "@/src/components/motion/SplitLines";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connexion à ton espace MBOKO CODE pour laisser et gérer ton avis.",
  robots: { index: false, follow: false },
};

// Connexion — sert à laisser et gérer son avis. Pas d'inscription séparée : le premier passage crée le compte.
export default function SignInPage() {
  return (
    <div className="shell grid grid-cols-1 gap-16 pb-24 pt-[calc(var(--header-h)+3rem)] md:pb-36 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-6">
        <SplitLines as="h1" mode="intro" className="text-[clamp(2.6rem,6vw,5.6rem)] font-semibold leading-[0.92] tracking-[-0.035em]" lines={["Connexion", "sans mot de passe."]} />
        <p className="intro-fade mt-10 max-w-md text-lg text-fg-muted" style={{ "--intro-delay": "400ms" } as React.CSSProperties}>
          Ton espace sert à laisser ton avis et à le gérer. Google ou un lien par e-mail : ton premier passage crée le compte.
        </p>
      </div>
      <div className="intro-fade lg:col-span-5 lg:col-start-8 lg:pt-6" style={{ "--intro-delay": "500ms" } as React.CSSProperties}>
        <Suspense fallback={<div className="h-64 animate-pulse rounded-(--radius) bg-bg-raised" />}>
          <SignInPanel />
        </Suspense>
        <p className="mt-8 text-sm text-fg-subtle">
          En te connectant, tu acceptes le traitement décrit dans la{" "}
          <Link href="/confidentialite" className="link-draw text-fg-muted">
            politique de confidentialité
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
