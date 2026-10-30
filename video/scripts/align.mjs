// Cale chaque mot du script sur la voix off.
// 1. Les mots reconnus par scripts/recognize.ps1 (moteur hors ligne de Windows, vocabulaire limité
//    au texte) servent d'ancres : on les aligne sur le texte (programmation dynamique) et on ne garde
//    que les correspondances sûres et cohérentes dans le temps.
// 2. Entre deux ancres, les mots se partagent le temps de parole (silences retirés, détectés par
//    silencedetect) au prorata de leurs syllabes.
// Usage : node scripts/align.mjs <voix.wav> <reconnaissance.tsv> <sortie.json> [script|outro]
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { OUTRO, SCRIPT } from "../src/script.js";

const [wav, recog, out, which = "script"] = process.argv.slice(2);
const FFMPEG = path.resolve("node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe");
const blocks = which === "outro" ? [{ scene: "outro", text: OUTRO }] : SCRIPT;

// ─── Parole et silences ──────────────────────────────────────────────────────
const probe = spawnSync(FFMPEG, ["-hide_banner", "-i", wav, "-af", "silencedetect=n=-40dB:d=0.15", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const duration = +/Duration: (\d+):(\d+):([\d.]+)/.exec(probe).slice(1).reduce((s, v, i) => s + v * [3600, 60, 1][i], 0);
const silences = [];
for (const m of probe.matchAll(/silence_start: ([\d.]+)[\s\S]*?silence_end: ([\d.]+)/g)) silences.push([+m[1], +m[2]]);
const speechBetween = (a, b) => {
  let s = b - a;
  for (const [x, y] of silences) s -= Math.max(0, Math.min(b, y) - Math.max(a, x));
  return Math.max(0, s);
};
// Instant (en secondes) où l'on a accumulé `amount` secondes de parole depuis `a`.
const advance = (a, amount) => {
  let t = a;
  let left = amount;
  for (const [x, y] of silences.filter(([, y]) => y > a).sort((p, q) => p[0] - q[0])) {
    if (x > t) {
      const run = x - t;
      if (run >= left) return t + left;
      left -= run;
    }
    t = Math.max(t, y);
  }
  return t + left;
};

// ─── Mots du script ──────────────────────────────────────────────────────────
const syllables = (word) => {
  const w = word.toLowerCase().replace(/[^a-zàâäéèêëîïôöùûüÿœæ']/g, "");
  let groups = (w.match(/[aeiouyàâäéèêëîïôöùûüÿœæ]+/g) ?? []).length;
  if (/[bcdfghjklmnpqrstvwxzç]es?$/.test(w) && groups > 1) groups -= 1;
  if (/[bcdfghjklmnpqrstvwxzç]ent$/.test(w) && groups > 1 && !/^(ment|cent|lent|dent|vent|souvent)$/.test(w)) groups -= 1;
  return Math.max(1, groups);
};
const SPOKEN = { "mbokocode.site": 6, "1900": 4, "ui/ux": 4, dm: 2, tiktok: 2, koumale: 3, whatsapp: 2, mboko: 2, code: 1 };
const norm = (text) => text.toLowerCase().replace(/[«»…?!.,:; ]/g, "").trim();

const words = [];
blocks.forEach((block, b) =>
  block.text
    // Guillemets et ponctuation haute restent collés au mot voisin.
    .replace(/« /g, "« ")
    .replace(/ »/g, " »")
    .replace(/ ([?:!;])/g, " $1")
    .split(/ +/)
    .filter(Boolean)
    .forEach((text) => {
      const key = norm(text);
      words.push({ text, key, block: b, syl: SPOKEN[key] ?? syllables(key) });
    }),
);

// ─── Ancres : alignement texte ↔ reconnaissance ──────────────────────────────
const heard = readFileSync(recog, "utf8")
  .trim()
  .split(/\r?\n/)
  .map((line) => line.split("\t"))
  .map(([start, dur, text, conf]) => ({ start: +start, end: +start + +dur, key: norm(text), conf: +conf }));

const n = words.length;
const m = heard.length;
// Seuls les mots assez longs pour ne pas être confondus servent d'ancres.
const score = (i, j) => (words[i].key === heard[j].key && words[i].key.length >= 4 ? 2 + heard[j].conf : -Infinity);
const S = Array.from({ length: n + 1 }, () => new Float64Array(m + 1));
const from = Array.from({ length: n + 1 }, () => new Uint8Array(m + 1));
for (let i = 1; i <= n; i++)
  for (let j = 1; j <= m; j++) {
    const options = [S[i - 1][j], S[i][j - 1], S[i - 1][j - 1] + score(i - 1, j - 1)];
    const best = options.indexOf(Math.max(...options));
    S[i][j] = options[best];
    from[i][j] = best;
  }
let anchors = [];
for (let i = n, j = m; i > 0 && j > 0; ) {
  if (from[i][j] === 2) {
    anchors.unshift({ word: i - 1, start: heard[j - 1].start, end: heard[j - 1].end });
    i--;
    j--;
  } else if (from[i][j] === 0) i--;
  else j--;
}

// Une ancre qui impose un débit impossible avec ses voisines est une fausse reconnaissance.
const rateBetween = (a, b) => {
  const syl = words.slice(a.word, b.word).reduce((s, w) => s + w.syl, 0);
  return syl / Math.max(0.05, speechBetween(a.start, b.start));
};
for (let pass = 0; pass < 6; pass++) {
  const bad = anchors.filter((a, k) => {
    const prev = anchors[k - 1];
    const next = anchors[k + 1];
    const r1 = prev ? rateBetween(prev, a) : 6;
    const r2 = next ? rateBetween(a, next) : 6;
    return r1 > 11 || r2 > 11 || r1 < 2 || r2 < 2;
  });
  if (!bad.length) break;
  anchors = anchors.filter((a) => !bad.includes(a));
}

// Bornes : début de la première parole et fin de la dernière.
const firstSpeech = silences[0]?.[0] < 0.05 ? silences[0][1] : 0;
const last = silences.at(-1);
// Un bruit de moins de 0,3 s après le dernier silence (arrêt de l'enregistrement) ne compte pas.
const lastSpeech = last && last[1] >= duration - 0.3 ? last[0] : duration;
let fixed = [{ word: 0, start: firstSpeech }, ...anchors.filter((a) => a.word > 0), { word: n, start: lastSpeech }];

// Les débuts de bloc et de phrase sans ancre se calent sur la reprise de parole la plus proche
// (fin d'un silence), si elle est assez près de l'estimation.
for (let pass = 0; pass < 2; pass++) {
  const estimate = distribute(fixed);
  const extra = [];
  words.forEach((w, i) => {
    if (i === 0 || fixed.some((f) => f.word === i)) return;
    const blockStart = w.block !== words[i - 1].block;
    if (!blockStart && !/[.?!…»]$/.test(words[i - 1].text)) return;
    const window = blockStart ? 1.5 : 0.5;
    const near = silences
      .filter(([x, y]) => y - x >= (blockStart ? 0.25 : 0.15) && Math.abs(y - estimate[i].start) <= window)
      .sort((p, q) => Math.abs(p[1] - estimate[i].start) - Math.abs(q[1] - estimate[i].start))[0];
    if (near) extra.push({ word: i, start: near[1] });
  });
  fixed = [...fixed, ...extra].sort((a, b) => a.word - b.word);
  // On garde l'ordre chronologique : une ancre qui recule est retirée.
  fixed = fixed.filter((f, k) => k === 0 || f.start > Math.max(...fixed.slice(0, k).map((g) => g.start)));
}

// ─── Répartition entre ancres ────────────────────────────────────────────────
const timed = distribute(fixed);

function distribute(fixed) {
  const timed = [];
  for (let k = 0; k < fixed.length - 1; k++) {
    const a = fixed[k];
    const b = fixed[k + 1];
    const slice = words.slice(a.word, b.word);
    const syl = slice.reduce((s, w) => s + w.syl, 0);
    const speech = speechBetween(a.start, b.start);
    let acc = 0;
    for (const w of slice) {
      const start = advance(a.start, (speech * acc) / syl);
      acc += w.syl;
      const end = advance(a.start, (speech * acc) / syl);
      timed.push({ text: w.text, block: w.block, start: +start.toFixed(3), end: +Math.min(end, b.start).toFixed(3) });
    }
  }
  // Un mot finit au plus tard quand le suivant commence.
  timed.forEach((w, i) => (w.end = Math.min(w.end, timed[i + 1]?.start ?? w.end)));
  return timed;
}

writeFileSync(out, JSON.stringify({ duration: +duration.toFixed(3), words: timed }, null, 1));
console.log(`${anchors.length} ancres sur ${n} mots`);
for (const b of blocks.keys()) {
  const ws = timed.filter((w) => w.block === b);
  console.log(`${ws[0].start.toFixed(2)}–${ws.at(-1).end.toFixed(2)}  ${ws.map((w) => w.text).join(" ").slice(0, 110)}`);
}
