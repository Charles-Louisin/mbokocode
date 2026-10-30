// Assemble des images en planche contact (pour relire captures et images fixes).
// Usage : node scripts/sheet.mjs sortie.png image1.jpg image2.jpg …
import { readFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const [out, ...files] = process.argv.slice(2);
const cells = files.map((f) => ({ label: path.basename(f), src: `data:image/jpeg;base64,${readFileSync(f).toString("base64")}` }));
const cols = Math.min(6, cells.length);
const html = `<body style="margin:0;background:#333;font:12px sans-serif;color:#eee;display:grid;grid-template-columns:repeat(${cols},270px);gap:6px;padding:6px;width:max-content">${cells
  .map((c) => `<figure style="margin:0"><img src="${c.src}" style="display:block;width:270px"><figcaption>${c.label}</figcaption></figure>`)
  .join("")}</body>`;
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 400, height: 300 } });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(out);
