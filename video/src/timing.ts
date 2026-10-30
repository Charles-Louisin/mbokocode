import outro from "./timing-outro.json";
import voice from "./timing.json";
import { vt } from "./theme";

export type Word = { text: string; block: number; start: number; end: number };

/** Mots de la voix off, en temps vidéo. */
export const WORDS: Word[] = voice.words.map((w) => ({ ...w, start: vt(w.start), end: vt(w.end) }));
/** Mots de la signature, en temps relatif au début de son fichier. */
export const OUTRO_WORDS: Word[] = outro.words;

const norm = (s: string) => s.toLowerCase().replace(/[«» ]/g, "").replace(/[\s .,:;?!…]+$/, "").trim();

const find = (list: Word[], block: number, text: string, nth: number) => {
  const hit = list.filter((w) => w.block === block && norm(w.text) === norm(text))[nth];
  if (!hit) throw new Error(`Mot introuvable : bloc ${block}, « ${text} » (${nth})`);
  return hit;
};

/** Instant (vidéo) où un mot du bloc est prononcé ; `nth` pour la n-ième occurrence. */
export const cue = (block: number, text: string, nth = 0) => find(WORDS, block, text, nth).start;
export const cueEnd = (block: number, text: string, nth = 0) => find(WORDS, block, text, nth).end;
export const blockStart = (block: number) => WORDS.find((w) => w.block === block)!.start;
export const blockEnd = (block: number) => WORDS.filter((w) => w.block === block).at(-1)!.end;
/** Instant (relatif) d'un mot de la signature. */
export const outroCue = (text: string) => find(OUTRO_WORDS, 0, text, 0).start;
