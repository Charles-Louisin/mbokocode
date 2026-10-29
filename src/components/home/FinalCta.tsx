import Link from "next/link";
import { LogoMark } from "@/src/components/brand/LogoMark";
import { primaryCta } from "@/src/lib/site";

// Dernier appel : une phrase géante, soulignée au survol, puis les autres canaux.
export function FinalCta({ title = "Parlons de ton projet." }: { title?: string }) {
  return (
    <section aria-labelledby="final-cta-title" className="grain relative isolate overflow-hidden bg-cobalt py-24 text-ivory md:py-36">
      <LogoMark className="pointer-events-none absolute -bottom-[10%] -right-[5%] -z-10 w-[60vw] text-ivory/10" />
      <div className="shell">
        <h2 id="final-cta-title">
          <Link
            href={primaryCta.href}
            className="group block text-mega font-semibold"
          >
            <span className="mask-line" style={{ "--line-index": 0 } as React.CSSProperties}>
              <span className="transition-transform duration-700 ease-(--ease-expo) group-hover:translate-x-[1.5vw]">
                {title}
              </span>
            </span>
          </Link>
        </h2>
        <p className="mt-10 max-w-xl text-lead text-ivory">
          Un brief détaillé ou un simple message, sur WhatsApp ou par e-mail : je réponds personnellement.
        </p>
      </div>
    </section>
  );
}
