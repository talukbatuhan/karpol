import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import styles from "./marble.module.css";

export const metadata: Metadata = {
  title: "Marble & Stone Processing Machine Parts | KARPOL",
  description:
    "High-performance polyurethane rollers, seals, and custom components for marble and stone processing machinery. Direct replacement parts for major OEM machines.",
};

const machines = [
  {
    title: "Block Cutting Machines",
    icon: "🏗️",
    parts: ["Guide Rollers", "Belt Scrapers", "Vibration Pads"],
    material: "Vulkolan / PU",
  },
  {
    title: "Gang Saw Machines",
    icon: "🪚",
    parts: ["Blade Holder Linings", "Coolant Seals", "Mounting Pads"],
    material: "Rubber / Viton",
  },
  {
    title: "Polishing Lines",
    icon: "✨",
    parts: ["Polishing Head Pads", "Pressure Plates", "Conveyor Belts"],
    material: "Polyurethane (Shore A 50-95)",
  },
  {
    title: "Slab Processing",
    icon: "🛤️",
    parts: ["Edge Guide Wheels", "Transport Rollers", "Suction Cups"],
    material: "Non-marking PU",
  },
  {
    title: "Wire Saw Machines",
    icon: "⚙️",
    parts: ["Drive Pulleys", "Guide Wheels", "Tensioner Linings"],
    material: "High-friction Rubber",
  },
  {
    title: "CNC Stone Centers",
    icon: "🖥️",
    parts: ["Vacuum Pod Seals", "Tool Holder Grips", "Bellows"],
    material: "Silicone / EPDM",
  },
];

export default function MarbleIndustryPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className="eyebrow">Industry Solutions</span>
            <h1 className={styles.heroTitle}>
              Engineered Components for Stone Processing
            </h1>
            <p className={styles.heroDescription}>
              Minimize downtime and maximize precision with KARPOL's durable replacement parts for marble, granite, and natural stone machinery.
            </p>
            <Link href="/contact?subject=Marble Industry Inquiry" className={styles.primaryButton}>
              Get a Quote for Your Machine
            </Link>
          </div>
        </div>
      </section>

      {/* Machine & Parts Mapping */}
      <section className={styles.section}>
        <div className="container">
          <span className="eyebrow">Machine Compatibility</span>
          <h2 className={styles.sectionTitle}>Parts for Every Stage of Production</h2>
          <p className={styles.sectionText}>
            From the quarry to the final polish, our components are engineered to withstand the abrasive slurry, high pressures, and continuous operation of modern stone processing lines.
          </p>

          <div className={styles.machineGrid}>
            {machines.map((machine) => (
              <div key={machine.title} className={styles.machineCard}>
                <div className={styles.machineIcon}>{machine.icon}</div>
                <h3 className={styles.machineTitle}>{machine.title}</h3>
                <ul className={styles.partList}>
                  {machine.parts.map((part) => (
                    <li key={part} className={styles.partItem}>
                      {part}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: "16px", fontSize: "13px", color: "#64748b" }}>
                  <strong>Key Material:</strong> {machine.material}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why KARPOL */}
      <section className={`${styles.section} ${styles.bgLight}`}>
        <div className="container">
          <div className={styles.advantageGrid}>
            <div>
              <span className="eyebrow">Why Choose KARPOL?</span>
              <h2 className={styles.sectionTitle}>Built for the Stone Industry</h2>
              <div className={styles.advantageList}>
                <div className={styles.advantageItem}>
                  <div className={styles.checkIcon}>✓</div>
                  <div>
                    <h4 className={styles.advantageTitle}>Abrasion Resistance</h4>
                    <p className={styles.advantageDesc}>
                      Special polyurethane formulations developed specifically to resist abrasive stone slurry and diamond grit.
                    </p>
                  </div>
                </div>
                <div className={styles.advantageItem}>
                  <div className={styles.checkIcon}>✓</div>
                  <div>
                    <h4 className={styles.advantageTitle}>OEM Precision</h4>
                    <p className={styles.advantageDesc}>
                      Parts manufactured to exact original equipment tolerances for perfect fit and function.
                    </p>
                  </div>
                </div>
                <div className={styles.advantageItem}>
                  <div className={styles.checkIcon}>✓</div>
                  <div>
                    <h4 className={styles.advantageTitle}>Fast Turnaround</h4>
                    <p className={styles.advantageDesc}>
                      We understand that downtime costs money. Stock parts ship in 24h, custom orders expedited.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ position: "relative", height: "400px", background: "#cbd5e1", borderRadius: "8px", overflow: "hidden" }}>
              {/* Placeholder for an actual industry image */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#64748b" }}>
                Industry Image Placeholder
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Need a Custom Part?</h2>
            <p className={styles.ctaText}>
              We can reverse-engineer worn parts or manufacture from your technical drawings. Send us a photo or file to get started.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/custom-manufacturing" className={styles.primaryButton} style={{ background: "#ffffff", color: "#ea580c" }}>
                Send Technical Drawing
              </Link>
              <Link href="/contact" className={styles.primaryButton}>
                Contact Engineering Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
