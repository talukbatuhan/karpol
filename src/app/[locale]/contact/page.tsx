"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import styles from "./contact.module.css";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ArrowRight,
  CheckCircle,
  Linkedin,
  Instagram,
  Zap,
} from "lucide-react";

/* ── Contact Info Data ───────────────────────────────────── */
const CONTACT_INFO = [
  {
    icon: Mail,
    label: "E-posta",
    value: "info@karpol.com",
    href: "mailto:info@karpol.com",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: "+90 (258) 000 00 00",
    href: "tel:+902580000000",
  },
  {
    icon: MapPin,
    label: "Adres",
    value: "Karpol Poliüretan Ltd.Şti. Bozburun Mahallesi 7151 Sokak No:13/1 Merkezefendi / DENİZLİ",
    href: "https://maps.app.goo.gl/QM9n9MpF1HHvUwuX8",
  },
  {
    icon: Clock,
    label: "Çalışma Saatleri",
    value: "Pzt–Cum: 08:00–18:00",
    href: null,
  },
];

/* ── Form Component ──────────────────────────────────────── */
function ContactForm() {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || "";
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Nodemailer API route'una istek atar
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      name:    (form.elements.namedItem("name")    as HTMLInputElement).value,
      email:   (form.elements.namedItem("email")   as HTMLInputElement).value,
      phone:   (form.elements.namedItem("phone")   as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Bir hata oluştu.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Mesaj gönderilemedi, lütfen tekrar deneyin.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>
          <CheckCircle size={32} />
        </div>
        <h3 className={styles.successTitle}>Mesajınız İletildi!</h3>
        <p className={styles.successText}>
          En kısa sürede size dönüş yapacağız. Ortalama yanıt süremiz 48 saattir.
        </p>
        <button className={styles.resetBtn} onClick={() => setSubmitted(false)}>
          Yeni Mesaj Gönder
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formRow}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>Ad Soyad</label>
          <input
            type="text"
            id="name"
            name="name"
            className={styles.input}
            placeholder="Adınız Soyadınız"
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>E-posta Adresi</label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            placeholder="ornek@sirket.com"
            required
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label htmlFor="phone" className={styles.label}>Telefon</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className={styles.input}
            placeholder="+90 555 123 45 67"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="company" className={styles.label}>Şirket</label>
          <input
            type="text"
            id="company"
            name="company"
            className={styles.input}
            placeholder="Şirket Adı"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="subject" className={styles.label}>Konu</label>
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

      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>Mesajınız</label>
        <textarea
          id="message"
          name="message"
          className={styles.textarea}
          placeholder="Ürün talebiniz veya sorunuz hakkında detaylı bilgi verin..."
          required
        />
      </div>

      {/* ✅ Hata mesajı */}
      {error && (
        <p className={styles.errorText}>{error}</p>
      )}

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? (
          <span className={styles.btnLoading}>
            <span className={styles.spinner} />
            Gönderiliyor...
          </span>
        ) : (
          <>
            <Send size={15} strokeWidth={2} />
            Mesaj Gönder
          </>
        )}
      </button>
    </form>
  );
}

/* ── Map Component ───────────────────────────────────────── */
function MapEmbed() {
  return (
    <div className={styles.mapWrap}>
      <iframe
        // ✅ &maptype=roadmap eklendi — harita 2D düz görünümde açılır
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.235751464937!2d29.071552975844394!3d37.83136640889817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c71514b0e52a19%3A0x89fe5a9197d356c2!2sKarpol%20Poli%C3%BCretan%20-%20Denizli%20Poli%C3%BCretan%20-%20Vulkalon%20-%20Kau%C3%A7uk!5e0!3m2!1str!2str!4v1773314126432!5m2!1str!2str&maptype=roadmap"
        width="100%"
        height="100%"
        style={{ border: 0, display: "block" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Karpol Konum"
      />
      <div className={styles.mapOverlayEdge} />
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function ContactPage() {
  return (
    <main className={styles.page}>

      {/* ─── HERO ───────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroNoise} />
          <div className={styles.heroGrid} />
          <div className={styles.heroGradient} />
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <Zap size={11} />
            <span>İLETİŞİM</span>
          </div>
          <h1 className={styles.heroTitle}>
            Teklif Alın<br />
            <span className={styles.heroTitleAccent}> İletişime Geçin</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Projeleriniz için özel çözümler sunuyoruz.
          </p>
        </div>
      </section>

      {/* ─── MAIN CONTENT ───────────────────────────────── */}
      <section className={styles.main}>
        <div className={styles.container}>
          <div className={styles.mainGrid}>

            {/* Left — Info Panel */}
            <aside className={styles.infoPanel}>
              <div className={styles.infoPanelInner}>
                <h2 className={styles.infoPanelTitle}>Bize Ulaşın</h2>
                <p className={styles.infoPanelDesc}>
                  Ürün talebi, fiyat teklifi veya teknik destek için aşağıdaki kanallardan bize ulaşabilirsiniz.
                </p>

                <div className={styles.contactList}>
                  {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className={styles.contactItem}>
                      <div className={styles.contactIconWrap}>
                        <Icon size={16} strokeWidth={1.75} />
                      </div>
                      <div className={styles.contactItemBody}>
                        <span className={styles.contactLabel}>{label}</span>
                        {href ? (
                          <a href={href} className={styles.contactValue}>{value}</a>
                        ) : (
                          <span className={styles.contactValue}>{value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className={styles.infoDivider} />

                {/* Socials */}
                <div className={styles.infoSocials}>
                  <span className={styles.infoSocialsLabel}>Sosyal Medya</span>
                  <div className={styles.socialBtns}>
                    <a href="#" target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="LinkedIn">
                      <Linkedin size={16} strokeWidth={1.75} />
                      <span>LinkedIn</span>
                    </a>
                    <a href="https://www.instagram.com/karpolpoliuretan/" target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="Instagram">
                      <Instagram size={16} strokeWidth={1.75} />
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>

                {/* Cert */}
                <div className={styles.certBadge}>
                  <span className={styles.certDot} />
                  ISO 9001:2015 Kalite Sertifikası
                </div>
              </div>
            </aside>

            {/* Right — Form */}
            <div className={styles.formPanel}>
              <div className={styles.formPanelHead}>
                <h2 className={styles.formPanelTitle}>Mesaj Gönderin</h2>
                <p className={styles.formPanelDesc}>
                  Tüm alanları doldurun, ekibimiz en kısa sürede size ulaşsın.
                </p>
              </div>
              <Suspense fallback={<div className={styles.formLoading}>Yükleniyor…</div>}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAP ────────────────────────────────────────── */}
      <section className={styles.mapSection}>
        <div className={styles.container}>
          <div className={styles.mapHead}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              Konum
            </div>
            <h2 className={styles.mapTitle}>Fabrikamızı Ziyaret Edin</h2>
            <p className={styles.mapDesc}>
              Denizli Organize Sanayi Bölgesi&apos;nde yer alan üretim tesisimiz, modern ekipman ve geniş kapasite ile hizmetinizdedir.
            </p>
          </div>

          <div className={styles.mapCard}>
            {/* Address strip above map */}
            <div className={styles.mapAddressStrip}>
              <div className={styles.mapAddressItem}>
                <MapPin size={14} strokeWidth={2} />
                <span>Organize Sanayi Bölgesi, Denizli, Türkiye</span>
              </div>
              <a
                href="https://maps.google.com/?q=Karpol+Poliüretan+Denizli"
                target="_blank"
                rel="noreferrer"
                className={styles.mapDirectionsBtn}
              >
                Yol Tarifi Al
                <ArrowRight size={13} strokeWidth={2.5} />
              </a>
            </div>

            <MapEmbed />
          </div>
        </div>
      </section>

    </main>
  );
}