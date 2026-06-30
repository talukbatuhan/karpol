"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import type {
  EcatalogLinkPublicView,
  EcatalogPublicView,
} from "@/types/ecatalog";
import { Button } from "@/components/ui/button";
import { ProportionalProductImage } from "@/components/molecules/ProportionalProductImage";

type BookPage = {
  spreadIndex: number;
  side: "left" | "right";
  image: string;
  links: EcatalogLinkPublicView[];
};

export interface EcatalogBookReaderProps {
  catalog: EcatalogPublicView;
  labels: {
    back: string;
    previous: string;
    next: string;
    spreadOf: string;
    goToProduct: string;
    empty: string;
  };
}

function buildPages(catalog: EcatalogPublicView): BookPage[] {
  const pages: BookPage[] = [];

  catalog.spreads.forEach((spread, spreadIndex) => {
    if (spread.leftImage) {
      pages.push({
        spreadIndex,
        side: "left",
        image: spread.leftImage,
        links: spread.links.filter((link) => link.side === "left"),
      });
    }
    if (spread.rightImage) {
      pages.push({
        spreadIndex,
        side: "right",
        image: spread.rightImage,
        links: spread.links.filter((link) => link.side === "right"),
      });
    }
  });

  return pages;
}

function EcatalogPageSurface({
  page,
  goToProductLabel,
}: {
  page: BookPage;
  goToProductLabel: string;
}) {
  return (
    <div className="relative aspect-[3/4] w-full bg-ivory-100 lg:aspect-[2/3]">
      <ProportionalProductImage
        src={page.image}
        alt=""
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="h-full w-full object-contain"
      />
      {page.links.map((link) => (
        <Link
          key={link.id}
          href={`/products/${link.productSlug}`}
          title={link.label ?? link.productTitle ?? link.productSlug}
          className="absolute z-10 border border-gold-500/70 bg-gold-400/20 transition-colors hover:border-gold-500 hover:bg-gold-400/40"
          style={{
            left: `${link.x}%`,
            top: `${link.y}%`,
            width: `${link.w}%`,
            height: `${link.h}%`,
          }}
        >
          <span className="sr-only">
            {goToProductLabel}: {link.label ?? link.productTitle ?? link.productSlug}
          </span>
        </Link>
      ))}
    </div>
  );
}

export function EcatalogBookReader({ catalog, labels }: EcatalogBookReaderProps) {
  const pages = useMemo(() => buildPages(catalog), [catalog]);
  const [pageIndex, setPageIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const spreadCount = catalog.spreads.length;
  const currentSpreadIndex = isDesktop
    ? Math.min(
        Math.floor(pageIndex / 2),
        Math.max(0, spreadCount - 1),
      )
    : pages[pageIndex]?.spreadIndex ?? 0;

  const currentSpread = catalog.spreads[currentSpreadIndex];

  const goPrev = useCallback(() => {
    setPageIndex((index) => Math.max(0, index - (isDesktop ? 2 : 1)));
  }, [isDesktop]);

  const goNext = useCallback(() => {
    setPageIndex((index) => {
      const step = isDesktop ? 2 : 1;
      const max = isDesktop ? Math.max(0, pages.length - 2) : pages.length - 1;
      return Math.min(max, index + step);
    });
  }, [isDesktop, pages.length]);

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
        <p className="font-sans text-navy-800/80">{labels.empty}</p>
        <Link
          href="/e-katalog"
          className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-gold-600 underline"
        >
          {labels.back}
        </Link>
      </div>
    );
  }

  const pageLabel = isDesktop
    ? labels.spreadOf
        .replace("{current}", String(currentSpreadIndex + 1))
        .replace("{total}", String(spreadCount))
    : labels.spreadOf
        .replace("{current}", String(pageIndex + 1))
        .replace("{total}", String(pages.length));

  const mobilePage = pages[pageIndex];

  return (
    <div className="col-span-12 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/e-katalog"
          className="font-mono text-xs uppercase tracking-widest text-navy-800 underline decoration-gold-500 underline-offset-4"
        >
          ← {labels.back}
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-widest text-navy-800/70">
          {pageLabel}
        </p>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden border border-navy-800 bg-navy-950 shadow-[12px_12px_0_rgba(201,162,39,0.15)]">
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
            {isDesktop && currentSpread ? (
              <div className="grid grid-cols-2 gap-px bg-navy-800/50">
                {currentSpread.leftImage ? (
                  <EcatalogPageSurface
                    page={{
                      spreadIndex: currentSpreadIndex,
                      side: "left",
                      image: currentSpread.leftImage,
                      links: currentSpread.links.filter((l) => l.side === "left"),
                    }}
                    goToProductLabel={labels.goToProduct}
                  />
                ) : (
                  <div className="aspect-[2/3] bg-ivory-50/5" />
                )}
                {currentSpread.rightImage ? (
                  <EcatalogPageSurface
                    page={{
                      spreadIndex: currentSpreadIndex,
                      side: "right",
                      image: currentSpread.rightImage,
                      links: currentSpread.links.filter((l) => l.side === "right"),
                    }}
                    goToProductLabel={labels.goToProduct}
                  />
                ) : (
                  <div className="aspect-[2/3] bg-ivory-50/5" />
                )}
              </div>
            ) : mobilePage ? (
              <EcatalogPageSurface
                page={mobilePage}
                goToProductLabel={labels.goToProduct}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pageIndex <= 0}
          onClick={goPrev}
          className="font-mono text-xs uppercase tracking-widest"
        >
          {labels.previous}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={
            isDesktop
              ? pageIndex >= Math.max(0, pages.length - 2)
              : pageIndex >= pages.length - 1
          }
          onClick={goNext}
          className="font-mono text-xs uppercase tracking-widest"
        >
          {labels.next}
        </Button>
      </div>
    </div>
  );
}
