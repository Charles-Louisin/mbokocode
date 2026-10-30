# Vidéos TikTok MBOKO CODE

Montage en motion design (Remotion, rendu FFmpeg) calé sur la voix off de Charles.
Vidéo actuelle : « Je note tes excuses » (texte dans `script-tiktok.md` et `src/script.js`).

## Compositions

- `Mboko` : la vidéo complète (accroche, intro, cinq excuses, commentaire, abonnés, carte, signature).
- `MbokoIntro` : l'intro signée seule (2,25 s, avec son « ta-dum »), à poser devant chaque vidéo.
- `MbokoOutro` : la signature de fin seule, avec sa voix (`public/audio/outro.wav`).

## Refaire la vidéo

Tout se lance depuis ce dossier, avec le Chrome installé (aucun navigateur téléchargé). Le FFmpeg utilisé
est celui fourni avec Remotion : `node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe`.

1. `npm install`
2. Voix : extraire la piste 2 de l'enregistrement en `work/v2_s1.wav` (48 kHz) et sa version 16 kHz en
   `work/voice2_16k.wav`, puis la version normalisée à −14 LUFS en `public/audio/voice.wav`.
   Même chose pour la signature (`public/audio/outro.wav`).
3. Reconnaissance vocale hors ligne (moteur français de Windows), limitée aux mots du texte :
   `powershell -File scripts/recognize.ps1 -wav <voix 16 kHz> -out work/recog_vocab.tsv -vocab work/vocab.txt`
4. `node scripts/align.mjs work/v2_s1.wav work/recog_vocab.tsv src/timing.json` : cale chaque mot.
   Pour la signature : `node scripts/align.mjs work/outro_s0.wav work/recog_outro.tsv src/timing-outro.json outro`.
5. `node scripts/capture.mjs` : filme CASHGLASS, Easybank, BibleVerse et mbokocode.site → `public/capture/`.
6. `node scripts/map.mjs` : points de la carte du portfolio → `src/map.json`.
7. `node scripts/sfx.mjs` : génère l'habillage sonore (`sfx.wav`, `sfx-intro.wav`, `sfx-outro.wav`).
8. `npm run studio` pour prévisualiser ; `npm run render`, `npm run render:intro`, `npm run render:outro`
   pour exporter dans `out/`.

`node scripts/stills.mjs planche.png 1.2 3.4 …` rend des images fixes pour relire le montage.

Les écrans KOUMALE, FripCash, MES POCHES et le profil TikTok sont redessinés dans `src/screens.tsx`, avec des
données de démonstration (aucun vrai solde ni nom de client). Les photos produit viennent des captures
KOUMALE fournies, recadrées dans `public/img/koumale/`.
