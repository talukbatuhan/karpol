// src/components/catalog/CatalogViewer.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { CatalogManifest, CatalogPageAsset } from "@/lib/data/catalog-storage";
import styles from "./CatalogViewer.module.css";

type Props = {
  catalog: CatalogManifest;
  initialPageIndex?: number;
};

export default function CatalogViewer({ catalog, initialPageIndex = 0 }: Props) {
  const t = useTranslations("Catalog");
  const pages = catalog.pages;
  const totalPages = catalog.totalPages;

  const bookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageFlipLoaded, setPageFlipLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPageIndex);
  const [isMobile, setIsMobile] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const usePageFlip = !isMobile;

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Fullscreen listener
  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Initialize PageFlip
  useEffect(() => {
    if (!usePageFlip) {
      setPageFlipLoaded(true);
      return;
    }
    if (!containerRef.current || pages.length === 0) return;

    let pf: any;
    let cancelled = false;
    let rafId: number | null = null;

    import("page-flip").then(({ PageFlip }) => {
      const init = () => {
        if (cancelled || !containerRef.current) return;
        const el = containerRef.current;
        const containerWidth = el.clientWidth;

        // During first paint / layout shifts, width can be 0.
        // Retry on next frame until a valid width is available.
        if (containerWidth < 240) {
          rafId = window.requestAnimationFrame(init);
          return;
        }

        // Remove old instance if any
        el.innerHTML = "";

        const isDouble = !isMobile;
        const rawWidth = isDouble
          ? Math.min(containerWidth / 2, 480)
          : Math.min(containerWidth - 16, 560);

        const w = Math.max(220, Math.floor(rawWidth));
        const h = Math.max(311, Math.floor(w * (297 / 210))); // A4 portrait ratio

        pf = new PageFlip(el, {
          width: w,
          height: h,
          size: "fixed",
          minWidth: isDouble ? 200 : 220,
          minHeight: isDouble ? 283 : 311,
          maxWidth: isDouble ? 480 : 520,
          maxHeight: isDouble ? 679 : 736,
          drawShadow: true,
          flippingTime: 700,
          usePortrait: !isDouble,
          startZIndex: 5,
          autoSize: true,
          showCover: true,
          mobileScrollSupport: false,
          clickEventForward: true,
          useMouseEvents: true,
          swipeDistance: 30,
        });

        // Build page elements
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

        pf.on("flip", (e: any) => {
          setCurrentPage(e.data);
        });

        pf.turnToPage(initialPageIndex);
        bookRef.current = pf;
        setPageFlipLoaded(true);
      };

      init();
    });

    return () => {
      cancelled = true;
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      if (pf) {
        try { pf.destroy?.(); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usePageFlip, isMobile, pages]);

  const onPrev = useCallback(() => {
    if (usePageFlip) {
      bookRef.current?.flipPrev("bottom");
    } else {
      setCurrentPage((prev) => Math.max(0, prev - 1));
    }
  }, [usePageFlip]);
  const onNext = useCallback(() => {
    if (usePageFlip) {
      bookRef.current?.flipNext("bottom");
    } else {
      setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
    }
  }, [usePageFlip, totalPages]);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current?.parentElement;
    if (!el) return;
    try {
      if (!document.fullscreenElement) await el.requestFullscreen();
      else await document.exitFullscreen();
    } catch {}
  }, []);

  // Keyboard
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
        {usePageFlip ? (
          <div ref={containerRef} className={styles.bookContainer} />
        ) : (
          <div className={styles.mobileViewer}>
            {pages[currentPage]?.url ? (
              <img
                src={pages[currentPage].url || ""}
                alt={`Sayfa ${pages[currentPage].pageNumber}`}
                className={styles.mobilePageImg}
                loading="eager"
              />
            ) : (
              <div className={styles.flipPageMissing}>
                <span>{pages[currentPage]?.pageNumber ?? currentPage + 1}</span>
              </div>
            )}
          </div>
        )}
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
                if (usePageFlip) bookRef.current?.turnToPage(idx);
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