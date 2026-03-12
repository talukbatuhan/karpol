import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About KARPOL | Industrial Manufacturing Excellence",
  description:
    "Learn about KARPOL's history, manufacturing capabilities, and commitment to quality. Serving global industries with precision polyurethane and rubber components since 1995.",
};

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className="eyebrow">Our Story</span>
            <h1 className={styles.heroTitle}>
              Precision Engineering for a Moving World
            </h1>
            <p className={styles.heroText}>
              For over three decades, KARPOL has been a trusted partner for
              industries requiring high-performance elastomer components. We
              don't just manufacture parts; we engineer solutions that keep your
              machinery running.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.imagePlaceholder}>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "48px" }}>🏭</span>
                <p>Factory Image Placeholder</p>
              </div>
            </div>
            <div>
              <span className="eyebrow">Who We Are</span>
              <h2 className={styles.sectionTitle}>
                A Legacy of Material Science
              </h2>
              <p className={styles.text}>
                Founded in Istanbul, KARPOL began as a specialized workshop for
                industrial rubber components. Today, we operate a
                state-of-the-art facility equipped with advanced CNC machining
                centers, automated casting lines, and a dedicated R&D laboratory.
              </p>
              <p className={styles.text}>
                Our expertise spans across Polyurethane (Vulkollan®), Rubber,
                Silicone, and Engineering Plastics. We serve diverse sectors
                including mining, construction, textile, and automation,
                exporting to over 50 countries worldwide.
              </p>
              <div className={styles.certGrid}>
                <div className={styles.certItem}>
                  <span className={styles.certYear}>SINCE 1998</span>
                  <span className={styles.certName}>ISO 9001:2015</span>
                </div>
                <div className={styles.certItem}>
                  <span className={styles.certYear}>CERTIFIED</span>
                  <span className={styles.certName}>OHSAS 18001</span>
                </div>
                <div className={styles.certItem}>
                  <span className={styles.certYear}>PARTNER</span>
                  <span className={styles.certName}>Covestro Licensed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section
        className={styles.section}
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div className="container">
          <span className="eyebrow">Our Philosophy</span>
          <h2 className={styles.sectionTitle}>Driven by Core Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🛡️</div>
              <h3 className={styles.valueTitle}>Uncompromising Quality</h3>
              <p className={styles.valueText}>
                Quality is not just a department; it's embedded in every step of
                our process. From raw material selection to final inspection, we
                adhere to strict international standards.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🔬</div>
              <h3 className={styles.valueTitle}>Continuous Innovation</h3>
              <p className={styles.valueText}>
                We invest heavily in R&D to develop new formulations that withstand
                higher loads, extreme temperatures, and aggressive chemicals.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🤝</div>
              <h3 className={styles.valueTitle}>Customer Partnership</h3>
              <p className={styles.valueText}>
                We view our clients as partners. Our engineering team works
                closely with you to optimize designs for better performance and
                cost-efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section className={styles.section}>
        <div className="container">
          <div
            style={{
              textAlign: "center",
              maxWidth: "800px",
              margin: "0 auto 48px",
            }}
          >
            <span className="eyebrow">Global Presence</span>
            <h2 className={styles.sectionTitle}>
              Exporting Excellence Worldwide
            </h2>
            <p className={styles.text}>
              From Europe to Asia, KARPOL components are trusted by leading OEM
              manufacturers and maintenance teams in over 50 countries.
            </p>
          </div>
          <div
            style={{
              height: "500px",
              background: "#e2e8f0",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            Interactive World Map Placeholder
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className={styles.section}
        style={{ background: "#1e293b", color: "#ffffff", textAlign: "center" }}
      >
        <div className="container">
          <h2
            className={styles.sectionTitle}
            style={{ color: "#ffffff", marginBottom: "24px" }}
          >
            Join Our Network
          </h2>
          <p
            className={styles.text}
            style={{ color: "#cbd5e1", maxWidth: "600px", margin: "0 auto 32px" }}
          >
            Looking for a reliable manufacturing partner? Let's discuss how we
            can support your supply chain.
          </p>
          <Link
            href="/contact"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              background: "#ea580c",
              color: "#ffffff",
              fontWeight: "700",
              borderRadius: "4px",
              textDecoration: "none",
            }}
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </main>
  );
}
