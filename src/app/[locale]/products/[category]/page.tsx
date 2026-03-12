import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductCategoryBySlug, getProductsByCategorySlug } from "@/lib/data/public-data";
import styles from "./category.module.css";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const { data: categoryData } = await getProductCategoryBySlug(category);

  if (!categoryData) {
    return {
      title: "Category Not Found | KARPOL",
    };
  }

  return {
    title: `${categoryData.name} | KARPOL Industrial Products`,
    description: categoryData.description || `Explore our high-performance ${categoryData.name} range.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const { data: categoryData, error: categoryError } = await getProductCategoryBySlug(category);
  const { data: products, error: productsError } = await getProductsByCategorySlug(category);

  if (categoryError || !categoryData) {
    notFound();
  }

  return (
    <main>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/products" className="back-link" style={{ marginBottom: "24px", display: "inline-block", fontSize: "14px", fontWeight: "600", color: "#64748b" }}>
            ← Back to All Categories
          </Link>
          <span className={styles.eyebrow}>Product Category</span>
          <h1 className={styles.title}>{categoryData.name}</h1>
          <p className={styles.description}>
            {categoryData.description || "High-performance industrial components engineered for durability and precision."}
          </p>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.layout}>
            {/* Sidebar Filters */}
            <aside className={styles.filters}>
              <div className={styles.filterGroup}>
                <h3 className={styles.filterTitle}>Material</h3>
                <ul className={styles.filterList}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} /> Polyurethane
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} /> Vulkollan®
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} /> Rubber (NBR)
                  </label>
                </ul>
              </div>

              <div className={styles.filterGroup}>
                <h3 className={styles.filterTitle}>Hardness</h3>
                <ul className={styles.filterList}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} /> 60-70 Shore A
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} /> 80-90 Shore A
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} /> 95+ Shore A
                  </label>
                </ul>
              </div>
            </aside>

            {/* Products Grid */}
            <div className={styles.grid}>
              {products.length > 0 ? (
                products.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/products/${category}/${product.slug}`}
                    className={styles.card}
                  >
                    <div className={styles.imageFrame}>
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className={styles.image}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", flexDirection: "column", gap: "8px" }}>
                          <span style={{ fontSize: "32px" }}>📷</span>
                          <span style={{ fontSize: "12px", fontWeight: "600" }}>NO IMAGE</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.content}>
                      <h3 className={styles.productTitle}>{product.name}</h3>
                      <p className={styles.productDesc}>
                        {product.description || "Industrial grade component. Click to view technical specifications."}
                      </p>
                      <div className={styles.meta}>
                        {product.sku && <span className={styles.badge}>SKU: {product.sku}</span>}
                        {product.material && <span className={styles.badge}>{product.material}</span>}
                      </div>
                      <div className={styles.viewBtn}>View Technical Details</div>
                    </div>
                  </Link>
                ))
              ) : (
                <div style={{ gridColumn: "1 / -1", padding: "64px", textAlign: "center", background: "white", border: "1px solid #e2e8f0" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>No products found</h3>
                  <p style={{ color: "#64748b" }}>We are currently updating this category. Please check back soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
