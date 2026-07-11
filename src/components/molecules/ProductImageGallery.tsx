"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { resolveProductImageUrl } from "@/lib/product-image";
import { imagePathToLabel } from "@/lib/product-image-label";
import { PRODUCT_MEDIA_ASPECT_CLASS } from "@/lib/product-media";
import { ProductMediaFrame } from "@/components/molecules/ProductMediaFrame";
import { ProportionalProductImage } from "@/components/molecules/ProportionalProductImage";
import { cn } from "@/lib/utils";

export interface ProductImageGalleryProps {
  title: string;
  frameTitle: string;
  galleryLabel: string;
  imagePaths: string[];
  alt: string;
}

type GalleryItem = { path: string; url: string; label: string };

function prefetchUrl(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
}

export function ProductImageGallery({
  title,
  frameTitle,
  galleryLabel,
  imagePaths,
  alt,
}: ProductImageGalleryProps) {
  const t = useTranslations("productsPage");

  const items = useMemo(
    () =>
      imagePaths
        .map((path) => {
          const url = resolveProductImageUrl(path);
          if (!url) return null;
          return {
            path,
            url,
            label: imagePathToLabel(path),
          };
        })
        .filter((item): item is GalleryItem => Boolean(item)),
    [imagePaths],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedUrls, setLoadedUrls] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const tagRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prefetchedRef = useRef<Set<string>>(new Set());

  const itemCount = items.length;
  const hasMultiple = itemCount > 1;
  const safeIndex =
    itemCount === 0 ? 0 : Math.min(activeIndex, itemCount - 1);
  const active = items[safeIndex] ?? null;
  const isActiveLoaded = active ? loadedUrls.has(active.url) : false;

  function markLoaded(url: string) {
    setLoadedUrls((prev) => {
      if (prev.has(url)) return prev;
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  }

  function selectIndex(index: number) {
    setActiveIndex(index);
    const tag = tagRefs.current[index];
    tag?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  useEffect(() => {
    if (!hasMultiple) return;

    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        selectIndex(safeIndex <= 0 ? itemCount - 1 : safeIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        selectIndex(safeIndex >= itemCount - 1 ? 0 : safeIndex + 1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hasMultiple, itemCount, safeIndex]);

  useEffect(() => {
    if (itemCount === 0) return;

    const indexes = [safeIndex, safeIndex - 1, safeIndex + 1, safeIndex + 2]
      .filter((index, pos, list) => list.indexOf(index) === pos)
      .filter((index) => index >= 0 && index < itemCount);

    for (const index of indexes) {
      const url = items[index]?.url;
      if (!url || prefetchedRef.current.has(url)) continue;
      prefetchedRef.current.add(url);
      void prefetchUrl(url);
    }
  }, [items, itemCount, safeIndex]);

  if (!active) return null;

  function goPrev() {
    selectIndex(safeIndex <= 0 ? itemCount - 1 : safeIndex - 1);
  }

  function goNext() {
    selectIndex(safeIndex >= itemCount - 1 ? 0 : safeIndex + 1);
  }

  const arrowClass =
    "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-gold-500/50 bg-navy-950/85 text-gold-300 transition-colors hover:border-gold-500 hover:bg-navy-950 hover:text-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500";

  const tagStrip = hasMultiple ? (
    <div
      className="flex flex-nowrap gap-1.5 overflow-x-auto pb-1"
      role="listbox"
      aria-label={galleryLabel}
    >
      {items.map((item, index) => (
        <button
          key={`${item.path}-${index}`}
          ref={(el) => {
            tagRefs.current[index] = el;
          }}
          type="button"
          role="option"
          aria-selected={safeIndex === index}
          aria-label={item.label}
          onClick={() => selectIndex(index)}
          className={cn(
            "shrink-0 border px-2.5 py-1.5 text-left font-mono text-[10px] uppercase tracking-widest transition-colors",
            safeIndex === index
              ? "border-gold-500 bg-navy-950 text-gold-300"
              : "border-navy-800/30 bg-ivory-50 text-navy-800 hover:border-gold-500/50",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  ) : null;

  return (
    <div aria-label={title}>
      <ProductMediaFrame
        title={frameTitle}
        titleEnd={
          hasMultiple
            ? t("productGalleryCounter", {
                current: safeIndex + 1,
                total: itemCount,
              })
            : undefined
        }
        footer={tagStrip}
      >
        <div
          className={cn(
            "relative w-full min-w-0",
            PRODUCT_MEDIA_ASPECT_CLASS,
          )}
        >
          <ProportionalProductImage
            src={active.url}
            alt={`${alt} — ${active.label}`}
            sizes="(max-width: 768px) 100vw, 40vw"
            priority={safeIndex === 0}
            fill
            className={cn(
              "transition-opacity duration-200",
              isActiveLoaded ? "opacity-100" : "opacity-0",
            )}
            onLoad={() => {
              markLoaded(active.url);
            }}
          />

          {!isActiveLoaded ? (
            <div
              className="absolute inset-0 z-[5] flex items-center justify-center bg-navy-950/[0.04]"
              aria-busy="true"
              aria-live="polite"
            >
              <Loader2
                className="h-8 w-8 animate-spin text-gold-500"
                aria-hidden
              />
              <span className="sr-only">{t("productGalleryLoading")}</span>
            </div>
          ) : null}

          {hasMultiple ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label={t("productGalleryPrevious")}
                className={cn(arrowClass, "left-2")}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>

              <button
                type="button"
                onClick={goNext}
                aria-label={t("productGalleryNext")}
                className={cn(arrowClass, "right-2")}
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </>
          ) : null}
        </div>
      </ProductMediaFrame>
    </div>
  );
}
