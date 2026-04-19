"use client";
"use no memo";

import { useTranslations } from "next-intl";
import { ArrowRight, Home, Mail, Package } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function LocalizedNotFound() {
  const t = useTranslations("NotFound");

  return (
    <main className="nf-root">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      <div className="nf-bg" aria-hidden="true">
        <div className="nf-bg-grid" />
        <div className="nf-bg-glow nf-bg-glow-1" />
        <div className="nf-bg-glow nf-bg-glow-2" />
      </div>

      <div className="nf-container">
        <div className="nf-eyebrow">
          <span className="nf-eyebrow-line" />
          <span className="nf-eyebrow-text">{t("eyebrow")}</span>
        </div>

        <div className="nf-code">{t("code")}</div>

        <h1 className="nf-title">
          {t("title")} <em>—</em>
        </h1>

        <p className="nf-text">{t("text")}</p>

        <div className="nf-actions">
          <Link href="/" className="nf-btn nf-btn-primary">
            <Home size={15} strokeWidth={1.7} />
            <span>{t("primaryCta")}</span>
            <ArrowRight size={14} strokeWidth={1.7} />
          </Link>
          <Link href="/products" className="nf-btn nf-btn-ghost">
            <Package size={15} strokeWidth={1.7} />
            <span>{t("secondaryCta")}</span>
          </Link>
          <Link href="/contact" className="nf-btn nf-btn-ghost">
            <Mail size={15} strokeWidth={1.7} />
            <span>{t("tertiaryCta")}</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .nf-root {
          position: relative;
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 24px 80px;
          background: #050406;
          color: rgba(245, 243, 238, 0.92);
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          isolation: isolate;
        }
        .nf-bg {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
        }
        .nf-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(210, 200, 175, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(210, 200, 175, 0.04) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, #000 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, #000 30%, transparent 80%);
        }
        .nf-bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.45;
        }
        .nf-bg-glow-1 {
          top: -120px;
          left: -120px;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, rgba(200, 168, 90, 0.18), transparent 70%);
        }
        .nf-bg-glow-2 {
          bottom: -160px;
          right: -120px;
          width: 520px;
          height: 520px;
          background: radial-gradient(circle, rgba(160, 140, 110, 0.14), transparent 70%);
        }

        .nf-container {
          position: relative;
          max-width: 720px;
          width: 100%;
          text-align: center;
        }

        .nf-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(210, 200, 175, 0.82);
          margin-bottom: 32px;
        }
        .nf-eyebrow-line {
          width: 28px;
          height: 1px;
          background: rgba(200, 185, 160, 0.55);
        }
        .nf-eyebrow-text { font-weight: 500; }

        .nf-code {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(120px, 22vw, 220px);
          line-height: 0.95;
          letter-spacing: -0.04em;
          background: linear-gradient(180deg,
            rgba(245, 243, 238, 0.95) 0%,
            rgba(210, 200, 175, 0.55) 60%,
            rgba(160, 140, 110, 0.25) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-bottom: 8px;
          user-select: none;
        }

        .nf-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: clamp(28px, 4vw, 40px);
          line-height: 1.18;
          letter-spacing: -0.005em;
          color: rgba(245, 243, 238, 0.95);
          margin: 0 auto 18px;
          max-width: 560px;
        }
        .nf-title em {
          font-style: italic;
          color: rgba(210, 200, 175, 0.65);
          font-weight: 300;
        }

        .nf-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          line-height: 1.7;
          color: rgba(220, 215, 205, 0.62);
          max-width: 520px;
          margin: 0 auto 44px;
        }

        .nf-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .nf-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 22px;
          border-radius: 999px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
          text-decoration: none;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .nf-btn-primary {
          background: rgba(210, 200, 175, 0.95);
          color: #0a0810;
          border-color: rgba(210, 200, 175, 0.95);
          box-shadow: 0 8px 32px rgba(200, 168, 90, 0.18);
        }
        .nf-btn-primary:hover {
          background: rgba(225, 218, 198, 1);
          transform: translateY(-1px);
          box-shadow: 0 12px 40px rgba(200, 168, 90, 0.28);
        }
        .nf-btn-ghost {
          background: transparent;
          color: rgba(235, 230, 220, 0.85);
          border-color: rgba(210, 200, 175, 0.22);
        }
        .nf-btn-ghost:hover {
          border-color: rgba(210, 200, 175, 0.55);
          background: rgba(210, 200, 175, 0.06);
          color: rgba(245, 243, 238, 0.98);
        }

        @media (max-width: 640px) {
          .nf-root { padding: 100px 20px 60px; }
          .nf-actions { flex-direction: column; align-items: stretch; }
          .nf-btn { justify-content: center; }
        }
      `}</style>
    </main>
  );
}
