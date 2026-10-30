// Planche contact : extrait des images d'une ou plusieurs vidéos et les assemble en une seule image.
// Usage : node scripts/contact.mjs sortie.png colonnes largeur fichier.mp4@t1,t2,… [fichier2.mp4@…]
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const FFMPEG = path.resolve("node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe");
const [out, cols, width, ...specs] = process.argv.slice(2);
const dir = path.resolve("work/contact");
mkdirSync(dir, { recursive: true });

const cells = [];
for (const spec of specs) {
  const [file, times] = spec.split("@");
  for (const t of times.split(",")) {
    const png = path.join(dir, `${path.basename(file, ".mp4")}_${t}.png`);
    execFileSync(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error", "-ss", t, "-i", file, "-frames:v", "1", "-vf", `scale=${width}:-2`, png]);
    cells.push({ label: `${path.basename(file)} @ ${t}s`, src: `data:image/png;base64,${readFileSync(png).toString("base64")}` });
  }
}
const html = `<body style="margin:0;background:#222;font:12px sans-serif;color:#ddd;display:grid;grid-template-columns:repeat(${cols},${width}px);gap:6px;padding:6px;width:max-content">${cells
  .map((c) => `<figure style="margin:0"><img src="${c.src}" style="display:block;width:${width}px"><figcaption>${c.label}</figcaption></figure>`)
  .join("")}</body>`;
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 400, height: 300 } });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(out);
