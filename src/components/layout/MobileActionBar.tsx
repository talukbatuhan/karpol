"use client";

import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type MobileActionBarProps = {
  onRequestQuote: () => void;
  onWhatsApp: () => void;
  /** Shown on primary; defaults to `MobileActionBar.requestQuote` */
  requestQuoteLabel?: string;
  /** Shown on contact link; defaults to `MobileActionBar.contact` */
  contactLabel?: string;
  /** `aria-label` for WhatsApp control; defaults to `MobileActionBar.whatsappAria` */
  whatsAppAriaLabel?: string;
  className?: string;
};

/**
 * Sticky mobile CTAs: quote (primary), contact link, WhatsApp. Uses `z-dock` (below modals).
 * Hide on `md+` with `className` from the parent, e.g. `md:hidden`.
 */
export default function MobileActionBar({
  onRequestQuote,
  onWhatsApp,
  requestQuoteLabel: requestQuoteLabelProp,
  contactLabel: contactLabelProp,
  whatsAppAriaLabel: whatsAppAriaLabelProp,
  className,
}: MobileActionBarProps) {
  const t = useTranslations("MobileActionBar");
  const requestQuoteLabel = requestQuoteLabelProp ?? t("requestQuote");
  const contactLabel = contactLabelProp ?? t("contact");
  const whatsAppAria = whatsAppAriaLabelProp ?? t("whatsappAria");

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-dock border-t border-[var(--ivory-border)] bg-[var(--ivory-bg)]/95 shadow-nav backdrop-blur-sm",
        "pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 px-3",
        "md:hidden",
        className,
      )}
      aria-label={t("navLabel")}
    >
      <div className="mx-auto flex max-w-[var(--container-max)] items-stretch gap-2">
        <button
          type="button"
          onClick={onRequestQuote}
          className={cn(
            "inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full px-4",
            "bg-[var(--ivory-accent)] text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--ivory-text-strong)]",
            "transition-[transform,background-color,box-shadow] duration-[var(--duration-fast,150ms)] [transition-timing-function:var(--ease-spring,cubic-bezier(0.34,1.56,0.64,1))] touch-manipulation",
            "hover:bg-[var(--ivory-accent-deep)]",
            "active:scale-[0.98] motion-reduce:active:scale-100",
          )}
        >
          <ArrowUpRight size={16} strokeWidth={2} className="shrink-0 opacity-90" aria-hidden />
          {requestQuoteLabel}
        </button>

        <Link
          href="/contact"
          className={cn(
            "touch-target shrink-0 rounded-full border border-[var(--ivory-border-strong)]",
            "px-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--ivory-text-body)]",
            "transition-colors hover:border-[var(--ivory-accent)] hover:bg-[var(--ivory-accent-soft)] hover:text-[var(--ivory-text-strong)]",
          )}
        >
          {contactLabel}
        </Link>

        <button
          type="button"
          onClick={onWhatsApp}
          className={cn(
            "touch-target shrink-0 rounded-full border border-[#128C7E]/35 bg-[#128C7E]/9 text-[#128C7E]",
            "transition-[transform,background-color] duration-150",
            "hover:bg-[#128C7E]/16 active:scale-[0.98] motion-reduce:active:scale-100",
          )}
          aria-label={whatsAppAria}
        >
          <MessageCircle size={20} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </nav>
  );
}
