"use client";

import { useState } from "react";
import Link from "next/link";
import RFQModal from "@/components/forms/RFQModal";
import styles from "@/app/[locale]/products/[category]/[slug]/detail.module.css";

type RFQModalWrapperProps = {
  productName: string;
  sku?: string;
  contactLink: string;
  buttonText?: string;
};

export default function RFQModalWrapper({
  productName,
  sku,
  contactLink,
  buttonText = "Get Custom Quote"
}: RFQModalWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={styles.headerActions}>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className={styles.primaryBtn}
          style={{ cursor: "pointer", border: "1px solid #ea580c" }}
        >
          Request Quote
        </button>
        <Link href={contactLink} className={styles.secondaryBtn}>
          Contact Engineer
        </Link>
      </div>

      <RFQModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={productName}
        sku={sku}
      />
    </>
  );
}
