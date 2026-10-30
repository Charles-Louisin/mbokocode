// Habillage sonore synthétisé (aucun son téléchargé, donc aucun droit à gérer) : le « ta-dum » de
// l'intro, feuilles et téléphones qui passent, bulles, notifications, touches, tampons, avions.
// Les instants suivent les mêmes repères que les scènes (src/scenes/*, src/theme.ts).
// Écrit public/audio/sfx.wav (vidéo complète), sfx-intro.wav et sfx-outro.wav (blocs seuls).
import { readFileSync, writeFileSync } from "node:fs";

const RATE = 48000;
// Mêmes constantes que src/theme.ts.
const SPLIT = 3.5;
const INTRO_AT = 3.45;
const INTRO_DUR = 2.25;
const VOICE_END = 119.65;
const vt = (a) => (a < SPLIT ? a : a - SPLIT + INTRO_AT + INTRO_DUR);
const OUTRO_AT = vt(VOICE_END) + 0.45;
const OUTRO_DUR = 6.4;
const DURATION = OUTRO_AT + OUTRO_DUR;

const norm = (s) => s.toLowerCase().replace(/[«» ]/g, "").replace(/[\s .,:;?!…]+$/, "").trim();
const load = (file, shift) => JSON.parse(readFileSync(file, "utf8")).words.map((w) => ({ ...w, start: shift(w.start) }));
const words = load("src/timing.json", vt);
const outroWords = load("src/timing-outro.json", (x) => x);
const find = (list, block, text, nth = 0) => {
  const hit = list.filter((w) => w.block === block && norm(w.text) === norm(text))[nth];
  if (!hit) throw new Error(`${block} ${text}`);
  return hit;
};
const cue = (block, text, nth = 0) => find(words, block, text, nth).start;
const cueEnd = (block, text, nth = 0) => find(words, block, text, nth).end;
const blockStart = (b) => words.find((w) => w.block === b).start;

// ─── Synthèse ────────────────────────────────────────────────────────────────
let out;
let seed = 7;
const noise = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32) * 2 - 1;
const add = (i, v) => i >= 0 && i < out.length && (out[i] += v);

function whoosh(t0, dur = 0.6, gain = 0.14, low = 250, high = 2600) {
  let lp = 0;
  let bp = 0;
  const n = Math.round(dur * RATE);
  const start = Math.round(t0 * RATE);
  for (let i = 0; i < n; i++) {
    const x = i / n;
    const f = low + (high - low) * Math.sin(Math.PI * Math.min(1, x * 1.15));
    const k = 2 * Math.sin((Math.PI * f) / RATE);
    const hp = noise() - lp - 0.9 * bp;
    bp += k * hp;
    lp += k * bp;
    const env = x < 0.6 ? (x / 0.6) ** 2 : Math.exp(-(x - 0.6) * 9);
    add(start + i, bp * env * gain);
  }
}
/** Souffle qui monte jusqu'à la fin (plongée de l'intro). */
function riser(t0, dur, gain = 0.12) {
  let lp = 0;
  let bp = 0;
  const n = Math.round(dur * RATE);
  const start = Math.round(t0 * RATE);
  for (let i = 0; i < n; i++) {
    const x = i / n;
    const f = 300 + 3500 * x * x;
    const k = 2 * Math.sin((Math.PI * f) / RATE);
    const hp = noise() - lp - 0.8 * bp;
    bp += k * hp;
    lp += k * bp;
    add(start + i, bp * x * x * gain);
  }
}
function thump(t0, gain = 0.5, base = 42) {
  const n = Math.round(0.6 * RATE);
  const start = Math.round(t0 * RATE);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const s = i / RATE;
    phase += (2 * Math.PI * (base + 50 * Math.exp(-s / 0.05))) / RATE;
    const click = s < 0.004 ? noise() * (1 - s / 0.004) * 0.25 : 0;
    add(start + i, (Math.sin(phase) * Math.exp(-s / 0.15) + click) * gain);
  }
}
function tick(t0, gain = 0.06, freq = 2200) {
  const n = Math.round(0.04 * RATE);
  const start = Math.round(t0 * RATE);
  const f = freq * (0.9 + Math.abs(noise()) * 0.2);
  for (let i = 0; i < n; i++) {
    const s = i / RATE;
    add(start + i, Math.sin(2 * Math.PI * f * s) * Math.exp(-s / 0.008) * gain);
  }
}
function pop(t0, gain = 0.12, f0 = 520, f1 = 1020) {
  const n = Math.round(0.09 * RATE);
  const start = Math.round(t0 * RATE);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const s = i / RATE;
    phase += (2 * Math.PI * (f0 + (f1 - f0) * (s / 0.09))) / RATE;
    add(start + i, Math.sin(phase) * Math.exp(-s / 0.03) * gain);
  }
}
/** Note de cloche (sinus + harmonique), pour les carillons et le « ta-dum ». */
function bell(t0, freq, gain = 0.1, decay = 0.5) {
  const n = Math.round(decay * 4 * RATE);
  const start = Math.round(t0 * RATE);
  for (let i = 0; i < n; i++) {
    const s = i / RATE;
    const env = Math.min(1, s / 0.004) * Math.exp(-s / decay);
    add(start + i, (Math.sin(2 * Math.PI * freq * s) + 0.35 * Math.sin(2 * Math.PI * freq * 2.01 * s) + 0.12 * Math.sin(2 * Math.PI * freq * 3.02 * s)) * env * gain);
  }
}
const ding = (t0, gain = 0.09) => (bell(t0, 1318.5, gain, 0.25), bell(t0 + 0.11, 1760, gain, 0.35));
const success = (t0, gain = 0.08) => (bell(t0, 784, gain, 0.2), bell(t0 + 0.08, 1046.5, gain, 0.2), bell(t0 + 0.16, 1568, gain, 0.4));
const beep = (t0, gain = 0.07) => bell(t0, 1975, gain, 0.06);
function stamp(t0, gain = 0.4) {
  thump(t0, gain, 70);
  const n = Math.round(0.05 * RATE);
  const start = Math.round(t0 * RATE);
  for (let i = 0; i < n; i++) add(start + i, noise() * (1 - i / n) * gain * 0.35);
}
function crickets(t0, dur, gain = 0.03) {
  for (let c = t0; c < t0 + dur; c += 0.45) for (let k = 0; k < 4; k++) bell(c + k * 0.035, 4400, gain, 0.012);
}
const typing = (from, text, cps, gain = 0.05) => [...text].forEach((_, i) => tick(from + i / cps, gain, 1600));

/** Le « ta-dum » MBOKO CODE : deux impacts ronds et deux notes claires (quinte montante). */
function taDum(t0, gain = 1) {
  thump(t0, 0.5 * gain, 48);
  bell(t0, 659.3, 0.11 * gain, 0.35);
  thump(t0 + 0.24, 0.6 * gain, 38);
  bell(t0 + 0.24, 987.8, 0.12 * gain, 0.8);
  bell(t0 + 0.24, 493.9, 0.07 * gain, 0.8);
}

function intro(at) {
  tick(at, 0.08, 2600);
  tick(at + 0.24, 0.08, 2600);
  whoosh(at + 0.38, 0.6, 0.08, 400, 2400);
  taDum(at + 0.93);
  for (let i = 0; i < 10; i++) if (i !== 5) tick(at + 1.15 + i * 0.03, 0.04, 2400);
  riser(at + 1.6, 0.6, 0.1);
}

function outro(at) {
  const o = (text) => at + find(outroWords, 0, text).start;
  whoosh(at + 0.02, 0.5, 0.06, 400, 2200);
  taDum(at + 0.45, 0.8);
  for (let i = 0; i < 10; i++) if (i !== 5) tick(o("MBOKO") + i * 0.03, 0.035, 2400);
  whoosh(o("Allez,") - 0.15, 0.6, 0.1);
  tick(o("abonne-toi.") + 0.35, 0.14, 900);
  success(o("abonne-toi.") + 0.4, 0.09);
}

function excuseCard(at, dockAt) {
  whoosh(at - 0.42, 0.5, 0.16, 200, 2400);
  thump(at - 0.02, 0.45);
  whoosh(dockAt, 0.55, 0.1, 300, 2000);
}
function bubble(at) {
  for (let i = 0; i < 3; i++) tick(at - 0.3 + i * 0.09, 0.03, 1200);
  pop(at, 0.12, 400, 900);
}
const phoneIn = (at) => whoosh(at, 0.5, 0.09, 200, 1600);

function full() {
  // Accroche.
  thump(cue(0, "Cinq") + 0.1, 0.45);
  pop(cue(0, "excuses"), 0.08);
  beep(cue(0, "site") + 0.1, 0.05);
  intro(INTRO_AT);

  // Excuse n° 5.
  {
    const q = cue(1, "J'ai");
    excuseCard(blockStart(1), q - 0.25);
    bubble(q);
    pop(cue(1, "Oui,"), 0.1, 700, 1400);
    const pIn = cue(1, "Le") - 0.3;
    phoneIn(pIn);
    const toProduct = cue(1, "boutique") + 0.45;
    tick(toProduct - 0.05, 0.12, 1000);
    const press = cue(1, "commande");
    tick(press, 0.12, 1000);
    ding(press + 0.3 + 0.4);
    pop(cue(1, "TON", 1), 0.1);
    const form = cue(1, "produit") - 0.2;
    typing(form + 0.15, "Paire Homme", 22);
    tick(form + 0.75, 0.08, 1000);
    typing(form + 1.0, "19000", 14);
    pop(form + 1.4, 0.08);
    tick(form + 1.8, 0.12, 1000);
    success(form + 1.95);
    const brand = cue(1, "KOUMALE.") - 0.05;
    whoosh(brand - 0.1, 0.5, 0.1);
    thump(brand + 0.05, 0.35);
    pop(cue(1, "licence"), 0.11);
    const schema = cue(1, "mais") - 0.1;
    for (let i = 0; i < 3; i++) pop(schema + 0.2 + i * 0.25, 0.08);
    pop(cue(1, "personnalisé,"), 0.09, 800, 1600);
    for (let i = 0; i < 3; i++) beep(cue(1, "fonctionne.") + i * 0.1, 0.06);
  }
  // Excuse n° 4.
  {
    const q = cue(2, "J'ai");
    excuseCard(blockStart(2), q - 0.25);
    bubble(q);
    phoneIn(cue(2, "ramène") - 0.35);
    crickets(cue(2, "réservations,") + 0.1, 1.6);
    whoosh(cueEnd(2, "exister.") - 0.15, 0.3, 0.12, 1500, 5000);
    pop(cue(2, "convertir,"), 0.09);
    pop(cue(2, "faire"), 0.09);
    phoneIn(cue(2, "En") - 0.25);
    pop(cue(2, "deux"), 0.08);
    tick(cue(2, "hop,"), 0.13, 1000);
    success(cue(2, "réservé."));
  }
  // Excuse n° 3.
  {
    const q = cue(3, "Mes");
    excuseCard(blockStart(3), q - 0.25);
    bubble(q);
    phoneIn(cue(3, "tu", 0) - 0.2);
    pop(cue(3, "vidéo…"), 0.1);
    whoosh(cue(3, "Ton"), 0.5, 0.1);
    whoosh(cue(3, "Et") - 0.1, 0.4, 0.07);
    ding(cue(3, "prévenu.") - 0.35);
    beep(cue(3, "prévenu."), 0.07);
    beep(cue(3, "prévenu.") + 0.14, 0.07);
  }
  // Excuse n° 2.
  {
    const q = cue(4, "les", 0);
    excuseCard(blockStart(4), q - 0.25);
    pop(cue(4, "l'aime"), 0.1);
    bubble(q);
    const cuts = [cue(4, "une", 0), cue(4, "une", 1), cue(4, "une", 2), cue(4, "un", 0), cue(4, "je", 1), cue(4, "mais")];
    phoneIn(cuts[0] - 0.25);
    cuts.forEach((c) => (whoosh(c - 0.08, 0.22, 0.07, 1200, 4500), tick(c, 0.06, 1800)));
    pop(cue(4, "expert"), 0.09);
    // Les mots de « Non, tu peux avoir un site de qualité à petit prix. » tombent un à un.
    for (const [w, n] of [["tu", 0], ["peux", 0], ["avoir", 0], ["un", 2], ["site", 0], ["de", 1], ["qualité", 0], ["à", 0], ["petit", 0], ["prix.", 1]]) tick(cue(4, w, n), 0.035, 1900);
    pop(cue(4, "mais") + 0.05, 0.09, 700, 1400);
    const prices = cue(4, "et", 2) - 0.1;
    whoosh(prices, 0.45, 0.1);
    stamp(cue(4, "négociables"), 0.35);
    stamp(cue(4, "non,"), 0.55);
    whoosh(cue(4, "non,") - 0.05, 0.4, 0.08);
    whoosh(cue(4, "prix.", 1), 0.35, 0.06, 1500, 4000);
  }
  // Excuse n° 1.
  {
    const q = cue(5, "je", 0);
    excuseCard(blockStart(5), q - 0.25);
    success(cue(5, "seule") - 0.1, 0.07);
    bubble(q);
    const bah = cue(5, "bah");
    whoosh(bah - 0.08, 0.25, 0.14, 2000, 6000);
    pop(bah - 0.05, 0.14, 1200, 300);
    thump(bah + 0.05, 0.35);
    pop(cue(5, "maintenant", 1), 0.08);
    tick(cue(5, "un.") - 0.15, 0.12, 1300);
    ding(cue(5, "un.") - 0.05, 0.07);
  }
  // Commentaire et partage.
  {
    const s = blockStart(6);
    for (let i = 0; i < 5; i++) pop(s + 0.35 + i * 0.12, 0.06);
    const w = cue(6, "dis-le");
    typing(w + 0.3, "La n°5, j'avoue", 16, 0.04);
    pop(w + 1.35, 0.1, 700, 1400);
    whoosh(cue(6, "envoie") - 0.1, 0.5, 0.1);
    pop(cue(6, "j'ai"), 0.1);
    tick(cue(6, "suffit.") + 0.25, 0.12, 1000);
    whoosh(cue(6, "suffit.") + 0.3, 0.35, 0.08, 1000, 4000);
  }
  // Abonnés.
  {
    const site = cue(7, "mbokocode.site");
    typing(site, "mbokocode.site", 18, 0.05);
    phoneIn(site + 0.3);
    pop(cue(7, "contacter,") - 0.1, 0.08);
    whoosh(cue(7, "ou") - 0.1, 0.4, 0.07);
    pop(cue(7, "dm"), 0.09);
    whoosh(cue(7, "mille") - 0.1, 0.45, 0.08);
    beep(cue(7, "cinquante"), 0.06);
    beep(cue(7, "cinquante") + 0.12, 0.05);
    pop(cue(7, "lien"), 0.08, 400, 300);
    const hand = cue(7, "alors") - 0.1;
    whoosh(hand, 0.4, 0.08);
    const old = cue(7, "comme");
    typing(hand + 0.4, "mbokocode", Math.min(11, 9 / Math.max(0.3, old - hand - 0.4)), 0.06);
    for (let i = 0; i < 4; i++) stamp(old + 0.05 + i * 0.13, 0.12);
    bell(old + 0.6, 2093, 0.1, 0.4);
    phoneIn(cue(7, "c'est") - 0.15);
    pop(cue(7, "t'abonner") - 0.1, 0.08);
    tick(cue(7, "abonne-toi") + 0.2, 0.14, 900);
    success(cue(7, "abonne-toi") + 0.25);
    const mosaic = cue(7, "verras") - 0.2;
    for (let i = 0; i < 5; i++) whoosh(mosaic + i * 0.12, 0.4, 0.05, 300, 2000);
    whoosh(cue(7, "comment"), 0.45, 0.08);
    typing(cue(7, "comment") + 0.2, "export async function creerCommande", 34, 0.025);
  }
  // Carte et passeport.
  {
    pop(cue(8, "douala,"), 0.1);
    pop(cue(8, "clients"), 0.07);
    whoosh(cue(8, "france,"), 0.9, 0.09, 400, 1800);
    pop(cue(8, "france,") + 0.8, 0.1);
    whoosh(cue(8, "conakry"), 0.9, 0.09, 400, 1800);
    pop(cue(8, "conakry") + 0.8, 0.1);
    const pass = cue(8, "passeport") - 0.2;
    whoosh(cue(8, "et", 1), 0.6, 0.1);
    whoosh(pass + 0.25, 0.5, 0.07, 600, 3000);
    for (let i = 0; i < 3; i++) stamp(pass + 0.8 + i * 0.18, 0.28);
    for (let i = 0; i < 4; i++) tick(cue(8, "pages") + i * 0.1, 0.05, 1400);
  }
  outro(OUTRO_AT);
}

function render(file, seconds, fill) {
  out = new Float32Array(Math.ceil(seconds * RATE));
  seed = 7;
  fill();
  // Limiteur doux puis PCM 16 bits mono.
  const pcm = Buffer.alloc(44 + out.length * 2);
  pcm.write("RIFF", 0);
  pcm.writeUInt32LE(36 + out.length * 2, 4);
  pcm.write("WAVEfmt ", 8);
  pcm.writeUInt32LE(16, 16);
  pcm.writeUInt16LE(1, 20);
  pcm.writeUInt16LE(1, 22);
  pcm.writeUInt32LE(RATE, 24);
  pcm.writeUInt32LE(RATE * 2, 28);
  pcm.writeUInt16LE(2, 32);
  pcm.writeUInt16LE(16, 34);
  pcm.write("data", 36);
  pcm.writeUInt32LE(out.length * 2, 40);
  out.forEach((v, i) => pcm.writeInt16LE(Math.round(Math.tanh(v) * 32000), 44 + i * 2));
  writeFileSync(file, pcm);
  console.log(file, seconds.toFixed(1), "s");
}

render("public/audio/sfx.wav", DURATION, full);
render("public/audio/sfx-intro.wav", INTRO_DUR, () => intro(0));
render("public/audio/sfx-outro.wav", OUTRO_DUR, () => outro(0));
