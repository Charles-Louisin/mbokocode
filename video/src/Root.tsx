import { Composition } from "remotion";
import { IntroOnly, OutroOnly, Video } from "./Video";
import { FPS, H, INTRO_DUR, OUTRO_DUR, VIDEO_SECONDS, W } from "./theme";

export function Root() {
  return (
    <>
      <Composition id="Mboko" component={Video} durationInFrames={Math.round(VIDEO_SECONDS * FPS)} fps={30} width={W} height={H} />
      {/* Les blocs de marque, à exporter seuls pour les autres vidéos. */}
      <Composition id="MbokoIntro" component={IntroOnly} durationInFrames={Math.round(INTRO_DUR * FPS)} fps={FPS} width={W} height={H} />
      <Composition id="MbokoOutro" component={OutroOnly} durationInFrames={Math.round(OUTRO_DUR * FPS)} fps={FPS} width={W} height={H} />
    </>
  );
}
