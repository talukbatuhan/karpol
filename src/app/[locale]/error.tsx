"use client";
"use no memo";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Home, RotateCcw, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function LocalizedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ErrorPage");

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error);
    }
  }, [error]);

  return (
    <main className="er-root">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      <div className="er-bg" aria-hidden="true">
        <div className="er-bg-grid" />
        <div className="er-bg-glow" />
      </div>

      <div className="er-container">
        <div className="er-eyebrow">
          <AlertCircle size={13} strokeWidth={1.6} />
          <span>{t("eyebrow")}</span>
        </div>

        <div className="er-code">{t("code")}</div>

        <h1 className="er-title">
          {t("title")} <em>—</em>
        </h1>

        <p className="er-text">{t("text")}</p>

        {error?.digest && (
          <p className="er-digest">
            <span>ref</span>
            <code>{error.digest}</code>
          </p>
        )}

        <div className="er-actions">
          <button onClick={() => reset()} className="er-btn er-btn-primary">
            <RotateCcw size={14} strokeWidth={1.7} />
            <span>{t("retry")}</span>
          </button>
          <Link href="/" className="er-btn er-btn-ghost">
            <Home size={14} strokeWidth={1.7} />
            <span>{t("home")}</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .er-root {
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
        .er-bg { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
        .er-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(210, 200, 175, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(210, 200, 175, 0.04) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, #000 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, #000 30%, transparent 80%);
        }
        .er-bg-glow {
          position: absolute;
          top: -120px;
          right: -120px;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(180, 90, 70, 0.14), transparent 70%);
          filter: blur(120px);
        }

        .er-container {
          position: relative;
          max-width: 680px;
          width: 100%;
          text-align: center;
        }

        .er-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(220, 175, 165, 0.85);
          margin-bottom: 28px;
          padding: 7px 14px;
          border: 1px solid rgba(220, 175, 165, 0.22);
          border-radius: 999px;
          background: rgba(180, 90, 70, 0.06);
        }

        .er-code {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(110px, 20vw, 200px);
          line-height: 0.95;
          letter-spacing: -0.04em;
          background: linear-gradient(180deg,
            rgba(245, 243, 238, 0.92) 0%,
            rgba(210, 200, 175, 0.5) 60%,
            rgba(160, 140, 110, 0.22) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-bottom: 8px;
          user-select: none;
        }

        .er-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: clamp(26px, 3.6vw, 36px);
          line-height: 1.2;
          color: rgba(245, 243, 238, 0.95);
          margin: 0 auto 18px;
          max-width: 540px;
        }
        .er-title em {
          font-style: italic;
          color: rgba(210, 200, 175, 0.6);
          font-weight: 300;
        }

        .er-text {
          font-size: 15px;
          line-height: 1.7;
          color: rgba(220, 215, 205, 0.62);
          max-width: 480px;
          margin: 0 auto 28px;
        }

        .er-digest {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(210, 200, 175, 0.55);
          margin: 0 auto 32px;
          padding: 6px 12px;
          border-radius: 6px;
          background: rgba(210, 200, 175, 0.04);
          border: 1px solid rgba(210, 200, 175, 0.1);
        }
        .er-digest code {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px;
          color: rgba(235, 230, 220, 0.85);
          letter-spacing: 0.05em;
          text-transform: none;
        }

        .er-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .er-btn {
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
          font-family: inherit;
        }
        .er-btn-primary {
          background: rgba(210, 200, 175, 0.95);
          color: #0a0810;
          border-color: rgba(210, 200, 175, 0.95);
          box-shadow: 0 8px 32px rgba(200, 168, 90, 0.18);
        }
        .er-btn-primary:hover {
          background: rgba(225, 218, 198, 1);
          transform: translateY(-1px);
          box-shadow: 0 12px 40px rgba(200, 168, 90, 0.28);
        }
        .er-btn-ghost {
          background: transparent;
          color: rgba(235, 230, 220, 0.85);
          border-color: rgba(210, 200, 175, 0.22);
        }
        .er-btn-ghost:hover {
          border-color: rgba(210, 200, 175, 0.55);
          background: rgba(210, 200, 175, 0.06);
          color: rgba(245, 243, 238, 0.98);
        }

        @media (max-width: 640px) {
          .er-root { padding: 100px 20px 60px; }
          .er-actions { flex-direction: column; align-items: stretch; }
          .er-btn { justify-content: center; }
        }
      `}</style>
    </main>
  );
}
