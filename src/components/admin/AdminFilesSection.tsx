"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUploadPanel } from "@/components/admin/FileUploadPanel";
import { deleteStorageFile } from "@/actions/storage-actions";
import type { StorageFileItem } from "@/services/storage";
import { getPublicStorageUrl } from "@/lib/storage-url";
import { Button } from "@/components/ui/button";

type Bucket = "product-images" | "product-files";

export interface AdminFilesSectionProps {
  bucket: Bucket;
  items: StorageFileItem[];
}

export function AdminFilesSection({ bucket, items }: AdminFilesSectionProps) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    router.refresh();
  }

  async function handleCopy(path: string) {
    try {
      await navigator.clipboard.writeText(path);
      setCopied(path);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setError("Panoya kopyalanamadı.");
    }
  }

  async function handleDelete(path: string) {
    if (!confirm(`"${path}" silinsin mi?`)) return;
    setPending(path);
    setError(null);
    try {
      await deleteStorageFile(bucket, path);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Silme başarısız.");
    } finally {
      setPending(null);
    }
  }

  return (
    <section className="space-y-4">
      <FileUploadPanel bucket={bucket} onUploaded={refresh} />
      {error ? (
        <p className="border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <FileList
        bucket={bucket}
        items={items}
        pending={pending}
        copied={copied}
        onCopy={handleCopy}
        onDelete={handleDelete}
      />
    </section>
  );
}

function FileList({
  bucket,
  items,
  pending,
  copied,
  onCopy,
  onDelete,
}: {
  bucket: Bucket;
  items: StorageFileItem[];
  pending: string | null;
  copied: string | null;
  onCopy: (path: string) => void;
  onDelete: (path: string) => void;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Henüz dosya yok.</p>;
  }

  return (
    <ul className="divide-y divide-border border border-border text-sm">
      {items.map((file) => (
        <li
          key={file.path}
          className="flex flex-wrap items-center justify-between gap-2 px-4 py-2"
        >
          <code className="font-mono text-xs">{file.path}</code>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onCopy(file.path)}
              className="font-mono text-[10px] uppercase tracking-widest"
            >
              {copied === file.path ? "Kopyalandı" : "Yolu kopyala"}
            </Button>
            <a
              href={getPublicStorageUrl(bucket, file.path)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center px-2 font-mono text-[10px] uppercase tracking-widest text-gold-600 underline"
            >
              Aç
            </a>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={pending === file.path}
              onClick={() => onDelete(file.path)}
              className="font-mono text-[10px] uppercase tracking-widest text-destructive"
            >
              Sil
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
