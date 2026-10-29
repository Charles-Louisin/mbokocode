"use client";

import { Check, ExternalLink, ImageOff, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { useFeedback } from "@/src/components/ui/Feedback";
import { useState } from "react";
import { ApiError, apiFetch } from "@/src/lib/api/client";
import type { ProjectCategory, ProjectStatus } from "@/src/lib/api/types";
import { refreshPublicCache } from "@/src/lib/admin-actions";
import { categoryLabels, statusLabels } from "@/src/lib/format";
import { type AdminProject, useAdminData } from "./data";
import { Badge, LinesField, Panel, SelectField, TextArea, TextField, Toggle } from "./fields";
import { type AdminMedia, ImageManager } from "./ImageManager";
import { Modal } from "./Modal";
import { useSave } from "./useSave";

type Visibility = AdminProject["visibility"];
const VISIBILITY: { value: Visibility; label: string }[] = [
  { value: "public", label: "Public (listé)" },
  { value: "unlisted", label: "Non listé (lien direct)" },
  { value: "private", label: "Privé" },
];
const VISIBILITY_BADGE = { public: "success", unlisted: "accent", private: "neutral" } as const;
const STATUS_OPTIONS = (Object.keys(statusLabels) as ProjectStatus[]).map((value) => ({ value, label: statusLabels[value] }));
const CATEGORY_OPTIONS = (Object.keys(categoryLabels) as ProjectCategory[]).map((value) => ({ value, label: categoryLabels[value] }));

type Draft = {
  title: string;
  kicker: string;
  shortDescription: string;
  category: ProjectCategory;
  status: ProjectStatus;
  visibility: Visibility;
  technologies: string[];
  liveUrl: string;
  repositoryUrl: string;
  isFeatured: boolean;
  licenseAvailable: boolean;
  sortOrder: number;
  coverImage: AdminMedia | null;
  gallery: AdminMedia[];
};

const toDraft = (project: AdminProject): Draft => ({
  title: project.title,
  kicker: project.kicker ?? "",
  shortDescription: project.shortDescription,
  category: project.category,
  status: project.status,
  visibility: project.visibility,
  technologies: project.technologies,
  liveUrl: project.liveUrl ?? "",
  repositoryUrl: project.repositoryUrl ?? "",
  isFeatured: project.isFeatured,
  licenseAvailable: project.licenseAvailable ?? false,
  sortOrder: project.sortOrder ?? 100,
  coverImage: (project.coverImage as AdminMedia | undefined) ?? null,
  gallery: (project.gallery as AdminMedia[] | undefined) ?? [],
});

const footerButton = "min-h-11 rounded-full px-6 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";

// Édition d'un projet dans une fenêtre : textes, liens, visibilité, images (avec envoi), suppression.
function ProjectModal({ project, onClose, onSaved, onDeleted }: { project: AdminProject; onClose: () => void; onSaved: (p: AdminProject) => void; onDeleted: (id: string) => void }) {
  const [initial, setInitial] = useState(() => toDraft(project));
  const [draft, setDraft] = useState(initial);
  const [deleting, setDeleting] = useState(false);
  const { toast, confirm } = useFeedback();
  const { save, saving, errors } = useSave<AdminProject>();
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  const submit = async () => {
    const saved = await save(`/admin/projects/${project.id}`, draft, ["projects", `project-${project.slug}`]);
    if (saved) {
      onSaved(saved);
      setInitial(toDraft(saved));
      setDraft(toDraft(saved));
    }
  };

  const remove = async () => {
    const ok = await confirm({
      title: `Supprimer « ${project.title} » ?`,
      message: "Le projet et ses images sont supprimés définitivement. Pour seulement le retirer du site, passe-le en « Privé ».",
      confirmLabel: "Supprimer",
      danger: true,
    });
    if (!ok) return;
    setDeleting(true);
    try {
      await apiFetch(`/admin/projects/${project.id}`, { method: "DELETE" });
      await refreshPublicCache(["projects", `project-${project.slug}`]).catch(() => false);
      toast("success", `« ${project.title} » a été supprimé.`);
      onDeleted(project.id);
    } catch (err) {
      toast("error", err instanceof ApiError ? err.message : "Suppression impossible.");
      setDeleting(false);
    }
  };

  const close = async () => {
    if (dirty && !(await confirm({ title: "Fermer sans enregistrer ?", message: "Tes modifications seront perdues.", confirmLabel: "Fermer sans enregistrer", danger: true }))) return;
    onClose();
  };

  return (
    <Modal
      open
      title={project.title}
      onClose={close}
      footer={
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={remove}
            disabled={deleting}
            className={`${footerButton} inline-flex items-center gap-2 border border-danger/50 text-danger`}
          >
            {deleting ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Trash2 aria-hidden className="size-4" />}
            <span className="max-sm:sr-only">Supprimer</span>
          </button>
          <div className="ml-auto flex gap-3">
            <button type="button" onClick={close} className={`${footerButton} inline-flex items-center gap-2 border hairline`}>
              <X aria-hidden className="size-4" />
              Fermer
            </button>
            <button type="button" onClick={submit} disabled={saving || !dirty} className={`${footerButton} inline-flex items-center gap-2 bg-fg text-bg hover:bg-cobalt hover:text-ivory`}>
              {saving ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Save aria-hidden className="size-4" />}
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        <section aria-label="Images" className="space-y-3">
          <h3 className="label text-fg-subtle">Images</h3>
          <ImageManager
            cover={draft.coverImage}
            gallery={draft.gallery}
            defaultAlt={draft.title}
            onChange={({ cover, gallery }) => setDraft((current) => ({ ...current, coverImage: cover, gallery }))}
          />
          {(errors.coverImage || errors.gallery) && <p className="text-sm text-danger">{errors.coverImage ?? errors.gallery}</p>}
        </section>

        <section aria-label="Présentation" className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <TextField label="Titre" value={draft.title} onChange={(v) => set("title", v)} error={errors.title} />
            <TextField label="Accroche courte" value={draft.kicker} onChange={(v) => set("kicker", v)} error={errors.kicker} />
          </div>
          <TextArea label="Description courte" rows={3} value={draft.shortDescription} onChange={(v) => set("shortDescription", v)} error={errors.shortDescription} />
          <div className="grid gap-5 sm:grid-cols-3">
            <SelectField label="Catégorie" value={draft.category} onChange={(v) => set("category", v)} options={CATEGORY_OPTIONS} />
            <SelectField label="Statut" value={draft.status} onChange={(v) => set("status", v)} options={STATUS_OPTIONS} />
            <SelectField label="Visibilité" value={draft.visibility} onChange={(v) => set("visibility", v)} options={VISIBILITY} />
          </div>
        </section>

        <section aria-label="Liens et réglages" className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <TextField label="Lien de démo / site en ligne" hint="Laisse vide s'il n'y en a pas." value={draft.liveUrl} onChange={(v) => set("liveUrl", v)} error={errors.liveUrl} />
            <TextField label="Dépôt de code" value={draft.repositoryUrl} onChange={(v) => set("repositoryUrl", v)} error={errors.repositoryUrl} />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <LinesField label="Technologies" value={draft.technologies} onChange={(v) => set("technologies", v)} error={errors.technologies} />
            <div className="space-y-4">
              <TextField label="Ordre d'affichage" type="number" value={String(draft.sortOrder)} onChange={(v) => set("sortOrder", Number(v) || 0)} error={errors.sortOrder} />
              <Toggle label="Mis en avant sur l'accueil" checked={draft.isFeatured} onChange={(v) => set("isFeatured", v)} />
              <Toggle label="Disponible en licence" checked={draft.licenseAvailable} onChange={(v) => set("licenseAvailable", v)} />
            </div>
          </div>
        </section>
      </div>
    </Modal>
  );
}

function NewProjectModal({ onClose, onCreated }: { onClose: () => void; onCreated: (project: AdminProject) => void }) {
  const [draft, setDraft] = useState({ title: "", slug: "", shortDescription: "", category: "web" as ProjectCategory, status: "prototype" as ProjectStatus });
  const { save, saving, errors } = useSave<AdminProject>();
  const set = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => setDraft((current) => ({ ...current, [key]: value }));
  // Slug proposé à partir du titre : minuscules, sans accents ni espaces.
  const suggestSlug = (title: string) =>
    title
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const ready = Boolean(draft.title.trim() && draft.slug && draft.shortDescription.trim());

  return (
    <Modal
      open
      title="Nouveau projet"
      onClose={onClose}
      footer={
        <div className="flex flex-wrap items-center gap-3">
          <div className="ml-auto flex gap-3">
            <button type="button" onClick={onClose} className={`${footerButton} inline-flex items-center gap-2 border hairline`}>
              <X aria-hidden className="size-4" />
              Annuler
            </button>
            <button
              type="button"
              disabled={!ready || saving}
              onClick={async () => {
                const created = await save("/admin/projects", draft, ["projects"], "POST");
                if (created) onCreated(created);
              }}
              className={`${footerButton} inline-flex items-center gap-2 bg-fg text-bg hover:bg-cobalt hover:text-ivory`}
            >
              {saving ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Check aria-hidden className="size-4" />}
              {saving ? "Création…" : "Créer et continuer"}
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <p className="text-fg-muted">Le projet est créé en privé. Tu ajoutes ensuite ses images et ses liens, puis tu le passes en public.</p>
        <TextField
          label="Titre"
          value={draft.title}
          onChange={(v) => setDraft((current) => ({ ...current, title: v, slug: current.slug === suggestSlug(current.title) ? suggestSlug(v) : current.slug }))}
          error={errors.title}
        />
        <TextField label="Identifiant d'URL (slug)" hint={`Adresse : /projets/${draft.slug || "…"}`} value={draft.slug} onChange={(v) => set("slug", v)} error={errors.slug} />
        <TextArea label="Description courte" rows={3} value={draft.shortDescription} onChange={(v) => set("shortDescription", v)} error={errors.shortDescription} />
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label="Catégorie" value={draft.category} onChange={(v) => set("category", v)} options={CATEGORY_OPTIONS} />
          <SelectField label="Statut" value={draft.status} onChange={(v) => set("status", v)} options={STATUS_OPTIONS} />
        </div>
      </div>
    </Modal>
  );
}

// Projets : liste visuelle (couverture, statut, visibilité), édition et création en fenêtre.
export function ProjectsSection() {
  const { data, error, setData } = useAdminData<AdminProject[]>("/projects");
  const [editing, setEditing] = useState<AdminProject | null>(null);
  const [creating, setCreating] = useState(false);

  const replace = (saved: AdminProject) => setData((list) => list?.map((item) => (item.id === saved.id ? saved : item)) ?? list);

  return (
    <Panel
      title="Projets"
      actions={
        <button type="button" onClick={() => setCreating(true)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-bg hover:bg-cobalt hover:text-ivory">
          <Plus aria-hidden className="size-4" /> Nouveau projet
        </button>
      }
    >
      {error && <p className="text-danger">{error}</p>}
      {!data && !error && <div className="h-40 animate-pulse rounded-xl bg-bg-raised" />}
      {data && data.length === 0 && <p className="text-fg-muted">Aucun projet pour l&apos;instant.</p>}
      {data && data.length > 0 && (
        // Toutes les cartes ont la même taille : image recadrée au même format, texte tronqué.
        <ul className="grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((project) => (
            <li key={project.id}>
              <button
                type="button"
                onClick={() => setEditing(project)}
                className="group flex h-full w-full flex-col overflow-hidden rounded-(--radius) border hairline text-left transition-colors hover:border-cobalt-soft/50"
              >
                <span className="relative block aspect-[16/9] shrink-0 overflow-hidden bg-bg-raised">
                  {project.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.coverImage.url} alt="" className="absolute inset-0 size-full object-cover object-top" />
                  ) : (
                    <span className="flex size-full items-center justify-center text-fg-subtle">
                      <ImageOff aria-hidden className="size-6" />
                    </span>
                  )}
                  {(project.gallery?.length ?? 0) > 0 && (
                    <span className="absolute bottom-2 right-2 rounded-full bg-ink/80 px-2 py-0.5 text-xs text-ivory">+{project.gallery!.length} image(s)</span>
                  )}
                </span>
                <span className="flex h-24 flex-col gap-2 overflow-hidden p-4">
                  <span className="truncate font-semibold">{project.title}</span>
                  <span className="flex flex-wrap items-center gap-1.5 overflow-hidden">
                    <Badge tone={VISIBILITY_BADGE[project.visibility]}>{VISIBILITY.find((v) => v.value === project.visibility)?.label}</Badge>
                    <Badge tone="neutral">{statusLabels[project.status]}</Badge>
                    {project.isFeatured && <Badge tone="accent">À la une</Badge>}
                    {project.liveUrl && (
                      <span className="inline-flex items-center gap-1 text-xs text-fg-subtle">
                        <ExternalLink aria-hidden className="size-3" /> démo
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <ProjectModal
          key={editing.id}
          project={editing}
          onClose={() => setEditing(null)}
          onSaved={replace}
          onDeleted={(id) => {
            setData((list) => list?.filter((item) => item.id !== id) ?? list);
            setEditing(null);
          }}
        />
      )}
      {creating && (
        <NewProjectModal
          onClose={() => setCreating(false)}
          onCreated={(project) => {
            setData((list) => (list ? [...list, project] : [project]));
            setCreating(false);
            setEditing(project);
          }}
        />
      )}
    </Panel>
  );
}
