import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import Link from "next/link";

export type BreadcrumbItem = {
  id?: string;
  label: React.ReactNode;
  href?: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
  listClassName?: string;
  /** Visually between items; default chevron */
  separator?: React.ReactNode;
  /**
   * Link component for in-app navigation (e.g. `Link` from `@/i18n/navigation`).
   * Defaults to `next/link`.
   */
  linkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    children: React.ReactNode;
  }>;
  /** `aria-label` for the nav; default "Breadcrumb" */
  "aria-label"?: string;
};

const defaultSeparator = (
  <ChevronRight
    className="mx-1.5 h-3.5 w-3.5 shrink-0 text-[var(--ivory-text-dim)] opacity-80"
    aria-hidden
    strokeWidth={1.75}
  />
);

/**
 * Semantic breadcrumb trail: `nav` → `ol` → `li`, current page with
 * `aria-current="page"`. Pass `linkComponent` when using locale-aware routing.
 */
export function Breadcrumbs({
  items,
  className,
  listClassName,
  separator = defaultSeparator,
  linkComponent: LinkComp = Link,
  "aria-label": ariaLabel = "Breadcrumb",
}: BreadcrumbsProps) {
  if (!items.length) return null;

  return (
    <nav aria-label={ariaLabel} className={cn("text-sm", className)}>
      <ol
        className={cn(
          "m-0 flex list-none flex-wrap items-center gap-0 p-0",
          listClassName,
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const key = item.id ?? (typeof item.label === "string" ? item.label : String(index));

          return (
            <li
              key={key}
              className="inline-flex min-w-0 max-w-full items-center"
            >
              {index > 0 ? separator : null}
              {isLast ? (
                <span
                  className="min-w-0 truncate font-medium text-[var(--ivory-text-strong)]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <LinkComp
                  href={item.href}
                  className="min-w-0 truncate text-[var(--ivory-text-body)] transition-colors hover:text-[var(--ivory-accent-deep)]"
                >
                  {item.label}
                </LinkComp>
              ) : (
                <span className="min-w-0 truncate text-[var(--ivory-text-body)]">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
