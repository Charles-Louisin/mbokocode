import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { LocalTime, Paper, Scene } from "./components";
import { Intro, Outro } from "./scenes/Brand";
import { Abonnes, Carte, Comment } from "./scenes/Ending";
import { Excuse1, Excuse2, Excuse3, Excuse4, Excuse5 } from "./scenes/Excuses";
import { Hook } from "./scenes/Hook";
import { FPS, INTRO_AT, INTRO_DUR, loadFonts, OUTRO_AT, OUTRO_DUR, SPLIT } from "./theme";
import { blockStart } from "./timing";

loadFonts();

// « Je note tes excuses » : accroche, intro signée, cinq excuses, commentaire, abonnés, carte,
// signature. Chaque scène se termine quand la suivante commence ; les excuses ouvrent par leur
// propre feuille cobalt, qui sert de transition.
export function Video() {
  const b = (n: number) => blockStart(n);
  const outro = OUTRO_AT;
  return (
    <AbsoluteFill>
      <Paper />
      {/* Voix : l'accroche, puis le reste après l'intro. */}
      <Sequence durationInFrames={Math.round(SPLIT * FPS)}>
        <Audio src={staticFile("audio/voice.wav")} />
      </Sequence>
      <Sequence from={Math.round((INTRO_AT + INTRO_DUR) * FPS)}>
        <Audio src={staticFile("audio/voice.wav")} trimBefore={Math.round(SPLIT * FPS)} />
      </Sequence>
      <Sequence from={Math.round(outro * FPS)}>
        <Audio src={staticFile("audio/outro.wav")} volume={1.2} />
      </Sequence>
      <Audio src={staticFile("audio/sfx.wav")} volume={0.6} />

      <Scene from={0} to={INTRO_AT}>
        <Hook />
      </Scene>
      <Scene from={INTRO_AT} to={INTRO_AT + INTRO_DUR}>
        <LocalTime at={INTRO_AT}>
          <Intro />
        </LocalTime>
      </Scene>
      <Scene from={INTRO_AT + INTRO_DUR - 0.25} to={b(2) - 0.05}>
        <Excuse5 />
      </Scene>
      <Scene from={b(2) - 0.4} to={b(3) - 0.05}>
        <Excuse4 />
      </Scene>
      <Scene from={b(3) - 0.4} to={b(4) - 0.05}>
        <Excuse3 />
      </Scene>
      <Scene from={b(4) - 0.4} to={b(5) - 0.05}>
        <Excuse2 />
      </Scene>
      <Scene from={b(5) - 0.4} to={b(6)}>
        <Excuse1 />
      </Scene>
      <Scene from={b(6)} to={b(7)}>
        <Comment />
      </Scene>
      <Scene from={b(7)} to={b(8)}>
        <Abonnes />
      </Scene>
      <Scene from={b(8)} to={outro}>
        <Carte />
      </Scene>
      <Scene from={outro} to={outro + OUTRO_DUR}>
        <LocalTime at={outro}>
          <Outro />
        </LocalTime>
      </Scene>
    </AbsoluteFill>
  );
}

/** L'intro seule, à poser devant n'importe quelle vidéo. */
export function IntroOnly() {
  return (
    <>
      <Audio src={staticFile("audio/sfx-intro.wav")} volume={0.6} />
      <Scene from={0} to={INTRO_DUR}>
        <Intro />
      </Scene>
    </>
  );
}

/** La signature seule, avec sa voix. */
export function OutroOnly() {
  return (
    <>
      <Audio src={staticFile("audio/outro.wav")} volume={1.2} />
      <Audio src={staticFile("audio/sfx-outro.wav")} volume={0.6} />
      <Scene from={0} to={OUTRO_DUR}>
        <Outro />
      </Scene>
    </>
  );
}
