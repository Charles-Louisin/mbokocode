"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, apiFetch } from "@/src/lib/api/client";
import type { PricingPackage, Project, Review, ReviewStatus, Service, SiteContent, SiteSettings } from "@/src/lib/api/types";

// Formes renvoyées par les routes /api/v1/admin (versions complètes, champs internes compris).

type Stamps = { createdAt: string; updatedAt: string };
export type AdminProject = Project & Stamps & { visibility: "public" | "unlisted" | "private" };
export type AdminPricing = PricingPackage & Stamps & { isPublished: boolean };
export type AdminService = Service & Stamps & { isPublished: boolean };
export type AdminSettings = SiteSettings;
export type AdminContent = SiteContent;
export type AdminReview = Omit<Review, "authorName"> & {
  authorNameSnapshot: string;
  authorEmail: string | null;
  status: ReviewStatus;
  moderationNote?: string;
  verification?: { note?: string; at?: string };
  createdAt: string;
  updatedAt: string;
};
export type AdminUser = { id: string; name: string | null; email: string; emailVerified: boolean; isAdmin: boolean; createdAt: string | null };
export type AdminActivity = { id: string; actorId: string; action: string; targetType: string; targetId: string; detail?: string; createdAt: string };
export type Overview = {
  reviews: Record<ReviewStatus, number>;
  projects: { total: number; public: number };
  offers: number;
  services: number;
  users: number;
  recentActivity: AdminActivity[];
};

/** Lecture d'une route admin, avec rechargement après modification. */
export function useAdminData<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    apiFetch<{ data: T }>(`/admin${path}`)
      .then((body) => {
        if (!active) return;
        setData(body.data);
        setError(null);
      })
      .catch((err) => active && setError(err instanceof ApiError ? err.message : "Chargement impossible."));
    return () => {
      active = false;
    };
  }, [path, version]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);
  return { data, error, reload, setData };
}

export const ACTION_LABELS: Record<string, string> = {
  "review.approved": "Avis approuvé",
  "review.rejected": "Avis rejeté",
  "review.hidden": "Avis masqué",
  "review.verify": "Client vérifié",
  "review.unverify": "Vérification retirée",
  "project.create": "Projet créé",
  "project.update": "Projet modifié",
  "project.delete": "Projet supprimé",
  "pricing.update": "Offre modifiée",
  "service.update": "Savoir-faire modifié",
  "settings.update": "Réglages modifiés",
  "content.update": "Contenu modifié",
};

const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });
export const formatDateTime = (value: string | null | undefined) => (value ? dateTime.format(new Date(value)) : "—");
