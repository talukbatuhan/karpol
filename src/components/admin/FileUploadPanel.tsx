"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { uploadStorageFile } from "@/actions/storage-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/molecules/FormField";

type FileUploadPanelProps = {
  bucket: "product-images" | "product-files";
  folder?: string;
  onUploaded?: () => void;
};

export function FileUploadPanel({
  bucket,
  folder = "",
  onUploaded,
}: FileUploadPanelProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("folder", folder);
    try {
      const result = await uploadStorageFile(bucket, formData);
      if ("error" in result && result.error) {
        setMessage(result.error);
      } else if ("path" in result) {
        setMessage(`Yüklendi: ${result.path}`);
        form.reset();
        onUploaded?.();
        router.refresh();
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <FormField label="Dosya" className="min-w-[220px]">
        <Input name="file" type="file" required disabled={pending} />
      </FormField>
      <Button
        type="submit"
        disabled={pending}
        className="font-mono text-xs uppercase tracking-widest"
      >
        {pending ? "…" : "Yükle"}
      </Button>
      {message ? (
        <p className="w-full font-mono text-xs text-muted-foreground">{message}</p>
      ) : null}
    </form>
  );
}
