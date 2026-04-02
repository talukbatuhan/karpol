"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./CatalogViewer.module.css";
import CatalogToolbar from "./CatalogToolbar";
import CatalogThumbnails from "./CatalogThumbnails";
import type { CatalogManifest, CatalogPageAsset } from "@/lib/data/catalog-storage";
import type { PointerEvent } from "react";

type Props = {
  catalog: CatalogManifest;
  initialPageIndex?: number; // 0-based
};

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.25;

export default function CatalogViewer({
  catalog,
  initialPageIndex = 0,
}: Props) {
  const t = useTranslations("Catalog");
  const pages = catalog.pages;
  const totalPages = catalog.totalPages;

  const [pageIndex, setPageIndex] = useState<number>(
    Math.max(0, Math.min(totalPages - 1, initialPageIndex)),
  );
  const [direction, setDirection] = useState<1 | -1>(1);

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [thumbsOpen, setThumbsOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [imageError, setImageError] = useState<boolean>(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const currentPage: CatalogPageAsset | null = pages[pageIndex] ?? null;

  const isShareSupported = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const hasShare = typeof (navigator as any).share === "function";
    const hasClipboard = typeof (navigator as any).clipboard?.writeText === "function";
    return hasShare || hasClipboard;
  }, []);

  const goToIndex = useCallback(
    (idx: number) => {
      const safe = Math.max(0, Math.min(totalPages - 1, idx));
      if (safe === pageIndex) return;
      setDirection(safe > pageIndex ? 1 : -1);
      setPageIndex(safe);
      setPan({ x: 0, y: 0 });
      setZoom(1);
      setImageError(false);
    },
    [pageIndex, totalPages],
  );

  const onPrev = useCallback(() => goToIndex(pageIndex - 1), [goToIndex, pageIndex]);
  const onNext = useCallback(() => goToIndex(pageIndex + 1), [goToIndex, pageIndex]);

  const onZoomIn = useCallback(() => {
    setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 100) / 100));
    setPan({ x: 0, y: 0 });
    setImageError(false);
  }, []);

  const onZoomOut = useCallback(() => {
    setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 100) / 100));
    setPan({ x: 0, y: 0 });
    setImageError(false);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = stageRef.current;
    if (!el) return;

    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore if browser blocks fullscreen.
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Keyboard navigation.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Avoid interfering with typing into inputs.
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "+" || e.key === "=") onZoomIn();
      if (e.key === "-" || e.key === "_") onZoomOut();
      if (e.key === "Escape" && thumbsOpen) setThumbsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onNext, onPrev, onZoomIn, onZoomOut, thumbsOpen]);

  // Preload next/prev to feel instant.
  useEffect(() => {
    const preload = (idx: number) => {
      const url = pages[idx]?.url;
      if (!url) return;
      const img = new Image();
      img.decoding = "async";
      img.src = url;
    };
    preload(pageIndex + 1);
    preload(pageIndex - 1);
  }, [pageIndex, pages]);

  const onShare = useCallback(async () => {
    const url = window.location.href;
    try {
      const res = (navigator as any).share;
      if (typeof res === "function") {
        await res.call(navigator, { title: t("title"), url });
        return;
      }
    } catch {
      // fallback below
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Ignore; UI will remain.
    }
  }, [t]);

  const onDownloadPage = useCallback(() => {
    const url = currentPage?.url;
    if (!url) return;

    // Simple "download" strategy: open in new tab (browser handles download policy).
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  }, [currentPage]);

  // Swipe / pan: swipe when zoom === 1, drag-to-pan when zoom > 1.
  const gestureRef = useRef<{
    mode: "none" | "swipe" | "pan";
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
  }>({
    mode: "none",
    startX: 0,
    startY: 0,
    startPanX: 0,
    startPanY: 0,
  });

  const onPointerDown = (e: PointerEvent) => {
    if (!stageRef.current) return;
    (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);

    const isPan = zoom > 1.01;
    gestureRef.current.mode = isPan ? "pan" : "swipe";
    gestureRef.current.startX = e.clientX;
    gestureRef.current.startY = e.clientY;
    gestureRef.current.startPanX = pan.x;
    gestureRef.current.startPanY = pan.y;
    setImageError(false);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (gestureRef.current.mode !== "pan") return;
    const dx = e.clientX - gestureRef.current.startX;
    const dy = e.clientY - gestureRef.current.startY;
    setPan({
      x: gestureRef.current.startPanX + dx,
      y: gestureRef.current.startPanY + dy,
    });
  };

  const onPointerUp = (e: PointerEvent) => {
    const mode = gestureRef.current.mode;
    gestureRef.current.mode = "none";

    if (mode !== "swipe") return;
    const dx = e.clientX - gestureRef.current.startX;
    const dy = e.clientY - gestureRef.current.startY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // Swipe threshold: avoid accidental moves.
    if (absX < 60 || absX < absY) return;
    if (dx < 0) onNext();
    else onPrev();
  };

  const pageVariants = useMemo(() => {
    return {
      initial: (custom: 1 | -1) => ({
        opacity: 0,
        x: custom * 70,
        rotateY: custom * -10,
      }),
      animate: { opacity: 1, x: 0, rotateY: 0 },
      exit: (custom: 1 | -1) => ({
        opacity: 0,
        x: custom * -70,
        rotateY: custom * 10,
      }),
    };
  }, []);

  if (!pages.length) {
    return (
      <div className={styles.shell}>
        <div className={styles.empty}>
          <div className={styles.emptyTitle}>{t("loading")}</div>
          <div className={styles.emptySub}>{t("error")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell} aria-label="E-catalog viewer">
      <div className={styles.viewerOuter}>
        <CatalogThumbnails
          pages={pages}
          currentIndex={pageIndex}
          onSelect={(idx) => goToIndex(idx)}
          thumbsOpen={thumbsOpen}
        />

        <div
          className={styles.stageWrap}
          style={{ paddingTop: thumbsOpen ? 6 : 6 }}
        >
          <div className={styles.stageFrame}>
            <CatalogToolbar
              pageIndex={pageIndex}
              totalPages={totalPages}
              zoom={zoom}
              thumbsOpen={thumbsOpen}
              fullscreen={isFullscreen}
              onPrev={onPrev}
              onNext={onNext}
              onToggleThumbs={() => setThumbsOpen((v) => !v)}
              onToggleFullscreen={toggleFullscreen}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              onGoToPage={(n) => goToIndex(n - 1)}
              onShare={onShare}
              onDownloadPage={onDownloadPage}
              isShareSupported={isShareSupported}
              copied={copied}
            />

            <div
              ref={stageRef}
              className={styles.stage}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onDoubleClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
                setImageError(false);
              }}
              role="application"
              aria-label="Catalog page stage"
            >
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={pageIndex}
                  className={styles.pageMotion}
                  custom={direction}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className={styles.pageViewport}>
                    {currentPage?.url && !imageError ? (
                      <img
                        src={currentPage.url}
                        alt={`Catalog page ${currentPage.pageNumber}`}
                        className={styles.pageImage}
                        draggable={false}
                        onError={() => setImageError(true)}
                        style={{
                          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                        }}
                      />
                    ) : (
                      <div className={styles.missingState}>
                        <div className={styles.missingTitle}>
                          {t("missing_image")}
                        </div>
                        <div className={styles.missingSub}>
                          {currentPage ? `#${currentPage.pageNumber}` : ""}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

