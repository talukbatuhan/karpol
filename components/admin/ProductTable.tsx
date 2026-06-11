"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CategoryRow } from "@/lib/types/category";
import type { ProductRow } from "@/lib/types/product";
import { CategoryTabs } from "./CategoryTabs";
import { StatusBadge } from "./StatusBadge";
import {
  publishProduct,
  unpublishProduct,
  deleteProduct,
} from "@/lib/actions/product-actions";

type ProductTableProps = {
  products: ProductRow[];
  categories: CategoryRow[];
};

export function ProductTable({ products, categories }: ProductTableProps) {
  const [categoryId, setCategoryId] = useState<string | "all">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "published"
  >("all");
  const [pending, setPending] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categoryId !== "all" && p.category_id !== categoryId) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      return true;
    });
  }, [products, categoryId, statusFilter]);

  async function toggleStatus(id: string, current: ProductRow["status"]) {
    setPending(id);
    try {
      if (current === "published") await unpublishProduct(id);
      else await publishProduct(id);
      window.location.reload();
    } finally {
      setPending(null);
    }
  }

  async function handleDelete(id: string, slug: string) {
    if (!confirm(`"${slug}" silinsin mi?`)) return;
    setPending(id);
    try {
      await deleteProduct(id);
      window.location.reload();
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <CategoryTabs
          categories={categories}
          active={categoryId}
          onChange={setCategoryId}
        />
        <div className="flex gap-2">
          {(["all", "draft", "published"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded border px-3 py-1.5 font-mono text-xs uppercase tracking-widest ${
                statusFilter === s
                  ? "border-navy-950 bg-navy-950 text-ivory-50"
                  : "border-navy-800/30 text-navy-800"
              }`}
            >
              {s === "all"
                ? "Tüm durumlar"
                : s === "draft"
                  ? "Taslak"
                  : "Yayında"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto border border-navy-800/20">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-navy-800/20 bg-navy-950/5 font-mono text-xs uppercase tracking-widest text-navy-800">
            <tr>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Başlık (TR)</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Güncelleme</th>
              <th className="px-4 py-3 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-navy-800/10">
                <td className="px-4 py-3 font-mono text-xs">{p.slug}</td>
                <td className="px-4 py-3">{p.title_tr}</td>
                <td className="px-4 py-3 font-mono text-xs">
                  {p.category?.name_tr ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-navy-800/70">
                  {new Date(p.updated_at).toLocaleString("tr-TR")}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="font-mono text-xs uppercase tracking-widest text-navy-800 underline"
                    >
                      Düzenle
                    </Link>
                    <button
                      type="button"
                      disabled={pending === p.id}
                      onClick={() => toggleStatus(p.id, p.status)}
                      className="font-mono text-xs uppercase tracking-widest text-gold-600 hover:text-gold-500 disabled:opacity-50"
                    >
                      {p.status === "published" ? "Taslağa al" : "Yayınla"}
                    </button>
                    <button
                      type="button"
                      disabled={pending === p.id}
                      onClick={() => handleDelete(p.id, p.slug)}
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
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-navy-800/60">
            Kayıt bulunamadı.
          </p>
        ) : null}
      </div>
    </div>
  );
}
