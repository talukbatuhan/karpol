"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styles from "./contact.module.css";

function ContactForm() {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || "";

  return (
    <form className={styles.formContainer} onSubmit={(e) => e.preventDefault()}>
      <div className={styles.inputGroup}>
        <label htmlFor="name" className={styles.label}>
          Ad Soyad
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className={styles.input}
          placeholder="Adınız Soyadınız"
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>
          E-posta Adresi
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={styles.input}
          placeholder="ornek@sirket.com"
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="phone" className={styles.label}>
          Telefon Numarası
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className={styles.input}
          placeholder="+90 555 123 45 67"
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="subject" className={styles.label}>
          Konu
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          className={styles.input}
          defaultValue={subject}
          placeholder="Mesajınızın konusu"
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="message" className={styles.label}>
          Mesajınız
        </label>
        <textarea
          id="message"
          name="message"
          className={styles.textarea}
          placeholder="Ürün talebiniz veya sorunuz hakkında detaylı bilgi..."
          required
        ></textarea>
      </div>

      <button type="submit" className={styles.submitButton}>
        Gönder
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">İletişim</span>
        <h1 className="section-title">Teklif Alın & İletişime Geçin</h1>
        <p className={styles.infoText}>
          Projeleriniz için özel çözümler sunuyoruz. Aşağıdaki formu doldurarak
          veya doğrudan bize ulaşarak ürünlerimiz hakkında detaylı bilgi ve fiyat
          teklifi alabilirsiniz.
        </p>
        
        <Suspense fallback={<div>Yükleniyor...</div>}>
          <ContactForm />
        </Suspense>
      </div>
    </main>
  );
}
