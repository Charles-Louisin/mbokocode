// Filme les sites (Chrome installé, sans téléchargement de navigateur) : chaque prise est
// enregistrée image par image via le screencast de Chrome, puis assemblée en MP4 30 i/s.
// Usage : node scripts/capture.mjs [nom de prise…]
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const SITE = "https://mbokocode.site";
const FFMPEG = path.resolve("node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe");
const OUT = path.resolve("public/capture");
mkdirSync(OUT, { recursive: true });

const MOBILE = { viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true };

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });

async function open(device, { intro = false } = {}) {
  const ctx = await browser.newContext({ ...device, reducedMotion: "no-preference", locale: "fr-FR" });
  // Le loader ne se joue qu'une fois par session : on le saute sauf pour la prise dédiée.
  if (!intro) await ctx.addInitScript(() => sessionStorage.setItem("mboko-intro", "1"));
  // La barre d'actions flottante masquerait le contenu filmé.
  await ctx.addInitScript(() =>
    document.addEventListener("DOMContentLoaded", () => {
      const style = document.createElement("style");
      style.textContent = '[aria-label="Actions rapides"],[aria-label="Revenir en haut de la page"]{display:none!important}';
      document.head.append(style);
    }),
  );
  const page = await ctx.newPage();
  return { ctx, page };
}

async function record(page, name, size, action) {
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on("Page.screencastFrame", (frame) => {
    frames.push({ data: frame.data, t: frame.metadata.timestamp });
    cdp.send("Page.screencastFrameAck", { sessionId: frame.sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: size.w, maxHeight: size.h, everyNthFrame: 1 });
  const start = Date.now() / 1000;
  await action();
  await cdp.send("Page.stopScreencast");
  const end = Date.now() / 1000;

  const dir = path.join("work", "frames", name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  // Durée de chaque image = écart jusqu'à la suivante (le screencast n'émet qu'aux changements).
  const lines = [];
  frames.forEach((frame, i) => {
    const file = `${String(i).padStart(5, "0")}.jpg`;
    writeFileSync(path.join(dir, file), Buffer.from(frame.data, "base64"));
    const next = frames[i + 1]?.t ?? Math.max(frame.t + 1 / 30, end - (start - frames[0].t) * 0);
    lines.push(`file '${file}'`, `duration ${Math.max(0.001, next - frame.t).toFixed(4)}`);
  });
  lines.push(`file '${String(frames.length - 1).padStart(5, "0")}.jpg'`);
  writeFileSync(path.join(dir, "list.txt"), lines.join("\n"));
  const target = path.join(OUT, `${name}.mp4`);
  execFileSync(FFMPEG, [
    "-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", path.join(dir, "list.txt"),
    "-vf", `scale=${size.w}:${size.h}:flags=lanczos,format=yuv420p`, "-r", "30", "-fps_mode", "cfr",
    "-c:v", "libx264", "-preset", "slow", "-crf", "14", target,
  ]);
  console.log(`${name}: ${frames.length} images, ${(end - start).toFixed(1)} s → ${path.relative(process.cwd(), target)}`);
}

// Défilement doux piloté dans la page (easeInOutCubic), pour une caméra stable.
const glide = (page, to, ms) =>
  page.evaluate(
    ([to, ms]) =>
      new Promise((resolve) => {
        const from = scrollY;
        const t0 = performance.now();
        const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
        const step = (now) => {
          const p = Math.min(1, (now - t0) / ms);
          scrollTo(0, from + (to - from) * ease(p));
          p < 1 ? requestAnimationFrame(step) : resolve();
        };
        requestAnimationFrame(step);
      }),
    [to, ms],
  );
const topOf = (page, selector) => page.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().top + scrollY), selector);

// Réveille les animations au défilement (une passe rapide), puis revient en haut.
async function warm(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(600);
}

const M = { w: 1080, h: 1920 };

const takes = {
  // FripCash : le hero et les catégories (les « Articles populaires » commencent par des produits de test).
  async fripcash() {
    const { ctx, page } = await open(MOBILE);
    await page.goto("https://fripcash.vercel.app/", { waitUntil: "networkidle" }).catch(() => {});
    await warm(page);
    const categories = await page.evaluate(() => {
      const h = [...document.querySelectorAll("h2")].find((e) => e.textContent.includes("Explorer les catégories"));
      return Math.round(h.getBoundingClientRect().top + scrollY);
    });
    await record(page, "fripcash", M, async () => {
      await page.waitForTimeout(1500);
      await glide(page, categories - 140, 2600);
      await page.waitForTimeout(2500);
    });
    // Les vraies photos produit (hors articles de test), pour la notification de commande.
    mkdirSync("public/img/fripcash", { recursive: true });
    const products = await page.evaluate(() =>
      [...document.images]
        .map((img, i) => {
          const card = img.closest("a, article, li") ?? img.parentElement?.parentElement;
          return { i, src: img.currentSrc || img.src, text: (card?.textContent ?? "").trim().slice(0, 80), w: img.naturalWidth };
        })
        .filter((p) => /cloudinary/.test(p.src) && !/categories/.test(p.src) && p.w > 200 && !/^test/i.test(p.text)),
    );
    for (const [n, p] of products.slice(0, 6).entries()) {
      const handle = page.locator("img").nth(p.i);
      await handle.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await handle.screenshot({ path: `public/img/fripcash/produit-${n + 1}.jpg`, type: "jpeg", quality: 92 });
      console.log(`produit-${n + 1}: ${p.text}`);
    }
    await ctx.close();
  },

  // CASHGLASS : page d'accueil et ses données d'exemple.
  async cashglass() {
    const { ctx, page } = await open(MOBILE);
    await page.goto("https://cashglass.vercel.app/", { waitUntil: "networkidle" }).catch(() => {});
    await warm(page);
    // Le site gère son propre défilement : on fait tourner la molette, par petits crans.
    await page.mouse.move(216, 400);
    await record(page, "cashglass", M, async () => {
      await page.waitForTimeout(1500);
      for (let i = 0; i < 70; i++) {
        await page.mouse.wheel(0, 32);
        await page.waitForTimeout(80);
      }
      await page.waitForTimeout(800);
    });
    await ctx.close();
  },

  // Easybank : landing d'une banque en ligne.
  async easybank() {
    const { ctx, page } = await open(MOBILE);
    await page.goto("https://easybank-woad-chi.vercel.app/", { waitUntil: "networkidle" });
    await warm(page);
    await record(page, "easybank", M, async () => {
      await page.waitForTimeout(800);
      await glide(page, 1900, 6000);
    });
    await ctx.close();
  },

  // BibleVerse : application de lecture.
  async bibleverse() {
    const { ctx, page } = await open(MOBILE);
    await page.goto("https://bibleverse-nine.vercel.app/", { waitUntil: "networkidle" }).catch(() => {});
    await warm(page);
    await record(page, "bibleverse", M, async () => {
      await page.waitForTimeout(800);
      await glide(page, 1500, 5000);
    });
    await ctx.close();
  },

  // mbokocode.site : le hero qui s'anime tout seul.
  async hero() {
    const { ctx, page } = await open(MOBILE);
    await page.goto(SITE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    await record(page, "hero", M, async () => {
      await page.waitForTimeout(4500);
    });
    await ctx.close();
  },

  // mbokocode.site : la sélection de projets et leurs dossiers.
  async folders() {
    const { ctx, page } = await open(MOBILE);
    await page.goto(SITE + "/", { waitUntil: "networkidle" });
    await warm(page);
    const selection = await topOf(page, "#selection-title");
    await page.evaluate((y) => scrollTo(0, y), selection - 120);
    await page.waitForTimeout(800);
    await record(page, "folders", M, async () => {
      await page.waitForTimeout(400);
      await glide(page, selection + 1500, 5200);
      await page.waitForTimeout(300);
    });
    await ctx.close();
  },

  // mbokocode.site : la page Projets.
  async projects() {
    const { ctx, page } = await open(MOBILE);
    await page.goto(SITE + "/projets", { waitUntil: "networkidle" });
    await warm(page);
    await record(page, "projects", M, async () => {
      await page.waitForTimeout(500);
      await glide(page, 3000, 7000);
    });
    await ctx.close();
  },
};

const wanted = process.argv.slice(2);
for (const [name, take] of Object.entries(takes)) {
  if (wanted.length && !wanted.includes(name)) continue;
  await take();
}
await browser.close();
