"use client";

import { useState } from "react";
import styles from "@/app/[locale]/products/[category]/[slug]/detail.module.css";
import ProductImageGallery from "./ProductImageGallery";
import Product3DViewer from "./Product3DViewer";

type GalleryItem = {
  title: string;
  url: string;
};

type ProductVisualsWrapperProps = {
  images: GalleryItem[];
  productName: string;
  model3dUrl?: string | null;
};

export default function ProductVisualsWrapper({
  images,
  productName,
  model3dUrl,
}: ProductVisualsWrapperProps) {
  const [activeTab, setActiveTab] = useState<"gallery" | "3d">("gallery");

  // If no 3D model, just show gallery directly without tabs
  if (!model3dUrl) {
    return <ProductImageGallery images={images} productName={productName} />;
  }

  return (
    <div className={styles.visualsSection}>
      <div className={styles.visualTabs}>
        <button
          className={`${styles.visualTab} ${activeTab === "gallery" ? styles.visualTabActive : ""}`}
          onClick={() => setActiveTab("gallery")}
        >
          📷 Photo Gallery
        </button>
        <button
          className={`${styles.visualTab} ${activeTab === "3d" ? styles.visualTabActive : ""}`}
          onClick={() => setActiveTab("3d")}
        >
          🎲 3D Model
        </button>
      </div>

      {activeTab === "gallery" ? (
        <ProductImageGallery images={images} productName={productName} />
      ) : (
        <Product3DViewer embedUrl={model3dUrl} title={`3D Model - ${productName}`} />
      )}
    </div>
  );
}
