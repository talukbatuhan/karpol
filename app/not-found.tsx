import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="tr">
      <body className="flex min-h-dvh items-center justify-center bg-[#faf8f3] font-sans text-[#060e1a] antialiased">
        <div className="max-w-lg border border-[#0b1f3a] bg-[#f5f0e6] p-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#c9a227]">
            404
          </p>
          <h1 className="mt-6 font-bold text-2xl">Sayfa bulunamadı</h1>
          <p className="mt-3 text-sm opacity-80">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
          <Link
            href="/tr"
            className="mt-8 inline-block border border-[#c9a227] bg-[#060e1a] px-8 py-3 font-mono text-xs uppercase tracking-widest text-[#c9a227]"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </body>
    </html>
  );
}
