"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  productUpsertSchema,
  type ProductUpsertInput,
} from "@/lib/schemas/product";
import type { CategoryRow } from "@/types/category";
import type { ProductRow } from "@/types/product";
import { createProduct, updateProduct } from "@/actions/product-actions";
import { ProductAssetFields } from "@/components/admin/ProductAssetFields";
import { ProductTechnicalFields } from "@/components/admin/ProductTechnicalFields";
import {
  defaultTechnicalDrawing,
  normalizeProductMetadata,
} from "@/lib/product-technical-defaults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/molecules/FormField";
import { fieldSelectClass } from "@/lib/utils";

function rowToInput(row: ProductRow): ProductUpsertInput {
  const metadata = normalizeProductMetadata(row.metadata);
  return {
    slug: row.slug,
    category_id: row.category_id,
    status: row.status,
    title_tr: row.title_tr,
    title_en: row.title_en,
    description_tr: row.description_tr,
    description_en: row.description_en,
    body_tr: row.body_tr,
    body_en: row.body_en,
    metadata: {
      tool_href: metadata.tool_href ?? "",
      specs: metadata.specs ?? [],
      assets: metadata.assets ?? {},
      technical_drawing: metadata.technical_drawing ?? defaultTechnicalDrawing,
      technical_tables: metadata.technical_tables ?? [],
    },
  };
}

export interface ProductFormProps {
  product?: ProductRow;
  categories: CategoryRow[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(product);

  const defaultCategoryId = categories[0]?.id ?? "";

  const emptyDefaults: ProductUpsertInput = {
    slug: "",
    category_id: defaultCategoryId,
    status: "draft",
    title_tr: "",
    title_en: "",
    description_tr: "",
    description_en: "",
    body_tr: "",
    body_en: "",
    metadata: {
      tool_href: "",
      specs: [],
      assets: {},
      technical_drawing: { ...defaultTechnicalDrawing },
      technical_tables: [],
    },
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductUpsertInput>({
    resolver: zodResolver(productUpsertSchema),
    defaultValues: product ? rowToInput(product) : emptyDefaults,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "metadata.specs",
  });

  async function onSubmit(data: ProductUpsertInput) {
    setError(null);
    try {
      if (isEdit && product) {
        await updateProduct(product.id, data);
        router.push("/admin/products");
        router.refresh();
      } else {
        await createProduct(data);
        router.push("/admin/products");
        router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kayıt başarısız.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
      {error ? (
        <p className="border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {categories.length === 0 ? (
        <p className="border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          Ürün eklemek için önce{" "}
          <a href="/admin/categories/new" className="underline">
            kategori oluşturun
          </a>
          .
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2">
        <FormField label="Slug" error={errors.slug?.message}>
          <Input {...register("slug")} disabled={isEdit} />
        </FormField>
        <FormField label="Kategori" error={errors.category_id?.message}>
          <select
            {...register("category_id")}
            className={fieldSelectClass}
            disabled={categories.length === 0}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_tr}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Durum">
          <select {...register("status")} className={fieldSelectClass}>
            <option value="draft">Taslak</option>
            <option value="published">Yayında</option>
          </select>
        </FormField>
        <FormField label="Araç linki (tool_href)" className="sm:col-span-2">
          <Input {...register("metadata.tool_href")} />
        </FormField>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="col-span-full font-mono text-xs uppercase tracking-widest text-gold-600">
          Türkçe
        </h2>
        <FormField label="Başlık" className="sm:col-span-2">
          <Input {...register("title_tr")} />
        </FormField>
        <FormField label="Özet" className="sm:col-span-2">
          <Input {...register("description_tr")} />
        </FormField>
        <FormField label="Gövde" className="sm:col-span-2">
          <Textarea {...register("body_tr")} rows={4} />
        </FormField>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="col-span-full font-mono text-xs uppercase tracking-widest text-gold-600">
          English
        </h2>
        <FormField label="Title" className="sm:col-span-2">
          <Input {...register("title_en")} />
        </FormField>
        <FormField label="Summary" className="sm:col-span-2">
          <Input {...register("description_en")} />
        </FormField>
        <FormField label="Body" className="sm:col-span-2">
          <Textarea {...register("body_en")} rows={4} />
        </FormField>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-gold-600">
            Özellikler (specs)
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              append({
                label_tr: "",
                label_en: "",
                value_tr: "",
                value_en: "",
              })
            }
            className="font-mono text-xs uppercase tracking-widest"
          >
            + Satır ekle
          </Button>
        </div>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid gap-2 border border-border p-4 sm:grid-cols-2"
          >
            <FormField
              label="Etiket TR"
              error={errors.metadata?.specs?.[index]?.label_tr?.message}
            >
              <Input {...register(`metadata.specs.${index}.label_tr`)} />
            </FormField>
            <FormField
              label="Label EN"
              error={errors.metadata?.specs?.[index]?.label_en?.message}
            >
              <Input {...register(`metadata.specs.${index}.label_en`)} />
            </FormField>
            <FormField
              label="Değer TR"
              error={errors.metadata?.specs?.[index]?.value_tr?.message}
            >
              <Input {...register(`metadata.specs.${index}.value_tr`)} />
            </FormField>
            <FormField
              label="Value EN"
              error={errors.metadata?.specs?.[index]?.value_en?.message}
            >
              <Input {...register(`metadata.specs.${index}.value_en`)} />
            </FormField>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
              className="justify-start font-mono text-xs uppercase text-destructive sm:col-span-2"
            >
              Satırı kaldır
            </Button>
          </div>
        ))}
      </section>

      <ProductAssetFields register={register} watch={watch} setValue={setValue} />

      <ProductTechnicalFields
        register={register}
        control={control}
        watch={watch}
        setValue={setValue}
        errors={errors.metadata}
      />

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting || categories.length === 0}
          className="font-mono text-xs uppercase tracking-widest"
        >
          {isSubmitting ? "Kaydediliyor…" : isEdit ? "Güncelle" : "Oluştur"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="font-mono text-xs uppercase tracking-widest"
        >
          İptal
        </Button>
      </div>
    </form>
  );
}
