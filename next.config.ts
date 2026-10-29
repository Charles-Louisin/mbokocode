import type { NextConfig } from "next";

// Origine de l'API Express. Le navigateur passe par le site (/api/auth, /api/v1) : les cookies de
// session restent « first-party » et aucune requête cross-site n'est nécessaire.
const apiOrigin = (process.env.API_ORIGIN ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  // Images de projets envoyées via UploadThing.
  images: { remotePatterns: [{ protocol: "https", hostname: "*.ufs.sh" }, { protocol: "https", hostname: "utfs.io" }] },
  async rewrites() {
    if (!apiOrigin) return [];
    return [
      { source: "/api/auth/:path*", destination: `${apiOrigin}/api/auth/:path*` },
      { source: "/api/v1/:path*", destination: `${apiOrigin}/api/v1/:path*` },
      { source: "/api/uploadthing", destination: `${apiOrigin}/api/uploadthing` },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
