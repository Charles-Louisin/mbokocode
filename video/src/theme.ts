import { cancelRender, continueRender, delayRender, Easing, interpolate, staticFile } from "remotion";

// Thème clair : papier, encre et le cobalt de MBOKO CODE (app/globals.css du site, version jour).
export const C = {
  paper: "#f4f5f8",
  paper2: "#e8ebf2",
  line: "#d5d9e3",
  ink: "#0b1326",
  ink2: "#2a3350",
  steel: "#6b7590",
  cobalt: "#2f54ff",
  deep: "#1f3fd6",
  ciel: "#9db0ff",
  wash: "#e4e9ff",
  white: "#ffffff",
  danger: "#e2604a",
  success: "#1fa36a",
  // Couleurs propres à chaque produit montré.
  koumale: "#f7941d",
  fripcash: "#c8623f",
  chat: "#1fa855",
};

export const FPS = 30;
export const W = 1080;
export const H = 1920;

// La voix est coupée après l'accroche pour laisser passer l'intro signée, puis reprend.
export const SPLIT = 3.5; // instant de la coupe dans le fichier de voix (s)
export const INTRO_AT = 3.45; // l'intro commence ici dans la vidéo
export const INTRO_DUR = 2.25;
export const VOICE_END = 119.65;
/** Temps vidéo d'un instant du fichier de voix. */
export const vt = (audio: number) => (audio < SPLIT ? audio : audio - SPLIT + INTRO_AT + INTRO_DUR);
// La signature (fichier à part) commence un peu après la dernière phrase.
export const OUTRO_AT = vt(VOICE_END) + 0.45;
export const OUTRO_DUR = 6.4;
export const VIDEO_SECONDS = OUTRO_AT + OUTRO_DUR;

// Courbes du site : --ease-expo pour les entrées, --ease-in-out-quart pour les transitions.
export const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
export const QUART = Easing.bezier(0.76, 0, 0.24, 1);
export const IN = Easing.bezier(0.5, 0, 0.75, 0);
export const BACK = Easing.bezier(0.34, 1.56, 0.64, 1);

/** Progression 0 → 1 entre deux instants (en secondes), avec une courbe. */
export const prog = (t: number, from: number, dur: number, easing = EXPO) =>
  interpolate(t, [from, from + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export const FONT = "Archivo, sans-serif";
export const SERIF = "Fraunces, serif";

// Les fichiers Archivo (axe de largeur 62–125 %) et Fraunces italique du build du site. Le rendu
// attend leur chargement avant la première image.
const FACES: [string, string, FontFaceDescriptors][] = [
  ["Archivo", "fonts/archivo-latin.woff2", { weight: "100 900", stretch: "62% 125%", unicodeRange: "U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2212" }],
  ["Archivo", "fonts/archivo-latin-ext.woff2", { weight: "100 900", stretch: "62% 125%", unicodeRange: "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+20A0-20AB,U+20AD-20C4" }],
  ["Fraunces", "fonts/fraunces-italic-latin.woff2", { weight: "100 900", style: "italic" }],
];

export function loadFonts() {
  if (typeof document === "undefined") return;
  const handle = delayRender("Polices du site");
  Promise.all(
    FACES.map(async ([family, file, descriptors]) => {
      const face = new FontFace(family, `url(${staticFile(file)}) format("woff2")`, descriptors);
      document.fonts.add(await face.load());
    }),
  )
    .then(() => continueRender(handle))
    .catch((error) => cancelRender(error));
}
