"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  LayoutList,
  Share2,
  Download,
} from "lucide-react";
import styles from "./CatalogViewer.module.css";

type Props = {
  pageIndex: number;
  totalPages: number;
  zoom: number;
  thumbsOpen: boolean;
  fullscreen: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleThumbs: () => void;
  onToggleFullscreen: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onGoToPage: (pageNumber: number) => void;
  onShare: () => void;
  onDownloadPage: () => void;
  isShareSupported: boolean;
  copied: boolean;
};

export default function CatalogToolbar({
  pageIndex,
  totalPages,
  zoom,
  thumbsOpen,
  fullscreen,
  onPrev,
  onNext,
  onToggleThumbs,
  onToggleFullscreen,
  onZoomIn,
  onZoomOut,
  onGoToPage,
  onShare,
  onDownloadPage,
  isShareSupported,
  copied,
}: Props) {
  const t = useTranslations("Catalog");
  const [goToInput, setGoToInput] = useState<string>("");

  useEffect(() => {
    // Keep input in sync when user changes pages via buttons/swipe.
    setGoToInput(String(pageIndex + 1));
  }, [pageIndex]);

  const submitGoTo = () => {
    const n = Number(goToInput);
    if (!Number.isFinite(n)) return;
    const safe = Math.max(1, Math.min(totalPages, n));
    onGoToPage(safe);
  };

  return (
    <div className={`${styles.toolbar} ${fullscreen ? styles.toolbarFullscreen : ""}`}>
      <div className={styles.toolbarLeft}>
        <button
          className={styles.toolbarBtn}
          onClick={onPrev}
          disabled={pageIndex <= 0}
          aria-label={t("toolbar.previous")}
          title={t("toolbar.previous")}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          className={styles.toolbarBtn}
          onClick={onNext}
          disabled={pageIndex >= totalPages - 1}
          aria-label={t("toolbar.next")}
          title={t("toolbar.next")}
        >
          <ChevronRight size={18} />
        </button>

        <div className={styles.pageCounter} aria-label="Page counter">
          <span className={styles.pageCounterLabel}>{t("toolbar.page")}</span>
          <span className={styles.pageCounterValue}>
            {pageIndex + 1} <span className={styles.pageCounterMuted}>/ {totalPages}</span>
          </span>
        </div>
      </div>

      <div className={styles.toolbarCenter}>
        <div className={styles.zoomGroup}>
          <button
            className={styles.zoomBtn}
            onClick={onZoomOut}
            disabled={zoom <= 1}
            aria-label={t("toolbar.zoom_out")}
            title={t("toolbar.zoom_out")}
          >
            <Minus size={16} />
          </button>
          <div className={styles.zoomReadout} aria-label="Zoom level">
            {Math.round(zoom * 100)}%
          </div>
          <button
            className={styles.zoomBtn}
            onClick={onZoomIn}
            disabled={zoom >= 3}
            aria-label={t("toolbar.zoom_in")}
            title={t("toolbar.zoom_in")}
          >
            <Plus size={16} />
          </button>
        </div>

        <div className={styles.goToGroup}>
          <label className={styles.goToLabel} htmlFor="goToPageInput">
            {t("toolbar.go_to")}
          </label>
          <div className={styles.goToControls}>
            <input
              id="goToPageInput"
              className={styles.goToInput}
              inputMode="numeric"
              value={goToInput}
              onChange={(e) => setGoToInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitGoTo();
              }}
              aria-label="Go to page"
            />
            <button className={styles.goToGoBtn} onClick={submitGoTo}>
              Go
            </button>
          </div>
        </div>
      </div>

      <div className={styles.toolbarRight}>
        <button
          className={styles.toolbarBtn}
          onClick={onToggleThumbs}
          aria-label={t("toolbar.thumbnails")}
          title={t("toolbar.thumbnails")}
          data-active={thumbsOpen ? "true" : "false"}
        >
          <LayoutList size={18} />
        </button>

        <button
          className={styles.toolbarBtn}
          onClick={onZoomIn}
          style={{ display: "none" }}
          aria-hidden="true"
        >
          <Plus size={18} />
        </button>

        <button
          className={styles.toolbarBtn}
          onClick={onToggleFullscreen}
          aria-label={fullscreen ? t("toolbar.exit_fullscreen") : t("toolbar.fullscreen")}
          title={fullscreen ? t("toolbar.exit_fullscreen") : t("toolbar.fullscreen")}
        >
          {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>

        <button
          className={styles.toolbarBtn}
          onClick={onDownloadPage}
          aria-label={t("toolbar.download_page")}
          title={t("toolbar.download_page")}
        >
          <Download size={18} />
        </button>

        <button
          className={styles.toolbarBtn}
          onClick={onShare}
          aria-label={t("toolbar.share")}
          title={t("toolbar.share")}
          disabled={!isShareSupported}
        >
          <Share2 size={18} />
          {copied && <span className={styles.copiedPill}>{t("toolbar.copied")}</span>}
        </button>
      </div>
    </div>
  );
}

