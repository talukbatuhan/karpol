"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { EcatalogRow } from "@/types/ecatalog";
import { deleteEcatalog, setEcatalogStatus } from "@/actions/ecatalog-actions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function EcatalogTable({ ecatalogs }: { ecatalogs: EcatalogRow[] }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" e-kataloğu silinsin mi?`)) return;
    setPending(id);
    try {
      await deleteEcatalog(id);
      router.refresh();
    } finally {
      setPending(null);
    }
  }

  async function toggleStatus(id: string, status: EcatalogRow["status"]) {
    setPending(id);
    try {
      await setEcatalogStatus(id, status === "published" ? "draft" : "published");
      router.refresh();
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Başlık</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead className="text-right">İşlem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ecatalogs.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.title_tr}</TableCell>
              <TableCell className="font-mono text-xs">{row.slug}</TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/ecatalogs/${row.id}/edit`}
                    className="inline-flex items-center border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-widest"
                  >
                    Düzenle
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={pending === row.id}
                    onClick={() => void toggleStatus(row.id, row.status)}
                  >
                    {row.status === "published" ? "Taslağa al" : "Yayınla"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    disabled={pending === row.id}
                    onClick={() => void handleDelete(row.id, row.title_tr)}
                  >
                    Sil
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
