"use client";

import { useState } from "react";
import type { SiteContent } from "@/src/lib/api/types";
import { type AdminContent, type AdminSettings, useAdminData } from "./data";
import { Panel, SaveBar, TextArea, TextField, Toggle } from "./fields";
import { useSave } from "./useSave";

function SettingsForm({ settings }: { settings: AdminSettings }) {
  const initial = {
    role: settings.role ?? "",
    tagline: settings.tagline ?? "",
    location: settings.location ?? "",
    email: settings.email ?? "",
    whatsappNumber: settings.whatsappNumber ?? "",
    cvUrl: settings.cvUrl ?? "",
    socials: settings.socials.map((social) => `${social.label} | ${social.url}`).join("\n"),
    isAvailable: settings.availability.isAvailable,
    availabilityLabel: settings.availability.label ?? "",
  };
  const [draft, setDraft] = useState(initial);
  const [baseline, setBaseline] = useState(initial);
  const { save, saving, errors } = useSave<AdminSettings>();
  const set = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    const socials = draft.socials
      .split("\n")
      .map((line) => line.split("|").map((part) => part.trim()))
      .filter(([label, url]) => label && url)
      .map(([label, url]) => ({ label, url }));
    const saved = await save(
      "/admin/settings",
      {
        role: draft.role,
        tagline: draft.tagline,
        location: draft.location,
        email: draft.email,
        whatsappNumber: draft.whatsappNumber,
        cvUrl: draft.cvUrl,
        socials,
        availability: { isAvailable: draft.isAvailable, ...(draft.availabilityLabel ? { label: draft.availabilityLabel } : {}) },
      },
      ["settings"],
    );
    if (saved) setBaseline(draft);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Numéro WhatsApp" hint="Format international, ex. 237693460259." value={draft.whatsappNumber} onChange={(v) => set("whatsappNumber", v)} error={errors.whatsappNumber} />
        <TextField label="E-mail de contact" type="email" value={draft.email} onChange={(v) => set("email", v)} error={errors.email} />
        <TextField label="Métier affiché" value={draft.role} onChange={(v) => set("role", v)} error={errors.role} />
        <TextField label="Ville" value={draft.location} onChange={(v) => set("location", v)} error={errors.location} />
      </div>
      <TextArea label="Phrase de présentation" rows={2} value={draft.tagline} onChange={(v) => set("tagline", v)} error={errors.tagline} />
      <TextArea label="Réseaux" hint="Une ligne par réseau : Nom | https://…" rows={3} value={draft.socials} onChange={(v) => set("socials", v)} error={errors.socials} />
      <TextField label="Lien du CV (facultatif)" value={draft.cvUrl} onChange={(v) => set("cvUrl", v)} error={errors.cvUrl} />
      <div className="grid gap-5 md:grid-cols-2 md:items-end">
        <Toggle label="Disponible pour de nouveaux projets" hint="Affiché seulement si tu le tiens à jour." checked={draft.isAvailable} onChange={(v) => set("isAvailable", v)} />
        <TextField label="Précision (facultative)" value={draft.availabilityLabel} onChange={(v) => set("availabilityLabel", v)} />
      </div>
      <SaveBar saving={saving} dirty={JSON.stringify(draft) !== JSON.stringify(baseline)} onSave={submit} />
    </div>
  );
}

export function SettingsSection() {
  const { data, error } = useAdminData<AdminSettings>("/settings");
  return (
    <Panel title="Réglages du site">
      {error && <p className="text-danger">{error}</p>}
      {!data && !error && <div className="h-40 animate-pulse rounded-xl bg-bg-raised" />}
      {data && <SettingsForm settings={data} />}
    </Panel>
  );
}

const SECTIONS: { key: keyof SiteContent; label: string; hint: string }[] = [
  { key: "journey", label: "Parcours", hint: "Page À propos. kind : venture, work ou school." },
  { key: "skillGroups", label: "Compétences", hint: "Page À propos, avec les logos des outils connus." },
  { key: "languages", label: "Langues", hint: "Page À propos." },
  { key: "principles", label: "Façon de travailler", hint: "icon : messages, target, shield, code, gauge ou handshake." },
  { key: "values", label: "Valeurs", hint: "Page À propos." },
  { key: "method", label: "Méthode", hint: "Accueil et page Services." },
  { key: "afterDelivery", label: "Après la livraison", hint: "Pages Services et Tarifs." },
  { key: "licenceVsCustom", label: "Licence ou sur mesure", hint: "Page Tarifs." },
  { key: "places", label: "Lieux des projets", hint: "Carte de l'accueil (latitude, longitude)." },
  { key: "creator", label: "TikTok personnel", hint: "Compte perso (humour, apprentissage du dev) : chiffres (avec leur date de relevé) et vidéos. cover = adresse d'une miniature (facultatif)." },
  { key: "businessCreator", label: "TikTok entreprise", hint: "Compte @mbokocode : chiffres (avec leur date de relevé) et vidéos. cover = adresse d'une miniature (facultatif)." },
];

// Chaque section du contenu s'édite en JSON : l'API vérifie sa forme avant d'enregistrer.
function ContentSectionEditor({ content, section }: { content: AdminContent; section: (typeof SECTIONS)[number] }) {
  const initial = JSON.stringify(content[section.key], null, 2);
  const [text, setText] = useState(initial);
  const [baseline, setBaseline] = useState(initial);
  const [parseError, setParseError] = useState<string | null>(null);
  const { save, saving, errors } = useSave<AdminContent>();

  const submit = async () => {
    let value: unknown;
    try {
      value = JSON.parse(text);
    } catch {
      setParseError("JSON invalide : vérifie les guillemets, virgules et crochets.");
      return;
    }
    setParseError(null);
    const saved = await save("/admin/content", { [section.key]: value }, ["content"]);
    if (saved) setBaseline(text);
  };

  return (
    <div className="space-y-4">
      <TextArea mono label={section.label} hint={section.hint} rows={Math.min(22, text.split("\n").length + 1)} value={text} onChange={setText} error={parseError ?? errors[section.key]} />
      <SaveBar saving={saving} dirty={text !== baseline} onSave={submit} />
    </div>
  );
}

export function ContentSection() {
  const { data, error } = useAdminData<AdminContent>("/content");
  const [active, setActive] = useState<(typeof SECTIONS)[number]["key"]>("journey");
  const section = SECTIONS.find((item) => item.key === active)!;
  return (
    <Panel title="Contenu des pages">
      {error && <p className="text-danger">{error}</p>}
      {!data && !error && <div className="h-40 animate-pulse rounded-xl bg-bg-raised" />}
      {data && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[14rem_1fr]">
          <div role="group" aria-label="Section" className="flex flex-wrap gap-1.5 lg:flex-col">
            {SECTIONS.map((item) => (
              <button
                key={item.key}
                type="button"
                aria-pressed={active === item.key}
                onClick={() => setActive(item.key)}
                className="min-h-10 rounded-xl px-3.5 text-left text-sm hover:bg-bg-raised aria-pressed:bg-cobalt/15 aria-pressed:text-fg"
              >
                {item.label}
              </button>
            ))}
          </div>
          <ContentSectionEditor key={active} content={data} section={section} />
        </div>
      )}
    </Panel>
  );
}
