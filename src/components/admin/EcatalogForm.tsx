"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ecatalogUpsertSchema,
  type EcatalogUpsertInput,
} from "@/lib/schemas/ecatalog";
import { parseEcatalogLinks } from "@/lib/ecatalog-links";
import type { EcatalogWithSpreads } from "@/services/ecatalogs/ecatalog.repository";
import { createEcatalog, updateEcatalog } from "@/actions/ecatalog-actions";
import { EcatalogSpreadEditor } from "@/components/admin/EcatalogSpreadEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/molecules/FormField";
import { fieldSelectClass } from "@/lib/utils";
import { uploadStorageFile } from "@/actions/storage-actions";
import { resolveEcatalogImageUrl } from "@/lib/ecatalog-image";
import { ProportionalProductImage } from "@/components/molecules/ProportionalProductImage";

function rowToInput(row: EcatalogWithSpreads): EcatalogUpsertInput {
  return {
    slug: row.slug,
    status: row.status,
    title_tr: row.title_tr,
    title_en: row.title_en,
    description_tr: row.description_tr,
    description_en: row.description_en,
    cover_image: row.cover_image,
    year: row.year,
    sort_order: row.sort_order,
    spreads: row.spreads.map((spread) => ({
      id: spread.id,
      sort_order: spread.sort_order,
      left_image: spread.left_image,
      right_image: spread.right_image,
      links: parseEcatalogLinks(spread.links),
    })),
  };
}

export interface EcatalogFormProps {
  ecatalog?: EcatalogWithSpreads;
  productSlugs: string[];
}

export function EcatalogForm({ ecatalog, productSlugs }: EcatalogFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const isEdit = Boolean(ecatalog);

  const emptyDefaults: EcatalogUpsertInput = {
    slug: "",
    status: "draft",
    title_tr: "",
    title_en: "",
    description_tr: "",
    description_en: "",
    cover_image: "",
    year: new Date().getFullYear().toString(),
    sort_order: 0,
    spreads: [],
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EcatalogUpsertInput>({
    resolver: zodResolver(ecatalogUpsertSchema),
    defaultValues: ecatalog ? rowToInput(ecatalog) : emptyDefaults,
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "spreads",
  });

  const coverImage = watch("cover_image");
  const coverPreview = resolveEcatalogImageUrl(coverImage);

  async function uploadCover(file: File) {
    setCoverUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", "ecatalog");
    try {
      const result = await uploadStorageFile("product-images", formData);
      if ("path" in result && result.path) {
        setValue("cover_image", result.path, { shouldDirty: true });
      }
    } finally {
      setCoverUploading(false);
    }
  }

  async function onSubmit(data: EcatalogUpsertInput) {
    setError(null);
    try {
      const normalized = {
        ...data,
        spreads: data.spreads.map((spread, index) => ({
          ...spread,
          sort_order: index,
        })),
      };
      if (isEdit && ecatalog) {
        await updateEcatalog(ecatalog.id, normalized);
      } else {
        await createEcatalog(normalized);
      }
      router.push("/admin/ecatalogs");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kayıt başarısız.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-8">
      {error ? (
        <p className="border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Slug" error={errors.slug?.message}>
          <Input {...register("slug")} placeholder="karpol-kaplinler" />
        </FormField>
        <FormField label="Durum">
          <select {...register("status")} className={fieldSelectClass}>
            <option value="draft">Taslak</option>
            <option value="published">Yayında</option>
          </select>
        </FormField>
        <FormField label="Başlık TR" error={errors.title_tr?.message}>
          <Input {...register("title_tr")} />
        </FormField>
        <FormField label="Title EN" error={errors.title_en?.message}>
          <Input {...register("title_en")} />
        </FormField>
        <FormField label="Yıl">
          <Input {...register("year")} placeholder="2026" />
        </FormField>
        <FormField label="Sıra">
          <Input type="number" {...register("sort_order", { valueAsNumber: true })} />
        </FormField>
      </div>

      <FormField label="Açıklama TR">
        <Textarea {...register("description_tr")} rows={3} />
      </FormField>
      <FormField label="Description EN">
        <Textarea {...register("description_en")} rows={3} />
      </FormField>

      <FormField label="Kapak görseli">
        <Input {...register("cover_image")} placeholder="ecatalog/kapak.png" />
        <div className="mt-2 flex gap-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="ecatalog-cover-upload"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void uploadCover(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={coverUploading}
            onClick={() => document.getElementById("ecatalog-cover-upload")?.click()}
          >
            {coverUploading ? "…" : "Kapak yükle"}
          </Button>
        </div>
        {coverPreview ? (
          <div className="mt-3 max-w-xs overflow-hidden border border-border">
            <ProportionalProductImage src={coverPreview} alt="" sizes="300px" />
          </div>
        ) : null}
      </FormField>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-gold-600">
            Sayfa çiftleri
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                sort_order: fields.length,
                left_image: "",
                right_image: "",
                links: [],
              })
            }
          >
            + Sayfa çifti
          </Button>
        </div>

        {fields.map((field, index) => (
          <EcatalogSpreadEditor
            key={field.id}
            index={index}
            leftImage={watch(`spreads.${index}.left_image`)}
            rightImage={watch(`spreads.${index}.right_image`)}
            links={watch(`spreads.${index}.links`) ?? []}
            productSlugs={productSlugs}
            onLeftImageChange={(path) =>
              setValue(`spreads.${index}.left_image`, path, { shouldDirty: true })
            }
            onRightImageChange={(path) =>
              setValue(`spreads.${index}.right_image`, path, { shouldDirty: true })
            }
            onLinksChange={(links) =>
              setValue(`spreads.${index}.links`, links, { shouldDirty: true })
            }
            onRemove={() => remove(index)}
            onMoveUp={index > 0 ? () => move(index, index - 1) : undefined}
            onMoveDown={
              index < fields.length - 1 ? () => move(index, index + 1) : undefined
            }
          />
        ))}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Kaydediliyor…" : isEdit ? "Güncelle" : "Oluştur"}
      </Button>
    </form>
  );
}
