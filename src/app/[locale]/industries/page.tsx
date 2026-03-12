import Link from "next/link";
import styles from "@/app/listing.module.css";
import { getIndustries } from "@/lib/data/public-data";

export default async function IndustriesPage() {
  const { data: industries, error } = await getIndustries();

  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Industries</span>
        <h1 className="section-title">Industries We Serve</h1>
        <p className="section-text">
          Industry records are loaded from Supabase and prepared for solution
          pages with related products.
        </p>
        {error ? <p className={styles.status}>{error}</p> : null}
        {industries.length > 0 ? (
          <div className={styles.grid}>
            {industries.map((industry) => (
              <article key={industry.id} className={styles.card}>
                <h2 className={styles.cardTitle}>{industry.name}</h2>
                <p className={styles.cardText}>{industry.description}</p>
                <Link
                  href={`/industries/${industry.slug}`}
                  className={styles.link}
                >
                  View Industry
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>
            Henüz endüstri verisi bulunamadı. Supabase seed verisini kontrol edin.
          </p>
        )}
      </div>
    </main>
  );
}
