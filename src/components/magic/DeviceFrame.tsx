import Image from "next/image";
import type { Media } from "@/src/lib/api/types";
import { cn } from "@/src/lib/cn";

// Maquettes d'appareils adaptées de Magic UI « iPhone » et « Safari »
// (https://magicui.design/docs/components/iphone, /safari, MIT) : mêmes proportions d'écran,
// cadres recolorés aux teintes du site et images servies par next/image.

const PHONE = { w: 433, h: 882, x: 21.25, y: 19.25, sw: 389.5, sh: 843.5, r: 55.75 };
const BROWSER = { w: 1203, h: 753, bar: 52 };

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

export function PhoneFrame({ image, sizes, priority, className }: { image: Media; sizes: string; priority?: boolean; className?: string }) {
  return (
    <div className={cn("relative", className)} style={{ aspectRatio: `${PHONE.w} / ${PHONE.h}` }}>
      <div
        className="absolute overflow-hidden bg-ink"
        style={{
          left: pct(PHONE.x, PHONE.w),
          top: pct(PHONE.y, PHONE.h),
          width: pct(PHONE.sw, PHONE.w),
          height: pct(PHONE.sh, PHONE.h),
          borderRadius: `${(PHONE.r / PHONE.sw) * 100}% / ${(PHONE.r / PHONE.sh) * 100}%`,
        }}
      >
        <Image src={image.url} alt={image.alt} fill priority={priority} sizes={sizes} className="object-cover object-top" />
      </div>
      <svg viewBox={`0 0 ${PHONE.w} ${PHONE.h}`} aria-hidden className="absolute inset-0 size-full">
        <defs>
          <mask id="phone-screen" maskUnits="userSpaceOnUse">
            <rect width={PHONE.w} height={PHONE.h} fill="white" />
            <rect x={PHONE.x} y={PHONE.y} width={PHONE.sw} height={PHONE.sh} rx={PHONE.r} fill="black" />
          </mask>
        </defs>
        <g mask="url(#phone-screen)">
          <path
            d="M2 73C2 32.68 34.68 0 75 0H357C397.32 0 430 32.68 430 73V809C430 849.32 397.32 882 357 882H75C34.68 882 2 849.32 2 809V73Z"
            className="fill-ink-3"
          />
          <path
            d="M6 74C6 35.34 37.34 4 76 4H356C394.66 4 426 35.34 426 74V808C426 846.66 394.66 878 356 878H76C37.34 878 6 846.66 6 808V74Z"
            className="fill-ink-2"
          />
        </g>
        <path d="M154 48.5C154 38.28 162.28 30 172.5 30H259.5C269.72 30 278 38.28 278 48.5C278 58.72 269.72 67 259.5 67H172.5C162.28 67 154 58.72 154 48.5Z" className="fill-ink" />
      </svg>
    </div>
  );
}

export function BrowserFrame({ image, url, sizes, priority, className }: { image: Media; url?: string; sizes: string; priority?: boolean; className?: string }) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-[1.1%/1.8%] border border-ivory/10 bg-ink-2 shadow-2xl", className)}
      style={{ aspectRatio: `${BROWSER.w} / ${BROWSER.h}` }}
    >
      <div className="absolute inset-x-0 top-0 flex items-center gap-[1%] px-[2%]" style={{ height: pct(BROWSER.bar, BROWSER.h) }}>
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="aspect-square w-[1%] rounded-full bg-ivory/15" />
        ))}
        <span aria-hidden className="mx-auto flex h-[58%] w-[55%] items-center justify-center rounded-md bg-ivory/[0.07] text-[clamp(0.6rem,0.9vw,0.8rem)] text-fg-muted">
          {url}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0" style={{ top: pct(BROWSER.bar, BROWSER.h) }}>
        <Image src={image.url} alt={image.alt} fill priority={priority} sizes={sizes} className="object-cover object-top" />
      </div>
    </div>
  );
}

/** Choisit la maquette d'après le format de la capture : verticale → téléphone, sinon navigateur. */
export function DeviceFrame({ image, url, sizes, priority, className }: { image: Media; url?: string; sizes: string; priority?: boolean; className?: string }) {
  const tall = (image.height ?? 1) > (image.width ?? 1);
  return tall ? (
    <PhoneFrame image={image} sizes={sizes} priority={priority} className={className} />
  ) : (
    <BrowserFrame image={image} url={url} sizes={sizes} priority={priority} className={className} />
  );
}

export function hostOf(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}
