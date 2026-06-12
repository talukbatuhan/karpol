"use client";

import Image from "next/image";
import { useState } from "react";

type EcardPortraitProps = {
  name: string;
  photoSrc?: string;
  photoAlt: string;
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function EcardPortrait({ name, photoSrc, photoAlt }: EcardPortraitProps) {
  const [imageError, setImageError] = useState(!photoSrc);
  const initials = getInitials(name);

  return (
    <div className="relative mx-auto h-32 w-32 overflow-hidden border-4 border-gold-500 bg-navy-900 shadow-[0_8px_32px_rgba(6,14,26,0.35)] sm:h-36 sm:w-36">
      {!imageError && photoSrc ? (
        <Image
          src={photoSrc}
          alt={photoAlt}
          fill
          className="object-cover"
          sizes="144px"
          priority
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-800 to-navy-950"
          aria-hidden
        >
          <span className="font-display text-4xl font-extrabold tracking-tight text-gold-500 sm:text-5xl">
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}
