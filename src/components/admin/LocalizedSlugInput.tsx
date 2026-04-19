'use client'

import { useState } from 'react'
import { Wand2 } from 'lucide-react'
import { SUPPORTED_LOCALES, LOCALE_LABELS, slugify } from '@/lib/i18n-helpers'
import type { LocalizedField, SupportedLocale } from '@/types/database'
import styles from '@/app/admin/admin.module.css'

interface LocalizedSlugInputProps {
  label: string
  value: LocalizedField
  onChange: (value: LocalizedField) => void
  source?: LocalizedField
  required?: boolean
  hint?: string
}

export default function LocalizedSlugInput({
  label,
  value,
  onChange,
  source,
  required = false,
  hint,
}: LocalizedSlugInputProps) {
  const [activeLocale, setActiveLocale] = useState<SupportedLocale>('tr')

  const finalSanitize = (raw: string) =>
    raw
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-')

  // Yazarken sadece çok temel temizlik: boşluğu tireye çevir, büyük harfi
  // küçült. Diğer karakterler (Türkçe harfler, geçici işaretler) blur'a
  // kadar serbest. Bu sayede "kauçuk-bileşen" yazarken cursor zıplamaz.
  const liveTransform = (raw: string) =>
    raw.toLowerCase().replace(/\s+/g, '-')

  const handleChange = (locale: SupportedLocale, raw: string) => {
    onChange({ ...value, [locale]: liveTransform(raw) })
  }

  const handleBlur = (locale: SupportedLocale) => {
    const current = value[locale] ?? ''
    const cleaned = finalSanitize(current)
    if (cleaned !== current) {
      onChange({ ...value, [locale]: cleaned })
    }
  }

  const generateFromSource = () => {
    if (!source) return
    const next: LocalizedField = { ...value }
    for (const locale of SUPPORTED_LOCALES) {
      const sourceText = source[locale]?.trim()
      if (sourceText && !next[locale]?.trim()) {
        next[locale] = slugify(sourceText)
      }
    }
    onChange(next)
  }

  return (
    <div className={styles.formGroup}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <label className={styles.formLabel} style={{ marginBottom: 0 }}>
          {label} {required && <span style={{ color: '#e8611a' }}>*</span>}
        </label>
        {source && (
          <button
            type="button"
            onClick={generateFromSource}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              padding: '4px 8px',
              border: '1px solid var(--border)',
              borderRadius: 6,
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
            title="Ürün adından slug üret"
          >
            <Wand2 size={12} />
            Otomatik üret
          </button>
        )}
      </div>

      <div className={styles.localeTabs}>
        {SUPPORTED_LOCALES.map((locale) => {
          const hasContent = !!(value[locale]?.trim())
          return (
            <button
              key={locale}
              type="button"
              className={`${styles.localeTab} ${activeLocale === locale ? styles.localeTabActive : ''}`}
              onClick={() => setActiveLocale(locale)}
            >
              {LOCALE_LABELS[locale]}
              {hasContent && (
                <span style={{ marginLeft: 4, color: '#2ecc71', fontSize: 10 }}>●</span>
              )}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
            fontSize: 12,
            color: 'var(--text-muted)',
            whiteSpace: 'nowrap',
          }}
        >
          /{activeLocale === 'tr' ? 'tr/urunler' : 'en/products'}/&hellip;/
        </span>
        <input
          type="text"
          className={styles.formInput}
          value={value[activeLocale] || ''}
          onChange={(e) => handleChange(activeLocale, e.target.value)}
          onBlur={() => handleBlur(activeLocale)}
          placeholder={
            activeLocale === 'tr'
              ? 'kaucuk-titresim-takozu-tip-a'
              : 'rubber-vibration-block-type-a'
          }
          dir="ltr"
          required={required && activeLocale === 'tr'}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
      {hint && (
        <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>
          {hint}
        </div>
      )}
    </div>
  )
}
