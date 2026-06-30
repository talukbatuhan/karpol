import Link from "next/link";
import { listProductsAdmin } from "@/actions/product-actions";
import { listCategoriesAdmin } from "@/actions/category-actions";
import { ProductTable } from "@/components/admin/ProductTable";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    listProductsAdmin(),
    listCategoriesAdmin(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-950">Ürünler</h1>
          <p className="mt-1 text-sm text-navy-800/70">
            {products.length} ürün listeleniyor — kategorilere göre yönetin, yayınlayın veya
            taslak olarak saklayın.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="border border-gold-500 bg-gold-500 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-navy-950"
        >
          Yeni ürün
        </Link>
      </div>
      <ProductTable products={products} categories={categories} />
    </div>
  );
}

