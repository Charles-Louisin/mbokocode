# MBOKO CODE — portfolio de Charles

Portfolio professionnel de Charles Louisin Yimbne, développeur full-stack et fondateur de MBOKO CODE.
La référence fonctionnelle est [`CAHIER_DES_CHARGES_PORTFOLIO_CHARLES_MBOKO_CODE.md`](CAHIER_DES_CHARGES_PORTFOLIO_CHARLES_MBOKO_CODE.md).

> Refonte en cours, par phases. Phases 1 à 4 terminées (socle, pages publiques, conversion et
> automatisations, authentification et avis). Prochaine étape : phase 5 (administration).

## Architecture

| Dossier     | Rôle                                                                     |
| ----------- | ------------------------------------------------------------------------ |
| `/` (racine) | Next.js 16 App Router : pages publiques, rendu, SEO                      |
| `/backend`  | API métier Express 5 + TypeScript, MongoDB (Mongoose), préfixe `/api/v1` |

Le frontend appelle l'API via le client unique [`src/lib/api/client.ts`](src/lib/api/client.ts)
(`credentials: "include"`, timeout, erreurs normalisées). Aucune logique métier ni accès MongoDB dans Next.js.

## Démarrer en local

```bash
npm install
npm --prefix backend install
cp .env.example .env.local
cp backend/.env.example backend/.env   # renseigner MONGODB_URI (Atlas)
npm run backend:seed                   # importe projets, offres et réglages (idempotent)
npm run backend:dev                    # API sur http://localhost:5000/api/v1
npm run dev                            # site sur http://localhost:3000
```

Sans Atlas, `npm run backend:local` démarre l'API avec une base MongoDB **en mémoire**, déjà remplie
avec le contenu initial (le premier lancement télécharge le binaire MongoDB, ~780 Mo, une seule fois).
Les données disparaissent à l'arrêt.

## Design system

Tout est décrit en tête de [`app/globals.css`](app/globals.css) : surfaces encre / ivoire, accent cobalt,
Inter Tight + Instrument Serif (mots d'accent) + JetBrains Mono (méta-données), échelle typographique
(`text-mega`, `text-display`, `text-title`, `text-lead`, `label`).

Grammaire de mouvement commune à toutes les pages :
- `SplitLines` : titres découpés en lignes qui montent de sous leur ligne de base (CSS au chargement pour
  les héros, `animation-timeline: view()` au scroll ailleurs) ;
- `data-reveal` : apparition au scroll en CSS pur, sans JavaScript ;
- GSAP ScrollTrigger (`useScrollScene`) pour les scènes liées au scroll : ligne de méthode, manifeste
  mot à mot, couverture des études de cas, portrait ;
- Motion pour les micro-interactions : menu, filtres, aperçu des projets au survol, formulaire, Lab.

Tout respecte `prefers-reduced-motion` ; sans support navigateur, le contenu s'affiche simplement.

Chaque page a sa propre expérience : accueil (titre-signature avec portrait en pastille, index des
projets avec aperçu au survol), projets (grille éditoriale ou liste, filtre dans l'URL), étude de cas
(couverture qui s'ouvre, sommaire épinglé), services (cartes empilées), tarifs (surface ivoire),
à propos (portrait épinglé), lab (mini-jeu jouable au clavier), contact (brief en chips).

## Scripts

| Racine                 | Rôle                                                  |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev` / `build` / `start` | Frontend Next.js                           |
| `npm run lint` / `typecheck`      | Contrôles du frontend                      |
| `npm run backend:dev`  | API en mode watch                                     |
| `npm run backend:test` | Tests Vitest + Supertest de l'API                     |
| `npm run backend:seed` | Import du contenu initial dans MongoDB                |
| `npm run backend:local` | API + base MongoDB en mémoire déjà remplie (dev)   |
| `npm run check`        | Lint, typecheck (front + API) et tests de l'API       |

Dans `/backend` : `dev`, `build`, `start`, `typecheck`, `test`, `seed`.

## API — endpoints disponibles

Toutes les réponses d'erreur ont la forme `{ "error": { "code", "message", "fieldErrors?" }, "requestId" }`.

| Méthode | Route                      | Description                                             |
| ------- | -------------------------- | ------------------------------------------------------- |
| GET     | `/api/v1/health`           | Statut simple, sans détail de configuration             |
| GET     | `/api/v1/ready`            | 200 si MongoDB est connecté, sinon 503                  |
| GET     | `/api/v1/projects`         | Projets publics — `category`, `featured`, `page`, `limit` |
| GET     | `/api/v1/projects/:slug`   | Étude de cas (projets `public` ou `unlisted`)           |
| GET     | `/api/v1/services`         | Services publiés                                        |
| GET     | `/api/v1/pricing`          | Offres publiées (montants en centimes)                  |
| GET     | `/api/v1/settings`         | Réglages éditoriaux publics                             |
| POST    | `/api/v1/leads`            | Demande de projet (5 envois / 15 min / IP), idempotente par `submissionId` |
| GET     | `/api/v1/reviews`          | Avis approuvés, paginés, avec note moyenne               |
| GET     | `/api/v1/reviews/me`       | Avis du compte connecté (session requise)               |
| POST    | `/api/v1/reviews`          | Nouvel avis, toujours `pending` (session requise)      |
| PATCH   | `/api/v1/reviews/:id`      | Modifier son avis : repasse en relecture                |
| DELETE  | `/api/v1/reviews/:id`      | Supprimer son avis                                       |
| GET     | `/api/v1/me`               | Profil du compte connecté et statut admin calculé       |
| GET     | `/api/v1/auth/providers`   | Méthodes de connexion réellement disponibles            |
| GET     | `/api/v1/admin/reviews`    | Admin : avis par statut                                  |
| PATCH   | `/api/v1/admin/reviews/:id/status` | Admin : approuver, rejeter, masquer (journalisé) |
| PATCH   | `/api/v1/admin/reviews/:id/verification` | Admin : badge client vérifié, justification obligatoire |
| *       | `/api/auth/*`              | Better Auth (Google, lien e-mail, session, suppression du compte) |

## Conversion et automatisations (phase 3)

**Demande de projet** — « Et le tien ? » sur l'accueil, puis le brief en quatre étapes de
[/contact](app/contact/page.tsx) (projet, modules, délai, envoi). Le visiteur envoie lui-même le brief déjà
rédigé par WhatsApp ou par e-mail ([src/lib/project-brief.ts](src/lib/project-brief.ts)).
Le site n'enregistre rien. L'endpoint `POST /api/v1/leads` reste disponible côté API mais n'est plus utilisé
par l'interface.

**WhatsApp** — numéro lu dans les réglages du site (`whatsappNumber`), sinon `NEXT_PUBLIC_WHATSAPP_NUMBER`.
Lien officiel `https://wa.me/<chiffres>?text=<message encodé>` ([src/lib/whatsapp.ts](src/lib/whatsapp.ts)).
Le message n'est jamais envoyé automatiquement : WhatsApp s'ouvre et l'utilisateur l'envoie.

## Authentification et avis (phase 4)

**Connexion** — Better Auth dans l'API Express ([backend/src/modules/auth](backend/src/modules/auth)), stocké dans
MongoDB. Google si `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` sont fournis, et lien de connexion à usage
unique (10 min) envoyé par Resend. Pas de mot de passe. Le site relaie `/api/auth` et `/api/v1` vers l'API
([next.config.ts](next.config.ts)) : le cookie de session est HttpOnly et « first-party ». Côté API,
`BETTER_AUTH_URL` doit donc être l'URL du site. En local sans Resend, le lien s'affiche dans le terminal de l'API.

**Admin** — jamais choisi par le navigateur : un compte est admin si son e-mail est vérifié et figure dans
`ADMIN_EMAILS`, recalculé à chaque requête.

**Avis** — un avis par compte (index unique), note 1–5, 30 à 1 200 caractères, accord de publication daté.
Tout avis créé ou modifié est `pending` et invisible jusqu'à approbation ; Charles reçoit une notification.
Le badge « Client vérifié » ne se pose que par l'admin, avec une justification. L'auteur gère son avis depuis
[/compte](app/compte/page.tsx) et peut supprimer son compte (son avis part avec). Pages : [/avis](app/avis/page.tsx),
[/connexion](app/connexion/page.tsx), section sur l'accueil (une ligne discrète tant qu'aucun avis n'est publié).
L'interface de modération arrive avec la phase 5 ; d'ici là, les routes `/api/v1/admin/reviews` sont prêtes.

## Variables d'environnement

- Frontend : [`.env.example`](.env.example). Seules les variables `NEXT_PUBLIC_*` non sensibles.
- API : [`backend/.env.example`](backend/.env.example), validées par Zod au démarrage
  ([`backend/src/config/env.ts`](backend/src/config/env.ts)). En production, une variable requise manquante
  arrête le serveur avec le nom de la variable, jamais sa valeur.

### UploadThing et `UPLOADTHING8TOKEN`

Le SDK UploadThing lit `UPLOADTHING_TOKEN`. Le point d'entrée [`backend/src/bootstrap.ts`](backend/src/bootstrap.ts)
copie `UPLOADTHING8TOKEN` (prioritaire) vers `UPLOADTHING_TOKEN` avant de charger l'application.
Au démarrage, le log indique seulement « UploadThing configuré / non configuré ».

## Sécurité en place

Helmet, CORS en liste blanche (`ALLOWED_ORIGINS`), limite de débit globale sur `/api/v1`, corps JSON limité à 100 ko,
`sanitizeFilter` Mongoose et filtres construits explicitement, query strings validées en mode strict,
logs Pino sans en-têtes ni corps (cookies, jetons et données personnelles masqués).

## Reste à configurer par le propriétaire

- `MONGODB_URI` dans `backend/.env` (Atlas) puis `npm run backend:seed`.
- Resend : vérifier le domaine expéditeur (SPF, DKIM), renseigner `EMAIL_FROM` et le destinataire des
  notifications (`ADMIN_NOTIFICATION_EMAIL`, ou la première adresse d'`ADMIN_EMAILS`).
- Numéro WhatsApp (format international, chiffres uniquement).
- `BETTER_AUTH_SECRET` (32 caractères aléatoires minimum) et `BETTER_AUTH_URL` = URL du site.
- Identifiants Google OAuth ; URI de redirection : `<URL du site>/api/auth/callback/google`.
- Token UploadThing, URL de production du site et de l'API.
