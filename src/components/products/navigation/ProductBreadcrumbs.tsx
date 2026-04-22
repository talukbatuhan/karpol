"use client";

import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export type ProductBreadcrumbItem = {
  label: string;
  href?:
    | string
    | { pathname: "/products" | "/products/[category]" | "/products/[category]/[slug]"; params?: Record<string, string> };
};

type ProductBreadcrumbsProps = {
  items: ProductBreadcrumbItem[];
  className?: string;
};

export default function ProductBreadcrumbs({
  items,
  className,
}: ProductBreadcrumbsProps) {
  return (
    <nav className={className} aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span
          key={`${item.label}-${i}`}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
        >
          {i > 0 && <ChevronRight size={11} strokeWidth={1.5} />}
          {item.href ? (
            <Link href={item.href as "/products" | { pathname: string; params?: Record<string, string> }} className="pp-breadcrumb pp-crumb-link">
              {item.label}
            </Link>
          ) : (
            <span className="pp-breadcrumb pp-crumb-current" style={{ cursor: "default" }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
