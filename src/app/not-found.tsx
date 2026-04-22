import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        style={{
          margin: 0,
          background: "#050406",
          color: "rgba(245, 243, 238, 0.92)",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
        }}
      >
        <main className="rnf-root">
          <div className="rnf-bg" aria-hidden="true">
            <div className="rnf-bg-grid" />
            <div className="rnf-bg-glow rnf-bg-glow-1" />
            <div className="rnf-bg-glow rnf-bg-glow-2" />
          </div>

          <div className="rnf-container">
            <div className="rnf-eyebrow">
              <span className="rnf-eyebrow-line" />
              <span>Sayfa Bulunamadı · Page Not Found</span>
            </div>

            <div className="rnf-code">404</div>

            <h1 className="rnf-title">
              Aradığınız sayfa mevcut değil <em>—</em>
            </h1>
            <p className="rnf-text">
              Bu adres taşınmış, kaldırılmış ya da yanlış yazılmış olabilir.
              <br />
              <span className="rnf-text-en">
                This address may have moved, been removed, or been mistyped.
              </span>
            </p>

            <div className="rnf-actions">
              <Link href="/tr" className="rnf-btn rnf-btn-primary">
                Anasayfa
              </Link>
              <Link href="/en" className="rnf-btn rnf-btn-ghost">
                Home
              </Link>
            </div>
          </div>
        </main>

        <style>{`
          .rnf-root {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 80px 24px;
            overflow: hidden;
            isolation: isolate;
          }
          .rnf-bg { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
          .rnf-bg-grid {
            position: absolute;
            inset: 0;
            background-image:
              linear-gradient(rgba(210, 200, 175, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(210, 200, 175, 0.04) 1px, transparent 1px);
            background-size: 64px 64px;
            -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, #000 30%, transparent 80%);
                    mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, #000 30%, transparent 80%);
          }
          .rnf-bg-glow {
            position: absolute;
            border-radius: 50%;
            filter: blur(120px);
            opacity: 0.5;
          }
          .rnf-bg-glow-1 {
            top: -120px; left: -120px;
            width: 480px; height: 480px;
            background: radial-gradient(circle, rgba(200, 168, 90, 0.18), transparent 70%);
          }
          .rnf-bg-glow-2 {
            bottom: -160px; right: -120px;
            width: 520px; height: 520px;
            background: radial-gradient(circle, rgba(160, 140, 110, 0.14), transparent 70%);
          }
          .rnf-container {
            position: relative;
            max-width: 720px;
            width: 100%;
            text-align: center;
          }
          .rnf-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            font-size: 11px;
            letter-spacing: 0.24em;
            text-transform: uppercase;
            color: rgba(210, 200, 175, 0.82);
            margin-bottom: 32px;
            font-weight: 500;
          }
          .rnf-eyebrow-line {
            width: 28px; height: 1px;
            background: rgba(200, 185, 160, 0.55);
          }
          .rnf-code {
            font-family: Georgia, 'Cormorant Garamond', serif;
            font-weight: 300;
            font-size: clamp(120px, 22vw, 220px);
            line-height: 0.95;
            letter-spacing: -0.04em;
            background: linear-gradient(180deg,
              rgba(245, 243, 238, 0.95) 0%,
              rgba(210, 200, 175, 0.55) 60%,
              rgba(160, 140, 110, 0.25) 100%);
            -webkit-background-clip: text;
                    background-clip: text;
            color: transparent;
            margin-bottom: 8px;
            user-select: none;
          }
          .rnf-title {
            font-family: Georgia, 'Cormorant Garamond', serif;
            font-weight: 400;
            font-size: clamp(26px, 3.6vw, 36px);
            line-height: 1.2;
            color: rgba(245, 243, 238, 0.95);
            margin: 0 auto 18px;
            max-width: 540px;
          }
          .rnf-title em {
            font-style: italic;
            color: rgba(210, 200, 175, 0.6);
            font-weight: 300;
          }
          .rnf-text {
            font-size: 15px;
            line-height: 1.7;
            color: rgba(220, 215, 205, 0.66);
            max-width: 520px;
            margin: 0 auto 40px;
          }
          .rnf-text-en {
            color: rgba(210, 200, 175, 0.5);
            font-style: italic;
            font-size: 13px;
          }
          .rnf-actions {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
          }
          .rnf-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 13px 28px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
            text-decoration: none;
            cursor: pointer;
            border: 1px solid transparent;
          }
          .rnf-btn-primary {
            background: rgba(210, 200, 175, 0.95);
            color: #0a0810;
            border-color: rgba(210, 200, 175, 0.95);
            box-shadow: 0 8px 32px rgba(200, 168, 90, 0.18);
          }
          .rnf-btn-primary:hover {
            background: rgba(225, 218, 198, 1);
            transform: translateY(-1px);
          }
          .rnf-btn-ghost {
            background: transparent;
            color: rgba(235, 230, 220, 0.85);
            border-color: rgba(210, 200, 175, 0.22);
          }
          .rnf-btn-ghost:hover {
            border-color: rgba(210, 200, 175, 0.55);
            background: rgba(210, 200, 175, 0.06);
          }
          @media (max-width: 640px) {
            .rnf-actions { flex-direction: column; align-items: stretch; }
            .rnf-btn { justify-content: center; }
          }
        `}</style>
      </body>
    </html>
  );
}
