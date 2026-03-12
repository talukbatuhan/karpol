import { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/data/knowledge-base";
import styles from "./knowledge.module.css";

export const metadata: Metadata = {
  title: "Knowledge Base | KARPOL Industrial Engineering",
  description:
    "Technical guides, material selection tips, and maintenance best practices for polyurethane and rubber components.",
};

export default function KnowledgePage() {
  const articles = getAllArticles();

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
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/knowledge/${article.slug}`}
              className={styles.card}
            >
              <div className={styles.cardContent}>
                <div className={styles.meta}>
                  <span className={styles.category}>{article.category}</span>
                  <span>{article.readTime}</span>
                </div>
                <h2 className={styles.cardTitle}>{article.title}</h2>
                <p className={styles.excerpt}>{article.excerpt}</p>
                <span className={styles.readMore}>Read Article →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
