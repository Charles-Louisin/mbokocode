@AGENTS.md

# Conventions du projet

- Référence produit : `CAHIER_DES_CHARGES_PORTFOLIO_CHARLES_MBOKO_CODE.md`. Travail par phases vérifiables (section 18).
- Marque : 100 % MBOKO CODE, activité de Charles en indépendant. Écrire à la première personne du singulier
  (« je »), jamais « nous » ni « l'équipe ».
- Ne jamais inventer de chiffre, client, témoignage, prix ou résultat. Le contenu validé vit dans MongoDB
  (`backend/src/scripts/seed-data.ts` pour l'import initial).
- Architecture : Next.js App Router à la racine, API métier Express dans `/backend` (préfixe `/api/v1`).
  Pas de logique métier, de secret ni d'accès MongoDB côté Next.js ; passer par `src/lib/api/client.ts`.
- Backend : ESM + `NodeNext` (imports relatifs en `.js`), Zod sur toute entrée, erreurs via `AppError`,
  format `{ error: { code, message, fieldErrors? }, requestId }`. Filtres Mongoose construits explicitement.
- Secrets uniquement dans `backend/.env`. Jamais de secret en `NEXT_PUBLIC_*`, dans les logs ou dans Git.
- Avant de rendre une phase : `npm run check`, `npm run build` et `npm --prefix backend run build`.
