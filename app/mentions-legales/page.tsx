import type { Metadata } from "next";
import { LegalPage } from "@/src/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Éditeur du site, hébergement et propriété intellectuelle.",
  alternates: { canonical: "/mentions-legales" },
};

// À compléter avant la mise en production : statut juridique / immatriculation et hébergeur réel.
export default function LegalNoticePage() {
  return (
    <LegalPage eyebrow="Mentions légales" title="Mentions légales." updated="29 octobre 2026">
      <section>
        <h2>Éditeur</h2>
        <p>
          Charles Louisin Yimbne — MBOKO CODE
          <br />
          Douala, Cameroun
          <br />
          <a href="mailto:clynlouisin@gmail.com">clynlouisin@gmail.com</a>
        </p>
      </section>
      <section>
        <h2>Directeur de la publication</h2>
        <p>Charles Louisin Yimbne.</p>
      </section>
      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Les textes, le logo MBOKO CODE et le code de ce site appartiennent à leur auteur. Les marques et visuels des
          projets présentés restent la propriété de leurs titulaires. Toute reproduction nécessite une autorisation écrite.
        </p>
      </section>
    </LegalPage>
  );
}
