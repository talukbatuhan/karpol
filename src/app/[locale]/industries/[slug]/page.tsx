import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getIndustryBySlug } from "@/lib/data/public-data";
import { getLocalizedField, getLocalizedArray } from "@/lib/i18n-helpers";
import styles from "../industries.module.css";

type IndustryDetailProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: IndustryDetailProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const { data: industry } = await getIndustryBySlug(slug);

  if (!industry) return { title: "Industry Not Found | KARPOL" };

  const name = getLocalizedField(industry.name, locale);
  const desc = getLocalizedField(industry.description, locale);

  return {
    title: `${name} | KARPOL Industrial Solutions`,
    description: desc,
  };
}

export default async function IndustryDetailPage({ params }: IndustryDetailProps) {
  const { slug, locale } = await params;
  const { data: industry, error } = await getIndustryBySlug(slug);

  if (error || !industry) notFound();

  const name = getLocalizedField(industry.name, locale);
  const desc = getLocalizedField(industry.description, locale);
  const challenges = getLocalizedArray(industry.challenges, locale);
  const solutions = getLocalizedArray(industry.solutions, locale);

  return (
    <main>
      <header className={`${styles.header} ${styles.headerDetail}`}>
        <div className="container">
          <Link href={`/${locale}/industries`} className={styles.backLink}>
            ← All Industries
          </Link>
          <h1 className={`section-title ${styles.titleSpaced}`}>{name}</h1>
          <p className="section-text">{desc}</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className={styles.twoCol}>
            <div>
              <h2 className={styles.sectionHeading}>Industry Challenges</h2>
              <div className={styles.itemStack}>
                {challenges.map((challenge, i) => (
                  <div key={i} className={styles.challengeItem}>
                    <span aria-hidden>⚠️</span>
                    {challenge}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className={styles.sectionHeading}>Our Solutions</h2>
              <div className={styles.itemStack}>
                {solutions.map((solution, i) => (
                  <div key={i} className={styles.solutionItem}>
                    <span aria-hidden>✅</span>
                    {solution}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.ctaPanel}>
            <h3 className={styles.ctaHeading}>Need custom components for {name.toLowerCase()}?</h3>
            <p className={styles.ctaSubtext}>
              Our engineering team specializes in designing components that solve the specific challenges of your industry.
            </p>
            <Link href={`/${locale}/contact`} className={styles.ctaButton}>
              Contact Engineering Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
