import type { Metadata } from "next";
import { AccountView } from "@/src/components/account/AccountView";
import { SplitLines } from "@/src/components/motion/SplitLines";

export const metadata: Metadata = {
  title: "Mon espace",
  description: "Ton espace MBOKO CODE : ton avis et son état de relecture.",
  robots: { index: false, follow: false },
};

// Mon espace — la session se vérifie côté API ; sans session, retour vers /connexion.
export default function AccountPage() {
  return (
    <div className="shell pb-24 pt-[calc(var(--header-h)+3rem)] md:pb-36">
      <SplitLines as="h1" mode="intro" className="text-mega font-semibold" lines={["Mon espace."]} />
      <div className="intro-fade mt-16 border-t hairline pt-12" style={{ "--intro-delay": "400ms" } as React.CSSProperties}>
        <AccountView />
      </div>
    </div>
  );
}
