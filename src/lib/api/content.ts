import { cacheLife, cacheTag } from "next/cache";
import { apiFetch } from "./client";
import type { ApiItem, PricingPackage, Project, ProjectSummary, ReviewList, Service, SiteContent, SiteSettings } from "./types";

// Lectures publiques mises en cache. Un succès reste en cache une heure ; un échec
// (API arrêtée, base indisponible) n'est gardé que quelques secondes pour réessayer vite.
// Les tags serviront à l'admin pour invalider le cache après une modification.

export type Result<T> = { ok: true; data: T } | { ok: false; notFound?: boolean };

async function read<T>(path: string, tag: string): Promise<Result<T>> {
  try {
    const body = await apiFetch<ApiItem<T>>(path, { timeoutMs: 5000 });
    cacheLife("hours");
    cacheTag(tag);
    return { ok: true, data: body.data };
  } catch (err) {
    cacheLife("seconds");
    return { ok: false, notFound: (err as { status?: number }).status === 404 };
  }
}

export async function getProjects(): Promise<Result<ProjectSummary[]>> {
  "use cache";
  return read<ProjectSummary[]>("/projects?limit=50", "projects");
}

export async function getProject(slug: string): Promise<Result<Project>> {
  "use cache";
  return read<Project>(`/projects/${encodeURIComponent(slug)}`, `project-${slug}`);
}

export async function getPricing(): Promise<Result<PricingPackage[]>> {
  "use cache";
  return read<PricingPackage[]>("/pricing", "pricing");
}

export async function getServices(): Promise<Result<Service[]>> {
  "use cache";
  return read<Service[]>("/services", "services");
}

export async function getContent(): Promise<Result<SiteContent>> {
  "use cache";
  return read<SiteContent>("/content", "content");
}

export async function getSettings(): Promise<Result<SiteSettings>> {
  "use cache";
  return read<SiteSettings>("/settings", "settings");
}

/** Avis approuvés. Cache court : un avis approuvé apparaît en quelques minutes. */
export async function getReviews(limit = 12): Promise<Result<ReviewList>> {
  "use cache";
  try {
    const body = await apiFetch<ReviewList>(`/reviews?limit=${limit}`, { timeoutMs: 5000 });
    cacheLife("minutes");
    cacheTag("reviews");
    return { ok: true, data: body };
  } catch {
    cacheLife("seconds");
    return { ok: false };
  }
}
