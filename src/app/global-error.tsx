"use client";

export interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-[#faf8f3] font-sans text-[#060e1a] antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 py-20">
          <div className="w-full max-w-lg border border-[#0b1f3a] bg-[#f5f0e6] p-10">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#c9a227]">
              Hata
            </p>
            <h1 className="mt-8 text-center text-2xl font-bold">
              Kritik bir hata oluştu
            </h1>
            <p className="mt-4 text-center text-sm text-[#0b1f3a]/85">
              Uygulama beklenmedik şekilde durdu. Lütfen sayfayı yenileyin.
            </p>
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={reset}
                className="border border-[#c9a227] bg-[#060e1a] px-8 py-3 font-mono text-xs uppercase tracking-widest text-[#c9a227]"
              >
                Tekrar dene
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
