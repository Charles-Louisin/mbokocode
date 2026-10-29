import type { CSSProperties } from "react";
import { LOGO_PATHS, LOGO_VIEWBOX } from "@/src/components/brand/LogoMark";

// Séquence d'entrée du site, jouée une fois par session. Phase « play » : le monogramme se dessine
// puis se remplit, « MBOKO CODE » monte lettre par lettre, le compteur atteint 100 % ; elle tient
// tant que la page charge (1,4 s minimum, 4,5 s maximum). Phase « reveal » : deux rideaux — nuit,
// puis cobalt — se lèvent et les ouvertures de page démarrent. Le script décide seulement des
// phases ; tout le rendu est en CSS (globals.css, « Entrée du site »). Sans JavaScript ou avec les
// animations réduites, rien ne s'affiche. Un clic ou Échap passe directement à la page.

const WORD = "MBOKO CODE";

export const introScript = `try{var d=document.documentElement;if(!sessionStorage.getItem("mboko-intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){sessionStorage.setItem("mboko-intro","1");d.dataset.intro="play";var t0=Date.now(),st=function(v){if(d.dataset.intro!=="done")d.dataset.intro=v},end=function(){st("done")},reveal=function(){if(d.dataset.intro!=="play")return;setTimeout(function(){st("reveal");setTimeout(end,1000)},Math.max(0,1400-(Date.now()-t0)))};if(document.readyState==="complete")reveal();else addEventListener("load",reveal);setTimeout(reveal,4500);addEventListener("click",function(e){if(e.target&&e.target.closest&&e.target.closest(".site-intro"))end()});addEventListener("keydown",function(e){if(e.key==="Escape")end()})}}catch(e){}`;

export function SiteIntro() {
  return (
    <div className="site-intro" aria-hidden>
      <div className="site-intro__panel site-intro__panel--cobalt" />
      <div className="site-intro__panel site-intro__panel--night">
        <div className="site-intro__center">
          <svg viewBox={LOGO_VIEWBOX} className="site-intro__logo">
            {LOGO_PATHS.map((d) => (
              <path key={d} d={d} pathLength={1} />
            ))}
          </svg>
          <p className="site-intro__word">
            {WORD.split("").map((letter, index) => (
              <span key={index} style={{ "--i": index } as CSSProperties}>
                {letter === " " ? " " : letter}
              </span>
            ))}
          </p>
          <div className="site-intro__meta">
            <span>Charles Louisin Yimbne</span>
            <span className="site-intro__counter" />
          </div>
          <div className="site-intro__bar" />
        </div>
      </div>
    </div>
  );
}
