"use client";
"use no memo";

import { useState } from "react";
import Image from "next/image";
import { Maximize2, Image as ImageIcon, Box } from "lucide-react";
import ProductLightbox, { type LightboxImage } from "./ProductLightbox";
import Product3DViewer, { type Product3DSource } from "./Product3DViewer";

export type GalleryItem = {
  title: string;
  url: string;
  type?: "photo" | "technical" | "application";
};

type ProductVisualsWrapperProps = {
  images: GalleryItem[];
  productName: string;
  model3d?: Product3DSource | null;
};

export default function ProductVisualsWrapper({
  images,
  productName,
  model3d,
}: ProductVisualsWrapperProps) {
  const has3D = !!(model3d && (model3d.glbUrl || model3d.embedUrl));
  const [tab, setTab] = useState<"gallery" | "3d">(has3D && images.length === 0 ? "3d" : "gallery");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lbOpen, setLbOpen] = useState(false);

  const lightboxImages: LightboxImage[] = images.map((img) => ({
    url: img.url,
    title: img.title,
  }));

  const openLightbox = (i: number) => {
    setActiveIndex(i);
    setLbOpen(true);
  };
  const next = () =>
    setActiveIndex((i) => (i + 1) % Math.max(images.length, 1));
  const prev = () =>
    setActiveIndex(
      (i) => (i - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1),
    );

  if (images.length === 0 && !has3D) {
    return (
      <div className="pd-vis-empty">
        <ImageIcon size={28} strokeWidth={1.4} opacity={0.3} />
        <span>Görsel bulunmuyor</span>
        <style jsx>{`
          .pd-vis-empty {
            aspect-ratio: 4 / 3;
            border-radius: 16px;
            border: 1px dashed rgba(15, 23, 41, 0.14);
            background: rgba(244, 241, 234, 0.55);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-family: 'DM Sans', sans-serif;
            font-size: 12px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: rgba(100, 116, 139, 0.7);
          }
        `}</style>
      </div>
    );
  }

  const active = images[activeIndex] ?? images[0];

  return (
    <div className="pd-vis">
      {has3D && images.length > 0 && (
        <div className="pd-vis-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "gallery"}
            className={`pd-vis-tab ${tab === "gallery" ? "is-active" : ""}`}
            onClick={() => setTab("gallery")}
          >
            <ImageIcon size={13} strokeWidth={1.6} />
            Galeri
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "3d"}
            className={`pd-vis-tab ${tab === "3d" ? "is-active" : ""}`}
            onClick={() => setTab("3d")}
          >
            <Box size={13} strokeWidth={1.6} />
            3D Model
          </button>
        </div>
      )}

      {tab === "gallery" && images.length > 0 && (
        <>
          <div className="pd-vis-stage">
            <button
              type="button"
              className="pd-vis-stage-btn"
              onClick={() => openLightbox(activeIndex)}
              aria-label="Tam ekran"
            >
              <Image
                src={active.url}
                alt={active.title || productName}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: "contain" }}
              />
              <span className="pd-vis-zoom">
                <Maximize2 size={14} strokeWidth={1.6} />
              </span>
            </button>
          </div>

          {images.length > 1 && (
            <div className="pd-vis-thumbs">
              {images.map((img, i) => (
                <button
                  key={`${img.url}-${i}`}
                  type="button"
                  className={`pd-vis-thumb ${i === activeIndex ? "is-active" : ""}`}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`${i + 1}. görsel`}
                >
                  <Image
                    src={img.url}
                    alt={img.title || `${i + 1}`}
                    fill
                    sizes="120px"
                    style={{ objectFit: "contain" }}
                  />
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "3d" && has3D && model3d && (
        <Product3DViewer source={model3d} title={`${productName} – 3D`} />
      )}

      <ProductLightbox
        open={lbOpen}
        images={lightboxImages}
        index={activeIndex}
        onClose={() => setLbOpen(false)}
        onPrev={prev}
        onNext={next}
      />

      <style jsx>{`
        .pd-vis {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .pd-vis-tabs {
          display: inline-flex;
          gap: 4px;
          padding: 4px;
          border: 1px solid rgba(15, 23, 41, 0.10);
          border-radius: 100px;
          background: rgba(244, 241, 234, 0.6);
          align-self: flex-start;
        }
        .pd-vis-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 100px;
          background: transparent;
          border: none;
          color: rgba(71, 85, 105, 0.85);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pd-vis-tab:hover { color: rgba(15, 23, 41, 0.94); }
        .pd-vis-tab.is-active {
          background: rgba(200, 168, 90, 0.18);
          color: rgba(15, 23, 41, 0.96);
        }
        .pd-vis-stage {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(244, 241, 234, 0.85));
          border: 1px solid rgba(15, 23, 41, 0.08);
        }
        .pd-vis-stage-btn {
          position: absolute;
          inset: 0;
          padding: 32px;
          background: transparent;
          border: none;
          cursor: zoom-in;
        }
        .pd-vis-zoom {
          position: absolute;
          right: 16px;
          bottom: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(15, 23, 41, 0.92);
          border: 1px solid rgba(200, 168, 90, 0.45);
          color: rgba(200, 168, 90, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .pd-vis-stage-btn:hover .pd-vis-zoom { opacity: 1; }
        .pd-vis-thumbs {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 10px;
        }
        .pd-vis-thumb {
          position: relative;
          aspect-ratio: 1;
          padding: 10px;
          border-radius: 10px;
          background: rgba(244, 241, 234, 0.65);
          border: 1px solid rgba(15, 23, 41, 0.08);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pd-vis-thumb:hover {
          border-color: rgba(200, 168, 90, 0.45);
        }
        .pd-vis-thumb.is-active {
          border-color: rgba(200, 168, 90, 0.85);
          background: rgba(200, 168, 90, 0.10);
        }
      `}</style>
    </div>
  );
}
