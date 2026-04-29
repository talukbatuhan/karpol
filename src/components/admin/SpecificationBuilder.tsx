'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { ProductSpecification } from '@/types/database'
import styles from '@/app/admin/admin.module.css'
import { Label, Input, Button } from '@/components/ui'

interface SpecificationBuilderProps {
  value: ProductSpecification[]
  onChange: (specs: ProductSpecification[]) => void
  /** Çoklu tablo düzeninde üst başlığı kısaltır */
  embedded?: boolean
}

export default function SpecificationBuilder({
  value,
  onChange,
  embedded = false,
}: SpecificationBuilderProps) {
  const addRow = () => {
    onChange([...value, { label: '', value: '', unit: '', test_method: '' }])
  }

  const updateRow = (index: number, field: keyof ProductSpecification, text: string) => {
    const updated = [...value]
    updated[index] = { ...updated[index], [field]: text }
    onChange(updated)
  }

  const removeRow = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className={styles.formGroup}>
      <Label className={styles.formLabel}>
        {embedded ? 'Özellik satırları' : 'Teknik Özellikler Tablosu'}
      </Label>
      <div className={styles.dataTable} style={{ marginBottom: 12 }}>
        <table>
          <thead>
            <tr>
              <th>Özellik</th>
              <th>Değer</th>
              <th>Birim</th>
              <th>Test Metodu</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {value.map((spec, index) => (
              <tr key={index}>
                <td>
                  <Input
                    type="text"
                    className={styles.formInput}
                    value={spec.label}
                    onChange={(e) => updateRow(index, 'label', e.target.value)}
                    placeholder="ör. Çekme Dayanımı"
                    style={{ padding: '6px 10px', fontSize: 13 }}
                  />
                </td>
                <td>
                  <Input
                    type="text"
                    className={styles.formInput}
                    value={spec.value}
                    onChange={(e) => updateRow(index, 'value', e.target.value)}
                    placeholder="ör. 45"
                    style={{ padding: '6px 10px', fontSize: 13 }}
                  />
                </td>
                <td>
                  <Input
                    type="text"
                    className={styles.formInput}
                    value={spec.unit || ''}
                    onChange={(e) => updateRow(index, 'unit', e.target.value)}
                    placeholder="ör. MPa"
                    style={{ padding: '6px 10px', fontSize: 13 }}
                  />
                </td>
                <td>
                  <Input
                    type="text"
                    className={styles.formInput}
                    value={spec.test_method || ''}
                    onChange={(e) => updateRow(index, 'test_method', e.target.value)}
                    placeholder="ör. DIN 53504"
                    style={{ padding: '6px 10px', fontSize: 13 }}
                  />
                </td>
                <td>
                  <Button
                    type="button"
                    onClick={() => removeRow(index)}
                    className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
                    style={{ padding: 6 }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button type="button" onClick={addRow} className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}>
        <Plus size={14} /> Satır Ekle
      </Button>
    </div>
  )
}
