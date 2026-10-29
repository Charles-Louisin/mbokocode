"use client";

import { useState } from "react";
import { useFeedback } from "@/src/components/ui/Feedback";
import { refreshPublicCache } from "@/src/lib/admin-actions";
import { ApiError, apiFetch } from "@/src/lib/api/client";
import type { ApiItem } from "@/src/lib/api/types";

export type FieldErrors = Record<string, string | undefined>;

/**
 * Enregistrement d'une ressource admin : appel PATCH/POST, erreurs sous les champs, toast de succès
 * ou d'échec, puis rafraîchissement du cache public pour que le site affiche aussitôt la base.
 */
export function useSave<T>() {
  const { toast } = useFeedback();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const save = async (path: string, body: unknown, tags: string[], method: "PATCH" | "POST" = "PATCH", success = "Modifications enregistrées."): Promise<T | null> => {
    setSaving(true);
    setErrors({});
    try {
      const result = await apiFetch<ApiItem<T>>(path, { method, body });
      const refreshed = await refreshPublicCache(tags).catch(() => false);
      toast("success", refreshed ? `${success} Le site est à jour.` : `${success} Le site se mettra à jour sous peu.`);
      return result.data;
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(Object.fromEntries(Object.entries(err.fieldErrors ?? {}).map(([key, value]) => [key, value?.[0]])));
        toast("error", err.message);
      } else {
        toast("error", "L'enregistrement a échoué. Réessaie.");
      }
      return null;
    } finally {
      setSaving(false);
    }
  };

  return { save, saving, errors };
}
