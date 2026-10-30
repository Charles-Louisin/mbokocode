import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Flag, LogoDraw, Paper, Rise, useTime } from "../components";
import { ICheck } from "../screens";
import { BACK, C, FONT, IN, lerp, prog, QUART, SERIF } from "../theme";
import { outroCue } from "../timing";

// Les deux blocs de marque réutilisables d'une vidéo à l'autre. Leur temps part de 0 (voir
// <LocalTime> dans components.tsx) : on les pose où l'on veut dans n'importe quelle vidéo.

/** Lettres « MBOKO CODE » qui claquent : chaque lettre passe d'étroite à large. */
function Wordmark({ at, size, color = C.ink }: { at: number; size: number; color?: string }) {
  const t = useTime();
  const letters = "MBOKO CODE".split("");
  return (
    <div style={{ display: "flex", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: "0.04em", color, whiteSpace: "pre" }}>
      {letters.map((l, i) => {
        const p = prog(t, at + i * 0.03, 0.4, BACK);
        return (
          <span key={i} style={{ fontStretch: `${lerp(62, 125, Math.min(1, prog(t, at + i * 0.03, 0.45)))}%`, opacity: Math.min(1, p * 3), display: "inline-block", transform: `translateY(${(1 - p) * 30}px)` }}>
            {l}
          </span>
        );
      })}
    </div>
  );
}

/** Intro signée, 2,25 s, thème clair : curseur, « M » tracé d'un trait, ta-dum cobalt, plongée. */
export function Intro() {
  const t = useTime();
  const blink = t < 0.42 ? (Math.floor(t / 0.12) % 2 === 0 ? 1 : 0) : 0;
  const ripple = prog(t, 0.95, 0.9);
  const dive = prog(t, 1.78, 0.47, IN);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Paper dots={false} />
      {/* Onde cobalt au remplissage du « M » : c'est l'image du « ta-dum ». */}
      {t >= 0.95 && (
        <div style={{ position: "absolute", left: 540, top: 900, width: 0, height: 0 }}>
          {[0, 0.12].map((d) => {
            const r = prog(t, 0.95 + d, 0.9);
            return <div key={d} style={{ position: "absolute", left: -900 * r, top: -900 * r, width: 1800 * r, height: 1800 * r, borderRadius: "50%", border: `${lerp(26, 2, r)}px solid ${C.cobalt}`, opacity: (1 - r) * 0.5 }} />;
          })}
        </div>
      )}
      <AbsoluteFill style={{ transform: `scale(${1 + dive * 9})`, transformOrigin: "540px 945px", opacity: 1 - prog(t, 2.0, 0.25) }}>
        {/* Curseur de code qui clignote, puis devient le premier trait du « M ». */}
        <div style={{ position: "absolute", left: 534, top: 840, width: 12, height: 120, borderRadius: 3, background: C.cobalt, opacity: blink }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center", transform: `scale(${1 + ripple * 0.04 - prog(t, 0.95, 0.12) * 0.04 + prog(t, 0.95, 0.12) * 0.04})` }}>
          {t >= 0.38 && <LogoDraw at={0.4} width={430} drawDur={0.55} />}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1050 }}>
          <Wordmark at={1.15} size={78} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/** Signature de fin, réutilisable, calée sur public/audio/outro.wav (src/timing-outro.json). */
export function Outro() {
  const t = useTime();
  const tu = outroCue("Tu");
  const je = outroCue("je");
  const allez = outroCue("Allez,");
  const abonne = outroCue("abonne-toi.");
  const pressAt = abonne + 0.35;
  const pressed = t >= pressAt;
  const press = prog(t, pressAt, 0.1) * (1 - prog(t, pressAt + 0.12, 0.2));
  const card = prog(t, allez - 0.1, 0.55, BACK);
  const lift = prog(t, allez - 0.2, 0.6, QUART);
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{ position: "absolute", left: 0, right: 0, top: lerp(600, 430, lift), display: "grid", justifyItems: "center", transform: `scale(${lerp(1, 0.78, lift)})` }}>
        <LogoDraw at={0.05} width={300} drawDur={0.5} />
        <div style={{ marginTop: 34 }}>
          <Wordmark at={outroCue("MBOKO")} size={70} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: lerp(1010, 830, lift), textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 92, color: C.ink, lineHeight: 1.1 }}>
          <Rise at={tu - 0.05}>Tu as l'idée…</Rise>
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontStretch: "112%", fontSize: 92, color: C.ink, lineHeight: 1.1, marginTop: 10 }}>
          <Rise at={je - 0.05}>je construis</Rise> <Rise at={je + 0.3} style={{ color: C.cobalt }}>le reste.</Rise>
        </div>
      </div>
      {/* Carte d'abonnement @mbokocode. */}
      {t >= allez - 0.1 && (
        <div style={{ position: "absolute", left: 130, right: 130, top: 1190, padding: "34px 36px", borderRadius: 40, background: C.white, boxShadow: "0 40px 80px -36px rgb(11 19 38 / 0.4), 0 0 0 1.5px rgb(11 19 38 / 0.05)", display: "flex", alignItems: "center", gap: 28, transform: `translateY(${(1 - card) * 120}px) scale(${0.8 + 0.2 * card})`, opacity: Math.min(1, card * 2) }}>
          <Img src={staticFile("img/mbokocode-avatar.jpg")} style={{ width: 130, height: 130, borderRadius: 99, objectFit: "cover" }} />
          <div style={{ flex: 1, fontFamily: FONT }}>
            <div style={{ fontWeight: 800, fontSize: 40, color: C.ink, display: "flex", alignItems: "center", gap: 12 }}>MBOKO CODE <Flag country="cm" height={30} /></div>
            <div style={{ fontWeight: 600, fontSize: 32, color: C.steel, marginTop: 4 }}>@mbokocode</div>
            <div style={{ marginTop: 20, height: 74, borderRadius: 16, background: pressed ? C.paper2 : "#fe2c55", color: pressed ? C.ink : C.white, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontWeight: 800, fontSize: 34, transform: `scale(${1 - press * 0.07})` }}>
              {pressed ? (
                <>
                  <ICheck size={34} stroke={3} /> Abonné
                </>
              ) : (
                "S'abonner"
              )}
            </div>
          </div>
        </div>
      )}
      {/* Petits éclats au clic. */}
      {pressed &&
        [...Array(10)].map((_, i) => {
          const p = prog(t, pressAt, 0.7);
          const a = (i / 10) * Math.PI * 2;
          return <div key={i} style={{ position: "absolute", left: 640 + Math.cos(a) * 200 * p, top: 1390 + Math.sin(a) * 140 * p, width: 16, height: 16, borderRadius: i % 2 ? 99 : 3, background: i % 3 ? C.cobalt : "#fe2c55", opacity: 1 - p }} />;
        })}
    </AbsoluteFill>
  );
}
