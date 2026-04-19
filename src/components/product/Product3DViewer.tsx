"use client";
"use no memo";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Box } from "lucide-react";

export type Product3DSource = {
  glbUrl?: string | null;
  embedUrl?: string | null;
  posterUrl?: string | null;
};

type Product3DViewerProps = {
  source: Product3DSource;
  title?: string;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          poster?: string;
          ar?: boolean;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "shadow-intensity"?: string;
          exposure?: string;
          "environment-image"?: string;
        },
        HTMLElement
      >;
    }
  }
}

export default function Product3DViewer({ source, title = "3D Model" }: Product3DViewerProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (source.glbUrl) {
    return (
      <div className="pd-3d-stage">
        <Script
          type="module"
          src="https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js"
          strategy="lazyOnload"
        />
        {/* @ts-expect-error model-viewer is a web component */}
        <model-viewer
          src={source.glbUrl}
          alt={title}
          camera-controls
          auto-rotate
          shadow-intensity="0.6"
          exposure="1.05"
          poster={source.posterUrl ?? undefined}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
          }}
        />
        <style jsx>{`
          .pd-3d-stage {
            position: relative;
            aspect-ratio: 4 / 3;
            border-radius: 16px;
            overflow: hidden;
            background:
              radial-gradient(ellipse 60% 60% at 50% 50%, rgba(200,168,90,0.08), transparent 70%),
              linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(244, 241, 234, 0.85));
            border: 1px solid rgba(15, 23, 41, 0.08);
          }
        `}</style>
      </div>
    );
  }

  if (source.embedUrl) {
    return (
      <div className="pd-3d-stage">
        {loading && (
          <div className="pd-3d-loading">
            <Box size={28} strokeWidth={1.4} />
            <span>3D model yükleniyor…</span>
          </div>
        )}
        <iframe
          title={title}
          src={source.embedUrl}
          className="pd-3d-frame"
          allow="autoplay; fullscreen; vr; xr-spatial-tracking"
          onLoad={() => setLoading(false)}
        />
        <style jsx>{`
          .pd-3d-stage {
            position: relative;
            aspect-ratio: 4 / 3;
            border-radius: 16px;
            overflow: hidden;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(244, 241, 234, 0.85));
            border: 1px solid rgba(15, 23, 41, 0.08);
          }
          .pd-3d-loading {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            color: rgba(200, 168, 90, 0.85);
            font-family: 'DM Sans', sans-serif;
            font-size: 12px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            z-index: 1;
          }
          .pd-3d-frame {
            width: 100%;
            height: 100%;
            border: none;
            position: relative;
            z-index: 2;
          }
        `}</style>
      </div>
    );
  }

  return null;
}
