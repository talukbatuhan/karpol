'use client'

import type { CategoryAttributeDefinition } from '@/types/database'
import adminStyles from '@/app/admin/admin.module.css'
import { Label, Input, Select, Button } from '@/components/ui'

type Props = {
  definitions: CategoryAttributeDefinition[]
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  fieldErrors?: Record<string, string>
}

function setKey(
  prev: Record<string, unknown>,
  key: string,
  v: unknown,
): Record<string, unknown> {
  return { ...prev, [key]: v }
}

export default function DynamicStructuredFields({
  definitions,
  value,
  onChange,
  fieldErrors = {},
}: Props) {
  if (definitions.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          margin: '16px 0 4px',
          paddingBottom: 6,
          borderBottom: '1px solid var(--border)',
        }}
      >
        Kategoriye özel nitelikler
      </h2>
      {definitions.map((d) => {
        const v = value[d.key]
        const err = fieldErrors[d.key]
        const label = d.label_tr || d.label_en || d.key
        return (
          <div key={d.id} className={adminStyles.formGroup}>
            <Label className={adminStyles.formLabel}>
              {label}
              {d.unit ? ` (${d.unit})` : ''}
              {d.is_required_for_publish ? (
                <span style={{ color: '#e8611a' }}> *</span>
              ) : null}
            </Label>

            {d.field_type === 'boolean' && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(v)}
                  onChange={(e) => onChange(setKey(value, d.key, e.target.checked))}
                />
                <span style={{ fontSize: 13 }}>Evet</span>
              </label>
            )}

            {d.field_type === 'number' && (
              <Input
                type="number"
                className={adminStyles.formInput}
                value={v === undefined || v === null ? '' : String(v)}
                onChange={(e) => {
                  const raw = e.target.value
                  onChange(
                    setKey(
                      value,
                      d.key,
                      raw === '' ? '' : Number.isFinite(Number(raw)) ? Number(raw) : raw,
                    ),
                  )
                }}
              />
            )}

            {d.field_type === 'text' && (
              <Input
                type="text"
                className={adminStyles.formInput}
                value={v === undefined || v === null ? '' : String(v)}
                onChange={(e) => onChange(setKey(value, d.key, e.target.value))}
              />
            )}

            {d.field_type === 'select' && d.options.length > 0 && (
              <Select
                className={adminStyles.formSelect}
                value={v === undefined || v === null ? '' : String(v)}
                onChange={(e) => onChange(setKey(value, d.key, e.target.value))}
              >
                <option value="">{`— ${label} —`}</option>
                {d.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            )}

            {d.field_type === 'multiselect' && d.options.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {d.options.map((opt) => {
                  const list = Array.isArray(v) ? (v as string[]) : []
                  const on = list.includes(opt)
                  return (
                    <label
                      key={opt}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => {
                          const next = on ? list.filter((x) => x !== opt) : [...list, opt]
                          onChange(setKey(value, d.key, next))
                        }}
                      />
                      <span style={{ fontSize: 13 }}>{opt}</span>
                    </label>
                  )
                })}
                <Button
                  type="button"
                  onClick={() => onChange(setKey(value, d.key, []))}
                  style={{ alignSelf: 'flex-start', fontSize: 11, marginTop: 4 }}
                >
                  Tümünü temizle
                </Button>
              </div>
            )}

            {err && (
              <div style={{ fontSize: 12, color: '#e8611a', marginTop: 4 }}>{err}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
