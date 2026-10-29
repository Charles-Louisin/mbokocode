import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { Suspense } from "react";
import { FloatingActionsLoader } from "@/src/components/layout/FloatingActionsLoader";
import { RouteGate } from "@/src/components/layout/RouteGate";
import { SiteFooter } from "@/src/components/layout/SiteFooter";
import { SiteHeader } from "@/src/components/layout/SiteHeader";
import { introScript, SiteIntro } from "@/src/components/layout/SiteIntro";
import { FeedbackProvider } from "@/src/components/ui/Feedback";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/src/lib/site";
import "./globals.css";

// Archivo variable : l'axe de largeur sert aux titres étendus (wdth 125).
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"], display: "swap" });

const siteTitle = `${SITE_NAME} — Charles, développeur full-stack`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: siteTitle, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: siteTitle,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    url: SITE_URL,
    locale: "fr_FR",
    type: "website",
  },
  // og:image vient de app/opengraph-image.tsx ; X retombe sur og:image faute de twitter:image.
  twitter: { card: "summary_large_image", title: siteTitle, description: SITE_DESCRIPTION },
};

export const viewport: Viewport = {
  themeColor: "#0b1326",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${archivo.variable} antialiased`}
      // Le script d'entrée pose data-intro avant l'hydratation : attribut volontairement différent du rendu serveur.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <SiteIntro />
        <a
          href="#contenu"
          className="sr-only z-60 rounded-full bg-ivory px-5 py-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Aller au contenu
        </a>
        <FeedbackProvider>
        <SiteHeader />
        <main id="contenu">{children}</main>
        <RouteGate>
          <SiteFooter />
          <Suspense fallback={null}>
            <FloatingActionsLoader />
          </Suspense>
        </RouteGate>
        </FeedbackProvider>
      </body>
    </html>
  );
}
