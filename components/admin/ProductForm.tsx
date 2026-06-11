"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  productUpsertSchema,
  type ProductUpsertInput,
} from "@/lib/schemas/product";
import type { CategoryRow } from "@/lib/types/category";
import type { ProductRow } from "@/lib/types/product";
import { createProduct, updateProduct } from "@/lib/actions/product-actions";

function rowToInput(row: ProductRow): ProductUpsertInput {
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
      tool_href: row.metadata?.tool_href ?? "",
      specs: row.metadata?.specs ?? [],
      assets: row.metadata?.assets ?? {},
    },
  };
}

type ProductFormProps = {
  product?: ProductRow;
  categories: CategoryRow[];
};

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
    metadata: { tool_href: "", specs: [], assets: {} },
  };

  const {
    register,
    control,
    handleSubmit,
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

  const inputClass =
    "mt-1 w-full border border-navy-800/30 bg-white px-3 py-2 text-sm text-navy-950 focus:border-gold-500 focus:outline-none";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
      {error ? (
        <p className="rounded border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {categories.length === 0 ? (
        <p className="rounded border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          Ürün eklemek için önce{" "}
          <a href="/admin/categories/new" className="underline">
            kategori oluşturun
          </a>
          .
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-navy-800">
            Slug
          </span>
          <input
            {...register("slug")}
            disabled={isEdit}
            className={inputClass}
          />
          {errors.slug ? (
            <span className="text-xs text-red-600">{errors.slug.message}</span>
          ) : null}
        </label>
        <label className="block text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-navy-800">
            Kategori
          </span>
          <select
            {...register("category_id")}
            className={inputClass}
            disabled={categories.length === 0}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_tr}
              </option>
            ))}
          </select>
          {errors.category_id ? (
            <span className="text-xs text-red-600">
              {errors.category_id.message}
            </span>
          ) : null}
        </label>
        <label className="block text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-navy-800">
            Durum
          </span>
          <select {...register("status")} className={inputClass}>
            <option value="draft">Taslak</option>
            <option value="published">Yayında</option>
          </select>
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-mono text-xs uppercase tracking-widest text-navy-800">
            Araç linki (tool_href)
          </span>
          <input {...register("metadata.tool_href")} className={inputClass} />
        </label>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="col-span-full font-mono text-xs uppercase tracking-widest text-gold-600">
          Türkçe
        </h2>
        <label className="block text-sm sm:col-span-2">
          <span className="font-mono text-xs uppercase tracking-widest">Başlık</span>
          <input {...register("title_tr")} className={inputClass} />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-mono text-xs uppercase tracking-widest">Özet</span>
          <input {...register("description_tr")} className={inputClass} />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-mono text-xs uppercase tracking-widest">Gövde</span>
          <textarea {...register("body_tr")} rows={4} className={inputClass} />
        </label>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="col-span-full font-mono text-xs uppercase tracking-widest text-gold-600">
          English
        </h2>
        <label className="block text-sm sm:col-span-2">
          <span className="font-mono text-xs uppercase tracking-widest">Title</span>
          <input {...register("title_en")} className={inputClass} />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-mono text-xs uppercase tracking-widest">Summary</span>
          <input {...register("description_en")} className={inputClass} />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-mono text-xs uppercase tracking-widest">Body</span>
          <textarea {...register("body_en")} rows={4} className={inputClass} />
        </label>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-gold-600">
            Özellikler (specs)
          </h2>
          <button
            type="button"
            onClick={() =>
              append({
                label_tr: "",
                label_en: "",
                value_tr: "",
                value_en: "",
              })
            }
            className="font-mono text-xs uppercase tracking-widest text-navy-800 underline"
          >
            + Satır ekle
          </button>
        </div>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid gap-2 rounded border border-navy-800/15 p-4 sm:grid-cols-2"
          >
            <input
              {...register(`metadata.specs.${index}.label_tr`)}
              placeholder="Etiket TR"
              className={inputClass}
            />
            <input
              {...register(`metadata.specs.${index}.label_en`)}
              placeholder="Label EN"
              className={inputClass}
            />
            <input
              {...register(`metadata.specs.${index}.value_tr`)}
              placeholder="Değer TR"
              className={inputClass}
            />
            <input
              {...register(`metadata.specs.${index}.value_en`)}
              placeholder="Value EN"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="sm:col-span-2 text-left font-mono text-xs uppercase text-red-700"
            >
              Satırı kaldır
            </button>
          </div>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <h2 className="col-span-full font-mono text-xs uppercase tracking-widest text-gold-600">
          Dosya yolları (storage)
        </h2>
        <label className="block text-sm">
          <span className="font-mono text-xs uppercase tracking-widest">Görsel</span>
          <input {...register("metadata.assets.image")} className={inputClass} />
        </label>
        <label className="block text-sm">
          <span className="font-mono text-xs uppercase tracking-widest">CAD</span>
          <input {...register("metadata.assets.cad")} className={inputClass} />
        </label>
        <label className="block text-sm">
          <span className="font-mono text-xs uppercase tracking-widest">PDF</span>
          <input {...register("metadata.assets.pdf")} className={inputClass} />
        </label>
      </section>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting || categories.length === 0}
          className="border border-gold-500 bg-gold-500 px-6 py-3 font-mono text-xs uppercase tracking-widest text-navy-950 disabled:opacity-50"
        >
          {isSubmitting ? "Kaydediliyor…" : isEdit ? "Güncelle" : "Oluştur"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-navy-800/30 px-6 py-3 font-mono text-xs uppercase tracking-widest text-navy-800"
        >
          İptal
        </button>
      </div>
    </form>
  );
}
