"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryRow } from "@/types/category";
import type { ProductRow } from "@/types/product";
import { CategoryTabs } from "./CategoryTabs";
import { StatusBadge } from "./StatusBadge";
import {
  publishProduct,
  unpublishProduct,
  deleteProduct,
} from "@/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface ProductTableProps {
  products: ProductRow[];
  categories: CategoryRow[];
}

function matchesProductSearch(product: ProductRow, query: string): boolean {
  const q = query.trim().toLocaleLowerCase("tr-TR");
  if (!q) return true;
  return [product.slug, product.title_tr, product.title_en].some((value) =>
    value.toLocaleLowerCase("tr-TR").includes(q),
  );
}

export function ProductTable({ products, categories }: ProductTableProps) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState<string | "all">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "published"
  >("all");
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categoryId !== "all" && p.category_id !== categoryId) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!matchesProductSearch(p, search)) return false;
      return true;
    });
  }, [products, categoryId, statusFilter, search]);

  async function toggleStatus(id: string, current: ProductRow["status"]) {
    setPending(id);
    try {
      if (current === "published") await unpublishProduct(id);
      else await publishProduct(id);
      router.refresh();
    } finally {
      setPending(null);
    }
  }

  async function handleDelete(id: string, slug: string) {
    if (!confirm(`"${slug}" silinsin mi?`)) return;
    setPending(id);
    try {
      await deleteProduct(id);
      router.refresh();
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="admin-product-search">
            Ürün ara
          </label>
          <Input
            id="admin-product-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Slug veya başlık ile ara…"
            className="max-w-md rounded-none border-navy-800/25 font-sans"
            autoComplete="off"
          />
          {search.trim() ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setSearch("")}
              className="font-mono text-xs uppercase tracking-widest"
            >
              Temizle
            </Button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <CategoryTabs
            categories={categories}
            active={categoryId}
            onChange={setCategoryId}
          />
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-xs text-muted-foreground">
              {filtered.length === products.length
                ? `${products.length} ürün`
                : `${filtered.length} / ${products.length} ürün`}
            </p>
            <div className="flex gap-2">
              {(["all", "draft", "published"] as const).map((s) => (
                <Button
                  key={s}
                  type="button"
                  size="sm"
                  variant={statusFilter === s ? "default" : "outline"}
                  onClick={() => setStatusFilter(s)}
                  className="font-mono text-xs uppercase tracking-widest"
                >
                  {s === "all"
                    ? "Tüm durumlar"
                    : s === "draft"
                      ? "Taslak"
                      : "Yayında"}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 font-mono text-xs uppercase tracking-widest">
              <TableHead>Slug</TableHead>
              <TableHead>Başlık (TR)</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Güncelleme</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.slug}</TableCell>
                <TableCell>{p.title_tr}</TableCell>
                <TableCell className="font-mono text-xs">
                  {p.category?.name_tr ?? "—"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={p.status} />
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {new Date(p.updated_at).toLocaleString("tr-TR")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {p.status === "published" ? (
                      <Link
                        href={`/tr/urunler/${p.slug}`}
                        target="_blank"
                        className="inline-flex h-7 items-center px-2 font-mono text-xs uppercase tracking-widest text-muted-foreground underline-offset-4 hover:underline"
                      >
                        Önizle
                      </Link>
                    ) : null}
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="inline-flex h-7 items-center px-2 font-mono text-xs uppercase tracking-widest text-foreground underline-offset-4 hover:underline"
                    >
                      Düzenle
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={pending === p.id}
                      onClick={() => toggleStatus(p.id, p.status)}
                      className="font-mono text-xs uppercase tracking-widest text-gold-600"
                    >
                      {p.status === "published" ? "Taslağa al" : "Yayınla"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={pending === p.id}
                      onClick={() => handleDelete(p.id, p.slug)}
                      className="font-mono text-xs uppercase tracking-widest text-destructive"
                    >
                      Sil
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            {search.trim()
              ? "Arama ile eşleşen ürün yok."
              : "Kayıt bulunamadı."}
          </p>
        ) : null}
      </div>
    </div>
  );
}
