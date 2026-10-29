import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_NAME } from "@/src/lib/site";

export const alt = `${SITE_NAME} — portfolio de Charles, développeur full-stack`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Lu au module scope : l'image ne dépend d'aucune donnée de requête.
const logo = await readFile(join(process.cwd(), "public/images/logo.jpeg"));
const logoSrc = `data:image/jpeg;base64,${logo.toString("base64")}`;

// Reprise plus courte de SITE_DESCRIPTION : sur la carte, le nom et le rôle sont déjà au-dessus.
const cardLine = "Applications web, mobiles et plateformes sur mesure, de l'idée à la mise en production.";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: "70px 80px",
          background: "#0b1326",
          color: "#e8ebf2",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og rend du Satori : seul <img> est compris, next/image y est inopérant. */}
        <img src={logoSrc} alt="" width={250} height={250} style={{ borderRadius: 30 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 720 }}>
          <div style={{ fontSize: 62, letterSpacing: -1 }}>{SITE_NAME}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 8, height: 38, background: "#2f54ff", display: "flex" }} />
            <div style={{ fontSize: 28, color: "#9db0ff" }}>Charles Louisin Yimbne — Développeur full-stack</div>
          </div>
          <div style={{ fontSize: 26, lineHeight: 1.5, color: "#6b7590" }}>{cardLine}</div>
        </div>
      </div>
    ),
    size,
  );
}
