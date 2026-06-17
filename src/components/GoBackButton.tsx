"use client"; // Bu satır en kritik kısımdır.

export default function GoBackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center justify-center border border-[#060e1a] px-8 py-4 font-mono text-xs uppercase tracking-widest transition-all hover:bg-[#eaddce]"
    >
      Geri Git
    </button>
  );
}