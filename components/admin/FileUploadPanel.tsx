"use client";

import { useState } from "react";
import { uploadStorageFile } from "@/lib/actions/storage-actions";

type FileUploadPanelProps = {
  bucket: "product-images" | "product-files";
  folder?: string;
};

export function FileUploadPanel({ bucket, folder = "" }: FileUploadPanelProps) {
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
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <label className="block text-sm">
        <span className="font-mono text-xs uppercase tracking-widest text-navy-800">
          Dosya
        </span>
        <input
          name="file"
          type="file"
          required
          className="mt-1 block text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="border border-gold-500 px-4 py-2 font-mono text-xs uppercase tracking-widest text-navy-950 disabled:opacity-50"
      >
        {pending ? "…" : "Yükle"}
      </button>
      {message ? (
        <p className="w-full font-mono text-xs text-navy-800">{message}</p>
      ) : null}
    </form>
  );
}
