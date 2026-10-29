import type { Metadata } from "next";
import { AdminApp } from "@/src/components/admin/AdminApp";

export const metadata: Metadata = {
  title: "Tableau de bord",
  robots: { index: false, follow: false },
};

// Tableau de bord, invisible dans la navigation publique. Les droits sont vérifiés par l'API.
export default function AdminPage() {
  return (
    <div className="shell pb-24 pt-[calc(var(--header-h)+2.5rem)]">
      <h1 className="text-[clamp(2rem,4vw,3.2rem)] font-semibold tracking-[-0.03em]">Tableau de bord</h1>
      <div className="mt-10">
        <AdminApp />
      </div>
    </div>
  );
}
