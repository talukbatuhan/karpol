"use client";

import { useState } from "react";
import styles from "./custom.module.css";

export default function CustomManufacturingPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.heroTitle}>
            From Drawing to Delivery
          </h1>
          <p className={styles.heroText}>
            Precision manufacturing services for bespoke industrial components.
            Upload your technical drawing and get a quote within 24 hours.
          </p>
          <button
            className={styles.submitButton}
            style={{ width: "auto", padding: "14px 32px", background: "#ffffff", color: "#1e293b" }}
            onClick={() => {
              document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Start Your Project
          </button>
        </div>
      </section>

      {/* Capabilities */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Manufacturing Capabilities</h2>
            <p className={styles.sectionDesc}>
              We combine advanced CNC machining with expert polymer casting to deliver
              parts that meet your exact specifications.
            </p>
          </div>

          <div className={styles.capabilityGrid}>
            <div className={styles.capabilityCard}>
              <div className={styles.icon}>📐</div>
              <h3 className={styles.cardTitle}>Custom Mold Design</h3>
              <p className={styles.cardText}>
                In-house mold design and tooling production for rapid prototyping
                and cost-effective mass production of cast parts.
              </p>
            </div>
            <div className={styles.capabilityCard}>
              <div className={styles.icon}>⚙️</div>
              <h3 className={styles.cardTitle}>CNC Machining</h3>
              <p className={styles.cardText}>
                5-axis milling and turning for aluminum, steel, and engineering
                plastics with tolerances up to ±0.01mm.
              </p>
            </div>
            <div className={styles.capabilityCard}>
              <div className={styles.icon}>🧪</div>
              <h3 className={styles.cardTitle}>Polymer Casting</h3>
              <p className={styles.cardText}>
                Hot casting of Polyurethane and Vulkolan® in hardness ranges from
                20 Shore A to 75 Shore D.
              </p>
            </div>
            <div className={styles.capabilityCard}>
              <div className={styles.icon}>🔬</div>
              <h3 className={styles.cardTitle}>Material Engineering</h3>
              <p className={styles.cardText}>
                Custom compound formulation for specific requirements: high heat,
                chemical resistance, or extreme abrasion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className={`${styles.section} ${styles.bgLight}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
          </div>
          <div className={styles.processRow}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h4 className={styles.stepTitle}>Upload Drawing</h4>
              <p className={styles.stepDesc}>Send us your CAD file (DWG, STEP) or a sketch with dimensions.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h4 className={styles.stepTitle}>Engineering Review</h4>
              <p className={styles.stepDesc}>Our engineers analyze feasibility and suggest material options.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h4 className={styles.stepTitle}>Quotation</h4>
              <p className={styles.stepDesc}>Receive a detailed cost and lead time estimate within 24h.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h4 className={styles.stepTitle}>Production</h4>
              <p className={styles.stepDesc}>Manufacturing begins immediately after approval.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section id="quote-form" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Request a Custom Quote</h2>
            <p className={styles.sectionDesc}>
              Ready to manufacture? Fill out the form below.
            </p>
          </div>

          <div className={styles.formContainer}>
            <form onSubmit={(e) => e.preventDefault()}>
              {/* File Upload */}
              <div
                className={styles.uploadArea}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
                style={{ borderColor: dragActive ? "#ea580c" : "#cbd5e1" }}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  style={{ display: "none" }}
                  onChange={handleChange}
                />
                <div className={styles.uploadIcon}>☁️</div>
                <div className={styles.uploadText}>
                  {file ? file.name : "Drag & drop your drawing here or click to browse"}
                </div>
                <div className={styles.uploadSubtext}>
                  Supported: PDF, DWG, DXF, STEP, IGES (Max 20MB)
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input type="text" className={styles.input} placeholder="John Doe" required />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Company Email</label>
                  <input type="email" className={styles.input} placeholder="john@company.com" required />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input type="tel" className={styles.input} placeholder="+90 555..." />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Quantity</label>
                  <input type="number" className={styles.input} placeholder="e.g. 50" required />
                </div>
              </div>

              <div className={styles.inputGroup} style={{ marginBottom: "24px" }}>
                <label className={styles.label}>Material Preference (Optional)</label>
                <select className={styles.select}>
                  <option value="">Select Material...</option>
                  <option value="pu">Polyurethane</option>
                  <option value="vulkolan">Vulkolan</option>
                  <option value="rubber">Rubber (NBR, EPDM)</option>
                  <option value="silicone">Silicone</option>
                  <option value="ptfe">PTFE / Teflon</option>
                  <option value="metal">Aluminum / Steel</option>
                  <option value="other">Other / Not Sure</option>
                </select>
              </div>

              <div className={styles.inputGroup} style={{ marginBottom: "32px" }}>
                <label className={styles.label}>Project Details</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe your requirements, operating conditions, or any special tolerances..."
                  required
                ></textarea>
              </div>

              <button type="submit" className={styles.submitButton}>
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
