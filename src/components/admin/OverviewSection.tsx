"use client";

import { ACTION_LABELS, formatDateTime, type Overview, useAdminData } from "./data";
import { Panel } from "./fields";
import type { AdminTab } from "./AdminApp";

// Vue d'ensemble : les chiffres réels de la base, et ce qui attend une action.
export function OverviewSection({ go }: { go: (tab: AdminTab) => void }) {
  const { data, error } = useAdminData<Overview>("/overview");
  if (error) return <p className="text-danger">{error}</p>;
  if (!data) return <div className="h-64 animate-pulse rounded-(--radius) bg-bg-raised" />;

  const tiles: { label: string; value: number; hint?: string; tab: AdminTab; highlight?: boolean }[] = [
    { label: "Avis à relire", value: data.reviews.pending, tab: "reviews", highlight: data.reviews.pending > 0 },
    { label: "Avis publiés", value: data.reviews.approved, tab: "reviews" },
    { label: "Projets publics", value: data.projects.public, hint: `${data.projects.total} au total`, tab: "projects" },
    { label: "Offres publiées", value: data.offers, tab: "pricing" },
    { label: "Savoir-faire", value: data.services, tab: "services" },
    { label: "Comptes", value: data.users, tab: "users" },
  ];

  return (
    <div className="space-y-6">
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map((tile) => (
          <li key={tile.label}>
            <button
              type="button"
              onClick={() => go(tile.tab)}
              className={`w-full rounded-(--radius) border p-5 text-left transition-colors hover:border-cobalt-soft/50 ${
                tile.highlight ? "border-cobalt-soft/60 bg-cobalt/10" : "hairline bg-bg-raised/30"
              }`}
            >
              <span className="label block text-fg-subtle">{tile.label}</span>
              <span className="mt-2 block text-4xl font-semibold tabular-nums [font-stretch:115%]">{tile.value}</span>
              {tile.hint && <span className="mt-1 block text-sm text-fg-subtle">{tile.hint}</span>}
            </button>
          </li>
        ))}
      </ul>

      <Panel title="Dernières actions">
        {data.recentActivity.length === 0 ? (
          <p className="text-fg-muted">Aucune action pour l&apos;instant.</p>
        ) : (
          <ul className="divide-y divide-line">
            {data.recentActivity.map((item) => (
              <li key={item.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                <span>
                  <span className="font-medium">{ACTION_LABELS[item.action] ?? item.action}</span>
                  {item.detail && <span className="text-fg-subtle"> · {item.detail}</span>}
                </span>
                <span className="text-sm text-fg-subtle">{formatDateTime(item.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
