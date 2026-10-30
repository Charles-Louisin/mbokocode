import React from "react";
import { AbsoluteFill } from "remotion";
import { Paper, Rise, useTime } from "../components";
import { BACK, C, FONT, prog, QUART } from "../theme";
import { cue } from "../timing";

// « Cinq excuses qu'ils donnent pour justifier qu'ils n'ont pas de site web. »
export function Hook() {
  const t = useTime();
  const five = prog(t, cue(0, "Cinq") - 0.1, 0.55, BACK);
  const url = prog(t, cue(0, "site") - 0.1, 0.45, BACK);
  const out = prog(t, 3.15, 0.3, QUART);
  return (
    <AbsoluteFill>
      <Paper />
      <AbsoluteFill style={{ transform: `scale(${1 - out * 0.06})`, opacity: 1 - out }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontStretch: "125%", fontSize: 640, lineHeight: 0.9, color: C.cobalt, transform: `scale(${0.4 + 0.6 * five}) rotate(${(1 - five) * -8}deg)`, opacity: Math.min(1, five * 2) }}>5</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 990, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontStretch: "118%", fontSize: 150, letterSpacing: "-0.02em", color: C.ink }}>
          <Rise at={cue(0, "excuses")}>excuses</Rise>
        </div>
        <div style={{ position: "absolute", left: 90, right: 90, top: 1190, textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: 58, lineHeight: 1.2, color: C.ink2 }}>
          <Rise at={cue(0, "qu'ils") - 0.05}>qu'ils donnent pour justifier</Rise>
          <br />
          <Rise at={cue(0, "qu'ils", 1) - 0.05}>qu'ils n'ont pas de…</Rise>
        </div>
        {/* La barre d'adresse vide : le site qui n'existe pas. */}
        <div style={{ position: "absolute", left: 150, right: 150, top: 1420, height: 120, borderRadius: 99, background: C.white, boxShadow: "0 24px 50px -24px rgb(11 19 38 / 0.35), 0 0 0 1.5px rgb(11 19 38 / 0.06)", display: "flex", alignItems: "center", gap: 18, padding: "0 44px", fontFamily: FONT, fontSize: 52, fontWeight: 700, color: C.ink, transform: `scale(${0.6 + 0.4 * url})`, opacity: Math.min(1, url * 2) }}>
          <span style={{ color: C.steel, fontWeight: 500 }}>https://</span>
          <span style={{ width: 5, height: 60, background: C.cobalt, opacity: Math.floor(t * 4) % 2 ? 0 : 1 }} />
          <span style={{ marginLeft: "auto", fontSize: 40, color: C.danger, fontWeight: 800 }}>site web ?</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
