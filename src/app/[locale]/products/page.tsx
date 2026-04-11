import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import styles from "./products.module.css";
import { productCategories } from "@/lib/config";

export const metadata: Metadata = {
  title: "Industrial Components & Spare Parts | KARPOL",
  description:
    "Explore our extensive catalog of polyurethane rollers, Vulkollan wheels, rubber seals, and custom engineered components for marble machinery and industrial automation.",
};

// Map simplified descriptions for the listing page
const categoryDescriptions: Record<string, string> = {
  "polyurethane-components":
    "High-load bearing rollers, wheels, and linings with exceptional abrasion resistance.",
  "vulkollan-components":
    "Premium Bayer Vulkollan® elastomers for extreme dynamic loads and durability.",
  "rubber-components":
    "Precision molded O-rings, gaskets, bellows, and vibration dampeners (NBR, EPDM).",
  "technical-plastics":
    "Machined gears, bushings, and wear plates from POM, PA6, PE1000, and PTFE.",
  "aluminum-machined-parts":
    "CNC milled and turned aluminum housings, brackets, and structural components.",
  "chrome-plated-components":
    "Hard chrome plated shafts and rollers for corrosion resistance and surface hardness.",
  "custom-engineered-parts":
    "Bespoke manufacturing from technical drawings. Mold design and prototyping.",
  "vacuum-handling-components":
    "Suction cups, vacuum pads, and seals for stone and glass handling systems.",
  "conveyor-transport-parts":
    "Drive pulleys, idlers, and conveyor belts for heavy-duty material transport.",
  "marble-machine-spare-parts":
    "Direct replacement parts for Simec, Breton, Gaspari, and other major stone machinery.",
};

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  // In a real app, we would useTranslations here.
  // const t = await getTranslations("Products");

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <span className={styles.heroEyebrow}>Engineering Database</span>
            <h1 className={styles.heroTitle}>
              Industrial Component Library
            </h1>
            <p className={styles.heroDescription}>
              Browse our comprehensive catalog of high-performance elastomer and
              metal components. Engineered for durability, precision, and global standards.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats Strip */}
      <div className={`${styles.container} ${styles.statsStripWrap}`}>
        <div className={styles.featuresStrip}>
          <div className={styles.featureItem}>
            <span className={styles.featureLabel}>Material Range</span>
            <span className={styles.featureValue}>PU, Rubber, Silicone, PTFE</span>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureLabel}>Hardness Scale</span>
            <span className={styles.featureValue}>20 Shore A — 75 Shore D</span>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureLabel}>Manufacturing</span>
            <span className={styles.featureValue}>Casting, CNC, Molding</span>
          </div>
          <div className={styles.featureItem}>
            <span className={styles.featureLabel}>Quality</span>
            <span className={styles.featureValue}>ISO 9001:2015 Certified</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Product Categories</h2>
            <Link href="/contact" className={`${styles.link} ${styles.sectionHeaderLink}`}>
              Request Full Catalog
            </Link>
          </div>
          
          <div className={styles.grid}>
            {productCategories.map((category) => (
              <Link
                key={category.slug}
                href={{ pathname: "/products/[category]", params: { category: category.slug } }}
                className={styles.card}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>{category.icon}</div>
                  <span className={styles.prefix}>{category.prefix}</span>
                </div>
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{category.name}</h2>
                  <p className={styles.cardDesc}>
                    {categoryDescriptions[category.slug] ||
                      "High-performance industrial components."}
                  </p>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.link}>Browse {category.name.split(' ')[0]}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
