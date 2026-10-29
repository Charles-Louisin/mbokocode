import { createUploadthing, type FileRouter } from "uploadthing/server";

// Miroir, pour le typage seulement, de la route d'upload de l'API Express (backend/src/modules/uploads).
// Importé en `import type` : rien de ce fichier n'est envoyé au navigateur.
const f = createUploadthing();
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- sert uniquement à dériver le type ci-dessous.
const router = {
  projectImage: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } }).onUploadComplete(() => ({ url: "", key: "", name: "" })),
} satisfies FileRouter;

export type UploadRouter = typeof router;
