// Une image de notre vidéo (l'accroche), pour la montrer dans le fil TikTok de l'excuse n° 3.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Mboko", browserExecutable: CHROME });
await renderStill({ composition, serveUrl, output: path.resolve("public/img/feed-frame.jpg"), frame: Math.round(2.9 * 30), imageFormat: "jpeg", jpegQuality: 90, scale: 0.5, browserExecutable: CHROME });
console.log("public/img/feed-frame.jpg");
