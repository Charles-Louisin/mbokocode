import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Tests unitaires du site (logique pure de src/lib). L'API a sa propre suite dans /backend.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
