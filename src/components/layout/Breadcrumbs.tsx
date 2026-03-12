"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { productCategories } from "@/lib/config";
import styles from "./Breadcrumbs.module.css";

// Helper to map slugs to readable names
const nameMap: Record<string, string> = {
  products: "Products",
  industries: "Industries",
  knowledge: "Knowledge Base",
  about: "About Us",
  contact: "Contact",
  "custom-manufacturing": "Custom Manufacturing",
  "marble-stone": "Marble & Stone",
  "polyurethane": "Polyurethane",
  "vulkolan": "Vulkolan",
};

// Add categories to map
productCategories.forEach((cat) => {
  nameMap[cat.slug] = cat.name;
});

export default function Breadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Remove query params and trailing slash
    const asPathWithoutQuery = pathname.split("?")[0];
    const asPathNestedRoutes = asPathWithoutQuery
      .split("/")
      .filter((v) => v.length > 0);

    // Don't show on home page
    if (asPathNestedRoutes.length === 0) return [];

    const crumbs = asPathNestedRoutes.map((subpath, idx) => {
      const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
      const title = nameMap[subpath] || 
                    subpath.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      
      return { href, title };
    });

    return [{ href: "/", title: "Home" }, ...crumbs];
  }, [pathname]);

  if (breadcrumbs.length <= 1) return null;

  // Generate Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.title,
      "item": `https://karpol.net${crumb.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={styles.nav}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="container">
        <ol className={styles.list}>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <li key={crumb.href} className={styles.item}>
                {isLast ? (
                  <span aria-current="page" className={styles.current}>
                    {crumb.title}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.href} className={styles.link}>
                      {crumb.title}
                    </Link>
                    <span className={styles.separator}>/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
