import type { Metadata } from "next";
import { LegalPage } from "@/src/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: "Quelles données sont collectées sur ce site, pourquoi, combien de temps, et comment exercer tes droits.",
  alternates: { canonical: "/confidentialite" },
};

// Texte à faire relire selon le droit applicable (Cameroun et pays des clients visés).
export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Confidentialité" title="Tes données, simplement." updated="29 octobre 2026">
      <section>
        <h2>Qui est responsable</h2>
        <p>
          Charles Louisin Yimbne, qui exerce sous le nom MBOKO CODE, basé à Douala (Cameroun). Contact :{" "}
          <a href="mailto:clynlouisin@gmail.com">clynlouisin@gmail.com</a>.
        </p>
      </section>
      <section>
        <h2>Ce qui est collecté</h2>
        <p>
          Quand tu me contactes, ton message part depuis ta propre messagerie (WhatsApp ou e-mail) : le site ne
          l&apos;enregistre pas. Je reçois ce que tu choisis d&apos;y écrire.
        </p>
        <p className="mt-3">Si tu crées un compte pour laisser un avis :</p>
        <ul>
          <li>ton nom et ton adresse e-mail (et ta photo de profil si tu passes par Google) ;</li>
          <li>les informations techniques de ta session (date de connexion, navigateur) ;</li>
          <li>ton avis : la note, le texte, le nom et la fonction que tu choisis d&apos;afficher, et la date de ton accord de publication.</li>
        </ul>
        <p className="mt-3">
          Un cookie de session, indispensable à la connexion, est déposé uniquement si tu te connectes. Ce site ne dépose
          pas de cookie publicitaire et n&apos;utilise pas d&apos;outil de mesure d&apos;audience à ce jour.
        </p>
      </section>
      <section>
        <h2>Pourquoi</h2>
        <p>Pour répondre à ta demande, préparer une proposition si tu le souhaites, et publier ton avis si tu en laisses un. Rien d&apos;autre : pas de revente, pas de prospection non sollicitée.</p>
      </section>
      <section>
        <h2>Prestataires</h2>
        <p>
          Les comptes et les avis sont enregistrés dans une base de données MongoDB Atlas. La connexion passe par Google si tu le choisis. Les e-mails (liens de connexion,
          notifications) passent par Resend. Le site et son API sont hébergés
          chez des prestataires techniques qui n&apos;exploitent pas ces données pour leur compte. WhatsApp n&apos;est utilisé
          que si tu choisis toi-même d&apos;y envoyer un message.
        </p>
      </section>
      <section>
        <h2>Combien de temps</h2>
        <p>
          Les échanges sont conservés le temps nécessaire au suivi de ta demande, puis au plus trois ans après le dernier
          contact s&apos;ils n&apos;ont pas débouché sur une collaboration. Ton compte et ton avis restent tant que tu ne
          les supprimes pas : tu peux le faire toi-même, à tout moment, depuis ton espace.
        </p>
      </section>
      <section>
        <h2>Tes droits</h2>
        <p>
          Tu peux demander à consulter, corriger ou supprimer tes données à tout moment en écrivant à{" "}
          <a href="mailto:clynlouisin@gmail.com">clynlouisin@gmail.com</a>. Je réponds dans un délai d&apos;un mois maximum.
        </p>
      </section>
    </LegalPage>
  );
}
