"use client";

import { Activity, ArrowLeft, Briefcase, FileText, LayoutDashboard, type LucideIcon, MessageSquareQuote, Settings, Sparkles, Tags, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError } from "@/src/lib/api/client";
import type { SessionUser } from "@/src/lib/api/types";
import { getMe } from "@/src/lib/auth";
import { ContentSection, SettingsSection } from "./SettingsSection";
import { ActivitySection, UsersSection } from "./PeopleSection";
import { OverviewSection } from "./OverviewSection";
import { PricingSection, ServicesSection } from "./OffersSection";
import { ProjectsSection } from "./ProjectsSection";
import { ReviewsSection } from "./ReviewsSection";

export type AdminTab = "overview" | "reviews" | "projects" | "pricing" | "services" | "settings" | "content" | "users" | "activity";

const TABS: { id: AdminTab; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "reviews", label: "Avis", icon: MessageSquareQuote },
  { id: "projects", label: "Projets", icon: Briefcase },
  { id: "pricing", label: "Offres", icon: Tags },
  { id: "services", label: "Savoir-faire", icon: Sparkles },
  { id: "content", label: "Contenu", icon: FileText },
  { id: "settings", label: "Réglages", icon: Settings },
  { id: "users", label: "Comptes", icon: Users },
  { id: "activity", label: "Journal", icon: Activity },
];

const isTab = (value: string): value is AdminTab => TABS.some((tab) => tab.id === value);

type Access = { state: "loading" } | { state: "denied" } | { state: "error"; message: string } | { state: "ready"; user: SessionUser };

// Tableau de bord. L'accès est vérifié par l'API à chaque requête (requireAdmin) ;
// cette page ne fait qu'éviter d'afficher une interface vide à qui n'y a pas droit.
export function AdminApp() {
  const [access, setAccess] = useState<Access>({ state: "loading" });
  const [tab, setTab] = useState<AdminTab>("overview");

  useEffect(() => {
    let active = true;
    const fromHash = window.location.hash.slice(1);
    if (isTab(fromHash)) requestAnimationFrame(() => setTab(fromHash));
    getMe()
      .then((user) => {
        if (!active) return;
        if (!user) window.location.replace("/connexion?next=/admin");
        else setAccess(user.isAdmin ? { state: "ready", user } : { state: "denied" });
      })
      .catch((err) => active && setAccess({ state: "error", message: err instanceof ApiError ? err.message : "Connexion à l'API impossible." }));
    return () => {
      active = false;
    };
  }, []);

  const go = (next: AdminTab) => {
    setTab(next);
    history.replaceState(null, "", `#${next}`);
    window.scrollTo({ top: 0 });
  };

  if (access.state === "loading") return <div aria-busy className="h-96 animate-pulse rounded-(--radius) bg-bg-raised" />;
  if (access.state === "error") return <p role="alert" className="rounded-(--radius) border hairline p-6 text-fg-muted">{access.message}</p>;
  if (access.state === "denied") {
    return (
      <div className="rounded-(--radius) border hairline p-8">
        <p className="text-lead font-medium">Accès réservé à l&apos;administrateur.</p>
        <p className="mt-2 text-fg-muted">Ton compte est bien connecté, mais il n&apos;a pas les droits d&apos;administration.</p>
        <Link href="/compte" className="link-draw mt-6 inline-flex items-center gap-2 font-medium">
          <ArrowLeft aria-hidden className="size-4" />
          Retour à mon espace
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[15rem_1fr]">
      <nav aria-label="Sections du tableau de bord" className="min-w-0 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
        <p className="label mb-3 hidden text-fg-subtle lg:block">Connecté : {access.user.email}</p>
        <ul className="-mx-(--gutter) flex gap-1.5 overflow-x-auto px-(--gutter) pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <li key={id} className="shrink-0">
              <button
                type="button"
                onClick={() => go(id)}
                aria-current={tab === id ? "page" : undefined}
                className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-left text-sm font-medium text-fg-muted transition-colors hover:bg-bg-raised hover:text-fg aria-[current=page]:bg-cobalt/15 aria-[current=page]:text-fg"
              >
                <Icon aria-hidden className="size-4" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="min-w-0">
        {tab === "overview" && <OverviewSection go={go} />}
        {tab === "reviews" && <ReviewsSection />}
        {tab === "projects" && <ProjectsSection />}
        {tab === "pricing" && <PricingSection />}
        {tab === "services" && <ServicesSection />}
        {tab === "content" && <ContentSection />}
        {tab === "settings" && <SettingsSection />}
        {tab === "users" && <UsersSection />}
        {tab === "activity" && <ActivitySection />}
      </div>
    </div>
  );
}
