import { ArrowRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "text";

// Au survol, le bouton se remplit de cobalt depuis le bas : la réponse au geste, sans flèche ajoutée.
const base =
  "relative isolate inline-flex items-center overflow-hidden rounded-full font-medium transition-[color,border-color,transform] duration-500 ease-(--ease-expo) active:scale-[0.97] before:absolute before:inset-0 before:-z-10 before:translate-y-full before:rounded-full before:bg-cobalt before:transition-transform before:duration-500 before:ease-(--ease-expo) hover:before:translate-y-0";

const variants: Record<Variant, string> = {
  primary: `${base} bg-fg px-6 py-3.5 text-bg hover:text-ivory`,
  secondary: `${base} border hairline px-6 py-3.5 hover:border-cobalt hover:text-ivory`,
  text: "link-draw py-1 font-medium",
};

type ActionLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  external?: boolean;
  /** Pictogramme après le libellé. Par défaut : flèche (diagonale pour un lien externe). */
  icon?: LucideIcon;
};

export function ActionLink({ variant = "primary", className = "", children, external, icon, ...props }: ActionLinkProps) {
  const classes = `group/action ${variants[variant]} gap-2.5 ${variant === "text" ? "inline-flex items-center" : ""} ${className}`;
  const Icon = icon ?? (external ? ArrowUpRight : ArrowRight);
  // Toujours un pictogramme : jamais un bouton fait seulement de texte.
  const glyph = <Icon aria-hidden className="size-4 shrink-0 transition-transform duration-500 ease-(--ease-expo) group-hover/action:translate-x-0.5" />;
  if (external) {
    return (
      <a href={String(props.href)} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        {glyph}
        <span className="sr-only"> (nouvel onglet)</span>
      </a>
    );
  }
  return (
    <Link {...props} className={classes}>
      {children}
      {glyph}
    </Link>
  );
}
