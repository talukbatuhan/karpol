'use client'

import { Package, ArrowRight, Eye } from 'lucide-react'
import type { LocalizedField } from '@/types/database'

interface ProductCardPreviewProps {
  name: LocalizedField
  shortDescription: LocalizedField
  description: LocalizedField
  images: string[]
  material?: string
  hardness?: string
  hardnessUnit?: string
  sku?: string
  isActive?: boolean
  isFeatured?: boolean
  locale?: 'tr' | 'en'
  onLocaleChange?: (loc: 'tr' | 'en') => void
}

export default function ProductCardPreview({
  name,
  shortDescription,
  description,
  images,
  material,
  hardness,
  hardnessUnit,
  sku,
  isActive = true,
  isFeatured = false,
  locale = 'tr',
  onLocaleChange,
}: ProductCardPreviewProps) {
  const cover = images[0]
  const displayName =
    name[locale] || name.tr || name.en || 'Ürün adı henüz girilmedi'
  const displayDescription =
    shortDescription[locale] ||
    shortDescription.tr ||
    shortDescription.en ||
    description[locale] ||
    description.tr ||
    description.en ||
    ''

  const hardnessLabel =
    hardness && hardnessUnit
      ? `${hardness} ${hardnessUnit}`
      : hardness || undefined

  return (
    <div
      style={{
        position: 'sticky',
        top: 16,
        background: '#FBF8F2',
        border: '1px solid rgba(15, 23, 41, 0.12)',
        borderRadius: 14,
        padding: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#0F1729',
          }}
        >
          <Eye size={12} /> Kart Önizleme
        </div>
        {onLocaleChange && (
          <div
            style={{
              display: 'inline-flex',
              border: '1px solid rgba(15, 23, 41, 0.14)',
              borderRadius: 999,
              overflow: 'hidden',
              background: '#fff',
            }}
          >
            {(['tr', 'en'] as const).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => onLocaleChange(loc)}
                style={{
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  border: 'none',
                  background: locale === loc ? '#0F1729' : 'transparent',
                  color: locale === loc ? '#FBF8F2' : '#475569',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(15, 23, 41, 0.10)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          opacity: isActive ? 1 : 0.55,
        }}
      >
        <div
          style={{
            position: 'relative',
            aspectRatio: '4/3',
            background:
              'linear-gradient(135deg, rgba(244,241,234,0.85), rgba(255,255,255,0.85))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={displayName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                color: '#94A3B8',
              }}
            >
              <Package size={36} />
              <div style={{ fontSize: 11, letterSpacing: '0.08em' }}>
                Görsel yok
              </div>
            </div>
          )}

          {isFeatured && (
            <div
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: '#C8A85A',
                color: '#0F1729',
                fontSize: 10,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 999,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Öne Çıkan
            </div>
          )}

          {!isActive && (
            <div
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'rgba(15, 23, 41, 0.85)',
                color: '#FBF8F2',
                fontSize: 10,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 999,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Pasif
            </div>
          )}
        </div>

        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#0F1729',
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {displayName}
          </h3>
          {displayDescription ? (
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.55,
                color: '#475569',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {displayDescription}
            </p>
          ) : (
            <p
              style={{
                margin: 0,
                fontSize: 12,
                fontStyle: 'italic',
                color: '#94A3B8',
              }}
            >
              Kısa açıklama girilmedi.
            </p>
          )}

          {(material || hardnessLabel) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {material && (
                <span
                  style={{
                    fontSize: 11,
                    padding: '3px 8px',
                    borderRadius: 999,
                    background: 'rgba(200, 168, 90, 0.12)',
                    color: '#B09347',
                    fontWeight: 600,
                  }}
                >
                  {material}
                </span>
              )}
              {hardnessLabel && (
                <span
                  style={{
                    fontSize: 11,
                    padding: '3px 8px',
                    borderRadius: 999,
                    background: 'rgba(15, 23, 41, 0.06)',
                    color: '#0F1729',
                    fontWeight: 600,
                  }}
                >
                  {hardnessLabel}
                </span>
              )}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(15, 23, 41, 0.08)',
              paddingTop: 10,
              marginTop: 4,
              fontSize: 11,
            }}
          >
            <span style={{ color: '#94A3B8', fontFamily: 'monospace' }}>
              SKU: {sku || '—'}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                color: '#C8A85A',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Detay <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 11,
          color: 'var(--text-muted)',
          lineHeight: 1.55,
        }}
      >
        Bu önizleme kategori sayfasındaki kart ile aynı stildedir. Kapak görseli &
        kısa açıklama burada görünür; uzun metin sadece detay sayfasında.
      </div>
    </div>
  )
}
