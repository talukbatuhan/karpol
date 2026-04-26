"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Ruler, Search, X } from "lucide-react";
import type { SizeTableBlock } from "@/types/database";
import { getLocalizedField } from "@/lib/i18n-helpers";

const SIZE_PAGE_SIZE = 10;

type Props = {
  locale: string;
  sizeTables: SizeTableBlock[];
};

export default function ProductDetailSizeTableSection({
  locale,
  sizeTables,
}: Props) {
  const t = useTranslations("ProductDetail");
  const [sizeSearch, setSizeSearch] = useState("");
  const [sizePage, setSizePage] = useState(1);
  const [activeTableIndex, setActiveTableIndex] = useState(0);

  const activeTable = sizeTables[activeTableIndex]?.table;

  const filteredSizeRows = useMemo(() => {
    if (!activeTable) return [];
    const rows = activeTable.rows;
    const q = sizeSearch.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      activeTable.columns.some((col) =>
        (row[col.key] ?? "").toString().toLowerCase().includes(q),
      ),
    );
  }, [activeTable, sizeSearch]);

  const sizePageCount = Math.max(
    1,
    Math.ceil(filteredSizeRows.length / SIZE_PAGE_SIZE),
  );

  useEffect(() => {
    if (sizePage > sizePageCount) setSizePage(1);
  }, [sizePage, sizePageCount]);

  useEffect(() => {
    setSizeSearch("");
    setSizePage(1);
  }, [activeTableIndex]);

  const pagedSizeRows = useMemo(() => {
    const start = (sizePage - 1) * SIZE_PAGE_SIZE;
    return filteredSizeRows.slice(start, start + SIZE_PAGE_SIZE);
  }, [filteredSizeRows, sizePage]);

  if (!activeTable || activeTable.columns.length === 0 || activeTable.rows.length === 0) {
    return null;
  }

  return (
    <>
      <section className="pd-section lazy-section pd-size-table-section">
        <div className="pd-container">
          <div className="pd-section-head">
            <div>
              <div className="pd-section-eyebrow">
                <span className="pd-section-eyebrow-line" />
                <Ruler size={11} strokeWidth={1.6} />
                {t("eyebrow.sizes")}
              </div>
              <h2 className="pd-section-title">
                {t("sizes")} <em>—</em>
              </h2>
            </div>
            {activeTable.rows.length > SIZE_PAGE_SIZE && (
              <div className="pd-size-search">
                <Search size={14} strokeWidth={1.6} />
                <input
                  type="search"
                  value={sizeSearch}
                  onChange={(e) => {
                    setSizeSearch(e.target.value);
                    setSizePage(1);
                  }}
                  placeholder={t("size.searchPlaceholder")}
                  aria-label={t("size.searchPlaceholder")}
                />
                {sizeSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setSizeSearch("");
                      setSizePage(1);
                    }}
                    aria-label={t("size.clearSearch")}
                    className="pd-size-search-clear"
                  >
                    <X size={13} strokeWidth={1.8} />
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="pd-size-wrap">
            {sizeTables.length > 1 && (
              <div className="pd-size-tabs">
                {sizeTables.map((block, index) => {
                  const title =
                    getLocalizedField(block.title, locale) ||
                    `${t("sizes")} ${index + 1}`;
                  return (
                    <button
                      key={block.id}
                      type="button"
                      className={`pd-size-tab ${activeTableIndex === index ? "is-active" : ""}`}
                      onClick={() => setActiveTableIndex(index)}
                    >
                      {title}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="pd-size-scroll">
              <table className="pd-size-table">
                <thead>
                  <tr>
                    {activeTable.columns.map((col) => {
                      const heading =
                        getLocalizedField(col.label, locale) || col.key;
                      return (
                        <th
                          key={col.key}
                          style={{ textAlign: col.align ?? "left" }}
                        >
                          {heading}
                          {col.unit ? ` (${col.unit})` : ""}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {pagedSizeRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={activeTable.columns.length}
                        className="pd-size-empty"
                      >
                        {t("size.noResults")}
                      </td>
                    </tr>
                  ) : (
                    pagedSizeRows.map((row, i) => (
                      <tr key={(sizePage - 1) * SIZE_PAGE_SIZE + i}>
                        {activeTable.columns.map((col, ci) => {
                          const value = row[col.key];
                          const display =
                            value && value.trim().length > 0 ? value : "—";
                          return (
                            <td
                              key={col.key}
                              className={
                                ci === 0 ? "pd-size-cell-primary" : undefined
                              }
                              style={{ textAlign: col.align ?? "left" }}
                            >
                              {display}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {sizePageCount > 1 && (
              <div className="pd-size-pager">
                <button
                  type="button"
                  className="pd-size-pager-btn"
                  onClick={() => setSizePage((p) => Math.max(1, p - 1))}
                  disabled={sizePage === 1}
                  aria-label={t("size.prev")}
                >
                  <ChevronLeft size={14} strokeWidth={1.8} />
                  <span>{t("size.prev")}</span>
                </button>
                <div className="pd-size-pager-info">
                  {t("size.pageInfo", {
                    page: sizePage,
                    total: sizePageCount,
                    rows: filteredSizeRows.length,
                  })}
                </div>
                <button
                  type="button"
                  className="pd-size-pager-btn"
                  onClick={() =>
                    setSizePage((p) => Math.min(sizePageCount, p + 1))
                  }
                  disabled={sizePage === sizePageCount}
                  aria-label={t("size.next")}
                >
                  <span>{t("size.next")}</span>
                  <ChevronRight size={14} strokeWidth={1.8} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <div className="pd-section-divider" />
    </>
  );
}
