import { Metadata } from "next";
import Link from "next/link";
import { getPublishedArticles } from "@/lib/data/public-data";
import { getLocalizedField } from "@/lib/i18n-helpers";
import styles from "./knowledge.module.css";

export const metadata: Metadata = {
  title: "Knowledge Base | KARPOL Industrial Engineering",
  description:
    "Technical guides, material selection tips, and maintenance best practices for polyurethane and rubber components.",
};

export default async function KnowledgePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { data: articles } = await getPublishedArticles();

  return (
    <main className={styles.section}>
      <div className="container">
        <header className={styles.header}>
          <span className="eyebrow">Engineering Resources</span>
          <h1 className={styles.title}>Knowledge Base</h1>
          <p className={styles.description}>
            Deep dive into material science. Learn how to select the right
            elastomers for your application and extend the lifespan of your
            components.
          </p>
        </header>

        <div className={styles.grid}>
          {articles.length > 0 ? (
            articles.map((article) => (
              <Link
                key={article.slug}
                href={`/${locale}/knowledge/${article.slug}`}
                className={styles.card}
              >
                <div className={styles.cardContent}>
                  <div className={styles.meta}>
                    <span className={styles.category}>{article.category}</span>
                  </div>
                  <h2 className={styles.cardTitle}>{getLocalizedField(article.title, locale)}</h2>
                  <p className={styles.excerpt}>{getLocalizedField(article.excerpt, locale)}</p>
                  <span className={styles.readMore}>Read Article →</span>
                </div>
              </Link>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px' }}>
              <p style={{ fontSize: 18, color: 'var(--text-muted)' }}>
                No articles published yet. Check back soon for technical guides and industry insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
