"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  overlayClassName?: string;
  contentClassName?: string;
  contentProps?: React.HTMLAttributes<HTMLDivElement>;
};

export function Modal({
  open,
  onClose,
  children,
  overlayClassName,
  contentClassName,
  contentProps,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(overlayClassName)}
      onClick={(e) => {
        if (
          panelRef.current &&
          !panelRef.current.contains(e.target as Node)
        ) {
          onClose();
        }
      }}
    >
      <div
        ref={panelRef}
        className={cn(contentClassName)}
        {...contentProps}
      >
        {children}
      </div>
    </div>
  );
}
