"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "@/app/[locale]/products/[category]/[slug]/detail.module.css";

type GalleryItem = {
  title: string;
  url: string;
};

type ProductImageGalleryProps = {
  images: GalleryItem[];
  productName: string;
};

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={styles.mainImageFrame}>
        <div style={{ color: "#94a3b8" }}>No image available</div>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className={styles.visualsSection}>
      <div className={styles.mainImageFrame}>
        <Image
          src={selectedImage.url}
          alt={selectedImage.title || productName}
          fill
          className={styles.mainImage}
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((img, index) => (
            <button
              key={index}
              className={`${styles.thumbBtn} ${
                selectedIndex === index ? styles.thumbBtnActive : ""
              }`}
              onClick={() => setSelectedIndex(index)}
              aria-label={`View image ${index + 1}`}
            >
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image
                  src={img.url}
                  alt={img.title || `Thumbnail ${index + 1}`}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="100px"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
