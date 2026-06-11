import Link from "next/link";
import { listProductsAdmin } from "@/lib/actions/product-actions";
import { listCategoriesAdmin } from "@/lib/actions/category-actions";
import { StatusBadge } from "@/components/admin/StatusBadge";

function countByStatus(
  products: Awaited<ReturnType<typeof listProductsAdmin>>,
  status: "draft" | "published",
) {
  return products.filter((p) => p.status === status).length;
}

export default async function AdminDashboardPage() {
  const [products, categories] = await Promise.all([
    listProductsAdmin(),
    listCategoriesAdmin(),
  ]);

  const recent = products.slice(0, 5);
  const draftCount = countByStatus(products, "draft");
  const publishedCount = countByStatus(products, "published");

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-navy-950">Dashboard</h1>
        <p className="mt-2 text-sm text-navy-800/70">
          Ürün, kategori ve içerik özeti
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Toplam ürün" value={products.length} />
        <StatCard label="Yayında" value={publishedCount} />
        <StatCard label="Taslak" value={draftCount} />
        <StatCard label="Kategori" value={categories.length} href="/admin/categories" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <QuickLink href="/admin/products/new" label="Yeni ürün" />
        <QuickLink href="/admin/categories/new" label="Yeni kategori" />
        <QuickLink href="/admin/files" label="Dosya yöneticisi" />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-navy-800">
            Son güncellenen ürünler
          </h2>
          <Link
            href="/admin/products"
            className="font-mono text-xs uppercase tracking-widest text-gold-600 underline"
          >
            Tüm ürünler →
          </Link>
        </div>
        <ul className="divide-y divide-navy-800/10 border border-navy-800/20">
          {recent.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-navy-800/60">
              Henüz ürün yok.
            </li>
          ) : (
            recent.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
              >
                <div>
                  <span className="font-medium">{p.title_tr}</span>
                  <span className="ml-2 font-mono text-xs text-navy-800/50">
                    {p.slug}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase text-navy-800/60">
                    {p.category?.name_tr ?? "—"}
                  </span>
                  <StatusBadge status={p.status} />
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number | string;
  href?: string;
}) {
  const inner = (
    <>
      <p className="font-mono text-xs uppercase tracking-widest text-navy-800/60">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold text-navy-950">{value}</p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block border border-navy-800/20 bg-white p-6 transition-colors hover:border-gold-500/50"
      >
        {inner}
      </Link>
    );
  }

  return <div className="border border-navy-800/20 bg-white p-6">{inner}</div>;
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="border border-navy-800/20 bg-white px-5 py-4 font-mono text-xs uppercase tracking-widest text-navy-800 transition-colors hover:border-gold-500 hover:text-gold-600"
    >
      + {label}
    </Link>
  );
}
