import { ApiError, apiFetch } from "./api/client";
import type { ApiItem, AuthProviders, SessionUser } from "./api/types";

// Appels de connexion depuis le navigateur. Better Auth répond sous /api/auth (relayé vers l'API
// Express par next.config) ; le cookie de session est HttpOnly et n'est jamais lu en JavaScript.

/** Chemin de retour interne uniquement : « /compte » oui, « //site.com » ou une URL absolue non. */
export function safeNext(value: string | null | undefined, fallback = "/compte"): string {
  return value && /^\/(?!\/)[\w\-./?=&#%]*$/.test(value) ? value : fallback;
}

async function authPost<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/auth${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Impossible de joindre le serveur. Vérifie ta connexion.");
  }
  const payload = (await response.json().catch(() => null)) as { message?: string; code?: string } | null;
  if (!response.ok) {
    if (response.status === 429) throw new ApiError(429, "RATE_LIMITED", "Trop de tentatives. Réessaie dans quelques minutes.");
    if (response.status === 503) throw new ApiError(503, "SERVICE_UNAVAILABLE", "La connexion est momentanément indisponible.");
    throw new ApiError(response.status, "BAD_REQUEST", "La demande n'a pas pu aboutir. Réessaie dans un instant.");
  }
  return payload as T;
}

export async function getProviders(): Promise<AuthProviders> {
  try {
    return (await apiFetch<ApiItem<AuthProviders>>("/auth/providers")).data;
  } catch {
    return { google: false, magicLink: false };
  }
}

/** Utilisateur connecté, ou null s'il n'y a pas de session. */
export async function getMe(): Promise<SessionUser | null> {
  try {
    return (await apiFetch<ApiItem<SessionUser>>("/me")).data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

export async function sendMagicLink(email: string, next: string) {
  try {
    return await authPost("/sign-in/magic-link", { email, callbackURL: next, errorCallbackURL: "/connexion?erreur=lien" });
  } catch (err) {
    // 500 : l'API n'a pas pu remettre l'e-mail au service d'envoi.
    if (err instanceof ApiError && err.status >= 500 && err.status !== 503) {
      throw new ApiError(err.status, "INTERNAL_ERROR", "L'e-mail de connexion n'a pas pu partir. Réessaie dans un instant, ou écris-moi si le problème continue.");
    }
    throw err;
  }
}

/** Redirige vers Google ; au retour, Better Auth renvoie sur `next`. */
export async function signInWithGoogle(next: string) {
  const { url } = await authPost<{ url?: string }>("/sign-in/social", {
    provider: "google",
    callbackURL: next,
    errorCallbackURL: "/connexion?erreur=google",
  });
  if (url) window.location.assign(url);
}

export function signOut() {
  return authPost("/sign-out", {});
}

export function deleteAccount() {
  return authPost("/delete-user", {});
}
