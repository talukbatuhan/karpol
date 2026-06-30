"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type {
  EcatalogLinkPublicView,
  EcatalogPublicView,
} from "@/types/ecatalog";
import { Button } from "@/components/ui/button";
import { ProportionalProductImage } from "@/components/molecules/ProportionalProductImage";
import { EcatalogHotspotIcon } from "@/components/ecatalog/EcatalogHotspotMarker";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

type CatalogPage = {
  image: string;
  links: EcatalogLinkPublicView[];
};

export interface EcatalogBookReaderProps {
  catalog: EcatalogPublicView;
}

function EcatalogProductHotspot({
  link,
  goToProductLabel,
  goToProductHint,
}: {
  link: EcatalogLinkPublicView;
  goToProductLabel: string;
  goToProductHint: string;
}) {
  if (!link.productSlug?.trim()) return null;

  const title = link.label ?? link.productTitle ?? link.productSlug;

  return (
    <Link
      href={`/products/${link.productSlug}`}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className="group absolute z-10 flex items-center justify-center"
      style={{
        left: `${link.x}%`,
        top: `${link.y}%`,
        width: `${link.w}%`,
        height: `${link.h}%`,
      }}
    >
      <span className="sr-only">
        {goToProductLabel}: {title}
      </span>
      <EcatalogHotspotIcon complete hint={goToProductHint} />
    </Link>
  );
}

function buildPages(catalog: EcatalogPublicView): CatalogPage[] {
  const pages: CatalogPage[] = [];

  for (const spread of catalog.spreads) {
    const leftLinks = spread.links.filter((link) => link.side === "left");
    const rightLinks = spread.links.filter((link) => link.side === "right");

    if (spread.leftImage && spread.rightImage) {
      pages.push({ image: spread.leftImage, links: leftLinks });
      pages.push({ image: spread.rightImage, links: rightLinks });
      continue;
    }

    const image = spread.leftImage ?? spread.rightImage;
    if (!image) continue;

    pages.push({
      image,
      links: spread.links,
    });
  }

  return pages;
}

function EcatalogPageSurface({
  page,
  goToProductLabel,
  goToProductHint,
  fillViewport = false,
}: {
  page: CatalogPage;
  goToProductLabel: string;
  goToProductHint: string;
  fillViewport?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative w-full bg-ivory-100",
        fillViewport
          ? "flex h-full min-h-0 items-center justify-center"
          : "aspect-[3/4]",
      )}
    >
      <ProportionalProductImage
        src={page.image}
        alt=""
        sizes={fillViewport ? "100vw" : "(max-width: 1024px) 100vw, 50vw"}
        className={
          fillViewport
            ? "max-h-full max-w-full object-contain"
            : "h-full w-full object-contain"
        }
      />
      {page.links.map((link) => (
        <EcatalogProductHotspot
          key={link.id}
          link={link}
          goToProductLabel={goToProductLabel}
          goToProductHint={goToProductHint}
        />
      ))}
    </div>
  );
}

export function EcatalogBookReader({ catalog }: EcatalogBookReaderProps) {
  const t = useTranslations("catalogPage");
  const pages = useMemo(() => buildPages(catalog), [catalog]);
  const [pageIndex, setPageIndex] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const step = isDesktop ? 2 : 1;
  const maxIndex = isDesktop
    ? pages.length <= 1
      ? 0
      : pages.length % 2 === 0
        ? pages.length - 2
        : pages.length - 1
    : Math.max(0, pages.length - 1);

  const safeIndex = Math.min(pageIndex, maxIndex);
  const leftPage = pages[safeIndex];
  const rightPage = isDesktop ? pages[safeIndex + 1] : null;

  const goPrev = useCallback(() => {
    setPageIndex((index) => Math.max(0, index - step));
  }, [step]);

  const goNext = useCallback(() => {
    setPageIndex((index) => Math.min(maxIndex, index + step));
  }, [maxIndex, step]);

  useEffect(() => {
    setPageIndex((index) => Math.min(index, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  if (pages.length === 0) {
    return (
      <div className="col-span-12 border border-navy-800/20 bg-ivory-100 px-8 py-16 text-center">
        <p className="font-sans text-navy-800/80">{t("readerEmpty")}</p>
        <Link
          href="/e-katalog"
          className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-gold-600 underline"
        >
          {t("backToCatalogs")}
        </Link>
      </div>
    );
  }

  const displayCurrent = isDesktop
    ? `${safeIndex + 1}${rightPage ? `–${safeIndex + 2}` : ""}`
    : String(safeIndex + 1);

  const pageLabel = t("pageOf", {
    current: displayCurrent,
    total: pages.length,
  });

  const mobilePage = pages[safeIndex];
  const hotspotLabels = {
    goToProductLabel: t("goToProduct"),
    goToProductHint: t("goToProductHint"),
  };

  const navButtonClass =
    "h-10 w-10 shrink-0 border-navy-800/30 bg-ivory-50/95 text-navy-950 hover:border-gold-500 hover:bg-ivory-100 hover:text-navy-950 disabled:opacity-40";

  if (!isDesktop) {
    return (
      <div className="col-span-12">
        <div className="fixed inset-0 z-40 flex h-[100dvh] flex-col bg-[#1a1208]">
          <header className="flex shrink-0 items-center gap-2 border-b border-navy-800 bg-navy-900 px-3 py-2.5">
            <Link
              href="/e-katalog"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-gold-300"
              aria-label={t("backToCatalogs")}
            >
              <X className="h-4 w-4 shrink-0" aria-hidden />
              <span className="max-w-[40vw] truncate">{t("backToCatalogs")}</span>
            </Link>
            <div className="min-w-0 flex-1 text-center">
              <p className="truncate font-display text-sm font-bold text-ivory-50">
                {catalog.title}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-gold-400/90">
                {pageLabel}
              </p>
            </div>
            <span className="w-8 shrink-0" aria-hidden />
          </header>

          <div className="relative flex min-h-0 flex-1 items-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={safeIndex <= 0}
              onClick={goPrev}
              aria-label={t("previousPage")}
              className={cn("absolute left-2 z-20", navButtonClass)}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </Button>

            <div className="h-full min-h-0 w-full px-12">
              {mobilePage ? (
                <EcatalogPageSurface
                  page={mobilePage}
                  fillViewport
                  {...hotspotLabels}
                />
              ) : null}
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={safeIndex >= maxIndex}
              onClick={goNext}
              aria-label={t("nextPage")}
              className={cn("absolute right-2 z-20", navButtonClass)}
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/e-katalog"
          className="font-mono text-xs uppercase tracking-widest text-navy-800 underline decoration-gold-500 underline-offset-4"
        >
          ← {t("backToCatalogs")}
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-widest text-navy-800/70">
          {pageLabel}
        </p>
      </div>

      <div className="mx-auto flex max-w-5xl items-center gap-2 sm:gap-3 md:gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={safeIndex <= 0}
          onClick={goPrev}
          aria-label={t("previousPage")}
          className={navButtonClass}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </Button>

        <div className="min-w-0 flex-1 overflow-hidden border border-navy-800 bg-navy-950 shadow-[12px_12px_0_rgba(201,162,39,0.15)]">
          <div className="border-b border-navy-800 bg-navy-900 px-4 py-3">
            <h1 className="font-display text-lg font-bold text-ivory-50 md:text-xl">
              {catalog.title}
            </h1>
            {catalog.year ? (
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-gold-400">
                {catalog.year}
              </p>
            ) : null}
          </div>

          <div className="bg-[#1a1208] p-3 md:p-6">
            <div
              className={`grid gap-px bg-navy-800/50 ${
                rightPage ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              {leftPage ? (
                <EcatalogPageSurface page={leftPage} {...hotspotLabels} />
              ) : null}
              {rightPage ? (
                <EcatalogPageSurface page={rightPage} {...hotspotLabels} />
              ) : null}
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={safeIndex >= maxIndex}
          onClick={goNext}
          aria-label={t("nextPage")}
          className={navButtonClass}
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
