import Link from "next/link";
import GoBackButton from "../components/GoBackButton"; // İstemci bileşeniniz

export default function RootNotFound() {
  // <html> ve <body> etiketlerini sildik!
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <span className="font-mono text-sm font-bold tracking-[0.5em] text-[#c9a227]">
        ERROR 404
      </span>
      
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
        Sayfa Bulunamadı
      </h1>
      
      <p className="mt-6 max-w-md text-base leading-relaxed opacity-75">
        Üzgünüz, aradığınız sayfa silinmiş veya adresi değiştirilmiş olabilir.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center border border-[#060e1a] bg-[#060e1a] px-8 py-4 font-mono text-xs uppercase tracking-widest text-[#faf8f3] transition-all hover:bg-[#1a2b45]"
        >
          Ana Sayfaya Dön
        </Link>
        
        <GoBackButton />
      </div>
    </div>
  );
}