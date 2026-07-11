"use client";

import { useRef, useState } from "react";
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { ProductUpsertFormValues } from "@/lib/schemas/product";
import { uploadStorageFile } from "@/actions/storage-actions";
import {
  resolveProductFileUrl,
  resolveProductImageUrl,
} from "@/lib/product-image";
import {
  sortFilesByFilename,
  sortImagePathsByFilename,
} from "@/lib/product-image-sort";
import { ProportionalProductImage } from "@/components/molecules/ProportionalProductImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/molecules/FormField";

type FileAssetKey = "cad" | "pdf";

const FILE_ASSET_CONFIG: Record<
  FileAssetKey,
  {
    label: string;
    bucket: "product-files";
    accept: string;
  }
> = {
  cad: {
    label: "CAD",
    bucket: "product-files",
    accept: ".dwg,.dxf,.step,.stp,.iges,.igs",
  },
  pdf: {
    label: "PDF",
    bucket: "product-files",
    accept: "application/pdf,.pdf",
  },
};

export interface ProductAssetFieldsProps {
  register: UseFormRegister<ProductUpsertFormValues>;
  watch: UseFormWatch<ProductUpsertFormValues>;
  setValue: UseFormSetValue<ProductUpsertFormValues>;
}

export function ProductAssetFields({
  register,
  watch,
  setValue,
}: ProductAssetFieldsProps) {
  return (
    <section className="space-y-6">
      <h2 className="font-mono text-xs uppercase tracking-widest text-gold-600">
        Dosyalar
      </h2>

      <ProductImageGallery watch={watch} setValue={setValue} />

      <div className="grid gap-4 sm:grid-cols-2">
        {(Object.keys(FILE_ASSET_CONFIG) as FileAssetKey[]).map((key) => (
          <ProductFileAssetField
            key={key}
            assetKey={key}
            config={FILE_ASSET_CONFIG[key]}
            value={watch(`metadata.assets.${key}`) ?? ""}
            register={register}
            setValue={setValue}
          />
        ))}
      </div>
    </section>
  );
}

function ProductImageGallery({
  watch,
  setValue,
}: {
  watch: UseFormWatch<ProductUpsertFormValues>;
  setValue: UseFormSetValue<ProductUpsertFormValues>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const images = (watch("metadata.assets.images") ?? []).filter(Boolean);

  function syncImages(next: string[]) {
    const sorted = sortImagePathsByFilename(next.filter(Boolean));
    setValue("metadata.assets.images", sorted, { shouldDirty: true });
    setValue("metadata.assets.image", sorted[0] ?? "", { shouldDirty: true });
  }

  async function handleUpload(files: FileList | File[]) {
    const list = sortFilesByFilename(Array.from(files));
    if (list.length === 0) return;

    setUploading(true);
    setMessage(null);

    const uploaded: string[] = [];
    const errors: string[] = [];

    for (const file of list) {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", "");

      try {
        const result = await uploadStorageFile("product-images", formData);
        if ("error" in result && result.error) {
          errors.push(`${file.name}: ${result.error}`);
          continue;
        }
        if ("path" in result && result.path) {
          uploaded.push(result.path);
        }
      } catch (err) {
        errors.push(
          `${file.name}: ${err instanceof Error ? err.message : "Yükleme başarısız"}`,
        );
      }
    }

    if (uploaded.length > 0) {
      syncImages([...images, ...uploaded]);
    }

    if (errors.length > 0) {
      setMessage(
        uploaded.length > 0
          ? `${uploaded.length} yüklendi (dosya adına göre sıralandı). Hatalar: ${errors.join("; ")}`
          : errors.join("; "),
      );
    } else {
      setMessage(
        `${uploaded.length} görsel yüklendi — dosya adına göre sıralandı (001, 002, …)`,
      );
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(index: number) {
    syncImages(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3 border border-border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-navy-800">
            Ürün görselleri
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Birden fazla görsel yükleyin. Dosya adındaki numaraya göre sıralanır
            (001, 002, 003…). En küçük numaralı görsel kapaktır.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              if (event.target.files) void handleUpload(event.target.files);
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
            {uploading ? "Yükleniyor…" : "Görsel ekle"}
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz görsel yok.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((path, index) => {
            const previewUrl = resolveProductImageUrl(path);
            return (
              <li
                key={`${path}-${index}`}
                className="space-y-2 border border-border bg-muted/20 p-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {index === 0 ? "Kapak · 1" : `#${index + 1}`}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="h-7 px-2 font-mono text-[10px] uppercase text-destructive"
                  >
                    Sil
                  </Button>
                </div>
                {previewUrl ? (
                  <div className="overflow-hidden border border-border bg-muted">
                    <ProportionalProductImage
                      src={previewUrl}
                      alt=""
                      sizes="240px"
                    />
                  </div>
                ) : null}
                <Input
                  value={path}
                  onChange={(event) => {
                    const next = [...images];
                    next[index] = event.target.value;
                    syncImages(next.filter(Boolean));
                  }}
                  className="font-mono text-[10px]"
                />
              </li>
            );
          })}
        </ul>
      )}

      {message ? (
        <p className="font-mono text-[10px] text-muted-foreground">{message}</p>
      ) : null}
    </div>
  );
}

function ProductFileAssetField({
  assetKey,
  config,
  value,
  register,
  setValue,
}: {
  assetKey: FileAssetKey;
  config: (typeof FILE_ASSET_CONFIG)[FileAssetKey];
  value: string;
  register: UseFormRegister<ProductUpsertFormValues>;
  setValue: UseFormSetValue<ProductUpsertFormValues>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fieldName = `metadata.assets.${assetKey}` as const;
  const previewUrl = resolveProductFileUrl(value);

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
        {previewUrl ? (
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
      {message ? (
        <p className="font-mono text-[10px] text-muted-foreground">{message}</p>
      ) : null}
    </FormField>
  );
}
