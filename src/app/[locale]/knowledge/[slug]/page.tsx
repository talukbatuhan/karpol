import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/data/knowledge-base";
import styles from "../knowledge.module.css";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | KARPOL",
    };
  }

  return {
    title: `${article.title} | KARPOL Knowledge Base`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className={styles.section}>
      <div className="container">
        <div className={styles.articleContainer}>
          <Link href="/knowledge" className={styles.backLink}>
            ← Back to Knowledge Base
          </Link>

          <header className={styles.articleHeader}>
            <span className="eyebrow" style={{ color: "#ea580c" }}>
              {article.category}
            </span>
            <h1 className={styles.articleTitle}>{article.title}</h1>
            <div className={styles.articleMeta}>
              <span>{article.publishedAt}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
          </header>

          <article
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          <div style={{ marginTop: "64px", borderTop: "1px solid #e2e8f0", paddingTop: "32px" }}>
             <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>Need specific advice?</h3>
             <p style={{ color: "#64748b", marginBottom: "24px" }}>
               Our engineering team can help you select the perfect material for your project.
             </p>
             <Link href="/contact" className="cta-button" style={{ display: "inline-block", padding: "12px 24px", background: "#1e293b", color: "white", borderRadius: "4px", fontWeight: "600", textDecoration: "none" }}>
               Ask an Engineer
             </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
