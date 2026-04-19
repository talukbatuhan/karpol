'use client'

import {
  ListChecks,
  Ruler,
  DraftingCompass,
  Box,
  Images,
  FileText,
  Wrench,
} from 'lucide-react'
import type { ProductModules } from '@/types/database'
import styles from '@/app/admin/admin.module.css'

interface ModuleToggleBarProps {
  value: ProductModules
  onChange: (modules: ProductModules) => void
}

type ModuleKey = keyof ProductModules

const MODULE_META: Array<{
  key: ModuleKey
  label: string
  icon: typeof ListChecks
  hint: string
}> = [
  {
    key: 'specifications',
    label: 'Teknik Tablo',
    icon: ListChecks,
    hint: 'Mekanik, kimyasal, termal özellikler',
  },
  {
    key: 'size_table',
    label: 'Ölçü Tablosu',
    icon: Ruler,
    hint: 'Ebat, çap, genişlik gibi boyutlar',
  },
  {
    key: 'technical_drawing',
    label: 'Teknik Resim',
    icon: DraftingCompass,
    hint: 'Montaj çizimleri, ölçü resimleri',
  },
  {
    key: 'model_3d',
    label: '3D Model',
    icon: Box,
    hint: 'GLB (viewer) + STP (indirme)',
  },
  {
    key: 'gallery',
    label: 'Görsel Galerisi',
    icon: Images,
    hint: 'Çoklu fotoğraf, uygulama görselleri',
  },
  {
    key: 'datasheet',
    label: 'Datasheet',
    icon: FileText,
    hint: 'PDF teknik dokümanlar',
  },
  {
    key: 'applications',
    label: 'Uygulama Alanları',
    icon: Wrench,
    hint: 'Ürünün kullanıldığı sektör/alanlar',
  },
]

export default function ModuleToggleBar({ value, onChange }: ModuleToggleBarProps) {
  const toggle = (key: ModuleKey) => {
    onChange({ ...value, [key]: !value[key] })
  }

  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>
        Ürün Modülleri
        <span style={{ marginLeft: 8, fontWeight: 400, color: 'var(--text-muted)', fontSize: 12 }}>
          (Bu ürün için hangi içerik blokları aktif olsun?)
        </span>
      </label>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 10,
        }}
      >
        {MODULE_META.map(({ key, label, icon: Icon, hint }) => {
          const active = value[key]
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              style={{
                padding: 12,
                borderRadius: 8,
                border: active ? '1px solid #e8611a' : '1px solid var(--border)',
                background: active ? 'rgba(232,97,26,0.08)' : 'var(--bg-surface)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={16} color={active ? '#e8611a' : 'var(--text-muted)'} />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    {label}
                  </span>
                </div>
                <span
                  style={{
                    width: 34,
                    height: 18,
                    borderRadius: 10,
                    background: active ? '#e8611a' : 'var(--border)',
                    position: 'relative',
                    transition: 'background 0.15s',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 2,
                      left: active ? 18 : 2,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: '#fff',
                      transition: 'left 0.15s',
                    }}
                  />
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hint}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
