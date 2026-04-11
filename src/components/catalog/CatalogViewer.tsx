// src/components/catalog/CatalogViewer.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { PageFlip } from "page-flip";
import type { CatalogManifest } from "@/lib/data/catalog-storage";
import styles from "./CatalogViewer.module.css";

type Props = {
  catalog: CatalogManifest;
  initialPageIndex?: number;
};

export default function CatalogViewer({ catalog, initialPageIndex = 0 }: Props) {
  const t = useTranslations("Catalog");
  const pages = catalog.pages;
  const totalPages = catalog.totalPages;

  const bookRef = useRef<PageFlip | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageFlipLoaded, setPageFlipLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPageIndex);
  const [isMobile, setIsMobile] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    if (!containerRef.current || pages.length === 0) return;

    /** Live viewport — React `isMobile` is still false on the first effect tick (state updates after). */
    const layoutIsMobile = typeof window !== "undefined" && window.innerWidth < 768;

    let pf: PageFlip | undefined;
    let cancelled = false;
    let rafId: number | null = null;
    let resizeObserver: ResizeObserver | null = null;

    setPageFlipLoaded(false);

    import("page-flip")
      .then(({ PageFlip }) => {
        let rafIterations = 0;
        const init = () => {
          if (cancelled || !containerRef.current) {
            return;
          }
          const el = containerRef.current;
          let containerWidth = el.clientWidth;

          if (containerWidth < 100) {
            rafIterations += 1;
            if (rafIterations === 1 && typeof ResizeObserver !== "undefined") {
              resizeObserver = new ResizeObserver(() => {
                if (cancelled || !containerRef.current) return;
                if (containerRef.current.clientWidth >= 100) {
                  resizeObserver?.disconnect();
                  resizeObserver = null;
                  init();
                }
              });
              resizeObserver.observe(el);
            }
            if (rafIterations > 150) {
              const fallback = Math.max(100, window.innerWidth - 24);
              resizeObserver?.disconnect();
              resizeObserver = null;
              containerWidth = fallback;
            } else if (containerWidth < 100) {
              rafId = window.requestAnimationFrame(init);
              return;
            }
          }

          el.innerHTML = "";

          const isDouble = !layoutIsMobile;
          const rawWidth = isDouble
            ? Math.min(containerWidth / 2, 480)
            : Math.min(containerWidth - 16, 560);

          const w = Math.max(200, Math.floor(rawWidth));
          const h = Math.max(283, Math.floor(w * (297 / 210)));

          try {
            pf = new PageFlip(el, {
              width: w,
              height: h,
              size: "fixed",
              minWidth: isDouble ? 200 : 160,
              minHeight: isDouble ? 283 : 226,
              maxWidth: isDouble ? 480 : 560,
              maxHeight: isDouble ? 679 : 792,
              drawShadow: true,
              flippingTime: 600,
              usePortrait: !isDouble,
              startZIndex: 5,
              autoSize: true,
              showCover: true,
              mobileScrollSupport: false,
              clickEventForward: true,
              useMouseEvents: true,
              swipeDistance: 20,
            });

            const pageEls: HTMLElement[] = pages.map((page, idx) => {
              const div = document.createElement("div");
              div.className = styles.flipPage;

              if (page.url) {
                const img = document.createElement("img");
                img.src = page.url;
                img.alt = `Sayfa ${page.pageNumber}`;
                img.className = styles.flipPageImg;
                img.loading = idx < 4 ? "eager" : "lazy";
                div.appendChild(img);
              } else {
                div.innerHTML = `<div class="${styles.flipPageMissing}"><span>${page.pageNumber}</span></div>`;
              }

              return div;
            });

            pf.loadFromHTML(pageEls);

            pf.on("flip", (e: { data: number }) => {
              setCurrentPage(e.data);
            });

            pf.turnToPage(initialPageIndex);
            bookRef.current = pf;
            setPageFlipLoaded(true);
          } catch {
            setPageFlipLoaded(true);
          }
        };

        init();
      })
      .catch(() => {
        setPageFlipLoaded(true);
      });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      if (pf) {
        try { pf.destroy?.(); } catch {}
      }
      bookRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, pages]);

  const onPrev = useCallback(() => {
    bookRef.current?.flipPrev("bottom");
  }, []);

  const onNext = useCallback(() => {
    bookRef.current?.flipNext("bottom");
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current?.parentElement;
    if (!el) return;
    try {
      if (!document.fullscreenElement) await el.requestFullscreen();
      else await document.exitFullscreen();
    } catch {}
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPrev, onNext]);

  const displayPage = isMobile ? currentPage + 1 : Math.floor(currentPage / 2) * 2 + 1;

  if (!pages.length) {
    return (
      <div className={styles.shell}>
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{t("loading")}</p>
          <p className={styles.emptySub}>{t("error")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <button className={styles.toolBtn} onClick={onPrev} disabled={currentPage === 0} aria-label="Önceki sayfa">
          ‹
        </button>

        <span className={styles.pageInfo}>
          {displayPage} / {totalPages}
        </span>

        <button className={styles.toolBtn} onClick={onNext} disabled={currentPage >= totalPages - 1} aria-label="Sonraki sayfa">
          ›
        </button>

        <button className={styles.toolBtnIcon} onClick={toggleFullscreen} aria-label="Tam ekran">
          {isFullscreen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          )}
        </button>

        {isMobile && (
          <button
            className={styles.toolBtnText}
            onClick={() => setShowThumbnails((prev) => !prev)}
            aria-expanded={showThumbnails}
          >
            {showThumbnails ? "Sayfalari Gizle" : "Sayfalar"}
          </button>
        )}
      </div>

      {/* Book Stage */}
      <div className={styles.bookStage}>
        {!pageFlipLoaded && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
            <p>Katalog yükleniyor…</p>
          </div>
        )}
        <div ref={containerRef} className={styles.bookContainer} />
      </div>

      {/* Page strip */}
      <div
        className={`${styles.pageStrip} ${
          isMobile ? (showThumbnails ? styles.pageStripMobileOpen : styles.pageStripMobileClosed) : ""
        }`}
      >
        <div className={styles.pageStripInner}>
          {pages.map((p, idx) => (
            <button
              key={idx}
              className={`${styles.stripBtn} ${idx === currentPage ? styles.stripBtnActive : ""}`}
              onClick={() => {
                bookRef.current?.turnToPage(idx);
                setCurrentPage(idx);
              }}
              aria-label={`${p.pageNumber}. sayfaya git`}
            >
              {p.thumbUrl || p.url ? (
                <img src={p.thumbUrl || p.url || ""} alt="" className={styles.stripImg} loading="lazy" />
              ) : (
                <span className={styles.stripNum}>{p.pageNumber}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
