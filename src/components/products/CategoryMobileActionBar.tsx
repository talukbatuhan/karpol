"use client";
"use no memo";

import { useState } from "react";
import RFQModal from "@/components/forms/RFQModal";
import WhatsAppChatModal from "@/components/forms/WhatsAppChatModal";
import MobileActionBar from "@/components/layout/MobileActionBar";

type CategoryMobileActionBarProps = {
  /** Used as RFQ / WhatsApp context when no single SKU is selected */
  categoryName: string;
};

export default function CategoryMobileActionBar({
  categoryName,
}: CategoryMobileActionBarProps) {
  const [rfqOpen, setRfqOpen] = useState(false);
  const [waOpen, setWaOpen] = useState(false);

  return (
    <>
      <MobileActionBar
        onRequestQuote={() => setRfqOpen(true)}
        onWhatsApp={() => setWaOpen(true)}
      />
      <RFQModal
        isOpen={rfqOpen}
        onClose={() => setRfqOpen(false)}
        productName={categoryName}
      />
      <WhatsAppChatModal
        isOpen={waOpen}
        onClose={() => setWaOpen(false)}
        productName={categoryName}
      />
    </>
  );
}
