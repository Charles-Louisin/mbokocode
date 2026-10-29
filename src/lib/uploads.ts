"use client";

import { generateReactHelpers } from "@uploadthing/react";
import type { UploadRouter } from "./upload-router";

// Envois d'images : même origine (/api/uploadthing), relayée vers l'API qui vérifie le rôle admin.
export const { useUploadThing } = generateReactHelpers<UploadRouter>({ url: "/api/uploadthing" });
