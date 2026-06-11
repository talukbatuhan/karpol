import { CategoryForm } from "@/components/admin/CategoryForm";
import { listCategoriesAdmin } from "@/lib/actions/category-actions";

export default async function AdminCategoryNewPage() {
  const categories = await listCategoriesAdmin();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold text-navy-950">
        Yeni kategori
      </h1>
      <CategoryForm categories={categories} />
    </div>
  );
}
