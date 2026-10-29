import { LogoMark } from "@/src/components/brand/LogoMark";
import { ActionLink } from "@/src/components/ui/ActionLink";

export default function NotFound() {
  return (
    <div className="shell relative flex min-h-[90svh] flex-col justify-center overflow-hidden pt-(--header-h)">
      <LogoMark className="pointer-events-none absolute -right-[10vw] top-1/2 w-[70vw] -translate-y-1/2 text-ivory/[0.04]" />
      <p className="label text-accent">Erreur 404</p>
      <h1 className="mt-6 text-mega font-semibold">
        Page introuvable.
      </h1>
      <p className="mt-8 max-w-lg text-lead text-fg-muted">Le lien est peut-être ancien, ou la page a changé d&apos;adresse.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ActionLink href="/">Retour à l&apos;accueil</ActionLink>
        <ActionLink href="/projets" variant="secondary">
          Voir les projets
        </ActionLink>
      </div>
    </div>
  );
}
