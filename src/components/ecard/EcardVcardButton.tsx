"use client";

import { Contact } from "lucide-react";
import { buildVcard, downloadVcard, type VcardInput } from "@/lib/ecard/vcard";

type EcardVcardButtonProps = {
  vcard: VcardInput;
  filename: string;
  label: string;
};

export function EcardVcardButton({
  vcard,
  filename,
  label,
}: EcardVcardButtonProps) {
  function handleDownload() {
    downloadVcard(buildVcard(vcard), filename);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="group flex w-full items-center justify-center gap-3 border-2 border-navy-950 bg-transparent px-5 py-4 font-sans text-sm font-semibold text-navy-950 transition-colors hover:border-gold-500 hover:bg-navy-950 hover:text-ivory-50"
    >
      <Contact
        className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110"
        aria-hidden
      />
      {label}
    </button>
  );
}
