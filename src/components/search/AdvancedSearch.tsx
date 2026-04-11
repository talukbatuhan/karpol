"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { productCategories } from "@/lib/config";
import { getAllArticles } from "@/lib/data/knowledge-base";
import { getRichProductsByCategory } from "@/lib/product-content";
import styles from "./AdvancedSearch.module.css";

type SearchItemType = "Category" | "Product" | "Article";

type SearchItem = {
  id: string;
  title: string;
  type: SearchItemType;
  url: string;
  icon: string;
  meta?: string;
};

// Build a lightweight in-memory index from existing static data
const buildSearchIndex = (): SearchItem[] => {
  const categoryItems: SearchItem[] = productCategories.map((cat) => ({
    id: `category:${cat.slug}`,
    title: cat.name,
    type: "Category",
    url: `/products/${cat.slug}`,
    icon: cat.icon,
  }));

  const productItems: SearchItem[] = productCategories.flatMap((cat) => {
    const richProducts = getRichProductsByCategory(cat.slug);
    return richProducts.map((p) => ({
      id: `product:${cat.slug}:${p.slug}`,
      title: p.name,
      type: "Product" as const,
      url: `/products/${cat.slug}/${p.slug}`,
      icon: "⚙️",
      meta: p.shortDescription,
    }));
  });

  const articleItems: SearchItem[] = getAllArticles().map((article) => ({
    id: `article:${article.slug}`,
    title: article.title,
    type: "Article" as const,
    url: `/knowledge/${article.slug}`,
    icon: "📄",
    meta: article.category,
  }));

  return [...categoryItems, ...productItems, ...articleItems];
};

const SEARCH_INDEX: SearchItem[] = buildSearchIndex();

type AdvancedSearchProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AdvancedSearch({ isOpen, onClose }: AdvancedSearchProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    if (!query) {
      return SEARCH_INDEX.slice(0, 8);
    }
    const normalizedQuery = query.toLowerCase();
    return SEARCH_INDEX.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(normalizedQuery);
      const metaMatch = item.meta?.toLowerCase().includes(normalizedQuery);
      return titleMatch || metaMatch;
    });
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length === 0) return;
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length === 0) return;
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) {
        router.push(results[activeIndex].url);
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.searchOverlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.searchModal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className={styles.searchInputWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Search products, categories, or technical articles..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <button className={styles.closeButton} onClick={onClose}>ESC</button>
        </div>

        <div className={styles.searchResults}>
          {results.length > 0 ? (
            <>
              {results.some((r) => r.type === "Category") && (
                <>
                  <div className={styles.groupLabel}>Categories</div>
                  {results
                    .filter((r) => r.type === "Category")
                    .map((item, index) => (
                      <Link
                        key={item.id}
                        href={item.url}
                        className={styles.resultItem}
                        onClick={onClose}
                        data-active={index === activeIndex}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <div className={styles.resultIcon}>{item.icon}</div>
                        <div className={styles.resultContent}>
                          <div className={styles.resultTitle}>{item.title}</div>
                          <div className={styles.resultMeta}>Jump to category</div>
                        </div>
                        {index === activeIndex && (
                          <span className={styles.enterHint}>↵</span>
                        )}
                      </Link>
                    ))}
                </>
              )}

              {results.some((r) => r.type === "Product") && (
                <>
                  <div className={`${styles.groupLabel} ${styles.groupLabelSpaced}`}>
                    Products
                  </div>
                  {results
                    .filter((r) => r.type === "Product")
                    .map((item) => {
                      const globalIndex = results.findIndex((r) => r.id === item.id);
                      return (
                        <Link
                          key={item.id}
                          href={item.url}
                          className={styles.resultItem}
                          onClick={onClose}
                          data-active={globalIndex === activeIndex}
                          onMouseEnter={() => setActiveIndex(globalIndex)}
                        >
                          <div className={styles.resultIcon}>{item.icon}</div>
                          <div className={styles.resultContent}>
                            <div className={styles.resultTitle}>{item.title}</div>
                            {item.meta && (
                              <div className={styles.resultMeta}>{item.meta}</div>
                            )}
                          </div>
                          {globalIndex === activeIndex && (
                            <span className={styles.enterHint}>↵</span>
                          )}
                        </Link>
                      );
                    })}
                </>
              )}

              {results.some((r) => r.type === "Article") && (
                <>
                  <div className={`${styles.groupLabel} ${styles.groupLabelSpaced}`}>
                    Articles
                  </div>
                  {results
                    .filter((r) => r.type === "Article")
                    .map((item) => {
                      const globalIndex = results.findIndex((r) => r.id === item.id);
                      return (
                        <Link
                          key={item.id}
                          href={item.url}
                          className={styles.resultItem}
                          onClick={onClose}
                          data-active={globalIndex === activeIndex}
                          onMouseEnter={() => setActiveIndex(globalIndex)}
                        >
                          <div className={styles.resultIcon}>{item.icon}</div>
                          <div className={styles.resultContent}>
                            <div className={styles.resultTitle}>{item.title}</div>
                            {item.meta && (
                              <div className={styles.resultMeta}>{item.meta}</div>
                            )}
                          </div>
                          {globalIndex === activeIndex && (
                            <span className={styles.enterHint}>↵</span>
                          )}
                        </Link>
                      );
                    })}
                </>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>
        
        <div className={styles.tipBar}>
          <span>Tip: Use ↑ ↓ and ↵ to navigate</span>
          <span>KARPOL Engineering Search</span>
        </div>
      </div>
    </div>
  );
}
