import React from "react";
import { AbsoluteFill } from "remotion";
import { Chip, Flag, Paper, Phone, Pop, Rise, useTime } from "../components";
import map from "../map.json";
import { ISend, KoumaleHome, MesPochesHome, TikTokProfile } from "../screens";
import { BACK, C, FONT, IN, lerp, prog, QUART, SERIF } from "../theme";
import { blockStart, cue } from "../timing";

const PW = 600;
const PHONE_LEFT = (1080 - PW * 1.056) / 2;
const PHONE_TOP = 400;

// ─── « C'est laquelle, ton excuse ? » : commentaire puis partage ─────────────
const EXCUSES = ["J'ai WhatsApp, ça me suffit", "J'ai déjà un site", "Mes clients ne sont pas sur internet", "C'est cher, c'est pour les grandes marques", "Je ne connais pas de développeur"];
const CONTACTS = [
  ["👴🏾", "Tonton"],
  ["🧑🏾", "Le cousin"],
  ["👩🏾", "La voisine"],
  ["👨🏾‍💼", "Ton boss"],
  ["👵🏾", "Maman"],
];

export function Comment() {
  const t = useTime();
  const start = blockStart(6);
  const write = cue(6, "dis-le");
  const share = cue(6, "envoie") - 0.15;
  const pick = cue(6, "j'ai");
  const send = cue(6, "suffit.") + 0.25;
  const listOut = prog(t, share, 0.45, QUART);
  const sheet = prog(t, share + 0.1, 0.55);
  const typed = "La n°5, j'avoue 😅".slice(0, Math.max(0, Math.floor((t - write - 0.3) * 16)));
  const posted = t >= write + 1.35;
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{ position: "absolute", left: 90, right: 90, top: 380, fontFamily: FONT, transform: `translateY(${listOut * -200}px)`, opacity: 1 - listOut }}>
        <div style={{ fontWeight: 900, fontStretch: "115%", fontSize: 92, lineHeight: 1.05, color: C.ink }}>
          <Rise at={start}>Ton excuse,</Rise>
          <br />
          <Rise at={start + 0.25} style={{ color: C.cobalt }}>c'est laquelle ?</Rise>
        </div>
        <div style={{ display: "grid", gap: 18, marginTop: 50 }}>
          {EXCUSES.map((e, i) => {
            const p = prog(t, start + 0.35 + i * 0.12, 0.45, BACK);
            return (
              <div key={e} style={{ display: "flex", alignItems: "center", gap: 22, background: C.white, borderRadius: 26, padding: "22px 28px", boxShadow: "0 16px 34px -22px rgb(11 19 38 / 0.35)", transform: `translateX(${(1 - p) * -120}px)`, opacity: Math.min(1, p * 2) }}>
                <span style={{ fontWeight: 900, fontSize: 46, color: C.cobalt, width: 70 }}>{5 - i}</span>
                <span style={{ fontWeight: 600, fontSize: 38, color: C.ink }}>{e}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Champ de commentaire. */}
      {t >= write && t < share + 0.5 && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 1380, opacity: 1 - listOut }}>
          {posted && (
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 26, transform: `scale(${0.8 + 0.2 * prog(t, write + 1.35, 0.4, BACK)})`, transformOrigin: "0 100%" }}>
              <div style={{ width: 72, height: 72, borderRadius: 99, background: C.paper2, display: "grid", placeItems: "center", fontSize: 40 }}>🙋🏾</div>
              <div style={{ fontFamily: FONT }}>
                <div style={{ fontWeight: 700, fontSize: 28, color: C.steel }}>toi · à l'instant</div>
                <div style={{ fontWeight: 600, fontSize: 40, color: C.ink }}>La n°5, j'avoue 😅</div>
              </div>
            </div>
          )}
          <div style={{ height: 110, borderRadius: 99, background: C.white, boxShadow: "0 20px 40px -24px rgb(11 19 38 / 0.4)", display: "flex", alignItems: "center", padding: "0 20px 0 40px", fontFamily: FONT, fontSize: 40, transform: `translateY(${(1 - prog(t, write, 0.45)) * 200}px)` }}>
            <span style={{ flex: 1, color: posted || typed ? C.ink : C.steel }}>{posted ? "Ajouter un commentaire…" : typed || "Ajouter un commentaire…"}</span>
            <div style={{ width: 78, height: 78, borderRadius: 99, background: C.cobalt, display: "grid", placeItems: "center" }}>
              <ISend size={38} color={C.white} />
            </div>
          </div>
        </div>
      )}
      {/* Feuille de partage. */}
      {t >= share && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 1250, background: C.white, borderRadius: "60px 60px 0 0", boxShadow: "0 -30px 80px -40px rgb(11 19 38 / 0.4)", transform: `translateY(${(1 - sheet) * 100}%)`, fontFamily: FONT }}>
          <div style={{ width: 120, height: 12, borderRadius: 6, background: C.line, margin: "26px auto 0" }} />
          <div style={{ textAlign: "center", fontWeight: 800, fontSize: 54, marginTop: 40, color: C.ink }}>Envoyer à</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 34, marginTop: 70 }}>
            {CONTACTS.map(([face, name], i) => {
              const chosen = i === 0 && t >= pick;
              const p = prog(t, pick, 0.4, BACK);
              return (
                <div key={name} style={{ display: "grid", justifyItems: "center", gap: 14, position: "relative" }}>
                  <div style={{ width: 150, height: 150, borderRadius: 99, background: C.paper2, display: "grid", placeItems: "center", fontSize: 80, boxShadow: chosen ? `0 0 0 ${8 * p}px ${C.cobalt}` : undefined }}>{face}</div>
                  <span style={{ fontWeight: 700, fontSize: 30, color: C.ink }}>{name}</span>
                  {chosen && <div style={{ position: "absolute", right: -6, top: -6, width: 54, height: 54, borderRadius: 99, background: C.cobalt, color: C.white, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 32, transform: `scale(${p})` }}>✓</div>}
                </div>
              );
            })}
          </div>
          {/* Le tonton, et sa phrase culte. */}
          {t >= pick && (
            <div style={{ position: "absolute", left: 70, top: 400, maxWidth: 820, background: C.paper, borderRadius: "40px 40px 40px 8px", padding: "30px 40px", fontFamily: SERIF, fontStyle: "italic", fontSize: 58, color: C.ink, transform: `scale(${0.6 + 0.4 * prog(t, pick, 0.45, BACK)})`, transformOrigin: "0 0", opacity: prog(t, pick, 0.2) }}>
              « J'ai WhatsApp, ça me suffit. »
            </div>
          )}
          <div style={{ position: "absolute", left: 120, right: 120, top: 590, height: 130, borderRadius: 30, background: C.cobalt, color: C.white, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 50, transform: `scale(${1 - (prog(t, send, 0.1) - prog(t, send + 0.12, 0.2)) * 0.06})`, opacity: prog(t, pick + 0.3, 0.3) }}>
            {t >= send + 0.15 ? "Envoyé ✓" : "Envoyer"}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}

// ─── Le site, le DM, les mille abonnés, la saisie « à la main » ──────────────
function UrlBar({ at, text, style, cps = 18 }: { at: number; text: string; style?: React.CSSProperties; cps?: number }) {
  const t = useTime();
  const p = prog(t, at - 0.3, 0.45, BACK);
  const typed = text.slice(0, Math.max(0, Math.floor((t - at) * cps)));
  return (
    <div style={{ position: "absolute", left: 120, right: 120, height: 120, borderRadius: 99, background: C.white, boxShadow: "0 24px 50px -24px rgb(11 19 38 / 0.35), 0 0 0 1.5px rgb(11 19 38 / 0.06)", display: "flex", alignItems: "center", gap: 6, padding: "0 46px", fontFamily: FONT, fontSize: 60, fontWeight: 800, color: C.ink, transform: `scale(${0.6 + 0.4 * p})`, opacity: Math.min(1, p * 2), ...style }}>
      <span style={{ color: C.steel, fontWeight: 500, fontSize: 46, marginRight: 8 }}>🔒</span>
      {typed}
      <span style={{ width: 5, height: 64, background: C.cobalt, opacity: Math.floor(t * 4) % 2 ? 0 : 1 }} />
    </div>
  );
}

export function Abonnes() {
  const t = useTime();
  const start = blockStart(7);
  const site = cue(7, "mbokocode.site");
  const projets = cue(7, "projets", 0);
  const dm = cue(7, "ou") - 0.1;
  const mille = cue(7, "mille");
  const fifty = cue(7, "cinquante");
  const hand = cue(7, "alors") - 0.1;
  const old = cue(7, "comme");
  const back = cue(7, "c'est") - 0.15;
  const mosaic = cue(7, "verras") - 0.2;
  const code = cue(7, "comment");
  // Le téléphone : site → profil TikTok, puis sortie pour la saisie, puis retour.
  const inA = prog(t, site + 0.3, 0.6);
  const outA = prog(t, hand, 0.45, IN);
  const inB = prog(t, back, 0.6);
  const outB = prog(t, mosaic, 0.45, IN);
  const phoneTop = t < back ? PHONE_TOP + 40 * (1 - prog(t, dm, 0.5, QUART)) + (1 - inA) * 1300 + outA * 1400 : PHONE_TOP + (1 - inB) * 1300 + outB * 1400;
  const showPhone = (t >= site + 0.3 && t < hand + 0.5) || (t >= back && t < mosaic + 0.5);
  const gauge = prog(t, mille - 0.1, 0.5, BACK);
  const sepia = prog(t, old - 0.05, 0.35);
  return (
    <AbsoluteFill>
      <Paper />
      {t < dm + 0.3 && <UrlBar at={site} text="mbokocode.site" style={{ top: 250, opacity: 1 - prog(t, dm, 0.3) }} />}
      {showPhone && (
        <Phone width={PW} clip={t < dm ? { src: t < projets ? "hero" : "projects", from: t < projets ? 0.3 : 0.6 } : undefined} at={t < projets ? site + 0.3 : projets} style={{ left: PHONE_LEFT, top: phoneTop }}>
          {t >= dm ? <TikTokProfile circleAt={t < back ? cue(7, "mille") : undefined} msgAt={t < back ? cue(7, "dm") : undefined} linkAt={t < back ? cue(7, "lien") : undefined} followAt={t >= back ? cue(7, "t'abonner") : undefined} pressAt={t >= back ? cue(7, "abonne-toi") + 0.2 : undefined} /> : null}
        </Phone>
      )}
      <Chip at={cue(7, "contacter,") - 0.1} exitAt={dm} style={{ left: 520, top: 1300 }}>
        Parlons de ton projet →
      </Chip>
      {/* La jauge vers les 1 000 abonnés. */}
      {t >= mille - 0.1 && t < hand + 0.3 && (
        <div style={{ position: "absolute", left: 90, right: 90, top: 190, padding: "22px 34px", borderRadius: 30, background: C.white, boxShadow: "0 24px 50px -28px rgb(11 19 38 / 0.4)", fontFamily: FONT, transform: `scale(${0.7 + 0.3 * gauge})`, opacity: Math.min(1, gauge * 2) * (1 - prog(t, hand, 0.3)) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontWeight: 800, color: C.ink }}>
            <span style={{ fontSize: 40 }}>Abonnés</span>
            <span style={{ fontSize: 46 }}>
              <span style={{ color: C.cobalt }}>34</span> / 1 000
            </span>
          </div>
          <div style={{ position: "relative", height: 26, borderRadius: 13, background: C.paper2, marginTop: 18 }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${3.4 * prog(t, mille, 0.8, QUART)}%`, minWidth: 26, borderRadius: 13, background: C.cobalt }} />
            {t >= fifty && <div style={{ position: "absolute", left: "5%", top: -12, bottom: -12, width: 5, background: C.danger, opacity: prog(t, fifty, 0.3) }} />}
          </div>
          {t >= fifty && <div style={{ fontSize: 30, fontWeight: 700, color: C.danger, marginTop: 14, opacity: prog(t, fifty, 0.3) }}>même pas 50 😅</div>}
        </div>
      )}
      <Chip at={cue(7, "dm")} exitAt={mille - 0.2} style={{ left: 700, top: 300 }}>
        DM ✉️
      </Chip>
      {/* « Tu devras le taper à la main. Comme en 1900. » */}
      {t >= hand && t < back + 0.3 && (
        <AbsoluteFill style={{ opacity: prog(t, hand + 0.1, 0.3) * (1 - prog(t, back, 0.3)) }}>
          <AbsoluteFill style={{ background: `rgb(233 220 194 / ${sepia})` }} />
          <UrlBar at={hand + 0.4} cps={11} text="mbokocode.site" style={{ top: 640, fontFamily: sepia > 0.5 ? "Courier New, monospace" : FONT, background: sepia > 0.5 ? "#f5ecd9" : C.white, color: sepia > 0.5 ? "#4a3520" : C.ink }} />
          {/* Clavier. */}
          <div style={{ position: "absolute", left: 60, right: 60, top: 880, display: "grid", gap: 14, opacity: 1 - sepia }}>
            {["azertyuiop", "qsdfghjklm", "wxcvbn."].map((row) => (
              <div key={row} style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                {row.split("").map((k) => {
                  const idx = "mbokocode.site".indexOf(k);
                  const typedCount = Math.floor((t - hand - 0.4) * 11);
                  const hit = idx >= 0 && "mbokocode.site".slice(0, typedCount).at(-1) === k;
                  return (
                    <div key={k} style={{ width: 82, height: 104, borderRadius: 16, background: hit ? C.cobalt : C.white, color: hit ? C.white : C.ink, display: "grid", placeItems: "center", fontFamily: FONT, fontWeight: 700, fontSize: 44, boxShadow: "0 6px 0 rgb(11 19 38 / 0.08)", transform: hit ? "translateY(4px)" : undefined }}>{k}</div>
                  );
                })}
              </div>
            ))}
          </div>
          {sepia > 0 && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", color: "#4a3520", opacity: sepia }}>
              <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 230, lineHeight: 1 }}>1900</div>
              <div style={{ fontFamily: "Courier New, monospace", fontSize: 46, marginTop: 20 }}>tac · tac · tac · ding !</div>
            </div>
          )}
        </AbsoluteFill>
      )}
      <Pop at={cue(7, "t'abonner") - 0.1} exitAt={cue(7, "abonne-toi")} style={{ left: 640, top: 300 }}>
        <div style={{ fontSize: 120, transform: "rotate(8deg)" }}>👀</div>
      </Pop>
      {/* Mosaïque des projets, puis le code. */}
      {t >= mosaic && (
        <AbsoluteFill>
          {[
            { el: <KoumaleHome at={mosaic} />, x: 40, y: 450, r: -8 },
            { el: <MesPochesHome />, x: 700, y: 480, r: 9 },
          ].map(({ el, x, y, r }, i) => {
            const p = prog(t, mosaic + i * 0.12, 0.6, BACK);
            return (
              <Phone key={i} width={330} style={{ left: x, top: y + (1 - p) * 1200, transform: `rotate(${r * p}deg)` }}>
                {el}
              </Phone>
            );
          })}
          {[
            { src: "fripcash", x: 380, y: 390, r: 2 },
            { src: "cashglass", x: 140, y: 940, r: 6 },
            { src: "easybank", x: 600, y: 960, r: -6 },
          ].map(({ src, x, y, r }, i) => {
            const p = prog(t, mosaic + 0.3 + i * 0.12, 0.6, BACK);
            return <Phone key={src} width={src === "fripcash" ? 330 : 300} clip={{ src, from: 2 }} at={mosaic} style={{ left: x, top: y + (1 - p) * 1200, transform: `rotate(${r * p}deg)` }} />;
          })}
          {t >= code && <CodeCard at={code} />}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
}

/** Fenêtre de code qui s'écrit : « et comment je les crée ». */
function CodeCard({ at }: { at: number }) {
  const t = useTime();
  const p = prog(t, at, 0.5, BACK);
  const lines = [
    [["kw", "export async function "], ["fn", "creerCommande"], ["tx", "(panier) {"]],
    [["tx", "  const commande = "], ["kw", "await "], ["fn", "api"], ["tx", ".post("], ["st", '"/commandes"'], ["tx", ", panier);"]],
    [["tx", "  "], ["fn", "notifier"], ["tx", "(commande.vendeur);"]],
    [["kw", "  return "], ["tx", "commande;"]],
    [["tx", "}"]],
  ];
  const colors: Record<string, string> = { kw: C.cobalt, fn: "#b44dd6", st: "#1f9d6a", tx: C.ink };
  const shown = Math.floor((t - at - 0.2) * 34);
  let count = 0;
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 1150, borderRadius: 30, background: C.white, boxShadow: "0 40px 80px -30px rgb(11 19 38 / 0.5), 0 0 0 1.5px rgb(11 19 38 / 0.06)", padding: "28px 36px 34px", transform: `translateY(${(1 - p) * 300}px)`, opacity: Math.min(1, p * 2) }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 22 }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 22, height: 22, borderRadius: 99, background: c }} />
        ))}
      </div>
      {lines.map((parts, i) => (
        <div key={i} style={{ fontFamily: "Consolas, 'Courier New', monospace", fontSize: 33, lineHeight: 1.5, whiteSpace: "pre", minHeight: 50 }}>
          {parts.map(([kind, text], j) => {
            const visible = text.slice(0, Math.max(0, shown - count));
            count += text.length;
            return (
              <span key={j} style={{ color: colors[kind] }}>
                {visible}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── La carte du portfolio, puis le passeport ────────────────────────────────
const MAP_W = 980;
const MAP_LEFT = 50;
const MAP_TOP = 520;
const mx = (x: number) => MAP_LEFT + (x / map.width) * MAP_W;
const my = (y: number) => MAP_TOP + (y / map.width) * MAP_W;

export function Carte() {
  const t = useTime();
  const start = blockStart(8);
  const [douala, strasbourg, conakry] = map.markers;
  const at = { douala: cue(8, "douala,"), clients: cue(8, "clients"), france: cue(8, "france,"), conakry: cue(8, "conakry"), passport: cue(8, "et", 1) };
  const shrink = prog(t, at.passport, 0.6, QUART);
  const arc = (a: { x: number; y: number }, b: { x: number; y: number }, from: number, bend: number) => {
    const p = prog(t, from, 0.9, QUART);
    const x1 = mx(a.x);
    const y1 = my(a.y);
    const x2 = mx(b.x);
    const y2 = my(b.y);
    const cx = (x1 + x2) / 2 + bend;
    const cy = (y1 + y2) / 2 - Math.abs(bend) * 0.4;
    // Le petit avion suit la courbe.
    const q = p;
    const px = (1 - q) ** 2 * x1 + 2 * (1 - q) * q * cx + q ** 2 * x2;
    const py = (1 - q) ** 2 * y1 + 2 * (1 - q) * q * cy + q ** 2 * y2;
    return (
      <g key={from} opacity={t >= from ? 1 : 0}>
        <path d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`} fill="none" stroke={C.cobalt} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        {p > 0 && p < 1 && <text x={px} y={py} fontSize={54} textAnchor="middle" dominantBaseline="middle">✈️</text>}
      </g>
    );
  };
  const marker = (m: { x: number; y: number }, from: number, label: string, side: 1 | -1) => {
    const p = prog(t, from, 0.5, BACK);
    const pulse = (t - from) % 1.4;
    return (
      <g key={label} opacity={t >= from ? 1 : 0}>
        <circle cx={mx(m.x)} cy={my(m.y)} r={22 + pulse * 30} fill="none" stroke={C.cobalt} strokeWidth={4} opacity={Math.max(0, 1 - pulse / 1.4)} />
        <circle cx={mx(m.x)} cy={my(m.y)} r={20 * p} fill={C.cobalt} />
        <text x={mx(m.x) + side * 40} y={my(m.y) + 14} fontFamily={FONT} fontWeight={800} fontSize={44} fill={C.ink} textAnchor={side > 0 ? "start" : "end"} opacity={p}>{label}</text>
      </g>
    );
  };
  return (
    <AbsoluteFill>
      <Paper dots={false} />
      <AbsoluteFill style={{ transform: `translateY(${shrink * -200}px) scale(${lerp(1, 0.62, shrink)})`, transformOrigin: "540px 520px", opacity: prog(t, start, 0.5) }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {map.points.map(([x, y], i) => {
            // Le reste de la carte respire doucement : il attend ses points.
            const glow = t > at.passport ? 0.35 + 0.35 * Math.sin(t * 3 + i * 0.7) : 0;
            return <circle key={i} cx={mx(x)} cy={my(y)} r={5} fill={glow > 0.5 ? C.ciel : "#bfc6d4"} />;
          })}
          {arc(douala, strasbourg, at.france, -260)}
          {arc(douala, conakry, at.conakry, -120)}
          {marker(douala, at.douala, "Douala", 1)}
          {marker(strasbourg, at.france + 0.8, "Strasbourg", 1)}
          {marker(conakry, at.conakry + 0.8, "Conakry", -1)}
        </svg>
      </AbsoluteFill>
      <Chip at={at.clients} exitAt={at.passport} style={{ left: 120, top: 330 }}>
        <Flag country="cm" height={30} /> Clients au Cameroun
      </Chip>
      <Chip at={at.france + 0.6} exitAt={at.passport} style={{ left: 560, top: 330 }}>
        <Flag country="fr" height={30} /> France
      </Chip>
      <Chip at={at.conakry + 0.6} exitAt={at.passport} style={{ left: 120, top: 1440 }}>
        <Flag country="gn" height={30} /> Guinée
      </Chip>
      {t >= at.passport && <Passport at={cue(8, "passeport") - 0.2} empty={cue(8, "pages")} />}
    </AbsoluteFill>
  );
}

function Passport({ at, empty }: { at: number; empty: number }) {
  const t = useTime();
  const p = prog(t, at, 0.6, BACK);
  const open = prog(t, at + 0.25, 0.6, QUART);
  const stamps = [
    { label: "CAMEROUN", city: "DOUALA", r: -10, x: 40, y: 50 },
    { label: "FRANCE", city: "STRASBOURG", r: 8, x: 150, y: 220 },
    { label: "GUINÉE", city: "CONAKRY", r: -4, x: 30, y: 370 },
  ];
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 940, height: 560, transform: `translateY(${(1 - p) * 700}px)`, perspective: 2000 }}>
      {/* Pages intérieures. */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: "#fbf8f1", boxShadow: "0 40px 80px -36px rgb(11 19 38 / 0.5)", display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 1, position: "relative", borderRight: `3px dashed ${C.line}` }}>
          {stamps.map((s, i) => {
            const q = prog(t, at + 0.8 + i * 0.18, 0.3, BACK);
            return (
              <div key={s.label} style={{ position: "absolute", left: s.x, top: s.y, width: 220, height: 130, borderRadius: 18, border: `6px solid ${C.cobalt}`, color: C.cobalt, display: "grid", placeItems: "center", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 30, lineHeight: 1.1, transform: `rotate(${s.r}deg) scale(${lerp(2, 1, q)})`, opacity: q * 0.9 }}>
                {s.label}
                <span style={{ fontSize: 22, fontWeight: 700 }}>{s.city} ✓</span>
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          {[0, 1, 2, 3].map((i) => {
            const q = prog(t, empty + i * 0.1, 0.4, BACK);
            return <div key={i} style={{ position: "absolute", left: 40 + (i % 2) * 200, top: 60 + Math.floor(i / 2) * 220, width: 170, height: 170, borderRadius: 99, border: `5px dashed ${C.steel}`, display: "grid", placeItems: "center", fontFamily: FONT, fontWeight: 900, fontSize: 70, color: C.steel, opacity: 0.25 + 0.6 * q, transform: `scale(${0.8 + 0.2 * q})` }}>?</div>;
          })}
        </div>
      </div>
      {/* Couverture qui s'ouvre. */}
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "50%", transformOrigin: "0 50%", transform: `rotateY(${-180 * open}deg)`, backfaceVisibility: "hidden", borderRadius: 26, background: C.deep, display: open > 0.5 ? "none" : "grid", placeItems: "center", color: "#e9c46a", fontFamily: FONT, textAlign: "center" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 40, letterSpacing: "0.2em" }}>PASSEPORT</div>
          <div style={{ fontWeight: 600, fontSize: 28, letterSpacing: "0.3em", marginTop: 16 }}>MBOKO CODE</div>
        </div>
      </div>
    </div>
  );
}

