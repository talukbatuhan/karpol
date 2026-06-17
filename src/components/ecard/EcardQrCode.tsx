"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type EcardQrCodeProps = {
  url: string;
  label: string;
  hint: string;
};

export function EcardQrCode({ url, label, hint }: EcardQrCodeProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: {
        dark: "#060E1A",
        light: "#FAF8F3",
      },
    })
      .then((result) => {
        if (!cancelled) setDataUrl(result);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div className="flex flex-col items-center gap-3 border-t border-navy-950/10 pt-8">
      <p className="font-mono text-xs uppercase tracking-widest text-navy-800/70">
        {label}
      </p>
      {dataUrl ? (
        <div className="border-4 border-gold-500 bg-ivory-50 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dataUrl}
            alt={hint}
            width={200}
            height={200}
            className="block h-[200px] w-[200px]"
          />
        </div>
      ) : (
        <div
          className="flex h-[200px] w-[200px] items-center justify-center border-4 border-gold-500/40 bg-ivory-100"
          aria-busy="true"
        >
          <span className="font-mono text-xs text-navy-800/50">…</span>
        </div>
      )}
      <p className="max-w-xs text-center font-sans text-sm text-navy-800/75">
        {hint}
      </p>
    </div>
  );
}
