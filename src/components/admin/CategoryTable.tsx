"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryRow } from "@/types/category";
import { deleteCategory } from "@/actions/category-actions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface CategoryTableProps {
  categories: CategoryRow[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const router = useRouter();
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
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Silme başarısız.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 font-mono text-xs uppercase tracking-widest">
              <TableHead>Slug</TableHead>
              <TableHead>Ad (TR)</TableHead>
              <TableHead>Ad (EN)</TableHead>
              <TableHead>Üst kategori</TableHead>
              <TableHead>Sıra</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs">{c.slug}</TableCell>
                <TableCell>{c.name_tr}</TableCell>
                <TableCell>{c.name_en}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {c.parent_id
                    ? (parentNameById.get(c.parent_id) ?? "—")
                    : "—"}
                </TableCell>
                <TableCell className="font-mono text-xs">{c.sort_order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/categories/${c.id}/edit`}
                      className="font-mono text-xs uppercase tracking-widest underline-offset-4 hover:underline"
                    >
                      Düzenle
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={pending === c.id}
                      onClick={() => handleDelete(c.id, c.name_tr)}
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
        {categories.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Henüz kategori yok. İlk kategorinizi oluşturun.
          </p>
        ) : null}
      </div>
    </div>
  );
}
