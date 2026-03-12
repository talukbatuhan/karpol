"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { ProductSizeRow } from "@/types/database";
import styles from "@/app/product-detail.module.css";

type SpecRow = {
  label: string;
  value: string;
};

type GalleryItem = {
  title: string;
  url: string;
  code?: string;
  specs?: SpecRow[];
};

type ProductInteractivePanelProps = {
  productName: string;
  galleryImages: GalleryItem[];
  specs: SpecRow[];
  sizeTableRows: ProductSizeRow[];
};

const PAGE_SIZE = 10;

function normalizeVariantCode(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export default function ProductInteractivePanel({
  productName,
  galleryImages,
  specs,
  sizeTableRows,
}: ProductInteractivePanelProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [page, setPage] = useState(1);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const selectedItem = galleryImages[selectedIndex] ?? null;
  const selectedCodeRaw = selectedItem?.code?.trim() ?? "";
  const selectedCode = normalizeVariantCode(selectedCodeRaw);
  const selectedSpecs =
    selectedItem?.specs && selectedItem.specs.length > 0 ? selectedItem.specs : specs;
  const pageCount = Math.max(1, Math.ceil(sizeTableRows.length / PAGE_SIZE));

  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sizeTableRows.slice(start, start + PAGE_SIZE);
  }, [page, sizeTableRows]);

  function selectItem(index: number) {
    setSelectedIndex(index);
    const selected = galleryImages[index];
    const code = selected?.code ? normalizeVariantCode(selected.code) : "";
    if (!code) {
      return;
    }
    const rowIndex = sizeTableRows.findIndex(
      (row) => normalizeVariantCode(row.size) === code,
    );
    if (rowIndex >= 0) {
      setPage(Math.floor(rowIndex / PAGE_SIZE) + 1);
    }
  }

  function selectNext() {
    if (galleryImages.length === 0) {
      return;
    }
    const nextIndex = (selectedIndex + 1) % galleryImages.length;
    selectItem(nextIndex);
  }

  function selectPrev() {
    if (galleryImages.length === 0) {
      return;
    }
    const prevIndex = (selectedIndex - 1 + galleryImages.length) % galleryImages.length;
    selectItem(prevIndex);
  }

  function scrollStrip(direction: "left" | "right") {
    if (!stripRef.current) {
      return;
    }
    const amount = direction === "left" ? -360 : 360;
    stripRef.current.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <>
      <section className={styles.gallerySection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.panelTitle}>Ürün Galerisi</h2>
          <span className={styles.itemCount}>{galleryImages.length} Görsel</span>
        </div>
        
        <div className={styles.galleryStripContainer}>
          <button 
            className={styles.navButton} 
            onClick={() => scrollStrip("left")} 
            type="button"
            aria-label="Önceki görseller"
          >
            ←
          </button>
          
          <div className={styles.galleryStrip} ref={stripRef}>
            {galleryImages.map((asset, index) => (
              <button
                key={`${asset.url}-strip-${index}`}
                className={`${styles.stripItem} ${selectedIndex === index ? styles.stripItemActive : ""}`}
                onClick={() => selectItem(index)}
                type="button"
                title={asset.title}
              >
                <div className={styles.stripImageWrapper}>
                  <Image
                    src={asset.url}
                    alt={asset.title}
                    className={styles.stripImage}
                    width={120}
                    height={80}
                  />
                </div>
                {asset.code ? (
                  <span className={styles.stripLabel}>{asset.code}</span>
                ) : null}
              </button>
            ))}
          </div>
          
          <button 
            className={styles.navButton} 
            onClick={() => scrollStrip("right")} 
            type="button"
            aria-label="Sonraki görseller"
          >
            →
          </button>
        </div>
      </section>

      <div className={styles.mainContentGrid}>
        {/* Sol Taraf: Görsel */}
        <section className={styles.visualPanel}>
          <div className={styles.singleMediaFrame}>
            <button 
              className={styles.navOverlayLeft} 
              onClick={selectPrev} 
              type="button"
              aria-label="Önceki görsel"
            >
              ←
            </button>
            
            {selectedItem ? (
              <div className={styles.mediaContainer}>
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  className={styles.singleMediaImage}
                  width={800}
                  height={600}
                  priority
                />
                <div className={styles.mediaCaption}>
                  {selectedItem.title}
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>Görsel seçilmedi</div>
            )}
            
            <button 
              className={styles.navOverlayRight} 
              onClick={selectNext} 
              type="button"
              aria-label="Sonraki görsel"
            >
              →
            </button>
          </div>
        </section>

        {/* Sağ Taraf: Ölçü Tablosu */}
        <section className={styles.dataPanel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Ölçü Tablosu</h2>
            {selectedCodeRaw && (
              <div className={styles.selectedCodeBadge}>
                Seçili: <strong>{selectedCodeRaw}</strong>
              </div>
            )}
          </div>

          {sizeTableRows.length > 0 ? (
            <div className={styles.tableContainer}>
              <div className={styles.tableScrollArea}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Tip</th>
                      <th>Kanat</th>
                      <th>Genişlik</th>
                      <th>İç Çap</th>
                      <th>Dış Çap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((row) => {
                      const isActive =
                        selectedCode.length > 0 &&
                        normalizeVariantCode(row.size) === selectedCode;
                      return (
                        <tr
                          key={row.size}
                          className={isActive ? styles.activeRow : undefined}
                        >
                          <td className={styles.cellPrimary}>{row.size}</td>
                          <td>{row.wing ?? "-"}</td>
                          <td>{row.width}</td>
                          <td>{row.innerDiameter}</td>
                          <td>{row.outerDiameter}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {pageCount > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.paginationButton}
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    type="button"
                  >
                    Önceki
                  </button>
                  <span className={styles.paginationInfo}>
                    Sayfa {page} / {pageCount}
                  </span>
                  <button
                    className={styles.paginationButton}
                    disabled={page === pageCount}
                    onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
                    type="button"
                  >
                    Sonraki
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Ölçü tablosu bilgisi bulunamadı.</p>
            </div>
          )}
        </section>
      </div>

      {/* Alt Kısım: Teknik Özellikler ve Teklif Butonu */}
      <section className={styles.specsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.panelTitle}>Teknik Özellikler</h2>
          <Link 
            href={`/contact?subject=Teklif İsteği: ${productName}${selectedCodeRaw ? ` - ${selectedCodeRaw}` : ""}`}
            className={styles.cta}
          >
            Bu Ürün İçin Teklif İste
          </Link>
        </div>
        {selectedSpecs.length > 0 ? (
          <div className={styles.specsGrid}>
            {selectedSpecs.map((spec) => (
              <div key={spec.label} className={styles.specCard}>
                <div className={styles.specLabel}>{spec.label}</div>
                <div className={styles.specValue}>{spec.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyText}>Teknik özellik bilgisi eklenmemiş.</p>
        )}
      </section>
    </>
  );
}
