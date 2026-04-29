"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import RFQModal from "@/components/forms/RFQModal";
import WhatsAppChatModal from "@/components/forms/WhatsAppChatModal";
import MobileActionBar from "@/components/layout/MobileActionBar";

/**
 * RFQ + WhatsApp on pages that do not mount their own MobileActionBar
 * (home, industries, knowledge, products hub, etc.). Hidden on product
 * category/detail (they use CategoryMobileActionBar / RFQModalWrapper).
 */
function shouldHideGlobalActionBar(pathname: string): boolean {
  const p = pathname.replace(/\/$/, "") || "/";
  if (p.startsWith("/admin") || p.startsWith("/hasankara")) return true;
  const parts = p.split("/").filter(Boolean);
  const root = parts[0];
  const isProductsBranch = root === "products" || root === "urunler";
  if (isProductsBranch && parts.length >= 2) return true;
  if (root === "custom-manufacturing" || root === "ozel-uretim") return true;
  return false;
}

export default function GlobalSiteActionBar() {
  const pathname = usePathname();
  const tNav = useTranslations("Navigation");
  const tRfq = useTranslations("GlobalSiteActionBar");
  const [rfqOpen, setRfqOpen] = useState(false);
  const [waOpen, setWaOpen] = useState(false);

  if (shouldHideGlobalActionBar(pathname)) return null;

  return (
    <>
      <RFQModal
        isOpen={rfqOpen}
        onClose={() => setRfqOpen(false)}
        productName={tRfq("defaultProductInterest")}
        sku={undefined}
      />
      <WhatsAppChatModal
        isOpen={waOpen}
        onClose={() => setWaOpen(false)}
        productName={tRfq("defaultProductInterest")}
        sku={undefined}
      />
      <MobileActionBar
        onRequestQuote={() => setRfqOpen(true)}
        onWhatsApp={() => setWaOpen(true)}
        requestQuoteLabel={tRfq("requestQuoteShort")}
        contactLabel={tNav("contact")}
        whatsAppAriaLabel={tRfq("whatsappAria")}
      />
    </>
  );
}
