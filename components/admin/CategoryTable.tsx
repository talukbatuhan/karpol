"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CategoryRow } from "@/lib/types/category";
import { deleteCategory } from "@/lib/actions/category-actions";

type CategoryTableProps = {
  categories: CategoryRow[];
};

export function CategoryTable({ categories }: CategoryTableProps) {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parentNameById = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name_tr])),
    [categories],
  );

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" kategorisi silinsin mi?`)) return;
    setPending(id);
    setError(null);
    try {
      await deleteCategory(id);
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Silme başarısız.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto border border-navy-800/20">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-navy-800/20 bg-navy-950/5 font-mono text-xs uppercase tracking-widest text-navy-800">
            <tr>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Ad (TR)</th>
              <th className="px-4 py-3">Ad (EN)</th>
              <th className="px-4 py-3">Üst kategori</th>
              <th className="px-4 py-3">Sıra</th>
              <th className="px-4 py-3 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-navy-800/10">
                <td className="px-4 py-3 font-mono text-xs">{c.slug}</td>
                <td className="px-4 py-3">{c.name_tr}</td>
                <td className="px-4 py-3">{c.name_en}</td>
                <td className="px-4 py-3 font-mono text-xs text-navy-800/70">
                  {c.parent_id
                    ? (parentNameById.get(c.parent_id) ?? "—")
                    : "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs">{c.sort_order}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/categories/${c.id}/edit`}
                      className="font-mono text-xs uppercase tracking-widest text-navy-800 underline"
                    >
                      Düzenle
                    </Link>
                    <button
                      type="button"
                      disabled={pending === c.id}
                      onClick={() => handleDelete(c.id, c.name_tr)}
                      className="font-mono text-xs uppercase tracking-widest text-red-700 hover:text-red-600 disabled:opacity-50"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-navy-800/60">
            Henüz kategori yok. İlk kategorinizi oluşturun.
          </p>
        ) : null}
      </div>
    </div>
  );
}
