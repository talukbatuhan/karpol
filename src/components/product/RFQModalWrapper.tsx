"use client";
"use no memo";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import RFQModal from "@/components/forms/RFQModal";

type RFQModalWrapperProps = {
  productName: string;
  sku?: string;
  contactLink: string;
  buttonText?: string;
  contactText?: string;
};

export default function RFQModalWrapper({
  productName,
  sku,
  contactLink,
  buttonText = "Teklif İste",
  contactText = "Mühendise Danış",
}: RFQModalWrapperProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="pd-cta-row">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pd-btn-primary"
        >
          {buttonText}
          <ArrowUpRight size={14} strokeWidth={1.6} />
        </button>
        <Link href={contactLink} className="pd-btn-secondary">
          <MessageCircle size={13} strokeWidth={1.6} />
          {contactText}
        </Link>
      </div>

      <RFQModal
        isOpen={open}
        onClose={() => setOpen(false)}
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
