import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductAdmin } from "@/lib/actions/product-actions";
import { listCategoriesAdmin } from "@/lib/actions/category-actions";

type Props = { params: Promise<{ id: string }> };

export default async function AdminProductEditPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductAdmin(id),
    listCategoriesAdmin(),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold text-navy-950">
        Düzenle: {product.title_tr}
      </h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
