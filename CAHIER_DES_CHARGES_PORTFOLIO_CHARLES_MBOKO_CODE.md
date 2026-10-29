# Cahier des charges maître — Portfolio professionnel de Charles / MBOKO CODE

**Document de référence pour Claude Code**  
**Langue de l'interface :** français au lancement, architecture prête pour une éventuelle version anglaise  
**Priorité :** crédibilité, conversion, expérience visuelle premium, automatisations fiables et sécurité  
**Architecture imposée :** Next.js à la racine + API Express.js dans `/backend` + MongoDB  
**Uploads :** UploadThing, variable fournie par le propriétaire `UPLOADTHING8TOKEN`

---

## 0. Instruction générale à Claude Code

Tu agis comme un **ingénieur logiciel senior full-stack, architecte, designer produit/UI-UX, spécialiste motion design, SEO technique, accessibilité, sécurité et conversion**. Tu dois transformer le dépôt existant en un portfolio professionnel complet, cohérent, opérationnel et maintenable.

### Règles non négociables

1. **Audite le dépôt avant toute modification.** Lis les fichiers de configuration, les routes, les dépendances, les composants, les variables d'environnement documentées et les tests. Identifie ce qui existe, ce qui fonctionne et ce qui doit être remplacé. Ne supprime pas de fonctionnalité existante sans raison documentée.
2. Crée d'abord un plan concret, puis avance par phases vérifiables. Ne tente pas de générer tout le projet en une seule modification massive.
3. **Ne simule jamais une fonctionnalité en la présentant comme réelle.** Pas de faux formulaires envoyés, de faux rendez-vous, de connexion factice, de faux avis, de faux chiffres d'audience ou de boutons décoratifs sans action.
4. Ne fabrique pas de témoignage, de client, de résultat commercial, de nombre d'utilisateurs, de durée d'expérience ou de statistique. Si une donnée manque, rends-la configurable dans l'admin ou marque-la comme contenu à compléter.
5. Utilise les versions stables et compatibles des outils au moment du développement. Consulte leurs documentations officielles avant une intégration sensible ou susceptible d'avoir changé. Ne réinstalle pas aveuglément les dépendances déjà adaptées au projet.
6. Tout secret reste côté serveur. Aucun secret ne doit être préfixé par `NEXT_PUBLIC_`, être exposé dans le HTML, être commité ou apparaître dans les logs.
7. Le backend métier reste dans le dossier **`/backend` à la racine**. Ne transforme pas Next.js en backend métier parallèle. Les Route Handlers Next.js peuvent uniquement servir aux besoins spécifiques du framework, par exemple UploadThing si ce choix est explicitement justifié ; l'architecture par défaut est l'API Express dédiée.
8. Le portfolio doit être responsive, accessible, rapide et compréhensible sans animations. L'esthétique ne justifie jamais une régression de performance ou d'accessibilité.
9. Toute modification doit être accompagnée des vérifications pertinentes : lint, typecheck, tests, build et essais manuels du parcours affecté.
10. Maintiens `README.md`, `.env.example`, les instructions locales, la documentation des API et les consignes de déploiement à jour.

### Livrables obligatoires

- Portfolio public responsive avec pages et composants documentés ci-dessous.
- API Express TypeScript dans `/backend`.
- Modèles MongoDB, validation serveur, index et gestion d'erreurs.
- Connexion sécurisée, autorisations admin et système d'avis modérés.
- UploadThing configuré pour les cas d'usage autorisés.
- Formulaire de qualification client, intégration WhatsApp et réservation via Cal.com.
- Notifications email transactionnelles via Resend.
- Tableau de bord privé pour gérer les contenus et les demandes.
- SEO technique, mesure d'événements, suivi d'erreurs, tests et documentation.
- Fichiers `.env.example` distincts si le frontend et le backend nécessitent des variables différentes, sans vraies valeurs secrètes.
- Liste explicite des éléments nécessitant une intervention humaine : identifiants OAuth, token UploadThing, compte Resend, compte Cal.com, domaine, numéro WhatsApp, URL de production.

---

## 1. Objectif du produit

Créer une vitrine professionnelle haut de gamme pour **Charles**, développeur full-stack et fondateur de **MBOKO CODE**. Le site doit montrer la capacité à comprendre un besoin métier, concevoir une expérience, développer une application web ou mobile, livrer un produit et en assurer l'évolution.

Le site doit servir quatre objectifs :

1. **Convaincre rapidement** un prospect que le développeur est sérieux et capable.
2. **Prouver les compétences** par des études de cas concrètes, pas seulement par des listes de technologies.
3. **Convertir** un visiteur en demande qualifiée, conversation WhatsApp ou rendez-vous réservé.
4. **Automatiser** la collecte des demandes, les notifications, la planification, les avis, les contenus et le suivi commercial.

### Publics principaux

- Entrepreneurs qui veulent concrétiser une idée de produit numérique.
- Petites entreprises qui cherchent un site web, une plateforme ou une application.
- Clients qui ont besoin d'améliorer, maintenir ou automatiser un produit existant.
- Recruteurs ou partenaires qui souhaitent comprendre rapidement les compétences et l'expérience.

### Proposition de valeur à travailler

Base éditoriale proposée, à améliorer selon le parcours réel :

> Je transforme les idées ambitieuses en produits numériques utiles. Je conçois et développe des applications web, mobiles et plateformes sur mesure, de la réflexion initiale à la mise en production.

Afficher clairement la relation entre **Charles, la personne**, et **MBOKO CODE, son activité professionnelle**. Ne pas laisser croire qu'il existe une grande équipe si le travail est réalisé en indépendant. Utiliser un ton assuré, humain, précis et sans promesses invérifiables.

### Priorité des actions principales

1. Parler d'un projet / démarrer une demande.
2. Voir les réalisations et leurs études de cas.
3. Réserver un appel.
4. Échanger via WhatsApp.
5. Consulter les services et tarifs.
6. Lire ou laisser un avis.
7. Découvrir les expériences du Lab et le contenu technique.

---

## 2. Direction artistique et expérience visuelle

### Ligne directrice

Créer un site **premium, éditorial, immersif, fluide, sobre et reconnaissable**, dont les animations démontrent le savoir-faire sans distraire de l'objectif commercial.

### À privilégier

- Composition éditoriale et hiérarchie typographique évidente.
- Typographie de caractère, tailles responsives et lignes de texte confortables.
- Espaces généreux, grille cohérente et alignements rigoureux.
- Palette courte : charbon / encre ou blanc chaud / ivoire, gris nuancés et une seule couleur d'accent choisie après étude du logo et des projets.
- Cartes et blocs simples, bordures subtiles et ombres discrètes si utiles.
- Illustrations, mockups et vidéos issus des vrais projets plutôt que d'images décoratives sans rapport.
- Micro-interactions soignées : focus, hover, clic, chargement, succès et erreur.
- Visuels de projets présentés avec des proportions et recadrages maîtrisés.
- Navigation mobile claire et appels à l'action accessibles.

### À éviter

- Glassmorphism utilisé partout.
- Néons, gradients criards, lumières agressives ou ambiance « dashboard crypto ».
- Boules 3D qui tournent au curseur sans rôle narratif.
- Animations permanentes ou qui empêchent de lire.
- Effets de curseur qui remplacent le pointeur natif et rendent les interactions difficiles.
- Préloader qui bloque l'accès au contenu sans nécessité.
- Défilement détourné qui rend la page pénible à utiliser.
- Carrousels automatiques qui changent le contenu sans contrôle.
- Compteurs et témoignages inventés.
- Effets qui rendent le site inutilisable sur un téléphone modeste.

### Système visuel à créer

Définir des tokens CSS documentés : couleurs, typographie, tailles, espacements, rayons, ombres, couches, largeur maximale de contenu, vitesse/easing des transitions et breakpoints. Utiliser des variables CSS plutôt que disperser les valeurs arbitraires.

Prévoir des variantes cohérentes pour :

- Boutons primaire, secondaire, texte et destructif.
- Champs, sélecteurs, radio, checkbox et erreurs de validation.
- Cartes de projets, témoignages, offres et articles.
- Badges de statut pour l'admin.
- Modales, menus, accordéons, notifications et états vides.
- Skeletons de chargement, messages d'erreur et confirmation.

### Typographie et médias

- Utiliser `next/font` pour les polices locales ou les polices web compatibles, afin de maîtriser le chargement.
- Prévoir une police principale très lisible et une police secondaire monospace uniquement pour les détails techniques si cela sert le style.
- Utiliser `next/image` pour les images contrôlées par le site, avec dimensions, tailles responsives et textes alternatifs pertinents.
- Définir un ratio par type de média : hero, miniature projet, visuel étude de cas, portrait et illustration.
- Prévoir un état visuel de remplacement lorsque l'image ou la vidéo ne charge pas.

### Responsive

Tester au minimum : petit téléphone 320–375 px, téléphone courant 390–430 px, tablette, laptop 1366 px et grand écran 1920 px. Le design doit se réorganiser, pas simplement rétrécir.

### Motion design

- **CSS** pour les transitions simples et les états interactifs.
- **Motion for React** pour les micro-interactions, les entrées/sorties de composants et les transitions d'interface.
- **GSAP + ScrollTrigger** pour les animations de séquence, les révélations éditoriales et quelques transitions de défilement complexes.
- Ne jamais animer le même élément simultanément avec Motion et GSAP.
- Ne pas imposer de librairie de smooth scroll. Préférer le scroll natif ; ajouter une solution uniquement si un test utilisateur et les mesures montrent une réelle amélioration.
- Toute scène 3D doit être légère, chargée à la demande, avoir un fallback statique et ne jamais bloquer le contenu. N'ajouter Three.js / React Three Fiber que si une scène précise apporte une vraie valeur ; pas de dépendance 3D par défaut.
- Respecter `prefers-reduced-motion` et proposer une version réduite des animations.
- Éviter les effets qui provoquent des déplacements de mise en page ; animer prioritairement `transform` et `opacity`.
- Ne pas retarder le rendu du contenu essentiel pour attendre une animation.

---

## 3. Architecture fonctionnelle et plan du site

### Navigation publique principale

- Accueil
- Projets
- Services / Tarifs
- À propos
- Lab
- Contact
- Avis (section sur l'accueil et page dédiée si nécessaire)

Le header doit conserver un appel à l'action principal (« Parlons de ton projet » ou équivalent). Sur mobile, la navigation doit être très accessible et ne pas masquer le contenu.

### Pages publiques

- `/` — Accueil
- `/projets` — Liste et filtres des projets
- `/projets/[slug]` — Étude de cas détaillée
- `/services` — Services et méthodologie
- `/tarifs` — Offres, tarifs, options et estimateur
- `/a-propos` — Parcours, vision, compétences et méthode
- `/avis` — Avis publiés et processus pour en laisser un
- `/lab` — Mini-expériences et démonstrations
- `/lab/[slug]` — Expérience ou jeu individuel si le projet le justifie
- `/journal` — Articles / notes techniques, facultatif au premier lancement mais architecture prête
- `/journal/[slug]` — Article individuel
- `/contact` — Qualification du besoin et prise de rendez-vous
- `/confidentialite` — Politique de confidentialité
- `/mentions-legales` — Mentions légales à compléter selon la juridiction applicable
- `/conditions` — Conditions de collaboration, si approprié
- `/connexion` — Connexion / inscription selon le fournisseur retenu
- `/compte` — Gestion minimale du compte et des avis
- `/admin` — Tableau de bord protégé

### Pages d'état

Prévoir des pages et composants pour : 404, erreur globale, accès interdit, session expirée, succès du formulaire, rendez-vous confirmé, lien expiré, absence de résultats et indisponibilité temporaire de l'API.

---

## 4. Contenu et exigences de chaque section

### 4.1 Accueil

Construire un parcours de lecture progressif :

1. **Hero** : titre fort, texte concis, rôle et activité, CTA principal vers le contact et CTA secondaire vers les projets.
2. **Signaux de confiance** : technologies réellement maîtrisées, zones de collaboration, type de clients ou données vérifiées. Ne pas créer de faux badges ou logos clients.
3. **Sélection de projets** : 3 à 5 projets, avec rôle précis, catégorie, problème résolu et liens vers les études de cas.
4. **Ce que je peux construire** : applications web, apps mobiles, SaaS/plateformes, sites et e-commerce, automatisations et maintenance — adapter à la capacité réelle.
5. **Méthode de travail** : découverte, cadrage, conception, développement, validation, mise en production et suivi.
6. **À propos** : mini-parcours et lien vers la page complète.
7. **Avis** : afficher uniquement des avis approuvés et authentiques. Afficher un état discret si aucun avis n'est encore publié, plutôt qu'inventer du contenu.
8. **Tarifs ou budgets de départ** : informations gérées depuis l'admin ; ne pas publier de prix inventés.
9. **Lab / contenu** : aperçu de quelques expériences, facultatif pour la conversion immédiate.
10. **CTA final** : commencer une demande, réserver un appel ou ouvrir WhatsApp.
11. **Footer** : contacts, réseaux, navigation, mentions, politique de confidentialité et disponibilité si elle est tenue à jour.

Le hero ne doit pas mettre en avant une animation au détriment de la proposition de valeur. En quelques secondes, un visiteur doit comprendre qui est Charles, ce qu'il construit et comment démarrer une collaboration.

### 4.2 Liste de projets

Chaque carte présente : titre, résumé, catégorie, statut de publication, rôle de Charles, technologies principales et visuel. Filtres accessibles : Tous, Web, Mobile, Marketplace/SaaS, Expériences, selon les catégories réellement utilisées. Prévoir l'état vide, l'URL de filtre partageable et une pagination ou un « charger plus » si le nombre de projets le justifie.

Ne pas exposer de projets privés ou confidentiels sans autorisation. Les projets en cours doivent afficher leur statut de manière claire.

### 4.3 Étude de cas d'un projet

Structure suggérée :

- Titre et résultat recherché.
- Résumé en 2–3 phrases.
- Statut : prototype, en développement, déployé ou utilisé — sélectionné par l'admin.
- Contexte, problème et public cible.
- Contraintes et principaux défis.
- Contribution réelle de Charles.
- Solution / fonctionnalités clefs.
- Architecture et technologies.
- Décisions importantes et compromis.
- Médias : captures, vidéo, maquette ou démonstration réelle.
- Résultats mesurables uniquement si vérifiés ; sinon, résultats techniques ou objectifs atteints décrits sans chiffres inventés.
- Ce qui serait amélioré ensuite.
- Liens autorisés vers une démo, un site ou un dépôt public.
- CTA vers un service similaire / formulaire de contact.
- Projets associés.

Le contenu doit être géré depuis MongoDB et le dashboard. Prévoir un champ `isFeatured`, une date de publication, un ordre de tri, une image principale, une galerie et des champs SEO.

### 4.4 À propos / parcours / compétences

- Présentation humaine sans biographie interminable.
- Chronologie du parcours basée sur les informations réellement fournies.
- Compétences groupées par domaine : front-end, back-end, mobile, données, déploiement, UX/motion et outils — seulement celles justifiables.
- Relier les compétences à des projets où elles ont été utilisées.
- Méthodologie de collaboration, communication, tests, documentation, livraison et maintenance.
- CV PDF contrôlé depuis l'admin, uniquement si le propriétaire choisit de le publier.
- Réseaux professionnels et adresse de contact.

### 4.5 Services et méthodologie

Chaque service doit comporter : public concerné, problème traité, résultat/livrables, périmètre, exclusions, dépendances client, délai indicatif, mode de collaboration et CTA prérempli. Ne pas promettre des délais ou niveaux de service que le développeur ne peut garantir.

### 4.6 Tarifs et estimateur

Les prix sont gérés depuis l'admin. Chaque offre peut être :

- prix fixe ;
- « à partir de » ;
- fourchette ;
- devis personnalisé.

Ne pas présenter une estimation automatisée comme un devis contractuel. L'estimateur doit expliquer qu'il s'agit d'une première indication, calculée selon des règles explicitement configurées par l'admin.

Étapes de l'estimateur : type de projet, périmètre, fonctionnalités, plateformes, intégrations, délai souhaité, niveau d'accompagnement, budget indicatif facultatif. Afficher le récapitulatif, les hypothèses, la fourchette configurée et un CTA pour envoyer la demande / réserver un échange. Ne jamais promettre qu'une fonctionnalité est incluse sans la relier à une règle de prix configurée.

### 4.7 Avis et témoignages

- Section d'avis intégrée à l'accueil et page dédiée.
- Connexion requise pour publier un nouvel avis ; lecture des avis publics sans compte.
- Note de 1 à 5, commentaire avec longueur minimale/maximale, nom de profil et date.
- Lien facultatif vers le type de prestation ou projet, sans divulguer d'informations sensibles.
- Statuts : `pending`, `approved`, `rejected`, `hidden`.
- La publication est modérée par défaut.
- Badge « Client vérifié » uniquement si Charles a vérifié la collaboration via le dashboard ou un processus d'invitation valide. Ne jamais déduire la vérification du simple fait que l'utilisateur se connecte.
- Une personne ne peut pas inonder la page de doublons ; appliquer limitation et règles documentées.
- L'auteur peut demander la correction ou la suppression de son avis ; traiter les demandes depuis un processus visible.
- Les avis affichés doivent être conformes à la réalité et publiés avec autorisation.

### 4.8 Lab / mini-jeux

Créer un espace expérimental facultatif pour montrer la créativité technique : mini-jeu de logique, démonstration d'interface, visualisation ou interaction motion. Commencer avec 1 à 3 expériences au maximum, seulement si la qualité est suffisante.

Exigences : chargement léger, consignes claires, fonctionnement au clavier et au tactile, reset, état de réussite/échec, aucun blocage de navigation, pas de collecte de données sans utilité claire. À la fin, un CTA optionnel peut expliquer quelle compétence l'expérience démontre et proposer de discuter d'un projet similaire.

### 4.9 Journal technique

Optionnel au lancement mais préparé dans le modèle de données. Un article comporte titre, slug, résumé, contenu, auteur, image de couverture, catégories, date de publication, statut brouillon/publié, données SEO et temps de lecture calculé à partir du contenu. Ne pas ajouter de CMS externe tant que le dashboard MongoDB suffit.

### 4.10 Contact et qualification du besoin

Construire un formulaire multiétape court, avec indicateur de progression, possibilité de revenir à l'étape précédente et conservation du contenu en cas d'erreur. Étapes recommandées :

1. Quel service ? (site, e-commerce, app mobile, plateforme/SaaS, automatisation, maintenance, conseil, autre).
2. Quel est l'objectif ? (question courte ou description).
3. Fonctionnalités et contraintes prioritaires.
4. Budget indicatif facultatif, devise configurée et échéance souhaitée.
5. Coordonnées : nom, email, WhatsApp facultatif, entreprise et URL facultative.
6. Consentement requis uniquement pour les traitements expliqués dans la politique de confidentialité.
7. Récapitulatif, confirmation de soumission, proposition de réserver et lien WhatsApp.

Éviter de demander inutilement des données sensibles. La demande doit être enregistrée côté serveur avant d'afficher la confirmation. Gérer les erreurs avec des messages clairs, un identifiant de demande et une possibilité de réessayer sans créer un nombre excessif de doublons.

### 4.11 Connexion et espace utilisateur

- Connexion Google et connexion par lien email à usage limité si cette méthode est supportée de manière stable par la version retenue de Better Auth.
- Pas de création de compte administrateur depuis l'interface publique.
- Les utilisateurs connectés peuvent publier et gérer leurs propres avis ; ils ne peuvent pas publier directement un avis approuvé.
- Page `/compte` minimale : profil, avis soumis, état de modération et demandes de suppression/correction.
- Les routes et API sont protégées côté serveur. Masquer un bouton dans l'interface ne constitue jamais une règle de sécurité.

---

## 5. Parcours de conversion et automatisations

### 5.1 Deux parcours accessibles partout

**Parcours A — Demande détaillée** : CTA → questionnaire → sauvegarde du prospect en base → email de confirmation → notification à Charles → récapitulatif → lien WhatsApp et réservation.

**Parcours B — Réservation directe** : CTA → explication courte du type d'appel → calendrier Cal.com intégré ou ouvert en nouvelle page → réservation → webhook sécurisé → enregistrement / mise à jour de la réservation → notifications et suivi.

Le visiteur doit pouvoir commencer avec WhatsApp sans être forcé de remplir un long formulaire. Inversement, un prospect avec un besoin complexe doit pouvoir envoyer un brief complet.

### 5.2 WhatsApp

- Numéro configurable au format international en chiffres, sans espaces, `+`, parenthèses ni tirets dans la valeur utilisée pour l'URL.
- Construire le lien officiel `https://wa.me/{numero}?text={message_encode}`.
- Encoder correctement le texte et ne jamais concaténer un contenu utilisateur non encodé dans une URL.
- Message prérempli possible : prénom, type de projet, résumé court, budget si fourni, échéance si fournie, identifiant de demande et URL du portfolio.
- Le bouton doit expliquer que WhatsApp va s'ouvrir et que l'utilisateur doit encore envoyer le message.
- Ne pas prétendre envoyer automatiquement un message via WhatsApp à moins d'intégrer plus tard l'API officielle WhatsApp Business et de respecter ses règles.

### 5.3 Email avec Resend

Emails transactionnels :

- confirmation reçue au prospect ;
- notification de nouvelle demande à Charles ;
- confirmation / modification de rendez-vous si nécessaire et si Cal.com n'assure pas déjà le message correspondant ;
- invitation à déposer un avis après un projet terminé, seulement si Charles déclenche l'envoi ou valide l'automatisation ;
- notification d'avis en attente ;
- confirmation de modification ou de suppression de compte lorsque nécessaire.

Chaque envoi doit avoir une gestion d'échec : journal non sensible, nombre de tentatives limité, statut à réessayer et idempotence. Ne jamais envoyer deux fois le même email à cause d'une nouvelle tentative du webhook. Ne pas dupliquer les rappels gérés par Cal.com.

Configurer le domaine expéditeur et les enregistrements de délivrabilité avant la production. En développement, utiliser une adresse ou un destinataire autorisé par le fournisseur.

### 5.4 Cal.com et calendrier

Utiliser **Cal.com** comme système de disponibilité/réservation plutôt que de recoder un calendrier complet. Charles configure ses types de rendez-vous, durées, fuseau horaire, disponibilité, délais de préavis, jours non disponibles, limites et connexions de calendrier dans Cal.com.

- Prévoir un embed adapté au design ou un lien de réservation bien visible.
- Indiquer la durée et le but de chaque type d'appel.
- Permettre au visiteur de choisir son fuseau horaire si Cal.com le gère ; afficher clairement l'heure finale confirmée.
- Utiliser des webhooks Cal.com pour les événements créés, annulés ou replanifiés.
- Vérifier l'authenticité des webhooks avec le mécanisme officiel / secret configuré.
- Enregistrer les événements par identifiant externe unique afin de rendre le traitement idempotent.
- Envoyer à Charles une notification et conserver le statut de la réservation dans MongoDB.
- La plateforme Cal.com reste la source de vérité pour la disponibilité et l'heure du rendez-vous.

### 5.5 Suivi commercial automatique

États proposés pour un prospect :

`new` → `reviewing` → `qualified` → `meeting_scheduled` → `proposal_sent` → `won` / `lost` / `archived`.

Ajouter un journal d'activité horodaté (changement de statut, rendez-vous associé, note interne, email envoyé), limité à l'admin. Le prospect ne voit jamais les notes internes.

Automatisations du MVP : création de prospect, confirmation email, notification admin, lien WhatsApp, suivi des réservations Cal.com et notification d'avis. **n8n est optionnel pour une phase ultérieure** si le nombre de workflows justifie un outil supplémentaire. Ne pas ajouter n8n simplement pour paraître automatisé : les premiers workflows doivent rester lisibles, testables et observables dans le code.

---

## 6. Stack technique imposée et outils recommandés

Claude Code doit vérifier l'état du dépôt et les versions disponibles au moment de la mise en œuvre. Les choix ci-dessous sont la base attendue ; toute substitution doit être justifiée avant l'implémentation.

### 6.1 Frontend — racine du dépôt

- **Next.js App Router** — rendu, routing, métadonnées, pages publiques et composants serveur/client.
- **React + TypeScript strict** — contrats typés, pas de `any` arbitraire.
- **Tailwind CSS** — styles utilitaires et design tokens CSS.
- **shadcn/ui + Radix UI** — base accessible pour les primitives de formulaire, dialogues, menus, tooltips et composants admin ; adapter visuellement au système de design et éviter l'apparence standard non personnalisée.
- **Lucide React** — icônes cohérentes.
- **Motion for React** — micro-interactions et transitions d'interface.
- **GSAP + ScrollTrigger** — animations de séquence ou défilement complexes, utilisées avec parcimonie.
- **React Hook Form + Zod** — formulaires clients et validations partagées au niveau des schémas quand cela est approprié.
- **TanStack Query** — requêtes client, états de chargement/cache et invalidation lorsque le besoin le justifie ; ne pas installer si des Server Components ou `fetch` suffisent à une page simple.
- **UploadThing React client** — interface d'upload reliée à l'endpoint Express, aucune clé secrète dans le navigateur.
- **`next/image` et `next/font`** — médias et polices optimisés.
- **Playwright** — tests end-to-end des parcours critiques.
- **Vitest + Testing Library** — tests unitaires et de composants si le dépôt n'a pas déjà une solution adaptée.

### 6.2 Backend — dossier `/backend`

- **Node.js LTS compatible + Express.js + TypeScript**.
- **MongoDB Atlas** pour l'hébergement de la base.
- **Mongoose** pour les modèles applicatifs, les validations de persistance et les index.
- **Better Auth** pour l'authentification dans l'API Express, avec adaptateur MongoDB et fournisseur Google ; activer le lien email si l'intégration stable avec Resend est correctement documentée pour la version retenue.
- **Zod** pour valider toutes les entrées de l'API, y compris les paramètres de route, query strings et webhooks.
- **Helmet** pour les en-têtes de sécurité.
- **CORS** avec liste d'origines explicite, jamais `*` avec les credentials.
- **express-rate-limit** ou solution compatible pour limiter les routes publiques sensibles.
- **Pino + pino-http** pour des logs structurés, avec masquage des données sensibles.
- **UploadThing Express adapter** pour les fichiers autorisés.
- **Resend Node SDK** pour les emails transactionnels.
- **Sentry** pour les erreurs de production, frontend et backend, avec données personnelles masquées.
- **Swagger / OpenAPI** ou une documentation versionnée des endpoints pour décrire l'API. Préférer une documentation lisible, sans exposer les routes admin sensibles publiquement si cela crée un risque.
- **Vitest** pour les tests unitaires et d'intégration ; tests API avec Supertest ou outil compatible déjà présent.

### 6.3 Services externes

- **MongoDB Atlas** — stockage.
- **UploadThing** — fichiers médias.
- **Resend** — emails transactionnels.
- **Cal.com** — disponibilité, réservation et événements de calendrier.
- **Google OAuth** — connexion sociale si configurée.
- **PostHog** — analytics de conversion facultatifs au lancement, avec configuration respectueuse de la vie privée et consentement si requis.
- **Sentry** — erreurs et diagnostics.
- **Vercel** — hébergement recommandé du frontend Next.js.
- **Railway ou Render** — hébergement recommandé du backend Express ; choisir selon le compte et les contraintes du projet.
- **GitHub** — versionnement, issues et CI.
- **GitHub Actions** — lint, typecheck, tests et build sur pull request si le dépôt est hébergé sur GitHub.
- **n8n** — uniquement en phase avancée si les automatisations directes deviennent trop nombreuses ; ne pas le rendre nécessaire au fonctionnement initial du site.

### 6.4 Outils de développement

- npm ou le gestionnaire de paquets déjà employé par le dépôt ; ne pas mélanger npm/pnpm/yarn sans raison.
- ESLint et Prettier (ou formatteur déjà en place).
- `tsc --noEmit` pour le contrôle des types.
- Playwright avec projet Desktop et Mobile pour les parcours critiques.
- `axe-core` / axe dans les tests de base d'accessibilité.
- Contrôle Lighthouse et Web Vitals avant mise en production.
- Fichier `AGENTS.md` ou `CLAUDE.md` au niveau racine décrivant les conventions et la procédure de travail de l'agent.

### 6.5 Règles d'intégration entre Next.js et Express

- L'API métier est versionnée sous `/api/v1` dans Express.
- Utiliser un client API frontend centralisé : base URL configurable, `credentials: "include"` quand nécessaire, gestion uniforme des erreurs, timeout et types de réponse.
- En production, préférer une architecture same-site/same-origin avec proxy `/api/backend/*` vers Express, ou un sous-domaine API maîtrisé avec CORS strict et cookies/configuration adaptés. Documenter le choix réellement utilisé.
- Si le frontend et l'API sont sur des origines distinctes, configurer explicitement CORS, credentials, cookies, domaine, `SameSite`, `Secure` et les règles CSRF adaptées. Ne pas laisser ces réglages au hasard.
- Ne pas mettre la logique métier, les clés privées ou l'accès direct MongoDB dans des composants React.
- Ne pas dupliquer les endpoints métier dans Next.js et Express.

---

## 7. UploadThing et la variable `UPLOADTHING8TOKEN`

Le propriétaire a demandé le nom de variable **`UPLOADTHING8TOKEN`**. La documentation standard d'UploadThing utilise généralement `UPLOADTHING_TOKEN`. Pour respecter le nom fourni tout en conservant la compatibilité avec le SDK, implémenter une couche de bootstrap côté backend qui mappe la variable personnalisée vers le nom attendu par le SDK **avant l'import de la configuration UploadThing** :

- source prioritaire : `process.env.UPLOADTHING8TOKEN` ;
- fallback de compatibilité : `process.env.UPLOADTHING_TOKEN` si déjà utilisé dans l'environnement ;
- ne jamais envoyer ces valeurs au frontend ni les écrire dans les logs.

Si la version officielle choisie permet un nom personnalisé documenté, utiliser cette méthode ; sinon, le mapping dans le bootstrap est obligatoire. Écrire un test ou un contrôle de démarrage qui affiche seulement « UploadThing configuré / non configuré », jamais la valeur du token.

### Routes d'upload

Créer un router UploadThing adapté à Express, avec des types limités et middleware d'autorisation :

- `projectImage` : images de projets, administrateur uniquement ; MIME image autorisé, taille limitée et nombre de fichiers contrôlé.
- `caseStudyMedia` : images ou vidéos courtes de démonstration, administrateur uniquement, limites explicites.
- `cvDocument` : PDF du CV, administrateur uniquement, taille limitée.
- `contactBrief` : PDF facultatif envoyé par un prospect ; route publique fortement limitée, types stricts, taille limitée, aucun fichier exécutable, politique de conservation documentée.

Ne créer une route publique d'upload que si le formulaire l'exige réellement. Si des pièces jointes augmentent le risque ou l'abus, préférer un lien de brief externe ou la désactiver initialement.

Valider les types et tailles à la fois côté interface et côté serveur. Le middleware de l'upload admin doit revalider l'identité et le rôle au moment de l'upload. Les URLs et identifiants de fichiers doivent être enregistrés dans le modèle MongoDB correspondant. Prévoir une procédure de suppression des médias devenus orphelins.

---

## 8. Modèle de données MongoDB

Concevoir des schémas Mongoose avec `timestamps: true`, nettoyage des champs, contraintes, index et types TypeScript inférés ou partagés. Ne pas créer de collection inutilement complexe.

### 8.1 `User`

Champs conceptuels :

- `_id`
- `name`
- `email` normalisé et unique lorsque requis
- `image` / avatar facultatif
- `role`: `user` ou `admin` (rôle contrôlé côté serveur)
- `authProvider` ou références gérées par Better Auth, sans recréer manuellement ses collections
- `emailVerifiedAt` si disponible dans la configuration auth
- `status`: `active`, `disabled`
- `createdAt`, `updatedAt`

Ne pas stocker un mot de passe artisanal si Better Auth gère la session. Ne pas permettre à l'utilisateur public de modifier lui-même son rôle.

### 8.2 `Project`

- `title`, `slug` unique, `shortDescription`, `description`
- `category`, `tags`, `technologies`
- `status`: `prototype`, `in_progress`, `deployed`, `maintained`, `archived`
- `visibility`: `public`, `unlisted`, `private`
- `roleAndContribution`
- `context`, `challenge`, `solution`, `features[]`, `decisions[]`, `results`, `lessonsLearned`, `futureImprovements`
- `coverImage`, `gallery[]`, `demoVideo`, `liveUrl`, `repositoryUrl` si autorisés
- `isFeatured`, `sortOrder`, `publishedAt`
- `seoTitle`, `seoDescription`, `ogImage`
- `createdAt`, `updatedAt`

Index : slug unique ; filtre/visibilité/statut/date selon requêtes. Ne retourner que les projets publics dans les endpoints publics.

### 8.3 `Review`

- `userId` référence utilisateur
- `authorNameSnapshot`, `authorAvatarSnapshot` facultatifs et non sensibles
- `rating` entier 1–5
- `title` facultatif
- `content` avec limites de longueur
- `projectId` facultatif
- `relationshipType` facultatif
- `isVerifiedClient` booléen, modifiable uniquement par admin ou via un processus sécurisé de vérification
- `status`: `pending`, `approved`, `rejected`, `hidden`
- `moderationNote` réservé admin
- `publishedAt`, `createdAt`, `updatedAt`
- `source`: avis spontané ou invitation vérifiée, sans révéler un token public

Index utiles : status + publishedAt ; userId + createdAt ; règle anti-doublon définie selon le besoin métier. Déterminer si un utilisateur peut déposer un avis général ou un seul avis par projet ; appliquer la même règle dans la base et l'API.

### 8.4 `Lead`

- identifiant public non séquentiel
- nom, email, WhatsApp facultatif, entreprise et URL facultatives
- `serviceType`, objectif, périmètre, fonctionnalités, contraintes, budget facultatif, devise, échéance facultative
- `sourcePage`, `referrer` et paramètres de campagne autorisés, sans collecte excessive
- `status` défini dans le pipeline commercial
- `consent` avec texte/version/date pertinents si un consentement est requis
- `assignedTo` si nécessaire
- `internalNotes[]` réservées à l'admin
- `activity[]` ou collection d'activités pour l'historique
- `emailStatus`, `notificationStatus`, `lastNotificationAttemptAt`
- `createdAt`, `updatedAt`

L'email et le résumé du projet sont des données personnelles ; accès restreint, logs expurgés et durée de conservation définie dans la politique de confidentialité.

### 8.5 `Booking`

- `provider`: Cal.com
- `externalBookingId` unique
- `externalEventTypeId` si fourni
- email et nom de l'invité selon le minimum nécessaire
- début, fin, fuseau horaire, statut (`scheduled`, `rescheduled`, `cancelled`, `completed`, `no_show` si fiable)
- lien de réunion si fourni par Cal.com
- `leadId` facultatif
- `lastWebhookEventId` / idempotence si disponible
- `createdAt`, `updatedAt`

L'horaire confirmé par Cal.com reste la source de vérité. Ne pas afficher les notes privées d'un événement sur une page publique.

### 8.6 `Service` et `PricingPackage`

Permettre à l'admin de gérer le nom, slug, description, public cible, livrables, exclusions, délais indicatifs, type de prix, devise, prix minimum/maximum, options, ordre et statut de publication. Les prix stockés doivent être normalisés et le rendu doit gérer proprement l'absence de prix public.

### 8.7 `SiteSettings`

Collection ou document singleton pour les réglages éditoriaux : nom public, activité, textes de présentation, numéro WhatsApp, liens sociaux, disponibilité, CTA, conditions, devise, textes de consentement, paramètres SEO par défaut et drapeaux de fonctionnalités. Ne jamais y stocker des secrets d'intégration.

### 8.8 `BlogPost` (si le journal est activé)

Titre, slug, résumé, contenu, auteur, couverture, catégories, statut, dates, données SEO et temps de lecture. Un article en brouillon ne doit jamais apparaître dans les listes publiques ni être indexé.

### 8.9 `AuditLog` ou `AdminActivity`

Journaliser les actions administratives sensibles : modification de rôles, approbation/retrait d'avis, suppression de contenu, changement de prix, suppression ou export de prospects. Ne jamais écrire le token, les cookies, les codes de connexion ou le contenu complet d'un message privé dans le log.

---

## 9. API Express attendue

Préfixe public : `/api/v1`. Les routes Better Auth peuvent utiliser son propre préfixe `/api/auth` selon sa configuration officielle. Documenter la structure réelle et éviter la double définition des mêmes routes.

### Santé et système

- `GET /api/v1/health` — statut simple ; ne pas exposer la chaîne MongoDB, les variables d'environnement ou des détails sensibles.
- `GET /api/v1/ready` — optionnel, vérifie les dépendances nécessaires à la disponibilité réelle, avec réponse publique minimale.

### Projets publics

- `GET /api/v1/projects` — projets publics, filtres, pagination, tri autorisé.
- `GET /api/v1/projects/:slug` — détail d'un projet public.

### Services et tarifs

- `GET /api/v1/services` — services publiés.
- `GET /api/v1/pricing` — offres et options publiées.
- `POST /api/v1/pricing/estimate` — calcul de l'estimation à partir de règles validées côté serveur ; retourner hypothèses et avertissement de non-engagement.

### Avis

- `GET /api/v1/reviews` — avis approuvés uniquement, paginés.
- `POST /api/v1/reviews` — création authentifiée, statut initial `pending`.
- `GET /api/v1/reviews/me` — avis de l'utilisateur connecté.
- `PATCH /api/v1/reviews/:id` — modification de son avis selon la politique, sans pouvoir changer statut/vérification.
- `DELETE /api/v1/reviews/:id` — suppression logique ou demande de suppression selon les règles.

### Contact / prospects

- `POST /api/v1/leads` — validation Zod, contrôle anti-abus, création en base, déclenchement fiable des emails ; ne pas attendre un service externe indéfiniment.
- `GET /api/v1/leads/:publicReference/status` — uniquement si un statut accessible au prospect est prévu ; aucun accès aux notes internes.

### Cal.com

- `POST /api/v1/webhooks/calcom` — validation de la signature/du secret, idempotence et traitement des événements autorisés.

### Compte utilisateur

- Routes gérées par Better Auth (documentées par la version réellement installée).
- Endpoints supplémentaires uniquement si nécessaires au profil ou à l'espace avis ; ne pas dupliquer les fonctions de session de Better Auth.

### Admin (toutes protégées par middleware serveur)

- `GET /api/v1/admin/overview` — agrégats essentiels.
- CRUD de projets ; publication/archivage.
- CRUD de services et tarifs.
- Liste, filtrage, approbation, rejet et masquage d'avis.
- Liste et mise à jour de prospects, notes internes et historique.
- Liste / recherche de réservations.
- CRUD d'articles si le journal est activé.
- Lecture et mise à jour des réglages éditoriaux.
- Gestion contrôlée des invitations à laisser un avis, si mise en œuvre.

### Convention d'erreur

Format uniforme, par exemple :

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Vérifie les champs indiqués.",
    "fieldErrors": {}
  },
  "requestId": "id-non-sensible"
}
```

Ne pas renvoyer stack traces, erreurs MongoDB brutes, tokens, identifiants internes inutiles ou informations de configuration en production. Les codes d'erreur doivent permettre au frontend de distinguer validation, authentification, autorisation, conflit, limitation de débit et erreur serveur.

---

## 10. Tableau de bord administrateur

Route `/admin`, invisible à la navigation publique et protégée côté serveur.

### Tableau de bord d'accueil

- Nombre de nouveaux prospects sur une période sélectionnée.
- Demandes à traiter.
- Rendez-vous à venir.
- Avis en attente.
- Actions rapides : ajouter un projet, écrire une réponse, modifier les tarifs.
- Tendance uniquement si les données réelles sont suffisantes ; aucun graphique avec données fictives en production.

### Modules

1. **Projets** : créer, modifier, dupliquer comme brouillon, publier, dépublier, trier, prévisualiser, gérer les galeries et champs SEO.
2. **Services / Tarifs** : modifier les descriptions, livrables, options, prix, fourchettes et ordre.
3. **Avis** : lire, approuver, rejeter, masquer, marquer un client vérifié avec justification et traiter une demande de suppression.
4. **Prospects / CRM léger** : recherche, filtres, statut, notes privées, historique et rappel manuel. Ne pas construire un CRM complexe si un pipeline simple suffit.
5. **Rendez-vous** : lister les événements synchronisés par webhook et ouvrir Cal.com pour l'administration du calendrier.
6. **Journal** : brouillons, publications, catégories, couverture et SEO si la fonction est activée.
7. **Réglages** : coordonnées, WhatsApp, URL de calendrier, réseaux, disponibilité, paramètres de contenu et liens légaux.
8. **Médias** : médias utilisés par les projets, remplacement et suppression contrôlée.
9. **Sécurité et activité** : historique des actions admin, sans panneau exposant de secrets.

### UX admin

- Recherche et filtres utilisables au clavier.
- Confirmation pour les actions destructives.
- Sauvegarde explicite et indicateur de succès/échec.
- Brouillon/prévisualisation avant publication.
- Formulaires validés côté client et côté serveur.
- Pagination serveur pour les listes croissantes.
- États de chargement, vide, erreur et succès.
- Responsive suffisant pour les corrections rapides sur mobile.

---

## 11. Authentification, autorisation et sécurité

### Authentification

- Utiliser Better Auth via l'intégration Express officiellement supportée par la version stable retenue, avec MongoDB.
- Activer Google OAuth quand les identifiants du fournisseur sont fournis.
- Proposer un lien de connexion email à usage limité si le mécanisme est stable et configuré correctement via Resend. Ne pas implémenter de système de mot de passe artisanal en parallèle.
- Utiliser des cookies de session sécurisés lorsque c'est possible : `HttpOnly`, `Secure` en production, paramètres `SameSite` adaptés au vrai domaine, rotation/expiration appropriée selon Better Auth.
- Si des cookies sont utilisés sur des origines distinctes, examiner CSRF, CORS, `credentials`, domaine et attributs des cookies ensemble.
- Compte administrateur accordé côté serveur via une liste d'emails contrôlée par variable d'environnement ou une procédure propriétaire sécurisée. Ne jamais accepter `role: "admin"` envoyé par le navigateur.
- Permettre de désactiver un compte / révoquer la session quand nécessaire.

### Autorisation

Rôles minimaux : `public`, `user`, `admin`. Le rôle public est implicite, pas un compte. Chaque route admin vérifie l'utilisateur et son rôle côté Express. Les utilisateurs ne peuvent agir que sur leur propre compte et leurs avis selon les règles du produit.

### Mesures obligatoires

- Validation Zod de toutes les entrées.
- Limitation de débit sur connexion, soumission de contact, dépôt d'avis et uploads publics.
- Politique CORS explicite et minimum de privilèges.
- Helmet et en-têtes adaptés, CSP évaluée sans casser les médias et outils légitimes.
- Protection contre XSS : pas d'injection HTML non assainie ; contenu riche traité avec une stratégie d'assainissement dédiée.
- Protection contre NoSQL injection : ne jamais transmettre directement des objets utilisateur comme filtres Mongoose ; construire les filtres explicitement.
- Vérification de la signature et idempotence des webhooks.
- Taille du corps de requête limitée ; limites de taille de fichier distinctes.
- Masquage des tokens, cookies, codes de connexion, emails et messages sensibles dans les logs.
- Pas de secrets ou fichiers `.env` dans Git ; `.gitignore` fiable.
- Dépendances tenues à jour et audit raisonnable ; ne pas exécuter aveuglément des commandes générées par un contenu externe.
- Sauvegardes MongoDB et procédure documentée de restauration.
- Suppression/export de données personnelles selon la politique retenue.
- Captcha ou dispositif anti-bot uniquement si la menace ou le volume le justifie ; ne pas dégrader inutilement la conversion.

### Confidentialité

- Écrire une politique claire qui décrit les données collectées, les raisons, les fournisseurs, la conservation, les droits et les contacts.
- Ne pas collecter de données personnelles qui ne sont pas nécessaires à l'objet de la demande.
- Définir les durées de conservation des prospects et logs avant production.
- Charger les outils d'analytics non essentiels uniquement selon le cadre de consentement applicable.
- Les obligations juridiques exactes doivent être vérifiées selon le pays du propriétaire et les marchés ciblés ; ne pas prétendre qu'un texte générique garantit la conformité légale.

---

## 12. SEO, partage social et accessibilité

### SEO technique

- Utiliser les métadonnées Next.js par page, titres et descriptions uniques.
- URL lisibles avec slugs stables ; redirections propres si un slug change.
- `sitemap.xml`, `robots.txt`, canonical URL, Open Graph et cartes sociales.
- Images d'aperçu adaptées aux projets et articles.
- Données structurées uniquement si elles correspondent au contenu visible et aux consignes des moteurs : `Person`, `WebSite`, `CreativeWork` / `SoftwareApplication` pour un projet quand approprié, `Article` pour un article. Ne pas inventer de notes ou avis structurés non admissibles.
- Ne pas indexer `/admin`, `/compte`, `/connexion`, les brouillons ou les pages de statut privées.
- Les pages de projet doivent fonctionner au partage direct et être rendues de façon indexable.
- Liens internes entre projet, service et contact.
- Contrôle des pages 404 et des liens cassés.

### Accessibilité

- HTML sémantique, ordre de titres cohérent, labels explicites.
- Navigation complète au clavier et focus visible.
- Couleurs avec contrastes vérifiés.
- Dialogues, menus et accordéons accessibles.
- Erreurs de formulaire associées aux champs ; résumé d'erreurs si besoin.
- Texte alternatif pertinent pour les images informatives ; alternative vide pour les décorations.
- Vidéos avec sous-titres ou transcription si elles contiennent de l'information.
- `prefers-reduced-motion` géré.
- Ne pas signaler uniquement une erreur par la couleur.
- Éviter les cibles tactiles trop petites.

---

## 13. Analytics et événements de conversion

Intégrer PostHog de façon modulaire, activable par configuration. Si les contraintes de vie privée ou le budget ne permettent pas de le lancer immédiatement, garder une couche abstraite de suivi désactivable et documenter les événements attendus.

Événements métier proposés :

- `hero_primary_cta_clicked`
- `projects_list_viewed`
- `project_opened`
- `project_demo_clicked`
- `service_selected`
- `pricing_estimator_started`
- `pricing_estimator_completed`
- `contact_form_started`
- `contact_form_step_completed`
- `lead_submitted`
- `whatsapp_contact_clicked`
- `booking_flow_opened`
- `booking_confirmed` — confirmé via le retour fiable / webhook du service, pas uniquement sur un clic
- `review_submission_started`
- `review_submitted`

Ne pas envoyer à l'outil d'analytics le corps d'un message, l'email, le numéro WhatsApp, les notes privées ou un contenu personnel. Utiliser des identifiants d'événements pseudonymisés et des catégories génériques.

### Indicateurs utiles

- sessions qualifiées par source ;
- visites de pages projet ;
- taux de clic vers contact ;
- démarrage / complétion du formulaire ;
- abandons par étape ;
- clics WhatsApp ;
- réservations confirmées ;
- temps et taux de chargement des pages critiques.

Ne pas optimiser uniquement le temps passé sur le site ou les clics d'animation : mesurer les demandes qualifiées et rendez-vous réels.

---

## 14. Performance et qualité

Objectifs de qualité à vérifier à partir de mesures réelles :

- Cibles Core Web Vitals recommandées : LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 au 75e percentile quand des données suffisantes sont disponibles.
- Images optimisées, `sizes`, tailles réelles et chargement différé sous la ligne de flottaison.
- Vidéos non lancées automatiquement avec son ; chargement différé et poster image.
- Animations coûteuses lazy-loaded et évitées sur les petits appareils si elles nuisent aux performances.
- Réduire les bibliothèques chargées initialement ; importer GSAP ou les scènes 3D uniquement là où nécessaires.
- Éviter les composants client globaux lorsque Server Components suffisent.
- Indiquer les états de chargement et rendre le contenu utile sans attendre le tracking ou les emails.
- Prévoir timeout, retry limité et message de secours pour les services externes.

---

## 15. Organisation des dossiers proposée

Adapter aux conventions existantes. Cette structure est une cible, pas une raison de casser un dépôt déjà sain.

```text
/
├── app/                         # Next.js App Router
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── projets/
│   │   ├── services/
│   │   ├── tarifs/
│   │   ├── a-propos/
│   │   ├── avis/
│   │   ├── lab/
│   │   ├── journal/
│   │   └── contact/
│   ├── (auth)/
│   │   └── connexion/
│   ├── compte/
│   ├── admin/
│   ├── confidentialite/
│   ├── mentions-legales/
│   ├── conditions/
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── global-error.tsx
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/
│   ├── layout/
│   ├── motion/
│   ├── projects/
│   ├── reviews/
│   ├── contact/
│   ├── pricing/
│   ├── admin/
│   └── seo/
├── lib/
│   ├── api/
│   ├── auth/
│   ├── analytics/
│   ├── schemas/
│   ├── seo/
│   ├── utils/
│   └── config/
├── public/
│   ├── images/
│   ├── icons/
│   └── videos/
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── bootstrap.ts
│   │   ├── server.ts
│   │   ├── config/
│   │   ├── db/
│   │   ├── models/
│   │   ├── modules/
│   │   │   ├── projects/
│   │   │   ├── reviews/
│   │   │   ├── leads/
│   │   │   ├── bookings/
│   │   │   ├── services/
│   │   │   ├── pricing/
│   │   │   ├── settings/
│   │   │   ├── uploads/
│   │   │   └── admin/
│   │   ├── middleware/
│   │   ├── services/
│   │   │   ├── email/
│   │   │   ├── uploadthing/
│   │   │   ├── calcom/
│   │   │   └── analytics/
│   │   ├── utils/
│   │   └── tests/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── tests/
│   ├── e2e/
│   └── accessibility/
├── .env.example
├── .gitignore
├── CLAUDE.md
├── README.md
├── package.json
├── playwright.config.ts
└── ...
```

Si un monorepo/workspace est déjà en place, conserver une stratégie cohérente plutôt que dupliquer les dépendances ou les scripts inutilement.

---

## 16. Variables d'environnement

Créer `.env.example` sans valeurs secrètes. Valider les variables au démarrage avec un schéma Zod différenciant variables obligatoires et options. En production, si une variable requise manque, échouer avec un message clair sans imprimer les secrets.

### Frontend — exemple de noms

```dotenv
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_UPLOADTHING_URL=http://localhost:5000/api/uploadthing
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_CALCOM_BOOKING_URL=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
NEXT_PUBLIC_SENTRY_DSN=
```

### Backend — exemple de noms

```dotenv
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
MONGODB_URI=
MONGODB_DB_NAME=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:5000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ADMIN_EMAILS=
UPLOADTHING8TOKEN=
# Compatibilité seulement si un environnement existant utilise déjà le nom standard :
UPLOADTHING_TOKEN=
RESEND_API_KEY=
EMAIL_FROM=
ADMIN_NOTIFICATION_EMAIL=
CALCOM_BOOKING_URL=
CALCOM_WEBHOOK_SECRET=
SENTRY_DSN=
POSTHOG_PROJECT_KEY=
CRON_SECRET=
```

Supprimer les variables inutilisées avant la production. `CRON_SECRET` n'est requis que si une tâche planifiée protégée est réellement implémentée. `POSTHOG_PROJECT_KEY` côté serveur est facultatif et ne doit pas remplacer ou révéler les clés client/serveur inappropriées.

### Gestion des URLs et cookies

Les URLs ci-dessus sont des exemples de développement, pas les domaines de production. La configuration réelle doit être cohérente avec le déploiement et documenter l'origine du frontend, l'URL publique de l'API, l'URL UploadThing, la politique CORS, les cookies et le flux Better Auth. Le numéro WhatsApp et les URLs de réservation sont des données de configuration, pas des valeurs à inventer par l'agent.

---

## 17. Tests indispensables

### Tests unitaires / validation

- schémas Zod pour contact, avis, prix, paramètres de projet et filtres ;
- calcul de l'estimateur avec cas limites ;
- construction/encodage du lien WhatsApp ;
- transitions de statut autorisées ;
- permissions par rôle ;
- traitement idempotent des événements webhook ;
- règles des avis et de vérification client.

### Tests d'intégration API

- accès public limité aux projets publiés ;
- création d'un prospect avec données valides ;
- rejet des entrées invalides et trop volumineuses ;
- routes admin bloquées sans session et pour un utilisateur standard ;
- utilisateur limité à ses propres avis ;
- avis nouvellement créé en attente de modération ;
- impossibilité de modifier un rôle ou `isVerifiedClient` depuis le navigateur ;
- webhook rejeté si secret/signature invalide ;
- webhook rejoué sans double enregistrement ni double email ;
- erreur de MongoDB gérée proprement.

### Tests end-to-end avec Playwright

1. Ouvrir l'accueil en mobile et bureau.
2. Naviguer vers un projet et ouvrir une étude de cas.
3. Filtrer les projets et tester un état vide.
4. Remplir le formulaire de contact avec une erreur puis corriger et soumettre.
5. Vérifier la page de confirmation et la création de demande via test d'intégration approprié.
6. Vérifier le lien WhatsApp : numéro et texte correctement encodés.
7. Ouvrir la réservation Cal.com en mode test / mock de l'embed si nécessaire sans prétendre réserver un vrai créneau.
8. Tester la connexion dans l'environnement approprié.
9. Soumettre un avis et vérifier qu'il n'apparaît pas avant approbation.
10. Tester l'admin avec un compte admin et un compte user.
11. Parcourir au clavier, activer la réduction des animations et tester l'accessibilité de base.
12. Tester 404, erreurs réseau et états de chargement.

### Validation avant déploiement

Exécuter les scripts réellement définis par le dépôt : lint, format check, typecheck, tests unitaires, tests API, tests e2e clés et build des deux applications. Documenter ce qui a échoué et ne jamais déclarer tous les tests réussis si certaines commandes n'ont pas été exécutées.

---

## 18. Plan d'exécution obligatoire par Claude Code

### Phase 0 — Audit et proposition

- Inspecter le dépôt sans modifier le code.
- Présenter stack actuelle, routes, composants réutilisables, variables requises et problèmes.
- Identifier les informations métier manquantes sans inventer de contenu.
- Proposer la structure cible et les risques de migration.
- Établir une liste d'étapes vérifiables.

### Phase 1 — Fondation technique

- Stabiliser configurations, TypeScript strict, conventions, scripts et fichiers d'environnement.
- Mettre en place l'API Express dans `/backend`, connexion MongoDB, santé API, logs, validation et gestion d'erreurs.
- Créer les contrats/types entre frontend et API de façon cohérente.
- Ajouter README et `CLAUDE.md`.
- Vérifier le build avant de construire les fonctionnalités.

### Phase 2 — Design system et pages publiques

- Définir la direction graphique complète et les tokens.
- Construire header, footer, CTA, boutons, formulaires, cartes et layouts.
- Implémenter l'accueil, projets, études de cas, à propos, services, tarifs, Lab et contact.
- Brancher les données sur l'API ; pas de données de démonstration trompeuses en production.
- Tester responsive, accessibilité et performance.

### Phase 3 — Conversion et automations

- Implémenter la qualification multiétape.
- Créer le prospect en base avec idempotence appropriée.
- Configurer Resend, emails, notifications et logs de livraison.
- Configurer le lien WhatsApp.
- Intégrer Cal.com, webhooks vérifiés, réservations et statuts.
- Documenter les étapes manuelles de configuration des fournisseurs.

### Phase 4 — Authentification et avis

- Intégrer Better Auth avec MongoDB et Express selon la documentation stable.
- Configurer Google OAuth et la connexion email si retenue.
- Implémenter l'accès sécurisé aux avis, la modération et le marquage client vérifié.
- Tester les permissions et limiter les abus.

### Phase 5 — Administration

- Protéger le routeur admin côté API.
- Implémenter modules projets, tarifs, services, avis, prospects, réservations, réglages et articles selon le périmètre activé.
- Prévoir les états brouillon, publication, erreur et confirmation.
- Tester les actions destructives et permissions.

### Phase 6 — SEO, analytics et instrumentation

- Metadonnées, sitemap, robots, canonical, partage social et données structurées pertinentes.
- Événements de conversion sans envoyer de contenu personnel.
- Sentry et suivi d'erreurs.
- Mesures de performance et vérifications d'accessibilité.

### Phase 7 — Audit et livraison

- Exécuter lint, typecheck, tests, e2e et builds.
- Tester sur vrais formats mobiles et desktop.
- Vérifier sécurité, CORS, cookies, secrets et webhooks.
- Vérifier tous les CTA et tous les formulaires.
- Produire une liste claire : terminé, à configurer manuellement, non terminé, risques connus.
- Documenter déploiement frontend/backend, variables, migrations/backups et procédure de rollback.

### Règle de rythme

À la fin de chaque phase, résume les fichiers importants modifiés, les décisions prises, les tests réellement exécutés et les blocages. Ne passe pas silencieusement à une phase suivante si la phase actuelle ne build pas ; répare ou documente explicitement le blocage.

---

## 19. Critères d'acceptation finaux

Le projet n'est accepté que si les points suivants sont vérifiés :

### Expérience visuelle

- [ ] L'identité est cohérente et premium, sans effets criards ou décorations gratuites.
- [ ] Les animations sont fluides, légères, réduites si demandé et n'empêchent jamais l'utilisation.
- [ ] Toutes les pages principales fonctionnent de 320 px à grand écran.
- [ ] Les projets et études de cas sont lisibles et présentent uniquement des informations validées.

### Conversion

- [ ] Tous les CTA aboutissent à une action réelle.
- [ ] Le formulaire de contact valide les champs, enregistre la demande côté serveur et confirme le résultat.
- [ ] Le lien WhatsApp contient le numéro configuré et un message bien encodé.
- [ ] Cal.com gère les disponibilités ; les webhooks sont validés et idempotents.
- [ ] Les emails sont réels en environnement configuré, avec échec observable et gestion des doublons.
- [ ] Les tarifs sont administrables et aucun prix non confirmé n'est inventé.

### Avis et authentification

- [ ] La consultation des avis publics ne requiert pas de compte.
- [ ] Un utilisateur doit être authentifié pour poster un avis.
- [ ] Un avis reste en attente jusqu'à approbation.
- [ ] Seul l'admin ou un processus fiable peut déclarer un client vérifié.
- [ ] Un utilisateur standard ne peut jamais appeler les fonctions admin.

### Backend et données

- [ ] `/backend` contient l'API Express métier.
- [ ] MongoDB est connecté de façon sécurisée ; les index utiles sont présents.
- [ ] Les entrées sont validées et les erreurs ont un format uniforme.
- [ ] Les secrets restent côté serveur et ne figurent pas dans Git ni dans les logs.
- [ ] UploadThing reconnaît la variable `UPLOADTHING8TOKEN` via le mapping documenté et fonctionne pour les types d'upload autorisés.
- [ ] Les routes de fichiers vérifient leur autorisation et les limites.

### Qualité technique

- [ ] Lint, typecheck et builds passent.
- [ ] Les tests unitaires, API et parcours e2e prioritaires passent ou les échecs restants sont précisément listés.
- [ ] SEO, sitemap, OG, robots, 404 et pages privées sont vérifiés.
- [ ] Accessibilité clavier et réduction des animations testées.
- [ ] Performance vérifiée sur les pages clés.
- [ ] README et `.env.example` permettent de lancer le projet sans deviner la configuration.

---

## 20. Documentation officielle à consulter

Les versions, conventions et intégrations peuvent évoluer. Vérifier la documentation à la version réellement installée ; ne pas copier un exemple obsolète sans le tester.

- Next.js App Router : https://nextjs.org/docs/app
- Next.js Route Handlers : https://nextjs.org/docs/app/getting-started/route-handlers
- Tailwind CSS : https://tailwindcss.com/docs
- shadcn/ui : https://ui.shadcn.com/docs
- Motion for React : https://motion.dev/docs/react
- GSAP : https://gsap.com/docs/v3/
- MongoDB : https://www.mongodb.com/docs/
- Mongoose : https://mongoosejs.com/docs/
- Express : https://expressjs.com/
- Better Auth / Express : https://better-auth.com/docs/integrations/express
- Better Auth / MongoDB : https://better-auth.com/docs/adapters/mongo
- UploadThing / Express : https://docs.uploadthing.com/backend-adapters/express
- UploadThing / Next.js App Router (référence de compatibilité) : https://docs.uploadthing.com/getting-started/appdir
- Resend Node SDK : https://resend.com/docs/send-with-nodejs
- Cal.com Embed : https://cal.com/features/embed
- Cal.com Webhooks : https://cal.com/docs/developing/guides/automation/webhooks
- PostHog / Next.js : https://posthog.com/docs/libraries/next-js
- Sentry : https://docs.sentry.io/
- Playwright : https://playwright.dev/docs/intro
- Vitest : https://vitest.dev/guide/
- Web Vitals : https://web.dev/articles/vitals

---

## Résumé de priorité

**Ne commence pas par les effets 3D.** Commence par l'audit, le contenu, l'architecture, le design system et les pages qui prouvent la valeur. Ensuite, rends le parcours de contact réellement opérationnel, puis ajoute authentification, avis, administration, analytics et motion plus complexe. La qualité finale se juge sur la cohérence de l'ensemble, la crédibilité, la conversion, la sécurité et les tests — pas sur le nombre de dépendances ou d'animations.
