"use client";

import { ArrowDown, ArrowUp, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { SiteContent } from "@/src/lib/api/types";
import { LinesField, SaveBar, SelectField, TextArea, TextField } from "./fields";
import { useSave } from "./useSave";

// Contenu des pages en formulaires : chaque section est décrite champ par champ, sans JSON à écrire.
// Les listes s'ajoutent, se suppriment et se réordonnent ; l'API vérifie toujours la forme à l'enregistrement.

type Value = Record<string, unknown>;

type Field =
  | { key: string; label: string; kind: "text" | "textarea" | "number"; hint?: string; optional?: boolean }
  | { key: string; label: string; kind: "lines"; hint?: string; optional?: boolean }
  | { key: string; label: string; kind: "select"; options: { value: string; label: string }[]; hint?: string; optional?: boolean }
  | { key: string; label: string; kind: "list"; item: ListSpec; hint?: string };

/** Une liste d'éléments : nom d'un élément, ses champs, et la valeur d'un élément neuf. */
type ListSpec = { noun: string; titleKey: string; fields: Field[]; empty: Value };

type Section = { key: keyof SiteContent; label: string; hint: string } & ({ shape: "list"; item: ListSpec } | { shape: "object"; fields: Field[]; empty: Value });

const ICONS = [
  { value: "", label: "Aucune icône" },
  { value: "messages", label: "Bulles de discussion" },
  { value: "target", label: "Cible" },
  { value: "shield", label: "Bouclier" },
  { value: "code", label: "Code" },
  { value: "gauge", label: "Compteur de vitesse" },
  { value: "handshake", label: "Poignée de main" },
];

const titleText = (noun: string): ListSpec => ({
  noun,
  titleKey: "title",
  fields: [
    { key: "title", label: "Titre", kind: "text" },
    { key: "text", label: "Texte", kind: "textarea" },
  ],
  empty: { title: "", text: "" },
});

const tiktokAccount = (hint: string): Omit<Extract<Section, { shape: "object" }>, "key" | "label"> => ({
  hint,
  shape: "object",
  empty: { platform: "tiktok", handle: "", profileUrl: "", recordedAt: "", stats: [], videos: [] },
  fields: [
    { key: "handle", label: "Nom du compte (sans @)", kind: "text" },
    { key: "profileUrl", label: "Lien du profil", kind: "text", hint: "Par exemple https://www.tiktok.com/@mbokocode" },
    { key: "recordedAt", label: "Date du relevé des chiffres", kind: "text", hint: "Par exemple 31 octobre 2026." },
    { key: "bio", label: "Bio (facultative)", kind: "textarea", optional: true },
    {
      key: "stats",
      label: "Chiffres du compte",
      kind: "list",
      hint: "Recopiés du profil, jamais estimés.",
      item: {
        noun: "chiffre",
        titleKey: "label",
        fields: [
          { key: "label", label: "Nom", kind: "text", hint: "Abonnés, J'aime, Vidéos…" },
          { key: "value", label: "Valeur", kind: "text", hint: "Tel qu'affiché : 34, 99,1 K…" },
        ],
        empty: { label: "", value: "" },
      },
    },
    {
      key: "videos",
      label: "Vidéos affichées",
      kind: "list",
      item: {
        noun: "vidéo",
        titleKey: "caption",
        fields: [
          { key: "url", label: "Lien de la vidéo TikTok", kind: "text" },
          { key: "caption", label: "Légende", kind: "text" },
          { key: "views", label: "Vues (facultatif)", kind: "text", optional: true, hint: "Tel qu'affiché sur TikTok." },
          { key: "cover", label: "Miniature (facultative)", kind: "text", optional: true, hint: "Adresse d'image : /images/… ou https://…" },
        ],
        empty: { url: "", caption: "" },
      },
    },
  ],
});

export const SECTIONS: Section[] = [
  {
    key: "journey",
    label: "Parcours",
    hint: "Page À propos.",
    shape: "list",
    item: {
      noun: "étape",
      titleKey: "title",
      fields: [
        {
          key: "kind",
          label: "Type",
          kind: "select",
          options: [
            { value: "venture", label: "Entreprise ou projet" },
            { value: "work", label: "Emploi" },
            { value: "school", label: "Formation" },
          ],
        },
        { key: "period", label: "Période", kind: "text", hint: "Par exemple 2023 – 2024, ou Aujourd'hui." },
        { key: "title", label: "Titre", kind: "text" },
        { key: "place", label: "Lieu ou structure", kind: "text" },
        { key: "text", label: "Description", kind: "textarea" },
        { key: "points", label: "Points clés (facultatifs)", kind: "lines", optional: true },
      ],
      empty: { kind: "work", period: "", title: "", place: "", text: "" },
    },
  },
  {
    key: "skillGroups",
    label: "Compétences",
    hint: "Page À propos, avec les logos des outils connus.",
    shape: "list",
    item: {
      noun: "groupe",
      titleKey: "title",
      fields: [
        { key: "title", label: "Nom du groupe", kind: "text" },
        { key: "skills", label: "Compétences", kind: "lines" },
      ],
      empty: { title: "", skills: [] },
    },
  },
  {
    key: "languages",
    label: "Langues",
    hint: "Page À propos.",
    shape: "list",
    item: {
      noun: "langue",
      titleKey: "name",
      fields: [
        { key: "name", label: "Langue", kind: "text" },
        { key: "level", label: "Niveau", kind: "text" },
      ],
      empty: { name: "", level: "" },
    },
  },
  {
    key: "principles",
    label: "Façon de travailler",
    hint: "Page À propos.",
    shape: "list",
    item: {
      noun: "principe",
      titleKey: "title",
      fields: [
        { key: "icon", label: "Icône", kind: "select", options: ICONS, optional: true },
        { key: "title", label: "Titre", kind: "text" },
        { key: "text", label: "Texte", kind: "textarea" },
      ],
      empty: { title: "", text: "" },
    },
  },
  {
    key: "values",
    label: "Valeurs",
    hint: "Page À propos.",
    shape: "list",
    item: {
      noun: "valeur",
      titleKey: "label",
      fields: [
        { key: "icon", label: "Icône", kind: "select", options: ICONS, optional: true },
        { key: "label", label: "Valeur", kind: "text" },
      ],
      empty: { label: "" },
    },
  },
  { key: "method", label: "Méthode", hint: "Accueil et page Services.", shape: "list", item: titleText("étape") },
  { key: "afterDelivery", label: "Après la livraison", hint: "Pages Services et Tarifs.", shape: "list", item: titleText("engagement") },
  {
    key: "licenceVsCustom",
    label: "Licence ou sur mesure",
    hint: "Tableau comparatif de la page Tarifs.",
    shape: "list",
    item: {
      noun: "critère",
      titleKey: "criterion",
      fields: [
        { key: "criterion", label: "Critère", kind: "text" },
        { key: "licence", label: "Avec une licence", kind: "text" },
        { key: "custom", label: "En sur mesure", kind: "text" },
      ],
      empty: { criterion: "", licence: "", custom: "" },
    },
  },
  {
    key: "places",
    label: "Lieux des projets",
    hint: "Carte de l'accueil. Les coordonnées se trouvent sur Google Maps (clic droit sur le lieu).",
    shape: "list",
    item: {
      noun: "lieu",
      titleKey: "label",
      fields: [
        { key: "label", label: "Nom du lieu", kind: "text" },
        { key: "lat", label: "Latitude", kind: "number", hint: "Par exemple 3.848" },
        { key: "lng", label: "Longitude", kind: "number", hint: "Par exemple 11.502" },
      ],
      empty: { label: "", lat: "", lng: "" },
    },
  },
  { key: "creator", label: "TikTok personnel", ...tiktokAccount("Compte perso (humour, apprentissage du dev).") },
  { key: "businessCreator", label: "TikTok entreprise", ...tiktokAccount("Compte entreprise @mbokocode.") },
];

/** Prépare l'envoi : champs facultatifs vides retirés, nombres convertis. */
function clean(fields: Field[], value: Value): Value {
  const out: Value = { ...value };
  for (const field of fields) {
    const current = out[field.key];
    if (field.kind === "list") out[field.key] = ((current as Value[]) ?? []).map((item) => clean(field.item.fields, item));
    else if (field.kind === "number") out[field.key] = current === "" || current === undefined ? current : Number(String(current).replace(",", "."));
    else if (field.kind === "lines") {
      if (field.optional && !(current as string[] | undefined)?.length) delete out[field.key];
    } else if (typeof current === "string") {
      out[field.key] = current.trim();
      if (field.optional && !current.trim()) delete out[field.key];
    }
  }
  return out;
}

function FieldInput({ field, value, onChange }: { field: Field; value: Value; onChange: (next: Value) => void }) {
  const set = (next: unknown) => onChange({ ...value, [field.key]: next });
  const current = value[field.key];
  switch (field.kind) {
    case "text":
      return <TextField label={field.label} hint={field.hint} value={String(current ?? "")} onChange={set} />;
    case "number":
      return <TextField label={field.label} hint={field.hint} type="text" value={String(current ?? "")} onChange={set} />;
    case "textarea":
      return <TextArea label={field.label} hint={field.hint} rows={3} value={String(current ?? "")} onChange={set} />;
    case "lines":
      return <LinesField label={field.label} hint={field.hint} value={(current as string[] | undefined) ?? []} onChange={set} />;
    case "select":
      return <SelectField label={field.label} hint={field.hint} options={field.options} value={String(current ?? "")} onChange={set} />;
    case "list":
      return <ListInput label={field.label} hint={field.hint} spec={field.item} items={(current as Value[] | undefined) ?? []} onChange={set} nested />;
  }
}

function FieldGrid({ fields, value, onChange }: { fields: Field[]; value: Value; onChange: (next: Value) => void }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {fields.map((field) => (
        <div key={field.key} className={field.kind === "textarea" || field.kind === "lines" || field.kind === "list" ? "md:col-span-2" : undefined}>
          <FieldInput field={field} value={value} onChange={onChange} />
        </div>
      ))}
    </div>
  );
}

const iconButton = "flex size-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-raised hover:text-fg disabled:pointer-events-none disabled:opacity-30";

function ListInput({ label, hint, spec, items, onChange, nested = false }: { label: string; hint?: string; spec: ListSpec; items: Value[]; onChange: (items: Value[]) => void; nested?: boolean }) {
  // Les éléments existants sont repliés pour garder la page courte ; un élément ajouté s'ouvre.
  const [opened, setOpened] = useState<Set<number>>(new Set());
  const toggle = (index: number, open: boolean) =>
    setOpened((set) => {
      const next = new Set(set);
      if (open) next.add(index);
      else next.delete(index);
      return next;
    });
  const update = (index: number, item: Value) => onChange(items.map((current, i) => (i === index ? item : current)));
  const move = (index: number, by: -1 | 1) => {
    const next = [...items];
    [next[index], next[index + by]] = [next[index + by], next[index]];
    onChange(next);
    setOpened(new Set());
  };
  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    setOpened(new Set());
  };
  const add = () => {
    onChange([...items, { ...spec.empty }]);
    toggle(items.length, true);
  };

  return (
    <fieldset className={`min-w-0 ${nested ? "rounded-xl border hairline p-4" : ""}`}>
      <legend className={nested ? "label px-1 text-fg-subtle" : "sr-only"}>{label}</legend>
      {hint && <p className="mb-3 text-sm text-fg-subtle">{hint}</p>}
      <ol className="space-y-2">
        {items.map((item, index) => {
          const title = String(item[spec.titleKey] ?? "").trim() || "(sans titre)";
          const open = opened.has(index);
          return (
            <li key={index} className="rounded-xl border hairline bg-bg">
              <div className="flex items-center gap-1 pr-1">
                <button type="button" aria-expanded={open} onClick={() => toggle(index, !open)} className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-xl pl-3 text-left">
                  <ChevronRight aria-hidden className={`size-4 shrink-0 text-fg-subtle transition-transform ${open ? "rotate-90" : ""}`} />
                  <span className="min-w-0 flex-1 truncate font-medium">
                    <span className="mr-2 text-fg-subtle tabular-nums">{index + 1}.</span>
                    {title}
                  </span>
                </button>
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Monter : ${title}`} className={iconButton}>
                  <ArrowUp aria-hidden className="size-4" />
                </button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label={`Descendre : ${title}`} className={iconButton}>
                  <ArrowDown aria-hidden className="size-4" />
                </button>
                <button type="button" onClick={() => remove(index)} aria-label={`Supprimer : ${title}`} className={`${iconButton} hover:text-danger`}>
                  <Trash2 aria-hidden className="size-4" />
                </button>
              </div>
              {open && (
                <div className="border-t hairline p-4">
                  <FieldGrid fields={spec.fields} value={item} onChange={(next) => update(index, next)} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {items.length === 0 && <p className="text-sm text-fg-subtle">Aucun élément pour l&apos;instant.</p>}
      <button type="button" onClick={add} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border hairline px-4 text-sm font-medium hover:border-fg">
        <Plus aria-hidden className="size-4" />
        Ajouter : {spec.noun}
      </button>
    </fieldset>
  );
}

export function ContentSectionEditor({ content, section }: { content: SiteContent; section: Section }) {
  const initial = (content[section.key] ?? (section.shape === "object" ? section.empty : [])) as Value | Value[];
  const [value, setValue] = useState(initial);
  const [baseline, setBaseline] = useState(JSON.stringify(initial));
  const { save, saving, errors } = useSave<SiteContent>();

  const submit = async () => {
    const payload = section.shape === "list" ? (value as Value[]).map((item) => clean(section.item.fields, item)) : clean(section.fields, value as Value);
    const saved = await save("/admin/content", { [section.key]: payload }, ["content"]);
    if (saved) setBaseline(JSON.stringify(value));
  };

  const error = errors[section.key];
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">{section.label}</h3>
        <p className="mt-1 text-sm text-fg-subtle">{section.hint}</p>
      </div>
      {section.shape === "list" ? (
        <ListInput label={section.label} spec={section.item} items={value as Value[]} onChange={setValue} />
      ) : (
        <FieldGrid fields={section.fields} value={value as Value} onChange={setValue} />
      )}
      {error && (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {error} Vérifie que chaque champ obligatoire est rempli et que les liens commencent par https://.
        </p>
      )}
      <SaveBar saving={saving} dirty={JSON.stringify(value) !== baseline} onSave={submit} />
    </div>
  );
}
