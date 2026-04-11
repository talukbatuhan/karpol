import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/data/public-data";
import { getLocalizedField } from "@/lib/i18n-helpers";
import styles from "../knowledge.module.css";

type ArticlePageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const { data: article } = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found | KARPOL" };
  }

  const title = getLocalizedField(article.title, locale);
  const excerpt = getLocalizedField(article.excerpt, locale);

  return {
    title: `${title} | KARPOL Knowledge Base`,
    description: excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug, locale } = await params;
  const { data: article, error } = await getArticleBySlug(slug);

  if (error || !article) {
    notFound();
  }

  const title = getLocalizedField(article.title, locale);
  const excerpt = getLocalizedField(article.excerpt, locale);
  const content = getLocalizedField(article.content, locale);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    author: { "@type": "Organization", name: article.author || "KARPOL" },
    datePublished: article.published_at,
    dateModified: article.updated_at,
    publisher: {
      "@type": "Organization",
      name: "KARPOL Industrial",
      url: "https://karpol.net",
    },
  };

  return (
    <main className={styles.section}>
      <div className="container">
        <div className={styles.articleContainer}>
          <Link href={`/${locale}/knowledge`} className={styles.backLink}>
            ← Back to Knowledge Base
          </Link>

          <header className={styles.articleHeader}>
            <span className={`eyebrow ${styles.articleCategory}`}>
              {article.category}
            </span>
            <h1 className={styles.articleTitle}>{title}</h1>
            <div className={styles.articleMeta}>
              {article.published_at && (
                <span>{new Date(article.published_at).toLocaleDateString()}</span>
              )}
              {article.author && (
                <>
                  <span>•</span>
                  <span>{article.author}</span>
                </>
              )}
            </div>
          </header>

          {content ? (
            <article
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <article className={styles.content}>
              <p>{excerpt}</p>
            </article>
          )}

          {article.tags && article.tags.length > 0 && (
            <div className={styles.tagsRow}>
              {article.tags.map((tag, i) => (
                <span key={i} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className={styles.articleFooter}>
            <h3 className={styles.ctaTitle}>Need specific advice?</h3>
            <p className={styles.ctaText}>
              Our engineering team can help you select the perfect material for your project.
            </p>
            <Link href={`/${locale}/contact`} className={styles.ctaButton}>
              Ask an Engineer
            </Link>
          </div>
        </div>
      </div>

      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </main>
  );
}
