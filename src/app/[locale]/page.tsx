import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig, productCategories } from "@/lib/config";
import styles from "./page.module.css";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Hero");
  const tNav = await getTranslations("Navigation");

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <span className="eyebrow">KARPOL INDUSTRIAL</span>
          <h1 className={styles.heroTitle}>{t("title")}</h1>
          <p className={styles.heroDescription}>{t("description")}</p>
          <div className={styles.heroActions}>
            <Link href="/products" className={styles.primaryButton}>
              {t("cta_products")}
            </Link>
            <Link href="/contact" className={styles.secondaryButton}>
              {t("cta_quote")}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {siteConfig.stats.yearsExperience}
              </span>
              <span className={styles.statLabel}>Years Experience</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {siteConfig.stats.countriesExported}
              </span>
              <span className={styles.statLabel}>Countries Exported</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {siteConfig.stats.productTypes}
              </span>
              <span className={styles.statLabel}>Unique Parts</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>ISO 9001</span>
              <span className={styles.statLabel}>Certified Quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">Our Solutions</span>
          <h2 className="section-title">Comprehensive Material Expertise</h2>
          <div className={styles.categoriesGrid}>
            {productCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products/${cat.slug}`}
                className={styles.categoryCard}
              >
                <div>
                  <div className={styles.categoryIcon}>{cat.icon}</div>
                  <h3 className={styles.categoryTitle}>{cat.name}</h3>
                  <p className="section-text" style={{ fontSize: "14px", marginTop: "8px" }}>
                    High-performance {cat.name.toLowerCase()} solutions for demanding applications.
                  </p>
                </div>
                <span className={styles.categoryLink}>{tNav("products")} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{ background: "#f8fafc" }}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <div>
              <span className="eyebrow">Why Karpol?</span>
              <h2 className="section-title">Engineered for Performance</h2>
              <p className="section-text">
                We combine decades of material science expertise with advanced
                manufacturing capabilities to deliver components that last longer
                and perform better.
              </p>
              <div style={{ marginTop: "32px" }}>
                <Link href="/about" className={styles.secondaryButton}>
                  Learn About Our Factory
                </Link>
              </div>
            </div>
            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🛡️</div>
                <div className={styles.featureContent}>
                  <h3>Premium Materials</h3>
                  <p>
                    We use only high-grade raw materials from trusted global
                    suppliers like Covestro and Lanxess.
                  </p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>📐</div>
                <div className={styles.featureContent}>
                  <h3>Custom Engineering</h3>
                  <p>
                    From prototype to mass production, our engineering team
                    designs molds and parts to your exact specifications.
                  </p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🚀</div>
                <div className={styles.featureContent}>
                  <h3>Global Logistics</h3>
                  <p>
                    Fast and reliable shipping network delivering to 50+ countries
                    with proper export documentation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Ready to optimize your machinery?</h2>
          <p className={styles.ctaText}>
            Get a competitive quote for your custom parts or standard components today.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
            <Link
              href="/contact"
              className={styles.primaryButton}
              style={{ background: "#ffffff", color: "#ea580c", border: "none" }}
            >
              {t("cta_quote")}
            </Link>
            <Link
              href="/products"
              className={styles.secondaryButton}
              style={{
                background: "transparent",
                color: "#ffffff",
                borderColor: "#ffffff",
              }}
            >
              {t("cta_products")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
