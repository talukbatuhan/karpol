import Link from "next/link";
import { listCategoriesAdmin } from "@/lib/actions/category-actions";
import { CategoryTable } from "@/components/admin/CategoryTable";

export default async function AdminCategoriesPage() {
  const categories = await listCategoriesAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy-950">
            Kategoriler
          </h1>
          <p className="mt-1 text-sm text-navy-800/70">
            Ürün kategorilerini oluşturun, hiyerarşi kurun ve sıralayın.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="border border-gold-500 bg-gold-500 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-navy-950"
        >
          Yeni kategori
        </Link>
      </div>
      <CategoryTable categories={categories} />
    </div>
  );
}
