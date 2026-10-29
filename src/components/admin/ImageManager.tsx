"use client";

import { ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { useId, useRef, useState } from "react";
import { useFeedback } from "@/src/components/ui/Feedback";
import type { Media } from "@/src/lib/api/types";
import { useUploadThing } from "@/src/lib/uploads";

export type AdminMedia = Media & { fileKey?: string };

type Props = {
  cover: AdminMedia | null;
  gallery: AdminMedia[];
  onChange: (next: { cover: AdminMedia | null; gallery: AdminMedia[] }) => void;
  /** Texte alternatif proposé pour les nouvelles images. */
  defaultAlt: string;
};

/** Dimensions réelles d'un fichier image, lues dans le navigateur avant l'envoi. */
function readSize(file: File): Promise<{ width?: number; height?: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({});
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

// Images d'un projet : couverture + galerie, toutes visibles. Envoi via UploadThing avec progression,
// texte alternatif modifiable, choix de la couverture et retrait (le fichier est supprimé à l'enregistrement).
export function ImageManager({ cover, gallery, onChange, defaultAlt }: Props) {
  const inputId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const { toast } = useFeedback();
  const { startUpload, isUploading } = useUploadThing("projectImage", {
    onUploadProgress: setProgress,
    onUploadError: (err) => {
      setError(err.message || "L'envoi a échoué.");
      toast("error", err.message || "L'envoi de l'image a échoué.");
    },
  });

  const all: { media: AdminMedia; isCover: boolean }[] = [...(cover ? [{ media: cover, isCover: true }] : []), ...gallery.map((media) => ({ media, isCover: false }))];

  const upload = async (files: File[]) => {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (images.length === 0) return;
    if (images.some((file) => file.size > 4 * 1024 * 1024)) {
      setError("Chaque image doit faire 4 Mo au maximum.");
      toast("error", "Chaque image doit faire 4 Mo au maximum.");
      return;
    }
    setError(null);
    setProgress(0);
    const sizes = await Promise.all(images.map(readSize));
    const result = await startUpload(images);
    if (!result) return;
    const added: AdminMedia[] = result.map((file, index) => ({
      url: file.serverData.url,
      fileKey: file.serverData.key,
      alt: defaultAlt,
      ...sizes[index],
    }));
    // Sans couverture, la première image envoyée le devient.
    if (!cover) onChange({ cover: added[0] ?? null, gallery: [...gallery, ...added.slice(1)] });
    else onChange({ cover, gallery: [...gallery, ...added] });
    toast("success", `${added.length} image${added.length > 1 ? "s" : ""} envoyée${added.length > 1 ? "s" : ""}. Pense à enregistrer le projet.`);
  };

  const remove = (target: AdminMedia) => {
    if (cover && target.url === cover.url) onChange({ cover: gallery[0] ?? null, gallery: gallery.slice(1) });
    else onChange({ cover, gallery: gallery.filter((item) => item.url !== target.url) });
  };

  const makeCover = (target: AdminMedia) => {
    const rest = gallery.filter((item) => item.url !== target.url);
    onChange({ cover: target, gallery: cover ? [cover, ...rest] : rest });
  };

  const setAlt = (target: AdminMedia, alt: string) => {
    if (cover && target.url === cover.url) onChange({ cover: { ...cover, alt }, gallery });
    else onChange({ cover, gallery: gallery.map((item) => (item.url === target.url ? { ...item, alt } : item)) });
  };

  return (
    <div className="space-y-4">
      {all.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {all.map(({ media, isCover }) => (
            <li key={media.url} className={`overflow-hidden rounded-xl border ${isCover ? "border-cobalt-soft" : "hairline"}`}>
              <div className="relative aspect-[4/3] bg-bg-raised">
                {/* Aperçu brut : fichiers locaux et UploadThing confondus. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={media.url} alt="" className="size-full object-cover" />
                {isCover && <span className="absolute left-2 top-2 rounded-full bg-cobalt px-2 py-0.5 text-xs font-semibold text-ivory">Couverture</span>}
                <div className="absolute right-2 top-2 flex gap-1.5">
                  {!isCover && (
                    <button type="button" onClick={() => makeCover(media)} aria-label="Utiliser comme couverture" className="flex size-9 items-center justify-center rounded-full bg-ink/80 text-ivory backdrop-blur">
                      <Star aria-hidden className="size-4" />
                    </button>
                  )}
                  <button type="button" onClick={() => remove(media)} aria-label="Retirer l'image" className="flex size-9 items-center justify-center rounded-full bg-ink/80 text-danger backdrop-blur">
                    <Trash2 aria-hidden className="size-4" />
                  </button>
                </div>
              </div>
              <label className="block p-2">
                <span className="sr-only">Texte alternatif</span>
                <input
                  value={media.alt}
                  onChange={(event) => setAlt(media, event.target.value)}
                  placeholder="Description de l'image"
                  className="w-full rounded-lg border hairline bg-transparent px-2.5 py-1.5 text-sm outline-none focus:border-cobalt-soft"
                />
              </label>
            </li>
          ))}
        </ul>
      )}

      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void upload([...event.dataTransfer.files]);
        }}
        className={`flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
          dragging ? "border-cobalt-soft bg-cobalt/10" : "hairline hover:border-fg-subtle"
        } ${isUploading ? "pointer-events-none" : ""}`}
      >
        {isUploading ? (
          <>
            <Loader2 aria-hidden className="size-6 animate-spin text-cobalt-soft" />
            <span className="font-medium">Envoi en cours… {progress}%</span>
            <span className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-fg/10">
              <span className="block h-full bg-cobalt-soft transition-[width] duration-200" style={{ width: `${progress}%` }} />
            </span>
          </>
        ) : (
          <>
            <ImagePlus aria-hidden className="size-6 text-cobalt-soft" />
            <span className="font-medium">Ajouter des images</span>
            <span className="text-sm text-fg-subtle">Glisse-les ici ou touche pour choisir · 4 Mo max par image</span>
          </>
        )}
        <input
          ref={input}
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(event) => {
            void upload([...(event.target.files ?? [])]);
            event.target.value = "";
          }}
        />
      </label>
      <p aria-live="polite" className="text-sm text-danger">
        {error}
      </p>
    </div>
  );
}
