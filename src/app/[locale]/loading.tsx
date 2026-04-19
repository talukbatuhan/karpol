"use client";
"use no memo";

import { useTranslations } from "next-intl";

export default function LocalizedLoading() {
  const t = useTranslations("Loading");

  return (
    <main className="ld-root" aria-busy="true" aria-live="polite">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <div className="ld-bg" aria-hidden="true">
        <div className="ld-bg-grid" />
        <div className="ld-bg-glow" />
      </div>

      <div className="ld-container">
        <div className="ld-eyebrow">
          <span className="ld-eyebrow-line" />
          <span>{t("label")}</span>
        </div>

        <div className="ld-mark" aria-hidden="true">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle
              cx="28"
              cy="28"
              r="22"
              stroke="rgba(210, 200, 175, 0.12)"
              strokeWidth="1.5"
            />
            <circle
              cx="28"
              cy="28"
              r="22"
              stroke="rgba(210, 200, 175, 0.85)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="20 120"
              className="ld-spinner-arc"
            />
          </svg>
        </div>

        <h2 className="ld-title">
          {t("text")} <em>—</em>
        </h2>

        <div className="ld-skeletons" aria-hidden="true">
          <span className="ld-skeleton" style={{ width: "60%" }} />
          <span className="ld-skeleton" style={{ width: "85%" }} />
          <span className="ld-skeleton" style={{ width: "45%" }} />
        </div>
      </div>

      <style jsx>{`
        .ld-root {
          position: relative;
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 24px 80px;
          background: #050406;
          color: rgba(245, 243, 238, 0.9);
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          isolation: isolate;
        }
        .ld-bg {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
        }
        .ld-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(210, 200, 175, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(210, 200, 175, 0.04) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, #000 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, #000 30%, transparent 80%);
        }
        .ld-bg-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(200, 168, 90, 0.10), transparent 70%);
          filter: blur(100px);
          animation: ld-pulse 3.4s ease-in-out infinite;
        }

        .ld-container {
          position: relative;
          max-width: 520px;
          width: 100%;
          text-align: center;
        }

        .ld-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(210, 200, 175, 0.78);
          margin-bottom: 28px;
        }
        .ld-eyebrow-line {
          width: 28px;
          height: 1px;
          background: rgba(200, 185, 160, 0.5);
        }

        .ld-mark {
          display: inline-flex;
          margin-bottom: 24px;
        }
        .ld-spinner-arc {
          transform-origin: 28px 28px;
          animation: ld-spin 1.4s linear infinite;
        }

        .ld-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: clamp(22px, 3.2vw, 30px);
          line-height: 1.2;
          color: rgba(245, 243, 238, 0.95);
          margin: 0 auto 36px;
        }
        .ld-title em {
          font-style: italic;
          color: rgba(210, 200, 175, 0.6);
          font-weight: 300;
        }

        .ld-skeletons {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          max-width: 420px;
          margin: 0 auto;
        }
        .ld-skeleton {
          display: block;
          height: 10px;
          border-radius: 6px;
          background: linear-gradient(
            90deg,
            rgba(210, 200, 175, 0.06) 0%,
            rgba(210, 200, 175, 0.18) 50%,
            rgba(210, 200, 175, 0.06) 100%
          );
          background-size: 200% 100%;
          animation: ld-shimmer 1.6s linear infinite;
        }

        @keyframes ld-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ld-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes ld-pulse {
          0%, 100% { opacity: 0.65; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.06); }
        }
      `}</style>
    </main>
  );
}
