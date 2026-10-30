import React from "react";
import { Img, staticFile } from "remotion";
import { useTime } from "./components";
import { BACK, C, EXPO, FONT, lerp, prog, QUART } from "./theme";

// Écrans redessinés en vectoriel net (432 × 768 px), d'après les captures fournies par Charles.
// Les données sont celles de démonstration : aucun vrai solde ni nom de client.

// ─── Icônes ──────────────────────────────────────────────────────────────────
type IconProps = { size?: number; color?: string; stroke?: number };
const icon = (paths: React.ReactNode) =>
  function Icon({ size = 20, color = "currentColor", stroke = 2 }: IconProps) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none" }}>
        {paths}
      </svg>
    );
  };
export const ISearch = icon(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const IHeart = icon(<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />);
export const IBag = icon(<><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>);
export const IBell = icon(<><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2Z" /><path d="M10 20a2 2 0 0 0 4 0" /></>);
export const IMenu = icon(<path d="M4 7h16M4 12h16M4 17h16" />);
export const IArrow = icon(<path d="M5 12h14m-5-5 5 5-5 5" />);
export const ICheck = icon(<path d="m5 12 5 5L20 7" />);
export const IPlus = icon(<path d="M12 5v14M5 12h14" />);
export const IComment = icon(<path d="M4 12a8 7 0 1 1 4 6l-4 2 1.2-3.6A6.8 6.8 0 0 1 4 12Z" />);
export const IShare = icon(<path d="M14 5l7 7-7 7v-4c-6 0-9 2-11 5 1-6 4-10 11-11V5Z" />);
export const IImage = icon(<><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="m21 17-5-5-9 8" /></>);
export const ICup = icon(<><path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9Z" /><path d="M16 11h2a2 2 0 0 1 0 4h-2" /><path d="M8 3v3M11 3v3" /></>);
export const IBox = icon(<><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" /></>);
export const IShirt = icon(<path d="M8 4 4 7l2 4 2-1v10h8V10l2 1 2-4-4-3a4 4 0 0 1-8 0Z" />);
export const IPhone = icon(<><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 18h2" /></>);
export const ILink = icon(<><path d="M10 14a4 4 0 0 0 5.7 0l3-3A4 4 0 0 0 13 5.3l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1" /></>);
export const IPlay = icon(<path d="M7 5v14l11-7L7 5Z" />);
export const ISend = icon(<path d="m4 12 16-8-6 16-2-6-8-2Z" />);

const card: React.CSSProperties = { background: C.white, borderRadius: 16, boxShadow: "0 6px 18px -10px rgb(11 19 38 / 0.25), 0 0 0 1px rgb(11 19 38 / 0.05)" };

export function StatusBar({ dark = false }: { dark?: boolean }) {
  const color = dark ? C.white : C.ink;
  return (
    <div style={{ height: 30, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", fontSize: 12.5, fontWeight: 700, color }}>
      <span>9:41</span>
      <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <span style={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
          {[5, 7, 9, 11].map((h) => (
            <span key={h} style={{ width: 3, height: h, background: color, borderRadius: 1 }} />
          ))}
        </span>
        <span style={{ width: 22, height: 11, border: `1.5px solid ${color}`, borderRadius: 3, padding: 1 }}>
          <span style={{ display: "block", width: "78%", height: "100%", background: color, borderRadius: 1 }} />
        </span>
      </span>
    </div>
  );
}

// ─── KOUMALE ─────────────────────────────────────────────────────────────────
export function KoumaleLogo({ size = 26, color = C.koumale, text = "KOUMALE" }: { size?: number; color?: string; text?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
      <svg width={size * 1.15} height={size} viewBox="0 0 30 26" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round">
        <path d="M12 3a10 10 0 0 0 0 20" />
        <path d="M18 3a10 10 0 0 0 0 20" opacity={0.75} />
        <path d="M24 7a6 6 0 0 0 0 12" opacity={0.5} />
      </svg>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: size * 0.7, letterSpacing: "0.02em", color: C.ink, whiteSpace: "nowrap" }}>{text}</span>
    </div>
  );
}

export const PRODUCTS = [
  { img: "paire-homme", name: "Paire Homme", shop: "City Shoes 👟", price: "19 000", old: "", badge: "" },
  { img: "tennis-femme", name: "Tennis femme", shop: "City Shoes 👟", price: "5 000", old: "", badge: "" },
  { img: "sandales", name: "Sandales à boucles", shop: "City Shoes 👟", price: "7 500", old: "12 500", badge: "-40%" },
  { img: "baskets-noires", name: "Baskets running", shop: "City Shoes 👟", price: "15 000", old: "18 000", badge: "-17%" },
];

function ProductCard({ p, appear = 1 }: { p: (typeof PRODUCTS)[number]; appear?: number }) {
  return (
    <div style={{ ...card, overflow: "hidden", opacity: appear, transform: `translateY(${(1 - appear) * 30}px)` }}>
      <div style={{ height: 118, position: "relative" }}>
        <Img src={staticFile(`img/koumale/${p.img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {p.badge && <div style={{ position: "absolute", top: 8, right: 8, background: "#ef4444", color: C.white, fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 99 }}>{p.badge}</div>}
      </div>
      <div style={{ padding: "9px 11px 11px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.steel, textTransform: "uppercase", letterSpacing: "0.04em" }}>{p.shop}</div>
        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{p.name}</div>
        <div style={{ display: "flex", gap: 6, alignItems: "baseline", marginTop: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: C.koumale }}>{p.price} FCFA</span>
          {p.old && <span style={{ fontSize: 10.5, color: C.steel, textDecoration: "line-through" }}>{p.old}</span>}
        </div>
      </div>
    </div>
  );
}

/** Vitrine KOUMALE : recherche, catégories, promotions. `scrollAt` lance un léger défilement. */
export function KoumaleHome({ at, scrollAt }: { at: number; scrollAt?: number }) {
  const t = useTime();
  const scroll = scrollAt === undefined ? 0 : prog(t, scrollAt, 1.6, QUART) * 150;
  return (
    <div style={{ width: 432, height: 768, background: "#fbfaf8", overflow: "hidden" }}>
      <StatusBar />
      <div style={{ transform: `translateY(${-scroll}px)` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px" }}>
          <KoumaleLogo />
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ background: C.koumale, color: C.white, fontSize: 12, fontWeight: 700, padding: "8px 12px", borderRadius: 10 }}>Créer ma boutique</div>
            <IMenu size={20} />
          </div>
        </div>
        <div style={{ margin: "6px 16px 0", ...card, borderRadius: 99, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", background: C.paper2, borderRadius: 99, padding: 3, fontSize: 11, fontWeight: 600 }}>
            {["Tout", "Produits", "Boutiques"].map((x, i) => (
              <span key={x} style={{ padding: "5px 9px", borderRadius: 99, background: i === 0 ? C.white : "transparent", color: i === 0 ? C.ink : C.steel }}>{x}</span>
            ))}
          </div>
          <ISearch size={16} color={C.steel} />
          <span style={{ fontSize: 12, color: C.steel }}>Rechercher…</span>
        </div>
        <div style={{ fontSize: 12.5, color: C.steel, textAlign: "center", margin: "16px 0 10px" }}>Trouvez facilement ce dont vous avez besoin</div>
        <div style={{ display: "flex", gap: 10, padding: "0 16px" }}>
          {[
            ["Alimentation", ICup],
            ["Mode", IShirt],
            ["Tech", IPhone],
            ["Autres", IBox],
          ].map(([label, Ico], i) => {
            const I = Ico as typeof ICup;
            return (
              <div key={label as string} style={{ ...card, flex: 1, padding: "12px 4px", display: "grid", justifyItems: "center", gap: 6, opacity: prog(t, at + 0.15 + i * 0.07, 0.4) }}>
                <I size={22} color={C.koumale} />
                <span style={{ fontSize: 10.5, fontWeight: 700 }}>{label as string}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 16px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#ff7a45,#ef4444)", display: "grid", placeItems: "center" }}>
              <IBag size={18} color={C.white} />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800 }}>Promotions Flash</div>
              <div style={{ fontSize: 11, color: C.steel }}>Retrouvez toutes les promotions</div>
            </div>
          </div>
          <div style={{ background: C.koumale, color: C.white, fontSize: 11.5, fontWeight: 700, padding: "7px 12px", borderRadius: 99 }}>Voir tout →</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 16px" }}>
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.name} p={p} appear={prog(t, at + 0.25 + i * 0.09, 0.5)} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Fiche produit, avec le bouton qui envoie la commande sur WhatsApp. `pressAt` : instant du clic. */
export function KoumaleProduct({ pressAt }: { pressAt: number }) {
  const t = useTime();
  const press = prog(t, pressAt, 0.1) * (1 - prog(t, pressAt + 0.12, 0.2));
  return (
    <div style={{ width: 432, height: 768, background: "#fbfaf8", overflow: "hidden" }}>
      <StatusBar />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px" }}>
        <KoumaleLogo />
        <IMenu size={20} />
      </div>
      <div style={{ fontSize: 11.5, color: C.steel, padding: "4px 18px 10px" }}>
        Boutiques / City Shoes 👟 / <b style={{ color: C.ink }}>Paire Homme</b>
      </div>
      <div style={{ margin: "0 16px", height: 300, borderRadius: 18, overflow: "hidden", ...card }}>
        <Img src={staticFile("img/koumale/paire-homme.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ padding: "16px 18px 0" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.koumale }}>City Shoes 👟</div>
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 2 }}>Paire Homme</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>19 000 FCFA</div>
        <div style={{ fontSize: 12.5, color: C.steel, marginTop: 8, lineHeight: 1.45 }}>Cuir grainé, semelle crantée. Pointures 40 à 45, livraison à convenir avec la boutique.</div>
      </div>
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 26, height: 54, borderRadius: 14, background: C.chat, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 16, fontWeight: 800, transform: `scale(${1 - press * 0.05})`, boxShadow: "0 12px 26px -12px rgb(31 168 85 / 0.7)" }}>
        <IComment size={20} color={C.white} />
        Commander sur WhatsApp
      </div>
    </div>
  );
}

/** Conversation avec la boutique : la commande arrive, prête, dans le WhatsApp du vendeur. */
export function OrderChat({ at }: { at: number }) {
  const t = useTime();
  const msg = prog(t, at + 0.35, 0.5, BACK);
  const seen = t > at + 1.4;
  return (
    <div style={{ width: 432, height: 768, background: "#efeae2", overflow: "hidden", position: "relative" }}>
      <div style={{ background: "#0f7a4a", color: C.white }}>
        <StatusBar dark />
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 16px 14px" }}>
          <div style={{ width: 40, height: 40, borderRadius: 99, background: C.white, display: "grid", placeItems: "center", fontSize: 20 }}>👟</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>City Shoes</div>
            <div style={{ fontSize: 11.5, opacity: 0.8 }}>en ligne</div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <span style={{ background: "#fff8", fontSize: 11, padding: "4px 10px", borderRadius: 8, color: C.ink2 }}>Aujourd'hui</span>
      </div>
      <div style={{ position: "absolute", right: 14, top: 150, width: 300, transformOrigin: "100% 0", transform: `scale(${0.6 + 0.4 * msg})`, opacity: Math.min(1, msg * 2) }}>
        <div style={{ background: "#d9fdd3", borderRadius: "14px 4px 14px 14px", padding: 8, boxShadow: "0 2px 4px rgb(0 0 0 / 0.08)" }}>
          <div style={{ display: "flex", gap: 10, background: "#c8f0c0", borderRadius: 10, padding: 8 }}>
            <Img src={staticFile("img/koumale/paire-homme.jpg")} style={{ width: 62, height: 62, borderRadius: 8, objectFit: "cover" }} />
            <div style={{ fontSize: 12, lineHeight: 1.35 }}>
              <b>Paire Homme</b>
              <div>19 000 FCFA</div>
              <div style={{ color: C.steel, fontSize: 10.5 }}>koumale.com</div>
            </div>
          </div>
          <div style={{ fontSize: 14.5, lineHeight: 1.4, padding: "8px 4px 2px" }}>Bonjour 👋 Je souhaite commander cet article : Paire Homme, pointure 43.</div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 4, alignItems: "center", fontSize: 10.5, color: C.steel }}>
            9:41
            <span style={{ color: seen ? "#3b9cff" : C.steel, fontWeight: 900, letterSpacing: -3 }}>✓✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Espace vendeur : le formulaire « Ajouter un produit » qui se remplit, puis la publication. */
export function KoumaleAdd({ at }: { at: number }) {
  const t = useTime();
  const typed = (text: string, from: number, cps = 16) => text.slice(0, Math.max(0, Math.floor((t - from) * cps)));
  const f1 = at + 0.15;
  const f2 = at + 0.75;
  const f3 = at + 1.0;
  const imgAt = at + 1.4;
  const pubAt = at + 1.8;
  const caret = (from: number, to: number) => (t >= from && t < to && Math.floor(t * 3) % 2 === 0 ? "|" : "");
  const field = (label: string, value: string, focus: boolean) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>{label}</div>
      <div style={{ height: 40, borderRadius: 10, border: `1.5px solid ${focus ? C.koumale : C.line}`, background: C.white, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14, color: value ? C.ink : C.steel }}>{value || "…"}</div>
    </div>
  );
  const done = prog(t, pubAt + 0.15, 0.45, BACK);
  return (
    <div style={{ width: 432, height: 768, background: "#fbfaf8", overflow: "hidden", position: "relative" }}>
      <StatusBar />
      <div style={{ padding: "12px 18px 0" }}>
        <div style={{ fontSize: 24, fontWeight: 800 }}>Ajouter un produit</div>
        <div style={{ fontSize: 12.5, color: C.steel, marginTop: 4 }}>Créez un nouveau produit pour votre boutique</div>
      </div>
      <div style={{ margin: "16px 16px 0", ...card, padding: 16 }}>
        {field("Nom du produit", typed("Paire Homme", f1, 22) + caret(f1, f2), t >= f1 && t < f2)}
        {field("Catégorie", t >= f2 ? "Chaussures" : "", t >= f2 && t < f3)}
        {field("Prix (FCFA)", typed("19000", f3, 14) + caret(f3, imgAt), t >= f3 && t < imgAt)}
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>Images du produit</div>
        <div style={{ height: 96, borderRadius: 12, border: `1.5px dashed ${C.line}`, display: "flex", alignItems: "center", gap: 10, padding: 10 }}>
          {t >= imgAt ? (
            <Img src={staticFile("img/koumale/paire-homme.jpg")} style={{ width: 76, height: 76, borderRadius: 10, objectFit: "cover", transform: `scale(${prog(t, imgAt, 0.4, BACK)})` }} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.steel, fontSize: 12 }}>
              <IImage size={22} color={C.steel} /> Ajoutez jusqu'à 5 images
            </div>
          )}
        </div>
      </div>
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 26, height: 52, borderRadius: 14, background: C.koumale, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, transform: `scale(${1 - (prog(t, pubAt, 0.1) - prog(t, pubAt + 0.12, 0.2)) * 0.05})` }}>Publier le produit</div>
      {t >= pubAt + 0.15 && (
        <div style={{ position: "absolute", left: 40, right: 40, top: 300, ...card, borderRadius: 20, padding: "22px 18px", display: "grid", justifyItems: "center", gap: 10, transform: `scale(${0.7 + 0.3 * done})`, opacity: Math.min(1, done * 2) }}>
          <div style={{ width: 54, height: 54, borderRadius: 99, background: C.success, display: "grid", placeItems: "center" }}>
            <ICheck size={30} color={C.white} stroke={3} />
          </div>
          <div style={{ fontSize: 17, fontWeight: 800 }}>Produit en ligne</div>
          <div style={{ fontSize: 12, color: C.steel }}>Visible dès maintenant dans ta boutique</div>
        </div>
      )}
    </div>
  );
}

// ─── FripCash ────────────────────────────────────────────────────────────────
/** Notification push FripCash, posée sur la vraie capture du site ; le produit est une vraie annonce. */
export function FripCashNotification({ at }: { at: number }) {
  const t = useTime();
  const n = prog(t, at, 0.55, BACK);
  if (t < at) return null;
  return (
    <div style={{ position: "absolute", left: 10, right: 10, top: 8 + lerp(-130, 0, n), borderRadius: 20, padding: "12px 14px", background: "rgb(255 255 255 / 0.97)", boxShadow: "0 18px 40px -14px rgb(11 19 38 / 0.45)", display: "flex", gap: 12, alignItems: "center", fontFamily: FONT, color: C.ink }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: C.fripcash, display: "grid", placeItems: "center", flex: "none" }}>
        <IBag size={22} color={C.white} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: C.steel, fontWeight: 600 }}>
          FRIPCASH <span>maintenant</span>
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 800, marginTop: 2 }}>Nouvelle commande 🎉</div>
        <div style={{ fontSize: 12.5, color: C.ink2 }}>Sac à main cuir cognac · 302 400 GNF</div>
      </div>
      <Img src={staticFile("img/fripcash/produit-5.jpg")} style={{ width: 46, height: 46, borderRadius: 10, objectFit: "cover", flex: "none" }} />
    </div>
  );
}

// ─── MES POCHES (données d'exemple de mespoches.store) ───────────────────────
export function MesPochesHome() {
  return (
    <div style={{ width: 432, height: 768, background: "#f7f8fb", overflow: "hidden" }}>
      <StatusBar />
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px" }}>
        <div style={{ width: 38, height: 38, borderRadius: 99, background: "#2457e6", color: C.white, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 15 }}>MP</div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>MES POCHES</div>
      </div>
      <div style={{ margin: "8px 16px", borderRadius: 22, padding: 20, color: C.white, background: "linear-gradient(140deg,#1b2b6b,#1d3fa8)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 160, height: 160, borderRadius: 99, background: "rgb(255 255 255 / 0.07)" }} />
        <div style={{ fontSize: 11, letterSpacing: "0.1em", fontWeight: 700, opacity: 0.8 }}>PLAN PREMIUM</div>
        <div style={{ fontSize: 11.5, opacity: 0.7, marginTop: 14 }}>Solde disponible</div>
        <div style={{ fontSize: 34, fontWeight: 800 }}>248 500 F</div>
        <div style={{ display: "flex", gap: 30, marginTop: 12, fontSize: 12 }}>
          <span>↓ Entrées 82 000</span>
          <span>↑ Sorties 41 200</span>
        </div>
        <div style={{ fontSize: 11.5, letterSpacing: "0.08em", fontWeight: 700, marginTop: 16, opacity: 0.85 }}>JOHN DOE</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", padding: "12px 8px" }}>
        {["Dépense", "Revenu", "Scanner", "Virement"].map((x, i) => (
          <div key={x} style={{ display: "grid", justifyItems: "center", gap: 6, fontSize: 11 }}>
            <div style={{ width: 52, height: 52, borderRadius: 99, background: ["#fde8e6", "#e3f6ea", "#fdf1e2", "#e6edfd"][i] }} />
            {x}
          </div>
        ))}
      </div>
      <div style={{ padding: "6px 18px", fontSize: 16, fontWeight: 800 }}>Poches</div>
      {[
        ["Cash", "42 000 F"],
        ["Orange Money", "86 500 F"],
        ["MTN MoMo", "31 200 F"],
      ].map(([name, amount]) => (
        <div key={name} style={{ margin: "8px 16px", ...card, padding: "14px 16px", display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700 }}>
          {name}
          <span>{amount}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Le vieux site qui attend ────────────────────────────────────────────────
export function OldSite({ at }: { at: number }) {
  const t = useTime();
  const block = (w: string, h: number, extra?: React.CSSProperties) => <div style={{ width: w, height: h, borderRadius: 6, background: "#d7dae1", ...extra }} />;
  return (
    <div style={{ width: 432, height: 768, background: "#eceef2", overflow: "hidden", position: "relative", filter: "saturate(0.3)" }}>
      <StatusBar />
      <div style={{ height: 50, background: "#c9ccd4", display: "flex", alignItems: "center", padding: "0 18px", fontSize: 14, fontWeight: 700, color: "#7c8293", fontFamily: "Times New Roman, serif" }}>Mon Entreprise — Accueil</div>
      <div style={{ padding: 22, display: "grid", gap: 12 }}>
        <div style={{ fontFamily: "Times New Roman, serif", fontSize: 26, color: "#6d7384" }}>Bienvenue sur notre site</div>
        {block("100%", 150)}
        {block("90%", 12)}
        {block("95%", 12)}
        {block("70%", 12)}
        <div style={{ display: "flex", gap: 12 }}>
          {block("33%", 90)}
          {block("33%", 90)}
          {block("33%", 90)}
        </div>
        {block("80%", 12)}
        {block("60%", 12)}
      </div>
      <div style={{ position: "absolute", left: 22, right: 22, bottom: 30, borderRadius: 14, background: C.white, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: prog(t, at, 0.4) }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.ink2 }}>Réservations ce mois</span>
        <span style={{ fontSize: 30, fontWeight: 800, color: C.ink }}>0</span>
      </div>
    </div>
  );
}

// ─── TikTok : vraie capture du profil @mbokocode (30 octobre 2026) ──────────
// public/img/tiktok-profil.jpg, prise dans le navigateur (le drapeau 🇨🇲 remplacé par son dessin,
// que Windows n'affiche pas). Les animations sont posées par-dessus, aux positions des boutons.
const TK = { left: 13, top: 30, scale: (432 * 0.94) / 1080 };
const tk = (x: number, y: number, w: number, h: number): React.CSSProperties => ({ position: "absolute", left: TK.left + x * TK.scale, top: TK.top + y * TK.scale, width: w * TK.scale, height: h * TK.scale });

export function TikTokProfile({ followAt, pressAt, linkAt, msgAt, circleAt }: { followAt?: number; pressAt?: number; linkAt?: number; msgAt?: number; circleAt?: number }) {
  const t = useTime();
  const pressed = pressAt !== undefined && t >= pressAt;
  const press = pressAt === undefined ? 0 : prog(t, pressAt, 0.1) * (1 - prog(t, pressAt + 0.12, 0.2));
  const hover = followAt === undefined || pressed ? 0 : prog(t, followAt, 0.4);
  const msg = msgAt === undefined ? 0 : prog(t, msgAt, 0.4) * (1 - prog(t, msgAt + 1.8, 0.4));
  const link = linkAt === undefined ? 0 : prog(t, linkAt, 0.4, BACK);
  const circle = circleAt === undefined ? 0 : prog(t, circleAt, 0.5, QUART);
  return (
    <div style={{ width: 432, height: 768, background: C.white, overflow: "hidden", position: "relative" }}>
      <StatusBar />
      <Img src={staticFile("img/tiktok-profil.jpg")} style={{ position: "absolute", left: TK.left, top: TK.top, width: 1080 * TK.scale }} />
      {/* « 34 Followers » entouré. */}
      {circle > 0 && (
        <svg style={{ ...tk(360, 590, 320, 100), overflow: "visible" }} viewBox="0 0 320 100" preserveAspectRatio="none">
          <ellipse cx="160" cy="50" rx="158" ry="46" fill="none" stroke={C.danger} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - circle} vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      {/* Bouton « Suivre » : survolé, puis pressé et devenu « Abonné ». */}
      <div style={{ ...tk(3, 712, 297, 121), borderRadius: 999, boxShadow: hover ? `0 0 0 ${4 * hover}px rgb(254 44 85 / 0.35)` : undefined, transform: `scale(${1 - press * 0.06 + hover * 0.04})`, background: pressed ? "#eeeff1" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 15, fontWeight: 700, color: C.ink }}>
        {pressed && (
          <>
            <ICheck size={16} stroke={3} /> Abonné
          </>
        )}
      </div>
      <div style={{ ...tk(337, 712, 273, 121), borderRadius: 999, boxShadow: msg ? `0 0 0 ${3.5 * msg}px ${C.cobalt}` : undefined }} />
      {/* Pas de lien en bio. */}
      {link > 0 && (
        <div style={{ position: "absolute", left: 14, top: 424, height: 28, display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: C.danger, padding: "0 12px", borderRadius: 99, border: `1.5px dashed ${C.danger}`, background: C.white, transform: `scale(${0.85 + 0.15 * link})`, transformOrigin: "0 50%", opacity: link }}>
          <ILink size={14} color={C.danger} /> Lien en bio : à partir de 1 000 abonnés
        </div>
      )}
    </div>
  );
}

export { EXPO };
