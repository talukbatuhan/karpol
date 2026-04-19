"use client";
// styled-jsx is incompatible with React Compiler's memoization — opt this file out.
"use no memo";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  ArrowUpRight,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Package,
  ChevronRight,
} from "lucide-react";

export type LocalizedProduct = {
  slug: string;
  sku: string;
  name: string;
  description: string;
  material?: string;
  hardness?: string;
  image?: string;
};

type CategoryProps = {
  categorySlug: string;
  categoryName: string;
  categoryDescription: string;
  products: LocalizedProduct[];
};

const INITIAL_PAGE_SIZE = 12;
const PAGE_STEP = 12;

export default function PremiumProductCategory({
  categorySlug,
  categoryName,
  categoryDescription,
  products,
}: CategoryProps) {
  const t = useTranslations("ProductsCategory");

  const searchParams = useSearchParams();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [materialFilters, setMaterialFilters] = useState<Set<string>>(
    () => new Set(searchParams.get("material")?.split(",").filter(Boolean) ?? [])
  );
  const [hardnessFilters, setHardnessFilters] = useState<Set<string>>(
    () => new Set(searchParams.get("hardness")?.split(",").filter(Boolean) ?? [])
  );
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);

  useEffect(() => {
    const params = new URLSearchParams();
    if (materialFilters.size > 0) {
      params.set("material", Array.from(materialFilters).join(","));
    }
    if (hardnessFilters.size > 0) {
      params.set("hardness", Array.from(hardnessFilters).join(","));
    }
    if (query.trim()) {
      params.set("q", query.trim());
    }
    const qs = params.toString();
    const newUrl = qs
      ? `${window.location.pathname}?${qs}`
      : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
    setVisibleCount(INITIAL_PAGE_SIZE);
  }, [materialFilters, hardnessFilters, query]);

  const materialOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.material && p.material.trim()) set.add(p.material.trim());
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const hardnessOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.hardness && p.hardness.trim()) set.add(p.hardness.trim());
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (materialFilters.size > 0 && (!p.material || !materialFilters.has(p.material))) {
        return false;
      }
      if (hardnessFilters.size > 0 && (!p.hardness || !hardnessFilters.has(p.hardness))) {
        return false;
      }
      if (q) {
        const haystack = `${p.sku} ${p.name} ${p.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [products, materialFilters, hardnessFilters, query]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;
  const activeFilterCount =
    materialFilters.size + hardnessFilters.size + (query.trim() ? 1 : 0);

  function toggleSet(
    current: Set<string>,
    value: string,
    setter: (v: Set<string>) => void
  ) {
    const next = new Set(current);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  }

  function resetAll() {
    setMaterialFilters(new Set());
    setHardnessFilters(new Set());
    setQuery("");
  }

  return (
    <div className="pp-root">
      <style jsx>{`
        .pp-root {
          min-height: 100vh;
          background: #FFFFFF;
          color: rgba(15, 23, 41, 0.88);
          font-family: "DM Sans", var(--font-inter), system-ui, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* ── HEADER ── */
        .pp-cat-header {
          position: relative;
          padding: 8rem 1.25rem 3rem;
          overflow: hidden;
          background:
            radial-gradient(ellipse 70% 60% at 50% 0%, rgba(244, 241, 234, 0.55) 0%, transparent 55%),
            radial-gradient(ellipse 60% 60% at 90% 100%, rgba(200, 168, 90, 0.10) 0%, transparent 60%),
            linear-gradient(180deg, #F4F1EA 0%, #FBF8F2 100%);
        }
        @media (min-width: 640px) { .pp-cat-header { padding: 9rem 2rem 3.5rem; } }
        @media (min-width: 1024px) { .pp-cat-header { padding: 10rem 4rem 4.5rem; } }
        .pp-cat-header::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(15, 23, 41, 0.12), transparent);
        }

        .pp-header-inner {
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .pp-breadcrumb {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          margin-bottom: 1.75rem;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(100, 116, 139, 0.88);
          text-decoration: none;
          transition: color 0.2s;
        }
        .pp-breadcrumb:hover { color: #C8A85A; }

        .pp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          margin-bottom: 1.35rem;
          color: rgba(176, 147, 71, 0.95);
          font-size: 0.68rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .pp-eyebrow-line {
          width: 40px;
          height: 1px;
          background: rgba(200, 168, 90, 0.65);
        }

        .pp-cat-title {
          font-family: "Cormorant Garamond", serif;
          font-weight: 300;
          font-size: clamp(2.2rem, 5.5vw, 4.2rem);
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: rgba(15, 23, 41, 0.98);
          margin: 0 0 1.25rem;
          max-width: 22ch;
        }
        .pp-cat-desc {
          font-size: 1rem;
          line-height: 1.7;
          max-width: 58ch;
          color: rgba(71, 85, 105, 0.88);
          margin: 0 0 2rem;
        }

        .pp-cat-meta {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          padding: 0.85rem 1.25rem;
          background: rgba(244, 241, 234, 0.7);
          border: 1px solid rgba(15, 23, 41, 0.08);
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }
        .pp-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(71, 85, 105, 0.92);
        }
        .pp-meta-item svg { color: rgba(176, 147, 71, 0.95); }
        .pp-meta-item + .pp-meta-item {
          padding-left: 1.25rem;
          border-left: 1px solid rgba(15, 23, 41, 0.10);
        }

        /* ── MAIN ── */
        .pp-cat-main {
          padding: 3.5rem 1.25rem 6rem;
        }
        @media (min-width: 640px) { .pp-cat-main { padding: 4rem 2rem 7rem; } }
        @media (min-width: 1024px) { .pp-cat-main { padding: 5rem 4rem 8rem; } }

        .pp-cat-layout {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 1024px) {
          .pp-cat-layout {
            grid-template-columns: 260px 1fr;
            gap: 3rem;
          }
        }

        /* Mobile toggle */
        .pp-filters-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.85rem 1rem;
          background: rgba(244, 241, 234, 0.7);
          border: 1px solid rgba(15, 23, 41, 0.10);
          border-radius: 10px;
          color: rgba(15, 23, 41, 0.88);
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 500;
          cursor: pointer;
        }
        .pp-filters-toggle:hover { border-color: rgba(200, 168, 90, 0.4); }
        @media (min-width: 1024px) { .pp-filters-toggle { display: none; } }
        .pp-filters-toggle-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 22px;
          height: 22px;
          padding: 0 0.45rem;
          background: #C8A85A;
          color: #F4F1EA;
          border-radius: 999px;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .pp-filters {
          display: none;
        }
        .pp-filters.open { display: block; }
        @media (min-width: 1024px) {
          .pp-filters {
            display: block;
            position: sticky;
            top: 1.5rem;
            align-self: start;
            max-height: calc(100vh - 3rem);
            overflow-y: auto;
            padding-right: 0.25rem;
          }
        }
        .pp-filters-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(15, 23, 41, 0.10);
        }
        .pp-filters-heading {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
          color: rgba(71, 85, 105, 0.92);
        }
        .pp-filters-reset {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 500;
          color: rgba(100, 116, 139, 0.85);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .pp-filters-reset:hover { color: #C8A85A; }

        .pp-filter-group {
          margin-bottom: 1.75rem;
        }
        .pp-filter-label {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.66rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
          color: rgba(176, 147, 71, 0.9);
          margin: 0 0 0.85rem;
        }
        .pp-search-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .pp-search-wrap svg {
          position: absolute;
          left: 0.85rem;
          color: rgba(100, 116, 139, 0.8);
          pointer-events: none;
        }
        .pp-search-input {
          width: 100%;
          padding: 0.7rem 0.85rem 0.7rem 2.3rem;
          background: rgba(244, 241, 234, 0.55);
          border: 1px solid rgba(15, 23, 41, 0.10);
          border-radius: 8px;
          color: rgba(15, 23, 41, 0.95);
          font-family: "DM Sans", var(--font-inter), sans-serif;
          font-size: 0.84rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .pp-search-input:focus {
          border-color: rgba(200, 168, 90, 0.55);
        }
        .pp-search-input::placeholder {
          color: rgba(100, 116, 139, 0.7);
        }

        .pp-check-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .pp-check-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.55rem 0.7rem;
          background: rgba(244, 241, 234, 0.45);
          border: 1px solid rgba(15, 23, 41, 0.06);
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.82rem;
          color: rgba(71, 85, 105, 0.92);
        }
        .pp-check-label:hover {
          background: rgba(255, 255, 255, 0.92);
          border-color: rgba(200, 168, 90, 0.26);
        }
        .pp-check-label.checked {
          background: rgba(200, 168, 90, 0.12);
          border-color: rgba(200, 168, 90, 0.4);
          color: rgba(15, 23, 41, 0.98);
        }
        .pp-check-box {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1.5px solid rgba(100, 116, 139, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .pp-check-label.checked .pp-check-box {
          background: #C8A85A;
          border-color: #C8A85A;
        }
        .pp-check-box svg { color: #F4F1EA; }

        /* ── GRID HEAD ── */
        .pp-grid-head {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.75rem;
        }
        .pp-result-count {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(100, 116, 139, 0.92);
        }
        .pp-result-count strong {
          color: rgba(15, 23, 41, 0.95);
          font-weight: 600;
        }

        /* ── CARDS ── */
        .pp-cat-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 640px) { .pp-cat-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1280px) { .pp-cat-grid { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; } }

        .pp-prod-card {
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, rgba(244, 241, 234, 0.7), rgba(244, 241, 234, 0.6));
          border: 1px solid rgba(15, 23, 41, 0.08);
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
        }
        .pp-prod-card:hover {
          border-color: rgba(200, 168, 90, 0.35);
          transform: translateY(-2px);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(244, 241, 234, 0.7));
        }
        .pp-prod-card:hover .pp-prod-cta { color: rgba(15, 23, 41, 0.98); }
        .pp-prod-card:hover .pp-prod-arrow { transform: translate(2px, -2px); }

        .pp-img-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          background: rgba(244, 241, 234, 0.85);
          overflow: hidden;
        }
        .pp-img-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          color: rgba(100, 116, 139, 0.65);
        }
        .pp-img-placeholder-label {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .pp-prod-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          flex: 1;
        }
        .pp-prod-title {
          font-family: "Cormorant Garamond", serif;
          font-weight: 400;
          font-size: 1.35rem;
          line-height: 1.2;
          color: rgba(15, 23, 41, 0.98);
          margin: 0;
          letter-spacing: -0.005em;
        }
        .pp-prod-desc {
          font-size: 0.84rem;
          line-height: 1.55;
          color: rgba(100, 116, 139, 0.9);
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pp-prod-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .pp-prod-badge {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
          color: rgba(176, 147, 71, 0.95);
          padding: 0.28rem 0.5rem;
          border: 1px solid rgba(200, 168, 90, 0.32);
          border-radius: 4px;
          background: rgba(200, 168, 90, 0.08);
        }
        .pp-prod-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.95rem 1.25rem;
          border-top: 1px solid rgba(15, 23, 41, 0.08);
        }
        .pp-prod-sku {
          font-family: var(--font-inter), monospace;
          font-size: 0.66rem;
          letter-spacing: 0.08em;
          color: rgba(100, 116, 139, 0.85);
        }
        .pp-prod-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 600;
          color: #C8A85A;
          transition: color 0.2s;
        }
        .pp-prod-arrow { transition: transform 0.25s; }

        /* ── LOAD MORE ── */
        .pp-load-more-wrap {
          display: flex;
          justify-content: center;
          margin-top: 3rem;
        }
        .pp-load-more {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.95rem 1.85rem;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
          color: rgba(15, 23, 41, 0.92);
          background: rgba(244, 241, 234, 0.65);
          border: 1px solid rgba(15, 23, 41, 0.14);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.25s;
        }
        .pp-load-more:hover {
          border-color: rgba(200, 168, 90, 0.55);
          color: #0F1729;
          background: rgba(200, 168, 90, 0.10);
        }

        /* ── EMPTY ── */
        .pp-empty {
          padding: 4rem 1.5rem;
          text-align: center;
          background: rgba(244, 241, 234, 0.45);
          border: 1px solid rgba(15, 23, 41, 0.08);
          border-radius: 14px;
        }
        .pp-empty-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(200, 168, 90, 0.10);
          border: 1px solid rgba(200, 168, 90, 0.22);
          color: #C8A85A;
        }
        .pp-empty-title {
          font-family: "Cormorant Garamond", serif;
          font-weight: 400;
          font-size: 1.5rem;
          color: rgba(15, 23, 41, 0.98);
          margin: 0 0 0.55rem;
        }
        .pp-empty-text {
          font-size: 0.92rem;
          line-height: 1.6;
          color: rgba(100, 116, 139, 0.9);
          margin: 0 auto 1.5rem;
          max-width: 42ch;
        }
        .pp-empty-reset {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.75rem 1.35rem;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 600;
          color: #0F1729;
          background: #C8A85A;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pp-empty-reset:hover { background: #B09347; transform: translateY(-1px); }
      `}</style>

      {/* HEADER */}
      <header className="pp-cat-header">
        <div className="pp-header-inner">
          <Link href="/products" className="pp-breadcrumb">
            <ArrowLeft size={12} strokeWidth={2} />
            {t("breadcrumb.all")}
          </Link>

          <div className="pp-eyebrow">
            <span className="pp-eyebrow-line" />
            {t("header.eyebrow")}
          </div>

          <h1 className="pp-cat-title">{categoryName}</h1>
          {categoryDescription && (
            <p className="pp-cat-desc">{categoryDescription}</p>
          )}

          <div className="pp-cat-meta">
            <span className="pp-meta-item">
              <Package size={13} strokeWidth={1.8} />
              {t("header.metaProducts", { count: products.length })}
            </span>
            {materialOptions.length > 0 && (
              <span className="pp-meta-item">
                <SlidersHorizontal size={13} strokeWidth={1.8} />
                {t("header.metaMaterials", { count: materialOptions.length })}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <section className="pp-cat-main">
        <div className="pp-cat-layout">
          {/* Mobile toggle */}
          <button
            type="button"
            className="pp-filters-toggle"
            onClick={() => setMobileFiltersOpen((v) => !v)}
            aria-expanded={mobileFiltersOpen}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem" }}>
              <SlidersHorizontal size={14} strokeWidth={1.8} />
              {mobileFiltersOpen ? t("filters.toggleHide") : t("filters.toggleShow")}
            </span>
            {activeFilterCount > 0 && (
              <span className="pp-filters-toggle-badge">{activeFilterCount}</span>
            )}
          </button>

          {/* FILTERS */}
          <aside className={`pp-filters${mobileFiltersOpen ? " open" : ""}`}>
            <div className="pp-filters-head">
              <span className="pp-filters-heading">{t("filters.heading")}</span>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  className="pp-filters-reset"
                  onClick={resetAll}
                >
                  {t("filters.reset")}
                </button>
              )}
            </div>

            <div className="pp-filter-group">
              <h3 className="pp-filter-label">{t("filters.search")}</h3>
              <div className="pp-search-wrap">
                <Search size={14} strokeWidth={1.8} />
                <input
                  type="search"
                  className="pp-search-input"
                  placeholder={t("filters.searchPlaceholder")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            {materialOptions.length > 0 && (
              <div className="pp-filter-group">
                <h3 className="pp-filter-label">{t("filters.material")}</h3>
                <div className="pp-check-list">
                  {materialOptions.map((value) => {
                    const checked = materialFilters.has(value);
                    return (
                      <label
                        key={value}
                        className={`pp-check-label${checked ? " checked" : ""}`}
                      >
                        <span className="pp-check-box">
                          {checked && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path
                                d="M1.5 5L4 7.5L8.5 2.5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleSet(materialFilters, value, setMaterialFilters)
                          }
                          style={{ display: "none" }}
                        />
                        {value}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {hardnessOptions.length > 0 && (
              <div className="pp-filter-group">
                <h3 className="pp-filter-label">{t("filters.hardness")}</h3>
                <div className="pp-check-list">
                  {hardnessOptions.map((value) => {
                    const checked = hardnessFilters.has(value);
                    return (
                      <label
                        key={value}
                        className={`pp-check-label${checked ? " checked" : ""}`}
                      >
                        <span className="pp-check-box">
                          {checked && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path
                                d="M1.5 5L4 7.5L8.5 2.5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleSet(hardnessFilters, value, setHardnessFilters)
                          }
                          style={{ display: "none" }}
                        />
                        {value}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          {/* GRID */}
          <div>
            <div className="pp-grid-head">
              <span className="pp-result-count">
                {t("results.showing", {
                  visible: visibleProducts.length,
                  total: filteredProducts.length,
                })}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="pp-empty">
                <div className="pp-empty-icon">
                  <Package size={22} strokeWidth={1.5} />
                </div>
                <h3 className="pp-empty-title">{t("empty.title")}</h3>
                <p className="pp-empty-text">{t("empty.text")}</p>
                <button
                  type="button"
                  className="pp-empty-reset"
                  onClick={resetAll}
                >
                  {t("empty.reset")}
                  <ArrowUpRight size={13} strokeWidth={2.25} />
                </button>
              </div>
            ) : (
              <>
                <div className="pp-cat-grid">
                  {visibleProducts.map((p) => (
                    <Link
                      key={p.slug}
                      href={{
                        pathname: "/products/[category]/[slug]",
                        params: {
                          category: categorySlug,
                          slug: p.slug,
                        },
                      }}
                      className="pp-prod-card"
                    >
                      <div className="pp-img-frame">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="pp-img-placeholder">
                            <Package size={28} strokeWidth={1.25} />
                            <span className="pp-img-placeholder-label">
                              {t("results.noImage")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="pp-prod-body">
                        <h3 className="pp-prod-title">{p.name}</h3>
                        {p.description && (
                          <p className="pp-prod-desc">{p.description}</p>
                        )}
                        {(p.material || p.hardness) && (
                          <div className="pp-prod-badges">
                            {p.material && (
                              <span className="pp-prod-badge">{p.material}</span>
                            )}
                            {p.hardness && (
                              <span className="pp-prod-badge">{p.hardness}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="pp-prod-foot">
                        <span className="pp-prod-sku">
                          {t("results.skuLabel")} · {p.sku}
                        </span>
                        <span className="pp-prod-cta">
                          {t("results.viewSpecs")}
                          <ChevronRight
                            size={14}
                            strokeWidth={2}
                            className="pp-prod-arrow"
                          />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {hasMore && (
                  <div className="pp-load-more-wrap">
                    <button
                      type="button"
                      className="pp-load-more"
                      onClick={() => setVisibleCount((v) => v + PAGE_STEP)}
                    >
                      {t("results.loadMore")}
                      <ArrowUpRight size={13} strokeWidth={2} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
