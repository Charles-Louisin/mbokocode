import type { ApiErrorBody, ApiErrorCode } from "./types";

const DEFAULT_TIMEOUT_MS = 8000;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string,
    readonly fieldErrors?: Record<string, string[] | undefined>,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function apiBaseUrl(): string {
  // Dans le navigateur : même origine, relayée vers l'API par next.config (cookies de session inclus).
  if (typeof window !== "undefined") return "/api/v1";
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL n'est pas défini.");
  return base.replace(/\/$/, "");
}

type ApiRequestInit = Omit<RequestInit, "body"> & {
  body?: unknown;
  timeoutMs?: number;
};

/**
 * Client unique vers l'API Express : URL de base configurable, cookies de session inclus,
 * délai maximal et erreurs normalisées en `ApiError`.
 */
export async function apiFetch<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const { body, timeoutMs = DEFAULT_TIMEOUT_MS, headers, signal, ...rest } = init;
  const timeout = AbortSignal.timeout(timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl()}${path}`, {
      ...rest,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
  } catch (err) {
    if (timeout.aborted) {
      throw new ApiError(0, "TIMEOUT", "Le serveur met trop de temps à répondre. Réessaie dans un instant.");
    }
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError(0, "NETWORK_ERROR", "Impossible de joindre le serveur. Vérifie ta connexion.");
  }

  const payload: unknown = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const error = (payload as ApiErrorBody | null)?.error;
    throw new ApiError(
      response.status,
      error?.code ?? "INTERNAL_ERROR",
      error?.message ?? "Une erreur inattendue est survenue.",
      error?.fieldErrors,
      (payload as ApiErrorBody | null)?.requestId,
    );
  }

  return payload as T;
}
