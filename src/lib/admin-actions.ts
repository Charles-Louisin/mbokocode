"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { apiBaseUrl } from "./api/client";

// Après une modification dans le tableau de bord, les pages publiques doivent refléter la base tout
// de suite. Cette action vide le cache des contenus concernés, après avoir vérifié auprès de l'API
// que la session est bien celle d'un admin. Aucune donnée n'est modifiée ici.

const ALLOWED = /^(projects|project-[a-z0-9-]{1,100}|pricing|services|settings|content|reviews)$/;

export async function refreshPublicCache(tags: string[]): Promise<boolean> {
  const cookieHeader = (await cookies()).toString();
  if (!cookieHeader) return false;
  try {
    const response = await fetch(`${apiBaseUrl()}/me`, { headers: { cookie: cookieHeader, accept: "application/json" }, cache: "no-store" });
    if (!response.ok) return false;
    const body = (await response.json()) as { data?: { isAdmin?: boolean } };
    if (!body.data?.isAdmin) return false;
  } catch {
    return false;
  }
  for (const tag of tags) if (ALLOWED.test(tag)) updateTag(tag);
  return true;
}
