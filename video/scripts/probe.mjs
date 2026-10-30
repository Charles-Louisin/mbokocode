import { chromium } from "playwright";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const ctx = await browser.newContext({ viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
for (const url of ["/", "/projets", "/lab", "/tarifs"]) {
  const res = await page.goto("https://mbokocode.site" + url, { waitUntil: "networkidle" });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const sections = await page.evaluate(() =>
    [...document.querySelectorAll("main section, main h2")].map(
      (e) => `${e.tagName} ${Math.round(e.getBoundingClientRect().top + scrollY)} ${(e.getAttribute("aria-labelledby") || e.textContent || "").trim().slice(0, 60)}`,
    ),
  );
  console.log(url, res.status(), "height", h);
  console.log(sections.join("\n"));
}
await page.goto("https://mbokocode.site/", { waitUntil: "networkidle" });
await page.waitForTimeout(300);
await page.screenshot({ path: "capture/probe-home.png" });
await browser.close();
