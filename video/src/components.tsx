import React, { createContext, useContext } from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BACK, C, EXPO, FONT, FPS, prog, QUART, SERIF } from "./theme";

// ─── Temps global ────────────────────────────────────────────────────────────
// Les scènes vivent dans des <Sequence> (pour que les vidéos démarrent au bon moment), mais leur
// chorégraphie est écrite en temps absolu de la vidéo, calé sur les mots de la voix off.
const OffsetContext = createContext(0);

export function useTime() {
  const frame = useCurrentFrame();
  const offset = useContext(OffsetContext);
  return (frame + offset) / FPS;
}

export function Scene({ from, to, children }: { from: number; to: number; children: React.ReactNode }) {
  const start = Math.round(from * FPS);
  return (
    <Sequence from={start} durationInFrames={Math.max(1, Math.round(to * FPS) - start)}>
      <OffsetContext.Provider value={start}>{children}</OffsetContext.Provider>
    </Sequence>
  );
}

/** Rebase le temps : les enfants voient `useTime()` partir de 0 à l'instant `at` (blocs réutilisables). */
export function LocalTime({ at, children }: { at: number; children: React.ReactNode }) {
  const offset = useContext(OffsetContext);
  return <OffsetContext.Provider value={offset - Math.round(at * FPS)}>{children}</OffsetContext.Provider>;
}

// ─── Fond : papier clair et trame de points ──────────────────────────────────
export function Paper({ tint = C.paper, dots = true }: { tint?: string; dots?: boolean }) {
  const t = useTime();
  return (
    <AbsoluteFill style={{ background: tint }}>
      {dots && (
        <AbsoluteFill
          style={{
            backgroundImage: `radial-gradient(${C.line} 2.2px, transparent 2.6px)`,
            backgroundSize: "44px 44px",
            backgroundPosition: `${(t * 6) % 44}px ${(t * 10) % 44}px`,
            opacity: 0.7,
          }}
        />
      )}
    </AbsoluteFill>
  );
}

// ─── Entrées ─────────────────────────────────────────────────────────────────
/** Texte qui monte depuis un masque (la signature des titres du site). */
export function Rise({ at, dur = 0.7, children, style, exitAt, exitDur = 0.4 }: { at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties; exitAt?: number; exitDur?: number }) {
  const t = useTime();
  const p = prog(t, at, dur);
  const out = exitAt === undefined ? 0 : prog(t, exitAt, exitDur, QUART);
  return (
    <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.1em", marginBottom: "-0.1em", ...style }}>
      <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 115 - out * 115}%)` }}>{children}</span>
    </span>
  );
}

/** Apparition avec léger rebond (échelle + opacité), et sortie optionnelle. */
export function Pop({ at, dur = 0.5, exitAt, exitDur = 0.3, from = 0.6, children, style }: { at: number; dur?: number; exitAt?: number; exitDur?: number; from?: number; children: React.ReactNode; style?: React.CSSProperties }) {
  const t = useTime();
  const p = prog(t, at, dur, BACK);
  const o = prog(t, at, dur * 0.5);
  const out = exitAt === undefined ? 0 : prog(t, exitAt, exitDur, QUART);
  if (t < at || (exitAt !== undefined && t > exitAt + exitDur)) return null;
  return (
    <div style={{ position: "absolute", opacity: o * (1 - out), transform: `scale(${(from + (1 - from) * p) * (1 - out * 0.3)})`, ...style }}>
      {children}
    </div>
  );
}

// ─── Monogramme MBOKO CODE (src/components/brand/LogoMark.tsx) ────────────────
export const LOGO_VIEWBOX = "140 410 952 428";
export const LOGO_PATHS = [
  "M148 830 L435 438 C452 418 492 410 512 435 L848 830 L692 830 C660 830 640 820 625 800 L512 672 L560 594 C540 588 512 592 495 612 L372 785 C350 815 325 830 298 830 Z",
  "M632 522 L688 438 C700 422 712 418 730 418 L798 418 C815 418 828 426 836 440 L1083 830 L970 830 C935 830 905 815 885 792 C800 700 720 605 632 522 Z",
];

/** Le « M » qui se trace d'un trait d'encre puis se remplit. */
export function LogoDraw({ at, width, drawDur = 0.6, color = C.cobalt, stroke = C.ink }: { at: number; width: number; drawDur?: number; color?: string; stroke?: string }) {
  const t = useTime();
  const draw = prog(t, at, drawDur, QUART);
  const fill = prog(t, at + drawDur * 0.85, 0.25);
  return (
    <svg viewBox={LOGO_VIEWBOX} style={{ width, overflow: "visible" }}>
      {LOGO_PATHS.map((d) => (
        <path key={d} d={d} pathLength={1} fill={color} fillOpacity={fill} stroke={stroke} strokeOpacity={1 - fill} strokeWidth={5} vectorEffect="non-scaling-stroke" strokeDasharray={1} strokeDashoffset={1 - draw} strokeLinejoin="round" />
      ))}
    </svg>
  );
}

export function Logo({ width, color = C.cobalt }: { width: number; color?: string }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} style={{ width, display: "block" }}>
      {LOGO_PATHS.map((d) => (
        <path key={d} d={d} fill={color} />
      ))}
    </svg>
  );
}

// ─── Écrans : téléphone ──────────────────────────────────────────────────────
export type Clip = { src: string; from: number; rate?: number };

/** Capture vidéo d'un site, démarrée à l'instant absolu `at`, à partir de `clip.from` secondes. */
export function Footage({ clip, at }: { clip: Clip; at: number }) {
  const offset = useContext(OffsetContext);
  return (
    <Sequence from={Math.round(at * FPS) - offset} layout="none">
      <OffthreadVideo src={staticFile(`capture/${clip.src}.mp4`)} trimBefore={Math.round(clip.from * FPS)} playbackRate={clip.rate ?? 1} muted style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </Sequence>
  );
}

// Les écrans redessinés sont composés en 432 × 768 px (la vue mobile des captures), puis mis à
// l'échelle du téléphone.
export const SCREEN_W = 432;
export const SCREEN_H = 768;

/** Téléphone clair sans marque : une capture (`clip`) ou un écran redessiné (`children`). */
export function Phone({ width = 560, clip, at = 0, children, style, tilt = 0 }: { width?: number; clip?: Clip; at?: number; children?: React.ReactNode; style?: React.CSSProperties; tilt?: number }) {
  const height = (width * 16) / 9;
  const bezel = width * 0.028;
  return (
    <div
      style={{
        position: "absolute",
        width: width + bezel * 2,
        height: height + bezel * 2,
        padding: bezel,
        borderRadius: width * 0.13,
        background: "linear-gradient(150deg, #ffffff, #dfe3ec 55%, #c9cfdc)",
        boxShadow: "0 0 0 1.5px rgb(11 19 38 / 0.08), 0 50px 90px -30px rgb(11 19 38 / 0.35), 0 18px 40px -20px rgb(47 84 255 / 0.25)",
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        ...style,
      }}
    >
      <div style={{ width, height, borderRadius: width * 0.105, overflow: "hidden", background: C.white, position: "relative" }}>
        {clip && <Footage clip={clip} at={at} />}
        {/* Écran redessiné, ou éléments posés par-dessus la capture (notification…). */}
        {children && <div style={{ width: SCREEN_W, height: SCREEN_H, transform: `scale(${width / SCREEN_W})`, transformOrigin: "0 0", position: "absolute", top: 0, left: 0, fontFamily: FONT, color: C.ink }}>{children}</div>}
      </div>
    </div>
  );
}

// ─── Bulle de message : la voix du client ────────────────────────────────────
/** Bulle reçue qui s'écrit (points de saisie, puis le texte), en italique : c'est le client qui parle. */
export function Bubble({ at, text, style, exitAt, size = 64, typing = 0.35 }: { at: number; text: string; style?: React.CSSProperties; exitAt?: number; size?: number; typing?: number }) {
  const t = useTime();
  if (t < at - typing) return null;
  const p = prog(t, at - typing, 0.45, BACK);
  const out = exitAt === undefined ? 0 : prog(t, exitAt, 0.35, QUART);
  if (out >= 1) return null;
  const showText = t >= at;
  return (
    <div style={{ position: "absolute", left: 70, right: 70, transformOrigin: "0% 100%", transform: `scale(${(0.5 + 0.5 * p) * (1 - out * 0.4)}) translateY(${out * -60}px)`, opacity: Math.min(1, p * 2) * (1 - out), ...style }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 22 }}>
        <div style={{ width: 92, height: 92, borderRadius: 99, flex: "none", background: C.paper2, border: `3px solid ${C.white}`, boxShadow: "0 8px 20px -8px rgb(11 19 38 / 0.3)", display: "grid", placeItems: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.steel }}>?</div>
        <div style={{ position: "relative", background: C.white, borderRadius: "46px 46px 46px 10px", padding: showText ? "34px 44px 38px" : "34px 40px", boxShadow: "0 30px 60px -28px rgb(11 19 38 / 0.35), 0 0 0 1.5px rgb(11 19 38 / 0.05)" }}>
          {showText ? (
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: size, lineHeight: 1.12, color: C.ink, letterSpacing: "-0.01em" }}>{text}</div>
          ) : (
            <div style={{ display: "flex", gap: 14, padding: "8px 4px" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 20, height: 20, borderRadius: 99, background: C.steel, opacity: 0.35 + 0.65 * Math.max(0, Math.sin((t * 9 - i * 0.9) % (Math.PI * 2))) }} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ marginLeft: 116, marginTop: 14, fontFamily: FONT, fontSize: 28, fontWeight: 600, color: C.steel, opacity: showText ? 1 : 0 }}>Un client, quelque part</div>
    </div>
  );
}

// ─── Doigt qui tape : cercle qui se pose puis onde ───────────────────────────
export function Tap({ at, x, y, size = 70 }: { at: number; x: number; y: number; size?: number }) {
  const t = useTime();
  if (t < at - 0.35 || t > at + 0.6) return null;
  const come = prog(t, at - 0.35, 0.3);
  const press = prog(t, at, 0.12) * (1 - prog(t, at + 0.12, 0.2));
  const ring = prog(t, at, 0.5);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 99, border: `3px solid ${C.ink}`, opacity: (1 - ring) * (t >= at ? 1 : 0), transform: `scale(${1 + ring * 1.4})` }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 99, background: "rgb(11 19 38 / 0.28)", opacity: come * (1 - prog(t, at + 0.3, 0.3)), transform: `scale(${1.3 - come * 0.3 - press * 0.15})` }} />
    </div>
  );
}

// ─── Drapeaux dessinés (Windows n'affiche pas les drapeaux en emoji) ─────────
const FLAGS = {
  cm: ["#007a5e", "#ce1126", "#fcd116"],
  fr: ["#002395", "#ffffff", "#ed2939"],
  gn: ["#ce1126", "#fcd116", "#009460"],
};

export function Flag({ country, height = 30 }: { country: keyof typeof FLAGS; height?: number }) {
  const [a, b, c] = FLAGS[country];
  return (
    <svg viewBox="0 0 30 20" style={{ height, width: height * 1.5, display: "inline-block", verticalAlign: "-0.12em", borderRadius: height * 0.12, boxShadow: "0 0 0 1px rgb(11 19 38 / 0.12)", flex: "none" }}>
      <rect width="10" height="20" fill={a} />
      <rect x="10" width="10" height="20" fill={b} />
      <rect x="20" width="10" height="20" fill={c} />
      {country === "cm" && <polygon fill="#fcd116" points="15,6.2 16.1,9.4 19.5,9.4 16.8,11.4 17.8,14.6 15,12.6 12.2,14.6 13.2,11.4 10.5,9.4 13.9,9.4" />}
    </svg>
  );
}

/** Pastille de texte. */
export function Chip({ children, at, style, exitAt }: { children: React.ReactNode; at: number; style?: React.CSSProperties; exitAt?: number }) {
  const t = useTime();
  const p = prog(t, at, 0.5, BACK);
  const out = exitAt === undefined ? 0 : prog(t, exitAt, 0.3, QUART);
  if (t < at) return null;
  return (
    <div style={{ position: "absolute", fontFamily: FONT, fontSize: 34, fontWeight: 600, color: C.ink, padding: "16px 30px", borderRadius: 99, background: C.white, boxShadow: "0 16px 34px -18px rgb(11 19 38 / 0.35), 0 0 0 1.5px rgb(11 19 38 / 0.06)", opacity: Math.min(1, p * 2) * (1 - out), transform: `translateY(${(1 - p) * 30}px) scale(${0.85 + p * 0.15})`, whiteSpace: "nowrap", ...style }}>
      {children}
    </div>
  );
}

export { EXPO };
