"use client";
"use no memo";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type LightboxImage = {
  url: string;
  title?: string;
};

type ProductLightboxProps = {
  open: boolean;
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function ProductLightbox({
  open,
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: ProductLightboxProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [open, onClose, onPrev, onNext],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, handleKey]);

  if (!open || images.length === 0) return null;

  const current = images[index];

  return (
    <div className="pd-lb" role="dialog" aria-modal="true" onClick={onClose}>
      <button
        type="button"
        className="pd-lb-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Kapat"
      >
        <X size={20} strokeWidth={1.6} />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="pd-lb-nav pd-lb-prev"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Önceki"
          >
            <ChevronLeft size={26} strokeWidth={1.4} />
          </button>
          <button
            type="button"
            className="pd-lb-nav pd-lb-next"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Sonraki"
          >
            <ChevronRight size={26} strokeWidth={1.4} />
          </button>
        </>
      )}

      <div className="pd-lb-stage" onClick={(e) => e.stopPropagation()}>
        <div className="pd-lb-image-wrap">
          <Image
            src={current.url}
            alt={current.title ?? "Ürün görseli"}
            fill
            sizes="100vw"
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
        {current.title && (
          <div className="pd-lb-caption">
            <span className="pd-lb-counter">
              {index + 1} / {images.length}
            </span>
            <span className="pd-lb-title">{current.title}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .pd-lb {
          position: fixed;
          inset: 0;
          z-index: var(--z-max);
          background: rgba(15, 23, 41, 0.96);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px;
          animation: pd-lb-in 220ms ease-out;
        }
        @keyframes pd-lb-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .pd-lb-close {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(200, 168, 90, 0.32);
          color: rgba(255, 255, 255, 0.94);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pd-lb-close:hover {
          background: rgba(200, 168, 90, 0.22);
          border-color: rgba(200, 168, 90, 0.6);
        }
        .pd-lb-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(200, 168, 90, 0.28);
          color: rgba(255, 255, 255, 0.94);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pd-lb-nav:hover {
          background: rgba(200, 168, 90, 0.22);
          border-color: rgba(200, 168, 90, 0.6);
        }
        .pd-lb-prev { left: 24px; }
        .pd-lb-next { right: 24px; }
        .pd-lb-stage {
          width: 100%;
          max-width: 1400px;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }
        .pd-lb-image-wrap {
          position: relative;
          width: 100%;
          flex: 1;
          min-height: 0;
        }
        .pd-lb-caption {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 10px 18px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(200, 168, 90, 0.32);
          backdrop-filter: blur(8px);
        }
        .pd-lb-counter {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(200, 168, 90, 0.85);
        }
        .pd-lb-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.92);
        }
        @media (max-width: 768px) {
          .pd-lb { padding: 16px; }
          .pd-lb-nav { width: 44px; height: 44px; }
          .pd-lb-prev { left: 12px; }
          .pd-lb-next { right: 12px; }
        }
      `}</style>
    </div>
  );
}
