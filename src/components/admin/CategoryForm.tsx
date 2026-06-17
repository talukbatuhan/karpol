"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import {
  categoryUpsertSchema,
  type CategoryUpsertInput,
} from "@/lib/schemas/category";
import type { CategoryRow } from "@/types/category";
import { createCategory, updateCategory } from "@/actions/category-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/molecules/FormField";
import { fieldSelectClass } from "@/lib/utils";

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

export interface CategoryFormProps {
  category?: CategoryRow;
  categories: CategoryRow[];
}

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
      {error ? (
        <p className="border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Slug" className="sm:col-span-2">
          <Input
            {...register("slug")}
            disabled={isEdit}
            placeholder="ornek-kategori"
          />
        </FormField>

        <FormField label="Ad (TR)">
          <Input {...register("name_tr")} />
        </FormField>

        <FormField label="Name (EN)">
          <Input {...register("name_en")} />
        </FormField>

        <FormField label="Üst kategori">
          <select {...register("parent_id")} className={fieldSelectClass}>
            <option value="">— Yok (kök) —</option>
            {parentOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_tr}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Sıra">
          <Input
            type="number"
            {...register("sort_order", { valueAsNumber: true })}
            min={0}
          />
        </FormField>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
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
