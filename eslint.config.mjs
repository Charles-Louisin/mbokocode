import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // API Express : vérifiée par ses propres scripts dans /backend.
    "backend/**",
    // Copies brutes de Magic UI ajoutées pour référence, non importées : les versions adaptées
    // et utilisées sont dans src/components/magic.
    "src/components/magicui/**",
  ]),
]);

export default eslintConfig;
