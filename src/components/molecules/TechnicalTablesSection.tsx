"use client";

import { useMemo, useState } from "react";
import type { ProductPublicTechnicalTable } from "@/types/product";
import { TechnicalTableView } from "@/components/molecules/TechnicalTableView";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TechnicalTablesSectionProps {
  tables: ProductPublicTechnicalTable[];
  labels: {
    technicalTableTitle: string;
    technicalTablesTitle: string;
    technicalTablePage: string;
    technicalTablePrevious: string;
    technicalTableNext: string;
  };
  /** Side slot: always one table + tabs (no desktop 2-col grid). */
  compact?: boolean;
}

export function TechnicalTablesSection({
  tables,
  labels,
  compact = false,
}: TechnicalTablesSectionProps) {
  const namedTables = useMemo(
    () =>
      tables.map((table, index) => ({
        ...table,
        displayName:
          table.title?.trim() ||
          (tables.length > 1
            ? `${labels.technicalTableTitle} ${index + 1}`
            : labels.technicalTableTitle),
      })),
    [tables, labels.technicalTableTitle],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = Math.min(activeIndex, Math.max(0, namedTables.length - 1));
  const activeTable = namedTables[safeIndex];
  const hasMultiple = namedTables.length > 1;
  const showDesktopGrid = hasMultiple && !compact;

  if (namedTables.length === 0) return null;

  const paginationLabels = {
    page: labels.technicalTablePage,
    previous: labels.technicalTablePrevious,
    next: labels.technicalTableNext,
  };

  return (
    <section className="space-y-5">
      {hasMultiple ? (
        <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-navy-800">
          {labels.technicalTablesTitle}
        </h2>
      ) : null}

      {hasMultiple ? (
        <div
          className={cn(
            "flex flex-wrap gap-2",
            showDesktopGrid && "md:hidden",
          )}
          role="tablist"
          aria-label={labels.technicalTablesTitle}
        >
          {namedTables.map((table, index) => (
            <Button
              key={`${table.displayName}-${index}`}
              type="button"
              role="tab"
              aria-selected={safeIndex === index}
              size="sm"
              variant={safeIndex === index ? "default" : "outline"}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "font-mono text-[10px] uppercase tracking-widest",
                safeIndex === index && "bg-navy-950 text-gold-300",
              )}
            >
              {table.displayName}
            </Button>
          ))}
        </div>
      ) : null}

      {/* Single selected table: always in compact; mobile-only when desktop grid exists */}
      <div className={showDesktopGrid ? "md:hidden" : undefined}>
        {activeTable ? (
          <TechnicalTableView
            title={activeTable.displayName}
            tableTitle={activeTable.title}
            headers={activeTable.headers}
            rows={activeTable.rows}
            labels={paginationLabels}
          />
        ) : null}
      </div>

      {showDesktopGrid ? (
        <div className="hidden gap-6 md:grid md:grid-cols-2">
          {namedTables.map((table, index) => (
            <TechnicalTableView
              key={`${table.displayName}-${index}`}
              title={table.displayName}
              tableTitle={table.title}
              headers={table.headers}
              rows={table.rows}
              labels={paginationLabels}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
