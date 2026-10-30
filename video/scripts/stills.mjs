// Rend une série d'images fixes (temps en secondes) et les assemble en planche contact.
// Usage : node scripts/stills.mjs sortie.png 1.2 3.4 5.6 …
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const [out, ...times] = process.argv.slice(2);
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Mboko", browserExecutable: CHROME });
mkdirSync("work/stills", { recursive: true });
const cells = [];
for (const time of times) {
  const file = path.resolve(`work/stills/${time}.jpeg`);
  await renderStill({ composition, serveUrl, output: file, frame: Math.round(+time * 30), imageFormat: "jpeg", jpegQuality: 80, scale: 0.25, browserExecutable: CHROME });
  cells.push({ label: `${time}s`, src: `data:image/jpeg;base64,${readFileSync(file).toString("base64")}` });
}
const cols = Math.min(6, cells.length);
const html = `<body style="margin:0;background:#333;font:13px sans-serif;color:#eee;display:grid;grid-template-columns:repeat(${cols},270px);gap:6px;padding:6px;width:max-content">${cells
  .map((c) => `<figure style="margin:0"><img src="${c.src}" style="display:block;width:270px"><figcaption>${c.label}</figcaption></figure>`)
  .join("")}</body>`;
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 400, height: 300 } });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(out);
