"use client";
"use no memo";

import { useState } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import RFQModal from "@/components/forms/RFQModal";
import WhatsAppChatModal from "@/components/forms/WhatsAppChatModal";

type RFQModalWrapperProps = {
  productName: string;
  sku?: string;
  /** Korunmuştur (bazı sayfalar hâlâ iletişim sayfası linkine fallback verebilir). */
  contactLink?: string;
  buttonText?: string;
  contactText?: string;
};

export default function RFQModalWrapper({
  productName,
  sku,
  buttonText = "Teklif İste",
  contactText = "Canlı Destek Alın",
}: RFQModalWrapperProps) {
  const [rfqOpen, setRfqOpen] = useState(false);
  const [waOpen, setWaOpen] = useState(false);

  return (
    <>
      <div className="pd-cta-row">
        <button
          type="button"
          onClick={() => setRfqOpen(true)}
          className="pd-btn-primary"
        >
          {buttonText}
          <ArrowUpRight size={14} strokeWidth={1.6} />
        </button>
        <button
          type="button"
          onClick={() => setWaOpen(true)}
          className="pd-btn-secondary"
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

      <style jsx>{`
        .pd-cta-row {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .pd-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
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
