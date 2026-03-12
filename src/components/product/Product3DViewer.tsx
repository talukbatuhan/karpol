"use client";

import { useState } from "react";
import styles from "@/app/[locale]/products/[category]/[slug]/detail.module.css";

type Product3DViewerProps = {
  embedUrl: string;
  title?: string;
};

export default function Product3DViewer({ embedUrl, title = "3D Model Viewer" }: Product3DViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={styles.mainImageFrame} style={{ padding: 0, overflow: "hidden", background: "#000" }}>
      {isLoading && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          background: "#0f172a"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "12px", fontSize: "24px" }}>🔄</div>
            <div>Loading 3D Model...</div>
          </div>
        </div>
      )}
      <iframe
        title={title}
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: "none", opacity: isLoading ? 0 : 1, transition: "opacity 0.5s" }}
        allow="autoplay; fullscreen; vr"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
