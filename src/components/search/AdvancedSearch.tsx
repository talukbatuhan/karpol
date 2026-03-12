"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { productCategories } from "@/lib/config";
import styles from "./AdvancedSearch.module.css";

// Mock data for search - In a real app, this would come from an API or index
const SEARCH_INDEX = [
  ...productCategories.map((cat) => ({
    id: cat.slug,
    title: cat.name,
    type: "Category",
    url: `/products/${cat.slug}`,
    icon: cat.icon,
  })),
  { id: "p1", title: "Polyurethane Roller 90 Shore A", type: "Product", url: "/products/polyurethane-components/pu-roller-90a", icon: "⚙️" },
  { id: "p2", title: "Vulkollan Wheel 200mm", type: "Product", url: "/products/vulkollan-components/vk-wheel-200", icon: "⚙️" },
  { id: "p3", title: "Rubber Buffer Element", type: "Product", url: "/products/rubber-components/rubber-buffer", icon: "⬛" },
  { id: "a1", title: "Polyurethane vs Rubber", type: "Article", url: "/knowledge/polyurethane-vs-rubber", icon: "📄" },
  { id: "a2", title: "Shore Hardness Guide", type: "Article", url: "/knowledge/understanding-shore-hardness", icon: "📄" },
  { id: "s1", title: "Marble Industry Solutions", type: "Industry", url: "/industries/marble-stone", icon: "🏗️" },
];

type AdvancedSearchProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AdvancedSearch({ isOpen, onClose }: AdvancedSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(SEARCH_INDEX);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

  useEffect(() => {
    if (!query) {
      setResults(SEARCH_INDEX.slice(0, 5)); // Show recent/popular by default
      return;
    }

    const filtered = SEARCH_INDEX.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
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
    <div className={styles.searchOverlay} onClick={onClose}>
      <div className={styles.searchModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.searchInputWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Search products, categories, or technical articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
                          <div className={styles.resultMeta}>Jump to Category</div>
                        </div>
                        {index === activeIndex && <span style={{fontSize: "12px", color: "#94a3b8"}}>↵</span>}
                      </Link>
                    ))}
                </>
              )}

              {results.some((r) => r.type !== "Category") && (
                <>
                  <div className={styles.groupLabel} style={{ marginTop: "8px" }}>Results</div>
                  {results
                    .filter((r) => r.type !== "Category")
                    .map((item, index) => {
                      // Adjust index for continuous navigation
                      const globalIndex = results.findIndex(r => r.id === item.id);
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
                            <div className={styles.resultMeta}>{item.type}</div>
                          </div>
                          {globalIndex === activeIndex && <span style={{fontSize: "12px", color: "#94a3b8"}}>↵</span>}
                        </Link>
                      );
                    })}
                </>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              No results found for "{query}"
            </div>
          )}
        </div>
        
        <div style={{ padding: "8px 16px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", fontSize: "11px", color: "#94a3b8", display: "flex", justifyContent: "space-between" }}>
           <span>Tip: Use arrow keys to navigate</span>
           <span>KARPOL Engineering Search</span>
        </div>
      </div>
    </div>
  );
}
