"use client";

import { ACTION_LABELS, type AdminActivity, type AdminUser, formatDateTime, useAdminData } from "./data";
import { Badge, Panel } from "./fields";

// Comptes : lecture seule. Le rôle admin vient d'ADMIN_EMAILS côté serveur, il ne se change pas ici.
export function UsersSection() {
  const { data, error } = useAdminData<AdminUser[]>("/users");
  return (
    <Panel title="Comptes">
      <p className="mb-5 text-sm text-fg-subtle">Admin = e-mail vérifié et présent dans ADMIN_EMAILS (backend/.env). Aucun rôle ne se modifie depuis l&apos;interface.</p>
      {error && <p className="text-danger">{error}</p>}
      {!data && !error && <div className="h-40 animate-pulse rounded-xl bg-bg-raised" />}
      {data && data.length === 0 && <p className="text-fg-muted">Aucun compte pour l&apos;instant.</p>}
      {data && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="label text-fg-subtle">
              <tr className="border-b hairline">
                <th scope="col" className="py-3 pr-4 font-normal">E-mail</th>
                <th scope="col" className="py-3 pr-4 font-normal">Nom</th>
                <th scope="col" className="py-3 pr-4 font-normal">Rôle</th>
                <th scope="col" className="py-3 font-normal">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.id} className="border-b hairline">
                  <td className="py-3 pr-4 font-medium">{user.email}</td>
                  <td className="py-3 pr-4 text-fg-muted">{user.name || "—"}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={user.isAdmin ? "accent" : "neutral"}>{user.isAdmin ? "Admin" : "Utilisateur"}</Badge>
                    {!user.emailVerified && <span className="ml-2 text-fg-subtle">non vérifié</span>}
                  </td>
                  <td className="py-3 text-fg-subtle">{formatDateTime(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

export function ActivitySection() {
  const { data, error } = useAdminData<AdminActivity[]>("/activity?limit=100");
  return (
    <Panel title="Journal des actions">
      {error && <p className="text-danger">{error}</p>}
      {!data && !error && <div className="h-40 animate-pulse rounded-xl bg-bg-raised" />}
      {data && data.length === 0 && <p className="text-fg-muted">Aucune action enregistrée.</p>}
      {data && data.length > 0 && (
        <ul className="divide-y divide-line">
          {data.map((item) => (
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
  );
}
