"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Pages outils (tableau de bord, connexion) : sans pied de page ni actions flottantes. */
export const BARE_ROUTES = ["/admin", "/connexion"];

export const isBareRoute = (pathname: string) => BARE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

// N'affiche ses enfants (rendus côté serveur) que hors des pages outils.
export function RouteGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return isBareRoute(pathname) ? null : children;
}
