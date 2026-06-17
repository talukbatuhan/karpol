"use client";

import { useRef, useState } from "react";
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { ProductUpsertInput } from "@/lib/schemas/product";
import { uploadStorageFile } from "@/actions/storage-actions";
import { resolveProductImageUrl, resolveProductFileUrl } from "@/lib/product-image";
import { ProportionalProductImage } from "@/components/molecules/ProportionalProductImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/molecules/FormField";

type AssetKey = "image" | "cad" | "pdf";

const ASSET_CONFIG: Record<
  AssetKey,
  {
    label: string;
    bucket: "product-images" | "product-files";
    accept: string;
    preview: boolean;
  }
> = {
  image: {
    label: "Görsel",
    bucket: "product-images",
    accept: "image/*",
    preview: true,
  },
  cad: {
    label: "CAD",
    bucket: "product-files",
    accept: ".dwg,.dxf,.step,.stp,.iges,.igs",
    preview: false,
  },
  pdf: {
    label: "PDF",
    bucket: "product-files",
    accept: "application/pdf,.pdf",
    preview: false,
  },
};

export interface ProductAssetFieldsProps {
  register: UseFormRegister<ProductUpsertInput>;
  watch: UseFormWatch<ProductUpsertInput>;
  setValue: UseFormSetValue<ProductUpsertInput>;
}

export function ProductAssetFields({
  register,
  watch,
  setValue,
}: ProductAssetFieldsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <h2 className="col-span-full font-mono text-xs uppercase tracking-widest text-gold-600">
        Dosyalar
      </h2>
      {(Object.keys(ASSET_CONFIG) as AssetKey[]).map((key) => (
        <ProductAssetField
          key={key}
          assetKey={key}
          config={ASSET_CONFIG[key]}
          value={watch(`metadata.assets.${key}`) ?? ""}
          register={register}
          setValue={setValue}
        />
      ))}
    </section>
  );
}

function ProductAssetField({
  assetKey,
  config,
  value,
  register,
  setValue,
}: {
  assetKey: AssetKey;
  config: (typeof ASSET_CONFIG)[AssetKey];
  value: string;
  register: UseFormRegister<ProductUpsertInput>;
  setValue: UseFormSetValue<ProductUpsertInput>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fieldName = `metadata.assets.${assetKey}` as const;
  const previewUrl =
    assetKey === "image"
      ? resolveProductImageUrl(value)
      : resolveProductFileUrl(value);

  async function handleUpload(file: File) {
    setUploading(true);
    setMessage(null);
    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", "");

    try {
      const result = await uploadStorageFile(config.bucket, formData);
      if ("error" in result && result.error) {
        setMessage(result.error);
        return;
      }
      if ("path" in result) {
        setValue(fieldName, result.path, { shouldDirty: true });
        setMessage("Yüklendi");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <FormField label={config.label} className="space-y-2">
      <Input {...register(fieldName)} placeholder="storage/yolu veya yükle" />
      <div className="flex flex-wrap gap-2">
        <input
          ref={fileRef}
          type="file"
          accept={config.accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="font-mono text-[10px] uppercase tracking-widest"
        >
          {uploading ? "…" : "Yükle"}
        </Button>
        {previewUrl && !config.preview ? (
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center font-mono text-[10px] uppercase tracking-widest text-gold-600 underline"
          >
            Aç
          </a>
        ) : null}
      </div>
      {config.preview && previewUrl ? (
        <div className="mt-2 overflow-hidden border border-border bg-muted">
          <ProportionalProductImage src={previewUrl} alt="" sizes="200px" />
        </div>
      ) : null}
      {message ? (
        <p className="font-mono text-[10px] text-muted-foreground">{message}</p>
      ) : null}
    </FormField>
  );
}
