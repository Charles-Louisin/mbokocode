# Prompt initial à donner à Claude Code

Tu dois travailler sur mon portfolio professionnel de Charles, développeur full-stack et fondateur de MBOKO CODE.

**Commence par lire intégralement `CAHIER_DES_CHARGES_PORTFOLIO_CHARLES_MBOKO_CODE.md` et applique-le comme référence principale.** Il définit les objectifs, le design, toutes les pages, les automatisations, la stack, la base de données, les API, l'authentification, la sécurité, les tests et les critères d'acceptation.

## Première mission — audit uniquement

Avant de modifier le code :

1. Inspecte intégralement le dépôt, y compris `package.json`, la configuration Next.js, les styles, les composants, les routes et tous les dossiers existants.
2. Vérifie l'existence du dossier `/backend`, l'état de son API Express et sa connexion éventuelle à MongoDB.
3. Identifie les dépendances déjà présentes et leurs versions. Ne remplace pas un outil fonctionnel sans nécessité démontrée.
4. Repère les pages et composants réutilisables, les défauts de design, les erreurs de build et les éventuelles fonctionnalités déjà opérationnelles.
5. Repère les variables d'environnement utilisées, sans jamais afficher leurs valeurs secrètes.
6. Compare l'état du projet au cahier des charges et fournis un rapport : existant, manquant, à corriger, risques, décisions techniques proposées et plan de travail par phases.
7. N'invente aucun contenu, témoignage, chiffre, prix, résultat, client ou URL. Liste les informations manquantes à fournir.

**Ne commence pas encore la refonte complète pendant cet audit.** Après le rapport, propose la première phase concrète avec sa liste de fichiers, ses critères d'acceptation et les tests qui permettront de la valider. Attends mon retour sur le plan avant d'entreprendre une modification massive.

## Contraintes à ne jamais oublier

- Next.js App Router à la racine du projet.
- API métier Express.js dans `/backend` à la racine.
- MongoDB pour la persistance.
- UploadThing pour les fichiers ; la variable que je veux utiliser est `UPLOADTHING8TOKEN`. La documentation standard utilise généralement `UPLOADTHING_TOKEN`, donc assure une compatibilité côté serveur sans exposer le secret.
- Utiliser des outils stables et leurs documentations officielles à jour.
- Le design doit être haut de gamme, éditorial, fluide et immersif, mais lisible et rapide. Évite le glassmorphism omniprésent, les néons, les gradients criards et les sphères 3D décoratives qui tournent au curseur.
- Les animations ne doivent pas bloquer le contenu ni dégrader le mobile ; respecte `prefers-reduced-motion`.
- Les formulaires, connexions, avis, WhatsApp, uploads, emails, réservations et actions admin doivent fonctionner réellement. Aucun bouton factice.
- Les avis sont authentifiés, modérés et le badge « client vérifié » n'est attribué qu'après vérification réelle.
- Tous les secrets restent côté serveur ; validation Zod, autorisation côté API, limitation de débit, logs sans données sensibles et tests de sécurité.
- À chaque phase : résume les changements, exécute les vérifications disponibles et indique précisément ce qui reste à faire.
