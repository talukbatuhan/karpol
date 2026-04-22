'use client'

import { useState } from 'react'
import { SUPPORTED_LOCALES, LOCALE_LABELS } from '@/lib/i18n-helpers'
import type { LocalizedField, SupportedLocale } from '@/types/database'
import styles from '@/app/admin/admin.module.css'
import { Label, Input, Textarea, Button } from '@/components/ui'

interface I18nFieldEditorProps {
  label: string
  value: LocalizedField
  onChange: (value: LocalizedField) => void
  multiline?: boolean
  required?: boolean
}

export default function I18nFieldEditor({
  label,
  value,
  onChange,
  multiline = false,
  required = false,
}: I18nFieldEditorProps) {
  const [activeLocale, setActiveLocale] = useState<SupportedLocale>('tr')

  const handleChange = (locale: SupportedLocale, text: string) => {
    onChange({ ...value, [locale]: text })
  }

  return (
    <div className={styles.formGroup}>
      <Label className={styles.formLabel}>
        {label} {required && <span style={{ color: '#e8611a' }}>*</span>}
      </Label>

      <div className={styles.localeTabs}>
        {SUPPORTED_LOCALES.map((locale) => {
          const hasContent = !!(value[locale]?.trim())
          return (
            <Button
              key={locale}
              type="button"
              className={`${styles.localeTab} ${activeLocale === locale ? styles.localeTabActive : ''}`}
              onClick={() => setActiveLocale(locale)}
            >
              {LOCALE_LABELS[locale]}
              {hasContent && (
                <span style={{ marginLeft: 4, color: '#2ecc71', fontSize: 10 }}>●</span>
              )}
            </Button>
          )
        })}
      </div>

      {multiline ? (
        <Textarea
          className={styles.formTextarea}
          value={value[activeLocale] || ''}
          onChange={(e) => handleChange(activeLocale, e.target.value)}
          placeholder={`${label} — ${LOCALE_LABELS[activeLocale]}...`}
          dir="ltr"
          required={required && activeLocale === 'tr'}
        />
      ) : (
        <Input
          type="text"
          className={styles.formInput}
          value={value[activeLocale] || ''}
          onChange={(e) => handleChange(activeLocale, e.target.value)}
          placeholder={`${label} — ${LOCALE_LABELS[activeLocale]}...`}
          dir="ltr"
          required={required && activeLocale === 'tr'}
        />
      )}
    </div>
  )
}
