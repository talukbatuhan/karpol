"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import {
  categoryUpsertSchema,
  type CategoryUpsertInput,
} from "@/lib/schemas/category";
import type { CategoryRow } from "@/lib/types/category";
import { createCategory, updateCategory } from "@/lib/actions/category-actions";

type CategoryFormValues = {
  slug: string;
  name_tr: string;
  name_en: string;
  parent_id: string;
  sort_order: number;
};

function rowToFormValues(row: CategoryRow): CategoryFormValues {
  return {
    slug: row.slug,
    name_tr: row.name_tr,
    name_en: row.name_en,
    parent_id: row.parent_id ?? "",
    sort_order: row.sort_order,
  };
}

const emptyDefaults: CategoryFormValues = {
  slug: "",
  name_tr: "",
  name_en: "",
  parent_id: "",
  sort_order: 0,
};

type CategoryFormProps = {
  category?: CategoryRow;
  categories: CategoryRow[];
};

export function CategoryForm({ category, categories }: CategoryFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(category);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CategoryFormValues>({
    defaultValues: category ? rowToFormValues(category) : emptyDefaults,
  });

  const parentOptions = categories.filter((c) => c.id !== category?.id);

  async function onSubmit(raw: CategoryFormValues) {
    setError(null);
    let data: CategoryUpsertInput;
    try {
      data = categoryUpsertSchema.parse({
        ...raw,
        parent_id: raw.parent_id.length > 0 ? raw.parent_id : null,
        sort_order: Number.isFinite(raw.sort_order) ? raw.sort_order : 0,
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.issues[0]?.message ?? "Geçersiz alan değeri.");
        return;
      }
      throw e;
    }
    try {
      if (isEdit && category) {
        await updateCategory(category.id, data);
      } else {
        await createCategory(data);
      }
      router.push("/admin/categories");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kayıt başarısız.");
    }
  }

  const inputClass =
    "mt-1 w-full border border-navy-800/30 bg-white px-3 py-2 text-sm text-navy-950 focus:border-gold-500 focus:outline-none";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
      {error ? (
        <p className="rounded border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="font-mono text-xs uppercase tracking-widest text-navy-800">
            Slug
          </span>
          <input
            {...register("slug")}
            disabled={isEdit}
            placeholder="ornek-kategori"
            className={inputClass}
          />
        </label>

        <label className="block text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-navy-800">
            Ad (TR)
          </span>
          <input {...register("name_tr")} className={inputClass} />
        </label>

        <label className="block text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-navy-800">
            Name (EN)
          </span>
          <input {...register("name_en")} className={inputClass} />
        </label>

        <label className="block text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-navy-800">
            Üst kategori
          </span>
          <select {...register("parent_id")} className={inputClass}>
            <option value="">— Yok (kök) —</option>
            {parentOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_tr}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-navy-800">
            Sıra
          </span>
          <input
            type="number"
            {...register("sort_order", { valueAsNumber: true })}
            min={0}
            className={inputClass}
          />
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
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
