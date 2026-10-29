import { Circle, Code2, Gauge, Handshake, type LucideIcon, MessagesSquare, ShieldCheck, Target } from "lucide-react";
import type { IconKey } from "@/src/lib/api/types";

// Pictogrammes nommés dans le contenu MongoDB : seules ces clés sont reconnues.
const ICONS: Record<IconKey, LucideIcon> = {
  messages: MessagesSquare,
  target: Target,
  shield: ShieldCheck,
  code: Code2,
  gauge: Gauge,
  handshake: Handshake,
};

export function ContentIcon({ name, className }: { name?: IconKey; className?: string }) {
  const Icon = (name && ICONS[name]) || Circle;
  return <Icon aria-hidden className={className} />;
}
