// Monogramme « M » de MBOKO CODE, vectorisé depuis public/images/logo.jpeg.
export const LOGO_VIEWBOX = "140 410 952 428";

export const LOGO_PATHS = [
  "M148 830 L435 438 C452 418 492 410 512 435 L848 830 L692 830 C660 830 640 820 625 800 L512 672 L560 594 C540 588 512 592 495 612 L372 785 C350 815 325 830 298 830 Z",
  "M632 522 L688 438 C700 422 712 418 730 418 L798 418 C815 418 828 426 836 440 L1083 830 L970 830 C935 830 905 815 885 792 C800 700 720 605 632 522 Z",
];

export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {LOGO_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
