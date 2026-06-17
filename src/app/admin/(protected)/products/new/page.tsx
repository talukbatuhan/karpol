import { ProductForm } from "@/components/admin/ProductForm";
import { listCategoriesAdmin } from "@/actions/category-actions";

export default async function AdminProductNewPage() {
  const categories = await listCategoriesAdmin();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold text-navy-950">Yeni ürün</h1>
      <ProductForm categories={categories} />
    </div>
  );
}

