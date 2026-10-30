import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Bubble, Chip, Flag, Paper, Phone, Pop, Rise, Tap, useTime } from "../components";
import { FripCashNotification, ICheck, KoumaleAdd, KoumaleHome, KoumaleLogo, KoumaleProduct, OldSite, OrderChat, StatusBar } from "../screens";
import { BACK, C, FONT, IN, lerp, prog, QUART, SERIF } from "../theme";
import { blockStart, cue, cueEnd } from "../timing";

// Position du téléphone au centre de la scène (le bas de l'écran reste aux sous-titres).
const PW = 600;
const PHONE_LEFT = (1080 - PW * 1.056) / 2;
const PHONE_TOP = 400;
const toScreen = (x: number, y: number) => ({ x: PHONE_LEFT + PW * 0.028 + (x / 432) * PW, y: PHONE_TOP + PW * 0.028 + (y / 768) * ((PW * 16) / 9) });

/** Entrée du téléphone par le bas, sortie vers le bas. */
function usePhoneMove(inAt: number, outAt?: number) {
  const t = useTime();
  const enter = prog(t, inAt, 0.6);
  const out = outAt === undefined ? 0 : prog(t, outAt, 0.45, IN);
  return { visible: t >= inAt && (outAt === undefined || t < outAt + 0.45), style: { left: PHONE_LEFT, top: PHONE_TOP + (1 - enter) * 1300 + out * 1400, transform: `rotate(${(1 - enter) * 6 - out * 4}deg)` } as React.CSSProperties };
}

/** Bascule entre plusieurs écrans dans le même téléphone, coupe franche avec un petit coup de zoom. */
function useCut(cuts: number[]) {
  const t = useTime();
  let index = -1;
  cuts.forEach((c, i) => t >= c && (index = i));
  const punch = index < 0 ? 0 : 1 - prog(t, cuts[index], 0.25);
  return { index, punch };
}

// ─── Carte de numéro : la feuille cobalt monte, porte le numéro, puis se range en haut ──────
export function ExcuseCard({ n, at, dockAt, end, children }: { n: number; at: number; dockAt: number; end: number; children?: React.ReactNode }) {
  const t = useTime();
  const cover = prog(t, at - 0.4, 0.4, QUART);
  const leave = prog(t, dockAt, 0.55, QUART);
  const dock = prog(t, dockAt + 0.05, 0.6);
  const bump = prog(t, at - 0.05, 0.5, BACK);
  // Numéro : grand au centre (blanc sur cobalt), puis petit en haut à gauche (cobalt sur papier).
  const x = lerp(540, 132, dock);
  const y = lerp(960, 178, dock);
  const s = lerp(1, 0.2, dock) * (0.6 + 0.4 * bump);
  const exitHeader = prog(t, end - 0.25, 0.25);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* En-tête : « EXCUSE » + la progression 5 → 1. */}
      <div style={{ position: "absolute", left: 200, top: 138, fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: "0.16em", color: C.ink, opacity: prog(t, dockAt + 0.35, 0.3) * (1 - exitHeader) }}>EXCUSE</div>
      <div style={{ position: "absolute", left: 200, top: 182, display: "flex", gap: 12, opacity: prog(t, dockAt + 0.4, 0.3) * (1 - exitHeader) }}>
        {[5, 4, 3, 2, 1].map((k) => (
          <div key={k} style={{ width: k === n ? 46 : 16, height: 16, borderRadius: 99, background: k === n ? C.cobalt : k > n ? C.ink : C.line }} />
        ))}
      </div>
      {/* La feuille cobalt. */}
      {t < dockAt + 0.6 && <AbsoluteFill style={{ background: C.cobalt, transform: `translateY(${(1 - cover) * 100 - leave * 100}%)` }} />}
      {t >= at - 0.4 && t < end && (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, opacity: 1 - exitHeader }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: -120, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 64, letterSpacing: "0.3em", color: C.white, opacity: 1 - dock, whiteSpace: "nowrap", marginLeft: -200, marginRight: -200 }}>EXCUSE N°</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontStretch: "125%", fontSize: 620, lineHeight: 0.85, color: dock > 0.5 ? C.cobalt : C.white }}>{n}</div>
        </div>
      )}
      {t < dockAt + 0.3 && children}
    </AbsoluteFill>
  );
}

/** Ma réponse : bulle envoyée, cobalt, à droite. */
function Reply({ at, text, exitAt, top }: { at: number; text: string; exitAt: number; top: number }) {
  const t = useTime();
  const p = prog(t, at, 0.45, BACK);
  const out = prog(t, exitAt, 0.35, QUART);
  if (t < at || out >= 1) return null;
  return (
    <div style={{ position: "absolute", right: 70, top, maxWidth: 760, transformOrigin: "100% 100%", transform: `scale(${(0.5 + 0.5 * p) * (1 - out * 0.4)})`, opacity: Math.min(1, p * 2) * (1 - out), background: C.cobalt, color: C.white, borderRadius: "46px 46px 10px 46px", padding: "30px 42px", fontFamily: FONT, fontWeight: 700, fontSize: 56, lineHeight: 1.15, boxShadow: "0 30px 60px -28px rgb(47 84 255 / 0.6)" }}>
      {text}
    </div>
  );
}

/** Étiquette collée en biais, comme un autocollant. */
function Sticker({ at, children, style, rotate = -6, exitAt, color = C.ink, bg = C.white }: { at: number; children: React.ReactNode; style?: React.CSSProperties; rotate?: number; exitAt?: number; color?: string; bg?: string }) {
  return (
    <Pop at={at} exitAt={exitAt} from={0.3} style={style}>
      <div style={{ transform: `rotate(${rotate}deg)`, background: bg, color, fontFamily: FONT, fontWeight: 800, fontSize: 52, padding: "20px 34px", borderRadius: 22, boxShadow: "0 22px 44px -20px rgb(11 19 38 / 0.45), 0 0 0 1.5px rgb(11 19 38 / 0.06)", whiteSpace: "nowrap" }}>{children}</div>
    </Pop>
  );
}

// ─── Excuse n° 5 : « J'ai WhatsApp, je crois que ça me suffit. » ───────────────
export function Excuse5() {
  const t = useTime();
  const start = blockStart(1);
  const end = blockStart(2) - 0.05;
  const quote = cue(1, "J'ai");
  const phoneIn = cue(1, "Le") - 0.3;
  const toProduct = cue(1, "boutique") + 0.45;
  const pressAt = cue(1, "commande");
  const toChat = pressAt + 0.3;
  const toForm = cue(1, "produit") - 0.2;
  const brand = cue(1, "KOUMALE.") - 0.05;
  const schema = cue(1, "mais") - 0.1;
  const phone = usePhoneMove(phoneIn, brand - 0.1);
  const { index } = useCut([phoneIn, toProduct, toChat, toForm]);
  const lift = prog(t, schema, 0.6, QUART);
  const custom = prog(t, cue(1, "personnalisé,"), 0.5, QUART);
  const works = cue(1, "fonctionne.");
  return (
    <AbsoluteFill>
      <Paper />
      <Bubble at={quote} text="J'ai WhatsApp, je crois que ça me suffit." style={{ top: 780 }} exitAt={phoneIn - 0.15} />
      <Reply at={cue(1, "Oui,")} text="Oui, tu gardes ton WhatsApp." top={1180} exitAt={phoneIn - 0.15} />
      {phone.visible && (
        <Phone width={PW} style={phone.style}>
          {index === 0 && <KoumaleHome at={phoneIn} />}
          {index === 1 && <KoumaleProduct pressAt={pressAt} />}
          {index === 2 && <OrderChat at={toChat} />}
          {index === 3 && <KoumaleAdd at={toForm} />}
        </Phone>
      )}
      <Tap at={toProduct - 0.05} {...toScreen(110, 450)} />
      <Tap at={pressAt} {...toScreen(216, 715)} />
      <Sticker at={cue(1, "TON", 1)} exitAt={toForm - 0.2} style={{ right: 70, top: 300 }} rotate={4} color={C.white} bg={C.chat}>
        sur TON WhatsApp ✓
      </Sticker>
      <Chip at={toForm} exitAt={brand - 0.2} style={{ left: 90, top: 300 }}>
        Espace vendeur
      </Chip>
      {/* KOUMALE, sa licence, puis le schéma qui marche aussi sur mesure. */}
      {t >= brand && (
        <div style={{ position: "absolute", left: 0, right: 0, top: lerp(700, 420, lift), display: "grid", justifyItems: "center", transform: `scale(${lerp(1, 0.62, lift)})`, opacity: prog(t, brand, 0.4) }}>
          <div style={{ transform: `scale(${0.7 + 0.3 * prog(t, brand, 0.5, BACK)})` }}>
            <KoumaleLogo size={130} text={custom > 0.5 ? "TA MARQUE" : "KOUMALE"} color={custom > 0.5 ? C.cobalt : C.koumale} />
          </div>
          <div style={{ marginTop: 26, fontFamily: FONT, fontWeight: 600, fontSize: 40, color: C.steel, opacity: 1 - custom }}>koumale.com</div>
        </div>
      )}
      <Sticker at={cue(1, "licence") - 0.05} exitAt={schema} style={{ left: 300, top: 980 }} rotate={-7} color={C.white} bg={C.koumale}>
        Licence en vente
      </Sticker>
      {t >= schema &&
        [
          ["Ta boutique en ligne", "le client choisit"],
          ["La commande part", "en un clic"],
          ["Ton WhatsApp", "tu conclus comme d'habitude"],
        ].map(([title, sub], i) => {
          const p = prog(t, schema + 0.2 + i * 0.25, 0.5, BACK);
          const ok = prog(t, works + i * 0.1, 0.35, BACK);
          return (
            <React.Fragment key={title}>
              <div style={{ position: "absolute", left: 170, right: 170, top: 720 + i * 240, height: 170, borderRadius: 30, background: C.white, boxShadow: "0 24px 50px -26px rgb(11 19 38 / 0.35)", display: "flex", alignItems: "center", gap: 28, padding: "0 36px", transform: `scale(${0.7 + 0.3 * p})`, opacity: Math.min(1, p * 2) }}>
                <div style={{ width: 84, height: 84, borderRadius: 99, flex: "none", background: ok > 0 ? C.success : C.wash, display: "grid", placeItems: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: ok > 0 ? C.white : C.cobalt }}>
                  {ok > 0 ? <div style={{ transform: `scale(${ok})` }}><ICheck size={46} color={C.white} stroke={3} /></div> : i + 1}
                </div>
                <div style={{ fontFamily: FONT }}>
                  <div style={{ fontWeight: 800, fontSize: 44, color: C.ink }}>{title}</div>
                  <div style={{ fontWeight: 500, fontSize: 32, color: C.steel, marginTop: 4 }}>{sub}</div>
                </div>
              </div>
              {i < 2 && <div style={{ position: "absolute", left: 535, top: 890 + i * 240, width: 10, height: 70 * prog(t, schema + 0.45 + i * 0.25, 0.3), borderRadius: 5, background: C.cobalt }} />}
            </React.Fragment>
          );
        })}
      <ExcuseCard n={5} at={start} dockAt={quote - 0.25} end={end} />
    </AbsoluteFill>
  );
}

// ─── Excuse n° 4 : « J'ai déjà un site. » ─────────────────────────────────────
export function Excuse4() {
  const t = useTime();
  const start = blockStart(2);
  const end = blockStart(3) - 0.05;
  const quote = cue(2, "J'ai");
  const oldIn = cue(2, "ramène") - 0.35;
  const exister = cue(2, "un", 1) - 0.15;
  const convertir = cue(2, "ça", 1);
  const cashIn = cue(2, "En") - 0.25;
  const hop = cue(2, "hop,");
  const booked = cue(2, "réservé.");
  const old = usePhoneMove(oldIn, exister - 0.2);
  const cash = usePhoneMove(cashIn);
  const strike = prog(t, cueEnd(2, "exister.") - 0.1, 0.4, QUART);
  const upWords = prog(t, cashIn - 0.1, 0.5, QUART);
  const toast = prog(t, booked, 0.45, BACK);
  return (
    <AbsoluteFill>
      <Paper />
      <Bubble at={quote} text="J'ai déjà un site." style={{ top: 820 }} exitAt={oldIn - 0.1} />
      {old.visible && (
        <Phone width={PW} style={old.style}>
          <OldSite at={cue(2, "réservations,")} />
        </Phone>
      )}
      <Sticker at={cue(2, "réservations,") + 0.1} exitAt={exister - 0.25} style={{ right: 70, top: 1250 }} rotate={6}>
        🦗 … calme plat
      </Sticker>
      {/* « exister » barré, puis « convertir » et « faire évoluer ». */}
      {t >= exister && t < cashIn + 0.6 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: lerp(560, 200, upWords), textAlign: "center", fontFamily: FONT, color: C.ink, opacity: 1 - upWords }}>
          <div style={{ fontWeight: 600, fontSize: 56, color: C.ink2 }}>
            <Rise at={exister}>Un site, ça ne sert pas qu'à</Rise>
          </div>
          <div style={{ position: "relative", display: "inline-block", fontWeight: 900, fontStretch: "120%", fontSize: 150, marginTop: 10 }}>
            <Rise at={cue(2, "exister.") - 0.1}>exister.</Rise>
            <div style={{ position: "absolute", left: -10, top: "52%", height: 18, borderRadius: 9, width: `${strike * 104}%`, background: C.danger }} />
          </div>
          <div style={{ fontWeight: 600, fontSize: 56, color: C.ink2, marginTop: 50 }}>
            <Rise at={convertir}>Ça sert à</Rise>
          </div>
          <div style={{ fontWeight: 900, fontStretch: "120%", fontSize: 150, color: C.cobalt, marginTop: 14, lineHeight: 1 }}>
            <Rise at={cue(2, "convertir,") - 0.1}>convertir,</Rise>
          </div>
          <div style={{ fontWeight: 900, fontStretch: "120%", fontSize: 120, color: C.cobalt, marginTop: 20, lineHeight: 1 }}>
            <Rise at={cue(2, "faire") - 0.1}>faire évoluer.</Rise>
          </div>
        </div>
      )}
      {cash.visible && (
        <Phone width={PW} clip={{ src: "cashglass", from: 0, rate: 0.75 }} at={cashIn} style={cash.style}>
          {null}
        </Phone>
      )}
      <Tap at={hop} {...toScreen(125, 575)} />
      {t >= booked && (
        <div style={{ position: "absolute", left: PHONE_LEFT + 40, right: PHONE_LEFT + 40, top: 880, padding: "26px 30px", borderRadius: 26, background: C.white, boxShadow: "0 30px 60px -24px rgb(11 19 38 / 0.45)", display: "flex", gap: 22, alignItems: "center", transform: `scale(${0.7 + 0.3 * toast})`, opacity: Math.min(1, toast * 2), fontFamily: FONT }}>
          <div style={{ width: 70, height: 70, borderRadius: 99, background: "#0e9f6e", display: "grid", placeItems: "center", flex: "none" }}>
            <ICheck size={40} color={C.white} stroke={3} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 38, color: C.ink }}>Intervention réservée</div>
            <div style={{ fontWeight: 500, fontSize: 28, color: C.steel }}>CASHGLASS · Strasbourg</div>
          </div>
        </div>
      )}
      <Sticker at={cue(2, "deux")} style={{ left: 90, top: 300 }} rotate={-4} exitAt={end - 0.3}>
        ⏱ 2 minutes
      </Sticker>
      <ExcuseCard n={4} at={start} dockAt={quote - 0.25} end={end} />
    </AbsoluteFill>
  );
}

// Icônes pleines de l'interface TikTok (dessinées, sans logo).
const fill = (d: string, size = 30) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", filter: "drop-shadow(0 1px 2px rgb(0 0 0 / 0.45))" }}>
    <path d={d} fill="#fff" />
  </svg>
);
const HEART = "M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11Z";
const BUBBLE = "M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.5 3.4 6L4.5 21l4.4-2.3c1 .2 2 .3 3.1.3 5.5 0 10-3.6 10-8s-4.5-8-10-8Z";
const MARK = "M6 2h12a1 1 0 0 1 1 1v19l-7-4.5L5 22V3a1 1 0 0 1 1-1Z";
const ARROW = "M13 4v4C6 9 3 13 2 20c2.5-3.5 6-5 11-5v4l9-7.5L13 4Z";
const NAV: [string, string][] = [
  ["Accueil", "M3 11 12 3l9 8v10h-6v-6H9v6H3V11Z"],
  ["Amis", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 10c0-4 3-6 7-6s7 2 7 6Zm14-10a3 3 0 1 0 0-6M18 15c2.5.5 4 2.5 4 6"],
  ["", ""],
  ["Messages", "M4 4h16v12H8l-4 4V4Z"],
  ["Profil", "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 9c0-4 4-6 8-6s8 2 8 6"],
];

/** Le fil « Pour toi » de TikTok (d'après une vraie capture de l'appli), avec notre vidéo dedans.
 *  La notification FripCash, si `notifAt` est donné, tombe par-dessus pendant que la vidéo tourne. */
function FeedScreen({ at, notifAt }: { at: number; notifAt?: number }) {
  const t = useTime();
  const white: React.CSSProperties = { color: "#fff", textShadow: "0 1px 3px rgb(0 0 0 / 0.5)" };
  const side = (icon: React.ReactNode, label?: string) => (
    <div style={{ display: "grid", justifyItems: "center", gap: 3 }}>
      {icon}
      {label && <span style={{ ...white, fontSize: 11.5, fontWeight: 600 }}>{label}</span>}
    </div>
  );
  return (
    <div style={{ width: 432, height: 768, background: "#000", position: "relative", overflow: "hidden", fontFamily: "Segoe UI, Archivo, sans-serif" }}>
      {/* Notre vidéo, plein cadre jusqu'à la barre de commentaire. */}
      <Img src={staticFile("img/feed-frame.jpg")} style={{ position: "absolute", left: 0, top: 0, width: 432, height: 660, objectFit: "cover", transform: `scale(${1 + Math.max(0, t - at) * 0.004})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 110, background: "linear-gradient(rgb(0 0 0 / 0.42), transparent)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, height: 190, background: "linear-gradient(transparent, rgb(0 0 0 / 0.5))" }} />
      <StatusBar dark />
      {/* Onglets du haut. */}
      <div style={{ position: "absolute", top: 34, left: 14, right: 14, display: "flex", alignItems: "center", justifyContent: "space-between", ...white }}>
        <div style={{ border: "2px solid #fff", borderRadius: 5, fontSize: 9, fontWeight: 800, padding: "1px 4px", letterSpacing: "0.04em" }}>LIVE</div>
        <div style={{ display: "flex", gap: 16, fontSize: 16, fontWeight: 600 }}>
          <span style={{ opacity: 0.65 }}>Communauté</span>
          <span style={{ opacity: 0.65, position: "relative" }}>
            Suivis
            <span style={{ position: "absolute", right: -7, top: 0, width: 6, height: 6, borderRadius: 9, background: "#fe2c55" }} />
          </span>
          <span style={{ fontWeight: 800, borderBottom: "2.5px solid #fff", paddingBottom: 4 }}>Pour toi</span>
        </div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </div>
      {/* Colonne de droite. */}
      <div style={{ position: "absolute", right: 8, top: 360, display: "grid", gap: 16, justifyItems: "center", width: 52 }}>
        <div style={{ position: "relative", marginBottom: 8 }}>
          <Img src={staticFile("img/mbokocode-avatar.jpg")} style={{ width: 44, height: 44, borderRadius: 99, border: "1.5px solid #fff", display: "block" }} />
          <div style={{ position: "absolute", left: 13, bottom: -9, width: 19, height: 19, borderRadius: 99, background: "#fe2c55", color: "#fff", display: "grid", placeItems: "center", fontSize: 15, fontWeight: 700, lineHeight: 1 }}>+</div>
        </div>
        {side(fill(HEART, 34))}
        {side(fill(BUBBLE, 32), "1er com")}
        {side(fill(MARK, 28))}
        {side(fill(ARROW, 30))}
      </div>
      {/* Auteur et légende. */}
      <div style={{ position: "absolute", left: 14, right: 74, top: 588, ...white }}>
        <div style={{ fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 6 }}>
          MBOKO CODE <Flag country="cm" height={11} />
        </div>
        <div style={{ fontSize: 13.5, marginTop: 3, lineHeight: 1.3 }}>
          Cinq excuses qu'ils donnent pour ne pas avoir de site web… <b>#dev</b>
        </div>
      </div>
      {/* Barre de commentaire. */}
      <div style={{ position: "absolute", left: 10, right: 62, top: 664, height: 34, borderRadius: 99, border: "1px solid rgb(255 255 255 / 0.35)", display: "flex", alignItems: "center", gap: 8, padding: "0 10px 0 4px", color: "#fff", fontSize: 14 }}>
        <div style={{ width: 26, height: 26, borderRadius: 99, background: "#2b6f4e" }} />
        <span style={{ flex: 1 }}>Commenter...</span>
        <span style={{ fontSize: 17, letterSpacing: 6 }}>😂🤣😭</span>
      </div>
      <div style={{ position: "absolute", right: 12, top: 664, width: 34, height: 34, borderRadius: 99, background: "radial-gradient(circle at 35% 35%, #c86bfa, #3a1d7a)" }} />
      <div style={{ position: "absolute", left: 10, right: 10, top: 707, height: 2, background: "rgb(255 255 255 / 0.25)" }}>
        <div style={{ width: `${Math.min(100, 4 + Math.max(0, t - at) * 6)}%`, height: "100%", background: "#fff" }} />
      </div>
      {/* Barre de navigation. */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 714, height: 54, display: "flex", justifyContent: "space-around", alignItems: "center", color: "#fff", fontSize: 10.5, fontWeight: 600 }}>
        {NAV.map(([label, d], i) =>
          label ? (
            <div key={label} style={{ display: "grid", justifyItems: "center", gap: 2, opacity: i === 0 ? 1 : 0.8, position: "relative" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill={i === 0 ? "#fff" : "none"} stroke="#fff" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round">
                <path d={d} />
              </svg>
              {label}
              {label === "Messages" && <span style={{ position: "absolute", right: 14, top: -2, width: 7, height: 7, borderRadius: 9, background: "#fe2c55" }} />}
            </div>
          ) : (
            <div key="plus" style={{ width: 46, height: 30, borderRadius: 9, background: "#fff", boxShadow: "-3px 0 0 #25f4ee, 3px 0 0 #fe2c55", display: "grid", placeItems: "center", color: "#000", fontSize: 24, fontWeight: 600, lineHeight: 1 }}>+</div>
          ),
        )}
      </div>
      {notifAt !== undefined && <FripCashNotification at={notifAt} />}
    </div>
  );
}

// ─── Excuse n° 3 : « Mes clients ne sont pas sur internet. » ──────────────────
export function Excuse3() {
  const t = useTime();
  const start = blockStart(3);
  const end = blockStart(4) - 0.05;
  const quote = cue(3, "Mes");
  const feedIn = cue(3, "tu", 0) - 0.2;
  const crowd = cue(3, "Ton");
  const frip = cue(3, "Et");
  const phone = usePhoneMove(feedIn);
  const spread = prog(t, crowd, 0.6, BACK) * (1 - prog(t, frip - 0.1, 0.4, QUART));
  const arrow = prog(t, cue(3, "vidéo…") - 0.1, 0.5, BACK);
  return (
    <AbsoluteFill>
      <Paper />
      <Bubble at={quote} text="Mes clients ne sont pas sur internet." style={{ top: 800 }} exitAt={feedIn - 0.1} />
      {/* Les téléphones des clients, derrière. */}
      {spread > 0 &&
        [-1, 1].map((side) => (
          <Phone key={side} width={PW * 0.86} style={{ left: PHONE_LEFT + 30 + side * 330 * spread, top: PHONE_TOP + 80, transform: `rotate(${side * 9 * spread}deg) scale(${0.9})`, opacity: Math.min(1, spread * 1.5) }}>
            <FeedScreen at={crowd} />
          </Phone>
        ))}
      {phone.visible && (
        <Phone width={PW} style={phone.style}>
          {/* La notification arrive pendant que le client regarde TikTok : l'écran reste sur la vidéo. */}
          <FeedScreen at={feedIn} notifAt={cue(3, "prévenu.") - 0.35} />
        </Phone>
      )}
      {t >= cue(3, "vidéo…") - 0.1 && t < crowd && (
        <div style={{ position: "absolute", left: 600, top: 290, fontFamily: FONT, fontWeight: 900, fontSize: 72, color: C.cobalt, transform: `scale(${arrow}) rotate(-6deg)`, transformOrigin: "0 50%" }}>
          toi, là. ↓
        </div>
      )}
      <Chip at={crowd + 0.15} exitAt={frip - 0.2} style={{ left: 330, top: 300 }}>
        Ton client aussi 👀
      </Chip>
      <Chip at={frip + 0.2} exitAt={end - 0.3} style={{ left: 90, top: 300 }}>
        FripCash · Guinée
      </Chip>
      <Sticker at={cue(3, "prévenu.")} exitAt={end - 0.3} style={{ right: 70, top: 1250 }} rotate={8} color={C.white} bg={C.fripcash}>
        Bip-bip !
      </Sticker>
      <ExcuseCard n={3} at={start} dockAt={quote - 0.25} end={end} />
    </AbsoluteFill>
  );
}

// ─── Excuse n° 2 : « Les beaux sites, c'est cher et c'est pour les grandes marques. » ──
export function Excuse2() {
  const t = useTime();
  const start = blockStart(4);
  const end = blockStart(5) - 0.05;
  const quote = cue(4, "les", 0);
  const montage = cue(4, "une", 0) - 0.25;
  const cuts = [cue(4, "une", 0), cue(4, "une", 1), cue(4, "une", 2), cue(4, "un", 0), cue(4, "je", 1), cue(4, "mais")];
  const labels = ["Une banque", "Une appli de lecture", "Une marketplace", "Un portfolio qui bouge", "mbokocode.site", "mbokocode.site"];
  const prices = cue(4, "et", 2) - 0.1;
  const no = cue(4, "non,");
  const phone = usePhoneMove(montage, prices - 0.35);
  const { index, punch } = useCut(cuts);
  const tag = prog(t, prices, 0.55, BACK);
  const tagOut = prog(t, no - 0.05, 0.4, IN);
  const shake = t >= no && t < no + 0.4 ? Math.sin(t * 70) * 12 * (1 - (t - no) / 0.4) : 0;
  return (
    <AbsoluteFill>
      <Paper />
      <Bubble at={quote} text="Les beaux sites, c'est cher et c'est pour les grandes marques." style={{ top: 760 }} size={58} exitAt={montage - 0.1} />
      {phone.visible && (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + punch * 0.04})`, transformOrigin: "540px 950px" }}>
          <Phone width={PW} clip={index === 0 ? { src: "easybank", from: 0.6, rate: 1.2 } : index === 1 ? { src: "bibleverse", from: 0.4, rate: 1.1 } : index === 3 ? { src: "hero", from: 0.2 } : index === 4 ? { src: "folders", from: 0.2, rate: 1.1 } : index === 5 ? { src: "projects", from: 0.3, rate: 1.1 } : undefined} at={cuts[Math.max(0, index)]} style={phone.style}>
            {index === 2 ? <KoumaleHome at={cuts[2] - 0.2} /> : null}
          </Phone>
        </div>
      )}
      {index >= 0 && t < prices - 0.3 && (
        <div key={index} style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", opacity: prog(t, cuts[index], 0.2) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.white, background: C.ink, padding: "14px 32px", borderRadius: 99, transform: `scale(${0.8 + 0.2 * prog(t, cuts[index], 0.35, BACK)})` }}>{labels[index]}</div>
        </div>
      )}
      <Sticker at={cue(4, "expert")} exitAt={cue(4, "mais") - 0.05} style={{ right: 70, top: 1220 }} rotate={5}>
        Expert UI/UX ? 🤔
      </Sticker>
      <Sticker at={cue(4, "mais") + 0.05} exitAt={prices - 0.3} style={{ right: 70, top: 1220 }} rotate={-4} color={C.white} bg={C.cobalt}>
        … pas mal, en vrai ✓
      </Sticker>
      {/* L'étiquette de prix, puis le « Non ». */}
      {t >= prices && t < no + 0.5 && (
        <div style={{ position: "absolute", left: 150, top: 620, width: 780, transform: `rotate(${lerp(-14, -4, tag) + tagOut * 30}deg) translateY(${tagOut * 1400}px) scale(${0.6 + 0.4 * tag})`, opacity: Math.min(1, tag * 2) }}>
          <div style={{ background: C.white, borderRadius: 40, padding: "56px 60px", boxShadow: "0 40px 80px -36px rgb(11 19 38 / 0.45)", fontFamily: FONT, color: C.ink }}>
            <div style={{ width: 36, height: 36, borderRadius: 99, border: `6px solid ${C.paper2}`, marginBottom: 20 }} />
            <div style={{ fontWeight: 600, fontSize: 44, color: C.steel }}>Site one-page, à partir de</div>
            <div style={{ fontWeight: 900, fontStretch: "115%", fontSize: 150, lineHeight: 1, whiteSpace: "nowrap" }}>100k <span style={{ fontSize: 76, fontStretch: "100%" }}>FCFA</span></div>
          </div>
          <Pop at={cue(4, "négociables")} from={2} style={{ right: -30, bottom: -50 }}>
            <div style={{ transform: "rotate(-12deg)", border: `8px solid ${C.cobalt}`, color: C.cobalt, borderRadius: 18, padding: "10px 26px", fontFamily: FONT, fontWeight: 900, fontSize: 56, letterSpacing: "0.08em", background: "rgb(244 245 248 / 0.9)" }}>NÉGOCIABLE</div>
          </Pop>
        </div>
      )}
      {t >= no && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center", fontFamily: FONT, color: C.ink, transform: `translateX(${shake}px)` }}>
          <div style={{ fontWeight: 900, fontStretch: "125%", fontSize: 240, lineHeight: 1, transform: `scale(${0.5 + 0.5 * prog(t, no, 0.35, BACK)})` }}>NON,</div>
          <div style={{ fontWeight: 800, fontSize: 92, marginTop: 60, lineHeight: 1.18 }}>
            {[
              [["tu", 0], ["peux", 0], ["avoir", 0]],
              [["un", 2], ["site", 0], ["de", 1], ["qualité", 0]],
              [["à", 0], ["petit", 0], ["prix.", 1]],
            ].map((line, i) => (
              <div key={i}>
                {line.map(([word, nth], j) => (
                  <React.Fragment key={j}>
                    <Rise at={cue(4, word as string, nth as number) - 0.06} style={{ color: word === "qualité" || word === "petit" || word === "prix." ? C.cobalt : C.ink }}>
                      {word}
                    </Rise>{" "}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
          <div style={{ margin: "14px auto 0", height: 14, borderRadius: 7, width: 560 * prog(t, cue(4, "prix.", 1), 0.4, QUART), background: C.cobalt }} />
        </div>
      )}
      <ExcuseCard n={2} at={start} dockAt={quote - 0.25} end={end}>
        <Sticker at={cue(4, "l'aime")} style={{ left: 250, top: 1300 }} rotate={-5}>
          😤 Celle-là, je l'aime pas.
        </Sticker>
      </ExcuseCard>
    </AbsoluteFill>
  );
}

// ─── Excuse n° 1 : « Je ne connais pas de développeur. » ──────────────────────
export function Excuse1() {
  const t = useTime();
  const start = blockStart(5);
  const end = blockStart(6) - 0.05;
  const quote = cue(5, "je", 0);
  const bah = cue(5, "bah");
  const known = cue(5, "maintenant", 1);
  const one = cue(5, "un.");
  const reveal = prog(t, bah, 0.6, BACK);
  const counter = prog(t, known, 0.5, BACK);
  return (
    <AbsoluteFill>
      <Paper />
      <Bubble at={quote} text="Je ne connais pas de développeur." style={{ top: 820 }} exitAt={bah - 0.05} />
      {/* Éclats de la bulle qui saute. */}
      {t >= bah - 0.05 &&
        t < bah + 0.6 &&
        [...Array(12)].map((_, i) => {
          const p = prog(t, bah - 0.05, 0.6);
          const a = (i / 12) * Math.PI * 2;
          return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * 420 * p, top: 900 + Math.sin(a) * 260 * p, width: 22, height: 22, borderRadius: 6, background: i % 2 ? C.cobalt : C.ink, opacity: 1 - p, transform: `rotate(${p * 180}deg)` }} />;
        })}
      {t >= bah && (
        <div style={{ position: "absolute", left: 0, right: 0, top: lerp(520, 430, counter), display: "grid", justifyItems: "center", fontFamily: FONT }}>
          <div style={{ position: "relative", transform: `scale(${(0.4 + 0.6 * reveal) * lerp(1, 0.8, counter)})` }}>
            <div style={{ position: "absolute", inset: -18, borderRadius: 999, border: `8px solid ${C.cobalt}` }} />
            <Img src={staticFile("img/mbokocode-avatar.jpg")} style={{ width: 380, height: 380, borderRadius: 999, objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 120, color: C.ink, marginTop: 40 }}>
            <Rise at={cue(5, "maintenant,", 0) - 0.05}>Maintenant,</Rise> <Rise at={cue(5, "si.") - 0.05} style={{ color: C.cobalt }}>si.</Rise>
          </div>
          <div style={{ fontWeight: 600, fontSize: 40, color: C.steel, opacity: prog(t, bah + 0.5, 0.4) }}>Charles · MBOKO CODE · développeur full-stack</div>
        </div>
      )}
      {t >= known && (
        <div style={{ position: "absolute", left: 170, right: 170, top: 1250, borderRadius: 32, background: C.white, padding: "30px 40px", boxShadow: "0 30px 60px -30px rgb(11 19 38 / 0.4)", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: FONT, transform: `translateY(${(1 - counter) * 80}px)`, opacity: counter }}>
          <div style={{ fontWeight: 700, fontSize: 36, color: C.ink, lineHeight: 1.2 }}>
            Développeurs
            <br />
            que tu connais
          </div>
          <div style={{ position: "relative", width: 120, height: 130, overflow: "hidden", fontWeight: 900, fontSize: 120, color: C.cobalt, lineHeight: "130px", textAlign: "center" }}>
            <div style={{ transform: `translateY(${-130 * prog(t, one - 0.15, 0.4, BACK)}px)` }}>
              <div>0</div>
              <div>1</div>
            </div>
          </div>
        </div>
      )}
      <ExcuseCard n={1} at={start} dockAt={quote - 0.25} end={end}>
        <Pop at={cue(5, "seule") - 0.1} style={{ left: 0, right: 0, top: 1300, display: "flex", justifyContent: "center" }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, letterSpacing: "0.06em", color: C.cobalt, background: C.white, padding: "18px 40px", borderRadius: 99 }}>LA SEULE VALABLE ✓</div>
        </Pop>
      </ExcuseCard>
    </AbsoluteFill>
  );
}
