import { useTranslations } from "next-intl";
import CustomRFQForm from "@/components/forms/CustomRFQForm";
import styles from "./custom.module.css";
import { Link } from "@/i18n/navigation";
import {
  FlaskConical,
  Settings2,
  LayoutGrid,
  Link2,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Zap,
  Clock,
  ShieldCheck,
  Wrench,
} from "lucide-react";

const CAPABILITIES = [
  {
    icon: FlaskConical,
    key: "cap1",
    descKey: "cap1Desc",
    color: "#c8a85a",
  },
  {
    icon: Settings2,
    key: "cap2",
    descKey: "cap2Desc",
    color: "#5b9bd5",
  },
  {
    icon: LayoutGrid,
    key: "cap3",
    descKey: "cap3Desc",
    color: "#6ec6a0",
  },
  {
    icon: Link2,
    key: "cap4",
    descKey: "cap4Desc",
    color: "#e07b3c",
  },
];

const STEPS = ["step1", "step2", "step3", "step4"] as const;

const ADVANTAGES = [
  "ISO 9001 sertifikalı üretim",
  "Covestro & Lanxess ham madde",
  "Prototipten seri üretime",
  "50+ ülkeye ihracat deneyimi",
  "Teknik mühendislik desteği",
  "Hızlı teslim garantisi",
];

export default function CustomManufacturingPage() {
  const t = useTranslations("CustomManufacturing");

  return (
    <main className={styles.page}>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroNoise} />
          <div className={styles.heroGrid} />
          <div className={styles.heroGradient} />
          <div className={styles.heroOrb1} />
          <div className={styles.heroOrb2} />
        </div>

        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <Wrench size={11} />
              <span>ÖZEL ÜRETİM</span>
            </div>

            <h1 className={styles.heroTitle}>
              {t("heroTitle")}
            </h1>

            <p className={styles.heroSubtitle}>{t("heroText")}</p>

            <div className={styles.heroActions}>
              <a href="#quote-form" className={styles.primaryBtn}>
                <span>{t("formTitle")}</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </a>
              <Link href="/products" className={styles.secondaryBtn}>
                Ürünleri Gör
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Advantage pills */}
            <div className={styles.heroPills}>
              {ADVANTAGES.slice(0, 3).map((adv) => (
                <span key={adv} className={styles.heroPill}>
                  <CheckCircle2 size={11} />
                  {adv}
                </span>
              ))}
            </div>
          </div>

          {/* Right side cards */}
          <div className={styles.heroCards}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardIcon}><Clock size={20} strokeWidth={1.5} /></div>
              <div>
                <strong>Hızlı Prototip</strong>
                <span>7–14 iş günü</span>
              </div>
            </div>
            <div className={styles.heroCard}>
              <div className={styles.heroCardIcon}><ShieldCheck size={20} strokeWidth={1.5} /></div>
              <div>
                <strong>Kalite Güvencesi</strong>
                <span>ISO 9001 sertifikalı</span>
              </div>
            </div>
            <div className={styles.heroCard}>
              <div className={styles.heroCardIcon}><Zap size={20} strokeWidth={1.5} /></div>
              <div>
                <strong>Teknik Destek</strong>
                <span>Mühendislik ekibi</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.scrollHint}>
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* ─── CAPABILITIES ─────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              Yeteneklerimiz
            </div>
            <h2 className={styles.sectionTitle}>{t("capabilitiesTitle")}</h2>
            <p className={styles.sectionDesc}>{t("capabilitiesDesc")}</p>
          </div>

          <div className={styles.capGrid}>
            {CAPABILITIES.map(({ icon: Icon, key, descKey, color }, i) => (
              <div
                key={key}
                className={styles.capCard}
                style={{ "--cap-color": color } as React.CSSProperties}
              >
                <div className={styles.capCardTop}>
                  <span className={styles.capNum}>0{i + 1}</span>
                  <div className={styles.capIconWrap}>
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className={styles.capTitle}>{t(key as any)}</h3>
                <p className={styles.capDesc}>{t(descKey as any)}</p>
                <div className={styles.capBar} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS ──────────────────────────────────────── */}
      <section className={styles.processSection}>
        <div className={styles.processBg} />
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              Süreç
            </div>
            <h2 className={styles.sectionTitle} style={{ color: "#f1f5f9" }}>
              {t("processTitle")}
            </h2>
            <p className={styles.sectionDesc}>{t("processDesc")}</p>
          </div>

          <div className={styles.processTrack}>
            {/* Connecting rail */}
            <div className={styles.processRail} />

            {STEPS.map((stepKey, i) => (
              <div key={stepKey} className={styles.processStep}>
                <div className={styles.stepDot}>
                  <span>{i + 1}</span>
                </div>
                <div className={styles.stepCard}>
                  <h4 className={styles.stepTitle}>{t(stepKey as any)}</h4>
                  <p className={styles.stepDesc}>{t(`${stepKey}Desc` as any)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ADVANTAGES ───────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.advantagesGrid}>
            <div className={styles.advantagesLeft}>
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowLine} />
                Neden Karpol?
              </div>
              <h2 className={styles.sectionTitle}>
                Özel Üretimde<br />Güvenilir Partner
              </h2>
              <p className={styles.sectionDesc}>
                25 yılı aşkın deneyimimiz ve dünya standartlarındaki üretim altyapımızla her projenize özel çözüm üretiyoruz.
              </p>
              <Link href="/about" className={styles.outlineBtn}>
                Fabrikamızı Tanıyın
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className={styles.advantagesList}>
              {ADVANTAGES.map((adv, i) => (
                <div key={adv} className={styles.advantageItem} style={{ animationDelay: `${i * 70}ms` }}>
                  <div className={styles.advantageCheck}>
                    <CheckCircle2 size={16} strokeWidth={2} />
                  </div>
                  <span>{adv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── QUOTE FORM ───────────────────────────────────── */}
      <section id="quote-form" className={styles.formSection}>
        <div className={styles.formBg}>
          <div className={styles.formGlow} />
          <div className={styles.formNoise} />
        </div>
        <div className={styles.container}>
          <div className={styles.formHead}>
            <div className={styles.eyebrow} style={{ justifyContent: "center" }}>
              <span className={styles.eyebrowLine} />
              Teklif Al
              <span className={styles.eyebrowLine} />
            </div>
            <h2 className={styles.formTitle}>{t("formTitle")}</h2>
            <p className={styles.formDesc}>{t("formDesc")}</p>
          </div>

          <div className={styles.formWrap}>
            <CustomRFQForm />
          </div>
        </div>
      </section>

    </main>
  );
}