'use client'

import { useCallback } from 'react'
import styles from './hasankara.module.css'

const contact = {
  firstName: 'Hasan',
  lastName: 'Kara',
  organization: 'Karpol Poliüretan',
  title: 'Yetkili',
  phone: '+90 542 665 25 60',
  email: 'hasankara2022@gmail.com',
  website: 'https://karpol.net',
  address: 'Türkiye',
}

function createVCard(data: typeof contact) {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${data.lastName};${data.firstName}`,
    `FN:${data.firstName} ${data.lastName}`,
    `ORG:${data.organization}`,
    `TITLE:${data.title}`,
    `TEL;TYPE=CELL:${data.phone}`,
    `EMAIL:${data.email}`,
    `URL:${data.website}`,
    `ADR:;;${data.address}`,
    'END:VCARD',
  ].join('\n')
}

export default function HasankaraPage() {
  const saveContact = useCallback(() => {
    const blob = new Blob([createVCard(contact)], { type: 'text/vcard' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hasan-kara.vcf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <div className={styles.center}>
          <div className={styles.logo}>K</div>
          <h1 className={styles.title}>Hasan Kara</h1>
          <div className={styles.subtitle}>Karpol Poliüretan</div>
          <p className={styles.intro}>
            İş birlikleri ve hızlı iletişim için aşağıdaki kanallardan doğrudan
            ulaşabilirsiniz.
          </p>
        </div>

        <div className={styles.primaryActions}>
          <a
            className={`${styles.btn} ${styles.btnPrimary}`}
            href="tel:+905426652560"
          >
            <span className={styles.btnLabel}>
              <span>Telefon</span>
              <small>Hızlı arama</small>
            </span>
            <span className={styles.arrow}>↗</span>
          </a>

          <button type="button" className={styles.btn} onClick={saveContact}>
            <span className={styles.btnLabel}>
              <span>Rehbere Ekle</span>
              <small>vCard indir</small>
            </span>
            <span className={styles.arrow}>↓</span>
          </button>
        </div>

        <div className={styles.secondaryActions}>
          <a
            className={styles.btn}
            href="https://wa.me/905426652560"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.btnLabel}>
              <span>WhatsApp</span>
              <small>Mesaj gönder</small>
            </span>
            <span className={styles.arrow}>↗</span>
          </a>

          <a className={styles.btn} href="mailto:hasankara2022@gmail.com">
            <span className={styles.btnLabel}>
              <span>E-posta</span>
              <small>Doğrudan iletişim</small>
            </span>
            <span className={styles.arrow}>↗</span>
          </a>

          <a
            className={styles.btn}
            href="https://karpol.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.btnLabel}>
              <span>Web Sitesi</span>
              <small>Kurumsal sayfa</small>
            </span>
            <span className={styles.arrow}>↗</span>
          </a>

          <a
            className={styles.btn}
            href="https://maps.app.goo.gl/BJtTd55YmLtEbgXh9"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.btnLabel}>
              <span>Konum</span>
              <small>Haritada aç</small>
            </span>
            <span className={styles.arrow}>↗</span>
          </a>

          <a
            className={styles.btn}
            href="https://www.youtube.com/@karpolpoliuretan"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.btnLabel}>
              <span>YouTube</span>
              <small>Kanalı görüntüle</small>
            </span>
            <span className={styles.arrow}>↗</span>
          </a>
        </div>

        <div className={styles.meta}>
          karpol.net
          <br />
          Resmî kurumsal iletişim sayfası
        </div>
      </div>
    </div>
  )
}
