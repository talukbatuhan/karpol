"use client";

import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import styles from "./CatalogViewer.module.css";
import type { CatalogPageAsset } from "@/lib/data/catalog-storage";

type Props = {
  pages: CatalogPageAsset[];
  currentIndex: number;
  onSelect: (index: number) => void;
  thumbsOpen: boolean;
};

export default function CatalogThumbnails({
  pages,
  currentIndex,
  onSelect,
  thumbsOpen,
}: Props) {
  const visiblePages = useMemo(() => pages, [pages]);

  const handleSelect = useCallback(
    (idx: number) => {
      onSelect(idx);
    },
    [onSelect],
  );

  return (
    <motion.aside
      className={styles.thumbsPanel}
      initial={false}
      animate={thumbsOpen ? { opacity: 1, width: 210 } : { opacity: 0, width: 0 }}
      transition={{ duration: 0.2 }}
      style={{ overflow: "hidden" }}
      aria-hidden={!thumbsOpen}
    >
      <div className={styles.thumbsHeader}>Pages</div>
      <div className={styles.thumbsList}>
        {visiblePages.map((p) => (
          <button
            key={p.pageNumber}
            className={styles.thumbBtn}
            onClick={() => handleSelect(p.index)}
            data-active={p.index === currentIndex ? "true" : "false"}
            aria-label={`Go to page ${p.pageNumber}`}
          >
            {p.thumbUrl ? (
              <img
                src={p.thumbUrl}
                alt={`Page ${p.pageNumber} thumbnail`}
                className={styles.thumbImg}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className={styles.thumbPlaceholder} />
            )}
          </button>
        ))}
      </div>
    </motion.aside>
  );
}

