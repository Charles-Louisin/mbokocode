"use client";

import { CreditCard, Database, MessageCircle, Monitor, Server, Smartphone } from "lucide-react";
import { type ReactNode, useRef } from "react";
import { AnimatedBeam } from "@/src/components/magic/AnimatedBeam";

// Schéma vivant d'une plateforme type : les interfaces parlent à l'API, qui orchestre la base
// et les services externes. Les faisceaux (Animated Beam, Magic UI) montrent le trajet des données.

function Node({ nodeRef, icon, label, accent = false }: { nodeRef: React.RefObject<HTMLDivElement | null>; icon: ReactNode; label: string; accent?: boolean }) {
  return (
    <div className="relative z-10 flex flex-col items-center gap-2">
      <div
        ref={nodeRef}
        className={`flex items-center justify-center rounded-2xl border shadow-lg ${
          accent ? "size-16 border-cobalt bg-cobalt text-ivory md:size-20" : "size-12 border-line bg-ink md:size-14"
        }`}
      >
        {icon}
      </div>
      <span className="text-xs text-fg-muted md:text-sm">{label}</span>
    </div>
  );
}

export function ArchitectureBeam() {
  const container = useRef<HTMLDivElement>(null);
  const mobile = useRef<HTMLDivElement>(null);
  const web = useRef<HTMLDivElement>(null);
  const api = useRef<HTMLDivElement>(null);
  const db = useRef<HTMLDivElement>(null);
  const pay = useRef<HTMLDivElement>(null);
  const chat = useRef<HTMLDivElement>(null);
  const icon = "size-5 md:size-6";

  return (
    <div ref={container} className="relative flex w-full items-center justify-between gap-4 py-6">
      <div className="flex flex-col gap-10">
        <Node nodeRef={mobile} icon={<Smartphone className={icon} />} label="Application" />
        <Node nodeRef={web} icon={<Monitor className={icon} />} label="Interface web" />
      </div>
      <Node nodeRef={api} icon={<Server className="size-7 md:size-8" />} label="API" accent />
      <div className="flex flex-col gap-6">
        <Node nodeRef={db} icon={<Database className={icon} />} label="Données" />
        <Node nodeRef={pay} icon={<CreditCard className={icon} />} label="Paiement" />
        <Node nodeRef={chat} icon={<MessageCircle className={icon} />} label="WhatsApp" />
      </div>

      <AnimatedBeam containerRef={container} fromRef={mobile} toRef={api} curvature={-40} />
      <AnimatedBeam containerRef={container} fromRef={web} toRef={api} curvature={40} delay={0.6} />
      <AnimatedBeam containerRef={container} fromRef={api} toRef={db} curvature={-40} delay={1.2} />
      <AnimatedBeam containerRef={container} fromRef={api} toRef={pay} delay={1.6} />
      <AnimatedBeam containerRef={container} fromRef={api} toRef={chat} curvature={40} delay={2} />
    </div>
  );
}
