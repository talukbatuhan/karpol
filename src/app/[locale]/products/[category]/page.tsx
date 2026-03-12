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
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link href="/products" className={styles.backLink}>
              ← Back to All Categories
            </Link>
          </div>
          <div className={styles.headerContent}>
            <span className={styles.eyebrow}>Product Category</span>
            <h1 className={styles.title}>{categoryData.name}</h1>
            <p className={styles.description}>
              {categoryData.description || "High-performance industrial components engineered for durability and precision. Browse our selection below."}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.layout}>
            {/* Sidebar Filters */}
            <aside className={styles.filters}>
              <div className={styles.filterHeader}>
                <span className={styles.filterHeading}>Filters</span>
                <button className={styles.resetBtn}>Reset</button>
              </div>

              <div className={styles.filterGroup}>
                <h3 className={styles.filterTitle}>Material</h3>
                <div className={styles.filterList}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} /> Polyurethane
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} /> Vulkollan®
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} /> Rubber (NBR)
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} /> Silicone
                  </label>
                </div>
              </div>

              <div className={styles.filterGroup}>
                <h3 className={styles.filterTitle}>Hardness</h3>
                <div className={styles.filterList}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} /> 60-70 Shore A
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} /> 80-90 Shore A
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} /> 95+ Shore A
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} /> 55-75 Shore D
                  </label>
                </div>
              </div>

              <div className={styles.filterGroup}>
                <h3 className={styles.filterTitle}>Application</h3>
                <div className={styles.filterList}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} /> Heavy Load
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} /> High Speed
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} /> High Temp
                  </label>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className={styles.mainContent}>
              <div className={styles.gridHeader}>
                <span className={styles.resultCount}>Showing {products.length} Results</span>
                {/* Sorting dropdown could go here */}
              </div>

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
                          {product.description || "Industrial grade component designed for maximum durability and precision."}
                        </p>
                        <div className={styles.meta}>
                          {product.sku && <span className={styles.badge}>SKU: {product.sku}</span>}
                          {product.material && <span className={styles.badge}>{product.material}</span>}
                        </div>
                        <div className={styles.viewBtn}>View Specs</div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div style={{ gridColumn: "1 / -1", padding: "64px", textAlign: "center", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                    <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>No products found</h3>
                    <p style={{ color: "#64748b" }}>We are currently updating this category. Please check back soon.</p>
                  </div>
                )}
              </div>

              {/* Pagination (Static for now) */}
              {products.length > 0 && (
                <div className={styles.pagination}>
                  <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                  <button className={styles.pageBtn}>2</button>
                  <button className={styles.pageBtn}>3</button>
                  <button className={styles.pageBtn}>→</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
