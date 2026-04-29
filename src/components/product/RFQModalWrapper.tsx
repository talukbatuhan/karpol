"use client";
"use no memo";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import RFQModal from "@/components/forms/RFQModal";
import WhatsAppChatModal from "@/components/forms/WhatsAppChatModal";
import MobileActionBar from "@/components/layout/MobileActionBar";
import { useQuoteList } from "@/contexts/QuoteListContext";

type RFQModalWrapperProps = {
  productId?: string;
  productName: string;
  sku?: string;
  /** Korunmuştur (bazı sayfalar hâlâ iletişim sayfası linkine fallback verebilir). */
  contactLink?: string;
  buttonText?: string;
  contactText?: string;
};

export default function RFQModalWrapper({
  productId,
  productName,
  sku,
  buttonText = "Teklif İste",
  contactText = "Canlı Destek Alın",
}: RFQModalWrapperProps) {
  const tNav = useTranslations("Navigation");
  const [rfqOpen, setRfqOpen] = useState(false);
  const [waOpen, setWaOpen] = useState(false);
  const { addItem, items } = useQuoteList();
  const inList = Boolean(
    items.some((i) => i.productId && productId && i.productId === productId) ||
      (sku ? items.some((i) => i.productSku === sku) : false),
  );

  return (
    <>
      <div className="pd-cta-row">
        {productName && (
          <button
            type="button"
            onClick={() => {
              addItem({
                productId,
                productSku: sku,
                productName: sku ? `${productName} (${sku})` : productName,
              });
            }}
            className="pd-btn-secondary pd-cta-add-list"
            disabled={inList}
            style={{ opacity: inList ? 0.5 : 1 }}
          >
            {inList ? "Listede" : "Teklif listesine ekle"}
          </button>
        )}
        <button
          type="button"
          onClick={() => setRfqOpen(true)}
          className="pd-btn-primary pd-cta-rfq"
        >
          {buttonText}
          <ArrowUpRight size={14} strokeWidth={1.6} />
        </button>
        <button
          type="button"
          onClick={() => setWaOpen(true)}
          className="pd-btn-secondary pd-cta-wa"
        >
          <MessageCircle size={13} strokeWidth={1.6} />
          {contactText}
        </button>
      </div>

      <RFQModal
        isOpen={rfqOpen}
        onClose={() => setRfqOpen(false)}
        productName={productName}
        sku={sku}
      />

      <WhatsAppChatModal
        isOpen={waOpen}
        onClose={() => setWaOpen(false)}
        productName={productName}
        sku={sku}
      />

      <MobileActionBar
        onRequestQuote={() => setRfqOpen(true)}
        onWhatsApp={() => setWaOpen(true)}
        requestQuoteLabel={buttonText}
        contactLabel={tNav("contact")}
        whatsAppAriaLabel={contactText}
      />

      <button
        type="button"
        className="pd-floating-rfq"
        onClick={() => setRfqOpen(true)}
        aria-label={buttonText}
      >
        {buttonText}
        <ArrowUpRight size={14} strokeWidth={1.6} aria-hidden />
      </button>

      <style jsx>{`
        .pd-cta-row {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        /* RFQ + WhatsApp: sticky MobileActionBar on small viewports; keep "add to list" in hero */
        @media (max-width: 767px) {
          .pd-cta-rfq,
          .pd-cta-wa {
            display: none;
          }
        }

        .pd-floating-rfq {
          display: none;
        }
        @media (min-width: 768px) {
          .pd-floating-rfq {
            display: inline-flex;
            position: fixed;
            z-index: var(--z-dock, 30);
            bottom: max(24px, env(safe-area-inset-bottom));
            right: max(24px, env(safe-area-inset-right));
            align-items: center;
            gap: 8px;
            min-height: 48px;
            padding: 12px 20px;
            font-family: 'DM Sans', sans-serif;
            font-size: 12px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            font-weight: 600;
            color: #0F1729;
            background: var(--color-cta, #E8611A);
            border: 1px solid var(--color-cta, #E8611A);
            border-radius: 100px;
            box-shadow: var(--shadow-md, 0 4px 12px rgba(15, 23, 42, 0.12));
            cursor: pointer;
            transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
          }
          .pd-floating-rfq:hover {
            background: var(--color-cta-hover, #C44E0F);
            border-color: var(--color-cta-hover, #C44E0F);
            color: #fff;
          }
          .pd-floating-rfq:focus-visible {
            outline: 2px solid var(--ivory-text-strong, #0F1729);
            outline-offset: 3px;
          }
        }
        .pd-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 44px;
          padding: 12px 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
          background: #C8A85A;
          color: #0F1729;
          border: 1px solid #C8A85A;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .pd-btn-primary:hover {
          background: #B09347;
          border-color: #B09347;
        }
        .pd-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 44px;
          padding: 12px 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
          color: rgba(15, 23, 41, 0.92);
          background: transparent;
          border: 1px solid rgba(15, 23, 41, 0.18);
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .pd-btn-secondary:hover {
          border-color: rgba(200, 168, 90, 0.7);
          background: rgba(200, 168, 90, 0.08);
          color: #0F1729;
        }
      `}</style>
    </>
  );
}
