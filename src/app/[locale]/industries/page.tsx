import { Metadata } from "next";
import Link from "next/link";
import { getIndustries } from "@/lib/data/public-data";
import { getLocalizedField, getLocalizedArray } from "@/lib/i18n-helpers";
import styles from "./industries.module.css";

export const metadata: Metadata = {
  title: "Industry Solutions | KARPOL Industrial",
  description:
    "Custom-engineered components for marble processing, mining, construction, automation, chemical, and food industries.",
};

export default async function IndustriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { data: industries } = await getIndustries();

  return (
    <main>
      <header className={styles.header}>
        <div className="container">
          <span className="eyebrow">Industries We Serve</span>
          <h1 className="section-title">Engineered Solutions by Industry</h1>
          <p className="section-text">
            We design and manufacture custom components tailored to the unique challenges of each industry.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {industries.map((industry) => {
              const name = getLocalizedField(industry.name, locale);
              const desc = getLocalizedField(industry.description, locale);
              const challenges = getLocalizedArray(industry.challenges, locale);

              return (
                <Link
                  key={industry.id}
                  href={`/${locale}/industries/${industry.slug}`}
                  className={styles.card}
                >
                  {industry.is_featured && (
                    <span className={styles.featuredBadge}>Featured</span>
                  )}
                  <h3 className={styles.cardTitle}>{name}</h3>
                  <p className={styles.cardDesc}>{desc}</p>
                  {challenges.length > 0 && (
                    <div className={styles.chips}>
                      {challenges.slice(0, 3).map((ch, i) => (
                        <span key={i} className={styles.chip}>
                          {ch}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className={styles.cardLink}>View Solutions →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
