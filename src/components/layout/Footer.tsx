import Link from "next/link";
import { siteConfig, navigation, productCategories } from "@/lib/config";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        {/* Brand Column */}
        <div className={styles.brandColumn}>
          <Link href="/" className={styles.brand}>
            {siteConfig.name}
          </Link>
          <p className={styles.description}>{siteConfig.description}</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className={styles.columnTitle}>Company</h4>
          <nav className={styles.linkList}>
            <Link href="/about" className={styles.link}>
              About Us
            </Link>
            <Link href="/contact" className={styles.link}>
              Contact
            </Link>
            <Link href="/catalog" className={styles.link}>
              Catalogs
            </Link>
            <Link href="/knowledge" className={styles.link}>
              Knowledge Base
            </Link>
          </nav>
        </div>

        {/* Products */}
        <div>
          <h4 className={styles.columnTitle}>Products</h4>
          <nav className={styles.linkList}>
            {productCategories.slice(0, 5).map((cat) => (
              <Link
                key={cat.slug}
                href={`/products/${cat.slug}`}
                className={styles.link}
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/products" className={styles.link}>
              View All →
            </Link>
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h4 className={styles.columnTitle}>Contact</h4>
          <div className={styles.contactInfo}>
            <p>{siteConfig.contact.email}</p>
            <p>{siteConfig.contact.phone}</p>
            <p>{siteConfig.contact.address.country}</p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className={styles.social}>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noreferrer"
              className={styles.socialLink}
            >
              LinkedIn
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              className={styles.socialLink}
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
