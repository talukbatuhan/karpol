import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getCategoryAdmin, listCategoriesAdmin } from "@/lib/actions/category-actions";

type Props = { params: Promise<{ id: string }> };

export default async function AdminCategoryEditPage({ params }: Props) {
  const { id } = await params;
  const [category, categories] = await Promise.all([
    getCategoryAdmin(id),
    listCategoriesAdmin(),
  ]);
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold text-navy-950">
        Düzenle: {category.name_tr}
      </h1>
      <CategoryForm category={category} categories={categories} />
    </div>
  );
}
