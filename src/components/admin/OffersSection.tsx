"use client";

import { useState } from "react";
import type { PriceType } from "@/src/lib/api/types";
import { formatPrice } from "@/src/lib/format";
import { type AdminPricing, type AdminService, useAdminData } from "./data";
import { Badge, LinesField, Panel, SaveBar, SelectField, TextArea, TextField, Toggle } from "./fields";
import { Modal } from "./Modal";
import { useSave } from "./useSave";

const PRICE_TYPES: { value: PriceType; label: string }[] = [
  { value: "from", label: "À partir de" },
  { value: "fixed", label: "Prix fixe" },
  { value: "range", label: "Fourchette" },
  { value: "quote", label: "Sur devis" },
];

// Les montants sont stockés en centimes ; on les saisit en unités (ex. 500 pour 500 €).
const toUnits = (minor?: number | null) => (minor == null ? "" : String(minor / 100));
const toMinor = (units: string) => (units.trim() === "" ? null : Math.round(Number(units.replace(",", ".")) * 100));

function OfferEditor({ offer, onSaved }: { offer: AdminPricing; onSaved: (offer: AdminPricing) => void }) {
  const initial = {
    name: offer.name,
    kicker: offer.kicker ?? "",
    description: offer.description,
    priceType: offer.priceType,
    priceMin: toUnits(offer.priceMin),
    priceMax: toUnits(offer.priceMax),
    features: offer.features,
    deliveryEstimate: offer.deliveryEstimate ?? "",
    isPublished: offer.isPublished,
  };
  const [draft, setDraft] = useState(initial);
  const { save, saving, errors } = useSave<AdminPricing>();
  const set = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    const body = { ...draft, priceMin: toMinor(draft.priceMin), priceMax: draft.priceType === "range" ? toMinor(draft.priceMax) : null };
    const saved = await save(`/admin/pricing/${offer.id}`, body, ["pricing"]);
    if (saved) onSaved(saved);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Nom" value={draft.name} onChange={(v) => set("name", v)} error={errors.name} />
        <TextField label="Étiquette" value={draft.kicker} onChange={(v) => set("kicker", v)} error={errors.kicker} />
      </div>
      <TextArea label="Description" rows={2} value={draft.description} onChange={(v) => set("description", v)} error={errors.description} />
      <div className="grid gap-5 md:grid-cols-4">
        <SelectField label="Type de prix" value={draft.priceType} onChange={(v) => set("priceType", v)} options={PRICE_TYPES} />
        {draft.priceType !== "quote" && (
          <TextField label={`Montant ${draft.priceType === "range" ? "min" : ""} (${offer.currency})`} value={draft.priceMin} onChange={(v) => set("priceMin", v)} error={errors.priceMin} />
        )}
        {draft.priceType === "range" && <TextField label={`Montant max (${offer.currency})`} value={draft.priceMax} onChange={(v) => set("priceMax", v)} error={errors.priceMax} />}
        <TextField label="Délai indicatif" hint="Repris dans le brief de contact." value={draft.deliveryEstimate} onChange={(v) => set("deliveryEstimate", v)} />
      </div>
      <LinesField label="Ce qui est inclus" value={draft.features} onChange={(v) => set("features", v)} error={errors.features} />
      <Toggle label="Publiée sur le site" checked={draft.isPublished} onChange={(v) => set("isPublished", v)} />
      <SaveBar saving={saving} dirty={JSON.stringify(draft) !== JSON.stringify(initial)} onSave={submit} />
    </div>
  );
}

function ServiceEditor({ service, onSaved }: { service: AdminService; onSaved: (service: AdminService) => void }) {
  const initial = { name: service.name, summary: service.summary, deliverables: service.deliverables, proofs: service.proofs, isPublished: service.isPublished };
  const [draft, setDraft] = useState(initial);
  const { save, saving, errors } = useSave<AdminService>();
  const set = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => setDraft((current) => ({ ...current, [key]: value }));
  return (
    <div className="space-y-5">
      <TextField label="Nom" value={draft.name} onChange={(v) => set("name", v)} error={errors.name} />
      <TextArea label="Résumé" rows={2} value={draft.summary} onChange={(v) => set("summary", v)} error={errors.summary} />
      <div className="grid gap-5 md:grid-cols-2">
        <LinesField label="Points clés" value={draft.deliverables} onChange={(v) => set("deliverables", v)} error={errors.deliverables} />
        <LinesField label="Projets qui le prouvent (slugs)" hint="ex. koumale — un par ligne." value={draft.proofs} onChange={(v) => set("proofs", v)} error={errors.proofs} />
      </div>
      <Toggle label="Publié sur le site" checked={draft.isPublished} onChange={(v) => set("isPublished", v)} />
      <SaveBar
        saving={saving}
        dirty={JSON.stringify(draft) !== JSON.stringify(initial)}
        onSave={async () => {
          const saved = await save(`/admin/services/${service.id}`, draft, ["services"]);
          if (saved) onSaved(saved);
        }}
       
      />
    </div>
  );
}

// Liste compacte ; un clic ouvre l'élément dans une fenêtre d'édition.
function EditableList<T extends { id: string; updatedAt?: string }>({
  items,
  title,
  meta,
  render,
}: {
  items: T[];
  title: (item: T) => string;
  meta: (item: T) => React.ReactNode;
  render: (item: T) => React.ReactNode;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = items.find((item) => item.id === openId) ?? null;
  return (
    <>
      <ul className="divide-y divide-line rounded-(--radius) border hairline">
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => setOpenId(item.id)} className="flex min-h-14 w-full flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-3.5 text-left hover:bg-bg-raised/40 md:px-5">
              <span className="min-w-0 flex-1 basis-40 font-medium">{title(item)}</span>
              <span className="flex flex-wrap items-center gap-2">{meta(item)}</span>
            </button>
          </li>
        ))}
      </ul>
      {open && (
        <Modal open title={title(open)} onClose={() => setOpenId(null)}>
          {render(open)}
        </Modal>
      )}
    </>
  );
}

export function PricingSection() {
  const { data, error, setData } = useAdminData<AdminPricing[]>("/pricing");
  const replace = (saved: AdminPricing) => setData((list) => list?.map((item) => (item.id === saved.id ? saved : item)) ?? list);
  return (
    <Panel title="Offres et tarifs">
      {error && <p className="text-danger">{error}</p>}
      {!data && !error && <div className="h-40 animate-pulse rounded-xl bg-bg-raised" />}
      {data && (
        <EditableList
          items={data}
          title={(offer) => offer.name}
          meta={(offer) => {
            const price = formatPrice(offer);
            return (
              <>
                <span className="text-sm text-fg-muted">{[price.prefix, price.amount].filter(Boolean).join(" ")}</span>
                <Badge tone={offer.isPublished ? "success" : "neutral"}>{offer.isPublished ? "Publiée" : "Masquée"}</Badge>
              </>
            );
          }}
          render={(offer) => <OfferEditor key={offer.updatedAt} offer={offer} onSaved={replace} />}
        />
      )}
    </Panel>
  );
}

export function ServicesSection() {
  const { data, error, setData } = useAdminData<AdminService[]>("/services");
  const replace = (saved: AdminService) => setData((list) => list?.map((item) => (item.id === saved.id ? saved : item)) ?? list);
  return (
    <Panel title="Savoir-faire">
      {error && <p className="text-danger">{error}</p>}
      {!data && !error && <div className="h-40 animate-pulse rounded-xl bg-bg-raised" />}
      {data && (
        <EditableList
          items={data}
          title={(service) => service.name}
          meta={(service) => <Badge tone={service.isPublished ? "success" : "neutral"}>{service.isPublished ? "Publié" : "Masqué"}</Badge>}
          render={(service) => <ServiceEditor key={service.updatedAt} service={service} onSaved={replace} />}
        />
      )}
    </Panel>
  );
}
